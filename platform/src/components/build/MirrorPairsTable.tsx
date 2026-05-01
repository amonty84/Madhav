import type { MirrorPair } from '@/lib/build/types'
import { Badge } from '@/components/ui/badge'

function verifiedBadge(days: number | null) {
  if (days === null) return <Badge variant="outline" className="text-xs">unverified</Badge>
  if (days <= 1) return <Badge variant="default" className="text-xs">today</Badge>
  if (days <= 7) return <Badge variant="secondary" className="text-xs">{days}d ago</Badge>
  return <Badge variant="destructive" className="text-xs">{days}d ago</Badge>
}

export function MirrorPairsTable({ pairs }: { pairs: MirrorPair[] }) {
  if (pairs.length === 0) {
    return <p className="text-sm text-muted-foreground">No mirror pairs defined.</p>
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="px-3 py-2 text-left font-medium uppercase tracking-wider text-muted-foreground">Pair</th>
            <th className="px-3 py-2 text-left font-medium uppercase tracking-wider text-muted-foreground">Claude side</th>
            <th className="px-3 py-2 text-left font-medium uppercase tracking-wider text-muted-foreground">Gemini side</th>
            <th className="px-3 py-2 text-left font-medium uppercase tracking-wider text-muted-foreground">Mode</th>
            <th className="px-3 py-2 text-left font-medium uppercase tracking-wider text-muted-foreground">Last verified</th>
          </tr>
        </thead>
        <tbody>
          {pairs.map((p) => (
            <tr key={p.pair_id} className="border-b border-border last:border-0 hover:bg-muted/30">
              <td className="px-3 py-2 font-mono font-medium">{p.pair_id}</td>
              <td className="px-3 py-2 max-w-[180px] truncate text-muted-foreground" title={p.claude_side}>
                {p.claude_side}
              </td>
              <td className="px-3 py-2 max-w-[180px] truncate text-muted-foreground" title={p.gemini_side}>
                {p.gemini_side}
              </td>
              <td className="px-3 py-2 text-muted-foreground">{p.mirror_mode}</td>
              <td className="px-3 py-2">
                <div className="flex flex-col gap-0.5">
                  {verifiedBadge(p.days_since_verified)}
                  {p.last_verified_session && (
                    <span className="font-mono text-muted-foreground truncate max-w-[120px]" title={p.last_verified_session}>
                      {p.last_verified_session}
                    </span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
