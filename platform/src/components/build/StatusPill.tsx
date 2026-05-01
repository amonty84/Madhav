import { Badge } from '@/components/ui/badge'
import { statusVariant } from '@/lib/build/format'

export function StatusPill({ status }: { status: string | null | undefined }) {
  const label = status ?? '—'
  return (
    <Badge variant={statusVariant(status)}>
      {label}
    </Badge>
  )
}
