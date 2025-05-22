"use client"

import { useEffect, useState } from "react"
import type { AttackLog } from "@/types/database"
import { createBrowserSupabaseClient } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Shield } from "lucide-react"

interface AttackLogsProps {
  initialLogs: AttackLog[]
  userId: string
}

export function AttackLogs({ initialLogs, userId }: AttackLogsProps) {
  const [logs, setLogs] = useState<AttackLog[]>(initialLogs)
  const supabase = createBrowserSupabaseClient()

  useEffect(() => {
    // Subscribe to real-time updates
    const channel = supabase
      .channel("attack_logs_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "attack_logs",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const newLog = payload.new as AttackLog
          setLogs((prevLogs) => [newLog, ...prevLogs.slice(0, 9)])
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, userId])

  // Format the log message with HTML for styling
  const formatLogMessage = (log: AttackLog) => {
    const date = new Date(log.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

    if (log.outcome === "victory") {
      return (
        <>
          <span className="text-gray-400">[{date}]</span> You defeated the{" "}
          <span className="font-bold text-yellow-300">{log.attacker_type}</span> (Lvl {log.attacker_level}). Dealt{" "}
          <span className="font-bold text-green-400">{log.damage_dealt}</span> damage, took{" "}
          <span className="font-bold text-red-400">{log.damage_received}</span> damage
          {log.resources_gained > 0 ? (
            <>
              , gained <span className="font-bold text-yellow-400">{log.resources_gained}</span> resources
            </>
          ) : (
            ""
          )}
          .
        </>
      )
    } else {
      return (
        <>
          <span className="text-gray-400">[{date}]</span> You were defeated by the{" "}
          <span className="font-bold text-yellow-300">{log.attacker_type}</span> (Lvl {log.attacker_level}). Dealt{" "}
          <span className="font-bold text-green-400">{log.damage_dealt}</span> damage, took{" "}
          <span className="font-bold text-red-400">{log.damage_received}</span> damage
          {log.resources_gained > 0 ? (
            <>
              , lost <span className="font-bold text-yellow-400">{log.resources_gained}</span> resources
            </>
          ) : (
            ""
          )}
          .
        </>
      )
    }
  }

  return (
    <Card className="h-full border-gray-800 bg-gray-900">
      <CardHeader className="pb-2 border-b border-gray-800">
        <CardTitle className="text-white flex items-center">
          <AlertTriangle className="mr-2 h-5 w-5 text-purple-400" />
          Attack Logs
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-auto max-h-[calc(100vh-12rem)] p-3">
        {logs.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Shield className="mx-auto h-12 w-12 mb-2 opacity-20" />
            <p>No attacks recorded yet</p>
            <p className="text-sm">Your home is safe for now</p>
          </div>
        ) : (
          <div className="space-y-2 text-sm">
            {logs.map((log) => (
              <div
                key={log.id}
                className={`p-3 rounded-md border ${
                  log.outcome === "victory"
                    ? "border-green-800/50 bg-green-900/10 text-gray-200"
                    : "border-red-800/50 bg-red-900/10 text-gray-200"
                }`}
              >
                {formatLogMessage(log)}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
