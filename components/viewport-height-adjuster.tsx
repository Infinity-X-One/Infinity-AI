"use client"

import { useEffect } from "react"

export function ViewportHeightAdjuster() {
  useEffect(() => {
    // Function to update the viewport height
    const updateViewportHeight = () => {
      // Get the viewport height
      const vh = window.innerHeight * 0.01
      // Set the value in the --vh custom property to the root of the document
      document.documentElement.style.setProperty("--vh", `${vh}px`)
    }

    // Update the height on first load
    updateViewportHeight()

    // Add event listener for resize and orientation change
    window.addEventListener("resize", updateViewportHeight)
    window.addEventListener("orientationchange", updateViewportHeight)

    // Clean up
    return () => {
      window.removeEventListener("resize", updateViewportHeight)
      window.removeEventListener("orientationchange", updateViewportHeight)
    }
  }, [])

  return null // This component doesn't render anything
}
