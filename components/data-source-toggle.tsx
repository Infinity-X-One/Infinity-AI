"use client"

import { useData } from "@/contexts/data-context"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function DataSourceToggle() {
  const { useLiveData, setUseLiveData } = useData()

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="data-source"
        checked={useLiveData}
        onCheckedChange={setUseLiveData}
        className="data-[state=checked]:bg-lime-500"
      />
      <Label htmlFor="data-source" className="text-lime-400">
        {useLiveData ? "Live Data" : "Stored Data"}
      </Label>
    </div>
  )
}
