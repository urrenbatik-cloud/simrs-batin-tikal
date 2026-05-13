/**
 * Session helper — resolve current authenticated user + tenant context.
 *
 * Used at the top of every Server Action / Server Component that needs
 * user-scoped data. Throws if no auth (middleware should redirect first).
 */
import "server-only"
import { eq } from "drizzle-orm"
import { db } from "@/db"
import { usersTable, type User } from "@/db/schema/users"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export class UnauthorizedError extends Error {
  constructor() {
    super("Tidak terautentikasi")
    this.name = "UnauthorizedError"
  }
}

export interface SessionContext {
  userId: string
  rsId: string
  role: string
  email: string
  namaLengkap: string
}

/**
 * Get the current authenticated session context.
 * Returns null if not authenticated (caller decides redirect vs throw).
 */
export async function getCurrentSession(): Promise<SessionContext | null> {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  if (!authUser) return null

  const [profile] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, authUser.id))
    .limit(1)

  if (!profile || profile.deletedAt) return null

  return {
    userId: profile.id,
    rsId: profile.rsId,
    role: profile.role,
    email: profile.email,
    namaLengkap: profile.namaLengkap,
  }
}

/**
 * Same as getCurrentSession but throws UnauthorizedError if not authenticated.
 * Use in Server Actions where we expect middleware to have already gated.
 */
export async function requireSession(): Promise<SessionContext> {
  const session = await getCurrentSession()
  if (!session) throw new UnauthorizedError()
  return session
}

export type UserProfile = User
