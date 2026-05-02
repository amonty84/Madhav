---
artifact: 06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/LL5_DASHA_TRANSIT_DESIGN_v1_0.md
version: "1.0"
status: CURRENT
produced_during: M4-C-S1-LL5-DASHA-TRANSIT
produced_on: 2026-05-02
mechanism: LL.5 Dasha-Transit Synergy (per-signal axis-weight modulator)
phase: M4-C
parent_phase_plan: 00_ARCHITECTURE/PHASE_M4C_PLAN_v1_0.md §3.1 (M4-C — first M4-C session, LL.5 first shadow write)
authoritative_protocol: 06_LEARNING_LAYER/SHADOW_MODE_PROTOCOL_v1_0.md §3 (binding promotion criteria; §3.5 LL.5 row)
governing_rubric: 06_LEARNING_LAYER/OBSERVATIONS/CALIBRATION_RUBRIC_v1_0.md v1.1 (Option B; status APPROVED 2026-05-02)
related_acceptance_criteria: AC.S1.3 (M4-C-S1 brief)
purpose: >
  Specifies WHAT an LL.5 dasha-transit axis-weight is, WHICH inputs are consumed, the
  EXACT computation algorithm, the shadow-mode constraints (mirroring LL.1/LL.2
  discipline), the OUTPUT SCHEMA for ll5_dasha_transit_v1_0.json, and the KNOWN
  LIMITATIONS of axis-attribution at n=37 training events with the observed lit_source
  imbalance. Authored before any LL.5 computation runs (per AC.S1.3 hard constraint).
mechanism_naming_note: >
  This document instantiates LL.5 = "Dasha-Transit Synergy" per the M4-C-S1 brief.
  PHASE_M4C_PLAN_v1_0.md §LL.5 (authored at M4-B-P5) defines LL.5 as "Retrieval ranking
  learning" per MACRO_PLAN §LL-Appendix.B LL.5 with path `06_LEARNING_LAYER/RANKER_WEIGHTS/`.
  The brief explicitly redirects LL.5 to a different mechanism + path; per
  ONGOING_HYGIENE_POLICIES §C the brief's may_touch declaration is binding for this
  session. The mechanism-naming divergence is logged as R.LL5DESIGN.1 in §6 below for
  resolution at the next M4-C governance pass / native review (rename, renumber, or
  reassign so PHASE_M4C_PLAN, MACRO_PLAN §LL-Appendix.B, SHADOW_MODE_PROTOCOL §2/§3.5,
  and this document agree on what "LL.5" means).
---

# LL.5 DASHA-TRANSIT SYNERGY — design document

```
This document is the design spec frozen BEFORE the M4-C-S1 LL.5 shadow computation
runs. The computation that produces ll5_dasha_transit_v1_0.json (this session's
deliverable) implements §3 of this document exactly. Future axis-attribution cycles
either honor §3 verbatim or bump this document to v1.1+ before re-running.
```

---

## §1 — Mechanism definition

### §1.1 — What is an LL.5 dasha-transit axis-weight?

An **LL.5 dasha-transit axis-weight** is a numeric modulator in `[0.0, 1.0]` attached
to each MARSYS-JIS signal observed across the training partition of the Life Event
Log (LEL). The axis-weight encodes the empirical attribution share of the signal's
lit-score to **dasha activation** (the temporal dasha-window that governs the date)
versus **transit activation** (planetary transit conditions at the date) versus
**both jointly**, derived from the `lit_source` field on each `actual_lit_signal` entry
in `lel_event_match_records.json`.

The output is a single per-signal float, the **`dasha_weight`**, defined as:

```
dasha_weight = (dasha_count + 0.5 * both_count)
             ÷ (dasha_count + transit_count + both_count)
```

`dasha_weight = 1.0` means every observed activation of the signal across training
events was attributed to dasha alone. `dasha_weight = 0.0` means every observed
activation was attributed to transit alone. `dasha_weight = 0.5` means the signal's
activations split evenly between dasha and transit (or were all `both`).

### §1.2 — Why "modulator" and not "weight"?

Like LL.1 (per-signal lit-score weight) and LL.2 (per-edge co-activation weight),
LL.5 is a **modulator** that sits between observation and downstream pipeline
operation. It does **not replace** an LL.1 weight; it **annotates** that weight with
an axis attribution. Concretely, downstream consumers of LL.5 read a tuple
`(ll1_shadow_weight, ll5_dasha_weight)` and may reason "this signal's evidential
support fired primarily through the dasha engine, so date-precision sensitivity is
high" or "this signal's evidential support fired primarily through transit, so
calibration depends on the transit engine's accuracy". LL.5 carries no claim that
the underlying engine is correct; it only attributes which engine fired.

### §1.3 — Where does LL.5 live in the MARSYS-JIS pipeline?

LL.5 is a **per-signal annotation layer**. It does not introduce new signals, new
edges, or new query routes. It exposes a `dasha_weight` field on each signal that
downstream prediction code (LL.4 prior consumers, query-time signal-state
computation, calibration auditors) can read alongside the LL.1 shadow weight to
decide how heavily to penalize the signal's contribution when the dasha or transit
engine is suspect for a given date.

---

## §2 — Input specification

### §2.1 — Primary input: `lel_event_match_records.json` (training partition only)

- **Path:** `06_LEARNING_LAYER/OBSERVATIONS/lel_event_match_records.json`
- **Version at consumption:** schema_version `1.1`, rubric_version `1.0`,
  rubric_option `B`, produced_during `M4-A-INTEGRATION-PASS-R3`.
- **Filter:** records with `partition == "training"` only (37 of 46 records). The
  9 held-out records are excluded by explicit partition filter, never by record
  ordering — per the M4-C-S1 brief hard constraint and Learning Layer discipline
  rule #4 ("held-out prospective data is sacrosanct").
- **Field consumed:** `actual_lit_signals[*].lit_source` (string; one of `dasha`,
  `transit`, `both`). The corresponding `signal_id` and `lit_score` fields are
  consumed for cross-reference but axis attribution depends on `lit_source` only.
- **Field NOT consumed for attribution:** `expected_lit_signals[*].basis` (the
  classical_rule / temporal_engine / both annotation on expected signals).
  `basis` describes how the **rubric writer expected** the signal to fire (rule
  catalog category); `lit_source` describes how the signal **actually fired**
  (which engine produced the lit-state observation). LL.5 attributes actual
  firings, not expected provenance — see §6 limitation 6.2 for the implication.

### §2.2 — Secondary input: signal corpus (LL.1 shadow signal set)

- **Path:** `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/signal_weights/shadow/ll1_shadow_weights_v1_0.json`
- **Role:** declares the canonical 380 observed signals (`signal_weights` keys) so
  that LL.5 emits a row for every observed signal — including signals that appear
  only in `expected_lit_signals` (114 of 380 signals never lit; they receive
  `dasha_count = transit_count = both_count = 0` and confidence_tier `ZERO`). This
  ensures `len(LL.5 signals) == len(LL.1 signals) == 380`.
- **Read-only.** LL.5 does not modify or consume LL.1 numeric weights, only the
  signal_id roster.

### §2.3 — Tertiary input: LL.4 §3 basis-class context (informational)

- **Path:** `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/LL4_PREDICTION_PRIOR_v1_0.md`
  §3 (§3.1 + §3.2).
- **Role:** documentation. LL.4 §3 establishes that on the training partition,
  `classical_rule` and `both`-basis expected signals fire at mean lit_score 1.0
  (perfectly calibrated), while `temporal_engine` basis signals fire at mean
  lit_score 0.43 (the source of the training-partition variance). LL.5 does **not**
  consume the basis split mathematically — it consumes only `lit_source`. The
  context is preserved here so the next reader understands that the dasha/transit
  attribution observed by LL.5 is overwhelmingly an attribution within the
  `temporal_engine` basis class (since `classical_rule` and `both`-basis signals
  fire at lit_score 1.0 with `lit_source` typically `dasha` per the dasha-window
  rubric option).

### §2.4 — Held-out events (not consumed)

- The 9 held-out records (`partition == "held_out"`) — listed in
  `held_out_manifest.held_out_event_ids` — are filtered out at read time. Their
  `actual_lit_signals` and `expected_lit_signals` never enter the LL.5
  computation. This is the single most important discipline rule for this cycle.

---

## §3 — Computation algorithm

### §3.1 — Step-by-step

1. Load `lel_event_match_records.json`. Read the `records` array.
2. Filter to training partition: keep `r` iff `r["partition"] == "training"`.
   Verify `len(training_records) == data["training_count"] == 37`. If the count
   mismatches, halt and emit a kill-switch entry — the partition discipline is
   compromised.
3. Load `ll1_shadow_weights_v1_0.json`. Read the `signal_weights` dict keys as the
   canonical signal_id roster `S` (length 380). LL.5 emits one row per `signal_id`
   in `S`.
4. Initialize per-signal counters: for each `sid` in `S`, set
   `counts[sid] = {dasha: 0, transit: 0, both: 0}`.
5. For each training record `r`, for each entry `s` in `r["actual_lit_signals"]`:
   - Read `sid = s["signal_id"]` and `src = s["lit_source"]`.
   - If `sid` is not in the canonical roster `S`, skip and accumulate a
     `roster_misses` counter (sanity check; the LL.1 roster is a strict superset).
   - If `src == "dasha"`: `counts[sid].dasha += 1`.
   - Else if `src == "transit"`: `counts[sid].transit += 1`.
   - Else if `src == "both"`: `counts[sid].both += 1`.
   - Else: skip and accumulate `unknown_source` counter (sanity check; expected
     to remain 0; the rubric §2 enumerates only `dasha | transit | both`).
6. For each `sid` in `S`, compute:
   - `total_activations = dasha_count + transit_count + both_count`.
   - `dasha_weight = (dasha_count + 0.5 * both_count) / total_activations`
     when `total_activations > 0`; else `dasha_weight = null`.
   - **`confidence_tier`** by `total_activations` thresholds:
     - `HIGH` if `total_activations >= 8`;
     - `MED` if `4 <= total_activations <= 7`;
     - `LOW` if `1 <= total_activations <= 3`;
     - `ZERO` if `total_activations == 0`.
7. For each `sid` in `S`, emit the LL.5 row per §5 schema with `status: "shadow"`.
8. Aggregate the summary block: total_signals, per-tier counts, plus three
   distribution-shape counts:
   - `dasha_dominant_count = |{sid : dasha_weight > 0.6}|`
   - `transit_dominant_count = |{sid : dasha_weight < 0.4}|`
   - `balanced_count = |{sid : 0.4 <= dasha_weight <= 0.6}|`
   These three counts together cover only the signals with `total_activations > 0`
   (signals with `dasha_weight = null` are excluded from the dominant/balanced
   buckets — they are entirely in `zero_tier_count`).
9. Sort the signals array deterministically: ascending by `signal_id`.
10. Write the output to `signal_weights/shadow/ll5_dasha_transit_v1_0.json`.
11. Verify `json.load()` parse-clean as the post-write check (AC.S1.7).

### §3.2 — Determinism and reproducibility

The algorithm is fully deterministic given a fixed input file. There is no
randomization, no stochastic sampling, and no learned parameter — every count is
an explicit pass over the training records, and the only floating-point arithmetic
is a single division per signal with the `0.5 * both_count` term. Re-running the
computation against the same `lel_event_match_records.json` yields a byte-identical
output (modulo Python `json.dump` key-ordering, which we control via deterministic
signal-id sort in step 9).

### §3.3 — `lit_source = "both"` split rule (rubric §2.2 analogue)

When `lit_source == "both"`, the rubric authors meant: "the rubric scoring code
saw both a dasha-window match AND a transit match for this signal at this event,
and the rubric's combined-aggregator function (§2.2 of CALIBRATION_RUBRIC) returned
a lit-state with `score == 0.5` per the both-source split convention." LL.5
honors this convention by splitting the `both` count 0.5/0.5 across the dasha and
transit axes inside the `dasha_weight` formula (`+ 0.5 * both_count` in the
numerator; full `+ both_count` in the denominator). This is **approximate**: a
true split would require revisiting the rubric's combined-aggregator implementation
to extract the per-axis lit-score components from the joint score, which is not
feasible at n=37 without bumping the rubric to v1.1+. The 0.5/0.5 split is the
fixed-point rule for this cycle and is documented in §6 limitation 6.3 as
`R.LL5DESIGN.2`.

### §3.4 — What this cycle does NOT compute

- **Per-signal axis-weight uncertainty.** The output emits a point estimate
  `dasha_weight` per signal. No standard error or bootstrap CI is computed at
  n=37 with the observed lit_source distribution skew (410 dasha / 4 transit / 6
  both). Confidence is encoded structurally via `confidence_tier`, not numerically.
- **Cross-domain axis-attribution.** LL.5 is per-signal, not per-pair. The
  question "do dasha-dominant signals tend to co-fire with transit-dominant
  signals?" requires reading LL.5 alongside LL.2 — an M4-C downstream consumer
  task, not this cycle.
- **Promotion candidacy.** Every LL.5 row ships `status: "shadow"`. Promotion to
  any production register is not in scope for M4-C-S1 — see §4.

---

## §4 — Shadow-mode constraints

LL.5 shadow writes inherit LL.1/LL.2 shadow-mode discipline from
`SHADOW_MODE_PROTOCOL_v1_0.md` per `§3.5` (the LL.2/LL.5/LL.6 row). This M4-C-S1
cycle observes:

- **Path discipline.** The shadow file lands at
  `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/signal_weights/shadow/ll5_dasha_transit_v1_0.json`.
  The `signal_weights/production/` subdirectory is in `must_not_touch` for this
  session per the M4-C-S1 brief; no production file is created or modified.

  *Note on path:* the brief and this design place LL.5 in `signal_weights/`
  (alongside LL.1 and LL.2) rather than `RANKER_WEIGHTS/` (the path declared in
  `SHADOW_MODE_PROTOCOL §2` for the protocol's notion of LL.5 = Retrieval
  ranking learning). The mechanism-naming asymmetry is logged as R.LL5DESIGN.1
  in §6; the path follows the brief's may_touch declaration per
  `ONGOING_HYGIENE_POLICIES §C` scope-boundary rule.
- **Two-pass approval.** This session is Claude scaffolding (pass_1). Pass_2 =
  Gemini red-team falls due at the next IS.8(a) cadence
  (red_team_counter 0 → 1 at this session's close; next IS.8(a) at counter=3).
  Per LL1_TWO_PASS_APPROVAL §5.5 carry-forward R.LL1TPA.1, Gemini reachability
  remains NOT_REACHABLE as of this session — Claude-surrogate flag continues to
  apply when pass_1/pass_2 binding is invoked downstream.
- **Native notification.** Native notification happens via the SESSION_LOG entry
  for M4-C-S1-LL5-DASHA-TRANSIT appended at session close, citing this shadow
  file by path and signal count. Absence of explicit hold = consent per
  `SHADOW_MODE_PROTOCOL §3.1(d)`.
- **n=1 disclaimer.** The shadow file's header carries the verbatim disclaimer
  from `SHADOW_MODE_PROTOCOL §7`, with LL.5-specific adaptation (added language
  naming "axis-weights" not "signal weights"). The disclaimer is non-removable.
- **Held-out events sacrosanct.** The 9 held-out LEL events are excluded by
  partition filter at §3.1 step 2; their `actual_lit_signals` never enter the
  axis-attribution computation. Verified by explicit filter
  (`r["partition"] == "training"`), not by record ordering.
- **Kill-switch §4 conditions.** None active at session open. If any kill-switch
  fires mid-session, the shadow file is not committed and the kill-switch state
  is recorded in SESSION_LOG.
- **Promotion blocked.** Every LL.5 row ships with `status: "shadow"` and no
  production weight. Per-signal promotion candidacy evaluation is out of M4-C-S1
  scope (separate downstream cycle, gated on at minimum LL.1 + LL.2 stability
  alongside LL.5's own promotion criteria still TBD by SHADOW_MODE_PROTOCOL).

---

## §5 — Output schema (`ll5_dasha_transit_v1_0.json`)

```json
{
  "schema_version": "1.0",
  "mechanism": "LL.5",
  "phase": "M4-C",
  "produced_during": "M4-C-S1-LL5-DASHA-TRANSIT",
  "produced_on": "2026-05-02",
  "design_doc_version": "1.0",
  "design_doc_path": "06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/LL5_DASHA_TRANSIT_DESIGN_v1_0.md",
  "rubric_version": "1.0",
  "rubric_option": "B",
  "input_files": [
    {"path": "06_LEARNING_LAYER/OBSERVATIONS/lel_event_match_records.json", "role": "primary"},
    {"path": "06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/signal_weights/shadow/ll1_shadow_weights_v1_0.json", "role": "signal_roster"}
  ],
  "training_events_used": 37,
  "held_out_excluded": 9,
  "promotion_criteria_ref": "06_LEARNING_LAYER/SHADOW_MODE_PROTOCOL_v1_0.md §3.5 (LL.5 promotion criteria — TBD; this cycle ships shadow-only)",
  "n1_disclaimer": "VALIDITY NOTICE: These axis-weights are derived from a single native's (n=1) life event corpus. They are provisional, subject to revision as the corpus grows, and must not be interpreted as universal Jyotish dasha-vs-transit attribution rates. Per MACRO_PLAN §3.5.A Principle 1 — n=1 validity disclaimer. Promotion does NOT lift this disclaimer; it lifts only the structural barrier between observation and downstream pipeline operation. LL.5-specific note: the lit_source distribution at n=37 is heavily skewed toward dasha attribution (410 dasha / 4 transit / 6 both across all observed activations); per-signal axis attributions in the LOW confidence tier (1–3 activations) are particularly unstable and must be read alongside the confidence_tier field, not as standalone calibrated rates.",
  "variance_estimator": "sample",
  "summary": {
    "total_signals": 380,
    "high_tier_count": <int>,
    "med_tier_count": <int>,
    "low_tier_count": <int>,
    "zero_tier_count": <int>,
    "dasha_dominant_count": <int>,
    "transit_dominant_count": <int>,
    "balanced_count": <int>,
    "dominant_definition": "dasha_dominant: dasha_weight > 0.6 | transit_dominant: dasha_weight < 0.4 | balanced: 0.4 <= dasha_weight <= 0.6 (signals with total_activations == 0 are in zero_tier_count and excluded from dominant/balanced buckets)"
  },
  "signals": [
    {
      "signal_id": "<sid>",
      "dasha_count": <int>,
      "transit_count": <int>,
      "both_count": <int>,
      "total_activations": <int>,
      "dasha_weight": <float | null>,
      "confidence_tier": "HIGH | MED | LOW | ZERO",
      "status": "shadow"
    }
  ]
}
```

**Schema notes.**

- The `signals` array contains one row per signal_id in the LL.1 canonical roster
  (length 380), sorted ascending by `signal_id` per §3.1 step 9.
- `dasha_weight` is `null` (JSON null) when `total_activations == 0` (i.e.
  `confidence_tier == "ZERO"`). The dominant/balanced summary buckets exclude
  these rows.
- All numeric values use float (Python `json.dump` default precision); 4 decimal
  places of meaningful precision are sufficient for an n=37 corpus.
- `variance_estimator: "sample"` — declared at outer level for parity with the
  LL.1 v1.1 metadata pattern (added at M4-B-S5 to close F.RT.S4.1). LL.5 does not
  emit per-signal variance in this cycle (see §3.4); the field is preserved for
  future cycles that may.

---

## §6 — Known limitations

### §6.1 — n=37 with extreme lit_source skew

The training-partition lit_source distribution is `dasha = 410`, `transit = 4`,
`both = 6` (across all 420 actual_lit_signals activations). At this skew, almost
every signal that fires at all has `dasha_weight = 1.0` from a single dasha
attribution. The 1 transit-only signal (SIG.13, 4 transit / 0 dasha) and the 6
balanced-via-`both` signals are the only deviations from `dasha_weight = 1.0` on
the entire training partition. This is consistent with the rubric_option B
choice (which prioritizes dasha-window attribution when both engines could
explain a signal), and consistent with LL.4 §3 finding that `temporal_engine`
basis signals are the variance-driver. It is **not** a finding about Jyotish
ontology — it is a finding about how the rubric assigned `lit_source` at n=37.

### §6.2 — `lit_source` quality depends on rubric scoring fidelity

`lit_source` is assigned by the rubric scoring code at the time
`lel_event_match_records.json` is produced. If the rubric mis-classifies a
joint-fire as dasha-only or transit-only, LL.5 inherits that mis-classification.
LL.5 has no independent oracle to detect rubric scoring drift; the only check
available is consistency over multiple rubric versions, which is also out of
M4-C-S1 scope. This limitation is **inherent** to the L1/L2 boundary discipline:
LL.5 reads the rubric's output, not the rubric's input, by design.

### §6.3 — `lit_source = "both"` split is approximate (R.LL5DESIGN.2)

The 0.5/0.5 split applied to `both` activations in the `dasha_weight` formula is
a **fixed-point rule** (§3.3), not an empirically-derived split. A true split
would require the combined-aggregator function in CALIBRATION_RUBRIC v1.1 §2.2
to emit per-axis sub-scores; at n=37 with only 6 `both` observations, the
empirical signal for any other split is too small to move the result. The
0.5/0.5 split is documented as **R.LL5DESIGN.2** for resolution at the next
LL.5 cycle when the rubric is at v1.2+ with per-axis sub-score emission, OR
when the corpus grows to n≥100 events and the empirical signal could
discriminate alternatives.

### §6.4 — 252 LOW-tier signals (1–3 activations) are unstable

The confidence_tier distribution at this cycle is `HIGH = 2`, `MED = 12`,
`LOW = 252`, `ZERO = 114` (total 380; see §3 for tier rules). The 252 LOW-tier
signals each contribute one to three observations to the axis attribution; a
single rubric mis-classification can swing the per-signal `dasha_weight` from
1.0 to 0.5 to 0.0. Downstream consumers MUST gate on `confidence_tier` and treat
LOW-tier `dasha_weight` values as observations, not as established attribution
rates.

### §6.5 — Mechanism-naming divergence (R.LL5DESIGN.1)

`PHASE_M4C_PLAN_v1_0.md §LL.5` (authored at M4-B-P5) defines LL.5 as "Retrieval
ranking learning" with shadow path `06_LEARNING_LAYER/RANKER_WEIGHTS/shadow/`
per `MACRO_PLAN §LL-Appendix.B LL.5`. The M4-C-S1 brief redirects LL.5 to
"Dasha-Transit Synergy" with shadow path
`06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/signal_weights/shadow/`.

This is a **substantive divergence**, not a path-only asymmetry. The brief is
binding for this session per `ONGOING_HYGIENE_POLICIES §C`; the divergence is
logged here as **R.LL5DESIGN.1** for resolution at the next M4-C governance pass
or native review. Possible resolutions include:

- Rename this artifact's mechanism to LL.5b (or LL.5-DT, etc.) and reserve LL.5
  for the retrieval-ranking work originally planned.
- Renumber the retrieval-ranking work (e.g. to LL.5R or LL.8) and adopt
  Dasha-Transit Synergy as the canonical LL.5.
- Treat this artifact as a stand-alone mechanism (e.g. LL.DT) outside the
  LL.5/LL.6/LL.7 sequence and update PHASE_M4C_PLAN + SHADOW_MODE_PROTOCOL
  accordingly.

The native is the arbitrator; until then, the artifact ships under its brief-
declared name with this divergence flagged in-document and in SESSION_LOG.

### §6.6 — Single-pass design (no LL.5-specific stability gate)

Unlike LL.2 (which has `LL2_STABILITY_GATE_v1_0.md` as a separate go/no-go
artifact), LL.5 ships without a dedicated stability-gate document at this cycle.
The shadow-mode discipline + n=1 disclaimer + confidence_tier gating are the
structural defenses. A future cycle may author `LL5_STABILITY_GATE_v1_0.md` if
LL.5 promotion criteria become defined in `SHADOW_MODE_PROTOCOL §3.5`.

---

## §7 — Changelog

- **v1.0** (2026-05-02, M4-C-S1-LL5-DASHA-TRANSIT): initial publication. Authored
  before any LL.5 computation runs (per AC.S1.3 hard constraint). §1 mechanism
  definition + §2 input spec + §3 algorithm + §4 shadow-mode constraints + §5
  output schema + §6 known limitations (5 items + R.LL5DESIGN.1 mechanism-naming
  divergence + R.LL5DESIGN.2 both-split approximation) + §7 changelog. The §3
  algorithm produces `ll5_dasha_transit_v1_0.json` exactly; future cycles either
  honor §3 verbatim or bump to v1.1+ before re-running.
