"use client"

import type React from "react"

import { useState } from "react"
import { Activity, ArrowRight, FileText, Heart, LineChart, Search, TrendingUp } from "lucide-react"
import { workflowTemplates } from "@/types/workflow-templates"
import type { Workflow } from "@/types/workflow"

interface WorkflowTemplatesProps {
  onSelectTemplate: (workflow: Workflow) => void
}

export default function WorkflowTemplates({ onSelectTemplate }: WorkflowTemplatesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Get unique categories
  const categories = Array.from(new Set(workflowTemplates.map((template) => template.category)))

  // Filter templates based on category and search query
  const filteredTemplates = workflowTemplates.filter((template) => {
    const matchesCategory = selectedCategory ? template.category === selectedCategory : true
    const matchesSearch = searchQuery
      ? template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true
    return matchesCategory && matchesSearch
  })

  // Icon mapping
  const iconMap: Record<string, React.ReactNode> = {
    LineChart: <LineChart className="text-[#00ff4c]" size={20} />,
    TrendingUp: <TrendingUp className="text-[#00ff4c]" size={20} />,
    FileText: <FileText className="text-[#00ff4c]" size={20} />,
    Activity: <Activity className="text-[#00ff4c]" size={20} />,
    Heart: <Heart className="text-[#00ff4c]" size={20} />,
    Search: <Search className="text-[#00ff4c]" size={20} />,
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-black border border-[#00ff4c33] rounded-md focus:outline-none focus:border-[#00ff4c] text-white"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1 rounded-md text-sm ${
              selectedCategory === null
                ? "bg-[#00ff4c] text-black"
                : "bg-[#00ff4c20] text-[#00ff4c] hover:bg-[#00ff4c30]"
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-md text-sm ${
                selectedCategory === category
                  ? "bg-[#00ff4c] text-black"
                  : "bg-[#00ff4c20] text-[#00ff4c] hover:bg-[#00ff4c30]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="border border-[#00ff4c33] rounded-lg overflow-hidden bg-black/40 backdrop-blur-sm hover:border-[#00ff4c] transition-all"
          >
            <div className="p-4">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 flex items-center justify-center bg-[#00ff4c15] rounded-full mr-3">
                  {iconMap[template.icon] || <FileText className="text-[#00ff4c]" size={20} />}
                </div>
                <h3 className="font-medium text-white">{template.name}</h3>
              </div>

              <p className="text-sm text-gray-400 mb-3">{template.description}</p>

              <div className="flex items-center justify-between mb-3">
                <span className="text-xs bg-[#00ff4c15] text-[#00ff4c] px-2 py-1 rounded-md border border-[#00ff4c33]">
                  {template.category}
                </span>
                <span className="text-xs text-gray-400">{template.workflow.steps.length} steps</span>
              </div>

              <div className="flex items-center justify-center space-x-2 mb-3">
                {template.workflow.steps.map((step, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-[#00ff4c40]"></div>
                    {index < template.workflow.steps.length - 1 && <div className="w-4 h-[1px] bg-[#00ff4c40]"></div>}
                  </div>
                ))}
              </div>

              <button
                onClick={() => onSelectTemplate(template.workflow)}
                className="w-full py-2 flex items-center justify-center bg-[#00ff4c20] hover:bg-[#00ff4c30] text-[#00ff4c] rounded-md"
              >
                Use Template <ArrowRight size={16} className="ml-2" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-8 text-gray-400">No templates found matching your criteria.</div>
      )}
    </div>
  )
}
