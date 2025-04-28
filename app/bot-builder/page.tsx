"use client"

import { useState } from "react"
import Sidebar from "@/components/sidebar"
import BotBuilderInterface from "@/components/bot-builder-interface"

export default function BotBuilderPage() {
  const [currentView, setCurrentView] = useState<
    | "chat"
    | "predictions"
    | "analyze"
    | "short-strategy"
    | "option-strategy"
    | "critical-news"
    | "web-scraper"
    | "bot-builder"
  >("bot-builder")

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Include the sidebar with the same structure as other pages */}
      <div className="w-64 flex-shrink-0">
        <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      </div>

      {/* Main content area */}
      <div className="flex-1 overflow-hidden bot-management-page">
        <BotBuilderInterface />
      </div>
    </div>
  )
}
