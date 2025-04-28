// Service for fetching market data from various sources
import { ApiClient } from "./api-client"

export interface MarketData {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume: number
  marketCap?: number
  high?: number
  low?: number
  open?: number
  previousClose?: number
  timestamp: number
}

export interface MarketDataResponse {
  data: MarketData[]
  timestamp: number
}

export class MarketDataService {
  private apiClient: ApiClient

  constructor() {
    // Replace with your actual market data API URL
    // For example: Alpha Vantage, Finnhub, IEX Cloud, etc.
    this.apiClient = new ApiClient("https://api.market-data-provider.com")
  }

  async initialize(apiKey: string): Promise<void> {
    // Set the API key in the headers
    this.apiClient.setApiKey(apiKey)
  }

  async getStockData(symbols: string[]): Promise<MarketDataResponse> {
    try {
      // For real implementation, you would call your actual API
      // Example with Alpha Vantage:
      // return this.apiClient.get<MarketDataResponse>("/query", {
      //   function: "GLOBAL_QUOTE",
      //   symbols: symbols.join(","),
      //   apikey: this.apiKey
      // })

      // For now, return mock data
      return {
        data: symbols.map((symbol) => this.generateMockStockData(symbol)),
        timestamp: Date.now(),
      }
    } catch (error) {
      console.error("Error fetching stock data:", error)
      throw error
    }
  }

  async getCryptoData(symbols: string[]): Promise<MarketDataResponse> {
    try {
      // For real implementation, call your crypto API
      // For now, return mock data
      return {
        data: symbols.map((symbol) => this.generateMockCryptoData(symbol)),
        timestamp: Date.now(),
      }
    } catch (error) {
      console.error("Error fetching crypto data:", error)
      throw error
    }
  }

  async getSectorData(sectorId: string): Promise<any> {
    try {
      // For real implementation, call your sector data API
      // For now, return mock data
      return {
        id: sectorId,
        performance: Math.random() * 10 - 5,
        marketCap: "$" + (Math.random() * 1000 + 500).toFixed(2) + "B",
        volume: (Math.random() * 100 + 50).toFixed(2) + "M",
        timestamp: Date.now(),
      }
    } catch (error) {
      console.error(`Error fetching sector data for ${sectorId}:`, error)
      throw error
    }
  }

  async getHistoricalData(symbol: string, timeframe: string): Promise<any> {
    try {
      // For real implementation, call your historical data API
      // For now, return mock data
      const days = this.timeframeToDays(timeframe)
      return {
        symbol,
        data: this.generateMockHistoricalData(days),
        timeframe,
        timestamp: Date.now(),
      }
    } catch (error) {
      console.error(`Error fetching historical data for ${symbol}:`, error)
      throw error
    }
  }

  // Helper methods for generating mock data
  private generateMockStockData(symbol: string): MarketData {
    const price = Math.random() * 1000 + 50
    const change = Math.random() * 20 - 10
    const changePercent = (change / price) * 100

    return {
      symbol,
      price,
      change,
      changePercent,
      volume: Math.random() * 10000000 + 1000000,
      marketCap: price * (Math.random() * 1000000000 + 10000000),
      high: price + Math.random() * 10,
      low: price - Math.random() * 10,
      open: price - change,
      previousClose: price - change,
      timestamp: Date.now(),
    }
  }

  private generateMockCryptoData(symbol: string): MarketData {
    const price = symbol === "BTC" ? Math.random() * 10000 + 50000 : Math.random() * 1000 + 100
    const change = Math.random() * 500 - 250
    const changePercent = (change / price) * 100

    return {
      symbol,
      price,
      change,
      changePercent,
      volume: Math.random() * 50000000000 + 1000000000,
      marketCap: price * (Math.random() * 10000000 + 1000000),
      high: price + Math.random() * 1000,
      low: price - Math.random() * 1000,
      open: price - change,
      previousClose: price - change,
      timestamp: Date.now(),
    }
  }

  private generateMockHistoricalData(days: number): any[] {
    const data = []
    let price = Math.random() * 1000 + 100

    for (let i = 0; i < days; i++) {
      const date = new Date()
      date.setDate(date.getDate() - (days - i))

      const change = Math.random() * 20 - 10
      price += change

      data.push({
        date: date.toISOString().split("T")[0],
        price,
        volume: Math.random() * 10000000 + 1000000,
      })
    }

    return data
  }

  private timeframeToDays(timeframe: string): number {
    switch (timeframe) {
      case "1d":
        return 1
      case "1w":
        return 7
      case "1m":
        return 30
      case "3m":
        return 90
      case "6m":
        return 180
      case "1y":
        return 365
      case "5y":
        return 1825
      default:
        return 30
    }
  }
}
