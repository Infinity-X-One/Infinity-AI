// Service for integrating the AI brain for predictions
import { ApiClient } from "./api-client"
import type { MarketData } from "./market-data-service"
import type { SentimentData } from "./sentiment-service"
import type { NewsItem } from "./news-service"

export interface AIBrainInput {
  marketData: MarketData[]
  sentimentData: SentimentData[]
  newsData: NewsItem[]
  technicalIndicators: any
  historicalData: any[]
  timeframe: string
}

export interface AIBrainOutput {
  predictions: {
    symbol: string
    currentPrice: number
    predictedPrice: number
    predictedChange: number
    predictedChangePercent: number
    confidence: number
    timeframe: string
    supportingFactors: string[]
    riskFactors: string[]
  }[]
  marketOutlook: {
    overall: "bullish" | "bearish" | "neutral"
    confidence: number
    keyFactors: string[]
    riskFactors: string[]
  }
  sectorOutlooks: {
    sectorId: string
    outlook: "bullish" | "bearish" | "neutral"
    confidence: number
    keyFactors: string[]
  }[]
}

export class AIBrainService {
  private apiClient: ApiClient

  constructor() {
    // This would be your AI brain API endpoint
    this.apiClient = new ApiClient("https://api.your-ai-brain-service.com")
  }

  async initialize(apiKeyName: string): Promise<void> {
    await this.apiClient.setAuthHeader(apiKeyName)
  }

  async generatePredictions(input: AIBrainInput): Promise<AIBrainOutput> {
    return this.apiClient.post<AIBrainOutput>("/brain/predict", input)
  }

  // If your AI brain is hosted locally or as a separate service
  async loadAIBrainMemory(): Promise<any> {
    return this.apiClient.get<any>("/brain/memory")
  }

  async updateAIBrainMemory(memory: any): Promise<void> {
    await this.apiClient.post("/brain/memory/update", { memory })
  }

  async trainAIBrain(trainingData: any): Promise<any> {
    return this.apiClient.post<any>("/brain/train", { trainingData })
  }
}
