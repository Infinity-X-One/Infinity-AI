"use client"

/**
 * Client-side wrapper for API key operations
 * This file contains only client-side code and uses fetch API to communicate with the server
 */

/**
 * Get all API keys (client-side)
 * @returns Record of API keys
 */
export async function getApiKeysClient(): Promise<Record<string, string>> {
  try {
    const response = await fetch("/api/keys")
    if (!response.ok) {
      throw new Error("Failed to fetch API keys")
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching API keys:", error)
    return {}
  }
}

/**
 * Save an API key (client-side)
 * @param name Key name
 * @param value Key value
 * @returns Success status
 */
export async function saveApiKeyClient(name: string, value: string): Promise<boolean> {
  try {
    const response = await fetch("/api/keys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, value }),
    })

    return response.ok
  } catch (error) {
    console.error("Error saving API key:", error)
    return false
  }
}
