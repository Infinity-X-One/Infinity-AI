"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AIIntegration() {
  const [apiKeys, setApiKeys] = useState({
    openai: "",
    mistral: "",
    groq: "",
    anthropic: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setApiKeys((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = () => {
    // In a real app, this would securely store the API keys
    console.log("Saving API keys:", apiKeys)
    // Show success message
    alert("API keys saved successfully!")
  }

  return (
    <Card className="w-full max-w-md bg-black/80 backdrop-blur-sm border-[#00ff4c33]">
      <CardHeader>
        <CardTitle className="text-[#00ff4c] drop-shadow-[0_0_5px_rgba(0,255,76,0.6)]">AI Model Integration</CardTitle>
        <CardDescription className="text-white">
          Connect to your preferred AI models by adding your API keys
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="openai" className="text-[#00ff4c]">
            OpenAI API Key
          </Label>
          <Input
            id="openai"
            name="openai"
            value={apiKeys.openai}
            onChange={handleChange}
            type="password"
            placeholder="sk-..."
            className="bg-black/50 border-[#00ff4c33] focus:border-[#00ff4c] text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mistral" className="text-[#00ff4c]">
            Mistral API Key
          </Label>
          <Input
            id="mistral"
            name="mistral"
            value={apiKeys.mistral}
            onChange={handleChange}
            type="password"
            placeholder="Enter your Mistral API key"
            className="bg-black/50 border-[#00ff4c33] focus:border-[#00ff4c] text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="groq" className="text-[#00ff4c]">
            Groq API Key
          </Label>
          <Input
            id="groq"
            name="groq"
            value={apiKeys.groq}
            onChange={handleChange}
            type="password"
            placeholder="Enter your Groq API key"
            className="bg-black/50 border-[#00ff4c33] focus:border-[#00ff4c] text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="anthropic" className="text-[#00ff4c]">
            Anthropic API Key
          </Label>
          <Input
            id="anthropic"
            name="anthropic"
            value={apiKeys.anthropic}
            onChange={handleChange}
            type="password"
            placeholder="Enter your Anthropic API key"
            className="bg-black/50 border-[#00ff4c33] focus:border-[#00ff4c] text-white"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} className="w-full neon-button">
          Save API Keys
        </Button>
      </CardFooter>
    </Card>
  )
}
