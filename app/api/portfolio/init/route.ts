import { NextResponse } from "next/server"
import { initializeDatabase } from "@/services/portfolio-service"

export async function POST() {
  try {
    const success = await initializeDatabase()

    if (success) {
      return NextResponse.json({ success: true, message: "Database initialized successfully" })
    } else {
      return NextResponse.json({ success: false, message: "Failed to initialize database" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error in portfolio init API:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
