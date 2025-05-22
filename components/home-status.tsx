"use client"

import { useState } from "react"
import type { UserHome } from "@/types/database"
import { Shield, Heart, Zap, Clock, Coins, Hammer, RefreshCw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  getWeaponName,
  getDefenseName,
  getWeaponDamage,
  getDefensePower,
  getMaxShield,
  getShieldRegenRate,
} from "@/lib/game-constants"
import { repairHealth, repairShield, resetGame } from "@/app/actions/home-actions"

interface HomeStatusProps {
  home: UserHome
}

export function HomeStatus({ home: initialHome }: HomeStatusProps) {
  const [home, setHome] = useState<UserHome>(initialHome)
  const [loading, setLoading] = useState<{
    health: boolean
    shield: boolean
    reset: boolean
  }>({
    health: false,
    shield: false,
    reset: false,
  })

  // Calculate home age in days
  const homeAge = Math.floor((new Date().getTime() - new Date(home.last_reset_at).getTime()) / (1000 * 60 * 60 * 24))

  // Calculate game stats
  const weaponDamage = getWeaponDamage(home.weapon_level)
  const defensePower = getDefensePower(home.weapon_level)
  const maxShield = getMaxShield(home.defense_level)
  const shieldRegen = getShieldRegenRate(home.defense_level)

  // Calculate repair costs
  const healthRepairCost = Math.ceil((100 - home.health) * 2)
  const shieldRepairCost = Math.ceil((maxShield - home.shield) * 1)

  // Handle repair health
  const handleRepairHealth = async () => {
    if (home.resources < healthRepairCost || home.health >= 100) return

    setLoading((prev) => ({ ...prev, health: true }))
    try {
      const updatedHome = await repairHealth(home.id)
      if (updatedHome) {
        setHome(updatedHome)
      }
    } finally {
      setLoading((prev) => ({ ...prev, health: false }))
    }
  }

  // Handle repair shield
  const handleRepairShield = async () => {
    if (home.resources < shieldRepairCost || home.shield >= maxShield) return

    setLoading((prev) => ({ ...prev, shield: true }))
    try {
      const updatedHome = await repairShield(home.id)
      if (updatedHome) {
        setHome(updatedHome)
      }
    } finally {
      setLoading((prev) => ({ ...prev, shield: false }))
    }
  }

  // Handle reset game
  const handleResetGame = async () => {
    if (home.health > 0) return

    setLoading((prev) => ({ ...prev, reset: true }))
    try {
      const updatedHome = await resetGame(home.id)
      if (updatedHome) {
        setHome(updatedHome)
      }
    } finally {
      setLoading((prev) => ({ ...prev, reset: false }))
    }
  }

  // Check if home is destroyed
  const isDestroyed = home.health <= 0

  return (
    <div className="space-y-6">
      {isDestroyed && (
        <Card className="border-red-800 bg-red-900/20">
          <CardContent className="p-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-400 mb-2">Your Home Has Been Destroyed!</h2>
              <p className="text-gray-300 mb-4">Your defenses have failed and your home has been overrun by enemies.</p>
              <Button onClick={handleResetGame} disabled={loading.reset} className="bg-red-600 hover:bg-red-700">
                {loading.reset ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Rebuild Your Home
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-gray-800 bg-gray-900">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl text-white flex items-center">
            <Clock className="mr-2 h-5 w-5 text-purple-400" />
            Home Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex items-center">
              <Clock className="h-8 w-8 mr-3 text-purple-400" />
              <div>
                <h3 className="text-sm text-gray-400">Home Age</h3>
                <p className="text-2xl font-bold text-white">{homeAge} days</p>
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex items-center">
              <Coins className="h-8 w-8 mr-3 text-yellow-500" />
              <div>
                <h3 className="text-sm text-gray-400">Resources</h3>
                <p className="text-2xl font-bold text-yellow-500">{home.resources}</p>
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex items-center">
              <Shield className="h-8 w-8 mr-3 text-blue-500" />
              <div>
                <h3 className="text-sm text-gray-400">Shield Regen</h3>
                <p className="text-2xl font-bold text-blue-500">+{shieldRegen}/hr</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-gray-800 bg-gray-800">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <Heart className="w-5 h-5 mr-2 text-game-health" />
                    <h3 className="font-medium text-white">Health</h3>
                  </div>
                  <span className="font-bold text-white">{home.health}/100</span>
                </div>
                <Progress value={home.health} className="h-2 bg-gray-700" indicatorClassName="bg-game-health" />
                <div className="mt-4">
                  <Button
                    size="sm"
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white"
                    disabled={home.resources < healthRepairCost || home.health >= 100 || loading.health || isDestroyed}
                    onClick={handleRepairHealth}
                  >
                    {loading.health ? (
                      <>
                        <Hammer className="mr-2 h-4 w-4 animate-spin" />
                        Repairing...
                      </>
                    ) : (
                      <>
                        <Hammer className="mr-2 h-4 w-4" />
                        Repair ({healthRepairCost} resources)
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-800 bg-gray-800">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-game-shield" />
                    <h3 className="font-medium text-white">Shield</h3>
                  </div>
                  <span className="font-bold text-white">
                    {home.shield}/{maxShield}
                  </span>
                </div>
                <Progress
                  value={(home.shield / maxShield) * 100}
                  className="h-2 bg-gray-700"
                  indicatorClassName="bg-game-shield"
                />
                <div className="mt-4">
                  <Button
                    size="sm"
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white"
                    disabled={
                      home.resources < shieldRepairCost || home.shield >= maxShield || loading.shield || isDestroyed
                    }
                    onClick={handleRepairShield}
                  >
                    {loading.shield ? (
                      <>
                        <Hammer className="mr-2 h-4 w-4 animate-spin" />
                        Repairing...
                      </>
                    ) : (
                      <>
                        <Hammer className="mr-2 h-4 w-4" />
                        Repair ({shieldRepairCost} resources)
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-800 bg-gray-800">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-game-defense" />
                    <h3 className="font-medium text-white">Defense Power</h3>
                  </div>
                  <span className="font-bold text-white">{defensePower}</span>
                </div>
                <Progress
                  value={defensePower}
                  max={100}
                  className="h-2 bg-gray-700"
                  indicatorClassName="bg-game-defense"
                />
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card className="border-gray-800 bg-gray-900">
        <CardHeader className="pb-2">
          <CardTitle className="text-white flex items-center">
            <Shield className="mr-2 h-5 w-5 text-purple-400" />
            Defense System
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <h3 className="font-medium mb-2 text-white flex items-center">
                <Zap className="w-4 h-4 mr-2 text-game-weapon" /> Weapon (Level {home.weapon_level})
              </h3>
              <div className="flex items-center mb-2">
                <div className="flex-1">
                  <Progress
                    value={home.weapon_level * 10}
                    max={100}
                    className="h-2 bg-gray-700"
                    indicatorClassName="bg-game-weapon"
                  />
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-gray-400">{getWeaponName(home.weapon_level)}</p>
                <p className="text-white">
                  Damage: <span className="text-game-weapon">{weaponDamage}</span>
                </p>
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <h3 className="font-medium mb-2 text-white flex items-center">
                <Shield className="w-4 h-4 mr-2 text-game-defense" /> Defense (Level {home.defense_level})
              </h3>
              <div className="flex items-center mb-2">
                <div className="flex-1">
                  <Progress
                    value={home.defense_level * 10}
                    max={100}
                    className="h-2 bg-gray-700"
                    indicatorClassName="bg-game-defense"
                  />
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-gray-400">{getDefenseName(home.defense_level)}</p>
                <p className="text-white">
                  Max Shield: <span className="text-game-shield">{maxShield}</span>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
