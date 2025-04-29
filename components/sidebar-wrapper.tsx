"use client"

import { useState, useEffect } from "react"
import Sidebar from "@/components/sidebar"
import SidebarToggleTab from "@/components/sidebar-toggle-tab"

interface SidebarWrapperProps {
  currentView:
    | "chat"
    | "predictions"
    | "analyze"
    | "short-strategy"
    | "option-strategy"
    | "critical-news"
    | "web-scraper"
  setCurrentView: (
    view: "chat" | "predictions" | "analyze" | "short-strategy" | "option-strategy" | "critical-news" | "web-scraper",
  ) => void
}

export default function SidebarWrapper({ currentView, setCurrentView }: SidebarWrapperProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

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

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-20 w-64 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar setCurrentView={setCurrentView} currentView={currentView} />
      </div>

      {/* Sidebar Toggle Tab */}
      <SidebarToggleTab isSidebarOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
    </>
  )
}
