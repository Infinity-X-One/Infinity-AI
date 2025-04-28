"use client"

import { useState } from "react"
import type { Bot } from "@/types/bot"
import {
  BotIcon,
  Search,
  Microscope,
  Brain,
  LineChart,
  Heart,
  Zap,
  MessageSquare,
  Shield,
  Lightbulb,
  Compass,
  Cpu,
} from "lucide-react"

const iconOptions = [
  { value: "Bot", label: "Default Bot", icon: BotIcon },
  { value: "Search", label: "Search", icon: Search },
  { value: "Microscope", label: "Analysis", icon: Microscope },
  { value: "Brain", label: "Intelligence", icon: Brain },
  { value: "LineChart", label: "Finance", icon: LineChart },
  { value: "Heart", label: "Health", icon: Heart },
  { value: "Zap", label: "Quick", icon: Zap },
  { value: "MessageSquare", label: "Chat", icon: MessageSquare },
  { value: "Shield", label: "Security", icon: Shield },
  { value: "Lightbulb", label: "Ideas", icon: Lightbulb },
  { value: "Compass", label: "Navigation", icon: Compass },
  { value: "Cpu", label: "Technical", icon: Cpu },
]

interface BotBasicInfoProps {
  botData: Partial<Bot>
  updateBotData: (data: Partial<Bot>) => void
  errors: Record<string, string>
}

export default function BotBasicInfo({ botData, updateBotData, errors }: BotBasicInfoProps) {
  const [selectedIcon, setSelectedIcon] = useState(botData.icon || "Bot")

  const handleIconSelect = (iconName: string) => {
    setSelectedIcon(iconName)
    updateBotData({ icon: iconName })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-[#00ff4c] mb-4">Basic Information</h3>
        <p className="text-gray-400 mb-6">Let's start by defining the basic details of your custom bot.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="botName" className="block text-sm font-medium text-gray-300 mb-1">
            Bot Name
          </label>
          <input
            id="botName"
            type="text"
            value={botData.name || ""}
            onChange={(e) => updateBotData({ name: e.target.value })}
            className={`w-full px-3 py-2 bg-[#1a1a1a] border ${
              errors.name ? "border-red-500" : "border-[#333]"
            } rounded-md focus:outline-none focus:ring-1 focus:ring-[#00ff4c] focus:border-[#00ff4c]`}
            placeholder="e.g., Research Assistant"
          />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="botDescription" className="block text-sm font-medium text-gray-300 mb-1">
            Description
          </label>
          <textarea
            id="botDescription"
            value={botData.description || ""}
            onChange={(e) => updateBotData({ description: e.target.value })}
            rows={3}
            className={`w-full px-3 py-2 bg-[#1a1a1a] border ${
              errors.description ? "border-red-500" : "border-[#333]"
            } rounded-md focus:outline-none focus:ring-1 focus:ring-[#00ff4c] focus:border-[#00ff4c]`}
            placeholder="Describe what your bot does and how it can help users..."
          />
          {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Select an Icon</label>
          <div className="grid grid-cols-6 gap-3">
            {iconOptions.map((icon) => {
              const IconComponent = icon.icon
              return (
                <div
                  key={icon.value}
                  onClick={() => handleIconSelect(icon.value)}
                  className={`flex flex-col items-center p-3 border ${
                    selectedIcon === icon.value
                      ? "border-[#00ff4c] bg-[#00ff4c15]"
                      : "border-[#333] hover:border-[#555]"
                  } rounded-md cursor-pointer transition-colors`}
                >
                  <IconComponent
                    size={24}
                    className={selectedIcon === icon.value ? "text-[#00ff4c]" : "text-gray-400"}
                  />
                  <span className="text-xs mt-1 text-gray-400">{icon.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
