"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import BotMetricsDashboard from "@/components/bot-metrics-dashboard"
import { generateAllBotMetrics } from "@/data/bot-metrics"
import { INFINITY_BOTS } from "@/data/infinity-bots"
import type { BotMetrics } from "@/types/bot-metrics"
import { ChevronDown, ChevronUp, BotIcon } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

export default function BotAnalyticsPage() {
  const [currentView, setCurrentView] = useState<
    "chat" | "predictions" | "analyze" | "short-strategy" | "option-strategy" | "critical-news" | "web-scraper"
  >("chat")

  const router = useRouter()
  const searchParams = useSearchParams()
  const botId = searchParams.get("botId")

  const [allBotMetrics, setAllBotMetrics] = useState<Record<string, BotMetrics>>({})
  const [selectedBotId, setSelectedBotId] = useState<string | null>(botId)
  const [expandedSections, setExpandedSections] = useState({
    botSelector: true,
  })

  // Generate metrics data on component mount
  useEffect(() => {
    const botIds = INFINITY_BOTS.map((bot) => bot.id)
    const metrics = generateAllBotMetrics(botIds)
    setAllBotMetrics(metrics)

    if (botId && !selectedBotId) {
      setSelectedBotId(botId)
    } else if (!botId && !selectedBotId && INFINITY_BOTS.length > 0) {
      // Select first bot by default if none specified
      setSelectedBotId(INFINITY_BOTS[0].id)
    }
  }, [botId, selectedBotId])

  const toggleSection = (section: "botSelector") => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const handleSelectBot = (id: string) => {
    setSelectedBotId(id)
    router.push(`/bot-analytics?botId=${id}`)
  }

  const selectedBot = INFINITY_BOTS.find((bot) => bot.id === selectedBotId)
  const selectedBotMetrics = selectedBotId ? allBotMetrics[selectedBotId] : null

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Include the sidebar with the same structure as other pages */}
      <div className="w-64 flex-shrink-0">
        <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      </div>

      {/* Main content area */}
      <div className="flex-1 overflow-hidden">
        <div className="flex flex-col h-full min-h-screen bg-black text-white relative">
          {/* Include the header */}
          <Header />

          <div className="flex flex-col flex-1 overflow-y-auto pt-[53px] relative">
            {/* Hexagon background effects - matching the rest of the site */}
            <div className="fixed inset-0 z-0 h-full">
              <div className="hexagon-grid"></div>
              <div className="hexagon-overlay"></div>
              <div className="hexagon-glow"></div>
            </div>

            <div className="relative z-1 p-6 pb-24 flex-1">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-[#00ff4c] drop-shadow-[0_0_8px_rgba(0,255,76,0.6)]">
                  Bot Analytics Dashboard
                </h1>
              </div>

              {/* Bot Selector */}
              <Collapsible
                open={expandedSections.botSelector}
                onOpenChange={() => toggleSection("botSelector")}
                className="mb-8 border border-[#00ff4c33] rounded-lg overflow-hidden"
              >
                <CollapsibleTrigger className="w-full flex items-center justify-between p-4 bg-[#00ff4c10] hover:bg-[#00ff4c15] text-[#00ff4c] font-medium">
                  <div className="flex items-center">
                    <BotIcon className="mr-2" size={20} />
                    <span>Select Bot</span>
                  </div>
                  {expandedSections.botSelector ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </CollapsibleTrigger>
                <CollapsibleContent className="p-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {INFINITY_BOTS.map((bot) => (
                      <button
                        key={bot.id}
                        onClick={() => handleSelectBot(bot.id)}
                        className={`p-3 rounded-md border text-left ${
                          selectedBotId === bot.id
                            ? "border-[#00ff4c] bg-[#00ff4c15] text-[#00ff4c]"
                            : "border-gray-700 hover:border-[#00ff4c50] hover:bg-[#00ff4c10] text-white"
                        }`}
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 flex items-center justify-center bg-[#00ff4c15] rounded-full mr-2 text-lg">
                            <span className="text-[#00ff4c]">🤖</span>
                          </div>
                          <div className="truncate">{bot.name}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Bot Metrics Dashboard */}
              {selectedBot && selectedBotMetrics ? (
                <BotMetricsDashboard metrics={selectedBotMetrics} botName={selectedBot.name} />
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <BotIcon size={48} className="text-gray-500 mb-4" />
                  <h3 className="text-xl font-medium text-white mb-2">No Bot Selected</h3>
                  <p className="text-gray-400 mb-6 max-w-md">
                    Please select a bot from the list above to view its analytics.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
