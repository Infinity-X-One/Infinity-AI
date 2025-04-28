"use client"

import { useState } from "react"
import { X, ChevronLeft, ChevronRight, Check, AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { Bot } from "@/types/bot"
import BotBasicInfo from "./wizard-steps/bot-basic-info"
import BotCapabilities from "./wizard-steps/bot-capabilities"
import BotBehavior from "./wizard-steps/bot-behavior"
import BotConnections from "./wizard-steps/bot-connections"
import BotReview from "./wizard-steps/bot-review"

interface BotCreationWizardProps {
  isOpen: boolean
  onClose: () => void
  onSaveBot: (bot: Bot) => void
}

const steps = [
  { id: "basic", title: "Basic Information" },
  { id: "capabilities", title: "Capabilities" },
  { id: "behavior", title: "Behavior" },
  { id: "connections", title: "Connections" },
  { id: "review", title: "Review & Create" },
]

export default function BotCreationWizard({ isOpen, onClose, onSaveBot }: BotCreationWizardProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [botData, setBotData] = useState<Partial<Bot>>({
    id: `bot-${Date.now()}`,
    name: "",
    description: "",
    icon: "Bot",
    skills: [],
    enabled: true,
    behavior: {
      responseStyle: "balanced",
      knowledgeDomains: [],
      personality: "helpful",
    },
    connections: [],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    if (step === 0) {
      if (!botData.name?.trim()) newErrors.name = "Bot name is required"
      if (!botData.description?.trim()) newErrors.description = "Description is required"
    }

    if (step === 1) {
      if (!botData.skills?.length) newErrors.skills = "Select at least one skill"
    }

    if (step === 2) {
      if (!botData.behavior?.knowledgeDomains?.length)
        newErrors.knowledgeDomains = "Select at least one knowledge domain"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
    }
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const handleSave = () => {
    if (validateStep(currentStep)) {
      onSaveBot(botData as Bot)
      onClose()
    }
  }

  const updateBotData = (data: Partial<Bot>) => {
    setBotData((prev) => ({ ...prev, ...data }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-4xl bg-[#0a0a0a] border border-[#00ff4c33] rounded-lg shadow-[0_0_15px_rgba(0,255,76,0.3)] overflow-hidden"
      >
        {/* Hexagon background effects */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <div className="hexagon-overlay absolute inset-0"></div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#00ff4c33] relative z-10">
          <h2 className="text-xl font-bold text-[#00ff4c] drop-shadow-[0_0_5px_rgba(0,255,76,0.5)]">
            Create Custom Bot
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[#00ff4c20] text-gray-400 hover:text-[#00ff4c]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Progress bar */}
        <div className="px-6 pt-4 relative z-10">
          <div className="flex items-center justify-between mb-2">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index < currentStep
                      ? "bg-[#00ff4c] text-black"
                      : index === currentStep
                        ? "bg-[#00ff4c33] border-2 border-[#00ff4c] text-[#00ff4c]"
                        : "bg-[#1a1a1a] text-gray-500"
                  }`}
                >
                  {index < currentStep ? <Check size={16} /> : <span>{index + 1}</span>}
                </div>
                <span className={`text-xs mt-1 ${index <= currentStep ? "text-[#00ff4c]" : "text-gray-500"}`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
          <div className="w-full h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#00ff4c] to-[#00ff9d] transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 min-h-[400px] relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {currentStep === 0 && <BotBasicInfo botData={botData} updateBotData={updateBotData} errors={errors} />}
              {currentStep === 1 && <BotCapabilities botData={botData} updateBotData={updateBotData} errors={errors} />}
              {currentStep === 2 && <BotBehavior botData={botData} updateBotData={updateBotData} errors={errors} />}
              {currentStep === 3 && <BotConnections botData={botData} updateBotData={updateBotData} errors={errors} />}
              {currentStep === 4 && <BotReview botData={botData} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-[#00ff4c33] relative z-10">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`flex items-center px-4 py-2 rounded-md ${
              currentStep === 0
                ? "text-gray-500 cursor-not-allowed"
                : "text-white hover:bg-[#00ff4c20] border border-[#00ff4c33]"
            }`}
          >
            <ChevronLeft size={16} className="mr-1" />
            Back
          </button>

          {Object.keys(errors).length > 0 && (
            <div className="flex items-center text-red-500">
              <AlertCircle size={16} className="mr-1" />
              <span className="text-sm">Please fix the errors before continuing</span>
            </div>
          )}

          {currentStep < steps.length - 1 ? (
            <button
              onClick={handleNext}
              className="flex items-center px-4 py-2 bg-black border border-[#00ff4c] text-white hover:bg-[#00ff4c15] rounded-md relative"
            >
              <div className="absolute inset-0 shadow-[inset_0_0_8px_rgba(0,255,76,0.3)] pointer-events-none rounded-md"></div>
              Next
              <ChevronRight size={16} className="ml-1" />
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="flex items-center px-4 py-2 bg-[#00ff4c] hover:bg-[#00dd42] text-black font-medium rounded-md relative"
            >
              <div className="absolute inset-0 shadow-[0_0_8px_rgba(0,255,76,0.5)] pointer-events-none rounded-md"></div>
              Create Bot
              <Check size={16} className="ml-1" />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  )
}
