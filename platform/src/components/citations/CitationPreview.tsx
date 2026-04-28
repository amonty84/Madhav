'use client'

import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CitationType } from '@/lib/ui/citation-parser'

interface PreviewData {
  title: string
  content: string
  meta?: string
}

interface Props {
  type: CitationType
  id: string
  onClose: () => void
}

export function CitationPreview({ type, id, onClose }: Props) {
  const [data, setData] = useState<PreviewData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const controller = new AbortController()
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true)
    setError(null)

    fetch(`/api/citations/preview?type=${encodeURIComponent(type)}&id=${encodeURIComponent(id)}`, {
      signal: controller.signal,
    })
      .then(async res => {
        if (!res.ok) {
          if (res.status === 404) throw new Error('Citation not found')
          throw new Error(`Unexpected error (${res.status})`)
        }
        return res.json() as Promise<PreviewData>
      })
      .then(d => {
        setData(d)
        setLoading(false)
      })
      .catch(err => {
        if (err instanceof Error && err.name === 'AbortError') return
        setError(err instanceof Error ? err.message : 'Failed to load citation')
        setLoading(false)
      })

    return () => controller.abort()
  }, [type, id])

  // Trap focus and close on Escape
  useEffect(() => {
    panelRef.current?.focus()
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Citation preview: ${type} ${id}`}
        tabIndex={-1}
        className={cn(
          'fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col',
          'border-l border-border bg-background shadow-xl',
          'focus-visible:outline-none'
        )}
      >
        <header className="flex items-center justify-between border-b border-border px-4 py-3">
          <div>
            <p className="bt-label text-muted-foreground uppercase tracking-wider">
              {type} citation
            </p>
            <p className="bt-body font-medium text-foreground">{id}</p>
          </div>
          <button
            type="button"
            aria-label="Close citation preview"
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {loading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="animate-pulse">Loading…</span>
            </div>
          )}
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          {data && (
            <div className="space-y-3">
              <h3 className="bt-body font-semibold text-foreground">{data.title}</h3>
              {data.meta && (
                <p className="bt-label text-muted-foreground">{data.meta}</p>
              )}
              <p className="bt-body text-foreground/90 leading-relaxed whitespace-pre-wrap">
                {data.content}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
