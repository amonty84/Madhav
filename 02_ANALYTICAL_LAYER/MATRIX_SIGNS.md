---
document: L2 MODE B — SIGN MATRIX
project: MARSYS-JIS
layer: L2 (Analytical Layer, Mode B — Exhaustive Coverage)
artifact_id: MATRIX_SIGNS_v1_0
version: 1.0
status: CLOSED (Session 9 output)
sibling_files: MATRIX_HOUSES (done), MATRIX_PLANETS (done), MATRIX_DIVISIONALS (same session)
source_layer: L1 Facts (v6.0 §2.2 + §6.4 + §7.2 + §11.* + §23.2 + v7.0 supplement §V7.A + CGP audit §3.3 Jaimini matrix)
design_note: Sign Matrix for Aries-Lagna native has 1:1 sign-to-house mapping — heavy overlap with MATRIX_HOUSES.md. This matrix intentionally focuses on SIGN-CENTRIC properties (quality, element, dignity-hosting, transit-density) rather than repeating house-level analysis.
outputs_feed_to: L2.5 CGM (12 SGN nodes) and MSR (~40 sign-specific signals)
---

# SIGN MATRIX — L2 Mode B

## §1 — META

### §1.1 — What's different from MATRIX_HOUSES

For Aries-Lagna native, each sign = exactly one house (Aries=1H, Taurus=2H, etc.). MATRIX_HOUSES covers the house-centric view. This Sign Matrix covers the sign-as-sign aspects: element/quality, dignity-hosting (which planets are exalted/debilitated IN this sign), Jaimini aspect position, transit-density over next 18 years, and sign-specific yoga contributions.

### §1.2 — Schema (per row)

```yaml
MX.SGN.[sign]:
  house_equiv: 1..12
  element: [Fire | Earth | Air | Water]
  quality: [Movable | Fixed | Dual]
  ruler: [sign lord]
  exaltation_debilitation_host:
    exalt_for: [planet exalted here classically]
    debil_for: [planet debilitated here classically]
  rashi_tenants: [planets in this sign per §2.2]
  sav_bindu: [from §7.2]
  jaimini_aspects_cast: [signs this sign aspects per CGP audit §3.3]
  jaimini_aspects_received: [signs that aspect this sign]
  yogas_hosted: [yogas with members in this sign]
  arudhas_landing_here: [from §13.2]
  transit_density_2026_2044: [major slow-planet transits through this sign]
  dignity_events_in_transit: [planets exalting/debilitating when transiting this sign]
  lel_events_touching_sign: [from LEL v1.2]
  interpretation: [1-2 paragraph synthesis]
```

---

## §2 — SUMMARY TABLE

| Sign | House | Elem | Qual | Ruler | Exalt/Debil | Tenants | SAV | Jaimini Aspects To | Major 2026-2044 Transits |
|---|---|---|---|---|---|---|---|---|---|
| Aries | 1 | Fire | Mov | Mars | Sun ex / Saturn deb | (none) | 29 | Leo, Sco, Aqu | Jupiter 2035; Rahu 2021-23 (past); Ketu 2039-41 |
| Taurus | 2 | Earth | Fix | Venus | Moon ex / **Rahu ex** / Ketu deb | **Rahu (exalted!)** | 29 | Cnc, Lib, Cap | Saturn Kantaka 2029-32; Rahu return 2040; Jupiter 2025 |
| Gemini | 3 | Air | Dual | Mercury | — | (none) | 28 | Vir, Sag, Pis | Jupiter 2013 (past); 2037 next; Rahu 2031-33 |
| Cancer | 4 | Water | Mov | Moon | Jupiter ex / Mars deb | (none) | 32 | Tau, Sco, Aqu | Jupiter 2026 (strong); Saturn 2032-35; Rahu 2027-29 |
| Leo | 5 | Fire | Fix | Sun | — | (none) | 30 | Ari, Lib, Cap | Saturn 2034-37; Jupiter 2028-29; Ketu 2027-29 |
| Virgo | 6 | Earth | Dual | Mercury | Mercury ex / Venus deb | (none) | 26 | Gem, Sag, Pis | Saturn Kantaka 2036-39; Jupiter 2031 |
| Libra | 7 | Air | Mov | Venus | **Saturn ex (native!)** / Sun deb | **Saturn (exalted), Mars** | 33 | Tau, Leo, Aqu | **Saturn own-exaltation 2041-44**; Jupiter 2030 |
| Scorpio | 8 | Water | Fix | Mars | **Ketu ex (native!)** / Moon deb / **Rahu deb** | **Ketu (exalted)** | 33 | Ari, Cnc, Cap | Rahu on Ketu 2030-31; Jupiter 2030; Saturn 2044 |
| Sag | 9 | Fire | Dual | Jupiter | — | **Jupiter (own), Venus** | 25 | Gem, Vir, Pis | Jupiter own 2031-32, 2043-44; Saturn 2047-50 |
| Capricorn | 10 | Earth | Mov | Saturn | Mars ex / Jupiter deb | **Sun (enemy's sign — NOT debilitated), Mercury (Vargottama)** | 26 | Tau, Leo, Sco | Saturn Rising 2049-52; Jupiter 2028 |
| Aquarius | 11 | Air | Fix | Saturn | — | **Moon (AK!)** | 23 | Ari, Cnc, Lib | Saturn Peak 2022-25 (ending); Jupiter 2033/2045 gajakesari |
| Pisces | 12 | Water | Dual | Jupiter | Venus ex / Mercury deb | (none) | 23 | Gem, Vir, Sag | **Saturn Setting 2025-28 (CURRENT)**; Jupiter 2034 |

### §2.1 — High-salience dignity overlaps for native

**EXALTED-PLACEMENT SIGNS IN NATIVE'S CHART**:
- **Saturn in Libra (7H)**: Exalted at 22°27' (near-maximum 59.18 Uccha Bala) — chart's primary Mahapurusha yoga engine
- **Rahu in Taurus (2H)**: Traditionally exalted; combined with SIG.10 Rohini + SIG.16 Jaimini quadruple-aspect = chart's most-active wealth-via-unconventional signal
- **Ketu in Scorpio (8H)**: Traditionally exalted; 8H Ketu = moksha architecture; upcoming Ketu MD 2027-2034 runs with exalted Ketu

**DEBILITATED-PLACEMENT SIGNS IN NATIVE'S CHART**:
- **Sun in Capricorn (10H)**: Enemy's sign (Saturn's own; Saturn is Sun's enemy). NOT debilitated (Sun debilitates in Libra). Strengthened by 10H Kendra (max Dig Bala 60 virupa) + Vargottama Mercury + AL co-location (SIG.14). Classical reading: Sun operates in Saturn's territory — expresses through structured/hierarchical/disciplined forms rather than autonomous-creative.
- **Mars in Libra (7H)**: Debilitated (Mars's own-enemy Libra); but conjunct exalted Saturn = dignity-exchange, SIG.15 Hidden Raja. Dignity-paradox compensated by yoga-formation.

**Both Rahu and Ketu are EXALTED in native's chart** — unusual. The nodal-axis (2H-Taurus / 8H-Scorpio) carries maximum-nodal-amplification possible. This is why:
- SIG.10 Rahu-2H fires strongly
- 8H Ketu-Scorpio moksha signature is structurally amplified
- Ketu MD 2027-2034 will deliver exalted-Ketu regime change

---

## §3 — PER-SIGN DETAIL

### MX.SGN.ARIES (House 1 — Lagna)

```yaml
house_equiv: 1 (Lagna)
element: Fire
quality: Movable
ruler: Mars
exalt_for: Sun
debil_for: Saturn (cancelled in D9 via NBRY — SIG.03)
rashi_tenants: []
sav_bindu: 29
jaimini_aspects_cast: [Leo, Scorpio, Aquarius]  # Aries (movable) → fixed ex-adjacent Taurus
jaimini_aspects_received: [Taurus (Rahu), Leo (A3), Aquarius (Moon), Capricorn (Sun+Mercury) — receives from movable fixed-quality ex-adjacent rule perspective; specifically receives from fixed ex-adjacent Taurus. Hmm — cross-check: the Jaimini matrix row for Aries shows aspects TO Leo+Sco+Aqu. Signs aspecting ARIES include Taurus-as-fixed-aspects-movable-ex-adj (Taurus's adjacent movable = Aries, so Taurus does NOT aspect Aries). Correction: Aries receives from Leo (F aspects M-ex-adj), Scorpio (F aspects M ex-Sag), Aquarius (F aspects M). So 3 fixed signs aspect Aries.]
yogas_hosted: [A10 arudha lands here; Saturn NBRY D9 cancellation happens via Sun exaltation here]
arudhas_landing_here: [A10]
transit_density_2026_2044:
  - Rahu transit Aries 2021-2023 (past — during US pivot prep)
  - Jupiter transit Aries 2035 (future)
  - Ketu transit Aries 2039-2041 (future — Venus MD-Saturn AD era)
  - Mars Aries-return ~every 2 years
dignity_events_in_transit:
  - When Sun transits Aries (exalted) each year around mid-Apr to mid-May: brief but annual peak for Sun-significations (career, father, self)
  - When Saturn transits Aries (debilitated) ~2028-2030 and 2058-2060: structural stress on Lagna; note per CGP V7.A Cycle 2 transitions
lel_events_touching_sign:
  - EVT.1984.02.05.01 (birth — Lagna Aries)
  - EVT.CURRENT.01 (self/identity current state)
  - All Mars-return events annually
  - 2021-2023 Rahu-in-Aries overlapping EVT.2021-2023 US-pivot cluster
interpretation: |
  Aries empty in Rashi (Mars Lagna lord is in 7H Libra). Aries is the chart's "self-projection spotlight" — any Sun transit through Aries (annually) gives short peak for identity-expression. Upcoming Jupiter transit Aries 2035 is a major dharmic-renewal-of-self window — native will be 51. Ketu transit 2039-2041 brings identity-dissolution/reorientation — aligns roughly with Venus MD's later years.
  Saturn debilitates in Aries classically — but NBRY via Sun (D9 cancellation SIG.03) means debilitation-consequences are mitigated. Transit-Saturn-in-Aries ~2058-2060 (late life) would trigger the raw NBRY dynamics — worth watching in Temporal Engine heatmaps.
```

### MX.SGN.TAURUS (House 2 — Family/Savings)

```yaml
house_equiv: 2
element: Earth
quality: Fixed
ruler: Venus
exalt_for: [Moon, Rahu]
debil_for: Ketu
rashi_tenants: [Rahu]
sav_bindu: 29
jaimini_aspects_cast: [Cancer, Libra (Mars+Saturn), Capricorn (Sun+Mercury)]
jaimini_aspects_received: [Leo, Scorpio (Ketu), Aquarius (Moon)]
yogas_hosted: [SIG.10 Rahu-2H-Rohini; A6 arudha]
arudhas_landing_here: [A6, Rahu]
transit_density_2026_2044:
  - Saturn Kantaka Taurus 2029-2032 (per §V7.A — 4H from Moon = Dhaiya)
  - Jupiter transit Taurus 2025-2026 (current/imminent — expansion 2H)
  - Rahu return Taurus ~2040 (age 56)
dignity_events_in_transit:
  - When Jupiter transits Taurus (debilitates? No, Jupiter is neutral in Taurus). No major dignity inversion.
  - When Mars transits Taurus: neutral position; note conjunction with natal Rahu when applicable
  - Moon's monthly transit Taurus = brief Moon-exalted window + Rahu-conjunction trigger
lel_events_touching_sign:
  - EVT.2010.XX.XX.01 (family real estate windfall — 2H event via A6 arudha or Rahu)
  - EVT.2013.12.11.01 (marriage — family formation; 2H-Venus-7L link)
  - 2H financial events generally
interpretation: |
  Taurus hosts the chart's signature Rahu signal. SIG.10 Rahu-2H-Rohini-exalted makes Taurus the "unconventional-wealth-amplifier" sign. Combined with CGP audit finding (Rahu Jaimini-quadruple-aspect), Taurus is the origin-point for the chart's most novel structural signal. SIG.16 pending promotion in Deep Analysis v2.0.
  Major upcoming: Jupiter transit 2025-2026 overlapping with Saturn-AD-delivery-peak = 2H expansion window FOR native's business. Saturn Kantaka 2029-2032 is the next structural 2H pressure — likely coincides with post-Mercury-MD (Ketu MD early phase) business-consolidation challenges.
```

### MX.SGN.GEMINI (House 3 — Effort/Siblings)

```yaml
house_equiv: 3
element: Air
quality: Dual
ruler: Mercury
exalt_for: — (no classical exaltation)
debil_for: — (no classical debilitation)
rashi_tenants: []
sav_bindu: 28
jaimini_aspects_cast: [Virgo (dual-dual), Sagittarius (Jup+Ven), Pisces]
jaimini_aspects_received: [Virgo, Sagittarius (Jup+Ven), Pisces — dual-dual reciprocal]
yogas_hosted:
  - CVG.07 Gemini 3H nexus (UL + A5 + A11 + Vivaha Saham + Gulika + Dhuma)
  - D9 12H Gemini stellium (Moon+Jupiter+Rahu in D9 Gemini) — SIG.06 loop-closure point
arudhas_landing_here: [UL (Upapada/spouse), A5, A11]
transit_density_2026_2044:
  - Jupiter transit Gemini 2013 (past — XIMB grad + marriage), next 2037 (age 53)
  - Rahu transit Gemini 2031-2033 (on UL — structural spouse-karma reset)
  - Saturn transit Gemini 2038-2041 (age 54-57)
dignity_events_in_transit:
  - When Jupiter transits Gemini (natural enemy for Jupiter): short annual-level dharmic-communication tension. Not major.
  - Mars in Gemini (friendly): neutral passage
lel_events_touching_sign:
  - EVT.1998.02.16.01 (R#1 start — UL/Vivaha Saham in Gemini activated)
  - EVT.2013 marriage cluster (Gemini-signal loop-closure)
  - Upcoming Jupiter-Gemini 2037 and Rahu-Gemini 2031-2033 will activate spouse-related structural restructuring
interpretation: |
  Gemini is the chart's RELATIONAL-KARMA REPOSITORY — 6 sensitive points cluster here (UL, A5, A11, Vivaha Saham, Gulika, Dhuma). Empty in Rashi but crowded in arudha/saham/shadow-upagraha space. CVG.07 names this nexus.
  Most significant upcoming transit: Rahu transit Gemini 2031-2033 directly on UL = major spouse-karma restructuring window. Native will be 47-49. This is the chart's next structural relationship-reorientation opportunity post current separation. Jupiter-Gemini 2037 (age 53) = benefic re-seal of UL territory.
```

### MX.SGN.CANCER (House 4 — Home/Mother)

```yaml
house_equiv: 4
element: Water
quality: Movable
ruler: Moon
exalt_for: Jupiter
debil_for: Mars
rashi_tenants: []
sav_bindu: 32 (3rd highest)
jaimini_aspects_cast: [Taurus (Rahu), Scorpio (Ketu), Aquarius (Moon)]
jaimini_aspects_received: [Libra (Mars+Saturn), Scorpio (Ketu), Taurus (Rahu), Capricorn (Sun+Mercury)]  # movable aspects fixed ex-adjacent Leo
yogas_hosted: [Jupiter's 7th-aspect from Sagittarius to Cancer = beneficial 4H (classical "gajakesari-like" home benefic); A2 arudha]
arudhas_landing_here: [A2]
transit_density_2026_2044:
  - Jupiter transit Cancer 2026 (EXALTED — major 4H benefic window for home)
  - Saturn transit Cancer 2032-2035 (8th from Moon = heavy turmoil transit)
  - Rahu transit Cancer 2027-2029
dignity_events_in_transit:
  - Jupiter-in-Cancer 2026 = exalted Jupiter peak benefic transit; will overlap native's age 42-43 (home/stability favorable)
  - Mars-in-Cancer (debilitated) briefly each 2 years: mental-tension windows
  - Saturn-in-Cancer 2032-2035 = 4H pressure on home/foundations
lel_events_touching_sign:
  - EVT.2010.XX.XX.01 (family real estate — A2 arudha firing)
  - EVT.2023.05.XX.01 (US → India return — 4H home-shift)
interpretation: |
  Cancer is structurally strong (SAV 32, rank 3) and Jupiter-aspected from 9H (full 60-virupa dharmic benefic). Despite empty Rashi, 4H Cancer is among the better-positioned houses via the Jupiter-aspect blessing. Upcoming Jupiter-exalted-Cancer 2026 = IMMEDIATE beneficial window overlapping Saturn-AD peak — native's home/stability receive exalted Jupiter blessing during current business-growth phase.
  Saturn-Cancer 2032-2035 (age 48-51) = 8th-from-Moon pressure. This IS a window to flag in Temporal Engine — classical Saturn-8th-from-Moon produces emotional/physiological turmoil. Coincides with Venus MD early phase (Venus lordship of 2L+7L in native's chart).
```

### MX.SGN.LEO (House 5 — Creativity/Progeny)

```yaml
house_equiv: 5
element: Fire
quality: Fixed
ruler: Sun
exalt_for: — (no classical)
debil_for: — (no classical)
rashi_tenants: []
sav_bindu: 30
jaimini_aspects_cast: [Aries (Lagna), Libra (Mars+Saturn), Aquarius (Moon)]
jaimini_aspects_received: [Taurus (Rahu), Scorpio (Ketu), Capricorn (Sun+Mercury)]
yogas_hosted: [A3 arudha (sibling-reflection); Saturn 3rd-aspect from 7H onto 5H = creativity-through-discipline]
arudhas_landing_here: [A3]
transit_density_2026_2044:
  - Jupiter transit Leo 2028-2029 (during Ketu MD early)
  - Saturn transit Leo 2034-2037 (age 50-53)
  - Ketu transit Leo 2027-2029 (on 5H during own MD start — major event)
dignity_events_in_transit:
  - Sun-in-Leo annually (own sign) = brief annual peak for creativity/recognition
  - Jupiter-Leo 2028 = dharmic support to creativity at Ketu-MD start
  - Ketu-Leo 2027-29 = detachment/transformation of 5H matters during Ketu MD first 2 years
lel_events_touching_sign:
  - EVT.2012.09.XX.01 (modeling at XIMB — 5H creativity event)
  - EVT.2022.01.03.01 (twins — 5H progeny, Jupiter-Aq 11H-aspect-to-5H trigger)
interpretation: |
  Leo 5H has Sun as 5L sitting in 10H Capricorn = creativity-expressed-through-career. A3 sibling-arudha here links brother-relationship to creative/future-building. Upcoming Ketu transit Leo 2027-2029 (early Ketu MD) is critical: Ketu on 5H = detachment-from-progeny-matters. Native's twins will be ~5-7 years old during this transit; monitor for emotional-detachment patterns or sudden parenting shifts.
  Bhavabala rank 2 (very strong) + SAV 30 + Saturn 3rd-aspect-full-60-virupa = structurally strong creativity house with Saturnine discipline overlay. Retrodictively explains modeling/career alignment + creative-athletic-basketball peak 2012-13 (PERIOD.2012_2013 best period).
```

### MX.SGN.VIRGO (House 6 — Disease/Enemies)

```yaml
house_equiv: 6
element: Earth
quality: Dual
ruler: Mercury
exalt_for: Mercury
debil_for: Venus
rashi_tenants: []
sav_bindu: 26 (below median)
jaimini_aspects_cast: [Gemini (empty), Sagittarius (Jup+Ven), Pisces (empty)]
jaimini_aspects_received: [Gemini, Sagittarius, Pisces — dual-dual reciprocal]
yogas_hosted: [A4+A8+A9 triple-arudha cluster — "hidden-karma" node]
arudhas_landing_here: [A4, A8, A9]
transit_density_2026_2044:
  - Saturn transit Virgo 2036-2039 (Kantaka 8H from Moon)
  - Jupiter transit Virgo 2031
  - Rahu transit Virgo 2032-2034
dignity_events_in_transit:
  - Mercury-in-Virgo (exalted) annually briefly: peak Mercury activation — monitor for exam-like, communication-driven wins
  - Venus-in-Virgo (debilitated): 18-month-cycle triggers Venus-weakness signal (SIG.12 activation on transit)
  - Saturn-Virgo 2036-2039 = Kantaka-Shani peak health-pressure window
lel_events_touching_sign:
  - EVT.1995.XX.XX.01 (headaches onset — 6H disease signature)
  - EVT.2007.06.XX.01 (knee surgery — 6H surgery)
  - EVT.2021.01.XX.01 (panic/jitters — 6H health activation)
  - EVT.2025.05.XX.01 (deception/scam — 6H enemies)
interpretation: |
  Virgo is the chart's "hidden-karma cluster" (3 arudhas — unusual). SAV 26 (below median), Mercury as 6L in 10H creates "enemies-to-career" concern but Mercury own-sign-exaltation-in-Virgo means when Mercury transits Virgo (briefly annually), peak-analytical-acuity. Venus-debilitation-in-transit 2027-2029 and 2045-2047 = 6H-pressure windows.
  Saturn-Virgo 2036-2039 (Kantaka = 8th from Moon) is the chart's most-likely-health-challenge-window in the 50s. Native will be 52-55 during this transit — worth planning preventive health protocols 2033-2035 ahead of it.
```

### MX.SGN.LIBRA (House 7 — Partnership)

```yaml
house_equiv: 7
element: Air
quality: Movable
ruler: Venus
exalt_for: **Saturn (native's natal)** — 22°27' near-max
debil_for: Sun
rashi_tenants: [Saturn (exalted), Mars]
sav_bindu: **33 (tied highest)**
jaimini_aspects_cast: [Taurus (Rahu), Leo, Aquarius (Moon)]
jaimini_aspects_received: [Scorpio (Ketu), Aquarius (Moon), Aries (Lagna), Cancer]
yogas_hosted:
  - SIG.01 Sasha Mahapurusha Yoga
  - SIG.15 Hidden Raja Yoga
  - CVG.05 Saturn 7H exalted + Shadbala-strong + Mahapurusha + AD + Yogini (5-way)
  - CVG.08 Aries-Libra axis triple-aspect
arudhas_landing_here: [Saturn, Mars (tenants); no separate arudha here]
transit_density_2026_2044:
  - **Saturn own-exaltation transit Libra 2041-2044** (age 57-60) — MAJOR 7H lifetime cycle closure
  - Jupiter transit Libra 2030 (age 46)
  - Rahu transit Libra 2034-2036
dignity_events_in_transit:
  - **Saturn returning to Libra 2041-2044 = Saturn's own-exaltation return — chart's single most significant structural transit in lifetime**
  - Sun-in-Libra annually (debilitated) briefly: brief 7H Sun-weakness trigger each Oct-Nov
  - Mars-in-Libra (debilitated) every 2 years: 7H Mars-friction mini-windows
lel_events_touching_sign:
  - EVT.2013.12.11.01 (marriage — primary 7H event, STRONGEST retrodictive match)
  - EVT.CURRENT.01 (separation trajectory)
  - EVT.2007.06.XX.01 (knee — Mars-Saturn 7H physical)
  - EVT.2024.02.16.01 (sand mine — Chara Libra MD active at launch)
  - EVT.2025.07.XX.01 (Marsys contract — Saturn AD peak)
interpretation: |
  Libra is the chart's MOST STRUCTURALLY DENSE sign. Hosts exalted Saturn + Mars, 4 of 15 chart signatures originate here (SIG.01, SIG.15, CVG.05, CVG.08), Bhavabala rank 12 (PARADOX — weakest house has densest yoga activity). Jaimini: Libra casts aspect to Taurus (Rahu), Leo, Aquarius (Moon) = 3 of the chart's key planets/points. Receives aspects from Scorpio (Ketu), Aquarius (Moon), Aries (Lagna), Cancer.
  **Saturn's return to Libra 2041-2044** (native age 57-60) is the lifetime's SINGLE most significant structural transit — Saturn back to its own-exaltation seat during Venus MD's middle years. Classical reading: lifetime's cycle-closure on partnership/authority matters + Mahapurusha-Yoga re-seal. Likely coincides with major life-phase transition (retirement from active Marsys operations? partnership reconciliation? new authority role?) — worth flagging explicitly in Temporal Engine lifetime timeline.
```

### MX.SGN.SCORPIO (House 8 — Transformation/Occult)

```yaml
house_equiv: 8
element: Water
quality: Fixed
ruler: Mars (Ketu as co-lord in modern schools)
exalt_for: **Ketu (native's natal)**
debil_for: Moon / Rahu
rashi_tenants: [Ketu (exalted)]
sav_bindu: **33 (tied highest)**
jaimini_aspects_cast: [Aries (Lagna), Cancer, Capricorn (Sun+Mercury)]
jaimini_aspects_received: [Leo, Libra (Mars+Saturn), Aquarius (Moon), Taurus (Rahu)]
yogas_hosted: [Exalted Ketu 8H = moksha signature maximum-amplification]
arudhas_landing_here: []
transit_density_2026_2044:
  - Rahu transit Scorpio 2030-2031 (on natal Ketu — nodal reversal, Rahu-return-on-Ketu)
  - Jupiter transit Scorpio 2030
  - Saturn transit Scorpio 2044-2046 (near lifetime end of primary arc)
dignity_events_in_transit:
  - Moon-in-Scorpio monthly (debilitated briefly): depression/anxiety triggers during transit
  - Mars-in-Scorpio (own-sign, strong) every 2 years: courage/action windows
  - Rahu-in-Scorpio (debilitated) 2030-2031: classical Rahu weakness reversed — contraindicated period for new unconventional ventures
  - **Ketu-in-Scorpio (own-sign-exalted) ~2040** — return-to-native-Ketu position
lel_events_touching_sign:
  - EVT.2009.06.XX.01 (grandfather passed — 8H)
  - EVT.2018.11.28.01 (father passed)
  - EVT.2025.05.XX.01 (scam/deception)
  - 8H events generally
interpretation: |
  Scorpio has **exalted Ketu (8H)** — maximum moksha-signature activation. Combined with SAV 33 (tied highest) and fixed-quality = Scorpio is structurally a high-intensity sign even when empty-of-planets-other-than-Ketu. Rahu transit Scorpio 2030-2031 will be INTENSE: Rahu debilitated in Scorpio AND returning to native's natal Ketu position = classical "nodal-reversal" window. Native will be 46-47; this falls INSIDE Ketu MD — double-Ketu-emphasis period.
  Upcoming Ketu MD 2027-2034 starts with Scorpio's residual strength fueling early years. Native's research/occult aptitude (doc §6 computer-programming savant + current return-to-programming) fits Scorpio-Ketu exalted signature. Monitor: Rahu-Scorpio 2030-2031 could bring sudden reversals — contraindicated for aggressive risk-taking in that window.
```

### MX.SGN.SAGITTARIUS (House 9 — Dharma/Father)

```yaml
house_equiv: 9
element: Fire
quality: Dual
ruler: Jupiter
exalt_for: — (no classical)
debil_for: — (no classical)
rashi_tenants: [Jupiter (own), Venus]
sav_bindu: 25 (below median)
jaimini_aspects_cast: [Gemini, Virgo, Pisces]
jaimini_aspects_received: [Gemini, Virgo, Pisces — dual-dual reciprocal]
yogas_hosted:
  - SIG.08 Lakshmi Yoga
  - SIG.07 Saraswati Yoga (Jupiter member)
  - CVG.02 Jupiter 9L dharma-wealth chain
  - CVG.06 Jupiter own-sign + Lakshmi + 9L + MPY-near-miss
  - CTR.03 Jupiter Uccha-weak (positional-weakness in own sign)
arudhas_landing_here: [Jupiter, Venus (tenants)]
transit_density_2026_2044:
  - Jupiter own-sign return 2031-2032 (age 47-48), 2043-2044 (age 59-60)
  - Ketu transit Sag 2035-2036
  - Saturn transit Sagittarius 2047-2050 (age 63-66)
dignity_events_in_transit:
  - Jupiter-own-sign returns are benefic peaks every 12 years
  - Saturn-Sag 2047-2050 = Cycle 3 Sade Sati Rising from Moon perspective (9H Saturn-transit during Cycle 3)
lel_events_touching_sign:
  - EVT.2011.06.XX.01 + EVT.2013.03.XX.01 (XIMB education — 9H)
  - EVT.2023.06.XX.01 (Tepper — 9H higher education)
  - EVT.2009.06.XX.01 (grandfather — 9L Jupiter activation)
  - EVT.2018.11.28.01 (father passed — Saturn transit Sagittarius classical father-death trigger)
interpretation: |
  Sagittarius is the chart's DHARMIC-WEALTH ORIGIN (Jupiter own + Venus companion = Lakshmi Yoga + Saraswati-partial). SAV 25 is below median — 9H external bindu-support is modest despite being hosted-by-9L-own-sign. This is the structural basis for CTR.03: dignity-strength (own sign, own house) without positional-compounding-strength (low SAV, rank-7-Uccha-Bala-LAST).
  Upcoming Jupiter own-sign returns 2031-2032 and 2043-2044 are the chart's reliable dharmic-renewal windows. The 2031-32 return during Ketu MD will be especially meaningful — Jupiter re-anchors dharmic-path during the regime-change. Saturn-Sag 2047-2050 = Sade Sati Cycle 3 Rising + 9H-transit simultaneously = paternal/dharmic revisit window (age 63-66).
```

### MX.SGN.CAPRICORN (House 10 — Career)

```yaml
house_equiv: 10
element: Earth
quality: Movable
ruler: Saturn
exalt_for: Mars
debil_for: Jupiter
rashi_tenants: [Sun (enemy's sign — Saturn's own, Saturn is Sun's enemy; NOT debilitation which is Libra), Mercury (Vargottama — D1=D9 Capricorn)]
sav_bindu: 26
jaimini_aspects_cast: [Taurus (Rahu), Leo, Scorpio (Ketu)]
jaimini_aspects_received: [Taurus (Rahu — critical!), Libra (Mars+Saturn), Scorpio (Ketu)]
yogas_hosted:
  - SIG.14 Sun 10H Capricorn + AL + Mercury (career-density)
  - CVG.04 10H career convergence
  - Budh-Aditya Yoga (Sun-Mercury)
  - AL (Arudha Lagna) here = projected-identity-via-career
arudhas_landing_here: [AL, Sun, Mercury]
transit_density_2026_2044:
  - Saturn Sade Sati Rising Capricorn 2049-2052 (Cycle 3 start)
  - Jupiter transit Cap (debilitated) 2028
  - Rahu transit Cap 2028-2029
  - Ketu transit Cap 2023-2025 (past — during US return pivot)
dignity_events_in_transit:
  - **Mars-in-Capricorn (exalted)** every 2 years: peak Mars windows (e.g., Feb 2024 Mars-Cap during sand mine launch)
  - Jupiter-in-Capricorn (debilitated) 2020, 2028, 2040: triggers CTR.03 in transit — monitor for career-related dharmic setbacks
  - Sun-in-Capricorn annually (native's natal Sun — enemy-sign recurrence) mid-Jan to mid-Feb: annual Sun-return-to-enemy-sign window; also Uttarayan transition; native's birthday (Feb 5) falls in this period
  - Saturn-in-Capricorn 2020-2022 (past — major career events during), 2049-2052 future
lel_events_touching_sign:
  - EVT.2007.06.10.01 through EVT.2025.07.XX.01 — nearly all career events
  - Specifically EVT.2020-2022 during Saturn-in-Cap transit = Sade Sati Rising phase overlapping US-exciting-to-pivot period
interpretation: |
  Capricorn as 10H is the chart's career-machine (see MX.HSE.10 for full detail). Sign-level additions: Mars-exalted-transit every 2 years gives brief but powerful career-push windows — native's sand mine launch Feb 16, 2024 coincided with Mars transit Capricorn (exalted). This is a pattern worth formalizing: MARS-CAPRICORN TRANSIT = native's career-launch opportunity signal.
  Rahu Jaimini-aspect from Taurus is the novel structural finding (CGP audit) — makes Capricorn's Sun+Mercury stellium receive permanent-Rahu-aspect at Jaimini level. Retrodictively explains unconventional-career-trajectory. Jupiter-in-Cap (debilitated) transits 2028/2040 are windows to watch for career-dharmic-setbacks; 2028 falls in Ketu MD Year 1.
```

### MX.SGN.AQUARIUS (House 11 — Gains/Network)

```yaml
house_equiv: 11
element: Air
quality: Fixed
ruler: Saturn
exalt_for: — (no classical)
debil_for: — (no classical)
rashi_tenants: [Moon (AK)]
sav_bindu: 23 (tied lowest)
jaimini_aspects_cast: [Aries (Lagna), Cancer, Libra (Mars+Saturn)]
jaimini_aspects_received: [Aries (Lagna), Cancer, Libra (Mars+Saturn), Taurus (Rahu)]
yogas_hosted:
  - SIG.04 Moon AK
  - SIG.11 Anapha Yoga (Saturn 12th from Moon)
  - A7 (partner arudha in 11H co-located with Moon)
arudhas_landing_here: [A7, Moon]
transit_density_2026_2044:
  - Saturn Sade Sati Peak Aquarius 2022-2025 (CURRENT — ending Mar 2025)
  - Jupiter transit Aquarius 2033, 2045 (gajakesari on Moon each time)
  - Rahu transit Aquarius 2031-2033 (on Moon — emotional restructure)
  - Saturn Sade Sati Cycle 3 Peak Aquarius 2052-2055 (age 68-71)
dignity_events_in_transit:
  - None are classical exalt/debil in Aquarius (no primary dignity host)
  - Jupiter-in-Aquarius transits = Jupiter-on-Moon gajakesari-class
  - Rahu-in-Aquarius 2031-2033 = Rahu-on-Moon = major emotional/identity-foundation shift
lel_events_touching_sign:
  - EVT.1984.02.05.01 (birth — Moon position)
  - EVT.2022.01.03.01 (twins — Jupiter-Aq on Moon gajakesari)
  - EVT.2023.05.XX.01 through EVT.2025.XX.XX.01 (Saturn Sade Sati Peak on Moon — current life-direction restructure)
interpretation: |
  Aquarius holds the Atmakaraka Moon — chart's soul-center. SAV 23 lowest = AK-placement has minimum-external-bindu-support = soul operates on inner/self-generated strength rather than accumulated-external-goodwill. CTR.04 (Rashi-11/Chalit-12) splits Moon's delivery across gains-from-mainstream vs loss-from-dissolution.
  Upcoming Rahu-Aq 2031-2033 ON the Moon = major emotional-identity restructure window (age 47-49). Jupiter-Aq 2033 immediately after = gajakesari-class restoration. Combined: 2031-2033 is a 2-year intense emotional-transformation phase followed by 1-year Jupiter-grace recovery. Worth flagging in Temporal Engine as "Rahu-Moon transit cluster" critical window.
```

### MX.SGN.PISCES (House 12 — Isolation/Foreign/Moksha)

```yaml
house_equiv: 12
element: Water
quality: Dual
ruler: Jupiter
exalt_for: Venus
debil_for: Mercury
rashi_tenants: []
sav_bindu: 23 (tied lowest)
jaimini_aspects_cast: [Gemini, Virgo, Sagittarius (Jup+Ven)]
jaimini_aspects_received: [Gemini, Virgo, Sagittarius — dual-dual]
yogas_hosted: [D9 12H Gemini stellium dispositor = Jupiter in D1 9H manages 12H foreign-signals]
arudhas_landing_here: []
transit_density_2026_2044:
  - **Saturn Sade Sati Setting Pisces 2025-2028 (CURRENT — active)**
  - Jupiter transit Pisces 2022-2023 (past — during US return pivot preparation), 2034 (age 50), 2046 (age 62)
  - Rahu transit Pisces 2033-2035
dignity_events_in_transit:
  - Venus-in-Pisces (exalted) every 18 months: Ishta Devata Mahalakshmi activation windows — especially during Venus MD (2034-2054)
  - Mercury-in-Pisces (debilitated) annually briefly: communication/analytical-friction windows — monitor around business-critical decisions
  - Jupiter-Pisces own-sign 2034 = dharmic-12H peak benefic
lel_events_touching_sign:
  - EVT.2010.12.XX.01 (Thailand — first foreign)
  - EVT.2019.05.XX.01 (US move)
  - EVT.2023.05.XX.01 (US → India return)
  - EVT.2025.XX.XX.01 (Vishnu-Venkateshwara gravitation — 12H moksha)
  - Saturn Sade Sati Setting 2025-2028 is ACTIVE NOW = governs native's current phase
interpretation: |
  Pisces is the chart's MOKSHA architecture + Bhavabala rank 1 (strongest house 506 virupa) despite empty Rashi + lowest SAV. Paradox = intrinsically strong via 12L Jupiter own-sign-placement-in-9H + Moon-Chalit-12 overflow + Mars-full-aspect-from-7H. No arudha lands here.
  **CURRENT**: Saturn transit Pisces 2025-03-30 → 2028-02-24 = Sade Sati Setting for native + Mercury-Saturn AD concurrent + Ketu MD approaching = triple-activation of 12H Pisces. This 3-year window (native age 41-44) is the chart's deepest spiritual-dissolution-restructure. Retrodictively the 2025 Vishnu gravitation (EVT.2025.XX.XX.01) is the EARLY manifestation; by 2028 this will be a major life-reorientation completion. Temporal Engine should flag 2025-2028 as "12H deep-restructure window" — more significant than the separate Saturn AD or Ketu MD windows alone.
```

---

## §4 — CROSS-SIGN AGGREGATES

### §4.1 — Dignity Map

| Sign | Exalts | Debilitates | Native-Chart Dignity Status |
|---|---|---|---|
| Aries | Sun | Saturn | (Sun exalt — cross-validated via D9 NBRY SIG.03 Saturn) |
| Taurus | Moon, **Rahu** | Ketu | Rahu NATALLY EXALTED HERE |
| Gemini | — | — | — |
| Cancer | Jupiter | Mars | (Mars natally-debilitates-nearby in Libra, not Cancer) |
| Leo | — | — | — |
| Virgo | Mercury | Venus | (Venus natally-debilitates-in-Virgo in D9 — SIG.02) |
| **Libra** | **Saturn** | Sun | **SATURN NATALLY EXALTED** (59.18 Uccha — near-max) |
| **Scorpio** | **Ketu** | Moon, Rahu | **KETU NATALLY EXALTED** |
| Sagittarius | — | — | (Jupiter natal-own-sign — but Uccha-weak CTR.03) |
| Capricorn | Mars | Jupiter | Sun is natally here in enemy's sign (Saturn's own) — Dig Bala + Vargottama Mercury compensate; Jupiter-Cap-transit = debility watch (Jupiter debilitates in Cap) |
| Aquarius | — | — | (Moon AK natal; no classical dignity) |
| Pisces | Venus | Mercury | (Mercury debilitates in transit — monitor windows) |

**Triple-exalted signature**: Saturn + Rahu + Ketu all natally exalted. Rare in charts; native has structural advantage on these 3 karmic/authority-nodes simultaneously.

### §4.2 — Jaimini sign-aspect density

Signs most-actively Jaimini-aspecting native's planets:
1. **Taurus (Rahu)** — aspects Sun+Mercury+Mars+Saturn (4 planets) — SIG.16 candidate
2. **Libra (Mars+Saturn)** — aspects Taurus (Rahu), Leo, Aquarius (Moon) — 2 occupied signs touched
3. **Scorpio (Ketu)** — aspects Aries (Lagna), Cancer, Capricorn (Sun+Mercury) — 3 key points
4. **Aquarius (Moon AK)** — aspects Aries (Lagna), Cancer, Libra (Mars+Saturn) — 3 key points
5. **Capricorn (Sun+Mercury)** — aspects Taurus (Rahu), Leo, Scorpio (Ketu) — 3 nodal+fixed hits

Jaimini sign-web is densely interconnected. Rahu-Taurus, Ketu-Scorpio, Moon-Aquarius, and Mars+Saturn-Libra form a Jaimini-aspect-rich quadrilateral covering most structural themes.

### §4.3 — Transit-density concentration 2026-2044

**Highest transit-activity signs (frequency × significance-weight)**:
1. Aquarius — Sade Sati Peak ending 2025 + Jupiter 2033+2045 + Rahu 2031-33 = MAX emotional/AK transits
2. Pisces — current Sade Sati Setting + Jupiter 2034+2046 = spiritual transition hub
3. Libra — Saturn own-exaltation return 2041-2044 = lifetime structural closure
4. Cancer — Jupiter exalt 2026 + Saturn 2032-35 = 4H dual-benefic-then-pressure
5. Aries — multiple nodal transits + Jupiter 2035 = identity-renewal hub

**Lowest transit-activity**: Leo, Virgo, Gemini — less slow-planet activity in 2026-2044 window.

### §4.4 — New SIG candidates from Sign Matrix

- **SIG.23 (tentative)**: Triple-exalted-nodal-axis (Saturn-Rahu-Ketu all natally exalted) — structural advantage signature, not currently in v1.2.1 library
- **SIG.24 (tentative)**: Mars-Capricorn-transit-as-career-launch-trigger (sand mines Feb 2024 validates; should formalize as recurring pattern)
- **SIG.25 (tentative)**: Current Saturn-Pisces-transit triple-activation (Sade Sati Setting + Saturn AD + Ketu MD approaching) — 2025-2028 is the chart's densest 3-year window for 12H restructure

---

## §5 — RED-TEAM CHECK

- **Completeness**: 12/12 signs examined with full schema populated.
- **Over-claim**: New SIG.23-25 marked as "tentative"; Triple-exalted-nodal-axis (SIG.23) is observational not interpretive — factually Saturn+Rahu+Ketu are all in exaltation signs. Interpretive claim about "structural advantage" is hedged.
- **Bias**: Interpretations lean on existing yogas/convergences from v1.2.1. Novel findings (Mars-Cap career trigger, Rahu-Scorpio 2030 reversal watch) are flagged as "monitor" recommendations, not predictions.
- **Missing-data**: None. All 12 signs populated.

---

## §6 — OUTPUT FOR L2.5

### §6.1 — CGM nodes: 12 SGN nodes

### §6.2 — CGM edges: ~80 (Jaimini aspect graph 12×12 matrix from CGP audit + dignity-host relationships + tenant-signs)

### §6.3 — MSR signals (~40):
- 12 SAV-rank signals
- 12 dignity-host signals (which planets exalt/debilitate where)
- 12 transit-density-window signals
- 3 new SIG candidates (23, 24, 25)

### §6.4 — CDLM feed:
- Libra ↔ Aries axis (7H/Lagna)
- Taurus ↔ Capricorn (Rahu-aspects career)
- Pisces ↔ Sagittarius (12H/9H spiritual-dharmic)
- Scorpio ↔ Taurus (nodal axis)
- Aquarius ↔ Leo (Moon-Sun axis)

---

## §7 — CHANGELOG

```yaml
v1.0 (2026-04-17, Session 9):
  - Initial Mode B Sign Matrix covering all 12 signs
  - Focuses on sign-centric properties (dignity-hosting, Jaimini aspects, transit-density) rather than house-level duplication
  - 3 new tentative SIG candidates (SIG.23-25)
  - Key observation: Saturn + Rahu + Ketu all natally exalted = rare triple-exalted signature
  - Status: CLOSED (Session 9 output, paired with MATRIX_DIVISIONALS)
```

**END OF SIGN MATRIX v1.0**
