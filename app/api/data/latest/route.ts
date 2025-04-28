import { NextResponse } from "next/server"
import { DataPipeline } from "@/services/data-pipeline"

// This endpoint will serve the latest data from Supabase
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const symbols = searchParams.get("symbols")?.split(",") || ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA"]

    // Initialize data pipeline
    const dataPipeline = new DataPipeline()

    // Get latest data from Supabase
    const data = await dataPipeline.getLatestData(symbols)

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching latest data:", error)
    return NextResponse.json(
      { success: false, message: "Failed to fetch latest data", error: String(error) },
      { status: 500 },
    )
  }
}
