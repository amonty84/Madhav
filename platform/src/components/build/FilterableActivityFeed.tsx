'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import type { SessionIndex } from '@/lib/build/types'
import { getClassColor } from './colors'
import { ScriptVerdictBadge } from './ScriptVerdictBadge'
import { formatDate } from '@/lib/build/format'
import { friendlySessionTitle, relativeDay } from '@/lib/build/derive'

interface Props {
  sessions: SessionIndex[]
  classes: string[]
  phases: string[]
}

export function FilterableActivityFeed({ sessions, classes, phases }: Props) {
  const [search, setSearch] = useState('')
  const [filterClass, setFilterClass] = useState('')
  const [filterPhase, setFilterPhase] = useState('')
  const [filterFrom, setFilterFrom] = useState('')
  const [filterTo, setFilterTo] = useState('')

  const filtered = useMemo(() => {
    return sessions.filter((s) => {
      if (filterClass && s.class !== filterClass) return false
      if (filterPhase && s.phase_id !== filterPhase) return false
      if (filterFrom && (s.date ?? '') < filterFrom) return false
      if (filterTo && (s.date ?? '') > filterTo) return false
      if (search) {
        const q = search.toLowerCase()
        const haystack = [s.session_id, s.title, s.deliverable_one_liner, s.phase_id]
          .join(' ')
          .toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
  }, [sessions, filterClass, filterPhase, filterFrom, filterTo, search])

  const inputClass =
    'bt-body rounded-lg border border-border bg-card px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary/30'

  return (
    <div>
      {/* Filter bar */}
      <div className="mb-4 flex flex-wrap gap-2 items-center">
        <input
          type="search"
          placeholder="Search sessions…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`${inputClass} min-w-[180px] flex-1`}
        />
        <select
          value={filterClass}
          onChange={(e) => setFilterClass(e.target.value)}
          className={inputClass}
        >
          <option value="">All classes</option>
          {classes.map((c) => (
            <option key={c} value={c}>
              {c.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
        <select
          value={filterPhase}
          onChange={(e) => setFilterPhase(e.target.value)}
          className={inputClass}
        >
          <option value="">All phases</option>
          {phases.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={filterFrom}
          onChange={(e) => setFilterFrom(e.target.value)}
          className={inputClass}
          title="From date"
        />
        <input
          type="date"
          value={filterTo}
          onChange={(e) => setFilterTo(e.target.value)}
          className={inputClass}
          title="To date"
        />
        {(search || filterClass || filterPhase || filterFrom || filterTo) && (
          <button
            onClick={() => {
              setSearch('')
              setFilterClass('')
              setFilterPhase('')
              setFilterFrom('')
              setFilterTo('')
            }}
            className="bt-label rounded-full border border-border px-3 py-1.5 hover:bg-muted transition-colors"
          >
            Clear
          </button>
        )}
        <span className="bt-label text-muted-foreground ml-auto">
          {filtered.length} of {sessions.length}
        </span>
      </div>

      {/* Feed */}
      {filtered.length === 0 ? (
        <p className="bt-body text-muted-foreground">No sessions match the current filters.</p>
      ) : (
        <ul className="divide-y divide-border rounded-xl border border-border">
          {filtered.map((s) => {
            const color = getClassColor(s.class)
            return (
              <li key={s.session_id} className="px-4 py-3 first:pt-4 last:pb-4">
                <Link
                  href={`/build/sessions/${encodeURIComponent(s.session_id)}`}
                  className="group flex items-start gap-3"
                >
                  <span className="bt-label w-16 shrink-0 pt-0.5 text-muted-foreground">
                    {relativeDay(s.date)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="bt-body font-medium group-hover:underline">
                      {friendlySessionTitle(s)}
                    </p>
                    {s.deliverable_one_liner && (
                      <p className="bt-body line-clamp-1 text-muted-foreground">
                        {s.deliverable_one_liner}
                      </p>
                    )}
                    <p className="bt-label mt-0.5 text-muted-foreground">{formatDate(s.date)}</p>
                  </div>
                  <div className="shrink-0 flex flex-col items-end gap-1.5">
                    <span
                      className="bt-label rounded-full px-2 py-0.5"
                      style={{ background: `${color}22`, color }}
                    >
                      {s.class.replace(/_/g, ' ')}
                    </span>
                    <div className="flex gap-1">
                      <ScriptVerdictBadge code={s.drift_exit} label="d" />
                      <ScriptVerdictBadge code={s.schema_exit} label="s" />
                      <ScriptVerdictBadge code={s.mirror_exit} label="m" />
                    </div>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
