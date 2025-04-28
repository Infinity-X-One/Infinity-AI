// Enhanced API client with better error handling and authentication
export class ApiClient {
  private baseUrl: string
  private headers: Record<string, string>

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
    this.headers = {
      "Content-Type": "application/json",
    }
  }

  setApiKey(apiKey: string): void {
    this.headers["Authorization"] = `Bearer ${apiKey}`
  }

  async setAuthHeader(apiKeyName: string): Promise<void> {
    try {
      // In a real implementation, you would fetch the API key from your secure storage
      const response = await fetch("/api/keys?name=" + apiKeyName)
      if (!response.ok) {
        throw new Error(`Failed to get API key: ${response.statusText}`)
      }

      const data = await response.json()
      if (data.key) {
        this.headers["Authorization"] = `Bearer ${data.key}`
      } else {
        console.warn(`API key '${apiKeyName}' not found`)
      }
    } catch (error) {
      console.error("Error setting auth header:", error)
      throw error
    }
  }

  async get<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
    try {
      const url = new URL(this.baseUrl + endpoint)

      // Add query parameters
      Object.keys(params).forEach((key) => {
        url.searchParams.append(key, params[key])
      })

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: this.headers,
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`Error in GET request to ${endpoint}:`, error)
      throw error
    }
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    try {
      const response = await fetch(this.baseUrl + endpoint, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify(data),
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`Error in POST request to ${endpoint}:`, error)
      throw error
    }
  }
}
