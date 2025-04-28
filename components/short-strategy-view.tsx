"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowDown, TrendingDown, Clock, Newspaper } from "lucide-react"

interface ShortOpportunity {
  id: number
  asset: string
  headline: string
  confidence: number
  timestamp: string
  timeAgo: string
}

export default function ShortStrategyView() {
  const [opportunities] = useState<ShortOpportunity[]>([
    {
      id: 1,
      asset: "TSLA",
      headline: "Tesla recalls 300,000 vehicles due to software defect",
      confidence: 87,
      timestamp: "2023-04-26T08:15:00Z",
      timeAgo: "15 minutes ago",
    },
    {
      id: 2,
      asset: "AAPL",
      headline: "Apple supplier reports significant production delays",
      confidence: 82,
      timestamp: "2023-04-26T08:20:00Z",
      timeAgo: "10 minutes ago",
    },
    {
      id: 3,
      asset: "NFLX",
      headline: "Netflix subscriber growth slows dramatically in Q2",
      confidence: 79,
      timestamp: "2023-04-26T08:25:00Z",
      timeAgo: "5 minutes ago",
    },
    {
      id: 4,
      asset: "META",
      headline: "Meta faces new regulatory challenges in EU markets",
      confidence: 76,
      timestamp: "2023-04-26T08:28:00Z",
      timeAgo: "2 minutes ago",
    },
    {
      id: 5,
      asset: "AMZN",
      headline: "Amazon warehouse workers announce nationwide strike",
      confidence: 74,
      timestamp: "2023-04-26T08:30:00Z",
      timeAgo: "just now",
    },
    {
      id: 6,
      asset: "GOOGL",
      headline: "Google antitrust case moves forward with damaging evidence",
      confidence: 71,
      timestamp: "2023-04-26T08:32:00Z",
      timeAgo: "just now",
    },
  ])

  return (
    <div className="flex flex-col h-full chat-area p-4 overflow-y-auto">
      <div className="hexagon-grid"></div>
      <div className="hexagon-overlay"></div>
      <div className="hexagon-glow"></div>
      <div className="flex items-center mb-6">
        <TrendingDown className="text-[#00ff4c] mr-2" size={24} />
        <h1 className="text-2xl font-bold text-[#00ff4c] drop-shadow-[0_0_8px_rgba(0,255,76,0.7)]">Short Strategy</h1>
      </div>

      <p className="text-white mb-6">Top negative stories with high confidence for short strategy trades:</p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {opportunities.map((opportunity) => (
          <Card key={opportunity.id} className="bg-black/50 border-[#00ff4c33] backdrop-blur-sm overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-white text-lg">{opportunity.asset}</CardTitle>
                <Badge className="bg-red-600 hover:bg-red-700">
                  <ArrowDown className="h-3 w-3 mr-1" />
                  Short
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center mb-2">
                  <Newspaper size={14} className="text-[#00ff4c] mr-2" />
                  <p className="text-white text-sm">{opportunity.headline}</p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Confidence</span>
                  <span className="text-white font-bold">{opportunity.confidence}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="h-2 rounded-full bg-red-500" style={{ width: `${opportunity.confidence}%` }}></div>
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
