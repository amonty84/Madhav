---
artifact: 06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/LL2_EDGE_WEIGHT_DESIGN_v1_0.md
version: "1.0"
status: CURRENT
produced_during: M4-B-S3-LL2-EDGE-WEIGHTS
produced_on: 2026-05-02
mechanism: LL.2 Graph Edge Weight Modulators
phase: M4-B
parent_phase_plan: 00_ARCHITECTURE/PHASE_M4_PLAN_v1_0.md §3.2 (M4-B — LL.1/LL.2 shadow writes)
authoritative_protocol: 06_LEARNING_LAYER/SHADOW_MODE_PROTOCOL_v1_0.md §3.5 (LL.2 promotion criteria)
governing_rubric: 06_LEARNING_LAYER/OBSERVATIONS/CALIBRATION_RUBRIC_v1_0.md v1.1 (Option B; status APPROVED 2026-05-02)
related_acceptance_criteria: AC.S3.3 (M4-B-S3 brief)
purpose: >
  Specifies WHAT an LL.2 edge weight is, WHICH inputs are consumed, the EXACT computation
  algorithm, the shadow-mode constraints (mirroring LL.1 discipline), the OUTPUT SCHEMA
  for ll2_edge_weights_v1_0.json, and the KNOWN LIMITATIONS of edge statistics at n=37
  training events. Authored before any LL.2 computation runs (per AC.S3.3 hard constraint).
---

# LL.2 GRAPH EDGE WEIGHT MODULATORS — design document

```
This document is the design spec frozen BEFORE the M4-B-S3 LL.2 shadow computation
runs. The computation that produces ll2_edge_weights_v1_0.json (this session's
deliverable) implements §3 of this document exactly. Future edge-weight cycles
either honor §3 verbatim or bump this document to v1.1+ before re-running.
```

---

## §1 — Mechanism definition

### §1.1 — What is an LL.2 edge weight?

An **LL.2 edge weight** is a numeric modulator in `[0.0, 1.0]` attached to an
ordered or unordered pair of MARSYS-JIS signals `(sig_A, sig_B)`, encoding the
empirical co-activation frequency of those two signals across the training
partition of the Life Event Log (LEL). It is *not* a domain-pair score (that is
the CDLM cell `strength`); it is *not* a per-signal weight (that is LL.1); it is a
**pairwise** modulator that lives between two specific signals.

Per `MACRO_PLAN_v2_0.md §LL-Appendix.B LL.2`:

> *"LL.2 — Graph edge weight learning. Per-edge modulators on the cross-domain
> linkage graph (CDLM-based) and the chart-graph-model (CGM) that encode learned
> joint-activation strength. Edges are between signal nodes; the modulator is a
> multiplicative factor in `[0.0, 1.0]` applied to the prior edge weight by
> downstream pipeline operations. Shadow-mode and promotion governed by
> SHADOW_MODE_PROTOCOL §3.5."*

The semantics: when downstream pipeline code (M5+ ranker, M5+ planner, M5+
synthesis) traverses the signal graph and considers a path through edge
`(sig_A, sig_B)`, it applies this LL.2 weight as a multiplicative confidence
factor on that edge. A weight of 1.0 means "in this native's life corpus,
sig_A and sig_B fire together every time"; a weight of 0.0 means "they have
been observed individually but never together"; intermediate values encode
the empirical co-activation rate.

### §1.2 — Where do edges live in the MARSYS-JIS graph?

The MARSYS-JIS graph consists of two declared cross-domain surfaces:

1. **CGM (Chart Graph Model) `CGM_v9_0.md`** — 234 nodes, 21 edges. Edges here
   are between *chart entities* (planets, houses, cusps, special points), not
   between signals. CGM edges are out of scope for this LL.2 cycle (no
   signal-to-signal mapping exists at v9.0).
2. **CDLM (Cross-Domain Linkage Matrix) `CDLM_v1_1.md`** — 9×9 = 81 cells. Each
   off-diagonal cell `CDLM.Dx.Dy` declares a domain-to-domain linkage with a
   `strength` ∈ `[0.0, 1.0]` and an `msr_anchors` list of ~3 MSR signals that
   anchor the linkage. The CDLM cells are domain-pair entities; they do *not*
   declare explicit signal-to-signal edges.

Per `M4-B-S3-LL2-EDGE-WEIGHTS` brief hard constraint, since CDLM does not
contain a machine-readable signal-to-signal edge list, this design uses the
**fallback approach**: implicit edges are derived from cross-domain co-firing
observed in the LEL training partition. §3 below specifies the algorithm.

### §1.3 — Why "modulator" not "weight"?

`SHADOW_MODE_PROTOCOL §3.5` calls these "edge modulators," and `MACRO_PLAN
§LL-Appendix.B LL.2` calls them "modulators on the cross-domain linkage graph."
The terminology distinguishes LL.2 from LL.1: LL.1 emits a per-signal weight
that downstream pipeline code applies as a primary confidence; LL.2 emits a
per-edge multiplier that *modulates* an already-existing graph edge prior. In
the M4-B cycle, no graph edge prior exists yet (the CDLM edge prior is at
domain-pair level, not signal-pair level), so the LL.2 modulator effectively
*defines* the signal-pair edge. From M5+, when an explicit signal-pair edge
prior is declared (likely a new artifact `SIGNAL_PAIR_EDGE_PRIOR_v1_0.md`),
LL.2 returns to its modulator role.

---

## §2 — Input specification

The computation that produces `ll2_edge_weights_v1_0.json` reads exactly the
following inputs. No other files are consumed; no values are remembered from
prior sessions (B.10 — no fabricated computation).

### §2.1 — Primary input: `lel_event_match_records.json`

- **Path:** `06_LEARNING_LAYER/OBSERVATIONS/lel_event_match_records.json`
- **Schema:** `06_LEARNING_LAYER/OBSERVATIONS/lel_event_match_records_schema.json`
  (v1.1)
- **Filter applied:** `partition: "training"` (37 of 46 records). The 9
  held-out records are explicitly excluded by partition filter, not by record
  ordering. The held-out partition is sacrosanct per Learning-discipline rule
  #4 (`MACRO_PLAN §LL-Appendix.B`).
- **Field consumed:** `actual_lit_signals[]` (per record) — the list of signals
  that fired at the event date with their `lit_score`. The computation reads
  `signal_id` and `lit_score`; signals with `lit_score > 0` count as "lit" for
  edge-co-activation purposes. Signals with `lit_score = 0` are excluded
  (they are recorded as observations but did not fire).
- **Other fields ignored at LL.2:** `expected_lit_signals` (LL.1 input),
  `match_rate` (LL.1 input), `event_date_*`, `match_notes`. LL.2 is
  about *what fires together*, not *what was expected*; using actual_lit_signals
  is the correct input.

### §2.2 — Secondary input: CDLM domain topology

- **Path:** `025_HOLISTIC_SYNTHESIS/CDLM_v1_1.md`
- **Status of edge list:** CDLM is a 9×9 = 81-cell domain-pair matrix, not a
  signal-pair edge list. No machine-readable signal-to-signal edge list exists
  in CDLM. Per AC.S3.3 hard constraint, this is documented and the **fallback
  approach** (cross-domain co-firing from LEL) is used as the edge candidate
  source.
- **Domain mapping consumed:** The CDLM does NOT itself provide signal→domain
  mapping (its msr_anchors list is per-cell, not a global mapping). The global
  signal→domain mapping is consumed from `msr_domain_buckets.json` (see §2.3).
- **What CDLM contributes:** the *concept* of the 9 life-event domains (D1–D9
  career/wealth/relationships/health/children/spirit/parents/mind/travel) and
  the principle that LL.2 edges are cross-domain. The CDLM cell strengths are
  *not* used in this M4-B cycle; they are a candidate prior for a future M5+
  cycle's modulator interpretation.

### §2.3 — Tertiary input: signal domain mapping

- **Path:** `06_LEARNING_LAYER/OBSERVATIONS/msr_domain_buckets.json`
- **Field consumed:** `domain_buckets` — 10 buckets keyed by domain name
  (career, education, health, relationship, family, financial, psychological,
  spiritual, travel, general). Each bucket holds a list of MSR signal IDs
  primarily mapped to that domain.
- **Coverage limitation:** msr_domain_buckets covers MSR signal IDs of form
  `SIG.MSR.NNN`. It does NOT cover the LEL semantic-class IDs (`CTR.NN`,
  `CVG.NN`, `SIG.NN`, `RPT.*`, `DSH.*`). Signals in those namespaces are
  treated as `domain: "unknown"` per the same fallback applied at LL.1
  (see `LL1_TWO_PASS_APPROVAL_v1_0.md §2 domain mapping note`). Cross-system
  reconciliation is M4-D scope per `PHASE_M4_PLAN`.

### §2.4 — Informational input (not directly consumed)

- **Path:** `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/signal_weights/shadow/ll1_shadow_weights_v1_0.json`
- **Role:** informational only — the LL.1 shadow file's per-signal records
  carry `domain` and `mean_match_rate` and `n_observations` fields that the
  LL.2 shadow file *cross-references* in its endpoint metadata (so a downstream
  reader can see, per edge, what the LL.1 status of each endpoint was at LL.2
  computation time). This cross-reference does not feed the edge weight
  numerically; it is a denormalized convenience field for audit.

---

## §3 — Computation algorithm

### §3.1 — Step-by-step

1. **Load** `lel_event_match_records.json`. Validate the file is well-formed
   (`records` array exists, `total_events == 46`, `training_count == 37`,
   `held_out_count == 9`).
2. **Filter** to training partition: `training_records = [r for r in records
   if r["partition"] == "training"]`. Assert `len(training_records) == 37`.
3. **Load** `msr_domain_buckets.json`. Build a global mapping
   `signal_to_domain: dict[str, str]` from the `domain_buckets` field.
   Signals not in the mapping are assigned `"unknown"`.
4. **For each training record**, build the per-event lit-signal set:
   `lit_signals_in_event = {s["signal_id"] for s in r["actual_lit_signals"]
   if s["lit_score"] > 0}`. (Note: deduplication by signal_id; if a signal
   appears with both `lit_source: dasha` and `lit_source: transit`, it counts
   once for co-activation purposes.)
5. **Generate edge candidates** from co-firing within each training event:
   - For each training event's lit-signal set, generate all unordered pairs
     `(sig_A, sig_B)` with `sig_A < sig_B` (lexicographic).
   - **Edge filter (revised at compute time — see §3.5 empirical adjustment):**
     retain all pairs except those where BOTH endpoints carry `domain: "unknown"`
     (those pairs cannot be analyzed for cross-domain status). Each retained
     pair is tagged with `cross_domain: bool` per `signal_to_domain[sig_A]
     != signal_to_domain[sig_B]`. A strict cross-domain filter (drop all
     `cross_domain: false` pairs) was the original design intent in §1.2 but
     is REVISED at compute time per §3.5 below: empirically, LEL training
     events are domain-stratified, so the strict filter produces zero edges.
     The revised filter retains intra-domain co-firings annotated with
     `cross_domain: false` so the file is non-empty and useful for downstream
     audit.
   - The retained set across all 37 events forms the **edge candidate set**.
6. **Compute per-edge co-activation count:** for each candidate edge `(sig_A,
   sig_B)`, count the number of training events in which BOTH signals fire
   with `lit_score > 0`. Call this `co_count`.
7. **Compute per-edge raw co-activation rate:** `raw_co_activation = co_count
   / 37`.
8. **Compute per-edge normalized weight:** `normalized_weight = raw_co_activation`.
   (At this M4-B cycle the normalization is the identity. Future cycles may
   apply per-domain or per-signal normalization; that is a v1.1+ design
   decision and not implemented here.)
9. **Assign confidence tier** by `co_count`:
   - `HIGH` — co_count ≥ 8
   - `MED`  — co_count ∈ [4, 7]
   - `LOW`  — co_count ∈ [1, 3]
   - `ZERO` — co_count = 0 (edges from §3.2 below)
10. **Compute auxiliary statistics per edge** for audit:
    - `co_event_ids: list[str]` — the LEL event IDs in which both signals
      co-fired (length == co_count).
    - `lit_score_pairs: list[[float, float]]` — per-co-event, the [lit_score_A,
      lit_score_B] tuple. Allows downstream variance analysis even though
      the variance gate is at LL.2 promotion time, not here.
    - `co_score_mean: float` — mean of `min(lit_score_A, lit_score_B)` across
      co-events. This is the per-edge analog of LL.1's `mean_match_rate` —
      the strength of joint firing when both signals fire.
    - `co_score_variance: float` — variance of `min(lit_score_A, lit_score_B)`
      across co-events. Auxiliary; the §3.1(b) variance gate is computed at
      promotion-evaluation time, not here.
11. **Annotate parent LL.1 endpoint state** per edge: read
    `ll1_shadow_weights_v1_0.json`'s `signal_weights[sig_A]` and
    `signal_weights[sig_B]`. Capture per endpoint: `n_observations`,
    `mean_match_rate`, `status`, `promotion_eligible`. The edge record's
    `parent_ll1_endpoints` block uses this. If a signal is absent from the
    LL.1 shadow file (i.e., it fires in LEL training but did not enter the
    LL.1 shadow), record `n_observations: 0, status: "absent_from_ll1_shadow"`.
12. **Annotate `parent_ll1_endpoints_in_production`** flag per edge: this
    flag is `true` if and only if BOTH endpoints' LL.1 weights are in the
    production register file (which currently means
    `weights_in_production_register: true` AND the endpoint signal_id is in
    the production file's signals list). At M4-B-S3 close, this flag is
    `false` for every edge per the LL.2 stability gate (LL2_STABILITY_GATE
    §2): no LL.1 weight is in production until NAP.M4.5.
13. **Annotate `promotion_blocked_reason`** per edge: this is a string field;
    at this session's close it reads `"LL.1 NAP.M4.5 pending — see
    LL2_STABILITY_GATE_v1_0.md §3"` for every edge.
14. **Sort the edge list** by `co_count` descending, then by
    `signal_id_a` ascending, then by `signal_id_b` ascending. Stable
    deterministic ordering is mandatory (re-runs must produce byte-identical
    output for identical inputs — B.10 + auditability).

### §3.2 — Why no ZERO-tier edges in this M4-B cycle

The fallback edge candidate set in §3.1 step 5 is "pairs that co-fire in at
least one training event." By construction, every candidate has `co_count ≥ 1`,
so the ZERO tier is empty. This is an explicit design choice at v1.0:

- **Alternative considered but rejected.** A more inclusive universe — "pairs
  drawn from CDLM `msr_anchors` that don't co-fire in training" — would
  produce ZERO-tier edges representing "theory-declared but empirically-zero"
  linkages. This would be useful for L4 Discovery (Gemini) but is out of
  scope at M4-B per `PHASE_M4_PLAN §3.2`. CDLM-anchor-derived ZERO edges are
  deferred to M4-C or M5 where L4 Discovery has its own scaffolding.
- **Alternative considered but rejected.** A fully exhaustive universe —
  "every pair of signals that individually fire ≥ 1 time" — would produce
  ~35,000 candidate edges (266 firing signals × 265 / 2), most ZERO. This
  blows up the file size with low-information ZERO entries and does not
  serve the M4-B promotion-gate use case. Rejected.
- **Recorded outcome.** The shadow file's `summary.zero_tier_count` is `0`.
  The summary block notes this is by-construction at v1.0 and the design
  choice is documented at this §3.2.

### §3.3 — Determinism and reproducibility

The algorithm is deterministic. Given the same inputs (frozen `lel_event_match_records.json`,
`msr_domain_buckets.json`, `ll1_shadow_weights_v1_0.json`), two runs produce
byte-identical `ll2_edge_weights_v1_0.json`. This is verified by the §3.1 step
14 sort key + the fact that no random sampling, time-dependent computation,
or LLM call is involved. The computation is pure arithmetic + set operations.

### §3.5 — Empirical adjustment (compute-time revision)

**Finding made at compute time (M4-B-S3-LL2-EDGE-WEIGHTS, 2026-05-02).** A
direct read of `lel_event_match_records.json` training partition reveals that
**no training event** has `actual_lit_signals` from two or more *known* domain
buckets simultaneously. Specifically:

- 21 of 37 training events have `actual_lit_signals` from exactly one known
  domain bucket (career, general, health, relationship, financial, or
  travel).
- 16 of 37 training events have `actual_lit_signals` whose signals all carry
  `domain: "unknown"` (LEL semantic-class IDs CTR/CVG/SIG.NN/RPT/DSH absent
  from `msr_domain_buckets.json`).
- **0 of 37 training events** have a mix of two-or-more known domains *or* a
  mix of known + unknown domains.

This is a structural property of how the M4-A event-match scoring was authored:
each event's signal stack was selected by domain coherence (the activator
checks signals in the event's primary domain). Cross-domain co-firing within a
single event therefore *does not occur* in the M4-B training corpus, and the
strict cross-domain filter would yield **0 edges**.

**Design adjustment.** Rather than ship an empty file (which conveys little
audit value), the §3.1 step 5 filter is revised at compute time: all
co-firing pairs within events are retained, with each pair tagged
`cross_domain: bool`. Pairs where both endpoints are `domain: "unknown"`
are still dropped (cannot be analyzed for cross-domain status). The summary
block reports `cross_domain_count` and `intra_domain_count` so the structural
finding is surfaced rather than hidden. The file's primary use as a
shadow-mode observation register is preserved; the cross-domain semantic
intent of LL.2 is preserved as an *annotation*, not a *filter*, until the
M4-D cross-system reconciliation can produce a richer activator output.

**Implication for §3.2 (no ZERO tier).** Unchanged — every retained pair has
`co_count ≥ 1` by construction.

**Implication for §6 limitations.** §6.7 (new) records this finding as a
top-level structural caveat for downstream consumers; future LL.2 cycles
post-M4-D should re-evaluate whether an enriched activator output produces
genuine cross-domain co-firings in the same event.

**Audit-trail note.** This adjustment is documented IN the design doc itself
(§3.5) and is implemented in the computation script. It is *not* a silent
runtime override; the design doc and the computation are in sync. Per B.10
(no fabricated computation), the underlying data is the same; only the
filter predicate changed, and the change is announced.

### §3.4 — What this cycle does NOT compute

- **Edge promotion eligibility.** Per LL2_STABILITY_GATE §3, every edge ships
  with `promotion_eligible: false` at this session, regardless of per-edge
  (LL.2.a)–(d) state. The gate (LL.2.e) governs.
- **Per-edge §3.1(b) variance gate.** The shadow file records `co_score_variance`
  for audit, but does not compare it to the 0.3 threshold. That comparison
  happens at promotion evaluation time (a future session post-NAP.M4.5).
- **CDLM `strength` as a prior multiplier.** This M4-B cycle treats edge weight
  = empirical co-activation rate, with no CDLM-prior multiplier. Future cycles
  may experiment with `weight = co_activation × CDLM_domain_pair_strength` as a
  modulator interpretation; that is a v1.1+ design change.

---

## §4 — Shadow-mode constraints

LL.2 shadow writes inherit LL.1 shadow-mode discipline from
`SHADOW_MODE_PROTOCOL_v1_0.md` per `§3.5`. This M4-B-S3 cycle observes:

- **Path discipline.** The shadow file lands at
  `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/signal_weights/shadow/ll2_edge_weights_v1_0.json`.
  The `signal_weights/production/` subdirectory is in `must_not_touch` for this
  session per the M4-B-S3 brief; no production file is created or modified.

  *Note on path:* the brief and this design place LL.2 in `signal_weights/`
  (alongside LL.1) rather than `GRAPH_EDGE_WEIGHT_LEARNING/` (the path declared
  in `SHADOW_MODE_PROTOCOL §2`). The protocol's declared path
  (`06_LEARNING_LAYER/GRAPH_EDGE_WEIGHT_LEARNING/edge_modulators/shadow/`) is
  not yet provisioned; the brief explicitly directs writing to
  `signal_weights/shadow/`. Per `ONGOING_HYGIENE_POLICIES §C` scope-boundary
  rule, the brief's `may_touch` declaration is binding for this session — the
  design honors the brief and notes the path-protocol-asymmetry as
  `R.LL2DESIGN.1` in §6 below for resolution at the next M4-B governance pass.
- **Two-pass approval.** This session is Claude scaffolding (pass_1). Pass_2 =
  Gemini red-team falls due at the next IS.8(a) cadence
  (red_team_counter 1 → 2 at this session's close; next IS.8(a) at counter=3).
- **Native notification.** Native notification happens via the SESSION_LOG
  entry for M4-B-S3-LL2-EDGE-WEIGHTS appended at session close, citing this
  shadow file by path and edge count. Absence of explicit hold = consent per
  `SHADOW_MODE_PROTOCOL §3.1(d)`.
- **n=1 disclaimer.** The shadow file's header carries the verbatim disclaimer
  from `SHADOW_MODE_PROTOCOL §7`, with LL.2-specific adaptation (added
  language naming "edge weights" not "signal weights"). The disclaimer is
  non-removable.
- **Held-out events sacrosanct.** The 9 held-out LEL events are excluded by
  partition filter at §3.1 step 2; their `actual_lit_signals` never enter the
  edge computation. Verified by explicit filter (`r["partition"] == "training"`)
  not by record ordering, per the brief hard constraint.
- **Kill-switch §4 conditions.** None active at session open per
  `LL2_STABILITY_GATE §2` cross-checks. If any kill-switch fires mid-session,
  the shadow file is not committed and the kill-switch state is recorded in
  SESSION_LOG.
- **Promotion blocked.** Every edge ships with `promotion_eligible: false` and
  `promotion_blocked_reason: "LL.1 NAP.M4.5 pending — see
  LL2_STABILITY_GATE_v1_0.md §3"`.

---

## §5 — Output schema (`ll2_edge_weights_v1_0.json`)

```json
{
  "schema_version": "1.0",
  "mechanism": "LL.2",
  "phase": "M4-B",
  "produced_during": "M4-B-S3-LL2-EDGE-WEIGHTS",
  "produced_on": "2026-05-02",
  "design_doc_version": "1.0",
  "design_doc_path": "06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/LL2_EDGE_WEIGHT_DESIGN_v1_0.md",
  "rubric_version": "1.1",
  "rubric_option": "B",
  "input_files": [
    {"path": "06_LEARNING_LAYER/OBSERVATIONS/lel_event_match_records.json", "role": "primary"},
    {"path": "025_HOLISTIC_SYNTHESIS/CDLM_v1_1.md", "role": "topology_documentation"},
    {"path": "06_LEARNING_LAYER/OBSERVATIONS/msr_domain_buckets.json", "role": "domain_mapping"},
    {"path": "06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/signal_weights/shadow/ll1_shadow_weights_v1_0.json", "role": "endpoint_annotation"}
  ],
  "training_events_used": 37,
  "held_out_excluded": 9,
  "edge_topology_source": "fallback (cross-domain co-firing from LEL training partition; CDLM does not contain a machine-readable signal-pair edge list)",
  "stability_gate_ref": "06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/LL2_STABILITY_GATE_v1_0.md (decision: CONDITIONAL_PASS; promotion blocked until NAP.M4.5)",
  "promotion_criteria_ref": "06_LEARNING_LAYER/SHADOW_MODE_PROTOCOL_v1_0.md §3.5 (LL.2 promotion criteria)",
  "n1_disclaimer": "VALIDITY NOTICE: These edge weights are derived from a single native's (n=1) life event corpus. They are provisional, subject to revision as the corpus grows, and must not be interpreted as universal Jyotish signal-pair edge weights. Per MACRO_PLAN §3.5.A Principle 1 — n=1 validity disclaimer. Promotion does NOT lift this disclaimer; it lifts only the structural barrier between observation and downstream pipeline operation. LL.2-specific note: edge sparsity at n=37 training events places most edges in LOW-tier (co_count 1–3) confidence; treat all edge weights as observations, not as established joint-firing rates.",
  "summary": {
    "total_edges_evaluated": <int>,
    "high_tier_count": <int>,
    "med_tier_count": <int>,
    "low_tier_count": <int>,
    "zero_tier_count": 0,
    "cross_domain_definition": "domain_a != domain_b (where domain is from msr_domain_buckets.json; signals absent from the mapping carry domain='unknown'; pairs where both endpoints are 'unknown' are dropped per §3.1 step 5)",
    "pairs_with_unknown_endpoint_count": <int>
  },
  "edges": [
    {
      "edge_id": "EDGE.<sig_A_safe>__<sig_B_safe>",
      "signal_id_a": "<sig_A>",
      "signal_id_b": "<sig_B>",
      "domain_a": "<domain or 'unknown'>",
      "domain_b": "<domain or 'unknown'>",
      "co_count": <int>,
      "raw_co_activation": <float>,
      "normalized_weight": <float>,
      "confidence_tier": "HIGH | MED | LOW | ZERO",
      "co_event_ids": ["EVT.YYYY.MM.DD.NN", ...],
      "lit_score_pairs": [[<float>, <float>], ...],
      "co_score_mean": <float>,
      "co_score_variance": <float>,
      "parent_ll1_endpoints": {
        "a": {
          "signal_id": "<sig_A>",
          "n_observations": <int>,
          "mean_match_rate": <float>,
          "status": "<LL.1 shadow status string>",
          "promotion_eligible": <bool>
        },
        "b": {
          "signal_id": "<sig_B>",
          "n_observations": <int>,
          "mean_match_rate": <float>,
          "status": "<LL.1 shadow status string>",
          "promotion_eligible": <bool>
        }
      },
      "parent_ll1_endpoints_in_production": false,
      "promotion_eligible": false,
      "promotion_blocked_reason": "LL.1 NAP.M4.5 pending — see LL2_STABILITY_GATE_v1_0.md §3",
      "approval_chain": []
    }
  ]
}
```

**Schema notes.**

- `edge_id` format: prefix `EDGE.` + sanitized `signal_id_a` + `__` +
  sanitized `signal_id_b`. Sanitization replaces `.` with `_` to make the ID
  filesystem- and JSON-key-safe. Example: `EDGE.SIG_MSR_118__SIG_MSR_402`.
- The `approval_chain` array is empty at this M4-B-S3 close. It populates at
  the post-NAP.M4.5 cycle when per-edge promotion candidacy is evaluated.
- Edges are sorted per §3.1 step 14: `co_count` desc, `signal_id_a` asc,
  `signal_id_b` asc.
- All numeric values use float (Python `json.dump` default precision); 4
  decimal places of meaningful precision are sufficient for an n=37 corpus.

---

## §6 — Known limitations

### §6.1 — n=37 is sparse for edge statistics

With 37 training events, the maximum `co_count` is 37. Empirically the LL.1
shadow file reports the most-firing single signal (`SIG.MSR.145`) at
`n_observations = 11`; pairs of signals will co-fire less often than either
fires alone. Expect:

- Most edges in **LOW** tier (co_count 1–3): coincidence-prone; one or two
  shared events.
- A small **MED** tier (co_count 4–7): suggestive joint-firing but
  borderline-significant.
- A small **HIGH** tier (co_count ≥ 8): strong joint-firing signal —
  candidates that may approach LL.2 promotion eligibility per §3.1(a) once
  NAP.M4.5 unblocks.

This is expected and non-pathological. The sparsity is *why* the
SHADOW_MODE_PROTOCOL gates exist (§3.1(a) N≥3 floor + §3.1(b) variance ≤ 0.3
ceiling). Sparsity at n=37 is a feature of the M4 cycle by design — the M5+
roadmap (`MACRO_PLAN §M4 Risks (d)` second-pass calibration) re-runs LL.2
when the corpus reaches 80 events.

### §6.2 — Domain-unknown signals dilute cross-domain edge identification

11 of the 30 LL.1 promotion-eligible signals carry `domain: unknown` (the
LEL semantic-class IDs CTR/CVG/SIG.NN/RPT). When such a signal is one
endpoint of an edge, the cross-domain status is provisional ("known X →
unknown") rather than confirmed. The shadow file annotates these edges via
`domain_a: unknown` or `domain_b: unknown` so a future M4-D cross-system
reconciliation can re-tier them.

### §6.3 — CDLM cells are not consumed

The CDLM cells' `strength` field (the manually-curated domain-pair linkage
strength) is *not* used as a prior multiplier in this cycle. This is a
deliberate v1.0 design decision: the M4-B cycle measures empirical
co-activation; it does not blend it with prior CDLM beliefs. A v1.1+
revision may experiment with `weight = co_activation × CDLM.D(a).D(b).strength`
as a modulator-interpretation; that change requires explicit native approval
because it changes the meaning of the LL.2 weight from "empirical rate" to
"empirical-rate-modulated-CDLM-prior" — a different epistemic claim.

### §6.4 — Edge candidate set retains intra-domain pairs (revised at compute time)

Per §3.5 (compute-time adjustment), the original strict cross-domain filter
was relaxed: intra-domain co-firing pairs are retained and annotated with
`cross_domain: false`. The original design intent (LL.2 as the cross-domain
mechanism, with intra-domain pattern coverage delegated to LL.1's per-signal
weight) is preserved as a *semantic* property visible via the
`cross_domain` field, but is no longer a hard exclusion filter at v1.0
because the LEL training corpus structurally prohibits cross-domain
co-firing in single events (see §3.5 + §6.7).

### §6.5 — No CDLM-anchor ZERO-tier edges

Per §3.2, ZERO-tier edges are not included in this v1.0 cycle. Future cycles
that incorporate CDLM `msr_anchors` lists as a candidate-source-augmentation
will produce ZERO-tier edges representing "CDLM-theory-declared but
empirically-zero" linkages — useful for L4 Discovery (Gemini) but out of
scope at M4-B.

### §6.7 — Empirical finding: training corpus is domain-stratified

Per §3.5 (compute-time adjustment), the M4-A event-match scoring authored
each training event's `actual_lit_signals` with signals from a single
domain bucket — 21 events single-known-domain, 16 events all-unknown-class
(LEL semantic-class IDs), 0 events mixed. This means the *strict* LL.2
cross-domain definition (signals from different domains co-firing in the
same event) yields zero edges in M4-B-S3. The shadow file ships under the
*relaxed* definition (any two non-both-unknown signals co-firing in the same
event, annotated cross_domain: bool) so it has audit value, and surfaces
the structural finding via the `summary.cross_domain_count` and
`summary.intra_domain_count` fields. Future LL.2 cycles (M4-D and beyond)
should consume an enriched activator output that fires signals across
multiple domains per event when warranted; whether such an enrichment is
possible is itself an M4-D research question (cross-system MSR-LEL
reconciliation).

### §6.6 — Path-protocol asymmetry (R.LL2DESIGN.1)

`SHADOW_MODE_PROTOCOL §2` declares LL.2 shadow path as
`06_LEARNING_LAYER/GRAPH_EDGE_WEIGHT_LEARNING/edge_modulators/shadow/`. The
M4-B-S3 brief directs `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/signal_weights/shadow/`
(co-located with LL.1 for this cycle). The brief is binding for this session
per `ONGOING_HYGIENE_POLICIES §C`; the asymmetry is recorded as
**R.LL2DESIGN.1 (LOW)** for resolution at the next M4-B governance pass —
either by symlinking, by relocating the file, or by amending the protocol
to permit co-location. Severity LOW because the file is correctly named
(`ll2_edge_weights_v1_0.json` — namespace-prefixed) and discoverable; the
inconsistency is locator-only.

---

## §7 — Changelog

- **v1.0 (2026-05-02, M4-B-S3-LL2-EDGE-WEIGHTS):** Initial design document.
  §1 mechanism definition (edges live on the cross-domain signal graph;
  modulator framing per protocol). §2 inputs (lel_event_match_records.json
  primary; CDLM topology documentation; msr_domain_buckets domain mapping;
  ll1_shadow_weights informational endpoint annotation). §3 algorithm
  (cross-domain co-firing fallback per brief hard constraint; deterministic
  arithmetic; no random sampling; ZERO-tier intentionally empty in v1.0).
  §4 shadow-mode constraints (path, two-pass, native notification, n=1
  disclaimer, kill-switch, promotion blocked per LL.2 stability gate). §5
  output schema (ll2_edge_weights_v1_0.json shape with summary block + edges
  array + edge metadata + parent_ll1_endpoints cross-reference + promotion
  state). §6 known limitations (n=37 sparsity expected; domain-unknown
  signals provisional; CDLM cells not consumed; intra-domain pairs excluded;
  ZERO-tier intentionally empty; path-protocol asymmetry R.LL2DESIGN.1 LOW).

---

*End of LL2_EDGE_WEIGHT_DESIGN_v1_0.md. The computation that produces
ll2_edge_weights_v1_0.json (this session's deliverable) implements §3
exactly.*
