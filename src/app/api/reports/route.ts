import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import connectDB from "@/lib/db"
import Visit from "@/models/Visit"
import VisitEnvScore from "@/models/VisitEnvScore"
import { authOptions } from "@/lib/auth"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(request: Request) {
  try {
    await connectDB()

    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const teacherId = searchParams.get("teacherId")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const subject = searchParams.get("subject")
    const grade = searchParams.get("grade")

    const query: any = {
      supervisorId: session.user.id,
    }

    if (teacherId) {
      query.teacherId = teacherId
    }

    if (startDate || endDate) {
      query.date = {}
      if (startDate) query.date.$gte = new Date(startDate)
      if (endDate) query.date.$lte = new Date(endDate)
    }

    if (subject) {
      query.subject = subject
    }

    if (grade) {
      query.grade = grade
    }

    const visits = await Visit.find(query)
      .populate("teacherId", "nameAr nameEn")
      .sort({ date: -1 })

    const visitsWithScores = await Promise.all(
      visits.map(async (visit) => {
        const scores = await VisitEnvScore.find({ visitId: visit._id })
        return {
          ...visit.toObject(),
          scores,
        }
      })
    )

    return NextResponse.json(visitsWithScores)
  } catch (error) {
    console.error("Error fetching reports:", error)
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 })
  }
}

