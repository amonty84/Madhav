'use client'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { TracePanelContent } from '@/components/trace/TracePanel'
import { Zap } from 'lucide-react'

interface Props {
  queryId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TraceDrawer({ queryId, open, onOpenChange }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton={true}
        className="w-[65vw] min-w-[700px] max-w-[1100px] p-0 flex flex-col gap-0 bg-[rgba(8,5,2,0.97)] border-l border-[rgba(212,175,55,0.15)]"
      >
        <SheetHeader className="flex-shrink-0 border-b border-[rgba(212,175,55,0.12)] bg-[rgba(13,10,5,0.6)] px-5 py-3">
          <div className="flex items-center gap-2.5">
            <Zap className="size-3.5 text-[#d4af37] opacity-75" />
            <SheetTitle className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[rgba(212,175,55,0.65)]">
              Query Trace
            </SheetTitle>
          </div>
        </SheetHeader>
        <div className="flex-1 min-h-0 overflow-hidden">
          <TracePanelContent queryId={queryId} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
