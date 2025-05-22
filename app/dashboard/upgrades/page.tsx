"use client"

import { useState } from "react"
import { createServerSupabaseClient } from "@/lib/supabase"
import { getUserHome } from "@/app/actions/home-actions"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Zap, Shield, ArrowRight, Coins } from "lucide-react"
import { getWeaponName, getDefenseName, getWeaponDamage, getMaxShield, getShieldRegenRate } from "@/lib/game-constants"
import { upgradeWeapon, upgradeDefense } from "@/app/actions/home-actions"

export default async function UpgradesPage() {
  const supabase = createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return null
  }

  const userId = session.user.id
  const home = await getUserHome(userId)

  if (!home) {
    return (
      <div className="p-6">
        <div className="bg-yellow-900/30 border-l-4 border-yellow-600 p-4 text-yellow-200">
          <p className="text-sm">Home data not found. Please try logging out and back in.</p>
        </div>
      </div>
    )
  }

  return <UpgradesContent initialHome={home} />
}

function UpgradesContent({ initialHome }: { initialHome: any }) {
  const [home, setHome] = useState(initialHome)
  const [loading, setLoading] = useState({
    weapon: false,
    defense: false,
  })

  // Calculate upgrade costs
  const weaponUpgradeCost = Math.ceil(Math.pow(home.weapon_level, 1.5) * 50)
  const defenseUpgradeCost = Math.ceil(Math.pow(home.defense_level, 1.5) * 40)

  // Calculate current and next level stats
  const currentWeaponDamage = getWeaponDamage(home.weapon_level)
  const nextWeaponDamage = getWeaponDamage(home.weapon_level + 1)
  const currentWeaponName = getWeaponName(home.weapon_level)
  const nextWeaponName = getWeaponName(home.weapon_level + 1)

  const currentMaxShield = getMaxShield(home.defense_level)
  const nextMaxShield = getMaxShield(home.defense_level + 1)
  const currentShieldRegen = getShieldRegenRate(home.defense_level)
  const nextShieldRegen = getShieldRegenRate(home.defense_level + 1)
  const currentDefenseName = getDefenseName(home.defense_level)
  const nextDefenseName = getDefenseName(home.defense_level + 1)

  // Handle weapon upgrade
  const handleUpgradeWeapon = async () => {
    if (home.resources < weaponUpgradeCost) return

    setLoading((prev) => ({ ...prev, weapon: true }))
    try {
      const updatedHome = await upgradeWeapon(home.id)
      if (updatedHome) {
        setHome(updatedHome)
      }
    } finally {
      setLoading((prev) => ({ ...prev, weapon: false }))
    }
  }

  // Handle defense upgrade
  const handleUpgradeDefense = async () => {
    if (home.resources < defenseUpgradeCost) return

    setLoading((prev) => ({ ...prev, defense: true }))
    try {
      const updatedHome = await upgradeDefense(home.id)
      if (updatedHome) {
        setHome(updatedHome)
      }
    } finally {
      setLoading((prev) => ({ ...prev, defense: false }))
    }
  }

  // Check if home is destroyed
  const isDestroyed = home.health <= 0

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Upgrades</h1>
        <div className="flex items-center bg-gray-800 px-4 py-2 rounded-md border border-gray-700">
          <Coins className="h-5 w-5 mr-2 text-yellow-500" />
          <span className="text-yellow-500 font-bold">{home.resources}</span>
          <span className="text-gray-400 ml-1">resources</span>
        </div>
      </div>

      {isDestroyed && (
        <Card className="border-red-800 bg-red-900/20 mb-6">
          <CardContent className="p-4">
            <p className="text-red-400">
              Your home has been destroyed! Return to the dashboard to rebuild before upgrading.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weapon Upgrade Card */}
        <Card className="border-gray-800 bg-gray-900">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Zap className="mr-2 h-5 w-5 text-game-weapon" />
              Upgrade Weapon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 mb-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Current Level</p>
                  <p className="text-white text-xl font-bold">{home.weapon_level}</p>
                </div>
                <div className="flex items-center justify-center">
                  <ArrowRight className="text-purple-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Next Level</p>
                  <p className="text-purple-400 text-xl font-bold">{home.weapon_level + 1}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Weapon Type</span>
                <div className="flex items-center">
                  <span className="text-white">{currentWeaponName}</span>
                  <ArrowRight className="mx-2 h-4 w-4 text-purple-400" />
                  <span className="text-purple-400 font-medium">{nextWeaponName}</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400">Damage</span>
                <div className="flex items-center">
                  <span className="text-white">{currentWeaponDamage}</span>
                  <ArrowRight className="mx-2 h-4 w-4 text-purple-400" />
                  <span className="text-purple-400 font-medium">{nextWeaponDamage}</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400">Upgrade Cost</span>
                <span className="text-yellow-500 font-bold">{weaponUpgradeCost} resources</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={home.resources < weaponUpgradeCost || loading.weapon || isDestroyed}
              onClick={handleUpgradeWeapon}
            >
              {loading.weapon ? (
                <>
                  <Zap className="mr-2 h-4 w-4 animate-spin" />
                  Upgrading...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Upgrade Weapon
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* Defense Upgrade Card */}
        <Card className="border-gray-800 bg-gray-900">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Shield className="mr-2 h-5 w-5 text-game-defense" />
              Upgrade Defense
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 mb-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Current Level</p>
                  <p className="text-white text-xl font-bold">{home.defense_level}</p>
                </div>
                <div className="flex items-center justify-center">
                  <ArrowRight className="text-purple-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Next Level</p>
                  <p className="text-purple-400 text-xl font-bold">{home.defense_level + 1}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Defense Type</span>
                <div className="flex items-center">
                  <span className="text-white">{currentDefenseName}</span>
                  <ArrowRight className="mx-2 h-4 w-4 text-purple-400" />
                  <span className="text-purple-400 font-medium">{nextDefenseName}</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400">Max Shield</span>
                <div className="flex items-center">
                  <span className="text-white">{currentMaxShield}</span>
                  <ArrowRight className="mx-2 h-4 w-4 text-purple-400" />
                  <span className="text-purple-400 font-medium">{nextMaxShield}</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400">Shield Regen</span>
                <div className="flex items-center">
                  <span className="text-white">{currentShieldRegen}/hr</span>
                  <ArrowRight className="mx-2 h-4 w-4 text-purple-400" />
                  <span className="text-purple-400 font-medium">{nextShieldRegen}/hr</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400">Upgrade Cost</span>
                <span className="text-yellow-500 font-bold">{defenseUpgradeCost} resources</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={home.resources < defenseUpgradeCost || loading.defense || isDestroyed}
              onClick={handleUpgradeDefense}
            >
              {loading.defense ? (
                <>
                  <Shield className="mr-2 h-4 w-4 animate-spin" />
                  Upgrading...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Upgrade Defense
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
