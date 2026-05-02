---
status: COMPLETE
session: W2-INSTRUMENT
scope: MON-5/6/7/8 (DB write instrumentation across pipeline)
authored: 2026-05-02
round: 3
critical_path: false
blocks: W2-TRACE-B (Round 4 — investigation tab needs populated tables)
prerequisites: W2-SCHEMA (COMPLETE — 8a14043), W2-PLANNER (COMPLETE — 4628660)
---

# W2-INSTRUMENT
## Pipeline Monitoring Write Instrumentation

Reference this file directly: `platform/briefs/W2-INSTRUMENT.md`. Do not use CLAUDECODE_BRIEF.md.

---

## Context

W2-SCHEMA (8a14043) created four monitoring tables and TypeScript interfaces:
- `llm_call_log` — one row per LLM call
- `query_plan_log` — one row per query plan
- `tool_execution_log` — one row per tool execution
- `context_assembly_log` — one row per context assembly

W2-PLANNER (4628660) added `callLlmPlanner()` and the planner branch in `route.ts`.

This session wires the DB writes into the existing pipeline. No schema changes. No new
tables. No UI changes. Pure instrumentation — add write calls at the correct insertion
points in existing files.

---

## Acceptance criteria

### AC.I.1 — Monitoring write helper

New file: `platform/src/lib/db/monitoring-write.ts`

Central module containing one async write function per table. Each function is
fire-and-forget (never throws to the caller — catch internally and warn-log).

```typescript
import type {
  LlmCallLogRow,
  QueryPlanLogRow,
  ToolExecutionLogRow,
  ContextAssemblyLogRow,
} from './monitoring-types'

export async function writeLlmCallLog(
  row: Omit<LlmCallLogRow, 'id' | 'created_at'>
): Promise<void>

export async function writeQueryPlanLog(
  row: Omit<QueryPlanLogRow, 'id' | 'created_at'>
): Promise<void>

export async function writeToolExecutionLog(
  row: Omit<ToolExecutionLogRow, 'id' | 'created_at'>
): Promise<void>

export async function writeContextAssemblyLog(
  row: Omit<ContextAssemblyLogRow, 'id' | 'created_at'>
): Promise<void>
```

Rules:
- Use `getStorageClient()` for DB access (same pattern as existing tool files).
- Each function wraps its INSERT in try/catch; on error, `console.warn('[mon]', err)` and return.
- Never await these calls at the call site — fire-and-forget so they don't add latency
  to the request path.

### AC.I.2 — MON-5: llm_call_log writes

Instrument four LLM call sites:

**a) Manifest planner** (`platform/src/lib/pipeline/manifest_planner.ts`):
```typescript
// After generateObject() returns (or throws):
writeLlmCallLog({
  query_id: queryId,
  conversation_id: null,
  call_stage: 'planner',
  model_id: plannerModelId,
  provider: resolveProvider(plannerModelId),
  input_tokens: usage?.promptTokens ?? null,
  output_tokens: usage?.completionTokens ?? null,
  reasoning_tokens: null,
  latency_ms: Date.now() - callStart,
  cost_usd: null,          // W2-COST scope
  fallback_used: false,
  error_code: errorCode ?? null,
  payload: null,
})
```

**b) Synthesis** (`platform/src/lib/synthesis/single_model_strategy.ts`):
After `streamText()` completes, emit:
```typescript
writeLlmCallLog({
  call_stage: 'synthesis',
  reasoning_tokens: isDeepseekReasoner(modelId)
    ? Math.ceil((reasoningText ?? '').length / 4)
    : null,
  // ... other fields from usage object
})
```
If `model_id` contains `'deepseek-reasoner'`, extract reasoning text from stream parts
and store `Math.ceil(reasoning_text.length / 4)` as `reasoning_tokens`.

**c) History summarizer** (`platform/src/lib/pipeline/planner_context_builder.ts`):
When `history_was_summarized = true`, emit after the summarization call:
```typescript
writeLlmCallLog({
  call_stage: 'history_summary',
  // ... fields from summarization call
})
```

**d) Title generation**: If a title generator exists in the codebase, instrument it with
`call_stage: 'title'`. If not present, add a `// [TITLE_GEN_INSTRUMENTATION_TODO]`
comment at the top of `manifest_planner.ts` noting the gap.

### AC.I.3 — MON-6: query_plan_log write

In `platform/src/app/api/chat/consume/route.ts`, after `callLlmPlanner()` returns
successfully:

```typescript
writeQueryPlanLog({
  query_id: queryId,
  conversation_id: persistedId ?? null,
  chart_id: chartId ?? null,
  planner_model_id: plannerModelId,
  query_text: query,
  query_class: planSchema.query_class,
  tool_count: planSchema.tool_calls.length,
  plan_json: planSchema as unknown as Record<string, unknown>,
  parsing_success: true,
  parse_error: null,
  fallback_used: false,
  planner_latency_ms: plannerLatencyMs,
})
```

On `PlannerError` (fallback path), emit with `parsing_success: false`,
`parse_error: err.message`, `fallback_used: true`, `plan_json: null`.

### AC.I.4 — MON-7: tool_execution_log writes

Add `writeToolExecutionLog()` call at the end of each tool's execute function.
Apply to all tools in `platform/src/lib/retrieve/`:

- `msr_sql.ts`
- `pattern_register.ts`
- `contradiction_register.ts`
- `resonance_register.ts`
- `remedial_codex_query.ts`
- Any other `.ts` file in `retrieve/` that returns a `ToolBundle`

Pattern:
```typescript
writeToolExecutionLog({
  query_id: params.query_id,   // pass through from invocation params
  tool_name: 'msr_sql',        // hardcode per file
  params_json: invocationParams as Record<string, unknown>,
  status: rows.length === 0 ? 'zero_rows' : 'ok',
  rows_returned: rows.length,
  latency_ms: Date.now() - toolStart,
  token_estimate: Math.ceil(JSON.stringify(rows).length / 4),
  data_asset_id: 'MSR_v3_0',  // from CAPABILITY_MANIFEST linked_data_asset_id
  error_code: null,
  served_from_cache: false,
  fallback_used: bundle.invocationParams?.fallback_used ?? false,
})
```

On error (catch block), emit with `status: 'error'`, `error_code: err.code ?? err.message`.

Note: if `query_id` is not currently threaded into tool invocation params, add it as an
optional field to the tool's params type and thread it through from `route.ts`. Do not
add a required field that breaks existing callers — use `query_id?: string`.

### AC.I.5 — MON-8: context_assembly_log write

In `platform/src/lib/pipeline/context_assembly.ts` (or wherever context is assembled),
after all layers are merged:

```typescript
writeContextAssemblyLog({
  query_id: queryId,
  l1_tokens: layers.l1?.tokenCount ?? 0,
  l2_5_signal_tokens: layers.signals?.tokenCount ?? 0,
  l2_5_pattern_tokens: layers.patterns?.tokenCount ?? 0,
  l4_tokens: layers.l4?.tokenCount ?? 0,
  vector_tokens: layers.vector?.tokenCount ?? 0,
  cgm_tokens: layers.cgm?.tokenCount ?? 0,
  synthesis_model_id: synthesisModelId,
  model_max_context: modelMeta?.contextWindow ?? null,
  b3_compliant: citationValidationResult?.gate_result === 'PASS',
  citation_count: citationValidationResult?.layer1_count ?? 0,
  verified_citations: citationValidationResult?.layer2_verified ?? 0,
})
```

If the context assembly structure uses different field names, adapt — do not fabricate
token counts. Use `Math.ceil(str.length / 4)` if raw token counts are unavailable.

If `context_assembly.ts` does not exist or assembles context inline in `route.ts`,
add the write call at the correct inline location.

### AC.I.6 — tsc clean + commit

`npx tsc --noEmit` returns zero errors on all new/changed files.
Known_residuals (`AppShell.test.tsx`, `ReportGallery.test.tsx`) are exempt.

```
feat(w2-instrument): pipeline monitoring write instrumentation (MON-5/6/7/8)

- monitoring-write.ts: fire-and-forget write helpers for all 4 tables
- manifest_planner.ts: llm_call_log write (planner + history_summary stages)
- single_model_strategy.ts: llm_call_log write (synthesis, R1 reasoning_tokens)
- route.ts: query_plan_log write (success + fallback paths)
- retrieve/*.ts: tool_execution_log writes (all tools, zero_rows + error states)
- context_assembly: context_assembly_log write with per-layer token breakdown
```

---

## may_touch

```
platform/src/lib/db/monitoring-write.ts                  (new)
platform/src/lib/pipeline/manifest_planner.ts
platform/src/lib/pipeline/planner_context_builder.ts
platform/src/lib/synthesis/single_model_strategy.ts
platform/src/app/api/chat/consume/route.ts
platform/src/lib/retrieve/msr_sql.ts
platform/src/lib/retrieve/pattern_register.ts
platform/src/lib/retrieve/contradiction_register.ts
platform/src/lib/retrieve/resonance_register.ts
platform/src/lib/retrieve/remedial_codex_query.ts
platform/src/lib/pipeline/context_assembly.ts             (if exists)
```

## must_not_touch

```
platform/migrations/**
platform/src/lib/db/monitoring-types.ts
platform/src/lib/router/**
platform/src/components/**
platform/src/hooks/**
platform/src/lib/config/feature_flags.ts
00_ARCHITECTURE/**
01_FACTS_LAYER/**
025_HOLISTIC_SYNTHESIS/**
platform/tests/eval/**
```

---

## Hard constraints

- Write helpers must never throw to callers. All DB errors are warn-logged internally.
- Never await write helpers inline — fire-and-forget to preserve request latency.
- Do not fabricate token counts. Use `Math.ceil(str.length / 4)` if SDK usage object unavailable.
- If a required field (`query_id`) is not threaded into tool params, add it as optional (`query_id?: string`) — do not break existing callers.
- Do not add a new DB migration. All 4 tables exist from W2-SCHEMA.
- B.10: do not invent cost_usd values. Set `cost_usd: null` — cost calculation is separate scope.

---

*W2-INSTRUMENT · authored 2026-05-02 · unblocks W2-TRACE-B investigation tab (Round 4)*
