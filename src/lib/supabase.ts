import { createClient } from '@supabase/supabase-js'

// Safe initialization for build-time (Vercel Prerendering)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials missing. Build may fail if static generation is used.")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
