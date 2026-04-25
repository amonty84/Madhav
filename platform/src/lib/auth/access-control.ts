import 'server-only'
import { NextResponse } from 'next/server'
import type { DecodedIdToken } from 'firebase-admin/auth'
import { getServerUser } from '@/lib/firebase/server'
import { createServiceClient } from '@/lib/supabase/server'

export interface ProfileAuth {
  id: string
  role: 'super_admin' | 'client'
  status: 'pending' | 'active' | 'disabled'
}

/**
 * Loads the current user's profile (including the post-007 columns).
 * Returns null if there is no session OR no matching profile row.
 */
export async function getServerUserWithProfile(): Promise<
  { user: DecodedIdToken; profile: ProfileAuth } | null
> {
  const user = await getServerUser()
  if (!user) return null
  const service = createServiceClient()
  const { data } = await service
    .from('profiles')
    .select('id, role, status')
    .eq('id', user.uid)
    .single<ProfileAuth>()
  if (!data) return null
  return { user, profile: data }
}

/**
 * Route-handler helper. Returns either a `NextResponse` to bail out with,
 * or `{ user, profile }` for the super-admin caller. Use:
 *
 *   const result = await requireSuperAdmin()
 *   if (result instanceof NextResponse) return result
 *   const { user, profile } = result
 */
export async function requireSuperAdmin(): Promise<
  NextResponse | { user: DecodedIdToken; profile: ProfileAuth }
> {
  const ctx = await getServerUserWithProfile()
  if (!ctx) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  if (ctx.profile.role !== 'super_admin') {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }
  if (ctx.profile.status !== 'active') {
    return NextResponse.json({ error: 'account_inactive' }, { status: 403 })
  }
  return ctx
}
