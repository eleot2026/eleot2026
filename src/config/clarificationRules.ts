import type { EvaluationScore } from "@/utils/evaluation"

export interface AdjustmentAudit {
  criterionId: string
  originalScore: number
  adjustedScore: number
  reason: string
}

export interface ClarificationRulesResult {
  finalScores: EvaluationScore[]
  adjustmentsAudit: AdjustmentAudit[]
}

/**
 * Deterministic rule engine that applies hard bounds based on clarification answers
 * This runs AFTER AI evaluation to ensure scores respect factual clarifications
 */
export const applyClarificationRules = (
  scores: EvaluationScore[],
  clarificationAnswers: Record<string, string>,
  selectedEnvironments: string[]
): ClarificationRulesResult => {
  const finalScores = [...scores]
  const adjustmentsAudit: AdjustmentAudit[] = []

  // Rule: A2_access - Equal access
  if (clarificationAnswers["A2_access"] === "no_unequal") {
    const score = finalScores.find((s) => s.criterionId === "A2")
    if (score && score.score > 2) {
      const original = score.score
      score.score = Math.min(score.score, 2) // Cap at 2 (Emerging)
      adjustmentsAudit.push({
        criterionId: "A2",
        originalScore: original,
        adjustedScore: score.score,
        reason: "Clarification: Unequal access reported",
      })
    }
  } else if (clarificationAnswers["A2_access"] === "yes_equal") {
    const score = finalScores.find((s) => s.criterionId === "A2")
    if (score && score.score < 3) {
      const original = score.score
      score.score = Math.max(score.score, 3) // Minimum 3 (Evident)
      adjustmentsAudit.push({
        criterionId: "A2",
        originalScore: original,
        adjustedScore: score.score,
        reason: "Clarification: Equal access confirmed",
      })
    }
  }

  // Rule: A3_fair - Fair treatment
  if (clarificationAnswers["A3_fair"] === "no_inconsistent") {
    const score = finalScores.find((s) => s.criterionId === "A3")
    if (score && score.score > 2) {
      const original = score.score
      score.score = Math.min(score.score, 2)
      adjustmentsAudit.push({
        criterionId: "A3",
        originalScore: original,
        adjustedScore: score.score,
        reason: "Clarification: Inconsistent treatment reported",
      })
    }
  } else if (clarificationAnswers["A3_fair"] === "yes_fair") {
    const score = finalScores.find((s) => s.criterionId === "A3")
    if (score && score.score < 3) {
      const original = score.score
      score.score = Math.max(score.score, 3)
      adjustmentsAudit.push({
        criterionId: "A3",
        originalScore: original,
        adjustedScore: score.score,
        reason: "Clarification: Fair treatment confirmed",
      })
    }
  }

  // Rule: A4_respect - Respect and empathy
  if (clarificationAnswers["A4_respect"] === "no_not_clear") {
    const score = finalScores.find((s) => s.criterionId === "A4")
    if (score && score.score > 2) {
      const original = score.score
      score.score = Math.min(score.score, 2)
      adjustmentsAudit.push({
        criterionId: "A4",
        originalScore: original,
        adjustedScore: score.score,
        reason: "Clarification: Respect not clearly observed",
      })
    }
  } else if (clarificationAnswers["A4_respect"] === "yes_respect") {
    const score = finalScores.find((s) => s.criterionId === "A4")
    if (score && score.score < 3) {
      const original = score.score
      score.score = Math.max(score.score, 3)
      adjustmentsAudit.push({
        criterionId: "A4",
        originalScore: original,
        adjustedScore: score.score,
        reason: "Clarification: Clear respect confirmed",
      })
    }
  }

  // Rule: B2_challenge - Activity difficulty
  if (clarificationAnswers["B2_challenge"] === "too_easy") {
    const score = finalScores.find((s) => s.criterionId === "B2")
    if (score && score.score > 2) {
      const original = score.score
      score.score = Math.min(score.score, 2)
      adjustmentsAudit.push({
        criterionId: "B2",
        originalScore: original,
        adjustedScore: score.score,
        reason: "Clarification: Activities too easy",
      })
    }
  } else if (clarificationAnswers["B2_challenge"] === "too_difficult") {
    const score = finalScores.find((s) => s.criterionId === "B2")
    if (score && score.score > 2) {
      const original = score.score
      score.score = Math.min(score.score, 2)
      adjustmentsAudit.push({
        criterionId: "B2",
        originalScore: original,
        adjustedScore: score.score,
        reason: "Clarification: Activities too difficult",
      })
    }
  } else if (clarificationAnswers["B2_challenge"] === "yes_challenging") {
    const score = finalScores.find((s) => s.criterionId === "B2")
    if (score && score.score < 3) {
      const original = score.score
      score.score = Math.max(score.score, 3)
      adjustmentsAudit.push({
        criterionId: "B2",
        originalScore: original,
        adjustedScore: score.score,
        reason: "Clarification: Appropriate challenge level confirmed",
      })
    }
  }

  // Rule: C1_intellectual_risk - Safe environment for questions
  if (clarificationAnswers["C1_intellectual_risk"] === "no_not_safe") {
    const score = finalScores.find((s) => s.criterionId === "C1")
    if (score && score.score > 1) {
      const original = score.score
      score.score = Math.min(score.score, 1) // Cap at 1 (Not Observed)
      adjustmentsAudit.push({
        criterionId: "C1",
        originalScore: original,
        adjustedScore: score.score,
        reason: "Clarification: Students did not feel safe to ask questions",
      })
    }
  } else if (clarificationAnswers["C1_intellectual_risk"] === "yes_safe") {
    const score = finalScores.find((s) => s.criterionId === "C1")
    if (score && score.score < 3) {
      const original = score.score
      score.score = Math.max(score.score, 3)
      adjustmentsAudit.push({
        criterionId: "C1",
        originalScore: original,
        adjustedScore: score.score,
        reason: "Clarification: Safe environment for questions confirmed",
      })
    }
  }

  // Ensure all scores are within bounds (1-4)
  finalScores.forEach((score) => {
    if (score.score < 1) score.score = 1
    if (score.score > 4) score.score = 4
  })

  return {
    finalScores,
    adjustmentsAudit,
  }
}


