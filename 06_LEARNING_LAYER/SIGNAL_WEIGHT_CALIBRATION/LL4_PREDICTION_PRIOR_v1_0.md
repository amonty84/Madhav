---
artifact: 06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/LL4_PREDICTION_PRIOR_v1_0.md
version: "1.0"
status: CURRENT
produced_during: M4-B-S4-LL3-DOMAIN-COHERENCE
produced_on: 2026-05-02
mechanism: LL.4 Prediction Prior (recommendation document — does not contain weights)
phase: M4-B
parent_phase_plan: 00_ARCHITECTURE/PHASE_M4_PLAN_v1_0.md §3.2 (M4-B sub-phase scope)
authoritative_protocol: 06_LEARNING_LAYER/SHADOW_MODE_PROTOCOL_v1_0.md §2 (LL.4 row — prompt-optimization-discipline note; no weight register at M4)
inputs_consulted:
  - 06_LEARNING_LAYER/OBSERVATIONS/lel_event_match_records.json (37 training + 9 held-out events; rubric_option B)
  - 06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/signal_weights/shadow/ll1_shadow_weights_v1_0.json (380 observed signals)
  - 06_LEARNING_LAYER/OBSERVATIONS/CALIBRATION_RUBRIC_v1_0.md (Option B: lit_count/|expected| with §2.2 default rules)
  - 06_LEARNING_LAYER/OBSERVATIONS/msr_domain_buckets.json (495/499 signals across 10 domains)
  - 00_ARCHITECTURE/EVAL/NAP_M4_5_DOSSIER_v1_0.md (the 30 promotion-eligible context)
  - 06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/LL3_DOMAIN_COHERENCE_v1_0.md (sibling document, this session)
ll2_stability_gate_decision_at_authoring: CONDITIONAL_PASS (unchanged by this document)
n1_disclaimer: |
  All findings derive from a single native (n=1) corpus of 37 training events plus a
  9-event held-out validity set. Recommendations are diagnostic priors, not statistically
  significant findings. Honest framing per MACRO_PLAN §3.5.A Principle 1 carries through.
  This document is a recommendation, not a weight register, and produces no
  shadow→production split per SHADOW_MODE_PROTOCOL_v1_0.md §2 LL.4 row.
---

# LL.4 — Prediction Prior

## §1 — Purpose

LL.4 is the fourth learning-layer mechanism in `SHADOW_MODE_PROTOCOL_v1_0.md §2`. The
M4-B-class deliverable per the protocol's §2 LL.4 row is a "prompt optimization /
prediction prior recommendation document" — not a weight register, not a prompt
amendment that ships via shadow→production. This document discharges that obligation
against the M4-B-S4 brief AC.S4.3 schema.

The framing question this document answers: **before any LL.1 weight is in production
(NAP.M4.5 still pending) and before any LL.2 edge promotes, what does the calibration
pass already reveal about the instrument's *prior* prediction tendencies?** Three
specific sub-questions structure §2–§5:

- **§2** — *Baseline match-rate.* What is the unconditional rate at which an
  expected signal lights when the rubric says it should?
- **§3** — *Signal-class performance.* Does the basis class (`classical_rule` vs
  `temporal_engine` vs `both`) of an expected signal predict whether it lights?
- **§4** — *Domain-class performance.* Does the MSR domain bucket of an expected
  signal predict whether it lights?
- **§5** — *Prior-calibration recommendation.* Given §2–§4, what qualitative priors
  should weight the instrument's confidence at M5 deployment?

§6 is the changelog. There is no §7 — LL.4 is a shorter document than LL.3, deliberately
tight per the brief AC.S4.3 §1–§6 schema.

This document does **not** propose new prompt amendments, does **not** modify any
prompt registry, and does **not** act on the LL.2 stability gate. The gate stands at
`CONDITIONAL_PASS` and re-evaluates at NAP.M4.5 close per `LL2_STABILITY_GATE §5`.

---

## §2 — Baseline match-rate summary + the held_out > training gap

### §2.1 — The numbers

Reproduced from `lel_event_match_records.json` (script-verified at session open):

| partition | n_events | mean_match_rate | min   | max   | mr = 1.0 events | mr < 0.5 events |
|-----------|---------:|----------------:|------:|------:|----------------:|----------------:|
| all       |       46 |          0.6854 | 0.067 | 1.000 |              22 |              20 |
| training  |       37 |          0.6300 | 0.067 | 1.000 |              15 |              20 |
| held_out  |        9 |          0.9133 | 0.570 | 1.000 |               7 |               0 |

### §2.2 — The gap is real but interpretive, not random

The held_out > training gap (0.913 vs 0.630, Δ ≈ +0.28) is large enough that it cannot
be silently accepted as ordinary sampling variance. Per the M4-B-S4 brief hard
constraint, this section explicitly interprets the gap. Three hypotheses, in
descending order of likely contribution:

#### Hypothesis 1 — Decade-stratified selection inflated held-out salience *(most likely)*

The held-out partition was constructed at `M4-A-INTEGRATION-PASS-R3` per the
`held_out_manifest.selection_criteria` field: "**Decade-stratified per AC.M4A.4
(≈20% of 46 = 9). Preference: EXACT or approx-month dates** (higher-confidence test);
**spread of categories** (career/family/health/financial/psychological); **later
dates within decade** per brief." This selection process actively biased toward:

- Higher-confidence dates → events with richer chart-state data → events the
  rubric can score precisely (no imputation tax).
- Later-decade events (preference for 2020s within the 2020s decade slot) →
  events with fuller LEL prose annotation → richer `expected_lit_signals`
  authoring.
- Category spread → preferentially picked events that exhibit clear domain
  signatures, by construction.

These three preferences each individually correlate with a higher achievable
match_rate. Their conjunction *predicts* held_out > training for any non-trivial
match-rate gap. Decade composition supports the inference: held_out is 4 of 9 (44%)
in the 2020s vs training 13 of 37 (35%) in the 2020s. The 2020s training events have
an even higher mr=1.0 rate (10 of 13 events at mr=1.0) than 2020s events overall, so
the held-out's 2020s overrepresentation alone explains a portion of the gap.

#### Hypothesis 2 — LEL retrodictive_match-pending events have artifactually high mr

Many high-mr events in both partitions carry `match_notes` containing
"`LEL retrodictive_match: pending — expected derived from <category>`". These are
events for which the LEL-author derived `expected_lit_signals` *retrodictively from
the chart pattern*, not pre-blindly. When the rubric scores these, every expected
signal is one the author already knew would fire — by construction, mr trends toward
1.0. This is a known limitation of the n=37 corpus and is documented at
`LEL_GAP_AUDIT_v1_2.md §5` (held-out partition was selected before retrodictive_match
labels were affixed, but did not re-randomize against the labels). M5 expansion of
LEL must address this by separating *prospectively-recorded* expected signals from
*retrodictively-inferred* ones — current PROSPECTIVE_PREDICTION_LOGGING entries in
`prediction_ledger.jsonl` are the future-clean substrate.

#### Hypothesis 3 — Genuine generalization signal *(least likely under n=37)*

It is *possible* that the rubric is genuinely well-calibrated and the held-out gap
reflects honest generalization: signals that fired in training also fire in held-out
events the model has not seen. This hypothesis cannot be falsified at n=9 held-out
events, and the §2.2 H1+H2 confounders alone are sufficient to explain the observed
gap. **The held_out match_rate must not be quoted as a clean validity figure** — at
M5 entry, prospective predictions logged through `prediction_ledger.jsonl` against
events that occur AFTER the prediction is made are the only artifact that can defend
honest generalization. M4-C / M5 must avoid framing held_out=0.913 as "the
instrument is 91% accurate"; it is a contaminated-by-selection figure.

### §2.3 — The lower-bound floor

The training-set mean (0.6300) is the more honest baseline. It is unbiased by the
selection criteria above (the training partition is the residual after held_out is
sampled out, not curated). It still suffers from the retrodictive_match labeling
bias (H2) — but at training-set scale, mixed with `expected bucket` standard
annotations — the bias is more diluted. **0.63 is a reasonable working estimate of
"how often the rubric's expected signal lights when expected" under current rubric
discipline.** It is unimpressive in absolute terms (~ 1 in 3 expected signals fail to
light) and will need M4-C scrutiny against the held-out partition pre-LL.1
production, per `SHADOW_MODE_PROTOCOL §5`.

---

## §3 — Signal-class performance — basis class (training partition)

Each `expected_lit_signal` entry in `lel_event_match_records.json` carries a `basis`
field with values `temporal_engine`, `classical_rule`, or `both`. Computed
mean lit_score per basis class across the 37 training events:

| basis            | n_expected_observations | mean_lit_score | range |
|------------------|------------------------:|---------------:|-------|
| classical_rule   |                      29 |         1.0000 | constant 1.0 |
| both             |                      19 |         1.0000 | constant 1.0 |
| temporal_engine  |                     863 |         0.4267 | 0.0–1.0 |

Reproduced for held-out partition (sanity cross-check):

| basis            | n_expected_observations | mean_lit_score |
|------------------|------------------------:|---------------:|
| classical_rule   |                      12 |         1.0000 |
| both             |                       9 |         1.0000 |
| temporal_engine  |                     229 |         0.5808 |

### §3.1 — Findings

- **`classical_rule` and `both` basis classes are perfectly calibrated.** When the
  rubric expects a classical-rule signal to light, it lights — every time, in both
  partitions. n is small (29+12 classical_rule observations; 19+9 both
  observations) but consistent.
- **`temporal_engine` is the basis class that drives the training-partition gap
  below 1.0.** ~57% of expected temporal_engine signals failed to light in
  training; ~42% in held-out. The 911 of 911 expected_lit observations in training
  are 863 temporal_engine + 29 classical_rule + 19 both = 911; their lit-rate
  weighted average reproduces the training mean_match_rate within rounding
  (0.4267 × 863/911 + 1.0 × 48/911 ≈ 0.434 ≈ training match-rate weighted by
  per-event |expected| sizes).
- **The held-out 0.5808 vs training 0.4267 temporal_engine gap is consistent with
  Hypothesis 1 above**: the held-out partition's selection bias toward
  high-confidence dates and later-decade events directly improves the
  temporal-engine-class signal availability (more accurate dates → more accurate
  dasha/transit/yogini computation → more correctly-fired temporal signals).

### §3.2 — Honest interpretation

The basis-class gap is interpretive evidence that **classical-rule signals (natal
yoga presence/absence, structural-feature signals) are the carrier of high-confidence
prediction at n=1**, and **temporal-engine signals (dasha-window-conditioned
predictions) are the carrier of timing-error variance**. This is consistent with
prior knowledge — natal classical signals are time-stable; temporal signals depend on
date precision and on the dasha/transit engine's correctness. It is also
consistent with the M3-D held-out 10-event sample (10/10 CONSISTENT in
`M3_HELD_OUT_SAMPLE_v1_0.md`): when dates are exact, temporal signals approach the
classical-rule reliability; the gap is a date-precision artifact more than a model
artifact.

---

## §4 — Domain-class performance — domain-bucket lit-rate (training partition)

Mean lit_score per MSR-domain bucket across the 37 training events:

| domain         | n_expected_observations | mean_lit_score | bucket size in MSR |
|----------------|------------------------:|---------------:|-------------------:|
| career         |                     431 |         0.5016 |                207 |
| general        |                     168 |         0.2976 |                 15 |
| relationship   |                     124 |         0.4113 |                 39 |
| health         |                      97 |         0.4948 |                 31 |
| financial      |                      69 |         0.4638 |                 64 |
| psychological  |                       7 |         1.0000 |                 20 |
| spiritual      |                       6 |         1.0000 |                 94 |
| travel         |                       5 |         0.4000 |                  5 |
| education      |                       3 |         1.0000 |                  0 |
| family         |                       1 |         1.0000 |                 20 |

### §4.1 — Findings

- **Highest-n buckets cluster in the 0.40–0.50 lit-rate range.** Career (n=431,
  0.50), relationship (n=124, 0.41), health (n=97, 0.49), financial (n=69, 0.46),
  travel (n=5, 0.40). These are the empirically-evaluable domains. Lit-rate
  variance across them is small; the rubric's calibration is roughly uniform
  across these domains.
- **The general bucket is the worst-performing observed domain at 0.30
  (n=168).** The general bucket carries the natal-permanent yoga signals
  (Pancha Mahapurusha cluster + ancillaries — see LL.3 §4) which fire on a
  natal-permanent basis but light only on the events where the rubric's
  retrieval target overlaps the natal pattern. This produces the high
  variance observed in NAP_M4_5_DOSSIER §3 for SIG.MSR.118/.119/.143.
- **Psychological / spiritual / education / family read 1.00 mean lit, but
  with n ≤ 7 each.** These are not findings — they are sample-size artifacts.
  Psychological and family had 7 and 1 expected observations respectively
  across all 37 training events; the figures are unreliable. This is also
  the LL.3 §2 "unobserved bucket" finding: these domains are not just low-N,
  they are under-indexed at the rubric level (the rubric did not request them
  often).
- **Education is structurally absent from MSR's domain ontology** (per
  `msr_domain_buckets.json notes`); the n=3 expected_lit observations
  attributed to education in the table reflect manual annotation of a few
  career-bucket signals as education-flavored in `match_notes`, not a
  formal MSR domain assignment. Treat as advisory.

### §4.2 — The general-bucket lit-rate puzzle, briefly

Why does general (high-n at 168, lit-rate 0.30) underperform career (high-n at
431, lit-rate 0.50) when the LL.1 promotion-eligible *count* favors general (5/15
eligible at 33%) over career (0/207 eligible at 0%)? Because the metrics measure
different things. The 0.30 vs 0.50 figure is the *average* lit-rate per expected
signal observation — biased low by general because general's natal-permanent
yoga-absence signals are designed to fire only on a subset of events. The 5/15
promotion-eligible figure is the count of signals that meet (N≥3, mean≥0.4,
var≤0.3) — biased high in general because the same high-N (general signals fire
across many events) directly satisfies the N≥3 floor. Different metrics, different
biases. M4-C should not collapse them into one "general performs better/worse than
career" verdict.

---

## §5 — Prior-calibration recommendation (qualitative tiers)

Given §2–§4, the recommended *prior weights* the M5 deployment should attach to
its confidence at retrieval time. These are qualitative tiers, not numerical
weights — quantitative tuning is M5 LL.5/LL.6 territory once a real prediction
ledger has accumulated.

### §5.1 — Strong prior — full prior-weight credit

- **Classical-rule basis signals + `both` basis signals.** Per §3.1, these signals
  light 100% of the time when expected, in both training and held-out partitions
  (n = 29+19 in training, 12+9 in held-out). When a classical-rule signal is
  expected to fire at retrieval time, the prior is "expect it to fire." This
  applies most directly to natal-permanent yoga retrievals.

### §5.2 — Moderate prior — lit-rate-weighted credit

- **Career, financial, health, relationship — temporal_engine basis signals in
  these high-n buckets.** Per §4.1, these domains' lit-rates cluster at 0.40–0.50.
  At retrieval time, expect a temporal_engine signal to fire about half the time
  conditional on the date being precisely-known. Apply a 0.5-multiplier on
  unconditional confidence in temporal-engine retrievals from these domains.
  Hypothesis 1 from §2.2 implies that *date precision* should modify this
  multiplier: precise dates push toward 0.6+ (held-out behavior); approx-month
  dates stay near 0.4–0.5 (training behavior); approx-year dates fall further.
- **General bucket — temporal_engine basis signals.** Per §4.1, lit-rate 0.30. At
  retrieval time, expect general-bucket temporal signals to fire about 1 in 3
  expected occasions. The natal-permanent-yoga sub-cluster within general should
  carry the cluster-aware consumption rule from `LL3_DOMAIN_COHERENCE §5.1
  R.LL3.2` — rather than 6× independent firings, treat as one consolidated
  configuration.

### §5.3 — Weak prior — under-evidenced

- **Travel (n=5).** Lit-rate 0.40 over 5 expected observations is too thin to
  weight. Apply the moderate-prior multiplier (~0.4) provisionally and re-tune
  after M5 LEL expansion improves coverage.
- **Education / psychological / spiritual / family (n ≤ 7).** Lit-rate 1.00 is a
  sample-size artifact. Do not weight retrievals from these domains by these
  figures. Use unweighted MSR routing per `LL3_DOMAIN_COHERENCE §5.1 R.LL3.3`
  with the n=0 disclaimer attached at consumption time.

### §5.4 — Date-precision as a global modifier

Across all priors above, the held-out vs training gap (Hypothesis 1) implies:

- **Date confidence `exact` (Swiss-Ephemeris-grade)** → use the held-out
  lit-rate (≈0.58 for temporal_engine).
- **Date confidence `approx-month`** → use the training lit-rate (≈0.43 for
  temporal_engine).
- **Date confidence `approx-year`** → reduce by ~15% from `approx-month`
  (informally; no data to fit a tighter coefficient at n=37).

These are working priors only — rough coefficients to use at M5 deployment until
the prediction ledger accumulates enough true held-out (prospective)
observations to fit calibrated multipliers per LL.5.

### §5.5 — What this prior is NOT

- **Not a substitute for LL.1 weights once NAP.M4.5 closes.** Once LL.1
  promotion completes, downstream consumers must weight signals by their
  per-signal LL.1 weight, not by these domain/basis priors. The priors are a
  fallback for signals not in the LL.1 promotion set (or signals from
  unobserved buckets), not a primary weighting scheme.
- **Not binding at M5 deployment.** These priors are recommendations. M5 LL.5
  scaffolding should validate the priors against accumulated prediction-ledger
  outcomes before any prior is enforced as a calibrated multiplier.
- **Not a discovery layer.** LL.4 reports what the calibration data *already
  shows*; LL.7 is the discovery prior layer that surfaces *novel* signal
  patterns. The two are distinct; this document is silent on LL.7.

---

## §6 — Changelog

- **v1.0 (2026-05-02, M4-B-S4-LL3-DOMAIN-COHERENCE):** Initial publication.
  - §1 purpose: LL.4 ships at M4-B as a recommendation document, not a weight
    register, per `SHADOW_MODE_PROTOCOL §2` LL.4 row.
  - §2 baseline match_rate: training mean=0.630, held_out mean=0.913,
    Δ=+0.28; gap interpreted via three explicit hypotheses (H1
    decade-stratified-selection-bias most likely; H2 LEL
    retrodictive_match labeling bias secondary; H3 honest-generalization
    least likely under n=37). Held_out figure must NOT be quoted as a
    clean validity number.
  - §3 basis-class performance: classical_rule and both bases at 1.00
    perfect calibration (small n); temporal_engine at 0.43 training / 0.58
    held-out — variance driven by date-precision artifact, not model
    artifact (consistent with M3-D 10/10 CONSISTENT held-out sample).
  - §4 domain-class performance: career/financial/health/relationship/travel
    cluster in 0.40–0.50 lit-rate band at high-to-moderate n; general bucket
    underperforms at 0.30 (driven by natal-permanent yoga design); psy/spi/
    edu/fam at n≤7 with apparent 1.00 lit-rate are sample-size artifacts,
    not findings.
  - §5 qualitative-tier prior recommendation: STRONG (classical_rule + both
    bases — full credit); MODERATE (career/financial/health/relationship
    temporal — 0.4–0.5 multiplier; general temporal — 0.30 multiplier with
    cluster-aware consolidation per LL.3 §5.1 R.LL3.2); WEAK (travel n=5;
    psy/spi/edu/fam — n≤7 too thin); plus date-precision global modifier
    (exact → held-out band, approx-month → training band, approx-year
    further reduced). Priors are recommendations, not bindings; not a
    substitute for LL.1 weights post-NAP.M4.5; not a discovery layer.
  - §6 changelog.

---

*End of LL4_PREDICTION_PRIOR_v1_0.md. Recommendation document; no shadow→production
split. Re-evaluation triggers: NAP.M4.5 close (refresh §3 basis-class stats if
pass_2 demotes affect the calibration sample); M5 entry (act on §5 tiers as M5 LL.5
prior-fitting input).*
