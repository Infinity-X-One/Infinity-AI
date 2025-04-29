"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import GlobalHeader from "@/components/global-header"
import SidebarWrapper from "@/components/sidebar-wrapper"
import PredictionsContent from "@/components/predictions-content"
import PageWrapper from "@/components/page-wrapper"

export default function PredictionsInterface() {
  const [selectedBot, setSelectedBot] = useState("Jarvis")
  const [selectedModel, setSelectedModel] = useState("OpenAI")
  const [currentView, setCurrentView] = useState<
    "chat" | "predictions" | "analyze" | "short-strategy" | "option-strategy" | "critical-news" | "web-scraper"
  >("predictions")
  const router = useRouter()

  // Handle view changes that require navigation
  useEffect(() => {
    if (currentView === "chat") {
      window.dispatchEvent(new CustomEvent("startLoading"))
      setTimeout(() => {
        router.push("/")
      }, 50)
    } else if (currentView === "analyze") {
      window.dispatchEvent(new CustomEvent("startLoading"))
      setTimeout(() => {
        router.push("/analyze")
      }, 50)
    }
  }, [currentView, router])

  return (
    <PageWrapper>
      <div className="flex h-screen bg-black">
        {/* Sidebar */}
        <SidebarWrapper currentView={currentView} setCurrentView={setCurrentView} />

        {/* Main Content Area */}
        <div className="flex flex-col w-full">
          <GlobalHeader
            toggleSidebar={() => window.dispatchEvent(new CustomEvent("toggleSidebar"))}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
          />

          <div className="flex-1 pt-[53px] h-[calc(100vh-53px)] overflow-hidden relative">
            {/* Hexagon Grid and Overlay - Using the site's consistent styling */}
            <div className="hexagon-grid"></div>
            <div className="hexagon-overlay"></div>
            <div className="hexagon-glow"></div>

            <PredictionsContent />
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
