import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })

  // Sign out the user
  await supabase.auth.signOut()

  // Clear all cookies
  const cookieStore = cookies()
  cookieStore.getAll().forEach((cookie) => {
    cookies().delete(cookie.name)
  })

  // Redirect to the login page
  return NextResponse.redirect(new URL("/login", request.url))
}
