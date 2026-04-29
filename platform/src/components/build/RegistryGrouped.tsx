'use client'

import { useMemo, useState } from 'react'
import type { CanonicalArtifact } from '@/lib/build/types'
import {
  lookupFriendly,
  PURPOSE_ORDER,
  type FriendlyArtifact,
} from '@/lib/build/friendlyNames'
import { relativeTime } from '@/lib/build/format'

export function RegistryGrouped({ artifacts }: { artifacts: CanonicalArtifact[] }) {
  const [query, setQuery] = useState('')

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase()
    const map = new Map<FriendlyArtifact['purpose_group'], (CanonicalArtifact & FriendlyArtifact)[]>()
    for (const a of artifacts) {
      const f = lookupFriendly(a.canonical_id)
      const enriched = { ...a, ...f }
      if (q) {
        const hay = `${enriched.canonical_id} ${enriched.friendly_name} ${enriched.one_line_purpose} ${enriched.path}`.toLowerCase()
        if (!hay.includes(q)) continue
      }
      if (!map.has(f.purpose_group)) map.set(f.purpose_group, [])
      map.get(f.purpose_group)!.push(enriched)
    }
    return PURPOSE_ORDER.flatMap((g) => {
      const items = map.get(g)
      if (!items || items.length === 0) return []
      return [{ group: g, items }]
    })
  }, [artifacts, query])

  return (
    <div>
      <div className="mb-5">
        <input
          type="search"
          placeholder="Search the corpus…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="bt-body w-full max-w-md rounded-md border border-border bg-card px-3 py-2 outline-none focus:border-foreground"
        />
      </div>

      {grouped.length === 0 ? (
        <p className="bt-body text-muted-foreground">Nothing matches that search.</p>
      ) : (
        <div className="space-y-8">
          {grouped.map(({ group, items }) => (
            <section key={group}>
              <div className="mb-3 flex items-baseline justify-between">
                <h2 className="bt-heading">{group}</h2>
                <span className="bt-body text-muted-foreground">
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </span>
              </div>
              <div className="rounded-lg border border-border bg-card divide-y divide-border">
                {items.map((a) => (
                  <article key={a.canonical_id} className="p-4">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="bt-body font-medium">{a.friendly_name}</h3>
                      <span className="bt-label shrink-0">v{a.version}</span>
                    </div>
                    <p className="bt-body mt-1 text-muted-foreground">
                      {a.one_line_purpose}
                    </p>
                    <div className="bt-body mt-2 flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground">
                      <span className="bt-mono text-xs">{a.path}</span>
                      <span>·</span>
                      <span>
                        {a.last_verified_on
                          ? `verified ${relativeTime(a.last_verified_on)}`
                          : 'not yet verified'}
                      </span>
                      {a.status && a.status !== 'CURRENT' && (
                        <>
                          <span>·</span>
                          <span>{a.status.toLowerCase().replace(/_/g, ' ')}</span>
                        </>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
