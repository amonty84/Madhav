import { getServerUser } from '@/lib/firebase/server'
import { query } from '@/lib/db/client'
import { ClientRoster } from '@/components/dashboard/ClientRoster'
import { buttonVariants } from '@/components/ui/button'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import type { Chart } from '@/lib/db/types'
import { fetchConsumedTodayCount } from '@/lib/roster/stats'
import type { ChartWithMeta, RosterStats } from '@/lib/roster/types'

export default async function DashboardPage() {
  const user = await getServerUser()
  if (!user) redirect('/login')

  const profileResult = await query(
    'SELECT id, role, name, username, email, status FROM profiles WHERE id=$1',
    [user.uid]
  )
  const profile = (profileResult.rows[0] ?? null) as { id: string; role: string } | null

  // Clients go directly to their Consume view
  if (profile?.role === 'client') {
    const chartResult = await query(
      'SELECT * FROM charts WHERE client_id=$1 ORDER BY created_at DESC',
      [user.uid]
    )
    const chart = (chartResult.rows[0] ?? null) as { id: string } | null
    if (chart) redirect(`/clients/${chart.id}/consume`)
    redirect('/login')
  }

  // Super-admin: fetch all charts
  const chartsResult = await query('SELECT * FROM charts ORDER BY created_at DESC', [])
  const charts = chartsResult.rows as unknown as Chart[]

  const chartIds = charts.map((c) => c.id)

  // Fetch pyramid layers (build % + freshness + inActiveBuild)
  const layersResult = chartIds.length > 0
    ? await query(
        'SELECT chart_id, status, MAX(updated_at) AS last_updated FROM pyramid_layers WHERE chart_id = ANY($1::uuid[]) GROUP BY chart_id, status',
        [chartIds]
      )
    : { rows: [] }
  const layerRows = layersResult.rows as unknown as {
    chart_id: string
    status: string
    last_updated: string
  }[]

  // Compute per-chart pyramidPercent, lastLayerActivity, inActiveBuild flag
  const pyramidPercents = new Map<string, number>()
  const lastActivityMap = new Map<string, string>()
  const inActiveBuildSet = new Set<string>()

  for (const chart of charts) {
    const rows = layerRows.filter((r) => r.chart_id === chart.id)
    const complete = rows.filter((r) => r.status === 'complete').length
    pyramidPercents.set(chart.id, Math.round((complete / 6) * 100))

    // Most-recent updated_at across all statuses
    const timestamps = rows.map((r) => r.last_updated).filter(Boolean)
    if (timestamps.length > 0) {
      const latest = timestamps.reduce((a, b) => (a > b ? a : b))
      lastActivityMap.set(chart.id, latest)
    }

    if (rows.some((r) => r.status === 'in_progress')) {
      inActiveBuildSet.add(chart.id)
    }
  }

  // Fetch consumed-today count
  const consumedToday = await fetchConsumedTodayCount(chartIds)

  const chartsWithMeta: ChartWithMeta[] = charts.map((c) => ({
    ...c,
    pyramidPercent: pyramidPercents.get(c.id) ?? 0,
    lastLayerActivity: lastActivityMap.get(c.id) ?? null,
  }))

  const stats: RosterStats = {
    total: charts.length,
    inActiveBuild: inActiveBuildSet.size,
    consumedToday,
    predictionsOverdue: 0, // wired in R5
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Clients</h1>
        <Link href="/clients/new" className={buttonVariants()}>+ New Client</Link>
      </div>
      <Suspense>
        <ClientRoster charts={chartsWithMeta} stats={stats} />
      </Suspense>
    </div>
  )
}
