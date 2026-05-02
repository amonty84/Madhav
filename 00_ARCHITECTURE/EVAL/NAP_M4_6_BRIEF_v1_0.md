---
artifact: 00_ARCHITECTURE/EVAL/NAP_M4_6_BRIEF_v1_0.md
canonical_id: NAP_M4_6_BRIEF
version: "1.0"
status: PENDING_NATIVE_DECISION
authored_by: M4-B-P5-M4C-ENTRY-PREP
authored_on: 2026-05-02
nap_id: NAP.M4.6
nap_subject: LL.7 Discovery Prior Rubric (native-only mode at M4-C)
governs_sub_phase: M4-C-S3 (LL.7 first artifact write)
parent_plan: 00_ARCHITECTURE/PHASE_M4C_PLAN_v1_0.md §3.3 + §6.1
authoritative_spec: 00_ARCHITECTURE/MACRO_PLAN_v2_0.md §LL-Appendix.B LL.7 + §3.5.A Principle 1
related_artifacts:
  - 06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/LL3_DOMAIN_COHERENCE_v1_0.md (§5 recommendations + §4 LL.2 edge spot-check)
  - 06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/LL4_PREDICTION_PRIOR_v1_0.md (§5 prior-calibration recommendation)
  - 025_HOLISTIC_SYNTHESIS/CDLM_v1_1.md (the cross-domain linkage map cited as Option B's classical prior)
  - 06_LEARNING_LAYER/SHADOW_MODE_PROTOCOL_v1_0.md §2 LL.7 row (native-only mode has no shadow→production split)
decision_pending: true
changelog:
  - v1.0 (2026-05-02, M4-B-P5-M4C-ENTRY-PREP): Initial brief authored as a
    decision-pending artifact. Three options presented neutrally with
    structural framing; Claude's recommendation stated in §2 with the
    grounding from LL3 + LL4 findings; decision template in §3; downstream
    consequences in §4.
---

# NAP.M4.6 — Decision Brief

## LL.7 Discovery Prior Rubric (native-only mode at M4-C)

```
STATUS: PENDING NATIVE DECISION (2026-05-02).
This brief is decision-pending. No LL.7 algorithm path is committed until the
native issues a verdict per §3 Decision template. The verdict will be recorded
in SESSION_LOG NAP-decisions append entry and stamped into the LL.7 artifact's
frontmatter at M4-C-S3 first write.
```

---

## §1 — What NAP.M4.6 decides

### §1.1 — Context

LL.7 — Discovery Prior Shaping — is the Learning Layer mechanism that surfaces
signal-pair / signal-cluster relationships that the existing MSR + CDLM
classical knowledge surfaces do not already articulate. It is the *novel-
discovery* layer of the Learning Layer (distinct from LL.5 retrieval-ranking
which scores known signals, and LL.6 plan-selection which routes among known
plan classes).

LL.7 has two activation modes per `MACRO_PLAN §LL-Appendix.B LL.7`:
- **(a) native-only mode** — priors shaped by the native's own outcome record
  on a single chart. Active from M4 (this NAP scope).
- **(b) cohort mode** — priors shaped by cohort signal co-occurrence. Active
  from M7 when cohort ≥ N (out of NAP.M4.6 scope).

NAP.M4.6 decides the **rubric** that governs native-only mode at M4-C. The
rubric specifies:
- Which co-activation patterns LL.7 surfaces.
- Whether classical priors (CDLM cross-domain linkages, MSR signal categories)
  are pre-applied as filters, post-applied for interpretation, or not consulted
  at all.
- How patterns flagged as "novel" (no classical articulation) are routed for
  native review.

### §1.2 — Why the rubric matters

The choice has structural consequences for what LL.7 *can* surface at n=37
training events + n=9 held-out events (the M4-B LEL training partition):

- **n=1 risk class.** Per `MACRO_PLAN §3.5.A Principle 1` — "with a single
  native, overfit is the dominant statistical risk, not underfit." A discovery
  layer that surfaces patterns based purely on co-activation in 37 events will
  surface noise unless filtered. The rubric is the structural defense.
- **Learning discipline rule #1.** "Priors locked; learning modulates, never
  overwrites." LL.7 must not silently overwrite CDLM classical priors. The
  rubric determines whether classical priors are integrated structurally
  (Option B), respected post-hoc (Option C), or set aside (Option A).
- **LL3 + LL4 findings.** M4-B-S4 found:
  - 8 MED-tier CDLM edges with empirical confirmation in the 37-event training
    partition (LL3 §4.1).
  - The Pancha-Mahapurusha clique (SIG.MSR.117/118/119/143/145/402) dominates
    intra-domain co-firings (LL3 §3 + §4).
  - classical_rule basis signals + `both` basis signals at 1.0 perfect
    calibration in training (LL4 §3.1) — classical rules carry signal in this
    corpus.
  - temporal_engine basis signals at 0.43 in training — variance carrier,
    weaker calibration than classical_rule.

The choice of rubric determines whether LL.7's first output reflects this
empirical-meets-classical structure or breaks from it.

### §1.3 — Three options

**Option A — Pure empirical.**
- LL.7 surfaces only co-activation patterns with N≥5 in the training partition.
- No classical-knowledge seeding. CDLM is not consulted at LL.7 compute time.
- Output is a flat list of co-firing signal-pairs and signal-clusters above
  the N=5 threshold, with their training-partition support.
- Threshold rationale: N=5 is above the SHADOW_MODE_PROTOCOL §3 minimum of N≥3
  for promotion; choosing the higher threshold reduces noise at n=37.
- Implementation: scan 37 training event-match records; tabulate co-firings;
  filter to N≥5; emit.

**Option B — Classical-seeded.**
- LL.7 starts from the CDLM (cross-domain linkage map at
  `025_HOLISTIC_SYNTHESIS/CDLM_v1_1.md`) as a base prior.
- Empirical co-activation patterns either:
  - **Confirm** an existing CDLM edge → `support: confirmed` + per-edge
    confirmation count.
  - **Contradict** a CDLM edge → `support: contradicted` + per-edge
    contradiction count, flagged for native review.
  - **Augment** a non-CDLM pattern (empirical N≥5 + no classical articulation)
    → `support: novel_candidate`, flagged for native review.
- CDLM edges with no empirical support → `support: classical_only`, retained
  in the prior with classical-only tag.
- Implementation: read CDLM edges as base prior; cross-walk against 37 training
  events; tag each edge by support class; emit.

**Option C — Discovery-first.**
- LL.7 surfaces all co-activation patterns above an N threshold (TBD at S3
  entry; default N≥3 from SHADOW_MODE_PROTOCOL §3) WITH NO classical filter
  applied at compute time.
- CDLM is consulted only post-hoc, for *interpretation* of surfaced patterns,
  not as a pre-filter.
- Output is a flat list of co-firing patterns above threshold, with optional
  per-pattern post-hoc CDLM-cross-reference in a separate column.
- Implementation: scan training events; tabulate co-firings; filter to N≥3;
  emit with optional CDLM cross-reference column populated post-hoc.

---

## §2 — Recommendation

### §2.1 — Claude recommends Option B (classical-seeded).

The recommendation is grounded in four axes:

#### §2.1.A — Learning discipline rule #1

`MACRO_PLAN §Learning Layer rule #1` — "priors locked; learning modulates,
never overwrites." Option B is the structural implementation of this rule for
LL.7. CDLM is the locked prior; empirical co-activation modulates by tagging
edges as `confirmed` / `contradicted` / `classical_only` / `novel_candidate`.
The classical knowledge is preserved; the learned signal *augments* the prior
without overwriting it.

Option C accepts the rule in spirit (CDLM is consulted post-hoc, not
overwritten) but sequences classical priors *after* the discovery output —
which structurally puts the empirical signal in the lead position. At n=37
with the dominant Pancha-MP clique pattern, this risks the LL.7 output reading
as "the chart is mostly Pancha-Mahapurusha co-firings" — a finding that is
true but is also a sample-shape artifact, not a discovery.

Option A respects rule #1 by setting CDLM aside entirely — but in doing so,
forfeits the empirical confirmation already present (8 MED-tier CDLM edges
confirmed in training; LL3 §4.1).

#### §2.1.B — n=1 risk

n=37 events + the dominant Pancha-MP clique mean that pure empirical (Option A)
produces a very thin output. LL3 §4 found 8 MED-tier edges; the rest of the
co-activation space at N≥5 is dominated by within-clique edges. Option A's
output at LL.7 would be ~10-15 surfaced patterns, most of which are intra-
clique — adding little discovery beyond what MSR + CDLM already say.

Option B uses CDLM as scaffolding so LL.7 surfaces structure that MSR + CDLM
already know AND empirical confirmation/contradiction status — a layered
output, not a sparse one. This matches the M4 acceptance criterion that the
Learning Layer's first calibration cycle produces *useful* discovery output,
not just *true* discovery output.

#### §2.1.C — LL3 finding alignment

LL3_DOMAIN_COHERENCE §4 found 8 MED-tier CDLM edges with empirical confirmation
already. Option B operationalizes this finding directly — those 8 edges become
the `support: confirmed` set at LL.7 compute time. The `support: novel_candidate`
class is the discovery surface — empirical patterns absent from CDLM that meet
N≥5 — and is flagged for native review per Option B's algorithm.

This produces a four-class output (confirmed / contradicted / classical_only /
novel_candidate) that surfaces both classical and empirical evidence
side-by-side, with the discovery weight where it earns it (novel_candidate).

#### §2.1.D — LL4 finding alignment

LL4_PREDICTION_PRIOR §3.1 found classical_rule basis signals at 1.0 perfect
calibration in training (n=29) — classical rules carry signal in this corpus.
Option B respects this by seeding LL.7 with the classical structure (CDLM)
that produces classical_rule signals; empirical confirmation strengthens
(rather than displaces) the classical prior.

LL4 §5.1 already named "classical-rule + both bases" as the *strong prior*
tier for LL.5/LL.6. Option B applies the analogous logic to LL.7.

### §2.2 — Trade-off acknowledgment

Option B has costs:
- **More implementation work.** Reading CDLM at compute time + cross-walk
  against training co-firings is more code than Option A's flat tabulation
  or Option C's post-hoc cross-reference column. (Estimated: 2 substantive
  M4-C-S3 sessions vs 1 for Option A or C.)
- **Risk of over-fitting to CDLM.** If CDLM has gaps that the empirical
  evidence would surface but Option B's CDLM-as-base-prior structure does not
  surface, those gaps remain hidden until M5 / M7. Mitigation: Option B's
  `support: novel_candidate` class IS the surface for non-CDLM empirical
  patterns; the CDLM-as-base-prior structure does not suppress them.

### §2.3 — Why not Option C even at n=37

Option C's "all co-activation above threshold" output at n=37 is dominated by
the Pancha-MP clique. The post-hoc CDLM cross-reference column would label
most of those edges as classically-known — at which point the output is
indistinguishable from Option B's `support: confirmed` class plus a redundant
flat list.

Option C is structurally more appropriate at cohort scale (M7+) where the
discovery threshold rises and the underlying co-activation distribution
contains true novel patterns. At native-only scale (M4-C), Option B's seeded
structure produces stronger discovery output for the same n.

### §2.4 — Why not Option A even when cleanest

Option A's "no classical seed" at n=37 forfeits the 8 MED-tier CDLM edges
already empirically confirmed (LL3 §4.1). Those 8 edges represent the strongest
empirical evidence in the training partition; setting CDLM aside discards the
classical structure that the data confirms. Option B retains the structure and
augments with the empirical confirmation count.

Option A is structurally appropriate when no classical prior exists for the
discovery space — but for Jyotish at M4, MSR + CDLM are exactly the locked
prior the Learning Layer is designed to modulate. Setting them aside would
contradict §LL-Appendix.D ownership rule (native introduces weight-update
rubric; the rubric IS the classical prior).

---

## §3 — Decision template

The native replies with one of:

```
NAP.M4.6 verdict: Option A
Rationale (optional, ≤200 chars): <text>
```

```
NAP.M4.6 verdict: Option B
Rationale (optional, ≤200 chars): <text>
```

```
NAP.M4.6 verdict: Option C
Rationale (optional, ≤200 chars): <text>
```

The native may also:
- **Request a hybrid.** "Option B + Option C `novel_candidate` threshold reduced
  to N≥3" — this is acceptable; record the hybrid specification verbatim.
- **Request more information.** "Defer until <X>" — this is acceptable; M4-C-S3
  does not open until the verdict is in.
- **Reject all three options.** "None — re-author with <constraint>" — this
  re-opens NAP.M4.6 with a v1.1 brief reflecting the constraint.

The verdict is recorded in:
1. SESSION_LOG NAP-decisions append entry of the session that observes the
   verdict.
2. The frontmatter of `06_LEARNING_LAYER/discovery_priors/native_priors_M4C_v1_0.json`
   when M4-C-S3 first writes the artifact (`nap_m4_6_verdict: Option <X>`).
3. This brief's status field flipped `PENDING_NATIVE_DECISION` →
   `<X>_APPROVED`, with a v1.1 changelog entry recording the decision date and
   session.

---

## §4 — Downstream consequences of each option

### §4.1 — If Option A (pure empirical)

**Algorithm at M4-C-S3.**
- Scan 37 training event-match records.
- Tabulate signal co-firings per event.
- Filter to pairs / clusters with N≥5 events of co-firing.
- Emit a flat list to `native_priors_M4C_v1_0.json`.

**Expected output shape.** 10–15 surfaced patterns; most intra-Pancha-MP
clique edges. Cross-domain edges absent per LL3 §4 finding.

**LL.7 effort estimate.** 1 substantive M4-C-S3 session.

**M4-D / M5 implications.**
- LL.5 ranker would not consume LL.7 priors heavily (thin output).
- LL.7 output reads as a confirmation surface, not a discovery surface.
- M5 LL.7 cohort-mode design starts from a lower-information native-only
  baseline.

**Risk.** Forfeits the 8 MED-tier CDLM-confirmed edges (LL3 §4.1) by not
seeding CDLM. May read as "M4-C produced very little new" at sub-phase
close.

### §4.2 — If Option B (classical-seeded — Claude's recommendation)

**Algorithm at M4-C-S3.**
- Read CDLM cross-domain linkage map (`025_HOLISTIC_SYNTHESIS/CDLM_v1_1.md`)
  as the base prior. Each CDLM edge becomes a row with default
  `support: classical_only`.
- Cross-walk training events against CDLM edges:
  - If a CDLM edge has empirical co-firings in N≥5 training events →
    `support: confirmed` + per-edge confirmation count.
  - If a CDLM edge has co-firings AND a contradiction signal (e.g., domain
    mismatch flagged in LL3 §3.2) → `support: contradicted`.
- Add a `novel_candidate` class for empirical patterns (N≥5) absent from
  CDLM. Each novel_candidate edge is flagged for native review.
- Emit four-class output to `native_priors_M4C_v1_0.json`.

**Expected output shape.**
- ~30–60 `classical_only` edges (CDLM full inventory minus the confirmed
  subset; exact count depends on CDLM cardinality).
- 8 `confirmed` edges (LL3 §4.1 MED-tier).
- 0–3 `contradicted` edges (LL3 §3.2 found 0 mismatch flags structurally;
  contradicted may be empty).
- ~5–15 `novel_candidate` edges (intra-clique non-CDLM patterns; exact count
  depends on clique-edge cross-reference against CDLM).

**LL.7 effort estimate.** 2 substantive M4-C-S3 sessions (CDLM cross-walk +
novel-candidate cataloguing).

**M4-D / M5 implications.**
- LL.5 ranker consumes LL.7 priors structurally (CDLM-as-prior structure
  matches LL3 §5.1 R.LL3.1-3 retrieval recommendations).
- LL.7 output reads as a layered confirmation + discovery surface.
- M5 LL.7 cohort-mode inherits the four-class schema; cohort evidence
  modulates the same classes.

**Risk.** Higher implementation cost; risk of CDLM-shaped discovery (Option
B's `novel_candidate` class IS the mitigation).

### §4.3 — If Option C (discovery-first)

**Algorithm at M4-C-S3.**
- Scan 37 training event-match records.
- Tabulate signal co-firings per event.
- Filter to pairs / clusters with N≥3 (or higher TBD threshold).
- Emit flat list to `native_priors_M4C_v1_0.json`.
- Add post-hoc CDLM-cross-reference column populated by lookup against
  `025_HOLISTIC_SYNTHESIS/CDLM_v1_1.md`.

**Expected output shape.** ~20–40 surfaced patterns at N≥3; ~10–15 at N≥5.
Most are intra-clique.

**LL.7 effort estimate.** 1 substantive M4-C-S3 session.

**M4-D / M5 implications.**
- LL.5 ranker consumes LL.7 priors as a flat list — less structurally
  integrated with CDLM than Option B.
- LL.7 output reads as a discovery surface with classical interpretation as
  metadata.
- M5 LL.7 cohort-mode appropriate fit — cohort scale justifies discovery-first.

**Risk.** At native-only n=37, the output may be indistinguishable from
Option B's `support: confirmed` class plus redundant rows; the post-hoc CDLM
column makes this visible but does not change the output shape.

### §4.4 — Effort comparison

| Option | M4-C-S3 sessions | LL.7 algorithm complexity | Output integration with LL.5 / LL.6 |
|---|---|---|---|
| A | 1 | Lowest | Thin |
| B (recommended) | 2 | Highest | Strongest |
| C | 1 | Medium | Medium |

---

## §5 — Changelog

- **v1.0 (2026-05-02, M4-B-P5-M4C-ENTRY-PREP):** Initial brief.
  - §1 What NAP.M4.6 decides — context (LL.7 native-only mode); why the rubric
    matters (n=1 risk + discipline rule #1 + LL3/LL4 findings); three options
    (A pure empirical / B classical-seeded / C discovery-first) presented
    structurally.
  - §2 Recommendation — Option B, grounded in (a) discipline rule #1; (b) n=1
    risk + Pancha-MP clique sample shape; (c) LL3 §4 8 MED-tier CDLM edges
    confirmed; (d) LL4 §3.1 classical_rule basis at 1.0 calibration. Trade-off
    acknowledgment + reasoning against Options A + C at native-only scale.
  - §3 Decision template — verdict + optional ≤200-char rationale; record
    locations.
  - §4 Downstream consequences — algorithm path, expected output shape, M4-C-S3
    effort estimate, M4-D/M5 implications for each option; effort comparison
    table.
  - §5 Changelog (this entry).

  Authored alongside `00_ARCHITECTURE/PHASE_M4C_PLAN_v1_0.md` (M4-C execution
  plan) under brief `M4-B-P5-M4C-ENTRY-PREP` (parallel governance slot).

  Status: PENDING_NATIVE_DECISION until verdict issued.

---

*End of NAP_M4_6_BRIEF_v1_0.md. Awaiting native verdict per §3 Decision
template. M4-C-S3 (LL.7 first artifact write) does not open until the verdict
is recorded in SESSION_LOG.*
