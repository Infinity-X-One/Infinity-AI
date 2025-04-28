import { NextResponse } from "next/server"
import { DataIngestionService } from "@/services/data-ingestion"

// This endpoint will serve as a central data fetching point
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const symbols = searchParams.get("symbols")?.split(",") || ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA"]

    const dataService = new DataIngestionService()

    // In a real implementation, you would fetch API keys securely
    await dataService.initialize({
      marketDataApiKey: process.env.MARKET_DATA_API_KEY || "",
      newsApiKey: process.env.NEWS_API_KEY || "",
      sentimentApiKey: process.env.SENTIMENT_API_KEY || "",
      aiPredictionApiKey: process.env.AI_PREDICTION_API_KEY || "",
    })

    const data = await dataService.fetchAllData(symbols)

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching data:", error)
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 })
  }
}
