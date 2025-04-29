"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { usePathname } from "next/navigation"

interface SidebarToggleTabProps {
  isOpen?: boolean
  isSidebarOpen?: boolean
  toggleSidebar: () => void
}

export default function SidebarToggleTab({ isOpen, isSidebarOpen, toggleSidebar }: SidebarToggleTabProps) {
  // Use isSidebarOpen if provided, otherwise fall back to isOpen
  const sidebarIsOpen = isSidebarOpen !== undefined ? isSidebarOpen : isOpen
  const pathname = usePathname()

  // Don't render the toggle tab on the predictions page
  if (pathname === "/predictions") {
    return null
  }

  return (
    <div
      className="fixed top-1/2 -translate-y-1/2 z-40 cursor-pointer transition-all duration-300"
      style={{
        left: sidebarIsOpen ? "256px" : "0px", // 256px is 64rem (w-64)
      }}
      onClick={toggleSidebar}
    >
      <div className="flex items-center justify-center w-5 h-16 bg-black/80 border-y border-r border-[#00ff4c] rounded-r-md shadow-[0_0_10px_rgba(0,255,76,0.5)]">
        <div className="flex flex-col items-center justify-center gap-1 text-white">
          {sidebarIsOpen ? (
            <>
              <ChevronLeft size={12} strokeWidth={2.5} />
              <ChevronLeft size={12} strokeWidth={2.5} />
            </>
          ) : (
            <>
              <ChevronRight size={12} strokeWidth={2.5} />
              <ChevronRight size={12} strokeWidth={2.5} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
