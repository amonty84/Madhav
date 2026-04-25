import { getServerUser } from '@/lib/firebase/server'
import { query } from '@/lib/db/client'
import { ClientRoster } from '@/components/dashboard/ClientRoster'
import { buttonVariants } from '@/components/ui/button'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import type { Chart } from '@/lib/db/types'

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

  // Super-admin: fetch all charts with pyramid completion
  const chartsResult = await query(
    'SELECT * FROM charts ORDER BY created_at DESC',
    []
  )
  const charts = chartsResult.rows as unknown as Chart[]

  const chartIds = charts.map((c) => c.id)
  const layersResult = chartIds.length > 0
    ? await query(
        'SELECT chart_id, layer, sublayer, status FROM pyramid_layers WHERE chart_id = ANY($1::text[])',
        [chartIds]
      )
    : { rows: [] }
  const layers = layersResult.rows as unknown as { chart_id: string; status: string }[]

  const pyramidPercents = new Map<string, number>()
  for (const chart of charts) {
    const chartLayers = layers.filter((l) => l.chart_id === chart.id)
    const complete = chartLayers.filter((l) => l.status === 'complete').length
    pyramidPercents.set(chart.id, Math.round((complete / 6) * 100))
  }

  const chartsWithPercent = charts.map((c) => ({
    ...c,
    pyramidPercent: pyramidPercents.get(c.id) ?? 0,
  }))

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Clients</h1>
        <Link href="/clients/new" className={buttonVariants()}>+ New Client</Link>
      </div>
      <ClientRoster charts={chartsWithPercent} />
    </div>
  )
}
