import { NextResponse } from "next/server"
import type { Criterion } from "@/config/eleotConfig"
import { ELEOT_ENVIRONMENTS, getCriterionById } from "@/config/eleotConfig"
import { applyClarificationRules } from "@/config/clarificationRules"
import { CLARIFICATION_QUESTIONS } from "@/config/clarificationQuestions"
import { buildImprovement, buildJustification } from "@/lib/ai/narratives"
import { normalizeText } from "@/lib/ai/textNormalize"
import { calculateScoreWithEvidence } from "@/utils/aiService"

/**
 * Normalize criterion ID from various formats (e.g., "D4", "d4", "D4_collaboration") to standard format (e.g., "D4")
 */
const normalizeCriterionId = (key: string): string => {
  const m = key.match(/^([A-G]\d+)/i)
  return m ? m[1].toUpperCase() : key
}

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

interface EvaluateRequest {
  // Accept multiple field names for backward compatibility
  lessonDescription?: string
  observationText?: string
  observation?: string
  text?: string
  selectedEnvironments?: string[]
  environments?: string[]
  language?: "ar" | "en"
  clarifications?: {
    skipped?: boolean
    answers?: Record<string, string>
    submittedAt?: Date
  }
  // Legacy field names
  answers?: Record<string, string>
  clarificationAnswers?: Record<string, string>
}

interface EvaluationOutput {
  scores: Record<string, number>
  justifications: Record<string, string>
  improvements: Record<string, string>
  used_clarifications: string[]
  termHits?: Record<string, number>
  evidenceSnippets?: Record<string, string[]>
  evidenceStrength?: Record<string, "none" | "weak" | "moderate" | "strong">
  evidenceDebug?: Record<string, unknown>
  overall_recommendations: {
    strengths: Array<{ env: string; title: string; evidence: string }>
    weaknesses: Array<{ criterion: string; issue: string; evidence: string }>
    next_steps: string[]
  }
}

const tokenizeSnippet = (text: string) =>
  text
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 0)

const jaccardOverlap = (a: string[], b: string[]) => {
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

const isDuplicateSnippet = (snippet: string, existing: string[], language: "ar" | "en") => {
  const normalized = normalizeText(snippet, language)
  for (const candidate of existing) {
    const normalizedCandidate = normalizeText(candidate, language)
    if (normalized === normalizedCandidate) return true
    if (normalized.includes(normalizedCandidate) || normalizedCandidate.includes(normalized)) return true
    const overlap = jaccardOverlap(tokenizeSnippet(normalized), tokenizeSnippet(normalizedCandidate))
    if (overlap > 0.8) return true
  }
  return false
}

/**
 * Professional ELEOT Evaluation API
 * 
 * Evaluates lesson description according to ELEOT standards with:
 * - Unique justifications per criterion (no repetition)
 * - Evidence-based scoring (from description or clarifications)
 * - Default score = 2 when evidence is unclear
 * - Score = 1 only with clear negative evidence
 * - Score = 4 only with strong, specific evidence
 * - "unknown" in clarifications does not increase scores
 */
export async function POST(request: Request) {
  try {
    const body: any = await request.json()
    
    // Backward compatible field extraction
    const lessonDescription =
      body.lessonDescription ?? body.observationText ?? body.observation ?? body.text ?? ""
    const lessonField =
      body.lessonDescription !== undefined
        ? "lessonDescription"
        : body.observationText !== undefined
          ? "observationText"
          : body.observation !== undefined
            ? "observation"
            : body.text !== undefined
              ? "text"
              : "unknown"
    
    const selectedEnvironments =
      body.selectedEnvironments ?? body.environments ?? []
    
    // Extract language with default
    const language = body.language ?? "ar"
    
    // Extract clarifications with backward compatibility
    let clarifications: { skipped: boolean; answers: Record<string, string> } | undefined = body.clarifications
    
    // Check for legacy answer fields (answers or clarificationAnswers at root level)
    const legacyAnswers = body.answers ?? body.clarificationAnswers
    
    if (!clarifications) {
      // No clarifications object, but might have legacy answers
      if (legacyAnswers && Object.keys(legacyAnswers).length > 0) {
        clarifications = {
          skipped: false,
          answers: legacyAnswers,
        }
      }
    } else {
      // Clarifications object exists, but might need to merge legacy answers
      if (!clarifications.answers && legacyAnswers && Object.keys(legacyAnswers).length > 0) {
        clarifications.answers = legacyAnswers
      }
      // Ensure skipped defaults to false if not provided
      clarifications.skipped = clarifications.skipped ?? false
      // Ensure answers is an object (even if empty)
      clarifications.answers = clarifications.answers ?? {}
    }

    // Validation with improved error message
    if (!lessonDescription || !Array.isArray(selectedEnvironments) || selectedEnvironments.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields: lessonDescription (or observationText/observation/text), selectedEnvironments (or environments)" },
        { status: 400 }
      )
    }

    if (process.env.AI_EVAL_DEBUG === "1") {
      const preview = String(lessonDescription || "").replace(/\s+/g, " ").slice(0, 200)
      const length = String(lessonDescription || "").length
      console.log("[AI_EVAL] Request info:", {
        lessonField,
        textLength: length,
        preview,
        selectedEnvironments,
        language,
      })

      if (lessonDescription === "..." || length < 20) {
        console.log(
          "[AI_EVAL] Warning: description is empty or too short; termHits likely 0 for most criteria."
        )
      }
    }

    // Perform professional evaluation
    const evaluation = performProfessionalEvaluation(
      lessonDescription,
      selectedEnvironments,
      language,
      clarifications
    )

    // Apply deterministic clarification rules (hard bounds)
    const clarificationAnswers = clarifications?.answers || {}
    const scoresArray = Object.entries(evaluation.scores).map(([criterionId, score]) => {
      const base = {
        environmentId: getCriterionById(criterionId)?.id.charAt(0) || "",
        criterionId,
        score,
        justification: evaluation.justifications[criterionId] || "",
        termHits: evaluation.termHits?.[criterionId],
        evidenceSnippets: evaluation.evidenceSnippets?.[criterionId],
        evidenceStrength: evaluation.evidenceStrength?.[criterionId],
      }

      if (process.env.AI_EVAL_DEBUG === "1" && evaluation.evidenceDebug?.[criterionId]) {
        return {
          ...base,
          _debug: evaluation.evidenceDebug[criterionId],
        }
      }

      return base
    })

    const { finalScores, adjustmentsAudit } = applyClarificationRules(
      scoresArray,
      clarificationAnswers,
      selectedEnvironments
    )

    // Update evaluation with adjusted scores
    const finalEvaluation: EvaluationOutput = {
      scores: Object.fromEntries(finalScores.map((s) => [s.criterionId, s.score])),
      justifications: evaluation.justifications,
      improvements: evaluation.improvements,
      used_clarifications: evaluation.used_clarifications,
      overall_recommendations: evaluation.overall_recommendations,
    }

    // Return in both formats: new professional format + legacy format for compatibility
    const professionalResult = {
      scores: finalEvaluation.scores,
      justifications: finalEvaluation.justifications,
      improvements: finalEvaluation.improvements,
      used_clarifications: finalEvaluation.used_clarifications,
      overall_recommendations: finalEvaluation.overall_recommendations,
    }

    // Also include legacy format for backward compatibility
    const legacyResult = {
      overallScore:
        Object.values(finalEvaluation.scores).reduce((sum, s) => sum + s, 0) /
        Object.values(finalEvaluation.scores).length,
      scores: finalScores,
      strengths: finalScores.filter((s) => s.score === 4),
      weaknesses: finalScores.filter((s) => s.score <= 2),
      recommendations: Object.values(finalEvaluation.improvements).concat(
        finalEvaluation.overall_recommendations.next_steps
      ),
      adjustmentsAudit,
      usedClarifications: finalEvaluation.used_clarifications,
    }

    // Return combined result (professional format is primary)
    return NextResponse.json({
      ...professionalResult,
      ...legacyResult, // Include legacy fields for compatibility
    })
  } catch (error) {
    console.error("AI Evaluation error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Evaluation failed" },
      { status: 500 }
    )
  }
}

/**
 * Professional ELEOT 2.0 evaluation function
 * Focus: Observable learner behaviors, not teacher intentions
 * Rule: Conservative scoring when evidence is weak
 */
function performProfessionalEvaluation(
  description: string,
  environments: string[],
  language: "ar" | "en",
  clarifications?: { skipped: boolean; answers: Record<string, string> }
): EvaluationOutput {
  const scores: Record<string, number> = {}
  const justifications: Record<string, string> = {}
  const improvements: Record<string, string> = {}
  const usedClarifications: string[] = []
  const termHits: Record<string, number> = {}
  const evidenceSnippets: Record<string, string[]> = {}
  const evidenceStrength: Record<string, "none" | "weak" | "moderate" | "strong"> = {}
  const evidenceDebug: Record<string, unknown> = {}
  const evidenceByCriterion: Record<string, ReturnType<typeof calculateScoreWithEvidence>["evidence"]> = {}
  const criterionById: Record<string, Criterion> = {}
  const clarificationsByCriterion: Record<
    string,
    { positive: boolean; text: string } | undefined
  > = {}
  const evaluationOrder: string[] = []

  const isArabic = language === "ar"

  // Convert clarification answers to normalized responses object: { A2: "yes", F2: "no", ... }
  // This maps question IDs to criterion IDs with yes/no/unclear values
  const responses: Record<string, string> = {}

  if (clarifications && !clarifications.skipped && clarifications.answers) {
    if (process.env.AI_EVAL_DEBUG === "1") {
      console.log("[AI_EVAL] Processing clarifications:", {
        totalAnswers: Object.keys(clarifications.answers).length,
        sampleAnswers: Object.entries(clarifications.answers).slice(0, 3),
      })
    }

    for (const [questionId, answer] of Object.entries(clarifications.answers)) {
      if (answer === "unknown" || !answer) {
        continue // "unknown" does not increase scores - strict rule
      }

      // Normalize the key to get criterionId (handles both "D4" and "D4_collaboration" formats)
      const normalizedKey = normalizeCriterionId(questionId)
      
      // Find question by criterionId instead of id
      const question = CLARIFICATION_QUESTIONS.find(
        (q) => q.criterionId === normalizedKey
      )
      
      if (question) {
        const criterionId = question.criterionId

        // Normalize answer value to yes/no/unclear
        // Check for positive/yes responses first
        let responseValue: string
        const answerLower = String(answer).toLowerCase().trim()
        
        if (
          answerLower === "yes" ||
          answerLower === "unclear" ||
          answerLower.includes("yes_") ||
          answerLower.includes("_yes") ||
          answerLower.includes("نعم") ||
          answerLower.includes("equal") ||
          answerLower.includes("fair") ||
          answerLower.includes("safe") ||
          answerLower.includes("challenging") ||
          answerLower.includes("smooth") ||
          answerLower.includes("used") ||
          answerLower.includes("followed") ||
          answerLower.includes("true_collaboration") ||
          answerLower.includes("differentiated") ||
          answerLower.includes("supported") ||
          answerLower.includes("active") ||
          answerLower.includes("monitoring") ||
          answerLower.includes("demonstrated") ||
          answerLower.includes("respectful") ||
          answerLower.includes("articulated") ||
          answerLower.includes("quality") ||
          answerLower.includes("higher_order") ||
          answerLower.includes("self_directed") ||
          answerLower.includes("community") ||
          answerLower.includes("positive") ||
          answerLower.includes("predominate") ||
          answerLower.includes("connected") ||
          answerLower.includes("purposeful")
        ) {
          // Check if it's actually "unclear" first
          if (answerLower === "unclear" || answerLower.includes("غير واضح")) {
            responseValue = "unclear"
          } else {
            responseValue = "yes"
          }
        } else if (
          answerLower === "no" ||
          answerLower.includes("no_") ||
          answerLower.includes("_no") ||
          answerLower.includes("لا") ||
          answerLower.includes("unequal") ||
          answerLower.includes("inconsistent") ||
          answerLower.includes("not_safe") ||
          answerLower.includes("too_easy") ||
          answerLower.includes("too_difficult") ||
          answerLower.includes("chaotic") ||
          answerLower.includes("did_not") ||
          answerLower.includes("proximity_only") ||
          answerLower.includes("same_activities") ||
          answerLower.includes("not_clear") ||
          answerLower.includes("not_articulated") ||
          answerLower.includes("low_quality") ||
          answerLower.includes("lower_order") ||
          answerLower.includes("teacher_directed") ||
          answerLower.includes("weak_community") ||
          answerLower.includes("negative") ||
          answerLower.includes("teacher_talks") ||
          answerLower.includes("no_connection") ||
          answerLower.includes("passive") ||
          answerLower.includes("not_monitoring") ||
          answerLower.includes("no_feedback") ||
          answerLower.includes("not_respectful") ||
          answerLower.includes("wasted_time")
        ) {
          responseValue = "no"
        } else {
          responseValue = "unclear"
        }

        responses[criterionId] = responseValue
        usedClarifications.push(normalizedKey) // Use normalized criterionId instead of questionId
        
        if (process.env.AI_EVAL_DEBUG === "1") {
          console.log(
            `[AI_EVAL] Mapped question ${questionId} -> criterion ${criterionId}: "${answer}" -> "${responseValue}"`
          )
        }
      } else {
        if (process.env.AI_EVAL_DEBUG === "1") {
          console.warn(
            `[AI_EVAL] Question not found for key: ${questionId} (normalized: ${normalizedKey})`
          )
        }
      }
    }
  }

  // Debug: Log normalized responses object
  const responsesCount = Object.keys(responses).length
  if (process.env.AI_EVAL_DEBUG === "1") {
    console.log("[AI_EVAL] Normalized responses:", {
      count: responsesCount,
      responses: responsesCount > 0 ? responses : {},
      usedClarifications: usedClarifications.length,
    })
  }

  // Evaluate each criterion in selected environments using Rule-Driven calculateScore
  for (const envId of environments) {
    const env = ELEOT_ENVIRONMENTS.find((e) => e.id === envId)
    if (!env) continue

    for (const criterion of env.criteria) {
      const criterionId = criterion.id

      // Use Rule-Driven calculateScore with responses support
      // Pass null if responses is empty to match function signature
      const { score, evidence } = calculateScoreWithEvidence(
        description,
        criterion,
        language,
        responsesCount > 0 ? responses : null
      )

      scores[criterionId] = score
      termHits[criterionId] = evidence.termHits
      evidenceSnippets[criterionId] = evidence.evidenceSnippets
      evidenceStrength[criterionId] = evidence.evidenceStrength
      evidenceByCriterion[criterionId] = evidence
      criterionById[criterionId] = criterion
      evaluationOrder.push(criterionId)
      if (process.env.AI_EVAL_DEBUG === "1" && evidence._debug) {
        evidenceDebug[criterionId] = evidence._debug
      }

      // Generate unique justification with evidence snippets
      const clarification = responses[criterionId]
        ? {
            positive: responses[criterionId] === "yes",
            text: isArabic
              ? `إجابة التوضيح: ${responses[criterionId] === "yes" ? "نعم" : responses[criterionId] === "no" ? "لا" : "غير واضح"}`
              : `Clarification answer: ${responses[criterionId]}`,
          }
        : undefined
      clarificationsByCriterion[criterionId] = clarification

      // Debug: Log per-criterion scoring
      if (process.env.AI_EVAL_DEBUG === "1") {
        console.log(`[AI_EVAL] Criterion ${criterionId}:`, {
          score,
          anchor: responses[criterionId] || "none",
          termHits: evidence.termHits,
          evidenceStrength: evidence.evidenceStrength,
          evidenceSnippets: evidence.evidenceSnippets.length,
        })
      }

    }
  }

  const seenSnippets: string[] = []
  for (const criterionId of evaluationOrder) {
    const snippets = evidenceSnippets[criterionId] || []
    const filtered: string[] = []
    for (const snippet of snippets) {
      if (!isDuplicateSnippet(snippet, seenSnippets, isArabic ? "ar" : "en")) {
        filtered.push(snippet)
        seenSnippets.push(snippet)
      }
    }
    if (filtered.length === 0 && snippets.length > 0) {
      filtered.push(snippets[0])
      seenSnippets.push(snippets[0])
    }
    evidenceSnippets[criterionId] = filtered
    const evidence = evidenceByCriterion[criterionId]
    if (evidence) {
      evidence.evidenceSnippets = filtered
    }
  }

  for (const criterionId of evaluationOrder) {
    const criterion =
      criterionById[criterionId] ??
      getCriterionById(criterionId) ?? {
        id: criterionId,
        code: criterionId,
        label_ar: criterionId,
        label_en: criterionId,
      }
    const evidence = evidenceByCriterion[criterionId]
    const clarification = clarificationsByCriterion[criterionId]

    if (!criterion || !evidence) {
      continue
    }

    justifications[criterionId] = buildJustification({
      criterion,
      evidence,
      clarification,
      language: isArabic ? "ar" : "en",
    })

    // Generate improvement suggestion
    if (scores[criterionId] <= 2) {
      improvements[criterionId] = buildImprovement({
        criterion,
        language: isArabic ? "ar" : "en",
      })
    }
  }

  // Generate overall recommendations
  const overallRecommendations = generateOverallRecommendations(
    scores,
    justifications,
    environments,
    isArabic
  )

  return {
    scores,
    justifications,
    improvements,
    used_clarifications: usedClarifications,
    termHits,
    evidenceSnippets,
    evidenceStrength,
    evidenceDebug: Object.keys(evidenceDebug).length > 0 ? evidenceDebug : undefined,
    overall_recommendations: overallRecommendations,
  }
}

/**
 * Generate overall recommendations
 */
function generateOverallRecommendations(
  scores: Record<string, number>,
  justifications: Record<string, string>,
  environments: string[],
  isArabic: boolean
): {
  strengths: Array<{ env: string; title: string; evidence: string }>
  weaknesses: Array<{ criterion: string; issue: string; evidence: string }>
  next_steps: string[]
} {
  const strengths: Array<{ env: string; title: string; evidence: string }> = []
  const weaknesses: Array<{ criterion: string; issue: string; evidence: string }> = []
  const nextSteps: string[] = []

  // Group scores by environment
  const envScores: Record<string, Array<{ criterion: string; score: number }>> = {}
  for (const [criterionId, score] of Object.entries(scores)) {
    const env = criterionId.charAt(0)
    if (!envScores[env]) envScores[env] = []
    envScores[env].push({ criterion: criterionId, score })
  }

  // Find strengths (environments with all 4s)
  for (const [env, criteria] of Object.entries(envScores)) {
    if (criteria.every((c) => c.score === 4)) {
      const envObj = ELEOT_ENVIRONMENTS.find((e) => e.id === env)
      strengths.push({
        env,
        title: isArabic ? envObj?.arName || env : envObj?.enName || env,
        evidence: isArabic
          ? `جميع معايير البيئة ${env} حصلت على درجة 4/4`
          : `All criteria in environment ${env} received a score of 4/4`,
      })
    }
  }

  // Find weaknesses (criteria with score 1 or 2)
  for (const [criterionId, score] of Object.entries(scores)) {
    if (score <= 2) {
      const criterion = getCriterionById(criterionId)
      weaknesses.push({
        criterion: criterionId,
        issue: isArabic ? criterion?.label_ar || criterionId : criterion?.label_en || criterionId,
        evidence: justifications[criterionId] || "",
      })
    }
  }

  // Generate next steps
  if (weaknesses.length > 0) {
    if (isArabic) {
      nextSteps.push(
        `التركيز على تحسين ${weaknesses.length} معيار حصل على درجة منخفضة (1 أو 2)`
      )
      nextSteps.push("تطبيق استراتيجيات تعليمية أكثر فعالية في المجالات الضعيفة")
      nextSteps.push("مراقبة التقدم وتحسين الممارسات بناءً على التقييم")
    } else {
      nextSteps.push(`Focus on improving ${weaknesses.length} criteria that received low scores (1 or 2)`)
      nextSteps.push("Apply more effective teaching strategies in weak areas")
      nextSteps.push("Monitor progress and improve practices based on evaluation")
    }
  } else {
    if (isArabic) {
      nextSteps.push("الاستمرار في الممارسات الحالية الفعالة")
      nextSteps.push("تعزيز نقاط القوة والبناء عليها")
    } else {
      nextSteps.push("Continue current effective practices")
      nextSteps.push("Strengthen and build on strengths")
    }
  }

  return { strengths, weaknesses, next_steps: nextSteps }
}
