import { Badge } from '@/components/ui/badge'
import { exitCodeVariant, exitCodeLabel } from '@/lib/build/format'

export function ScriptVerdictBadge({
  code,
  label,
}: {
  code: number | null | undefined
  label?: string
}) {
  return (
    <Badge variant={exitCodeVariant(code)} className="font-mono text-xs">
      {label ? `${label}: ` : ''}{exitCodeLabel(code)}
    </Badge>
  )
}
