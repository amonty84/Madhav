import { redirect } from 'next/navigation'
import { getServerUser } from '@/lib/firebase/server'
import { query } from '@/lib/db/client'
import { parseLEL } from '@/lib/lel/parser'
import { TimelineView } from '@/components/timeline/TimelineView'
import { ZoneRoot } from '@/components/shared/ZoneRoot'

export default async function TimelinePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const user = await getServerUser()
  if (!user) redirect('/login')

  const [profileResult, chartResult] = await Promise.all([
    query<{ role: string }>('SELECT role FROM profiles WHERE id=$1', [user.uid]),
    query<{ name: string; client_id: string }>(
      'SELECT name, client_id FROM charts WHERE id=$1',
      [id]
    ),
  ])

  const profile = profileResult.rows[0] ?? null
  const chart = chartResult.rows[0] ?? null

  if (!chart) redirect('/dashboard')
  if (profile?.role !== 'super_admin' && chart.client_id !== user.uid) redirect('/dashboard')

  const { events, predictions, parseErrors } = await parseLEL(id)

  return (
    <ZoneRoot zone="vellum" className="flex h-full flex-col">
      <TimelineView
        events={events}
        predictions={predictions}
        parseErrors={parseErrors}
        chartId={id}
        canWrite={profile?.role === 'super_admin'}
      />
    </ZoneRoot>
  )
}
