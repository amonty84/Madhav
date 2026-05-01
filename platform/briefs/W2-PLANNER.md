---
status: PENDING
session: W2-PLANNER
scope: UQE-4c (LLM-first planner implementation) + UQE-6 (planner integration into route.ts)
authored: 2026-05-01
round: 2
critical_path: true
blocks: W2-TRACE-A (Round 3), W2-EVAL-B (Round 4)
prerequisites: W2-MANIFEST (COMPLETE — a24d96d)
---

# W2-PLANNER
## LLM-First Planner Implementation

Reference this file directly: `platform/briefs/W2-PLANNER.md`. Do not use CLAUDECODE_BRIEF.md.

---

## Context

W2-MANIFEST (a24d96d) delivered all prerequisites:
- `manifest_compressor.ts` — compresses 108-tool manifest to ≤3K tokens
- `planner_context_builder.ts` — caps conversation history at ≤600 tokens
- `PLANNER_PROMPT_v1_0.md` — system prompt, PlanSchema, two few-shots, eval rubric
- `CAPABILITY_MANIFEST.json` — all 8 primary tools have `query_schema` + `token_cost_hint` + `linked_data_asset_id`

This session implements the LLM call itself (`manifest_planner.ts`) and wires it into
the v2 pipeline behind the existing `LLM_FIRST_PLANNER_ENABLED` feature flag (currently false).

The current pipeline uses a regex-based `classify()` heuristic followed by `compose_bundle()`
to build tool invocations. The LLM planner replaces both steps when the flag is enabled,
producing a `PlanSchema` that drives tool execution directly in `route.ts`.

---

## Acceptance criteria

### AC.P.1 — manifest_planner.ts

New file: `platform/src/lib/pipeline/manifest_planner.ts`

Must export:

```typescript
export interface PlanSchema {
  query_class: 'remedial' | 'interpretive' | 'predictive' | 'holistic' | 'planetary' | 'single_answer'
  query_intent_summary: string   // ≤20 words
  tool_calls: Array<{
    tool_name: string
    params: Record<string, unknown>
    token_budget: number         // 100–2000
    priority: 1 | 2 | 3
    reason: string               // ≤15 words
  }>
}

export class PlannerError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message)
    this.name = 'PlannerError'
  }
}

export async function callLlmPlanner(
  query: string,
  conversationHistory: Array<{ role: string; content: string }>,
  plannerModelId: string,
  nativeId: string,
): Promise<PlanSchema>
```

Implementation requirements:
- Call `buildPlannerContext(query, conversationHistory, plannerModelId)` for the history window.
- Call `compressManifest(manifest)` + `compressedManifestToString(entries)` for the tool list.
- Load manifest from `00_ARCHITECTURE/CAPABILITY_MANIFEST.json` at module level (read once).
- Construct prompt per `PLANNER_PROMPT_v1_0.md` system prompt verbatim.
- Call `generateObject()` (Vercel AI SDK) with a Zod schema matching `PlanSchema` for structured output.
- If `generateObject()` throws or returns an invalid schema: throw `PlannerError` with the original error as `cause`.
- Log call latency to console in dev. No DB writes — W2-INSTRUMENT (Round 3) handles instrumentation.
- `nativeId` must appear in the planner prompt context (e.g. as a `native_id` field in the user message JSON).

### AC.P.2 — Route integration

File: `platform/src/app/api/chat/consume/route.ts`

In the v2 pipeline path, after resolving `selectedStack`, add a planner branch before the
existing `classify()` call:

```typescript
const plannerModelId = STACK_ROUTING[selectedStack].planner_fast.primary

let planSchema: PlanSchema | null = null
if (configService.getFlag('LLM_FIRST_PLANNER_ENABLED')) {
  try {
    planSchema = await callLlmPlanner(query, history, plannerModelId, chartId)
  } catch (err) {
    console.warn('[planner] LLM planner failed, falling back to classify()', err)
    planSchema = null
  }
}
// planSchema === null → continue with existing classify() + compose_bundle() path unchanged
```

When `planSchema` is non-null, drive tool execution from `planSchema.tool_calls` instead of
the existing `queryPlan` / `compose_bundle()` output. The tool execution loop already exists
in `route.ts` — adapt it to accept either source. Do not delete or bypass the existing
`classify()` + `compose_bundle()` path; it remains the active fallback.

`LLM_FIRST_PLANNER_ENABLED` stays `false` in DEFAULT_FLAGS. Do not flip it.

### AC.P.3 — Tests

New file: `platform/tests/pipeline/manifest_planner.test.ts`

Mock the AI provider — do not make live API calls. Five tests:

1. **PASS remedial**: mock returns valid `PlanSchema` for a remedial query → `query_class: 'remedial'`, `tool_calls` includes `remedial_codex_query`.
2. **PASS interpretive**: mock returns valid `PlanSchema` for an interpretive query → `tool_calls` includes `msr_sql`.
3. **PlannerError on bad JSON**: mock throws / returns malformed output → `callLlmPlanner` throws `PlannerError`.
4. **Token budget**: compressed manifest + history combined estimated tokens ≤ 5000 (assert via `Math.ceil(str.length / 4)`).
5. **nativeId threaded**: `nativeId` value appears in the constructed prompt string.

### AC.P.4 — tsc clean + commit

`npx tsc --noEmit` returns zero errors on all new/changed files.
Pre-existing known_residuals (`AppShell.test.tsx`, `ReportGallery.test.tsx`) are exempt.

```
feat(w2-planner): LLM-first planner implementation (UQE-4c/UQE-6)

- manifest_planner.ts: callLlmPlanner() using compressed manifest + planner context builder
- PlannerError: typed error class for planner failures  
- route.ts: LLM_FIRST_PLANNER_ENABLED gate with silent classify() fallback
- tests/pipeline/manifest_planner.test.ts: 5 tests with mocked AI provider
```

---

## may_touch

```
platform/src/lib/pipeline/manifest_planner.ts          (new)
platform/src/app/api/chat/consume/route.ts             (add planner branch)
platform/tests/pipeline/manifest_planner.test.ts       (new)
```

## must_not_touch

```
platform/src/lib/router/**
platform/src/lib/retrieve/**
platform/src/lib/synthesis/**
platform/src/lib/trace/**
platform/src/lib/pipeline/manifest_compressor.ts
platform/src/lib/pipeline/planner_context_builder.ts
platform/src/lib/config/feature_flags.ts
platform/src/hooks/**
platform/src/components/**
platform/migrations/**
00_ARCHITECTURE/CAPABILITY_MANIFEST.json
00_ARCHITECTURE/PLANNER_PROMPT_v1_0.md
01_FACTS_LAYER/**
025_HOLISTIC_SYNTHESIS/**
platform/tests/eval/**
```

---

## Hard constraints

- Do NOT flip `LLM_FIRST_PLANNER_ENABLED` to true. The native controls activation.
- Do NOT make live LLM API calls in tests. Mock the AI provider.
- `callLlmPlanner()` must use `generateObject()` for structured output — not `generateText()` + manual `JSON.parse`.
- The fallback to `classify()` in `route.ts` must be silent (warn log only). Never surface a planner failure to the end user.
- Do NOT remove or bypass the existing `classify()` + `compose_bundle()` path.
- Token estimation: use `Math.ceil(str.length / 4)` consistently — do not fabricate counts.

---

*W2-PLANNER · authored 2026-05-01 · unblocks W2-TRACE-A (Round 3) + W2-EVAL-B (Round 4)*
