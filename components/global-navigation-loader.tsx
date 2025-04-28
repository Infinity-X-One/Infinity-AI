"use client"

import { useEffect, useState } from "react"
import LoadingScreen from "./loading-screen"

export default function GlobalNavigationLoader() {
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const handleRouteChangeStart = () => {
      setIsLoading(true)
    }

    const handleRouteChangeComplete = () => {
      // Add a small delay before hiding the loading screen
      setTimeout(() => {
        setIsLoading(false)
      }, 500)
    }

    // Force loading to end after 5 seconds as a fallback
    const fallbackTimer = setTimeout(() => {
      if (isLoading) {
        console.log("Forcing global navigation loading to end via fallback timer")
        setIsLoading(false)
      }
    }, 5000)

    // Listen for custom events
    window.addEventListener("routeChangeStart", handleRouteChangeStart)
    window.addEventListener("routeChangeComplete", handleRouteChangeComplete)

    // Listen for our custom loading events
    window.addEventListener("startLoading", handleRouteChangeStart)
    window.addEventListener("stopLoading", handleRouteChangeComplete)

    return () => {
      window.removeEventListener("routeChangeStart", handleRouteChangeStart)
      window.removeEventListener("routeChangeComplete", handleRouteChangeComplete)
      window.removeEventListener("startLoading", handleRouteChangeStart)
      window.removeEventListener("stopLoading", handleRouteChangeComplete)
      clearTimeout(fallbackTimer)
    }
  }, [isLoading])

  return isLoading ? <LoadingScreen /> : null
}
