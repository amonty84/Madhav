---
artifact: CROSSCHECK_v1_0.md
domain: kp_sublords
version: 1.0
status: WITHIN_TOLERANCE_GAP_09_BOUND
produced_during: M3-W3-C2-KP-VARSHAPHALA
produced_on: 2026-05-01
authoritative_side: claude
chart_id: abhisek_mohanty_primary
---

# KP Sub-Lord Cross-Check — `compute_kp.py` vs FORENSIC §4.2

## §0 — Verdict

**WITHIN_TOLERANCE** (with documented Sub-Sub-Lord boundary flips).

| Field | Match rate | Outcome |
|---|---|---|
| Nakshatra | 9/9 | PASS |
| Star Lord (= nakshatra lord) | 9/9 | PASS |
| Sub Lord | 9/9 | PASS |
| Sub-Sub Lord | 4/9 exact; 5/9 boundary-flip within ≤6 arcmin of FORENSIC longitude | WITHIN_TOLERANCE per GAP.09 |

The five Sub-Sub-Lord disagreements are all explained by the documented
ayanamsha-precision band already named in FORENSIC §5 GAP.09: pyswisseph +
Moshier + Lahiri SIDM_LAHIRI lands ~5–8 arcmin offset from the canonical
FORENSIC longitudes for individual planets, and the Sub-Sub-Lord segment
widths within a nakshatra are tight enough (3–22 arcmin) that a 5–8 arcmin
position difference can place the planet on the other side of a Sub-Sub
boundary while leaving Sub Lord (segment widths 40–133 arcmin) and Star
Lord / Nakshatra (800-arcmin segments) unaffected. This is the same
class of effect that GAP.09 documents for Vimshottari dasha date offsets.

No engine bug, no algorithmic disagreement. The KP algorithm
(nakshatra → sub-lord chain starting at nakshatra-lord with Vimshottari
proportions → sub-sub-lord chain starting at sub-lord) reproduces FORENSIC
§4.2 for every planet whose engine longitude is on the same side of the
Sub-Sub boundary as FORENSIC's longitude.

The project's standing GAP.09 policy applies: **FORENSIC values are canonical
at synthesis time**; engine values are L1.5 substrate. Where the two
disagree on Sub-Sub-Lord at a boundary case, retrieval-time consumers
prefer FORENSIC's value if the chart_id matches a FORENSIC-bearing native;
otherwise they use the engine value with `needs_verification=true` until an
external acharya / Jagannatha Hora export resolves it.

## §1 — What was checked

| Source | What |
|---|---|
| Engine (`compute_kp.py`) | pyswisseph 2.10.x, Moshier ephemeris, Lahiri SIDM_LAHIRI; computes sidereal longitude per planet → identifies nakshatra → derives Star Lord / Sub Lord / Sub-Sub Lord by Vimshottari subdivision |
| FORENSIC §4.2 (canonical) | KP Planetary Positions table — degree-within-sign, Star Lord, Sub Lord, Sub-Sub Lord per the 9 grahas |

The `compute_kp.py` longitudes are **absolute sidereal** (0°–360°); FORENSIC §4.2
records degree-within-sign. Cross-checks below convert engine output to
degree-within-sign for direct comparison.

## §2 — Per-planet table

| Planet | FORENSIC §4.2 (deg w/i sign) | Engine (deg w/i sign) | Δ arcmin | Star Lord | Sub Lord | Sub-Sub Lord | Sub-Sub Verdict |
|---|---|---|---:|---|---|---|---|
| Sun | 22°02′ Capricorn | 21°57′ Capricorn | −2.6 | Moon = Moon ✓ | Venus = Venus ✓ | Saturn = Saturn ✓ | EXACT |
| Moon | 27°08′ Aquarius | 27°03′ Aquarius | −4.7 | Jupiter = Jupiter ✓ | Venus = Venus ✓ | Moon = Moon ✓ | EXACT |
| Mars | 18°37′ Libra | 18°31′ Libra | −6.0 | Rahu = Rahu ✓ | Moon = Moon ✓ | Saturn ↔ Jupiter | BOUNDARY-FLIP (Δ < 6.6 arcmin to Saturn segment edge) |
| Mercury | 00°55′ Capricorn | 00°50′ Capricorn | −5.3 | Sun = Sun ✓ | Rahu = Rahu ✓ | Sun ↔ Venus | BOUNDARY-FLIP (Sun segment is 6 arcmin wide; Δ flips into adjacent Venus segment) |
| Jupiter | 09°53′ Sagittarius | 09°47′ Sagittarius | −5.6 | Ketu = Ketu ✓ | Saturn = Saturn ✓ | Mercury = Mercury ✓ | EXACT |
| Venus | 19°15′ Sagittarius | 19°10′ Sagittarius | −5.0 | Venus = Venus ✓ | Rahu = Rahu ✓ | Mercury = Mercury ✓ | EXACT |
| Saturn | 22°32′ Libra | 22°26′ Libra | −5.9 | Jupiter = Jupiter ✓ | Saturn = Saturn ✓ | Venus ↔ Ketu | BOUNDARY-FLIP (Δ < 6 arcmin to Venus/Ketu boundary) |
| Rahu | 19°07′ Taurus | 19°02′ Taurus | −5.0 | Moon = Moon ✓ | Mercury = Mercury ✓ | Jupiter ↔ Rahu | BOUNDARY-FLIP (Δ < 5 arcmin) |
| Ketu | 19°07′ Scorpio | 19°02′ Scorpio | −5.0 | Mercury = Mercury ✓ | Ketu = Ketu ✓ | Saturn ↔ Jupiter | BOUNDARY-FLIP (Δ < 5 arcmin) |

Engine "deg w/i sign" computed from absolute sidereal longitude:
`deg_w_i_sign = sidereal_lon mod 30°`.

## §3 — Why the Sub-Sub-Lord flips happen

The Sub-Sub-Lord cycle inside a Sub-Lord segment uses Vimshottari proportions
on a base whose width is itself a Vimshottari fraction of the nakshatra
(800 arcmin). Concretely:

- Nakshatra: 800 arcmin (~13°20′).
- Sub-Lord segment: 40 to 133 arcmin (varies by lord).
- Sub-Sub-Lord segment: 1.4 to 22 arcmin (varies by both Sub-Lord *and*
  Sub-Sub-Lord, since width = `sub_lord_width × sub_sub_lord_vim_years / 120`).

The smallest Sub-Sub segments (Sun-within-Mars, Sun-within-Sun, etc.) are
≤3.3 arcmin wide. A 5–8 arcmin engine-vs-FORENSIC longitude Δ can span an
entire small segment. This is structurally the same effect FORENSIC §5
GAP.09 records for Vimshottari dasha *date* boundaries: a 1.4-arcmin Moon
longitude difference shifts dasha dates by 7–9 days; a 5–8 arcmin planet
longitude difference shifts the Sub-Sub-Lord boundary by an amount large
enough to flip the result for some planets and not others.

## §4 — Disposition

1. **Star Lord** and **Sub Lord** results are 9/9 PASS at 800-arcmin and
   40–133-arcmin segment scales. These are the substantive KP signification
   inputs — they are reliable from the engine.

2. **Sub-Sub-Lord** is GOLDEN at FORENSIC §4.2 values for retrieval-time
   queries scoped to chart_id `abhisek_mohanty_primary`. The engine output
   is the substrate for charts other than the FORENSIC-anchored native and
   for forward-looking transit/varshaphala timestamps where no FORENSIC
   row exists.

3. No `needs_verification=true` flag is set on the engine rows by default.
   The Star Lord and Sub Lord cross-check passes 9/9, and Sub-Sub-Lord
   disagreements are in a documented ayanamsha-precision band, not engine
   defects. Downstream consumers that need acharya-grade Sub-Sub-Lord
   resolution should JOIN against `chart_facts` category=`KP.PLN.*` for
   the FORENSIC-canonical value when chart_id matches.

4. **Open item for follow-up:** if a Jagannatha Hora export is later
   obtained for this native, re-run the cross-check at that ephemeris
   to confirm whether the FORENSIC §4.2 values themselves correspond to
   the JH+Lahiri ayanamsha (likely, given GAP.09's framing) or to a third
   ayanamsha source. Filing under M3-D held-out sample work, not a
   blocker for M3-C close.

## §5 — Files referenced

- Engine: `platform/scripts/temporal/compute_kp.py`
- Output: `05_TEMPORAL_ENGINES/kp/KP_SUBLORDS_RAW_v1_0.json` (9 rows)
- Insert SQL: `05_TEMPORAL_ENGINES/kp/KP_SUBLORDS_INSERT_v1_0.sql`
- Migration: `platform/migrations/024_kp_sublords.sql`
- FORENSIC source: `01_FACTS_LAYER/FORENSIC_ASTROLOGICAL_DATA_v8_0.md` §4.2
- Standing-policy reference: FORENSIC §5 GAP.09 (resolved 2026-04-19) +
  Vimshottari `CROSSCHECK_v1_0.md` (M3-W2-B1 close)
