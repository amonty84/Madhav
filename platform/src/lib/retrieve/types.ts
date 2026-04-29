/**
 * MARSYS-JIS Stream C — Retrieval layer shared types
 * schema_version: 1.0
 */

export interface QueryPlan {
  query_plan_id: string
  query_text: string
  query_class:
    | 'factual'
    | 'interpretive'
    | 'predictive'
    | 'cross_domain'
    | 'discovery'
    | 'holistic'
    | 'remedial'
    | 'cross_native'
  domains: string[]
  forward_looking: boolean
  audience_tier: 'super_admin' | 'acharya_reviewer' | 'client' | 'public_redacted'
  tools_authorized: string[]
  history_mode: 'synthesized' | 'research'
  panel_mode: boolean
  expected_output_shape:
    | 'single_answer'
    | 'three_interpretation'
    | 'time_indexed_prediction'
    | 'structured_data'
  manifest_fingerprint: string
  schema_version: '1.0'
  planets?: string[]
  houses?: number[]
  dasha_context_required?: boolean
  graph_seed_hints?: string[]
  graph_traversal_depth?: number
  bundle_directives?: {
    floor_overrides?: string[]
    conditional_overrides?: object
  }
  adjudicator_model_id?: string
  router_confidence?: number
  router_model_id?: string
}

export interface ToolBundleResult {
  content: string
  source_canonical_id?: string
  source_version?: string
  confidence?: number
  significance?: number
  signal_id?: string
}

export interface ToolBundle {
  tool_bundle_id: string // uuid
  tool_name: string
  tool_version: string
  invocation_params: object
  results: ToolBundleResult[]
  served_from_cache: boolean
  cache_key?: string  // omit when no cache is in play; schema treats as optional string
  latency_ms: number
  result_hash: string // 'sha256:' + hex
  schema_version: '1.0'
}

export interface RetrievalTool {
  name: string
  version: string
  retrieve(plan: QueryPlan, params?: Record<string, unknown>): Promise<ToolBundle>
  secondary?: boolean  // extension — mark as secondary in registry
}
