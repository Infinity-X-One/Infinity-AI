"use client"

import type { Bot } from "@/types/bot"

interface BotCapabilitiesProps {
  botData: Partial<Bot>
  updateBotData: (data: Partial<Bot>) => void
  errors: Record<string, string>
}

const skillOptions = [
  { id: "text-generation", name: "Text Generation", description: "Generate human-like text based on prompts" },
  { id: "data-analysis", name: "Data Analysis", description: "Analyze and interpret complex data sets" },
  { id: "research", name: "Research", description: "Find and summarize information on various topics" },
  { id: "translation", name: "Translation", description: "Translate text between different languages" },
  { id: "summarization", name: "Summarization", description: "Create concise summaries of longer content" },
  { id: "sentiment-analysis", name: "Sentiment Analysis", description: "Analyze the sentiment of text" },
  { id: "code-generation", name: "Code Generation", description: "Generate code in various programming languages" },
  { id: "image-analysis", name: "Image Analysis", description: "Analyze and describe images" },
  { id: "financial-analysis", name: "Financial Analysis", description: "Analyze financial data and trends" },
  { id: "creative-writing", name: "Creative Writing", description: "Generate creative content like stories or poems" },
  { id: "qa", name: "Question Answering", description: "Answer questions based on available information" },
  { id: "prediction", name: "Prediction", description: "Make predictions based on historical data" },
]

export default function BotCapabilities({ botData, updateBotData, errors }: BotCapabilitiesProps) {
  const selectedSkills = botData.skills || []

  const toggleSkill = (skillId: string) => {
    const updatedSkills = selectedSkills.includes(skillId)
      ? selectedSkills.filter((id) => id !== skillId)
      : [...selectedSkills, skillId]

    updateBotData({ skills: updatedSkills })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-[#00ff4c] mb-4">Bot Capabilities</h3>
        <p className="text-gray-400 mb-6">
          Select the capabilities your bot will have. These define what tasks your bot can perform.
        </p>
      </div>

      {errors.skills && (
        <div className="p-3 bg-red-900/30 border border-red-500/50 rounded-md mb-4">
          <p className="text-sm text-red-400">{errors.skills}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {skillOptions.map((skill) => (
          <div
            key={skill.id}
            onClick={() => toggleSkill(skill.id)}
            className={`p-4 border ${
              selectedSkills.includes(skill.id)
                ? "border-[#00ff4c] bg-[#00ff4c15]"
                : "border-[#333] hover:border-[#555]"
            } rounded-md cursor-pointer transition-colors`}
          >
            <div className="flex items-center">
              <div
                className={`w-5 h-5 rounded-sm border ${
                  selectedSkills.includes(skill.id) ? "bg-[#00ff4c] border-[#00ff4c]" : "border-gray-500"
                } mr-3 flex items-center justify-center`}
              >
                {selectedSkills.includes(skill.id) && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 text-black"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <h4 className={`font-medium ${selectedSkills.includes(skill.id) ? "text-[#00ff4c]" : "text-white"}`}>
                {skill.name}
              </h4>
            </div>
            <p className="text-sm text-gray-400 mt-2 ml-8">{skill.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
