---
document: Forensic Astrological Data
subject: Abhisek Mohanty
version: 6.0
supersedes: 5.1
format: LLM-optimized canonical data file
content_policy: FACTS and DERIVED values only. No interpretation, no predictive narrative, no commentary.
ayanamsa: Lahiri (Chitrapaksha), value 23°37′58″
ayanamsa_system: Sidereal
node_type: Mean
house_system: Sripathi (Bhava Chalit)
coordinate_type: Geocentric
---

# FORENSIC ASTROLOGICAL DATA — ABHISEK MOHANTY

## §0 — DOCUMENT INDEX AND USAGE

<!--
LLM USAGE NOTES:
- This file contains only facts and deterministic derivations. All interpretive content belongs in separate files.
- Every table, planet, house, nakshatra, and sensitive point has a stable ID. Use IDs for cross-reference.
- Units and formats are canonical throughout:
    Degrees: DDD°MM′SS″ (or decimal degrees where marked "abs_long")
    Dates:   YYYY-MM-DD
    Houses:  integers 1–12 (never Roman, never "1st"/"2nd" inline)
    Planets: Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu
    Signs:   Aries, Taurus, Gemini, Cancer, Leo, Virgo, Libra, Scorpio, Sagittarius, Capricorn, Aquarius, Pisces
- House-placement convention: Rashi is primary. Chalit is shown as a secondary column where it differs.
- When a planet moves between Rashi house and Chalit house, both are authoritative for different questions:
    Rashi house = sign-based placement (classical yoga/aspect calculations)
    Chalit house = degree-based functional delivery (transit triggers and outcome timing)
-->

### §0.1 Stable ID Namespaces

| Namespace | Example | Meaning |
| --- | --- | --- |
| `MET.*` | `MET.BIRTH.DATE` | Metadata |
| `PLN.*` | `PLN.MOON` | Planet |
| `HSE.*` | `HSE.7` | House (1–12) |
| `SGN.*` | `SGN.CAPRICORN` | Zodiac sign |
| `NAK.*` | `NAK.PURVA_BHADRAPADA` | Nakshatra |
| `D1.*` … `D60.*` | `D9.LAGNA` | Divisional chart entries |
| `KP.*` | `KP.CUSP.7` | KP system values |
| `DSH.V.*` | `DSH.V.MD.MERCURY.2010` | Vimshottari Dasha |
| `DSH.Y.*` | `DSH.Y.BHADRIKA.2021` | Yogini Dasha |
| `DSH.C.*` | `DSH.C.SCORPIO.2026` | Jaimini Chara Dasha |
| `SBL.*` | `SBL.SHADBALA.SATURN` | Strength metric |
| `AVG.*` | `AVG.SAV.LIBRA` | Ashtakavarga |
| `KAK.*` | `KAK.PISCES.Z4` | Saturn Kakshya zone |
| `AVS.*` | `AVS.MOON` | Avastha state |
| `KRK.*` | `KRK.ATMA` | Chara Karaka role |
| `UPG.*` | `UPG.GULIKA` | Upagraha |
| `SAH.*` | `SAH.PUNYA` | Saham (Tajika lot) |
| `LAG.*` | `LAG.HORA` | Special Lagna |
| `ARD.*` | `ARD.AL` | Arudha |
| `DEV.*` | `DEV.ISHTA` | Deity assignment |
| `ASP.*` | `ASP.SATURN.MOON` | Planetary aspect |
| `TRS.*` | `TRS.SADE_SATI.C2.P3` | Transit cycle entry |
| `PCG.*` | `PCG.TITHI` | Panchang component |
| `KOT.*` | `KOT.SWAMI` | Kota Chakra component |

### §0.2 Section Map

| § | Section | Content Type |
| --- | --- | --- |
| 1 | Core Identity | FACT |
| 2 | D1 Rashi Chart | FACT |
| 3 | Divisional Charts (D2–D60) | FACT |
| 4 | KP System | FACT + DERIVED |
| 5 | Dasha Systems | FACT |
| 6 | Strength Metrics | FACT |
| 7 | Ashtakavarga | FACT + DERIVED |
| 8 | Saturn Kakshya Zones | DERIVED |
| 9 | Avastha Diagnostics | DERIVED |
| 10 | Chara Karakas | DERIVED |
| 11 | Sensitive Points (Bhrigu, Yogi/Avayogi, Upagrahas) | DERIVED |
| 12 | Special Lagnas and Sahams | DERIVED |
| 13 | Arudhas | DERIVED |
| 14 | Stellar Matrix (Navatara) | DERIVED |
| 15 | Panchang DNA | FACT |
| 16 | Hazards (Gandanta, Sandhi, Mrityu Bhaga) | DERIVED |
| 17 | Aspects (Graha Drishti + Western orbs) | FACT |
| 18 | Chalit Kinetic Shifts | DERIVED |
| 19 | Chandra Chart (From-Moon View) | DERIVED |
| 20 | Kota Chakra | DERIVED |
| 21 | Deity Assignments | DERIVED |
| 22 | Sade Sati Cycles | FACT |
| 23 | Varshphal 2026–2027 | FACT |
| 24 | Cross-Reference Matrices | DERIVED indexes |

---

## §1 — CORE IDENTITY (FACTS)

<!-- Birth data and chart calibration. Single source of truth. All other tables derive from these. -->

### §1.1 Birth Metadata

| ID | Field | Value |
| --- | --- | --- |
| `MET.NAME` | Full Name | Abhisek Mohanty |
| `MET.BIRTH.DATE` | Birth Date | 1984-02-05 |
| `MET.BIRTH.TIME` | Birth Time | 10:43 (IST, UTC+5:30) |
| `MET.BIRTH.PLACE` | Birth Place | Bhubaneswar, Odisha, India |
| `MET.BIRTH.LAT` | Latitude | 20.2960° N |
| `MET.BIRTH.LON` | Longitude | 85.8246° E |
| `MET.AYAN.NAME` | Ayanamsa | Lahiri (Chitrapaksha) |
| `MET.AYAN.VAL` | Ayanamsa Value | 23°37′58″ |
| `MET.NODE.TYPE` | Node Type | Mean |
| `MET.FRAME` | Frame | Geocentric |
| `MET.HOUSE.SYSTEM` | House System | Sripathi (Bhava Chalit) |

### §1.2 Core Mirror

| ID | Field | Value |
| --- | --- | --- |
| `MET.LAGNA.SIGN` | Lagna Sign | Aries |
| `MET.LAGNA.DEG` | Lagna Degree | 12°23′55″ |
| `MET.LAGNA.NAK` | Lagna Nakshatra | Ashwini |
| `MET.LAGNA.PADA` | Lagna Pada | 4 |
| `MET.SUN.SIGN` | Sun Sign (Rashi) | Capricorn |
| `MET.MOON.SIGN` | Moon Sign (Rashi) | Aquarius |
| `MET.MOON.NAK` | Moon Nakshatra | Purva Bhadrapada |
| `MET.MOON.PADA` | Moon Pada | 3 |
| `MET.DASHA.CURRENT` | Current Vimshottari | Mercury MD – Saturn AD |
| `MET.DASHA.CURRENT.START` | AD Start | 2024-12-12 |
| `MET.DASHA.CURRENT.END` | AD End | 2027-08-21 |
---

## §2 — D1 RASHI CHART (FACTS)

### §2.1 D1 Planet Positions

<!-- Primary planetary data. Sign, degree, nakshatra, pada, absolute longitude, Rashi house, Chalit house. -->

| ID | Planet | Sign | Degree | Nakshatra | Pada | Abs Long (°) | Rashi House | Chalit House |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `PLN.SUN` | Sun | Capricorn | 21°57′35″ | Shravana | 4 | 291.96 | 10 | 11 |
| `PLN.MOON` | Moon | Aquarius | 27°02′48″ | Purva Bhadrapada | 3 | 327.05 | 11 | 12 |
| `PLN.MARS` | Mars | Libra | 18°31′38″ | Swati | 4 | 198.53 | 7 | 7 |
| `PLN.MERCURY` | Mercury | Capricorn | 00°50′11″ | Uttara Ashadha | 2 | 270.84 | 10 | 10 |
| `PLN.JUPITER` | Jupiter | Sagittarius | 09°48′28″ | Moola | 3 | 249.81 | 9 | 9 |
| `PLN.VENUS` | Venus | Sagittarius | 19°10′12″ | Purva Ashadha | 2 | 259.17 | 9 | 9 |
| `PLN.SATURN` | Saturn | Libra | 22°27′04″ | Vishakha | 1 | 202.45 | 7 | 7 |
| `PLN.RAHU` | Rahu | Taurus | 19°01′47″ | Rohini | 3 | 49.03 | 2 | 2 |
| `PLN.KETU` | Ketu | Scorpio | 19°01′47″ | Jyeshtha | 1 | 229.03 | 8 | 8 |

### §2.2 D1 Sign Occupancy (Bhava View)

<!-- Which planets occupy which sign/house in the Rashi chart. -->

| ID | House | Sign | Planets |
| --- | --- | --- | --- |
| `HSE.1` | 1 | Aries | (none) |
| `HSE.2` | 2 | Taurus | Rahu |
| `HSE.3` | 3 | Gemini | (none) |
| `HSE.4` | 4 | Cancer | (none) |
| `HSE.5` | 5 | Leo | (none) |
| `HSE.6` | 6 | Virgo | (none) |
| `HSE.7` | 7 | Libra | Saturn, Mars |
| `HSE.8` | 8 | Scorpio | Ketu |
| `HSE.9` | 9 | Sagittarius | Jupiter, Venus |
| `HSE.10` | 10 | Capricorn | Sun, Mercury |
| `HSE.11` | 11 | Aquarius | Moon |
| `HSE.12` | 12 | Pisces | (none) |

### §2.3 Bhava/Chalit Cusp Ledger

<!-- Cusp (bhava begin) and mid-bhava degrees. Sripathi system. -->

| ID | House | Cusp Sign | Cusp Degree | Mid-Bhava | Angle Label |
| --- | --- | --- | --- | --- | --- |
| `CSP.1` | 1 | Pisces | 25°49′40″ | Aries 12°23′55″ | Ascendant (Lagna) |
| `CSP.2` | 2 | Aries | 25°49′40″ | Taurus 09°15′24″ | — |
| `CSP.3` | 3 | Taurus | 22°41′08″ | Gemini 06°06′53″ | — |
| `CSP.4` | 4 | Gemini | 19°32′37″ | Cancer 02°58′21″ | Imum Coeli (IC) |
| `CSP.5` | 5 | Cancer | 19°32′37″ | Leo 06°06′53″ | — |
| `CSP.6` | 6 | Leo | 22°41′08″ | Virgo 09°15′24″ | — |
| `CSP.7` | 7 | Virgo | 25°49′40″ | Libra 12°23′55″ | Descendant |
| `CSP.8` | 8 | Libra | 25°49′40″ | Scorpio 09°15′24″ | — |
| `CSP.9` | 9 | Scorpio | 22°41′08″ | Sagittarius 06°06′53″ | — |
| `CSP.10` | 10 | Sagittarius | 19°32′37″ | Capricorn 02°58′21″ | Midheaven (MC) |
| `CSP.11` | 11 | Capricorn | 19°32′37″ | Aquarius 06°06′53″ | — |
| `CSP.12` | 12 | Aquarius | 22°41′08″ | Pisces 09°15′24″ | — |

### §2.4 Planet-to-Cusp Distance

<!-- Distance from each planet to its nearest house cusp. Relevant for Chalit delivery and transit triggers. -->

| ID | Planet | Abs Long | Assigned House | Nearest Cusp | Distance to Nearest Cusp |
| --- | --- | --- | --- | --- | --- |
| `CDL.SUN` | Sun | 291.96° | 10 | House 10 (Cap 2°58′) | 14.16° |
| `CDL.MOON` | Moon | 327.05° | 11 | House 11 (Aqu 6°06′) | 12.21° |
| `CDL.MARS` | Mars | 198.53° | 7 | House 7 (Lib 12°23′) | 6.13° |
| `CDL.MERCURY` | Mercury | 270.84° | 10 | House 10 (Cap 2°58′) | 2.14° (just inside — nearest-to-cusp planet in chart) |
| `CDL.JUPITER` | Jupiter | 249.81° | 9 | House 9 (Sag 6°06′) | 3.69° |
| `CDL.VENUS` | Venus | 259.17° | 9 | House 9 (Sag 6°06′) | 13.06° |
| `CDL.SATURN` | Saturn | 202.45° | 7 | House 7 (Lib 12°23′) | 10.05° |
| `CDL.RAHU` | Rahu | 49.03° | 2 | House 2 (Tau 9°15′) | 9.77° |
| `CDL.KETU` | Ketu | 229.03° | 8 | House 8 (Sco 9°15′) | 9.77° |
---

## §3 — DIVISIONAL CHARTS (FACTS)

<!--
All 16 varga charts in uniform format. Each chart shows:
  - Divisional Lagna (where present)
  - Planet positions in divisional signs
  - House occupancy where computed in source data
-->

### §3.1 D2 — Hora (Wealth Division)

<!-- Parashari Hora: planets fall in either Moon's Hora (Cancer) or Sun's Hora (Leo). -->

| ID | Hora Sign | Ruler | Planets |
| --- | --- | --- | --- |
| `D2.CANCER` | Cancer | Moon | Moon, Mars, Venus, Saturn, Mercury |
| `D2.LEO` | Leo | Sun | Jupiter, Ketu, Sun, Rahu |

### §3.2 D3 — Drekkana (Decanate)

| ID | House | Sign | Planets |
| --- | --- | --- | --- |
| `D3.LAGNA` | 1 | Leo | Venus |
| `D3.2` | 2 | Virgo | Sun, Rahu |
| `D3.3` | 3 | Libra | (none) |
| `D3.4` | 4 | Scorpio | Moon |
| `D3.5` | 5 | Sagittarius | (none) |
| `D3.6` | 6 | Capricorn | Mercury |
| `D3.7` | 7 | Aquarius | (none) |
| `D3.8` | 8 | Pisces | Ketu |
| `D3.9` | 9 | Aries | Jupiter |
| `D3.10` | 10 | Taurus | (none) |
| `D3.11` | 11 | Gemini | Mars, Saturn |
| `D3.12` | 12 | Cancer | (none) |

### §3.3 D4 — Chaturthamsa (Home / Property)

| ID | House | Sign | Planets |
| --- | --- | --- | --- |
| `D4.LAGNA` | 1 | Cancer | Sun |
| `D4.2` | 2 | Leo | (none) |
| `D4.3` | 3 | Virgo | (none) |
| `D4.4` | 4 | Libra | (none) |
| `D4.5` | 5 | Scorpio | Moon, Rahu |
| `D4.6` | 6 | Sagittarius | (none) |
| `D4.7` | 7 | Capricorn | Mercury |
| `D4.8` | 8 | Aquarius | (none) |
| `D4.9` | 9 | Pisces | Jupiter |
| `D4.10` | 10 | Aries | Mars, Saturn |
| `D4.11` | 11 | Taurus | Ketu |
| `D4.12` | 12 | Gemini | Venus |

### §3.4 D7 — Saptamsa (Progeny)

| ID | House | Sign | Planets |
| --- | --- | --- | --- |
| `D7.LAGNA` | 1 | Cancer | Mercury |
| `D7.2` | 2 | Leo | Moon |
| `D7.3` | 3 | Virgo | Ketu |
| `D7.4` | 4 | Libra | (none) |
| `D7.5` | 5 | Scorpio | (none) |
| `D7.6` | 6 | Sagittarius | Sun |
| `D7.7` | 7 | Capricorn | (none) |
| `D7.8` | 8 | Aquarius | Jupiter, Mars |
| `D7.9` | 9 | Pisces | Saturn, Rahu |
| `D7.10` | 10 | Aries | Venus |
| `D7.11` | 11 | Taurus | (none) |
| `D7.12` | 12 | Gemini | (none) |

### §3.5 D9 — Navamsa (Dharma / Spouse / General Strength)

<!--
Navamsa: the key divisional for chart strength testing and spouse analysis.
Vargottama: planet holding the same sign in D1 and D9.
-->

| ID | Body | D9 Sign | D1 Sign | Vargottama |
| --- | --- | --- | --- | --- |
| `D9.LAGNA` | D9 Lagna | Cancer | Aries (D1 Lagna) | NO |
| `D9.SUN` | Sun | Cancer | Capricorn | NO |
| `D9.MOON` | Moon | Gemini | Aquarius | NO |
| `D9.MARS` | Mars | Pisces | Libra | NO |
| `D9.MERCURY` | Mercury | Capricorn | Capricorn | YES |
| `D9.JUPITER` | Jupiter | Gemini | Sagittarius | NO |
| `D9.VENUS` | Venus | Virgo | Sagittarius | NO |
| `D9.SATURN` | Saturn | Aries | Libra | NO |
| `D9.RAHU` | Rahu | Gemini | Taurus | NO |
| `D9.KETU` | Ketu | Sagittarius | Scorpio | NO |

#### §3.5.1 D9 Debilitation and Neecha Bhanga

<!--
Debilitation signs: Sun=Libra, Moon=Scorpio, Mars=Cancer, Mercury=Pisces,
Jupiter=Capricorn, Venus=Virgo, Saturn=Aries.
Neecha Bhanga conditions apply when a debilitated planet's dispositor or exaltation
ruler is in a kendra (1/4/7/10) from Lagna or Moon in the same chart.
-->

| ID | Planet | D9 Sign | Debilitated? | Dispositor in D9 | Dispositor Placement (from D9 Lagna) | Neecha Bhanga Status |
| --- | --- | --- | --- | --- | --- | --- |
| `D9.NBR.VENUS` | Venus | Virgo | YES (Virgo = debil. for Venus) | Mercury | Capricorn, 7th from D9 Lagna (Kendra) | NBRY active — cancellation via Mercury in Kendra |
| `D9.NBR.SATURN` | Saturn | Aries | YES (Aries = debil. for Saturn) | Mars | Pisces | Dispositor not in Kendra; exaltation ruler Sun in Cancer = D9 Lagna (1st, Kendra) | NBRY active — cancellation via Sun (exaltation lord of Aries) in D9 Lagna Kendra |

<!--
Clarification of §3.5.1:
Venus debilitated in Virgo. Dispositor of Virgo = Mercury. Mercury sits in Capricorn in D9,
which is the 7th house from D9 Lagna Cancer. The 7th is a Kendra. NBRY condition met.

Saturn debilitated in Aries. Dispositor of Aries = Mars. Mars in D9 is in Pisces (9th from
D9 Lagna Cancer) — not a Kendra. Sun = exaltation lord of Aries. Sun in D9 is in Cancer,
which IS D9 Lagna (1st house Kendra). NBRY condition met via the exaltation-ruler path.
-->

#### §3.5.2 D9 12th-House Stellium

<!--
Planets tenanting the D9 12th house (counted from D9 Lagna Cancer): 12th from Cancer = Gemini.
-->

| ID | Fact | Value |
| --- | --- | --- |
| `D9.12H.SIGN` | D9 12th Sign | Gemini |
| `D9.12H.TENANTS` | Tenants | Moon, Jupiter, Rahu |
| `D9.12H.DISPOSITOR` | Gemini Ruler | Mercury |
| `D9.12H.DISP.PLACE` | Mercury Position in D9 | Capricorn, 7th from D9 Lagna (Kendra) |
| `D9.12H.DISP.VARG` | Mercury Vargottama | YES (Capricorn in both D1 and D9) |

### §3.6 D10 — Dashamsha (Career / Status)

| ID | Body | D10 Sign | D10 House |
| --- | --- | --- | --- |
| `D10.LAGNA` | D10 Lagna | Leo | 1 |
| `D10.SUN` | Sun | Aries | 9 |
| `D10.MOON` | Moon | Scorpio | 4 |
| `D10.MARS` | Mars | Aries | 9 |
| `D10.MERCURY` | Mercury | Virgo | 2 |
| `D10.JUPITER` | Jupiter | Pisces | 8 |
| `D10.VENUS` | Venus | Gemini | 11 |
| `D10.SATURN` | Saturn | Taurus | 10 |
| `D10.RAHU` | Rahu | Cancer | 12 |
| `D10.KETU` | Ketu | Capricorn | 6 |

### §3.7 D12 — Dvadashamsa (Parental Ancestry)

| ID | Sign | Planets |
| --- | --- | --- |
| `D12.ARIES` | Aries | Mercury, Jupiter |
| `D12.TAURUS` | Taurus | (none) |
| `D12.GEMINI` | Gemini | Saturn, Ketu |
| `D12.CANCER` | Cancer | Mars |
| `D12.LEO` | Leo | Ascendant (D12 Lagna) |
| `D12.VIRGO` | Virgo | Sun |
| `D12.LIBRA` | Libra | Venus |
| `D12.SCORPIO` | Scorpio | Moon |
| `D12.SAGITTARIUS` | Sagittarius | Rahu |
| `D12.CAPRICORN` | Capricorn | (none) |
| `D12.AQUARIUS` | Aquarius | (none) |
| `D12.PISCES` | Pisces | (none) |

### §3.8 D16 — Shodashamsa (Vehicles / Comforts)

| ID | Sign | Planets |
| --- | --- | --- |
| `D16.TAURUS` | Taurus | Mercury, Jupiter |
| `D16.GEMINI` | Gemini | Rahu, Ketu |
| `D16.CANCER` | Cancer | (none) |
| `D16.LEO` | Leo | Ascendant (D16 Lagna), Moon, Mars |
| `D16.VIRGO` | Virgo | Saturn |
| `D16.LIBRA` | Libra | (none) |
| `D16.SCORPIO` | Scorpio | (none) |
| `D16.SAGITTARIUS` | Sagittarius | Sun |
| `D16.CAPRICORN` | Capricorn | Venus |
| `D16.AQUARIUS` | Aquarius | (none) |
| `D16.PISCES` | Pisces | (none) |
| `D16.ARIES` | Aries | (none) |

### §3.9 D20 — Vimsamsa (Spiritual Sadhana)

| ID | Sign | Planets |
| --- | --- | --- |
| `D20.SCORPIO` | Scorpio | Ascendant (D20 Lagna), Jupiter |
| `D20.SAGITTARIUS` | Sagittarius | Saturn |
| `D20.CAPRICORN` | Capricorn | Mars, Rahu |
| `D20.AQUARIUS` | Aquarius | (none) |
| `D20.PISCES` | Pisces | Sun |
| `D20.ARIES` | Aries | (none) |
| `D20.TAURUS` | Taurus | (none) |
| `D20.GEMINI` | Gemini | Mercury |
| `D20.CANCER` | Cancer | Ketu |
| `D20.LEO` | Leo | Moon, Venus |
| `D20.VIRGO` | Virgo | (none) |
| `D20.LIBRA` | Libra | (none) |

### §3.10 D24 — Siddhamsa (Education / Knowledge)

| ID | House | Sign | Planets |
| --- | --- | --- | --- |
| `D24.LAGNA` | 1 | Taurus | Moon |
| `D24.2` | 2 | Gemini | (none) |
| `D24.3` | 3 | Cancer | Mercury |
| `D24.4` | 4 | Leo | (none) |
| `D24.5` | 5 | Virgo | (none) |
| `D24.6` | 6 | Libra | Mars, Ketu, Rahu |
| `D24.7` | 7 | Scorpio | Venus |
| `D24.8` | 8 | Sagittarius | Sun |
| `D24.9` | 9 | Capricorn | Saturn |
| `D24.10` | 10 | Aquarius | (none) |
| `D24.11` | 11 | Pisces | Jupiter |
| `D24.12` | 12 | Aries | (none) |

### §3.11 D30 — Trimsamsa (Misfortune / Evils)

| ID | House | Sign | Planets |
| --- | --- | --- | --- |
| `D30.LAGNA` | 1 | Capricorn | Sun |
| `D30.2` | 2 | Aquarius | Jupiter |
| `D30.3` | 3 | Pisces | Ketu, Rahu |
| `D30.4` | 4 | Aries | (none) |
| `D30.5` | 5 | Taurus | Mercury |
| `D30.6` | 6 | Gemini | Saturn, Mars, Venus |
| `D30.7` | 7 | Cancer | (none) |
| `D30.8` | 8 | Leo | (none) |
| `D30.9` | 9 | Virgo | (none) |
| `D30.10` | 10 | Libra | Moon |
| `D30.11` | 11 | Scorpio | (none) |
| `D30.12` | 12 | Sagittarius | (none) |

### §3.12 D40 — Khavedamsa (Auspiciousness / Misfortune)

| ID | House | Sign | Planets |
| --- | --- | --- | --- |
| `D40.LAGNA` | 1 | Virgo | Saturn |
| `D40.2` | 2 | Libra | (none) |
| `D40.3` | 3 | Scorpio | Rahu, Ketu, Mercury |
| `D40.4` | 4 | Sagittarius | (none) |
| `D40.5` | 5 | Capricorn | (none) |
| `D40.6` | 6 | Aquarius | (none) |
| `D40.7` | 7 | Pisces | Sun |
| `D40.8` | 8 | Aries | Moon, Mars |
| `D40.9` | 9 | Taurus | Jupiter, Venus |
| `D40.10` | 10 | Gemini | (none) |
| `D40.11` | 11 | Cancer | (none) |
| `D40.12` | 12 | Leo | (none) |

### §3.13 D45 — Akshavedamsa (Spiritual Purity)

| ID | House | Sign | Planets |
| --- | --- | --- | --- |
| `D45.LAGNA` | 1 | Libra | Neptune |
| `D45.2` | 2 | Scorpio | (none) |
| `D45.3` | 3 | Sagittarius | Ketu, Rahu, Sun, Moon |
| `D45.4` | 4 | Capricorn | Saturn |
| `D45.5` | 5 | Aquarius | Jupiter |
| `D45.6` | 6 | Pisces | (none) |
| `D45.7` | 7 | Aries | Venus |
| `D45.8` | 8 | Taurus | Mercury |
| `D45.9` | 9 | Gemini | (none) |
| `D45.10` | 10 | Cancer | Mars |
| `D45.11` | 11 | Leo | (none) |
| `D45.12` | 12 | Virgo | (none) |

### §3.14 D60 — Shashtyamsa (Past Karma)

| ID | House | Sign | Planets |
| --- | --- | --- | --- |
| `D60.LAGNA` | 1 | Gemini | Saturn |
| `D60.2` | 2 | Cancer | Rahu, Jupiter |
| `D60.3` | 3 | Leo | Sun, Moon |
| `D60.4` | 4 | Virgo | (none) |
| `D60.5` | 5 | Libra | (none) |
| `D60.6` | 6 | Scorpio | Mars |
| `D60.7` | 7 | Sagittarius | (none) |
| `D60.8` | 8 | Capricorn | Ketu |
| `D60.9` | 9 | Aquarius | Mercury, Venus |
| `D60.10` | 10 | Pisces | (none) |
| `D60.11` | 11 | Aries | (none) |
| `D60.12` | 12 | Taurus | (none) |

### §3.15 CSI Ledger — D1→D9 and D1→D10 Comparative Status

<!--
Vargottama = same sign across D1 and D9.
D1→D9 status: dignity shift from Rashi to Navamsa.
D1→D10 status: placement in Dashamsha relative to D10 Lagna (Leo).
-->

| ID | Planet | Vargottama | D1→D9 Dignity | D10 Placement |
| --- | --- | --- | --- | --- |
| `CSI.SUN` | Sun | NO | D1 Capricorn (Saturn sign) → D9 Cancer (Moon sign) | D10 9th (Aries) — trine |
| `CSI.MOON` | Moon | NO | D1 Aquarius (Saturn sign) → D9 Gemini (Mercury sign) | D10 4th (Scorpio) — debilitated |
| `CSI.MARS` | Mars | NO | D1 Libra (Venus sign) → D9 Pisces (Jupiter sign) | D10 9th (Aries) — own sign |
| `CSI.MERCURY` | Mercury | YES | D1 Capricorn → D9 Capricorn (retained) | D10 2nd (Virgo) — own sign |
| `CSI.JUPITER` | Jupiter | NO | D1 Sagittarius (own) → D9 Gemini (Mercury sign) | D10 8th (Pisces) — own sign, Dusthana |
| `CSI.VENUS` | Venus | NO | D1 Sagittarius (Jupiter sign) → D9 Virgo (debilitation) | D10 11th (Gemini) — neutral |
| `CSI.SATURN` | Saturn | NO | D1 Libra (exaltation) → D9 Aries (debilitation) | D10 10th (Taurus) — angular |
| `CSI.RAHU` | Rahu | NO | D1 Taurus → D9 Gemini (Mercury sign) | D10 12th (Cancer) |
| `CSI.KETU` | Ketu | NO | D1 Scorpio → D9 Sagittarius (Jupiter sign) | D10 6th (Capricorn) |
---

## §4 — KP SYSTEM (FACTS + DERIVED)

### §4.1 KP Cusp Mirror

<!-- House cusps with star lord (nakshatra lord), sub lord, sub-sub lord. -->

| ID | Cusp | Degree | Sign | Star Lord | Sub Lord | Sub-Sub Lord |
| --- | --- | --- | --- | --- | --- | --- |
| `KP.CUSP.1` | 1 (Lagna) | 12°29′19″ | Aries | Ketu | Mercury | Mars |
| `KP.CUSP.2` | 2 (Wealth) | 12°29′01″ | Taurus | Moon | Rahu | Saturn |
| `KP.CUSP.3` | 3 (Effort) | 08°00′37″ | Gemini | Rahu | Rahu | Venus |
| `KP.CUSP.4` | 4 (Home) | 03°03′44″ | Cancer | Jupiter | Rahu | Moon |
| `KP.CUSP.5` | 5 (Creativity) | 01°07′36″ | Leo | Ketu | Venus | Venus |
| `KP.CUSP.6` | 6 (Service) | 04°47′17″ | Virgo | Sun | Saturn | Rahu |
| `KP.CUSP.7` | 7 (Spouse) | 12°29′19″ | Libra | Rahu | Saturn | Jupiter |
| `KP.CUSP.8` | 8 (Change) | 12°29′01″ | Scorpio | Saturn | Mars | Saturn |
| `KP.CUSP.9` | 9 (Fortune) | 08°00′37″ | Sagittarius | Ketu | Jupiter | Saturn |
| `KP.CUSP.10` | 10 (Career) | 03°03′44″ | Capricorn | Sun | Saturn | Saturn |
| `KP.CUSP.11` | 11 (Gain) | 01°07′36″ | Aquarius | Mars | Mercury | Rahu |
| `KP.CUSP.12` | 12 (Loss) | 04°47′17″ | Pisces | Saturn | Saturn | Mars |

### §4.2 KP Planetary Positions

<!-- Each planet's KP-style sub-lord breakdown. Rahu and Ketu use nodal rules; sub-sub may be undefined classically. -->

| ID | Planet | Degree | Star Lord | Sub Lord | Sub-Sub Lord |
| --- | --- | --- | --- | --- | --- |
| `KP.PLN.SUN` | Sun | 22°02′ | Moon | Venus | Saturn |
| `KP.PLN.MOON` | Moon | 27°08′ | Jupiter | Venus | Moon |
| `KP.PLN.MARS` | Mars | 18°37′ | Rahu | Moon | Saturn |
| `KP.PLN.MERCURY` | Mercury | 00°55′ | Sun | Rahu | Sun |
| `KP.PLN.JUPITER` | Jupiter | 09°53′ | Ketu | Saturn | Mercury |
| `KP.PLN.VENUS` | Venus | 19°15′ | Venus | Rahu | Mercury |
| `KP.PLN.SATURN` | Saturn | 22°32′ | Jupiter | Saturn | Venus |
| `KP.PLN.RAHU` | Rahu | 19°07′ | Moon | Mercury | Jupiter |
| `KP.PLN.KETU` | Ketu | 19°07′ | Mercury | Ketu | Saturn |

### §4.3 KP House Significators

<!-- Significators ranked by KP logic: occupants in nakshatra > occupants > lords in nakshatra > lord. -->

| ID | House | Significators (ranked) | KP Logic |
| --- | --- | --- | --- |
| `KP.SIG.1` | 1 (Self) | Mars, Ketu | Mars (Lord); Ketu (agent for Mars) |
| `KP.SIG.2` | 2 (Wealth) | Rahu, Venus | Rahu (occupant); Venus (lord) |
| `KP.SIG.6` | 6 (Job/Debt) | Mars, Ketu, Mercury | Mars and Ketu (in star of lord Mercury); Mercury (lord) |
| `KP.SIG.7` | 7 (Partners) | Moon, Saturn, Venus | Moon (in star of occupant Saturn); Saturn (occupant); Venus (lord) |
| `KP.SIG.10` | 10 (Career) | Mercury, Venus, Mars, Ketu, Sun, Saturn | Mercury and Venus (in star of occupant Sun); Mars and Ketu (in star of occupant Mercury); Sun and Mercury (occupants); Saturn (lord) |
| `KP.SIG.11` | 11 (Gains) | Sun, Rahu, Moon, Saturn | Sun and Rahu (in star of occupant Moon); Moon (occupant); Saturn (lord) |
| `KP.SIG.12` | 12 (Loss/Investment) | Saturn, Jupiter | Saturn (in star of lord Jupiter); Jupiter (lord) |

---

## §5 — DASHA SYSTEMS (FACTS)

### §5.1 Vimshottari Dasha (Mahadasha / Antardasha)

<!-- 120-year Moon-nakshatra-based Dasha. Start date = 1984-02-05. -->

| ID | MD | AD | Start | End |
| --- | --- | --- | --- | --- |
| `DSH.V.001` | Jupiter | Venus | 1984-02-05 | 1986-03-03 |
| `DSH.V.002` | Jupiter | Sun | 1986-03-03 | 1986-12-21 |
| `DSH.V.003` | Jupiter | Moon | 1986-12-21 | 1988-04-21 |
| `DSH.V.004` | Jupiter | Mars | 1988-04-21 | 1989-03-27 |
| `DSH.V.005` | Jupiter | Rahu | 1989-03-27 | 1991-08-21 |
| `DSH.V.006` | Saturn | Saturn | 1991-08-21 | 1994-08-24 |
| `DSH.V.007` | Saturn | Mercury | 1994-08-24 | 1997-05-03 |
| `DSH.V.008` | Saturn | Ketu | 1997-05-03 | 1998-06-12 |
| `DSH.V.009` | Saturn | Venus | 1998-06-12 | 2001-08-12 |
| `DSH.V.010` | Saturn | Sun | 2001-08-12 | 2002-07-24 |
| `DSH.V.011` | Saturn | Moon | 2002-07-24 | 2004-02-24 |
| `DSH.V.012` | Saturn | Mars | 2004-02-24 | 2005-04-03 |
| `DSH.V.013` | Saturn | Rahu | 2005-04-03 | 2008-02-09 |
| `DSH.V.014` | Saturn | Jupiter | 2008-02-09 | 2010-08-21 |
| `DSH.V.015` | Mercury | Mercury | 2010-08-21 | 2013-01-18 |
| `DSH.V.016` | Mercury | Ketu | 2013-01-18 | 2014-01-15 |
| `DSH.V.017` | Mercury | Venus | 2014-01-15 | 2016-11-15 |
| `DSH.V.018` | Mercury | Sun | 2016-11-15 | 2017-09-21 |
| `DSH.V.019` | Mercury | Moon | 2017-09-21 | 2019-02-21 |
| `DSH.V.020` | Mercury | Mars | 2019-02-21 | 2020-02-18 |
| `DSH.V.021` | Mercury | Rahu | 2020-02-18 | 2022-09-06 |
| `DSH.V.022` | Mercury | Jupiter | 2022-09-06 | 2024-12-12 |
| `DSH.V.023` | Mercury | Saturn | 2024-12-12 | 2027-08-21 |
| `DSH.V.024` | Ketu | Ketu | 2027-08-21 | 2028-01-18 |
| `DSH.V.025` | Ketu | Venus | 2028-01-18 | 2029-03-18 |
| `DSH.V.026` | Ketu | Sun | 2029-03-18 | 2029-07-24 |
| `DSH.V.027` | Ketu | Moon | 2029-07-24 | 2030-02-24 |
| `DSH.V.028` | Ketu | Mars | 2030-02-24 | 2030-07-21 |
| `DSH.V.029` | Ketu | Rahu | 2030-07-21 | 2031-08-09 |
| `DSH.V.030` | Ketu | Jupiter | 2031-08-09 | 2032-07-15 |
| `DSH.V.031` | Ketu | Saturn | 2032-07-15 | 2033-08-24 |
| `DSH.V.032` | Ketu | Mercury | 2033-08-24 | 2034-08-21 |
| `DSH.V.033` | Venus | Venus | 2034-08-21 | 2037-12-21 |
| `DSH.V.034` | Venus | Sun | 2037-12-21 | 2038-12-21 |
| `DSH.V.035` | Venus | Moon | 2038-12-21 | 2040-08-21 |
| `DSH.V.036` | Venus | Mars | 2040-08-21 | 2041-10-21 |
| `DSH.V.037` | Venus | Rahu | 2041-10-21 | 2044-10-21 |
| `DSH.V.038` | Venus | Jupiter | 2044-10-21 | 2047-06-21 |
| `DSH.V.039` | Venus | Saturn | 2047-06-21 | 2050-08-21 |
| `DSH.V.040` | Venus | Mercury | 2050-08-21 | 2053-06-21 |
| `DSH.V.041` | Venus | Ketu | 2053-06-21 | 2054-08-21 |
| `DSH.V.042` | Sun | Sun | 2054-08-21 | 2054-12-09 |
| `DSH.V.043` | Sun | Moon | 2054-12-09 | 2055-06-09 |
| `DSH.V.044` | Sun | Mars | 2055-06-09 | 2055-10-15 |
| `DSH.V.045` | Sun | Rahu | 2055-10-15 | 2056-09-09 |
| `DSH.V.046` | Sun | Jupiter | 2056-09-09 | 2057-06-27 |
| `DSH.V.047` | Sun | Saturn | 2057-06-27 | 2058-06-09 |
| `DSH.V.048` | Sun | Mercury | 2058-06-09 | 2059-04-15 |
| `DSH.V.049` | Sun | Ketu | 2059-04-15 | 2059-08-21 |
| `DSH.V.050` | Sun | Venus | 2059-08-21 | 2060-08-21 |

### §5.2 Yogini Dasha

<!-- 36-year cycle. 8 Yoginis, variable durations (1 to 8 years). -->

| ID | Yogini | Ruler | Duration | Start | End |
| --- | --- | --- | --- | --- | --- |
| `DSH.Y.001` | Bhramari | Mars | Balance | 1984-02-05 | 1985-12-22 |
| `DSH.Y.002` | Bhadrika | Mercury | 5 years | 1985-12-22 | 1990-12-22 |
| `DSH.Y.003` | Ulka | Saturn | 6 years | 1990-12-22 | 1996-12-22 |
| `DSH.Y.004` | Siddha | Venus | 7 years | 1996-12-22 | 2003-12-22 |
| `DSH.Y.005` | Sankata | Rahu | 8 years | 2003-12-22 | 2011-12-22 |
| `DSH.Y.006` | Mangala | Moon | 1 year | 2011-12-22 | 2012-12-22 |
| `DSH.Y.007` | Pingala | Sun | 2 years | 2012-12-22 | 2014-12-22 |
| `DSH.Y.008` | Dhanya | Jupiter | 3 years | 2014-12-22 | 2017-12-22 |
| `DSH.Y.009` | Bhramari | Mars | 4 years | 2017-12-22 | 2021-12-22 |
| `DSH.Y.010` | Bhadrika | Mercury | 5 years | 2021-12-22 | 2026-12-22 |
| `DSH.Y.011` | Ulka | Saturn | 6 years | 2026-12-22 | 2032-12-22 |
| `DSH.Y.012` | Siddha | Venus | 7 years | 2032-12-22 | 2039-12-22 |
| `DSH.Y.013` | Sankata | Rahu | 8 years | 2039-12-22 | 2047-12-22 |
| `DSH.Y.014` | Mangala | Moon | 1 year | 2047-12-22 | 2048-12-22 |
| `DSH.Y.015` | Pingala | Sun | 2 years | 2048-12-22 | 2050-12-22 |
| `DSH.Y.016` | Dhanya | Jupiter | 3 years | 2050-12-22 | 2053-12-22 |
| `DSH.Y.017` | Bhramari | Mars | 4 years | 2053-12-22 | 2057-12-22 |

### §5.3 Jaimini Chara Dasha (K.N. Rao Padakrama)

<!-- 144-year Jaimini sign-based dasha. Sub-periods calculated via K.N. Rao Padakrama rules. -->

| ID | MD Sign | AD Sign | Start | End |
| --- | --- | --- | --- | --- |
| `DSH.C.001` | Aries | Taurus | 1984-02-05 | 1984-08-05 |
| `DSH.C.002` | Aries | Gemini | 1984-08-05 | 1985-02-05 |
| `DSH.C.003` | Aries | Cancer | 1985-02-05 | 1985-08-05 |
| `DSH.C.004` | Aries | Leo | 1985-08-05 | 1986-02-05 |
| `DSH.C.005` | Aries | Virgo | 1986-02-05 | 1986-08-05 |
| `DSH.C.006` | Aries | Libra | 1986-08-05 | 1987-02-05 |
| `DSH.C.007` | Aries | Scorpio | 1987-02-05 | 1987-08-05 |
| `DSH.C.008` | Aries | Sagittarius | 1987-08-05 | 1988-02-05 |
| `DSH.C.009` | Aries | Capricorn | 1988-02-05 | 1988-08-05 |
| `DSH.C.010` | Aries | Aquarius | 1988-08-05 | 1989-02-05 |
| `DSH.C.011` | Aries | Pisces | 1989-02-05 | 1989-08-05 |
| `DSH.C.012` | Aries | Aries | 1989-08-05 | 1990-02-05 |
| `DSH.C.013` | Taurus | Aries | 1990-02-05 | 1990-09-05 |
| `DSH.C.014` | Taurus | Pisces | 1990-09-05 | 1991-04-05 |
| `DSH.C.015` | Taurus | Aquarius | 1991-04-05 | 1991-11-05 |
| `DSH.C.016` | Taurus | Capricorn | 1991-11-05 | 1992-06-05 |
| `DSH.C.017` | Taurus | Sagittarius | 1992-06-05 | 1993-01-05 |
| `DSH.C.018` | Taurus | Scorpio | 1993-01-05 | 1993-08-05 |
| `DSH.C.019` | Taurus | Libra | 1993-08-05 | 1994-03-05 |
| `DSH.C.020` | Taurus | Virgo | 1994-03-05 | 1994-10-05 |
| `DSH.C.021` | Taurus | Leo | 1994-10-05 | 1995-05-05 |
| `DSH.C.022` | Taurus | Cancer | 1995-05-05 | 1995-12-05 |
| `DSH.C.023` | Taurus | Gemini | 1995-12-05 | 1996-07-05 |
| `DSH.C.024` | Taurus | Taurus | 1996-07-05 | 1997-02-05 |
| `DSH.C.025` | Gemini | Cancer | 1997-02-05 | 1997-09-05 |
| `DSH.C.026` | Gemini | Leo | 1997-09-05 | 1998-04-05 |
| `DSH.C.027` | Gemini | Virgo | 1998-04-05 | 1998-11-05 |
| `DSH.C.028` | Gemini | Libra | 1998-11-05 | 1999-06-05 |
| `DSH.C.029` | Gemini | Scorpio | 1999-06-05 | 2000-01-05 |
| `DSH.C.030` | Gemini | Sagittarius | 2000-01-05 | 2000-08-05 |
| `DSH.C.031` | Gemini | Capricorn | 2000-08-05 | 2001-03-05 |
| `DSH.C.032` | Gemini | Aquarius | 2001-03-05 | 2001-10-05 |
| `DSH.C.033` | Gemini | Pisces | 2001-10-05 | 2002-05-05 |
| `DSH.C.034` | Gemini | Aries | 2002-05-05 | 2002-12-05 |
| `DSH.C.035` | Gemini | Taurus | 2002-12-05 | 2003-07-05 |
| `DSH.C.036` | Gemini | Gemini | 2003-07-05 | 2004-02-05 |
| `DSH.C.037` | Cancer | Gemini | 2004-02-05 | 2004-07-05 |
| `DSH.C.038` | Cancer | Taurus | 2004-07-05 | 2004-12-05 |
| `DSH.C.039` | Cancer | Aries | 2004-12-05 | 2005-05-05 |
| `DSH.C.040` | Cancer | Pisces | 2005-05-05 | 2005-10-05 |
| `DSH.C.041` | Cancer | Aquarius | 2005-10-05 | 2006-03-05 |
| `DSH.C.042` | Cancer | Capricorn | 2006-03-05 | 2006-08-05 |
| `DSH.C.043` | Cancer | Sagittarius | 2006-08-05 | 2007-01-05 |
| `DSH.C.044` | Cancer | Scorpio | 2007-01-05 | 2007-06-05 |
| `DSH.C.045` | Cancer | Libra | 2007-06-05 | 2007-11-05 |
| `DSH.C.046` | Cancer | Virgo | 2007-11-05 | 2008-04-05 |
| `DSH.C.047` | Cancer | Leo | 2008-04-05 | 2008-09-05 |
| `DSH.C.048` | Cancer | Cancer | 2008-09-05 | 2009-02-05 |
| `DSH.C.049` | Leo | Virgo | 2009-02-05 | 2009-09-05 |
| `DSH.C.050` | Leo | Libra | 2009-09-05 | 2010-04-05 |
| `DSH.C.051` | Leo | Scorpio | 2010-04-05 | 2010-11-05 |
| `DSH.C.052` | Leo | Sagittarius | 2010-11-05 | 2011-06-05 |
| `DSH.C.053` | Leo | Capricorn | 2011-06-05 | 2012-01-05 |
| `DSH.C.054` | Leo | Aquarius | 2012-01-05 | 2012-08-05 |
| `DSH.C.055` | Leo | Pisces | 2012-08-05 | 2013-03-05 |
| `DSH.C.056` | Leo | Aries | 2013-03-05 | 2013-10-05 |
| `DSH.C.057` | Leo | Taurus | 2013-10-05 | 2014-05-05 |
| `DSH.C.058` | Leo | Gemini | 2014-05-05 | 2014-12-05 |
| `DSH.C.059` | Leo | Cancer | 2014-12-05 | 2015-07-05 |
| `DSH.C.060` | Leo | Leo | 2015-07-05 | 2016-02-05 |
| `DSH.C.061` | Virgo | Leo | 2016-02-05 | 2016-10-05 |
| `DSH.C.062` | Virgo | Cancer | 2016-10-05 | 2017-06-05 |
| `DSH.C.063` | Virgo | Gemini | 2017-06-05 | 2018-02-05 |
| `DSH.C.064` | Virgo | Taurus | 2018-02-05 | 2018-10-05 |
| `DSH.C.065` | Virgo | Aries | 2018-10-05 | 2019-06-05 |
| `DSH.C.066` | Virgo | Pisces | 2019-06-05 | 2020-02-05 |
| `DSH.C.067` | Virgo | Aquarius | 2020-02-05 | 2020-10-05 |
| `DSH.C.068` | Virgo | Capricorn | 2020-10-05 | 2021-06-05 |
| `DSH.C.069` | Virgo | Sagittarius | 2021-06-05 | 2022-02-05 |
| `DSH.C.070` | Virgo | Scorpio | 2022-02-05 | 2022-10-05 |
| `DSH.C.071` | Virgo | Libra | 2022-10-05 | 2023-06-05 |
| `DSH.C.072` | Virgo | Virgo | 2023-06-05 | 2024-02-05 |
| `DSH.C.073` | Libra | Scorpio | 2024-02-05 | 2024-04-05 |
| `DSH.C.074` | Libra | Sagittarius | 2024-04-05 | 2024-06-05 |
| `DSH.C.075` | Libra | Capricorn | 2024-06-05 | 2024-08-05 |
| `DSH.C.076` | Libra | Aquarius | 2024-08-05 | 2024-10-05 |
| `DSH.C.077` | Libra | Pisces | 2024-10-05 | 2024-12-05 |
| `DSH.C.078` | Libra | Aries | 2024-12-05 | 2025-02-05 |
| `DSH.C.079` | Libra | Taurus | 2025-02-05 | 2025-04-05 |
| `DSH.C.080` | Libra | Gemini | 2025-04-05 | 2025-06-05 |
| `DSH.C.081` | Libra | Cancer | 2025-06-05 | 2025-08-05 |
| `DSH.C.082` | Libra | Leo | 2025-08-05 | 2025-10-05 |
| `DSH.C.083` | Libra | Virgo | 2025-10-05 | 2025-12-05 |
| `DSH.C.084` | Libra | Libra | 2025-12-05 | 2026-02-05 |
| `DSH.C.085` | Scorpio | Libra | 2026-02-05 | 2027-01-05 |
| `DSH.C.086` | Scorpio | Virgo | 2027-01-05 | 2027-12-05 |
| `DSH.C.087` | Scorpio | Leo | 2027-12-05 | 2028-11-05 |
| `DSH.C.088` | Scorpio | Cancer | 2028-11-05 | 2029-10-05 |
| `DSH.C.089` | Scorpio | Gemini | 2029-10-05 | 2030-09-05 |
| `DSH.C.090` | Scorpio | Taurus | 2030-09-05 | 2031-08-05 |
| `DSH.C.091` | Scorpio | Aries | 2031-08-05 | 2032-07-05 |
| `DSH.C.092` | Scorpio | Pisces | 2032-07-05 | 2033-06-05 |
| `DSH.C.093` | Scorpio | Aquarius | 2033-06-05 | 2034-05-05 |
| `DSH.C.094` | Scorpio | Capricorn | 2034-05-05 | 2035-04-05 |
| `DSH.C.095` | Scorpio | Sagittarius | 2035-04-05 | 2036-03-05 |
| `DSH.C.096` | Scorpio | Scorpio | 2036-03-05 | 2037-02-05 |
| `DSH.C.097` | Sagittarius | Capricorn | 2037-02-05 | 2038-02-05 |
| `DSH.C.098` | Sagittarius | Aquarius | 2038-02-05 | 2039-02-05 |
| `DSH.C.099` | Sagittarius | Pisces | 2039-02-05 | 2040-02-05 |
| `DSH.C.100` | Sagittarius | Aries | 2040-02-05 | 2041-02-05 |
| `DSH.C.101` | Sagittarius | Taurus | 2041-02-05 | 2042-02-05 |
| `DSH.C.102` | Sagittarius | Gemini | 2042-02-05 | 2043-02-05 |
| `DSH.C.103` | Sagittarius | Cancer | 2043-02-05 | 2044-02-05 |
| `DSH.C.104` | Sagittarius | Leo | 2044-02-05 | 2045-02-05 |
| `DSH.C.105` | Sagittarius | Virgo | 2045-02-05 | 2046-02-05 |
| `DSH.C.106` | Sagittarius | Libra | 2046-02-05 | 2047-02-05 |
| `DSH.C.107` | Sagittarius | Scorpio | 2047-02-05 | 2048-02-05 |
| `DSH.C.108` | Sagittarius | Sagittarius | 2048-02-05 | 2049-02-05 |
| `DSH.C.109` | Capricorn | Sagittarius | 2049-02-05 | 2049-05-05 |
| `DSH.C.110` | Capricorn | Scorpio | 2049-05-05 | 2049-08-05 |
| `DSH.C.111` | Capricorn | Libra | 2049-08-05 | 2049-11-05 |
| `DSH.C.112` | Capricorn | Virgo | 2049-11-05 | 2050-02-05 |
| `DSH.C.113` | Capricorn | Leo | 2050-02-05 | 2050-05-05 |
| `DSH.C.114` | Capricorn | Cancer | 2050-05-05 | 2050-08-05 |
| `DSH.C.115` | Capricorn | Gemini | 2050-08-05 | 2050-11-05 |
| `DSH.C.116` | Capricorn | Taurus | 2050-11-05 | 2051-02-05 |
| `DSH.C.117` | Capricorn | Aries | 2051-02-05 | 2051-05-05 |
| `DSH.C.118` | Capricorn | Pisces | 2051-05-05 | 2051-08-05 |
| `DSH.C.119` | Capricorn | Aquarius | 2051-08-05 | 2051-11-05 |
| `DSH.C.120` | Capricorn | Capricorn | 2051-11-05 | 2052-02-05 |
| `DSH.C.121` | Aquarius | Pisces | 2052-02-05 | 2052-06-05 |
| `DSH.C.122` | Aquarius | Aries | 2052-06-05 | 2052-10-05 |
| `DSH.C.123` | Aquarius | Taurus | 2052-10-05 | 2053-02-05 |
| `DSH.C.124` | Aquarius | Gemini | 2053-02-05 | 2053-06-05 |
| `DSH.C.125` | Aquarius | Cancer | 2053-06-05 | 2053-10-05 |
| `DSH.C.126` | Aquarius | Leo | 2053-10-05 | 2054-02-05 |
| `DSH.C.127` | Aquarius | Virgo | 2054-02-05 | 2054-06-05 |
| `DSH.C.128` | Aquarius | Libra | 2054-06-05 | 2054-10-05 |
| `DSH.C.129` | Aquarius | Scorpio | 2054-10-05 | 2055-02-05 |
| `DSH.C.130` | Aquarius | Sagittarius | 2055-02-05 | 2055-06-05 |
| `DSH.C.131` | Aquarius | Capricorn | 2055-06-05 | 2055-10-05 |
| `DSH.C.132` | Aquarius | Aquarius | 2055-10-05 | 2056-02-05 |
| `DSH.C.133` | Pisces | Aquarius | 2056-02-05 | 2056-05-05 |
| `DSH.C.134` | Pisces | Capricorn | 2056-05-05 | 2056-08-05 |
| `DSH.C.135` | Pisces | Sagittarius | 2056-08-05 | 2056-11-05 |
| `DSH.C.136` | Pisces | Scorpio | 2056-11-05 | 2057-02-05 |
| `DSH.C.137` | Pisces | Libra | 2057-02-05 | 2057-05-05 |
| `DSH.C.138` | Pisces | Virgo | 2057-05-05 | 2057-08-05 |
| `DSH.C.139` | Pisces | Leo | 2057-08-05 | 2057-11-05 |
| `DSH.C.140` | Pisces | Cancer | 2057-11-05 | 2058-02-05 |
| `DSH.C.141` | Pisces | Gemini | 2058-02-05 | 2058-05-05 |
| `DSH.C.142` | Pisces | Taurus | 2058-05-05 | 2058-08-05 |
| `DSH.C.143` | Pisces | Aries | 2058-08-05 | 2058-11-05 |
| `DSH.C.144` | Pisces | Pisces | 2058-11-05 | 2059-02-05 |
---

## §6 — STRENGTH METRICS (FACTS)

### §6.1 Shadbala — Component Breakdown

<!--
Shadbala: composite planetary strength across six categories in Virupa units (60 Virupa = 1 Rupa).
Components: Sthana (positional), Dig (directional), Kala (temporal), Chesta (motional),
Naisargika (natural), Drik (aspectual).
-->

| ID | Component | Sun | Moon | Mars | Mercury | Jupiter | Venus | Saturn |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `SBL.UCHA` | Ucha Bala (Exaltation) | 33.99 | 38.02 | 26.84 | 24.72 | 8.40 | 27.39 | 59.18 |
| `SBL.SAPT` | Saptavargaja Bala | 97.50 | 123.75 | 75.00 | 97.50 | 165.00 | 93.75 | 108.75 |
| `SBL.OJAY` | Ojayugmarasyamsa Bala | 0.00 | 0.00 | 15.00 | 0.00 | 30.00 | 15.00 | 30.00 |
| `SBL.KEND` | Kendra Bala (Angular) | 60.00 | 30.00 | 60.00 | 60.00 | 15.00 | 15.00 | 60.00 |
| `SBL.DREK` | Drekkana Bala | 1.00 | 1.00 | 1.00 | 1.00 | 1.00 | 1.00 | 1.00 |
| `SBL.STHANA.TOTAL` | Total Sthana Bala | 191.49 | 206.77 | 176.84 | 182.22 | 233.40 | 151.14 | 257.93 |
| `SBL.DIG.TOTAL` | Total Dig Bala | 53.67 | 18.02 | 35.18 | 26.15 | 19.14 | 4.60 | 56.65 |
| `SBL.NATH` | Nathonnatha Bala | 53.53 | 6.47 | 6.47 | 60.00 | 53.53 | 53.53 | 6.47 |
| `SBL.PAKSHA` | Paksha Bala | 48.30 | 48.30 | 48.30 | 48.30 | 11.70 | 11.70 | 48.30 |
| `SBL.TRIBH` | Thribhaga Bala | 60.00 | 0.00 | 0.00 | 0.00 | 60.00 | 0.00 | 0.00 |
| `SBL.ABDA` | Abda Bala | 0.00 | 0.00 | 0.00 | 0.00 | 15.00 | 0.00 | 0.00 |
| `SBL.MASA` | Masa Bala | 0.00 | 0.00 | 0.00 | 0.00 | 30.00 | 0.00 | 0.00 |
| `SBL.VARA` | Vara Bala | 45.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| `SBL.HORA` | Hora Bala | 0.00 | 60.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| `SBL.AYANA` | Ayana Bala | 18.74 | 34.69 | 10.30 | 56.94 | 0.25 | 0.92 | 51.23 |
| `SBL.YUDDHA` | Yuddha Bala | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 | 0.00 |
| `SBL.KALA.TOTAL` | Total Kala Bala | 225.58 | 149.46 | 65.08 | 165.25 | 170.47 | 66.15 | 106.01 |
| `SBL.CHESTA.TOTAL` | Total Chesta Bala | 15.20 | 11.70 | 36.17 | 17.83 | 13.79 | 19.51 | 31.63 |
| `SBL.NAISARG.TOTAL` | Total Naisargika Bala | 60.00 | 51.42 | 17.16 | 25.74 | 34.26 | 42.84 | 8.58 |
| `SBL.DRIK.TOTAL` | Total Drik Bala | -35.08 | -1.85 | -14.20 | -23.92 | -6.98 | -8.24 | -12.81 |

### §6.2 Shadbala — Totals and Ranking

| ID | Planet | Total Virupas | Rupas | Min Required (Rupas) | Ratio | Rank |
| --- | --- | --- | --- | --- | --- | --- |
| `SBL.TOTAL.SUN` | Sun | 510.85 | 8.51 | 5.00 | 1.70 | 1 |
| `SBL.TOTAL.MOON` | Moon | 435.51 | 7.26 | 6.00 | 1.21 | 3 |
| `SBL.TOTAL.MARS` | Mars | 316.23 | 5.27 | 5.00 | 1.05 | 5 |
| `SBL.TOTAL.MERCURY` | Mercury | 393.26 | 6.55 | 7.00 | 0.94 | 6 |
| `SBL.TOTAL.JUPITER` | Jupiter | 464.07 | 7.73 | 6.50 | 1.19 | 4 |
| `SBL.TOTAL.VENUS` | Venus | 276.01 | 4.60 | 5.50 | 0.84 | 7 |
| `SBL.TOTAL.SATURN` | Saturn | 447.98 | 7.47 | 5.00 | 1.49 | 2 |

### §6.3 Ishta / Kashta Proxy (via Uccha Bala)

| ID | Planet | Uccha Score (max 60) | Band |
| --- | --- | --- | --- |
| `SBL.UCHA.RANK.1` | Saturn | 59.18 | Max |
| `SBL.UCHA.RANK.2` | Moon | 38.02 | High |
| `SBL.UCHA.RANK.3` | Sun | 33.99 | Average |
| `SBL.UCHA.RANK.4` | Venus | 27.39 | Average |
| `SBL.UCHA.RANK.5` | Mars | 26.84 | Average |
| `SBL.UCHA.RANK.6` | Mercury | 24.72 | Low |
| `SBL.UCHA.RANK.7` | Jupiter | 8.40 | Low |

### §6.4 Bhavabala

<!-- House strength in Virupas. Ranked 1 (strongest) to 12 (weakest). -->

| ID | House | Life Area | Total Bala | Rupas | Rank | Lord Strength (Virupa) | Directional (Dig) | Aspectual (Drishti) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `BVB.12` | 12 | Isolation / Foreign | 506.09 | 8.43 | 1 | 464.07 (Jupiter) | 20 | +22.02 |
| `BVB.5` | 5 | Creativity / Future | 486.86 | 8.11 | 2 | 510.85 (Sun) | 10 | -33.99 |
| `BVB.10` | 10 | Career / Status | 482.99 | 8.05 | 3 | 447.98 (Saturn) | 60 | -24.99 |
| `BVB.11` | 11 | Gains / Network | 478.27 | 7.97 | 4 | 447.98 (Saturn) | 40 | -9.71 |
| `BVB.9` | 9 | Luck / Dharma | 477.55 | 7.96 | 5 | 464.07 (Jupiter) | 20 | -6.52 |
| `BVB.4` | 4 | Home / Peace | 474.87 | 7.91 | 6 | 435.51 (Moon) | 60 | -20.64 |
| `BVB.3` | 3 | Skills / Courage | 447.37 | 7.46 | 7 | 393.26 (Mercury) | 40 | +14.11 |
| `BVB.6` | 6 | Enemies / Debt | 405.17 | 6.75 | 8 | 393.26 (Mercury) | 10 | +1.91 |
| `BVB.8` | 8 | Crisis / Occult | 358.67 | 5.98 | 9 | 316.23 (Mars) | 50 | -7.56 |
| `BVB.1` | 1 | Self / Body | 340.08 | 5.67 | 10 | 316.23 (Mars) | 30 | -6.15 |
| `BVB.2` | 2 | Family / Savings | 266.26 | 4.44 | 11 | 276.01 (Venus) | 20 | -29.75 |
| `BVB.7` | 7 | Partners / Spouse | 253.36 | 4.22 | 12 | 276.01 (Venus) | 0 | -22.65 |

### §6.5 Vimsopaka Bala (20-Point Varga Strength)

<!-- Weighted strength across divisional charts, scale 0–20. -->

| ID | Rank | Planet | Score | Band |
| --- | --- | --- | --- | --- |
| `VIM.1` | 1 | Jupiter | 12.1 | Dominant |
| `VIM.2` | 2 | Mars | 11.8 | Very Strong |
| `VIM.3` | 3 | Sun | 11.6 | Strong |
| `VIM.4` | 4 | Mercury | 11.6 | Strong |
| `VIM.5` | 5 | Saturn | 10.6 | Moderate |
| `VIM.6` | 6 | Venus | 10.0 | Moderate |
| `VIM.7` | 7 | Moon | 9.1 | Weak |

---

## §7 — ASHTAKAVARGA (FACTS + DERIVED)

### §7.1 BAV — Per-Planet Bindus by Sign

<!-- Bindus = benefic points each planet contributes to each sign. Max per planet per sign = 8. -->

| ID | Planet | Ar | Ta | Ge | Cn | Le | Vi | Li | Sc | Sg | Cp | Aq | Pi | Total |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `AVG.BAV.SUN` | Sun | 5 | 5 | 5 | 5 | 4 | 3 | 5 | 6 | 2 | 4 | 2 | 2 | 48 |
| `AVG.BAV.MOON` | Moon | 3 | 1 | 5 | 5 | 6 | 3 | 4 | 5 | 4 | 2 | 5 | 6 | 49 |
| `AVG.BAV.MARS` | Mars | 4 | 6 | 4 | 4 | 2 | 2 | 5 | 5 | 1 | 3 | 1 | 2 | 39 |
| `AVG.BAV.MERCURY` | Mercury | 4 | 7 | 4 | 6 | 3 | 4 | 5 | 7 | 4 | 5 | 2 | 3 | 54 |
| `AVG.BAV.JUPITER` | Jupiter | 5 | 4 | 3 | 4 | 5 | 6 | 7 | 3 | 4 | 6 | 5 | 4 | 56 |
| `AVG.BAV.VENUS` | Venus | 4 | 4 | 5 | 4 | 6 | 5 | 3 | 3 | 6 | 4 | 4 | 4 | 52 |
| `AVG.BAV.SATURN` | Saturn | 4 | 2 | 2 | 4 | 4 | 3 | 4 | 4 | 4 | 2 | 4 | 2 | 39 |

### §7.2 SAV — Sarvashtakavarga by Sign

| ID | Sign | House | SAV Total |
| --- | --- | --- | --- |
| `AVG.SAV.ARIES` | Aries | 1 | 29 |
| `AVG.SAV.TAURUS` | Taurus | 2 | 29 |
| `AVG.SAV.GEMINI` | Gemini | 3 | 28 |
| `AVG.SAV.CANCER` | Cancer | 4 | 32 |
| `AVG.SAV.LEO` | Leo | 5 | 30 |
| `AVG.SAV.VIRGO` | Virgo | 6 | 26 |
| `AVG.SAV.LIBRA` | Libra | 7 | 33 |
| `AVG.SAV.SCORPIO` | Scorpio | 8 | 33 |
| `AVG.SAV.SAGITTARIUS` | Sagittarius | 9 | 25 |
| `AVG.SAV.CAPRICORN` | Capricorn | 10 | 26 |
| `AVG.SAV.AQUARIUS` | Aquarius | 11 | 23 |
| `AVG.SAV.PISCES` | Pisces | 12 | 23 |
| `AVG.SAV.TOTAL` | (grand total) | — | 337 |

### §7.3 Shuddha Pinda (Ashtakavarga Reductions)

<!-- Rasi Pinda + Graha Pinda = Shuddha Pinda per planet. Ranking by Shuddha Pinda total. -->

| ID | Planet | Rasi Pinda | Graha Pinda | Shuddha Pinda | Rank |
| --- | --- | --- | --- | --- | --- |
| `AVG.SHP.MARS` | Mars | 136 | 62 | 198 | 1 |
| `AVG.SHP.SUN` | Sun | 123 | 49 | 172 | 2 |
| `AVG.SHP.MERCURY` | Mercury | 92 | 66 | 158 | 3 |
| `AVG.SHP.JUPITER` | Jupiter | 74 | 82 | 156 | 4 |
| `AVG.SHP.VENUS` | Venus | 78 | 39 | 117 | 5 |
| `AVG.SHP.MOON` | Moon | 80 | 32 | 112 | 6 |
| `AVG.SHP.SATURN` | Saturn | 44 | 36 | 80 | 7 |

---

## §8 — SATURN KAKSHYA ZONES (DERIVED)

<!--
Saturn transit Pisces 2025-03-30 through 2028-02-23.
Pisces is divided into 8 Kakshya zones of 3°45′ each, ruled in fixed sequence.
A zone is ACTIVE when its ruler is benefic or well-placed from the natal Moon/Lagna; otherwise INACTIVE.
The ACTIVE/INACTIVE status below is computed for this chart using natal placements.
-->

| ID | Zone | Degree Range | Ruler | Status |
| --- | --- | --- | --- | --- |
| `KAK.PISCES.Z1` | 1 | 0°00′ – 3°45′ | Saturn | ACTIVE |
| `KAK.PISCES.Z2` | 2 | 3°45′ – 7°30′ | Jupiter | INACTIVE |
| `KAK.PISCES.Z3` | 3 | 7°30′ – 11°15′ | Mars | ACTIVE |
| `KAK.PISCES.Z4` | 4 | 11°15′ – 15°00′ | Sun | INACTIVE |
| `KAK.PISCES.Z5` | 5 | 15°00′ – 18°45′ | Venus | INACTIVE |
| `KAK.PISCES.Z6` | 6 | 18°45′ – 22°30′ | Mercury | INACTIVE |
| `KAK.PISCES.Z7` | 7 | 22°30′ – 26°15′ | Moon | INACTIVE |
| `KAK.PISCES.Z8` | 8 | 26°15′ – 30°00′ | Lagna | INACTIVE |

---

## §9 — AVASTHA DIAGNOSTICS (DERIVED)

### §9.1 Jagratadi / Baladi / Deeptadi States

<!--
Jagratadi (Consciousness): Jaagrat (Awake), Swapna (Dreaming), Susupta (Deep Sleep).
Baladi (Maturity): Bala (Infant), Kumar (Adolescent), Yuva (Youth), Vradha (Old), Mrat (Dead).
Deeptadi (Mood): Deepta (Blazing), Deena (Humble), Shant (Peaceful), Swatha (Confident),
                 Muditha (Delighted), Dukhita (Distressed), Kshobita (Agitated).
-->

| ID | Planet | Role | Jagratadi | Baladi | Deeptadi |
| --- | --- | --- | --- | --- | --- |
| `AVS.MERCURY` | Mercury | Current Vimshottari MD Lord | Susupta | Mrat | Shant |
| `AVS.SATURN` | Saturn | Current Vimshottari AD Lord | Susupta | Vradha | Muditha |
| `AVS.JUPITER` | Jupiter | 9th Lord | Jaagrat | Kumar | Swatha |
| `AVS.MOON` | Moon | Mind / Chandra Lagna | Susupta | Mrat | Shant |
| `AVS.MARS` | Mars | Lagna Lord | Swapna | Vradha | Deepta |
| `AVS.SUN` | Sun | 10th Lord | Jaagrat | Kumar | Deena |
| `AVS.VENUS` | Venus | 2nd and 7th Lord | Swapna | Vradha | Swatha |

---

## §10 — CHARA KARAKAS (DERIVED)

<!--
Chara Karaka = variable Jaimini karakas, assigned by planetary longitude (degree only, sign ignored).
Highest degree = Atmakaraka, lowest = Darakaraka. Nodes excluded.
Sthira Karakas are fixed Parashari karakas listed for reference.
-->

### §10.1 Chara Karakas (Jaimini)

| ID | Role (Sanskrit) | Life Area | Planet | D1 Longitude (sign-stripped) |
| --- | --- | --- | --- | --- |
| `KRK.C.ATMA` | Atmakaraka (AK) | Soul / Self | Moon | 27°02′ |
| `KRK.C.AMATYA` | Amatyakaraka (AmK) | Career / Status | Saturn | 22°27′ |
| `KRK.C.BHRATRU` | Bhratrukaraka (BK) | Siblings / Guru / Resources | Sun | 21°57′ |
| `KRK.C.MATRU` | Matrukaraka (MK) | Mother / Heart / Home | Venus | 19°10′ |
| `KRK.C.PUTRA` | Putrakaraka (PK) | Children / Creativity / Future | Mars | 18°31′ |
| `KRK.C.GNATI` | Gnatikaraka (GK) | Obstacles / Rivals | Jupiter | 09°48′ |
| `KRK.C.DARA` | Darakaraka (DK) | Spouse / Partners | Mercury | 00°50′ |

### §10.2 Sthira Karakas (Parashari Fixed) and Pairing with Avastha State

| ID | Role | Sthira Karaka | Chara Karaka | Chara Karaka State (from §9) |
| --- | --- | --- | --- | --- |
| `KRK.S.ATMA` | Atma (Soul) | Sun | Moon | Susupta / Mrat / Shant |
| `KRK.S.AMATYA` | Amatya | Mercury | Saturn | Susupta / Vradha / Muditha |
| `KRK.S.BHRATRU` | Bhratru | Mars | Sun | Jaagrat / Kumar / Deena |
| `KRK.S.MATRU` | Matru | Moon | Venus | Swapna / Vradha / Swatha |
| `KRK.S.PUTRA` | Putra | Jupiter | Mars | Swapna / Vradha / Deepta |
| `KRK.S.GNATI` | Gnati | Saturn | Jupiter | Jaagrat / Kumar / Swatha |
| `KRK.S.DARA` | Dara | Venus | Mercury | Susupta / Mrat / Shant |
---

## §11 — SENSITIVE POINTS (DERIVED)

### §11.1 Upagrahas

<!-- Subordinate calculated points. Time-based upagrahas derive from day segments; Sun-based derive from Sun longitude. -->

| ID | Upagraha | Type | Sign | Degree | Nakshatra |
| --- | --- | --- | --- | --- | --- |
| `UPG.GULIKA` | Gulika | Time-based | Gemini | 13°57′ | Ardra |
| `UPG.MANDI` | Mandi | Time-based | Cancer | 14°13′ | Pushya |
| `UPG.YAMAGHANTAKA` | Yamaghantaka | Time-based | Taurus | 01°54′ | Krittika |
| `UPG.ARDHAPRAHARA` | Ardhaprahara | Time-based | Aries | 10°52′ | Ashwini |
| `UPG.DHUMA` | Dhuma | Sun-based | Gemini | 05°17′ | Mrigasira |
| `UPG.VYATIPATA` | Vyatipata | Sun-based | Capricorn | 24°42′ | Dhanishta |
| `UPG.PARIVESHA` | Parivesha | Sun-based | Cancer | 24°42′ | Ashlesha |
| `UPG.INDRACHAPA` | Indrachapa | Sun-based | Sagittarius | 05°17′ | Moola |
| `UPG.UPAKETU` | Upaketu | Sun-based | Sagittarius | 21°57′ | Purva Ashadha |

### §11.2 Bhrigu Bindu (Destiny Point)

<!-- Formula: (Moon + Rahu) / 2 mod 360. -->

| ID | Field | Value |
| --- | --- | --- |
| `BB.FORMULA` | Formula | (Moon_abs + Rahu_abs) / 2 mod 360 |
| `BB.INPUT.MOON` | Moon Abs Long | 327.05° |
| `BB.INPUT.RAHU` | Rahu Abs Long | 49.03° |
| `BB.RESULT.ABS` | Bhrigu Bindu Abs | 188.04° |
| `BB.RESULT.SIGN` | Sign | Libra |
| `BB.RESULT.DEG` | Degree | 08°04′ |
| `BB.RESULT.NAK` | Nakshatra | Swati |
| `BB.RESULT.PADA` | Pada | 1 |

### §11.3 Yogi / Avayogi

<!-- Yogi Point = Sun_abs + Moon_abs + 93°20′, mod 360. Yogi planet = ruler of nakshatra containing Yogi Point. Avayogi planet = ruler of 6th nakshatra from Yogi's nakshatra. -->

| ID | Field | Value |
| --- | --- | --- |
| `YOG.FORMULA` | Formula | Sun_abs + Moon_abs + 93°20′ mod 360 |
| `YOG.INPUT.SUN` | Sun Abs Long | 291.96° |
| `YOG.INPUT.MOON` | Moon Abs Long | 327.05° |
| `YOG.INPUT.CONST` | Fixed Arc | 93°20′ (93.33°) |
| `YOG.POINT.ABS` | Yogi Point Abs | 352.34° |
| `YOG.POINT.SIGN` | Yogi Point Sign | Pisces |
| `YOG.POINT.DEG` | Yogi Point Degree | 22°20′ |
| `YOG.POINT.NAK` | Yogi Point Nakshatra | Revati |
| `YOG.PLANET` | Yogi Planet | Mercury (ruler of Revati) |
| `AVY.PATH` | Avayogi Path | 6th nakshatra from Revati = Mrigasira |
| `AVY.PLANET` | Avayogi Planet | Mars (ruler of Mrigasira) |

### §11.4 Combustion and Planetary War

<!-- Combustion orb varies by planet (classical: Mercury ~14°, Venus ~10°, Mars ~17°, Jupiter ~11°, Saturn ~15°). Planetary war = conjunction within 1°. -->

| ID | Check | Result |
| --- | --- | --- |
| `CMB.MERCURY` | Mercury (0°50′ Cap) vs Sun (21°57′ Cap) | Separation ≈ 21°07′. Mercury combust orb ≈ 14°. Status: NOT COMBUST |
| `CMB.VENUS` | Venus (19°10′ Sag) vs Sun (21°57′ Cap) | Separation ≈ 32°47′. Status: NOT COMBUST |
| `CMB.MARS` | Mars (18°31′ Lib) vs Sun (21°57′ Cap) | Separation ≈ 93°26′. Status: NOT COMBUST |
| `CMB.JUPITER` | Jupiter (09°48′ Sag) vs Sun (21°57′ Cap) | Separation ≈ 42°09′. Status: NOT COMBUST |
| `CMB.SATURN` | Saturn (22°27′ Lib) vs Sun (21°57′ Cap) | Separation ≈ 89°30′. Status: NOT COMBUST |
| `WAR.CHECK` | Planetary War (conjunction within 1°) | Tightest pair: Mars (18°31′ Lib) and Saturn (22°27′ Lib) ≈ 3°56′ apart. Status: NO WAR |

### §11.5 Hazards — Gandanta, Sandhi, Mrityu Bhaga

<!--
Gandanta zones: last 3°20′ of water signs (Cancer, Scorpio, Pisces) and first 3°20′ of fire signs (Aries, Leo, Sagittarius).
Sandhi: final 0°48′–3° of any sign (junction zone).
Mrityu Bhaga: critical death-point degrees, fixed per sign per planet (classical list).
-->

| ID | Planet | Sign | Degree | Mrityu Bhaga Degree (for that sign) | Differential | Status |
| --- | --- | --- | --- | --- | --- | --- |
| `HAZ.SUN` | Sun | Capricorn | 21°57′ | 20° | 1°57′ | Safe |
| `HAZ.MOON` | Moon | Aquarius | 27°02′ | 21° | 6°02′ | Safe |
| `HAZ.MARS` | Mars | Libra | 18°31′ | 26° | 7°29′ | Safe |
| `HAZ.MERCURY` | Mercury | Capricorn | 00°50′ | 12° | 11°10′ | Safe |
| `HAZ.JUPITER` | Jupiter | Sagittarius | 09°48′ | 13° | 3°12′ | Safe |
| `HAZ.VENUS` | Venus | Sagittarius | 19°10′ | 6° | 13°10′ | Safe |
| `HAZ.SATURN` | Saturn | Libra | 22°27′ | 4° | 18°27′ | Safe |
| `HAZ.RAHU` | Rahu | Taurus | 19°01′ | 14° | 5°01′ | Safe |
| `HAZ.KETU` | Ketu | Scorpio | 19°01′ | 22° | 2°59′ | Safe |
| `HAZ.LAGNA` | Lagna | Aries | 12°23′ | 8° | 4°23′ | Safe |
| `HAZ.MANDI` | Mandi | Cancer | 14°13′ | 22° | 7°47′ | Safe |

### §11.6 Chesta Bala and Motion Audit (at birth)

| ID | Planet | Motion | Speed (% of avg) |
| --- | --- | --- | --- |
| `CHS.MERCURY` | Mercury | Direct | ~110% |
| `CHS.MARS` | Mars | Direct | ~85% |
| `CHS.JUPITER` | Jupiter | Direct | ~98% |
| `CHS.VENUS` | Venus | Direct | ~105% |
| `CHS.SATURN` | Saturn | Direct | ~92% |
| `CHS.RAHU` | Rahu | Retrograde (inherent, mean node) | 100% |
| `CHS.KETU` | Ketu | Retrograde (inherent, mean node) | 100% |

---

## §12 — SPECIAL LAGNAS AND SAHAMS (DERIVED)

### §12.1 Special Lagnas

| ID | Point | Formula | Result Abs Long | Sign | Degree | Nakshatra |
| --- | --- | --- | --- | --- | --- | --- |
| `LAG.BHAVA` | Bhava Lagna | Sun_long + (TOB - Sunrise) × (1 sign/2hr) | 14°23′ abs | Aries | 14°23′ | Ashwini |
| `LAG.HORA` | Hora Lagna | Sun_long + (TOB - Sunrise) × (1 sign/1hr) | 190°11′ abs | Libra | 10°11′ | Swati |
| `LAG.GHATI` | Ghati Lagna | Sun_long + (TOB - Sunrise) × (5 signs/1hr) | 216°53′ abs | Scorpio | 06°53′ | Anuradha |
| `LAG.INDU` | Indu Lagna | Kalamsa sum from 9th-from-Moon + 9th-from-Lagna | — | Virgo | — | Hasta |
| `LAG.SHREE` | Shree Lagna | Moon nakshatra + (Moon longitude fraction) | 264°15′ abs | Sagittarius | 24°15′ | Purva Ashadha |
| `LAG.VARNADA` | Varnada Lagna | Lagna (odd) + Hora Lagna (odd) rule | 222°23′ abs | Scorpio | 12°23′ | Anuradha |

### §12.2 Tajika Sahams (Day Birth)

<!-- Day birth = Sun above horizon. All formulas use day-birth version. All results in abs long degrees with sign and nakshatra. -->

| ID | Saham | Theme | Formula (Day Birth) | Inputs | Result Abs Long | Sign | Nakshatra |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `SAH.PUNYA` | Punya | Fortune | (Moon − Sun) + Asc | (327.04 − 291.96) + 12.40 | 47.48° | Taurus | Rohini |
| `SAH.RAJYA` | Rajya | Kingdom / Authority | (Saturn − Mars) + Asc | (202.45 − 198.52) + 12.40 | 16.33° | Aries | Bharani |
| `SAH.KARMA` | Karma | Action | (Mars − Mercury) + Asc | (198.52 − 270.83) + 12.40 | 300.09° | Aquarius | Dhanishta |
| `SAH.LABHA` | Labha | Gain | (11th Lord − 11th Cusp) + Asc | (202.45 − 306.11) + 12.40 | 268.74° | Sagittarius | Uttara Ashadha |
| `SAH.VIVAHA` | Vivaha | Marriage | (Venus − Saturn) + Asc | (259.17 − 202.45) + 12.40 | 69.12° | Gemini | Ardra |
| `SAH.PUTRA` | Putra | Children | (Jupiter − Moon) + Asc | (249.80 − 327.04) + 12.40 | 295.16° | Capricorn | Dhanishta |

---

## §13 — ARUDHAS (DERIVED)

<!--
Arudha = reflection of a house's lord, projected by counting same distance again.
Exception: Arudha cannot land in 1st or 7th from its own house; if it does, jump 10 houses further.
-->

### §13.1 Arudha Placements

| ID | Arudha | Computed Sign | Computed House (from D1 Lagna) | D1 Tenants | Derivation |
| --- | --- | --- | --- | --- | --- |
| `ARD.AL` | Arudha Lagna (AL) | Capricorn | 10 | Sun, Mercury | Lagna Aries; Lord Mars in 7th (Libra). Initial = Aries (1st) triggers exception; 10th from Aries = Capricorn. |
| `ARD.A2` | A2 (Dhana / Family) | Cancer | 4 | (A2 marker; see §13.2) | 2nd is Taurus; Lord Venus 8 signs away in Sagittarius. 8 signs from Sag = Cancer. Not 1st/7th from 2nd → no exception. |
| `ARD.A6` | A6 (Enemy) | Taurus | 2 | Rahu | (derivation per source; co-located with Rahu) |
| `ARD.A7` | A7 (Partner) | Aquarius | 11 | Moon | (derivation per source; co-located with Moon) |
| `ARD.A10` | A10 (Karma / Status) | Aries | 1 | (A10 marker) | 10th is Capricorn; Lord Saturn in 7th (Libra) = 10 signs from Cap. 10th from Libra = Cancer (7th from Cap, triggers exception). 10th from Cancer = Aries. |
| `ARD.A11` | A11 (Financial) | Gemini | 3 | UL, A5 | (derivation per source) |
| `ARD.UL` | UL (Upapada / Spouse) | Gemini | 3 | A11, A5 | 12th Lord Jupiter in Sagittarius; 10th from Sagittarius = Virgo (7th from Pisces, triggers exception). Jump 10 signs from Virgo = Gemini. |
| `ARD.AL.D9` | AL (Navamsa) | Taurus | — | — | D9 Lagna Cancer; Moon (Lagna lord) in D9 12th (Gemini); 12th from Gemini = Taurus. |
| `ARD.AL.D10` | AL (Dashamsha) | Sagittarius | — | — | D10 Lagna Leo; Sun (Lagna lord) in D10 9th (Aries); 9th from Aries = Sagittarius. |

### §13.2 Arudha Sign Occupancy

| ID | Sign | House (from D1 Lagna) | Markers / Planets Present |
| --- | --- | --- | --- |
| `ARO.ARIES` | Aries | 1 | A10 |
| `ARO.TAURUS` | Taurus | 2 | A6, Rahu |
| `ARO.GEMINI` | Gemini | 3 | UL, A5, A11 |
| `ARO.CANCER` | Cancer | 4 | A2 |
| `ARO.LEO` | Leo | 5 | A3 |
| `ARO.VIRGO` | Virgo | 6 | A4, A9, A8 |
| `ARO.LIBRA` | Libra | 7 | Saturn, Mars |
| `ARO.SCORPIO` | Scorpio | 8 | Ketu |
| `ARO.SAGITTARIUS` | Sagittarius | 9 | Jupiter, Venus |
| `ARO.CAPRICORN` | Capricorn | 10 | AL, Sun, Mercury |
| `ARO.AQUARIUS` | Aquarius | 11 | Moon, A7 |
| `ARO.PISCES` | Pisces | 12 | (none) |

---

## §14 — STELLAR MATRIX — NAVATARA (DERIVED)

<!-- Navatara = 9-star cycle from Janma Nakshatra. Also 22nd (Vainashika), 16th (Sanghatika), 25th (Manasa) taras. -->

### §14.1 Navatara from Janma Nakshatra

<!-- Janma Nakshatra = Purva Bhadrapada (Moon's star). -->

| ID | Position | Tara | Nakshatra | Tenants |
| --- | --- | --- | --- | --- |
| `NVT.01.JANMA` | 1 | Janma | Purva Bhadrapada | Moon |
| `NVT.02.SAMPAT` | 2 | Sampat | Uttara Bhadrapada | (none) |
| `NVT.03.VIPAT` | 3 | Vipat | Revati | (none) |
| `NVT.04.KSHEMA` | 4 | Kshema | Ashwini | Lagna |
| `NVT.05.PRATYAK` | 5 | Pratyak | Bharani | (none) |
| `NVT.06.SADHANA` | 6 | Sadhana | Krittika | (none) |
| `NVT.07.NAIDHANA` | 7 | Naidhana | Rohini | Rahu |
| `NVT.08.MITRA` | 8 | Mitra | Mrigasira | (none) |
| `NVT.09.PARAM` | 9 | Parama Mitra | Ardra | (none) |

### §14.2 Extended Tara Positions

| ID | Position from Janma | Tara | Nakshatra | Tenants |
| --- | --- | --- | --- | --- |
| `NVT.16.SANGHATIKA` | 16 | Sanghatika | Hasta | (none) |
| `NVT.22.VAINASHIKA` | 22 | Vainashika | Moola | Jupiter |
| `NVT.25.MANASA` | 25 | Manasa | Shravana | Sun |

---

## §15 — PANCHANG DNA (FACTS)

### §15.1 Panchang at Birth

| ID | Component | Value | Deity / Element | Classification |
| --- | --- | --- | --- | --- |
| `PCG.VARA` | Vara (Day) | Sunday | Surya (Sun) / Agni (Fire) | — |
| `PCG.TITHI` | Tithi | Shukla Tritiya | Gauri (Parvati) | Jaya (Victory) |
| `PCG.NAKSHATRA` | Nakshatra | Purva Bhadrapada | Aja Ekapada | Ugra (Fierce) |
| `PCG.YOGA` | Yoga | Shiva | Mitra | Auspicious |
| `PCG.KARANA` | Karana | Garija | Earth | Productive |
| `PCG.DAGDHA` | Dagdha Rashis | Leo, Capricorn | Burnt Signs | — |

### §15.2 Avakahada Chakra

| ID | Component | Value |
| --- | --- | --- |
| `PCG.VARNA` | Varna | Sudra |
| `PCG.VASHYA` | Vashya | Manav (Human) |
| `PCG.YONI` | Yoni | Simha (Lion) |
| `PCG.GANA` | Gana | Manushya (Human) |
| `PCG.NADI` | Nadi | Adi (Start) |
---

## §16 — ASPECTS — GRAHA DRISHTI (FACTS)

### §16.1 Classical Vedic Aspects (Graha Drishti)

<!-- Each planet aspects the 7th house from itself. Mars adds 4th and 8th. Jupiter adds 5th and 9th. Saturn adds 3rd and 10th. Rahu/Ketu follow the Jupiter-style 5/9 or the Saturn-style 3/10 depending on school; this chart uses the 5/7/9 convention per source. -->

| ID | Planet | From Sign | Aspect Rays |
| --- | --- | --- | --- |
| `ASP.G.SUN` | Sun | Capricorn | 7th on Cancer |
| `ASP.G.MOON` | Moon | Aquarius | 7th on Leo |
| `ASP.G.MARS` | Mars | Libra | 4th on Capricorn; 7th on Aries; 8th on Pisces |
| `ASP.G.MERCURY` | Mercury | Capricorn | 7th on Cancer |
| `ASP.G.JUPITER` | Jupiter | Sagittarius | 5th on Aries; 7th on Gemini; 9th on Leo |
| `ASP.G.VENUS` | Venus | Sagittarius | 7th on Gemini |
| `ASP.G.SATURN` | Saturn | Libra | 3rd on Sagittarius; 7th on Aries; 10th on Cancer |
| `ASP.G.RAHU` | Rahu | Taurus | 5th on Virgo; 7th on Scorpio; 9th on Capricorn |
| `ASP.G.KETU` | Ketu | Scorpio | 5th on Pisces; 7th on Taurus; 9th on Cancer |

### §16.2 Tight-Orb Aspects (Western Overlay)

<!-- Western aspect orbs including outer planets (Uranus, Neptune, Pluto). Weight 10 = major, 3 = minor, 1 = subtle. -->

| ID | Pair | Aspect | Orb (°) | Weight |
| --- | --- | --- | --- | --- |
| `ASP.W.PLUTO_KETU` | Pluto–Ketu | Nonile | 0.28 | 1 |
| `ASP.W.PLUTO_URANUS` | Pluto–Uranus | Nonile | 0.45 | 1 |
| `ASP.W.MERCURY_KETU` | Mercury–Ketu | Quincunx | 0.50 | 1 |
| `ASP.W.PLUTO_SATURN` | Pluto–Saturn | Conjunction | 0.69 | 10 |
| `ASP.W.SATURN_MOON` | Saturn–Moon | Trine | 0.70 | 3 |
| `ASP.W.NEPTUNE_MERCURY` | Neptune–Mercury | Semi-Square | 0.92 | 1 |
| `ASP.W.MARS_SUN` | Mars–Sun | Square | 1.28 | 3 |
| `ASP.W.SATURN_JUPITER` | Saturn–Jupiter | Sextile | 1.36 | 3 |
| `ASP.W.VENUS_KETU` | Venus–Ketu | Sextile | 1.53 | 3 |
| `ASP.W.URANUS_VENUS` | Uranus–Venus | Sextile | 1.62 | 3 |
| `ASP.W.NEPTUNE_VENUS` | Neptune–Venus | Conjunction | 1.81 | 10 |
| `ASP.W.PLUTO_NEPTUNE` | Pluto–Neptune | Sextile | 2.20 | 3 |
| `ASP.W.PLUTO_JUPITER` | Pluto–Jupiter | Sextile | 2.34 | 3 |
| `ASP.W.MARS_VENUS` | Mars–Venus | Sextile | 2.68 | 3 |
| `ASP.W.SATURN_MARS` | Saturn–Mars | Square | 2.75 | 3 |
| `ASP.W.PLUTO_MOON` | Pluto–Moon | Conjunction | 3.30 | 10 |
| `ASP.W.JUPITER_VENUS` | Jupiter–Venus | Conjunction | 3.76 | 10 |
| `ASP.W.MARS_SATURN` | Mars–Saturn | Conjunction | 7.38 | 10 |
| `ASP.W.NEPTUNE_JUPITER` | Neptune–Jupiter | Conjunction | 8.05 | 10 |
| `ASP.W.KETU_MOON` | Ketu–Moon | Conjunction | 9.89 | 10 |
| `ASP.W.URANUS_KETU` | Uranus–Ketu | Conjunction | 9.89 | 10 |
| `ASP.W.RAHU_MOON` | Rahu–Moon | Opposition | 10.00 | 10 |
| `ASP.W.RAHU_URANUS` | Rahu–Uranus | Opposition | 10.00 | 10 |

### §16.3 Bhav-Madhya Aspects (Planet → House Cusp)

<!-- Aspects cast onto specific house mid-points (Bhav Madhya). -->

| ID | Planet | House | Aspect | Orb (°) | Weight |
| --- | --- | --- | --- | --- | --- |
| `ASP.BM.PLUTO.11` | Pluto | 11 | Square | 0.25 | 3 |
| `ASP.BM.PLUTO.12.Q` | Pluto | 12 | Quincunx | 0.22 | 1 |
| `ASP.BM.SUN.10` | Sun | 10 | Conjunction | 0.56 | 10 |
| `ASP.BM.VENUS.9` | Venus | 9 | Conjunction | 0.80 | 10 |
| `ASP.BM.JUPITER.10` | Jupiter | 10 | Sextile | 1.15 | 3 |
| `ASP.BM.NEPTUNE.11` | Neptune | 11 | Square | 1.81 | 3 |
| `ASP.BM.PLUTO.10` | Pluto | 10 | Sextile | 1.82 | 3 |
| `ASP.BM.PLUTO.12.T` | Pluto | 12 | Trine | 1.82 | 3 |
| `ASP.BM.MOON.11` | Moon | 11 | Conjunction | 1.86 | 10 |
| `ASP.BM.NEPTUNE.10` | Neptune | 10 | Sextile | 2.62 | 3 |
| `ASP.BM.JUPITER.11` | Jupiter | 11 | Square | 2.72 | 3 |
| `ASP.BM.RAHU.8` | Rahu | 8 | Opposition | 3.48 | 10 |
| `ASP.BM.PLUTO.6` | Pluto | 6 | Conjunction | 7.39 | 10 |
| `ASP.BM.MERCURY.9` | Mercury | 9 | Conjunction | 8.58 | 10 |

### §16.4 Trine Check (D1 Abs-Long Geometry)

| ID | Check | Result |
| --- | --- | --- |
| `TRN.SUN_RAHU` | Sun (291.96°) vs Rahu (49.03°) | Separation ≈ 117.07° → within ~3° of exact 120° trine (partial trine alignment) |
| `TRN.OTHER` | Other pairs within ±3° of 120° or 240° | None |

---

## §17 — CHALIT KINETIC SHIFTS (DERIVED)

<!-- Planets whose Rashi house differs from their Chalit (degree-based) house. Primary source-of-truth for outcome delivery in Sripathi system. -->

| ID | Planet | Rashi House | Chalit House | Shift |
| --- | --- | --- | --- | --- |
| `CKS.SUN` | Sun | 10 | 11 | +1 (Career → Gains) |
| `CKS.MOON` | Moon | 11 | 12 | +1 (Gains → Loss/Foreign) |
| `CKS.MERCURY` | Mercury | 10 | 10 (Chalit near-cusp, 2.14° from House 10 cusp) | 0 |
| `CKS.MARS` | Mars | 7 | 7 | 0 |
| `CKS.SATURN` | Saturn | 7 | 7 | 0 |
| `CKS.JUPITER` | Jupiter | 9 | 9 | 0 |
| `CKS.VENUS` | Venus | 9 | 9 | 0 |
| `CKS.RAHU` | Rahu | 2 | 2 | 0 |
| `CKS.KETU` | Ketu | 8 | 8 | 0 |

---

## §18 — CHANDRA CHART (FROM-MOON VIEW)

<!-- All houses reckoned from the Moon sign (Aquarius) as the 1st. Planets placed by the same D1 longitudes, mapped to Moon-centered houses. Pluto/Uranus/Neptune included where present in source. -->

| ID | House from Moon | Sign | Planets |
| --- | --- | --- | --- |
| `CHN.1` | 1 (Self) | Aquarius | Moon |
| `CHN.2` | 2 (Speech) | Pisces | (none) |
| `CHN.3` | 3 (Effort) | Aries | (none) |
| `CHN.4` | 4 (Peace) | Taurus | Rahu |
| `CHN.5` | 5 (Progeny) | Gemini | (none) |
| `CHN.6` | 6 (Enemy) | Cancer | (none) |
| `CHN.7` | 7 (Partner) | Leo | (none) |
| `CHN.8` | 8 (Transformation) | Virgo | (none) |
| `CHN.9` | 9 (Luck) | Libra | Pluto, Mars, Saturn |
| `CHN.10` | 10 (Work) | Scorpio | Ketu, Uranus |
| `CHN.11` | 11 (Gains) | Sagittarius | Neptune, Jupiter, Venus |
| `CHN.12` | 12 (Loss) | Capricorn | Sun, Mercury |

---

## §19 — KOTA CHAKRA (DERIVED)

<!-- Kota Chakra: fortress-metaphor defensive chart built from Moon nakshatra series. -->

| ID | Component | Value |
| --- | --- | --- |
| `KOT.SWAMI` | Kota Swami (Fort Lord) | Saturn (lord of Moon sign Aquarius) |
| `KOT.PALA` | Kota Pala (Fort Guard) | Jupiter (lord of Moon nakshatra Purva Bhadrapada) |
| `KOT.STAMBHA` | Stambha (Inner Pillar) | Moon (empty of other planets per source; Moon itself at center) |
| `KOT.MADHYA` | Madhya (Inner Court) | Sun, Mercury |
| `KOT.PRAKARA` | Prakara (Walls) | Jupiter, Venus |
| `KOT.BAHYA` | Bahya (Exterior / Moat) | Mars, Saturn, Rahu |

---

## §20 — DEITY ASSIGNMENTS (DERIVED)

### §20.1 Deity Triad (Jaimini Derivation)

<!--
Derivation rules (classical Jaimini):
  Ishta Devata = planetary ruler of the 12th sign from Atmakaraka in D9.
  Dharma Devata = planetary ruler of the 9th sign from Atmakaraka in D9.
  Palana Devata = planetary ruler of the sign of Atmakaraka in D9.
Atmakaraka = Moon (highest D1 longitude 27°02′). In D9, Moon is in Gemini.
From Gemini: 12th = Taurus (ruler Venus); 9th = Aquarius (ruler Saturn); 1st (AK placement) = Gemini (ruler Mercury).
-->

| ID | Role | D9 Sign (calc'd position from AK) | Ruling Planet | Deity |
| --- | --- | --- | --- | --- |
| `DEV.ISHTA` | Ishta Devata (12th from AK in D9) | Taurus | Venus | Mahalakshmi |
| `DEV.DHARMA` | Dharma Devata (9th from AK in D9) | Aquarius | Saturn | Lord Venkateswara (Balaji) |
| `DEV.PALANA` | Palana Devata (AK sign in D9) | Gemini | Mercury | Sri Krishna / Vishnu |

### §20.2 Digpala and Divisional Deity Mapping

| ID | Scope | Assignments |
| --- | --- | --- |
| `DEV.D10.DIG` | D10 Digpala | Lagna → Varuna; Sun (10th Lord) → Yama; Saturn (10th Occupant) → Isana |
| `DEV.D20` | D20 Deity | Lagna → Jvalamukhi; Sun → Vimala; Moon → Tripurasundari |
| `DEV.D24` | D24 Deity | Lagna → Govinda; Mercury (Karaka) → Bhima; Jupiter → Antaka |
| `DEV.D60` | D60 Label | Lagna → Deva; Sun → Amrita; Moon → Krura; Saturn → Saumya |
| `DEV.KOTA` | Kota Chakra | Swami → Saturn; Pala → Jupiter; Stambha → (empty) |
| `DEV.DAGDHA` | Dagdha Rashi | Leo, Capricorn |

### §20.3 Planet → Deity Ledger (D10 / D20 / D24 / D60)

| ID | Body | D10 Digpala | D20 Deity | D24 Deity | D60 Label |
| --- | --- | --- | --- | --- | --- |
| `DEV.L.SUN` | Sun | Yama | Vimala | Maya | Amrita |
| `DEV.L.MOON` | Moon | Ananta | Tripurasundari | Govinda | Krura |
| `DEV.L.MARS` | Mars | Kubera | Pratyangira | Anala | Amrita |
| `DEV.L.MERCURY` | Mercury | Ananta | Tara | Bhima | Bhramana |
| `DEV.L.JUPITER` | Jupiter | Rakshasa | Sati | Antaka | Komala |
| `DEV.L.VENUS` | Venus | Kubera | Pratyangira | Vishwakarma | Poornachandra |
| `DEV.L.SATURN` | Saturn | Isana | Raudri | Mitra | Saumya |

---

## §21 — SADE SATI — SATURNINE TRANSIT (FACTS)

<!-- Sade Sati phases: Rising (Saturn in 12th from natal Moon) → Peak (Moon sign) → Setting (2nd from Moon). -->

| ID | Cycle | Saturn Sign | Start | End | Phase |
| --- | --- | --- | --- | --- | --- |
| `TRS.SS.C2.P1` | Cycle 2 | Capricorn | 2020-01-24 | 2022-04-28 | Rising |
| `TRS.SS.C2.P2` | Cycle 2 | Aquarius | 2022-04-29 | 2022-07-12 | Peak |
| `TRS.SS.C2.P3` | Cycle 2 | Capricorn | 2022-07-13 | 2023-01-17 | Rising |
| `TRS.SS.C2.P4` | Cycle 2 | Aquarius | 2023-01-18 | 2025-03-29 | Peak |
| `TRS.SS.C2.P5` | Cycle 2 | Pisces | 2025-03-30 | 2027-06-02 | Setting |
| `TRS.SS.C2.P6` | Cycle 2 | Pisces | 2027-10-20 | 2028-02-23 | Setting |
| `TRS.SS.FUT1` | Future (Dhaiya) | Taurus | 2029-08-08 | 2029-10-05 | Kantaka Shani |
| `TRS.SS.FUT2` | Future (Dhaiya) | Taurus | 2030-04-17 | 2032-05-30 | Kantaka Shani |

---

## §22 — VARSHPHAL 2026–2027 (FACTS)

<!-- Annual solar return chart. Overrides general Dasha trends for its validity window. -->

| ID | Component | Value |
| --- | --- | --- |
| `VRS.VALIDITY` | Validity | 2026-02-05 to 2027-02-05 |
| `VRS.MUNTHA.SIGN` | Muntha | Libra (7th House) |
| `VRS.MUNTHA.LORD` | Muntha Lord | Venus |
| `VRS.YEAR.LORD` | Year Lord | (requires exact solar return time) |
| `VRS.MUDDA.DASHA` | Mudda Dasha | (variable per solar return calculation) |
---

## §23 — CROSS-REFERENCE MATRICES (DERIVED INDEXES)

<!--
These matrices are derived indexes, not new data. They restate values defined elsewhere in the document
to enable O(1) lookup. When a value in the source tables changes, the corresponding cell here must be updated.
Every cell is sourced from an ID defined above in §1–§22.
-->

### §23.1 Planet-Centric Matrix

<!--
One row per graha, with every context that planet appears in. Read left-to-right for full planetary profile.
Columns: D1 sign/deg/nak/pada → house (Rashi/Chalit) → abs long → D9 sign → D10 sign/house →
Vargottama → Shadbala (rupas, rank) → Shuddha Pinda rank → Vimsopaka → Chara Karaka role →
Sthira Karaka role → Avastha triad → Dasha status → Aspects out (Vedic) → Tight-orb aspects involving this planet.
-->

#### Sun (`PLN.SUN`)

| Dimension | Value |
| --- | --- |
| D1 Sign / Degree | Capricorn 21°57′35″ |
| Nakshatra / Pada | Shravana / 4 |
| Abs Longitude | 291.96° |
| Rashi House | 10 |
| Chalit House | 11 |
| D9 Sign | Cancer |
| D10 Sign / House | Aries / 9 |
| Vargottama | NO |
| Shadbala (Rupas / Rank) | 8.51 / 1 |
| Shuddha Pinda Rank | 2 (172) |
| Vimsopaka Rank | 3 (11.6) |
| Uccha Band | Average (33.99) |
| Chara Karaka Role | Bhratrukaraka (BK) |
| Sthira Karaka Role | Atma |
| Avastha (J/B/D) | Jaagrat / Kumar / Deena |
| Current Dasha Role | — |
| Vedic Aspects Cast | 7th on Cancer |
| Notable Tight Aspects | Square Mars (1.28°) |
| Sahams Involving | Punya (Moon − Sun + Asc); Karma (derived chain) |
| Key D9 Role | Exaltation ruler of Aries (relevant to Saturn NBRY cancellation via §3.5.1) |

#### Moon (`PLN.MOON`)

| Dimension | Value |
| --- | --- |
| D1 Sign / Degree | Aquarius 27°02′48″ |
| Nakshatra / Pada | Purva Bhadrapada / 3 |
| Abs Longitude | 327.05° |
| Rashi House | 11 |
| Chalit House | 12 |
| D9 Sign | Gemini |
| D10 Sign / House | Scorpio / 4 |
| Vargottama | NO |
| Shadbala (Rupas / Rank) | 7.26 / 3 |
| Shuddha Pinda Rank | 6 (112) |
| Vimsopaka Rank | 7 (9.1) |
| Uccha Band | High (38.02) |
| Chara Karaka Role | Atmakaraka (AK) |
| Sthira Karaka Role | Matru |
| Avastha (J/B/D) | Susupta / Mrat / Shant |
| Current Dasha Role | — |
| Vedic Aspects Cast | 7th on Leo |
| Notable Tight Aspects | Trine Saturn (0.70°); Conjunction Pluto (3.30°); Opposition Rahu (10.00°); Conjunction Ketu (9.89°) |
| Sahams Involving | Punya, Putra, Labha |
| Key D9 Role | Tenant of D9 12th house Gemini (§3.5.2) |

#### Mars (`PLN.MARS`)

| Dimension | Value |
| --- | --- |
| D1 Sign / Degree | Libra 18°31′38″ |
| Nakshatra / Pada | Swati / 4 |
| Abs Longitude | 198.53° |
| Rashi House | 7 |
| Chalit House | 7 |
| D9 Sign | Pisces |
| D10 Sign / House | Aries / 9 |
| Vargottama | NO |
| Shadbala (Rupas / Rank) | 5.27 / 5 |
| Shuddha Pinda Rank | 1 (198) |
| Vimsopaka Rank | 2 (11.8) |
| Uccha Band | Average (26.84) |
| Chara Karaka Role | Putrakaraka (PK) |
| Sthira Karaka Role | Bhratru |
| Avastha (J/B/D) | Swapna / Vradha / Deepta |
| Current Dasha Role | — |
| Vedic Aspects Cast | 4th on Capricorn; 7th on Aries; 8th on Pisces |
| Notable Tight Aspects | Conjunction Saturn (7.38°); Square Sun (1.28°); Square Saturn (2.75°); Sextile Venus (2.68°) |
| Sahams Involving | Rajya, Karma |
| Special Role | Avayogi planet (§11.3); Lagna Lord |

#### Mercury (`PLN.MERCURY`)

| Dimension | Value |
| --- | --- |
| D1 Sign / Degree | Capricorn 00°50′11″ |
| Nakshatra / Pada | Uttara Ashadha / 2 |
| Abs Longitude | 270.84° |
| Rashi House | 10 |
| Chalit House | 10 (2.14° from House 10 cusp — the closest-to-cusp placement in the chart) |
| D9 Sign | Capricorn |
| D10 Sign / House | Virgo / 2 |
| Vargottama | YES (Capricorn in D1 and D9) |
| Shadbala (Rupas / Rank) | 6.55 / 6 |
| Shuddha Pinda Rank | 3 (158) |
| Vimsopaka Rank | 4 (11.6) |
| Uccha Band | Low (24.72) |
| Chara Karaka Role | Darakaraka (DK) |
| Sthira Karaka Role | Amatya |
| Avastha (J/B/D) | Susupta / Mrat / Shant |
| Current Dasha Role | Current Vimshottari Mahadasha Lord (2010-08-21 to 2027-08-21) |
| Vedic Aspects Cast | 7th on Cancer |
| Notable Tight Aspects | Quincunx Ketu (0.50°); Semi-Square Neptune (0.92°) |
| Sahams Involving | Karma (as minuend ref), Vivaha (implicit via chain) |
| Special Role | Yogi planet (§11.3); Dispositor of D9 12th stellium (§3.5.2); NBRY cancellation agent for Venus (§3.5.1) |

#### Jupiter (`PLN.JUPITER`)

| Dimension | Value |
| --- | --- |
| D1 Sign / Degree | Sagittarius 09°48′28″ |
| Nakshatra / Pada | Moola / 3 |
| Abs Longitude | 249.81° |
| Rashi House | 9 |
| Chalit House | 9 |
| D9 Sign | Gemini |
| D10 Sign / House | Pisces / 8 |
| Vargottama | NO |
| Shadbala (Rupas / Rank) | 7.73 / 4 |
| Shuddha Pinda Rank | 4 (156) |
| Vimsopaka Rank | 1 (12.1) |
| Uccha Band | Low (8.40) |
| Chara Karaka Role | Gnatikaraka (GK) |
| Sthira Karaka Role | Putra |
| Avastha (J/B/D) | Jaagrat / Kumar / Swatha |
| Current Dasha Role | — |
| Vedic Aspects Cast | 5th on Aries; 7th on Gemini; 9th on Leo |
| Notable Tight Aspects | Conjunction Venus (3.76°); Sextile Saturn (1.36°); Conjunction Neptune (8.05°); Sextile Pluto (2.34°) |
| Sahams Involving | Putra |
| Special Role | Tenant of D9 12th (§3.5.2); sits in Vainashika Tara from Moon (§14.2); 9th Lord |

#### Venus (`PLN.VENUS`)

| Dimension | Value |
| --- | --- |
| D1 Sign / Degree | Sagittarius 19°10′12″ |
| Nakshatra / Pada | Purva Ashadha / 2 |
| Abs Longitude | 259.17° |
| Rashi House | 9 |
| Chalit House | 9 |
| D9 Sign | Virgo |
| D10 Sign / House | Gemini / 11 |
| Vargottama | NO |
| Shadbala (Rupas / Rank) | 4.60 / 7 |
| Shuddha Pinda Rank | 5 (117) |
| Vimsopaka Rank | 6 (10.0) |
| Uccha Band | Average (27.39) |
| Chara Karaka Role | Matrukaraka (MK) |
| Sthira Karaka Role | Dara |
| Avastha (J/B/D) | Swapna / Vradha / Swatha |
| Current Dasha Role | Next MD after Ketu (starts 2034-08-21) |
| Vedic Aspects Cast | 7th on Gemini |
| Notable Tight Aspects | Conjunction Jupiter (3.76°); Sextile Mars (2.68°); Conjunction Neptune (1.81°); Sextile Ketu (1.53°); Sextile Uranus (1.62°) |
| Sahams Involving | Vivaha (as minuend) |
| Special Role | Ishta Devata ruler (Mahalakshmi per §20.1); Debilitated in D9 with Neecha Bhanga via Mercury (§3.5.1); 2nd and 7th Lord |

#### Saturn (`PLN.SATURN`)

| Dimension | Value |
| --- | --- |
| D1 Sign / Degree | Libra 22°27′04″ |
| Nakshatra / Pada | Vishakha / 1 |
| Abs Longitude | 202.45° |
| Rashi House | 7 |
| Chalit House | 7 |
| D9 Sign | Aries |
| D10 Sign / House | Taurus / 10 |
| Vargottama | NO |
| Shadbala (Rupas / Rank) | 7.47 / 2 |
| Shuddha Pinda Rank | 7 (80) |
| Vimsopaka Rank | 5 (10.6) |
| Uccha Band | Max (59.18 — near-maximum exaltation strength) |
| Chara Karaka Role | Amatyakaraka (AmK) |
| Sthira Karaka Role | Gnati |
| Avastha (J/B/D) | Susupta / Vradha / Muditha |
| Current Dasha Role | Current Vimshottari Antardasha Lord (2024-12-12 to 2027-08-21) |
| Vedic Aspects Cast | 3rd on Sagittarius; 7th on Aries; 10th on Cancer |
| Notable Tight Aspects | Conjunction Pluto (0.69°); Trine Moon (0.70°); Conjunction Mars (7.38°); Sextile Jupiter (1.36°); Square Mars (2.75°) |
| Sahams Involving | Rajya (as minuend), Vivaha (as subtrahend), Labha (11th Lord ref) |
| Special Role | Exalted in D1 Libra; Debilitated in D9 Aries with Neecha Bhanga via Sun (§3.5.1); Dharma Devata ruler (§20.1); Kota Swami (§19); 10th/11th Lord |

#### Rahu (`PLN.RAHU`)

| Dimension | Value |
| --- | --- |
| D1 Sign / Degree | Taurus 19°01′47″ |
| Nakshatra / Pada | Rohini / 3 |
| Abs Longitude | 49.03° |
| Rashi House | 2 |
| Chalit House | 2 |
| D9 Sign | Gemini |
| D10 Sign / House | Cancer / 12 |
| Vargottama | NO |
| Shadbala | (nodes not scored classically) |
| Shuddha Pinda Rank | (nodes not scored) |
| Vimsopaka Rank | (nodes not scored) |
| Uccha Band | (nodes not scored) |
| Chara Karaka Role | (nodes excluded) |
| Sthira Karaka Role | (nodes not assigned) |
| Avastha | (nodes not assigned) |
| Current Dasha Role | — |
| Vedic Aspects Cast | 5th on Virgo; 7th on Scorpio; 9th on Capricorn |
| Notable Tight Aspects | Opposition Moon (10.00°); Opposition Uranus (10.00°) |
| Special Role | Tenant of D9 12th (§3.5.2); in Naidhana Tara from Moon (§14.1); Motion: inherent retrograde (mean node) |

#### Ketu (`PLN.KETU`)

| Dimension | Value |
| --- | --- |
| D1 Sign / Degree | Scorpio 19°01′47″ |
| Nakshatra / Pada | Jyeshtha / 1 |
| Abs Longitude | 229.03° |
| Rashi House | 8 |
| Chalit House | 8 |
| D9 Sign | Sagittarius |
| D10 Sign / House | Capricorn / 6 |
| Vargottama | NO |
| Shadbala | (nodes not scored classically) |
| Shuddha Pinda Rank | (nodes not scored) |
| Vimsopaka Rank | (nodes not scored) |
| Uccha Band | (nodes not scored) |
| Chara Karaka Role | (nodes excluded) |
| Sthira Karaka Role | (nodes not assigned) |
| Avastha | (nodes not assigned) |
| Current Dasha Role | — |
| Vedic Aspects Cast | 5th on Pisces; 7th on Taurus; 9th on Cancer |
| Notable Tight Aspects | Quincunx Mercury (0.50°); Conjunction Moon (9.89°); Conjunction Uranus (9.89°); Sextile Venus (1.53°); Nonile Pluto (0.28°) |
| Special Role | Motion: inherent retrograde (mean node) |

---

### §23.2 House-Centric Matrix

<!--
One row per house (1–12), aggregating every structural dimension of that house.
Columns: lord → Rashi occupants → Chalit occupants → SAV → Bhavabala (total, rupas, rank) →
lord strength (Virupa) → dig bala contribution → aspectual contribution → KP significators →
Arudhas landing in the sign that is this house from D1 Lagna → Sahams landing in that sign.
-->

| House | Sign | Lord | Rashi Occupants | Chalit Occupants (if differ) | SAV | Bhavabala (Virupa / Rupa / Rank) | Lord Strength (Virupa) | Dig Bala | Drik | KP Significators | Arudhas | Sahams | Aspects Received (Graha Drishti) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Aries | Mars | (none) | (none) | 29 | 340.08 / 5.67 / 10 | 316.23 (Mars) | 30 | -6.15 | Mars, Ketu | A10 | Rajya (Aries, Bharani) | Mars (7th from Libra); Saturn (7th from Libra); Jupiter (5th from Sag); Rahu — no; (Lagna = Ashwini Pada 4) |
| 2 | Taurus | Venus | Rahu | (same) | 29 | 266.26 / 4.44 / 11 | 276.01 (Venus) | 20 | -29.75 | Rahu, Venus | A6 | Punya (Taurus, Rohini) | Ketu (7th from Scorpio) |
| 3 | Gemini | Mercury | (none) | (none) | 28 | 447.37 / 7.46 / 7 | 393.26 (Mercury) | 40 | +14.11 | — | UL, A5, A11 | Vivaha (Gemini, Ardra) | Jupiter (7th from Sag); Venus (7th from Sag) |
| 4 | Cancer | Moon | (none) | (none) | 32 | 474.87 / 7.91 / 6 | 435.51 (Moon) | 60 | -20.64 | — | A2 | — | Sun (7th from Cap); Mercury (7th from Cap); Saturn (10th from Lib); Ketu (9th from Sco); Mars (4th from Lib — no, Mars 4th = Cap) |
| 5 | Leo | Sun | (none) | (none) | 30 | 486.86 / 8.11 / 2 | 510.85 (Sun) | 10 | -33.99 | — | A3 | — | Moon (7th from Aqu); Jupiter (9th from Sag) |
| 6 | Virgo | Mercury | (none) | (none) | 26 | 405.17 / 6.75 / 8 | 393.26 (Mercury) | 10 | +1.91 | Mars, Ketu, Mercury | A4, A9, A8 | — | Rahu (5th from Tau) |
| 7 | Libra | Venus | Saturn, Mars | (same) | 33 | 253.36 / 4.22 / 12 | 276.01 (Venus) | 0 | -22.65 | Moon, Saturn, Venus | (Saturn, Mars) | — | (no direct incoming from §16.1; 7th-glyph aspects outbound) |
| 8 | Scorpio | Mars | Ketu | (same) | 33 | 358.67 / 5.98 / 9 | 316.23 (Mars) | 50 | -7.56 | — | (Ketu) | — | Rahu (7th from Tau) |
| 9 | Sagittarius | Jupiter | Jupiter, Venus | (same) | 25 | 477.55 / 7.96 / 5 | 464.07 (Jupiter) | 20 | -6.52 | — | (Jupiter, Venus) | Labha (Sag, Uttara Ashadha) | Saturn (3rd from Lib) |
| 10 | Capricorn | Saturn | Sun, Mercury | +Mercury stays; Sun moves to 11 Chalit | 26 | 482.99 / 8.05 / 3 | 447.98 (Saturn) | 60 | -24.99 | Mercury, Venus, Mars, Ketu, Sun, Saturn | AL (+ Sun, Mercury) | Putra (Cap, Dhanishta) | Mars (4th from Lib); Rahu (9th from Tau); Saturn (10th from Lib) |
| 11 | Aquarius | Saturn | Moon | +Sun (Chalit) | 23 | 478.27 / 7.97 / 4 | 447.98 (Saturn) | 40 | -9.71 | Sun, Rahu, Moon, Saturn | (Moon, A7) | Karma (Aquarius, Dhanishta) | (no listed incoming) |
| 12 | Pisces | Jupiter | (none) | +Moon (Chalit) | 23 | 506.09 / 8.43 / 1 | 464.07 (Jupiter) | 20 | +22.02 | Saturn, Jupiter | (none) | — | Mars (8th from Lib); Ketu (5th from Sco) |

---

### §23.3 Date-Centric Matrix — 2026-01 through 2028-02

<!--
For any date in this window, look up: Vimshottari MD/AD, Yogini Dasha, Jaimini Chara Dasha,
Sade Sati phase, Saturn Kakshya zone (when computable), active Varshphal.
All values sourced from §5, §8, §21, §22. Range intentionally centered on the current operational window.
Bracketed approximate end-of-AD dates should be verified against the source tables if exactness is required.
-->

| Period | Vimshottari MD – AD | Yogini Dasha | Jaimini Chara MD – AD | Sade Sati | Varshphal Year |
| --- | --- | --- | --- | --- | --- |
| 2026-01-01 → 2026-02-04 | Mercury – Saturn | Bhadrika (Mercury) | Libra – Libra | Setting (Pisces) | 2025–2026 (prior) |
| 2026-02-05 → 2026-12-21 | Mercury – Saturn | Bhadrika (Mercury) | Scorpio – Libra | Setting (Pisces) | 2026–2027 (Muntha Libra, Lord Venus) |
| 2026-12-22 → 2027-01-04 | Mercury – Saturn | Ulka (Saturn) | Scorpio – Libra | Setting (Pisces) | 2026–2027 |
| 2027-01-05 → 2027-02-04 | Mercury – Saturn | Ulka (Saturn) | Scorpio – Virgo | Setting (Pisces) | 2026–2027 |
| 2027-02-05 → 2027-06-02 | Mercury – Saturn | Ulka (Saturn) | Scorpio – Virgo | Setting (Pisces) | 2027–2028 |
| 2027-06-03 → 2027-08-20 | Mercury – Saturn | Ulka (Saturn) | Scorpio – Virgo | (Pisces completed 2027-06-02; gap) | 2027–2028 |
| 2027-08-21 → 2027-10-19 | Ketu – Ketu | Ulka (Saturn) | Scorpio – Virgo | (gap) | 2027–2028 |
| 2027-10-20 → 2027-12-04 | Ketu – Ketu | Ulka (Saturn) | Scorpio – Virgo | Setting (Pisces, re-entry) | 2027–2028 |
| 2027-12-05 → 2028-01-17 | Ketu – Ketu | Ulka (Saturn) | Scorpio – Leo | Setting (Pisces) | 2027–2028 |
| 2028-01-18 → 2028-02-23 | Ketu – Venus | Ulka (Saturn) | Scorpio – Leo | Setting (Pisces, ends 2028-02-23) | 2027–2028 |

#### Saturn Kakshya Zone Lookup (for Saturn transit in Pisces)

<!--
Saturn traverses Pisces 2025-03-30 through 2028-02-23. Use this column in combination with Saturn's live
degree at the target date to find the active Kakshya zone (§8). The mapping is by degree, not by date,
since Saturn's speed varies (retrograde / direct / stationary). To find the current zone on a given date,
retrieve Saturn's Pisces degree from an ephemeris, then read the zone from §8.
-->

| Pisces Degree Band | Zone ID | Ruler | Status |
| --- | --- | --- | --- |
| 0°00′ – 3°45′ | `KAK.PISCES.Z1` | Saturn | ACTIVE |
| 3°45′ – 7°30′ | `KAK.PISCES.Z2` | Jupiter | INACTIVE |
| 7°30′ – 11°15′ | `KAK.PISCES.Z3` | Mars | ACTIVE |
| 11°15′ – 15°00′ | `KAK.PISCES.Z4` | Sun | INACTIVE |
| 15°00′ – 18°45′ | `KAK.PISCES.Z5` | Venus | INACTIVE |
| 18°45′ – 22°30′ | `KAK.PISCES.Z6` | Mercury | INACTIVE |
| 22°30′ – 26°15′ | `KAK.PISCES.Z7` | Moon | INACTIVE |
| 26°15′ – 30°00′ | `KAK.PISCES.Z8` | Lagna | INACTIVE |

---

## §24 — DOCUMENT COMPLETENESS LEDGER

<!-- Inventory of data carried over from v5.1 source, confirming no chart data was dropped in transformation. -->

| v5.1 Section | v6.0 Location | Status |
| --- | --- | --- |
| Metadata | §1.1 | carried |
| Core Mirror | §1.2 | carried |
| D1 Planets | §2.1 | carried (expanded with Chalit column) |
| Bhava/Chalit Data | §2.3, §2.4 | carried (expanded with distance-to-cusp) |
| D9 Navamsa | §3.5 | carried (expanded with NBRY and stellium sub-tables) |
| D10 Dashamsha | §3.6 | carried |
| D2–D60 divisional charts | §3.1–§3.14 | carried (uniform format) |
| CSI Ledger | §3.15 | carried |
| KP Cusp Mirror | §4.1 | carried |
| KP Significators | §4.3 | carried |
| KP Planetary | §4.2 | carried |
| Vimshottari | §5.1 | carried |
| Yogini | §5.2 | carried |
| Jaimini Chara | §5.3 | carried |
| Varshphal | §22 | carried |
| Shadbala | §6.1, §6.2 | carried |
| Ishta/Kashta Proxy | §6.3 | carried |
| Bhavabala | §6.4 | carried |
| Vimsopaka | §6.5 | carried |
| Ashtakavarga | §7.1, §7.2 | carried |
| Shuddha Pinda | §7.3 | carried (interpretation column dropped per policy) |
| Saturn Kakshya | §8 | carried |
| Avastha (Bio-Rhythms) | §9.1 | carried |
| Soul Infrastructure (Karakas) | §10 | carried |
| Kinetic House (Chalit) | §17 | carried |
| Chandra Reality | §18 | carried |
| Jaimini Social Reality (Arudhas) | §13 | carried |
| Planetary Warfare & Alliances | §16.2 | carried (expanded with full Western aspect set) |
| Sade Sati | §21 | carried |
| Panchang | §15 | carried |
| Deity Table | §20 | carried |
| Absolute Longitudes | §2.1 (Abs Long column) | carried |
| Bhava Placement Ledger | §2.4 | carried |
| Special Lagnas | §12.1 | carried |
| Sahams | §12.2 | carried |
| Upagrahas | §11.1 | carried |
| Bhrigu Bindu | §11.2 | carried |
| Yogi / Avayogi | §11.3 | carried |
| Hazards (Mrityu Bhaga) | §11.5 | carried |
| Combustion / War | §11.4 | carried |
| Aspect Matrix (Vedic) | §16.1 | carried |
| Expanded Panchang DNA | §15.1, §15.2 | carried |
| Stellar Matrix (Navatara) | §14 | carried |
| Jaimini Core (Chara Karakas, Arudhas) | §10.1, §13 | carried |
| Chesta & Motion Audit | §11.6 | carried |
| Kota Chakra | §19 | carried |
| (New in v6.0) | §23 Cross-Reference Matrices | added |
| (New in v6.0) | §3.5.1 D9 NBRY sub-table | added as FACT |
| (New in v6.0) | §3.5.2 D9 12th-house stellium | added as FACT |
| (New in v6.0) | §16.3 Bhav-Madhya aspects | added from Excel source |
| (New in v6.0) | §16.2 Full Western aspect set | added from Excel source |
| (New in v6.0) | §18 Chandra chart (extended with Uranus/Neptune/Pluto) | added from Excel source |
| (Dropped per policy) | Interpretive text in Shuddha Pinda, Avastha, Karaka, Aspect Matrix | removed (belongs in separate interpretation file) |
| (Dropped per policy) | Narrative analysis in Jaimini Core (§D1-I) | removed (belongs in separate interpretation file) |

---

**END OF FORENSIC ASTROLOGICAL DATA v6.0**
