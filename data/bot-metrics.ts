import type { BotMetrics } from "@/types/bot-metrics"

// Helper function to generate dates for the past n days
function getPastDates(days: number): string[] {
  return Array.from({ length: days }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    return date.toISOString().split("T")[0]
  }).reverse()
}

// Helper function to generate random metrics
function generateRandomMetrics(days: number, baseValue: number, variance: number) {
  const dates = getPastDates(days)
  return dates.map((date) => ({
    date,
    count: Math.floor(baseValue + Math.random() * variance),
  }))
}

// Helper function to generate random performance metrics
function generateRandomPerformanceMetrics(days: number) {
  const dates = getPastDates(days)
  return dates.map((date) => ({
    date,
    successRate: 75 + Math.random() * 25, // 75-100%
    averageResponseTime: 200 + Math.random() * 800, // 200-1000ms
    userSatisfactionScore: 70 + Math.random() * 30, // 70-100
  }))
}

// Generate mock metrics for a bot
export function generateBotMetrics(botId: string, popularity = 1): BotMetrics {
  // Popularity factor (1-10) affects the base usage numbers
  const baseUsage = 50 * popularity
  const variance = 30 * popularity

  return {
    botId,
    totalUsage: baseUsage * 30 + Math.floor(Math.random() * 500),
    dailyUsage: generateRandomMetrics(14, baseUsage, variance),
    weeklyUsage: generateRandomMetrics(12, baseUsage * 7, variance * 7),
    monthlyUsage: generateRandomMetrics(6, baseUsage * 30, variance * 30),
    performance: {
      successRate: 85 + Math.random() * 15,
      averageResponseTime: 300 + Math.random() * 700,
      userSatisfactionScore: 75 + Math.random() * 25,
      daily: generateRandomPerformanceMetrics(14),
      weekly: generateRandomPerformanceMetrics(12),
      monthly: generateRandomPerformanceMetrics(6),
    },
    topQueries: [
      { query: "Market prediction for next week", count: Math.floor(20 + Math.random() * 80) },
      { query: "Analyze recent trends", count: Math.floor(15 + Math.random() * 70) },
      { query: "Sentiment analysis for tech stocks", count: Math.floor(10 + Math.random() * 60) },
      { query: "Risk assessment for portfolio", count: Math.floor(5 + Math.random() * 50) },
      { query: "Identify growth opportunities", count: Math.floor(5 + Math.random() * 40) },
    ],
    errorRates: [
      { category: "API Timeout", count: Math.floor(Math.random() * 20) },
      { category: "Data Parsing", count: Math.floor(Math.random() * 15) },
      { category: "User Input", count: Math.floor(Math.random() * 25) },
      { category: "Authentication", count: Math.floor(Math.random() * 10) },
      { category: "Unknown", count: Math.floor(Math.random() * 5) },
    ],
  }
}

// Generate metrics for all bots
export function generateAllBotMetrics(botIds: string[]): Record<string, BotMetrics> {
  const metrics: Record<string, BotMetrics> = {}

  botIds.forEach((botId, index) => {
    // Assign different popularity levels to different bots
    const popularity = 1 + (index % 10)
    metrics[botId] = generateBotMetrics(botId, popularity)
  })

  return metrics
}
