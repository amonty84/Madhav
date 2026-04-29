'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { relativeTime } from '@/lib/build/format'
import type { ChartWithMeta } from '@/lib/roster/types'

type SortKey = 'name' | 'buildPct' | 'activity'

interface RosterTableViewProps {
  charts: ChartWithMeta[]
}

export function RosterTableView({ charts }: RosterTableViewProps) {
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const sorted = useMemo(() => {
    return [...charts].sort((a, b) => {
      let cmp = 0
      if (sortKey === 'name') cmp = a.name.localeCompare(b.name)
      else if (sortKey === 'buildPct') cmp = a.pyramidPercent - b.pyramidPercent
      else if (sortKey === 'activity') {
        const ta = a.lastLayerActivity ? new Date(a.lastLayerActivity).getTime() : 0
        const tb = b.lastLayerActivity ? new Date(b.lastLayerActivity).getTime() : 0
        cmp = ta - tb
      }
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [charts, sortKey, sortDir])

  function toggle(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('asc') }
  }

  function sortIndicator(key: SortKey) {
    if (sortKey !== key) return null
    return sortDir === 'asc' ? ' ↑' : ' ↓'
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-xs">
        <thead className="bg-muted/50">
          <tr>
            <th
              onClick={() => toggle('name')}
              className="cursor-pointer select-none whitespace-nowrap px-3 py-2 text-left font-medium text-muted-foreground hover:text-foreground"
            >
              Name{sortIndicator('name')}
            </th>
            <th className="px-3 py-2 text-left font-medium text-muted-foreground">Birth</th>
            <th className="px-3 py-2 text-left font-medium text-muted-foreground">
              Current dasha
            </th>
            <th
              onClick={() => toggle('buildPct')}
              className="cursor-pointer select-none whitespace-nowrap px-3 py-2 text-left font-medium text-muted-foreground hover:text-foreground"
            >
              Build %{sortIndicator('buildPct')}
            </th>
            <th
              onClick={() => toggle('activity')}
              className="cursor-pointer select-none whitespace-nowrap px-3 py-2 text-left font-medium text-muted-foreground hover:text-foreground"
            >
              Last activity{sortIndicator('activity')}
            </th>
            <th className="px-3 py-2 text-left font-medium text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {sorted.map((c) => (
            <tr key={c.id} className="hover:bg-muted/30 transition-colors">
              <td className="px-3 py-2">
                <p className="font-medium">{c.name}</p>
              </td>
              <td className="px-3 py-2">
                <p>{c.birth_date}</p>
                <p className="text-muted-foreground">{c.birth_place}</p>
              </td>
              <td className="px-3 py-2 text-muted-foreground italic">
                —
              </td>
              <td className="whitespace-nowrap px-3 py-2 tabular-nums">
                {c.pyramidPercent}%
              </td>
              <td className="whitespace-nowrap px-3 py-2 text-muted-foreground">
                {relativeTime(c.lastLayerActivity)}
              </td>
              <td className="px-3 py-2">
                <div className="flex gap-1.5">
                  <Link
                    href={`/clients/${c.id}/build`}
                    className={cn(buttonVariants({ size: 'sm', variant: 'default' }), 'h-6 px-2 text-xs')}
                  >
                    Build
                  </Link>
                  <Link
                    href={`/clients/${c.id}/consume`}
                    className={cn(buttonVariants({ size: 'sm', variant: 'outline' }), 'h-6 px-2 text-xs')}
                  >
                    Consume
                  </Link>
                </div>
              </td>
            </tr>
          ))}
          {sorted.length === 0 && (
            <tr>
              <td colSpan={6} className="px-3 py-6 text-center text-muted-foreground">
                No charts match the current filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
