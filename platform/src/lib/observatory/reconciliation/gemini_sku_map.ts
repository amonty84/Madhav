// Phase O — O.2 Reconciliation: Gemini SKU → model-id map.
//
// Authored by USTAD_S2_4_GEMINI_RECONCILER per OBSERVATORY_PLAN §4.3 +
// brief Task 1. GCP Cloud Billing exports Gemini API usage under the
// "Generative Language API" service (service.id "CA67-68B8-7BD0" or
// service.description containing "generative language"; Vertex-hosted
// Gemini surfaces under "Vertex AI"). SKU descriptions follow this
// pattern, e.g. "Gemini 1.5 Pro Input tokens" / "... Output tokens" /
// "... Context caching". We only need the model-id mapping at the
// reconciliation tier — token-class breakdown is already captured at
// telemetry time by the S1.6 adapter and rolled up by computePeriodCost.
//
// The map is intentionally additive: when Google adds a new Gemini SKU,
// add it here without touching the reconciler logic. Unrecognised SKUs
// (free tier, other GCP services co-existing in the billing export) are
// returned as null and logged in the reconciler's notes — not an error.

const GEMINI_SKU_TO_MODEL: Record<string, string> = {
  // Gemini 1.5 Pro
  'Gemini 1.5 Pro Input tokens': 'gemini-1.5-pro',
  'Gemini 1.5 Pro Output tokens': 'gemini-1.5-pro',
  // Gemini 1.5 Flash
  'Gemini 1.5 Flash Input tokens': 'gemini-1.5-flash',
  'Gemini 1.5 Flash Output tokens': 'gemini-1.5-flash',
  // Gemini 2.0 Flash
  'Gemini 2.0 Flash Input tokens': 'gemini-2.0-flash',
  'Gemini 2.0 Flash Output tokens': 'gemini-2.0-flash',
  // Gemini 2.5 Pro / Flash (preview SKUs as of 2026-Q2; preserved verbatim)
  'Gemini 2.5 Pro Preview Input tokens': 'gemini-2.5-pro-preview',
  'Gemini 2.5 Pro Preview Output tokens': 'gemini-2.5-pro-preview',
  'Gemini 2.5 Flash Preview Input tokens': 'gemini-2.5-flash-preview',
  'Gemini 2.5 Flash Preview Output tokens': 'gemini-2.5-flash-preview',
  // Context caching (billed separately by GCP — same model on the
  // observatory side; cache_read_tokens already on the telemetry row)
  'Gemini 1.5 Pro Context caching': 'gemini-1.5-pro',
  'Gemini 1.5 Flash Context caching': 'gemini-1.5-flash',
  'Gemini 2.0 Flash Context caching': 'gemini-2.0-flash',
}

/** Normalize a SKU description from the BigQuery billing export and look it
 *  up in the additive map. Case-insensitive prefix match collapses internal
 *  whitespace runs to a single space (BQ exports occasionally double-space
 *  on certain SKU revisions). Returns `null` for any SKU not present in the
 *  map — the reconciler treats that as "log + skip", not an error. */
export function skuToModelId(skuDescription: string): string | null {
  if (typeof skuDescription !== 'string') return null
  const normalized = skuDescription.replace(/\s+/g, ' ').trim().toLowerCase()
  if (normalized.length === 0) return null
  for (const [key, modelId] of Object.entries(GEMINI_SKU_TO_MODEL)) {
    const k = key.toLowerCase()
    if (normalized === k || normalized.startsWith(k)) {
      return modelId
    }
  }
  return null
}

/** Exported for tests + future reconcilers that want to enumerate the
 *  recognised SKU set without re-importing the constant. */
export function knownGeminiSkuPrefixes(): readonly string[] {
  return Object.keys(GEMINI_SKU_TO_MODEL)
}
