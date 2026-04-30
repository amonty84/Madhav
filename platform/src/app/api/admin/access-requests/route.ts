import { NextResponse } from 'next/server'
import { requireSuperAdmin } from '@/lib/auth/access-control'
import { query } from '@/lib/db/client'
import { res } from '@/lib/errors'

export async function GET() {
  const auth = await requireSuperAdmin()
  if (auth instanceof NextResponse) return auth

  try {
    const { rows } = await query<{
      id: string
      full_name: string
      email: string
      reason: string | null
      status: string
      requested_at: string
      reviewed_at: string | null
    }>(
      'SELECT id, full_name, email, reason, status, requested_at, reviewed_at FROM access_requests ORDER BY requested_at DESC'
    )
    return NextResponse.json({ requests: rows })
  } catch (err) {
    console.error('[admin/access-requests] query failed', err)
    return res.internal('Failed to load requests.')
  }
}
