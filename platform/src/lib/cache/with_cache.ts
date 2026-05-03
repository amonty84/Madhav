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
  plannerParams?: Record<string, unknown>,
): Promise<ToolBundle> {
  if (!cache) {
    return await tool.retrieve(plan, plannerParams)
  }

  const cacheKey: Record<string, unknown> = {
    query_class: plan.query_class,
    domains: [...(plan.domains ?? [])].sort(),
    planets: [...(plan.planets ?? [])].sort(),
    forward_looking: plan.forward_looking,
    dasha_context_required: plan.dasha_context_required ?? false,
    // Include planner params in cache key so different param sets don't alias.
    // Sort keys for determinism.
    ...(plannerParams && Object.keys(plannerParams).length > 0
      ? { planner_params: Object.fromEntries(Object.entries(plannerParams).sort()) }
      : {}),
  }

  // Use synchronous getPromise so concurrent calls with the same params
  // share the SAME promise (coalescing) before either has awaited it.
  const existing = cache.getPromise(tool.name, cacheKey)
  if (existing) {
    const cached = await existing
    return { ...cached, served_from_cache: true }
  }

  const promise = tool.retrieve(plan, plannerParams)
  cache.put(tool.name, cacheKey, promise)
  return await promise
}
