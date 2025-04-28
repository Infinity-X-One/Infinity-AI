"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Plus,
  MessageSquare,
  Settings,
  ChevronDown,
  BarChart3,
  LineChart,
  TrendingDown,
  Newspaper,
  CandlestickChart,
  Wrench,
  CheckCircle,
  BarChart2,
  TrendingUp,
  GitBranch,
  BookOpen,
  Bot,
  Home,
  Heart,
  PieChartIcon as ChartPie,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useMobile } from "@/hooks/use-mobile"
import SidebarBotDropdown from "@/components/sidebar-bot-dropdown"
import SettingsModal from "@/components/settings-modal"

interface SidebarProps {
  setCurrentView: (
    view: "chat" | "predictions" | "analyze" | "short-strategy" | "option-strategy" | "critical-news" | "web-scraper",
  ) => void
  currentView:
    | "chat"
    | "predictions"
    | "analyze"
    | "short-strategy"
    | "option-strategy"
    | "critical-news"
    | "web-scraper"
}

export default function Sidebar({ setCurrentView, currentView }: SidebarProps) {
  const [chats, setChats] = useState([{ id: 1, name: "New Chat 1" }])
  const isMobile = useMobile()
  const router = useRouter()
  const [settingsOpen, setSettingsOpen] = useState(false)

  const handleViewChange = (
    view: "chat" | "predictions" | "analyze" | "short-strategy" | "option-strategy" | "critical-news" | "web-scraper",
  ) => {
    // Always trigger loading state first
    window.dispatchEvent(new CustomEvent("startLoading"))

    // Small delay to ensure loading screen appears before any state changes
    setTimeout(() => {
      setCurrentView(view)
      // Close sidebar on mobile after selection
      if (isMobile) {
        const event = new CustomEvent("closeSidebar")
        window.dispatchEvent(event)
      }
    }, 50)
  }

  const navigateToHome = () => {
    // Set loading state via a custom event
    window.dispatchEvent(new CustomEvent("startLoading"))

    // Navigate after a small delay
    setTimeout(() => {
      router.push("/")
      handleViewChange("chat")
    }, 50)
  }

  const navigateToSentiment = () => {
    // Set loading state via a custom event
    window.dispatchEvent(new CustomEvent("startLoading"))

    // Navigate after a small delay
    setTimeout(() => {
      router.push("/sentiment")
    }, 50)
  }

  const navigateToLearn = () => {
    // Set loading state via a custom event
    window.dispatchEvent(new CustomEvent("startLoading"))

    // Navigate after a small delay
    setTimeout(() => {
      router.push("/learn")
    }, 50)
  }

  const navigateToProof = () => {
    // Set loading state via a custom event
    window.dispatchEvent(new CustomEvent("startLoading"))

    // Navigate after a small delay
    setTimeout(() => {
      router.push("/proof")
    }, 50)
  }

  const navigateToBots = () => {
    // Set loading state via a custom event
    window.dispatchEvent(new CustomEvent("startLoading"))

    // Navigate after a small delay
    setTimeout(() => {
      router.push("/bots")
    }, 50)
  }

  const navigateToBotBuilder = () => {
    // Set loading state via a custom event
    window.dispatchEvent(new CustomEvent("startLoading"))

    // Navigate after a small delay
    setTimeout(() => {
      router.push("/bot-builder")
    }, 50)
  }

  const navigateToWorkflows = () => {
    // Set loading state via a custom event
    window.dispatchEvent(new CustomEvent("startLoading"))

    // Navigate after a small delay
    setTimeout(() => {
      router.push("/workflows")
    }, 50)
  }

  const navigateToSectors = () => {
    // Set loading state via a custom event
    window.dispatchEvent(new CustomEvent("startLoading"))

    // Navigate after a small delay
    setTimeout(() => {
      router.push("/sectors")
    }, 50)
  }

  const navigateToPredictions = () => {
    // Set loading state via a custom event
    window.dispatchEvent(new CustomEvent("startLoading"))

    // Navigate after a small delay
    setTimeout(() => {
      router.push("/predictions")
    }, 50)
  }

  return (
    <div className="flex flex-col h-full bg-black border-r border-[#00ff4c33] overflow-y-auto pt-[53px] relative">
      <div className="absolute inset-0 bg-black z-0"></div>

      {/* Top padding */}
      <div className="pt-4"></div>

      {/* Home Button - Updated with proper navigation */}
      <div className="p-2 mt-12 z-10 relative">
        <Button
          className="w-full bg-black border border-[#00ff4c] text-white hover:bg-[#00ff4c15] relative h-10 sm:h-12"
          onClick={navigateToHome}
        >
          <div className="absolute inset-0 shadow-[inset_0_0_8px_rgba(0,255,76,0.3)] pointer-events-none rounded-md"></div>
          <div className="flex items-center gap-2 z-10">
            <Home size={16} className="text-[#00ff4c]" />
            <span>Home</span>
          </div>
        </Button>
      </div>

      {/* Learn Button */}
      <div className="p-2 z-10 relative mt-3">
        <Button
          className="w-full bg-black border border-[#00ff4c] text-white hover:bg-[#00ff4c15] relative h-10 sm:h-12"
          onClick={navigateToLearn}
        >
          <div className="absolute inset-0 shadow-[inset_0_0_8px_rgba(0,255,76,0.3)] pointer-events-none rounded-md"></div>
          <div className="flex items-center gap-2 z-10">
            <BookOpen size={16} className="text-[#00ff4c]" />
            <span>Learn</span>
          </div>
        </Button>
      </div>

      {/* Prediction Button */}
      <div className="p-2 z-10 relative mt-3">
        <Button
          className="w-full bg-black border border-[#00ff4c] text-white hover:bg-[#00ff4c15] relative h-10 sm:h-12"
          onClick={navigateToPredictions}
        >
          <div className="absolute inset-0 shadow-[inset_0_0_8px_rgba(0,255,76,0.3)] pointer-events-none rounded-md"></div>
          <div className="flex items-center gap-2 z-10">
            <BarChart3 size={16} className="text-[#00ff4c]" />
            <span>Prediction</span>
          </div>
        </Button>
      </div>

      {/* Sentiment Button - NEW */}
      <div className="p-2 z-10 relative mt-3">
        <Button
          className="w-full bg-black border border-[#00ff4c] text-white hover:bg-[#00ff4c15] relative h-10 sm:h-12"
          onClick={navigateToSentiment}
        >
          <div className="absolute inset-0 shadow-[inset_0_0_8px_rgba(0,255,76,0.3)] pointer-events-none rounded-md"></div>
          <div className="flex items-center gap-2 z-10">
            <Heart size={16} className="text-[#00ff4c]" />
            <span>Sentiment</span>
          </div>
        </Button>
      </div>

      {/* Proof Button - FIXED */}
      <div className="p-2 z-10 relative mt-3">
        <Button
          className="w-full bg-black border border-[#00ff4c] text-white hover:bg-[#00ff4c15] relative h-10 sm:h-12"
          onClick={navigateToProof}
        >
          <div className="absolute inset-0 shadow-[inset_0_0_8px_rgba(0,255,76,0.3)] pointer-events-none rounded-md"></div>
          <div className="flex items-center gap-2 z-10">
            <CheckCircle size={16} className="text-[#00ff4c]" />
            <span>Proof</span>
          </div>
        </Button>
      </div>

      {/* Market Data Button */}
      <div className="p-2 z-10 relative mt-3">
        <Button
          className="w-full bg-black border border-[#00ff4c] text-white hover:bg-[#00ff4c15] relative h-10 sm:h-12"
          onClick={() => handleViewChange("analyze")}
        >
          <div className="absolute inset-0 shadow-[inset_0_0_8px_rgba(0,255,76,0.3)] pointer-events-none rounded-md"></div>
          <div className="flex items-center gap-2 z-10">
            <BarChart2 size={16} className="text-[#00ff4c]" />
            <span>Market Data</span>
          </div>
        </Button>
      </div>

      {/* Paper Trading Tools Button */}
      <div className="p-2 z-10 relative mt-3">
        <Button className="w-full bg-black border border-[#00ff4c] text-white hover:bg-[#00ff4c15] relative h-10 sm:h-12">
          <div className="absolute inset-0 shadow-[inset_0_0_8px_rgba(0,255,76,0.3)] pointer-events-none rounded-md"></div>
          <div className="flex items-center gap-2 z-10">
            <TrendingUp size={16} className="text-[#00ff4c]" />
            <span>Paper Trading</span>
          </div>
        </Button>
      </div>

      <div className="p-2 z-10 relative mt-3">
        <Button
          className="w-full bg-black border border-[#00ff4c] text-white hover:bg-[#00ff4c15] relative h-10 sm:h-12"
          onClick={navigateToSectors}
        >
          <div className="absolute inset-0 shadow-[inset_0_0_8px_rgba(0,255,76,0.3)] pointer-events-none rounded-md"></div>
          <div className="flex items-center gap-2 z-10">
            <ChartPie size={16} className="text-[#00ff4c]" />
            <span>Sectors</span>
          </div>
        </Button>
      </div>

      {/* Strategies Button - moved to above Tools */}
      <div className="p-2 z-10 relative mt-3">
        <Button
          className="w-full bg-black border border-[#00ff4c] text-white hover:bg-[#00ff4c15] relative h-10 sm:h-12"
          onClick={() => handleViewChange("short-strategy")}
        >
          <div className="absolute inset-0 shadow-[inset_0_0_8px_rgba(0,255,76,0.3)] pointer-events-none rounded-md"></div>
          <div className="flex items-center gap-2 z-10">
            <GitBranch size={16} className="text-[#00ff4c]" />
            <span>Strategies</span>
          </div>
        </Button>
      </div>

      {/* AI Bots Dropdown Button - UPDATED */}
      <div className="p-2 z-10 relative mt-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="w-full bg-black border border-[#00ff4c] text-white hover:bg-[#00ff4c15] relative h-10 sm:h-12">
              <div className="absolute inset-0 shadow-[inset_0_0_8px_rgba(0,255,76,0.3)] pointer-events-none"></div>
              <div className="flex items-center justify-between w-full">
                <span className="flex items-center gap-2">
                  <Bot size={16} className="text-[#00ff4c]" />
                  <span>AI Bots</span>
                </span>
                <ChevronDown size={14} />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-black border-[#00ff4c33] backdrop-blur-sm w-48">
            <SidebarBotDropdown />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Tools Button with Dropdown */}
      <div className="p-2 z-10 relative mt-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="w-full bg-black border border-[#00ff4c] text-white hover:bg-[#00ff4c15] relative h-10 sm:h-12">
              <div className="absolute inset-0 shadow-[inset_0_0_8px_rgba(0,255,76,0.3)] pointer-events-none"></div>
              <div className="flex items-center justify-between w-full">
                <span className="flex items-center gap-2">
                  <Wrench size={16} className="text-[#00ff4c]" />
                  <span>Tools</span>
                </span>
                <ChevronDown size={14} />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-black border-[#00ff4c33] backdrop-blur-sm w-48">
            <DropdownMenuItem
              className="text-white hover:text-[#00ff4c] hover:bg-[#00ff4c15] cursor-pointer"
              onClick={navigateToPredictions}
            >
              <BarChart3 size={16} className="mr-2" /> Predictions
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-white hover:text-[#00ff4c] hover:bg-[#00ff4c15] cursor-pointer"
              onClick={() => handleViewChange("analyze")}
            >
              <LineChart size={16} className="mr-2" /> Market Analysis
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-white hover:text-[#00ff4c] hover:bg-[#00ff4c15] cursor-pointer"
              onClick={navigateToSentiment}
            >
              <Heart size={16} className="mr-2" /> Sentiment Analysis
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-white hover:text-[#00ff4c] hover:bg-[#00ff4c15] cursor-pointer"
              onClick={() => handleViewChange("short-strategy")}
            >
              <TrendingDown size={16} className="mr-2" /> Short Strategy
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-white hover:text-[#00ff4c] hover:bg-[#00ff4c15] cursor-pointer"
              onClick={() => handleViewChange("option-strategy")}
            >
              <CandlestickChart size={16} className="mr-2" /> Option Strategy
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-white hover:text-[#00ff4c] hover:bg-[#00ff4c15] cursor-pointer"
              onClick={() => handleViewChange("critical-news")}
            >
              <Newspaper size={16} className="mr-2" /> Critical News
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-white hover:text-[#00ff4c] hover:bg-[#00ff4c15] cursor-pointer"
              onClick={navigateToSectors}
            >
              <ChartPie size={16} className="mr-2" /> Market Sectors
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Flexible space */}
      <div className="flex-grow"></div>

      {/* New Chat Button */}
      <div className="p-2 mb-1 z-10 relative">
        <Button
          variant="ghost"
          className="w-full justify-start gap-1 text-xs text-white hover:text-[#00ff4c] hover:bg-[#00ff4c15] py-1 h-auto"
          onClick={() => handleViewChange("chat")}
        >
          <Plus size={16} /> New Chat
        </Button>
      </div>

      {/* Chat buttons positioned near the bottom */}
      <div className="p-2 mb-2 z-10 relative">
        <div className="mb-2 text-xs text-white/70 px-2">CHATS</div>
        {chats.map((chat) => (
          <Button
            key={chat.id}
            variant="ghost"
            className="w-full justify-start gap-1 text-xs text-white hover:text-[#00ff4c] hover:bg-[#00ff4c15] mb-1 py-2.5 h-auto"
            onClick={() => handleViewChange("chat")}
          >
            <MessageSquare size={16} /> {chat.name}
          </Button>
        ))}
      </div>

      {/* Small gap before settings (2 lines) */}
      <div className="h-4"></div>

      <div className="p-2 border-t border-[#00ff4c33] z-10 relative">
        <Button
          variant="ghost"
          className="w-full justify-start gap-1 text-xs text-white hover:text-[#00ff4c] hover:bg-[#00ff4c15] py-1 h-auto"
          onClick={() => setSettingsOpen(true)}
        >
          <Settings size={16} /> Settings
        </Button>
      </div>

      {/* Settings Modal */}
      <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  )
}
