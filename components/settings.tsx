"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import AIIntegration from "@/components/ai-integration"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Mic, UserCircle, Plus, Trash2, ExternalLink } from "lucide-react"

export default function Settings() {
  const [githubToken, setGithubToken] = useState("")
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [accounts, setAccounts] = useState([
    { id: 1, name: "Command Center", url: "https://command.infinityxos.com" },
    { id: 2, name: "Main Site", url: "https://infinityxos.com" },
    { id: 3, name: "Prediction Site", url: "https://predictions.infinityxos.com" },
  ])
  const [newAccountName, setNewAccountName] = useState("")
  const [newAccountUrl, setNewAccountUrl] = useState("")

  const addAccount = () => {
    if (newAccountName && newAccountUrl) {
      setAccounts([
        ...accounts,
        {
          id: accounts.length + 1,
          name: newAccountName,
          url: newAccountUrl,
        },
      ])
      setNewAccountName("")
      setNewAccountUrl("")
    }
  }

  const removeAccount = (id: number) => {
    setAccounts(accounts.filter((account) => account.id !== id))
  }

  const openAccount = (url: string) => {
    window.open(url, "_blank")
  }

  return (
    <div className="container py-10 max-w-4xl">
      <h1 className="text-3xl font-bold text-[#00ff4c] mb-6 drop-shadow-[0_0_8px_rgba(0,255,76,0.7)]">Settings</h1>

      <Tabs defaultValue="accounts" className="w-full">
        <TabsList className="grid grid-cols-5 mb-8 bg-black/50 border border-[#00ff4c33]">
          <TabsTrigger
            value="accounts"
            className="data-[state=active]:bg-[#00ff4c20] data-[state=active]:text-[#00ff4c] text-white"
          >
            Accounts
          </TabsTrigger>
          <TabsTrigger
            value="ai"
            className="data-[state=active]:bg-[#00ff4c20] data-[state=active]:text-[#00ff4c] text-white"
          >
            AI Models
          </TabsTrigger>
          <TabsTrigger
            value="integrations"
            className="data-[state=active]:bg-[#00ff4c20] data-[state=active]:text-[#00ff4c] text-white"
          >
            Integrations
          </TabsTrigger>
          <TabsTrigger
            value="appearance"
            className="data-[state=active]:bg-[#00ff4c20] data-[state=active]:text-[#00ff4c] text-white"
          >
            Appearance
          </TabsTrigger>
          <TabsTrigger
            value="advanced"
            className="data-[state=active]:bg-[#00ff4c20] data-[state=active]:text-[#00ff4c] text-white"
          >
            Advanced
          </TabsTrigger>
        </TabsList>

        <TabsContent value="accounts">
          <Card className="bg-black/80 backdrop-blur-sm border-[#00ff4c33]">
            <CardHeader>
              <CardTitle className="text-[#00ff4c] drop-shadow-[0_0_5px_rgba(0,255,76,0.6)]">
                <div className="flex items-center">
                  <UserCircle className="mr-2" size={20} />
                  Account Management
                </div>
              </CardTitle>
              <CardDescription className="text-white">
                Manage your connected accounts and external services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Connected Accounts</h3>
                  <div className="space-y-2">
                    {accounts.map((account) => (
                      <div
                        key={account.id}
                        className="flex items-center justify-between p-3 bg-black/50 rounded-md border border-[#00ff4c33]"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-white">{account.name}</p>
                          <p className="text-sm text-gray-400">{account.url}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-[#00ff4c] hover:text-white hover:bg-[#00ff4c15] border-[#00ff4c33]"
                            onClick={() => openAccount(account.url)}
                          >
                            <ExternalLink size={16} className="mr-1" /> Open
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-400 hover:text-red-500 hover:bg-red-500/10"
                            onClick={() => removeAccount(account.id)}
                          >
                            <Trash2 size={18} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Add New Account</h3>
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="account-name" className="text-[#00ff4c]">
                        Account Name
                      </Label>
                      <Input
                        id="account-name"
                        value={newAccountName}
                        onChange={(e) => setNewAccountName(e.target.value)}
                        placeholder="Enter account name"
                        className="bg-black/50 border-[#00ff4c33] focus:border-[#00ff4c] text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="account-url" className="text-[#00ff4c]">
                        Account URL
                      </Label>
                      <Input
                        id="account-url"
                        value={newAccountUrl}
                        onChange={(e) => setNewAccountUrl(e.target.value)}
                        placeholder="https://..."
                        className="bg-black/50 border-[#00ff4c33] focus:border-[#00ff4c] text-white"
                      />
                    </div>
                    <Button
                      onClick={addAccount}
                      className="neon-button flex items-center justify-center"
                      disabled={!newAccountName || !newAccountUrl}
                    >
                      <Plus size={16} className="mr-2" /> Add Account
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">External Accounts</h3>
                  <div className="space-y-3">
                    <Button className="w-full bg-black border border-[#00ff4c] text-white hover:bg-[#00ff4c15] relative">
                      <div className="absolute inset-0 shadow-[inset_0_0_8px_rgba(0,255,76,0.3)] pointer-events-none rounded-md"></div>
                      <div className="flex items-center gap-2 z-10">
                        <Plus size={16} className="text-[#00ff4c]" />
                        <span>Connect Google Account</span>
                      </div>
                    </Button>
                    <Button className="w-full bg-black border border-[#00ff4c] text-white hover:bg-[#00ff4c15] relative">
                      <div className="absolute inset-0 shadow-[inset_0_0_8px_rgba(0,255,76,0.3)] pointer-events-none rounded-md"></div>
                      <div className="flex items-center gap-2 z-10">
                        <Plus size={16} className="text-[#00ff4c]" />
                        <span>Connect Microsoft Account</span>
                      </div>
                    </Button>
                    <Button className="w-full bg-black border border-[#00ff4c] text-white hover:bg-[#00ff4c15] relative">
                      <div className="absolute inset-0 shadow-[inset_0_0_8px_rgba(0,255,76,0.3)] pointer-events-none rounded-md"></div>
                      <div className="flex items-center gap-2 z-10">
                        <Plus size={16} className="text-[#00ff4c]" />
                        <span>Connect Trading Account</span>
                      </div>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai">
          <div className="grid gap-6">
            <AIIntegration />
          </div>
        </TabsContent>

        <TabsContent value="integrations">
          <div className="grid gap-6">
            <Card className="bg-black/80 backdrop-blur-sm border-[#00ff4c33]">
              <CardHeader>
                <CardTitle className="text-[#00ff4c] drop-shadow-[0_0_5px_rgba(0,255,76,0.6)]">
                  GitHub Integration
                </CardTitle>
                <CardDescription className="text-white">
                  Connect your GitHub account to access repositories
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="github" className="text-[#00ff4c]">
                    GitHub Access Token
                  </Label>
                  <Input
                    id="github"
                    value={githubToken}
                    onChange={(e) => setGithubToken(e.target.value)}
                    type="password"
                    placeholder="ghp_..."
                    className="bg-black/50 border-[#00ff4c33] focus:border-[#00ff4c] text-white"
                  />
                </div>
                <Button className="w-full neon-button">Connect GitHub</Button>
              </CardContent>
            </Card>

            <Card className="bg-black/80 backdrop-blur-sm border-[#00ff4c33]">
              <CardHeader>
                <CardTitle className="text-[#00ff4c] drop-shadow-[0_0_5px_rgba(0,255,76,0.6)]">
                  Financial APIs
                </CardTitle>
                <CardDescription className="text-white">Connect to financial data providers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="alphavantage" className="text-[#00ff4c]">
                      Alpha Vantage API Key
                    </Label>
                    <Input
                      id="alphavantage"
                      type="password"
                      placeholder="Enter your Alpha Vantage API key"
                      className="bg-black/50 border-[#00ff4c33] focus:border-[#00ff4c] text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="finnhub" className="text-[#00ff4c]">
                      Finnhub API Key
                    </Label>
                    <Input
                      id="finnhub"
                      type="password"
                      placeholder="Enter your Finnhub API key"
                      className="bg-black/50 border-[#00ff4c33] focus:border-[#00ff4c] text-white"
                    />
                  </div>

                  <Button className="w-full neon-button">Save Financial API Keys</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="appearance">
          <Card className="bg-black/80 backdrop-blur-sm border-[#00ff4c33]">
            <CardHeader>
              <CardTitle className="text-[#00ff4c] drop-shadow-[0_0_5px_rgba(0,255,76,0.6)]">
                Appearance Settings
              </CardTitle>
              <CardDescription className="text-white">Customize how Infinity AI looks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="compact-mode" className="text-[#00ff4c]">
                    Compact Mode
                  </Label>
                  <Switch
                    id="compact-mode"
                    className="data-[state=checked]:bg-[#00ff4c] data-[state=checked]:border-[#00ff4c]"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="animations" className="text-[#00ff4c]">
                    Enable Animations
                  </Label>
                  <Switch
                    id="animations"
                    defaultChecked
                    className="data-[state=checked]:bg-[#00ff4c] data-[state=checked]:border-[#00ff4c]"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="code-highlighting" className="text-[#00ff4c]">
                    Code Syntax Highlighting
                  </Label>
                  <Switch
                    id="code-highlighting"
                    defaultChecked
                    className="data-[state=checked]:bg-[#00ff4c] data-[state=checked]:border-[#00ff4c]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced">
          <Card className="bg-black/80 backdrop-blur-sm border-[#00ff4c33]">
            <CardHeader>
              <CardTitle className="text-[#00ff4c] drop-shadow-[0_0_5px_rgba(0,255,76,0.6)]">
                Advanced Settings
              </CardTitle>
              <CardDescription className="text-white">Configure advanced features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mic className="text-[#00ff4c]" size={20} />
                    <div>
                      <Label htmlFor="voice-control" className="text-[#00ff4c] block">
                        Voice Control
                      </Label>
                      <p className="text-sm text-white">Enable voice commands and responses</p>
                    </div>
                  </div>
                  <Switch
                    id="voice-control"
                    checked={voiceEnabled}
                    onCheckedChange={setVoiceEnabled}
                    className="data-[state=checked]:bg-[#00ff4c] data-[state=checked]:border-[#00ff4c]"
                  />
                </div>

                {voiceEnabled && (
                  <div className="ml-8 border-l-2 border-[#00ff4c33] pl-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="voice-feedback" className="text-[#00ff4c] block">
                          Voice Feedback
                        </Label>
                        <p className="text-sm text-white">AI responds with voice</p>
                      </div>
                      <Switch
                        id="voice-feedback"
                        className="data-[state=checked]:bg-[#00ff4c] data-[state=checked]:border-[#00ff4c]"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="wake-word" className="text-[#00ff4c] block">
                          Wake Word Detection
                        </Label>
                        <p className="text-sm text-white">Activate with "Hey Jarvis"</p>
                      </div>
                      <Switch
                        id="wake-word"
                        className="data-[state=checked]:bg-[#00ff4c] data-[state=checked]:border-[#00ff4c]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="voice-language" className="text-[#00ff4c]">
                        Voice Language
                      </Label>
                      <select
                        id="voice-language"
                        className="w-full bg-black/50 border-[#00ff4c33] focus:border-[#00ff4c] text-white rounded-md p-2"
                      >
                        <option value="en-US">English (US)</option>
                        <option value="en-GB">English (UK)</option>
                        <option value="es-ES">Spanish</option>
                        <option value="fr-FR">French</option>
                        <option value="de-DE">German</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="api-debug" className="text-[#00ff4c] block">
                      API Debug Mode
                    </Label>
                    <p className="text-sm text-white">Show detailed API responses</p>
                  </div>
                  <Switch
                    id="api-debug"
                    className="data-[state=checked]:bg-[#00ff4c] data-[state=checked]:border-[#00ff4c]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-tokens" className="text-[#00ff4c]">
                    Max Tokens per Response
                  </Label>
                  <Input
                    id="max-tokens"
                    type="number"
                    defaultValue="2048"
                    className="bg-black/50 border-[#00ff4c33] focus:border-[#00ff4c] text-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
