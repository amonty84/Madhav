---
status: PENDING
session: W2-UQE-ACTIVATE
scope: UQE-ACTIVATE (LLM-first planner activation + EVAL-B smoke)
authored: 2026-05-02
round: 1
critical_path: false
blocks: W2-MON-A (monitoring write integration smoke depends on planner being live)
supersedes: W2-EVAL-A (status COMPLETE 2026-05-01 — archived below)
---

# CLAUDECODE_BRIEF — W2-UQE-ACTIVATE
## LLM-First Planner Activation + EVAL-B Smoke

Read CLAUDE.md §0 first. Copy this file to the project root as
`CLAUDECODE_BRIEF.md` before opening the session.

---

## Context

All Wave 2 UQE planner infrastructure was implemented in prior sessions and
is fully wired into the consume pipeline. The planner is gated by
`LLM_FIRST_PLANNER_ENABLED` (default `false`). This session activates it.

**What is implemented and confirmed wired:**
- `platform/src/lib/pipeline/manifest_compressor.ts` — compressed manifest ≤3K tokens
- `platform/src/lib/pipeline/manifest_planner.ts` — LLM-first planner, `callLlmPlanner()`
- `platform/src/lib/pipeline/planner_context_builder.ts` — conversation history ≤600 tokens
- `platform/src/lib/pipeline/budget_arbiter.ts` — token budget enforcement, `arbitrateBudgets()`
- `platform/src/lib/pipeline/planner_circuit_breaker.ts` — circuit breaker, 3s timeout, 5xx trips
- `platform/src/components/trace/PlanningIndicator.tsx` — TRACE-0 planning spinner
- `platform/src/components/trace/QueryPlan.tsx` — query plan display with planning_done hydration
- `platform/tests/eval/golden_test_set.json` — 25 labeled query→plan pairs (EVAL-1, COMPLETE)
- `platform/tests/eval/planner_smoke_runner.ts` — CLI scorer (EVAL-2)
- `platform/tests/eval/planner_ab_compare.ts` — A/B compare old classify vs new planner (EVAL-3)
- `platform/tests/eval/planner_regression_gate.test.ts` — CI regression gate (EVAL-4)
- `00_ARCHITECTURE/PLANNER_PROMPT_v1_0.md` — system prompt + few-shot examples
- `route.ts` — `callLlmPlanner()` + `arbitrateBudgets()` + `plannerCircuit` all imported and called
  under the `LLM_FIRST_PLANNER_ENABLED` gate

**What is NOT done (this session's scope):**
1. `tsc --noEmit` verification across the planner files
2. `vitest` — ensure planner_regression_gate.test.ts passes
3. EVAL-B smoke: run `planner_smoke_runner.ts` against the NIM stack planner model
4. Flip `LLM_FIRST_PLANNER_ENABLED: true` in `feature_flags.ts` after smoke passes
5. Commit

The NIM stack planner routing (`getNvidiaPlanner(queryClass)`) is live and the
`NVIDIA_NIM_API_KEY` is provisioned in `.env.local`. The smoke runner uses
`PLANNER_MODEL_ID` env var (default: `meta/llama-3.1-8b-instruct` for unit test speed;
set to `nvidia/llama-3.3-nemotron-super-49b-v1` for a production-representative smoke).

---

## Acceptance criteria

### AC.U.1 — tsc clean

`npx tsc --noEmit` exits 0 with zero errors across all planner files and their
consumers (`route.ts`, `single_model_strategy.ts`).

If errors are found: fix them before proceeding. Do not suppress with `// @ts-ignore`.

### AC.U.2 — Vitest regression gate passes

```
npx vitest run platform/tests/eval/planner_regression_gate.test.ts
```

All tests green. The regression gate replays frozen baseline mock responses —
it does NOT make live LLM calls, so it runs offline.

### AC.U.3 — EVAL-B smoke: recall ≥ 0.80, precision ≥ 0.90

```
PLANNER_MODEL_ID=nvidia/llama-3.3-nemotron-super-49b-v1 \
CHART_ID=<any valid chart UUID from the dev DB> \
npx tsx --conditions=react-server platform/tests/eval/planner_smoke_runner.ts
```

Exit code 0 (avg_tool_recall ≥ 0.80 AND avg_tool_precision ≥ 0.90).

If thresholds not met:
- Do NOT flip the flag.
- Record failing entries in the `## Smoke results` section below.
- Identify whether the failure is a prompt issue, a model issue, or a golden
  set labelling issue.
- If prompt issue: update `PLANNER_PROMPT_v1_0.md` and retry once.
- If model issue: note it and leave flag at `false`; surface to native.
- Do not iterate more than 2 rounds — if still failing after 1 prompt fix,
  leave flag at `false` and record findings.

### AC.U.4 — Flip `LLM_FIRST_PLANNER_ENABLED: true`

Only after AC.U.1 + AC.U.2 + AC.U.3 all pass:

In `platform/src/lib/config/feature_flags.ts`, change:
```typescript
// BEFORE:
LLM_FIRST_PLANNER_ENABLED: false,

// AFTER:
// Flipped true W2-UQE-ACTIVATE (2026-05-0X) after EVAL-B smoke PASS:
// recall=<value>, precision=<value>. NIM planner: nemotron-super-49b-v1.
LLM_FIRST_PLANNER_ENABLED: true,
```

### AC.U.5 — Commit

Single commit on the `main` branch:

```
feat(w2-uqe-activate): flip LLM_FIRST_PLANNER_ENABLED after EVAL-B smoke PASS

- feature_flags: LLM_FIRST_PLANNER_ENABLED true (recall=X.XX, precision=X.XX)
- EVAL-B smoke: nemotron-super-49b-v1, N=25 golden entries
- tsc: clean, vitest regression gate: all pass
```

If the smoke fails and the flag is not flipped, the commit message changes to:
```
test(w2-uqe-activate): EVAL-B smoke results + planner state (flag held false)
```

---

## Smoke results (fill in during session)

```
planner_model: nvidia/llama-3.3-nemotron-super-49b-v1
smoke_date: 2026-05-02
avg_tool_recall: 0.000
avg_tool_precision: 0.000
failing_entries: ALL_25 (every entry errored "LLM planner call failed: Not Found")
flag_flipped: false
exit_code: 1
notes: |
  Smoke RAN LIVE this session (sandbox proxy block from prior round is gone —
  ran from dev machine directly). Result: every entry GT.001–GT.025 failed
  with `LLM planner call failed: Not Found` (HTTP 404) at the LLM call site.
  Predicted_tools = [] for all 25; recall/precision = 0.0 / 0.0; required
  misses = 23 (GT.024 + GT.025 have empty required sets so register as hits).
  Forbidden violations = 0. Pass rate = 0.000.

  ROOT CAUSE — NIM PROVIDER WIRING (model/integration issue, not prompt):
    `@ai-sdk/openai@3.0.53` (installed at platform/node_modules) defaults
    `client(modelId)` to `createResponsesModel`, which POSTs to `/responses`
    (the OpenAI Responses API). NVIDIA NIM (https://integrate.api.nvidia.com/v1)
    only serves `/chat/completions`; it returns plain `404 page not found`
    for any other path. The AI SDK surfaces this as `AI_APICallError:
    Not Found` (statusCode 404), which `manifest_planner.ts` wraps as
    `PlannerError("LLM planner call failed: Not Found")`.

    Verified by direct probes from this machine:
      • curl POST /chat/completions with model=nvidia/llama-3.3-nemotron-super-49b-v1
        and a 5-token prompt → HTTP 200, valid completion (assistant content
        "A simple yet effective greeting" returned). API key + endpoint healthy.
      • curl POST /chat/completions same model + tool_calls → HTTP 200,
        valid `tool_calls` array returned. Tool-use mode works.
      • curl POST /chat/completions same model + response_format=json_schema
        → HTTP 500 InternalServerError "Already borrowed" (NIM bug; unrelated).
      • Standalone Node script: `createOpenAI(...).('nvidia/llama-3.3-nemotron-super-49b-v1')`
        + `generateObject(...)` → 404 page not found, AI_APICallError, status 404.
        Same script with `client.chat(modelId)` would force the chat path —
        not tested here because the fix lives in must_not_touch.

    Locus of fix: `platform/src/lib/models/nvidia.ts` line 60-62
    (`getNvidiaModel`). Currently returns `getClient()(modelId)` which is
    the responses-API factory in @ai-sdk/openai v3. Should be
    `getClient().chat(modelId)` to force `/chat/completions`. One-line patch.

  SCOPE — FIX IS OUT OF SESSION:
    `platform/src/lib/models/**` is in `must_not_touch`. The NIM-wrapper fix
    therefore cannot land in this session. Surfaced to native; flag stays
    false per AC.U.3. Recommend a small follow-up session (no other scope)
    that touches only `nvidia.ts` line 61 and re-runs this smoke.

  SECONDARY ISSUE — GOLDEN SET LABELING (EVAL-5, still open from prior round):
    Even with the NIM wiring repaired, 11 of the 8-tool primary set are not
    represented in `expected_tools` correctly: the golden set was authored
    pre-MANIFEST-compression. Theoretical max avg_recall under the current
    PRIMARY_TOOL_NAMES (8 tools) is 0.4553, below the 0.80 threshold.
    GT.023 and GT.024 have zero primary tools in expected_tools (max
    recall = 0.000 even with a perfect planner). This is a separate task
    (golden_test_set.json is in must_not_touch this session).

  ACCEPTANCE STATE:
    AC.U.1 (tsc clean):       PASS  (verified prior session)
    AC.U.2 (regression gate): PASS  (verified prior session, mocked replay)
    AC.U.3 (EVAL-B live):     FAIL  (recall=0.00, precision=0.00; 404 wiring bug)
    AC.U.4 (flag flip):       SKIPPED — held pending AC.U.3
    AC.U.5 (commit):          this commit (test(...) variant per brief)

  PROMPT RETRY: not performed — failure is not a prompt issue. Every entry
  failed at the HTTP layer before the LLM ever saw the prompt. Updating
  PLANNER_PROMPT_v1_0.md would have zero effect.
```

---

## may_touch

```
platform/src/lib/config/feature_flags.ts            (AC.U.4 — flag flip only)
platform/src/lib/pipeline/manifest_planner.ts        (fix only if tsc errors found)
platform/src/lib/pipeline/manifest_compressor.ts     (fix only if tsc errors found)
platform/src/lib/pipeline/planner_context_builder.ts (fix only if tsc errors found)
platform/src/lib/pipeline/budget_arbiter.ts          (fix only if tsc errors found)
platform/src/lib/pipeline/planner_circuit_breaker.ts (fix only if tsc errors found)
00_ARCHITECTURE/PLANNER_PROMPT_v1_0.md               (if AC.U.3 fails for prompt reason)
```

## must_not_touch

```
platform/src/app/api/chat/consume/route.ts           (already wired; no changes needed)
platform/src/lib/synthesis/**
platform/src/lib/retrieve/**
platform/src/lib/router/**
platform/src/lib/models/**
platform/src/components/**
platform/src/hooks/**
platform/migrations/**
platform/tests/eval/golden_test_set.json             (frozen ground truth; immutable)
platform/tests/eval/fixtures/regression_baseline.json (frozen baseline; immutable)
00_ARCHITECTURE/CAPABILITY_MANIFEST.json
01_FACTS_LAYER/**
025_HOLISTIC_SYNTHESIS/**
```

---

## Hard constraints

- B.10: Do not fabricate planner outputs or smoke test results. The smoke runner
  must execute against a live NIM endpoint. If NIM is unavailable, note it and
  leave the flag at `false`.
- The golden test set is immutable for this session. If entries appear
  incorrectly labeled, open a note in the `## Smoke results` section;
  golden set edits are a separate task (EVAL-5, not yet scheduled).
- Circuit breaker timeout is 3 seconds for planning calls. Do not change this
  value to force smoke tests to pass.
- Do not change `DEFAULT_FLAGS.LLM_FIRST_PLANNER_ENABLED` until AC.U.1 + AC.U.2
  + AC.U.3 are all confirmed passing within this session.

---

## Prerequisite checks (do at session open)

1. `NVIDIA_NIM_API_KEY` present in `.env.local` — confirmed provisioned 2026-05-01.
2. Dev DB running at `127.0.0.1:5433` (amjis) — required for chart context.
3. `npx tsc --version` — confirm TypeScript 5.x available.

---

*W2-UQE-ACTIVATE · authored 2026-05-02 · unblocks W2-MON-A*

---
---
## ARCHIVED: W2-EVAL-A (status COMPLETE 2026-05-01)
---

---
status: COMPLETE
session: W2-EVAL-A
scope: UQE-3-REVISED (precision citation gate) + EVAL-1 (golden test set)
authored: 2026-05-01
round: 1
critical_path: false
blocks: W2-EVAL-B (Round 4) for EVAL-1; W2-INSTRUMENT (Round 3) reads the context_assembly_log field added here
---

# CLAUDECODE_BRIEF — W2-EVAL-A
## Precision Citation Gate + Golden Test Set

Read CLAUDE.md §0 first. Copy this file to the project root as
`CLAUDECODE_BRIEF.md` before opening the session.

---

## Context

Two independent tasks:

**UQE-3-REVISED** replaces the existing blunt citation gate (counts
`SIG.MSR.NNN` patterns) with a two-layer validator: Layer 1 is the existing
heuristic; Layer 2 cross-references each citation ID against the assembled
context to detect training-data leakage. Existing code lives at
`platform/src/lib/synthesis/citation_check.ts`.

**EVAL-1** creates the golden test set: 25 labeled `(query → expected_tool_plan)`
pairs used by W2-EVAL-B (Round 4) to score planner quality with tool_recall
and tool_precision metrics.

---

## Acceptance criteria

### AC.E.1 — UQE-3-REVISED: Two-layer citation validator

#### Layer 1 (existing — preserve)
The current `citation_check.ts` counts `SIG.MSR.NNN` pattern occurrences.
Preserve this as Layer 1 (existence check).

#### Layer 2 (new — cross-reference)
New export in `citation_check.ts`:
```typescript
export interface CitationValidationResult {
  layer1_count: number          // SIG.MSR.NNN pattern count in output text
  layer2_verified: number       // citations found in assembled context JSONB
  layer2_leaked: number         // citations in output but NOT in context
  gate_result: 'PASS' | 'WARN' | 'ERROR'
  gate_reason: string
}

export function validateCitations(
  outputText: string,
  assembledContextJson: string,  // the full context bundle JSON string
): CitationValidationResult
```

Gate logic:
```
verified_citations ≥ 1                              → PASS
verified_citations = 0 AND layer1_count > 0         → WARN  (training-data leak)
verified_citations = 0 AND layer1_count = 0
  AND query is prescriptive                          → ERROR (throw PipelineError)
verified_citations = 0 AND layer1_count = 0
  AND query is NOT prescriptive                     → PASS  (informational query, ok)
```

"Prescriptive" = `queryPlan.query_class` is `'remedial'` or `'predictive'`.

Add `CITATION_GATE_OVERRIDE` feature flag (default `false`). When true, convert
ERROR → WARN (allows admin bypass without code change).

#### Integration into route.ts

In the v2 pipeline path in `route.ts`, after synthesis completes, call
`validateCitations(outputText, assembledContextJsonString)`:
- Store result in `context_assembly_log.verified_citations` (field added by W2-SCHEMA).
  If W2-SCHEMA hasn't run yet, write to a local variable and log — don't block.
- On WARN: log to console; emit trace event `citation_warn`.
- On ERROR (and `CITATION_GATE_OVERRIDE=false`): throw `PipelineError` with
  `validator_name: 'citation_gate_l2'`.

#### feature_flags.ts

Add to FeatureFlag union and DEFAULT_FLAGS:
```typescript
'CITATION_GATE_OVERRIDE'   // default: false
```

#### Tests

New file: `platform/tests/synthesis/citation_check.test.ts`
- Test PASS: output contains SIG.MSR.001, context contains SIG.MSR.001.
- Test WARN: output contains SIG.MSR.001, context does NOT contain it → leak.
- Test ERROR: remedial query, output has no citations, context has no citations.
- Test PASS (non-prescriptive): informational query, output has no citations → PASS.
- Test CITATION_GATE_OVERRIDE converts ERROR to WARN.

### AC.E.2 — EVAL-1: Golden test set

New file: `platform/tests/eval/golden_test_set.json`

Create 25 labeled query→plan pairs. Each entry:
```json
{
  "id": "GT.001",
  "query": "...",
  "query_class": "remedial | interpretive | predictive | ...",
  "expected_tools": ["msr_sql", "remedial_codex_query"],
  "required_tools": ["remedial_codex_query"],  // must appear; subset of expected
  "forbidden_tools": [],                        // must NOT appear
  "notes": "Why this example is in the set"
}
```

Distribution across 25 entries (minimum):
- 6 remedial queries (planets, gemstones, mantras)
- 6 interpretive queries (chart reading, house analysis, yoga identification)
- 4 predictive queries (timing, dasha, transit)
- 4 holistic queries (multi-domain synthesis)
- 3 planetary queries (single-planet deep dive)
- 2 edge cases (very short query, ambiguous query)

Each `expected_tools` list must reflect what a correct LLM-first planner
should select — derived from the tool descriptions in CAPABILITY_MANIFEST.json,
not from the current classify() output.

The queries should be realistic questions a native asks about their chart.
Do NOT use generic astrology questions — all 25 must be grounded in the
MARSYS-JIS subject (Abhisek Mohanty, born 1984-02-05, Bhubaneswar) or be
chart-agnostic questions that would work for any native.

New file: `platform/tests/eval/README.md`
- Explains the golden test set format.
- Documents the scoring formula: `tool_recall = |predicted ∩ expected| / |expected|`,
  `tool_precision = |predicted ∩ expected| / |predicted|`.
- States acceptance thresholds for W2-EVAL-B: recall ≥ 0.80, precision ≥ 0.90.

### AC.E.3 — tsc clean + commit

`npx tsc --noEmit` clean on all new/changed files.

```
feat(w2-eval-a): two-layer citation gate + golden test set (UQE-3-REVISED + EVAL-1)

- citation_check.ts: Layer 2 cross-ref validator; WARN on leak, ERROR on zero-verified remedial
- feature_flags: CITATION_GATE_OVERRIDE (default false)
- route.ts: integrate citation validation post-synthesis; emit citation_warn trace event
- golden_test_set.json: 25 labeled query→plan pairs across 6 query classes
- tests/eval/README.md: scoring formula + acceptance thresholds
```

---

## may_touch

```
platform/src/lib/synthesis/citation_check.ts
platform/src/lib/config/feature_flags.ts
platform/src/app/api/chat/consume/route.ts       (add validateCitations call post-synthesis)
platform/tests/synthesis/citation_check.test.ts   (new)
platform/tests/eval/golden_test_set.json           (new)
platform/tests/eval/README.md                      (new)
```

## must_not_touch

```
platform/src/lib/router/**
platform/src/lib/retrieve/**
platform/src/lib/pipeline/**
platform/src/lib/models/**
platform/src/hooks/**
platform/src/components/**
platform/migrations/**
00_ARCHITECTURE/CAPABILITY_MANIFEST.json
01_FACTS_LAYER/**
025_HOLISTIC_SYNTHESIS/**
```

---

## Hard constraints

- Layer 1 of citation_check.ts must remain backward compatible. Do not remove
  the existing `checkCitations()` function — wrap it or extend it.
- The golden test set (EVAL-1) must be grounded in real Jyotish query patterns.
  Do not invent fictitious astrological concepts. Consult
  `01_FACTS_LAYER/FORENSIC_ASTROLOGICAL_DATA_v8_0.md` for chart context.
- B.10: Do not fabricate expected_tools values. Each entry's expected_tools
  must be derived from what the tool actually retrieves per its description
  in the codebase and CAPABILITY_MANIFEST.json.
- EVAL-1 is data only — no runner code. The smoke test runner is EVAL-2 (Round 4).

---

*W2-EVAL-A · authored 2026-05-01 · unblocks W2-EVAL-B (Round 4)*
