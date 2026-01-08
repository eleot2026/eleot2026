type Language = "ar" | "en"

const ARABIC_DIACRITICS = /[\u064B-\u065F\u0670\u06D6-\u06ED]/g
const TATWEEL = /\u0640/g

export const normalizeText = (text: string, language: Language): string => {
  const raw = String(text || "")
  if (language === "ar") {
    return raw
      .toLowerCase()
      .replace(ARABIC_DIACRITICS, "")
      .replace(TATWEEL, "")
      .replace(/[أإآ]/g, "ا")
      .replace(/ى/g, "ي")
      .replace(/ة/g, "ه")
      .replace(/\s+/g, " ")
      .trim()
  }

  return raw.toLowerCase().replace(/\s+/g, " ").trim()
}

