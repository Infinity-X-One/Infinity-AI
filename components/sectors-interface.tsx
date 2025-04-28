"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import { useMobile } from "@/hooks/use-mobile"
import SidebarToggleTab from "@/components/sidebar-toggle-tab"
import SectorCard from "@/components/sector-card"
import { sectors } from "@/data/sectors"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function SectorsInterface() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [selectedBot, setSelectedBot] = useState("Jarvis")
  const [selectedModel, setSelectedModel] = useState("OpenAI")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSector, setSelectedSector] = useState<string | null>(null)
  const isMobile = useMobile()
  const router = useRouter()

  // Close sidebar on mobile by default
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false)
    } else {
      setIsSidebarOpen(true)
    }
  }, [isMobile])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const filteredSectors = sectors.filter((sector) => sector.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleSectorClick = (sectorId: string) => {
    setSelectedSector(sectorId)
    // In a real implementation, you might navigate to a sector detail page
    console.log(`Selected sector: ${sectorId}`)
  }

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      {/* New sidebar toggle tab */}
      <SidebarToggleTab isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Mobile sidebar overlay with improved animation */}
      <div
        className={`mobile-sidebar ${
          isSidebarOpen && isMobile ? "open" : ""
        } md:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-all duration-300`}
        onClick={() => isMobile && setIsSidebarOpen(false)}
        style={{ visibility: isSidebarOpen && isMobile ? "visible" : "hidden", backgroundColor: "#000000" }}
      >
        <div
          className="w-[85%] max-w-[300px] h-full bg-black transform transition-transform duration-300 ease-out border-r border-[#00ff4c33] sidebar-container"
          style={{
            transform: isSidebarOpen ? "translateX(0)" : "translateX(-100%)",
            backgroundColor: "#000000",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <Sidebar setCurrentView={() => {}} currentView="chat" />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div
        className={`${
          isSidebarOpen ? "md:w-64" : "md:w-0"
        } hidden md:block transition-all duration-300 ease-in-out overflow-hidden z-20 bg-black sidebar-container`}
        style={{ backgroundColor: "#000000" }}
      >
        <Sidebar setCurrentView={() => {}} currentView="chat" />
      </div>

      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <Header
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          selectedBot={selectedBot}
          setSelectedBot={setSelectedBot}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
        />

        <div className="flex-1 overflow-hidden pt-[53px] bg-black">
          <div className="h-full flex flex-col md:flex-row">
            {/* Sectors list panel */}
            <div
              className={`w-full md:w-1/2 lg:w-2/5 h-full overflow-y-auto ${selectedSector && isMobile ? "hidden" : "block"}`}
            >
              <div className="p-4 bg-black">
                <h1 className="text-2xl font-bold text-white mb-4">Market Sectors</h1>

                {/* Search bar */}
                <div className="relative mb-6">
                  <Input
                    type="text"
                    placeholder="Search sectors..."
                    className="w-full bg-black border border-[#00ff4c33] rounded-md py-2 px-4 pl-10 text-white focus:outline-none focus:border-[#00ff4c] focus:ring-1 focus:ring-[#00ff4c]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-[#00ff4c80]" />
                </div>

                {/* Sectors grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredSectors.map((sector) => (
                    <SectorCard key={sector.id} sector={sector} onClick={() => handleSectorClick(sector.id)} />
                  ))}
                </div>
              </div>
            </div>

            {/* Chat area for selected sector */}
            <div
              className={`w-full md:w-1/2 lg:w-3/5 h-full bg-black border-l border-[#00ff4c33] ${selectedSector || !isMobile ? "block" : "hidden"}`}
            >
              {selectedSector ? (
                <div className="h-full flex flex-col">
                  {/* Sector chat header */}
                  <div className="p-4 border-b border-[#00ff4c33] flex items-center">
                    <button
                      className="mr-3 p-1 rounded-full hover:bg-[#00ff4c20]"
                      onClick={() => setSelectedSector(null)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-[#00ff4c]"
                      >
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <h2 className="text-lg font-medium text-white">
                      {sectors.find((s) => s.id === selectedSector)?.name} Analysis
                    </h2>
                  </div>

                  {/* Chat messages area */}
                  <div className="flex-1 overflow-y-auto p-4">
                    <div className="flex flex-col space-y-4">
                      {/* Bot welcome message */}
                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-[#00ff4c20] flex items-center justify-center mr-3 flex-shrink-0">
                          <span className="text-[#00ff4c] text-sm">J</span>
                        </div>
                        <div className="bg-[#00ff4c10] rounded-lg p-3 max-w-[80%]">
                          <p className="text-white">
                            I'm analyzing the {sectors.find((s) => s.id === selectedSector)?.name} sector. What would
                            you like to know?
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Input area */}
                  <div className="p-4 border-t border-[#00ff4c33]">
                    <div className="flex items-center">
                      <input
                        type="text"
                        placeholder="Ask about this sector..."
                        className="flex-1 bg-black border border-[#00ff4c33] rounded-md py-2 px-4 text-white focus:outline-none focus:border-[#00ff4c] focus:ring-1 focus:ring-[#00ff4c]"
                      />
                      <button className="ml-2 p-2 rounded-md bg-[#00ff4c] text-black hover:bg-[#00ff4c99] transition-colors">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="22" y1="2" x2="11" y2="13"></line>
                          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                      </button>
                    </div>

                    {/* Quick prompts */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      <button className="text-xs bg-[#00ff4c20] text-[#00ff4c] px-3 py-1 rounded-full hover:bg-[#00ff4c30]">
                        Key trends
                      </button>
                      <button className="text-xs bg-[#00ff4c20] text-[#00ff4c] px-3 py-1 rounded-full hover:bg-[#00ff4c30]">
                        Top performers
                      </button>
                      <button className="text-xs bg-[#00ff4c20] text-[#00ff4c] px-3 py-1 rounded-full hover:bg-[#00ff4c30]">
                        Risk analysis
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center p-4">
                  <div className="text-center">
                    <div className="inline-block p-3 rounded-full bg-[#00ff4c15] mb-4">
                      <Search className="h-8 w-8 text-[#00ff4c]" />
                    </div>
                    <h3 className="text-xl font-medium text-white">Select a sector</h3>
                    <p className="text-gray-400 mt-2">Choose a market sector to analyze and chat about</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
