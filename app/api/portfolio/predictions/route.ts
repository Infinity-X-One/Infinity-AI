import { NextResponse } from "next/server"
import { fetchPredictions } from "@/services/portfolio-service"

export async function GET() {
  try {
    const predictions = await fetchPredictions()

    return NextResponse.json({ success: true, predictions })
  } catch (error) {
    console.error("Error in portfolio predictions API:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
