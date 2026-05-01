import 'server-only'

import { query } from '@/lib/db/client'
import { telemetry } from '@/lib/telemetry/index'
import type { QueryPlan } from '@/lib/router/types'

export interface ToolBundleSummary {
  tool_name: string
  item_count: number
  latency_ms: number
  cached: boolean
}

export interface AuditEventParams {
  queryId: string
  queryPlanId?: string
  queryText: string
  queryClass: string
  userId: string
  chartId?: string
  conversationId?: string
  toolBundles: ToolBundleSummary[]
  latencyMs: number
  auditStatus?: string
  auditWarnings?: unknown[]
}

/**
 * Write one row to audit_events. Never throws — failures are routed to
 * telemetry so the response path is never affected.
 */
export async function writeAuditEvent(params: AuditEventParams): Promise<void> {
  try {
    await query(
      `INSERT INTO audit_events (
        query_id, query_plan_id, query_text, query_class,
        user_id, chart_id, conversation_id, tool_bundles,
        latency_ms, audit_status, audit_warnings
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
      [
        params.queryId,
        params.queryPlanId ?? null,
        params.queryText,
        params.queryClass,
        params.userId,
        params.chartId ?? null,
        params.conversationId ?? null,
        JSON.stringify(params.toolBundles),
        params.latencyMs,
        params.auditStatus ?? 'ok',
        params.auditWarnings != null ? JSON.stringify(params.auditWarnings) : null,
      ]
    )
  } catch (err) {
    telemetry.recordError(
      'audit_writer',
      'write_audit_event_failed',
      err instanceof Error ? err : new Error(String(err))
    )
  }
}

/**
 * Write one row to query_plans. ON CONFLICT DO NOTHING — idempotent if the
 * same query_plan_id fires twice (e.g., retries). Never throws.
 */
export async function writeQueryPlan(plan: QueryPlan): Promise<void> {
  try {
    await query(
      `INSERT INTO query_plans (
        query_plan_id, query_id, query_text, query_class,
        domains, planets, houses, forward_looking, audience_tier,
        tools_authorized, history_mode, panel_mode, expected_output_shape,
        graph_seed_hints, graph_traversal_depth, edge_type_filter,
        vector_search_filter, dasha_context_required, bundle_directives,
        router_model_id, router_confidence, manifest_fingerprint, schema_version
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23
      )
      ON CONFLICT (query_plan_id) DO NOTHING`,
      [
        plan.query_plan_id,
        plan.query_plan_id,
        plan.query_text,
        plan.query_class,
        plan.domains,
        plan.planets ?? null,
        plan.houses ?? null,
        plan.forward_looking,
        plan.audience_tier,
        plan.tools_authorized,
        plan.history_mode,
        plan.panel_mode,
        plan.expected_output_shape,
        plan.graph_seed_hints ?? null,
        plan.graph_traversal_depth ?? null,
        plan.edge_type_filter ?? null,
        plan.vector_search_filter != null ? JSON.stringify(plan.vector_search_filter) : null,
        plan.dasha_context_required ?? null,
        plan.bundle_directives != null ? JSON.stringify(plan.bundle_directives) : null,
        plan.router_model_id ?? null,
        plan.router_confidence ?? null,
        plan.manifest_fingerprint,
        plan.schema_version,
      ]
    )
  } catch (err) {
    telemetry.recordError(
      'audit_writer',
      'write_query_plan_failed',
      err instanceof Error ? err : new Error(String(err))
    )
  }
}
