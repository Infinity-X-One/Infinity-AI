"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ArrowLeft, Send, BarChart3, LineChart, PieChart, TrendingUp, TrendingDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { sectors } from "@/data/sectors"
import { useMobile } from "@/hooks/use-mobile"

interface SectorChatAreaProps {
  sectorId: string
  onBack: () => void
}

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

export default function SectorChatArea({ sectorId, onBack }: SectorChatAreaProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const isMobile = useMobile()

  const sector = sectors.find((s) => s.id === sectorId)

  // Initial bot message
  useEffect(() => {
    if (sector) {
      const initialMessage = {
        id: "welcome",
        content: `Welcome to the ${sector.name} sector analysis. How can I help you analyze this sector today?`,
        sender: "bot" as const,
        timestamp: new Date(),
      }
      setMessages([initialMessage])
    }
  }, [sectorId, sector])

  // Auto scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus input on load
  useEffect(() => {
    if (!isMobile) {
      inputRef.current?.focus()
    }
  }, [isMobile])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate bot response after delay
    setTimeout(() => {
      const botResponses = [
        `Based on recent data, the ${sector?.name} sector has shown ${Math.random() > 0.5 ? "positive" : "negative"} momentum.`,
        `Key stocks in the ${sector?.name} sector include ${sector?.topStocks.join(", ")}.`,
        `The confidence score for ${sector?.name} is currently ${sector?.confidenceScore}/10.`,
        `Analysts are generally ${sector?.confidenceScore > 5 ? "bullish" : "bearish"} on the ${sector?.name} sector for the next quarter.`,
        `Recent trends show ${Math.random() > 0.5 ? "increasing" : "decreasing"} volatility in the ${sector?.name} sector.`,
      ]

      const botMessage: Message = {
        id: Date.now().toString(),
        content: botResponses[Math.floor(Math.random() * botResponses.length)],
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const promptButtons = [
    { icon: <BarChart3 size={14} />, text: "Performance Analysis" },
    { icon: <LineChart size={14} />, text: "Trend Forecast" },
    { icon: <PieChart size={14} />, text: "Sector Composition" },
    { icon: <TrendingUp size={14} />, text: "Growth Opportunities" },
    { icon: <TrendingDown size={14} />, text: "Risk Assessment" },
  ]

  return (
    <div className="flex flex-col h-full bg-black">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-[#00ff4c33]">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="mr-2 text-white hover:text-[#00ff4c] hover:bg-[#00ff4c15]"
        >
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h2 className="text-lg font-medium text-white">{sector?.name}</h2>
          <p className="text-sm text-gray-400">Confidence Score: {sector?.confidenceScore}/10</p>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.sender === "user" ? "bg-[#00ff4c33] text-white" : "bg-gray-800 text-white"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-800 text-white p-3 rounded-lg">
              <div className="flex space-x-1">
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick prompt buttons */}
      <div className="px-4 py-2 overflow-x-auto hide-scrollbar">
        <div className="flex space-x-2">
          {promptButtons.map((button, index) => (
            <Button
              key={index}
              variant="outline"
              className="flex items-center space-x-1 whitespace-nowrap text-xs border-[#00ff4c33] text-white hover:bg-[#00ff4c15] hover:text-[#00ff4c]"
              onClick={() => {
                setInputValue(button.text)
                inputRef.current?.focus()
              }}
            >
              {button.icon}
              <span>{button.text}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Input area */}
      <div className="border-t border-[#00ff4c33] p-4">
        <div className="flex items-end space-x-2">
          <div className="flex-1 bg-gray-800 rounded-lg overflow-hidden">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Ask about the ${sector?.name} sector...`}
              className="w-full bg-transparent border-none resize-none p-3 text-white focus:outline-none"
              rows={1}
              style={{ minHeight: "44px", maxHeight: "120px" }}
            />
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="bg-[#00ff4c] hover:bg-[#00ff4c99] text-black h-10 w-10 rounded-full flex items-center justify-center"
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  )
}
