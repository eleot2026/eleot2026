import { NextResponse } from "next/server"
import { DEBUG_SAMPLE_PAYLOADS } from "@/lib/ai/debugSamples"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  return NextResponse.json({ samples: DEBUG_SAMPLE_PAYLOADS })
}

