"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUp, ArrowDown, TrendingUp, Clock, Search, Plus, Minus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface Prediction {
  id: number
  asset: string
  direction: "up" | "down"
  confidence: number
  timestamp: string
  timeAgo: string
}

export default function AnalyzeView() {
  const categories = [
    { id: "stocks", name: "Stocks" },
    { id: "crypto", name: "Crypto" },
    { id: "commodities", name: "Commodities" },
    { id: "forex", name: "Forex" },
    { id: "metals", name: "Precious Metals" },
  ]

  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("stocks")

  const [predictions] = useState<Record<string, Prediction[]>>({
    stocks: [
      {
        id: 1,
        asset: "AAPL",
        direction: "up",
        confidence: 87,
        timestamp: "2023-04-26T08:15:00Z",
        timeAgo: "15 minutes ago",
      },
      {
        id: 2,
        asset: "MSFT",
        direction: "up",
        confidence: 82,
        timestamp: "2023-04-26T08:20:00Z",
        timeAgo: "10 minutes ago",
      },
      {
        id: 3,
        asset: "GOOGL",
        direction: "down",
        confidence: 76,
        timestamp: "2023-04-26T08:25:00Z",
        timeAgo: "5 minutes ago",
      },
      {
        id: 4,
        asset: "AMZN",
        direction: "up",
        confidence: 71,
        timestamp: "2023-04-26T08:28:00Z",
        timeAgo: "2 minutes ago",
      },
      {
        id: 5,
        asset: "TSLA",
        direction: "down",
        confidence: 68,
        timestamp: "2023-04-26T08:30:00Z",
        timeAgo: "just now",
      },
      {
        id: 6,
        asset: "NVDA",
        direction: "up",
        confidence: 79,
        timestamp: "2023-04-26T08:32:00Z",
        timeAgo: "just now",
      },
    ],
    crypto: [
      {
        id: 1,
        asset: "BTC/USD",
        direction: "up",
        confidence: 89,
        timestamp: "2023-04-26T08:15:00Z",
        timeAgo: "15 minutes ago",
      },
      {
        id: 2,
        asset: "ETH/USD",
        direction: "up",
        confidence: 84,
        timestamp: "2023-04-26T08:20:00Z",
        timeAgo: "10 minutes ago",
      },
      {
        id: 3,
        asset: "SOL/USD",
        direction: "up",
        confidence: 78,
        timestamp: "2023-04-26T08:25:00Z",
        timeAgo: "5 minutes ago",
      },
      {
        id: 4,
        asset: "ADA/USD",
        direction: "down",
        confidence: 72,
        timestamp: "2023-04-26T08:28:00Z",
        timeAgo: "2 minutes ago",
      },
      {
        id: 5,
        asset: "DOT/USD",
        direction: "down",
        confidence: 65,
        timestamp: "2023-04-26T08:30:00Z",
        timeAgo: "just now",
      },
      {
        id: 6,
        asset: "XRP/USD",
        direction: "up",
        confidence: 77,
        timestamp: "2023-04-26T08:32:00Z",
        timeAgo: "just now",
      },
    ],
    commodities: [
      {
        id: 1,
        asset: "OIL",
        direction: "down",
        confidence: 81,
        timestamp: "2023-04-26T08:15:00Z",
        timeAgo: "15 minutes ago",
      },
      {
        id: 2,
        asset: "NAT GAS",
        direction: "up",
        confidence: 77,
        timestamp: "2023-04-26T08:20:00Z",
        timeAgo: "10 minutes ago",
      },
      {
        id: 3,
        asset: "WHEAT",
        direction: "down",
        confidence: 72,
        timestamp: "2023-04-26T08:25:00Z",
        timeAgo: "5 minutes ago",
      },
      {
        id: 4,
        asset: "CORN",
        direction: "down",
        confidence: 68,
        timestamp: "2023-04-26T08:28:00Z",
        timeAgo: "2 minutes ago",
      },
      {
        id: 5,
        asset: "COTTON",
        direction: "up",
        confidence: 63,
        timestamp: "2023-04-26T08:30:00Z",
        timeAgo: "just now",
      },
      {
        id: 6,
        asset: "SUGAR",
        direction: "up",
        confidence: 69,
        timestamp: "2023-04-26T08:32:00Z",
        timeAgo: "just now",
      },
    ],
    forex: [
      {
        id: 1,
        asset: "EUR/USD",
        direction: "up",
        confidence: 85,
        timestamp: "2023-04-26T08:15:00Z",
        timeAgo: "15 minutes ago",
      },
      {
        id: 2,
        asset: "GBP/USD",
        direction: "down",
        confidence: 79,
        timestamp: "2023-04-26T08:20:00Z",
        timeAgo: "10 minutes ago",
      },
      {
        id: 3,
        asset: "USD/JPY",
        direction: "up",
        confidence: 74,
        timestamp: "2023-04-26T08:25:00Z",
        timeAgo: "5 minutes ago",
      },
      {
        id: 4,
        asset: "AUD/USD",
        direction: "down",
        confidence: 69,
        timestamp: "2023-04-26T08:28:00Z",
        timeAgo: "2 minutes ago",
      },
      {
        id: 5,
        asset: "USD/CAD",
        direction: "up",
        confidence: 64,
        timestamp: "2023-04-26T08:30:00Z",
        timeAgo: "just now",
      },
      {
        id: 6,
        asset: "USD/CHF",
        direction: "down",
        confidence: 67,
        timestamp: "2023-04-26T08:32:00Z",
        timeAgo: "just now",
      },
    ],
    metals: [
      {
        id: 1,
        asset: "GOLD",
        direction: "up",
        confidence: 88,
        timestamp: "2023-04-26T08:15:00Z",
        timeAgo: "15 minutes ago",
      },
      {
        id: 2,
        asset: "SILVER",
        direction: "up",
        confidence: 83,
        timestamp: "2023-04-26T08:20:00Z",
        timeAgo: "10 minutes ago",
      },
      {
        id: 3,
        asset: "PLATINUM",
        direction: "down",
        confidence: 75,
        timestamp: "2023-04-26T08:25:00Z",
        timeAgo: "5 minutes ago",
      },
      {
        id: 4,
        asset: "PALLADIUM",
        direction: "down",
        confidence: 70,
        timestamp: "2023-04-26T08:28:00Z",
        timeAgo: "2 minutes ago",
      },
      {
        id: 5,
        asset: "COPPER",
        direction: "up",
        confidence: 67,
        timestamp: "2023-04-26T08:30:00Z",
        timeAgo: "just now",
      },
      {
        id: 6,
        asset: "ALUMINUM",
        direction: "down",
        confidence: 65,
        timestamp: "2023-04-26T08:32:00Z",
        timeAgo: "just now",
      },
    ],
  })

  const handleTabChange = (value: string) => {
    setActiveCategory(value)
  }

  const filteredPredictions = (category: string) => {
    return predictions[category].filter((prediction) =>
      prediction.asset.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }

  return (
    <div className="flex flex-col h-full chat-area p-4 overflow-y-auto">
      <div className="hexagon-grid"></div>
      <div className="hexagon-overlay"></div>
      <div className="hexagon-glow"></div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <TrendingUp className="text-[#00ff4c] mr-2" size={24} />
          <h1 className="text-2xl font-bold text-[#00ff4c] drop-shadow-[0_0_8px_rgba(0,255,76,0.7)]">
            Market Analysis
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="neon-outline">
            <Plus size={16} className="mr-1" /> Add
          </Button>
          <Button variant="outline" size="sm" className="neon-outline">
            <Minus size={16} className="mr-1" /> Remove
          </Button>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#00ff4c]" size={18} />
        <Input
          placeholder="Search assets..."
          className="pl-10 bg-black/50 border-[#00ff4c33] focus:border-[#00ff4c] text-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Tabs defaultValue="stocks" className="w-full" onValueChange={handleTabChange}>
        <TabsList className="grid grid-cols-5 mb-8 bg-black/50 border border-[#00ff4c33]">
          {categories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="data-[state=active]:bg-[#00ff4c20] data-[state=active]:text-[#00ff4c] text-white"
            >
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-0">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredPredictions(category.id).map((prediction) => (
                <Card key={prediction.id} className="bg-black/50 border-[#00ff4c33] backdrop-blur-sm overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-white text-lg">{prediction.asset}</CardTitle>
                      <Badge
                        className={
                          prediction.direction === "up"
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-red-600 hover:bg-red-700"
                        }
                      >
                        {prediction.direction === "up" ? (
                          <ArrowUp className="h-3 w-3 mr-1" />
                        ) : (
                          <ArrowDown className="h-3 w-3 mr-1" />
                        )}
                        {prediction.direction === "up" ? "Bullish" : "Bearish"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Confidence</span>
                        <span className="text-white font-bold">{prediction.confidence}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${prediction.direction === "up" ? "bg-green-500" : "bg-red-500"}`}
                          style={{ width: `${prediction.confidence}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center justify-end text-xs text-gray-400 mt-2">
                        <Clock size={12} className="mr-1" />
                        {prediction.timeAgo}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
