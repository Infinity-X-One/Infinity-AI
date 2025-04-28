"use server"

import { getApiKeys, saveApiKey } from "./api-keys-server"

/**
 * Server action to get all API keys
 * @returns Record of API keys
 */
export async function getApiKeysAction(): Promise<Record<string, string>> {
  try {
    return await getApiKeys()
  } catch (error) {
    console.error("Error in getApiKeysAction:", error)
    return {}
  }
}

/**
 * Server action to save an API key
 * @param name Key name
 * @param value Key value
 * @returns Success status
 */
export async function saveApiKeyAction(name: string, value: string): Promise<boolean> {
  try {
    return await saveApiKey(name, value)
  } catch (error) {
    console.error("Error in saveApiKeyAction:", error)
    return false
  }
}
