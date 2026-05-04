'use client'

/**
 * RetrievalScorecard — BHISMA-B3 §5.3
 *
 * Per-tool field-level breakdown of retrieved data, plus a cross-tool
 * retrieval-efficiency row at the bottom. Designed to degrade gracefully:
 * each panel reads only fields that exist on the step's payload.items and
 * shows "—" placeholders for fields the source tool doesn't emit (yet).
 *
 * Mounts inline within ContextInspector when the user selects a tool step
 * (sql/vector/gcs step_type), AND as a cross-tool efficiency strip below
 * the context summary card.
 */

import { Layers, Database } from 'lucide-react'
import type { TraceStep, TraceChunkItem } from '@/lib/trace/types'

// ── Helpers ──────────────────────────────────────────────────────────────────

function fmtTokens(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

function pct(part: number, total: number): number {
  if (total === 0) return 0
  return Math.round((part / total) * 100)
}

function classifyCgmNode(id: string): string {
  if (id.startsWith('PLN.')) return 'PLN'
  if (id.startsWith('HSE.')) return 'HSE'
  if (id.startsWith('SGN.')) return 'SGN'
  if (id.startsWith('YOG.')) return 'YOG'
  if (id.startsWith('NAK.')) return 'NAK'
  if (id.startsWith('SIG.')) return 'SIG'
  return 'OTHER'
}

// ── Per-tool sub-cards ───────────────────────────────────────────────────────

function VectorSearchCard({ items }: { items: TraceChunkItem[] }) {
  // Top-k score distribution
  const withScores = items.filter(i => typeof i.score === 'number')
  const scores = withScores.map(i => i.score!).sort((a, b) => b - a)
  const maxScore = scores[0] ?? 0
  const minScore = scores[scores.length - 1] ?? 0
  const avgScore = scores.length > 0 ? scores.reduce((s, x) => s + x, 0) / scores.length : 0

  // Doc type distribution
  const docTypeCounts = new Map<string, number>()
  for (const i of items) {
    const dt = i.doc_type ?? 'unknown'
    docTypeCounts.set(dt, (docTypeCounts.get(dt) ?? 0) + 1)
  }

  // Layer distribution
  const layerCounts = new Map<string, number>()
  for (const i of items) {
    layerCounts.set(i.layer, (layerCounts.get(i.layer) ?? 0) + 1)
  }

  return (
    <div className="space-y-2">
      {scores.length > 0 && (
        <div>
          <div className="text-[9px] font-bold uppercase tracking-[0.12em] text-[rgba(212,175,55,0.45)] mb-1">
            Score distribution
          </div>
          <div className="flex items-end gap-px h-7">
            {scores.slice(0, 10).map((s, i) => {
              const heightPct = maxScore > 0 ? (s / maxScore) * 100 : 0
              return (
                <div
                  key={i}
                  title={`rank ${i + 1}: ${s.toFixed(3)}`}
                  className="flex-1 bg-[rgba(120,210,160,0.5)] rounded-sm min-w-[3px]"
                  style={{ height: `${Math.max(8, heightPct)}%` }}
                />
              )
            })}
          </div>
          <div className="flex justify-between text-[9px] text-[rgba(212,175,55,0.4)] mt-0.5 font-mono">
            <span>min {minScore.toFixed(3)}</span>
            <span>avg {avgScore.toFixed(3)}</span>
            <span>max {maxScore.toFixed(3)}</span>
          </div>
        </div>
      )}

      {docTypeCounts.size > 0 && (
        <DistributionRow
          title="Doc type"
          entries={Array.from(docTypeCounts.entries()).map(([k, v]) => ({ key: k, count: v }))}
          accent="bg-[rgba(120,210,160,0.4)]"
        />
      )}

      {layerCounts.size > 0 && (
        <DistributionRow
          title="Layer"
          entries={Array.from(layerCounts.entries()).map(([k, v]) => ({ key: k, count: v }))}
          accent="bg-[rgba(190,150,240,0.4)]"
        />
      )}
    </div>
  )
}

function MsrSqlCard({ items }: { items: TraceChunkItem[] }) {
  // For msr_sql, items are MSR signals; we can infer signal-class from id pattern
  // (SIG.MSR.NNN) and show counts by source. Domain/strength/yoga breakdown
  // requires the SQL tool to emit those fields in TraceChunkItem (currently does
  // not). We surface what's present and degrade.
  const sourceCounts = new Map<string, number>()
  for (const i of items) {
    sourceCounts.set(i.source, (sourceCounts.get(i.source) ?? 0) + 1)
  }

  const totalTokens = items.reduce((s, i) => s + i.token_estimate, 0)

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-2">
        <Stat label="Signals" value={String(items.length)} />
        <Stat label="Tokens" value={fmtTokens(totalTokens)} />
        <Stat label="Avg/sig" value={items.length > 0 ? fmtTokens(Math.round(totalTokens / items.length)) : '—'} />
      </div>

      {sourceCounts.size > 1 && (
        <DistributionRow
          title="Source"
          entries={Array.from(sourceCounts.entries()).map(([k, v]) => ({ key: k, count: v }))}
          accent="bg-[rgba(140,190,240,0.4)]"
        />
      )}

      <div className="text-[9px] text-[rgba(212,175,55,0.35)] italic">
        Domain / strength / yoga breakdown surfaces when the SQL tool emits those fields in TraceChunkItem (BHISMA-B2+).
      </div>
    </div>
  )
}

function CgmGraphCard({ items }: { items: TraceChunkItem[] }) {
  // Classify items by CGM node type prefix
  const typeCounts = new Map<string, number>()
  for (const i of items) {
    const t = classifyCgmNode(i.id)
    typeCounts.set(t, (typeCounts.get(t) ?? 0) + 1)
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-2">
        <Stat label="Nodes" value={String(items.length)} />
        <Stat label="Types" value={String(typeCounts.size)} />
        <Stat label="Tokens" value={fmtTokens(items.reduce((s, i) => s + i.token_estimate, 0))} />
      </div>

      {typeCounts.size > 0 && (
        <DistributionRow
          title="Node type"
          entries={Array.from(typeCounts.entries()).map(([k, v]) => ({ key: k, count: v }))}
          accent="bg-[rgba(200,160,240,0.4)]"
        />
      )}

      <div className="text-[9px] text-[rgba(212,175,55,0.35)] italic">
        Edge type traversal + seed hit rate surface when graph_walk emits structured payload (BHISMA-B2+).
      </div>
    </div>
  )
}

function GenericToolCard({ items }: { items: TraceChunkItem[] }) {
  const sourceCounts = new Map<string, number>()
  const layerCounts = new Map<string, number>()
  for (const i of items) {
    sourceCounts.set(i.source, (sourceCounts.get(i.source) ?? 0) + 1)
    layerCounts.set(i.layer, (layerCounts.get(i.layer) ?? 0) + 1)
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <Stat label="Items" value={String(items.length)} />
        <Stat label="Tokens" value={fmtTokens(items.reduce((s, i) => s + i.token_estimate, 0))} />
      </div>
      {layerCounts.size > 0 && (
        <DistributionRow
          title="Layer"
          entries={Array.from(layerCounts.entries()).map(([k, v]) => ({ key: k, count: v }))}
          accent="bg-[rgba(190,150,240,0.4)]"
        />
      )}
    </div>
  )
}

// ── Building blocks ──────────────────────────────────────────────────────────

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-2 py-1 bg-[rgba(212,175,55,0.04)] border border-[rgba(212,175,55,0.10)]">
      <div className="text-[8px] uppercase tracking-[0.1em] text-[rgba(212,175,55,0.45)]">{label}</div>
      <div className="text-[12px] font-semibold text-[rgba(252,226,154,0.85)] tabular-nums">{value}</div>
    </div>
  )
}

function DistributionRow({
  title,
  entries,
  accent,
}: {
  title: string
  entries: Array<{ key: string; count: number }>
  accent: string
}) {
  const total = entries.reduce((s, e) => s + e.count, 0)
  const sorted = entries.slice().sort((a, b) => b.count - a.count)

  return (
    <div>
      <div className="text-[9px] font-bold uppercase tracking-[0.12em] text-[rgba(212,175,55,0.45)] mb-1">{title}</div>
      <div className="space-y-0.5">
        {sorted.map(({ key, count }) => (
          <div key={key} className="flex items-center gap-2">
            <span className="text-[10px] text-[rgba(252,226,154,0.7)] w-24 truncate font-mono">{key}</span>
            <div className="flex-1 h-1.5 bg-[rgba(212,175,55,0.06)] rounded-sm overflow-hidden">
              <div
                className={`h-full rounded-sm ${accent}`}
                style={{ width: `${pct(count, total)}%` }}
              />
            </div>
            <span className="text-[10px] text-[rgba(212,175,55,0.55)] w-12 text-right tabular-nums">
              {count} · {pct(count, total)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Per-step view (mounts in ContextInspector when a tool step is selected) ──

interface StepCardProps {
  step: TraceStep
}

// TODO(I.4): tool_execution_log does not yet carry per-tool quality score fields
// (relevance, coverage, token_efficiency). The scorecard below reads from
// step.payload.items (trace-side data) which gives score distribution for
// vector_search but not structured relevance/coverage/efficiency scores.
// To surface those, add score columns to tool_execution_log (migration required)
// and wire GET /api/audit/[query_id] to return them alongside payload items.
// Until then, the scorecard degrades to payload-derived stats (score dist,
// layer/doc-type breakdowns) and shows no structured quality metrics.
export function RetrievalScorecard({ step }: StepCardProps) {
  const items = step.payload.items ?? []
  if (items.length === 0) return null

  // Decide which sub-card to show based on step name + type
  const name = step.step_name.toLowerCase()
  let card: React.ReactNode
  if (name.includes('msr') || name === 'msr_sql') {
    card = <MsrSqlCard items={items} />
  } else if (name.includes('vector')) {
    card = <VectorSearchCard items={items} />
  } else if (name.includes('cgm') || name.includes('graph')) {
    card = <CgmGraphCard items={items} />
  } else {
    card = <GenericToolCard items={items} />
  }

  return (
    <div className="px-3 py-2 border-t border-[rgba(212,175,55,0.08)]">
      <div className="flex items-center gap-1.5 mb-2">
        <Database size={10} className="text-[rgba(212,175,55,0.5)]" />
        <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-[rgba(212,175,55,0.5)]">
          Retrieval scorecard
        </span>
      </div>
      {card}
    </div>
  )
}

// ── Cross-tool efficiency row (mounts in ContextInspector context summary) ───

interface EfficiencyProps {
  steps: TraceStep[]
}

export function RetrievalEfficiency({ steps }: EfficiencyProps) {
  // Sum tokens fetched from every tool step's payload.items
  const toolSteps = steps.filter(s =>
    s.step_type === 'sql' || s.step_type === 'vector' || s.step_type === 'gcs'
  )
  const tokensFetched = toolSteps.reduce((sum, step) => {
    const items = step.payload.items ?? []
    return sum + items.reduce((s, i) => s + i.token_estimate, 0)
  }, 0)

  // Tokens that actually made it into synthesis context = l1+l2 from context_assembly
  const ctxStep = steps.find(s => s.step_name === 'context_assembly')
  const tokensInSynthesis = (ctxStep?.payload.l1_tokens ?? 0) + (ctxStep?.payload.l2_tokens ?? 0)

  if (tokensFetched === 0 && tokensInSynthesis === 0) return null

  const efficiency = tokensFetched > 0
    ? Math.round((tokensInSynthesis / tokensFetched) * 100)
    : null

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 border-t border-[rgba(212,175,55,0.06)] bg-[rgba(212,175,55,0.02)]">
      <Layers size={10} className="text-[rgba(212,175,55,0.5)]" />
      <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-[rgba(212,175,55,0.5)]">
        Retrieval efficiency
      </span>
      <span className="text-[10px] text-[rgba(252,226,154,0.7)] ml-1 tabular-nums">
        {fmtTokens(tokensFetched)} fetched
      </span>
      <span className="text-[rgba(212,175,55,0.3)]">→</span>
      <span className="text-[10px] text-[rgba(252,226,154,0.7)] tabular-nums">
        {fmtTokens(tokensInSynthesis)} in synthesis
      </span>
      {efficiency != null && (
        <span className={`ml-auto text-[10px] font-semibold tabular-nums ${
          efficiency >= 60 ? 'text-[rgba(140,210,170,0.85)]' :
          efficiency >= 30 ? 'text-[rgba(244,209,96,0.85)]' :
                             'text-[rgba(240,170,100,0.85)]'
        }`}>
          {efficiency}%
        </span>
      )}
    </div>
  )
}
