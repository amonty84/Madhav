---
artifact: 06_LEARNING_LAYER/SHADOW_MODE_PROTOCOL_v1_0.md
version: "1.0"
status: APPROVED
native_approval_point: NAP.M4.4 (§3 Promotion criteria — APPROVED 2026-05-02 as written)
native_approved_on: 2026-05-02
native_approved_in_session: M4-A-S2-T3-SHADOW-PROTOCOL (NAP-decisions append)
produced_during: M4-A-S2-T3-SHADOW-PROTOCOL
produced_on: 2026-05-02
governs: LL.1 through LL.7 (M4-B and M4-C shadow registers)
authoritative_spec: 00_ARCHITECTURE/MACRO_PLAN_v2_0.md §LL-Appendix.B + §3.5.A Principle 1
parent_phase_plan: 00_ARCHITECTURE/PHASE_M4_PLAN_v1_0.md §3.2 (M4-B entry gate)
related_acceptance_criteria: AC.M4B.2, AC.M4B.6, AC.M4B.7, AC.M4B.9
---

# SHADOW_MODE_PROTOCOL — Per-mechanism shadow-to-production discipline for the Learning Layer

```
STATUS: 1.0 — APPROVED 2026-05-02 (NAP.M4.4 APPROVED — §3 as written).
This document is the gate for every weight write in M4-B and M4-C.
M4-B weight writes may begin once M4-A closes (event-match records exist;
held-out partition identified). Promotion criteria in §3 are now binding.
```

---

## §1 — Purpose and scope

Shadow mode is the discipline that separates an *observation* of a learned parameter
from an *application* of that parameter to downstream system behavior. Every Learning
Layer mechanism that produces a per-signal, per-edge, or per-prior weight first writes
that weight to a shadow register; the weight does not influence retrieval, synthesis,
ranking, or discovery output until it has passed an explicit promotion check and is
copied to a production register. This exists because n=1 calibration carries the
dominant statistical risk of overfit (`MACRO_PLAN_v2_0.md §3.5.A Principle 1` — "with a
single native, overfit is the dominant statistical risk, not underfit"); shadow mode is
the structural defense, not a procedural nicety. It governs LL.1 (signal weight
calibration), LL.2 (graph edge weight learning), LL.3 (embedding space adaptation,
where applicable), and LL.4 (prompt optimization) at M4-B; LL.5 (retrieval ranking),
LL.6 (plan selection), and LL.7 (discovery prior shaping, native-only mode) at M4-C.
LL.8 is at SCAFFOLD only at M4 and does not produce shadow weights until M5; LL.9 and
LL.10 are out of scope for this protocol version (M5+ and M7+ activation respectively).

---

## §2 — Per-mechanism shadow registers (M4 scope)

| Mechanism | Shadow path | Production path | Activation phase | Notes |
|---|---|---|---|---|
| LL.1 — Signal weight calibration | `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/signal_weights/shadow/` | `06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/signal_weights/production/` | M4-B | Per-signal weights keyed by `signal_id` (MSR signal ID, e.g. `SIG.MSR.001`). Primary mechanism — its stability is a hard gate for LL.2 writes. |
| LL.2 — Graph edge weight modulators | `06_LEARNING_LAYER/GRAPH_EDGE_WEIGHT_LEARNING/edge_modulators/shadow/` | `06_LEARNING_LAYER/GRAPH_EDGE_WEIGHT_LEARNING/edge_modulators/production/` | M4-B (after LL.1 stable) | Per-edge modulators keyed by edge ID (CGM edge or pair `(signal_a, signal_b)`). LL.1 stability gate is documented in SESSION_LOG before first LL.2 shadow write per `PHASE_M4_PLAN §3.2 AC.M4B.3`. |
| LL.3 — Embedding space adaptation | n/a (document only at M4-B) | n/a (re-index requires native approval) | M4-B | LL.3 output at the first calibration cycle is `06_LEARNING_LAYER/EMBEDDING_SPACE_ADAPTATION/adaptation_notes_M4B_v1_0.md` — a structured recommendation document, not an adapter weight artifact. No shadow/production split applies until adapters are emitted (M5+). Embedding re-indexing is a separate native-approval point. |
| LL.4 — Prompt optimization | n/a (document only at M4-B) | n/a (amendments ship via feature flag) | M4-B | LL.4 output at M4-B is `06_LEARNING_LAYER/PROMPT_OPTIMIZATION/prompt_opt_record_M4B_v1_0.md` recording proposed amendments. Amendment landing is gated by feature flag, not by shadow/production register split. The flag ramp is the analog of promotion. |
| LL.5 — Retrieval ranking learning | `06_LEARNING_LAYER/RANKER_WEIGHTS/shadow/` | `06_LEARNING_LAYER/RANKER_WEIGHTS/production/` | M4-C | Ranker weights modulate retrieval pipeline ordering. Production register only after LL.3 stability gate + held-out probe passes per kill-switch §4.b. |
| LL.6 — Plan selection learning | `06_LEARNING_LAYER/PLAN_SELECTION/shadow/` | `06_LEARNING_LAYER/PLAN_SELECTION/production/` | M4-C | Plan-selector weights keyed by `(query_type, chart_context_class)`. Production register only after LL.4 stability + held-out plan-selection probe per kill-switch §4.b. |
| LL.7 — Discovery prior shaping (native-only mode) | `06_LEARNING_LAYER/discovery_priors/native_priors_M4C_v1_0.json` (single artifact) | n/a | M4-C | LL.7 native-only mode is a single native-approved artifact, not a shadow→production register split. The native IS the gate — every prior modification requires explicit native sign-off per `MACRO_PLAN §LL-Appendix.D` ownership rule. Cohort mode (M7) is out of scope here. |

**Path-creation discipline.** No directory in this table is created in this M4-A
session. LL.1 and LL.2 shadow directories are created only at the first M4-B-S1 weight
write, after §3 promotion criteria are native-approved. LL.5 and LL.6 directories are
created at M4-C-S1. The protocol document itself does not pre-build any register.

---

## §3 — Promotion criteria (NAP.M4.4 — native approval point)

> **APPROVED 2026-05-02 (NAP.M4.4 — §3 as written).** Native ruling recorded in
> `SESSION_LOG.md` at the M4-A-S2-T3-SHADOW-PROTOCOL NAP-decisions append entry.
> The criteria below are now binding for all M4-B and M4-C weight writes. M4-B-S1
> may proceed with the LL.1 shadow register write under these criteria; promotion
> to `signal_weights/production/` requires §3.1 (a)–(d) AND §3.2 validity margin
> ≥ 0.4 simultaneously satisfied.

### §3.1 — LL.1 promotion criteria (primary mechanism)

A per-signal weight is promoted from `signal_weights/shadow/` to
`signal_weights/production/` when **all** of the following conditions hold:

- **(a) N_observations ≥ 3.** The signal must have appeared in the
  `expected_lit_signals` list of at least 3 distinct training-partition LEL
  event-match records. (Default per `MACRO_PLAN §LL-Appendix.B` Learning Layer
  discipline rule #3 — "every parameter update requires ≥N independent observations
  where N is per-mechanism-defined; N defaults to 3; never less than 3.")
- **(b) match_rate variance across those N observations ≤ 0.3.** Per-event match_rate
  for the signal across its N training observations must show variance ≤ 0.3 on the
  [0.0, 1.0] match_rate scale defined in `CALIBRATION_RUBRIC_v1_0.md`. This filters
  signals that fire consistently from signals that fire randomly. Random firing leaves
  high variance; reliable firing leaves low variance.
- **(c) Two-pass approval recorded.** Claude has issued an initial weight record in
  `signal_weights/shadow/` AND Gemini has reviewed the record in the red-team cadence
  per `MACRO_PLAN §LL-Appendix.D` ownership rule (Claude scaffolds; Gemini red-teams
  every third session and at every macro-phase close). Both approvals are recorded in
  the weight record's `approval_chain` field.
- **(d) Native notified, no hold.** The native has been notified of the first batch of
  promotions in a SESSION_LOG entry referencing the batch and has not issued an
  explicit hold instruction. Subsequent batches inherit the no-hold default unless
  native intervenes.

### §3.2 — LL.1 validity margin (provisional-validity threshold)

A signal's weight is considered **provisionally valid** for promotion only if its
`match_rate` (mean across the N training observations) is ≥ 0.4. That is:

- match_rate ≥ 0.4 AND criteria (a)–(d) above satisfied → promote shadow → production.
- match_rate ≥ 0.4 AND criterion (a)–(d) NOT yet satisfied → remain shadow; eligible
  for promotion when (a)–(d) become satisfied.
- match_rate < 0.4 → **shadow-only indefinitely.** Such signals are flagged for
  re-evaluation at the 80-event LEL milestone (M5+ scope per `MACRO_PLAN §M4 Risks
  (d)` second-pass calibration). They are not promoted regardless of N or variance.

The 0.4 threshold encodes the proposition "a signal must light at least two-fifths of
the time it is expected to light, in order to qualify as a calibrated signal at n=1."
Lower thresholds invite false-positive promotion; higher thresholds risk excluding
real signals whose match_rate is suppressed by LEL chronological gaps or by D9-chart
verification ambiguity (see DIS.009 / `JH_EXPORT_DISPOSITION_v1_0.md`).

### §3.3 — Signals with N < 3 in the training partition

Such signals **remain shadow indefinitely**. They are flagged in the
`signal_weights/shadow/` register with `n_observations: <3` and
`status: insufficient_observations`. They are re-evaluated at the 80-event LEL
milestone (M5+ scope) when the corpus has grown enough to lift them above the N=3
floor or to reaffirm them as low-frequency.

### §3.4 — n=1 validity margin applies to ALL outputs

Regardless of promotion status, every signal weight (shadow or production) carries the
n=1 validity disclaimer per §7. Promotion does not lift the disclaimer; it lifts only
the structural barrier between observation and downstream effect.

### §3.5 — LL.2, LL.5, LL.6 promotion criteria

For LL.2 edge modulators, LL.5 ranker weights, and LL.6 plan selectors, the same
N≥3 + variance ≤ 0.3 + two-pass approval + native-no-hold structure applies, with the
following per-mechanism additions:

- **LL.2** also requires its parent LL.1 weights for both endpoint signals to be in
  the production register. An edge modulator cannot promote ahead of its endpoints.
- **LL.5** also requires LL.3 stability per its dependency declared in
  `MACRO_PLAN §LL-Appendix.B LL.5`.
- **LL.6** also requires LL.4 stability per its dependency declared in
  `MACRO_PLAN §LL-Appendix.B LL.6`.

LL.7 (native-only mode) has no shadow-promotion split; native sign-off is the gate per
§2 above.

---

## §4 — Kill-switch conditions

All shadow writes pause and no promotion proceeds if ANY of the following conditions
hold. Kill-switch state is recorded in `SESSION_LOG.md` at the moment it triggers.

- **(a) Held-out calibration validity test fails tolerance.** The M4-C held-out
  partition test (`PHASE_M4_PLAN §3.3 AC.M4C.5`,
  `00_ARCHITECTURE/EVAL/CALIBRATION_VALIDITY_TEST_M4C_v1_0.md`) fails its declared
  per-signal calibration error tolerance. Per `MACRO_PLAN §LL-Appendix.B LL.1`
  kill-switch: "suspended if per-signal calibration error rate worsens over a rolling
  window of N updates."
- **(b) Native issues explicit halt instruction.** Native intervention in
  `SESSION_LOG.md` or in a Cowork thread halts all promotions until native rescinds.
  No precondition is required for native invocation of (b).
- **(c) LEL version change materially shifts match_rates.** A new LEL minor version
  (e.g., v1.5 → v1.6) that adds events and re-runs event-match records produces a
  match_rate delta exceeding 0.15 absolute on any already-promoted signal. The
  affected signals revert to shadow pending re-evaluation; the kill-switch lifts only
  after the re-run yields stable match_rates.
- **(d) Open DISAGREEMENT_REGISTER calibration entry.** Any
  `DIS.class.calibration_methodology` or analogous open DIS entry that flags a
  methodological concern in the calibration rubric or shadow-mode protocol itself
  triggers kill-switch until the entry is resolved per
  `GOVERNANCE_INTEGRITY_PROTOCOL §K`.
- **(e) Learning-discipline rule violation.** Per `MACRO_PLAN §LL-Appendix.B LL.1`
  global kill-switch clause: "suspended globally if any learning-discipline rule (#1
  priors-locked in particular) is flagged as violated." A red-team finding of
  classical-prior overwrite (rule #1) freezes all shadow operations until remediated.

---

## §5 — Reversal protocol

If a production weight is found to be incorrect after promotion:

1. **Revert.** The production weight file (or relevant entry within it) is reverted
   to the previous version using `git` history. The shadow register retains the
   original observation; only the production copy is reverted.
2. **Open a DIS entry.** A `DIS.class.calibration_methodology` entry is opened in
   `00_ARCHITECTURE/DISAGREEMENT_REGISTER_v1_0.md` per `GOVERNANCE_INTEGRITY_PROTOCOL
   §K.1` taxonomy (or a new sub-class if none of the existing five fits — log the
   sub-class proposal in the entry).
3. **Re-run match records.** The affected signal's event-match records are re-run
   under corrected data (e.g., corrected D9 chart state, corrected MSR mapping,
   corrected rubric application). The shadow register receives the new match records;
   no promotion happens automatically.
4. **Native re-approval required.** Re-promotion requires explicit native sign-off,
   recorded in `SESSION_LOG.md`. The default is NOT to re-promote until native
   reviews; the reversal is treated as evidence that the signal needs scrutiny.
5. **Audit trail preserved.** The reverted production version, the DIS entry, the
   re-run records, and the native re-approval (or rejection) form a chain in the
   weight's audit history. No audit-chain entry is deleted.

---

## §6 — Audit trail requirements

Every weight write records the following in the weight record's metadata block (JSON
or YAML, depending on register format):

- `computation_session` — the session ID that produced the write (e.g.
  `M4-B-S1-LL1-WEIGHT-BATCH-1`).
- `computation_date` — ISO date of the write.
- `event_ids_used` — list of LEL `event_id` values consumed (the N observations).
- `match_rate_per_event` — list of per-event match_rate values for those N events.
- `match_rate_mean` — mean across the N values.
- `match_rate_variance` — variance across the N values.
- `n_observations` — count = length of `event_ids_used`.
- `partition` — `training` (always at M4-B; `held_out` events are never used to
  produce training weights per Learning discipline #4).
- `rubric_version` — version of `CALIBRATION_RUBRIC_v1_0.md` cited for the match-rate
  computation.
- `approval_chain` — list of approvals: `{ role: claude, timestamp, session_id }`,
  `{ role: gemini, timestamp, session_id, verdict }`, `{ role: native, timestamp,
  session_id, verdict | notification_only }`.
- `promotion_status` — `shadow` | `eligible_for_promotion` | `promoted` |
  `held_indefinite` | `reverted`.
- `promotion_session` — set when promoted; the session in which the production copy
  was written.
- `kill_switch_state` — `clear` | `triggered_by_(a|b|c|d|e)` per §4.

Every batch write is referenced in a `SESSION_LOG.md` entry by batch ID + count of
weights touched + promotion verdicts. No batch lands without a corresponding
SESSION_LOG entry per `PHASE_M4_PLAN §3.2 AC.M4B.8`.

---

## §7 — n=1 validity disclaimer (mandatory on all outputs)

The following text MUST appear verbatim in:

- The header of every LL.1 weight register file (shadow and production).
- The header of every LL.2/LL.5/LL.6 register file.
- The header of every LL.3 adaptation note and LL.4 prompt-opt record.
- The header of `discovery_priors/native_priors_M4C_v1_0.json` (LL.7).
- Any synthesis output, retrieval-result rendering, or chat-surface response that
  cites a calibrated weight by signal ID or that quantitatively reflects a calibrated
  weight in its phrasing.

```
VALIDITY NOTICE: These calibration weights are derived from a single native's (n=1)
life event corpus. They are provisional, subject to revision as the corpus grows, and
must not be interpreted as universal Jyotish signal weights. Per MACRO_PLAN §3.5.A
Principle 1 — n=1 validity disclaimer.
```

The disclaimer is non-removable. It travels with the weight from shadow through
production. Promotion does not constitute validation in the population sense; it
constitutes structural admission of the weight to downstream pipeline operation,
under continued n=1 disclosure, until a cohort calibration pass at M7+ retires the
n=1 caveat for cohort-validated signals.

---

## §8 — Approval ledger

| Approval | Required at | Status | Approved by | Approved on | Reference |
|---|---|---|---|---|---|
| §3 promotion criteria (NAP.M4.4) | Before first M4-B-S1 weight write | APPROVED | native | 2026-05-02 | This document §3 |
| §3.2 validity margin (≥0.4 match_rate) | Bundled with §3 promotion criteria | APPROVED | native | 2026-05-02 | This document §3.2 |
| §4 kill-switch list adequacy | Before first weight write | APPROVED | native | 2026-05-02 | This document §4 |
| §7 disclaimer text exact wording | Before first weight write | APPROVED | native | 2026-05-02 | This document §7 |

NAP.M4.4 ruling: APPROVED — §3 as written. M4-B weight writes may begin once
M4-A closes. Native approval recorded in `SESSION_LOG.md`
M4-A-S2-T3-SHADOW-PROTOCOL NAP-decisions entry (2026-05-02).

---

## §9 — Changelog

- **v1.0-DRAFT (2026-05-02, M4-A-S2-T3-SHADOW-PROTOCOL):** Initial DRAFT authored at
  M4-A close stretch; deliverable for AC.M4B.6 prerequisite + NAP.M4.4 native review.
  §3 promotion criteria PROPOSED — awaiting native approval before first M4-B weight
  write.
- **v1.0 (2026-05-02, M4-A-S2-T3-SHADOW-PROTOCOL NAP-decisions append):** NAP.M4.4
  APPROVED — §3 as written. Status flipped DRAFT → APPROVED. §8 approval ledger
  rows flipped PENDING → APPROVED. §3 PROPOSED banner replaced with binding-criteria
  banner. M4-B weight writes unblocked.

---

*End of SHADOW_MODE_PROTOCOL_v1_0.md. Document is gating for every weight write
in M4-B and M4-C; §3 promotion criteria are now binding (NAP.M4.4 APPROVED 2026-05-02).*
