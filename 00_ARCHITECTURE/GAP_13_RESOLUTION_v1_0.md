---
artifact: GAP_13_RESOLUTION_v1_0.md
version: "1.0"
status: CURRENT
produced_by: Madhav_17_B0
date: 2026-04-24
implements: PHASE_B_PLAN_v1_0.md §G B.0 Task 1
changelog:
  - v1.0 (2026-04-24, Madhav_17_B0): Initial resolution. Locks 8-karaka system as authoritative
    supplementary karaka register per FORENSIC_v8_0 §10.3; preserves 7-karaka as formal P7
    alternative for Pitrukaraka-dependent claims; enumerates 2 Pitrukaraka-dependent MSR signals.
---

# GAP.13 Resolution — Chara Karaka System Lock (7 vs 8 Karaka)

## §1 — Resolution Statement

**GAP.13 is resolved as of Madhav 17 (2026-04-24).**

AM-JIS adopts a dual-register policy:

1. **Primary system:** Jaimini 7-karaka (planets only; Rahu excluded). Assignments per
   `FORENSIC_ASTROLOGICAL_DATA_v8_0.md §10.1` — the canonical source, established at v8.0
   per JH export and verified against BPHS Ch.34.
   `[L1 source: FORENSIC_v8_0 §10.1]`

2. **Supplementary system:** Jaimini 8-karaka (Rahu included as Pitrukaraka). Assignments per
   `FORENSIC_ASTROLOGICAL_DATA_v8_0.md §10.3` — the JH-authoritative 8-karaka register,
   added at v8.0 per JH §6.2 and SUPPLEMENT §1.7.
   `[L1 source: FORENSIC_v8_0 §10.3]`

No session re-derives these assignments from scratch. Any claim invoking a karaka role must
cite one of the two FORENSIC sections above as its L1 source.

---

## §2 — 8-Karaka Lock Assertion

The following assignments constitute the **locked 8-karaka supplementary register** for AM-JIS.
These are authoritative for any signal, node, or claim that invokes the 8-karaka system.

`[L1 source: FORENSIC_v8_0 §10.3]`

| ID | Role (8-karaka) | Planet | D1 Longitude | Note |
|---|---|---|---|---|
| `KRK.C8.ATMA` | Atmakaraka (AK) | Moon | 27°02′ | Same as 7-karaka |
| `KRK.C8.AMATYA` | Amatyakaraka (AmK) | Saturn | 22°27′ | Same as 7-karaka |
| `KRK.C8.BHRATRU` | Bhratrukaraka (BK) | Sun | 21°57′ | Same as 7-karaka |
| `KRK.C8.MATRU` | Matrukaraka (MK) | Venus | 19°10′ | Same as 7-karaka |
| `KRK.C8.PUTRA` | Putrakaraka (PK) | Rahu | ~19°01′ | **DIFFERS** — Mars was PK in 7-karaka |
| `KRK.C8.PITRU` | Pitrukaraka (PiK) | Mars | 18°31′ | **NEW** — not present in 7-karaka |
| `KRK.C8.GNATI` | Gnatikaraka (GK) | Jupiter | 09°48′ | Same as 7-karaka |
| `KRK.C8.DARA` | Darakaraka (DK) | Mercury | 00°50′ | Same as 7-karaka |

**Rahu node-degree note:** Rahu's longitude under the 8-karaka counting convention uses
full-sign longitude (~19°01′ per JH §SUPPLEMENT §1.7), placing Rahu between Venus (19°10′)
and Mars (18°31′), yielding Rahu = PK (5th) and Mars = PiK (6th) under the 8-karaka scheme.
`[L1 source: FORENSIC_v8_0 §10.3, JH export]`

**Critical divergence:** In the 7-karaka system (§10.1), Mars = Putrakaraka (children/creativity
significator). In the 8-karaka system (§10.3), Mars = Pitrukaraka (father/ancestral significator)
and Rahu = Putrakaraka. Signals derived from Mars's karaka role are system-dependent.

---

## §3 — P7 Alternative-Rule for 7-Karaka (Pitrukaraka-Dependent Claims)

`[L2+ policy: interpretive]`

Under the Three-Interpretation Principle (P7), AM-JIS preserves both karaka readings as formal
alternatives wherever the 7-karaka and 8-karaka assignments produce materially different
interpretations. The policy is:

1. **7-karaka reading is primary** for all general interpretive claims. The 7-karaka system is
   AM-JIS's designated primary system per FORENSIC_v8_0 §10.1 and PHASE_B_PLAN_v1_0.md §3
   item 1 resolution.

2. **8-karaka reading is the formal P7 alternative** for any claim where the karaka assignment
   of Mars (PK → PiK shift) or Rahu (excluded → PK shift) changes the interpretive conclusion.
   These claims carry the tag `"7-karaka-alternative"` on their MSR entry, signalling that the
   7-karaka reading (preserved) is the alternative when the signal was authored under 8-karaka,
   or that the 8-karaka reading is available as a supplementary lens when the signal was authored
   under 7-karaka.

3. **Rahu-as-PK class:** Signals that require Rahu = PK (8-karaka) to form are valid within
   that system. When such a signal inverts under 7-karaka (i.e., does not form or yields a
   contrary result), the signal carries `"7-karaka-alternative"` and its falsifier must state
   the system-dependence explicitly.

4. **Non-Pitrukaraka signals are unaffected.** Signals whose karaka members are identical
   across both systems (AK, AmK, BK, MK, GK, DK) require no alternative tag.

5. **CGM and future layers** propagate the `"7-karaka-alternative"` tag from MSR to any
   derived node or edge. The tag is not stripped at L3 or L4.

---

## §4 — Enumerated Pitrukaraka-Dependent Signals

The following `MSR_v3_0.md` signal IDs are Pitrukaraka-dependent. Each is tagged
`"7-karaka-alternative"` in `MSR_v3_0.md` per PHASE_B_PLAN B.0 Task 1 acceptance criterion.

| Signal ID | Signal Name | Dependency | Reason |
|---|---|---|---|
| `SIG.MSR.320` | Jaimini — Mars as Putrakaraka (PK): Children-Significator = Avayogi Lagnesh in 7H | 7-karaka primary (Mars=PK) | Under 8-karaka, Mars becomes Pitrukaraka (father significator), not Putrakaraka; the children-significator role shifts to Rahu. This signal is authored under 7-karaka. The 8-karaka alternative (Mars as PiK) is the formal P7 alternative for father/ancestral readings of Mars. |
| `SIG.MSR.432` | Raja Yoga AK-PK (D-9) — Loyal Following and Power (Moon + Rahu) | 8-karaka (Rahu=PK) | This yoga requires Rahu = PK (8-karaka). Under 7-karaka, Rahu is excluded from the karaka scheme; the yoga does not form (different AK-PK pair). The 7-karaka reading is the formal P7 alternative: without Rahu as PK, the AK-PK yoga with Rahu/Moon dissolves. |

**Signal count: 2.** The acceptance pre-check `grep "7-karaka-alternative" MSR_v3_0.md | wc -l`
must return exactly `2`.

---

## §5 — Layer Tags Summary

| Claim | Layer Tag |
|---|---|
| 8-karaka lock assignments | `[L1 source: FORENSIC_v8_0 §10.3]` |
| 7-karaka primary assignments | `[L1 source: FORENSIC_v8_0 §10.1]` |
| P7 alternative-rule policy | `[L2+ policy: interpretive]` |
| Signal enumeration (MSR tag) | `[L2.5 derivation: MSR_v3_0 §enumeration]` |

---

## §6 — Downstream Obligations

- **B.3.5 (CGM rebuild):** When regenerating `CGM_v9_0.md`, use 8-karaka for node
  property assignments; preserve 7-karaka as formal P7 alternative for PiK/PK-dependent nodes.
  Per PHASE_B_PLAN §G B.3.5 item 2: "Ensure 7-karaka reading is preserved as a formal
  alternative for Pitrukaraka-dependent nodes per P7."

- **B.5 (Discovery Layer activation):** The router must recognise `"7-karaka-alternative"`
  tag as a retrieval modifier: when a query is about children/procreation, surface both
  SIG.MSR.320 (7-karaka Mars=PK reading) and SIG.MSR.432 (8-karaka Rahu=PK reading) as
  formally distinct interpretive frames.

- **L4 Discovery Layer:** Rahu-as-PK inversions (PHASE_B_PLAN B.3.5 item 10) are flagged as
  a specific contradiction class when empirical behavior inverts between 7-karaka and 8-karaka.

---

*End of GAP_13_RESOLUTION_v1_0.md — produced Madhav_17_B0 2026-04-24.*
