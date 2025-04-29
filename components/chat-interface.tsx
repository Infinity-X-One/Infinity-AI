"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/sidebar"
import ChatArea from "@/components/chat-area"
import Header from "@/components/header"
import PWAInstallPrompt from "@/components/pwa-install-prompt"
import PredictionsView from "@/components/predictions-view"
import AnalyzeView from "@/components/analyze-view"
import ShortStrategyView from "@/components/short-strategy-view"
import OptionStrategyView from "@/components/option-strategy-view"
import CriticalNewsView from "@/components/critical-news-view"
import WebScraperView from "@/components/web-scraper-view"
import SidebarToggleTab from "@/components/sidebar-toggle-tab"
import { useMobile } from "@/hooks/use-mobile"
import LoadingScreen from "./loading-screen"

export default function ChatInterface() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [selectedBot, setSelectedBot] = useState("Jarvis") // Keep this for compatibility
  const [selectedModel, setSelectedModel] = useState("OpenAI")
  const [currentView, setCurrentView] = useState<
    "chat" | "predictions" | "analyze" | "short-strategy" | "option-strategy" | "critical-news" | "web-scraper"
  >("chat")
  const [isViewLoading, setIsViewLoading] = useState(false)
  const isMobile = useMobile()
  const router = useRouter()
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  // Close sidebar on mobile by default
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false)
    } else {
      setIsSidebarOpen(true)
    }
  }, [isMobile])

  // Handle back button on mobile to close sidebar if open
  useEffect(() => {
    const handleBackButton = (e: PopStateEvent) => {
      if (isMobile && isSidebarOpen) {
        e.preventDefault()
        setIsSidebarOpen(false)
        window.history.pushState(null, "", window.location.pathname)
      }
    }

    window.addEventListener("popstate", handleBackButton)
    return () => window.removeEventListener("popstate", handleBackButton)
  }, [isMobile, isSidebarOpen])

  // Push state when sidebar opens on mobile
  useEffect(() => {
    if (isMobile && isSidebarOpen) {
      window.history.pushState(null, "", window.location.pathname)
    }
  }, [isMobile, isSidebarOpen])

  // Listen for closeSidebar event
  useEffect(() => {
    const handleCloseSidebar = () => {
      setIsSidebarOpen(false)
    }

    window.addEventListener("closeSidebar", handleCloseSidebar)
    return () => window.removeEventListener("closeSidebar", handleCloseSidebar)
  }, [])

  // Listen for startLoading event
  useEffect(() => {
    const handleStartLoading = () => {
      setIsViewLoading(true)
    }

    window.addEventListener("startLoading", handleStartLoading)
    return () => window.removeEventListener("startLoading", handleStartLoading)
  }, [])

  // Handle view changes with loading state
  const handleViewChange = useCallback(
    (view: typeof currentView) => {
      if (view !== currentView) {
        // Always show loading screen for all view changes
        setIsViewLoading(true)

        // Force a black background immediately
        document.documentElement.style.backgroundColor = "#000000"
        document.body.style.backgroundColor = "#000000"

        // Change the view after a consistent delay for all views
        // This ensures the loading screen is always visible for a minimum time
        setTimeout(() => {
          setCurrentView(view)

          // Add a small additional delay before hiding the loading screen
          // This ensures the new view is ready before we hide the loading screen
          setTimeout(() => {
            setIsViewLoading(false)
          }, 500)
        }, 800)
      }
    },
    [currentView],
  )

  return (
    <>
      {/* New sidebar toggle tab */}
      <SidebarToggleTab isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Mobile sidebar overlay with improved animation */}
      <div
        className={`mobile-sidebar ${
          isSidebarOpen && isMobile ? "open" : ""
        } md:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-all duration-300`}
        onClick={() => isMobile && setIsSidebarOpen(false)}
        style={{ visibility: isSidebarOpen && isMobile ? "visible" : "hidden" }}
      >
        <div
          className="w-[85%] max-w-[300px] h-full bg-black transform transition-transform duration-300 ease-out border-r border-[#00ff4c33]"
          style={{
            transform: isSidebarOpen ? "translateX(0)" : "translateX(-100%)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <Sidebar setCurrentView={handleViewChange} currentView={currentView} />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div
        className={`${
          isSidebarOpen ? "md:w-60" : "md:w-0"
        } hidden md:block transition-all duration-300 ease-in-out overflow-hidden z-20`}
      >
        <Sidebar setCurrentView={handleViewChange} currentView={currentView} />
      </div>

      <div className="flex flex-col flex-1 w-full h-full overflow-hidden">
        <Header
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          selectedBot={selectedBot}
          setSelectedBot={setSelectedBot}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
        />

        <div className="flex-1 overflow-hidden pt-[53px] bg-black w-full">
          {isViewLoading ? (
            <LoadingScreen />
          ) : (
            <>
              {currentView === "chat" && <ChatArea selectedModel={selectedModel} />}
              {currentView === "predictions" && <PredictionsView />}
              {currentView === "analyze" && <AnalyzeView />}
              {currentView === "short-strategy" && <ShortStrategyView />}
              {currentView === "option-strategy" && <OptionStrategyView />}
              {currentView === "critical-news" && <CriticalNewsView />}
              {currentView === "web-scraper" && <WebScraperView />}
            </>
          )}
        </div>
      </div>

      <PWAInstallPrompt />
    </>
  )
}
