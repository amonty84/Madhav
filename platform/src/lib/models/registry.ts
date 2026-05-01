/**
 * Model registry — data only. Safe to import from both client and server.
 * The provider SDKs (`@ai-sdk/anthropic`, `@ai-sdk/google`, `@ai-sdk/deepseek`,
 * `@ai-sdk/openai`) live in a separate `resolver.ts` so they are never bundled
 * into the client.
 *
 * ── Design objective ───────────────────────────────────────────────────────
 * Every query response must be capable of Whole-Chart-Read: the synthesis
 * model receives ALL L2.5 artifacts (MSR 499 signals + UCN + CDLM + CGM + RM)
 * plus L1 FORENSIC data in a single unbroken context, without relevance-based
 * filtering at planning time. Relevance filtering at the planner stage creates
 * the risk of "missing the secret source" — a signal dismissed as irrelevant
 * that turns out to be the operative one. The 1M-context synthesis models
 * (DeepSeek-V4-Pro, Gemini-2.5-Pro) eliminate this risk: feed everything,
 * let the model decide what matters.
 *
 * Estimated full-corpus token load:
 *   MSR 499 signals    ~150K tokens
 *   UCN               ~ 50K tokens
 *   CDLM              ~ 30K tokens
 *   CGM               ~ 50K tokens
 *   RM                ~ 20K tokens
 *   L1 FORENSIC       ~ 30K tokens
 *   History + query   ~ 10K tokens
 *   ─────────────────────────────
 *   Total             ~340K tokens  ← fits comfortably in 1M context
 *
 * ── Three-tier family structure ────────────────────────────────────────────
 *   premium — flagship/deepest model; user-selectable for synthesis.
 *   mid     — balanced model; user-selectable for synthesis.
 *   worker  — cheapest model in the family; used for planner + title generation.
 *             Also user-selectable (fast/cheap chat), but labelled accordingly in UI.
 *
 * Every provider family must have exactly one model with tier='worker'; that model
 * is the canonical FAMILY_WORKER entry. All models use the standard AI SDK calling
 * convention (streamText with system message). No o-series / reasoning convention.
 *
 * ── Call-type routing ──────────────────────────────────────────────────────
 * CALL_TYPE_ROUTING maps each pipeline call type to { primary, fallback }.
 * Primary is tried first; fallback is used on rate-limit / timeout / error.
 * See CallType for the full taxonomy.
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
  /**
   * Maximum number of INPUT tokens the model accepts (context window).
   * Omit for models where the limit is not a design constraint (<200K).
   * Explicitly set for 1M-context models to enable Whole-Chart-Read routing.
   */
  maxInputTokens?: number
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
    hint: 'Gemini Stack planner + context assembly — 1M context, $0.075 input',
    speedTier: 'balanced',
    maxInputTokens: 1_000_000,
    maxOutputTokens: 65_536,
    capabilities: ['tool-use'],
    role: 'both',
    costPer1MInput: 0.075,
    costPer1MOutput: 0.30,
  },
  {
    id: 'gemini-2.5-pro',
    provider: 'google',
    tier: 'premium',
    label: 'Gemini 2.5 Pro',
    hint: 'Gemini Stack synthesis — 2M context, largest window of all stacks',
    speedTier: 'deep',
    maxInputTokens: 2_000_000,  // Largest context of any stack — full corpus + headroom
    maxOutputTokens: 65_536,
    capabilities: ['tool-use'],
    role: 'synthesis',
    costPer1MInput: 1.25,       // $1.25 up to 200K input; $2.50 above 200K
    costPer1MOutput: 10.00,
  },


  // ── DeepSeek ────────────────────────────────────────────────────────────────
  // Current:   deepseek-v4-pro (synthesis, thinking)  |  deepseek-v4-flash (worker)
  // Deprecated: deepseek-chat (→ V4 Flash alias, retires 2026-07-24)
  //             deepseek-reasoner (→ V4 Pro thinking alias, retires 2026-07-24)
  //
  // V4 Pro: 1.6T/49B active MoE, dual mode (thinking / non-thinking), 1M context.
  // V4 Flash: 1M context, non-thinking only, $0.14/$0.28 — used as planner+worker.
  // R1-style <think> middleware is NO LONGER NEEDED for V4 Pro — the model exposes
  // thinking natively via the 'thinking' parameter on the API call.
  {
    // DeepSeek Stack synthesis model. 1.6T/49B, 1M context, dual mode.
    // Use thinking=true for deep synthesis; thinking=false for planner calls
    // to get fast structured JSON without CoT overhead.
    id: 'deepseek-v4-pro',
    provider: 'deepseek',
    tier: 'premium',
    label: 'DeepSeek V4 Pro',
    hint: 'DeepSeek Stack synthesis — 1.6T params, 1M context, thinking mode',
    speedTier: 'deep',
    maxInputTokens: 1_000_000,
    maxOutputTokens: 32_768,
    capabilities: ['tool-use'],
    role: 'synthesis',
    costPer1MInput: 1.74,   // post-promo (promo at $0.44 until 2026-05-31)
    costPer1MOutput: 3.48,
  },
  {
    // DeepSeek Stack worker + planner + context_assembly model.
    // Non-thinking only; 1M context at $0.14/$0.28 — cheapest 1M-ctx model available.
    id: 'deepseek-v4-flash',
    provider: 'deepseek',
    tier: 'mid',
    label: 'DeepSeek V4 Flash',
    hint: 'DeepSeek Stack planner/worker — 1M context, $0.14 input',
    speedTier: 'fast',
    maxInputTokens: 1_000_000,
    maxOutputTokens: 8_192,
    capabilities: ['tool-use'],
    role: 'both',
    costPer1MInput: 0.14,
    costPer1MOutput: 0.28,
  },
  // ── DeepSeek legacy aliases (DEPRECATED — retire 2026-07-24) ─────────────
  // deepseek-chat now routes to deepseek-v4-flash (non-thinking) on DeepSeek's API.
  // deepseek-reasoner now routes to deepseek-v4-pro (thinking) on DeepSeek's API.
  // Kept here for backward compatibility with existing conversations that
  // persisted these model IDs in localStorage. Remove after 2026-07-24.
  {
    id: 'deepseek-chat',
    provider: 'deepseek',
    tier: 'mid',
    label: 'DeepSeek V3 (deprecated)',
    hint: '⚠ Deprecated alias → V4 Flash. Will stop working 2026-07-24.',
    speedTier: 'balanced',
    maxOutputTokens: 8_192,
    capabilities: ['tool-use'],
    role: 'both',
    costPer1MInput: 0.14,   // now routes to V4 Flash pricing
    costPer1MOutput: 0.28,
  },
  {
    id: 'deepseek-reasoner',
    provider: 'deepseek',
    tier: 'premium',
    label: 'DeepSeek R1 (deprecated)',
    hint: '⚠ Deprecated alias → V4 Pro thinking. Will stop working 2026-07-24.',
    speedTier: 'deep',
    maxOutputTokens: 8_192,
    capabilities: [],
    role: 'synthesis',
    costPer1MInput: 1.74,   // now routes to V4 Pro pricing
    costPer1MOutput: 3.48,
  },

  // ── OpenAI — GPT ────────────────────────────────────────────────────────────
  // GPT Stack: gpt-4.1 (synthesis)  |  gpt-4.1-mini (planner)  |  gpt-4.1-nano (worker)
  // All three GPT-4.1 family models support 1M context window.
  //
  // Legacy: gpt-4o, gpt-4o-mini retained for backward compat (128K context, not
  // suitable for Whole-Chart-Read synthesis). Not part of the GPT stack routing.
  //
  // Prompt-caching on OpenAI is automatic (no explicit headers); cache reads
  // billed at 25% of standard input price.
  {
    // GPT Stack synthesis model. 1M context, best instruction following in the family.
    id: 'gpt-4.1',
    provider: 'openai',
    tier: 'premium',
    label: 'GPT-4.1',
    hint: 'GPT Stack synthesis — 1M context, best instruction following',
    speedTier: 'deep',
    maxInputTokens: 1_000_000,
    maxOutputTokens: 16_384,
    capabilities: ['tool-use'],
    role: 'synthesis',
    costPer1MInput: 2.00,
    costPer1MOutput: 8.00,
  },
  {
    // GPT Stack planner_deep + planner_fast + context_assembly model.
    // 1M context at $0.40/$1.60 — strong reasoning at mid cost.
    id: 'gpt-4.1-mini',
    provider: 'openai',
    tier: 'mid',
    label: 'GPT-4.1 mini',
    hint: 'GPT Stack planner + context assembly — 1M context, $0.40 input',
    speedTier: 'balanced',
    maxInputTokens: 1_000_000,
    maxOutputTokens: 16_384,
    capabilities: ['tool-use'],
    role: 'both',
    costPer1MInput: 0.40,
    costPer1MOutput: 1.60,
  },
  {
    // GPT Stack worker model. 1M context at $0.05/$0.20 — cheapest OpenAI model.
    id: 'gpt-4.1-nano',
    provider: 'openai',
    tier: 'worker',
    label: 'GPT-4.1 nano',
    hint: 'GPT Stack worker — 1M context, $0.05 input (title gen + summarization)',
    speedTier: 'fast',
    maxInputTokens: 1_000_000,
    maxOutputTokens: 16_384,
    capabilities: ['tool-use'],
    role: 'both',
    costPer1MInput: 0.05,
    costPer1MOutput: 0.20,
  },
  // ── OpenAI legacy models (pre-GPT-4.1 era, 128K context) ───────────────────
  // Not part of the GPT stack routing; retained for backward compat with
  // existing conversations that persisted these model IDs in localStorage.
  {
    id: 'gpt-4o-mini',
    provider: 'openai',
    tier: 'worker',
    label: 'GPT-4o mini (legacy)',
    hint: 'Legacy OpenAI worker — 128K context. Prefer gpt-4.1-nano.',
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
    label: 'GPT-4o (legacy)',
    hint: 'Legacy OpenAI model — 128K context. Prefer gpt-4.1.',
    speedTier: 'balanced',
    maxOutputTokens: 16_384,
    capabilities: ['tool-use'],
    role: 'synthesis',
    costPer1MInput: 2.50,
    costPer1MOutput: 10.00,
  },

  // ── NVIDIA NIM — full model stack ────────────────────────────────────────────
  // All models served via NVIDIA's free endpoint (https://integrate.api.nvidia.com/v1).
  // Cost fields reflect the free tier ($0.00) — update if billing is activated.
  //
  // Three models are user-selectable for synthesis (role='synthesis'|'both');
  // three are internal-only planners (role='planner'):
  //
  // Synthesis routing (when user picks a NIM synthesis model):
  //   deepseek-ai/deepseek-v4-pro     — 1.6T params, 1M context, Think Max CoT
  //   nvidia/llama-3.1-nemotron-ultra-253b-v1 — 253B, 128K, 97% MATH-500
  //   moonshotai/kimi-k2-instruct     — 1T/32B MoE, 256K, agent swarm
  //
  // Planner routing (internal, via getNvidiaPlanner / getNvidiaContextAssembler):
  //   multi_domain | remedial | holistic → nemotron-ultra-253b  (deep CoT, precision)
  //   planetary | dasha | transit        → qwen3-235b-a22b      (fast structured JSON)
  //   context_assembly                   → nemotron-3-super-120b (1M, RULER-1M 91.64)
  //   summarization / fallback           → llama-3.1-8b         (worker)

  // — User-selectable synthesis models —
  {
    // PRIMARY SYNTHESIS MODEL (CALL_TYPE_ROUTING.synthesis.primary).
    // 1.6T total / 49B active MoE. 1M-token context window.
    // Three reasoning modes: Non-think (fast) | Think High | Think Max (full CoT).
    // Largest model on NIM — can receive entire MARSYS L2.5 corpus (~340K tokens)
    // in one unbroken context, enabling true Whole-Chart-Read without chunking.
    id: 'deepseek-ai/deepseek-v4-pro',
    provider: 'nvidia',
    tier: 'premium',
    label: 'DeepSeek V4 Pro (NIM)',
    hint: 'Primary synthesis — 1.6T params, 1M context, Think Max, Whole-Chart-Read',
    speedTier: 'deep',
    maxInputTokens: 1_000_000,  // Whole-Chart-Read: full L2.5 corpus in one pass
    maxOutputTokens: 32_768,
    capabilities: ['tool-use'],
    role: 'synthesis',
    costPer1MInput: 0.00,
    costPer1MOutput: 0.00,
  },
  {
    // Dual-use: user-selectable synthesis AND internal deep planner.
    // 253B dense params, 128K context. Beats DeepSeek R1 on GPQA Diamond.
    // 97% MATH-500 — optimal for mathematical signal weighting in Jyotish synthesis.
    id: 'nvidia/llama-3.1-nemotron-ultra-253b-v1',
    provider: 'nvidia',
    tier: 'premium',
    label: 'Nemotron Ultra 253B',
    hint: 'NVIDIA flagship — 253B CoT, 97% MATH-500, 128K context',
    speedTier: 'deep',
    maxOutputTokens: 32_768,
    capabilities: ['tool-use'],
    role: 'both',
    costPer1MInput: 0.00,
    costPer1MOutput: 0.00,
  },
  {
    // Dual-use: user-selectable synthesis AND parallel orchestration (Wave 2).
    // 1T total / 32B active MoE, 256K context. Agent swarm: 100 parallel agents,
    // 1,500 simultaneous tool calls — maps directly to UQE parallel tool fetch.
    id: 'moonshotai/kimi-k2-instruct',
    provider: 'nvidia',
    tier: 'mid',
    label: 'Kimi K2 Instruct',
    hint: 'Moonshot AI — 1T MoE, 256K context, agent swarm orchestration',
    speedTier: 'balanced',
    maxOutputTokens: 32_768,
    capabilities: ['tool-use'],
    role: 'both',
    costPer1MInput: 0.00,
    costPer1MOutput: 0.00,
  },

  // — Internal planner-only models —
  {
    // CONTEXT ASSEMBLY MODEL (CALL_TYPE_ROUTING.context_assembly.primary).
    // 120B total / 12B active hybrid Mamba-Transformer.
    // 1M-token context window — PRACTICAL (linear-time Mamba layers, not quadratic
    // attention). RULER-1M score: 91.64 — highest long-context recall on NIM.
    // Used for the context_assembly pipeline step: receives all retrieved tool
    // outputs and compresses/reorders them before handing to synthesis.
    id: 'nvidia/nemotron-3-super-120b-a12b',
    provider: 'nvidia',
    tier: 'mid',
    label: 'Nemotron 3 Super 120B',
    hint: 'Context assembly — 1M practical context, RULER-1M 91.64 (internal only)',
    speedTier: 'balanced',
    maxInputTokens: 1_000_000,  // linear-time Mamba — 1M is practical, not theoretical
    maxOutputTokens: 65_536,
    capabilities: [],
    role: 'planner',
    costPer1MInput: 0.00,
    costPer1MOutput: 0.00,
  },
  {
    // Fast planner for single-domain queries. 235B total / 22B active MoE.
    // Excellent structured JSON output — used by per-tool planner for
    // planetary/dasha/transit query classes where latency matters.
    id: 'qwen/qwen3-235b-a22b',
    provider: 'nvidia',
    tier: 'mid',
    label: 'Qwen3 235B-A22B',
    hint: 'Fast MoE planner — 22B active, excellent JSON output (internal only)',
    speedTier: 'balanced',
    maxOutputTokens: 32_768,
    capabilities: ['tool-use'],
    role: 'planner',
    costPer1MInput: 0.00,
    costPer1MOutput: 0.00,
  },
  {
    // Summarization worker / fallback. Minimal latency, minimal cost.
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

// Default stack and synthesis model. New users / new charts start on the NIM
// stack (all free). A user's previously-persisted stack choice in localStorage
// overrides this. DEFAULT_MODEL_ID is now derived from the default stack —
// kept for backward compatibility with call sites that read it directly.
export const DEFAULT_STACK_ID = 'nim' as const
export const DEFAULT_MODEL_ID = 'deepseek-ai/deepseek-v4-pro' // NIM stack synthesis primary

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
 * @deprecated Since stack-based routing replaced individual model selection.
 * Use stackPicker() instead. Retained for any legacy UI components that still
 * render a per-model dropdown; remove once all UI is migrated to stackPicker().
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
  openai:    'gpt-4.1-nano',                     // tier=worker  $0.05/$0.20  (was gpt-4o-mini)
  deepseek:  'deepseek-v4-flash',                // tier=mid     $0.14/$0.28  (was deepseek-chat)
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
 *   multi_domain | remedial | holistic  → nemotron-ultra-253b-v1 (deep CoT, 97% MATH-500)
 *   planetary | dasha | transit         → qwen3-235b-a22b        (fast MoE, structured JSON)
 *   everything else                     → llama-3.1-8b-instruct  (worker, minimal latency)
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

/**
 * Return the NVIDIA NIM model to use for the context_assembly pipeline step.
 *
 * Nemotron 3 Super 120B is selected because:
 * - 1M-token context window (linear-time Mamba layers make this practical)
 * - RULER-1M score of 91.64 — highest long-context recall on NIM
 * - Hybrid Mamba-Transformer handles the full L1+L2.5 corpus in a single pass
 *   without chunking, preserving cross-document signal relationships
 *
 * Called by the context_assembly step when NVIDIA_PLANNER_ENABLED is true.
 */
export function getNvidiaContextAssembler(): string {
  return 'nvidia/nemotron-3-super-120b-a12b'
}

/**
 * Return the preferred NVIDIA NIM synthesis model.
 *
 * DeepSeek-V4-Pro is selected because:
 * - 1.6T total parameters / 49B active — largest model on NIM
 * - 1M-token context window — can ingest full MARSYS corpus (L1+L2.5+system)
 * - Think Max reasoning mode — full chain-of-thought for Jyotish synthesis
 *
 * This is the model the synthesis layer should use when the user selects any
 * NVIDIA NIM synthesis model and no specific override is provided.
 * Role='synthesis' in registry so it appears in synthesisPicker() under nvidia.
 */
export function getNvidiaSynthesisModel(): string {
  return 'deepseek-ai/deepseek-v4-pro'
}

// ─────────────────────────────────────────────────────────────────────────────
// Stack-based routing — replaces the individual model picker
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Every LLM call in the MARSYS pipeline belongs to exactly one CallType.
 *
 *  synthesis         — final answer generation; must support Whole-Chart-Read
 *                      (~340K token corpus); deepest reasoning required.
 *  planner_deep      — per-tool query planning for multi-domain / remedial /
 *                      holistic queries; mathematical precision matters.
 *  planner_fast      — per-tool query planning for single-domain planetary /
 *                      dasha / transit queries; structured JSON, low latency.
 *  context_assembly  — intermediate step that receives all tool outputs and
 *                      compresses/reorders them before synthesis; 1M context
 *                      required to hold the full retrieval result set.
 *  worker            — title generation, history summarization, any call where
 *                      minimal latency and minimal cost dominate.
 */
export type CallType =
  | 'synthesis'
  | 'planner_deep'
  | 'planner_fast'
  | 'context_assembly'
  | 'worker'

// ── ModelStack ────────────────────────────────────────────────────────────────

/**
 * A stack is a named, pre-configured bundle of models covering every pipeline
 * call type. The user selects a stack (not individual models) from the UI.
 * Switching stacks changes all call types simultaneously.
 *
 * Default stack: 'nim' — all calls free via NVIDIA NIM.
 */
export type ModelStack = 'nim' | 'anthropic' | 'gemini' | 'gpt' | 'deepseek'

export const STACK_LABEL: Record<ModelStack, string> = {
  nim:       'NIM Stack',
  anthropic: 'Anthropic Stack',
  gemini:    'Gemini Stack',
  gpt:       'GPT Stack',
  deepseek:  'DeepSeek Stack',
}

/** The provider whose models serve as primaries in each stack. */
export const STACK_PRIMARY_PROVIDER: Record<ModelStack, Provider> = {
  nim:       'nvidia',
  anthropic: 'anthropic',
  gemini:    'google',
  gpt:       'openai',
  deepseek:  'deepseek',
}

/**
 * Per-stack, per-call-type routing with primary and fallback model IDs.
 *
 * Fallback policy: the call site tries primary first; on rate-limit (429),
 * timeout, or provider error it retries immediately with fallback.
 * Both models in every pair satisfy the same functional floor:
 * — synthesis entries: both have ≥1M context (Whole-Chart-Read capable)
 * — context_assembly entries: both have ≥1M context
 * — planner / worker entries: both support tool-use where required
 *
 * ─── Stack synthesis context windows ────────────────────────────────────────
 *   NIM       deepseek-ai/deepseek-v4-pro    1M   free
 *   Anthropic claude-opus-4-7                1M   $5/$25 per 1M
 *   Gemini    gemini-2.5-pro                 2M   $1.25–$2.50/$10–$15 per 1M
 *   GPT       gpt-4.1                        1M   $2/$8 per 1M
 *   DeepSeek  deepseek-v4-pro                1M   $1.74/$3.48 per 1M (post-promo)
 */
export const STACK_ROUTING: Record<ModelStack, Record<CallType, { primary: string; fallback: string }>> = {

  // ── NIM Stack (all free via https://integrate.api.nvidia.com/v1) ─────────
  nim: {
    synthesis: {
      primary:  'deepseek-ai/deepseek-v4-pro',              // 1.6T/49B, 1M ctx, Think Max
      fallback: 'gemini-2.5-pro',                           // 2M ctx, paid fallback
    },
    planner_deep: {
      primary:  'nvidia/llama-3.1-nemotron-ultra-253b-v1',  // 253B, 128K, MATH-500 97%
      fallback: 'claude-sonnet-4-6',                        // 1M ctx, tool-use
    },
    planner_fast: {
      primary:  'qwen/qwen3-235b-a22b',                     // MoE 22B active, fast JSON
      fallback: 'gemini-2.0-flash-lite',                    // $0.015, tool-use
    },
    context_assembly: {
      primary:  'nvidia/nemotron-3-super-120b-a12b',        // 1M ctx, RULER-1M 91.64
      fallback: 'deepseek-ai/deepseek-v4-pro',              // 1M ctx, Think High
    },
    worker: {
      primary:  'meta/llama-3.1-8b-instruct',               // 8B, free, minimal latency
      fallback: 'claude-haiku-4-5',                         // prompt-caching, reliable
    },
  },

  // ── Anthropic Stack ───────────────────────────────────────────────────────
  // context_assembly MUST use Sonnet 4.6 or Opus 4.7 — Haiku 4.5 caps at 200K.
  anthropic: {
    synthesis: {
      primary:  'claude-opus-4-7',                          // 1M ctx, $5/$25, deepest
      fallback: 'claude-sonnet-4-6',                        // 1M ctx, $3/$15
    },
    planner_deep: {
      primary:  'claude-sonnet-4-6',                        // 1M ctx, tool-use, $3/$15
      fallback: 'claude-opus-4-7',                          // 1M ctx, overkill but reliable
    },
    planner_fast: {
      primary:  'claude-haiku-4-5',                         // 200K ctx, $1/$5, fast
      fallback: 'claude-sonnet-4-6',                        // 1M ctx fallback
    },
    context_assembly: {
      primary:  'claude-sonnet-4-6',                        // 1M ctx required
      fallback: 'claude-opus-4-7',                          // 1M ctx fallback
    },
    worker: {
      primary:  'claude-haiku-4-5',                         // $1/$5, prompt-caching
      fallback: 'claude-sonnet-4-6',                        // fallback if Haiku fails
    },
  },

  // ── Gemini Stack ──────────────────────────────────────────────────────────
  // Gemini 2.5 Pro has the largest context of any stack: 2M tokens.
  // Context caching available — 90% discount on repeated prompts.
  gemini: {
    synthesis: {
      primary:  'gemini-2.5-pro',                           // 2M ctx, $1.25–$2.50/$10–$15
      fallback: 'gemini-2.5-flash',                         // 1M ctx, $0.075/$0.30
    },
    planner_deep: {
      primary:  'gemini-2.5-flash',                         // 1M ctx, $0.075/$0.30
      fallback: 'gemini-2.5-pro',                           // 2M ctx, higher cost
    },
    planner_fast: {
      primary:  'gemini-2.5-flash',                         // 1M ctx, fast + cheap
      fallback: 'gemini-2.0-flash-lite',                    // $0.015, ultra-cheap
    },
    context_assembly: {
      primary:  'gemini-2.5-flash',                         // 1M ctx, cost-efficient
      fallback: 'gemini-2.5-pro',                           // 2M ctx fallback
    },
    worker: {
      primary:  'gemini-2.0-flash-lite',                    // $0.015/$0.06, tool-use
      fallback: 'gemini-2.5-flash',                         // 1M ctx fallback
    },
  },

  // ── GPT Stack ─────────────────────────────────────────────────────────────
  // Entire GPT-4.1 family supports 1M context. Automatic prompt caching
  // (no headers needed) at 75% discount on cached reads.
  gpt: {
    synthesis: {
      primary:  'gpt-4.1',                                  // 1M ctx, $2/$8
      fallback: 'gpt-4.1-mini',                             // 1M ctx, $0.40/$1.60
    },
    planner_deep: {
      primary:  'gpt-4.1-mini',                             // 1M ctx, $0.40/$1.60
      fallback: 'gpt-4.1',                                  // 1M ctx fallback
    },
    planner_fast: {
      primary:  'gpt-4.1-mini',                             // 1M ctx, balanced cost
      fallback: 'gpt-4.1-nano',                             // 1M ctx, $0.05/$0.20
    },
    context_assembly: {
      primary:  'gpt-4.1-mini',                             // 1M ctx, $0.40/$1.60
      fallback: 'gpt-4.1',                                  // 1M ctx fallback
    },
    worker: {
      primary:  'gpt-4.1-nano',                             // 1M ctx, $0.05/$0.20
      fallback: 'gpt-4.1-mini',                             // 1M ctx fallback
    },
  },

  // ── DeepSeek Stack (via api.deepseek.com) ────────────────────────────────
  // V4 Pro: thinking mode (CoT) for synthesis + deep planning.
  // V4 Flash: non-thinking, $0.14/$0.28, used for planner_fast / worker.
  // Both models have 1M context.
  deepseek: {
    synthesis: {
      primary:  'deepseek-v4-pro',                          // 1M ctx, thinking, $1.74/$3.48
      fallback: 'deepseek-v4-flash',                        // 1M ctx, non-thinking fallback
    },
    planner_deep: {
      primary:  'deepseek-v4-pro',                          // thinking=false for JSON speed
      fallback: 'deepseek-v4-flash',                        // cheaper fallback
    },
    planner_fast: {
      primary:  'deepseek-v4-flash',                        // $0.14/$0.28, fast JSON
      fallback: 'deepseek-v4-pro',                          // fallback with thinking=false
    },
    context_assembly: {
      primary:  'deepseek-v4-flash',                        // 1M ctx, cheapest option
      fallback: 'deepseek-v4-pro',                          // 1M ctx, thinking=false
    },
    worker: {
      primary:  'deepseek-v4-flash',                        // $0.14/$0.28, minimal latency
      fallback: 'deepseek-v4-pro',                          // fallback
    },
  },
}

/**
 * The canonical CALL_TYPE_ROUTING alias — resolves to the NIM stack, which is
 * the default. Call sites that are not yet stack-aware can use this directly;
 * stack-aware call sites should use STACK_ROUTING[selectedStack][callType].
 */
export const CALL_TYPE_ROUTING = STACK_ROUTING['nim']

/**
 * Return the primary and fallback model IDs for a given stack + call type.
 */
export function getStackModel(
  stack: ModelStack,
  callType: CallType,
): { primary: string; fallback: string } {
  return STACK_ROUTING[stack][callType]
}

/**
 * Convenience helper: return the primary model for a call type on a given stack.
 */
export function getPrimaryModel(stack: ModelStack, callType: CallType): string {
  return STACK_ROUTING[stack][callType].primary
}

/**
 * Convenience helper: return the fallback model for a call type on a given stack.
 */
export function getFallbackModel(stack: ModelStack, callType: CallType): string {
  return STACK_ROUTING[stack][callType].fallback
}

/**
 * Return all stacks as an array for the UI stack picker.
 * Each entry includes the stack ID, display label, synthesis model metadata,
 * and the synthesis context window — enough for a rich selector component.
 */
export function stackPicker(): Array<{
  stack: ModelStack
  label: string
  synthesisModelId: string
  synthesisContextWindow: number | undefined
  isDefault: boolean
}> {
  return (Object.keys(STACK_ROUTING) as ModelStack[]).map(stack => {
    const synthId = STACK_ROUTING[stack].synthesis.primary
    const meta = MODEL_INDEX[synthId]
    return {
      stack,
      label: STACK_LABEL[stack],
      synthesisModelId: synthId,
      synthesisContextWindow: meta?.maxInputTokens,
      isDefault: stack === DEFAULT_STACK_ID,
    }
  })
}

/**
 * Return true if this model has a 1M-token context window, making it eligible
 * for Whole-Chart-Read (feeding all L2.5 artifacts without chunking).
 */
export function supportsWholeChartRead(modelId: string): boolean {
  const meta = MODEL_INDEX[modelId]
  return (meta?.maxInputTokens ?? 0) >= 1_000_000
}
