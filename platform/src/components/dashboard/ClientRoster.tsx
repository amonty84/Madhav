import Link from 'next/link'
import { ClientCard } from './ClientCard'
import type { Chart } from '@/lib/supabase/types'

interface Props {
  charts: (Chart & { pyramidPercent: number })[]
}

export function ClientRoster({ charts }: Props) {
  if (charts.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        No clients yet. <Link href="/clients/new" className="underline text-primary">Add your first client.</Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {charts.map((chart) => (
        <ClientCard key={chart.id} chart={chart} />
      ))}
    </div>
  )
}
