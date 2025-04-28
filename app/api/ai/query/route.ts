import { type NextRequest, NextResponse } from "next/server"
import { AIOrchestrator } from "@/services/ai-orchestrator"
import { getApiKeys } from "@/services/api-keys-server"

export async function POST(request: NextRequest) {
  try {
    const { query, context } = await request.json()

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Invalid query provided" }, { status: 400 })
    }

    // Get API keys
    const apiKeys = await getApiKeys()

    // Initialize AI orchestrator
    const aiOrchestrator = new AIOrchestrator()
    await aiOrchestrator.initialize(apiKeys)

    // Process user query
    const response = await aiOrchestrator.processUserQuery(query, context || {})

    return NextResponse.json({ success: true, data: response })
  } catch (error) {
    console.error("Error processing query:", error)
    return NextResponse.json({ error: "Failed to process query", details: (error as Error).message }, { status: 500 })
  }
}
