// computeCost — local cost computation against the active pricing version.
//
// Per OBSERVATORY_PLAN §2.1: cost is purely a telemetry artifact computed at
// insert time from the active row in llm_pricing_versions where the call's
// started_at falls between effective_from and (effective_to ?? infinity). The
// pricing_version_id of the matched row is frozen onto the event row so the
// replay/re-cost engine (S4.5) can re-cost any historical event against any
// pricing version without mutating the original row.

import type {
  CostResult,
  ObservatoryDb,
  ProviderName,
  TokenUsage,
} from './types'

interface PricingRow {
  pricing_version_id: string
  token_class: 'input' | 'output' | 'cache_read' | 'cache_write' | 'reasoning'
  price_per_million_usd: number
}

const TOKEN_CLASS_TO_USAGE_FIELD: Record<
  PricingRow['token_class'],
  keyof TokenUsage
> = {
  input: 'input_tokens',
  output: 'output_tokens',
  cache_read: 'cache_read_tokens',
  cache_write: 'cache_write_tokens',
  reasoning: 'reasoning_tokens',
}

export class PricingNotFoundError extends Error {
  constructor(provider: ProviderName, model: string, at: Date) {
    super(
      `No pricing rows found for provider=${provider} model=${model} ` +
        `effective at ${at.toISOString()}`,
    )
    this.name = 'PricingNotFoundError'
  }
}

export async function computeCost(
  provider: ProviderName,
  model: string,
  usage: TokenUsage,
  startedAt: Date,
  db: ObservatoryDb,
): Promise<CostResult> {
  const result = await db.query<PricingRow>(
    `SELECT pricing_version_id, token_class, price_per_million_usd
     FROM llm_pricing_versions
     WHERE provider = $1
       AND model = $2
       AND effective_from <= $3
       AND (effective_to IS NULL OR effective_to > $3)`,
    [provider, model, startedAt.toISOString()],
  )

  if (result.rows.length === 0) {
    throw new PricingNotFoundError(provider, model, startedAt)
  }

  let total = 0
  // Pick a stable canonical pricing_version_id: prefer the 'input' class row
  // (universal across providers), else fall back to the first row returned.
  // The schema column is a single uuid; rows from the same pricing batch
  // share effective_from but each token-class row carries its own uuid.
  let canonicalId: string | null = null

  for (const row of result.rows) {
    const usageField = TOKEN_CLASS_TO_USAGE_FIELD[row.token_class]
    if (!usageField) continue
    const tokens = usage[usageField] ?? 0
    if (tokens > 0) {
      total += (tokens / 1_000_000) * row.price_per_million_usd
    }
    if (row.token_class === 'input') {
      canonicalId = row.pricing_version_id
    } else if (canonicalId === null) {
      canonicalId = row.pricing_version_id
    }
  }

  return {
    computed_cost_usd: total,
    pricing_version_id: canonicalId ?? result.rows[0].pricing_version_id,
  }
}
