import { getServerUser } from '@/lib/firebase/server'
import { query } from '@/lib/db/client'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const user = await getServerUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const chartId = searchParams.get('chartId')
  if (!chartId) return NextResponse.json({ error: 'chartId required' }, { status: 400 })

  // Verify caller can access this chart
  const { rows: chartRows } = await query<{ client_id: string }>(
    'SELECT client_id FROM charts WHERE id=$1',
    [chartId]
  )
  const chart = chartRows[0] ?? null
  if (!chart) return NextResponse.json({ error: 'not found' }, { status: 404 })

  const { rows: profileRows } = await query<{ role: string }>(
    'SELECT role FROM profiles WHERE id=$1',
    [user.uid]
  )
  const profile = profileRows[0] ?? null
  if (profile?.role !== 'super_admin' && chart.client_id !== user.uid) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  try {
    const { rows: layers } = await query<{ layer: string; sublayer: string; status: string }>(
      'SELECT layer, sublayer, status FROM pyramid_layers WHERE chart_id=$1',
      [chartId]
    )
    return NextResponse.json(layers)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Query failed.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
