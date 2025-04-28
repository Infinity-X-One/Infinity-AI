"use client"

import { useState } from "react"
import { Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import SettingsModal from "@/components/settings-modal"

export default function SettingsButton() {
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <>
      <Button
        variant="ghost"
        className="text-white hover:text-[#00ff4c] hover:bg-[#00ff4c15]"
        onClick={() => setSettingsOpen(true)}
      >
        <Settings size={20} />
      </Button>

      <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  )
}
