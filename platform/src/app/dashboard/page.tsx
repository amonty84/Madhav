import { createClient, createServiceClient } from '@/lib/supabase/server'
import { ClientRoster } from '@/components/dashboard/ClientRoster'
import { buttonVariants } from '@/components/ui/button'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  // Clients go directly to their Consume view
  if (profile?.role === 'client') {
    const service = createServiceClient()
    const { data: chart } = await service
      .from('charts')
      .select('id')
      .eq('client_id', user.id)
      .single()
    if (chart) redirect(`/clients/${chart.id}/consume`)
    redirect('/login')
  }

  // Astrologer: fetch all charts with pyramid completion
  const service = createServiceClient()
  const { data: charts } = await service
    .from('charts')
    .select('*')
    .order('created_at', { ascending: false })

  const { data: layers } = await service
    .from('pyramid_layers')
    .select('chart_id, status')

  const pyramidPercents = new Map<string, number>()
  for (const chart of charts ?? []) {
    const chartLayers = (layers ?? []).filter((l) => l.chart_id === chart.id)
    const complete = chartLayers.filter((l) => l.status === 'complete').length
    pyramidPercents.set(chart.id, Math.round((complete / 6) * 100))
  }

  const chartsWithPercent = (charts ?? []).map((c) => ({
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
