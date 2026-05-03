// Phase O — O.4 Advanced Analytics — replay & re-cost engine.
//
// Read-only by contract: every code path that writes to llm_usage_events is
// forbidden. The engine SELECTs historical events in a date range, looks up
// alternative pricing rows from llm_pricing_versions, and computes what the
// events WOULD have cost under that pricing. The original
// computed_cost_usd column is never mutated.
//
// Authored by USTAD_S4_5_REPLAY_RECOST.

import 'server-only'
import { query } from '../../db/client'

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export interface ReplayParams {
  date_start: string
  date_end: string
  /** UUID; if omitted, use latest pricing per (provider, model). */
  target_pricing_version_id?: string
  provider?: string
  model?: string
  /** Max events to process; default 10_000, hard cap 50_000. */
  limit?: number
}

export interface ReplayBreakdown {
  provider: string
  model: string | null
  event_count: number
  original_cost_usd: number
  recost_usd: number
  delta_usd: number
  delta_pct: number
}

export interface ReplayResult {
  params: ReplayParams
  events_processed: number
  original_total_usd: number
  recost_total_usd: number
  delta_total_usd: number
  delta_total_pct: number
  /** UUID of the pricing version anchor actually used. When the caller did
   *  not pass `target_pricing_version_id`, this surfaces the most-recent
   *  version_id observed across the (provider, model) tuples touched, so
   *  the result remains auditable. */
  target_pricing_version_id: string
  target_pricing_effective_from: string
  /** Per (provider, model) — model is null only if the underlying event row
   *  also has null model (effectively impossible per schema, but defensive). */
  breakdown: ReplayBreakdown[]
  computed_at: string
}

// ---------------------------------------------------------------------------
// Internals
// ---------------------------------------------------------------------------

export const REPLAY_DEFAULT_LIMIT = 10_000
export const REPLAY_HARD_CAP_LIMIT = 50_000

interface QueryFn {
  <R = unknown>(sql: string, params?: unknown[]): Promise<{ rows: R[] }>
}

interface EventRow {
  event_id: string
  provider: string
  model: string
  input_tokens: number | null
  output_tokens: number | null
  cache_read_tokens: number | null
  cache_write_tokens: number | null
  reasoning_tokens: number | null
  computed_cost_usd: number | null
}

interface PricingRow {
  pricing_version_id: string
  provider: string
  model: string
  token_class: string
  price_per_million_usd: number
  effective_from: string
}

const TOKEN_CLASSES = [
  'input',
  'output',
  'cache_read',
  'cache_write',
  'reasoning',
] as const

type TokenClass = (typeof TOKEN_CLASSES)[number]

function priceKey(provider: string, model: string, tc: TokenClass): string {
  return `${provider}:${model}:${tc}`
}

function tokensFor(event: EventRow, tc: TokenClass): number {
  const v =
    tc === 'input'
      ? event.input_tokens
      : tc === 'output'
        ? event.output_tokens
        : tc === 'cache_read'
          ? event.cache_read_tokens
          : tc === 'cache_write'
            ? event.cache_write_tokens
            : event.reasoning_tokens
  return Number(v ?? 0)
}

// ---------------------------------------------------------------------------
// Engine
// ---------------------------------------------------------------------------

/** Replay events in [date_start, date_end] under alternative pricing.
 *  Read-only: the implementation contains zero UPDATE/INSERT/DELETE on
 *  llm_usage_events. */
export async function replayAndRecost(
  params: ReplayParams,
  queryFn: QueryFn = query as QueryFn,
): Promise<ReplayResult> {
  // ── 0. Validate + clamp limit ─────────────────────────────────────────────
  const requested =
    typeof params.limit === 'number' && Number.isFinite(params.limit)
      ? Math.floor(params.limit)
      : REPLAY_DEFAULT_LIMIT
  if (requested <= 0) {
    throw new Error('limit must be a positive integer')
  }
  if (requested > REPLAY_HARD_CAP_LIMIT) {
    throw new Error(
      `limit ${requested} exceeds hard cap ${REPLAY_HARD_CAP_LIMIT}`,
    )
  }
  const limit = requested

  // ── 1. SELECT events in range (READ ONLY) ────────────────────────────────
  const evWhere: string[] = [
    'started_at >= $1::date',
    "started_at <  ($2::date + INTERVAL '1 day')",
  ]
  const evParams: unknown[] = [params.date_start, params.date_end]
  let pIdx = 3
  if (params.provider) {
    evWhere.push(`provider = $${pIdx}`)
    evParams.push(params.provider)
    pIdx += 1
  }
  if (params.model) {
    evWhere.push(`model = $${pIdx}`)
    evParams.push(params.model)
    pIdx += 1
  }
  evWhere.push(`status = 'success'`)
  evParams.push(limit)
  const evSql =
    'SELECT event_id, provider, model, input_tokens, output_tokens,' +
    ' cache_read_tokens, cache_write_tokens, reasoning_tokens,' +
    ' computed_cost_usd' +
    ' FROM llm_usage_events' +
    ' WHERE ' + evWhere.join(' AND ') +
    ' ORDER BY started_at ASC' +
    ` LIMIT $${pIdx}`

  const { rows: events } = await queryFn<EventRow>(evSql, evParams)

  // ── 2. Resolve pricing anchor + build lookup map ─────────────────────────
  let anchorVersionId: string | null = null
  let anchorEffectiveFrom: string | null = null
  const priceMap = new Map<string, number>()

  if (params.target_pricing_version_id) {
    // Anchor is a fixed pricing_version_id.
    const { rows: anchorRows } = await queryFn<{
      pricing_version_id: string
      effective_from: string
    }>(
      'SELECT pricing_version_id, effective_from' +
        ' FROM llm_pricing_versions' +
        ' WHERE pricing_version_id = $1' +
        ' LIMIT 1',
      [params.target_pricing_version_id],
    )
    if (anchorRows.length === 0) {
      throw new Error(
        `target_pricing_version_id not found: ${params.target_pricing_version_id}`,
      )
    }
    anchorVersionId = anchorRows[0].pricing_version_id
    anchorEffectiveFrom = anchorRows[0].effective_from

    // For the chosen anchor's effective_from, pull every (provider, model,
    // token_class) row whose [effective_from, effective_to) covers that date.
    // Simplest: pull all rows where effective_from <= anchor.effective_from
    // and (effective_to is null or effective_to > anchor.effective_from), and
    // pick the one with the latest effective_from per key.
    const { rows: priceRows } = await queryFn<PricingRow>(
      'SELECT pricing_version_id, provider, model, token_class,' +
        ' price_per_million_usd, effective_from' +
        ' FROM llm_pricing_versions' +
        ' WHERE effective_from <= $1::date' +
        ' AND (effective_to IS NULL OR effective_to > $1::date)' +
        ' ORDER BY effective_from ASC',
      [anchorEffectiveFrom],
    )
    for (const r of priceRows) {
      const key = priceKey(r.provider, r.model, r.token_class as TokenClass)
      priceMap.set(key, Number(r.price_per_million_usd))
    }
  } else {
    // No anchor: latest-effective pricing per (provider, model, token_class)
    // observed across the event set. We pull *all* current pricing rows and
    // let the lookup handle the per-(provider, model) selection. The anchor
    // surfaced on the result is the most recent effective_from in the union.
    const { rows: priceRows } = await queryFn<PricingRow>(
      'SELECT DISTINCT ON (provider, model, token_class)' +
        ' pricing_version_id, provider, model, token_class,' +
        ' price_per_million_usd, effective_from' +
        ' FROM llm_pricing_versions' +
        ' ORDER BY provider, model, token_class, effective_from DESC',
    )
    for (const r of priceRows) {
      const key = priceKey(r.provider, r.model, r.token_class as TokenClass)
      priceMap.set(key, Number(r.price_per_million_usd))
      // Track the most recent effective_from across all rows.
      if (
        anchorEffectiveFrom === null ||
        r.effective_from > anchorEffectiveFrom
      ) {
        anchorEffectiveFrom = r.effective_from
        anchorVersionId = r.pricing_version_id
      }
    }
  }

  // Defensive defaults if no pricing rows exist at all.
  const resolvedVersionId = anchorVersionId ?? ''
  const resolvedEffectiveFrom = anchorEffectiveFrom ?? ''

  // ── 3. Re-cost each event in memory ──────────────────────────────────────
  interface BreakdownAcc {
    provider: string
    model: string | null
    event_count: number
    original_cost_usd: number
    recost_usd: number
  }
  const acc = new Map<string, BreakdownAcc>()

  let originalTotal = 0
  let recostTotal = 0

  for (const ev of events) {
    let recost = 0
    for (const tc of TOKEN_CLASSES) {
      const tokens = tokensFor(ev, tc)
      if (tokens === 0) continue
      const price = priceMap.get(priceKey(ev.provider, ev.model, tc)) ?? 0
      recost += (tokens * price) / 1_000_000
    }
    const original = Number(ev.computed_cost_usd ?? 0)
    originalTotal += original
    recostTotal += recost

    const bkey = `${ev.provider}::${ev.model ?? ''}`
    const cur = acc.get(bkey) ?? {
      provider: ev.provider,
      model: ev.model ?? null,
      event_count: 0,
      original_cost_usd: 0,
      recost_usd: 0,
    }
    cur.event_count += 1
    cur.original_cost_usd += original
    cur.recost_usd += recost
    acc.set(bkey, cur)
  }

  const breakdown: ReplayBreakdown[] = Array.from(acc.values())
    .map(b => {
      const delta = b.recost_usd - b.original_cost_usd
      const pct =
        b.original_cost_usd === 0
          ? b.recost_usd === 0
            ? 0
            : Number.POSITIVE_INFINITY
          : (delta / b.original_cost_usd) * 100
      return {
        provider: b.provider,
        model: b.model,
        event_count: b.event_count,
        original_cost_usd: b.original_cost_usd,
        recost_usd: b.recost_usd,
        delta_usd: delta,
        delta_pct: Number.isFinite(pct) ? pct : 0,
      }
    })
    .sort((a, b) =>
      a.provider === b.provider
        ? (a.model ?? '').localeCompare(b.model ?? '')
        : a.provider.localeCompare(b.provider),
    )

  const deltaTotal = recostTotal - originalTotal
  const deltaTotalPct =
    originalTotal === 0
      ? recostTotal === 0
        ? 0
        : 0
      : (deltaTotal / originalTotal) * 100

  return {
    params,
    events_processed: events.length,
    original_total_usd: originalTotal,
    recost_total_usd: recostTotal,
    delta_total_usd: deltaTotal,
    delta_total_pct: deltaTotalPct,
    target_pricing_version_id: resolvedVersionId,
    target_pricing_effective_from: resolvedEffectiveFrom,
    breakdown,
    computed_at: new Date().toISOString(),
  }
}

/** Pricing-version row shape returned by the form-dropdown helper. */
export interface ReplayPricingVersionOption {
  pricing_version_id: string
  provider: string
  model: string
  effective_from: string
}

/** Distinct (pricing_version_id, provider, model, effective_from) sorted by
 *  effective_from DESC. Powers the form's "target pricing version" dropdown.
 *  READ ONLY. */
export async function listReplayPricingVersions(
  queryFn: QueryFn = query as QueryFn,
): Promise<ReplayPricingVersionOption[]> {
  const { rows } = await queryFn<ReplayPricingVersionOption>(
    'SELECT DISTINCT ON (pricing_version_id, provider, model)' +
      ' pricing_version_id, provider, model, effective_from' +
      ' FROM llm_pricing_versions' +
      ' ORDER BY pricing_version_id, provider, model, effective_from DESC',
  )
  return [...rows].sort((a, b) =>
    a.effective_from === b.effective_from
      ? a.provider === b.provider
        ? a.model.localeCompare(b.model)
        : a.provider.localeCompare(b.provider)
      : b.effective_from.localeCompare(a.effective_from),
  )
}
