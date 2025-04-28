"use client"

import { useState, useEffect, useRef } from "react"
import { Send, Bot, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Message {
  id: number
  role: "user" | "bot"
  content: string
  timestamp: Date
  processing?: boolean
}

interface AIBotInterfaceProps {
  botName: string
  botDescription: string
  initialMessage?: string
  symbols?: string[]
}

export default function AIBotInterface({
  botName,
  botDescription,
  initialMessage = "Hello! How can I assist you with financial insights today?",
  symbols = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA"],
}: AIBotInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "bot",
      content: initialMessage,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim() || isProcessing) return

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsProcessing(true)

    // Add temporary bot message
    const tempBotMessage: Message = {
      id: Date.now() + 1,
      role: "bot",
      content: "Thinking...",
      timestamp: new Date(),
      processing: true,
    }
    setMessages((prev) => [...prev, tempBotMessage])

    try {
      // Call AI API
      const response = await fetch("/api/ai/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: input,
          context: {
            symbols,
            botName,
            previousMessages: messages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response from AI")
      }

      const data = await response.json()

      // Replace temporary message with actual response
      setMessages((prev) =>
        prev.map((msg) =>
          msg.processing
            ? {
                id: msg.id,
                role: "bot",
                content: data.data,
                timestamp: new Date(),
                processing: false,
              }
            : msg,
        ),
      )
    } catch (error) {
      console.error("Error querying AI:", error)

      // Replace temporary message with error message
      setMessages((prev) =>
        prev.map((msg) =>
          msg.processing
            ? {
                id: msg.id,
                role: "bot",
                content: "Sorry, I encountered an error processing your request. Please try again.",
                timestamp: new Date(),
                processing: false,
              }
            : msg,
        ),
      )
    } finally {
      setIsProcessing(false)
    }
  }

  const refreshData = async () => {
    if (isRefreshing) return

    setIsRefreshing(true)

    try {
      // Call AI API to refresh market data
      const response = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          symbols,
          type: "market",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to refresh data")
      }

      const data = await response.json()

      // Add system message about refresh
      const refreshMessage: Message = {
        id: Date.now(),
        role: "bot",
        content: "I've refreshed my market data. My insights are now based on the latest information.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, refreshMessage])
    } catch (error) {
      console.error("Error refreshing data:", error)

      // Add error message
      const errorMessage: Message = {
        id: Date.now(),
        role: "bot",
        content: "Sorry, I couldn't refresh the market data. I'll continue using my existing information.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <Card className="flex-1 flex flex-col overflow-hidden bg-black/50 border-[#00ff4c33]">
        <CardHeader className="pb-2 border-b border-[#00ff4c33]">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Bot className="text-[#00ff4c] mr-2" size={24} />
              <CardTitle className="text-[#00ff4c]">{botName}</CardTitle>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="bg-black/50 border-[#00ff4c33] hover:bg-[#00ff4c15] text-white"
              onClick={refreshData}
              disabled={isRefreshing}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              {isRefreshing ? "Refreshing..." : "Refresh Data"}
            </Button>
          </div>
          <p className="text-gray-400 text-sm">{botDescription}</p>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === "user"
                    ? "bg-[#00ff4c15] border border-[#00ff4c33]"
                    : "bg-black/70 border border-[#00ff4c33]"
                } ${message.processing ? "opacity-70" : ""}`}
              >
                <div className="flex items-center mb-1">
                  {message.role === "bot" ? (
                    <div className="flex items-center">
                      <Bot className="text-[#00ff4c] mr-1" size={16} />
                      <span className="text-[#00ff4c] text-sm font-medium">{botName}</span>
                    </div>
                  ) : (
                    <span className="text-white text-sm font-medium">You</span>
                  )}
                  <span className="text-gray-500 text-xs ml-2">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <div className="text-white whitespace-pre-wrap">
                  {message.processing ? (
                    <div className="flex items-center">
                      <span className="mr-2">Thinking</span>
                      <div className="flex space-x-1">
                        <div
                          className="w-2 h-2 bg-[#00ff4c] rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-[#00ff4c] rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-[#00ff4c] rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        ></div>
                      </div>
                    </div>
                  ) : (
                    message.content
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </CardContent>
        <div className="p-4 border-t border-[#00ff4c33]">
          <div className="flex space-x-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me about market insights, predictions, or analysis..."
              className="min-h-[60px] bg-black/50 border-[#00ff4c33] focus:border-[#00ff4c] text-white resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
              disabled={isProcessing}
            />
            <Button
              className="bg-[#00ff4c] hover:bg-[#00dd42] text-black"
              size="icon"
              onClick={handleSendMessage}
              disabled={!input.trim() || isProcessing}
            >
              {isProcessing ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge
              className="bg-black/50 border border-[#00ff4c33] text-white hover:bg-[#00ff4c15] cursor-pointer"
              onClick={() => setInput("What's the current market sentiment?")}
            >
              Market Sentiment
            </Badge>
            <Badge
              className="bg-black/50 border border-[#00ff4c33] text-white hover:bg-[#00ff4c15] cursor-pointer"
              onClick={() => setInput("Analyze recent tech sector performance")}
            >
              Tech Sector
            </Badge>
            <Badge
              className="bg-black/50 border border-[#00ff4c33] text-white hover:bg-[#00ff4c15] cursor-pointer"
              onClick={() => setInput("What are your price predictions for AAPL?")}
            >
              AAPL Predictions
            </Badge>
            <Badge
              className="bg-black/50 border border-[#00ff4c33] text-white hover:bg-[#00ff4c15] cursor-pointer"
              onClick={() => setInput("Summarize today's key market events")}
            >
              Market Summary
            </Badge>
          </div>
        </div>
      </Card>
    </div>
  )
}
