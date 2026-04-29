---
document: FORENSIC DATA v7.0 SUPPLEMENT — v6.0 PLUS COMPUTED ADDITIONS
project: MARSYS-JIS
layer: L1 (Facts Layer)
artifact_id: FORENSIC_DATA_v7_0_SUPPLEMENT
version: 7.0 (supplement; v6.0 remains authoritative base)
status: CLOSED (Session 5 output)
relation_to_v6: v7.0 = v6.0 (FORENSIC_ASTROLOGICAL_DATA_v6.0_ABHISEK_MOHANTY.md, unchanged) + this supplement
computation_source: Swiss Ephemeris 2.10.03 (Lahiri sidereal) + classical formulas
provenance_tag: All computed cells tagged `source: swiss_ephemeris_computed` per Architecture B.10
expose_to_chat: false
native_id: "abhisek"
---

# FORENSIC DATA v7.0 SUPPLEMENT

This file supplements `FORENSIC_ASTROLOGICAL_DATA_v6.0_ABHISEK_MOHANTY.md` with sections specified in Architecture §D.1 that were missing or partial in v6.0. Together, v6.0 + this supplement = Facts Layer v7.0 as referenced by all downstream L2+ work.

---

## §V7.A — SADE SATI CYCLE 1 (ADDITION TO v6.0 §21)

v6.0 §21 has only Cycle 2 (2020-2028). Cycle 1 was native's adolescent phase — critical for retrodictive tagging of events like EVT.1995.XX.XX.01 (headaches onset) and EVT.1998.02.16.01 (R#1 start age 14). Computed from Swiss Ephemeris Saturn transits.

Native's Moon = Aquarius 27°02'. Sade Sati:
- Rising = Saturn in Capricorn (12th from Moon)
- Peak   = Saturn in Aquarius (on Moon)
- Setting = Saturn in Pisces (2nd from Moon)

### Cycle 1 — Adolescent/Youth Phase (1990-1998)

| ID | Saturn Sign | Start | End | Phase |
| --- | --- | --- | --- | --- |
| `TRS.SS.C1.P01` | Capricorn | 1990-03-21 | 1990-06-21 | Rising |
| `TRS.SS.C1.P02` | Capricorn | 1990-12-15 | 1993-03-06 | Rising |
| `TRS.SS.C1.P03` | Aquarius | 1993-03-06 | 1993-10-16 | Peak |
| `TRS.SS.C1.P04` | Capricorn | 1993-10-16 | 1993-11-10 | Rising (retro re-entry) |
| `TRS.SS.C1.P05` | Aquarius | 1993-11-10 | 1995-06-03 | Peak |
| `TRS.SS.C1.P06` | Pisces | 1995-06-03 | 1995-08-10 | Setting |
| `TRS.SS.C1.P07` | Aquarius | 1995-08-10 | 1996-02-17 | Peak (retro re-entry) |
| `TRS.SS.C1.P08` | Pisces | 1996-02-17 | 1998-04-18 | Setting |

**Cycle 1 span**: 1990-03-21 to 1998-04-18 (~8 years with retrograde loops)

**Key retrodictive tags (update to LEL):**
- EVT.1995.XX.XX.01 (headaches onset ~1995): in C1.P05 Peak Aquarius ON natal Moon — classical mental-pressure peak. Strong retrodictive confirmation of headache-onset being Sade Sati peak-triggered.
- EVT.1998.02.16.01 (R#1 start Feb 16, 1998): in C1.P08 Setting Pisces — emotional maturation phase, exit of Sade Sati peak weight.

(For full lifetime Sade Sati + Kantaka Shani periods, see `SADE_SATI_CYCLES_ALL.md`.)

---

## §V7.B — D27 BHAMSA (SAPTAVIMSHAMSA) — NEW DIVISIONAL CHART

D27 is the strength/weakness divisional chart; also used for general ruin/prosperity reading. Missing from v6.0 §3.* (which has D2, D3, D4, D7, D9, D10, D12, D16, D20, D24, D30, D40, D45, D60). Completes v7.0 divisional coverage.

**Rule used**: BPHS Ch.7 Sl.14 — commence from Aries for fiery signs, Cancer for earthy, Libra for airy, Capricorn for watery. Each sign's 30° divided into 27 Bhamsas of 1°06'40".

### §V7.B.1 — D27 Planet Positions

| ID | Planet | D1 Position | D1 Sign Element | Bhamsa Portion (0-26) | D27 Sign | Vargottama (D1=D27)? |
| --- | --- | --- | --- | --- | --- | --- |
| `D27.SUN` | Sun | Capricorn 21°57'24" | Earth | 19 | Aquarius | no |
| `D27.MOON` | Moon | Aquarius 27°03'18" | Air | 24 | Libra | no |
| `D27.MARS` | Mars | Libra 18°30'57" | Air | 16 | Aquarius | no |
| `D27.MERCURY` | Mercury | Capricorn 00°49'43" | Earth | 0 | Cancer | no |
| `D27.JUPITER` | Jupiter | Sagittarius 09°46'50" | Fire | 8 | Sagittarius | YES |
| `D27.VENUS` | Venus | Sagittarius 19°09'48" | Fire | 17 | Virgo | no |
| `D27.SATURN` | Saturn | Libra 22°25'48" | Air | 20 | Gemini | no |
| `D27.RAHU` | Rahu | Taurus 19°01'58" | Earth | 17 | Sagittarius | no |
| `D27.KETU` | Ketu | Scorpio 19°01'58" | Water | 17 | Gemini | no |
| `D27.LAGNA` | Lagna | Aries 12°25'52" | Fire | 11 | Pisces | no |

**D27 Vargottama count**: 1/10 — Jupiter

**Interpretation context**: D27 strength: more Vargottama = more stable overall chart-force. Classical reading: D27 reveals hidden strengths/weaknesses and ultimate-ruin-vs-prosperity trajectory.

---

## §V7.C — NADI-AMSA POSITIONS (1/150° SUBDIVISION)

Each sign has 150 nadi-amsas of 0°12' (12 arc-minutes) each. Total 1,800 nadi-amsas in zodiac. Used in Bhrigu Nadi / Nadi-jyotish style analysis for fine-grain karmic reading.

| ID | Planet | Abs Long | Sign | Nadi-Amsa # (within sign, 1-150) | Global # (1-1800) | Nadi-Amsa Range |
| --- | --- | --- | --- | --- | --- | --- |
| `NA.SUN` | Sun | 291.9568° | Capricorn | 110 | 1460 | 21°48' — 22°00' |
| `NA.MOON` | Moon | 327.0550° | Aquarius | 136 | 1636 | 27°00' — 27°12' |
| `NA.MARS` | Mars | 198.5159° | Libra | 93 | 993 | 18°24' — 18°36' |
| `NA.MERCURY` | Mercury | 270.8289° | Capricorn | 5 | 1355 | 0°48' — 1°00' |
| `NA.JUPITER` | Jupiter | 249.7807° | Sagittarius | 49 | 1249 | 9°36' — 9°48' |
| `NA.VENUS` | Venus | 259.1633° | Sagittarius | 96 | 1296 | 19°00' — 19°12' |
| `NA.SATURN` | Saturn | 202.4301° | Libra | 113 | 1013 | 22°24' — 22°36' |
| `NA.RAHU` | Rahu | 49.0330° | Taurus | 96 | 246 | 19°00' — 19°12' |
| `NA.KETU` | Ketu | 229.0330° | Scorpio | 96 | 1146 | 19°00' — 19°12' |
| `NA.LAGNA` | Lagna | 12.4311° | Aries | 63 | 63 | 12°24' — 12°36' |

---

## §V7.D — ADDITIONAL SAHAMS (17 NEW + 6 FROM v6.0 = 23 TOTAL)

v6.0 §12.2 has 6 sahams (Punya, Rajya, Karma, Labha, Vivaha, Putra). This supplement adds 17 more from classical Tajika / Uttara Kalamrita.

**All formulas are day-birth variants** (native's Sun above horizon at 10:43 AM IST).

| ID | Saham | Theme | Formula (Day Birth) | Result Abs Long | Sign | Degree | Nakshatra |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `SAH.PITRI` | Pitri | Father | (Saturn - Sun) + Asc | 282.9044° | Capricorn | 12.90° | Shravana P1 |
| `SAH.MATRI` | Matri | Mother | (Moon - Venus) + Asc | 80.3229° | Gemini | 20.32° | Punarvasu P1 |
| `SAH.BHRATRI` | Bhratri | Siblings | (Jupiter - Saturn) + Asc | 59.7818° | Taurus | 29.78° | Mrigashira P2 |
| `SAH.MRITYU` | Mrityu | Death | (8th cusp - Moon) + Asc | 267.8073° | Sagittarius | 27.81° | Uttara Ashadha P1 |
| `SAH.ROGA` | Roga | Disease | Asc - Saturn + Asc | 182.4322° | Libra | 2.43° | Chitra P3 |
| `SAH.KALI` | Kali | Misery | (Jupiter - Mars) + Asc | 63.6959° | Gemini | 3.70° | Mrigashira P4 |
| `SAH.MAHATMYA` | Mahatmya | Greatness | Asc - Mars + Asc | 186.3464° | Libra | 6.35° | Chitra P4 |
| `SAH.YASAS` | Yasas | Fame | (Jupiter - Punya) + Asc | 214.6825° | Scorpio | 4.68° | Anuradha P1 |
| `SAH.ARTHA` | Artha | Material | (2nd cusp - 2nd Lord) + Asc | 155.6990° | Virgo | 5.70° | Uttara Phalguni P3 |
| `SAH.BANDHU` | Bandhu | Kin | (Moon - Mercury) + Asc | 68.6573° | Gemini | 8.66° | Ardra P1 |
| `SAH.SASTRA` | Sastra | Disputes | (Venus - Mars) + Asc | 73.0785° | Gemini | 13.08° | Ardra P2 |
| `SAH.SAMARTHA` | Samartha | Capability | (Mars - Lagna Lord) + Asc | 12.4311° | Aries | 12.43° | Ashwini P4 |
| `SAH.VYAPARA` | Vyapara | Business | (Mars - Sun) + Asc | 278.9903° | Capricorn | 8.99° | Uttara Ashadha P4 |
| `SAH.PARADESA` | Paradesa | Foreign | (9th cusp - 9th Lord) + Asc | 15.0816° | Aries | 15.08° | Bharani P1 |
| `SAH.JADYA` | Jadya | Inertia | (Saturn - Jupiter) + Asc | 325.0805° | Aquarius | 25.08° | Purva Bhadrapada P2 |
| `SAH.SHOKA` | Shoka | Grief | (Asc - Rahu) + Asc | 335.8293° | Pisces | 5.83° | Uttara Bhadrapada P1 |
| `SAH.SRADDHA` | Sraddha | Faith | (Mars - Moon) + Asc | 243.8921° | Sagittarius | 3.89° | Moola P2 |

**Retrodictive highlights** (tie to LEL events):
- **Saham Pitri (Father)** in Capricorn 12.90° — relates to EVT.2013.XX.XX.01 (father's kidney disease onset) and EVT.2018.11.28.01 (father passed)
- **Saham Mrityu (Death)** in Sagittarius 27.81° — transits activating this point are classically hazardous periods
- **Saham Paradesa (Foreign)** in Aries 15.08° — relates to EVT.2010.12.XX.01 (Thailand) and EVT.2019.05.XX.01 (US move)
- **Saham Vyapara (Business)** in Capricorn 8.99° — relates to EVT.2023.07.XX.01 (Marsys founded) and EVT.2024.02.16.01 (sand mine launch)
- **Saham Yasas (Fame)** in Scorpio 4.68° — career-recognition sensitivity point

---

## §V7.E — PRANAPADA LAGNA (7TH SPECIAL LAGNA)

v6.0 §12.1 has 6 of 7 target special lagnas (Bhava, Hora, Ghati, Indu, Shree, Varnada). Pranapada was missing. Formula: `Pranapada = Sun_longitude + (time_from_sunrise_in_ghatis × 6°) mod 360`.

| ID | Component | Value |
| --- | --- | --- |
| `LAG.PRANAPADA.FORMULA` | Formula | Sun + (ghatis from sunrise × 6°) mod 360 |
| `LAG.PRANAPADA.SUNRISE.UTC` | Sunrise UTC hours | 0.7833 |
| `LAG.PRANAPADA.SUNRISE.IST` | Sunrise IST | 6.2833 hours = ~06:16 IST |
| `LAG.PRANAPADA.FROM_SUNRISE_GHATIS` | Time from sunrise (ghatis) | 11.0833 |
| `LAG.PRANAPADA.ABS` | Pranapada Abs Long | 358.4568° |
| `LAG.PRANAPADA.SIGN` | Sign | Pisces |
| `LAG.PRANAPADA.DEG` | Degree | 28.46° |
| `LAG.PRANAPADA.NAKSHATRA` | Nakshatra | Revati Pada 4 |

**Note**: Multiple formula variants for Pranapada exist across schools. This implementation uses the BPHS-/Tajika-common formula. Suggest JH spot-verify if Pranapada becomes critical for any reading.

---

## §V7.F — BHRIGU BINDU 60-YEAR PROGRESSION

v6.0 §11.2 has natal Bhrigu Bindu (Libra 8°04' Swati Pada 1). Progression: ~6° forward per year (completes 360° cycle in 60 years).

| Age | Year | BB Abs Long | Sign | Degree | Nakshatra | House from Lagna (Aries) |
| --- | --- | --- | --- | --- | --- | --- |
| 0 | 1984 | 188.0440° | Libra | 8.04° | Swati P1 | 7H |
| 1 | 1985 | 194.0440° | Libra | 14.04° | Swati P3 | 7H |
| 2 | 1986 | 200.0440° | Libra | 20.04° | Vishakha P1 | 7H |
| 3 | 1987 | 206.0440° | Libra | 26.04° | Vishakha P2 | 7H |
| 4 | 1988 | 212.0440° | Scorpio | 2.04° | Vishakha P4 | 8H |
| 5 | 1989 | 218.0440° | Scorpio | 8.04° | Anuradha P2 | 8H |
| 6 | 1990 | 224.0440° | Scorpio | 14.04° | Anuradha P4 | 8H |
| 7 | 1991 | 230.0440° | Scorpio | 20.04° | Jyeshtha P2 | 8H |
| 8 | 1992 | 236.0440° | Scorpio | 26.04° | Jyeshtha P3 | 8H |
| 9 | 1993 | 242.0440° | Sagittarius | 2.04° | Moola P1 | 9H |
| 10 | 1994 | 248.0440° | Sagittarius | 8.04° | Moola P3 | 9H |
| 11 | 1995 | 254.0440° | Sagittarius | 14.04° | Purva Ashadha P1 | 9H |
| 12 | 1996 | 260.0440° | Sagittarius | 20.04° | Purva Ashadha P3 | 9H |
| 13 | 1997 | 266.0440° | Sagittarius | 26.04° | Purva Ashadha P4 | 9H |
| 14 | 1998 | 272.0440° | Capricorn | 2.04° | Uttara Ashadha P2 | 10H |
| 15 | 1999 | 278.0440° | Capricorn | 8.04° | Uttara Ashadha P4 | 10H |
| 16 | 2000 | 284.0440° | Capricorn | 14.04° | Shravana P2 | 10H |
| 17 | 2001 | 290.0440° | Capricorn | 20.04° | Shravana P4 | 10H |
| 18 | 2002 | 296.0440° | Capricorn | 26.04° | Dhanishta P1 | 10H |
| 19 | 2003 | 302.0440° | Aquarius | 2.04° | Dhanishta P3 | 11H |
| 20 | 2004 | 308.0440° | Aquarius | 8.04° | Shatabhisha P1 | 11H |
| 21 | 2005 | 314.0440° | Aquarius | 14.04° | Shatabhisha P3 | 11H |
| 22 | 2006 | 320.0440° | Aquarius | 20.04° | Purva Bhadrapada P1 | 11H |
| 23 | 2007 | 326.0440° | Aquarius | 26.04° | Purva Bhadrapada P2 | 11H |
| 24 | 2008 | 332.0440° | Pisces | 2.04° | Purva Bhadrapada P4 | 12H |
| 25 | 2009 | 338.0440° | Pisces | 8.04° | Uttara Bhadrapada P2 | 12H |
| 26 | 2010 | 344.0440° | Pisces | 14.04° | Uttara Bhadrapada P4 | 12H |
| 27 | 2011 | 350.0440° | Pisces | 20.04° | Revati P2 | 12H |
| 28 | 2012 | 356.0440° | Pisces | 26.04° | Revati P3 | 12H |
| 29 | 2013 | 2.0440° | Aries | 2.04° | Ashwini P1 | 1H |
| 30 | 2014 | 8.0440° | Aries | 8.04° | Ashwini P3 | 1H |
| 31 | 2015 | 14.0440° | Aries | 14.04° | Bharani P1 | 1H |
| 32 | 2016 | 20.0440° | Aries | 20.04° | Bharani P3 | 1H |
| 33 | 2017 | 26.0440° | Aries | 26.04° | Bharani P4 | 1H |
| 34 | 2018 | 32.0440° | Taurus | 2.04° | Krittika P2 | 2H |
| 35 | 2019 | 38.0440° | Taurus | 8.04° | Krittika P4 | 2H |
| 36 | 2020 | 44.0440° | Taurus | 14.04° | Rohini P2 | 2H |
| 37 | 2021 | 50.0440° | Taurus | 20.04° | Rohini P4 | 2H |
| 38 | 2022 | 56.0440° | Taurus | 26.04° | Mrigashira P1 | 2H |
| 39 | 2023 | 62.0440° | Gemini | 2.04° | Mrigashira P3 | 3H |
| 40 | 2024 | 68.0440° | Gemini | 8.04° | Ardra P1 | 3H |
| 41 | 2025 | 74.0440° | Gemini | 14.04° | Ardra P3 | 3H |
| 42 | 2026 | 80.0440° | Gemini | 20.04° | Punarvasu P1 | 3H |
| 43 | 2027 | 86.0440° | Gemini | 26.04° | Punarvasu P2 | 3H |
| 44 | 2028 | 92.0440° | Cancer | 2.04° | Punarvasu P4 | 4H |
| 45 | 2029 | 98.0440° | Cancer | 8.04° | Pushya P2 | 4H |
| 46 | 2030 | 104.0440° | Cancer | 14.04° | Pushya P4 | 4H |
| 47 | 2031 | 110.0440° | Cancer | 20.04° | Ashlesha P2 | 4H |
| 48 | 2032 | 116.0440° | Cancer | 26.04° | Ashlesha P3 | 4H |
| 49 | 2033 | 122.0440° | Leo | 2.04° | Magha P1 | 5H |
| 50 | 2034 | 128.0440° | Leo | 8.04° | Magha P3 | 5H |
| 51 | 2035 | 134.0440° | Leo | 14.04° | Purva Phalguni P1 | 5H |
| 52 | 2036 | 140.0440° | Leo | 20.04° | Purva Phalguni P3 | 5H |
| 53 | 2037 | 146.0440° | Leo | 26.04° | Purva Phalguni P4 | 5H |
| 54 | 2038 | 152.0440° | Virgo | 2.04° | Uttara Phalguni P2 | 6H |
| 55 | 2039 | 158.0440° | Virgo | 8.04° | Uttara Phalguni P4 | 6H |
| 56 | 2040 | 164.0440° | Virgo | 14.04° | Hasta P2 | 6H |
| 57 | 2041 | 170.0440° | Virgo | 20.04° | Hasta P4 | 6H |
| 58 | 2042 | 176.0440° | Virgo | 26.04° | Chitra P1 | 6H |
| 59 | 2043 | 182.0440° | Libra | 2.04° | Chitra P3 | 7H |
| 60 | 2044 | 188.0440° | Libra | 8.04° | Swati P1 | 7H |

**Retrodictive highlights**:
- At age 0 (1984): BB in Libra (7H) — activating natal Saturn-Mars 7H exalted configuration
- At age 14 (1998, R#1 start): BB at age 14 = 272.04° = Capricorn — 10H
- At age 29 (2013, marriage + 3 major career events): BB in Aries
- At age 34 (2018, father's death): BB in Taurus
- At age 39 (2023, US return + pivot): BB in Gemini
- At age 42 (2026, current): BB in Gemini

---

## §V7.G — VIRUPA ASPECT STRENGTH GRID (9×9)

Classical Vedic aspect strengths (virupa units, 0-60 scale). Each planet's aspect on every other planet's sign.

**Rules applied**:
- 7th aspect (opposition) = 60 virupa full for all planets
- Mars special: 4th and 8th aspects = 60 (full)
- Jupiter special: 5th and 9th aspects = 60 (full)
- Saturn special: 3rd and 10th aspects = 60 (full)
- Rahu/Ketu: follow Jupiter-like 5/9 in this implementation (Parashari school)
- Simplified partial aspects: 4/8 = 45, 5/9 = 30, 3/10 = 15 for non-special planets

| From → To | Sun | Moon | Mars | Mer | Jup | Ven | Sat | Rahu | Ketu |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **Sun** | — | 0 | 15 | 0 | 0 | 0 | 15 | 30 | 0 |
| **Moon** | 0 | — | 30 | 0 | 0 | 0 | 30 | 45 | 15 |
| **Mars** | 60 | 30 | — | 60 | 15 | 15 | 0 | 60 | 0 |
| **Mercury** | 0 | 0 | 15 | — | 0 | 0 | 15 | 30 | 0 |
| **Jupiter** | 0 | 15 | 0 | 0 | — | 0 | 0 | 0 | 0 |
| **Venus** | 0 | 15 | 0 | 0 | 0 | — | 0 | 0 | 0 |
| **Saturn** | 45 | 30 | 0 | 45 | 60 | 60 | — | 45 | 0 |
| **Rahu** | 60 | 15 | 0 | 60 | 45 | 45 | 0 | — | 60 |
| **Ketu** | 15 | 45 | 0 | 15 | 0 | 0 | 0 | 60 | — |

**Strongest received aspects** (60 virupa = full):
- **Mars** (in Libra) full-aspects **Sun** (in Capricorn)
- **Mars** (in Libra) full-aspects **Mercury** (in Capricorn)
- **Mars** (in Libra) full-aspects **Rahu** (in Taurus)
- **Saturn** (in Libra) full-aspects **Jupiter** (in Sagittarius)
- **Saturn** (in Libra) full-aspects **Venus** (in Sagittarius)
- **Rahu** (in Taurus) full-aspects **Sun** (in Capricorn)
- **Rahu** (in Taurus) full-aspects **Mercury** (in Capricorn)
- **Rahu** (in Taurus) full-aspects **Ketu** (in Scorpio)
- **Ketu** (in Scorpio) full-aspects **Rahu** (in Taurus)

---

## §V7.H — DATA PROVENANCE LOG (NEW IN v7.0)

Per Architecture §G.1.CGP Category 7 (Provenance Coverage), every fact must have a source tag.

| Section | Source | Tool / Formula | Date Computed |
| --- | --- | --- | --- |
| v6.0 §1-§24 (existing) | source: v6.0 base file | v6.0 carried forward (multiple historical sources) | 2026-04-16 or earlier |
| v7.0 §V7.A Sade Sati Cycle 1 | source: swiss_ephemeris | pyswisseph 2.10.03 daily Saturn sign scan | 2026-04-17 |
| v7.0 §V7.B D27 Bhamsa | source: swiss_ephemeris + BPHS Ch.7 Sl.14 formula | Computed | 2026-04-17 |
| v7.0 §V7.C Nadi-amsa | source: computed | 1/150° subdivision from v6.0 natal abs longs | 2026-04-17 |
| v7.0 §V7.D Additional Sahams | source: computed | Tajika classical formulas applied to v6.0 natal abs longs | 2026-04-17 |
| v7.0 §V7.E Pranapada Lagna | source: swiss_ephemeris + BPHS formula | Sunrise via pyswisseph.rise_trans; formula applied | 2026-04-17 |
| v7.0 §V7.F Bhrigu Bindu Progression | source: computed | Natal BB from v6.0 + 6°/year progression | 2026-04-17 |
| v7.0 §V7.G Virupa Aspect Grid | source: computed | BPHS classical aspect rules | 2026-04-17 |

**Cells remaining with `source: UNKNOWN` or `source: v6.0_carried`**: all of v6.0's 24 sections (unchanged). Future v7.1 may re-verify select v6.0 cells against Swiss Ephemeris for source-provenance upgrade.

---

## §V7.I — CGP (COMPLETENESS GUARANTEE PROTOCOL) COVERAGE

Pre-audit self-assessment against Architecture §G.1.CGP 7 categories:

| Category | Required Cells | v6.0 | v7.0 | Status |
| --- | --- | --- | --- | --- |
| 1. Combinatorial (Planet × House × Dx) | 9×12×16 = 1,728 | Partial (D2-D60 excl D27) | FULL (D2-D60 incl D27 + Nadi-amsa) | ✓ |
| 2. Strength (Shadbala, BAV, SAV, Vimsopaka, Kakshya) | ~500+ cells | FULL | FULL (unchanged from v6.0) | ✓ |
| 3. Aspect (Vedic + Western + Jaimini) | 81+108+144 = 333 | Partial (no virupa grid) | FULL (virupa grid added) | ✓ |
| 4. Dasha (Vimshottari + Yogini + Chara full lifetime) | 150+ rows | FULL | FULL (unchanged) | ✓ |
| 5. Sensitive-Point (upagrahas, sahams, BB, yogi, special lagnas) | 40+ items | Partial (6 sahams, 6 lagnas) | FULL (23 sahams, 7 lagnas, BB 60-yr prog) | ✓ |
| 6. Temporal (transits, eclipses, retrograde, panchang) | 1984-2044+ | Partial (transit only 2026-2028) | FULL (1900-2100 via ephemeris catalog) | ✓ |
| 7. Provenance (every cell has source tag) | All cells | None | Added for v7.0 additions; v6.0 carried as-is | Partial |

**v7.0 CGP status**: 6 of 7 categories FULL. Category 7 (Provenance) PARTIAL — v6.0 cells remain without explicit source tags (backfilling would require re-verification of each cell, which is v7.1 or v8.0 scope).

**Hard-gate for L2 work** (Architecture B.12 refusal protocol): met for all six FULL categories. L2 can now proceed against any event, entity, or configuration without `[EXTERNAL_COMPUTATION_REQUIRED]` markers.

---

## §V7.J — CHANGELOG

```yaml
v7.0 (2026-04-17, Session 5):
  - SUPPLEMENT to v6.0 base file (both must be read together)
  - Added §V7.A Sade Sati Cycle 1 (1990-1998) — fills v6.0 §21 gap
  - Added §V7.B D27 Bhamsa chart — fills v6.0 §3.* D27 gap
  - Added §V7.C Nadi-amsa positions (1/150° subdivision)
  - Added §V7.D 17 additional Sahams (total 23 sahams, was 6)
  - Added §V7.E Pranapada Lagna (7th special lagna, was missing)
  - Added §V7.F Bhrigu Bindu 60-year progression (natal position was present)
  - Added §V7.G Virupa aspect strength grid (9x9 classical BPHS aspects)
  - Added §V7.H Data provenance log
  - Added §V7.I CGP coverage self-assessment (6/7 FULL; 1 PARTIAL)
  - Computation source: Swiss Ephemeris 2.10.03 + classical BPHS/Tajika formulas
  - Status: CLOSED (Session 5 output)

# Future:
v7.1 (planned): Backfill v6.0 provenance tags; add Tajika Mudda monthly progression (complex calc; JH cross-check recommended); refine Pranapada formula variants
```

**END OF FORENSIC DATA v7.0 SUPPLEMENT**