export interface AssetInfo {
  symbol: string
  name: string
  price: number | null
  change: number | null
}

export interface Sector {
  id: string
  name: string
  icon: string
  description: string
  confidenceScore: number
  trend: "bullish" | "bearish" | "neutral"
  marketCap: string
  volume: string
  volatility: "low" | "medium" | "high"
  keyAssets: AssetInfo[]
}
