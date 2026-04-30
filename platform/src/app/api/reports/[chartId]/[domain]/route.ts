import { getServerUser } from '@/lib/firebase/server'
import { query } from '@/lib/db/client'
import { chartDocsBucket, gcsSignedDownload } from '@/lib/storage/client'
import { res } from '@/lib/errors'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ chartId: string; domain: string }> }
) {
  const { chartId, domain } = await params

  const user = await getServerUser()
  if (!user) return res.unauthenticated()

  let chartRows: { client_id: string }[]
  let profileRows: { role: string }[]
  try {
    const [chartResult, profileResult] = await Promise.all([
      query<{ client_id: string }>('SELECT client_id FROM charts WHERE id=$1', [chartId]),
      query<{ role: string }>('SELECT role FROM profiles WHERE id=$1', [user.uid]),
    ])
    chartRows = chartResult.rows
    profileRows = profileResult.rows
  } catch {
    return res.dbError()
  }

  const chart = chartRows[0] ?? null
  if (!chart) return res.notFound('chart')

  const profile = profileRows[0] ?? null
  if (profile?.role !== 'super_admin' && chart.client_id !== user.uid) {
    return res.forbidden()
  }

  let reportRows: { title: string; domain: string; version: number; storage_path: string }[]
  try {
    const result = await query<{
      title: string
      domain: string
      version: number
      storage_path: string
    }>(
      'SELECT title, domain, version, storage_path FROM reports WHERE chart_id=$1 AND domain=$2 ORDER BY version DESC LIMIT 1',
      [chartId, domain]
    )
    reportRows = result.rows
  } catch {
    return res.dbError()
  }

  const report = reportRows[0] ?? null
  if (!report) return res.notFound('report')

  try {
    const url = await gcsSignedDownload(chartDocsBucket(), report.storage_path)
    return Response.json({ domain: report.domain, title: report.title, version: report.version, url })
  } catch {
    return res.internal('Download failed.')
  }
}
