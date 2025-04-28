"use client"

import { useState } from "react"
import { Search, Globe, BarChart2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

type AnalyzeMode = "web-scrap" | "analyze"

export default function AnalyzeContent() {
  const [activeMode, setActiveMode] = useState<AnalyzeMode>("web-scrap")
  const [searchQuery, setSearchQuery] = useState("")
  const [advancedQuery, setAdvancedQuery] = useState("")
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "bot"; content: string }[]>([
    { role: "bot", content: "Hello! I'm Analyze Bot. How can I help you analyze data today?" },
  ])
  const [userInput, setUserInput] = useState("")

  // Common scraping subjects
  const commonSubjects = [
    "Market Trends Analysis",
    "Competitor Intelligence",
    "Consumer Sentiment",
    "Industry News Roundup",
    "Regulatory Changes",
    "Product Reviews Aggregation",
  ]

  const handleSearch = () => {
    if (!searchQuery.trim()) return

    // Add user query to chat
    const newMessage = { role: "user" as const, content: searchQuery }
    setChatMessages([...chatMessages, newMessage])

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        role: "bot" as const,
        content: `I've analyzed your query: "${searchQuery}". Here are the key insights from web scraping multiple sources...`,
      }
      setChatMessages((prev) => [...prev, botResponse])
    }, 1000)

    // Clear search query
    setSearchQuery("")
  }

  const handleAdvancedSearch = () => {
    if (!advancedQuery.trim()) return

    // Add user query to chat
    const newMessage = { role: "user" as const, content: advancedQuery }
    setChatMessages([...chatMessages, newMessage])

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        role: "bot" as const,
        content: `I've performed a deep analysis on your detailed query. Here's what I found from multiple sources...`,
      }
      setChatMessages((prev) => [...prev, botResponse])
    }, 1500)

    // Clear advanced query
    setAdvancedQuery("")
  }

  const handleSubjectClick = (subject: string) => {
    // Add subject to chat
    const newMessage = { role: "user" as const, content: `I want to analyze: ${subject}` }
    setChatMessages([...chatMessages, newMessage])

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        role: "bot" as const,
        content: `I've gathered information about "${subject}" from multiple sources. Here are the key insights...`,
      }
      setChatMessages((prev) => [...prev, botResponse])
    }, 1000)
  }

  const handleSendMessage = () => {
    if (!userInput.trim()) return

    // Add user message to chat
    const newMessage = { role: "user" as const, content: userInput }
    setChatMessages([...chatMessages, newMessage])

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        role: "bot" as const,
        content: `I've processed your message: "${userInput}". Here's my analysis...`,
      }
      setChatMessages((prev) => [...prev, botResponse])
    }, 1000)

    // Clear user input
    setUserInput("")
  }

  return (
    <div className="flex flex-col h-full chat-area p-4 overflow-y-auto">
      <div className="hexagon-grid"></div>
      <div className="hexagon-overlay"></div>
      <div className="hexagon-glow"></div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Web Scrap Card */}
        <Card
          className={`flex-1 cursor-pointer transition-all duration-300 ${
            activeMode === "web-scrap"
              ? "bg-[#00ff4c15] border-[#00ff4c] shadow-[0_0_15px_rgba(0,255,76,0.3)]"
              : "bg-black/50 border-[#00ff4c33]"
          }`}
          onClick={() => setActiveMode("web-scrap")}
        >
          <CardContent className="flex items-center justify-center p-6">
            <div className="flex flex-col items-center">
              <Globe size={36} className={`mb-2 ${activeMode === "web-scrap" ? "text-[#00ff4c]" : "text-white"}`} />
              <h3 className={`text-xl font-bold ${activeMode === "web-scrap" ? "text-[#00ff4c]" : "text-white"}`}>
                Web Scrap
              </h3>
            </div>
          </CardContent>
        </Card>

        {/* Analyze Card */}
        <Card
          className={`flex-1 cursor-pointer transition-all duration-300 ${
            activeMode === "analyze"
              ? "bg-[#00ff4c15] border-[#00ff4c] shadow-[0_0_15px_rgba(0,255,76,0.3)]"
              : "bg-black/50 border-[#00ff4c33]"
          }`}
          onClick={() => setActiveMode("analyze")}
        >
          <CardContent className="flex items-center justify-center p-6">
            <div className="flex flex-col items-center">
              <BarChart2 size={36} className={`mb-2 ${activeMode === "analyze" ? "text-[#00ff4c]" : "text-white"}`} />
              <h3 className={`text-xl font-bold ${activeMode === "analyze" ? "text-[#00ff4c]" : "text-white"}`}>
                Analyze
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#00ff4c]" size={18} />
            <Input
              placeholder="Enter your search query..."
              className="pl-10 pr-4 py-5 sm:py-6 bg-black/50 border-[#00ff4c33] focus:border-[#00ff4c] text-white text-base sm:text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <Button
            onClick={handleSearch}
            className="ml-0 sm:ml-2 neon-button flex items-center justify-center gap-2 min-w-[120px] py-2 sm:py-0"
          >
            Search <ArrowRight size={16} />
          </Button>
        </div>
      </div>

      {/* Common Subjects */}
      <div className="mb-6">
        <h2 className="text-[#00ff4c] font-medium mb-3">Common Subjects</h2>
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-2">
          {commonSubjects.map((subject, index) => (
            <Button
              key={index}
              variant="outline"
              className="bg-black/50 border-[#00ff4c33] hover:border-[#00ff4c] text-white hover:bg-[#00ff4c15] text-sm justify-start h-auto py-2.5"
              onClick={() => handleSubjectClick(subject)}
            >
              {subject}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* What is Web Scraping Section */}
          <Card className="bg-black/50 border-[#00ff4c33] backdrop-blur-sm">
            <CardContent className="p-6">
              <h2 className="text-[#00ff4c] text-xl font-bold mb-4">What is Web Scraping?</h2>
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
            </CardContent>
          </Card>

          {/* Advanced Search Area */}
          <Card className="bg-black/50 border-[#00ff4c33] backdrop-blur-sm">
            <CardContent className="p-6">
              <h2 className="text-[#00ff4c] text-xl font-bold mb-4">Advanced Search</h2>
              <p className="text-white mb-4">
                Enter multiple paragraphs or detailed instructions for more complex analysis:
              </p>
              <Textarea
                placeholder="Enter detailed search parameters, multiple keywords, or specific instructions for the analysis..."
                className="min-h-[150px] bg-black/50 border-[#00ff4c33] focus:border-[#00ff4c] text-white mb-4"
                value={advancedQuery}
                onChange={(e) => setAdvancedQuery(e.target.value)}
              />
              <Button onClick={handleAdvancedSearch} className="neon-button w-full">
                Analyze Deeply
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Chat Area */}
        <Card className="bg-black/50 border-[#00ff4c33] backdrop-blur-sm h-[600px] flex flex-col">
          <CardContent className="p-4 flex flex-col h-full">
            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
              {chatMessages.map((message, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    message.role === "bot" ? "bg-[#00ff4c0a] border border-[#00ff4c33]" : ""
                  }`}
                >
                  <div className="font-semibold mb-1 text-white">{message.role === "bot" ? "Analyze Bot" : "You"}</div>
                  <div className="text-white">{message.content}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Ask a question..."
                className="bg-black/50 border-[#00ff4c33] focus:border-[#00ff4c] text-white"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <Button onClick={handleSendMessage} className="neon-button">
                Send
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
