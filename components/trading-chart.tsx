"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { format } from "date-fns"
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart,
  Bar,
  Scatter,
  ReferenceLine,
} from "recharts"
import {
  RefreshCw,
  Settings,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  BarChart2,
  Activity,
  Layers,
  Plus,
  Minus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"

// Types for our data
interface CandleData {
  date: string
  timestamp: number
  open: number
  high: number
  low: number
  close: number
  volume: number
  ma7?: number
  ma21?: number
  ma50?: number
  ma200?: number
  rsi?: number
  macd?: number
  signal?: number
  histogram?: number
  bollingerUpper?: number
  bollingerMiddle?: number
  bollingerLower?: number
}

interface ChartProps {
  symbol?: string
  initialTimeframe?: string
  onRefresh?: () => void
  height?: number
  showVolume?: boolean
  showGrid?: boolean
  darkMode?: boolean
  initialInvestment?: number
  onClearData?: () => void
  defaultChartType?: "line" | "candles" | "area"
  brandColor?: string
}

// Generate realistic OHLC data
const generateCandleData = (timeframe: string, baseValue = 10000, volatility = 0.02, trend = 0.001): CandleData[] => {
  const data: CandleData[] = []
  const now = new Date()

  // Parameters for realistic price movements
  const momentumFactor = 0.7
  const marketCycles = Math.random() * 0.3 + 0.1
  const marketSentiment = Math.random() > 0.5 ? 1 : -1

  let previousClose = baseValue
  let previousChange = 0

  // Determine number of candles based on timeframe
  let totalCandles: number
  let timeIncrement: number

  switch (timeframe) {
    case "1m":
      totalCandles = 60
      timeIncrement = 60 * 1000 // 1 minute
      break
    case "5m":
      totalCandles = 60
      timeIncrement = 5 * 60 * 1000 // 5 minutes
      break
    case "15m":
      totalCandles = 60
      timeIncrement = 15 * 60 * 1000 // 15 minutes
      break
    case "1h":
      totalCandles = 48
      timeIncrement = 60 * 60 * 1000 // 1 hour
      break
    case "4h":
      totalCandles = 60
      timeIncrement = 4 * 60 * 60 * 1000 // 4 hours
      break
    case "1d":
      totalCandles = 60
      timeIncrement = 24 * 60 * 60 * 1000 // 1 day
      break
    case "1w":
      totalCandles = 52
      timeIncrement = 7 * 24 * 60 * 60 * 1000 // 1 week
      break
    default:
      totalCandles = 60
      timeIncrement = 60 * 60 * 1000 // Default to 1 hour
  }

  // Generate candles
  for (let i = 0; i < totalCandles; i++) {
    const timestamp = now.getTime() - (totalCandles - i) * timeIncrement
    const date = new Date(timestamp)

    // Generate realistic price movements
    const timeComponent = i / totalCandles
    const cyclicalComponent = Math.sin(timeComponent * 2 * Math.PI * marketCycles) * volatility * 0.5

    // Combine factors for this candle's movement
    const randomFactor = (Math.random() - 0.5) * volatility
    const trendComponent = trend * i
    const momentumComponent = previousChange * momentumFactor

    // Calculate change with more weight on momentum for realistic movement
    const change = (randomFactor + trendComponent + cyclicalComponent + momentumComponent) * marketSentiment
    previousChange = change

    // Calculate OHLC values
    const open = previousClose
    const close = open * (1 + change)

    // High and low are variations from open/close
    const highLowRange = Math.abs(close - open) * (1 + Math.random() * 1.5)
    const high = Math.max(open, close) + highLowRange * 0.6
    const low = Math.min(open, close) - highLowRange * 0.4

    // Generate volume (higher on bigger price movements)
    const volumeBase = baseValue * 0.01
    const volumeVariation = Math.abs(change) * 10
    const volume = Math.floor(volumeBase + volumeVariation * baseValue * (0.5 + Math.random()))

    data.push({
      date: format(date, "yyyy-MM-dd HH:mm"),
      timestamp,
      open,
      high,
      low,
      close,
      volume,
    })

    previousClose = close
  }

  // Calculate technical indicators
  return calculateIndicators(data)
}

// Calculate technical indicators
const calculateIndicators = (data: CandleData[]): CandleData[] => {
  // Calculate moving averages
  const periods = [7, 21, 50, 200]

  periods.forEach((period) => {
    for (let i = 0; i < data.length; i++) {
      if (i >= period - 1) {
        const sum = data.slice(i - period + 1, i + 1).reduce((acc, candle) => acc + candle.close, 0)
        data[i][`ma${period}` as keyof CandleData] = sum / period
      }
    }
  })

  // Calculate RSI (14 period)
  const rsiPeriod = 14
  for (let i = 0; i < data.length; i++) {
    if (i >= rsiPeriod) {
      let gains = 0
      let losses = 0

      for (let j = i - rsiPeriod + 1; j <= i; j++) {
        const change = data[j].close - data[j].open
        if (change >= 0) {
          gains += change
        } else {
          losses -= change
        }
      }

      const avgGain = gains / rsiPeriod
      const avgLoss = losses / rsiPeriod

      if (avgLoss === 0) {
        data[i].rsi = 100
      } else {
        const rs = avgGain / avgLoss
        data[i].rsi = 100 - 100 / (1 + rs)
      }
    }
  }

  // Calculate MACD (12, 26, 9)
  const fastPeriod = 12
  const slowPeriod = 26
  const signalPeriod = 9

  // Calculate EMA for MACD
  const calculateEMA = (values: number[], period: number): number[] => {
    const k = 2 / (period + 1)
    const emaData: number[] = []

    // Start with SMA for first value
    let sum = 0
    for (let i = 0; i < period; i++) {
      sum += values[i]
    }
    emaData.push(sum / period)

    // Calculate EMA for remaining values
    for (let i = period; i < values.length; i++) {
      emaData.push(values[i] * k + emaData[emaData.length - 1] * (1 - k))
    }

    return emaData
  }

  if (data.length >= slowPeriod) {
    const closes = data.map((d) => d.close)

    // Calculate fast and slow EMAs
    const fastEMA = calculateEMA(closes, fastPeriod)
    const slowEMA = calculateEMA(closes, slowPeriod)

    // Calculate MACD line
    const macdLine: number[] = []
    for (let i = 0; i < slowPeriod - fastPeriod; i++) {
      macdLine.push(0)
    }

    for (let i = 0; i < fastEMA.length; i++) {
      macdLine.push(fastEMA[i] - slowEMA[i])
    }

    // Calculate signal line (9-day EMA of MACD line)
    const signalLine = calculateEMA(macdLine.slice(slowPeriod - fastPeriod), signalPeriod)

    // Add MACD data to candles
    for (let i = slowPeriod + signalPeriod - 2; i < data.length; i++) {
      const macdIndex = i - (slowPeriod - fastPeriod)
      const signalIndex = i - (slowPeriod + signalPeriod - 2)

      data[i].macd = macdLine[macdIndex]
      data[i].signal = signalLine[signalIndex]
      data[i].histogram = macdLine[macdIndex] - signalLine[signalIndex]
    }
  }

  // Calculate Bollinger Bands (20, 2)
  const bollingerPeriod = 20
  const bollingerStdDev = 2

  for (let i = bollingerPeriod - 1; i < data.length; i++) {
    // Calculate SMA
    let sum = 0
    for (let j = i - bollingerPeriod + 1; j <= i; j++) {
      sum += data[j].close
    }
    const sma = sum / bollingerPeriod

    // Calculate standard deviation
    let squaredDiffSum = 0
    for (let j = i - bollingerPeriod + 1; j <= i; j++) {
      squaredDiffSum += Math.pow(data[j].close - sma, 2)
    }
    const stdDev = Math.sqrt(squaredDiffSum / bollingerPeriod)

    // Set Bollinger Bands
    data[i].bollingerMiddle = sma
    data[i].bollingerUpper = sma + bollingerStdDev * stdDev
    data[i].bollingerLower = sma - bollingerStdDev * stdDev
  }

  return data
}

// Custom candle renderer component
const CustomCandlestick = (props: any) => {
  const { x, y, width, height, open, close, low, high, brandColor } = props

  const fill = open > close ? "#ef4444" : brandColor || "#10b981"
  const stroke = fill

  // Calculate candle body
  const bodyY = Math.min(open, close)
  const bodyHeight = Math.abs(open - close)

  // Calculate wicks
  const wickX = x + width / 2

  return (
    <g>
      {/* Upper wick */}
      <line x1={wickX} y1={y} x2={wickX} y2={Math.min(open, close)} stroke={stroke} strokeWidth={1} />

      {/* Lower wick */}
      <line x1={wickX} y1={Math.max(open, close)} x2={wickX} y2={y + height} stroke={stroke} strokeWidth={1} />

      {/* Body */}
      <rect
        x={x}
        y={bodyY}
        width={width}
        height={Math.max(bodyHeight, 1)} // Ensure minimum height of 1px
        fill={fill}
        stroke={stroke}
      />
    </g>
  )
}

// Custom tooltip component
const CustomTooltip = ({ active, payload, label, symbol, brandColor }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload

    return (
      <div className="bg-black/90 border border-gray-700 p-3 rounded shadow-lg backdrop-blur-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-300 text-sm">{label}</span>
          <span className="text-white font-bold">{symbol || "ASSET"}</span>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-1">
          <div className="flex justify-between">
            <span className="text-gray-400 text-xs">Open:</span>
            <span className="text-white text-xs font-medium">${data.open.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 text-xs">Close:</span>
            <span
              className={`text-xs font-medium ${
                data.close >= data.open ? `text-[${brandColor || "#00ff4c"}]` : "text-red-500"
              }`}
            >
              ${data.close.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 text-xs">High:</span>
            <span className={`text-[${brandColor || "#00ff4c"}] text-xs font-medium`}>${data.high.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 text-xs">Low:</span>
            <span className="text-red-400 text-xs font-medium">${data.low.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-2 pt-2 border-t border-gray-700">
          <div className="flex justify-between">
            <span className="text-gray-400 text-xs">Volume:</span>
            <span className="text-blue-400 text-xs font-medium">{(data.volume / 1000).toFixed(1)}K</span>
          </div>

          {data.ma7 && (
            <div className="flex justify-between">
              <span className="text-gray-400 text-xs">MA7:</span>
              <span className="text-yellow-400 text-xs font-medium">${data.ma7.toFixed(2)}</span>
            </div>
          )}

          {data.ma21 && (
            <div className="flex justify-between">
              <span className="text-gray-400 text-xs">MA21:</span>
              <span className="text-purple-400 text-xs font-medium">${data.ma21.toFixed(2)}</span>
            </div>
          )}

          {data.rsi && (
            <div className="flex justify-between">
              <span className="text-gray-400 text-xs">RSI:</span>
              <span
                className={`text-xs font-medium ${
                  data.rsi > 70 ? "text-red-500" : data.rsi < 30 ? `text-[${brandColor || "#00ff4c"}]` : "text-white"
                }`}
              >
                {data.rsi.toFixed(2)}
              </span>
            </div>
          )}
        </div>
      </div>
    )
  }

  return null
}

// Custom cursor component
const CustomCursor = ({ points, brandColor }: any) => {
  if (!points || points.length === 0) return null
  const { x, y } = points[0]

  return (
    <g>
      <line
        x1={x}
        y1={0}
        x2={x}
        y2="100%"
        stroke={brandColor || "#00ff4c"}
        strokeWidth={0.5}
        strokeDasharray="3 3"
        opacity={0.5}
      />
      <line
        y1={y}
        x1={0}
        y2={y}
        x2="100%"
        stroke={brandColor || "#00ff4c"}
        strokeWidth={0.5}
        strokeDasharray="3 3"
        opacity={0.5}
      />
    </g>
  )
}

// Main Trading Chart Component
export default function TradingChart({
  symbol = "INFINITY-AI",
  initialTimeframe = "1h",
  onRefresh,
  height = 500,
  showVolume: initialShowVolume = true,
  showGrid: initialShowGrid = true,
  darkMode = true,
  initialInvestment = 10000,
  onClearData,
  defaultChartType = "line",
  brandColor = "#00ff4c",
}: ChartProps) {
  // State
  const [timeframe, setTimeframe] = useState(initialTimeframe)
  const [chartType, setChartType] = useState<"candles" | "line" | "area">(defaultChartType)
  const [data, setData] = useState<CandleData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showVolume, setShowVolume] = useState(initialShowVolume)
  const [showGrid, setShowGrid] = useState(initialShowGrid)
  const [showMA7, setShowMA7] = useState(true)
  const [showMA21, setShowMA21] = useState(true)
  const [showMA50, setShowMA50] = useState(false)
  const [showMA200, setShowMA200] = useState(false)
  const [showBollingerBands, setShowBollingerBands] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const chartRef = useRef<HTMLDivElement>(null)

  // Load data on mount and when timeframe changes
  useEffect(() => {
    loadChartData()
  }, [timeframe])

  // Load chart data
  const loadChartData = () => {
    setIsLoading(true)

    // Simulate API call delay
    setTimeout(() => {
      const newData = generateCandleData(timeframe, initialInvestment)
      setData(newData)
      setLastUpdated(new Date())
      setIsLoading(false)
    }, 500)
  }

  // Handle refresh
  const handleRefresh = () => {
    loadChartData()
    if (onRefresh) onRefresh()
  }

  // Handle clear data
  const handleClearData = () => {
    setData([])
    if (onClearData) onClearData()
  }

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!chartRef.current) return

    if (!document.fullscreenElement) {
      chartRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
    } else {
      document.exitFullscreen()
    }
  }

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  // Calculate visible data based on zoom level
  const visibleData = useMemo(() => {
    if (zoomLevel === 1 || !data.length) return data

    const dataLength = data.length
    const visibleLength = Math.floor(dataLength / zoomLevel)
    const startIndex = dataLength - visibleLength

    return data.slice(Math.max(0, startIndex))
  }, [data, zoomLevel])

  // Format date for X-axis
  const formatXAxis = (timestamp: number) => {
    const date = new Date(timestamp)

    switch (timeframe) {
      case "1m":
      case "5m":
      case "15m":
        return format(date, "HH:mm")
      case "1h":
      case "4h":
        return format(date, "HH:mm")
      case "1d":
        return format(date, "MMM dd")
      case "1w":
        return format(date, "MMM dd")
      default:
        return format(date, "MMM dd")
    }
  }

  // Format price for Y-axis
  const formatYAxis = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`
    } else {
      return `$${value.toFixed(0)}`
    }
  }

  // Generate price levels
  const generatePriceLevels = () => {
    if (!visibleData.length) return []

    const prices = visibleData.flatMap((d) => [d.high, d.low])
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    const range = maxPrice - minPrice

    // Determine appropriate increment based on price range
    let increment
    if (range > 10000) increment = 1000
    else if (range > 5000) increment = 500
    else if (range > 1000) increment = 100
    else if (range > 500) increment = 50
    else if (range > 100) increment = 10
    else if (range > 50) increment = 5
    else if (range > 10) increment = 1
    else if (range > 5) increment = 0.5
    else if (range > 1) increment = 0.1
    else increment = 0.05

    // Round min and max to nearest increment
    const roundedMin = Math.floor(minPrice / increment) * increment
    const roundedMax = Math.ceil(maxPrice / increment) * increment

    // Generate levels
    const levels = []
    for (let price = roundedMin; price <= roundedMax; price += increment) {
      levels.push(price)
    }

    return levels
  }

  // Render loading state
  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center bg-black border border-[#00ff4c]/30 rounded-lg"
        style={{ height: `${height}px` }}
      >
        <div className="flex flex-col items-center">
          <RefreshCw className="h-8 w-8 text-[#00ff4c] animate-spin mb-2" />
          <p className="text-[#00ff4c]">Loading chart data...</p>
        </div>
      </div>
    )
  }

  // Render empty state
  if (!data.length) {
    return (
      <div
        className="flex items-center justify-center bg-black border border-[#00ff4c]/30 rounded-lg"
        style={{ height: `${height}px` }}
      >
        <div className="flex flex-col items-center text-center max-w-md">
          <BarChart2 className="h-16 w-16 text-[#00ff4c]/50 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Chart Data Available</h3>
          <p className="text-gray-400 mb-4">Click refresh to load market data or wait for the next update.</p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-[#00ff4c] text-[#00ff4c] hover:bg-[#00ff4c]/10"
              onClick={handleRefresh}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Load Data
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Calculate domain for Y axis
  const calculateYDomain = () => {
    if (!visibleData.length) return [0, initialInvestment * 1.5]

    let min = Math.min(...visibleData.map((d) => d.low))
    let max = Math.max(...visibleData.map((d) => d.high))

    // Include indicators in domain calculation
    if (showBollingerBands) {
      const lowerBands = visibleData.filter((d) => d.bollingerLower).map((d) => d.bollingerLower as number)
      const upperBands = visibleData.filter((d) => d.bollingerUpper).map((d) => d.bollingerUpper as number)

      if (lowerBands.length) min = Math.min(min, ...lowerBands)
      if (upperBands.length) max = Math.max(max, ...upperBands)
    }

    // Add padding
    const padding = (max - min) * 0.1
    min = min - padding
    max = max + padding

    // Ensure min is never below 0
    min = Math.max(0, min)

    return [min, max]
  }

  const yDomain = calculateYDomain()
  const priceLevels = generatePriceLevels()

  return (
    <div
      ref={chartRef}
      className={`relative bg-black border border-[#00ff4c]/30 rounded-lg overflow-hidden ${
        isFullscreen ? "fixed inset-0 z-50" : ""
      }`}
      style={{ height: isFullscreen ? "100vh" : `${height}px` }}
    >
      {/* Chart Header */}
      <div className="flex items-center justify-between p-2 border-b border-[#00ff4c]/30">
        <div className="flex items-center">
          <div className="mr-4">
            <h3 className="text-white font-bold text-lg">{symbol}</h3>
            <div className="flex items-center">
              <span
                className={`text-sm font-medium ${
                  visibleData[visibleData.length - 1]?.close >= visibleData[visibleData.length - 1]?.open
                    ? "text-[#00ff4c]"
                    : "text-red-500"
                }`}
              >
                ${visibleData[visibleData.length - 1]?.close.toFixed(2)}
              </span>
              <span className="text-gray-400 text-xs ml-2">{format(lastUpdated, "MMM dd, yyyy HH:mm:ss")}</span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              className={`h-7 px-2 ${
                chartType === "line" ? "bg-[#00ff4c]/20 border-[#00ff4c]" : "bg-transparent border-gray-700"
              } hover:bg-[#00ff4c]/20 hover:border-[#00ff4c]`}
              onClick={() => setChartType("line")}
            >
              <Activity className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`h-7 px-2 ${
                chartType === "candles" ? "bg-[#00ff4c]/20 border-[#00ff4c]" : "bg-transparent border-gray-700"
              } hover:bg-[#00ff4c]/20 hover:border-[#00ff4c]`}
              onClick={() => setChartType("candles")}
            >
              <BarChart2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`h-7 px-2 ${
                chartType === "area" ? "bg-[#00ff4c]/20 border-[#00ff4c]" : "bg-transparent border-gray-700"
              } hover:bg-[#00ff4c]/20 hover:border-[#00ff4c]`}
              onClick={() => setChartType("area")}
            >
              <Layers className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Timeframe selector */}
          <div className="flex items-center space-x-1">
            {["1m", "5m", "15m", "1h", "4h", "1d", "1w"].map((tf) => (
              <Button
                key={tf}
                variant="outline"
                size="sm"
                className={`h-7 px-2 ${
                  timeframe === tf
                    ? "bg-[#00ff4c]/20 text-[#00ff4c] border-[#00ff4c]"
                    : "bg-transparent text-gray-400 border-gray-700"
                } hover:bg-[#00ff4c]/10 hover:border-[#00ff4c]/50`}
                onClick={() => setTimeframe(tf)}
              >
                {tf}
              </Button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-7 p-0 border-gray-700 hover:bg-[#00ff4c]/10 hover:border-[#00ff4c]/50"
              onClick={() => setZoomLevel(Math.max(1, zoomLevel - 0.5))}
              disabled={zoomLevel <= 1}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-7 p-0 border-gray-700 hover:bg-[#00ff4c]/10 hover:border-[#00ff4c]/50"
              onClick={() => setZoomLevel(Math.min(5, zoomLevel + 0.5))}
              disabled={zoomLevel >= 5}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-7 p-0 border-gray-700 hover:bg-[#00ff4c]/10 hover:border-[#00ff4c]/50"
              onClick={toggleFullscreen}
            >
              {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-7 p-0 border-gray-700 hover:bg-[#00ff4c]/10 hover:border-[#00ff4c]/50"
              onClick={handleRefresh}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 w-7 p-0 border-gray-700 hover:bg-[#00ff4c]/10 hover:border-[#00ff4c]/50"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 bg-black border border-[#00ff4c]/30 p-3">
                <h4 className="text-white font-medium mb-2">Chart Settings</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-grid" className="text-sm text-gray-300">
                      Show Grid
                    </Label>
                    <Switch
                      id="show-grid"
                      checked={showGrid}
                      onCheckedChange={setShowGrid}
                      className="data-[state=checked]:bg-[#00ff4c]"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-volume" className="text-sm text-gray-300">
                      Show Volume
                    </Label>
                    <Switch
                      id="show-volume"
                      checked={showVolume}
                      onCheckedChange={setShowVolume}
                      className="data-[state=checked]:bg-[#00ff4c]"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-ma7" className="text-sm text-gray-300">
                      MA 7
                    </Label>
                    <Switch
                      id="show-ma7"
                      checked={showMA7}
                      onCheckedChange={setShowMA7}
                      className="data-[state=checked]:bg-[#00ff4c]"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-ma21" className="text-sm text-gray-300">
                      MA 21
                    </Label>
                    <Switch
                      id="show-ma21"
                      checked={showMA21}
                      onCheckedChange={setShowMA21}
                      className="data-[state=checked]:bg-[#00ff4c]"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-ma50" className="text-sm text-gray-300">
                      MA 50
                    </Label>
                    <Switch
                      id="show-ma50"
                      checked={showMA50}
                      onCheckedChange={setShowMA50}
                      className="data-[state=checked]:bg-[#00ff4c]"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-ma200" className="text-sm text-gray-300">
                      MA 200
                    </Label>
                    <Switch
                      id="show-ma200"
                      checked={showMA200}
                      onCheckedChange={setShowMA200}
                      className="data-[state=checked]:bg-[#00ff4c]"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-bb" className="text-sm text-gray-300">
                      Bollinger Bands
                    </Label>
                    <Switch
                      id="show-bb"
                      checked={showBollingerBands}
                      onCheckedChange={setShowBollingerBands}
                      className="data-[state=checked]:bg-[#00ff4c]"
                    />
                  </div>
                  <div className="pt-2 border-t border-[#00ff4c]/30">
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full bg-red-900 hover:bg-red-800 text-white"
                      onClick={handleClearData}
                    >
                      Clear Data
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* Chart Body */}
      <div className="relative h-[calc(100%-80px)]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={visibleData} margin={{ top: 10, right: 50, left: 0, bottom: 5 }}>
            {showGrid && (
              <CartesianGrid strokeDasharray="3 3" stroke="#1a3a1a" vertical={true} horizontal={true} opacity={0.5} />
            )}

            {/* X and Y Axes */}
            <XAxis
              dataKey="timestamp"
              tickFormatter={formatXAxis}
              stroke="#00ff4c"
              tick={{ fill: "#00ff4c" }}
              axisLine={{ stroke: "#1a3a1a" }}
              tickLine={{ stroke: "#1a3a1a" }}
              minTickGap={30}
            />
            <YAxis
              domain={yDomain}
              tickFormatter={formatYAxis}
              stroke="#00ff4c"
              tick={{ fill: "#00ff4c" }}
              axisLine={{ stroke: "#1a3a1a" }}
              tickLine={{ stroke: "#1a3a1a" }}
              orientation="right"
              ticks={priceLevels}
            />

            {/* Volume */}
            {showVolume && (
              <YAxis
                yAxisId="volume"
                orientation="left"
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                domain={[0, "dataMax"]}
                axisLine={{ stroke: "#1a3a1a" }}
                tickLine={{ stroke: "#1a3a1a" }}
                tick={{ fill: "#888" }}
                width={40}
              />
            )}

            {/* Tooltip and Legend */}
            <Tooltip
              content={<CustomTooltip symbol={symbol} brandColor={brandColor} />}
              cursor={<CustomCursor brandColor={brandColor} />}
            />

            {/* Volume Bars */}
            {showVolume && <Bar yAxisId="volume" dataKey="volume" fill="#1a3a1a" opacity={0.5} barSize={3} />}

            {/* Reference Line for Initial Investment */}
            <ReferenceLine y={initialInvestment} stroke="#888" strokeDasharray="3 3" />

            {/* Candlesticks */}
            {chartType === "candles" &&
              visibleData.map((entry, index) => (
                <Scatter key={`candle-${index}`} data={[entry]} shape={<CustomCandlestick brandColor={brandColor} />} />
              ))}

            {/* Line Chart */}
            {chartType === "line" && (
              <Line
                type="monotone"
                dataKey="close"
                stroke={brandColor}
                dot={false}
                strokeWidth={1.5}
                animationDuration={500}
              />
            )}

            {/* Area Chart */}
            {chartType === "area" && (
              <Area
                type="monotone"
                dataKey="close"
                stroke={brandColor}
                fill="url(#colorClose)"
                fillOpacity={0.2}
                dot={false}
                strokeWidth={1.5}
                animationDuration={500}
              />
            )}

            {/* Moving Averages */}
            {showMA7 && (
              <Line
                type="monotone"
                dataKey="ma7"
                stroke="#eab308"
                dot={false}
                strokeWidth={1}
                animationDuration={500}
              />
            )}

            {showMA21 && (
              <Line
                type="monotone"
                dataKey="ma21"
                stroke="#a855f7"
                dot={false}
                strokeWidth={1}
                animationDuration={500}
              />
            )}

            {showMA50 && (
              <Line
                type="monotone"
                dataKey="ma50"
                stroke="#3b82f6"
                dot={false}
                strokeWidth={1}
                animationDuration={500}
              />
            )}

            {showMA200 && (
              <Line
                type="monotone"
                dataKey="ma200"
                stroke="#ef4444"
                dot={false}
                strokeWidth={1}
                animationDuration={500}
              />
            )}

            {/* Bollinger Bands */}
            {showBollingerBands && (
              <>
                <Line
                  type="monotone"
                  dataKey="bollingerUpper"
                  stroke="#06b6d4"
                  dot={false}
                  strokeWidth={1}
                  strokeDasharray="3 3"
                  animationDuration={500}
                />
                <Line
                  type="monotone"
                  dataKey="bollingerMiddle"
                  stroke="#06b6d4"
                  dot={false}
                  strokeWidth={1}
                  animationDuration={500}
                />
                <Line
                  type="monotone"
                  dataKey="bollingerLower"
                  stroke="#06b6d4"
                  dot={false}
                  strokeWidth={1}
                  strokeDasharray="3 3"
                  animationDuration={500}
                />
              </>
            )}

            {/* Gradient for area chart */}
            <defs>
              <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={brandColor} stopOpacity={0.8} />
                <stop offset="95%" stopColor={brandColor} stopOpacity={0} />
              </linearGradient>
            </defs>
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer */}
      <div className="absolute bottom-0 left-0 right-0 h-8 border-t border-[#00ff4c]/30 bg-black/50 backdrop-blur-sm flex items-center justify-between px-3">
        <div className="flex items-center space-x-3">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></div>
            <span className="text-xs text-gray-400">MA7</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-purple-500 mr-1"></div>
            <span className="text-xs text-gray-400">MA21</span>
          </div>
          {showMA50 && (
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-blue-500 mr-1"></div>
              <span className="text-xs text-gray-400">MA50</span>
            </div>
          )}
          {showMA200 && (
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-red-500 mr-1"></div>
              <span className="text-xs text-gray-400">MA200</span>
            </div>
          )}
        </div>

        <div className="flex items-center">
          <span className="text-xs text-gray-400 mr-2">Zoom:</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-gray-400 hover:text-[#00ff4c] hover:bg-transparent"
            onClick={() => setZoomLevel(Math.max(1, zoomLevel - 0.5))}
            disabled={zoomLevel <= 1}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="text-xs text-white mx-1">{zoomLevel}x</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-gray-400 hover:text-[#00ff4c] hover:bg-transparent"
            onClick={() => setZoomLevel(Math.min(5, zoomLevel + 0.5))}
            disabled={zoomLevel >= 5}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  )
}
