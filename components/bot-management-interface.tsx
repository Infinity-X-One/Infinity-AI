"use client"

import { useState } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { Plus, ChevronDown, ChevronUp, Settings, Play, BotIcon, FileText, Layers, MessageSquare } from "lucide-react"
import WorkflowBuilder from "@/components/workflow-builder"
import BotCreationWizard from "@/components/bot-creation-wizard"
import WorkflowTemplates from "@/components/workflow-templates"
import type { Workflow, WorkflowStep } from "@/types/workflow"
import type { Bot } from "@/types/bot"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import Header from "@/components/header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSearchParams, useRouter as useNextRouter } from "next/navigation"
import { useEffect } from "react"
import BotSupervisor from "@/components/bot-supervisor"
import BotDirectivePanel from "@/components/bot-directive-panel"
import SimpleWorkflowBuilder from "@/components/simple-workflow-builder"

// Group bots by category
const BOT_CATEGORIES = {
  Analysis: ["analyze-bot", "picky-bot"],
  Predictions: ["predictions-bot", "opportunities-bot"],
  Information: ["health-bot", "connections-bot"],
}

export default function BotManagementInterface() {
  const [selectedBot, setSelectedBot] = useState<string | null>(null)
  const [workflows, setWorkflows] = useState<Workflow[]>([{ id: "default", name: "Default Workflow", steps: [] }])
  const [activeWorkflow, setActiveWorkflow] = useState<string>("default")
  const [testMode, setTestMode] = useState(false)
  const [testInput, setTestInput] = useState("")
  const [testResult, setTestResult] = useState("")
  const [isWizardOpen, setIsWizardOpen] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    bots: true,
    workflowBuilder: true,
  })
  const [activeTab, setActiveTab] = useState("builder")
  const [bots, setBots] = useState<Bot[]>([
    {
      id: "analyze-bot",
      name: "Analyze Bot",
      description: "Analyzes data and provides insights",
      icon: "Search",
      skills: ["data-analysis", "research"],
      enabled: true,
    },
    {
      id: "picky-bot",
      name: "Picky Bot",
      description: "Helps you make decisions by analyzing options",
      icon: "Microscope",
      skills: ["data-analysis"],
      enabled: true,
    },
    {
      id: "predictions-bot",
      name: "Predictions Bot",
      description: "Makes predictions based on historical data",
      icon: "LineChart",
      skills: ["prediction", "financial-analysis"],
      enabled: true,
    },
    {
      id: "opportunities-bot",
      name: "Opportunities Bot",
      description: "Identifies potential opportunities in various domains",
      icon: "Lightbulb",
      skills: ["research", "data-analysis"],
      enabled: true,
    },
    {
      id: "health-bot",
      name: "Health Bot",
      description: "Provides health-related information and advice",
      icon: "Heart",
      skills: ["qa", "research"],
      enabled: true,
    },
    {
      id: "connections-bot",
      name: "Connections Bot",
      description: "Helps identify connections between concepts and ideas",
      icon: "Compass",
      skills: ["research", "data-analysis"],
      enabled: true,
    },
  ])

  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab")
  const nextRouter = useNextRouter()
  const [selectedBotForDirectives, setSelectedBotForDirectives] = useState<string | null>(null)

  useEffect(() => {
    if (tabParam === "templates") {
      setActiveTab("templates")
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

  const handleSaveBot = (bot: Bot) => {
    setBots([...bots, bot])
  }

  const toggleSection = (section: "bots" | "workflowBuilder") => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const handleSelectTemplate = (workflow: Workflow) => {
    // Create a new workflow based on the template
    const newWorkflow = {
      ...workflow,
      id: `workflow-${Date.now()}`,
    }

    setWorkflows([...workflows, newWorkflow])
    setActiveWorkflow(newWorkflow.id)
    setActiveTab("builder")

    // Update the URL to remove the templates parameter
    nextRouter.replace("/bots")
  }

  const handleSaveDirective = (botId: string, directive: string) => {
    console.log(`Saving directive for bot ${botId}: ${directive}`)
    // In a real app, this would save the directive to the backend
  }

  const handleSaveWorkflow = (name: string, steps: string[]) => {
    console.log(`Saving workflow "${name}" with ${steps.length} steps`)
    // In a real app, this would save the workflow to the backend
  }

  const handleRunWorkflow = (steps: string[]) => {
    console.log(`Running workflow with ${steps.length} steps`)
    // In a real app, this would execute the workflow
  }

  return (
    <div className="flex flex-col h-full min-h-screen bg-black text-white relative">
      {/* Include the header */}
      <Header />

      <div className="flex flex-col flex-1 overflow-y-auto bot-management-page pt-[53px] relative">
        {/* Hexagon background effects - matching the rest of the site */}
        <div className="fixed inset-0 z-0 h-full">
          <div className="hexagon-grid"></div>
          <div className="hexagon-overlay"></div>
          <div className="hexagon-glow"></div>
        </div>

        <div className="relative z-1 p-6 pb-24 flex-1">
          {/* Update the buttons in the header section */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-[#00ff4c] drop-shadow-[0_0_8px_rgba(0,255,76,0.6)]">
              AI Bots Management
            </h1>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setActiveTab("templates")
                  setExpandedSections((prev) => ({
                    ...prev,
                    workflowBuilder: true,
                  }))
                  // Update URL without full page reload
                  nextRouter.replace("/bots?tab=templates")
                }}
                className="flex items-center px-4 py-2 bg-black border border-[#00ff4c] text-white hover:bg-[#00ff4c15] rounded-md relative"
              >
                <div className="absolute inset-0 shadow-[inset_0_0_8px_rgba(0,255,76,0.3)] pointer-events-none rounded-md"></div>
                <FileText size={18} className="mr-2 text-[#00ff4c]" />
                <span>Workflow Templates</span>
              </button>
              <button
                onClick={() => setIsWizardOpen(true)}
                className="flex items-center px-4 py-2 bg-black border border-[#00ff4c] text-white hover:bg-[#00ff4c15] rounded-md relative"
              >
                <div className="absolute inset-0 shadow-[inset_0_0_8px_rgba(0,255,76,0.3)] pointer-events-none rounded-md"></div>
                <Plus size={18} className="mr-2 text-[#00ff4c]" />
                <span>Create Custom Bot</span>
              </button>
            </div>
          </div>

          {/* Bots Section */}
          <Collapsible
            open={expandedSections.bots}
            onOpenChange={() => toggleSection("bots")}
            className="mb-8 border border-[#00ff4c33] rounded-lg overflow-hidden"
          >
            <CollapsibleTrigger className="w-full flex items-center justify-between p-4 bg-[#00ff4c10] hover:bg-[#00ff4c15] text-[#00ff4c] font-medium">
              <div className="flex items-center">
                <BotIcon className="mr-2" size={20} />
                <span>Available Bots</span>
              </div>
              {expandedSections.bots ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4">
              {/* Bots organized by category */}
              {Object.entries(BOT_CATEGORIES).map(([category, botIds], categoryIndex) => (
                <div key={category} className="mb-6 last:mb-0">
                  <h3 className="text-lg font-medium text-[#00ff4c] mb-3">{category}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {bots
                      .filter((bot) => botIds.includes(bot.id))
                      .map((bot, botIndex) => {
                        // Calculate the overall bot number
                        const botNumber = categoryIndex * 10 + botIndex + 1
                        return (
                          <BotCard
                            key={bot.id}
                            bot={bot}
                            number={botNumber}
                            isSelected={selectedBot === bot.id}
                            onSelect={() => setSelectedBot(selectedBot === bot.id ? null : bot.id)}
                            onToggle={(enabled) => handleToggleBot(bot.id, enabled)}
                            setSelectedBotForDirectives={setSelectedBotForDirectives}
                          />
                        )
                      })}
                  </div>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>

          {/* Bot Supervisor Section */}
          <div className="mb-8">
            <BotSupervisor bots={bots} onRefreshStatus={() => console.log("Refreshing bot statuses...")} />
          </div>

          {/* Bot Directives Section */}
          {selectedBotForDirectives && (
            <div className="mb-8">
              <BotDirectivePanel
                bot={bots.find((b) => b.id === selectedBotForDirectives) || bots[0]}
                onSaveDirective={handleSaveDirective}
              />
            </div>
          )}

          {/* Simple Workflow Builder */}
          <div className="mb-8">
            <SimpleWorkflowBuilder bots={bots} onSaveWorkflow={handleSaveWorkflow} onRunWorkflow={handleRunWorkflow} />
          </div>

          {/* Workflow Builder Section */}
          <Collapsible
            open={expandedSections.workflowBuilder}
            onOpenChange={() => toggleSection("workflowBuilder")}
            className="mb-8 border border-[#00ff4c33] rounded-lg overflow-hidden"
          >
            <CollapsibleTrigger className="w-full flex items-center justify-between p-4 bg-[#00ff4c10] hover:bg-[#00ff4c15] text-[#00ff4c] font-medium">
              <div className="flex items-center">
                <Settings className="mr-2" size={20} />
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

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-black border border-[#00ff4c33] rounded-md overflow-hidden">
                  <TabsTrigger
                    value="builder"
                    className="data-[state=active]:bg-[#00ff4c20] data-[state=active]:text-[#00ff4c] data-[state=active]:shadow-none"
                  >
                    <Layers size={16} className="mr-2" />
                    Workflow Builder
                  </TabsTrigger>
                  <TabsTrigger
                    value="templates"
                    className="data-[state=active]:bg-[#00ff4c20] data-[state=active]:text-[#00ff4c] data-[state=active]:shadow-none"
                  >
                    <FileText size={16} className="mr-2" />
                    Templates
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="builder" className="mt-0">
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
                </TabsContent>

                <TabsContent value="templates" className="mt-0">
                  <WorkflowTemplates onSelectTemplate={handleSelectTemplate} />
                </TabsContent>
              </Tabs>
            </CollapsibleContent>
          </Collapsible>
        </div>
        <BotCreationWizard isOpen={isWizardOpen} onClose={() => setIsWizardOpen(false)} onSaveBot={handleSaveBot} />
      </div>
    </div>
  )
}

// Bot Card Component
interface BotCardProps {
  bot: Bot
  number: number
  isSelected: boolean
  onSelect: () => void
  onToggle: (enabled: boolean) => void
  setSelectedBotForDirectives: (botId: string | null) => void
}

function BotCard({ bot, number, isSelected, onSelect, onToggle, setSelectedBotForDirectives }: BotCardProps) {
  const iconMap: Record<string, any> = {
    Search: () => <span className="text-[#00ff4c]">🔍</span>,
    Microscope: () => <span className="text-[#00ff4c]">🔬</span>,
    LineChart: () => <span className="text-[#00ff4c]">📈</span>,
    Lightbulb: () => <span className="text-[#00ff4c]">💡</span>,
    Heart: () => <span className="text-[#00ff4c]">❤️</span>,
    Compass: () => <span className="text-[#00ff4c]">🧭</span>,
    Bot: () => <span className="text-[#00ff4c]">🤖</span>,
  }

  const IconComponent = iconMap[bot.icon] || iconMap.Bot

  const handleOpenDirectives = () => {
    setSelectedBotForDirectives(bot.id)
  }

  return (
    <div
      className={`border ${isSelected ? "border-[#00ff4c]" : "border-[#00ff4c33]"} rounded-lg overflow-hidden bg-black/40 backdrop-blur-sm transition-all hover:border-[#00ff4c]`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div className="w-8 h-8 flex items-center justify-center bg-[#00ff4c15] rounded-full mr-3 text-lg">
              <IconComponent />
            </div>
            <div>
              <div className="flex items-center">
                <span className="text-[#00ff4c] font-mono mr-2">#{number}</span>
                <h3 className="font-medium text-white">{bot.name}</h3>
              </div>
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

        <div className="flex flex-wrap gap-1 mb-3">
          {bot.skills.map((skill) => (
            <span
              key={skill}
              className="px-2 py-1 text-xs bg-[#00ff4c15] text-[#00ff4c] rounded-md border border-[#00ff4c33]"
            >
              {skill
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </span>
          ))}
        </div>

        <button
          onClick={onSelect}
          className={`w-full py-2 px-3 rounded-md ${
            isSelected
              ? "bg-[#00ff4c] text-black hover:bg-[#00dd42]"
              : "bg-[#00ff4c20] text-[#00ff4c] hover:bg-[#00ff4c30]"
          } transition-colors`}
        >
          {isSelected ? "Hide Details" : "View Details"}
        </button>

        {isSelected && (
          <div className="mt-3 pt-3 border-t border-[#00ff4c33]">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-400">Response Style:</span>
              <span className="text-sm text-white">Balanced</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-400">Personality:</span>
              <span className="text-sm text-white">Helpful</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-400">Knowledge:</span>
              <span className="text-sm text-white">General</span>
            </div>

            <button className="w-full mt-3 py-2 flex items-center justify-center bg-[#00ff4c20] hover:bg-[#00ff4c30] text-[#00ff4c] rounded-md">
              <Play size={16} className="mr-2" />
              Run Bot
            </button>

            <button
              onClick={handleOpenDirectives}
              className="w-full mt-2 py-2 flex items-center justify-center bg-[#00ff4c20] hover:bg-[#00ff4c30] text-[#00ff4c] rounded-md"
            >
              <MessageSquare size={16} className="mr-2" />
              Configure Directives
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
