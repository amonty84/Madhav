---
artifact: 06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/M4_B_CLOSE_v1_0.md
canonical_id: M4_B_CLOSE
version: 1.0
status: DRAFT
authored_by: M4-B-P4-S6-PREDRAFT
authored_at: 2026-05-02
sub_phase: M4-B — Learning Layer Activation (sub-phase of M4 macro-phase)
macro_phase: M4 — Calibration + LEL Ground-Truth Spine
sub_phase_opened: 2026-05-02 (M4-B-S1-LL1-SHADOW-WEIGHTS — first M4-B substantive write at commit 550fa77; sub-phase formally entered at M4-A-CLOSE-LEL-PATCH 2026-05-02)
sub_phase_closed: [PENDING-S6 — sealed at S6 close after S5 NAP.M4.5 outcome resolves and red-team is recorded]
phase_plan: 00_ARCHITECTURE/PHASE_M4_PLAN_v1_0.md §3.2 (AC.M4B.1–AC.M4B.10)
predecessor_close_artifact: 00_ARCHITECTURE/M4_A_CLOSE_v1_0.md (M4-A sub-phase sealing 2026-05-02)
red_team_artifact: "[PENDING-S6 — IS.8(b) sub-phase-close cadence per ONGOING_HYGIENE_POLICIES §G; M4-B-S4 IS.8(a) every-third PASS_WITH_FINDINGS already discharged in-cycle]"
successor_sub_phase: M4-C — Retrieval + Discovery Learning (LL.5 + LL.6 + LL.7) + LL.8 Scaffold
produced_during: M4-B-P4-S6-PREDRAFT
produced_on: 2026-05-02
status_explanation: >
  This document is a DRAFT pre-draft authored at the M4-B-P4-S6-PREDRAFT parallel slot
  (running alongside M4-B-S5 which carries the binding NAP.M4.5 native-pass-2 trigger).
  Every field whose value depends on the S5 outcome carries a literal `[PENDING-S5]` token
  with a one-line description of what it is waiting for. S6 (the formal M4-B-close session)
  reads this draft, resolves every `[PENDING-S5]` placeholder against the actual S5 outcome,
  conducts the IS.8(b) sub-phase-close red-team, and seals the document by flipping the
  frontmatter `status: DRAFT` to `status: CURRENT` and bumping `version: 1.0` to its
  sealed value (typically `1.0` retained or `1.1` if material redrafts land at S6).
note: >
  This is a SUB-PHASE close artifact, not a macro-phase close. The M4 macro-phase itself
  remains active and closes at M4-D with its own M4_CLOSE_v1_0.md sealing artifact. The
  IS.8(b) macro-phase-close red-team fires at M4 close, not here. M4-B is the calibration-
  layer-activation sub-phase: LL.1 per-signal weights computed in shadow; LL.2 graph edge
  modulators computed in shadow; LL.3 + LL.4 recommendation documents authored. NAP.M4.5
  (native pass_2 spot-check) is the binding gate inside M4-B and sealing depends on its
  outcome.
changelog:
  - v1.0 DRAFT (2026-05-02, M4-B-P4-S6-PREDRAFT) — Initial pre-draft authored as parallel
    slot to M4-B-S5. All S5-dependent fields held as literal `[PENDING-S5]` tokens. To be
    sealed at S6 against the actual S5 outcome.
---

# M4-B CLOSE — Learning Layer Activation (M4 sub-phase) — DRAFT

## Executive summary

M4-B (Learning Layer Activation — LL.1 per-signal weight calibration in shadow; LL.2 graph
edge weight modulators in shadow; LL.3 domain-bucket coherence diagnostic; LL.4
prediction-prior recommendation; binding `SHADOW_MODE_PROTOCOL §3` discipline; held-out
9-event partition sacrosanct throughout; two-pass approval pass_1 complete by Claude-
surrogate-for-Gemini; pass_2 = NAP.M4.5 binding final gate) is on track to **close
[PENDING-S5 — final outcome of NAP.M4.5 determines whether M4-B closes as PASS, PARTIAL_PASS,
or HOLD/FAIL]**.

The empirical calibration substrate computed across S1–S4 is now in place. LL.1 shadow
register `signal_weights/shadow/ll1_shadow_weights_v1_0.json` carries 380 observed signals,
30 promotion-eligible (pass_1 complete; pass_2 pending NAP.M4.5). LL.2 shadow register
`signal_weights/shadow/ll2_edge_weights_v1_0.json` carries 9,922 edges (8 MED-tier
intra-`general` Pancha-Mahapurusha clique; 9,914 LOW-tier; 0 HIGH/ZERO; 0 cross-domain by
structural design per LL2_EDGE_WEIGHT_DESIGN §3.5). LL.2 stability gate stands at
CONDITIONAL_PASS pending NAP.M4.5 close. LL.3 + LL.4 recommendation documents discharge the
M4-B `SHADOW_MODE_PROTOCOL §2` row obligations as recommendation artifacts (no
shadow→production split at M4-B per protocol design). The M4-B-S4 IS.8(a) every-third red-
team has been discharged in-cycle (PASS_WITH_FINDINGS, 0 HIGH/CRITICAL/MEDIUM); the
sub-phase-close red-team obligation falls due at S6.

The bar to open M4-C is therefore **conditional on [PENDING-S5 — NAP.M4.5 outcome]** with
the following sealing path: (a) PASS → all 30 LL.1 signals advance to production, LL.2
gate flips PASS, M4-C may open; (b) PARTIAL_PASS → some signals promote, M4-C may open
with reduced production set; (c) HOLD/FAIL → M4-B closes with no production promotion;
M4-C entry-gate consequences re-evaluated against `PHASE_M4_PLAN §3.3` entry-gate clause.

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
| S5 | M4-B-S5 | [PENDING-S5 — date] | NAP.M4.5 native pass_2 trigger; LL.4 follow-through; Gemini reachability check | substantive |
| P3 | M4-B-P3 (if invoked) | [PENDING-S5 — date] | Parallel-slot governance-aside session, scope TBD | governance-aside |
| P4 | M4-B-P4-S6-PREDRAFT | 2026-05-02 | This document (DRAFT) | governance-aside |
| S6 | M4-B-S6 (M4-B close) | [PENDING-S6 — date] | Seal this document by resolving [PENDING-S5] tokens; conduct IS.8(b) sub-phase-close red-team; CURRENT_STATE flip | substantive (close-class) |

**M4-B sessions total at this pre-draft moment:** 8 closed (S1, S2, P1, P2, S3, S4, P3
and P4 are the parallel slots concurrent with S5; this document is P4) + 1 in flight (S5)
+ 1 pending (S6 close). Final count to be sealed at S6.

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
| AC.M4B.8 | Two-pass approval evidence recorded for each weight batch | PASS (pass_1 surrogate); [PENDING-S5 — pass_2] | S2 (6a4ff8a) for LL.1 pass_1; LL2_STABILITY_GATE §6 records LL.2 pass_1 | LL.1 pass_2 gate = NAP.M4.5 (S5); LL.2 pass_2 gate cascades from NAP.M4.5 |
| AC.M4B.9 | No production register writes in M4-B | PASS | All sessions | Production file scaffolded at S2 with `weights_in_production_register: false`; flag flips only at NAP.M4.5 PASS outcome |
| AC.M4B.10 | IS.8(a) every-third cadence tracked; REDTEAM_M4B if counter fires | PASS (in-session) | M4-B-S4 (78449b8) | Counter 2→3 at S4, IS.8(a) FIRES, in-session 4-axis red-team conducted, 0 HIGH/CRITICAL/MEDIUM, counter reset 3→0 |

**Aggregate (PHASE_M4_PLAN §3.2):** 9 PASS / 1 PASS-with-PENDING-S5 (AC.M4B.8 pass_2
clause) / 0 FAIL.

### §2.2 — Per-session brief ACs (S1–S4)

| Session | AC count | Verdict (S1–S4 sessions) |
|---|---|---|
| M4-B-S1-LL1-SHADOW-WEIGHTS | n ACs (per S1 brief) | PASS — substrate scaffold + 380 signals + 30 eligible |
| M4-B-S2-MIRROR-TWOPASS | n ACs (per S2 brief) | PASS — pass_1 complete; mirror sync MP.1+MP.2; production-pending file scaffolded |
| M4-B-P1-GAP-TRAVEL-CLOSE | AC.P1.1–P1.5 (per brief) | PASS — GAP.M4A.04 PARTIAL_CLOSE; LEL_GAP_AUDIT v1.1→v1.2; CURRENT_STATE v1.6→v1.8 |
| M4-B-P2-NAP-M45-PREP | AC.P2.1–P2.5 (per brief) | PASS — NAP_M4_5_DOSSIER_v1_0.md authored; CURRENT_STATE v1.9 reservation slot filled |
| M4-B-S3-LL2-EDGE-WEIGHTS | AC.S3.1–S3.8 (per brief) | PASS — LL.2 shadow file 9,922 edges; LL2_STABILITY_GATE; LL2_EDGE_WEIGHT_DESIGN; KR.M4A.CLOSE.1 discharged |
| M4-B-S4-LL3-DOMAIN-COHERENCE | AC.S4.1–S4.7 (per brief) | PASS — LL.3 + LL.4 recommendation docs; in-session red-team PASS_WITH_FINDINGS |

### §2.3 — S5 acceptance criteria (PENDING)

| AC | Target | Verdict |
|---|---|---|
| AC.S5.* | NAP.M4.5 native pass_2 trigger executed; pass_2 verdicts captured in dossier §5 template; write-back to `ll1_weights_promoted_v1_0.json approval_chain[].pass_2_*` fields | [PENDING-S5] |
| AC.S5.* | Gemini reachability check + (if reachable) addendum to LL1_TWO_PASS_APPROVAL §5 + LL2_STABILITY_GATE §6.1 | [PENDING-S5] |
| AC.S5.* | (optional) LL.4 follow-through; numerical prior coefficients only if S5 brief expands | [PENDING-S5 — only if S5 brief expands] |
| AC.S5.* | LL2_STABILITY_GATE re-evaluation at NAP.M4.5 close (auto-bumps to v1.1; PASS / PARTIAL_PASS / HOLD-FAIL decision) | [PENDING-S5 outcome] |

### §2.4 — S6 close-checklist acceptance criteria (PENDING)

| AC | Target | Verdict |
|---|---|---|
| AC.S6.* | This document (`M4_B_CLOSE_v1_0.md`) sealed: every [PENDING-S5] resolved; status flipped DRAFT → CURRENT | [PENDING-S6] |
| AC.S6.* | IS.8(b) sub-phase-close red-team conducted (per ONGOING_HYGIENE_POLICIES §G; not the every-third IS.8(a) — this is the sub-phase-close-class red-team) | [PENDING-S6] |
| AC.S6.* | CURRENT_STATE flip: active_phase_plan_sub_phase → "M4-B CLOSED [date]"; M4-C entry-gate evaluation | [PENDING-S6] |
| AC.S6.* | MP.1 + MP.2 mirror sync to adapted parity reflecting M4-B CLOSED | [PENDING-S6] |
| AC.S6.* | drift_detector + schema_validator + mirror_enforcer at-close runs | [PENDING-S6 — exit codes] |

---

## §3 — Deliverables inventory

All files created or modified during M4-B sub-phase, with path, version, commit hash,
and status. Sealed status flag flips at S6.

### §3.1 — Substantive deliverables

| Path | Version | Status | Commit | Session |
|---|---|---|---|---|
| `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/signal_weights/shadow/ll1_shadow_weights_v1_0.json` | 1.0 | CURRENT (shadow) | 550fa77 / efa599c | M4-B-S1 |
| `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/signal_weights/shadow/README.md` | n/a | CURRENT | 550fa77 | M4-B-S1 |
| `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/signal_weights/README.md` | n/a | CURRENT | 550fa77 | M4-B-S1 |
| `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/LL1_TWO_PASS_APPROVAL_v1_0.md` | 1.0 | CURRENT | 6a4ff8a / 568cfe3 | M4-B-S2 |
| `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/signal_weights/production/ll1_weights_promoted_v1_0.json` | 1.0 | production_pending_pass_2 (`weights_in_production_register: false`); [PENDING-S5 — flag flip] | 6a4ff8a | M4-B-S2 |
| `06_LEARNING_LAYER/OBSERVATIONS/LEL_GAP_AUDIT_v1_0.md` | 1.1 → 1.2 | CURRENT (governance-aside annotation) | d06b341 / 98eb7fd | M4-B-P1 |
| `00_ARCHITECTURE/EVAL/NAP_M4_5_DOSSIER_v1_0.md` | 1.0 | CURRENT (native-facing pass_2 dossier; consumed at S5) | fb94f1d / 2071030 | M4-B-P2 |
| `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/LL2_STABILITY_GATE_v1_0.md` | 1.0 | CURRENT (gate=CONDITIONAL_PASS); [PENDING-S5 — re-evaluates to v1.1 PASS/PARTIAL/FAIL] | 883b563 / 0deb3cb | M4-B-S3 |
| `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/LL2_EDGE_WEIGHT_DESIGN_v1_0.md` | 1.0 | CURRENT | 883b563 | M4-B-S3 |
| `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/signal_weights/shadow/ll2_edge_weights_v1_0.json` | 1.0 | CURRENT (shadow) | 883b563 | M4-B-S3 |
| `06_LEARNING_LAYER/OBSERVATIONS/CALIBRATION_RUBRIC_v1_0.md` | 1.0-DRAFT → 1.1 | CURRENT (frontmatter flipped APPROVED; KR.M4A.CLOSE.1 discharged) | 883b563 | M4-B-S3 |
| `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/LL3_DOMAIN_COHERENCE_v1_0.md` | 1.0 | CURRENT (recommendation document) | 78449b8 / 6c2dfc1 | M4-B-S4 |
| `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/LL4_PREDICTION_PRIOR_v1_0.md` | 1.0 | CURRENT (recommendation document) | 78449b8 | M4-B-S4 |
| `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/M4_B_CLOSE_v1_0.md` | 1.0 DRAFT | DRAFT (this document); [PENDING-S6 — seal to CURRENT] | (this commit) | M4-B-P4-S6-PREDRAFT |

### §3.2 — Governance-state deliverables (touched by M4-B sessions)

| Path | M4-B mutations | Status |
|---|---|---|
| `00_ARCHITECTURE/CURRENT_STATE_v1_0.md` | v1.5 → v1.6 (S2) → v1.7 (S3 reservation) → v1.8 (P1) → v1.9 (P2) → v2.0 (S4) → v2.3 (this session, P4 with v2.1 reserved for S5 + v2.2 reserved for P3) → [PENDING-S5/S6 further bumps] | LIVE |
| `00_ARCHITECTURE/SESSION_LOG.md` | Entries appended for S1, S2, P1, P2, S3, S4, P4 (this session); [PENDING-S5/S6 entries] | LIVE |
| `.geminirules` (MP.1 mirror) | Synced at S2 to reflect M4-A CLOSED + M4-B-S1 done + M4-B-S2 in flight; [PENDING-S6 — re-sync at sub-phase close] | LIVE |
| `.gemini/project_state.md` (MP.2 mirror) | Synced at S2; [PENDING-S6 — re-sync at sub-phase close] | LIVE |

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
- `00_ARCHITECTURE/CAPABILITY_MANIFEST.json` — not modified in M4-B.

---

## §4 — NAP decisions

### §4.1 — Resolved within M4-B substrate

- **NAP.M4.4 — Shadow-mode promotion criteria.** APPROVED at M4-A-S2-T3-SHADOW-PROTOCOL
  NAP-decisions append (c5877c5, 2026-05-02). `SHADOW_MODE_PROTOCOL §3` (a)–(d) + §3.2
  validity margin (match_rate ≥ 0.4) binding for all M4-B and M4-C weight writes. M4-B
  consumed this approval as the substrate-binding rule throughout S1–S4. **(Resolved
  before M4-B opened; surfaced here for completeness.)**

### §4.2 — In flight at M4-B close (binding)

- **NAP.M4.5 — Native pass_2 spot-check on LL.1 weights.** [PENDING-S5 — outcome].
  Dossier (`00_ARCHITECTURE/EVAL/NAP_M4_5_DOSSIER_v1_0.md` v1.0) authored at M4-B-P2.
  Six sections; full 30-signal table sorted by mean_match_rate; deep-dive on 3 Tier-C
  flagged signals (SIG.MSR.118/.119/.143); spot-check guide; blank pass_2 decision-
  record template; native pass_2 verdict on each of the 30 signals captured at S5.
  Possible outcomes per dossier §4: (a) **approve** all 30 → LL.1 production register
  flag flips true; LL2_STABILITY_GATE re-evaluates to PASS (cascade); M4-C entry-gate
  cleared; (b) **partial approve** (e.g., 27 of 30) → production register flag flips
  true with reduced set; LL2_STABILITY_GATE re-evaluates to PARTIAL_PASS; M4-C entry-
  gate cleared with reduced LL.1 production set; (c) **hold/demote** → production
  register flag stays false; LL2_STABILITY_GATE re-evaluates to HOLD/FAIL; M4-C entry
  consequences re-evaluated. Native disposition writeback target:
  `ll1_weights_promoted_v1_0.json approval_chain[*].pass_2_*` fields +
  `LL1_TWO_PASS_APPROVAL_v1_0.md §5.pass_2`.

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

- **Status at M4-B close:** [PENDING-S5 — promotion count and gate status TBD].
- **Pass_1 (Claude-surrogate-for-Gemini):** COMPLETE at M4-B-S2. 30 of 30 promotion-
  eligible signals approved by surrogate review. 0 held / 0 demoted. Demotion rule
  (mean<0.4 OR variance>0.3 → shadow_indefinite) re-checked against shadow file at S2;
  not triggered for any of the 30. 3 signals (SIG.MSR.118/119/143; identical aggregate
  statistics N=11 mean=0.4545 var=0.2727) flagged for NAP.M4.5 (pass_2) closer scrutiny
  per `LL1_TWO_PASS_APPROVAL_v1_0.md §4` + `NAP_M4_5_DOSSIER §3`.
- **Pass_2 (NAP.M4.5 — native):** [PENDING-S5 — pending S5 close]. Possible outcomes:
  (a) all 30 approved → 30 advance to production; (b) partial → some advance; (c)
  hold → none advance.
- **Production register:** `signal_weights/production/ll1_weights_promoted_v1_0.json`
  scaffolded at S2 with `weights_in_production_register: false` and
  `status: production_pending_pass_2`. Flag flips at NAP.M4.5 PASS outcome (S5).
  Downstream pipeline must NOT consume these weights until pass_2 sign-off.
- **Shadow register:** `signal_weights/shadow/ll1_shadow_weights_v1_0.json` carries 380
  signals: 30 promotion-eligible / 285 insufficient_observations (N<3) / 52
  shadow_indefinite_low_match_rate / 13 shadow_indefinite_high_variance.
- **Held-out partition discipline:** Sacrosanct. Held-out 9 events contributed zero
  observations to LL.1 shadow at any point (Learning Layer rule #4 honored; verified
  by direct leakage scan in M4-B-S4 red-team).
- **n=1 disclaimer:** Present in shadow file header verbatim per
  `SHADOW_MODE_PROTOCOL §7`.

### §5.2 — LL.2 — Graph edge weight modulators

- **Status at M4-B close:** Stability gate = CONDITIONAL_PASS (recorded
  2026-05-02 at S3); [PENDING-S5 — gate flip outcome].
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
  LL.2 promotion. Currently false for every edge (LL.1 production register empty).
  [PENDING-S5 — flag flips after NAP.M4.5 PASS for the cohort of edges whose endpoints
  are in the pass_2-approved set].
- **Re-evaluation trigger:** NAP.M4.5 close auto-bumps `LL2_STABILITY_GATE_v1_0.md` to
  v1.1 with PASS/PARTIAL_PASS/HOLD-FAIL decision per `§5` of that artifact.
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

- **Status at M4-B close:** COMPLETE (recommendation document); [PENDING-S5 —
  machine-readable priors file authoring deferred to S5 if brief expands; default
  is no S5 amendment, M5 LL.5 owns numerical fitting].
- **Deliverable:** `LL4_PREDICTION_PRIOR_v1_0.md` v1.0. Recommendation document, not
  weight register; no shadow→production split per `SHADOW_MODE_PROTOCOL §2` LL.4 row.
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
   (n-1, more conservative than population). [PENDING-S5 — closure track]: per the
   AC.P4.1 brief language, F.RT.S4.1 is "closed by S5 (variance_estimator field)". S5
   adds an explicit `variance_estimator: sample` field to relevant artifacts and/or
   amends the protocol. If S5 brief does not in fact include this, F.RT.S4.1 carries to
   M4-C as a non-blocking LOW residual for next protocol-amendment opportunity.
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

### §6.2 — Carry-forward dependent on S5 outcome

12. **Gemini reachability addendum** to `LL1_TWO_PASS_APPROVAL_v1_0.md §5` and
    `LL2_STABILITY_GATE_v1_0.md §6.1`. [PENDING-S5 outcome]: if Gemini becomes
    synchronously reachable at S5, addenda are appended; if not, the surrogate-pass_1
    path remains and Gemini reachability carries to M4-C as a standing residual.
13. **LL.2 CONDITIONAL_PASS gate flip.** [PENDING-S5 — outcome]. PASS / PARTIAL_PASS /
    HOLD-FAIL determined by NAP.M4.5 outcome.

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
| 0 (held) | M4-B-P1, M4-B-P2, M4-B-P4 (this session) | 0 | Governance-aside class; do not increment |
| 0 → 1 (anticipated) | M4-B-S5 | 1 (anticipated) | [PENDING-S5 — substantive class confirmation; if substantive, increments] |
| 1 → 2 (anticipated) | M4-B-S6 close session | 2 (anticipated) | [PENDING-S6 — counter advance through close session] |

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

### §7.2 — IS.8(b) sub-phase-close red-team — [PENDING-S6]

Per `ONGOING_HYGIENE_POLICIES §G` and `MACRO_PLAN §IS.8(b)` clause: every macro-phase
close requires its own red-team. M4-B is a sub-phase (not macro-phase), so the
macro-phase-close IS.8(b) cadence fires at M4-D close, not at M4-B close. **However**,
ONGOING_HYGIENE_POLICIES §G acknowledges that "macro-phase close" is the binding clause
for IS.8(b); a sub-phase-close-quality-gate red-team is conducted at the close session's
discretion when material substantive deliverables land in the sub-phase. Precedent:
M3-C close ran `REDTEAM_M3C_v1_0.md` as a sub-phase-close quality gate (NOT §IS.8(a)
cadence), which surfaced findings preserved in CROSSCHECK + DIS register.

S6 is expected to author either (a) a `REDTEAM_M4B_v1_0.md` artifact as M4-B close
quality gate (analogous to REDTEAM_M3C), or (b) accept the M4-B-S4 in-session
4-axis red-team as discharge of the cadence with this section closed at S6 final
seal. Decision deferred to S6 brief authoring.

### §7.3 — Next IS.8(a) every-third cadence

Counter trail post-S6 close: [PENDING-S6 — exact counter at close]. Next IS.8(a) fires
at counter=3 (three substantive M4-C sessions hence). Next IS.8(b) macro-phase-close
cadence fires at M4-D close per `PHASE_M4_PLAN §3.4`. Next §IS.8(c) every-12-months
MACRO_PLAN review remains 2027-04-23 due.

---

## §8 — Approval

### §8.1 — M4-B sub-phase close — internal AC gate, no NAP

M4-B sub-phase close is governed by the internal acceptance-criteria gate documented at
`PHASE_M4_PLAN §3.2` (AC.M4B.1–10) plus the per-session brief ACs (S1–S6). M4-B does
**not** require a native-approval-point (NAP) for sub-phase close — NAP.M4.5 is the
binding NAP within M4-B (LL.1 pass_2 spot-check), and NAP.M4.7 is the M4 macro-phase
close NAP at M4-D, not at M4-B.

The close discipline:

- **Internal AC gate:** §2 ledger above must show all rows PASS or [PENDING-S5/S6]
  resolved at S6.
- **Sub-phase-close red-team:** §7.2 above [PENDING-S6 — author or accept-as-discharged].
- **CURRENT_STATE flip:** S6 flips `active_phase_plan_sub_phase` to "M4-B CLOSED [date]"
  and rotates pointers per close convention.
- **Mirror sync:** MP.1 + MP.2 to adapted parity reflecting M4-B CLOSED at S6.

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

If Gemini becomes synchronously reachable at S5 or before S6 close, an addendum to
LL1_TWO_PASS_APPROVAL §5 + LL2_STABILITY_GATE §6.1 captures the Gemini verdict per
`GOVERNANCE_INTEGRITY_PROTOCOL §K.3` (ratify or contest). [PENDING-S5/S6 outcome].

---

## §9 — Changelog

- **v1.0 DRAFT (2026-05-02, M4-B-P4-S6-PREDRAFT):** Initial pre-draft. Authored as a
  parallel-slot session running alongside M4-B-S5 (which carries the binding NAP.M4.5
  native-pass-2 trigger). All S5-dependent fields held as literal `[PENDING-S5]` tokens
  with one-line descriptions of what each is waiting for. Status `DRAFT` will flip to
  `CURRENT` at S6 after every `[PENDING-S5]` is resolved against the actual S5 outcome
  and the IS.8(b) sub-phase-close red-team is recorded per §7.2 above.
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

*End of M4_B_CLOSE_v1_0.md (DRAFT). To be sealed at M4-B-S6 close session per §1.2.*
