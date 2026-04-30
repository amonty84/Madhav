import { getServerUser } from '@/lib/firebase/server'
import { query } from '@/lib/db/client'
import { NextResponse } from 'next/server'
import { res } from '@/lib/errors'

export async function GET(request: Request) {
  const user = await getServerUser()
  if (!user) return res.unauthenticated()

  const { searchParams } = new URL(request.url)
  const chartId = searchParams.get('chartId')
  if (!chartId) return res.badRequest('chartId required')

  // Verify caller can access this chart
  let chartRows: Array<{ client_id: string }>
  let profileRows: Array<{ role: string }>
  try {
    const chartResult = await query<{ client_id: string }>(
      'SELECT client_id FROM charts WHERE id=$1',
      [chartId]
    )
    chartRows = chartResult.rows
    const profileResult = await query<{ role: string }>(
      'SELECT role FROM profiles WHERE id=$1',
      [user.uid]
    )
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

  try {
    const { rows: layers } = await query<{ layer: string; sublayer: string; status: string }>(
      'SELECT layer, sublayer, status FROM pyramid_layers WHERE chart_id=$1',
      [chartId]
    )
    return NextResponse.json(layers)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Query failed.'
    return res.internal(message)
  }
}
