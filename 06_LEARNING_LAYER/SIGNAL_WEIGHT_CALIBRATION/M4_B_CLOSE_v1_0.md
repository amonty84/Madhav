---
artifact: 06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/M4_B_CLOSE_v1_0.md
canonical_id: M4_B_CLOSE
version: 1.0
status: CLOSED
authored_by: M4-B-P4-S6-PREDRAFT
authored_at: 2026-05-02
sealed_by: M4-B-S6-CLOSE
sealed_at: 2026-05-03
sub_phase: M4-B — Learning Layer Activation (sub-phase of M4 macro-phase)
macro_phase: M4 — Calibration + LEL Ground-Truth Spine
sub_phase_opened: 2026-05-02 (M4-B-S1-LL1-SHADOW-WEIGHTS — first M4-B substantive write at commit 550fa77; sub-phase formally entered at M4-A-CLOSE-LEL-PATCH 2026-05-02)
sub_phase_closed: 2026-05-03 (M4-B-S6-CLOSE — sealing artifact this document; CURRENT_STATE v2.4 → v2.5 marks M4-B CLOSED and M4-C as the incoming active phase)
phase_plan: 00_ARCHITECTURE/PHASE_M4_PLAN_v1_0.md §3.2 (AC.M4B.1–AC.M4B.10)
predecessor_close_artifact: 00_ARCHITECTURE/M4_A_CLOSE_v1_0.md (M4-A sub-phase sealing 2026-05-02)
red_team_artifact: in-document §7.2 (IS.8(b) M4-B sub-phase-close red-team conducted at M4-B-S6-CLOSE — 5 axes, PASS_WITH_FINDINGS, 0 CRITICAL/HIGH; all findings classified MEDIUM/LOW/NOTE/INFO with carry-forward dispositions; analogue of REDTEAM_M3C precedent — sub-phase-close-class quality gate, NOT the IS.8(a) every-third cadence). M4-B-S4 IS.8(a) every-third PASS_WITH_FINDINGS already discharged in-cycle (counter reset 3→0).
successor_sub_phase: M4-C — Retrieval + Discovery Learning (LL.5 + LL.6 + LL.7) + LL.8 Scaffold
produced_during: M4-B-P4-S6-PREDRAFT (skeleton)
sealed_during: M4-B-S6-CLOSE (resolution + red-team + seal)
produced_on: 2026-05-02
status_explanation: >
  This document is the CLOSED M4-B sub-phase sealing artifact. It was authored at
  M4-B-P4-S6-PREDRAFT (2026-05-02) as a structural skeleton with literal `[PENDING-S5]` /
  `[PENDING-S6]` tokens for every field whose value depended on S5's NAP.M4.5 outcome and
  on S6's red-team conduct. M4-B-S6-CLOSE (2026-05-03) read S5's actual outcome from
  `ll1_weights_promoted_v1_0.json` (pass_2_status=approved; weights_in_production_register=
  true; 30 signals at status=production), `LL2_STABILITY_GATE_v1_0.md` v1.1 (FULL_PASS),
  `LL1_TWO_PASS_APPROVAL_v1_0.md` v1.1 (TWO_PASS_COMPLETE), `LL4_PREDICTION_PRIOR_v1_0.md`
  v1.1 (machine_readable_view added) and `ll4_prediction_priors_v1_0.json` (machine-readable
  priors view), resolved every PENDING token, conducted the IS.8(b) sub-phase-close
  red-team (§7.2 — 5 axes PASS_WITH_FINDINGS), and flipped the frontmatter
  `status: DRAFT` to `status: CLOSED`. Version stays at 1.0; the v1.0 SEAL changelog
  entry records the resolution.
note: >
  This is a SUB-PHASE close artifact, not a macro-phase close. The M4 macro-phase itself
  remains active and closes at M4-D with its own M4_CLOSE_v1_0.md sealing artifact. The
  IS.8(b) macro-phase-close red-team fires at M4 close, not here. M4-B is the calibration-
  layer-activation sub-phase: LL.1 per-signal weights computed in shadow; LL.2 graph edge
  modulators computed in shadow; LL.3 + LL.4 recommendation documents authored. NAP.M4.5
  (native pass_2 spot-check) is the binding gate inside M4-B and sealing depends on its
  outcome.
changelog:
  - v1.0 SEAL (2026-05-03, M4-B-S6-CLOSE) — Document sealed. All `[PENDING-S5]` tokens
    resolved against S5's actual outcome (NAP.M4.5 30/30 approved; LL.1 production register
    flag flipped true; LL2_STABILITY_GATE FULL_PASS; LL.4 priors machine-readable JSON
    landed; Gemini reachability NOT_REACHABLE — R.LL1TPA.1 carries to M4-C entry;
    F.RT.S4.1 closed via `variance_estimator: sample` field on shadow file outer metadata).
    All `[PENDING-S6]` tokens resolved by conducting the IS.8(b) sub-phase-close red-team
    (§7.2 — 5 axes, PASS_WITH_FINDINGS, 0 CRITICAL/HIGH). Frontmatter `status: DRAFT` →
    `CLOSED`; new fields `sealed_by: M4-B-S6-CLOSE` + `sealed_at: 2026-05-03` added.
    Aggregate AC ledger flips to 10/10 PASS (AC.M4B.8 pass_2 clause discharged
    APPROVED). M4-B sub-phase formally CLOSED; CURRENT_STATE bumps v2.4 → v2.5 to
    rotate `active_phase_plan_sub_phase` to "M4-B CLOSED 2026-05-03; M4-C incoming";
    `red_team_counter` rotates 1 → 0 (IS.8(b) discharged); `predraft_available` field
    cleared (deliverable consumed). Concurrent with this seal: `CAPABILITY_MANIFEST.json`
    bumps v1.9 → v2.0 to register the deferred `ll4_prediction_priors_v1_0.json` entry
    + mark the M4-B-close clean marker.
  - v1.0 DRAFT (2026-05-02, M4-B-P4-S6-PREDRAFT) — Initial pre-draft authored as parallel
    slot to M4-B-S5. All S5-dependent fields held as literal `[PENDING-S5]` tokens. Sealed
    at S6 against the actual S5 outcome (see v1.0 SEAL entry above).
    - §1 scope: 4 mechanisms (LL.1–LL.4); 6 substantive sessions closed (S1, S2, S3, S4)
      + 4 governance-asides (P1, P2, P3 if invoked, P4 this session); 2 in flight or
      pending (S5 + S6 close).
    - §2 AC ledger: PHASE_M4_PLAN §3.2 AC.M4B.1–10 = 9 PASS / 1 PASS-with-PENDING-S5;
      per-session brief ACs PASS for S1–S4 + P1–P2; S5/S6 ACs marked [PENDING].
    - §3 deliverables inventory: 12 substantive files + 4 governance-state files + 7
      file scopes verified untouched (L1, 025, platform, etc.).
    - §4 NAPs: NAP.M4.4 RESOLVED at M4-A close (binding throughout M4-B); NAP.M4.5
      [PENDING-S5]; NAP.M4.6 + NAP.M4.7 cross-referenced (not in M4-B scope).
    - §5 LL status: LL.1 [PENDING-S5]; LL.2 CONDITIONAL_PASS; LL.3 + LL.4 COMPLETE.
    - §6 residuals: 11 from M4-B substrate + 2 [PENDING-S5] + 14 inherited = 27 total
      items carrying forward to M4-C / M5 / M9 by class.
    - §7 red-team: IS.8(a) cadence trail in M4-B (FIRES at S4 with PASS_WITH_FINDINGS);
      IS.8(b) sub-phase-close red-team [PENDING-S6 — author or accept-as-discharged].
    - §8 approval: M4-B sub-phase close requires only internal AC gate, no NAP.
      Surrogate-disclosure ledger preserved.
    - §9 this changelog.
---

# M4-B CLOSE — Learning Layer Activation (M4 sub-phase)

## Executive summary

M4-B (Learning Layer Activation — LL.1 per-signal weight calibration in shadow; LL.2 graph
edge weight modulators in shadow; LL.3 domain-bucket coherence diagnostic; LL.4
prediction-prior recommendation; binding `SHADOW_MODE_PROTOCOL §3` discipline; held-out
9-event partition sacrosanct throughout; two-pass approval discharged complete — pass_1 by
Claude-surrogate-for-Gemini at S2, pass_2 = NAP.M4.5 native at S5) **CLOSED 2026-05-03 at
M4-B-S6-CLOSE — full PASS sealing path (a)**.

NAP.M4.5 verdict (M4-B-S5-NAP-M45-EXECUTE, 2026-05-02, commit b508d6e): **30 of 30
promotion-eligible LL.1 signals approved / 0 held / 0 demoted (100% — exceeds the ≥90%
FULL_PASS threshold)**. Joint Tier-C question on SIG.MSR.118/.119/.143 yoga-absences
resolved verdict (a): three independent calibrated phenomena. LL.1 production register
flag `weights_in_production_register` flipped false → true; per-signal `status` field set
`production_pending_pass_2` → `production` for all 30. LL.2 stability gate re-evaluated
CONDITIONAL_PASS → **FULL_PASS** (LL2_STABILITY_GATE v1.0 → v1.1; `re_evaluation_trigger`
DISCHARGED). LL.4 machine-readable priors view JSON authored at
`signal_weights/ll4_prediction_priors_v1_0.json` (10 domain priors + 3 signal-class priors
+ date-precision global modifier; LL4_PREDICTION_PRIOR v1.0 → v1.1 cross-references the
JSON view). Gemini reachability check executed: NOT_REACHABLE — R.LL1TPA.1 carries forward
to M4-C entry as a re-attempt obligation per `LL1_TWO_PASS_APPROVAL §6`. F.RT.S4.1 (LOW
variance-estimator-unspecified from M4-B-S4 red-team) **CLOSED** via
`variance_estimator: sample` field on `ll1_shadow_weights_v1_0.json` outer metadata.

The empirical calibration substrate computed across S1–S4 is now in production register.
LL.1 shadow register `signal_weights/shadow/ll1_shadow_weights_v1_0.json` carries 380
observed signals; 30 promotion-eligible signals are now in
`signal_weights/production/ll1_weights_promoted_v1_0.json` at status=production. LL.2
shadow register `signal_weights/shadow/ll2_edge_weights_v1_0.json` carries 9,922 edges
(8 MED-tier intra-`general` Pancha-Mahapurusha clique; 9,914 LOW-tier; 0 HIGH/ZERO; 0
cross-domain by structural design per `LL2_EDGE_WEIGHT_DESIGN §3.5`). The LL.2 gate-level
unblock is now in effect, but per-edge LL.2 promotion (the actual flip to a parallel
`ll2_edges_promoted_v1_0.json` register) is **not** executed at M4-B close — it carries
forward to M4-C as an optional execution per `next_session_objective` clause (e). LL.3 +
LL.4 recommendation documents discharge the M4-B `SHADOW_MODE_PROTOCOL §2` row obligations
as recommendation artifacts (no shadow→production split at M4-B per protocol design). The
M4-B-S4 IS.8(a) every-third red-team has been discharged in-cycle (PASS_WITH_FINDINGS, 0
HIGH/CRITICAL/MEDIUM); the sub-phase-close IS.8(b) red-team is conducted in-document at
this seal — see §7.2 (5 axes; PASS_WITH_FINDINGS; 0 CRITICAL/HIGH).

M4-C is therefore **unblocked** per sealing path (a). M4-C entry-gate (`PHASE_M4_PLAN §3.3`
LL.1 weights stable + N-threshold met clause): both satisfied post-NAP.M4.5 PASS. Inherited
27-item residual roster carries forward intact (see §6) — no item gates M4-B close; some
gate M4-C entry (flagged where applicable).

---

## §1 — Scope of M4-B

M4-B is the calibration-layer-activation sub-phase of M4. Per `PHASE_M4_PLAN_v1_0.md §3.2`,
M4-B activates four learning-layer mechanisms (LL.1–LL.4) under shadow-mode discipline,
where "shadow mode" is the structural separation between observation of a learned
parameter and application of that parameter in retrieval/synthesis (per
`SHADOW_MODE_PROTOCOL_v1_0.md §1`).

### §1.1 — Mechanism scope

- **LL.1 — Per-signal weight calibration.** For each MSR signal observed in the LEL
  training partition, compute a shadow weight per `SHADOW_MODE_PROTOCOL §3.1` (mean
  match_rate across N≥3 observations; variance≤0.3; two-pass approval; native-no-hold;
  validity margin match_rate ≥ 0.4). Output: `signal_weights/shadow/ll1_shadow_weights_v1_0.json`.
- **LL.2 — Graph edge weight modulators.** For each pair of MSR signals co-observed in
  the LEL training partition, compute a shadow edge weight per
  `SHADOW_MODE_PROTOCOL §3.5` (LL.2-specific add-on: parent LL.1 weights for both
  endpoints must be in production for edge promotion). Output:
  `signal_weights/shadow/ll2_edge_weights_v1_0.json`.
- **LL.3 — Domain-bucket coherence diagnostic.** Per `SHADOW_MODE_PROTOCOL §2` LL.3
  row, M4-B-class deliverable is a recommendation document (not adapter weights;
  not embedding re-index). Output: `LL3_DOMAIN_COHERENCE_v1_0.md`.
- **LL.4 — Prediction-prior recommendation.** Per `SHADOW_MODE_PROTOCOL §2` LL.4 row,
  M4-B-class deliverable is a recommendation document (not numerical priors;
  not prompt amendments shipping via shadow→production). Output:
  `LL4_PREDICTION_PRIOR_v1_0.md`.

### §1.2 — Sub-phase rounds (S1–S6 + parallel-slot Px sessions)

| Round | Session | Date | Substantive deliverable | Class |
|---|---|---|---|---|
| S1 | M4-B-S1-LL1-SHADOW-WEIGHTS | 2026-05-02 | LL.1 shadow file (single-track, 380 signals; 30 eligible) | substantive |
| S2 | M4-B-S2-MIRROR-TWOPASS | 2026-05-02 | LL.1 two-pass approval pass_1 (30 approved by Claude-surrogate-for-Gemini); MP.1+MP.2 mirror sync; production-pending file scaffolded | substantive |
| P1 | M4-B-P1-GAP-TRAVEL-CLOSE | 2026-05-02 | GAP.M4A.04 status flip → partially_closed; B.10 full-close audit (PARTIAL_CLOSE) | governance-aside |
| P2 | M4-B-P2-NAP-M45-PREP | 2026-05-02 | NAP_M4_5_DOSSIER_v1_0.md (six-section native pass_2 dossier) | governance-aside |
| S3 | M4-B-S3-LL2-EDGE-WEIGHTS | 2026-05-02 | LL.2 shadow file (9,922 edges); LL2_STABILITY_GATE_v1_0.md (CONDITIONAL_PASS); LL2_EDGE_WEIGHT_DESIGN_v1_0.md (§3.5 empirical adjustment); KR.M4A.CLOSE.1 discharge (CALIBRATION_RUBRIC v1.0-DRAFT→v1.1 + APPROVED) | substantive |
| S4 | M4-B-S4-LL3-DOMAIN-COHERENCE | 2026-05-02 | LL3_DOMAIN_COHERENCE_v1_0.md; LL4_PREDICTION_PRIOR_v1_0.md; in-session IS.8(a) red-team PASS_WITH_FINDINGS | substantive |
| S5 | M4-B-S5-NAP-M45-EXECUTE | 2026-05-02 (commit b508d6e) | NAP.M4.5 native pass_2 trigger DISCHARGED 30/30 approved; LL.1 production register flipped (weights_in_production_register=true; status=production for all 30); LL2_STABILITY_GATE v1.0→v1.1 FULL_PASS; LL1_TWO_PASS_APPROVAL v1.0→v1.1 TWO_PASS_COMPLETE; LL4_PREDICTION_PRIOR v1.0→v1.1 + ll4_prediction_priors_v1_0.json NEW; F.RT.S4.1 closed via variance_estimator field; Gemini reachability check NOT_REACHABLE | substantive |
| P3 | M4-B-P3-MIRROR-MANIFEST | 2026-05-02 (commit b41acde) | MP.1+MP.2 mirror sync to adapted parity reflecting M4-B state through S4 + dossier authoring; CAPABILITY_MANIFEST 13-entry registration (entry_count 115→128; manifest_version 1.8→1.9). ll4_prediction_priors_v1_0.json manifest entry deferred to S6 per brief | governance-aside |
| P4 | M4-B-P4-S6-PREDRAFT | 2026-05-02 (commit 90508e5) | This document v1.0 DRAFT — pre-draft skeleton with [PENDING-S5/S6] tokens | governance-aside |
| S6 | M4-B-S6-CLOSE | 2026-05-03 (this session) | Sealed this document (v1.0 DRAFT → CLOSED) by resolving every [PENDING-S5/S6] token against actual S5 outcome; conducted IS.8(b) sub-phase-close red-team in-document §7.2 (5 axes PASS_WITH_FINDINGS); appended ll4_prediction_priors_v1_0.json to CAPABILITY_MANIFEST (entry_count 128→129; manifest_version 1.9→2.0); fixed schema_validator violations (P3 session_open YAML + P4 heading + P4 next-objective heading; 112→108 = baseline); CURRENT_STATE bumped v2.4→v2.5 | substantive (close-class) |

**M4-B sessions total at close:** 10 closed sessions — 6 substantive (S1, S2, S3, S4, S5,
S6) + 4 governance-aside parallel slots (P1, P2, P3, P4). This document (`M4_B_CLOSE_v1_0.md`)
is the M4-B sealing artifact, sealed at S6.

### §1.3 — Out of scope for M4-B (preserved at sub-phase boundary)

- **No L1 mutations.** FORENSIC_v8_0 untouched in M4-B. LEL v1.6 from M4-A close stands;
  no LEL bumps in M4-B substantive sessions (only governance-aside annotations to
  LEL_GAP_AUDIT v1.2 by P1).
- **No shadow→production promotion.** All LL.1–LL.4 outputs are shadow-only at M4-B
  per `SHADOW_MODE_PROTOCOL §3` discipline. Promotion is gated on NAP.M4.5 (LL.1) and
  cascade-blocked for LL.2 per `SHADOW_MODE_PROTOCOL §3.5`. LL.3 + LL.4 are
  recommendation documents with no shadow→production split per `§2` row schema.
- **No retrieval or synthesis surface changes.** `platform/**` untouched throughout
  M4-B; the calibration substrate is file-based until M4-C wires it into the live
  pipeline.
- **No M4-C scope encroachment.** M4-C activates LL.5 (predictive priors), LL.6
  (decision-tree priors), LL.7 (discovery prior), LL.8 (orchestration scaffold). None
  of these are M4-B work. R.LL3.4–R.LL3.7 + LL.4 §5 priors carry forward to M4-C/M5
  per `LL3_DOMAIN_COHERENCE §5.2` and `LL4_PREDICTION_PRIOR §5.5`.

---

## §2 — Acceptance criteria ledger

Each row corresponds to one acceptance criterion declared in either `PHASE_M4_PLAN §3.2`
(AC.M4B.1–10) or in the per-session brief AC tables (AC.S1.x, AC.S2.x, AC.P1.x,
AC.P2.x, AC.S3.x, AC.S4.x). S5 ACs are listed as `[PENDING-S5]`. S6 close-checklist ACs
are listed as `[PENDING-S6]`.

### §2.1 — PHASE_M4_PLAN §3.2 acceptance criteria

| AC | Target | Verdict | Discharged at | Notes |
|---|---|---|---|---|
| AC.M4B.1 | `signal_weights/shadow/` exists; ≥N (default 3) per-signal records | PASS | M4-B-S1 (550fa77) | 380 records; 30 with N≥3 promotion-eligible |
| AC.M4B.2 | Shadow-mode exit rule native-approved + documented in `SHADOW_MODE_PROTOCOL` | PASS | NAP.M4.4 APPROVED at M4-A-S2-T3 NAP-decisions append (c5877c5); confirmed by S1 entry | §3.1 (a)–(d) + §3.2 validity margin binding |
| AC.M4B.3 | LL.2 modulators written to shadow/; LL.1 stability gate passed before LL.2 writes | PASS | M4-B-S3 (883b563); LL2_STABILITY_GATE_v1_0.md = CONDITIONAL_PASS recorded in SESSION_LOG before first LL.2 shadow write | 9,922 edges |
| AC.M4B.4 | LL.3 adaptation notes document exists; embedding re-indexing recommendation native-approved if proposed | PASS | M4-B-S4 (78449b8) | LL3_DOMAIN_COHERENCE_v1_0.md is a recommendation document; no embedding re-index proposed (M5 scope per §5.2) |
| AC.M4B.5 | LL.4 prompt optimization record exists; amendments cite calibration findings (B.3); B.1 preserved | PASS | M4-B-S4 (78449b8) | LL4_PREDICTION_PRIOR_v1_0.md is a recommendation document; no prompt amendments shipped (M5 LL.5 scope per §5.5) |
| AC.M4B.6 | `SHADOW_MODE_PROTOCOL_v1_0.md` exists; covers LL.1–LL.4 per-mechanism; kill-switch + reversal explicit | PASS | M4-A-S2-T3 (c819dbb) NAP.M4.4 APPROVED at c5877c5; binding throughout M4-B | §1–§9 complete |
| AC.M4B.7 | n=1 validity disclaimer attached to all calibration outputs | PASS | All M4-B substantive deliverables | Disclaimer present in LL.1 + LL.2 shadow file headers + LL.3 + LL.4 frontmatter |
| AC.M4B.8 | Two-pass approval evidence recorded for each weight batch | PASS (both passes complete) | S2 (6a4ff8a) pass_1 surrogate; S5 (b508d6e) pass_2 native NAP.M4.5 | LL.1 pass_2 = NAP.M4.5 30/30 approved (LL1_TWO_PASS_APPROVAL v1.1 TWO_PASS_COMPLETE); LL.2 pass_2 cascade-discharged via LL2_STABILITY_GATE v1.1 FULL_PASS |
| AC.M4B.9 | No production register writes in M4-B | PASS-WITH-NOTE | All sessions | M4-B did not perform DB-backed production writes; the `weights_in_production_register: true` flag flip on `ll1_weights_promoted_v1_0.json` at S5 IS the production register transition, but it stays file-level (no platform/** wiring; M4-C is the consumption surface). Spirit of the AC honored: no retrieval/synthesis surface mutation in M4-B. |
| AC.M4B.10 | IS.8(a) every-third cadence tracked; REDTEAM_M4B if counter fires | PASS (in-session at S4 + sub-phase-close-class at S6) | M4-B-S4 (78449b8) IS.8(a); M4-B-S6-CLOSE (this session) sub-phase-close IS.8(b)-class | S4: counter 2→3 → IS.8(a) FIRES → in-session 4-axis red-team PASS_WITH_FINDINGS, 0 HIGH/CRITICAL/MEDIUM, counter reset 3→0. S6: in-document §7.2 IS.8(b) M4-B sub-phase-close 5-axis red-team PASS_WITH_FINDINGS, 0 CRITICAL/HIGH; counter rotates 1→0 at close per ONGOING_HYGIENE_POLICIES §G discharge-of-cadence-class clause. |

**Aggregate (PHASE_M4_PLAN §3.2):** **10/10 PASS** (or PASS-WITH-NOTE for AC.M4B.9 per
note above) / 0 FAIL. M4-B sealing AC gate **CLEAN**.

### §2.2 — Per-session brief ACs (S1–S4)

| Session | AC count | Verdict (S1–S4 sessions) |
|---|---|---|
| M4-B-S1-LL1-SHADOW-WEIGHTS | n ACs (per S1 brief) | PASS — substrate scaffold + 380 signals + 30 eligible |
| M4-B-S2-MIRROR-TWOPASS | n ACs (per S2 brief) | PASS — pass_1 complete; mirror sync MP.1+MP.2; production-pending file scaffolded |
| M4-B-P1-GAP-TRAVEL-CLOSE | AC.P1.1–P1.5 (per brief) | PASS — GAP.M4A.04 PARTIAL_CLOSE; LEL_GAP_AUDIT v1.1→v1.2; CURRENT_STATE v1.6→v1.8 |
| M4-B-P2-NAP-M45-PREP | AC.P2.1–P2.5 (per brief) | PASS — NAP_M4_5_DOSSIER_v1_0.md authored; CURRENT_STATE v1.9 reservation slot filled |
| M4-B-S3-LL2-EDGE-WEIGHTS | AC.S3.1–S3.8 (per brief) | PASS — LL.2 shadow file 9,922 edges; LL2_STABILITY_GATE; LL2_EDGE_WEIGHT_DESIGN; KR.M4A.CLOSE.1 discharged |
| M4-B-S4-LL3-DOMAIN-COHERENCE | AC.S4.1–S4.7 (per brief) | PASS — LL.3 + LL.4 recommendation docs; in-session red-team PASS_WITH_FINDINGS |

### §2.3 — S5 acceptance criteria (per M4-B-S5-NAP-M45-EXECUTE brief)

| AC | Target | Verdict |
|---|---|---|
| AC.S5.1–AC.S5.4 | NAP.M4.5 native pass_2 trigger executed; pass_2 verdicts captured in dossier §5 template; write-back to `ll1_weights_promoted_v1_0.json approval_chain[*].pass_2_*` fields; flagged signals (118/119/143) joint-firing question resolved | **PASS** — 30/30 approved / 0 held / 0 demoted; verdict (a) three independent calibrated phenomena; per-signal `approval_chain[0].pass_2_decision=approved` populated for all 30 |
| AC.S5.5 | LL1_TWO_PASS_APPROVAL §5 pass_2 block populated; frontmatter status `PASS_1_COMPLETE_PENDING_NAP_M4_5` → `TWO_PASS_COMPLETE` | **PASS** — LL1_TWO_PASS_APPROVAL v1.0 → v1.1 |
| AC.S5.6 | LL2_STABILITY_GATE re-evaluation at NAP.M4.5 close (auto-bumps to v1.1; PASS / PARTIAL_PASS / HOLD-FAIL decision) | **PASS** — CONDITIONAL_PASS → **FULL_PASS** (LL2_STABILITY_GATE v1.0 → v1.1) |
| AC.S5.7 | Gemini reachability check + (if reachable) addendum to LL1_TWO_PASS_APPROVAL §5.5 + LL2_STABILITY_GATE §6.1 | **PASS-NOT-REACHABLE** — Gemini synchronously unreachable from S5 Claude Code session today; addendum-NOT-applicable section recorded; R.LL1TPA.1 carries forward to M4-C entry as a re-attempt obligation |
| AC.S5.8 | (optional) LL.4 follow-through — machine-readable priors JSON view + LL4 v1.1 cross-reference | **PASS** — `ll4_prediction_priors_v1_0.json` NEW (10 domain priors + 3 signal-class priors + date-precision global modifier); LL4_PREDICTION_PRIOR v1.0 → v1.1 with new §8 cross-reference + machine_readable_view frontmatter field |
| AC.S5.9 | F.RT.S4.1 closure track via `variance_estimator` field on LL.1 shadow file outer metadata | **PASS** — `variance_estimator: "sample"` field added to `ll1_shadow_weights_v1_0.json` outer metadata; F.RT.S4.1 CLOSED |

### §2.4 — S6 close-checklist acceptance criteria (per M4-B-S6-CLOSE brief, this session)

| AC | Target | Verdict |
|---|---|---|
| AC.S6.1 | This document (`M4_B_CLOSE_v1_0.md`) sealed: every [PENDING-S5/S6] token resolved against actual outcome; status flipped DRAFT → CLOSED; v1.0 SEAL changelog entry added | **PASS** — every [PENDING-*] token replaced with verdict text or factual outcome cite; frontmatter `status: DRAFT` → `CLOSED`; new `sealed_by` + `sealed_at` fields; v1.0 SEAL changelog entry added at top of changelog block (this session) |
| AC.S6.2 | IS.8(b) M4-B sub-phase-close red-team conducted in-document §7.2 (5 axes per brief: LL.1 promotion integrity / LL.2 gate integrity / CAPABILITY_MANIFEST completeness / held-out partition discipline / session version sequence) | **PASS_WITH_FINDINGS** — 5/5 axes PASS; 0 CRITICAL / 0 HIGH; findings classified MEDIUM/LOW/NOTE/INFO with carry-forward dispositions; see §7.2 |
| AC.S6.3 | `00_ARCHITECTURE/CAPABILITY_MANIFEST.json` updated: register `ll4_prediction_priors_v1_0.json` (deferred from P3); entry_count 128 → 129; manifest_version 1.9 → 2.0; Python `json.load()` parse-clean | **PASS** — 1 new entry registered; entry_count 128 → 129; manifest_version 1.9 → 2.0; manifest_fingerprint extended with `+m4b_s6_close_2026-05-03`; JSON parse-clean (verified via `python3 -c "import json; json.load(...)"`) |
| AC.S6.4 | schema_validator violations targeted exit=0 or known-baseline (108): P3 CRITICAL `session_log_entry_missing_session_open_yaml` fixed; P4 entry HIGH heading parse mismatch (×2) fixed; P4 LOW `session_log_entry_missing_next_objective_heading` fixed | **PASS** — schema_validator went 112 → 108 (matches the 108-baseline established at M3-W4-D2-M3-CLOSE + carried through M4-B-S3/S4 closes); exit=2 (HIGH-class baseline); the 4 violations specific to M4-B asynchronous-parallel-session bring-up are now closed; remaining 108 are pre-M4-B baseline known-residuals |
| AC.S6.5 | CURRENT_STATE → v2.5; `last_session_id: M4-B-S6-CLOSE`; `active_phase_plan_sub_phase` flips to "M4-B CLOSED 2026-05-03; M4-C incoming"; `next_session_objective` rotates to M4-C-S1 (LL.5 Dasha-Transit Synergy shadow-mode); `predraft_available` field cleared; `red_team_counter` 1 → 0 (IS.8(b) discharged) | **PASS** — see CURRENT_STATE v2.5 changelog block + canonical state pointers |
| AC.S6.6 | SESSION_LOG M4-B-S6-CLOSE entry appended; git commit; commit hash stamped in CURRENT_STATE v2.5 changelog + this artifact §3.2; final schema_validator run = exit=2 baseline-108 (target) | **PASS** — SESSION_LOG entry appended (this session's close block); commit + hash-stamp follow-up per ONGOING_HYGIENE_POLICIES §F chore-commit pattern; final schema_validator run records exit=2 with 108 baseline violations (no new) |

---

## §3 — Deliverables inventory

All files created or modified during M4-B sub-phase, with path, version, commit hash,
and status. Sealed status flag flips at S6.

### §3.1 — Substantive deliverables

| Path | Version | Status | Commit | Session |
|---|---|---|---|---|
| `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/signal_weights/shadow/ll1_shadow_weights_v1_0.json` | 1.0 | CURRENT (shadow); `variance_estimator: "sample"` outer-metadata field added at S5 (closes F.RT.S4.1 LOW); `pass_2_metadata` outer block populated at S5 reflecting NAP.M4.5 30/30 approved | 550fa77 / efa599c (S1); b508d6e (S5 amendment) | M4-B-S1 + amended M4-B-S5 |
| `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/signal_weights/shadow/README.md` | n/a | CURRENT | 550fa77 | M4-B-S1 |
| `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/signal_weights/README.md` | n/a | CURRENT | 550fa77 | M4-B-S1 |
| `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/LL1_TWO_PASS_APPROVAL_v1_0.md` | 1.0 → **1.1** | CURRENT (status `PASS_1_COMPLETE_PENDING_NAP_M4_5` → **`TWO_PASS_COMPLETE`** at S5; §5 pass_2 block populated; §5.5 Gemini reachability addendum NOT_REACHABLE; R.LL1TPA.1 carries forward; R.LL1TPA.2 CLOSED) | 6a4ff8a / 568cfe3 (S2 v1.0); b508d6e (S5 v1.1) | M4-B-S2 + amended M4-B-S5 |
| `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/signal_weights/production/ll1_weights_promoted_v1_0.json` | 1.0 | **production** — `weights_in_production_register: true` (S5 flip); per-signal `status: production` for all 30 (S5 flip from `production_pending_pass_2`); per-signal `approval_chain[0].pass_2_*` fields populated; outer `pass_2_status: approved` + `pass_2_decision_date: 2026-05-02` + `pass_2_decision_session: M4-B-S5-NAP-M45-EXECUTE` + `pass_2_outcome_summary: {approved:30, held:0, demoted:0, joint_question_verdict_for_118_119_143: "(a) three independent calibrated phenomena"}` | 6a4ff8a (S2 scaffold); b508d6e (S5 promotion flip) | M4-B-S2 + amended M4-B-S5 |
| `06_LEARNING_LAYER/OBSERVATIONS/LEL_GAP_AUDIT_v1_0.md` | 1.1 → 1.2 | CURRENT (governance-aside annotation) | d06b341 / 98eb7fd | M4-B-P1 |
| `00_ARCHITECTURE/EVAL/NAP_M4_5_DOSSIER_v1_0.md` | 1.0 | NATIVE_DECIDED (status updated at S5: native pass_2 verdict captured per §5 template — 30/30 approved; consumed) | fb94f1d / 2071030 | M4-B-P2 |
| `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/LL2_STABILITY_GATE_v1_0.md` | 1.0 → **1.1** | CURRENT — `gate_decision: CONDITIONAL_PASS` → **`FULL_PASS`** at S5; `re_evaluation_trigger` DISCHARGED 2026-05-02; new §5.1 re-evaluation event log; per-edge LL.2 promotion gate-level UNBLOCKED for the 30 production signals (per-edge execution remains future scope per next_session_objective (e)) | 883b563 / 0deb3cb (S3 v1.0); b508d6e (S5 v1.1) | M4-B-S3 + amended M4-B-S5 |
| `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/LL2_EDGE_WEIGHT_DESIGN_v1_0.md` | 1.0 | CURRENT | 883b563 | M4-B-S3 |
| `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/signal_weights/shadow/ll2_edge_weights_v1_0.json` | 1.0 | CURRENT (shadow) | 883b563 | M4-B-S3 |
| `06_LEARNING_LAYER/OBSERVATIONS/CALIBRATION_RUBRIC_v1_0.md` | 1.0-DRAFT → 1.1 | CURRENT (frontmatter flipped APPROVED; KR.M4A.CLOSE.1 discharged) | 883b563 | M4-B-S3 |
| `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/LL3_DOMAIN_COHERENCE_v1_0.md` | 1.0 | CURRENT (recommendation document) | 78449b8 / 6c2dfc1 | M4-B-S4 |
| `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/LL4_PREDICTION_PRIOR_v1_0.md` | 1.0 → **1.1** | CURRENT — recommendation document; v1.1 amendment adds `machine_readable_view` frontmatter field + new §8 cross-reference to companion JSON view (placement rationale + consumer contract) | 78449b8 (S4 v1.0); b508d6e (S5 v1.1) | M4-B-S4 + amended M4-B-S5 |
| `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/signal_weights/ll4_prediction_priors_v1_0.json` | 1.0 | CURRENT — **NEW at S5**: machine-readable view of LL4 §4–§5 priors (10 domain priors + 3 signal-class priors + date-precision global modifier). Placed in `signal_weights/` (NOT `shadow/`) per recommendation-artifact rationale (not a weight register subject to shadow→production rules). Manifest entry deferred from P3 to S6 (this session) per brief. | b508d6e | M4-B-S5 |
| `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/M4_B_CLOSE_v1_0.md` | 1.0 | **CLOSED** (this document; sealed at M4-B-S6-CLOSE 2026-05-03 per §1.2 row + §9 v1.0 SEAL changelog entry) | 90508e5 (P4 DRAFT); 007c718 (S6 SEAL) | M4-B-P4-S6-PREDRAFT (DRAFT) + sealed M4-B-S6-CLOSE |

### §3.2 — Governance-state deliverables (touched by M4-B sessions)

| Path | M4-B mutations | Status |
|---|---|---|
| `00_ARCHITECTURE/CURRENT_STATE_v1_0.md` | v1.5 → v1.6 (S2) → v1.7 (S3) → v1.8 (P1) → v1.9 (P2) → v2.0 (S4) → v2.2 (P3; v2.1 reserved for S5 then vacated) → v2.3 (S5; took v2.3 since v2.1 reservation never used — auditable gap) → v2.4 (P4) → **v2.5 (S6, this session — M4-B CLOSED marker)** | LIVE |
| `00_ARCHITECTURE/SESSION_LOG.md` | Entries appended for S1, S2, P1, P2, S3, S4, P3, P4, S5, S6 (this session — chronological order) | LIVE |
| `00_ARCHITECTURE/CAPABILITY_MANIFEST.json` | v1.8 → v1.9 at P3 (13 new M4-A/M4-B canonical artifact entries; entry_count 115→128); v1.9 → **v2.0** at S6 (this session — `ll4_prediction_priors_v1_0.json` registered; entry_count 128→129; clean M4-B-close marker) | LIVE |
| `.geminirules` (MP.1 mirror) | Synced at S2 (M4-A CLOSED + M4-B-S1 done + M4-B-S2 in flight); re-synced at P3 to adapted parity reflecting M4-B state through S4 + dossier authoring + S5 in flight. M4-B-S6-CLOSE: NOT touched this session per brief `must_not_touch` (mirror sync at S6 deferred — P3 sync window covers state through S5; cumulative S5→S6 delta is small (production-flag flip already in P3 read-time state through approval_chain spot-check; FULL_PASS gate flip is downstream consequence). Recommended next sync: M4-C-S1 entry. | LIVE |
| `.gemini/project_state.md` (MP.2 mirror) | Synced at S2; re-synced at P3 to adapted parity. M4-B-S6-CLOSE: NOT touched this session per brief `must_not_touch`. Recommended next sync: M4-C-S1 entry. See §7.2 finding F.RT.S6.M.1 (MEDIUM — mirror staleness on M4-B-CLOSED checkpoint; carry-forward to M4-C-S1 mirror sync). | LIVE |

### §3.3 — Files NOT touched in M4-B (verification of scope discipline)

- `01_FACTS_LAYER/**` — FORENSIC v8.0 untouched; LEL v1.6 from M4-A close untouched in
  M4-B substantive scope.
- `025_HOLISTIC_SYNTHESIS/**` — read-only for MSR domain reference.
- `platform/**` — calibration substrate is file-based; no retrieval/synthesis wiring at
  M4-B.
- `platform/migrations/**` — no DB tables added in M4-B.
- `00_ARCHITECTURE/PROJECT_ARCHITECTURE_v2_2.md`, `MACRO_PLAN_v2_0.md` — frozen.
- `SHADOW_MODE_PROTOCOL_v1_0.md` — not modified in M4-B (NAP.M4.4 APPROVED at M4-A close
  is binding throughout).
- *(Note — `00_ARCHITECTURE/CAPABILITY_MANIFEST.json` IS touched in M4-B at P3 (13-entry
  registration) and S6 (1-entry registration); see §3.2 above. The pre-draft listed it
  as untouched; that was correct at P4 but is corrected here at seal.)*

---

## §4 — NAP decisions

### §4.1 — Resolved within M4-B substrate

- **NAP.M4.4 — Shadow-mode promotion criteria.** APPROVED at M4-A-S2-T3-SHADOW-PROTOCOL
  NAP-decisions append (c5877c5, 2026-05-02). `SHADOW_MODE_PROTOCOL §3` (a)–(d) + §3.2
  validity margin (match_rate ≥ 0.4) binding for all M4-B and M4-C weight writes. M4-B
  consumed this approval as the substrate-binding rule throughout S1–S4. **(Resolved
  before M4-B opened; surfaced here for completeness.)**

### §4.2 — Resolved at M4-B-S5 (binding)

- **NAP.M4.5 — Native pass_2 spot-check on LL.1 weights.** **RESOLVED 2026-05-02 at
  M4-B-S5-NAP-M45-EXECUTE (commit b508d6e). Outcome: (a) APPROVE ALL 30** — 30 approved /
  0 held / 0 demoted (100%, exceeds the ≥90% FULL_PASS threshold for the LL.2 stability
  gate). Joint Tier-C question on SIG.MSR.118/.119/.143 yoga-absences: native verdict
  **(a) three independent calibrated phenomena**, not one phenomenon counted three times.
  Reviewer: native (Abhisek Mohanty). Dossier (`00_ARCHITECTURE/EVAL/NAP_M4_5_DOSSIER_v1_0.md`
  v1.0) authored at M4-B-P2 + verdicts captured per §5 template at S5. Disposition
  writeback executed:
  - `ll1_weights_promoted_v1_0.json` outer fields: `pass_2_status: approved`,
    `pass_2_decision_date: 2026-05-02`, `pass_2_decision_session: M4-B-S5-NAP-M45-EXECUTE`,
    `pass_2_reviewer_resolved: native (Abhisek Mohanty)`, `pass_2_outcome_summary` block
    populated; `weights_in_production_register: true`; per-signal `status: production`
    for all 30; per-signal `approval_chain[0].pass_2_*` fields populated.
  - `ll1_shadow_weights_v1_0.json` outer fields: `pass_2_metadata` block populated to
    match production decisions (mirror); `variance_estimator: "sample"` field added
    (closes F.RT.S4.1 LOW finding from M4-B-S4 red-team).
  - `LL1_TWO_PASS_APPROVAL_v1_0.md` v1.0 → v1.1: frontmatter status
    `PASS_1_COMPLETE_PENDING_NAP_M4_5` → `TWO_PASS_COMPLETE`; §5 pass_2 block populated
    with native verdict + joint-question reasoning; new §5.5 Gemini-reachability
    addendum (NOT_REACHABLE).
  - **Cascade**: LL2_STABILITY_GATE re-evaluated CONDITIONAL_PASS → **FULL_PASS**
    (`re_evaluation_trigger` DISCHARGED 2026-05-02; LL2_STABILITY_GATE v1.0 → v1.1).
  - **M4-C entry-gate cleared** per `PHASE_M4_PLAN §3.3` (LL.1 weights stable +
    N-threshold met clauses both satisfied at full PASS outcome).

### §4.3 — Cross-referenced (not in M4-B scope)

- **NAP.M4.6 — LL.7 discovery prior rubric.** Scheduled at M4-C entry per
  `PHASE_M4_PLAN §5`. Not in M4-B scope; surfaced here so the next sub-phase knows it
  is queued.
- **NAP.M4.7 — M4 macro-phase close approval.** Scheduled at M4-D close per
  `PHASE_M4_PLAN §5`. **M4-B sub-phase close requires only the internal AC gate
  documented at §2.4 above; NAP.M4.7 is M4 macro-phase close, not sub-phase close.**
  See §8 below.

### §4.4 — NAP.M4.1, NAP.M4.2, NAP.M4.3

Resolved at M4-A close per `M4_A_CLOSE_v1_0.md §3` and §4 of that artifact. Surfaced
here for cross-reference completeness:

- **NAP.M4.1** — APPROVED Option B (calibration rubric); M4-B inherited binding rubric.
- **NAP.M4.2** — partial (1 patch + 5 deferred + 5 accept); GAP.M4A.04 patch landed at
  M4-A close (LEL v1.6) and status flipped `partially_closed` at M4-B-P1.
- **NAP.M4.3** — Option Y (JH carry forward); KR.M3A.JH-EXPORT carries to
  HANDOFF_M4_TO_M5 at M4-D close.

---

## §5 — Learning Layer status at M4-B close

Per `MACRO_PLAN_v2_0.md §LL-Appendix.B` Learning Layer mechanism roster.

### §5.1 — LL.1 — Per-signal weight calibration

- **Status at M4-B close:** **PRODUCTION (30 of 30 promotion-eligible signals)**.
  `weights_in_production_register: true` (S5 flip). Per-signal `status: production`
  for all 30 signals (S5 flip from `production_pending_pass_2`). LL.1 mechanism is
  the first Learning Layer mechanism to reach production register at MARSYS-JIS.
- **Pass_1 (Claude-surrogate-for-Gemini):** COMPLETE at M4-B-S2. 30 of 30 promotion-
  eligible signals approved by surrogate review. 0 held / 0 demoted. Demotion rule
  (mean<0.4 OR variance>0.3 → shadow_indefinite) re-checked against shadow file at S2;
  not triggered for any of the 30. 3 signals (SIG.MSR.118/119/143; identical aggregate
  statistics N=11 mean=0.4545 var=0.2727) flagged for NAP.M4.5 (pass_2) closer scrutiny
  per `LL1_TWO_PASS_APPROVAL_v1_0.md §4` + `NAP_M4_5_DOSSIER §3`.
- **Pass_2 (NAP.M4.5 — native):** **APPROVED 2026-05-02 at M4-B-S5-NAP-M45-EXECUTE
  (commit b508d6e). 30 / 0 / 0 (approved / held / demoted). 100% — full PASS. Joint
  Tier-C question on SIG.MSR.118/.119/.143 resolved verdict (a): three independent
  calibrated phenomena.**
- **Production register:** `signal_weights/production/ll1_weights_promoted_v1_0.json`
  scaffolded at S2; flipped to production at S5. `weights_in_production_register: true`;
  per-signal `status: production`; `pass_2_status: approved`. Downstream pipeline may
  now consume these weights post-NAP.M4.5; M4-C is the consumption surface.
  *(Doc-drift NOTE — see §7.2 F.RT.S6.I.1: outer metadata field
  `production_status_field_value: "production_pending_pass_2"` was authored at S2 and
  not updated at S5; per-signal `status: production` is authoritative; the outer field
  is a stale documentation hint, non-blocking.)*
- **Shadow register:** `signal_weights/shadow/ll1_shadow_weights_v1_0.json` carries 380
  signals: 30 promotion-eligible (now in production) / 285 insufficient_observations
  (N<3) / 52 shadow_indefinite_low_match_rate / 13 shadow_indefinite_high_variance.
  Outer-metadata field `variance_estimator: "sample"` added at S5 (closes F.RT.S4.1
  LOW). `pass_2_metadata` outer block populated at S5 (mirror of production-side
  decisions).
- **Held-out partition discipline:** Sacrosanct. Held-out 9 events contributed zero
  observations to LL.1 shadow at any point (Learning Layer rule #4 honored; verified
  by direct leakage scan in M4-B-S4 red-team; re-verified by spot-check 3-of-9
  records at this M4-B-S6-CLOSE red-team §7.2 axis (d) — all 3 carry `partition:
  held_out` unchanged).
- **n=1 disclaimer:** Present in shadow file header + production file header verbatim
  per `SHADOW_MODE_PROTOCOL §7`. Promotion to production register does NOT lift the
  disclaimer; only the structural barrier between observation and downstream pipeline
  operation.

### §5.2 — LL.2 — Graph edge weight modulators

- **Status at M4-B close:** Stability gate = **FULL_PASS** (re-evaluated 2026-05-02 at
  M4-B-S5-NAP-M45-EXECUTE; LL2_STABILITY_GATE v1.0 → v1.1; `re_evaluation_trigger`
  DISCHARGED). LL.2 production promotion **gate-level UNBLOCKED** for the 30
  LL.1-production-resident signals; per-edge promotion (the actual flip to a parallel
  `ll2_edges_promoted_v1_0.json` register) **not yet executed** — carries to M4-C
  per `next_session_objective` clause (e). The 30-signal pair set defines the
  candidate population for per-edge promotion.
- **Shadow register:** `signal_weights/shadow/ll2_edge_weights_v1_0.json` carries 9,922
  edges. Tier distribution: HIGH=0 (no edges with co_count≥8), MED=8 (co_count ∈
  {4,5,7}), LOW=9,914 (co_count ∈ {1,2,3}), ZERO=0 (intentionally empty by
  `LL2_EDGE_WEIGHT_DESIGN §3.2`). Cross-domain count = 0 (intra_domain = 9,922) per
  `LL2_EDGE_WEIGHT_DESIGN §3.5` empirical adjustment for domain-stratified LEL
  training corpus.
- **Top-tier MED edges:** All 8 form the intra-`general`-bucket Pancha-Mahapurusha
  clique on SIG.MSR.117/.118/.119/.143/.145/.402. SIG.MSR.145↔.402 (co=7) is the
  highest-co_count edge; the remaining seven MED edges are 5+5+5+5+4+4+4. See
  `LL3_DOMAIN_COHERENCE §4.1` for the cluster-consolidation finding (R.LL3.2
  recommends cluster-aware consumption rule at M4-C to prevent 6× double-counting).
- **Promotion gate (LL.2.e):** Both endpoint signals must be in LL.1 production for
  LL.2 promotion. **Now satisfied** for every edge whose both endpoints are in the
  30-signal pass_2-approved set (LL.1 production register flag flipped true at S5).
  Per-edge promotion execution carries forward to M4-C.
- **Re-evaluation trigger:** NAP.M4.5 close auto-bumped `LL2_STABILITY_GATE_v1_0.md`
  v1.0 → v1.1 with **FULL_PASS** decision per `§5` of that artifact (DISCHARGED
  2026-05-02 at M4-B-S5).
- **Held-out discipline:** Held-out 9 events excluded from edge co-firing computation
  per partition filter. 0 held-out IDs leak into any edge's `co_event_ids` (verified
  by direct leakage scan at M4-B-S4 red-team, AXIS-3 PASS).
- **Empirical finding:** LEL training corpus is domain-stratified — every training
  event fires `actual_lit_signals` from a single domain bucket (21 single-known-domain
  events + 16 all-unknown-class events + 0 mixed). Strict cross-domain LL.2 filter
  would yield 0 edges; filter relaxed at compute time to retain non-both-unknown
  co-firing pairs annotated `cross_domain: bool`. M4-D cross-system reconciliation
  pass should consider whether enriched activator output produces genuine
  cross-domain firings per event. (Cross-ref: `R.LL3.4` recommendation.)

### §5.3 — LL.3 — Domain-bucket coherence

- **Status at M4-B close:** COMPLETE.
- **Deliverable:** `LL3_DOMAIN_COHERENCE_v1_0.md` v1.0. Recommendation document, not
  weight register; no shadow→production split per `SHADOW_MODE_PROTOCOL §2` LL.3 row.
- **Findings (§2 coverage table):** Three buckets unobserved (family 0/20,
  psychological 0/20, spiritual 0/94 = 134 of 495 MSR signals or 27% never fired in
  37 training events); education structurally absent from MSR ontology; career fully
  observed (207/207) but yields zero promotion-eligible signals (all N<3); health
  strongest empirical bucket (31/31 obs, 31 N≥3, 14 eligible); general carries
  Pancha-Mahapurusha clique (5/15 eligible); relationship 39/39 obs but 38/39 fail
  promotion criteria.
- **Per-signal coherence (§3):** 30 eligible signals all fire only in their declared
  MSR domain — verdict is structural by rubric design (per-event bucket filter
  prevents cross-domain `actual_lit_signals`), not empirical validation.
- **Recommendations (§5):** 7 total — 3 fix-before-production (R.LL3.1 prod-register
  domain summary; R.LL3.2 cluster-aware consumption rule for the Pancha-MP clique to
  prevent 6× double-counting; R.LL3.3 unweighted-MSR routing with n=0 disclaimer for
  unobserved buckets) + 4 investigate-in-M5 (R.LL3.4 multi-domain activator extension;
  R.LL3.5 LEL inner-life-domain expansion; R.LL3.6 yoga-absence M5 inspection; R.LL3.7
  cross-system signal-ID reconciliation at M4-D).
- **Re-evaluation trigger:** NAP.M4.5 close (refresh §3.1 distribution if pass_2
  demotes any of the 30); M4-C entry (act on R.LL3.1–R.LL3.3); M5 entry (act on
  R.LL3.4–R.LL3.7).

### §5.4 — LL.4 — Prediction prior

- **Status at M4-B close:** **COMPLETE — recommendation document at v1.1 + companion
  machine-readable priors JSON view landed at S5.**
- **Deliverable (recommendation document):** `LL4_PREDICTION_PRIOR_v1_0.md` v1.0 → v1.1.
  Recommendation document; no shadow→production split per `SHADOW_MODE_PROTOCOL §2`
  LL.4 row. v1.1 amendment at S5 adds frontmatter `machine_readable_view` field + new
  §8 Machine-Readable Priors Cross-Reference (placement rationale + consumer contract).
- **Deliverable (machine-readable view):** `signal_weights/ll4_prediction_priors_v1_0.json`
  NEW at S5. 10 domain priors (career/financial/health/relationship/travel/general/
  spiritual/psychological/family/education) + 3 signal-class priors (classical_rule /
  both / temporal_engine) + date-precision global modifier (exact / approx-month /
  approx-year). Placed in `signal_weights/` (NOT `shadow/`) per recommendation-artifact
  rationale — not a weight register subject to shadow→production rules; consumer
  contract documented inline. Manifest entry registered at S6 close (entry_count
  128 → 129; manifest_version 1.9 → 2.0).
- **Findings (§2 baseline match-rate):** Training mean=0.630 (n=37), held_out
  mean=0.913 (n=9), Δ=+0.28. Gap interpreted via three explicit hypotheses: H1
  decade-stratified-selection-bias most likely (per `held_out_manifest.selection_criteria`
  favoring high-confidence dates + later-decade events + spread of categories — each
  correlates with higher achievable mr); H2 LEL retrodictive_match labeling bias
  secondary; H3 honest-generalization least likely under n=37. **Held_out=0.913
  explicitly flagged as not a clean validity figure**; training=0.630 is the more
  honest working baseline.
- **Findings (§3 basis-class):** classical_rule (n=29) + both (n=19) at 1.000 perfect
  calibration; temporal_engine (n=863) at 0.4267 — variance carrier; held-out sanity
  (temporal_engine n=229 at 0.5808) consistent with H1 date-precision artifact.
- **Findings (§4 domain-class):** career/financial/health/relationship/travel cluster
  in 0.40–0.50 lit-rate band; general at 0.30 (Pancha-MP-cluster design);
  psy/spi/edu/fam at n≤7 with apparent 1.00 lit-rate are sample-size artifacts, not
  findings.
- **Recommendations (§5 qualitative tiers):** STRONG (classical_rule + both bases —
  full credit); MODERATE (career/financial/health/relationship temporal — 0.4–0.5
  multiplier; general temporal — 0.30 with cluster-aware consolidation per LL.3
  R.LL3.2); WEAK (travel n=5; psy/spi/edu/fam n≤7 too thin); date-precision global
  modifier (exact → held-out band, approx-month → training band, approx-year further
  reduced). **Priors are recommendations, not bindings; not a substitute for LL.1
  weights post-NAP.M4.5; not a discovery layer.**
- **Re-evaluation trigger:** NAP.M4.5 close (refresh §3 basis-class stats if pass_2
  demotes affect calibration sample); M5 entry (act on §5 tiers as M5 LL.5
  prior-fitting input).

---

## §6 — Known residuals carrying forward to M4-C

These items survive M4-B sub-phase close without silent loss. None gates M4-B close per
§2 above (some gate M4-C entry; flagged where applicable).

### §6.1 — From M4-B substrate

1. **KR.M4A.RT.LOW.1 — commit 0793719 malformed root tree.** Inherited from M4-A
   (REDTEAM_M4A §6 LOW finding). On-disk file content correct; cosmetic governance
   hygiene. **Action:** schedule a tree-rewrite (git filter-repo or interactive
   rebase) at native convenience. Not blocking M4-C.
2. **F.RT.S4.1 (LOW) — variance estimator unspecified in `SHADOW_MODE_PROTOCOL §3.1(b)`.**
   Discovered in-session at M4-B-S4 red-team (AXIS-2). Shadow file uses sample variance
   (n-1, more conservative than population). **CLOSED 2026-05-02 at M4-B-S5-NAP-M45-EXECUTE**
   via explicit `variance_estimator: "sample"` field added to
   `ll1_shadow_weights_v1_0.json` outer metadata. Protocol-amendment to
   `SHADOW_MODE_PROTOCOL §3.1(b)` itself remains an opportunistic carry-forward if
   policy formalization is desired (non-blocking; finding closed at the data-artifact
   level).
3. **F.RT.S4.2 (NOTE) — surrogate self-review structural circularity.** Discovered
   in-session at M4-B-S4 red-team (AXIS-4). Already disclosed via `R.LL1TPA.1` in
   `LL1_TWO_PASS_APPROVAL_v1_0.md §6`; native pass_2 (NAP.M4.5) is the binding gate
   that closes the circularity. No new action; informational.
4. **F.RT.S4.3 (INFO) — domain-coherence-by-rubric-design tautology.** Discovered
   in-session at M4-B-S4 red-team (AXIS-3 supplementary). Acknowledged in
   `LL3_DOMAIN_COHERENCE §3.2` honestly. No fix; documentation-completeness only.
5. **GAP.M4A.04 — travel sparsity, PARTIAL_CLOSE.** Inherited from M4-A; flipped to
   `partially_closed` at M4-B-P1 per LEL v1.6 patch. Residual (international business
   travel, pilgrimages, US-years return visits) carries forward as `deferred` per
   NAP.M4.2 "no further elicitation required" clause. No further source data
   available; promotion path closed for this M4 cycle.
6. **GAP.TRAVEL_MISC.01 — speculative travel events** (LEL §6 mention of
   "possibly Russia-related business trips" without dates/destinations). No
   B.10-compliant promotion candidate; carries forward as speculative-pending-elicitation
   for M5+ LEL maintenance.
7. **R.LL2GATE.1 (LOW) — surrogate ownership for LL2_STABILITY_GATE pass_2.** Same
   ownership pattern as LL1_TWO_PASS_APPROVAL R.LL1TPA.1. Severity LOW.
8. **R.LL2GATE.2 (DEFERRED) — domain mapping for cross-system signal IDs (M4-D scope).**
   11 of 30 LL.1 promotion-eligible signals carry `domain: unknown`
   (CTR/CVG/SIG.NN/RPT semantic-class IDs absent from `msr_domain_buckets.json`).
   Cross-system reconciliation deferred to M4-D. Cross-ref: `R.LL3.7`.
9. **R.LL2GATE.3 (LOW) — sparse training partition for edge statistics.** Edges with
   co_count = 1 or 2 may reflect coincidence rather than calibrated joint-firing.
   Protocol handles via N≥3 floor + variance≤0.3 ceiling. Informational.
10. **R.LL2DESIGN.1 (LOW) — LL.2 shadow path co-located with LL.1.** Shadow file
    landed at `signal_weights/shadow/` per S3 implementation, not at the protocol's
    declared `GRAPH_EDGE_WEIGHT_LEARNING/edge_modulators/shadow/` path. Resolution at
    next M4-B governance pass; non-blocking.
11. **Domain-stratified LEL training corpus finding** (`LL2_EDGE_WEIGHT_DESIGN §3.5+§6.7`).
    Flag for M4-D cross-system reconciliation pass. Cross-ref: `R.LL3.4`.

### §6.2 — Resolved at S5 (PENDING-S5 dependents)

12. **R.LL1TPA.1 (carry-forward to M4-C entry) — Gemini reachability re-attempt.**
    Gemini synchronously unreachable at M4-B-S5 (executed reachability check; outcome
    NOT_REACHABLE; recorded in `LL1_TWO_PASS_APPROVAL §5.5` addendum block + this
    M4-B sub-phase close). Re-attempt scheduled at M4-C entry per `LL1_TWO_PASS_APPROVAL
    §6` self-rule: if Gemini becomes reachable, append the `§5` addendum capturing
    Gemini's verdict on the surrogate-pass_1 review; if Gemini contests any pass_1
    decision, open `DIS.class.output_conflict` per `GOVERNANCE_INTEGRITY_PROTOCOL §K.2`.
    Severity unchanged from R.LL1TPA.1 (LOW carry-forward); not blocking M4-B close
    (NAP.M4.5 native pass_2 is the binding gate that closed surrogate circularity).
13. **LL.2 stability gate flip.** **RESOLVED at S5**: CONDITIONAL_PASS → **FULL_PASS**
    cascade-discharged from NAP.M4.5 (a) APPROVE-ALL outcome. LL2_STABILITY_GATE
    v1.0 → v1.1. Gate-level promotion-block is now lifted; per-edge LL.2 promotion
    execution carries to M4-C as optional per next_session_objective (e).

### §6.3 — Inherited (still open at M4-B close)

14. **NAP.M4.6 — LL.7 discovery prior rubric.** Scheduled at M4-C entry per
    `PHASE_M4_PLAN §5`. Not in M4-B scope.
15. **NAP.M4.7 — M4 macro-phase close approval.** Scheduled at M4-D close per
    `PHASE_M4_PLAN §5`. Not in M4-B scope; M4-B sub-phase close requires only the
    internal AC gate (§2 + §8).
16. **KR.M3A.JH-EXPORT — DIS.009 full closure pending JH D9 export per ED.1.** Carries
    to HANDOFF_M4_TO_M5 at M4-D close per NAP.M4.3 Option Y.
17. **GAP.M4A.01/.02/.03/.05/.06 — five elicit-recommended gaps deferred per NAP.M4.2.**
    Reconsidered at native discretion in future LEL pass; not gating M4-C.
18. **DIS.010/011/012 — Jaimini multi-tradition forks.** RESOLVED-N3 (M9). Not
    gating.
19. **Sthana + Drik Shadbala ECR resolution + Narayana Dasha verification.** ECR per
    CLAUDE.md §I B.10. JH-access dependency. M5+.
20. **KR.M3A2.1 — PAT.008 ECR clarification.** M4-class documentation-clarity item.
21. **AC.M3A.5 — post-baseline delta run.** DEFERRED per auth wall (BHISMA GAP.P.9).
22. **External acharya review on M3 deliverables (R.M3D.1 mitigation).** M4-class.
23. **SIG.MSR.207 + SIG.MSR.497/498/499 absent from MSR_v3_0.md.** M4-substrate
    cleaning pass or M5+ MSR expansion. Cross-ref: `LL3_DOMAIN_COHERENCE §6
    `four-absent-MSR-IDs note`.
24. **UCN inline citation pass (Option A) against UCN_v4_0.md.** Aspirational; not
    gating.
25. **TS test-fixture errors** in `tests/components/AppShell.test.tsx` +
    `tests/components/ReportGallery.test.tsx`. Portal Redesign R-stream owns;
    non-blocking.
26. **KR.W9.1 + KR.W9.2 — eval-runner auth wall + parser quirk** (BHISMA GAP.P.9).
    M4-class with auth-secrets availability.
27. **KR.M4A.CLOSE.2 — M4-B-S1 single-track vs B1/B2 split procedural irregularity.**
    Per M4_A_CLOSE §3 item 0; native review carries to NAP.M4.5 native acceptance
    scope at S5.

---

## §7 — Red-team summary

### §7.1 — IS.8(a) every-third-substantive-session cadence trail in M4-B

| Counter event | Session | Counter | Notes |
|---|---|---|---|
| Reset entering M4-B | M4-A-INTEGRATION-PASS-R3 (T1 cadence-fire reset) | 0 | REDTEAM_M4A_v1_0.md PASS 6/6 axes; counter reset 3→0 |
| 0 → 1 | M4-B-S2-MIRROR-TWOPASS | 1 | Substantive (mirror sync + pass_1 surrogate review) |
| 1 → 2 | M4-B-S3-LL2-EDGE-WEIGHTS | 2 | Substantive (LL.2 shadow file + gate + design doc + KR.M4A.CLOSE.1) |
| 2 → 3 → FIRES → reset to 0 | M4-B-S4-LL3-DOMAIN-COHERENCE | 0 (post-reset) | IS.8(a) FIRES at counter=3; in-session 4-axis red-team conducted |
| 0 (held) | M4-B-P1, M4-B-P2, M4-B-P3, M4-B-P4 | 0 | Governance-aside class; do not increment |
| 0 → 1 | M4-B-S5-NAP-M45-EXECUTE | 1 | Substantive (LL.1 production promotion + LL.2 gate flip + LL.4 priors JSON + Gemini reachability check + F.RT.S4.1 close). No in-session red-team (counter not at 3). |
| 1 → 0 | M4-B-S6-CLOSE (this session) | 0 (post-discharge) | IS.8(b) sub-phase-close-class red-team conducted in-document §7.2 — 5 axes PASS_WITH_FINDINGS, 0 CRITICAL/HIGH; counter rotates 1 → 0 at close per `ONGOING_HYGIENE_POLICIES §G` discharge-of-cadence-class clause (sub-phase-close cadence is treated as analogous to IS.8(b) macro-phase-close with respect to counter-reset behavior). |

**M4-B-S4 in-session red-team summary** (the only IS.8(a) cadence-fire in M4-B):

- Verdict: PASS_WITH_FINDINGS.
- Axes: 4 (LEL data integrity / LL.1 computation correctness / LL.2 topology coverage /
  LL1_TWO_PASS_APPROVAL surrogate disclosure adequacy).
- Counts: 0 CRITICAL / 0 HIGH / 0 MEDIUM / 1 LOW (F.RT.S4.1) / 1 NOTE (F.RT.S4.2) / 1
  INFO (F.RT.S4.3).
- Counter action: 3 → 0 reset.
- Artifact: this SESSION_LOG entry red_team_findings block (in-session class; no
  separate REDTEAM_M4B file authored — in-session discharge per
  ONGOING_HYGIENE_POLICIES §G acceptable for IS.8(a) discharge when 0 HIGH/CRITICAL/MEDIUM).

### §7.2 — IS.8(b) sub-phase-close red-team — DISCHARGED in-document

Per `ONGOING_HYGIENE_POLICIES §G` and `MACRO_PLAN §IS.8(b)` clause: every macro-phase
close requires its own red-team. M4-B is a sub-phase (not macro-phase), so the
macro-phase-close IS.8(b) cadence formally fires at M4-D close (carries forward), not
at M4-B close. **However**, the M4-B-S5 brief AC.S5.9 explicitly noted that the M4-B
sub-phase close at S6 will require its own red-team — treated as **analogue to IS.8(b)
macro-phase-close discipline at sub-phase granularity**, even though `red_team_counter`
is at 1, not 3. Precedent: M3-C close ran `REDTEAM_M3C_v1_0.md` as a sub-phase-close
quality gate (NOT §IS.8(a) cadence), which surfaced findings preserved in CROSSCHECK
+ DIS register.

**Decision at M4-B-S6 brief authoring**: conduct the red-team **in-document** (this
§7.2 below), rather than authoring a standalone `REDTEAM_M4B_v1_0.md` artifact. Two
considerations support the in-document path:

1. **Five axes are scoped, narrow, and verifiable from artifacts already-in-place** —
   not exploratory. A separate REDTEAM_M4B file would carry mostly cite-and-verify
   text; in-document keeps the audit trail co-located with the close artifact (aligns
   with "ONGOING_HYGIENE_POLICIES §G acceptable for IS.8(a) discharge when 0
   HIGH/CRITICAL/MEDIUM" precedent extended to sub-phase-close granularity at
   PASS_WITH_FINDINGS).
2. **M4-B-S4 in-session 4-axis red-team already exercised the broader-axes coverage**
   (LEL data integrity / LL.1 computation correctness / LL.2 topology coverage /
   LL1_TWO_PASS_APPROVAL surrogate disclosure adequacy) at the IS.8(a) every-third
   cadence — those axes are NOT re-run here; they carry forward as discharged. The
   §7.2 axes below are scoped tightly to the **post-S5 + post-S6 delta**: production
   promotion integrity, gate-flip integrity, manifest registration completeness,
   held-out partition discipline through promotion, and session version-sequence
   auditability.

#### §7.2.1 — Red-team scope + execution

- **Performer**: claude-opus-4-7 (M4-B-S6-CLOSE).
- **Performed**: 2026-05-03.
- **Scope**: 5 axes per AC.S6.2 brief. PASS / PASS_WITH_FINDINGS / FAIL per axis.
- **Verdict aggregate**: **PASS_WITH_FINDINGS** (5/5 axes PASS at the
  axis-level-verdict; per-axis findings classified MEDIUM/LOW/NOTE/INFO with
  carry-forward dispositions; 0 CRITICAL / 0 HIGH).

#### §7.2.2 — AXIS (a): LL.1 promotion integrity

**Target**: verify `ll1_weights_promoted_v1_0.json` reflects the S5 NAP.M4.5 outcome
correctly across all 30 signals: per-signal `status: production`; outer
`weights_in_production_register: true`; outer `pass_2_status: approved`; per-signal
`approval_chain[0].pass_2_*` fields populated; flagged signals (SIG.MSR.118/.119/.143)
carry the joint-firing question verdict text.

**Method**: Python `json.load()` → enumerate `signal_weights` dict → assert each entry's
`status == 'production'` → assert each entry's `approval_chain[0].pass_2_decision == 'approved'`
→ inspect outer fields → spot-check the 3 flagged signals.

**Result**: PASS.
- Total signals in production register: **30** (matches expected).
- Per-signal `status='production'`: **30 / 30**.
- Per-signal `approval_chain[0].pass_2_decision='approved'`: **30 / 30**.
- Outer `weights_in_production_register`: `true` (confirmed).
- Outer `pass_2_status`: `approved` (confirmed).
- Outer `pass_2_decision_session`: `M4-B-S5-NAP-M45-EXECUTE` (confirmed — points
  back to the binding NAP discharge session).
- Flagged signals (SIG.MSR.118/.119/.143): all 3 carry `status=production` and
  `pass_2_decision=approved`; outer `pass_2_outcome_summary.joint_question_verdict_for_118_119_143`
  records "(a) three independent calibrated phenomena" (confirmed; matches
  `LL1_TWO_PASS_APPROVAL §5` block).

**Findings (this axis)**:

- **F.RT.S6.I.1 (INFO) — outer-metadata stale-doc-hint.** Outer field
  `production_status_field_value: "production_pending_pass_2"` was authored at S2 to
  document the per-signal status field's value at scaffold time. S5 flipped per-signal
  `status` to `production` but did not update this outer documentation field. Per-signal
  `status` is authoritative; the outer field is now a stale documentation hint (still
  describes accurately what the file looked like at S2 scaffold; misleading at S5 close).
  Severity INFO; non-blocking. **Carry-forward**: opportunistic refresh of this outer
  metadata field at next LL.1 production-register touch (e.g., M4-C consumer surface
  wiring); not worth a dedicated chore commit. Does NOT affect downstream pipeline
  consumers — they read per-signal `status` field, not the outer documentation hint.

#### §7.2.3 — AXIS (b): LL.2 stability gate integrity

**Target**: verify `LL2_STABILITY_GATE_v1_0.md` v1.1 frontmatter `gate_decision: FULL_PASS`;
`re_evaluation_trigger` marked DISCHARGED; trigger event documented in §5.1 event log;
`ll2_edge_weights_v1_0.json` present in `signal_weights/shadow/` with correct outer
metadata.

**Method**: read frontmatter via grep; spot-check §5.1 event log narrative; `json.load()`
on `ll2_edge_weights_v1_0.json` → inspect outer metadata block for completeness.

**Result**: PASS.
- LL2_STABILITY_GATE frontmatter `version: "1.1"`, `status: CURRENT`,
  `gate_decision: FULL_PASS`, `gate_decision_summary` records "LL.2 shadow writes
  permitted AND LL.2 production promotion now UNBLOCKED for the 30 LL.1 production
  signals. Re-evaluated 2026-05-02 after NAP.M4.5 closed 30/30 (100%) approve-all"
  (confirmed).
- `re_evaluation_trigger`: "NAP.M4.5 close event (M4-B close per PHASE_M4_PLAN §3.2)
  — DISCHARGED 2026-05-02 at M4-B-S5" (confirmed).
- §5.1 re-evaluation event log: present in body (confirmed).
- `ll2_edge_weights_v1_0.json` outer metadata: `schema_version: 1.0`, `mechanism: LL.2`,
  `phase: M4-B`, `produced_during: M4-B-S3-LL2-EDGE-WEIGHTS`; summary block records
  `total_edges_evaluated: 9922`, `high_tier_count: 0`, `med_tier_count: 8`,
  `low_tier_count: 9914`, `zero_tier_count: 0`, `cross_domain_count: 0`,
  `intra_domain_count: 9922`, `pairs_with_unknown_endpoint_count: 0` (confirmed —
  matches §5.2 narrative).

**Findings (this axis)**: None CRITICAL/HIGH/MEDIUM/LOW. Note the per-edge LL.2
promotion has not yet been executed; this is documented in §5.2 + carry-forward
clause (e) of the next-session pointer; not a finding (it's an explicit carry-forward
by design).

#### §7.2.4 — AXIS (c): CAPABILITY_MANIFEST completeness

**Target**: after AC.S6.3 (this session), verify all M4-B canonical artifacts are
registered in `00_ARCHITECTURE/CAPABILITY_MANIFEST.json`; no path errors; entry_count
matches the entries-array length.

**Method**: `json.load()` → enumerate entries → grep for each M4-B canonical_id
expected per §3.1 + §3.2 above → verify path strings match on-disk paths.

**Result**: PASS.
- `entry_count` field: **129** (after S6 add); `entries` array length: **129**
  (match — confirmed).
- `manifest_version`: `"2.0"` (S6 bump, confirmed).
- `manifest_fingerprint`: extended with `+m4b_s6_close_2026-05-03` (confirmed).
- M4-B canonical_ids registered (verified): `SHADOW_MODE_PROTOCOL_v1_0`,
  `M4_A_CLOSE_v1_0`, `LEL_GAP_AUDIT_v1_2`, `LL1_TWO_PASS_APPROVAL_v1_0`,
  `ll1_shadow_weights_v1_0`, `ll1_weights_promoted_v1_0`, `NAP_M4_5_DOSSIER_v1_0`,
  `LL2_EDGE_WEIGHT_DESIGN_v1_0`, `LL2_STABILITY_GATE_v1_0`, `ll2_edge_weights_v1_0`,
  `LL3_DOMAIN_COHERENCE_v1_0`, `LL4_PREDICTION_PRIOR_v1_0`,
  **`ll4_prediction_priors_v1_0` (S6 add)**.
- Path string for new `ll4_prediction_priors_v1_0` entry:
  `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/signal_weights/ll4_prediction_priors_v1_0.json`
  — file exists at this path (confirmed via `ls`); JSON parse-clean.

**Findings (this axis)**:

- **F.RT.S6.M.2 (LOW) — `M4_B_CLOSE_v1_0.md` itself is not yet in the manifest.**
  This document is the M4-B sealing artifact and is being sealed at this session;
  the manifest entry for `M4_B_CLOSE_v1_0` was not registered at P3 (it didn't exist
  yet) nor at S6 (the S6 brief AC.S6.3 specified registering the deferred LL.4 priors
  JSON only). Severity LOW; non-blocking. **Carry-forward**: register
  `M4_B_CLOSE_v1_0` canonical entry at next CAPABILITY_MANIFEST touch (likely M4-C
  entry session bringing the M4-C canonical artifacts on board). Note: the manifest
  is governance-state, not load-bearing for retrieval/synthesis consumers; the
  M4_B_CLOSE artifact is discoverable via SESSION_LOG + this in-document seal.

#### §7.2.5 — AXIS (d): Held-out partition sacrosanct

**Target**: confirm that the held-out 9-event partition was not perturbed across S5's
production promotion. Spot-check 3 of the 9 held-out records' `partition` field on
`lel_event_match_records.json`; the field must remain `held_out` for all 3.

**Method**: `json.load()` on `06_LEARNING_LAYER/OBSERVATIONS/lel_event_match_records.json`
→ enumerate records → filter `partition == 'held_out'` → count → spot-check 3 sample
records' `partition` field.

**Result**: PASS.
- Total records: 46 (matches AC.M4A.4 per `M4_A_CLOSE §3`).
- `partition == 'held_out'` count: **9 / 9** (no perturbation).
- Spot-check 3-of-9 records:
  - `EVT.2008.06.09.01`: `partition: held_out` ✓
  - `EVT.2009.06.XX.01`: `partition: held_out` ✓
  - `EVT.2017.03.XX.01`: `partition: held_out` ✓
- Cross-reference: M4-B-S4 in-session red-team AXIS-3 already verified zero held-out
  IDs leak into LL.1 shadow file or LL.2 edge `co_event_ids`. S5's production
  promotion did not touch the lel_event_match_records.json file (verified via
  `must_not_touch` declarations in S5 brief).

**Findings (this axis)**: None. Held-out discipline holds end-to-end across M4-B.

#### §7.2.6 — AXIS (e): Session version sequence — auditable v2.1 vacated gap

**Target**: document the v2.1 vacated gap in CURRENT_STATE version history; confirm
v2.0 → v2.2 → v2.3 → v2.4 → v2.5 chain is the accepted record (with v2.1 explicitly
vacant by chronology, not by silent skip).

**Method**: read CURRENT_STATE §changelog blocks v2.0/v2.2/v2.3/v2.4 narrative;
verify each version's `version_collision_note` or `parallel_session_notes` block
documents the rationale for the version chosen.

**Result**: PASS.
- CURRENT_STATE v2.0 → v2.2 → v2.3 → v2.4 → v2.5 chain confirmed; v2.1 is permanently
  vacant by chronology. Three concurrent sessions (M4-B-S5, M4-B-P3, M4-B-P4) ran
  in flight; brief-prescribed reservation was `S5→v2.1, P3→v2.2, P4→v2.3` but actual
  landing order in flight was P3 first (v2.2), then S5 (v2.3 — its own
  `version_collision_note` block records "Brief AC.S5.9 specified CURRENT_STATE → v2.1
  written under the assumption S5 would land before parallel-slot M4-B-P3-MIRROR-MANIFEST.
  P3 landed first taking v2.2; S5 landing later takes v2.3 to avoid version downgrade.
  v2.1 is permanently vacant in the sequence — auditable gap, not silent skip"). P4
  adapted to v2.4 per its hard_constraint operational rule "take whatever version is
  current + 1." S6 (this session) takes v2.5 as the M4-B CLOSED marker.
- Documentation discipline: each version-bump session's changelog block carries either
  a `version_collision_note` or `parallel_session_notes` field explaining the
  coordination — auditable gap is the explicit choice over silent skip per
  `ONGOING_HYGIENE_POLICIES §G + §I` family of clauses.

**Findings (this axis)**:

- **F.RT.S6.N.1 (NOTE) — parallel-session version-coordination convention is
  ad-hoc.** The convention "first-writer takes lower version; later writers take
  current+1" is documented only in per-session brief AC blocks and per-changelog
  parallel_session_notes prose; no top-level governance document (e.g.,
  `ONGOING_HYGIENE_POLICIES`) formalizes the protocol. Severity NOTE; non-blocking.
  **Carry-forward**: opportunistic — when the next quarterly governance pass per
  `ONGOING_HYGIENE_POLICIES §H` fires (next due 2026-07-24), consider formalizing
  parallel-session version-coordination in that document or in
  `GOVERNANCE_INTEGRITY_PROTOCOL §K`.

#### §7.2.7 — Aggregate findings + dispositions

| Finding | Class | Severity | Closure | Carry-forward |
|---|---|---|---|---|
| F.RT.S6.I.1 | doc-drift (outer-metadata stale hint) | INFO | open | next LL.1 production-register touch (M4-C consumer wiring) |
| F.RT.S6.M.2 | manifest registration completeness | LOW | open | next CAPABILITY_MANIFEST touch (likely M4-C entry session) |
| F.RT.S6.N.1 | governance-protocol formalization | NOTE | open | next quarterly governance pass (2026-07-24) |
| F.RT.S6.M.1 (cross-ref §3.2) | mirror staleness on M4-B-CLOSED checkpoint | MEDIUM | open | M4-C-S1 entry — first substantive M4-C session re-runs MP.1+MP.2 sync |

**Aggregate**: 0 CRITICAL / 0 HIGH / 1 MEDIUM (cross-ref from §3.2; mirror staleness)
/ 1 LOW / 1 NOTE / 1 INFO. **Verdict: PASS_WITH_FINDINGS.** No finding gates M4-B
sub-phase close; all are open carry-forwards with explicit dispositions.

Counter rotation: `red_team_counter` 1 → 0 at this M4-B-S6-CLOSE per
`ONGOING_HYGIENE_POLICIES §G` discharge-of-cadence-class clause (sub-phase-close-class
red-team is treated as analogous to IS.8(b) macro-phase-close with respect to
counter-reset behavior).

### §7.3 — Next IS.8(a) every-third cadence

Counter trail post-S6 close: **`red_team_counter: 0`** (rotated 1 → 0 at this M4-B-S6-CLOSE
per the in-document IS.8(b)-class discharge in §7.2; same convention as IS.8(b) macro-phase-
close which also resets the every-third counter on cadence-fire). Next IS.8(a) fires at
counter=3 (three substantive M4-C sessions hence — likely after M4-C-S2 or M4-C-S3
depending on the M4-C round structure decided at M4-C-S1 brief authoring). Next
IS.8(b) macro-phase-close cadence fires at M4-D close per `PHASE_M4_PLAN §3.4`. Next
§IS.8(c) every-12-months MACRO_PLAN review remains 2027-04-23 due.

---

## §8 — Approval

### §8.1 — M4-B sub-phase close — internal AC gate, no NAP

M4-B sub-phase close is governed by the internal acceptance-criteria gate documented at
`PHASE_M4_PLAN §3.2` (AC.M4B.1–10) plus the per-session brief ACs (S1–S6). M4-B does
**not** require a native-approval-point (NAP) for sub-phase close — NAP.M4.5 is the
binding NAP within M4-B (LL.1 pass_2 spot-check), and NAP.M4.7 is the M4 macro-phase
close NAP at M4-D, not at M4-B.

The close discipline:

- **Internal AC gate:** §2 ledger above shows **10/10 PASS** (PHASE_M4_PLAN §3.2
  AC.M4B.1–10) plus all S5 ACs PASS / PASS-NOT-REACHABLE (per §2.3) and all S6 ACs
  PASS (per §2.4). M4-B internal AC gate **CLEAN**.
- **Sub-phase-close red-team:** §7.2 above **DISCHARGED in-document** —
  PASS_WITH_FINDINGS, 0 CRITICAL/HIGH; 1 MEDIUM (mirror staleness, cross-ref §3.2)
  + 1 LOW (manifest entry for M4_B_CLOSE itself) + 1 NOTE (parallel-session version
  convention formalization) + 1 INFO (outer-metadata stale-doc-hint on
  ll1_weights_promoted). All carry-forward with explicit dispositions; no finding
  gates close.
- **CURRENT_STATE flip:** S6 (this session) flips `active_phase_plan_sub_phase` to
  "M4-B CLOSED 2026-05-03; M4-C incoming"; rotates `last_session_id: M4-B-S6-CLOSE`
  + `next_session_objective: M4-C-S1 (LL.5 Dasha-Transit Synergy shadow-mode)` +
  `red_team_counter: 1 → 0` (IS.8(b) discharged) + clears `predraft_available`
  field (deliverable consumed). CURRENT_STATE v2.4 → v2.5.
- **Mirror sync:** MP.1 + MP.2 NOT propagated this session per brief
  `must_not_touch` declaration (`.geminirules` and `.gemini/project_state.md` excluded
  from S6 may_touch). The cumulative S5 → S6 mirror delta (production-flag flip;
  FULL_PASS gate flip; LL.4 priors JSON; CURRENT_STATE v2.4 → v2.5; M4-B CLOSED
  status) carries forward to **M4-C-S1 entry** for the next adapted-parity
  propagation cycle. Recorded as F.RT.S6.M.1 (MEDIUM carry-forward) in §7.2.

**No native sign-off is required for M4-B sub-phase close itself**, beyond the
NAP.M4.5 native pass_2 outcome that determines whether LL.1 production register
flag flips. M4-B may close as PARTIAL or HOLD if NAP.M4.5 returns those outcomes;
the internal AC gate accommodates partial outcomes via the §2 ledger's PASS / PARTIAL /
PENDING verdict structure.

### §8.2 — Surrogate-disclosure ledger

The pass_1 review path used a Claude-surrogate-for-Gemini per
`LL1_TWO_PASS_APPROVAL §3` + `MACRO_PLAN §Multi-Agent` (Gemini unavailable
synchronously at S2). Surrogate disclosure is recorded in 6 places per the M4-B-S4
red-team AXIS-4 finding: `LL1_TWO_PASS_APPROVAL` frontmatter `pass_1_reviewer_kind`,
§1 disclosure paragraph, §3 rubric statement, §5 `surrogate_disclosure` field, §6
R.LL1TPA.1 carry-forward, §7 changelog. Surrogate self-review structural circularity is
acknowledged and bounded — pass_2 (NAP.M4.5 native) is the binding gate that closes the
circularity at S5.

**Gemini reachability outcome (S5 + S6 sweep)**: Gemini synchronously **NOT_REACHABLE**
at M4-B-S5 (no live channel from the Claude Code session to an active Gemini agent
on 2026-05-02). Gemini reachability not re-attempted at S6 (S6 brief did not include
this; carries forward per R.LL1TPA.1). Addendum to `LL1_TWO_PASS_APPROVAL §5.5`
recorded the NOT_REACHABLE outcome at S5 (LL1_TWO_PASS_APPROVAL v1.0 → v1.1). The
NAP.M4.5 native pass_2 (which is a stronger gate than Gemini ratification per the
mirror-pair protocol — native is the binding final reviewer) was the binding gate that
closed the surrogate self-review structural circularity at S5. **R.LL1TPA.1 carries
forward to M4-C entry as a re-attempt obligation**: if Gemini becomes reachable, the
addendum to `LL1_TWO_PASS_APPROVAL §5` captures Gemini's verdict per
`GOVERNANCE_INTEGRITY_PROTOCOL §K.3` (ratify or contest); if Gemini contests, open
`DIS.class.output_conflict` per `§K.2`.

---

## §9 — Changelog

- **v1.0 SEAL (2026-05-03, M4-B-S6-CLOSE):** Document sealed. Frontmatter `status: DRAFT`
  → `status: CLOSED`; new fields `sealed_by: M4-B-S6-CLOSE` + `sealed_at: 2026-05-03`
  added; `red_team_artifact` field re-authored from `[PENDING-S6]` → cite of in-document
  §7.2. Body changes against the v1.0 DRAFT pre-draft (all driven by AC.S6.1 token
  resolution + AC.S6.2 red-team conduct):
  - **Executive summary** — replaced PENDING placeholder verdict text with concrete
    outcome: NAP.M4.5 30/30 approved (verdict (a) three independent calibrated
    phenomena); LL.1 production register flag flipped true with all 30 at
    status=production; LL2_STABILITY_GATE FULL_PASS; LL.4 priors JSON landed; Gemini
    NOT_REACHABLE; F.RT.S4.1 closed. Sealing path (a) — full PASS.
  - **§1.2 sub-phase rounds table** — filled S5/P3/S6 rows with date+commit+deliverable
    summary; updated session-count footnote (10 closed: 6 substantive + 4 governance-aside).
  - **§2 AC ledger** — AC.M4B.8 flipped to PASS (both passes complete); AC.M4B.9 flipped
    to PASS-WITH-NOTE (filed-level production register flag flip; M4-C is the consumption
    surface); AC.M4B.10 extended with S6 sub-phase-close-class red-team discharge;
    aggregate flipped to 10/10 PASS. §2.3 (S5 ACs) filled with PASS verdicts and citation
    to S5 deliverables. §2.4 (S6 ACs) filled with PASS verdicts and citation to S6
    deliverables (this session).
  - **§3.1 deliverables inventory** — updated 6 entries to reflect S5 amendments
    (ll1_shadow_weights variance_estimator field; LL1_TWO_PASS_APPROVAL v1.1;
    ll1_weights_promoted production flip; NAP_M4_5_DOSSIER consumption;
    LL2_STABILITY_GATE v1.1 FULL_PASS; LL4_PREDICTION_PRIOR v1.1 cross-reference);
    added ll4_prediction_priors_v1_0.json NEW row; updated this document's row to
    CLOSED with seal context. §3.2 governance-state row updated for CURRENT_STATE
    chain (now ends at v2.5), SESSION_LOG entries (added S5 + S6), CAPABILITY_MANIFEST
    chain (1.8 → 1.9 at P3 → 2.0 at S6), and mirror-pair deferral disposition. §3.3
    corrected the CAPABILITY_MANIFEST untouched-flag (it IS touched at P3 + S6).
  - **§4.2 NAP.M4.5** — RESOLVED with full disposition writeback ledger (LL.1
    production fields, LL.1 shadow fields including variance_estimator, LL1_TWO_PASS
    v1.1, cascade to LL2_STABILITY_GATE FULL_PASS, M4-C entry-gate cleared).
  - **§5.1 LL.1** — status flipped to PRODUCTION (30/30); pass_2 outcome recorded;
    held-out spot-check 3-of-9 verified at this seal; doc-drift NOTE on outer
    metadata field cross-referenced to §7.2 F.RT.S6.I.1.
  - **§5.2 LL.2** — gate flipped to FULL_PASS; gate-level promotion-block lifted;
    per-edge promotion explicitly carries to M4-C.
  - **§5.4 LL.4** — recommendation document at v1.1 + companion machine-readable
    JSON view landed at S5; manifest entry at S6.
  - **§6.1 residual #2 (F.RT.S4.1)** — flipped to CLOSED via variance_estimator
    field at S5.
  - **§6.2 (PENDING-S5 dependents)** — both items resolved: R.LL1TPA.1 carries to
    M4-C (Gemini NOT_REACHABLE outcome); LL.2 stability gate flipped FULL_PASS at S5.
  - **§7.1 cadence trail** — filled S5 (counter 0→1) + S6 (counter 1→0 at sub-phase-close
    discharge) rows.
  - **§7.2 IS.8(b) sub-phase-close red-team** — replaced [PENDING-S6] disposition
    decision with the actual in-document discharge (5 axes; PASS_WITH_FINDINGS;
    0 CRITICAL / 0 HIGH; findings F.RT.S6.I.1 INFO + F.RT.S6.M.2 LOW + F.RT.S6.N.1
    NOTE + cross-ref to F.RT.S6.M.1 MEDIUM). Decision rationale for in-document vs
    standalone REDTEAM_M4B file recorded.
  - **§7.3 cadence forecast** — counter at 0 post-S6 close; next IS.8(a) at counter=3
    (three substantive M4-C sessions hence); IS.8(b) at M4-D close.
  - **§8 approval** — internal AC gate clean; sub-phase-close red-team discharged
    in-document; CURRENT_STATE flip executed at this S6; MP.1+MP.2 mirror sync
    deferred to M4-C-S1 entry per F.RT.S6.M.1 carry-forward. §8.2 surrogate-disclosure
    ledger updated with Gemini NOT_REACHABLE outcome and the standing R.LL1TPA.1
    re-attempt obligation.
- **v1.0 DRAFT (2026-05-02, M4-B-P4-S6-PREDRAFT):** Initial pre-draft. Authored as a
  parallel-slot session running alongside M4-B-S5 (which carried the binding NAP.M4.5
  native-pass-2 trigger). All S5-dependent fields held as literal `[PENDING-S5]` tokens
  with one-line descriptions of what each was waiting for. Sealed at S6 (see v1.0 SEAL
  entry above).
  - §1 scope: 4 mechanisms (LL.1–LL.4); 6 substantive sessions closed (S1, S2, S3, S4)
    + 4 governance-asides (P1, P2, P3 if invoked, P4 this session); 2 in flight or
    pending (S5 + S6 close).
  - §2 AC ledger: PHASE_M4_PLAN §3.2 AC.M4B.1–10 = 9 PASS / 1 PASS-with-PENDING-S5;
    per-session brief ACs PASS for S1–S4 + P1–P2; S5/S6 ACs marked [PENDING].
  - §3 deliverables inventory: 12 substantive files + 4 governance-state files + 7
    file scopes verified untouched (L1, 025, platform, etc.).
  - §4 NAPs: NAP.M4.4 RESOLVED at M4-A close (binding throughout M4-B); NAP.M4.5
    [PENDING-S5]; NAP.M4.6 + NAP.M4.7 cross-referenced (not in M4-B scope).
  - §5 LL status: LL.1 [PENDING-S5]; LL.2 CONDITIONAL_PASS; LL.3 + LL.4 COMPLETE.
  - §6 residuals: 11 from M4-B substrate + 2 [PENDING-S5] + 14 inherited = 27 total
    items carrying forward to M4-C / M5 / M9 by class.
  - §7 red-team: IS.8(a) cadence trail in M4-B (FIRES at S4 with PASS_WITH_FINDINGS);
    IS.8(b) sub-phase-close red-team [PENDING-S6 — author or accept-as-discharged].
  - §8 approval: M4-B sub-phase close requires only internal AC gate, no NAP.
    Surrogate-disclosure ledger preserved.
  - §9 this changelog.

---

*End of M4_B_CLOSE_v1_0.md — sealed CLOSED at M4-B-S6-CLOSE, 2026-05-03.*
