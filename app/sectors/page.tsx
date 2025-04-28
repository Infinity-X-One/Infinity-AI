import SectorsInterface from "@/components/sectors-interface"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Market Sectors | InfinityAI",
  description: "Explore market sectors with InfinityAI confidence scores and key assets",
}

export default function SectorsPage() {
  return <SectorsInterface />
}
