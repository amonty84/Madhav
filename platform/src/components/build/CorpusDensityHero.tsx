import type { CorpusState } from '@/lib/build/types'

interface Props {
  corpus: CorpusState | undefined
}

function StatCard({
  label,
  value,
  sub,
  children,
}: {
  label: string
  value: string
  sub?: string
  children?: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3">
      <p className="bt-label">{label}</p>
      <div>
        <p className="bt-mega">{value}</p>
        {sub && <p className="bt-body text-muted-foreground mt-1">{sub}</p>}
      </div>
      {children}
    </div>
  )
}

function MiniBar({ items }: { items: { label: string; count: number; color: string }[] }) {
  const total = items.reduce((s, i) => s + i.count, 0)
  if (!total) return null
  return (
    <div className="space-y-1.5">
      {items.slice(0, 5).map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <div
            className="h-2 rounded-full"
            style={{ width: `${Math.round((item.count / total) * 100)}%`, minWidth: 4, background: item.color }}
          />
          <span className="bt-label shrink-0">
            {item.label.replace(/_/g, ' ')} {item.count.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  )
}

const DOC_COLORS = [
  '#3b82f6', '#8b5cf6', '#06b6d4', '#f59e0b',
  '#10b981', '#f97316', '#ec4899',
]

const EDGE_COLORS = [
  '#6366f1', '#14b8a6', '#f59e0b', '#ef4444',
  '#a855f7', '#22c55e', '#f97316',
]

export function CorpusDensityHero({ corpus }: Props) {
  if (!corpus) {
    return (
      <div className="rounded-xl border border-border bg-muted p-5 col-span-3">
        <p className="bt-body text-muted-foreground">Corpus state unavailable — run serializer to populate.</p>
      </div>
    )
  }

  const chunkItems = (corpus.chunks_by_doc_type ?? []).map((d, i) => ({
    label: d.doc_type,
    count: d.count,
    color: DOC_COLORS[i % DOC_COLORS.length],
  }))

  const edgeItems = (corpus.edge_classes ?? []).map((e, i) => ({
    label: e.class,
    count: e.count,
    color: EDGE_COLORS[i % EDGE_COLORS.length],
  }))

  const l3 = corpus.l3_coverage ?? []
  const l3Total = l3.length || corpus.l3_reports_current

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {/* Card A — Chunks */}
      <StatCard
        label="RAG corpus"
        value={corpus.rag_chunks.toLocaleString()}
        sub="chunks ingested"
      >
        <MiniBar items={chunkItems} />
      </StatCard>

      {/* Card B — Graph */}
      <StatCard
        label="Knowledge graph"
        value={`${corpus.rag_graph_nodes.toLocaleString()} / ${corpus.rag_graph_edges.toLocaleString()}`}
        sub="nodes / edges"
      >
        <MiniBar items={edgeItems} />
      </StatCard>

      {/* Card C — Coverage */}
      <StatCard
        label="L3 coverage"
        value={`${corpus.l3_reports_current} / 9`}
        sub={`domains · ${corpus.msr_signals} MSR signals · ${corpus.cgm_nodes} CGM nodes`}
      >
        <div className="flex flex-wrap gap-1.5">
          {l3.length > 0
            ? l3.map((d) => (
                <span
                  key={d.domain_id}
                  className={`rounded px-2 py-0.5 bt-label ${
                    d.status === 'current'
                      ? 'bg-[oklch(0.93_0.05_145)] text-[oklch(0.40_0.12_145)] dark:bg-[oklch(0.25_0.05_145)] dark:text-[oklch(0.78_0.13_145)]'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {d.domain_id.replace(/_/g, ' ')}
                </span>
              ))
            : Array.from({ length: l3Total }).map((_, i) => (
                <span
                  key={i}
                  className="rounded px-2 py-0.5 bt-label bg-[oklch(0.93_0.05_145)] text-[oklch(0.40_0.12_145)]"
                >
                  L3.{i + 1}
                </span>
              ))}
        </div>
      </StatCard>
    </div>
  )
}
