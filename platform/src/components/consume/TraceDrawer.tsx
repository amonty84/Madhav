'use client'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { TracePanelContent } from '@/components/trace/TracePanel'

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
        className="w-[65vw] min-w-[700px] max-w-[1100px] p-0 flex flex-col gap-0 bg-[#0d1117] border-l border-slate-800"
      >
        <SheetHeader className="px-4 py-2.5 border-b border-slate-800 bg-[#161b27] flex-shrink-0">
          <SheetTitle className="text-[13px] font-bold text-slate-100">
            Query Trace
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 min-h-0 overflow-hidden">
          <TracePanelContent queryId={queryId} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
