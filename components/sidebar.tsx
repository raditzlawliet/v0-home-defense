import Link from "next/link"
import type { User } from "@supabase/supabase-js"
import { Home, Shield, Zap, LogOut } from "lucide-react"
import { createServerSupabaseClient } from "@/lib/supabase"

interface SidebarProps {
  user: User
}

export async function Sidebar({ user }: SidebarProps) {
  const supabase = createServerSupabaseClient()

  return (
    <div className="w-64 bg-gray-900 text-gray-300 h-full flex flex-col border-r border-gray-800">
      <div className="p-4 border-b border-gray-800 bg-gray-950">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-600 rounded-md">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Home Defense</h2>
            <p className="text-xs text-gray-400 truncate max-w-[180px]">{user.email}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          <li>
            <Link href="/dashboard" className="flex items-center p-2 rounded hover:bg-gray-800 transition-colors">
              <Home className="w-5 h-5 mr-3 text-gray-400" />
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/defense"
              className="flex items-center p-2 rounded hover:bg-gray-800 transition-colors"
            >
              <Shield className="w-5 h-5 mr-3 text-gray-400" />
              <span>Defense</span>
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/upgrades"
              className="flex items-center p-2 rounded hover:bg-gray-800 transition-colors"
            >
              <Zap className="w-5 h-5 mr-3 text-gray-400" />
              <span>Upgrades</span>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <form action="/api/auth/signout" method="post">
          <button type="submit" className="flex items-center p-2 w-full rounded hover:bg-gray-800 transition-colors">
            <LogOut className="w-5 h-5 mr-3 text-gray-400" />
            <span>Logout</span>
          </button>
        </form>
      </div>
    </div>
  )
}
