export interface BotUsageMetric {
  date: string // ISO date string
  count: number
}

export interface BotPerformanceMetric {
  date: string // ISO date string
  successRate: number // 0-100
  averageResponseTime: number // in ms
  userSatisfactionScore: number // 0-100
}

export interface BotMetrics {
  botId: string
  totalUsage: number
  dailyUsage: BotUsageMetric[]
  weeklyUsage: BotUsageMetric[]
  monthlyUsage: BotUsageMetric[]
  performance: {
    successRate: number // 0-100
    averageResponseTime: number // in ms
    userSatisfactionScore: number // 0-100
    daily: BotPerformanceMetric[]
    weekly: BotPerformanceMetric[]
    monthly: BotPerformanceMetric[]
  }
  topQueries: {
    query: string
    count: number
  }[]
  errorRates: {
    category: string
    count: number
  }[]
}
