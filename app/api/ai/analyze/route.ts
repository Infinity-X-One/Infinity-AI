import { type NextRequest, NextResponse } from "next/server"
import { AIOrchestrator } from "@/services/ai-orchestrator"
import { getApiKeys } from "@/services/api-keys-server"

export async function POST(request: NextRequest) {
  try {
    const { symbols, type } = await request.json()

    if (!symbols || !Array.isArray(symbols) || symbols.length === 0) {
      return NextResponse.json({ error: "Invalid symbols provided" }, { status: 400 })
    }

    if (!type || !["market", "sentiment", "prediction"].includes(type)) {
      return NextResponse.json({ error: "Invalid analysis type" }, { status: 400 })
    }

    // Get API keys
    const apiKeys = await getApiKeys()

    // Initialize AI orchestrator
    const aiOrchestrator = new AIOrchestrator()
    await aiOrchestrator.initialize(apiKeys)

    // Perform requested analysis
    let result

    switch (type) {
      case "market":
        result = await aiOrchestrator.analyzeMarketData(symbols)
        break
      case "sentiment":
        result = await aiOrchestrator.analyzeSentiment(symbols)
        break
      case "prediction":
        result = await aiOrchestrator.generatePredictions(symbols, "1w")
        break
    }

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error("Error in AI analysis:", error)
    return NextResponse.json(
      { error: "Failed to perform analysis", details: (error as Error).message },
      { status: 500 },
    )
  }
}
