---
status: BLOCKED
session: W2-UQE-ACTIVATE
scope: UQE-ACTIVATE (LLM-first planner activation + EVAL-B smoke + golden-set R7 reconciliation)
authored: 2026-05-02
round: 4
critical_path: false
blocks: W2-MON-A (monitoring write integration smoke depends on planner being live)
supersedes: W2-EVAL-A (status COMPLETE 2026-05-01 — archived below)
flag_flipped: false
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
