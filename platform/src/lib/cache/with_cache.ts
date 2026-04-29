/**
 * MARSYS-JIS Stream D — executeWithCache helper
 * schema_version: 1.0
 *
 * Wraps a RetrievalTool.retrieve() call with cache lookup/store.
 * Uses a normalised subset of QueryPlan as the cache key so that two calls
 * with identical retrieval intent (but different UUIDs) hit the same entry.
 */

import type { QueryPlan, ToolBundle, RetrievalTool } from '../retrieve/types'
import { RequestScopedToolCache } from './tool_cache'

/**
 * Execute a retrieval tool with optional request-scoped caching.
 *
 * Cache key is derived from the fields that determine what the tool retrieves
 * (query_class, domains, planets, forward_looking, dasha_context_required).
 * Unique-per-request fields like query_plan_id are intentionally excluded so
 * that semantically identical requests within a panel turn share one result.
 */
export async function executeWithCache(
  tool: RetrievalTool,
  plan: QueryPlan,
  cache?: RequestScopedToolCache,
): Promise<ToolBundle> {
  if (!cache) {
    return await tool.retrieve(plan)
  }

  const params: Record<string, unknown> = {
    query_class: plan.query_class,
    domains: [...(plan.domains ?? [])].sort(),
    planets: [...(plan.planets ?? [])].sort(),
    forward_looking: plan.forward_looking,
    dasha_context_required: plan.dasha_context_required ?? false,
  }

  // Use synchronous getPromise so concurrent calls with the same params
  // share the SAME promise (coalescing) before either has awaited it.
  const existing = cache.getPromise(tool.name, params)
  if (existing) {
    const cached = await existing
    return { ...cached, served_from_cache: true }
  }

  const promise = tool.retrieve(plan)
  cache.put(tool.name, params, promise)
  return await promise
}
