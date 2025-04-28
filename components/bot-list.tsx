"use client"

import { useState } from "react"
import type { Bot } from "@/types/bot"
import {
  BotIcon,
  Search,
  Microscope,
  Brain,
  LineChart,
  Heart,
  Zap,
  MessageSquare,
  Shield,
  Lightbulb,
  Compass,
  Cpu,
  Send,
  BarChart2,
} from "lucide-react"
import { useRouter } from "next/navigation"

interface BotListProps {
  bots: Bot[]
  onToggleBot: (botId: string, enabled: boolean) => void
  onSelectBot: (botId: string | null) => void
  selectedBot: string | null
}

const iconComponents: Record<string, any> = {
  Bot: BotIcon,
  Search,
  Microscope,
  Brain,
  LineChart,
  Heart,
  Zap,
  MessageSquare,
  Shield,
  Lightbulb,
  Compass,
  Cpu,
}

export default function BotList({ bots, onToggleBot, onSelectBot, selectedBot }: BotListProps) {
  const [botInputs, setBotInputs] = useState<Record<string, string>>({})
  const router = useRouter()
  const [processingBots, setProcessingBots] = useState<Record<string, boolean>>({})

  const handleInputChange = (botId: string, value: string) => {
    setBotInputs((prev) => ({ ...prev, [botId]: value }))
  }

  const handleSendInstruction = (botId: string) => {
    const instruction = botInputs[botId]
    if (instruction?.trim()) {
      // Visual feedback
      const botName = bots.find((b) => b.id === botId)?.name || "Bot"
      console.log(`Sending instruction to ${botName}: ${instruction}`)

      // Mark bot as processing
      setProcessingBots((prev) => ({ ...prev, [botId]: true }))

      // Simulate processing delay
      setTimeout(() => {
        setBotInputs((prev) => ({ ...prev, [botId]: "" }))
        setProcessingBots((prev) => ({ ...prev, [botId]: false }))

        // In a real app, this is where you would display the bot's response
        console.log(`${botName} has processed your instruction.`)
      }, 1500)
    }
  }

  const navigateToBotAnalytics = (botId: string) => {
    window.dispatchEvent(new CustomEvent("startLoading"))
    setTimeout(() => {
      router.push(`/bot-analytics?botId=${botId}`)
    }, 50)
  }

  const handleToggleBot = (botId: string, enabled: boolean) => {
    onToggleBot(botId, enabled)
    // Show visual feedback when toggling
    const message = enabled
      ? `${bots.find((b) => b.id === botId)?.name} activated`
      : `${bots.find((b) => b.id === botId)?.name} deactivated`
    console.log(message)
    // In a real app, this would update the bot's status in the backend
  }

  return (
    <div className="h-full flex flex-col bg-black/80 backdrop-blur-sm">
      <div className="p-4 border-b border-[#00ff4c33]">
        <h2 className="text-lg font-semibold text-[#00ff4c] drop-shadow-[0_0_5px_rgba(0,255,76,0.5)]">
          Available Bots
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {bots.map((bot) => {
          const IconComponent = iconComponents[bot.icon] || BotIcon

          return (
            <div
              key={bot.id}
              className={`p-4 border-b border-[#00ff4c33] hover:bg-[#00ff4c08] transition-colors ${
                selectedBot === bot.id ? "bg-[#00ff4c10]" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => onSelectBot(selectedBot === bot.id ? null : bot.id)}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                      bot.enabled ? "bg-[#00ff4c20]" : "bg-gray-800"
                    }`}
                  >
                    <IconComponent size={18} className={bot.enabled ? "text-[#00ff4c]" : "text-gray-500"} />
                  </div>
                  <div>
                    <h3 className={`font-medium ${bot.enabled ? "text-white" : "text-gray-500"}`}>{bot.name}</h3>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bot.enabled}
                    onChange={(e) => handleToggleBot(bot.id, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#00ff4c40] peer-checked:after:bg-[#00ff4c]"></div>
                </label>
              </div>

              {/* Always show the input field for active bots */}
              {bot.enabled && (
                <div className="mt-2">
                  <div className="relative">
                    <input
                      type="text"
                      value={botInputs[bot.id] || ""}
                      onChange={(e) => handleInputChange(bot.id, e.target.value)}
                      placeholder={processingBots[bot.id] ? "Processing..." : `Give instructions to ${bot.name}...`}
                      disabled={processingBots[bot.id]}
                      className={`w-full pl-3 pr-10 py-2 bg-[#0a0a0a] border border-[#00ff4c33] rounded-md focus:outline-none focus:ring-1 focus:ring-[#00ff4c] focus:border-[#00ff4c] text-sm text-white ${
                        processingBots[bot.id] ? "opacity-70" : ""
                      }`}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey && !processingBots[bot.id]) {
                          e.preventDefault()
                          handleSendInstruction(bot.id)
                        }
                      }}
                    />
                    <button
                      onClick={() => handleSendInstruction(bot.id)}
                      disabled={processingBots[bot.id]}
                      className={`absolute right-2 top-1/2 -translate-y-1/2 ${
                        processingBots[bot.id] ? "text-gray-600" : "text-gray-400 hover:text-[#00ff4c]"
                      }`}
                    >
                      {processingBots[bot.id] ? (
                        <div className="h-4 w-4 border-2 border-t-[#00ff4c] border-r-[#00ff4c] border-b-[#00ff4c33] border-l-[#00ff4c33] rounded-full animate-spin"></div>
                      ) : (
                        <Send size={16} />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {selectedBot === bot.id && (
                <div className="ml-0 mt-3">
                  <p className="text-sm text-gray-400 mb-2">{bot.description}</p>

                  <div className="text-xs text-gray-500 mb-1">Skills:</div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {bot.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 text-xs bg-[#00ff4c15] text-[#00ff4c] rounded-md border border-[#00ff4c33]"
                      >
                        {skill
                          .split("-")
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(" ")}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => navigateToBotAnalytics(bot.id)}
                      className="flex items-center justify-center px-3 py-2 bg-[#00ff4c20] hover:bg-[#00ff4c30] text-[#00ff4c] rounded-md text-sm"
                    >
                      <BarChart2 size={16} className="mr-2" />
                      View Analytics
                    </button>
                    <button className="flex items-center justify-center px-3 py-2 bg-[#00ff4c20] hover:bg-[#00ff4c30] text-[#00ff4c] rounded-md text-sm">
                      <Zap size={16} className="mr-2" />
                      Run Bot
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
