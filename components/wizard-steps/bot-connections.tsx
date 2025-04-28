"use client"

import type { Bot } from "@/types/bot"
import { Database, Globe, Key, Server } from "lucide-react"

interface BotConnectionsProps {
  botData: Partial<Bot>
  updateBotData: (data: Partial<Bot>) => void
  errors: Record<string, string>
}

const connectionTypes = [
  {
    id: "api",
    name: "External API",
    icon: Globe,
    fields: [
      { id: "url", label: "API Endpoint URL", type: "text", placeholder: "https://api.example.com/v1" },
      { id: "key", label: "API Key", type: "password", placeholder: "Enter your API key" },
      {
        id: "headers",
        label: "Custom Headers (JSON)",
        type: "textarea",
        placeholder: '{"Content-Type": "application/json"}',
      },
    ],
  },
  {
    id: "database",
    name: "Database",
    icon: Database,
    fields: [
      {
        id: "connectionString",
        label: "Connection String",
        type: "password",
        placeholder: "postgresql://user:password@localhost:5432/db",
      },
      { id: "type", label: "Database Type", type: "select", options: ["PostgreSQL", "MySQL", "MongoDB", "Supabase"] },
    ],
  },
  {
    id: "auth",
    name: "Authentication Service",
    icon: Key,
    fields: [
      { id: "provider", label: "Auth Provider", type: "select", options: ["OAuth", "JWT", "API Key", "Custom"] },
      { id: "clientId", label: "Client ID", type: "text", placeholder: "Enter client ID" },
      { id: "clientSecret", label: "Client Secret", type: "password", placeholder: "Enter client secret" },
    ],
  },
  {
    id: "custom",
    name: "Custom Service",
    icon: Server,
    fields: [
      { id: "name", label: "Service Name", type: "text", placeholder: "My Custom Service" },
      { id: "endpoint", label: "Endpoint", type: "text", placeholder: "https://example.com/service" },
      {
        id: "authentication",
        label: "Authentication Method",
        type: "select",
        options: ["None", "API Key", "OAuth", "Basic Auth"],
      },
      {
        id: "credentials",
        label: "Credentials (JSON)",
        type: "textarea",
        placeholder: '{"username": "user", "password": "pass"}',
      },
    ],
  },
]

export default function BotConnections({ botData, updateBotData, errors }: BotConnectionsProps) {
  const connections = botData.connections || []

  const addConnection = (type: string) => {
    const newConnection = {
      id: `conn-${Date.now()}`,
      type,
      name: `New ${connectionTypes.find((t) => t.id === type)?.name || "Connection"}`,
      config: {},
    }

    updateBotData({ connections: [...connections, newConnection] })
  }

  const removeConnection = (connectionId: string) => {
    updateBotData({
      connections: connections.filter((conn) => conn.id !== connectionId),
    })
  }

  const updateConnection = (connectionId: string, updates: any) => {
    updateBotData({
      connections: connections.map((conn) => (conn.id === connectionId ? { ...conn, ...updates } : conn)),
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-[#00ff4c] mb-4">External Connections</h3>
        <p className="text-gray-400 mb-6">
          Connect your bot to external services and data sources to enhance its capabilities.
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-3">
          {connectionTypes.map((connType) => {
            const IconComponent = connType.icon
            return (
              <div
                key={connType.id}
                onClick={() => addConnection(connType.id)}
                className="p-4 border border-dashed border-[#333] hover:border-[#00ff4c50] hover:bg-[#00ff4c10] rounded-md cursor-pointer transition-colors"
              >
                <div className="flex items-center">
                  <IconComponent size={20} className="text-[#00ff4c] mr-3" />
                  <h4 className="font-medium text-white">{connType.name}</h4>
                </div>
                <p className="text-sm text-gray-400 mt-2 ml-8">Add a {connType.name.toLowerCase()} connection</p>
              </div>
            )
          })}
        </div>

        {connections.length > 0 && (
          <div className="mt-6">
            <h4 className="text-md font-medium text-white mb-3">Active Connections</h4>
            <div className="space-y-3">
              {connections.map((connection) => {
                const connType = connectionTypes.find((t) => t.id === connection.type)
                const IconComponent = connType?.icon || Server

                return (
                  <div key={connection.id} className="p-4 border border-[#333] rounded-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <IconComponent size={20} className="text-[#00ff4c] mr-3" />
                        <h5 className="font-medium text-white">{connection.name}</h5>
                      </div>
                      <button
                        onClick={() => removeConnection(connection.id)}
                        className="text-gray-400 hover:text-red-400"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="mt-4 ml-8 space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Connection Name</label>
                        <input
                          type="text"
                          value={connection.name}
                          onChange={(e) => updateConnection(connection.id, { name: e.target.value })}
                          className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-md focus:outline-none focus:ring-1 focus:ring-[#00ff4c] focus:border-[#00ff4c]"
                        />
                      </div>

                      {connType?.fields.map((field) => (
                        <div key={field.id}>
                          <label className="block text-sm font-medium text-gray-300 mb-1">{field.label}</label>

                          {field.type === "textarea" ? (
                            <textarea
                              value={connection.config?.[field.id] || ""}
                              onChange={(e) =>
                                updateConnection(connection.id, {
                                  config: { ...connection.config, [field.id]: e.target.value },
                                })
                              }
                              rows={3}
                              className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-md focus:outline-none focus:ring-1 focus:ring-[#00ff4c] focus:border-[#00ff4c]"
                              placeholder={field.placeholder}
                            />
                          ) : field.type === "select" ? (
                            <select
                              value={connection.config?.[field.id] || ""}
                              onChange={(e) =>
                                updateConnection(connection.id, {
                                  config: { ...connection.config, [field.id]: e.target.value },
                                })
                              }
                              className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-md focus:outline-none focus:ring-1 focus:ring-[#00ff4c] focus:border-[#00ff4c]"
                            >
                              <option value="">Select {field.label}</option>
                              {field.options?.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type={field.type}
                              value={connection.config?.[field.id] || ""}
                              onChange={(e) =>
                                updateConnection(connection.id, {
                                  config: { ...connection.config, [field.id]: e.target.value },
                                })
                              }
                              className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333] rounded-md focus:outline-none focus:ring-1 focus:ring-[#00ff4c] focus:border-[#00ff4c]"
                              placeholder={field.placeholder}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
