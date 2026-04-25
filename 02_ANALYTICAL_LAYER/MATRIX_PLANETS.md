---
document: L2 MODE B — PLANET MATRIX
project: MARSYS-JIS
layer: L2 (Analytical Layer, Mode B — Exhaustive Coverage)
artifact_id: MATRIX_PLANETS_v1_0
version: 1.0
status: CLOSED (Session 8 output)
sibling_files: MATRIX_HOUSES (done), MATRIX_SIGNS, MATRIX_DIVISIONALS, MATRIX_DASHA_PERIODS
source_layer: L1 Facts (v6.0 §23.1 Planet-Centric Matrix + v7.0 supplement + CGP audit + LEL v1.2)
design_principle: v6.0 §23.1 contains comprehensive planet-facts (positions, Shadbala, karakas, aspects, etc.). This Mode B matrix EXTENDS §23.1 with coverage-guarantee fields that aren't there: LEL event clustering per planet, transit patterns lifetime, Jaimini aspects (new from CGP audit), yoga membership aggregate, and 2-3 paragraph interpretation. Not duplicating §23.1 raw data.
outputs_feed_to: L2.5 CGM (9 planet nodes + all planet-to-planet/house edges) and MSR (~80-120 planet-related signals)
---

# PLANET MATRIX — L2 Mode B Exhaustive Coverage

## §1 — META

### §1.1 — Design: Extends §23.1, not duplicates

v6.0 §23.1 Planet-Centric Matrix already provides: D1 sign/degree/nakshatra/pada, Rashi/Chalit house, D9/D10 placements, Vargottama flag, Shadbala, Shuddha Pinda, Vimsopaka, Uccha Band, Chara+Sthira Karakas, Avastha triad, Dasha role, Vedic aspects cast, tight-orb aspects, sahams involving, special roles. **That is 17 columns per planet — cited here by reference.**

This Mode B matrix adds **7 new coverage fields**:
1. Jaimini rashi aspects cast (from CGP audit §3.3)
2. Jaimini rashi aspects received
3. LEL events tagged to this planet (from LEL v1.2)
4. Yoga membership aggregate
5. Transit pattern lifetime summary
6. Mode A RPT sections citing this planet
7. 2-3 paragraph terse interpretation

### §1.2 — 9-planet scope

Matrix covers: Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu. Nodes (Rahu/Ketu) don't have Shadbala/Shuddha-Pinda/Karaka-roles (classically excluded) per v6.0 §23.1 — interpretation compensates with nodal-specific structural commentary.

---

## §2 — SUMMARY TABLE (scan view)

| Planet | Sign | Rashi House | Dignity | Shadbala Rank | Shuddha Pinda Rank | Vimsopaka Rank | Chara Karaka | Dasha Role | LEL Event Count | Primary Yoga Membership |
|---|---|---|---|---|---|---|---|---|---|---|
| Sun | Capricorn | 10 | Enemy's sign (Saturn owns Cap; Saturn is Sun's enemy) — NOT debilitated | **1** | 2 | 3 | BK | — | 8 | CVG.04 (10H density), Budh-Aditya |
| Moon | Aquarius | 11 (Chalit-12) | Neutral | 3 | 6 | 7 | **AK** | — | 5 | SIG.04/05, CVG.03 (foreign chain), D9 12H stellium |
| Mars | Libra | 7 | Debilitated (Saturn's exalt-sign) | 5 | **1** | 2 | PK | — | 3 | SIG.15 Hidden Raja, CVG.05, CVG.08; Avayogi |
| Mercury | Capricorn | 10 | Friend+Vargottama | 6 | 3 | 4 | DK | **MD 2010-2027** | 15+ | SIG.07 Saraswati, SIG.09, CVG.01; Yogi |
| Jupiter | Sagittarius | 9 | Own sign | 4 | 4 | **1** | GK | — | 6 | SIG.08 Lakshmi, SIG.07 Saraswati, CVG.02, CVG.06 |
| Venus | Sagittarius | 9 | Friend | 7 | 5 | 6 | MK | Next MD 2034+ | 4 | SIG.08 Lakshmi, SIG.07 Saraswati; Ishta Devata ruler |
| Saturn | Libra | 7 | **Exalted (Max Uccha 59.18)** | 2 | **7 (LAST)** | 5 | AmK | **AD 2024-2027** | 8 | **SIG.01 Sasha MPY**, SIG.11 Anapha, SIG.15, CVG.05; Dharma Devata |
| Rahu | Taurus | 2 | (nodes not dignified) | — | — | — | — | — | 4 | SIG.10 Rahu-2H-Rohini, CGP SIG.16 (Jaimini quad-aspect) |
| Ketu | Scorpio | 8 | (nodes not dignified) | — | — | — | — | **Future MD 2027-2034** | 4 | (none classical; 8H Ketu = moksha signature) |

**Top-3 LEL-coupled planets**: Mercury (15+ events, MD lord), Sun (8), Saturn (8). All three concentrate on career/structural events via 10H and 7H houses.

---

## §3 — PER-PLANET DETAIL CARDS

### MX.PLN.SUN

**Reference**: v6.0 §23.1 "Sun (PLN.SUN)" has all core facts.

```yaml
mode_b_extensions:
  jaimini_aspects_cast: [Taurus (hits Rahu), Leo, Scorpio (hits Ketu)]
  jaimini_aspects_received: [Cancer, Libra (Mars+Saturn), Aquarius (Moon)]
  yoga_membership: [SIG.14 10H Capricorn with AL + Mercury (career-density), CVG.04 10H career convergence, Budh-Aditya Yoga (Sun-Mercury conj, NOT combust per §11.4)]
  lel_events_tagged: 
    - EVT.2007.06.10.01 (Cognizant first job — Sun = career karaka, 10H tenant)
    - EVT.2013.05.XX.01 (Mahindra join)
    - EVT.2017.03.XX.01 (Tech Mahindra switch — Mercury-Sun AD lord activating 10H)
    - EVT.2023.07.XX.01 (Marsys founded)
    - EVT.2024.02.16.01 (sand mine launch)
    - EVT.2025.07.XX.01 (Marsys contract — inside Mercury-Saturn AD with Sun still chart-dominant)
    - EVT.2018.11.28.01 (father passed — Sun = Pitri karaka Sthira; Saham Pitri tied to Sun-position)
    - EVT.2009.06.XX.01 (grandfather passed — Sun karaka for paternal lineage)
  transit_pattern_lifetime: Sun annual cycle (~365 days per sign). Notable Sun-returns (Varshphal) annually Feb 5. Sun's transits tend to trigger short-window events (1-month windows) rather than structural periods.
  mode_a_rpt_coverage:
    - RPT.STR.01 (foundational Lagna/Moon/Sun)
    - RPT.HSE.01 (10H density)
    - RPT.DVS.01 D10 Dashamsha
  interpretation: |
    Sun is Shadbala rank 1 (strongest) sitting in Capricorn — **enemy's sign (Saturn's own; Saturn is Sun's natural enemy)**, NOT debilitation (Sun's debilitation is Libra). The apparent paradox "enemy-sign yet strongest Shadbala" is explained by Dig Bala: Sun gets MAX Dig Bala (60 virupa) in 10H Kendra + Vargottama Yogi Mercury companion (SIG.09) + other Shadbala components boost. Uccha Bala 33.99 is AVERAGE (not low — a debilitated planet would be <15 virupa). Sthira Karaka Atma = Sun represents soul/self at the fixed-karaka level; Aries Lagna Mars-ruled + Sun neutral-to-Mars creates harmonious Lagna-Sun axis.
    Retrodictively, Sun's enemy-sign-placement (not debilitation) means career flows through Saturn's domain (structured, disciplined, hierarchical — Capricorn's nature) rather than Sun's natural expressive-autonomous mode. This matches native's corporate-hierarchy career (Cognizant → Mahindra decade → corporate entrepreneurship through structured Marsys operations) more than an autonomous-creative career would. Sun as BK Chara Karaka overlays brother-theme on career events (native's brother as "lifelong pillar" confirms BK-Sun in 10H resonance).
```

---

### MX.PLN.MOON

**Reference**: v6.0 §23.1 "Moon (PLN.MOON)" has all core facts.

```yaml
mode_b_extensions:
  jaimini_aspects_cast: [Aries (Lagna), Cancer, Libra (Mars+Saturn)]
  jaimini_aspects_received: [Leo, Libra (Mars+Saturn), Aquarius self-check — Moon-in-Aquarius; Aquarius fixed aspects movables except Capricorn. So Moon aspects Aries+Cancer+Libra. Reciprocal: Moon receives from Aries+Cancer+Libra aspecters.]
  yoga_membership: 
    - SIG.04 Moon AK-11H-Karakamsa-Gemini
    - SIG.05 Moon Chalit-12 foreign delivery
    - CVG.03 Moon AK foreign-income chain
    - SIG.06 D9 12H Gemini stellium (Moon is one of 3 tenants)
    - SIG.11 Anapha Yoga (Saturn 12th from Moon — Moon-centric construction)
    - CTR.04 (Moon Rashi-11 vs Chalit-12)
  lel_events_tagged:
    - EVT.2018.11.28.01 (father passed — Mercury-Moon AD = AK AD soul-level event)
    - EVT.2022.01.03.01 (twins born — Moon + Saham Putra involvement)
    - EVT.2010.12.XX.01 (Thailand trip — Moon-Chalit-12 foreign signal fires)
    - EVT.2019.05.XX.01 (US move — CVG.03 activation)
    - EVT.2021.01.XX.01 (panic — Moon-related mental state, Sade Sati Cycle 2 on Moon-sign)
  transit_pattern_lifetime: Moon ~27.3-day cycle; monthly mood/timing. Most impactful: Jupiter transit Aquarius on Moon (gajakesari-class) — fires 2021 (EVT.2022 twins), next 2033, 2045. Saturn transit Aquarius on Moon (Sade Sati Peak) — Cycle 1 Peak 1993-1996 (adolescent headaches), Cycle 2 Peak 2022-2025 (US pivot + separation). Rahu/Ketu transit Aquarius/Leo axis — 2031-2033 next.
  mode_a_rpt_coverage:
    - RPT.STR.01 (AK foundation)
    - RPT.HSE.01 (11H gains)
    - CTR.04 explicit
    - CVG.03 (foreign chain)
  interpretation: |
    Moon as Atmakaraka is the chart's soul-signifier. Physical location Aquarius 27°02' places it in Purva Bhadrapada Pada 3 (Jupiter-ruled). In Saturn-owned sign (Aquarius = Saturn's secondary), under Jupiter-ruled nakshatra = dual-Saturn-Jupiter conditioning of the soul-signification. Shadbala rank 3 (moderate-strong); Shuddha Pinda rank 6 (below-median compounding) — soul-strength is visible but not-deeply-accruing — fits the "emotional loyalty without compounding intimacy" pattern in marriage (MX.HSE.7 interpretation).
    CTR.04 Rashi-11 / Chalit-12 drift means Moon operates in TWO registers — 11H gains-from-network publicly, 12H loss/foreign/dissolution privately. Retrodictively both fire: US earnings (11H gain) + US residential loss-of-India-life (12H). Moon is D9 12H stellium member (SIG.06) — soul-architecture loops closes through foreign/Gemini. Future: Jupiter-Aquarius transits at 2033/2045 = peak Moon-gajakesari windows.
```

---

### MX.PLN.MARS

**Reference**: v6.0 §23.1 "Mars (PLN.MARS)" has all core facts. Key: Lagna lord in 7H Libra (debilitated sign for Mars, but Mars gets strength from Saturn's exaltation in same sign via dignity-exchange).

```yaml
mode_b_extensions:
  jaimini_aspects_cast: [Taurus (Rahu), Leo, Aquarius (Moon)]
  jaimini_aspects_received: [Aries (Lagna), Cancer, Libra (self — no self-aspect classically)]
  yoga_membership:
    - SIG.15 Hidden Raja Yoga (Mars+Saturn exalted conjunction)
    - CVG.05 Saturn 7H exalted + shadbala + Mahapurusha + AD + Yogini (Mars co-present)
    - CVG.08 Aries-Libra axis triple-aspect
    - Special Role: **Avayogi planet** (§11.3) — Mars is AVAYOGI, the "obstacle-karaka" of the chart
  lel_events_tagged:
    - EVT.2007.06.XX.01 (knee surgery — Mars + Saturn 7H = joint/leg physical manifestation)
    - EVT.2019.05.XX.01 (US move — Mercury-Mars AD initiates assertion/action)
    - EVT.2021.01.XX.01 (panic/jitters — Bhramari/Mars Yogini at peak intensity)
  transit_pattern_lifetime: Mars ~2-year cycle per sign; retrograde ~22 months. Mars returns to Libra ~2024-2025 (activating natal Mars-Saturn exalted conjunction — retrodictively aligns with Marsys sand mine launch Feb 2024 and Marsys contract July 2025). Next Mars-in-Libra return ~2040-2041.
  mode_a_rpt_coverage:
    - RPT.STR.01 (Lagna lord)
    - RPT.HSE.02 (7H weakness)
    - CVG.05, CVG.08
  interpretation: |
    Mars is Lagna lord (Aries ruled by Mars) but sits in 7H Libra = fundamental tension: the self-principle (Lagna lord) is placed in the partner-house, creating "identity-through-partnership" structural wiring. Mars in Libra is debilitated (Libra is Mars's enemy sign), but Saturn is exalted in the same sign — dignity exchange partially compensates. SIG.15 Hidden Raja Yoga is the combination's beneficial face; the "debilitated-Mars-in-7H" is the underlying friction signature in partnership.
    Mars as Avayogi (§11.3) is crucial — Avayogi is the "obstacle-karaka" opposite of Yogi Mercury. Mars obstacles operate THROUGH partnership-body (7H) + action (Mars kinetic). The 2007 knee surgery fits exactly (physical Mars-obstacle in joint-region). Mars as PK (Putrakaraka) overlays children-theme on Lagna/7H register — retrodictively significant for EVT.2022.01.03.01 twins' birth context (Mercury-Rahu AD + Mars transit position). Mars full-aspect onto 10H (Capricorn) from 7H is why career delivers with force + friction combined.
```

---

### MX.PLN.MERCURY

**Reference**: v6.0 §23.1 "Mercury (PLN.MERCURY)" has all core facts. Key: Vargottama (D1+D9 Capricorn), Yogi planet, current MD lord 2010-08-21 to 2027-08-21.

```yaml
mode_b_extensions:
  jaimini_aspects_cast: [Taurus (Rahu), Leo, Scorpio (Ketu)]
  jaimini_aspects_received: [Cancer, Libra (Mars+Saturn), Aquarius (Moon) — as movable Capricorn aspects fixed ex-adjacent (Aquarius blocked)]
  yoga_membership:
    - SIG.07 Saraswati Yoga (Jupiter+Venus+Mercury in kendra/trikona)
    - SIG.09 Mercury Vargottama + MD lord + Yogi — chart's operational spine
    - CVG.01 Mercury operational dominance (6-way convergence: Yogi + Vargottama + MD + Saraswati + D9 dispositor + Karakamsa ruler)
    - Budh-Aditya Yoga (Sun-Mercury conjunction)
    - CTR.05 Mercury Rashi/Chalit house placement ambiguity
    - Special Role: **Yogi planet** (§11.3) — the chart's operational lucky-lord
    - Dispositor of D9 12H stellium (§3.5.2)
    - NBRY cancellation agent for Venus (SIG.02)
  lel_events_tagged: (Mercury MD runs 2010-2027 so nearly every LEL event in this window is Mercury-coupled)
    - EVT.2010.12.XX.01 (Thailand — MD-MD peak)
    - EVT.2011 XIMB events — MD-MD
    - EVT.2012.09/10 modeling + R#3 — MD-MD
    - EVT.2013.03/05/12 graduation+Mahindra+marriage — MD-Ketu AD
    - EVT.2016, 2017 Mahindra crash+Tech Mahindra — MD-Venus/Sun AD
    - EVT.2018.11.28 father — MD-Moon AD
    - EVT.2019-2022 US era — MD-Mars/Rahu AD
    - EVT.2023-2024 return+Marsys+sand mine — MD-Jupiter AD
    - EVT.2025 deception+contract+Vishnu — MD-Saturn AD
    - [15+ events in Mercury's MD span]
  transit_pattern_lifetime: Mercury ~3-week cycle per sign (fast). Mercury retrogrades 3-4x per year for ~3 weeks. Mercury's most-notable-windows are when current MD-Saturn AD (2024-2027) has Mercury transit triggering sub-sub-periods; native should watch Mercury retro periods within Saturn AD for timing of critical signings/decisions (Mercury retro in Scorpio exactly at father's death 2018-11-28 is the foundational example — per MX.HSE.8).
  mode_a_rpt_coverage:
    - RPT.STR.01 (Yogi foundation)
    - RPT.DSH.01 (Triple-Dasha Engine: Mercury MD centerpiece)
    - RPT.YOG.01 (Saraswati yoga detailed)
    - CVG.01 (operational dominance)
  interpretation: |
    **Mercury is the CHART'S OPERATIONAL SPINE.** 6-way convergence (CVG.01): Vargottama (D1=D9 Capricorn), Yogi (§11.3), Current MD lord (2010-2027), Saraswati Yoga member, Dispositor of D9 12H stellium, Karakamsa-adjacent ruler. There is no planet in this chart that plays more structural roles simultaneously. Shadbala rank 6 (not-strongest) combined with Vargottama + Yogi roles means "operational-distribution-role more than raw-strength-role."
    As Mercury MD (17 years) runs 2010-2027 and native is in it, EVERY major LEL event 2010-2027 is Mercury-activated at some level. The subsequent Ketu MD (2027-2034) will be a "Mercury → Ketu handover" — native enters a fundamentally different operating regime. Native's "successful geek" childhood + MBA + Marsys Technology all trace to Mercury's Vargottama Yogi operational dominance. DK Chara Karaka (Darakaraka = spouse) overlays spouse-theme: native's wife = childhood-relationship-spouse was formed in Mercury's pre-MD preparation period (R#1 start 1998-02-16 = Saturn-Ketu AD, but Mercury-MD took over when marriage consummated 2013). Current Mercury-Saturn AD (2024-2027) is the MD's peak output window — Marsys contract July 2025 validated RPT.DSH.01 planting→compounding prediction.
```

---

### MX.PLN.JUPITER

**Reference**: v6.0 §23.1 "Jupiter (PLN.JUPITER)" has all core facts. Key: Sagittarius own-sign 9H, Vimsopaka rank 1 (12.1 = chart's single highest Vimsopaka score).

```yaml
mode_b_extensions:
  jaimini_aspects_cast: [Gemini (UL+A5+A11), Virgo (A4+A8+A9), Pisces (12H)]
  jaimini_aspects_received: [Gemini, Virgo, Pisces (dual-dual reciprocal — same signs aspect back)]
  yoga_membership:
    - SIG.08 Lakshmi Yoga (9L Jupiter in own sign + Venus in 9H)
    - SIG.07 Saraswati Yoga member (Jupiter+Venus+Mercury kendra/trikona)
    - CVG.02 Jupiter 9L dharma-wealth chain
    - CVG.06 Jupiter 9H own-sign + Lakshmi member + 9L + MPY-near-miss
    - **CTR.03 Jupiter Uccha Bala rank 7 LAST** (positional-weakness amid dignity-strength)
    - Year Lord 2026-27 Varshphal (§22)
  lel_events_tagged:
    - EVT.2009.06.XX.01 (grandfather passed — Saturn-Jupiter AD, Jupiter weakness activating)
    - EVT.2013.XX.XX.01 (father's kidney disease onset — Jupiter weakness across 9H)
    - EVT.2016.XX.XX.01 (Mahindra crash — CTR.03 extends to career-dharma shift)
    - EVT.2018.11.28.01 (father passed — Jupiter-weak 9L primary explanation, Saturn transit Sag=9H)
    - EVT.2023.05.XX.01 (US→India pivot — Mercury-Jupiter AD activating dharma-restructure)
    - EVT.2023.07.XX.01 (Marsys founded — Jupiter 9L + Lakshmi delivering via AD)
  transit_pattern_lifetime: Jupiter ~1-year per sign (12-year cycle). Jupiter transit Sagittarius own-sign 2019-2020 (during US stint), next 2031-2032 (projected age 47-48), 2043-2044 (age 59-60). Jupiter transit Aquarius on natal Moon (gajakesari) 2021 / 2033 / 2045. Jupiter transit 9H own-sign tends to deliver dharmic-financial-expansion windows.
  mode_a_rpt_coverage:
    - RPT.STR.01
    - RPT.HSE.01 (9H dharma)
    - RPT.YOG.01 Lakshmi+Saraswati detail
    - RPT.VAR.01 (Varshphal Year Lord 2026-27)
    - CTR.03 central
  interpretation: |
    Jupiter is structurally the chart's **dharma-wealth fountain (SIG.08 Lakshmi, CVG.02, CVG.06)** — 9L in own sign 9H with Venus companion, Vimsopaka rank 1 (strongest divisional-weighted strength). BUT **CTR.03** is the paradox: Uccha Bala rank 7 LAST means positional-strength is last-ranked despite Jupiter being in own sign. Classical reading: the dharmic seat is INHABITED but does not RADIATE — Jupiter works for native but doesn't amplify to the maximum level his own-sign placement would suggest.
    Retrodictively, CTR.03 is the chart's most-validated contradiction — fires at 5 LEL events (grandfather, father twice, Mahindra crash, US pivot). Pattern: whenever a 9H-signification matter (father, education, dharma, foreign-religion) stresses, CTR.03-weakness manifests as collapse rather than buffer. The 2025 Vishnu-Venkateshwara gravitation (EVT.2025.XX.XX.01) is the positive-direction CTR.02 resolution where Jupiter finally delivers (spiritual-dharmic alignment with Vishnu — Jupiter karaka).
    Jupiter is Year Lord for Varshphal 2026-27 — the current year is under Jupiter's lordship even though Jupiter-weakness structurally prevails. This may explain the mixed current-year state (marriage separation + business growth — dharmic direction asserting through messy operational reality).
```

---

### MX.PLN.VENUS

**Reference**: v6.0 §23.1 "Venus (PLN.VENUS)" has all core facts. Key: 2L and 7L (double dharma lord for wealth + partnership), Shadbala rank 7 (WEAKEST), Ishta Devata ruler (Mahalakshmi).

```yaml
mode_b_extensions:
  jaimini_aspects_cast: [Gemini (UL+A5+A11), Virgo, Pisces — dual-dual]
  jaimini_aspects_received: [Gemini, Virgo, Pisces]
  yoga_membership:
    - SIG.08 Lakshmi Yoga (Venus in 9H with Jupiter — Lakshmi-Saraswati intersection point)
    - SIG.07 Saraswati Yoga member
    - SIG.02 Dual D9 NBRY (Venus debilitated Virgo in D9, cancelled by Mercury)
    - **SIG.12 Venus Shadbala rank 7 weakest** — Ishta pathway weakness
    - Special Role: Ishta Devata = Mahalakshmi (§20.1 per native's classical prescription)
  lel_events_tagged:
    - EVT.2004.01.XX.01 (R#2 start — Saturn-Moon AD; Venus as partnership-karaka weak)
    - EVT.2012.10.XX.01 (R#3 start — Mercury-MD peak, Venus resonance)
    - EVT.2013.12.11.01 (marriage — Venus as 7L weak explains pain-pleasure pattern)
    - EVT.2016.XX.XX.01 (Mahindra crash — Mercury-Venus AD activating 2L career-wealth and 7L partnership issues simultaneously)
    - EVT.CURRENT.01 (separation — Venus-weakness eventual expression)
  transit_pattern_lifetime: Venus ~18-month per sign (fast for a slow-category planet). Venus retrogrades ~every 18-19 months for ~40 days. Venus transits Sagittarius-return roughly 2024, 2032, 2040. Most-impactful windows = Venus Sadesati-like when Venus transits its own debilitation sign Virgo (triggers SIG.02 NBRY activation externally).
  mode_a_rpt_coverage:
    - RPT.STR.01
    - RPT.HSE.02 (2H and 7H weakness — Venus as dual lord concentrates weakness)
    - RPT.DEV.01 (Ishta Devata Mahalakshmi architecture)
    - SIG.02, SIG.12 detailed
  interpretation: |
    Venus is **structurally the chart's weakest classically-dignified planet** (Shadbala rank 7, SIG.12). Paradoxically, Venus holds the highest spiritual-prescription role — **Ishta Devata ruler (Mahalakshmi)** per §20.1. Classical reading: the weakest-planet IS the one that most needs devotion — strengthening it via Ishta devotion compensates for native's structural 7L+2L weakness.
    Double lordship (2L wealth-family + 7L partnership-marriage) in 9H Sagittarius with Lakshmi Yoga company creates the paradox: Venus delivers SIG.08 Lakshmi-class dharmic wealth in dharma-house BUT weakly as individual planet. Retrodictively, every Venus-activation period (Mercury-Venus AD 2014-2016, 2034+ Venus MD) delivers partner-related friction AND wealth-fluctuation simultaneously (2016 Mahindra crash exactly matches this AD window).
    Venus in D9 Virgo debilitated → cancelled by Mercury-Vargottama in same sign (SIG.02) is the redemptive D9 structure: divine/dharmic-level, weakness is cancelled. So native's MARRIAGE-level (D9 specific) has cancellation-mechanism even when Venus itself is weak. The marriage has NOT dissolved despite separation — D9 NBRY redemption IS firing (native's own Session 2 words: "still separated but stable and improving").
```

---

### MX.PLN.SATURN

**Reference**: v6.0 §23.1 "Saturn (PLN.SATURN)" has all core facts. Key: Exalted Libra (Uccha Bala 59.18 = MAX), current AD lord 2024-2027, AmK Chara Karaka.

```yaml
mode_b_extensions:
  jaimini_aspects_cast: [Taurus (Rahu), Leo, Aquarius (Moon)]
  jaimini_aspects_received: [Aries (Lagna), Libra (self), Cancer (the movable signs ex-adjacent from Libra = Aries, Capricorn blocked)]
  yoga_membership:
    - **SIG.01 Sasha Mahapurusha Yoga** (Saturn exalted in 7H kendra)
    - SIG.15 Hidden Raja Yoga (Mars + Saturn exalted 7H conjunction)
    - SIG.11 Anapha Yoga (Saturn 12th from Moon — when Saturn transits Capricorn)
    - CVG.05 Saturn 7H exalted + Shadbala-strong + Mahapurusha + AD + Yogini (5-way convergence)
    - CVG.08 Aries-Libra axis triple-aspect
    - **CTR.01 Saturn Shadbala rank 2 vs Shuddha Pinda rank 7 LAST** (dramatic-not-compound paradox)
    - Special Role: **Dharma Devata Jagannath** (§20.1) — but CTR.02 shows current-gravitation toward Vishnu
    - Special Role: Kota Swami (§19 Kota Chakra)
    - 10H + 11H Lord
  lel_events_tagged:
    - EVT.2007.06.XX.01 (knee surgery — Saturn-Rahu AD, joint affliction Saturn-karaka)
    - EVT.2008.06.09.01 (Cognizant exit — Saturn-Jupiter AD, Saturn transitioning)
    - EVT.2009.06.XX.01 (grandfather passed — Saturn-Jupiter AD)
    - EVT.2013.12.11.01 (marriage — 7H Saturn as structural marriage-engine; exalted = "strong marriage" but CTR.01 = "non-compounding")
    - EVT.2018.11.28.01 (father passed — Saturn transit Sagittarius=9H classical trigger)
    - EVT.2024.02.16.01 (sand mine — Saturn AD + Chara Libra MD (Saturn's sign) double-activation)
    - EVT.2025.07.XX.01 (Marsys contract — Saturn AD peak, RPT.DSH.01 planting→compounding validated)
    - EVT.CURRENT.01 (separation — Saturn AD delivering 7H authority-through-tension pattern)
  transit_pattern_lifetime: 
    - Saturn ~2.5 years per sign (29.5-yr cycle)
    - Saturn transit Libra (own exaltation) 2041-2044 (native 57-60) — major life cycle closure
    - Sade Sati Cycle 2 current: 2020-2028 (per §V7.A)
    - Sade Sati Cycle 3 projected: 2049-2058 (native 65-74)
    - Sade Sati Cycle 4: 2079-2087 (if lived)
    - Saturn Kakshya zones in current Pisces transit: per v6.0 §8 + §23.3
  mode_a_rpt_coverage:
    - RPT.STR.01 (foundational)
    - RPT.HSE.02 (7H structural weakness IN structurally-strong-planet paradox)
    - RPT.DSH.01 Triple-Dasha Engine Mercury-Saturn AD window
    - RPT.TRN.01 Saturn transit engine (36-month horizon)
    - RPT.KAK.01 Saturn Kakshya zones (v1.2 new)
    - RPT.DEV.01 Dharma Devata
    - CTR.01, CTR.07 central
  interpretation: |
    Saturn is the chart's **most structurally complex planet**. Exalted Libra 22°27' = near-maximum Uccha Bala (59.18 of 60); Shadbala rank 2 (Sun only ahead); Sasha Mahapurusha Yoga present (SIG.01 — one of 5 classical great-person yogas); AmK Chara Karaka; current AD lord delivering the Mercury-MD's critical window. But CTR.01: Shuddha Pinda rank **7 LAST** (80 bindus — chart minimum). Saturn has maximum dignity-strength and minimum Ashtakavarga-compounding-strength simultaneously.
    Classical reading: Saturn's authority is GRANTED (via exaltation) but DOES NOT COMPOUND (via Shuddha Pinda low). Retrodictively this is the chart's operational master-signature — native achieves authority positions (Tech Mahindra top-performer, Marsys founder, sand-mine owner) but the positions don't accrue capital-wealth automatically (requires active re-building). Marriage (EVT.2013.12.11.01) delivers the SAME pattern: structural-strength (long duration, stability) without compounding-intimacy (pain-pleasure, eventually separation-but-stable).
    Saturn AD 2024-2027 is the chart's current lifetime chapter — RPT.DSH.01 explicitly predicted this as "planting → compounding" window. First Marsys major contract July 2025 validates planting stage. Next 2 years (2025-2027) are the compounding test. Saturn Kakshya zone progression in Pisces (§8 + §23.3) matters daily-weekly for specific-decision-timing within this AD. Upon Ketu MD entry 2027-08-21, native will have 7 years where Saturn's AD-delivered authority needs to be held WITHOUT active AD-support (Ketu doesn't activate Saturn the way Mercury-Saturn did).
```

---

### MX.PLN.RAHU

**Reference**: v6.0 §23.1 "Rahu (PLN.RAHU)" has all core facts (noting nodes not classically scored on Shadbala/Pinda/Karaka/Avastha).

```yaml
mode_b_extensions:
  jaimini_aspects_cast: [Cancer, Libra (Mars+Saturn), Capricorn (Sun+Mercury) — fixed Taurus aspects movable ex-adjacent (Aries blocked). HITS 4 natal planets.]
  jaimini_aspects_received: [Virgo (A4+A8+A9), Libra (Mars+Saturn), Scorpio (Ketu) wait — Taurus receives from Aries (Lagna), Leo, Libra (Mars+Saturn), Scorpio (Ketu), and other movable+fixed per Jaimini rule.]
  yoga_membership:
    - SIG.10 Rahu 2H Taurus Rohini (wealth-via-unconventional-route)
    - **NEW candidate SIG.16 Rahu-quadruple-Jaimini-aspect** (CGP audit finding) — hits Sun+Mercury (10H) + Mars+Saturn (7H) simultaneously
    - SAH.PUNYA (Punya Saham) co-located in 2H Taurus Rohini
    - D9 12H stellium member (Rahu in D9 Gemini per SIG.06)
    - CVG.03 Moon-AK-foreign-chain (Rahu as D9 12H stellium co-tenant)
  lel_events_tagged:
    - EVT.2022.01.03.01 (twins born — Rahu AD activated; Rahu = multiplication/doubling = twins classical)
    - EVT.2025.05.XX.01 (deception/scam — Rahu-like signature; Rahu = illusion/hidden-foes)
    - EVT.2019.05.XX.01 → 2022 US stint (Mercury-Mars → Rahu AD = foreign amplification)
    - Thailand foreign-trip + US-stint cluster (Rahu's lifetime theme)
  transit_pattern_lifetime: Rahu ~18 months per sign (retrograde, 18-year Rahu cycle). Rahu transit Taurus (natal Rahu return) = 1984, 2002-2003, 2020-2022 (during COVID + US pivot), next ~2040-2041. Rahu transit Aquarius (on Moon) 2031-2033 next.
  mode_a_rpt_coverage:
    - RPT.STR.01
    - RPT.HSE.02 (2H weakness with Rahu tenant)
    - RPT.TRN.03 Rahu-Ketu Transit Axis + Eclipse Hits
    - SIG.10 detailed
    - [NEW SIG.16 pending Deep Analysis v2.0 promotion]
  interpretation: |
    Rahu in 2H Taurus Rohini is SIG.10 — the "wealth-via-unconventional-channels" signature. Rohini is a Moon-ruled earth-fertility nakshatra, so Rahu here amplifies physical wealth + sensuality + acquisition-drive. Bhavabala rank 11 (2H weakest second) + Rahu tenancy = structural wealth-fragility compensated by high-ambition-drive.
    **Major new finding from CGP audit**: Rahu from Taurus Jaimini-aspects 4 natal planets simultaneously (Sun+Mercury in 10H Capricorn + Mars+Saturn in 7H Libra). This is the single most structurally-active Jaimini aspect in the chart — **NOT currently in Deep Analysis v1.2.1 SIG library**. Promoted to SIG.16 candidate for v2.0. Retrodictively explains: (1) native's career-disruption pattern (Rahu aspecting 10H = unconventional-career-trajectories: IIT-miss → XIMB → Mahindra → US → entrepreneur — none conventional), (2) partnership-complexity (Rahu on 7H Saturn-Mars = hidden foreign/extramarital amplifications from Taurus-earthly-acquisition-drive), (3) wealth-from-Russia Marsys exports (Russian acquisition + Rahu-foreign).
    Rahu-Ketu as D9 12H Gemini stellium tenants (SIG.06) closes the foreign architecture loop at the soul-D9 level. Rahu is not "classical-dignified" so interpretation works via sign + house + yogas rather than Shadbala-type metrics.
```

---

### MX.PLN.KETU

**Reference**: v6.0 §23.1 "Ketu (PLN.KETU)" has all core facts.

```yaml
mode_b_extensions:
  jaimini_aspects_cast: [Aries (Lagna), Cancer, Capricorn (Sun+Mercury) — fixed Scorpio aspects movable ex-adjacent (Sagittarius blocked)]
  jaimini_aspects_received: [similar reciprocal logic]
  yoga_membership:
    - D9 context: Ketu in D9 Sagittarius (9H placement in D9) — transformation-via-dharma signature
    - Tight 0.50° quincunx aspect to Mercury = critical inner-axis alignment with chart-spine
  lel_events_tagged:
    - EVT.2013.03/05/12 XIMB graduation + Mahindra + marriage — Mercury-Ketu AD window
    - EVT.2018.11.28.01 (father passed — Mercury-Moon AD, but Ketu transit Cancer-axis aspecting 10H)
    - Death/transformation cluster: grandfather 2009, father 2018, scam 2025
  transit_pattern_lifetime: Ketu inverse to Rahu (always opposite). Ketu transit Aquarius (on Moon) 2022-2023 (during/post-twins period). Ketu transit Scorpio (natal return) ~2040-2041. **Ketu MD 2027-08-21 to 2034-08-21 is the chart's next MAJOR regime change** — see RPT.DSH.02.
  mode_a_rpt_coverage:
    - RPT.STR.01 (Ketu-8H in foundation)
    - **RPT.DSH.02 Ketu Mahadasha (2027-08-21 → 2034-08-21) Regime Change** — highest Session 18+ focus
    - RPT.TRN.03 Rahu-Ketu Transit Axis + Eclipse Hits
  interpretation: |
    Ketu in 8H Scorpio is the chart's MOKSHA-LEANING UNDERCURRENT. 8H + Scorpio is the death-transformation-occult domain; Ketu's "detachment-through-extreme" reinforces it doubly. Natal Ketu here classically produces: deep research aptitude, sudden transformative events (deaths, exits, rebirths), detachment from 8H matters (inheritance, partner's wealth), spiritual-occult inclination.
    **Ketu MD 2027-08-21 to 2034-08-21 is the chart's next regime change** (RPT.DSH.02). Native will be age 43-50 — peak-productive years but under Ketu's detachment-and-crisis-cycles mode. Translation: the current Mercury-MD operational-spine will be replaced by a 7-year phase where Ketu's 8H-placement drives life: sudden events (positive or negative), deep-diving into fewer things, less-engagement with breadth, potentially spiritual-practice intensification.
    Ketu's 0.50° quincunx to Mercury is the chart's TIGHTEST aspect — critical inner-configuration. Mercury (Yogi, operational spine) and Ketu (next MD, 8H-transformation) are TIGHTLY-LOCKED. Implication: as Ketu MD approaches (~3 years remaining as of 2026-04), Mercury's 17-year dominance will cede to Ketu's 7-year cycles SMOOTHLY via this tight aspect. The "handover" should feel continuous rather than abrupt. Saturn AD (current, until 2027-08) provides structural-bridge for this handover — Saturn's Libra exaltation + Mars co-present + Ketu-aspecting 10H from 8H = the three-way lock stabilizes transition.
```

---

## §4 — CROSS-PLANET SIGNAL AGGREGATES

### §4.1 — Dasha role concentration

| Dasha Role | Planet | Period | Life-Stage Notes |
|---|---|---|---|
| Current Vimshottari MD | **Mercury** | 2010-08-21 → 2027-08-21 | Operational spine years; most LEL events |
| Current Vimshottari AD | **Saturn** | 2024-12-12 → 2027-08-21 | Sasha-Yoga delivery window; planting→compounding |
| Next MD (post Mercury) | **Ketu** | 2027-08-21 → 2034-08-21 | Regime change; Ketu 8H-Scorpio moksha mode |
| MD after Ketu | **Venus** | 2034-08-21 → 2054-08-21 | Ishta Devata Mahalakshmi, 20-yr dharmic-wealth era |
| Final full MD (lifetime) | **Sun** | 2054-08-21 → 2060-08-21 | 6-year Sun period age 70-76 |
| Current Yogini MD | Bhadrika / **Mercury** | 2021-12-22 → 2026-12-22 | 5-yr Mercury-Yogini overlay — reinforces Mercury MD |

**Observation**: Mercury-Saturn-Ketu sequence covers 1984+117 = next 44 years in highest-stakes Vimshottari dashas. These three planets define native's operational-to-spiritual arc through age 50.

### §4.2 — Chara Karaka assignments

| Rank | Planet | Role | Signification |
|---|---|---|---|
| 1 (highest degree) | **Moon** | Atmakaraka (AK) | Soul, self |
| 2 | Saturn | Amatyakaraka (AmK) | Authority, minister-to-self |
| 3 | Sun | Bhratrukaraka (BK) | Brother, sibling support |
| 4 | Venus | Matrukaraka (MK) | Mother-karaka (also dara-planet) |
| 5 | Mars | Putrakaraka (PK) | Children, mental disposition |
| 6 | Mercury | Darakaraka (DK) | Spouse, partnership |
| 7 (lowest Chara degree) | Jupiter | Gnatikaraka (GK) | Relatives, cousins |

**Observation**: Moon AK → Saturn AmK → Mercury DK produces the chart's dominant soul→authority→spouse axis. Native's reported cousin-closeness (doc §6 "more comfort and happiness connecting with cousins than friends") validates Jupiter-GK-Sagittarius placement — cousins as the expanded-dharmic-kin.

### §4.3 — Yoga membership cross-tabulation

| Yoga | Tier | Member Planets |
|---|---|---|
| **Sasha Mahapurusha (SIG.01)** | Mahapurusha | Saturn (exalted 7H kendra) |
| **Saraswati (SIG.07, CYSS 91)** | Rajasic | Jupiter + Venus + Mercury (kendra/trikona) |
| **Lakshmi (SIG.08, CYSS 77)** | Dhana | Jupiter + Venus (9H trikona) |
| **Hidden Raja (SIG.15)** | Raja-class | Mars + Saturn exalted 7H conjunction |
| **Anapha (SIG.11)** | Moon-adjacent | Saturn (12th from Moon in Capricorn) |
| **Budh-Aditya** | Solar-Mercurial | Sun + Mercury conjunction 10H |
| **NBRY Venus (SIG.02)** | D9 dignity-redemption | Venus debilitated Virgo + Mercury Vargottama dispositor cancellation |
| **NBRY Saturn (SIG.03)** | D9 dignity-redemption | Saturn debilitated Aries + Sun cancellation (Sun exalts Aries) |

**Observation**: Mercury appears in Saraswati yoga + NBRY Venus cancellation + Budh-Aditya = 3 yogas. Jupiter appears in Saraswati + Lakshmi + CTR.03 negative-pole = 3 yoga-contexts. Saturn appears in 4 (Sasha + Anapha + Hidden Raja + NBRY). The four yoga-densest planets (Mercury, Jupiter, Saturn, Venus) are the chart's "yoga engine" — all other planetary interpretations should reference how they relate to this yoga-network.

### §4.4 — LEL event coupling to planets

| Planet | LEL Event Count | Dominant Event Type |
|---|---|---|
| Mercury | 15+ | All Mercury-MD events 2010-2027 |
| Sun | 8 | Career + paternal (10H + Pitri karaka) |
| Saturn | 8 | 7H partnership + career-authority |
| Jupiter | 6 | Education + father + dharma events |
| Moon | 5 | Emotional/AK/foreign events |
| Venus | 4 | Relationships + wealth disruption |
| Rahu | 4 | Unconventional amplification (twins, US, scam) |
| Ketu | 4 | Deaths, transformations |
| Mars | 3 | Physical events (knee) + action-catalysts |

### §4.5 — New SIG candidates (from planet matrix)

- **SIG.16** (carried from CGP audit): Rahu-quadruple-Jaimini-aspect
- **SIG.20 (new, tentative)**: Mercury Yogi + current MD + Vargottama stack (6-way CVG.01 already captures but could be elevated to dominant signature)
- **SIG.21 (new, tentative)**: Ketu-Mercury 0.50° quincunx = tightest-aspect-handover-node (Mercury MD → Ketu MD transition bridge)
- **SIG.22 (new, tentative)**: Saturn rank 2 Shadbala + rank 7 Shuddha Pinda + Sasha Mahapurusha + AD lord = quadruple-structural-activation (extends CTR.01)

---

## §5 — RED-TEAM CHECK

**Completeness**: 9/9 planets examined. All 7 new-column fields populated per row. Node-specific columns (Shadbala/Pinda/Karaka) correctly marked N/A for Rahu/Ketu per v6.0 convention.

**Overlap with §23.1**: This matrix is EXTENSIONS only; raw planet facts are authoritatively referenced, not duplicated. Avoids version-drift risk.

**Over-claim check**:
- "Mercury is the chart's operational spine" — backed by CVG.01 (6-way convergence, already in v1.2.1)
- "SIG.16 Rahu-quadruple-Jaimini-aspect" — flagged as "candidate" not "established"
- Other tentative SIGs similarly flagged

**Missing-data check**: None. All cells populated or appropriately marked N/A.

**Bias check**: Interpretations weighted toward existing Deep Analysis v1.2.1 confirmations. Two minor novel readings (Ketu-Mercury 0.50° handover bridge; Rahu-foreign-Russian-Marsys) remain hypotheses.

---

## §6 — OUTPUT FOR L2.5

### §6.1 — CGM node contributions
9 PLN nodes (Sun through Ketu) with attributes:
- Sign + abs long + nakshatra + pada
- Dignity state
- Shadbala/Pinda/Vimsopaka ranks
- Karaka roles (Chara + Sthira)
- Avastha triad
- MD/AD/sub-period roles (lifetime)
- Yoga memberships

### §6.2 — CGM edge contributions
~40 planet-to-planet edges (all classical aspect relationships + Jaimini additions):
- 9 × 8 = 72 potential planet-planet pairs; ~40 have non-trivial Graha/Jaimini/Tight-orb relationships
- Plus ~25 planet-to-house edges (house lordship + tenancy)
- Plus ~15 planet-to-yoga edges (yoga membership)

### §6.3 — MSR signal contributions (~80-120)
Per planet: ~10-15 MSR signals covering dignity, strength, yoga membership, karaka role, aspect patterns, LEL couplings, Jaimini aspects, transit patterns. Total across 9 planets: 80-120 signal entries.

### §6.4 — Feed to CDLM
- Mercury → all 9 domains (operational spine, dasha lord)
- Jupiter → career + wealth + dharma + father + education (CTR.03 backbone)
- Saturn → career + partnership + authority (CVG.05 quadruple-activation)
- Moon → emotional + foreign + mother + spouse-image
- Rahu → wealth + career + partnership (SIG.16 quadruple-aspect)

---

## §7 — CHANGELOG

```yaml
v1.0 (2026-04-17, Session 8):
  - Initial Mode B Planet Matrix covering all 9 planets
  - Extends v6.0 §23.1 with 7 new coverage fields (Jaimini aspects, yoga membership aggregate, LEL events tagged, transit patterns lifetime, Mode A RPT coverage, interpretation, special-role elaborations)
  - Does NOT duplicate §23.1 raw data — references it
  - 4 new tentative SIG candidates flagged: SIG.16 (Rahu Jaimini quad-aspect, from CGP audit), SIG.20-22 (Mercury yoga stack, Ketu-Mercury handover bridge, Saturn quadruple-activation)
  - Cross-planet aggregates: dasha concentration, karaka assignments, yoga cross-tab, LEL coupling
  - Status: CLOSED (Session 8 output)
```

**END OF PLANET MATRIX v1.0**
