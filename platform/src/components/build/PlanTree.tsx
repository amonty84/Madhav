'use client'

import { useState, useCallback } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import type { MacroPhaseEntry } from '@/lib/build/types'
import { naturalSort } from '@/lib/build/format'

interface Props {
  arc: MacroPhaseEntry[]
  activeMacroId: string
  selectedPhaseId?: string | null
}

function statusDot(status: string | null | undefined) {
  const s = (status ?? '').toLowerCase()
  if (s === 'completed') return 'bg-emerald-500'
  if (s === 'in_progress' || s === 'active') return 'bg-amber-500'
  if (s === 'pending') return 'bg-muted-foreground/30'
  return 'bg-muted-foreground/15'
}

function milestoneHref(id: string): string | null {
  return /^B\.\d/.test(id) ? `/build/plan/${encodeURIComponent(id)}` : null
}

export function PlanTree({ arc, activeMacroId, selectedPhaseId }: Props) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const [expanded, setExpanded] = useState<Set<string>>(() => {
    const param = searchParams.get('expanded')
    if (param) return new Set(param.split(',').filter(Boolean))
    return new Set([activeMacroId])
  })

  const toggle = useCallback(
    (id: string) => {
      const next = new Set(expanded)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      const params = new URLSearchParams(searchParams.toString())
      if (next.size > 0) params.set('expanded', Array.from(next).join(','))
      else params.delete('expanded')
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
      setExpanded(next)
    },
    [expanded, pathname, router, searchParams],
  )

  return (
    <nav className="space-y-1">
      {arc.map((m) => {
        const isExpanded = expanded.has(m.id)
        const milestones = m.milestones ?? []
        return (
          <div key={m.id}>
            <button
              onClick={() => toggle(m.id)}
              className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left transition-colors hover:bg-muted"
            >
              <span className={`h-2 w-2 shrink-0 rounded-full ${statusDot(m.status)}`} />
              <span className="bt-body shrink-0 font-medium">{m.id}</span>
              <span className="bt-body line-clamp-1 flex-1 text-muted-foreground">{m.title}</span>
              {milestones.length > 0 && (
                <span className="bt-label shrink-0 text-muted-foreground">
                  {isExpanded ? '▾' : '▸'}
                </span>
              )}
            </button>

            {isExpanded && milestones.length > 0 && (
              <ul className="ml-4 mt-0.5 space-y-0.5 border-l border-border pl-3">
                {milestones.slice().sort((a, b) => naturalSort(a.id, b.id)).map((ms) => {
                  const href = milestoneHref(ms.id)
                  const isSelected = ms.id === selectedPhaseId
                  const dotClass = isSelected ? 'bg-background' : statusDot(ms.status)
                  const rowBase =
                    'flex items-center gap-2 rounded px-2 py-1 transition-colors'
                  return (
                    <li key={ms.id}>
                      {href ? (
                        <Link
                          href={href}
                          className={`${rowBase} ${isSelected ? 'bg-foreground text-background' : 'hover:bg-muted'}`}
                        >
                          <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${dotClass}`} />
                          <span className="bt-body shrink-0 font-medium">{ms.id}</span>
                          <span
                            className={`bt-body line-clamp-1 ${isSelected ? 'text-background/80' : 'text-muted-foreground'}`}
                          >
                            {ms.title}
                          </span>
                        </Link>
                      ) : (
                        <div className={rowBase}>
                          <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${dotClass}`} />
                          <span className="bt-body shrink-0 font-medium">{ms.id}</span>
                          <span className="bt-body line-clamp-1 text-muted-foreground">
                            {ms.title}
                          </span>
                        </div>
                      )}
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        )
      })}
    </nav>
  )
}
