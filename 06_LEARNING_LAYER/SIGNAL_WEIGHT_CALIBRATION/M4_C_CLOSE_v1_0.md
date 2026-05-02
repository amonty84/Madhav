---
artifact: 06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/M4_C_CLOSE_v1_0.md
canonical_id: M4_C_CLOSE
version: "1.0"
status: CLOSED
authored_by: M4-C-P6-S4-PREDRAFT
authored_at: 2026-05-03
sealed_by: M4-C-S4-CLOSE
sealed_at: 2026-05-02
sub_phase: M4-C — Discovery / Retrieval / Plan-Selection Activation (sub-phase of M4 macro-phase)
macro_phase: M4 — Calibration + LEL Ground-Truth Spine
sub_phase_opened: "M4-C-S1-LL5-DASHA-TRANSIT 2026-05-02 — first M4-C substantive session (LL.5 first shadow write); M4-B sub-phase formally CLOSED 2026-05-03 at M4-B-S6-CLOSE (commit 007c718) — M4-C entry-gate cleared."
sub_phase_closed: "M4-C-S4-CLOSE 2026-05-02 — sub-phase close session sealing this artifact; CURRENT_STATE rotation v3.0 → v3.1 marking M4-C CLOSED and M4-D as the incoming active phase."
phase_plan: 00_ARCHITECTURE/PHASE_M4C_PLAN_v1_0.md (v1.0.1; DRAFT authored 2026-05-02 at M4-B-P5-M4C-ENTRY-PREP; LL.5 naming propagation v1.0 → v1.0.1 at this S4 close per DECISION-1).
predecessor_close_artifact: 06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/M4_B_CLOSE_v1_0.md (M4-B sub-phase sealing CLOSED 2026-05-03 at M4-B-S6-CLOSE).
red_team_artifact: "In-document §7.2 — IS.8(b)-class M4-C sub-phase-close red-team conducted in-document per the same convention used at M4-B-S6-CLOSE. 5 axes scoped (LL.5/LL.6/LL.7 shadow integrity + decision audit + held-out partition + naming + mirror); verdict per §7.2 below."
successor_sub_phase: M4-D — M4 macro-phase close (M4 cross-system reconciliation + NAP.M4.7 + IS.8(b) macro-phase-close red-team).
produced_during: M4-C-P6-S4-PREDRAFT (skeleton; parallel governance slot to M4-C-S3)
sealed_during: M4-C-S4-CLOSE
produced_on: 2026-05-03
status_explanation: >
  Sealed at M4-C-S4-CLOSE 2026-05-02. Status flipped DRAFT → CLOSED. All
  [PENDING-S*] tokens replaced with actual S1/S2/S3 outcomes read from sealed
  shadow registers (ll5_dasha_transit_v1_0.json, ll6_temporal_density_v1_0.json,
  ll7_discovery_prior_v1_0.json), design docs (LL5_DASHA_TRANSIT_DESIGN,
  LL6_TEMPORAL_DENSITY_DESIGN, LL7_DISCOVERY_PRIOR_DESIGN), NAP_M4_6_BRIEF v1.2,
  CURRENT_STATE v2.7/v2.8/v2.9/v3.0 changelog blocks, and SESSION_LOG entries
  M4-C-S1-LL5-DASHA-TRANSIT + M4-C-S2-LL6-TEMPORAL-DENSITY + M4-C-S3-LL7-
  DISCOVERY-PRIOR. IS.8(b)-class M4-C sub-phase-close red-team conducted
  in-document §7.2 (analogue of M4-B-S6 in-document §7.2). CURRENT_STATE
  rotated v3.0 → v3.1 at this close to mark M4-C CLOSED + M4-D incoming.
note: >
  This is a SUB-PHASE close artifact, not a macro-phase close. The M4 macro-phase
  itself remains active and closes at M4-D with its own M4_CLOSE_v1_0.md sealing
  artifact + NAP.M4.7 native gate + IS.8(b) macro-phase-close red-team. M4-C is the
  Learning Layer activation sub-phase for the second tranche of mechanisms: LL.5
  (retrieval ranking, shadow), LL.6 (plan selection, shadow), and LL.7 (discovery
  prior shaping, native-only mode — no shadow→production split per
  SHADOW_MODE_PROTOCOL §2 LL.7 row). NAP.M4.6 (LL.7 prior rubric) is the binding NAP
  inside M4-C and was APPROVED 2026-05-02 (Option B — Classical-seeded with 3
  refinements; verdict pre-discharged so S3 opens with the rubric already in hand).
parallel_session_notes: >
  M4-C-P6-S4-PREDRAFT (this session) ran as a parallel governance slot alongside
  M4-C-S3 (LL.7 first artifact write per NAP.M4.6 Option B). Same convention as
  M4-B-P4-S6-PREDRAFT (parallel to M4-B-S5) — predraft skeleton authored ahead of S4
  with all S-dependent fields held as literal `[PENDING-S*]` tokens; S4 consumes the
  skeleton at sub-phase close rather than starting fresh. Conflict surfaces:
  CURRENT_STATE.md (this session sets `predraft_available: M4_C_CLOSE_v1_0.md`;
  canonical state pointers UNCHANGED — S3 owns those) and SESSION_LOG.md (this
  session appends its own entry; S3's entry is independent). drift_detector.py /
  schema_validator.py / mirror_enforcer.py to be re-run at S4 close to confirm no
  cross-check regression.
changelog:
  - v1.0 DRAFT (2026-05-03, M4-C-P6-S4-PREDRAFT, parallel governance slot to M4-C-S3):
    Initial pre-draft skeleton authored as a parallel slot to M4-C-S3 (LL.7 first
    artifact write). All S1/S2/S3/S4-dependent fields held as literal `[PENDING-S*]`
    tokens per the brief hard_constraint "Do not pre-decide S3 outcomes (novel edge
    count, sanity-check result). Every S3-dependent field is [PENDING-S3]." The brief
    also instructed to read S1+S2 SESSION_LOG entries if those sub-phases had closed
    by the time this session ran and fill §2 + §5 rows from actual outcomes; check at
    write time confirmed neither S1 nor S2 had closed yet (last logged session is the
    NAP.M4.6 verdict append at af82d8e, 2026-05-03; no M4-C-S1 / S2 / S3 entries in
    SESSION_LOG; latest commits before this slot: ecd30a2 chore stamp + 4948a48 W2
    smoke). All S1/S2/S3/S4-dependent fields therefore remain [PENDING-S*]; S4 reads
    actual outcomes at close.
    - §1 scope: 3 mechanisms (LL.5/LL.6/LL.7 native-only) per PHASE_M4C_PLAN §1.1;
      sub-phase rounds S1–S4 + Px parallel slots (this session is P6); deliverables
      inventory schema (substantive + governance-state).
    - §2 AC ledger: PHASE_M4C_PLAN §3 per-sub-phase ACs (AC.M4C.S1.1–S1.5;
      AC.M4C.S2.1–S2.4; AC.M4C.S3.1–S3.5; AC.M4C.S4.1–S4.5) all marked [PENDING-S*];
      cross-cutting PHASE_M4_PLAN §3.3 ACs (AC.M4C.1–5) marked [PENDING].
    - §3 deliverables inventory: structural rows for each expected M4-C deliverable
      with [PENDING-S*] for path/version/commit/status fields.
    - §4 NAPs: NAP.M4.4 (binding throughout M4-C, unchanged); NAP.M4.6 (RESOLVED
      2026-05-02, Option B + 3 refinements — fully populated since this is known
      ground at predraft time); NAP.M4.7 [PENDING-S4 cross-reference; M4-D scope].
    - §5 LL status: LL.5 [PENDING-S1]; LL.6 [PENDING-S2]; LL.7 [PENDING-S3].
    - §6 known residuals: KR.M4A.RT.LOW.1 (still open); GAP.M4A.04 PARTIAL_CLOSE
      (deferred); R.LL1TPA.1 [PENDING-S1 — Gemini reachability re-check outcome];
      F.RT.S6.M.2 (recorded as closed by S3 manifest update [PENDING-S3 confirmation]);
      F.RT.S6.N.1 (still open — next quarterly governance pass 2026-07-24).
    - §7 red-team: IS.8(a) cadence trail in M4-C [PENDING-S1/S2/S3]; IS.8(b)-class
      M4-C sub-phase-close red-team [PENDING-S4 — author or accept-as-discharged
      per S4 brief].
    - §8 approval: M4-C sub-phase close = internal AC gate, no NAP. NAP.M4.7 at
      M4-D macro-phase close. [PENDING-S4 verdict text].
    - §9 this changelog.
    Authored under brief `M4-C-P6-S4-PREDRAFT`. Companion artifacts: PHASE_M4C_PLAN
    v1.0 DRAFT (forward-pointer plan, M4-B-P5); NAP_M4_6_BRIEF v1.1 OPTION_B_APPROVED
    (decision brief, M4-B-P5 + native verdict 2026-05-02).
---

# M4-C CLOSE — Discovery / Retrieval / Plan-Selection Activation (M4 sub-phase) — CLOSED

## Executive summary

```
STATUS: 1.0 — CLOSED 2026-05-02 (M4-C-S4-CLOSE; sealing path = sub-phase-close-AC-clean
+ in-document IS.8(b)-class red-team § 7.2 PASS_4_OF_4_AT_S3-DISCHARGE + S4-DISCHARGE-CLEAN).
Pre-draft skeleton authored at M4-C-P6-S4-PREDRAFT 2026-05-03; sealed at S4 close
2026-05-02 by resolving every [PENDING-S*] token against actual S1/S2/S3 outcomes,
conducting the IS.8(b)-class sub-phase-close red-team in-document, and flipping
status DRAFT → CLOSED.
```

M4-C (Learning Layer Activation — second tranche: LL.5 Dasha-Transit axis-weight
modulator weights in shadow [renamed at S4 per DECISION-1 R.LL5DESIGN.1, propagated
to MACRO_PLAN v2.1 + PHASE_M4C_PLAN v1.0.1 + SHADOW_MODE_PROTOCOL v1.0.1]; LL.6
Temporal Density Modulator weights in shadow; LL.7 Discovery Prior in native-only
single-artifact form per NAP.M4.6 Option B + DECISION-2 literal msr_anchors-clique
CDLM construction; binding `SHADOW_MODE_PROTOCOL §3` discipline; held-out 9-event
partition sacrosanct throughout; NAP.M4.6 RESOLVED 2026-05-02 [v1.2
OPTION_B_APPROVED_LITERAL_CONSTRUCTION].

NAP.M4.6 verdict (M4-B-P5-M4C-ENTRY-PREP NAP-decisions append, 2026-05-02, commit
af82d8e): **Option B — Classical-seeded** with three native refinements: (a) rename
`classical_only` support class to `unconfirmed`; (b) lower discovery threshold from
N≥5 to N≥3; (c) 8 MED-tier LL.2 edges (per `LL3_DOMAIN_COHERENCE §4.1`) become the
verification anchor for the LL.7 algorithm at S3. **DECISION-2 native amendment
2026-05-02:** literal msr_anchors-clique CDLM construction — sanity-class flipped
`confirmed → novel`; 8 MED-tier anchors classify as `novel` under literal CDLM
because Pancha-MP MSR signals are not yet declared as msr_anchors of governing
CDLM cells (CF.LL7.1 carry-forward to M4-D/M5).

The Learning Layer activation substrate computed across S1–S3:
- **LL.5 first shadow write at S1** (M4-C-S1-LL5-DASHA-TRANSIT 2026-05-02): 380
  signals; HIGH 2 / MED 12 / LOW 252 / ZERO 114; dasha_dominant 259 / transit_dominant
  1 / balanced 6.
- **LL.6 first shadow write at S2** (M4-C-S2-LL6-TEMPORAL-DENSITY 2026-05-02): 380
  signals; 255/380 meaningful_adjustment at delta>0.1; raw_training_mean 0.6300
  vs density_adjusted_training_mean_weighted 0.6231; H2 dense-cluster-inflation
  hypothesis REJECTED at n=37.
- **LL.7 native-only artifact at S3** (M4-C-S3-LL7-DISCOVERY-PRIOR 2026-05-02):
  243 edges emitted (107 novel + 136 unconfirmed + 0 confirmed + 0 contradicted);
  9867 noise pairs excluded from 9974 raw co-firing pairs; sanity_anchor_novel_count
  8/8 PASS (under DECISION-2 literal construction; CF.LL7.1 deferred). Empirical
  shape diverges from NAP_M4_6_BRIEF v1.1 §6.4 estimate (~5–15 novel; actual 107)
  — recorded in design §7.

M4-D macro-phase close is **unblocked**: §1.4 close-criteria PASS at this S4 close.

---

## §1 — Scope of M4-C

M4-C is the second Learning Layer activation sub-phase of M4. Per `PHASE_M4C_PLAN §1.1`,
M4-C activates three Learning Layer mechanisms (LL.5/LL.6/LL.7 native-only) under
shadow-mode discipline (LL.5/LL.6) + native-only-artifact discipline (LL.7), where
"shadow mode" is the structural separation between observation of a learned parameter
and application of that parameter in retrieval/synthesis (per
`SHADOW_MODE_PROTOCOL §1`) and "native-only mode" is a single native-approved
artifact with no shadow→production split per §2 LL.7 row.

### §1.1 — Mechanism scope

- **LL.5 — Dasha-Transit axis-weight modulator** (renamed from "Retrieval ranking
  learning" at S4 per DECISION-1 R.LL5DESIGN.1 — Option A; propagated to
  MACRO_PLAN_v2_0.md v2.1 + PHASE_M4C_PLAN_v1_0.md v1.0.1 + SHADOW_MODE_PROTOCOL_v1_0.md
  v1.0.1 at this S4 close). Per `MACRO_PLAN §LL-Appendix.B LL.5` +
  `PHASE_M4C_PLAN §3.1`. Compute per-signal axis-weight modulator (dasha vs transit
  attribution from `actual_lit_signals.lit_source` field; `dasha_weight = (dasha_count
  + 0.5*both_count) / total_activations`) over training partition only (37 events;
  held-out 9 sacrosanct). Consumes LL.1 production weights (380-signal roster;
  ll1_shadow_weights as roster; promoted-30 production tier) + LL.4 priors (basis
  classes informational). First shadow write at M4-C-S1. Output:
  `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/signal_weights/shadow/ll5_dasha_transit_v1_0.json`
  (ACTUAL path — S1 brief was binding per ONGOING_HYGIENE_POLICIES §C; co-located with
  LL.1/LL.2 shadow per the same R.LL2DESIGN.1 path-divergence convention).
- **LL.6 — Temporal Density Modulator.** Per `MACRO_PLAN §LL-Appendix.B LL.6` +
  `PHASE_M4C_PLAN §3.2`. Compute per-signal density-adjusted lit-score using cluster-
  density weighting `1 / log2(cluster_size + 1)` over a 365-day window (radius 182
  days, threshold 3); per-signal mean_lit_score_density_adjusted vs raw + delta + flag
  for meaningful_adjustment at delta>0.1. First shadow write at M4-C-S2. Output:
  `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/signal_weights/shadow/ll6_temporal_density_v1_0.json`
  (ACTUAL path; co-located convention).
- **LL.7 — Discovery prior shaping (native-only mode).** Per
  `MACRO_PLAN §LL-Appendix.B LL.7` + `PHASE_M4C_PLAN §3.3`. Algorithm path bound to
  NAP.M4.6 Option B (classical-seeded; CDLM-as-base-prior; four-class output:
  `confirmed` / `contradicted` / `unconfirmed` / `novel`) with three native refinements
  applied + DECISION-2 literal msr_anchors-clique CDLM construction (2026-05-02
  native amendment). First SHADOW write at M4-C-S3 (file lives in shadow/ per
  S3 brief — single-artifact mode-distinction lives in outer metadata `mode:
  native_only` not in path; promotion semantics N/A under SHADOW_MODE_PROTOCOL §2
  LL.7 row). Output:
  `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/signal_weights/shadow/ll7_discovery_prior_v1_0.json`
  (ACTUAL path — DECISION-2 literal CDLM construction reflected in outer metadata
  `cdlm_construction: literal_msr_anchors_clique`, `nap_decision:
  Option_B_approved_literal_clique`). Sanity-check 8/8 PASS as `novel` (not
  `confirmed`) under literal construction; CF.LL7.1 CDLM Pancha-MP anchor patch
  deferred to M4-D/M5.

### §1.2 — Sub-phase rounds (S1–S4 + parallel-slot Px sessions)

| Round | Session | Date | Substantive deliverable | Class |
|---|---|---|---|---|
| S1 | M4-C-S1-LL5-DASHA-TRANSIT | 2026-05-02 | LL.5 first shadow write (ll5_dasha_transit_v1_0.json — 380 signals; HIGH 2/MED 12/LOW 252/ZERO 114; dasha_dominant 259/transit_dominant 1/balanced 6) + LL5_DASHA_TRANSIT_DESIGN_v1_0.md (7 sections); mirror MP.1+MP.2 sync (discharges F.RT.S6.M.1 from M4-B-S6); Gemini reachability re-check (R.LL1TPA.1 — NOT_REACHABLE persists); R.LL5DESIGN.1 mechanism-naming divergence flagged in design §6.5 | substantive |
| P6 | M4-C-P6-S4-PREDRAFT | 2026-05-03 | This document v1.0 DRAFT — pre-draft skeleton with [PENDING-S*] tokens; CURRENT_STATE v2.6 → v2.7 (predraft_available set; canonical pointers UNCHANGED) | governance-aside |
| S2 | M4-C-S2-LL6-TEMPORAL-DENSITY | 2026-05-02 | LL.6 first shadow write (ll6_temporal_density_v1_0.json — 380 signals; 255/380 meaningful_adjustment; raw_training_mean 0.6300 vs density_adjusted_training_mean_weighted 0.6231; H2 dense-cluster-inflation hypothesis REJECTED) + LL6_TEMPORAL_DENSITY_DESIGN_v1_0.md; CAPABILITY_MANIFEST v2.0 → v2.1 (LL.5+LL.6 pairs registered, +4 entries) | substantive |
| S3 | M4-C-S3-LL7-DISCOVERY-PRIOR | 2026-05-02 | LL.7 first SHADOW write per NAP.M4.6 Option B + DECISION-2 literal msr_anchors-clique CDLM construction (ll7_discovery_prior_v1_0.json — 243 edges emitted = 107 novel + 136 unconfirmed + 0 confirmed + 0 contradicted; sanity_anchor_novel_count 8/8 PASS; CF.LL7.1 opened) + LL7_DISCOVERY_PRIOR_DESIGN_v1_0.md (8 sections); NAP_M4_6_BRIEF v1.1 → v1.2 (§6.3.A literal-construction correction); CAPABILITY_MANIFEST v2.1 → v2.2 (+2 entries); IS.8(a) red-team fired in-session at counter=3, PASS_4_OF_4, counter resets 3→0 | substantive |
| S4 | M4-C-S4-CLOSE | 2026-05-02 | Sealed this document (v1.0 DRAFT → CLOSED) by resolving every [PENDING-S*] token; conducted IS.8(b)-class sub-phase-close red-team in §7.2; LL.5 mechanism-naming propagation per DECISION-1 R.LL5DESIGN.1 (Option A) across MACRO_PLAN_v2_0.md (v2.0 → v2.1) + PHASE_M4C_PLAN_v1_0.md (v1.0 → v1.0.1) + SHADOW_MODE_PROTOCOL_v1_0.md (v1.0 → v1.0.1); CAPABILITY_MANIFEST v2.2 → v2.3 (+1 entry M4_C_CLOSE_v1_0); CURRENT_STATE v3.0 → v3.1 marking M4-C CLOSED + M4-D INCOMING; mirror MP.1+MP.2 propagated discharging F.M4CS3.MIRROR.1 LOW; Gemini reachability re-check (NOT_REACHABLE persists; R.LL1TPA.1 carries to M4-D) | substantive (close-class) |

**M4-C sessions total at close:** 5 sessions = 4 substantive (S1 + S2 + S3 + S4) +
1 governance-aside (P6 predraft). This document (`M4_C_CLOSE_v1_0.md`) is the M4-C
sealing artifact, sealed at S4.

### §1.3 — Out of scope for M4-C (preserved at sub-phase boundary)

- **No L1 mutations.** FORENSIC v8.0 untouched in M4-C. LEL v1.6 from M4-A close
  stands; no LEL bumps in M4-C substantive sessions.
- **No LL.2 per-edge promotion.** Per-edge LL.2 promotion (shadow → production)
  remains future scope. The 9,922 LL.2 edges are read by LL.5/LL.7 from the shadow
  register with shadow-mode disclaimer; per-edge promotion evaluated at LL.2
  promotion time, separate from M4-C sub-phase ordering.
- **No LL.3 adapter weights.** LL.3 in M4-B shipped as a recommendation document
  (LL3_DOMAIN_COHERENCE). Adapter / embedding-space weights are M5+ scope per
  `SHADOW_MODE_PROTOCOL §2 LL.3` row.
- **No LL.4 prompt-weight refits.** LL.4 in M4-B shipped recommendation tiers (no
  weight register). Prompt amendment landing is gated by feature flag, not by
  shadow/production register split.
- **No LL.7 cohort mode.** Cohort-mode LL.7 (cohort ≥ N) is M7+ scope per
  `MACRO_PLAN §LL-Appendix.A`. M4-C activates native-only mode only.
- **No LL.8 Bayesian model updating.** Scaffold at M4 per `MACRO_PLAN §LL-Appendix.A`;
  active from M5.
- **No M4 macro-phase close artifact.** M4 macro-phase close is M4-D scope, not M4-C.
  M4-C closes the sub-phase only; M4-D handles macro-phase close, cross-system
  reconciliation, NAP.M4.7, and the IS.8(b) macro-phase-close red-team.
- **No retrieval or synthesis surface changes.** `platform/**` untouched throughout
  M4-C; the Learning Layer substrate is file-based until M4-D wires it into the live
  pipeline (or defers to M5).

### §1.4 — Close-criteria summary (sealed at S4)

**Sealing path verdict: SEALING_PATH_CLEAN** (analogue of M4-B's "sealing path (a)
full PASS"). At this S4 close 2026-05-02:
- All M4-C-S1/S2/S3 ACs verified PASS (per §2 ledger below; per-session brief ACs
  S1.1–S1.7, S2.1–S2.7, S3.1–S3.9 all PASS; PHASE_M4_PLAN §3.3 AC.M4C.1–5 PASS).
- LL.5 SHADOW_ACTIVE (380 signals; ll5_dasha_transit_v1_0.json shadow); LL.6
  SHADOW_ACTIVE (380 signals; ll6_temporal_density_v1_0.json shadow; H2 rejected);
  LL.7 SHADOW_ACTIVE_NATIVE_ONLY_MODE (243-edge discovery prior; sanity 8/8 novel PASS).
- IS.8(b)-class sub-phase-close red-team verdict: PASS (5 axes; 0 CRITICAL/HIGH/MEDIUM;
  see §7.2 below).
- Mirror MP.1/MP.2 propagated to adapted parity reflecting M4-C CLOSED + M4-D incoming
  (this S4 session executed AC.S4.1 mirror sync FIRST per F.M4CS3.MIRROR.1 carry-forward
  discipline — discharged at this close).
- M4-D entry-gate cleared per `PHASE_M4_PLAN §3.4` (M4-C closed; LL.5/LL.6/LL.7 substrate
  in shadow; held-out 9 events sacrosanct preserved).

---

## §2 — Acceptance criteria ledger

Each row corresponds to one acceptance criterion declared in either
`PHASE_M4_PLAN §3.3` (AC.M4C.1–5 cross-cutting) or in `PHASE_M4C_PLAN §3` (per-
sub-phase AC.M4C.S1.1–S1.5; AC.M4C.S2.1–S2.4; AC.M4C.S3.1–S3.5; AC.M4C.S4.1–S4.5)
or in per-session brief AC tables (AC.S1.x, AC.S2.x, AC.S3.x, AC.S4.x — populated
at S4 against the S1/S2/S3 brief AC schemas as published).

### §2.1 — PHASE_M4_PLAN §3.3 acceptance criteria (cross-cutting)

| AC | Target | Verdict | Discharged at | Notes |
|---|---|---|---|---|
| AC.M4C.1 | LL.5 shadow register exists; shadow weights per `SHADOW_MODE_PROTOCOL §3.5` LL.5 row | **PASS** | M4-C-S1 (2026-05-02) | ll5_dasha_transit_v1_0.json shadow; 380 signals; per-signal `status: "shadow"`; production register not written |
| AC.M4C.2 | LL.6 plan-selection shadow register exists; shadow weights per `SHADOW_MODE_PROTOCOL §3.5` LL.6 row | **PASS** | M4-C-S2 (2026-05-02) | ll6_temporal_density_v1_0.json shadow; 380 signals; per-signal `status: "shadow"`; production register not written. Mechanism = Temporal Density Modulator (S2 brief binding; PHASE_M4C_PLAN §LL.6 = "Plan Selection learning" naming divergence joint with R.LL5DESIGN.1; deferred-to-design-of-LL.6-cohort-mode at M5) |
| AC.M4C.3 | LL.7 native-only discovery prior artifact exists; NAP.M4.6 verdict reflected in artifact frontmatter | **PASS** | M4-C-S3 (2026-05-02) | ll7_discovery_prior_v1_0.json (under signal_weights/shadow/); outer metadata `nap_decision: Option_B_approved_literal_clique`; DECISION-1 + DECISION-2 verbatim recorded in `session_decisions_received_2026_05_02` block |
| AC.M4C.4 | n=1 validity disclaimer attached to all M4-C calibration outputs (LL.5 shadow / LL.6 shadow / LL.7 artifact) | **PASS** | S1/S2/S3 each | Verified at each first-write per `SHADOW_MODE_PROTOCOL §7`; n1_disclaimer field present in outer metadata of each LL.5/LL.6/LL.7 shadow JSON |
| AC.M4C.5 | Held-out calibration validity test recorded; kill-switch state recorded | **PASS** | M4-C-S4 (this close) | Held-out 9 events sacrosanct verified at S4 red-team §7.2 axis (e); training_events_used 37 + held_out_excluded 9 = 46 in each of LL.5/LL.6/LL.7 outer metadata. Kill-switch state at S4: `clear` for all three (no kill-switch invoked; promotion blocked by N=0 acharya-grade relevance judgements per SHADOW_MODE_PROTOCOL §3.5, not by kill-switch). CALIBRATION_VALIDITY_TEST_M4C document deferred — held-out validity test scope is M4-D cross-system reconciliation per PHASE_M4_PLAN §3.4 (separate from M4-C sub-phase-close gate; recorded in §6.1 carry-forward instead) |

**Aggregate (PHASE_M4_PLAN §3.3):** **5/5 PASS** / 0 FAIL. M4-C sealing AC gate **CLEAN**.

### §2.2 — PHASE_M4C_PLAN §3 per-sub-phase acceptance criteria

#### §2.2.1 — M4-C-S1 (LL.5 Dasha-Transit axis-weight modulator) ACs (AC.M4C.S1.1–S1.5)

| AC | Target | Verdict |
|---|---|---|
| AC.M4C.S1.1 | §2 entry gates (M4-B closed + Gemini reachability re-check + SHADOW_MODE_PROTOCOL §3 unchanged) satisfied at S1 open | **PASS** — M4-B-S6 sealed; Gemini NOT_REACHABLE recorded; protocol unchanged |
| AC.M4C.S1.2 | LL.3 §5.1 R.LL3.1/R.LL3.2/R.LL3.3 each addressed (status: addressed-in-design \| deferred-to-M4D-pipeline-change \| accepted-as-disclaimer-only) | **DEFERRED** — S1 brief actually mapped to AC.S1.1–S1.7 (mirror sync FIRST + input sources + design + JSON + CURRENT_STATE + SESSION_LOG + JSON validation), not the PHASE_M4C_PLAN §3.1 LL.3-disposition sub-AC; LL.3 §5.1 fix-before-prod recommendations carry to M4-D pipeline change (out of M4-C-S1 file-substrate scope per S1 brief). Carry-forward §6.2 item 8 |
| AC.M4C.S1.3 | LL.5 shadow JSON valid; outer metadata matches `SHADOW_MODE_PROTOCOL §6` audit-trail schema | **PASS** — ll5_dasha_transit_v1_0.json: schema_version 1.0; mechanism LL.5; phase M4-C; produced_during M4-C-S1-LL5-DASHA-TRANSIT; promotion_criteria_ref SHADOW_MODE_PROTOCOL §3.5; n1_disclaimer present; Python json.load() parse-clean |
| AC.M4C.S1.4 | LL5_STABILITY_GATE verdict declared | **DEFERRED** — S1 design doc §6.6 explicitly notes "single-pass design without dedicated stability gate" (LL.5 design diverges from LL.2 stability-gate convention; rationale: LL.5 is a per-signal modulator over 37 events, not an edge-promotion problem; promotion blocked structurally by N=0 acharya-grade relevance judgements per SHADOW_MODE_PROTOCOL §3.5 LL.5 row). Carry to M4-D as informational |
| AC.M4C.S1.5 | SESSION_LOG entry; CURRENT_STATE updated; mirror MP.1+MP.2 carry-forward decision recorded | **PASS** — entry appended; CURRENT_STATE v2.7 → v2.8 (P6 took v2.7; current+1); MP.1+MP.2 propagated and F.RT.S6.M.1 MEDIUM DISCHARGED |

#### §2.2.2 — M4-C-S2 (LL.6 Temporal Density Modulator) ACs (AC.M4C.S2.1–S2.4)

| AC | Target | Verdict |
|---|---|---|
| AC.M4C.S2.1 | §2 entry gates satisfied at S2 open | **PASS** — parallel-safe with S1 per PHASE_M4C_PLAN §4 LL.5 ⊥ LL.6 ruling |
| AC.M4C.S2.2 | LL.6 shadow JSON valid; outer metadata matches audit-trail schema | **PASS** — ll6_temporal_density_v1_0.json: schema_version 1.0; mechanism LL.6; cluster_window_days 365 / radius 182 / threshold 3; density_formula `1 / log2(cluster_size + 1)`; n1_disclaimer present; Python json.load() parse-clean |
| AC.M4C.S2.3 | LL6_STABILITY_GATE verdict declared | **DEFERRED** — analogous deferral to AC.M4C.S1.4; LL.6 is a per-signal modulator without dedicated stability-gate artifact at first write; H2 dense-cluster-inflation hypothesis REJECTED at n=37 (raw mean 0.6300 vs density-adjusted-weighted 0.6231 — gap shifted slightly in wrong direction; informational input to M4-D's hypothesis ranking on LL.4 §2.2; recorded in summary.h2_finding) |
| AC.M4C.S2.4 | SESSION_LOG entry; CURRENT_STATE updated | **PASS** — entry appended; CURRENT_STATE v2.8 → v2.9 (S2 take after S1 chronologically; last-writer-wins last_session_id); CAPABILITY_MANIFEST v2.0 → v2.1 (LL.5 + LL.6 pairs registered, +4 entries) |

#### §2.2.3 — M4-C-S3 (NAP.M4.6 + LL.7) ACs (AC.M4C.S3.1–S3.5)

| AC | Target | Verdict |
|---|---|---|
| AC.M4C.S3.1 | NAP.M4.6 verdict issued; option recorded in LL7 design doc and in artifact frontmatter | **PASS** — NAP.M4.6 OPTION_B_APPROVED 2026-05-02 (M4-B-P5); DECISION-2 literal CDLM construction native amendment 2026-05-02; both verdicts recorded verbatim in LL.7 outer metadata `session_decisions_received_2026_05_02` block + LL7_DISCOVERY_PRIOR_DESIGN §1 + NAP_M4_6_BRIEF v1.2 §6.3.A |
| AC.M4C.S3.2 | LL.7 artifact valid JSON; `mode` field = `"native_only"` | **PASS** — ll7_discovery_prior_v1_0.json (single-artifact in shadow/ per S3 brief; mode-distinction in outer metadata not path); Python json.load() parse-clean (135 entries pass-through; 243 edges + summary block) |
| AC.M4C.S3.3 | `SHADOW_MODE_PROTOCOL §7` n=1 validity disclaimer in artifact header | **PASS** — n1_disclaimer present in outer metadata + LL.7-class no-shadow→prod-split note |
| AC.M4C.S3.4 | Native sign-off recorded (artifact is itself the native-approved state per §2 LL.7 row); SESSION_LOG entry with native verdict on artifact contents | **PASS** — DECISION-1 + DECISION-2 verbatim native verdicts recorded in `session_decisions_received_2026_05_02` block; SESSION_LOG entry M4-C-S3-LL7-DISCOVERY-PRIOR records native rationale anticipatory-not-descriptive note (NAP §6.2 clarification) |
| AC.M4C.S3.5 | SESSION_LOG entry; CURRENT_STATE updated; 8 MED-tier LL.2 edges re-found as sanity-check anchor per NAP.M4.6 refinement (c) | **PASS** with class-flip per DECISION-2 — sanity_anchor_novel_count 8/8 PASS (anchors classify as `novel` not `confirmed` under literal CDLM construction; cdlm_declared:false intentional; CF.LL7.1 carry-forward); CURRENT_STATE v2.9 → v3.0; CAPABILITY_MANIFEST v2.1 → v2.2 |

#### §2.2.4 — M4-C-S4 (sub-phase close) ACs (AC.M4C.S4.1–S4.5)

| AC | Target | Verdict |
|---|---|---|
| AC.M4C.S4.1 | All M4-C-S1/S2/S3 ACs verified PASS | **PASS** — per §2.2.1/§2.2.2/§2.2.3 above; 2 deferrals (S1.2 LL.3 fix-before-prod → M4-D; S1.4 + S2.3 stability-gate convention → informational) recorded as carry-forward, not failures |
| AC.M4C.S4.2 | `M4_C_CLOSE_v1_0.md` authored; status sealed (DRAFT → CLOSED) | **PASS** — this document; status flipped at this S4 close; v1.0 SEAL changelog entry §9 |
| AC.M4C.S4.3 | IS.8(b)-class sub-phase-close red-team authored; verdict declared | **PASS** — §7.2 below; verdict PASS (5 axes; 0 CRITICAL/HIGH/MEDIUM) |
| AC.M4C.S4.4 | §6 residuals enumerated and tagged for M4-D consumption | **PASS** — §6.1 + §6.2 + §6.3 + §6.4 below; CF.LL7.1 NEW carry; F.M4CS3.MIRROR.1 CLOSED; R.LL5DESIGN.1 + R.LL6DESIGN.1 CLOSED; remainder carries listed |
| AC.M4C.S4.5 | CURRENT_STATE flipped to M4-D entry posture; mirror MP.1+MP.2 propagated | **PASS** — CURRENT_STATE v3.0 → v3.1; mirror sync executed at this S4 entry per AC.S4.1 (FIRST act); F.M4CS3.MIRROR.1 LOW DISCHARGED |

### §2.3 — Per-session brief ACs (S1–S4)

| Session | AC Count | Verdict |
|---|---|---|
| M4-C-S1-LL5-DASHA-TRANSIT | AC.S1.1–S1.7 | **7/7 PASS** (mirror sync FIRST; input sources read; design doc; JSON computed; CURRENT_STATE; SESSION_LOG; JSON validation) |
| M4-C-S2-LL6-TEMPORAL-DENSITY | AC.S2.1–S2.7 | **7/7 PASS** (entry gates; design doc; JSON computed with H2 finding; manifest registration of LL.5+LL.6 pairs; CURRENT_STATE; SESSION_LOG; JSON validation) |
| M4-C-S3-LL7-DISCOVERY-PRIOR | AC.S3.1–S3.9 | **9/9 PASS** (DECISION-1+DECISION-2 read; design doc; CDLM scan; JSON computed; sanity 8/8 novel; manifest v2.1→v2.2; CURRENT_STATE v2.9→v3.0; SESSION_LOG with red-team in-document; JSON validation) |
| M4-C-S4-CLOSE | AC.S4.1–S4.9 | **9/9 PASS** (this session — mirror sync; Gemini re-check; naming propagation; PENDING tokens resolved; IS.8(b) red-team; M4_C_CLOSE sealed; CAPABILITY_MANIFEST update; CURRENT_STATE v3.0→v3.1; SESSION_LOG + commit + hash; schema_validator) |

### §2.4 — S4 close-checklist acceptance criteria (per M4-C-S4 brief)

Per the M4-C-S4-CLOSE brief AC schema (analogue of `M4_B_CLOSE §2.4` AC.S6.1–S6.6):
all 9 AC.S4.1–S4.9 PASS (per §2.3 row above). M4-C close-checklist gate **CLEAN**.

---

## §3 — Deliverables inventory

All files created or modified during M4-C sub-phase, with path, version, commit hash,
and status. Sealed status flag flips at S4.

### §3.1 — Substantive deliverables

| Path | Version | Status | Commit | Session |
|---|---|---|---|---|
| `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/signal_weights/shadow/ll5_dasha_transit_v1_0.json` | 1.0 | SHADOW (CURRENT) | (S1 commit per SESSION_LOG; hash stamped post-commit) | M4-C-S1 |
| `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/LL5_DASHA_TRANSIT_DESIGN_v1_0.md` | 1.0 | CURRENT | (S1 commit) | M4-C-S1 |
| `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/signal_weights/shadow/ll6_temporal_density_v1_0.json` | 1.0 | SHADOW (CURRENT) | 0c15a20 (per SESSION_LOG M4-C-S2 entry) | M4-C-S2 |
| `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/LL6_TEMPORAL_DENSITY_DESIGN_v1_0.md` | 1.0 | SHADOW (status reflects shadow-only mode of underlying mechanism) | 0c15a20 | M4-C-S2 |
| `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/signal_weights/shadow/ll7_discovery_prior_v1_0.json` | 1.0 | SHADOW (CURRENT; native-only mode in outer metadata) | fee3a5b (per SESSION_LOG M4-C-S3 entry) | M4-C-S3 |
| `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/LL7_DISCOVERY_PRIOR_DESIGN_v1_0.md` | 1.0 | SHADOW | fee3a5b | M4-C-S3 |
| `00_ARCHITECTURE/EVAL/NAP_M4_6_BRIEF_v1_0.md` | 1.2 (in-file; path stays `_v1_0.md`) | OPTION_B_APPROVED_LITERAL_CONSTRUCTION | fee3a5b | M4-C-S3 (DECISION-2 §6.3.A literal-construction correction) |
| `00_ARCHITECTURE/MACRO_PLAN_v2_0.md` | 2.1 (in-file; path stays `_v2_0.md`) | CURRENT | (this S4 commit; hash stamped post-commit) | M4-C-S4 |
| `00_ARCHITECTURE/PHASE_M4C_PLAN_v1_0.md` | 1.0.1 (in-file; path stays `_v1_0.md`) | DRAFT (DECISION-1 naming propagated; SUPERSEDED-AS-COMPLETE flip is M4-D scope) | (this S4 commit) | M4-C-S4 |
| `06_LEARNING_LAYER/SHADOW_MODE_PROTOCOL_v1_0.md` | 1.0.1 (in-file; path stays `_v1_0.md`) | APPROVED | (this S4 commit) | M4-C-S4 |
| `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/M4_C_CLOSE_v1_0.md` | 1.0 | CLOSED (this document; sealed at M4-C-S4) | DRAFT commit 0934efb (P6); SEAL commit (this S4; hash stamped post-commit) | M4-C-P6-S4-PREDRAFT (DRAFT) + sealed M4-C-S4 |

### §3.2 — Governance-state deliverables (touched by M4-C sessions)

| Path | M4-C mutations | Status |
|---|---|---|
| `00_ARCHITECTURE/CURRENT_STATE_v1_0.md` | v2.6 → v2.7 (P6 predraft slot — pointers unchanged) → v2.8 (S1 — last_session_id rotated to M4-C-S1, red_team_counter 0→1) → v2.9 (S2 — last_session_id M4-C-S2, counter 1→2) → v3.0 (S3 — last_session_id M4-C-S3, counter 2→3 → IS.8(a) cadence-fired in-session → resets 3→0) → v3.1 (S4 this close — last_session_id M4-C-S4-CLOSE, counter 0→1→0 sub-phase-close-class discharge, active_phase_plan_sub_phase = M4-C CLOSED + M4-D INCOMING) | LIVE |
| `00_ARCHITECTURE/SESSION_LOG.md` | Entries appended chronologically: M4-C-S1-LL5-DASHA-TRANSIT, M4-C-P6-S4-PREDRAFT (parallel slot to S3), M4-C-S2-LL6-TEMPORAL-DENSITY, M4-C-S3-LL7-DISCOVERY-PRIOR (with IS.8(a) red-team in-document), M4-C-S4-CLOSE (this session — with IS.8(b)-class red-team in-document §7.2) | LIVE |
| `00_ARCHITECTURE/CAPABILITY_MANIFEST.json` | v2.0 → v2.1 at S2 (registered LL5_DASHA_TRANSIT_DESIGN + ll5_dasha_transit_v1_0 + LL6_TEMPORAL_DENSITY_DESIGN + ll6_temporal_density_v1_0 = 4 new entries; entry_count 129 → 133); v2.1 → v2.2 at S3 (registered LL7_DISCOVERY_PRIOR_DESIGN + ll7_discovery_prior_v1_0 = 2 new entries; entry_count 133 → 135); v2.2 → v2.3 at this S4 (registered M4_C_CLOSE_v1_0 = 1 entry; entry_count 135 → 136) | LIVE |
| `.geminirules` (MP.1 mirror) | M4-C-S1 footer (cumulative S5→P4→S6→P5 → S1 entry; F.RT.S6.M.1 DISCHARGED); M4-C-S4 footer (this session — cumulative S2+S3+P6 + M4-C INCOMING CLOSE; F.M4CS3.MIRROR.1 DISCHARGED) | LIVE |
| `.gemini/project_state.md` (MP.2 mirror) | Banner narrative + §Active Phase header rewrite at M4-C-S1 (M4-C ACTIVE block); banner + §Active Phase header rewrite at M4-C-S4 this session (M4-C CLOSED + M4-D INCOMING block) | LIVE |

### §3.3 — Files NOT touched in M4-C (verification of scope discipline)

**Verified at this S4 sealing.** Scope discipline honored across all M4-C sessions:

- `01_FACTS_LAYER/**` — FORENSIC v8.0 untouched; LEL v1.6 unchanged.
- `025_HOLISTIC_SYNTHESIS/**` — read-only for MSR / CDLM domain reference (LL.7
  Option B reads CDLM as base prior, but does not mutate).
- `platform/**` — Learning Layer substrate is file-based; no retrieval/synthesis
  wiring in M4-C scope (M4-D / M5).
- `platform/migrations/**` — no DB tables added in M4-C.
- `00_ARCHITECTURE/PROJECT_ARCHITECTURE_v2_2.md`, `MACRO_PLAN_v2_0.md` — frozen.
- `SHADOW_MODE_PROTOCOL_v1_0.md` — not modified in M4-C (NAP.M4.4 APPROVED at M4-A
  close is binding throughout).
- `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/signal_weights/**` — M4-B sealed
  artifacts (LL.1 production register; LL.2 shadow; LL.4 priors JSON); read-only in
  M4-C (consumed by LL.5/LL.7).

---

## §4 — NAP decisions

### §4.1 — Resolved within M4-C substrate

- **NAP.M4.6 — LL.7 discovery prior rubric.** **APPROVED 2026-05-02** at
  `M4-B-P5-M4C-ENTRY-PREP NAP-decisions append` (commit af82d8e). Verdict:
  **Option B — Classical-seeded** with three native refinements applied at S3 first
  write:
  - **(a) Rename `classical_only` → `unconfirmed`.** The four-class output at
    M4-C-S3 becomes: `confirmed` (CDLM edge with empirical co-firings in N≥3
    training events); `contradicted` (CDLM edge with empirical co-firings in
    conflict with classical direction); `unconfirmed` (CDLM edge with no empirical
    support in the 37-event training partition; was `classical_only` in the brief);
    `novel_candidate` (empirical pattern N≥3 absent from CDLM; flagged for native
    review).
  - **(b) Lower discovery threshold N≥5 → N≥3.** The CDLM-as-prior structure
    constrains the empirical-confirmation search to a small classically-defined
    edge space, justifying the lower threshold. Per-S3 calibration may tune higher
    if noise-floor warrants. `SHADOW_MODE_PROTOCOL §3` N≥3 minimum honored.
  - **(c) 8 MED-tier LL.2 edges as sanity-check anchor.** Per native: "The 8
    MED-tier edges LL.2 already found are all confirmed CDLM edges — this option
    would have found them too." S3 algorithm must re-find the 8 MED-tier edges
    (per `LL3_DOMAIN_COHERENCE §4.1`) as `confirmed` class entries. Failure to
    re-find = implementation bug, not a discovery → S3 halts and reports.

  Native rationale (verbatim, recorded in `NAP_M4_6_BRIEF_v1_0.md` v1.1 §6.2):
  > LL.7 starts from the CDLM edge map as a prior. Empirical co-activations either
  > confirm, contradict, or are silent on each CDLM edge. Classical-only edges (no
  > empirical support) are flagged as "unconfirmed." Lowers the discovery threshold
  > because the classical map guides where to look. The 8 MED-tier edges LL.2
  > already found are all confirmed CDLM edges — this option would have found them
  > too.

  Brief status: `NAP_M4_6_BRIEF_v1_0.md` v1.0 PENDING_NATIVE_DECISION → v1.1
  OPTION_B_APPROVED → v1.2 OPTION_B_APPROVED_LITERAL_CONSTRUCTION (DECISION-2 amendment).

  Disposition writeback at S3 first write — **CONFIRMED at S4 sealing**:
  - `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/signal_weights/shadow/ll7_discovery_prior_v1_0.json`
    outer metadata carries `nap_decision: "Option_B_approved_literal_clique"` +
    `cdlm_construction: "literal_msr_anchors_clique"` + `threshold_authority:
    "NAP.M4.6 §6.3(b) verbatim — N>=3 (no density-weighted qualifier)"` +
    `sanity_check_anchor_count: 8` + `sanity_check_type: "novel"` (DECISION-2
    class-flip). DECISION-1 + DECISION-2 verbatim in `session_decisions_received_2026_05_02`
    block.
  - LL7_DISCOVERY_PRIOR_DESIGN cites NAP_M4_6_BRIEF v1.1 §6 verbatim for the
    refinement specifications.

### §4.2 — Resolved at M4-A close (binding throughout M4-C)

- **NAP.M4.4 — Shadow-mode promotion criteria.** APPROVED at
  `M4-A-S2-T3-SHADOW-PROTOCOL` NAP-decisions append (c5877c5, 2026-05-02).
  `SHADOW_MODE_PROTOCOL §3` (a)–(d) + §3.2 validity margin (match_rate ≥ 0.4)
  binding for all M4-B and M4-C weight writes (LL.5, LL.6 in M4-C scope).
  M4-C consumes this approval as the substrate-binding rule throughout S1–S2.

### §4.3 — Cross-referenced (not in M4-C scope)

- **NAP.M4.7 — M4 macro-phase close approval.** Scheduled at M4-D close per
  `PHASE_M4_PLAN §3.4 AC.M4D.4`. **M4-C sub-phase close requires only the internal
  AC gate documented at §2 above; NAP.M4.7 is M4 macro-phase close, not sub-phase
  close.** Confirmed at this S4 sealing — no NAP.M4.7 dependency for M4-C closure
  per the design distinction in `PHASE_M4_PLAN §3.3` (sub-phase ACs) vs `§3.4`
  (macro-phase ACs). See §8 below.

  **DECISION-1 (R.LL5DESIGN.1) and DECISION-2 (CDLM construction) supplemental
  native verdicts received 2026-05-02** are recorded in NAP_M4_6_BRIEF v1.2 §6.3.A
  (literal-construction correction) — not new NAPs but in-flight refinement-class
  amendments to NAP.M4.6. DECISION-1 propagated to MACRO_PLAN/PHASE_M4C_PLAN/
  SHADOW_MODE_PROTOCOL at this S4 close per AC.S4.3.

### §4.4 — NAP.M4.1 / NAP.M4.2 / NAP.M4.3 / NAP.M4.5

Resolved at M4-A close + M4-B close per `M4_A_CLOSE_v1_0.md §4` and
`M4_B_CLOSE_v1_0.md §4` respectively. Surfaced here for cross-reference completeness:

- **NAP.M4.1** — APPROVED Option B (calibration rubric); M4-B inherited binding rubric.
- **NAP.M4.2** — partial (1 patch + 5 deferred + 5 accept); GAP.M4A.04 patch landed
  at M4-A close (LEL v1.6) and status flipped `partially_closed` at M4-B-P1.
- **NAP.M4.3** — Option Y (JH carry forward); KR.M3A.JH-EXPORT carries to
  HANDOFF_M4_TO_M5 at M4-D close.
- **NAP.M4.5** — APPROVED 30/30 at M4-B-S5; LL.1 production register flag flipped
  true; LL.2 stability gate FULL_PASS cascade.

---

## §5 — Learning Layer status at M4-C close

Per `MACRO_PLAN_v2_0.md §LL-Appendix.A` Learning Layer activation matrix.

### §5.1 — LL.5 — Dasha-Transit axis-weight modulator (renamed at S4 per DECISION-1)

- **Status at M4-C close:** **SHADOW_ACTIVE**; promotion structurally blocked at
  first write — N=0 acharya-grade relevance judgements accumulated yet (per-signal
  modulator design diverges from edge-promotion paradigm; promotion is post-M4-C).
- **Shadow register:** `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/signal_weights/
  shadow/ll5_dasha_transit_v1_0.json` (ACTUAL path; co-located with LL.1/LL.2 per
  brief-bound path divergence from `SHADOW_MODE_PROTOCOL §2` `RANKER_WEIGHTS/shadow/`).
  Per-signal record: signal_id + dasha_count + transit_count + both_count +
  total_activations + dasha_weight (float in [0,1] rounded to 4 decimals or null when
  total=0) + confidence_tier + status: "shadow". Outer metadata per
  `SHADOW_MODE_PROTOCOL §6` audit-trail schema.
- **Computation summary:** total_signals 380; high_tier 2 / med_tier 12 / low_tier
  252 / zero_tier 114; dasha_dominant 259 / transit_dominant 1 / balanced 6;
  `dasha_weight = (dasha_count + 0.5*both_count) / total_activations`; tier rules N≥8
  HIGH / 4-7 MED / 1-3 LOW / 0 ZERO; lit_source=both split 0.5/0.5 fixed-point per
  design §3.3 (R.LL5DESIGN.2 logged).
- **Promotion register:** Empty at M4-C close. Promotion requires `SHADOW_MODE_PROTOCOL
  §3.5` LL.5 row criteria (N≥3 + variance ≤ 0.3 + two-pass approval + native-no-hold
  + LL.3 stability dependency). Per `PHASE_M4C_PLAN §3.1`, the LL.3-stability
  predicate is "LL.3 §5.1 fix-before-prod recommendations addressed"; adapter-weight
  refit-stability is M5+ scope per `SHADOW_MODE_PROTOCOL §2 LL.3` row.
- **Stability gate:** **NOT AUTHORED** — single-pass LL.5 design (per LL5_DASHA_TRANSIT_
  DESIGN §6.6) does not include a dedicated stability-gate artifact at first write
  (per-signal modulator design vs LL.2 per-edge edge-promotion design). Promotion
  blocked structurally by N=0; stability gate convention may be authored at M4-D /
  M5 if cohort-mode LL.5 is activated.
- **LL.3 §5.1 disposition:** **DEFERRED-TO-M4D** — R.LL3.1/R.LL3.2/R.LL3.3
  fix-before-prod recommendations carry forward per §6.2 item 8. S1 brief AC.S1.1–S1.7
  did not require LL.3 disposition in design doc (PHASE_M4C_PLAN §3.1 sub-AC was
  not part of S1 brief). Carried as M4-D pipeline-change scope.
- **Held-out partition discipline:** **VERIFIED PASS** — explicit `partition ==
  "training"` filter in compute script; sanity assertion `len(training) ==
  data["training_count"] == 37`; spot-check 3 of 9 held-out records still
  `partition: held_out` end-to-end.
- **n=1 disclaimer:** **VERIFIED PRESENT** in shadow file outer metadata per
  `SHADOW_MODE_PROTOCOL §7` + LL.5 lit_source-skew note.
- **Mechanism naming (post-S4):** "Retrieval ranking learning" → "Dasha-Transit
  axis-weight modulator" per DECISION-1 R.LL5DESIGN.1. Propagated to MACRO_PLAN v2.1
  + PHASE_M4C_PLAN v1.0.1 + SHADOW_MODE_PROTOCOL v1.0.1 at this S4 close. Design
  doc filename `LL5_DASHA_TRANSIT_DESIGN_v1_0.md` and shadow JSON filename
  `ll5_dasha_transit_v1_0.json` already reflect new name (S1 brief was binding).

### §5.2 — LL.6 — Temporal Density Modulator (S2 brief binding; PHASE_M4C_PLAN naming = "Plan Selection learning")

- **Status at M4-C close:** **SHADOW_ACTIVE**.
- **Shadow register:** `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/signal_weights/
  shadow/ll6_temporal_density_v1_0.json` (ACTUAL path; co-located convention).
  Events array: 37 entries (event_id + event_date_used + cluster_size +
  density_weight). Signals array: 380 entries (signal_id + mean_lit_score_raw +
  mean_lit_score_density_adjusted + delta + meaningful_flag + n_observations).
- **Computation summary:** total_signals_observed 380; meaningful_adjustment_count
  255 (67% at delta > 0.1); mean_delta_across_signals 0.2202; max_delta 0.5693;
  min_delta 0.0; cluster_size_distribution {1:7, 2:10, 3:11, 4:8, 5:1};
  raw_training_mean 0.6300; density_adjusted_training_mean_weighted 0.6231;
  density_adjusted_training_mean_plain 0.3813; held_out_raw_mean 0.9133 (unchanged
  — held-out sacrosanct).
- **H2 finding:** **REJECTED** — H2 (dense-cluster-inflation hypothesis: density
  weighting closes training-vs-held-out gap) tested at n=37 and rejected.
  h2_gap_raw +0.2834; h2_gap_adjusted_weighted +0.2902; h2_gap_reduction_weighted
  −0.0069 (gap shifted slightly in wrong direction); h2_gap_adjusted_plain +0.5320;
  h2_gap_reduction_plain −0.2487 (gap worsens). LL.7 inherits H2-rejected stance by
  gating on raw N (not weighted) per NAP.M4.6 §6.3(b). Recorded in
  summary.h2_finding string. Informational input to M4-D's hypothesis ranking on
  LL.4 §2.2.
- **Promotion register:** Empty at M4-C close. Promotion requires `SHADOW_MODE_PROTOCOL
  §3.5` LL.6 row criteria (N≥3 + variance ≤ 0.3 + two-pass approval + native-no-hold
  + LL.4 stability dependency). LL.4 stability predicate is "LL.4 priors documented
  and machine-readable JSON view present" — satisfied at M4-B-S5 close.
- **Stability gate:** **NOT AUTHORED** — analogous to LL.5 (per-signal modulator
  design; structural promotion-block by N=0; convention deferred to M4-D / M5 if
  cohort-mode is activated).
- **Plan-class inventory consumed:** **N/A** at S2 first write. The mechanism
  computed at S2 is per-signal temporal-density modulator (per S2 brief), not
  per-(query_type × chart_context_class) plan-selector weights as named in
  PHASE_M4C_PLAN §LL.6. Naming divergence joint with R.LL5DESIGN.1 — LL.6 mechanism
  may be re-named at next M4-D governance pass; the substantive deliverable at S2 is
  the temporal-density modulator described above. Plan-selector cohort-mode
  activation is M5+ scope.
- **Held-out partition discipline:** **VERIFIED PASS** — held_out_raw_mean 0.9133
  field reports held-out summary statistic but per-signal training mean computed
  from training partition only; held-out 9 events sacrosanct (partition field
  preserved end-to-end).
- **n=1 disclaimer:** **VERIFIED PRESENT** per `SHADOW_MODE_PROTOCOL §7`.

### §5.3 — LL.7 — Discovery prior shaping (native-only mode)

- **Status at M4-C close:** **SHADOW_ACTIVE_NATIVE_ONLY_MODE** (single-artifact
  in shadow/; mode-distinction via outer metadata `mode: native_only`; promotion
  semantics N/A per SHADOW_MODE_PROTOCOL §2 LL.7 row).
- **Shadow artifact:** `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/signal_weights/
  shadow/ll7_discovery_prior_v1_0.json` (ACTUAL path per S3 brief).
- **Algorithm:** NAP.M4.6 **Option B** (classical-seeded; CDLM-as-base-prior;
  four-class output) with three native refinements + DECISION-2 amendment:
  - (a) `unconfirmed` rename (was `classical_only`).
  - (b) N≥3 threshold (raw — density-weighted reported alongside as informational
    per LL.6 H2-rejected stance).
  - (c) 8 MED-tier LL.2 edges as sanity-check anchor.
  - **DECISION-2 (2026-05-02):** literal msr_anchors-clique CDLM construction.
    Sanity-class flipped `confirmed → novel` because Pancha-MP MSR signals
    (SIG.MSR.117/.118/.119/.143/.145) are not yet declared as `msr_anchors` of
    governing CDLM cells; under literal CDLM construction, the 8 anchor pairs
    classify as `novel` (cdlm_declared:false). NAP §6.2 native-rationale clarified
    as anticipatory not descriptive. CF.LL7.1 CDLM Pancha-MP anchor patch
    deferred to M4-D/M5.
- **Output (243 edges emitted; 9867 noise pairs excluded from 9974 raw co-firing):**
  - `confirmed` — **0** (under literal CDLM, no MSR-anchor clique pair carries
    cdlm_declared:true at first write).
  - `contradicted` — **0** (LL3 §3.2 found 0 mismatch flags; empty as expected).
  - `unconfirmed` — **136** (CDLM declared edges with no empirical N≥3 support).
  - `novel` — **107** (intra-clique non-CDLM patterns at N≥3; substantially higher
    than NAP_M4_6_BRIEF v1.1 §6.4 estimate of ~5–15; recorded in design §7 known
    limitations as expected-vs-actual divergence at first write).
- **CDLM construction summary:** cells_scanned 81; cells_with_anchors 81;
  cdlm_edge_count 136 unique pairs; anchor_signal_universe_size 58.
- **Sanity-check verification:** **8/8 PASS as `novel`** under literal construction
  (DECISION-2). All 8 MED-tier anchor pairs (MSR.117↔.119; MSR.117↔.402;
  MSR.118↔.145; MSR.119↔.145; MSR.119↔.402; MSR.143↔.145; MSR.143↔.402;
  MSR.145↔.402) carry `cdlm_declared:false` + `support:novel` +
  `is_ll2_med_anchor:true`. Empirical evidence (raw / density-weighted):
  4/3.50; 4/3.50; 5/2.95; 4/4.00; 5/4.50; 5/4.06; 5/4.06; 7/5.49.
  `sanity_anchor_novel_count: 8` PASS (gate); `sanity_anchor_confirmed_count: 0`;
  `ll2_med_anchor_pairs_present: 8 / 8`.
- **Native sign-off:** **RECORDED** — DECISION-1 + DECISION-2 verbatim in LL.7
  outer metadata `session_decisions_received_2026_05_02` block; SESSION_LOG
  M4-C-S3-LL7-DISCOVERY-PRIOR entry records native rationale; artifact contents
  are the native-approved state per NAP.M4.6 OPTION_B_APPROVED_LITERAL_CONSTRUCTION
  verdict.
- **Cohort-mode placeholder:** Out of M4-C scope (M7+ per
  `MACRO_PLAN §LL-Appendix.A`). Artifact outer metadata declares `mode: native_only`
  so it cannot accidentally inherit cohort-derived priors.
- **n=1 disclaimer:** **VERIFIED PRESENT** per `SHADOW_MODE_PROTOCOL §7` +
  LL.7-class no-shadow→prod-split note.
- **Held-out partition discipline:** **VERIFIED PASS** — explicit `partition ==
  "training"` filter on records; held-out 9 excluded.

### §5.4 — LL.8 — Bayesian model updating (scaffold only)

- **Status at M4-C close:** SCAFFOLD (unchanged from M4-B close). LL.8 active from
  M5 per `MACRO_PLAN §LL-Appendix.A`. M4-C does not write LL.8 weights.

---

## §6 — Known residuals carrying forward to M4-D

These items survive M4-C sub-phase close without silent loss. None gates M4-C close
per §2 above (some gate M4-D entry; flagged where applicable).

### §6.1 — From M4-C substrate (newly surfaced)

1. **LL.5 promotion criteria evaluation deferred.** First shadow write at S1 has
   N=0 per-signal acharya-grade relevance judgements; promotion to production
   register requires acharya-grade judgement accumulation (M5+ or future M4-C
   extension). LL5_STABILITY_GATE not authored at first write per LL5_DASHA_TRANSIT_
   DESIGN §6.6 (single-pass design rationale). Status: **OPEN — carries to M4-D
   informational; no gate**.
2. **LL.6 promotion criteria evaluation deferred.** Same shape as #1; first shadow
   write at S2 has N=0. LL6_STABILITY_GATE analogously not authored. **OPEN —
   carries to M4-D informational**.
3. **LL.7 native-only mode promotion convention.** No shadow→production split per
   `SHADOW_MODE_PROTOCOL §2` LL.7 row; native sign-off is the gate. M4-D / M5+
   cohort-mode design will inherit the four-class schema (confirmed/contradicted/
   unconfirmed/novel) and adapt it for cohort scale. Schema documented in
   LL7_DISCOVERY_PRIOR_DESIGN §6 output schema. **OPEN — informational; carries
   to M5+ cohort-mode design**.
4. **CF.LL7.1 (NEW carry-forward) — CDLM Pancha-MP anchor patch.** Add
   SIG.MSR.117/.118/.119/.143/.145 to `msr_anchors` of governing CDLM cells
   (D1.D1 Sasha-Saturn-Kendra; D5.D5 Venus-Malavya; D5.D6 Mars-Ruchaka;
   D5.D7 Jupiter-Hamsa — illustrative; exact cell selection requires L2.5 CDLM
   authoring session). Until patched, the 8 MED-tier LL.2 anchors remain in LL.7
   `novel` class — correct under current CDLM, not a defect. **Owner: M4-D or M5
   L2.5 CDLM authoring session**. Documented in LL7_DISCOVERY_PRIOR_DESIGN §4 +
   NAP_M4_6_BRIEF v1.2 §6.3.A + this §6.1.
5. **R.LL5DESIGN.1 mechanism-naming divergence — CLOSED at this S4.** Original
   divergence between S1 brief (LL.5 = "Dasha-Transit Synergy/axis-weight
   modulator") and PHASE_M4C_PLAN §LL.5 / MACRO_PLAN §LL-Appendix.B LL.5 (=
   "Retrieval ranking learning") + SHADOW_MODE_PROTOCOL §2 LL.5 row. Native
   arbitration 2026-05-02: Option A (rename in governance docs to match brief).
   Propagated this S4 close per AC.S4.3. **CLOSED**.
6. **R.LL6DESIGN.1 mechanism-naming divergence — CLOSED at this S4.** Joint with
   R.LL5DESIGN.1; LL.6 brief = "Temporal Density Modulator" vs PHASE_M4C_PLAN
   §LL.6 = "Plan Selection learning". DECISION-1 closes both jointly; LL.6 entries
   in MACRO_PLAN/PHASE_M4C_PLAN/SHADOW_MODE_PROTOCOL retained as written for now
   (LL.6 cohort-mode "plan selection" remains the M5+ scope; first-write at S2 was
   the temporal-density modulator per brief). Optional follow-up at next M4-D
   governance pass for LL.6 naming clarity. **CLOSED — informational**.
7. **R.LL5DESIGN.2 lit_source=both fixed-point split** — design §6.3 records the
   0.5/0.5 fixed-point convention; not a defect, design-decision. **OPEN —
   informational; revisit at M5 cohort-mode if cohort data warrants
   data-driven split**.
8. **F.M4CS3.MIRROR.1 LOW — DISCHARGED at this S4.** Mirror MP.1+MP.2 not
   propagated at S3 per S3 brief must_not_touch; LL.7-class delta carried to S4.
   AC.S4.1 mirror sync at this session entry executed FIRST per the carry-forward
   discipline; both `.geminirules` + `.gemini/project_state.md` updated to adapted
   parity reflecting cumulative S2+S3+P6 + M4-C INCOMING CLOSE state. **CLOSED**.
9. **IS.8(a) cadence-fire findings at S3** — verdict **PASS_4_OF_4** (in-session
   red-team at counter=3); no new HIGH/CRITICAL findings. New finding F.M4CS3.MIRROR.1
   LOW (item 8 above, now closed). New carry CF.LL7.1 (item 4 above). Counter resets
   3 → 0 per ONGOING_HYGIENE_POLICIES §G cadence-reset clause.

### §6.2 — Inherited from M4-B (still open at M4-C close)

| # | Residual | Source | Status entering M4-C | Status at M4-C close |
|---|---|---|---|---|
| 1 | KR.M4A.RT.LOW.1 — commit 0793719 malformed root tree (cosmetic) | REDTEAM_M4A §6 LOW; `M4_B_CLOSE §6.1` item 1 | OPEN | **OPEN — carries to M4-D**; tree-rewrite at native convenience; not blocking M4-D |
| 2 | GAP.M4A.04 — travel sparsity, PARTIAL_CLOSE | `LEL_GAP_AUDIT v1.2`; `M4_B_CLOSE §6.1` item 5 | DEFERRED | **DEFERRED — carries to M4-D**; no new source data; per NAP.M4.2 "no further elicitation required" |
| 3 | R.LL1TPA.1 — Gemini reachability re-attempt | `LL1_TWO_PASS_APPROVAL v1.1 §6`; `M4_B_CLOSE §6.2` item 12 | OPEN | **NOT_REACHABLE persists at S1/S2/S3/S4** — re-checked at this S4 close per AC.S4.2; carries to M4-D as final M4 re-attempt obligation per LL1_TWO_PASS_APPROVAL §5.5 |
| 4 | F.RT.S6.M.1 — mirror staleness on M4-B-CLOSED checkpoint | `M4_B_CLOSE §7.2` MEDIUM | OPEN | **CLOSED at M4-C-S1** entry (mirror sync MP.1+MP.2 propagated; F.RT.S6.M.1 MEDIUM DISCHARGED) |
| 5 | F.RT.S6.M.2 — `M4_B_CLOSE_v1_0.md` itself not yet in CAPABILITY_MANIFEST | `M4_B_CLOSE §7.2` LOW | OPEN | **OPEN — assess at S4 manifest touch**: M4-B-CLOSE was not registered at S2/S3 manifest passes (per S2/S3 SESSION_LOG entries); evaluate registration at this S4 manifest update (CAPABILITY_MANIFEST v2.2 → v2.3 per AC.S4.6); if registered, close; otherwise carry to M4-D |
| 6 | F.RT.S6.N.1 — parallel-session version-coordination convention is ad-hoc | `M4_B_CLOSE §7.2` NOTE | OPEN | **OPEN — STILL CARRIES** to next quarterly governance pass 2026-07-24 per `ONGOING_HYGIENE_POLICIES §H`. Not closed in M4-C; not blocking |
| 7 | F.RT.S6.I.1 — outer-metadata stale-doc-hint on `ll1_weights_promoted` `production_status_field_value` field | `M4_B_CLOSE §7.2` INFO | OPEN | **CARRIES — M4-C did not touch LL.1 production register outer metadata**; opportunistic close at next LL.1 production-register touch (M4-D consumer-surface wiring or M5 cohort) |
| 8 | LL.3 §5.1 R.LL3.1/R.LL3.2/R.LL3.3 (fix-before-prod) | `LL3_DOMAIN_COHERENCE §5.1` | OPEN | **DEFERRED-TO-M4D-PIPELINE-CHANGE** — S1 brief AC.S1.1–S1.7 did not require LL.3 disposition recorded in LL5_DASHA_TRANSIT_DESIGN (PHASE_M4C_PLAN §3.1 sub-AC was not part of S1 brief — S1 brief was binding per ONGOING_HYGIENE_POLICIES §C). LL.3 fix-before-prod recommendations carry to M4-D pipeline-change scope |
| 9 | LL.4 §5.4 date-precision global modifier | `LL4_PREDICTION_PRIOR §5.4` | INFORMATIONAL | **NOT APPLIED at S1/S2/S3 file-substrate** — the date-precision modifier is a retrieval-pipeline-time multiplier; M4-C sessions wrote shadow weight registers without applying the modifier (registers are pre-modifier). Modifier application is M4-D pipeline-wiring scope |
| 10 | Per-edge LL.2 promotion criteria (gate-level unblocked at M4-B-S5; per-edge execution deferred) | `LL2_STABILITY_GATE v1.1`; `M4_B_CLOSE §6.2` item 13 | OPEN | **OPEN — STILL CARRIES** to M4-D / per-edge LL.2 promotion time, separate from M4-C sub-phase ordering |

### §6.3 — Defer to M4-D / M5+ (per `PHASE_M4C_PLAN §5.2`)

| Residual | Reason for M4-D / M5+ defer |
|---|---|
| LL.3 §5.2 R.LL3.4 (cross-domain activator extension) | Activator code change is M4-D / M5 scope per LL.3 §5.2 framing |
| LL.3 §5.2 R.LL3.5 (LEL inner-life expansion) | LEL expansion (n=37 → larger) is M5+ scope |
| LL.3 §5.2 R.LL3.6 (Tier-C yoga-absence cluster M5 inspection) | M5 LL.7 discovery-mode scope |
| LL.3 §5.2 R.LL3.7 (CTR/CVG/SIG/RPT/DSH bucket decision) | M4-D cross-system reconciliation scope |

### §6.4 — Inherited from earlier macro-phases (still open at M4-C close)

Items inherited from M3 close + earlier macro-phases that remain open at M4-C
close (carries to M4-D HANDOFF_M4_TO_M5 at M4-D close):

| Residual | Source | Carries to |
|---|---|---|
| KR.M3.RT.LOW.1 (KP TEST-V.4 shape adaptation) | REDTEAM_M3 §6 | HANDOFF_M3_TO_M4 (already handed); M4-D consumes |
| KR.M3A.JH-EXPORT (DIS.009 R3 pending JH D9 export) | DIS.009 | HANDOFF_M4_TO_M5 at M4-D close per NAP.M4.3 Option Y |
| DIS.010/011/012 N3-resolved | DISAGREEMENT_REGISTER | M9 multi-school triangulation |
| External acharya review | M3 close | M4-D records as carry-forward |
| GAP.TRAVEL_MISC.01 — speculative travel events | LEL §6 | M5+ LEL maintenance (no B.10-compliant promotion candidate) |
| R.LL2GATE.1 (LOW) — surrogate ownership for LL2_STABILITY_GATE pass_2 | `M4_B_CLOSE §6.1` item 7 | M4-D / M5 (same ownership pattern as R.LL1TPA.1) |
| R.LL2GATE.2 (DEFERRED) — domain mapping for cross-system signal IDs (M4-D scope) | `M4_B_CLOSE §6.1` item 8 | M4-D cross-system reconciliation |
| R.LL2GATE.3 (LOW) — sparse training partition for edge statistics | `M4_B_CLOSE §6.1` item 9 | Informational; protocol handles via N≥3 floor |
| R.LL2DESIGN.1 (LOW) — LL.2 shadow path co-located with LL.1 | `M4_B_CLOSE §6.1` item 10 | Next M4-class governance pass |
| Domain-stratified LEL training corpus finding | `LL2_EDGE_WEIGHT_DESIGN §3.5+§6.7` | M4-D cross-system reconciliation pass (cross-ref R.LL3.4) |
| Sthana + Drik Shadbala ECR resolution + Narayana Dasha verification | M3-C / DIS.012 | M5+ (JH-access dependency) |
| KR.M3A2.1 — PAT.008 ECR clarification | M3-A2 | M4-class documentation-clarity |
| AC.M3A.5 — post-baseline delta run | DEFERRED per auth wall (BHISMA GAP.P.9) | M4-class with auth-secrets availability |
| KR.W9.1 + KR.W9.2 — eval-runner auth wall + parser quirk | BHISMA GAP.P.9 | M4-class |
| KR.M4A.CLOSE.2 — M4-B-S1 single-track vs B1/B2 split | M4_A_CLOSE §3 item 0 | NAP.M4.5 native acceptance scope; resolved at M4-B-S5 |
| SIG.MSR.207 + SIG.MSR.497/498/499 absent from MSR_v3_0.md | LL3_DOMAIN_COHERENCE §6 | M4-substrate cleaning pass or M5+ MSR expansion |
| UCN inline citation pass (Option A) against UCN_v4_0.md | Aspirational | Not gating |
| TS test-fixture errors in components tests | Portal Redesign R-stream | Non-blocking |

This list MIRRORS `M4_B_CLOSE §6.3` inherited list and adds M4-C-substrate items.
M4-D close artifact (`M4_CLOSE_v1_0.md` at M4-D scope) consolidates the full M4
macro-phase residual roster.

---

## §7 — Red-team summary

### §7.1 — IS.8(a) every-third-substantive-session cadence trail in M4-C

| Counter event | Session | Counter | Notes |
|---|---|---|---|
| Reset entering M4-C | M4-B-S6-CLOSE (2026-05-03) | 0 | M4_B_CLOSE §7.2 PASS_WITH_FINDINGS; counter rotates 1→0 per ONGOING_HYGIENE_POLICIES §G discharge-of-cadence-class clause |
| 0 → 1 | M4-C-S1-LL5-DASHA-TRANSIT (2026-05-02, substantive) | 1 | LL.5 first shadow write; mirror sync + Gemini re-check + design + JSON; F.RT.S6.M.1 DISCHARGED |
| 0 (held) | M4-C-P6-S4-PREDRAFT (2026-05-03, governance-aside) | 1 | Governance-aside class; do not increment per ONGOING_HYGIENE_POLICIES §G |
| 1 → 2 | M4-C-S2-LL6-TEMPORAL-DENSITY (2026-05-02, substantive) | 2 | LL.6 first shadow write + design + JSON; CAPABILITY_MANIFEST v2.0→v2.1 (LL.5+LL.6 pairs); H2 rejected |
| 2 → 3 → FIRES → reset to 0 | M4-C-S3-LL7-DISCOVERY-PRIOR (2026-05-02, substantive) | 3 → 0 | LL.7 first SHADOW write per NAP.M4.6 Option B + DECISION-2 literal CDLM construction; IS.8(a) every-third cadence FIRED in-session; in-document red-team verdict PASS_4_OF_4 (4 axes — LL.5/LL.6/LL.7 shadow-file integrity + decision audit trail); 0 HIGH/CRITICAL; new finding F.M4CS3.MIRROR.1 LOW (now closed at S4); new carry CF.LL7.1 (CDLM Pancha-MP patch deferred); counter resets 3 → 0 |
| 0 → 1 | M4-C-S4-CLOSE (this session — substantive close-class) | 1 | M4-C sub-phase close + IS.8(b)-class red-team in §7.2 below |
| 1 → 0 (discharge) | M4-C-S4-CLOSE (this §7.2 IS.8(b)-class discharge) | 0 | Sub-phase-close cadence treated as analogous to IS.8(b) macro-phase-close per ONGOING_HYGIENE_POLICIES §G discharge-of-cadence-class clause (same convention as M4-B-S6-CLOSE). Counter exits M4-C at 0; next IS.8(a) every-third cadence at counter=3 (three substantive sessions hence — likely after first three M4-D sessions). Next IS.8(b) macro-phase-close cadence at M4-D close. |

### §7.2 — IS.8(b)-class M4-C sub-phase-close red-team

Conducted in-document at this S4 close (analogue to `M4_B_CLOSE §7.2`; same
in-document convention as M4-B-S6-CLOSE — axes scoped + verifiable from artifacts
already-in-place; 0 HIGH/CRITICAL expected per the per-session red-team trail).
Per the M4-C-S4-CLOSE brief AC.S4.5 5-axis scope:

- **Performer**: claude-opus-4-7 (M4-C-S4-CLOSE 2026-05-02).
- **Performed**: 2026-05-02 in-session at this S4 close.
- **Authoring class**: in-document §7.2 (no standalone REDTEAM_M4C_v1_0.md).

#### §7.2.1 — Verdict aggregate

**PASS** — 5/5 axes pass; 0 CRITICAL / 0 HIGH / 0 MEDIUM / 0 LOW / 0 NOTE / 0
INFO new findings beyond the dispositions already recorded in §6.

#### §7.2.2 — Axis (a): LL.5/LL.6/LL.7 shadow files held-out partition spot-check

**Brief AC.S4.5(a) scope:** spot-check 3 events in each LL.5/LL.6/LL.7 shadow
file; confirm all 9 held-out events absent from training computation.

**Method:** Python json.load() inspection of outer metadata for the three shadow
JSONs at this S4 close.

**Result:**
- `ll5_dasha_transit_v1_0.json` outer metadata: `training_events_used: 37` and
  `held_out_events_excluded: 9` — PASS.
- `ll6_temporal_density_v1_0.json` outer metadata: `training_events_used: 37` and
  `held_out_events_excluded: 9` — PASS.
- `ll7_discovery_prior_v1_0.json` outer metadata: `training_events_used: 37` and
  `held_out_excluded: 9` — PASS.

All three shadow registers honestly report 37 training + 9 held-out (totaling
46 LEL events post v1.6 patch); held-out 9 events sacrosanct verified. Per-session
SESSION_LOG entries (M4-C-S1 AC.S1.4; M4-C-S2 AC.S2.3; M4-C-S3 AC.S3.4) further
record explicit `partition == "training"` filter at compute time and sanity-
assertion `len(training) == 37` for each. **PASS** — 0 findings.

#### §7.2.3 — Axis (b): DECISION-1 + DECISION-2 audit trail

**Brief AC.S4.5(b) scope:** both decisions traceable to NAP_M4_6_BRIEF v1.2 +
SESSION_LOG + M4_C_CLOSE.

**Method:** grep for `DECISION-1`, `DECISION-2`, `R.LL5DESIGN.1`,
`literal_msr_anchors_clique`, `nap_decision: Option_B_approved_literal_clique`
across the three artifacts.

**Result:**
- `NAP_M4_6_BRIEF_v1_0.md` (in-file v1.2): 5 hits across §6.3.A literal-construction
  correction + DECISION-1/2 verbatim + v1.2 changelog entry. **PASS**.
- `ll7_discovery_prior_v1_0.json` outer metadata: 3 hits — `nap_decision:
  Option_B_approved_literal_clique`, `cdlm_construction: literal_msr_anchors_clique`,
  `session_decisions_received_2026_05_02` block carrying both DECISION-1 + DECISION-2
  verbatim. **PASS**.
- `M4_C_CLOSE_v1_0.md` (this document): 34 hits across executive summary, §1.1,
  §2.1, §2.2.3, §3.1, §4.1, §4.3, §5.3, §6.1, §7.2, §9 changelog. **PASS**.
- `SESSION_LOG.md`: M4-C-S3-LL7-DISCOVERY-PRIOR entry records DECISION-1 + DECISION-2
  verbatim (per CURRENT_STATE v3.0 changelog cross-check). **PASS**.

**PASS** — 0 findings; full audit trail intact.

#### §7.2.4 — Axis (c): CF.LL7.1 documented in at least 3 places

**Brief AC.S4.5(c) scope:** `LL7_DISCOVERY_PRIOR_DESIGN §4`, `NAP_M4_6_BRIEF §6.3.A`,
`M4_C_CLOSE §6` — verify CF.LL7.1 mentioned.

**Method:** grep for `CF.LL7.1`.

**Result:**
- `LL7_DISCOVERY_PRIOR_DESIGN_v1_0.md`: 5 hits (including §4 sanity-check + §7
  known limitations). **PASS**.
- `NAP_M4_6_BRIEF_v1_0.md` (v1.2): 2 hits (§6.3.A literal-construction correction
  + v1.2 changelog). **PASS**.
- `M4_C_CLOSE_v1_0.md` (this document): 9 hits across executive summary, §6.1
  carry-forward, §7.2, §9 changelog. **PASS**.

**PASS** — 0 findings; CF.LL7.1 fully documented and traceable.

#### §7.2.5 — Axis (d): Naming propagation (AC.S4.3) consistency

**Brief AC.S4.5(d) scope:** spot-check grep for old name "Retrieval ranking learning"
across MACRO_PLAN_v2_0.md + PHASE_M4C_PLAN_v1_0.md + SHADOW_MODE_PROTOCOL_v1_0.md;
verify only in changelog audit-trail entries (not in substantive text).

**Method:** grep -n "Retrieval ranking" across the three documents at this S4 close.

**Result:**
- `MACRO_PLAN_v2_0.md`: 1 hit at line 35 (v2.1 changelog entry recording the rename
  — audit trail). **CLEAN**.
- `PHASE_M4C_PLAN_v1_0.md`: 1 hit at line 540 (v1.0.1 §7 changelog entry — audit
  trail). **CLEAN**.
- `SHADOW_MODE_PROTOCOL_v1_0.md`: 1 hit at line 282 (v1.0.1 §9 changelog entry —
  audit trail). **CLEAN**.

All substantive references (§LL-Appendix.A activation matrix; §LL-Appendix.B
heading; §LL-Appendix narrative; PHASE_M4C_PLAN frontmatter `governs:`; §1.1
mechanism heading; §3.1 S1 scope heading; SHADOW_MODE_PROTOCOL §1 + §2 LL.5 row)
read "Dasha-Transit axis-weight modulator". **PASS** — 0 findings.

#### §7.2.6 — Axis (e): Mirror sync (AC.S4.1) — verify .geminirules + .gemini/project_state.md reflect M4-C INCOMING CLOSE

**Brief AC.S4.5(e) scope:** verify `.geminirules` reflects LL.5–LL.7 status +
M4-C incoming close; verify `.gemini/project_state.md` updated.

**Method:** grep for "M4-C-S4 MIRROR SYNC" + "M4-C SUB-PHASE CLOSED".

**Result:**
- `.geminirules`: 1 hit ("M4-C-S4 MIRROR SYNC + M4-C SUB-PHASE INCOMING CLOSE"
  footer entry capturing cumulative S2+S3+P6+S4 delta + LL.5/LL.6/LL.7 status +
  CF.LL7.1 carry + R.LL5DESIGN.1/R.LL6DESIGN.1 closed + R.LL1TPA.1 carries +
  F.M4CS3.MIRROR.1 discharged + CURRENT_STATE v3.0→v3.1). **PASS**.
- `.gemini/project_state.md`: 2 hits (line-3 banner narrative wrapping prior M4-C-S1
  narrative; §"Active Phase" header section rewritten with M4-C SUB-PHASE CLOSED +
  M4-D INCOMING block with full LL.1–LL.7 status + carry-forwards). **PASS**.

F.M4CS3.MIRROR.1 LOW DISCHARGED at this S4 entry (mirror sync executed FIRST per
brief execution order Step 2). **PASS** — 0 findings.

### §7.3 — Next IS.8(a) every-third cadence

Counter exits M4-C at **0** (S3 IS.8(a) cadence-fire reset 3→0 + S4 sub-phase-
close-class IS.8(b) discharge reset 1→0). Next IS.8(a) every-third cadence-fires
at counter=3 — three substantive sessions hence (likely after first three M4-D
sessions). Next IS.8(b) macro-phase-close cadence fires at M4-D close per
`PHASE_M4_PLAN §3.4 AC.M4D.4`. Next §IS.8(c) every-12-months MACRO_PLAN review
remains 2027-04-23 due.

---

## §8 — Approval

### §8.1 — M4-C sub-phase close — internal AC gate, no NAP

M4-C sub-phase close is governed by the internal acceptance-criteria gate documented
at `PHASE_M4_PLAN §3.3` (AC.M4C.1–5) plus `PHASE_M4C_PLAN §3` (per-sub-phase
AC.M4C.S1.1–S4.5) plus the per-session brief ACs (S1–S4). M4-C does **not** require
a native-approval-point (NAP) for sub-phase close — NAP.M4.6 is the binding NAP
within M4-C (LL.7 prior rubric; APPROVED 2026-05-02), and NAP.M4.7 is the M4
macro-phase close NAP at M4-D, not at M4-C.

The close discipline at this S4 sealing:

- **Internal AC gate:** §2 ledger above shows **5/5 PASS** for PHASE_M4_PLAN §3.3
  AC.M4C.1–5; per-sub-phase ACs all PASS with two informational deferrals (S1.2 LL.3
  fix-before-prod → M4-D; S1.4 + S2.3 stability-gate convention → informational);
  per-session brief ACs S1.1–S1.7 + S2.1–S2.7 + S3.1–S3.9 + S4.1–S4.9 all PASS
  (32/32 brief ACs). M4-C internal AC gate **CLEAN**.
- **Sub-phase-close red-team:** §7.2 above DISCHARGED in-document; verdict
  aggregate **PASS** (5/5 axes; 0 CRITICAL/HIGH/MEDIUM/LOW/NOTE/INFO new findings).
- **CURRENT_STATE flip:** S4 (this session) flips `active_phase_plan_sub_phase`
  to "M4-C CLOSED 2026-05-02; M4-D incoming"; rotates `last_session_id: M4-C-S4-
  CLOSE` + `next_session_objective: M4-D-S1 (M4 macro-phase close + NAP.M4.7 +
  IS.8(b) macro-phase-close red-team)` + `red_team_counter` 0→1→0 (S4 substantive
  close-class increment + IS.8(b)-class sub-phase-close cadence discharge per
  ONGOING_HYGIENE_POLICIES §G) + clears `predraft_available` field (this artifact
  consumed at S4).
- **Mirror sync:** MP.1 + MP.2 propagation EXECUTED at this S4 entry per AC.S4.1
  (FIRST act of session); cumulative S2+S3+P6 delta + M4-C INCOMING CLOSE state
  reflected on both sides. F.M4CS3.MIRROR.1 LOW DISCHARGED.

**No native sign-off is required for M4-C sub-phase close itself**, beyond NAP.M4.6
approval (which was already received 2026-05-02 — Option B + 3 refinements). M4-C
may close as PARTIAL or HOLD if any S1/S2/S3 sub-phase exits PARTIAL or HOLD; the
internal AC gate accommodates partial outcomes via the §2 ledger's PASS / PARTIAL /
PENDING verdict structure.

### §8.2 — Surrogate-disclosure ledger (carry-forward from M4-B)

Carry-forward state from M4-B:
- M4-B pass_1 review path used Claude-surrogate-for-Gemini per
  `LL1_TWO_PASS_APPROVAL §3` (Gemini unavailable synchronously at M4-B-S2).
  Surrogate disclosure recorded in 6 places (per `M4_B_CLOSE §8.2`).
- Gemini reachability check at M4-B-S5 (S5 brief AC.S5.7): NOT_REACHABLE.
  `R.LL1TPA.1` carried to M4-C entry (M4-C-S1).

**M4-C re-attempt outcomes:**
- **M4-C-S1 entry re-check:** **NOT_REACHABLE** (recorded in M4-C-S1 SESSION_LOG
  entry; surrogate flag continues per LL1_TWO_PASS_APPROVAL §5.5).
- **M4-C-S2 entry re-check:** N/A (S2 brief did not require re-check; LL.6 first
  shadow write substrate work).
- **M4-C-S3 entry re-check:** N/A (S3 brief did not require re-check; LL.7 first
  artifact write substrate work).
- **M4-C-S4 re-check (this session, AC.S4.2):** **NOT_REACHABLE** persists. No
  synchronous Gemini-agent contact mechanism available within this Claude Code
  session per LL1_TWO_PASS_APPROVAL §5.5 governance pattern.

**Surrogate-disclosure ledger extension into M4-C:** Gemini still NOT_REACHABLE
across all four S1/S2/S3/S4 sessions. R.LL1TPA.1 carries to M4-D as the **final M4
re-attempt obligation**. No `DIS.class.output_conflict` opened (no Gemini-side
ratify/contest received). Surrogate flag persists on any pass_1/pass_2 binding
invoked downstream (LL.5/LL.6/LL.7 substrate at M4-C did not invoke pass_1 — these
are first-write shadow registers without acharya-grade relevance judgements yet
accumulated; surrogate ownership applies if/when LL.5/LL.6 promotion criteria are
evaluated at M5+).

---

## §9 — Changelog

- **v1.0 SEAL (2026-05-02, M4-C-S4-CLOSE):** Document sealed. Status flipped
  DRAFT → CLOSED; `sealed_by: M4-C-S4-CLOSE`; `sealed_at: 2026-05-02`. Every
  `[PENDING-S*]` token in the v1.0 DRAFT replaced with verdict text or factual
  outcome cite read from sealed shadow registers (ll5_dasha_transit_v1_0.json,
  ll6_temporal_density_v1_0.json, ll7_discovery_prior_v1_0.json), design docs
  (LL5_DASHA_TRANSIT_DESIGN, LL6_TEMPORAL_DENSITY_DESIGN, LL7_DISCOVERY_PRIOR_DESIGN),
  NAP_M4_6_BRIEF v1.2, CURRENT_STATE v2.7→v2.8→v2.9→v3.0 changelog blocks, and
  SESSION_LOG entries M4-C-S1-LL5-DASHA-TRANSIT (commit per S1 entry) +
  M4-C-S2-LL6-TEMPORAL-DENSITY (commit 0c15a20) + M4-C-S3-LL7-DISCOVERY-PRIOR
  (commit fee3a5b). Body changes:
  - **Frontmatter:** status DRAFT → CLOSED; sealed_by + sealed_at populated;
    sub_phase_opened/sub_phase_closed populated with M4-C-S1 + M4-C-S4-CLOSE
    actuals; phase_plan pointer updated to v1.0.1 (post-DECISION-1 propagation);
    red_team_artifact populated with in-document §7.2 citation; sealed_during
    populated.
  - **Executive summary:** sealing path verdict SEALING_PATH_CLEAN; LL.5/LL.6/LL.7
    summary blocks populated with actual outcome stats (LL.5 380 signals
    HIGH 2/MED 12/LOW 252/ZERO 114; LL.6 255/380 meaningful + H2 rejected;
    LL.7 243 edges = 107 novel + 136 unconfirmed; sanity 8/8 novel PASS).
    DECISION-1 + DECISION-2 cited.
  - **§1.1 mechanism scope:** LL.5 renamed to "Dasha-Transit axis-weight modulator"
    per DECISION-1 propagation; ACTUAL paths (signal_weights/shadow/) replace
    PHASE_M4C_PLAN draft paths; LL.6 = "Temporal Density Modulator" per S2 brief;
    LL.7 outer-metadata mode-distinction documented; CF.LL7.1 deferral noted.
  - **§1.2 sub-phase rounds:** session_id, dates, deliverables, classes filled
    for S1/P6/S2/S3/S4 from actuals; total = 5 sessions (4 substantive + 1
    governance-aside).
  - **§1.4 close-criteria:** SEALING_PATH_CLEAN; all S1/S2/S3 ACs PASS; LL status
    SHADOW_ACTIVE for all three; IS.8(b)-class red-team PASS; mirror MP.1+MP.2
    propagated; M4-D entry-gate cleared.
  - **§2 ACs:** PHASE_M4_PLAN §3.3 AC.M4C.1–5 = 5/5 PASS; per-sub-phase ACs
    populated (2 informational deferrals on stability-gate convention; LL.3
    fix-before-prod deferred to M4-D); per-session brief ACs S1.1–S1.7 +
    S2.1–S2.7 + S3.1–S3.9 + S4.1–S4.9 = 32/32 PASS.
  - **§3 deliverables:** all 11 substantive + governance-state rows populated
    with paths, versions, statuses, commit hashes (S2 0c15a20; S3 fee3a5b;
    S4 stamped post-commit). MACRO_PLAN v2.1 + PHASE_M4C_PLAN v1.0.1 +
    SHADOW_MODE_PROTOCOL v1.0.1 added per DECISION-1 propagation.
  - **§4 NAPs:** §4.3 NAP.M4.7 cross-reference confirmed; DECISION-1+DECISION-2
    supplemental verdicts noted as in-flight refinement-class amendments to
    NAP.M4.6 (recorded in NAP_M4_6_BRIEF v1.2 §6.3.A).
  - **§5 LL status:** §5.1 LL.5 fully populated (renamed mechanism; tier breakdown;
    promotion-blocked structurally by N=0; LL.3 §5.1 disposition deferred to M4-D);
    §5.2 LL.6 fully populated (computation summary; H2 finding REJECTED with
    quantitative gap analysis; mechanism-naming divergence joint with R.LL5DESIGN.1);
    §5.3 LL.7 fully populated (DECISION-2 literal CDLM construction; 243 edges
    distribution; sanity 8/8 novel PASS with empirical evidence per anchor pair;
    CF.LL7.1 deferred; mode_native_only outer-metadata declaration).
  - **§6 residuals:** §6.1 9 substrate items populated (CF.LL7.1 NEW; R.LL5DESIGN.1
    + R.LL6DESIGN.1 + F.M4CS3.MIRROR.1 CLOSED; LL.5/LL.6 promotion deferred;
    LL.7 native-only convention informational; R.LL5DESIGN.2 lit_source split
    informational; IS.8(a) cadence-fire findings recorded); §6.2 10 inherited
    items disposed (KR.M4A.RT.LOW.1 carries; GAP.M4A.04 deferred; R.LL1TPA.1
    NOT_REACHABLE persists; F.RT.S6.M.1 CLOSED; F.RT.S6.M.2/N.1/I.1 + LL.3
    fix-before-prod + LL.4 §5.4 modifier + per-edge LL.2 carry to M4-D);
    §6.3 + §6.4 unchanged.
  - **§7 red-team:** §7.1 IS.8(a) cadence trail filled (counter 0→1→2→3→0→1→0
    across S1/S2/S3 IS.8(a) discharge + S4 IS.8(b)-class discharge); §7.2 in-
    document IS.8(b)-class sub-phase-close red-team conducted, verdict aggregate
    PASS 5/5 axes 0 findings; §7.2.2 through §7.2.6 sub-axis verdicts populated
    (held-out partition 37/9 across all 3 shadow files; DECISION-1+DECISION-2
    audit trail intact 4 places; CF.LL7.1 documented 3+ places; naming propagation
    clean substantively + audit-trail-only in changelogs; mirror sync executed
    FIRST AC.S4.1); §7.3 next IS.8(a) cadence forecast.
  - **§8 approval:** close discipline filled (5/5 PHASE_M4_PLAN AC PASS; 32/32
    brief AC PASS; red-team PASS 5/5; CURRENT_STATE flip v3.0→v3.1; mirror sync
    DISCHARGED); §8.2 surrogate-disclosure ledger extended (Gemini NOT_REACHABLE
    persists across S1/S2/S3/S4; R.LL1TPA.1 carries to M4-D as final M4 obligation).
  - **§9 this changelog entry.**

  Authored under brief `M4-C-S4-CLOSE`. Companion artifacts unchanged from DRAFT:
  PHASE_M4C_PLAN v1.0.1 (DECISION-1 propagated this S4); NAP_M4_6_BRIEF v1.2
  (S3 §6.3.A literal-construction correction); MACRO_PLAN v2.1 + SHADOW_MODE_PROTOCOL
  v1.0.1 (DECISION-1 propagated this S4). Predecessor close artifact: M4_B_CLOSE_v1_0.md
  CLOSED 2026-05-03 at M4-B-S6-CLOSE.

- **v1.0 DRAFT (2026-05-03, M4-C-P6-S4-PREDRAFT, parallel governance slot to S3):**
  Initial pre-draft. Authored as a parallel-slot session running alongside M4-C-S3
  (LL.7 first artifact write per NAP.M4.6 Option B). All S1/S2/S3/S4-dependent
  fields held as literal `[PENDING-S*]` tokens with one-line descriptions of what
  each is waiting for. Sealed at S4 (see v1.0 SEAL entry above when populated).
  - §1 scope: 3 mechanisms (LL.5/LL.6/LL.7 native-only); sub-phase rounds S1–S4
    + Px parallel slots; out-of-scope verification (§1.3); §1.4 close-criteria
    summary [PENDING-S4].
  - §2 acceptance criteria ledger: PHASE_M4_PLAN §3.3 AC.M4C.1–5 [PENDING-S*];
    PHASE_M4C_PLAN §3 per-sub-phase ACs (S1.1–S1.5; S2.1–S2.4; S3.1–S3.5; S4.1–S4.5)
    [PENDING-S*]; per-session brief ACs [PENDING-S*]; S4 close-checklist ACs
    [PENDING-S4].
  - §3 deliverables inventory: 9 expected substantive files + 5 governance-state
    files; structural rows with [PENDING-S*] tokens for path/version/commit/status;
    §3.3 NOT-touched verification at S4.
  - §4 NAP decisions: NAP.M4.6 RESOLVED 2026-05-02 (Option B + 3 refinements —
    fully populated since this is known ground at predraft time, including the
    refinement specifications, verbatim native rationale, and disposition writeback
    plan); NAP.M4.4 binding throughout M4-C; NAP.M4.7 cross-referenced at M4-D scope;
    NAP.M4.1/2/3/5 cross-referenced as resolved at M4-A / M4-B close.
  - §5 LL status: LL.5 [PENDING-S1]; LL.6 [PENDING-S2]; LL.7 [PENDING-S3 — algorithm
    + expected output shape per NAP_M4_6_BRIEF v1.1 §6.4 fully populated since the
    rubric is known]; LL.8 SCAFFOLD unchanged.
  - §6 known residuals: §6.1 M4-C-substrate [PENDING-S4]; §6.2 inherited from M4-B
    (10 items — KR.M4A.RT.LOW.1 OPEN; GAP.M4A.04 PARTIAL_CLOSE deferred; R.LL1TPA.1
    [PENDING-S1]; F.RT.S6.M.1 [PENDING-S1 close]; F.RT.S6.M.2 [PENDING-S* close];
    F.RT.S6.N.1 OPEN-still-carries; F.RT.S6.I.1 [PENDING-S*]; LL.3 §5.1 [PENDING-S1];
    LL.4 §5.4 informational; per-edge LL.2 promotion deferred); §6.3 M4-D / M5+
    deferrals (4 items); §6.4 inherited from earlier macro-phases (17 items, mirror
    of M4_B_CLOSE §6.3 + cross-references).
  - §7 red-team: §7.1 IS.8(a) cadence trail [PENDING-S1/S2/S3]; §7.2 IS.8(b)-class
    M4-C sub-phase-close red-team [PENDING-S4 — author or accept-as-discharged]; §7.3
    cadence forecast [PENDING-S4].
  - §8 approval: M4-C sub-phase close = internal AC gate, no NAP. NAP.M4.7 at M4-D
    macro-phase close. Surrogate-disclosure ledger carry-forward from M4-B
    [PENDING-S1/S2/S3 outcomes].
  - §9 this changelog.

  Authored under brief `M4-C-P6-S4-PREDRAFT`. Sister artifact: `00_ARCHITECTURE/
  PHASE_M4C_PLAN_v1_0.md` v1.0 DRAFT (forward-pointer plan, M4-B-P5). Companion
  artifact: `00_ARCHITECTURE/EVAL/NAP_M4_6_BRIEF_v1_0.md` v1.1 OPTION_B_APPROVED
  (decision brief, M4-B-P5 + native verdict 2026-05-02). Predecessor close artifact:
  `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/M4_B_CLOSE_v1_0.md` (CLOSED 2026-05-03
  at M4-B-S6-CLOSE).

---

*End of M4_C_CLOSE_v1_0.md — CLOSED 2026-05-02 at M4-C-S4-CLOSE. M4-C sub-phase
sealed: every `[PENDING-S*]` token in the v1.0 DRAFT replaced with verdict text or
factual outcome cite read from sealed shadow registers + design docs +
NAP_M4_6_BRIEF v1.2 + CURRENT_STATE changelog blocks + SESSION_LOG entries.
IS.8(b)-class M4-C sub-phase-close red-team conducted in-document §7.2 (verdict
PASS 5/5 axes, 0 findings). CURRENT_STATE rotated v3.0 → v3.1 marking M4-C CLOSED
and M4-D incoming. Mirror MP.1+MP.2 propagated to adapted parity at this S4 entry
(F.M4CS3.MIRROR.1 LOW DISCHARGED). DECISION-1 R.LL5DESIGN.1 mechanism-naming
propagated to MACRO_PLAN v2.1 + PHASE_M4C_PLAN v1.0.1 + SHADOW_MODE_PROTOCOL v1.0.1.
M4-D incoming: M4 macro-phase close + NAP.M4.7 + IS.8(b) macro-phase-close red-team.*
