import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Teacher from "@/models/Teacher"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(request: Request) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""

    const query = search
      ? {
          isActive: true,
          $or: [
            { nameAr: { $regex: search, $options: "i" } },
            { nameEn: { $regex: search, $options: "i" } },
          ],
        }
      : { isActive: true }

    const teachers = await Teacher.find(query).sort({ nameAr: 1 }).limit(50)

    return NextResponse.json(teachers)
  } catch (error) {
    console.error("Error fetching teachers:", error)
    return NextResponse.json({ error: "Failed to fetch teachers" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await connectDB()

    const body = await request.json()
    const teacher = await Teacher.create(body)

    return NextResponse.json(teacher, { status: 201 })
  } catch (error) {
    console.error("Error creating teacher:", error)
    return NextResponse.json({ error: "Failed to create teacher" }, { status: 500 })
  }
}

