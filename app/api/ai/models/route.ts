import { type NextRequest, NextResponse } from "next/server"

// This endpoint provides information about available AI models
export async function GET(request: NextRequest) {
  const models = [
    {
      id: "gpt-4o",
      name: "GPT-4o",
      provider: "OpenAI",
      capabilities: ["general", "financial", "sentiment", "prediction"],
      description: "Advanced general-purpose model with strong financial reasoning",
      costPerToken: 0.00005,
    },
    {
      id: "claude-3-opus",
      name: "Claude 3 Opus",
      provider: "Anthropic",
      capabilities: ["general", "financial", "sentiment", "prediction"],
      description: "High-performance model with excellent financial analysis",
      costPerToken: 0.00006,
    },
    {
      id: "mistral-large",
      name: "Mistral Large",
      provider: "Mistral AI",
      capabilities: ["general", "financial", "sentiment"],
      description: "Powerful model with good financial understanding",
      costPerToken: 0.00003,
    },
    {
      id: "finbert",
      name: "FinBERT",
      provider: "Custom",
      capabilities: ["sentiment"],
      description: "Specialized model for financial sentiment analysis",
      costPerToken: 0.00001,
    },
    {
      id: "prophet",
      name: "Prophet",
      provider: "Facebook",
      capabilities: ["prediction"],
      description: "Time series forecasting model for financial predictions",
      costPerToken: 0,
    },
  ]

  return NextResponse.json({ models })
}
