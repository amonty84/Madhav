'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { JourneyStrip } from './JourneyStrip'
import { BriefPanel } from './BriefPanel'
import { InsightCards } from './InsightCards'
import { MirrorPairsTable } from './MirrorPairsTable'
import { PyramidStatusPanel } from './PyramidStatusPanel'
import type { MacroPhaseEntry, CurrentBrief, InsightCard, MirrorPair } from '@/lib/build/types'

interface LayerEntry {
  layer: string
  sublayer: string
  status: 'not_started' | 'in_progress' | 'complete'
}

interface Props {
  arc: MacroPhaseEntry[]
  activePhaseId: string
  brief: CurrentBrief | null
  insights: InsightCard[]
  mirrorPairs: MirrorPair[]
  layers: LayerEntry[]
}

export function BuildRightPane({ arc, activePhaseId, brief, insights, mirrorPairs, layers }: Props) {
  const [pyramidOpen, setPyramidOpen] = useState(false)

  return (
    <aside className="flex w-80 shrink-0 flex-col gap-4 overflow-y-auto border-l border-border p-4">
      <JourneyStrip arc={arc} activeId={activePhaseId} />
      <BriefPanel brief={brief} />
      {insights.length > 0 && <InsightCards insights={insights} />}
      <MirrorPairsTable pairs={mirrorPairs} />
      <div className="rounded-lg border border-border">
        <button
          type="button"
          onClick={() => setPyramidOpen(o => !o)}
          className="flex w-full items-center justify-between px-3 py-2 text-sm font-medium text-foreground"
        >
          Pyramid layers
          {pyramidOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
        {pyramidOpen && <PyramidStatusPanel layers={layers} />}
      </div>
    </aside>
  )
}
