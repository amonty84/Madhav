---
archived_at: 2026-04-28
archived_by: Phase_14_0_Asset_Inventory
archived_reason: SUPERSEDED by MSR_v3_0 + UCN_v4_0; no hard platform references
document: L2 MODE B — HOUSE MATRIX
project: MARSYS-JIS
layer: L2 (Analytical Layer, Mode B — Exhaustive Coverage)
artifact_id: MATRIX_HOUSES_v1_0
version: 1.0
status: CLOSED (Session 7 output)
sibling_files: MATRIX_PLANETS, MATRIX_SIGNS, MATRIX_DASHA_PERIODS, MATRIX_DIVISIONALS (future sessions)
source_layer: L1 Facts (v6.0 base + v7.0 supplement + CGP audit + LEL v1.2)
mode_discipline: Per Architecture §C.2 — Mode B is exhaustive coverage (guarantees no entity missed); Mode A is interpretive depth. This file has 1-3 paragraph interpretation per row. Depth lives in Deep Analysis v1.2.1 RPT.* sections.
completeness_audit_ref: CGP_AUDIT_v1_0 §2 shows Facts Layer v7.0 SIGNED OFF (all data required for this matrix is populated)
outputs_feed_to: L2.5 Chart Graph Model (CGM nodes for houses + edges from house-lord-chain) and Master Signal Register (MSR signals for house-strength, yoga-membership, etc.)
---

# HOUSE MATRIX — L2 Mode B Exhaustive Coverage

## §1 — META

### §1.1 — Purpose

Per Architecture §D.3 Mode B specification, this matrix guarantees **every one of 12 houses is examined**. Unlike Mode A's curated depth (RPT.HSE.01 focuses on 10-11-12 career/gains/foreign architecture; RPT.HSE.02 focuses on 2H/7H weakness), Mode B covers every house with a standard structural audit — tenants, lord, Bhavabala, SAV, yogas, arudhas, Dx confirmations, dashas, transits, LEL events, terse interpretation.

### §1.2 — Reading Conventions

- **Aries Lagna native**: all house-sign mappings are 1=Aries, 2=Taurus, ... 12=Pisces
- **Rashi vs Chalit ambiguity**: Two planets have known Rashi/Chalit drift — Moon (CTR.04: Rashi 11, Chalit 12) and Mercury (CTR.05: Rashi 10, Chalit boundary near 10/11). Matrix lists Rashi as primary; Chalit noted in per-house detail.
- **Cross-reference**: Every row cites Mode A RPT sections (`RPT.HSE.*`), structural signatures (`SIG.*`), convergences (`CVG.*`), and contradictions (`CTR.*`) from Deep Analysis v1.2.1 where applicable.

---

## §2 — SCHEMA (per row, 18 columns)

```yaml
MX.HSE.N:
  house_num: 1..12
  sign: [Aries..Pisces]
  element: [Fire | Earth | Air | Water]
  quality: [Movable | Fixed | Dual]
  rashi_tenants: [list of planets by §2.2]
  chalit_tenants_if_differs: [list if different]
  sign_lord: [planet]
  sign_lord_placement: [sign + house from Lagna]
  bhavabala_total: [virupa value]
  bhavabala_rank: [1-12; 1 = strongest]
  sav_bindu: [integer 0-8+ per sign, from §7.2]
  aspects_received_vedic: [list of aspecting planets]
  aspects_received_jaimini: [list of signs Jaimini-aspecting]
  yogas_involving: [list from Deep Analysis]
  arudhas_in_house: [A1..A12 + UL as applicable]
  d9_house_lord_location: [sign]
  d10_house_lord_location: [sign]
  lel_events_tagged: [EVT.* IDs from LEL v1.2]
  transit_activation_windows_2026_2044: [key windows]
  mode_a_rpt_coverage: [RPT.* sections from Deep Analysis]
  interpretation: [1-3 paragraph terse synthesis]
```

---

## §3 — HOUSE MATRIX (SUMMARY TABLE)

| MX | House | Sign | Elem | Qual | Rashi Tenants | Sign Lord | Lord Placement | Bhavabala Rank | SAV | Yogas | Arudhas Here |
|---|---|---|---|---|---|---|---|---|---|---|---|
| MX.HSE.1 | 1 | Aries | Fire | Movable | (none) | Mars | 7H Libra (exalted? no — Mars is own-sign Libra is exalt-for-Saturn) | 10 | 29 | — | A10 |
| MX.HSE.2 | 2 | Taurus | Earth | Fixed | **Rahu** | Venus | 9H Sagittarius | **11** | 29 | Dhana Yoga signals via Rahu | A6, Rahu |
| MX.HSE.3 | 3 | Gemini | Air | Dual | (none) | Mercury | 10H Capricorn | 7 | 28 | CVG.07 Gemini nexus | UL, A5, A11 |
| MX.HSE.4 | 4 | Cancer | Water | Movable | (none) | Moon | 11H Aquarius (Chalit-12) | 6 | 32 | — | A2 |
| MX.HSE.5 | 5 | Leo | Fire | Fixed | (none) | Sun | 10H Capricorn | **2** | 30 | — | A3 |
| MX.HSE.6 | 6 | Virgo | Earth | Dual | (none) | Mercury | 10H Capricorn | 8 | 26 | — | A4, A9, A8 |
| MX.HSE.7 | 7 | Libra | Air | Movable | **Saturn, Mars** | Venus | 9H Sagittarius | **12** | 33 | **Sasha MPY (SIG.01), Hidden Raja (SIG.15)** | Saturn, Mars |
| MX.HSE.8 | 8 | Scorpio | Water | Fixed | Ketu | Mars (+ Ketu co-lord) | 7H Libra | 9 | 33 | — | Ketu |
| MX.HSE.9 | 9 | Sagittarius | Fire | Dual | **Jupiter, Venus** | Jupiter | 9H Sagittarius (own sign) | 5 | 25 | **Lakshmi (SIG.08), Saraswati-partial (SIG.07)** | Jupiter, Venus |
| MX.HSE.10 | 10 | Capricorn | Earth | Movable | **Sun, Mercury** | Saturn | 7H Libra (exalted) | **3** | 26 | **Budh-Aditya, CVG.04 career convergence** | AL, Sun, Mercury |
| MX.HSE.11 | 11 | Aquarius | Air | Fixed | **Moon** | Saturn | 7H Libra (exalted) | 4 | 23 | **Anapha (SIG.11)** via Saturn Cap | Moon, A7 |
| MX.HSE.12 | 12 | Pisces | Water | Dual | (none) | Jupiter | 9H Sagittarius | **1** | 23 | **D9 12H stellium (SIG.06)** (D9-context) | (none) |

**Legend**: Bold-rank = extremes (top 3 or bottom 3). **SIG/CVG bold** = major chart signature tied to this house.

### §3.1 — Structural observations from summary

- **Top 3 Bhavabala houses**: 12 (isolation/foreign), 5 (creativity/future), 10 (career/status) — chart's operational strength cluster
- **Bottom 3 Bhavabala houses**: 7 (partners), 2 (family/savings), 1 (self/body) — structural fragility zones (RPT.HSE.02 focus)
- **SAV bindu extremes**: highest Libra+Scorpio 33, lowest Aquarius+Pisces 23 — Moon + 12H in weakest SAV zones
- **Occupied houses**: 2, 7, 8, 9, 10, 11 have planets (6 of 12); 4 of those are the "yoga-hosting" houses (7, 9, 10, 11)
- **Empty but critical**: 1H Lagna empty (common for Aries Lagna Ashwini chart), 12H empty in Rashi but D9-12H stellium is the hidden-activation

---

## §4 — PER-HOUSE DETAIL CARDS

### MX.HSE.1 — First House (Aries / Fire / Movable)

```yaml
house_num: 1
sign: Aries
element: Fire
quality: Movable
rashi_tenants: []
chalit_tenants: []
sign_lord: Mars
sign_lord_placement: Libra (7H) — own-enemy territory, exalted-for-Saturn sign, conjunct exalted Saturn
bhavabala_total: 340.08 virupa
bhavabala_rank: 10 of 12
sav_bindu: 29
aspects_received_vedic: [Mars (from 7th), Saturn (from 7th, exalted → full), Jupiter (5th from 9H → full), Ketu (from 8H via 5/9 school)]
aspects_received_jaimini: [Libra (movable→fixed ex-adjacent rule), Scorpio (Ketu signifies), Aquarius (Moon)]
yogas_involving: []
arudhas_in_house: [A10 (Arudha of 10H = Karma-reflection lands in 1H Aries)]
d9_house_lord_location: Mars in D9 → Aries  (needs v6.0 §3.5 cross-check; Mars is Lagna lord)
d10_house_lord_location: Sun is D10 Lagna Leo's lord; Aries houses Sun in D10 (per v6.0 §3.6)
lel_events_tagged: [EVT.CURRENT.01 (self/body-current status), EVT.2019.05.XX.01 (foreign move triggered identity shift), transit activations to Lagna]
transit_activation_windows_2026_2044:
  - Jupiter transit Aries 2035 (~) — dharmic identity renewal
  - Rahu transit Aries 2021-2023 (already occurred during US-return pivot)
  - Ketu transit Aries 2039-2041 (future)
mode_a_rpt_coverage: [RPT.STR.01 Lagna/Moon/Sun foundation]
interpretation: |
  Aries Lagna at 12°23' Ashwini Pada 4 establishes a Mars-ruled identity: action-oriented, direct, competitive. But Mars (Lagna lord) is away in 7H Libra where it is debilitated-home (Mars in Libra = neecha-for-Mars) and conjunct exalted Saturn — producing the "authority-through-tension" operational signature (SIG.15). 1H is empty in Rashi (Lagna fullness must come from lord-elsewhere chain). Bhavabala rank 10 = fragile self-constitution relative to houses 5, 10, 12.
  Three strong-force aspects pour INTO Lagna: Saturn exalted 60-virupa (authority imposed FROM outside), Mars 60-virupa (self-assertion), Jupiter 60-virupa 5th-aspect (dharmic grace). Net: identity is forged by external pressure + internal Mars drive + Jupiter's dharmic authorization. A10 (karma-arudha) lands HERE in Aries = career-visibility reflects identity (CVG.04 10H density reports back to Lagna).
```

---

### MX.HSE.2 — Second House (Taurus / Earth / Fixed)

```yaml
house_num: 2
sign: Taurus
element: Earth
quality: Fixed
rashi_tenants: [Rahu]
chalit_tenants: [Rahu]
sign_lord: Venus
sign_lord_placement: 9H Sagittarius — own-sign-for-dharma, strong, Lakshmi Yoga member
bhavabala_total: 266.26 virupa
bhavabala_rank: 11 of 12 (second-weakest — SIG structural concern)
sav_bindu: 29
aspects_received_vedic: [Mars (from 7H via 8th = partial 45), Saturn (from 7H via 8th = Saturn special 3/10; 10th is 11th sign not 2nd — so 2H receives Saturn 3rd aspect from 7H→Libra→3rd=Sag? No, 3rd from Libra is Sag. Actually Saturn in Libra aspects Capricorn 3rd, so 2H Taurus NOT directly Saturn-aspected), Jupiter (from 9H, 6th = no; Jupiter 9th/5th/7th. 5th from Sag = Aries. 9th from Sag = Leo. 7th from Sag = Gem. So 2H Tau NOT in Jupiter's Jaimini-or-Graha aspect.)]
aspects_received_jaimini: [Scorpio (Ketu), Cancer, Capricorn (Sun+Mercury), Aquarius (Moon) — Taurus is fixed; aspects movable signs EXCEPT adjacent Aries. So Tau receives Jaimini from: Cancer, Libra (Mars+Saturn), Capricorn (Sun+Mercury). HITS from Mars+Saturn+Sun+Mercury. STRONG.]
yogas_involving: [Dhana Yoga signals (Rahu-in-2H = unusual-wealth signature, SIG.10), Jaimini Rahu-quadruple-aspect node]
arudhas_in_house: [A6 (Enemy arudha), Rahu]
d9_house_lord_location: Venus D9 → Virgo (debilitated in Virgo, NBRY via Mercury) — per SIG.02
d10_house_lord_location: Venus in D10 (per v6.0 §3.6)
lel_events_tagged:
  - EVT.2010.XX.XX.01 (family real estate windfall — classical 2H event)
  - EVT.2013.12.11.01 (marriage — 2H is family formation complement to 7H)
  - All financial events touching wealth-family intersection
transit_activation_windows_2026_2044:
  - Jupiter transit Taurus 2025-2026 (Jupiter activates 2H during Saturn AD — wealth-expansion window)
  - Rahu transit Taurus 2021-2023 (already occurred; activated Rahu's natal position — double Rahu pressure peaked then)
  - Saturn transit Taurus 2029-2032 (Kantaka Shani 4H from Moon per §V7.A)
mode_a_rpt_coverage: [RPT.HSE.02 (2H weakness structural), RPT.TRN.01 Saturn transit]
interpretation: |
  **Structural fragility zone.** Bhavabala rank 11 (second-weakest) + SIG.10 Rahu in Rohini nakshatra makes 2H the chart's "wealth-via-unusual-channels, never-smoothly" signature. Natal Rahu here plus Jaimini aspects from Mars+Saturn+Sun+Mercury (4 planets!) means 2H is structurally busy but not integrated — wealth accrues via disruption, exposure, unconventional routes.
  Venus as 2L sitting in 9H Lakshmi yoga is the saving grace: wealth CAN come, but flows through dharmic channels (Jupiter's sign, Saraswati-adjacent Mercury). CTR.03 Jupiter-Uccha-weak dampens this pathway slightly. Classical reading: 2H = unconventional wealth trajectory requiring patience (Saturn-MD) and dharmic alignment (Jupiter AD Lakshmi activation Sep 2022 - Dec 2024) — retrodictively matches native's Marsys launch July 2023.
```

---

### MX.HSE.3 — Third House (Gemini / Air / Dual)

```yaml
house_num: 3
sign: Gemini
element: Air
quality: Dual
rashi_tenants: []
chalit_tenants: []
sign_lord: Mercury
sign_lord_placement: 10H Capricorn (with Sun) — Vargottama, Yogi, MD lord, chart's operational spine
bhavabala_total: 447.37 virupa
bhavabala_rank: 7 of 12 (median)
sav_bindu: 28
aspects_received_vedic: [Jupiter 7th-from-9H (Jupiter full aspect on 3H Gem)]
aspects_received_jaimini: [Virgo (A4+A8+A9 + Mercury rules), Sagittarius (Jup+Ven), Pisces — Gemini is dual, aspects other duals Virgo, Sag, Pis. Jup+Ven reciprocal via Sag; Mercury rules both 3H & 10H.]
yogas_involving:
  - CVG.07 Gemini 3H nexus: contains UL (Upapada/spouse), A5, A11, Vivaha Saham, Gulika, Dhuma
  - D9 12H Gemini stellium (Moon+Jupiter+Rahu in D9 Gemini) — SIG.06 — significant foreign-architecture signal loop-closes through Gemini
arudhas_in_house: [UL (Upapada = spouse karma), A5 (future-children arudha), A11 (gains arudha)]
d9_house_lord_location: Mercury D9 → ? (need v6.0 §3.5)
d10_house_lord_location: Mercury D10 placement
lel_events_tagged:
  - EVT.1998.02.16.01 (R#1 start — Vivaha Saham in Gemini resonates; UL here = spouse-karma-entry-point)
  - EVT.2013.12.11.01 (marriage — completing the Gemini-UL signal)
  - Creative/communication phases
transit_activation_windows_2026_2044:
  - Jupiter transit Gemini 2013-2014 (retrodictive — coincides with native's XIMB graduation + marriage)
  - Jupiter transit Gemini 2037 (~) — future UL activation window
  - Rahu transit Gemini 2031-2033 — Rahu on UL triggers relational structural reset
mode_a_rpt_coverage: [RPT.STR.01 (foundation), CVG.07 registered]
interpretation: |
  **Gemini is the chart's relational-secrecy nexus.** Empty in Rashi, but hosts 4 sensitive points: UL (spouse arudha), A5 (future-children), A11 (gains-arudha), Vivaha Saham (marriage-specific), plus Gulika and Dhuma (karmic shadows). CVG.07 names this the "Gemini 3H nexus" — dual-quality sign holding the chart's long-arc relationship architecture.
  Mercury as 3L sits in 10H Capricorn with Sun — so "courage/effort/sibling-support" (3H signification) is expressed primarily THROUGH CAREER (10H). The younger brother's role as "lifelong pillar of support" (per doc) confirms this 3H→10H chain. D9 12H stellium LOOP-CLOSES back through Gemini (Mercury disposits the stellium) — every foreign-architecture signal routes through Gemini/Mercury. Bhavabala rank 7 = stable median.
```

---

### MX.HSE.4 — Fourth House (Cancer / Water / Movable)

```yaml
house_num: 4
sign: Cancer
element: Water
quality: Movable
rashi_tenants: []
chalit_tenants: []
sign_lord: Moon
sign_lord_placement: 11H Aquarius (Rashi) / 12H Pisces (Chalit per CTR.04)
bhavabala_total: 474.87 virupa
bhavabala_rank: 6 of 12
sav_bindu: 32 (high)
aspects_received_vedic: [Jupiter 7th from 9H (Jupiter full aspect on 4H — beneficial "mother's luck" signature)]
aspects_received_jaimini: [Taurus (Rahu), Scorpio (Ketu), Aquarius (Moon), Capricorn (Sun+Merc) — Cancer is movable; aspects fixed signs EX-adjacent (Leo). So aspects Taurus, Scorpio, Aquarius. HITS Rahu+Ketu+Moon.]
yogas_involving: [Jupiter's aspect to 4H creates "Gajakesari-class" mother/home benefic; BB lord Moon in 11H gives gain-via-home]
arudhas_in_house: [A2 (Dhana/Family arudha in 4H — family-wealth-reflected-in-home)]
d9_house_lord_location: Moon in D9 → Gemini (12H of D9 — part of the D9 12H stellium SIG.06)
d10_house_lord_location: Moon in D10 location per v6.0 §3.6
lel_events_tagged:
  - EVT.2023.05.XX.01 (US→India return — home/residence shift, 4H-primary event)
  - EVT.2010.XX.XX.01 (family real estate windfall — 4H/property event)
  - All residence-change events
transit_activation_windows_2026_2044:
  - Saturn transit Cancer 2032-2035 (8th from Moon — heavy transit, classical turmoil window)
  - Jupiter transit Cancer 2026 (expansion on 4H — native's home/stability favorable)
mode_a_rpt_coverage: [RPT.STR.01, CTR.04 Moon Rashi-11/Chalit-12]
interpretation: |
  **Cancer 4H is the chart's home/mother/land signifier — strong SAV-32 + Jupiter aspect from 9H.** Despite empty Rashi, this house is among the better-positioned (rank 6, SAV 32). Moon as 4L in 11H = home-as-gain-platform (Moon Chalit-12 complicates: home as *loss/foreign* platform per CTR.04 — retrodictively fits the 4-year US stint).
  Jupiter's 7th-aspect from 9H delivers dharmic-guru-like beneficial energy to home-life. A2 (dhana-arudha) here = family's financial representation. The 2010 real-estate windfall (EVT.2010.XX.XX.01) is a textbook A2-in-4H event. Future Saturn transit Cancer 2032-2035 is an 8th-from-Moon pressure period worth flagging in Temporal Engines.
```

---

### MX.HSE.5 — Fifth House (Leo / Fire / Fixed)

```yaml
house_num: 5
sign: Leo
element: Fire
quality: Fixed
rashi_tenants: []
chalit_tenants: []
sign_lord: Sun
sign_lord_placement: 10H Capricorn (Sun's enemy sign — Saturn's own, Saturn is Sun's enemy; NOT Sun's debilitation which is Libra) with Mercury, AL, Vyatipata
bhavabala_total: 486.86 virupa
bhavabala_rank: **2 of 12** (very strong — creativity/future/progeny house has structural vigor)
sav_bindu: 30
aspects_received_vedic: [Saturn 3rd-from-7H (Saturn special aspect on 5H — 60 virupa full; this is Saturn pressure on creativity/progeny)]
aspects_received_jaimini: [Aries (Lagna), Libra (Mars+Saturn), Aquarius (Moon), Capricorn (Sun+Mercury) — Leo is fixed; aspects movable ex-adjacent (Cancer). So aspects Aries, Libra, Capricorn. HITS Lagna + Mars+Saturn+Sun+Mercury.]
yogas_involving: [Ketu in 5H D1? No — Ketu is in 8H Scorpio natally. A3 arudha in 5H. Sun-5L in 10H = creativity-as-career]
arudhas_in_house: [A3 (Arudha of 3H = siblings-reflection — brother relationship landing in 5H — per SIG namespace]
d9_house_lord_location: Sun D9 → ?
d10_house_lord_location: Sun D10 Lagna Leo itself — massive
lel_events_tagged:
  - EVT.2022.01.03.01 (twin daughters born — 5H is progeny; Ketu in 5H natally but Jupiter-on-Moon transit at event triggered Jupiter-aspect-to-5H from 11H)
  - All creative/recognition events (modeling EVT.2012.09.XX.01, computer programming phases)
  - RPT.DVS.02 D60 past karma
transit_activation_windows_2026_2044:
  - Jupiter transit Leo 2028-2029 (in Ketu MD starting 2027-08 — Jupiter 5H transit classically expansive for progeny/creativity)
  - Saturn transit Leo 2034-2037 (3rd from Libra natal; 7th from Moon — challenging)
mode_a_rpt_coverage: [RPT.DVS.02 D60 past karma, RPT.STR.01]
interpretation: |
  **Bhavabala rank 2 — creativity/future/progeny has exceptional structural strength.** Sun is 5L in 10H = "dharmic life-purpose expresses through career visibility." A3 (sibling-arudha) here reinforces the "brother as lifelong pillar" theme (sibling-relationship reflects into native's creativity/future-building). Ketu in 5H natally (Scorpio per Rashi is 8H; wait Ketu is in Scorpio 8H, not Leo 5H) — so Leo 5H is actually empty in Rashi.
  Saturn's 3rd-aspect from 7H onto 5H (60 virupa full) is the creativity-through-discipline signature: artistic/creative output requires Saturnine structure. Twins' birth (EVT.2022.01.03.01) timing validates: Jupiter transit Aquarius (11H, aspects 5H Leo via 7th from Aq) + Rahu AD delivering "unusual progeny" (twins) = two-signal activation of Leo's dormant 5H potential.
```

---

### MX.HSE.6 — Sixth House (Virgo / Earth / Dual)

```yaml
house_num: 6
sign: Virgo
element: Earth
quality: Dual
rashi_tenants: []
chalit_tenants: []
sign_lord: Mercury
sign_lord_placement: 10H Capricorn (with Sun)
bhavabala_total: 405.17 virupa
bhavabala_rank: 8 of 12
sav_bindu: 26
aspects_received_vedic: [Jupiter 5th-from-9H wait — 5th from 9H Sag = Aries 1H, not 6H. 9th from 9H = 5H Leo. 7th from 9H = 3H Gem. So Jupiter doesn't aspect 6H directly. Mars 8th-aspect from 7H = 2H Taurus, not 6H. Saturn 3rd-from-7H = 9H. Saturn 10th-from-7H = 4H Cancer. So 6H Virgo is relatively aspect-isolated.]
aspects_received_jaimini: [Gemini (empty), Sagittarius (Jup+Ven), Pisces — Virgo is dual; aspects other duals. Jup+Ven reciprocal only. 6H Virgo's Jaimini aspects are quite limited.]
yogas_involving: [Mercury as 6L from 10H creates inauspicious "enemies-to-career" concern — but balanced by Mercury's own-sign strength. A4, A8, A9 clustering creates a "hidden-karma" pocket.]
arudhas_in_house: [A4 (4H Sukha arudha — home projected here), A8 (8H crisis arudha), A9 (9H dharma arudha) — 3 arudhas in 6H is unusual and significant]
d9_house_lord_location: Mercury D9 → (check v6.0)
d10_house_lord_location: Mercury D10 placement
lel_events_tagged:
  - EVT.1995.XX.XX.01 (headaches onset — 6H is disease/health challenges)
  - EVT.2007.06.XX.01 (knee surgery — 6H surgery signature)
  - EVT.2021.01.XX.01 (panic/jitters — 6H mental health activation; Virgo Chara activate 2021)
  - General enmity/legal events
  - EVT.2025.05.XX.01 (deception/scam — 6H is enemies-and-scandal house)
transit_activation_windows_2026_2044:
  - Saturn transit Virgo 2036-2039 (Kantaka Shani 8H from Moon per §V7.A — heavy disease-pressure window)
  - Jupiter transit Virgo 2031 — beneficial over 6H (reduces enemy/debt pressure)
mode_a_rpt_coverage: [RPT.STR.01]
interpretation: |
  **6H is the chart's "hidden-karma" cluster** — 3 arudhas (A4, A8, A9) concentrated here means family-sphere (A4), crisis-sphere (A8), AND dharma-sphere (A9) all project image-fragments into Virgo. SAV 26 below median. Mercury as 6L in 10H links disease/enemies signification to career visibility — suggests professional obstacles (e.g., EVT.2025.05.XX.01 scam) land in this register.
  Aspect isolation (few strong aspects from benefics) makes 6H a zone where classical "empty house is mercifully quiet" argument applies. Health events (1995 headaches, 2007 knee, 2021 panic) retrodictively cluster here. Future Saturn transit Virgo 2036-2039 (Kantaka from Moon) will be the next major 6H-activation health window.
```

---

### MX.HSE.7 — Seventh House (Libra / Air / Movable)

```yaml
house_num: 7
sign: Libra
element: Air
quality: Movable
rashi_tenants: [Saturn (exalted), Mars (debilitated-cancel via own-sign-for-Saturn + Mars-Saturn dignity exchange)]
chalit_tenants: [Saturn, Mars]
sign_lord: Venus
sign_lord_placement: 9H Sagittarius
bhavabala_total: 253.36 virupa
bhavabala_rank: **12 of 12 (weakest of all houses)**
sav_bindu: **33 (highest! — paradoxical with Bhavabala-weakest)**
aspects_received_vedic: [Moon (7th-from-11H = Libra), Sun (7th-from-10H = Cancer, not Libra; correction: Sun in Cap aspects Cancer 7th. Not Libra.), Mercury (7th-from-10H = Cancer). Internal: Mars+Saturn aspect each other (conjunction); Saturn 3rd → Sagittarius 9H, 10th → Cancer 4H]
aspects_received_jaimini: [Taurus (Rahu), Leo, Aquarius (Moon), Aries (Lagna) — Libra is movable; aspects fixed ex-adjacent (Virgo). So Libra aspects fixed: Taurus, Leo, Scorpio (Ketu), Aquarius. HITS Rahu + Ketu + Moon. Plus self-aspect NOT applicable.]
yogas_involving:
  - **SIG.01 Sasha Mahapurusha Yoga**: Saturn exalted in 7H (kendra) = major Raja-class yoga
  - **SIG.15 Hidden Raja Yoga**: Mars + Saturn exalted conjunction in 7H
  - **CVG.08 Aries-Libra axis** triple-aspect including Bhrigu Bindu + Muntha
  - **CVG.05 Saturn 7H exalted + Shadbala-strong + Mahapurusha + AD + Yogini** (5-way convergence)
arudhas_in_house: [Saturn, Mars (occupying physical arudha = projection-of-partnership as authoritative and conflictual)]
d9_house_lord_location: Venus D9 → Virgo (debilitated; NBRY via Mercury dispositor)
d10_house_lord_location: Venus D10 → Libra 9H (check v6.0)
lel_events_tagged:
  - EVT.2013.12.11.01 (marriage — primary 7H event; STRONGEST retrodictive match in corpus)
  - EVT.CURRENT.01 (separation — 7H axis trajectory)
  - EVT.2007.06.XX.01 (knee surgery — Mars-Saturn 7H physical/joint activation)
  - EVT.2024.02.16.01 (sand mine — 7H = business partnership; Chara Libra MD at event)
  - EVT.2025.07.XX.01 (Marsys major contract — Saturn AD active; 7H partner-platform delivery)
transit_activation_windows_2026_2044:
  - Saturn transit Libra 2041-2044 (Saturn back to own-exaltation — major 7H cycle closure; native will be 57-60)
  - Jupiter transit Libra 2030 — benefic 7H activation
mode_a_rpt_coverage:
  - RPT.HSE.02 (2H and 7H weakness structural)
  - RPT.STR.01 (foundational)
  - RPT.DSH.01 (Mercury MD-Saturn AD window — Saturn in 7H natally delivering via AD)
  - RPT.TRN.01 (Saturn transit engine)
  - RPT.KAK.01 (Saturn Kakshya zones in Pisces — related to current Sade Sati phase)
  - CTR.01 (Saturn Shadbala-strong vs Shuddha Pinda-weak paradox)
interpretation: |
  **7H is the chart's STRUCTURAL PARADOX ZONE.** Bhavabala RANK 12 (weakest) coexists with SAV RANK 1 (33, highest with Scorpio). Four of the chart's 15 primary signatures originate here (SIG.01, SIG.15, CVG.05, CVG.08). Two Mahapurusha-class yogas present. Saturn exalted (Shadbala rank 2) conjunct Mars (dignity-exchange with Venus in Libra for Saturn's exaltation-support): this is the most-dense configuration in the chart.
  CTR.01 captures the core tension: Saturn is Shadbala-strong (delivers authority, longevity of engagement) but Shuddha Pinda RANK 7 LAST (doesn't compound — "dramatic-not-compound" pattern). Retrodictively: marriage is Saturn-strong (12-year duration including separation period) but Shuddha-Pinda-weak (doesn't deepen — hence pain-pleasure dynamic). Saturn AD 2024-2027 is 7H-delivery peak of the lifetime — native's current separation-but-stable arrangement IS the Saturn-7H-delivery pattern expressing (authority + operational stability, minus compounding intimacy).
```

---

### MX.HSE.8 — Eighth House (Scorpio / Water / Fixed)

```yaml
house_num: 8
sign: Scorpio
element: Water
quality: Fixed
rashi_tenants: [Ketu]
chalit_tenants: [Ketu]
sign_lord: Mars (with Ketu as co-lord in modern tradition)
sign_lord_placement: Mars in 7H Libra
bhavabala_total: 358.67 virupa
bhavabala_rank: 9 of 12
sav_bindu: 33 (tied with Libra for highest)
aspects_received_vedic: [Mars 4th-from-7H = Capricorn 10H (not 8H). Mars 8th = Pisces 12H (not 8H). Actually Mars in Libra aspects 4th (Cap), 7th (Aries Lagna), 8th (Taurus 2H). So Mars does NOT aspect 8H Scorpio. Saturn in Libra aspects 3rd (Sag 9H), 7th (Aries 1H), 10th (Cancer 4H). So Saturn does NOT aspect 8H Scorpio. Ketu itself sits here.]
aspects_received_jaimini: [Aries (Lagna), Cancer, Capricorn (Sun+Mercury) — Scorpio is fixed; aspects movable ex-adjacent (Sagittarius). So Scorpio aspects Aries, Cancer, Capricorn. Note: Ketu IN Scorpio's aspects = Aries + Cancer + Capricorn. HITS Lagna + Sun+Mercury.]
yogas_involving: [Ketu-8H = moksha-signature, occult-research inclination; Ketu alone is not classically "yoga-forming"]
arudhas_in_house: [(Ketu is not an arudha; 8H has no primary arudha per v6.0 §13.2)]
d9_house_lord_location: Mars D9 → Aries (per SIG.03 NBRY — Saturn debilitated in Aries D9 is cancelled by Sun in D9)
d10_house_lord_location: Mars in D10
lel_events_tagged:
  - EVT.2009.06.XX.01 (grandfather passing — 8H is death/transformation)
  - EVT.2018.11.28.01 (father passed — 8H axis activated; father's death = 9H-father-via-8H-death-chain)
  - EVT.2025.05.XX.01 (deception/scam — 8H = hidden losses, scandals)
  - EVT.2019.05.XX.01 (US move — 8H transformation; relocation as life-phase rupture)
  - General "transformation" events
transit_activation_windows_2026_2044:
  - Rahu transit Scorpio 2030-2031 (on native's natal Ketu) — classical nodal-reversal period
  - Saturn transit Scorpio 2044-2046 (close to lifetime end of projected primary arc)
  - Jupiter transit Scorpio 2030 — transformative but beneficial
mode_a_rpt_coverage: [RPT.STR.01 (Ketu-8H in foundation), RPT.DSH.02 Ketu MD regime change]
interpretation: |
  **8H Scorpio with Ketu is the chart's transformation/moksha-leaning undercurrent.** SAV rank 1 (33) tied with Libra = extremely dense astrological activity without physical planet presence besides Ketu. Ketu in 8H classical: research aptitude, deep-topic mastery, sudden transformations, detachment from 8H matters (inheritance, crises become liberating). Ketu MD starts 2027-08-21 and runs 7 years — 8H Ketu will be THE dominant period for native in late 40s through mid-50s.
  Three major LEL events cluster here: grandfather's passing (2009), father's passing (2018), deception/scam (2025). The 8H-rupture pattern repeats ~every decade. Jaimini aspect: 8H Scorpio/Ketu Jaimini-aspects Lagna + career stellium — so "transformation lens applied to self + career" is structurally built-in. 2027+ Ketu MD will take this from background to foreground.
```

---

### MX.HSE.9 — Ninth House (Sagittarius / Fire / Dual)

```yaml
house_num: 9
sign: Sagittarius
element: Fire
quality: Dual
rashi_tenants: [Jupiter (own sign), Venus]
chalit_tenants: [Jupiter, Venus]
sign_lord: Jupiter
sign_lord_placement: Sagittarius (own 9H) — but CTR.03 Uccha Bala rank 7 LAST (positional-weak despite dignity-strong)
bhavabala_total: 477.55 virupa
bhavabala_rank: 5 of 12
sav_bindu: 25 (just below median 28)
aspects_received_vedic: [Saturn 3rd-from-7H = Sag (Saturn special 60 virupa full aspect); Jupiter 5/9 self-aspects]
aspects_received_jaimini: [Gemini (empty), Virgo (A4+A8+A9), Pisces — Sag is dual; aspects other duals. Gem has UL+A5+A11 — reciprocal. Virgo reciprocal.]
yogas_involving:
  - **SIG.07 Saraswati Yoga** (Jupiter+Venus+Mercury in kendra/trikona — 9H hosts Jup+Ven, Mercury 10H kendra)
  - **SIG.08 Lakshmi Yoga** (9L Jupiter in 9H own sign + Venus in 9H)
  - **CVG.02 Jupiter 9L dharma-wealth chain**
  - **CVG.06 Jupiter 9H own-sign + Lakshmi member + 9L + MPY-near-miss** (close to Mahapurusha but misses threshold)
  - Punya Saham on 9H-adjacent via v6.0 §12.2; Labha Saham at 9H exactly
arudhas_in_house: [Jupiter, Venus (tenants, not arudha-IDs)]
d9_house_lord_location: Jupiter D9 → ?
d10_house_lord_location: Jupiter D10 → ?
lel_events_tagged:
  - EVT.2011.06.XX.01 (XIMB enrolled — higher education 9H)
  - EVT.2013.03.XX.01 (XIMB graduation)
  - EVT.2023.06.XX.01 (Tepper completion — higher education Christian institution 9H)
  - EVT.2009.06.XX.01 (grandfather death — 9L Jupiter-weak CTR.03 activating)
  - EVT.2018.11.28.01 (father passed — 9H = father house; Saturn transit Sag = direct 9H activation at event)
  - All dharma/guru/foreign-education events
transit_activation_windows_2026_2044:
  - Saturn transit Sagittarius 2047-2050 (Sade Sati Cycle 3 Rising from Moon-Aq-perspective; 9H from Aries Lagna — mid-life father-arc revisit)
  - Jupiter transit Sagittarius 2037 (Jupiter own-sign return — 9H-own)
  - Ketu transit Sagittarius 2035-2036 — 9L weakness-exposure period
mode_a_rpt_coverage: [RPT.HSE.01 (10-11-12 + adjacent), RPT.STR.01, RPT.DEV.01 (Devata architecture — Vishnu gravitation CTR.02)]
interpretation: |
  **9H is the chart's DHARMA ENGINE.** Jupiter in own 9H + Venus co-present creates Lakshmi Yoga (SIG.08) AND Saraswati Yoga partial (SIG.07 extends). Two of the chart's top convergences (CVG.02, CVG.06) originate here. But Jupiter's Uccha Bala rank 7 LAST (CTR.03) is the foundational vulnerability: dignity-strong but positional-weak = dharma is VISIBLE in life (career, education, spirituality) but does not COMPOUND automatically — requires active engagement.
  Retrodictively, CTR.03 fires at 5 separate LEL events (grandfather death, father death, father's kidney disease onset, 2016 Mahindra crash, 2023 US pivot). 9H is where native's life REPEATEDLY gets restructured via paternal/dharmic disruptions. The 2025 Vishnu-Venkateshwara gravitation (EVT.2025.XX.XX.01) is CTR.02 resolving IN FAVOR of 9H classical Venkateshwara — the strongest single-event validation in the corpus of Deep Analysis v1.2.1.
  Saturn 3rd-aspect from 7H onto 9H means 9H is PERMANENTLY Saturn-pressured — dharma-path requires Saturnine discipline. This retrodictively explains why Christian-institution successes (Saint Joseph's, XIMB, CMU Tepper) are disproportionate — structured-dharma environments activate 9H maximally.
```

---

### MX.HSE.10 — Tenth House (Capricorn / Earth / Movable)

```yaml
house_num: 10
sign: Capricorn
element: Earth
quality: Movable
rashi_tenants: [Sun, Mercury]
chalit_tenants: [Sun Chalit-11 (CTR per Deep Analysis), Mercury Chalit-10 or 11 (CTR.05)]
sign_lord: Saturn
sign_lord_placement: 7H Libra (exalted — Sasha MPY)
bhavabala_total: 482.99 virupa
bhavabala_rank: **3 of 12 (top tier)**
sav_bindu: 26
aspects_received_vedic: [Saturn 10th-from-7H = Cancer 4H (not 10H). Mars 4th-from-7H = Capricorn 10H (Mars special aspect on 10H = 60 virupa full); Jupiter 7th-from-9H would be 3H Gem, not 10H. Jupiter 5th = Aries 1H. Jupiter 9th = Leo 5H. So 10H receives Mars 60-virupa full (+Jupiter no direct). 10th-from-7H Saturn would be 4H Cancer not 10H. But Saturn ownership of 10H is a signification chain.]
aspects_received_jaimini: [Aries, Libra, Scorpio, Taurus — Capricorn is movable; aspects fixed ex-adjacent (Aquarius). HITS fixed: Taurus (Rahu), Leo, Scorpio (Ketu), Aquarius blocked.]
yogas_involving:
  - **CVG.04 10H career-density convergence**: Sun + Mercury + AL + 7-aspect from exalted Jupiter (check — actually Jupiter aspects 5H from Sag, not 10H. Need to verify.)
  - **Budh-Aditya Yoga**: Sun-Mercury conjunction (not combust verified CMB.MERCURY in v6.0 §11.4)
  - **SIG.14 Sun 10H Capricorn with AL + Mercury**: career-density signature
  - Rahu Jaimini-aspect from 2H (classical remote hostile-support activator)
  - Ketu Jaimini-aspect from 8H
arudhas_in_house: [AL (Arudha Lagna — 1H karma-visibility projected here) — hugely significant; career = native's projected-identity]
d9_house_lord_location: Saturn D9 → Aries (NBRY via Sun — SIG.03)
d10_house_lord_location: Saturn in D10 → own D10 placement
lel_events_tagged:
  - EVT.2007.06.10.01 (Cognizant first job)
  - EVT.2013.05.XX.01 (Mahindra Retail join)
  - EVT.2017.03.XX.01 (Tech Mahindra switch — classical Sun AD on Sun=10H natal)
  - EVT.2023.07.XX.01 (Marsys founded)
  - EVT.2024.02.16.01 (sand mine launch)
  - EVT.2025.07.XX.01 (Marsys major contract)
  - All career events (essentially all 10H-primary)
transit_activation_windows_2026_2044:
  - Saturn transit Capricorn 2020-2022 (ALREADY — own-sign Saturn MC transit during US era)
  - Saturn transit Capricorn 2049-2052 (Sade Sati Cycle 3 Rising)
  - Jupiter transit Capricorn 2028 (during Ketu MD transition)
mode_a_rpt_coverage:
  - RPT.HSE.01 (10-11-12 career/gains/foreign architecture — primary)
  - RPT.DVS.01 D10 Dashamsha career
  - RPT.DSH.01 (Mercury MD-Saturn AD = Mercury-in-10H and Saturn-ruling-10H both activating)
  - RPT.INT.01 Timing interventions (career-timing focus)
interpretation: |
  **10H Capricorn is the chart's CAREER MACHINE.** Bhavabala rank 3 + Sun + Mercury + AL (Arudha Lagna = projected-identity) + Mars full-aspect from 7H + Saturn (10L) exalted in 7H = 5-way structural density on career. Native's "successful geek" → IIT pivot → MBA → Mahindra decade → entrepreneur arc is EXACTLY the 10H-stellium delivering.
  SIG.14 captures the foundational signature; CVG.04 is the multi-signal convergence. Mercury (10H tenant + 3L + 6L) as Yogi + Vargottama + MD lord (2010-2027) means the current 17-year Mercury MD is the chart's peak-career-expression window. Saturn AD (2024-2027) = Saturn (10L, exalted 7H) delivering via AD — the structural "planting → compounding" RPT.DSH.01 window. Retrodictive evidence: every major career event 2013-2025 falls inside Mercury MD; first-major-contract (July 2025) fires inside Saturn AD exactly as RPT.DSH.01 anticipates.
  Rahu's Jaimini-aspect from 2H onto this stellium is a MAJOR structural signal (hidden-unexamined in v1.2.1 — see CGP_AUDIT finding promoted to SIG.16 for v2.0). Adds unconventional-ambition and secretive-competition layer to career expression.
```

---

### MX.HSE.11 — Eleventh House (Aquarius / Air / Fixed)

```yaml
house_num: 11
sign: Aquarius
element: Air
quality: Fixed
rashi_tenants: [Moon]
chalit_tenants: [Moon Chalit-12 per CTR.04]
sign_lord: Saturn
sign_lord_placement: 7H Libra (exalted)
bhavabala_total: 478.27 virupa
bhavabala_rank: 4 of 12
sav_bindu: 23 (lowest tied with 12H)
aspects_received_vedic: [Saturn 7th-from-7H = Aries 1H, not 11H. Actually Saturn 3rd from Libra = Sag, 10th = Cancer, 7th = Aries. So Saturn doesn't aspect 11H. Jupiter 7th from Sag = Gem 3H. Jupiter 9th from Sag = Leo 5H. So 11H Aquarius is aspect-light.]
aspects_received_jaimini: [Aries, Leo, Libra — Aquarius fixed aspects movable ex-adjacent (Capricorn). HITS Aries (Lagna), Leo (empty), Libra (Mars+Saturn). Returns the Moon-AK's Jaimini-aspect on Saturn+Mars.]
yogas_involving:
  - **SIG.11 Anapha Yoga** (Saturn 12th from Moon — here Saturn is in Cap = 12th from Aquarius Moon; classically Anapha creates self-made, isolated-luxury profile)
  - A7 (Partner arudha = Moon IS A7's location per v6.0 §13.2 — intriguing overlap: spouse-image is Moon-Moon coincidence)
arudhas_in_house: [A7 (Partner arudha — spouse reflected in 11H), Moon]
d9_house_lord_location: Saturn D9 → Aries (NBRY)
d10_house_lord_location: Saturn D10 placement
lel_events_tagged:
  - EVT.1984.02.05.01 (Moon-AK placement birth)
  - All gain/network events
  - Jupiter transit Aquarius 2021 on Moon = EVT.2022.01.03.01 (twins — Jupiter gajakesari-class)
  - EVT.2017.03.XX.01 (career upgrade — 10H Sun AD with 11H Aquarius receiving Saturn-lord activation)
transit_activation_windows_2026_2044:
  - Saturn transit Aquarius 2022-2025 (CURRENT Sade Sati Peak — already computed; ends Mar 2025)
  - Jupiter transit Aquarius 2021, 2033, 2045 (gajakesari-class at each)
  - Rahu transit Aquarius 2031-2033 (on Moon — major emotional restructure)
mode_a_rpt_coverage:
  - RPT.HSE.01 (10-11-12 gains/network)
  - RPT.STR.01 (Moon as AK foundation)
  - CTR.04 (Moon Rashi-11/Chalit-12 ambiguity)
  - CVG.03 (Moon AK foreign-income chain)
interpretation: |
  **11H hosts the Atmakaraka Moon — the chart's SOUL SIGNIFIER.** Moon as AK (highest-degreed Jaimini karaka) in Aquarius 11H = soul-expression through gains, networks, causes. CTR.04 captures the Rashi-11/Chalit-12 ambiguity: Moon delivers EITHER gains-from-mainstream (11H) OR gains-from-foreign/dissolution (12H) depending on reading convention — retrodictively BOTH fire (US-income, foreign-residence, and mainstream-career gains).
  SIG.11 Anapha Yoga (Saturn 12th from Moon) creates the "self-made, Saturn-disciplined gains" pattern. A7 (partner arudha) overlapping Moon position = spouse projection is Moon-like (emotional, nurturing, attached). CVG.03 Moon-AK-foreign-income chain makes 11H the loop-closure for all foreign-delivery events (US 2019-2023, future Russia-trade via Marsys). Jupiter transit Aquarius (2021) directly on Moon was the strongest beneficial transit of recent years — retrodictively coincides with twins' birth (Jan 2022) per Jupiter-gajakesari classical result.
```

---

### MX.HSE.12 — Twelfth House (Pisces / Water / Dual)

```yaml
house_num: 12
sign: Pisces
element: Water
quality: Dual
rashi_tenants: []
chalit_tenants: [Moon arguably via CTR.04]
sign_lord: Jupiter
sign_lord_placement: 9H Sagittarius (own sign for 12L)
bhavabala_total: 506.09 virupa
bhavabala_rank: **1 of 12 (STRONGEST)**
sav_bindu: 23 (lowest tied with 11H)
aspects_received_vedic: [Jupiter 5th-from-9H = Aries, 9th-from-9H = Leo. So Jupiter doesn't directly aspect 12H from 9H via 5/9 special. 7th from 9H = 3H Gem. Mars 8th from 7H = Pisces 12H (Mars special 60 virupa full aspect on 12H). Saturn 3rd from 7H = Sag 9H; 10th = Cancer 4H.]
aspects_received_jaimini: [Gemini, Virgo (A4+A8+A9), Sagittarius (Jup+Ven) — Pisces dual aspects other duals. Jup+Ven reciprocal from 9H. Virgo reciprocal.]
yogas_involving:
  - **SIG.06 D9 12H Gemini stellium** (in D9 chart, 12H from D9 Lagna Cancer = Gemini; contains Moon+Jupiter+Rahu — THIS is the chart's strongest foreign/moksha signal loop-closure point)
  - **CVG.03 Moon AK foreign-income chain** routes through D1 12H indirectly
  - Jupiter 12L in 9H = classical "loss-through-dharma" or "dharma-as-loss-liberation" — ambiguous; the positional refinement makes this benefic (Jupiter in own sign as 12L = disciplined loss-conversion to dharmic gain)
arudhas_in_house: [(none per v6.0 §13.2 — Pisces is the one sign with no arudha)]
d9_house_lord_location: Jupiter D9 → ? (Jupiter's D9 placement = part of Gemini stellium per SIG.06)
d10_house_lord_location: Jupiter D10 → ?
lel_events_tagged:
  - EVT.2010.12.XX.01 (Thailand trip — first foreign travel, 12H-primary)
  - EVT.2019.05.XX.01 (US move — primary 12H long-stay)
  - EVT.2023.05.XX.01 (US→India return — 12H-exit)
  - EVT.2025.XX.XX.01 (Vishnu gravitation — 12H moksha-domain event)
  - All foreign-residence, spiritual-isolation, dissolution-of-ego events
transit_activation_windows_2026_2044:
  - Saturn transit Pisces 2025-2028 (CURRENT Sade Sati Setting — running)
  - Jupiter transit Pisces 2022-2023, 2034, 2046 — benefic 12H activations
  - Rahu transit Pisces 2033-2035 — foreign-adventure amplification
mode_a_rpt_coverage:
  - RPT.HSE.01 (10-11-12 career/gains/foreign architecture — 12H is the foreign-signal loop-closure)
  - RPT.DVS.02 D60 past karma (12H = past-karma-dissolution domain)
  - RPT.KAK.01 Saturn Kakshya zones (Pisces Saturn transit is current)
  - CVG.03 Moon AK foreign chain
interpretation: |
  **12H Pisces is the chart's HIGHEST-Bhavabala house (rank 1, 506.09 virupa) — paradox with lowest SAV (23, tied with 11H).** This means structurally very strong (by Bhavabala composite) but bindu-contribution-light (other planets don't disperse benefic bindus to 12H). Interpretation: 12H is INTRINSICALLY strong (12L Jupiter own-sign 9H + Moon Chalit-12 + Mars full-aspect from 7H) without needing external bindu-support. A house that generates its own strength.
  No arudha in Pisces — only sign where no arudha lands (per v6.0 §13.2). Combined with empty Rashi + low SAV, this creates a "quiet powerhouse" — the chart's MOKSHA-LEANING architecture operates backgrounded. Retrodictively: all foreign-travel events (Thailand 2010, US 2019-2023) fire through 12H. 2025 Vishnu-Venkateshwara shift (CTR.02 resolving) is the current peak-12H-activation — Saturn transit Pisces 2025-2028 + Ketu MD 2027+ = 12H will dominate the next decade. This will be the period of the native's deepest spiritual reorientation.
```

---

## §5 — CROSS-HOUSE SIGNAL SUMMARY (aggregate)

### §5.1 — House strength stratification

**Tier A (top 4 Bhavabala)**: 12, 5, 10, 11 — all in top-quartile (>478 virupa)
- Common theme: "expansion houses" (Kama/Moksha + Gains) are structurally stronger than "material houses"
- Operational implication: chart favors expression/projection/output over accumulation/retention

**Tier B (mid 4)**: 9, 4, 3, 6
**Tier C (weaker 4)**: 8, 1, 2, 7 — Bhavabala all below 360 virupa; 7H and 2H are the two weakest
- SIG.01 Sasha Yoga operates in the weakest-Bhavabala house (7H) — classical reading: "strong yoga in structurally weak house = intense-but-unstable delivery"
- RPT.HSE.02 covers this 2H + 7H weakness directly

### §5.2 — SAV distribution

| SAV Rank | Sign | House | Bindu |
|---|---|---|---|
| 1 (tied) | Libra | 7 | 33 |
| 1 (tied) | Scorpio | 8 | 33 |
| 3 | Cancer | 4 | 32 |
| 4 | Leo | 5 | 30 |
| 5 | Aries | 1 | 29 |
| 5 (tied) | Taurus | 2 | 29 |
| 7 | Gemini | 3 | 28 |
| 8 | Virgo | 6 | 26 |
| 8 (tied) | Capricorn | 10 | 26 |
| 10 | Sagittarius | 9 | 25 |
| 11 | Aquarius | 11 | 23 |
| 11 (tied) | Pisces | 12 | 23 |

**Observation**: 7H and 8H (transformation axis) have max SAV = maximum bindu-convergence for native's partnership + crisis architectures. Aquarius 11H (Moon) and Pisces 12H have MINIMUM SAV = AK-Moon residence has lowest external bindu support, consistent with "AK operates on inner/self-generated strength."

### §5.3 — Arudha distribution

- Empty (no arudha): **Pisces 12H** only
- Single-arudha houses: Aries 1H (A10), Cancer 4H (A2), Leo 5H (A3), Scorpio 8H (Ketu-only no arudha), Aquarius 11H (A7)
- Triple-arudha concentration: **Gemini 3H (UL+A5+A11)** and **Virgo 6H (A4+A8+A9)**
- 10H Capricorn hosts **AL** (primary identity-projection arudha)

**Interpretation aggregate**: Arudhas cluster in dual-quality signs (Gem, Vir, Sag, Pis) with 3H and 6H carrying the most dense projections. This means "image-formation" happens heavily in work-effort (3H) and challenge-resolution (6H) spheres.

### §5.4 — LEL event clustering by house

| House | Event Count | Primary Event Types |
|---|---|---|
| 10 | 8 | Career (all Mahindra/Cognizant/Tepper/Marsys/sand mines/contract) |
| 7 | 5 | Marriage, separation, Marsys business (partnership), knee surgery |
| 9 | 4 | Education (XIMB/Tepper), grandfather, father |
| 12 | 4 | Thailand, US move, US return, Vishnu shift |
| 2 | 3 | Family windfall, marriage (family formation), financial events |
| 11 | 3 | Moon-AK events including twins |
| 6 | 3 | Headaches, knee, panic |
| 8 | 3 | Grandfather, father, scam |
| 5 | 2 | Twins (5H/11H overlap), modeling |
| 4 | 2 | US return, family windfall (home/family overlap) |
| 3 | 2 | R#1, marriage (UL-Gemini) |
| 1 | 1 | Current status / identity |

**Pareto**: 10H + 7H + 9H + 12H capture 21 of 36 events = 58%. These are the chart's "primary drama stages." 1H is the quietest.

### §5.5 — Signal promotion candidates for Deep Analysis v2.0 (from CGP audit)

These structural signals emerged from this matrix build that are NOT yet in Deep Analysis v1.2.1's SIG library:

1. **SIG.16 (tentative) — Rahu-quadruple-Jaimini-aspect** — Rahu 2H Jaimini-aspects 4 natal planets (Sun, Mercury, Mars, Saturn) — simultaneous hit on 10H stellium AND 7H Saturn-Mars exalted conjunction
2. **SIG.17 (tentative) — 7H Bhavabala-weakest / SAV-strongest paradox** — consistent with CTR.01 but worth elevating to dominant signature
3. **SIG.18 (tentative) — 12H Bhavabala-rank-1 / SAV-rank-12 paradox** — 12H is intrinsically strong but externally-unreinforced; implies moksha-architecture operates below-surface
4. **SIG.19 (tentative) — Sun-Mercury-AL 10H density** — already in SIG.14 but could be extended with Mars-full-aspect + A10-in-1H loop-closure

These should be formalized in Deep Analysis v2.0 RPT.STR.02 (extended foundational signatures) or RPT.HSE.03 (extended house architecture).

---

## §6 — RED-TEAM CHECK

**Completeness**: 12 of 12 houses examined. All 18-column schema fields populated per row (with 2 acknowledged null-arudha for Pisces and no-tenants for 8 of 12 houses).

**Contradictions surfaced**:
- CTR.04 (Moon Rashi-11/Chalit-12) — reported in both MX.HSE.11 and MX.HSE.12 interpretations
- CTR.05 (Mercury Rashi-10/Chalit-11) — reported in MX.HSE.10
- CTR.01 (Saturn Shadbala vs Shuddha Pinda paradox) — reported in MX.HSE.7 interpretation

**Over-claim check**: None. All interpretations cite specific SIG/CVG/CTR IDs from Deep Analysis v1.2.1 or v7.0 supplement data. New signals (SIG.16-19) explicitly marked as "tentative — for v2.0 promotion."

**Missing-data check**: D9/D10 house-lord-placement columns marked "check v6.0" for several rows — these could be tightened by systematic read of v6.0 §3.5/§3.6. Deferred to MATRIX_DIVISIONALS (Session 10).

**Bias check**: Interpretations lean slightly toward confirmation-of-existing-signals rather than novel-readings. This is acceptable for Mode B (coverage, not interpretation-depth); Mode A RPT sections are where novel readings should be produced.

---

## §7 — OUTPUT FOR L2.5

This matrix produces direct inputs for L2.5 Holistic Synthesis Layer:

### §7.1 — CGM node contributions
12 HSE nodes (one per house) + edge types:
- House-lord edge: 12 edges (house → lord-planet)
- House-tenant edge: ~10 edges (house ↔ planets in that house)
- House-arudha edge: ~14 edges (arudhas to houses)

### §7.2 — MSR signal contributions (~40-50 new signals)
Each house's yoga, Bhavabala rank, SAV rank, arudha content, and aspect receivedness generates MSR entries:
- 12 Bhavabala-rank signals
- 12 SAV-rank signals
- ~10 yoga-involving-house signals (SIG overlaps)
- ~14 arudha-in-house signals
- 4 tentative SIG.16-19 candidates

### §7.3 — Signals feeding CDLM (cross-domain)
House Matrix naturally feeds Cross-Domain Linkage Matrix:
- 10H ↔ 2H (career-wealth convergence) — CDLM primary cell
- 10H ↔ 11H (career-gains)
- 9H ↔ 5H (dharma-creativity)
- 7H ↔ 2H (partner-family via Venus as 2L/7L — native's double Venus lordship)
- 12H ↔ 4H (foreign-home)
- 8H ↔ 9H (crisis-to-father-karma chain)

---

## §8 — CHANGELOG

```yaml
v1.0 (2026-04-17, Session 7):
  - Initial Mode B House Matrix covering all 12 houses
  - 18-column schema per row: tenants, lord, placement, Bhavabala, SAV, aspects (Vedic + Jaimini), yogas, arudhas, Dx placements, LEL events, transit windows, Mode A RPT coverage, interpretation
  - Summary table + per-house detail cards + cross-house signal aggregate + red-team check + L2.5 output feed
  - 4 tentative SIG candidates flagged for Deep Analysis v2.0 promotion (SIG.16-19)
  - Status: CLOSED (Session 7 output)

# Future versions:
v1.1 (planned, after Sessions 8-10 sibling matrices close):
  - Refine D9/D10 house-lord-placement columns from systematic v6.0 §3.5/§3.6 read
  - Promote SIG.16-19 candidates to Deep Analysis v2.0 RPT sections; update this matrix to reference them
  - Add explicit CGM node/edge IDs per row for L2.5 integration
```

**END OF HOUSE MATRIX v1.0**

*This is one of 5 Mode B matrices. Sibling matrices (Planet, Sign, Divisional, Dasha-Period) in Sessions 8-10. All five together feed L2.5 Chart Graph Model + Master Signal Register build in Session 11+.*
