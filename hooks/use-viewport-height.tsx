"use client"

import { useEffect } from "react"

// This hook fixes the common mobile viewport height issue
// where 100vh is taller than the visible area due to address bars
export function useViewportHeight() {
  useEffect(() => {
    // Function to update the viewport height
    const updateViewportHeight = () => {
      // Set a CSS variable with the actual viewport height
      document.documentElement.style.setProperty("--vh", `${window.innerHeight * 0.01}px`)
    }

    // Initial update
    updateViewportHeight()

    // Update on resize
    window.addEventListener("resize", updateViewportHeight)

    // Update on orientation change
    window.addEventListener("orientationchange", updateViewportHeight)

    // Clean up
    return () => {
      window.removeEventListener("resize", updateViewportHeight)
      window.removeEventListener("orientationchange", updateViewportHeight)
    }
  }, [])
}
