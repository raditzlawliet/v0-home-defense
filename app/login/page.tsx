"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Mail, Lock, Shield } from "lucide-react"
import { useRouter } from "next/navigation"
import { createBrowserSupabaseClient } from "@/lib/supabase"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { SocialSignup } from "@/components/social-signup"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createBrowserSupabaseClient()

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        router.push("/dashboard")
      }
    }

    checkSession()
  }, [router, supabase.auth])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      if (data.session) {
        // Successfully logged in
        console.log("Login successful, navigating to dashboard")
        router.push("/dashboard")
      }
    } catch (error: any) {
      console.error("Login error:", error)
      setError(error.message || "Failed to sign in")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <div className="w-full sm:w-[375px] md:w-[414px] mx-auto">
        <Card className="w-full border-gray-700 bg-gray-800 shadow-xl">
          <CardHeader className="flex items-center justify-center pt-8">
            <div className="relative flex items-center justify-center rounded-full bg-purple-600 p-3 text-white">
              <Shield className="h-8 w-8" />
            </div>
            <h1 className="mt-6 text-center text-2xl font-bold text-white">Home Defense</h1>
            <p className="mt-2 text-center text-sm text-gray-400">Log in to defend your home from anomalies</p>
          </CardHeader>
          <CardContent className="space-y-6 px-6">
            <SocialSignup isLogin={true} />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gray-800 px-2 text-gray-400">Or continue with</span>
              </div>
            </div>

            {error && (
              <div className="bg-red-900/30 text-red-400 p-3 rounded-md text-sm border border-red-800">{error}</div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="bg-gray-900 border-gray-700 pl-10 text-gray-300 placeholder:text-gray-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    className="bg-gray-900 border-gray-700 pl-10 text-gray-300 placeholder:text-gray-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="remember" className="h-4 w-4 rounded border-gray-700 bg-gray-900" />
                  <label htmlFor="remember" className="text-sm text-gray-400">
                    Remember me
                  </label>
                </div>
                <Link href="#" className="text-sm text-purple-400 hover:text-purple-300">
                  Forgot password?
                </Link>
              </div>
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white" disabled={loading}>
                {loading ? "Logging in..." : "Log In"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 px-6 pb-8 pt-0">
            <div className="text-center text-sm text-gray-400">
              Don't have an account?{" "}
              <Link href="/" className="text-purple-400 hover:text-purple-300">
                Sign up
              </Link>
            </div>
            <div className="flex justify-center space-x-4 text-xs text-gray-500">
              <Link href="#" className="hover:text-gray-400">
                Terms
              </Link>
              <Link href="#" className="hover:text-gray-400">
                Privacy
              </Link>
              <Link href="#" className="hover:text-gray-400">
                Help
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
