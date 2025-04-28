"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, TrendingUp, BarChart2, Shield, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import LoadingScreen from "./loading-screen"

interface ScraperResult {
  title: string
  content: string
  source: string
  timestamp: string
  relevance: number
}

export default function WebScraperView() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [results, setResults] = useState<ScraperResult[]>([])
  const [activePrompt, setActivePrompt] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // Sample prompts for financial analysis
  const suggestedPrompts = [
    "Which tech stocks have the highest AI potential?",
    "What are the most undervalued dividend stocks?",
    "Which cryptocurrencies have unusual volume today?",
    "What are analysts saying about upcoming Fed decisions?",
    "Which sectors are outperforming the market this week?",
    "What are the top short squeeze candidates?",
  ]

  // Simulate initial loading
  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const handleSearch = () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)

    // Simulate search delay
    setTimeout(() => {
      // Mock results - in a real app, this would come from an API
      const mockResults: ScraperResult[] = [
        {
          title: "Market Analysis: " + searchQuery,
          content:
            "Our AI has analyzed multiple sources and found that this query relates to significant market movements in the technology and financial sectors. Recent data suggests a correlation between these trends and macroeconomic factors.",
          source: "InfinityAI Analysis",
          timestamp: "Just now",
          relevance: 98,
        },
        {
          title: "Expert Opinions on " + searchQuery,
          content:
            "Financial experts have recently discussed this topic across multiple platforms. The consensus indicates potential opportunities in emerging markets with particular attention to sustainable growth sectors.",
          source: "Financial Times, Bloomberg, WSJ",
          timestamp: "Aggregated from last 24 hours",
          relevance: 92,
        },
        {
          title: "Historical Data Patterns",
          content:
            "Looking at 5-year historical data, our algorithms have identified recurring patterns that may provide insight into future movements related to your query. Technical indicators suggest watching key support and resistance levels.",
          source: "InfinityAI Historical Analysis",
          timestamp: "Based on data through today",
          relevance: 87,
        },
      ]

      setResults(mockResults)
      setIsSearching(false)
    }, 2000)
  }

  const handlePromptClick = (prompt: string) => {
    setSearchQuery(prompt)
    setActivePrompt(prompt)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className="flex flex-col h-full chat-area p-4 overflow-y-auto">
      <div className="hexagon-grid"></div>
      <div className="hexagon-overlay"></div>
      <div className="hexagon-glow"></div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#00ff4c] drop-shadow-[0_0_8px_rgba(0,255,76,0.7)] mb-2">
          Advanced Web Scraper
        </h1>
        <p className="text-white text-opacity-80">Extract real-time financial intelligence from across the web</p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="flex">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#00ff4c]" size={18} />
            <Input
              placeholder="Enter your financial intelligence query..."
              className="pl-10 pr-24 py-6 bg-black/50 border-[#00ff4c33] focus:border-[#00ff4c] text-white text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <Button
            onClick={handleSearch}
            disabled={isSearching || !searchQuery.trim()}
            className="ml-2 neon-button flex items-center gap-2 min-w-[120px]"
          >
            {isSearching ? (
              "Searching..."
            ) : (
              <>
                Search <ArrowRight size={16} />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Suggested Prompts */}
      <div className="mb-8">
        <h2 className="text-[#00ff4c] font-medium mb-3">Suggested Queries</h2>
        <div className="flex flex-wrap gap-2">
          {suggestedPrompts.map((prompt, index) => (
            <Button
              key={index}
              variant="outline"
              className={`bg-black/50 border-[#00ff4c33] hover:border-[#00ff4c] text-white hover:bg-[#00ff4c15] text-sm ${
                activePrompt === prompt ? "border-[#00ff4c] bg-[#00ff4c15]" : ""
              }`}
              onClick={() => handlePromptClick(prompt)}
            >
              {prompt}
            </Button>
          ))}
        </div>
      </div>

      {/* What is Web Scraping Section */}
      <Card className="bg-black/50 border-[#00ff4c33] backdrop-blur-sm mb-8">
        <CardHeader className="pb-2">
          <CardTitle className="text-[#00ff4c] text-xl">What is Web Scraping?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-white mb-4">
                Web scraping is the process of extracting data from websites automatically. Our advanced AI-powered
                scraper:
              </p>
              <ul className="space-y-2 text-white">
                <li className="flex items-start">
                  <div className="text-[#00ff4c] mr-2">•</div>
                  <span>Analyzes thousands of financial sources in real-time</span>
                </li>
                <li className="flex items-start">
                  <div className="text-[#00ff4c] mr-2">•</div>
                  <span>Identifies patterns and correlations human analysts might miss</span>
                </li>
                <li className="flex items-start">
                  <div className="text-[#00ff4c] mr-2">•</div>
                  <span>Extracts sentiment from news, social media, and analyst reports</span>
                </li>
                <li className="flex items-start">
                  <div className="text-[#00ff4c] mr-2">•</div>
                  <span>Provides actionable intelligence before it becomes common knowledge</span>
                </li>
              </ul>
            </div>
            <div className="flex flex-col space-y-3">
              <div className="bg-black/70 border border-[#00ff4c33] rounded-md p-3">
                <div className="flex items-center mb-2">
                  <TrendingUp size={18} className="text-[#00ff4c] mr-2" />
                  <h3 className="text-white font-medium">Speed Advantage</h3>
                </div>
                <p className="text-white text-sm opacity-80">
                  Get market-moving information 15-45 minutes before it appears in mainstream financial media
                </p>
              </div>
              <div className="bg-black/70 border border-[#00ff4c33] rounded-md p-3">
                <div className="flex items-center mb-2">
                  <Shield size={18} className="text-[#00ff4c] mr-2" />
                  <h3 className="text-white font-medium">Information Edge</h3>
                </div>
                <p className="text-white text-sm opacity-80">
                  Access data from premium sources, SEC filings, earnings calls, and institutional research
                </p>
              </div>
              <div className="bg-black/70 border border-[#00ff4c33] rounded-md p-3">
                <div className="flex items-center mb-2">
                  <BarChart2 size={18} className="text-[#00ff4c] mr-2" />
                  <h3 className="text-white font-medium">Pattern Recognition</h3>
                </div>
                <p className="text-white text-sm opacity-80">
                  Our AI identifies correlations across disparate data sources that human analysts often miss
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {results.length > 0 ? (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#00ff4c]">Search Results</h2>
            <Badge className="bg-[#00ff4c] text-black">{results.length} sources analyzed</Badge>
          </div>

          {/* Summary Card */}
          <Card className="bg-black/70 border-[#00ff4c33] backdrop-blur-sm mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-lg">Summary Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white">
                Based on your query <span className="text-[#00ff4c] font-medium">"{searchQuery}"</span>, our AI has
                analyzed multiple sources and extracted the following insights:
              </p>
              <div className="mt-4 p-3 bg-[#00ff4c10] border border-[#00ff4c33] rounded-md">
                <p className="text-white">
                  The data suggests significant activity in this area with multiple corroborating sources. Key findings
                  indicate potential opportunities with moderate risk factors. Sentiment analysis shows a generally
                  positive outlook from institutional investors.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Results */}
          <div className="space-y-4">
            {results.map((result, index) => (
              <Card key={index} className="bg-black/50 border-[#00ff4c33] backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-white text-lg">{result.title}</CardTitle>
                    <Badge className={`${result.relevance > 90 ? "bg-green-600" : "bg-yellow-600"}`}>
                      {result.relevance}% Relevance
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-white mb-4">{result.content}</p>
                  <div className="flex justify-between items-center text-sm text-gray-400">
                    <span>Source: {result.source}</span>
                    <span>{result.timestamp}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-black/30 border border-[#00ff4c33] rounded-lg">
          <div className="text-[#00ff4c] mb-4">
            <Search size={48} className="mx-auto opacity-50" />
          </div>
          <h3 className="text-xl font-medium text-white mb-2">No Results Yet</h3>
          <p className="text-white text-opacity-70 max-w-md">
            Enter a query above and click Search to analyze financial data from across the web. Try one of our suggested
            prompts to get started.
          </p>
        </div>
      )}
    </div>
  )
}
