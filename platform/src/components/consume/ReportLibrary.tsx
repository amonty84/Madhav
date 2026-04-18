'use client'

import { cn } from '@/lib/utils'
import type { Report } from '@/lib/supabase/types'

interface Props {
  reports: Report[]
  selectedDomain: string | null
  onSelect: (domain: string) => void
}

export function ReportLibrary({ reports, selectedDomain, onSelect }: Props) {
  return (
    <div className="flex flex-col">
      <div className="px-4 py-3 text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
        Report library
      </div>
      <div className="px-2 pb-2">
        {reports.length === 0 && (
          <p className="px-3 py-6 text-center text-xs text-muted-foreground">
            No reports yet.
          </p>
        )}
        <ul className="space-y-0.5">
          {reports.map(report => (
            <li key={report.id}>
              <button
                type="button"
                onClick={() => onSelect(report.domain)}
                className={cn(
                  'w-full rounded-lg px-3 py-2 text-left text-sm transition-colors',
                  selectedDomain === report.domain
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                )}
              >
                <span className="block font-medium capitalize">{report.domain}</span>
                <span className="mt-0.5 block text-[11px] text-muted-foreground/80 line-clamp-1">
                  {report.title}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
