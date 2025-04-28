"use client"
import { useEffect, useState } from "react"

export default function LoadingScreen() {
  const [loadingText, setLoadingText] = useState("Loading")

  // Animate the loading text
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingText((prev) => {
        if (prev === "Loading...") return "Loading"
        if (prev === "Loading..") return "Loading..."
        if (prev === "Loading.") return "Loading.."
        return "Loading."
      })
    }, 300)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black z-50 p-4 sm:p-0">
      <div className="w-24 h-24 sm:w-32 sm:h-32 relative">
        {/* Black overlay to prevent any content from showing through */}
        {/* <div className="absolute inset-0 bg-black"></div>

        <div className="hexagon-grid"></div>
        <div className="hexagon-overlay"></div>
        <div className="hexagon-glow"></div>

        <div className="relative mb-8 z-10"> */}
        {/* Pulsing glow effect */}
        {/* <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-8 bg-[#00ff4c] rounded-full opacity-30 animate-pulse"
            style={{ filter: "blur(15px)" }}
          ></div> */}

        {/* Infinity icon with rotation animation */}
        {/* <div className="animate-pulse">
            <Infinity size={80} className="text-white relative z-10" strokeWidth={1.5} />
          </div>
        </div> */}
      </div>

      <h2 className="text-[#00ff4c] text-xl sm:text-2xl font-bold mt-6 text-center">{loadingText || "Loading..."}</h2>

      {/* Loading bar */}
      {/* <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden z-10">
        <div
          className="h-full bg-gradient-to-r from-[#00ff4c] to-[#39ff14]"
          style={{
            width: "100%",
            animation: "loadingProgress 2s infinite",
          }}
        ></div>
      </div>

      <style jsx>{`
        @keyframes loadingProgress {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style> */}
    </div>
  )
}
