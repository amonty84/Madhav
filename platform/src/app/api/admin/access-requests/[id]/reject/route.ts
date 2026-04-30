import { NextResponse } from 'next/server'
import { requireSuperAdmin } from '@/lib/auth/access-control'
import { query } from '@/lib/db/client'
import { res } from '@/lib/errors'

export async function POST(
  _request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const auth = await requireSuperAdmin()
  if (auth instanceof NextResponse) return auth

  const { id } = await ctx.params

  let rows: { status: string }[]
  try {
    const result = await query<{ status: string }>(
      'SELECT status FROM access_requests WHERE id=$1',
      [id]
    )
    rows = result.rows
  } catch {
    return res.dbError()
  }
  const req = rows[0] ?? null
  if (!req) return res.notFound('not_found')
  if (req.status !== 'pending') {
    return res.conflict('Request is not pending.')
  }

  try {
    await query(
      'UPDATE access_requests SET status=\'rejected\', reviewed_at=now(), reviewed_by=$1 WHERE id=$2',
      [auth.user.uid, id]
    )
  } catch {
    return res.internal('Update failed.')
  }

  return NextResponse.json({ ok: true })
}
