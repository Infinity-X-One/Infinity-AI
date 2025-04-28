"use client"

import type { Bot } from "@/types/bot"

interface BotBehaviorProps {
  botData: Partial<Bot>
  updateBotData: (data: Partial<Bot>) => void
  errors: Record<string, string>
}

const responseStyles = [
  { id: "concise", name: "Concise", description: "Brief, to-the-point responses" },
  { id: "balanced", name: "Balanced", description: "Moderate detail with clear explanations" },
  { id: "detailed", name: "Detailed", description: "Comprehensive responses with thorough explanations" },
]

const personalityTypes = [
  { id: "helpful", name: "Helpful", description: "Focuses on providing assistance and solutions" },
  { id: "analytical", name: "Analytical", description: "Emphasizes data, logic, and critical thinking" },
  { id: "creative", name: "Creative", description: "Offers innovative and imaginative perspectives" },
  { id: "friendly", name: "Friendly", description: "Warm, approachable, and conversational" },
  { id: "professional", name: "Professional", description: "Formal, business-like communication style" },
]

const knowledgeDomains = [
  { id: "general", name: "General Knowledge", description: "Broad understanding across many topics" },
  { id: "finance", name: "Finance", description: "Financial markets, investing, economics" },
  { id: "technology", name: "Technology", description: "Computing, programming, digital trends" },
  { id: "science", name: "Science", description: "Physics, chemistry, biology, research" },
  { id: "health", name: "Health", description: "Medicine, wellness, nutrition, fitness" },
  { id: "business", name: "Business", description: "Management, strategy, entrepreneurship" },
  { id: "arts", name: "Arts & Culture", description: "Literature, visual arts, music, history" },
  { id: "education", name: "Education", description: "Learning, teaching, academic subjects" },
]

export default function BotBehavior({ botData, updateBotData, errors }: BotBehaviorProps) {
  const behavior = botData.behavior || {
    responseStyle: "balanced",
    personality: "helpful",
    knowledgeDomains: [],
  }

  const updateBehavior = (updates: Partial<typeof behavior>) => {
    updateBotData({
      behavior: { ...behavior, ...updates },
    })
  }

  const toggleKnowledgeDomain = (domainId: string) => {
    const domains = behavior.knowledgeDomains || []
    const updatedDomains = domains.includes(domainId) ? domains.filter((id) => id !== domainId) : [...domains, domainId]

    updateBehavior({ knowledgeDomains: updatedDomains })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-[#00ff4c] mb-4">Bot Behavior</h3>
        <p className="text-gray-400 mb-6">
          Define how your bot communicates and what knowledge domains it specializes in.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-md font-medium text-white mb-3">Response Style</h4>
          <div className="grid grid-cols-3 gap-3">
            {responseStyles.map((style) => (
              <div
                key={style.id}
                onClick={() => updateBehavior({ responseStyle: style.id })}
                className={`p-3 border ${
                  behavior.responseStyle === style.id
                    ? "border-[#00ff4c] bg-[#00ff4c15]"
                    : "border-[#333] hover:border-[#555]"
                } rounded-md cursor-pointer transition-colors`}
              >
                <h5 className={`font-medium ${behavior.responseStyle === style.id ? "text-[#00ff4c]" : "text-white"}`}>
                  {style.name}
                </h5>
                <p className="text-xs text-gray-400 mt-1">{style.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-md font-medium text-white mb-3">Personality</h4>
          <div className="grid grid-cols-3 gap-3">
            {personalityTypes.map((type) => (
              <div
                key={type.id}
                onClick={() => updateBehavior({ personality: type.id })}
                className={`p-3 border ${
                  behavior.personality === type.id
                    ? "border-[#00ff4c] bg-[#00ff4c15]"
                    : "border-[#333] hover:border-[#555]"
                } rounded-md cursor-pointer transition-colors`}
              >
                <h5 className={`font-medium ${behavior.personality === type.id ? "text-[#00ff4c]" : "text-white"}`}>
                  {type.name}
                </h5>
                <p className="text-xs text-gray-400 mt-1">{type.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-md font-medium text-white mb-3">Knowledge Domains</h4>

          {errors.knowledgeDomains && (
            <div className="p-3 bg-red-900/30 border border-red-500/50 rounded-md mb-4">
              <p className="text-sm text-red-400">{errors.knowledgeDomains}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            {knowledgeDomains.map((domain) => {
              const isSelected = (behavior.knowledgeDomains || []).includes(domain.id)
              return (
                <div
                  key={domain.id}
                  onClick={() => toggleKnowledgeDomain(domain.id)}
                  className={`p-3 border ${
                    isSelected ? "border-[#00ff4c] bg-[#00ff4c15]" : "border-[#333] hover:border-[#555]"
                  } rounded-md cursor-pointer transition-colors`}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-5 h-5 rounded-sm border ${
                        isSelected ? "bg-[#00ff4c] border-[#00ff4c]" : "border-gray-500"
                      } mr-3 flex items-center justify-center`}
                    >
                      {isSelected && (
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
                    <h5 className={`font-medium ${isSelected ? "text-[#00ff4c]" : "text-white"}`}>{domain.name}</h5>
                  </div>
                  <p className="text-sm text-gray-400 mt-2 ml-8">{domain.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
