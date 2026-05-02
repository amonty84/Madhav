---
status: COMPLETE
session: W2-TRACE-A
scope: UQE-5b (SSE planning events) + UQE-5c (circuit breaker) + TRACE-0/1/2/3 (UI components)
authored: 2026-05-02
round: 3
critical_path: false
blocks: W2-TRACE-B (Round 4 — remaining TRACE components)
prerequisites: W2-PLANNER (COMPLETE — 4628660), W2-SCHEMA (COMPLETE — 8a14043)
---

# W2-TRACE-A
## Planning SSE Events + Circuit Breaker + TRACE Components 0–3

Reference this file directly: `platform/briefs/W2-TRACE-A.md`. Do not use CLAUDECODE_BRIEF.md.

---

## Context

W2-PLANNER (4628660) implemented `callLlmPlanner()` gated on `LLM_FIRST_PLANNER_ENABLED`.
The planner runs silently — no UX signal during planning, no fallback protection, no UI panels.

This session adds:
1. **SSE events** for planning start/done (UQE-5b) — feeds the UI
2. **Circuit breaker** (UQE-5c) — protects against planner API degradation
3. **Four TRACE UI components** (TRACE-0 through TRACE-3) — planning indicator,
   LLM call map, query plan panel, tool execution panel

W2-TRACE-B (Round 4) will add the remaining six TRACE components (TRACE-4 through TRACE-9).

---

## Acceptance criteria

### AC.T.1 — UQE-5b: SSE planning events

File: `platform/src/lib/trace/types.ts`

Add two new event types to the `TraceEvent` union:

```typescript
export interface PlanningStartEvent {
  event: 'planning_start'
  query_id: string
  planner_model_id: string
  manifest_tool_count: number
}

export interface PlanningDoneEvent {
  event: 'planning_done'
  query_id: string
  tool_count_planned: number
  tools_selected: string[]
  query_intent_summary: string
  planner_latency_ms: number
}
```

In `platform/src/lib/pipeline/manifest_planner.ts`:
- Emit `planning_start` immediately before the `generateObject()` call.
- Emit `planning_done` immediately after successful plan validation.
- Pass an `emitTrace` callback param to `callLlmPlanner()`:

```typescript
export async function callLlmPlanner(
  query: string,
  conversationHistory: Array<{ role: string; content: string }>,
  plannerModelId: string,
  nativeId: string,
  emitTrace?: (event: PlanningStartEvent | PlanningDoneEvent) => void,
): Promise<PlanSchema>
```

`emitTrace` is optional — existing callers without it still work.

In `route.ts`, pass the existing SSE emitter as `emitTrace` when calling `callLlmPlanner`.

### AC.T.2 — UQE-5c: Planner circuit breaker

New file: `platform/src/lib/pipeline/planner_circuit_breaker.ts`

```typescript
export type CircuitState = 'closed' | 'open' | 'half-open'

export interface CircuitBreakerOptions {
  failureThreshold: number    // default: 3
  recoveryMs: number          // default: 300_000 (5 minutes)
  timeoutMs: number           // default: 3_000
}

export class PlannerCircuitBreaker {
  constructor(options?: Partial<CircuitBreakerOptions>)
  async call(fn: () => Promise<PlanSchema>): Promise<PlanSchema>
  get state(): CircuitState
  reset(): void   // for tests
}
```

Circuit logic:
- **Closed** (normal): pass calls through. Track consecutive failures.
- **Open** (tripped): after `failureThreshold` consecutive failures, reject immediately
  without calling `fn`. Transition to **half-open** after `recoveryMs`.
- **Half-open**: allow one probe call. Success → closed. Failure → open again.

Triggers that count as failure:
- `PlannerError` thrown by `callLlmPlanner`
- Call exceeds `timeoutMs` (wrap with `Promise.race`)
- Any 5xx error from the AI provider

When circuit is open, throw `PlannerCircuitOpenError extends Error` so `route.ts`
can distinguish circuit-open from other planner errors and skip the retry.

Export a module-level singleton:
```typescript
export const plannerCircuit = new PlannerCircuitBreaker()
```

In `route.ts`, wrap `callLlmPlanner` with `plannerCircuit.call(...)`.

### AC.T.3 — TRACE-0: PlanningIndicator component

New file: `platform/src/components/trace/PlanningIndicator.tsx`

```typescript
interface PlanningIndicatorProps {
  isPlanning: boolean
  plannerModelId?: string
  toolsSelected?: string[]    // populated on planning_done
}
```

Behavior:
- Shows animated pulse + "Analyzing your question…" text while `isPlanning = true`.
- On `planning_done` (toolsSelected populated): display tool names in a compact row, then
  collapse after 1.5s.
- Uses Tailwind utility classes only. No external animation libraries.
- Skeleton state: a single pulsing grey bar (full width, 24px height) while waiting.

Hydration events: `planning_start` → set `isPlanning=true`; `planning_done` →
set `toolsSelected`, animate out, set `isPlanning=false`.

### AC.T.4 — TRACE-1: LLM Call Map panel

New file: `platform/src/components/trace/LLMCallMap.tsx`

```typescript
interface LLMCallRecord {
  call_stage: string
  model_id: string
  provider: string
  input_tokens: number | null
  output_tokens: number | null
  reasoning_tokens: number | null
  latency_ms: number | null
  cost_usd: number | null
  fallback_used: boolean
  error_code: string | null
}

interface LLMCallMapProps {
  calls: LLMCallRecord[]
  isLoading: boolean
}
```

Renders a card per LLM call showing: stage label, model + provider, input/output token
counts, latency bar (proportional to longest call), cost if available, fallback badge if
`fallback_used=true`, error badge if `error_code` non-null.

For deepseek-reasoner calls: show reasoning_tokens as a separate amber bar segment.
Include a "View thinking" button placeholder (onClick: no-op in this session — wired
in W2-TRACE-B when reasoning trace storage is available).

Skeleton: 2 card placeholders (planner + synthesis), 60px each, grey pulse.

State machine: `isLoading=true` → skeleton; first call arrives → partial; all calls
present (synthesis_done event received) → complete.

### AC.T.5 — TRACE-2: Query Plan panel

New file: `platform/src/components/trace/QueryPlan.tsx`

```typescript
interface QueryPlanProps {
  plan: PlanSchema | null
  isLoading: boolean
}
```

Renders the `PlanSchema` as expandable tool cards. Each card shows:
- Tool name (bold)
- Priority badge (P1/P2/P3, colored)
- Reason string
- Token budget
- Params as a collapsed JSON block (expandable on click)

Skeleton: 5 tool row placeholders, 36px each, grey pulse.

Hydration: populated on `planning_done` event (plan arrives from SSE).

### AC.T.6 — TRACE-3: Tool Execution panel

New file: `platform/src/components/trace/ToolExecution.tsx`

```typescript
interface ToolExecutionRecord {
  tool_name: string
  status: 'ok' | 'zero_rows' | 'error' | 'cache_hit' | 'pending'
  rows_returned: number | null
  latency_ms: number | null
  fallback_used: boolean
  error_code: string | null
}

interface ToolExecutionProps {
  executions: ToolExecutionRecord[]
  isLoading: boolean
}
```

Renders tool execution status as a 3-column grid of cards:
- `ok` → green left border
- `zero_rows` → amber left border
- `error` → red left border
- `pending` → grey pulse (tool in progress)

Each card: tool name, rows returned, latency, fallback badge if triggered.

Skeleton: 6 grey cell placeholders in 3-column grid.

Hydration: `step_start` for a tool → add pending card; `step_done` → update status.

### AC.T.7 — tsc clean + commit

`npx tsc --noEmit` returns zero errors on all new/changed files.
Known_residuals (`AppShell.test.tsx`, `ReportGallery.test.tsx`) exempt.

```
feat(w2-trace-a): SSE planning events + circuit breaker + TRACE-0/1/2/3 (UQE-5b/5c)

- trace/types.ts: planning_start + planning_done event types
- manifest_planner.ts: emit planning_start/done via optional emitTrace callback
- planner_circuit_breaker.ts: 3-failure threshold, 5-min recovery, PlannerCircuitOpenError
- route.ts: wrap callLlmPlanner with plannerCircuit.call()
- PlanningIndicator.tsx: animated planning pulse, collapses on planning_done
- LLMCallMap.tsx: per-call cards with R1 reasoning bar + View thinking placeholder
- QueryPlan.tsx: expandable tool plan cards with priority + token_budget
- ToolExecution.tsx: 3-column execution grid with status colors + pending state
```

---

## may_touch

```
platform/src/lib/trace/types.ts
platform/src/lib/pipeline/manifest_planner.ts
platform/src/lib/pipeline/planner_circuit_breaker.ts      (new)
platform/src/app/api/chat/consume/route.ts
platform/src/components/trace/PlanningIndicator.tsx        (new)
platform/src/components/trace/LLMCallMap.tsx               (new)
platform/src/components/trace/QueryPlan.tsx                (new)
platform/src/components/trace/ToolExecution.tsx            (new)
```

## must_not_touch

```
platform/src/lib/retrieve/**
platform/src/lib/synthesis/**
platform/src/lib/router/**
platform/src/lib/db/**
platform/src/hooks/**
platform/migrations/**
platform/src/lib/config/feature_flags.ts
00_ARCHITECTURE/**
01_FACTS_LAYER/**
025_HOLISTIC_SYNTHESIS/**
platform/tests/eval/**
```

---

## Hard constraints

- `emitTrace` param on `callLlmPlanner` must be optional — do not break W2-PLANNER's existing call sites.
- Circuit breaker state must be module-level singleton (survives across requests in the same Node process).
- TRACE components use Tailwind utility classes only — no external animation or chart libraries.
- "View thinking" button in LLMCallMap is a visual placeholder (no-op onClick) — do not wire it to data that doesn't exist yet.
- Do not add new SSE event emission in `route.ts` beyond threading `emitTrace` to `callLlmPlanner`.
- The four TRACE components are UI-only — they do not fetch data themselves; they receive props.

---

*W2-TRACE-A · authored 2026-05-02 · unblocks W2-TRACE-B (Round 4)*
