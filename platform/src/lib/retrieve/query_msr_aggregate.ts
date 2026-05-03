/**
 * MARSYS-JIS Stream C — Tool C.7: query_msr_aggregate
 *
 * Placeholder for cross-native aggregate queries. Multi-native deployment
 * is not yet built. Returns a structured "not deployed" status response
 * immediately, without any I/O.
 */

import crypto from 'crypto'
import { writeToolExecutionLog } from '@/lib/db/monitoring-write'
import type { QueryPlan, ToolBundle, RetrievalTool } from './types'

const TOOL_NAME = 'query_msr_aggregate'
const TOOL_VERSION = '1.0'

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
      data_asset_id: 'MSR_v3_0',
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
  const bundle: ToolBundle = {
    tool_bundle_id: crypto.randomUUID(),
    tool_name: TOOL_NAME,
    tool_version: TOOL_VERSION,
    invocation_params: plan as unknown as object,
    results: [
      {
        content: JSON.stringify({
          status: 'multi_native_not_deployed',
          message:
            'Cross-native aggregate queries require multi-native deployment. The architecture supports this query class; deployment is pending a future phase.',
          query_class: plan.query_class,
        }),
        source_canonical_id: 'SYSTEM',
        source_version: '1.0',
        confidence: 1.0,
        significance: 1.0,
        signal_id: 'multi_native_not_deployed',
      },
    ],
    served_from_cache: false,
    latency_ms: Date.now() - start,
    result_hash: 'sha256:placeholder_not_deployed',
    schema_version: '1.0',
  }

  void writeToolExecutionLog({
    query_id: plan.query_plan_id,
    tool_name: TOOL_NAME,
    params_json: bundle.invocation_params as Record<string, unknown>,
    status: 'zero_rows',
    rows_returned: 0,
    latency_ms: bundle.latency_ms,
    token_estimate: 0,
    data_asset_id: 'MSR_v3_0',
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
