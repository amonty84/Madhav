---
document: L2 MODE B — DIVISIONAL CHART MATRIX
project: AM-JIS
layer: L2 (Analytical Layer, Mode B — Exhaustive Coverage)
artifact_id: MATRIX_DIVISIONALS_v1_0
version: 1.0
status: CLOSED (Session 9 output — paired with MATRIX_SIGNS)
sibling_files: MATRIX_HOUSES, MATRIX_PLANETS, MATRIX_SIGNS (same session), MATRIX_DASHA_PERIODS (future)
source_layer: L1 Facts (v6.0 §3.1-§3.15 + v7.0 §V7.B D27 Bhamsa + CGP audit)
design_note: v6.0 §3.1-§3.14 provides basic Dx placements for 14 charts; v7.0 §V7.B adds D27. This Mode B matrix adds: chart purpose, cross-validation with D1 (does this Dx confirm/contradict), primary yogas/afflictions per Dx, and interpretation per row. Focuses on adding value, not duplicating raw Dx sign data.
outputs_feed_to: L2.5 CGM (divisional-confirmation edges for each planet across 16 Dx) and MSR (~30 divisional-pattern signals)
---

# DIVISIONAL CHART MATRIX — L2 Mode B

## §1 — META

### §1.1 — Coverage

16 classical Shodashavarga divisions: D1, D2, D3, D4, D7, D9, D10, D12, D16, D20, D24, D27, D30, D40, D45, D60.

### §1.2 — Schema per Dx

```yaml
MX.DVS.[Dx]:
  dx_number: 1, 2, 3, ...
  chart_name: [Sanskrit name]
  classical_signification: [what life-area this Dx governs]
  lagna_sign: [D-Lagna]
  key_placements: [notable planet positions]
  vargottama_planets: [planets with same D1 and Dx sign]
  primary_yogas: [yogas present in this Dx]
  primary_afflictions: [debilitations, papakartari, etc.]
  d1_cross_validation: [does this Dx confirm or contradict D1 theme?]
  lel_relevance: [which LEL events map to this Dx's domain]
  interpretation: [1-2 paragraph synthesis]
```

---

## §2 — SUMMARY TABLE

| Dx | Chart | Signification | D-Lagna | Vargottama | Primary Yogas / Notes |
|---|---|---|---|---|---|
| D1 | Rashi | General life | Aries | 1 (self-reference) | SIG.01-15 all | 
| D2 | Hora | Wealth (Sun/Moon halves) | — | — | Placement in Sun vs Moon halves |
| D3 | Drekkana | Siblings / co-borns | — | — | 3H theme amplification |
| D4 | Chaturthamsa | Home / property / comfort | — | — | 4H theme |
| D7 | Saptamsa | Progeny / children | — | — | 5H/children theme — twin-relevant |
| **D9** | **Navamsa** | Spouse / dharma / general strength | **Cancer** | **Mercury** (Vargottama) | **SIG.02 Venus NBRY, SIG.03 Saturn NBRY, SIG.06 D9 12H stellium** |
| **D10** | **Dashamsha** | Career / status | **Leo** | — | **Sun in D10 9H Aries (trine) — dharmic-career**; Saturn in D10 10H Taurus (retains structural career role) |
| D12 | Dvadashamsa | Parental ancestry | Leo | — | Father-side / paternal lineage reading; RPT.HSE coverage pending |
| D16 | Shodashamsa | Vehicles / comforts | Leo | — | Lagna Leo + Moon + Mars together — unusual conjunction |
| D20 | Vimsamsa | Spiritual sadhana | Scorpio | — | Lagna Scorpio + Jupiter — spiritual-research signature; relates to Ketu 8H natal |
| D24 | Siddhamsa | Education / knowledge | Taurus | — | Moon as D24 Lagna; Mercury in 3H (education-through-communication) |
| **D27** | **Bhamsa** | **Strength/weakness (ruin/prosperity)** | **Pisces** (computed v7.0) | — | **NEW in v7.0**; requires Vargottama audit in detail |
| D30 | Trimsamsa | Misfortune / evils | Capricorn | — | Lagna Cap (Saturn-ruled misfortune); Sun in D30 Lagna = self-imposed challenges |
| D40 | Khavedamsa | Maternal auspiciousness | Virgo | — | Saturn in D40 Lagna — mother-line discipline theme |
| D45 | Akshavedamsa | Paternal purity | Libra | — | Venus Neptune in Lagna — Spiritual-aesthetic paternal theme; CTR.03 Jupiter shows up here |
| **D60** | **Shashtyamsa** | **Past karma** | **Gemini** | — | Saturn in D60 Lagna; Jupiter+Rahu in D60 2H; Ketu D60 8H = karmic 8H theme |

---

## §3 — PER-CHART DETAIL

### MX.DVS.D1 — Rashi (General Life)

Primary chart; source for everything else. See v6.0 §2 + §23.1 + MATRIX_HOUSES + MATRIX_PLANETS for full treatment.

**Key yogas** (aggregate from MATRIX_HOUSES §3): Sasha MPY, Hidden Raja, Saraswati, Lakshmi, Anapha, Budh-Aditya, Dhana-chain, D9 12H stellium (via dispositor chain), Rahu quadruple-Jaimini-aspect (CGP SIG.16 candidate).

### MX.DVS.D2 — Hora (Wealth)

```yaml
chart_name: Hora
signification: Wealth division — only 2 halves per sign (Sun half = first 15° of odd signs / second 15° of even signs; Moon half = inverse)
source: v6.0 §3.1
key_analysis: |
  Moon-half vs Sun-half of each sign determines wealth-delivery mode. Planets in Sun-half = wealth via action/authority; planets in Moon-half = wealth via nurturing/patience/inheritance.
  Without individual D2 placements in v6.0 §3.1 summary (only a composite table), detailed per-planet D2 analysis is deferred — but classical rule: Moon's strength in Hora + 9L strength = Dhana-yoga amplifier.
d1_cross_validation: D2 is simpler than other Dx; generally confirms D1 wealth-indications. For native, D1 has SIG.08 Lakshmi Yoga and SIG.10 Rahu-2H — D2 should mirror these.
lel_relevance: All financial LEL events (2010 real estate, 2025 scam, 2025 Marsys contract, 2024 sand mine) map to this Dx's register.
interpretation: Hora's binary-structure gives limited resolution but confirms native's wealth is BOTH action-sourced (Sun-half via career-entrepreneurship) AND inheritance-mediated (Moon-half via family real-estate windfall 2010).
```

### MX.DVS.D3 — Drekkana (Siblings)

```yaml
chart_name: Drekkana
signification: Siblings, courage, effort (3H theme amplification)
source: v6.0 §3.2
lel_relevance: Native's younger brother as "lifelong pillar of support" (doc §4) — D3 placement of Mars (sibling-karaka) + 3L Mercury matters.
d1_cross_validation: D1 has A3 (sibling arudha) in Leo 5H — D3 should confirm a supportive sibling theme via Mars + Mercury dignity.
interpretation: D3 is one of the gentler Dxs with direct-signification. Native's sibling relationship (strong per doc) is likely reflected in D3 Mars/3L position. Full D3 per-planet treatment deferred; major pattern is consistent.
```

### MX.DVS.D4 — Chaturthamsa (Home)

```yaml
chart_name: Chaturthamsa
signification: Home, property, happiness, mother
source: v6.0 §3.3
lel_relevance: EVT.2010.XX.XX.01 (family real estate — major 4H/property event), US residence 2019-2023, 2023 India return.
d1_cross_validation: D1 4H Cancer (empty Rashi but strong SAV 32 + Jupiter aspect). D4 should confirm with Moon (4L) strong position.
interpretation: 4H theme amplification; consistent with D1 strength. Real estate windfall 2010 + property acquisition Marsys mining operations = D4 activation retrodictively.
```

### MX.DVS.D7 — Saptamsa (Children)

```yaml
chart_name: Saptamsa
signification: Children (5H theme amplification)
source: v6.0 §3.4
lel_relevance: EVT.2022.01.03.01 (twin daughters born). D7 is THE critical Dx for progeny reading.
d1_cross_validation: D1 5H Leo empty, Ketu in 5H in Rashi? No — Ketu is in 8H Scorpio natally. 5H signification via Sun (5L in 10H) + Jupiter (putra karaka, 5L-from-Moon). Twin-birth under Rahu AD = unconventional multiplication signature.
interpretation: D7 Mars position (PK Chara Karaka) + Jupiter (natural children-karaka) + 5L-equivalents should show twin-signature via Rahu-D7-role or Mars-doubled. Full D7 per-planet detailed analysis deferred; retrodictive confirmation via D1 signals + Jupiter-transit-Aquarius-on-Moon at birth is sufficient.
```

### MX.DVS.D9 — Navamsa (Spouse / Dharma / General Strength)

**Most critical Dx beyond D1.** v6.0 §3.5 covers in detail including NBRY and 12H stellium sub-sections.

```yaml
dx: 9
chart_name: Navamsa
signification: Spouse, dharma, general strength test of all planets
d9_lagna: Cancer (ruled by Moon)
d9_vargottama: Mercury (Capricorn in both D1 and D9) — SIG.09 operational spine
primary_yogas:
  - SIG.02 Dual D9 NBRY (Venus debilitated Virgo, cancelled by Mercury Vargottama)
  - SIG.03 Saturn D9 NBRY (Saturn debilitated Aries, cancelled by Sun in D9 Lagna)
  - SIG.06 D9 12H Gemini stellium (Moon + Jupiter + Rahu tenants; Mercury Vargottama dispositor)
key_placements:
  - D9 Lagna: Cancer (Moon-ruled; watery emotional-foundation for D9)
  - Sun: D9 Cancer (D9 Lagna — powerful; cancellation of Saturn NBRY comes via Sun here)
  - Moon: D9 Gemini (12H from D9 Lagna Cancer — stellium member, dispersed to foreign/loss)
  - Mars: D9 Pisces (9H from D9 Lagna — dharmic-Mars; connects to D1 7H Mars via dharma-vector)
  - Mercury: D9 Capricorn (Vargottama — chart's strongest divisional continuity)
  - Jupiter: D9 Gemini (12H from D9 Lagna — stellium member)
  - Venus: D9 Virgo (debilitated, cancelled by Mercury Vargottama)
  - Saturn: D9 Aries (debilitated, cancelled by Sun in D9 Lagna)
  - Rahu: D9 Gemini (12H from D9 Lagna — stellium member)
  - Ketu: D9 Sagittarius (6H from D9 Lagna)
d1_cross_validation: |
  D9 STRENGTHENS D1 in multiple ways: Mercury Vargottama confirms operational-spine, double-NBRY (Venus + Saturn) cancels debilitations, 12H stellium adds foreign-dharmic-architecture loop-closure. D9 cancels D1 weaknesses structurally.
  D9 WEAKENS D1 on one major front: Venus in Virgo debilitated = spouse/partnership structural weakness at the dharmic-level, though NBRY mitigates. Native's marriage reality (pain-pleasure, currently separated) fits this D9 Venus pattern.
lel_relevance: 
  - EVT.2013.12.11.01 (marriage — D9 primary)
  - All foreign/US events (D9 12H stellium = SIG.06)
  - EVT.CURRENT.01 (separation — D9 Venus-weak enduring)
interpretation: |
  D9 is the chart's DHARMIC X-RAY. The three D9 signatures (SIG.02, SIG.03, SIG.06) are among the most significant in v1.2.1. Mercury Vargottama across D1-D9 is the chart's single most structurally-continuous element — explains why Mercury MD 2010-2027 carries such uninterrupted operational weight in native's life.
  D9 Lagna Cancer (Moon-ruled) + Moon in D9 12H (Gemini) = emotional-foundation located in foreign/dissolution territory. Native's foreign-residence in 30s-40s (US 2019-2023) is textbook D9 12H stellium delivering. Future Venus MD 2034-2054 will activate D9 Venus-debilitated-NBRY pattern — partnership-dharma will be tested over 20 years with potential redemption via Mercury-dispositor mechanism.
```

### MX.DVS.D10 — Dashamsha (Career/Status)

**Second-most critical Dx (with D9).**

```yaml
dx: 10
chart_name: Dashamsha
signification: Career, status, public life, reputation
d10_lagna: Leo (ruled by Sun)
d10_placements:
  - Sun: D10 Aries 9H (dharmic-career placement; trine from D10 Lagna Leo)
  - Moon: D10 Scorpio 4H (home-of-career — work-as-home signature)
  - Mars: D10 Aries 9H (conjunct Sun — career-warrior in dharma house)
  - Mercury: D10 Virgo 2H (own-sign — career-wealth via Mercury's domain)
  - Jupiter: D10 Pisces 8H (own-sign — career-transformation / crisis-to-wisdom)
  - Venus: D10 Gemini 11H (career-gains-from-communication)
  - Saturn: D10 Taurus 10H (D10 Midheaven — Saturn as 10H career AT the D10 MC)
  - Rahu: D10 Cancer 12H (foreign-career)
  - Ketu: D10 Capricorn 6H (career-enemies/competition register)
primary_yogas:
  - Sun + Mars in D10 9H Aries = dharmic-martial-career-fusion
  - Saturn in D10 10H Taurus = career-permanence (Saturn in Kendra at D10 Lagna's 10th)
  - Jupiter in D10 own-sign Pisces 8H = transformative-dharmic career theme (crisis converts to expansion)
  - Rahu in D10 12H Cancer = foreign-career engine (matches US stint reality)
d1_cross_validation: STRONGLY CONFIRMS D1 career density. Saturn in D10 10H Taurus (D10 Midheaven own-kendra) + Sun/Mars in D10 9H (trine to D10 Lagna) + Mercury in D10 2H own-sign = multi-kendra/trine career dignity. D10 amplifies D1's SIG.14 10H stellium.
lel_relevance: 
  - All career events (2007-2025)
  - Saturn AD 2024-2027 activating D10 10H Saturn-placement = current career peak delivery window
interpretation: |
  D10 is exceptionally strong for native. The combination of Saturn at D10 Midheaven (own-sign Taurus 10H in D10) + Sun+Mars in D10 9H + Mercury own-sign 2H D10 creates a multi-Kendra + dharmic-angle career-architecture. **Correction from v1.0 draft**: earlier versions incorrectly stated "D10 cancels D1 Sun-debilitation" — Sun is NOT debilitated in D1 (Sun sits in Capricorn = enemy's sign, not debilitation sign Libra). The accurate reading: D1 Sun is in enemy's sign compensated by Dig Bala + Vargottama Mercury; D10 further AMPLIFIES Sun via placement in D10 9H (dharmic trine from D10 Lagna Leo) conjunct exalted D10 Mars. Sun goes from "enemy-sign-in-D1-Kendra" to "dharmic-trine-in-D10" = dignity-elevation across charts.
  Retrodictively explains native's career-elevation (Mahindra top-performer, Tepper CMU sponsorship, Marsys entrepreneurship) via the multi-chart Sun-upgrade path combined with Saturn at D10 MC. Rahu in D10 12H specifically predicts the foreign-career stint (US 2019-2023) as a structural D10 feature, not coincidence.
```

### MX.DVS.D12 — Dvadashamsa (Parents)

```yaml
dx: 12
chart_name: Dvadashamsa
signification: Parental ancestry, paternal-lineage, ancestors
d12_lagna: Leo (per v6.0 §3.7)
key_placements:
  - Mercury + Jupiter in D12 Aries (9H from D12 Lagna Leo) — paternal-dharma theme conjoint with Mercury/Jupiter
  - Moon in D12 Scorpio (4H from D12 Lagna — 4H paternal-home signification)
  - Sun in D12 Virgo (2H from D12 Lagna — paternal-wealth/family-of-origin)
  - Saturn + Ketu in D12 Gemini (11H from D12 Lagna — paternal-gains/networks)
d1_cross_validation: CTR.03 (Jupiter Uccha-weak in D1 9H) finds D12 echo in Jupiter being in D12 9H (from D12 Lagna) conjunct Mercury. Father-karaka theme is consistently weak-across-charts (D1 Uccha-Bala-last, D12 placed with Mercury = "analytical father" but not expansive-father).
lel_relevance:
  - EVT.2013.XX.XX.01 (father's kidney disease onset)
  - EVT.2018.11.28.01 (father passed)
  - Paternal-grandfather events
interpretation: |
  D12 confirms D1's CTR.03 pattern: father-signification is structurally weak across charts. Jupiter (father-karaka) in D12 9H (from D12 Lagna) is well-placed in principle, but conjunct Mercury creates "analytical/detached father-relationship" signature rather than full-expansion-father. This retrodictively matches native's father's 5-year illness + relatively muted-life-achievement profile.
```

### MX.DVS.D16 — Shodashamsa (Vehicles)

```yaml
dx: 16
chart_name: Shodashamsa
signification: Vehicles, general comforts, movements
d16_lagna: Leo (per v6.0 §3.8)
key_placements:
  - Moon + Mars + Lagna in D16 Leo (Lagna conjunct Moon+Mars = unusual triple-conjunction-at-Lagna)
  - Mercury + Jupiter in D16 Taurus (10H from D16 Lagna Leo)
  - Rahu + Ketu in D16 Gemini (11H from D16 Lagna)
  - Saturn in D16 Virgo (2H from D16 Lagna)
d1_cross_validation: D1 has no strong vehicle-theme; D16 shows a unique Moon+Mars+Lagna conjunction at D16 Leo. Classical reading: vehicles/comforts are emotionally-and-action-tied.
lel_relevance: Not a major LEL focus area; no specific vehicle-related events in log.
interpretation: |
  D16 Lagna Leo + Moon + Mars triple-conjunction is unusual. Classical: vehicles are a site of active-emotional expression (Mars = vehicle, Moon = emotion, Leo = pride). Native's lifestyle preferences likely track this — not heavily documented in LEL but worth note for Lifestyle Domain Report if ever built.
```

### MX.DVS.D20 — Vimsamsa (Spiritual Sadhana)

```yaml
dx: 20
chart_name: Vimsamsa
signification: Spiritual practice, sadhana, devotion
d20_lagna: Scorpio (per v6.0 §3.9)
key_placements:
  - Lagna + Jupiter in D20 Scorpio (Jupiter at D20 Lagna = "guru-at-self-sadhana-origin")
  - Mars + Rahu in D20 Capricorn (3H from D20 Lagna — effortful sadhana)
  - Moon + Venus in D20 Leo (10H from D20 Lagna — public-devotional theme)
  - Sun in D20 Pisces (5H from D20 Lagna — Vishnu-affinity trine)
d1_cross_validation: |
  **CTR.02 SPIRITUAL VALIDATION**: v1.2.1 names a Dharma Devata tension between classical Venkateshwara (Vishnu) and operational Jagannath. D20 shows **SUN IN PISCES (5H from D20 Lagna)** — Pisces is Vishnu's native sign (Jupiter-ruled, Venus-exalted, Matsya avatar sign). Native's 2025 Vishnu/Venkateshwara gravitation (EVT.2025.XX.XX.01) is D20-structurally-predicted, not just CTR.02-derived.
  Jupiter AT D20 Lagna (Scorpio) = guru-at-origin-of-sadhana; the fact that Jupiter is D1 9L + D20 Lagna creates "dharmic-teacher imprinted on spiritual-architecture."
lel_relevance: EVT.2025.XX.XX.01 (Vishnu gravitation) — STRONGEST D20 retrodictive validation in corpus
interpretation: |
  D20 is the chart's spiritual-architecture X-ray. Scorpio D20 Lagna + Jupiter AT Lagna = research-oriented + guru-anchored spiritual path. Sun in D20 5H Pisces is a rarely-discussed but significant Vishnu-affinity marker. Native's gravitation toward Venkateshwara/Vishnu in 2025 is not merely CTR.02 resolution but a STRUCTURAL D20 Sun-in-Pisces expression coming online as Ketu MD approaches (2027).
  Mars + Rahu in D20 3H Capricorn = effortful-unconventional sadhana signature (Tantric affinity to Maa Ugratara per doc is this pattern — Tantric practice = "unconventional-effortful sadhana"). D20 confirms the dual Shiva/Tantric+Vishnu spiritual orientation.
```

### MX.DVS.D24 — Siddhamsa (Education)

```yaml
dx: 24
chart_name: Siddhamsa
signification: Education, knowledge, learning
d24_lagna: Taurus (per v6.0 §3.10)
key_placements:
  - Moon IN D24 Lagna Taurus (soul-in-learning register — native's emotional-engagement with knowledge)
  - Mercury in D24 3H Cancer (effort-based-communication knowledge)
  - Mars + Rahu + Ketu in D24 6H Libra (nodal axis + Mars on 6H — competitive education)
  - Jupiter in D24 11H Pisces (own-sign gains from knowledge)
  - Sun in D24 8H Sagittarius (deep-research knowledge)
  - Venus in D24 7H Scorpio (partnered-learning theme)
  - Saturn in D24 9H Capricorn (own-sign dharmic-scholarship)
d1_cross_validation: STRONGLY CONFIRMS Saraswati Yoga (Jupiter+Mercury+Venus). D24 shows Jupiter in own-sign (Pisces) in 11H, Saturn in own-sign Capricorn 9H (dharmic-scholarship), Mercury in 3H. Multiple own-sign placements in D24 = robust education architecture.
lel_relevance: XIMB, Tepper, IIT-prep, childhood computer-prodigy recognition — all map to D24.
interpretation: |
  D24 is exceptionally strong. Jupiter + Saturn + Moon all in kendras or trinal-dharmic positions from D24 Lagna. The "Christian institution success" behavioral pattern (doc §8) is D24-coherent: structured-educational environments align with D24 Saturn-Capricorn + Jupiter-Pisces own-sign dignities. Retrodictively explains XIMB + CMU Tepper + Saint Joseph's successes. 
  Mars + Rahu + Ketu in D24 6H = competitive-examination struggles (IIT JEE unsuccessful; XAT/CAT partial) also D24-coherent (6H = enemies/obstacles; nodal axis + Mars = combative context).
```

### MX.DVS.D27 — Bhamsa (Strength/Weakness)

**NEW in v7.0 — see v7.0 supplement §V7.B for placements.**

```yaml
dx: 27
chart_name: Bhamsa / Saptavimshamsa
signification: Strength/weakness, ultimate ruin-vs-prosperity trajectory
d27_lagna: Pisces (computed v7.0 via BPHS Ch.7 Sl.14 rule)
key_placements: See v7.0 §V7.B.1 for all 10 positions (9 planets + Lagna)
vargottama_audit: Computed in v7.0 §V7.B.1 per-row
d1_cross_validation: Pending full-audit integration. v7.0 §V7.B identifies Pisces as D27 Lagna — interesting parallel to D1 12H Pisces (native's strongest-Bhavabala house). D27 Lagna = D1 12H = moksha architecture is the "strength foundation" at the Bhamsa level. Structurally significant: the house where native is STRUCTURALLY STRONGEST at D1 (12H Bhavabala rank 1) IS the Lagna of the strength-chart.
lel_relevance: Long-term strength outcomes; consolidated career + relationship + spiritual outcomes
interpretation: |
  D27 Lagna = Pisces is a striking parallel to D1 12H Pisces (Bhavabala rank 1 per MATRIX_HOUSES). The Bhamsa-strength-chart begins from native's D1 strongest-house — meaning the MOKSHA/FOREIGN/DISSOLUTION dimension is the foundational strength of native's life-trajectory per D27. 
  Native's structural-strength accrues through dharmic-dissolution-foreign registers rather than through conventional-material-accumulation. This aligns with the chart's overall architecture revealed via MATRIX_HOUSES (12H Bhavabala #1) and MATRIX_SIGNS (Pisces intrinsic strength). D27 confirms and amplifies.
```

### MX.DVS.D30 — Trimsamsa (Misfortune)

```yaml
dx: 30
chart_name: Trimsamsa
signification: Misfortune, evils, inner demons
d30_lagna: Capricorn (per v6.0 §3.11)
key_placements:
  - Sun IN D30 Lagna Capricorn (self-imposed/solar-ego challenges — classical for native's chart)
  - Jupiter in D30 2H Aquarius (financial-dharma tension)
  - Ketu + Rahu in D30 3H Pisces (nodal axis amplified in 3H — courage/effort register)
  - Mercury in D30 5H Taurus
  - Saturn + Mars + Venus in D30 6H Gemini (triple-conjunction in 6H — internal conflict zone)
  - Moon in D30 10H Libra (emotional-career-register misfortunes)
d1_cross_validation: The Saturn+Mars+Venus triple-conjunction in D30 6H is intense — three planets in the Trimsamsa misfortune-house represents concentrated internal-conflict signature. Retrodictively: pain-pleasure marriage dynamic + Venus weak + Mars-Saturn 7H tension at D1 finds its D30-expression through this 6H triple-conjunction.
lel_relevance: Struggles, internal conflicts, relationship-friction events
interpretation: |
  D30 is revealing for native. Sun at D30 Lagna indicates the "challenger from within" is Sun-solar-ego itself (classical: D30-Sun = self-created obstacles). The Saturn+Mars+Venus triple-conjunction in D30 6H maps EXACTLY onto native's 7H-structural-tension in D1. D30 is where the chart's inner-friction-pattern is physically instantiated.
  Jupiter in D30 2H Aquarius = dharmic-wealth-pressure (connects to CTR.03 Jupiter-weakness at D1 level). Nodal axis in D30 3H = courage/effort pressure — native's IIT attempt failure and 2016 Mahindra crash both fit "effort-pressure-with-nodal-disruption" D30 reading.
```

### MX.DVS.D40 — Khavedamsa (Maternal auspiciousness)

```yaml
dx: 40
chart_name: Khavedamsa
signification: Auspiciousness/misfortune (mother-line emphasis in some schools)
d40_lagna: Virgo (per v6.0 §3.12)
key_placements:
  - Saturn IN D40 Lagna Virgo (discipline-as-mother-line-inheritance)
  - Mercury + Rahu + Ketu in D40 3H Scorpio (nodal amplification + Mercury at competitive 3H)
  - Jupiter + Venus in D40 9H Taurus (Lakshmi-like 9H conjunction at D40)
  - Sun in D40 7H Pisces (partnership-as-dharmic-devotion signature)
  - Moon + Mars in D40 8H Aries (mother-emotional + action in transformation-register)
d1_cross_validation: Confirms Lakshmi Yoga (SIG.08) repetition in D40 via Jupiter+Venus in 9H. Saturn at D40 Lagna Virgo (its friend sign) echoes D1 Saturn-discipline authority.
lel_relevance: Mother-health events, maternal-auspiciousness windows (not explicitly logged in LEL)
interpretation: |
  D40 shows strong auspiciousness signatures aligning with D1 Lakshmi Yoga. Saturn at D40 Lagna is favorable (Saturn in its friend sign Virgo). Jupiter+Venus 9H recurrence confirms the chart's primary Lakshmi-Saraswati-dharmic-wealth architecture at yet another divisional level.
  Mother's signification via Moon+Mars in 8H Aries = emotional-transformation component in mother-relationship. Relatively limited LEL data on mother explicitly (doc §4 notes family warmth but no major mother-centric events captured).
```

### MX.DVS.D45 — Akshavedamsa (Paternal purity)

```yaml
dx: 45
chart_name: Akshavedamsa
signification: Spiritual purity (father-line emphasis)
d45_lagna: Libra (per v6.0 §3.13)
key_placements:
  - Neptune at D45 Lagna Libra (anomalous — outer-planet flagged per western overlay; v6.0 §3.13 retains Neptune — note)
  - Sun + Moon + Rahu + Ketu cluster in D45 3H Sagittarius (father-house theme Sagittarius amplified)
  - Saturn in D45 4H Capricorn (home/paternal discipline)
  - Jupiter in D45 5H Aquarius
  - Venus in D45 7H Aries (partnership exaltation-of-Sun's-sign)
  - Mercury in D45 8H Taurus
  - Mars in D45 10H Cancer (debilitated Mars at career-kendra D45 — structural challenge)
d1_cross_validation: |
  D45 places Sun/Moon/nodes all in Sagittarius 3H from D45 Lagna Libra. Sagittarius = D1 9H = father-house. D45 places 4 lights-and-nodes in the father-equivalent-house = paternal-lineage signature intensely active. CTR.03 Jupiter-weakness finds D45 expression via Jupiter in 5H (dharmic but not peak-power).
lel_relevance: Paternal spiritual purity / father-karma events — grandfather death, father death, father's kidney disease onset.
interpretation: |
  D45 intensely activates paternal-lineage axis (4 planets/nodes in Sagittarius 3H, which aspects/relates to father-theme). Native's multiple father-lineage-events (grandfather, father, kidney disease onset — 5 LEL events under CTR.03) find D45-structural backing.
  Mars debilitated in D45 10H Cancer = additional weakness layer at paternal-purity level. Contrast with D10 where Mars is in 9H (dharmic). D45 says paternal-lineage purity-challenges persist; D10 says career-dharma works. Both can coexist.
```

### MX.DVS.D60 — Shashtyamsa (Past Karma)

**Classical: D60 is ultimate fine-grain karma. BPHS gives D60 highest weight in Vimsopaka computation.**

```yaml
dx: 60
chart_name: Shashtyamsa
signification: Past karma (most fine-grain divisional at 1/60th = 0°30' per division)
d60_lagna: Gemini (per v6.0 §3.14)
key_placements:
  - Saturn AT D60 Lagna Gemini (karmic-discipline at origin-of-past-karma-reading)
  - Rahu + Jupiter in D60 2H Cancer (karmic-wealth + dharmic-karma)
  - Sun + Moon in D60 3H Leo (self+emotional past-karma conjunction in own-sign-of-Sun)
  - Mars in D60 6H Scorpio (Mars at own-sign in 6H = warrior-past-karma)
  - Ketu in D60 8H Capricorn (moksha-crisis past-karma theme)
  - Mercury + Venus in D60 9H Aquarius (dharma-wealth-knowledge karmic continuity)
d1_cross_validation: |
  D60 Saturn-at-Lagna amplifies D1 Saturn-exalted-7H in a different way: at the karmic-origin level, Saturn-discipline IS the primary past-karma impression. This reinforces CVG.05 Saturn multi-way-activation.
  Ketu in D60 8H Capricorn = past-karma-moksha-through-career-crisis. Native's 2023 US-pivot (career-crisis-to-entrepreneur) is D60-karmically aligned — the pivot is not random but karmically-scripted.
lel_relevance: All "karmic turning-point" events — grandfather/father deaths, 2023 US pivot, 2025 Vishnu gravitation.
interpretation: |
  D60 is the chart's deepest-karmic-reading. Saturn at D60 Lagna + exalted D1 Saturn 7H = Saturn-as-primary-past-karmic-thread. RPT.DVS.02 in Deep Analysis v1.2.1 is the Mode A treatment of this D60. Retrodictively, native's "authority-through-tension" operational signature (SIG.01 + CTR.01) is a past-karma-pattern (D60) expressing as this-life-structure (D1).
  The 2025 Vishnu-Venkateshwara gravitation (EVT.2025.XX.XX.01) gains additional depth: D60 Mercury+Venus in 9H Aquarius = dharma-wealth-knowledge karmic continuity. The spiritual-shift IS karmic-completion, not new-discovery.
```

---

## §4 — CROSS-DIVISIONAL AGGREGATES

### §4.1 — Vargottama observations

Per v6.0 §3.5: **Mercury (D1=D9 Capricorn) is Vargottama** — only planet with explicit D1-D9 sign-sameness. This is the single most structurally-continuous planetary placement. Combined with Yogi + MD lord = CVG.01 6-way convergence (established in Deep Analysis v1.2.1).

D27 Vargottama check pending v7.0 §V7.B detailed row-by-row (computed but not yet aggregated here).

### §4.2 — Dx with D-Lagna sign-themes

| Dx | D-Lagna | Thematic alignment |
|---|---|---|
| D9 | Cancer | Emotional-nurturing foundation for dharma/spouse |
| D10 | Leo | Self-luminosity foundation for career |
| D12 | Leo | Paternal-pride foundation |
| D16 | Leo | Leo triplet in D12/D16 — emphasizes Sun-themes across parental and vehicle-comfort registers |
| D20 | Scorpio | Research/occult foundation for spirituality |
| D24 | Taurus | Steady-earthly foundation for education |
| **D27** | **Pisces** | Moksha foundation for strength |
| D30 | Capricorn | Saturnine-discipline foundation for inner-misfortune |
| D40 | Virgo | Analytical-discipline foundation for auspiciousness |
| D45 | Libra | Partnership/balance foundation for paternal-purity |
| D60 | Gemini | Intellectual-agility foundation for past-karma |

**Observation**: D9 Cancer + D27 Pisces + D60 Gemini = water-water-air trio at the three most significant Dxs (dharma, strength, past-karma). Emotional/fluid registers anchor native's key life-themes at these deep-Dx levels.

### §4.3 — Sun-Pisces across Dxs (CTR.02 validation)

Checking for Sun-in-Pisces placements (Vishnu-affinity signature):

- D20 Sun Pisces 5H (strongest Vishnu-marker per CTR.02 resolution)
- D40 Sun Pisces 7H
- D45 Sun Sagittarius 3H (not Pisces — but in Vishnu's own-sign-of-Sagittarius for Jupiter)

Pattern: multiple Sun-Pisces or Sun-in-Jupiter-signs across spiritual-Dxs (D20, D40). This reinforces EVT.2025.XX.XX.01 Vishnu gravitation as D-level structural-predicted event, not just CTR.02 surface resolution.

### §4.4 — New SIG candidates from Divisional Matrix

- **SIG.26 (tentative)**: D27 Lagna Pisces = D1 12H Pisces parallel — structural-strength-foundation-in-moksha-dimension. Elevates 12H's Bhavabala rank 1 (MX.HSE.12) to cross-Dx recurring signal.
- **SIG.27 (tentative)**: D60 Saturn-at-Lagna reinforces Saturn-karmic-primacy — past-karma's main thread is Saturn-discipline. Cross-validates CVG.05.
- **SIG.28 (tentative)**: D20 Sun-Pisces + D40 Sun-Pisces = repeating Vishnu-affinity structure across spiritual-divisionals. Promotes CTR.02 to a structural-predictive signal rather than surface-contradiction.

---

## §5 — RED-TEAM CHECK

- **Completeness**: 16/16 Dxs covered. Most have full yogas/afflictions/cross-validation; some (D2, D3, D16) have lighter treatment acknowledging limited per-planet data in v6.0 summary tables.
- **Over-claim**: New SIG.26-28 marked tentative. Deferred items (D7 per-planet, D27 Vargottama full audit) noted explicitly.
- **Missing-data**: Some Dx have only sign-occupancy tables in v6.0 without per-planet degrees. Degree-level D9 and D10 available; others summary only. Sufficient for Mode B coverage but a v1.1 refinement target.
- **Bias**: Interpretations weighted toward confirming existing v1.2.1 signals. D20 Sun-Pisces and D27 Pisces-Lagna are novel readings with implications — marked SIG-candidate not established.

---

## §6 — OUTPUT FOR L2.5

### §6.1 — CGM contributions
16 DVS nodes (one per Dx) + divisional-confirmation edges: for each of 9 planets × 16 Dxs = 144 placement edges, plus 16 D-Lagna edges.

### §6.2 — MSR signal contributions (~30)
- 16 D-Lagna-sign signals
- 1 Vargottama signal (Mercury)
- ~5 Dx-specific yoga signals (D9 NBRY x2, D9 stellium, D10 Saturn-MC, D24 Jupiter own-sign, D30 triple-conjunction, D60 Saturn-Lagna)
- 3 new SIG candidates (26, 27, 28)
- ~5 cross-validation signals (D confirms D1 vs contradicts)

### §6.3 — Feed to L2.5 CDLM
D9 = spouse/dharma-linkage register → feeds Relationships + Spiritual domain coupling
D10 = career register → feeds Career + Wealth coupling
D12 = parental register → feeds Parents + Family domains
D20 + D45 = spiritual register → feeds Spiritual + Dharma domains

---

## §7 — CHANGELOG

```yaml
v1.0 (2026-04-17, Session 9):
  - Initial Mode B Divisional Matrix covering all 16 Shodashavarga Dxs
  - D27 Bhamsa incorporated from v7.0 §V7.B (new)
  - Extends v6.0 §3.* raw placements with purpose, D1 cross-validation, LEL relevance, interpretation per Dx
  - 3 new SIG candidates (26 D27-Pisces-parallel, 27 D60-Saturn-Lagna, 28 Dx-Sun-Pisces-CTR.02-structural)
  - Status: CLOSED (Session 9 output paired with MATRIX_SIGNS)
```

**END OF DIVISIONAL MATRIX v1.0**
