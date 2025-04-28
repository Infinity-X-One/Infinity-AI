import { NextResponse } from "next/server"
import { MarketDataService } from "@/services/market-data-service"
import { NewsService } from "@/services/news-service"
import { SentimentService } from "@/services/sentiment-service"
import { AIPredictionService } from "@/services/ai-prediction-service"

// This endpoint will fetch live data directly from APIs
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const symbols = searchParams.get("symbols")?.split(",") || ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA"]

    // Initialize services
    const marketDataService = new MarketDataService()
    const newsService = new NewsService()
    const sentimentService = new SentimentService()
    const aiPredictionService = new AIPredictionService()

    // Get API keys from environment variables
    await marketDataService.initialize(process.env.MARKET_DATA_API_KEY || "")
    await newsService.initialize(process.env.NEWS_API_KEY || "")
    await sentimentService.initialize(process.env.SENTIMENT_API_KEY || "")
    await aiPredictionService.initialize(process.env.AI_PREDICTION_API_KEY || "")

    // Fetch data in parallel
    const [marketDataResponse, newsData] = await Promise.all([
      marketDataService.getStockData(symbols),
      newsService.getLatestNews(10),
    ])

    // Process market data
    const marketData: Record<string, any> = {}
    marketDataResponse.data.forEach((item) => {
      marketData[item.symbol] = item
    })

    // Fetch sentiment and predictions sequentially to avoid rate limits
    const sentimentData: Record<string, any> = {}
    const predictions: Record<string, any> = {}

    for (const symbol of symbols) {
      try {
        sentimentData[symbol] = await sentimentService.getSentimentBySymbol(symbol)
      } catch (error) {
        console.error(`Error fetching sentiment for ${symbol}:`, error)
      }

      try {
        predictions[symbol] = await aiPredictionService.getPredictionsBySymbol(symbol, "1w")
      } catch (error) {
        console.error(`Error fetching prediction for ${symbol}:`, error)
      }
    }

    return NextResponse.json({
      marketData,
      newsData,
      sentimentData,
      predictions,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error fetching live data:", error)
    return NextResponse.json(
      { success: false, message: "Failed to fetch live data", error: String(error) },
      { status: 500 },
    )
  }
}
