'use client'

import { cn } from '@/lib/utils'
import { QueryClassBadge, DisclosureTierBadge, ValidatorStatusIcon } from './AuditBadge'
import type { AuditDetailRow } from '@/lib/audit/queries'
import type { ValidatorRecord } from '@/lib/audit/types'

interface DiffHighlightProps {
  labelA: string
  labelB: string
  valueA: React.ReactNode
  valueB: React.ReactNode
  isDifferent?: boolean
}

function DiffRow({ labelA, labelB, valueA, valueB, isDifferent }: DiffHighlightProps) {
  void labelA
  void labelB
  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-4 rounded-md px-3 py-2 text-sm',
        isDifferent ? 'bg-amber-50 dark:bg-amber-900/10 ring-1 ring-amber-200 dark:ring-amber-700' : ''
      )}
    >
      <div>{valueA}</div>
      <div>{valueB}</div>
    </div>
  )
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="grid grid-cols-2 gap-4 border-b border-border pb-1 mb-2">
      <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider col-span-2">
        {title}
      </h2>
    </div>
  )
}

interface Props {
  rowA: AuditDetailRow
  rowB: AuditDetailRow
}

export function CompareView({ rowA, rowB }: Props) {
  const validatorsA = (rowA.validators_run ?? []) as ValidatorRecord[]
  const validatorsB = (rowB.validators_run ?? []) as ValidatorRecord[]

  const allValidatorIds = Array.from(
    new Set([...validatorsA.map((v) => v.validator_id), ...validatorsB.map((v) => v.validator_id)])
  )

  function getVerdict(validators: ValidatorRecord[], id: string) {
    const v = validators.find((x) => x.validator_id === id)
    if (!v) return null
    return v
  }

  return (
    <div className="space-y-8">
      {/* Column headers */}
      <div className="grid grid-cols-2 gap-4 sticky top-0 bg-background z-10 pb-2 border-b border-border">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground font-mono">{rowA.query_id.slice(0, 12)}…</p>
          <p className="text-sm font-medium text-foreground line-clamp-2">{rowA.query_text}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground font-mono">{rowB.query_id.slice(0, 12)}…</p>
          <p className="text-sm font-medium text-foreground line-clamp-2">{rowB.query_text}</p>
        </div>
      </div>

      {/* Metadata */}
      <section aria-label="Metadata comparison">
        <SectionHeader title="Metadata" />
        <div className="space-y-1">
          <DiffRow
            labelA="class"
            labelB="class"
            valueA={<QueryClassBadge queryClass={rowA.query_class ?? '—'} />}
            valueB={<QueryClassBadge queryClass={rowB.query_class ?? '—'} />}
            isDifferent={rowA.query_class !== rowB.query_class}
          />
          <DiffRow
            labelA="tier"
            labelB="tier"
            valueA={<DisclosureTierBadge tier={rowA.disclosure_tier ?? '—'} />}
            valueB={<DisclosureTierBadge tier={rowB.disclosure_tier ?? '—'} />}
            isDifferent={rowA.disclosure_tier !== rowB.disclosure_tier}
          />
          <DiffRow
            labelA="model"
            labelB="model"
            valueA={<span className="text-xs font-mono text-muted-foreground">{rowA.synthesis_model ?? '—'}</span>}
            valueB={<span className="text-xs font-mono text-muted-foreground">{rowB.synthesis_model ?? '—'}</span>}
            isDifferent={rowA.synthesis_model !== rowB.synthesis_model}
          />
          <DiffRow
            labelA="tokens"
            labelB="tokens"
            valueA={
              <span className="text-xs text-muted-foreground">
                {rowA.synthesis_input_tokens?.toLocaleString() ?? '—'} in / {rowA.synthesis_output_tokens?.toLocaleString() ?? '—'} out
              </span>
            }
            valueB={
              <span className="text-xs text-muted-foreground">
                {rowB.synthesis_input_tokens?.toLocaleString() ?? '—'} in / {rowB.synthesis_output_tokens?.toLocaleString() ?? '—'} out
              </span>
            }
            isDifferent={
              rowA.synthesis_input_tokens !== rowB.synthesis_input_tokens ||
              rowA.synthesis_output_tokens !== rowB.synthesis_output_tokens
            }
          />
        </div>
      </section>

      {/* Validators */}
      {allValidatorIds.length > 0 && (
        <section aria-label="Validator comparison">
          <SectionHeader title="Validators" />
          <div className="space-y-1">
            <DiffRow
              labelA="summary"
              labelB="summary"
              valueA={<ValidatorStatusIcon validatorsRun={validatorsA} />}
              valueB={<ValidatorStatusIcon validatorsRun={validatorsB} />}
            />
            {allValidatorIds.map((id) => {
              const vA = getVerdict(validatorsA, id)
              const vB = getVerdict(validatorsB, id)
              return (
                <DiffRow
                  key={id}
                  labelA={id}
                  labelB={id}
                  valueA={
                    vA ? (
                      <span className={cn('text-xs', vA.passed ? 'text-emerald-600' : 'text-destructive')}>
                        {vA.passed ? '✓' : '✗'} {id}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )
                  }
                  valueB={
                    vB ? (
                      <span className={cn('text-xs', vB.passed ? 'text-emerald-600' : 'text-destructive')}>
                        {vB.passed ? '✓' : '✗'} {id}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )
                  }
                  isDifferent={
                    (vA?.passed ?? null) !== (vB?.passed ?? null)
                  }
                />
              )
            })}
          </div>
        </section>
      )}

      {/* Checkpoints */}
      {(rowA.payload?.checkpoints || rowB.payload?.checkpoints) && (
        <section aria-label="Checkpoint comparison">
          <SectionHeader title="Checkpoints" />
          <div className="space-y-1">
            {(['c4_5', 'c5_5', 'c8_5'] as const).map((cpId) => {
              const cpA = rowA.payload?.checkpoints?.[cpId]
              const cpB = rowB.payload?.checkpoints?.[cpId]
              if (!cpA && !cpB) return null
              return (
                <DiffRow
                  key={cpId}
                  labelA={cpId}
                  labelB={cpId}
                  valueA={
                    cpA ? (
                      <span className={cn('text-xs font-medium', {
                        'text-emerald-600': cpA.verdict === 'pass',
                        'text-amber-600': cpA.verdict === 'warn',
                        'text-destructive': cpA.verdict === 'halt',
                      })}>
                        {cpId}: {cpA.verdict}
                      </span>
                    ) : <span className="text-xs text-muted-foreground">—</span>
                  }
                  valueB={
                    cpB ? (
                      <span className={cn('text-xs font-medium', {
                        'text-emerald-600': cpB.verdict === 'pass',
                        'text-amber-600': cpB.verdict === 'warn',
                        'text-destructive': cpB.verdict === 'halt',
                      })}>
                        {cpId}: {cpB.verdict}
                      </span>
                    ) : <span className="text-xs text-muted-foreground">—</span>
                  }
                  isDifferent={cpA?.verdict !== cpB?.verdict}
                />
              )
            })}
          </div>
        </section>
      )}

      {/* Final output */}
      <section aria-label="Output comparison">
        <SectionHeader title="Final output" />
        <DiffRow
          labelA="output"
          labelB="output"
          valueA={
            <p className="text-xs text-foreground/80 whitespace-pre-wrap line-clamp-12">
              {rowA.final_output ?? '—'}
            </p>
          }
          valueB={
            <p className="text-xs text-foreground/80 whitespace-pre-wrap line-clamp-12">
              {rowB.final_output ?? '—'}
            </p>
          }
          isDifferent={rowA.final_output !== rowB.final_output}
        />
      </section>
    </div>
  )
}
