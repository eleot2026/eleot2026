"use client"

import { getTranslation, type Language } from "@/lib/i18n"
import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, Settings } from "lucide-react"
import Link from "next/link"

interface HeaderProps {
  title: string
  lang?: Language
}

export const Header = ({ title, lang = "ar" }: HeaderProps) => {
  const { data: session } = useSession()
  const router = useRouter()
  const [currentLang, setCurrentLang] = useState<Language>(lang || "ar")

  const handleLanguageChange = () => {
    const newLang: Language = currentLang === "ar" ? "en" : "ar"
    setCurrentLang(newLang)
    // TODO: Implement language context/provider for global state
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" })
  }

  const handleLogin = () => {
    router.push("/login")
  }

  return (
    <>
      {/* Top Header Bar */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/evaluation" className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">E</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-900">ELEOT 2026</span>
                </div>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLanguageChange}
                className="min-w-[60px]"
              >
                {currentLang === "ar" ? "EN" : "AR"}
              </Button>
              {session?.user ? (
                <>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span>{session.user.name}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 ml-2" />
                    {getTranslation("logout", currentLang)}
                  </Button>
                </>
              ) : (
                <Button variant="outline" size="sm" onClick={handleLogin}>
                  {getTranslation("login", currentLang)}
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Banner Section */}
      <div className="bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 border-b border-blue-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        </div>
      </div>
    </>
  )
}

