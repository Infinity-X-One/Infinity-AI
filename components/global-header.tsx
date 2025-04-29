"use client"

import { ChevronDown, ExternalLink, Cpu, UserCircle, Bot, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Logo from "@/components/logo"
import { useMobile } from "@/hooks/use-mobile"
import { useRouter } from "next/navigation"

interface GlobalHeaderProps {
  toggleSidebar: () => void
  selectedModel?: string
  setSelectedModel?: (model: string) => void
}

export default function GlobalHeader({ toggleSidebar, selectedModel = "OpenAI", setSelectedModel }: GlobalHeaderProps) {
  const isMobile = useMobile()
  const router = useRouter()

  const models = ["OpenAI", "Mistral", "LLAMA", "Groq"]

  const accounts = [
    { name: "Command Center", url: "https://command.infinityxos.com" },
    { name: "Main Site", url: "https://infinityxos.com" },
    { name: "Prediction Site", url: "https://predictions.infinityxos.com" },
  ]

  const navigateToHome = () => {
    router.push("/")
  }

  const navigateToBotBuilder = () => {
    window.dispatchEvent(new CustomEvent("startLoading"))
    setTimeout(() => {
      router.push("/bot-builder")
    }, 50)
  }

  const handleModelChange = (model: string) => {
    if (setSelectedModel) {
      setSelectedModel(model)
    }
  }

  return (
    <header className="border-b border-[#00ff4c33] bg-black py-2 sm:py-3 px-2 sm:px-4 flex items-center justify-between z-30 w-full fixed left-0 top-0 h-[53px]">
      <div className="flex items-center">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="mr-1 text-white hover:text-[#00ff4c] hover:bg-[#00ff4c15]"
          onClick={toggleSidebar}
        >
          <Menu size={20} />
        </Button>

        {/* Logo positioned with more space for the larger infinity icon */}
        <div className="cursor-pointer flex items-center justify-center" onClick={navigateToHome}>
          <Logo />
        </div>
      </div>

      <div className="flex items-center space-x-1 sm:space-x-2">
        {!isMobile && (
          <Button
            variant="outline"
            className="neon-outline text-xs sm:text-sm h-8 sm:h-9 !text-white px-2 sm:px-3 mr-1 sm:mr-2 border-[#00ff4c] hover:bg-[#00ff4c15]"
            onClick={navigateToBotBuilder}
          >
            <Bot size={14} className="mr-1 text-[#00ff4c]" /> Bot Builder
          </Button>
        )}

        {!isMobile && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="neon-outline text-xs sm:text-sm h-8 sm:h-9 !text-white px-2 sm:px-3">
                <Cpu size={14} className="mr-1" /> AI Model <ChevronDown size={14} className="ml-1 sm:ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-black border-[#00ff4c33]">
              {models.map((model) => (
                <DropdownMenuItem
                  key={model}
                  onClick={() => handleModelChange(model)}
                  className="text-white hover:text-[#00ff4c] hover:bg-[#00ff4c15] cursor-pointer py-2"
                >
                  {model}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="neon-outline text-xs sm:text-sm h-8 sm:h-9 !text-white px-2 sm:px-3">
              <UserCircle size={14} className="mr-1" /> {isMobile ? "" : "Accounts"}{" "}
              <ChevronDown size={14} className="ml-1 sm:ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-black border-[#00ff4c33] w-48 right-0 left-auto">
            {accounts.map((account) => (
              <DropdownMenuItem
                key={account.name}
                className="text-white hover:text-[#00ff4c] hover:bg-[#00ff4c15] cursor-pointer py-2"
                onClick={() => window.open(account.url, "_blank")}
              >
                <ExternalLink size={14} className="mr-2" /> {account.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem
              className="text-[#00ff4c] hover:text-white hover:bg-[#00ff4c15] cursor-pointer py-2"
              onClick={() => (window.location.href = "/settings?tab=accounts")}
            >
              + Add Account
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
