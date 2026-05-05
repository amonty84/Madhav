---
status: COMPLETE
session_id: GANGA-STACK-S1
session_scope: Pipeline standardization — DeepSeek fallback IDs, Gemini providerOptions propagation, DeepSeek thinking mode, planner 429 fallback
authored: 2026-05-05
authored_by: Claude Sonnet 4.6 (Cowork audit session)
depends_on: GANGA-TRACE-S1, GANGA-CHAT-S1 (no file conflicts; may run in parallel)
model: claude-sonnet-4-6
---

# CLAUDECODE_BRIEF — GANGA-STACK-S1

## §0 — Governing scope

Engineering-domain session. Do NOT touch `00_ARCHITECTURE/`, `01_FACTS_LAYER/`,
`06_LEARNING_LAYER/`, or any synthesis prompt files under `platform/src/lib/synthesis/prompts/`.

Trigger phrase: `"Read platform/BRIEFS/GANGA-STACK-S1.md and execute it."`

---

## §1 — Background

Audit of the five-stack pipeline (2026-05-05) found four classes of bugs that
affect any query run on the Gemini or DeepSeek stacks:

1. **Invalid DeepSeek fallback model IDs** — `STACK_ROUTING['deepseek'].synthesis.fallback`
   and `STACK_ROUTING['deepseek'].planner_deep.fallback` both point to
   `'deepseek-v4-flash'`. The registry itself documents (line 216) that this is
   **not a valid DeepSeek API model ID**: the DeepSeek API maps it to
   `deepseek-reasoner`, which rejects `toolChoice`. If these fallbacks are ever
   triggered (429, timeout, error), the fallback call will fail with a 400/422.
   The correct non-thinking fallback is `'deepseek-chat'`.

2. **Gemini stack: `googleProviderOptions` not propagated to planner calls** —
   `manifest_planner.ts`'s `generateText` call (line ~283) does not spread
   `googleProviderOptions`. When the Gemini stack is selected, the planner model
   is `gemini-2.5-flash`. Without safety-filter overrides, Jyotish content
   (maraka dasha, death-timing, suffering windows) triggers
   `HARM_CATEGORY_DANGEROUS_CONTENT`, causing the planner to fail silently and
   fall back to `classify()`. The query still answers, but the LLM planner is
   effectively dead for the Gemini stack.

3. **Gemini stack: `googleProviderOptions` not propagated to context assembly** —
   `context_assembler.ts`'s `generateText` call (line ~228) has the same gap.
   When `CONTEXT_ASSEMBLY_ENABLED=true` and the stack is `gemini`, the assembler
   will trigger the same safety filter mid-run and throw, aborting the context
   assembly step entirely. The Gemini stack cannot complete a query that requires
   context assembly.

4. **DeepSeek V4 Pro: thinking mode never activated** — `registry.ts` documents
   that `deepseek-v4-pro` is a dual-mode model: "Use `thinking=true` for deep
   synthesis; `thinking=false` for planner calls." However `resolver.ts` calls
   `deepseek(meta.id)` for all DeepSeek models without any `providerOptions`.
   The synthesis call in `single_model_strategy.ts` does not set
   `providerOptions.deepseek.thinking`. As a result, DeepSeek V4 Pro always
   runs in non-thinking mode — forgoing the chain-of-thought that justifies its
   selection as the premium synthesis model.

5. **Planner fallback not triggered on 429** — `manifest_planner.ts` has a retry
   loop (`MAX_PLANNER_RETRIES`) but only for timeout errors (`isTimeoutError`).
   A 429 rate-limit response from the primary planner model propagates up as a
   `PlannerError`, which causes the planner to fall back to `classify()` — it
   does not retry with the STACK_ROUTING fallback model. The fallback model
   defined in `STACK_ROUTING` is therefore never used for 429s.

---

## §2 — Changes

### CHANGE-1 — Fix invalid DeepSeek fallback model IDs

**File:** `platform/src/lib/models/registry.ts`

**Problem:** Two entries in `STACK_ROUTING['deepseek']` reference
`'deepseek-v4-flash'` as a fallback, which is not a valid DeepSeek API model
ID.

**Fix:** Change both to `'deepseek-chat'`:

```typescript
deepseek: {
  synthesis: {
    primary:  'deepseek-v4-pro',
    fallback: 'deepseek-chat',   // was: 'deepseek-v4-flash' — INVALID API ID
  },
  planner_deep: {
    primary:  'deepseek-v4-pro',
    fallback: 'deepseek-chat',   // was: 'deepseek-v4-flash' — INVALID API ID
  },
  // planner_fast, context_assembly, worker already use 'deepseek-chat' — no change
  ...
}
```

`deepseek-chat` is the documented non-thinking API alias: it routes to
V4 Flash non-thinking on the DeepSeek API, supports `toolChoice`, and is
already used for `planner_fast` / `context_assembly` / `worker` in the same
stack — so these fallbacks are consistent with the rest of the stack.

---

### CHANGE-2 — Propagate `googleProviderOptions` to planner calls

**File:** `platform/src/lib/pipeline/manifest_planner.ts`

**Problem:** The `generateText` call (currently around line 283) does not
spread `googleProviderOptions`. When `plannerModelId` is a Google model
(Gemini stack), safety filters block Jyotish content mid-call.

**Fix:** Import `googleProviderOptions` from `@/lib/models/resolver` and spread
it into the `generateText` call:

```typescript
import { resolveModel, googleProviderOptions } from '@/lib/models/resolver'

// ...in the generateText call:
result = await generateText({
  model: resolveModel(plannerModelId),
  system: getSystemPrompt(),
  messages: [{ role: 'user', content: userMessage }],
  temperature: 0,
  maxRetries: 0,
  tools: {
    submit_plan: tool({ ... }),
  },
  toolChoice: 'required',
  // NEW: apply Google safety overrides + thinking cap when Gemini stack is selected
  ...(googleProviderOptions(plannerModelId) && {
    providerOptions: googleProviderOptions(plannerModelId),
  }),
})
```

The `googleProviderOptions` function returns `undefined` for all non-Google
models, so the spread is a no-op for NIM, Anthropic, GPT, and DeepSeek planners.

---

### CHANGE-3 — Propagate `googleProviderOptions` to context assembly call

**File:** `platform/src/lib/synthesis/context_assembler.ts`

**Problem:** The `generateText` call (around line 228) does not spread
`googleProviderOptions`. When `modelId` is a Google model and
`CONTEXT_ASSEMBLY_ENABLED=true`, the assembler crashes on Jyotish content.

**Fix:** Import `googleProviderOptions` and spread it into the context assembly
`generateText` call. The pattern is identical to CHANGE-2:

```typescript
import { resolveModel, googleProviderOptions } from '@/lib/models/resolver'

// ...in the generateText call:
const result = await generateText({
  model: resolveModel(modelId),
  // ... existing params ...
  // NEW:
  ...(googleProviderOptions(modelId) && {
    providerOptions: googleProviderOptions(modelId),
  }),
})
```

---

### CHANGE-4 — Activate DeepSeek V4 Pro thinking mode for synthesis

**File:** `platform/src/lib/models/resolver.ts`

**Problem:** `deepseek-v4-pro` is selected as the synthesis primary on the
DeepSeek stack. The model runs in dual-mode (thinking / non-thinking). The
current `resolveModel` path simply calls `deepseek(meta.id)` with no
`providerOptions`, so V4 Pro always runs non-thinking — the CoT capability
that justifies its premium cost is never activated.

**Fix:** Add a `deepseekProviderOptions` helper analogous to
`googleProviderOptions`, then apply it in `single_model_strategy.ts` and the
legacy path in `route.ts`.

```typescript
// resolver.ts — add after googleProviderOptions:

/**
 * DeepSeek V4 Pro thinking-mode config for streamText `providerOptions`.
 *
 * deepseek-v4-pro is a dual-mode model. For synthesis we want thinking=true
 * (chain-of-thought reasoning before the answer). For planner calls we want
 * thinking=false to get fast structured JSON without CoT overhead.
 *
 * Returns undefined for non-DeepSeek models or for models that don't benefit
 * from explicit thinking control (deepseek-chat is non-thinking only).
 *
 * NOTE: @ai-sdk/deepseek exposes the thinking parameter via
 * providerOptions.deepseek.thinking (boolean). Verify this is supported
 * in the installed version before shipping. If the SDK version predates
 * this option, pass it via the request body extension pattern instead.
 */
export function deepseekProviderOptions(
  modelId: string,
  mode: 'synthesis' | 'planner' = 'synthesis',
):
  | { deepseek: { thinking: boolean } }
  | undefined {
  const meta = getModelMeta(modelId)
  if (meta?.provider !== 'deepseek') return undefined
  // Only V4 Pro supports dual-mode thinking toggle
  if (modelId !== 'deepseek-v4-pro') return undefined
  return {
    deepseek: {
      thinking: mode === 'synthesis',  // true for synthesis, false for planner
    },
  }
}
```

Then in `single_model_strategy.ts`, spread it into the `streamText` call
alongside the existing Google options:

```typescript
import { resolveModel, googleProviderOptions, deepseekProviderOptions } from '@/lib/models/resolver'

// In the streamText call:
const result = streamText({
  model: resolveModel(selected_model_id),
  // ...existing params...
  ...(googleProviderOptions(selected_model_id) && {
    providerOptions: googleProviderOptions(selected_model_id),
  }),
  // NEW: activate thinking mode for DeepSeek V4 Pro synthesis
  ...(deepseekProviderOptions(selected_model_id, 'synthesis') && {
    providerOptions: deepseekProviderOptions(selected_model_id, 'synthesis'),
  }),
})
```

And in `route.ts` (legacy path, around line 892 alongside the existing Google
block):

```typescript
...(googleProviderOptions(modelId) && {
  providerOptions: googleProviderOptions(modelId),
}),
// NEW:
...(deepseekProviderOptions(modelId, 'synthesis') && {
  providerOptions: deepseekProviderOptions(modelId, 'synthesis'),
}),
```

**Hard constraint:** If `providerOptions.google` and `providerOptions.deepseek`
are both spread into the same `providerOptions` object, merge them at the
object level — do not nest. The AI SDK merges top-level provider keys, so:
```typescript
providerOptions: {
  ...googleProviderOptions(id)?.google && { google: googleProviderOptions(id)!.google },
  ...deepseekProviderOptions(id)?.deepseek && { deepseek: deepseekProviderOptions(id)!.deepseek },
}
```
Use this pattern if both helpers return non-undefined on the same model (in
practice impossible since no model is both Google and DeepSeek, but guard it
defensively).

---

### CHANGE-5 — Planner: retry with fallback model on 429

**File:** `platform/src/lib/pipeline/manifest_planner.ts`

**Problem:** The existing retry loop catches `isTimeoutError` only. A 429
rate-limit from the primary planner model propagates as a `PlannerError` to
route.ts, which then falls back to `classify()` — the STACK_ROUTING fallback
model is never tried.

**Fix:** Detect 429 / rate-limit errors inside the retry loop and switch to
the fallback model on the first such error. The planner already receives
`plannerModelId` as a parameter; introduce a `fallbackModelId` parameter and
thread it through.

The planner signature in `manifest_planner.ts` becomes:

```typescript
export async function callLlmPlanner(
  queryText: string,
  history: PlannerHistoryMessage[],
  plannerModelId: string,
  chartId: string | null,
  emitTrace: ((event: TraceEvent) => void) | undefined,
  queryId: string | undefined,
  fallbackModelId?: string,   // NEW — if provided, retry once with this on 429
): Promise<PlanSchema>
```

Inside the retry loop, detect rate-limit errors and attempt the fallback once:

```typescript
for (let attempt = 0; attempt <= MAX_PLANNER_RETRIES; attempt++) {
  const activeModelId = (attempt > 0 && fallbackModelId && isRateLimitError(lastErr))
    ? fallbackModelId
    : plannerModelId
  try {
    result = await generateText({
      model: resolveModel(activeModelId),
      // ... same options ...
      ...(googleProviderOptions(activeModelId) && {
        providerOptions: googleProviderOptions(activeModelId),
      }),
    })
    break
  } catch (err) {
    lastErr = err
    if (isRateLimitError(err) && attempt === 0 && fallbackModelId) {
      console.warn(`[manifest_planner] 429 on primary ${plannerModelId}, retrying with fallback ${fallbackModelId}`)
      continue
    }
    if (isTimeoutError(err) && attempt < MAX_PLANNER_RETRIES) {
      console.warn(`[manifest_planner] timeout on attempt ${attempt + 1}, retrying...`)
      await sleep(PLANNER_RETRY_DELAY_MS)
      continue
    }
    // terminal error
    break
  }
}
```

Add the helper:

```typescript
function isRateLimitError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false
  const e = err as { status?: number; statusCode?: number; message?: string }
  if (e.status === 429 || e.statusCode === 429) return true
  if (typeof e.message === 'string' && e.message.includes('429')) return true
  if (typeof e.message === 'string' && e.message.toLowerCase().includes('rate')) return true
  return false
}
```

Wire the fallback model in `route.ts` where `callLlmPlanner` is called:

```typescript
const plannerModelId = STACK_ROUTING[selectedStack].planner_fast.primary
const plannerFallbackModelId = STACK_ROUTING[selectedStack].planner_fast.fallback

planSchema = await plannerCircuit.call(() =>
  callLlmPlanner(
    queryText,
    plannerHistory,
    plannerModelId,
    chartId,
    (event) => traceEmitter.emitStep(event),
    preAllocatedQueryId,
    plannerFallbackModelId,   // NEW
  ),
)
```

---

## §3 — Acceptance criteria

### AC.1 — DeepSeek fallback IDs are valid

In `registry.ts`, `STACK_ROUTING['deepseek'].synthesis.fallback` and
`STACK_ROUTING['deepseek'].planner_deep.fallback` both equal `'deepseek-chat'`.
Verify by code inspection (`grep 'deepseek-v4-flash' platform/src/lib/models/registry.ts`
returns 0 matches in `STACK_ROUTING` — only in the `MODELS` array's `id` field
and the entry's `hint` field).

### AC.2 — Gemini planner applies safety overrides

In `manifest_planner.ts`, the `generateText` call spreads the output of
`googleProviderOptions(plannerModelId)` into `providerOptions` when non-null.
Verify by code inspection: the call site contains the spread pattern.

### AC.3 — Gemini context assembler applies safety overrides

In `context_assembler.ts`, the `generateText` call spreads
`googleProviderOptions(modelId)` into `providerOptions` when non-null.

### AC.4 — DeepSeek V4 Pro thinking exported

`resolver.ts` exports `deepseekProviderOptions`. When called with
`('deepseek-v4-pro', 'synthesis')`, returns `{ deepseek: { thinking: true } }`.
When called with `('deepseek-v4-pro', 'planner')`, returns
`{ deepseek: { thinking: false } }`. When called with `('deepseek-chat', 'synthesis')`,
returns `undefined`.

### AC.5 — DeepSeek thinking applied at synthesis call sites

Both `single_model_strategy.ts` and the legacy `route.ts` synthesis path spread
`deepseekProviderOptions(modelId, 'synthesis')` into `providerOptions` when
non-null.

### AC.6 — Planner 429 triggers fallback model

`callLlmPlanner` accepts an optional `fallbackModelId` parameter. When the
primary model returns a rate-limit error (429 / "rate" in message) on attempt 0,
the next attempt uses `fallbackModelId` (if provided). Verify by unit test
(mock the primary to throw 429, verify the second `generateText` call uses
fallback model ID).

### AC.7 — tsc clean

`npx tsc --noEmit` returns 0 errors in `platform/src/`.

### AC.8 — Existing tests pass

`npx vitest run` exits 0 in `platform/`. No regressions on existing planner,
synthesis, or context-assembly test suites.

### AC.9 — Commit

Single commit:
```
feat(stack): pipeline standardization — DeepSeek fallbacks, Gemini options, thinking mode, planner 429

CHANGE-1: Fix deepseek.synthesis.fallback + planner_deep.fallback → 'deepseek-chat' (valid API ID)
CHANGE-2: Apply googleProviderOptions to Gemini planner calls (manifest_planner.ts)
CHANGE-3: Apply googleProviderOptions to Gemini context assembly calls (context_assembler.ts)
CHANGE-4: Export deepseekProviderOptions; activate V4 Pro thinking=true for synthesis
CHANGE-5: Planner retries with fallback model on 429 rate-limit errors
```

---

## §4 — File scope

### must_not_touch
```
01_FACTS_LAYER/**
025_HOLISTIC_SYNTHESIS/**
00_ARCHITECTURE/**
06_LEARNING_LAYER/**
platform/src/lib/synthesis/prompts/**
platform/src/lib/retrieve/**
platform/src/lib/trace/**
platform/src/components/trace/**
platform/src/lib/config/**
platform/src/lib/pipeline/budget_arbiter.ts
platform/src/lib/pipeline/planner_circuit_breaker.ts
```

### may_touch
```
platform/src/lib/models/registry.ts              (CHANGE-1)
platform/src/lib/models/resolver.ts              (CHANGE-4: new export)
platform/src/lib/pipeline/manifest_planner.ts    (CHANGE-2, CHANGE-5)
platform/src/lib/synthesis/context_assembler.ts  (CHANGE-3)
platform/src/lib/synthesis/single_model_strategy.ts  (CHANGE-4: apply at synthesis)
platform/src/app/api/chat/consume/route.ts       (CHANGE-4: legacy path, CHANGE-5: wire fallback)
platform/tests/**                                (AC.6 unit test for planner 429 fallback)
```

---

## §5 — Hard constraints

1. **Do not change the `deepseek-v4-flash` entry in the `MODELS` array** — it is
   retained as a historical/forward-compat record per its own comment. Only
   change the two `STACK_ROUTING` fallback references.
2. **`deepseekProviderOptions` must return `undefined` for all non-`deepseek-v4-pro`
   model IDs** — `deepseek-chat` and `deepseek-reasoner` must not receive a
   `thinking` providerOption (the former is non-thinking only; the latter is
   deprecated).
3. **Verify `@ai-sdk/deepseek` package version supports `providerOptions.deepseek.thinking`**
   before shipping CHANGE-4. Run `cat platform/package.json | grep deepseek` to
   confirm the installed version. If the installed SDK version does not expose
   this providerOption, add a `// TODO: upgrade @ai-sdk/deepseek to ≥X.Y.Z` comment
   and skip CHANGE-4 rather than silently no-op.
4. **The `callLlmPlanner` signature change (CHANGE-5) must be backward-compatible** —
   `fallbackModelId` is optional (`?`). All existing call sites that don't pass
   it must continue to compile and run without change.
5. No new feature flags.

---

*End of CLAUDECODE_BRIEF — GANGA-STACK-S1 (authored 2026-05-05)*
