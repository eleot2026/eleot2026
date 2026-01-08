import type { Criterion } from "@/config/eleotConfig"
import { evaluateEvidence, scoreFromEvidence } from "@/lib/ai/evidenceEngine"

// ---------- ELEOT 2.0 Rule-Driven Scoring Engine (1–4) ----------

// Optional: Anchor from clarification form responses (Yes/No/Unclear)
const scoreFromResponse = (val: string | null | undefined): number | null => {
  if (!val) return null
  const v = String(val).toLowerCase().trim()
  // Check for yes/positive responses
  if (v === "yes" || v.startsWith("yes_") || v.includes("_yes") || v.includes("نعم")) return 4
  // Check for no/negative responses
  if (v === "no" || v.startsWith("no_") || v.includes("_no") || v.includes("لا") || v === "did_not") return 1
  // Check for unclear
  if (v === "unclear" || v.includes("unclear") || v.includes("غير واضح")) return 2
  return null
}

export const calculateScoreWithEvidence = (
  text: string,
  criterion: Criterion,
  language: "ar" | "en",
  responses: Record<string, string> | null = null
): { score: number; baseScore: number; evidence: ReturnType<typeof evaluateEvidence> } => {
  const lang = language === "ar" || language === "en" ? language : "en"
  const label = lang === "ar" ? criterion.label_ar || "" : criterion.label_en || ""

  const evidence = evaluateEvidence({
    text,
    criterionId: criterion.id,
    language: lang,
    label,
    debug: process.env.AI_EVAL_DEBUG === "1",
  })
  const baseScore = scoreFromEvidence(evidence.evidenceStrength)

  const anchor = scoreFromResponse(responses?.[criterion.id])
  let finalScore = baseScore

  if (anchor !== null) {
    if (anchor === 4) {
      finalScore = Math.max(baseScore, 3)
    } else if (anchor === 1) {
      finalScore =
        evidence.evidenceStrength === "none" && evidence.termHits === 0
          ? 1
          : Math.min(2, baseScore)
    }
  }

  if (process.env.AI_EVAL_DEBUG === "1") {
    console.log(`[AI_EVAL] calculateScore(${criterion.id}):`, {
      anchor: anchor !== null ? anchor : "none",
      response: responses?.[criterion.id] || "none",
      baseScore,
      finalScore,
      termHits: evidence.termHits,
      evidenceStrength: evidence.evidenceStrength,
    })
  }

  return {
    score: Math.max(1, Math.min(4, finalScore)),
    baseScore,
    evidence,
  }
}

/**
 * ELEOT 2.0 evidence-based scoring (score only).
 * - Supports optional "responses" map: { A2:"yes", F2:"no", ... }
 */
export const calculateScore = (
  text: string,
  criterion: Criterion,
  language: "ar" | "en",
  responses: Record<string, string> | null = null
): number => {
  return calculateScoreWithEvidence(text, criterion, language, responses).score
}

/**
 * Detect language from text
 */
export const detectLanguage = (text: string): "ar" | "en" => {
  const arabicPattern = /[\u0600-\u06FF]/
  return arabicPattern.test(text) ? "ar" : "en"
}

/**
 * Generate justification for a score
 */
export const generateJustification = (
  score: number,
  criterion: Criterion,
  language: "ar" | "en"
): string => {
  const lang = language === "ar" ? "ar" : "en"
  const criterionText = lang === "ar" ? criterion.label_ar : criterion.label_en

  if (score === 4) {
    return lang === "ar"
      ? `ظهر المعيار "${criterionText}" بوضوح شديد في الحصة مع أدلة قوية ومتكررة.`
      : `The criterion "${criterionText}" was very evident in the lesson with strong and repeated evidence.`
  } else if (score === 3) {
    return lang === "ar"
      ? `ظهر المعيار "${criterionText}" في الحصة لكن بشكل غير مكتمل أو ظهر مرة واحدة.`
      : `The criterion "${criterionText}" appeared in the lesson but incompletely or appeared once.`
  } else if (score === 2) {
    return lang === "ar"
      ? `وصف الحصة لا يحتوي على أدلة كافية لتقييم المعيار "${criterionText}". الحالة الافتراضية عند الغموض.`
      : `The lesson description does not contain sufficient evidence to assess the criterion "${criterionText}". Default state when unclear.`
  } else {
    return lang === "ar"
      ? `لا يوجد دليل على وجود المعيار "${criterionText}" في وصف الحصة، مما يشير إلى عدم ملاحظته.`
      : `No evidence of the criterion "${criterionText}" in the lesson description, indicating it was not observed.`
  }
}

/**
 * Generate recommendations based on results
 */
export const generateRecommendations = (
  results: Array<{ criterion: Criterion; score: number }>,
  language: "ar" | "en"
): string[] => {
  const lang = language === "ar" ? "ar" : "en"
  const recommendations: string[] = []

  const weaknesses = results.filter((r) => r.score <= 2)
  if (weaknesses.length > 0) {
    weaknesses.forEach((weak) => {
      const criterionText = lang === "ar" ? weak.criterion.label_ar : weak.criterion.label_en
      recommendations.push(
        lang === "ar"
          ? `تحسين ${criterionText} (${weak.criterion.id}) - الحالي: ${weak.score}/4. يُنصح بتطبيق استراتيجيات أكثر فعالية.`
          : `Improve ${criterionText} (${weak.criterion.id}) - Current: ${weak.score}/4. Consider implementing more effective strategies.`
      )
    })
  } else {
    recommendations.push(
      lang === "ar"
        ? "الأداء العام جيد. يُنصح بالاستمرار في الممارسات الحالية."
        : "Overall performance is good. It is recommended to continue current practices."
    )
  }

  return recommendations
}

/**
 * Evaluate observation using Rule-Driven scoring
 * @param observationText - The lesson description text
 * @param selectedEnvironments - Array of environment IDs
 * @param responses - Optional map of clarification responses: { A2: "yes", F2: "no", ... }
 */
export const evaluateObservation = async (
  observationText: string,
  selectedEnvironments: string[],
  responses: Record<string, string> | null = null
) => {
  const { ELEOT_ENVIRONMENTS } = await import("@/config/eleotConfig")
  const language = detectLanguage(observationText)
  const results: Array<{
    environmentId: string
    environmentLabel: string
    criterion: Criterion
    score: number
    justification: string
  }> = []

  selectedEnvironments.forEach((envId) => {
    const environment = ELEOT_ENVIRONMENTS.find((e) => e.id === envId)
    if (!environment) return

    environment.criteria.forEach((criterion) => {
      const score = calculateScore(observationText, criterion, language, responses)
      const justification = generateJustification(score, criterion, language)

      results.push({
        environmentId: envId,
        environmentLabel: language === "ar" ? environment.label_ar : environment.label_en,
        criterion,
        score,
        justification,
      })
    })
  })

  const totalScore =
    results.length > 0
      ? Math.round((results.reduce((sum, r) => sum + r.score, 0) / results.length) * 10) / 10
      : 0

  const recommendations = generateRecommendations(results, language)

  return { results, totalScore, recommendations, language }
}
