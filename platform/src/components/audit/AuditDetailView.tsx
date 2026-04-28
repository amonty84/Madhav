'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { CitationChip } from '@/components/citations/CitationChip'
import { ValidatorFailureView } from '@/components/consume/ValidatorFailureView'
import type { AuditDetailRow, CheckpointResult, PanelMember } from '@/lib/audit/queries'
import type { ValidatorRecord, ToolCallRecord } from '@/lib/audit/types'
import type { ValidatorFailure } from '@/lib/ui/validator-error'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function Section({
  title,
  children,
  className,
}: {
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section aria-labelledby={`section-${title.toLowerCase().replace(/\s+/g, '-')}`} className={cn('space-y-3', className)}>
      <h2
        id={`section-${title.toLowerCase().replace(/\s+/g, '-')}`}
        className="text-sm font-semibold text-foreground border-b border-border pb-1"
      >
        {title}
      </h2>
      {children}
    </section>
  )
}

function Collapsible({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded border border-border overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-3 py-2 text-sm text-muted-foreground hover:bg-muted transition-colors"
      >
        <span>{label}</span>
        <span aria-hidden="true">{open ? '▲' : '▼'}</span>
      </button>
      {open && <div className="px-3 py-2 text-xs bg-muted/20">{children}</div>}
    </div>
  )
}

function CheckpointSection({
  id,
  result,
}: {
  id: string
  result: CheckpointResult
}) {
  const verdictColor = {
    pass: 'text-emerald-600',
    warn: 'text-amber-600',
    halt: 'text-destructive',
  }[result.verdict]

  return (
    <div className="rounded-md border border-border p-3 space-y-1">
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono font-semibold text-muted-foreground">{id}</span>
        <span className={cn('text-xs font-bold uppercase', verdictColor)}>{result.verdict}</span>
        <span className="text-xs text-muted-foreground ml-auto">
          confidence: {(result.confidence * 100).toFixed(0)}%
        </span>
      </div>
      <Collapsible label="Reasoning">
        <p className="text-foreground/80 leading-relaxed">{result.reasoning}</p>
      </Collapsible>
    </div>
  )
}

function PanelMemberRow({ member }: { member: PanelMember }) {
  const alignColor = {
    agree: 'text-emerald-600',
    partial: 'text-amber-600',
    dissent: 'text-destructive',
  }[member.alignment]

  return (
    <div className="rounded border border-border p-2.5 space-y-1">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-foreground">{member.label}</span>
        <span className={cn('text-xs font-medium ml-auto', alignColor)}>{member.alignment}</span>
      </div>
      <p className="text-xs text-foreground/70 line-clamp-3">{member.answer}</p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

interface Props {
  row: AuditDetailRow
}

export function AuditDetailView({ row }: Props) {
  const validators = (row.validators_run ?? []) as ValidatorRecord[]
  const tools = (row.tools_called ?? []) as ToolCallRecord[]
  const bundleKeys = (row.bundle_keys ?? []) as string[]
  const checkpoints = row.payload?.checkpoints
  const panel = row.payload?.panel

  const validatorFailures: ValidatorFailure[] = validators
    .filter((v) => !v.passed)
    .map((v) => ({
      validator_id: v.validator_id,
      passed: false,
      vote: 'fail' as const,
      reason: v.message,
      validator_version: '1.0',
      affected_claims: [],
    }))

  return (
    <div className="space-y-8">
      {/* 1. Header */}
      <Section title="Query">
        <div className="rounded-md border border-border bg-card p-4 space-y-3">
          <p className="text-base text-foreground leading-relaxed">{row.query_text}</p>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs sm:grid-cols-4">
            <div>
              <dt className="text-muted-foreground">Created</dt>
              <dd className="text-foreground font-mono">{new Date(row.created_at).toLocaleString()}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Class</dt>
              <dd className="text-foreground">{row.query_class ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Disclosure tier</dt>
              <dd className="text-foreground">{row.disclosure_tier ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Model</dt>
              <dd className="text-foreground font-mono truncate">{row.synthesis_model ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Input tokens</dt>
              <dd className="text-foreground">{row.synthesis_input_tokens?.toLocaleString() ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Output tokens</dt>
              <dd className="text-foreground">{row.synthesis_output_tokens?.toLocaleString() ?? '—'}</dd>
            </div>
          </dl>
        </div>
      </Section>

      {/* 2. Bundle */}
      {bundleKeys.length > 0 && (
        <Section title="Bundle">
          <div className="flex flex-wrap gap-1.5">
            {bundleKeys.map((key) => {
              const [type, id] = key.includes(':') ? key.split(':', 2) : ['chunk', key]
              return (
                <CitationChip
                  key={key}
                  type={(type as 'signal' | 'asset' | 'chunk') ?? 'chunk'}
                  id={id ?? key}
                />
              )
            })}
          </div>
        </Section>
      )}

      {/* 3. Tools called */}
      {tools.length > 0 && (
        <Section title="Tools called">
          <ol className="space-y-1">
            {tools.map((t, i) => (
              <li
                key={`${t.tool}-${i}`}
                className="flex items-center gap-3 rounded border border-border bg-card px-3 py-2 text-xs"
              >
                <span className="text-muted-foreground w-5 text-right">{i + 1}.</span>
                <span className="font-mono font-semibold text-foreground">{t.tool}</span>
                <span className="text-muted-foreground">
                  {t.latency_ms}ms
                  {t.cached && (
                    <span className="ml-1.5 rounded border border-sky-200 bg-sky-50 px-1 text-sky-600 dark:bg-sky-900/20 dark:text-sky-400">
                      cached
                    </span>
                  )}
                </span>
                <span className="ml-auto font-mono text-muted-foreground">{t.params_hash}</span>
              </li>
            ))}
          </ol>
        </Section>
      )}

      {/* 4. Validators */}
      {validators.length > 0 && (
        <Section title="Validators">
          {validatorFailures.length > 0 ? (
            <ValidatorFailureView failures={validatorFailures} onRetry={() => {}} className="px-0 py-0 max-w-none" />
          ) : (
            <div className="space-y-1">
              {validators.map((v, i) => (
                <div
                  key={`${v.validator_id}-${i}`}
                  className="flex items-center gap-3 rounded border border-border bg-card px-3 py-2 text-xs"
                >
                  <span className={cn('font-bold', v.passed ? 'text-emerald-600' : 'text-destructive')}>
                    {v.passed ? '✓' : '✗'}
                  </span>
                  <span className="font-mono text-foreground">{v.validator_id}</span>
                  {v.message && <span className="text-muted-foreground">{v.message}</span>}
                </div>
              ))}
            </div>
          )}
        </Section>
      )}

      {/* 5. Checkpoints — only if present */}
      {checkpoints && (
        <Section title="Checkpoints">
          <div className="space-y-2">
            {Object.entries(checkpoints).map(([id, result]) => (
              <CheckpointSection key={id} id={id} result={result} />
            ))}
          </div>
        </Section>
      )}

      {/* 6. Panel — only if present */}
      {panel && (
        <Section title="Panel Mode">
          <div className="rounded-md border border-border bg-card p-4 space-y-4">
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-1">Adjudicator answer</p>
              <p className="text-sm text-foreground leading-relaxed">{panel.adjudicator_answer}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2">
                Divergence: <span className="text-foreground">{panel.divergence_class}</span>
              </p>
              <div className="grid gap-2 sm:grid-cols-3">
                {panel.members.map((m) => (
                  <PanelMemberRow key={m.label} member={m} />
                ))}
              </div>
            </div>
          </div>
        </Section>
      )}

      {/* 7. Final output */}
      <Section title="Final output">
        <div className="rounded-md border border-border bg-card p-4">
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
            {row.final_output ?? '—'}
          </p>
        </div>
      </Section>

      {/* 8. Raw payload */}
      <Section title="Raw payload">
        <Collapsible label="Show JSON">
          <pre className="overflow-x-auto text-xs text-foreground/70">
            {JSON.stringify(
              {
                id: row.id,
                query_id: row.query_id,
                audit_event_version: row.audit_event_version,
                bundle_keys: row.bundle_keys,
                tools_called: row.tools_called,
                validators_run: row.validators_run,
                payload: row.payload,
                predictions: row.predictions,
              },
              null,
              2
            )}
          </pre>
        </Collapsible>
      </Section>

      {/* Predictions linked to this query */}
      {row.predictions.length > 0 && (
        <Section title="Linked predictions">
          <div className="space-y-2">
            {row.predictions.map((p) => (
              <div
                key={p.id}
                className="rounded border border-border bg-card px-3 py-2.5 text-sm space-y-1"
              >
                <p className="text-foreground">{p.prediction_text}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground">
                  <span>Confidence: {(p.confidence * 100).toFixed(0)}%</span>
                  <span>Horizon: {p.horizon_start} → {p.horizon_end}</span>
                  {p.outcome && (
                    <span className="font-medium text-foreground">Outcome: {p.outcome}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <Link
            href="/audit/predictions"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            View all predictions →
          </Link>
        </Section>
      )}
    </div>
  )
}
