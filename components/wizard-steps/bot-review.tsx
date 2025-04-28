import type { Bot } from "@/types/bot"
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
} from "lucide-react"

interface BotReviewProps {
  botData: Partial<Bot>
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
}

export default function BotReview({ botData }: BotReviewProps) {
  const IconComponent = iconComponents[botData.icon || "Bot"] || BotIcon

  const getSkillNames = () => {
    const skillMap: Record<string, string> = {
      "text-generation": "Text Generation",
      "data-analysis": "Data Analysis",
      research: "Research",
      translation: "Translation",
      summarization: "Summarization",
      "sentiment-analysis": "Sentiment Analysis",
      "code-generation": "Code Generation",
      "image-analysis": "Image Analysis",
      "financial-analysis": "Financial Analysis",
      "creative-writing": "Creative Writing",
      qa: "Question Answering",
      prediction: "Prediction",
    }

    return (botData.skills || []).map((id) => skillMap[id] || id).join(", ")
  }

  const getDomainNames = () => {
    const domainMap: Record<string, string> = {
      general: "General Knowledge",
      finance: "Finance",
      technology: "Technology",
      science: "Science",
      health: "Health",
      business: "Business",
      arts: "Arts & Culture",
      education: "Education",
    }

    return (botData.behavior?.knowledgeDomains || []).map((id) => domainMap[id] || id).join(", ")
  }

  const getPersonalityName = () => {
    const personalityMap: Record<string, string> = {
      helpful: "Helpful",
      analytical: "Analytical",
      creative: "Creative",
      friendly: "Friendly",
      professional: "Professional",
    }

    return personalityMap[botData.behavior?.personality || ""] || botData.behavior?.personality
  }

  const getResponseStyleName = () => {
    const styleMap: Record<string, string> = {
      concise: "Concise",
      balanced: "Balanced",
      detailed: "Detailed",
    }

    return styleMap[botData.behavior?.responseStyle || ""] || botData.behavior?.responseStyle
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-[#00ff4c] mb-4">Review Your Bot</h3>
        <p className="text-gray-400 mb-6">Review your bot configuration before creating it.</p>
      </div>

      <div className="bg-[#0f0f0f] border border-[#333] rounded-lg overflow-hidden">
        <div className="p-6 border-b border-[#333] flex items-center">
          <div className="w-12 h-12 rounded-full bg-[#00ff4c20] flex items-center justify-center mr-4">
            <IconComponent size={24} className="text-[#00ff4c]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{botData.name}</h2>
            <p className="text-gray-400">{botData.description}</p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-1">Capabilities</h4>
            <p className="text-white">{getSkillNames() || "None selected"}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-1">Knowledge Domains</h4>
            <p className="text-white">{getDomainNames() || "None selected"}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-1">Personality</h4>
              <p className="text-white">{getPersonalityName() || "Not specified"}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-1">Response Style</h4>
              <p className="text-white">{getResponseStyleName() || "Not specified"}</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-1">External Connections</h4>
            {botData.connections && botData.connections.length > 0 ? (
              <ul className="list-disc list-inside text-white">
                {botData.connections.map((conn) => (
                  <li key={conn.id}>{conn.name}</li>
                ))}
              </ul>
            ) : (
              <p className="text-white">No external connections</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-[#00ff4c10] border border-[#00ff4c33] rounded-md p-4">
        <h4 className="text-[#00ff4c] font-medium mb-2">Ready to create your bot?</h4>
        <p className="text-gray-300">
          Click the "Create Bot" button below to add this bot to your collection. You can always edit its settings
          later.
        </p>
      </div>
    </div>
  )
}
