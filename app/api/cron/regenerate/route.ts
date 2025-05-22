import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    // Call the regenerate API
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/api/game/regenerate`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Regenerate API responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error triggering shield regeneration:", error)
    return NextResponse.json({ error: "Failed to trigger shield regeneration" }, { status: 500 })
  }
}

export const dynamic = "force-dynamic"
