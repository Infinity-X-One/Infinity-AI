"use client"

import { useState } from "react"
import { MarketTicker } from "@/components/market-ticker"
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  LineChart,
  Newspaper,
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
  ChevronUp,
  Info,
} from "lucide-react"

export function MarketPredictionsContent() {
  const [expandedSectors, setExpandedSectors] = useState<Record<string, boolean>>({
    technology: true,
    healthcare: false,
    finance: false,
    energy: false,
    consumer: false,
    industrial: false,
  })

  const toggleSector = (sector: string) => {
    setExpandedSectors((prev) => ({
      ...prev,
      [sector]: !prev[sector],
    }))
  }

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-black pt-[53px]">
      {/* Market Predictions Header */}
      <div className="sticky top-[53px] z-10 bg-black border-b border-[#00ff4c33] py-4 px-6">
        <h1 className="text-3xl font-bold text-white">Market Predictions</h1>
        <p className="text-gray-400 mt-1">AI-powered market forecasts with detailed analysis</p>
      </div>

      {/* Market Ticker */}
      <MarketTicker />

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Sectors */}
        <div className="grid grid-cols-1 gap-6">
          {/* Technology Sector */}
          <div className="bg-black border border-[#00ff4c33] rounded-lg overflow-hidden">
            <div
              className="flex justify-between items-center p-4 cursor-pointer hover:bg-[#00ff4c10]"
              onClick={() => toggleSector("technology")}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#00ff4c20] flex items-center justify-center">
                  <BarChart3 size={20} className="text-[#00ff4c]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Technology Sector</h2>
                  <p className="text-[#00ff4c]">+8.4% Predicted Growth</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white bg-[#00ff4c20] px-3 py-1 rounded-full text-sm">Bullish</span>
                {expandedSectors.technology ? (
                  <ChevronUp size={20} className="text-[#00ff4c]" />
                ) : (
                  <ChevronDown size={20} className="text-[#00ff4c]" />
                )}
              </div>
            </div>

            {expandedSectors.technology && (
              <div className="p-4 border-t border-[#00ff4c33]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* NVIDIA */}
                  <div className="bg-[#00ff4c10] rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-white">NVIDIA (NVDA)</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-white">$875.28</span>
                          <span className="text-[#00ff4c] flex items-center">
                            <ArrowUpRight size={14} />
                            3.5%
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">Predicted</p>
                        <p className="text-lg font-bold text-[#00ff4c]">$950.45</p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Confidence</span>
                        <span className="text-white">94%</span>
                      </div>
                      <div className="w-full bg-[#ffffff20] rounded-full h-2">
                        <div className="bg-[#00ff4c] h-2 rounded-full" style={{ width: "94%" }}></div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center gap-1 mb-2">
                        <Newspaper size={14} className="text-[#00ff4c]" />
                        <span className="text-sm font-medium text-white">Key Factors</span>
                      </div>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• Strong AI chip demand continues to outpace supply</li>
                        <li>• New data center partnerships announced with major cloud providers</li>
                        <li>• Upcoming product launch expected to expand market share</li>
                      </ul>
                    </div>
                  </div>

                  {/* Microsoft */}
                  <div className="bg-[#00ff4c10] rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-white">Microsoft (MSFT)</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-white">$412.65</span>
                          <span className="text-[#00ff4c] flex items-center">
                            <ArrowUpRight size={14} />
                            1.8%
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">Predicted</p>
                        <p className="text-lg font-bold text-[#00ff4c]">$445.80</p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Confidence</span>
                        <span className="text-white">92%</span>
                      </div>
                      <div className="w-full bg-[#ffffff20] rounded-full h-2">
                        <div className="bg-[#00ff4c] h-2 rounded-full" style={{ width: "92%" }}></div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center gap-1 mb-2">
                        <Newspaper size={14} className="text-[#00ff4c]" />
                        <span className="text-sm font-medium text-white">Key Factors</span>
                      </div>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• Azure cloud revenue growth exceeding expectations</li>
                        <li>• AI integration across product suite driving new adoption</li>
                        <li>• Enterprise spending on digital transformation remains strong</li>
                      </ul>
                    </div>
                  </div>

                  {/* Apple */}
                  <div className="bg-[#00ff4c10] rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-white">Apple (AAPL)</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-white">$187.42</span>
                          <span className="text-[#00ff4c] flex items-center">
                            <ArrowUpRight size={14} />
                            2.4%
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">Predicted</p>
                        <p className="text-lg font-bold text-[#00ff4c]">$205.30</p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Confidence</span>
                        <span className="text-white">89%</span>
                      </div>
                      <div className="w-full bg-[#ffffff20] rounded-full h-2">
                        <div className="bg-[#00ff4c] h-2 rounded-full" style={{ width: "89%" }}></div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center gap-1 mb-2">
                        <Newspaper size={14} className="text-[#00ff4c]" />
                        <span className="text-sm font-medium text-white">Key Factors</span>
                      </div>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• iPhone 16 sales projections higher than previous models</li>
                        <li>• Services revenue growing at accelerated pace</li>
                        <li>• New AI features expected to drive upgrade cycle</li>
                      </ul>
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="bg-[#00ff4c10] rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-white">Meta (META)</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-white">$485.39</span>
                          <span className="text-[#00ff4c] flex items-center">
                            <ArrowUpRight size={14} />
                            2.8%
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">Predicted</p>
                        <p className="text-lg font-bold text-[#00ff4c]">$510.25</p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Confidence</span>
                        <span className="text-white">88%</span>
                      </div>
                      <div className="w-full bg-[#ffffff20] rounded-full h-2">
                        <div className="bg-[#00ff4c] h-2 rounded-full" style={{ width: "88%" }}></div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center gap-1 mb-2">
                        <Newspaper size={14} className="text-[#00ff4c]" />
                        <span className="text-sm font-medium text-white">Key Factors</span>
                      </div>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• Ad revenue rebounding strongly after platform changes</li>
                        <li>• Reels engagement metrics outperforming competitors</li>
                        <li>• Cost-cutting measures improving profit margins</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-[#00ff4c08] rounded-lg border border-[#00ff4c20]">
                  <div className="flex items-center gap-2 mb-3">
                    <Info size={16} className="text-[#00ff4c]" />
                    <h4 className="text-white font-medium">Sector Analysis</h4>
                  </div>
                  <p className="text-gray-300 text-sm">
                    The technology sector is projected to outperform the broader market with an 8.4% growth over the
                    next quarter. Key drivers include continued AI adoption, cloud infrastructure expansion, and
                    enterprise digital transformation initiatives. Semiconductor companies are particularly
                    well-positioned due to ongoing chip demand for AI applications. Recent positive earnings surprises
                    from major players have reinforced bullish sentiment across the sector.
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div className="bg-[#00ff4c10] p-3 rounded-lg">
                      <p className="text-xs text-gray-400">News Sentiment</p>
                      <p className="text-lg font-bold text-[#00ff4c]">Very Positive</p>
                    </div>
                    <div className="bg-[#00ff4c10] p-3 rounded-lg">
                      <p className="text-xs text-gray-400">Technical Signals</p>
                      <p className="text-lg font-bold text-[#00ff4c]">Strong Buy</p>
                    </div>
                    <div className="bg-[#00ff4c10] p-3 rounded-lg">
                      <p className="text-xs text-gray-400">Institutional Flow</p>
                      <p className="text-lg font-bold text-[#00ff4c]">Net Positive</p>
                    </div>
                    <div className="bg-[#00ff4c10] p-3 rounded-lg">
                      <p className="text-xs text-gray-400">Volatility</p>
                      <p className="text-lg font-bold text-white">Moderate</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Healthcare Sector */}
          <div className="bg-black border border-[#00ff4c33] rounded-lg overflow-hidden">
            <div
              className="flex justify-between items-center p-4 cursor-pointer hover:bg-[#00ff4c10]"
              onClick={() => toggleSector("healthcare")}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#00ff4c20] flex items-center justify-center">
                  <LineChart size={20} className="text-[#00ff4c]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Healthcare Sector</h2>
                  <p className="text-[#00ff4c]">+5.2% Predicted Growth</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white bg-[#00ff4c20] px-3 py-1 rounded-full text-sm">Bullish</span>
                {expandedSectors.healthcare ? (
                  <ChevronUp size={20} className="text-[#00ff4c]" />
                ) : (
                  <ChevronDown size={20} className="text-[#00ff4c]" />
                )}
              </div>
            </div>

            {expandedSectors.healthcare && (
              <div className="p-4 border-t border-[#00ff4c33]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* UnitedHealth */}
                  <div className="bg-[#00ff4c10] rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-white">UnitedHealth (UNH)</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-white">$528.36</span>
                          <span className="text-[#00ff4c] flex items-center">
                            <ArrowUpRight size={14} />
                            1.5%
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">Predicted</p>
                        <p className="text-lg font-bold text-[#00ff4c]">$565.75</p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Confidence</span>
                        <span className="text-white">81%</span>
                      </div>
                      <div className="w-full bg-[#ffffff20] rounded-full h-2">
                        <div className="bg-[#00ff4c] h-2 rounded-full" style={{ width: "81%" }}></div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center gap-1 mb-2">
                        <Newspaper size={14} className="text-[#00ff4c]" />
                        <span className="text-sm font-medium text-white">Key Factors</span>
                      </div>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• Medicare Advantage enrollment exceeding expectations</li>
                        <li>• Optum Health division showing strong growth</li>
                        <li>• Favorable regulatory environment expected</li>
                      </ul>
                    </div>
                  </div>

                  {/* Johnson & Johnson */}
                  <div className="bg-[#00ff4c10] rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-white">Johnson & Johnson (JNJ)</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-white">$147.89</span>
                          <span className="text-red-500 flex items-center">
                            <ArrowDownRight size={14} />
                            0.7%
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">Predicted</p>
                        <p className="text-lg font-bold text-red-500">$142.30</p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Confidence</span>
                        <span className="text-white">68%</span>
                      </div>
                      <div className="w-full bg-[#ffffff20] rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: "68%" }}></div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center gap-1 mb-2">
                        <Newspaper size={14} className="text-red-500" />
                        <span className="text-sm font-medium text-white">Key Factors</span>
                      </div>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• Ongoing litigation concerns weighing on outlook</li>
                        <li>• Pipeline development slower than competitors</li>
                        <li>• Increased competition in key therapeutic areas</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-[#00ff4c08] rounded-lg border border-[#00ff4c20]">
                  <div className="flex items-center gap-2 mb-3">
                    <Info size={16} className="text-[#00ff4c]" />
                    <h4 className="text-white font-medium">Sector Analysis</h4>
                  </div>
                  <p className="text-gray-300 text-sm">
                    The healthcare sector is expected to see moderate growth of 5.2% in the coming quarter, driven
                    primarily by health insurers and medical technology companies. Pharmaceutical companies face mixed
                    outlooks due to patent cliffs and pricing pressures, while healthcare providers benefit from stable
                    demand and improving margins. Recent policy developments suggest a favorable environment for managed
                    care organizations.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Finance Sector */}
          <div className="bg-black border border-[#00ff4c33] rounded-lg overflow-hidden">
            <div
              className="flex justify-between items-center p-4 cursor-pointer hover:bg-[#00ff4c10]"
              onClick={() => toggleSector("finance")}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#00ff4c20] flex items-center justify-center">
                  <TrendingUp size={20} className="text-[#00ff4c]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Finance Sector</h2>
                  <p className="text-[#00ff4c]">+3.8% Predicted Growth</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white bg-[#00ff4c20] px-3 py-1 rounded-full text-sm">Moderately Bullish</span>
                {expandedSectors.finance ? (
                  <ChevronUp size={20} className="text-[#00ff4c]" />
                ) : (
                  <ChevronDown size={20} className="text-[#00ff4c]" />
                )}
              </div>
            </div>

            {expandedSectors.finance && (
              <div className="p-4 border-t border-[#00ff4c33]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* JPMorgan */}
                  <div className="bg-[#00ff4c10] rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-white">JPMorgan (JPM)</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-white">$198.54</span>
                          <span className="text-red-500 flex items-center">
                            <ArrowDownRight size={14} />
                            0.5%
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">Predicted</p>
                        <p className="text-lg font-bold text-yellow-400">$201.20</p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Confidence</span>
                        <span className="text-white">62%</span>
                      </div>
                      <div className="w-full bg-[#ffffff20] rounded-full h-2">
                        <div className="bg-yellow-400 h-2 rounded-full" style={{ width: "62%" }}></div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center gap-1 mb-2">
                        <Newspaper size={14} className="text-yellow-400" />
                        <span className="text-sm font-medium text-white">Key Factors</span>
                      </div>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• Net interest income stabilizing as rates plateau</li>
                        <li>• Investment banking revenue showing signs of recovery</li>
                        <li>• Concerns about commercial real estate exposure</li>
                      </ul>
                    </div>
                  </div>

                  {/* Visa */}
                  <div className="bg-[#00ff4c10] rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-white">Visa (V)</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-white">$275.63</span>
                          <span className="text-[#00ff4c] flex items-center">
                            <ArrowUpRight size={14} />
                            0.9%
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">Predicted</p>
                        <p className="text-lg font-bold text-[#00ff4c]">$290.10</p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Confidence</span>
                        <span className="text-white">79%</span>
                      </div>
                      <div className="w-full bg-[#ffffff20] rounded-full h-2">
                        <div className="bg-[#00ff4c] h-2 rounded-full" style={{ width: "79%" }}></div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center gap-1 mb-2">
                        <Newspaper size={14} className="text-[#00ff4c]" />
                        <span className="text-sm font-medium text-white">Key Factors</span>
                      </div>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• Cross-border transaction volumes continue to grow</li>
                        <li>• Digital payment adoption accelerating globally</li>
                        <li>• New partnerships expanding market reach</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-[#00ff4c08] rounded-lg border border-[#00ff4c20]">
                  <div className="flex items-center gap-2 mb-3">
                    <Info size={16} className="text-[#00ff4c]" />
                    <h4 className="text-white font-medium">Sector Analysis</h4>
                  </div>
                  <p className="text-gray-300 text-sm">
                    The finance sector is projected to see modest growth of 3.8% in the next quarter. Payment processors
                    and fintech companies are expected to outperform traditional banks, which face headwinds from net
                    interest margin compression as interest rates stabilize. Consumer credit quality remains strong,
                    though commercial real estate exposure presents risks for some institutions. Asset managers are
                    benefiting from market appreciation, while insurance companies face mixed outlooks depending on
                    their specific business lines.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Energy Sector */}
          <div className="bg-black border border-[#00ff4c33] rounded-lg overflow-hidden">
            <div
              className="flex justify-between items-center p-4 cursor-pointer hover:bg-[#00ff4c10]"
              onClick={() => toggleSector("energy")}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#00ff4c20] flex items-center justify-center">
                  <TrendingDown size={20} className="text-red-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Energy Sector</h2>
                  <p className="text-red-500">-2.1% Predicted Decline</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white bg-red-500/20 px-3 py-1 rounded-full text-sm">Bearish</span>
                {expandedSectors.energy ? (
                  <ChevronUp size={20} className="text-red-500" />
                ) : (
                  <ChevronDown size={20} className="text-red-500" />
                )}
              </div>
            </div>

            {expandedSectors.energy && (
              <div className="p-4 border-t border-[#00ff4c33]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Exxon Mobil */}
                  <div className="bg-[#00ff4c10] rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-white">Exxon Mobil (XOM)</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-white">$113.24</span>
                          <span className="text-red-500 flex items-center">
                            <ArrowDownRight size={14} />
                            1.8%
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">Predicted</p>
                        <p className="text-lg font-bold text-red-500">$105.60</p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Confidence</span>
                        <span className="text-white">72%</span>
                      </div>
                      <div className="w-full bg-[#ffffff20] rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: "72%" }}></div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center gap-1 mb-2">
                        <Newspaper size={14} className="text-red-500" />
                        <span className="text-sm font-medium text-white">Key Factors</span>
                      </div>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• Oil price forecasts trending lower on demand concerns</li>
                        <li>• Refining margins under pressure</li>
                        <li>• Regulatory headwinds increasing</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-[#00ff4c08] rounded-lg border border-[#00ff4c20]">
                  <div className="flex items-center gap-2 mb-3">
                    <Info size={16} className="text-red-500" />
                    <h4 className="text-white font-medium">Sector Analysis</h4>
                  </div>
                  <p className="text-gray-300 text-sm">
                    The energy sector is projected to decline by 2.1% in the coming quarter due to weakening global
                    demand forecasts and increasing supply. Oil prices are expected to face downward pressure as
                    economic growth concerns weigh on consumption outlooks. Renewable energy companies within the sector
                    show more resilience, though they face their own challenges with rising interest rates affecting
                    project economics.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Consumer Sector */}
          <div className="bg-black border border-[#00ff4c33] rounded-lg overflow-hidden">
            <div
              className="flex justify-between items-center p-4 cursor-pointer hover:bg-[#00ff4c10]"
              onClick={() => toggleSector("consumer")}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#00ff4c20] flex items-center justify-center">
                  <TrendingUp size={20} className="text-[#00ff4c]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Consumer Sector</h2>
                  <p className="text-[#00ff4c]">+4.2% Predicted Growth</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white bg-[#00ff4c20] px-3 py-1 rounded-full text-sm">Bullish</span>
                {expandedSectors.consumer ? (
                  <ChevronUp size={20} className="text-[#00ff4c]" />
                ) : (
                  <ChevronDown size={20} className="text-[#00ff4c]" />
                )}
              </div>
            </div>

            {expandedSectors.consumer && (
              <div className="p-4 border-t border-[#00ff4c33]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Amazon */}
                  <div className="bg-[#00ff4c10] rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-white">Amazon (AMZN)</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-white">$178.92</span>
                          <span className="text-[#00ff4c] flex items-center">
                            <ArrowUpRight size={14} />
                            1.2%
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">Predicted</p>
                        <p className="text-lg font-bold text-[#00ff4c]">$195.40</p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Confidence</span>
                        <span className="text-white">82%</span>
                      </div>
                      <div className="w-full bg-[#ffffff20] rounded-full h-2">
                        <div className="bg-[#00ff4c] h-2 rounded-full" style={{ width: "82%" }}></div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center gap-1 mb-2">
                        <Newspaper size={14} className="text-[#00ff4c]" />
                        <span className="text-sm font-medium text-white">Key Factors</span>
                      </div>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• AWS growth accelerating after recent slowdown</li>
                        <li>• E-commerce market share continuing to expand</li>
                        <li>• Advertising revenue becoming significant contributor</li>
                      </ul>
                    </div>
                  </div>

                  {/* Walmart */}
                  <div className="bg-[#00ff4c10] rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-white">Walmart (WMT)</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-white">$68.92</span>
                          <span className="text-[#00ff4c] flex items-center">
                            <ArrowUpRight size={14} />
                            1.1%
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">Predicted</p>
                        <p className="text-lg font-bold text-[#00ff4c]">$74.50</p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Confidence</span>
                        <span className="text-white">84%</span>
                      </div>
                      <div className="w-full bg-[#ffffff20] rounded-full h-2">
                        <div className="bg-[#00ff4c] h-2 rounded-full" style={{ width: "84%" }}></div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center gap-1 mb-2">
                        <Newspaper size={14} className="text-[#00ff4c]" />
                        <span className="text-sm font-medium text-white">Key Factors</span>
                      </div>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• Value-focused consumers driving traffic growth</li>
                        <li>• E-commerce initiatives gaining traction</li>
                        <li>• Grocery segment outperforming competitors</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
