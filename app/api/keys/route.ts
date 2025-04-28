import { NextResponse } from "next/server"
import { getApiKeys, saveApiKey } from "@/services/api-keys-server"

// API route to get API keys
export async function GET() {
  try {
    const keys = await getApiKeys()
    return NextResponse.json(keys)
  } catch (error) {
    console.error("Error in GET /api/keys:", error)
    return NextResponse.json({ error: "Failed to retrieve API keys" }, { status: 500 })
  }
}

// API route to save an API key
export async function POST(request: Request) {
  try {
    const { name, value } = await request.json()

    if (!name || !value) {
      return NextResponse.json({ error: "Name and value are required" }, { status: 400 })
    }

    const success = await saveApiKey(name, value)

    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Failed to save API key" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error in POST /api/keys:", error)
    return NextResponse.json({ error: "Failed to save API key" }, { status: 500 })
  }
}
