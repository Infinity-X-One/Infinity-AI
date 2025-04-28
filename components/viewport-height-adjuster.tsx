"use client"

import { useEffect } from "react"

export function ViewportHeightAdjuster() {
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

  return null // This component doesn't render anything
}
