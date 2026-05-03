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
import { writeToolExecutionLog } from '@/lib/db/monitoring-write'
import type { QueryPlan, ToolBundle, ToolBundleResult, RetrievalTool } from './types'

const TOOL_NAME = 'temporal'
const TOOL_VERSION = '1.1'
const NATIVE_ID = 'abhisek_mohanty'

async function callSidecar(endpoint: string, body: object): Promise<unknown> {
  const baseUrl = process.env.PYTHON_SIDECAR_URL
  if (!baseUrl) {
    throw new Error(
      'PYTHON_SIDECAR_URL env var not set — sidecar call to ' + endpoint + ' will fail'
    )
  }
  const url = `${baseUrl}${endpoint}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`Sidecar ${endpoint} returned ${res.status}`)
  return await res.json()
}

async function retrieve(plan: QueryPlan, params?: Record<string, unknown>): Promise<ToolBundle> {
  const start = Date.now()
  try {
    return await retrieveImpl(plan, params, start)
  } catch (err) {
    void writeToolExecutionLog({
      query_id: plan.query_plan_id,
      tool_name: TOOL_NAME,
      params_json: (params ?? null) as Record<string, unknown> | null,
      status: 'error',
      rows_returned: 0,
      latency_ms: Date.now() - start,
      token_estimate: 0,
      data_asset_id: 'EPHEMERIS',
      error_code: err instanceof Error ? err.message : String(err),
      served_from_cache: false,
      fallback_used: false,
    })
    throw err
  }
}

async function retrieveImpl(
  plan: QueryPlan,
  _params: Record<string, unknown> | undefined,
  start: number,
): Promise<ToolBundle> {
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

    // /ephemeris: range call when forward_looking + explicit window; fallback to single-date
    if (plan.forward_looking && plan.time_window?.start && plan.time_window?.end) {
      const ephData = await callSidecar('/ephemeris', {
        native_id: NATIVE_ID,
        start_date: plan.time_window.start,
        end_date: plan.time_window.end,
        planets: plan.planets?.length ? plan.planets : undefined,
      })
      results.push({
        content: JSON.stringify(ephData),
        source_canonical_id: 'TEMPORAL_DATA',
        source_version: '1.0',
        confidence: 1.0,
        significance: 0.8,
      })
    } else if (plan.forward_looking) {
      const ephemerisData = await callSidecar('/ephemeris', requestBody)
      results.push({
        content: JSON.stringify(ephemerisData),
        source_canonical_id: 'TEMPORAL_DATA',
        source_version: '1.0',
        confidence: 1.0,
        significance: 0.8,
      })
    }

    // /dasha_chain: when dasha context is requested or a specific time window is given
    if (plan.dasha_context_required || plan.time_window) {
      const chainDate = plan.time_window?.start ?? today
      const dashaData = await callSidecar('/dasha_chain', {
        native_id: NATIVE_ID,
        date: chainDate,
      })
      results.push({
        content: JSON.stringify(dashaData),
        source_canonical_id: 'TEMPORAL_DATA',
        source_version: '1.0',
        confidence: 1.0,
        significance: 0.95,
      })
    }

    // /sade_sati: when query asks about Sade Sati or Saturn transit phases
    if (plan.sade_sati_query) {
      const ssData = await callSidecar('/sade_sati', {
        native_id: NATIVE_ID,
        date: today,
      })
      results.push({
        content: JSON.stringify(ssData),
        source_canonical_id: 'TEMPORAL_DATA',
        source_version: '1.0',
        confidence: 1.0,
        significance: 0.85,
      })
    }

    // /eclipses: when query asks about eclipses, with a time window
    if (plan.eclipse_query && plan.time_window?.start && plan.time_window?.end) {
      const eclData = await callSidecar('/eclipses', {
        native_id: NATIVE_ID,
        start_date: plan.time_window.start,
        end_date: plan.time_window.end,
      })
      results.push({
        content: JSON.stringify(eclData),
        source_canonical_id: 'TEMPORAL_DATA',
        source_version: '1.0',
        confidence: 1.0,
        significance: 0.85,
      })
    }

    // /retrogrades: when query asks about retrograde stations
    if (plan.retrograde_query) {
      const oneYearOut = new Date(Date.now() + 365 * 86400000).toISOString().slice(0, 10)
      const retData = await callSidecar('/retrogrades', {
        native_id: NATIVE_ID,
        start_date: plan.time_window?.start ?? today,
        end_date: plan.time_window?.end ?? oneYearOut,
        planet: plan.retrograde_planet ?? undefined,
      })
      results.push({
        content: JSON.stringify(retData),
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

    void writeToolExecutionLog({
      query_id: plan.query_plan_id,
      tool_name: TOOL_NAME,
      params_json: warningBundle.invocation_params as Record<string, unknown>,
      status: 'error',
      rows_returned: 0,
      latency_ms,
      token_estimate: 0,
      data_asset_id: 'EPHEMERIS',
      error_code: err instanceof Error ? err.message : 'sidecar_unavailable',
      served_from_cache: false,
      fallback_used: false,
    })

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

  void writeToolExecutionLog({
    query_id: plan.query_plan_id,
    tool_name: TOOL_NAME,
    params_json: bundle.invocation_params as Record<string, unknown>,
    status: results.length === 0 ? 'zero_rows' : 'ok',
    rows_returned: results.length,
    latency_ms,
    token_estimate: Math.ceil(JSON.stringify(results).length / 4),
    data_asset_id: 'EPHEMERIS',
    error_code: null,
    served_from_cache: false,
    fallback_used: false,
  })

  return bundle
}

export const tool: RetrievalTool = {
  name: TOOL_NAME,
  version: TOOL_VERSION,
  retrieve,
}
