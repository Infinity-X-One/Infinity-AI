"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Infinity, ChevronUp, ChevronDown, Send } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

interface Message {
  id: number
  role: "user" | "assistant"
  content: string
}

export default function SafeBetsChat() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content: "Hello! I'm your Safe Bets guide. Ask me anything about the assets shown or how to interpret the data.",
    },
  ])
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const isMobile = useMobile()

  useEffect(() => {
    scrollToBottom()
  }, [messages, isExpanded])

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  const handleSendMessage = () => {
    if (input.trim() === "") return

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      role: "user",
      content: input,
    }
    setMessages([...messages, userMessage])
    setInput("")

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "40px"
    }

    // Simulate bot response based on safe bets context
    setTimeout(() => {
      let responseContent = ""

      // Simple keyword matching for context-aware responses
      const lowercaseInput = input.toLowerCase()

      if (lowercaseInput.includes("risk")) {
        responseContent =
          "Risk levels are calculated based on historical volatility, market conditions, and our proprietary algorithms. Lower risk assets have more stable price movements and higher predictability."
      } else if (lowercaseInput.includes("confidence") || lowercaseInput.includes("score")) {
        responseContent =
          "Confidence scores represent our AI model's certainty in the prediction. Scores above 85% indicate high confidence based on multiple confirming indicators and historical patterns."
      } else if (lowercaseInput.includes("return") || lowercaseInput.includes("profit")) {
        responseContent =
          "Expected returns are calculated based on historical performance, current market conditions, and technical indicators. These are projections and not guaranteed."
      } else if (lowercaseInput.includes("filter") || lowercaseInput.includes("sort")) {
        responseContent =
          "You can filter assets by clicking on the filter buttons at the top of the page. Sort by clicking on column headers in the table view."
      } else if (lowercaseInput.includes("how") && lowercaseInput.includes("work")) {
        responseContent =
          "Our Safe Bets system analyzes thousands of assets using machine learning models trained on historical data. We identify patterns that have high probability of success based on current market conditions."
      } else {
        responseContent =
          "I'm here to help you understand the Safe Bets data. You can ask about specific assets, risk levels, confidence scores, or how to use the interface."
      }

      const botMessage: Message = {
        id: messages.length + 2,
        role: "assistant",
        content: responseContent,
      }
      setMessages((prev) => [...prev, botMessage])
    }, 1000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Auto-resize textarea
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)

    if (textareaRef.current) {
      textareaRef.current.style.height = "40px"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 100)}px`
    }
  }

  return (
    <div
      className={`fixed bottom-0 right-0 sm:right-4 z-30 w-full sm:w-80 md:w-96 bg-black border border-[#00ff4c33] rounded-t-lg shadow-lg shadow-[#00ff4c22] transition-all duration-300 ease-in-out ${
        isExpanded ? "h-[400px] md:h-[500px]" : "h-12"
      }`}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between p-2 cursor-pointer border-b border-[#00ff4c33] bg-gradient-to-r from-[#00ff4c10] to-[#00ff4c20]"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <Infinity size={20} className="text-[#00ff4c]" />
          <span className="text-[#00ff4c] font-medium">Safe Bets Guide</span>
        </div>
        <div className="flex items-center gap-1">
          {isExpanded ? (
            <ChevronDown size={18} className="text-[#00ff4c]" />
          ) : (
            <ChevronUp size={18} className="text-[#00ff4c]" />
          )}
        </div>
      </div>

      {/* Chat content - only rendered when expanded */}
      {isExpanded && (
        <>
          <div className="flex-1 overflow-y-auto p-3 h-[calc(100%-96px)]">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start mb-3 ${
                  message.role === "assistant" ? "bg-[#00ff4c0a]" : ""
                } p-2 rounded-lg`}
              >
                {message.role === "assistant" && (
                  <div className="mr-2 text-[#00ff4c] drop-shadow-[0_0_8px_rgba(0,255,76,0.8)] flex-shrink-0">
                    <Infinity size={isMobile ? 16 : 18} />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold mb-1 text-white text-xs">
                    {message.role === "assistant" ? "Guide" : "You"}
                  </div>
                  <div className="text-white whitespace-pre-wrap text-sm break-words">{message.content}</div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="border-t border-[#00ff4c33] p-2 mt-auto">
            <div className="flex items-end gap-2">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                placeholder="Ask about Safe Bets..."
                className="flex-1 bg-[#00ff4c10] text-white border border-[#00ff4c33] rounded-md p-2 outline-none focus:ring-1 focus:ring-[#00ff4c] resize-none h-10 max-h-24 text-sm"
                style={{ minHeight: "40px" }}
              />
              <button
                onClick={handleSendMessage}
                disabled={input.trim() === ""}
                className="bg-gradient-to-r from-[#00ff4c] to-[#00cc3d] hover:from-[#00ff4c] hover:to-[#00ff4c] text-black font-medium rounded-md p-2 h-10 w-10 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
