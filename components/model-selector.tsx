"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface Model {
  id: string
  name: string
  provider: string
  capabilities: string[]
  description: string
  costPerToken: number
}

interface ModelSelectorProps {
  onModelSelect: (modelId: string) => void
  capability?: string
  defaultModel?: string
}

export function ModelSelector({ onModelSelect, capability, defaultModel = "gpt-4o" }: ModelSelectorProps) {
  const [open, setOpen] = useState(false)
  const [models, setModels] = useState<Model[]>([])
  const [selectedModel, setSelectedModel] = useState<Model | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch("/api/ai/models")
        const data = await response.json()

        let filteredModels = data.models

        // Filter by capability if provided
        if (capability) {
          filteredModels = filteredModels.filter((model: Model) => model.capabilities.includes(capability))
        }

        setModels(filteredModels)

        // Set default model
        const defaultModelData = filteredModels.find((model: Model) => model.id === defaultModel)
        if (defaultModelData) {
          setSelectedModel(defaultModelData)
          onModelSelect(defaultModelData.id)
        } else if (filteredModels.length > 0) {
          setSelectedModel(filteredModels[0])
          onModelSelect(filteredModels[0].id)
        }
      } catch (error) {
        console.error("Error fetching models:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchModels()
  }, [capability, defaultModel, onModelSelect])

  const handleSelectModel = (model: Model) => {
    setSelectedModel(model)
    setOpen(false)
    onModelSelect(model.id)
  }

  if (loading) {
    return (
      <Button variant="outline" className="w-full justify-start bg-black/50 border-[#00ff4c33] text-white">
        <Zap className="mr-2 h-4 w-4 animate-pulse text-[#00ff4c]" />
        <span>Loading models...</span>
      </Button>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-black/50 border-[#00ff4c33] text-white hover:bg-[#00ff4c15]"
        >
          {selectedModel ? (
            <>
              <div className="flex items-center">
                <Zap className="mr-2 h-4 w-4 text-[#00ff4c]" />
                <span>{selectedModel.name}</span>
                <span className="ml-2 text-xs text-gray-400">({selectedModel.provider})</span>
              </div>
            </>
          ) : (
            "Select model..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0 bg-black/90 border-[#00ff4c33]">
        <Command>
          <CommandInput placeholder="Search models..." className="h-9 text-white bg-black/90" />
          <CommandList>
            <CommandEmpty className="text-white">No model found.</CommandEmpty>
            <CommandGroup className="max-h-[300px] overflow-y-auto">
              {models.map((model) => (
                <CommandItem
                  key={model.id}
                  value={model.id}
                  onSelect={() => handleSelectModel(model)}
                  className="text-white hover:bg-[#00ff4c15]"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedModel?.id === model.id ? "opacity-100 text-[#00ff4c]" : "opacity-0",
                        )}
                      />
                      <span>{model.name}</span>
                      <span className="ml-2 text-xs text-gray-400">({model.provider})</span>
                    </div>
                    <span className="text-xs text-gray-400">${model.costPerToken.toFixed(5)}/token</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
