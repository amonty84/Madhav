import type { TraceDocument } from './trace_assembler'

export async function fetchTrace(queryId: string): Promise<TraceDocument> {
  const res = await fetch(`/api/admin/trace/${queryId}`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`Trace fetch failed: ${res.status}`)
  return res.json() as Promise<TraceDocument>
}
