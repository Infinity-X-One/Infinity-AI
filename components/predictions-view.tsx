"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUp, ArrowDown, Clock } from "lucide-react"

interface Prediction {
  id: number
  asset: string
  direction: "up" | "down"
  confidence: number
  timestamp: string
  timeAgo: string
}

export default function PredictionsView() {
  const [predictions] = useState<Prediction[]>([
    {
      id: 1,
      asset: "BTC/USD",
      direction: "up",
      confidence: 87,
      timestamp: "2023-04-26T08:15:00Z",
      timeAgo: "15 minutes ago",
    },
    {
      id: 2,
      asset: "ETH/USD",
      direction: "up",
      confidence: 82,
      timestamp: "2023-04-26T08:20:00Z",
      timeAgo: "10 minutes ago",
    },
    {
      id: 3,
      asset: "AAPL",
      direction: "down",
      confidence: 76,
      timestamp: "2023-04-26T08:25:00Z",
      timeAgo: "5 minutes ago",
    },
    {
      id: 4,
      asset: "EUR/USD",
      direction: "down",
      confidence: 71,
      timestamp: "2023-04-26T08:28:00Z",
      timeAgo: "2 minutes ago",
    },
    {
      id: 5,
      asset: "GOLD",
      direction: "up",
      confidence: 68,
      timestamp: "2023-04-26T08:30:00Z",
      timeAgo: "just now",
    },
  ])

  return (
    <div className="flex flex-col h-full chat-area p-4 overflow-y-auto">
      <div className="hexagon-grid"></div>
      <div className="hexagon-overlay"></div>
      <div className="hexagon-glow"></div>
      <h1 className="text-2xl font-bold text-[#00ff4c] mb-6 drop-shadow-[0_0_8px_rgba(0,255,76,0.7)]">
        Top Predictions (Last Hour)
      </h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {predictions.map((prediction) => (
          <Card key={prediction.id} className="bg-black/50 border-[#00ff4c33] backdrop-blur-sm overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-white text-lg">{prediction.asset}</CardTitle>
                <Badge
                  className={
                    prediction.direction === "up" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
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
    </div>
  )
}
