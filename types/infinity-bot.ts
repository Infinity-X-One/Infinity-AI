export interface InfinityBot {
  id: string
  name: string
  description: string
  workflowCategory: string
  strengths: string[]
  icon: string
  enabled: boolean
}

export interface BotCategory {
  name: string
  bots: InfinityBot[]
}
