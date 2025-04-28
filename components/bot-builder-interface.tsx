"use client"

import { useState } from "react"
import { BotIcon, Plus, Save, Trash2, Edit, Copy, Settings, ChevronDown, ChevronUp, Zap, FileText } from "lucide-react"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import BotTemplates from "@/components/bot-templates"
import type { Bot } from "@/types/bot"

// Sample bot data
const SAMPLE_BOTS = [
  {
    id: "analyze-bot",
    name: "Analyze Bot",
    description: "Analyzes data and provides insights",
    icon: "Search",
    category: "Analysis",
    personality: "Analytical",
    responseLength: "Medium",
    temperature: 0.7,
    enabled: true,
    skills: ["Data Analysis", "Pattern Recognition", "Insight Generation"],
    behavior: {
      responseStyle: "balanced",
      personality: "analytical",
      knowledgeDomains: ["Data Science", "Statistics", "Business Intelligence"],
    },
  },
  {
    id: "picky-bot",
    name: "Picky Bot",
    description: "Helps you make decisions by analyzing options",
    icon: "Filter",
    category: "Decision Making",
    personality: "Critical",
    responseLength: "Short",
    temperature: 0.5,
    enabled: true,
    skills: ["Decision Analysis", "Comparison", "Prioritization"],
    behavior: {
      responseStyle: "precise",
      personality: "critical",
      knowledgeDomains: ["Decision Theory", "Logic", "Evaluation Methods"],
    },
  },
  {
    id: "predictions-bot",
    name: "Predictions Bot",
    description: "Makes predictions based on historical data",
    icon: "LineChart",
    category: "Finance",
    personality: "Precise",
    responseLength: "Long",
    temperature: 0.3,
    enabled: true,
    skills: ["Trend Analysis", "Forecasting", "Risk Assessment"],
    behavior: {
      responseStyle: "precise",
      personality: "analytical",
      knowledgeDomains: ["Finance", "Economics", "Statistics"],
    },
  },
]

// Bot categories
const BOT_CATEGORIES = [
  "Analysis",
  "Decision Making",
  "Finance",
  "Health",
  "Research",
  "Creative",
  "Productivity",
  "Other",
]

// Bot personalities
const BOT_PERSONALITIES = [
  "Analytical",
  "Creative",
  "Helpful",
  "Critical",
  "Precise",
  "Friendly",
  "Professional",
  "Casual",
]

// Response lengths
const RESPONSE_LENGTHS = ["Short", "Medium", "Long", "Adaptive"]

export default function BotBuilderInterface() {
  const [bots, setBots] = useState<Bot[]>(SAMPLE_BOTS as Bot[])
  const [activeTab, setActiveTab] = useState("my-bots")
  const [createStep, setCreateStep] = useState<"template" | "details">("template")
  const [expandedSections, setExpandedSections] = useState({
    botSettings: true,
    promptTemplates: true,
    integrations: false,
  })
  const [selectedBot, setSelectedBot] = useState<string | null>(null)
  const [newBot, setNewBot] = useState<Partial<Bot>>({
    id: "",
    name: "",
    description: "",
    icon: "Bot",
    category: "Analysis",
    personality: "Analytical",
    responseLength: "Medium",
    temperature: 0.7,
    enabled: true,
    skills: [],
    behavior: {
      responseStyle: "balanced",
      personality: "analytical",
      knowledgeDomains: [],
    },
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const handleSelectTemplate = (template: Partial<Bot>) => {
    setNewBot({
      ...newBot,
      ...template,
      id: `bot-${Date.now()}`,
    })
    setCreateStep("details")
  }

  const handleCreateBot = () => {
    const botId = newBot.id || `bot-${Date.now()}`
    const createdBot = {
      ...newBot,
      id: botId,
    } as Bot
    setBots([...bots, createdBot])
    setSelectedBot(botId)
    setNewBot({
      id: "",
      name: "",
      description: "",
      icon: "Bot",
      category: "Analysis",
      personality: "Analytical",
      responseLength: "Medium",
      temperature: 0.7,
      enabled: true,
      skills: [],
      behavior: {
        responseStyle: "balanced",
        personality: "analytical",
        knowledgeDomains: [],
      },
    })
    setActiveTab("edit-bot")
    setCreateStep("template")
  }

  const handleDeleteBot = (botId: string) => {
    setBots(bots.filter((bot) => bot.id !== botId))
    if (selectedBot === botId) {
      setSelectedBot(null)
    }
  }

  const handleDuplicateBot = (botId: string) => {
    const botToDuplicate = bots.find((bot) => bot.id === botId)
    if (botToDuplicate) {
      const duplicatedBot = {
        ...botToDuplicate,
        id: `bot-${Date.now()}`,
        name: `${botToDuplicate.name} (Copy)`,
      }
      setBots([...bots, duplicatedBot])
    }
  }

  const handleToggleBot = (botId: string, enabled: boolean) => {
    setBots(bots.map((bot) => (bot.id === botId ? { ...bot, enabled } : bot)))
  }

  const handleUpdateBot = (botId: string, updates: Partial<Bot>) => {
    setBots(bots.map((bot) => (bot.id === botId ? { ...bot, ...updates } : bot)))
  }

  const selectedBotData = selectedBot ? bots.find((bot) => bot.id === selectedBot) : null

  return (
    <div className="flex flex-col h-full min-h-screen bg-black text-white relative">
      {/* Include the header */}
      <Header />

      <div className="flex flex-col flex-1 overflow-y-auto pt-[53px] relative">
        {/* Hexagon background effects - matching the rest of the site */}
        <div className="fixed inset-0 z-0 h-full">
          <div className="hexagon-grid"></div>
          <div className="hexagon-overlay"></div>
          <div className="hexagon-glow"></div>
        </div>

        <div className="relative z-1 p-6 pb-24 flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-[#00ff4c] drop-shadow-[0_0_8px_rgba(0,255,76,0.6)]">
              AI Bot Builder
            </h1>
            <Button
              onClick={() => {
                setActiveTab("create-bot")
                setCreateStep("template")
              }}
              className="bg-[#00ff4c] hover:bg-[#00dd42] text-black font-medium relative"
            >
              <div className="absolute inset-0 shadow-[0_0_8px_rgba(0,255,76,0.5)] pointer-events-none rounded-md"></div>
              <Plus size={16} className="mr-2" />
              Create New Bot
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6 bg-black border border-[#00ff4c33] rounded-md overflow-hidden">
              <TabsTrigger
                value="my-bots"
                className="data-[state=active]:bg-[#00ff4c20] data-[state=active]:text-[#00ff4c] data-[state=active]:shadow-none text-white"
              >
                <BotIcon size={16} className="mr-2" />
                My Bots
              </TabsTrigger>
              <TabsTrigger
                value="create-bot"
                className="data-[state=active]:bg-[#00ff4c20] data-[state=active]:text-[#00ff4c] data-[state=active]:shadow-none text-white"
              >
                <Plus size={16} className="mr-2" />
                Create Bot
              </TabsTrigger>
              <TabsTrigger
                value="edit-bot"
                disabled={!selectedBot}
                className="data-[state=active]:bg-[#00ff4c20] data-[state=active]:text-[#00ff4c] data-[state=active]:shadow-none disabled:opacity-50 text-white"
              >
                <Settings size={16} className="mr-2" />
                Edit Bot
              </TabsTrigger>
            </TabsList>

            <TabsContent value="my-bots" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bots.map((bot) => (
                  <Card
                    key={bot.id}
                    className="bg-black border-[#00ff4c33] hover:border-[#00ff4c] transition-all overflow-hidden"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-[#00ff4c15] flex items-center justify-center mr-3">
                            <BotIcon size={20} className="text-[#00ff4c]" />
                          </div>
                          <div>
                            <CardTitle className="text-white">{bot.name}</CardTitle>
                            <CardDescription className="text-gray-400">{bot.category}</CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Switch
                            checked={bot.enabled}
                            onCheckedChange={(checked) => handleToggleBot(bot.id, checked)}
                            className="data-[state=checked]:bg-[#00ff4c]"
                          />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-gray-400 mb-3">{bot.description}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {bot.skills &&
                          bot.skills.slice(0, 3).map((skill, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs bg-[#00ff4c15] text-[#00ff4c] rounded-md border border-[#00ff4c33]"
                            >
                              {skill}
                            </span>
                          ))}
                        {bot.skills && bot.skills.length > 3 && (
                          <span className="px-2 py-1 text-xs bg-[#00ff4c15] text-[#00ff4c] rounded-md border border-[#00ff4c33]">
                            +{bot.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-2 border-t border-[#00ff4c33]">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[#00ff4c33] hover:bg-[#00ff4c15] hover:text-[#00ff4c] text-white"
                        onClick={() => handleDuplicateBot(bot.id)}
                      >
                        <Copy size={14} className="mr-1" />
                        Duplicate
                      </Button>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-[#00ff4c33] hover:bg-[#00ff4c15] hover:text-[#00ff4c] text-white"
                          onClick={() => {
                            setSelectedBot(bot.id)
                            setActiveTab("edit-bot")
                          }}
                        >
                          <Edit size={14} className="mr-1" />
                          Edit
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-red-800 hover:bg-red-900/20 hover:text-red-500 text-white"
                            >
                              <Trash2 size={14} className="mr-1" />
                              Delete
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-black border-[#00ff4c33]">
                            <DialogHeader>
                              <DialogTitle className="text-white">Delete Bot</DialogTitle>
                              <DialogDescription className="text-gray-400">
                                Are you sure you want to delete "{bot.name}"? This action cannot be undone.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="flex justify-end gap-2 mt-4">
                              <Button
                                variant="outline"
                                className="border-[#00ff4c33] hover:bg-[#00ff4c15] hover:text-[#00ff4c] text-white"
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="destructive"
                                className="bg-red-900 hover:bg-red-800 text-white"
                                onClick={() => handleDeleteBot(bot.id)}
                              >
                                Delete Bot
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {bots.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <BotIcon size={48} className="text-gray-500 mb-4" />
                  <h3 className="text-xl font-medium text-white mb-2">No Bots Created Yet</h3>
                  <p className="text-gray-400 mb-6 max-w-md">
                    Create your first AI bot to automate tasks, analyze data, or assist with decision making.
                  </p>
                  <Button
                    onClick={() => {
                      setActiveTab("create-bot")
                      setCreateStep("template")
                    }}
                    className="bg-[#00ff4c] hover:bg-[#00dd42] text-black font-medium relative"
                  >
                    <div className="absolute inset-0 shadow-[0_0_8px_rgba(0,255,76,0.5)] pointer-events-none rounded-md"></div>
                    <Plus size={16} className="mr-2" />
                    Create New Bot
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="create-bot" className="mt-0">
              {createStep === "template" ? (
                <Card className="bg-black border-[#00ff4c33]">
                  <CardHeader>
                    <CardTitle className="text-white">Choose a Bot Template</CardTitle>
                    <CardDescription className="text-gray-400">
                      Start with a pre-built template or create a custom bot from scratch.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <BotTemplates onSelectTemplate={handleSelectTemplate} />
                  </CardContent>
                  <CardFooter className="flex justify-between border-t border-[#00ff4c33] pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setActiveTab("my-bots")
                      }}
                      className="border-[#00ff4c33] hover:bg-[#00ff4c15] hover:text-[#00ff4c] text-white"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => setCreateStep("details")}
                      className="bg-[#00ff4c] hover:bg-[#00dd42] text-black font-medium relative"
                    >
                      <div className="absolute inset-0 shadow-[0_0_8px_rgba(0,255,76,0.5)] pointer-events-none rounded-md"></div>
                      <FileText size={16} className="mr-2" />
                      Create Custom Bot
                    </Button>
                  </CardFooter>
                </Card>
              ) : (
                <Card className="bg-black border-[#00ff4c33]">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-white">
                          {newBot.name ? `Customize: ${newBot.name}` : "Create New Bot"}
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                          {newBot.name
                            ? "Customize this template to fit your needs"
                            : "Configure your custom AI bot with the settings below"}
                        </CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCreateStep("template")}
                        className="border-[#00ff4c33] hover:bg-[#00ff4c15] hover:text-[#00ff4c] text-white"
                      >
                        Back to Templates
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="bot-name" className="text-white">
                            Bot Name
                          </Label>
                          <Input
                            id="bot-name"
                            placeholder="Enter bot name"
                            value={newBot.name || ""}
                            onChange={(e) => setNewBot({ ...newBot, name: e.target.value })}
                            className="bg-[#0a0a0a] border-[#00ff4c33] focus:border-[#00ff4c] text-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bot-category" className="text-white">
                            Category
                          </Label>
                          <Select
                            value={newBot.category}
                            onValueChange={(value) => setNewBot({ ...newBot, category: value })}
                          >
                            <SelectTrigger className="bg-[#0a0a0a] border-[#00ff4c33] focus:border-[#00ff4c] text-white">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent className="bg-black border-[#00ff4c33]">
                              {BOT_CATEGORIES.map((category) => (
                                <SelectItem key={category} value={category} className="text-white hover:text-[#00ff4c]">
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bot-description" className="text-white">
                          Description
                        </Label>
                        <Textarea
                          id="bot-description"
                          placeholder="Describe what your bot does"
                          value={newBot.description || ""}
                          onChange={(e) => setNewBot({ ...newBot, description: e.target.value })}
                          className="bg-[#0a0a0a] border-[#00ff4c33] focus:border-[#00ff4c] text-white min-h-[100px]"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="bot-personality" className="text-white">
                            Personality
                          </Label>
                          <Select
                            value={newBot.personality}
                            onValueChange={(value) => setNewBot({ ...newBot, personality: value })}
                          >
                            <SelectTrigger className="bg-[#0a0a0a] border-[#00ff4c33] focus:border-[#00ff4c] text-white">
                              <SelectValue placeholder="Select personality" />
                            </SelectTrigger>
                            <SelectContent className="bg-black border-[#00ff4c33]">
                              {BOT_PERSONALITIES.map((personality) => (
                                <SelectItem
                                  key={personality}
                                  value={personality}
                                  className="text-white hover:text-[#00ff4c]"
                                >
                                  {personality}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bot-response-length" className="text-white">
                            Response Length
                          </Label>
                          <Select
                            value={newBot.responseLength}
                            onValueChange={(value) => setNewBot({ ...newBot, responseLength: value })}
                          >
                            <SelectTrigger className="bg-[#0a0a0a] border-[#00ff4c33] focus:border-[#00ff4c] text-white">
                              <SelectValue placeholder="Select response length" />
                            </SelectTrigger>
                            <SelectContent className="bg-black border-[#00ff4c33]">
                              {RESPONSE_LENGTHS.map((length) => (
                                <SelectItem key={length} value={length} className="text-white hover:text-[#00ff4c]">
                                  {length}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="bot-temperature" className="text-white">
                            Temperature: {newBot.temperature?.toFixed(1)}
                          </Label>
                          <span className="text-gray-400 text-sm">
                            {newBot.temperature && newBot.temperature < 0.4
                              ? "More precise"
                              : newBot.temperature && newBot.temperature > 0.7
                                ? "More creative"
                                : "Balanced"}
                          </span>
                        </div>
                        <Slider
                          id="bot-temperature"
                          min={0}
                          max={1}
                          step={0.1}
                          value={[newBot.temperature || 0.7]}
                          onValueChange={(value) => setNewBot({ ...newBot, temperature: value[0] })}
                          className="[&_[role=slider]]:bg-[#00ff4c] [&_[role=slider]]:border-[#00ff4c] [&_[role=slider]]:shadow-[0_0_5px_rgba(0,255,76,0.5)]"
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="bot-enabled"
                          checked={newBot.enabled}
                          onCheckedChange={(checked) => setNewBot({ ...newBot, enabled: checked })}
                          className="data-[state=checked]:bg-[#00ff4c]"
                        />
                        <Label htmlFor="bot-enabled" className="text-white">
                          Enable bot
                        </Label>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t border-[#00ff4c33] pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setActiveTab("my-bots")
                      }}
                      className="border-[#00ff4c33] hover:bg-[#00ff4c15] hover:text-[#00ff4c] text-white"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateBot}
                      disabled={!newBot.name || !newBot.description}
                      className="bg-[#00ff4c] hover:bg-[#00dd42] text-black font-medium relative disabled:opacity-50 disabled:pointer-events-none"
                    >
                      <div className="absolute inset-0 shadow-[0_0_8px_rgba(0,255,76,0.5)] pointer-events-none rounded-md"></div>
                      <Save size={16} className="mr-2" />
                      Create Bot
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="edit-bot" className="mt-0">
              {selectedBotData && (
                <div className="space-y-6">
                  <Collapsible
                    open={expandedSections.botSettings}
                    onOpenChange={() => toggleSection("botSettings")}
                    className="border border-[#00ff4c33] rounded-lg overflow-hidden"
                  >
                    <CollapsibleTrigger className="w-full flex items-center justify-between p-4 bg-[#00ff4c10] hover:bg-[#00ff4c15] text-[#00ff4c] font-medium">
                      <div className="flex items-center">
                        <Settings className="mr-2" size={20} />
                        <span>Bot Settings</span>
                      </div>
                      {expandedSections.botSettings ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="p-4">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="edit-bot-name" className="text-white">
                              Bot Name
                            </Label>
                            <Input
                              id="edit-bot-name"
                              placeholder="Enter bot name"
                              value={selectedBotData.name}
                              onChange={(e) => handleUpdateBot(selectedBot, { name: e.target.value })}
                              className="bg-[#0a0a0a] border-[#00ff4c33] focus:border-[#00ff4c] text-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-bot-category" className="text-white">
                              Category
                            </Label>
                            <Select
                              value={selectedBotData.category}
                              onValueChange={(value) => handleUpdateBot(selectedBot, { category: value })}
                            >
                              <SelectTrigger className="bg-[#0a0a0a] border-[#00ff4c33] focus:border-[#00ff4c] text-white">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent className="bg-black border-[#00ff4c33]">
                                {BOT_CATEGORIES.map((category) => (
                                  <SelectItem
                                    key={category}
                                    value={category}
                                    className="text-white hover:text-[#00ff4c]"
                                  >
                                    {category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="edit-bot-description" className="text-white">
                            Description
                          </Label>
                          <Textarea
                            id="edit-bot-description"
                            placeholder="Describe what your bot does"
                            value={selectedBotData.description}
                            onChange={(e) => handleUpdateBot(selectedBot, { description: e.target.value })}
                            className="bg-[#0a0a0a] border-[#00ff4c33] focus:border-[#00ff4c] text-white min-h-[100px]"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="edit-bot-personality" className="text-white">
                              Personality
                            </Label>
                            <Select
                              value={selectedBotData.personality}
                              onValueChange={(value) => handleUpdateBot(selectedBot, { personality: value })}
                            >
                              <SelectTrigger className="bg-[#0a0a0a] border-[#00ff4c33] focus:border-[#00ff4c] text-white">
                                <SelectValue placeholder="Select personality" />
                              </SelectTrigger>
                              <SelectContent className="bg-black border-[#00ff4c33]">
                                {BOT_PERSONALITIES.map((personality) => (
                                  <SelectItem
                                    key={personality}
                                    value={personality}
                                    className="text-white hover:text-[#00ff4c]"
                                  >
                                    {personality}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-bot-response-length" className="text-white">
                              Response Length
                            </Label>
                            <Select
                              value={selectedBotData.responseLength}
                              onValueChange={(value) => handleUpdateBot(selectedBot, { responseLength: value })}
                            >
                              <SelectTrigger className="bg-[#0a0a0a] border-[#00ff4c33] focus:border-[#00ff4c] text-white">
                                <SelectValue placeholder="Select response length" />
                              </SelectTrigger>
                              <SelectContent className="bg-black border-[#00ff4c33]">
                                {RESPONSE_LENGTHS.map((length) => (
                                  <SelectItem key={length} value={length} className="text-white hover:text-[#00ff4c]">
                                    {length}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label htmlFor="edit-bot-temperature" className="text-white">
                              Temperature: {selectedBotData.temperature.toFixed(1)}
                            </Label>
                            <span className="text-gray-400 text-sm">
                              {selectedBotData.temperature < 0.4
                                ? "More precise"
                                : selectedBotData.temperature > 0.7
                                  ? "More creative"
                                  : "Balanced"}
                            </span>
                          </div>
                          <Slider
                            id="edit-bot-temperature"
                            min={0}
                            max={1}
                            step={0.1}
                            value={[selectedBotData.temperature]}
                            onValueChange={(value) => handleUpdateBot(selectedBot, { temperature: value[0] })}
                            className="[&_[role=slider]]:bg-[#00ff4c] [&_[role=slider]]:border-[#00ff4c] [&_[role=slider]]:shadow-[0_0_5px_rgba(0,255,76,0.5)]"
                          />
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch
                            id="edit-bot-enabled"
                            checked={selectedBotData.enabled}
                            onCheckedChange={(checked) => handleUpdateBot(selectedBot, { enabled: checked })}
                            className="data-[state=checked]:bg-[#00ff4c]"
                          />
                          <Label htmlFor="edit-bot-enabled" className="text-white">
                            Enable bot
                          </Label>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  <Collapsible
                    open={expandedSections.promptTemplates}
                    onOpenChange={() => toggleSection("promptTemplates")}
                    className="border border-[#00ff4c33] rounded-lg overflow-hidden"
                  >
                    <CollapsibleTrigger className="w-full flex items-center justify-between p-4 bg-[#00ff4c10] hover:bg-[#00ff4c15] text-[#00ff4c] font-medium">
                      <div className="flex items-center">
                        <Zap className="mr-2" size={20} />
                        <span>Prompt Templates</span>
                      </div>
                      {expandedSections.promptTemplates ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="p-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="system-prompt" className="text-white">
                            System Prompt
                          </Label>
                          <Textarea
                            id="system-prompt"
                            placeholder="Enter system instructions for the bot"
                            className="bg-[#0a0a0a] border-[#00ff4c33] focus:border-[#00ff4c] text-white min-h-[150px]"
                            defaultValue={`You are ${selectedBotData.name}, an AI assistant with a ${selectedBotData.personality.toLowerCase()} personality. You provide ${selectedBotData.responseLength.toLowerCase()} responses and specialize in ${selectedBotData.category.toLowerCase()} tasks.`}
                          />
                          <p className="text-xs text-gray-400 mt-1">
                            This prompt defines the bot's behavior and is sent with every conversation.
                          </p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <Label className="text-white">Sample Prompts</Label>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-[#00ff4c33] hover:bg-[#00ff4c15] hover:text-[#00ff4c] text-white"
                            >
                              <Plus size={14} className="mr-1" />
                              Add Prompt
                            </Button>
                          </div>

                          <div className="space-y-3 mt-2">
                            <div className="p-3 border border-[#00ff4c33] rounded-md bg-[#0a0a0a]">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium text-white">Introduction</h4>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                                >
                                  <Trash2 size={14} />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </div>
                              <Textarea
                                placeholder="Enter prompt template"
                                className="bg-[#0a0a0a] border-[#00ff4c33] focus:border-[#00ff4c] text-white min-h-[80px]"
                                defaultValue={`Introduce yourself as ${selectedBotData.name} and explain what you can help with.`}
                              />
                            </div>

                            <div className="p-3 border border-[#00ff4c33] rounded-md bg-[#0a0a0a]">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium text-white">Quick Analysis</h4>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                                >
                                  <Trash2 size={14} />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </div>
                              <Textarea
                                placeholder="Enter prompt template"
                                className="bg-[#0a0a0a] border-[#00ff4c33] focus:border-[#00ff4c] text-white min-h-[80px]"
                                defaultValue="Analyze the following data and provide key insights: {{data}}"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  <Collapsible
                    open={expandedSections.integrations}
                    onOpenChange={() => toggleSection("integrations")}
                    className="border border-[#00ff4c33] rounded-lg overflow-hidden"
                  >
                    <CollapsibleTrigger className="w-full flex items-center justify-between p-4 bg-[#00ff4c10] hover:bg-[#00ff4c15] text-[#00ff4c] font-medium">
                      <div className="flex items-center">
                        <Settings className="mr-2" size={20} />
                        <span>Integrations & Advanced</span>
                      </div>
                      {expandedSections.integrations ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="p-4">
                      <div className="space-y-4">
                        <div className="p-4 border border-dashed border-[#00ff4c33] rounded-md">
                          <h3 className="text-lg font-medium text-[#00ff4c] mb-2">Coming Soon</h3>
                          <p className="text-gray-400">
                            Advanced integrations with external APIs, knowledge bases, and workflow automation will be
                            available in the next update.
                          </p>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  <div className="flex justify-between pt-4 border-t border-[#00ff4c33]">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedBot(null)
                        setActiveTab("my-bots")
                      }}
                      className="border-[#00ff4c33] hover:bg-[#00ff4c15] hover:text-[#00ff4c] text-white"
                    >
                      Back to Bots
                    </Button>
                    <Button
                      className="bg-[#00ff4c] hover:bg-[#00dd42] text-black font-medium relative"
                      onClick={() => setActiveTab("my-bots")}
                    >
                      <div className="absolute inset-0 shadow-[0_0_8px_rgba(0,255,76,0.5)] pointer-events-none rounded-md"></div>
                      <Save size={16} className="mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
