"use client"

import type React from "react"

import { useState } from "react"
import { Search, ArrowRight } from "lucide-react"
import { botTemplates } from "@/types/bot-templates"
import type { Bot } from "@/types/bot"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

// Icon mapping
const iconComponents: Record<string, React.ReactNode> = {
  LineChart: <span className="text-[#00ff4c]">📈</span>,
  TrendingUp: <span className="text-[#00ff4c]">📈</span>,
  TrendingDown: <span className="text-[#00ff4c]">📉</span>,
  PiggyBank: <span className="text-[#00ff4c]">🐷</span>,
  Bitcoin: <span className="text-[#00ff4c]">₿</span>,
  Activity: <span className="text-[#00ff4c]">📊</span>,
  GitBranch: <span className="text-[#00ff4c]">🔄</span>,
  DollarSign: <span className="text-[#00ff4c]">💲</span>,
  BarChart: <span className="text-[#00ff4c]">📊</span>,
  Shield: <span className="text-[#00ff4c]">🛡️</span>,
  Layers: <span className="text-[#00ff4c]">📚</span>,
  Package: <span className="text-[#00ff4c]">📦</span>,
  PieChart: <span className="text-[#00ff4c]">🥧</span>,
  MessageCircle: <span className="text-[#00ff4c]">💬</span>,
  FileText: <span className="text-[#00ff4c]">📄</span>,
}

interface BotTemplatesProps {
  onSelectTemplate: (template: Partial<Bot>) => void
}

export default function BotTemplates({ onSelectTemplate }: BotTemplatesProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Get unique categories
  const categories = Array.from(new Set(botTemplates.map((template) => template.category)))

  // Filter templates based on category and search query
  const filteredTemplates = botTemplates.filter((template) => {
    const matchesCategory = selectedCategory ? template.category === selectedCategory : true
    const matchesSearch = searchQuery
      ? template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true
    return matchesCategory && matchesSearch
  })

  return (
    <div className="w-full">
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-black border border-[#00ff4c33] rounded-md focus:outline-none focus:border-[#00ff4c] text-white"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <Button
            onClick={() => setSelectedCategory(null)}
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            className={
              selectedCategory === null
                ? "bg-[#00ff4c] text-black"
                : "bg-[#00ff4c20] text-[#00ff4c] hover:bg-[#00ff4c30] border-[#00ff4c33]"
            }
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              className={
                selectedCategory === category
                  ? "bg-[#00ff4c] text-black"
                  : "bg-[#00ff4c20] text-[#00ff4c] hover:bg-[#00ff4c30] border-[#00ff4c33]"
              }
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => (
          <Card
            key={template.id}
            className="border border-[#00ff4c33] hover:border-[#00ff4c] transition-all bg-black/40 backdrop-blur-sm overflow-hidden"
          >
            <CardContent className="p-4">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 flex items-center justify-center bg-[#00ff4c15] rounded-full mr-3">
                  {iconComponents[template.icon] || <span className="text-[#00ff4c]">🤖</span>}
                </div>
                <h3 className="font-medium text-white">{template.name}</h3>
              </div>

              <p className="text-sm text-gray-400 mb-3">{template.description}</p>

              <div className="flex items-center justify-between mb-3">
                <span className="text-xs bg-[#00ff4c15] text-[#00ff4c] px-2 py-1 rounded-md border border-[#00ff4c33]">
                  {template.category}
                </span>
                <span className="text-xs text-gray-400">{template.template.skills?.length || 0} skills</span>
              </div>

              <Button
                onClick={() => onSelectTemplate(template.template)}
                className="w-full py-2 flex items-center justify-center bg-[#00ff4c20] hover:bg-[#00ff4c30] text-[#00ff4c] rounded-md"
              >
                Use Template <ArrowRight size={16} className="ml-2" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-8 text-gray-400">No templates found matching your criteria.</div>
      )}
    </div>
  )
}
