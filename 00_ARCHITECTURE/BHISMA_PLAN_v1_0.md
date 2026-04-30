---
artifact: BHISMA_PLAN_v1_0.md
canonical_id: BHISMA_PLAN_v1_0
version: 1.0
status: CURRENT
authored_by: Claude (Cowork) 2026-05-01
macro_phase: M3 — Temporal Animation (pre-M3 infrastructure elevation)
project_code: BHISMA
---

# Project BHISMA — MARSYS-JIS Architecture Elevation Plan
## B H I S H M A — Build, Harden, Instrument, Synthesize, Model, Architect

> BHISMA is a pre-M3 infrastructure elevation sprint that runs in parallel
> with the first M3 temporal sessions. It does not block M3 — it elevates
> the platform on which M3 temporal work lands.

---

## §0 — Context and Motivation

After M2 CLOSE (KARN-W8-R2, 2026-05-01) the retrieval pipeline is live,
the corpus is activated, and 17 retrieval tools exist. However a rigorous
review of the codebase reveals that several critical foundations are either
broken, incomplete, or architecturally limiting in ways that will compound
as M3 temporal work begins:

**Critical (blocks quality):**
- The query router (`classify`) is likely always falling back to `router_confidence: 0.0`
  because `claude-haiku-4-5` model ID may not resolve to a valid API endpoint.
  Every query routes to the minimal fallback plan `['msr_sql', 'pattern_register']`,
  meaning all 15 other retrieval tools built in M2 are unreachable.
- The `context_assembly` step (which packs L1 + L2.5 tokens into the synthesis
  prompt) is never emitted as a trace event. The trace panel's most important
  section — showing what the model actually received — is permanently blank.
- `plan_per_tool` (PER_TOOL_PLANNER_ENABLED=false) means every tool call uses
  generic parameters. The retrieval quality multiplier built in W6-R2 is never used.

**Architectural (limits ceiling):**
- The `compose` step applies deterministic rules that override the LLM's intent.
  An LLM that understood "the user is asking about career transition in the
  upcoming Ketu MD" produces a query_class but the rules ignore the nuance.
- The model registry has only one OpenAI model (GPT-4.1). No GPT-4o, no
  GPT-4o-mini, no o-series reasoning models. Users who select OpenAI get one option.
- There is no family-aware worker assignment — the Haiku worker is hardcoded
  in the router regardless of which synthesis model the user chose.
- LLM call failures are silently swallowed. The fallback plan produces a response
  that appears normal but is based on degraded routing. Users have no visibility.

**Observability (limits optimization):**
- The trace panel uses a cold GitHub-dark colour palette that clashes with the
  application's warm gold design system.
- No cost tracking per query. No latency baselines. No cross-query analytics.
- Synthesis-done step never emitted — synthesis latency untracked.
- No signal citation verification — responses may cite nothing from the corpus.

BHISMA addresses all of the above across three parallel streams.

---

## §1 — Complete Gap Inventory

### §1.1 — Pipeline gaps

| Gap ID | Severity | Description | Root cause |
|---|---|---|---|
| GAP.P.1 | CRITICAL | `router_confidence` always 0.0 — fallback plan on every query | `claude-haiku-4-5` model ID may not resolve; both LLM attempts fail schema validation silently |
| GAP.P.2 | CRITICAL | `context_assembly` step never emitted to trace | Step is performed inside `single_model_strategy.ts` but no `traceEmitter.emitStep` call exists there |
| GAP.P.3 | HIGH | `PER_TOOL_PLANNER_ENABLED=false` — every tool call is generic | Feature-flagged off; never smoke-tested end-to-end |
| GAP.P.4 | HIGH | `synthesis_done` step never emitted | `onFinish` in route.ts writes audit event but emits no synthesis completion trace step |
| GAP.P.5 | HIGH | Deterministic composition rules override LLM intent | `rule_composer.ts` assigns corpus assets by `query_class` only; query nuance is lost |
| GAP.P.6 | HIGH | Planning LLM has no retrieval tool capability spec | Router system prompt lists tool names but not their schemas, params, or optimal query patterns |
| GAP.P.7 | MEDIUM | Audit step has no trace event | `writeAuditEvent` fires in `onFinish` but is invisible in trace panel |
| GAP.P.8 | MEDIUM | Synthesis attribution not verified | Responses may contain zero MSR signal citations; audit does not check |
| GAP.P.9 | MEDIUM | EVAL baseline is STUB | `BASELINE_RUN_W7.json` is a stub; no pre-M3 performance baseline exists |
| GAP.P.10 | LOW | `bundle_load` step never emitted | Composition result is assembled but not shown in trace |
| GAP.P.11 | LOW | Validator results not surfaced in trace | `runAll` validation fires but result is not emitted as a trace step |

### §1.2 — Model family gaps

| Gap ID | Severity | Description |
|---|---|---|
| GAP.M.1 | HIGH | No family-aware worker assignment — Haiku hardcoded regardless of synthesis model |
| GAP.M.2 | HIGH | OpenAI registry incomplete: GPT-4o, GPT-4o-mini, o4-mini, o1, o3 all absent |
| GAP.M.3 | HIGH | o-series reasoning models require different calling convention (no system prompt, no temperature) — not handled |
| GAP.M.4 | HIGH | LLM call failures are swallowed silently; fallback plan looks identical to a successful plan in the UI |
| GAP.M.5 | MEDIUM | DeepSeek R1 reasoning blocks (`<think>…</think>`) not stripped or surfaced in trace |
| GAP.M.6 | MEDIUM | No model health check at startup; dead model IDs only fail at first query |
| GAP.M.7 | MEDIUM | Gemini calling convention diverges from Anthropic (system prompt placement, tool schema format) — untested in pipeline |
| GAP.M.8 | LOW | No cost-per-token registry for cost estimation in trace |
| GAP.M.9 | LOW | `TITLE_MODEL_ID` hardcoded to Haiku regardless of provider family |

### §1.3 — Trace and observability gaps

| Gap ID | Severity | Description |
|---|---|---|
| GAP.T.1 | HIGH | Trace panel uses cold GitHub-dark palette — clashes with warm gold design system |
| GAP.T.2 | HIGH | Query DNA section absent — full QueryPlan (class, domains, graph seeds, tools, rationale) not displayed |
| GAP.T.3 | HIGH | Context assembly section always blank (feeds on GAP.P.2) |
| GAP.T.4 | HIGH | No per-tool retrieval scorecard (signal distribution, score spread, efficiency ratio) |
| GAP.T.5 | MEDIUM | No synthesis quality indicators (signal citation count, output shape compliance) |
| GAP.T.6 | MEDIUM | No cost breakdown per query |
| GAP.T.7 | MEDIUM | No latency decomposition chart (classify vs tool-fetch vs synthesis TTFT vs synthesis complete) |
| GAP.T.8 | MEDIUM | History tab is a flat list — no cross-query analytics |
| GAP.T.9 | MEDIUM | Plan-per-tool overrides not shown in trace even when enabled |
| GAP.T.10 | LOW | Chunk preview requires double-click (undiscoverable) |
| GAP.T.11 | LOW | No live token counter during synthesis streaming |
| GAP.T.12 | LOW | No inline response quality feedback (thumbs) wired to audit table with trace context |

### §1.4 — Architecture / design gaps (longer horizon)

| Gap ID | Severity | Description |
|---|---|---|
| GAP.A.1 | HIGH | Two-stage classify+compose is lossy — query nuance present at classify is discarded by compose |
| GAP.A.2 | HIGH | No retrieval tool capability spec — planning LLM cannot produce optimized per-tool parameters |
| GAP.A.3 | MEDIUM | Mandatory composition rules block LLM from exercising data-sourcing accountability |
| GAP.A.4 | MEDIUM | Discovery register freshness unverified post-M2 corpus corrections |
| GAP.A.5 | LOW | consume-tools.ts (synthesis LLM tools) and pipeline retrieval tools are separate but undocumented distinction |
| GAP.A.6 | LOW | Token budget enforcement in `enforceTokenBudget` uses `tokenFor()` that always returns 0 — budget never enforced |

---

## §2 — Architecture Decisions Record

### ADR-1: Multi-family worker model assignment

**Decision:** Each model family has exactly one designated worker model. The worker is
the cheapest, fastest model in that family. When the user selects any synthesis
model, the system resolves the worker from the same family automatically.

```
Family         Worker (planning/routing)     Synthesis options
──────────────────────────────────────────────────────────────
anthropic      claude-haiku-4-5              haiku-4-5 / sonnet-4-6 / opus-4-7
google         gemini-2.5-flash              gemini-2.5-flash / gemini-2.5-pro /
                                             gemini-3-pro-preview
openai         gpt-4o-mini                   gpt-4o / gpt-4.1 / o4-mini / o1 / o3
deepseek       deepseek-chat (V3)            deepseek-chat (V3) / deepseek-reasoner (R1)
```

**Rationale:** The user's choice of synthesis model expresses which provider's
intelligence they want for the final answer. The routing and planning work
(classify, per-tool optimization) should use the same provider's cheapest model
for consistency and because the planning LLM's job is structured output generation,
not deep reasoning.

### ADR-2: OpenAI o-series calling convention

**Decision:** o-series models (o1, o3, o4-mini) use a separate calling path:
- System prompt omitted (instructions folded into first user message)
- Temperature omitted (o-series ignores it or errors)
- Streaming: o1 does NOT support streaming — response waits for full generation;
  o3 and o4-mini support streaming. When o1 is selected, synthesis uses `generateText`
  and emits a single chunk rather than a stream.
- Tool use: o4-mini supports tools; o1 and o3 do not reliably — tool-use capability
  flag must be set correctly per model in the registry.

The resolver must gate on `isReasoningModel(modelId)` to pick the right calling path.

### ADR-3: Failure is loud, never silent

**Decision:** When any LLM call in the pipeline fails (network error, invalid model,
schema validation failure after 2 attempts, rate limit), the pipeline halts immediately
and returns a structured error to the client. The error is:
- Emitted as a `step_error` event to the trace panel
- Returned as a user-visible error message in the chat UI (not a degraded response)
- Logged to the telemetry/audit system with the failure reason

The silent fallback plan (current behavior) is removed. Users always know when
something went wrong.

### ADR-4: FORENSIC mandatory floor

**Decision:** The native's FORENSIC birth chart data is always included in the
synthesis context, regardless of what the planning LLM decides. Everything else
— MSR, UCN, CGM, domain reports, remedial codex — is the planning LLM's call.

This ensures that no query about the native can produce a response without the
foundational chart facts. It is not a composition rule; it is a hard pre-load
that runs before the planning step receives the manifest.

### ADR-5: LLM-first planning replaces classify + compose + plan_per_tool

**Decision:** The three-step (classify → compose → plan_per_tool) pipeline is
replaced by a single **Plan** step. The planning LLM receives:
1. Query + last 3 conversation turns
2. Chart context summary (name, birth date/time/place, active dasha)
3. Current date (for temporal reasoning)
4. Condensed **Retrieval Capability Spec** — per retrieval tool: description,
   available fields/params, optimal query patterns, cost estimate
5. Audience tier

The planning LLM outputs a **rich QueryPlan** with per-tool parameter specifications.
The deterministic `rule_composer.ts` composition rules are retired. The `plan_per_tool`
step is merged into the single planning call.

Timing: this architectural change is BHISMA Stream 2, Wave B2.

### ADR-6: Token budget enforcement fixed in same session

**Decision:** `enforceTokenBudget` in `rule_composer.ts` uses `tokenFor()` which always
returns 0 (manifest entries don't carry `token_count` yet). Budget enforcement is a
no-op. BHISMA Stream 2 must populate `token_count` in the manifest for all major assets
and fix `tokenFor()` to read it. This is required before the LLM-first planning step
can make cost-aware tool selection decisions.

---

## §3 — Stream 1: Model Family Infrastructure + Error Transparency

**Wave:** KARN-W9-B1 (parallel to B2 and B3)
**Owner:** Claude Code session 1 of 3

### §3.1 — Model registry expansion

Add to `platform/src/lib/models/registry.ts`:

New type concepts:
```typescript
export type ModelRole = 'worker' | 'synthesis' | 'both'
export type CallingConvention = 'standard' | 'reasoning'  // reasoning = o-series

interface ModelMeta {
  // ... existing fields ...
  role: ModelRole                    // NEW: worker / synthesis / both
  callingConvention: CallingConvention  // NEW: standard | reasoning
  costPer1MInput: number             // NEW: USD per 1M input tokens (for cost tracking)
  costPer1MOutput: number            // NEW: USD per 1M output tokens
  workerModelId?: string             // NEW: for synthesis models — which worker to pair with
}
```

Models to add (OpenAI full suite):
```typescript
// OpenAI standard tier
{ id: 'gpt-4o',      provider: 'openai', label: 'GPT-4o',      role: 'synthesis', callingConvention: 'standard', capabilities: ['tool-use'], speedTier: 'balanced', maxOutputTokens: 16_384, costPer1MInput: 2.50, costPer1MOutput: 10.00 }
{ id: 'gpt-4o-mini', provider: 'openai', label: 'GPT-4o-mini', role: 'worker',    callingConvention: 'standard', capabilities: ['tool-use'], speedTier: 'fast',     maxOutputTokens: 16_384, costPer1MInput: 0.15, costPer1MOutput: 0.60 }
// OpenAI reasoning tier
{ id: 'o4-mini', provider: 'openai', label: 'o4-mini', role: 'synthesis', callingConvention: 'reasoning', capabilities: ['tool-use'], speedTier: 'balanced', maxOutputTokens: 16_384, costPer1MInput: 1.10,  costPer1MOutput: 4.40 }
{ id: 'o1',      provider: 'openai', label: 'o1',      role: 'synthesis', callingConvention: 'reasoning', capabilities: [],           speedTier: 'deep',     maxOutputTokens: 32_768, costPer1MInput: 15.00, costPer1MOutput: 60.00 }
{ id: 'o3',      provider: 'openai', label: 'o3',      role: 'synthesis', callingConvention: 'reasoning', capabilities: [],           speedTier: 'deep',     maxOutputTokens: 32_768, costPer1MInput: 10.00, costPer1MOutput: 40.00 }
```

Update existing models to add `role`, `callingConvention`, `costPer1MInput`, `costPer1MOutput`.

Worker assignment map (new export):
```typescript
export const FAMILY_WORKER: Record<Provider, string> = {
  anthropic: 'claude-haiku-4-5',
  google:    'gemini-2.5-flash',
  openai:    'gpt-4o-mini',
  deepseek:  'deepseek-chat',
}

export function getWorkerForModel(modelId: string): string {
  const meta = getModelMeta(modelId)
  if (!meta) return 'claude-haiku-4-5'  // ultimate fallback
  return FAMILY_WORKER[meta.provider] ?? 'claude-haiku-4-5'
}
```

### §3.2 — Resolver: reasoning model calling convention

Add `platform/src/lib/models/resolver.ts` logic for o-series:

```typescript
export function isReasoningModel(modelId: string): boolean {
  return getModelMeta(modelId)?.callingConvention === 'reasoning'
}

// Used by router.ts to route planning calls to correct worker
export function resolveWorkerModel(synthesisModelId: string): string {
  return getWorkerForModel(synthesisModelId)
}
```

The `classify` function in `router.ts` must call `resolveWorkerModel(selectedModel)`
to get the correct worker, rather than reading `ROUTER_MODEL_OVERRIDE` env as first
choice (or make the env override the family-resolved default).

For synthesis, `route.ts` must gate on `isReasoningModel`:
```typescript
if (isReasoningModel(modelId)) {
  // generateText path (not streamText) for o1
  // no system message; fold system prompt into first user message
  // no temperature param
  // no tool-use for o1/o3
}
```

### §3.3 — Hard-fail error transparency

**Remove** the silent fallback plan in `router.ts`:
```typescript
// REMOVE: the buildFallbackPlan call on schema validation failures
// REPLACE WITH: throw a PipelineError with structured reason
```

New `PipelineError` class:
```typescript
export class PipelineError extends Error {
  constructor(
    public readonly stage: 'classify' | 'compose' | 'tool_fetch' | 'synthesis',
    public readonly reason: string,
    public readonly model_id?: string,
    public readonly provider?: string,
  ) {
    super(`[${stage}] ${reason}`)
  }
}
```

In `route.ts`, the outer `try/catch` must:
1. Emit a `step_error` trace event with the failure stage and reason
2. Return a structured JSON error response (not a 500 with a raw message):
```json
{
  "error": "pipeline_stage_failed",
  "stage": "classify",
  "reason": "Model claude-haiku-4-5 returned invalid JSON after 2 attempts",
  "model_id": "claude-haiku-4-5",
  "provider": "anthropic",
  "query_id": "...",
  "user_message": "The planning step failed. Please try again or switch to a different model."
}
```
3. The UI displays this structured error in the chat message area (not a blank response).

### §3.4 — DeepSeek R1 reasoning block handling

DeepSeek R1 (`deepseek-reasoner`) produces responses with `<think>…</think>` blocks
before the actual answer. These must be:
- Stripped from the displayed response text
- Optionally surfaced in the trace panel as a `reasoning_trace` payload field
  (useful for debugging; hidden from end users by default)

Implement in `single_model_strategy.ts`: post-process R1 output to extract and
separate the think block before passing to the UI message stream.

### §3.5 — Model health check at startup

Add `platform/src/lib/models/health.ts`:
- On first server startup (or on-demand via admin API), ping each configured
  provider's cheapest model with a minimal prompt
- Record pass/fail in an in-memory `MODEL_HEALTH` map
- Expose via `/api/admin/model-health` endpoint
- If a model in `FAMILY_WORKER` is unhealthy at request time, return a pipeline
  error rather than attempting the call

### §3.6 — Cost tracking

Add `platform/src/lib/telemetry/cost.ts`:
```typescript
export function estimateQueryCost(steps: TraceStep[]): {
  planning_usd: number
  synthesis_usd: number
  total_usd: number
}
```

This reads `input_tokens` and `output_tokens` from trace step `data_summary` fields
for LLM steps, multiplied by the cost rates from the model registry.

---

## §4 — Stream 2: LLM-First Intelligent Pipeline

**Wave:** KARN-W9-B2 (parallel to B1 and B3)
**Owner:** Claude Code session 2 of 3

### §4.1 — Retrieval Capability Spec (new artifact)

Create `platform/src/lib/router/retrieval_capability_spec.ts`:

A compact, machine-readable description of each retrieval tool that the planning
LLM reads to understand what data is available and how to query it optimally.

Structure per tool:
```typescript
export interface RetrievalCapabilityEntry {
  tool_name: string
  description: string          // what this tool retrieves in 1-2 sentences
  data_surface: string         // what schema/fields are available
  supported_params: string     // human-readable param list with types
  optimal_patterns: string[]   // 3-5 example query patterns showing best usage
  cost_tier: 'low' | 'medium' | 'high'  // relative token cost
  requires_temporal: boolean   // does this tool need dasha/transit context to be useful?
}
```

Example entries (to be authored for all 17 tools):

```
msr_sql:
  description: "Queries the Master Signal Register (499 signals) — the primary source
    of synthesis-grade astrological interpretations keyed to the native's chart."
  data_surface: "Fields: signal_id (SIG.MSR.NNN), domain, strength (0.0-1.0),
    houses[], planets[], signal_class (yoga/placement/aspect/temporal), yoga_name,
    temporal_activation_flag, chart_type, keywords[], derivation_note"
  supported_params: "domains[], house_filter[], planet_filter[], min_strength (float),
    signal_class (string), has_yoga (bool), temporal_active (bool),
    keywords[] (FTS), limit (int, default 50), order_by (strength|relevance)"
  optimal_patterns:
    - "Career + specific planets: domains=['career'], planet_filter=['Saturn','Mercury'], min_strength=0.65, limit=20"
    - "High-strength yoga signals: has_yoga=true, min_strength=0.75, order_by='strength', limit=15"
    - "Temporal activation scan: temporal_active=true, domains=['<domain>'], limit=25"
  cost_tier: medium
  requires_temporal: false

vector_search:
  description: "Semantic search over the entire embedded corpus — L1 facts, UCN sections,
    MSR signals, CDLM cells, domain reports. Best for open-ended, nuanced queries."
  data_surface: "Chunk text with metadata: doc_type, layer (L1/L2.5), signal_id (if MSR),
    source_canonical_id, similarity_score"
  supported_params: "query (semantic string — write this as a focused phrase, not the raw
    user query), doc_type[] (l1_fact|ucn_section|msr_signal|cdlm_cell|domain_report|rm_element),
    layer (L1|L2.5), top_k (int, default 20, max 50)"
  optimal_patterns:
    - "Fact lookup: query='Saturn placement 10th house authority career', doc_type=['l1_fact'], layer='L1', top_k=10"
    - "Synthesis retrieval: query='<specific theme from user query>', doc_type=['ucn_section','msr_signal'], top_k=20"
    - "Cross-layer: omit doc_type and layer for open retrieval across all corpus slices"
  cost_tier: medium
  requires_temporal: false

cgm_graph_walk:
  description: "Traverses the Chart Graph Model from seed CGM node IDs following typed
    edges. Best when query names specific planets, houses, yogas, or chart entities."
  data_surface: "Node fields: node_id, node_type, label, properties{}. Edge fields: edge_type,
    source, target, weight. Traversal returns subgraph up to depth."
  supported_params: "seed_nodes[] (CGM node IDs: PLN.SATURN, HSE.10, YOG.SARASWATI etc),
    edge_types[] (SUPPORTS|CONTRADICTS|DISPOSITED_BY|YOGA_MEMBERSHIP|DASHA_ACTIVATION|
    DIVISIONAL_CONFIRMATION|NAKSHATRA_LORD_IS|ASPECTS_3RD|ASPECTS_4TH|ASPECTS_8TH),
    max_depth (int, 1-5, default 3)"
  optimal_patterns:
    - "Dispositor chain: seed_nodes=['PLN.MERCURY'], edge_types=['DISPOSITED_BY'], max_depth=3"
    - "Pattern support web: seed_nodes=['YOG.SARASWATI'], edge_types=['SUPPORTS','YOGA_MEMBERSHIP'], max_depth=2"
    - "Contradiction surface: seed_nodes=['PLN.SATURN','PLN.JUPITER'], edge_types=['CONTRADICTS'], max_depth=2"
  cost_tier: medium
  requires_temporal: false
```

[… entries for all 17 tools to be authored in KARN-W9-B2 …]

### §4.2 — Unified Plan step

**New file:** `platform/src/lib/router/planner.ts`

Replace the three-step `classify` → `compose` → `planPerTool` chain with a single
`plan()` function:

```typescript
export interface PlanContext {
  query: string
  conversation_history: ConversationTurn[]
  chart_context: ChartContext            // name, birth data, current dasha
  current_date: string                   // ISO date — critical for temporal reasoning
  audience_tier: AudienceTier
  manifest_fingerprint: string
  synthesis_model_id: string             // so planner knows what family it is
}

export async function plan(
  context: PlanContext,
  config?: PlannerConfig,
): Promise<RichQueryPlan>
```

The `RichQueryPlan` extends the existing `QueryPlan` with:
```typescript
export interface RichQueryPlan extends QueryPlan {
  // New fields
  query_intent_summary: string        // 1-sentence summary of what user actually wants
  planning_rationale: string          // why these tools were selected
  synthesis_guidance: string          // instruction to synthesis LLM on angle/depth
  tool_calls: ToolCallSpec[]          // per-tool parameter specifications
  planning_model_id: string           // which worker model was used for planning
  planning_latency_ms: number
}

export interface ToolCallSpec {
  tool_name: string
  params: Record<string, unknown>     // fully specified, executable params
  priority: 1 | 2 | 3                // 1=critical, 2=important, 3=supplementary
  reason: string                      // 1 sentence explaining why this tool
}
```

### §4.3 — Planner system prompt

The planner system prompt is substantially richer than the current router prompt:

```
You are the MARSYS-JIS Query Planner. Your job is to produce an optimized
execution plan for a Jyotish query against the MARSYS instrument.

You have full accountability for data sourcing. You receive a catalog of
available retrieval tools with their schemas and optimal query patterns.
You must decide:
1. Which tools to call (from the catalog below)
2. Exactly what parameters to pass to each tool to get the highest-quality,
   most relevant data for the specific query
3. What guidance to give the synthesis LLM on how to use the retrieved data

## Native context
[chart_context: name, birth date/time/place, current dasha chain]
[current_date: for temporal reasoning]

## Retrieval tool catalog
[RETRIEVAL_CAPABILITY_SPEC — full spec for all 17 tools]

## Mandatory context
The FORENSIC birth chart data is always available to the synthesis LLM
regardless of your plan. You do not need to include it. Plan for what
additional data the query requires beyond the birth chart facts.

## Output format
Emit ONLY a raw JSON RichQueryPlan. No prose. No fences.

## Planning principles
1. Write tool params as if you are writing a targeted database query —
   not broad, not generic. The query_intent_summary is your anchor.
2. For msr_sql: always specify domain, strength floor, and relevant
   house/planet filters when the query names them. Generic calls waste tokens.
3. For vector_search: the `query` param should be a focused semantic phrase
   extracted from the user query intent, not the raw query text.
4. For cgm_graph_walk: only include if the query names specific chart entities
   (planets, houses, yogas). Extract seed_nodes carefully.
5. Use priority=1 for tools whose output is essential to answer the query.
   Use priority=3 for supplementary context the synthesis LLM may draw on.
6. synthesis_guidance must name the angle: "Weight the Saturn temporal signals
   over static placement signals — the user is asking about timing."
7. If the query is genuinely open-ended or holistic, use broader params.
   If the query is specific, be surgical.

[FEW-SHOT EXAMPLES — one per query_class, showing full RichQueryPlan]
```

### §4.4 — Retiring composition rules

`rule_composer.ts` is retired. The `compose()` function is removed from
the pipeline in `route.ts`. The `COMPOSITION_RULES` constant is archived
(not deleted — retained for audit trail and potential future reference).

The `compose_bundle` trace step is replaced by the `plan` step which subsumes it.

**Exception:** The token budget enforcement logic from `enforceTokenBudget` is
preserved and wired to the RichQueryPlan's `tool_calls` list — high-priority tool
calls are never dropped; priority=3 calls are dropped first when context is tight.

**Token budget fix:** `token_count` must be populated in the manifest for all major
assets before the planner can make cost-aware decisions. BHISMA-B2 must backfill this.

### §4.5 — context_assembly step emission (fix GAP.P.2)

In `platform/src/lib/synthesis/single_model_strategy.ts`, after assembling the
prompt context from tool results and bundle assets, emit:

```typescript
traceEmitter.emitStep({
  event: 'step_done',
  query_id: queryId,
  step: {
    step_name: 'context_assembly',
    step_type: 'deterministic',
    status: 'done',
    data_summary: {
      token_estimate: totalTokens,
    },
    payload: {
      l1_tokens: l1Tokens,
      l2_tokens: l2Tokens,
      system_tokens: systemTokens,
      total_tokens: totalTokens,
      l1_items: l1ChunkItems,   // TraceChunkItem[]
      l2_items: l2ChunkItems,   // TraceChunkItem[]
    },
  },
})
```

This fixes the blank Context section in the trace panel (GAP.T.3).

### §4.6 — synthesis_done step emission (fix GAP.P.4)

After streaming completes (`onFinish`), emit:
```typescript
traceEmitter.emitStep({
  event: 'step_done',
  query_id: queryId,
  step: {
    step_name: 'synthesis',
    step_type: 'llm',
    status: 'done',
    latency_ms: Date.now() - synthesisStart,
    data_summary: {
      model: modelId,
      input_tokens: usage.inputTokens,
      output_tokens: usage.outputTokens,
      citation_count: countSignalCitations(finalResponseText),
    },
  },
})
```

### §4.7 — Signal citation verification

```typescript
// platform/src/lib/synthesis/citation_check.ts
export function countSignalCitations(text: string): number {
  return (text.match(/SIG\.MSR\.\d{3}/g) ?? []).length
}

export function hasMinimumCitations(text: string, queryClass: string): boolean {
  const count = countSignalCitations(text)
  // holistic/cross_domain: expect ≥5 citations
  // interpretive: ≥3
  // factual: ≥0 (factual answers may not cite signals)
  const thresholds: Record<string, number> = {
    holistic: 5, cross_domain: 4, interpretive: 3,
    predictive: 2, discovery: 3, remedial: 1, factual: 0, cross_native: 2,
  }
  return count >= (thresholds[queryClass] ?? 1)
}
```

Emit the citation count in the synthesis_done step `data_summary`. Flag
low-citation responses in the trace panel with a warning badge.

### §4.8 — Eval baseline (fix GAP.P.9)

The KARN-W9-B2 session must run the eval baseline before making any retrieval
behavior changes. The baseline runner exists (`platform/scripts/eval/runner.py`).
Steps:
1. Export `SMOKE_SESSION_COOKIE`, `SMOKE_CHART_ID`, `ANTHROPIC_API_KEY`
2. Run: `python3 platform/scripts/eval/runner.py --planner-off --output 00_ARCHITECTURE/EVAL/BASELINE_RUN_W9.json`
3. Record the aggregate score in `PROJECT_KARN_SESSION_LOG.md`

Post-BHISMA, re-run the eval with the LLM-first planner enabled and compare delta.

### §4.9 — Token budget fix (fix GAP.A.6)

In `platform/src/lib/bundle/manifest_reader.ts`, read `token_count` from manifest
entries when present. Backfill `token_count` for the following high-cost entries
in `CAPABILITY_MANIFEST.json`:

| canonical_id | approx token_count |
|---|---|
| MSR_v3_0 | 180_000 |
| UCN_v4_0 | 95_000 |
| CGM_v9_0 | 60_000 |
| FORENSIC | 12_000 |
| CDLM_v1_1 | 25_000 |
| RM_v2_0 | 18_000 |

Fix `tokenFor()` in `enforceTokenBudget` to read the populated field.

---

## §5 — Stream 3: Trace Command Center

**Wave:** KARN-W9-B3 (parallel to B1 and B2)
**Owner:** Claude Code session 3 of 3

### §5.1 — Design system re-skin (fix GAP.T.1)

Replace all cold GitHub-dark palette tokens in `TracePanel.tsx` with warm brand tokens:

| Current (cold) | Replace with (warm) | Usage |
|---|---|---|
| `bg-[#0d1117]` | `bg-[rgba(8,5,2,0.97)]` | main panel background |
| `bg-[#161b27]` | `bg-[rgba(13,10,5,0.8)]` | sub-header / section headers |
| `border-slate-800` | `border-[rgba(212,175,55,0.10)]` | all panel borders |
| `border-l-blue-500` | `border-l-[#d4af37]` | selected step indicator |
| `bg-blue-500 animate-pulse` | `bg-[rgba(212,175,55,0.6)] animate-pulse` | running step pulse |
| `bg-emerald-950 border-emerald-700` | `bg-[rgba(212,175,55,0.08)] border-[rgba(212,175,55,0.3)]` | done status badge |
| `bg-blue-950 border-blue-600` | `bg-[rgba(100,80,20,0.3)] border-[rgba(212,175,55,0.4)]` | running status badge |
| `text-slate-200` | `text-[rgba(252,226,154,0.9)]` | primary text |
| `text-slate-400/500` | `text-[rgba(212,175,55,0.5)]` | secondary/label text |
| `text-slate-600` | `text-[rgba(212,175,55,0.25)]` | tertiary/hint text |
| `bg-slate-800/60` | `bg-[rgba(212,175,55,0.04)]` | hover backgrounds |
| `bg-slate-900` | `bg-[rgba(5,3,1,0.8)]` | code/pre blocks |

Step type badge colours (warm tonal palette):
| Step type | New colour |
|---|---|
| deterministic (DET) | `bg-[rgba(180,140,20,0.15)] text-[rgba(212,175,55,0.7)] border-[rgba(212,175,55,0.25)]` |
| llm (LLM) | `bg-[rgba(140,90,200,0.15)] text-[rgba(180,140,240,0.8)] border-[rgba(160,110,220,0.25)]` |
| sql (SQL) | `bg-[rgba(20,100,180,0.15)] text-[rgba(100,160,240,0.8)] border-[rgba(60,130,210,0.25)]` |
| vector (VEC) | `bg-[rgba(20,160,100,0.15)] text-[rgba(80,200,140,0.8)] border-[rgba(40,180,120,0.25)]` |
| gcs (GCS) | `bg-[rgba(200,80,40,0.15)] text-[rgba(240,130,100,0.8)] border-[rgba(220,100,60,0.25)]` |

### §5.2 — Query DNA panel (new, fix GAP.T.2)

Add a `QueryDNAPanel` component above the step timeline.

Displays (from the planning step's data_summary and payload):
- **Query class badge** with colour coding + 1-sentence rationale from `planning_rationale`
- **Intent summary** — `query_intent_summary` field from RichQueryPlan
- **Tools authorized** — chip list, each chip showing tool name + type badge + priority (1/2/3)
- **Domains** — domain chips
- **Graph seeds** — CGM entity chips (PLN.SATURN → "Saturn (Planet)", HSE.10 → "10th House")
- **Temporal flags** — forward_looking badge, dasha_context_required badge, time_window if set
- **Planning model** — which worker model was used, latency
- **Confidence** — `planning_confidence` badge (0.0 = fallback warning in red)

This panel collapses to a single summary line when the user wants more vertical space.

The classify step's trace `payload` must be extended to carry the full QueryPlan
(currently only `data_summary.result` and `data_summary.confidence` are emitted).
BHISMA-B2 must update the step emission to include `payload: { query_plan: queryPlan }`.

### §5.3 — Retrieval scorecard (fix GAP.T.4)

Extend each tool step's detail view (within `ContextInspector`):

**For msr_sql steps:**
- Signal domain distribution pie (career 40%, psychology 30%, etc.)
- Strength histogram (0-0.3, 0.3-0.6, 0.6-0.8, 0.8-1.0)
- Signal class breakdown (yoga / placement / aspect / temporal)
- How many signals were temporal_active vs static

**For vector_search steps:**
- Top-k score distribution as small bar chart (10 bars)
- Doc type distribution of returned chunks
- Layer distribution (L1 vs L2.5)
- Average score + score at rank 1, 5, 10

**For cgm_graph_walk steps:**
- Nodes visited count by node type (PLN/HSE/SGN/YOG/etc.)
- Edge types traversed distribution
- Seed hit rate (what % of seed nodes produced subgraph hits)
- Max depth reached

**Cross-tool efficiency row** (bottom of scorecard):
```
Retrieval efficiency: 12,400 tokens fetched → 8,200 tokens in synthesis (66%)
```
This requires the context_assembly fix from §4.5 to compute correctly.

### §5.4 — Cost and performance panel (fix GAP.T.6, GAP.T.7)

**Footer section** (always visible, replaces existing timeline bar or sits above it):

```
┌─────────────────────────────────────────────────────────────┐
│  PERFORMANCE                                        COST     │
│  ┌──────────┬──────────┬──────────┬────────────┐           │
│  │ Plan     │ Fetch    │ Assemble │ Synthesize │  Total     │
│  │ 340ms    │ 820ms    │ 45ms     │ 4.2s       │  5.4s      │
│  └──────────┴──────────┴──────────┴────────────┘           │
│  vs 10-query avg: ─12% faster    Haiku $0.001 + Sonnet $0.08 │
└─────────────────────────────────────────────────────────────┘
```

The 10-query rolling average is computed from the trace history API.
Cost breakdown reads from the model registry `costPer1MInput/Output` rates
and the `input_tokens/output_tokens` from each LLM step's `data_summary`.

### §5.5 — Synthesis quality indicators (fix GAP.T.5)

Add to the right panel below the selected step detail:

**After synthesis completes:**
- **Signal citations** — count badge: `12 signals cited (SIG.MSR.NNN)`. If < threshold
  for query_class: yellow warning "⚠ Low citation count".
- **Output shape compliance** — did the response match `expected_output_shape`?
  (Heuristic: holistic → check for multiple H2 headings; time_indexed → check for date mentions)
- **Prediction capture** — badge if any time-indexed predictions were auto-detected
  by `prediction-detection.ts`
- **Inline feedback** — 👍 / 👎 buttons that POST to `/api/conversations/[id]/feedback`
  with the `query_id` attached, so feedback is traceable back to the specific pipeline run

### §5.6 — Plan-per-tool override display (fix GAP.T.9)

When `plan_per_tool` step has `planner_active: true`, display the per-tool override
diff in the step detail panel:
```
OVERRIDES APPLIED (3 tools)
  msr_sql        + house_filter: [10, 6]  + min_strength: 0.65
  vector_search  + query: "Saturn authority career dharma"  + doc_type: ["msr_signal", "ucn_section"]
  cgm_graph_walk + seed_nodes: ["PLN.SATURN", "HSE.10"]  + edge_types: ["SUPPORTS", "YOGA_MEMBERSHIP"]
```

In the LLM-first world (post Stream 2), the planning step emits these as
`tool_calls` in the payload and this same display reads from there.

### §5.7 — History analytics tab (fix GAP.T.8)

Extend the History tab with an analytics sub-tab:

**Query class distribution** (donut chart over last 30 queries):
interpretive / holistic / factual / predictive / cross_domain / discovery / remedial

**Latency trend** (line chart, last 20 queries):
Three lines: plan_ms, tool_fetch_wall_ms, synthesis_ms

**Tool usage frequency** (horizontal bar chart):
Which tools are authorized most often and which are rarely called.

**Error rate** (last 30 queries):
How many had planning_confidence = 0.0 (fallback), how many had step_error events.

**Retrieval efficiency trend**:
Average tokens_fetched / tokens_in_synthesis ratio over time.

The history API endpoint `/api/trace/history` must return the additional fields
needed for these charts (`query_class`, per-step latencies, error flags). This
requires a query against `query_trace_steps` joined with `query_plans`.

### §5.8 — Minor UX improvements

- **Chunk preview discoverability** (fix GAP.T.10): Replace double-click requirement
  with single-click expand. Add a small `↗` icon on chunk cards.
- **Live token counter** (fix GAP.T.11): During synthesis streaming, show an
  incrementing token counter in the synthesis step row. Read from the AI SDK's
  `onChunk` callback if available.
- **Error step display**: When a step has `status: 'error'`, display the error
  message inline in the step row (currently only the red badge shows, reason is lost).

---

## §6 — Cross-cutting items

### §6.1 — Discovery register freshness audit

After BHISMA completes, a single-session verification pass must confirm that:
- `pattern_register`, `resonance_register`, `contradiction_register`, `cluster_atlas`
  tables are populated with data consistent with the post-M2 corpus (MSR v3.0, UCN v4.0)
- The CGM edges in `l25_cgm_edges` are coherent with the corrected `l25_cgm_nodes`
  (Audits 1-3 changed 96 nodes; downstream edges may reference now-corrected signal IDs)

This is a gap verification task, not a rebuild task. If gaps are found, they become
KARN-W10 scope.

### §6.2 — Feature flag cleanup

Several flags in `feature_flags.ts` are now permanently ON or permanently OFF
and should be promoted/retired to reduce cognitive overhead:

| Flag | Status | Action |
|---|---|---|
| `NEW_QUERY_PIPELINE_ENABLED` | always true | Remove flag; old pipeline is dead code (delete in BHISMA-B2) |
| `AUDIT_ENABLED` | always true | Remove flag; audit is non-optional |
| `CGM_GRAPH_WALK_ENABLED` | always true | Remove flag; controlled by planner |
| `PER_TOOL_PLANNER_ENABLED` | retired | Merged into LLM-first planner; flag removed |
| `BUNDLE_AUGMENTER_ENABLED` | never implemented | Remove flag |
| `MSR_RERANKER_ENABLED` | never implemented | Remove flag |
| `SEMANTIC_GATE_ENABLED` | never implemented | Remove flag |

New flags to add in BHISMA:
| Flag | Default | Purpose |
|---|---|---|
| `LLM_FIRST_PLANNER_ENABLED` | false initially → true after smoke | BHISMA-B2 main feature |
| `TRACE_ANALYTICS_ENABLED` | true | History analytics tab |
| `COST_TRACKING_ENABLED` | true | Per-query cost display |
| `CITATION_CHECK_ENABLED` | true | Signal citation verification |
| `REASONING_MODEL_STREAMING` | true | o3/o4-mini streaming vs o1 batch |

### §6.3 — consume-tools.ts vs pipeline tools — documentation

The codebase has two distinct tool systems that are currently undocumented as such:

1. **Pipeline retrieval tools** (`platform/src/lib/retrieve/`) — called deterministically
   by `route.ts` before synthesis. Tools: msr_sql, vector_search, cgm_graph_walk, etc.
   These fetch structured corpus data and pass it to the synthesis LLM as context.

2. **Synthesis LLM tools** (`consume-tools.ts`) — passed to the synthesis model via the
   AI SDK's tool-use mechanism. Tools: get_birth_data, get_planetary_positions,
   get_dasha_periods, query_patterns, etc. The LLM calls these during generation if it
   needs additional data not in its context.

These are complementary: pipeline tools pre-fetch; synthesis tools allow the LLM to
pull on-demand. A session should add a comment block to `route.ts` documenting this
architecture and add a brief to `00_ARCHITECTURE/` explaining both systems.

---

## §7 — Wave Structure

BHISMA runs as KARN Wave 9 with 3 parallel streams and a closing convergence session.

```
KARN-W9-B1 (Stream 1):  Model Family Infrastructure + Error Transparency
KARN-W9-B2 (Stream 2):  LLM-First Intelligent Pipeline
KARN-W9-B3 (Stream 3):  Trace Command Center
  │         │         │
  └─────────┴─────────┘
              │
       (native reviews all 3 close summaries)
              │
KARN-W9-B4 (Convergence): Integration smoke + BHISMA close artifact
```

### W9-B1 brief scope (Stream 1)

```
CREATES:
  platform/src/lib/models/health.ts
  platform/src/lib/telemetry/cost.ts

MODIFIES:
  platform/src/lib/models/registry.ts       (add 5 OpenAI models + role/convention/cost fields)
  platform/src/lib/models/resolver.ts       (reasoning model path + worker resolver)
  platform/src/lib/router/router.ts         (remove silent fallback; add PipelineError)
  platform/src/app/api/chat/consume/route.ts (hard-fail error response shape)
  platform/src/lib/synthesis/single_model_strategy.ts (R1 think-block stripping)
  platform/src/lib/config/feature_flags.ts  (flag cleanup)

MUST NOT TOUCH:
  00_ARCHITECTURE/**
  025_HOLISTIC_SYNTHESIS/**
  platform/migrations/**
```

### W9-B2 brief scope (Stream 2)

```
CREATES:
  platform/src/lib/router/retrieval_capability_spec.ts  (all 17 tool specs)
  platform/src/lib/router/planner.ts                    (unified Plan step)
  platform/src/lib/synthesis/citation_check.ts          (signal citation counter)

MODIFIES:
  platform/src/app/api/chat/consume/route.ts       (replace 3-step with plan(); emit new steps)
  platform/src/lib/synthesis/single_model_strategy.ts (emit context_assembly step)
  00_ARCHITECTURE/CAPABILITY_MANIFEST.json          (add token_count to major assets)
  platform/src/lib/bundle/rule_composer.ts          (retire; keep as archived module)
  platform/src/lib/config/feature_flags.ts          (add LLM_FIRST_PLANNER_ENABLED + others)

MUST NOT TOUCH:
  025_HOLISTIC_SYNTHESIS/**
  platform/migrations/**
  platform/src/lib/retrieve/**  (retrieval tool implementations untouched in B2)
```

### W9-B3 brief scope (Stream 3)

```
CREATES:
  platform/src/components/trace/QueryDNAPanel.tsx
  platform/src/components/trace/RetrievalScorecard.tsx
  platform/src/components/trace/CostPerformanceBar.tsx
  platform/src/components/trace/AnalyticsTab.tsx

MODIFIES:
  platform/src/components/trace/TracePanel.tsx      (full re-skin + new panels)
  platform/src/app/api/trace/history/route.ts       (extend response for analytics)
  platform/src/lib/trace/types.ts                   (extend TraceStep + TracePayload)
  platform/src/lib/trace/writer.ts                  (persist new fields)

MUST NOT TOUCH:
  platform/src/lib/router/**
  platform/src/lib/synthesis/**
  platform/migrations/**
  025_HOLISTIC_SYNTHESIS/**
```

### W9-B4 convergence scope

After all three streams close:
1. Run `npx tsc --noEmit` — must be clean across all new files
2. Run vitest suite — composition_rules tests will fail (rule_composer retired); update tests
3. Run eval baseline with LLM_FIRST_PLANNER_ENABLED=false (should match W9 pre-BHISMA baseline)
4. Flip LLM_FIRST_PLANNER_ENABLED=true; run eval; record delta in SESSION_LOG
5. Manual smoke: send 6 test queries (one per class) and verify trace panel shows all new sections
6. Create BHISMA_CLOSE_v1_0.md

---

## §8 — Acceptance Criteria

### Stream 1 (Model Family)
- AC.B1.1: All 5 new OpenAI models in registry with correct role/convention/cost fields
- AC.B1.2: `getWorkerForModel()` returns correct worker for each of the 4 families
- AC.B1.3: o-series models hit the reasoning calling path (no system prompt sent)
- AC.B1.4: Planning call uses synthesis model's family worker (not hardcoded Haiku)
- AC.B1.5: When Haiku call fails (inject a bad model ID), pipeline returns structured error (not a fake response)
- AC.B1.6: Error is visible in trace panel as `step_error` event
- AC.B1.7: Error is visible in chat UI as a user-readable message (not a silent response)
- AC.B1.8: DeepSeek R1 `<think>` blocks are stripped from displayed response
- AC.B1.9: `npx tsc --noEmit` passes clean

### Stream 2 (LLM-First Pipeline)
- AC.B2.1: Retrieval Capability Spec authored for all 17 tools
- AC.B2.2: `planner.ts` replaces `router.ts` classify + `rule_composer.ts` compose + `per_tool_planner.ts`
- AC.B2.3: `context_assembly` step emitted with l1_tokens, l2_tokens, l1_items, l2_items
- AC.B2.4: `synthesis_done` step emitted with model, input_tokens, output_tokens, citation_count
- AC.B2.5: FORENSIC always present in synthesis context (verified via trace context_assembly payload)
- AC.B2.6: `token_count` populated for 6 major manifest assets; `tokenFor()` returns non-zero
- AC.B2.7: Eval baseline captured pre-BHISMA and post-BHISMA; delta recorded in SESSION_LOG
- AC.B2.8: `LLM_FIRST_PLANNER_ENABLED` flag gates the new planner (old path still reachable for rollback)
- AC.B2.9: `npx tsc --noEmit` passes clean

### Stream 3 (Trace Command Center)
- AC.B3.1: Trace panel background is warm dark (`rgba(8,5,2,0.97)`) — no cold slate colours
- AC.B3.2: QueryDNAPanel shows query_class, intent_summary, tools chips, domain chips, graph seeds
- AC.B3.3: Context section shows populated L1/L2.5 token bar (not blank) — requires AC.B2.3
- AC.B3.4: Retrieval scorecard expands for msr_sql and vector_search steps with field-level breakdown
- AC.B3.5: Cost/performance footer shows per-stage latency and USD cost estimate
- AC.B3.6: Citation count badge appears in synthesis quality section
- AC.B3.7: History analytics tab shows query class donut + latency line + tool frequency bars
- AC.B3.8: `npx tsc --noEmit` passes clean
- AC.B3.9: No visual regressions on ConsumeChat main area (trace panel is a drawer, isolated)

---

## §9 — Items NOT in BHISMA scope (deferred)

| Item | Reason | Likely phase |
|---|---|---|
| Temporal animation (dasha/transit engine) | M3 scope | KARN-W9+ (M3) |
| Discovery register freshness re-verification | Verification only; no rebuild | KARN-W10 |
| Additional model families (Mistral, Grok, Cohere) | Registry pattern established; adding families is mechanical | Post-BHISMA on demand |
| Eval harness automated CI integration | Requires non-stub baseline first | Post-BHISMA |
| consume-tools.ts rationalization vs pipeline tools | Documentation + potential pruning | M3 session |
| Multi-turn planning (plan re-evaluation after partial tool results) | Agentic loop; large scope | M5+ |
| Streaming plan updates (real-time tool selection as query evolves) | Major UX + backend change | M7+ |

---

## §10 — Kickoff prompts for Claude Code sessions

### W9-B1 kickoff (Stream 1 — Model Family)

```
You are opening KARN-W9-B1, the first session of Project BHISMA, Stream 1:
Model Family Infrastructure and Error Transparency.

ROOT = ~/Vibe-Coding/Apps/Madhav
PLATFORM = ~/Vibe-Coding/Apps/Madhav/platform

Read before any action:
1. 00_ARCHITECTURE/BHISMA_PLAN_v1_0.md — §1 (gap inventory), §2 (ADRs), §3 (your scope), §7 (brief)
2. platform/src/lib/models/registry.ts — current state
3. platform/src/lib/models/resolver.ts — current resolver
4. platform/src/lib/router/router.ts — current classify (understand the silent fallback to remove)
5. platform/src/app/api/chat/consume/route.ts — understand how classify is called
6. 00_ARCHITECTURE/PROJECT_KARN_SESSION_LOG.md — last 50 lines

Your scope is §3 of the BHISMA plan. Key deliverables:
- Add 5 OpenAI models + role/convention/cost fields to registry (ADR-1, ADR-2, §3.1)
- Add `getWorkerForModel()` and `FAMILY_WORKER` map (§3.1)
- Implement reasoning model calling convention in resolver (§3.2)
- Make classify use `resolveWorkerModel(synthesisModelId)` not hardcoded Haiku (§3.2)
- Remove silent fallback plan; replace with PipelineError hard-fail (§3.3, ADR-3)
- Strip DeepSeek R1 think-blocks in single_model_strategy (§3.4)
- Feature flag cleanup: retire permanently-ON/OFF flags (§6.2)

Halt conditions:
- If adding OpenAI models causes resolver errors you cannot fix in 30 min, add the
  models to registry but leave resolver gated behind OPENAI_REASONING_ENABLED flag
  and report to native
- Do NOT touch 025_HOLISTIC_SYNTHESIS/**, platform/migrations/**, or 00_ARCHITECTURE/**

Emit session-open handshake per SESSION_OPEN_TEMPLATE_v1_0.md.
Session name: KARN-W9-B1-BHISMA-MODEL-FAMILY
```

### W9-B2 kickoff (Stream 2 — LLM-First Pipeline)

```
You are opening KARN-W9-B2, Project BHISMA Stream 2:
LLM-First Intelligent Pipeline.

ROOT = ~/Vibe-Coding/Apps/Madhav
PLATFORM = ~/Vibe-Coding/Apps/Madhav/platform

Read before any action:
1. 00_ARCHITECTURE/BHISMA_PLAN_v1_0.md — §1 (gaps P.1-P.11, A.1-A.6), §2 (ADRs 1-6), §4 (your scope)
2. platform/src/lib/router/router.ts — current classify (to be replaced)
3. platform/src/lib/router/prompt.ts — current system prompt (basis for new planner prompt)
4. platform/src/lib/router/types.ts — QueryPlan type (to extend to RichQueryPlan)
5. platform/src/lib/bundle/rule_composer.ts — to understand what you are retiring
6. platform/src/lib/bundle/composition_rules.ts — the rules being retired
7. platform/src/lib/synthesis/single_model_strategy.ts — where to add context_assembly emit
8. platform/src/app/api/chat/consume/route.ts — pipeline orchestration to rewrite
9. 00_ARCHITECTURE/CAPABILITY_MANIFEST.json — assets needing token_count
10. 00_ARCHITECTURE/PROJECT_KARN_SESSION_LOG.md — last 50 lines

FIRST ACTION: Run eval baseline BEFORE any pipeline changes:
  export SMOKE_SESSION_COOKIE=... SMOKE_CHART_ID=... ANTHROPIC_API_KEY=...
  python3 platform/scripts/eval/runner.py --planner-off \
    --output 00_ARCHITECTURE/EVAL/BASELINE_RUN_W9.json
  If server is unavailable: record STUB and proceed; note as known gap.

Your deliverables are §4.1-4.9 of the BHISMA plan.
Gate the new planner behind LLM_FIRST_PLANNER_ENABLED flag (default false).
The old classify+compose path must remain reachable when the flag is false.
This is a hard requirement for safe rollback.

Halt conditions:
- If retrieval capability spec authoring takes >4 hours, reduce to 8 tools (the 8
  most-used per composition_rules.ts) and note remainder as deferred
- Do NOT touch platform/src/lib/retrieve/** (tool implementations)
- Do NOT touch 025_HOLISTIC_SYNTHESIS/**, platform/migrations/**

Emit session-open handshake per SESSION_OPEN_TEMPLATE_v1_0.md.
Session name: KARN-W9-B2-BHISMA-LLM-PIPELINE
```

### W9-B3 kickoff (Stream 3 — Trace Command Center)

```
You are opening KARN-W9-B3, Project BHISMA Stream 3:
Trace Command Center.

ROOT = ~/Vibe-Coding/Apps/Madhav
PLATFORM = ~/Vibe-Coding/Apps/Madhav/platform

Read before any action:
1. 00_ARCHITECTURE/BHISMA_PLAN_v1_0.md — §1 (gaps T.1-T.12), §5 (your scope)
2. platform/src/components/trace/TracePanel.tsx — current trace (to re-skin + extend)
3. platform/src/components/consume/TraceDrawer.tsx — wrapper (reference for correct brand tokens)
4. platform/src/app/globals.css — brand token definitions (--brand-gold, --brand-charcoal, etc.)
5. platform/src/lib/trace/types.ts — trace types (to extend)
6. platform/src/app/api/trace/history/route.ts — history API (to extend)
7. 00_ARCHITECTURE/PROJECT_KARN_SESSION_LOG.md — last 50 lines

Important context: Stream B2 will emit new trace steps (context_assembly, synthesis_done)
and extend TraceStep's payload. B3 must be designed to gracefully handle these steps
being absent (B2 may not be complete when B3 runs). Guard all new panel sections with
null checks.

Your deliverables are §5.1-5.8 of the BHISMA plan.
Priority order if time-constrained:
  P1: Design re-skin (§5.1) — most visible fix
  P1: Query DNA panel (§5.2) — most informative new section
  P2: Cost/performance bar (§5.4)
  P2: Synthesis quality indicators (§5.5)
  P3: Retrieval scorecard (§5.3) — depends on B2's context_assembly emit
  P3: History analytics (§5.7) — requires API extension

Do NOT touch platform/src/lib/router/**, synthesis/**, or retrieve/**.
Do NOT touch 025_HOLISTIC_SYNTHESIS/**, platform/migrations/**.

Emit session-open handshake per SESSION_OPEN_TEMPLATE_v1_0.md.
Session name: KARN-W9-B3-BHISMA-TRACE-COMMAND
```
