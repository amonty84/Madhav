// Phase O — O.2 Reconciliation framework: Anthropic admin-API reconciler.
//
// Authored by USTAD_S2_2_ANTHROPIC_RECONCILER per OBSERVATORY_PLAN §2.2 + §4.1.
// Pulls per-period token usage from the Anthropic Organizations Admin API,
// prices it against `llm_pricing_versions`, and returns the authoritative
// total cost. The BaseReconciler template handles persistence + variance
// classification; this file only owns `fetchAuthoritativeCost`.
//
// Pricing reality (per seed_v1 + OBSERVATORY_PLAN §4.1):
//   The schema stores cache pricing as separate rows (token_class='cache_write'
//   priced at 1.25× input, 'cache_read' at 0.1× input). When dedicated cache
//   rows exist for the model, we use them directly; otherwise we fall back to
//   the brief's published multipliers (1.25× write / 0.1× read) so a freshly
//   published model whose cache rows haven't been seeded yet still reconciles.
//
// Pagination:
//   The Admin Usage endpoint returns `{ data, has_more, next_page? }`. We follow
//   `next_page` cursors as long as `has_more` is true. Total iteration capped
//   at MAX_PAGES to defend against runaway loops on a misbehaving API.
//
// Error contract: this method throws on every failure; BaseReconciler.reconcile
// catches and produces status='error' results — never rethrows past the
// template. AC.4 (missing API key) and the 401/403/404/timeout cases all
// surface as status='error' with a recognizable `notes` field.

import 'server-only'
import { query } from '@/lib/db/client'
import { BaseReconciler, type FetchAuthoritativeCostResult } from './base'
import type {
  ProviderReconcileInput,
  ProviderReconcileResult,
  ReconciliationConfig,
} from './types'

const ANTHROPIC_USAGE_URL = 'https://api.anthropic.com/v1/organizations/usage'
const ANTHROPIC_VERSION_HEADER = '2023-06-01'
const ANTHROPIC_BETA_HEADER = 'billing-2025-02'
const FETCH_TIMEOUT_MS = 30_000
const MAX_PAGES = 50

interface AnthropicUsageRow {
  model: string
  usage: {
    input_tokens?: number
    output_tokens?: number
    cache_creation_input_tokens?: number
    cache_read_input_tokens?: number
  }
}

interface AnthropicUsageResponsePage {
  data?: AnthropicUsageRow[]
  has_more?: boolean
  next_page?: string | null
}

interface ModelPricing {
  input_per_million?: number
  output_per_million?: number
  cache_write_per_million?: number
  cache_read_per_million?: number
}

interface PricingRow {
  token_class: string
  price_per_million_usd: number
}

export class AnthropicReconciler extends BaseReconciler {
  readonly provider = 'anthropic' as const

  private unpricedModels: string[] = []

  async reconcile(
    input: ProviderReconcileInput,
    config: ReconciliationConfig,
  ): Promise<ProviderReconcileResult> {
    this.unpricedModels = []
    const result = await super.reconcile(input, config)
    if (this.unpricedModels.length === 0) return result
    const unpricedNote = `unpriced_models=${this.unpricedModels.join(',')}`
    const merged = result.notes ? `${result.notes}; ${unpricedNote}` : unpricedNote
    return { ...result, notes: merged }
  }

  protected async fetchAuthoritativeCost(
    input: ProviderReconcileInput,
  ): Promise<FetchAuthoritativeCostResult> {
    const apiKey = process.env.ANTHROPIC_ADMIN_API_KEY
    if (!apiKey) {
      throw new Error('ANTHROPIC_ADMIN_API_KEY not configured')
    }

    const pages: AnthropicUsageResponsePage[] = []
    const rows: AnthropicUsageRow[] = []
    let nextPage: string | undefined

    for (let i = 0; i < MAX_PAGES; i++) {
      const page = await fetchUsagePage(
        apiKey,
        input.period_start,
        input.period_end,
        nextPage,
      )
      pages.push(page)
      if (Array.isArray(page.data)) rows.push(...page.data)
      if (!page.has_more || !page.next_page) break
      nextPage = page.next_page
    }

    const pricingByModel = new Map<string, ModelPricing>()
    let totalCost = 0

    for (const row of rows) {
      const model = row.model
      let pricing = pricingByModel.get(model)
      if (!pricing) {
        pricing = await loadPricing(model, input.period_end)
        pricingByModel.set(model, pricing)
      }

      const hasAnyPricing =
        pricing.input_per_million !== undefined ||
        pricing.output_per_million !== undefined
      if (!hasAnyPricing) {
        if (!this.unpricedModels.includes(model)) this.unpricedModels.push(model)
        continue
      }

      const inputTokens = row.usage.input_tokens ?? 0
      const outputTokens = row.usage.output_tokens ?? 0
      const cacheWriteTokens = row.usage.cache_creation_input_tokens ?? 0
      const cacheReadTokens = row.usage.cache_read_input_tokens ?? 0

      const inputPrice = pricing.input_per_million ?? 0
      const outputPrice = pricing.output_per_million ?? 0
      const cacheWritePrice = pricing.cache_write_per_million ?? inputPrice * 1.25
      const cacheReadPrice = pricing.cache_read_per_million ?? inputPrice * 0.1

      totalCost += (inputTokens / 1_000_000) * inputPrice
      totalCost += (outputTokens / 1_000_000) * outputPrice
      totalCost += (cacheWriteTokens / 1_000_000) * cacheWritePrice
      totalCost += (cacheReadTokens / 1_000_000) * cacheReadPrice
    }

    return {
      cost_usd: totalCost,
      raw_payload: {
        endpoint: ANTHROPIC_USAGE_URL,
        period_start: input.period_start,
        period_end: input.period_end,
        page_count: pages.length,
        pages,
        unpriced_models: [...this.unpricedModels],
      },
    }
  }
}

async function fetchUsagePage(
  apiKey: string,
  periodStart: string,
  periodEnd: string,
  nextPage: string | undefined,
): Promise<AnthropicUsageResponsePage> {
  const url = new URL(ANTHROPIC_USAGE_URL)
  url.searchParams.set('start_date', periodStart)
  url.searchParams.set('end_date', periodEnd)
  if (nextPage) url.searchParams.set('page', nextPage)

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

  let response: Response
  try {
    response = await fetch(url.toString(), {
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': ANTHROPIC_VERSION_HEADER,
        'anthropic-beta': ANTHROPIC_BETA_HEADER,
      },
      signal: controller.signal,
    })
  } catch (err) {
    if ((err as { name?: string }).name === 'AbortError') {
      throw new Error('Anthropic admin API timeout')
    }
    throw err
  } finally {
    clearTimeout(timeoutId)
  }

  if (response.status === 401 || response.status === 403) {
    throw new Error(
      'Anthropic admin API key missing or lacks billing:read scope',
    )
  }
  if (response.status === 404) {
    throw new Error('Anthropic usage endpoint not found — verify beta header')
  }
  if (!response.ok) {
    const body = await response.text().catch(() => '')
    throw new Error(
      `Anthropic admin API returned ${response.status}: ${body.slice(0, 200)}`,
    )
  }

  return (await response.json()) as AnthropicUsageResponsePage
}

async function loadPricing(
  model: string,
  periodEnd: string,
): Promise<ModelPricing> {
  const { rows } = await query<PricingRow>(
    `SELECT token_class, price_per_million_usd
     FROM llm_pricing_versions
     WHERE provider = 'anthropic'
       AND model = $1
       AND effective_from <= ($2::date + INTERVAL '1 day')
     ORDER BY effective_from DESC, recorded_at DESC`,
    [model, periodEnd],
  )

  const pricing: ModelPricing = {}
  for (const row of rows) {
    const price = Number(row.price_per_million_usd)
    if (!Number.isFinite(price)) continue
    if (row.token_class === 'input' && pricing.input_per_million === undefined) {
      pricing.input_per_million = price
    } else if (
      row.token_class === 'output' &&
      pricing.output_per_million === undefined
    ) {
      pricing.output_per_million = price
    } else if (
      row.token_class === 'cache_write' &&
      pricing.cache_write_per_million === undefined
    ) {
      pricing.cache_write_per_million = price
    } else if (
      row.token_class === 'cache_read' &&
      pricing.cache_read_per_million === undefined
    ) {
      pricing.cache_read_per_million = price
    }
  }
  return pricing
}
