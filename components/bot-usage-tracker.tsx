"use client"

import { useState, useEffect } from "react"
import type { BotMetrics } from "@/types/bot-metrics"

interface BotUsageTrackerProps {
  botId: string
  onUsageRecorded?: (metrics: Partial<BotMetrics>) => void
}

export default function BotUsageTracker({ botId, onUsageRecorded }: BotUsageTrackerProps) {
  const [startTime, setStartTime] = useState<number | null>(null)
  const [isTracking, setIsTracking] = useState(false)

  // Start tracking when component mounts
  useEffect(() => {
    startTracking()

    // Clean up when component unmounts
    return () => {
      if (isTracking) {
        stopTracking()
      }
    }
  }, [botId])

  const startTracking = () => {
    setStartTime(Date.now())
    setIsTracking(true)

    // Record the start of a session
    const sessionStartMetrics = {
      botId,
      sessionStart: true,
      timestamp: new Date().toISOString(),
    }

    // Send to analytics service or callback
    if (onUsageRecorded) {
      onUsageRecorded(sessionStartMetrics as any)
    }
  }

  const stopTracking = () => {
    if (!startTime) return

    const endTime = Date.now()
    const duration = endTime - startTime

    // Record the end of a session with duration
    const sessionEndMetrics = {
      botId,
      sessionEnd: true,
      duration,
      timestamp: new Date().toISOString(),
    }

    // Send to analytics service or callback
    if (onUsageRecorded) {
      onUsageRecorded(sessionEndMetrics as any)
    }

    setIsTracking(false)
    setStartTime(null)
  }

  // This component doesn't render anything visible
  return null
}
