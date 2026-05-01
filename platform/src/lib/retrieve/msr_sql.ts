/**
 * MARSYS-JIS Stream C — Tool C.1: msr_sql
 *
 * Retrieves MSR signals from Cloud SQL `msr_signals` table, filtered by the
 * incoming QueryPlan. Returns a validated ToolBundle.
 */

import crypto from 'crypto'
import type { MsrSignal } from '@/lib/db/types'
import { getStorageClient } from '@/lib/storage'
import { validate } from '@/lib/schemas'
import { telemetry } from '@/lib/telemetry'
import type { QueryPlan, ToolBundle, ToolBundleResult, RetrievalTool, MsrSqlInput } from './types'

const TOOL_NAME = 'msr_sql'
const TOOL_VERSION = '1.0.0'
const DEFAULT_NATIVE_ID = 'abhisek_mohanty'
const DEFAULT_CONFIDENCE_FLOOR = 0.6

const SQL = `
  SELECT * FROM msr_signals
  WHERE native_id = $1
    AND ($2::varchar[] IS NULL OR domain = ANY($2::varchar[]))
    AND ($3::varchar[] IS NULL OR planet = ANY($3::varchar[]))
    AND ($4::boolean IS NULL OR is_forward_looking = $4)
    AND confidence >= $5
    AND ($6::text[] IS NULL OR signal_type = ANY($6::text[]))
    AND ($7::text[] IS NULL OR temporal_activation = ANY($7::text[]))
    AND ($8::text[] IS NULL OR valence = ANY($8::text[]))
    AND ($9::text[] IS NULL OR entities_involved ?| $9::text[])
  ORDER BY (confidence * significance) DESC
  LIMIT 100
`.trim()

async function retrieve(plan: QueryPlan, params?: Record<string, unknown>): Promise<ToolBundle> {
  const start = Date.now()

  const nativeId = (params?.native_id as string | undefined) ?? DEFAULT_NATIVE_ID
  const confidenceFloor =
    (params?.confidence_floor as number | undefined) ?? DEFAULT_CONFIDENCE_FLOOR

  // Build nullable array params — pass null when the filter is unused so that
  // the SQL `IS NULL OR ... ANY(...)` clause becomes a no-op.
  const domainFilter: string[] | null = plan.domains.length > 0 ? plan.domains : null
  const planetFilter: string[] | null =
    plan.planets && plan.planets.length > 0 ? plan.planets : null
  const forwardLookingFilter: boolean | null = plan.forward_looking ? true : null

  // New signal-property filters (from MsrSqlInput; all optional, backward-compatible)
  const msrInput = params as MsrSqlInput | undefined
  const signalTypeFilter: string[] | null =
    msrInput?.signal_type && msrInput.signal_type.length > 0 ? msrInput.signal_type : null
  const temporalFilter: string[] | null =
    msrInput?.temporal_activation && msrInput.temporal_activation.length > 0
      ? msrInput.temporal_activation
      : null
  const valenceFilter: string[] | null =
    msrInput?.valence && msrInput.valence.length > 0 ? msrInput.valence : null
  const entitiesFilter: string[] | null =
    msrInput?.entities_involved_any && msrInput.entities_involved_any.length > 0
      ? msrInput.entities_involved_any
      : null

  const { rows } = await getStorageClient().query<MsrSignal>(SQL, [
    nativeId,
    domainFilter,
    planetFilter,
    forwardLookingFilter,
    confidenceFloor,
    signalTypeFilter,
    temporalFilter,
    valenceFilter,
    entitiesFilter,
  ])

  // pg returns NUMERIC/DECIMAL columns as strings by default; coerce to number for schema validation
  const results: ToolBundleResult[] = rows.map(signal => ({
    content: signal.claim_text,
    source_canonical_id: 'MSR',
    source_version: signal.source_version,
    confidence: Number(signal.confidence),
    significance: Number(signal.significance),
    signal_id: signal.signal_id,
  }))

  const result_hash =
    'sha256:' +
    crypto
      .createHash('sha256')
      .update(JSON.stringify(results.map(r => r.signal_id ?? r.content.slice(0, 50)).sort()))
      .digest('hex')

  const latency_ms = Date.now() - start

  const bundle: ToolBundle = {
    tool_bundle_id: crypto.randomUUID(),
    tool_name: TOOL_NAME,
    tool_version: TOOL_VERSION,
    invocation_params: {
      native_id: nativeId,
      domains: plan.domains,
      planets: plan.planets ?? [],
      forward_looking: plan.forward_looking,
      confidence_floor: confidenceFloor,
      signal_type: signalTypeFilter,
      temporal_activation: temporalFilter,
      valence: valenceFilter,
      entities_involved_any: entitiesFilter,
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
      `msr_sql produced invalid ToolBundle: ${JSON.stringify(validation.errors)}`
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
