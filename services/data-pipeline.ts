import { createClient } from "@supabase/supabase-js"
import { MarketDataService } from "./market-data-service"
import { NewsService } from "./news-service"
import { SentimentService } from "./sentiment-service"
import { AIPredictionService } from "./ai-prediction-service"

// This service orchestrates data flow between APIs and Supabase
export class DataPipeline {
  private supabase
  private marketDataService: MarketDataService
  private newsService: NewsService
  private sentimentService: SentimentService
  private aiPredictionService: AIPredictionService
  private tablesInitialized = false

  constructor() {
    // Initialize Supabase client
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    )

    // Initialize services
    this.marketDataService = new MarketDataService()
    this.newsService = new NewsService()
    this.sentimentService = new SentimentService()
    this.aiPredictionService = new AIPredictionService()
  }

  async initialize(apiKeys: Record<string, string>): Promise<void> {
    await this.marketDataService.initialize(apiKeys.marketDataApiKey)
    await this.newsService.initialize(apiKeys.newsApiKey)
    await this.sentimentService.initialize(apiKeys.sentimentApiKey)
    await this.aiPredictionService.initialize(apiKeys.aiPredictionApiKey)

    // Check if tables exist
    await this.checkAndCreateTables()
  }

  // Check if required tables exist and create them if they don't
  private async checkAndCreateTables(): Promise<void> {
    try {
      // Check if market_data table exists
      const { error: marketDataError } = await this.supabase.from("market_data").select("id").limit(1).maybeSingle()

      if (marketDataError && marketDataError.message.includes("does not exist")) {
        console.log("Tables do not exist. Creating required tables...")
        await this.createTables()
        this.tablesInitialized = true
      } else {
        this.tablesInitialized = true
      }
    } catch (error) {
      console.error("Error checking tables:", error)
      // We'll continue and let individual operations handle their errors
    }
  }

  // Create all required tables
  private async createTables(): Promise<void> {
    try {
      // Create market_data table
      await this.supabase.rpc("create_market_data_table", {})

      // Create news table
      await this.supabase.rpc("create_news_table", {})

      // Create sentiment table
      await this.supabase.rpc("create_sentiment_table", {})

      // Create predictions table
      await this.supabase.rpc("create_predictions_table", {})

      console.log("Tables created successfully")
    } catch (error) {
      console.error("Error creating tables:", error)
      throw error
    }
  }

  // Fetch live data and store in Supabase
  async fetchAndStoreData(symbols: string[]): Promise<void> {
    try {
      // Ensure tables exist
      if (!this.tablesInitialized) {
        await this.checkAndCreateTables()
      }

      // 1. Fetch market data
      const marketData = await this.marketDataService.getStockData(symbols)

      // 2. Store market data in Supabase
      await this.storeMarketData(marketData.data)

      // 3. Fetch and store news
      const news = await this.newsService.getLatestNews(20)
      await this.storeNewsData(news)

      // 4. Process sentiment for each symbol
      for (const symbol of symbols) {
        const sentiment = await this.sentimentService.getSentimentBySymbol(symbol)
        await this.storeSentimentData(symbol, sentiment)
      }

      // 5. Generate and store predictions
      for (const symbol of symbols) {
        const prediction = await this.aiPredictionService.getPredictionsBySymbol(symbol, "1w")
        await this.storePredictionData(symbol, prediction)
      }

      console.log("Data pipeline completed successfully")
    } catch (error) {
      console.error("Error in data pipeline:", error)
      throw error
    }
  }

  // Store market data in Supabase
  private async storeMarketData(data: any[]): Promise<void> {
    if (!this.tablesInitialized) return

    for (const item of data) {
      const { error } = await this.supabase.from("market_data").upsert({
        symbol: item.symbol,
        price: item.price,
        change: item.change,
        change_percent: item.changePercent,
        volume: item.volume,
        market_cap: item.marketCap,
        high: item.high,
        low: item.low,
        open: item.open,
        previous_close: item.previousClose,
        timestamp: new Date().toISOString(),
      })

      if (error) console.error("Error storing market data:", error)
    }
  }

  // Store news data in Supabase
  private async storeNewsData(news: any[]): Promise<void> {
    if (!this.tablesInitialized) return

    for (const item of news) {
      const { error } = await this.supabase.from("news").upsert({
        id: item.id,
        title: item.title,
        summary: item.summary,
        url: item.url,
        source: item.source,
        published_at: item.publishedAt,
        sentiment: item.sentiment,
        relevance: item.relevance,
        symbols: item.symbols,
        timestamp: new Date().toISOString(),
      })

      if (error) console.error("Error storing news data:", error)
    }
  }

  // Store sentiment data in Supabase
  private async storeSentimentData(symbol: string, data: any): Promise<void> {
    if (!this.tablesInitialized) return

    const { error } = await this.supabase.from("sentiment").upsert({
      symbol,
      overall_sentiment: data.overallSentiment,
      score: data.score,
      social_media_sentiment: data.socialMediaSentiment,
      news_sentiment: data.newsSentiment,
      analyst_sentiment: data.analystSentiment,
      timestamp: new Date().toISOString(),
    })

    if (error) console.error("Error storing sentiment data:", error)
  }

  // Store prediction data in Supabase
  private async storePredictionData(symbol: string, data: any): Promise<void> {
    if (!this.tablesInitialized) return

    const { error } = await this.supabase.from("predictions").upsert({
      symbol,
      predicted_price: data.predictedPrice,
      predicted_change: data.predictedChange,
      predicted_change_percent: data.predictedChangePercent,
      confidence: data.confidence,
      timeframe: data.timeframe,
      supporting_factors: data.supportingFactors,
      risk_factors: data.riskFactors,
      timestamp: new Date().toISOString(),
    })

    if (error) console.error("Error storing prediction data:", error)
  }

  // Retrieve the latest data from Supabase
  async getLatestData(symbols: string[]): Promise<any> {
    try {
      // Check if tables exist first
      if (!this.tablesInitialized) {
        await this.checkAndCreateTables()
      }

      // If tables still don't exist or aren't initialized, return mock data
      if (!this.tablesInitialized) {
        return this.getMockData(symbols)
      }

      // Fetch market data
      const { data: marketData, error: marketError } = await this.supabase
        .from("market_data")
        .select("*")
        .in("symbol", symbols)
        .order("timestamp", { ascending: false })
        .limit(symbols.length)

      if (marketError) {
        if (marketError.message.includes("does not exist")) {
          return this.getMockData(symbols)
        }
        throw marketError
      }

      // Fetch news
      const { data: newsData, error: newsError } = await this.supabase
        .from("news")
        .select("*")
        .order("published_at", { ascending: false })
        .limit(20)

      if (newsError && !newsError.message.includes("does not exist")) throw newsError

      // Fetch sentiment
      const { data: sentimentData, error: sentimentError } = await this.supabase
        .from("sentiment")
        .select("*")
        .in("symbol", symbols)
        .order("timestamp", { ascending: false })
        .limit(symbols.length)

      if (sentimentError && !sentimentError.message.includes("does not exist")) throw sentimentError

      // Fetch predictions
      const { data: predictionsData, error: predictionsError } = await this.supabase
        .from("predictions")
        .select("*")
        .in("symbol", symbols)
        .order("timestamp", { ascending: false })
        .limit(symbols.length)

      if (predictionsError && !predictionsError.message.includes("does not exist")) throw predictionsError

      return {
        marketData: marketData || [],
        newsData: newsData || [],
        sentimentData: sentimentData || [],
        predictionsData: predictionsData || [],
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      console.error("Error retrieving data from Supabase:", error)
      return this.getMockData(symbols)
    }
  }

  // Generate mock data when tables don't exist yet
  private getMockData(symbols: string[]): any {
    const timestamp = new Date().toISOString()

    return {
      marketData: symbols.map((symbol) => ({
        id: `mock-${symbol}`,
        symbol,
        price: 150 + Math.random() * 50,
        change: Math.random() * 10 - 5,
        change_percent: Math.random() * 5 - 2.5,
        volume: Math.floor(Math.random() * 10000000),
        market_cap: Math.floor(Math.random() * 1000000000),
        high: 160 + Math.random() * 50,
        low: 140 + Math.random() * 50,
        open: 145 + Math.random() * 50,
        previous_close: 148 + Math.random() * 50,
        timestamp,
      })),
      newsData: Array(5)
        .fill(null)
        .map((_, i) => ({
          id: `mock-news-${i}`,
          title: `Mock News Article ${i + 1}`,
          summary: "This is a placeholder for news content until the database is properly initialized.",
          url: "https://example.com",
          source: "Mock Source",
          published_at: timestamp,
          sentiment: Math.random() * 2 - 1,
          relevance: Math.random(),
          symbols: symbols.slice(0, Math.floor(Math.random() * symbols.length) + 1),
          timestamp,
        })),
      sentimentData: symbols.map((symbol) => ({
        id: `mock-sentiment-${symbol}`,
        symbol,
        overall_sentiment: Math.random() * 2 - 1,
        score: Math.random() * 100,
        social_media_sentiment: Math.random() * 2 - 1,
        news_sentiment: Math.random() * 2 - 1,
        analyst_sentiment: Math.random() * 2 - 1,
        timestamp,
      })),
      predictionsData: symbols.map((symbol) => ({
        id: `mock-prediction-${symbol}`,
        symbol,
        predicted_price: 155 + Math.random() * 50,
        predicted_change: Math.random() * 10 - 5,
        predicted_change_percent: Math.random() * 5 - 2.5,
        confidence: 0.5 + Math.random() * 0.5,
        timeframe: "1w",
        supporting_factors: { factors: ["Mock factor 1", "Mock factor 2"] },
        risk_factors: { factors: ["Mock risk 1", "Mock risk 2"] },
        timestamp,
      })),
      timestamp,
      isMockData: true,
    }
  }
}
