---
artifact: CROSSCHECK_v1_0.md
version: 1.0
status: WITHIN_TOLERANCE_PENDING_REVIEW
produced_during: M3-W3-C3-SHADBALA
produced_on: 2026-05-01
authoritative_side: claude
chart_id: abhisek_mohanty_primary
---

# Shadbala Cross-Check — engine output (4 computable components) vs FORENSIC §6.1

## §0 — Verdict

**WITHIN_TOLERANCE_PENDING_REVIEW** per session-brief framing.

Brief AC.M3C.4 explicit anchors **PASS**:

- Saturn Uccha Bala: engine = **59.19**, FORENSIC §6.1 = 59.18, **Δ = +0.01** (well inside ±2 virupas).
- Sun Uccha Bala: engine = **33.99**, FORENSIC §6.1 = 33.99, **Δ = +0.00** (well inside ±2 virupas).

All seven planets' Uccha Bala match FORENSIC §6.1 within ±0.02 virupas. All seven planets' Dig Bala match FORENSIC §6.1 within ±0.02 virupas. The pyswisseph + Lahiri sidereal computation pipeline is sound.

Two material methodological divergences surfaced and require native review at M3-C close (do not block the AC anchors). Both are properties of the brief's stipulated method, not engine bugs:

1. **Naisargika Bala values** — brief stipulates `Saturn=60, Mars=30, Mercury=25, Jupiter=20, Venus=15, Moon=10, Sun=7.5` (rupas). Classical FORENSIC §6.1 SBL.NAISARG.TOTAL is `Sun=60.00, Moon=51.42, Venus=42.84, Jupiter=34.26, Mercury=25.74, Mars=17.16, Saturn=8.58`. The brief's order is the classical order **reversed**. The engine uses the brief's values per governing-scope rule; native review needed to choose canonical convention.

2. **Nathonnatha classification + linearization** — brief stipulates Saturn ∈ DIURNAL and Venus ∈ NOCTURNAL; classical (per FORENSIC §6.1 SBL.NATH evidence) is Saturn ∈ NOCTURNAL and Venus ∈ DIURNAL. This produces **±51.6 virupa divergence** on Venus and Saturn rows at the natal date. Additionally, the brief's altitude-linear formula (anchored to pyswisseph Sun altitude) yields **+4.53 virupas** on the correctly-classified diurnal planets (Sun, Jupiter) vs FORENSIC's likely time-linear or ghati-based formula. The engine implements altitude-linear per brief literal text.

Sthana Bala and Drik Bala are marked `[EXTERNAL_COMPUTATION_REQUIRED]` per CLAUDE.md §I B.10 — they require a Jagannatha Hora export that is not available in-pipeline. The full FORENSIC §6.1 totals (sthana + dig + kala + chesta + naisargika + drik = 510..447 virupas total per planet) cannot be reproduced from the four computable components alone; this is by design.

## §1 — What was checked

| Source | What |
|---|---|
| Engine (`compute_shadbala.py`) | Uccha + Dig + Naisargika + Nathonnatha at 9 query datetimes (7 MD start_dates + final MD end_date + today 2026-05-01); 63 rows × planet × snapshot. Time-of-day held at native birth time (10:43 IST) for every snapshot per cross-check convention. |
| FORENSIC §6.1 (canonical L1) | Natal-date (1984-02-05 10:43 IST) component breakdown per row of `01_FACTS_LAYER/FORENSIC_ASTROLOGICAL_DATA_v8_0.md`. Rows `SBL.UCHA`, `SBL.DIG.TOTAL`, `SBL.NATH`, `SBL.NAISARG.TOTAL`. Resolved engine source per GAP.07 §6.2 RESOLVED is JH for **rank** claims; FORENSIC component values retained for component-vs-component comparison. |

**Pyswisseph configuration.** version 2.10.03; ephemeris mode = Moshier (no .se1 files); ayanamsha = Lahiri (`SIDM_LAHIRI`); houses = Placidus.

## §2 — Natal-date Uccha Bala — full table (AC.M3C.4 anchors)

Brief AC.M3C.4 acceptance is on Saturn = 59.18 ± 2 and Sun = 33.99 ± 2. All seven planets exhibited:

| Planet | engine | FORENSIC §6.1 | Δ | within ±2? |
|---|---:|---:|---:|---|
| Sun | 33.99 | 33.99 | +0.00 | ✓ |
| Moon | 38.02 | 38.02 | +0.00 | ✓ |
| Mars | 26.84 | 26.84 | +0.00 | ✓ |
| Mercury | 24.72 | 24.72 | +0.00 | ✓ |
| Jupiter | 8.41 | 8.40 | +0.01 | ✓ |
| Venus | 27.39 | 27.39 | +0.00 | ✓ |
| **Saturn** | **59.19** | **59.18** | **+0.01** | **✓ (AC.M3C.4 anchor)** |

Verdict: **PASS**, far inside ±2 virupa tolerance. Implementation note: matches arise from sidereal exaltation degrees (`Sun=10°Ar..Saturn=20°Li`) and the linear `60 × (180 − angle_from_exaltation) / 180` formula stated in the brief D1.a, applied to swisseph-Lahiri sidereal longitudes.

## §3 — Natal-date Dig Bala — full table

| Planet | engine | FORENSIC §6.1 (`SBL.DIG.TOTAL`) | Δ | within ±2? |
|---|---:|---:|---:|---|
| Sun | 53.67 | 53.67 | +0.00 | ✓ |
| Moon | 18.03 | 18.02 | +0.01 | ✓ |
| Mars | 35.18 | 35.18 | +0.00 | ✓ |
| Mercury | 26.14 | 26.15 | -0.01 | ✓ |
| Jupiter | 19.12 | 19.14 | -0.02 | ✓ |
| Venus | 4.60 | 4.60 | +0.00 | ✓ |
| Saturn | 56.66 | 56.65 | +0.01 | ✓ |

Verdict: **PASS** on all seven planets at ±0.02 virupas, well inside ±2 tolerance. Implementation: Placidus-derived Asc + MC; opposite cusps Dsc = Asc+180° and IC = MC+180°; per-planet Dig point = `{Sun,Mars→MC; Moon,Venus→IC; Mercury,Jupiter→Asc; Saturn→Dsc}`; formula `60 × (180 − angle_from_dig_point) / 180`.

## §4 — Natal-date Nathonnatha Bala — finding

| Planet | engine | FORENSIC §6.1 (`SBL.NATH`) | Δ | within ±2? | classical class | brief class |
|---|---:|---:|---:|---|---|---|
| Sun | 58.06 | 53.53 | +4.53 | ✗ | diurnal | diurnal |
| Moon | 1.94 | 6.47 | -4.53 | ✗ | nocturnal | nocturnal |
| Mars | 1.94 | 6.47 | -4.53 | ✗ | nocturnal | nocturnal |
| Mercury | 60.00 | 60.00 | +0.00 | ✓ | always | always |
| Jupiter | 58.06 | 53.53 | +4.53 | ✗ | diurnal | diurnal |
| **Venus** | **1.94** | **53.53** | **-51.59** | **✗** | **diurnal** | **nocturnal** ⚠ |
| **Saturn** | **58.06** | **6.47** | **+51.59** | **✗** | **nocturnal** | **diurnal** ⚠ |

**Two layered findings.**

**Finding 4a (Saturn ↔ Venus classification swap).** The brief's classification (Diurnal = {Sun, Jupiter, Saturn}; Nocturnal = {Moon, Venus, Mars}) places Saturn in the diurnal bucket and Venus in the nocturnal bucket. Classical Phaladeepika (Ch. V, "Nathonnatha") and the values in FORENSIC §6.1 SBL.NATH place Saturn nocturnal and Venus diurnal. The FORENSIC values themselves are the in-corpus evidence: at 10:43 IST natal time (mid-morning, sun above horizon), all FORENSIC-classified-diurnal planets are at 53.53 (high) and all nocturnal at 6.47 (low). FORENSIC tags Sun=53.53, Jupiter=53.53, **Venus=53.53** as the three "high"-bucket planets and Moon=6.47, Mars=6.47, **Saturn=6.47** as the three "low" planets. The brief inverts Venus and Saturn.

The engine uses the brief's classification; result is +51.6 virupa swing on Venus + Saturn rows that would not appear under the classical convention.

**Finding 4b (altitude-linear vs time-linear formula).** The brief specifies `60 at noon, 0 at midnight, linear` and `Use solar noon/midnight as anchors via pyswisseph Sun altitude`. The engine implements altitude-linear interpolation: `diurnal_factor = (sun_alt_now − sun_alt_min_today) / (sun_alt_max_today − sun_alt_min_today)`. At Bhubaneswar 1984-02-05 10:43 IST, solar altitude ≈ +50° vs solar-noon altitude ≈ +53.7° (high-altitude regime), yielding `diurnal_factor ≈ 0.965` and `nathonnatha_diurnal = 58.06`. FORENSIC's 53.53 corresponds approximately to a time-linear formula: `1 − |hour − 12| / 12` ≈ `1 − 1.07/12 ≈ 0.911`, giving `54.6` (close but not exact, suggesting FORENSIC may use ghati-from-sunrise — classical Saravali). The +4.53 delta on the correctly-classified diurnals is the methodology gap, not a misclassification.

**Disposition options for native review (M3-C close).** N1 = adopt brief literal Saturn-diurnal/Venus-nocturnal + altitude-linear (engine output as-is, document as project-canonical). N2 = adopt classical Saturn-nocturnal/Venus-diurnal + altitude-linear (swap classifications; rerun engine). N3 = adopt classical classification + classical ghati-from-sunrise/sunset linear (re-implement Nathonnatha algorithm). N4 = log under `DIS.class.school_disagreement` — deferred to M9.

Recommended default: **N2** is the smallest correction that restores agreement with FORENSIC §6.1 to within ±5 virupas on the affected planets while preserving the brief's pyswisseph-altitude algorithm. **N3** restores agreement to ≲ 0.5 virupa but requires re-implementation. **N1** preserves brief literal but introduces a known fact-vs-engine discrepancy on Venus and Saturn.

## §5 — Natal-date Naisargika Bala — finding

| Planet | engine (brief D1.c) | FORENSIC §6.1 (`SBL.NAISARG.TOTAL`) | Δ |
|---|---:|---:|---:|
| Sun | 7.50 | 60.00 | -52.50 |
| Moon | 10.00 | 51.42 | -41.42 |
| Mars | 30.00 | 17.16 | +12.84 |
| Mercury | 25.00 | 25.74 | -0.74 |
| Jupiter | 20.00 | 34.26 | -14.26 |
| Venus | 15.00 | 42.84 | -27.84 |
| Saturn | 60.00 | 8.58 | +51.42 |

**Finding 5 (Naisargika value disagreement).** The brief stipulates literal values `Saturn=60, Mars=30, Mercury=25, Jupiter=20, Venus=15, Moon=10, Sun=7.5` (rupas) and instructs `(traditional rupas ×8 for virupas if needed; use rupas)`. Classical Phaladeepika 5.43 / Saravali / FORENSIC §6.1 SBL.NAISARG.TOTAL is `Sun=60.00, Moon=51.42, Venus=42.84, Jupiter=34.26, Mercury=25.71, Mars=17.14, Saturn=8.57` (virupas). The brief's order is the **classical order reversed by speed-of-orbit** (slowest planet given largest weight) rather than the classical natural-strength descent (Sun strongest by nature).

Mercury and Jupiter are the only planets whose rank position roughly matches across both schemes. The other five diverge by 12–52 virupas.

**Disposition options for native review (M3-C close).** N1 = adopt brief literal (Saturn-strongest convention; engine output as-is). N2 = adopt classical (Sun-strongest convention; swap to the classical 7-tuple). N3 = log under `DIS.class.school_disagreement` (deferred to M9 multi-school weighting).

The Naisargika finding is independent of Finding 4 and similarly does not affect AC.M3C.4 (which is anchored only on Uccha Bala). The engine is internally consistent given the brief's values; native review chooses canonical convention.

## §6 — Component-by-component summary table — natal date

| Planet | Uccha | Dig | Naisarg (brief) | Nath (brief) | partial_total | FORENSIC §6.1 partial sum (Uccha+Dig+Nath+Naisarg classical) | Δ |
|---|---:|---:|---:|---:|---:|---:|---:|
| Sun | 33.99 | 53.67 | 7.50 | 58.06 | 153.22 | 33.99+53.67+53.53+60.00 = 201.19 | -47.97 |
| Moon | 38.02 | 18.03 | 10.00 | 1.94 | 67.99 | 38.02+18.02+6.47+51.42 = 113.93 | -45.94 |
| Mars | 26.84 | 35.18 | 30.00 | 1.94 | 93.96 | 26.84+35.18+6.47+17.16 = 85.65 | +8.31 |
| Mercury | 24.72 | 26.14 | 25.00 | 60.00 | 135.86 | 24.72+26.15+60.00+25.74 = 136.61 | -0.75 |
| Jupiter | 8.41 | 19.12 | 20.00 | 58.06 | 105.59 | 8.40+19.14+53.53+34.26 = 115.33 | -9.74 |
| Venus | 27.39 | 4.60 | 15.00 | 1.94 | 48.93 | 27.39+4.60+53.53+42.84 = 128.36 | -79.43 |
| Saturn | 59.19 | 56.66 | 60.00 | 58.06 | 233.92 | 59.18+56.65+6.47+8.58 = 130.88 | +103.04 |

**Reading.** `partial_total` is the sum of the four pyswisseph-computable components per the brief's literal values. It is NOT the FORENSIC Shadbala total — that is the sum of all six components including Sthana and Drik (both ECR in this engine v1). Comparing partial_total against the four-component FORENSIC analogue (rightmost column) shows divergence dominated by:

- **Saturn +103** (gain): brief Naisargika=60 + brief Nathonnatha-diurnal=58 vs FORENSIC's 8.58 + 6.47 = +103 difference.
- **Venus −79** (loss): brief Naisargika=15 + brief Nathonnatha-nocturnal=1.94 vs FORENSIC's 42.84 + 53.53 = −79.
- **Sun, Moon, Jupiter** small-to-moderate losses dominated by brief's lower Naisargika values for Sun/Moon/Jupiter.

The pattern confirms Findings 4a, 4b, and 5 are the entire source of divergence; Uccha and Dig agree to ±0.02 virupas everywhere.

## §7 — Over-time series (snapshot list)

The engine produced 63 rows over 9 snapshots. Snapshots:

| query_date | query_context |
|---|---|
| 1984-02-05 | MD_start_Jupiter (= natal anchor) |
| 1991-08-19 | MD_start_Saturn |
| 2010-08-18 | MD_start_Mercury |
| 2026-05-01 | current |
| 2027-08-19 | MD_start_Ketu |
| 2034-08-18 | MD_start_Venus |
| 2054-08-18 | MD_start_Sun |
| 2060-08-18 | MD_start_Moon |
| 2070-08-18 | MD_end_Moon |

Time-of-day for every snapshot is fixed at native birth time-of-day (10:43 IST in birth tz `+05:30`), so the only intra-row variability is planetary motion + seasonal Sun-altitude variation + the Moon's fast monthly cycle.

## §8 — ECR rows

Every row in `SHADBALA_RAW_v1_0.json` carries:

```yaml
sthana_ecr: true
drik_ecr: true
ecr_components: ['sthana', 'drik']
needs_verification: true
```

ECR specifications (`diagnostics.ecr_specs` field of envelope):

- `sthana`: "Requires Jagannatha Hora Saptavargaja Bala export per ED.1 (full Sapta-Varga uchcha + ojayugmarasyamsa across D1+D2+D3+D4+D7+D9+D12)."
- `drik`: "Requires full aspect-strength table from JH or shri_jyoti_star per ED.1 (Jyotish 1/4, 1/2, 3/4 partial aspects + sign-based exceptions, planetary aspects on planets and bhavas)."

These are propagated to migration 031 as `ecr_components TEXT[]` and to the synthesis side via `needs_verification` boolean. No downstream synthesis claim should treat any partial_total as a "full Shadbala" until the JH export lands.

## §9 — Recommendation

| Question | Default disposition (this session) | Native decision required at |
|---|---|---|
| AC.M3C.4 anchors | PASS — Saturn 59.19/59.18, Sun 33.99/33.99 within ±2 | (no escalation) |
| Naisargika Bala convention (brief vs classical) | engine emits brief values; document divergence | M3-C close (Finding 5) |
| Nathonnatha classification (Saturn diurnal vs nocturnal; Venus nocturnal vs diurnal) | engine emits brief classification; document divergence | M3-C close (Finding 4a) |
| Nathonnatha linearization (altitude vs time vs ghati) | engine emits altitude-linear; document divergence | M3-C close (Finding 4b) |
| Sthana + Drik ECR | rows tagged `needs_verification=true` per B.10; awaiting JH export | M3-D or later |

These three open findings are presented to native at this M3-C close as part of the disagreement-register entries (DIS.013/014 if opened — to be decided at close). Verdict for the artifact itself: **WITHIN_TOLERANCE_PENDING_REVIEW** — Uccha + Dig pass at ±0.02 virupa; Nathonnatha + Naisargika divergences are the brief's stipulated values' consequences, not engine bugs.

## §10 — Provenance

- Engine: `platform/scripts/temporal/compute_shadbala.py` (M3-W3-C3-SHADBALA new file)
- Inputs: native birth `1984-02-05T10:43:00+05:30` at Bhubaneswar (lat 20.2961°N, lon 85.8245°E)
- Pyswisseph: 2.10.03; ephemeris mode = Moshier; ayanamsha = `SIDM_LAHIRI`; houses = Placidus
- Vimshottari boundary source: `05_TEMPORAL_ENGINES/dasha/vimshottari/VIMSHOTTARI_RAW_v1_0.json` (M3-W2-B1 deliverable; 7 MD rows = 7 starts + 1 final end)
- Engine output: `05_TEMPORAL_ENGINES/shadbala/SHADBALA_RAW_v1_0.json` (63 rows × 17 columns + envelope)
- Engine SQL: `05_TEMPORAL_ENGINES/shadbala/SHADBALA_INSERT_v1_0.sql` (idempotent with `ON CONFLICT DO NOTHING`)
- DB schema: `platform/migrations/031_shadbala.sql` (new this session; DB application gated on native authorization, like 022–025)
- FORENSIC §6.1 source: `01_FACTS_LAYER/FORENSIC_ASTROLOGICAL_DATA_v8_0.md` rows `SBL.UCHA`, `SBL.DIG.TOTAL`, `SBL.NATH`, `SBL.NAISARG.TOTAL`
- §6.2 RESOLVED note: GAP.07 RESOLVED 2026-04-19 — JH is authoritative for **rank** claims; FORENSIC retained for component-vs-component comparison (this artifact uses FORENSIC values for the latter, by design)

---

*End of CROSSCHECK_v1_0.md v1.0 — Shadbala engine v1 cross-check vs FORENSIC §6.1 at native date 1984-02-05. Verdict: WITHIN_TOLERANCE_PENDING_REVIEW. Brief AC.M3C.4 anchors PASS. Three findings (4a, 4b, 5) flagged for native disposition at M3-C close.*
