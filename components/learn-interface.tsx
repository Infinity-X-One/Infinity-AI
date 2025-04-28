"use client"

import { useState, useEffect } from "react"
import PageWrapper from "@/components/page-wrapper"
import LearnContent from "@/components/learn-content"
import Header from "@/components/header"
import Sidebar from "@/components/sidebar"
import SidebarToggleTab from "@/components/sidebar-toggle-tab"
import { useMobile } from "@/hooks/use-mobile"

export default function LearnInterface() {
  const [isLoading, setIsLoading] = useState(true)
  const [currentView, setCurrentView] = useState("chat")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const isMobile = useMobile()

  useEffect(() => {
    // Sidebar event listeners
    const handleOpenSidebar = () => setSidebarOpen(true)
    const handleCloseSidebar = () => setSidebarOpen(false)

    window.addEventListener("openSidebar", handleOpenSidebar)
    window.addEventListener("closeSidebar", handleCloseSidebar)

    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false)
      // Add the loaded class to fade in the content
      document.querySelector(".page-content")?.classList.add("loaded")
    }, 500)

    return () => {
      clearTimeout(timer)
      window.removeEventListener("openSidebar", handleOpenSidebar)
      window.removeEventListener("closeSidebar", handleCloseSidebar)
    }
  }, [])

  return (
    <PageWrapper>
      <Header title="Learn" />
      <div className="flex h-full w-full pt-[53px]">
        {/* Sidebar for desktop */}
        {!isMobile && (
          <div className="w-64 h-full flex-shrink-0 bg-black border-r border-[#00ff4c33]">
            <Sidebar setCurrentView={setCurrentView} currentView={currentView} />
          </div>
        )}

        {/* Mobile sidebar */}
        {isMobile && (
          <>
            <div
              className={`mobile-sidebar ${
                sidebarOpen ? "open" : ""
              } fixed top-0 left-0 w-64 h-full z-50 bg-black border-r border-[#00ff4c33] transition-transform duration-300`}
            >
              <Sidebar setCurrentView={setCurrentView} currentView={currentView} />
            </div>
            {/* Overlay when sidebar is open */}
            {sidebarOpen && (
              <div
                className="fixed inset-0 bg-black/50 z-40"
                onClick={() => {
                  const event = new CustomEvent("closeSidebar")
                  window.dispatchEvent(event)
                }}
              />
            )}
            {/* Toggle tab for mobile */}
            <SidebarToggleTab />
          </>
        )}

        {/* Main content */}
        <div className={`page-content ${!isLoading ? "loaded" : ""} flex-1 overflow-hidden flex flex-col relative`}>
          {/* Hexagon background pattern */}
          <div className="hexagon-grid absolute inset-0 pointer-events-none"></div>
          <div className="hexagon-overlay absolute inset-0 pointer-events-none"></div>
          <div className="hexagon-glow absolute inset-0 pointer-events-none"></div>

          {/* Learn content */}
          <LearnContent />
        </div>
      </div>
    </PageWrapper>
  )
}
