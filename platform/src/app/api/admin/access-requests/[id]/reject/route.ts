import { NextResponse } from 'next/server'
import { requireSuperAdmin } from '@/lib/auth/access-control'
import { query } from '@/lib/db/client'

export async function POST(
  _request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const auth = await requireSuperAdmin()
  if (auth instanceof NextResponse) return auth

  const { id } = await ctx.params

  const { rows } = await query<{ status: string }>(
    'SELECT status FROM access_requests WHERE id=$1',
    [id]
  )
  const req = rows[0] ?? null
  if (!req) return NextResponse.json({ error: 'not_found' }, { status: 404 })
  if (req.status !== 'pending') {
    return NextResponse.json({ error: 'Request is not pending.' }, { status: 409 })
  }

  try {
    await query(
      'UPDATE access_requests SET status=\'rejected\', reviewed_at=now(), reviewed_by=$1 WHERE id=$2',
      [auth.user.uid, id]
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Update failed.'
    return NextResponse.json({ error: message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
