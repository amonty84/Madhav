// Pill badge for a budget rule's evaluation status. Server-renderable; the
// chip styling language matches reconciliation/StatusChip.tsx (S2.6) so the
// observatory UI reads as one family.

import type { BudgetStatus } from '@/lib/observatory/budget/types'

interface ChipMeta {
  dotClass: string
  label: string
  bold: boolean
}

function metaFor(status: BudgetStatus): ChipMeta {
  switch (status) {
    case 'ok':
      return { dotClass: 'bg-green-500', label: 'OK', bold: false }
    case 'warning':
      return { dotClass: 'bg-amber-500', label: 'Warning', bold: false }
    case 'alert':
      return { dotClass: 'bg-red-500', label: 'Alert', bold: false }
    case 'exceeded':
      return { dotClass: 'bg-red-600', label: 'Exceeded', bold: true }
  }
}

export interface BudgetStatusChipProps {
  status: BudgetStatus
  pct_used: number
}

export function BudgetStatusChip({ status, pct_used }: BudgetStatusChipProps) {
  const meta = metaFor(status)
  const pct = Math.round(pct_used)
  return (
    <span
      data-testid={`budget-status-chip-${status}`}
      data-status={status}
      className="inline-flex items-center gap-1.5 rounded border bg-background px-2 py-1 text-xs"
    >
      <span
        aria-hidden="true"
        className={`inline-block h-2 w-2 rounded-full ${meta.dotClass}`}
      />
      <span
        className={
          meta.bold
            ? 'font-bold text-foreground'
            : 'font-medium text-foreground'
        }
      >
        {meta.label} ({pct}%)
      </span>
    </span>
  )
}
