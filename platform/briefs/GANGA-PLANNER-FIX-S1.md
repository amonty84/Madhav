---
artifact: GANGA-PLANNER-FIX-S1.md
session_id: GANGA-PLANNER-FIX-S1
title: Circuit Breaker Reset + Missing Observatory Export + GQ-002 Tool Error
status: OPEN
model: claude-sonnet-4-6
authored_by: Claude (Cowork — 2026-05-05)
branch: feature/planner-fix-s1
depends_on: null
may_touch:
  - platform/src/lib/pipeline/planner_circuit_breaker.ts
  - platform/src/lib/db/monitoring-write.ts
  - platform/src/lib/db/monitoring-types.ts
  - platform/src/app/api/admin/planner/reset-circuit/route.ts   # new file
  - platform/src/lib/pipeline/__tests__/planner_circuit_breaker.test.ts
  - platform/src/lib/db/__tests__/monitoring-write.test.ts       # new or extend
  - 00_ARCHITECTURE/GANGA_PHASE_TRACKER.md
must_not_touch:
  - platform/src/app/api/chat/consume/route.ts
  - platform/src/lib/pipeline/manifest_planner.ts
  - platform/src/lib/models/registry.ts
  - platform/migrations/**
  - "**/*.md (except GANGA_PHASE_TRACKER.md)"
---

# GANGA-PLANNER-FIX-S1 — Session Brief

## §1 — Context

Post-merge E2E observation run (GANGA-P2-R1-S2, 2026-05-05, commit 52bc653) returned
FAIL verdict: all 6 queries produced `plan_json IS NULL` with `parse_error = 'circuit_open'`.
Root cause analysis identified three real issues and one false positive.

**False positive — Flag 3 (model ID "mismatch"):** `planner_model_id = 'nvidia/nemotron-3-super-120b-a12b'`
is NOT a bug. That model IS the current `nim.planner_fast.primary` after the overnight G0 registry
update. No fix needed; the DB record is correct.

---

## §2 — Root Causes

### RC-1: Circuit breaker stuck open (Flag 1)

`plannerCircuit` in `planner_circuit_breaker.ts` is a **module-level singleton** that persists across
requests in a running Node.js / Cloud Run process. It was tripped during STACK-S1 dev testing when
`nim.planner_fast.primary` was `llama-3.3-nemotron-super-49b-v1` (6.8s cold-start > `timeoutMs: 5_000`).
Three consecutive timeouts → `state = 'open'`. No reset mechanism exists. The breaker recovers via
a 5-min half-open probe, but if the probe fires against a slow provider it re-opens with doubled
backoff (capped at `maxRecoveryMs = 300_000` = 5 min, same as initial — backoff is effectively a
no-op). The Cloud Run instance has been running this open circuit ever since.

Fix: (a) add `POST /api/admin/planner/reset-circuit` to allow operational reset without redeployment;
(b) raise `DEFAULT_OPTIONS.timeoutMs` from 5_000 → 15_000 to accommodate provider cold-starts and
prevent future premature trips.

### RC-2: `writeObservatoryQueryEvent` not implemented (Flag 2)

`route.ts` imports `writeObservatoryQueryEvent` from `@/lib/db/monitoring-write` (line 58) and calls
it at the end of every request (line 772). The function **does not exist anywhere in the codebase**.
This causes a TypeScript compile error that breaks the local dev build, making all local requests
return 500. The function's call signature is:

```typescript
writeObservatoryQueryEvent({
  queryId: string,
  conversationId: string | null,
  userId: string,
  modelId: string,
  queryClass: string,
  stack: string,
  queryText: string,
  responseText: string | null,
  setupStart: Date,
})
```

The function should write a synthetic `llm_usage_events` row (the G.3 per-query observatory rollup).
Target table schema: `platform/migrations/038_observatory_schema.sql`. Use `pipeline_stage = 'consume_complete'`,
`prompt_id = queryId`, `provider = resolveProvider(modelId)` (already exported), `status = 'success'`,
`latency_ms = Date.now() - setupStart.getTime()`. Token counts are null on this rollup row (individual
LLM calls already write their own rows via `persist.ts`).

### RC-3: GQ-002 mid-stream tool retrieval error (Flag 4)

GQ-002 ("Which mantra should I recite to support spiritual progress?") hits a mid-stream tool
retrieval failure. This is a secondary issue, separate from the circuit breaker. The circuit being
open means the query falls to the `classify()` fallback path, whose tool selection may differ from
the planner. Investigate AFTER RC-1 and RC-2 are fixed and the planner is running again.

---

## §3 — Changes

### CHANGE-1: Implement `writeObservatoryQueryEvent` in `monitoring-write.ts`

Add the following to `platform/src/lib/db/monitoring-write.ts`:

1. Add an `ObservatoryQueryEventInput` interface to `monitoring-types.ts`:
   ```typescript
   export interface ObservatoryQueryEventInput {
     queryId: string
     conversationId: string | null
     userId: string
     modelId: string
     queryClass: string
     stack: string
     queryText: string
     responseText: string | null
     setupStart: Date
   }
   ```

2. Implement `writeObservatoryQueryEvent` in `monitoring-write.ts` as a fire-and-forget INSERT
   into `llm_usage_events`. NEVER throws (wrap in try/catch, console.warn on error). Fields:
   - `conversation_id` = input.conversationId ?? 'unknown'
   - `prompt_id` = input.queryId
   - `user_id` = input.userId
   - `provider` = resolveProvider(input.modelId)
   - `model` = input.modelId
   - `pipeline_stage` = 'consume_complete'
   - `prompt_text` = input.queryText (truncate to 4000 chars if needed)
   - `response_text` = input.responseText (truncate to 4000 chars if needed)
   - `status` = 'success'
   - `latency_ms` = Math.round(Date.now() - input.setupStart.getTime())
   - `started_at` = input.setupStart
   - `finished_at` = new Date()
   - `parameters` = `{ query_class: input.queryClass, stack: input.stack }` (JSONB)
   - All token counts = null (rollup row; individual call rows have token data)

3. Export `ObservatoryQueryEventInput` from `monitoring-types.ts` and
   `writeObservatoryQueryEvent` from `monitoring-write.ts`.

**Verification:** After CHANGE-1, `tsc --noEmit` must exit 0 and `npm run dev` must start without
crashing on a request.

### CHANGE-2: Admin circuit reset endpoint

Create `platform/src/app/api/admin/planner/reset-circuit/route.ts`:

```typescript
// POST /api/admin/planner/reset-circuit
// Super-admin only. Resets the in-process PlannerCircuitBreaker singleton to
// closed state. Use when the circuit is stuck open after a provider outage.
```

- Auth: require `isSuperAdmin` check (same pattern as other admin routes — check
  `platform/src/app/api/admin/` for the existing auth pattern).
- On success: call `plannerCircuit.reset()` and return `200` with JSON body:
  `{ reset: true, metrics: plannerCircuit.getMetrics() }`
- On non-admin: return `403`
- On any error: return `500`, never throws

### CHANGE-3: Raise circuit breaker `timeoutMs` to 15 000

In `planner_circuit_breaker.ts`, update `DEFAULT_OPTIONS`:

```typescript
// Raised 5s→15s 2026-05-05 GANGA-PLANNER-FIX-S1:
// 5s timeout tripped the breaker on providers with >5s cold-start (nemotron-49B: 6.8s).
// 15s covers known worst-case cold-starts across all confirmed-live NIM models.
// The breaker's purpose is to stop sustained outages, not catch slow cold-starts.
timeoutMs: 15_000,
```

### CHANGE-4: GQ-002 investigation (best-effort)

After CHANGES 1–3 are committed and a local dev server is running cleanly:

1. Reset the circuit via `POST /api/admin/planner/reset-circuit`
2. Send GQ-002 query ("Which mantra should I recite to support spiritual progress?") via the
   local dev UI or via `npm run answer:eval -- --query-id GQ-002`
3. Inspect `tool_execution_log` for the query to find which tool failed and its `error_code`
4. If the fix is contained to a single tool executor or retrieval function, fix it in this
   session. If it requires touching the retrieval pipeline broadly, record the root cause in
   a `GANGA-GQ002-BUG-v1_0.md` note at `00_ARCHITECTURE/` and defer to the next session.

---

## §4 — Acceptance Criteria

| ID | Criterion | How to verify |
|---|---|---|
| AC.1 | `tsc --noEmit` exits 0 | Run from `platform/` |
| AC.2 | `writeObservatoryQueryEvent` exported and callable | TS import in test; `npm run dev` starts |
| AC.3 | `POST /api/admin/planner/reset-circuit` returns 200 for super_admin | curl or test |
| AC.4 | `POST /api/admin/planner/reset-circuit` returns 403 for unauthenticated | curl or test |
| AC.5 | After reset call, `plannerCircuit.getMetrics()` shows `state: 'closed'` | Inspect response body |
| AC.6 | `DEFAULT_OPTIONS.timeoutMs === 15_000` | grep the source |
| AC.7 | `npm test` exits 0 (all existing tests pass) | Run from `platform/` |
| AC.8 | GQ-002 root cause documented (fix or deferral note) | File exists or test passes |

---

## §5 — Hard Constraints

- Do NOT modify `route.ts`. The `writeObservatoryQueryEvent` call site is correct as-is; the
  fix is the missing implementation in `monitoring-write.ts`.
- Do NOT modify `manifest_planner.ts` or `registry.ts`.
- The reset endpoint MUST be super_admin gated. No unauthenticated reset.
- `writeObservatoryQueryEvent` MUST NOT throw. If the DB write fails, warn and return.
- Commit all changes together as a single commit on `feature/planner-fix-s1`.
- At session close, update `00_ARCHITECTURE/GANGA_PHASE_TRACKER.md` §1 current state block
  with session ID, commit hash, and verdict.
