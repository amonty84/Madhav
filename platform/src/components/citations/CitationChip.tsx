'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { CitationType } from '@/lib/ui/citation-parser'
import { CitationPreview } from './CitationPreview'

interface Props {
  type: CitationType
  id: string
  className?: string
}

const VARIANT_STYLES: Record<CitationType, string> = {
  signal: 'border-[var(--cite-signal)]/40 bg-[var(--cite-signal-bg)] text-[var(--cite-signal)] hover:border-[var(--cite-signal)]/70',
  asset:  'border-[var(--cite-asset)]/40 bg-[var(--cite-asset-bg)] text-[var(--cite-asset)] hover:border-[var(--cite-asset)]/70',
  chunk:  'border-[var(--cite-chunk)]/40 bg-[var(--cite-chunk-bg)] text-[var(--cite-chunk)] hover:border-[var(--cite-chunk)]/70',
}

const PREFIX: Record<CitationType, string> = {
  signal: '≋',
  asset: '⊞',
  chunk: '§',
}

const ARIA_LABEL: Record<CitationType, (id: string) => string> = {
  signal: (id) => `Chart signal ${id} — click to read the source`,
  asset:  (id) => `Asset ${id} — click to read`,
  chunk:  (id) => `Source chunk ${id} — click to read`,
}

export function CitationChip({ type, id, className }: Props) {
  const [previewOpen, setPreviewOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        aria-label={ARIA_LABEL[type](id)}
        aria-haspopup="dialog"
        aria-expanded={previewOpen}
        onClick={() => setPreviewOpen(true)}
        className={cn(
          'inline-flex items-center gap-0.5 rounded border px-1 py-0.5',
          'text-[11px] font-medium leading-none transition-colors cursor-pointer',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
          VARIANT_STYLES[type],
          className
        )}
      >
        <span aria-hidden="true">{PREFIX[type]}</span>
        <span>{id}</span>
      </button>

      {previewOpen && (
        <CitationPreview
          type={type}
          id={id}
          onClose={() => setPreviewOpen(false)}
        />
      )}
    </>
  )
}
