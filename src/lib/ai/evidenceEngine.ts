import { EVIDENCE_DICTIONARY } from "@/lib/ai/evidenceDictionary"
import { normalizeText } from "@/lib/ai/textNormalize"

type Language = "ar" | "en"

export type EvidenceStrength = "none" | "weak" | "moderate" | "strong"

export type EvidenceResult = {
  termHits: number
  evidenceSnippets: string[]
  evidenceStrength: EvidenceStrength
  evidenceScore: number
  strongHits: number
  weakHits: number
  patternHits: number
  distinctSignals: number
  _debug?: {
    normalizedDescriptionLength: number
    topCandidateSentences: Array<{
      text: string
      keywordMatches: number
      patternMatches: number
      evidenceScore: number
    }>
    matchedSignals: string[]
    reasonIfNoHits:
      | "EMPTY_OR_TOO_SHORT_DESCRIPTION"
      | "NO_SIGNALS_FOR_CRITERION"
      | "NO_MATCH_AFTER_NORMALIZATION"
  }
}

const AR_STOP = new Set([
  "ال",
  "في",
  "من",
  "على",
  "إلى",
  "عن",
  "مع",
  "و",
  "أو",
  "أن",
  "هذا",
  "هذه",
  "ذلك",
  "تلك",
  "تم",
  "كان",
  "كانت",
])
const EN_STOP = new Set([
  "the",
  "and",
  "or",
  "are",
  "was",
  "were",
  "with",
  "from",
  "to",
  "of",
  "in",
  "on",
  "for",
  "a",
  "an",
  "is",
  "it",
  "that",
])

const extractKeyTerms = (label: string, language: Language): string[] => {
  const clean = (label || "")
    .toLowerCase()
    .replace(/[^\w\s\u0600-\u06FF]/g, " ")
    .replace(/\s+/g, " ")
    .trim()

  const parts = clean.split(" ").filter((w) => w.length >= 3)
  const stop = language === "ar" ? AR_STOP : EN_STOP
  return parts.filter((w) => !stop.has(w))
}

const escapeRegExp = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

const splitToSentences = (text: string, language: Language): string[] => {
  const raw = String(text || "")
  const segments = raw
    .split(/[.!?\u061F;\u061B\n]/g)
    .map((segment) => segment.replace(/\s+/g, " ").trim())
    .filter((segment) => segment.length >= 12)

  if (language === "ar") {
    return segments
  }

  return segments
}

const buildKeywordRegex = (term: string, language: Language): RegExp => {
  const escaped = escapeRegExp(term)
  if (language === "ar") {
    return new RegExp(`(^|\\s|[،.؛:!?()\\[\\]{}"'])${escaped}($|\\s|[،.؛:!?()\\[\\]{}"'])`, "g")
  }
  return new RegExp(`\\b${escaped}\\b`, "g")
}

const tokenize = (text: string): string[] => {
  return text
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 0)
}

const jaccardOverlap = (a: string[], b: string[]): number => {
  const setA = new Set(a)
  const setB = new Set(b)
  if (setA.size === 0 || setB.size === 0) return 0
  let intersection = 0
  setA.forEach((token) => {
    if (setB.has(token)) intersection += 1
  })
  const union = setA.size + setB.size - intersection
  return union === 0 ? 0 : intersection / union
}

const isDuplicateSnippet = (snippet: string, existing: string[], language: Language): boolean => {
  const normalized = normalizeText(snippet, language)
  for (const candidate of existing) {
    const normalizedCandidate = normalizeText(candidate, language)
    if (normalized === normalizedCandidate) return true
    if (normalized.includes(normalizedCandidate) || normalizedCandidate.includes(normalized)) return true

    const overlap = jaccardOverlap(
      tokenize(normalized),
      tokenize(normalizedCandidate)
    )
    if (overlap > 0.8) return true
  }
  return false
}

const truncateSentence = (sentence: string): string => {
  if (sentence.length <= 220) return sentence
  const trimmed = sentence.slice(0, 220)
  const lastSpace = trimmed.lastIndexOf(" ")
  if (lastSpace > 0) {
    return `${trimmed.slice(0, lastSpace)}…`
  }
  return `${trimmed}…`
}

export const evaluateEvidence = ({
  text,
  criterionId,
  language,
  label,
  debug,
}: {
  text: string
  criterionId: string
  language: Language
  label?: string
  debug?: boolean
}): EvidenceResult => {
  const normalizedDescription = normalizeText(text, language)
  const entry = EVIDENCE_DICTIONARY[criterionId]

  const strongRaw = entry?.strong?.[language] ?? []
  const weakRaw = entry?.weak?.[language] ?? []
  const patternsRaw = entry?.patterns?.[language] ?? []

  const hasSignalsFromDictionary = strongRaw.length + weakRaw.length + patternsRaw.length > 0
  const fallbackWeak = label ? extractKeyTerms(label, language) : []

  const strong = strongRaw.map((term) => normalizeText(term, language)).filter(Boolean)
  const weak = weakRaw.map((term) => normalizeText(term, language)).filter(Boolean)
  const fallback = fallbackWeak.map((term) => normalizeText(term, language)).filter(Boolean)
  const patterns = patternsRaw.map((pattern) => pattern.toLowerCase()).filter(Boolean)

  const normalizedStrong = Array.from(new Set(strong))
  const normalizedWeak = Array.from(new Set([...weak, ...fallback]))
  const normalizedPatterns = Array.from(new Set(patterns))

  const sentences = splitToSentences(text, language)

  let strongHits = 0
  let weakHits = 0
  let patternHits = 0
  let evidenceScore = 0

  const matchedSignals = new Set<string>()
  const strongSignals = new Set<string>()
  const weakSignals = new Set<string>()
  const patternSignals = new Set<string>()
  const sentenceMatches: Array<{
    text: string
    normalized: string
    keywordMatches: number
    patternMatches: number
    evidenceScore: number
    matchedSignals: string[]
  }> = []

  const hasSignals =
    normalizedStrong.length + normalizedWeak.length + normalizedPatterns.length > 0

  for (const sentence of sentences) {
    const normalizedSentence = normalizeText(sentence, language)
    let keywordMatches = 0
    let patternMatchCount = 0
    const sentenceSignals = new Set<string>()

    for (const term of normalizedStrong) {
      const regex = buildKeywordRegex(term, language)
      regex.lastIndex = 0
      if (regex.test(normalizedSentence)) {
        keywordMatches += 1
        strongSignals.add(term)
        sentenceSignals.add(term)
        matchedSignals.add(term)
      }
    }

    for (const term of normalizedWeak) {
      const regex = buildKeywordRegex(term, language)
      regex.lastIndex = 0
      if (regex.test(normalizedSentence)) {
        keywordMatches += 1
        weakSignals.add(term)
        sentenceSignals.add(term)
        matchedSignals.add(term)
      }
    }

    for (const pattern of normalizedPatterns) {
      try {
        const regex = new RegExp(pattern, "g")
        regex.lastIndex = 0
        if (regex.test(normalizedSentence)) {
          patternMatchCount += 1
          patternSignals.add(pattern)
          sentenceSignals.add(`/${pattern}/`)
          matchedSignals.add(`/${pattern}/`)
        }
      } catch {
        // Ignore invalid regex patterns to keep evaluation stable.
      }
    }

    const sentenceScore = keywordMatches + patternMatchCount * 2
    if (keywordMatches + patternMatchCount > 0) {
      sentenceMatches.push({
        text: sentence,
        normalized: normalizedSentence,
        keywordMatches,
        patternMatches: patternMatchCount,
        evidenceScore: sentenceScore,
        matchedSignals: Array.from(sentenceSignals),
      })
    }
  }

  strongHits = strongSignals.size
  weakHits = weakSignals.size
  patternHits = patternSignals.size

  const distinctSentenceMatches = sentenceMatches.length
  const keywordSignalHits = strongHits + weakHits
  const patternSignalHits = patternHits
  const sentenceBonus = distinctSentenceMatches >= 2 ? 1 : 0
  evidenceScore = keywordSignalHits + patternSignalHits * 2 + sentenceBonus

  const termHits = keywordSignalHits + patternSignalHits

  let evidenceStrength: EvidenceStrength = "none"
  if (evidenceScore >= 6) {
    evidenceStrength = "strong"
  } else if (evidenceScore >= 3) {
    evidenceStrength = "moderate"
  } else if (evidenceScore >= 1) {
    evidenceStrength = "weak"
  }

  const sortedSentences = sentenceMatches
    .slice()
    .sort((a, b) => {
      if (b.evidenceScore !== a.evidenceScore) return b.evidenceScore - a.evidenceScore
      if (b.patternMatches !== a.patternMatches) return b.patternMatches - a.patternMatches
      return b.keywordMatches - a.keywordMatches
    })

  const evidenceSnippets: string[] = []
  for (const candidate of sortedSentences) {
    if (evidenceSnippets.length >= 2) break
    const truncated = truncateSentence(candidate.text.replace(/\s+/g, " ").trim())
    if (!isDuplicateSnippet(truncated, evidenceSnippets, language)) {
      evidenceSnippets.push(truncated)
    }
  }

  let reasonIfNoHits:
    | "EMPTY_OR_TOO_SHORT_DESCRIPTION"
    | "NO_SIGNALS_FOR_CRITERION"
    | "NO_MATCH_AFTER_NORMALIZATION"
    | undefined

  if (termHits === 0) {
    if (normalizedDescription.length < 20 || sentences.length === 0) {
      reasonIfNoHits = "EMPTY_OR_TOO_SHORT_DESCRIPTION"
    } else if (!hasSignalsFromDictionary && !hasSignals) {
      reasonIfNoHits = "NO_SIGNALS_FOR_CRITERION"
    } else {
      reasonIfNoHits = "NO_MATCH_AFTER_NORMALIZATION"
    }
  }

  if (debug) {
    const topCandidateSentences = sortedSentences.slice(0, 3).map((entry) => ({
      text: truncateSentence(entry.text.replace(/\s+/g, " ").trim()),
      keywordMatches: entry.keywordMatches,
      patternMatches: entry.patternMatches,
      evidenceScore: entry.evidenceScore,
    }))

    return {
      termHits,
      evidenceSnippets,
      evidenceStrength,
      evidenceScore,
      strongHits,
      weakHits,
      patternHits,
      distinctSignals: matchedSignals.size,
      _debug: {
        normalizedDescriptionLength: normalizedDescription.length,
        topCandidateSentences,
        matchedSignals: Array.from(matchedSignals),
        reasonIfNoHits: reasonIfNoHits || "NO_MATCH_AFTER_NORMALIZATION",
      },
    }
  }

  return {
    termHits,
    evidenceSnippets,
    evidenceStrength,
    evidenceScore,
    strongHits,
    weakHits,
    patternHits,
    distinctSignals: matchedSignals.size,
  }
}

export const scoreFromEvidence = (strength: EvidenceStrength): number => {
  switch (strength) {
    case "strong":
      return 4
    case "moderate":
      return 3
    case "weak":
      return 2
    default:
      return 1
  }
}
