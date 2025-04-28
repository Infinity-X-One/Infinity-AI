"use client"

import { useState, useEffect } from "react"
import { ArrowUpRight, ArrowDownRight, RefreshCw } from "lucide-react"

type TrackerData = {
  id: string
  symbol: string
  name: string
  price: number
  change: number
  volume: string
  marketCap: string
  prediction: string
  confidence: number
  lastUpdated: string
}

export function ExcelTracker() {
  const [data, setData] = useState<TrackerData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data - in a real app, this would come from an API
    const mockData: TrackerData[] = [
      {
        id: "1",
        symbol: "AAPL",
        name: "Apple Inc.",
        price: 173.45,
        change: 1.23,
        volume: "62.3M",
        marketCap: "2.73T",
        prediction: "Bullish",
        confidence: 87,
        lastUpdated: "2m ago",
      },
      {
        id: "2",
        symbol: "MSFT",
        name: "Microsoft Corp.",
        price: 338.11,
        change: -0.54,
        volume: "28.1M",
        marketCap: "2.51T",
        prediction: "Neutral",
        confidence: 65,
        lastUpdated: "5m ago",
      },
      {
        id: "3",
        symbol: "GOOGL",
        name: "Alphabet Inc.",
        price: 131.86,
        change: 2.15,
        volume: "31.5M",
        marketCap: "1.67T",
        prediction: "Bullish",
        confidence: 92,
        lastUpdated: "1m ago",
      },
      {
        id: "4",
        symbol: "AMZN",
        name: "Amazon.com Inc.",
        price: 127.74,
        change: -1.05,
        volume: "45.2M",
        marketCap: "1.32T",
        prediction: "Bearish",
        confidence: 71,
        lastUpdated: "3m ago",
      },
      {
        id: "5",
        symbol: "TSLA",
        name: "Tesla Inc.",
        price: 238.83,
        change: 3.42,
        volume: "108.7M",
        marketCap: "758.2B",
        prediction: "Bullish",
        confidence: 89,
        lastUpdated: "2m ago",
      },
      {
        id: "6",
        symbol: "META",
        name: "Meta Platforms Inc.",
        price: 301.27,
        change: 1.87,
        volume: "22.4M",
        marketCap: "772.5B",
        prediction: "Bullish",
        confidence: 78,
        lastUpdated: "4m ago",
      },
      {
        id: "7",
        symbol: "NVDA",
        name: "NVIDIA Corp.",
        price: 416.1,
        change: 5.23,
        volume: "52.8M",
        marketCap: "1.03T",
        prediction: "Strong Bullish",
        confidence: 95,
        lastUpdated: "1m ago",
      },
    ]

    setData(mockData)
    setLoading(false)
  }, [])

  const refreshData = () => {
    setLoading(true)
    // In a real app, this would fetch fresh data
    setTimeout(() => {
      setLoading(false)
    }, 800)
  }

  return (
    <div className="w-full bg-gray-900 border-t border-gray-800 text-white">
      <div className="flex justify-between items-center p-2 border-b border-gray-800">
        <h3 className="text-sm font-semibold text-gray-300">Market Tracker</h3>
        <button onClick={refreshData} className="flex items-center text-xs text-gray-400 hover:text-white">
          <RefreshCw size={14} className={`mr-1 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-800">
              <th className="p-2 text-left">Symbol</th>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-right">Price</th>
              <th className="p-2 text-right">Change</th>
              <th className="p-2 text-right">Volume</th>
              <th className="p-2 text-right">Market Cap</th>
              <th className="p-2 text-center">Prediction</th>
              <th className="p-2 text-right">Confidence</th>
              <th className="p-2 text-right">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                <td className="p-2 font-mono font-bold">{item.symbol}</td>
                <td className="p-2">{item.name}</td>
                <td className="p-2 text-right font-mono">${item.price.toFixed(2)}</td>
                <td
                  className={`p-2 text-right font-mono flex items-center justify-end ${item.change >= 0 ? "text-green-500" : "text-red-500"}`}
                >
                  {item.change >= 0 ? (
                    <ArrowUpRight size={14} className="mr-1" />
                  ) : (
                    <ArrowDownRight size={14} className="mr-1" />
                  )}
                  {Math.abs(item.change).toFixed(2)}%
                </td>
                <td className="p-2 text-right font-mono">{item.volume}</td>
                <td className="p-2 text-right font-mono">{item.marketCap}</td>
                <td
                  className={`p-2 text-center ${
                    item.prediction.includes("Bullish")
                      ? "text-green-500"
                      : item.prediction.includes("Bearish")
                        ? "text-red-500"
                        : "text-yellow-500"
                  }`}
                >
                  {item.prediction}
                </td>
                <td className="p-2 text-right">
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${
                        item.confidence > 80 ? "bg-green-500" : item.confidence > 60 ? "bg-yellow-500" : "bg-red-500"
                      }`}
                      style={{ width: `${item.confidence}%` }}
                    ></div>
                  </div>
                </td>
                <td className="p-2 text-right text-gray-400">{item.lastUpdated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
