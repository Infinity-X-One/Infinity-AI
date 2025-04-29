"use client"

import { useState, useEffect, useMemo } from "react"
import {
  ArrowRight,
  Zap,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Newspaper,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  LineChart,
  Lightbulb,
  Target,
  Bookmark,
  Star,
  Filter,
  Cpu,
  Heart,
  Landmark,
  Bitcoin,
  FileText,
  Banknote,
  ShoppingCart,
  Home,
  Plane,
  Factory,
  Wheat,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useData } from "@/contexts/data-context"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { MarketTicker } from "./market-ticker"

// Define available sectors
const sectors = [
  { id: "all", name: "All", icon: <Target size={16} /> },
  { id: "technology", name: "Tech", icon: <Cpu size={16} /> },
  { id: "healthcare", name: "Health", icon: <Heart size={16} /> },
  { id: "finance", name: "Finance", icon: <Landmark size={16} /> },
  { id: "energy", name: "Energy", icon: <Zap size={16} /> },
  { id: "cryptocurrency", name: "Crypto", icon: <Bitcoin size={16} /> },
  { id: "bonds", name: "Bonds", icon: <FileText size={16} /> },
  { id: "forex", name: "Forex", icon: <Banknote size={16} /> },
  { id: "consumer", name: "Consumer", icon: <ShoppingCart size={16} /> },
  { id: "realestate", name: "Real Estate", icon: <Home size={16} /> },
  { id: "travel", name: "Travel", icon: <Plane size={16} /> },
  { id: "industrial", name: "Industrial", icon: <Factory size={16} /> },
  { id: "agriculture", name: "Agriculture", icon: <Wheat size={16} /> },
]

export default function PredictionsContent() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [expandedSectors, setExpandedSectors] = useState<Record<string, boolean>>({})
  const [selectedSector, setSelectedSector] = useState("all")
  const [isMobileDetailView, setIsMobileDetailView] = useState(false)
  const [selectedPrediction, setSelectedPrediction] = useState<string | null>(null)
  const { marketData, sentimentData, predictions, refreshData, isLoading, error } = useData()

  // Mock top predictions data
  const topPredictions = useMemo(() => {
    return [
      {
        id: "1",
        sector: "Technology",
        symbol: "NVDA",
        name: "NVIDIA Corporation",
        currentPrice: 875.28,
        predictedPrice: 950.45,
        predictedChange: 8.6,
        confidence: 94,
        timeframe: "30 days",
        trend: "bullish",
        news: [
          {
            title: "NVIDIA Announces Next-Gen AI Chips with 2x Performance",
            source: "TechCrunch",
            date: "2 days ago",
            sentiment: "positive",
            impact: "high",
          },
          {
            title: "Cloud Providers Increase AI Infrastructure Spending by 45%",
            source: "Bloomberg",
            date: "1 week ago",
            sentiment: "positive",
            impact: "high",
          },
          {
            title: "Semiconductor Industry Faces Supply Constraints Through 2025",
            source: "Reuters",
            date: "3 days ago",
            sentiment: "neutral",
            impact: "medium",
          },
        ],
        sentiment: {
          overall: "very positive",
          score: 8.7,
          social: 9.2,
          news: 8.5,
          analyst: 8.4,
        },
        technicalIndicators: {
          macd: "bullish",
          rsi: 68,
          movingAverages: "strong bullish",
          supportLevels: [840, 810, 780],
          resistanceLevels: [900, 950, 1000],
        },
        fundamentals: {
          peRatio: 42.8,
          revenueGrowth: 38.2,
          profitMargin: 41.5,
          cashFlow: "strong positive",
          debtToEquity: 0.42,
        },
        catalysts: [
          "AI chip demand continues to outpace supply",
          "Data center expansion accelerating globally",
          "New product cycle beginning in Q3",
          "Expanding partnerships with major cloud providers",
        ],
        risks: [
          "Valuation concerns at current multiples",
          "Potential regulatory scrutiny in AI sector",
          "Competition from AMD and Intel intensifying",
        ],
      },
      {
        id: "2",
        sector: "Technology",
        symbol: "MSFT",
        name: "Microsoft Corporation",
        currentPrice: 412.65,
        predictedPrice: 445.8,
        predictedChange: 8.0,
        confidence: 92,
        timeframe: "30 days",
        trend: "bullish",
        news: [
          {
            title: "Microsoft Cloud Revenue Exceeds Expectations in Q2",
            source: "Wall Street Journal",
            date: "1 week ago",
            sentiment: "positive",
            impact: "high",
          },
          {
            title: "Microsoft Expands AI Integration Across Product Suite",
            source: "The Verge",
            date: "3 days ago",
            sentiment: "positive",
            impact: "medium",
          },
          {
            title: "Enterprise Adoption of Microsoft 365 Copilot Accelerating",
            source: "ZDNet",
            date: "5 days ago",
            sentiment: "positive",
            impact: "high",
          },
        ],
        sentiment: {
          overall: "positive",
          score: 8.2,
          social: 7.8,
          news: 8.5,
          analyst: 8.3,
        },
        technicalIndicators: {
          macd: "bullish",
          rsi: 62,
          movingAverages: "bullish",
          supportLevels: [400, 385, 370],
          resistanceLevels: [425, 450, 475],
        },
        fundamentals: {
          peRatio: 34.6,
          revenueGrowth: 15.8,
          profitMargin: 36.2,
          cashFlow: "strong positive",
          debtToEquity: 0.38,
        },
        catalysts: [
          "Azure cloud growth continues to accelerate",
          "AI integration driving new revenue streams",
          "Enterprise software demand remains robust",
          "Gaming division showing strong performance",
        ],
        risks: [
          "Cloud competition from AWS and Google intensifying",
          "Potential economic slowdown affecting enterprise spending",
          "Regulatory challenges in multiple markets",
        ],
      },
      {
        id: "3",
        sector: "Finance",
        symbol: "JPM",
        name: "JPMorgan Chase & Co.",
        currentPrice: 198.54,
        predictedPrice: 187.65,
        predictedChange: -5.5,
        confidence: 76,
        timeframe: "30 days",
        trend: "bearish",
        news: [
          {
            title: "Fed Signals Higher Rates for Longer Period",
            source: "Financial Times",
            date: "2 days ago",
            sentiment: "negative",
            impact: "high",
          },
          {
            title: "Banking Sector Faces Increased Regulatory Scrutiny",
            source: "Bloomberg",
            date: "1 week ago",
            sentiment: "negative",
            impact: "medium",
          },
          {
            title: "JPMorgan Increases Loan Loss Provisions by 15%",
            source: "CNBC",
            date: "4 days ago",
            sentiment: "negative",
            impact: "high",
          },
        ],
        sentiment: {
          overall: "negative",
          score: 4.2,
          social: 4.5,
          news: 3.8,
          analyst: 4.3,
        },
        technicalIndicators: {
          macd: "bearish",
          rsi: 42,
          movingAverages: "bearish",
          supportLevels: [190, 185, 180],
          resistanceLevels: [205, 210, 215],
        },
        fundamentals: {
          peRatio: 12.4,
          revenueGrowth: 3.2,
          profitMargin: 28.5,
          cashFlow: "stable",
          debtToEquity: 1.28,
        },
        catalysts: [],
        risks: [
          "Rising interest rates impacting loan demand",
          "Increasing loan defaults in consumer segment",
          "Regulatory pressure on capital requirements",
          "Economic slowdown affecting investment banking revenue",
        ],
      },
      {
        id: "4",
        sector: "Healthcare",
        symbol: "UNH",
        name: "UnitedHealth Group",
        currentPrice: 528.36,
        predictedPrice: 565.75,
        predictedChange: 7.1,
        confidence: 81,
        timeframe: "30 days",
        trend: "bullish",
        news: [
          {
            title: "UnitedHealth Reports Strong Medicare Advantage Enrollment",
            source: "Healthcare Finance",
            date: "1 week ago",
            sentiment: "positive",
            impact: "medium",
          },
          {
            title: "Healthcare Sector Shows Resilience Amid Economic Uncertainty",
            source: "Morningstar",
            date: "3 days ago",
            sentiment: "positive",
            impact: "medium",
          },
          {
            title: "UnitedHealth's Optum Division Expands AI Diagnostics Platform",
            source: "Modern Healthcare",
            date: "5 days ago",
            sentiment: "positive",
            impact: "high",
          },
        ],
        sentiment: {
          overall: "positive",
          score: 7.4,
          social: 6.8,
          news: 7.6,
          analyst: 7.8,
        },
        technicalIndicators: {
          macd: "bullish",
          rsi: 58,
          movingAverages: "bullish",
          supportLevels: [515, 500, 485],
          resistanceLevels: [540, 560, 580],
        },
        fundamentals: {
          peRatio: 24.6,
          revenueGrowth: 8.7,
          profitMargin: 6.2,
          cashFlow: "positive",
          debtToEquity: 0.74,
        },
        catalysts: [
          "Aging population driving healthcare demand",
          "Optum division showing strong growth",
          "Technology investments improving operational efficiency",
          "Defensive sector amid economic uncertainty",
        ],
        risks: [
          "Potential healthcare policy changes",
          "Rising medical costs affecting margins",
          "Competition in Medicare Advantage market",
        ],
      },
      {
        id: "5",
        sector: "Energy",
        symbol: "XOM",
        name: "Exxon Mobil Corporation",
        currentPrice: 113.24,
        predictedPrice: 105.8,
        predictedChange: -6.6,
        confidence: 72,
        timeframe: "30 days",
        trend: "bearish",
        news: [
          {
            title: "Oil Prices Drop on Increased Production and Weak Demand",
            source: "Reuters",
            date: "2 days ago",
            sentiment: "negative",
            impact: "high",
          },
          {
            title: "OPEC+ Considers Increasing Production Quotas",
            source: "Bloomberg",
            date: "1 week ago",
            sentiment: "negative",
            impact: "high",
          },
          {
            title: "Global Economic Slowdown Threatens Energy Demand",
            source: "Financial Times",
            date: "4 days ago",
            sentiment: "negative",
            impact: "medium",
          },
        ],
        sentiment: {
          overall: "negative",
          score: 4.6,
          social: 4.2,
          news: 4.5,
          analyst: 5.1,
        },
        technicalIndicators: {
          macd: "bearish",
          rsi: 38,
          movingAverages: "bearish",
          supportLevels: [110, 105, 100],
          resistanceLevels: [115, 120, 125],
        },
        fundamentals: {
          peRatio: 8.2,
          revenueGrowth: -2.5,
          profitMargin: 10.8,
          cashFlow: "positive but declining",
          debtToEquity: 0.25,
        },
        catalysts: [],
        risks: [
          "Oil price volatility due to geopolitical tensions",
          "Decreasing global demand for fossil fuels",
          "Increasing regulatory pressure on carbon emissions",
          "Renewable energy transition accelerating",
        ],
      },
      {
        id: "6",
        sector: "Consumer Discretionary",
        symbol: "AMZN",
        name: "Amazon.com Inc.",
        currentPrice: 178.92,
        predictedPrice: 195.4,
        predictedChange: 9.2,
        confidence: 82,
        timeframe: "30 days",
        trend: "bullish",
        news: [
          {
            title: "Amazon AWS Revenue Grows 35% Year-over-Year",
            source: "CNBC",
            date: "1 week ago",
            sentiment: "positive",
            impact: "high",
          },
          {
            title: "Amazon Expands Same-Day Delivery to 15 New Markets",
            source: "Business Insider",
            date: "3 days ago",
            sentiment: "positive",
            impact: "medium",
          },
          {
            title: "Prime Membership Growth Accelerates in International Markets",
            source: "The Wall Street Journal",
            date: "5 days ago",
            sentiment: "positive",
            impact: "medium",
          },
        ],
        sentiment: {
          overall: "positive",
          score: 7.8,
          social: 8.1,
          news: 7.6,
          analyst: 7.7,
        },
        technicalIndicators: {
          macd: "bullish",
          rsi: 64,
          movingAverages: "bullish",
          supportLevels: [175, 170, 165],
          resistanceLevels: [185, 195, 205],
        },
        fundamentals: {
          peRatio: 38.2,
          revenueGrowth: 12.5,
          profitMargin: 7.8,
          cashFlow: "strong positive",
          debtToEquity: 0.58,
        },
        catalysts: [
          "AWS continues to dominate cloud market",
          "Advertising business showing strong growth",
          "Operational efficiency improvements increasing margins",
          "AI investments driving competitive advantages",
        ],
        risks: [
          "Increasing competition in e-commerce",
          "Regulatory scrutiny in multiple markets",
          "Consumer spending sensitivity to economic conditions",
        ],
      },
      {
        id: "7",
        sector: "Cryptocurrency",
        symbol: "BTC",
        name: "Bitcoin",
        currentPrice: 67234.56,
        predictedPrice: 75000.0,
        predictedChange: 11.5,
        confidence: 88,
        timeframe: "30 days",
        trend: "bullish",
        news: [
          {
            title: "Institutional Adoption of Bitcoin Accelerates",
            source: "CoinDesk",
            date: "3 days ago",
            sentiment: "positive",
            impact: "high",
          },
          {
            title: "Bitcoin ETF Inflows Reach Record Levels",
            source: "Bloomberg",
            date: "1 week ago",
            sentiment: "positive",
            impact: "high",
          },
          {
            title: "Major Payment Processor Adds Bitcoin Settlement Option",
            source: "The Block",
            date: "4 days ago",
            sentiment: "positive",
            impact: "medium",
          },
        ],
        sentiment: {
          overall: "very positive",
          score: 8.9,
          social: 9.3,
          news: 8.7,
          analyst: 8.6,
        },
        technicalIndicators: {
          macd: "bullish",
          rsi: 65,
          movingAverages: "strong bullish",
          supportLevels: [65000, 62000, 58000],
          resistanceLevels: [70000, 75000, 80000],
        },
        fundamentals: {
          peRatio: "N/A",
          revenueGrowth: "N/A",
          profitMargin: "N/A",
          cashFlow: "N/A",
          debtToEquity: "N/A",
        },
        catalysts: [
          "Increasing institutional adoption",
          "Growing recognition as digital gold",
          "Limited supply with increasing demand",
          "Expanding use in global remittances",
        ],
        risks: [
          "Regulatory uncertainty in major markets",
          "Volatility concerns for institutional investors",
          "Competition from other cryptocurrencies",
          "Environmental concerns about mining",
        ],
      },
      {
        id: "8",
        sector: "Bonds",
        symbol: "US10Y",
        name: "10-Year Treasury",
        currentPrice: 4.23,
        predictedPrice: 3.95,
        predictedChange: -6.6,
        confidence: 79,
        timeframe: "30 days",
        trend: "bearish",
        news: [
          {
            title: "Fed Signals Rate Cuts in Coming Months",
            source: "Wall Street Journal",
            date: "2 days ago",
            sentiment: "positive",
            impact: "high",
          },
          {
            title: "Inflation Data Shows Cooling Trend",
            source: "Bloomberg",
            date: "1 week ago",
            sentiment: "positive",
            impact: "high",
          },
          {
            title: "Treasury Demand Increases Amid Economic Uncertainty",
            source: "Financial Times",
            date: "3 days ago",
            sentiment: "positive",
            impact: "medium",
          },
        ],
        sentiment: {
          overall: "positive",
          score: 7.2,
          social: "N/A",
          news: 7.5,
          analyst: 7.0,
        },
        technicalIndicators: {
          macd: "bearish",
          rsi: 42,
          movingAverages: "bearish",
          supportLevels: [4.0, 3.8, 3.6],
          resistanceLevels: [4.4, 4.6, 4.8],
        },
        fundamentals: {
          peRatio: "N/A",
          revenueGrowth: "N/A",
          profitMargin: "N/A",
          cashFlow: "N/A",
          debtToEquity: "N/A",
        },
        catalysts: ["Expected Fed rate cuts", "Slowing inflation data", "Safe haven demand amid global uncertainty"],
        risks: [
          "Persistent inflation could delay rate cuts",
          "Strong economic data may support higher yields",
          "Treasury supply concerns",
        ],
      },
    ]
  }, [])

  // Filter predictions based on selected sector
  const filteredPredictions = useMemo(() => {
    if (selectedSector === "all") {
      return topPredictions
    }
    return topPredictions.filter((prediction) => prediction.sector.toLowerCase() === selectedSector.toLowerCase())
  }, [topPredictions, selectedSector])

  // Get selected prediction details
  const selectedPredictionDetails = useMemo(() => {
    if (!selectedPrediction) return null
    return topPredictions.find((p) => p.id === selectedPrediction) || null
  }, [selectedPrediction, topPredictions])

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const toggleSector = (id: string) => {
    setExpandedSectors((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // Handle refresh button click
  const handleRefresh = async () => {
    try {
      // Get all symbols from top predictions
      const symbols = topPredictions.map((prediction) => prediction.symbol)
      await refreshData(symbols)
    } catch (err) {
      console.error("Error refreshing data:", err)
    }
  }

  // Get sentiment color
  const getSentimentColor = (sentiment: string) => {
    if (sentiment.includes("positive")) return "text-[#00ff4c]"
    if (sentiment.includes("negative")) return "text-red-500"
    return "text-yellow-400"
  }

  // Get trend color
  const getTrendColor = (trend: string) => {
    if (trend === "bullish") return "text-[#00ff4c]"
    if (trend === "bearish") return "text-red-500"
    return "text-yellow-400"
  }

  // Get trend icon
  const getTrendIcon = (trend: string, size = 16) => {
    if (trend === "bullish") return <TrendingUp size={size} className="text-[#00ff4c]" />
    if (trend === "bearish") return <TrendingDown size={size} className="text-red-500" />
    return <AlertCircle size={size} className="text-yellow-400" />
  }

  // Get news impact badge
  const getNewsImpactBadge = (impact: string) => {
    if (impact === "high") return <Badge className="bg-[#00ff4c20] text-[#00ff4c] border-[#00ff4c] border">High</Badge>
    if (impact === "medium")
      return <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500 border">Medium</Badge>
    return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500 border">Low</Badge>
  }

  // Handle mobile detail view
  const handlePredictionSelect = (id: string) => {
    setSelectedPrediction(id)
    setIsMobileDetailView(true)
  }

  // Close mobile detail view
  const closeMobileDetailView = () => {
    setIsMobileDetailView(false)
    setSelectedPrediction(null)
  }

  return (
    <div
      className={`relative w-full h-full overflow-y-auto overflow-x-hidden bg-black ${
        isLoaded ? "opacity-100" : "opacity-0"
      } transition-opacity duration-500`}
      style={{ height: "calc(100vh - 53px)", overflowY: "auto" }}
    >
      {/* Hexagon background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-full h-full">
          {/* Hexagon grid pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#00ff4c_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none"></div>

          {/* Glowing orbs */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#00ff4c] rounded-full filter blur-[128px] opacity-10 animate-pulse-slow pointer-events-none"></div>
          <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-[#00ff4c] rounded-full filter blur-[128px] opacity-5 animate-pulse-slow pointer-events-none"></div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full">
        {/* Header */}
        <div className="text-center py-3 border-b border-[#00ff4c33]">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
            Market <span className="text-[#00ff4c]">Predictions</span>
          </h1>
        </div>

        {/* Market Ticker */}
        <MarketTicker />

        {/* Mobile Detail View */}
        {isMobileDetailView && selectedPredictionDetails && (
          <div className="fixed inset-0 z-50 bg-black overflow-y-auto pt-14">
            <div className="sticky top-0 z-10 bg-black p-3 border-b border-[#00ff4c33] flex justify-between items-center">
              <h2 className="text-lg font-bold text-white">{selectedPredictionDetails.name}</h2>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-[#00ff4c15]"
                onClick={closeMobileDetailView}
              >
                <X size={20} />
              </Button>
            </div>
            <div className="p-3">
              {/* Mobile Price Prediction Summary */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-black/50 border border-[#00ff4c33] rounded-lg p-2">
                  <div className="text-xs text-gray-400">Current</div>
                  <div className="text-base font-bold text-white">
                    ${selectedPredictionDetails.currentPrice.toFixed(2)}
                  </div>
                </div>

                <div className="bg-black/50 border border-[#00ff4c33] rounded-lg p-2">
                  <div className="text-xs text-gray-400">Predicted</div>
                  <div
                    className={`text-base font-bold ${
                      selectedPredictionDetails.predictedChange >= 0 ? "text-[#00ff4c]" : "text-red-500"
                    }`}
                  >
                    ${selectedPredictionDetails.predictedPrice.toFixed(2)}
                  </div>
                </div>

                <div className="bg-black/50 border border-[#00ff4c33] rounded-lg p-2">
                  <div className="text-xs text-gray-400">Change</div>
                  <div
                    className={`text-base font-bold flex items-center ${
                      selectedPredictionDetails.predictedChange >= 0 ? "text-[#00ff4c]" : "text-red-500"
                    }`}
                  >
                    {selectedPredictionDetails.predictedChange >= 0 ? (
                      <ArrowUpRight size={14} className="mr-1" />
                    ) : (
                      <ArrowDownRight size={14} className="mr-1" />
                    )}
                    {Math.abs(selectedPredictionDetails.predictedChange).toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Mobile Detailed Analysis */}
              <div className="space-y-4">
                {/* News Analysis */}
                <div className="bg-black/30 border border-[#00ff4c33] rounded-lg p-3">
                  <h4 className="text-base font-semibold mb-2 flex items-center gap-2">
                    <Newspaper className="text-[#00ff4c]" size={16} />
                    <span className="text-white">News Analysis</span>
                  </h4>
                  <div className="space-y-3">
                    {selectedPredictionDetails.news.map((news, idx) => (
                      <div key={idx} className="border-b border-gray-800 pb-2 last:border-0 last:pb-0">
                        <div className="flex justify-between items-start">
                          <h5 className="font-medium text-white text-sm">{news.title}</h5>
                          {getNewsImpactBadge(news.impact)}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                          <span>{news.source}</span>
                          <span>•</span>
                          <span>{news.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sentiment Analysis */}
                <div className="bg-black/30 border border-[#00ff4c33] rounded-lg p-3">
                  <h4 className="text-base font-semibold mb-2 flex items-center gap-2">
                    <LineChart className="text-[#00ff4c]" size={16} />
                    <span className="text-white">Sentiment Analysis</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Overall</div>
                      <div
                        className={`text-sm font-bold ${getSentimentColor(selectedPredictionDetails.sentiment.overall)}`}
                      >
                        {selectedPredictionDetails.sentiment.overall.charAt(0).toUpperCase() +
                          selectedPredictionDetails.sentiment.overall.slice(1)}{" "}
                        ({selectedPredictionDetails.sentiment.score.toFixed(1)}/10)
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Social</div>
                      <div className="text-sm font-medium text-white">
                        {selectedPredictionDetails.sentiment.social !== "N/A"
                          ? `${selectedPredictionDetails.sentiment.social.toFixed(1)}/10`
                          : "N/A"}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-1">News</div>
                      <div className="text-sm font-medium text-white">
                        {selectedPredictionDetails.sentiment.news !== "N/A"
                          ? `${selectedPredictionDetails.sentiment.news.toFixed(1)}/10`
                          : "N/A"}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Analyst</div>
                      <div className="text-sm font-medium text-white">
                        {selectedPredictionDetails.sentiment.analyst !== "N/A"
                          ? `${selectedPredictionDetails.sentiment.analyst.toFixed(1)}/10`
                          : "N/A"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Technical Indicators */}
                <div className="bg-black/30 border border-[#00ff4c33] rounded-lg p-3">
                  <h4 className="text-base font-semibold mb-2 flex items-center gap-2">
                    <BarChart3 className="text-[#00ff4c]" size={16} />
                    <span className="text-white">Technical Indicators</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-gray-400 mb-1">MACD</div>
                      <div
                        className={`text-sm font-medium ${
                          selectedPredictionDetails.technicalIndicators.macd === "bullish"
                            ? "text-[#00ff4c]"
                            : "text-red-500"
                        }`}
                      >
                        {selectedPredictionDetails.technicalIndicators.macd.charAt(0).toUpperCase() +
                          selectedPredictionDetails.technicalIndicators.macd.slice(1)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-1">RSI</div>
                      <div
                        className={`text-sm font-medium ${
                          selectedPredictionDetails.technicalIndicators.rsi > 70
                            ? "text-red-500"
                            : selectedPredictionDetails.technicalIndicators.rsi < 30
                              ? "text-[#00ff4c]"
                              : "text-white"
                        }`}
                      >
                        {selectedPredictionDetails.technicalIndicators.rsi}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Moving Averages</div>
                      <div
                        className={`text-sm font-medium ${
                          selectedPredictionDetails.technicalIndicators.movingAverages.includes("bullish")
                            ? "text-[#00ff4c]"
                            : "text-red-500"
                        }`}
                      >
                        {selectedPredictionDetails.technicalIndicators.movingAverages}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Support Levels</div>
                      <div className="text-sm font-medium text-white">
                        ${selectedPredictionDetails.technicalIndicators.supportLevels.join(", $")}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Catalysts and Risks */}
                {selectedPredictionDetails.catalysts.length > 0 && (
                  <div className="bg-black/30 border border-[#00ff4c33] rounded-lg p-3">
                    <h4 className="text-base font-semibold mb-2 flex items-center gap-2">
                      <Lightbulb className="text-[#00ff4c]" size={16} />
                      <span className="text-white">Key Catalysts</span>
                    </h4>
                    <ul className="space-y-1">
                      {selectedPredictionDetails.catalysts.map((catalyst, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <ArrowUpRight size={14} className="text-[#00ff4c] mt-1" />
                          <span className="text-gray-300 text-sm">{catalyst}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedPredictionDetails.risks.length > 0 && (
                  <div className="bg-black/30 border border-[#00ff4c33] rounded-lg p-3">
                    <h4 className="text-base font-semibold mb-2 flex items-center gap-2">
                      <AlertCircle className="text-red-500" size={16} />
                      <span className="text-white">Risk Factors</span>
                    </h4>
                    <ul className="space-y-1">
                      {selectedPredictionDetails.risks.map((risk, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <ArrowDownRight size={14} className="text-red-500 mt-1" />
                          <span className="text-gray-300 text-sm">{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#00ff4c33] text-[#00ff4c] hover:bg-[#00ff4c15] hover:text-[#00ff4c]"
                  >
                    <Bookmark size={14} className="mr-1" />
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#00ff4c33] text-[#00ff4c] hover:bg-[#00ff4c15] hover:text-[#00ff4c]"
                  >
                    <Star size={14} className="mr-1" />
                    Watch
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="relative z-10 px-2 sm:px-4 py-3">
          {/* Sector Selection Bar */}
          <div className="mb-6">
            <div className="flex flex-wrap items-center justify-between mb-3 gap-2">
              <h2 className="text-lg font-bold flex items-center gap-1">
                <Filter className="text-[#00ff4c]" size={18} />
                <span>Filter by Sector</span>
              </h2>

              {/* Refresh Button */}
              <Button
                className="bg-black border border-[#00ff4c] text-white hover:bg-[#00ff4c15] relative h-8 px-3"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <div className="absolute inset-0 shadow-[inset_0_0_8px_rgba(0,255,76,0.3)] pointer-events-none rounded-md"></div>
                <div className="flex items-center gap-1 z-10">
                  <RefreshCw size={14} className={`text-[#00ff4c] ${isLoading ? "animate-spin" : ""}`} />
                  <span className="text-sm">{isLoading ? "Refreshing..." : "Refresh"}</span>
                </div>
              </Button>
            </div>

            {/* Scrollable sector buttons */}
            <div className="overflow-x-auto pb-2 hide-scrollbar">
              <div className="flex space-x-1 min-w-max">
                {sectors.map((sector) => (
                  <Button
                    key={sector.id}
                    variant={selectedSector === sector.id ? "default" : "outline"}
                    size="sm"
                    className={
                      selectedSector === sector.id
                        ? "bg-[#00ff4c] text-black hover:bg-[#00dd42] whitespace-nowrap h-8 text-xs"
                        : "border-[#00ff4c33] text-white hover:bg-[#00ff4c15] hover:text-[#00ff4c] hover:border-[#00ff4c] whitespace-nowrap h-8 text-xs"
                    }
                    onClick={() => setSelectedSector(sector.id)}
                  >
                    <div className="flex items-center gap-1">
                      {sector.icon}
                      <span>{sector.name}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Top Predictions */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Target className="text-[#00ff4c]" size={20} />
              <span>
                {selectedSector === "all"
                  ? "Top Market Predictions"
                  : `Top ${sectors.find((s) => s.id === selectedSector)?.name || ""} Predictions`}
              </span>
              <Badge className="ml-1 bg-[#00ff4c20] text-[#00ff4c] border-[#00ff4c] border text-xs">
                {filteredPredictions.length}
              </Badge>
            </h2>

            {filteredPredictions.length === 0 ? (
              <div className="bg-black border border-[#00ff4c33] rounded-lg p-6 text-center">
                <AlertCircle className="mx-auto mb-3 text-[#00ff4c]" size={36} />
                <h3 className="text-lg font-bold mb-2">No Predictions Available</h3>
                <p className="text-gray-400 mb-4 text-sm">
                  There are currently no high-confidence predictions for this sector.
                </p>
                <Button className="bg-[#00ff4c] text-black hover:bg-[#00dd42]" onClick={() => setSelectedSector("all")}>
                  View All Sectors
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredPredictions.map((prediction) => (
                  <div
                    key={prediction.id}
                    className="bg-black border border-[#00ff4c33] rounded-lg p-3 hover:border-[#00ff4c] transition-all duration-300 relative overflow-hidden group"
                    onClick={() => handlePredictionSelect(prediction.id)}
                  >
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-[#00ff4c] opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none"></div>

                    {/* Header */}
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-[#00ff4c15] flex items-center justify-center">
                          <span className="text-[#00ff4c] text-sm font-bold">{prediction.symbol}</span>
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-white flex items-center gap-1">
                            {prediction.name.length > 20 ? prediction.name.substring(0, 20) + "..." : prediction.name}
                            <Badge
                              className={`ml-1 ${
                                prediction.trend === "bullish"
                                  ? "bg-[#00ff4c20] text-[#00ff4c] border-[#00ff4c]"
                                  : prediction.trend === "bearish"
                                    ? "bg-red-500/20 text-red-500 border-red-500"
                                    : "bg-yellow-500/20 text-yellow-500 border-yellow-500"
                              } border text-xs`}
                            >
                              {prediction.trend.toUpperCase()}
                            </Badge>
                          </h3>
                          <div className="flex items-center gap-1 text-xs">
                            <span className="text-gray-400">{prediction.sector}</span>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-400">{prediction.timeframe}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-1 bg-black/80 border border-[#00ff4c33] rounded-full px-2 py-0.5">
                                <div className="text-xs text-gray-400">AI:</div>
                                <div
                                  className={`text-xs font-bold ${
                                    prediction.confidence > 80
                                      ? "text-[#00ff4c]"
                                      : prediction.confidence > 60
                                        ? "text-yellow-400"
                                        : "text-red-500"
                                  }`}
                                >
                                  {prediction.confidence}%
                                </div>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="bg-black border border-[#00ff4c33] text-white">
                              <p>AI confidence score based on analysis</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>

                    {/* Price Prediction Summary */}
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      <div className="bg-black/50 border border-[#00ff4c33] rounded-lg p-2">
                        <div className="text-xs text-gray-400">Current</div>
                        <div className="text-sm font-bold text-white">${prediction.currentPrice.toFixed(2)}</div>
                      </div>

                      <div className="bg-black/50 border border-[#00ff4c33] rounded-lg p-2">
                        <div className="text-xs text-gray-400">Target</div>
                        <div
                          className={`text-sm font-bold ${
                            prediction.predictedChange >= 0 ? "text-[#00ff4c]" : "text-red-500"
                          }`}
                        >
                          ${prediction.predictedPrice.toFixed(2)}
                        </div>
                      </div>

                      <div className="bg-black/50 border border-[#00ff4c33] rounded-lg p-2">
                        <div className="text-xs text-gray-400">Change</div>
                        <div
                          className={`text-sm font-bold flex items-center ${
                            prediction.predictedChange >= 0 ? "text-[#00ff4c]" : "text-red-500"
                          }`}
                        >
                          {prediction.predictedChange >= 0 ? (
                            <ArrowUpRight size={14} className="mr-0.5" />
                          ) : (
                            <ArrowDownRight size={14} className="mr-0.5" />
                          )}
                          {Math.abs(prediction.predictedChange).toFixed(1)}%
                        </div>
                      </div>
                    </div>

                    {/* View Details Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2 border-[#00ff4c33] text-[#00ff4c] hover:bg-[#00ff4c15] hover:text-[#00ff4c] text-xs"
                    >
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Call to Action */}
          <div className="mt-10 text-center">
            <div className="bg-[#00ff4c08] border border-[#00ff4c33] rounded-lg p-4 sm:p-6 backdrop-blur-sm">
              <h2 className="text-xl sm:text-2xl font-bold mb-3">
                <span className="text-[#00ff4c]">Premium</span> Market Intelligence
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto mb-6 text-sm">
                Access our full prediction platform with detailed analysis, historical accuracy tracking, and
                personalized alerts for all market sectors.
              </p>

              <div className="flex flex-wrap justify-center gap-3">
                <Button
                  className="bg-[#00ff4c] text-black hover:bg-[#00dd42] relative h-10 px-4 text-sm"
                  onClick={() => window.open("https://predictions.infinityxos.com", "_blank")}
                >
                  <div className="flex items-center gap-1 z-10">
                    <Zap size={14} />
                    <span className="font-bold">Get Premium Access</span>
                  </div>
                </Button>

                <Button
                  className="bg-black border border-[#00ff4c] text-white hover:bg-[#00ff4c15] relative h-10 px-4 text-sm"
                  onClick={() => window.open("https://predictions.infinityxos.com/demo", "_blank")}
                >
                  <div className="absolute inset-0 shadow-[inset_0_0_8px_rgba(0,255,76,0.3)] pointer-events-none rounded-md"></div>
                  <div className="flex items-center gap-1 z-10">
                    <span>Watch Demo</span>
                    <ArrowRight size={14} className="text-[#00ff4c]" />
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper function to generate rationales for asset selections
function getAssetRationale(sectorId: string, symbol: string): string {
  const rationales: Record<string, Record<string, string>> = {
    technology: {
      AAPL: "Strong technical indicators, positive sentiment analysis, and upcoming product launches suggest continued growth.",
      MSFT: "Cloud services growth, AI integration, and strong institutional buying patterns indicate bullish momentum.",
      NVDA: "Leading position in AI chips, high demand for GPUs, and exceptional earnings growth make this a top pick.",
    },
    // Other sectors omitted for brevity
  }

  // Default rationale if specific one not found
  return (
    rationales[sectorId]?.[symbol] ||
    "Selected based on technical analysis, fundamental strength, and favorable risk/reward profile in current market conditions."
  )
}
