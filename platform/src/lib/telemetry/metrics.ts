export const Metrics = {
  COMPONENT_LATENCY_MS: 'component.latency_ms',
  COMPONENT_COST_USD: 'component.cost_usd',
  COMPONENT_ERROR_RATE: 'component.error_rate',
  LLM_INPUT_TOKENS: 'llm.input_tokens',
  LLM_OUTPUT_TOKENS: 'llm.output_tokens',
  LLM_CACHED_TOKENS: 'llm.cached_tokens',
  CACHE_HIT_RATE: 'cache.hit_rate',
  BUNDLE_TOKEN_COUNT: 'bundle.token_count',
  RETRIEVAL_RESULT_COUNT: 'retrieval.result_count',
} as const

export type MetricName = (typeof Metrics)[keyof typeof Metrics]
