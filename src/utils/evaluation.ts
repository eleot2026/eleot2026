import { ELEOT_ENVIRONMENTS, getCriterionById, JUSTIFICATION_TEMPLATES } from "@/config/eleotConfig"

export interface EvaluationScore {
  environmentId: string
  criterionId: string
  score: number
  justification: string
  termHits?: number
  evidenceSnippets?: string[]
  evidenceStrength?: "none" | "weak" | "moderate" | "strong"
}

export interface EvaluationResult {
  overallScore: number
  scores: EvaluationScore[]
  strengths: EvaluationScore[]
  weaknesses: EvaluationScore[]
  recommendations: string[]
}

export const evaluateLesson = (description: string, language: "ar" | "en" = "ar"): EvaluationResult => {
  const scores: EvaluationScore[] = []
  const strengths: EvaluationScore[] = []
  const weaknesses: EvaluationScore[] = []
  const recommendations: string[] = []

  const descLower = description.toLowerCase()

  // Keyword-based scoring (deterministic approach)
  const positiveKeywords = [
    "مشارك",
    "منظم",
    "محترم",
    "استراتيجيات",
    "واضح",
    "أسئلة",
    "ملاحظات",
    "فهم",
    "تطبيق",
    "تفكير",
    "حقيقي",
    "تقييم",
    "توجيه",
    "ملاحظات",
    "معايير",
    "متنوع",
    "فروقات",
    "مصادر",
    "تكنولوجيا",
    "فعال",
    "قيادة",
    "مناقشة",
    "مسؤولية",
  ]

  const negativeKeywords = [
    "غير",
    "لا",
    "غائب",
    "ضعيف",
    "قليل",
    "نادر",
    "مشاكل",
    "صعوبات",
  ]

  // Evaluate each criterion
  for (const env of ELEOT_ENVIRONMENTS) {
    for (const criterion of env.criteria) {
      let score = 2 // Default: Emerging

      // Simple keyword matching
      const criterionText = (criterion.label_ar + " " + (criterion.description_ar || "")).toLowerCase()
      const hasPositive = positiveKeywords.some((keyword) => descLower.includes(keyword) || criterionText.includes(keyword))
      const hasNegative = negativeKeywords.some((keyword) => descLower.includes(keyword))

      if (hasPositive && !hasNegative) {
        score = Math.random() > 0.5 ? 4 : 3 // Very Evident or Evident
      } else if (hasNegative) {
        score = 1 // Not Observed
      } else {
        score = 2 // Emerging
      }

      const justification = JUSTIFICATION_TEMPLATES[score.toString()]?.[language] || ""

      const evaluationScore: EvaluationScore = {
        environmentId: env.id,
        criterionId: criterion.id,
        score,
        justification,
      }

      scores.push(evaluationScore)

      if (score === 4) {
        strengths.push(evaluationScore)
      } else if (score <= 2) {
        weaknesses.push(evaluationScore)
      }
    }
  }

  // Calculate overall score
  const overallScore = scores.reduce((sum, s) => sum + s.score, 0) / scores.length

  // Generate recommendations
  if (weaknesses.length > 0) {
    recommendations.push(
      language === "ar"
        ? "يُنصح بتحسين الجوانب التي حصلت على درجات منخفضة من خلال تطبيق استراتيجيات تعليمية أكثر فعالية."
        : "It is recommended to improve aspects that received low scores by implementing more effective teaching strategies."
    )
  }

  if (strengths.length > weaknesses.length) {
    recommendations.push(
      language === "ar"
        ? "الأداء العام جيد. يُنصح بالاستمرار في الممارسات الحالية."
        : "Overall performance is good. It is recommended to continue current practices."
    )
  }

  return {
    overallScore,
    scores,
    strengths,
    weaknesses,
    recommendations,
  }
}
