export interface Bot {
  id: string
  name: string
  description: string
  icon: string
  category: string
  personality: string
  responseLength: string
  temperature: number
  enabled: boolean
  skills?: string[]
  behavior?: {
    responseStyle: "precise" | "balanced" | "creative"
    personality: string
    knowledgeDomains: string[]
  }
  systemPrompt?: string
  samplePrompts?: {
    id: string
    name: string
    prompt: string
  }[]
  directives?: string[]
  lastInstruction?: string
  lastInstructionTime?: Date
}
