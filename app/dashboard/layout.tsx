import type React from "react"
import { Sidebar } from "@/components/sidebar"
import { createServerSupabaseClient } from "@/lib/supabase"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerSupabaseClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="flex h-screen bg-gray-950 text-gray-200">
      <Sidebar user={session.user} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
