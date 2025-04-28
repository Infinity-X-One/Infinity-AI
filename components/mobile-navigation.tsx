"use client"

import { Home, Heart, BarChart3, CheckCircle, Bot } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

interface MobileNavigationProps {
  toggleSidebar: () => void
}

export default function MobileNavigation({ toggleSidebar }: MobileNavigationProps) {
  const router = useRouter()
  const [activeRoute, setActiveRoute] = useState("/")

  // Update active route when path changes
  useEffect(() => {
    setActiveRoute(window.location.pathname)
  }, [])

  const navigate = (path: string) => {
    // Set loading state via a custom event
    window.dispatchEvent(new CustomEvent("startLoading"))

    // Navigate after a small delay
    setTimeout(() => {
      router.push(path)
    }, 50)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-[#00ff4c33] h-14 flex justify-around items-center z-50 sm:hidden">
      <button
        onClick={() => navigate("/")}
        className={`flex flex-col items-center justify-center h-full w-full ${activeRoute === "/" ? "text-[#00ff4c]" : "text-white"}`}
      >
        <Home size={20} />
        <span className="text-xs mt-1">Home</span>
      </button>

      <button
        onClick={() => navigate("/sentiment")}
        className={`flex flex-col items-center justify-center h-full w-full ${activeRoute === "/sentiment" ? "text-[#00ff4c]" : "text-white"}`}
      >
        <Heart size={20} />
        <span className="text-xs mt-1">Sentiment</span>
      </button>

      <button
        onClick={() => navigate("/predictions")}
        className={`flex flex-col items-center justify-center h-full w-full ${activeRoute === "/predictions" ? "text-[#00ff4c]" : "text-white"}`}
      >
        <BarChart3 size={20} />
        <span className="text-xs mt-1">Predict</span>
      </button>

      <button
        onClick={() => navigate("/proof")}
        className={`flex flex-col items-center justify-center h-full w-full ${activeRoute === "/proof" ? "text-[#00ff4c]" : "text-white"}`}
      >
        <CheckCircle size={20} />
        <span className="text-xs mt-1">Proof</span>
      </button>

      <button onClick={toggleSidebar} className="flex flex-col items-center justify-center h-full w-full text-white">
        <Bot size={20} />
        <span className="text-xs mt-1">Menu</span>
      </button>
    </div>
  )
}
