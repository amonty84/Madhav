---
artifact: HANDOFF_M3_TO_M4_v1_0.md
canonical_id: HANDOFF_M3_TO_M4_v1_0
version: 1.0
status: CURRENT
authored_by: M3-W4-D2-M3-CLOSE
authored_at: 2026-05-01
predecessor_close_artifact: 00_ARCHITECTURE/M3_CLOSE_v1_0.md
predecessor_handoff_artifact: 00_ARCHITECTURE/HANDOFF_M2_TO_M3_v1_0.md
successor_open_session: M4-W1-OPEN-PHASE-PLAN (or first substantive M4 session per native decision)
parent_plan: 00_ARCHITECTURE/MACRO_PLAN_v2_0.md §M4 (Calibration + LEL Ground-Truth Spine)
note_on_naming: >
  MACRO_PLAN_v2_0.md §M4 names the macro-phase "Calibration." The dominant
  deliverables are the LEL ground-truth spine (≥40 events spanning ≥5 years)
  + per-signal calibration weights against LEL outcomes + the LL.1–LL.4
  Learning Layer mechanisms moving from STUB-banner to active. The first M4
  session reads §M4 of MACRO_PLAN_v2_0 + this memo + CURRENT_STATE_v1_0.md
  and decides scope ordering. Per PHASE_M3_PLAN §5 native-approval-points
  table, the decision on whether to expand MACRO_PLAN §M4 into a
  PHASE_M4_PLAN_v1_0.md or drive M4 directly from MACRO_PLAN is a
  native-approval point at M4 open.
---

# Handoff: M3 → M4

## You are here

Macro-phase **M3 (Temporal Animation / Discovery Layer — Pattern + Contradiction Engines)** closed on **2026-05-01** at M3-W4-D2-M3-CLOSE. **M4 — Calibration + LEL Ground-Truth Spine** is now the active macro-phase.

Sealing artifact: `00_ARCHITECTURE/M3_CLOSE_v1_0.md`.
M3 phase plan (now SUPERSEDED-AS-COMPLETE): `00_ARCHITECTURE/PHASE_M3_PLAN_v1_0.md` v1.0.
M3 IS.8(b) macro-phase-close red-team: `00_ARCHITECTURE/EVAL/REDTEAM_M3_v1_0.md` (PASS, 9/9 axes).

## What M3 delivered (capability inventory)

### Discovery Engine (M3-A — closed at M3-W1-A4)

- **Pattern + Contradiction + Resonance + Cluster registers queryable at synthesis time.** Four feature flags (`DISCOVERY_PATTERN_ENABLED`, `DISCOVERY_CONTRADICTION_ENABLED`, `DISCOVERY_RESONANCE_ENABLED`, `DISCOVERY_CLUSTER_ENABLED`) all default-true post-A2 smoke. Env-overlay (`MARSYS_FLAG_*`) preserved.
- **Synthesis prompt amendment.** `CONTRADICTION_FRAMING` constant in `platform/src/lib/prompts/templates/shared.ts` injected into `buildOpeningBlock()`; covers all 7 active synthesis classes (factual / interpretive / predictive / cross_domain / discovery / holistic / remedial). B.1 + B.3 enforcement verbatim ("surface contradictions, do not synthesize them away"; cite `CON.<id>` for every surfaced contradiction).
- **CAPABILITY_MANIFEST:** `entry_count` corrected 109 → 112 (M3-A2). `tool_binding` field added to four register JSON entries (PATTERN_REGISTER_JSON, CONTRADICTION_REGISTER_JSON, RESONANCE_REGISTER_JSON, CLUSTER_ATLAS_JSON).
- **DIS.009 disposed (R3 RE-GROUND).** PAT.008 mechanism rewritten to surface the two-step Saturn-Mercury identity-axis architecture (Saturn → disposits → Mercury → rules → D9 Karakamsa Gemini, across the Capricorn-Gemini spine). `[EXTERNAL_COMPUTATION_REQUIRED]` block added per CLAUDE.md §I B.10 with native-specified JH D9 export spec. PAT.008 status `needs_verification`; full closure pending JH per ED.1 (M4-class verification window — KR.M3A.JH-EXPORT).

### Temporal substrate (M3-B + M3-C — closed at M3-W2-B2 + M3-W3-C3)

- **Vimshottari dasha (M3-B).** `compute_vimshottari.py` runs pyswisseph 2.10.03 + Moshier ephemeris + Lahiri sidereal. Output: `05_TEMPORAL_ENGINES/dasha/vimshottari/VIMSHOTTARI_RAW_v1_0.json` 637 rows (7 MD + 63 AD + 567 PD; span 1984-02-05 → 2070-08-18). CROSSCHECK WITHIN_TOLERANCE max 3-day vs FORENSIC §5.1 (delta inside the GAP.09 ayanamsha-precision band).
- **Yogini dasha (M3-B).** `compute_yogini.py`. 162 rows (18 MD + 144 AD); first MD `Bhramari/Mars` at native birth, matching FORENSIC §5.2 via classical +3 offset; CROSSCHECK WITHIN_TOLERANCE max +2 day delta. 8-lord cycle clean (validated at TEST-V.2).
- **Transit engine v1 (M3-B).** `compute_transits.py` → 9-graha sidereal positions + Sade Sati state + eclipse proximity per query date. Sample at 2026-05-01 in `05_TEMPORAL_ENGINES/transit/sample_2026_05_01.json`. Deterministic across reads (TEST-V.3 verified).
- **Signal activator v1 (M3-B).** `signal_activator.py` v1: rule-based lit/ripening/dormant classification. Output for 2026-05-01: 252 lit / 0 ripening / 243 dormant across 495 MSR signals. Path: `05_TEMPORAL_ENGINES/transit/lit_states_sample_M3B_v1_0.json`. Signal-level salience calibration is **M4 scope** (LL.1).
- **Chara dasha (M3-C, needs_verification).** `compute_chara.py` (engine variants); CROSSCHECK FAIL on K.N. Rao Padakrama tradition-fork → DIS.010 + DIS.011 logged as DIS.class.school_disagreement; native verdict N3 (defer to M9 multi-school triangulation).
- **Narayana dasha (M3-C, needs_verification).** `compute_narayana.py`; no FORENSIC baseline → DIS.012 logged + N3 verdict (defer to M9). External acharya review or JH export per ED.1 carried as M4-class open item.
- **KP sublord per-natal-planet snapshot (M3-C).** `compute_kp.py` + 9-row per-planet snapshot. WITHIN_TOLERANCE_GAP_09_BOUND. Note: 0°-360° boundary table is a possible M4 follow-up — see KR.M3.RT.LOW.1 in §Inherited open items below.
- **Varshaphala (Tajika) annual chart series (M3-C).** `compute_varshaphala.py`; 78 annual charts 1984-2061; Sun-lon residual <0.5 arcsec; CROSSCHECK WITHIN_TOLERANCE_PENDING_REVIEW.
- **Shadbala over time (M3-C, 4 of 6 components deterministic).** `compute_shadbala.py` v1: Uccha + Dig + Naisargika + Nathonnatha computed via pyswisseph; Sthana + Drik tagged `[EXTERNAL_COMPUTATION_REQUIRED]` per CLAUDE.md §I B.10. 63 rows × 9 snapshots × 7 planets. AC.M3C.4 anchors PASS — Saturn Uccha 59.18 ±0.02 + Sun 33.99 ±0.02; all 7 planets within ±0.02 virupas on Uccha + Dig vs FORENSIC §6.1.

### Validator + Held-Out Sample (M3-D — closed at M3-W4-D1 + this session)

- **Temporal validator (`00_ARCHITECTURE/EVAL/TEMPORAL/run_validator.py`).** Six deterministic invariants TEST-V.1..6; exits 0 on full PASS. Run record at M3-W4-D1: 6/6 PASS, exit 0.
- **Validator meta-tests doc (`00_ARCHITECTURE/EVAL/TEMPORAL/VALIDATOR_META_TESTS_v1_0.md`).** Includes a transparent KP TEST-V.4 adaptation note (per-planet snapshot vs brief literal 0°-360° boundary table; honors B.10 + B.3).
- **Held-out date sample (`00_ARCHITECTURE/EVAL/M3_HELD_OUT_SAMPLE_v1_0.md`).** 10 stratified dates × 5 fields (a)-(e); in-session native verdict CONSISTENT 10/10. External acharya review (R.M3D.1) is an M4-class open item.
- **PPL substrate active.** `01_FACTS_LAYER/LIFE_EVENT_LOG_v1_2.md §9 PROSPECTIVE PREDICTION SUBSECTION` (newly added at M3-W4-D1, append-only) carries `PRED.M3D.HOLDOUT.001` (window 2026-08-15) + `PRED.M3D.HOLDOUT.002` (window 2027-08-19+). Both with confidence + horizon + falsifier; outcome=null until observed.

### Disagreement register hygiene (M3-A + M3-C + M3-PRE-D)

- **DIS.001..008** (acceptance_rate_anomaly + earlier; closed pre-M3).
- **DIS.009** (output_conflict on PAT.008 Karakamsa+AL): RESOLVED via R3 RE-GROUND at M3-W1-A4. Full closure pending JH D9 export per ED.1.
- **DIS.010** (Chara MD sequence-start AK vs Lagna): RESOLVED-N3 at M3-PRE-D (defer M9).
- **DIS.011** (Chara sign-duration rule): RESOLVED-N3 at M3-PRE-D (defer M9).
- **DIS.012** (Narayana — no FORENSIC baseline): RESOLVED-N3 at M3-PRE-D (defer M9).

## Live state of the platform at M3 close

- **Query pipeline (default):** `classify → [per_tool_planner: optional, default OFF] → compose → retrieve(parallel) → validate → synthesize → audit`.
- **`NEW_QUERY_PIPELINE_ENABLED`:** **true** (Phase 11A Stage 1 cutover, 2026-04-28).
- **`AUDIT_ENABLED`:** **true** (Phase 11A Stage 1).
- **`PER_TOOL_PLANNER_ENABLED`:** false (default; flip after M2-W6 smoke verification — still default-off through M3).
- **BHISMA Wave 1 closed (KARN-W9).** `LLM_FIRST_PLANNER_ENABLED=false` (default; ready to flip behind smoke verification). `planner.ts` + `citation_check.ts` + `synthesis_done` + `context_assembly` trace steps live. `assertWorkerHealthy()` not yet wired into request path (BHISMA-W1 known residual B1_HEALTH_NOT_WIRED, LOW). 9 pre-existing TS test-fixture errors carry-forward (Portal Redesign R-stream owns).
- **Discovery Engine surfaces:** `DISCOVERY_PATTERN_ENABLED` + `DISCOVERY_CONTRADICTION_ENABLED` + `DISCOVERY_RESONANCE_ENABLED` + `DISCOVERY_CLUSTER_ENABLED` all **default-true** post-M3-A2 smoke verification + REDTEAM_M3A PASS.
- **Retrieval tools:** **22 total** (was 17 at M2 close): 5 L2.5 structured + 7 L1 structured + 5 RAG + 4 L3.5 register query tools + `query_signal_state.ts` (M3-B) + `query_kp_ruling_planets.ts` (M3-C) + `query_varshaphala.ts` (M3-C).
- **Structured tables in DB:** 6 L1 + 6 L2.5 + 4 L3.5 register tables + **5 M3 temporal tables** (`dasha_periods` 022, `signal_states` 023, `kp_sublords` 024, `varshaphala` 025, `shadbala` 031). Migrations 022-031 native-applied pre-M3-D-D1 per `MIGRATION_APPLY_INSTRUCTIONS_v1_0.md` (status: ACTION_REQUIRED → APPLIED).
- **CAPABILITY_MANIFEST:** v1.7-effective at `entry_count: 112` (corrected at M3-W1-A2 from latent 109).
- **Synthesis prompt:** `CONTRADICTION_FRAMING` rubric in `shared.ts:26` (M3-W1-A3); B.1 + B.3 enforcement verbatim.
- **Temporal substrate:** validator 6/6 PASS at M3-W4-D1; held-out sample CONSISTENT 10/10.
- **Eval harness:** scaffolded (24 fixtures + runner + A/B); baseline STUB (auth-wall blocks headless run; manual native-acceptance path documented per BASELINE_RUN_W9_MANUAL §6).
- **Mirror discipline:** adapted parity holds across MP.1–MP.8. M3 sub-phase closes propagated MP.2 same-session at every substantive close. MP.1 updated at this M3 close session.

## What M4 needs to know

Per `MACRO_PLAN_v2_0.md §M4`, M4 establishes the **calibration substrate**:

1. **LEL ground-truth spine.** ≥40 events spanning ≥5 years (entry-state per `MACRO_PLAN §CW.LEL`). The LEL is the ground truth against which calibration weights are derived; its volume + decade-span is structural, not cosmetic.
2. **Per-signal calibration weights.** For each signal in MSR (~499), derive a `signal_weight` calibrated against LEL outcomes — this is the LL.1 mechanism (`06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/`) moving from STUB-banner to active.
3. **Calibration tables.** First M4 sub-phase produces a calibration table that says "given signal X is lit at LEL event Y, what's the empirical likelihood of outcome Z" — the LL.4 calibration mechanism.
4. **LL.1–LL.4 mechanisms move from STUB to active.** Per `LEARNING_LAYER_SCAFFOLD_DECISION_v1_0.md §5.2`, M4 is the population-gate moment: LL.1 (Signal Weight Calibration), LL.2 (Graph Edge Weight Learning), LL.3 (Embedding Space Adaptation), LL.4 (Prompt Optimization) — each becomes operational with first calibration data.
5. **Held-out cohort discipline.** Per Learning Layer #4: "held-out prospective data is sacrosanct; the model never sees outcome before prediction." Predictions emitted before observation log to `06_LEARNING_LAYER/PREDICTION_LEDGER/prediction_ledger.jsonl` (canonical) + LEL §9 (interim, will migrate when M4 absorbs).
6. **JH-export integrations.** M4 is the natural unblocking moment for the deferred ECRs (DIS.009 D9 verification; Sthana + Drik Shadbala; Narayana acharya review) if JH access is operationalised. M4 phase plan should decide whether to invest in JH integration now or carry these as `needs_verification` until later.

**First M4 session decisions (native-approval points):**
1. Whether to author a `PHASE_M4_PLAN_v1_0.md` (analogue of PHASE_M3_PLAN) or drive M4 directly from `MACRO_PLAN_v2_0.md §M4`. Default: decision deferred to first M4 session per `PHASE_M3_PLAN §5`.
2. LEL minimum-volume gate-clearance plan (see Hard prerequisites below).
3. JH integration scope (whether to operationalise JH access in M4 or carry the ECR-tagged items forward).

## Hard prerequisites for M4

### LEL minimum-volume gate

Per `MACRO_PLAN §CW.LEL §M4 entry state`: **≥40 events spanning ≥5 years.**

**Current LEL state at M3 close (verified at this session):**

- **Event count:** **35 distinct EVT.* event IDs** in `01_FACTS_LAYER/LIFE_EVENT_LOG_v1_2.md`. **Gap to gate: 5 events.**
- **Span:** 1984 (birth) → 2025 (latest entry). **41 years.** Far exceeds the 5-year minimum.
- **Confidence:** 0.89 (per LEL §1 META + §8 changelog v1.2).
- **Recency cadence:** continuous additions through M2 + M3 per CLAUDE.md §E "Start immediately; do not defer" rule.

**Gate-clearance plan.** Native owns LEL authorship; first M4 session must trigger native-elicitation for the additional 5+ events. Likely candidates (from existing LEL §6 GAP register):
- GAP.R2_MONTH.01 — relationship #2 month-precision elicitation.
- GAP.FATHER_KIDNEY_MONTH.01 — kidney-disease onset month.
- GAP.US_JOB_LOSS_PRECISE.01 — US job-loss precise date.
- Plus 2+ recent 2025-2026 events not yet logged.

**M4-A may not begin calibration substrate work until the LEL gate is cleared.** Pre-gate work (calibration scaffold authoring; LL.1 STUB-banner-removal preparation; M4 phase plan authoring) is not gate-blocked.

### JH integration (optional)

If JH access is operationalised in M4, three deferred ECRs unblock:
- DIS.009 PAT.008 D9 verification (Moon D9 = Gemini + Mercury D1 = Capricorn).
- Sthana + Drik Shadbala (Saptavargaja Bala + aspect-strength table per ED.1).
- Narayana Dasha verification (DIS.012 R2 path).

If JH is **not** operationalised in M4, these remain `needs_verification` and carry to M5+.

### Eval harness baseline

Per AC.M3A.5 deferral: pre + post baseline numerical capture remains blocked on auth-wall (BHISMA GAP.P.9 + KR.W9.1 + KR.W9.2). M4 inherits this gap; if auth secrets become available in M4, the baseline run becomes a one-shot operation.

## Inherited open items (carries forward into M4)

Each item names: **owner** (native | next-session | M9-class) + **ETA** (where known).

### Owner: native

- **LEL minimum-volume gate (≥40 events spanning ≥5 years).** Owner: native. ETA: before first M4-A substantive session. **HARD GATE.**
- **DIS.009 PAT.008 D9 verification (KR.M3A.JH-EXPORT).** Owner: native (run JH D9 export). ETA: open; M4-class verification window.
- **Naisargika + Nathonnatha Shadbala convention findings.** Owner: native (M3-C close decision N1/N2/N3/N4 per finding). ETA: M4-class native review.
- **External acharya review of M3 deliverables (R.M3D.1).** Owner: native (recruit acharya) or recruited acharya. ETA: open; M4-class.

### Owner: next-session (M4)

- **Author M4 phase plan or drive directly from MACRO_PLAN §M4.** Owner: first M4 session. ETA: first M4 session opening.
- **LL.1–LL.4 mechanisms STUB-banner removal + first calibration data.** Owner: M4-A or M4-B substantive sessions. ETA: M4-A close.
- **AC.M3A.5 post-baseline run.** Owner: first M4 session with auth secrets available. ETA: when KR.W9.1/W9.2 unblock (BHISMA GAP.P.9 cleanup).
- **KR.M3A2.1 PAT.008 ECR clarification.** Owner: M4 documentation pass. ETA: M4-A or M4-D close.
- **KR.M3.RT.LOW.1 KP per-planet vs 0°-360° boundary table.** Owner: first M4-C-class session needing KP boundary precision. ETA: open; possible M4 follow-up.
- **SIG.MSR.207 absent from MSR.** Owner: M4 substrate-cleaning pass. ETA: M4-A or M4-D close.
- **UCN inline citation pass (Option A).** Owner: aspirational; not gating. ETA: open.

### Owner: M9-class (multi-school triangulation)

- **DIS.010 Chara MD sequence-start (AK vs Lagna).** N3 — defer to M9. ETA: M9 macro-phase open.
- **DIS.011 Chara sign-duration rule (BPHS vs Padakrama vs brief constants).** N3 — defer to M9. ETA: M9 macro-phase open.
- **DIS.012 Narayana Dasha — no FORENSIC baseline.** N3 — defer to M9 (alternative: M4 acharya review or JH export). ETA: M9 macro-phase open.

### Owner: Portal Redesign R-stream (concurrent workstream)

- **TypeScript test-fixture errors** in `tests/components/AppShell.test.tsx` + `tests/components/ReportGallery.test.tsx`. 9 errors total; pre-W6 portal-redesign drift; not gating.

## Active feature flags at M3 close (canonical at `platform/src/lib/config/feature_flags.ts`)

| Flag | Default | Notes |
|---|---|---|
| `NEW_QUERY_PIPELINE_ENABLED` | true | Phase 11A Stage 1 default-true since 2026-04-28 |
| `AUDIT_ENABLED` | true | Phase 11A Stage 1 default-true since 2026-04-28 |
| `DISCOVERY_PATTERN_ENABLED` | **true** | M3-A2 flip post-smoke; REDTEAM_M3A PASS |
| `DISCOVERY_CONTRADICTION_ENABLED` | **true** | M3-A2 flip post-smoke; REDTEAM_M3A PASS |
| `DISCOVERY_RESONANCE_ENABLED` | **true** | M3-A2 flip post-smoke |
| `DISCOVERY_CLUSTER_ENABLED` | **true** | M3-A2 flip post-smoke |
| `LLM_FIRST_PLANNER_ENABLED` | false | BHISMA-W1-S2; ready to flip after M4 smoke verification |
| `PER_TOOL_PLANNER_ENABLED` | false | M2-W6; still default-off; flip after M4 smoke verification |
| `PANEL_MODE_ENABLED` / `MANIFEST_QUERY_ENABLED` / `VECTOR_SEARCH_ENABLED` / `CGM_GRAPH_WALK_ENABLED` / `VALIDATOR_FAILURE_HALT` | true | Pre-M2 baselines |
| Phase 6 LLM checkpoints (4.5 / 5.5 / 8.5) | all false | Default-off; flip individually after warn-mode in M4+ |
| `BUNDLE_AUGMENTER_ENABLED`, `MSR_RERANKER_ENABLED`, `SEMANTIC_GATE_ENABLED`, `LLM_CHECKPOINTS_ENABLED`, `MANIFEST_BUILDER_ENABLED` | false | Default-off |
| BHISMA-W1-S1 health/cost observability flags (4 added) | all true | BHISMA-W1 close 2026-05-01 |

(All env-overridable via prefix `MARSYS_FLAG_<NAME>`. The discovery-flag opt-out path is `MARSYS_FLAG_DISCOVERY_PATTERN_ENABLED=false` etc.)

## Active disagreements at M3 close

- **DIS.009** — `DIS.class.output_conflict` on PAT.008. **RESOLVED** via R3 (RE-GROUND) at M3-W1-A4. Full closure pending JH D9 export per ED.1 (M4-class verification window).
- **DIS.010 / DIS.011 / DIS.012** — `DIS.class.school_disagreement` on Jaimini multi-tradition forks. **RESOLVED-N3** at M3-PRE-D-GOVERNANCE (defer to M9 multi-school triangulation per `PHASE_M3_PLAN §8` default policy). compute_chara.py + compute_narayana.py outputs remain `needs_verification` until M9.
- **No new disagreements opened at M3-W4-D1 or M3-W4-D2.**

## Concurrent workstreams that survive M3 close

- **Life Event Log (LEL).** Cadence "start immediately; do not defer." Current state: 35 events + 5 period summaries + 6 chronic patterns; Swiss-Ephemeris-populated `chart_states` at all 36 events; confidence 0.89. **M4 entry-gate hard prerequisite: ≥40 events spanning ≥5 years.** §9 PROSPECTIVE PREDICTION SUBSECTION added at M3-W4-D1 (append-only).
- **Prospective Prediction Logging.** Substrate: `06_LEARNING_LAYER/PREDICTION_LEDGER/prediction_ledger.jsonl` (canonical, 10 PRED rows from M2-W5/W6) + `01_FACTS_LAYER/LIFE_EVENT_LOG_v1_2.md §9` (interim, held-out subset). All time-indexed predictions log with confidence + horizon + falsifier *before* outcome observed. M4 absorbs §9 into the canonical substrate per CLAUDE.md §E migration clause.
- **Portal Redesign.** Concurrent workstream on `redesign/r0-foundation`. R0 closed 2026-04-29; R1–R6 parallel-ready. Claude-only per `PORTAL_REDESIGN_TRACKER_v1_0.md`. Does not block M4.
- **BHISMA-W1 closed 2026-05-01.** Model family (5 OpenAI models in registry; family-aware worker routing; `PipelineError` hard-fail per ADR-3) + LLM-first pipeline (`planner.ts` behind `LLM_FIRST_PLANNER_ENABLED`; ready to flip after M4 smoke) + Trace Command Center (4 new panels). Does not block M4.

## What M4 inherits — operational checklist

- [ ] LEL ≥40 events ≥5 years span — **gate-blocking; native owns**
- [ ] M4 phase plan authoring decision (PHASE_M4_PLAN vs MACRO_PLAN-direct) — first M4 session
- [ ] LL.1 Signal Weight Calibration — STUB → active at first calibration data (M4-A scope)
- [ ] LL.2 Graph Edge Weight Learning — STUB → active when LL.1 lands (M4-B scope)
- [ ] LL.3 Embedding Space Adaptation — STUB → active TBD (M4-B/C scope)
- [ ] LL.4 Prompt Optimization — STUB → active when first calibration loop closes (M4-C scope)
- [ ] DIS.009 D9 verification (JH export per ED.1) — KR.M3A.JH-EXPORT
- [ ] AC.M3A.5 post-baseline run (auth-wall unblocking) — first M4 session with auth secrets
- [ ] Sthana + Drik Shadbala ECR — JH per ED.1
- [ ] Narayana Dasha verification — external acharya or JH per DIS.012 R1/R2
- [ ] External acharya review on M3 deliverables (R.M3D.1) — recruited acharya
- [ ] Three Shadbala convention findings — native review
- [ ] KR.M3A2.1 PAT.008 ECR clarification — documentation pass
- [ ] KR.M3.RT.LOW.1 KP boundary table — possible M4-C follow-up
- [ ] SIG.MSR.207 absent from MSR — substrate-cleaning pass
- [ ] UCN inline citation pass (Option A) — aspirational; not gating
- [ ] Migration to canonical PPL substrate — fold LEL §9 PRED.M3D.HOLDOUT.* into `06_LEARNING_LAYER/PREDICTION_LEDGER/prediction_ledger.jsonl`

---

*End of HANDOFF_M3_TO_M4_v1_0.md.*
