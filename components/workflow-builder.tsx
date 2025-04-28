"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useDrag, useDrop } from "react-dnd"
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
  Filter,
  Wand2,
  GitBranch,
  ArrowRight,
  Play,
  X,
} from "lucide-react"
import type { Workflow, WorkflowStep } from "@/types/workflow"
import type { Bot } from "@/types/bot"

interface WorkflowBuilderProps {
  workflow: Workflow
  onAddStep: (step: WorkflowStep) => void
  onRemoveStep: (index: number) => void
  onReorderSteps: (startIndex: number, endIndex: number) => void
  testMode: boolean
  testInput: string
  testResult: string
  onTestInputChange: (input: string) => void
  onToggleTestMode: () => void
  onRunTest: () => void
  bots: Bot[]
}

const iconComponents: Record<string, any> = {
  Bot: BotIcon,
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
  Filter,
  Wand2,
  GitBranch,
}

const actionTypes = [
  { id: "filter", name: "Filter", icon: "Filter", description: "Filter data based on conditions" },
  { id: "transform", name: "Transform", icon: "Wand2", description: "Transform data format or structure" },
  { id: "prompt", name: "Prompt", icon: "MessageSquare", description: "Add a custom prompt" },
  { id: "condition", name: "Condition", icon: "GitBranch", description: "Branch workflow based on conditions" },
]

export default function WorkflowBuilder({
  workflow,
  onAddStep,
  onRemoveStep,
  onReorderSteps,
  testMode,
  testInput,
  testResult,
  onTestInputChange,
  onToggleTestMode,
  onRunTest,
  bots,
}: WorkflowBuilderProps) {
  const [draggedItemType, setDraggedItemType] = useState<string | null>(null)

  // Global drag state listeners
  useEffect(() => {
    const handleDragStart = () => setDraggedItemType("dragging")
    const handleDragEnd = () => setDraggedItemType(null)

    window.addEventListener("dragstart", handleDragStart)
    window.addEventListener("dragend", handleDragEnd)

    return () => {
      window.removeEventListener("dragstart", handleDragStart)
      window.removeEventListener("dragend", handleDragEnd)
    }
  }, [])

  const handleDrop = (item: any, targetIndex: number) => {
    if (item.type === "bot") {
      const bot = bots.find((b) => b.id === item.id)
      if (bot) {
        onAddStep({
          id: `step-${Date.now()}`,
          type: "bot",
          botId: bot.id,
          name: bot.name,
          icon: bot.icon,
        })
      }
    } else if (item.type === "action") {
      const action = actionTypes.find((a) => a.id === item.id)
      if (action) {
        onAddStep({
          id: `step-${Date.now()}`,
          type: "action",
          actionId: action.id,
          name: action.name,
          icon: action.icon,
        })
      }
    } else if (item.type === "reorder") {
      onReorderSteps(item.index, targetIndex)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/3 space-y-4">
          <div>
            <h3 className="text-lg font-medium text-[#00ff4c] mb-3">Workflow Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              {actionTypes.map((action) => (
                <DraggableAction key={action.id} action={action} />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-[#00ff4c] mb-3">Available Bots</h3>
            <div className="grid grid-cols-2 gap-2">
              {bots
                .filter((bot) => bot.enabled)
                .map((bot) => (
                  <DraggableBot key={bot.id} bot={bot} />
                ))}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-2/3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-medium text-[#00ff4c]">Workflow Steps</h3>
            <button
              onClick={onToggleTestMode}
              className={`px-3 py-1 rounded-md text-sm relative ${
                testMode
                  ? "bg-[#00ff4c] text-black hover:bg-[#00dd42]"
                  : "bg-black border border-[#00ff4c] text-white hover:bg-[#00ff4c15]"
              }`}
            >
              {testMode && (
                <div className="absolute inset-0 shadow-[0_0_8px_rgba(0,255,76,0.5)] pointer-events-none rounded-md"></div>
              )}
              {!testMode && (
                <div className="absolute inset-0 shadow-[inset_0_0_8px_rgba(0,255,76,0.3)] pointer-events-none rounded-md"></div>
              )}
              {testMode ? "Exit Test Mode" : "Test Workflow"}
            </button>
          </div>

          <div
            className={`border ${
              draggedItemType ? "border-[#00ff4c] bg-[#00ff4c10]" : "border-[#00ff4c33]"
            } rounded-md p-4 min-h-[200px] transition-colors`}
          >
            {workflow.steps.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="text-gray-500 mb-2">
                  <ArrowRight size={32} className="mx-auto mb-2" />
                  <p>Drag and drop actions or bots here to build your workflow</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {workflow.steps.map((step, index) => (
                  <WorkflowStepItem
                    key={step.id}
                    step={step}
                    index={index}
                    onRemove={() => onRemoveStep(index)}
                    onReorder={onReorderSteps}
                  />
                ))}

                <DropZone
                  onDrop={(item) => handleDrop(item, workflow.steps.length)}
                  className="mt-2 border border-dashed border-[#00ff4c33] rounded-md p-2 flex items-center justify-center"
                >
                  <span className="text-sm text-gray-500">Drop here to add to the end</span>
                </DropZone>
              </div>
            )}
          </div>

          {testMode && (
            <div className="mt-4 border border-[#00ff4c33] rounded-md p-4 bg-[#00ff4c08]">
              <h4 className="text-md font-medium text-[#00ff4c] mb-3">Test Workflow</h4>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Test Input</label>
                  <textarea
                    value={testInput}
                    onChange={(e) => onTestInputChange(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#00ff4c33] rounded-md focus:outline-none focus:ring-1 focus:ring-[#00ff4c] focus:border-[#00ff4c] text-white"
                    placeholder="Enter test input..."
                  />
                </div>

                <button
                  onClick={onRunTest}
                  className="flex items-center px-3 py-2 bg-[#00ff4c] hover:bg-[#00dd42] text-black font-medium rounded-md relative"
                >
                  <div className="absolute inset-0 shadow-[0_0_8px_rgba(0,255,76,0.5)] pointer-events-none rounded-md"></div>
                  <Play size={16} className="mr-2" />
                  Run Test
                </button>

                {testResult && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Test Result</label>
                    <div className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#00ff4c33] rounded-md min-h-[100px] whitespace-pre-wrap text-white">
                      {testResult}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface DraggableBotProps {
  bot: Bot
}

function DraggableBot({ bot }: DraggableBotProps) {
  const IconComponent = iconComponents[bot.icon] || BotIcon

  // Fixed useDrag implementation
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "WORKFLOW_ITEM",
    item: () => ({ id: bot.id, type: "bot" }),
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  return (
    <div
      ref={drag}
      className={`p-3 border border-[#00ff4c33] rounded-md cursor-grab ${
        isDragging ? "opacity-50" : "hover:border-[#00ff4c] hover:bg-[#00ff4c10]"
      } transition-all`}
    >
      <div className="flex items-center">
        <div className="w-8 h-8 rounded-full bg-[#00ff4c20] flex items-center justify-center mr-3">
          <IconComponent size={16} className="text-[#00ff4c]" />
        </div>
        <div>
          <h4 className="font-medium text-white text-sm">{bot.name}</h4>
          <p className="text-xs text-gray-400">Bot</p>
        </div>
      </div>
    </div>
  )
}

interface DraggableActionProps {
  action: {
    id: string
    name: string
    icon: string
    description: string
  }
}

function DraggableAction({ action }: DraggableActionProps) {
  const IconComponent = iconComponents[action.icon] || Filter

  // Fixed useDrag implementation
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "WORKFLOW_ITEM",
    item: () => ({ id: action.id, type: "action" }),
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  return (
    <div
      ref={drag}
      className={`p-3 border border-[#00ff4c33] rounded-md cursor-grab ${
        isDragging ? "opacity-50" : "hover:border-[#00ff4c] hover:bg-[#00ff4c10]"
      } transition-all`}
    >
      <div className="flex items-center">
        <div className="w-8 h-8 rounded-full bg-[#00ff4c20] flex items-center justify-center mr-3">
          <IconComponent size={16} className="text-[#00ff4c]" />
        </div>
        <div>
          <h4 className="font-medium text-white text-sm">{action.name}</h4>
          <p className="text-xs text-gray-400">Action</p>
        </div>
      </div>
    </div>
  )
}

interface WorkflowStepItemProps {
  step: WorkflowStep
  index: number
  onRemove: () => void
  onReorder: (startIndex: number, endIndex: number) => void
}

function WorkflowStepItem({ step, index, onRemove, onReorder }: WorkflowStepItemProps) {
  const IconComponent = iconComponents[step.icon] || BotIcon

  // Fixed useDrag implementation
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "WORKFLOW_ITEM",
    item: () => ({ id: step.id, type: "reorder", index }),
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "WORKFLOW_ITEM",
    drop: (item: any) => {
      if (item.type === "reorder") {
        onReorder(item.index, index)
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }))

  return (
    <div ref={drop}>
      {isOver && <div className="h-1 bg-[#00ff4c] rounded-full my-2" />}
      <div
        ref={drag}
        className={`flex items-center justify-between p-3 border border-[#00ff4c33] rounded-md ${
          isDragging ? "opacity-50" : "hover:bg-[#00ff4c08]"
        } cursor-grab transition-colors`}
      >
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-[#00ff4c20] flex items-center justify-center mr-3">
            <IconComponent size={16} className="text-[#00ff4c]" />
          </div>
          <div>
            <h4 className="font-medium text-white">{step.name}</h4>
            <p className="text-xs text-gray-400">{step.type === "bot" ? "Bot" : "Action"}</p>
          </div>
        </div>

        <button onClick={onRemove} className="p-1 text-gray-400 hover:text-red-400">
          <X size={16} />
        </button>
      </div>
      {isOver && index === 0 && <div className="h-1 bg-[#00ff4c] rounded-full my-2" />}
    </div>
  )
}

interface DropZoneProps {
  onDrop: (item: any) => void
  children: React.ReactNode
  className?: string
}

function DropZone({ onDrop, children, className = "" }: DropZoneProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "WORKFLOW_ITEM",
    drop: (item) => onDrop(item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }))

  return (
    <div ref={drop} className={`${className} ${isOver ? "border-[#00ff4c] bg-[#00ff4c10]" : ""} transition-colors`}>
      {children}
    </div>
  )
}
