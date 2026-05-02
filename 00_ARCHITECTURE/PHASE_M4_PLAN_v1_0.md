---
artifact: PHASE_M4_PLAN_v1_0.md
canonical_id: PHASE_M4_PLAN
version: 1.0
status: CURRENT
authored_by: Cowork-M4-W1-PLAN-AUTHORING-2026-05-01
authored_at: 2026-05-01
parent_macro_phase: M4 — Calibration + LEL Ground-Truth Spine
parent_plan: 00_ARCHITECTURE/MACRO_PLAN_v2_0.md §M4
predecessor_artifact: 00_ARCHITECTURE/HANDOFF_M3_TO_M4_v1_0.md
predecessor_phase_plan: 00_ARCHITECTURE/PHASE_M3_PLAN_v1_0.md (SUPERSEDED-AS-COMPLETE for M3 at M3-W4-D2-M3-CLOSE)
sub_phases: [M4-W1, M4-A, M4-B, M4-C, M4-D]
hard_prerequisite_gate: >
  LEL ≥40 events spanning ≥5 years — CLEARED 2026-05-01 (46 events, span 1984–2026).
  No hard prerequisite blocks M4-A entry. Pre-gate work (this plan, LL STUB-banner
  preparation) ran in parallel per HANDOFF_M3_TO_M4_v1_0.md §Hard prerequisites.
native_approval_points:
  - M4-A entry — calibration scoring rubric acceptance (how event-signal match is scored)
  - M4-A close — LEL chronological-completeness audit resolution + 11 pending_computation chart-state review
  - M4-B entry — shadow-mode exit rule acceptance (observations + validity margin before weight promotes)
  - M4-B close — LL.1 first calibration batch review (native spot-check of weight assignments)
  - M4-C close — LL.7 discovery prior (native-only mode) rubric acceptance
  - M4-D close — M4 macro-phase close (held-out partition pass + red-team PASS)
mirror_obligations:
  claude_side: 00_ARCHITECTURE/PHASE_M4_PLAN_v1_0.md
  gemini_side: phase-plan pointer in .gemini/project_state.md (MP.4 adapted parity, propagated at first M4-A session)
  mirror_mode: adapted_parity_pointer
  authoritative_side: claude
  asymmetries: >
    Gemini-side carries a one-line pointer to this plan plus the active sub-phase ID.
    Full sub-phase tables and ACs stay Claude-side. Gemini-side updates on each
    sub-phase transition (M4-A open, M4-B open, M4-C open, M4-D close).
changelog:
  - v1.0 (2026-05-01, Cowork-M4-W1-PLAN-AUTHORING-2026-05-01): Initial M4 phase plan.
      Sub-phases M4-W1 through M4-D defined per HANDOFF_M3_TO_M4_v1_0.md §What M4 needs
      to know + MACRO_PLAN_v2_0.md §M4. LEL gate confirmed CLEARED (46 events) at this
      session. Calibration scoring rubric decision recorded as M4-A entry native-approval
      point. Shadow-mode exit rule recorded as M4-B entry native-approval point.
---

# PHASE M4 PLAN — v1.0

## §0 — Status block

| Field | Value |
|---|---|
| Macro-phase | **M4 — Calibration + LEL Ground-Truth Spine** |
| Active sub-phase | **M4-A — LEL Spine + Swiss Ephemeris Pass + LL.1 Activation (entry now unblocked)** |
| Sub-phase status | NOT YET STARTED — this session is plan-authoring only (M4-W1) |
| Phase opened | 2026-05-01 (M3-W4-D2-M3-CLOSE flipped active_macro_phase M3→M4) |
| Phase plan authored | 2026-05-01 (this Cowork session — M4-W1 equivalent) |
| Hard prerequisite gate | LEL ≥40 events ≥5 years — **CLEARED** 2026-05-01 (46 events; span 1984–2026) |
| Concurrent (non-blocking) | Portal Redesign R-stream; BHISMA-W2+ (if any); LEL maintenance; PPL active-from-emission |

---

## §1 — Reading order for M4 sessions

Per `CLAUDE.md §C`, every M4 session reads its mandatory list at open. Sub-phase-specific
add-ons:

- **All M4 sessions:** add this file to the mandatory-reading list (item 5 slot, replacing
  PHASE_M3_PLAN). `HANDOFF_M3_TO_M4_v1_0.md` stays read-once at first M4 session, then
  referenced but not re-read (closed handoff memo).
- **M4-A sessions:** add `01_FACTS_LAYER/LIFE_EVENT_LOG_v1_2.md` (LEL v1.3, 46 events) and
  `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/README.md` (LL.1 stub spec).
- **M4-B sessions:** add `06_LEARNING_LAYER/README.md`, the LL.1 signal_weights/ shadow
  register (once created at M4-A), and `00_ARCHITECTURE/MACRO_PLAN_v2_0.md §LL-Appendix.B
  LL.2–LL.4`.
- **M4-C sessions:** add `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/` current state (LL.1
  weight register), `MACRO_PLAN_v2_0.md §LL-Appendix.B LL.5–LL.7`, and the held-out
  partition document (path declared at M4-B close).
- **M4-D sessions:** add `00_ARCHITECTURE/EVAL/REDTEAM_M3_v1_0.md` (precedent red-team
  template), the held-out calibration validity test results (path declared at M4-C close),
  and `00_ARCHITECTURE/MACRO_PLAN_v2_0.md §M5` (successor phase orientation).

---

## §2 — Sub-phase summary

| Sub-phase | One-line scope | Entry gate | Exit gate | Deliverable folder(s) |
|---|---|---|---|---|
| **M4-W1** | Phase plan authoring; LEL gate confirmation; LL STUB-banner inventory. | M3 closed (MET). | PHASE_M4_PLAN_v1_0.md committed; CURRENT_STATE updated; SESSION_LOG entry appended. | `00_ARCHITECTURE/` |
| **M4-A** | LEL ground-truth spine: Swiss Ephemeris pass for 11 pending events; LEL↔MSR event-match records; LL.1 STUB→active-pending; PPL substrate migration. | LEL ≥40 events ≥5 years (MET: 46 events). | Event-match records exist for all 46 LEL events; LL.1 shadow register created; PPL §9 migrated; held-out partition identified; LEL chronological-completeness audit done. | `06_LEARNING_LAYER/OBSERVATIONS/`, `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/`, `01_FACTS_LAYER/` |
| **M4-B** | First calibration cycle: LL.1 weights written (shadow mode); LL.2 edge modulators; LL.3 embedding adapters; LL.4 prompt optimization. Shadow-mode protocol authored. | M4-A closed; event-match records and held-out partition exist; native approves calibration scoring rubric + shadow-mode exit rule. | LL.1 shadow weights written (≥N per-signal); LL.2/LL.3/LL.4 first-cycle outputs; shadow-mode protocol document; n=1 disclaimer attached; two-pass approval evidence in SESSION_LOG. | `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/signal_weights/`, `06_LEARNING_LAYER/GRAPH_EDGE_WEIGHT_LEARNING/`, `06_LEARNING_LAYER/EMBEDDING_SPACE_ADAPTATION/`, `06_LEARNING_LAYER/PROMPT_OPTIMIZATION/` |
| **M4-C** | Retrieval + discovery learning: LL.5 ranker weights; LL.6 plan-selector weights; LL.7 discovery priors (native-only mode); LL.8 scaffold. Held-out partition calibration validity test. | M4-B closed; LL.1 weights stable (N-threshold met); native approves LL.7 discovery prior rubric. | LL.5–LL.7 first-cycle outputs; LL.8 scaffold document; held-out partition test passes declared tolerance; no M5-shape pre-build. | `06_LEARNING_LAYER/` (LL.5–LL.8 subdirectories) |
| **M4-D** | Calibration validator; IS.8(b) macro-phase-close red-team; M4_CLOSE_v1_0.md + HANDOFF_M4_TO_M5_v1_0.md; CURRENT_STATE M4→M5. | M4-C closed; native schedules M4 close review. | M4 closed; held-out test pass documented; red-team PASS; CURRENT_STATE flipped; mirrors propagated. | `00_ARCHITECTURE/EVAL/`, `00_ARCHITECTURE/M4_CLOSE_v1_0.md`, `00_ARCHITECTURE/HANDOFF_M4_TO_M5_v1_0.md` |

---

## §3 — Sub-phase details

### §3.1 — M4-A — LEL Ground-Truth Spine

**Scope.** This sub-phase builds the empirical ground truth that every downstream
calibration mechanism consumes. Three streams run in sequence within M4-A:

1. **Swiss Ephemeris computation pass.** LEL v1.3 has 11 events with
   `chart_state_at_event: status: pending_computation` (EVT.2000, EVT.2004, EVT.2007,
   EVT.2012, EVT.2021 ×2, EVT.2022, EVT.2025, EVT.2026 ×3). Each event needs its
   Vimshottari MD/AD/PD, Yogini MD/AD, and key transit positions computed via `compute_vimshottari.py`
   + `compute_yogini.py` + `compute_transits.py` (all M3-B/C deliverables). Outputs
   written to LEL v1.4 chart_state_at_event blocks + registered in `06_LEARNING_LAYER/OBSERVATIONS/`.

2. **LEL↔MSR event-match records.** For each of the 46 LEL events, identify which
   MSR signals *should have been lit* at the event date per the temporal substrate
   output. Produce a structured event-match record per event:
   `{ event_id, event_date, expected_lit_signals: [...], actual_lit_signals: [...], match_rate, notes }`.
   These are the primary input to LL.1. Stored at
   `06_LEARNING_LAYER/OBSERVATIONS/lel_event_match_records.json`.
   **Calibration scoring rubric** — how "match" is defined (exact lit? lit within N days?
   domain-bucket match?) — is a **native-approval point** before any records are written.

3. **Infrastructure.** (a) PPL substrate migration: `PRED.M3D.HOLDOUT.001` +
   `PRED.M3D.HOLDOUT.002` from `01_FACTS_LAYER/LIFE_EVENT_LOG_v1_2.md §9` migrate to
   `06_LEARNING_LAYER/PREDICTION_LEDGER/prediction_ledger.jsonl` (canonical). LEL §9
   marked `migrated`. (b) Held-out partition: 20% of 46 events (≈9 events) identified
   and tagged `partition: held_out` in event-match records. Partition is stratified by
   decade. (c) LL.1 STUB banner removed from `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/README.md`;
   mechanism status set to `active-pending` (not yet `active` — first weight write
   happens at M4-B).

4. **Chronological-completeness audit.** Per `MACRO_PLAN §M4 Risks §(b)`: native
   selectively logs memorable events; audit surfaces systematic gaps. Run a decade-by-decade
   check against LEL. Log any decade with < 2 events in LEL §7 GAP register (or
   STALENESS_REGISTER.md if more appropriate). Output: a concise audit note in
   SESSION_LOG at M4-A close; gaps recorded; native decision on each gap
   (accept/elicit/defer). **This is a native-approval point at M4-A close.**

**Entry gate.** LEL ≥40 events ≥5 years. **CLEARED** as of 2026-05-01 (46 events;
span 1984–2026). M4-A may begin immediately.

**Sessions.** Estimated **3–5 sessions** split roughly:

- M4-A-S1: Swiss Ephemeris computation pass for 11 events; LEL v1.4 authored; session
  opens with calibration scoring rubric proposal to native.
- M4-A-S2: Event-match records for first 20 LEL events; rubric locked after native approval.
- M4-A-S3: Event-match records for remaining 26 LEL events; held-out partition identified.
- M4-A-S4 (close): PPL migration; chronological-completeness audit; LL.1 STUB→active-pending;
  IS.8(a) cadence check; M4-A close-checklist.

**Acceptance criteria.**

- AC.M4A.1 — LEL v1.4 exists; all 11 previously `pending_computation` events now have
  populated `chart_state_at_event` blocks; Vimshottari MD/AD/PD + Yogini MD/AD + key
  transit positions computed via M3-B/C scripts.
- AC.M4A.2 — `06_LEARNING_LAYER/OBSERVATIONS/lel_event_match_records.json` exists;
  one record per EVT.* event (46 records); all required fields populated
  (`event_id`, `event_date`, `expected_lit_signals`, `actual_lit_signals`, `match_rate`, `partition`).
- AC.M4A.3 — Calibration scoring rubric native-approved; rubric document exists at
  `06_LEARNING_LAYER/OBSERVATIONS/CALIBRATION_RUBRIC_v1_0.md`; rubric version cited
  in every event-match record.
- AC.M4A.4 — Held-out partition identified: ≥9 events tagged `partition: held_out`;
  partition is decade-stratified; held-out events are never used to produce training
  calibration weights in M4-B.
- AC.M4A.5 — PPL migration complete: `prediction_ledger.jsonl` contains PRED.M3D.HOLDOUT.001
  + PRED.M3D.HOLDOUT.002 (migrated from LEL §9); LEL §9 entries tagged `migrated: true`;
  no prediction outcomes pre-observed per Learning Layer discipline #4.
- AC.M4A.6 — LL.1 STUB banner removed; mechanism status `active-pending` in
  `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/README.md`; no signal_weights/ directory
  created yet (first write is M4-B scope).
- AC.M4A.7 — LEL chronological-completeness audit complete; decade-by-decade gap record
  exists in SESSION_LOG or LEL §7; native decision recorded per gap (accept/elicit/defer).
- AC.M4A.8 — KR.M3A.JH-EXPORT decision recorded: either (a) JH D9 verification performed
  and DIS.009 status updated to fully_closed; or (b) native explicitly defers with rationale
  recorded in SESSION_LOG.
- AC.M4A.9 — No L1 mutations (FORENSIC frozen); LEL updates go through the versioning
  protocol (v1.3→v1.4 minor bump with changelog); no temporal computation invented per B.10.
- AC.M4A.10 — Red-team counter tracked: IS.8(a) every-third-session cadence check at
  M4-A close; cadence fires if counter=3; REDTEAM_M4A_v1_0.md produced if due.

**Risk mitigations (per MACRO_PLAN §M4 Risks).**

- *n=1 overfit.* Mitigation: Learning discipline #3 + shadow mode (M4-B gate) + n=1
  disclaimer on every calibration output (AC.M4B.7). Shadow weights promoted only after
  N ≥ 3 observations per signal (default per MACRO_PLAN §LL-Appendix.B; override logged
  at M4-A-S1 or M4-B entry).
- *LEL entry bias.* Mitigation: chronological-completeness audit (AC.M4A.7) + pre-registration
  discipline (events logged before prediction outcomes per §3.5.E). Native elicitation
  follows the audit findings.
- *Calibration-table staleness.* Mitigation: re-run event-match records at each M4
  session close if LEL gains new events.
- *Provisional-validity risk.* Mitigation: second-pass calibration at 80-event milestone
  (M5+ scope per MACRO_PLAN §M4).

---

### §3.2 — M4-B — Learning Layer Activation (LL.1 + LL.2 + LL.3 + LL.4)

**Scope.** First calibration cycle. LL.1 through LL.4 move from scaffold to fully active
using the training partition of event-match records from M4-A.

1. **LL.1 — Signal weight calibration (primary mechanism).** Using the training partition
   of event-match records (≈37 training events), compute per-signal calibration weights:
   `signal_weight = f(match_rate, domain_weight, n_observations)` per native-approved
   rubric. Write to `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/signal_weights/shadow/`
   in shadow mode. Weights are keyed by `signal_id` (MSR signal ID). Each write requires
   two-pass approval (Claude initial + Gemini review) per `MACRO_PLAN §LL-Appendix.D`.
   **Shadow-mode exit rule** (how many observations + what validity margin before a weight
   promotes from shadow to production) is a **native-approval point** at M4-B entry.

2. **LL.2 — Graph edge weight modulators.** After LL.1 weights stabilize (N-threshold met),
   compute co-activation pairs from event-match records: pairs of signals that both lit at
   the same event more often than chance. Write edge-weight modulators to
   `06_LEARNING_LAYER/GRAPH_EDGE_WEIGHT_LEARNING/edge_modulators/shadow/`.
   Dependency per MACRO_PLAN: LL.1 must be stable before LL.2 writes.

3. **LL.3 — Embedding space adaptation.** Using signal match records as relevance signals,
   produce adaptation notes for the embedding pipeline. At this stage (first calibration
   cycle), LL.3 output is a structured recommendation document (not a model fine-tune) in
   `06_LEARNING_LAYER/EMBEDDING_SPACE_ADAPTATION/adaptation_notes_M4B_v1_0.md` that
   documents which signal-clusters show systematic retrieval gaps vs match records.
   Actual embedding re-indexing (if recommended) is a native-approval point before execution.

4. **LL.4 — Prompt optimization.** Using calibration findings from LL.1, identify synthesis
   prompt clauses that consistently under-represent high-weight signals. Produce a prompt
   optimization record in `06_LEARNING_LAYER/PROMPT_OPTIMIZATION/` with specific proposed
   amendments. Each amendment follows the AC.M3A.8 pattern (B.1 + B.3 anchors preserved).
   Prompt amendments ship via a feature flag if they change retrieval-output shape.

5. **Shadow-mode protocol document.** `06_LEARNING_LAYER/SHADOW_MODE_PROTOCOL_v1_0.md`
   authored at M4-B open. Declares per-mechanism: shadow-to-production promotion criteria
   (N-threshold + validity margin); kill-switch conditions; reversal protocol; audit-trail
   requirements. This document is the reference for every weight-promotion decision through M10.

**Entry gate.** M4-A closed (event-match records exist; held-out partition identified).
PLUS native has approved: (a) calibration scoring rubric (AC.M4A.3); (b) shadow-mode
exit rule (native-approval point at M4-B entry — proposed by first M4-B session, approved
before first weight write).

**Sessions.** Estimated **3–5 sessions** split roughly:

- M4-B-S1: Shadow-mode exit rule proposed; native approval; shadow-mode protocol document
  authored; LL.1 first weight batch (training partition first third).
- M4-B-S2: LL.1 weight batch 2 (training partition second third); two-pass approval cycle.
- M4-B-S3: LL.1 weight batch 3 (training partition final third); N-threshold check; LL.2
  edge modulators (if LL.1 stable).
- M4-B-S4: LL.3 adaptation notes; LL.4 prompt optimization record; IS.8(a) cadence check;
  native spot-check of weight assignments; M4-B close-checklist.

**Acceptance criteria.**

- AC.M4B.1 — `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/signal_weights/shadow/`
  directory exists and contains ≥N per-signal weight records for training-partition signals
  (N = 3 default per mechanism; override logged at M4-B entry if native approves different N).
- AC.M4B.2 — Shadow-mode exit rule native-approved and documented in
  `SHADOW_MODE_PROTOCOL_v1_0.md`; promotion criteria are explicit (not implicit).
- AC.M4B.3 — LL.2 edge modulators written to shadow/; LL.1 stability gate passed before
  LL.2 writes (SESSION_LOG documents the gate-pass moment).
- AC.M4B.4 — LL.3 adaptation notes document exists; any embedding re-indexing recommendation
  is native-approved before execution (flag if scope expands beyond notes to actual re-index).
- AC.M4B.5 — LL.4 prompt optimization record exists; proposed amendments cite specific
  calibration findings (B.3 derivation-ledger discipline); B.1 layer-separation preserved.
- AC.M4B.6 — `SHADOW_MODE_PROTOCOL_v1_0.md` exists; covers LL.1–LL.4 per-mechanism;
  kill-switch conditions and reversal protocol explicit.
- AC.M4B.7 — n=1 validity disclaimer attached to all calibration outputs per MACRO_PLAN
  §3.5.A Principle 1; disclaimer text appears in weight register header and in any
  synthesis output that cites calibrated weights.
- AC.M4B.8 — Two-pass approval evidence (Claude proposal + Gemini review) recorded in
  SESSION_LOG for each weight batch write; no batch lands without both approvals.
- AC.M4B.9 — No production register writes: all LL.1–LL.4 outputs in this sub-phase are
  shadow-mode only; promotion to production deferred until native approves promotion event.
- AC.M4B.10 — IS.8(a) every-third-session cadence tracked; if counter fires, REDTEAM_M4B_v1_0.md
  produced and passes before M4-B closes.

---

### §3.3 — M4-C — Retrieval + Discovery Learning (LL.5 + LL.6 + LL.7) + LL.8 Scaffold

**Scope.** LL.5–LL.7 move from dormant to active (native-only mode for LL.7). LL.8 is
scaffolded. Held-out partition calibration validity test runs.

1. **LL.5 — Retrieval ranking learning.** Using relevance judgments derived from
   event-match records (signal co-occurrence vs retrieval rank), produce ranker weight
   adjustments. These modulate the retrieval pipeline's signal ordering. Output at
   `06_LEARNING_LAYER/RANKER_WEIGHTS/` (new directory). Entry dependency: LL.3 stable
   (per MACRO_PLAN §LL-Appendix.B LL.5).

2. **LL.6 — Plan selection learning.** Using calibration findings from LL.4 prompt
   optimization, produce plan-selector weight adjustments: which query-type + chart-context
   combinations reliably benefit from which plan-class. Output at
   `06_LEARNING_LAYER/PLAN_SELECTION/` (new directory). Entry dependency: LL.4 stable.

3. **LL.7 — Discovery prior shaping (native-only mode).** Using the event-match records
   as the native's outcome record, shape discovery priors in native-only mode (regime (a)
   per MACRO_PLAN §LL-Appendix.B LL.7). Output at
   `06_LEARNING_LAYER/discovery_priors/native_priors_M4C_v1_0.json`.
   **Rubric for discovery priors** (which patterns get higher prior vs lower prior based
   on event-match outcome records) is a **native-approval point** at M4-C close.
   Cohort mode (regime (b), LL.7 §7b) is explicitly deferred to M7.

4. **LL.8 scaffold.** `06_LEARNING_LAYER/BAYESIAN_MODEL_UPDATING/README.md` created with
   status `SCAFFOLD-M4`; per-mechanism spec from MACRO_PLAN §LL-Appendix.B LL.8 cited;
   activation phase M5 declared; no Bayesian model operations at M4 (shadow or production).

5. **Held-out partition calibration validity test.** Run LL.1 weight predictions against
   the ≈9 held-out events. Check whether per-signal calibration error on held-out events
   is within the tolerance declared in `SHADOW_MODE_PROTOCOL_v1_0.md`. Produce test result
   document at `00_ARCHITECTURE/EVAL/CALIBRATION_VALIDITY_TEST_M4C_v1_0.md`. If tolerance
   is NOT met, calibration cycle loops back: the held-out result feeds into M4-B next cycle
   (first loop closure) rather than gating M4-D.

**Entry gate.** M4-B closed; LL.1 weights stable (N-threshold met per AC.M4B.1);
native approves LL.7 discovery prior rubric (proposed at M4-C entry or in final M4-B session).

**Sessions.** Estimated **3–4 sessions** split roughly:

- M4-C-S1: LL.5 ranker weights; LL.6 plan-selector weights (depends on LL.3/LL.4 stability).
- M4-C-S2: LL.7 discovery priors (native-only); LL.8 scaffold authoring.
- M4-C-S3 (close): Held-out partition calibration validity test; IS.8(a) cadence check;
  M4-C close-checklist + native approval of LL.7 rubric.

**Acceptance criteria.**

- AC.M4C.1 — `06_LEARNING_LAYER/RANKER_WEIGHTS/` exists; LL.5 first-cycle ranker weights
  present in shadow mode; LL.3 stability gate documented before writes.
- AC.M4C.2 — `06_LEARNING_LAYER/PLAN_SELECTION/` exists; LL.6 plan-selector weights in
  shadow mode; LL.4 stability gate documented before writes.
- AC.M4C.3 — `06_LEARNING_LAYER/discovery_priors/native_priors_M4C_v1_0.json` exists;
  LL.7 native-only mode output; native-approved rubric cited; cohort mode explicitly
  NOT present (deferred to M7 per MACRO_PLAN §LL-Appendix.B LL.7 §7b).
- AC.M4C.4 — `06_LEARNING_LAYER/BAYESIAN_MODEL_UPDATING/README.md` exists;
  status `SCAFFOLD-M4`; activation declared M5; no Bayesian operations in this artifact.
- AC.M4C.5 — `00_ARCHITECTURE/EVAL/CALIBRATION_VALIDITY_TEST_M4C_v1_0.md` exists;
  per-signal calibration error on held-out partition within declared tolerance; or, if
  tolerance NOT met, non-conformance logged with calibration loop-back record.
- AC.M4C.6 — No M5-shape pre-build: DBN implementation, probabilistic signal-state
  outputs, or cohort-mode priors do NOT exist at M4-C close (scope boundary per
  MACRO_PLAN §Scope Boundary + CLAUDE.md §L).
- AC.M4C.7 — n=1 disclaimers present on all LL.5–LL.7 outputs.
- AC.M4C.8 — IS.8(a) every-third-session cadence check; REDTEAM_M4C_v1_0.md produced
  if due.

---

### §3.4 — M4-D — Calibration Validator + Red-Team + M4 Close

**Scope.** Final validation, IS.8(b) macro-phase-close red-team, sealing artifacts, and
CURRENT_STATE flip M4→M5.

1. **Calibration validator run.** `run_calibration_validator.py` (new script, authored
   in this session or M4-C): runs the held-out partition test formally, exits 0 on PASS.
   Produces `00_ARCHITECTURE/EVAL/CALIBRATION_VALIDATOR_RUN_M4D_v1_0.json` with
   all metrics: per-class calibration error, overall match rate on held-out, n=1 validity
   compliance check, shadow-mode compliance check (no production writes without approval).

2. **IS.8(b) macro-phase-close red-team.** Per `ONGOING_HYGIENE_POLICIES §G.b`, every
   macro-phase close fires a red-team before SESSION_LOG seal. Axes for M4 red-team:
   - Axis 1 — Layer separation (B.1): calibration weights are L6 outputs, not L1 claims.
   - Axis 2 — Derivation ledger (B.3): every calibration table entry cites its LEL event + MSR signal IDs.
   - Axis 3 — No fabricated computation (B.10): all chart states computed via M3-B/C scripts or flagged [EXTERNAL_COMPUTATION_REQUIRED].
   - Axis 4 — n=1 validity (MACRO_PLAN §3.5.A): all calibration outputs carry the n=1 disclaimer.
   - Axis 5 — Shadow-mode discipline: no production-register writes without two-pass approval + N-threshold met.
   - Axis 6 — Held-out sacrosanctity (Learning discipline #4): held-out events never influenced a training calibration write.
   - Axis 7 — Scope compliance: no M5-shape pre-builds exist (LL.8 at scaffold only; no DBN).
   - Axis 8 — Mirror discipline (ND.1 + MP.1–MP.8): mirror pairs current; no silent overwrites.
   - Axis 9 — PPL discipline: all time-indexed M4 predictions logged before observation per §CW.PPL.
   Verdict required: PASS (all 9 axes) before SESSION_LOG seal.

3. **M4 sealing artifacts.**
   - `00_ARCHITECTURE/M4_CLOSE_v1_0.md` — §1 quality bar (per-AC PASS/DEFER table);
     §2 sub-phase wave log (M4-A through M4-D); §3 deferred items (carries forward to M5);
     §4 red-team evidence; §5 ND status; §6 mirror sync evidence.
   - `00_ARCHITECTURE/HANDOFF_M4_TO_M5_v1_0.md` — What M4 delivered (LL.1–LL.7 state);
     platform state; M5 priorities; hard prerequisites for M5 (≥50 PPL predictions with
     ≥6 months elapsed per MACRO_PLAN §M5); inherited open items by owner.

4. **CURRENT_STATE flip.** `active_macro_phase: M4 → M5`. M4 status → closed. Mirrors
   propagated (MP.1 + MP.2 same-session).

**Entry gate.** M4-C closed; calibration validity test result exists (PASS or non-conformance
logged + loop-back documented); native has reviewed M4 scope.

**Sessions.** Estimated **2–3 sessions** split roughly:

- M4-D-S1: Calibration validator run; IS.8(b) macro-phase-close red-team authoring.
- M4-D-S2 (close): M4_CLOSE_v1_0.md + HANDOFF_M4_TO_M5_v1_0.md authored; CURRENT_STATE
  flipped; mirrors propagated; SESSION_LOG sealed.

**Acceptance criteria.**

- AC.M4D.1 — `00_ARCHITECTURE/EVAL/CALIBRATION_VALIDATOR_RUN_M4D_v1_0.json` exists;
  validator exits 0; or non-conformance logged with explicit loop-back record and
  native-accepted rationale for proceeding.
- AC.M4D.2 — `00_ARCHITECTURE/EVAL/REDTEAM_M4_v1_0.md` exists; verdict PASS or
  PASS_WITH_FIXES; all 9 axes evaluated; all fixes applied before SESSION_LOG seal
  per IS.8(b) cadence rule.
- AC.M4D.3 — `00_ARCHITECTURE/M4_CLOSE_v1_0.md` exists; quality bar populated
  (per-AC PASS/DEFER/FAIL table covering M4-A through M4-D ACs).
- AC.M4D.4 — `00_ARCHITECTURE/HANDOFF_M4_TO_M5_v1_0.md` exists; M5 hard prerequisites
  stated (≥50 PPL predictions ≥6 months; LL.1–LL.7 stable); inherited open items
  explicitly transferred.
- AC.M4D.5 — `CURRENT_STATE_v1_0.md` updated: `active_macro_phase: M5`;
  M4 `active_macro_phase_status: closed`; M4 sealing artifact path recorded;
  `red_team_counter: 0` (IS.8(b) fires + resets per ONGOING_HYGIENE_POLICIES §G).
- AC.M4D.6 — Mirror sync to Gemini side recorded in close-checklist
  `mirror_updates_propagated` block; MP.1 (CLAUDE.md / .geminirules) + MP.2
  (CURRENT_STATE / .gemini/project_state.md) updated same-session per ND.1.
- AC.M4D.7 — All M4 known-deferred items named in `M4_CLOSE_v1_0.md §3` with explicit
  owner (native | M5 | M9-class) and ETA.
- AC.M4D.8 — SESSION_LOG seal block appended atomically at close; `schema_validator.py`
  and `drift_detector.py` run-verdicts recorded.

---

## §4 — Dependency graph

```
MACRO_PLAN §M4 (Calibration + LEL Ground-Truth Spine)
│
├── M4-W1 (plan-authoring) ── THIS SESSION
│     └── produces this document
│
├── M4-A (LEL Spine) ── UNBLOCKED (LEL gate CLEARED 2026-05-01)
│     ├── Swiss Ephemeris pass (11 pending events)
│     ├── LEL↔MSR event-match records (all 46 events)
│     ├── Held-out partition identification (≈9 events, decade-stratified)
│     ├── PPL migration (LEL §9 → prediction_ledger.jsonl)
│     ├── LL.1 STUB banner removed → active-pending
│     └── Chronological-completeness audit
│           │
│           ▼ (M4-A closed + rubric approved + shadow-mode exit rule approved)
│
├── M4-B (LL.1 + LL.2 + LL.3 + LL.4 activation)
│     ├── LL.1 signal_weights/shadow/ (training partition, ≥N per signal)
│     ├── LL.2 edge_modulators/shadow/ (after LL.1 stable)
│     ├── LL.3 adaptation notes (after LL.1 stable; embedding re-index native-gated)
│     ├── LL.4 prompt optimization record (after LL.1/rubric stable)
│     └── SHADOW_MODE_PROTOCOL_v1_0.md
│           │
│           ▼ (M4-B closed + LL.1 N-threshold met + LL.7 rubric approved)
│
├── M4-C (LL.5 + LL.6 + LL.7 + LL.8 scaffold)
│     ├── LL.5 ranker weights (after LL.3 stable)
│     ├── LL.6 plan-selector weights (after LL.4 stable)
│     ├── LL.7 discovery priors — native-only mode (after LL.1 stable)
│     ├── LL.8 Bayesian scaffold (status: SCAFFOLD-M4; activates at M5)
│     └── CALIBRATION_VALIDITY_TEST_M4C_v1_0.md (held-out partition test)
│           │
│           ▼ (M4-C closed + validity test PASS or loop-back documented)
│
└── M4-D (Validator + Red-Team + M4 Close)
      ├── run_calibration_validator.py
      ├── REDTEAM_M4_v1_0.md (IS.8(b) macro-phase-close; 9 axes)
      ├── M4_CLOSE_v1_0.md
      ├── HANDOFF_M4_TO_M5_v1_0.md
      └── CURRENT_STATE flip M4→M5 + mirror sync MP.1+MP.2

Concurrent (non-blocking):
  Portal Redesign R1–R6 (Claude-only per PORTAL_REDESIGN_TRACKER)
  BHISMA subsequent waves (model-family + eval infrastructure)
  LEL maintenance (new events log in cadence per CLAUDE.md §E)
  PPL active-from-emission (every time-indexed prediction logged before observation)
```

---

## §5 — Native-approval points (consolidated)

| Point ID | When | Question | Default if no explicit decision |
|---|---|---|---|
| NAP.M4.1 | M4-A-S1 open (or asynchronously before first event-match writes) | Calibration scoring rubric: how is "signal match" defined? Exact lit? Within N-day window? Domain-bucket match? Partial-credit scoring? | Propose rubric at M4-A-S1; native approves before any event-match records written. |
| NAP.M4.2 | M4-A close | LEL chronological-completeness audit: accept gap / elicit more events / defer? Per-decade decisions. | Accept gaps unless native explicitly requests elicitation; log each gap's resolution in SESSION_LOG. |
| NAP.M4.3 | M4-A close or M4-B-S1 open | KR.M3A.JH-EXPORT: pursue JH D9 verification now (DIS.009 full close) or carry as needs_verification? | Carry forward if JH not yet operationalised; document rationale. |
| NAP.M4.4 | M4-B-S1 open (before first weight write) | Shadow-mode exit rule: how many observations + what validity margin before a weight promotes shadow→production? | Propose at M4-B-S1; native approves before first weight write. |
| NAP.M4.5 | M4-B close | Native spot-check of LL.1 weight assignments (acharya-grade review of top 20 highest-weight signals + bottom 20 lowest-weight signals vs classical expectation). | Required for M4-B close; native provides verdict + any corrections before M4-C opens. |
| NAP.M4.6 | M4-C entry or M4-B close | LL.7 discovery prior rubric: which outcome-record patterns shape discovery priors upward vs downward? N threshold for prior update? | Propose at M4-C-S1 open; native approves before first prior write. |
| NAP.M4.7 | M4-D close | M4 macro-phase close: held-out test PASS + red-team PASS sufficient for M4→M5 flip? | Yes, if both pass; if either fails, surface non-conformance for native disposition before flip. |

---

## §6 — Concurrent workstreams (non-blocking)

### §6.1 — Portal Redesign (R1–R6)

Claude-only stream per `PORTAL_REDESIGN_TRACKER_v1_0.md`. Does not block any M4 sub-phase.
M4 sessions should not touch `redesign/` branch files; portal sessions should not touch
`06_LEARNING_LAYER/` or `01_FACTS_LAYER/`. No cross-contamination.

### §6.2 — BHISMA subsequent waves

`LLM_FIRST_PLANNER_ENABLED` flip (behind smoke verification), `assertWorkerHealthy()`
wiring, auth-cookie resolution (unblocks AC.M3A.5 eval-baseline capture). If auth secrets
become available in M4, AC.M3A.5 is a one-shot task; it does not block M4 sub-phase
progression but is worth closing if the opportunity arises.

### §6.3 — LEL maintenance

Per `CLAUDE.md §E`, LEL maintenance has cadence "start immediately; do not defer." New
events that occur during M4 are logged as they happen (minor version bump per LEL versioning
protocol). When new events are added, the corresponding event-match record is appended to
`lel_event_match_records.json` at the next M4 session.

### §6.4 — PPL (Prospective Prediction Logging)

Every time-indexed prediction any session emits during M4 logs to `prediction_ledger.jsonl`
with confidence + horizon + falsifier before the outcome is observed. Learning discipline
#4 is absolute: the model never sees outcome before prediction. PPL log is reviewed at each
IS.8(a) cadence-fire red-team to confirm no held-out contamination.

---

## §7 — Scope boundaries (CLAUDE.md §L + MACRO_PLAN §Scope Boundary)

**May touch in M4:**
- `06_LEARNING_LAYER/**` — primary M4 deliverable space.
- `01_FACTS_LAYER/LIFE_EVENT_LOG_v1_2.md` — minor version bumps only (new events, chart_state population for pending events); FORENSIC frozen.
- `00_ARCHITECTURE/EVAL/**` — calibration validity test + red-team artifacts.
- `00_ARCHITECTURE/M4_CLOSE_v1_0.md`, `HANDOFF_M4_TO_M5_v1_0.md`, `CURRENT_STATE_v1_0.md`.
- `platform/scripts/temporal/**` — read-only to run existing M3-B/C scripts (no new scripts unless specifically scoped at M4-A or M4-D).
- `00_ARCHITECTURE/SESSION_LOG.md` — append-only at every session close.
- `00_ARCHITECTURE/DISAGREEMENT_REGISTER_v1_0.md` — only if a disagreement is opened or closed in M4.

**Must NOT touch in M4:**
- `01_FACTS_LAYER/FORENSIC_ASTROLOGICAL_DATA_v8_0.md` — frozen (B.10).
- `025_HOLISTIC_SYNTHESIS/**` — frozen unless a specific correction is native-approved.
- `035_DISCOVERY_LAYER/**` — frozen; M3 deliverables; no retroactive changes.
- `05_TEMPORAL_ENGINES/**` — read-only (existing scripts may be run; no new temporal engines; that is M3 scope now closed).
- `platform/src/**` — unless a specific LL mechanism requires a feature flag (flag addition follows AC.M3A.2 pattern: default-false + smoke + native approval before flip).
- `platform/migrations/**` — no new migrations without explicit session brief authorization.
- Any `06_LEARNING_LAYER/` directory named but not declared in this plan (no scope creep).
- Any M5-shape artefacts (DBN, probabilistic signal-state outputs, LL.8 active operations).

---

## §8 — Session count estimate (full M4)

| Sub-phase | Min | Max | Notes |
|---|---|---|---|
| M4-W1 (plan authoring) | 1 | 1 | This Cowork session |
| M4-A (LEL spine) | 3 | 5 | Swiss Ephemeris pass + 46 event-match records; depends on match-record authoring pace |
| M4-B (LL.1–LL.4) | 3 | 5 | Calibration batch cycles; depends on N-threshold cadence and two-pass approval latency |
| M4-C (LL.5–LL.7 + LL.8 scaffold) | 3 | 4 | Depends on LL.1 stability timing |
| M4-D (close) | 2 | 3 | Validator + red-team + sealing artifacts |
| **Total** | **12** | **18** | **Fits MACRO_PLAN §M4 "15–25 focused sessions" range with margin** |

*Session counts are estimates. Per-sub-phase pacing adjusts based on calibration convergence
and native review latency. The IS.8(a) every-third-session cadence fires approximately 4
times during a 12–18 session M4 (at sessions ~3, ~6, ~9, ~12); the IS.8(b) macro-phase-close
cadence fires once at M4-D close.*

---

## §9 — Red-team cadence (IS.8)

| Cadence type | Rule | Expected M4 fires | Who authors |
|---|---|---|---|
| IS.8(a) every-third-session | Per `ONGOING_HYGIENE_POLICIES §G.a`: counter increments on substantive sessions; fires at 3; resets to 0 | ~4 times across 12–18 M4 sessions | Claude authors; Gemini reviews |
| IS.8(b) macro-phase-close | Per `ONGOING_HYGIENE_POLICIES §G.b`: every macro-phase close before SESSION_LOG seal | Once at M4-D close | Claude authors; native + Gemini review |

Red-team sessions do not increment the IS.8(a) counter (per ONGOING_HYGIENE_POLICIES §G).
Governance-only sessions (plan authoring, mirror sync, brief authoring) do not increment.
Substantive M4 sessions (event-match records, calibration writes, LL mechanism outputs) increment.

---

## §10 — M5 prerequisite state (for reference — do not pre-build)

Per `MACRO_PLAN_v2_0.md §M5` and §LL-Appendix.B LL.8:

- **M4 closed** (this plan's exit state).
- **LL.1–LL.7 stable** (calibration cycle closed; N-threshold met per mechanism; shadow-mode
  exit criteria met or carry documented).
- **LL.8 scaffold exists** (AC.M4C.4 — SCAFFOLD-M4 state; activates at M5 per activation matrix).
- **PPL ≥50 predictions with ≥6 months elapsed.** This is a *time-gate*, not just a count:
  predictions must have been logged ≥6 months before observation for the M5 DBN to have
  meaningful training data. This gate constrains when M5 can effectively open regardless of
  M4 close date. Current PPL state at M3 close: 10 PRED rows in prediction_ledger.jsonl;
  PRED.M3D.HOLDOUT.001 window 2026-08-15; PRED.M3D.HOLDOUT.002 window 2027-08-19+.
  M5 is therefore realistically gated to 2027 at earliest on the PPL time-gate alone.

*These are informational. No M5-shape pre-build in M4 scope (CLAUDE.md §L).*

---

*End of PHASE_M4_PLAN_v1_0.md — authored 2026-05-01 at Cowork-M4-W1-PLAN-AUTHORING-2026-05-01.*
*Next: first M4-A Claude Code session — LEL spine + Swiss Ephemeris pass for 11 pending events.*
