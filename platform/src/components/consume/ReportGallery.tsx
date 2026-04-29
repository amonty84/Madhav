'use client'

import { cn } from '@/lib/utils'
import type { Report } from '@/lib/db/types'
import { humanizeDomain, formatRelativeTime } from '@/lib/text/humanize'
import { domainIcon, freshnessColor } from '@/lib/consume/domain-icons'

const FRESHNESS_CHIP: Record<ReturnType<typeof freshnessColor>, string> = {
  green: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  amber: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  red:   'bg-red-500/15 text-red-400 border-red-500/30',
}

interface Props {
  reports: Report[]
  selectedDomain: string | null
  onSelect: (domain: string) => void
}

export function ReportGallery({ reports, selectedDomain, onSelect }: Props) {
  if (reports.length === 0) {
    return (
      <p className="px-4 py-8 text-center text-xs text-muted-foreground">
        No reports yet.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-2 lg:grid-cols-3">
      {reports.map(report => {
        const Icon = domainIcon(report.domain)
        const freshness = freshnessColor(report.updated_at)
        const isSelected = selectedDomain === report.domain

        return (
          <button
            key={report.id}
            type="button"
            onClick={() => onSelect(report.domain)}
            className={cn(
              'flex flex-col gap-2.5 rounded-xl border p-3.5 text-left transition-all duration-200',
              isSelected
                ? 'border-[var(--brand-gold)] bg-[var(--card)]'
                : 'border-[var(--brand-gold-hairline)] bg-[var(--card)] hover:border-[var(--brand-gold)] hover:bg-[var(--card)]'
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-gold-faint)] text-[var(--brand-gold)]">
                <Icon className="h-4 w-4" />
              </div>
              <span
                className={cn(
                  'rounded border px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider',
                  FRESHNESS_CHIP[freshness]
                )}
              >
                {formatRelativeTime(report.updated_at)}
              </span>
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--brand-gold)]/70">
                {humanizeDomain(report.domain)}
              </p>
              <p className="mt-0.5 line-clamp-2 font-serif text-[14px] text-[var(--brand-cream)] leading-snug">
                {report.title}
              </p>
            </div>
          </button>
        )
      })}
    </div>
  )
}
