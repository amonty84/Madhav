---
artifact: M2_CLOSE_v1_0.md
canonical_id: M2_CLOSE_v1_0
version: 1.0
status: CURRENT
authored_by: KARN-W8-R2-M2-CLOSE
authored_at: 2026-05-01
macro_phase: M2 — Corpus Activation
phase_opened: approx 2026-04-19 (M1 close / KARN wave protocol start)
phase_closed: 2026-05-01
predecessor_governance_doc: 00_ARCHITECTURE/GOVERNANCE_BASELINE_v1_0.md (M1 close + governance rebuild)
successor_phase: M3 — Discovery Layer (Pattern + Contradiction Engines)
successor_handoff_doc: 00_ARCHITECTURE/HANDOFF_M2_TO_M3_v1_0.md
red_team_artifact: 00_ARCHITECTURE/EVAL/REDTEAM_M2_v1_0.md
changelog:
  - v1.0 (2026-05-01) — Initial sealing artifact for Macro Phase 2. Authored at KARN-W8-R2 close immediately following the IS.8 mandatory red-team (W8-R1, verdict PASS).
---

# M2 CLOSE — Macro Phase 2: Corpus Activation

## Executive summary

M2 (Corpus Activation) is closed.

The activation corpus is live. The retrieval pipeline is operational and is the default
behavior of the Consume tab (`NEW_QUERY_PIPELINE_ENABLED=true` since 2026-04-28). All three
provenance audits clear their M2-close target gates. The eval harness is scaffolded with
24 fixtures + runner + A/B runner. The IS.8 macro-phase-close red-team returned PASS on all
nine axes with zero fixes applied. The Gemini-side mirror has been brought to adapted parity
with the Claude-side W6/W7 Cowork-stream additions in the same session as this close artifact
(per ND.1 Mirror Discipline).

The bar to open M3 is therefore cleared.

## M2 quality bar — final status

| Criterion | Target | Final result | Status |
|---|---|---|---|
| Audit 1: MSR→FORENSIC | ≥95% | 98.99% (490/495) | PASS |
| Audit 2: UCN→MSR | ≥90% | 95.52% (128/134 UCN_SECTION nodes) | PASS |
| Audit 3: CGM→MSR | ≥95% | 95.52% (128/134 nodes) | PASS |
| Eval harness scaffold | exists | 24 fixtures + runner + A/B runner | PASS |
| Eval baseline run | exists | STUB — auth-cookie required for headless run; manual native follow-up | WARN (deferred — non-blocking; recorded as known gap below) |
| Per-tool planner | unit-smoke | 15/15 vitest | PASS |
| Composition rules | unit-smoke | 39/39 vitest | PASS |
| Red-team pass | PASS | REDTEAM_M2_v1_0.md verdict: PASS (9/9 axes; 0 findings) | PASS |
| New query pipeline | default true | NEW_QUERY_PIPELINE_ENABLED=true (Phase 11A Cutover Stage 1, 2026-04-28) | PASS |

**Overall:** 8 PASS / 1 WARN / 0 FAIL. The single WARN is the eval baseline being a stub —
explicitly named in the brief as non-blocking, with the manual run path documented in
`platform/scripts/eval/runner.py` and `BASELINE_RUN_W7.json`'s `note` field.

## Wave log summary (M2 KARN execution arc)

| Wave | Seal | One-line summary | Status |
|---|---|---|---|
| W1 — FOUNDATION | KARN-W1-FOUNDATION CLOSED | Phase alpha, observability spine, vector filter — first executable substrate for the Consume pipeline. | CLOSED |
| W2 — ETL EXPANSION | KARN-W2-ETL-EXPANSION CLOSED | MSR ETL into `l25_msr_signals`; CGM edges fully expanded across all 15 edge types; 0 orphans. | CLOSED |
| W3 — CORPUS CHUNKERS | KARN-W3-CORPUS-CHUNKERS CLOSED | UCN H3 always-emit (25→151 chunks); LEL chunker; MSR re-cluster to 34 semantic clusters (99.2% coverage). | CLOSED |
| W4 — FACTS TOOLS | KARN-W4-FACTS-TOOLS CLOSED | `chart_facts` 589→795 rows; `chart_facts_query` retrieval tool with 10 filters; A-minor/B-minor scaffolding. | CLOSED |
| W5 — NARRATIVE TOOLS | KARN-W5-NARRATIVE-TOOLS CLOSED | D2/3/4 bundle; temporal extension v1.0→v1.1 (5 new sidecar endpoints); RESONANCE 12→26, CONTRADICTION 8→27. | CLOSED |
| W6 — PLANNER INTEGRITY | KARN-W6-PLANNER-INTEGRITY CLOSED | 3 new composition rules (remedial / domainReport / timeline); per-tool Haiku planner (default OFF, smoke-PASS). | CLOSED |
| W7 — PLANNER INTEGRITY (provenance) | KARN-W7-PLANNER-INTEGRITY CLOSED | Audit repair (Audits 2/3 FAIL→PASS via DB-methodology rewrite + 90-node backfill); manifest completeness 106→109 entries; eval harness scaffolded. | CLOSED |
| W8 — M2 CLOSE | this artifact | W8-R1 IS.8 red-team PASS (9/9 axes); W8-R2 (this session) authors M2_CLOSE + HANDOFF + mirror sync. | CLOSED |

## Active feature flags at M2 close

| Flag | Default | Notes |
|---|---|---|
| `NEW_QUERY_PIPELINE_ENABLED` | **true** | Phase 11A Stage 1 cutover landed 2026-04-28; classify→compose→retrieve→synthesize→audit is now default. |
| `AUDIT_ENABLED` | **true** | Phase 11A Stage 1. |
| `PER_TOOL_PLANNER_ENABLED` | false | W6-R2 delivered; flip to true after smoke-verification in M3. |
| `PANEL_MODE_ENABLED` | true | Pre-M2 baseline. |
| `MANIFEST_QUERY_ENABLED` | true | Pre-M2 baseline. |
| `VECTOR_SEARCH_ENABLED` | true | Pre-M2 baseline. |
| `CGM_GRAPH_WALK_ENABLED` | true | Pre-M2 baseline. |
| `VALIDATOR_FAILURE_HALT` | true | Pre-M2 baseline. |
| Phase 6 LLM checkpoints (4.5 / 5.5 / 8.5) | all false | Default-off; flip individually after warn-mode observation in M3+. |
| `BUNDLE_AUGMENTER_ENABLED`, `MSR_RERANKER_ENABLED`, `SEMANTIC_GATE_ENABLED`, `LLM_CHECKPOINTS_ENABLED`, `MANIFEST_BUILDER_ENABLED` | false | Default-off. |
| `PANEL_DEGRADE_2_OF_3` | false | Default-off. |

(See `platform/src/lib/config/feature_flags.ts` for the canonical declaration.)

## Live state of the platform at M2 close

- **Query pipeline (default):** `classify → [per_tool_planner: optional] → compose → retrieve(parallel) → validate → synthesize → audit`.
- **Retrieval tools wired into the pipeline:** 17 total — 5 L2.5 structured, 7 L1 structured, 5 RAG.
- **Structured tables:** 6 L1 (`chart_facts`, `ephemeris_daily`, `eclipses`, `retrogrades`, `life_events`, `sade_sati_phases`) + 6 L2.5 (`l25_msr_signals`, `l25_ucn_sections`, `l25_cdlm_links`, `l25_cgm_nodes`, `l25_cgm_edges`, `l25_rm_resonances`) + 4 L3.5 register tables (`patterns`, `resonances`, `clusters`, `contradictions`).
- **Provenance audits:** all three CURRENT and PASS (see quality bar above).
- **Eval harness:** `platform/scripts/eval/` — 24 fixtures + `runner.py` + `ab_runner.py` + `scorer.py` + `README.md`.
- **CAPABILITY_MANIFEST:** v1.7 effective 109-entry surface (with the inherited `entry_count` +3 latent miscount carried forward as a known deferred item — see below).
- **Mirror discipline:** Adapted parity holds across MP.1–MP.8. W6/W7 Cowork-stream additions propagated to `.geminirules` + `.gemini/project_state.md` in this session.

## Known deferred items (non-blocking for M2 close)

These items are explicitly named here so they survive into M3 and steady-state hygiene without
silent loss. None of them gates M2 close per the W8-R1 verdict and the brief's gate-check rules.

1. **`entry_count` latent miscount in CAPABILITY_MANIFEST.json (+3 delta).** Manifest header reads `entry_count: 109`; actual entry count is 112. Inherited pre-W7-R2; carried in W7 close summary. Resolve in a manifest-audit pass during M3.
2. **SIG.MSR.207 absent from `MSR_v3_0.md`.** Medium severity; KARN-W6-R3 finding; investigated and confirmed open at W7-R3 close. Investigate in M3 (likely a sequence-gap or a missing extraction; not a structural defect).
3. **UCN inline citation pass (Option A) against `UCN_v4_0.md` paragraphs.** Aspirational only — Option B (DB-side `derived_from_signals` backfill) was the Audit 2/3 fix path; Option A would add inline `[SIG.MSR.<id>]` markers in the prose. Not a quality-bar criterion; defer.
4. **Eval harness baseline run.** `BASELINE_RUN_W7.json` is a stub — `runner.py` requires `SMOKE_SESSION_COOKIE` (Firebase auth) + `SMOKE_CHART_ID`. Manual native run is the documented path (see file's `note` field). M3's first session must complete this before any M3 retrieval-behavior change, so the M2 baseline is captured as the pre-M3 comparison point.
5. **TypeScript test-fixture errors in `tests/components/AppShell.test.tsx` + `tests/components/ReportGallery.test.tsx`.** 9 errors total; pre-W6 portal-redesign drift (commits `5c63d11`, `3323603`); all 9 errors confined to those two test files. No W6/W7 regressions. Hygiene fixture refresh — non-blocking.
6. **DIS.009 — `DIS.class.output_conflict` on PAT.008 (Saturn D9 Karakamsa + AL Identity Lock).** Q2 soft-gate; B.5 close was not blocked by native decision 2026-04-27. Resolution deferred to post-B.5 scope; carry into M3 for resolution alongside the M3 Pattern Engine activation.

## Red-team evidence

`00_ARCHITECTURE/EVAL/REDTEAM_M2_v1_0.md` — verdict: **PASS** (9/9 axes; 0 findings; 0 fixes
applied). W8-R2 gate: **CLEARED**. Smoke results inside that artifact: typecheck 9 pre-W6
residuals only; vitest 1047 PASS / 13 FAIL = exactly matches W5 baseline residual count;
composition_rules 39/39 PASS; per_tool_planner 15/15 PASS; audits 98.99% / 95.52% target_met.

## ND status at M2 close

- ND.1 (Mirror Discipline) — addressed since 2026-04-24 (Step 7 close). Held throughout M2.
  W6/W7 Cowork-stream propagation to the Gemini side completed in this session, recorded in
  the close-checklist `mirror_updates_propagated` block.
- No open native directives.

## M2 exit — confirmed

M2 is **CLOSED**. The Discovery Engine substrate is in place: pattern register (21 patterns),
resonance register (≥26), cluster atlas (≥11), and contradiction register (≥27) are all
populated with two-pass-validated content; their query-time retrieval surfaces and synthesis
integration are M3 scope.

**M3 — Discovery Layer (Pattern + Contradiction Engines) may now open.** First M3 session:
`KARN-W9-M3-OPEN`. Handoff memo: `00_ARCHITECTURE/HANDOFF_M2_TO_M3_v1_0.md`.

---

*End of M2_CLOSE_v1_0.md.*
