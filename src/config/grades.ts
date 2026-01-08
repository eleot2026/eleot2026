export interface Grade {
  value: string
  label_ar: string
  label_en: string
}

export const GRADES: Grade[] = [
  { value: "أول ابتدائي", label_ar: "أول ابتدائي", label_en: "First Primary" },
  { value: "ثاني ابتدائي", label_ar: "ثاني ابتدائي", label_en: "Second Primary" },
  { value: "ثالث ابتدائي", label_ar: "ثالث ابتدائي", label_en: "Third Primary" },
  { value: "رابع ابتدائي", label_ar: "رابع ابتدائي", label_en: "Fourth Primary" },
  { value: "خامس ابتدائي", label_ar: "خامس ابتدائي", label_en: "Fifth Primary" },
  { value: "سادس ابتدائي", label_ar: "سادس ابتدائي", label_en: "Sixth Primary" },
  { value: "أول متوسط", label_ar: "أول متوسط", label_en: "First Intermediate" },
  { value: "ثاني متوسط", label_ar: "ثاني متوسط", label_en: "Second Intermediate" },
  { value: "ثالث متوسط", label_ar: "ثالث متوسط", label_en: "Third Intermediate" },
  { value: "أول ثانوي", label_ar: "أول ثانوي", label_en: "First Secondary" },
  { value: "ثاني ثانوي", label_ar: "ثاني ثانوي", label_en: "Second Secondary" },
  { value: "ثالث ثانوي", label_ar: "ثالث ثانوي", label_en: "Third Secondary" },
]

export const getGradeLabel = (value: string, language: "ar" | "en"): string => {
  const grade = GRADES.find((g) => g.value === value)
  return grade ? (language === "ar" ? grade.label_ar : grade.label_en) : value
}


