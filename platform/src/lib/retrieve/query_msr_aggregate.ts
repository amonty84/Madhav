/**
 * MARSYS-JIS Stream C — Tool C.7: query_msr_aggregate
 *
 * Placeholder for cross-native aggregate queries. Multi-native deployment
 * is not yet built. Returns a structured "not deployed" status response
 * immediately, without any I/O.
 */

import crypto from 'crypto'
import type { QueryPlan, ToolBundle, RetrievalTool } from './types'

const TOOL_NAME = 'query_msr_aggregate'
const TOOL_VERSION = '1.0'

async function retrieve(plan: QueryPlan, _params?: Record<string, unknown>): Promise<ToolBundle> {
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
    latency_ms: 0,
    result_hash: 'sha256:placeholder_not_deployed',
    schema_version: '1.0',
  }

  return bundle
}

export const tool: RetrievalTool = {
  name: TOOL_NAME,
  version: TOOL_VERSION,
  retrieve,
}
