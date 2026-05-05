'use client'

import { useState } from 'react'
import type { TraceDocument } from '@/lib/admin/trace_assembler'
import { Section } from './Section'
import { RawPayloadDialog } from '../RawPayloadDialog'

interface PlanDetailProps {
  trace: TraceDocument
}

export function PlanDetail({ trace }: PlanDetailProps) {
  const plan = trace.plan
  const [showRaw, setShowRaw] = useState(false)

  return (
    <div className="space-y-6" data-testid="plan-detail">
      <Section title="Input">
        <div className="text-xs text-zinc-300 space-y-1">
          <p><span className="text-zinc-500">classification: </span>{trace.query.type ?? '—'}</p>
          <p>
            <span className="text-zinc-500">available bundles: </span>
            {plan ? plan.included_bundles.length + plan.excluded_bundles.length : '—'}
          </p>
        </div>
      </Section>

      <Section title="Decision">
        {plan ? (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] text-emerald-400 font-semibold mb-1.5">INCLUDED</p>
              <div className="space-y-1">
                {plan.included_bundles.map((b, i) => (
                  <div key={i} className="text-xs">
                    <p className="text-zinc-200">{b.name}</p>
                    {b.rationale && <p className="text-zinc-500 text-[10px]">{b.rationale}</p>}
                  </div>
                ))}
                {plan.included_bundles.length === 0 && (
                  <p className="text-xs text-zinc-500">none</p>
                )}
              </div>
            </div>
            <div>
              <p className="text-[10px] text-zinc-500 font-semibold mb-1.5">EXCLUDED</p>
              <div className="space-y-1">
                {plan.excluded_bundles.map((b, i) => (
                  <div key={i} className="text-xs">
                    <p className="text-zinc-400">{b.name}</p>
                    {b.rationale && <p className="text-zinc-500 text-[10px]">{b.rationale}</p>}
                  </div>
                ))}
                {plan.excluded_bundles.length === 0 && (
                  <p className="text-xs text-zinc-500">none</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-xs text-zinc-500">No plan data</p>
        )}
      </Section>

      <Section title="Output">
        {plan?.plan_json ? (
          <div>
            <pre className="text-xs text-zinc-300 font-mono bg-[oklch(0.08_0.01_70)] rounded-lg p-3 max-h-[300px] overflow-y-auto whitespace-pre-wrap break-words">
              {JSON.stringify(plan.plan_json, null, 2)}
            </pre>
            <button
              onClick={() => setShowRaw(true)}
              className="mt-2 text-xs text-zinc-500 hover:text-zinc-300"
            >
              View raw
            </button>
          </div>
        ) : (
          <p className="text-xs text-zinc-500">No plan JSON</p>
        )}
      </Section>

      {showRaw && (
        <RawPayloadDialog
          title="Plan JSON"
          payload={plan?.plan_json}
          onClose={() => setShowRaw(false)}
        />
      )}
    </div>
  )
}
