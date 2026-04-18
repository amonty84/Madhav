'use client'

import { ArrowLeft } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Markdown } from '@/components/chat/Markdown'

interface Props {
  chartId: string
  domain: string
  onBack: () => void
}

export function ReportReader({ chartId, domain, onBack }: Props) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['report', chartId, domain],
    queryFn: async ({ signal }) => {
      const res = await fetch(`/api/reports/${chartId}/${domain}`, { signal })
      if (!res.ok) throw new Error(res.statusText || 'Failed to load report')
      return res.json() as Promise<{ content: string }>
    },
    staleTime: 5 * 60 * 1000,
  })

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-border/60 px-3 py-2">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to reports"
          className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
        </button>
        <p className="truncate text-sm font-medium capitalize">{domain} report</p>
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
        {error && <p className="text-sm text-destructive">{String(error)}</p>}
        {data?.content && <Markdown>{data.content}</Markdown>}
      </div>
    </div>
  )
}
