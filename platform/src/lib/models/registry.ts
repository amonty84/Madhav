/**
 * Model registry — data only. Safe to import from both client and server.
 * The provider SDKs (`@ai-sdk/anthropic`, `@ai-sdk/google`, `@ai-sdk/deepseek`,
 * `@ai-sdk/openai`) live in a separate `resolver.ts` so they are never bundled
 * into the client.
 */

export type Provider = 'anthropic' | 'google' | 'deepseek' | 'openai'
export type Capability = 'tool-use' | 'prompt-caching'
export type SpeedTier = 'fast' | 'balanced' | 'deep'

/**
 * BHISMA-B1 ADR-1: each model declares whether it can serve as a worker
 * (planning/routing/title generation), synthesis (final answer), or both.
 * Workers are the cheapest model in their family; synthesis models include
 * the full set the user may pick from.
 */
export type ModelRole = 'worker' | 'synthesis' | 'both'

/**
 * BHISMA-B1 ADR-2: o-series reasoning models (o1, o3, o4-mini) require a
 * separate calling convention — no system prompt, no temperature param,
 * no tool-use for o1/o3, no streaming for o1. Standard models follow the
 * usual streamText / generateText path.
 */
export type CallingConvention = 'standard' | 'reasoning'

export interface ModelMeta {
  id: string
  label: string
  hint: string
  provider: Provider
  speedTier: SpeedTier
  maxOutputTokens: number
  capabilities: Capability[]
  role: ModelRole
  callingConvention: CallingConvention
  /** USD cost per 1M input tokens — used by trace cost panel + telemetry. */
  costPer1MInput: number
  /** USD cost per 1M output tokens. */
  costPer1MOutput: number
  /**
   * False only for o1 today: the Responses API streams reasoning tokens but the
   * AI SDK exposes a single chunk. When false, synthesis must use generateText
   * and emit a non-streaming response. Defaults to true at lookup time.
   */
  supportsStreaming?: boolean
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
    role: 'both',
    callingConvention: 'standard',
    costPer1MInput: 1.00,
    costPer1MOutput: 5.00,
  },
  {
    id: 'claude-sonnet-4-6',
    provider: 'anthropic',
    label: 'Sonnet 4.6',
    hint: 'Balanced (default)',
    speedTier: 'balanced',
    maxOutputTokens: 64_000,
    capabilities: ['tool-use', 'prompt-caching'],
    role: 'synthesis',
    callingConvention: 'standard',
    costPer1MInput: 3.00,
    costPer1MOutput: 15.00,
  },
  {
    id: 'claude-opus-4-7',
    provider: 'anthropic',
    label: 'Opus 4.7',
    hint: 'Deepest analysis, slower',
    speedTier: 'deep',
    maxOutputTokens: 64_000,
    capabilities: ['tool-use', 'prompt-caching'],
    role: 'synthesis',
    callingConvention: 'standard',
    costPer1MInput: 15.00,
    costPer1MOutput: 75.00,
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
    role: 'both',
    callingConvention: 'standard',
    costPer1MInput: 0.075,
    costPer1MOutput: 0.30,
  },
  {
    id: 'gemini-2.5-pro',
    provider: 'google',
    label: 'Gemini 2.5 Pro',
    hint: 'Deep reasoning, Google model',
    speedTier: 'deep',
    maxOutputTokens: 65_536,
    capabilities: ['tool-use'],
    role: 'synthesis',
    callingConvention: 'standard',
    costPer1MInput: 1.25,
    costPer1MOutput: 5.00,
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
    role: 'synthesis',
    callingConvention: 'standard',
    costPer1MInput: 1.25,
    costPer1MOutput: 5.00,
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
    role: 'both',
    callingConvention: 'standard',
    costPer1MInput: 0.27,
    costPer1MOutput: 1.10,
  },
  // R1 is a reasoning model that wraps its chain-of-thought in <think>...</think>
  // blocks. The strip-and-trace transform in single_model_strategy peels those
  // off the displayed stream while preserving them for the trace panel. Tool
  // use is intentionally disabled — R1's function-calling is unreliable in
  // practice; it answers from the chart context + reports folded into history.
  {
    id: 'deepseek-reasoner',
    provider: 'deepseek',
    label: 'DeepSeek R1',
    hint: 'Deep reasoning, no tool-use',
    speedTier: 'deep',
    maxOutputTokens: 8_192,
    capabilities: [],
    role: 'synthesis',
    callingConvention: 'standard',
    costPer1MInput: 0.55,
    costPer1MOutput: 2.19,
  },
  // OpenAI — GPT (standard tier)
  // gpt-4.1 is the April 2025 flagship; prompt-caching is automatic on OpenAI
  // (no explicit cache-control headers required) so 'prompt-caching' is omitted
  // from capabilities.
  {
    id: 'gpt-4.1',
    provider: 'openai',
    label: 'GPT-4.1',
    hint: 'OpenAI flagship',
    speedTier: 'deep',
    maxOutputTokens: 16_384,
    capabilities: ['tool-use'],
    role: 'synthesis',
    callingConvention: 'standard',
    costPer1MInput: 2.00,
    costPer1MOutput: 8.00,
  },
  {
    id: 'gpt-4o',
    provider: 'openai',
    label: 'GPT-4o',
    hint: 'OpenAI multimodal',
    speedTier: 'balanced',
    maxOutputTokens: 16_384,
    capabilities: ['tool-use'],
    role: 'synthesis',
    callingConvention: 'standard',
    costPer1MInput: 2.50,
    costPer1MOutput: 10.00,
  },
  {
    id: 'gpt-4o-mini',
    provider: 'openai',
    label: 'GPT-4o-mini',
    hint: 'OpenAI worker model',
    speedTier: 'fast',
    maxOutputTokens: 16_384,
    capabilities: ['tool-use'],
    role: 'both',
    callingConvention: 'standard',
    costPer1MInput: 0.15,
    costPer1MOutput: 0.60,
  },
  // OpenAI — reasoning tier (o-series)
  // The reasoning calling convention is enforced in single_model_strategy:
  // system prompt is folded into the first user message, temperature is
  // omitted, tools are gated by per-model capability. o1 also disables
  // streaming because the AI SDK exposes a single batch chunk for it.
  {
    id: 'o4-mini',
    provider: 'openai',
    label: 'o4-mini',
    hint: 'Reasoning, balanced cost',
    speedTier: 'balanced',
    maxOutputTokens: 16_384,
    capabilities: ['tool-use'],
    role: 'synthesis',
    callingConvention: 'reasoning',
    costPer1MInput: 1.10,
    costPer1MOutput: 4.40,
  },
  {
    id: 'o1',
    provider: 'openai',
    label: 'o1',
    hint: 'Deepest reasoning (no streaming)',
    speedTier: 'deep',
    maxOutputTokens: 32_768,
    capabilities: [],
    role: 'synthesis',
    callingConvention: 'reasoning',
    costPer1MInput: 15.00,
    costPer1MOutput: 60.00,
    supportsStreaming: false,
  },
  {
    id: 'o3',
    provider: 'openai',
    label: 'o3',
    hint: 'Deep reasoning',
    speedTier: 'deep',
    maxOutputTokens: 32_768,
    capabilities: [],
    role: 'synthesis',
    callingConvention: 'reasoning',
    costPer1MInput: 10.00,
    costPer1MOutput: 40.00,
  },
]

// DeepSeek V3 is the default because it has working tool-use + low cost.
// A user's previously-picked model persists in localStorage per chart, so
// switching this default only affects new users / new charts.
export const DEFAULT_MODEL_ID = 'deepseek-chat'

/** Title generator is pinned to the cheapest-good Anthropic model regardless
 *  of user pick. (Future: route titles through getWorkerForModel(userPick)
 *  so OpenAI users get gpt-4o-mini instead — gated on a separate flag.) */
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
  openai: 'OpenAI',
}

// ─────────────────────────────────────────────────────────────────────────────
// BHISMA-B1 §3.1 — Family-aware worker assignment
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The cheapest planning/worker model per family. When the user picks any
 * synthesis model, the planner and title generator should use the same
 * family's worker so the planning surface stays consistent with the chosen
 * provider — and so an OpenAI user isn't billed extra Anthropic API spend
 * for the worker step.
 */
export const FAMILY_WORKER: Record<Provider, string> = {
  anthropic: 'claude-haiku-4-5',
  google: 'gemini-2.5-flash',
  openai: 'gpt-4o-mini',
  deepseek: 'deepseek-chat',
}

const ULTIMATE_WORKER_FALLBACK = 'claude-haiku-4-5'

/**
 * Resolve the worker model that should pair with a given synthesis model.
 * Falls back to claude-haiku-4-5 if the synthesis model is unknown — the
 * caller is expected to validate the synthesis ID first via isValidModelId.
 */
export function getWorkerForModel(synthesisModelId: string): string {
  const meta = MODEL_INDEX[synthesisModelId]
  if (!meta) return ULTIMATE_WORKER_FALLBACK
  return FAMILY_WORKER[meta.provider] ?? ULTIMATE_WORKER_FALLBACK
}
