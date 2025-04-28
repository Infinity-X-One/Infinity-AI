import { NextResponse } from "next/server"
import { DataPipeline } from "@/services/data-pipeline"

// This endpoint will be called by a cron job to update data
export async function POST(request: Request) {
  try {
    // Get API keys from environment variables
    const apiKeys = {
      marketDataApiKey: process.env.MARKET_DATA_API_KEY || "",
      newsApiKey: process.env.NEWS_API_KEY || "",
      sentimentApiKey: process.env.SENTIMENT_API_KEY || "",
      aiPredictionApiKey: process.env.AI_PREDICTION_API_KEY || "",
    }

    // Get symbols from request body or use defaults
    const { symbols = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA"] } = await request.json()

    // Initialize data pipeline
    const dataPipeline = new DataPipeline()
    await dataPipeline.initialize(apiKeys)

    // Fetch and store data
    await dataPipeline.fetchAndStoreData(symbols)

    return NextResponse.json({ success: true, message: "Data updated successfully" })
  } catch (error) {
    console.error("Error updating data:", error)
    return NextResponse.json(
      { success: false, message: "Failed to update data", error: String(error) },
      { status: 500 },
    )
  }
}
