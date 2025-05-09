import ProofInterface from "@/components/proof-interface"
import Header from "@/components/header"
import SidebarWrapper from "@/components/sidebar-wrapper"
import { PortfolioTicker } from "@/components/portfolio-ticker"

export default function ProofPage() {
  return (
    <div className="flex h-screen bg-black">
      <SidebarWrapper />
      <div className="flex-1 overflow-auto">
        <Header
          isSidebarOpen={true}
          // Remove function props that cause server/client issues
          selectedBot="Infinity AI"
          selectedModel="OpenAI"
        />
        <PortfolioTicker />
        <ProofInterface />
      </div>
    </div>
  )
}
