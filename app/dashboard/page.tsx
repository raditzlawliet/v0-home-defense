import { createServerSupabaseClient } from "@/lib/supabase"
import { getUserHome, getAttackLogs } from "../actions/home-actions"
import { HomeStatus } from "@/components/home-status"
import { AttackLogs } from "@/components/attack-logs"

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return null
  }

  const userId = session.user.id
  const home = await getUserHome(userId)
  const attackLogs = await getAttackLogs(userId)

  if (!home) {
    return (
      <div className="p-6">
        <div className="bg-yellow-900/30 border-l-4 border-yellow-600 p-4 text-yellow-200">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm">Home data not found. Please try logging out and back in.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full">
      <div className="flex-1 p-6 overflow-auto">
        <h1 className="text-2xl font-bold mb-6 text-white">Dashboard</h1>
        <HomeStatus home={home} />
      </div>

      <div className="w-80 border-l border-gray-800 bg-gray-900 p-4 overflow-auto">
        <AttackLogs initialLogs={attackLogs} userId={userId} />
      </div>
    </div>
  )
}
