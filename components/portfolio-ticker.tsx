"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

type PortfolioData = {
  id: string
  name: string
  performance: number
  lastUpdated: string
}

export function PortfolioTicker() {
  const [portfolios, setPortfolios] = useState<PortfolioData[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Mock data - in a real app, this would come from an API
    const mockPortfolios: PortfolioData[] = [
      { id: "1", name: "Infinity AI", performance: 12.4, lastUpdated: "2m ago" },
      { id: "2", name: "Tech Strategy", performance: 18.7, lastUpdated: "5m ago" },
      { id: "3", name: "Value Stocks", performance: 8.2, lastUpdated: "10m ago" },
      { id: "4", name: "Growth Strategy", performance: 15.3, lastUpdated: "3m ago" },
      { id: "5", name: "Dividend Portfolio", performance: 6.8, lastUpdated: "7m ago" },
      { id: "6", name: "AI & Robotics", performance: 22.5, lastUpdated: "1m ago" },
      { id: "7", name: "Healthcare Focus", performance: -3.2, lastUpdated: "15m ago" },
      { id: "8", name: "Energy Sector", performance: 4.1, lastUpdated: "8m ago" },
      { id: "9", name: "Financial Services", performance: 9.6, lastUpdated: "4m ago" },
      { id: "10", name: "Real Estate", performance: -1.7, lastUpdated: "12m ago" },
    ]

    setPortfolios(mockPortfolios)

    // Set up automatic scrolling for the ticker
    const scrollContainer = scrollRef.current
    if (scrollContainer) {
      const scrollWidth = scrollContainer.scrollWidth
      const clientWidth = scrollContainer.clientWidth

      if (scrollWidth > clientWidth) {
        let scrollPos = 0
        const scrollInterval = setInterval(() => {
          scrollPos += 1
          if (scrollPos >= scrollWidth / 2) {
            scrollPos = 0
          }
          scrollContainer.scrollLeft = scrollPos
        }, 30)

        return () => clearInterval(scrollInterval)
      }
    }
  }, [])

  return (
    <div className="fixed top-16 left-0 right-0 z-10 bg-black border-b border-[#00ff4c]/30 py-2 px-4">
      <div ref={scrollRef} className="overflow-x-hidden whitespace-nowrap">
        <div className="inline-block animate-marquee">
          {portfolios.concat(portfolios).map((portfolio, index) => (
            <div key={`${portfolio.id}-${index}`} className="inline-block mx-4">
              <span className="font-semibold text-gray-300">{portfolio.name}:</span>
              <span className={`ml-2 font-mono ${portfolio.performance >= 0 ? "text-[#00ff4c]" : "text-red-500"}`}>
                {portfolio.performance >= 0 ? (
                  <ArrowUpRight className="inline mr-1" size={14} />
                ) : (
                  <ArrowDownRight className="inline mr-1" size={14} />
                )}
                {Math.abs(portfolio.performance).toFixed(1)}%
              </span>
              <span className="ml-2 text-xs text-gray-500">{portfolio.lastUpdated}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
