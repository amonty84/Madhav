// Observatory backend API — shared guard for the five admin endpoints.
//
// Two-stage gate before any handler logic runs:
//   1. Feature-flag gate: env var MARSYS_FLAG_OBSERVATORY_ENABLED must be 'true'.
//      TODO(S1.9): replace with the proper feature-flag service. The brief says
//      "gate on env var ... directly; add a TODO comment that S1.9 will wire
//      the proper feature-flag service" — keep this surface minimal until then.
//   2. Auth gate: requireSuperAdmin() — returns 401 (no user), 403 (wrong role
//      or inactive). Mirrors the pattern in /api/admin/users.
//
// On success, returns the resolved auth context so routes that need user_id
// can use it without re-querying. On failure, returns the NextResponse the
// caller should return immediately.

import 'server-only'
import { NextResponse } from 'next/server'
import type { DecodedIdToken } from 'firebase-admin/auth'
import { requireSuperAdmin, type ProfileAuth } from '@/lib/auth/access-control'

export interface ObservatoryAuthContext {
  user: DecodedIdToken
  profile: ProfileAuth
}

export async function guardObservatoryRoute(): Promise<
  NextResponse | ObservatoryAuthContext
> {
  if (process.env.MARSYS_FLAG_OBSERVATORY_ENABLED !== 'true') {
    return NextResponse.json(
      {
        error: {
          code: 'AUTH_FORBIDDEN',
          message: 'Observatory is not enabled.',
          retry: false,
        },
      },
      { status: 403 },
    )
  }
  const auth = await requireSuperAdmin()
  if (auth instanceof NextResponse) return auth
  return auth
}
