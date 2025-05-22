"use server"

import { createServerSupabaseClient } from "@/lib/supabase"
import type { UserHome, AttackLog } from "@/types/database"
import { getMaxShield } from "@/lib/game-constants"

export async function getUserHome(userId: string): Promise<UserHome | null> {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("user_homes").select("*").eq("id", userId).single()

  if (error) {
    console.error("Error fetching user home:", error)
    return null
  }

  return data
}

export async function getAttackLogs(userId: string, limit = 10): Promise<AttackLog[]> {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("attack_logs")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching attack logs:", error)
    return []
  }

  return data || []
}

export async function repairHealth(userId: string): Promise<UserHome | null> {
  const supabase = createServerSupabaseClient()

  // Get current home data
  const { data: home, error: fetchError } = await supabase.from("user_homes").select("*").eq("id", userId).single()

  if (fetchError || !home) {
    console.error("Error fetching user home:", fetchError)
    return null
  }

  // Calculate repair cost and amount
  const repairAmount = 100 - home.health
  const repairCost = Math.ceil(repairAmount * 2)

  // Check if user has enough resources
  if (home.resources < repairCost || repairAmount <= 0) {
    return home
  }

  // Update home data
  const { data: updatedHome, error: updateError } = await supabase
    .from("user_homes")
    .update({
      health: 100,
      resources: home.resources - repairCost,
    })
    .eq("id", userId)
    .select("*")
    .single()

  if (updateError) {
    console.error("Error updating user home:", updateError)
    return home
  }

  return updatedHome
}

export async function repairShield(userId: string): Promise<UserHome | null> {
  const supabase = createServerSupabaseClient()

  // Get current home data
  const { data: home, error: fetchError } = await supabase.from("user_homes").select("*").eq("id", userId).single()

  if (fetchError || !home) {
    console.error("Error fetching user home:", fetchError)
    return null
  }

  // Calculate max shield and repair amount
  const maxShield = getMaxShield(home.defense_level)
  const repairAmount = maxShield - home.shield
  const repairCost = Math.ceil(repairAmount * 1)

  // Check if user has enough resources
  if (home.resources < repairCost || repairAmount <= 0) {
    return home
  }

  // Update home data
  const { data: updatedHome, error: updateError } = await supabase
    .from("user_homes")
    .update({
      shield: maxShield,
      resources: home.resources - repairCost,
    })
    .eq("id", userId)
    .select("*")
    .single()

  if (updateError) {
    console.error("Error updating user home:", updateError)
    return home
  }

  return updatedHome
}

export async function resetGame(userId: string): Promise<UserHome | null> {
  const supabase = createServerSupabaseClient()

  // Get current home data
  const { data: home, error: fetchError } = await supabase.from("user_homes").select("*").eq("id", userId).single()

  if (fetchError || !home) {
    console.error("Error fetching user home:", fetchError)
    return null
  }

  // Check if home is destroyed
  if (home.health > 0) {
    return home
  }

  // Reset home data
  const { data: updatedHome, error: updateError } = await supabase
    .from("user_homes")
    .update({
      health: 100,
      shield: 50,
      resources: 100,
      weapon_level: 1,
      defense_level: 1,
      last_reset_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .select("*")
    .single()

  if (updateError) {
    console.error("Error resetting user home:", updateError)
    return home
  }

  return updatedHome
}

export async function upgradeWeapon(userId: string): Promise<UserHome | null> {
  const supabase = createServerSupabaseClient()

  // Get current home data
  const { data: home, error: fetchError } = await supabase.from("user_homes").select("*").eq("id", userId).single()

  if (fetchError || !home) {
    console.error("Error fetching user home:", fetchError)
    return null
  }

  // Calculate upgrade cost
  const upgradeCost = Math.ceil(Math.pow(home.weapon_level, 1.5) * 50)

  // Check if user has enough resources
  if (home.resources < upgradeCost) {
    return home
  }

  // Update home data
  const { data: updatedHome, error: updateError } = await supabase
    .from("user_homes")
    .update({
      weapon_level: home.weapon_level + 1,
      resources: home.resources - upgradeCost,
    })
    .eq("id", userId)
    .select("*")
    .single()

  if (updateError) {
    console.error("Error upgrading weapon:", updateError)
    return home
  }

  return updatedHome
}

export async function upgradeDefense(userId: string): Promise<UserHome | null> {
  const supabase = createServerSupabaseClient()

  // Get current home data
  const { data: home, error: fetchError } = await supabase.from("user_homes").select("*").eq("id", userId).single()

  if (fetchError || !home) {
    console.error("Error fetching user home:", fetchError)
    return null
  }

  // Calculate upgrade cost
  const upgradeCost = Math.ceil(Math.pow(home.defense_level, 1.5) * 40)

  // Check if user has enough resources
  if (home.resources < upgradeCost) {
    return home
  }

  // Update home data
  const { data: updatedHome, error: updateError } = await supabase
    .from("user_homes")
    .update({
      defense_level: home.defense_level + 1,
      shield: getMaxShield(home.defense_level + 1), // Fill shield to new max
      resources: home.resources - upgradeCost,
    })
    .eq("id", userId)
    .select("*")
    .single()

  if (updateError) {
    console.error("Error upgrading defense:", updateError)
    return home
  }

  return updatedHome
}
