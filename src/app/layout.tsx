import type { Metadata } from "next"
import { Inter, Cairo } from "next/font/google"
import "./globals.css"
import { SessionProvider } from "@/components/providers/SessionProvider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const cairo = Cairo({ 
  subsets: ["arabic", "latin"],
  variable: "--font-arabic",
  display: "swap",
})

export const metadata: Metadata = {
  title: "ELEOT 2026 - Smart Observation Tool",
  description: "نظام أداة المراقبة الذكية",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${inter.variable} ${cairo.variable} font-sans`}>
        <SessionProvider>
          {children}
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  )
}

