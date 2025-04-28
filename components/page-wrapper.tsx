"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import MobileNavigation from "@/components/mobile-navigation"
import { useMobile } from "@/hooks/use-mobile"

interface PageWrapperProps {
  children: React.ReactNode
}

// Component definition
function PageWrapper({ children }: PageWrapperProps) {
  const isMobile = useMobile()
  const [isLoaded, setIsLoaded] = useState(false)
  const hasDispatchedStopLoading = useRef(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  useEffect(() => {
    // Signal that loading is complete
    const timer = setTimeout(() => {
      setIsLoaded(true)

      // Only dispatch once
      if (!hasDispatchedStopLoading.current) {
        hasDispatchedStopLoading.current = true
        // Use setTimeout to ensure we're outside React's rendering cycle
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent("stopLoading"))
        }, 0)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative min-h-screen bg-black">
      <div className={`page-content ${isLoaded ? "loaded" : ""}`}>{children}</div>

      {/* Add mobile bottom navigation */}
      {isMobile && <MobileNavigation toggleSidebar={toggleSidebar} />}

      {/* Add padding at the bottom for mobile to account for the navigation bar */}
      {isMobile && <div className="h-16"></div>}
    </div>
  )
}

// Add both default and named exports
export default PageWrapper
export { PageWrapper }
