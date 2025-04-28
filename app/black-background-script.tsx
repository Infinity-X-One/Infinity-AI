"use client"

import { useEffect, useRef } from "react"

export default function BlackBackgroundScript() {
  // Use refs to avoid React state updates during critical paths
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    // Set background color immediately
    document.documentElement.style.backgroundColor = "#000000"
    document.body.style.backgroundColor = "#000000"

    // Create a style element to ensure black background
    const style = document.createElement("style")
    style.textContent = `
      html, body, #__next {
        background-color: #000000 !important;
      }
      
      /* This overlay will prevent any white flashes */
      body::after {
        content: "";
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #000000;
        z-index: -9999;
        pointer-events: none;
      }
    `
    document.head.appendChild(style)

    // Safely intercept navigation events
    const safeDispatchEvent = (eventName: string) => {
      // Use setTimeout to ensure we're outside React's rendering cycle
      setTimeout(() => {
        window.dispatchEvent(new Event(eventName))
      }, 0)
    }

    // Store original methods
    const originalPushState = history.pushState
    const originalReplaceState = history.replaceState

    // Override history methods safely
    history.pushState = function () {
      safeDispatchEvent("routeChangeStart")
      const result = originalPushState.apply(this, arguments as any)
      safeDispatchEvent("routeChangeComplete")
      return result
    }

    history.replaceState = function () {
      safeDispatchEvent("routeChangeStart")
      const result = originalReplaceState.apply(this, arguments as any)
      safeDispatchEvent("routeChangeComplete")
      return result
    }

    // Handle back/forward navigation
    const handlePopState = () => {
      safeDispatchEvent("routeChangeStart")
      // Add delay to simulate navigation time
      setTimeout(() => {
        safeDispatchEvent("routeChangeComplete")
      }, 300)
    }

    window.addEventListener("popstate", handlePopState)

    return () => {
      // Clean up
      if (document.head.contains(style)) {
        document.head.removeChild(style)
      }
      history.pushState = originalPushState
      history.replaceState = originalReplaceState
      window.removeEventListener("popstate", handlePopState)
    }
  }, [])

  return null
}
