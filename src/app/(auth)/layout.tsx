import { ReactNode } from "react"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { isAuthBypassEnabled } from "@/lib/authBypass"

export default async function AuthLayout({ children }: { children: ReactNode }) {
  if (isAuthBypassEnabled()) {
    return <>{children}</>
  }

  const session = await getServerSession(authOptions)

  // If authenticated, redirect to evaluation
  if (session) {
    redirect("/evaluation")
  }

  return <>{children}</>
}
