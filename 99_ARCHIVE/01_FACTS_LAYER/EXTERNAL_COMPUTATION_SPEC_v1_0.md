---
archived_at: 2026-04-28
archived_by: Phase_14_0_Asset_Inventory
archived_reason: SUPERSEDED — replaced by EXTERNAL_COMPUTATION_SPEC_v2_0.md and self-compute approach via Swiss Ephemeris (Session 4)
document: EXTERNAL COMPUTATION SPEC
project: MARSYS-JIS (Abhisek Mohanty Jyotish Intelligence System)
layer: L1 (Facts Layer) — sibling to FORENSIC_DATA and LIFE_EVENT_LOG
artifact_id: EXTERNAL_COMPUTATION_SPEC_v1_0
version: 1.0
status: SUPERSEDED SAME-SESSION BY SELF-COMPUTE APPROACH (native challenged the premise; see §0 banner below)
original_status: CLOSED (Session 3 output — spec for native to execute in Jagannatha Hora)
supersedes: (none — first version)
author: Claude (Session 3, Claude Code instance)
date_built: 2026-04-17
tool_required: Jagannatha Hora (native has confirmed install)
total_queries: 28 (Tier 1: 8 queries, Tier 2: 14 queries, Tier 3: 6 queries)
native_effort_estimate: 2.5–4 hours total (Tier 1: 60-90 min, Tier 2: 60-90 min, Tier 3: 30-60 min)
downstream_unlocks:
  - LIFE_EVENT_LOG v1.1 → v1.2 (chart_state transits/eclipses/retrograde/Ashtakavarga populated at 36 events; confidence 0.77 → 0.88)
  - FORENSIC_DATA v6.0 → v7.0 (CGP audit prerequisites met for D27, Nadi-amsa, full Sahams, Pranapada, Cycle 1 Sade Sati, eclipse catalog, retrograde catalog, full virupa aspect grid)
  - Enables Session 5 (v7.0 build) and Session 6 (CGP audit + signoff) per Architecture §I Phase 1
provenance_tag_target: All outputs become `source: jagannatha_hora` per Architecture §B.10 (No Fabricated Computation)
expose_to_chat: false
native_id: "abhisek"
category: source
---

# EXTERNAL COMPUTATION SPEC v1.0

## §0 — REVISION BANNER (2026-04-17, SAME SESSION)

**This spec was produced in Session 3 and revised same-session.** Native challenged the premise: *"Why do you want me to run this on JH? You can pull ephemeris data from open available website yourself."*

The challenge was correct. Most queries in this spec are computable via Swiss Ephemeris (pyswisseph Python library) + classical BPHS/Jaimini formulas — not requiring a specialist GUI tool. Architecture §B.10 "No Fabricated Computation" prohibits inventing numbers; it does not prohibit computing from sourced ephemeris inputs using well-defined deterministic formulas.

### §0.1 — What replaced most of this spec

**Self-compute via Swiss Ephemeris + Python** (see `.tools/generate_ephemeris.py`, `01_FACTS_LAYER/EPHEMERIS_MONTHLY_1900_2100.csv` and sibling derivative catalogs produced in Session 4).

Verification: natal chart computed from Swiss Ephemeris at birth coords matches v6.0 to arc-minute precision (Sun Δ 11″, Moon Δ 30″, Mars Δ 3″, Lagna Δ 117″). Match quality sufficient for retrodictive tagging.

### §0.2 — Queries now computed by Claude (no native effort needed)

| Original QRY | New source |
|---|---|
| QRY.001 Ephemeris 1984-2026 | EPHEMERIS_MONTHLY_1900_2100.csv (expanded to 1900-2100 per native's request) |
| QRY.002 Eclipses | Swiss Ephemeris eclipse solver → ECLIPSES_1900_2100.csv |
| QRY.003 Retrogrades | Derived from ephemeris speed flags → RETROGRADES_1900_2100.csv |
| QRY.004 Cycle 1 Sade Sati | Derived from Saturn transits → SADE_SATI_CYCLES_ALL.md |
| QRY.005 Ashtakavarga transit matrix | Computed from v6.0 §7.1 + classical bindu rules |
| QRY.006 Saturn Kakshya dates | Derived from Saturn degree + v6.0 §8 |
| QRY.007 Panchang at event dates | Computed from ephemeris |
| QRY.008 PD/SD dasha resolution | Computed from Vimshottari formulas |
| QRY.009 D27 Bhamsa | Computed from D1 positions |
| QRY.010 Nadi-amsa | Computed (1/150° subdivisions) |
| QRY.011 Additional Sahams (14+) | Computed from classical formulas |
| QRY.012 Pranapada Lagna | Computed from formula |
| QRY.013 Bhrigu Bindu 60-yr progression | Computed from annual Moon+Rahu positions |
| QRY.014 Virupa aspect grid | Computed from BPHS fixed rules |
| QRY.018-019 Shadbala/Shuddha Pinda verify | Re-computed from classical formulas |
| QRY.021 Mrityu Bhaga refinement | Classical fixed values from Phaladeepika |

### §0.3 — Queries where JH remains useful (verification-only, ~15-30 min native effort if desired)

| Query | Reason JH is still valuable |
|---|---|
| QRY.015 Tajika Mudda Dasha | Varshphal monthly progression has computational complexity; JH implementation is peer-reviewed by acharyas |
| QRY.020 KP Sub-Sub-Lord | Complex multi-level signifier chains; easy to get wrong in custom implementation |
| QRY.026 Jaimini Chara Karaka audit | Minor variations across schools (K.N. Rao vs traditional); JH uses K.N. Rao which matches v6.0 |
| Any spot-verification | Native can cross-check any computed value in JH if suspicious |

### §0.4 — What to read below

§1-§8 of this spec remain as the **detailed reference** of what was conceptually required. They now serve as:
- A verification checklist (native can cross-check any QRY.* against self-computed output)
- A spec document for future deep-dive work where classical formula edge cases emerge

**Practical native effort going forward: 0 min required; 15-30 min optional for verification of complex derivations.**

---

## §1 — META AND PURPOSE

### §1.1 — Why This Document Exists

Per Architecture §B.10 (No Fabricated Computation) and §G.1.CGP (Completeness Guarantee Protocol), Claude cannot invent numerical chart values. Specialist-tool outputs are required wherever v6.0 stops short of v7.0 coverage. This document specifies **exactly what to compute/export** from Jagannatha Hora (JH), **where to find it in the JH interface**, **what format to deliver** to Claude, and **what each query unlocks downstream**.

### §1.2 — How to Use This Document

- §2 lists JH configuration prerequisites (chart setup, settings, etc.)
- §3-§5 list individual queries grouped by tier (QRY.*)
- Each query has: ID, purpose, JH menu path, expected output, delivery format, priority tier, effort estimate
- §6 specifies handoff format — how to deliver query outputs back to Claude
- §7 recommends execution sequence (which queries to do first)
- Native executes queries in own time; Claude ingests results in subsequent session(s)

### §1.3 — Two-Tier Structure

| Tier | Purpose | Count | Downstream unlock |
|---|---|---|---|
| **Tier 1** | Unblock LIFE_EVENT_LOG v1.2 — populate chart_state at 36 events | 8 | LEL confidence 0.77 → 0.88 |
| **Tier 2** | Unblock FORENSIC_DATA v7.0 CGP audit | 14 | v7.0 signoff in Session 6 |
| **Tier 3** | v7.0 deep extensions (optional) | 6 | v7.1 and L2.5 richness |

Native may do Tier 1 only (minimum to proceed to next sessions) or all three (full v7.0 readiness). Recommendation: **Tier 1 before Session 4**, **Tier 2 before Session 5**, **Tier 3 whenever convenient**.

---

## §2 — JAGANNATHA HORA PREREQUISITES

Before running any queries, confirm the following in JH:

### §2.1 — Chart Loaded

| Field | Value to verify |
|---|---|
| Name | Abhisek Mohanty |
| Date of Birth | 5 February 1984 |
| Time of Birth | 10:43:00 AM (local time) |
| Place of Birth | Bhubaneswar, Odisha, India |
| Latitude | 20.27° N (≈ 20° 16′ N) |
| Longitude | 85.84° E (≈ 85° 50′ E) |
| Time Zone | IST (+05:30) |

**Action**: Open the chart and verify Moon is in Aquarius 27°02′48″ (Purva Bhadrapada Pada 3), Sun in Capricorn 21°57′35″ (Shravana Pada 4), Lagna Aries 12°23′55″ (Ashwini Pada 4). If any of these differ from v6.0 FORENSIC_DATA, **stop and reconcile** before proceeding — the whole corpus depends on identical birth data.

### §2.2 — Settings

Configure JH with:

| Setting | Value |
|---|---|
| Ayanamsa | Lahiri (sidereal) — matches v6.0 |
| House System | Sripathi Chalit — matches v6.0 |
| Zodiac | Sidereal (all calculations) |
| Node | Mean node (Rahu/Ketu) — standard |
| Nakshatra pada system | Equal 3°20′ per pada (standard) |
| Day/Night birth | Day (Sun above horizon at birth — relevant for Tajika calculations) |

### §2.3 — Language

Use **English** settings in JH for output (some queries produce classical Sanskrit terms; English gives cleaner transcription).

---

## §3 — TIER 1 QUERIES (LIFE EVENT LOG v1.2 UNBLOCK)

These 8 queries populate the `unexamined` fields (transits/eclipses/retrograde/Ashtakavarga) at each of the 36 Life Event Log v1.1 events.

### QRY.001 — Bulk Monthly Ephemeris 1984–2026

**Purpose**: Single largest-leverage query. Positions of all 9 planets (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu) at monthly resolution from 1984-02 through 2026-04 = ~508 months × 9 planets = ~4,572 rows. From this, Claude derives transits at each of 36 event dates (month-resolution accurate; sufficient for retrodictive tagging).

**JH menu path**: `Tools → Ephemeris` (or `Advanced Features → Ephemeris Generator`)

**Settings**:
- Start date: 1984-02-01
- End date: 2026-04-30
- Step: 1 month (first of month, 00:00 IST)
- Ayanamsa: Lahiri
- Planets: All 9 (Sun through Ketu, including Rahu/Ketu)
- Output columns: Date, planet, sign, degree (dd°mm′), nakshatra, pada, retrograde flag

**Expected output**: CSV or text table. Approximately 508 lines per planet × 9 planets = 4,572 rows total. If JH cannot export 9 planets in one pass, run 9 times (one per planet) and concatenate.

**Delivery**: CSV file named `ephemeris_1984_2026_monthly.csv` OR paste text into chat. Preferred format:
```
date,planet,sign,deg,min,nakshatra,pada,retrograde
1984-02-01,Sun,Capricorn,17,32,Shravana,3,N
1984-02-01,Moon,Pisces,12,05,Uttara Bhadrapada,2,N
...
```

**Effort**: 10-20 min depending on JH export speed. Single bulk export.

**Unlocks**: Transit positions + retrograde flags at every event in LEL.

---

### QRY.002 — Eclipse Catalog 1984–2044

**Purpose**: Solar and lunar eclipses during native's lifetime. For each event in LEL, Claude checks if an eclipse occurred within 6 months before/after — classical retrodictive signal. Also needed for v7.0 temporal coverage.

**JH menu path**: `Tools → Eclipse Calculator` or `Tools → Astronomical Events → Eclipses`

**Settings**:
- Start date: 1984-01-01
- End date: 2044-12-31
- Types: Both solar + lunar
- Include: Visible from Bhubaneswar? (preferable yes, but global catalog is also acceptable — native-visibility is refinement, not required for v1.2)

**Expected output**:
| Date | Type (Solar/Lunar) | Sign (sidereal) | Degree | Eclipse magnitude |

**Delivery**: Text table (paste in chat) OR CSV.

**Effort**: 5-10 min.

**Unlocks**: `eclipses_within_6mo` field at every LEL event; also populates v7.0 §11.7 (new section) Eclipse Catalog.

---

### QRY.003 — Retrograde Periods Catalog 1984–2044

**Purpose**: Every retrograde period for Mercury, Venus, Mars, Jupiter, Saturn (the 5 classical retrograders). Rahu/Ketu are always retrograde in mean-node calculation; no catalog needed.

**JH menu path**: `Tools → Planetary Stations / Retrogrades` or equivalent

**Settings**:
- Start date: 1984-01-01
- End date: 2044-12-31
- Planets: Mercury, Venus, Mars, Jupiter, Saturn
- Output: Start of retrograde, end of retrograde (station direct), sign at station retrograde, sign at station direct

**Expected output**:
| Planet | Station Retro Date | Sign at Retro | Station Direct Date | Sign at Direct |

**Delivery**: CSV or text table.

**Effort**: 10-15 min.

**Unlocks**: `retrograde_activity` field at every LEL event; also populates v7.0 §11.8 (new section) Retrograde Catalog.

---

### QRY.004 — Cycle 1 Sade Sati Dates (1991–2001)

**Purpose**: v6.0 §21 only has Cycle 2 (2020+). Cycle 1 transits — Saturn entering Capricorn (12th from Aquarius Moon) → Aquarius (on Moon) → Pisces (2nd from Moon) — should span ~1991-2000. Critical for retrodictively tagging adolescent events including EVT.1995.XX.XX.01 (headaches onset) and EVT.1998.02.16.01 (R#1 start at age 14).

**JH menu path**: `Tools → Sade Sati` or derivable from QRY.001 ephemeris Saturn positions

**Settings**: Saturn transit through Capricorn, Aquarius, Pisces, 1991-2001

**Expected output**: Same format as v6.0 §21 table:
| Cycle | Saturn Sign | Start Date | End Date | Phase |
| 1 | Capricorn | YYYY-MM-DD | YYYY-MM-DD | Rising |
| 1 | Aquarius | YYYY-MM-DD | YYYY-MM-DD | Peak |
| 1 | Pisces | YYYY-MM-DD | YYYY-MM-DD | Setting |

Include retrograde loops (Saturn oscillating between adjacent signs).

**Delivery**: Text table.

**Effort**: 5-10 min (or derivable from QRY.001 automatically by Claude if native exports QRY.001 cleanly).

**Unlocks**: Sade Sati Cycle 1 addition to v6.0 §21 (for v7.0). Enables full retrodictive tagging for 1991-2001 events.

---

### QRY.005 — Ashtakavarga Transit Bindu Quick-Lookup Table

**Purpose**: v6.0 §7.1 has Bhinna Ashtakavarga (BAV) for each planet in each sign at birth. But when a planet transits a given sign at a given event date, its active bindu count depends on transit-sign's BAV total, not natal. This query asks JH to produce a lookup table of BAV totals per planet per sign (12 × 7 = 84 cells) so Claude can compute transit-activated bindus from QRY.001.

**JH menu path**: `Ashtakavarga → Bhinna Ashtakavarga Tables`

**Settings**:
- Display: BAV per planet per sign
- Include: Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn (7 classical bindu-contributors)
- Output format: Matrix (7 rows × 12 columns)

**Expected output**:

| Planet | Ari | Tau | Gem | Can | Leo | Vir | Lib | Sco | Sag | Cap | Aqu | Pis |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Sun | N | N | N | N | N | N | N | N | N | N | N | N |
| Moon | N | N | N | N | N | N | N | N | N | N | N | N |
| ... | | | | | | | | | | | | |

Where N = BAV bindu count (integer, 0-8).

**Delivery**: Paste table in chat.

**Effort**: 5-10 min.

**Unlocks**: `ashtakavarga_SAV_transit_sign` at each LEL event. Also v7.0 §7.4 (new sub-section) — Transit Bindu Lookup Matrix.

---

### QRY.006 — Saturn Kakshya Zone Dates 1984–2026

**Purpose**: v6.0 §8 has Saturn Kakshya zones as degree-bands per sign. For LEL events, Claude needs to know which specific Kakshya zone Saturn occupied at the event date. This requires combining Saturn's daily degree (from QRY.001) with the zone mapping (v6.0 §8). Derivable but needs verification.

**JH menu path**: `Tools → Saturn Kakshya` or derivable from QRY.001 Saturn positions + v6.0 §8

**Settings**: Saturn's active Kakshya zone at each event date OR a daily/monthly table of Saturn's Kakshya state.

**Expected output**: For each event date in LEL (or a general table covering 1984-2026):
| Date | Saturn Sign | Saturn Degree | Kakshya Zone | Zone Ruler |

**Delivery**: Text table or can be derived after QRY.001.

**Effort**: If JH supports direct Kakshya lookup: 5 min. If derivable from QRY.001 + §8: 0 min extra (Claude computes).

**Unlocks**: Kakshya state tagging per event. Optional — skip if JH doesn't support directly; Claude will derive from QRY.001.

---

### QRY.007 — Panchang at Each LEL Event Date (36 lookups)

**Purpose**: Tithi, Nakshatra, Yoga, Karana, Vara at each of 36 LEL event dates. Panchang yogas (Vyatipata, Vaidhriti, Siddha, Amrita, etc.) are classical timing qualifiers. Pada-precision Panchang on birth is in v6.0 §15; event-date Panchang is needed for retrodictive completeness.

**JH menu path**: `Panchang → Date Panchang` (input date, get tithi/nak/yoga/karana/vara)

**Event dates needed** (36 total — use closest date where approx):
1. 1984-02-05 (birth — already in v6.0 §15)
2. ~1995-XX-XX (headaches — use 1995-06-15 as placeholder)
3. 1998-02-16 (R#1 start)
4. ~2001-03-15 (IIT prep start)
5. ~2003-06-15 (IIT prep end)
6. 2004-01-15 (R#2 start)
7. 2007-06-10 (Cognizant join)
8. ~2007-06-15 (knee surgery, eng complete — use 06-15)
9. 2008-06-09 (Cognizant exit)
10. ~2009-06-30 (grandfather passed — use midpoint of June/July)
11. ~2010-12-15 (Thailand)
12. ~2010-XX-XX (father's windfall — use 2010-06-15 as midyear)
13. 2011-01-15 (XIMB admit)
14. 2011-06-15 (XIMB enrolled)
15. 2012-09-15 (modeling)
16. 2012-10-15 (R#3 start)
17. 2013-03-15 (XIMB graduation)
18. 2013-05-15 (Mahindra Retail join)
19. 2013-XX-XX (father's kidney disease — use 2013-06-15 placeholder; refine once month confirmed)
20. 2013-12-11 (marriage)
21. ~2016-XX-XX (Mahindra crash — use 2016-06-15)
22. 2017-03-15 (Tech Mahindra switch)
23. 2018-11-28 (father passed)
24. 2019-05-15 (US move)
25. 2021-01-15 (jitters/panic)
26. 2022-01-03 (twins born)
27. ~2022-10-15 (R#3 end)
28. 2023-05-15 (US return)
29. 2023-06-15 (Tepper completion)
30. 2023-07-15 (Marsys founded)
31. 2024-02-16 (sand mine launch)
32. 2025-05-15 (deception/scam)
33. 2025-07-15 (Marsys contract)
34. 2025-XX-XX (Vishnu shift — use 2025-06-15 as midyear)

**Expected output (per date)**:
| Date | Tithi | Nakshatra | Yoga | Karana | Vara |

**Delivery**: One table with 34-36 rows.

**Effort**: 30-40 min (per-date lookup in JH).

**Unlocks**: Full Panchang signature at each event — enables classical "Panchang DNA match" retrodictive analysis.

---

### QRY.008 — Vimshottari AD→PD Resolution at 5 Hot Events

**Purpose**: v6.0 §5.1 has Mahadasha/Antardasha resolution. For 5 highest-stakes events, we also want Pratyantara Dasha (PD) precision (3rd-level dasha). Reduces 1-year-window uncertainty to ~2-month-window.

**Hot events** (where PD matters most):
1. **2018-11-28** Father passed
2. **2022-01-03** Twins born
3. **2023-05-15** US return + pivot
4. **2024-02-16** Sand mine launch
5. **2025-07-15** Marsys major contract

**JH menu path**: `Dasas → Vimshottari → Pratyantardasha` (drill into AD)

**Settings**:
- Dasha system: Vimshottari (Udu)
- Depth: MD → AD → PD minimum
- Date queries: Above 5 dates

**Expected output (per date)**:
| Date | MD | AD | PD | PD Start | PD End |

**Delivery**: Table with 5 rows.

**Effort**: 10 min.

**Unlocks**: PD-level resolution on hot events; refines retrodictive reasoning for those specific events.

---

## §4 — TIER 2 QUERIES (FORENSIC DATA v7.0 CGP UNBLOCK)

These 14 queries fill the v6.0 → v7.0 gaps identified against Architecture §G.1 Facts Layer Completion and §G.1.CGP audit categories.

### QRY.009 — D27 Bhamsa Chart

**Purpose**: v6.0 has 14 divisional charts (D2 through D60) but missing D27 Bhamsa. D27 = strength/weakness chart (Saptavimshamsa). Needed for complete divisional coverage per Architecture §D.1.

**JH menu path**: `Charts → Divisional Charts → D27 Bhamsa`

**Expected output**: Same format as v6.0 §3.5 (D9 Navamsa) — Lagna, 9 planet signs, Vargottama audit (planets in same sign as D1). Include:
- D27 Lagna sign
- 9 planet positions (sign only, degree optional)
- Vargottama flag per planet (matches D1 sign?)

**Delivery**: Text table mirroring v6.0 §3.X format.

**Effort**: 5 min.

**Unlocks**: v7.0 §3.X — new D27 sub-section added.

---

### QRY.010 — Nadi-Amsa Positions (1/150° Subdivisions)

**Purpose**: Nadi-amsa = 1/150° of the zodiac (each sign has 12.5 minutes of arc). Critical for Bhrigu Nadi / Nadi-jyotish style analysis. Architecture §D.1 specifies this for v7.0.

**JH menu path**: `Charts → Special Charts → Nadi Amsa` or `Advanced Features → Nadi Subdivisions`

**Settings**:
- Resolution: 1/150° (or "Nadi-amsa" if direct option)
- Planets: All 9 + Lagna

**Expected output**:
| Planet | Absolute Longitude | Sign | Nadi-Amsa # (1-150 within sign) | Nadi-Amsa Name | Nadi-Amsa Lord |

**Delivery**: Table with 10 rows (9 planets + Lagna).

**Effort**: 5-10 min.

**Unlocks**: v7.0 §3.Y — Nadi-Amsa Positions new sub-section.

---

### QRY.011 — Missing 14+ Sahams (Day Birth)

**Purpose**: v6.0 §12.2 has 6 sahams (Punya, Rajya, Karma, Labha, Vivaha, Putra). Architecture targets 20+ sahams for v7.0. Missing sahams include:

| # | Saham | Theme | Day-Birth Formula |
|---|---|---|---|
| 7 | Pitri | Father | (Saturn − Sun) + Asc |
| 8 | Matri | Mother | (Moon − Venus) + Asc |
| 9 | Bhratri | Siblings | (Jupiter − Saturn) + Asc |
| 10 | Mrityu | Death | (Asc − 8th Lord) + Asc |
| 11 | Roga | Disease | (Asc − Saturn) + Asc |
| 12 | Kali | Misery | (Jupiter − Mars) + Asc |
| 13 | Mahatmya | Greatness | (Asc − Mars) + Asc |
| 14 | Yasas | Fame | (Jupiter − Punya) + Asc |
| 15 | Artha | Material | (2nd Cusp − 2nd Lord) + Asc |
| 16 | Bandhu | Kin | (Moon − Mercury) + Asc |
| 17 | Sastra | Disputes | (Jupiter − Saturn) + Asc (alt formula Paramardham variant) |
| 18 | Samartha | Capability | (Mars − Lord of Asc) + Asc |
| 19 | Vyapara | Business | (9th Lord − Moon) + Asc |
| 20 | Paradesa | Foreign | (9th Cusp − 9th Lord) + Asc |

(Additional: Jadya, Shoka, Sraddha, Dusthuara, Bandhana, Vanig — cover what's available in JH)

**JH menu path**: `Advanced Features → Tajika Sahams` (comprehensive list)

**Settings**: Day birth. All available sahams.

**Expected output**: Same format as v6.0 §12.2:
| Saham | Theme | Formula | Result Abs Long | Sign | Degree | Nakshatra |

**Delivery**: Full sahams table (aim for 20+ rows).

**Effort**: 10-15 min.

**Unlocks**: v7.0 §12.2 — complete Sahams inventory.

---

### QRY.012 — Pranapada Lagna (Missing 7th Special Lagna)

**Purpose**: v6.0 §12.1 has 6 of 7 target special lagnas (Bhava, Hora, Ghati, Indu, Shree, Varnada). Pranapada Lagna is missing.

**JH menu path**: `Charts → Special Lagnas → Pranapada` or computed via formula

**Formula**: Pranapada = `(Sun's longitude in seconds + time from sunrise in seconds/5) mod 360`

**Expected output**: Single row matching v6.0 §12.1 format:
| Point | Formula | Result Abs Long | Sign | Degree | Nakshatra |

**Delivery**: Single row in chat.

**Effort**: 2-5 min.

**Unlocks**: v7.0 §12.1 — all 7 special lagnas complete.

---

### QRY.013 — Bhrigu Bindu 60-Year Progression

**Purpose**: v6.0 §11.2 has Bhrigu Bindu natal position. Architecture §D.1 specifies 60-year progression table. Bhrigu Bindu progresses at approximately 6° per year (360° / 60 years), completing a full cycle every 60 years.

**JH menu path**: `Advanced Features → Bhrigu Bindu` or derivable from `(Moon + Rahu) / 2` formula applied to transit positions

**Settings**: Annual Bhrigu Bindu positions from birth (1984) through 2044.

**Expected output**:
| Year | Age | Bhrigu Bindu Abs Long | Sign | Degree | Nakshatra | House from Lagna |

60 rows.

**Delivery**: CSV or text table.

**Effort**: 10-15 min (or derivable from transit ephemeris + formula).

**Unlocks**: v7.0 §11.2 — 60-year progression sub-table added.

---

### QRY.014 — Full Vedic Aspect Strength Grid with Virupa Percentages

**Purpose**: v6.0 §16.1 has classical Vedic aspects (Graha Drishti) with intensity indicators. Architecture §D.1 specifies "full aspect-strength grid (Graha Drishti with virupa percentages)" — virupa = the BPHS unit of aspect strength (0, 15, 30, 45, 60 virupas mapping to 0%, 25%, 50%, 75%, 100%).

**JH menu path**: `Tools → Drishti (Aspects)` or `Advanced Features → Aspect Strength`

**Settings**:
- Include: Graha Drishti (planet-to-planet) with virupa values
- Matrix: 9 × 9 = 81 cells
- Plus: Planet-to-house (Bhav Drishti) = 9 × 12 = 108 cells

**Expected output** (planet-to-planet):
| From \\ To | Sun | Moon | Mars | Mer | Jup | Ven | Sat | Rahu | Ketu |
| Sun | — | XX | XX | XX | XX | XX | XX | XX | XX |
| ... 9 rows |

Where XX = virupa aspect value (0, 15, 30, 45, or 60).

**Delivery**: Matrix or list.

**Effort**: 10-15 min.

**Unlocks**: v7.0 §16.4 — full Virupa aspect grid.

---

### QRY.015 — Tajika Monthly Progression for Current Varshphal

**Purpose**: v6.0 §22 has Varshphal 2026-2027 annual chart. Architecture §D.1 specifies Tajika monthly progression (Varshphal Muntha's monthly sub-periods).

**JH menu path**: `Tools → Varshphal → Mudda Dasha / Monthly Progression`

**Settings**:
- Varshphal year: 2026-02-05 to 2027-02-05 (current)
- Output: Monthly Mudda sub-lord and Muntha progression

**Expected output**:
| Month | Muntha Sign | Muntha Lord | Mudda Dasha Lord | Notable Transits |

12 rows covering Feb 2026 – Feb 2027.

**Delivery**: Table.

**Effort**: 10 min.

**Unlocks**: v7.0 §22 — Varshphal sub-sections expanded.

---

### QRY.016 — Deeper D12 Derivation (Karakamsa + Arudha in D12)

**Purpose**: v6.0 §3.7 has D12 basic positions. Architecture §D.1: "D12, D16, D27, D30, D40, D45, D60 deep-derivation tables beyond v6.0 basic positions." D12 relates to parental ancestry — critical for father-karma retrodictive chain (CTR.03 Jupiter weakness theme).

**JH menu path**: `Charts → Divisional Charts → D12 → All Derivations`

**Expected output**:
- D12 Lagna + 9 planets (already have in v6.0)
- D12 Karakamsa (AK Moon's D12 sign)
- D12 Arudha Lagna
- D12 dispositor chain

**Delivery**: Extended table.

**Effort**: 5-10 min.

**Unlocks**: v7.0 §3.7 — deeper D12 reading.

---

### QRY.017 — Deeper D16/D30/D40/D45/D60 Derivations

**Purpose**: Similar to QRY.016 for the other "deep" divisionals. Each needs:
- Lagna + 9 planet signs (already have)
- Karakamsa
- Arudha Lagna
- Key dispositor chain

**JH menu path**: `Charts → Divisional Charts → [D16 / D30 / D40 / D45 / D60] → All Derivations`

**Expected output**: 5 extended tables (one per Dx).

**Delivery**: One table per Dx.

**Effort**: 15-20 min total.

**Unlocks**: v7.0 §3.8, §3.11, §3.12, §3.13, §3.14 — deeper divisional reads.

---

### QRY.018 — Shadbala Component Breakdown Verification

**Purpose**: v6.0 §6.1 has Shadbala components. Architecture B.1 principle is facts/derivation/interpretation separation; want to verify v6.0's Shadbala is internally consistent. Re-export from JH for cross-check.

**JH menu path**: `Strengths → Shadbala → Components`

**Expected output**: 9 planets × 6 components (Sthana, Dig, Kala, Chesta, Naisargika, Drik) + Totals.

**Delivery**: Table.

**Effort**: 5 min.

**Unlocks**: v7.0 §6.1 confidence boost (source re-verification). If v6.0 matches JH output, no change. If discrepancy, update v7.0 with flag.

---

### QRY.019 — Ashtakavarga Shuddha Pinda Full Verification

**Purpose**: v6.0 §7.3 has Shuddha Pinda rankings. Re-export from JH to verify.

**JH menu path**: `Ashtakavarga → Shuddha Pinda / Reductions`

**Expected output**: Per-planet Shuddha Pinda value + rank.

**Delivery**: Table.

**Effort**: 3-5 min.

**Unlocks**: v7.0 §7.3 source verification.

---

### QRY.020 — KP Significators with Sub-Sub-Lord

**Purpose**: v6.0 §4.3 has KP Significators. Architecture implies extension to Sub-Sub-Lord (4th level KP chain). Useful for KP horary/prashna readiness.

**JH menu path**: `Advanced Features → KP System → Full Significator Chain`

**Expected output**: Extended table with Cusp → Sign Lord → Star Lord → Sub Lord → Sub-Sub Lord.

**Delivery**: Table with 12 cusps and 9 planets.

**Effort**: 10 min.

**Unlocks**: v7.0 §4.3 — KP deepened.

---

### QRY.021 — Mrityu Bhaga Refinement (Exact Degree)

**Purpose**: v6.0 §11.5 has Mrityu Bhaga status per planet. Some sources give planet-specific + sign-specific Mrityu Bhaga values (more refined than v6.0's sign-average). Request classical planet-specific values.

**JH menu path**: `Tools → Hazards → Mrityu Bhaga`

**Expected output**: Planet × Sign matrix of Mrityu Bhaga degrees (classical Phaladeepika values).

**Delivery**: Table.

**Effort**: 5 min.

**Unlocks**: v7.0 §11.5 refinement.

---

### QRY.022 — Yogi Point Full Derivation with Nakshatra-by-Nakshatra Chart

**Purpose**: v6.0 §11.3 has Yogi + Avayogi. Some traditions additionally classify every nakshatra in the chart as Yogi/Avayogi/Duplicate-Yogi etc. (27 nakshatra classification relative to Yogi point).

**JH menu path**: `Advanced Features → Yogi Point / Duplicate Yogi`

**Expected output**: 27-row table with each nakshatra's role relative to native's Yogi point.

**Delivery**: Table.

**Effort**: 5 min.

**Unlocks**: v7.0 §11.3 expansion — nakshatra-level Yogi classification.

---

## §5 — TIER 3 QUERIES (OPTIONAL, v7.0 DEEP EXTENSIONS)

Nice-to-have. Skip if effort is prohibitive; return to these in v7.1+.

### QRY.023 — Prashna Readiness Frame

**Purpose**: Architecture §D.1 specifies "Prashna-readiness frame" for v7.0. Prashna = horary astrology answering specific questions at moment of asking. For native's own prashna queries later, need a template structure.

**JH menu path**: `Prashna → Template` (if available)

**Expected output**: Prashna chart template for current moment (used as working base for any future prashna question).

**Effort**: 5-10 min.

---

### QRY.024 — Full Ashtakavarga Reduction Sequence

**Purpose**: v6.0 §7.3 has Shuddha Pinda. Architecture implies the full reduction sequence: Trikona-Shodhana → Ekadhipatya-Shodhana → Shuddha Pinda (all three reduction stages).

**JH menu path**: `Ashtakavarga → Full Reduction Steps`

**Expected output**: Per-planet step-by-step reduction.

**Effort**: 10 min.

---

### QRY.025 — Sampoorna Shadbala (Total Beneficial Strength)

**Purpose**: Shadbala rupas summed with proper weights give "Sampoorna Shadbala" — overall planetary vitality score.

**JH menu path**: `Strengths → Shadbala → Sampoorna / Total`

**Effort**: 3 min.

---

### QRY.026 — Jaimini Strength (Chara Karaka Computation Audit)

**Purpose**: v6.0 §10.1 has Chara Karakas. Verify JH's karaka computation matches.

**JH menu path**: `Advanced Features → Jaimini → Chara Karakas`

**Effort**: 5 min.

---

### QRY.027 — Navamsa Strength Detail (D9 Avastha)

**Purpose**: v6.0 §3.5 has D9 Navamsa and NBRY but not D9 Avastha triad (Baladi/Jagratadi/Deeptadi) for D9 specifically. Architecture hints that divisional Avasthas matter.

**JH menu path**: `Charts → D9 → Avastha`

**Effort**: 5 min.

---

### QRY.028 — Relationship Compatibility Chart Placeholder

**Purpose**: If native has wife's birth data, a composite chart / synastry frame could be built for the Relationships Domain Report (Phase 4 Session 28). Placeholder — only if native wants to include.

**JH menu path**: `Tools → Compatibility → Ashta Kuta / Composite`

**Effort**: 10 min (only if wife's birth data available).

**Note**: Optional per native's comfort. May also apply to R#2 and R#3 birth data if native has it.

---

## §6 — OUTPUT FORMAT AND HANDOFF

### §6.1 — Preferred Format

For each QRY.*, deliver the output to Claude in the next session as one of:

1. **Paste text table in chat** (for small tables, <30 rows): simplest path
2. **Upload CSV file** (for bulk exports like QRY.001 ephemeris): cleanest for parsing
3. **Screenshot of JH output + paste text description**: fallback if table copy doesn't work cleanly

Claude will ingest and integrate into v7.0 FORENSIC_DATA + LEL v1.2 accordingly.

### §6.2 — Labeling Convention

When delivering outputs, prefix each with the QRY ID:

```
QRY.001 output:
[paste ephemeris CSV or text here]

QRY.002 output:
[paste eclipse table]

...
```

This lets Claude route each output to the correct v7.0/LEL destination unambiguously.

### §6.3 — Handoff Cadence

Native can deliver outputs in batches:
- **Batch 1 (Tier 1)**: QRY.001 through QRY.008 → unlocks Session 4 (LEL v1.2 build)
- **Batch 2 (Tier 2)**: QRY.009 through QRY.022 → unlocks Session 5 (v7.0 build)
- **Batch 3 (Tier 3)**: QRY.023 through QRY.028 → optional, any time

All batches or any subset is fine. Claude processes whatever is delivered.

---

## §7 — EXECUTION SEQUENCE RECOMMENDATION

### §7.1 — Optimal Sequence

**Day 1 (60-90 min)**: Tier 1
1. Start with QRY.001 (bulk ephemeris) — biggest payoff
2. QRY.002 (eclipses), QRY.003 (retrogrades) — parallel, quick
3. QRY.004 (Cycle 1 Sade Sati) — can be derived from QRY.001 if JH export is clean
4. QRY.005 (Ashtakavarga transit matrix) — once
5. QRY.006 (Saturn Kakshya dates) — skip if QRY.001 is clean
6. QRY.007 (Panchang at 34 dates) — most tedious; allocate time
7. QRY.008 (PD resolution at 5 events) — quick

Deliver Batch 1 → Claude runs Session 4 to produce LEL v1.2.

**Day 2 (60-90 min)**: Tier 2
8-14. QRY.009 through QRY.022 in any order. These are independent single-table exports.

Deliver Batch 2 → Claude runs Session 5 to produce v7.0 FORENSIC_DATA draft.

**Day 3 (optional, 30-60 min)**: Tier 3
15-28. QRY.023 through QRY.028 at leisure.

Deliver Batch 3 → incorporated in v7.0 final signoff (Session 6 CGP audit).

### §7.2 — Minimum Viable Path

If native is time-constrained, the **minimum viable** query set to unblock the next two sessions is:
- **QRY.001** (ephemeris) — indispensable
- **QRY.002** (eclipses) — indispensable
- **QRY.003** (retrogrades) — indispensable
- **QRY.004** (Cycle 1 Sade Sati) — or derive from QRY.001

That's 4 queries, ~30-40 min effort. Unlocks LEL v1.2 to confidence 0.85 (vs. full-Tier-1 target of 0.88).

Everything else can wait for Session 5+ without blocking.

### §7.3 — What Not to Skip

These three queries are hard-blocking for v7.0:
- **QRY.009 (D27)** — without this, divisional chart coverage is incomplete
- **QRY.011 (Sahams)** — without this, sensitive-point coverage fails CGP §5
- **QRY.014 (virupa aspect grid)** — without this, aspect coverage fails CGP §3

The rest of Tier 2 is strongly recommended but not hard-blocking.

---

## §8 — CHANGELOG

```yaml
v1.0 (2026-04-17, Session 3 output):
  - Initial spec covering 28 queries across 3 tiers
  - Tier 1 (8 queries): LEL v1.2 unblock — transits, eclipses, retrogrades, Cycle 1 Sade Sati, Ashtakavarga transit matrix, Saturn Kakshya, Panchang at 34 dates, PD resolution at 5 hot events
  - Tier 2 (14 queries): v7.0 CGP prerequisites — D27, Nadi-amsa, 14 additional Sahams, Pranapada, Bhrigu Bindu 60-yr progression, virupa aspect grid, Tajika monthly, deeper D12/D16/D30/D40/D45/D60, Shadbala/Shuddha Pinda/KP/Mrityu Bhaga/Yogi nakshatra verification
  - Tier 3 (6 queries): nice-to-have — Prashna frame, full Ashtakavarga reductions, Sampoorna Shadbala, Jaimini karaka audit, D9 Avastha, relationship compatibility placeholder
  - Source: FORENSIC_DATA v6.0 structure survey (24 sections) + LEL v1.1 36-event `unexamined` field inventory + Architecture §G.1.CGP 7 audit categories
  - Estimated total native effort: 2.5-4 hours across 3 days
  - Status: CLOSED (Session 3 output)

# Future amendments:
v1.1 (planned, post-first-execution):
  - Refinements based on actual JH output formats
  - Add queries for gaps discovered during Session 5 v7.0 build
```

---

**END OF EXTERNAL COMPUTATION SPEC v1.0**

*This document is L1 Facts Layer. All query outputs become sourced-to-JH facts that populate FORENSIC_DATA_v7.0 and LIFE_EVENT_LOG_v1_2. Every output carries provenance tag `source: jagannatha_hora` per Architecture §B.10.*
