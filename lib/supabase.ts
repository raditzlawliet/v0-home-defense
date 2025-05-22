import { createClient } from "@supabase/supabase-js"

// Create a single supabase client for interacting with your database
export const createServerSupabaseClient = () => {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

// Create a client-side supabase client
export const createBrowserSupabaseClient = () => {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
}
