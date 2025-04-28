"use client"

import { useState, useEffect } from "react"
import type { BotMetrics } from "@/types/bot-metrics"

interface BotPerformanceMonitorProps {
  botId: string
  onPerformanceRecorded?: (metrics: Partial<BotMetrics>) => void
}

export default function BotPerformanceMonitor({ botId, onPerformanceRecorded }: BotPerformanceMonitorProps) {
  const [requestStartTime, setRequestStartTime] = useState<number | null>(null)
  const [successCount, setSuccessCount] = useState(0)
  const [errorCount, setErrorCount] = useState(0)

  // Listen for bot request events
  useEffect(() => {
    const handleBotRequestStart = (event: CustomEvent) => {
      if (event.detail?.botId === botId) {
        setRequestStartTime(Date.now())
      }
    }

    const handleBotRequestEnd = (event: CustomEvent) => {
      if (event.detail?.botId === botId && requestStartTime) {
        const endTime = Date.now()
        const responseTime = endTime - requestStartTime

        // Record performance metrics
        const performanceMetrics = {
          botId,
          responseTime,
          success: event.detail?.success || false,
          errorType: event.detail?.errorType,
          timestamp: new Date().toISOString(),
        }

        // Update success/error counts
        if (event.detail?.success) {
          setSuccessCount((prev) => prev + 1)
        } else {
          setErrorCount((prev) => prev + 1)
        }

        // Send to analytics service or callback
        if (onPerformanceRecorded) {
          onPerformanceRecorded(performanceMetrics as any)
        }

        setRequestStartTime(null)
      }
    }

    // Add event listeners
    window.addEventListener("botRequestStart", handleBotRequestStart as EventListener)
    window.addEventListener("botRequestEnd", handleBotRequestEnd as EventListener)

    // Clean up
    return () => {
      window.removeEventListener("botRequestStart", handleBotRequestStart as EventListener)
      window.removeEventListener("botRequestEnd", handleBotRequestEnd as EventListener)
    }
  }, [botId, requestStartTime, onPerformanceRecorded])

  // This component doesn't render anything visible
  return null
}
