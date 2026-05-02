---
artifact: 06_LEARNING_LAYER/M4_CLOSE_v1_0.md
canonical_id: M4_CLOSE
version: "1.0"
status: CLOSED
session: M4-D-S1
date: 2026-05-02
sealed_by: M4-D-S1
sealed_at: 2026-05-02
authored_by: M4-D-S1
macro_phase: M4 — Calibration + LEL Ground-Truth Spine
predecessor_close_artifacts:
  - 00_ARCHITECTURE/M4_A_CLOSE_v1_0.md (M4-A sealed 2026-05-02)
  - 06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/M4_B_CLOSE_v1_0.md (M4-B sealed 2026-05-03)
  - 06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/M4_C_CLOSE_v1_0.md (M4-C sealed 2026-05-02)
companion_brief: 00_ARCHITECTURE/EVAL/NAP_M4_7_BRIEF_v1_0.md (NAP.M4.7 native verdict APPROVED at this session; pre-decided per brief)
phase_plan: 00_ARCHITECTURE/PHASE_M4D_PLAN_v1_0.md (status flipped DRAFT → CLOSED at this session)
mirror_obligations:
  claude_side: 06_LEARNING_LAYER/M4_CLOSE_v1_0.md
  gemini_side: ".gemini/project_state.md M4-CLOSED state-block; .geminirules M4-D-S1 footer entry (M4-D-class governance surface; mirror cascade not propagated this session per brief must_not_touch declaration; carry to M5-S1 entry)"
  mirror_mode: claude-resident-with-pointer
  authoritative_side: claude
changelog:
  - v1.0 CLOSED (2026-05-02, M4-D-S1): Initial seal. M4 macro-phase close
    sealing artifact authored at M4-D-S1 single-session substantive close.
    Six sections: §1 LL.1–LL.7 outcomes (one paragraph each); §2 NAP.M4.1–7
    registry with verdicts + dates; §3 carry-forward roster from M4-A/B/C
    closes with final dispositions; §4 IS.8(b) macro-phase-close red-team
    results (RT.1–RT.5); §5 M5 setup recommendations (8 items); §6 known
    asymmetries (R.LL1TPA.1 Gemini gap; CF.LL7.1 parallel patch status;
    KR.M4A.RT.LOW.1 deferred tree). NAP.M4.7 verdict APPROVED pre-decided
    per execution brief (CF.LL7.1 = α — CDLM patch executing in parallel
    session M4-D-P1; KR.M4A.RT.LOW.1 = DEFER; R.LL1TPA.1 = FINAL_NOT_REACHABLE).
    AC.D1.6 hard stop BYPASSED per pre-decided verdict. IS.8(b) red-team
    PASS 5/5 axes 0 findings. Counter rotation: 0 → 1 (M4-D-S1 substantive
    close-class) → 0 (IS.8(b) macro-phase-close cadence DISCHARGED in §4
    per ONGOING_HYGIENE_POLICIES §G; same convention as M4-B-S6 / M4-C-S4).
---

# M4 MACRO-PHASE CLOSE — M4_CLOSE_v1_0.md

*M4 — Calibration + LEL Ground-Truth Spine — sealed at M4-D-S1 (2026-05-02). Single-session substantive close-class. NAP.M4.7 APPROVED. IS.8(b) macro-phase-close red-team PASS 5/5 axes 0 findings. M5 entry unblocked.*

---

## §1 — LL.1 through LL.7 outcomes

### §1.1 — LL.1 — Per-signal weight calibration

**Computation.** Per-signal weight calibration over 380 LL.1 candidate signals using LEL v1.6 training partition (37 events) under CALIBRATION_RUBRIC v1.1 Option B (NAP.M4.1 APPROVED). Shadow file `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/signal_weights/shadow/ll1_shadow_weights_v1_0.json` carries 380 signals: 30 promotion-eligible (N≥3 + variance ≤0.3 + match_rate ≥0.4); 285 insufficient_observations; 52 shadow_indefinite_low_match_rate; 13 shadow_indefinite_high_variance. variance_estimator: sample (F.RT.S4.1 close at M4-B-S5).

**Decision.** NAP.M4.5 native pass_2 verdict at M4-B-S5 (commit b508d6e, 2026-05-02): 30 of 30 approved (100% ≥ 90% FULL_PASS gate). Joint Tier-C question on SIG.MSR.118/.119/.143 yoga-absences resolved with native verdict (a) three independent calibrated phenomena.

**Production/shadow status at M4 close.** PRODUCTION. `signal_weights/production/ll1_weights_promoted_v1_0.json` carries 30 of 30 with `status: production`; outer `weights_in_production_register: true`; per-signal `approval_chain[0].pass_2_decision: approved`. 380 candidate-pool retained in shadow file.

### §1.2 — LL.2 — Edge weights

**Computation.** Pairwise edge weight computation over LEL v1.6 training partition (37 events). Shadow file `signal_weights/shadow/ll2_edge_weights_v1_0.json` carries 9,922 edges: HIGH=0; MED=8 (Pancha-Mahapurusha clique); LOW=9,914; ZERO=0. cross_domain_count=0 / intra_domain_count=9,922 (per LL2_EDGE_WEIGHT_DESIGN §3.5 + §6.7 empirical finding: LEL training corpus is domain-stratified).

**Decision.** LL2_STABILITY_GATE v1.1 — gate_decision FULL_PASS at NAP.M4.5 close (re-evaluated cascade; 30 LL.1-promoted signals satisfy "both endpoints in LL.1 production" rule). Per-edge promotion deferred to M5+ (separate from M4-C/M4-D ordering).

**Production/shadow status at M4 close.** SHADOW. Gate-level promotion-block UNBLOCKED; per-edge execution pending.

### §1.3 — LL.3 — Domain coherence (recommendation)

**Computation.** LL.3 diagnostic recommendation document `LL3_DOMAIN_COHERENCE_v1_0.md` (M4-B-S4): 10-bucket MSR-anchored domain coverage; per-signal coherence is structural by rubric design (acknowledged tautology, F.RT.S4.3); LL.2 edge spot-check confirms intra-domain Pancha-Mahapurusha clique; 7 recommendations across fix-before-prod and investigate-in-M5.

**Decision.** Recommendation document; no shadow→production promotion class per `SHADOW_MODE_PROTOCOL §2 LL.3` row (recommendation, not binding). R.LL3.1/.2/.3 fix-before-prod recommendations carry as deferred-to-M4D-pipeline-change → carry to M5 (per §3 below).

**Production/shadow status at M4 close.** RECOMMENDATION_DOCUMENT. No machine-readable view (LL.3 outputs are diagnostic, not weight-bearing).

### §1.4 — LL.4 — Qualitative domain / signal-class priors (recommendation)

**Computation.** `LL4_PREDICTION_PRIOR_v1_0.md` v1.1 (M4-B-S4 + M4-B-S5 machine-readable view). Tier priors: STRONG (classical_rule + both bases — full credit); MODERATE (career/financial/health/relationship temporal — 0.4–0.5 multiplier; general temporal — 0.30 with cluster-aware consolidation); WEAK (travel n=5; psy/spi/edu/fam n≤7 too thin). Machine-readable view at `signal_weights/ll4_prediction_priors_v1_0.json` (10 domain priors + 3 signal-class priors + date-precision modifier).

**Decision.** Recommendation document; no shadow→production split per `SHADOW_MODE_PROTOCOL §2 LL.4` row. Priors are recommendations, not bindings — M5 LL.5 prior-fitting input.

**Production/shadow status at M4 close.** RECOMMENDATION_DOCUMENT + machine-readable JSON view. No promotion class.

### §1.5 — LL.5 — Dasha-Transit axis-weight modulator (renamed at M4-C-S4 per DECISION-1)

**Computation.** First shadow write at M4-C-S1 (commit f30f696). `signal_weights/shadow/ll5_dasha_transit_v1_0.json` carries 380 signals × dasha_weight + transit_weight. Tier distribution HIGH=2 / MED=12 / LOW=252 / ZERO=114; dasha_dominant=259 / transit_dominant=1 / balanced=6. lit_source skew dasha=410 / transit=4 / both=6.

**Decision.** Mechanism name "Retrieval ranking learning" → "Dasha-Transit axis-weight modulator" propagated at M4-C-S4 (DECISION-1 R.LL5DESIGN.1 Option A approved 2026-05-02 → MACRO_PLAN v2.1 + PHASE_M4C_PLAN v1.0.1 + SHADOW_MODE_PROTOCOL v1.0.1). LL.5 promotion gate at M4 close: N=0 per-feature for ranker-retrieval judgements (acharya-grade relevance not yet logged). Promotion deferred to M5+.

**Production/shadow status at M4 close.** SHADOW. R.LL5DESIGN.1 CLOSED at M4-C-S4 propagation. R.LL5DESIGN.2 (lit_source=both 0.5/0.5 fixed-point convention) carries informational to M5 cohort-mode.

### §1.6 — LL.6 — Temporal Density Modulator

**Computation.** First shadow write at M4-C-S2 (commit 0c15a20). `signal_weights/shadow/ll6_temporal_density_v1_0.json` carries 37 events × cluster_size + density_weight; 380 signals × density_adjusted means. Cluster-size distribution {1:7, 2:10, 3:11, 4:8, 5:1}; meaningful_adjustment_count 255/380 (67% at delta>0.1); mean delta 0.2202; max 0.5693.

**Decision.** H2 dense-cluster-inflation test on training mean: REJECTED at n=37 (weighted-form gap_reduction −0.0069). Finding is informational only — not a load-bearing explanation of held_out>training gap. LL.4 §2.2 H1 (decade-stratified selection bias) + H2 (LEL retrodictive labeling) remain the load-bearing hypotheses. R.LL6FINDING.1 carries informational input to M5's hypothesis ranking on LL.4 §2.2.

**Production/shadow status at M4 close.** SHADOW (informational). R.LL6DESIGN.1 CLOSED at M4-C-S4 (joint with R.LL5DESIGN.1).

### §1.7 — LL.7 — Discovery Prior (native-only artifact)

**Computation.** First shadow write at M4-C-S3 (commit fee3a5b). `signal_weights/shadow/ll7_discovery_prior_v1_0.json` carries CDLM literal msr_anchors-clique union over 81 cells = 136 unique edges (58 anchor signals); 37 training events; 9,867 noise pairs excluded from 9,974 raw co-firing pairs. **243 emitted edges = 107 novel + 136 unconfirmed + 0 confirmed + 0 contradicted.** Sanity-check `sanity_anchor_novel_count: 8` PASS — all 8 MED-tier LL.2 anchors classify as `novel` under DECISION-2 literal construction (correct under current CDLM; CF.LL7.1 patch addresses).

**Decision.** NAP.M4.6 OPTION_B_APPROVED_LITERAL_CONSTRUCTION (2026-05-02) + 3 refinements (`unconfirmed` rename; N≥3 threshold; 8 MED-tier sanity-check anchor) + DECISION-2 (literal CDLM clique construction; verbatim per native specification). Native-only mode — no shadow→production split per `SHADOW_MODE_PROTOCOL §2 LL.7` row.

**Production/shadow status at M4 close.** SHADOW (native-only). CF.LL7.1 (CDLM Pancha-MP anchor patch) executing in parallel session M4-D-P1 — see §6 known asymmetries for status.

---

## §2 — NAP registry (NAP.M4.1 — NAP.M4.7)

| NAP | Brief | Verdict | Date |
|---|---|---|---|
| NAP.M4.1 | CALIBRATION_RUBRIC Option A/B/C selection | APPROVED Option B | 2026-05-02 (M4-A NAP-decisions append) |
| NAP.M4.2 | LEL_GAP_AUDIT 11 gaps disposition (6 elicit / 5 accept) | APPROVED partial — GAP.M4A.04 patched (LEL v1.6 dual-tag); 5 deferred; 5 accepted | 2026-05-02 (M4-A NAP-decisions append) |
| NAP.M4.3 | DIS.009 / KR.M3A.JH-EXPORT — Option X (close now) vs Option Y (carry forward to M5+) | APPROVED Option Y (carry forward to HANDOFF) | 2026-05-02 (M4-A NAP-decisions append) |
| NAP.M4.4 | SHADOW_MODE_PROTOCOL §3 promotion criteria binding | APPROVED (binding: N≥3, variance ≤0.3, two-pass, match_rate ≥0.4) | 2026-05-02 (M4-A NAP-decisions append) |
| NAP.M4.5 | LL.1 pass_2 spot-check (30 promotion-eligible signals + Tier-C joint question on SIG.MSR.118/.119/.143) | APPROVED 30/30 — verdict (a) three independent calibrated phenomena | 2026-05-02 (M4-B-S5; commit b508d6e) |
| NAP.M4.6 | LL.7 Discovery Prior rubric — Option A/B/C + refinements | APPROVED Option B + 3 refinements (`unconfirmed` rename; N≥3 threshold; 8 MED-tier sanity anchor) + literal CDLM construction (DECISION-2) | 2026-05-02 (M4-C-S3 entry; brief v1.2) |
| **NAP.M4.7** | **M4 macro-phase close approval** | **APPROVED** (pre-decided per execution brief) — CF.LL7.1 = α (CDLM patch parallel session M4-D-P1); KR.M4A.RT.LOW.1 = DEFER; R.LL1TPA.1 = FINAL_NOT_REACHABLE | **2026-05-02 (this session, M4-D-S1)** |

7/7 NAPs reached native verdict before M4 close. RT.2 PASS.

---

## §3 — Carry-forward roster — final dispositions

Reconciled from `PHASE_M4D_PLAN §5` (35-item enumeration covering M4-A/B/C substrate residuals + inherited M3/M2/earlier items).

### §3.1 — Items disposed at this M4-D-S1 close

| ID | Source | Pre-M4-D status | Final disposition | Owner |
|---|---|---|---|---|
| **CF.LL7.1** | M4-C-S3 | OPEN (CDLM Pancha-MP anchor patch deferred) | **CLOSED_PARALLEL** — CDLM patch executing in parallel session M4-D-P1 (per pre-decided verdict α) | M4-D-P1 |
| **KR.M4A.RT.LOW.1** | M4-A red-team | OPEN (commit 0793719 malformed root tree, cosmetic) | **DEFERRED** — git history rewrite risk outweighs cosmetic benefit; on-disk content correct; carry to M5 hygiene pass | M5 |
| **R.LL1TPA.1** | M4-B-S5 | OPEN (Gemini NOT_REACHABLE; re-attempt at S1/S2/S3/S4 each NOT_REACHABLE) | **FINAL_NOT_REACHABLE** — Gemini unreachable throughout entire M4 macro-phase; mirror-pair MP.1–MP.5 updates not propagated synchronously to Gemini agent (recorded as known asymmetry §6); no further M4 action; M5 entry re-attempt convention persists per LL1_TWO_PASS_APPROVAL §5.5 | (recorded; no open action) |
| **GAP.M4A.04** | M4-A | PARTIAL_CLOSE (LEL v1.6 dual-tag landed; speculative travel residual) | **PARTIAL_CLOSE_ACCEPTED** — no source data exists to advance further per B.10; carry to M5 LEL maintenance pass | M5 |

### §3.2 — Items accepted-as-M5-input

| ID | Source | Description | M5 owner / ETA |
|---|---|---|---|
| KR.M3A.JH-EXPORT | M4-A NAP.M4.3 Y | DIS.009 full closure pending JH D9 export per ED.1 | M5 alongside Sthana + Drik Shadbala ECR + Narayana Dasha verification |
| GAP.M4A.01/02/03/05/06 | M4-A NAP.M4.2 | 5 elicit-recommended gaps deferred at native discretion | Future LEL pass at native discretion |
| GAP.TRAVEL_MISC.01 | M4-B-P1 | Speculative "Russia-related business trips" without dates | M5+ LEL maintenance |
| R.LL2GATE.1 | M4-B-S5 | Surrogate ownership for LL2_STABILITY_GATE pass_2 | Same ownership pattern as R.LL1TPA.1 |
| R.LL2DESIGN.1 | M4-B-S3 | LL.2 shadow path co-located with LL.1 (vs. declared GRAPH_EDGE_WEIGHT_LEARNING/edge_modulators/shadow/) | Next M4-class governance pass (M5 path-realignment) |
| F.RT.S6.N.1 | M4-B-S6 | Parallel-session version-coordination convention is ad-hoc | Next quarterly governance pass 2026-07-24 |
| F.RT.S6.I.1 | M4-B-S6 | Outer-metadata stale-doc-hint on `production_status_field_value` field | Next LL.1 production-register touch (M5 consumer wiring) |
| Per-edge LL.2 promotion | M4-B-S5 | Gate-level promotion-block lifted; per-edge execution deferred | LL.2 promotion time (M5+) |
| LL.5 promotion criteria | M4-C-S1 | First shadow write has N=0 per-feature; ranker-retrieval judgements not yet logged | M5+ or future LL.5 extension |
| LL.6 promotion criteria | M4-C-S2 | First shadow write has N=0; informational mechanism per shadow-mode discipline | M5+ |
| R.LL5DESIGN.2 | M4-C-S1 | lit_source=both 0.5/0.5 fixed-point convention (informational) | M5 cohort-mode |
| R.LL6FINDING.1 | M4-C-S2 | LL.6 H2 dense-cluster-inflation REJECTED at n=37 (informational input to M5 hypothesis ranking on LL.4 §2.2) | M5 (hypothesis ranking) |
| R.LL3.1/.2/.3 | M4-C-S1 | LL.3 fix-before-prod recommendations | M5 retrieval-pipeline change |
| Sthana + Drik Shadbala ECR | M3 inherited | `[EXTERNAL_COMPUTATION_REQUIRED]` per CLAUDE.md §I B.10; JH access dependency | M5+ alongside KR.M3A.JH-EXPORT |
| Narayana Dasha verification | M3 inherited (DIS.012 R1/R2) | `compute_narayana.py` output `needs_verification: true` | M5 alongside JH integration; or M8 multi-school verification |
| KR.M3A2.1 | M3-A2 red-team | PAT.008 ECR clarification — could explicitly cite FORENSIC §3.5 | Opportunistic doc-clarity (M5+) |
| AC.M3A.5 | M3 inherited | Post-baseline delta run (auth wall — BHISMA GAP.P.9) | M4-class with auth-secrets availability (carries to M5) |
| External acharya review on M3 deliverables | M3 R.M3D.1 | Aspirational; in-session native review = AC.M3D.3 PASS at M3 close | M5+ alongside §Acharya Reviewer Pool Policy recruitment |
| SIG.MSR.207 + SIG.MSR.497/498/499 absent from MSR_v3_0.md | M4-A | msr_domain_buckets.json `missing_signal_ids.count: 4`; MSR §I declares 500, file carries 495 | M4-substrate cleaning pass or M5+ MSR expansion |
| KR.W9.1 + KR.W9.2 | BHISMA inherited | Eval-runner auth wall + parser quirk (BHISMA GAP.P.9) | M4-class with auth-secrets availability (carries to M5) |
| KR.M3.RT.LOW.1 | M3 red-team | KP per-planet snapshot vs 0°-360° boundary table | M5 follow-up |

### §3.3 — Items deferred-post-M5

| ID | Source | Description | Owner / ETA |
|---|---|---|---|
| DIS.010/011/012 RESOLVED-N3 | M3-PRE-D-GOVERNANCE | Jaimini multi-tradition forks (chara_dasha, narayana_dasha, atmakaraka — defer to M9 multi-school triangulation) | M9 |
| UCN inline citation pass (Option A) | inherited | UCN_v4_0.md inline citation pass; not gating | Post-M5 documentation pass |
| TS test-fixture errors | inherited | tests/components/AppShell.test.tsx + ReportGallery.test.tsx; 9 errors; pre-W6 portal-redesign drift | Portal Redesign R-stream |

### §3.4 — Items closed prior to M4-D entry (audit only)

KR.M4A.CLOSE.1 (M4-B-S3 CALIBRATION_RUBRIC frontmatter flip); KR.M4A.CLOSE.2 (M4-B-S5 NAP.M4.5 native acceptance of single-track); F.RT.S4.1 (variance_estimator field); F.RT.S4.2 / F.RT.S4.3 (acknowledged); R.LL2GATE.3 (protocol N≥3 floor); F.RT.S6.M.1 (mirror discharged at M4-C-S1); F.M4CS3.MIRROR.1 + F.M4CP7.MIRROR.1 (DISCHARGED at M4-C-S4); F.RT.S6.M.2 (DISCHARGED at M4-C-S4 manifest registration of M4_B_CLOSE); R.LL5DESIGN.1 + R.LL6DESIGN.1 (DECISION-1 propagation at M4-C-S4); R.LL2GATE.2 (Domain mapping closed at M4-C-S4). LL.4 §5.4 date-precision modifier (applied per session-brief).

**No item exits M4-D as silently open.** AC.M4D.7 satisfied.

---

## §4 — IS.8(b) macro-phase-close red-team — RT.1–RT.5 verdicts

Conducted in-document per ONGOING_HYGIENE_POLICIES §G discharge-of-cadence-class clause; same convention as M4-B-S6 and M4-C-S4 sub-phase closes (extended to macro-phase-close granularity here).

- **RT.1 — LL.N computation discharge**: LL.1 (production 30 + shadow 380); LL.2 (shadow 9,922; FULL_PASS gate); LL.3 + LL.4 (recommendation docs + LL.4 JSON view); LL.5 (shadow 380); LL.6 (shadow 37×380); LL.7 (shadow 243). Each computation consumed declared L1 inputs (LEL v1.6 training partition; MSR_v3_0 for signal roster; CDLM v1.1 for LL.7) and produced versioned, frontmatter-bearing output. **PASS**.
- **RT.2 — NAP.M4.1 through NAP.M4.7 native verdicts**: 7/7 reached native decision before M4 close. APPROVED list per §2 above. **PASS**.
- **RT.3 — Shadow-mode discipline**: LL.7 prior remains in `signal_weights/shadow/`; LL.5 + LL.6 remain shadow; LL.1 30 promoted via NAP.M4.5 two-pass per `SHADOW_MODE_PROTOCOL §3` binding. No shadow→production promotion in this session. DECISION-1 (R.LL5DESIGN.1 mechanism rename) recorded in NAP.M4.6 audit trail; DECISION-2 (literal CDLM construction) recorded in LL.7 outer metadata + NAP.M4.6 brief v1.2. **PASS**.
- **RT.4 — CURRENT_STATE v-sequence audit**: M4-A through M4-D version trail v1.3 → v1.4 → v1.5 → v1.6 → v1.8 (v1.7 RESERVED-for-parallel-collision per v1.8 changelog) → v1.9 → v2.0 → v2.1 → v2.2 → v2.3 → v2.4 → v2.5 → v2.6 → v2.7 → v2.8 → v2.9 → v3.0 → v3.1 → v3.2 → **v3.3** (this session). v1.7 documented gap; no other gaps. **PASS**.
- **RT.5 — schema_validator baseline = 108 violations**: Confirmed at M4-C close (and reaffirmed as the post-rebuild baseline established at M4-B-S6-CLOSE per AC.S6.4). This session does not increase the count — files touched are governance-layer only (CURRENT_STATE; SESSION_LOG; CAPABILITY_MANIFEST; M4_CLOSE markdown; PHASE_M4D_PLAN status flip). Verified at W10 (see session_close block). **PASS**.

**Aggregate verdict**: **PASS** 5/5 axes; 0 CRITICAL / 0 HIGH / 0 MEDIUM / 0 LOW / 0 NOTE / 0 INFO new findings beyond §3 dispositions already recorded.

Counter rotation: 0 → 1 (M4-D-S1 substantive close-class) → 0 (IS.8(b) macro-phase-close cadence DISCHARGED in this §4 per ONGOING_HYGIENE_POLICIES §G). Next IS.8(a) every-third cadence-fires at counter=3 (three substantive sessions hence — likely deep into M5). Next IS.8(b) macro-phase-close cadence at M5 close. Next §IS.8(c) every-12-months MACRO_PLAN review remains 2027-04-23 due.

---

## §5 — M5 setup recommendations (priority-ordered, max 8)

Advisory only per brief hard constraint ("no M5 files are created"). To be expanded into PHASE_M5_PLAN at M5-S1.

1. **Open M5 with PHASE_M5_PLAN authoring.** Read `MACRO_PLAN_v2_0.md §M5` (DBN topology + signal embedding refit-stability + CW.PPL volume gate verification) and decide single-session scope vs sub-phase decomposition. Default: phase-plan analogue of PHASE_M4_PLAN.
2. **PPL volume gate is M5's hard prerequisite.** `MACRO_PLAN §M5` requires ≥50 prospective predictions with ≥6 months elapsed before M5 substantive work begins. Current state: 16 predictions in PPL log (PRED.M3D.HOLDOUT.001+002 with `partition: held_out`; remainder M2-class). Substantial gap to close. M5-S1 scope must include PPL inventory + cadence proposal.
3. **CDLM patch landing window (CF.LL7.1).** Parallel session M4-D-P1 executing CDLM Pancha-MP anchor patch this session. M5 entry must consume the patched CDLM and re-emit `ll7_discovery_prior_v1_0.json` with expected flip of 8 MED-tier sanity anchors from `novel` → `confirmed` (per LL.7 design §4 sanity-check).
4. **Gemini synchronization (R.LL1TPA.1) re-attempt at M5 entry.** Final M4 record was NOT_REACHABLE throughout. Re-attempt mirror-pair propagation at M5 entry per `LL1_TWO_PASS_APPROVAL §5.5`. If REACHABLE: ratify or contest accumulated M4 surrogate decisions retroactively per `GOVERNANCE_INTEGRITY_PROTOCOL §K.3`. If NOT_REACHABLE: continue surrogate-disclosure ledger.
5. **JH-export workstream (KR.M3A.JH-EXPORT + Sthana/Drik ECR + Narayana Dasha verification).** All three external-computation items are M5+ scope per NAP.M4.3 Option Y. Coordinate with native to schedule JH-access window before any DIS.009 full-closure attempt.
6. **LL.3 fix-before-prod recommendations (R.LL3.1/.2/.3).** Retrieval-pipeline change scope per LL3_DOMAIN_COHERENCE §5.1. M5 should integrate with DBN topology proposal so retrieval surfaces consume the corrected domain mapping.
7. **LL.2 per-edge promotion campaign.** Gate-level promotion-block lifted at M4-B-S5; per-edge execution deferred. M5 should schedule per-edge two-pass approval campaign for the 8 MED-tier Pancha-MP anchors (and any LL.2 edges that flip from `novel` to `confirmed` post CDLM patch).
8. **MSR signal-completeness pass (SIG.MSR.207 + 497/498/499).** msr_domain_buckets.json reports 4 absent signal IDs vs MSR §I declared count of 500. M5 substrate cleaning pass should reconcile.

---

## §6 — Known asymmetries

### §6.1 — R.LL1TPA.1 — Gemini mirror gap (FINAL_NOT_REACHABLE)

Gemini was synchronously NOT_REACHABLE from every M4 session (M4-A, M4-B-S1 through S6, M4-C-S1 through S4, M4-C-P6/P7, M4-D-S1). Mirror-pair MP.1 (CLAUDE.md ↔ .geminirules), MP.2 (composite ↔ .gemini/project_state.md), MP.3 (MACRO_PLAN ↔ Gemini cross-references), MP.4 (PHASE-plans ↔ Gemini cross-references), and MP.5 (CAPABILITY_MANIFEST ↔ Gemini L2.5 path subset) updates were applied to the Claude-side governance surfaces and to the .geminirules / .gemini/project_state.md static documentation surfaces — but NOT propagated synchronously to the live Gemini agent. Per `GOVERNANCE_INTEGRITY_PROTOCOL §K.3` surrogate-disclosure ledger convention, all M4 NAP verdicts (NAP.M4.1–7) and DECISION-1/-2 were taken by surrogate (Claude) standing in for Gemini's pass_2 review role. M5 entry re-attempt obligation persists per `LL1_TWO_PASS_APPROVAL §5.5`. If Gemini becomes synchronously reachable in M5+, surrogate verdicts are subject to retroactive ratification or contestation per the protocol.

### §6.2 — CF.LL7.1 — CDLM Pancha-MP anchor patch (CLOSED_PARALLEL)

Per pre-decided NAP.M4.7 verdict α, CDLM patch executes in parallel session **M4-D-P1** (concurrent with this M4-D-S1 close). At M4-D-S1 close, `025_HOLISTIC_SYNTHESIS/CDLM_v1_1.md` patch status is "in flight"; M4-D-S1 does not touch L2.5 (per brief must_not_touch). M5 entry will consume the patched CDLM (post M4-D-P1 commit) and re-emit `ll7_discovery_prior_v1_0.json`. Until that re-emit, the 8 MED-tier LL.2 sanity anchors remain classified as `novel` in LL.7 output — correct under current CDLM, not a defect.

### §6.3 — KR.M4A.RT.LOW.1 — Malformed root tree at commit 0793719 (DEFERRED)

Commit 0793719 (M4-A-INTEGRATION-PASS) carries a duplicate `01_FACTS_LAYER` entry in its root tree per `git ls-tree`. **On-disk file content is correct.** All subsequent commits wrote clean trees over it; all reads work normally. The malformation is cosmetic. Per pre-decided verdict, git history rewrite (force-push to main; risk of collateral) outweighs cosmetic benefit. Carry to M5 hygiene pass for opportunistic cleanup at native convenience. No functional impact.

---

*End of M4_CLOSE_v1_0.md v1.0 SEAL. M4 macro-phase formally closed at M4-D-S1 (2026-05-02). M5 entry unblocked. CURRENT_STATE flipped M4 → M5 INCOMING at this same session per W6 (active_macro_phase: M4 CLOSED / M5 INCOMING).*
