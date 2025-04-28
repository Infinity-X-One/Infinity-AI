"use client"

import { useState, useEffect } from "react"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import AnalyzeContent from "@/components/analyze-content"
import SidebarToggleTab from "@/components/sidebar-toggle-tab"
import { useMobile } from "@/hooks/use-mobile"

export default function AnalyzeInterface() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [selectedBot, setSelectedBot] = useState("Analyze Bot")
  const [selectedModel, setSelectedModel] = useState("OpenAI")
  const isMobile = useMobile()

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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <>
      {/* Sidebar toggle tab */}
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
          <Sidebar setCurrentView={() => {}} currentView="analyze" />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div
        className={`${
          isSidebarOpen ? "md:w-60" : "md:w-0"
        } hidden md:block transition-all duration-300 ease-in-out overflow-hidden z-20`}
      >
        <Sidebar setCurrentView={() => {}} currentView="analyze" />
      </div>

      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <Header
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          selectedBot={selectedBot}
          setSelectedBot={setSelectedBot}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
        />

        <div className="flex-1 overflow-hidden pt-[53px]">
          <AnalyzeContent />
        </div>
      </div>
    </>
  )
}
