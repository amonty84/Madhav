/**
 * MARSYS-JIS Stream C — Tool C.6: temporal
 *
 * Calls the Python sidecar HTTP endpoints to retrieve current transit and
 * ephemeris data for the native. Returns a validated ToolBundle.
 *
 * Gracefully degrades when the sidecar is unavailable.
 */

import crypto from 'crypto'
import { validate } from '@/lib/schemas'
import { telemetry } from '@/lib/telemetry'
import type { QueryPlan, ToolBundle, ToolBundleResult, RetrievalTool } from './types'

const TOOL_NAME = 'temporal'
const TOOL_VERSION = '1.0'
const NATIVE_ID = 'abhisek_mohanty'

async function callSidecar(endpoint: string, body: object): Promise<unknown> {
  const url = `${process.env.PYTHON_SIDECAR_URL}${endpoint}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`Sidecar ${endpoint} returned ${res.status}`)
  return await res.json()
}

async function retrieve(plan: QueryPlan, _params?: Record<string, unknown>): Promise<ToolBundle> {
  const start = Date.now()
  const today = new Date().toISOString().slice(0, 10)
  const requestBody = { native_id: NATIVE_ID, date: today }

  const results: ToolBundleResult[] = []

  try {
    // Always call /transits
    const transitsData = await callSidecar('/transits', requestBody)
    results.push({
      content: JSON.stringify(transitsData),
      source_canonical_id: 'TEMPORAL_DATA',
      source_version: '1.0',
      confidence: 1.0,
      significance: 0.8,
    })

    // Also call /ephemeris when forward_looking is true
    if (plan.forward_looking) {
      const ephemerisData = await callSidecar('/ephemeris', requestBody)
      results.push({
        content: JSON.stringify(ephemerisData),
        source_canonical_id: 'TEMPORAL_DATA',
        source_version: '1.0',
        confidence: 1.0,
        significance: 0.8,
      })
    }
  } catch (err) {
    telemetry.recordLatency(TOOL_NAME, 'retrieve_error', Date.now() - start)
    // Graceful degradation: return a warning result instead of throwing
    const latency_ms = Date.now() - start
    const warningBundle: ToolBundle = {
      tool_bundle_id: crypto.randomUUID(),
      tool_name: TOOL_NAME,
      tool_version: TOOL_VERSION,
      invocation_params: {
        native_id: NATIVE_ID,
        date: today,
        forward_looking: plan.forward_looking,
        dasha_context_required: plan.dasha_context_required ?? false,
      },
      results: [
        {
          content: `Temporal data unavailable: sidecar not responding`,
          source_canonical_id: 'TEMPORAL_DATA',
          source_version: '1.0',
          confidence: 0,
          significance: 0,
        },
      ],
      served_from_cache: false,
      latency_ms,
      result_hash:
        'sha256:' +
        crypto.createHash('sha256').update('sidecar_unavailable').digest('hex'),
      schema_version: '1.0',
    }

    const validation = validate('tool_bundle', warningBundle)
    if (!validation.valid) {
      throw new Error(
        `temporal produced invalid warning ToolBundle: ${JSON.stringify(validation.errors)}`
      )
    }

    return warningBundle
  }

  const result_hash =
    'sha256:' +
    crypto
      .createHash('sha256')
      .update(JSON.stringify(results.map(r => r.content.slice(0, 50))))
      .digest('hex')

  const latency_ms = Date.now() - start

  const bundle: ToolBundle = {
    tool_bundle_id: crypto.randomUUID(),
    tool_name: TOOL_NAME,
    tool_version: TOOL_VERSION,
    invocation_params: {
      native_id: NATIVE_ID,
      date: today,
      forward_looking: plan.forward_looking,
      dasha_context_required: plan.dasha_context_required ?? false,
    },
    results,
    served_from_cache: false,
    latency_ms,
    result_hash,
    schema_version: '1.0',
  }

  const validation = validate('tool_bundle', bundle)
  if (!validation.valid) {
    throw new Error(
      `temporal produced invalid ToolBundle: ${JSON.stringify(validation.errors)}`
    )
  }

  telemetry.recordLatency(TOOL_NAME, 'retrieve', latency_ms)

  return bundle
}

export const tool: RetrievalTool = {
  name: TOOL_NAME,
  version: TOOL_VERSION,
  retrieve,
}
