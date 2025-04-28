"use client"

import { useMobile } from "@/hooks/use-mobile"

export default function CustomInfinityIcon() {
  const isMobile = useMobile()

  // Adjust size based on mobile or desktop
  const size = isMobile ? 32 : 40
  const strokeWidth = isMobile ? 1.5 : 1.2

  return (
    <div className="relative">
      {/* Glow effect */}
      <div className="absolute inset-0 blur-md bg-[#00ff4c] opacity-20 rounded-full"></div>

      {/* Infinity symbol */}
      <svg
        width={size}
        height={size * 0.6}
        viewBox="0 0 24 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10"
      >
        <path
          d="M7 7C7 9.76142 9.23858 12 12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7Z"
          stroke="#00ff4c"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18.5 7C18.5 10.0376 20.9624 12.5 24 12.5C27.0376 12.5 29.5 10.0376 29.5 7C29.5 3.96243 27.0376 1.5 24 1.5C20.9624 1.5 18.5 3.96243 18.5 7Z"
          stroke="white"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          transform="translate(-12, 0)"
        />
      </svg>
    </div>
  )
}
