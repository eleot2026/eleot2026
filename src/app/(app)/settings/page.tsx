"use client"

import { Header } from "@/components/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getTranslation } from "@/lib/i18n"

export default function SettingsPage() {
  const lang = "ar"

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title={getTranslation("settings", lang)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>الإعدادات</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">صفحة الإعدادات قيد التطوير</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

