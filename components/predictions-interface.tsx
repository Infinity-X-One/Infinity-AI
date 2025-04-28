"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import Sidebar from "@/components/sidebar"
import SidebarToggleTab from "@/components/sidebar-toggle-tab"
import PredictionsContent from "@/components/predictions-content"
import PageWrapper from "@/components/page-wrapper"

export default function PredictionsInterface() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [selectedBot, setSelectedBot] = useState("Jarvis")
  const [selectedModel, setSelectedModel] = useState("OpenAI")
  const [currentView, setCurrentView] = useState<
    "chat" | "predictions" | "analyze" | "short-strategy" | "option-strategy" | "critical-news" | "web-scraper"
  >("predictions")
  const router = useRouter()

  // Listen for sidebar toggle events
  useEffect(() => {
    const handleToggleSidebar = () => {
      setIsSidebarOpen((prev) => !prev)
    }

    const handleCloseSidebar = () => {
      setIsSidebarOpen(false)
    }

    window.addEventListener("toggleSidebar", handleToggleSidebar)
    window.addEventListener("closeSidebar", handleCloseSidebar)

    return () => {
      window.removeEventListener("toggleSidebar", handleToggleSidebar)
      window.removeEventListener("closeSidebar", handleCloseSidebar)
    }
  }, [])

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
      <div className="flex h-screen overflow-hidden bg-black">
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-20 w-64 transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar setCurrentView={setCurrentView} currentView={currentView} />
        </div>

        {/* Sidebar Toggle Tab */}
        <SidebarToggleTab isSidebarOpen={isSidebarOpen} />

        {/* Main Content */}
        <div
          className={`flex flex-col flex-1 w-full transition-all duration-300 ease-in-out ${
            isSidebarOpen ? "pl-64" : "pl-0"
          }`}
        >
          {/* Header */}
          <Header
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            selectedBot={selectedBot}
            setSelectedBot={setSelectedBot}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
          />

          {/* Content Area */}
          <div className="flex-1 overflow-hidden pt-[53px]">
            <PredictionsContent />
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
