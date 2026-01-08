import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import connectDB from "@/lib/db"
import Visit from "@/models/Visit"
import VisitEnvScore from "@/models/VisitEnvScore"
import { authOptions } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    await connectDB()

    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const visits = await Visit.find({
      supervisorId: session.user.id,
    })
      .populate("teacherId", "nameAr nameEn")
      .sort({ createdAt: -1 })

    return NextResponse.json(visits)
  } catch (error) {
    console.error("Error fetching visits:", error)
    return NextResponse.json({ error: "Failed to fetch visits" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await connectDB()

    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { scores, ...visitData } = body

    // Handle backward compatibility: if part is string, convert to array
    let partArray = visitData.part
    if (typeof partArray === "string") {
      partArray = [partArray]
    }
    if (!Array.isArray(partArray) || partArray.length === 0) {
      partArray = ["start"] // Default
    }

    // Ensure selectedEnvironments is an array
    const selectedEnvironments = Array.isArray(visitData.selectedEnvironments)
      ? visitData.selectedEnvironments
      : []

    // Build visit object with new fields
    const visitPayload: any = {
      teacherName: visitData.teacherName || "",
      subject: visitData.subject || "",
      grade: visitData.grade || "",
      part: partArray,
      date: visitData.date ? new Date(visitData.date) : new Date(),
      lessonDescription: visitData.lessonDescription || "",
      overallScore: visitData.overallScore || 0,
      language: visitData.language || "ar",
      selectedEnvironments,
      supervisorId: session.user.id,
    }

    // Add optional fields if present
    if (visitData.teacherId) {
      visitPayload.teacherId = visitData.teacherId
    }
    if (visitData.clarifications) {
      visitPayload.clarifications = {
        version: visitData.clarifications.version || "v1",
        skipped: visitData.clarifications.skipped || false,
        answers: visitData.clarifications.answers || {},
        submittedAt: visitData.clarifications.submittedAt
          ? new Date(visitData.clarifications.submittedAt)
          : new Date(),
      }
    }
    if (visitData.auditAdjustments && Array.isArray(visitData.auditAdjustments)) {
      visitPayload.auditAdjustments = visitData.auditAdjustments.map((adj: any) => ({
        ...adj,
        timestamp: adj.timestamp ? new Date(adj.timestamp) : new Date(),
      }))
    }

    const visit = await Visit.create(visitPayload)

    if (scores && Array.isArray(scores)) {
      const visitScores = scores.map((score: any) => ({
        ...score,
        visitId: visit._id,
      }))
      await VisitEnvScore.insertMany(visitScores)
    }

    return NextResponse.json(visit, { status: 201 })
  } catch (error) {
    console.error("Error creating visit:", error)
    return NextResponse.json(
      { error: "Failed to create visit", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

