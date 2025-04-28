"use server"

import { AIBrainImplementation } from "@/services/ai-brain-implementation"
import { AIPredictionService } from "@/services/ai-prediction-service"

// Initialize services
const aiBrain = new AIBrainImplementation()
const predictionService = new AIPredictionService()

export async function generatePredictions(symbols: string[], timeframe: string) {
  try {
    // Generate predictions using the AI Brain
    const predictions = await aiBrain.generatePredictions(symbols, timeframe)

    // Store the predictions for future reference
    await predictionService.storePredictions(symbols, timeframe, predictions)

    return {
      success: true,
      data: predictions,
      message: "Predictions generated successfully",
    }
  } catch (error) {
    console.error("Error generating predictions:", error)
    return {
      success: false,
      data: null,
      message: "Failed to generate predictions",
    }
  }
}

export async function getPredictionHistory(symbol: string, limit = 10) {
  try {
    // Get historical predictions for the symbol
    const history = await predictionService.getHistoricalPredictions(symbol, limit)

    return {
      success: true,
      data: history,
      message: "Prediction history retrieved successfully",
    }
  } catch (error) {
    console.error(`Error getting prediction history for ${symbol}:`, error)
    return {
      success: false,
      data: null,
      message: "Failed to retrieve prediction history",
    }
  }
}

export async function getPredictionAccuracy(symbol: string) {
  try {
    // Get accuracy metrics for the symbol
    const accuracy = await predictionService.getAccuracyMetrics(symbol)

    return {
      success: true,
      data: accuracy,
      message: "Prediction accuracy retrieved successfully",
    }
  } catch (error) {
    console.error(`Error getting prediction accuracy for ${symbol}:`, error)
    return {
      success: false,
      data: null,
      message: "Failed to retrieve prediction accuracy",
    }
  }
}
