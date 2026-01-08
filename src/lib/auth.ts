import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import connectDB from "./db"
import User from "@/models/User"

// Validate required environment variables
if (!process.env.NEXTAUTH_SECRET && !process.env.AUTH_SECRET) {
  console.warn("Warning: NEXTAUTH_SECRET is not set. Authentication may not work properly.")
}

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.warn("Warning: Google OAuth credentials are not set. Google login will not work.")
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        await connectDB()

        const user = await User.findOne({ email: credentials.email })

        if (!user || !user.passwordHash) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash)

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await connectDB()

        const existingUser = await User.findOne({ email: user.email })

        if (!existingUser) {
          await User.create({
            name: user.name || "User",
            email: user.email || "",
            role: "supervisor",
          })
        }
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        await connectDB()
        const dbUser = await User.findOne({ email: user.email })
        if (dbUser) {
          token.id = dbUser._id.toString()
          token.role = dbUser.role
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
}

