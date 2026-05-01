---
artifact: HANDOFF_M2_TO_M3_v1_0.md
canonical_id: HANDOFF_M2_TO_M3_v1_0
version: 1.0
status: CURRENT
authored_by: KARN-W8-R2-M2-CLOSE
authored_at: 2026-05-01
predecessor_close_artifact: 00_ARCHITECTURE/M2_CLOSE_v1_0.md
successor_open_session: KARN-W9-M3-OPEN
parent_plan: 00_ARCHITECTURE/MACRO_PLAN_v2_0.md §M3 (Temporal Animation)
note_on_naming: >
  MACRO_PLAN_v2_0.md §M3 names the macro-phase "Temporal Animation"; the brief and the
  successor session name describe the dominant deliverables ("Discovery Layer: Pattern +
  Contradiction Engines"). Reconciliation: M3 incorporates both — the temporal substrate
  (dasha + transit + Varshaphala + KP + shadbala over time) and the activation of the
  L3.5 Discovery Engine query-time surfaces (Pattern + Contradiction registers retrieved
  and surfaced in synthesis). The first M3 session reads §M3 of MACRO_PLAN_v2_0 + this
  memo + CURRENT_STATE_v1_0.md and decides scope ordering.
---

# Handoff: M2 → M3

## You are here

Macro-phase **M2 (Corpus Activation)** closed on **2026-05-01** at KARN-W8-R2-M2-CLOSE.
**M3** is now the active macro-phase. The first M3 session is `KARN-W9-M3-OPEN`.

## What M2 delivered (brief)

M2 turned a static M1 corpus into an LLM-navigable graph + vector + structured-table
substrate with a live retrieval pipeline as the default Consume behavior. Across eight
KARN waves: the foundation pipeline + observability (W1); MSR/CGM ETL with full edge
expansion (W2); UCN H3 always-emit chunking + LEL chunker + MSR re-cluster (W3); chart
facts to 795 rows + parametric retrieval tool (W4); D2/3/4 narrative bundle + temporal
sidecar v1.1 + RESONANCE/CONTRADICTION expansion (W5); composition rules + per-tool
Haiku planner (W6); provenance audit repair to PASS + manifest completeness + eval
harness scaffold (W7); IS.8 macro-phase-close red-team PASS + this close artifact (W8).
The Phase 11A pipeline cutover (governance aside, 2026-04-28) made the new query
pipeline default-on. All three provenance audits clear their M2-close gates.

## Live state of the platform at M3 open

- **Query pipeline:** `classify → [per_tool_planner: optional, default OFF] → compose → retrieve(parallel) → validate → synthesize → audit`
- **`NEW_QUERY_PIPELINE_ENABLED`:** **true** (default)
- **`AUDIT_ENABLED`:** **true** (default)
- **`PER_TOOL_PLANNER_ENABLED`:** **false** (default — flip true after smoke verification in M3)
- **Retrieval tools:** 17 (5 L2.5 structured + 7 L1 structured + 5 RAG)
- **Structured tables:** 6 L1 + 6 L2.5 + 4 L3.5 register tables (`patterns` 21, `resonances` 13, `clusters` 11, `contradictions` 19 rows per Phase 14G post-lockdown numbers; running counts may differ at M3 open)
- **Provenance audits:** all three PASS (see `M2_CLOSE_v1_0.md §quality bar`)
  - Audit 1 (MSR→FORENSIC): 98.99% (≥95%)
  - Audit 2 (UCN→MSR): 95.52% (≥90%)
  - Audit 3 (CGM→MSR): 95.52% (≥95%)
- **Eval harness:** `platform/scripts/eval/` — 24 fixtures + `runner.py` + `ab_runner.py` + `scorer.py`
- **CAPABILITY_MANIFEST:** v1.7 effective (with `entry_count` +3 latent miscount; carry-forward)
- **Branch:** `redesign/r0-foundation` (Portal Redesign concurrent workstream)

## What M3 needs to know

1. **Primary M3 deliverable.** Per `MACRO_PLAN_v2_0.md §M3`, the macro-phase delivers the
   temporal-animation engine: Vimshottari + Yogini + Chara + Narayana dashas, transit
   engine, Varshaphala (Tajika), KP sublord timing, and shadbala over time — with the
   exit state being a date-indexed signal lit/dormant/ripening surface that holds up on
   a held-out date sample. Concurrently — and this is the operational stream named in this
   brief — the L3.5 Discovery Engine surfaces (Pattern + Contradiction + Resonance +
   Cluster) move from "registers exist in DB" (M2) to "queried at synthesis time and
   surfaced in answers" (M3 Pattern Engine + Contradiction Engine).

2. **First M3 session (`KARN-W9-M3-OPEN`) should:**
   1. Read `MACRO_PLAN_v2_0.md §M3` for the macro-phase scope, exit-state, dependencies.
   2. Read `CURRENT_STATE_v1_0.md` for the canonical state block.
   3. Read this handoff memo.
   4. Verify the L3.5 register state in DB — `patterns`, `resonances`, `clusters`,
      `contradictions` — and confirm count parity with the M2-close numbers above.
   5. **Run the M2 eval baseline before any retrieval-behavior change** (see "Prerequisite"
      below).
   6. Author the M3 phase plan (analogue of `PHASE_B_PLAN_v1_0.md` but for M3) — the
      decision on whether to expand `MACRO_PLAN_v2_0.md §M3` into a `PHASE_C_PLAN_v1_0.md`
      or to drive M3 directly from MACRO_PLAN is a native-approval point at M3 open.

3. **Hard prerequisite in M3.** The eval baseline must be run before M3 work changes
   retrieval behavior, so the M2 baseline is captured as the pre-M3 comparison point.
   The runner is `platform/scripts/eval/runner.py`; auth path is documented in
   `BASELINE_RUN_W7.json`'s `note` field. Until baseline lands, M3 may proceed with
   non-retrieval-affecting work (e.g., temporal-engine skeleton, dasha computation,
   register-schema audits) but must not modify `platform/src/lib/retrieve/**`,
   `platform/src/lib/bundle/**`, or the synthesis prompt set in a way that changes
   retrieval-output shape.

## Open items inherited from M2

(See `M2_CLOSE_v1_0.md §Known deferred items` for the canonical list.)

1. `entry_count` latent miscount in CAPABILITY_MANIFEST (+3 delta) — manifest-audit pass.
2. SIG.MSR.207 absent from MSR_v3_0.md — medium severity; investigate.
3. UCN inline citation pass (Option A) against UCN_v4_0.md — aspirational; not gating.
4. Eval harness baseline run — manual; documented path; M3-S1 hard prerequisite.
5. TypeScript test-fixture errors (`AppShell.test.tsx` + `ReportGallery.test.tsx`) —
   pre-W6 drift; fixture refresh hygiene pass.
6. DIS.009 (`DIS.class.output_conflict` on PAT.008) — Q2 soft-gated at B.5 close; resolve
   alongside M3 Pattern Engine activation.

## Active feature flags at M2 close (canonical at `platform/src/lib/config/feature_flags.ts`)

| Flag | Default | Notes |
|---|---|---|
| `NEW_QUERY_PIPELINE_ENABLED` | true | Phase 11A default-true since 2026-04-28 |
| `AUDIT_ENABLED` | true | Phase 11A default-true since 2026-04-28 |
| `PER_TOOL_PLANNER_ENABLED` | false | W6-R2; flip true after smoke in M3 |
| `PANEL_MODE_ENABLED` | true | pre-M2 |
| `MANIFEST_QUERY_ENABLED` | true | pre-M2 |
| `VECTOR_SEARCH_ENABLED` | true | pre-M2 |
| `CGM_GRAPH_WALK_ENABLED` | true | pre-M2 |
| `VALIDATOR_FAILURE_HALT` | true | pre-M2 |
| `CHECKPOINT_4_5_ENABLED` / `_FAIL_HARD` | false / false | flip individually after warn-mode |
| `CHECKPOINT_5_5_ENABLED` / `_FAIL_HARD` | false / false | flip individually after warn-mode |
| `CHECKPOINT_8_5_ENABLED` / `_FAIL_HARD` / `_PREDICTION_EXTRACT` | false / false / false | flip individually after warn-mode |
| `BUNDLE_AUGMENTER_ENABLED` | false | default-off |
| `MSR_RERANKER_ENABLED` | false | default-off |
| `SEMANTIC_GATE_ENABLED` | false | default-off |
| `LLM_CHECKPOINTS_ENABLED` | false | default-off |
| `MANIFEST_BUILDER_ENABLED` | false | default-off |
| `PANEL_DEGRADE_2_OF_3` | false | default-off |
| `AUDIT_VIEW_VISIBLE` | false | default-off |
| `PANEL_CHECKBOX_VISIBLE` | false | default-off |
| `BUNDLE_COMPOSER_DEBUG` | false | default-off |
| `SYNTHESIS_PROMPT_DEBUG` | false | default-off |
| `DISCLOSURE_TIER_DEBUG` | false | default-off |

(All env-overridable via prefix `MARSYS_FLAG_<NAME>`. The cutover-revert path for
`NEW_QUERY_PIPELINE_ENABLED` is `MARSYS_FLAG_NEW_QUERY_PIPELINE_ENABLED=false`.)

## Concurrent workstreams that survive M2 close

- **Life Event Log (LEL).** Cadence "start immediately; do not defer" per MACRO_PLAN. M4
  prerequisite (≥40 events spanning ≥5 years). Current state at M2 close: 36 events + 5
  period summaries + 6 chronic patterns; Swiss-Ephemeris-populated `chart_states`;
  confidence 0.89. Continue adding events as they happen.
- **Prospective Prediction Logging.** Substrate at `06_LEARNING_LAYER/PREDICTION_LEDGER/`
  (scaffolded). All time-indexed predictions emitted in M3 must log with confidence,
  horizon, and falsifier *before* outcome is observed (Learning Layer discipline #4).
- **Portal Redesign.** Concurrent workstream on this branch (`redesign/r0-foundation`).
  Claude-only per `PORTAL_REDESIGN_TRACKER_v1_0.md`. R0 closed 2026-04-29; R1–R6
  parallel-ready. Does not block M3.

---

*End of HANDOFF_M2_TO_M3_v1_0.md.*
