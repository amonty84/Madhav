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
  signal:
    'bg-amber-100/80 text-amber-800 border-amber-200/60 hover:bg-amber-200/80 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700/40',
  asset:
    'bg-sky-100/80 text-sky-800 border-sky-200/60 hover:bg-sky-200/80 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-700/40',
  chunk:
    'bg-violet-100/80 text-violet-800 border-violet-200/60 hover:bg-violet-200/80 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-700/40',
}

const PREFIX: Record<CitationType, string> = {
  signal: '≋',
  asset: '⊞',
  chunk: '§',
}

export function CitationChip({ type, id, className }: Props) {
  const [previewOpen, setPreviewOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        aria-label={`Citation: ${type} ${id} — click to preview`}
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
