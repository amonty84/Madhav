import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import Link from 'next/link'
import type { Chart } from '@/lib/supabase/types'
import { cn } from '@/lib/utils'

interface Props {
  chart: Chart & { pyramidPercent: number }
}

export function ClientCard({ chart }: Props) {
  const percent = chart.pyramidPercent
  const statusColor = percent === 100 ? 'default' : percent > 0 ? 'secondary' : 'outline'

  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base">{chart.name}</CardTitle>
          <Badge variant={statusColor}>{percent}%</Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          {chart.birth_date} · {chart.birth_place}
        </p>
      </CardHeader>
      <CardContent className="flex gap-2">
        <Link href={`/clients/${chart.id}/build`} className={cn(buttonVariants({ size: 'sm' }), 'flex-1')}>
          Build
        </Link>
        <Link href={`/clients/${chart.id}/consume`} className={cn(buttonVariants({ size: 'sm', variant: 'outline' }), 'flex-1')}>
          Consume
        </Link>
      </CardContent>
    </Card>
  )
}
