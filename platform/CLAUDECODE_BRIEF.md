---
status: PARTIAL
session_scope: Wave 2 — UQE LLM-first planner + context_assembly step
authored: 2026-05-01
authored_by: Claude Sonnet 4.6 (Cowork session)
ac_w2_1_planner: PARKED (LLM_FIRST_PLANNER_ENABLED held false — 8 smoke rounds, Lever 2 native decision 14e4b02)
ac_w2_2_context_assembly: PENDING (context_assembler.ts not yet written — W2-CTX-ASSEMBLY session queued)
ac_w2_3_nvidia_key: DEFERRED (gated on W2-UQE-ACTIVATE re-authorization as Lever 3)
next_session: W2-CTX-ASSEMBLY (execute AC.W2.2 only; skip AC.W2.1 and AC.W2.3)
---

# CLAUDECODE_BRIEF — Wave 2 UQE + Context Assembly

## Governing scope

This brief governs the next dedicated execution session for BHISMA Wave 2.
Read `CLAUDE.md §0` before this file. If this file's `status` is `COMPLETE`,
skip it and proceed with `CLAUDE.md §C` items 1–11 normally.

---

## Active phase

**BHISMA Wave 2 — UQE-4a (LLM-first planner) + context_assembly LLM step**

Prerequisite context: `00_ARCHITECTURE/BHISMA_WAVE2_PLAN_v1_1.md` §UQE-4a.

---

## Background (what was completed in the session that authored this brief)

The preceding session completed BHISMA-B1 through BHISMA-B3 convergence and
the following Wave 2 scaffolding:

1. **Model registry restructured** — 3-tier per-provider family (premium/mid/worker),
   o-series dropped, `ModelTier`, `ModelRole`, `maxInputTokens` fields added.

2. **NVIDIA NIM provider wired** — `nvidia.ts` client, 6 NIM models in registry,
   `resolveModel()` `nvidia` case, `NVIDIA_PLANNER_ENABLED` feature flag (default OFF).

3. **5-stack model system** — `ModelStack`, `CallType`, `STACK_ROUTING` (5×5),
   `stackPicker()`, helper functions. `DEFAULT_STACK_ID = 'nim'`.

4. **UI migrated to stack picker** — `useChatPreferences.ts` (stack replaces model),
   `ModelStylePicker.tsx` (Database icon + stack label + ctx window),
   `ConsumeChat.tsx` (stack commands in palette, updated props),
   `useChatSession.ts` (stack param in body),
   `route.ts` (stack-aware synthesis model resolution, backward-compat for legacy model field).

What **was not done** (scope for this session):

- UQE-4a: replace `classify()` + `compose()` with a single LLM-first planner call.
- context_assembly step: dedicated LLM step receiving all tool outputs before synthesis.
- `NVIDIA_PLANNER_ENABLED=true` + NVIDIA API key in `.env.local` (awaiting key from user).

---

## Acceptance criteria (this session must close all of these)

### AC.W2.1 — LLM-first planner (UQE-4a)

Replace the `classify()` → `compose()` two-step in `route.ts` with a single
`llmFirstPlanner()` call gated behind `LLM_FIRST_PLANNER_ENABLED`.

- When flag is OFF: old path (`classify` + `compose`) executes unchanged.
- When flag is ON: `llmFirstPlanner(queryText, context)` returns an object with
  the same shape as `queryPlan` from `classify()` PLUS a pre-composed tool bundle.
- Planner model: `STACK_ROUTING[selectedStack].planner_deep.primary`.
- If `NVIDIA_PLANNER_ENABLED` is true AND selectedStack is `nim`: use
  `getNvidiaPlanner(queryClass)` to select the per-class NIM model.
- Trace step `classify` is replaced with `llm_plan` (step_type: `llm`).
- All existing trace + audit + validation paths must still fire.

Implementation surface:
- New file: `platform/src/lib/router/llm_planner.ts`
- Exports: `llmFirstPlanner(queryText, context): Promise<QueryPlan & { bundle: ToolBundle }>`
- Flip `LLM_FIRST_PLANNER_ENABLED` to `true` after smoke verification.

### AC.W2.2 — context_assembly step

Insert a `contextAssembler()` call between retrieval and synthesis in the
`NEW_QUERY_PIPELINE_ENABLED` path, gated behind a new flag
`CONTEXT_ASSEMBLY_ENABLED` (default OFF).

- When flag is OFF: tool results pass directly to synthesis unchanged.
- When flag is ON: `contextAssembler(toolResults, queryPlan)` compresses and
  reorders the retrieval results, returning a `ContextBundle` with the same
  fields as `ToolBundle` (same downstream interface).
- Assembler model: `STACK_ROUTING[selectedStack].context_assembly.primary`.
  For NIM stack: `getNvidiaContextAssembler()` = `nemotron-3-super-120b-a12b`.
- Trace step: `context_assembly` (step_type: `llm`, after all retrieval steps).

Implementation surface:
- New file: `platform/src/lib/synthesis/context_assembler.ts`
- Exports: `contextAssembler(results, plan, modelId): Promise<ContextBundle>`
- Add `CONTEXT_ASSEMBLY_ENABLED` to `feature_flags.ts` FeatureFlag union and
  DEFAULT_FLAGS (default `false`).
- Flip `CONTEXT_ASSEMBLY_ENABLED` to `true` after smoke verification.

### AC.W2.3 — NVIDIA API key + flag

- Add `NVIDIA_NIM_API_KEY=<key>` to `platform/.env.local`.
- Flip `NVIDIA_PLANNER_ENABLED: true` in `feature_flags.ts` DEFAULT_FLAGS.
- Smoke: send one holistic query and confirm `llm_plan` trace step shows
  `nvidia/llama-3.1-nemotron-ultra-253b-v1` as the planner model.

### AC.W2.4 — tsc clean

`npx tsc --noEmit` returns 0 errors across all changed files. Pre-existing
test file errors (AppShell.test.tsx, ReportGallery.test.tsx) are acknowledged
as known_residuals in `ONGOING_HYGIENE_POLICIES_v1_0.md §F` — do not fix them
in this session unless they are in scope.

### AC.W2.5 — Commit

Single commit with message:
```
feat(wave2): LLM-first planner (UQE-4a) + context_assembly step

- llm_planner.ts: replaces classify()+compose() when LLM_FIRST_PLANNER_ENABLED
- context_assembler.ts: compresses tool results before synthesis when CONTEXT_ASSEMBLY_ENABLED
- feature_flags.ts: CONTEXT_ASSEMBLY_ENABLED added (default false)
- feature_flags.ts: NVIDIA_PLANNER_ENABLED flipped true (key provisioned)
- route.ts: wires both new steps into the v2 pipeline path
```

---

## must_not_touch

```
01_FACTS_LAYER/**
025_HOLISTIC_SYNTHESIS/**
00_ARCHITECTURE/**
platform/src/lib/models/registry.ts
platform/src/lib/models/resolver.ts
platform/src/lib/models/nvidia.ts
platform/src/hooks/useChatPreferences.ts
platform/src/hooks/useChatSession.ts
platform/src/components/chat/ModelStylePicker.tsx
platform/src/components/consume/ConsumeChat.tsx
```

## may_touch

```
platform/src/lib/router/llm_planner.ts        (new file)
platform/src/lib/synthesis/context_assembler.ts (new file)
platform/src/lib/config/feature_flags.ts
platform/src/app/api/chat/consume/route.ts
platform/.env.local
```

---

## Hard constraints

- Do not change the `STACK_ROUTING` table or `DEFAULT_STACK_ID`.
- Do not remove or rename the `classify()` + `compose()` path — it must remain
  the live path until `LLM_FIRST_PLANNER_ENABLED` is flipped true after smoke.
- Do not pre-build for Wave 3 (parallel tool orchestration, Kimi K2 swarm).
- Follow B.10 — no fabricated computation. If a planner prompt needs calibration
  data, mark `[CALIBRATION_REQUIRED]` and note what data is needed.

---

*End of CLAUDECODE_BRIEF — Wave 2 UQE + Context Assembly (2026-05-01)*
