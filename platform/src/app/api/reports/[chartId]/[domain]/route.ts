import { getServerUser } from '@/lib/firebase/server'
import { query } from '@/lib/db/client'
import { chartDocsBucket, gcsSignedDownload } from '@/lib/storage/client'
import { NextResponse } from 'next/server'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ chartId: string; domain: string }> }
) {
  const { chartId, domain } = await params

  const user = await getServerUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const [{ rows: chartRows }, { rows: profileRows }] = await Promise.all([
    query<{ client_id: string }>('SELECT client_id FROM charts WHERE id=$1', [chartId]),
    query<{ role: string }>('SELECT role FROM profiles WHERE id=$1', [user.uid]),
  ])

  const chart = chartRows[0] ?? null
  if (!chart) return NextResponse.json({ error: 'not found' }, { status: 404 })

  const profile = profileRows[0] ?? null
  if (profile?.role !== 'super_admin' && chart.client_id !== user.uid) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const { rows: reportRows } = await query<{
    title: string
    domain: string
    version: number
    storage_path: string
  }>(
    'SELECT title, domain, version, storage_path FROM reports WHERE chart_id=$1 AND domain=$2 ORDER BY version DESC LIMIT 1',
    [chartId, domain]
  )
  const report = reportRows[0] ?? null
  if (!report) return NextResponse.json({ error: 'Report not found' }, { status: 404 })

  try {
    const url = await gcsSignedDownload(chartDocsBucket(), report.storage_path)
    return NextResponse.json({ domain: report.domain, title: report.title, version: report.version, url })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Download failed.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
