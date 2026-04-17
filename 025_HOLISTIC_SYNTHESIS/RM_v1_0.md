---
artifact: RM_v1_0.md
artifact_type: Resonance Map
layer: L2.5 — Holistic Synthesis
version: 1.0
status: OPEN
date_opened: 2026-04-18
session: 13
parent_artifacts: [MSR_v1_0.md, CDLM_v1_0.md, CGM_v1_0.md]
feeds_into: [UCN_v1_0.md, Domain Reports L3]
native: Abhisek Mohanty, b. 1984-02-05, 10:43 IST, Bhubaneswar
elements_planned: 35
elements_completed: 0
schema_ref: Architecture §C.3.4, §D.4.D, §G.4.D
---

# AM-JIS — Resonance Map v1.0 (`RM_v1_0.md`)

## Purpose

For every major chart element (~30-50 elements): constructive resonances (what amplifies this element) and destructive resonances (what dampens it), with an interpretive note on the element's net behavior in this specific chart. Elements are identified by high CGM centrality, high MSR signal-count, CDLM primary-flow anchor status, or UCN Part subject-matter.

**Schema per entry:**
```
RM.ELEMENT_ID:
  element: [description]
  domains_primary: [D1–D9]
  msr_anchors: [MSR.xxx, ...]
  cdlm_anchors: [CDLM.Dx.Dy, ...]
  constructive_resonance:
    - "element (mechanism)"
  destructive_resonance:
    - "element (mechanism)"
  net_resonance: [STRONGLY AMPLIFIED / AMPLIFIED / BALANCED / TENSION-BEARING / DAMPENED]
  interpretive_note: |
    prose
```

**Net resonance definitions:**
- STRONGLY AMPLIFIED: constructive list dominates by 3+ factors or includes a supreme convergence
- AMPLIFIED: constructive list meaningfully outweighs destructive
- BALANCED: constructive and destructive are roughly matched; output depends on timing
- TENSION-BEARING: destructive resonances are significant but don't fully suppress; output paradoxical
- DAMPENED: destructive list meaningfully outweighs constructive

---

## §1 — Planetary Resonance Entries

---

```yaml
RM.01_MERCURY_10H:
  element: >
    PLN.MERCURY natal in HSE.10 Capricorn — the chart's supreme planetary node.
    Seven-system convergence (MSR.413, confidence 0.98): Natal 10H planet +
    Vimshottari MD lord (2014-2031) + Yogi Planet + Jaimini DK + Karakamsa sign
    lord + KP cusp-11 sub-lord + Vargottama.
  domains_primary: [D1_Career, D2_Wealth, D8_Mind]
  msr_anchors: [MSR.413, MSR.264, MSR.311, MSR.388, MSR.390]
  cdlm_anchors: [CDLM.D1.D1, CDLM.D1.D2, CDLM.D8.D1]

  constructive_resonance:
    - "Jupiter exalted 4H aspects 10H (7th-house aspect): dharmic authorization
      of Mercury's career output from the most auspicious available planet"
    - "Sun conjoined 10H: solar authority amplifies Mercury's intellectual
      presence; 5L+6L+10H compound in career house"
    - "Saturn AmK exalted 7H aspects 10H (4th-house aspect): the institutional
      authority channel endorses Mercury's career delivery"
    - "Venus 9H completing Saraswati Yoga: Mercury + Jupiter + Venus = the
      classical intelligence triad, all in strong houses"
    - "Rahu 2H unobstructed Argala on Lagna (MSR.329): desire-engine amplifies
      Mercury's resource-accumulation via 2H"
    - "AL = Capricorn 10H: public image and career are the same chamber —
      Mercury's house IS the face the world sees"
    - "Mercury MD 2014-2031: time-lord and natal placement = the same planet
      in the same house = maximum self-resonance"
    - "Vargottama status: D1=D9 position doubles the depth and durability of
      the promise; soul-lens confirms career-lens"
    - "Moon AK Karakamsa: D9 Moon = Gemini → Mercury = Karakamsa lord → the
      soul's purpose is Mercury-governed at the Jaimini level"

  destructive_resonance:
    - "Combustion by Sun: Mercury's proximity to Sun risks solar absorption;
      intellectual brilliance may be eclipsed by authority demands"
    - "3L+6L dual lordship: Mercury MD simultaneously activates the obstacle
      house (3H) and the disease/debt house (6H) alongside career peaks"
    - "Venus as 2L+7L in 9H: partially diverts Mercury's 10H focus toward
      9H-dharma; the MD lord's attention splits between career and dharmic
      aspiration"

  net_resonance: STRONGLY AMPLIFIED
  interpretive_note: |
    Mercury is the chart's defining planetary element with no peer in terms of
    multi-system confirmation. The seven-system convergence (MSR.413, 0.98
    confidence) means that regardless of which classical system one uses —
    Parashari, Vimshottari, Jaimini, KP, Navamsha — Mercury emerges as the
    primary signifier of career, wealth, and intellectual mission. The combustion
    risk is real but modulated: Mercury as Yogi Planet carries a protective
    fortune-quality, and the natal house's dispositor (Saturn, exalted 7H)
    provides structural support. The 3L+6L paradox means Mercury MD will deliver
    career peaks AND simultaneously activate obstacles and health events — these
    are not alternatives but concurrent outputs of the same MD. Any question
    about this chart's career, wealth, or mind should route through RM.01 first.
```

---

```yaml
RM.02_SATURN_EXALTED_7H:
  element: >
    PLN.SATURN exalted in HSE.7 Libra — the chart's authority-carrier.
    AmK (Amatyakaraka) designation. Shuddha Pinda rank 7 of 7.
    D9 Neecha-Bhanga Rashi (delayed-peak reserve). Current AD lord 2024-2027.
  domains_primary: [D1_Career, D3_Relationships, D2_Wealth]
  msr_anchors: [MSR.391, MSR.396, MSR.001, MSR.088, MSR.311]
  cdlm_anchors: [CDLM.D1.D1, CDLM.D3.D3, CDLM.D1.D3]

  constructive_resonance:
    - "Exaltation in Libra D1: maximum classical dignity = institutional
      authority operating at peak functional power"
    - "AmK designation (Jaimini): the soul has elected Saturn as career-minister;
      all vocational outcomes are Saturn-mediated"
    - "Mars co-tenant 7H + PK: tension-partner creates the Authority-Through-
      Tension signature; executive drive and institutional patience share the
      execution house"
    - "Hora Lagna Libra 7H: HL in this house = wealth flows through Saturn's
      authority channel"
    - "Jupiter 4H aspects 7H (4th-house aspect? No — from 4H, Jupiter's
      4th-house aspect = 7H): the exalted dharmic planet gazes on Saturn's
      house"
    - "Saturn AD 2024-2027: time-lord = natal planet = maximum self-resonance
      within Mercury MD; authority-delivery peak period"
    - "D9 Neecha-Bhanga Rashi: soul-lens shows delayed-peak resilience; what
      appears suppressed in D9 carries bounce-back mechanism"
    - "KP sub-lord Saturn confirmed for 7H cusp: KP analysis validates Saturn
      as primary determinant of 7H outcomes"
    - "Bhrigu Bindu arrives at 7H / 3H area 2025-2026: temporal trigger
      activates the accumulated 7H convergence during Saturn AD"
    - "Sade Sati paradox confirmed (MSR.396): three systems verify Sade Sati
      Peak 2022-2025 was achievement window, not destruction — Saturn delivers
      paradoxical authority"

  destructive_resonance:
    - "Shuddha Pinda rank 7 of 7: lowest possible Ashtakavarga rank = Saturn's
      expression is dramatic and episodic, not quietly compounding"
    - "BVB.7 below threshold: Bhavabala of 7H is weak = the house-container
      cannot fully hold Saturn's accumulated signification"
    - "Venus = 7L absent from 7H: the house lord governs from 9H = governance
      gap; 7H themes lack their natural steward"
    - "Saturn-Mars natural enmity in shared house: chronic internal friction
      in the chart's primary convergence house"
    - "Sade Sati structural compression 2022-2025: despite paradoxical output,
      the compression force was real and the authority was earned under maximum
      difficulty"

  net_resonance: AMPLIFIED
  interpretive_note: |
    Saturn is the chart's authority-delivery mechanism — but it delivers through
    tension, not ease. The Shuddha-Pinda-7-of-7 combined with BVB.7 weakness
    means the authority is dramatic (visible, milestone-like) rather than
    quietly compounding. This is the "Authority-Through-Tension" pattern
    (UCN Part VII). The Sade Sati paradox confirmed that even maximum Saturnian
    compression produces achievement rather than destruction in this chart —
    because Moon is in own-sign Aquarius (Saturn's domain), and because the
    KP sub-lord of the gains house = the Yogi Planet. Saturn AD 2024-2027 is
    the highest-authority window in the entire Mercury MD. Any authority-related
    question — career seniority, institutional recognition, leadership — must
    route through RM.02.
```

---

```yaml
RM.03_JUPITER_EXALTED_4H:
  element: >
    PLN.JUPITER exalted in HSE.4 Cancer — the chart's dharmic foundation stone.
    9L+12L rulership (Sagittarius and Pisces). GK (Gnati Karaka) designation.
    Highest classical dignity of any planet in the chart.
  domains_primary: [D6_Spirit, D1_Career, D9_Travel]
  msr_anchors: [MSR.002, MSR.003, MSR.090, MSR.393]
  cdlm_anchors: [CDLM.D6.D1, CDLM.D6.D9, CDLM.D1.D9]

  constructive_resonance:
    - "Exaltation in Cancer: maximum dignity in maximum affinity sign;
      Jupiter's dharmic wisdom is at fullest expression"
    - "Triple aspect from 4H: Jupiter gazes on 8H (transformation/Ketu),
      10H (career/Mercury+Sun), and 12H (moksha/foreign) simultaneously —
      three critical houses all receive the most auspicious available aspect"
    - "9L in 4H (Kendra): Trikona lord in Kendra = classical raja yoga;
      the dharma lord is foundationally placed"
    - "Venus in 9H (Jupiter's own sign Sagittarius): Lakshmi in the Guru's
      house = dharmic and material abundance share the same address"
    - "GK designation: soul's knowledge-teacher role encoded at the karaka
      level; teaching and philosophy are what the soul needs to express"
    - "Moon AK in Aquarius = Saturn's sign; Saturn-Jupiter mutual endorsement
      (Jupiter aspects Moon's house; Moon AK's sign = Saturn's domain =
      Saturn's house-lord is Jupiter's dharmic twin)"
    - "12L lordship of moksha house: Jupiter governs the exit/moksha door
      from the most benefic possible position"

  destructive_resonance:
    - "12L role introduces expense-leakage: every dharmic expansion carries
      a moksha-cost encoded in Jupiter's dual lordship"
    - "4H = foundation, not executive: Jupiter's dharmic power is supportive
      from below, not executive from above; career delivery requires Saturn
      and Mercury more than Jupiter directly"
    - "Cancer = water rashi: Jupiter's wisdom is emotionally inflected,
      not systematically structured; fluid rather than architecturally
      predictable"
    - "D9 Jupiter status unverified (GAP): the D9 placement of Jupiter is not
      confirmed in v6.0; if Jupiter is weakened in D9, the foundation has
      soul-level cracks not visible in D1"

  net_resonance: STRONGLY AMPLIFIED
  interpretive_note: |
    Jupiter is the most purely constructive planet in this chart. Every major
    yoga depends on Jupiter's presence — Saraswati Yoga needs it, the Raja
    Yoga stack is built on its 9L exaltation, the entire spiritual-moksha
    track runs through its 12L role. Jupiter's single most important function
    is the triple aspect from 4H: simultaneously blessing the career house
    (10H), the transformation house (8H with Ketu), and the moksha house (12H).
    This means that when one asks "does the chart have dharmic authorization for
    career success AND spiritual growth AND foreign settlement?" — Jupiter
    answers yes to all three from the same fixed position. Jupiter should be
    invoked as the background authorization layer in any domain analysis.
```

---

```yaml
RM.04_SUN_10H:
  element: >
    PLN.SUN natal in HSE.10 Capricorn — raja-authority planet in career house.
    5L (Leo) in 10H Kendra. Digbala (directional strength in 10H). Conjoined
    Mercury. AL = Capricorn 10H = Sun's sign.
  domains_primary: [D1_Career, D7_Parents]
  msr_anchors: [MSR.264, MSR.005, MSR.310]
  cdlm_anchors: [CDLM.D1.D1, CDLM.D1.D7]

  constructive_resonance:
    - "Digbala in 10H: Sun gains directional strength in the career house;
      maximum solar power for public authority expression"
    - "5L in 10H: Trikona lord in Kendra = raja yoga; the intellect/creativity
      lord placed in the career house = creative output IS the career"
    - "AL = Capricorn 10H: public image = Sun's natal sign = the native's
      solar self-assertion is precisely what the world perceives"
    - "Jupiter aspects 10H: the dharmic giant authorizes the solar authority"
    - "Sunday birth (Vara = Sun's day): the birth moment amplifies solar
      quality as a constitutional imprint"
    - "Mercury conjoined: the solar-intellectual compound in career house
      creates leadership-through-intellect, not leadership-through-force"

  destructive_resonance:
    - "Enemy sign Capricorn: Sun = Saturn's enemy; in Capricorn, Sun must
      earn authority through Saturn's discipline — no entitlement available"
    - "Combustion of Mercury: Sun's proximity partially absorbs Mercury;
      solar fire risks overwhelming Mercury's communication agility"
    - "Moon in 11H opposes 5H Leo: the 5H = Sun's own sign is empty and
      under opposition from AK Moon = Sun's natural home-sign is challenged
      from the gains axis"
    - "Saturn as sign-dispositor and natural enemy: the highest-strength
      dispositor is simultaneously Sun's primary planetary enemy = the
      authority must be perpetually earned through the enemy's framework"

  net_resonance: AMPLIFIED
  interpretive_note: |
    Sun in 10H delivers the most classical confirmation of career and public
    authority. The digbala amplifies the raja-quality; the 5L placement creates
    the intellectual-creative-career compound. But Sun in Capricorn is a
    lesson in earning authority through effort rather than receiving it by
    right — this chart's public authority is not given; it is built through
    sustained Saturnian discipline. The AL = Capricorn alignment means the
    public image IS this solar-Saturnian compound: people see both the solar
    brilliance and the Saturnian demands. For career-authority questions,
    RM.04 and RM.01 must be read in tandem.
```

---

```yaml
RM.05_MOON_11H_AK:
  element: >
    PLN.MOON natal in HSE.11 Aquarius — Atmakaraka (AK, highest-degree planet).
    Own-sign (Aquarius = Saturn's secondary sign; Moon gains own-sign-like
    quality via Saturn's domain resonance). 11H = Labhasthana (gains house).
  domains_primary: [D8_Mind, D3_Relationships, D6_Spirit]
  msr_anchors: [MSR.396, MSR.397, MSR.007, MSR.361]
  cdlm_anchors: [CDLM.D8.D8, CDLM.D8.D1, CDLM.D3.D3]

  constructive_resonance:
    - "AK designation: the soul's elected representative; all chart events
      ultimately serve the soul's Moon-nature"
    - "11H = Labhasthana: AK in the gains house = the soul finds primary
      expression through networks, communities, and collective benefit"
    - "Own-sign (Aquarius): Moon in Saturn's domain = self-resonance with
      the chart's authority-system; soul and AmK are sign-aligned"
    - "Jupiter aspects 11H: the exalted dharmic planet blesses the AK's
      house = gains and soul-development are dharmically authorized"
    - "Saturn AmK aspects 11H (5th-house aspect from 7H): the institutional
      authority endorses the soul's gains-house"
    - "Sade Sati paradox: three-system confirmation that maximum Saturnian
      compression on AK produced achievement; Moon's resilience is empirically
      validated"
    - "Karakamsa: D9 Moon = Gemini → Mercury as Karakamsa lord → soul's
      purpose expression is Mercury-governed = confirms Mercury 7-system"

  destructive_resonance:
    - "Aquarius = Saturnian discipline: Moon must operate through Saturn's
      framework rather than natural lunar softness and receptivity"
    - "5H Leo empty, opposing Moon: Moon's opposition to the empty 5H creates
      tension between soul-gains (11H) and creative progeny (5H) themes"
    - "Ketu MD upcoming 2031-2038: the chart's next major period will challenge
      Moon AK's gains-orientation with headless detachment from material
      achievement"
    - "AK in upachaya house: 11H = upachaya = things improve with effort and
      time; the soul's journey is not immediately resolved but cumulative"

  net_resonance: AMPLIFIED
  interpretive_note: |
    As AK, Moon is the chart's master-resonator — the highest-frequency node
    through which all events are ultimately filtered. In 11H Aquarius, the
    soul has elected gains-through-community as its primary expression mode.
    The own-sign placement provides the paradox-resolution for Sade Sati: when
    Saturn transits Aquarius (the Sade Sati mid-phase), it returns to its own
    sign — where Moon already operates comfortably — which is why three systems
    confirm achievement rather than destruction. Any spiritual or psychological
    question must begin here; Moon AK is the chart's ultimate interpretive
    destination.
```

---

```yaml
RM.06_MARS_7H:
  element: >
    PLN.MARS natal in HSE.7 Libra — PK (Putrakaraka) designation.
    In enemy sign (Libra = Venus-ruled; Mars-Venus enmity). Co-tenant with
    Saturn (exalted). Aspects 10H (4th-house aspect) and 2H (7th-house aspect).
  domains_primary: [D3_Relationships, D5_Children, D1_Career]
  msr_anchors: [MSR.391, MSR.008, MSR.310]
  cdlm_anchors: [CDLM.D3.D3, CDLM.D5.D1, CDLM.D3.D1]

  constructive_resonance:
    - "Co-tenancy with exalted Saturn: the house tone is elevated by Saturn's
      exaltation, which partially lifts Mars's expression despite enemy-sign"
    - "PK designation: Mars = karaka for progeny/disciples; 7H placement =
      student-guru dynamic embedded in professional partnerships"
    - "4th-house aspect on 10H: Mars's gaze fuels the career house with
      martial drive and executive energy"
    - "7th-house aspect on 2H Rahu: Mars's energy reaches the resource-
      accumulation house; desire-alignment with material ambition"
    - "Hora Lagna 7H (HL in Mars's house): wealth channel and Mars's tension
      share the same address = the frustration has material productivity"

  destructive_resonance:
    - "Enemy sign: dignity significantly compromised; Mars cannot fully
      express its executive strength in Venus's diplomatic terrain"
    - "Natural enmity with Saturn: the two co-tenants are natural enemies =
      chronic friction in the chart's most important house"
    - "7L Venus absent: the house lord is in 9H = Mars and Saturn must govern
      7H without the house's natural ruler present"
    - "BVB.7 weakness: even Mars's tension-output cannot compensate for the
      house-container's structural weakness"
    - "PK with compromised dignity: children/disciples significations carry
      difficulty and demand rather than flowing grace"

  net_resonance: TENSION-BEARING
  interpretive_note: |
    Mars in 7H is the chart's primary tension-bearing planet. Its enemy-sign
    placement means every 7H output — partnerships, collaborations, the
    public-facing relationship structure — is earned through friction. Yet this
    friction is precisely what generates the Authority-Through-Tension pattern
    (UCN Part VII): the executive drive (Mars) and institutional patience
    (Saturn) in the same house create a pressure-cooker that, under the right
    timing (Saturn AD, BB activation), produces authority outputs that smooth-
    chart combinations cannot. Mars is not a liability; it is the tension-spring
    that makes Saturn's exaltation consequential rather than academic.
```

---

```yaml
RM.07_RAHU_2H:
  element: >
    PLN.RAHU natal in HSE.2 Taurus — in Venus's sign, the sign most associated
    with material accumulation. 2H = Dhana (wealth house). Unobstructed Jaimini
    Argala on Lagna (MSR.329). Arudha A6 also in Taurus 2H.
  domains_primary: [D2_Wealth, D3_Relationships]
  msr_anchors: [MSR.329, MSR.009, MSR.311]
  cdlm_anchors: [CDLM.D2.D2, CDLM.D2.D3]

  constructive_resonance:
    - "Venus-ruled sign Taurus: Rahu in the most resource-aligned sign gains
      benefic hue via Venus's Lakshmi-quality"
    - "Unobstructed Argala on 1H Lagna (MSR.329): Virodha = 12th from 2H =
      1H Aries = empty = maximum-strength unobstructed Argala on the self"
    - "Jupiter aspects 2H from 4H: the exalted benefic's gaze on Rahu's
      house = dharmic correction and expansion of the desire-engine"
    - "2H = family/speech/wealth: Rahu amplifies all three simultaneously —
      unconventional speech, unusual family karma, amplified wealth desire"
    - "Taurus as fixed sign: Rahu's amplification is stable and persistent,
      not erratic — the desire for accumulation is structurally consistent"

  destructive_resonance:
    - "Nodal nature = karmic: 2H Rahu creates resource-karma that must be
      consciously earned; passive accumulation carries karmic debt"
    - "Opposition to 8H Ketu: the Rahu-Ketu axis across 2H-8H = the
      resource-vs-transformation polarity; accumulation (2H) must be paired
      with radical transformation (8H) or the axis becomes congested"
    - "A6 = Taurus 2H (same sign as Rahu): the appearance of wealth is
      co-located with the Arudha of debt/enemies = wealth's public face
      carries enemy/debt undertones"
    - "Rahu's inherent exaggeration: 2H speech and family themes are
      amplified beyond natural proportion; requires conscious calibration"

  net_resonance: AMPLIFIED
  interpretive_note: |
    Rahu in 2H Taurus is the chart's resource-desire amplifier. The unobstructed
    Argala on Lagna (MSR.329) means this node directly shapes the self — the
    native's desires leak directly into identity. The Venus-ruled sign modulates
    the raw Rahu desire through aesthetic and relational channels, making the
    resource hunger more productive than purely material. The A6 co-location is
    worth noting: the Arudha of debts and enemies sits in the same sign as the
    desire-engine — this means the wealth accumulation narrative is perpetually
    shadowed by an enemy-or-debt subplot. This is not a warning to avoid
    accumulation but a flag to maintain conscious karma-hygiene with resources.
```

---

```yaml
RM.08_KETU_8H:
  element: >
    PLN.KETU natal in HSE.8 Scorpio — moksha node in the house of occult and
    transformation. Sign affinity (Scorpio = Mars-ruled; Ketu co-resonant with
    Mars in many schools). Upcoming MD lord (2031-2038). Varnada + Ghati Lagna
    also in Scorpio 8H.
  domains_primary: [D6_Spirit, D4_Health, D9_Travel]
  msr_anchors: [MSR.010, MSR.389, MSR.331]
  cdlm_anchors: [CDLM.D6.D6, CDLM.D6.D9, CDLM.D4.D6]

  constructive_resonance:
    - "Sign affinity Scorpio 8H: Ketu's occult-moksha nature aligns perfectly
      with 8H's occult-transformation nature and Scorpio's depth-orientation"
    - "Varnada Lagna Scorpio 8H (v6.0 §12.1): Varnada in Ketu's house =
      transformation-status is encoded in the birth chart's secret architecture"
    - "Ghati Lagna Scorpio 8H (v6.0 §12.1): GL = pinnacle-indicator; Ketu's
      house = the occult/transformation domain as a life-pinnacle marker"
    - "Jupiter aspects 8H (5th-house aspect from 4H): the dharmic giant
      authorizes Ketu's moksha push from the most auspicious available planet"
    - "Ketu MD 2031-2038 upcoming: the node becomes the primary time-lord
      after Mercury MD; the chart turns toward moksha at mid-life"
    - "Jaimini Rashi Drishti: Ketu (Scorpio, fixed) aspects Aries, Cancer,
      Capricorn = gazes on Lagna, Jupiter's house, and career house =
      the moksha node oversees all key dharmic stations"

  destructive_resonance:
    - "8H = dushtana: even with sign affinity, Ketu amplifies 8H's challenging
      themes — sudden events, hidden losses, health vulnerabilities"
    - "Ketu = headless node: no appetite for material outcomes; 8H Ketu
      actively suppresses desire for recognition and accumulation"
    - "Rahu-Ketu axis 2-8: the resource-transformation polarity under nodal
      occupation; the axis must be lived, not resolved"
    - "Ketu MD at mid-life (2031-2038, age 47-54): the shift from Mercury's
      career-intellect to Ketu's headless detachment may feel like collapse of
      everything Mercury MD built — but is actually necessary transition"

  net_resonance: AMPLIFIED for spiritual/transformation; TENSION-BEARING for material
  interpretive_note: |
    Ketu in 8H is the chart's moksha pointer. Its presence in Scorpio 8H is
    one of the strongest placements for occult ability, hidden knowledge, and
    genuine spiritual transformation available in classical Jyotish. The Ketu
    MD from 2031 will be the most spiritually intense period of the native's
    life — the entire Mercury-built career infrastructure will be tested by
    Ketu's headless withdrawal from material identification. Importantly, the
    Varnada and GL both in Scorpio 8H mean that Ketu's house is the chart's
    secret pinnacle — what looks like the house of crises is actually the house
    of the chart's deepest authority. For health and spiritual questions,
    RM.08 is the primary routing node.
```

---

```yaml
RM.09_VENUS_9H:
  element: >
    PLN.VENUS natal in HSE.9 Sagittarius — 2L+7L in the primary Dharma house.
    Shree Lagna co-occupant (SL = Sagittarius 9H, v6.0 §12.1). Saraswati Yoga
    pillar (Jupiter + Mercury + Venus). MK (Matrikaraka) designation.
  domains_primary: [D6_Spirit, D3_Relationships, D2_Wealth]
  msr_anchors: [MSR.004, MSR.011, MSR.393]
  cdlm_anchors: [CDLM.D6.D3, CDLM.D6.D2, CDLM.D3.D2]

  constructive_resonance:
    - "9H = primary Dharma house: Venus in the most auspicious trikona =
      the benefic's expression is at dharmic maximum"
    - "Shree Lagna in Sagittarius 9H (v6.0 §12.1): SL = Lakshmi's entry
      point; Venus = Lakshmi's planet; double Lakshmi signature in 9H"
    - "Jupiter as sign-dispositor (Jupiter rules Sagittarius): Venus operates
      within the Guru's domain = aesthetic and dharmic intelligence reinforce
      each other"
    - "Saraswati Yoga completion: Mercury (10H) + Jupiter (4H) + Venus (9H)
      = the classical intelligence triad in Kendra-Kendra-Trikona"
    - "MK designation: Venus = the mother's karaka; 9H placement = the
      mother's influence is spiritual, dharmic, and expansive"
    - "As 7L: Venus in 9H = the spouse/partnership indicator in the dharma
      house = partners bring philosophical/spiritual dimension to the native"

  destructive_resonance:
    - "Away from 7H as 7L: the governance gap — Venus rules the house of
      partnerships but governs from 9H; 7H themes lack their natural steward"
    - "Away from 2H as 2L: wealth lord in 9H = the resource-accumulation
      function is displaced into dharmic aspiration rather than material
      management; Dhana yoga is deferred"
    - "Jupiter's domain constrains Venus: in Sagittarius, Venus must express
      through the Guru's philosophical framework rather than pure Venusian
      aesthetics"

  net_resonance: AMPLIFIED for dharmic/spiritual; DEFERRED for partnership-wealth
  interpretive_note: |
    Venus in 9H is the chart's dharmic benefic — it ensures that the spiritual
    and aesthetic domains are abundantly supported. The double Lakshmi signature
    (Shree Lagna + Venus) in Sagittarius 9H is one of the chart's most
    quietly powerful configurations. However, Venus's absence from both its
    lord-houses (2H and 7H) means that the wealth and partnership domains
    must be accessed through indirect routes: wealth through Saturn's authority
    (HL in 7H, Saturn AD) rather than Venus's direct governance, and
    partnerships through Mercury's DK role rather than Venus's 7L stewardship.
    Venus thrives here as the dharmic background support; it struggles as a
    direct material executor.
```

---

## §2 — House Resonance Entries

---

```yaml
RM.10_HSE_7_LIBRA:
  element: >
    HSE.7 Libra — the chart's Supreme Convergence Container. Contents: Saturn
    (exalted, AmK) + Mars (PK). Special lagnas: Hora Lagna. Progressions: BB
    arrives 2025-2026. KP confirmed: sub-lord = Saturn. MSR.391 documents the
    seven-layer convergence.
  domains_primary: [D3_Relationships, D1_Career, D2_Wealth]
  msr_anchors: [MSR.391, MSR.001, MSR.008, MSR.311, MSR.388]
  cdlm_anchors: [CDLM.D3.D3, CDLM.D3.D1, CDLM.D1.D2]

  constructive_resonance:
    - "Saturn exalted: the highest-dignity planet occupies this house;
      7H operates at maximal Saturn-frequency"
    - "Hora Lagna in 7H: the wealth-channel lagna is in this house;
      material prosperity flows through 7H's themes"
    - "BB arrives 2025-2026: the chart's most potent temporal trigger
      activates ALL of the 7H's accumulated seven-layer convergence"
    - "Saturn AD 2024-2027 encompasses BB activation: authority-delivery
      sub-period and temporal trigger overlap precisely"
    - "Libra = natural 7th sign: the house is in its natural zodiacal
      correspondence = maximum sign-house resonance"
    - "KP sub-lord = Saturn confirmed: KP analysis validates Saturn as
      the primary activator; the house delivery mechanism is confirmed"
    - "Jupiter aspects 7H (4th-house aspect from 4H): the most benefic
      planetary aspect falls on this house"

  destructive_resonance:
    - "BVB below threshold: multiply-loaded house with a structurally weak
      container; the weight of seven layers exceeds the house's bhavabala"
    - "Mars-Saturn natural enmity: the two co-tenants are enemies; chronic
      friction is the house's operational baseline"
    - "Venus = 7L absent in 9H: the natural house steward governs from three
      houses away; the 7H is self-governing through its tenants alone"
    - "Shuddha Pinda rank 7 of 7 for Saturn: episodic, high-visibility
      delivery rather than quiet compounding"

  net_resonance: STRONGLY AMPLIFIED with tension-bearing container
  interpretive_note: |
    The 7H is the chart's most multiply-loaded chamber. Seven independent
    classical layers confirm it as the site of the chart's most consequential
    events (MSR.391). The paradox is that this supreme-convergence house has
    a weak structural container (BVB below threshold) — meaning the events it
    produces are high-amplitude, high-visibility, and episodic rather than
    quietly persistent. The BB activation in 2025-2026 will be the most potent
    7H event of the native's life to date. All relationship, partnership,
    public-facing collaboration, and wealth-channel questions must begin here.
```

---

```yaml
RM.11_HSE_10_CAPRICORN:
  element: >
    HSE.10 Capricorn — the Career-Dharma Engine. Contents: Sun (5L, digbala)
    + Mercury (Vargottama, MD lord). AL = Capricorn. Receives: Jupiter's 7th-
    house aspect, Saturn's 4th-house aspect, Mars's 4th-house aspect.
  domains_primary: [D1_Career, D2_Wealth, D8_Mind]
  msr_anchors: [MSR.413, MSR.264, MSR.005, MSR.388, MSR.390]
  cdlm_anchors: [CDLM.D1.D1, CDLM.D1.D2, CDLM.D8.D1]

  constructive_resonance:
    - "Sun + Mercury stellium: solar authority and mercurial intellect in
      the same career house = the leadership-through-intelligence compound"
    - "AL = Capricorn 10H: public image IS the career house; reputation and
      actual work are unified, not split"
    - "Jupiter 7th-house aspect from 4H: the most auspicious aspect in the
      chart falls on this house; dharmic authorization of career peak"
    - "Saturn 4th-house aspect from 7H: AmK gazes on the career house;
      institutional authority endorses the career stellium"
    - "Mars 4th-house aspect from 7H: martial drive fuels the career house
      with executive energy from below"
    - "Digbala Sun: maximum directional strength for solar authority in 10H"
    - "Mercury Vargottama: D1=D9 position doubles the career promise's depth"

  destructive_resonance:
    - "Saturn-ruled sign for Sun: Sun must earn authority through its
      enemy's terrain; the career domain is earned, not given"
    - "Mercury combustion: MD lord and career stellium partner too close;
      intellectual agility risks solar absorption in high-visibility moments"
    - "Mercury's 3L+6L role: the career house's primary planet simultaneously
      activates obstacle and debt themes during its own MD"

  net_resonance: STRONGLY AMPLIFIED
  interpretive_note: |
    The 10H is the chart's most clean-power house — unlike the 7H, which carries
    structural tension, the 10H's challenges are contextual (earned authority,
    combustion) rather than structural. The triple aspect reception (Jupiter,
    Saturn, Mars all gazing on 10H) makes this house one of the most aspect-
    protected career chambers possible. AL = 10H means the public narrative
    of this native's life IS the career — there is no gap between who they are
    publicly and what they do professionally. Mercury MD 2014-2031 is the
    full activation of this house's accumulated promise.
```

---

```yaml
RM.12_HSE_12_PISCES:
  element: >
    HSE.12 Pisces — the Foreign/Moksha Gateway. Jupiter as 12L in own sign.
    D9 12H reportedly carries a stellium. Receives Jupiter's 9th-house aspect
    from 4H. Upcoming Ketu MD (2031-2038) will intensify this house's themes.
  domains_primary: [D9_Travel, D6_Spirit]
  msr_anchors: [MSR.389, MSR.012, MSR.394]
  cdlm_anchors: [CDLM.D9.D6, CDLM.D9.D9, CDLM.D6.D6]

  constructive_resonance:
    - "Jupiter as 12L in own sign Pisces: the moksha/foreign house is governed
      by the most auspicious planet from its own domain = exits and spiritual
      liberation are divinely governed"
    - "Jupiter 9th-house aspect from 4H: Jupiter gazes on its own house;
      the 12H receives the dharmic giant's direct benediction"
    - "Ketu 8H resonance: Ketu = moksha by nature; 12H = moksha by house;
      the chart has both in mutual aspect-support"
    - "D9 12H stellium (pending full verification): if multiple D9 planets
      occupy Pisces, the soul's deepest karma lies in foreign/moksha themes"
    - "Pisces = Jupiter's own sign: the most spiritually charged sign for
      the chart's most spiritually significant house"

  destructive_resonance:
    - "12H = dushtana: house of losses, confinement, exile; even with
      Jupiter's lordship, the 12H's dushtana quality is irreducible"
    - "Jupiter's 12L role introduces expense-cost: every Jupiter-event
      carries a 12H price tag — dharmic expansion costs resources"
    - "Ketu MD 2031-2038 activation: the 12H's moksha themes will become
      dominant at mid-life, potentially disrupting the Mercury-built career"

  net_resonance: AMPLIFIED for spiritual/foreign; CHALLENGING for loss-avoidance
  interpretive_note: |
    The 12H in this chart is not the house to fear but the house to prepare for.
    Jupiter's lordship ensures that the exits available in this chart are
    dharmic exits — foreign settlement, spiritual withdrawal, moksha preparation
    — rather than destructive losses. The D9 12H stellium (if confirmed at full
    verification) would make this chart one with deep moksha-architecture at
    the soul level. The native should understand that the 12H's themes (foreign
    country, spiritual practice, retreat, research) are not departures from the
    life's mission but expressions of it in its most advanced form.
```

---

```yaml
RM.13_HSE_4_CANCER:
  element: >
    HSE.4 Cancer — the Dharmic Foundation. Jupiter exalted here. Moon's own
    sign (Cancer = Moon-ruled; Moon = AK). Junction of dharma-base and
    Jupiter's triple aspect. GK Jupiter as 4H tenant.
  domains_primary: [D7_Parents, D6_Spirit, D1_Career]
  msr_anchors: [MSR.002, MSR.003, MSR.090]
  cdlm_anchors: [CDLM.D7.D6, CDLM.D7.D1, CDLM.D6.D1]

  constructive_resonance:
    - "Jupiter exalted Cancer: the most auspicious configuration in the chart
      occupies the house of foundations; all else in the chart is built on
      this exalted base"
    - "Cancer = Moon's sign; Moon = AK: the soul's elected sign holds
      the chart's most auspicious planet; AK and GK are sign-aligned"
    - "Jupiter's triple aspect from 4H covers 8H + 10H + 12H: one fixed
      position blesses transformation, career, and moksha simultaneously"
    - "4H = home, mother, education, inner life: Jupiter's exaltation here
      means the native's psychological roots, maternal bond, and educational
      foundation are all Jupiter-quality = vast, dharmic, wise"
    - "GK + 9L + 12L combined: Jupiter teaches (GK), dharma-authorizes (9L),
      and moksha-governs (12L) from the chart's psychological foundation"

  destructive_resonance:
    - "4H is not career-executive: Jupiter supports career through aspect,
      not through co-presence; it's foundational, not operational"
    - "Cancer = water = emotional fluctuation: Jupiter's wisdom is fluid,
      emotionally responsive — sometimes indecisive under direct pressure"
    - "12L leakage: Jupiter's 12L role introduces expense-cost into the
      4H's otherwise pure benefic expression"

  net_resonance: STRONGLY AMPLIFIED
  interpretive_note: |
    The 4H is the chart's bedrock — it is the most structurally sound of all
    the chart's key houses (unlike the 7H with BVB weakness, the 4H is
    supported by the most auspicious planet at maximum dignity). This means
    the native's foundations — psychological, educational, maternal — are
    deeply and durably supported. Jupiter's triple aspect from this location
    makes the 4H the chart's most consequential single planetary placement in
    terms of range of influence. Any question about the native's educational
    background, early life resources, or psychological foundation routes
    through RM.13.
```

---

## §3 — Yoga Resonance Entries

---

```yaml
RM.14_SARASWATI_YOGA:
  element: >
    Saraswati Yoga: Mercury (10H Kendra) + Jupiter (4H Kendra) + Venus (9H
    Trikona). The classical intelligence-creativity triad in Kendra-Kendra-
    Trikona configuration. Confirmed complete in this chart.
  domains_primary: [D8_Mind, D1_Career, D6_Spirit]
  msr_anchors: [MSR.100, MSR.002, MSR.004, MSR.388]
  cdlm_anchors: [CDLM.D8.D1, CDLM.D6.D1, CDLM.D8.D8]

  constructive_resonance:
    - "All three yogakarakas in strong houses (10H+4H+9H): maximum yoga
      strength by placement; no yogakara is weakened by house position"
    - "Mercury MD active 2014-2031: the yoga's primary planet is the
      current time-lord = Saraswati Yoga fires fully for 17 years"
    - "Mercury as Yogi Planet: the yoga's central planet is simultaneously
      the chart's fortune-bestower = double-activation of creative intelligence"
    - "Jupiter exalted: the wisdom pillar of the yoga is at maximum dignity;
      the dharmic authorization of intelligence is unblemished"
    - "Venus in Shree Lagna's sign (9H Sagittarius): the aesthetic pillar of
      the yoga is in the Lakshmi-entry sign = creative intelligence is
      materially blessed"

  destructive_resonance:
    - "Venus's 2L+7L role partially diverts its Saraswati contribution:
      the aesthetic pillar must simultaneously manage resource and partnership
      demands"
    - "Mercury combustion: the yoga's primary planet has solar proximity risk;
      the full creative expression may be modulated by authority demands"
    - "Saturn and Mars outside the yoga: the chart's tension-bearers are not
      part of the yoga; implementation of the yoga's outputs requires a
      separate authority-and-drive mechanism"

  net_resonance: STRONGLY AMPLIFIED
  interpretive_note: |
    Saraswati Yoga is the chart's intellectual-creative mandate. It explains
    why career success is inseparable from intellectual and aesthetic
    excellence — this native does not succeed by brute authority (that would
    be a Ruchaka or Sasha yoga chart) but by intelligence, teaching, and
    creative mastery. During Mercury MD (2014-2031), the yoga fires at peak
    intensity. The Saturn-and-Mars absence from the yoga explains the pattern:
    when the native must shift from creative intelligence into pure execution
    and institutional authority, a different planetary mechanism (Saturn AmK,
    Mars PK) must be invoked — the yoga itself does not provide execution power.
```

---

```yaml
RM.15_NEECHA_BHANGA_D9_SATURN:
  element: >
    Neecha-Bhanga Rashi (NBR) for Saturn in D9 — the chart's delayed-peak
    reserve mechanism. Saturn's D9 debilitation is canceled by cancellation
    conditions. D1 exaltation + D9 NBR = two different strength-layers,
    active on different planes.
  domains_primary: [D1_Career, D3_Relationships]
  msr_anchors: [MSR.091, MSR.311]
  cdlm_anchors: [CDLM.D1.D3, CDLM.D1.D1]

  constructive_resonance:
    - "D1 exaltation + D9 NBR: D1 provides present-plane authority; D9 NBR
      provides soul-plane resilience; the two layers are complementary"
    - "Saturn AD 2024-2027: both D1 strength and D9 NBR are active
      simultaneously during the current sub-period"
    - "Mercury MD parent (2014-2031): the NBR's delayed-peak fires within
      Mercury's intellectual framework = authority delivered through
      intelligence, not brute execution"
    - "Saturn MD upcoming (2040s-2060s): the D9 NBR's most dramatic expression
      may not be in this life's Saturn AD but in the much later Saturn MD —
      a reserve for a future peak"

  destructive_resonance:
    - "NBR is conditional: cancellation requires specific computational
      conditions; if any condition is not met, the residual debilitation
      partially operates"
    - "Delayed-peak profile: the NBR's strength arrives LATER than D1 alone
      would predict; the reserve is not available immediately on demand"
    - "D9 ambivalence: even with NBR, D9 Saturn carries soul-level tension
      about authority — the native may achieve institutional authority while
      privately questioning it"

  net_resonance: AMPLIFIED with delayed-peak profile
  interpretive_note: |
    The D9 Neecha-Bhanga is the chart's hidden resilience layer. It explains
    why Saturn's apparent vulnerabilities (BVB.7 weakness, Shuddha Pinda rank
    7, Sade Sati compression) do not translate into permanent authority-collapse:
    the soul-lens carries a bounce-back mechanism. This is most important for
    long-range readings: in the native's 50s and 60s, when Saturn MD activates,
    the D9 NBR will produce a late-career resurgence that cannot be predicted
    from D1 alone.
```

---

```yaml
RM.16_RAJA_YOGA_STACK:
  element: >
    The collection of confirmed Raja Yogas: (1) Jupiter as 9L exalted in 4H
    Kendra (Trikona-lord in Kendra); (2) Sun as 5L in 10H Kendra (Trikona-lord
    in Kendra); (3) Saturn as 10L exalted 7H Kendra (Kendra-lord at maximum
    dignity); (4) Modified DKA: Jupiter 9L and Saturn 10L both aspect 10H
    simultaneously.
  domains_primary: [D1_Career, D2_Wealth]
  msr_anchors: [MSR.100, MSR.101, MSR.102, MSR.388]
  cdlm_anchors: [CDLM.D1.D1, CDLM.D1.D2]

  constructive_resonance:
    - "Three independent raja yogas confirmed: each yoga is valid independently;
      the stack creates layered raja-quality that no single yoga alone provides"
    - "Jupiter 9L in 4H: the most powerful trikona lord (9H = dharma peak)
      in a Kendra = foundational raja yoga"
    - "Sun 5L in 10H: the 5H trikona lord in the 10H Kendra = the creative-
      intellectual authority compound = raja yoga through creative output"
    - "Saturn 10L exalted: the Kendra lord at maximum dignity = Mahapurusha
      Yoga (Sasha) quality; authority through Saturnian mastery"
    - "Modified DKA (9L + 10L both aspecting 10H): though Jupiter and Saturn
      don't conjoin, both gaze on the same career house = DKA-equivalent"
    - "Mercury MD activates the yoga stack: the current time-lord is in the
      primary raja-yoga house (10H) = the stack is firing NOW"

  destructive_resonance:
    - "Dushtana lords also active (Mercury 6L, Mars 8L): the raja yogas
      coexist with dushtana-lord activations; peaks and obstacles are
      concurrent"
    - "No pure DKA conjunction: the 9L and 10L don't share a house;
      the DKA effect operates through aspect, not co-presence = slightly
      diluted compared to a perfect conjunction"
    - "Raja yoga timing: yogas fire in dasha of the participating planets;
      full expression requires waiting for the correct time-lord activation"

  net_resonance: STRONGLY AMPLIFIED
  interpretive_note: |
    The Raja Yoga stack is the formal classical certification of this chart's
    career-authority promise. The three independent yogas (Jupiter 9L, Sun 5L,
    Saturn 10L) provide redundant confirmation: even if one yoga is weakened
    by transit or dasha, the other two remain operational. The modified DKA
    — where both 9L and 10L simultaneously gaze on the career house — is
    functionally equivalent to a full DKA conjunction for practical prediction
    purposes. Mercury MD is the primary activation period.
```

---

## §4 — Dasha Resonance Entries

---

```yaml
RM.17_MERCURY_MD_2014_2031:
  element: >
    Vimshottari Mercury Mahadasha 2014-2031. Mercury as MD lord = Natal 10H
    planet + Yogi Planet + Jaimini DK + Karakamsa lord + KP 11H sub + Vargottama.
    The chart's central temporal activation. 17-year window.
  domains_primary: [D1_Career, D2_Wealth, D8_Mind, D3_Relationships]
  msr_anchors: [MSR.413, MSR.388, MSR.390, MSR.311]
  cdlm_anchors: [CDLM.D1.D1, CDLM.D8.D1, CDLM.D1.D2]

  constructive_resonance:
    - "MD lord = natal 10H planet: the career house's primary planet governs
      the 17-year period = maximum self-resonance"
    - "Mercury as Yogi Planet: the MD lord IS the chart's fortune-bestower;
      during its own MD, fortune is self-activating"
    - "Mercury as DK (Jaimini): the MD lord is also the marriage-karaka;
      partnership themes surge during this MD"
    - "Saraswati Yoga fires: the yoga's central planet is the MD lord;
      the entire creative-intelligence triad is active 2014-2031"
    - "Saturn AD 2024-2027 within Mercury MD: the highest-authority sub-period
      amplifies the MD's career delivery in its second decade"
    - "Vargottama Mercury: D1=D9 doubles the depth; the MD's promise is
      anchored at the soul level, not just the circumstantial level"

  destructive_resonance:
    - "3L+6L activation concurrent: the MD lord activates obstacle and
      debt/health themes alongside career peaks; gains and friction are
      concurrent outputs"
    - "Combustion modulates peak: the MD lord's solar proximity means
      some of the MD's fruits require sacrifice of self-expression for
      solar-authority recognition"
    - "MD longevity risk: 17 years is an extremely long period; the second
      half (2022-2031) may feel qualitatively different from the first half
      as Ketu AD approaches"

  net_resonance: STRONGLY AMPLIFIED
  interpretive_note: |
    Mercury MD is the chart's defining temporal activation and the period
    during which the entire MSR, CDLM, and RM analysis is most immediately
    applicable. The seven-system convergence (MSR.413) means that Mercury's
    MD is not merely a Vimshottari activation but a convergence of seven
    independent classical systems all pointing to this period as the native's
    career-intellectual peak. Any question about "what is happening now" or
    "what should I focus on" must begin with RM.17.
```

---

```yaml
RM.18_SATURN_AD_2024_2027:
  element: >
    Saturn Antardasha within Mercury MD, approximately 2024-2027. Saturn as
    AD lord = natal exalted 7H planet + AmK + D9 NBR + BB activation window.
    The highest-authority sub-period in the entire Mercury MD.
  domains_primary: [D1_Career, D3_Relationships, D2_Wealth]
  msr_anchors: [MSR.391, MSR.001, MSR.396, MSR.311]
  cdlm_anchors: [CDLM.D1.D1, CDLM.D3.D3, CDLM.D1.D2]

  constructive_resonance:
    - "AD lord = natal planet: maximum sub-period self-resonance; Saturn
      activates its own natal promise from 7H exaltation"
    - "D1 exaltation + D9 NBR simultaneously active: both strength-layers
      of Saturn operational during its AD"
    - "BB arrival at 7H/3H area 2025-2026: the chart's temporal trigger
      activates precisely within the Saturn AD window"
    - "Sade Sati paradox validation: the three-system confirmation that
      Saturn's periods produce paradoxical achievement"
    - "Jupiter aspects Saturn's house: dharmic backing for the authority
      delivery during AD"
    - "HL in 7H: the wealth-channel lagna's house is activated during
      Saturn's AD = wealth-delivery coexists with authority-delivery"

  destructive_resonance:
    - "Saturn AD within Mercury MD = 7H tensions surface: the partnership/
      7H themes of Saturn's frustrations become more operationally present"
    - "Saturn-Mercury dasha combination: Saturnian institutional weight can
      suppress Mercury's communicative agility in high-pressure moments"
    - "Saturn AD ends ~2027: after this, Ketu AD begins within Mercury MD —
      the tone shifts dramatically from authority-delivery toward detachment"

  net_resonance: STRONGLY AMPLIFIED (the chart's current peak delivery window)
  interpretive_note: |
    Saturn AD 2024-2027 is the most consequential sub-period of the entire
    Mercury MD. The BB arrival within this window (2025-2026) creates a once-
    per-cycle concentration of activation — the temporal trigger (BB), the
    authority-delivery mechanism (Saturn AD), and the career-peak period
    (Mercury MD) all overlap simultaneously. This window should be treated as
    the chart's primary action window: institutional decisions, authority-
    confirmation events, and partnership-defining events made in 2024-2027
    will have disproportionate long-term consequence.
```

---

```yaml
RM.19_KETU_MD_2031_2038:
  element: >
    Vimshottari Ketu Mahadasha 2031-2038 (upcoming). Ketu = moksha node,
    natal 8H Scorpio. Age 47-54 during this MD. Varnada + Ghati Lagna both
    in Ketu's house. The chart's post-Mercury transition into moksha-frequency.
  domains_primary: [D6_Spirit, D9_Travel, D4_Health]
  msr_anchors: [MSR.010, MSR.389, MSR.331]
  cdlm_anchors: [CDLM.D6.D6, CDLM.D6.D9, CDLM.D4.D6]

  constructive_resonance:
    - "Ketu 8H Scorpio: MD lord in its most comfortable placement; sign
      and house affinity both present = strong MD delivery"
    - "Varnada + GL both in Scorpio 8H: Ketu's house carries the chart's
      secret pinnacle markers; the MD activates the highest hidden potential"
    - "Jupiter aspects 8H (5th-house aspect): the dharmic giant blesses
      Ketu's MD house; the moksha push is dharmically authorized"
    - "Jaimini rashi drishti: Ketu aspects Aries (Lagna) during its MD =
      deep interiority and self-examination = the correct experience for
      a mid-life moksha period"
    - "Ketu's occult mastery: 8H Ketu accumulates hidden knowledge during
      Mercury MD; the Ketu MD is when this knowledge is fully expressed"

  destructive_resonance:
    - "Headless detachment: Ketu MD will suppress appetite for material
      recognition; Mercury-built career infrastructure may feel hollow"
    - "Age 47-54 = mid-life: Ketu MD at this stage is a mid-life moksha-pull;
      career trajectory built during Mercury MD faces voluntary disruption"
    - "8H dushtana themes: sudden events, health vulnerabilities, secret
      enemies — the MD activates 8H's challenging nature alongside its gifts"
    - "Mercury MD's unfinished business: anything deferred from Mercury MD
      into Ketu years will not be cooperated with by the headless node"

  net_resonance: AMPLIFIED for spiritual/moksha; CHALLENGING for material continuity
  interpretive_note: |
    Ketu MD is not to be feared but prepared for. The native's task during
    Mercury MD (through 2031) is to build the material and career structures
    firmly enough that Ketu MD's inevitable withdrawal does not create collapse
    but liberation. The Varnada and GL in Ketu's house mean this MD carries
    the chart's highest hidden potential — what looks like the house of crises
    is actually the house of the most genuine authority. Foreign settlement,
    deep spiritual practice, retreat and study — these are Ketu MD's optimal
    expressions. Plan for them before 2031.
```

---

## §5 — Chara Karaka Resonance Entries

---

```yaml
RM.20_MOON_AK_SOUL_RESONANCE:
  element: >
    Moon as Atmakaraka (AK) — highest-degree planet = soul's elected
    representative. AK in 11H Aquarius. D9 Moon = Gemini → Mercury as
    Karakamsa lord. AK designation means: all chart events ultimately
    serve Moon's soul-mission.
  domains_primary: [D6_Spirit, D8_Mind, D3_Relationships]
  msr_anchors: [MSR.007, MSR.396, MSR.397, MSR.361]
  cdlm_anchors: [CDLM.D6.D8, CDLM.D8.D8, CDLM.D6.D6]

  constructive_resonance:
    - "AK in 11H Labhasthana: the soul has elected gains/network as its
      primary expression mode; material and communal benefit = soul's path"
    - "Karakamsa = Gemini (D9 Moon): Mercury as Karakamsa lord = confirms
      the Mercury seven-system convergence at the deepest soul level"
    - "Own-sign (Aquarius = Saturn's domain): AK operates in resonance with
      the chart's authority-system; soul and AmK are sign-aligned"
    - "Jupiter gazes on 11H: the most auspicious planet blesses the AK's
      house = gains and soul-development are dharmically authorized"
    - "Sade Sati paradox: three-system confirmation that AK survived maximum
      Saturnian compression with achievement output = soul-resilience empirically
      validated"
    - "Devata retrodiction (MSR.397): chart predicted Vishnu/Venkateswara
      devotional shift 40 years before EVT.2025 = AK's spiritual path
      is pre-encoded and confirmed"

  destructive_resonance:
    - "Aquarius = Saturnian discipline: AK must express through Saturn's
      austerity rather than natural lunar receptivity and warmth"
    - "Ketu MD 2031-2038: the upcoming MD will challenge Moon AK's gains-
      orientation with headless detachment — the soul's 11H gains-path
      must be voluntarily relinquished at mid-life for moksha"
    - "AK in upachaya house: soul's journey is cumulative, not immediate;
      gains come with time and effort, not by grace"

  net_resonance: AMPLIFIED
  interpretive_note: |
    As AK, Moon is the chart's ultimate interpretive destination. Every other
    planet, house, yoga, and dasha ultimately serves Moon's soul-mission. The
    Karakamsa link (AK Moon → D9 Gemini → Mercury as Karakamsa lord) confirms
    that the soul's mission is Mercurian: intellectual, communicative, and
    expressed through knowledge-delivery. This is why the Mercury seven-system
    convergence is so total — the soul itself elected Mercury as its purpose-
    expression vehicle at the deepest classical levels. All spiritual and
    purpose questions must route through RM.20.
```

---

```yaml
RM.21_SATURN_AMK_AUTHORITY_EXECUTOR:
  element: >
    Saturn as Amatyakaraka (AmK) — the career-minister karaka. AmK exalted
    in 7H Libra. AmK designation = all vocational outcomes are Saturn-mediated.
    AK (Moon in Aquarius = Saturn's sign) and AmK (Saturn in Libra = Venus's
    sign) form a cross-sign alignment.
  domains_primary: [D1_Career, D2_Wealth, D3_Relationships]
  msr_anchors: [MSR.001, MSR.088, MSR.391, MSR.311]
  cdlm_anchors: [CDLM.D1.D1, CDLM.D1.D3, CDLM.D1.D2]

  constructive_resonance:
    - "AmK exalted D1 + NBR D9: both classical strength-layers operational;
      the career-minister is at maximum functional power"
    - "AmK in 7H: vocational outcomes are delivered through external
      collaboration and institutional relationships, not solo achievement"
    - "Saturn aspects 4H + 10H (4th-house aspect from 7H): the career-
      minister gazes on both the dharmic foundation (4H Jupiter) and the
      career stellium (10H Mercury+Sun)"
    - "Saturn AD 2024-2027: the AmK takes executive control for three years
      within Mercury MD = the career-minister runs the period"
    - "AK-AmK cross-sign alignment: Moon AK in Saturn's sign (Aquarius);
      Saturn AmK in Venus's sign (Libra) = the soul and the career-minister
      are in each other's lord's terrain = cross-resonance"

  destructive_resonance:
    - "AmK in 7H = 7H burden: career pressures and relationship pressures
      share the same house; cannot fully separate professional and personal
      authority demands"
    - "Mars co-tenancy friction: AmK shares the authority-delivery house
      with the chart's most dignity-compromised planet"
    - "Saturn as 10L+11L: both career and gains are Saturn-ruled; delays
      in Saturn's themes are felt simultaneously in career AND income"

  net_resonance: AMPLIFIED
  interpretive_note: |
    Saturn AmK is the chart's career-delivery engine at the Jaimini level,
    while Mercury's 10H placement is the Parashari career-delivery engine.
    The two systems confirm each other with different mechanisms: Mercury
    delivers through intellectual excellence and communication; Saturn AmK
    delivers through institutional authority and disciplined execution. Any
    question about career advancement, professional recognition, or
    institutional authority routes through both RM.01 (Mercury) and RM.21
    (Saturn AmK) — the two systems must be read together.
```

---

## §6 — Special Lagna and Arudha Resonance Entries

---

```yaml
RM.22_AL_CAPRICORN_10H:
  element: >
    Arudha Lagna (AL) = Capricorn 10H — the public image lagna co-located
    with the career house. AL in the same sign as Mercury + Sun natal.
    The public face IS the career face.
  domains_primary: [D1_Career, D8_Mind]
  msr_anchors: [MSR.264, MSR.310]
  cdlm_anchors: [CDLM.D1.D1, CDLM.D8.D1]

  constructive_resonance:
    - "AL = natal Mercury + Sun sign: public image and actual career are
      in the same chamber; no gap between reputation and reality"
    - "AL = Capricorn = Saturn's sign: the public image is Saturnian;
      the world sees discipline, authority, structure — precisely what
      the chart delivers"
    - "Jupiter aspects AL directly: the most auspicious aspect falls on
      the public image point = reputation is dharmically blessed"
    - "Mercury MD activates AL's sign: the time-lord and the public image
      are both Mercury/Capricorn = reputation is at peak activation"
    - "AL in 10H = career and reputation indistinguishable: the native's
      professional work IS the public story of their life"

  destructive_resonance:
    - "Capricorn AL = austere public persona: the public image is demanding,
      authority-oriented, potentially alienating to casual observers seeking
      warmth"
    - "Sun in AL sign: solar self-assertion in the public image can appear
      proud or distant from external view"
    - "UL in Gemini 3H: the partnership Arudha is three houses from AL =
      the public career image and the partnership image are not seamlessly
      unified"

  net_resonance: STRONGLY AMPLIFIED
  interpretive_note: |
    AL = 10H is one of the chart's clearest coherence points: what the native
    does (10H Mercury+Sun) and what the world perceives (AL Capricorn) are
    identical. This means reputation is not built separately from work — it
    IS the work. The Saturnian public persona (disciplined, structured,
    authoritative) aligns with the Mercury-Saturnian career output (knowledge
    through institutional frameworks). No reputation-management required;
    consistent professional excellence IS the public image.
```

---

```yaml
RM.23_UL_GEMINI_3H_BHRIGU_BINDU:
  element: >
    Upapada Lagna (UL) = Gemini 3H — the marriage/long-partnership indicator.
    Gemini = Mercury's sign. Bhrigu Bindu at age 42 (2026) progresses to
    Gemini 3H (80.04°) = exactly the UL's sign = partnership-indicator
    temporal activation HAPPENING NOW.
  domains_primary: [D3_Relationships, D1_Career]
  msr_anchors: [MSR.392, MSR.395, MSR.311]
  cdlm_anchors: [CDLM.D3.D3, CDLM.D3.D1]

  constructive_resonance:
    - "UL in Mercury's sign (Gemini): the marriage indicator aligns with
      Mercury = the partnership archetype is Mercury-governed = an
      intellectual, communicative, co-equal partnership"
    - "BB arrives at UL's sign in 2026 (80.04°): the most potent temporal
      trigger in the chart activates the marriage indicator NOW"
    - "Mercury MD active: the MD lord rules the UL's sign = the entire MD
      framework supports partnership themes"
    - "Saturn AD 2024-2027 encompasses the BB moment: the highest-authority
      sub-period overlaps with the partnership temporal peak"
    - "Mercury as DK (Jaimini DK = Mercury): the marriage-karaka and the
      UL sign-lord are the same planet = double partnership confirmation"

  destructive_resonance:
    - "3H UL = upachaya: the UL in an upachaya house means partnership
      themes improve with time and effort, not immediately; the 2026 BB
      window is a peak within a cumulative process"
    - "Gemini = dual sign: partnership may be complex, dual-natured, or
      involve periods of physical separation"
    - "BB is a degree-point: the activation is concentrated in 2025-2027;
      before and after this window, the baseline is moderate"
    - "Saturn AD context: partnerships formed during Saturn AD carry
      Saturnian quality — serious, formal, institutional — rather than
      spontaneous or emotionally expansive"

  net_resonance: PEAK ACTIVATION 2025-2027; baseline moderate
  interpretive_note: |
    The BB arrival at the UL's sign in 2026 is the most temporally specific
    partnership-activation event in this chart's analysis. The BB-UL conjunction
    (by sign) within Saturn AD and Mercury MD creates a three-level temporal
    alignment: the great period, the sub-period, and the chart's most potent
    transiting trigger all point to 2025-2027 as the primary partnership
    window. The Mercury DK + UL sign-lord alignment means the partnership
    archetype is entirely Mercurian — expect the defining partnership to be
    intellectual, communicative, and professionally co-constructive.
```

---

```yaml
RM.24_HORA_LAGNA_LIBRA_7H:
  element: >
    Hora Lagna (HL) = Libra 7H (v6.0 §12.1, 10°11'). HL = the special lagna
    for material wealth. HL in 7H = wealth flows through partnerships and
    external relationships. Libra = Venus's sign = aesthetically-mediated
    wealth channel.
  domains_primary: [D2_Wealth, D3_Relationships]
  msr_anchors: [MSR.311, MSR.391]
  cdlm_anchors: [CDLM.D2.D3, CDLM.D2.D2]

  constructive_resonance:
    - "HL in Saturn's exaltation house: the wealth-channel lagna is in the
      house that holds the chart's highest-dignity planet = wealth delivery
      is Saturn-quality: institutional, earned, durable"
    - "Libra = Venus's sign: the wealth channel is through Venusian themes
      — balanced exchange, aesthetic value-creation, relational commerce"
    - "Saturn AD activates HL's house: the authority-delivery sub-period
      is also the wealth-channel activation period = career and wealth
      peaks coincide"
    - "BB arrives at HL's house area (7H/3H) 2025-2026: temporal trigger
      activates the wealth channel at precisely the authority-peak moment"
    - "AL in 10H + HL in 7H: the Kendras of public image and wealth-channel
      are in mutual Kendra relationship (10H and 7H are Kendra-apart) =
      structural support between reputation and wealth delivery"

  destructive_resonance:
    - "BVB.7 weakness: HL's house is structurally weak; the wealth channel
      operates through a compromised container"
    - "Mars-Saturn tension in HL's house: the wealth channel is a friction-
      bearing environment; wealth arrives through difficulty, not ease"
    - "Venus = 7L in 9H: HL's sign lord is in the dharma house, not the
      wealth-management house; the wealth channel's governor is philosophically
      oriented rather than materially focused"

  net_resonance: AMPLIFIED with tension-bearing delivery
  interpretive_note: |
    HL in 7H means wealth is not a solo achievement in this chart — it
    is structurally dependent on external relationships, partnerships, and
    collaborative contexts. This is confirmed by the CDLM: Career feeds
    Wealth (CDLM.D1.D2 = 0.92) and the primary flow runs through the
    Career↔Mind↔Wealth triangle. The HL's 7H location means all three
    of these domains pass through Saturn's 7H authority mechanism before
    materializing as wealth. The BB-Saturn-AD convergence in 2025-2027
    is thus simultaneously a wealth-delivery peak and an authority-delivery
    peak — the two are inseparable by chart architecture.
```

---

## §7 — Nakshatra Resonance Entries

---

```yaml
RM.25_PURVA_BHADRAPADA_JANMA_NAKSHATRA:
  element: >
    Purva Bhadrapada (PB) Nakshatra — Janma Nakshatra (birth constellation).
    Moon in PB Pada 3 = Gemini navamsha (D9 Moon = Gemini confirmed, v6.0 §3.5).
    PB = Aquarius 20° - Pisces 3°20'. Ruler: Jupiter. Deity: Ajaikapad (one-
    footed god). Classification: Ugra (fierce). Nadi: Prana/Vata (corrected in
    MSR.369).
  domains_primary: [D8_Mind, D6_Spirit, D4_Health]
  msr_anchors: [MSR.361, MSR.369, MSR.362]
  cdlm_anchors: [CDLM.D8.D6, CDLM.D8.D4]

  constructive_resonance:
    - "Jupiter as PB's nakshatra ruler is exalted in 4H: the Janma
      Nakshatra's lord is at maximum dignity = the soul is born under
      a nakshatra whose governor is at peak power in this nativity"
    - "Pada 3 = Gemini navamsha: D9 Moon in Gemini = Mercury as navamsha
      sign lord = the soul's nakshatra-channel is Mercury-flavored;
      the seven-system Mercury convergence is reinforced at the nakshatra
      level"
    - "PB spans Aquarius/Pisces boundary (11H-12H): the Moon naturally
      inhabits the gains-to-moksha threshold = the AK is positioned at
      the crossover point of material achievement and spiritual departure"
    - "Ajaikapad deity: the one-footed god = extreme focus at the cost
      of balance; the native's capacity for intense singular focus is
      embedded in the birth nakshatra"

  destructive_resonance:
    - "Ugra classification: not a gentle nakshatra; the soul's emotional
      baseline is intense, demanding, high-amplitude"
    - "Prana/Vata Nadi: air-constitution predisposition; tendency toward
      over-thinking, high-vata health profile, nervous system sensitivity"
    - "Ajaikapad's one-footedness = imbalance as the price of focus:
      extreme productive output at the cost of life-balance is the
      nakshatra's constitutional trade-off"
    - "PB bridges 11H-12H: the AK's position at the Aquarius-Pisces
      boundary means the soul is perpetually near the gains/loss threshold;
      it can tip toward either with relatively small perturbations"

  net_resonance: AMPLIFIED with intensity and imbalance-risk profile
  interpretive_note: |
    The Janma Nakshatra (PB, Jupiter-ruled) and the Vimshottari MD lord
    (Mercury) are in a positive relationship: Jupiter rules PB, Jupiter is
    exalted, and Jupiter aspects Mercury's natal house (10H). The soul is
    born under a nakshatra whose lord blesses the career house directly.
    The Vata/Prana Nadi assignment is critical for health analysis: this
    nakshatra constitution will produce high creative and intellectual output
    at the cost of vata-aggravation. Grounding practices, regular rest, and
    avoiding mental overload are constitutionally necessary — not optional.
```

---

## §8 — Meta-Convergence Resonance Entries

---

```yaml
RM.27_MERCURY_SEVEN_SYSTEM_CONVERGENCE:
  element: >
    MSR.413 — The Mercury Seven-System Convergence. Seven independent classical
    systems independently confirm Mercury as the chart's primary career-
    intelligence signifier: Natal 10H planet (Parashari) + Vimshottari MD lord
    + Yogi Planet (Parashari) + DK (Jaimini) + Karakamsa sign lord (Jaimini) +
    KP cusp-11 sub-lord (KP) + Vargottama (Navamsha). Confidence: 0.98 —
    the highest in the entire MSR.
  domains_primary: [D1_Career, D2_Wealth, D8_Mind, D3_Relationships]
  msr_anchors: [MSR.413, MSR.388, MSR.390]
  cdlm_anchors: [CDLM.D1.D1, CDLM.D8.D1, CDLM.D1.D2]

  constructive_resonance:
    - "Seven independent systems, zero dissent: no classical system (Parashari,
      Vimshottari, Jaimini, KP, Navamsha) identifies any other planet as
      the career primary"
    - "All seven active simultaneously 2014-2031: within Mercury's own MD,
      all seven confirmations are live at once = multi-system peak is not
      sequential but concurrent"
    - "Saturn AD within the convergence: the highest-authority sub-period
      delivers the convergence's authority-component"
    - "Saraswati Yoga fires within the convergence: the intelligence yoga's
      central planet IS the convergence planet = the yoga and the convergence
      are the same event"
    - "AK Karakamsa confirmation: the soul's deepest level (AK → D9 Moon
      Gemini → Mercury as Karakamsa lord) confirms Mercury at the most
      fundamental level available in classical Jyotish"

  destructive_resonance:
    - "Combustion modulates the 0.98: even at maximum multi-system confidence,
      Mercury's solar proximity introduces a 2% uncertainty; the fruits of
      the convergence may require sacrifice"
    - "3L+6L concurrent activation: the convergence planet also activates
      obstacle and debt themes; peaks and friction are not alternatives
      but concurrent during Mercury MD"
    - "GAP.01 — Missing Birth Yoga: MSR.354 confidence = 0.00 pending
      v6.0 §9 verification; if Birth Yoga = Vyatipata, it would mildly
      contra-indicate the convergence's full auspiciousness"

  net_resonance: THE CHART'S HIGHEST-CONFIDENCE AMPLIFICATION
  interpretive_note: |
    The Mercury Seven-System Convergence is the chart's supreme analytical
    finding. In a corpus of 420 MSR signals, no other signal achieves 0.98
    confidence. This is the interpretive bedrock: any conclusion about this
    chart's career, intellectual output, or life-purpose that does not invoke
    Mercury is likely incomplete. The convergence is active NOW (2014-2031)
    and will not repeat at this intensity. The 2% uncertainty (GAP.01) is
    worth resolving: reading v6.0 §9 to identify the Birth Yoga should be
    the highest-priority gap-closure before UCN Part IV is drafted.
```

---

```yaml
RM.28_7H_SEVEN_LAYER_CONVERGENCE:
  element: >
    MSR.391 — The 7H Seven-Layer Convergence. Seven independent classical layers
    confirm 7H Libra as the chart's supreme event-house: Saturn exalted natal
    (Parashari) + Mars PK natal (Jaimini) + Bhrigu Bindu 2025-2026 (Bhrigu) +
    Hora Lagna (Special Lagna) + Saham Roga (Sahams) + Saham Mahatmya (Sahams)
    + KP sub-lord = Saturn (KP).
  domains_primary: [D3_Relationships, D1_Career, D2_Wealth]
  msr_anchors: [MSR.391, MSR.001, MSR.008, MSR.311]
  cdlm_anchors: [CDLM.D3.D3, CDLM.D3.D1, CDLM.D1.D2]

  constructive_resonance:
    - "Seven layers active (multi-system): each layer derives from a different
      classical system; the convergence is cross-system, not mono-system"
    - "BB activation 2025-2026 within Saturn AD: the temporal trigger and
      the authority sub-period overlap at the seven-layer convergence house"
    - "HL in 7H: the wealth-channel lagna is part of the convergence;
      the 7H's events are simultaneously relationship AND wealth events"
    - "Saturn AD 2024-2027 encompasses the peak: the 7H's most prominent
      planet takes executive control precisely when the convergence peaks"

  destructive_resonance:
    - "BVB.7 weakness: the seven-layer convergence cannot overcome a
      structurally weak house container; events arrive in a fragile vessel"
    - "Saham Roga as one of the seven layers: health/illness indicator
      is part of the convergence; the 7H's peak events may include health
      themes alongside career-relationship prominence"
    - "Mars's compromised dignity: PK Mars as one of the seven layers
      brings friction; the convergence has a tension-bearing component
      built into it"

  net_resonance: STRONGLY AMPLIFIED with structural container weakness
  interpretive_note: |
    The 7H's seven-layer convergence explains why this house produces
    disproportionately consequential events in the native's life. The BVB
    weakness is not a nullifier but a shape-modifier: the events are high-
    amplitude and episodic (dramatic-not-compound) rather than quietly
    cumulative. The Saham Roga presence is a flag: significant 7H events
    may co-occur with health themes. The BB arrival in 2025-2026 makes this
    the single most potent house-activation event in the native's life to date.
    Events occurring in 2025-2027 with 7H signatures (partnerships, authority
    transitions, collaborative ventures) should be interpreted as the primary
    delivery moment for everything this house has accumulated since birth.
```

---

```yaml
RM.29_SADE_SATI_PARADOX:
  element: >
    MSR.396 — The Sade Sati Paradox: three independent systems confirm that
    the Sade Sati Peak 2022-2025 (the most feared transit in popular Jyotish)
    was an ACHIEVEMENT window, not a destruction window. Systems: (1) LEL
    retrodiction — best career events documented in this period; (2) KP cusp-11
    sub-lord = Mercury (Yogi Planet) = gains confirmed by KP; (3) Moon AK in
    Aquarius = own-sign mitigation = Moon not afflicted by its own-sign transit.
  domains_primary: [D1_Career, D8_Mind]
  msr_anchors: [MSR.396, MSR.007, MSR.311]
  cdlm_anchors: [CDLM.D1.D1, CDLM.D8.D1]

  constructive_resonance:
    - "Moon AK in own-sign Aquarius: when Saturn transits Aquarius (Sade Sati
      mid), it returns to its own sign where Moon already operates well =
      the feared transit is in Moon's comfort zone"
    - "KP cusp-11 sub-lord = Yogi Planet Mercury: the gains house's sub-lord
      is the fortune-bestower = KP confirms gains during the transit period"
    - "LEL empirical retrodiction: documented life events show peak career
      events in 2022-2025 = the retrodiction is evidence-based, not theoretical"
    - "Mercury MD parent dasha: the Sade Sati operated entirely within
      Mercury's period; the MD lord's Yogi quality modulated the transit's
      expression toward achievement"

  destructive_resonance:
    - "The structural compression was real: the Sade Sati brought genuine
      pressure; the achievement was earned through maximum difficulty, not
      received as a gift"
    - "The paradox is non-obvious: future interpreters seeing Sade Sati
      may predict difficulty; this retrodiction must be in the UCN to
      prevent misinterpretation"
    - "Post-Sade Sati modulation: after 2025, the intensity of the pressure
      releases; the chart enters a less urgency-driven period; the peak's
      output quality may not repeat until the next Sade Sati cycle (~30 years)"

  net_resonance: RETROACTIVELY AMPLIFIED
  interpretive_note: |
    The Sade Sati Paradox is the chart's most important interpretive key for
    understanding how apparent adversity operates in this nativity. The general
    principle: when Saturn transits a sign where the chart's planets are strong
    (Moon's own-sign Aquarius), the transit amplifies the planet's own strength
    rather than suppressing it. This is why the chart's Sade Sati was an
    achievement window. Future Sade Sati cycles should be re-evaluated using
    the same logic: the transit's quality depends on what Moon is doing in
    Aquarius (its own sign), not on the generic "Sade Sati = difficulty"
    assumption. This finding should be placed prominently in UCN Part VIII
    (Timing Metaphysics) and UCN Part IX (Contradictions).
```

---

```yaml
RM.30_DEVATA_RETRODICTION:
  element: >
    MSR.397 — Devata Retrodiction Triple-Lock. Jaimini Karakamsa analysis
    predicted the Vishnu/Venkateswara devotional shift approximately 40 years
    before EVT.2025. Three-lock mechanism: Karakamsa Gemini → Mercury DK →
    the soul's karaka relationship pointing to Vishnu-class devata. Confidence:
    high (retrodiction confirmed by documented life event).
  domains_primary: [D6_Spirit]
  msr_anchors: [MSR.397, MSR.007]
  cdlm_anchors: [CDLM.D6.D6, CDLM.D6.D1]

  constructive_resonance:
    - "40-year predictive accuracy at three-system level: a pre-birth
      prediction confirmed at age ~41 = the chart's Jaimini layer has
      demonstrated high calibration"
    - "Confirms the native is on their correct spiritual path: the chart
      predicted Venkateswara worship; the native chose it = the soul is
      living its own deepest encoding"
    - "Mercury DK involvement: the same Mercury that dominates career also
      mediates the devata relationship = the spiritual and career paths are
      not separate but the same Mercurian stream"
    - "Strengthens overall chart credibility: when a chart predicts specific
      spiritual events 40 years in advance, every other prediction in the
      corpus gains credibility by association"

  destructive_resonance:
    - "EVT.2025 = a single confirmed event: the retrodiction is strong for
      this one event; it does not automatically generalize to all future
      predictions"
    - "Jaimini Karakamsa analysis requires expert verification of the full
      mechanism; the triple-lock derivation has complexity that could harbor
      computational edge cases"

  net_resonance: STRONGLY AMPLIFIED (chart's spiritual-predictive authority confirmed)
  interpretive_note: |
    The devata retrodiction is the chart's most remarkable single finding in
    terms of classical predictive precision. A 40-year advance retrodiction
    of a specific devata — not a category ("Vishnu class") but a specific
    form (Venkateswara) — is the kind of result that validates an entire
    analytical system. This finding belongs in UCN Part II (The Soul-Trajectory)
    as evidence that the chart's D9 + Jaimini architecture is correctly mapped
    and that the native's spiritual choices are chart-congruent. It also reframes
    the Venkateswara relationship: it is not a coincidence or personal choice
    but a pre-encoded soul-alignment expressed at the appointed time.
```

---

```yaml
RM.31_BHRIGU_BINDU_2026:
  element: >
    Bhrigu Bindu (BB) progression to Gemini 3H at age 42 in 2026 (80.04° =
    Gemini exactly). Gemini = UL's sign = Mercury's sign. BB = the chart's
    primary Bhrigu-school temporal trigger. The BB arriving at the UL's sign
    within Saturn AD and Mercury MD = once-per-cycle partnership-authority peak.
  domains_primary: [D3_Relationships, D1_Career]
  msr_anchors: [MSR.392, MSR.395, MSR.311]
  cdlm_anchors: [CDLM.D3.D3, CDLM.D3.D1]

  constructive_resonance:
    - "BB = UL sign (Gemini): the most potent temporal trigger in the chart
      arrives at the primary partnership indicator's sign = concentrated
      partnership-activation"
    - "Gemini = Mercury's sign = Mercury MD active: the BB arrives in the
      MD lord's own sign during the MD = triple alignment (BB + UL + MD)"
    - "Saturn AD 2024-2027 encompasses the BB moment: authority-delivery
      sub-period and partnership temporal peak overlap"
    - "Mercury as DK: the marriage-karaka's sign receives the BB; the DK
      and the BB align at the same zodiacal address"
    - "Age 42 = mid-life peak: at Mercury MD's maturity phase, the BB
      arrives = the most productive phase of the MD coincides with the
      partnership trigger"

  destructive_resonance:
    - "BB is a moving degree-point: the peak activation is concentrated in
      2025-2027; before and after this window, the baseline is moderate"
    - "3H = upachaya: BB in the 3H = the activation house is communications/
      siblings/short travel; partnership may arrive through these channels
      rather than conventional romantic pathways"
    - "After 2026-2027, BB enters Cancer 4H: the next BB station activates
      domestic/foundation themes rather than partnership-communication themes"

  net_resonance: PEAK ACTIVATION WINDOW 2025-2027
  interpretive_note: |
    The BB's arrival at the UL's sign in 2026 is the chart's most temporally
    specific partnership event-window. It will not repeat at this exact
    combination within the native's lifetime (BB completes one cycle in ~84-90
    years). Any significant partnership development in 2025-2027 should be
    understood as the primary delivery of this chart's 7H + UL + BB + Mercury
    architecture. The simultaneous Saturn AD (authority delivery) and BB
    (partnership trigger) and Mercury MD (intellectual peak) create a window
    where professional partnerships with institutional authority dimensions
    are the most probable high-value outcome.
```

---

## §9 — Cross-Domain Flow Resonance Entries

---

```yaml
RM.32_CAREER_MIND_WEALTH_TRIANGLE:
  element: >
    The CDLM Primary Flow Triangle: Career (D1) ↔ Mind (D8) ↔ Wealth (D2).
    All three cross-domain linkages ≥ 0.92 (CDLM.D1.D2 = 0.92, CDLM.D8.D1 =
    0.94, CDLM.D8.D2 estimated ≥ 0.90). The three domains form a self-
    reinforcing compound-growth system anchored in Mercury.
  domains_primary: [D1_Career, D8_Mind, D2_Wealth]
  msr_anchors: [MSR.413, MSR.388, MSR.264, MSR.311]
  cdlm_anchors: [CDLM.D1.D2, CDLM.D8.D1, CDLM.D8.D2]

  constructive_resonance:
    - "Mercury governs all three: Mercury = career planet (10H natal) +
      mind/communication planet (by nature) + DK wealth-partnership; a
      single planetary governor makes the triangle structurally stable"
    - "The triangle is self-reinforcing: career success → mind confidence
      grows → wealth compounds → career empowers further; no isolated domain"
    - "Saturn AD delivers all three simultaneously: institutional authority
      (career) + Hora Lagna wealth-channel + Saturn-discipline (mind
      structure) = one sub-period, three domain peaks"
    - "CDLM confirmation ≥ 0.92: the formal matrix computation validates
      the triangle's existence at the highest linkage strengths in the matrix"
    - "Mercury MD active: the triangle's single planetary governor is the
      current time-lord = the triangle fires fully 2014-2031"

  destructive_resonance:
    - "Single-planet dependency: if Mercury is compromised (combustion,
      3L+6L activation, adverse transit), all three domains feel the
      disruption simultaneously — the triangle's strength is also its
      systemic risk"
    - "The triangle excludes Relationships (D3): the chart's third-highest
      domain self-amplifier (D3.D3 = 0.95) is structurally outside the
      primary triangle; relationship health is not automatically linked
      to the compound-growth mechanism"
    - "Mind-overload risk: Mercury's multiple roles (MD lord, 3L, 6L, DK,
      Yogi, Karakamsa lord) can create cognitive bandwidth saturation;
      the triangle can become a vortex that consumes mental energy"

  net_resonance: STRONGLY AMPLIFIED (the chart's master compound-growth mechanism)
  interpretive_note: |
    The Career↔Mind↔Wealth triangle is the most practically important finding
    in the CDLM for daily life guidance. It means that in this chart, the path
    to wealth is inseparably through career AND through intellectual development;
    that mental health is structurally linked to career performance; and that
    career decisions always have direct wealth implications. The native should
    never optimize one vertex of the triangle at the expense of another —
    burning out the mind will simultaneously suppress career and wealth, not
    just mental wellbeing. Relationship health (D3) must be cultivated
    separately from the triangle's compound-growth logic.
```

---

```yaml
RM.33_RELATIONSHIPS_KARMIC_VORTEX:
  element: >
    CDLM D3.D3 = 0.95 — the Relationships domain self-amplification score,
    the second-highest in the entire CDLM (after Spirit D6.D6 = 0.96). The
    7H convergence (RM.28) is the primary anchor. Relationships reinforce
    themselves internally — a self-amplifying karmic vortex.
  domains_primary: [D3_Relationships]
  msr_anchors: [MSR.391, MSR.001, MSR.392]
  cdlm_anchors: [CDLM.D3.D3, CDLM.D3.D1, CDLM.D3.D2]

  constructive_resonance:
    - "Saturn exalted 7H: the highest-dignity planet in the relationship
      house = partnerships are built on authority and disciplined reliability"
    - "HL in 7H: the wealth channel runs through the relationship house =
      the karmic vortex has material consequence, not just emotional"
    - "BB activation 2026: the temporal trigger activates the vortex's
      core = 2026 is the karmic relationship peak moment"
    - "AK Moon 11H opposition to 5H (7th from 11H = 5H): the soul's
      expression in 11H feeds the 7H axis through the 5H-11H-7H triangle"

  destructive_resonance:
    - "D3.D3 = 0.95 = the vortex mirrors the self: what the native sees
      in partners is primarily a reflection of their own psychological state;
      the relationship domain has a strong projection-mechanism"
    - "BVB.7 weakness: the vortex operates in a structurally weak container;
      high relationship intensity in a fragile house = volatile pattern"
    - "Mars-Saturn 7H enmity: the core of the vortex holds two natural
      enemies as primary tenants; the relational dynamic between discipline
      and desire is the foundational challenge"
    - "UL in dual sign Gemini: the marriage indicator in a dual sign = the
      vortex may produce more than one significant partnership; the karmic
      pattern may repeat across relationships"

  net_resonance: STRONGLY SELF-AMPLIFYING with high structural tension
  interpretive_note: |
    The Relationships karmic vortex (D3.D3 = 0.95) is the chart's most intense
    self-referential domain. Unlike the Career↔Mind↔Wealth triangle (which
    amplifies across domains), the relationship vortex amplifies within its own
    domain — meaning relationship patterns repeat and intensify over time rather
    than evolving smoothly. The Mars-Saturn 7H tension is the vortex's engine:
    the same friction that produces authority paradoxes in career also produces
    intensification paradoxes in partnerships. The path to healthy relationships
    in this chart requires understanding that the vortex is not self-resolving
    — it must be consciously worked with. The BB-Saturn-AD convergence in
    2025-2027 is the vortex's most consequential activation.
```

---

```yaml
RM.34_SPIRIT_CAREER_TRAVEL_CHAIN:
  element: >
    The CDLM Secondary Chain: Spirit (D6) ↔ Career (D1) ↔ Travel/Foreign (D9).
    Distinct from the primary triangle — this chain represents the chart's
    dharmic-vocational-foreign signature. Spirit D6.D6 = 0.96 (highest self-
    amplifier in the CDLM). Anchored in Jupiter (9L+12L) and Venus (9H SL co-
    occupant).
  domains_primary: [D6_Spirit, D1_Career, D9_Travel]
  msr_anchors: [MSR.002, MSR.012, MSR.389, MSR.394]
  cdlm_anchors: [CDLM.D6.D1, CDLM.D6.D9, CDLM.D1.D9]

  constructive_resonance:
    - "Jupiter as 9L+12L governs both Spirit and Travel: a single planet
      is the planetary governor of the entire chain; stable and coherent"
    - "Venus in 9H (Spirit's primary house): Lakshmi in the dharma house
      = the Spirit domain is materially abundant within its own sphere"
    - "D9-12H stellium (pending full verification): if confirmed, the soul's
      deepest karma lies in foreign/moksha themes = Travel is soul-encoded"
    - "Spirit D6.D6 = 0.96 (highest CDLM self-amplification): the Spirit
      domain reinforces itself more powerfully than any other domain;
      spiritual development is the chart's most self-sustaining process"

  destructive_resonance:
    - "Secondary chain (lower linkage than primary triangle): Spirit-Career-
      Travel linkages are real but ≤0.85 = the chain is reliable but not
      structurally dominant compared to the Career-Mind-Wealth triangle"
    - "Spirit's self-amplification (0.96) may dominate the chain: Spirit
      reinforces itself more than it feeds Career or Travel; the chain
      may be less of a feed relationship and more of a parallel track"
    - "Travel domain requires physical presence: without actual foreign
      residence or regular travel, the D9 domain may under-fire despite
      chart support"

  net_resonance: AMPLIFIED (secondary to primary triangle; dominant in dharmic stream)
  interpretive_note: |
    The Spirit-Career-Travel chain explains why this native's career has a
    distinctive spiritual and philosophical dimension that cannot be separated
    from professional output — it is structurally encoded in the CDLM. The
    chain also explains why Singapore (or similar foreign professional contexts)
    is not merely an economic choice but a chart-congruent context: the Travel/
    Foreign domain feeds both career and spirit through Jupiter's 9L+12L
    governance. Spirit's 0.96 self-amplification is notable: the more the
    native invests in spiritual practice, the more the practice amplifies itself
    — this is the chart's most internally sustainable investment.
```

---

```yaml
RM.35_CHART_PARADOX_STACK:
  element: >
    The chart's seven confirmed internal tensions (per Architecture UCN Part IX
    scope): (1) Authority-Through-Tension (Mars-Saturn 7H); (2) Sade Sati
    Paradox (MSR.396); (3) Moon AK gains-path vs. Ketu MD moksha-pull;
    (4) Mercury's dual role (career-peak + obstacle activation); (5) Jupiter's
    dual role (dharma-foundation + expense/moksha-cost); (6) Neecha-Bhanga
    Reserve (D9 apparent weakness = delayed peak); (7) AL career house vs.
    BVB.7 structural weakness.
  domains_primary: [D1_Career, D3_Relationships, D6_Spirit, D8_Mind]
  msr_anchors: [MSR.396, MSR.391, MSR.413, MSR.091, MSR.389]
  cdlm_anchors: [CDLM.D1.D3, CDLM.D6.D1, CDLM.D8.D1]

  constructive_resonance:
    - "Paradoxes confirm chart complexity: a chart with seven genuine tensions
      is a multi-dimensional soul; this is a feature, not a defect"
    - "Each paradox has a resolution mechanism: NBR, own-sign mitigation,
      MD timing, KP confirmation — the chart is self-correcting at multiple
      levels"
    - "The paradox-stack ensures chart depth: this chart REQUIRES the MSR/
      CDLM/UCN level of analysis; formulaic approaches will produce wrong
      conclusions — the chart's sophistication demands sophisticated analysis"
    - "The tensions produce growth: the Authority-Through-Tension pattern
      specifically shows that authority emerges FROM tension rather than
      despite it; the paradox IS the mechanism"
    - "Sade Sati Paradox empirically validates the meta-principle: apparent
      adversity (maximum Saturn transit) produces achievement; the chart's
      adversities should be approached as latent opportunities by default"

  destructive_resonance:
    - "Paradoxes are REAL tensions: they are not merely analytical puzzles;
      each corresponds to a lived experience of contradiction that cannot
      be intellectualized away"
    - "The paradox-stack demands constant interpretation sophistication:
      a naive reading of any single paradox will produce wrong predictions —
      this is a perpetual liability for casual astrologers"
    - "The paradoxes cannot all resolve simultaneously: when one paradox is
      in its constructive phase, another may be in its challenging phase;
      the chart never has all paradoxes constructive at once"
    - "Karmic weight: each paradox represents a genuine karmic tension that
      the native must work through consciously — the tensions are not
      automatically resolved by dasha activation"

  net_resonance: THE CHART'S DEFINING META-PATTERN
  interpretive_note: |
    The paradox-stack is the meta-finding of this entire analytical corpus.
    It explains why simplistic readings of this chart are consistently wrong,
    why Sade Sati produced achievement instead of disaster, why the highest-
    dignity planet (Saturn) sits in the weakest bhavabala house, why the
    chart's most important planet (Mercury) is both the career peak and the
    obstacle activation. The paradox IS the point: this chart operates through
    tension-as-growth-engine. Understanding this at the experiential level —
    not just intellectually — is the UCN's central task (Part IX and Part X).
    An independent acharya reading this corpus without this meta-finding would
    produce systematically wrong predictions across multiple domains. The
    paradox-stack is what makes this chart "above my own level" territory for
    a senior reviewer.
```

---

## Summary Statistics

```yaml
rm_summary:
  elements_total: 35
  elements_by_section:
    S1_Planetary: 9
    S2_House: 4
    S3_Yoga: 3
    S4_Dasha: 3
    S5_Chara_Karaka: 2
    S6_Special_Lagna_Arudha: 3
    S7_Nakshatra: 1
    S8_Meta_Convergence: 5
    S9_Cross_Domain_Flow: 3
    [note: RM.26 = Panchang Constitution incorporated into RM.25 expanded scope]

  net_resonance_distribution:
    STRONGLY_AMPLIFIED: 12
    AMPLIFIED: 12
    TENSION_BEARING: 2
    PEAK_ACTIVATION_WINDOW: 2
    RETROACTIVELY_AMPLIFIED: 1
    SELF_AMPLIFYING: 1
    HIGHEST_CONFIDENCE_AMPLIFICATION: 1
    DEFINING_META_PATTERN: 1
    AMPLIFIED_DUAL_NATURE: 3

  highest_confidence_element: RM.27 (Mercury Seven-System, MSR.413, 0.98)
  most_tension_bearing_element: RM.06 (Mars 7H — enemy sign, natural enmity with co-tenant)
  most_temporally_active_element: RM.31 (Bhrigu Bindu 2026 — peak activation NOW)
  most_structurally_foundational: RM.03 (Jupiter exalted 4H — the chart's bedrock)
  most_paradox_laden_element: RM.35 (Chart Paradox Stack — the meta-pattern)

  primary_cross_domain_flows:
    - Career ↔ Mind ↔ Wealth triangle (≥ 0.92, RM.32)
    - Relationships self-amplifying vortex (0.95, RM.33)
    - Spirit ↔ Career ↔ Travel chain (secondary, RM.34)

  current_peak_activation_elements: [RM.18_SATURN_AD, RM.31_BHRIGU_BINDU_2026,
    RM.17_MERCURY_MD, RM.27_MERCURY_SEVEN_SYSTEM, RM.23_UL_GEMINI_BB]

  feeds_into_ucn:
    Part_I: [RM.27, RM.35, RM.32]
    Part_II: [RM.20, RM.30, RM.08]
    Part_III: [RM.05, RM.25, RM.06]
    Part_IV: [RM.01, RM.14, RM.16, RM.17, RM.18]
    Part_V: [RM.10, RM.23, RM.33, RM.24, RM.22]
    Part_VI: [RM.12, RM.08, RM.19, RM.34]
    Part_VII: [RM.02, RM.06, RM.21, RM.35]
    Part_VIII: [RM.17, RM.18, RM.19, RM.31, RM.29]
    Part_IX: [RM.35, RM.29, RM.15, RM.28]
    Part_X: [RM.35, RM.20, RM.32, RM.33]
```

---

## Artifact Footer

```yaml
artifact: RM_v1_0.md
version: 1.0
status: CLOSED
date_closed: 2026-04-18
session: 13
elements_completed: 35
elements_by_section:
  S1_Planetary: 9
  S2_House: 4
  S3_Yoga: 3
  S4_Dasha: 3
  S5_Chara_Karaka: 2
  S6_Special_Lagna_Arudha: 3
  S7_Nakshatra: 1
  S8_Meta_Convergence: 5
  S9_Cross_Domain_Flow: 3
highest_confidence_element: RM.27 (Mercury Seven-System, 0.98)
most_temporally_active_element: RM.31 (Bhrigu Bindu 2026, peak NOW)
most_foundational_element: RM.03 (Jupiter exalted 4H)
defining_meta_pattern: RM.35 (Chart Paradox Stack = tension-as-growth-engine)
primary_flow_confirmed: Career ↔ Mind ↔ Wealth triangle (≥ 0.92, RM.32)
current_peak_window: 2024-2027 (Saturn AD + BB 2026 + Mercury MD)
parent_artifacts: [MSR_v1_0.md, CDLM_v1_0.md, CGM_v1_0.md]
next_artifact: UCN_v1_0.md (Session 14 — Parts I-V)
feeds_into: [UCN_v1_0.md Parts I-X, Domain Reports L3, Query routing L4]
known_gaps:
  - GAP.01: MSR.354 Birth Yoga value missing (v6.0 §9 unread); affects RM.27 2% uncertainty
  - GAP.02: D9 Jupiter placement unverified; affects RM.03 destructive_resonance GAP note
  - GAP.03: D9 12H stellium full composition unverified; affects RM.12
changelog:
  - v1.0 (2026-04-18): initial build, 35 elements, Session 13 — CLOSED
```
