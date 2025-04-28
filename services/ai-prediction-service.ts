"use client"

import { ApiClient } from "./api-client"

export interface PredictionOutput {
  symbol: string
  currentPrice: number
  predictedPrice: number
  predictedChange: number
  predictedChangePercent: number
  confidence: number
  timeframe: string
  supportingFactors: string[]
  riskFactors: string[]
  timestamp?: number
}

export interface PredictionInput {
  marketData: any[]
  sentimentData?: any[]
  newsData?: any[]
  technicalIndicators?: any
  timeframe: string
}

// Original AIBrainService class
export class AIBrainService {
  private apiClient: ApiClient

  constructor() {
    this.apiClient = new ApiClient("https://api.ai-predictions.com")
  }

  async initialize(apiKey: string): Promise<void> {
    this.apiClient.setApiKey(apiKey)
  }

  async getPrediction(input: PredictionInput): Promise<PredictionOutput[]> {
    return this.apiClient.post<PredictionOutput[]>("/predict", input)
  }

  async getPredictionsBySymbol(symbol: string, timeframe: string): Promise<PredictionOutput> {
    try {
      // Call the API to get predictions for a specific symbol
      const response = await this.apiClient.get<PredictionOutput>(`/predictions/${symbol}`, { timeframe })
      return response
    } catch (error) {
      console.error(`Error fetching predictions for ${symbol}:`, error)
      throw error
    }
  }

  async getPredictionsBySector(sector: string, timeframe: string): Promise<Record<string, PredictionOutput>> {
    return this.apiClient.get<Record<string, PredictionOutput>>(`/predictions/sector/${sector}`, { timeframe })
  }

  async storePredictions(symbols: string[], timeframe: string, predictions: any): Promise<void> {
    try {
      // Call the API to store predictions
      await this.apiClient.post("/predictions", {
        symbols,
        timeframe,
        predictions,
      })
    } catch (error) {
      console.error("Error storing predictions:", error)
      throw error
    }
  }
}

// Add the missing AIPredictionService class as a named export
export class AIPredictionService {
  private apiClient: ApiClient

  constructor() {
    this.apiClient = new ApiClient("https://api.ai-predictions.com")
  }

  async initialize(apiKey: string): Promise<void> {
    this.apiClient.setApiKey(apiKey)
  }

  async getPrediction(input: PredictionInput): Promise<PredictionOutput[]> {
    return this.apiClient.post<PredictionOutput[]>("/predict", input)
  }

  async getPredictionsBySymbol(symbol: string, timeframe: string): Promise<PredictionOutput> {
    try {
      // Call the API to get predictions for a specific symbol
      const response = await this.apiClient.get<PredictionOutput>(`/predictions/${symbol}`, { timeframe })
      return response
    } catch (error) {
      console.error(`Error fetching predictions for ${symbol}:`, error)
      throw error
    }
  }

  async getPredictionsBySector(sector: string, timeframe: string): Promise<Record<string, PredictionOutput>> {
    return this.apiClient.get<Record<string, PredictionOutput>>(`/predictions/sector/${sector}`, { timeframe })
  }

  async getHistoricalPredictions(symbol: string, days: number): Promise<PredictionOutput[]> {
    try {
      // Call the API to get historical predictions
      const response = await this.apiClient.get<PredictionOutput[]>(`/predictions/historical/${symbol}`, { days })
      return response
    } catch (error) {
      console.error(`Error fetching historical predictions for ${symbol}:`, error)
      throw error
    }
  }

  async getAccuracyMetrics(symbol: string): Promise<{ accuracy: number; rmse: number }> {
    try {
      // Call the API to get accuracy metrics
      const response = await this.apiClient.get<{ accuracy: number; rmse: number }>(`/predictions/accuracy/${symbol}`)
      return response
    } catch (error) {
      console.error(`Error fetching accuracy metrics for ${symbol}:`, error)
      throw error
    }
  }

  async storePredictions(symbols: string[], timeframe: string, predictions: any): Promise<void> {
    try {
      // Call the API to store predictions
      await this.apiClient.post("/predictions", {
        symbols,
        timeframe,
        predictions,
      })
    } catch (error) {
      console.error("Error storing predictions:", error)
      throw error
    }
  }
}
