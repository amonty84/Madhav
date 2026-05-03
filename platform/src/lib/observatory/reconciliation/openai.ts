// Phase O — O.2 Reconciliation: OpenAI organization usage reconciler.
//
// Authored by USTAD_S2_3_OPENAI_RECONCILER per OBSERVATORY_PLAN §2.2 + §4.2.
// Resolves authoritative cost over a (period_start, period_end) inclusive
// range by querying OpenAI's organization-scoped admin API.
//
// Endpoint strategy:
//   1. GET /v1/organization/costs (preferred — returns cost in USD directly).
//   2. On 404, fall through to GET /v1/organization/usage/completions and
//      apply our local llm_pricing_versions table to produce an authoritative
//      cost. The fallback is documented in raw_payload.meta.endpoint_used.
//
// Pagination: both endpoints follow the OpenAI Pages convention — `has_more`
// + `next_page` cursor; we follow until `has_more=false`.
//
// Unknown models in the /completions path: each model has its tokens summed,
// then priced via llm_pricing_versions. A model with no pricing row
// contributes 0 USD and its name is captured in raw_payload.meta.unknown_models
// for audit. (The shim's `notes` field is owned by BaseReconciler; the audit
// trail rides the raw_payload that is persisted to llm_provider_cost_reports.)
//
// Auth: requires OPENAI_ADMIN_API_KEY (an admin/billing-scoped key — distinct
// from the model key used by the inference adapter, which has only model
// scope and would 401 against /v1/organization/*).

import 'server-only'
import { query } from '@/lib/db/client'
import { BaseReconciler, type FetchAuthoritativeCostResult } from './base'
import type { ProviderName, ProviderReconcileInput } from './types'

const OPENAI_API_BASE = 'https://api.openai.com'
const REQUEST_TIMEOUT_MS = 30_000
const SECONDS_PER_DAY = 86_400

interface CostsBucketResult {
  amount?: { value?: number; currency?: string }
  line_item?: string | null
  project_id?: string | null
}
interface CostsBucket {
  start_time?: number
  end_time?: number
  results?: CostsBucketResult[]
}
interface CostsPage {
  data?: CostsBucket[]
  has_more?: boolean
  next_page?: string | null
}

interface CompletionsResult {
  model?: string
  input_tokens?: number
  output_tokens?: number
  input_cached_tokens?: number
}
interface CompletionsBucket {
  start_time?: number
  end_time?: number
  results?: CompletionsResult[]
}
interface CompletionsPage {
  data?: CompletionsBucket[]
  has_more?: boolean
  next_page?: string | null
}

interface PricingRow {
  token_class: string
  price_per_million_usd: number
}

class CostsEndpointUnavailable extends Error {
  constructor() {
    super('OpenAI /costs endpoint returned 404')
    this.name = 'CostsEndpointUnavailable'
  }
}

function isoDateToEpochSeconds(date: string): number {
  const y = Number(date.slice(0, 4))
  const m = Number(date.slice(5, 7)) - 1
  const d = Number(date.slice(8, 10))
  return Math.floor(Date.UTC(y, m, d) / 1000)
}

async function openaiFetch(
  url: string,
  apiKey: string,
): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  try {
    return await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}` },
      signal: controller.signal,
    })
  } catch (err) {
    if (
      err instanceof Error &&
      (err.name === 'AbortError' || /aborted/i.test(err.message))
    ) {
      throw new Error('OpenAI usage API timeout')
    }
    throw err
  } finally {
    clearTimeout(timer)
  }
}

export class OpenAIReconciler extends BaseReconciler {
  readonly provider: ProviderName = 'openai'

  protected async fetchAuthoritativeCost(
    input: ProviderReconcileInput,
  ): Promise<FetchAuthoritativeCostResult> {
    const apiKey = process.env.OPENAI_ADMIN_API_KEY
    if (!apiKey) {
      throw new Error('OPENAI_ADMIN_API_KEY not configured')
    }
    try {
      return await this.fetchFromCosts(input, apiKey)
    } catch (err) {
      if (err instanceof CostsEndpointUnavailable) {
        return await this.fetchFromCompletions(input, apiKey)
      }
      throw err
    }
  }

  private async fetchFromCosts(
    input: ProviderReconcileInput,
    apiKey: string,
  ): Promise<FetchAuthoritativeCostResult> {
    const startEpoch = isoDateToEpochSeconds(input.period_start)
    // /costs `end_time` is exclusive — bump period_end (inclusive) by 1 day.
    const endEpoch = isoDateToEpochSeconds(input.period_end) + SECONDS_PER_DAY

    const buckets: CostsBucket[] = []
    let totalCostUsd = 0
    let cursor: string | null = null

    do {
      const url = new URL(`${OPENAI_API_BASE}/v1/organization/costs`)
      url.searchParams.set('start_time', String(startEpoch))
      url.searchParams.set('end_time', String(endEpoch))
      url.searchParams.set('bucket_width', '1d')
      if (cursor) url.searchParams.set('page', cursor)

      const response = await openaiFetch(url.toString(), apiKey)
      if (response.status === 404) throw new CostsEndpointUnavailable()
      if (response.status === 401 || response.status === 403) {
        throw new Error(
          'OpenAI admin API key missing or lacks org:read scope',
        )
      }
      if (!response.ok) {
        throw new Error(`OpenAI /costs returned HTTP ${response.status}`)
      }

      const page = (await response.json()) as CostsPage
      for (const bucket of page.data ?? []) {
        for (const r of bucket.results ?? []) {
          const v = r?.amount?.value
          if (typeof v === 'number' && Number.isFinite(v)) totalCostUsd += v
        }
      }
      buckets.push(...(page.data ?? []))
      cursor = page.has_more ? (page.next_page ?? null) : null
    } while (cursor)

    return {
      cost_usd: totalCostUsd,
      raw_payload: {
        meta: { endpoint_used: '/v1/organization/costs' },
        buckets,
      },
    }
  }

  private async fetchFromCompletions(
    input: ProviderReconcileInput,
    apiKey: string,
  ): Promise<FetchAuthoritativeCostResult> {
    const buckets: CompletionsBucket[] = []
    let cursor: string | null = null

    do {
      const url = new URL(
        `${OPENAI_API_BASE}/v1/organization/usage/completions`,
      )
      url.searchParams.set('start_date', input.period_start)
      url.searchParams.set('end_date', input.period_end)
      url.searchParams.set('bucket_width', '1d')
      if (cursor) url.searchParams.set('page', cursor)

      const response = await openaiFetch(url.toString(), apiKey)
      if (response.status === 401 || response.status === 403) {
        throw new Error(
          'OpenAI admin API key missing or lacks org:read scope',
        )
      }
      if (!response.ok) {
        throw new Error(
          `OpenAI /completions returned HTTP ${response.status}`,
        )
      }

      const page = (await response.json()) as CompletionsPage
      buckets.push(...(page.data ?? []))
      cursor = page.has_more ? (page.next_page ?? null) : null
    } while (cursor)

    interface ModelTokenAccum {
      input: number
      output: number
      cache_read: number
    }
    const tokensByModel = new Map<string, ModelTokenAccum>()
    for (const bucket of buckets) {
      for (const r of bucket.results ?? []) {
        const model = typeof r.model === 'string' && r.model.length > 0
          ? r.model
          : 'unknown'
        const cur = tokensByModel.get(model) ?? {
          input: 0,
          output: 0,
          cache_read: 0,
        }
        cur.input += r.input_tokens ?? 0
        cur.output += r.output_tokens ?? 0
        cur.cache_read += r.input_cached_tokens ?? 0
        tokensByModel.set(model, cur)
      }
    }

    const periodMidpointIso = `${input.period_start}T12:00:00Z`
    const unknownModels: string[] = []
    let totalCostUsd = 0

    for (const [model, tokens] of tokensByModel) {
      const { rows } = await query<PricingRow>(
        `SELECT token_class, price_per_million_usd
         FROM llm_pricing_versions
         WHERE provider = $1
           AND model = $2
           AND effective_from <= $3
           AND (effective_to IS NULL OR effective_to > $3)`,
        ['openai', model, periodMidpointIso],
      )
      if (rows.length === 0) {
        unknownModels.push(model)
        continue
      }
      for (const row of rows) {
        let used = 0
        if (row.token_class === 'input') used = tokens.input
        else if (row.token_class === 'output') used = tokens.output
        else if (row.token_class === 'cache_read') used = tokens.cache_read
        if (used > 0) {
          totalCostUsd +=
            (used / 1_000_000) * Number(row.price_per_million_usd)
        }
      }
    }

    return {
      cost_usd: totalCostUsd,
      raw_payload: {
        meta: {
          endpoint_used: '/v1/organization/usage/completions',
          unknown_models: unknownModels,
        },
        buckets,
      },
    }
  }
}
