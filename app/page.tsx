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

export default function SignupPage() {
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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        throw error
      }

      if (data.session) {
        // Successfully signed up
        console.log("Signup successful, navigating to dashboard")
        router.push("/dashboard")
      } else {
        // Email confirmation required
        setError("Please check your email for a confirmation link")
      }
    } catch (error: any) {
      console.error("Signup error:", error)
      setError(error.message || "Failed to sign up")
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
            <p className="mt-2 text-center text-sm text-gray-400">Create an account to start defending your home</p>
          </CardHeader>
          <CardContent className="space-y-6 px-6">
            <SocialSignup />

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

            <form onSubmit={handleSignup} className="space-y-4">
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
                    placeholder="Create a password"
                    className="bg-gray-900 border-gray-700 pl-10 text-gray-300 placeholder:text-gray-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                </div>
              </div>
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white" disabled={loading}>
                {loading ? "Signing up..." : "Sign Up"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 px-6 pb-8 pt-0">
            <div className="text-center text-sm text-gray-400">
              Already have an account?{" "}
              <Link href="/login" className="text-purple-400 hover:text-purple-300">
                Log in
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
            <p className="text-center text-xs text-gray-500">We respect your privacy. Your data is secure with us.</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
