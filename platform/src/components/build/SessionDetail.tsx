import type { SessionDetail as SessionDetailType } from '@/lib/build/types'

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <p className="bt-label mb-3">{label}</p>
      <div className="bt-body space-y-2">{children}</div>
    </section>
  )
}

// Group files by top-level directory for easier scanning.
function groupFilesByArea(files: { path: string; reason?: string }[]) {
  const groups = new Map<string, { path: string; reason?: string }[]>()
  for (const f of files) {
    const top = f.path.split('/')[0] ?? 'misc'
    if (!groups.has(top)) groups.set(top, [])
    groups.get(top)!.push(f)
  }
  return Array.from(groups.entries())
}

export function SessionDetail({ detail }: { detail: SessionDetailType | null }) {
  if (!detail) {
    return (
      <div className="rounded-lg border border-border bg-card p-6">
        <p className="bt-body text-muted-foreground">
          No detail recorded for this session yet.
        </p>
      </div>
    )
  }

  const isLegacy = !detail.session_open && !detail.session_close
  const objective =
    detail.body_excerpts.objective ??
    'No stated objective recorded for this session.'
  const outcome = detail.body_excerpts.outcome_narrative
  const fileGroups = groupFilesByArea(detail.files_touched)

  return (
    <div className="space-y-5">
      {/* Header card */}
      <div className="rounded-lg border border-border bg-muted/30 p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h1 className="bt-heading">
            {detail.header.title ?? detail.session_id}
          </h1>
          {detail.header.date && (
            <p className="bt-body text-muted-foreground">
              {detail.header.date.slice(0, 10)}
            </p>
          )}
        </div>
        {isLegacy && (
          <p className="bt-body mt-3 text-amber-600 dark:text-amber-400">
            Older session — structured data limited.
          </p>
        )}
      </div>

      {/* 1. What we set out to do */}
      <Section label="What we set out to do">
        <p>{objective}</p>
      </Section>

      {/* 2. What we did */}
      <Section label="What we did">
        {detail.deliverables.length > 0 ? (
          <ul className="space-y-1.5">
            {detail.deliverables.map((d, i) => (
              <li key={i} className="before:mr-2 before:content-['✓']">
                {d}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">
            No discrete deliverables recorded for this session.
          </p>
        )}
        {fileGroups.length > 0 && (
          <details className="mt-4 border-t border-border pt-3">
            <summary className="bt-label cursor-pointer text-muted-foreground hover:text-foreground">
              Files touched ({detail.files_touched.length})
            </summary>
            <div className="mt-2 space-y-2">
              {fileGroups.map(([area, items]) => (
                <div key={area}>
                  <p className="bt-label">{area}</p>
                  <ul className="ml-2 space-y-0.5">
                    {items.map((f, i) => (
                      <li key={i} className="bt-mono text-xs">
                        {f.path}
                        {f.reason && (
                          <span className="bt-body ml-2 text-muted-foreground">
                            — {f.reason}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </details>
        )}
      </Section>

      {/* 3. What changed in the corpus */}
      {outcome && (
        <Section label="What changed in the corpus">
          <p>{outcome}</p>
        </Section>
      )}

      {/* 4. What's left for next time */}
      {(detail.residuals.length > 0 ||
        detail.halts_encountered.length > 0 ||
        detail.next_session_id) && (
        <Section label="What's left for next time">
          {detail.residuals.length > 0 && (
            <ul className="space-y-1">
              {detail.residuals.map((r, i) => (
                <li key={i} className="before:mr-2 before:content-['·']">
                  {r}
                </li>
              ))}
            </ul>
          )}
          {detail.halts_encountered.length > 0 && (
            <div className="mt-3">
              <p className="bt-label">Things that needed your call</p>
              <ul className="space-y-1">
                {detail.halts_encountered.map((h, i) => (
                  <li key={i} className="before:mr-2 before:content-['·']">
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {detail.next_session_id && (
            <p className="mt-3 text-muted-foreground">
              Next session: <span className="bt-mono">{detail.next_session_id}</span>
            </p>
          )}
        </Section>
      )}

      {/* Technical details footer */}
      <details className="rounded-lg border border-border bg-muted/20 p-4">
        <summary className="bt-label cursor-pointer hover:text-foreground">
          Technical details
        </summary>
        <dl className="mt-3 grid gap-2 sm:grid-cols-2">
          <div>
            <dt className="bt-label">Session id</dt>
            <dd className="bt-mono">{detail.session_id}</dd>
          </div>
          {detail.header.agent && (
            <div>
              <dt className="bt-label">Agent</dt>
              <dd className="bt-body">{detail.header.agent}</dd>
            </div>
          )}
          {detail.header.cowork_thread && (
            <div>
              <dt className="bt-label">Cowork thread</dt>
              <dd className="bt-body">{detail.header.cowork_thread}</dd>
            </div>
          )}
          {detail.phase_id && (
            <div>
              <dt className="bt-label">Phase</dt>
              <dd className="bt-mono">{detail.phase_id}</dd>
            </div>
          )}
          {detail.previous_session_id && (
            <div>
              <dt className="bt-label">Previous</dt>
              <dd className="bt-mono">{detail.previous_session_id}</dd>
            </div>
          )}
          {detail.linked_reports.drift && (
            <div>
              <dt className="bt-label">Drift report</dt>
              <dd className="bt-mono break-all">{detail.linked_reports.drift}</dd>
            </div>
          )}
          {detail.linked_reports.schema && (
            <div>
              <dt className="bt-label">Schema report</dt>
              <dd className="bt-mono break-all">{detail.linked_reports.schema}</dd>
            </div>
          )}
          {detail.linked_reports.mirror && (
            <div>
              <dt className="bt-label">Mirror report</dt>
              <dd className="bt-mono break-all">{detail.linked_reports.mirror}</dd>
            </div>
          )}
        </dl>
      </details>
    </div>
  )
}
