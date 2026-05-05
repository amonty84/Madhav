import { Suspense } from 'react'
import { TraceModal } from '@/components/trace/TraceModal'

export default function TracePage({ params }: { params: { query_id: string } }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <Suspense fallback={
        <div className="flex items-center gap-2 text-[rgba(212,175,55,0.6)] text-sm">
          <span className="animate-spin">◎</span> Loading trace…
        </div>
      }>
        <TraceModal queryId={params.query_id} />
      </Suspense>
    </div>
  )
}
