"use client"

import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"

interface ToolButtonProps {
  icon: ReactNode
  label: string
  onClick: () => void
}

export default function ToolButton({ icon, label, onClick }: ToolButtonProps) {
  return (
    <Button
      variant="outline"
      className="bg-black/50 border-[#00ff4c33] hover:border-[#00ff4c] text-white hover:bg-[#00ff4c15] justify-start"
      onClick={onClick}
    >
      {icon}
      <span className="truncate">{label}</span>
    </Button>
  )
}
