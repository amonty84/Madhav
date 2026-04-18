---
document: L2 MODE B — DASHA-PERIOD MATRIX
project: AM-JIS
layer: L2 (Analytical Layer, Mode B — Exhaustive Coverage)
artifact_id: MATRIX_DASHA_PERIODS_v1_0
version: 1.0
status: CLOSED (Session 10 output — closes Mode B matrices)
sibling_files: MATRIX_HOUSES, MATRIX_PLANETS, MATRIX_SIGNS, MATRIX_DIVISIONALS (all done)
source_layer: L1 Facts (v6.0 §5.1 Vimshottari + §5.2 Yogini + §5.3 Chara + §21 Sade Sati + v7.0 §V7.A Sade Sati Cycle 1 + LEL v1.2)
design_note: Cross-tabulates 3 dasha systems + Sade Sati + LEL events across native's lifetime (1984-2060). 50 Vimshottari MD/AD rows form the spine; Yogini/Chara/transits overlaid. Per-period interpretation focuses on 20 highest-stakes periods with LEL-event density.
outputs_feed_to: L3 Temporal Engines (Lifetime Timeline, Heatmap, Varshphal) — Dasha-Period Matrix is the primary source table for time-based L3 artifacts
---

# DASHA-PERIOD MATRIX — L2 Mode B (CLOSES MODE B)

## §1 — META

### §1.1 — Purpose

Per Architecture §D.3, the Dasha-Period Matrix guarantees every Vimshottari MD/AD combination across lifetime is examined with Yogini + Chara overlays, transit windows, and LEL event alignment. This is the temporal structural spine for all downstream L3 Temporal Engine work.

### §1.2 — Scope

- **Vimshottari**: 50 MD/AD rows 1984-02-05 to 2060-08-21 (from v6.0 §5.1 DSH.V.001-050)
- **Yogini**: Overlay 17 rows 1984-2057 (from v6.0 §5.2 DSH.Y.001-017)
- **Chara**: Overlay 80+ rows 1984-2026+ and derivable 2026+ (from v6.0 §5.3 DSH.C.001-084+)
- **Sade Sati**: Cycle 1 (1990-1998, from v7.0 §V7.A) + Cycle 2 (2020-2028, from v6.0 §21) + Cycle 3 projected (2049-2058) + Cycle 4 projected (2079-2087)
- **LEL events**: 36 events from LEL v1.2 tagged by date to their active dasha periods

### §1.3 — Schema (per row)

```yaml
MX.DSH.[MD.AD]:
  vimshottari_id: DSH.V.NNN per v6.0 §5.1
  md: [planet]
  ad: [planet]
  start: YYYY-MM-DD
  end: YYYY-MM-DD
  duration_years: float
  yogini_concurrent: [Yogini name/ruler, possibly split across rows if boundary crossed]
  chara_concurrent: [Chara MD/AD sign pair, possibly multiple if period longer than Chara cycle]
  sade_sati_state: [C1.Rising | C1.Peak | C1.Setting | null | C2.Rising | ...]
  major_transits_in_period: [Jupiter/Saturn/Rahu-Ketu notable transits overlapping]
  lel_events_in_period: [EVT.* IDs that occurred within start-end]
  native_age_range: [start age - end age]
  interpretation_priority: [HIGH | MEDIUM | LOW] — based on LEL event count + structural significance
  terse_note: [1-line summary]
```

---

## §2 — FULL VIMSHOTTARI MATRIX (50 rows)

| DSH.V | MD | AD | Start | End | Age | Yogini | Chara (start) | Sade Sati | LEL Events | Priority |
|---|---|---|---|---|---|---|---|---|---|---|
| 001 | Jupiter | Venus | 1984-02-05 | 1986-03-03 | 0-2 | Bhramari/Mars → Bhadrika/Mercury (Dec 22, 1985) | Aries/Taurus | — | EVT.1984.02.05.01 (birth) | HIGH (birth anchor) |
| 002 | Jupiter | Sun | 1986-03-03 | 1986-12-21 | 2-2 | Bhadrika/Mercury | Aries/Virgo | — | — | LOW |
| 003 | Jupiter | Moon | 1986-12-21 | 1988-04-21 | 2-4 | Bhadrika/Mercury | Aries/Sag → Aries/Capricorn | — | — | LOW |
| 004 | Jupiter | Mars | 1988-04-21 | 1989-03-27 | 4-5 | Bhadrika/Mercury | Aries/Capricorn → Aries/Aquarius | — | — | LOW |
| 005 | Jupiter | Rahu | 1989-03-27 | 1991-08-21 | 5-7 | Bhadrika/Mercury → Ulka/Saturn (Dec 22, 1990) | Aries/Aquarius → Taurus/Aries | — | — | LOW |
| 006 | Saturn | Saturn | 1991-08-21 | 1994-08-24 | 7-10 | Ulka/Saturn | Taurus multi | **Cycle 1 Rising entering 1990-03** | EVT.1995.XX.XX.01 headaches onset just post-MD | MEDIUM |
| 007 | Saturn | Mercury | 1994-08-24 | 1997-05-03 | 10-13 | Ulka/Saturn → Siddha/Venus (Dec 22, 1996) | Taurus/Leo → Gemini/Cancer | **C1.P05 Peak Aq 1993-11-10 → 1995-06-03** | EVT.1995.XX.XX.01 (headaches onset) during this window | **HIGH** |
| 008 | Saturn | Ketu | 1997-05-03 | 1998-06-12 | 13-14 | Siddha/Venus | Gemini/Leo → Gemini/Virgo | **C1.P08 Setting Pisces 1996-02-17 → 1998-04-18** (most of this AD) | EVT.1998.02.16.01 (R#1 start age 14 — 4 months before AD end) | **HIGH** |
| 009 | Saturn | Venus | 1998-06-12 | 2001-08-12 | 14-17 | Siddha/Venus | Gemini/Virgo → Gemini/Capricorn | Post-C1 Setting ends 1998-04-18 (just before AD start) | EVT.2001.03.XX.01 (IIT prep start, approx end of AD) | MEDIUM |
| 010 | Saturn | Sun | 2001-08-12 | 2002-07-24 | 17-18 | Siddha/Venus | Gemini/Aquarius → Gemini/Pisces | — | — | LOW |
| 011 | Saturn | Moon | 2002-07-24 | 2004-02-24 | 18-20 | Siddha/Venus → Sankata/Rahu (Dec 22, 2003) | Gemini/Pisces → Cancer/Gemini | — | EVT.2003.06.XX.01 (IIT prep end), EVT.2004.01.XX.01 (R#2 start — inside this AD) | MEDIUM |
| 012 | Saturn | Mars | 2004-02-24 | 2005-04-03 | 20-21 | Sankata/Rahu | Cancer/Gemini → Cancer/Aries | — | Continuation of R#2 | LOW |
| 013 | Saturn | Rahu | 2005-04-03 | 2008-02-09 | 21-24 | Sankata/Rahu | Cancer multi | — | EVT.2007.06.XX.01 (knee), EVT.2007.06.XX.02 (engineering complete), EVT.2007.06.10.01 (Cognizant join — all within Jun 2007), R#2 end ~Jan 2007 | **HIGH** |
| 014 | Saturn | Jupiter | 2008-02-09 | 2010-08-21 | 24-26 | Sankata/Rahu | Cancer/Leo → Leo/Libra | — | EVT.2008.06.09.01 (Cognizant exit), EVT.2009.06.XX.01 (grandfather passed) | **HIGH** |
| 015 | **Mercury** | **Mercury** | 2010-08-21 | 2013-01-18 | 26-29 | Sankata/Rahu → Mangala/Moon (Dec 22, 2011) → Pingala/Sun (Dec 22, 2012) | Leo multi | — | EVT.2010.XX.XX.01 (real estate windfall), EVT.2010.12.XX.01 (Thailand), EVT.2011.01+06 (XIMB admit+enroll), EVT.2012.09.XX.01 (modeling), EVT.2012.10.XX.01 (R#3 start) | **HIGHEST — Mercury-Mercury peak = PERIOD.2012_2013 "best period of my life"** |
| 016 | Mercury | Ketu | 2013-01-18 | 2014-01-15 | 29-30 | Pingala/Sun | Leo/Aries → Leo/Taurus | — | EVT.2013.03.XX.01 (XIMB grad), EVT.2013.05.XX.01 (Mahindra join), EVT.2013.XX.XX.01 (father's kidney disease — uncertain month in 2013), EVT.2013.12.11.01 (marriage) | **HIGHEST (4 major events)** |
| 017 | Mercury | Venus | 2014-01-15 | 2016-11-15 | 30-32 | Pingala/Sun → Dhanya/Jupiter (Dec 22, 2014) | Leo/Taurus → Virgo/Leo | — | EVT.2016.XX.XX.01 (Mahindra Retail crash — end of AD) | **HIGH (Venus-weak AD = 2016 crash retrodictive match)** |
| 018 | Mercury | Sun | 2016-11-15 | 2017-09-21 | 32-33 | Dhanya/Jupiter | Virgo/Leo → Virgo/Cancer | — | EVT.2017.03.XX.01 (Tech Mahindra switch — Sun AD of Sun=10H natal = clean match) | **HIGH** |
| 019 | Mercury | Moon | 2017-09-21 | 2019-02-21 | 33-35 | Dhanya/Jupiter → Bhramari/Mars (Dec 22, 2017) | Virgo/Cancer → Virgo/Aries | — | EVT.2018.11.28.01 (father passed — Moon AK AD) | **HIGHEST (soul-level event)** |
| 020 | Mercury | Mars | 2019-02-21 | 2020-02-18 | 35-36 | Bhramari/Mars | Virgo/Aries → Virgo/Pisces | C2 Rising begins 2020-01-25 (near end of AD) | EVT.2019.05.XX.01 (US move — Mars AD = Lagna-lord assertion + CVG.03 foreign) | **HIGH** |
| 021 | Mercury | Rahu | 2020-02-18 | 2022-09-06 | 36-38 | Bhramari/Mars → Bhadrika/Mercury (Dec 22, 2021) | Virgo multi | **C2.P1 Rising Capricorn 2020-01-25 → 2022-04-28** (most of AD) | EVT.2021.01.XX.01 (panic/jitters), EVT.2022.01.03.01 (twins — Rahu AD = multiplication), R#3 end ~Oct 2022 just past AD | **HIGHEST (twins + panic; SS peak start)** |
| 022 | Mercury | Jupiter | 2022-09-06 | 2024-12-12 | 38-40 | Bhadrika/Mercury | Virgo/Libra → Libra/Virgo | **C2.P3 Rising 2022-07-13 → 2023-01-18; C2.P4 Peak Aq 2023-01-18 → 2025-03-30** (most of AD) | EVT.2022.10.XX.01 (R#3 end), EVT.2023.05.XX.01 (US return + pivot), EVT.2023.06.XX.01 (Tepper), EVT.2023.07.XX.01 (Marsys), EVT.2024.02.16.01 (sand mine) | **HIGHEST (5 events — pivot + Marsys + sand mines)** |
| 023 | **Mercury** | **Saturn** | 2024-12-12 | 2027-08-21 | 40-43 | Bhadrika/Mercury → Ulka/Saturn (Dec 22, 2026) | Libra multi → Scorpio (from Feb 5, 2026) | **C2.P4 Peak Aq ends 2025-03-30; C2.P5 Setting Pisces 2025-03-30 → 2027-06-03** (most of AD) | EVT.2025.05.XX.01 (scam), EVT.2025.07.XX.01 (Marsys contract), EVT.2025.XX.XX.01 (Vishnu shift), EVT.CURRENT.01 | **CURRENT / HIGHEST — RPT.DSH.01 planting→compounding window** |
| 024 | **Ketu** | **Ketu** | 2027-08-21 | 2028-01-18 | 43 | Ulka/Saturn | Scorpio/? (check v6.0) | **C2.P6 Setting 2027-10-20 → 2028-02-23** within AD | — | **HIGH — MD transition event (regime change starts)** |
| 025 | Ketu | Venus | 2028-01-18 | 2029-03-18 | 43-45 | Ulka/Saturn | Scorpio/? | — | — | MEDIUM (early Ketu MD) |
| 026 | Ketu | Sun | 2029-03-18 | 2029-07-24 | 45 | Ulka/Saturn | Scorpio/? | — | — | LOW |
| 027 | Ketu | Moon | 2029-07-24 | 2030-02-24 | 45-46 | Ulka/Saturn | Scorpio/? | — | — | MEDIUM (Moon AK AD under Ketu MD — soul-level) |
| 028 | Ketu | Mars | 2030-02-24 | 2030-07-21 | 46 | Ulka/Saturn | Scorpio/? | — | — | LOW |
| 029 | Ketu | Rahu | 2030-07-21 | 2031-08-09 | 46-47 | Ulka/Saturn → Siddha/Venus (Dec 22, 2032) | Scorpio/? | — | **Rahu transit Scorpio 2030-31 ON natal Ketu = nodal-reversal window** | **HIGH** |
| 030 | Ketu | Jupiter | 2031-08-09 | 2032-07-15 | 47-48 | Siddha/Venus | Scorpio/? | — | Jupiter own-sign return 2031-2032 | **HIGH — Jupiter return during Ketu MD** |
| 031 | Ketu | Saturn | 2032-07-15 | 2033-08-24 | 48-49 | Siddha/Venus | Scorpio/? | — | Saturn transit Cancer (8th from Moon) 2032-35 overlaps | MEDIUM |
| 032 | Ketu | Mercury | 2033-08-24 | 2034-08-21 | 49-50 | Siddha/Venus | Scorpio/? | — | Jupiter-Aquarius transit 2033 (gajakesari on Moon) | **HIGH — end of Ketu MD; gajakesari recurrence** |
| 033 | **Venus** | **Venus** | 2034-08-21 | 2037-12-21 | 50-53 | Siddha/Venus → Sankata/Rahu (Dec 22, 2039) | ?/? | — | Ishta Devata Mahalakshmi era begins | **HIGH — Venus MD start (Ishta activation)** |
| 034 | Venus | Sun | 2037-12-21 | 2038-12-21 | 53-54 | Sankata/Rahu | ?/? | — | — | MEDIUM |
| 035 | Venus | Moon | 2038-12-21 | 2040-08-21 | 54-56 | Sankata/Rahu | ?/? | — | Ketu transit Cancer 8H-from-Moon overlap | MEDIUM |
| 036 | Venus | Mars | 2040-08-21 | 2041-10-21 | 56-57 | Sankata/Rahu | ?/? | — | — | MEDIUM |
| 037 | Venus | Rahu | 2041-10-21 | 2044-10-21 | 57-60 | Sankata/Rahu | ?/? | — | **SATURN RETURN LIBRA (own-exaltation) 2041-2044** — lifetime's single most significant structural transit | **HIGHEST — Saturn own-exaltation return in Venus-Rahu AD** |
| 038 | Venus | Jupiter | 2044-10-21 | 2047-06-21 | 60-63 | Sankata/Rahu → Mangala/Moon (Dec 22, 2047) | ?/? | — | Jupiter own-sign return 2043-44 overlap | **HIGH** |
| 039 | Venus | Saturn | 2047-06-21 | 2050-08-21 | 63-66 | Mangala/Moon → Pingala/Sun (Dec 22, 2048) | ?/? | **Cycle 3 Rising begins 2049** (per §V7.A) | — | **HIGH — Cycle 3 Sade Sati entry under Venus MD-Saturn AD** |
| 040 | Venus | Mercury | 2050-08-21 | 2053-06-21 | 66-69 | Pingala/Sun → Dhanya/Jupiter (Dec 22, 2050) | ?/? | C3 Rising/Peak | — | MEDIUM |
| 041 | Venus | Ketu | 2053-06-21 | 2054-08-21 | 69-70 | Dhanya/Jupiter | ?/? | C3 Peak Aquarius ongoing | — | MEDIUM |
| 042 | **Sun** | **Sun** | 2054-08-21 | 2054-12-09 | 70 | Dhanya/Jupiter | ?/? | C3 ongoing | — | MEDIUM (Sun MD start) |
| 043 | Sun | Moon | 2054-12-09 | 2055-06-09 | 70-71 | Bhramari/Mars (Dec 22, 2053) or continuation | ?/? | C3.Peak Aq 2052-2055 | — | LOW |
| 044 | Sun | Mars | 2055-06-09 | 2055-10-15 | 71 | Bhramari/Mars | ?/? | — | — | LOW |
| 045 | Sun | Rahu | 2055-10-15 | 2056-09-09 | 71-72 | Bhramari/Mars | ?/? | — | — | LOW |
| 046 | Sun | Jupiter | 2056-09-09 | 2057-06-27 | 72-73 | Bhramari/Mars → Bhadrika/Mercury (Dec 22, 2058) | ?/? | — | — | LOW |
| 047 | Sun | Saturn | 2057-06-27 | 2058-06-09 | 73-74 | Bhadrika/Mercury | ?/? | C3.Setting ongoing | — | LOW |
| 048 | Sun | Mercury | 2058-06-09 | 2059-04-15 | 74-75 | Bhadrika/Mercury | ?/? | — | — | LOW |
| 049 | Sun | Ketu | 2059-04-15 | 2059-08-21 | 75 | Bhadrika/Mercury | ?/? | — | — | LOW |
| 050 | Sun | Venus | 2059-08-21 | 2060-08-21 | 75-76 | Bhadrika/Mercury | ?/? | — | — | LOW |

(Yogini and Chara "?/?" in later rows = derivable from v6.0 §5.2/§5.3 tables; not shown for space. Chara beyond 2026 requires K.N. Rao Padakrama continuation.)

### §2.1 — Summary statistics

- Total Vimshottari MD-AD rows: 50 covering 76+ years
- HIGHEST priority periods: **9** (DSH.V.015, 016, 019, 021, 022, 023, 037 — plus 014, 024 marked HIGH)
- LEL events per MD (distribution):
  - Jupiter MD 1984-1991: 1 event (birth)
  - Saturn MD 1991-2010: 7+ events (childhood headaches through grandfather death)
  - **Mercury MD 2010-2027: 22 events** (operational spine era — dominant LEL density)
  - Ketu MD 2027-2034: 0 events yet (future)
  - Venus MD 2034-2054: 0 events yet (future)
  - Sun MD 2054-2060: 0 events yet (future)

---

## §3 — KEY-PERIOD DEEP DIVES (20 most significant)

### §3.1 — EARLY LIFE (Jupiter MD + early Saturn MD, 1984-1994)

Jupiter MD at birth (1984-02-05 to 1991-08-21) = classical "Jupiter's blessings on early life" window. Native's foundational period — family warmth, paternal grandfather's academic mentorship formative (doc §4). Saturn MD begins 1991-08-21 at age 7 — transition from childhood-ease to Saturn-discipline-phase. Cycle 1 Sade Sati begins March 1990 (Rising Capricorn) just before Saturn MD begins — stacked.

### §3.2 — Saturn-Mercury AD (1994-08-24 → 1997-05-03) + Sade Sati Peak

```yaml
dsh_v: 007
md_ad: Saturn-Mercury
span: 1994-2017 to 1997-2005
age: 10-13
concurrent_yogini: Ulka/Saturn → Siddha/Venus
sade_sati: C1.Peak Aquarius 1993-11-10 → 1995-06-03 (within this AD)
lel_events: EVT.1995.XX.XX.01 (headaches onset ~1995)
interpretation: |
  Saturn-Mercury AD overlaps Cycle 1 Sade Sati PEAK on native's Moon. Mercury (AD lord) is chart's Yogi + future MD lord — so while Saturn MD is the era-level regime, Mercury-AD-inside-Saturn-MD delivers "Mercury's future-role in embryonic form." The 1995 headaches onset exactly matches this window — Saturn pressure on Moon (Sade Sati Peak) + Mercury Chara DK (spouse karaka) preparing future spouse-relationship.
  Classical reading: headaches during Saturn-transit-on-natal-Moon is textbook. The onset at this exact age (11) during this specific AD is one of the clearest retrodictive validations in early-life register.
```

### §3.3 — Saturn-Ketu AD (1997-05-03 → 1998-06-12) + R#1 Start

```yaml
dsh_v: 008
md_ad: Saturn-Ketu
span: 1997-2005 to 1998-1998
age: 13-14
concurrent_yogini: Siddha/Venus (running Dec 22, 1996 - Dec 22, 2003)
sade_sati: C1.P08 Setting Pisces 1996-02-17 → 1998-04-18 (spans most of this AD)
lel_events: EVT.1998.02.16.01 (R#1 start Feb 16, 1998 = 4 months before AD end)
interpretation: |
  Ketu AD at age 13-14 = classical "unusual-attachment formation" window. Ketu = detachment-despite-engagement karaka; Saturn-Ketu AD combination = karmic-bond-without-conventional-structure. Siddha/Venus Yogini concurrent = Venus (partnership-karaka) at Yogini level running simultaneously. Sade Sati Setting phase ending — Saturn's weight lifting from Moon just as R#1 forms.
  Retrodictively: R#1 starts as a Ketu-AD event (karmic-compulsory bond rather than conventional romance), AND as a Venus-Yogini event (partnership-karaka activated externally). This dual-activation explains why the relationship persists 15 years through engineering + MBA + first-job-era to become the eventual wife (2013). Ketu AD "bonds" without explaining why.
```

### §3.4 — Saturn-Moon through Saturn-Mars AD (2002-2005) + R#2 Start

```yaml
dsh_v: 011-012
span: 2002-07-24 to 2005-04-03
age: 18-21
concurrent_yogini: Siddha/Venus through Sankata/Rahu (Dec 22, 2003 transition)
sade_sati: Post-C1 (Cycle 1 ended 1998; no SS in this window)
lel_events: EVT.2003.06.XX.01 (IIT prep end), EVT.2004.01.XX.01 (R#2 start — Saturn-Moon AD at start, transitions to Saturn-Mars mid-AD)
interpretation: |
  Saturn-Moon AD (Moon = native's AK) activates soul-level decisions during ADs. R#2 (Jan 2004) begins exactly at end of Saturn-Moon AD (closing) and start of Saturn-Mars AD (Mars = Lagna lord, 7H tenant). Sankata/Rahu Yogini just began (Dec 2003) = "crisis Yogini" 8-year cycle opens. 
  Native entered SRM Chennai engineering (~2003-2007) in this window — first extended foreign-city residence. IIT-prep-end marks closure of pre-college childhood-structure; engineering-era opens with a non-primary-relationship concurrent with R#1. Pattern of overlapping relationships under Saturn-era is consistent with Saturn-Ketu (R#1 onset) + Saturn-Moon→Mars (R#2 onset) sequencing.
```

### §3.5 — Saturn-Rahu AD (2005-04-03 → 2008-02-09) + Cognizant + Knee

```yaml
dsh_v: 013
span: 2005-2008
age: 21-24
concurrent_yogini: Sankata/Rahu (matches AD lord Rahu)
sade_sati: none
lel_events: 
  - EVT.2007.06.XX.01 (knee surgery)
  - EVT.2007.06.XX.02 (engineering completion)
  - EVT.2007.06.10.01 (Cognizant join — all within single month)
interpretation: |
  Saturn-Rahu AD with concurrent Sankata/Rahu Yogini = **double-Rahu activation**. Rahu's "unusual/amplified/foreign" themes dominate. Engineering completion + first-IT-job + joint-surgery all cluster in June 2007 = single-month compressed Rahu-AD-output.
  Knee injury at Mars-Saturn 7H physical register + Rahu-AD temporal = Rahu amplifies physical friction already built into chart (SIG.15 Hidden Raja + Mars debilitation). Cognizant = entry-level IT job under Saturn-Rahu-Sankata Yogini triple-pressure = hard-grind first-job (consistent with native exiting exactly 1 year later to re-prep IIT).
```

### §3.6 — Saturn-Jupiter AD (2008-02-09 → 2010-08-21) + Cognizant Exit + Grandfather

```yaml
dsh_v: 014
span: 2008-2010
age: 24-26
concurrent_yogini: Sankata/Rahu continuing
lel_events:
  - EVT.2008.06.09.01 (Cognizant exit — Saturn-Jupiter AD start)
  - EVT.2009.06.XX.01 (grandfather passed — Jupiter AD delivering weakness via CTR.03)
interpretation: |
  Saturn-Jupiter AD = dharmic-restructure AD (Jupiter = guru/dharma-karaka). Native left paying job to re-prep IIT = Jupiter-AD dharmic redirection. Grandfather's death (Jun/Jul 2009) inside Jupiter-AD = 9L Jupiter-AD activating 9H grandfather-significator; CTR.03 Jupiter-Uccha-weak expresses as grandparent-loss. Strongest retrodictive fit in early-adult LEL events — Jupiter-AD + weak-Jupiter + grandfather-karaka = textbook classical chain.
```

### §3.7 — **Mercury MD OPENS: Mercury-Mercury AD (2010-08-21 → 2013-01-18)** — PEAK LIFE

```yaml
dsh_v: 015
span: 2010-08-21 to 2013-01-18
age: 26-29
concurrent_yogini: Sankata/Rahu → Mangala/Moon (Dec 2011) → Pingala/Sun (Dec 2012)
lel_events:
  - EVT.2010.XX.XX.01 (family real estate windfall — 2010)
  - EVT.2010.12.XX.01 (Thailand first foreign)
  - EVT.2011.01.XX.01 (XIMB admission)
  - EVT.2011.06.XX.01 (XIMB enrolled)
  - EVT.2012.09.XX.01 (modeling)
  - EVT.2012.10.XX.01 (R#3 start)
  - PERIOD.2012_2013 "best of my life"
interpretation: |
  **MERCURY'S 17-YEAR ERA OPENS AT MD-MD PEAK.** Mercury = Yogi + Vargottama + future MD lord — the ABsolute operational zenith for anything Mercury-significated (education, communication, selection, knowledge-work). Native enters XIMB MBA (education = Mercury domain; Saraswati yoga member), peaks socially/physically (modeling, basketball, sports-luck per doc §8), forms R#3 (October 2012).
  Native's own characterization of 2012-13 as "best period of my life" retrodictively validates this AD as operational-peak. The entire life prior (Saturn MD era 1991-2010) was preparation; this AD is Mercury expressing fully for the first time. Mangala/Moon Yogini 2011-2012 + Pingala/Sun Yogini 2012-2014 add emotional-lunar and solar-visibility layers — culminating in XIMB-modeling-partying triple peak.
```

### §3.8 — Mercury-Ketu AD (2013-01-18 → 2014-01-15) + Graduation + Marriage

```yaml
dsh_v: 016
span: 2013-01-18 to 2014-01-15
age: 29-30
concurrent_yogini: Pingala/Sun
lel_events:
  - EVT.2013.03.XX.01 (XIMB graduation)
  - EVT.2013.05.XX.01 (Mahindra Retail join)
  - EVT.2013.XX.XX.01 (father's kidney disease onset — ambiguous month 2013)
  - EVT.2013.12.11.01 (marriage Dec 11, 2013)
interpretation: |
  **FOUR major events in 12-month AD.** Ketu AD's "endings/karmic-completions" theme expresses consistently: education-ending (graduation), corporate-job-beginning (career-launch as completion of preparation), father's-illness-emerging (paternal-karma surfacing), marriage (R#1 15-year track completing into formal bond).
  Pingala/Sun Yogini concurrent = Sun (10H native + career karaka) runs in parallel = career-launch synchronous with life-events. Marriage Dec 11, 2013 is the RPT.DSH.01 + SIG.01 7H-Saturn-exalted activation point — Ketu AD "completes" the R#1 track that started in Saturn-Ketu AD (1998). Structurally: Ketu closes what Saturn opened.
```

### §3.9 — Mercury-Venus AD (2014-01-15 → 2016-11-15) + 2016 Mahindra Crash

```yaml
dsh_v: 017
span: 2014-01-15 to 2016-11-15
age: 30-32
concurrent_yogini: Pingala/Sun → Dhanya/Jupiter (Dec 22, 2014)
lel_events: EVT.2016.XX.XX.01 (Mahindra Retail crash — late in AD period)
interpretation: |
  Venus AD = Venus-weak (SIG.12 Shadbala rank 7 last). 2H + 7L Venus activation = both wealth-family AND partnership-spouse registers destabilized. Mahindra Retail company "crash" per native's own words (doc §5) occurs late in this AD — exactly the "Venus-weak AD expresses as career-wealth-instability" retrodictive pattern. Dhanya/Jupiter Yogini provides dharmic-restructure overlay (native decides to switch to Tech Mahindra during this window).
  This AD validates SIG.12 Venus-weakness-structural-signal at event-level for career domain. Expected resolution: Mercury-Sun AD (next) returns native to Sun-10H-strength immediately after.
```

### §3.10 — Mercury-Sun AD (2016-11-15 → 2017-09-21) + Tech Mahindra Switch

```yaml
dsh_v: 018
span: 2016-11-15 to 2017-09-21
age: 32-33
concurrent_yogini: Dhanya/Jupiter
lel_events: EVT.2017.03.XX.01 (Tech Mahindra switch March 2017)
interpretation: |
  Clean retrodictive match: Sun AD (Sun=10H native) activates career-house at AD level; Mercury MD + Sun AD = BOTH MD lord and AD lord in same D1 house (10H Capricorn) = textbook career-advancement AD. March 2017 Tech Mahindra switch perfectly aligned. Dhanya/Jupiter Yogini adds dharmic-upgrade layer — the switch is to a LARGER company in the same Mahindra group (dharmic-escalation).
```

### §3.11 — Mercury-Moon AD (2017-09-21 → 2019-02-21) + Father's Death

```yaml
dsh_v: 019
span: 2017-09-21 to 2019-02-21
age: 33-35
concurrent_yogini: Dhanya/Jupiter → Bhramari/Mars (Dec 22, 2017)
lel_events: EVT.2018.11.28.01 (father passed Nov 28, 2018)
interpretation: |
  **SOUL-LEVEL EVENT WINDOW.** Moon AK AD = soul-level activation. Father's death triggers: (1) Moon as 4L (home-security-ending with paternal-loss), (2) Moon Chalit-12 (loss-house), (3) CTR.03 Jupiter-weak (9L father-significator vulnerability manifests), (4) Saturn transit Sagittarius 9H (classical father-death trigger), (5) 5 eclipses within 6 months of event. Bhramari/Mars Yogini (started Dec 2017) = Mars-intensity overlay (hospital-running Hyderabad↔Bhubaneswar = Mars-kinetic-effort).
  Five-way convergence = strongest retrodictive match in corpus. This period is a CORNERSTONE for native's psychology and retrodictive calibration of the chart.
```

### §3.12 — Mercury-Mars AD (2019-02-21 → 2020-02-18) + US Move

```yaml
dsh_v: 020
span: 2019-02-21 to 2020-02-18
age: 35-36
concurrent_yogini: Bhramari/Mars (matches AD lord Mars)
sade_sati: C2 Rising begins 2020-01-25 (final month of AD)
lel_events: EVT.2019.05.XX.01 (US move May 2019)
interpretation: |
  Double-Mars AD + Yogini = **Mars-concentration period**. Mars = Lagna lord + 7H tenant + Avayogi. US move at Mars-AD start = Mars "assertion-action" principle expressing as major relocation. Moon-AK-Chalit-12 CVG.03 foreign-income chain activates simultaneously (Moon + Mars = soul-assertion abroad). Sade Sati Rising begins January 2020 just before AD ends = Saturn's adolescent weight returning just as US phase establishes.
```

### §3.13 — Mercury-Rahu AD (2020-02-18 → 2022-09-06) + Panic + Twins

```yaml
dsh_v: 021
span: 2020-02-18 to 2022-09-06
age: 36-38
concurrent_yogini: Bhramari/Mars → Bhadrika/Mercury (Dec 22, 2021)
sade_sati: C2.P1 Rising Capricorn 2020-01-25 → 2022-04-28 (entire AD)
lel_events:
  - EVT.2021.01.XX.01 (panic/jitters Jan 2021)
  - EVT.2022.01.03.01 (twins born Jan 3, 2022)
  - R#3 concluding around AD end (~Oct 2022 falls in next Jupiter AD but R#3 closure process would begin here)
interpretation: |
  Rahu AD + Sade Sati C2 Rising = **maximum-background-pressure window**. Rahu = anxiety/sudden-events karaka; Sade Sati Rising peak on Moon = mental-weight phase. Panic episode January 2021 retrodictively fits doubly (Rahu + Bhramari/Mars Yogini = mars-adrenal-activation). Twins' birth (Jan 2022) under Rahu AD = multiplication/doubling Rahu classical = textbook match. Bhadrika/Mercury Yogini starts Dec 2021 = Mercury reinforcement for the MD.
  Full "2018-2021 US-exciting" period per native's own reflection culminates here. COVID era + panic + twins + preparing US-pivot all stacked in this 2.5-year AD.
```

### §3.14 — Mercury-Jupiter AD (2022-09-06 → 2024-12-12) + Pivot + Marsys + Sand Mine

```yaml
dsh_v: 022
span: 2022-09-06 to 2024-12-12
age: 38-40
concurrent_yogini: Bhadrika/Mercury (continues)
sade_sati: C2.P3/P4 transition then C2.P4 Peak Aquarius 2023-01-18 → 2025-03-30 (overlaps)
lel_events:
  - EVT.2022.10.XX.01 (R#3 end)
  - EVT.2023.05.XX.01 (US→India return + pivot)
  - EVT.2023.06.XX.01 (Tepper Exec MBA)
  - EVT.2023.07.XX.01 (Marsys founded)
  - EVT.2024.02.16.01 (Kotadwara sand mine launch Feb 16, 2024)
interpretation: |
  **JUPITER AD DURING MERCURY MD = DHARMIC-MATERIAL ENGINE ACTIVATION.** Jupiter (9L dharma-wealth, Lakshmi-Saraswati member) AD inside Mercury (Yogi) MD = CVG.02 Jupiter-dharma-chain fully activated. Combined with Sade Sati Peak (Aquarius on Moon) = compressive life-restructure with dharmic-direction.
  Five major events cluster here — **densest LEL-events AD in entire lifetime**. Native's reflection "pivotal point where I completely changed my life from salary job to business" (Session 2 text) matches this AD's structural promise. Chara shifts from Virgo (analytical/service) to Libra (Saturn's exaltation sign, partnership) on Feb 5, 2024 = sand mine launch Feb 16, 2024 ten days into Libra Chara MD = triple-convergence of Mercury-Jupiter AD + Saturn-exaltation-Chara-MD + Jupiter 9L delivering.
```

### §3.15 — **Mercury-Saturn AD (2024-12-12 → 2027-08-21)** — **CURRENT**

```yaml
dsh_v: 023
span: 2024-12-12 to 2027-08-21
age: 40-43 (CURRENT native age 42)
concurrent_yogini: Bhadrika/Mercury → Ulka/Saturn (Dec 22, 2026)
sade_sati: C2.P4 Peak Aq ends 2025-03-30; C2.P5 Setting Pisces 2025-03-30 → 2027-06-03 (majority of AD)
lel_events:
  - EVT.2025.05.XX.01 (deception/scam)
  - EVT.2025.07.XX.01 (Marsys major contract)
  - EVT.2025.XX.XX.01 (Vishnu shift — 2025)
  - EVT.CURRENT.01 (marital status: separated-stable, improving)
interpretation: |
  **CURRENT OPERATING WINDOW — the RPT.DSH.01 "planting → compounding" Triple-Dasha Engine cornerstone.** Saturn AD (AmK + 10H/11H Lord + Sasha MPY + 7H exalted natal) during Mercury MD = the chart's apex authority-delivery phase. CVG.05 5-way convergence activates: Saturn 7H exalted + Shadbala-strong + Mahapurusha + AD + Ulka/Saturn Yogini (entering Dec 2026 reinforces).
  Ulka/Saturn Yogini concurrence from Dec 22, 2026 = Saturn double-activation for last 8 months of AD. Saturn Sade Sati Setting Pisces 2025-2028 overlaps — Saturn's authority-delivery + Saturn's weight-lifting-phase simultaneously. Native's current "separation-but-stable, improving" marital state is this duality expressing (7H-Saturn-AD delivering structure without compounding intimacy).
  First Marsys major contract July 2025 = RPT.DSH.01 validated. Remaining 2 years (2025-07 to 2027-08) are the compounding test phase. Vishnu/Venkateshwara shift 2025 = CTR.02 resolving in favor of classical-dharma-devata. Scam May 2025 = CTR.01 "dramatic-not-compound" expressing negatively (visible loss-event without compounding-consequence).
```

### §3.16 — Ketu MD OPENS: Ketu-Ketu AD (2027-08-21 → 2028-01-18)

```yaml
dsh_v: 024
span: 2027-08-21 to 2028-01-18
age: 43
lel_events: (future — no events logged yet)
interpretation: |
  **MD REGIME CHANGE.** Mercury-era (17 years operational spine) ends. Ketu MD begins — 7 years of exalted-Ketu-8H-Scorpio delivery. Classical: Ketu MD transitions often feel ABRUPT unless AD bridges smooth the handover. Ketu-Ketu AD peak = full Ketu-detachment-moksha-crisis regime active immediately.
  Critical structural transitions at this moment: (1) Yogi-lord (Mercury) loses MD spotlight, (2) Saturn AD ends just 5 months before, (3) Chara MD at Scorpio cycle approaching. Native will be 43.5 years old. RPT.DSH.02 covers this extensively. Expected: major life-decision windows, sudden reversals, spiritual-research deepening.
```

### §3.17 — Ketu-Rahu AD (2030-07-21 → 2031-08-09) + Rahu transit on Ketu

```yaml
dsh_v: 029
span: 2030-07-21 to 2031-08-09
age: 46-47
transit_note: Rahu transit Scorpio 2030-31 = ON NATIVE'S NATAL KETU. **Nodal reversal** window.
interpretation: |
  Double-nodal-axis-activation: Ketu MD (detachment) + Rahu AD (amplification/crisis) + Rahu transit on natal Ketu = classical "nodal-reversal" window of highest structural intensity. Native age 46-47. This is the chart's SINGLE MOST NODAL-INTENSE period in a lifetime. Should be flagged in Temporal Engine as "DO NOT INITIATE new-unconventional-ventures" period — Rahu debilitated (transit Scorpio, its debility) + Ketu-MD detachment = contraindicated for aggressive risk-taking.
```

### §3.18 — Ketu-Jupiter AD (2031-08-09 → 2032-07-15) + Jupiter Own-Sign Return

```yaml
dsh_v: 030
span: 2031-2032
age: 47-48
transit_note: Jupiter own-sign Sagittarius transit 2031-2032 = Jupiter return to native's 9H natal position
interpretation: |
  After nodal-reversal year, Jupiter-AD + Jupiter-own-sign-transit = dharmic-reset and 9H reactivation. Native's dharmic life re-anchors. Parallel to 2023 Mercury-Jupiter AD but now under Ketu MD = dharma-in-detachment flavor. Could be a major spiritual-teacher period (guru-adoption, ashram engagement, or spiritual-formal-practice entry).
```

### §3.19 — Venus MD OPENS (2034-08-21) — 20-year Ishta Devata era

```yaml
dsh_v: 033
span: Venus MD entire 2034-08-21 → 2054-08-21 (20 years)
age: 50-70
concurrent_yogini: Siddha/Venus → various
interpretation: |
  Venus MD = Ishta Devata Mahalakshmi's 20-year activation (SIG.12 + Mahalakshmi prescription per §20.1). Ishta devotion work native does NOW potentially yields during this period. Venus is D1 Shadbala rank 7 weakest — BUT Venus in D9 debilitated cancelled via Mercury-Vargottama-NBRY = "redemption-through-dharmic-companion" signature. Native's 50s-60s under Venus MD could see the weakest-but-Ishta-ruler-planet deliver its delayed-bloom payoff.
  Venus-Rahu AD 2041-2044 = overlap with SATURN OWN-EXALTATION RETURN LIBRA (age 57-60) — SINGLE most significant lifetime structural transit. Expect major life-cycle-closure on partnership/authority matters during this 3-year overlap.
```

### §3.20 — Saturn Return-to-Libra (2041-2044) During Venus-Rahu AD — LIFETIME APEX TRANSIT

```yaml
external_transit: Saturn enters Libra ~2041-10, exits ~2044-02 (own-exaltation return)
overlapping_ad: DSH.V.037 Venus-Rahu (2041-2022-10-21 to 2044-10-21)
native_age: 57-60
interpretation: |
  **CHART'S SINGLE MOST SIGNIFICANT STRUCTURAL TRANSIT.** Saturn's 29.5-year cycle brings Saturn back to its own-exaltation seat (Libra 22°27' natal). During Venus MD - Rahu AD — concurrent with Rahu-amplification of whatever Saturn-returns-deliver. Native age 57-60 = post-peak-career years.
  Structural implications: SIG.01 Sasha MPY re-seals at transit level. 7H axis reopens — partnerships (marriage separation outcome?), Marsys business partnerships (consolidation?), authority positions (retirement from active operations, move to advisory/chairman role?). Whatever was "planted" in the current 2024-2027 Saturn AD "compounds" or "closes" at this Saturn return. High-leverage lifetime decision window.
  Recommend: v1.1 Temporal Engine explicitly models this 2041-2044 window as "second-apex structural window" after current 2024-2027.
```

---

## §4 — CROSS-PERIOD AGGREGATES

### §4.1 — Dasha-event density by MD

| MD | Years | LEL Events | Density (events/year) |
|---|---|---|---|
| Jupiter | 1984-1991 (7.5y) | 1 | 0.13 |
| Saturn | 1991-2010 (19y) | 7 | 0.37 |
| **Mercury** | **2010-2027 (17y)** | **22** | **1.29** |
| Ketu | 2027-2034 (7y) | 0 (future) | — |
| Venus | 2034-2054 (20y) | 0 (future) | — |
| Sun | 2054-2060 (6y) | 0 (future) | — |

**Mercury MD density is 10× the Jupiter-MD density and 3.5× the Saturn-MD density.** Mercury = operational spine means the chart EXPRESSES most actively through it. This is not a random pattern — it's the CVG.01 + SIG.09 structural feature delivering.

### §4.2 — AD → life-event mapping for Mercury MD (retrodictive validation table)

| AD | Lord's Domain | LEL Cluster | Retrodictive Match |
|---|---|---|---|
| Mer-Mer 2010-13 | Self-operational peak | 6 events — peak life | YES (Mercury MD-MD = operational zenith) |
| Mer-Ket 2013-14 | Endings/completions | 4 events — grad+job+marriage+father's illness | YES (Ketu = endings; multi-completion cluster) |
| Mer-Ven 2014-16 | Venus-weak 2H/7L | Mahindra crash end of AD | YES (Venus-weak crash validates SIG.12) |
| Mer-Sun 2016-17 | 10H career | Tech Mahindra switch | YES (Sun AD in 10H native = clean career upgrade) |
| Mer-Moon 2017-19 | AK soul-level | Father's death | YES (AK AD + Saturn-transit-9H = soul-level loss) |
| Mer-Mars 2019-20 | Lagna lord action | US move | YES (Mars AD = assertion abroad) |
| Mer-Rah 2020-22 | Unusual/anxiety | Panic + twins | YES (Rahu = multiplication + anxiety combo) |
| Mer-Jup 2022-24 | Dharma-wealth | Pivot + Marsys + sand mine | YES (Jupiter 9L AD = dharmic-business delivery) |
| Mer-Sat 2024-27 | Authority-structure | Scam + contract + Vishnu shift | YES (Saturn AD + CTR.01 + CTR.02 validations) |

**Retrodictive validation rate for Mercury MD: 9/9 ADs = 100%.** Every Mercury AD has a life-event cluster matching its AD-lord's natural significations. This is among the cleanest retrodictive validations possible in Jyotish and confirms the v1.2.1 Deep Analysis RPT.DSH.01 predictive framework.

### §4.3 — Yogini × Vimshottari concurrence patterns

Yogini dashas (8 Yoginis, 36-year cycle) cross-tabulate with Vimshottari at specific boundary dates:
- **Mangala/Moon 2011-2012** overlaps Mercury-Mercury AD second half = LAG.MANGALA peak of "best life period"
- **Pingala/Sun 2012-2014** overlaps Mercury-Mercury transition to Mercury-Ketu = career-launch (Sun = 10H native)
- **Dhanya/Jupiter 2014-2017** overlaps Mercury-Venus → Mercury-Sun = dharmic-career-transition
- **Bhramari/Mars 2017-2021** overlaps Mercury-Moon → Mercury-Rahu = Mars-intensity (father's death Mars-adrenal period + US move + panic)
- **Bhadrika/Mercury 2021-2026** overlaps Mercury-Rahu → Mercury-Jupiter → early Mercury-Saturn = Mercury reinforcement
- **Ulka/Saturn 2026-2032** overlaps late Mercury-Saturn + all of Ketu MD first 5 years = Saturn-reinforcement through regime change

### §4.4 — Sade Sati × Dasha overlap summary

| SS Phase | Date Range | Age | Concurrent Vimshottari AD | Life Impact |
|---|---|---|---|---|
| C1.Rising Cap | 1990-03-21 → 1993-03-06 | 6-9 | Jupiter-Rahu → Saturn-Saturn | Early childhood; parents' family dynamic formative |
| C1.Peak Aq | 1993-1995-06 + retro to 1996-02 | 9-12 | Saturn-Mercury | **Headaches onset ~1995** (C1 Peak on Moon + Mercury AD) |
| C1.Setting Pisces | 1995-06 → 1998-04 | 11-14 | Saturn-Mercury → Saturn-Ketu | **R#1 start Feb 1998** (C1 Setting) |
| **C2.Rising Cap** | 2020-01 → 2022-04 | 36-38 | Mercury-Rahu (most) | **Panic 2021** + **Twins 2022** |
| **C2.Peak Aq** | 2022-04 → 2025-03 | 38-41 | Mercury-Jupiter → early Mercury-Saturn | **US pivot + Marsys + Sand mine** |
| **C2.Setting Pisces** | 2025-03 → 2028-02 | 41-44 | **Mercury-Saturn (CURRENT)** + Ketu-Ketu | **Vishnu shift + contract + Ketu MD entry** |
| C3.Rising Cap | 2049-2052 | 65-68 | Venus-Saturn | Senior phase entry |
| C3.Peak Aq | 2052-2055 | 68-71 | Venus-Saturn → Venus-Mercury | Peak elder phase |
| C3.Setting Pis | 2054-2057 | 70-73 | Venus-Mercury → Sun-Sun | Late-life reorientation |

**Observation**: Every Sade Sati cycle is multi-AD — 8-year cycle spans multiple Vimshottari ADs. Cycle 2 spans Mercury-Mars, Rahu, Jupiter, Saturn ADs and Ketu-Ketu = 5 distinct ADs within one Sade Sati cycle. Life events distribute across these sub-periods.

### §4.5 — New SIG candidates from Dasha-Period Matrix

- **SIG.29 (tentative)**: Mercury MD retrodictive density 10× other MDs — quantifies CVG.01 operationally. Could promote to dominant signature with event-density metric.
- **SIG.30 (tentative)**: AD-lord-matching-life-event-domain pattern (100% match rate in Mercury MD) — validates classical Vimshottari-AD-delivery-mechanism at evidence-level. Extends RPT.DSH.01.
- **SIG.31 (tentative)**: 2041-2044 Saturn-own-exaltation-return overlapping Venus-Rahu AD = lifetime's second-apex structural window; not in v1.2.1 RPT.TRN.01 36-month-horizon (out of scope) but crucial for Lifetime Timeline.

---

## §5 — RED-TEAM CHECK

- **Completeness**: 50/50 Vimshottari MD-AD rows present. Yogini concurrence full. Chara concurrence partial for post-2026 rows (Chara Padakrama beyond v6.0 §5.3 end requires derivation; flagged but not hard-blocking for matrix purpose).
- **Over-claim**: New SIG.29-31 marked tentative. 100% retrodictive match claim for Mercury MD ADs is factual (9/9 AD-lord-domain matches) but could be criticized as "confirmation-pattern-naming." Reader should note this.
- **Missing-data**: Ketu MD and Venus MD have 0 logged events (future). Priority-MEDIUM+ ratings for future ADs are predictive projections, not retrodictive.
- **Bias**: Heavy focus on Mercury MD because that's where 22 of 36 LEL events sit. Pre-Mercury and post-Mercury coverage is correspondingly lighter. This matches reality but may bias L2.5 UCN writing — explicit correction needed.

---

## §6 — OUTPUT FOR L2.5 + L3

### §6.1 — Primary feed to L3 Temporal Engines

This matrix IS the source table for:
- `LIFETIME_TIMELINE.md` (Session 37 per Architecture §I)
- `HEATMAP_ROLLING_36MO.md` (already exists; refresh quarterly)
- `VARSHPHAL_2026_2027.md` (current year)
- `VARSHPHAL_2027_2028.md` (future year)
- Any daily transit digest capability

### §6.2 — CGM contribution
- 50 DSH.V nodes (one per MD/AD)
- 17 DSH.Y nodes
- 80+ DSH.C nodes
- Edges: dasha-lord ↔ natal-planet (reinforces MATRIX_PLANETS)
- Edges: LEL event ↔ concurrent dasha combination

### §6.3 — MSR signals (~40)
- Per-MD density signals
- AD-domain-match validation signals
- Sade Sati × AD overlap signals
- Future-window flag signals (2030 nodal, 2031 Jupiter, 2041 Saturn return)

### §6.4 — Feed to L2.5 CDLM
Dasha-Period matrix feeds time-based cross-domain coupling:
- Mercury MD = operational spine across ALL 9 domains (strongest cross-domain coupling)
- Saturn AD = career-partner-authority concurrent (3-domain coupling)
- Ketu MD = detachment signal across career-spiritual-relationship

---

## §7 — CHANGELOG

```yaml
v1.0 (2026-04-17, Session 10 — closes Mode B):
  - Initial Dasha-Period Matrix covering all 50 Vimshottari MD/AD rows (lifetime 1984-2060)
  - Cross-tabulation with Yogini (17 entries) + Chara (80+) + Sade Sati (Cycle 1 + 2 + future 3-4)
  - 36 LEL events tagged to dasha periods
  - 20 key-period deep-dives with interpretation
  - Retrodictive validation table: 9/9 Mercury MD ADs match AD-lord domain theme
  - 3 new SIG candidates (29 Mercury-MD-density, 30 AD-domain-match-pattern, 31 2041-Saturn-return-structural)
  - Session 10 closes MODE B matrices (Houses + Planets + Signs + Divisionals + Dasha-Periods all shipped)
  - Status: CLOSED
```

**END OF DASHA-PERIOD MATRIX v1.0 — CLOSES L2 MODE B**
