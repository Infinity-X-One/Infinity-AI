export interface WorkflowStep {
  id: string
  type: "bot" | "action"
  name: string
  icon: string
  botId?: string
  actionId?: string
  config?: Record<string, any>
}

export interface Workflow {
  id: string
  name: string
  steps: WorkflowStep[]
}
