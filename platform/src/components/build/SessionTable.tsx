'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import type { SessionIndex } from '@/lib/build/types'
import { ScriptVerdictBadge } from './ScriptVerdictBadge'
import { sessionClassLabel } from '@/lib/build/parsers/sessionClass'
import { formatDate } from '@/lib/build/format'

type SortKey = 'session_id' | 'date' | 'class' | 'phase_id'
type SortDir = 'asc' | 'desc'

export function SessionTable({ rows }: { rows: SessionIndex[] }) {
  const [filter, setFilter] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('date')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const filtered = useMemo(() => {
    const q = filter.toLowerCase()
    return rows.filter(
      (r) =>
        r.session_id.toLowerCase().includes(q) ||
        (r.class ?? '').toLowerCase().includes(q) ||
        (r.phase_id ?? '').toLowerCase().includes(q) ||
        (r.title ?? '').toLowerCase().includes(q)
    )
  }, [rows, filter])

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const av = (a[sortKey] ?? '') as string
      const bv = (b[sortKey] ?? '') as string
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
    })
  }, [filtered, sortKey, sortDir])

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const arrow = (key: SortKey) =>
    sortKey === key ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ''

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter sessions…"
          className="h-8 w-full max-w-xs rounded-md border border-border bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <span className="text-xs text-muted-foreground">{sorted.length} / {rows.length}</span>
      </div>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-xs">
          <thead className="bg-muted/50">
            <tr>
              {(
                [
                  ['session_id', 'Session'],
                  ['date', 'Date'],
                  ['class', 'Class'],
                  ['phase_id', 'Phase'],
                ] as [SortKey, string][]
              ).map(([key, label]) => (
                <th
                  key={key}
                  onClick={() => toggleSort(key)}
                  className="cursor-pointer select-none whitespace-nowrap px-3 py-2 text-left font-medium text-muted-foreground hover:text-foreground"
                >
                  {label}{arrow(key)}
                </th>
              ))}
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">Verdicts</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sorted.map((row) => (
              <tr key={row.session_id} className="hover:bg-muted/30 transition-colors">
                <td className="px-3 py-2">
                  <Link
                    href={`/build/sessions/${encodeURIComponent(row.session_id)}`}
                    className="font-mono text-primary hover:underline"
                  >
                    {row.session_id}
                  </Link>
                  {row.title && (
                    <p className="text-muted-foreground truncate max-w-[24rem]">{row.title}</p>
                  )}
                </td>
                <td className="whitespace-nowrap px-3 py-2 text-muted-foreground">
                  {formatDate(row.date)}
                </td>
                <td className="whitespace-nowrap px-3 py-2">
                  {sessionClassLabel(row.class)}
                </td>
                <td className="whitespace-nowrap px-3 py-2 font-mono">
                  {row.phase_id ?? '—'}
                </td>
                <td className="px-3 py-2">
                  <div className="flex gap-1">
                    <ScriptVerdictBadge code={row.drift_exit} label="d" />
                    <ScriptVerdictBadge code={row.schema_exit} label="s" />
                    <ScriptVerdictBadge code={row.mirror_exit} label="m" />
                  </div>
                </td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-center text-muted-foreground">
                  No sessions match the filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
