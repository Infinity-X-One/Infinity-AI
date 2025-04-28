"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import SentimentContent from "./sentiment-content"
import ToolButton from "./tool-button"
import { Heart, TrendingUp, TrendingDown, BarChart2, LineChart } from "lucide-react"

export default function SentimentInterface() {
  const [activeTab, setActiveTab] = useState("market")
  const [isLoading, setIsLoading] = useState(false)

  const handleTabChange = (tab: string) => {
    setIsLoading(true)
    // Simulate loading
    setTimeout(() => {
      setActiveTab(tab)
      setIsLoading(false)
    }, 500)
  }

  const handlePromptClick = (prompt: string) => {
    console.log(`Prompt clicked: ${prompt}`)
    // Here you would trigger the sentiment analysis with the selected prompt
  }

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex border-b border-[#00ff4c33] px-4">
        <Button
          variant="ghost"
          className={`px-4 py-2 ${
            activeTab === "market" ? "text-[#00ff4c] border-b-2 border-[#00ff4c]" : "text-white hover:text-[#00ff4c]"
          }`}
          onClick={() => handleTabChange("market")}
        >
          Market Sentiment
        </Button>
        <Button
          variant="ghost"
          className={`px-4 py-2 ${
            activeTab === "social" ? "text-[#00ff4c] border-b-2 border-[#00ff4c]" : "text-white hover:text-[#00ff4c]"
          }`}
          onClick={() => handleTabChange("social")}
        >
          Social Sentiment
        </Button>
        <Button
          variant="ghost"
          className={`px-4 py-2 ${
            activeTab === "news" ? "text-[#00ff4c] border-b-2 border-[#00ff4c]" : "text-white hover:text-[#00ff4c]"
          }`}
          onClick={() => handleTabChange("news")}
        >
          News Sentiment
        </Button>
      </div>

      {/* Quick action buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 p-4">
        <ToolButton
          icon={<Heart className="w-4 h-4 mr-2 text-[#00ff4c]" />}
          label="Overall Market Sentiment"
          onClick={() => handlePromptClick("Analyze overall market sentiment today")}
        />
        <ToolButton
          icon={<TrendingUp className="w-4 h-4 mr-2 text-[#00ff4c]" />}
          label="Bullish Indicators"
          onClick={() => handlePromptClick("Show bullish market indicators")}
        />
        <ToolButton
          icon={<TrendingDown className="w-4 h-4 mr-2 text-[#00ff4c]" />}
          label="Bearish Indicators"
          onClick={() => handlePromptClick("Show bearish market indicators")}
        />
        <ToolButton
          icon={<BarChart2 className="w-4 h-4 mr-2 text-[#00ff4c]" />}
          label="Sector Sentiment"
          onClick={() => handlePromptClick("Analyze sentiment by market sector")}
        />
        <ToolButton
          icon={<LineChart className="w-4 h-4 mr-2 text-[#00ff4c]" />}
          label="Sentiment Trends"
          onClick={() => handlePromptClick("Show sentiment trends over time")}
        />
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse text-[#00ff4c]">Loading sentiment data...</div>
          </div>
        ) : (
          <SentimentContent activeTab={activeTab} />
        )}
      </div>
    </div>
  )
}
