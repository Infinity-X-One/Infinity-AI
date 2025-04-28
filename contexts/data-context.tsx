"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import type { MarketData } from "@/services/market-data-service"
import type { NewsItem } from "@/services/news-service"
import type { SentimentData } from "@/services/sentiment-service"
import type { PredictionOutput } from "@/services/ai-prediction-service"

interface DataContextType {
  marketData: Record<string, MarketData>
  sectorData: Record<string, any>
  newsData: NewsItem[]
  sentimentData: Record<string, SentimentData>
  predictions: Record<string, PredictionOutput>
  isLoading: boolean
  error: string | null
  refreshData: (symbols?: string[]) => Promise<void>
  getPredictionForSymbol: (symbol: string, timeframe: string) => Promise<PredictionOutput>
  getHistoricalData: (symbol: string, timeframe: string) => Promise<any>
  getSectorData: (sectorId: string) => Promise<any>
  useLiveData: boolean
  setUseLiveData: (value: boolean) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [marketData, setMarketData] = useState<Record<string, MarketData>>({})
  const [sectorData, setSectorData] = useState<Record<string, any>>({})
  const [newsData, setNewsData] = useState<NewsItem[]>([])
  const [sentimentData, setSentimentData] = useState<Record<string, SentimentData>>({})
  const [predictions, setPredictions] = useState<Record<string, PredictionOutput>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [useLiveData, setUseLiveData] = useState(false) // Toggle between live and stored data

  // Function to refresh all data
  const refreshData = useCallback(
    async (symbols: string[] = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA"]) => {
      setIsLoading(true)
      setError(null)

      try {
        // Determine which endpoint to use based on useLiveData flag
        const endpoint = useLiveData ? "/api/data/live" : "/api/data/latest"

        // Fetch data from the appropriate endpoint
        const response = await fetch(`${endpoint}?symbols=${symbols.join(",")}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`)
        }

        const data = await response.json()

        // Update state with fetched data
        setMarketData(data.marketData || {})
        setNewsData(data.newsData || [])
        setSentimentData(data.sentimentData || {})
        setPredictions(data.predictions || {})
      } catch (err) {
        console.error("Error refreshing data:", err)
        setError("Failed to refresh data. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    },
    [useLiveData],
  )

  // Initialize data on component mount and when useLiveData changes
  useEffect(() => {
    refreshData()

    // Set up interval to refresh data periodically if using live data
    if (useLiveData) {
      const intervalId = setInterval(() => {
        refreshData()
      }, 60000) // Refresh every minute

      return () => clearInterval(intervalId)
    }
  }, [refreshData, useLiveData])

  // Function to get prediction for a specific symbol
  const getPredictionForSymbol = useCallback(
    async (symbol: string, timeframe: string): Promise<PredictionOutput> => {
      try {
        const endpoint = useLiveData ? "/api/data/live/prediction" : "/api/data/latest/prediction"
        const response = await fetch(`${endpoint}?symbol=${symbol}&timeframe=${timeframe}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch prediction: ${response.statusText}`)
        }

        return await response.json()
      } catch (err) {
        console.error(`Failed to get prediction for ${symbol}:`, err)
        throw err
      }
    },
    [useLiveData],
  )

  // Function to get historical data for a specific symbol
  const getHistoricalData = useCallback(
    async (symbol: string, timeframe: string): Promise<any> => {
      try {
        const endpoint = useLiveData ? "/api/data/live/historical" : "/api/data/latest/historical"
        const response = await fetch(`${endpoint}?symbol=${symbol}&timeframe=${timeframe}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch historical data: ${response.statusText}`)
        }

        return await response.json()
      } catch (err) {
        console.error(`Failed to get historical data for ${symbol}:`, err)
        throw err
      }
    },
    [useLiveData],
  )

  // Function to get data for a specific sector
  const getSectorData = useCallback(
    async (sectorId: string): Promise<any> => {
      try {
        const endpoint = useLiveData ? "/api/data/live/sector" : "/api/data/latest/sector"
        const response = await fetch(`${endpoint}?sectorId=${sectorId}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch sector data: ${response.statusText}`)
        }

        const data = await response.json()

        setSectorData((prev) => ({
          ...prev,
          [sectorId]: data,
        }))

        return data
      } catch (err) {
        console.error(`Failed to get sector data for ${sectorId}:`, err)
        throw err
      }
    },
    [useLiveData],
  )

  const value = {
    marketData,
    sectorData,
    newsData,
    sentimentData,
    predictions,
    isLoading,
    error,
    refreshData,
    getPredictionForSymbol,
    getHistoricalData,
    getSectorData,
    useLiveData,
    setUseLiveData,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
