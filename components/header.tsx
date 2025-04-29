"use client"

import { ChevronDown, Cpu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Logo from "@/components/logo"
import { useMobile } from "@/hooks/use-mobile"
import { useRouter } from "next/navigation"

interface HeaderProps {
  isSidebarOpen: boolean
  setIsSidebarOpen?: (open: boolean) => void
  selectedBot: string
  setSelectedBot?: (bot: string) => void
  selectedModel: string
  setSelectedModel?: (model: string) => void
}

export function Header({
  isSidebarOpen,
  setIsSidebarOpen,
  selectedBot,
  setSelectedBot,
  selectedModel,
  setSelectedModel,
}: HeaderProps) {
  const isMobile = useMobile()
  const router = useRouter()

  const models = ["OpenAI", "Mistral", "LLAMA", "Groq"]

  const navigateToHome = () => {
    router.push("/")
  }

  const navigateToSettings = () => {
    window.dispatchEvent(new CustomEvent("startLoading"))
    setTimeout(() => {
      router.push("/settings")
    }, 50)
  }

  return (
    <header className="border-b border-[#00ff4c33] bg-black py-2 sm:py-3 px-2 sm:px-4 flex items-center justify-between z-30 w-full fixed left-0 top-0 h-[53px]">
      <div className="flex items-center">
        {/* Logo positioned with more space for the larger infinity icon */}
        <div
          className={`${isMobile ? "ml-1" : "ml-4"} cursor-pointer flex items-center justify-center`}
          onClick={navigateToHome}
        >
          <Logo />
        </div>
      </div>

      <div className="flex items-center space-x-1 sm:space-x-2">
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
                  onClick={() => setSelectedModel && setSelectedModel(model)}
                  className="text-white hover:text-[#00ff4c] hover:bg-[#00ff4c15] cursor-pointer py-2"
                >
                  {model}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {isMobile && (
          <Button variant="outline" className="neon-outline text-xs h-8 !text-white px-2" onClick={navigateToSettings}>
            Settings
          </Button>
        )}
      </div>
    </header>
  )
}

// Also keep the default export
export default Header
