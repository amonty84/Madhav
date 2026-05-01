---
artifact: CROSSCHECK_v1_0.md
canonical_id: VIMSHOTTARI_CROSSCHECK
version: 1.0
status: CURRENT
authored_by: M3-W2-B1-VIMSHOTTARI-ENGINE
authored_at: 2026-05-01
chart_id: abhisek_mohanty_primary
ground_truth: 01_FACTS_LAYER/FORENSIC_ASTROLOGICAL_DATA_v8_0.md §5.1
computation_source: 05_TEMPORAL_ENGINES/dasha/vimshottari/VIMSHOTTARI_RAW_v1_0.json
computed_by: pyswisseph 2.10.03 (Moshier ephemeris, Lahiri sidereal)
tolerance_threshold_days: 3
verdict: WITHIN_TOLERANCE
---

# Vimshottari Cross-Check — pyswisseph vs FORENSIC §5

## Inputs

- **Native:** Abhisek Mohanty (chart_id `abhisek_mohanty_primary`)
- **Birth:** 1984-02-05T10:43:00+05:30 (Bhubaneswar, Odisha, India)
- **Ayanamsha:** Lahiri (Chitrapaksha)
- **Ephemeris:** Moshier (sub-arcsecond accuracy 1800-2400 CE for Moon; no .se1 file required)
- **Convention:** 1 Vimshottari year = 365.25 days (Parashari classical Julian-year convention)

## Computed inputs at birth

| Field | Value |
|---|---|
| JD_UT | 2445735.717361 |
| Moon sidereal longitude (Lahiri) | 327.055044° |
| Nakshatra | Purva Bhadrapada (idx 24) |
| Position in nakshatra | 7.0550° |
| Fraction elapsed | 0.5291 (52.91%) |
| First MD lord | Jupiter (16y total) |
| Jupiter MD balance at birth | 7.5339 years (2752 days) |

## Mahadasha boundary cross-check

Tolerance: ±3 days per brief. Delta = computed − FORENSIC (negative = computed earlier).

| # | MD | FORENSIC end | Computed end | Δ days | Verdict |
|---|---|---|---|---|---|
| 1 | Jupiter | 1991-08-21 | 1991-08-19 | −2 | within |
| 2 | Saturn  | 2010-08-21 | 2010-08-18 | −3 | at boundary |
| 3 | Mercury | 2027-08-21 | 2027-08-19 | −2 | within |
| 4 | Ketu    | 2034-08-21 | 2034-08-18 | −3 | at boundary |
| 5 | Venus   | 2054-08-21 | 2054-08-18 | −3 | at boundary |
| 6 | Sun     | 2060-08-21 | 2060-08-18 | −3 | at boundary |

Max absolute delta: **3 days** (boundary of brief's "> 3 days" flag threshold; not exceeded).

## Interpretation of the systematic offset

The computed dates run uniformly 2–3 days **earlier** than FORENSIC. This is not random noise — it is a systematic offset from the input Moon longitude.

FORENSIC §5 records the resolution of GAP.09 (2026-04-19): "Vimshottari dasha date offset between FORENSIC (later) and JH (earlier) is closed. Offsets: +7 to +9 days (FORENSIC later), rooted in 1.4 arcmin Moon longitude difference at birth. Policy: FORENSIC dasha dates are canonical for MARSYS-JIS retrodictive fit."

The FORENSIC §5.1 boundaries reflect a Moon longitude that is ~1.4 arcmin earlier than the JH-published value. The MARSYS-JIS canonical FORENSIC dates were chosen to match retrodictive LEL events better than JH dates.

The pyswisseph + Moshier + Lahiri (Chitrapaksha) computation lands between JH (~7-9 days earlier than FORENSIC) and FORENSIC, at ~2-3 days earlier than FORENSIC. The exact landing point depends on:

- Which Lahiri ayanamsha variant the engine uses (pyswisseph defaults to the standard Chitrapaksha implementation; JH and FORENSIC may differ in the precise t-zero convention).
- Whether 365.25-day or 360-day years are used (this engine uses 365.25; some traditions use 360-day savana years).

Per the FORENSIC §5 policy, **FORENSIC dates remain canonical** for MARSYS-JIS retrodictive fit. The pyswisseph output here is a mechanically-derived independent reference: useful for cross-check, but FORENSIC is the source of truth when the engine is consulted at synthesis time.

**Operational rule for downstream M3 sessions:** when emitting dasha-related claims, use FORENSIC §5 dates as canonical. When the engine is needed for sub-period computation (AD/PD) or for non-FORENSIC-listed dasha schools, the engine output is authoritative — but cite the engine and acknowledge the ±3-day cusp window per FORENSIC §5's GAP.09 note ("precise-date claims within 10 days of a period transition should acknowledge both possible dates").

## Verdict

**WITHIN_TOLERANCE.** All six MD boundaries within the brief's ±3-day flag threshold (max delta 3 days, exact boundary; not exceeded). Cross-check passes; proceed to DB population per Deliverable 2.

## Known boundaries of this cross-check

- Antardasha and Pratyantardasha boundaries are not cross-checked here — FORENSIC §5.1 lists only MD/AD pairs, not full PD subdivisions, and the AD column in §5.1 does not enumerate all 9 ADs per MD (only those that surfaced in retrodictive analysis). A future M3-B session can extend this cross-check to AD-level using the same pyswisseph output if a fuller ground-truth source is available.
- The Yogini dasha cross-check (FORENSIC §5.2) is out of scope for this session (B2 scope).
- The Jaimini Chara dasha cross-check (FORENSIC §5.3) is out of scope for this session (Track 3).
