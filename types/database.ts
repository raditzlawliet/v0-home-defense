export interface UserHome {
  id: string
  created_at: string
  last_reset_at: string
  defense_level: number
  health: number
  shield: number
  weapon_level: number
  resources: number
}

export interface AttackLog {
  id: string
  user_id: string
  created_at: string
  attacker_type: string
  attacker_level: number
  damage_dealt: number
  damage_received: number
  resources_gained: number
  outcome: string
}
