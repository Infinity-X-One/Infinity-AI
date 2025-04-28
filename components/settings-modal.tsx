"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Github,
  Database,
  Mail,
  HardDrive,
  Cloud,
  Calendar,
  LineChart,
  Newspaper,
  CreditCard,
  BrainCircuit,
  Lock,
  Save,
  Plus,
  X,
} from "lucide-react"
import { saveApiKeyClient } from "@/services/api-keys-client"

interface SettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  // Component implementation remains the same
  // But now it would use saveApiKeyClient from api-keys-client.ts if needed

  // Rest of the component code...

  // Tab management
  const [activeTab, setActiveTab] = useState("github")
  const [customCategories, setCustomCategories] = useState<string[]>([])
  const [newCategoryName, setNewCategoryName] = useState("")

  // Custom API keys management
  const [customApiKeys, setCustomApiKeys] = useState<Record<string, { name: string; value: string }[]>>({
    github: [],
    supabase: [],
    google: [],
    ai: [],
    financial: [],
    news: [],
    crypto: [],
  })
  const [newKeyName, setNewKeyName] = useState("")
  const [newKeyValue, setNewKeyValue] = useState("")

  // Add a new custom category
  const handleAddCategory = () => {
    if (newCategoryName.trim() === "") return

    const categoryId = newCategoryName.toLowerCase().replace(/\s+/g, "-")

    if (
      !customCategories.includes(categoryId) &&
      !["github", "supabase", "google", "ai", "financial", "news", "crypto"].includes(categoryId)
    ) {
      setCustomCategories([...customCategories, categoryId])
      setCustomApiKeys({
        ...customApiKeys,
        [categoryId]: [],
      })
      setNewCategoryName("")
      setActiveTab(categoryId)
    }
  }

  // Add a new API key to a category
  const handleAddApiKey = (category: string) => {
    if (newKeyName.trim() === "" || newKeyValue.trim() === "") return

    setCustomApiKeys({
      ...customApiKeys,
      [category]: [...(customApiKeys[category] || []), { name: newKeyName, value: newKeyValue }],
    })

    setNewKeyName("")
    setNewKeyValue("")
  }

  // Remove a custom API key
  const handleRemoveApiKey = (category: string, index: number) => {
    const updatedKeys = [...customApiKeys[category]]
    updatedKeys.splice(index, 1)

    setCustomApiKeys({
      ...customApiKeys,
      [category]: updatedKeys,
    })
  }

  // Remove a custom category
  const handleRemoveCategory = (categoryId: string) => {
    const updatedCategories = customCategories.filter((cat) => cat !== categoryId)
    const updatedApiKeys = { ...customApiKeys }
    delete updatedApiKeys[categoryId]

    setCustomCategories(updatedCategories)
    setCustomApiKeys(updatedApiKeys)
    setActiveTab("github") // Reset to default tab
  }

  // GitHub settings
  const [githubToken, setGithubToken] = useState("")

  // Supabase settings
  const [supabaseUrl, setSupabaseUrl] = useState("")
  const [supabaseKey, setSupabaseKey] = useState("")

  // Google settings
  const [gmailApiKey, setGmailApiKey] = useState("")
  const [googleDriveApiKey, setGoogleDriveApiKey] = useState("")
  const [googleCloudApiKey, setGoogleCloudApiKey] = useState("")
  const [googleCalendarApiKey, setGoogleCalendarApiKey] = useState("")

  // AI Model settings
  const [openAiKey, setOpenAiKey] = useState("")
  const [anthropicKey, setAnthropicKey] = useState("")
  const [mistralKey, setMistralKey] = useState("")
  const [groqKey, setGroqKey] = useState("")
  const [llamaKey, setLlamaKey] = useState("")

  // Financial API settings
  const [alphaVantageKey, setAlphaVantageKey] = useState("")
  const [finnhubKey, setFinnhubKey] = useState("")
  const [polygonKey, setPolygonKey] = useState("")
  const [tradingViewKey, setTradingViewKey] = useState("")
  const [yahooFinanceKey, setYahooFinanceKey] = useState("")

  // News API settings
  const [newsApiKey, setNewsApiKey] = useState("")
  const [bloombergApiKey, setBloombergApiKey] = useState("")
  const [reutersApiKey, setReutersApiKey] = useState("")

  // Crypto API settings
  const [coinMarketCapKey, setCoinMarketCapKey] = useState("")
  const [coinGeckoKey, setCoinGeckoKey] = useState("")
  const [binanceKey, setBinanceKey] = useState("")

  // Save all settings
  const handleSaveAll = async () => {
    // In a real app, this would securely store all API keys
    console.log("Saving all API settings")

    // Example of saving GitHub token using the client API
    if (githubToken) {
      await saveApiKeyClient("github_token", githubToken)
    }

    // Show success message
    alert("All API settings saved successfully!")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black border-[#00ff4c33] text-white max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#00ff4c] drop-shadow-[0_0_5px_rgba(0,255,76,0.6)]">
            API Settings
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Configure all your API connections in one place
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="github" className="w-full mt-4">
          <TabsList
            className={`grid ${customCategories.length > 0 ? `grid-cols-${Math.min(customCategories.length + 7, 9)}` : "grid-cols-7"} mb-8 bg-black/50 border border-[#00ff4c33] overflow-x-auto`}
          >
            <TabsTrigger
              value="github"
              className="data-[state=active]:bg-[#00ff4c20] data-[state=active]:text-[#00ff4c] text-white"
              onClick={() => setActiveTab("github")}
            >
              GitHub
            </TabsTrigger>
            <TabsTrigger
              value="supabase"
              className="data-[state=active]:bg-[#00ff4c20] data-[state=active]:text-[#00ff4c] text-white"
              onClick={() => setActiveTab("supabase")}
            >
              Supabase
            </TabsTrigger>
            <TabsTrigger
              value="google"
              className="data-[state=active]:bg-[#00ff4c20] data-[state=active]:text-[#00ff4c] text-white"
              onClick={() => setActiveTab("google")}
            >
              Google
            </TabsTrigger>
            <TabsTrigger
              value="ai"
              className="data-[state=active]:bg-[#00ff4c20] data-[state=active]:text-[#00ff4c] text-white"
              onClick={() => setActiveTab("ai")}
            >
              AI Models
            </TabsTrigger>
            <TabsTrigger
              value="financial"
              className="data-[state=active]:bg-[#00ff4c20] data-[state=active]:text-[#00ff4c] text-white"
              onClick={() => setActiveTab("financial")}
            >
              Financial
            </TabsTrigger>
            <TabsTrigger
              value="news"
              className="data-[state=active]:bg-[#00ff4c20] data-[state=active]:text-[#00ff4c] text-white"
              onClick={() => setActiveTab("news")}
            >
              News
            </TabsTrigger>
            <TabsTrigger
              value="crypto"
              className="data-[state=active]:bg-[#00ff4c20] data-[state=active]:text-[#00ff4c] text-white"
              onClick={() => setActiveTab("crypto")}
            >
              Crypto
            </TabsTrigger>
            {customCategories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="data-[state=active]:bg-[#00ff4c20] data-[state=active]:text-[#00ff4c] text-white relative group"
                onClick={() => setActiveTab(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, " ")}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemoveCategory(category)
                  }}
                  className="absolute -top-1 -right-1 bg-black/80 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} className="text-[#00ff4c]" />
                </button>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* GitHub Tab */}
          <TabsContent value="github">
            <Card className="bg-black/80 backdrop-blur-sm border-[#00ff4c33]">
              <CardHeader>
                <CardTitle className="flex items-center text-[#00ff4c] drop-shadow-[0_0_5px_rgba(0,255,76,0.6)]">
                  <Github className="mr-2" size={20} />
                  GitHub Integration
                </CardTitle>
                <CardDescription className="text-gray-400">Connect to GitHub repositories and services</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="github-token" className="text-[#00ff4c]">
                    GitHub Personal Access Token
                  </Label>
                  <Input
                    id="github-token"
                    value={githubToken}
                    onChange={(e) => setGithubToken(e.target.value)}
                    type="password"
                    placeholder="ghp_..."
                    className="bg-black/50 border-[#00ff4c33] focus:border-[#00ff4c] text-white"
                  />
                  <p className="text-xs text-gray-400">
                    Create a token with repo, workflow, and user scopes at{" "}
                    <a
                      href="https://github.com/settings/tokens"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#00ff4c]"
                    >
                      github.com/settings/tokens
                    </a>
                  </p>
                </div>
                <Button className="w-full neon-button">
                  <Save size={16} className="mr-2" /> Save GitHub Settings
                </Button>
                <div className="mt-6 pt-6 border-t border-[#00ff4c33]">
                  <h3 className="text-[#00ff4c] mb-4 flex items-center">
                    <Plus size={16} className="mr-2" />
                    Add Custom API Key
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-key-name" className="text-[#00ff4c]">
                        API Key Name
                      </Label>
                      <Input
                        id="new-key-name"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        placeholder="Enter API key name"
                        className="bg-black/50 border-[#00ff4c33] focus:border-[#00ff4c] text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-key-value" className="text-[#00ff4c]">
                        API Key Value
                      </Label>
                      <Input
                        id="new-key-value"
                        value={newKeyValue}
                        onChange={(e) => setNewKeyValue(e.target.value)}
                        type="password"
                        placeholder="Enter API key value"
                        className="bg-black/50 border-[#00ff4c33] focus:border-[#00ff4c] text-white"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={() => handleAddApiKey("github")}
                    className="w-full neon-button"
                    disabled={!newKeyName || !newKeyValue}
                  >
                    <Plus size={16} className="mr-2" /> Add Custom Key
                  </Button>

                  {customApiKeys["github"] && customApiKeys["github"].length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-[#00ff4c] mb-2">Custom API Keys</h4>
                      <div className="space-y-3">
                        {customApiKeys["github"].map((key, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-black/30 p-3 rounded border border-[#00ff4c33]"
                          >
                            <div>
                              <p className="text-white font-medium">{key.name}</p>
                              <p className="text-gray-400 text-sm">••••••••{key.value.slice(-4)}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveApiKey("github", index)}
                              className="hover:bg-red-900/20 hover:text-red-400"
                            >
                              <X size={16} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Supabase Tab */}
          <TabsContent value="supabase">
            <Card className="bg-black/80 backdrop-blur-sm border-[#00ff4c33]">
              <CardHeader>
                <CardTitle className="flex items-center text-[#00ff4c] drop-shadow-[0_0_5px_rgba(0,255,76,0.6)]">
                  <Database className="mr-2" size={20} />
                  Supabase Integration
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Connect to your Supabase database and authentication
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="supabase-url" className="text-[#00ff4c]">
                    Supabase URL
                  </Label>
                  <Input
                    id="supabase-url"
                    value={supabaseUrl}
                    onChange={(e) => setSupabaseUrl(e.target.value)}
                    placeholder="https://your-project.supabase.co"
                    className="bg-black/50 border-[#00ff4c33] focus:border-[#00ff4c] text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supabase-key" className="text-[#00ff4c]">
                    Supabase API Key
                  </Label>
                  <Input
                    id="supabase-key"
                    value={supabaseKey}
                    onChange={(e) => setSupabaseKey(e.target.value)}
                    type="password"
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="bg-black/50 border-[#00ff4c33] focus:border-[#00ff4c] text-white"
                  />
                  <p className="text-xs text-gray-400">
                    Find your API keys in the Supabase dashboard under Project Settings → API
                  </p>
                </div>
                <Button className="w-full neon-button">
                  <Save size={16} className="mr-2" /> Save Supabase Settings
                </Button>
                <div className="mt-6 pt-6 border-t border-[#00ff4c33]">
                  <h3 className="text-[#00ff4c] mb-4 flex items-center">
                    <Plus size={16} className="mr-2" />
                    Add Custom API Key
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-key-name" className="text-[#00ff4c]">
                        API Key Name
                      </Label>
                      <Input
                        id="new-key-name"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        placeholder="Enter API key name"
                        className="bg-black/50 border-[#00ff4c33] focus:border-[#00ff4c] text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-key-value" className="text-[#00ff4c]">
                        API Key Value
                      </Label>
                      <Input
                        id="new-key-value"
                        value={newKeyValue}
                        onChange={(e) => setNewKeyValue(e.target.value)}
                        type="password"
                        placeholder="Enter API key value"
                        className="bg-black/50 border-[#00ff4c33] focus:border-[#00ff4c] text-white"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={() => handleAddApiKey("supabase")}
                    className="w-full neon-button"
                    disabled={!newKeyName || !newKeyValue}
                  >
                    <Plus size={16} className="mr-2" /> Add Custom Key
                  </Button>

                  {customApiKeys["supabase"] && customApiKeys["supabase"].length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-[#00ff4c] mb-2">Custom API Keys</h4>
                      <div className="space-y-3">
                        {customApiKeys["supabase"].map((key, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-black/30 p-3 rounded border border-[#00ff4c33]"
                          >
                            <div>
                              <p className="text-white font-medium">{key.name}</p>
                              <p className="text-gray-400 text-sm">••••••••{key.value.slice(-4)}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveApiKey("supabase", index)}
                              className="hover:bg-red-900/20 hover:text-red-400"
                            >
                              <X size={16} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Google Tab */}
          <TabsContent value="google">
            <Card className="bg-black/80 backdrop-blur-sm border-[#00ff4c33]">
              <CardHeader>
                <CardTitle className="flex items-center text-[#00ff4c] drop-shadow-[0_0_5px_rgba(0,255,76,0.6)]">
                  Google Services Integration
                </CardTitle>
                <CardDescription className="text-gray-400">Connect to various Google services</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Mail className="mr-2 text-[#00ff4c]" size={20} />
                    <Label htmlFor="gmail-api" className="text-[#00ff4c] text-lg">
                      Gmail API
                    </Label>
                  </div>
                  <Input
                    id="gmail-api"
                    value={gmailApiKey}
                    onChange={(e) => setGmailApiKey(e.target.value)}
                    type="password"
                    placeholder="Enter your Gmail API key"
                    className="bg-black/50 border-[#00ff4c33] focus:border-[#00ff4c] text-white"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <HardDrive className="mr-2 text-[#00ff4c]" size={20} />
                    <Label htmlFor="drive-api" className="text-[#00ff4c] text-lg">
                      Google Drive API
                    </Label>
                  </div>
                  <Input
                    id="drive-api"
                    value={googleDriveApiKey}
                    onChange={(e) => setGoogleDriveApiKey(e.target.value)}
                    type="password"
                    placeholder="Enter your Google Drive API key"
                    className="bg-black/50 border-[#00ff4c33] focus:border-[#00ff4c] text-white"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <Cloud className="mr-2 text-[#00ff4c]" size={20} />
                    <Label htmlFor="cloud-api" className="text-[#00ff4c] text-lg">
                      Google Cloud API
                    </Label>
                  </div>
                  <Input
                    id="cloud-api"
                    value={googleCloudApiKey}
                    onChange={(e) => setGoogleCloudApiKey(e.target.value)}
                    type="password"
                    placeholder="Enter your Google Cloud API key"
                    className="bg-black/50 border-[#00ff4c33] focus:border-[#00ff4c] text-white"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <Calendar className="mr-2 text-[#00ff4c]" size={20} />
                    <Label htmlFor="calendar-api" className="text-[#00ff4c] text-lg">
                      Google Calendar API
                    </Label>
                  </div>
                  <Input
                    id="calendar-api"
                    value={googleCalendarApiKey}
                    onChange={(e) => setGoogleCalendarApiKey(e.target.value)}
                    type="password"
                    placeholder="Enter your Google Calendar API key"
                    className="bg-black/50 border-[#00ff4c33] focus:border-[#00ff4c] text-white"
                  />
                </div>

                <Button className="w-full neon-button">
                  <Save size={16} className="mr-2" /> Save Google Settings
                </Button>
                <div className="mt-6 pt-6 border-t border-[#00ff4c33]">
                  <h3 className="text-[#00ff4c] mb-4 flex items-center">
                    <Plus size={16} className="mr-2" />
                    Add Custom API Key
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-key-name" className="text-[#00ff4c]">
                        API Key Name
                      </Label>
                      <Input
                        id="new-key-name"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        placeholder="Enter API key name"
                        className="bg-black/50 border-[#00ff4c33] focus:border-[#00ff4c] text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-key-value" className="text-[#00ff4c]">
                        API Key Value
                      </Label>
                      <Input
                        id="new-key-value"
                        value={newKeyValue}
                        onChange={(e) => setNewKeyValue(e.target.value)}
                        type="password"
                        placeholder="Enter API key value"
                        className="bg-black/50 border-[#00ff4c33] focus:border-[#00ff4c] text-white"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={() => handleAddApiKey("google")}
                    className="w-full neon-button"
                    disabled={!newKeyName || !newKeyValue}
                  >
                    <Plus size={16} className="mr-2" /> Add Custom Key
                  </Button>

                  {customApiKeys["google"] && customApiKeys["google"].length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-[#00ff4c] mb-2">Custom API Keys</h4>
                      <div className="space-y-3">
                        {customApiKeys["google"].map((key, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-black/30 p-3 rounded border border-[#00ff4c33]"
                          >
                            <div>
                              <p className="text-white font-medium">{key.name}</p>
                              <p className="text-gray-400 text-sm">••••••••{key.value.slice(-4)}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveApiKey("google", index)}
                              className="hover:bg-red-900/20 hover:text-red-400"
                            >
                              <X size={16} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Models Tab */}
          <TabsContent value="ai">
            <Card className="bg-black/80 backdrop-blur-sm border-[#00ff4c33]">
              <CardHeader>
                <CardTitle className="flex items-center text-[#00ff4c] drop-shadow-[0_0_5px_rgba(0,255,76,0.6)]">
                  <BrainCircuit className="mr-2" size={20} />
                  AI Model Integration
                </CardTitle>
                <CardDescription className="text-gray-400">Connect to various AI models and services</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label htmlFor="openai-key" className="text-[#00ff4c]">
                    OpenAI API Key
                  </Label>
                  <Input
                    id="openai-key"
                    value={openAiKey}
                    onChange={(e) => setOpenAiKey(e.target.value)}
                    type="password"
                    placeholder="sk-..."
                    className="bg-black/50 border-[#00ff4c33] focus:border-[#00ff4c] text-white"
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="anthropic-key" className="text-[#00ff4c]">
                    Anthropic API Key
                  </Label>
                  <Input
                    id="anthropic-key"
                    value={anthropicKey}
                    onChange={(e) => setAnthropicKey(e.target.value)}
                    type="password"
                    placeholder="sk_ant_..."
                    className="bg-black/50 border-[#00ff4c33] focus:border-[#00ff4c] text-white"
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="mistral-key" className="text-[#00ff4c]">
                    Mistral API Key
                  </Label>
                  <Input
                    id="mistral-key"
                    value={mistralKey}
                    onChange={(e) => setMistralKey(e.target.value)}
                    type="password"
                    placeholder="Enter your Mistral API key"
                    className="bg-black/50 border-[#00ff4c33] focus:border-[#00ff4c] text-white"
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="groq-key" className="text-[#00ff4c]">
                    Groq API Key
                  </Label>
                  <Input
                    id="groq-key"
                    value={groqKey}
                    onChange={(e) => setGroqKey(e.target.value)}
                    type="password"
                    placeholder="Enter your Groq API key"
                    className="bg-black/50 border-[#00ff4c33] focus:border-[#00ff4c] text-white"
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="llama-key" className="text-[#00ff4c]">
                    Llama API Key
                  </Label>
                  <Input
                    id="llama-key"
                    value={llamaKey}
                    onChange={(e) => setLlamaKey(e.target.value)}
                    type="password"
                    placeholder="Enter your Llama API key"
                    className="bg-black/50 border-[#00ff4c33] focus:border-[#00ff4c] text-white"
                  />
                </div>

                <Button className="w-full neon-button">
                  <Save size={16} className="mr-2" /> Save AI Model Settings
                </Button>
                <div className="mt-6 pt-6 border-t border-[#00ff4c33]">
                  <h3 className="text-[#00ff4c] mb-4 flex items-center">
                    <Plus size={16} className="mr-2" />
                    Add Custom API Key
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-key-name" className="text-[#00ff4c]">
                        API Key Name
                      </Label>
                      <Input
                        id="new-key-name"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        placeholder="Enter API key name"
                        className="bg-black/50 border-[#00ff4c33] focus:border-[#00ff4c] text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-key-value" className="text-[#00ff4c]">
                        API Key Value
                      </Label>
                      <Input
                        id="new-key-value"
                        value={newKeyValue}
                        onChange={(e) => setNewKeyValue(e.target.value)}
                        type="password"
                        placeholder="Enter API key value"
                        className="bg-black/50 border-[#00ff4c33] focus:border-[#00ff4c] text-white"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={() => handleAddApiKey("ai")}
                    className="w-full neon-button"
                    disabled={!newKeyName || !newKeyValue}
                  >
                    <Plus size={16} className="mr-2" /> Add Custom Key
                  </Button>

                  {customApiKeys["ai"] && customApiKeys["ai"].length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-[#00ff4c] mb-2">Custom API Keys</h4>
                      <div className="space-y-3">
                        {customApiKeys["ai"].map((key, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-black/30 p-3 rounded border border-[#00ff4c33]"
                          >
                            <div>
                              <p className="text-white font-medium">{key.name}</p>
                              <p className="text-gray-400 text-sm">••••••••{key.value.slice(-4)}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveApiKey("ai", index)}
                              className="hover:bg-red-900/20 hover:text-red-400"
                            >
                              <X size={16} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Financial Tab */}
          <TabsContent value="financial">
            <Card className="bg-black/80 backdrop-blur-sm border-[#00ff4c33]">
              <CardHeader>
                <CardTitle className="flex items-center text-[#00ff4c] drop-shadow-[0_0_5px_rgba(0,255,76,0.6)]">
                  <LineChart className="mr-2" size={20} />
                  Financial API Integration
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Connect to financial data providers and trading platforms
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label htmlFor="alphavantage-key" className="text-[#00ff4c]">
                    Alpha Vantage API Key
                  </Label>
                  <Input
                    id="alphavantage-key"
                    value={alphaVantageKey}
                    onChange={(e) => setAlphaVantageKey(e.target.value)}
                    type="password"
                    placeholder="Enter your Alpha Vantage API key"
                    className="bg-black/50 border-[#00ff4c33] focus:border-[#00ff4c] text-white"
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="finnhub-key" className="text-[#00ff4c]">
                    Finnhub API Key
                  </Label>
                  <Input
                    id="finnhub-key"
                    value={finnhubKey}
                    onChange={(e) => setFinnhubKey(e.target.value)}
                    type="password"
                    placeholder="Enter your Finnhub API key"
                    className="bg-black/50 border-[#00ff4c33] focus:border-[#00ff4c] text-white"
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="polygon-key" className="text-[#00ff4c]">
                    Polygon.io API Key
                  </Label>
                  <Input
                    id="polygon-key"
                    value={polygonKey}
                    onChange={(e) => setPolygonKey(e.target.value)}
                    type="password"
                    placeholder="Enter your Polygon.io API key"
                    className="bg-black/50 border-[#00ff4c33] focus:border-[#00ff4c] text-white"
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="tradingview-key" className="text-[#00ff4c]">
                    TradingView API Key
                  </Label>
                  <Input
                    id="tradingview-key"
                    value={tradingViewKey}
                    onChange={(e) => setTradingViewKey(e.target.value)}
                    type="password"
                    placeholder="Enter your TradingView API key"
                    className="bg-black/50 border-[#00ff4c33] focus:border-[#00ff4c] text-white"
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="yahoo-finance-key" className="text-[#00ff4c]">
                    Yahoo Finance API Key
                  </Label>
                  <Input
                    id="yahoo-finance-key"
                    value={yahooFinanceKey}
                    onChange={(e) => setYahooFinanceKey(e.target.value)}
                    type="password"
                    placeholder="Enter your Yahoo Finance API key"
                    className="bg-black/50 border-[#00ff4c33] focus:border-[#00ff4c] text-white"
                  />
                </div>

                <Button className="w-full neon-button">
                  <Save size={16} className="mr-2" /> Save Financial API Settings
                </Button>
                <div className="mt-6 pt-6 border-t border-[#00ff4c33]">
                  <h3 className="text-[#00ff4c] mb-4 flex items-center">
                    <Plus size={16} className="mr-2" />
                    Add Custom API Key
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-key-name" className="text-[#00ff4c]">
                        API Key Name
                      </Label>
                      <Input
                        id="new-key-name"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        placeholder="Enter API key name"
                        className="bg-black/50 border-[#00ff4c33] focus:border-[#00ff4c] text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-key-value" className="text-[#00ff4c]">
                        API Key Value
                      </Label>
                      <Input
                        id="new-key-value"
                        value={newKeyValue}
                        onChange={(e) => setNewKeyValue(e.target.value)}
                        type="password"
                        placeholder="Enter API key value"
                        className="bg-black/50 border-[#00ff4c33] focus:border-[#00ff4c] text-white"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={() => handleAddApiKey("financial")}
                    className="w-full neon-button"
                    disabled={!newKeyName || !newKeyValue}
                  >
                    <Plus size={16} className="mr-2" /> Add Custom Key
                  </Button>

                  {customApiKeys["financial"] && customApiKeys["financial"].length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-[#00ff4c] mb-2">Custom API Keys</h4>
                      <div className="space-y-3">
                        {customApiKeys["financial"].map((key, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-black/30 p-3 rounded border border-[#00ff4c33]"
                          >
                            <div>
                              <p className="text-white font-medium">{key.name}</p>
                              <p className="text-gray-400 text-sm">••••••••{key.value.slice(-4)}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveApiKey("financial", index)}
                              className="hover:bg-red-900/20 hover:text-red-400"
                            >
                              <X size={16} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* News Tab */}
          <TabsContent value="news">
            <Card className="bg-black/80 backdrop-blur-sm border-[#00ff4c33]">
              <CardHeader>
                <CardTitle className="flex items-center text-[#00ff4c] drop-shadow-[0_0_5px_rgba(0,255,76,0.6)]">
                  <Newspaper className="mr-2" size={20} />
                  News API Integration
                </CardTitle>
                <CardDescription className="text-gray-400">Connect to news providers and media sources</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label htmlFor="news-api-key" className="text-[#00ff4c]">
                    News API Key
                  </Label>
                  <Input
                    id="news-api-key"
                    value={newsApiKey}
                    onChange={(e) => setNewsApiKey(e.target.value)}
                    type="password"
                    placeholder="Enter your News API key"
                    className="bg-black/50 border-[#00ff4c33] focus:border-[#00ff4c] text-white"
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="bloomberg-key" className="text-[#00ff4c]">
                    Bloomberg API Key
                  </Label>
                  <Input
                    id="bloomberg-key"
                    value={bloombergApiKey}
                    onChange={(e) => setBloombergApiKey(e.target.value)}
                    type="password"
                    placeholder="Enter your Bloomberg API key"
                    className="bg-black/50 border-[#00ff4c33] focus:border-[#00ff4c] text-white"
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="reuters-key" className="text-[#00ff4c]">
                    Reuters API Key
                  </Label>
                  <Input
                    id="reuters-key"
                    value={reutersApiKey}
                    onChange={(e) => setReutersApiKey(e.target.value)}
                    type="password"
                    placeholder="Enter your Reuters API key"
                    className="bg-black/50 border-[#00ff4c33] focus:border-[#00ff4c] text-white"
                  />
                </div>

                <Button className="w-full neon-button">
                  <Save size={16} className="mr-2" /> Save News API Settings
                </Button>
                <div className="mt-6 pt-6 border-t border-[#00ff4c33]">
                  <h3 className="text-[#00ff4c] mb-4 flex items-center">
                    <Plus size={16} className="mr-2" />
                    Add Custom API Key
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-key-name" className="text-[#00ff4c]">
                        API Key Name
                      </Label>
                      <Input
                        id="new-key-name"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        placeholder="Enter API key name"
                        className="bg-black/50 border-[#00ff4c33] focus:border-[#00ff4c] text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-key-value" className="text-[#00ff4c]">
                        API Key Value
                      </Label>
                      <Input
                        id="new-key-value"
                        value={newKeyValue}
                        onChange={(e) => setNewKeyValue(e.target.value)}
                        type="password"
                        placeholder="Enter API key value"
                        className="bg-black/50 border-[#00ff4c33] focus:border-[#00ff4c] text-white"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={() => handleAddApiKey("news")}
                    className="w-full neon-button"
                    disabled={!newKeyName || !newKeyValue}
                  >
                    <Plus size={16} className="mr-2" /> Add Custom Key
                  </Button>

                  {customApiKeys["news"] && customApiKeys["news"].length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-[#00ff4c] mb-2">Custom API Keys</h4>
                      <div className="space-y-3">
                        {customApiKeys["news"].map((key, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-black/30 p-3 rounded border border-[#00ff4c33]"
                          >
                            <div>
                              <p className="text-white font-medium">{key.name}</p>
                              <p className="text-gray-400 text-sm">••••••••{key.value.slice(-4)}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveApiKey("news", index)}
                              className="hover:bg-red-900/20 hover:text-red-400"
                            >
                              <X size={16} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Crypto Tab */}
          <TabsContent value="crypto">
            <Card className="bg-black/80 backdrop-blur-sm border-[#00ff4c33]">
              <CardHeader>
                <CardTitle className="flex items-center text-[#00ff4c] drop-shadow-[0_0_5px_rgba(0,255,76,0.6)]">
                  <CreditCard className="mr-2" size={20} />
                  Cryptocurrency API Integration
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Connect to cryptocurrency data providers and exchanges
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label htmlFor="coinmarketcap-key" className="text-[#00ff4c]">
                    CoinMarketCap API Key
                  </Label>
                  <Input
                    id="coinmarketcap-key"
                    value={coinMarketCapKey}
                    onChange={(e) => setCoinMarketCapKey(e.target.value)}
                    type="password"
                    placeholder="Enter your CoinMarketCap API key"
                    className="bg-black/50 border-[#00ff4c33] focus:border-[#00ff4c] text-white"
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="coingecko-key" className="text-[#00ff4c]">
                    CoinGecko API Key
                  </Label>
                  <Input
                    id="coingecko-key"
                    value={coinGeckoKey}
                    onChange={(e) => setCoinGeckoKey(e.target.value)}
                    type="password"
                    placeholder="Enter your CoinGecko API key"
                    className="bg-black/50 border-[#00ff4c33] focus:border-[#00ff4c] text-white"
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="binance-key" className="text-[#00ff4c]">
                    Binance API Key
                  </Label>
                  <Input
                    id="binance-key"
                    value={binanceKey}
                    onChange={(e) => setBinanceKey(e.target.value)}
                    type="password"
                    placeholder="Enter your Binance API key"
                    className="bg-black/50 border-[#00ff4c33] focus:border-[#00ff4c] text-white"
                  />
                </div>

                <Button className="w-full neon-button">
                  <Save size={16} className="mr-2" /> Save Crypto API Settings
                </Button>
                <div className="mt-6 pt-6 border-t border-[#00ff4c33]">
                  <h3 className="text-[#00ff4c] mb-4 flex items-center">
                    <Plus size={16} className="mr-2" />
                    Add Custom API Key
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-key-name" className="text-[#00ff4c]">
                        API Key Name
                      </Label>
                      <Input
                        id="new-key-name"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        type="password"
                        placeholder="Enter API key name"
                        className="bg-black/50 border-[#00ff4c33] focus:border-[#00ff4c] text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-key-value" className="text-[#00ff4c]">
                        API Key Value
                      </Label>
                      <Input
                        id="new-key-value"
                        value={newKeyValue}
                        onChange={(e) => setNewKeyValue(e.target.value)}
                        type="password"
                        placeholder="Enter API key value"
                        className="bg-black/50 border-[#00ff4c33] focus:border-[#00ff4c] text-white"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={() => handleAddApiKey("crypto")}
                    className="w-full neon-button"
                    disabled={!newKeyName || !newKeyValue}
                  >
                    <Plus size={16} className="mr-2" /> Add Custom Key
                  </Button>

                  {customApiKeys["crypto"] && customApiKeys["crypto"].length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-[#00ff4c] mb-2">Custom API Keys</h4>
                      <div className="space-y-3">
                        {customApiKeys["crypto"].map((key, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-black/30 p-3 rounded border border-[#00ff4c33]"
                          >
                            <div>
                              <p className="text-white font-medium">{key.name}</p>
                              <p className="text-gray-400 text-sm">••••••••{key.value.slice(-4)}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveApiKey("crypto", index)}
                              className="hover:bg-red-900/20 hover:text-red-400"
                            >
                              <X size={16} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          {customCategories.map((category) => (
            <TabsContent key={category} value={category}>
              <Card className="bg-black/80 backdrop-blur-sm border-[#00ff4c33]">
                <CardHeader>
                  <CardTitle className="flex items-center text-[#00ff4c] drop-shadow-[0_0_5px_rgba(0,255,76,0.6)]">
                    {category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, " ")}
                  </CardTitle>
                  <CardDescription className="text-gray-400">Manage custom API keys for this category</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Custom API keys list */}
                  {customApiKeys[category] && customApiKeys[category].length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-[#00ff4c] mb-2">Custom API Keys</h4>
                      <div className="space-y-3">
                        {customApiKeys[category].map((key, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-black/30 p-3 rounded border border-[#00ff4c33]"
                          >
                            <div>
                              <p className="text-white font-medium">{key.name}</p>
                              <p className="text-gray-400 text-sm">••••••••{key.value.slice(-4)}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveApiKey(category, index)}
                              className="hover:bg-red-900/20 hover:text-red-400"
                            >
                              <X size={16} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Add new API key form */}
                  <div className="pt-4 border-t border-[#00ff4c33]">
                    <h3 className="text-[#00ff4c] mb-4 flex items-center">
                      <Plus size={16} className="mr-2" />
                      Add API Key
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <Label htmlFor={`new-key-name-${category}`} className="text-[#00ff4c]">
                          API Key Name
                        </Label>
                        <Input
                          id={`new-key-name-${category}`}
                          value={newKeyName}
                          onChange={(e) => setNewKeyName(e.target.value)}
                          placeholder="Enter API key name"
                          className="bg-black/50 border-[#00ff4c33] focus:border-[#00ff4c] text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`new-key-value-${category}`} className="text-[#00ff4c]">
                          API Key Value
                        </Label>
                        <Input
                          id={`new-key-value-${category}`}
                          value={newKeyValue}
                          onChange={(e) => setNewKeyValue(e.target.value)}
                          type="password"
                          placeholder="Enter API key value"
                          className="bg-black/50 border-[#00ff4c33] focus:border-[#00ff4c] text-white"
                        />
                      </div>
                    </div>
                    <Button
                      onClick={() => handleAddApiKey(category)}
                      className="w-full neon-button"
                      disabled={!newKeyName || !newKeyValue}
                    >
                      <Plus size={16} className="mr-2" /> Add API Key
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
        <div className="mt-8 pt-6 border-t border-[#00ff4c33]">
          <h3 className="text-[#00ff4c] mb-4 flex items-center">
            <Plus size={16} className="mr-2" />
            Add New Category
          </h3>
          <div className="flex gap-4">
            <Input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Enter category name"
              className="bg-black/50 border-[#00ff4c33] focus:border-[#00ff4c] text-white"
            />
            <Button onClick={handleAddCategory} className="neon-button whitespace-nowrap" disabled={!newCategoryName}>
              <Plus size={16} className="mr-2" /> Add
            </Button>
          </div>
        </div>
        <DialogFooter className="mt-6">
          <Button onClick={handleSaveAll} className="neon-button">
            <Lock size={16} className="mr-2" /> Save All API Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
