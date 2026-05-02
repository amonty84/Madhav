---
artifact: 06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/LL6_TEMPORAL_DENSITY_DESIGN_v1_0.md
canonical_id: LL6_TEMPORAL_DENSITY_DESIGN_v1_0
version: "1.0"
status: SHADOW
produced_during: M4-C-S2-LL6-TEMPORAL-DENSITY
produced_on: 2026-05-02
mechanism: LL.6 — Temporal Density Modulator (per-event weight applied to LL.1 lit_score contributions)
phase: M4-C
parent_phase_plan: 00_ARCHITECTURE/PHASE_M4C_PLAN_v1_0.md (M4-C-S2 row)
authoritative_protocol: 06_LEARNING_LAYER/SHADOW_MODE_PROTOCOL_v1_0.md §3 (NAP.M4.4 APPROVED 2026-05-02)
machine_readable_view: 06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/signal_weights/shadow/ll6_temporal_density_v1_0.json
inputs_consulted:
  - 06_LEARNING_LAYER/OBSERVATIONS/lel_event_match_records.json (37 training + 9 held-out events; rubric_option B)
  - 06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/signal_weights/shadow/ll1_shadow_weights_v1_0.json (380 observed signals)
  - 01_FACTS_LAYER/LIFE_EVENT_LOG_v1_2.md (event temporal distribution context)
  - 06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/LL4_PREDICTION_PRIOR_v1_0.md §2 (held_out>training gap interpretation context)
shadow_status: SHADOW (no shadow→production split this round; LL.6 first shadow write)
n1_disclaimer: |
  All findings derive from a single native (n=1) corpus of 37 training events (held-out 9
  excluded). LL.6 is a per-event weight modulator; it does not produce per-signal weights
  for production promotion. Outputs are diagnostic and informational. Per MACRO_PLAN
  §3.5.A Principle 1 — n=1 validity disclaimer.
---

# LL.6 — Temporal Density Modulator

VALIDITY NOTICE: These calibration weights are derived from a single native's (n=1)
life event corpus. They are provisional, subject to revision as the corpus grows, and
must not be interpreted as universal Jyotish signal weights. Per MACRO_PLAN §3.5.A
Principle 1 — n=1 validity disclaimer.

## §1 — Mechanism

LL.6 computes a `density_penalty` per training event. Events that occur within a
high-density temporal cluster (≥3 LEL events within a rolling 365-day window
centered on the event) receive a penalty weight `< 1.0` applied to their
`match_rate` contribution in LL.1. The mechanism prevents cluster-saturated
signals — signals that fire only because the corpus has multiple events packed
into a short window — from inflating `mean_lit_score` and being counted as
better-supported than they actually are.

**Output.** A per-event `density_weight`, written to
`signal_weights/shadow/ll6_temporal_density_v1_0.json`. The companion per-signal
`mean_lit_score_density_adjusted` view in the same file applies the per-event
weights to LL.1's per-signal observations to surface signals whose support is
disproportionately cluster-driven.

**Scope at first write (M4-C-S2).** LL.6 is a *modulator* of LL.1's existing
per-signal mean — not a replacement for LL.1 weights, not a per-signal weight
register, not a promotion-eligible artifact. The LL.6 output is informational
to LL.5 (retrieval ranker), to LL.7 (discovery prior shaping at S3), and to any
M4-D pre-promotion sanity check that wishes to discount cluster-saturated
signals when ranking by `mean_lit_score`. Shadow-mode discipline applies; LL.6
does NOT retroactively revise LL.1 weights.

## §2 — Cluster detection algorithm

**Input.** The 37 training events in
`lel_event_match_records.json` (held-out 9 excluded per Learning Layer
discipline #4). Each event carries `event_date_used` (ISO date string).

**Window.** A rolling 365-day window centered on each event: ±182 days. The
window is *inclusive of the event itself* and *inclusive of both endpoints*
(`event_date - 182 ≤ d ≤ event_date + 182`). All comparisons use the
`event_date_used` field.

**Cluster size.** For each event `e`, `cluster_size(e) = |{e' ∈ training :
event_date(e') within ±182 days of event_date(e)}|`. The event itself
contributes `1`, so a temporally isolated event has `cluster_size = 1`.

**Density weight formula.** `density_weight(e) = 1 / log₂(cluster_size(e) + 1)`.

| `cluster_size` | `log₂(cs + 1)` | `density_weight` |
|---:|---:|---:|
| 1 | 1.000 | 1.0000 |
| 2 | 1.585 | 0.6309 |
| 3 | 2.000 | 0.5000 |
| 4 | 2.322 | 0.4307 |
| 5 | 2.585 | 0.3869 |

**Note on brief example values.** The session brief enumerates examples
"`cluster_size=2 → 0.585`". The literal formula `1/log₂(3)` evaluates to
`0.6309`, not `0.585`. The other example values in the brief
(`cs=1 → 1.0`; `cs=3 → 0.5`; `cs=5 → 0.387`) match the formula exactly. The
discrepancy at `cs=2` is treated as a brief enumeration error; this design
doc and the JSON output use the formula `1 / log₂(cluster_size + 1)` as
authoritative. The brief's three other example values agree with the
formula's outputs to three decimal places.

**Cluster-size distribution in the 37 training events** (computed at this
session):

| `cluster_size` | event count |
|---:|---:|
| 1 | 7 |
| 2 | 10 |
| 3 | 11 |
| 4 | 8 |
| 5 | 1 |

7 events sit alone in their 365-day window (`cluster_size = 1`, no penalty).
30 of 37 training events (81%) sit in some cluster; 20 of 37 (54%) sit in a
"dense" cluster (`cluster_size ≥ 3`) per the cluster-density threshold in §1.

## §3 — Impact analysis spec

For each of the 380 observed signals in
`ll1_shadow_weights_v1_0.json`:

1. Read the signal's `observations` list (training-only per LL.1 producer
   discipline). Each observation is `{event_id, lit_score}`.
2. Compute `density_adjusted_mean` per the §4 hard-constraint formula:
   `mean(observation.lit_score × density_weight[observation.event_id])`
   across observations.
3. Compute `delta = mean_lit_score_raw − mean_lit_score_density_adjusted`.
   A positive `delta` indicates the density-adjustment shrank the signal's
   support (typical for signals whose observations cluster in dense windows).
   A `delta` near `0` indicates the signal's observations are temporally
   spread (or all in `cluster_size = 1` windows).
4. Flag the signal `meaningful_flag = true` iff `delta > 0.1` — i.e., the
   density adjustment changed the mean by more than 10 percentage points.

**Empirical results at this write.** 255 of 380 signals (67%) carry
`meaningful_flag = true`. The mean delta across observed signals is
`0.2202`; the maximum delta is `0.5693` (worst-case signal whose observations
sit entirely in a `cluster_size = 5` event). The minimum delta is `0.0000`
(signals whose observations all sit in `cluster_size = 1` events get zero
adjustment by construction).

The high `meaningful_flag` rate is consistent with the cluster-size
distribution in §2: 81% of training events sit in some cluster, and the LL.1
observations inherit that distribution because each `lit_score = 1.0`
contribution gets weighted down by the host event's `density_weight`. The
adjustment is a structural floor on `mean_lit_score` for any signal observed
exclusively in clustered events; it does not require any signal-specific
hypothesis.

## §4 — Shadow-mode constraints (binding)

The following constraints apply to the LL.6 output and to any downstream
consumer wiring this round:

- **Hard constraint — formula application.** `density_weight` is applied
  per-event to `lit_score` *before* the mean is taken. The brief's hard
  constraint forbids the alternative form
  `density_adjusted_mean = mean_lit_score_raw × mean(density_weights)`,
  which would be wrong because `density_weights` are correlated with
  observation locations and the cross-product expansion is not
  algebraically equivalent.
- **No LL.1 weight revision.** LL.6 does NOT revise LL.1 shadow weights or
  LL.1 production weights. The 30 LL.1 promoted signals (M4-B-S5) are
  unchanged by this write. Any signal whose `meaningful_flag = true` AND
  whose LL.1 status is `production` carries the LL.6 finding as a
  diagnostic flag for M4-D cross-system reconciliation, not as a
  re-promotion trigger.
- **Shadow status.** The LL.6 output's `shadow_status: SHADOW`. Per
  `SHADOW_MODE_PROTOCOL §3.5`, LL.6 has its own promotion path keyed to
  consumer-engine wiring (LL.5 / LL.7 / M4-D pipeline). At first write
  (M4-C-S2) no consumer is wired; the artifact is read-only-by-humans
  until LL.5 (M4-C-S1) integrates it as a feature.
- **Held-out partition sacrosanct.** The 9 held-out events are excluded
  from cluster detection AND from impact analysis. Their `match_rate`
  values (mean `0.9133`) are reported in §6 as the held-out reference
  unchanged. LL.6 does not see held-out lit_scores during computation.
- **Two-pass approval.** LL.6 is a per-event modulator, not a per-signal
  weight register; per `SHADOW_MODE_PROTOCOL §3.5 LL.6`, LL.6 promotion
  criteria evaluate at LL.6 promotion time (post-M4-C; not this round).
  This first write carries no two-pass approval block.

## §5 — Output schema for ll6_temporal_density_v1_0.json

The output JSON has the following structure:

```yaml
# Outer metadata
schema_version: "1.0"
mechanism: "LL.6"
phase: "M4-C"
produced_during: "M4-C-S2-LL6-TEMPORAL-DENSITY"
produced_on: "2026-05-02"
design_doc_version: "1.0"
design_doc_path: "...LL6_TEMPORAL_DENSITY_DESIGN_v1_0.md"
rubric_version: "1.0"
rubric_option: "B"
input_files:
  lel_event_match_records: "...lel_event_match_records.json"
  ll1_shadow_weights: "...ll1_shadow_weights_v1_0.json"
training_events_used: 37
held_out_events_excluded: 9
cluster_window_days: 365
cluster_window_radius_days: 182
cluster_density_threshold: 3
density_formula: "1 / log2(cluster_size + 1)"
aggregation_rule_per_signal: "..."  # per-event weighting then plain mean per brief
meaningful_delta_threshold: 0.1
promotion_criteria_ref: "...SHADOW_MODE_PROTOCOL_v1_0.md §3"
shadow_status: "SHADOW"
promotion_status: "shadow"
kill_switch_state: "clear"
partition: "training"
n1_disclaimer: "..."
audit_trail:
  computation_session: "M4-C-S2-LL6-TEMPORAL-DENSITY"
  computation_date: "2026-05-02"

# Summary block
summary:
  total_signals_observed: 380
  meaningful_adjustment_count: 255
  mean_delta_across_signals: 0.2202
  max_delta: 0.5693
  min_delta: 0.0
  cluster_size_distribution: {"1": 7, "2": 10, "3": 11, "4": 8, "5": 1}
  raw_training_mean: 0.6300
  density_adjusted_training_mean_weighted: 0.6231
  density_adjusted_training_mean_plain: 0.3813
  held_out_raw_mean: 0.9133
  h2_gap_raw: 0.2834
  h2_gap_adjusted_weighted: 0.2902
  h2_gap_reduction_weighted: -0.0069
  h2_gap_adjusted_plain: 0.5320
  h2_gap_reduction_plain: -0.2487
  h2_finding: "..."  # see §6

# Events array (37 entries)
events:
  - event_id: "EVT.1984.02.05.01"
    event_date_used: "1984-02-05"
    cluster_size: 1
    density_weight: 1.0
  - ...

# Signals array (380 entries)
signals:
  - signal_id: "SIG.MSR.001"
    mean_lit_score_raw: 1.0
    mean_lit_score_density_adjusted: 0.5
    delta: 0.5
    meaningful_flag: true
    n_observations: 3
  - ...
```

`delta` sign convention: `delta = raw − adjusted`. Positive delta = adjustment
shrank the mean (cluster-saturated signal); near-zero delta = signal observed
in temporally spread or solo events. `delta < 0` is structurally impossible
under the formula since `density_weight ≤ 1.0` for all `cluster_size ≥ 1`;
floating-point noise may produce values near `−0.0` and is reported as `0.0`.

## §6 — LL.4 H2 test — does density adjustment shrink the training/held_out gap?

LL.4 §2.2 names three hypotheses for the held_out (`0.9133`) > training
(`0.6300`) gap (`Δ ≈ +0.28`):

- **H1.** Decade-stratified held-out selection bias inflated held-out match-rates.
- **H2 (LL.4 framing).** LEL `retrodictive_match`-pending events have artifactually
  high `match_rate`.
- **H3.** Genuine generalization (least likely under n=37).

The M4-C-S2 brief reframes the LL.4 hypothesis structure for LL.6's purposes
and labels the hypothesis under test "**H2 — dense-cluster inflation of the
training mean**". This is a *companion* hypothesis to LL.4's H2 (retrodictive
labeling bias), not a direct restatement: LL.6 tests whether
training-partition `match_rate` is artifactually *depressed* by clustered
training events whose individual `lit_scores` are near-perfect but whose
observations are over-represented in the per-signal mean.

**Test design.** Recompute the training-partition mean with each event's
`match_rate` weighted by its `density_weight`:

- *Weighted-mean form:* `Σ (mr_e × dw_e) / Σ (dw_e)`. Natural interpretation:
  events in dense clusters contribute proportionally less to the aggregate.
- *Plain-mean form:* `mean(mr_e × dw_e)`. Aggressive interpretation: dense
  clusters' contributions are penalized in absolute terms, not just
  proportionally.

**Empirical findings.**

| Metric | Value |
|---|---:|
| `raw_training_mean` | 0.6300 |
| `density_adjusted_training_mean_weighted` | 0.6231 |
| `density_adjusted_training_mean_plain` | 0.3813 |
| `held_out_raw_mean` (unchanged — held-out sacrosanct) | 0.9133 |
| `h2_gap_raw` (held_out − training_raw) | +0.2834 |
| `h2_gap_adjusted_weighted` | +0.2902 |
| `h2_gap_reduction_weighted` | **−0.0069** (gap *grew*, not shrank) |
| `h2_gap_adjusted_plain` | +0.5320 |
| `h2_gap_reduction_plain` | **−0.2487** (gap grew dramatically) |

**Finding (informational only).** Density adjustment does NOT shrink the
training/held_out gap at the natural weighted-mean form; the gap shifts by
`−0.0069` (effectively zero, in the *wrong* direction). The plain-mean form
worsens the gap by `−0.2487` because it absolute-penalizes clustered events
without a balancing normalization. Both forms argue *against* the
"dense-cluster inflation" hypothesis at this corpus scale: the clustered
events are NOT the events whose individual `match_rate` is near-perfect — if
they were, weighting them down would visibly shrink the training mean toward
held_out parity. They are not, so the adjustment leaves the gap intact.

This means LL.4's §2.2 H1 (decade-stratified selection bias) and H2 (LEL
retrodictive labeling bias) remain the load-bearing explanations of the gap.
LL.6's "dense-cluster" companion hypothesis is empirically rejected at n=37.

**Discipline note.** Per the brief's hard constraint, this finding is
informational only. It does NOT trigger LL.1 weight revision, does NOT
re-open NAP.M4.5 (LL.1 promoted-signal verdict), and does NOT amend the LL.4
recommendation document. The finding is recorded here and in the JSON
`summary.h2_finding` field; downstream M4-D cross-system reconciliation may
consume it as one input among several when ranking the LL.4 hypothesis
priorities.

## §7 — Known limitations

- **Window heuristic.** The 365-day window (`±182 days`) is a heuristic. A
  natural year is the dominant astrologically-meaningful cadence (annual
  transits, Jupiter quarter-cycles, Saturn 2.5-year sign-tenancy
  fractions), but 365 days has no first-principles derivation. Other
  windows worth testing in M5: 90 days (quarterly), 540 days (1.5
  Saturn-sign-cycle), 730 days (2-year). Sensitivity analysis is M5+ scope.
- **Density formula is one of many.** `1 / log₂(cluster_size + 1)` is a
  log-decay penalty that maps `cs=1 → 1.0` (no penalty) and decays slowly
  toward `0` as `cs` grows. Alternatives worth comparing in M5:
  `1 / cluster_size` (harmonic, harsher), `1 / sqrt(cluster_size)` (gentler),
  `1 - α × log(cluster_size)` for tunable `α`. The log₂ form was chosen for
  its smooth `cs=1 → 1.0` boundary, slow tail decay, and dimensional
  parsimony (no tunable `α`). It is not optimal in any first-principles
  sense.
- **Cluster definition is event-symmetric, not signal-anchored.** LL.6 treats
  every event the same regardless of which signals it lit. A signal-anchored
  variant would compute density only over the events that lit a given signal
  — this is a different question (signal-specific concentration) and is
  M5+ scope. The current formulation answers the simpler, corpus-level
  question first.
- **Held-out events not penalized.** Held-out events are excluded from
  cluster detection AND from impact analysis per Learning Layer discipline
  #4. If the held-out partition is itself dense (per inspection: 4 of 9
  held-out events in 2020s, partial cluster), the held-out mean is *not*
  density-adjusted in the H2 test — only the training mean is. This is a
  conservative choice: it does not allow LL.6 to "fix" the held-out
  partition's selection bias by post-hoc reweighting. Held-out treatment
  remains read-only.
- **n=37 floor.** With only 7 events at `cluster_size = 1` and 1 event at
  `cluster_size = 5`, the per-`cluster_size` sample sizes are too small for
  any per-cluster-size statistical inference. The aggregate findings in
  §3 + §6 are descriptive at n=1 (single native, single corpus), not
  inferential.
- **No interaction with LL.2 edge weights.** The LL.6 output ignores LL.2
  edge support — a signal that fires in dense clusters AND is well-supported
  by intra-cluster LL.2 edges may deserve different treatment than a
  signal that fires in dense clusters with no LL.2 backing. LL.6 × LL.2
  interaction is M4-D / M5 scope.
- **Brief enumeration error at `cs=2`.** Documented in §2; the formula is
  authoritative and produces `0.6309` for `cs=2`, not the brief's `0.585`.

## §8 — Changelog

- **v1.0 (2026-05-02, M4-C-S2-LL6-TEMPORAL-DENSITY):** Initial design + first
  shadow write. 37 training events analyzed; 380 LL.1-observed signals
  density-adjusted. Cluster-size distribution {1:7, 2:10, 3:11, 4:8, 5:1};
  meaningful_flag (delta>0.1) on 255 of 380 signals (67%); mean delta
  `0.2202`; max delta `0.5693`. H2 test (dense-cluster-inflation of training
  mean) **rejected at n=37**: weighted-form gap_reduction `−0.0069`
  (effectively zero, wrong direction); plain-form `−0.2487` (gap worsens).
  LL.4 §2.2 H1 (selection bias) and H2 (retrodictive labeling) remain the
  load-bearing gap explanations. Authored under brief
  `M4-C-S2-LL6-TEMPORAL-DENSITY` (parallel to S1 LL.5 dasha-transit
  synergy session). LL.6 first write sets `shadow_status: SHADOW`,
  `promotion_status: shadow`. Two-pass approval not applicable this round
  (per-event modulator, not per-signal weight register). Held-out 9-event
  partition sacrosanct (verified by partition filter; no held-out
  observations consulted in computation).

---

*End of LL6_TEMPORAL_DENSITY_DESIGN_v1_0.md v1.0. LL.6 first shadow write
complete; output at `signal_weights/shadow/ll6_temporal_density_v1_0.json`;
informational consumption by LL.5 / LL.7 / M4-D as authorized in
SHADOW_MODE_PROTOCOL §3.5 LL.6 row.*
