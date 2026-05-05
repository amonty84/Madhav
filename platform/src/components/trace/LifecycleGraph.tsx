'use client'

import type { TraceDocument } from '@/lib/admin/trace_assembler'
import { ClassifyNode } from './lifecycle/ClassifyNode'
import { PlanNode } from './lifecycle/PlanNode'
import { FetchNode } from './lifecycle/FetchNode'
import { ContextAssemblyNode } from './lifecycle/ContextAssemblyNode'
import { SynthesisNode } from './lifecycle/SynthesisNode'
import { EdgeConnector } from './lifecycle/EdgeConnector'

interface LifecycleGraphProps {
  trace: TraceDocument
  selectedStepId: string
  onSelectStep: (stepId: string) => void
  searchFilter?: string
}

function matchesFilter(stepId: string, stepType: string, filter: string): boolean {
  if (!filter) return true
  const q = filter.toLowerCase()
  return stepId.toLowerCase().includes(q) || stepType.toLowerCase().includes(q)
}

function nodeOpacity(matches: boolean): string {
  return matches ? '' : 'opacity-20 pointer-events-none'
}

export function LifecycleGraph({
  trace,
  selectedStepId,
  onSelectStep,
  searchFilter = '',
}: LifecycleGraphProps) {
  const hasFetches = trace.fetches.length > 0
  const hasFilter = searchFilter.length > 0

  const classifyMatch = matchesFilter('classify', 'classify', searchFilter)
  const planMatch = matchesFilter('plan', 'plan', searchFilter)
  const contextMatch = matchesFilter('context_assembly', 'context_assembly', searchFilter)
  const synthesisMatch = matchesFilter('synthesis', 'synthesis', searchFilter)

  return (
    <div className="p-3 space-y-0" data-testid="lifecycle-graph">
      <div className={hasFilter ? nodeOpacity(classifyMatch) : ''}>
        <ClassifyNode
          trace={trace}
          selected={selectedStepId === 'classify'}
          onSelect={() => onSelectStep('classify')}
        />
      </div>

      <EdgeConnector />

      <div className={hasFilter ? nodeOpacity(planMatch) : ''}>
        <PlanNode
          trace={trace}
          selected={selectedStepId === 'plan'}
          onSelect={() => onSelectStep('plan')}
        />
      </div>

      {hasFetches && (
        <>
          <EdgeConnector fanOut />
          <div className="flex flex-wrap gap-2">
            {trace.fetches.map((fetch) => {
              const fetchMatch = matchesFilter(fetch.bundle, 'fetch', searchFilter)
              return (
                <div
                  key={fetch.bundle}
                  className={`flex-1 min-w-[140px] ${hasFilter ? nodeOpacity(fetchMatch) : ''}`}
                >
                  <FetchNode
                    fetch={fetch}
                    selected={selectedStepId === fetch.bundle}
                    onSelect={() => onSelectStep(fetch.bundle)}
                  />
                </div>
              )
            })}
          </div>
          <EdgeConnector fanIn />
        </>
      )}

      <div className={hasFilter ? nodeOpacity(contextMatch) : ''}>
        <ContextAssemblyNode
          trace={trace}
          selected={selectedStepId === 'context_assembly'}
          onSelect={() => onSelectStep('context_assembly')}
        />
      </div>

      <EdgeConnector />

      <div className={hasFilter ? nodeOpacity(synthesisMatch) : ''}>
        <SynthesisNode
          trace={trace}
          selected={selectedStepId === 'synthesis'}
          onSelect={() => onSelectStep('synthesis')}
        />
      </div>
    </div>
  )
}
