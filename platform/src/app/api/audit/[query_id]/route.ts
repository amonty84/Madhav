import { NextResponse } from 'next/server'
import { requireSuperAdmin } from '@/lib/auth/access-control'
import { getAuditRow } from '@/lib/audit/queries'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ query_id: string }> }
) {
  const auth = await requireSuperAdmin()
  if (auth instanceof NextResponse) return auth

  const { query_id } = await params

  try {
    const row = await getAuditRow(query_id)
    if (!row) return NextResponse.json({ error: 'not_found' }, { status: 404 })
    return NextResponse.json({ row })
  } catch (err) {
    console.error('[api/audit/[query_id]] GET failed', err)
    return NextResponse.json({ error: 'Failed to load audit row.' }, { status: 500 })
  }
}
