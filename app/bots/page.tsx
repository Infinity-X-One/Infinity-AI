"use client"

import { useState, useEffect } from "react"
import Sidebar from "@/components/sidebar"
import { useSearchParams } from "next/navigation"
import { INFINITY_BOTS, BOT_CATEGORIES } from "@/data/infinity-bots"
import type { InfinityBot } from "@/types/infinity-bot"
import Header from "@/components/header"
import { Search, Filter, ChevronDown, ChevronUp, BotIcon, Layers, Plus, Save, Zap } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import WorkflowBuilder from "@/components/workflow-builder"
import type { Workflow, WorkflowStep } from "@/types/workflow"

export default function BotsPage() {
  const [currentView, setCurrentView] = useState<
    "chat" | "predictions" | "analyze" | "short-strategy" | "option-strategy" | "critical-news" | "web-scraper"
  >("chat")

  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab")

  const [activeTab, setActiveTab] = useState<string>("all-bots")
  const [expandedSections, setExpandedSections] = useState({
    workflowBuilder: true,
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [bots, setBots] = useState<InfinityBot[]>(INFINITY_BOTS)
  const [workflows, setWorkflows] = useState<Workflow[]>([{ id: "default", name: "Default Workflow", steps: [] }])
  const [activeWorkflow, setActiveWorkflow] = useState<string>("default")
  const [testMode, setTestMode] = useState(false)
  const [testInput, setTestInput] = useState("")
  const [testResult, setTestResult] = useState("")

  useEffect(() => {
    if (tabParam === "workflows") {
      setActiveTab("workflows")
      setExpandedSections((prev) => ({
        ...prev,
        workflowBuilder: true,
      }))
    }
  }, [tabParam])

  const handleToggleBot = (botId: string, enabled: boolean) => {
    setBots(bots.map((bot) => (bot.id === botId ? { ...bot, enabled } : bot)))
  }

  const handleAddStepToWorkflow = (step: WorkflowStep) => {
    setWorkflows((prevWorkflows) =>
      prevWorkflows.map((workflow) =>
        workflow.id === activeWorkflow ? { ...workflow, steps: [...workflow.steps, step] } : workflow,
      ),
    )
  }

  const handleRemoveStepFromWorkflow = (stepIndex: number) => {
    setWorkflows((prevWorkflows) =>
      prevWorkflows.map((workflow) =>
        workflow.id === activeWorkflow
          ? {
              ...workflow,
              steps: workflow.steps.filter((_, idx) => idx !== stepIndex),
            }
          : workflow,
      ),
    )
  }

  const handleReorderWorkflowSteps = (startIndex: number, endIndex: number) => {
    setWorkflows((prevWorkflows) =>
      prevWorkflows.map((workflow) => {
        if (workflow.id !== activeWorkflow) return workflow

        const newSteps = [...workflow.steps]
        const [removed] = newSteps.splice(startIndex, 1)
        newSteps.splice(endIndex, 0, removed)

        return { ...workflow, steps: newSteps }
      }),
    )
  }

  const handleTestWorkflow = () => {
    setTestResult(`Test result for input: ${testInput}`)
  }

  const toggleSection = (section: "workflowBuilder") => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const filteredBots = bots.filter((bot) => {
    const matchesSearch =
      bot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bot.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bot.workflowCategory.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = categoryFilter ? bot.workflowCategory === categoryFilter : true

    return matchesSearch && matchesCategory
  })

  // Get unique workflow categories
  const workflowCategories = Array.from(new Set(bots.map((bot) => bot.workflowCategory))).sort()

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Include the sidebar with the same structure as other pages */}
      <div className="w-64 flex-shrink-0">
        <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      </div>

      {/* Main content area */}
      <div className="flex-1 overflow-hidden">
        <div className="flex flex-col h-full min-h-screen bg-black text-white relative">
          {/* Include the header */}
          <Header />

          <div className="flex flex-col flex-1 overflow-y-auto pt-[53px] relative">
            {/* Hexagon background effects - matching the rest of the site */}
            <div className="fixed inset-0 z-0 h-full">
              <div className="hexagon-grid"></div>
              <div className="hexagon-overlay"></div>
              <div className="hexagon-glow"></div>
            </div>

            <div className="relative z-1 p-6 pb-24 flex-1">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-[#00ff4c] drop-shadow-[0_0_8px_rgba(0,255,76,0.6)]">
                  InfinityXOS AI Bots
                </h1>
                <div className="flex gap-3">
                  <Button
                    onClick={() => setActiveTab("workflows")}
                    className="flex items-center px-4 py-2 bg-black border border-[#00ff4c] text-white hover:bg-[#00ff4c15] rounded-md relative"
                  >
                    <div className="absolute inset-0 shadow-[inset_0_0_8px_rgba(0,255,76,0.3)] pointer-events-none rounded-md"></div>
                    <Layers size={18} className="mr-2 text-[#00ff4c]" />
                    <span>Workflow Builder</span>
                  </Button>
                  <Button
                    onClick={() => (window.location.href = "/bot-builder")}
                    className="flex items-center px-4 py-2 bg-black border border-[#00ff4c] text-white hover:bg-[#00ff4c15] rounded-md relative"
                  >
                    <div className="absolute inset-0 shadow-[inset_0_0_8px_rgba(0,255,76,0.3)] pointer-events-none rounded-md"></div>
                    <Plus size={18} className="mr-2 text-[#00ff4c]" />
                    <span>Create Custom Bot</span>
                  </Button>
                </div>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-black border border-[#00ff4c33] rounded-md overflow-hidden">
                  <TabsTrigger
                    value="all-bots"
                    className="data-[state=active]:bg-[#00ff4c20] data-[state=active]:text-[#00ff4c] data-[state=active]:shadow-none"
                  >
                    <BotIcon size={16} className="mr-2" />
                    All Bots
                  </TabsTrigger>
                  <TabsTrigger
                    value="workflows"
                    className="data-[state=active]:bg-[#00ff4c20] data-[state=active]:text-[#00ff4c] data-[state=active]:shadow-none"
                  >
                    <Layers size={16} className="mr-2" />
                    Workflows
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all-bots" className="mt-0">
                  <div className="mb-6 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-grow">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <Input
                        placeholder="Search bots by name, description, or category..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-[#0a0a0a] border-[#00ff4c33] focus:border-[#00ff4c] text-white w-full"
                      />
                    </div>
                    <div className="w-full md:w-64">
                      <select
                        value={categoryFilter || ""}
                        onChange={(e) => setCategoryFilter(e.target.value || null)}
                        className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#00ff4c33] rounded-md focus:outline-none focus:ring-1 focus:ring-[#00ff4c] focus:border-[#00ff4c] text-white"
                      >
                        <option value="">All Categories</option>
                        {workflowCategories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {BOT_CATEGORIES.map((category) => {
                    // Filter bots in this category based on search and category filter
                    const filteredCategoryBots = category.bots.filter((bot) => {
                      const matchesSearch =
                        bot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        bot.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        bot.workflowCategory.toLowerCase().includes(searchQuery.toLowerCase())

                      const matchesCategory = categoryFilter ? bot.workflowCategory === categoryFilter : true

                      return matchesSearch && matchesCategory
                    })

                    // Only show categories that have bots matching the filters
                    if (filteredCategoryBots.length === 0) return null

                    return (
                      <div key={category.name} className="mb-10">
                        <h2 className="text-xl font-bold text-[#00ff4c] mb-4">{category.name}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {filteredCategoryBots.map((bot) => (
                            <BotCard key={bot.id} bot={bot} onToggle={(enabled) => handleToggleBot(bot.id, enabled)} />
                          ))}
                        </div>
                      </div>
                    )
                  })}

                  {filteredBots.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <BotIcon size={48} className="text-gray-500 mb-4" />
                      <h3 className="text-xl font-medium text-white mb-2">No Bots Found</h3>
                      <p className="text-gray-400 mb-6 max-w-md">
                        No bots match your current search criteria. Try adjusting your search or filters.
                      </p>
                      <Button
                        onClick={() => {
                          setSearchQuery("")
                          setCategoryFilter(null)
                        }}
                        className="bg-[#00ff4c] hover:bg-[#00dd42] text-black font-medium relative"
                      >
                        <div className="absolute inset-0 shadow-[0_0_8px_rgba(0,255,76,0.5)] pointer-events-none rounded-md"></div>
                        <Filter size={16} className="mr-2" />
                        Clear Filters
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="workflows" className="mt-0">
                  <Collapsible
                    open={expandedSections.workflowBuilder}
                    onOpenChange={() => toggleSection("workflowBuilder")}
                    className="mb-8 border border-[#00ff4c33] rounded-lg overflow-hidden"
                  >
                    <CollapsibleTrigger className="w-full flex items-center justify-between p-4 bg-[#00ff4c10] hover:bg-[#00ff4c15] text-[#00ff4c] font-medium">
                      <div className="flex items-center">
                        <Layers className="mr-2" size={20} />
                        <span>Bot Workflow Builder</span>
                      </div>
                      {expandedSections.workflowBuilder ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="p-4">
                      <div className="mb-4">
                        <h3 className="text-lg font-medium text-[#00ff4c] mb-3">Active Workflows</h3>
                        <div className="flex gap-4 mb-4 overflow-x-auto pb-2">
                          {workflows.map((workflow) => (
                            <button
                              key={workflow.id}
                              onClick={() => setActiveWorkflow(workflow.id)}
                              className={`px-4 py-2 rounded-md border ${
                                activeWorkflow === workflow.id
                                  ? "border-[#00ff4c] bg-[#00ff4c15] text-[#00ff4c]"
                                  : "border-gray-700 hover:border-[#00ff4c50] hover:bg-[#00ff4c10] text-white"
                              }`}
                            >
                              {workflow.name}
                            </button>
                          ))}
                          <button
                            onClick={() => {
                              const id = `workflow-${Date.now()}`
                              setWorkflows([
                                ...workflows,
                                {
                                  id,
                                  name: `Workflow ${workflows.length + 1}`,
                                  steps: [],
                                },
                              ])
                              setActiveWorkflow(id)
                            }}
                            className="px-4 py-2 rounded-md border border-dashed border-gray-700 hover:border-[#00ff4c50] hover:bg-[#00ff4c10] text-white"
                          >
                            + New Workflow
                          </button>
                        </div>
                      </div>

                      <DndProvider backend={HTML5Backend}>
                        <WorkflowBuilder
                          workflow={workflows.find((w) => w.id === activeWorkflow) || workflows[0]}
                          onAddStep={handleAddStepToWorkflow}
                          onRemoveStep={handleRemoveStepFromWorkflow}
                          onReorderSteps={handleReorderWorkflowSteps}
                          testMode={testMode}
                          testInput={testInput}
                          testResult={testResult}
                          onTestInputChange={setTestInput}
                          onToggleTestMode={() => setTestMode(!testMode)}
                          onRunTest={handleTestWorkflow}
                          bots={bots}
                        />
                      </DndProvider>

                      <div className="mt-6 flex justify-end">
                        <Button className="bg-[#00ff4c] hover:bg-[#00dd42] text-black font-medium relative">
                          <div className="absolute inset-0 shadow-[0_0_8px_rgba(0,255,76,0.5)] pointer-events-none rounded-md"></div>
                          <Save size={16} className="mr-2" />
                          Save Workflow
                        </Button>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Bot Card Component
interface BotCardProps {
  bot: InfinityBot
  onToggle: (enabled: boolean) => void
}

function BotCard({ bot, onToggle }: BotCardProps) {
  const [expanded, setExpanded] = useState(false)

  // Map of icon names to emoji representations
  const iconMap: Record<string, string> = {
    Search: "🔍",
    LineChart: "📈",
    FolderOpen: "📂",
    TimerReset: "⏱️",
    Filter: "🔬",
    Shield: "🛡️",
    TrendingUp: "📈",
    Scale: "⚖️",
    Flame: "🔥",
    CloudSun: "☁️",
    Lotus: "🧘",
    Target: "🎯",
    Brain: "🧠",
    Briefcase: "💼",
    Palette: "🎨",
    Calendar: "📅",
    Mail: "📧",
    FileText: "📄",
    Play: "▶️",
    Receipt: "🧾",
    ArrowUpRight: "📈",
    ArrowDownRight: "📉",
    DollarSign: "💲",
    Newspaper: "📰",
    MessageSquare: "💬",
    Building: "🏢",
    EyeOff: "👁️‍🗨️",
    AlertTriangle: "⚠️",
    Globe: "🌎",
    Map: "🗺️",
    Eye: "👁️",
    ShoppingCart: "🛒",
    Settings: "⚙️",
    Sliders: "🎚️",
    ClipboardList: "📋",
    RefreshCw: "🔄",
    HelpCircle: "❓",
    LifeBuoy: "🛟",
  }

  return (
    <div
      className={`border border-[#00ff4c33] rounded-lg overflow-hidden bg-black/40 backdrop-blur-sm transition-all hover:border-[#00ff4c]`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div className="w-8 h-8 flex items-center justify-center bg-[#00ff4c15] rounded-full mr-3 text-lg">
              <span className="text-[#00ff4c]">{iconMap[bot.icon] || "🤖"}</span>
            </div>
            <div>
              <h3 className="font-medium text-white">{bot.name}</h3>
              <span className="text-xs text-[#00ff4c]">{bot.workflowCategory}</span>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={bot.enabled}
              onChange={(e) => onToggle(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#00ff4c40] peer-checked:after:bg-[#00ff4c]"></div>
          </label>
        </div>

        <p className="text-sm text-gray-400 mb-3">{bot.description}</p>

        <button
          onClick={() => setExpanded(!expanded)}
          className={`w-full py-2 px-3 rounded-md ${
            expanded
              ? "bg-[#00ff4c] text-black hover:bg-[#00dd42]"
              : "bg-[#00ff4c20] text-[#00ff4c] hover:bg-[#00ff4c30]"
          } transition-colors`}
        >
          {expanded ? "Hide Details" : "View Details"}
        </button>

        {expanded && (
          <div className="mt-3 pt-3 border-t border-[#00ff4c33]">
            <h4 className="font-medium text-white mb-2">Strengths:</h4>
            <ul className="list-disc pl-5 mb-3">
              {bot.strengths.map((strength, index) => (
                <li key={index} className="text-sm text-gray-400 mb-1">
                  {strength}
                </li>
              ))}
            </ul>

            <button className="w-full mt-3 py-2 flex items-center justify-center bg-[#00ff4c20] hover:bg-[#00ff4c30] text-[#00ff4c] rounded-md">
              <Zap size={16} className="mr-2" />
              Run Bot
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
