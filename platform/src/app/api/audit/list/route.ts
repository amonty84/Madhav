import { NextResponse } from 'next/server'
import { requireSuperAdmin } from '@/lib/auth/access-control'
import { listAuditRows } from '@/lib/audit/queries'
import { res } from '@/lib/errors'
import type { AuditListFilters } from '@/lib/audit/queries'

export async function GET(request: Request) {
  const auth = await requireSuperAdmin()
  if (auth instanceof NextResponse) return auth

  const url = new URL(request.url)
  const page = Math.max(1, parseInt(url.searchParams.get('page') ?? '1', 10))
  const pageSize = Math.min(100, Math.max(1, parseInt(url.searchParams.get('page_size') ?? '25', 10)))

  const filtersParam = url.searchParams.get('filters')
  let filters: AuditListFilters = {}
  if (filtersParam) {
    try {
      filters = JSON.parse(filtersParam) as AuditListFilters
    } catch {
      return res.badRequest('invalid filters JSON')
    }
  }

  try {
    const result = await listAuditRows(page, pageSize, filters)
    return NextResponse.json(result)
  } catch (err) {
    console.error('[api/audit/list] GET failed', err)
    return res.internal('Failed to load audit rows.')
  }
}
