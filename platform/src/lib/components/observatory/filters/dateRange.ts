import type { DateRange, DateRangePresetId } from './types'

function toIsoDate(d: Date): string {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function addDays(d: Date, n: number): Date {
  const next = new Date(d)
  next.setDate(next.getDate() + n)
  return next
}

/** Compute from/to (inclusive, ISO YYYY-MM-DD) for a preset against `now`. */
export function presetToRange(
  preset: DateRangePresetId,
  now: Date = new Date(),
): DateRange {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  switch (preset) {
    case 'today':
      return { from: toIsoDate(today), to: toIsoDate(today) }
    case 'yesterday': {
      const y = addDays(today, -1)
      return { from: toIsoDate(y), to: toIsoDate(y) }
    }
    case '7d':
      return { from: toIsoDate(addDays(today, -6)), to: toIsoDate(today) }
    case '30d':
      return { from: toIsoDate(addDays(today, -29)), to: toIsoDate(today) }
    case '90d':
      return { from: toIsoDate(addDays(today, -89)), to: toIsoDate(today) }
    case 'mtd': {
      const first = new Date(today.getFullYear(), today.getMonth(), 1)
      return { from: toIsoDate(first), to: toIsoDate(today) }
    }
    case 'last_month': {
      const firstOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1)
      const lastOfPrev = addDays(firstOfThisMonth, -1)
      const firstOfPrev = new Date(lastOfPrev.getFullYear(), lastOfPrev.getMonth(), 1)
      return { from: toIsoDate(firstOfPrev), to: toIsoDate(lastOfPrev) }
    }
    case 'custom':
      return { from: toIsoDate(today), to: toIsoDate(today) }
  }
}

export const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/

export function isValidIsoDate(s: string): boolean {
  if (!ISO_DATE_RE.test(s)) return false
  const d = new Date(`${s}T00:00:00Z`)
  return !Number.isNaN(d.getTime()) && toIsoDate(new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())) === s
}
