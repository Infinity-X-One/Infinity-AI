"use client"

import { Infinity } from "lucide-react"

interface LogoProps {
  onClick?: () => void
}

export default function Logo({ onClick }: LogoProps) {
  return (
    <div
      className="flex items-center transition-opacity hover:opacity-80"
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label="Go to home page"
    >
      {/* Standard infinity icon from Lucide with enhanced horizontal oval green glow */}
      <div className="relative mr-2 sm:mr-4">
        {/* Enhanced horizontal oval lime green glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0"
          style={{
            width: "55%",
            height: "35%",
            backgroundColor: "#00ff4c",
            borderRadius: "50%",
            filter: "blur(6px)",
            opacity: 0.7,
            boxShadow: "0 0 10px 2px rgba(0, 255, 76, 0.6)",
          }}
        ></div>
        <div className="relative z-10">
          {/* Standard infinity icon from Lucide library with thinner lines */}
          <Infinity size={28} className="text-white sm:hidden" strokeWidth={1} />
          <Infinity size={40} className="text-white hidden sm:block" strokeWidth={1} />
        </div>
      </div>

      {/* Text logo */}
      <div className="flex items-baseline -ml-1 sm:-ml-2">
        <span className="font-bold text-white text-lg sm:text-2xl">Infinity</span>
        <span className="font-bold text-[#00ff4c] ml-1 text-lg sm:text-2xl drop-shadow-[0_0_8px_rgba(0,255,76,1)]">
          X One
        </span>
      </div>
    </div>
  )
}
