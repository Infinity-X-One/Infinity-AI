"use client"

import { useState, useEffect, useRef } from "react"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import SafeBetsContent from "@/components/safebets-content"
import SidebarToggleTab from "@/components/sidebar-toggle-tab"
import { useMobile } from "@/hooks/use-mobile"
import LoadingScreen from "./loading-screen"

export default function SafeBetsInterface() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [selectedBot, setSelectedBot] = useState("Safe Bets Bot")
  const [selectedModel, setSelectedModel] = useState("OpenAI")
  const [isLoading, setIsLoading] = useState(true)
  const isMobile = useMobile()

  const safeBetsContentRef = useRef<{ refreshData: () => void } | null>(null)

  // Close sidebar on mobile by default
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false)
    } else {
      setIsSidebarOpen(true)
    }
  }, [isMobile])

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

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
    return () => window.removeEventListener("popstate", handleCloseSidebar)
  }, [])

  // Function to handle refresh requests
  const handleRefresh = () => {
    if (safeBetsContentRef.current) {
      safeBetsContentRef.current.refreshData()
    }
  }

  // Expose the refresh function to the window object
  useEffect(() => {
    // @ts-ignore
    window.refreshSafeBetsData = handleRefresh

    return () => {
      // @ts-ignore
      delete window.refreshSafeBetsData
    }
  }, [])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  if (isLoading) {
    return <LoadingScreen />
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
          <Sidebar setCurrentView={() => {}} currentView="chat" />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div
        className={`${
          isSidebarOpen ? "md:w-60" : "md:w-0"
        } hidden md:block transition-all duration-300 ease-in-out overflow-hidden z-20`}
      >
        <Sidebar setCurrentView={() => {}} currentView="chat" />
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

        <div className="flex-1 overflow-hidden pt-[53px] pb-[60px]">
          <SafeBetsContent ref={safeBetsContentRef} />
        </div>
      </div>
    </>
  )
}
