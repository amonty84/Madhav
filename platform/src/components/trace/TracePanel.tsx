'use client'

/**
 * MARSYS-JIS Query Trace Panel
 *
 * Right-side drawer (65vw) showing real-time pipeline execution for any query.
 * Opens from the ⚡ TRACE button in the ConsumeChat input area.
 *
 * Layout:
 *   Header: query pill · LIVE/DONE badge · Live | History tabs
 *   Body:   TraceTimeline (left 300px) + ContextInspector (right flex)
 *   Footer: wall-clock timeline bar with parallel lanes
 */

import { useState, useMemo } from 'react'
import { X, ChevronRight, ChevronDown, Clock, Layers, Database, Zap } from 'lucide-react'
import { useTraceStream } from '@/hooks/useTraceStream'
import type { TraceStep, TraceChunkItem } from '@/lib/trace/types'

// ── Types ─────────────────────────────────────────────────────────────────────

interface Props {
  queryId: string | null
  isSuperAdmin: boolean
  onClose: () => void
}

// ── Step type display config ───────────────────────────────────────────────────

const STEP_TYPE_CONFIG = {
  deterministic: { label: 'DET', color: 'bg-[color-mix(in_oklch,var(--brand-ink)_88%,var(--brand-gold)_12%)] text-brand-gold-cream border-[color-mix(in_oklch,var(--brand-gold)_18%,transparent)]' },
  llm:           { label: 'LLM', color: 'bg-violet-950 text-violet-300 border-violet-700' },
  sql:           { label: 'SQL', color: 'bg-sky-950 text-sky-300 border-sky-700' },
  vector:        { label: 'VEC', color: 'bg-emerald-950 text-emerald-300 border-emerald-700' },
  gcs:           { label: 'GCS', color: 'bg-red-950 text-red-300 border-red-700' },
} as const

const TIMELINE_BAR_COLOR = {
  deterministic: 'bg-[color-mix(in_oklch,var(--brand-ink)_60%,var(--brand-gold)_40%)]',
  llm:           'bg-violet-600',
  sql:           'bg-sky-600',
  vector:        'bg-emerald-600',
  gcs:           'bg-red-600',
} as const

const LAYER_COLOR = {
  L1:      { dot: 'bg-red-500', bar: 'bg-red-500', text: 'text-red-400' },
  'L2.5':  { dot: 'bg-violet-500', bar: 'bg-violet-500', text: 'text-violet-400' },
  system:  { dot: 'bg-muted-foreground', bar: 'bg-muted-foreground', text: 'text-muted-foreground' },
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtMs(ms: number | undefined): string {
  if (ms == null) return '…'
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(1)}s`
}

function fmtTokens(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

function stepSummaryLine(step: TraceStep): string {
  const s = step.data_summary
  if (step.step_type === 'vector' && s.chunks_returned != null)
    return `${s.chunks_returned} chunks · score ${s.top_score?.toFixed(2) ?? '?'}`
  if (step.step_type === 'sql' && s.rows_returned != null)
    return `${s.rows_returned} rows · ~${fmtTokens(s.token_estimate ?? 0)} tok`
  if (step.step_type === 'gcs' && s.token_estimate != null)
    return `~${fmtTokens(s.token_estimate)} tok`
  if (step.step_type === 'llm' && s.model)
    return `${s.model.replace('claude-', '')} · in:${s.input_tokens ?? '?'} out:${s.output_tokens ?? '?'}`
  if (s.result) return s.result
  return ''
}

// ── Sub-component: Step row ───────────────────────────────────────────────────

function StepRow({
  step,
  isSelected,
  onClick,
}: {
  step: TraceStep
  isSelected: boolean
  onClick: () => void
}) {
  const cfg = STEP_TYPE_CONFIG[step.step_type]
  const isDone = step.status === 'done'
  const isRunning = step.status === 'running'
  const isError = step.status === 'error'

  const seqBg = isDone
    ? 'bg-emerald-950 border-emerald-700 text-emerald-300'
    : isRunning
    ? 'bg-blue-950 border-blue-600 text-blue-300 animate-pulse'
    : isError
    ? 'bg-red-950 border-red-700 text-red-400'
    : 'bg-brand-ink border-[color-mix(in_oklch,var(--brand-gold)_15%,transparent)] text-muted-foreground'

  const summaryLine = stepSummaryLine(step)
  const latencyPct = step.latency_ms ? Math.min(100, (step.latency_ms / 2000) * 100) : 0

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left flex items-start gap-2.5 px-3 py-2 transition-colors border-l-2 hover:bg-brand-ink/60 ${
        isSelected ? 'bg-[color-mix(in_oklch,var(--brand-ink)_90%,var(--brand-gold)_10%)] border-l-brand-gold' : 'border-l-transparent'
      }`}
    >
      {/* Sequence number */}
      <div
        className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border text-[10px] font-bold flex items-center justify-center ${seqBg}`}
      >
        {step.step_seq}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-[11px] font-semibold text-brand-gold-cream truncate">
            {step.step_name.replace(/_/g, ' ')}
          </span>
          <span className={`text-[9px] font-bold px-1 py-px rounded border ${cfg.color}`}>
            {cfg.label}
          </span>
          {step.latency_ms != null && (
            <span className="text-[10px] text-muted-foreground ml-auto">{fmtMs(step.latency_ms)}</span>
          )}
          {step.parallel_group && (
            <span className="text-[9px] text-muted-foreground/60">⇉</span>
          )}
        </div>

        {summaryLine && (
          <div className="text-[10px] text-muted-foreground truncate">{summaryLine}</div>
        )}

        {/* Latency bar */}
        {isDone && step.latency_ms != null && (
          <div className="mt-1 h-[2px] bg-[color-mix(in_oklch,var(--brand-ink)_90%,var(--brand-gold)_10%)] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${TIMELINE_BAR_COLOR[step.step_type]}`}
              style={{ width: `${latencyPct}%` }}
            />
          </div>
        )}
        {isRunning && (
          <div className="mt-1 h-[2px] bg-[color-mix(in_oklch,var(--brand-ink)_90%,var(--brand-gold)_10%)] rounded-full overflow-hidden">
            <div className="h-full w-1/3 rounded-full bg-blue-500 animate-[slide_1.2s_ease-in-out_infinite]" />
          </div>
        )}
      </div>
    </button>
  )
}

// ── Sub-component: Parallel group block ───────────────────────────────────────

function ParallelGroup({
  groupSteps,
  selectedSeq,
  onSelect,
}: {
  groupSteps: TraceStep[]
  selectedSeq: number | null
  onSelect: (s: TraceStep) => void
}) {
  return (
    <div className="border border-[color-mix(in_oklch,var(--brand-gold)_15%,transparent)]/60 rounded mx-2 my-1 overflow-hidden">
      <div className="flex items-center gap-1.5 px-2 py-1 bg-[color-mix(in_oklch,var(--brand-ink)_90%,var(--brand-gold)_10%)]/40 border-b border-[color-mix(in_oklch,var(--brand-gold)_15%,transparent)]/60">
        <span className="text-[9px] font-bold text-muted-foreground tracking-wider">⇉ PARALLEL</span>
        <span className="text-[9px] text-muted-foreground/60">{groupSteps.length} concurrent</span>
      </div>
      {groupSteps.map(step => (
        <StepRow
          key={step.step_seq}
          step={step}
          isSelected={selectedSeq === step.step_seq}
          onClick={() => onSelect(step)}
        />
      ))}
    </div>
  )
}

// ── Sub-component: Context Inspector ─────────────────────────────────────────

function ContextInspector({
  steps,
  selectedStep,
}: {
  steps: TraceStep[]
  selectedStep: TraceStep | null
}) {
  const [expandedLayer, setExpandedLayer] = useState<'L1' | 'L2.5' | null>(null)
  const [drilldownItem, setDrilldownItem] = useState<TraceChunkItem | null>(null)

  const ctxStep = steps.find(s => s.step_name === 'context_assembly')
  const payload = ctxStep?.payload

  const l1Tok = payload?.l1_tokens ?? 0
  const l2Tok = payload?.l2_tokens ?? 0
  const sysTok = payload?.system_tokens ?? 0
  const total = payload?.total_tokens ?? (l1Tok + l2Tok + sysTok)

  const l1Pct = total > 0 ? Math.round((l1Tok / total) * 100) : 0
  const l2Pct = total > 0 ? Math.round((l2Tok / total) * 100) : 0
  const sysPct = total > 0 ? Math.round((sysTok / total) * 100) : 0

  if (drilldownItem) {
    return (
      <div className="flex flex-col h-full">
        {/* Drilldown header */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-[color-mix(in_oklch,var(--brand-gold)_15%,transparent)]/60 flex-shrink-0">
          <button
            type="button"
            onClick={() => setDrilldownItem(null)}
            className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            ← Back
          </button>
          <span className="text-[10px] text-muted-foreground font-mono truncate">{drilldownItem.id}</span>
          <span className={`text-[9px] font-bold ml-auto ${LAYER_COLOR[drilldownItem.layer]?.text ?? ''}`}>
            {drilldownItem.layer}
          </span>
        </div>
        {/* Chunk meta */}
        <div className="flex items-center gap-3 px-3 py-1.5 border-b border-[color-mix(in_oklch,var(--brand-gold)_15%,transparent)]/40 flex-shrink-0">
          <span className="text-[10px] text-muted-foreground">source: <span className="text-brand-gold-cream">{drilldownItem.source}</span></span>
          <span className="text-[10px] text-muted-foreground">~{drilldownItem.token_estimate} tok</span>
        </div>
        {/* Chunk text */}
        <div className="flex-1 overflow-y-auto px-3 py-2">
          <pre className="text-[11px] text-brand-gold-cream whitespace-pre-wrap leading-relaxed font-mono">
            {drilldownItem.text}
          </pre>
        </div>
      </div>
    )
  }

  // ── Selected step detail ───────────────────────────────────────────────────
  const showSelectedStep = selectedStep && selectedStep.step_name !== 'context_assembly'

  return (
    <div className="flex flex-col h-full gap-0 overflow-y-auto">

      {/* Context summary card */}
      <div className="border-b border-[color-mix(in_oklch,var(--brand-gold)_15%,transparent)]/60 flex-shrink-0">
        <div className="flex items-center justify-between px-3 py-2 border-b border-[color-mix(in_oklch,var(--brand-gold)_15%,transparent)]/40">
          <div className="flex items-center gap-1.5">
            <Layers size={11} className="text-muted-foreground" />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Context</span>
          </div>
          {total > 0 && (
            <span className="text-[10px] text-muted-foreground font-semibold">{fmtTokens(total)} tokens</span>
          )}
        </div>

        {total > 0 ? (
          <div className="px-3 py-2">
            {/* Multi-colored bar */}
            <div className="h-2 rounded-full overflow-hidden flex gap-px mb-3">
              <div className="bg-red-500 h-full rounded-l-full" style={{ width: `${l1Pct}%` }} />
              <div className="bg-violet-500 h-full" style={{ width: `${l2Pct}%` }} />
              <div className="bg-slate-500 h-full rounded-r-full" style={{ width: `${sysPct}%` }} />
            </div>

            {/* L1 row */}
            <LayerRow
              layer="L1"
              label="L1 — Raw Facts"
              sublabel={`${(payload?.l1_items ?? []).length} items · bundle_load + vector_search`}
              tokens={l1Tok}
              pct={l1Pct}
              expanded={expandedLayer === 'L1'}
              onToggle={() => setExpandedLayer(e => e === 'L1' ? null : 'L1')}
              items={payload?.l1_items ?? []}
              onDrilldown={setDrilldownItem}
            />
            {/* L2.5 row */}
            <LayerRow
              layer="L2.5"
              label="L2.5 — Holistic Synthesis"
              sublabel={`${(payload?.l2_items ?? []).length} items · msr_sql + vector_search`}
              tokens={l2Tok}
              pct={l2Pct}
              expanded={expandedLayer === 'L2.5'}
              onToggle={() => setExpandedLayer(e => e === 'L2.5' ? null : 'L2.5')}
              items={payload?.l2_items ?? []}
              onDrilldown={setDrilldownItem}
            />
            {/* System row */}
            <div className="flex items-center gap-2 py-1.5 px-1">
              <div className="w-2 h-2 rounded-sm bg-slate-500 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-[11px] font-medium text-brand-gold-cream">System Preamble</div>
                <div className="text-[10px] text-muted-foreground">static · prompt registry</div>
              </div>
              <div className="text-right">
                <div className="text-[12px] font-bold text-brand-gold-cream">{fmtTokens(sysTok)}</div>
                <div className="text-[9px] text-muted-foreground">{sysPct}%</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="px-3 py-3 text-[11px] text-muted-foreground/60 italic">
            {steps.length === 0 ? 'Waiting for query…' : 'Context assembling…'}
          </div>
        )}
      </div>

      {/* Selected step detail */}
      {showSelectedStep && (
        <div className="flex-shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-2 border-b border-[color-mix(in_oklch,var(--brand-gold)_15%,transparent)]/40">
            <Database size={11} className="text-muted-foreground" />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Step {selectedStep.step_seq} — {selectedStep.step_name.replace(/_/g, ' ')}
            </span>
            <span className="text-[10px] text-muted-foreground/60 ml-auto">{fmtMs(selectedStep.latency_ms)}</span>
          </div>

          <div className="px-3 py-2 grid grid-cols-[110px_1fr] gap-y-1 gap-x-2 text-[11px]">
            <span className="text-muted-foreground">Status</span>
            <span className={selectedStep.status === 'done' ? 'text-emerald-400' : selectedStep.status === 'running' ? 'text-blue-400' : 'text-red-400'}>
              {selectedStep.status}
            </span>
            <span className="text-muted-foreground">Type</span>
            <span className="text-brand-gold-cream">{selectedStep.step_type}</span>
            {selectedStep.data_summary.model && (
              <>
                <span className="text-muted-foreground">Model</span>
                <span className="text-brand-gold-cream">{selectedStep.data_summary.model}</span>
              </>
            )}
            {selectedStep.data_summary.chunks_returned != null && (
              <>
                <span className="text-muted-foreground">Chunks</span>
                <span className="text-emerald-400">{selectedStep.data_summary.chunks_returned} returned</span>
                <span className="text-muted-foreground">Top score</span>
                <span className="text-emerald-400">{selectedStep.data_summary.top_score?.toFixed(3)}</span>
              </>
            )}
            {selectedStep.data_summary.rows_returned != null && (
              <>
                <span className="text-muted-foreground">Rows</span>
                <span className="text-sky-400">{selectedStep.data_summary.rows_returned} returned</span>
              </>
            )}
            {selectedStep.data_summary.token_estimate != null && (
              <>
                <span className="text-muted-foreground">~Tokens</span>
                <span className="text-brand-gold-cream">{fmtTokens(selectedStep.data_summary.token_estimate)}</span>
              </>
            )}
            {selectedStep.parallel_group && (
              <>
                <span className="text-muted-foreground">Group</span>
                <span className="text-muted-foreground">⇉ {selectedStep.parallel_group}</span>
              </>
            )}
          </div>

          {/* Chunk preview for tool steps */}
          {selectedStep.payload.items && selectedStep.payload.items.length > 0 && (
            <div className="px-3 pb-2">
              <div className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-wider mb-1">
                Retrieved items — double-click to expand
              </div>
              <div className="space-y-1">
                {selectedStep.payload.items.slice(0, 4).map((item, i) => (
                  <button
                    key={`${item.id}-${i}`}
                    type="button"
                    onDoubleClick={() => setDrilldownItem(item)}
                    className="w-full text-left bg-brand-ink border border-[color-mix(in_oklch,var(--brand-gold)_15%,transparent)]/60 rounded p-2 hover:border-[color-mix(in_oklch,var(--brand-gold)_18%,transparent)] transition-colors"
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[9px] font-mono text-muted-foreground truncate max-w-[60%]">{item.id}</span>
                      <span className={`text-[9px] font-bold ${LAYER_COLOR[item.layer]?.text ?? ''}`}>{item.layer}</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground line-clamp-2">{item.text.slice(0, 120)}</div>
                    <div className="text-[9px] text-muted-foreground/60 mt-0.5">double-click to expand</div>
                  </button>
                ))}
                {selectedStep.payload.items.length > 4 && (
                  <div className="text-[9px] text-muted-foreground/60 px-1">
                    +{selectedStep.payload.items.length - 4} more items
                  </div>
                )}
              </div>
            </div>
          )}

          {/* LLM prompt preview */}
          {selectedStep.payload.prompt_preview && (
            <div className="px-3 pb-2">
              <div className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-wider mb-1">
                Output preview (first 500 chars)
              </div>
              <div className="bg-brand-ink border border-[color-mix(in_oklch,var(--brand-gold)_15%,transparent)]/60 rounded p-2">
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  {selectedStep.payload.prompt_preview}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Sub-component: Layer row with drill-down ───────────────────────────────────

function LayerRow({
  layer,
  label,
  sublabel,
  tokens,
  pct,
  expanded,
  onToggle,
  items,
  onDrilldown,
}: {
  layer: 'L1' | 'L2.5'
  label: string
  sublabel: string
  tokens: number
  pct: number
  expanded: boolean
  onToggle: () => void
  items: TraceChunkItem[]
  onDrilldown: (item: TraceChunkItem) => void
}) {
  const cfg = LAYER_COLOR[layer]

  return (
    <div>
      <button
        type="button"
        onDoubleClick={onToggle}
        onClick={onToggle}
        className="w-full flex items-center gap-2 py-1.5 px-1 hover:bg-[color-mix(in_oklch,var(--brand-ink)_90%,var(--brand-gold)_10%)]/40 rounded transition-colors"
      >
        <div className={`w-2 h-2 rounded-sm ${cfg.dot} flex-shrink-0`} />
        <div className="flex-1 text-left min-w-0">
          <div className="text-[11px] font-medium text-brand-gold-cream">{label}</div>
          <div className="text-[10px] text-muted-foreground truncate">{sublabel}</div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-[12px] font-bold text-brand-gold-cream">{fmtTokens(tokens)}</div>
          <div className="text-[9px] text-muted-foreground">{pct}%</div>
        </div>
        {expanded ? (
          <ChevronDown size={11} className="text-muted-foreground flex-shrink-0" />
        ) : (
          <ChevronRight size={11} className="text-muted-foreground flex-shrink-0" />
        )}
      </button>

      {expanded && items.length > 0 && (
        <div className="ml-4 mb-1 space-y-1">
          {items.map((item, i) => (
            <button
              key={`${item.id}-${i}`}
              type="button"
              onDoubleClick={() => onDrilldown(item)}
              className="w-full text-left bg-brand-ink/80 border border-[color-mix(in_oklch,var(--brand-gold)_12%,transparent)] rounded p-1.5 hover:border-[color-mix(in_oklch,var(--brand-gold)_15%,transparent)] transition-colors"
            >
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[9px] font-mono text-muted-foreground/60 truncate max-w-[70%]">{item.id}</span>
                <span className="text-[9px] text-muted-foreground/60">{fmtTokens(item.token_estimate)} tok</span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-2">{item.text.slice(0, 100)}</p>
              <p className="text-[9px] text-muted-foreground/60 mt-0.5">double-click to expand</p>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Sub-component: Wall-clock timeline bar ────────────────────────────────────

function TimelineBar({ steps }: { steps: TraceStep[] }) {
  const doneSteps = steps.filter(s => s.completed_at)
  if (doneSteps.length === 0) return null

  const starts = doneSteps.map(s => new Date(s.started_at).getTime())
  const ends = doneSteps.map(s => new Date(s.completed_at!).getTime())
  const minStart = Math.min(...starts)
  const maxEnd = Math.max(...ends)
  const totalMs = maxEnd - minStart
  if (totalMs <= 0) return null

  // Group parallel steps
  const parallelGroups: Record<string, TraceStep[]> = {}
  const sequentialSteps: TraceStep[] = []
  for (const step of doneSteps) {
    if (step.parallel_group) {
      parallelGroups[step.parallel_group] = parallelGroups[step.parallel_group] ?? []
      parallelGroups[step.parallel_group].push(step)
    } else {
      sequentialSteps.push(step)
    }
  }

  // Build render list: sequential interspersed with parallel groups
  const renderItems: Array<{ type: 'seq'; step: TraceStep } | { type: 'par'; group: string; steps: TraceStep[] }> = []
  const seenGroups = new Set<string>()
  for (const step of doneSteps) {
    if (step.parallel_group) {
      if (!seenGroups.has(step.parallel_group)) {
        seenGroups.add(step.parallel_group)
        renderItems.push({ type: 'par', group: step.parallel_group, steps: parallelGroups[step.parallel_group] })
      }
    } else {
      renderItems.push({ type: 'seq', step })
    }
  }

  const pct = (ms: number) => `${((ms - minStart) / totalMs) * 100}%`
  const width = (start: number, end: number) => `${Math.max(0.5, ((end - start) / totalMs) * 100)}%`

  return (
    <div className="border-t border-[color-mix(in_oklch,var(--brand-gold)_12%,transparent)] bg-brand-ink/80 px-3 py-2 flex-shrink-0">
      <div className="flex items-center gap-2 mb-1">
        <Clock size={10} className="text-muted-foreground/60" />
        <span className="text-[9px] text-muted-foreground/60 uppercase tracking-wider">Timeline</span>
        <span className="text-[10px] text-muted-foreground font-semibold ml-auto">{fmtMs(totalMs)} total</span>
      </div>

      {/* Track area */}
      <div className="relative" style={{ height: `${Math.max(20, renderItems.filter(r => r.type === 'par').length > 0 ? 44 : 20)}px` }}>
        {renderItems.map((item) => {
          if (item.type === 'seq') {
            const s = item.step
            const start = new Date(s.started_at).getTime()
            const end = new Date(s.completed_at!).getTime()
            return (
              <div
                key={`seq-${s.step_seq}`}
                className={`absolute top-0 h-4 rounded-sm text-[8px] flex items-center justify-center overflow-hidden ${TIMELINE_BAR_COLOR[s.step_type]}`}
                style={{ left: pct(start), width: width(start, end) }}
                title={`${s.step_name}: ${fmtMs(s.latency_ms)}`}
              >
                <span className="px-0.5 truncate">{s.step_seq}</span>
              </div>
            )
          }

          // Parallel group — stacked lanes
          return item.steps.map((ps, laneIdx) => {
            const start = new Date(ps.started_at).getTime()
            const end = new Date(ps.completed_at!).getTime()
            return (
              <div
                key={`par-${ps.step_seq}`}
                className={`absolute h-3 rounded-sm text-[7px] flex items-center justify-center overflow-hidden opacity-80 ${TIMELINE_BAR_COLOR[ps.step_type]}`}
                style={{
                  left: pct(start),
                  width: width(start, end),
                  top: `${laneIdx * 14}px`,
                }}
                title={`${ps.step_name}: ${fmtMs(ps.latency_ms)}`}
              >
                <span className="px-0.5 truncate">{ps.step_seq}</span>
              </div>
            )
          })
        })}
      </div>

      {/* Time labels */}
      <div className="flex justify-between mt-0.5">
        <span className="text-[8px] text-muted-foreground/40">0ms</span>
        <span className="text-[8px] text-muted-foreground/40">{fmtMs(totalMs / 2)}</span>
        <span className="text-[8px] text-muted-foreground/40">{fmtMs(totalMs)}</span>
      </div>
    </div>
  )
}

// ── Sub-component: Timeline (left column) ────────────────────────────────────

function TraceTimeline({
  steps,
  selectedSeq,
  onSelect,
}: {
  steps: TraceStep[]
  selectedSeq: number | null
  onSelect: (s: TraceStep) => void
}) {
  // Build render list grouping parallel steps
  const renderItems = useMemo(() => {
    const items: Array<{ type: 'seq'; step: TraceStep } | { type: 'par'; group: string; steps: TraceStep[] }> = []
    const seenGroups = new Set<string>()
    const groupMap: Record<string, TraceStep[]> = {}
    for (const step of steps) {
      if (step.parallel_group) {
        groupMap[step.parallel_group] = groupMap[step.parallel_group] ?? []
        groupMap[step.parallel_group].push(step)
      }
    }
    for (const step of steps) {
      if (step.parallel_group) {
        if (!seenGroups.has(step.parallel_group)) {
          seenGroups.add(step.parallel_group)
          items.push({ type: 'par', group: step.parallel_group, steps: groupMap[step.parallel_group] })
        }
      } else {
        items.push({ type: 'seq', step })
      }
    }
    return items
  }, [steps])

  return (
    <div className="flex flex-col overflow-y-auto border-r border-[color-mix(in_oklch,var(--brand-gold)_12%,transparent)] py-2">
      <div className="px-3 pb-1.5 text-[9px] font-bold text-muted-foreground/60 uppercase tracking-wider">
        Pipeline · {steps.length} steps
      </div>
      {renderItems.map((item, idx) =>
        item.type === 'seq' ? (
          <div key={`s-${item.step.step_seq}`}>
            {idx > 0 && <div className="mx-4 h-3 w-px bg-[color-mix(in_oklch,var(--brand-ink)_90%,var(--brand-gold)_10%)]" />}
            <StepRow
              step={item.step}
              isSelected={selectedSeq === item.step.step_seq}
              onClick={() => onSelect(item.step)}
            />
          </div>
        ) : (
          <div key={`pg-${item.group}`}>
            {idx > 0 && <div className="mx-4 h-3 w-px bg-[color-mix(in_oklch,var(--brand-ink)_90%,var(--brand-gold)_10%)]" />}
            <ParallelGroup
              groupSteps={item.steps}
              selectedSeq={selectedSeq}
              onSelect={onSelect}
            />
          </div>
        )
      )}
    </div>
  )
}

// ── TracePanelContent — shared render body used by TraceDrawer + TracePanel ────

interface ContentProps {
  queryId: string | null
}

export function TracePanelContent({ queryId }: ContentProps) {
  const [activeTab, setActiveTab] = useState<'live' | 'history'>('live')
  const [historyQueryId, setHistoryQueryId] = useState<string | null>(null)
  const [historyList, setHistoryList] = useState<Array<{
    query_id: string
    query_text: string | null
    created_at: string
    step_count: number
    total_latency_ms: number | null
  }>>([])
  const [historyLoaded, setHistoryLoaded] = useState(false)
  const [selectedStep, setSelectedStep] = useState<TraceStep | null>(null)

  const effectiveQueryId = activeTab === 'live' ? queryId : historyQueryId
  const isHistorical = activeTab === 'history'

  const { steps, done, error } = useTraceStream(effectiveQueryId, isHistorical)

  const loadHistory = () => {
    if (historyLoaded) return
    fetch('/api/trace/history')
      .then(r => r.json())
      .then(data => {
        setHistoryList(data)
        setHistoryLoaded(true)
      })
      .catch(err => console.error('[TracePanelContent] history load failed', err))
  }

  const liveBadgeLabel = done ? 'DONE' : steps.length > 0 ? 'LIVE' : 'READY'
  const liveBadgeColor = done
    ? 'bg-[color-mix(in_oklch,var(--brand-ink)_90%,var(--brand-gold)_10%)] text-muted-foreground border-[color-mix(in_oklch,var(--brand-gold)_15%,transparent)]'
    : steps.length > 0
    ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
    : 'bg-brand-ink text-muted-foreground/60 border-[color-mix(in_oklch,var(--brand-gold)_12%,transparent)]'

  return (
    <div className="flex flex-col h-full">
      {/* Sub-header: query pill + live badge + tabs */}
      <div className="flex items-center gap-3 px-4 py-2 border-b border-[color-mix(in_oklch,var(--brand-gold)_12%,transparent)] bg-[color-mix(in_oklch,var(--brand-ink)_90%,var(--brand-gold)_10%)] flex-shrink-0">
        <div className="flex items-center gap-2">
          <Zap size={12} className="text-blue-400" />
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${liveBadgeColor}`}>
            {liveBadgeLabel}
          </span>
        </div>

        {effectiveQueryId && (
          <div className="flex-1 min-w-0 px-2 py-0.5 bg-[color-mix(in_oklch,var(--brand-ink)_90%,var(--brand-gold)_10%)] border border-[color-mix(in_oklch,var(--brand-gold)_15%,transparent)] rounded text-[10px] text-muted-foreground font-mono truncate">
            {effectiveQueryId}
          </div>
        )}

        <div className="flex gap-px bg-[color-mix(in_oklch,var(--brand-ink)_90%,var(--brand-gold)_10%)] rounded p-0.5">
          <button
            type="button"
            onClick={() => setActiveTab('live')}
            className={`px-3 py-1 rounded text-[11px] font-medium transition-colors ${activeTab === 'live' ? 'bg-slate-600 text-brand-gold-cream' : 'text-muted-foreground hover:text-brand-gold-cream'}`}
          >
            Live
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('history'); loadHistory() }}
            className={`px-3 py-1 rounded text-[11px] font-medium transition-colors ${activeTab === 'history' ? 'bg-slate-600 text-brand-gold-cream' : 'text-muted-foreground hover:text-brand-gold-cream'}`}
          >
            History
          </button>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="px-4 py-2 bg-red-950 border-b border-red-900 text-[11px] text-red-400 flex-shrink-0">
          {error}
        </div>
      )}

      {/* Body */}
      {activeTab === 'history' && !historyQueryId ? (
        <div className="flex-1 overflow-y-auto py-2">
          {!historyLoaded ? (
            <div className="px-4 py-3 text-[11px] text-muted-foreground/60">Loading history…</div>
          ) : historyList.length === 0 ? (
            <div className="px-4 py-3 text-[11px] text-muted-foreground/60">No trace history yet. Run a query first.</div>
          ) : (
            historyList.map(entry => (
              <button
                key={entry.query_id}
                type="button"
                onClick={() => setHistoryQueryId(entry.query_id)}
                className="w-full text-left px-4 py-2.5 hover:bg-brand-ink/60 border-b border-[color-mix(in_oklch,var(--brand-gold)_12%,transparent)]/60 transition-colors"
              >
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[11px] text-brand-gold-cream truncate flex-1">
                    {entry.query_text ?? '(no text)'}
                  </span>
                  <span className="text-[9px] text-muted-foreground/60 flex-shrink-0">{entry.step_count} steps</span>
                  {entry.total_latency_ms != null && (
                    <span className="text-[9px] text-muted-foreground/60 flex-shrink-0">{fmtMs(entry.total_latency_ms)}</span>
                  )}
                </div>
                <div className="text-[9px] text-muted-foreground/60">
                  {new Date(entry.created_at).toLocaleString()}
                </div>
              </button>
            ))
          )}
        </div>
      ) : (
        <div className="flex-1 flex overflow-hidden min-h-0">
          <div className="w-[300px] flex-shrink-0 overflow-hidden flex flex-col">
            <TraceTimeline
              steps={steps}
              selectedSeq={selectedStep?.step_seq ?? null}
              onSelect={s => setSelectedStep(s)}
            />
          </div>
          <div className="flex-1 overflow-hidden flex flex-col">
            <ContextInspector steps={steps} selectedStep={selectedStep} />
          </div>
        </div>
      )}

      <TimelineBar steps={steps} />
    </div>
  )
}

// ── Main TracePanel — backward-compatible always-on drawer wrapper ─────────────

export function TracePanel({ queryId, isSuperAdmin, onClose }: Props) {
  if (!isSuperAdmin) return null

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 z-50 flex flex-col w-[65vw] min-w-[700px] max-w-[1100px] bg-brand-ink border-l border-[color-mix(in_oklch,var(--brand-gold)_12%,transparent)] shadow-2xl">
        <div className="flex items-center gap-3 px-4 py-2.5 border-b border-[color-mix(in_oklch,var(--brand-gold)_12%,transparent)] bg-[color-mix(in_oklch,var(--brand-ink)_90%,var(--brand-gold)_10%)] flex-shrink-0">
          <Zap size={13} className="text-blue-400" />
          <span className="text-[13px] font-bold text-brand-gold-cream">Query Trace</span>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto text-muted-foreground hover:text-brand-gold-cream transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        <div className="flex-1 min-h-0 overflow-hidden">
          <TracePanelContent queryId={queryId} />
        </div>
      </div>
    </>
  )
}
