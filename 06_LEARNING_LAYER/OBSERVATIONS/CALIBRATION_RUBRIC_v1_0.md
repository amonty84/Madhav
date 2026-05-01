---
artifact: 06_LEARNING_LAYER/OBSERVATIONS/CALIBRATION_RUBRIC_v1_0.md
version: 1.0-DRAFT
status: AWAITING_NATIVE_APPROVAL
native_approval_point: NAP.M4.1 (PHASE_M4_PLAN v1.0 §5)
produced_during: M4-A-T3-RUBRIC-SCHEMA
produced_on: 2026-05-01
parent_phase_plan: 00_ARCHITECTURE/PHASE_M4_PLAN_v1_0.md §3.1 (M4-A — LEL Ground-Truth Spine)
parent_acceptance_criteria: AC.M4A.2 + AC.M4A.3
mechanism: LL.1 Signal Weight Calibration (MACRO_PLAN_v2_0.md §LL-Appendix.B LL.1)
consumers:
  - 06_LEARNING_LAYER/OBSERVATIONS/lel_event_match_records.json (every record cites rubric_version)
  - 06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/signal_weights/ (M4-B writes derive from match_rate scored under this rubric)
  - 06_LEARNING_LAYER/OBSERVATIONS/lel_event_match_records_schema.json (rubric_version field references this file)
changelog:
  - v1.0-DRAFT (2026-05-01, M4-A-T3-RUBRIC-SCHEMA): Initial proposal. Three options (A, B, C) with tradeoffs and worked examples against EVT.2023.07.XX.01. Recommendation: Option B (graded-proximity). Awaiting native approval at NAP.M4.1.
---

# CALIBRATION SCORING RUBRIC — v1.0-DRAFT

## §1 — Purpose

This document specifies *how* a per-event signal-match score is computed for the
LL.1 Signal Weight Calibration mechanism. Every event-match record in
`06_LEARNING_LAYER/OBSERVATIONS/lel_event_match_records.json` cites a
`rubric_version` pointing to a frozen version of this file. Without an approved
rubric, no event-match record may be written (per PHASE_M4_PLAN §3.1, §5
NAP.M4.1, AC.M4A.3).

The rubric defines, for each LEL event:

1. The **time window** within which a signal counts as "lit" relative to the event date.
2. The **scoring scale** used to convert lit/not-lit (and its proximity) into a numeric `lit_score ∈ [0.0, 1.0]`.
3. The **separation rule** between dasha-level activation (MD/AD/PD) and transit-level activation, when both are observable.
4. The **aggregation rule** that produces a per-event `match_rate` from the per-signal `lit_score` set.

The rubric is a *deterministic* scoring function — given the same inputs it
produces the same outputs. Per `MACRO_PLAN_v2_0.md §LL-Appendix.B LL.1`,
this is the function whose output feeds `signal_weight = f(match_rate, domain_weight, n_observations)`.

## §2 — Three options for the native

The following three options span the design space the native chose to surface
at this approval point. Each option is presented with its tradeoffs and a
worked example against `EVT.2023.07.XX.01` (Marsys Group founded, 2023-07-XX,
month-exact). The known signal stack from `LIFE_EVENT_LOG_v1_2.md §7.2`:
SIG.08 (Lakshmi Yoga), CVG.02 (Jupiter 9L dharma-wealth), SIG.09 (Mercury MD
operational spine), SIG.14 (Sun 10H + AL), RPT.DSH.01 (Triple-Dasha Engine —
Mercury MD/Saturn AD planting → compounding window). Chart state at event:
Vimshottari MD Mercury / AD Jupiter; Yogini Bhadrika/Mercury; Chara Virgo/Virgo;
Sade Sati Cycle 2 Peak Aquarius.

---

### §2.1 — OPTION A — Binary Match

**Definition.** A signal matches if the signal-activator output (per
`signal_activator.py` or equivalent) places that signal in `lit: true` state
within ±30 days of the event date. `lit_score ∈ {0, 1}`. The per-event
aggregation is:

```
match_rate = matched_signals_count / expected_signals_count
```

`expected_signals` is the set named in the LEL event's `retrodictive_match.signals_that_matched`
plus any classical-rule additions surfaced by the temporal substrate.

**Tradeoffs.**

- **(+) Simplicity.** One number per signal; trivially auditable; no scoring-function bugs.
- **(+) Reproducibility.** No floating-point ambiguity; ground truth is `{0, 1}`.
- **(–) Arbitrary window.** ±30 days is a hard cutoff. A signal lit on day 31 is treated identically to a signal that never lit. For events with month-exact dates (most of the 46 LEL events), the choice between ±30 and ±45 silently shifts which events appear "matched."
- **(–) No graduation.** A signal lit *exactly* at the event date scores the same as one lit 29 days away. Loses information.
- **(–) Approximate-date fragility.** The 13 LEL events with `date_confidence: approx_year` or `proxy` cannot be scored coherently — the ±30-day window is meaningless when the event date itself has ±6-month uncertainty.

**Worked example — EVT.2023.07.XX.01 under Option A.**

The event date is 2023-07-XX (month-exact), so the resolution window is the full
month of July 2023. For each expected signal, we ask: was it lit anywhere in
2023-06-15 through 2023-08-15 (±30d around mid-July)?

| Signal | Lit within ±30d? | Reason | lit_score |
|---|---|---|---|
| SIG.08 (Lakshmi Yoga) | yes | Mercury+Jupiter both yoga members; both active in dasha at event date | 1 |
| CVG.02 (Jupiter 9L dharma-wealth) | yes | Vimshottari AD = Jupiter (9L) at event date | 1 |
| SIG.09 (Mercury MD operational spine) | yes | Vimshottari MD = Mercury at event date | 1 |
| SIG.14 (Sun 10H + AL visible authority) | yes (assumed lit; structural-permanent natal signal) | Natal-permanent signal; treated as continuously lit | 1 |
| RPT.DSH.01 (Mercury MD–Saturn AD window) | partial | Mercury MD active; Saturn AD does not begin until 2025-XX. At founding (2023-07), the AD is Jupiter, not Saturn. Under binary, this fails the window. | 0 |

`match_rate = 4 / 5 = 0.80`. The result is brittle: if RPT.DSH.01 is
re-scoped as "the Mercury MD broader window" rather than the specific
Mercury MD–Saturn AD subwindow, the score jumps to 1.00. The same event,
the same signal stack, produces 0.80 or 1.00 depending on how strictly the
RPT-class signal's window is interpreted. Option A surfaces the cliff but
does not provide a graceful way to express "partially lit."

---

### §2.2 — OPTION B — Graded Proximity Match (Claude's recommended baseline)

**Definition.** A signal's `lit_score` is a graded function of how close to
the event date its activation occurred:

| Proximity to event date | lit_score |
|---|---|
| Lit *exactly* at event date (signal active and chart state confirms) | 1.0 |
| Lit within ±7 days | 0.7 |
| Lit within ±30 days | 0.5 |
| Lit within ±90 days | 0.2 |
| Not lit within ±90 days | 0.0 |

**Separate scoring axes.** For each expected signal we compute *two* scores:

1. `dasha_score` — proximity of the signal's dasha-level activation (MD, AD, or PD lord matches the signal's principal entity) to the event date.
2. `transit_score` — proximity of the signal's transit-level activation (key transit position, eclipse, retrograde, Sade Sati phase) to the event date.

For natal-permanent signals (e.g., a yoga that exists in the chart from
birth), `dasha_score` is the operative axis — the signal "lights" when its
principal entity is in dasha, not at any specific transit. For
transit-class signals (e.g., a Saturn-Pluto opposition), `transit_score`
is operative.

The signal's combined `lit_score = max(dasha_score, transit_score)` —
*either* axis activating the signal counts as a match. (Native may
override to `mean()` instead of `max()` if both axes are required for a
true match; this is a per-rubric-version parameter.)

**Aggregation.** Per-event:

```
match_rate = sum(lit_score for s in expected_signals) / count(expected_signals)
```

`match_rate ∈ [0.0, 1.0]`. A `match_rate ≥ 0.7` is a "strong" event-level
match; `0.4–0.7` is "partial"; `< 0.4` is "weak."

**Tradeoffs.**

- **(+) Nuance.** Distinguishes a signal lit exactly at the event from one lit ~90 days off. Captures the gradient that the binary cutoff erases.
- **(+) Reproducibility preserved.** The scoring function is fully deterministic; given the same activator output, two scoring runs produce identical numbers.
- **(+) Dasha/transit separation.** Honors the classical distinction between an MD-lord-activates-the-signal pattern and a transit-activates-the-signal pattern. Makes downstream weight calibration interpretable per axis.
- **(+) Approximate-date accommodation.** Events with `date_confidence: approx_month` or `approx_year` use the wider buckets gracefully — a ±90-day window still produces a non-zero score even when the event date is fuzzy.
- **(–) Calibration of the buckets.** The cutoffs (7 / 30 / 90 days) and the scores (1.0 / 0.7 / 0.5 / 0.2 / 0.0) are choices, not derivations. A different bucketing produces different numbers. Trade: rubric_version freezes the choice; future cycles can A/B different bucketings against held-out partition error.
- **(–) Requires a deterministic scoring function.** Implementation cost: a `score_event_match.py` script that consumes activator output + LEL event date and emits per-signal lit_scores. Estimated one-session cost (Claude can author at M4-A-S2 once rubric is approved).

**Worked example — EVT.2023.07.XX.01 under Option B.**

Event date treated as 2023-07-15 (mid-month center for `month-exact` confidence).

| Signal | Type | Dasha proximity | Transit proximity | lit_score |
|---|---|---|---|---|
| SIG.08 (Lakshmi Yoga: Mercury+Jupiter both yoga members) | natal-permanent (dasha-axis) | Mercury MD + Jupiter AD both active *exactly at* event date → 1.0 | n/a (yoga is structural) | **1.0** |
| CVG.02 (Jupiter 9L dharma-wealth) | natal-permanent (dasha-axis) | Jupiter AD active *exactly at* event date → 1.0 | n/a | **1.0** |
| SIG.09 (Mercury MD operational spine) | dasha-class | Mercury MD active *exactly at* event date → 1.0 | n/a | **1.0** |
| SIG.14 (Sun 10H + AL visible authority) | natal-permanent (structural) | Always lit — natal-permanent → 1.0 (or apply cycle-modulator if defined) | n/a | **1.0** |
| RPT.DSH.01 (Mercury MD–Saturn AD compounding window) | dasha-class | Mercury MD ✓ at event; Saturn AD does not begin until 2025-XX (≈18 months away). Under ±90d bucket: lit_score = 0.0 for the AD-component. But the parent RPT.DSH.01 is also satisfiable by "Mercury MD active and Saturn AD upcoming" which is the *planting* phase, not the compounding phase. Treat as a **partial** lit at proximity ≥ ±90d for the Saturn-AD component | n/a | **0.2** (with note: planting-phase activation, not compounding-phase) |

`match_rate = (1.0 + 1.0 + 1.0 + 1.0 + 0.2) / 5 = 4.2 / 5 = **0.84**` — strong match.

Compared to Option A (0.80 or 1.00 depending on interpretation), Option B
records the partial activation of RPT.DSH.01 explicitly: this is a
signal that "is in the right *phase* of the right *engine*, but the
specific subwindow named (Saturn AD) is still 18 months out." That
nuance is exactly what LL.1 weight calibration needs: an
honest 0.84 with a partial-credit signal beats a brittle 1.00 that
silently overweights or a 0.80 that silently underweights.

---

### §2.3 — OPTION C — Domain-Bucket Match

**Definition.** Group MSR signals into life-event domain buckets (one of:
career, health, relationship, finance, spiritual, family, travel,
education, psychological — the same buckets used in the LEL event
schema's `category` field). Score per event:

| Condition | match_score |
|---|---|
| One or more signals from the event's matching domain were lit (under any reasonable proximity, e.g., ±90 days) | 1.0 |
| Only adjacent-domain signals lit (e.g., career-event with finance signals lit) | 0.5 |
| No domain-relevant signal lit | 0.0 |

`match_rate = match_score` (a single number per event, not a per-signal aggregation).

**Tradeoffs.**

- **(+) Coarse but robust.** Insensitive to within-bucket signal ID noise. If the chart says "career-domain signals fire" and the event is a career event, that is a match — regardless of which specific signal IDs lit.
- **(+) Easy to audit.** A non-technical reviewer (acharya, the native, an outside reviewer) can read the result and verify it against intuition.
- **(+) Approximate-date robust.** A wide ±90-day window with a coarse score doesn't penalize approximate dates.
- **(+) Good first-cycle choice.** If many events have approximate dates only and the activator output is still being shaken down, Option C produces meaningful match_rates without amplifying activator noise.
- **(–) Loses signal granularity.** Cannot distinguish "5 career signals lit" from "1 career signal lit" — both score 1.0. LL.1 calibration that depends on per-signal weight then receives less information per event.
- **(–) Domain-mapping fragility.** Many MSR signals are multi-domain (CVG.02 is "career *and* finance *and* relationship *and* family"). Forcing each signal into a single primary bucket is itself a modeling choice that pre-determines part of the answer.
- **(–) Adjacent-domain definition.** Which domain pairs are "adjacent" (career ↔ finance? finance ↔ family?) is itself a rubric choice; gets messy fast.

**Worked example — EVT.2023.07.XX.01 under Option C.**

Event domain: `career` (per LEL `category: career`, `subcategory: entrepreneurship_founded`).

Expected signal stack mapped to primary domains:
- SIG.08 (Lakshmi Yoga) → finance + spiritual
- CVG.02 (Jupiter 9L dharma-wealth) → finance + spiritual
- SIG.09 (Mercury MD operational spine) → career
- SIG.14 (Sun 10H + AL) → career
- RPT.DSH.01 (compounding window) → career + finance

Lit signals at event (per Option B activator output above): SIG.08 (1.0),
CVG.02 (1.0), SIG.09 (1.0), SIG.14 (1.0), RPT.DSH.01 (0.2 partial).

Career-domain signals lit: SIG.09 ✓, SIG.14 ✓, RPT.DSH.01 ✓ (partial).
**At least one career-domain signal lit at ≥ 0.2 within ±90 days → match_score = 1.0.**

The result is robust (the chart fires on the right domain), but the
event-match record carries no information about whether 1 vs 5 signals
lit, or about RPT.DSH.01's partial activation, or about Sade Sati Peak
being concurrent. All of that is collapsed into a single 1.0.

---

## §3 — Scoring decisions that apply across all three options

Regardless of option chosen, the rubric must specify the following. Default
proposals are listed; native overrides at rubric approval are recorded in
the rubric_version frontmatter.

| Decision | Default proposal | Override mechanism |
|---|---|---|
| Event-date center (when `month-exact`) | Mid-month (15th) | Native may specify "first day" or "last day" or per-event override |
| Event-date center (when `approx_year`) | July 1 of the year | Per-event override; flag for elicitation if rubric-sensitive |
| Event-date center (when `proxy`) | Date stated in `date_confidence: proxy date YYYY-MM-DD` | Mandatory per-event override |
| Natal-permanent signal default | `lit_score = 1.0` always (always lit) | May apply Sade Sati / dasha-cycle modulator if native specifies |
| Multi-domain signal mapping (Option C only) | Primary domain only; tie-break: alphabetical first | Native may specify primary-domain assignments per signal |
| Adjacent-domain pairs (Option C only) | career↔finance, finance↔family, health↔psychological, relationship↔family, education↔career, spiritual↔health, travel↔career | Native may revise table |
| Combined dasha/transit aggregator (Option B only) | `max(dasha_score, transit_score)` | Native may specify `mean()` or per-signal-class override |
| Held-out partition exclusion | Held-out events scored same way but their match_rates are **not** consumed by LL.1 weight writes in M4-B | Hard rule per Learning discipline #4 (Holdout sacrosanct) |

## §4 — Recommendation (proposal — native makes the final decision)

**Claude recommends Option B (Graded Proximity Match) as the rubric for the
first M4 calibration cycle.** This is a proposal; the native makes the final
decision at NAP.M4.1.

Rationale (one paragraph): Option A is brittle at its 30-day cliff and
discards the gradient information that distinguishes a signal lit *at* the
event from one lit *near* the event — exactly the gradient that LL.1 needs
to learn meaningful per-signal weights. Option C is robust but discards
per-signal granularity; in a 46-event corpus where the native has already
identified specific multi-signal stacks per event (LEL §7.2), collapsing
to a single domain-match number throws away most of the information the
LEL ground-truth contains. Option B preserves both the per-signal
granularity (each signal gets its own lit_score) and the temporal
gradient (proximity buckets honor "lit exactly at" vs "lit within a
season"); it accommodates the dasha/transit axis split that the
classical Vimshottari/Yogini/transit substrate already produces; and it
degrades gracefully on approximate-date events through its wider ±90-day
bucket. The cost — implementing a deterministic scoring function — is a
one-session deliverable that pays for itself the first time the rubric
is re-run after activator improvements (Option A and C re-runs throw
away exactly the same information; Option B re-runs surface where the
activator changed).

**Suggested fallback if the native prefers a coarser first cycle.**
Option C as the *first* M4 cycle (M4-A-S2/S3 event-match records), with
a planned migration to Option B for the *second* M4 cycle (post-M4-D,
once the activator is shaken down and approximate-date events have been
dispositioned in the chronological-completeness audit). This stages the
complexity: coarse-but-robust first, nuanced-and-granular second.

---

*End of CALIBRATION_RUBRIC_v1_0.md (DRAFT). Awaiting native approval at NAP.M4.1
before any event-match records are written.*
