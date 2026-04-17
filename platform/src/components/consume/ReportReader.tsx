'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

interface Props {
  chartId: string
  domain: string
  onClose: () => void
}

export function ReportReader({ chartId, domain, onClose }: Props) {
  const [content, setContent] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    setContent(null)
    fetch(`/api/reports/${chartId}/${domain}`)
      .then(res => {
        if (!res.ok) throw new Error(res.statusText)
        return res.json()
      })
      .then(data => setContent(data.content))
      .catch(err => setError(String(err)))
      .finally(() => setLoading(false))
  }, [chartId, domain])

  return (
    <div className="border-b bg-muted/20 flex flex-col max-h-[40vh]">
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <p className="text-sm font-medium capitalize">{domain} Report</p>
        <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {loading && <p className="text-sm text-muted-foreground">Loading…</p>}
        {error && <p className="text-sm text-destructive">{error}</p>}
        {content && (
          <pre className="text-xs leading-relaxed whitespace-pre-wrap font-sans">{content}</pre>
        )}
      </div>
    </div>
  )
}
