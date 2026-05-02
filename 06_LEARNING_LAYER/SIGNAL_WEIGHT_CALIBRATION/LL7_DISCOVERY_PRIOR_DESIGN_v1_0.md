---
artifact: 06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/LL7_DISCOVERY_PRIOR_DESIGN_v1_0.md
canonical_id: LL7_DISCOVERY_PRIOR_DESIGN
version: "1.0"
status: SHADOW
mechanism: LL.7
mechanism_label: "Discovery Prior Rubric (native-only mode)"
phase: M4-C
sub_phase: M4-C-S3
authored_by: M4-C-S3-LL7-DISCOVERY-PRIOR
authored_on: 2026-05-02
parent_plan: 00_ARCHITECTURE/PHASE_M4C_PLAN_v1_0.md §3.3 + §6.1
authoritative_spec: 00_ARCHITECTURE/MACRO_PLAN_v2_0.md §LL-Appendix.B LL.7 + §3.5.A Principle 1
governing_nap: 00_ARCHITECTURE/EVAL/NAP_M4_6_BRIEF_v1_0.md (path is v1_0; in-file version 1.2 after this session — see §4 + §8)
nap_verdict: "Option B — Classical-seeded"
nap_refinements:
  - "Rename support class classical_only → unconfirmed"
  - "Lower discovery threshold N≥5 → N≥3"
  - "8 MED-tier LL.2 anchor pairs are the verification anchor at S3 first write"
session_decisions_received_2026_05_02:
  decision_1_R_LL5DESIGN_1: "Option A approved — LL.5 mechanism name = 'Dasha-Transit axis-weight modulator' (what was built); MACRO_PLAN/PHASE_M4C_PLAN/SHADOW_MODE_PROTOCOL naming-update propagation deferred to S4. Out-of-scope here."
  decision_2_cdlm_construction: "Option (1) approved — literal msr_anchors-clique construction. Empirical consequence (see §4): all 8 MED-tier LL.2 anchor pairs classify as NOVEL (not confirmed) under literal construction, because none of the 6 anchor signals (MSR.117/118/119/143/145/402) form a co-anchored pair within any single CDLM cell."
inputs:
  - 025_HOLISTIC_SYNTHESIS/CDLM_v1_1.md (81 cells; msr_anchors per cell — literal clique construction)
  - 06_LEARNING_LAYER/OBSERVATIONS/lel_event_match_records.json (37 training events; held_out 9 sacrosanct)
  - 06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/signal_weights/shadow/ll1_shadow_weights_v1_0.json (380-signal roster)
  - 06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/signal_weights/shadow/ll2_edge_weights_v1_0.json (8 MED-tier anchors)
  - 06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/signal_weights/shadow/ll6_temporal_density_v1_0.json (per-event density_weight)
  - 06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/LL3_DOMAIN_COHERENCE_v1_0.md §4.1 (8 MED-tier table — ground truth for sanity-check)
  - 06_LEARNING_LAYER/SHADOW_MODE_PROTOCOL_v1_0.md §3 (NAP.M4.4 promotion criteria; LL.7 native-only mode has no shadow→prod split, native sign-off remains the gate)
mirror_obligations: claude-only (LL.7 first-write artifact has no Gemini-side mirror at M4-C)
related_artifacts:
  - LL5_DASHA_TRANSIT_DESIGN_v1_0.md (sibling — M4-C-S1)
  - LL6_TEMPORAL_DENSITY_DESIGN_v1_0.md (sibling — M4-C-S2; supplies density_weight)
  - LL3_DOMAIN_COHERENCE_v1_0.md (LL.2 edge-coherence spot-check — anchor source)
  - LL4_PREDICTION_PRIOR_v1_0.md (basis-tier finding informs §1 mechanism choice)
shadow_status: SHADOW
promotion_status: shadow
kill_switch_state: clear
---

# LL.7 — Discovery Prior Rubric (native-only mode) — Design v1.0

## §1 — Mechanism

LL.7 is the **discovery layer** of the Learning Layer. Whereas LL.1 calibrates per-signal weights, LL.2 calibrates pairwise edge co-activations as edge weights, and LL.5/LL.6 modulate retrieval ranking, LL.7 surfaces **signal-pair / signal-cluster relationships** that the existing classical knowledge surfaces (MSR + CDLM) do not already articulate, *or* that the empirical record confirms / contradicts against the classical map.

Per `MACRO_PLAN §LL-Appendix.B LL.7`, LL.7 has two activation modes:

- **(a) native-only mode** — priors shaped by a single chart's outcome record. Active from M4 (this design).
- **(b) cohort mode** — priors shaped by cohort signal co-occurrence. Active from M7+ (out of scope here).

This design covers native-only mode only. Per NAP.M4.6 verdict received 2026-05-02 (decision_session: M4-B-P5-M4C-ENTRY-PREP), LL.7 implements **Option B — Classical-seeded** with three native refinements:

1. Support class `classical_only` is renamed `unconfirmed`.
2. Empirical-confirmation threshold lowered N≥5 → N≥3.
3. The 8 MED-tier LL.2 anchor pairs serve as the verification anchor at first write.

**Construction decision (DECISION-2, 2026-05-02).** The CDLM edge set is constructed by **literal msr_anchors-clique union**: for each CDLM cell, all unordered pairs `{(sig_a, sig_b) : sig_a ≠ sig_b, both ∈ cell.msr_anchors}` are emitted as edges; the union across all 81 cells is the CDLM edge set. This is the literal reading of "CDLM edge" — a pair of signals co-anchored within at least one cell. The alternative (treating CDLM cells themselves as edges and surfacing all signal pairs across cells transitively) was considered and rejected by native — it would have over-claimed CDLM coverage.

**Threshold.** **N≥3 raw events** per NAP.M4.6 §6.3(b) verbatim: a pair `(sig_a, sig_b)` is empirically supported when it co-fired in ≥3 distinct training events. The LL.6 per-event density_weight (Temporal Density Modulator, M4-C-S2) is computed and **reported alongside** as an informational refinement (`empirical_density_weighted_count`) — it is **not** the gate. This choice is principled on two grounds:

1. **NAP verbatim.** §6.3(b) says "implements N≥3 as the default empirical-confirmation threshold" — no "density-weighted" qualifier. Lifting density-weighting from informational to gate-defining would exceed the authority of the NAP verdict.
2. **LL.6 design intent.** LL.6 §6 H2 dense-cluster-inflation test was **rejected** as load-bearing (`h2_finding`: density adjustment "does NOT trigger LL.1 weight revision per shadow-mode discipline"). Gating LL.7 on density-weighted thresholds would re-elevate an LL.6-rejected mechanism to a gate role, contradicting LL.6 design intent and shadow-mode discipline.

**Effect at first write.** Under raw N≥3, all 8 MED-tier LL.2 anchor pairs (raw counts 4–7 per LL3 §4.1) clear the threshold. Density-weighted counts are reported per pair so future calibration sessions can study the density-vs-raw sensitivity (see §7 limitation 3).

**Calibration note recorded at first write (2026-05-02).** A purely density-weighted gate at N≥3.0 was considered during the M4-C-S3 algorithm authoring and rejected after the failure mode emerged in execution: pair MSR.118 ↔ MSR.145 had density-weighted count 2.9485 (just below 3.0) despite raw N=5, because the 5 events in which both fired carried density_weights well below 1.0 (multiple events in the 2007 cluster). Under that gate, sanity_anchor_novel_count would have been 7, not 8, and the gate would have failed by design — not because the algorithm was wrong but because the threshold-mechanism choice exceeded NAP authority. Switching the gate to raw N≥3 (with density-weighted reported alongside) is the correction.

**Four-class taxonomy.**

| Support class | Meaning | CDLM-declared | Empirical (density-weighted N≥3) |
|---|---|---|---|
| `confirmed` | CDLM edge with empirical co-firings ≥ 3.0 in 37-event training partition | true | true |
| `contradicted` | CDLM edge with empirical co-firings in conflict with classical direction (e.g., domain mismatch flagged in LL3 §3.2) | true | true (with conflict flag) |
| `unconfirmed` | CDLM edge with no empirical support in training partition | true | false |
| `novel` | Empirical pattern (≥3.0) absent from CDLM edge set | false | true |

(Pairs that are neither CDLM-declared nor empirically supported are noise and excluded from output. See §6 output schema.)

**Status of the mechanism.** SHADOW. LL.7 native-only mode has no shadow→production split per SHADOW_MODE_PROTOCOL §2 LL.7 row — native sign-off remains the gate. The `shadow_status` field on the JSON marks the artifact as not-yet-promoted; promotion is an explicit native action recorded in a future session_log entry.

---

## §2 — Input spec

| Input | Path | Role |
|---|---|---|
| CDLM | `025_HOLISTIC_SYNTHESIS/CDLM_v1_1.md` | Classical prior — 81 cells; `msr_anchors` per cell; literal clique construction (see §3 Step A) |
| LEL event-match records | `06_LEARNING_LAYER/OBSERVATIONS/lel_event_match_records.json` | 37 training events (held_out 9 EXCLUDED — sacrosanct per learning discipline rule #4) |
| LL.1 shadow weights | `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/signal_weights/shadow/ll1_shadow_weights_v1_0.json` | 380-signal roster (signal_id space) |
| LL.2 edge weights | `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/signal_weights/shadow/ll2_edge_weights_v1_0.json` | 8 MED-tier anchor pairs — sanity-check ground truth |
| LL.6 density weights | `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/signal_weights/shadow/ll6_temporal_density_v1_0.json` | Per-event `density_weight` for the 37 training events |
| LL3 §4.1 | `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/LL3_DOMAIN_COHERENCE_v1_0.md` | Independent ground truth for the 8 MED-tier anchor pair list |
| SHADOW_MODE_PROTOCOL §3 | `06_LEARNING_LAYER/SHADOW_MODE_PROTOCOL_v1_0.md` | Promotion criteria (LL.7 native-only: no shadow→prod split) |

**Held-out partition.** Per LL.6 design §4 and LL.4 design §3.4, the 9 held-out events are **never** consumed at LL.7 compute time. The discovery prior is a function of the 37-event training partition only. Held-out events remain sacrosanct for forward calibration testing.

---

## §3 — Algorithm

### Step A — Build CDLM edge set (literal msr_anchors-clique union)

```
cdlm_edge_set = ∅
for cell in CDLM.cells (81 cells):
    anchors = cell.msr_anchors    # e.g., [MSR.390, MSR.413, MSR.339, MSR.349]
    for (sig_a, sig_b) in unordered_pairs(anchors):
        cdlm_edge_set.add(canonical_pair(sig_a, sig_b))   # canonical_pair = sorted tuple
```

`canonical_pair` normalizes the SIG.MSR.NNN ↔ MSR.NNN form mismatch between LEL/LL.1/LL.2 (which use `SIG.MSR.NNN`) and CDLM (which uses `MSR.NNN`). Both sides are reduced to `MSR.NNN` for set comparison.

**Expected cardinality.** Sparse — most CDLM cells anchor 2–4 signals (yielding 1–6 pairs per cell); the 81-cell union has substantial overlap, so the unique pair count is small (computed at execution; documented in §6 output `cdlm_edge_count`).

### Step B — Compute density-weighted pair co-activations across training events

```
for event in records (training partition only — partition == "training"):
    density_weight = LL.6.events[event_id].density_weight
    lit_signals = { sig.signal_id for sig in event.actual_lit_signals if sig.lit_score > 0 }
    # canonicalize to MSR.NNN
    lit_signals_canon = { strip_prefix(sig, "SIG.") for sig in lit_signals }
    for (sig_a, sig_b) in unordered_pairs(lit_signals_canon):
        pair = canonical_pair(sig_a, sig_b)
        empirical_pair_weight[pair] += density_weight  # sum of per-event density_weights
        empirical_pair_raw_count[pair] += 1            # raw count (informational)
```

`empirical_pair_weight[pair]` is the density-adjusted co-activation count; thresholding uses this, not the raw count.

### Step C — Classify pairs against CDLM edge set + threshold

```
for pair in (cdlm_edge_set ∪ empirical_pair_raw_count.keys):
    is_cdlm = pair in cdlm_edge_set
    raw_count = empirical_pair_raw_count.get(pair, 0)
    weight    = empirical_pair_weight.get(pair, 0.0)   # informational
    is_empirical = (raw_count >= 3)        # raw N≥3 per NAP §6.3(b) verbatim
    if is_cdlm and is_empirical:
        support = "confirmed"
    elif is_cdlm and not is_empirical:
        support = "unconfirmed"
    elif (not is_cdlm) and is_empirical:
        support = "novel"
    else:
        support = "noise"  # excluded from output
```

`contradicted` is a structural sub-class of `confirmed` reserved for cells where the LL3 §3.2 cross-domain mismatch flag is true. LL3 §3.2 found 0 mismatch flags structurally in this corpus, so `contradicted_count` is expected to be 0 at first write. Future LL.7 revisions may re-classify confirmed pairs into contradicted as new mismatch flags emerge.

### Step D — Emit output

Write `signal_weights/shadow/ll7_discovery_prior_v1_0.json` per §6 schema. Outer metadata records the construction decision verbatim (`cdlm_construction: "literal_msr_anchors_clique"`, `nap_decision: "Option_B_approved_literal_clique"`). Edges array carries one entry per non-noise pair. Summary block records counts per class.

### Step E — Sanity-check gate

After writing, re-read and verify `sanity_anchor_novel_count == 8` (REVISED from original brief — was `sanity_anchor_confirmed_count == 8`; see §4 below for the empirical reason). Each of the 8 MED-tier LL.2 anchor pairs MUST be present in the output's `novel` class with `cdlm_declared: false`. If `sanity_anchor_novel_count != 8`, HALT and report which anchors are absent or misclassified.

---

## §4 — Sanity-check (REVISED per DECISION-2 2026-05-02)

### §4.1 — The 8 MED-tier LL.2 anchor pairs (ground truth from LL3 §4.1)

| # | Pair | Co-firing count (LL.2 raw) | Tier |
|---|---|---|---|
| 1 | MSR.145 ↔ MSR.402 | 7 | MED |
| 2 | MSR.118 ↔ MSR.145 | 5 | MED |
| 3 | MSR.119 ↔ MSR.402 | 5 | MED |
| 4 | MSR.143 ↔ MSR.145 | 5 | MED |
| 5 | MSR.143 ↔ MSR.402 | 5 | MED |
| 6 | MSR.117 ↔ MSR.119 | 4 | MED |
| 7 | MSR.117 ↔ MSR.402 | 4 | MED |
| 8 | MSR.119 ↔ MSR.145 | 4 | MED |

These 8 pairs span 6 anchor signals: **MSR.117 / .118 / .119 / .143 / .145 / .402** — the Pancha-Mahapurusha yoga presence/absence cluster (per LL3 §3 + §4 finding). All 8 pairs are intra-`general` domain.

### §4.2 — Sanity-check classification under literal CDLM construction

Under DECISION-2's literal msr_anchors-clique construction, the empirical CDLM co-anchoring evidence for the 6 anchor signals is:

| Anchor signal | Number of CDLM cells in which it appears as msr_anchor |
|---|---|
| MSR.117 | 0 |
| MSR.118 | 0 |
| MSR.119 | 0 |
| MSR.143 | 0 |
| MSR.145 | 0 |
| MSR.402 | 4 (cells `CDLM.D4.D4`, `CDLM.D4.D6`, `CDLM.D6.D4`, `CDLM.D6.D6`) |

MSR.402 is the only anchor signal among the six that appears in any CDLM cell. The other 5 are absent from CDLM entirely (verified at compute time by parsing `025_HOLISTIC_SYNTHESIS/CDLM_v1_1.md` and scanning all 81 cells' `msr_anchors` lists). Co-anchors of MSR.402 across the four cells are drawn from the set {MSR.297, MSR.333, MSR.347, MSR.397, MSR.407, MSR.408}; none are in the {117, 118, 119, 143, 145} set, so MSR.402 is never co-anchored with any of the other Pancha-MP cluster members within a single CDLM cell.

**Consequence.** Under literal construction, **none of the 8 MED-tier pairs is in `cdlm_edge_set`**. Therefore — assuming each pair meets the density-weighted N≥3 threshold (which they should, given LL.2 raw counts of 4–7 for the 37-event training partition) — all 8 pairs classify as **`novel`**, not `confirmed`.

This is the **revised sanity-check gate**: `sanity_anchor_novel_count` MUST equal 8.

### §4.3 — Correction note: NAP.M4.6 §6.2 native-rationale claim

NAP.M4.6 §6.2 stated (verbatim native rationale 2026-05-02):

> The 8 MED-tier edges LL.2 already found are all confirmed CDLM edges — this option would have found them too.

**This claim is empirically incorrect under the literal msr_anchors-clique construction approved by native DECISION-2 (2026-05-02).** The Pancha-MP cluster signals (MSR.117/.118/.119/.143/.145) are absent from CDLM as msr_anchors; MSR.402 is present in 4 cells but never co-anchored with any of the other five. The intuition behind §6.2 ("Pancha-MP yogas govern multiple domains; therefore CDLM should declare them as cross-domain edges") is structurally correct — but the operational CDLM corpus does not yet anchor those 6 signals into the 81 cells, so the literal edge set excludes them.

This is **not a decision reversal**. Native confirmed Option B classical-seeding AND Option (1) literal construction together. The revised sanity-check (novel, not confirmed) reflects the **higher-fidelity outcome of those two decisions in combination**: LL.7's `novel` class surfaces the Pancha-MP cluster as a genuine **discovery gap in CDLM**, which is exactly what the discovery layer is designed to do. The classification is correct; the §6.2 rationale was anticipatory, not descriptive.

A §6.3 addendum is added to NAP_M4_6_BRIEF (in-file v1.1 → v1.2) recording this clarification (see this session's NAP_M4_6_BRIEF edit).

### §4.4 — CF.LL7.1 — CDLM-patch carry-forward (M4-D / M5)

A separate workstream is flagged for future scoping:

> **CF.LL7.1 — CDLM Pancha-MP anchor patch.** Add MSR.117 / .118 / .119 / .143 / .145 to the msr_anchors of the governing CDLM cells where Pancha-MP yogas structurally apply: **D1.D1** (Sasha — Saturn-Kendra: 117/118/119 are Sasha-relevant), **D5.D5** (Venus-Malavya cell — 145 is Malavya-related), **D5.D6** (Mars-Ruchaka — 143 is Ruchaka), **D5.D7** (Jupiter-Hamsa — 145 is Hamsa-relevant). Cells named here are illustrative; exact cell selection requires a CDLM authoring session at L2.5. Carry-forward owner: M4-D or M5 (post-M4-C). Until patched, the 8 MED-tier pairs remain in LL.7's `novel` class — this is correct under the current CDLM, not a defect of LL.7.

This carry-forward is a **structural gap in CDLM**, not a defect of the LL.7 algorithm or of the data. It is recorded here so that a future CDLM author has a concrete entry point.

---

## §5 — Shadow-mode constraints

Per `SHADOW_MODE_PROTOCOL_v1_0.md §3` (NAP.M4.4 APPROVED 2026-05-02), LL.7 in native-only mode has **no shadow → production split**. Native sign-off is the promotion gate; there is no automatic shadow→prod promotion criterion.

This session writes only the SHADOW artifact:
- `signal_weights/shadow/ll7_discovery_prior_v1_0.json` — `shadow_status: SHADOW`, `promotion_status: shadow`, `kill_switch_state: clear`.
- The artifact does NOT modify `signal_weights/production/**` (must_not_touch per brief).
- The artifact does NOT modify LL.1, LL.2, LL.5, or LL.6 shadow files (must_not_touch per brief).
- The artifact does NOT modify LEL or `06_LEARNING_LAYER/OBSERVATIONS/**` (read-only consumption; held-out 9 sacrosanct).

LL.7 output is an **input** to LL.5 ranking and to L4 discovery flagging (per PHASE_M4C_PLAN §3.3); it is not itself a weight register that gets promoted. Promotion of LL.7's `novel` class entries to corpus updates (CDLM patches, MSR signal additions) is a separate L2.5 authoring action.

---

## §6 — Output schema

### Outer metadata

```json
{
  "schema_version": "1.0",
  "mechanism": "LL.7",
  "mechanism_label": "Discovery Prior Rubric (native-only mode)",
  "phase": "M4-C",
  "produced_during": "M4-C-S3-LL7-DISCOVERY-PRIOR",
  "produced_on": "2026-05-02",
  "design_doc_version": "1.0",
  "design_doc_path": "06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/LL7_DISCOVERY_PRIOR_DESIGN_v1_0.md",
  "rubric_version": "1.0",
  "rubric_option": "B",
  "nap_decision": "Option_B_approved_literal_clique",
  "nap_m4_6_verdict": "Option B",
  "nap_m4_6_refinements": ["unconfirmed", "threshold_N3", "ll2_med_anchor"],
  "cdlm_construction": "literal_msr_anchors_clique",
  "input_files": { ... },
  "training_events_used": 37,
  "held_out_events_excluded": 9,
  "discovery_threshold_density_weighted": 3.0,
  "density_weight_source": "LL.6 ll6_temporal_density_v1_0.json events[].density_weight",
  "promotion_criteria_ref": "06_LEARNING_LAYER/SHADOW_MODE_PROTOCOL_v1_0.md §3 (NAP.M4.4 APPROVED 2026-05-02; LL.7 native-only mode has no shadow→prod split)",
  "shadow_status": "SHADOW",
  "promotion_status": "shadow",
  "kill_switch_state": "clear",
  "partition": "training",
  "n1_disclaimer": "..."  // verbatim per protocol §7
}
```

### `cdlm_edge_set` summary

```json
"cdlm_edge_set_summary": {
  "cells_scanned": 81,
  "cells_with_anchors": <int>,
  "cdlm_edge_count": <int>,            // unique unordered pairs after union
  "anchor_signal_universe_size": <int> // unique signals appearing in any anchor list
}
```

### Edges array (one entry per non-noise pair)

```json
{
  "pair": ["MSR.<aa>", "MSR.<bb>"],            // sorted canonical
  "support": "confirmed" | "unconfirmed" | "novel" | "contradicted",
  "cdlm_declared": true | false,
  "empirical_density_weighted_count": <float>,  // 0.0 if cdlm_declared && unconfirmed
  "empirical_raw_count": <int>,
  "training_events": ["EVT.<id>", ...],         // events where both signals fired (informational)
  "is_ll2_med_anchor": true | false,            // true for the 8 anchor pairs
  "notes": <string>                              // optional
}
```

### Summary block

```json
"summary": {
  "confirmed_count": <int>,
  "unconfirmed_count": <int>,
  "novel_count": <int>,
  "contradicted_count": <int>,
  "noise_excluded_count": <int>,
  "sanity_anchor_novel_count": <int>,           // gate field — MUST be 8 per §4.2
  "sanity_anchor_confirmed_count": <int>,        // recorded for audit (expected: 0 under literal construction)
  "ll2_med_anchor_pairs_present": <int>,         // total of the 8 anchors classified as either novel or confirmed
  "ll2_med_anchor_pairs_missing": <int>          // expected: 0 — every anchor must surface above N≥3
}
```

`sanity_anchor_novel_count` is the field the §4 gate verifies. Original brief named this `sanity_anchor_confirmed_count`; the rename + value-class flip is the entirety of the revision per DECISION-2.

---

## §7 — Known limitations

1. **CDLM literal construction is sparse.** Most msr_anchors lists are 2–4 signals (1–6 pairs per cell). The 81-cell union yields a small unique pair set. Most empirical co-activations therefore fall into `novel` rather than `confirmed`. This is the expected and correct behavior under literal construction (DECISION-2) — `novel` is the discovery surface, and a sparse `confirmed` set means most discovery work is still ahead.

2. **Pancha-MP cluster gap in CDLM.** The 6 dominant anchor signals (MSR.117/.118/.119/.143/.145/.402) are not co-anchored within any single CDLM cell. The full Pancha-MP intra-clique structure surfaces as `novel`. This is a structural gap in the current CDLM corpus (CF.LL7.1) — not a defect in the algorithm.

3. **Density weighting is informational, not the gate.** LL.6 §6 H2 dense-cluster-inflation test was rejected; LL.6 design treats density adjustment as informational only. LL.7 reports density-weighted counts alongside raw counts, but the empirical-confirmation gate is **raw N≥3** per NAP §6.3(b) verbatim. At first write, the gap between raw and density-weighted matters in exactly one observed case: pair MSR.118 ↔ MSR.145 has raw N=5 but density-weighted count 2.9485 (because the 5 events fell in the 2007 dense cluster). A purely density-weighted gate at 3.0 would have failed the 8-anchor sanity check by classifying this pair below threshold; the raw-gate choice (with density-weighted reported) is the principled correction. Sensitivity to density-weighted vs raw thresholding is a candidate study for M4-D.

4. **No cross-domain Δ surfaced.** LL3 §4 found that all 8 MED-tier edges are intra-`general`. LL.7 inherits this pattern; the `novel` class surfaces no cross-domain pair at first write because no cross-domain pair reaches N≥3 in the 37-event training partition. M5 cohort-mode is expected to be the first surface for cross-domain `novel` patterns.

5. **n=1 risk per MACRO_PLAN §3.5.A Principle 1.** With 37 training events, novel pair surfacing is sample-shape-dominated (Pancha-MP clique). The native-only mode's discovery output should be read as candidate hypotheses for cohort confirmation, not as established cross-chart knowledge. SHADOW + n1_disclaimer encode this on the artifact.

6. **`contradicted` class likely empty.** LL3 §3.2 found 0 cross-domain mismatch flags structurally; the `contradicted_count` is expected to be 0 at first write. This is a structural property of the current LEL × CDLM interaction, not a defect.

7. **Held-out partition discipline.** Per LL.6 design §4 and learning discipline rule #4, the 9 held-out events are excluded from compute. LL.7 does not test the discovered priors against held-out — that is a separate forward-calibration session (M4-D or later).

8. **Empirical-vs-NAP shape divergence at first write.** NAP §6.4 expected output shape predicted ~5–15 `novel_candidate` edges. Actual at first write is **107 `novel`** + **136 `unconfirmed`** + **0 `confirmed`** + **0 `contradicted`** (243 emitted edges total; 9867 noise pairs excluded; 9974 raw co-firing pairs observed before threshold). The divergence has two structural causes: (a) under literal CDLM construction, the CDLM edge set (136 edges over 58 anchor signals) does not overlap with the dominant Pancha-MP cluster, so all empirically-supported pairs fall into `novel`, not `confirmed`; (b) the Pancha-MP intra-clique structure produces many raw N≥3 pairs (15 signals firing across multiple events generate ~`C(15,2)=105` candidate intra-clique pairs, of which ~107 cleared the threshold). This is empirical reality of the 37-event corpus, not a defect of the algorithm. NAP §6.4's estimates were anticipatory; CF.LL7.1 (CDLM patch) is the structural fix that would convert most of the 107 novels into confirmed at next compute.

---

## §8 — Changelog

- **v1.0 (2026-05-02, M4-C-S3-LL7-DISCOVERY-PRIOR):** Initial design + first SHADOW write under DECISION-1 (R.LL5DESIGN.1 Option A approved — LL.5 mechanism naming `Dasha-Transit axis-weight modulator`, MACRO_PLAN naming-update propagation deferred to S4) + DECISION-2 (CDLM construction literal msr_anchors-clique). §1 mechanism — Option B classical-seeded with three NAP.M4.6 refinements applied; literal CDLM construction; four-class `confirmed` / `unconfirmed` / `novel` / `contradicted` taxonomy with `noise` excluded. Empirical-confirmation gate = **raw N≥3** per NAP §6.3(b) verbatim; density-weighted count reported alongside as informational (in-session correction after a density-weighted gate at N≥3.0 was found to drop pair MSR.118 ↔ MSR.145 to weighted=2.9485 despite raw N=5; raw-gate is the principled choice and aligns with LL.6 design's informational-only stance — see §1 calibration note + §7 limitation 3). §2 input spec — 7 sources (CDLM, LEL records, LL.1, LL.2, LL.6, LL.3, SHADOW_MODE_PROTOCOL). §3 algorithm — 5 steps (build CDLM edge set; compute pair co-activations both raw and density-weighted; classify on raw; emit; sanity-check). §4 sanity-check (REVISED) — 8 MED-tier LL.2 anchors classify as `novel` (not `confirmed`) under literal construction; `sanity_anchor_novel_count == 8` is the revised gate; NAP §6.2 anticipatory-rationale clarification recorded; CF.LL7.1 CDLM-patch carry-forward flagged. §5 shadow-mode constraints — no shadow→prod split for native-only mode. §6 output schema — outer metadata + `cdlm_edge_set_summary` + edges array + summary block (with `sanity_anchor_novel_count` gate field added). §7 known limitations — 7 items (CDLM sparsity; Pancha-MP gap; density informational not gate; no cross-domain Δ; n=1 risk; contradicted empty; held-out discipline). §8 this changelog.

---

*End of LL7_DISCOVERY_PRIOR_DESIGN_v1_0.md.*
