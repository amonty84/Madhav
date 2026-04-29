import type { RedTeamPass, NativeDirectives, DisagreementRegister } from '@/lib/build/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StatusPill } from './StatusPill'
import { formatDate } from '@/lib/build/format'

function RedTeamSection({ passes }: { passes: RedTeamPass[] }) {
  return (
    <section>
      <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Red-Team Passes ({passes.length})
      </h2>
      {passes.length === 0 ? (
        <p className="text-sm text-muted-foreground">No red-team passes recorded.</p>
      ) : (
        <div className="space-y-2">
          {passes.map((p, i) => (
            <Card key={i} size="sm">
              <CardContent className="py-3 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-xs font-medium truncate">
                      {p.session_id ?? 'standalone run'}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground truncate">{p.report_path}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Badge variant={p.verdict === 'PASS' ? 'default' : 'destructive'} className="text-xs">
                      {p.verdict}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{formatDate(p.performed_on)}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span>Findings: <span className="font-medium text-foreground">{p.finding_count}</span></span>
                  {p.residuals.length > 0 && (
                    <span>Residuals: <span className="font-medium text-foreground">{p.residuals.join(', ')}</span></span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}

function NDSection({ nd }: { nd: NativeDirectives }) {
  return (
    <section>
      <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Native Directives — Open ({nd.open.length}) · Addressed ({nd.addressed.length})
      </h2>
      {nd.entries.length === 0 ? (
        <p className="text-sm text-muted-foreground">No directives.</p>
      ) : (
        <div className="space-y-2">
          {nd.entries.map((e) => (
            <Card key={e.nd_id} size="sm">
              <CardContent className="py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-xs font-medium">{e.nd_id}</p>
                    <p className="mt-0.5 text-sm leading-snug">{e.title}</p>
                  </div>
                  <StatusPill status={e.status.includes('addressed') || e.status.includes('flipped') ? 'addressed' : e.status} />
                </div>
                {(e.issued_on || e.addressed_on) && (
                  <div className="mt-1.5 flex gap-4 text-xs text-muted-foreground">
                    {e.issued_on && <span>Issued: {formatDate(e.issued_on)}</span>}
                    {e.addressed_on && <span>Addressed: {formatDate(e.addressed_on)}</span>}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {nd.note && (
        <p className="mt-2 text-xs text-muted-foreground">{nd.note}</p>
      )}
    </section>
  )
}

function DRSection({ dr }: { dr: DisagreementRegister }) {
  return (
    <section>
      <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Disagreement Register — Open ({dr.open_count}) · Resolved ({dr.resolved_count})
      </h2>
      {dr.entries.length === 0 ? (
        <Card size="sm">
          <CardContent className="py-3">
            <p className="text-sm text-muted-foreground">No open disagreements.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {dr.entries.map((e) => (
            <Card key={e.dr_id} size="sm">
              <CardContent className="py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-xs font-medium">{e.dr_id}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{e.class}</p>
                    <p className="mt-1 text-sm">{e.description}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <StatusPill status={e.status} />
                    <span className="text-xs text-muted-foreground">{formatDate(e.opened_on)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}

export function InterventionList({
  red_team_passes,
  native_directives,
  disagreement_register,
}: {
  red_team_passes: RedTeamPass[]
  native_directives: NativeDirectives
  disagreement_register: DisagreementRegister
}) {
  return (
    <div className="space-y-8">
      <RedTeamSection passes={red_team_passes} />
      <NDSection nd={native_directives} />
      <DRSection dr={disagreement_register} />
    </div>
  )
}
