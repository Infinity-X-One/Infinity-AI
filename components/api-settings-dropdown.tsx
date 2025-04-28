"use client"

import { useState } from "react"
import { saveApiKeyClient } from "@/services/api-keys-client"
import { toast } from "@/hooks/use-toast"

export default function ApiSettingsDropdown() {
  // Component implementation remains the same
  // But now it uses saveApiKeyClient from api-keys-client.ts

  // Rest of the component code...
  const [githubToken, setGithubToken] = useState("")
  const [llamaApiKey, setLlamaApiKey] = useState("")
  const [groqApiKey, setGroqApiKey] = useState("")
  const [supabaseApiKey, setSupabaseApiKey] = useState("")
  const [googleDriveApiKey, setGoogleDriveApiKey] = useState("")
  const [calendarApiKey, setCalendarApiKey] = useState("")
  const [newsApiKey, setNewsApiKey] = useState("")
  const [cryptoAiKey, setCryptoAiKey] = useState("")
  const [marketDataApiKey, setMarketDataApiKey] = useState("")
  const [sentimentApiKey, setSentimentApiKey] = useState("")
  const [open, setOpen] = useState(false)
  const [currentSetting, setCurrentSetting] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Save the API key based on the current setting
      let success = false

      switch (currentSetting) {
        case "github":
          success = await saveApiKeyClient("github_token", githubToken)
          break
        case "llama":
          success = await saveApiKeyClient("llama_api_key", llamaApiKey)
          break
        case "groq":
          success = await saveApiKeyClient("groq_api_key", groqApiKey)
          break
        case "supabase":
          success = await saveApiKeyClient("supabase_api_key", supabaseApiKey)
          break
        case "google-drive":
          success = await saveApiKeyClient("google_drive_api_key", googleDriveApiKey)
          break
        case "calendar":
          success = await saveApiKeyClient("calendar_api_key", calendarApiKey)
          break
        case "news-api":
          success = await saveApiKeyClient("news_api_key", newsApiKey)
          break
        case "crypto-ai":
          success = await saveApiKeyClient("crypto_ai_key", cryptoAiKey)
          break
        case "market-data":
          success = await saveApiKeyClient("market_data_api_key", marketDataApiKey)
          break
        case "sentiment":
          success = await saveApiKeyClient("sentiment_api_key", sentimentApiKey)
          break
      }

      if (success) {
        toast({
          title: "API Key Saved",
          description: "Your API key has been saved successfully.",
        })
        setOpen(false)
      } else {
        throw new Error("Failed to save API key")
      }
    } catch (error) {
      console.error("Error saving API key:", error)
      toast({
        title: "Error",
        description: "Failed to save API key. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Rest of the component code...
}
