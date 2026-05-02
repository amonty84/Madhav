export function formatUsd(amount: number): string {
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function formatTokens(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return String(n)
}

export function formatLatencyMs(ms: number): string {
  if (!Number.isFinite(ms)) return '—'
  return `${Math.round(ms)}ms`
}

export function formatRequests(n: number): string {
  return n.toLocaleString('en-US')
}

/** Compute % change from previous to current. Returns null when previous is 0
 *  and current is non-zero (undefined direction) or when previous is missing. */
export function deltaPct(current: number, delta: number): number | null {
  const previous = current - delta
  if (previous === 0) return current === 0 ? 0 : null
  return (delta / Math.abs(previous)) * 100
}

export function formatPct(pct: number): string {
  const sign = pct > 0 ? '+' : ''
  return `${sign}${pct.toFixed(1)}%`
}
