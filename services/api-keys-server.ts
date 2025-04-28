import { cookies } from "next/headers"

/**
 * Get all API keys (server-side)
 * @returns Record of API keys
 */
export async function getApiKeys(): Promise<Record<string, string>> {
  try {
    const storedKeys = cookies().get("api-keys")?.value

    if (storedKeys) {
      try {
        return JSON.parse(storedKeys)
      } catch (e) {
        console.error("Failed to parse stored API keys")
        return {}
      }
    }

    return {}
  } catch (error) {
    console.error("Error getting API keys:", error)
    return {}
  }
}

/**
 * Save an API key (server-side)
 * @param name Key name
 * @param value Key value
 * @returns Success status
 */
export async function saveApiKey(name: string, value: string): Promise<boolean> {
  try {
    if (!name || !value) {
      return false
    }

    // Get existing keys
    const storedKeys = cookies().get("api-keys")?.value
    let keys = {}

    if (storedKeys) {
      try {
        keys = JSON.parse(storedKeys)
      } catch (e) {
        console.error("Failed to parse stored API keys")
      }
    }

    // Add new key
    keys[name] = value

    // Save keys
    cookies().set("api-keys", JSON.stringify(keys), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    })

    return true
  } catch (error) {
    console.error("Error saving API key:", error)
    return false
  }
}
