"use client"

import { ChevronRight, TrendingUp, TrendingDown } from "lucide-react"
import type { Sector } from "@/types/sector"

interface SectorCardProps {
  sector: Sector
  onClick?: () => void
  onExplore?: (sectorId: string) => void
}

export default function SectorCard({ sector, onClick, onExplore }: SectorCardProps) {
  // Use the trend property to determine if positive
  const isPositive = sector.trend === "bullish"

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else if (onExplore) {
      onExplore(sector.id)
    }
  }

  return (
    <div
      className="bg-black border border-[#00ff4c33] rounded-lg p-4 cursor-pointer hover:border-[#00ff4c] transition-colors duration-200 relative overflow-hidden group"
      onClick={handleClick}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#00ff4c05] to-[#00ff4c15] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-medium text-white">{sector.name}</h3>
          <div className={`flex items-center ${isPositive ? "text-[#00ff4c]" : "text-red-500"}`}>
            {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          </div>
        </div>

        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">Confidence Score</span>
            <span className={`font-medium ${isPositive ? "text-[#00ff4c]" : "text-red-500"}`}>
              {sector.confidenceScore}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-800 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full ${isPositive ? "bg-[#00ff4c]" : "bg-red-500"}`}
              style={{ width: `${sector.confidenceScore}%` }}
            ></div>
          </div>
        </div>

        <div className="text-xs text-gray-400 mb-3">
          Top assets:{" "}
          {sector.keyAssets
            .slice(0, 3)
            .map((asset) => asset.symbol)
            .join(", ")}
          {sector.keyAssets.length > 3 && "..."}
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xs text-[#00ff4c]">View analysis</span>
          <ChevronRight size={16} className="text-[#00ff4c]" />
        </div>
      </div>
    </div>
  )
}
