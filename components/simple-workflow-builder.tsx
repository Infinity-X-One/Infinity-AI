"use client"

import { useState } from "react"
import { Plus, X, ArrowRight, Play, Save } from "lucide-react"
import type { Bot } from "@/types/bot"

interface SimpleWorkflowBuilderProps {
  bots: Bot[]
  onSaveWorkflow: (name: string, steps: string[]) => void
  onRunWorkflow: (steps: string[]) => void
}

export default function SimpleWorkflowBuilder({ bots, onSaveWorkflow, onRunWorkflow }: SimpleWorkflowBuilderProps) {
  const [workflowName, setWorkflowName] = useState("New Workflow")
  const [workflowSteps, setWorkflowSteps] = useState<string[]>([])
  const [selectedBot, setSelectedBot] = useState<string | null>(null)

  const handleAddStep = () => {
    if (selectedBot && !workflowSteps.includes(selectedBot)) {
      setWorkflowSteps([...workflowSteps, selectedBot])
      setSelectedBot(null)
    }
  }

  const handleRemoveStep = (index: number) => {
    setWorkflowSteps(workflowSteps.filter((_, i) => i !== index))
  }

  const handleSaveWorkflow = () => {
    if (workflowName && workflowSteps.length > 0) {
      onSaveWorkflow(workflowName, workflowSteps)
    }
  }

  const handleRunWorkflow = () => {
    if (workflowSteps.length > 0) {
      onRunWorkflow(workflowSteps)
    }
  }

  // Get only enabled bots
  const enabledBots = bots.filter((bot) => bot.enabled)

  return (
    <div className="border border-[#00ff4c33] rounded-lg bg-black/40 backdrop-blur-sm overflow-hidden">
      <div className="p-4 border-b border-[#00ff4c33] bg-[#00ff4c10]">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-white text-lg">Simple Workflow Builder</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSaveWorkflow}
              className="flex items-center px-3 py-1 bg-[#00ff4c20] hover:bg-[#00ff4c30] text-[#00ff4c] rounded-md text-sm"
            >
              <Save size={14} className="mr-1" />
              Save
            </button>
            <button
              onClick={handleRunWorkflow}
              disabled={workflowSteps.length === 0}
              className={`flex items-center px-3 py-1 ${
                workflowSteps.length > 0
                  ? "bg-[#00ff4c] hover:bg-[#00dd42] text-black"
                  : "bg-gray-700 text-gray-400 cursor-not-allowed"
              } rounded-md text-sm`}
            >
              <Play size={14} className="mr-1" />
              Run
            </button>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-1">Workflow Name</label>
          <input
            type="text"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#00ff4c33] rounded-md focus:outline-none focus:ring-1 focus:ring-[#00ff4c] focus:border-[#00ff4c] text-white text-sm"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-1">Add Bot to Workflow</label>
          <div className="flex">
            <select
              value={selectedBot || ""}
              onChange={(e) => setSelectedBot(e.target.value || null)}
              className="flex-grow px-3 py-2 bg-[#0a0a0a] border border-[#00ff4c33] rounded-l-md focus:outline-none focus:ring-1 focus:ring-[#00ff4c] focus:border-[#00ff4c] text-white text-sm"
            >
              <option value="">Select a bot...</option>
              {enabledBots.map((bot) => (
                <option key={bot.id} value={bot.id}>
                  {bot.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleAddStep}
              disabled={!selectedBot}
              className={`px-3 ${
                selectedBot
                  ? "bg-[#00ff4c] hover:bg-[#00dd42] text-black"
                  : "bg-gray-700 text-gray-400 cursor-not-allowed"
              } rounded-r-md flex items-center`}
            >
              <Plus size={18} />
            </button>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-[#00ff4c] mb-2">Workflow Steps</h4>
          {workflowSteps.length === 0 ? (
            <div className="p-4 border border-dashed border-[#00ff4c33] rounded-md text-center">
              <p className="text-sm text-gray-400">Add bots to create a workflow</p>
            </div>
          ) : (
            <div className="space-y-2">
              {workflowSteps.map((botId, index) => {
                const bot = bots.find((b) => b.id === botId)
                if (!bot) return null

                return (
                  <div key={index} className="flex items-center">
                    {index > 0 && <ArrowRight size={16} className="mx-2 text-[#00ff4c]" />}
                    <div className="flex-grow p-3 bg-[#00ff4c10] border border-[#00ff4c33] rounded-md flex items-center justify-between">
                      <span className="text-sm text-white">{bot.name}</span>
                      <button onClick={() => handleRemoveStep(index)} className="p-1 text-gray-400 hover:text-red-400">
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {workflowSteps.length > 0 && (
            <div className="mt-4 p-3 bg-[#00ff4c10] border border-[#00ff4c33] rounded-md">
              <h5 className="text-xs font-medium text-[#00ff4c] mb-1">Workflow Description</h5>
              <p className="text-sm text-white">
                This workflow will process data through {workflowSteps.length} bot
                {workflowSteps.length !== 1 ? "s" : ""} in sequence:
                {workflowSteps.map((botId, index) => {
                  const bot = bots.find((b) => b.id === botId)
                  return bot ? ` ${index + 1}. ${bot.name}${index < workflowSteps.length - 1 ? "," : ""}` : ""
                })}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
