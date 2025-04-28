"use client"

import { Bot, BarChart2, Hammer, Layers } from "lucide-react"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

export default function SidebarBotDropdown() {
  const router = useRouter()

  const navigateToBots = () => {
    window.dispatchEvent(new CustomEvent("startLoading"))
    setTimeout(() => {
      router.push("/bots")
    }, 50)
  }

  const navigateToBotBuilder = () => {
    window.dispatchEvent(new CustomEvent("startLoading"))
    setTimeout(() => {
      router.push("/bot-builder")
    }, 50)
  }

  const navigateToWorkflows = () => {
    window.dispatchEvent(new CustomEvent("startLoading"))
    setTimeout(() => {
      router.push("/workflows")
    }, 50)
  }

  const navigateToBotAnalytics = () => {
    window.dispatchEvent(new CustomEvent("startLoading"))
    setTimeout(() => {
      router.push("/bot-analytics")
    }, 50)
  }

  return (
    <>
      <DropdownMenuItem
        className="text-white hover:text-[#00ff4c] hover:bg-[#00ff4c15] cursor-pointer"
        onClick={navigateToBots}
      >
        <Bot size={16} className="mr-2" /> All Bots
      </DropdownMenuItem>
      <DropdownMenuItem
        className="text-white hover:text-[#00ff4c] hover:bg-[#00ff4c15] cursor-pointer"
        onClick={navigateToBotBuilder}
      >
        <Hammer size={16} className="mr-2" /> Bot Builder
      </DropdownMenuItem>
      <DropdownMenuItem
        className="text-white hover:text-[#00ff4c] hover:bg-[#00ff4c15] cursor-pointer"
        onClick={navigateToWorkflows}
      >
        <Layers size={16} className="mr-2" /> Workflows
      </DropdownMenuItem>
      <DropdownMenuItem
        className="text-white hover:text-[#00ff4c] hover:bg-[#00ff4c15] cursor-pointer"
        onClick={navigateToBotAnalytics}
      >
        <BarChart2 size={16} className="mr-2" /> Bot Analytics
      </DropdownMenuItem>
    </>
  )
}
