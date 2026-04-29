import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { MomentPhrase } from './MomentPhrase'
import type { ChartWithMeta } from '@/lib/roster/types'

interface Props {
  chart: ChartWithMeta
}

type HealthStatus = 'green' | 'amber' | 'red'

function healthStatus(chart: ChartWithMeta): HealthStatus {
  if (chart.pyramidPercent === 0) return 'amber'
  if (!chart.lastLayerActivity) return 'amber'
  const ageMs = Date.now() - new Date(chart.lastLayerActivity).getTime()
  const ageDays = ageMs / (1000 * 60 * 60 * 24)
  return ageDays < 7 ? 'green' : 'amber'
}

const HEALTH_DOT_CLASS: Record<HealthStatus, string> = {
  green: 'bg-emerald-500',
  amber: 'bg-amber-400',
  red: 'bg-red-500',
}

export function ClientCard({ chart }: Props) {
  const percent = chart.pyramidPercent
  const statusColor = percent === 100 ? 'default' : percent > 0 ? 'secondary' : 'outline'
  const health = healthStatus(chart)

  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{chart.name}</CardTitle>
        <CardAction className="flex items-center gap-2">
          <span
            aria-label={`Health: ${health}`}
            className={cn('inline-block h-1.5 w-1.5 rounded-full', HEALTH_DOT_CLASS[health])}
          />
          <Badge variant={statusColor}>{percent}%</Badge>
        </CardAction>
        <p className="text-xs text-muted-foreground">
          {chart.birth_date} · {chart.birth_place}
        </p>
        <MomentPhrase
          pyramidPercent={percent}
          lastLayerActivity={chart.lastLayerActivity}
        />
      </CardHeader>
      <CardContent className="flex gap-2">
        <Link href={`/clients/${chart.id}`} className={cn(buttonVariants({ size: 'sm' }), 'flex-1')}>
          Profile
        </Link>
        <Link href={`/clients/${chart.id}/build`} className={cn(buttonVariants({ size: 'sm', variant: 'outline' }))}>
          Build
        </Link>
        <Link href={`/clients/${chart.id}/consume`} className={cn(buttonVariants({ size: 'sm', variant: 'outline' }))}>
          Consume
        </Link>
      </CardContent>
    </Card>
  )
}
