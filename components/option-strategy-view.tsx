"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUp, ArrowDown, CandlestickChart, Clock } from "lucide-react"

interface OptionOpportunity {
  id: number
  asset: string
  strategy: string
  direction: "call" | "put"
  confidence: number
  timestamp: string
  timeAgo: string
  expiry: string
}

export default function OptionStrategyView() {
  const [opportunities] = useState<OptionOpportunity[]>([
    {
      id: 1,
      asset: "AAPL",
      strategy: "Long Call",
      direction: "call",
      confidence: 89,
      timestamp: "2023-04-26T08:15:00Z",
      timeAgo: "15 minutes ago",
      expiry: "2 weeks",
    },
    {
      id: 2,
      asset: "TSLA",
      strategy: "Long Put",
      direction: "put",
      confidence: 86,
      timestamp: "2023-04-26T08:20:00Z",
      timeAgo: "10 minutes ago",
      expiry: "1 month",
    },
    {
      id: 3,
      asset: "AMZN",
      strategy: "Bull Call Spread",
      direction: "call",
      confidence: 83,
      timestamp: "2023-04-26T08:25:00Z",
      timeAgo: "5 minutes ago",
      expiry: "3 weeks",
    },
    {
      id: 4,
      asset: "MSFT",
      strategy: "Long Call",
      direction: "call",
      confidence: 81,
      timestamp: "2023-04-26T08:28:00Z",
      timeAgo: "2 minutes ago",
      expiry: "1 month",
    },
    {
      id: 5,
      asset: "META",
      strategy: "Bear Put Spread",
      direction: "put",
      confidence: 78,
      timestamp: "2023-04-26T08:30:00Z",
      timeAgo: "just now",
      expiry: "2 weeks",
    },
    {
      id: 6,
      asset: "NFLX",
      strategy: "Long Put",
      direction: "put",
      confidence: 76,
      timestamp: "2023-04-26T08:32:00Z",
      timeAgo: "just now",
      expiry: "1 month",
    },
  ])

  return (
    <div className="flex flex-col h-full chat-area p-4 overflow-y-auto">
      <div className="hexagon-grid"></div>
      <div className="hexagon-overlay"></div>
      <div className="hexagon-glow"></div>
      <div className="flex items-center mb-6">
        <CandlestickChart className="text-[#00ff4c] mr-2" size={24} />
        <h1 className="text-2xl font-bold text-[#00ff4c] drop-shadow-[0_0_8px_rgba(0,255,76,0.7)]">Option Strategy</h1>
      </div>

      <p className="text-white mb-6">Top high-confidence option trade opportunities:</p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {opportunities.map((opportunity) => (
          <Card key={opportunity.id} className="bg-black/50 border-[#00ff4c33] backdrop-blur-sm overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-white text-lg">{opportunity.asset}</CardTitle>
                <Badge
                  className={
                    opportunity.direction === "call" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                  }
                >
                  {opportunity.direction === "call" ? (
                    <ArrowUp className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDown className="h-3 w-3 mr-1" />
                  )}
                  {opportunity.strategy}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Expiry</span>
                  <span className="text-white">{opportunity.expiry}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Confidence</span>
                  <span className="text-white font-bold">{opportunity.confidence}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${opportunity.direction === "call" ? "bg-green-500" : "bg-red-500"}`}
                    style={{ width: `${opportunity.confidence}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-end text-xs text-gray-400 mt-2">
                  <Clock size={12} className="mr-1" />
                  {opportunity.timeAgo}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
