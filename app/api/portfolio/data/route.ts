import { NextResponse } from "next/server"
import { fetchPortfolioData } from "@/services/portfolio-service"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get("timeRange") || "1D"

    const data = await fetchPortfolioData(timeRange)

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error in portfolio data API:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
