---
artifact: 00_ARCHITECTURE/EVAL/NAP_M4_5_DOSSIER_v1_0.md
version: "1.0"
status: AWAITING_NATIVE_REVIEW
produced_during: M4-B-P2-NAP-M45-PREP
produced_on: 2026-05-02
session_kind: parallel-slot
nap_id: NAP.M4.5
nap_class: M4-B
binding_gate_for: production promotion of 30 LL.1 signals (pass_2 of two-pass approval per SHADOW_MODE_PROTOCOL §3.1(c))
inputs_consulted:
  - 06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/signal_weights/shadow/ll1_shadow_weights_v1_0.json
  - 06_LEARNING_LAYER/SIGNAL_WEIGHT_CALIBRATION/LL1_TWO_PASS_APPROVAL_v1_0.md
  - 025_HOLISTIC_SYNTHESIS/MSR_v3_0.md (SIG.MSR.118, .119, .143 entries)
review_target_duration: ~20 minutes
n1_disclaimer: |
  All weights derive from a single native (n=1) corpus of 37 training events. They are
  provisional under MACRO_PLAN §3.5.A Principle 1. Production promotion lifts the
  pass_2 structural gate only; the n=1 epistemic disclaimer rides through to every
  downstream consumer.
---

# NAP.M4.5 — Native Spot-Check Dossier (LL.1 Pass-2)

## §1 — Purpose

NAP.M4.5 is the **binding final gate** for promoting 30 LL.1 calibration signals from
`signal_weights/production/ll1_weights_promoted_v1_0.json` (currently
`status: production_pending_pass_2`) to live consumption by the downstream pipeline.
Until the native signs pass_2, the weights are blocked at the structural-gate boundary
named in `SHADOW_MODE_PROTOCOL_v1_0.md §3.1(c)+(d)`.

Pass_1 was discharged at M4-B-S2 by **Claude-surrogate-M4-B-S2** (a flagged stand-in for
Gemini, who was not synchronously available). The surrogate applied the numerical rubric
(N≥3, variance≤0.3, mean_match_rate≥0.4, demotion at mean<0.4 OR variance>0.3) and
recorded **30 approved / 0 held / 0 demoted**. Pass_1 also flagged **3 of the 30 signals**
(SIG.MSR.118, .119, .143 — Tier-C borderline) for closer pass_2 attention because they
share identical descriptive statistics across three distinct signal IDs.

This dossier exists so the native can complete pass_2 in roughly 20 minutes — full
table at §2, focused deep-dive on the 3 flagged signals at §3, decision rules at §4,
fillable verdict template at §5.

---

## §2 — Full signal table (all 30, sorted by mean_match_rate desc)

Re-derived directly from `ll1_shadow_weights_v1_0.json` `signal_weights[*]` entries
where `status == "promotion_eligible_pending_two_pass"`. All 30 entries have
`approval_chain[0].pass_1_decision: "approved"` (uniform pass_1 verdict per
LL1_TWO_PASS_APPROVAL §4).

| # | signal_id | signal_name (from MSR) | domain | N | mean | variance | tier | flag |
|---|---|---|---|---|---|---|---|---|
| 1 | CTR.01 | (LEL semantic-class — career trajectory) | unknown | 5 | 1.0000 | 0.0000 | A | — |
| 2 | CTR.03 | (LEL semantic-class — career trajectory) | unknown | 5 | 1.0000 | 0.0000 | A | — |
| 3 | CVG.02 | (LEL semantic-class — convergence) | unknown | 5 | 1.0000 | 0.0000 | A | — |
| 4 | SIG.01 | (LEL semantic-class — signature) | unknown | 4 | 1.0000 | 0.0000 | A | — |
| 5 | SIG.09 | (LEL semantic-class — signature) | unknown | 5 | 1.0000 | 0.0000 | A | — |
| 6 | SIG.10 | (LEL semantic-class — signature) | unknown | 4 | 1.0000 | 0.0000 | A | — |
| 7 | SIG.12 | (LEL semantic-class — signature) | unknown | 3 | 1.0000 | 0.0000 | A | — |
| 8 | SIG.13 | (LEL semantic-class — signature) | unknown | 4 | 1.0000 | 0.0000 | A | — |
| 9 | SIG.15 | (LEL semantic-class — signature) | unknown | 3 | 1.0000 | 0.0000 | A | — |
| 10 | SIG.MSR.013 | _(consult MSR_v3_0.md — health-domain MSR signal)_ | health | 3 | 1.0000 | 0.0000 | A | — |
| 11 | SIG.MSR.030 | _(consult MSR_v3_0.md — health-domain MSR signal)_ | health | 3 | 1.0000 | 0.0000 | A | — |
| 12 | SIG.MSR.163 | _(consult MSR_v3_0.md — health-domain MSR signal)_ | health | 3 | 1.0000 | 0.0000 | A | — |
| 13 | SIG.MSR.170 | _(consult MSR_v3_0.md — health-domain MSR signal)_ | health | 3 | 1.0000 | 0.0000 | A | — |
| 14 | SIG.MSR.198 | _(consult MSR_v3_0.md — health-domain MSR signal)_ | health | 3 | 1.0000 | 0.0000 | A | — |
| 15 | SIG.MSR.229 | _(consult MSR_v3_0.md — health-domain MSR signal)_ | health | 3 | 1.0000 | 0.0000 | A | — |
| 16 | SIG.MSR.251 | _(consult MSR_v3_0.md — health-domain MSR signal)_ | health | 3 | 1.0000 | 0.0000 | A | — |
| 17 | SIG.MSR.278 | _(consult MSR_v3_0.md — health-domain MSR signal)_ | health | 3 | 1.0000 | 0.0000 | A | — |
| 18 | SIG.MSR.291 | _(consult MSR_v3_0.md — health-domain MSR signal)_ | health | 3 | 1.0000 | 0.0000 | A | — |
| 19 | SIG.MSR.295 | _(consult MSR_v3_0.md — health-domain MSR signal)_ | health | 3 | 1.0000 | 0.0000 | A | — |
| 20 | SIG.MSR.297 | _(consult MSR_v3_0.md — health-domain MSR signal)_ | health | 3 | 1.0000 | 0.0000 | A | — |
| 21 | SIG.MSR.300 | _(consult MSR_v3_0.md — health-domain MSR signal)_ | health | 3 | 1.0000 | 0.0000 | A | — |
| 22 | SIG.MSR.301 | _(consult MSR_v3_0.md — health-domain MSR signal)_ | health | 3 | 1.0000 | 0.0000 | A | — |
| 23 | SIG.MSR.391 | _(consult MSR_v3_0.md — relationship-domain MSR signal)_ | relationship | 3 | 1.0000 | 0.0000 | A | — |
| 24 | SIG.MSR.476 | _(consult MSR_v3_0.md — health-domain MSR signal)_ | health | 3 | 1.0000 | 0.0000 | A | — |
| 25 | SIG.MSR.145 | _(consult MSR_v3_0.md — general-domain MSR signal)_ | general | 11 | 0.9091 | 0.0909 | B | — |
| 26 | RPT.DSH.01 | (LEL semantic-class — dasha repeat pattern) | unknown | 4 | 0.8000 | 0.1600 | B | — |
| 27 | SIG.MSR.402 | _(consult MSR_v3_0.md — general-domain MSR signal)_ | general | 11 | 0.7273 | 0.2182 | B | — |
| 28 | SIG.MSR.118 | Ruchaka Yoga — ABSENT (Mars in Enemy Sign, Not Own/Exalted in Kendra) | general | 11 | 0.4545 | 0.2727 | C | **NAP.M4.5** |
| 29 | SIG.MSR.119 | Malavya Yoga — ABSENT (Venus Not in Own/Exalted in Kendra) | general | 11 | 0.4545 | 0.2727 | C | **NAP.M4.5** |
| 30 | SIG.MSR.143 | Yoga Presence — Sarpa Yoga ABSENT (No Three Serpent Planets in Angles) | general | 11 | 0.4545 | 0.2727 | C | **NAP.M4.5** |

**Tier legend.**

- **Tier A (24 signals).** mean = 1.0, variance = 0.0, N ∈ {3, 4, 5}. Signal fired in
  every observed event in its training subset. Strongest empirical pattern at this n=1
  scale; defended against overfit by the held-out partition (9 events not seen) at the
  M4-C calibration validity test.
- **Tier B (3 signals).** mean ∈ [0.73, 0.91], variance ∈ [0.09, 0.22]. High-reliability
  signals with small per-event tolerance.
- **Tier C (3 signals).** mean = 0.4545, variance = 0.2727. All three fire on ~half
  the observations and share identical aggregate statistics — see §3 deep-dive.

**Domain note.** 11 signals carry `domain: unknown`. This reflects msr_domain_buckets.json
keying by `SIG.MSR.NNN` only; LEL semantic-class IDs (CTR/CVG/SIG.NN/RPT/DSH) fall
through to the `unknown` fallback. Cross-system reconciliation is M4-D scope; not a
defect for this pass.

---

## §3 — Three flagged signals — deep-dive

All three flagged signals are **yoga-absence signals** in the MSR `general` domain. The
pass_1 surrogate-flagged question is whether their identical aggregate statistics
(N=11, mean=0.4545, variance=0.2727) reflect *one underlying phenomenon counted three
times* or *three independent phenomena that happen to land on the same numerical
profile*. This dossier presents the empirical event-overlap that the surrogate did not
have time to surface, plus the Jyotish content from MSR_v3_0.md.

### §3.1 — SIG.MSR.118 — Ruchaka Yoga ABSENT

```yaml
SIG.MSR.118:
  signal_name: "Ruchaka Yoga — ABSENT (Mars in Enemy Sign, Not Own/Exalted in Kendra)"
  signal_type: yoga
  classical_source: "BPHS Ch.26 Sl.1 (Ruchaka: Mars exalted/own-sign in Kendra)"
  entities_involved: [PLN.MARS, HSE.7, SGN.LIBRA]
  strength_score: 0.00
  valence: neutral
  temporal_activation: natal-permanent
  supporting_rules:
    - Ruchaka = Mars in own/exalted sign in Kendra
    - Mars in Libra 7H = enemy sign (not own/exalted) → Ruchaka does NOT form
    - Mars's own signs = Aries (1H) and Scorpio (8H) — neither is Mars's natal position
    - Mars exaltation = Capricorn — Mars is in Libra, not Capricorn
    - Absence of Ruchaka = Mars-Lagnesh express without Mahapurusha amplification
    - Sasha (Saturn) compensates at the Pancha Mahapurusha level
  falsifier: "N/A — factual absence"
  confidence: 0.98
  rpt_deep_dive: "RPT.STR.01.A"
```

**Statistical profile.** N=11, mean_match_rate=0.4545, variance=0.2727, shadow_weight=0.4545.

**Event firing pattern (lit_score=1.0 events):**
EVT.1984.02.05.01 · EVT.2004.XX.XX.02 · EVT.2012.09.XX.01 · EVT.2012.XX.XX.02 · EVT.2013.03.XX.01

### §3.2 — SIG.MSR.119 — Malavya Yoga ABSENT

```yaml
SIG.MSR.119:
  signal_name: "Malavya Yoga — ABSENT (Venus Not in Own/Exalted in Kendra)"
  signal_type: yoga
  classical_source: "BPHS Ch.26 Sl.9 (Malavya: Venus in own/exalted in Kendra)"
  entities_involved: [PLN.VENUS, HSE.9, SGN.SAGITTARIUS]
  strength_score: 0.00
  valence: neutral
  temporal_activation: natal-permanent
  supporting_rules:
    - Malavya = Venus in own/exalted sign in Kendra
    - Venus in Sagittarius 9H = friend's sign (Trikona, not Kendra) → Malavya absent
    - Venus own signs = Taurus (2H) and Libra (7H) — neither is Venus's natal position
    - Venus exaltation = Pisces — Venus is in Sagittarius
    - Absence of Malavya = Venus-MK expressed without Mahapurusha amplification
    - Lakshmi Yoga + Saraswati Yoga partially fill this gap
  falsifier: "N/A — factual absence"
  confidence: 0.97
  rpt_deep_dive: "SIG.MSR.052"
```

**Statistical profile.** N=11, mean_match_rate=0.4545, variance=0.2727, shadow_weight=0.4545.

**Event firing pattern (lit_score=1.0 events):**
EVT.1984.02.05.01 · EVT.2000.XX.XX.01 · EVT.2001.03.XX.01 · EVT.2003.06.XX.01 · EVT.2011.01.XX.01

### §3.3 — SIG.MSR.143 — Sarpa Yoga ABSENT

```yaml
SIG.MSR.143:
  signal_name: "Yoga Presence — Sarpa Yoga ABSENT (No Three Serpent Planets in Angles)"
  signal_type: yoga
  classical_source: "BPHS Ch.22 (Sarpa Yoga: debilitated lords of 1/4/7/10 in angles)"
  entities_involved: [PLN.SATURN, PLN.VENUS, PLN.MOON, PLN.MARS]
  strength_score: 0.00
  valence: neutral
  temporal_activation: natal-permanent
  supporting_rules:
    - Sarpa Yoga = lords of Kendra houses debilitated or in Dusthana in angles
    - 1L Mars in 7H (enemy sign) — potential partial qualifier
    - 4L Moon not debilitated
    - 7L Venus not in Kendra
    - 10L Saturn exalted (opposite of debilitated) = actively prevents Sarpa
    - Sarpa Yoga does NOT form — another auspicious absence
  falsifier: "N/A — factual absence"
  confidence: 0.92
  rpt_deep_dive: "MATRIX_HOUSES §summary"
```

**Statistical profile.** N=11, mean_match_rate=0.4545, variance=0.2727, shadow_weight=0.4545.

**Event firing pattern (lit_score=1.0 events):**
EVT.2000.XX.XX.01 · EVT.2001.03.XX.01 · EVT.2003.06.XX.01 · EVT.2004.XX.XX.02 · EVT.2007.06.XX.02

### §3.4 — Joint-firing question — empirical answer

The 11 training events on which all three signals were observed: 1984.02.05.01,
2000.XX.XX.01, 2001.03.XX.01, 2003.06.XX.01, 2004.XX.XX.02, 2007.06.XX.02,
2011.01.XX.01, 2011.06.XX.01, 2012.09.XX.01, 2012.XX.XX.02, 2013.03.XX.01.

**Per-event firing matrix:**

| event_id | 118 (Ruchaka-abs) | 119 (Malavya-abs) | 143 (Sarpa-abs) |
|---|:---:|:---:|:---:|
| EVT.1984.02.05.01 | ● | ● | — |
| EVT.2000.XX.XX.01 | — | ● | ● |
| EVT.2001.03.XX.01 | — | ● | ● |
| EVT.2003.06.XX.01 | — | ● | ● |
| EVT.2004.XX.XX.02 | ● | — | ● |
| EVT.2007.06.XX.02 | — | — | ● |
| EVT.2011.01.XX.01 | — | ● | — |
| EVT.2011.06.XX.01 | — | — | — |
| EVT.2012.09.XX.01 | ● | — | — |
| EVT.2012.XX.XX.02 | ● | — | — |
| EVT.2013.03.XX.01 | ● | — | — |

**Pairwise overlap.**

| pair | jointly-lit events | count |
|---|---|---|
| 118 ∩ 119 | EVT.1984.02.05.01 | 1 |
| 118 ∩ 143 | EVT.2004.XX.XX.02 | 1 |
| 119 ∩ 143 | EVT.2000.XX.XX.01, EVT.2001.03.XX.01, EVT.2003.06.XX.01 | 3 |
| 118 ∩ 119 ∩ 143 | (none) | 0 |

**Empirical interpretation.** The three signals do **not** fire as a single bundled
phenomenon — there is no event where all three are simultaneously lit, and the largest
pairwise overlap (119 ∩ 143) is 3 of 11. The identical aggregate statistics emerge from
each signal firing on its own ~5/11 subset of largely *different* events. This is the
empirical signature of three *independent* phenomena, not one phenomenon counted thrice.

That said, the empirical answer alone is not the binding answer for pass_2. The native is
better-placed than the surrogate to evaluate the **Jyotish-content question** that
backs the empirical pattern: do Ruchaka-absence, Malavya-absence, and Sarpa-absence
plausibly impinge on *different kinds* of life-events given Abhisek's chart?

### §3.5 — What to look for at NAP.M4.5

1. **Signal-content sanity.** Read each signal's `supporting_rules` block above. For
   each, ask: "would I, as a domain-knowledge reviewer, expect this *absence* to be a
   meaningful predictor of life-event quality at all?"
   - All three are **absences of Pancha-Mahapurusha-class auspicious yogas** (Ruchaka,
     Malavya) plus an absence of an *inauspicious* yoga (Sarpa).
   - A native could reasonably hold that "absence of an inauspicious yoga" (Sarpa)
     should fire on *favorable* events while "absence of an auspicious yoga" (Ruchaka,
     Malavya) should fire on *less-favorable* events. Whether the firing patterns above
     align with that expectation is the pass_2 sanity check.
2. **Firing-pattern coherence.** Look at the lit events for each signal in §3.1–§3.3 and
   ask: "do these events share something a Jyotishi would expect this yoga-absence to
   touch?" For example, Ruchaka-absence (Mars-Mahapurusha missing) might be expected to
   show up on events involving courage/competition/initiative; Malavya-absence (Venus-MP
   missing) on relationship/aesthetic events; Sarpa-absence on events that, if the yoga
   *had* formed, would have been catastrophes averted.
3. **One-phenomenon-or-three test.** §3.4 above shows the pairwise overlap is small. The
   native ratifies the "three independent phenomena" reading by inspecting whether each
   signal's lit-event subset has its own thematic coherence — or contests it if all three
   patterns look like the same kind of event.
4. **Demotion threshold sanity.** Each signal sits 0.054 above the mean threshold (0.4)
   and 0.0273 below the variance threshold (0.3). The native may reasonably take a
   harder line than the surrogate did and demote any signal whose firing pattern looks
   like noise to domain expertise. The protocol allows it; pass_2 is binding.

---

## §4 — Spot-check guide

The native's pass_2 verdict for each of the 30 signals is one of three outcomes. The
downstream consequences of each are mechanical (no negotiation; the protocol is binding):

### §4.1 — `approve`

- Effect: signal moves from `production_pending_pass_2` to fully promoted in
  `signal_weights/production/ll1_weights_promoted_v1_0.json`. Downstream pipeline (M4-C+)
  may consume the signal's weight, with the n=1 disclaimer carried through.
- Use when: the native confirms (or accepts) the signal's Jyotish content matches the
  classified statistical pattern, and has no domain-knowledge objection to acting on it.

### §4.2 — `hold`

- Effect: signal remains in `production_pending_pass_2`. Downstream pipeline does not
  consume it. The signal is re-reviewed at the next LL refresh (M4-D close or scheduled
  re-pass per `SHADOW_MODE_PROTOCOL §5`).
- Use when: the native is uncertain — wants more event observations, wants to compare
  against another reference, or wants to discuss with Gemini before sign-off. `hold` is
  the conservative choice.

### §4.3 — `demote`

- Effect: signal is moved to `shadow_indefinite` status. Not promoted; not consumed.
  The signal can be revisited at LL refresh, but the demotion is recorded in the
  approval_chain audit trail. Demoting a Tier-A signal that pass_1 approved is **a
  valid native outcome** — pass_2 is binding final, and "the surrogate accepted it but
  domain knowledge says no" is exactly the override pass_2 exists to enable.
- Use when: the firing pattern looks like noise / artifact / confound on Jyotish
  inspection, even though the numerical thresholds passed.

### §4.4 — Time estimate

- The 24 Tier-A signals (mean=1.0 var=0.0) are intentionally low-effort to review.
  Spot-check 1–2 of the health-domain MSR signals against MSR_v3_0.md for
  signal-content sanity, and approve-as-batch unless one looks wrong. ~5 minutes.
- The 3 Tier-B signals (Tier-A but with one event of tolerance) — quick visual at the
  signal_id and approve. ~2 minutes.
- The 3 Tier-C flagged signals — §3 deep-dive above is the work; ~12–15 minutes.
- Total: ~20 minutes for a focused pass.

### §4.5 — Honest stakes statement

- The 24 Tier-A signals carry the highest **overfit risk** at n=1 because they fired in
  every observation in their training subset. The held-out validity test at M4-C
  (`SHADOW_MODE_PROTOCOL §5`) is the second-line defense. If a Tier-A signal generalizes
  to the held-out 9 events at M4-C, that is independent confirmation; if it fails, the
  signal is reverted.
- The 3 Tier-C flagged signals carry the lowest aggregate overfit risk (firing only ~half
  the time) but the highest **interpretation risk** — identical statistics could mask
  a coding artifact (e.g., a single rule that incidentally evaluates three signals the
  same way) that the empirical event-overlap analysis at §3.4 is designed to surface.
  Demoting all three is a defensible conservative outcome; approving all three is a
  defensible acceptance of the §3.4 empirical reading.
- A `hold` on any signal **does not block M4-B-S3** (LL.2 shadow writes) per
  `SHADOW_MODE_PROTOCOL §3.5`. LL.2 promotion gates on the *endpoint pair* being in
  production; held signals reduce the LL.2-eligible edge set but do not stop M4-B-S3
  from running.

---

## §5 — Pass_2 decision record (template — native fills)

Native completes one row per signal. The dossier is committed empty; native fills via
direct edit at NAP.M4.5 review time. Filled values feed back into:

- `ll1_weights_promoted_v1_0.json` — `approval_chain[0].pass_2_decision` field per signal,
  flipping `pass_2_status: pending` → `approved` | `held` | `demoted`.
- `LL1_TWO_PASS_APPROVAL_v1_0.md §5.pass_2` — `review_date`, `review_session`, and
  per-signal verdict roll-up.
- `signal_weights/production/ll1_weights_promoted_v1_0.json` outer
  `weights_in_production_register: false` → `true` (only if all 30 close as `approve` or
  if a partial-promotion policy is recorded).

| # | signal_id | tier | pass_2 verdict (approve / hold / demote) | rationale (≤120 chars) |
|---|---|---|---|---|
| 1 | CTR.01 | A | _ _ _ | _ _ _ |
| 2 | CTR.03 | A | _ _ _ | _ _ _ |
| 3 | CVG.02 | A | _ _ _ | _ _ _ |
| 4 | SIG.01 | A | _ _ _ | _ _ _ |
| 5 | SIG.09 | A | _ _ _ | _ _ _ |
| 6 | SIG.10 | A | _ _ _ | _ _ _ |
| 7 | SIG.12 | A | _ _ _ | _ _ _ |
| 8 | SIG.13 | A | _ _ _ | _ _ _ |
| 9 | SIG.15 | A | _ _ _ | _ _ _ |
| 10 | SIG.MSR.013 | A | _ _ _ | _ _ _ |
| 11 | SIG.MSR.030 | A | _ _ _ | _ _ _ |
| 12 | SIG.MSR.163 | A | _ _ _ | _ _ _ |
| 13 | SIG.MSR.170 | A | _ _ _ | _ _ _ |
| 14 | SIG.MSR.198 | A | _ _ _ | _ _ _ |
| 15 | SIG.MSR.229 | A | _ _ _ | _ _ _ |
| 16 | SIG.MSR.251 | A | _ _ _ | _ _ _ |
| 17 | SIG.MSR.278 | A | _ _ _ | _ _ _ |
| 18 | SIG.MSR.291 | A | _ _ _ | _ _ _ |
| 19 | SIG.MSR.295 | A | _ _ _ | _ _ _ |
| 20 | SIG.MSR.297 | A | _ _ _ | _ _ _ |
| 21 | SIG.MSR.300 | A | _ _ _ | _ _ _ |
| 22 | SIG.MSR.301 | A | _ _ _ | _ _ _ |
| 23 | SIG.MSR.391 | A | _ _ _ | _ _ _ |
| 24 | SIG.MSR.476 | A | _ _ _ | _ _ _ |
| 25 | SIG.MSR.145 | B | _ _ _ | _ _ _ |
| 26 | RPT.DSH.01 | B | _ _ _ | _ _ _ |
| 27 | SIG.MSR.402 | B | _ _ _ | _ _ _ |
| 28 | SIG.MSR.118 | C | _ _ _ | _ _ _ |
| 29 | SIG.MSR.119 | C | _ _ _ | _ _ _ |
| 30 | SIG.MSR.143 | C | _ _ _ | _ _ _ |

**Joint pass_2 question — answer here:**

> Do SIG.MSR.118, .119, .143 represent (a) three independent calibrated phenomena, or
> (b) one phenomenon counted three times?

Native verdict: ___________________________________________________________________

Reasoning (≤300 chars): __________________________________________________________

________________________________________________________________________________

**Pass_2 reviewer:** native (Abhisek Mohanty)
**Pass_2 review date:** _______________
**Pass_2 review session:** _______________

---

## §6 — Changelog

- **v1.0 (2026-05-02, M4-B-P2-NAP-M45-PREP):** Initial publication. Parallel-slot session
  to M4-B-S3 (LL.2 shadow writes) and the T2 sibling slot. §2 enumerates all 30 LL.1
  promotion-eligible signals sorted by mean_match_rate desc with tier classification +
  flag column. §3 deep-dive on SIG.MSR.118/119/143: full MSR entries reproduced from
  MSR_v3_0.md verbatim, statistical profiles, per-event firing matrix, pairwise overlap
  analysis showing 0 events with all three lit and largest pairwise overlap = 3 of 11
  (empirical signature of three independent phenomena). §4 spot-check guide enumerating
  approve/hold/demote semantics + downstream consequences + ~20-minute time estimate +
  honest stakes statement. §5 blank decision-record template the native fills during
  pass_2 review; filled values feed back into ll1_weights_promoted_v1_0.json
  approval_chain.pass_2_decision and LL1_TWO_PASS_APPROVAL §5 pass_2 block. No signal
  files modified by this dossier (read-only on signal_weights/** per session brief
  hard constraints).

---

*End of NAP_M4_5_DOSSIER_v1_0.md. Awaiting native pass_2 review at M4-B close per
`PHASE_M4_PLAN §3.2`.*
