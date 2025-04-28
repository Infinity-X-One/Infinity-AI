"use client"

import { useState } from "react"
import Sidebar from "@/components/sidebar"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import WorkflowBuilder from "@/components/workflow-builder"
import Header from "@/components/header"
import { INFINITY_BOTS } from "@/data/infinity-bots"
import type { Workflow, WorkflowStep } from "@/types/workflow"
import { Save } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function WorkflowsPage() {
  const [currentView, setCurrentView] = useState<
    "chat" | "predictions" | "analyze" | "short-strategy" | "option-strategy" | "critical-news" | "web-scraper"
  >("chat")

  const [workflows, setWorkflows] = useState<Workflow[]>([{ id: "default", name: "Default Workflow", steps: [] }])
  const [activeWorkflow, setActiveWorkflow] = useState<string>("default")
  const [testMode, setTestMode] = useState(false)
  const [testInput, setTestInput] = useState("")
  const [testResult, setTestResult] = useState("")

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
                  Bot Workflow Builder
                </h1>
              </div>

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

              <div className="border border-[#00ff4c33] rounded-lg p-6 bg-black/40 backdrop-blur-sm">
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
                    bots={INFINITY_BOTS}
                  />
                </DndProvider>

                <div className="mt-6 flex justify-end">
                  <Button className="bg-[#00ff4c] hover:bg-[#00dd42] text-black font-medium relative">
                    <div className="absolute inset-0 shadow-[0_0_8px_rgba(0,255,76,0.5)] pointer-events-none rounded-md"></div>
                    <Save size={16} className="mr-2" />
                    Save Workflow
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
