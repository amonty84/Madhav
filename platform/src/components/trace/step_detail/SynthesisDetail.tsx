'use client'

import type { TraceDocument } from '@/lib/admin/trace_assembler'
import { Section } from './Section'

interface SynthesisDetailProps {
  trace: TraceDocument
}

interface ScorecardData {
  composite_score?: number | null
  citation_density?: number | null
  failures?: unknown
}

function ScoreDot({ value, thresholds }: { value: number | null; thresholds: [number, number] }) {
  if (value === null) return <span className="text-zinc-600">—</span>
  if (value >= thresholds[1]) return <span className="text-emerald-400">●</span>
  if (value >= thresholds[0]) return <span className="text-amber-400">●</span>
  return <span className="text-red-400">●</span>
}

export function SynthesisDetail({ trace }: SynthesisDetailProps) {
  const synth = trace.synthesis
  const scorecard = synth?.scorecard as ScorecardData | null | undefined

  return (
    <div className="space-y-6" data-testid="synthesis-detail">
      <Section title="Input">
        <div className="text-xs text-zinc-300 space-y-1">
          <p><span className="text-zinc-500">model: </span>{synth?.model ?? '—'}</p>
          <p><span className="text-zinc-500">latency: </span>
            {synth?.latency_ms !== null && synth?.latency_ms !== undefined ? `${synth.latency_ms}ms` : '—'}
          </p>
        </div>
      </Section>

      <Section title="Decision">
        <div className="text-xs text-zinc-300 space-y-1">
          <p><span className="text-zinc-500">input tokens: </span>{synth?.input_tokens ?? '—'}</p>
          <p><span className="text-zinc-500">output tokens: </span>{synth?.output_tokens ?? '—'}</p>
        </div>
      </Section>

      <Section title="Output">
        {scorecard ? (
          <table className="w-full text-xs">
            <tbody>
              <tr className="border-b border-zinc-800/40">
                <td className="py-1.5 w-6">
                  <ScoreDot value={scorecard.composite_score ?? null} thresholds={[0.5, 0.75]} />
                </td>
                <td className="py-1.5 text-zinc-300">Composite score</td>
                <td className="py-1.5 text-right font-mono text-zinc-200">
                  {scorecard.composite_score != null ? scorecard.composite_score.toFixed(3) : '—'}
                </td>
              </tr>
              <tr className="border-b border-zinc-800/40">
                <td className="py-1.5">
                  <ScoreDot value={scorecard.citation_density ?? null} thresholds={[0.4, 0.7]} />
                </td>
                <td className="py-1.5 text-zinc-300">Citation density</td>
                <td className="py-1.5 text-right font-mono text-zinc-200">
                  {scorecard.citation_density != null ? scorecard.citation_density.toFixed(3) : '—'}
                </td>
              </tr>
              <tr className="border-b border-zinc-800/40">
                <td className="py-1.5">
                  {Array.isArray(scorecard.failures) && scorecard.failures.length > 0
                    ? <span className="text-red-400">●</span>
                    : <span className="text-emerald-400">●</span>}
                </td>
                <td className="py-1.5 text-zinc-300">Failures</td>
                <td className="py-1.5 text-right font-mono text-zinc-200">
                  {Array.isArray(scorecard.failures) ? scorecard.failures.length : 0}
                </td>
              </tr>
              <tr className="border-b border-zinc-800/40">
                <td className="py-1.5">
                  <ScoreDot value={synth?.input_tokens ?? null} thresholds={[1000, 5000]} />
                </td>
                <td className="py-1.5 text-zinc-300">Input tokens</td>
                <td className="py-1.5 text-right font-mono text-zinc-200">{synth?.input_tokens ?? '—'}</td>
              </tr>
              <tr>
                <td className="py-1.5">
                  <ScoreDot value={synth?.output_tokens ?? null} thresholds={[100, 500]} />
                </td>
                <td className="py-1.5 text-zinc-300">Output tokens</td>
                <td className="py-1.5 text-right font-mono text-zinc-200">{synth?.output_tokens ?? '—'}</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p className="text-xs text-zinc-500">No scorecard data</p>
        )}
      </Section>
    </div>
  )
}
