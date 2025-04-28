"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUp, ArrowDown, Newspaper, Clock } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface CriticalNews {
  id: number
  headline: string
  asset: string
  direction: "up" | "down"
  confidence: number
  timestamp: string
  timeAgo: string
  predictions: {
    "1h": number
    "1d": number
    "1w": number
    "1m": number
  }
}

export default function CriticalNewsView() {
  const [criticalNews] = useState<CriticalNews[]>([
    {
      id: 1,
      headline: "Fed announces surprise interest rate cut",
      asset: "S&P 500",
      direction: "up",
      confidence: 92,
      timestamp: "2023-04-26T08:15:00Z",
      timeAgo: "15 minutes ago",
      predictions: {
        "1h": 0.8,
        "1d": 1.5,
        "1w": 2.7,
        "1m": 4.2,
      },
    },
    {
      id: 2,
      headline: "Major oil pipeline disruption in Middle East",
      asset: "Crude Oil",
      direction: "up",
      confidence: 89,
      timestamp: "2023-04-26T08:20:00Z",
      timeAgo: "10 minutes ago",
      predictions: {
        "1h": 1.2,
        "1d": 3.5,
        "1w": 5.1,
        "1m": 7.3,
      },
    },
    {
      id: 3,
      headline: "China announces new tech regulations",
      asset: "BABA",
      direction: "down",
      confidence: 87,
      timestamp: "2023-04-26T08:25:00Z",
      timeAgo: "5 minutes ago",
      predictions: {
        "1h": -1.5,
        "1d": -3.2,
        "1w": -6.8,
        "1m": -9.4,
      },
    },
    {
      id: 4,
      headline: "Major pharmaceutical breakthrough announced",
      asset: "PFE",
      direction: "up",
      confidence: 85,
      timestamp: "2023-04-26T08:28:00Z",
      timeAgo: "2 minutes ago",
      predictions: {
        "1h": 0.9,
        "1d": 2.7,
        "1w": 5.3,
        "1m": 8.1,
      },
    },
    {
      id: 5,
      headline: "Semiconductor shortage expected to worsen",
      asset: "SOX",
      direction: "down",
      confidence: 83,
      timestamp: "2023-04-26T08:30:00Z",
      timeAgo: "just now",
      predictions: {
        "1h": -0.7,
        "1d": -2.1,
        "1w": -4.5,
        "1m": -7.2,
      },
    },
    {
      id: 6,
      headline: "New government stimulus package announced",
      asset: "Russell 2000",
      direction: "up",
      confidence: 81,
      timestamp: "2023-04-26T08:32:00Z",
      timeAgo: "just now",
      predictions: {
        "1h": 0.6,
        "1d": 1.8,
        "1w": 3.5,
        "1m": 5.9,
      },
    },
  ])

  return (
    <div className="flex flex-col h-full chat-area p-4 overflow-y-auto">
      <div className="hexagon-grid"></div>
      <div className="hexagon-overlay"></div>
      <div className="hexagon-glow"></div>
      <div className="flex items-center mb-6">
        <Newspaper className="text-[#00ff4c] mr-2" size={24} />
        <h1 className="text-2xl font-bold text-[#00ff4c] drop-shadow-[0_0_8px_rgba(0,255,76,0.7)]">Critical News</h1>
      </div>

      <p className="text-white mb-6">Top market-moving news with price predictions:</p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {criticalNews.map((news) => (
          <Card key={news.id} className="bg-black/50 border-[#00ff4c33] backdrop-blur-sm overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center mb-2">
                <CardTitle className="text-white text-lg">{news.asset}</CardTitle>
                <Badge
                  className={
                    news.direction === "up" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                  }
                >
                  {news.direction === "up" ? (
                    <ArrowUp className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDown className="h-3 w-3 mr-1" />
                  )}
                  {news.confidence}% Confidence
                </Badge>
              </div>
              <p className="text-white text-sm">{news.headline}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-[#00ff4c] text-xs font-semibold mb-2">Predicted Price Movement</p>
                <Tabs defaultValue="1h" className="w-full">
                  <TabsList className="grid grid-cols-4 bg-black/50 border border-[#00ff4c33]">
                    <TabsTrigger
                      value="1h"
                      className="text-xs data-[state=active]:bg-[#00ff4c20] data-[state=active]:text-[#00ff4c] text-white"
                    >
                      1 Hour
                    </TabsTrigger>
                    <TabsTrigger
                      value="1d"
                      className="text-xs data-[state=active]:bg-[#00ff4c20] data-[state=active]:text-[#00ff4c] text-white"
                    >
                      1 Day
                    </TabsTrigger>
                    <TabsTrigger
                      value="1w"
                      className="text-xs data-[state=active]:bg-[#00ff4c20] data-[state=active]:text-[#00ff4c] text-white"
                    >
                      1 Week
                    </TabsTrigger>
                    <TabsTrigger
                      value="1m"
                      className="text-xs data-[state=active]:bg-[#00ff4c20] data-[state=active]:text-[#00ff4c] text-white"
                    >
                      1 Month
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="1h" className="mt-2 text-center">
                    <span
                      className={`text-lg font-bold ${news.predictions["1h"] > 0 ? "text-green-500" : "text-red-500"}`}
                    >
                      {news.predictions["1h"] > 0 ? "+" : ""}
                      {news.predictions["1h"]}%
                    </span>
                  </TabsContent>
                  <TabsContent value="1d" className="mt-2 text-center">
                    <span
                      className={`text-lg font-bold ${news.predictions["1d"] > 0 ? "text-green-500" : "text-red-500"}`}
                    >
                      {news.predictions["1d"] > 0 ? "+" : ""}
                      {news.predictions["1d"]}%
                    </span>
                  </TabsContent>
                  <TabsContent value="1w" className="mt-2 text-center">
                    <span
                      className={`text-lg font-bold ${news.predictions["1w"] > 0 ? "text-green-500" : "text-red-500"}`}
                    >
                      {news.predictions["1w"] > 0 ? "+" : ""}
                      {news.predictions["1w"]}%
                    </span>
                  </TabsContent>
                  <TabsContent value="1m" className="mt-2 text-center">
                    <span
                      className={`text-lg font-bold ${news.predictions["1m"] > 0 ? "text-green-500" : "text-red-500"}`}
                    >
                      {news.predictions["1m"] > 0 ? "+" : ""}
                      {news.predictions["1m"]}%
                    </span>
                  </TabsContent>
                </Tabs>
                <div className="flex items-center justify-end text-xs text-gray-400 mt-2">
                  <Clock size={12} className="mr-1" />
                  {news.timeAgo}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
