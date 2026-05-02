---
status: BLOCKED
session: W2-UQE-ACTIVATE
scope: UQE-ACTIVATE (LLM-first planner activation + EVAL-B smoke + golden-set R7 reconciliation)
authored: 2026-05-02
round: 7
critical_path: false
blocks: W2-MON-A (monitoring write integration smoke depends on planner being live)
supersedes: W2-EVAL-A (status COMPLETE 2026-05-01 — archived below)
flag_flipped: false
round_7_state:
  scope: model-swap probe (registry.ts getNvidiaPlanner only) — switch off nemotron-super-49b-v1 to eliminate 3s-breaker trips
  candidate_1: meta/llama-3.1-8b-instruct
  candidate_1_outcome: FAIL (exit 1; recall=0.750, precision=0.631; 0 NIM errors / 0 smoke-level timeouts)
  candidate_1_binding_constraint: precision (gap to 0.90 = 0.27; gap to Case-B 0.85 floor = 0.22)
  candidate_1_latency_ms: {min:1523, median:2718, max:4726, count_over_3000:10}
  candidate_2: nvidia/llama-3.1-nemotron-nano-8b-v1
  candidate_2_outcome: FAIL (exit 1; "Unknown model id" — local registry resolver allowlist rejects; cannot run smoke without registry catalog edit, which is out of scope per round-7 brief)
  candidate_2_nim_probe: HTTP 200 in 28.6s on a "Say only OK" prompt — model exists at NIM, but base latency would 100% trip the 3s production circuit breaker even if allowlisted
  decision: Case C — registry.ts unchanged, flag held false, no further rounds
  side_finding_for_native: |
    The brief's "28% timeout rate against 3s circuit breaker" framing is incorrect.
    The 3s circuit breaker is wired only at route.ts:243 (wrapping callLlmPlanner
    inside the consume request handler). The smoke runner bypasses it — it calls
    callLlmPlanner directly without the breaker. The 7/25 round-6 errors were
    NIM-level transient errors / network timeouts, not breaker trips. Production
    behavior with 8B would actually have a HIGHER fallback rate (≈40%) than 49B's
    smoke timeout rate (28%): 10/25 of 8B's smoke calls completed in 3.0–4.7 s,
    which would all trip the production breaker → graceful fallback to classify().
    Net effect on user-facing precision/recall is neutral (breaker fallback is
    silent), but the planner would be bypassed on ≈40% of remedial/holistic queries.
round_6_state:
  prompt_edits: §4.2 tightened to 3 tools (vector_search dropped, annotation added) + new §4.3 contrast few-shot (weakest-planet → pattern_register) + interpretive renumbered §4.3 → §4.4
  smoke_outcome: FAIL (recall=0.530, precision=0.500; thresholds 0.80/0.90)
  binding_constraint: precision (gap to 0.90 ≈ 0.40 headline / ≈ 0.21 on non-timeout subset; recall non-timeout is 0.736 vs 0.80 → 0.064 gap)
  partial_wins: forbidden_violations 1→0 (GT.003 yellow-sapphire fixed), GT.005 weakest-planet now passes (contrast few-shot landed), pass count 2→4
  partial_regressions: GT.004 swung the wrong way (model now over-applies pattern_register to alignment remedials too); 7/25 timeouts (vs 5/25 round 5) — transient NIM
  follow_up_decision_needed: lower thresholds OR switch planner model OR accept current floor — per round-6 brief constraint, no round 7
round_5_state:
  prompt_doc_code_mirror_gap: RESOLVED (manifest_planner.ts now loads §3 + §4 from PLANNER_PROMPT_v1_0.md at module init)
  nim_tool_call_500: RECOVERED (probe + 20/25 live plans returned valid tool_calls; 5 transient timeouts, no 500s)
  smoke_outcome: FAIL (recall=0.607, precision=0.527; thresholds 0.80/0.90)
  follow_up: prompt/few-shot calibration drift — model now over-applies resonance_register + vector_search after the §4.2 alignment few-shot took effect; needs targeted prompt tuning, not infrastructure work
round_4_blockers:
  - NIM_TOOL_CALL_500 (constrained-decoding endpoint returning 25/25 hard 500s on smoke payload while direct chat + small tool-call probes return 200; not a prompt-fix issue)
  - PROMPT_DOC_CODE_MIRROR_GAP (runtime SYSTEM_PROMPT in manifest_planner.ts is a hardcoded copy of PLANNER_PROMPT_v1_0.md §3; markdown-only edits do not propagate; §4 few-shots are not loaded at runtime at all)
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

## Smoke results (Round 7 — model-swap probe; registry.ts NOT modified)

```
planner_model_candidate_1: meta/llama-3.1-8b-instruct
planner_model_candidate_2: nvidia/llama-3.1-nemotron-nano-8b-v1
smoke_date: 2026-05-02 (Round 7 — model-swap probe per native-authorized round-7 brief)
flag_flipped: false
exit_code_candidate_1: 1
exit_code_candidate_2: 1
registry_modified: false   # Case C: do not update registry.ts
notes: |
  Round 7 was authorized by the native to probe whether swapping the
  deep-planner from nemotron-super-49b-v1 to a faster 8B candidate would
  give the prompt a fair test (round-6 binding diagnosis: model too slow
  given the 3s production breaker; non-timeout subset showed recall=0.736,
  precision=0.694 — so the prompt is calibrated). The brief authorized
  ONLY a change to getNvidiaPlanner() in platform/src/lib/models/registry.ts
  if a candidate passed thresholds. No prompt changes, no breaker changes,
  no golden-set / regression-baseline changes.

  CANDIDATE 1 — meta/llama-3.1-8b-instruct
    Smoke aggregate:
      avg_tool_recall:      0.750  (threshold 0.80 ; gap 0.05)
      avg_tool_precision:   0.631  (threshold 0.90 ; gap 0.27)
      passed:               3 / 25
      forbidden_violations: 0
      required_misses:      5
      smoke_errors / NIM-level timeouts: 0
    Latency distribution (callLlmPlanner returned successfully; smoke
    runner does NOT enforce the 3s circuit breaker):
      min=1523ms, median=2718ms, max=4726ms
      latencies > 3000ms: 10 / 25 (40%)
    Diagnosis vs Case-B gate:
      Case-B requires: timeouts ≤ 2 AND (recall ≥ 0.75 OR precision ≥ 0.85)
      timeouts = 0 ✓
      recall = 0.750 (exactly at the 0.75 floor) ✓ — Case-B applies
      → fall through to candidate 2

  CANDIDATE 2 — nvidia/llama-3.1-nemotron-nano-8b-v1
    Smoke aggregate:
      All 25 entries returned: "LLM planner call failed: Unknown model id:
      nvidia/llama-3.1-nemotron-nano-8b-v1"
      The error is raised by the local resolver allowlist in
      platform/src/lib/models/resolver.ts / nvidia.ts — NIM is not reached.
      Adding this model to the registry's catalog is out of scope for this
      round (brief constrains to getNvidiaPlanner() only).
    Direct NIM probe (independent of the smoke runner):
      curl POST /v1/chat/completions with "Say only OK" prompt:
        HTTP 200 in 28.6 s
      Conclusion: model exists at NIM but base latency on a trivial prompt
      already 100%-trips the 3s production circuit breaker. Even if
      allowlisted, this candidate is structurally unsuitable for a planner
      gated at 3s.
    → fall through to Case C

  CASE C OUTCOME (per round-7 brief):
    - registry.ts is NOT modified.
    - feature_flags.ts is NOT flipped (LLM_FIRST_PLANNER_ENABLED stays false).
    - Commit captures probe results for both models; status remains BLOCKED.
    - No further rounds.

  BINDING-CONSTRAINT SUMMARY:
    Candidate 1 (8B):
      Binding constraint = precision (0.27 below threshold; 0.22 below
      the Case-B 0.85 floor). Recall is acceptable. Forbidden = 0,
      required_misses = 5.
    Candidate 2 (nano-8B):
      Not loadable in current registry. NIM-level latency (28.6s on a
      trivial prompt) makes it unsuitable regardless.

  PRODUCTION-LATENCY CORRECTION FOR THE NATIVE:
    The round-7 brief framed the issue as "nemotron-super-49b-v1 times
    out on 28% of smoke entries (7/25) against the 3-second circuit
    breaker." That framing is incorrect: the 3s circuit breaker is
    wrapped only at platform/src/app/api/chat/consume/route.ts:243
    (wrapping callLlmPlanner inside the consume request handler). The
    smoke runner calls callLlmPlanner directly, with NO breaker
    enforcement. So:
      - The 7/25 errors in round 6 against the 49B were NIM-level
        transient errors (network or vendor-side), not breaker trips.
      - The 0 errors in round 7 against the 8B do NOT mean the 8B
        avoids breaker trips in production. With the 3s breaker
        enforced, 10/25 (40%) of 8B's smoke calls would trip the
        breaker and gracefully fall back to classify().
      - Net effect of a model swap to 8B in production: planner
        coverage drops from "≈72% of remedial/holistic queries served
        by planner" (49B, ~7/25 vendor errors) to "≈60% served by
        planner" (8B, 10/25 over the 3s budget). The SAVING is in
        per-call latency variance, not in breaker-trip rate.

  TWO PATHS FORWARD (need native decision in a follow-up brief):

    (A) RAISE THE PRODUCTION CIRCUIT BREAKER from 3s to 5s. With a
        5s budget, 22/25 of 8B's calls would clear (88% planner
        coverage), and the 8B's recall=0.75 / precision=0.63 becomes
        the operational metric — still below 0.80/0.90 thresholds
        but with a known, calibratable gap. Risk: real users see
        +2s tail latency on the worst planner calls. The brief's
        round-7 hard constraint forbade raising the breaker; lifting
        that constraint is a native decision, not a prompt one.

    (B) ADD nemotron-nano-8b-v1 OR A 70B-CLASS MODEL TO THE REGISTRY
        ALLOWLIST. The nano model's 28s NIM latency disqualifies it.
        A 70B-class model on the same Nemotron family (e.g.
        nvidia/llama-3.3-nemotron-70b-instruct, if available on the
        free tier) might land in a sweet spot. This requires a
        registry catalog edit (out of round-7 scope) plus a fresh
        smoke. Risk: similar precision/recall calibration to the 49B
        with marginally lower latency — may not move the needle.

    Both paths are infrastructure or routing decisions, not prompt
    calibration. The remaining 0.27 precision gap on the 8B is a
    prompt/calibration concern for a separate round (would need
    further few-shot tightening — the 8B's failure mode is identical
    to the 49B's: it picks resonance_register + cgm_graph_walk +
    vector_search across query classes, identifying the cluster_atlas
    + pattern_register substitutes the golden set encodes).

  ACCEPTANCE STATE (Round 7):
    AC.U.1 (tsc clean):        not re-run — no code edits this round
    AC.U.2 (regression gate):  not re-run — fixture did not change
    AC.U.3 (EVAL-B live):      FAIL  (8B: recall=0.750, precision=0.631;
                                      nano-8b: not loadable)
    AC.U.4 (flag flip):        SKIPPED — held pending AC.U.3
    AC.U.5 (commit):           this commit (test(...) round-7 variant per
                               brief Case C: "model-swap probe — both 8B
                               candidates below threshold, flag held false")

```

## Smoke results (Round 6 — §4.2 tightened + §4.3 contrast few-shot)

```
planner_model: nvidia/llama-3.3-nemotron-super-49b-v1
smoke_date: 2026-05-02 (Round 6 — §4.2 tightened, §4.3 contrast added)
avg_tool_recall: 0.530       (non-timeout subset: 0.736)
avg_tool_precision: 0.500    (non-timeout subset: 0.694)
total: 25
passed: 4
failed: 21
forbidden_violations: 0       (Round 5 was 1 — §4.2 vector_search drop fixed GT.003)
required_misses: 13
pass_rate: 0.160
flag_flipped: false
exit_code: 1
binding_constraint: precision (headline 0.500 vs 0.90 = 0.40 gap;
                               non-timeout subset 0.694 vs 0.90 = 0.21 gap)
notes: |
  Round 6 applied two prompt edits to PLANNER_PROMPT_v1_0.md per native
  authorization. No code changes. The doc/code mirror established in
  Round 5 means edits propagated to the runtime automatically — no
  manifest_planner.ts touch needed.

  PROMPT EDITS APPLIED (PLANNER_PROMPT_v1_0.md only):

    EDIT 1 — Tightened §4.2 alignment-character few-shot from 4 tools
             to 3 tools by removing the vector_search entry (and
             updating the §4.2 preamble to explain why: "alignment
             queries are answered from MSR signals + the remedial
             codex + the resonance lens; they do not require semantic
             text search across L3 long-form. Adding it inflates the
             plan and trips precision on entries where vector_search
             is forbidden."). Final §4.2 plan: msr_sql + remedial_
             codex_query + resonance_register, all with original
             priorities and budgets.

    EDIT 2 — Added §4.3 "Remedial query — recurring-pattern character
             (weakest planet)" — a pattern-vs-resonance contrast
             example using GT.005's query type ("Recommend a daily
             ritual to strengthen my chart's weakest planet"). The
             expected_plan picks pattern_register (not resonance_-
             register) alongside msr_sql + remedial_codex_query, all
             3 tools with appropriate budgets. The §4.3 preamble
             explicitly contrasts with §4.2: "the query is not asking
             whether a specific prescription aligns; it is asking how
             to act on a recurring weakness pattern."

    Renumbering: existing §4.3 (interpretive Mars-8H) moved to §4.4
             (untouched content). §4 intro updated from "Three
             examples" to "Four examples" with an expanded preamble
             that names the lens-choice heuristic explicitly:
             "pattern_register for recurring-pattern remedials...
             resonance_register for alignment-character remedials..."
             with concrete examples cited per lens.

    No other §4 content changed. §1, §2, §3 (R1–R10), §5 untouched.

  ROUND-OVER-ROUND DELTA (Round 5 → Round 6):
    recall:                0.607 → 0.530     (-0.077)
    precision:             0.527 → 0.500     (-0.027)
    passed:                2/25 → 4/25       (+2)
    forbidden_violations:  1 → 0             (FIXED via §4.2 edit)
    required_misses:       9 → 13            (+4, worse)
    timeouts:              5 → 7             (transient NIM noise)

  PARTIAL WINS (the prompt edits did do what they were aimed at):

    GT.003 (yellow sapphire — alignment remedial, vector_search forbidden):
      Round 5: predicted included vector_search → forbidden_violation
      Round 6: predicted = [msr_sql, remedial_codex_query, resonance_register]
               PASSED (recall=1.00 precision=1.00)
      → §4.2 vector_search removal landed cleanly.

    GT.005 (weakest-planet remedial — pattern_register expected):
      Round 5: predicted [msr_sql, remedial_codex_query, resonance_register]
               recall=0.67 precision=0.67 required_miss(pattern_register)
      Round 6: PASSED (predicted matched expected within tolerance)
      → §4.3 contrast few-shot landed cleanly. The contrast example
        successfully taught the model to pick pattern_register on
        weakest-planet recurring-pattern queries.

    Net new passes vs Round 5: GT.003 + GT.005 + GT.020 (timeout in
    Round 5, succeeded in Round 6) + GT.023 (was not passing in
    Round 5; succeeded in Round 6 with [pattern_register, resonance_register, msr_sql, vector_search]).

  PARTIAL REGRESSION (the contrast pulled GT.004 the wrong way):

    GT.004 ("planetary remedies for my Mars" — alignment-character
            remedial, expected resonance_register):
      Round 5: predicted [msr_sql, remedial_codex_query] — under-recall
      Round 6: predicted [msr_sql, remedial_codex_query, pattern_register]
               recall=0.67 precision=0.67 required_miss(resonance_register)
      → The §4.3 contrast made the model more willing to pick pattern_-
        register, but it generalized that to ALL remedials. The §4.2/§4.3
        contrast is not strong enough to keep alignment remedials on
        the resonance side — they need a clearer alignment-character
        signal in the query, OR the lens distinction needs another
        contrast example, OR a hard rule (R8 extension) saying
        "remedies asked about by name (gemstone, mantra, X-propitiation)
        always pick resonance_register."

  TIMEOUT NOISE:
    7/25 = 28% transient timeouts (GT.001, 002, 007, 012, 014, 019, 022).
    Each timeout = recall 0.0, precision 0.0, required_miss → all
    drag aggregate metrics severely. Non-timeout subset (18 entries):
      recall=0.736 precision=0.694 — much closer to thresholds.
    Round 5 had 5 timeouts. The variance round-over-round is not a
    prompt issue; it's NIM constrained-decoding service variance under
    the full 5K-token planner payload. Worth raising with vendor or
    routing through a different planner model if this persists.

  TOP 5 NON-TIMEOUT FAILURES (predicted vs expected):

    GT.009  (interpretive — "What yogas are present in my chart?")
      expected:  [pattern_register, msr_sql]
      predicted: [msr_sql, cgm_graph_walk, resonance_register]
      recall=0.50 precision=0.33 required_miss(pattern_register)
      diagnosis: model picks resonance_register + cgm_graph_walk for
                 yoga identification; expected pattern_register only.
                 The yoga-specific pattern (recurring-rule-based
                 pattern recognition) maps to pattern_register but
                 the model defaults to resonance_register on all
                 interpretive too.

    GT.017  (holistic — "comprehensive overview of my life path")
      expected:  [cluster_atlas, vector_search, pattern_register, cgm_graph_walk]
      predicted: [msr_sql, pattern_register, resonance_register, vector_search]
      recall=0.50 precision=0.50 required_miss(cluster_atlas)
      diagnosis: model substitutes msr_sql + resonance_register for
                 cluster_atlas + cgm_graph_walk on holistic queries.
                 The few-shots have no holistic example — the model
                 has no template for picking cluster_atlas.

    GT.018  (holistic — "central themes and contradictions")
      expected:  [pattern_register, contradiction_register, resonance_register, cluster_atlas]
      predicted: [msr_sql, contradiction_register, resonance_register]
      recall=0.50 precision=0.67 required_miss(pattern_register)
      diagnosis: dropped pattern_register + cluster_atlas; substitutes
                 msr_sql. Same root cause as GT.017 — no holistic
                 few-shot.

    GT.004  (remedial alignment — "remedies for my Mars")
      expected:  [remedial_codex_query, msr_sql, resonance_register]
      predicted: [msr_sql, remedial_codex_query, pattern_register]
      recall=0.67 precision=0.67 required_miss(resonance_register)
      diagnosis: §4.3 contrast pulled this the wrong way. The query
                 lacks an explicit alignment-character signal
                 (gemstone, mantra, etc.) so the model defaults to
                 pattern_register after seeing §4.3.

    GT.013  (predictive — "upcoming Ketu Mahadasha 2027")
      expected:  [vector_search, msr_sql, pattern_register]
      predicted: [msr_sql, pattern_register, resonance_register]
      recall=0.67 precision=0.67 required_miss(vector_search)
      diagnosis: model picked resonance_register over vector_search
                 for a forward-looking dasha query. vector_search is
                 expected for L3 dasha-specific long-form. The
                 few-shots cover remedial + interpretive but no
                 predictive — the model has no template guidance for
                 "predictive needs vector_search".

  ACCEPTANCE STATE (Round 6):
    AC.U.1 (tsc clean):        PASS  (9 baseline errors unchanged, zero new)
    AC.U.2 (regression gate):  not re-run — fixture did not change
    AC.U.3 (EVAL-B live):      FAIL  (recall=0.530, precision=0.500;
                                      non-timeout subset 0.736/0.694;
                                      thresholds 0.80/0.90)
    AC.U.4 (flag flip):        SKIPPED — held pending AC.U.3
    AC.U.5 (commit):           this commit (test(...) round-6 variant per brief)

  FINAL DETERMINATION (per Round-6 brief: no Round 7):

    The remaining gap is structural, not a single fixable prompt edit:

    1. The §4.2/§4.3 contrast is too weak. The model treats lens
       choice as roughly 50/50, and the few-shot examples can pull
       it either way depending on which is more recently in context.
       A hard R-rule ("alignment-character remedials with named
       prescriptions ALWAYS pick resonance_register") would fix this,
       but adds rule-stack pressure on the planner.

    2. The few-shot set is missing two query classes the golden set
       expects to see: holistic (cluster_atlas + cgm_graph_walk) and
       predictive (vector_search). Without those templates, the model
       substitutes msr_sql + resonance_register for the missing tools.

    3. The 28% timeout rate at the 49B model size is a non-prompt
       drag. Switching to a faster planner (e.g. nvidia/llama-3.1-
       nemotron-70b-instruct or a smaller variant) would likely cut
       the timeout rate but risks reducing tool-selection precision.

    THREE PATHS FORWARD (native decision needed):

    (A) LOWER THRESHOLDS to recall ≥ 0.65, precision ≥ 0.65 — these
        match round-6's non-timeout subset within ~0.05 each. Reduces
        guarantee strength but enables ramp-up; circuit-breaker
        fallback to classify() catches truly broken plans anyway.
        Most operational risk: WARN-level mismatches that don't
        block synthesis.

    (B) SWITCH PLANNER MODEL — try meta/llama-3.3-70b-instruct or
        a smaller faster variant. Smaller risk: if precision/recall
        scale similarly to nemotron-49b, we trade timeout rate for
        a different calibration drift. Medium effort: re-run smoke
        twice (once on candidate, once with prompt-tuning round).

    (C) ACCEPT THE FLOOR — keep flag false, document W2-UQE-ACTIVATE
        as paused, route consume traffic through classify() until
        either (i) the golden set is rebuilt around the model's
        actual behavior or (ii) a structurally different planner
        approach is tried (e.g., planner-as-classifier first then
        a separate retrieval-spec generator). This is the
        lowest-risk path but means the planner infrastructure built
        in W2-UQE-* sessions sits unused indefinitely.

    No round 7 attempted per brief. Surface for native decision.

```

## Smoke results (Round 5 — SYSTEM_PROMPT synced, NIM healthy)

```
planner_model: nvidia/llama-3.3-nemotron-super-49b-v1
smoke_date: 2026-05-02 (Round 5 — prompt doc/code mirror closed via runtime markdown load)
avg_tool_recall: 0.607
avg_tool_precision: 0.527
total: 25
passed: 2
failed: 23
forbidden_violations: 1
required_misses: 9
pass_rate: 0.080
flag_flipped: false
exit_code: 1
notes: |
  Round 5 closed the Round-4 doc/code mirror gap and re-ran the smoke against
  a healthy NIM tool-call backend. Both Round-4 blockers resolved.

  CHANGE LANDED THIS ROUND (manifest_planner.ts only):
    Refactored the SYSTEM_PROMPT const from a hand-copied string of
    PLANNER_PROMPT_v1_0.md §3 to a module-init function that reads the
    markdown at runtime and assembles §3 (system prompt body) + §4 (all
    three few-shot examples). The QUERY_CLASS_EXTENSION (one paragraph
    that lives only in code, predating its addition to the markdown) is
    appended between §3 and §4. PROMPT_PATH mirrors MANIFEST_PATH:
    `path.join(process.cwd(), '..', '00_ARCHITECTURE',
    'PLANNER_PROMPT_v1_0.md')`. Two small extractor functions
    (extractSystemPromptBody, extractFewShotSection) parse the headings
    + fenced code blocks; no third-party markdown lib needed.

    Effect: assembled prompt grew from ~900 tokens (§3 only) to
    ~2234 tokens (§3 + QUERY_CLASS_EXTENSION + §4 with all 3 few-shots).
    All Round-4 markdown edits (R8 = msr_sql priority 1 on remedials,
    R7 elaboration on lens choice, the new §4.2 alignment-character
    few-shot, renumbered R9/R10) are now in the model's context.
    Sanity-check probe confirmed: R7 Saturn-friction + yellow-sapphire
    examples present, R8 msr_sql/calibrated text present, §4.1/4.2/4.3
    headings + JSON examples present, no leftover R8="Output JSON"
    numbering.

    No code outside manifest_planner.ts changed. PlanInputJsonSchema,
    callLlmPlanner signature, NIM grammar workarounds, generateText +
    submit_plan tool flow, error handling, writeLlmCallLog, emitTrace —
    all preserved.

  NIM TOOL-CALL BACKEND: HEALTHY THIS ROUND.
    Pre-smoke probe: POST /v1/chat/completions with tool_choice=required
    + small pong tool → HTTP 200 in <30 s, valid tool_call returned.
    Smoke run: 20/25 entries returned valid plans (median latency
    ~6-10 s). 5 entries timed out (GT.002, GT.009, GT.013, GT.014,
    GT.020) — transient. No 500s on any payload.

  PROMPT EDITS NOW ACTIVE IN MODEL BEHAVIOR (round-over-round delta):
    Round 3 (markdown matched runtime, no §4 in runtime):
      recall=0.500 precision=0.667 passed=4/25
    Round 5 (markdown NOW loaded into runtime including §4):
      recall=0.607 precision=0.527 passed=2/25
    Δrecall=+0.107, Δprecision=-0.140, Δpassed=-2.

    The recall lift confirms the prompt-doc edits ARE now influencing
    the model — specifically, the alignment-character remedials
    (GT.001-004, GT.006) now correctly get resonance_register where
    Round 3 they got pattern_register. Five entries each gained an
    expected tool from the §4.2 few-shot's calibration.

  REMAINING GAP — MODEL OVER-GENERALIZES THE §4.2 FEW-SHOT:
    The new §4.2 alignment few-shot includes vector_search (for L3
    long-form on gemstone-alignment principles). The model now copies
    vector_search into ~13/20 non-timeout plans, including interpretive
    queries (GT.007/008/010-012), planetary queries (GT.021/022),
    and even GT.003 where vector_search is FORBIDDEN — the only
    forbidden_violation this round.

    Similarly, the model now picks resonance_register for almost every
    remedial AND interpretive AND predictive query, where the golden
    set wants pattern_register on recurring-pattern remedials (GT.005),
    interpretive queries (GT.008/017/018), and predictive queries
    (GT.015). The §4.2 lens-split heuristic is too subtle for the model
    to distinguish reliably without more contrasting examples.

    Top 5 non-timeout failures (predicted vs. expected diffs):

      GT.017  (holistic, "comprehensive overview of life path")
        expected:  [cluster_atlas, vector_search, pattern_register, cgm_graph_walk]
        predicted: [msr_sql, pattern_register, resonance_register, vector_search]
        recall=0.50 precision=0.50 required_miss(cluster_atlas)
        diagnosis: model substitutes msr_sql + resonance_register for
                   cluster_atlas + cgm_graph_walk on holistic queries

      GT.018  (holistic, "central themes and contradictions")
        expected:  [pattern_register, contradiction_register, resonance_register, cluster_atlas]
        predicted: [msr_sql, contradiction_register, resonance_register, vector_search]
        recall=0.50 precision=0.50 required_miss(pattern_register)
        diagnosis: dropped pattern_register + cluster_atlas; added
                   msr_sql + vector_search

      GT.022  (planetary, "Mars across divisional charts")
        expected:  [msr_sql, pattern_register]
        predicted: [msr_sql, cgm_graph_walk, resonance_register, vector_search]
        recall=0.50 precision=0.25
        diagnosis: 4-tool plan vs. expected 2-tool; pattern_register
                   replaced by resonance_register; cgm_graph_walk + vector_search added

      GT.005  (remedial, "ritual for weakest planet")
        expected:  [remedial_codex_query, msr_sql, pattern_register]
        predicted: [msr_sql, remedial_codex_query, resonance_register]
        recall=0.67 precision=0.67 required_miss(pattern_register)
        diagnosis: alignment-vs-pattern lens picked wrong way — the
                   "weakest planet" framing is recurring-pattern, but
                   the model defaults to resonance_register for any
                   remedial after the §4.2 example

      GT.024  (holistic, "high-level read of the chart")
        expected:  [pattern_register, cluster_atlas]
        predicted: [msr_sql, cluster_atlas, resonance_register]
        recall=0.50 precision=0.33
        diagnosis: pattern_register dropped in favor of msr_sql +
                   resonance_register

    Forbidden violation:
      GT.003  (remedial, "should I wear a yellow sapphire?")
        expected:  [remedial_codex_query, msr_sql, resonance_register]
        predicted: [msr_sql, remedial_codex_query, resonance_register, vector_search]
        forbidden: [vector_search, domain_report_query]
        recall=1.00 precision=0.75 — recall perfect, precision damaged
        by vector_search inclusion (which is exactly the §4.2 few-shot's
        4th tool — the model copied the example structure).

  ACCEPTANCE STATE (Round 5):
    AC.U.1 (tsc clean):        PASS  (9 baseline errors unchanged, zero new from refactor)
    AC.U.2 (regression gate):  not re-run — fixture did not change
    AC.U.3 (EVAL-B live):      FAIL  (recall=0.607, precision=0.527; thresholds 0.80/0.90)
    AC.U.4 (flag flip):        SKIPPED — held pending AC.U.3
    AC.U.5 (commit):           this commit (test(...) round-5 variant per brief §10)

  FINAL DETERMINATION:
    Mirror gap closed structurally — future PLANNER_PROMPT_v1_0.md
    edits will land in runtime without code changes. NIM healthy.
    Smoke did not pass thresholds. Flag remains false.

    The remaining failure mode is calibration, not infrastructure. The
    §4.2 alignment few-shot is too "complete" — its 4-tool plan is
    being template-copied across query classes that should pick
    smaller, differently-shaped plans. Two natural next steps for a
    follow-up session (both prompt-only):

      (a) Tighten §4.2 to a smaller 3-tool plan (drop vector_search
          from the example) so the model stops template-copying it
          across classes. This directly fixes GT.003 forbidden
          violation and the GT.007/008/010-012/021/022 precision drag.

      (b) Add a pattern-vs-resonance contrast few-shot — e.g., a
          remedial that resolves to pattern_register (the "weakest
          planet" case GT.005 is the natural example) — so the model
          learns the lens distinction is real, not the default
          resonance_register-everywhere behavior it now defaults to.

    No model swap warranted. Recall is moving the right direction
    (+0.107 round-over-round) once the markdown actually reaches
    the model. Precision needs a couple of targeted prompt tweaks.

```

## Smoke results (Round 4 — second prompt attempt + NIM tool-call outage)

```
planner_model: nvidia/llama-3.3-nemotron-super-49b-v1
smoke_date: 2026-05-02 (Round 4 — prompt-fix v2 + NIM tool-call backend degraded)
avg_tool_recall: 0.000
avg_tool_precision: 0.000
total: 25
passed: 0
failed: 25
forbidden_violations: 0
required_misses: 23
pass_rate: 0.000
flag_flipped: false
exit_code: 1
notes: |
  Round 4 ran the second (and per brief §10, FINAL) prompt attempt. Smoke
  did NOT meaningfully evaluate the prompt fix because of two independent
  blockers discovered during execution.

  PROMPT EDITS APPLIED THIS ROUND (PLANNER_PROMPT_v1_0.md only):
    FIX 1 — Added a second remedial few-shot example (new §4.2,
            "alignment character — gemstone / mantra") that selects
            resonance_register alongside msr_sql + remedial_codex_query +
            vector_search. The original Saturn-career remedial moves to
            §4.1 ("recurring-pattern character"), and the interpretive
            example renumbers to §4.3. A pre-example explanatory paragraph
            calls out the pattern_register vs resonance_register split.
    FIX 2 — Inserted a new R8 between the existing R7 and R8 (renumbering
            "Output JSON only" to R9 and "If unanswerable" to R10):
              R8. For remedial queries, ALWAYS include `msr_sql` at
                  priority 1 — the remedy cannot be calibrated without
                  first surfacing the implicated grahas/signals. Without
                  msr_sql at priority 1, the plan is incomplete.
            Also extended R7 with explicit text guidance on which lens
            to pick (pattern_register for recurring-pattern queries,
            resonance_register for alignment-character remedials), with
            concrete examples in-rule.

    No other rules were modified. PRIMARY_TOOL_NAMES, thresholds,
    and any code outside the markdown were untouched per brief.

  BLOCKER 1 — NIM TOOL-CALL BACKEND DEGRADED:
    Two consecutive full smoke runs returned 25/25 hard "Internal Server
    Error" responses on the constrained-decoding/tool-call path against
    nvidia/llama-3.3-nemotron-super-49b-v1. Each entry retried 3 times via
    the AI SDK; each retry got 500. None of the 25 entries produced a
    valid plan, so neither the prompt-fix improvement nor any per-entry
    score could be measured.

    Live availability probes from this session:
      curl POST /v1/chat/completions with plain message →
          HTTP 200 in 16.4 s ("OK")
      curl POST with tool_choice='required' + small submit_plan tool →
          HTTP 200 in 64.3 s (valid tool_call returned)

    So NIM is up generally and the tool-call grammar engine works on
    small payloads, but the smoke's full-shape payload (~5K-token system +
    compressed manifest in user, PlanInputJsonSchema with priority enum
    [1,2,3] and integer min/max) is being rejected with 500. This is
    independent of the prompt-fix edits — those live only in the markdown
    file, which the runtime does not read (see Blocker 2). The 500s
    appeared today; round 3 (yesterday) saw 21/25 valid plans with only
    4 transient timeouts on the same code path.

    The grammar issues fixed in round 2 (propertyNames, anyOf-of-const)
    are still absent from PlanInputJsonSchema; nothing in the schema
    has changed since round 3. Most likely diagnosis: NIM's
    constrained-decoding service for nemotron-super-49b-v1 is
    transiently degraded for higher-token payloads. A capacity/quota
    issue or vendor-side outage cannot be ruled out from here.

  BLOCKER 2 — PROMPT DOC/CODE MIRROR GAP (DISCOVERED THIS ROUND):
    The runtime SYSTEM_PROMPT used by callLlmPlanner is a HARDCODED
    TypeScript string constant at manifest_planner.ts:124, hand-copied
    from PLANNER_PROMPT_v1_0.md §3. The markdown explicitly says
    "verbatim — copy into code", but the runtime does not load the
    markdown at all. Concretely:
      - SYSTEM_PROMPT (lines 124-197) holds §3 verbatim only.
      - §4 (few-shot examples) is NOT in the runtime prompt.
      - §1, §2, §5 are reference/spec, also not in the runtime.

    Implication for this round: even if the smoke's NIM 500s clear,
    Round 4's markdown-only edits (Fix 1 + Fix 2) cannot influence
    model behavior until SYSTEM_PROMPT in manifest_planner.ts is
    updated to mirror the new R7 elaboration + R8 + renumbered R9/R10.
    The new few-shot example (Fix 1) cannot influence model behavior
    AT ALL until either (a) §4 is also injected into the runtime, or
    (b) the few-shot's content is folded into the runtime SYSTEM_PROMPT
    rules text.

    This blocker explains why Round 3's Saturn-career few-shot was
    cited as the cause of pattern_register over-generalization — but
    that example was never actually in the runtime prompt. The actual
    cause of the model's pattern-over-resonance bias is more likely
    R7 listing pattern_register first, and/or the model's prior. This
    needs revisiting in the next session.

    The brief's may_touch scopes manifest_planner.ts to "fix only if
    tsc errors found"; tsc is clean (9 baseline errors only, zero new),
    so this session does NOT modify manifest_planner.ts. The mirror
    update is left for native authorization in a follow-up session.

  ACCEPTANCE STATE (Round 4):
    AC.U.1 (tsc clean):        PASS  (9 baseline errors unchanged, zero new from prompt edit)
    AC.U.2 (regression gate):  not re-run — fixture did not change
    AC.U.3 (EVAL-B live):      INCONCLUSIVE — 25/25 returned 500 on NIM tool-call path
    AC.U.4 (flag flip):        SKIPPED — held pending AC.U.3
    AC.U.5 (commit):           this commit (test(...) round-4 final per brief §10)

  FINAL DETERMINATION:
    Per brief hard constraint "do not iterate more than 2 rounds —
    if still failing after 1 prompt fix, leave flag at false and
    record findings." Round 4 was the second (final) prompt attempt;
    smoke did not pass. Flag remains false. Two follow-ups needed
    in the next authorized session:
      (a) Mirror the Round-4 markdown edits into SYSTEM_PROMPT inside
          manifest_planner.ts (or refactor to load from markdown so
          this gap closes structurally).
      (b) Re-run the smoke when NIM tool-call backend recovers; if
          it still 500s on the full payload while small probes pass,
          escalate to vendor.
    These are infrastructure / mirror fixes, not the kind of "model
    calibration round" the brief was capping. A model swap is NOT
    yet warranted — the prompt change has never actually been
    evaluated against the model.

```

## Smoke results (Round 3 — post golden-set R7 reconciliation)

```
planner_model: nvidia/llama-3.3-nemotron-super-49b-v1
smoke_date: 2026-05-02 (Round 3 — post golden-set R7 alignment)
avg_tool_recall: 0.500
avg_tool_precision: 0.667
total: 25
passed: 4
failed: 21
forbidden_violations: 0
required_misses: 13
pass_rate: 0.160
flag_flipped: false
exit_code: 1
notes: |
  Round 3 ran AFTER reconciling golden_test_set.json with PLANNER_PROMPT_v1_0.md
  R7. Six remedial entries (GT.001-GT.006) had been authored before R7 existed
  and were missing pattern_register/resonance_register from expected_tools;
  four predictive entries (GT.013-GT.016) had pattern_register in expected
  but not in required. Per the user-provided heuristic, the alignment-leaning
  remedials (GT.001/002/003/004/006 — gemstone, mantra, yellow-sapphire, Mars
  remedies, fasting-for-health) were labeled with resonance_register; the
  pattern-recognition remedial (GT.005 — weakest planet) and the four
  predictives kept pattern_register. regression_baseline.json was regenerated
  with the R7-mandated tool at priority 1 in each affected mock.

  Vitest regression gate: PASS (2/2 tests, recall=1.00 precision=1.00 against
  the new fixture). tsc --noEmit: 9 baseline errors only, no new errors.
  Live NIM: 21/25 entries returned a valid plan; 4 transient timeouts
  (GT.015, GT.017, GT.024). No forbidden_violations.

  RESIDUAL GAP — MODEL OVER-GENERALIZES PATTERN_REGISTER:
    The user-provided heuristic ("resonance for remedial alignment, pattern
    for recurring-pattern queries") is theoretically sound but does NOT
    match the model's actual behavior. nemotron-super-49b-v1 picks
    pattern_register for ALL remedial queries (GT.001/002/003/004/006 — all
    five labeled with resonance_register received pattern_register from the
    model instead). The model's behavior follows the few-shot example 4.1
    in PLANNER_PROMPT_v1_0.md, which uses pattern_register for a remedial
    Saturn-career query — the model generalizes that single example to all
    remedials, regardless of alignment vs. pattern character.

    Predicted vs. expected for the five mismatches:
      GT.001 expected=[remedial_codex_query, msr_sql, vector_search, resonance_register]
             predicted=[remedial_codex_query, pattern_register]
             recall=0.25 precision=0.50 required_miss (resonance not picked)
      GT.002 expected=[remedial_codex_query, msr_sql, vector_search, resonance_register]
             predicted=[remedial_codex_query]
             recall=0.25 required_miss (no R7 tool picked at all)
      GT.003 expected=[remedial_codex_query, msr_sql, resonance_register]
             predicted=[remedial_codex_query, pattern_register]
             recall=0.33 precision=0.50 required_miss
      GT.004 expected=[remedial_codex_query, msr_sql, resonance_register]
             predicted=[remedial_codex_query]
             recall=0.33 required_miss
      GT.006 expected=[remedial_codex_query, msr_sql, vector_search, resonance_register]
             predicted=[remedial_codex_query, pattern_register]
             recall=0.25 precision=0.50 required_miss

    Secondary gap — PARSIMONY: model picks 1-3 tools; golden expects 3-4
    on remedials. R6 ("prefer the smallest set of tools that covers the
    query") explicitly tells the model to be parsimonious. msr_sql and
    vector_search are routinely dropped from the model's plan even when
    the golden set considers them retrieval-correct. This is not a label
    drift; it is a divergence between R6's parsimony pressure and the
    multi-source retrieval the golden set encodes as "right."

    The interpretive entries (GT.007/008/010/011/012) and the planetary
    entries (GT.021) also under-recall in the same way: the model picks
    [msr_sql, pattern_register] (sometimes adding resonance_register),
    while expected_tools include vector_search / cgm_graph_walk that the
    model omits.

  ACCEPTANCE STATE (Round 3):
    AC.U.1 (tsc clean):        PASS  (9 baseline errors unchanged, zero new)
    AC.U.2 (regression gate):  PASS  (2/2 tests, recall=1.00 precision=1.00)
    AC.U.3 (EVAL-B live):      FAIL  (recall=0.500, precision=0.667; thresholds 0.80/0.90)
    AC.U.4 (flag flip):        SKIPPED — held pending AC.U.3
    AC.U.5 (commit):           this commit (test(...) round-3 variant per brief §10)

  RECOMMENDATION FOR ROUND 4:
    The remaining gap is genuine prompt/model calibration, not label drift.
    Two paths forward, both require native authorization (touching the
    prompt is gated by must_not_touch on the prompt unless AC.U.3 fails for
    a prompt reason — which it does):
      (a) Add a second remedial few-shot to PLANNER_PROMPT_v1_0.md showing
          resonance_register for an alignment-character remedial (e.g., a
          gemstone query). Two-example calibration usually breaks
          single-example over-generalization.
      (b) Soften R6 for remedial/predictive queries — e.g., "for
          remedial queries, msr_sql is required to identify the implicated
          graha before any prescription can be calibrated." This pushes
          the model toward 3-tool remedials and lifts recall directly.
    Both should be tried before considering a model swap.

  HISTORICAL — Round 2 (bcca8f8, pre golden-set R7 alignment):
    avg_tool_recall=0.620, avg_tool_precision=0.707, passed=4/25.
    Round 2 → Round 3 recall delta: -0.120. The drop is explained by adding
    resonance_register to expected_tools while the model picks pattern_register;
    each affected entry now intersects 1 fewer tool with predicted, while
    expected size grew by 1, compounding both numerator-down and denominator-up.
    Pattern-labeled entries (GT.005, GT.013-GT.016) saw recall improve as
    expected; resonance-labeled entries (GT.001/002/003/004/006) regressed.

  HISTORICAL — Round 2 ORIGINAL ENTRY (preserved below for audit):
```

```
planner_model_round2: nvidia/llama-3.3-nemotron-super-49b-v1
smoke_date_round2: 2026-05-02 (Round 2 — post EVAL-5 + nvidia.ts.chat() fix)
avg_tool_recall_round2: 0.620
avg_tool_precision_round2: 0.707
total: 25
passed: 4
failed: 21
forbidden_violations: 0
required_misses: 9
pass_rate: 0.160
flag_flipped: false
exit_code: 1
notes: |
  Smoke RAN LIVE this session against NIM. Pipeline now produces real plans
  end-to-end — 24 of 25 entries successfully completed an LLM planner call
  (only GT.012 timed out, transient). Predicted-tools sets are non-empty,
  query_class is set correctly per entry, no forbidden violations across
  the 25 entries. Median planner latency ~6–8 s, single outlier 19 s.
  But thresholds (recall ≥ 0.80, precision ≥ 0.90) are not met; the model
  produces well-formed plans that diverge from the golden labels.

  PIPELINE FIX LANDED THIS SESSION (manifest_planner.ts only):
    Round-1 prescription was `mode: 'tool'` on generateObject, but AI SDK v6
    removed that parameter — generateObject hard-codes responseFormat type
    'json' which @ai-sdk/openai@3 translates to response_format=json_schema,
    which NIM rejects with 500 "Already borrowed". Refactored callLlmPlanner
    to use `generateText` with a single submit_plan tool + toolChoice:
    'required' (the v6-equivalent of the old mode:'tool'), reading the plan
    from result.toolCalls[0].input. Public signature of callLlmPlanner
    unchanged; PlannerError wrapping, writeLlmCallLog, emitTrace, and the
    latency_ms measurement preserved. PlanSchemaZod still validates the
    parsed input post-call (parity with prior generateObject behavior).

    Two NIM-grammar issues surfaced during the refactor and were resolved
    in-file: NIM's constrained-decoding grammar rejects (a) JSON Schema's
    `propertyNames` keyword (emitted by Zod for `z.record(z.string(),
    z.unknown())`) and (b) the `anyOf:[{const:1},{const:2},{const:3}]` form
    (emitted for `z.union([z.literal(1),z.literal(2),z.literal(3)])`). Fix:
    feed a hand-crafted JSONSchema7 to `tool({ inputSchema: jsonSchema(...) })`
    that uses bare `type:'object'` for params and `enum:[1,2,3]` for priority.
    PlanSchemaZod retained as the post-call validator.

  RESIDUAL GAP — MODEL/PROMPT/GOLDEN-SET CALIBRATION (not infrastructure):
    Recall 0.62 / precision 0.71 / 4-of-25 pass means the planner returns
    non-empty, valid plans but the tool selection diverges from the golden
    labels. Sample patterns observed:
      • Over-selection of `pattern_register` for remedial queries (GT.001–
        007 most predicted [remedial_codex_query, pattern_register] when the
        gold expected only [remedial_codex_query] or msr_sql + codex). PR.7
        of the system prompt mandates pattern_register OR resonance_register
        at priority ≤ 2 for predictive/remedial; the model is honoring the
        rule but the golden set was labeled before that rule was written.
      • Under-selection on holistic / multi-domain queries (GT.024, GT.025).
      • A handful of required_miss outcomes where the model picks a
        legitimate substitute (e.g., resonance_register where the gold
        required pattern_register or vice versa).
    None of these point to NIM infrastructure failure; the call layer is
    healthy. They point to either (a) prompt under-specification, (b) golden
    set labels that need a refresh post-MANIFEST-compression, or (c) the
    planner needing a richer few-shot block.

  ACCEPTANCE STATE (this round):
    AC.U.1 (tsc clean):        PASS  (zero new errors; 9 baseline test errors unchanged)
    AC.U.2 (regression gate):  PASS  (1 file, 2 tests passed via mocked replay)
    AC.U.3 (EVAL-B live):      FAIL  (recall=0.620, precision=0.707; thresholds 0.80/0.90)
    AC.U.4 (flag flip):        SKIPPED — held pending AC.U.3
    AC.U.5 (commit):           this commit (test(...) variant per brief)

  PROMPT RETRY: not performed in this session. The failure profile is
  diffuse across query classes and looks like calibration drift between
  the prompt's R7 mandate and the golden set's pre-R7 labels, not a single
  fixable prompt bug. A separate session should reconcile the golden set
  with the current prompt + manifest before another live smoke run.
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

# Scope amendment — UI restoration (added 2026-05-02 per native direction in-session):
# Restore three Consume-module behaviors silently reverted in commits a37ede8
# (parking bundle) and eb427e3 ("four post-redesign tweaks"). Native authorized
# the scope expansion on chat 2026-05-02 after diagnosis. Concurrent with W2-UQE-ACTIVATE.
platform/src/components/consume/ConsumeChat.tsx     (sidebar default + Trace button relocation)
platform/src/components/chat/ChatShell.tsx           (no change expected — header already supports headerActions)
platform/src/components/chat/Composer.tsx            (textarea fixed-size — drop TextareaAutosize)
```

## must_not_touch

```
platform/src/app/api/chat/consume/route.ts           (already wired; no changes needed)
platform/src/lib/synthesis/**
platform/src/lib/retrieve/**
platform/src/lib/router/**
platform/src/lib/models/**
platform/src/components/**                            (EXCEPT the three files in may_touch above)
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
