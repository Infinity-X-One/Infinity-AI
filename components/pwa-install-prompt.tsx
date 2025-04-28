"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, Download, Smartphone } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // Check if the device is iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    setIsIOS(isIOSDevice)

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault()
      // Stash the event so it can be triggered later
      setDeferredPrompt(e)
      // Show the install prompt
      setShowPrompt(true)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    // Check if the app is already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setShowPrompt(false)
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = () => {
    if (!deferredPrompt) return

    // Show the install prompt
    deferredPrompt.prompt()

    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the install prompt")
      } else {
        console.log("User dismissed the install prompt")
      }
      // Clear the saved prompt as it can't be used again
      setDeferredPrompt(null)
      setShowPrompt(false)
    })
  }

  if (!showPrompt) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="pwa-install-prompt"
      >
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-[#00ff4c] font-bold flex items-center">
            <Smartphone className="mr-2" size={18} /> Install Infinity AI
          </h3>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-white hover:text-[#00ff4c] hover:bg-[#00ff4c15]"
            onClick={() => setShowPrompt(false)}
          >
            <X size={16} />
          </Button>
        </div>
        <p className="text-white text-sm mb-4">
          {isIOS
            ? "Add Infinity AI to your home screen for quick access. Tap the share button and then 'Add to Home Screen'."
            : "Install Infinity AI on your home screen for quick and easy access when you're on the go."}
        </p>
        <div className="flex justify-end">
          {!isIOS && (
            <Button onClick={handleInstallClick} className="neon-button flex items-center">
              <Download size={16} className="mr-2" /> Install App
            </Button>
          )}
          {isIOS && (
            <div className="flex items-center text-[#00ff4c] text-sm">
              <span className="animate-pulse">↑</span> Tap share then "Add to Home Screen"
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
