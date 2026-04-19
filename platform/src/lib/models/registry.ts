/**
 * Model registry — data only. Safe to import from both client and server.
 * The provider SDKs (`@ai-sdk/anthropic`, `@ai-sdk/google`, `@ai-sdk/deepseek`)
 * live in a separate `resolver.ts` so they are never bundled into the client.
 */

export type Provider = 'anthropic' | 'google' | 'deepseek'
export type Capability = 'tool-use' | 'prompt-caching'
export type SpeedTier = 'fast' | 'balanced' | 'deep'

export interface ModelMeta {
  id: string
  label: string
  hint: string
  provider: Provider
  speedTier: SpeedTier
  maxOutputTokens: number
  capabilities: Capability[]
}

/**
 * Single source of truth for every model the app exposes to users. Add a new
 * model here and it appears in the picker, the command palette, validation,
 * and capability gating simultaneously.
 */
export const MODELS: ModelMeta[] = [
  // Anthropic — Claude
  {
    id: 'claude-haiku-4-5',
    provider: 'anthropic',
    label: 'Haiku 4.5',
    hint: 'Fast, lighter reasoning',
    speedTier: 'fast',
    maxOutputTokens: 64_000,
    capabilities: ['tool-use', 'prompt-caching'],
  },
  {
    id: 'claude-sonnet-4-6',
    provider: 'anthropic',
    label: 'Sonnet 4.6',
    hint: 'Balanced (default)',
    speedTier: 'balanced',
    maxOutputTokens: 64_000,
    capabilities: ['tool-use', 'prompt-caching'],
  },
  {
    id: 'claude-opus-4-7',
    provider: 'anthropic',
    label: 'Opus 4.7',
    hint: 'Deepest analysis, slower',
    speedTier: 'deep',
    maxOutputTokens: 64_000,
    capabilities: ['tool-use', 'prompt-caching'],
  },
  // Google — Gemini
  {
    id: 'gemini-2.5-flash',
    provider: 'google',
    label: 'Gemini 2.5 Flash',
    hint: 'Fast, Google model',
    speedTier: 'fast',
    maxOutputTokens: 65_536,
    capabilities: ['tool-use'],
  },
  {
    id: 'gemini-2.5-pro',
    provider: 'google',
    label: 'Gemini 2.5 Pro',
    hint: 'Deep reasoning, Google model',
    speedTier: 'deep',
    maxOutputTokens: 65_536,
    capabilities: ['tool-use'],
  },
  // Preview models ship under non-stable slugs. Google may rename / remove
  // them with short notice; if this 404s, check Google AI Studio for the
  // current preview slug and update here.
  {
    id: 'gemini-3-pro-preview',
    provider: 'google',
    label: 'Gemini 3 Pro (preview)',
    hint: 'Latest Google model — preview, may change',
    speedTier: 'deep',
    maxOutputTokens: 65_536,
    capabilities: ['tool-use'],
  },
  // DeepSeek
  // V3 supports function calling; we expose tools. Watch the first few
  // Jyotish-tool-heavy turns — if malformed args appear, drop 'tool-use'.
  {
    id: 'deepseek-chat',
    provider: 'deepseek',
    label: 'DeepSeek V3',
    hint: 'Balanced, DeepSeek model',
    speedTier: 'balanced',
    maxOutputTokens: 8_192,
    capabilities: ['tool-use'],
  },
  // R1 is a reasoning model. Tools are intentionally disabled: R1's strength
  // is long-form analytical text, and tool-calling with R1 is unreliable in
  // practice. When selected, the server skips passing tools, and the model
  // answers from the chart context + reports folded into its conversation
  // history rather than live tool calls.
  {
    id: 'deepseek-reasoner',
    provider: 'deepseek',
    label: 'DeepSeek R1',
    hint: 'Deep reasoning, no tool-use',
    speedTier: 'deep',
    maxOutputTokens: 8_192,
    capabilities: [],
  },
]

// DeepSeek V3 is the default because it has working tool-use + low cost.
// A user's previously-picked model persists in localStorage per chart, so
// switching this default only affects new users / new charts.
export const DEFAULT_MODEL_ID = 'deepseek-chat'

/** Title generator is pinned to the cheapest-good model regardless of user pick. */
export const TITLE_MODEL_ID = 'claude-haiku-4-5'

const MODEL_INDEX: Record<string, ModelMeta> = Object.fromEntries(
  MODELS.map(m => [m.id, m])
)

export function getModelMeta(id: string): ModelMeta | undefined {
  return MODEL_INDEX[id]
}

export function isValidModelId(id: string): boolean {
  return id in MODEL_INDEX
}

export function supports(id: string, cap: Capability): boolean {
  return MODEL_INDEX[id]?.capabilities.includes(cap) ?? false
}

/** Group models by provider for UI rendering (preserves registry order). */
export function modelsByProvider(): Array<{ provider: Provider; models: ModelMeta[] }> {
  const groups = new Map<Provider, ModelMeta[]>()
  for (const m of MODELS) {
    if (!groups.has(m.provider)) groups.set(m.provider, [])
    groups.get(m.provider)!.push(m)
  }
  return Array.from(groups.entries()).map(([provider, models]) => ({ provider, models }))
}

export const PROVIDER_LABEL: Record<Provider, string> = {
  anthropic: 'Anthropic',
  google: 'Google',
  deepseek: 'DeepSeek',
}
