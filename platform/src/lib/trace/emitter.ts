/**
 * MARSYS-JIS Query Trace Panel — in-process event emitter
 * schema_version: 1.0
 *
 * Singleton EventEmitter keyed by query_id. Each pipeline step calls
 * emitStep(); the SSE endpoint subscribes. DB writes are fire-and-forget
 * and never block the query response path.
 *
 * NOTE: Correct for single-server deployment. For multi-instance Cloud Run,
 * swap to Redis pub/sub:
 *   publisher.publish(`trace:${queryId}`, JSON.stringify(event))
 *   subscriber.subscribe(`trace:${queryId}`, handler)
 */

import { EventEmitter } from 'events'
import type { TraceEvent } from './types'
import { writeTraceStep } from './writer'

class TraceEmitter extends EventEmitter {
  constructor() {
    super()
    // Allow one listener per open SSE connection without Node warning
    this.setMaxListeners(100)
  }

  /**
   * Emit a trace event to all live SSE subscribers for this query,
   * and persist the step to the database asynchronously.
   * This is intentionally fire-and-forget — no await.
   */
  emitStep(event: TraceEvent): void {
    // Skip persistence for the placeholder 'PENDING' query_id emitted
    // before classify() resolves (no real query_id yet).
    if (event.query_id !== 'PENDING' && event.step) {
      void writeTraceStep(event.step).catch(err =>
        console.error('[trace] DB write failed for step', event.step?.step_name, err)
      )
    }

    // Emit to live SSE subscribers (even PENDING, so frontend sees the start)
    this.emit(event.query_id, event)
  }

  subscribe(queryId: string, handler: (event: TraceEvent) => void): void {
    this.on(queryId, handler)
  }

  unsubscribe(queryId: string, handler: (event: TraceEvent) => void): void {
    this.off(queryId, handler)
  }
}

// Singleton: survive hot-reload in Next.js dev via globalThis
const globalForTrace = globalThis as unknown as { __traceEmitter?: TraceEmitter }
if (!globalForTrace.__traceEmitter) {
  globalForTrace.__traceEmitter = new TraceEmitter()
}
export const traceEmitter = globalForTrace.__traceEmitter
