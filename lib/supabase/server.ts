import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

/**
 * Supabase client for Server Components / Server Actions / Route Handlers.
 * Reads/writes auth cookies for SSR session persistence.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            )
          } catch {
            // Called from a Server Component — middleware will refresh the
            // session. Safe to ignore.
          }
        },
      },
    },
  )
}

/**
 * Service-role client — bypasses RLS, full DB access. Use only on server,
 * never expose to browser. For server-side admin operations (seed, audit
 * queries beyond user's RS scope, etc.).
 */
export function createSupabaseServiceRoleClient() {
  // Lazy require to avoid bundling service role JWT into client builds
  // (defense-in-depth — env vars without NEXT_PUBLIC_ prefix already won't ship)
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createClient } = require("@supabase/supabase-js")
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  )
}
