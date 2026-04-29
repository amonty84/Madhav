'use client'

import { useEffect, useRef, useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
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
  const [expanded, setExpanded] = useState(false)
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

  // Focus trap + restore focus on close
  useEffect(() => {
    if (!panelRef.current) return
    const previouslyFocused = document.activeElement as HTMLElement | null
    const root = panelRef.current

    const focusables = root.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    )
    const first = focusables[0]
    const last = focusables[focusables.length - 1]

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab') return
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last?.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first?.focus()
      }
    }

    root.addEventListener('keydown', onKey)
    first?.focus()

    return () => {
      root.removeEventListener('keydown', onKey)
      previouslyFocused?.focus()
    }
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
          'fixed right-0 top-0 z-50 flex h-full flex-col',
          'border-l border-[var(--brand-gold-hairline)] bg-[var(--brand-charcoal)]/95 backdrop-blur-md shadow-xl',
          'focus-visible:outline-none transition-[width] duration-200',
          expanded ? 'w-full max-w-3xl' : 'w-full max-w-md sm:max-w-lg lg:max-w-xl'
        )}
      >
        <header className="flex items-center justify-between border-b border-[var(--brand-gold-hairline)] px-4 py-3">
          <div>
            <p className="bt-label text-[var(--brand-gold)]/70 uppercase tracking-wider">
              {type} citation
            </p>
            <p className="bt-body font-medium text-[var(--brand-cream)]" style={{ fontFamily: 'var(--font-serif)' }}>{id}</p>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setExpanded(v => !v)}
              aria-label={expanded ? 'Collapse panel' : 'Expand panel'}
              className="rounded-md p-1.5 text-[var(--brand-gold)]/60 hover:bg-[var(--brand-gold-faint)] hover:text-[var(--brand-gold)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-gold)]"
            >
              {expanded ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
            <button
              type="button"
              aria-label="Close citation preview"
              onClick={onClose}
              className="rounded-md p-1.5 text-[var(--brand-cream)]/60 hover:bg-[var(--brand-gold-faint)] hover:text-[var(--brand-cream)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-gold)]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {loading && (
            <div className="flex items-center gap-2 text-sm text-[var(--brand-cream)]/60">
              <span className="animate-pulse">Loading…</span>
            </div>
          )}
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          {data && (
            <div className="space-y-3">
              <h3 className="bt-body font-semibold text-[var(--brand-cream)]">{data.title}</h3>
              {data.meta && (
                <p className="bt-label text-[var(--brand-cream)]/60">{data.meta}</p>
              )}
              <p className="bt-body text-[var(--brand-cream)]/80 leading-relaxed whitespace-pre-wrap">
                {data.content}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
