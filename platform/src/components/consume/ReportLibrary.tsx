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
    <aside className="w-[220px] shrink-0 border-r flex flex-col overflow-hidden">
      <div className="px-3 py-2 border-b">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Reports
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-1">
        {reports.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4 px-2">
            No reports yet
          </p>
        )}
        {reports.map(report => (
          <button
            key={report.id}
            type="button"
            onClick={() => onSelect(report.domain)}
            className={cn(
              'w-full text-left rounded px-2 py-1.5 text-xs transition-colors',
              selectedDomain === report.domain
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
            )}
          >
            <span className="block font-medium capitalize">{report.domain}</span>
            <span className="block text-[10px] opacity-70 truncate">{report.title}</span>
          </button>
        ))}
      </div>
    </aside>
  )
}
