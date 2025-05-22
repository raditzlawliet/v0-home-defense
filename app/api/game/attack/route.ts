import { createServerSupabaseClient } from "@/lib/supabase"
import { NextResponse } from "next/server"
import { getWeaponDamage, getMaxShield } from "@/lib/game-constants"

// Monster types for level 1-5
const monsterTypes = [
  ["Rat", "Spider", "Bat", "Snake", "Slime"],
  ["Wolf", "Goblin", "Skeleton", "Zombie", "Ghost"],
  ["Orc", "Troll", "Ghoul", "Wraith", "Golem"],
  ["Ogre", "Vampire", "Werewolf", "Demon", "Dragon"],
  ["Lich", "Behemoth", "Kraken", "Phoenix", "Leviathan"],
]

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
        // Calculate home age in days
        const homeAge = Math.floor(
          (new Date().getTime() - new Date(home.last_reset_at).getTime()) / (1000 * 60 * 60 * 24),
        )

        // Determine monster level based on home age (1-5)
        const monsterLevel = Math.min(Math.max(Math.floor(homeAge) + 1, 1), 5)

        // Select random monster type for this level
        const monsterTypeIndex = Math.floor(Math.random() * monsterTypes[monsterLevel - 1].length)
        const monsterType = monsterTypes[monsterLevel - 1][monsterTypeIndex]

        // Calculate monster damage (scales with level)
        const monsterDamage = Math.floor(10 * Math.pow(1.5, monsterLevel - 1))

        // Calculate player damage based on weapon level
        const playerDamage = getWeaponDamage(home.weapon_level)

        // Determine outcome (player wins if their damage is higher)
        const playerWins = playerDamage >= monsterDamage

        // Calculate resources gained/lost
        const resourcesChange = playerWins ? Math.floor(monsterLevel * 10) : 0

        // Calculate damage to shield and health
        const maxShield = getMaxShield(home.defense_level)
        let remainingShield = home.shield
        let remainingHealth = home.health

        if (playerWins) {
          // Player takes less damage when winning
          const damageTaken = Math.floor(monsterDamage * 0.5)

          if (damageTaken <= remainingShield) {
            // Shield absorbs all damage
            remainingShield -= damageTaken
          } else {
            // Damage exceeds shield, apply to health
            const shieldDamage = remainingShield
            const healthDamage = damageTaken - shieldDamage

            remainingShield = 0
            remainingHealth = Math.max(0, remainingHealth - healthDamage)
          }
        } else {
          // Player takes full damage when losing
          if (monsterDamage <= remainingShield) {
            // Shield absorbs all damage
            remainingShield -= monsterDamage
          } else {
            // Damage exceeds shield, apply to health
            const shieldDamage = remainingShield
            const healthDamage = monsterDamage - shieldDamage

            remainingShield = 0
            remainingHealth = Math.max(0, remainingHealth - healthDamage)
          }
        }

        // Create attack log
        const { data: log, error: logError } = await supabase
          .from("attack_logs")
          .insert({
            user_id: home.id,
            attacker_type: monsterType,
            attacker_level: monsterLevel,
            damage_dealt: playerDamage,
            damage_received: playerWins ? Math.floor(monsterDamage * 0.5) : monsterDamage,
            resources_gained: resourcesChange,
            outcome: playerWins ? "victory" : "defeat",
          })
          .select()
          .single()

        if (logError) {
          console.error("Error creating attack log:", logError)
          return { homeId: home.id, error: logError.message }
        }

        // Update home data
        const { data: updatedHome, error: updateError } = await supabase
          .from("user_homes")
          .update({
            shield: remainingShield,
            health: remainingHealth,
            resources: playerWins ? home.resources + resourcesChange : home.resources,
          })
          .eq("id", home.id)
          .select()
          .single()

        if (updateError) {
          console.error("Error updating home:", updateError)
          return { homeId: home.id, error: updateError.message }
        }

        return {
          homeId: home.id,
          monsterType,
          monsterLevel,
          outcome: playerWins ? "victory" : "defeat",
          remainingHealth,
          remainingShield,
        }
      }),
    )

    return NextResponse.json({ message: "Attacks processed", results })
  } catch (error) {
    console.error("Error processing attacks:", error)
    return NextResponse.json({ error: "Failed to process attacks" }, { status: 500 })
  }
}
