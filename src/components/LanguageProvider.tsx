"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { Language, getDir } from "@/lib/i18n"

interface LanguageContextType {
  lang: Language
  setLang: (lang: Language) => void
  dir: "rtl" | "ltr"
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Language>("ar")

  return (
    <LanguageContext.Provider value={{ lang, setLang, dir: getDir(lang) }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider")
  }
  return context
}

