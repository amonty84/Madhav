'use client'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useTraceStream } from '@/hooks/useTraceStream'
import { TracePanelContent } from '@/components/trace/TracePanel'

interface Props {
  queryId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TraceDrawer({ queryId, open, onOpenChange }: Props) {
  // Only subscribe when the drawer is open to avoid stale SSE connections.
  const { steps, done, error, planningActive, planningModel, toolsSelected, queryIntentSummary } =
    useTraceStream(open ? queryId : null, false)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton={true}
        className="w-[65vw] min-w-[700px] max-w-[1100px] p-0 flex flex-col gap-0 bg-brand-ink border-l border-[color-mix(in_oklch,var(--brand-gold)_12%,transparent)]"
      >
        <SheetHeader className="px-4 py-2.5 border-b border-[color-mix(in_oklch,var(--brand-gold)_12%,transparent)] bg-[color-mix(in_oklch,var(--brand-ink)_85%,var(--brand-gold)_15%)] flex-shrink-0">
          <SheetTitle className="text-[13px] font-bold text-brand-gold-cream">
            Query Trace
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 min-h-0 overflow-hidden">
          <TracePanelContent
            queryId={queryId}
            steps={steps}
            done={done}
            error={error}
            planningActive={planningActive}
            planningModel={planningModel}
            toolsSelected={toolsSelected}
            queryIntentSummary={queryIntentSummary}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}
