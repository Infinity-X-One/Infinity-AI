"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Infinity, Search, Shield, RefreshCw, Heart } from "lucide-react"
import ApiSettingsDropdown from "@/components/api-settings-dropdown"
import ToolButton from "./tool-button"
import { useMobile } from "@/hooks/use-mobile"
import { useRouter } from "next/navigation"

interface Message {
  id: number
  role: "user" | "assistant"
  content: string
}

interface ChatAreaProps {
  selectedModel: string
}

export default function ChatArea({ selectedModel }: ChatAreaProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content: `Hello! I'm Jarvis, your AI assistant powered by ${selectedModel}. How can I help you today?`,
    },
  ])
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [emailDialogOpen, setEmailDialogOpen] = useState(false)
  const [email, setEmail] = useState("")
  const isMobile = useMobile()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const router = useRouter()

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Update welcome message when model changes
    const updatedMessages = [...messages]
    updatedMessages[0] = {
      id: 1,
      role: "assistant",
      content: `Hello! I'm Jarvis, your AI assistant powered by ${selectedModel}. How can I help you today?`,
    }
    setMessages(updatedMessages)
  }, [selectedModel])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
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
      textareaRef.current.style.height = "80px"
    }

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: messages.length + 2,
        role: "assistant",
        content: `This is a simulated response from Jarvis using ${selectedModel}. In a real implementation, this would connect to the AI model API.`,
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

  const handleEmailSubmit = () => {
    if (email.trim() === "") return

    // Add user message about email
    const userMessage: Message = {
      id: messages.length + 1,
      role: "user",
      content: `My email address is: ${email}`,
    }
    setMessages([...messages, userMessage])

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: messages.length + 2,
        role: "assistant",
        content: `Thank you! I've saved your email address: ${email}. How can I assist you with email-related tasks?`,
      }
      setMessages((prev) => [...prev, botMessage])
    }, 1000)

    setEmailDialogOpen(false)
  }

  const handleRefresh = () => {
    // Check if we're on the safebets page and the refresh function is available
    // @ts-ignore
    if (window.refreshSafeBetsData) {
      // @ts-ignore
      window.refreshSafeBetsData()
      return
    }

    // Otherwise, perform general refresh
    console.log("Refreshing market data and emails...")
    // In a real implementation, this would refresh market data from APIs and check for new emails
  }

  const navigateToSentiment = () => {
    // Set loading state via a custom event
    window.dispatchEvent(new CustomEvent("startLoading"))

    // Navigate after a small delay
    setTimeout(() => {
      router.push("/sentiment")
    }, 50)
  }

  const navigateToSafeBets = () => {
    // Set loading state via a custom event
    window.dispatchEvent(new CustomEvent("startLoading"))

    // Navigate after a small delay
    setTimeout(() => {
      router.push("/safebets")
    }, 50)
  }

  const navigateToLearn = () => {
    // Set loading state via a custom event
    window.dispatchEvent(new CustomEvent("startLoading"))

    // Navigate after a small delay
    setTimeout(() => {
      router.push("/learn")
    }, 50)
  }

  // Auto-resize textarea
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)

    if (textareaRef.current) {
      textareaRef.current.style.height = "80px"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
    }
  }

  return (
    <div className="flex flex-col h-full chat-area">
      <div className="hexagon-grid"></div>
      <div className="hexagon-overlay"></div>
      <div className="hexagon-glow"></div>
      <div className="p-2 flex items-center">
        <ApiSettingsDropdown />
      </div>
      {/* Empty state or welcome screen */}
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 p-4">
          <div className="text-4xl font-bold text-[#00ff4c] mb-4 drop-shadow-[0_0_10px_rgba(0,255,76,0.8)]">
            <div className="flex items-center gap-2">
              <Infinity size={36} className="text-[#00ff4c]" />
              Jarvis
            </div>
          </div>
          <div className="text-xl text-white mb-8">Your AI Assistant</div>
          <div className="flex flex-wrap justify-center gap-3 max-w-md">
            <ToolButton
              icon={<Search className="w-4 h-4 mr-2 text-[#00ff4c]" />}
              label="Web Scraper"
              onClick={() => (window.location.href = "/analyze")}
              isLoadingAction={true}
            />
            <ToolButton
              icon={<Heart className="w-4 h-4 mr-2 text-[#00ff4c]" />}
              label="Sentiment"
              onClick={navigateToSentiment}
              isLoadingAction={true}
            />
            <ToolButton
              icon={<Shield className="w-4 h-4 mr-2 text-[#00ff4c]" />}
              label="Safe Bets"
              onClick={navigateToSafeBets}
              isLoadingAction={true}
            />
            <ToolButton
              icon={<RefreshCw className="w-4 h-4 mr-2 text-[#00ff4c]" />}
              label="Refresh"
              onClick={handleRefresh}
            />
          </div>
        </div>
      ) : (
        <>
          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto p-2 sm:p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start mb-3 sm:mb-4 ${
                  message.role === "assistant" ? "bg-[#00ff4c0a]" : ""
                } p-2 sm:p-3 rounded-lg`}
              >
                {message.role === "assistant" && (
                  <div className="mr-3 sm:mr-4 text-[#00ff4c] drop-shadow-[0_0_8px_rgba(0,255,76,0.8)] flex-shrink-0">
                    <Infinity size={isMobile ? 20 : 24} />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold mb-1 text-white text-sm sm:text-base">
                    {message.role === "assistant" ? "Jarvis" : "You"}
                  </div>
                  <div className="text-white whitespace-pre-wrap text-sm sm:text-base break-words">
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick action buttons - scrollable on mobile */}
          <div className="flex justify-center gap-2 sm:gap-3 my-2 sm:my-4 px-2 overflow-x-auto pb-2 hide-scrollbar">
            <ToolButton
              icon={<Search className="w-4 h-4 mr-2 text-[#00ff4c]" />}
              label="Web Scraper"
              onClick={() => (window.location.href = "/analyze")}
              className="h-8 sm:h-9 py-1 px-2 sm:px-3 text-xs sm:text-sm flex-shrink-0"
              isLoadingAction={true}
            />
            <ToolButton
              icon={<Heart className="w-4 h-4 mr-2 text-[#00ff4c]" />}
              label="Sentiment"
              onClick={navigateToSentiment}
              className="h-8 sm:h-9 py-1 px-2 sm:px-3 text-xs sm:text-sm flex-shrink-0"
              isLoadingAction={true}
            />
            <ToolButton
              icon={<Shield className="w-4 h-4 mr-2 text-[#00ff4c]" />}
              label="Safe Bets"
              onClick={navigateToSafeBets}
              className="h-8 sm:h-9 py-1 px-2 sm:px-3 text-xs sm:text-sm flex-shrink-0"
              isLoadingAction={true}
            />
            <ToolButton
              icon={<RefreshCw className="w-4 h-4 mr-2 text-[#00ff4c]" />}
              label="Refresh"
              onClick={handleRefresh}
              className="h-8 sm:h-9 py-1 px-2 sm:px-3 text-xs sm:text-sm flex-shrink-0"
            />
          </div>
        </>
      )}

      {/* Input area */}
      <div className="border-t border-[#00ff4c33] p-2 sm:p-4 pb-20 sm:pb-4">
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder="Message Jarvis..."
            className="w-full bg-black border border-[#00ff4c33] rounded-lg p-3 pr-12 pl-10 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#00ff4c] resize-none h-[60px] max-h-[200px] text-sm sm:text-base"
          />
          {/* Paperclip icon for attachments */}
          <button
            className="absolute left-3 bottom-3 text-gray-400 hover:text-[#00ff4c] transition-colors"
            aria-label="Add attachment"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 sm:w-6 sm:h-6"
            >
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
            </svg>
          </button>
          <button
            onClick={handleSendMessage}
            disabled={input.trim() === ""}
            className="absolute right-3 bottom-3 text-[#00ff4c] hover:text-white disabled:text-gray-600 disabled:hover:text-gray-600 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 sm:w-6 sm:h-6"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
