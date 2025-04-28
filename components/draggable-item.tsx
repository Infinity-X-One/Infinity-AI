"use client"

import type React from "react"

import { useDrag } from "react-dnd"
import type { LucideIcon } from "lucide-react"

interface DraggableItemProps {
  id: string
  type: string
  name: string
  icon: LucideIcon
  children?: React.ReactNode
}

export default function DraggableItem({ id, type, name, icon: Icon, children }: DraggableItemProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type,
    item: { id, name, type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  return (
    <div
      ref={drag}
      className={`px-3 py-2 bg-[#00ff4c15] border border-[#00ff4c33] rounded-md flex items-center gap-2 cursor-grab hover:bg-[#00ff4c20] ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      <Icon className="w-4 h-4 text-[#00ff4c]" />
      <span>{name}</span>
      {children}
    </div>
  )
}
