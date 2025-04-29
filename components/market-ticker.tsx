"use client"

import { useState } from "react"
import { TrendingUp, TrendingDown, BarChart3, Zap, AlertCircle } from "lucide-react"

export function MarketTicker() {
  const [tickerItems] = useState([
    { symbol: "AAPL", price: 187.68, change: 1.24, prediction: 195.42, confidence: 82 },
    { symbol: "MSFT", price: 412.65, change: 2.35, prediction: 445.8, confidence: 92 },
    { symbol: "GOOGL", price: 164.32, change: 0.87, prediction: 178.65, confidence: 78 },
    { symbol: "AMZN", price: 178.92, change: 1.56, prediction: 195.4, confidence: 82 },
    { symbol: "NVDA", price: 875.28, change: 3.42, prediction: 950.45, confidence: 94 },
    { symbol: "TSLA", price: 175.45, change: -2.18, prediction: 165.3, confidence: 68 },
    { symbol: "META", price: 474.88, change: 1.92, prediction: 510.25, confidence: 86 },
    { symbol: "JPM", price: 198.54, change: -1.35, prediction: 187.65, confidence: 76 },
    { symbol: "V", price: 275.62, change: 0.45, prediction: 290.1, confidence: 80 },
    { symbol: "UNH", price: 528.36, change: 1.75, prediction: 565.75, confidence: 81 },
  ])

  const [marketStats] = useState({
    bullishCount: 28,
    bearishCount: 12,
    neutralCount: 5,
    avgConfidence: 78,
    topSector: "Technology",
    topSectorPerformance: 8.4,
  })

  return (
    <div className="w-full bg-black border-b border-[#00ff4c33] py-2 overflow-hidden">
      {/* Market Stats */}
      <div className="flex justify-between items-center px-6 py-2 mb-2">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-[#00ff4c]" />
            <span className="text-sm text-gray-400">Bullish:</span>
            <span className="text-sm font-bold text-[#00ff4c]">{marketStats.bullishCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingDown size={16} className="text-red-500" />
            <span className="text-sm text-gray-400">Bearish:</span>
            <span className="text-sm font-bold text-red-500">{marketStats.bearishCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-yellow-400" />
            <span className="text-sm text-gray-400">Neutral:</span>
            <span className="text-sm font-bold text-yellow-400">{marketStats.neutralCount}</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-[#00ff4c]" />
            <span className="text-sm text-gray-400">Avg Confidence:</span>
            <span className="text-sm font-bold text-white">{marketStats.avgConfidence}%</span>
          </div>
          <div className="flex items-center gap-2">
            <BarChart3 size={16} className="text-[#00ff4c]" />
            <span className="text-sm text-gray-400">Top Sector:</span>
            <span className="text-sm font-bold text-white">{marketStats.topSector}</span>
            <span className="text-xs text-[#00ff4c]">(+{marketStats.topSectorPerformance}%)</span>
          </div>
        </div>
      </div>

      {/* Scrolling Ticker */}
      <div className="flex overflow-x-auto whitespace-nowrap py-1 border-t border-[#00ff4c33] hide-scrollbar">
        {tickerItems.map((item, index) => (
          <div key={index} className="inline-flex items-center mx-4 first:ml-6 last:mr-6">
            <span className="font-bold text-white">{item.symbol}</span>
            <span className="ml-2 text-white">${item.price.toFixed(2)}</span>
            <span className={`ml-1 ${item.change >= 0 ? "text-[#00ff4c]" : "text-red-500"}`}>
              {item.change >= 0 ? "+" : ""}
              {item.change.toFixed(2)}%
            </span>
            <span className="mx-1 text-gray-500">|</span>
            <span className="text-gray-400">Pred:</span>
            <span className={`ml-1 ${item.prediction > item.price ? "text-[#00ff4c]" : "text-red-500"}`}>
              ${item.prediction.toFixed(2)}
            </span>
            <span className="ml-2 text-xs text-gray-400">({item.confidence}%)</span>
          </div>
        ))}
      </div>
    </div>
  )
}
