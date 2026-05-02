---
artifact: 00_ARCHITECTURE/EVAL/NAP_M4_7_BRIEF_v1_0.md
canonical_id: NAP_M4_7_BRIEF
version: "1.0"
status: PENDING_NATIVE_DECISION
authored_by: M4-C-P7-M4D-ENTRY-PREP
authored_at: 2026-05-02
nap_id: NAP.M4.7
nap_topic: M4 macro-phase close approval — M4 → M5 flip gate
nap_default_per_phase_plan: >
  PHASE_M4_PLAN §5 default for NAP.M4.7: "Yes, if both [held-out test PASS +
  red-team PASS] pass; if either fails, surface non-conformance for native
  disposition before flip." This brief presents the M4 close picture so the
  native can ratify or hold per the default's spirit.
binding_gate_on:
  - CURRENT_STATE flip from active_macro_phase: M4 → active_macro_phase: M5
  - 06_LEARNING_LAYER substrate entering M5 production-pipeline framing
  - M5 entry (DBN topology proposal + prior elicitation; per MACRO_PLAN §M5)
companion_plan: 00_ARCHITECTURE/PHASE_M4D_PLAN_v1_0.md (authored same session)
predecessor_close_artifacts:
  - 00_ARCHITECTURE/M4_A_CLOSE_v1_0.md (M4-A sub-phase sealed 2026-05-02)
  - 06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/M4_B_CLOSE_v1_0.md (M4-B sub-phase sealed 2026-05-03)
  - 06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/M4_C_CLOSE_v1_0.md (M4-C sub-phase pre-draft 2026-05-03; sealing at M4-C-S4 future)
status_explanation: >
  This brief is the native-facing decision artifact for NAP.M4.7. It does NOT
  pre-decide approval; it presents what M4 produced, the conditions the native
  is being asked to ratify, and the decision template. The native may approve,
  hold for any specific issue, or reject with rationale. M4-D-S1 reads the
  verdict at the binding-gate point (work item (j) per PHASE_M4D_PLAN §3.1).
changelog:
  - v1.0 PENDING_NATIVE_DECISION (2026-05-02, M4-C-P7-M4D-ENTRY-PREP):
    Initial brief. Six sections per AC.P7.3: §1 what NAP.M4.7 decides; §2 M4
    summary for native review; §3 condition for approval; §4 decision
    template; §5 downstream consequences; §6 changelog. Flips to
    `M4_APPROVED` (or `M4_HELD` per native verdict) at M4-D-S1 native
    sign-off. Companion plan: `00_ARCHITECTURE/PHASE_M4D_PLAN_v1_0.md`
    (M4-D execution plan, same session).
---

# NAP.M4.7 — M4 Macro-Phase Close Approval — Brief

## §1 — What NAP.M4.7 decides

NAP.M4.7 is the **M4 macro-phase close approval gate**. It decides whether the
M4 Learning Layer substrate (LL.1 production weights + LL.2 / LL.5 / LL.6 /
LL.7 shadow + LL.4 recommendation priors) — built across W1 / M4-A / M4-B / M4-C
— is **trustworthy enough** for the M5 probabilistic-model machinery to inherit
and consume.

Per `MACRO_PLAN_v2_0.md §M4` Native-approval points: "calibration scoring
rubric; shadow-mode exit rule (how many observations + what validity margin
before a weight promotes out of shadow); LEL entry-bias audit resolution"
were earlier-NAP gates (NAP.M4.1 / .4 / .2 + .3, all already resolved).
NAP.M4.7 is the LAST native gate inside M4 — the **binding ratification** that
the macro-phase has done what it set out to do.

Per `PHASE_M4_PLAN_v1_0.md §5` NAP.M4.7 default: "Yes, if both [held-out test
PASS + red-team PASS] pass; if either fails, surface non-conformance for
native disposition before flip." This brief is the surfacing.

**Decision authority:** native (Abhisek Mohanty). Brief presents the M4 close
picture; native's verdict gates the M4 → M5 CURRENT_STATE flip at M4-D-S1
(per `PHASE_M4D_PLAN §3.1` work item (j)).

**This brief is not a recommendation.** The native is being asked to make a
substantive judgment, not to ratify Claude's preferred outcome. §2 below
presents what M4 built; §3 names the conditions the native confirms (or
holds); §4 is the decision template.

---

## §2 — M4 summary for native review

### §2.1 — What was built across W1 / A / B / C / D

**M4-W1 (plan authoring)** — `PHASE_M4_PLAN_v1_0.md` v1.0 authored at
Cowork-M4-W1-PLAN-AUTHORING-2026-05-01 (commit 3669a0a). Sub-phases M4-W1
through M4-D defined; AC.M4A.1–AC.M4D.8 specified.

**M4-A (LEL Ground-Truth Spine)** — sealed 2026-05-02 at M4-A-CLOSE-LEL-PATCH
(`M4_A_CLOSE_v1_0.md` v1.0). 11 sessions (1 plan + 4 substantive Round 2 +
1 integration + 3 substantive Round 3 + 1 integration + 1 NAP-decisions append +
1 close). Deliverables:
- LEL v1.3 → v1.4 (Swiss Ephemeris on 11 pending events) → v1.5 (§9 migration
  annotations) → v1.6 (GAP.M4A.04 dual-tag patch).
- `lel_event_match_records.json` 46 records (37 training / 9 held-out,
  decade-stratified 2/3/4 across 2000s/2010s/2020s); schema v1.1; rubric
  Option B; mean match_rate 0.685 (training 0.630 / held-out 0.913).
- `CALIBRATION_RUBRIC_v1_0.md` v1.0-DRAFT → v1.1 (NAP.M4.1 Option B APPROVED).
- `SHADOW_MODE_PROTOCOL_v1_0.md` v1.0 (NAP.M4.4 §3 promotion criteria APPROVED
  + binding throughout M4-B/C: N≥3, variance ≤0.3, two-pass approval, validity
  margin match_rate ≥0.4).
- `LEL_GAP_AUDIT_v1_0.md` v1.0 → v1.1 (NAP.M4.2 dispositions: 1 patch + 5
  deferred + 5 accept) → v1.2 (M4-B-P1 PARTIAL_CLOSE on GAP.M4A.04).
- `JH_EXPORT_DISPOSITION_v1_0.md` v1.0 (NAP.M4.3 Option Y — JH carry forward).
- IS.8(a) every-third red-team `REDTEAM_M4A_v1_0.md` PASS 6/6 axes.
- 10/10 PHASE_M4_PLAN AC.M4A PASS at M4-A close.

**M4-B (LL.1 + LL.2 + LL.3 + LL.4 Activation)** — sealed 2026-05-03 at
M4-B-S6-CLOSE (`M4_B_CLOSE_v1_0.md` v1.0). 10 sessions (6 substantive +
4 governance-aside). Deliverables:
- **LL.1 — Per-signal weight calibration: PRODUCTION (30 of 30).**
  `signal_weights/shadow/ll1_shadow_weights_v1_0.json` 380 signals
  (30 promotion-eligible / 285 insufficient_observations N<3 / 52
  shadow_indefinite_low_match_rate / 13 shadow_indefinite_high_variance).
  `signal_weights/production/ll1_weights_promoted_v1_0.json` 30 signals at
  `status: production`; `weights_in_production_register: true`. NAP.M4.5 native
  pass_2 30/30 approved 2026-05-02 (M4-B-S5, commit b508d6e). Joint Tier-C
  question on SIG.MSR.118/.119/.143 (identical aggregate stats — N=11 mean=0.4545
  variance=0.2727): native verdict (a) three independent calibrated phenomena.
- **LL.2 — Edge weights: SHADOW (gate-level UNBLOCKED).**
  `signal_weights/shadow/ll2_edge_weights_v1_0.json` 9,922 edges (HIGH=0,
  MED=8 Pancha-MP clique, LOW=9,914, ZERO=0; cross_domain=0, intra_domain=9,922).
  `LL2_STABILITY_GATE_v1_0.md` v1.0 CONDITIONAL_PASS → v1.1 FULL_PASS at NAP.M4.5
  cascade. Per-edge promotion deferred to LL.2 promotion time (separate from
  M4-D ordering).
- **LL.3 — Domain-bucket coherence: COMPLETE.** `LL3_DOMAIN_COHERENCE_v1_0.md`
  v1.0 — recommendation document; 7 recommendations (3 fix-before-prod
  R.LL3.1/2/3; 4 investigate-in-M5+ R.LL3.4–7).
- **LL.4 — Prediction-prior recommendation: COMPLETE.** `LL4_PREDICTION_PRIOR_v1_0.md`
  v1.0 → v1.1 (machine-readable view added at S5). Companion JSON view
  `signal_weights/ll4_prediction_priors_v1_0.json` (10 domain priors + 3
  signal-class priors + date-precision global modifier).
- IS.8(a) red-team in-session at M4-B-S4 PASS_WITH_FINDINGS (0 HIGH/CRITICAL/
  MEDIUM; 1 LOW + 1 NOTE + 1 INFO). IS.8(b)-class sub-phase-close red-team
  in-document at M4-B-S6 PASS_WITH_FINDINGS (5 axes; 0 CRITICAL/HIGH; 1 MEDIUM
  mirror staleness DISCHARGED at M4-C-S1 + 1 LOW + 1 NOTE + 1 INFO).
- 10/10 PHASE_M4_PLAN AC.M4B PASS at M4-B close.

**M4-C (LL.5 + LL.6 + LL.7 native-only)** — sealing at M4-C-S4 future session
(`M4_C_CLOSE_v1_0.md` v1.0 DRAFT pre-draft authored 2026-05-03 at
M4-C-P6-S4-PREDRAFT). 4 substantive (S1, S2, S3, S4 pending) + 1 governance-aside
(P6) + 1 governance-aside (this session, P7). Deliverables (S1–S3 closed):
- **LL.5 — Dasha-Transit Synergy: SHADOW.** `signal_weights/shadow/
  ll5_dasha_transit_v1_0.json` (M4-C-S1, 2026-05-02, commit f30f696). 380 signals;
  HIGH=2 / MED=12 / LOW=252 / ZERO=114; dasha_dominant=259 / transit_dominant=1 /
  balanced=6; lit_source dasha 410 / transit 4 / both 6.
- **LL.6 — Temporal Density Modulator: SHADOW (informational).**
  `signal_weights/shadow/ll6_temporal_density_v1_0.json` (M4-C-S2, 2026-05-02,
  commit 0c15a20). 37 events × cluster_size + density_weight; 380 signals ×
  density_adjusted means. cluster-size {1:7, 2:10, 3:11, 4:8, 5:1};
  meaningful_adjustment_count 255/380 (67%); mean delta 0.2202; max 0.5693.
  H2 dense-cluster-inflation REJECTED at n=37 (informational input to M4-D
  hypothesis ranking on LL.4 §2.2; not load-bearing).
- **LL.7 — Discovery Prior: NATIVE-ONLY ARTIFACT.** `signal_weights/shadow/
  ll7_discovery_prior_v1_0.json` (M4-C-S3, 2026-05-02, commit fee3a5b).
  NAP.M4.6 Option B + 3 refinements (`unconfirmed` rename; raw N≥3
  threshold; 8 MED-tier sanity-check anchor) + DECISION-2 literal
  msr_anchors-clique CDLM construction. **243 emitted edges = 107 novel + 136
  unconfirmed + 0 confirmed + 0 contradicted**; 9,867 noise excluded from
  9,974 raw co-firing pairs. **All 8 MED-tier LL.2 anchor pairs classify as
  `novel`** (PASS gate per NAP §6.3(b) raw N≥3 — sanity_anchor_novel_count: 8;
  sanity_anchor_confirmed_count: 0). CF.LL7.1 CDLM-patch carry-forward flagged.
- IS.8(a) red-team in-session at M4-C-S3 PASS_4_OF_4 (LL.5 / LL.6 / LL.7 shadow
  integrity + DECISION audit trail).
- M4-C-S4 sub-phase close (sealing M4_C_CLOSE_v1_0.md + LL.5/LL.6 mechanism-name
  propagation per DECISION-1 + IS.8(b)-class sub-phase-close red-team) is the
  next session before M4-D opens.

**M4-D (this approval gate's macro-phase close)** — `PHASE_M4D_PLAN_v1_0.md`
v1.0 DRAFT authored same session as this brief. M4-D-S1 produces
M4_CLOSE_v1_0.md + REDTEAM_M4_v1_0.md + HANDOFF_M4_TO_M5_v1_0.md + CURRENT_STATE
flip M4 → M5 (gated on this NAP.M4.7 verdict).

### §2.2 — Key numbers

- **46 LEL events** (LEL v1.6) — 37 training / 9 held-out (decade-stratified
  2/3/4); held_out 9 sacrosanct end-to-end across M4 (verified at every
  shadow/production write).
- **30 production-weight LL.1 signals** (NAP.M4.5 30/30 approved). 380
  shadow-observed.
- **5 LL mechanisms** activated: LL.1 (production), LL.2 (shadow; gate
  unblocked), LL.4 (recommendation + JSON view), LL.5 (shadow), LL.6 (shadow;
  informational), LL.7 (native-only artifact). LL.3 (recommendation document;
  no shadow→production split). LL.8 SCAFFOLD-M4 (activates at M5).
- **107 novel LL.7 discoveries** (CDLM-as-prior; literal clique construction;
  8 MED-tier anchors all novel under DECISION-2).
- **243 LL.7 emitted pairs** (107 novel + 136 unconfirmed + 0 confirmed + 0
  contradicted). 9,867 noise pairs excluded from 9,974 raw co-firing pairs.
- **8 sanity-check anchors all novel** (Pancha-Mahapurusha clique:
  MSR.117/.118/.119/.143/.145/.402; CDLM does not declare these as msr_anchors
  in governing cells — CF.LL7.1 patch workstream).
- **NAPs resolved: NAP.M4.1 + .2 + .3 + .4 + .5 + .6** (6 of 7). NAP.M4.7
  is this brief.
- **Red-team passes:** REDTEAM_M4A 6/6 axes PASS (IS.8(a)); M4-B-S4 in-session
  IS.8(a) PASS_WITH_FINDINGS; M4-B-S6 in-document IS.8(b)-class
  PASS_WITH_FINDINGS; M4-C-S3 in-session IS.8(a) PASS_4_OF_4. M4-D IS.8(b)
  macro-phase-close pending at M4-D-S1.

### §2.3 — What did NOT happen

Listed for completeness; native confirms whether these absences are acceptable
or hold M4:

- **No DBN, no probabilistic signal-state outputs, no cohort-mode LL.7.** M5
  scope per `MACRO_PLAN §M5`. LL.8 remains SCAFFOLD-M4.
- **No retrieval / synthesis surface changes.** `platform/**` untouched
  throughout M4. Consumption-surface wiring is M5+ scope.
- **No held-out partition test executed against the production weights.**
  AC.M4C.5 + AC.M4D.1 (per PHASE_M4_PLAN §3.4 paragraph 1) declare the
  calibration-validity test. M4-C close pre-draft §2 marks this `[PENDING-S4]`
  and the held-out 9 events remain in their sacrosanct partition. **The held-out
  test is a calibration-validity check whose absence is governed by
  Learning-discipline rule #4 ("held-out prospective data is sacrosanct; the
  model never sees outcome before prediction").** The M4-C calibration-validity
  test as currently designed is a *retrospective* match-rate check on held_out
  records (not a prospective prediction); held_out mean match_rate is 0.913 vs.
  training 0.630 — flagged in LL4_PREDICTION_PRIOR §2 as not a clean validity
  figure (H1 decade-stratified-selection-bias load-bearing). Native confirms
  whether the retrospective gap is sufficient validity evidence at M4 close,
  OR whether a deferred prospective test (M5+ via PPL minimum-volume gate)
  is the correct frame.
- **External acharya review** on M4 deliverables — carries to M5+ alongside
  acharya panel recruitment per `Acharya Reviewer Pool Policy`.
- **JH D9 export verification** for the 35 D9-dependent MSR signals
  (KR.M3A.JH-EXPORT) — carries to M5 per NAP.M4.3 Option Y.
- **MSR_v3_0.md SIG.MSR.207 + SIG.MSR.497/498/499 absent gap** (4 IDs missing
  from the 499-declared roster) — M4-substrate cleaning pass or M5+.
- **CDLM Pancha-MP anchor patch (CF.LL7.1)** — M4-D / M5 disposition required
  (this brief §3 condition (c)).

---

## §3 — Condition for approval

The native is being asked to confirm the following four conditions. The native
may confirm all four (M4 APPROVED), or hold M4 on any one or more (M4 HELD
with the specific issue named).

### §3.1 — Condition (a): the 30 LL.1 production weights are trustworthy for M5 consumption

The 30 promoted LL.1 signals are the **load-bearing calibration substrate** that
M5's DBN will consume as initial signal-weight priors. Native confirms:

- **n=1 disclaimer** is acknowledged. The 30 weights are calibrated on the n=1
  native's life events; their generalizability to a cohort or to the native's
  future is governed by Learning-discipline rules #1–#5 + §LL-Appendix.C
  binding table, not by the calibration figures alone.
- **Held-out test pending** is acknowledged. The 9-event held-out partition has
  match_rate 0.913 retrospectively, but a *prospective* test requires PPL
  volume-gate of ≥50 predictions ≥6 months elapsed (per `MACRO_PLAN §M5` +
  `PHASE_M4_PLAN §10`) — current PPL state: 16 predictions, 2 with held_out
  partition (windows 2026-08-15 + 2027-08-19+). The earliest meaningful
  prospective test fires when the first held_out window closes (2026-08-15).
- **Joint Tier-C verdict on SIG.MSR.118/.119/.143** (three independent calibrated
  phenomena) is the binding native ratification at NAP.M4.5; the production
  register reflects this verdict.
- **The 30 signals are appropriate** for M5's DBN as starting parameters
  per the M5 entry state requirement "M4 closed (calibration tables stable;
  LL.1–LL.7 active)".

→ **Confirm condition (a)?** YES / HOLD-with-issue.

### §3.2 — Condition (b): LL.7 novel discoveries are sufficiently interesting to warrant M5 investigation

LL.7 emitted 107 novel-class pairs (and 136 unconfirmed-class pairs) under
NAP.M4.6 Option B + 3 refinements + DECISION-2 literal CDLM clique
construction. Native confirms:

- **107 novel-class pairs** (intra-clique non-CDLM patterns at raw N≥3) are
  worth carrying into M5+ as discovery candidates — i.e., the discovery-prior
  shaping framework is producing substrate that M5's probabilistic model
  should ingest, not noise that should be discarded.
  - The novel count is **higher than NAP_M4_6_BRIEF v1.1 §6.4's
    estimate (~5–15 novels)**. The mismatch is documented in `LL7_DISCOVERY_PRIOR_DESIGN_v1_0.md`
    §7 (item 8) as "empirical-vs-NAP shape divergence at first write" — this
    is data, not a defect, but native may want to rate-limit the discovery
    output.
- **136 unconfirmed-class pairs** (CDLM edges with no empirical co-firing in
  the 37-event training partition) are a clean-data carry — no co-activation
  observed, classical edge declared.
- **0 confirmed-class pairs** is correct under DECISION-2 literal construction:
  the 8 MED-tier LL.2 anchors all classify as novel because their MSR IDs do
  not appear in CDLM cells' `msr_anchors` field. CF.LL7.1 (per condition (c)
  below) is the patch workstream that would flip these from novel → confirmed.
- The 8 sanity-check anchors all classifying as novel rather than confirmed
  is a **gate PASS** under DECISION-2 (not a sanity-check FAIL); per
  NAP_M4_6_BRIEF v1.2 §6.3.A correction.

→ **Confirm condition (b)?** YES / HOLD-with-issue.

### §3.3 — Condition (c): CF.LL7.1 (CDLM patch) disposition

`CF.LL7.1` is the carry-forward workstream for patching CDLM to add
Pancha-Mahapurusha cluster MSR IDs (MSR.117/.118/.119/.143/.145/.402) to the
`msr_anchors` field of governing CDLM cells (D1.D1 Sasha-Saturn-Kendra; D5.D5
Venus-Malavya; D5.D6 Mars-Ruchaka; D5.D7 Jupiter-Hamsa; exact cell selection
is L2.5 CDLM authoring scope). The patch would flip the 8 MED-tier LL.2
anchor pairs from `novel` → `confirmed` in the next LL.7 emit.

Native picks one of:

- **Option α — Approve as M5 workstream.** CF.LL7.1 enters HANDOFF_M4_TO_M5
  §inherited open items as M5 owner, ETA "early M5". The CDLM patch happens
  before M5 LL.5/LL.6 production-promotion uses the LL.7 substrate.
- **Option β — Defer to M6+.** CF.LL7.1 carries beyond M5 (e.g., M8
  classical-text cross-reference may surface additional anchor patches at
  scale; native may prefer to batch CDLM patches against M8 attribution
  scope). LL.7 v1.0 stays as-is across M5 entry.
- **Option γ — Resolve in M4-D.** CDLM patch + LL.7 re-emit happens at
  M4-D-S1. Cost: 025_HOLISTIC_SYNTHESIS touch (frozen unless native-approved)
  + LL.7 re-emit + manifest re-bump + M4_CLOSE re-shaping.

→ **Confirm condition (c) disposition:** α / β / γ / other-with-rationale.

### §3.4 — Condition (d): no open issue blocks M5 entry

The full residual roster entering M4-D is at `PHASE_M4D_PLAN §5` — 41
enumerated items classified resolve-in-M4-D (R) / accept-as-M5-input (A) /
defer-post-M5 (D). The native confirms:

- **No item in the 41 is silently blocking M5.** Every item has a tracked
  disposition. (HANDOFF_M4_TO_M5 §inherited open items will record final
  classification at M4-D-S1 per AC.M4D.7.)
- **Items defaulted A (accept-as-M5-input)** are acceptable as M5 owner with
  the named ETA. In particular: KR.M3A.JH-EXPORT (NAP.M4.3 Option Y), Sthana +
  Drik Shadbala ECR, Narayana Dasha verification, R.LL1TPA.1 Gemini reachability
  (re-attempt at M5 entry), R.LL2GATE.2 cross-system signal-ID domain mapping
  (R or A — possibly resolved at M4-D-S1).
- **The held-out test, currently retrospective**, is acceptable as M4-close
  evidence; the prospective held_out test fires at M5+ via PPL volume-gate
  (per condition (a)).

→ **Confirm condition (d)?** YES / HOLD-with-issue.

---

## §4 — Decision template

Native records verdict in SESSION_LOG (M4-D-S1 entry) as follows:

```yaml
nap_m4_7_verdict:
  decision: APPROVED | HELD | REJECTED
  decided_at: <YYYY-MM-DD>
  decided_by: native (Abhisek Mohanty)

  # If APPROVED — short-form (default if no further notes)
  notes: "M4 approved."

  # If APPROVED with rationale (optional)
  notes: "M4 approved. <≤200 char rationale or specific note>"

  # If HELD — required to name the specific issue
  hold_issue: |
    <specific condition or item that must be resolved before M4 → M5 flip>
  hold_remediation_session: <name or estimate>

  # If REJECTED — required rationale (rare; brief becomes v1.1 with revised
  # plan)
  reject_rationale: |
    <full rationale; brief re-opens>

  # Per-condition confirmations (a)–(d) per §3
  conditions:
    a_30_ll1_signals_trustworthy: YES | HOLD
    b_ll7_novels_interesting: YES | HOLD
    c_cf_ll7_1_disposition: alpha | beta | gamma | <other>
    d_no_open_issue_blocks_m5: YES | HOLD
```

**Default if no explicit decision per `PHASE_M4_PLAN §5`:** "Yes, if both
[held-out test PASS + red-team PASS] pass; if either fails, surface
non-conformance for native disposition before flip." Operationally, this
means: if M4-D-S1 IS.8(b) red-team returns PASS (or PASS_WITH_FIXES with
fixes applied) AND the held-out retrospective evidence is intact, AND the
native does not surface a hold, M4 → M5 flip executes. The four-condition
sign-off above is the explicit form of this default's "spirit".

**The brief does not assume approval.** The native may hold M4 for any reason
not listed in §3 above — the four conditions are the ones Claude can name in
advance; the native's judgment is the final arbiter.

---

## §5 — Downstream consequences

### §5.1 — If APPROVED

**Immediate at M4-D-S1 close** (work item (j) per PHASE_M4D_PLAN §3.1):

- CURRENT_STATE flips: `active_macro_phase: M4 → M5`. M4
  `active_macro_phase_status: closed`. M4 sealing artifact path
  (`00_ARCHITECTURE/M4_CLOSE_v1_0.md`) recorded.
- `red_team_counter: 0` (IS.8(b) discharged at M4-D-S1).
- Mirror MP.1 + MP.2 propagated same-session per ND.1 (`.geminirules` +
  `.gemini/project_state.md` reflect M4 closed + M5 active).
- HANDOFF_M4_TO_M5_v1_0.md sealed with full inherited-open-items roster.
- Brief frontmatter `status: PENDING_NATIVE_DECISION` → `M4_APPROVED`.

**First M5 session inherits and acts on:**

- **30 LL.1 production weights** as DBN initial signal-weight priors.
- **9,922 LL.2 shadow edges** as DBN topology candidates (gate-unblocked;
  per-edge promotion deferred separately).
- **LL.5 dasha_weight 380 signals** (shadow) as ranker-feature inputs to
  retrieval-time M5 query plan.
- **LL.6 density_weight 37 events × 380 signals** (shadow) as informational
  modulator for M5 prediction-time outputs.
- **LL.7 107 novel + 136 unconfirmed + 8 sanity-anchors** (native-only
  artifact) as discovery-mode prior shaping for M5 forward predictions.
- **LL.4 qualitative priors** (recommendation document + machine-readable
  JSON view) as M5 prior elicitation input per NAP.M4.4 binding criteria.
- **CF.LL7.1 CDLM-patch workstream** per condition (c) Option α / β / γ.
- **LEL v1.6** (46 events; 37 train / 9 held-out sacrosanct) as the
  ground-truth spine M5 cross-validates against.

**First M5 session priorities** (per `MACRO_PLAN §M5` exit state requirements):

- DBN topology proposal authoring + native review (NAP.M5.1 — first M5 NAP).
- Prior specification + native review (NAP.M5.2).
- Signal embedding refit-stability test design.
- CW.PPL volume-gate verification (≥50 predictions ≥6 months elapsed —
  current state 16 predictions, far short — explicit acknowledgment that
  M5 close is time-gated to 2027 at earliest).

### §5.2 — If HELD

**M4-D-S1 closes as PARTIAL.** CURRENT_STATE remains at M4-C-CLOSED /
M4-D-IN-FLIGHT. The specific holding issue named in `hold_issue` becomes the
scope of the next session (M4-D-S2 or analogous remediation session). M4 →
M5 flip does not execute until the holding issue is resolved and NAP.M4.7 is
re-presented. Brief frontmatter `status: PENDING_NATIVE_DECISION` →
`M4_HELD_PENDING_REMEDIATION` with `hold_issue` cited.

### §5.3 — If REJECTED

**Brief re-opens at v1.1.** M4-D-S1 closes without M4 → M5 flip; M4 macro-phase
re-plans per native rationale. This outcome is unlikely given the 6 prior
NAPs all resolved cleanly + 10/10 ACs PASS at M4-A and M4-B and (expected)
clean at M4-C-S4 sealing — but the brief does not pre-decide.

---

## §6 — Changelog

- **v1.0 PENDING_NATIVE_DECISION (2026-05-02, M4-C-P7-M4D-ENTRY-PREP):**
  Initial brief. Authored as parallel governance slot ahead of M4-D-S1 (which
  carries the binding NAP.M4.7 native sign-off). Six sections per AC.P7.3:
  §1 what NAP.M4.7 decides; §2 M4 summary for native review (W1 + A + B + C);
  §3 four conditions for approval (LL.1 trustworthy + LL.7 novels interesting
  + CF.LL7.1 disposition + no open issue blocks M5); §4 decision template
  (APPROVED / HELD / REJECTED with sub-condition fields); §5 downstream
  consequences per outcome path; §6 changelog. Companion plan:
  `00_ARCHITECTURE/PHASE_M4D_PLAN_v1_0.md` v1.0 DRAFT (M4-D execution plan,
  same session). Predecessor close artifacts: M4_A_CLOSE v1.0 (sealed
  2026-05-02); M4_B_CLOSE v1.0 (sealed 2026-05-03); M4_C_CLOSE v1.0 DRAFT
  (sealing at M4-C-S4 future).

  **Brief neutrality.** Per AC.P7.3 hard constraint: "NAP.M4.7 brief presents
  the decision clearly without pre-deciding. The native may hold M4 for any
  reason; the brief must not assume approval or pressure toward it." This
  v1.0 honors that constraint — §3 conditions are presented as questions
  for native confirmation; §4 template is symmetric across APPROVED / HELD /
  REJECTED; §5 documents all three outcome paths. The brief states the M4
  picture as Claude sees it; the native's judgment is the final arbiter.

---

*End of NAP_M4_7_BRIEF_v1_0.md (status PENDING_NATIVE_DECISION). Native
sign-off at M4-D-S1 per `PHASE_M4D_PLAN §3.1` work item (h). Verdict drives
the M4 → M5 CURRENT_STATE flip at work item (j).*
