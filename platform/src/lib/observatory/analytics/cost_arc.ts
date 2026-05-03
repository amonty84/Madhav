// Phase O — O.4 Advanced Analytics — Conversation Cost Arc.
//
// Surfaces how much each conversation is costing over its lifetime.
// A "conversation" = group of llm_usage_events sharing the same
// conversation_id. The "arc" is the per-event running total of
// computed_cost_usd, ordered by started_at ASC within the conversation.
//
// Two surfaces:
//   1. queryTopConversations — ranked summaries within a date range
//      (top N by total_cost_usd DESC).
//   2. queryConversationArc  — full per-event arc for a single conversation
//      using a SUM(...) OVER (...) window function for the cumulative sum.
//
// Authored by USTAD_S4_3_COST_ARC.

import 'server-only'
import { query as defaultQuery } from '../../db/client'

// PoolClient (and Pool, and our `query` helper) all share this minimal
// shape: `query(sql, params) → { rows: T[] }`. Tests inject a mock; routes
// use the default global query.
export interface QueryFn {
  <R = unknown>(
    sql: string,
    params?: unknown[],
  ): Promise<{ rows: R[] }>
}

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export interface ConversationSummary {
  conversation_id: string
  conversation_name: string
  total_cost_usd: number
  event_count: number
  /** distinct prompt_id count — proxy for user turns. */
  turn_count: number
  first_event_at: string
  last_event_at: string
  avg_cost_per_event_usd: number
  /** distinct providers used in the conversation. */
  providers: string[]
}

export interface ConversationTurn {
  event_id: string
  started_at: string
  pipeline_stage: string
  provider: string
  model: string
  computed_cost_usd: number
  /** Running sum from the first event in the conversation. */
  cumulative_cost_usd: number
}

export interface ConversationArcResult {
  conversation_id: string
  conversation_name: string
  turns: ConversationTurn[]
  total_cost_usd: number
}

// ---------------------------------------------------------------------------
// Internal row shapes
// ---------------------------------------------------------------------------

interface TopConversationRow {
  conversation_id: string
  conversation_name: string | null
  total_cost_usd: number | string | null
  event_count: string | number | null
  turn_count: string | number | null
  first_event_at: string
  last_event_at: string
  providers: string[] | null
}

interface ConversationArcRow {
  event_id: string
  conversation_id: string
  conversation_name: string | null
  started_at: string
  pipeline_stage: string | null
  provider: string | null
  model: string | null
  computed_cost_usd: number | string | null
  cumulative_cost_usd: number | string | null
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const TOP_CONVERSATIONS_DEFAULT_LIMIT = 50
export const TOP_CONVERSATIONS_MAX_LIMIT = 200

// ---------------------------------------------------------------------------
// queryTopConversations
// ---------------------------------------------------------------------------

export interface TopConversationsParams {
  date_start: string
  date_end: string
  limit?: number
}

/** Return the top conversations by total spend within [date_start, date_end).
 *  Sort order: total_cost_usd DESC, then conversation_id ASC for stability. */
export async function queryTopConversations(
  db: QueryFn,
  params: TopConversationsParams,
): Promise<ConversationSummary[]> {
  const limit = Math.min(
    Math.max(1, Math.floor(params.limit ?? TOP_CONVERSATIONS_DEFAULT_LIMIT)),
    TOP_CONVERSATIONS_MAX_LIMIT,
  )
  const sql = `
    SELECT
      conversation_id,
      MAX(conversation_name)                                AS conversation_name,
      COALESCE(SUM(computed_cost_usd), 0)::float8           AS total_cost_usd,
      COUNT(*)::text                                        AS event_count,
      COUNT(DISTINCT prompt_id)::text                       AS turn_count,
      MIN(started_at)                                       AS first_event_at,
      MAX(started_at)                                       AS last_event_at,
      ARRAY_AGG(DISTINCT provider ORDER BY provider)        AS providers
    FROM llm_usage_events
    WHERE started_at >= $1
      AND started_at <  $2
      AND conversation_id IS NOT NULL
    GROUP BY conversation_id
    ORDER BY total_cost_usd DESC, conversation_id ASC
    LIMIT $3
  `
  const { rows } = await db<TopConversationRow>(sql, [
    params.date_start,
    params.date_end,
    limit,
  ])
  return rows.map(toConversationSummary)
}

function toConversationSummary(r: TopConversationRow): ConversationSummary {
  const total = Number(r.total_cost_usd ?? 0)
  const eventCount = Number(r.event_count ?? 0)
  return {
    conversation_id: r.conversation_id,
    conversation_name: r.conversation_name ?? r.conversation_id,
    total_cost_usd: total,
    event_count: eventCount,
    turn_count: Number(r.turn_count ?? 0),
    first_event_at: r.first_event_at,
    last_event_at: r.last_event_at,
    avg_cost_per_event_usd: eventCount > 0 ? total / eventCount : 0,
    providers: (r.providers ?? []).filter(p => p != null),
  }
}

// ---------------------------------------------------------------------------
// queryConversationArc
// ---------------------------------------------------------------------------

/** Return the full per-event cost arc for one conversation. Events are
 *  returned in chronological order with a running cumulative sum computed
 *  via a SQL window function. Returns null when no events exist for the id. */
export async function queryConversationArc(
  db: QueryFn,
  conversationId: string,
): Promise<ConversationArcResult | null> {
  const sql = `
    SELECT
      event_id,
      conversation_id,
      conversation_name,
      started_at,
      pipeline_stage,
      provider,
      model,
      computed_cost_usd::float8                             AS computed_cost_usd,
      SUM(computed_cost_usd) OVER (
        PARTITION BY conversation_id
        ORDER BY started_at ASC, event_id ASC
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
      )::float8                                             AS cumulative_cost_usd
    FROM llm_usage_events
    WHERE conversation_id = $1
    ORDER BY started_at ASC, event_id ASC
  `
  const { rows } = await db<ConversationArcRow>(sql, [conversationId])
  if (rows.length === 0) return null

  const turns: ConversationTurn[] = rows.map(r => ({
    event_id: r.event_id,
    started_at: r.started_at,
    pipeline_stage: r.pipeline_stage ?? 'other',
    provider: r.provider ?? 'unknown',
    model: r.model ?? 'unknown',
    computed_cost_usd: Number(r.computed_cost_usd ?? 0),
    cumulative_cost_usd: Number(r.cumulative_cost_usd ?? 0),
  }))
  const last = turns[turns.length - 1]
  return {
    conversation_id: rows[0].conversation_id,
    conversation_name: rows[0].conversation_name ?? rows[0].conversation_id,
    turns,
    total_cost_usd: last.cumulative_cost_usd,
  }
}

// ---------------------------------------------------------------------------
// Default-bound helpers (route handlers use these so they don't need to
// thread the global `query` through every call).
// ---------------------------------------------------------------------------

export function getDefaultQuery(): QueryFn {
  return defaultQuery as unknown as QueryFn
}
