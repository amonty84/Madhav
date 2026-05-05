'use client'

import type { TraceDocument } from '@/lib/admin/trace_assembler'
import { Section } from './Section'

interface ClassifyDetailProps {
  trace: TraceDocument
}

export function ClassifyDetail({ trace }: ClassifyDetailProps) {
  const classify = trace.classify
  const queryText = trace.query.text ?? ''

  return (
    <div className="space-y-6" data-testid="classify-detail">
      <Section title="Input">
        <pre className="text-xs text-zinc-300 font-mono bg-[oklch(0.08_0.01_70)] rounded-lg p-3 whitespace-pre-wrap break-words">
          {queryText || <span className="text-zinc-500 italic">no query text</span>}
        </pre>
      </Section>

      <Section title="Decision">
        {classify && classify.alternatives.length > 0 ? (
          <div className="space-y-1.5">
            {classify.alternatives.map((alt, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 p-2 rounded border ${
                  i === 0
                    ? 'border-[rgba(212,175,55,0.4)] bg-[rgba(212,175,55,0.05)] border-l-4 border-l-[#d4af37]'
                    : 'border-zinc-800'
                }`}
                data-testid={`classify-alt-${i}`}
              >
                <span className="text-[10px] text-zinc-500 w-4">{i + 1}</span>
                <span className="text-xs text-zinc-200 w-28 shrink-0">{alt.type}</span>
                <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#d4af37] rounded-full"
                    style={{ width: `${(alt.confidence * 100).toFixed(0)}%` }}
                  />
                </div>
                <span className="text-xs text-zinc-400 w-10 text-right">
                  {(alt.confidence * 100).toFixed(0)}%
                </span>
                {alt.rationale && (
                  <span className="text-xs text-zinc-500 truncate max-w-[200px]" title={alt.rationale}>
                    {alt.rationale}
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-zinc-500">No alternatives recorded</p>
        )}
      </Section>

      <Section title="Output">
        <div className="text-xs text-zinc-300 space-y-1">
          <p>
            <span className="text-zinc-500">type: </span>
            <span className="text-[#d4af37]">{trace.query.type ?? '—'}</span>
          </p>
          <p>
            <span className="text-zinc-500">confidence: </span>
            {classify?.alternatives[0]?.confidence?.toFixed(3) ?? '—'}
          </p>
          {classify?.decision_reasoning && (
            <p className="mt-2 text-zinc-400 text-xs">{classify.decision_reasoning}</p>
          )}
        </div>
      </Section>
    </div>
  )
}
