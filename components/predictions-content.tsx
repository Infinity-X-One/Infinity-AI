"use client"

import { useState, useEffect } from "react"
import { ArrowRight, Zap, Info, ChevronDown, ChevronUp, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useData } from "@/contexts/data-context"
import { sectors } from "@/data/sectors"

export default function PredictionsContent() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [expandedSectors, setExpandedSectors] = useState<Record<string, boolean>>({})
  const { marketData, sentimentData, predictions, refreshData, isLoading, error } = useData()

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const toggleSector = (sectorId: string) => {
    setExpandedSectors((prev) => ({
      ...prev,
      [sectorId]: !prev[sectorId],
    }))
  }

  // Filter sectors to only include those with high confidence scores (>70)
  const highConfidenceSectors = sectors
    .filter((sector) => sector.confidenceScore > 70)
    .sort((a, b) => b.confidenceScore - a.confidenceScore)

  // Handle refresh button click
  const handleRefresh = async () => {
    try {
      // Get all symbols from high confidence sectors
      const symbols = highConfidenceSectors.flatMap((sector) => sector.keyAssets.map((asset) => asset.symbol))

      await refreshData(symbols)
    } catch (err) {
      console.error("Error refreshing data:", err)
    }
  }

  return (
    <div
      className={`h-full bg-black text-white overflow-y-auto ${isLoaded ? "opacity-100" : "opacity-0"} transition-opacity duration-500`}
    >
      {/* Hexagon background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-full h-full">
          {/* Hexagon grid pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#00ff4c_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none"></div>

          {/* Glowing orbs */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#00ff4c] rounded-full filter blur-[128px] opacity-10 animate-pulse-slow pointer-events-none"></div>
          <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-[#00ff4c] rounded-full filter blur-[128px] opacity-5 animate-pulse-slow pointer-events-none"></div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            <span className="text-[#00ff4c]">Live</span> Predictions
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Real-time, high-confidence market predictions powered by our advanced AI algorithms. These assets have been
            carefully selected based on technical analysis, sentiment, and market conditions.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button
              className="bg-black border border-[#00ff4c] text-white hover:bg-[#00ff4c15] relative h-12 px-6"
              onClick={() => window.open("https://predictions.infinityxos.com", "_blank")}
            >
              <div className="absolute inset-0 shadow-[inset_0_0_8px_rgba(0,255,76,0.3)] pointer-events-none rounded-md"></div>
              <div className="flex items-center gap-2 z-10">
                <span>View All Predictions</span>
                <ArrowRight size={16} className="text-[#00ff4c]" />
              </div>
            </Button>

            <Button
              className="bg-black border border-[#00ff4c] text-white hover:bg-[#00ff4c15] relative h-12 px-6"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <div className="absolute inset-0 shadow-[inset_0_0_8px_rgba(0,255,76,0.3)] pointer-events-none rounded-md"></div>
              <div className="flex items-center gap-2 z-10">
                <RefreshCw size={16} className={`text-[#00ff4c] ${isLoading ? "animate-spin" : ""}`} />
                <span>{isLoading ? "Refreshing..." : "Refresh Data"}</span>
              </div>
            </Button>
          </div>

          {error && <div className="mt-4 p-2 bg-red-900/50 border border-red-500 rounded text-white">{error}</div>}
        </div>

        {/* Sectors Grid */}
        <div className="grid grid-cols-1 gap-8">
          {highConfidenceSectors.map((sector) => (
            <div
              key={sector.id}
              className="bg-black border border-[#00ff4c33] rounded-lg p-6 hover:border-[#00ff4c] transition-all duration-300 relative overflow-hidden"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-[#00ff4c] opacity-0 hover:opacity-5 transition-opacity duration-300 pointer-events-none"></div>

              <div
                className="flex justify-between items-center mb-4 cursor-pointer"
                onClick={() => toggleSector(sector.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#00ff4c15] flex items-center justify-center">
                    <span className="text-[#00ff4c]">{sector.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{sector.name}</h3>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm ${
                          sector.trend === "bullish"
                            ? "text-[#00ff4c]"
                            : sector.trend === "bearish"
                              ? "text-red-500"
                              : "text-yellow-400"
                        }`}
                      >
                        {sector.trend.charAt(0).toUpperCase() + sector.trend.slice(1)}
                      </span>
                      <span className="text-gray-400 text-sm">|</span>
                      <span className="text-gray-400 text-sm">Market Cap: {sector.marketCap}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm text-gray-400">Confidence</div>
                    <div
                      className={`text-xl font-bold ${
                        sector.confidenceScore > 80
                          ? "text-[#00ff4c]"
                          : sector.confidenceScore > 60
                            ? "text-yellow-400"
                            : "text-red-500"
                      }`}
                    >
                      {sector.confidenceScore}%
                    </div>
                  </div>
                  {expandedSectors[sector.id] ? (
                    <ChevronUp size={20} className="text-[#00ff4c]" />
                  ) : (
                    <ChevronDown size={20} className="text-[#00ff4c]" />
                  )}
                </div>
              </div>

              {expandedSectors[sector.id] && (
                <div className="mt-6">
                  <div className="mb-4">
                    <p className="text-gray-300">{sector.description}</p>
                  </div>

                  <h4 className="text-lg font-semibold mb-3 text-[#00ff4c]">Top Assets</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {sector.keyAssets.slice(0, 3).map((asset, index) => {
                      // Get live market data if available
                      const liveData = marketData[asset.symbol]
                      const liveSentiment = sentimentData[asset.symbol]
                      const livePrediction = predictions[asset.symbol]

                      // Use live data if available, otherwise use static data
                      const price = liveData?.price ?? asset.price
                      const change = liveData?.changePercent ?? asset.change

                      return (
                        <div
                          key={index}
                          className="bg-[#00ff4c10] border border-[#00ff4c33] rounded-lg p-4 relative overflow-hidden"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h5 className="font-bold text-white">{asset.symbol}</h5>
                              <p className="text-sm text-gray-400">{asset.name}</p>
                            </div>
                            {change !== null && (
                              <div
                                className={`text-sm font-semibold ${change > 0 ? "text-[#00ff4c]" : "text-red-500"}`}
                              >
                                {change > 0 ? "+" : ""}
                                {typeof change === "number" ? change.toFixed(2) : change}%
                              </div>
                            )}
                          </div>

                          {price !== null && (
                            <div className="mb-3">
                              <div className="text-sm text-gray-400">Current Price</div>
                              <div className="text-lg font-bold text-white">
                                $
                                {typeof price === "number"
                                  ? price.toLocaleString(undefined, {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    })
                                  : "N/A"}
                              </div>
                            </div>
                          )}

                          {livePrediction && (
                            <div className="mb-3">
                              <div className="text-sm text-gray-400">Predicted Price</div>
                              <div
                                className={`text-lg font-bold ${livePrediction.predictedChange >= 0 ? "text-[#00ff4c]" : "text-red-500"}`}
                              >
                                $
                                {livePrediction.predictedPrice.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                                <span className="text-sm ml-1">
                                  ({livePrediction.predictedChange >= 0 ? "+" : ""}
                                  {livePrediction.predictedChangePercent.toFixed(2)}%)
                                </span>
                              </div>
                              <div className="text-xs text-gray-400">
                                Confidence: <span className="text-[#00ff4c]">{livePrediction.confidence}%</span>
                              </div>
                            </div>
                          )}

                          {liveSentiment && (
                            <div className="mb-3">
                              <div className="text-sm text-gray-400">Sentiment</div>
                              <div
                                className={`text-sm font-medium ${
                                  liveSentiment.overallSentiment === "positive"
                                    ? "text-[#00ff4c]"
                                    : liveSentiment.overallSentiment === "negative"
                                      ? "text-red-500"
                                      : "text-yellow-400"
                                }`}
                              >
                                {liveSentiment.overallSentiment.charAt(0).toUpperCase() +
                                  liveSentiment.overallSentiment.slice(1)}
                                <span className="ml-1">({liveSentiment.score.toFixed(1)})</span>
                              </div>
                            </div>
                          )}

                          <div className="mt-3">
                            <h6 className="text-sm font-semibold flex items-center gap-1 text-[#00ff4c]">
                              <Info size={14} /> Why We Selected This
                            </h6>
                            <p className="text-sm text-gray-300 mt-1">
                              {livePrediction?.supportingFactors?.[0] || getAssetRationale(sector.id, asset.symbol)}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Want <span className="text-[#00ff4c]">More Detailed</span> Predictions?
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            Access our full prediction platform with detailed analysis, historical accuracy tracking, and personalized
            alerts for all market sectors.
          </p>

          <Button
            className="bg-black border border-[#00ff4c] text-white hover:bg-[#00ff4c15] relative h-12 px-8"
            onClick={() => window.open("https://predictions.infinityxos.com", "_blank")}
          >
            <div className="absolute inset-0 shadow-[inset_0_0_8px_rgba(0,255,76,0.3)] pointer-events-none rounded-md"></div>
            <div className="flex items-center gap-2 z-10">
              <Zap size={16} className="text-[#00ff4c]" />
              <span>Access Full Predictions Platform</span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  )
}

// Helper function to generate rationales for asset selections
function getAssetRationale(sectorId: string, symbol: string): string {
  const rationales: Record<string, Record<string, string>> = {
    technology: {
      AAPL: "Strong technical indicators, positive sentiment analysis, and upcoming product launches suggest continued growth.",
      MSFT: "Cloud services growth, AI integration, and strong institutional buying patterns indicate bullish momentum.",
      NVDA: "Leading position in AI chips, high demand for GPUs, and exceptional earnings growth make this a top pick.",
    },
    healthcare: {
      JNJ: "Stable dividend history, diverse product portfolio, and defensive characteristics make this resilient in current market conditions.",
      UNH: "Strong earnings growth, expanding market share, and favorable healthcare policy environment support positive outlook.",
      PFE: "Undervalued based on P/E ratio, strong pipeline of new drugs, and increasing global healthcare demand.",
    },
    finance: {
      JPM: "Strong balance sheet, rising interest rate environment benefits, and effective cost management strategies.",
      BAC: "Increasing net interest income, strong consumer banking performance, and effective digital transformation.",
      V: "Global payment processing dominance, increasing transaction volumes, and expansion into emerging markets.",
    },
    energy: {
      XOM: "Strong cash flow generation, strategic investments in renewable energy, and favorable oil price environment.",
      CVX: "Disciplined capital allocation, high dividend yield, and strong position in natural gas markets.",
      NEE: "Leading position in renewable energy, supportive regulatory environment, and consistent earnings growth.",
    },
    "consumer-staples": {
      PG: "Defensive characteristics, strong brand portfolio, and effective pricing power in inflationary environment.",
      KO: "Global brand strength, recovery in away-from-home consumption, and successful product innovation.",
      WMT: "E-commerce growth, effective supply chain management, and resilient consumer demand for essentials.",
    },
    "consumer-discretionary": {
      AMZN: "E-commerce dominance, AWS growth, and strategic expansion into healthcare and other sectors.",
      TSLA: "Production scaling, improving margins, and leadership in the growing electric vehicle market.",
      HD: "Housing market resilience, professional contractor demand, and effective omnichannel strategy.",
    },
    industrials: {
      HON: "Strong aerospace recovery, automation solutions demand, and effective supply chain management.",
      UPS: "E-commerce shipping growth, pricing power, and effective cost management initiatives.",
      CAT: "Infrastructure spending benefits, mining sector recovery, and strong order backlog.",
    },
    materials: {
      LIN: "Industrial gas demand growth, pricing power, and strategic positioning for hydrogen economy.",
      FCX: "Copper demand for electrification, disciplined production growth, and strong free cash flow generation.",
      DOW: "Undervalued based on replacement cost, improving margins, and strategic portfolio optimization.",
    },
    "real-estate": {
      AMT: "5G infrastructure deployment, global expansion, and consistent dividend growth make this a defensive play.",
      PLD: "E-commerce logistics demand, limited new supply, and strategic positioning in key markets.",
      EQIX: "Data center demand growth, cloud computing expansion, and strong recurring revenue model.",
    },
    utilities: {
      NEE: "Renewable energy leadership, supportive regulatory environment, and consistent earnings growth.",
      DUK: "Stable regulated returns, clean energy transition investments, and reliable dividend growth.",
      SO: "Nuclear project completion, regulated rate base growth, and attractive dividend yield.",
    },
    "communication-services": {
      GOOGL: "Digital advertising dominance, AI integration, and cloud services growth support strong outlook.",
      META: "Engagement metrics improvement, effective monetization strategies, and metaverse potential.",
      NFLX: "Subscriber growth recovery, content slate strength, and effective international expansion.",
    },
    cryptocurrency: {
      BTC: "Institutional adoption, limited supply dynamics, and increasing mainstream acceptance support bullish case.",
      ETH: "Successful merge to proof-of-stake, DeFi ecosystem growth, and increasing transaction volumes.",
      SOL: "High transaction throughput, growing developer ecosystem, and institutional interest in alternative L1s.",
    },
    commodities: {
      GC: "Inflation hedge characteristics, central bank buying, and geopolitical uncertainty support gold prices.",
      CL: "Supply constraints, reopening demand, and disciplined OPEC+ production policies.",
      NG: "European energy crisis, LNG export growth, and seasonal demand patterns.",
    },
    forex: {
      "EUR/USD":
        "ECB hawkish pivot, improving Eurozone economic data, and potential USD weakness from Fed policy shift.",
      "USD/JPY": "Bank of Japan yield curve control, interest rate differential, and carry trade dynamics.",
      "GBP/USD": "Bank of England tightening cycle, improving UK economic outlook, and relative valuation metrics.",
    },
    bonds: {
      US10Y: "Inflation moderation, Fed policy pivot expectations, and safe haven demand in uncertain markets.",
      US30Y: "Long-term inflation expectations, pension fund demand, and relative value compared to other sovereigns.",
      DE10Y: "ECB policy normalization, fiscal discipline, and relative safety within European sovereign debt.",
    },
    etfs: {
      SPY: "Broad market exposure, economic resilience, and strong corporate earnings support positive outlook.",
      QQQ: "Technology sector leadership, innovation premium, and strong balance sheets of constituent companies.",
      VTI: "Diversified exposure, low expense ratio, and long-term growth of the US economy.",
    },
    "mutual-funds": {
      VFIAX: "Low-cost S&P 500 exposure, efficient tax management, and strong track record of performance.",
      FXAIX: "Broad market exposure, minimal tracking error, and strong institutional management.",
      PRMTX: "Growth stock focus, experienced management team, and strong long-term performance record.",
    },
    derivatives: {
      ES: "Efficient S&P 500 exposure, high liquidity, and effective hedging characteristics.",
      NQ: "Technology sector momentum, high beta characteristics, and strong institutional participation.",
      VIX: "Volatility hedging, market sentiment indicator, and portfolio diversification benefits.",
    },
  }

  // Default rationale if specific one not found
  return (
    rationales[sectorId]?.[symbol] ||
    "Selected based on technical analysis, fundamental strength, and favorable risk/reward profile in current market conditions."
  )
}
