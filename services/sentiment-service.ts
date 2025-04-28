// Service for fetching sentiment analysis data
import { ApiClient } from "./api-client"

export interface SentimentData {
  symbol: string
  overallSentiment: "positive" | "negative" | "neutral"
  score: number
  socialMediaSentiment: number
  newsSentiment: number
  analystSentiment: number
  timestamp: number
}

export class SentimentService {
  private apiClient: ApiClient

  constructor() {
    // Replace with your actual sentiment API URL
    this.apiClient = new ApiClient("https://api.sentiment-provider.com")
  }

  async initialize(apiKeyName: string): Promise<void> {
    await this.apiClient.setAuthHeader(apiKeyName)
  }

  async getSentimentBySymbol(symbol: string): Promise<SentimentData> {
    return this.apiClient.get<SentimentData>(`/sentiment/${symbol}`)
  }

  async getSentimentBySector(sector: string): Promise<Record<string, SentimentData>> {
    return this.apiClient.get<Record<string, SentimentData>>(`/sentiment/sector/${sector}`)
  }

  async getMarketSentiment(): Promise<any> {
    return this.apiClient.get<any>("/sentiment/market")
  }
}
