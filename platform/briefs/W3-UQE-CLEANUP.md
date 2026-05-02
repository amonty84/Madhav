---
status: COMPLETE
session: W3-UQE-CLEANUP
scope: UQE-5a (budget arbiter) + UQE-10 (flag retirement note)
authored: 2026-05-02
round: 5
critical_path: false
blocks: nothing
prerequisites: W2-PLANNER (COMPLETE — 4628660), W2-TRACE-A (COMPLETE — 77184e1)
deferred_out_of_scope:
  UQE-6: "Remove classify step — deferred until LLM_FIRST_PLANNER_ENABLED flipped to true in production"
---

# W3-UQE-CLEANUP
## Budget Arbiter + Flag Retirement Note

Reference this file directly: `platform/briefs/W3-UQE-CLEANUP.md`. Do not use CLAUDECODE_BRIEF.md.

---

## Context

Two deferred Wave 2 tasks that are self-contained and do not require classify removal
or production flag flip.

**UQE-5a**: The planner emits `token_budget` per tool but nothing enforces it. Tools can
return more tokens than budgeted; the sum of all budgets can exceed the synthesis model's
context window. The budget arbiter enforces proportional trimming before context assembly.

**UQE-10**: `LLM_FIRST_PLANNER_ENABLED` was built with an implicit "we'll remove this flag
later" assumption. A one-page migration note documents the deprecation timeline so it
doesn't get forgotten.

---

## Acceptance criteria

### AC.C.1 — UQE-5a: Budget arbiter

New file: `platform/src/lib/pipeline/budget_arbiter.ts`

```typescript
export interface BudgetArbiterConfig {
  synthesis_model_max_context: number   // from ModelMeta.contextWindow
  system_prompt_reserve: number         // default: 800
  synthesis_guidance_reserve: number    // default: 200
  safety_margin: number                 // default: 0.85
  min_tokens_per_tool: number           // default: 200 (floor for priority=1 tools)
}

export interface ToolBudget {
  tool_name: string
  priority: 1 | 2 | 3
  token_budget: number
}

export function arbitrateBudgets(
  tools: ToolBudget[],
  config: BudgetArbiterConfig,
): ToolBudget[]
// Returns tools with token_budget values adjusted downward if needed.
// Never increases a budget above its input value.
// Never reduces a priority=1 tool below config.min_tokens_per_tool.
```

Algorithm:
```
available = (synthesis_model_max_context × safety_margin)
            − system_prompt_reserve − synthesis_guidance_reserve
planned_total = sum of all token_budget values
if planned_total ≤ available: return tools unchanged

deficit = planned_total − available

// Trim priority=3 tools first (proportionally)
// Then priority=2 tools (proportionally)
// Never trim priority=1 tools below min_tokens_per_tool
// If deficit still not met after trimming p2/p3 to floor: trim p1 proportionally,
//   but never below min_tokens_per_tool absolute floor
```

Integration in `platform/src/app/api/chat/consume/route.ts`:

After `callLlmPlanner()` returns `planSchema` and before tool execution, apply:
```typescript
const modelMeta = getModelMeta(stackSynthPrimary)
const arbitratedTools = arbitrateBudgets(
  planSchema.tool_calls.map(t => ({
    tool_name: t.tool_name,
    priority: t.priority,
    token_budget: t.token_budget,
  })),
  {
    synthesis_model_max_context: modelMeta?.contextWindow ?? 128_000,
    system_prompt_reserve: 800,
    synthesis_guidance_reserve: 200,
    safety_margin: 0.85,
    min_tokens_per_tool: 200,
  }
)
// Replace planSchema.tool_calls[*].token_budget with arbitrated values
```

Only apply when `planSchema` is non-null (i.e. LLM planner ran). Skip when falling
back to classify+compose.

New file: `platform/tests/pipeline/budget_arbiter.test.ts`

Tests:
1. **No trim needed**: planned_total ≤ available → return unchanged.
2. **Trim p3 only**: p3 tools trimmed proportionally; p1/p2 unchanged.
3. **Trim p3 + p2**: p3 fully trimmed, still over budget → trim p2 proportionally.
4. **Floor respected**: p1 tools never go below min_tokens_per_tool.
5. **Total after arbitration ≤ available** (invariant test across 10 random inputs).

### AC.C.2 — UQE-10: Flag retirement migration note

New file: `00_ARCHITECTURE/MIGRATION_NOTES_v1_0.md`

```markdown
---
artifact: MIGRATION_NOTES_v1_0.md
version: 1.0
status: LIVING
---

# MARSYS-JIS Migration Notes

## MIG-1: LLM_FIRST_PLANNER_ENABLED retirement (target: v2.1)

**Current state (v2.0):** `LLM_FIRST_PLANNER_ENABLED` defaults to `false`.
The LLM planner (`callLlmPlanner`) is implemented and gated; the legacy
`classify() + compose_bundle()` path runs by default.

**Activation:** Set `MARSYS_FLAG_LLM_FIRST_PLANNER_ENABLED=true` in env to
enable the LLM planner. Validate with `npx tsx platform/tests/eval/planner_smoke_runner.ts`.
Accept if avg_tool_recall ≥ 0.80 and avg_tool_precision ≥ 0.90.

**Retirement (v2.1):**
1. Flip DEFAULT_FLAGS: `LLM_FIRST_PLANNER_ENABLED: true`
2. Run full eval smoke test; confirm thresholds pass in production
3. Delete `classify.ts` and `compose_bundle()` call in `route.ts`
4. Remove the `planSchema === null` fallback branch from `route.ts`
5. Remove `LLM_FIRST_PLANNER_ENABLED` from FeatureFlag union and DEFAULT_FLAGS
6. Bump platform version to 2.1

**Prerequisite for retirement:** Native acceptance of planner quality on 5+
consecutive production queries. Run `planner_ab_compare.ts` as final gate.
```

### AC.C.3 — tsc clean + commit

`npx tsc --noEmit` returns zero errors on all new/changed files.
Known_residuals (`AppShell.test.tsx`, `ReportGallery.test.tsx`) exempt.

```
feat(w3-uqe-cleanup): budget arbiter + flag retirement note (UQE-5a/UQE-10)

- budget_arbiter.ts: proportional trim p3→p2→p1 within context window budget
- route.ts: apply arbitrateBudgets() after callLlmPlanner() when planSchema non-null
- tests/pipeline/budget_arbiter.test.ts: 5 tests incl. floor invariant
- MIGRATION_NOTES_v1_0.md: MIG-1 LLM_FIRST_PLANNER_ENABLED retirement path to v2.1
```

---

## may_touch

```
platform/src/lib/pipeline/budget_arbiter.ts               (new)
platform/src/app/api/chat/consume/route.ts
platform/tests/pipeline/budget_arbiter.test.ts             (new)
00_ARCHITECTURE/MIGRATION_NOTES_v1_0.md                    (new)
```

## must_not_touch

```
platform/src/lib/router/**
platform/src/lib/retrieve/**
platform/src/lib/synthesis/**
platform/src/lib/pipeline/manifest_planner.ts
platform/src/lib/pipeline/planner_circuit_breaker.ts
platform/src/lib/config/feature_flags.ts
platform/src/hooks/**
platform/src/components/**
platform/migrations/**
platform/tests/eval/**
01_FACTS_LAYER/**
025_HOLISTIC_SYNTHESIS/**
```

---

## Hard constraints

- Do NOT delete or bypass `classify() + compose_bundle()` — that is UQE-6 scope, deferred.
- Do NOT flip `LLM_FIRST_PLANNER_ENABLED` to true.
- `arbitrateBudgets()` must be pure (no side effects, no DB calls, no async).
- Token counts in tests must use `Math.ceil(str.length / 4)` for consistency — do not fabricate.
- `MIGRATION_NOTES_v1_0.md` is a living document — the retirement steps are a plan, not a
  commitment. Do not mark any step as complete.

---

*W3-UQE-CLEANUP · authored 2026-05-02 · no downstream blockers*
