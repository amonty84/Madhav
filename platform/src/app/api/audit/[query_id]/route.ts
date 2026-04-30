import { NextResponse } from 'next/server'
import { requireSuperAdmin } from '@/lib/auth/access-control'
import { getAuditRow } from '@/lib/audit/queries'
import { res } from '@/lib/errors'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ query_id: string }> }
) {
  const auth = await requireSuperAdmin()
  if (auth instanceof NextResponse) return auth

  const { query_id } = await params

  try {
    const row = await getAuditRow(query_id)
    if (!row) return res.notFound()
    return NextResponse.json({ row })
  } catch (err) {
    console.error('[api/audit/[query_id]] GET failed', err)
    return res.internal('Failed to load audit row.')
  }
}
