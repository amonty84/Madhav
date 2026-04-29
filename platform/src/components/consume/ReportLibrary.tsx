'use client'

import { Briefcase, Coins, Heart, Activity, Clock, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Report } from '@/lib/db/types'
import { humanizeDomain, formatRelativeTime } from '@/lib/text/humanize'

const DOMAIN_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  career:        Briefcase,
  finance:       Coins,
  relationships: Heart,
  health:        Activity,
  timing:        Clock,
}

function DomainIcon({ domain, className }: { domain: string; className?: string }) {
  const Icon = DOMAIN_ICONS[domain.toLowerCase()] ?? FileText
  return <Icon className={className} />
}

interface Props {
  reports: Report[]
  selectedDomain: string | null
  onSelect: (domain: string) => void
}

export function ReportLibrary({ reports, selectedDomain, onSelect }: Props) {
  return (
    <div className="flex flex-col">
      <div className="px-4 py-3 text-[10px] font-medium uppercase tracking-[0.32em] text-[var(--brand-gold)]/70">
        Report Library
      </div>
      <div className="px-3 pb-3">
        {reports.length === 0 && (
          <p className="px-3 py-6 text-center text-xs text-muted-foreground">
            No reports yet.
          </p>
        )}
        <ul className="space-y-1.5">
          {reports.map(report => (
            <li key={report.id}>
              <button
                type="button"
                onClick={() => onSelect(report.domain)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-200',
                  selectedDomain === report.domain
                    ? 'border-[var(--brand-gold)] bg-[var(--brand-charcoal)]/60'
                    : 'border-[var(--brand-gold-hairline)] bg-[var(--brand-charcoal)]/40 hover:border-[var(--brand-gold)] hover:bg-[var(--brand-charcoal)]/60'
                )}
              >
                <DomainIcon domain={report.domain} className="h-5 w-5 shrink-0 text-[var(--brand-gold)]" />
                <div className="min-w-0 flex-1">
                  <p className="font-serif text-[15px] text-[var(--brand-cream)] truncate">{report.title}</p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-[0.32em] text-[var(--brand-gold)]/70">
                    {humanizeDomain(report.domain)} · {formatRelativeTime(report.updated_at)}
                  </p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
