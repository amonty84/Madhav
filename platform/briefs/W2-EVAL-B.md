---
status: COMPLETE
session: W2-EVAL-B
scope: EVAL-2 (smoke test runner) + EVAL-3 (A/B comparison) + EVAL-4 (regression detection)
authored: 2026-05-02
round: 4
critical_path: false
blocks: nothing (terminal evaluation stream)
prerequisites:
  - W2-EVAL-A (COMPLETE — 731530b): golden_test_set.json (25 entries), README with scoring formula
  - W2-PLANNER (COMPLETE — 4628660): callLlmPlanner(), PlanSchema, manifest_compressor
---

# W2-EVAL-B
## Planner Evaluation: Smoke Runner + A/B Comparison + Regression Detection

Reference this file directly: `platform/briefs/W2-EVAL-B.md`. Do not use CLAUDECODE_BRIEF.md.

---

## Context

W2-EVAL-A (731530b) delivered:
- `platform/tests/eval/golden_test_set.json` — 25 labeled `(query → expected_tools)` pairs
- `platform/tests/eval/README.md` — scoring formula, acceptance thresholds (recall ≥ 0.80, precision ≥ 0.90)

W2-PLANNER (4628660) delivered:
- `callLlmPlanner()` — the LLM-first planner producing `PlanSchema`
- `PlannerError` — typed failure class

This session builds the evaluation harness on top of those two artifacts:
- EVAL-2: smoke test runner that scores `callLlmPlanner` against the golden set
- EVAL-3: A/B comparison script (old `classify()` vs new planner)
- EVAL-4: regression gate for CI (fails if recall drops below threshold)

No live LLM calls in tests — all runner tests use mocks. The actual planner scoring
(EVAL-2 live run) is a CLI script the native runs manually.

---

## Acceptance criteria

### AC.V.1 — EVAL-2: Smoke test runner

New file: `platform/tests/eval/planner_smoke_runner.ts`

A runnable CLI script (not a vitest test file) that:
1. Reads `golden_test_set.json`
2. For each entry, calls `callLlmPlanner(entry.query, [], plannerModelId, chartId)`
3. Compares `planSchema.tool_calls[*].tool_name` against `entry.expected_tools`
4. Computes per-entry and aggregate metrics:

```typescript
interface EvalResult {
  id: string                  // GT.001 etc.
  query: string
  expected_tools: string[]
  predicted_tools: string[]
  required_tools: string[]
  forbidden_tools: string[]
  tool_recall: number         // |predicted ∩ expected| / |expected|
  tool_precision: number      // |predicted ∩ expected| / |predicted|
  required_hit: boolean       // all required_tools present in predicted
  forbidden_violation: boolean // any forbidden_tools present in predicted
  pass: boolean               // recall ≥ 0.80 AND precision ≥ 0.90 AND required_hit AND !forbidden_violation
  error?: string              // if callLlmPlanner threw
}

interface AggregateResult {
  total: number
  passed: number
  failed: number
  avg_tool_recall: number
  avg_tool_precision: number
  forbidden_violations: number
  required_misses: number
  pass_rate: number           // passed / total
}
```

Output: JSON to stdout + human-readable summary to stderr. Exit code 0 if
`avg_tool_recall ≥ 0.80 AND avg_tool_precision ≥ 0.90`, exit code 1 otherwise.

The script reads `PLANNER_MODEL_ID` and `CHART_ID` from environment variables
(default: `PLANNER_MODEL_ID=meta/llama-3.1-8b-instruct`, `CHART_ID=test-native`).

New file: `platform/tests/eval/planner_smoke_runner.test.ts`

Unit tests (mocked — no live calls):
- **Score calculation**: given mock predicted vs expected, verify recall/precision math.
- **required_hit**: entry with required_tools=['remedial_codex_query'], predicted includes it → true; missing → false.
- **forbidden_violation**: predicted includes a forbidden tool → true.
- **Pass logic**: recall=0.85, precision=0.92, required_hit=true, no forbidden → pass=true.
- **Aggregate**: 20 passes / 25 total → pass_rate=0.80.

### AC.V.2 — EVAL-3: A/B comparison script

New file: `platform/tests/eval/planner_ab_compare.ts`

CLI script that runs both `classify()` (old) and `callLlmPlanner()` (new) against
the golden set and emits a side-by-side comparison table:

```
GT.001  classify: [msr_sql]                recall=0.50 precision=1.00
        planner:  [msr_sql, remedial_codex] recall=1.00 precision=1.00 ✓

GT.002  classify: [msr_sql, vector_search]  recall=0.67 precision=0.67
        planner:  [msr_sql, cgm_graph_walk]  recall=0.67 precision=1.00 ✓
...

AGGREGATE
         classify  avg_recall=0.61  avg_precision=0.74
          planner  avg_recall=0.87  avg_precision=0.93  ← THRESHOLD MET
```

The script accepts `--dry-run` flag which uses the existing `classify()` result only
(no LLM call) for fast baseline generation.

This is a script, not a test file — no vitest wrapper needed.

### AC.V.3 — EVAL-4: Regression detection gate

New file: `platform/tests/eval/planner_regression_gate.test.ts`

A vitest test file that:
- Runs `planner_smoke_runner` logic against the golden set using a **mocked planner**
  whose responses are stored in `platform/tests/eval/fixtures/regression_baseline.json`
- Asserts `avg_tool_recall ≥ 0.80` and `avg_tool_precision ≥ 0.90`
- If either threshold fails, the test fails with a descriptive message showing
  which entries regressed

New file: `platform/tests/eval/fixtures/regression_baseline.json`

Pre-computed mock planner responses for all 25 golden set entries. Each entry:
```json
{
  "id": "GT.001",
  "mock_tool_calls": [
    { "tool_name": "remedial_codex_query", "params": {}, "token_budget": 800, "priority": 1, "reason": "remedial query" }
  ]
}
```

The baseline must produce `avg_tool_recall ≥ 0.80` and `avg_tool_precision ≥ 0.90`
when scored against `golden_test_set.json`. Construct it so the regression gate
passes on a correct planner implementation and fails if the planner is broken.

### AC.V.4 — tsc clean + commit

`npx tsc --noEmit` returns zero errors on all new files.
Known_residuals (`AppShell.test.tsx`, `ReportGallery.test.tsx`) exempt.

```
feat(w2-eval-b): planner evaluation harness (EVAL-2/3/4)

- planner_smoke_runner.ts: CLI scorer against golden_test_set.json (exit 1 if recall<0.80)
- planner_smoke_runner.test.ts: 5 unit tests for scoring logic (mocked, no live calls)
- planner_ab_compare.ts: side-by-side classify vs planner comparison CLI
- planner_regression_gate.test.ts: vitest gate — fails if recall/precision drops below threshold
- fixtures/regression_baseline.json: 25 mock responses producing passing baseline scores
```

---

## may_touch

```
platform/tests/eval/planner_smoke_runner.ts            (new)
platform/tests/eval/planner_smoke_runner.test.ts       (new)
platform/tests/eval/planner_ab_compare.ts              (new)
platform/tests/eval/planner_regression_gate.test.ts    (new)
platform/tests/eval/fixtures/regression_baseline.json  (new)
```

## must_not_touch

```
platform/tests/eval/golden_test_set.json
platform/tests/eval/README.md
platform/src/**
platform/migrations/**
00_ARCHITECTURE/**
01_FACTS_LAYER/**
025_HOLISTIC_SYNTHESIS/**
```

---

## Hard constraints

- No live LLM calls in any test file. Mock `callLlmPlanner` and `classify` in all `.test.ts` files.
- `planner_smoke_runner.ts` and `planner_ab_compare.ts` are CLI scripts — they may make live calls but are not run by vitest automatically.
- Do not modify `golden_test_set.json` or `README.md` — those are W2-EVAL-A artifacts.
- The regression baseline must be constructed to produce passing scores — do not fabricate recall/precision values; derive them from the baseline responses you author.
- B.10: do not invent `expected_tools` values. Use only tool names present in `golden_test_set.json`.

---

*W2-EVAL-B · authored 2026-05-02 · terminal evaluation stream, no downstream blockers*
