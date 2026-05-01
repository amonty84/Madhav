---
artifact: 06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/LL3_DOMAIN_COHERENCE_v1_0.md
version: "1.0"
status: CURRENT
produced_during: M4-B-S4-LL3-DOMAIN-COHERENCE
produced_on: 2026-05-02
mechanism: LL.3 Domain-Bucket Coherence (diagnostic recommendation document — does not contain weights)
phase: M4-B
parent_phase_plan: 00_ARCHITECTURE/PHASE_M4_PLAN_v1_0.md §3.2 (M4-B sub-phase scope)
authoritative_protocol: 06_LEARNING_LAYER/SHADOW_MODE_PROTOCOL_v1_0.md §2 (LL.3 row — adapter-note discipline; no weight register at M4)
inputs_consulted:
  - 06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/signal_weights/shadow/ll1_shadow_weights_v1_0.json (380 observed signals; 30 promotion-eligible)
  - 06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/signal_weights/shadow/ll2_edge_weights_v1_0.json (9,922 edges; 8 MED-tier; 0 cross-domain)
  - 06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/LL2_STABILITY_GATE_v1_0.md (gate decision = CONDITIONAL_PASS, confirmed at session open)
  - 06_LEARNING_LAYER/OBSERVATIONS/lel_event_match_records.json (37 training + 9 held-out events; rubric_option B)
  - 025_HOLISTIC_SYNTHESIS/MSR_v3_0.md (via msr_domain_buckets.json, 495/499 signals across 10 buckets)
  - 00_ARCHITECTURE/EVAL/NAP_M4_5_DOSSIER_v1_0.md (the 30 promotion-eligible signals + Tier-C joint-firing analysis)
ll2_stability_gate_decision_at_authoring: CONDITIONAL_PASS
n1_disclaimer: |
  Every observation in this document derives from a single native (n=1) corpus of 37
  training events plus a 9-event held-out validity set. The recommendations below are
  diagnostic, not statistically-significant findings. Honest framing per
  MACRO_PLAN §3.5.A Principle 1 carries through. This document is a recommendation, not
  a weight register, and produces no shadow→production split per
  SHADOW_MODE_PROTOCOL_v1_0.md §2 LL.3 row.
---

# LL.3 — Domain-Bucket Coherence Report

## §1 — Purpose

LL.3 is the third learning-layer mechanism in `SHADOW_MODE_PROTOCOL_v1_0.md §2`. Unlike
LL.1 (per-signal weights) and LL.2 (per-edge modulators), LL.3 ships at M4-B as a
**recommendation document, not a weight register**. The protocol's §2 LL.3 row names the
M4-B-class deliverable explicitly: an adapter-discipline note, no shadow→production
split. This document discharges that obligation against the M4-B-S4 brief AC.S4.2 schema.

Specifically, this report answers four diagnostic questions across §2–§5 below:

- **§2** — *Coverage*. For each of the 10 MSR domain buckets, how much of the bucket
  has been *observed* in the 37-event training partition? Where are the dead zones?
- **§3** — *Per-signal coherence*. For each of the 30 LL.1 promotion-eligible signals,
  do the LEL events where it lit belong to the signal's MSR-declared domain?
- **§4** — *Edge-coherence spot-check*. From the LL.2 shadow's HIGH/MED-tier edges, are
  any of them cross-domain surprises that warrant promotion to discovery candidates?
- **§5** — *Recommendations*. What follows from §2–§4 that is actionable in M4-C / M5
  attention, and what is "fix-before-production" vs "investigate-in-M5"?

§6 lists known limitations (chiefly: n=37; structural rubric coupling; sparse domain
coverage). §7 is the changelog.

This document does **not** propose new weights, does **not** modify any LL.1 or LL.2
shadow files, and does **not** act on the LL.2 stability gate. The gate is unchanged at
`CONDITIONAL_PASS` and re-evaluates at NAP.M4.5 close per `LL2_STABILITY_GATE §5`.

---

## §2 — Domain coverage table (MSR-anchored)

The reference universe is `06_LEARNING_LAYER/OBSERVATIONS/msr_domain_buckets.json`,
which assigns each of 495 MSR signals to one of 10 domain buckets (4 of 499 MSR signal
IDs absent from the bucketing — SIG.MSR.207/497/498/499 — are flagged as carry-forward
to M5+ per `notes` in the bucket file). The "observed" column is the count of
`SIG.MSR.NNN`-keyed signals from each MSR bucket that appear in the LL.1 shadow file
(380 observed signals total).

**Bucket coverage table — MSR-anchored, 37-event training partition.**

| domain         | in_MSR | observed_in_LL1 | obs / MSR | N≥3 in obs | promotion_eligible | mean_match_rate (over obs) |
|----------------|-------:|----------------:|----------:|-----------:|-------------------:|---------------------------:|
| career         |    207 |             207 |     1.00  |        0   |               0    |                       0.483 |
| education      |      0 |               0 |       —   |        —   |               —    |                       —     |
| family         |     20 |               0 |     0.00  |        0   |               0    |                       —     |
| financial      |     64 |              64 |     1.00  |        0   |               0    |                       0.422 |
| general        |     15 |              15 |     1.00  |       15   |               5    |                       0.285 |
| health         |     31 |              31 |     1.00  |       31   |              14    |                       0.473 |
| psychological  |     20 |               0 |     0.00  |        0   |               0    |                       —     |
| relationship   |     39 |              39 |     1.00  |       39   |               1    |                       0.376 |
| spiritual      |     94 |               0 |     0.00  |        0   |               0    |                       —     |
| travel         |      5 |               5 |     1.00  |        0   |               0    |                       0.400 |

Plus 19 LEL semantic-class IDs (`CTR.NN` / `CVG.NN` / `SIG.NN` / `RPT.DSH.NN`) that
have no MSR domain assignment — `domain: unknown` in the LL.1 shadow file. Of these,
10 of 19 are promotion-eligible (the same 10 listed in NAP_M4_5_DOSSIER §2 rows 1–9
plus RPT.DSH.01).

### §2.1 — Findings

- **Three MSR buckets are unobserved end-to-end: family (20), psychological (20),
  spiritual (94).** 134 of 495 (27%) of bucketed MSR signals never fired in any of the
  37 training events. The structural cause is documented at LEL_GAP_AUDIT and at
  M4-A close: events in the LEL training partition tend to be activity-events
  (career changes, marriage, illness, financial decisions, travel) rather than
  inner-life events (psychological-shift events, spiritual-practice events, kin-
  relationship-event types beyond the marriage at EVT.2013.12.11.01).
- **Education is structurally absent.** MSR v3.0's domain ontology has no `education`
  tag; `msr_domain_buckets.json notes` documents this explicitly. Education-relevant
  signals flow through `career` or `general` buckets (5H Mercury / 4H education-house /
  Saraswati Yoga signals tagged at the architectural level for retrieval routing). Not
  a defect — a known structural design property.
- **Career is the largest bucket (207 signals = 42% of MSR) and is fully observed
  (207/207), but yields zero promotion-eligible signals.** Every career signal has
  N < 3 in the training partition. Each individual `SIG.MSR.NNN` career signal is
  highly specific (one dasha-house-aspect configuration each); over 37 events with
  ~14 career-flavored events (career + financial subtotal in event-bucket
  distribution), each specific signal lights once or twice at most. The promotion
  rule (N ≥ 3) is honored, and career signals stay shadow-indefinite under
  `insufficient_observations`.
- **Health is the strongest empirical bucket: 31/31 observed, all 31 with N ≥ 3, 14
  promotion-eligible (47%).** Health signals tend to be more general-firing (each
  signal fires across multiple chronic-condition events spanning Sade Sati cycles).
  The Tier-A signal cluster (mean = 1.0, var = 0.0) is health-dominated (12 of 14
  Tier-A SIG.MSR.NNN signals in NAP_M4_5_DOSSIER §2 are health-domain).
- **General bucket carries the calibration-rich sub-cluster.** 15/15 observed, all 15
  with N ≥ 3, 5 promotion-eligible. Includes the four MED-tier edge endpoints
  (SIG.MSR.117/118/119/143/145/402) and the three Tier-C flagged signals at
  NAP.M4.5. Mean match-rate (0.285) is the lowest of any observed bucket — the
  general bucket carries both reliable signals (Tier-A B-class) and lower-mean
  ones (Tier-C yoga absences).
- **Relationship: 39/39 observed, 39 with N ≥ 3, but only 1 promotion-eligible
  (SIG.MSR.391).** 38 of 39 fail one of the three promotion criteria
  (mean ≥ 0.4 OR variance ≤ 0.3). The bucket is well-covered structurally but
  noisy empirically — many relationship signals fire in some marriage/separation
  events but not others, producing high-variance per-signal profiles.
- **Travel: 5/5 observed but 0 with N ≥ 3.** The 5 travel signals fired in the 5
  travel-or-residential events (`EVT.2019.05.XX.01` US-move, `EVT.2023.05.XX.01`
  India-return, etc.) but each at most twice. Travel-bucket sparsity is an
  inherited M4-A finding (GAP.M4A.04, `partially_closed` per
  `LEL_GAP_AUDIT_v1_2.md §5.5`); LL.3 confirms the calibration-layer impact.
- **The under-representation threshold (obs / MSR < 0.3) flags exactly three
  buckets — family, psychological, spiritual.** These buckets are not just "low
  N" — they are zero-N. M5 retrieval that depends on these buckets will rest on
  unweighted MSR signals (no LL.1 calibration applied) until LEL coverage
  expands.

---

## §3 — Per-signal coherence findings (the 30 promotion-eligible)

For each of the 30 signals, the question AC.S4.2 §3 asks: does the signal's MSR-declared
domain align with the LEL event categories where the signal lit? "Lit" here means
`lit_score ≥ 0.5` per the rubric Option B threshold from `CALIBRATION_RUBRIC_v1_1.md`.

### §3.1 — Distribution

| signal_id    | MSR domain    | N | events where lit (bucket distribution from `match_notes` `expected bucket=` annotation; `*` = annotation absent — special-case event) |
|--------------|---------------|--:|------|
| CTR.01       | unknown       | 5 | * × 5 |
| CTR.03       | unknown       | 5 | * × 5 |
| CVG.02       | unknown       | 5 | * × 5 |
| RPT.DSH.01   | unknown       | 4 | * × 3 (one event below 0.5 lit threshold dropped) |
| SIG.01       | unknown       | 4 | * × 4 |
| SIG.09       | unknown       | 5 | * × 5 |
| SIG.10       | unknown       | 4 | * × 4 |
| SIG.12       | unknown       | 3 | * × 3 |
| SIG.13       | unknown       | 4 | * × 4 |
| SIG.15       | unknown       | 3 | * × 3 |
| SIG.MSR.013  | health        | 3 | health × 3 |
| SIG.MSR.030  | health        | 3 | health × 3 |
| SIG.MSR.118  | general       | 11 | general × 5 (lit≥0.5 of 11 expected; the other 6 had lit_score = 0) |
| SIG.MSR.119  | general       | 11 | general × 5 |
| SIG.MSR.143  | general       | 11 | general × 5 |
| SIG.MSR.145  | general       | 11 | general × 10 |
| SIG.MSR.163  | health        | 3 | health × 3 |
| SIG.MSR.170  | health        | 3 | health × 3 |
| SIG.MSR.198  | health        | 3 | health × 3 |
| SIG.MSR.229  | health        | 3 | health × 3 |
| SIG.MSR.251  | health        | 3 | health × 3 |
| SIG.MSR.278  | health        | 3 | health × 3 |
| SIG.MSR.291  | health        | 3 | health × 3 |
| SIG.MSR.295  | health        | 3 | health × 3 |
| SIG.MSR.297  | health        | 3 | health × 3 |
| SIG.MSR.300  | health        | 3 | health × 3 |
| SIG.MSR.301  | health        | 3 | health × 3 |
| SIG.MSR.391  | relationship  | 3 | relationship × 3 |
| SIG.MSR.402  | general       | 11 | general × 8 |
| SIG.MSR.476  | health        | 3 | health × 3 |

### §3.2 — Mismatch flag count: **0** — but the framing is structural, not empirical

No signal in the promotion-eligible set fires in events outside its declared MSR
domain. The naive reading is "perfect coherence." The honest reading is **the rubric
makes mismatches structurally impossible**: per `CALIBRATION_RUBRIC_v1_1.md §2`
(Option B), each LEL event computes `match_rate = lit_count / |expected_lit_signals|`,
and the `expected_lit_signals` set is filtered to the event's `expected bucket` per
`lel_event_match_records.json` schema. Direct verification (script run at session open):

- For event `EVT.1984.02.05.01` (bucket = general per `match_notes`), all 15
  `expected_lit_signals` carry `signal_domain: general`, and all 6 `actual_lit_signals`
  are general-domain signals (SIG.MSR.117/.118/.119/.124/.402 — all general).
- For event `EVT.1995.XX.XX.01` (bucket = health), all 31 `expected_lit_signals` carry
  `signal_domain: health`, and all 16 `actual_lit_signals` are health-domain MSR
  signals.

The rubric's per-event bucket filter prevents `actual_lit_signals` from drawing from
multiple domains within a single event. Therefore: the §3.1 table's "no mismatches"
verdict is a **rubric-design tautology**, not an empirical validation that signals
actually fire only in their declared-domain events. To empirically test cross-domain
firing, the rubric would need to relax bucket filtering — which is an M5 / M4-D
investigation, not a M4-B finding.

### §3.3 — What LL.3 §3 *can* still surface from the n=37 corpus

Three meaningful sub-findings emerge despite the structural coherence-by-construction:

1. **The 23 special-case events (`expected bucket=` annotation absent).** These are
   events where `match_notes` carry custom rubric prose rather than the standard
   bucket annotation — typically natal-permanent-yoga events (EVT.1984.02.05.01 itself
   is in fact one of these per `match_notes` review; the regex on "expected bucket="
   matched "expected bucket=general (n=15)" inside the prose, so it was bucketed),
   or LEL-retrodictive_match-pending events with mr=1.0. Inspection of the 23
   no-annotation events shows their `expected_lit_signals` sets often span multiple
   `signal_domain` values (e.g., EVT.2013.12.11.01 marriage event has 2 relationship
   + 2 general expected signals). These are the only events where actual cross-
   domain firing is structurally possible, and the eligible signals' firings within
   them are reflected in §3.1 above (signal_dom = unknown rows always lit in
   no-annotation events; no SIG.MSR.NNN promotion-eligible signal fired in a
   no-annotation event of a non-matching bucket).
2. **`SIG.MSR.118 / .119 / .143` — the three Tier-C yoga-absence signals.** Per
   `NAP_M4_5_DOSSIER §3`, these three carry identical aggregate statistics (N=11,
   mean=0.4545, variance=0.2727) but fire on largely *non-overlapping* event subsets.
   The native pass_2 question is: do the firing patterns for each individual signal
   carry their own thematic coherence (Ruchaka-absence on courage/competition events;
   Malavya-absence on relationship/aesthetic; Sarpa-absence on auspicious-survival)?
   The dossier presents the data; LL.3 §3 does not duplicate it. Cross-reference:
   `NAP_M4_5_DOSSIER_v1_0.md §3.4` event-firing matrix.
3. **The 11 LEL-semantic-class IDs (CTR/CVG/SIG/RPT) in the eligible set.** These
   carry `domain: unknown` because they are not in `msr_domain_buckets.json`. The
   "fires only in unknown-bucket events" pattern in §3.1 above is also structural —
   these signals are defined relative to dasha events, not relative to MSR domain
   semantics. M4-D cross-system reconciliation (per `R.LL2GATE.2 (DEFERRED)`) is
   the appropriate venue for assigning these to MSR buckets if a 1:N mapping is
   discovered to be feasible.

---

## §4 — LL.2 edge-coherence spot-check

`ll2_edge_weights_v1_0.json` carries 9,922 edges total: 0 HIGH-tier, 8 MED-tier
(co_count ∈ {4, 5, 7}), 9,914 LOW-tier (co_count ∈ {1, 2, 3}), 0 ZERO-tier (by design).
`cross_domain_count: 0` per the design's §3.5 empirical adjustment (LEL training corpus
is domain-stratified — 21 single-known-domain events + 16 all-unknown-class events + 0
mixed). Per AC.S4.2 §4, spot-check the top-10 by co_count:

| rank | edge (signal_a ↔ signal_b) | domain_a | domain_b | co_count | tier | cross_domain |
|-----:|-------------------------|---------|---------|---------:|:----:|:------------:|
| 1 | SIG.MSR.145 ↔ SIG.MSR.402 | general | general | 7 | MED | false |
| 2 | SIG.MSR.118 ↔ SIG.MSR.145 | general | general | 5 | MED | false |
| 3 | SIG.MSR.119 ↔ SIG.MSR.402 | general | general | 5 | MED | false |
| 4 | SIG.MSR.143 ↔ SIG.MSR.145 | general | general | 5 | MED | false |
| 5 | SIG.MSR.143 ↔ SIG.MSR.402 | general | general | 5 | MED | false |
| 6 | SIG.MSR.117 ↔ SIG.MSR.119 | general | general | 4 | MED | false |
| 7 | SIG.MSR.117 ↔ SIG.MSR.402 | general | general | 4 | MED | false |
| 8 | SIG.MSR.119 ↔ SIG.MSR.145 | general | general | 4 | MED | false |
| 9 | SIG.MSR.013 ↔ SIG.MSR.030 | health  | health  | 3 | LOW | false |
|10 | SIG.MSR.013 ↔ SIG.MSR.163 | health  | health  | 3 | LOW | false |

### §4.1 — Findings

- **All 8 MED-tier edges are intra-`general` and form a clique on the natal-permanent
  yoga-presence/absence cluster** (SIG.MSR.117 / .118 / .119 / .143 / .145 / .402).
  These are six general-domain MSR signals tied to natal Pancha Mahapurusha yogas
  (Ruchaka, Malavya, Sasha) and their absences plus ancillary classical
  yoga-presence signals. Their co-firing is unsurprising and *not* a discovery
  candidate — they co-fire because they are structurally entangled at the natal
  chart level (the same Mars-in-Libra fact drives Ruchaka-absence and several
  related signals; the same Saturn-exaltation fact drives Sasha-presence and
  Sarpa-absence).
- **No cross-domain edge appears in any tier.** The single-domain stratification
  of the LEL corpus is faithfully reflected. M5 cross-domain discovery cannot run
  on this corpus without a rubric extension; the brief's hint to look for
  "discovery candidates" comes back empty, **as expected per the structural
  finding documented at M4-B-S3** (`LL2_EDGE_WEIGHT_DESIGN §3.5+§6.7`).
- **The clique structure has implications for LL.5 / M4-C.** When the same six
  signals always co-fire together, treating them as 6 independent calibration
  inputs at downstream consumption is an over-counting risk: a single underlying
  natal configuration is being scored 6× through 6 derived signals. The
  Pancha-Mahapurusha cluster should be considered for *consolidation* rather than
  *aggregation* — recommend M5 attention.
- **Health-domain top edges (rank 9–10) sit at LOW tier** because each health
  signal fires in only ~3 of the 37 training events (events that map to chronic
  conditions, surgeries, recoveries). The pairwise co-firing of health signals
  (e.g., SIG.MSR.013 ↔ .030 ↔ .163) is consistent with health events being
  multi-signal lighting events: when a health condition fires the rubric's
  expected_lit_signals set, multiple signals light together. This is structural
  too — but, unlike the general-bucket clique, it reflects the *event-density* of
  the chronic-health track, not natal-chart entanglement.

### §4.2 — Honest framing — no cross-domain surprises

The brief's intent for §4 was to flag any HIGH/MED-tier edge whose endpoints span
domains in unexpected ways. The dataset structurally cannot produce such an edge under
the current rubric. M4-D cross-system reconciliation, or M5 LL.5 prediction-prior
scaffolding, is the right venue for empirical cross-domain discovery.

---

## §5 — Recommendations (M4-C / M5 attention)

Distinguish "fix before production" (action required at M4-C entry) from "investigate
in M5" (deeper work):

### §5.1 — Fix before production

- **R.LL3.1** *(SHOULD)* — LL.1 production register, when populated post-NAP.M4.5,
  must carry per-domain N and per-domain promotion-eligible counts in its summary
  block, so the live consumption layer can flag responses for under-represented
  domains (family, psychological, spiritual) with the n=0 disclaimer attached
  rather than acting as if the absence of weights = "no relevant signals". Owner:
  M4-C entry session that lands the production register's frontmatter expansion.
- **R.LL3.2** *(SHOULD)* — The 6-signal `general`-bucket Pancha-Mahapurusha clique
  (SIG.MSR.117/.118/.119/.143/.145/.402) should ship with a *cluster-aware*
  consumption rule at M4-C: the live retrieval layer should not weight all 6
  signals additively when answering a question; instead, it should treat them as
  one underlying configuration with consolidated weight. Mechanism: at M4-C,
  define a "cluster-modifier" feature flag (default off until benchmarked) that,
  when on, sums the cluster's weights and treats them as one signal. Without
  this, downstream synthesis double-counts the natal-yoga structure 6×.
- **R.LL3.3** *(MUST)* — Live retrieval that targets the family / psychological /
  spiritual buckets must explicitly route through MSR-without-LL.1-weights, since
  no LL.1 weight exists for any signal in those buckets. The retrieval layer
  cannot silently treat absence-of-weight as zero-weight (which would suppress
  these domains entirely). Owner: M4-C / M5 entry.

### §5.2 — Investigate in M5

- **R.LL3.4** *(M5 LL.5)* — The structural domain-stratification finding
  (LL2_EDGE_WEIGHT_DESIGN §6.7) needs an explicit M5 reconciliation step: extend
  the activator to mark signals as multi-domain at compute time (per
  `msr_domain_buckets.json multi_domain_notes`, signals like SIG.MSR.001 carry
  primary=career + secondary=[financial, relationship, psychological]); when an
  event is processed, allow secondary-bucket signals to be evaluated even if the
  event's primary bucket is "career." This unlocks cross-domain co-firing
  observation, which in turn unlocks LL.2 cross-domain edges and LL.5
  prediction-prior cross-domain inference.
- **R.LL3.5** *(M5 LEL expansion)* — The 134 unobserved MSR signals across
  family/psychological/spiritual are not low-N (they are zero-N). Closing this
  requires LEL events that target inner-life domains. Per LEL_GAP_AUDIT v1.2
  §5.6, GAP.M4A.04 status remains `partially_closed` (residual deferred per
  NAP.M4.2); analogous gap-audit work for spiritual / psychological / family
  domains is M5+ scope. Recommend a Cowork elicitation pass at M5 entry to add
  spiritual practice events, psychological-shift events, family-relationship
  events.
- **R.LL3.6** *(M5 LL.7 discovery)* — The Tier-C yoga-absence cluster
  (SIG.MSR.118/.119/.143) is the most interesting empirical sub-cluster for
  discovery: three identical aggregate statistics produced by three signals
  firing on largely-disjoint event subsets. After NAP.M4.5 closes (whatever the
  pass_2 verdict), the cluster's per-event firings warrant M5 inspection for
  whether each yoga-absence corresponds to a domain-specific failure mode (e.g.,
  Ruchaka-absence on competition/initiative events, Malavya-absence on
  aesthetic/relationship events, Sarpa-absence as auspicious-survival absence).
- **R.LL3.7** *(M5 / M4-D — cross-system signal reconciliation)* — The 19
  LEL-semantic-class IDs (CTR/CVG/SIG/RPT/DSH) currently carry `domain: unknown`
  because they are absent from `msr_domain_buckets.json`. They are
  dasha-temporal-pattern signals (e.g., RPT.DSH.01 = dasha repeat pattern) rather
  than natal-configuration signals, so a 1-to-1 MSR-bucket map may not be
  appropriate. Recommendation: at M4-D, decide whether to (a) extend MSR with a
  `temporal-pattern` bucket, (b) leave them unbucketed and flag them for
  cluster-routing in retrieval, or (c) introduce a separate
  `temporal_engine_buckets.json` registry. R.LL2GATE.2 already deferred this
  question; LL.3 affirms it is M4-D scope.

### §5.3 — Recommendations not in this report

- LL.3 is silent on adapter / embedding-space artifacts — those are M5+ scope per
  `SHADOW_MODE_PROTOCOL §2 LL.3` row. The protocol explicitly names the M4-B
  deliverable as a recommendation document, not adapter weights.
- LL.3 is silent on prompt-optimization records — that is LL.4 territory (the
  sibling document landing in this same M4-B-S4 session at
  `LL4_PREDICTION_PRIOR_v1_0.md`).
- LL.3 is silent on multi-native generalization — that is M9+ scope per
  `MACRO_PLAN §M9`.

---

## §6 — Known limitations

- **n = 37 training events.** All findings carry the n=1 native + n=37 events
  disclaimer. No claim here generalizes; every recommendation is a hypothesis
  awaiting cross-validation against held-out (n=9) and against future native
  cohorts (M9+).
- **The §3 coherence "tautology."** As §3.2 documents, per-signal domain
  coherence is enforced by rubric design, not measured empirically. The
  zero-mismatch finding is structurally guaranteed and adds little to LL.1 /
  LL.2's per-signal evidence. This limitation is acknowledged honestly per B.10
  + GA.6 (no fabricated significance).
- **§4 cross-domain edges return empty by structural necessity.** The
  zero-cross-domain finding is consistent with M4-B-S3's §3.5 + §6.7 empirical
  adjustment; LL.3 §4 confirms but does not advance the finding. M5 / M4-D
  reconciliation per R.LL3.4 is required to unlock cross-domain observation.
- **§2.1 unobserved-bucket findings are conservative.** Family / psychological /
  spiritual showing 0 / 20 / 20 / 94 observed reflects 37-event sample only. A
  larger LEL (M5+ expansion) may surface signals from these buckets; the current
  zeros are not a claim about MSR signal validity, only about LEL event
  coverage.
- **Single-rubric dependency.** All findings rely on rubric Option B
  (`CALIBRATION_RUBRIC_v1_1.md`). A future rubric option (Option C / D) may
  re-bucket events differently and change §3 / §4 substantially.
- **Embedding-space adaptation deferred.** The brief's earlier
  `next_session_objective` text from M4-B-S3 close mentioned an adapter-
  candidate file at `06_LEARNING_LAYER/EMBEDDING_SPACE_ADAPTATION/
  adaptation_notes_M4B_v1_0.md`. The S4 brief (this session's brief) clarified
  that LL.3 lands at the canonical SIGNAL_WEIGHT_CALIBRATION/ path as a
  recommendation document. Adapter-weight emission is M5 / M4-C scope per
  protocol §2; this LL.3 document discharges the M4-B obligation.

---

## §7 — Changelog

- **v1.0 (2026-05-02, M4-B-S4-LL3-DOMAIN-COHERENCE):** Initial publication.
  - §1 purpose: LL.3 ships at M4-B as a diagnostic recommendation document, not
    a weight register, per `SHADOW_MODE_PROTOCOL §2` LL.3 row.
  - §2 domain coverage: 10-bucket table (MSR-anchored) — career 207/207
    obs / 0 N≥3 / 0 eligible; education 0/0 (structural absence); family 20/0;
    financial 64/64 / 0 / 0; general 15/15 / 15 / 5; health 31/31 / 31 / 14;
    psychological 20/0; relationship 39/39 / 39 / 1; spiritual 94/0; travel
    5/5 / 0 / 0; plus 19 LEL-semantic-class IDs (10 eligible). Three buckets
    flagged under-represented (family, psychological, spiritual — all zero-N).
  - §3 per-signal coherence: 30 promotion-eligible signals all fire only in
    their declared MSR domain — but verdict is **structural by rubric design**,
    not empirical. Three sub-findings still surface (special-case events;
    Tier-C yoga-absence cluster; semantic-class ID handling).
  - §4 LL.2 edge-coherence: top-10 edges all intra-domain (8 MED-tier general-
    bucket clique on Pancha-Mahapurusha signals + 2 LOW-tier health pairs).
    No cross-domain surprises (zero by structural necessity).
  - §5 recommendations: 3 fix-before-production (R.LL3.1 prod-register
    domain summary; R.LL3.2 cluster-aware consumption rule for the
    Pancha-Mahapurusha clique; R.LL3.3 unweighted-MSR routing for unobserved
    buckets) + 4 investigate-in-M5 (R.LL3.4 multi-domain activator; R.LL3.5
    LEL expansion for inner-life domains; R.LL3.6 yoga-absence M5 inspection;
    R.LL3.7 cross-system signal-ID reconciliation at M4-D).
  - §6 5 limitations + §7 changelog.

---

*End of LL3_DOMAIN_COHERENCE_v1_0.md. Recommendation document; no shadow→production
split. Re-evaluation triggers: NAP.M4.5 close (refresh §3.1 distribution if pass_2
demotes any of the 30); M4-C entry (act on R.LL3.1–R.LL3.3); M5 entry (act on
R.LL3.4–R.LL3.7).*
