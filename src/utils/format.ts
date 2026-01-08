export const formatDate = (date: Date | string): string => {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export const formatScore = (score: number): string => {
  return score.toFixed(1)
}

export const formatPart = (part: string, lang: "ar" | "en" = "ar"): string => {
  const parts: Record<string, { ar: string; en: string }> = {
    start: { ar: "البداية", en: "Start" },
    middle: { ar: "المنتصف", en: "Middle" },
    end: { ar: "النهاية", en: "End" },
  }
  return parts[part]?.[lang] || part
}

