"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { getTranslation, type Language } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { LogOut, User } from "lucide-react"
import { useState } from "react"

interface NavbarProps {
  lang?: Language
}

export const Navbar = ({ lang = "ar" }: NavbarProps) => {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [currentLang, setCurrentLang] = useState<Language>(lang)

  const handleLanguageChange = () => {
    const newLang: Language = currentLang === "ar" ? "en" : "ar"
    setCurrentLang(newLang)
    // TODO: Implement language context/provider
  }

  const navItems = [
    { href: "/evaluation", label: getTranslation("evaluation", currentLang) },
    { href: "/visits", label: getTranslation("visits", currentLang) },
    { href: "/training", label: getTranslation("training", currentLang) },
    { href: "/reports", label: getTranslation("reports", currentLang) },
    { href: "/settings", label: getTranslation("settings", currentLang) },
  ]

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" })
  }

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-8 space-x-reverse">
            <Link href="/evaluation" className="flex items-center">
              <span className="text-2xl font-bold text-primary">ELEOT 2026</span>
            </Link>
            <div className="flex space-x-4 space-x-reverse">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4 space-x-reverse">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLanguageChange}
              className="min-w-[60px]"
            >
              {currentLang === "ar" ? "EN" : "AR"}
            </Button>
            {session?.user && (
              <div className="flex items-center space-x-2 space-x-reverse">
                <User className="h-5 w-5 text-gray-600" />
                <span className="text-sm text-gray-700">{session.user.name}</span>
              </div>
            )}
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 ml-2" />
              {getTranslation("logout", currentLang)}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

