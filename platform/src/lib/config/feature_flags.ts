export type FeatureFlag =
  | 'PANEL_MODE_ENABLED'
  | 'MANIFEST_BUILDER_ENABLED'
  | 'LLM_CHECKPOINTS_ENABLED'
  // BHISMA-B1 §6.2 — retired: BUNDLE_AUGMENTER_ENABLED, MSR_RERANKER_ENABLED,
  // SEMANTIC_GATE_ENABLED were declared but never implemented in any code path.
  | 'NEW_QUERY_PIPELINE_ENABLED'
  | 'VALIDATOR_FAILURE_HALT'
  | 'SYNTHESIS_PROMPT_DEBUG'
  | 'DISCLOSURE_TIER_DEBUG'
  // AUDIT_ENABLED retired BHISMA-B1 §6.2: always-on; conditional removed from route.ts.
  | 'AUDIT_VIEW_VISIBLE'
  | 'PANEL_CHECKBOX_VISIBLE'
  | 'BUNDLE_COMPOSER_DEBUG'
  // CGM_GRAPH_WALK_ENABLED retired BHISMA-B1: always-on; flag gate removed from cgm_graph_walk.ts
  | 'MANIFEST_QUERY_ENABLED'
  | 'VECTOR_SEARCH_ENABLED'
  // Phase 6 — LLM Checkpoints (all default OFF; flip individually after warn-mode observation)
  | 'CHECKPOINT_4_5_ENABLED'
  | 'CHECKPOINT_4_5_FAIL_HARD'
  | 'CHECKPOINT_5_5_ENABLED'
  | 'CHECKPOINT_5_5_FAIL_HARD'
  | 'CHECKPOINT_8_5_ENABLED'
  | 'CHECKPOINT_8_5_FAIL_HARD'
  | 'CHECKPOINT_8_5_PREDICTION_EXTRACT'
  // Phase 7 — Panel Mode
  | 'PANEL_DEGRADE_2_OF_3'
  // PER_TOOL_PLANNER_ENABLED retired BHISMA-B1 §6.2: was never flipped true; removed from route.ts.
  // BHISMA Stream 2 — LLM-first planner replaces classify+compose+plan_per_tool when ON.
  // Default OFF; old path remains reachable. Flip after smoke + post-BHISMA eval comparison.
  | 'LLM_FIRST_PLANNER_ENABLED'
  // BHISMA-B1 §6.2 — New observability flags (all default ON)
  /** Enables the Trace Analytics tab and cross-query history aggregations. */
  | 'TRACE_ANALYTICS_ENABLED'
  /** Enables per-query cost estimation (planning + synthesis USD buckets in trace). */
  | 'COST_TRACKING_ENABLED'
  /** Enables MSR signal citation count check in synthesis_done trace step. */
  | 'CITATION_CHECK_ENABLED'
  /** When false, o-series reasoning models that don't support streaming fall back to generateText. */
  | 'REASONING_MODEL_STREAMING'

export const DEFAULT_FLAGS: Record<FeatureFlag, boolean> = {
  PANEL_MODE_ENABLED: true,
  MANIFEST_BUILDER_ENABLED: false,
  LLM_CHECKPOINTS_ENABLED: false,
  // NEW_QUERY_PIPELINE_ENABLED: always ON since Phase 11A cutover (2026-04-28).
  // Targeted for type-union removal in B4 convergence once legacy branch deleted.
  NEW_QUERY_PIPELINE_ENABLED: true,
  VALIDATOR_FAILURE_HALT: true,
  SYNTHESIS_PROMPT_DEBUG: false,
  DISCLOSURE_TIER_DEBUG: false,
  AUDIT_VIEW_VISIBLE: false,
  PANEL_CHECKBOX_VISIBLE: false,
  BUNDLE_COMPOSER_DEBUG: false,
  MANIFEST_QUERY_ENABLED: true,
  VECTOR_SEARCH_ENABLED: true,
  CHECKPOINT_4_5_ENABLED: false,
  CHECKPOINT_4_5_FAIL_HARD: false,
  CHECKPOINT_5_5_ENABLED: false,
  CHECKPOINT_5_5_FAIL_HARD: false,
  CHECKPOINT_8_5_ENABLED: false,
  CHECKPOINT_8_5_FAIL_HARD: false,
  CHECKPOINT_8_5_PREDICTION_EXTRACT: false,
  // Phase 7 — Panel Mode (all default OFF)
  PANEL_DEGRADE_2_OF_3: false,
  // BHISMA Stream 2 — LLM-first planner. Default OFF; old path is the live one.
  LLM_FIRST_PLANNER_ENABLED: false,
  // BHISMA-B1 §6.2 — New observability flags (all default ON)
  TRACE_ANALYTICS_ENABLED: true,
  COST_TRACKING_ENABLED: true,
  CITATION_CHECK_ENABLED: true,
  REASONING_MODEL_STREAMING: true,
}

// Numeric config keys (read via configService.getValue)
export const CGM_GRAPH_WALK_MAX_DEPTH_KEY = 'CGM_GRAPH_WALK_MAX_DEPTH'
export const VECTOR_SEARCH_TOP_K_KEY = 'VECTOR_SEARCH_TOP_K'
export const CGM_GRAPH_WALK_MAX_DEPTH_DEFAULT = 3
export const VECTOR_SEARCH_TOP_K_DEFAULT = 20

export const FLAG_ENV_PREFIX = 'MARSYS_FLAG_'
