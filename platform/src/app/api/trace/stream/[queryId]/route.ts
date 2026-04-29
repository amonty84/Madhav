/**
 * MARSYS-JIS Query Trace Panel — SSE streaming endpoint
 *
 * GET /api/trace/stream/[queryId]
 *   Live mode:       streams TraceEvents from the in-process emitter as they arrive.
 *   Historical mode: replays stored steps from query_trace_steps (header x-trace-mode: historical).
 *
 * Auth: super_admin only (same pattern as /api/audit/*).
 * Sends a 'done' sentinel event when the pipeline completes or all stored steps are replayed.
 */

import { requireSuperAdmin } from '@/lib/auth/access-control'
import { NextResponse } from 'next/server'
import { traceEmitter } from '@/lib/trace/emitter'
import { fetchTraceSteps } from '@/lib/trace/writer'
import type { TraceEvent } from '@/lib/trace/types'

export const dynamic = 'force-dynamic'
export const maxDuration = 120

export async function GET(
  request: Request,
  { params }: { params: Promise<{ queryId: string }> }
) {
  const auth = await requireSuperAdmin()
  if (auth instanceof NextResponse) return auth

  const { queryId } = await params
  if (!queryId) {
    return new Response('Missing queryId', { status: 400 })
  }

  const encoder = new TextEncoder()
  const encode = (event: TraceEvent) =>
    encoder.encode(`data: ${JSON.stringify(event)}\n\n`)

  const isHistorical = request.headers.get('x-trace-mode') === 'historical'

  if (isHistorical) {
    // Replay stored steps synchronously as a one-shot stream
    const steps = await fetchTraceSteps(queryId)
    const stream = new ReadableStream({
      start(controller) {
        for (const step of steps) {
          controller.enqueue(encode({ event: 'step_done', query_id: queryId, step }))
        }
        controller.enqueue(encode({ event: 'done', query_id: queryId }))
        controller.close()
      },
    })
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no',   // prevent nginx/LB buffering
      },
    })
  }

  // Live mode: subscribe to in-process EventEmitter
  let cleanup: ((e: TraceEvent) => void) | null = null

  const stream = new ReadableStream({
    start(controller) {
      const handler = (event: TraceEvent) => {
        try {
          controller.enqueue(encode(event))
          if (event.event === 'done') {
            traceEmitter.unsubscribe(queryId, handler)
            controller.close()
          }
        } catch {
          // Client disconnected — clean up silently
          traceEmitter.unsubscribe(queryId, handler)
        }
      }
      cleanup = handler
      traceEmitter.subscribe(queryId, handler)
    },
    cancel() {
      if (cleanup) {
        traceEmitter.unsubscribe(queryId, cleanup)
        cleanup = null
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  })
}
