"use client"

import { useState } from "react"
import type { BotMetrics } from "@/types/bot-metrics"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Activity, Clock, ThumbsUp, Search } from "lucide-react"

interface BotMetricsDashboardProps {
  metrics: BotMetrics
  botName: string
}

export default function BotMetricsDashboard({ metrics, botName }: BotMetricsDashboardProps) {
  const [timeRange, setTimeRange] = useState<"daily" | "weekly" | "monthly">("daily")

  // Colors for charts
  const COLORS = ["#00ff4c", "#00cc3d", "#00992e", "#00661f", "#003310"]

  // Get usage data based on selected time range
  const getUsageData = () => {
    switch (timeRange) {
      case "daily":
        return metrics.dailyUsage
      case "weekly":
        return metrics.weeklyUsage
      case "monthly":
        return metrics.monthlyUsage
      default:
        return metrics.dailyUsage
    }
  }

  // Get performance data based on selected time range
  const getPerformanceData = () => {
    switch (timeRange) {
      case "daily":
        return metrics.performance.daily
      case "weekly":
        return metrics.performance.weekly
      case "monthly":
        return metrics.performance.monthly
      default:
        return metrics.performance.daily
    }
  }

  const usageData = getUsageData()
  const performanceData = getPerformanceData()

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-[#00ff4c]">{botName} Analytics</h2>
        <div className="flex items-center space-x-2 bg-black/40 backdrop-blur-sm p-1 rounded-md border border-[#00ff4c33]">
          <button
            onClick={() => setTimeRange("daily")}
            className={`px-3 py-1 rounded-md text-sm ${
              timeRange === "daily" ? "bg-[#00ff4c20] text-[#00ff4c]" : "text-gray-400 hover:text-white"
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setTimeRange("weekly")}
            className={`px-3 py-1 rounded-md text-sm ${
              timeRange === "weekly" ? "bg-[#00ff4c20] text-[#00ff4c]" : "text-gray-400 hover:text-white"
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setTimeRange("monthly")}
            className={`px-3 py-1 rounded-md text-sm ${
              timeRange === "monthly" ? "bg-[#00ff4c20] text-[#00ff4c]" : "text-gray-400 hover:text-white"
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-black/40 backdrop-blur-sm border-[#00ff4c33]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Usage</p>
                <h3 className="text-2xl font-bold text-white mt-1">{metrics.totalUsage.toLocaleString()}</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#00ff4c20] flex items-center justify-center">
                <Activity className="text-[#00ff4c]" size={20} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-sm border-[#00ff4c33]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Success Rate</p>
                <h3 className="text-2xl font-bold text-white mt-1">{metrics.performance.successRate.toFixed(1)}%</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#00ff4c20] flex items-center justify-center">
                <ThumbsUp className="text-[#00ff4c]" size={20} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-sm border-[#00ff4c33]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Avg. Response Time</p>
                <h3 className="text-2xl font-bold text-white mt-1">
                  {metrics.performance.averageResponseTime.toFixed(0)} ms
                </h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#00ff4c20] flex items-center justify-center">
                <Clock className="text-[#00ff4c]" size={20} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-sm border-[#00ff4c33]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">User Satisfaction</p>
                <h3 className="text-2xl font-bold text-white mt-1">
                  {metrics.performance.userSatisfactionScore.toFixed(1)}%
                </h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#00ff4c20] flex items-center justify-center">
                <ThumbsUp className="text-[#00ff4c]" size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usage Chart */}
        <Card className="bg-black/40 backdrop-blur-sm border-[#00ff4c33]">
          <CardHeader>
            <CardTitle className="text-[#00ff4c]">Usage Trends</CardTitle>
            <CardDescription>Bot usage over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer
                config={{
                  count: {
                    label: "Usage Count",
                    color: "hsl(var(--chart-1))",
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={usageData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis
                      dataKey="date"
                      stroke="#666"
                      tickFormatter={(value) => {
                        const date = new Date(value)
                        return `${date.getMonth() + 1}/${date.getDate()}`
                      }}
                    />
                    <YAxis stroke="#666" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" fill="#00ff4c" name="Usage Count" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* Performance Chart */}
        <Card className="bg-black/40 backdrop-blur-sm border-[#00ff4c33]">
          <CardHeader>
            <CardTitle className="text-[#00ff4c]">Performance Metrics</CardTitle>
            <CardDescription>Success rate and response time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer
                config={{
                  successRate: {
                    label: "Success Rate (%)",
                    color: "hsl(var(--chart-1))",
                  },
                  averageResponseTime: {
                    label: "Avg Response Time (ms)",
                    color: "hsl(var(--chart-2))",
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis
                      dataKey="date"
                      stroke="#666"
                      tickFormatter={(value) => {
                        const date = new Date(value)
                        return `${date.getMonth() + 1}/${date.getDate()}`
                      }}
                    />
                    <YAxis stroke="#666" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="successRate"
                      stroke="#00ff4c"
                      strokeWidth={2}
                      dot={{ r: 4, fill: "#00ff4c" }}
                      activeDot={{ r: 6 }}
                      name="Success Rate"
                    />
                    <Line
                      type="monotone"
                      dataKey="averageResponseTime"
                      stroke="#ff9900"
                      strokeWidth={2}
                      dot={{ r: 4, fill: "#ff9900" }}
                      activeDot={{ r: 6 }}
                      name="Response Time"
                    />
                    <Legend />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Queries */}
        <Card className="bg-black/40 backdrop-blur-sm border-[#00ff4c33]">
          <CardHeader>
            <CardTitle className="text-[#00ff4c]">Top Queries</CardTitle>
            <CardDescription>Most frequent user requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics.topQueries.map((query, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-[#00ff4c20] flex items-center justify-center mr-3">
                      <Search className="text-[#00ff4c]" size={16} />
                    </div>
                    <span className="text-sm text-white">{query.query}</span>
                  </div>
                  <span className="text-sm font-medium text-[#00ff4c]">{query.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Error Rates */}
        <Card className="bg-black/40 backdrop-blur-sm border-[#00ff4c33]">
          <CardHeader>
            <CardTitle className="text-[#00ff4c]">Error Distribution</CardTitle>
            <CardDescription>Breakdown of error categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={metrics.errorRates}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="category"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {metrics.errorRates.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value} errors`, name]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {metrics.errorRates.map((error, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="text-xs text-gray-400">
                    {error.category}: {error.count}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
