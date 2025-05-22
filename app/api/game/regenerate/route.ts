import { createServerSupabaseClient } from "@/lib/supabase"
import { NextResponse } from "next/server"
import { getMaxShield, getShieldRegenRate } from "@/lib/game-constants"

export async function GET() {
  const supabase = createServerSupabaseClient()

  try {
    // Get all active homes with health > 0
    const { data: homes, error } = await supabase.from("user_homes").select("*").gt("health", 0)

    if (error) {
      throw error
    }

    if (!homes || homes.length === 0) {
      return NextResponse.json({ message: "No active homes found" })
    }

    // Process each home
    const results = await Promise.all(
      homes.map(async (home) => {
        const maxShield = getMaxShield(home.defense_level)
        const regenRate = getShieldRegenRate(home.defense_level)

        // Skip if shield is already at max
        if (home.shield >= maxShield) {
          return { homeId: home.id, message: "Shield already at max" }
        }

        // Calculate new shield value
        const newShield = Math.min(home.shield + regenRate, maxShield)

        // Update home data
        const { data: updatedHome, error: updateError } = await supabase
          .from("user_homes")
          .update({
            shield: newShield,
          })
          .eq("id", home.id)
          .select()
          .single()

        if (updateError) {
          console.error("Error updating shield:", updateError)
          return { homeId: home.id, error: updateError.message }
        }

        return {
          homeId: home.id,
          previousShield: home.shield,
          newShield,
          regenerated: newShield - home.shield,
        }
      }),
    )

    return NextResponse.json({ message: "Shield regeneration processed", results })
  } catch (error) {
    console.error("Error processing shield regeneration:", error)
    return NextResponse.json({ error: "Failed to process shield regeneration" }, { status: 500 })
  }
}
