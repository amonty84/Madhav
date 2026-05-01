'use client'

import { useState, useMemo } from 'react'
import type { CanonicalArtifact } from '@/lib/build/types'
import { StatusPill } from './StatusPill'
import { truncateFingerprint, daysUntil } from '@/lib/build/format'

function daysSince(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return '—'
  const days = Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24))
  return `${days}d ago`
}

export function RegistryTable({ artifacts }: { artifacts: CanonicalArtifact[] }) {
  const [filter, setFilter] = useState('')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const filtered = useMemo(() => {
    const q = filter.toLowerCase()
    return artifacts.filter(
      (a) =>
        a.canonical_id.toLowerCase().includes(q) ||
        a.path.toLowerCase().includes(q) ||
        a.status.toLowerCase().includes(q)
    )
  }, [artifacts, filter])

  const sorted = useMemo(
    () =>
      [...filtered].sort((a, b) => {
        const cmp = a.canonical_id.localeCompare(b.canonical_id)
        return sortDir === 'asc' ? cmp : -cmp
      }),
    [filtered, sortDir]
  )

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter artifacts…"
          className="h-8 w-full max-w-xs rounded-md border border-border bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <span className="text-xs text-muted-foreground">{sorted.length} / {artifacts.length}</span>
      </div>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-xs">
          <thead className="bg-muted/50">
            <tr>
              <th
                onClick={() => setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}
                className="cursor-pointer select-none whitespace-nowrap px-3 py-2 text-left font-medium text-muted-foreground hover:text-foreground"
              >
                ID {sortDir === 'asc' ? '↑' : '↓'}
              </th>
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">Version</th>
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">Status</th>
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">Fingerprint</th>
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">Last Verified</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sorted.map((a) => (
              <tr key={a.canonical_id} className="hover:bg-muted/30 transition-colors">
                <td className="px-3 py-2">
                  <p className="font-mono font-medium">{a.canonical_id}</p>
                  <p className="text-muted-foreground truncate max-w-[28rem]">{a.path}</p>
                </td>
                <td className="whitespace-nowrap px-3 py-2 font-mono">{a.version}</td>
                <td className="whitespace-nowrap px-3 py-2">
                  <StatusPill status={a.status} />
                </td>
                <td className="whitespace-nowrap px-3 py-2 font-mono text-muted-foreground">
                  {truncateFingerprint(a.fingerprint_sha256)}
                </td>
                <td className="whitespace-nowrap px-3 py-2">
                  <p className="text-foreground">{a.last_verified_session ?? '—'}</p>
                  <p className="text-muted-foreground">{daysSince(a.last_verified_on)}</p>
                </td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-center text-muted-foreground">
                  No artifacts match the filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
