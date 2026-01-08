import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { isAuthBypassEnabled } from "@/lib/authBypass"
import { Navbar } from "@/components/Navbar"
import { Toaster } from "@/components/ui/toaster"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  if (isAuthBypassEnabled()) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>{children}</main>
        <Toaster />
      </div>
    )
  }

  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>{children}</main>
      <Toaster />
    </div>
  )
}
