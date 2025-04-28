"use client"

import { useState, useEffect } from "react"
import { MessageSquareHeart, AlertTriangle, CheckCircle, XCircle, RefreshCw } from "lucide-react"
import type { Bot as BotType } from "@/types/bot"

interface BotSupervisorProps {
  bots: BotType[]
  onRefreshStatus: () => void
}

export default function BotSupervisor({ bots, onRefreshStatus }: BotSupervisorProps) {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [supervisorActive, setSupervisorActive] = useState(true)

  // Count active and inactive bots
  const activeBots = bots.filter((bot) => bot.enabled).length
  const inactiveBots = bots.length - activeBots

  // Mock data for bot statuses
  const botStatuses = {
    healthy: Math.floor(activeBots * 0.8),
    warning: Math.floor(activeBots * 0.15),
    error: activeBots - Math.floor(activeBots * 0.8) - Math.floor(activeBots * 0.15),
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    // Simulate refresh delay
    setTimeout(() => {
      onRefreshStatus()
      setLastUpdated(new Date())
      setIsRefreshing(false)
    }, 1000)
  }

  // Auto-refresh every 30 seconds if supervisor is active
  useEffect(() => {
    if (!supervisorActive) return

    const interval = setInterval(() => {
      handleRefresh()
    }, 30000)

    return () => clearInterval(interval)
  }, [supervisorActive])

  return (
    <div className="border border-[#00ff4c33] rounded-lg bg-black/40 backdrop-blur-sm overflow-hidden">
      <div className="p-4 border-b border-[#00ff4c33] bg-[#00ff4c10]">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-[#00ff4c20] flex items-center justify-center mr-3">
              <MessageSquareHeart className="text-[#00ff4c]" size={20} />
            </div>
            <div>
              <h3 className="font-medium text-white text-lg">Supervisor Bot</h3>
              <p className="text-sm text-[#00ff4c]">Monitoring all system bots</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={supervisorActive}
              onChange={(e) => setSupervisorActive(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00ff4c40] peer-checked:after:bg-[#00ff4c]"></div>
          </label>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-400">Last updated: {lastUpdated.toLocaleTimeString()}</div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center text-sm text-[#00ff4c] hover:text-[#00dd42]"
          >
            <RefreshCw size={14} className={`mr-1 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-[#00ff4c10] p-3 rounded-md border border-[#00ff4c33]">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400">Active Bots</div>
              <div className="text-lg font-medium text-white">{activeBots}</div>
            </div>
          </div>
          <div className="bg-[#00ff4c10] p-3 rounded-md border border-[#00ff4c33]">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400">Inactive Bots</div>
              <div className="text-lg font-medium text-white">{inactiveBots}</div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-2 bg-[#00ff4c10] rounded-md">
            <div className="flex items-center">
              <CheckCircle size={16} className="text-green-500 mr-2" />
              <span className="text-sm text-white">Healthy</span>
            </div>
            <span className="text-sm font-medium text-white">{botStatuses.healthy}</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-[#00ff4c10] rounded-md">
            <div className="flex items-center">
              <AlertTriangle size={16} className="text-yellow-500 mr-2" />
              <span className="text-sm text-white">Warning</span>
            </div>
            <span className="text-sm font-medium text-white">{botStatuses.warning}</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-[#00ff4c10] rounded-md">
            <div className="flex items-center">
              <XCircle size={16} className="text-red-500 mr-2" />
              <span className="text-sm text-white">Error</span>
            </div>
            <span className="text-sm font-medium text-white">{botStatuses.error}</span>
          </div>
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-medium text-[#00ff4c] mb-2">Recent Alerts</h4>
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {botStatuses.error > 0 && (
              <div className="p-2 bg-red-900/20 border border-red-900/30 rounded-md">
                <div className="flex items-start">
                  <XCircle size={14} className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-white">Analyze Bot failed to process request</p>
                    <p className="text-xs text-gray-400">2 minutes ago</p>
                  </div>
                </div>
              </div>
            )}
            {botStatuses.warning > 0 && (
              <div className="p-2 bg-yellow-900/20 border border-yellow-900/30 rounded-md">
                <div className="flex items-start">
                  <AlertTriangle size={14} className="text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-white">Predictions Bot response time degraded</p>
                    <p className="text-xs text-gray-400">15 minutes ago</p>
                  </div>
                </div>
              </div>
            )}
            <div className="p-2 bg-green-900/20 border border-green-900/30 rounded-md">
              <div className="flex items-start">
                <CheckCircle size={14} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-white">All bots operational</p>
                  <p className="text-xs text-gray-400">30 minutes ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
