/**
 * QueryPlan — the structured plan produced by the Router (C2.1) that drives
 * every downstream pipeline stage. Derived from query_plan.schema.json v1.0.
 * Exported for shared use by Bundle Composer and other downstream consumers.
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
  audience_tier:
    | 'super_admin'
    | 'acharya_reviewer'
    | 'client'
    | 'public_redacted'
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
  // Optional fields
  planets?: string[]
  houses?: number[]
  dasha_context_required?: boolean
  graph_seed_hints?: string[]
  /** Edge types the classifier wants cgm_graph_walk to traverse. Empty/undefined = all edge types. */
  edge_type_filter?: string[]
  graph_traversal_depth?: number
  /** Filter applied to vector_search retrieval — narrows by doc_type and/or layer. */
  vector_search_filter?: {
    doc_type?: string[]
    layer?: string
  }
  bundle_directives?: {
    floor_overrides?: string[]
    conditional_overrides?: object
  }
  adjudicator_model_id?: string
  router_confidence?: number
  router_model_id?: string
  /** Params for chart_facts_query retrieval tool (M2-C1). */
  chart_facts_query?: import('@/lib/retrieve/chart_facts_query').ChartFactsQueryInput
  // Temporal extension flags (W5-R1)
  time_window?: { start: string; end: string }
  sade_sati_query?: boolean
  eclipse_query?: boolean
  retrograde_query?: boolean
  retrograde_planet?: string
}
