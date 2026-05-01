---
artifact: CROSSCHECK_v1_0.md
version: 1.0
status: OPEN_FOR_NATIVE_REVIEW
produced_during: M3-W3-C1-JAIMINI-DASHAS
produced_on: 2026-05-01
authoritative_side: claude
chart_id: ABHISEK_MOHANTY
---

# Jaimini Dasha Cross-Check — engine output vs FORENSIC §5.3

## §0 — Verdict

**FAIL.** Both engine variants (`brief`, `bphs`) diverge from FORENSIC §5.3 K.N. Rao
Padakrama Chara Dasha at the Mahadasha-start-date level by far more than the 7-day
threshold the brief specifies. **GOLDEN fixture is NOT written this session.** DB
population is **NOT performed**; SQL inserts are emitted as files only, flagged for
coordinate-with-B1 review.

The divergences are not implementation bugs — they reflect **different traditions**
producing different answers from the same chart. Until the native chooses a canonical
tradition, no engine output can stand.

## §1 — What was checked

| Source | What |
|---|---|
| Engine A (`compute_chara.py` variant=brief) | Hardcoded sign-duration constants from session brief (Ar=7..Pi=12); MD sequence forward zodiacal from AK sign |
| Engine B (`compute_chara.py` variant=bphs)  | BPHS sign-to-lord count rule (movable forward, fixed/dual backward; count−1; 0→12); MD sequence forward zodiacal from AK sign |
| FORENSIC §5.3 (canonical) | K.N. Rao Padakrama Chara Dasha — 144 entries (DSH.C.001 through DSH.C.144); MD sequence forward zodiacal from Lagna sign; durations chart-specific |

For Narayana, FORENSIC has no published table; nothing to cross-check against.
External acharya / Jagannatha Hora export is required for Narayana verification.

## §2 — Atmakaraka and Lagna agreement (PASS)

| Field | FORENSIC §10.1 / §1.2 | compute_chara.py (pyswisseph + Lahiri) | Δ |
|---|---|---|---|
| Atmakaraka planet | Moon | Moon | match |
| Atmakaraka degree | 27°02′ Aquarius | 27.0550° (= 27°03′18″) Aquarius | +1′18″ (within rounding) |
| Lagna sign | Aries | Aries | match |
| Lagna degree | 12°23′55″ | 12.4212° (= 12°25′16″) | +1′21″ (within rounding) |

This is well within the 1.4-arcmin Moon-longitude window documented at GAP.09 (FORENSIC
§5 cusp zone). The sidereal computation pipeline is sound.

## §3 — Chara MD-start-date deltas vs FORENSIC §5.3

FORENSIC §5.3 sequence is **Aries → Taurus → Gemini → Cancer → Leo → Virgo → Libra →
Scorpio → Sagittarius → Capricorn → Aquarius → Pisces**, starting at the native's
**Lagna sign** (Aries) on 1984-02-05.

Engine variants start the sequence at the **Atmakaraka sign** (Aquarius), per the
"Sanjay Rath / BPHS-Jaimini synthesis" rule named in the session brief. This is the
single largest source of divergence.

### §3.1 — variant=brief deltas

| Sign | FORENSIC start | FORENSIC end | engine start | engine end | Δ start (days) | Δ end (days) |
|---|---|---|---|---|---:|---:|
| Aries | 1984-02-05 | 1990-02-05 | 2007-02-04 | 2014-02-03 | **+8400** | **+8764** |
| Taurus | 1990-02-05 | 1997-02-05 | 2014-02-03 | 2020-02-03 | **+8764** | **+8398** |
| Gemini | 1997-02-05 | 2004-02-05 | 2020-02-03 | 2025-02-02 | **+8398** | **+7668** |
| Cancer | 2004-02-05 | 2009-02-05 | 2025-02-02 | 2029-02-02 | **+7668** | **+7302** |
| Leo | 2009-02-05 | 2016-02-05 | 2029-02-02 | 2032-02-02 | **+7302** | **+5841** |
| Virgo | 2016-02-05 | 2024-02-05 | 2032-02-02 | 2040-02-02 | **+5841** | **+5841** |
| Libra | 2024-02-05 | 2026-02-05 | 2040-02-02 | 2049-02-01 | **+5841** | **+8397** |
| Scorpio | 2026-02-05 | 2037-02-05 | 2049-02-01 | 2059-02-01 | **+8397** | **+8031** |
| Sagittarius | 2037-02-05 | 2049-02-05 | (not reached by 2050 horizon) | — | — | — |
| Capricorn | 2049-02-05 | 2052-02-05 | (not reached) | — | — | — |
| Aquarius | 2052-02-05 | 2056-02-05 | 1984-02-05 | 1995-02-04 | **−24837** | **−22281** |
| Pisces | 2056-02-05 | 2059-02-05 | 1995-02-04 | 2007-02-04 | **−22281** | **−18994** |

**Every row exceeds the 7-day threshold by orders of magnitude.**

### §3.2 — variant=bphs deltas

| Sign | FORENSIC start | engine start | Δ start (days) |
|---|---|---|---:|
| Aries | 1984-02-05 | 1997-02-04 | **+4748** |
| Taurus | 1990-02-05 | 2003-02-04 | **+4747** |
| Gemini | 1997-02-05 | 2008-02-04 | **+4016** |
| Cancer | 2004-02-05 | 2015-02-03 | **+4016** |
| Leo | 2009-02-05 | 2022-02-02 | **+4745** |
| Virgo | 2016-02-05 | 2029-02-01 | **+4745** |
| Libra | 2024-02-05 | 2033-02-01 | **+3284** |
| Scorpio | 2026-02-05 | 2035-02-01 | **+3283** |
| Sagittarius | 2037-02-05 | 2036-02-01 | **−370** |
| Capricorn | 2049-02-05 | 2048-02-01 | **−370** |
| Aquarius | 2052-02-05 | 1984-02-05 | **−24837** |
| Pisces | 2056-02-05 | 1988-02-05 | **−24837** |

**Every row exceeds the 7-day threshold.**

## §4 — Root-cause analysis

The divergences trace to **two structural choices** the brief did not unambiguously
resolve. Each choice is a known fork in the Jaimini-tradition literature; the
session brief chose the BPHS-Sanjay-Rath path on point (a) and stipulated values on
point (b) that match neither well-known tradition.

### Cause 1 — Sequence start sign (AK vs Lagna)

The brief instructs:
> Atmakaraka = planet with highest longitude in its sign … Use sidereal positions
> (Lahiri) from pyswisseph
> Chara Rashi sequence: determine sign lord of each sign, count from sign, derive
> dasha order for odd/even signs per Jaimini rule

This describes the **Sanjay-Rath / BPHS Chara Dasha** which begins MD at the AK sign.
FORENSIC §5.3 uses the **K.N. Rao Padakrama** variant which begins MD at the Lagna
sign. The two conventions co-exist in respected lineages and **produce different
sequences for the same chart**.

For this native:
- AK = Moon at Aquarius 27°02′ → BPHS-Sanjay-Rath sequence: Aquarius → Pisces → Aries → ...
- Lagna = Aries 12°24′ → K.N. Rao Padakrama sequence: Aries → Taurus → Gemini → ...

### Cause 2 — Sign-duration rule

The brief stipulates **hardcoded constants** (Ar=7, Ta=6, Ge=5, Cn=4, Le=3, Vi=8,
Li=9, Sc=10, Sg=9, Cp=10, Aq=11, Pi=12) and frames them as "standard Jaimini Chara".
**These values are not chart-derivable and do not match standard Jaimini
sign-to-lord counts for this native:**

| Sign | Brief constant | BPHS rule for this chart | FORENSIC §5.3 K.N. Rao |
|---|---:|---:|---:|
| Aries | 7 | 6 | **6** |
| Taurus | 6 | 5 | **7** |
| Gemini | 5 | 7 | **7** |
| Cancer | 4 | 7 | **5** |
| Leo | 3 | 7 | **7** |
| Virgo | 8 | 4 | **8** |
| Libra | 9 | 2 | **2** |
| Scorpio | 10 | 1 | **11** |
| Sagittarius | 9 | 12 | **12** |
| Capricorn | 10 | 9 | **3** |
| Aquarius | 11 | 4 | **4** |
| Pisces | 12 | 3 | **3** |

The K.N. Rao Padakrama column matches some BPHS-rule outputs (Aries, Aquarius,
Sagittarius, Pisces, Libra) and diverges on others (Taurus, Cancer, Leo, Virgo,
Scorpio, Capricorn). This suggests Padakrama applies **additional rules** beyond
the simple sign-to-lord count — likely involving the AK sign as a reference and
exception clauses (lord-in-own-sign, lord-in-7th-or-1st, debilitation/exaltation
adjustments) per K.N. Rao's published text.

## §5 — Recommendation

The session brief named the right concerns ("If any computation step requires JH
verification … mark those rows: needs_verification: true … Do NOT fabricate uncertain
values"). All emitted rows carry `needs_verification: true` with a per-row
`verification_note` citing this artifact.

**Native decision required.** Three plausible paths, each with implications:

| Option | What it means | Implications |
|---|---|---|
| **N1 — Adopt FORENSIC §5.3 K.N. Rao Padakrama** | Discard `brief` and `bphs` engine outputs; canonicalize FORENSIC §5.3 as the sole Chara source. Engine becomes a parser of the existing 144-row table, not a from-scratch computer. | Eliminates discrepancy. Engine cannot extend beyond 2059. K.N. Rao tradition becomes the project's stated Chara-school. |
| **N2 — Adopt BPHS Sanjay-Rath (variant=bphs)** | Update FORENSIC §5.3 to BPHS-Sanjay-Rath sequence (or note it as an alternate-tradition record); engine becomes the canonical computer; document Padakrama as alternate. | Engine extensible; loses retrodictive-fit work done in B.5 sessions 16-25 (which used FORENSIC §5.3 dates). DIS.class.school_disagreement opens for every event whose interpretation depended on Padakrama dates. |
| **N3 — Carry both** | Maintain FORENSIC §5.3 (Padakrama) and engine BPHS variant side-by-side as DIS.class.school_disagreement entries. M9 multi-school triangulation resolves at learning layer. | Aligns with PHASE_M3_PLAN §3.3 "every disagreement is *logged*, not *resolved by operator preference*; resolution waits for M9". Most conservative; DB carries `system='chara_padakrama'` and `system='chara_bphs'` as separate label sets. |

**Recommended:** **N3** as default per phase-plan policy (M3-C-class disagreements
log, not resolve). N1 may be appropriate if native confirms K.N. Rao Padakrama as
the project's chosen lineage and the engine's role is reduced to verification of
extension rows beyond FORENSIC §5.3's 2059 horizon.

## §6 — Status

| Field | Value |
|---|---|
| Cross-check verdict | **FAIL** (both variants > 7-day threshold) |
| GOLDEN fixture | **NOT WRITTEN** — gated per session brief instruction |
| dasha_periods table inserts | **NOT EXECUTED** — SQL files emitted only |
| DIS register entry | **TO BE OPENED** at M3-C close (DIS.class.school_disagreement) per PHASE_M3_PLAN §3.3 |
| Native decision required at | M3-C close (per PHASE_M3_PLAN §5 and §3.3 AC.M3C.5) |

## §7 — Provenance

- Engine outputs: `05_TEMPORAL_ENGINES/dasha/jaimini/CHARA_RAW_v1_0.json`,
  `NARAYANA_RAW_v1_0.json`
- FORENSIC source: `01_FACTS_LAYER/FORENSIC_ASTROLOGICAL_DATA_v8_0.md` §5.3 (DSH.C.001..144)
- Atmakaraka source: same file §10.1 (`KRK.C.ATMA = Moon, 27°02′`)
- Lagna source: same file §1.2 (`MET.LAGNA.SIGN = Aries`, `MET.LAGNA.DEG = 12°23′55″`)
- Engine: pyswisseph 2.10.x, Lahiri ayanamsha (`SIDM_LAHIRI`), Placidus houses
- Chart inputs: birth 1984-02-05T10:43:00+05:30, lat 20.2961, lon 85.8245 (Bhubaneswar)
