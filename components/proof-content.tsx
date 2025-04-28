"use client"

import type React from "react"

import { useState, useEffect, useMemo, useRef } from "react"
import {
  RefreshCw,
  Info,
  TrendingUp,
  Clock,
  DollarSign,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Clock3,
  Rocket,
  Shield,
  Target,
  Zap,
  TrendingDown,
  BarChart2,
  PieChart,
  Sparkles,
  Award,
  BarChart,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  Search,
  Download,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { createClient } from "@supabase/supabase-js"
import { motion, AnimatePresence } from "framer-motion"
import { ResponsiveContainer, LineChart, Line } from "recharts"
import TradingChart from "./trading-chart"

// Add this CSS at the top of the file, after the imports
const tickerAnimation = `
  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  
  .animate-marquee {
    animation: marquee 30s linear infinite;
  }
`

// Types
interface PortfolioData {
  id: string
  name: string
  description: string
  initialInvestment: number
  currentValue: number
  percentageGain: number
  accuracy: number
  color: string
  icon: React.ReactNode
  data: DataPoint[]
}

interface DataPoint {
  date: string
  value: number
  prediction?: number
  volume?: number
}

interface PredictionRecord {
  id: string
  timestamp: string
  asset: string
  symbol: string
  confidence: number
  buyPrice: number
  predictedPrice: number
  holdTime: string
  sellPrice: number | null
  profit: number | null
  accuracy: number | null
  status: "active" | "completed" | "failed"
  strategy: string
}

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Generate realistic financial data
const generateRealisticFinancialData = (
  days: number,
  baseValue: number,
  volatility: number,
  trend: number,
  color: string,
  isPrediction = false,
): DataPoint[] => {
  const data: DataPoint[] = []
  const now = new Date()

  // Parameters for more realistic price movements
  const momentumFactor = 0.7 // How much previous movement affects next movement
  const marketCycles = Math.random() * 0.3 + 0.1 // Random market cycles
  const marketSentiment = Math.random() > 0.5 ? 1 : -1 // Random market sentiment

  let previousChange = 0
  let value = baseValue

  // For 1-hour view, generate minute data
  // For 1-day view, generate hourly data
  let totalPoints: number
  let isMinute = false
  let isHourly = false

  if (days === 0.042) {
    // 1 hour = 0.042 days
    totalPoints = 60 // 60 minutes
    isMinute = true
  } else if (days === 1) {
    totalPoints = 24 // 24 hours
    isHourly = true
  } else if (days === 7) {
    totalPoints = days // 7 days
  } else if (days === 30) {
    totalPoints = days // 30 days
  } else {
    totalPoints = days
  }

  for (let i = 0; i <= totalPoints; i++) {
    const date = new Date(now)
    if (isMinute) {
      date.setMinutes(date.getMinutes() - (totalPoints - i))
    } else if (isHourly) {
      date.setHours(date.getHours() - (totalPoints - i))
    } else {
      date.setDate(date.getDate() - (totalPoints - i))
    }

    // Generate a realistic price movement with momentum and cycles
    const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000)
    const hourOfDay = date.getHours()
    const minuteOfHour = date.getMinutes()
    const timeComponent = isMinute ? minuteOfHour / 60 : isHourly ? hourOfDay / 24 : dayOfYear / 365

    const cyclicalComponent = Math.sin(timeComponent * 2 * Math.PI * marketCycles) * volatility * 0.5

    // Combine random factor, trend, momentum, and cyclical components
    const randomFactor = (Math.random() - 0.5) * volatility * (isMinute ? 0.3 : isHourly ? 0.5 : 1)
    const trendComponent = (trend * i) / totalPoints
    const momentumComponent = previousChange * momentumFactor

    // Calculate change with more weight on momentum for realistic movement
    const change = (randomFactor + trendComponent + cyclicalComponent + momentumComponent) * marketSentiment
    previousChange = change

    // Apply change to value
    value = Math.max(value * (1 + change), baseValue * 0.7) // Prevent going too low

    // Format date string based on time range
    let dateString: string
    if (isMinute) {
      dateString = date.toISOString().split(".")[0].replace("T", " ").substring(0, 16)
    } else if (isHourly) {
      dateString = date.toISOString().split(".")[0].replace("T", " ").substring(0, 13) + ":00"
    } else {
      dateString = date.toISOString().split("T")[0]
    }

    // Generate volume data (higher near price movements)
    const volumeBase = baseValue * 0.01
    const volumeVariation = Math.abs(change) * 10
    const volume = Math.floor(volumeBase + volumeVariation * baseValue * (0.5 + Math.random()))

    const dataPoint: DataPoint = {
      date: dateString,
      value: Number.parseFloat(value.toFixed(2)),
      volume,
    }

    // Add prediction for the last 5 points with realistic continuation
    if (isPrediction && i >= totalPoints - 5) {
      // Predictions should follow the trend but with slightly higher volatility
      const predictionChange = change * (1 + (Math.random() * 0.4 - 0.2)) + trend * 0.01
      const predictionValue = value * (1 + predictionChange)
      dataPoint.prediction = Number.parseFloat(predictionValue.toFixed(2))
    }

    data.push(dataPoint)
  }

  return data
}

// Generate portfolio data with realistic financial patterns
const generatePortfolios = (): PortfolioData[] => {
  // Base market trend - all portfolios will be somewhat correlated to this
  const marketTrend = Math.random() * 0.4 + 0.2 // 0.2 to 0.6 positive trend

  const portfolioIcons = {
    "infinity-ai": <Rocket size={16} className="text-[#00ff4c]" />,
    hybrid: <Shield size={16} className="text-blue-400" />,
    human: <Target size={16} className="text-purple-400" />,
    "day-trade": <Zap size={16} className="text-yellow-400" />,
    options: <TrendingUp size={16} className="text-orange-400" />,
    shorting: <TrendingDown size={16} className="text-red-400" />,
    focus: <BarChart2 size={16} className="text-pink-400" />,
    sp500: <PieChart size={16} className="text-gray-400" />,
  }

  return [
    {
      id: "infinity-ai",
      name: "Infinity AI",
      description: "Fully AI-managed portfolio using our proprietary algorithms",
      initialInvestment: 10000,
      currentValue: 0,
      percentageGain: 0,
      accuracy: 0,
      color: "#00ff4c",
      icon: portfolioIcons["infinity-ai"],
      data: generateRealisticFinancialData(30, 10000, 0.01, marketTrend * 1.5, "#00ff4c", true),
    },
    {
      id: "hybrid",
      name: "Hybrid Strategy",
      description: "Warren Buffet principles enhanced with AI insights",
      initialInvestment: 10000,
      currentValue: 0,
      percentageGain: 0,
      accuracy: 0,
      color: "#60a5fa",
      icon: portfolioIcons["hybrid"],
      data: generateRealisticFinancialData(30, 10000, 0.008, marketTrend * 1.2, "#60a5fa", false),
    },
    {
      id: "human",
      name: "Human Trader",
      description: "Traditional human trading with emotional factors",
      initialInvestment: 10000,
      currentValue: 0,
      percentageGain: 0,
      accuracy: 0,
      color: "#c084fc",
      icon: portfolioIcons["human"],
      data: generateRealisticFinancialData(30, 10000, 0.015, marketTrend * 0.6, "#c084fc", false),
    },
    {
      id: "day-trade",
      name: "Day Trading",
      description: "Short-term, high-frequency trading strategy",
      initialInvestment: 10000,
      currentValue: 0,
      percentageGain: 0,
      accuracy: 0,
      color: "#facc15",
      icon: portfolioIcons["day-trade"],
      data: generateRealisticFinancialData(30, 10000, 0.02, marketTrend * 1.1, "#facc15", false),
    },
    {
      id: "options",
      name: "Options Strategy",
      description: "Leveraged options trading for amplified returns",
      initialInvestment: 10000,
      currentValue: 0,
      percentageGain: 0,
      accuracy: 0,
      color: "#fb923c",
      icon: portfolioIcons["options"],
      data: generateRealisticFinancialData(30, 10000, 0.025, marketTrend * 1.8, "#fb923c", false),
    },
    {
      id: "shorting",
      name: "Short Strategy",
      description: "Profiting from declining asset prices",
      initialInvestment: 10000,
      currentValue: 0,
      percentageGain: 0,
      accuracy: 0,
      color: "#f87171",
      icon: portfolioIcons["shorting"],
      data: generateRealisticFinancialData(30, 10000, 0.015, marketTrend * 0.9, "#f87171", false),
    },
    {
      id: "focus",
      name: "Focus Portfolio",
      description: "2-3 highly predictable assets with concentrated exposure",
      initialInvestment: 10000,
      currentValue: 0,
      percentageGain: 0,
      accuracy: 0,
      color: "#f472b6",
      icon: portfolioIcons["focus"],
      data: generateRealisticFinancialData(30, 10000, 0.012, marketTrend * 1.4, "#f472b6", false),
    },
    {
      id: "sp500",
      name: "S&P 500",
      description: "Market benchmark for comparison",
      initialInvestment: 10000,
      currentValue: 0,
      percentageGain: 0,
      accuracy: 0,
      color: "#9ca3af",
      icon: portfolioIcons["sp500"],
      data: generateRealisticFinancialData(30, 10000, 0.006, marketTrend * 0.5, "#9ca3af", false),
    },
  ]
}

// Generate prediction records with mock data
const generatePredictionRecords = (): PredictionRecord[] => {
  const assets = [
    { name: "Apple Inc.", symbol: "AAPL" },
    { name: "Microsoft", symbol: "MSFT" },
    { name: "Amazon", symbol: "AMZN" },
    { name: "Tesla", symbol: "TSLA" },
    { name: "NVIDIA", symbol: "NVDA" },
    { name: "Google", symbol: "GOOGL" },
    { name: "Meta", symbol: "META" },
    { name: "Netflix", symbol: "NFLX" },
    { name: "AMD", symbol: "AMD" },
    { name: "Palantir", symbol: "PLTR" },
    { name: "Coinbase", symbol: "COIN" },
    { name: "Shopify", symbol: "SHOP" },
    { name: "Snowflake", symbol: "SNOW" },
    { name: "Roblox", symbol: "RBLX" },
    { name: "Airbnb", symbol: "ABNB" },
    { name: "Uber", symbol: "UBER" },
    { name: "DoorDash", symbol: "DASH" },
    { name: "Zoom", symbol: "ZM" },
    { name: "Block", symbol: "SQ" },
    { name: "Robinhood", symbol: "HOOD" },
  ]

  const strategies = [
    "Infinity AI",
    "Hybrid Strategy",
    "Day Trading",
    "Options Strategy",
    "Short Strategy",
    "Focus Portfolio",
  ]

  const records: PredictionRecord[] = []
  const now = new Date()

  for (let i = 0; i < 50; i++) {
    const timestamp = new Date(now)
    timestamp.setHours(timestamp.getHours() - Math.floor(i / 2))
    timestamp.setMinutes(timestamp.getMinutes() - (i % 2 ? 30 : 0))

    const asset = assets[Math.floor(Math.random() * assets.length)]
    const strategy = strategies[Math.floor(Math.random() * strategies.length)]
    const buyPrice = Number.parseFloat((100 + Math.random() * 900).toFixed(2))
    const confidence = Number.parseFloat((70 + Math.random() * 25).toFixed(1))
    const predictedChange = (confidence / 100) * (Math.random() > 0.3 ? 1 : -1) * (0.05 + Math.random() * 0.15)
    const predictedPrice = Number.parseFloat((buyPrice * (1 + predictedChange)).toFixed(2))

    const holdTimeHours = Math.floor(Math.random() * 72) + 1
    const holdTime =
      holdTimeHours <= 24 ? `${holdTimeHours}h` : `${Math.floor(holdTimeHours / 24)}d ${holdTimeHours % 24}h`

    const status: "active" | "completed" | "failed" = i < 15 ? "active" : Math.random() > 0.2 ? "completed" : "failed"

    let sellPrice = null
    let profit = null
    let accuracy = null

    if (status === "completed" || status === "failed") {
      const actualChange =
        status === "completed"
          ? predictedChange * (0.8 + Math.random() * 0.4)
          : predictedChange * (Math.random() * 0.5) * (Math.random() > 0.5 ? 1 : -1)

      sellPrice = Number.parseFloat((buyPrice * (1 + actualChange)).toFixed(2))
      profit = Number.parseFloat((sellPrice - buyPrice).toFixed(2))

      // Calculate accuracy based on direction and magnitude
      const predictedDirection = predictedPrice > buyPrice
      const actualDirection = sellPrice > buyPrice

      if (predictedDirection === actualDirection) {
        const predictedMagnitude = Math.abs(predictedPrice - buyPrice)
        const actualMagnitude = Math.abs(sellPrice - buyPrice)
        const magnitudeRatio =
          Math.min(actualMagnitude, predictedMagnitude) / Math.max(actualMagnitude, predictedMagnitude)
        accuracy = Number.parseFloat((80 + magnitudeRatio * 20).toFixed(1))
      } else {
        accuracy = Number.parseFloat((Math.random() * 40).toFixed(1))
      }
    }

    records.push({
      id: `pred-${i}`,
      timestamp: timestamp.toISOString(),
      asset: asset.name,
      symbol: asset.symbol,
      confidence,
      buyPrice,
      predictedPrice,
      holdTime,
      sellPrice,
      profit,
      accuracy,
      status,
      strategy,
    })
  }

  return records
}

// Hexagon background component
const HexagonBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute w-full h-full">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute border border-[#00ff4c]/30"
            style={{
              width: `${Math.random() * 200 + 50}px`,
              height: `${Math.random() * 200 + 50}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
              opacity: Math.random() * 0.5 + 0.1,
              clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            }}
          />
        ))}
      </div>
    </div>
  )
}

// Futuristic grid overlay
const FuturisticGrid = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 opacity-10">
      <div className="w-full h-full grid grid-cols-12 grid-rows-12">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={`col-${i}`} className="border-r border-[#00ff4c]/30 h-full" />
        ))}
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={`row-${i}`} className="border-b border-[#00ff4c]/30 w-full" />
        ))}
      </div>
    </div>
  )
}

// Ticker component
const ResultsTicker = ({ portfolios }: { portfolios: PortfolioData[] }) => {
  return (
    <div className="w-full bg-black border-b border-[#00ff4c]/30 py-2 overflow-hidden">
      <div className="flex items-center space-x-4 animate-marquee">
        {portfolios.map((portfolio) => {
          // Calculate current value and profit percentage
          const currentValue =
            portfolio.data.length > 0 ? portfolio.data[portfolio.data.length - 1].value : portfolio.initialInvestment
          const profitPercentage = ((currentValue - portfolio.initialInvestment) / portfolio.initialInvestment) * 100

          return (
            <div key={portfolio.id} className="flex items-center space-x-2 whitespace-nowrap">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: portfolio.color }}></div>
              <span className="text-white font-medium">{portfolio.name}:</span>
              <span className={`${profitPercentage >= 0 ? "text-[#00ff4c]" : "text-red-400"} font-bold`}>
                {profitPercentage >= 0 ? "+" : ""}
                {profitPercentage.toFixed(2)}%
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Master Portfolio Component
const MasterPortfolio = ({
  portfolios,
  investmentAmount = 1000,
}: { portfolios: PortfolioData[]; investmentAmount?: number }) => {
  const timestamp = new Date().toISOString()
  const totalInitialInvestment = portfolios.length * investmentAmount
  const totalCurrentValue = portfolios.reduce((sum, p) => sum + (p.currentValue / 10000) * investmentAmount, 0)
  const totalProfit = totalCurrentValue - totalInitialInvestment
  const totalProfitPercentage = (totalProfit / totalInitialInvestment) * 100

  // Calculate best and worst performers
  const sortedByPerformance = [...portfolios].sort((a, b) => b.percentageGain - a.percentageGain)
  const bestPerformer = sortedByPerformance[0]
  const worstPerformer = sortedByPerformance[sortedByPerformance.length - 1]

  // Calculate average accuracy
  const avgAccuracy = portfolios.reduce((sum, p) => sum + p.accuracy, 0) / portfolios.length

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-white">Master Portfolio</h2>
          <p className="text-sm text-gray-400">Combined performance of all strategies ($1k initial investment each)</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs text-gray-400 flex items-center">
            <Clock3 className="h-3 w-3 mr-1" />
            Last updated: {new Date().toLocaleTimeString()}
          </div>
          <div className="text-xs text-gray-400 flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Master Portfolio Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <motion.div
          className="bg-black border border-[#00ff4c]/30 rounded-lg p-4 shadow-[0_0_15px_rgba(0,255,0,0.2)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-gray-400 text-sm mb-1">Total Value</div>
          <div className="text-2xl font-bold text-white">
            ${totalCurrentValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center mt-1">
            <span className={`text-sm ${totalProfit >= 0 ? "text-[#00ff4c]" : "text-red-400"} flex items-center`}>
              {totalProfit >= 0 ? (
                <ArrowUpRight className="h-3 w-3 mr-1" />
              ) : (
                <ArrowDownRight className="h-3 w-3 mr-1" />
              )}
              ${Math.abs(totalProfit).toLocaleString(undefined, { maximumFractionDigits: 2 })}(
              {totalProfitPercentage.toFixed(2)}%)
            </span>
          </div>
        </motion.div>

        <motion.div
          className="bg-black border border-[#00ff4c]/30 rounded-lg p-4 shadow-[0_0_15px_rgba(0,255,0,0.2)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="text-gray-400 text-sm mb-1">Initial Investment</div>
          <div className="text-2xl font-bold text-white">${totalInitialInvestment.toLocaleString()}</div>
          <div className="flex items-center mt-1">
            <span className="text-sm text-gray-400 flex items-center">
              <BarChart className="h-3 w-3 mr-1" />
              {portfolios.length} strategies × $1,000
            </span>
          </div>
        </motion.div>

        <motion.div
          className="bg-black border border-[#00ff4c]/30 rounded-lg p-4 shadow-[0_0_15px_rgba(0,255,0,0.2)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="text-gray-400 text-sm mb-1">Best Performer</div>
          <div className="text-2xl font-bold" style={{ color: bestPerformer?.color || "#00ff4c" }}>
            {bestPerformer?.name || "N/A"}
          </div>
          <div className="flex items-center mt-1">
            <span className="text-sm text-[#00ff4c] flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />+{bestPerformer?.percentageGain.toFixed(2) || 0}%
            </span>
          </div>
        </motion.div>

        <motion.div
          className="bg-black border border-[#00ff4c]/30 rounded-lg p-4 shadow-[0_0_15px_rgba(0,255,0,0.2)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="text-gray-400 text-sm mb-1">Average Accuracy</div>
          <div className="text-2xl font-bold text-white">{avgAccuracy.toFixed(1)}%</div>
          <div className="flex items-center mt-1">
            <span className="text-sm text-gray-400 flex items-center">
              <Award className="h-3 w-3 mr-1" />
              Prediction success rate
            </span>
          </div>
        </motion.div>
      </div>

      {/* Strategy Scoreboard */}
      <div className="bg-black border border-[#00ff4c]/30 rounded-lg shadow-[0_0_15px_rgba(0,255,0,0.2)] overflow-hidden">
        <div className="p-4 border-b border-[#00ff4c]/30 flex justify-between items-center">
          <h3 className="text-white font-bold flex items-center">
            <Sparkles className="h-4 w-4 mr-2 text-[#00ff4c]" />
            Strategy Scoreboard
          </h3>
          <div className="text-xs text-gray-400">Timestamp: {timestamp}</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-black/50">
                <th className="px-4 py-3 text-left text-xs font-medium text-[#00ff4c] uppercase tracking-wider">
                  Strategy
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#00ff4c] uppercase tracking-wider">
                  Initial
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#00ff4c] uppercase tracking-wider">
                  Current Value
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#00ff4c] uppercase tracking-wider">
                  Profit/Loss
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#00ff4c] uppercase tracking-wider">
                  ROI %
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#00ff4c] uppercase tracking-wider">
                  Accuracy
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#00ff4c] uppercase tracking-wider">
                  Volatility
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#00ff4c] uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#00ff4c]/10">
              <AnimatePresence>
                {portfolios.map((portfolio, index) => {
                  const currentValue = (portfolio.currentValue / 10000) * investmentAmount
                  const profit = currentValue - investmentAmount
                  const profitPercentage = (profit / investmentAmount) * 100

                  // Calculate volatility based on data points
                  let volatility = "Low"
                  if (portfolio.data.length > 2) {
                    const values = portfolio.data.map((d) => d.value)
                    const changes = values.slice(1).map((val, i) => Math.abs((val - values[i]) / values[i]))
                    const avgChange = changes.reduce((sum, val) => sum + val, 0) / changes.length

                    if (avgChange > 0.02) volatility = "High"
                    else if (avgChange > 0.01) volatility = "Medium"
                  }

                  return (
                    <motion.tr
                      key={portfolio.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="hover:bg-[#00ff4c]/5"
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full bg-black/50 border border-[#00ff4c]/20">
                            {portfolio.icon}
                          </div>
                          <div className="ml-3">
                            <div className="font-medium" style={{ color: portfolio.color }}>
                              {portfolio.name}
                            </div>
                            <div className="text-xs text-gray-400">{portfolio.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                        ${investmentAmount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">
                        ${currentValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <span className={`${profit >= 0 ? "text-[#00ff4c]" : "text-red-400"} font-medium`}>
                          {profit >= 0 ? "+" : "-"}$
                          {Math.abs(profit).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div
                          className={`text-sm font-medium ${profitPercentage >= 0 ? "text-[#00ff4c]" : "text-red-400"}`}
                        >
                          {profitPercentage >= 0 ? "+" : ""}
                          {profitPercentage.toFixed(2)}%
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-1 mt-1">
                          <div
                            className={`h-1 rounded-full ${profitPercentage >= 0 ? "bg-[#00ff4c]" : "bg-red-400"}`}
                            style={{ width: `${Math.min(Math.abs(profitPercentage), 100)}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-white">{portfolio.accuracy.toFixed(1)}%</div>
                          <div className="ml-2 flex">
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                className={`w-1 h-4 mx-px rounded-sm ${
                                  i < Math.round(portfolio.accuracy / 20) ? "bg-[#00ff4c]" : "bg-gray-700"
                                }`}
                              ></div>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            volatility === "High"
                              ? "bg-red-900/30 text-red-400"
                              : volatility === "Medium"
                                ? "bg-yellow-900/30 text-yellow-400"
                                : "bg-green-900/30 text-green-400"
                          }`}
                        >
                          {volatility}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <span className="px-2 py-1 text-xs rounded-full bg-[#00ff4c]/20 text-[#00ff4c]">Active</span>
                      </td>
                    </motion.tr>
                  )
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-[#00ff4c]/30 bg-black/50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-400">
              Total Strategies: <span className="text-[#00ff4c]">{portfolios.length}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-400">Total ROI: </span>
              <span className={`font-medium ${totalProfitPercentage >= 0 ? "text-[#00ff4c]" : "text-red-400"}`}>
                {totalProfitPercentage >= 0 ? "+" : ""}
                {totalProfitPercentage.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProofContent() {
  const [timeRange, setTimeRange] = useState<"1H" | "1D" | "1W" | "1M" | "1Y">("1D")
  const [chartType, setChartType] = useState<"line" | "candles" | "area">("line")
  const [portfolios, setPortfolios] = useState<PortfolioData[]>([])
  const [predictions, setPredictions] = useState<PredictionRecord[]>([])
  const [selectedPortfolios, setSelectedPortfolios] = useState<string[]>(["infinity-ai", "sp500"])
  const [initialInvestment, setInitialInvestment] = useState<number>(10000)
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [zoomLevel, setZoomLevel] = useState<number>(1)
  const [yAxisIncrement, setYAxisIncrement] = useState<number>(1000)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [showVolume, setShowVolume] = useState<boolean>(true)
  const [showGrid, setShowGrid] = useState<boolean>(true)
  const [showPredictions, setShowPredictions] = useState<boolean>(true)
  const [hoverPoint, setHoverPoint] = useState<number | null>(null)
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [chartMaxValue, setChartMaxValue] = useState<number>(20000)
  const contentRef = useRef<HTMLDivElement>(null)

  // Initialize with mock data
  useEffect(() => {
    generateMockData()
  }, [])

  // Generate mock data
  const generateMockData = () => {
    setIsLoading(true)

    setTimeout(() => {
      const newPortfolios = generatePortfolios()

      // Calculate current values and percentage gains for each portfolio
      const updatedPortfolios = newPortfolios.map((portfolio) => {
        const lastDataPoint = portfolio.data[portfolio.data.length - 1]
        return {
          ...portfolio,
          currentValue: lastDataPoint.value,
          percentageGain: ((lastDataPoint.value - portfolio.initialInvestment) / portfolio.initialInvestment) * 100,
          accuracy: Math.floor(Math.random() * 30) + 70, // Random accuracy between 70-99%
        }
      })

      setPortfolios(updatedPortfolios)
      setPredictions(generatePredictionRecords())
      setLastUpdated(new Date())
      setIsLoading(false)
    }, 1000)
  }

  // Clear all data
  const clearData = () => {
    setIsLoading(true)

    setTimeout(() => {
      const emptyPortfolios = portfolios.map((portfolio) => ({
        ...portfolio,
        currentValue: 10000,
        percentageGain: 0,
        accuracy: 0,
        data: [],
      }))

      setPortfolios(emptyPortfolios)
      setPredictions([])
      setLastUpdated(new Date())
      setIsLoading(false)
    }, 500)
  }

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true)
    generateMockData()
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1000)
  }

  // Get days based on time range
  const getDaysFromTimeRange = (range: "1H" | "1D" | "1W" | "1M" | "1Y"): number => {
    switch (range) {
      case "1H":
        return 0.042 // 1 hour = 0.042 days
      case "1D":
        return 1
      case "1W":
        return 7
      case "1M":
        return 30
      case "1Y":
        return 365
      default:
        return 1
    }
  }

  // Filter data based on time range
  const getFilteredData = () => {
    const days = getDaysFromTimeRange(timeRange)

    return portfolios.map((portfolio) => {
      // Filter data based on time range
      const filteredData = portfolio.data.slice(
        -Math.ceil(days * (timeRange === "1H" ? 60 : timeRange === "1D" ? 24 : 1)),
      )

      return {
        ...portfolio,
        data: filteredData,
      }
    })
  }

  // Toggle portfolio selection
  const togglePortfolio = (portfolioId: string) => {
    if (selectedPortfolios.includes(portfolioId)) {
      // Don't remove if it's the last one
      if (selectedPortfolios.length > 1) {
        setSelectedPortfolios(selectedPortfolios.filter((id) => id !== portfolioId))
      }
    } else {
      setSelectedPortfolios([...selectedPortfolios, portfolioId])
    }
  }

  // Calculate overall metrics
  const calculateOverallMetrics = () => {
    if (portfolios.length === 0) return { accuracy: 0, profit: 0, trades: 0, winRate: 0 }

    const completedPredictions = predictions.filter((p) => p.status === "completed")
    const successfulPredictions = completedPredictions.filter((p) => p.profit !== null && p.profit > 0)

    return {
      accuracy: portfolios.reduce((sum, p) => sum + p.accuracy, 0) / portfolios.length,
      profit: portfolios.reduce((sum, p) => sum + p.percentageGain, 0) / portfolios.length,
      trades: completedPredictions.length,
      winRate: completedPredictions.length > 0 ? (successfulPredictions.length / completedPredictions.length) * 100 : 0,
    }
  }

  const metrics = calculateOverallMetrics()
  const filteredPortfolios = getFilteredData()

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date)
  }

  // Add this function to select all portfolios
  const toggleAllPortfolios = () => {
    if (selectedPortfolios.length === portfolios.length) {
      // If all are selected, just keep infinity-ai and sp500
      setSelectedPortfolios(["infinity-ai", "sp500"])
    } else {
      // Otherwise select all
      setSelectedPortfolios(portfolios.map((p) => p.id))
    }
  }

  // Handle sorting
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("desc")
    }
  }

  // Filter and sort predictions
  const filteredAndSortedPredictions = useMemo(() => {
    let result = [...predictions]

    // Apply search filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase()
      result = result.filter(
        (pred) =>
          pred.asset.toLowerCase().includes(lowerSearchTerm) ||
          pred.symbol.toLowerCase().includes(lowerSearchTerm) ||
          pred.strategy.toLowerCase().includes(lowerSearchTerm),
      )
    }

    // Apply status filter
    if (filterStatus) {
      result = result.filter((pred) => pred.status === filterStatus)
    }

    // Apply sorting
    if (sortColumn) {
      result.sort((a, b) => {
        let aValue: any = a[sortColumn as keyof PredictionRecord]
        let bValue: any = b[sortColumn as keyof PredictionRecord]

        // Handle null values
        if (aValue === null) return sortDirection === "asc" ? -1 : 1
        if (bValue === null) return sortDirection === "asc" ? 1 : -1

        // Convert to numbers for numeric columns
        if (
          sortColumn === "buyPrice" ||
          sortColumn === "predictedPrice" ||
          sortColumn === "sellPrice" ||
          sortColumn === "profit" ||
          sortColumn === "confidence" ||
          sortColumn === "accuracy"
        ) {
          aValue = Number(aValue)
          bValue = Number(bValue)
        }

        // Handle date sorting
        if (sortColumn === "timestamp") {
          aValue = new Date(aValue).getTime()
          bValue = new Date(bValue).getTime()
        }

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
        return 0
      })
    }

    return result
  }, [predictions, searchTerm, filterStatus, sortColumn, sortDirection])

  return (
    <div ref={contentRef} className="relative flex-1 overflow-y-auto bg-black p-4 pt-16">
      <div className="hexagon-grid"></div>
      <div className="hexagon-overlay"></div>
      <div className="hexagon-glow"></div>

      {/* Results Ticker at the top */}
      <ResultsTicker portfolios={portfolios} />

      {/* Top Ticker */}
      <div className="relative mb-6 overflow-hidden rounded-lg bg-black border border-[#00ff4c]/50 p-4 shadow-[0_0_15px_rgba(0,255,0,0.3)]">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Performance Proof</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Last updated: {lastUpdated.toLocaleTimeString()}</span>
            <Button
              variant="outline"
              size="sm"
              className="border-white bg-black text-white hover:bg-white/15"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              <span className="ml-2">{isRefreshing ? "Refreshing..." : "Refresh"}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-red-500 bg-black text-red-500 hover:bg-red-500/10"
              onClick={clearData}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Data
            </Button>
          </div>
        </div>

        {/* Top Metrics Cards */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <motion.div
            className="rounded-md bg-black border border-[#00ff4c]/30 p-3 shadow-[0_0_10px_rgba(0,255,0,0.2)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400">Accuracy</div>
              <TrendingUp className="h-4 w-4 text-[#00ff4c]" />
            </div>
            <div className="mt-1 text-2xl font-bold text-white">{metrics.accuracy.toFixed(1)}%</div>
          </motion.div>

          <motion.div
            className="rounded-md bg-black border border-[#00ff4c]/30 p-3 shadow-[0_0_10px_rgba(0,255,0,0.2)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400">Portfolio Profit</div>
              <DollarSign className="h-4 w-4 text-[#00ff4c]" />
            </div>
            <div className="mt-1 text-2xl font-bold text-white">+{metrics.profit.toFixed(1)}%</div>
          </motion.div>

          <motion.div
            className="rounded-md bg-black border border-[#00ff4c]/30 p-3 shadow-[0_0_10px_rgba(0,255,0,0.2)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400">Completed Trades</div>
              <Clock className="h-4 w-4 text-[#00ff4c]" />
            </div>
            <div className="mt-1 text-2xl font-bold text-white">{metrics.trades}</div>
          </motion.div>

          <motion.div
            className="rounded-md bg-black border border-[#00ff4c]/30 p-3 shadow-[0_0_10px_rgba(0,255,0,0.2)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400">Win Rate</div>
              <TrendingUp className="h-4 w-4 text-[#00ff4c]" />
            </div>
            <div className="mt-1 text-2xl font-bold text-white">{metrics.winRate.toFixed(1)}%</div>
          </motion.div>
        </div>
      </div>

      {/* Main Chart */}
      <Card className="relative mb-10 border-[#00ff4c]/50 bg-black shadow-[0_0_15px_rgba(0,255,0,0.2)]">
        <CardContent className="p-4">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-white">Portfolio Performance</h2>
              <p className="text-sm text-gray-400">Compare our strategies against market benchmarks</p>
            </div>

            {/* Chart Controls */}
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant={timeRange === "1H" ? "default" : "outline"}
                size="sm"
                className={
                  timeRange === "1H"
                    ? "bg-[#00ff4c] text-black hover:bg-[#00ff4c]/80"
                    : "border-white text-white hover:bg-white/15"
                }
                onClick={() => setTimeRange("1H")}
              >
                1H
              </Button>
              <Button
                variant={timeRange === "1D" ? "default" : "outline"}
                size="sm"
                className={
                  timeRange === "1D"
                    ? "bg-[#00ff4c] text-black hover:bg-[#00ff4c]/80"
                    : "border-white text-white hover:bg-white/15"
                }
                onClick={() => setTimeRange("1D")}
              >
                1D
              </Button>
              <Button
                variant={timeRange === "1W" ? "default" : "outline"}
                size="sm"
                className={
                  timeRange === "1W"
                    ? "bg-[#00ff4c] text-black hover:bg-[#00ff4c]/80"
                    : "border-white text-white hover:bg-white/15"
                }
                onClick={() => setTimeRange("1W")}
              >
                1W
              </Button>
              <Button
                variant={timeRange === "1M" ? "default" : "outline"}
                size="sm"
                className={
                  timeRange === "1M"
                    ? "bg-[#00ff4c] text-black hover:bg-[#00ff4c]/80"
                    : "border-white text-white hover:bg-white/15"
                }
                onClick={() => setTimeRange("1M")}
              >
                1M
              </Button>
              <Button
                variant={timeRange === "1Y" ? "default" : "outline"}
                size="sm"
                className={
                  timeRange === "1Y"
                    ? "bg-[#00ff4c] text-black hover:bg-[#00ff4c]/80"
                    : "border-white text-white hover:bg-white/15"
                }
                onClick={() => setTimeRange("1Y")}
              >
                1Y
              </Button>
            </div>
          </div>

          <div className="mb-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-sm text-gray-400">Initial Investment</div>
              <div className="text-sm font-medium text-white">{formatCurrency(initialInvestment)}</div>
            </div>
            <Slider
              defaultValue={[initialInvestment]}
              min={1000}
              max={100000}
              step={1000}
              className="py-4"
              onValueChange={(value) => setInitialInvestment(value[0])}
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            className="border-white text-white hover:bg-white/15 mb-4"
            onClick={() => setChartMaxValue(chartMaxValue + 10000)}
          >
            Increase Range
          </Button>

          {/* Advanced Trading Chart */}
          <TradingChart
            symbol="INFINITY-AI"
            initialTimeframe={
              timeRange === "1H"
                ? "1h"
                : timeRange === "1D"
                  ? "1d"
                  : timeRange === "1W"
                    ? "1w"
                    : timeRange === "1M"
                      ? "1d"
                      : "1w"
            }
            height={450}
            showVolume={showVolume}
            showGrid={showGrid}
            initialInvestment={initialInvestment}
            onRefresh={handleRefresh}
            onClearData={clearData}
            defaultChartType={chartType}
            brandColor="#00ff4c"
          />
        </CardContent>
      </Card>

      {/* Master Portfolio Dashboard */}
      <MasterPortfolio portfolios={portfolios} investmentAmount={1000} />

      {/* Portfolio Cards */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Strategy Portfolios</h2>
        <Button
          variant="outline"
          size="sm"
          className="border-white text-white hover:bg-white/15"
          onClick={toggleAllPortfolios}
        >
          {selectedPortfolios.length === portfolios.length ? "Deselect All" : "Select All"}
        </Button>
      </div>
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {portfolios.map((portfolio, index) => (
          <motion.div
            key={portfolio.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card
              className={`border-[#00ff4c]/50 bg-black transition-all duration-300 ${
                selectedPortfolios.includes(portfolio.id)
                  ? "shadow-[0_0_15px_rgba(0,255,0,0.4)]"
                  : "opacity-70 shadow-[0_0_5px_rgba(0,255,0,0.2)]"
              }`}
              onClick={() => togglePortfolio(portfolio.id)}
            >
              <CardContent className="p-4 cursor-pointer">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-2 h-3 w-3 rounded-full" style={{ backgroundColor: portfolio.color }} />
                    <h3 className="font-bold" style={{ color: portfolio.color }}>
                      {portfolio.name}
                    </h3>
                  </div>
                  <div className="flex items-center">{portfolio.icon}</div>
                </div>

                <p className="mb-3 text-xs text-gray-400">{portfolio.description}</p>

                <div className="mb-2 grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-xs text-gray-400">Current Value</div>
                    <div className="text-sm font-bold text-white">
                      {formatCurrency((portfolio.currentValue / 10000) * initialInvestment)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Profit/Loss</div>
                    <div
                      className={`text-sm font-bold ${portfolio.percentageGain >= 0 ? "text-[#00ff4c]" : "text-red-400"}`}
                    >
                      {portfolio.percentageGain >= 0 ? "+" : ""}
                      {portfolio.percentageGain.toFixed(1)}%
                    </div>
                  </div>
                </div>

                {portfolio.id !== "sp500" && (
                  <div className="mb-2">
                    <div className="text-xs text-gray-400">Prediction Accuracy</div>
                    <div className="text-sm font-bold text-white">{portfolio.accuracy.toFixed(1)}%</div>
                  </div>
                )}

                <div className="h-[60px]">
                  {portfolio.data.length === 0 ? (
                    <div className="text-xs text-gray-500 h-full flex items-center justify-center">
                      No data available yet
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={portfolio.data.slice(-30)} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                        <Line type="monotone" dataKey="value" stroke={portfolio.color} strokeWidth={1.5} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Prediction Table */}
      <h2 className="mb-4 text-xl font-bold text-white">Real-Time Predictions</h2>
      <Card className="mb-6 border-[#00ff4c]/50 bg-black shadow-[0_0_15px_rgba(0,255,0,0.2)]">
        <CardContent className="p-4">
          {predictions.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center">
              <TrendingUp className="h-16 w-16 text-[#00ff4c]/30 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Predictions Yet</h3>
              <p className="text-gray-400 text-center max-w-md mb-4">
                Our AI is waiting for market data to start making predictions. Check back soon to see our real-time
                trading signals.
              </p>
              <Button variant="outline" className="border-white text-white hover:bg-white/15" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Generate Mock Predictions
              </Button>
            </div>
          ) : (
            <div>
              {/* Excel-style controls */}
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-[#00ff4c]/30 pb-4">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search assets, symbols..."
                      className="h-9 w-[200px] rounded-md border border-[#00ff4c]/30 bg-black pl-8 pr-3 text-sm text-white placeholder:text-gray-400 focus:border-[#00ff4c] focus:outline-none"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <select
                      className="h-9 appearance-none rounded-md border border-[#00ff4c]/30 bg-black px-3 pr-8 text-sm text-white focus:border-[#00ff4c] focus:outline-none"
                      value={filterStatus || ""}
                      onChange={(e) => setFilterStatus(e.target.value || null)}
                    >
                      <option value="">All Status</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="failed">Failed</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white text-white hover:bg-white/15"
                    onClick={handleRefresh}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                  <Button variant="outline" size="sm" className="border-white text-white hover:bg-white/15">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              {/* Excel-style table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#00ff4c]/10 border-t border-b border-[#00ff4c]/30">
                      <th
                        className="px-4 py-3 text-left text-xs font-medium text-[#00ff4c] uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("timestamp")}
                      >
                        <div className="flex items-center">
                          Timestamp
                          {sortColumn === "timestamp" &&
                            (sortDirection === "asc" ? (
                              <ChevronUp className="ml-1 h-4 w-4" />
                            ) : (
                              <ChevronDown className="ml-1 h-4 w-4" />
                            ))}
                          {sortColumn !== "timestamp" && <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />}
                        </div>
                      </th>
                      <th
                        className="px-4 py-3 text-left text-xs font-medium text-[#00ff4c] uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("strategy")}
                      >
                        <div className="flex items-center">
                          Strategy
                          {sortColumn === "strategy" &&
                            (sortDirection === "asc" ? (
                              <ChevronUp className="ml-1 h-4 w-4" />
                            ) : (
                              <ChevronDown className="ml-1 h-4 w-4" />
                            ))}
                          {sortColumn !== "strategy" && <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />}
                        </div>
                      </th>
                      <th
                        className="px-4 py-3 text-left text-xs font-medium text-[#00ff4c] uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("asset")}
                      >
                        <div className="flex items-center">
                          Asset
                          {sortColumn === "asset" &&
                            (sortDirection === "asc" ? (
                              <ChevronUp className="ml-1 h-4 w-4" />
                            ) : (
                              <ChevronDown className="ml-1 h-4 w-4" />
                            ))}
                          {sortColumn !== "asset" && <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />}
                        </div>
                      </th>
                      <th
                        className="px-4 py-3 text-left text-xs font-medium text-[#00ff4c] uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("symbol")}
                      >
                        <div className="flex items-center">
                          Symbol
                          {sortColumn === "symbol" &&
                            (sortDirection === "asc" ? (
                              <ChevronUp className="ml-1 h-4 w-4" />
                            ) : (
                              <ChevronDown className="ml-1 h-4 w-4" />
                            ))}
                          {sortColumn !== "symbol" && <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />}
                        </div>
                      </th>
                      <th
                        className="px-4 py-3 text-left text-xs font-medium text-[#00ff4c] uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("confidence")}
                      >
                        <div className="flex items-center">
                          Confidence
                          {sortColumn === "confidence" &&
                            (sortDirection === "asc" ? (
                              <ChevronUp className="ml-1 h-4 w-4" />
                            ) : (
                              <ChevronDown className="ml-1 h-4 w-4" />
                            ))}
                          {sortColumn !== "confidence" && <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />}
                        </div>
                      </th>
                      <th
                        className="px-4 py-3 text-left text-xs font-medium text-[#00ff4c] uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("buyPrice")}
                      >
                        <div className="flex items-center">
                          Buy Price
                          {sortColumn === "buyPrice" &&
                            (sortDirection === "asc" ? (
                              <ChevronUp className="ml-1 h-4 w-4" />
                            ) : (
                              <ChevronDown className="ml-1 h-4 w-4" />
                            ))}
                          {sortColumn !== "buyPrice" && <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />}
                        </div>
                      </th>
                      <th
                        className="px-4 py-3 text-left text-xs font-medium text-[#00ff4c] uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("predictedPrice")}
                      >
                        <div className="flex items-center">
                          Predicted
                          {sortColumn === "predictedPrice" &&
                            (sortDirection === "asc" ? (
                              <ChevronUp className="ml-1 h-4 w-4" />
                            ) : (
                              <ChevronDown className="ml-1 h-4 w-4" />
                            ))}
                          {sortColumn !== "predictedPrice" && <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />}
                        </div>
                      </th>
                      <th
                        className="px-4 py-3 text-left text-xs font-medium text-[#00ff4c] uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("holdTime")}
                      >
                        <div className="flex items-center">
                          Hold Time
                          {sortColumn === "holdTime" &&
                            (sortDirection === "asc" ? (
                              <ChevronUp className="ml-1 h-4 w-4" />
                            ) : (
                              <ChevronDown className="ml-1 h-4 w-4" />
                            ))}
                          {sortColumn !== "holdTime" && <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />}
                        </div>
                      </th>
                      <th
                        className="px-4 py-3 text-left text-xs font-medium text-[#00ff4c] uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("sellPrice")}
                      >
                        <div className="flex items-center">
                          Sell Price
                          {sortColumn === "sellPrice" &&
                            (sortDirection === "asc" ? (
                              <ChevronUp className="ml-1 h-4 w-4" />
                            ) : (
                              <ChevronDown className="ml-1 h-4 w-4" />
                            ))}
                          {sortColumn !== "sellPrice" && <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />}
                        </div>
                      </th>
                      <th
                        className="px-4 py-3 text-left text-xs font-medium text-[#00ff4c] uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("profit")}
                      >
                        <div className="flex items-center">
                          Profit
                          {sortColumn === "profit" &&
                            (sortDirection === "asc" ? (
                              <ChevronUp className="ml-1 h-4 w-4" />
                            ) : (
                              <ChevronDown className="ml-1 h-4 w-4" />
                            ))}
                          {sortColumn !== "profit" && <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />}
                        </div>
                      </th>
                      <th
                        className="px-4 py-3 text-left text-xs font-medium text-[#00ff4c] uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("accuracy")}
                      >
                        <div className="flex items-center">
                          Accuracy
                          {sortColumn === "accuracy" &&
                            (sortDirection === "asc" ? (
                              <ChevronUp className="ml-1 h-4 w-4" />
                            ) : (
                              <ChevronDown className="ml-1 h-4 w-4" />
                            ))}
                          {sortColumn !== "accuracy" && <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />}
                        </div>
                      </th>
                      <th
                        className="px-4 py-3 text-left text-xs font-medium text-[#00ff4c] uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("status")}
                      >
                        <div className="flex items-center">
                          Status
                          {sortColumn === "status" &&
                            (sortDirection === "asc" ? (
                              <ChevronUp className="ml-1 h-4 w-4" />
                            ) : (
                              <ChevronDown className="ml-1 h-4 w-4" />
                            ))}
                          {sortColumn !== "status" && <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />}
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#00ff4c]/10">
                    {filteredAndSortedPredictions.map((prediction) => (
                      <tr key={prediction.id} className="border-b border-[#00ff4c]/10 hover:bg-[#00ff4c]/5">
                        <td className="px-4 py-2 text-sm text-white">{formatDate(prediction.timestamp)}</td>
                        <td className="px-4 py-2 text-sm text-white">{prediction.strategy}</td>
                        <td className="px-4 py-2 text-sm text-white">{prediction.asset}</td>
                        <td className="px-4 py-2 text-sm font-medium text-[#00ff4c]">{prediction.symbol}</td>
                        <td className="px-4 py-2 text-sm text-white">{prediction.confidence}%</td>
                        <td className="px-4 py-2 text-sm text-white">${prediction.buyPrice}</td>
                        <td
                          className={`px-4 py-2 text-sm ${prediction.predictedPrice > prediction.buyPrice ? "text-[#00ff4c]" : "text-red-400"}`}
                        >
                          ${prediction.predictedPrice}
                        </td>
                        <td className="px-4 py-2 text-sm text-white">{prediction.holdTime}</td>
                        <td className="px-4 py-2 text-sm text-white">
                          {prediction.sellPrice ? `$${prediction.sellPrice}` : "-"}
                        </td>
                        <td
                          className={`px-4 py-2 text-sm ${
                            prediction.profit
                              ? prediction.profit > 0
                                ? "text-[#00ff4c]"
                                : "text-red-400"
                              : "text-white"
                          }`}
                        >
                          {prediction.profit
                            ? prediction.profit > 0
                              ? `+$${prediction.profit}`
                              : `-$${Math.abs(prediction.profit)}`
                            : "-"}
                        </td>
                        <td className="px-4 py-2 text-sm text-white">
                          {prediction.accuracy ? `${prediction.accuracy}%` : "-"}
                        </td>
                        <td className="px-4 py-2 text-sm">
                          <Badge
                            className={`
                            ${
                              prediction.status === "active"
                                ? "bg-[#00ff4c] hover:bg-[#00ff4c]/80"
                                : prediction.status === "completed"
                                  ? "bg-[#00ff4c]/80 hover:bg-[#00ff4c]/70"
                                  : "bg-red-500 hover:bg-red-600"
                            }
                          `}
                          >
                            {prediction.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  Showing {filteredAndSortedPredictions.length} of {predictions.length} predictions
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="border-white text-white hover:bg-white/15">
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" className="border-white bg-white/15 text-white">
                    1
                  </Button>
                  <Button variant="outline" size="sm" className="border-white text-white hover:bg-white/15">
                    2
                  </Button>
                  <Button variant="outline" size="sm" className="border-white text-white hover:bg-white/15">
                    3
                  </Button>
                  <Button variant="outline" size="sm" className="border-white text-white hover:bg-white/15">
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <div className="rounded-lg border border-[#00ff4c]/30 bg-black bg-opacity-50 p-4 text-sm text-gray-400">
        <div className="flex items-start">
          <Info className="mr-2 h-5 w-5 flex-shrink-0 text-[#00ff4c]" />
          <div>
            <p className="mb-2">
              <strong className="text-[#00ff4c]">Disclaimer:</strong> Past performance is not indicative of future
              results. The data presented here is for demonstration purposes and represents our paper trading
              simulation.
            </p>
            <p>
              All predictions are based on our proprietary algorithms and models. Trading involves risk, and you should
              always conduct your own research before making investment decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
