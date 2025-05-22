// Game constants and calculations

// Weapon calculations
export const getWeaponDamage = (level: number): number => {
  return Math.floor(10 * Math.pow(1.5, level - 1))
}

export const getWeaponName = (level: number): string => {
  const weapons = [
    "Basic Turret",
    "Dual Turret",
    "Automated Sentry",
    "Laser Defense",
    "Plasma Cannon",
    "Quantum Disruptor",
    "Temporal Shield",
    "Antimatter Beam",
    "Singularity Projector",
    "Reality Warper",
  ]

  return weapons[Math.min(level - 1, weapons.length - 1)]
}

// Defense calculations
export const getMaxShield = (level: number): number => {
  return 50 + (level - 1) * 10
}

export const getShieldRegenRate = (level: number): number => {
  return Math.floor(5 * Math.pow(1.2, level - 1))
}

export const getDefenseName = (level: number): string => {
  const defenses = [
    "Wooden Fence",
    "Stone Wall",
    "Metal Barrier",
    "Energy Shield",
    "Quantum Barrier",
    "Dimensional Shield",
    "Reality Anchor",
    "Cosmic Defense",
    "Universal Barrier",
    "Omnipotent Shield",
  ]

  return defenses[Math.min(level - 1, defenses.length - 1)]
}

// Defense power is based on weapon level
export const getDefensePower = (weaponLevel: number): number => {
  return weaponLevel * 10
}

// Attacker types for reference
export const attackerTypes = [
  "Zombie Horde",
  "Shadow Wraith",
  "Rogue Android",
  "Mutant Rat",
  "Feral Ghoul",
  "Bandit Gang",
  "Toxic Sludge",
  "Spectral Entity",
  "Rabid Dog Pack",
  "Alien Scout",
  "Cybernetic Beast",
  "Dimensional Anomaly",
  "Scavenger Group",
  "Mist Creature",
]
