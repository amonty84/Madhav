import type { CurrentBrief } from '@/lib/build/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function BriefPanel({ brief }: { brief: CurrentBrief | null | undefined }) {
  if (!brief) {
    return (
      <Card size="sm">
        <CardHeader>
          <CardTitle className="text-sm">Active Brief</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">[no active brief]</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          Active Brief
          <Badge variant="secondary">{brief.status}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1.5">
        <p className="font-mono text-xs font-medium">{brief.session_id}</p>
        <p className="text-xs text-muted-foreground">
          {brief.ac_passed_known}/{brief.ac_total} ACs known-pass
        </p>
        {brief.may_touch.length > 0 && (
          <p className="text-xs text-muted-foreground truncate">
            may_touch: {brief.may_touch.slice(0, 3).join(', ')}
            {brief.may_touch.length > 3 ? ` +${brief.may_touch.length - 3} more` : ''}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
