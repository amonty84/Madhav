// Canonical status → color mapping used across all /build/* pages:
//   completed   → emerald   (bg-emerald-500 / emerald badge)
//   active/in_progress → amber  (bg-amber-500 / amber badge)
//   pending     → muted-foreground/30
//   unknown     → muted-foreground/15  (more muted than pending)
//   unhealthy   → red/destructive (health page only)

/**
 * Segment-by-segment numeric sort for phase IDs (B.3.5 sorts between B.3 and B.4;
 * B.10 sorts after B.9). Mirrors _phase_id_sort_key() in serialize_build_state.py.
 */
export function naturalSort(a: string, b: string): number {
  const segments = (s: string) =>
    s.split('.').map((seg) => {
      const n = parseInt(seg, 10)
      return isNaN(n) ? seg : n
    })
  const sa = segments(a)
  const sb = segments(b)
  for (let i = 0; i < Math.max(sa.length, sb.length); i++) {
    const ca = sa[i]
    const cb = sb[i]
    if (ca === undefined) return -1
    if (cb === undefined) return 1
    if (ca === cb) continue
    if (typeof ca === 'number' && typeof cb === 'number') return ca - cb
    if (typeof ca === 'string' && typeof cb === 'string') return ca < cb ? -1 : 1
    return typeof ca === 'number' ? -1 : 1
  }
  return 0
}

export function relativeTime(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return dateStr
  const diffMs = Date.now() - date.getTime()
  const diffSec = Math.max(0, Math.round(diffMs / 1000))
  if (diffSec < 60) return 'just now'
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h ago`
  const diffDays = Math.floor(diffHr / 24)
  if (diffDays < 30) return `${diffDays}d ago`
  const diffMonths = Math.floor(diffDays / 30)
  if (diffMonths < 12) return `${diffMonths}mo ago`
  return `${Math.floor(diffMonths / 12)}y ago`
}

export function stalenessLabel(seconds: number | null | undefined): string {
  const s = Math.max(0, seconds ?? 0)
  if (s < 60) return 'just now'
  const min = Math.floor(s / 60)
  if (min < 60) return `${min} min ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h ago`
  const days = Math.floor(hr / 24)
  return `${days}d ago`
}

export function daysUntil(dateStr: string | null | undefined): number | null {
  if (!dateStr) return null
  const target = new Date(dateStr)
  if (isNaN(target.getTime())) return null
  const diffMs = target.getTime() - Date.now()
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24))
}

export function truncateFingerprint(fp: string | null | undefined, chars = 12): string {
  if (!fp) return '—'
  return fp.length <= chars ? fp : fp.slice(0, chars) + '…'
}

export function exitCodeVariant(code: number | null | undefined): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (code === null || code === undefined) return 'outline'
  if (code === 0) return 'default'
  if (code <= 2) return 'secondary'
  return 'destructive'
}

export function exitCodeLabel(code: number | null | undefined): string {
  if (code === null || code === undefined) return '—'
  return `exit ${code}`
}

export function statusVariant(status: string | null | undefined): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (!status) return 'outline'
  const s = status.toLowerCase()
  if (s === 'completed' || s === 'current' || s === 'pass' || s === 'atomically_closed') return 'default'
  if (s === 'in_progress' || s === 'living' || s === 'active') return 'secondary'
  if (s === 'pending' || s === 'unknown') return 'outline'
  if (s.includes('fail') || s.includes('error')) return 'destructive'
  return 'outline'
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  return d.toISOString().slice(0, 10)
}
