import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    // Call the attack API
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/api/game/attack`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Attack API responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error triggering attacks:", error)
    return NextResponse.json({ error: "Failed to trigger attacks" }, { status: 500 })
  }
}

export const dynamic = "force-dynamic"
