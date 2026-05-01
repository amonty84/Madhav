/**
 * Model registry — data only. Safe to import from both client and server.
 * The provider SDKs (`@ai-sdk/anthropic`, `@ai-sdk/google`, `@ai-sdk/deepseek`,
 * `@ai-sdk/openai`) live in a separate `resolver.ts` so they are never bundled
 * into the client.
 *
 * Three-tier family structure (BHISMA Wave 2):
 *   premium — flagship/deepest model; user-selectable for synthesis.
 *   mid     — balanced model; user-selectable for synthesis.
 *   worker  — cheapest model in the family; used for planner + title generation.
 *             Also user-selectable (fast/cheap chat), but labelled accordingly in UI.
 *
 * Every provider family must have exactly one model with tier='worker'; that model
 * is the canonical FAMILY_WORKER entry. All models use the standard AI SDK calling
 * convention (streamText with system message). No o-series / reasoning convention.
 */

export type Provider = 'anthropic' | 'google' | 'deepseek' | 'openai' | 'nvidia'
export type Capability = 'tool-use' | 'prompt-caching'
export type SpeedTier = 'fast' | 'balanced' | 'deep'
export type ModelTier = 'premium' | 'mid' | 'worker'

/**
 * ADR-1: each model declares whether it can serve as a worker
 * (planning/routing/title generation), synthesis (final answer), or both.
 * Workers are the cheapest model in their family; synthesis models are the
 * full set exposed to the user for final-answer generation.
 */
/**
 * planner — NVIDIA NIM models used exclusively as internal planners; never
 * exposed to users for synthesis. Excluded from synthesisPicker() automatically
 * since that helper only includes 'synthesis' | 'both'.
 */
export type ModelRole = 'worker' | 'synthesis' | 'both' | 'planner'

export interface ModelMeta {
  id: string
  label: string
  hint: string
  provider: Provider
  /** Family tier — used by the UI picker and by FAMILY_WORKER assignment. */
  tier: ModelTier
  speedTier: SpeedTier
  maxOutputTokens: number
  capabilities: Capability[]
  role: ModelRole
  /** USD cost per 1M input tokens — used by trace cost panel + telemetry. */
  costPer1MInput: number
  /** USD cost per 1M output tokens. */
  costPer1MOutput: number
}

/**
 * Single source of truth for every model the app exposes to users. Add a new
 * model here and it appears in the picker, the command palette, validation,
 * and capability gating simultaneously.
 */
export const MODELS: ModelMeta[] = [
  // ── Anthropic — Claude ──────────────────────────────────────────────────────
  // Worker: haiku-4-5  |  Mid: sonnet-4-6  |  Premium: opus-4-7
  {
    id: 'claude-haiku-4-5',
    provider: 'anthropic',
    tier: 'worker',
    label: 'Haiku 4.5',
    hint: 'Fast & cost-effective — planner + quick answers',
    speedTier: 'fast',
    maxOutputTokens: 64_000,
    capabilities: ['tool-use', 'prompt-caching'],
    role: 'both',
    costPer1MInput: 1.00,
    costPer1MOutput: 5.00,
  },
  {
    id: 'claude-sonnet-4-6',
    provider: 'anthropic',
    tier: 'mid',
    label: 'Sonnet 4.6',
    hint: 'Balanced depth and speed',
    speedTier: 'balanced',
    maxOutputTokens: 64_000,
    capabilities: ['tool-use', 'prompt-caching'],
    role: 'synthesis',
    costPer1MInput: 3.00,
    costPer1MOutput: 15.00,
  },
  {
    id: 'claude-opus-4-7',
    provider: 'anthropic',
    tier: 'premium',
    label: 'Opus 4.7',
    hint: 'Deepest Jyotish analysis',
    speedTier: 'deep',
    maxOutputTokens: 64_000,
    capabilities: ['tool-use', 'prompt-caching'],
    role: 'synthesis',
    costPer1MInput: 15.00,
    costPer1MOutput: 75.00,
  },

  // ── Google — Gemini ─────────────────────────────────────────────────────────
  // Worker: gemini-2.0-flash-lite  |  Mid: gemini-2.5-flash  |  Premium: gemini-2.5-pro
  //
  // gemini-2.0-flash-lite is the dedicated planner/worker: $0.015/$0.06 per 1M,
  // supports tool-use, 1M context window, 8K max output.
  {
    id: 'gemini-2.0-flash-lite',
    provider: 'google',
    tier: 'worker',
    label: 'Gemini 2.0 Flash Lite',
    hint: 'Lightest Google model — planner + quick answers',
    speedTier: 'fast',
    maxOutputTokens: 8_192,
    capabilities: ['tool-use'],
    role: 'both',
    costPer1MInput: 0.015,
    costPer1MOutput: 0.06,
  },
  {
    id: 'gemini-2.5-flash',
    provider: 'google',
    tier: 'mid',
    label: 'Gemini 2.5 Flash',
    hint: 'Balanced Google model',
    speedTier: 'balanced',
    maxOutputTokens: 65_536,
    capabilities: ['tool-use'],
    role: 'synthesis',
    costPer1MInput: 0.075,
    costPer1MOutput: 0.30,
  },
  {
    id: 'gemini-2.5-pro',
    provider: 'google',
    tier: 'premium',
    label: 'Gemini 2.5 Pro',
    hint: 'Deepest Google analysis',
    speedTier: 'deep',
    maxOutputTokens: 65_536,
    capabilities: ['tool-use'],
    role: 'synthesis',
    costPer1MInput: 1.25,
    costPer1MOutput: 5.00,
  },

  // ── DeepSeek ────────────────────────────────────────────────────────────────
  // Worker + Mid: deepseek-chat (V3)  |  Premium: deepseek-reasoner (R1)
  //
  // DeepSeek's public API does not offer a sub-V3 worker model; V3 is already
  // inexpensive ($0.27/$1.10) and serves as both worker and mid tier.
  // R1 wraps chain-of-thought in <think>…</think> blocks — the strip-and-trace
  // transform in single_model_strategy peels those off the displayed stream
  // while preserving them for the trace panel. Tool-use disabled on R1 —
  // its function-calling is unreliable; it answers from folded chart context.
  {
    id: 'deepseek-chat',
    provider: 'deepseek',
    tier: 'mid',            // doubles as worker (FAMILY_WORKER points here)
    label: 'DeepSeek V3',
    hint: 'Balanced DeepSeek model — also used as planner',
    speedTier: 'balanced',
    maxOutputTokens: 8_192,
    capabilities: ['tool-use'],
    role: 'both',
    costPer1MInput: 0.27,
    costPer1MOutput: 1.10,
  },
  {
    id: 'deepseek-reasoner',
    provider: 'deepseek',
    tier: 'premium',
    label: 'DeepSeek R1',
    hint: 'Deep chain-of-thought reasoning',
    speedTier: 'deep',
    maxOutputTokens: 8_192,
    capabilities: [],
    role: 'synthesis',
    costPer1MInput: 0.55,
    costPer1MOutput: 2.19,
  },

  // ── OpenAI — GPT ────────────────────────────────────────────────────────────
  // Worker: gpt-4o-mini  |  Mid: gpt-4o  |  Premium: gpt-4.1
  //
  // gpt-4.1 (April 2025) is the current OpenAI flagship — better instruction
  // following and lower cost per quality than gpt-4o. Prompt-caching on OpenAI
  // is automatic (no explicit headers) so 'prompt-caching' is omitted from
  // capabilities. o-series (o1, o3, o4-mini) removed — incompatible with the
  // standard streamText calling convention and not suitable for Jyotish synthesis.
  {
    id: 'gpt-4o-mini',
    provider: 'openai',
    tier: 'worker',
    label: 'GPT-4o mini',
    hint: 'Lightest OpenAI model — planner + quick answers',
    speedTier: 'fast',
    maxOutputTokens: 16_384,
    capabilities: ['tool-use'],
    role: 'both',
    costPer1MInput: 0.15,
    costPer1MOutput: 0.60,
  },
  {
    id: 'gpt-4o',
    provider: 'openai',
    tier: 'mid',
    label: 'GPT-4o',
    hint: 'Balanced OpenAI model',
    speedTier: 'balanced',
    maxOutputTokens: 16_384,
    capabilities: ['tool-use'],
    role: 'synthesis',
    costPer1MInput: 2.50,
    costPer1MOutput: 10.00,
  },
  {
    id: 'gpt-4.1',
    provider: 'openai',
    tier: 'premium',
    label: 'GPT-4.1',
    hint: 'OpenAI flagship — best instruction following',
    speedTier: 'deep',
    maxOutputTokens: 16_384,
    capabilities: ['tool-use'],
    role: 'synthesis',
    costPer1MInput: 2.00,
    costPer1MOutput: 8.00,
  },

  // ── NVIDIA NIM — planner-only models ────────────────────────────────────────
  // These models are NOT user-selectable for synthesis (role='planner').
  // They are used exclusively as internal planners when NVIDIA_PLANNER_ENABLED=true,
  // routed by query class via getNvidiaPlanner(). All three are available on
  // NVIDIA's free NIM endpoint (https://integrate.api.nvidia.com/v1) —
  // cost fields reflect the free tier ($0.00), update when billing is activated.
  //
  // Routing:
  //   multi_domain | remedial | holistic  → nemotron-ultra-253b (deep CoT, 97% MATH-500)
  //   planetary | dasha | transit         → qwen3-235b-a22b    (MoE, fast structured JSON)
  //   summarization / fallback            → llama-3.1-8b       (worker, minimal latency)
  {
    id: 'nvidia/llama-3.1-nemotron-ultra-253b-v1',
    provider: 'nvidia',
    tier: 'premium',
    label: 'Nemotron Ultra 253B',
    hint: 'NVIDIA deep planner — 253B CoT, 97% MATH-500 (internal only)',
    speedTier: 'deep',
    maxOutputTokens: 32_768,
    capabilities: ['tool-use'],
    role: 'planner',
    costPer1MInput: 0.00,
    costPer1MOutput: 0.00,
  },
  {
    id: 'qwen/qwen3-235b-a22b',
    provider: 'nvidia',
    tier: 'mid',
    label: 'Qwen3 235B-A22B',
    hint: 'NVIDIA fast planner — MoE 22B active, excellent JSON (internal only)',
    speedTier: 'balanced',
    maxOutputTokens: 32_768,
    capabilities: ['tool-use'],
    role: 'planner',
    costPer1MInput: 0.00,
    costPer1MOutput: 0.00,
  },
  {
    id: 'meta/llama-3.1-8b-instruct',
    provider: 'nvidia',
    tier: 'worker',
    label: 'Llama 3.1 8B',
    hint: 'NVIDIA worker — summarization and lightweight planning (internal only)',
    speedTier: 'fast',
    maxOutputTokens: 8_192,
    capabilities: [],
    role: 'planner',
    costPer1MInput: 0.00,
    costPer1MOutput: 0.00,
  },
]

// DeepSeek V3 is the default because it has working tool-use + low cost.
// A user's previously-picked model persists in localStorage per chart, so
// switching this default only affects new users / new charts.
export const DEFAULT_MODEL_ID = 'deepseek-chat'

/**
 * Title generator always uses the worker of the same family as the user's
 * chosen synthesis model. Pinned to haiku-4-5 as the ultimate fallback.
 * Use getWorkerForModel(synthesisModelId) at the call site — this constant
 * is the fallback only.
 */
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

/**
 * Models available for user selection in the synthesis picker.
 * Returns all models with role='synthesis' or role='both', grouped by provider,
 * ordered premium → mid → worker within each group.
 */
export function synthesisPicker(): Array<{ provider: Provider; models: ModelMeta[] }> {
  const TIER_ORDER: Record<ModelTier, number> = { premium: 0, mid: 1, worker: 2 }
  return modelsByProvider().map(({ provider, models }) => ({
    provider,
    models: models
      .filter(m => m.role === 'synthesis' || m.role === 'both')
      .sort((a, b) => TIER_ORDER[a.tier] - TIER_ORDER[b.tier]),
  }))
}

export const PROVIDER_LABEL: Record<Provider, string> = {
  anthropic: 'Anthropic',
  google: 'Google',
  deepseek: 'DeepSeek',
  openai: 'OpenAI',
  nvidia: 'NVIDIA NIM',
}

// ─────────────────────────────────────────────────────────────────────────────
// BHISMA-B1 §3.1 — Family-aware worker assignment
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The worker model for each provider family, used for planning, title
 * generation, and any internal LLM call that does not require synthesis depth.
 *
 * Rule: FAMILY_WORKER[provider] must always point to the model in that family
 * with tier='worker'. When updating the registry, keep this map in sync.
 *
 * Note on DeepSeek: V3 (deepseek-chat) is tier='mid' in the registry because
 * there is no cheaper dedicated sub-V3 model in the DeepSeek public API.
 * It still serves as the DeepSeek worker — the tier field on the registry
 * entry reflects user-facing positioning; this map governs internal routing.
 */
export const FAMILY_WORKER: Record<Provider, string> = {
  anthropic: 'claude-haiku-4-5',                // tier=worker  $1.00/$5.00
  google:    'gemini-2.0-flash-lite',            // tier=worker  $0.015/$0.06
  openai:    'gpt-4o-mini',                      // tier=worker  $0.15/$0.60
  deepseek:  'deepseek-chat',                    // tier=mid (no cheaper option) $0.27/$1.10
  nvidia:    'meta/llama-3.1-8b-instruct',       // tier=worker  $0.00 (free NIM endpoint)
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

// ─────────────────────────────────────────────────────────────────────────────
// NVIDIA NIM — query-class-based planner routing
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Query classes that benefit from Nemotron Ultra's deep chain-of-thought.
 * Multi-domain, remedial, and holistic queries involve cross-layer reasoning
 * and mathematical signal weighting — the 253B CoT model excels here.
 */
export const NVIDIA_DEEP_PLANNER_QUERY_CLASSES = [
  'multi_domain',
  'remedial',
  'holistic',
] as const

/**
 * Query classes that benefit from Qwen3-235B's fast MoE inference.
 * Single-domain planetary/dasha/transit queries need tight structured JSON
 * output; Qwen3's 22B active params deliver high-quality JSON at low latency.
 */
export const NVIDIA_FAST_PLANNER_QUERY_CLASSES = [
  'planetary',
  'dasha',
  'transit',
] as const

/**
 * Return the NVIDIA NIM model ID most appropriate for the given query class.
 *
 * Called by the UQE planner when NVIDIA_PLANNER_ENABLED is true. The caller
 * is responsible for checking the feature flag — this function always returns
 * a valid model ID regardless.
 *
 * Routing table:
 *   multi_domain | remedial | holistic  → nemotron-ultra-253b-v1 (deep CoT)
 *   planetary | dasha | transit         → qwen3-235b-a22b        (fast MoE)
 *   everything else                     → llama-3.1-8b-instruct  (worker)
 */
export function getNvidiaPlanner(queryClass: string): string {
  if ((NVIDIA_DEEP_PLANNER_QUERY_CLASSES as readonly string[]).includes(queryClass)) {
    return 'nvidia/llama-3.1-nemotron-ultra-253b-v1'
  }
  if ((NVIDIA_FAST_PLANNER_QUERY_CLASSES as readonly string[]).includes(queryClass)) {
    return 'qwen/qwen3-235b-a22b'
  }
  return 'meta/llama-3.1-8b-instruct'
}
