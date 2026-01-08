import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import connectDB from "@/lib/db"
import Visit from "@/models/Visit"
import VisitEnvScore from "@/models/VisitEnvScore"
import { authOptions } from "@/lib/auth"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const visit = await Visit.findById(params.id)
      .populate("teacherId", "nameAr nameEn subject stage")
      .populate("supervisorId", "name email")

    if (!visit) {
      return NextResponse.json({ error: "Visit not found" }, { status: 404 })
    }

    const scores = await VisitEnvScore.find({ visitId: params.id })

    return NextResponse.json({ visit, scores })
  } catch (error) {
    console.error("Error fetching visit:", error)
    return NextResponse.json({ error: "Failed to fetch visit" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const visit = await Visit.findById(params.id)

    if (!visit) {
      return NextResponse.json({ error: "Visit not found" }, { status: 404 })
    }

    await VisitEnvScore.deleteMany({ visitId: params.id })
    await Visit.findByIdAndDelete(params.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting visit:", error)
    return NextResponse.json({ error: "Failed to delete visit" }, { status: 500 })
  }
}

