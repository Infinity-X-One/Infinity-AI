"use client"

import { useState } from "react"
import { Send, Save, Trash2, Plus } from "lucide-react"
import type { Bot } from "@/types/bot"

interface BotDirectivePanelProps {
  bot: Bot
  onSaveDirective: (botId: string, directive: string) => void
}

interface SavedDirective {
  id: string
  text: string
}

export default function BotDirectivePanel({ bot, onSaveDirective }: BotDirectivePanelProps) {
  const [directive, setDirective] = useState("")
  const [savedDirectives, setSavedDirectives] = useState<SavedDirective[]>([
    { id: "1", text: "Monitor all financial news and alert on significant events" },
    { id: "2", text: "Analyze market trends and provide daily summary" },
  ])
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleSaveDirective = () => {
    if (!directive.trim()) return

    if (isEditing && editingId) {
      setSavedDirectives(savedDirectives.map((item) => (item.id === editingId ? { ...item, text: directive } : item)))
      setIsEditing(false)
      setEditingId(null)
    } else {
      const newDirective = {
        id: `directive-${Date.now()}`,
        text: directive,
      }
      setSavedDirectives([...savedDirectives, newDirective])
      onSaveDirective(bot.id, directive)
    }

    setDirective("")
  }

  const handleEditDirective = (directive: SavedDirective) => {
    setDirective(directive.text)
    setIsEditing(true)
    setEditingId(directive.id)
  }

  const handleDeleteDirective = (id: string) => {
    setSavedDirectives(savedDirectives.filter((item) => item.id !== id))
    if (editingId === id) {
      setDirective("")
      setIsEditing(false)
      setEditingId(null)
    }
  }

  const handleApplyDirective = (text: string) => {
    onSaveDirective(bot.id, text)
  }

  return (
    <div className="border border-[#00ff4c33] rounded-lg bg-black/40 backdrop-blur-sm overflow-hidden">
      <div className="p-4 border-b border-[#00ff4c33] bg-[#00ff4c10]">
        <h3 className="font-medium text-white text-lg">
          {bot.name} <span className="text-[#00ff4c]">Directives</span>
        </h3>
      </div>

      <div className="p-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-1">New Directive</label>
          <div className="flex">
            <textarea
              value={directive}
              onChange={(e) => setDirective(e.target.value)}
              rows={3}
              className="flex-grow px-3 py-2 bg-[#0a0a0a] border border-[#00ff4c33] rounded-l-md focus:outline-none focus:ring-1 focus:ring-[#00ff4c] focus:border-[#00ff4c] text-white text-sm"
              placeholder={`Give detailed instructions to ${bot.name}...`}
            />
            <button
              onClick={handleSaveDirective}
              className="px-3 bg-[#00ff4c] hover:bg-[#00dd42] text-black rounded-r-md flex items-center"
            >
              {isEditing ? <Save size={18} /> : <Plus size={18} />}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Be specific about what you want the bot to monitor, analyze, or respond to.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-[#00ff4c] mb-2">Saved Directives</h4>
          {savedDirectives.length === 0 ? (
            <p className="text-sm text-gray-400">No saved directives yet.</p>
          ) : (
            <div className="space-y-2">
              {savedDirectives.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-[#00ff4c10] border border-[#00ff4c33] rounded-md flex items-start justify-between"
                >
                  <div className="flex-grow pr-2">
                    <p className="text-sm text-white">{item.text}</p>
                  </div>
                  <div className="flex items-center space-x-1 flex-shrink-0">
                    <button
                      onClick={() => handleApplyDirective(item.text)}
                      className="p-1 text-[#00ff4c] hover:text-[#00dd42]"
                      title="Apply directive"
                    >
                      <Send size={14} />
                    </button>
                    <button
                      onClick={() => handleEditDirective(item)}
                      className="p-1 text-gray-400 hover:text-white"
                      title="Edit directive"
                    >
                      <Save size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteDirective(item.id)}
                      className="p-1 text-gray-400 hover:text-red-400"
                      title="Delete directive"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
