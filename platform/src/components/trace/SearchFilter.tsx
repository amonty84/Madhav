'use client'

import { useEffect, useRef } from 'react'

interface SearchFilterProps {
  value: string
  onChange: (v: string) => void
  onClose: () => void
}

export function SearchFilter({ value, onChange, onClose }: SearchFilterProps) {
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    ref.current?.focus()
  }, [])

  return (
    <div
      data-testid="search-filter"
      className="sticky top-0 z-20 bg-[oklch(0.10_0.012_70)] px-3 py-2 border-b border-[rgba(212,175,55,0.15)]"
    >
      <div className="flex items-center gap-2">
        <span className="text-[rgba(212,175,55,0.5)] text-sm" aria-hidden="true">/</span>
        <input
          ref={ref}
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Escape') {
              onChange('')
              onClose()
            }
          }}
          placeholder="Filter steps…"
          aria-label="Filter lifecycle graph steps"
          className="bg-transparent text-sm text-zinc-200 placeholder:text-zinc-600 outline-none flex-1"
        />
        {value && (
          <button
            onClick={() => { onChange(''); onClose() }}
            aria-label="Clear search filter"
            className="text-zinc-500 text-xs hover:text-zinc-300"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}
