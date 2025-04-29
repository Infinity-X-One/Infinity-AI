"use client"

import { useState, useEffect, forwardRef, useImperativeHandle } from "react"
import { Shield, Filter, TrendingUp, Clock, Search, ChevronDown, ArrowUpRight, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Slider } from "@/components/ui/slider"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Add the import for SafeBetsChat at the top of the file
import SafeBetsChat from "@/components/safebets-chat"

// Types for our safe bets data
interface SafeBet {
  id: number
  symbol: string
  name: string
  price: number
  change: number
  confidence: number
  risk: "very low" | "low" | "moderate" | "high"
  timeframe: string
  expectedReturn: number
  category: "stock" | "etf" | "crypto" | "forex" | "commodity"
  description: string
  metrics: {
    volatility: number
    momentum: number
    stability: number
    sentiment: number
  }
  historicalData: { date: string; price: number }[]
}

// Change the component definition to use forwardRef
const SafeBetsContent = forwardRef((props, ref) => {
  // State for filters and search
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [confidenceFilter, setConfidenceFilter] = useState([70, 100])
  const [riskFilter, setRiskFilter] = useState<string>("all")
  const [timeframeFilter, setTimeframeFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("confidence")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  // State for safe bets data
  const [safeBets, setSafeBets] = useState<SafeBet[]>([])
  const [filteredBets, setFilteredBets] = useState<SafeBet[]>([])
  const [selectedBet, setSelectedBet] = useState<SafeBet | null>(null)

  // State for refresh functionality
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastRefreshed, setLastRefreshed] = useState(new Date())

  // Generate mock data on component mount
  useEffect(() => {
    const mockData = generateMockSafeBets()
    setSafeBets(mockData)
    setFilteredBets(mockData)
    setLastRefreshed(new Date())
  }, [])

  // Apply filters when any filter changes
  useEffect(() => {
    let filtered = [...safeBets]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (bet) => bet.symbol.toLowerCase().includes(query) || bet.name.toLowerCase().includes(query),
      )
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((bet) => bet.category === selectedCategory)
    }

    // Apply confidence filter
    filtered = filtered.filter((bet) => bet.confidence >= confidenceFilter[0] && bet.confidence <= confidenceFilter[1])

    // Apply risk filter
    if (riskFilter !== "all") {
      filtered = filtered.filter((bet) => bet.risk === riskFilter)
    }

    // Apply timeframe filter
    if (timeframeFilter !== "all") {
      filtered = filtered.filter((bet) => bet.timeframe === timeframeFilter)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case "confidence":
          comparison = a.confidence - b.confidence
          break
        case "expectedReturn":
          comparison = a.expectedReturn - b.expectedReturn
          break
        case "price":
          comparison = a.price - b.price
          break
        case "change":
          comparison = a.change - b.change
          break
        default:
          comparison = a.confidence - b.confidence
      }
      return sortOrder === "asc" ? comparison : -comparison
    })

    setFilteredBets(filtered)

    // Set the first item as selected if there's no selection or the selection is not in filtered results
    if (filtered.length > 0 && (!selectedBet || !filtered.find((bet) => bet.id === selectedBet.id))) {
      setSelectedBet(filtered[0])
    }
  }, [searchQuery, selectedCategory, confidenceFilter, riskFilter, timeframeFilter, sortBy, sortOrder, safeBets])

  // Generate mock safe bets data
  const generateMockSafeBets = (): SafeBet[] => {
    const categories = ["stock", "etf", "crypto", "forex", "commodity"] as const
    const risks = ["very low", "low", "moderate", "high"] as const
    const timeframes = ["short-term", "mid-term", "long-term"] as const

    const stockNames = [
      { symbol: "AAPL", name: "Apple Inc." },
      { symbol: "MSFT", name: "Microsoft Corporation" },
      { symbol: "GOOGL", name: "Alphabet Inc." },
      { symbol: "AMZN", name: "Amazon.com Inc." },
      { symbol: "NVDA", name: "NVIDIA Corporation" },
      { symbol: "META", name: "Meta Platforms Inc." },
      { symbol: "TSLA", name: "Tesla Inc." },
      { symbol: "V", name: "Visa Inc." },
      { symbol: "JPM", name: "JPMorgan Chase & Co." },
      { symbol: "JNJ", name: "Johnson & Johnson" },
    ]

    const etfNames = [
      { symbol: "SPY", name: "SPDR S&P 500 ETF Trust" },
      { symbol: "QQQ", name: "Invesco QQQ Trust" },
      { symbol: "VTI", name: "Vanguard Total Stock Market ETF" },
      { symbol: "VOO", name: "Vanguard S&P 500 ETF" },
      { symbol: "VEA", name: "Vanguard FTSE Developed Markets ETF" },
    ]

    const cryptoNames = [
      { symbol: "BTC", name: "Bitcoin" },
      { symbol: "ETH", name: "Ethereum" },
      { symbol: "SOL", name: "Solana" },
      { symbol: "BNB", name: "Binance Coin" },
      { symbol: "ADA", name: "Cardano" },
    ]

    const forexNames = [
      { symbol: "EUR/USD", name: "Euro / US Dollar" },
      { symbol: "USD/JPY", name: "US Dollar / Japanese Yen" },
      { symbol: "GBP/USD", name: "British Pound / US Dollar" },
      { symbol: "USD/CHF", name: "US Dollar / Swiss Franc" },
      { symbol: "AUD/USD", name: "Australian Dollar / US Dollar" },
    ]

    const commodityNames = [
      { symbol: "GC", name: "Gold" },
      { symbol: "SI", name: "Silver" },
      { symbol: "CL", name: "Crude Oil" },
      { symbol: "NG", name: "Natural Gas" },
      { symbol: "HG", name: "Copper" },
    ]

    const generateHistoricalData = () => {
      const data = []
      let price = 100 + Math.random() * 50
      const now = new Date()

      for (let i = 30; i >= 0; i--) {
        const date = new Date(now)
        date.setDate(date.getDate() - i)
        price = price * (1 + (Math.random() * 0.06 - 0.03))
        data.push({
          date: date.toISOString().split("T")[0],
          price: Number.parseFloat(price.toFixed(2)),
        })
      }
      return data
    }

    const generateDescription = (name: string, confidence: number, risk: string, timeframe: string) => {
      return `${name} has been identified as a high-confidence investment opportunity with a ${confidence}% confidence score. Our models indicate ${risk} risk with strong potential for growth in the ${timeframe}. Multiple technical indicators and fundamental analysis support this assessment.`
    }

    const safeBets: SafeBet[] = []

    // Generate stocks
    stockNames.forEach((stock, index) => {
      const confidence = Math.floor(Math.random() * 15) + 85 // 85-99
      const risk = risks[Math.floor(Math.random() * 3)] // Bias toward lower risk
      const timeframe = timeframes[Math.floor(Math.random() * 3)]
      const expectedReturn = Math.floor(Math.random() * 20) + 5 // 5-25%
      const change = Number.parseFloat((Math.random() * 5).toFixed(2))
      const price = Number.parseFloat((50 + Math.random() * 950).toFixed(2))

      safeBets.push({
        id: safeBets.length + 1,
        symbol: stock.symbol,
        name: stock.name,
        price,
        change,
        confidence,
        risk,
        timeframe,
        expectedReturn,
        category: "stock",
        description: generateDescription(stock.name, confidence, risk, timeframe),
        metrics: {
          volatility: Number.parseFloat((Math.random() * 50).toFixed(1)),
          momentum: Number.parseFloat((Math.random() * 100).toFixed(1)),
          stability: Number.parseFloat((Math.random() * 100).toFixed(1)),
          sentiment: Number.parseFloat((Math.random() * 100).toFixed(1)),
        },
        historicalData: generateHistoricalData(),
      })
    })

    // Generate ETFs
    etfNames.forEach((etf) => {
      const confidence = Math.floor(Math.random() * 10) + 88 // 88-98
      const risk = risks[Math.floor(Math.random() * 2)] // Very low to low risk
      const timeframe = timeframes[2] // Bias toward long-term
      const expectedReturn = Math.floor(Math.random() * 15) + 5 // 5-20%
      const change = Number.parseFloat((Math.random() * 3).toFixed(2))
      const price = Number.parseFloat((100 + Math.random() * 400).toFixed(2))

      safeBets.push({
        id: safeBets.length + 1,
        symbol: etf.symbol,
        name: etf.name,
        price,
        change,
        confidence,
        risk,
        timeframe,
        expectedReturn,
        category: "etf",
        description: generateDescription(etf.name, confidence, risk, timeframe),
        metrics: {
          volatility: Number.parseFloat((Math.random() * 30).toFixed(1)),
          momentum: Number.parseFloat((Math.random() * 100).toFixed(1)),
          stability: Number.parseFloat((Math.random() * 100).toFixed(1)),
          sentiment: Number.parseFloat((Math.random() * 100).toFixed(1)),
        },
        historicalData: generateHistoricalData(),
      })
    })

    // Generate Crypto
    cryptoNames.forEach((crypto) => {
      const confidence = Math.floor(Math.random() * 15) + 80 // 80-95
      const risk = risks[Math.floor(Math.random() * 4)] // Any risk level
      const timeframe = timeframes[Math.floor(Math.random() * 2)] // Short to mid-term
      const expectedReturn = Math.floor(Math.random() * 50) + 10 // 10-60%
      const change = Number.parseFloat((Math.random() * 10 - 2).toFixed(2))
      const price =
        crypto.symbol === "BTC"
          ? Number.parseFloat((30000 + Math.random() * 40000).toFixed(2))
          : Number.parseFloat((10 + Math.random() * 4000).toFixed(2))

      safeBets.push({
        id: safeBets.length + 1,
        symbol: crypto.symbol,
        name: crypto.name,
        price,
        change,
        confidence,
        risk,
        timeframe,
        expectedReturn,
        category: "crypto",
        description: generateDescription(crypto.name, confidence, risk, timeframe),
        metrics: {
          volatility: Number.parseFloat((Math.random() * 80 + 20).toFixed(1)),
          momentum: Number.parseFloat((Math.random() * 100).toFixed(1)),
          stability: Number.parseFloat((Math.random() * 100).toFixed(1)),
          sentiment: Number.parseFloat((Math.random() * 100).toFixed(1)),
        },
        historicalData: generateHistoricalData(),
      })
    })

    // Generate Forex
    forexNames.forEach((forex) => {
      const confidence = Math.floor(Math.random() * 15) + 82 // 82-97
      const risk = risks[Math.floor(Math.random() * 3)] // Low to moderate risk
      const timeframe = timeframes[0] // Short-term
      const expectedReturn = Math.floor(Math.random() * 10) + 2 // 2-12%
      const change = Number.parseFloat((Math.random() * 2 - 0.5).toFixed(2))
      const price = Number.parseFloat((0.5 + Math.random() * 1.5).toFixed(4))

      safeBets.push({
        id: safeBets.length + 1,
        symbol: forex.symbol,
        name: forex.name,
        price,
        change,
        confidence,
        risk,
        timeframe,
        expectedReturn,
        category: "forex",
        description: generateDescription(forex.name, confidence, risk, timeframe),
        metrics: {
          volatility: Number.parseFloat((Math.random() * 40 + 10).toFixed(1)),
          momentum: Number.parseFloat((Math.random() * 100).toFixed(1)),
          stability: Number.parseFloat((Math.random() * 100).toFixed(1)),
          sentiment: Number.parseFloat((Math.random() * 100).toFixed(1)),
        },
        historicalData: generateHistoricalData(),
      })
    })

    // Generate Commodities
    commodityNames.forEach((commodity) => {
      const confidence = Math.floor(Math.random() * 15) + 83 // 83-98
      const risk = risks[Math.floor(Math.random() * 3) + 1] // Low to high risk
      const timeframe = timeframes[Math.floor(Math.random() * 3)] // Any timeframe
      const expectedReturn = Math.floor(Math.random() * 25) + 5 // 5-30%
      const change = Number.parseFloat((Math.random() * 4 - 1).toFixed(2))
      const price = Number.parseFloat((10 + Math.random() * 2000).toFixed(2))

      safeBets.push({
        id: safeBets.length + 1,
        symbol: commodity.symbol,
        name: commodity.name,
        price,
        change,
        confidence,
        risk,
        timeframe,
        expectedReturn,
        category: "commodity",
        description: generateDescription(commodity.name, confidence, risk, timeframe),
        metrics: {
          volatility: Number.parseFloat((Math.random() * 60 + 20).toFixed(1)),
          momentum: Number.parseFloat((Math.random() * 100).toFixed(1)),
          stability: Number.parseFloat((Math.random() * 100).toFixed(1)),
          sentiment: Number.parseFloat((Math.random() * 100).toFixed(1)),
        },
        historicalData: generateHistoricalData(),
      })
    })

    return safeBets
  }

  // Function to refresh data
  const refreshData = () => {
    setIsRefreshing(true)

    // Show loading state for a realistic amount of time
    setTimeout(() => {
      // Generate new mock data
      const freshData = generateMockSafeBets()
      setSafeBets(freshData)

      // Update last refreshed timestamp
      setLastRefreshed(new Date())

      // Apply current filters to new data
      let filtered = [...freshData]

      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        filtered = filtered.filter(
          (bet) => bet.symbol.toLowerCase().includes(query) || bet.name.toLowerCase().includes(query),
        )
      }

      // Apply category filter
      if (selectedCategory !== "all") {
        filtered = filtered.filter((bet) => bet.category === selectedCategory)
      }

      // Apply confidence filter
      filtered = filtered.filter(
        (bet) => bet.confidence >= confidenceFilter[0] && bet.confidence <= confidenceFilter[1],
      )

      // Apply risk filter
      if (riskFilter !== "all") {
        filtered = filtered.filter((bet) => bet.risk === riskFilter)
      }

      // Apply timeframe filter
      if (timeframeFilter !== "all") {
        filtered = filtered.filter((bet) => bet.timeframe === timeframeFilter)
      }

      // Apply sorting
      filtered.sort((a, b) => {
        let comparison = 0
        switch (sortBy) {
          case "confidence":
            comparison = a.confidence - b.confidence
            break
          case "expectedReturn":
            comparison = a.expectedReturn - b.expectedReturn
            break
          case "price":
            comparison = a.price - b.price
            break
          case "change":
            comparison = a.change - b.change
            break
          default:
            comparison = a.confidence - b.confidence
        }
        return sortOrder === "asc" ? comparison : -comparison
      })

      setFilteredBets(filtered)

      // If there was a selected bet, try to find it in the new data or select the first one
      if (selectedBet) {
        const updatedSelectedBet = filtered.find((bet) => bet.symbol === selectedBet.symbol)
        setSelectedBet(updatedSelectedBet || (filtered.length > 0 ? filtered[0] : null))
      }

      setIsRefreshing(false)
    }, 1500) // Simulate network delay
  }

  // Expose the refreshData function via ref
  useImperativeHandle(ref, () => ({
    refreshData,
  }))

  // Get risk color based on risk level
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "very low":
        return "bg-green-600"
      case "low":
        return "bg-emerald-600"
      case "moderate":
        return "bg-yellow-600"
      case "high":
        return "bg-red-600"
      default:
        return "bg-gray-600"
    }
  }

  return (
    <div className="flex flex-col h-full chat-area p-4 overflow-y-auto">
      <div className="hexagon-grid"></div>
      <div className="hexagon-overlay"></div>
      <div className="hexagon-glow"></div>

      {/* Header */}
      <div className="flex items-center mb-6">
        <Shield className="text-[#00ff4c] mr-2" size={24} />
        <h1 className="text-2xl font-bold text-[#00ff4c] drop-shadow-[0_0_8px_rgba(0,255,76,0.7)]">Safe Bets</h1>
      </div>

      {/* Search and Filter Bar */}
      <div className="grid grid-cols-1 gap-4 mb-6">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#00ff4c]" size={18} />
          <Input
            placeholder="Search assets..."
            className="pl-10 bg-black/50 border-[#00ff4c33] focus:border-[#00ff4c] text-white h-12"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="w-full bg-black/50 border-[#00ff4c33] text-white hover:bg-[#00ff4c15] hover:border-[#00ff4c] flex justify-between h-12">
                <div className="flex items-center">
                  <Filter size={16} className="mr-2 text-[#00ff4c]" />
                  <span className="truncate">
                    Category: {selectedCategory === "all" ? "All" : selectedCategory.toUpperCase()}
                  </span>
                </div>
                <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-black border-[#00ff4c33] backdrop-blur-sm">
              <DropdownMenuItem
                className="text-white hover:text-[#00ff4c] hover:bg-[#00ff4c15] cursor-pointer"
                onClick={() => setSelectedCategory("all")}
              >
                All Categories
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-white hover:text-[#00ff4c] hover:bg-[#00ff4c15] cursor-pointer"
                onClick={() => setSelectedCategory("stock")}
              >
                Stocks
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-white hover:text-[#00ff4c] hover:bg-[#00ff4c15] cursor-pointer"
                onClick={() => setSelectedCategory("etf")}
              >
                ETFs
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-white hover:text-[#00ff4c] hover:bg-[#00ff4c15] cursor-pointer"
                onClick={() => setSelectedCategory("crypto")}
              >
                Crypto
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-white hover:text-[#00ff4c] hover:bg-[#00ff4c15] cursor-pointer"
                onClick={() => setSelectedCategory("forex")}
              >
                Forex
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-white hover:text-[#00ff4c] hover:bg-[#00ff4c15] cursor-pointer"
                onClick={() => setSelectedCategory("commodity")}
              >
                Commodities
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="w-full bg-black/50 border-[#00ff4c33] text-white hover:bg-[#00ff4c15] hover:border-[#00ff4c] flex justify-between h-12">
                <div className="flex items-center">
                  <TrendingUp size={16} className="mr-2 text-[#00ff4c]" />
                  <span className="truncate">
                    Sort: {sortBy === "confidence" ? "Confidence" : sortBy === "expectedReturn" ? "Return" : sortBy}
                  </span>
                </div>
                <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-black border-[#00ff4c33] backdrop-blur-sm">
              <DropdownMenuItem
                className="text-white hover:text-[#00ff4c] hover:bg-[#00ff4c15] cursor-pointer"
                onClick={() => {
                  setSortBy("confidence")
                  setSortOrder("desc")
                }}
              >
                Highest Confidence
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-white hover:text-[#00ff4c] hover:bg-[#00ff4c15] cursor-pointer"
                onClick={() => {
                  setSortBy("expectedReturn")
                  setSortOrder("desc")
                }}
              >
                Highest Expected Return
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-white hover:text-[#00ff4c] hover:bg-[#00ff4c15] cursor-pointer"
                onClick={() => {
                  setSortBy("price")
                  setSortOrder("asc")
                }}
              >
                Price (Low to High)
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-white hover:text-[#00ff4c] hover:bg-[#00ff4c15] cursor-pointer"
                onClick={() => {
                  setSortBy("price")
                  setSortOrder("desc")
                }}
              >
                Price (High to Low)
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-white hover:text-[#00ff4c] hover:bg-[#00ff4c15] cursor-pointer"
                onClick={() => {
                  setSortBy("change")
                  setSortOrder("desc")
                }}
              >
                Biggest Gainers
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Additional Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-black/50 border-[#00ff4c33] backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="mb-2">
              <div className="flex justify-between">
                <span className="text-[#00ff4c] text-sm">Confidence Score</span>
                <span className="text-white text-sm">
                  {confidenceFilter[0]}% - {confidenceFilter[1]}%
                </span>
              </div>
              <Slider
                defaultValue={[70, 100]}
                min={0}
                max={100}
                step={1}
                value={confidenceFilter}
                onValueChange={setConfidenceFilter}
                className="my-4"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-[#00ff4c33] backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <span className="text-[#00ff4c] text-sm mb-2 sm:mb-0">Risk Level</span>
              <div className="flex flex-wrap gap-2">
                <Badge
                  className={`cursor-pointer ${
                    riskFilter === "all" ? "bg-[#00ff4c] text-black" : "bg-black/50 text-white"
                  }`}
                  onClick={() => setRiskFilter("all")}
                >
                  All
                </Badge>
                <Badge
                  className={`cursor-pointer ${riskFilter === "very low" ? "bg-green-600" : "bg-black/50 text-white"}`}
                  onClick={() => setRiskFilter("very low")}
                >
                  Very Low
                </Badge>
                <Badge
                  className={`cursor-pointer ${riskFilter === "low" ? "bg-emerald-600" : "bg-black/50 text-white"}`}
                  onClick={() => setRiskFilter("low")}
                >
                  Low
                </Badge>
                <Badge
                  className={`cursor-pointer ${riskFilter === "moderate" ? "bg-yellow-600" : "bg-black/50 text-white"}`}
                  onClick={() => setRiskFilter("moderate")}
                >
                  Moderate
                </Badge>
                <Badge
                  className={`cursor-pointer ${riskFilter === "high" ? "bg-red-600" : "bg-black/50 text-white"}`}
                  onClick={() => setRiskFilter("high")}
                >
                  High
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-[#00ff4c33] backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <span className="text-[#00ff4c] text-sm mb-2 sm:mb-0">Timeframe</span>
              <div className="flex flex-wrap gap-2">
                <Badge
                  className={`cursor-pointer ${
                    timeframeFilter === "all" ? "bg-[#00ff4c] text-black" : "bg-black/50 text-white"
                  }`}
                  onClick={() => setTimeframeFilter("all")}
                >
                  All
                </Badge>
                <Badge
                  className={`cursor-pointer ${
                    timeframeFilter === "short-term" ? "bg-[#00ff4c] text-black" : "bg-black/50 text-white"
                  }`}
                  onClick={() => setTimeframeFilter("short-term")}
                >
                  Short
                </Badge>
                <Badge
                  className={`cursor-pointer ${
                    timeframeFilter === "mid-term" ? "bg-[#00ff4c] text-black" : "bg-black/50 text-white"
                  }`}
                  onClick={() => setTimeframeFilter("mid-term")}
                >
                  Mid
                </Badge>
                <Badge
                  className={`cursor-pointer ${
                    timeframeFilter === "long-term" ? "bg-[#00ff4c] text-black" : "bg-black/50 text-white"
                  }`}
                  onClick={() => setTimeframeFilter("long-term")}
                >
                  Long
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">
          <span className="text-[#00ff4c]">{filteredBets.length}</span> Safe Bets Found
        </h2>
        <div className="flex items-center gap-2">
          <Badge className="bg-[#00ff4c] text-black">
            <Clock size={14} className="mr-1" />
            {isRefreshing
              ? "Refreshing..."
              : `Updated ${lastRefreshed.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}
          </Badge>
          <Button
            onClick={refreshData}
            disabled={isRefreshing}
            className="h-8 bg-black/50 border-[#00ff4c33] hover:bg-[#00ff4c15] hover:border-[#00ff4c] text-white"
          >
            <RefreshCw size={14} className={`mr-1 text-[#00ff4c] ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Refreshing" : "Refresh"}
          </Button>
        </div>
      </div>

      {/* Main Content - Split View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Asset List */}
        <div className="md:col-span-1 space-y-4">
          {filteredBets.map((bet) => (
            <Card
              key={bet.id}
              className={`bg-black/50 border-[#00ff4c33] backdrop-blur-sm cursor-pointer transition-all hover:border-[#00ff4c] ${
                selectedBet?.id === bet.id ? "border-[#00ff4c] shadow-[0_0_10px_rgba(0,255,76,0.3)]" : ""
              }`}
              onClick={() => setSelectedBet(bet)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="text-white font-bold text-lg">{bet.symbol}</div>
                    <div className="text-gray-400 text-xs truncate max-w-[150px]">{bet.name}</div>
                  </div>
                  <Badge className={getRiskColor(bet.risk)}>{bet.risk}</Badge>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <div className="text-white">${bet.price.toLocaleString()}</div>
                  <div className={bet.change >= 0 ? "text-green-400" : "text-red-400"}>
                    {bet.change >= 0 ? "+" : ""}
                    {bet.change}%
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-xs">Confidence</span>
                    <span className="text-white text-xs font-bold">{bet.confidence}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                    <div className="h-1.5 rounded-full bg-[#00ff4c]" style={{ width: `${bet.confidence}%` }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredBets.length === 0 && (
            <div className="flex flex-col items-center justify-center p-8 bg-black/30 border border-[#00ff4c33] rounded-lg">
              <Shield size={48} className="text-[#00ff4c] opacity-50 mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">No Safe Bets Found</h3>
              <p className="text-white text-opacity-70 text-center">
                Try adjusting your filters to see more investment opportunities.
              </p>
            </div>
          )}
        </div>

        {/* Right Column - Detailed View */}
        <div className="md:col-span-2">
          {selectedBet ? (
            <Card className="bg-black/50 border-[#00ff4c33] backdrop-blur-sm">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-white text-xl sm:text-2xl flex items-center flex-wrap gap-2">
                      {selectedBet.symbol}
                      <Badge className="text-xs">{selectedBet.category.toUpperCase()}</Badge>
                    </CardTitle>
                    <div className="text-gray-400 text-sm truncate">{selectedBet.name}</div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="text-white text-lg sm:text-xl font-bold">${selectedBet.price.toLocaleString()}</div>
                    <div className={`flex items-center ${selectedBet.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                      <ArrowUpRight size={16} className={selectedBet.change < 0 ? "rotate-180" : ""} />
                      {selectedBet.change >= 0 ? "+" : ""}
                      {selectedBet.change}%
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid grid-cols-3 mb-4 bg-black/50 border border-[#00ff4c33] h-12">
                    <TabsTrigger
                      value="overview"
                      className="data-[state=active]:bg-[#00ff4c20] data-[state=active]:text-[#00ff4c] text-white"
                    >
                      Overview
                    </TabsTrigger>
                    <TabsTrigger
                      value="chart"
                      className="data-[state=active]:bg-[#00ff4c20] data-[state=active]:text-[#00ff4c] text-white"
                    >
                      Chart
                    </TabsTrigger>
                    <TabsTrigger
                      value="metrics"
                      className="data-[state=active]:bg-[#00ff4c20] data-[state=active]:text-[#00ff4c] text-white"
                    >
                      Metrics
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-black/70 p-3 rounded-md border border-[#00ff4c33]">
                          <div className="text-[#00ff4c] text-xs mb-1">Confidence Score</div>
                          <div className="text-white text-lg sm:text-2xl font-bold">{selectedBet.confidence}%</div>
                        </div>
                        <div className="bg-black/70 p-3 rounded-md border border-[#00ff4c33]">
                          <div className="text-[#00ff4c] text-xs mb-1">Risk Level</div>
                          <div className="text-white text-lg sm:text-2xl font-bold capitalize">{selectedBet.risk}</div>
                        </div>
                        <div className="bg-black/70 p-3 rounded-md border border-[#00ff4c33]">
                          <div className="text-[#00ff4c] text-xs mb-1">Expected Return</div>
                          <div className="text-white text-lg sm:text-2xl font-bold">+{selectedBet.expectedReturn}%</div>
                        </div>
                        <div className="bg-black/70 p-3 rounded-md border border-[#00ff4c33]">
                          <div className="text-[#00ff4c] text-xs mb-1">Timeframe</div>
                          <div className="text-white text-lg sm:text-2xl font-bold capitalize">
                            {selectedBet.timeframe.replace("-", " ")}
                          </div>
                        </div>
                      </div>

                      <div className="bg-black/70 p-4 rounded-md border border-[#00ff4c33]">
                        <h3 className="text-[#00ff4c] font-medium mb-2">Analysis</h3>
                        <p className="text-white text-sm sm:text-base">{selectedBet.description}</p>
                      </div>

                      <div className="bg-black/70 p-4 rounded-md border border-[#00ff4c33]">
                        <h3 className="text-[#00ff4c] font-medium mb-2">Key Factors</h3>
                        <ul className="space-y-2 text-white text-sm sm:text-base">
                          <li className="flex items-start">
                            <div className="text-[#00ff4c] mr-2">•</div>
                            <span>Strong technical indicators with multiple confirmation signals</span>
                          </li>
                          <li className="flex items-start">
                            <div className="text-[#00ff4c] mr-2">•</div>
                            <span>Positive sentiment from institutional investors</span>
                          </li>
                          <li className="flex items-start">
                            <div className="text-[#00ff4c] mr-2">•</div>
                            <span>Favorable market conditions for this asset class</span>
                          </li>
                          <li className="flex items-start">
                            <div className="text-[#00ff4c] mr-2">•</div>
                            <span>Historical performance consistent with projected outcomes</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="chart">
                    <div className="bg-black/70 p-4 rounded-md border border-[#00ff4c33] h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={selectedBet.historicalData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                          <XAxis
                            dataKey="date"
                            tick={{ fill: "#fff" }}
                            tickLine={{ stroke: "#555" }}
                            axisLine={{ stroke: "#555" }}
                          />
                          <YAxis
                            tick={{ fill: "#fff" }}
                            tickLine={{ stroke: "#555" }}
                            axisLine={{ stroke: "#555" }}
                            domain={["auto", "auto"]}
                          />
                          <Tooltip
                            contentStyle={{ backgroundColor: "#000", border: "1px solid #00ff4c33" }}
                            labelStyle={{ color: "#00ff4c" }}
                            formatter={(value: number) => [`$${value.toFixed(2)}`, "Price"]}
                          />
                          <Line
                            type="monotone"
                            dataKey="price"
                            stroke="#00ff4c"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 6, fill: "#00ff4c" }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div className="bg-black/70 p-3 rounded-md border border-[#00ff4c33]">
                        <div className="text-[#00ff4c] text-xs mb-1">Price Range (30d)</div>
                        <div className="text-white text-sm">
                          ${Math.min(...selectedBet.historicalData.map((d) => d.price)).toFixed(2)} - $
                          {Math.max(...selectedBet.historicalData.map((d) => d.price)).toFixed(2)}
                        </div>
                      </div>
                      <div className="bg-black/70 p-3 rounded-md border border-[#00ff4c33]">
                        <div className="text-[#00ff4c] text-xs mb-1">30d Change</div>
                        <div
                          className={
                            selectedBet.historicalData[selectedBet.historicalData.length - 1].price >
                            selectedBet.historicalData[0].price
                              ? "text-green-400"
                              : "text-red-400"
                          }
                        >
                          {(
                            ((selectedBet.historicalData[selectedBet.historicalData.length - 1].price -
                              selectedBet.historicalData[0].price) /
                              selectedBet.historicalData[0].price) *
                            100
                          ).toFixed(2)}
                          %
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="metrics">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-black/70 p-4 rounded-md border border-[#00ff4c33]">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[#00ff4c]">Volatility</span>
                            <span className="text-white">{selectedBet.metrics.volatility}%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="h-2 rounded-full bg-yellow-500"
                              style={{ width: `${selectedBet.metrics.volatility}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {selectedBet.metrics.volatility < 30
                              ? "Low volatility indicates stable price movement"
                              : selectedBet.metrics.volatility < 60
                                ? "Moderate volatility with manageable risk"
                                : "High volatility - potential for larger price swings"}
                          </div>
                        </div>

                        <div className="bg-black/70 p-4 rounded-md border border-[#00ff4c33]">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[#00ff4c]">Momentum</span>
                            <span className="text-white">{selectedBet.metrics.momentum}%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="h-2 rounded-full bg-[#00ff4c]"
                              style={{ width: `${selectedBet.metrics.momentum}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {selectedBet.metrics.momentum < 40
                              ? "Weak momentum - may need catalyst"
                              : selectedBet.metrics.momentum < 70
                                ? "Building momentum with positive trend"
                                : "Strong momentum indicating continued movement"}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-black/70 p-4 rounded-md border border-[#00ff4c33]">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[#00ff4c]">Stability</span>
                            <span className="text-white">{selectedBet.metrics.stability}%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="h-2 rounded-full bg-blue-500"
                              style={{ width: `${selectedBet.metrics.stability}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {selectedBet.metrics.stability < 40
                              ? "Low stability - higher risk profile"
                              : selectedBet.metrics.stability < 70
                                ? "Moderate stability with acceptable risk"
                                : "High stability indicating reliable performance"}
                          </div>
                        </div>

                        <div className="bg-black/70 p-4 rounded-md border border-[#00ff4c33]">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[#00ff4c]">Sentiment</span>
                            <span className="text-white">{selectedBet.metrics.sentiment}%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="h-2 rounded-full bg-purple-500"
                              style={{ width: `${selectedBet.metrics.sentiment}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {selectedBet.metrics.sentiment < 40
                              ? "Negative sentiment - contrarian opportunity"
                              : selectedBet.metrics.sentiment < 70
                                ? "Mixed sentiment with improving outlook"
                                : "Positive sentiment from market participants"}
                          </div>
                        </div>
                      </div>

                      <div className="bg-black/70 p-4 rounded-md border border-[#00ff4c33]">
                        <h3 className="text-[#00ff4c] font-medium mb-2">Model Confidence Factors</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-white">Technical Analysis</span>
                            <Badge className="bg-green-600">Strong</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-white">Fundamental Analysis</span>
                            <Badge className="bg-green-600">Strong</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-white">Market Conditions</span>
                            <Badge className="bg-emerald-600">Favorable</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-white">Risk Assessment</span>
                            <Badge className={getRiskColor(selectedBet.risk)}>{selectedBet.risk}</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 bg-black/30 border border-[#00ff4c33] rounded-lg">
              <Shield size={64} className="text-[#00ff4c] opacity-50 mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">Select a Safe Bet</h3>
              <p className="text-white text-opacity-70 text-center">
                Choose an asset from the list to view detailed analysis and metrics.
              </p>
            </div>
          )}
        </div>
      </div>
      <SafeBetsChat />
    </div>
  )
})

export default SafeBetsContent
