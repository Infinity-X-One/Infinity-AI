// Service for fetching financial news
import { ApiClient } from "./api-client"

export interface NewsItem {
  id: string
  title: string
  summary: string
  url: string
  source: string
  publishedAt: string
  sentiment?: "positive" | "negative" | "neutral"
  relevance?: number
  symbols?: string[]
}

export class NewsService {
  private apiClient: ApiClient

  constructor() {
    // Replace with your actual news API URL
    this.apiClient = new ApiClient("https://api.news-provider.com")
  }

  async initialize(apiKeyName: string): Promise<void> {
    await this.apiClient.setAuthHeader(apiKeyName)
  }

  async getLatestNews(limit = 10): Promise<NewsItem[]> {
    return this.apiClient.get<NewsItem[]>("/news/latest", { limit })
  }

  async getNewsBySymbol(symbol: string, limit = 10): Promise<NewsItem[]> {
    return this.apiClient.get<NewsItem[]>(`/news/symbol/${symbol}`, { limit })
  }

  async getNewsBySector(sector: string, limit = 10): Promise<NewsItem[]> {
    return this.apiClient.get<NewsItem[]>(`/news/sector/${sector}`, { limit })
  }
}
