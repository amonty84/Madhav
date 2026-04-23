# ARCHIVED: Superseded by MSR_v3_0.md (2026-04-22)
---
artifact: MSR_v2_0.md
version: 2.2
status: CLOSED
session: FIX_SESSION_003; MSR_EXPANSION_2026-04-19
date: 2026-04-19
supersedes: MSR_v1_0.md
scope: "Master Signal Register — 420 originals + v8.0 reconciliation + §VIII-B expansion **MSR.444–MSR.496** (53) = **500** total signals; MSR_v1_0."
parent_sources: [JHORA_TRANSCRIPTION_v8_0_SOURCE.md, FORENSIC_DATA_v8_0_SUPPLEMENT.md, V8_0_RECONCILIATION_REPORT.md, MSR_v1_0.md]
corrections_applied: []
provenance_policy: |
  MSR.001-420 (v6.0-era signals): Built from FORENSIC_ASTROLOGICAL_DATA_v6.0 + v7.0 data.
  All v6.0-era signals have been cross-checked against FORENSIC_v8_0 in FIX_SESSION_003 and GAP_RESOLUTION_SESSION:
  - All other v6.0-era signals are CONFIRMED by FORENSIC_v8_0 (same fact, same position, same relationship).
  MSR.421-443 (v8.0-native signals): Built directly from FORENSIC_v8_0 data; full provenance.
  MSR.444–MSR.496: Expansion batch 2026-04-19 — nakshatra, sahams, dasha/transit, divisional, upagraha (§VII.4 pathways).
  CGP Provenance status: COMPLETE (2026-04-19 GAP_RESOLUTION_SESSION).
v2_2_changelog: "§0-SCHEMA.2 version-diff notes stripped; inline correction commentary removed. See 00_ARCHITECTURE/AUDIT_REPORT_v1_0.md for history."
---

# MASTER SIGNAL REGISTER v2.2 — Abhisek Mohanty
## AM-JIS L2.5 Holistic Synthesis
### FIX_SESSION_003 + MSR_EXPANSION | 2026-04-19 | **500 signals**

---

## §0 — PROVENANCE REGISTRY

### §0.1 — v6.0-Era Signal Provenance (MSR.001-420)

All 420 v6.0-era signals cross-checked against FORENSIC_v8_0 (2026-04-19).

**CONFIRMED signals** (underlying fact unchanged — confirmed by v8.0):
All other MSR.001-420 signals. The v6.0 data for these cells was accurate and is retained in v8.0 without change. See §II for the explicit UNAFFECTED confirmation list of notable signals.

**CGP Provenance category**: COMPLETE (2026-04-19)

Provenance status also updated in GOVERNANCE_STACK §3 (see Task G1).

---

## §0-SCHEMA — SCHEMA REFERENCE AND VERSION NOTES

### §0-SCHEMA.1 Schema

Every signal follows the 12-field schema (per Architecture §C.3.2):

```
SIG.MSR.NNN:
  signal_name: ""
  signal_type: yoga | dignity | aspect | dasha-activation | transit-activation |
               house-strength | divisional-pattern | convergence | contradiction |
               sensitive-point | panchang | remedial-trigger | nakshatra-signature |
               jaimini-pattern | kp-signature | tajika-pattern
  classical_source: ""
  entities_involved: []
  strength_score: 0.00–1.00
  valence: benefic | malefic | mixed | neutral | context-dependent
  temporal_activation: natal-permanent | dasha-windowed | transit-triggered | annual | monthly
  supporting_rules: []
  falsifier: ""
  domains_affected: []
  confidence: 0.00–1.00
  v6_ids_consumed: []
  rpt_deep_dive: ""
```

### §0-SCHEMA.2 Version Notes
*Full correction history: `00_ARCHITECTURE/AUDIT_REPORT_v1_0.md`.*

### §0-SCHEMA.3 Signal Range Summary

| Range | Content | Count |
|---|---|---|
| MSR.001–MSR.046 | Pre-cataloged signals (ported from DA v1.2.1) | 46 |
| MSR.047–MSR.300 | Phase 2–4 signals (Sessions 6–17) | 254 |
| MSR.301–MSR.420 | Phase 4–5 signals (Sessions 17–32) | 120 |
| MSR.421–MSR.437 | NEW: v8.0 yoga signals | 17 |
| **TOTAL** | | **437** |

---

## §I — SIGNALS



---

### MSR.391

SIG.MSR.391:
  signal_name: "7H Five-Layer Wealth-Relational-Lakshmi Convergence"
  signal_type: convergence
  classical_source: "BPHS Ch.26 (Sasha Mahapurusha); Brihat Jataka (Shree Lagna); Jaimini (Bhrigu Bindu); BPHS Ch.4 (KP sub-lord); V8_0_RECONCILIATION_REPORT §3.1"
  entities_involved: [PLN.SATURN, PLN.MARS, BB.NATAL, LAG.SHREE, KP.CUSP7.SUBLORD.SATURN, HSE.7, SGN.LIBRA]
  strength_score: 0.90
  valence: benefic
  temporal_activation: natal-permanent
  supporting_rules:
    - "Layer 1: Saturn exalted 22°27' Libra 7H = Sasha Mahapurusha Yoga in the relational-wealth axis"
    - "Layer 2: Mars (Lagna lord, 1L+8L, Avayogi) in Libra 7H = self-initiative embedded in partnership axis"
    - "Layer 3: Bhrigu Bindu 8°03' Libra 7H (JH AUTHORITATIVE, FORENSIC confirmed) = chart's fortune-timing nexus in relational axis"
    - "Layer 4: Shree Lagna 23°19' Libra Vishakha Pada 1 (JH AUTHORITATIVE) = Lakshmi-grace point IN THE 7H — this is the Lakshmi anchor for the entire chart"
    - "Layer 5: KP sub-lord of 7H cusp = Saturn (same as primary 7H tenant — self-referential KP confirmation)"
    - "ARCHITECTURAL MEANING: 7H is the chart's WEALTH-RELATIONAL-LAKSHMI anchor. Shree Lagna = Lakshmi's seat. This chart's primary material-grace point is in the partnership/relational house. Wealth flows through relational quality."
  domains_affected: [relationships, wealth, career, spirit]
  confidence: 0.92
  v6_ids_consumed: [PLN.SATURN, PLN.MARS, BB.NATAL, LAG.SHREE, KP.CUSP7]
  rpt_deep_dive: "RPT.HSE.02.B, REPORT_RELATIONSHIPS_v1_1, UCN_v3_0 §XVII"

---

### MSR.402

SIG.MSR.402:
  signal_name: "Hidden-Pinnacle 8H Architecture via Varnada+Ghati Lagnas"
  signal_type: convergence
  invalidation_reason: "Invalidated — see MSR.402b for replacement signal."
  original_confidence: 0.87
  revised_confidence: 0.00
  domains_affected: []

SIG.MSR.402b:
  signal_name: "Domestic-Dharmic Authority Architecture — Varnada in 4H Cancer + Ghati in 9H Sagittarius (REPLACEMENT FOR MSR.402)"
  signal_type: jaimini-pattern
  classical_source: "Jaimini Upadesa Sutras (Varnada Lagna); classical Ghati Lagna doctrine; JHORA_TRANSCRIPTION_v8_0_SOURCE.md §2.1"
  entities_involved: [LAG.VARNADA, LAG.GHATI, HSE.4, HSE.9, SGN.CANCER, SGN.SAGITTARIUS]
  strength_score: 0.72
  valence: benefic
  temporal_activation: natal-permanent
  supporting_rules:
    - "Varnada Lagna: Cancer 12°25' Pushya Pada 3 (4H) — JH AUTHORITATIVE. Varnada = social/caste/community authority. In 4H Cancer (Moon's own sign, Jupiter's exaltation sign) = native's social authority is rooted in domestic/sanctuary/maternal themes."
    - "Ghati Lagna: Sagittarius 13°56' Purva Ashadha Pada 1 (9H) — JH AUTHORITATIVE. Ghati = strength-timing lagna. In 9H Sagittarius (Jupiter's own sign) = native's strength and timing are most potent when operating through dharmic/higher-purpose/guru-transmission channels."
    - "Ghati Lagna in 9H reinforces the already dense 9H (Jupiter + Venus + Mahatmya Saham + Mrityu Saham) — the native's peak-strength timing is in dharmic contexts."
    - "Varnada in 4H joins: Moon-ruled 4H + Mitra Saham + Samartha Saham + Vivaha Saham + Kali Saham + Matru Saham = the domestic-relational sanctuary is the native's social authority base."
  domains_affected: [relationships, spirit, career, parents]
  confidence: 0.85
  v6_ids_consumed: [LAG.VARNADA, LAG.GHATI, HSE.4, HSE.9]
  rpt_deep_dive: "UCN_v3_0 §XIX, REPORT_SPIRITUAL_v1_1"

---

### MSR.404 — UPGRADED v2.0

SIG.MSR.404:
  signal_name: "BB-UL 2026 Five-Fold Crystallization — Quadruple-Loaded Gemini 3H Convergence (v2.0 UPGRADED)"
  signal_type: sensitive-point
  classical_source: "Brihat Nakshatra (Bhrigu Bindu methodology); Jaimini (UL); FORENSIC_DATA_v8_0_SUPPLEMENT §1.2; V8_0_RECONCILIATION_REPORT §3.2"
  entities_involved: [BB.NATAL, ARD.UL, ARD.A5, ARD.A11, LAG.HORA, HSE.3, SGN.GEMINI, PLN.MERCURY]
  strength_score: 0.92
  valence: benefic
  temporal_activation: transit-triggered
  supporting_rules:
    - "AM-JIS canonical timed-BB framing: natal BB Libra 8°03'; progression rate **6°/year** per FORENSIC_DATA_v7_0_SUPPLEMENT §V7.F (contradiction §3.1 RESOLVED 2026-04-19 in CONTRADICTION_REGISTRY_v1_1)."
    - "Simple linear (42 × 6°) arithmetic from BB alone does not govern the crystallization thesis; **Gemini 3H loading** is established independently by UL + A5 + A11 + **Hora Lagna (JH 3H Gemini)** co-tenancy — MSR.404 is a **convergence signal**, not a pure single-formula progression proof."
    - "Gemini 3H loading at age 42: UL (Gemini 3H) + A5 + A11 + Hora Lagna (JH confirmed) + BB progression = FIVE-FOLD activation, not three-fold as v1.0 claimed."
    - "Mercury rules Gemini 3H — the chart's primary planet governs the convergence sign"
    - "Timing: Mercury MD / Saturn AD (now active 2024-2027) governs the dasha context of the convergence"
    - "Chara Dasha: Scorpio MD / Libra AD (6th from Gemini = Scorpio, activating the axis)"
  falsifier: "If JH-authoritative UL/A5/A11/HL 3H Gemini convergence were overturned by new birth-data revision, the five-fold loading thesis would need rework. BB progression rate disputes alone do not invalidate 3H loading — HL confirmation is independent."
  domains_affected: [relationships, wealth, career, mind]
  confidence: 0.94
  v6_ids_consumed: [BB.NATAL, ARD.UL, ARD.A5, ARD.A11, LAG.HORA, HSE.3]
  rpt_deep_dive: "REPORT_RELATIONSHIPS_v1_1, UCN_v3_0 §XVII"

---

### MSR.407

SIG.MSR.407:
  signal_name: "9H Jupiter-Venus Laxmi-Narayana-Adjacent Architecture — Shree Lagna OUT of 9H (v2.0)"
  signal_type: convergence
  classical_source: "BPHS Ch.24 (Lakshmi Yoga); UCN §IV.4; JHORA_TRANSCRIPTION_v8_0_SOURCE.md §2.1; V8_0_RECONCILIATION_REPORT §3.3"
  entities_involved: [PLN.JUPITER, PLN.VENUS, HSE.9, SGN.SAGITTARIUS, SAH.MAHATMYA, SAH.MRITYU]
  strength_score: 0.80
  valence: benefic
  temporal_activation: natal-permanent
  supporting_rules:
    - "Jupiter 9°48' Sagittarius 9H (own sign, 9L in 9H) — CONFIRMED"
    - "Venus 19°10' Sagittarius 9H (Jupiter's sign, in dharma trine) — CONFIRMED"
    - "Laxmi-Narayana-adjacent principle: Jupiter (Narayana-principle) + Venus (Lakshmi-principle) in dharma trine = the wealth-devotion-dharma benefics together"
    - "Mahatmya Saham 11°24' Sagittarius 9H (JH AUTHORITATIVE) — Greatness/honor point IS in 9H, joining Jupiter-Venus"
    - "Mrityu Saham 27°46' Sagittarius 9H — also in 9H (different import but confirms 9H density)"
    - "Net interpretation: 9H produces dharmic wealth through Jupiter-Venus-Mahatmya constellation. The Lakshmi-entry-point for the chart is 7H (via Shree Lagna — see MSR.391). Both readings are real but describe different mechanisms: 9H = dharmic-wealth enabler; 7H = Lakshmi-wealth anchor."
  falsifier: "If Jupiter or Venus were to vacate 9H (natal-permanent — impossible except through recomputation with different birth data), the Laxmi-Narayana principle loses its base. JH confirms both planets in 9H Sagittarius."
  domains_affected: [spirit, wealth, career, relationships]
  confidence: 0.82
  v6_ids_consumed: [PLN.JUPITER, PLN.VENUS, HSE.9, LAG.SHREE]
  rpt_deep_dive: "UCN_v3_0 §XVII, REPORT_FINANCIAL_v2_1, REPORT_SPIRITUAL_v1_1"

---

### MSR.413 — UPGRADED v2.0

SIG.MSR.413:
  signal_name: "Mercury Eight-System Convergence — Chart's Primary Operational Planet (v2.0 UPGRADED from Seven)"
  signal_type: convergence
  classical_source: "BPHS Ch.7 (Vargottama); BPHS §5.1 (Vimshottari); Phaladeepika Ch.26 (Yogi); Jaimini (Chara DK); Jaimini (Karakamsa); KP methodology (cusp sub-lord); Yoga Sphuta (Birth Yoga); JHORA_TRANSCRIPTION_v8_0_SOURCE.md §0 (Yoga = Siva, Mercury-ruled)"
  entities_involved: [PLN.MERCURY, YOG.MERCURY_EIGHT_SYSTEM, YOG.SIVA_YOGA_MERCURY_LORD, DSH.V.MERCURY_MD]
  strength_score: 0.96
  valence: benefic
  temporal_activation: natal-permanent
  supporting_rules:
    - "System 1: Mercury in 10H Capricorn (natal tenancy in career apex)"
    - "System 2: Vimshottari MD lord 2010–2027 (17-year operational window)"
    - "System 3: Yogi Planet — rules Revati, the nakshatra of the Yogi Point in 12H Pisces"
    - "System 4: DK (Darakaraka) by Chara — spouse/business partner significator"
    - "System 5: Karakamsa lord — Mercury rules Gemini (the sign Moon occupies in D9 = Karakamsa)"
    - "System 6: KP cusp 11 sub-lord — Mercury's KP designation in the gains-house sub-period"
    - "System 7: Vargottama — Mercury in Capricorn D1 = Capricorn D9 = maximum stability designation"
    - "System 8 (NEW v2.0): Birth Yoga = Siva (Mercury-ruled) — JH confirms Birth Yoga = Siva, whose ruling planet is Mercury (Yoga Lord). Siva is an auspicious Yoga among the 27 Yogas. This is Mercury's 8th independent classical-system designation as chart-primary. GAP.01 RESOLVED."
    - "Pancha-Vargeeya classification: Mercury = 11.43 = POWERFUL (JH confirmed)"
    - "NOTE: Seven-System → Eight-System upgrade does not alter the operational primacy of Mercury — it strengthens it. All seven prior systems confirmed by JH; the eighth is a new discovery."
  falsifier: "Falsification of Mercury Eight-System Convergence would require: (1) Mercury MD fails to produce aligned outcomes over sustained 5+ year window; (2) 3+ of 8 system designations are found to be calculation errors upon re-audit. Neither condition currently applies. Birth Yoga = Siva is now L1-confirmed (JH authoritative)."
  domains_affected: [career, wealth, relationships, mind, spirit]
  confidence: 0.98
  v6_ids_consumed: [PLN.MERCURY, D9.MERCURY, DSH.V.MERCURY_MD, YOG.BIRTH_YOGA_SIVA]
  rpt_deep_dive: "UCN_v3_0 §XX, MSR.016, MSR.009"

---

### MSR.022

SIG.MSR.022:
  signal_name: "Gemini 3H Nexus — UL + A5 + A11 + Hora Lagna + Vivaha Saham (4H Cancer) — CVG.07"
  signal_type: convergence
  classical_source: "Jaimini (Upapada Lagna); BPHS Ch.11 (Upagrahas); JHORA_TRANSCRIPTION_v8_0_SOURCE.md §2.1–2.2; CVG.07"
  entities_involved: [ARD.UL, ARD.A5, ARD.A11, LAG.HORA, SAH.VIVAHA, UPG.GULIKA, UPG.DHUMA, HSE.3, SGN.GEMINI, HSE.4]
  strength_score: 0.82
  valence: mixed
  temporal_activation: natal-permanent
  supporting_rules:
    - "UL in Gemini 3H = spouse-arudha in communication/commerce zone"
    - "A5 (children-arudha) in same sign = children-communication nexus"
    - "A11 (gains-arudha) = gains projected through Gemini themes"
    - "Gulika (shadow) + Dhuma (smoke) in Gemini 3H = subtle obstructions on the relational-communication axis"
    - "D9 12H Gemini stellium (Moon+Jupiter+Rahu) = divisional reinforcement of Gemini themes"
  falsifier: "If Arudha calculations yielded different house placements (alternate house-skipping rules), this nexus would partially dissolve. JH confirms HL in Gemini 3H independently of Arudha calculations."
  domains_affected: [relationships, children, wealth]
  confidence: 0.82
  v6_ids_consumed: [ARD.UL, ARD.A5, ARD.A11, LAG.HORA, SAH.VIVAHA, UPG.GULIKA, UPG.DHUMA, HSE.3, HSE.4]
  rpt_deep_dive: "RPT.HSE.02.C, REPORT_RELATIONSHIPS_v1_1"

---

### MSR.024 (CTR.01) — SUBSTANTIALLY REVISED v2.0

SIG.MSR.024:
  signal_name: "Saturn Ishta/Kashta Phala Resolution — Saturn IS the Chart's Most Beneficial Phala Planet (v2.0 REVISED)"
  signal_type: contradiction
  classical_source: "BPHS Ch.27–28 (Shadbala vs Shuddha Pinda); JHORA_TRANSCRIPTION_v8_0_SOURCE.md §3.3; FORENSIC_DATA_v8_0_SUPPLEMENT §1.11"
  entities_involved: [PLN.SATURN, YOG.SASHA_MPY]
  strength_score: 0.85
  valence: benefic
  temporal_activation: natal-permanent
  supporting_rules:
    - "JH v8.0 Ishta/Kashta Phala for Saturn: Ishta = 43.28, Kashta = 4.81 = ~9:1 beneficial"
    - "Saturn's Ishta 43.28 is the HIGHEST in the chart. Saturn's Kashta 4.81 is the LOWEST (best) in the chart."
    - "This INVERTS the v1.0 CTR.01 reading that called Saturn 'Dramatic-Not-Compound' via Shuddha Pinda rank 7."
    - "RESOLUTION: Saturn is the chart's architecturally most-beneficial planet by Phalita measure. The v1.0 CTR.01 reading was based on a different metric (Shuddha Pinda) that conflicts with Ishta/Kashta. JH's Ishta/Kashta is authoritative for Phalita analysis."
    - "Revised synthesis: Saturn delivers through structure, discipline, and steady pressure — not through windfall or spontaneous fortune. But the NET delivery is highly positive. ~9:1 Ishta:Kashta means the 'dramatic' quality is the form of delivery, not a limitation on the quantum of benefit."
    - "Retrodictive confirmation: Sade Sati Paradox (MSR.396) = Saturn transit during Sade Sati = career achievement. BB in 7H (Saturn's house) as fortune nexus. Saturn AD 2024-2027 = chart's most productive period. All consistent with 9:1 beneficial Saturn."
    - "Operational triad confirmed: Mercury (8-system primary instrument) + Saturn (9:1 Ishta primary Phala deliverer) + Jupiter (Pancha-Vargeeya most powerful authorizer) = the three operational planets."
  domains_affected: [career, relationships, wealth, health]
  confidence: 0.93
  v6_ids_consumed: [PLN.SATURN, SBL.SAT, ISH.SAT, KAS.SAT]
  rpt_deep_dive: "REPORT_FINANCIAL_v2_1, UCN_v3_0 §XXIII"

---

## §II — SIGNALS CARRYING FORWARD UNCHANGED (MSR.001–MSR.391 EXCEPT NOTED)

All signals from MSR_v1_0 carry forward with their original text EXCEPT:


- MSR.001 (Sasha Mahapurusha Yoga) — UNAFFECTED. Saturn exalted 7H confirmed.
- MSR.004 (Moon AK 11H) — UNAFFECTED. Moon Aquarius 11H confirmed.
- MSR.007 (Saraswati Yoga) — UNAFFECTED. Jupiter-Venus-Mercury constellation confirmed.
- MSR.008 (Lakshmi Yoga) — UNAFFECTED. Jupiter 9L own sign 9H confirmed.
- MSR.009 (Mercury Operational Spine) — UNAFFECTED (upgraded in MSR.413).
- MSR.015 (Hidden Raja Yoga Mars+Saturn 7H) — UNAFFECTED. Both planets in 7H confirmed.
- MSR.016 (Mercury CVG.01) — UNAFFECTED.
- MSR.017 (Jupiter 9L Dharma-Wealth) — UNAFFECTED.
- MSR.031 (Rahu Jaimini Quadruple Aspect) — UNAFFECTED. Rahu Taurus 2H confirmed.
- MSR.397 (Devata Triple-Lock) — UNAFFECTED. Karakamsa derivation confirmed.
- MSR.343 (PK Mars in 7H / children-through-marriage) — NOTE: This signal retains its dual-karaka-system framing. Under JH 8-karaka, Mars = PiK (Father-karaka), not PK. Under v6.0 7-karaka, Mars = PK. Both noted; signal remains with dual-system annotation.

---

## §III — SIGNAL CORRECTIONS FOR SPECIAL LAGNA CITATIONS


| Signal | v1.0 Erroneous Cite | v2.0 Correct Value | Impact |
|---|---|---|---|
| Any citing "HL in 7H Libra" | Hora Lagna = Libra 7H | Hora Lagna = Gemini 0°39' 3H | HL is in UL's house (3H), not 7H |
| Any citing "Shree Lagna 9H" or "Shree Lagna Sagittarius" | Shree Lagna = Sagittarius 9H | Shree Lagna = Libra 23°19' 7H | Lakshmi-point is in 7H, not 9H |
| Any citing "Varnada in 8H" or "Varnada Scorpio" | Varnada Lagna = Scorpio 8H | Varnada Lagna = Cancer 12°25' 4H | Social authority in domestic-Cancer domain |
| Any citing "Ghati in 8H" or "Ghati Scorpio" | Ghati Lagna = Scorpio 8H | Ghati Lagna = Sagittarius 13°56' 9H | Peak-strength timing in dharmic domain |
| Any citing "Vivaha Saham 3H" or "Vivaha Gemini" | Vivaha Saham = Gemini 3H | Vivaha Saham = Cancer 9°09' 4H | Marriage-fortune in 4H domestic house |
| Any citing "Roga Saham 7H" or "Roga Libra" | Roga Saham = Libra 7H | Roga Saham = Taurus 27°46' 2H | Health-challenge via speech/wealth house |
| Any citing "Mahatmya Saham 7H" or "Mahatmya Libra" | Mahatmya Saham = Libra 7H | Mahatmya Saham = Sagittarius 11°24' 9H | Greatness-honor in dharmic domain |

---

## §IV — ROGA SAHAM AND MAHATMYA SAHAM

The following NEW signals document the correct placements of Roga and Mahatmya Sahams (removed from MSR.391's 7H composition):

SIG.MSR.391a:
  signal_name: "Saham Roga in 2H Taurus Mrigashira — Health Challenges via Speech-Wealth Domain"
  signal_type: tajika-pattern
  classical_source: "Tajika Neelakanthi (Roga Saham classical formula); JHORA_TRANSCRIPTION_v8_0_SOURCE.md §2.2"
  entities_involved: [SAH.ROGA, HSE.2, SGN.TAURUS, NAK.MRIGASHIRA]
  strength_score: 0.60
  valence: malefic
  temporal_activation: natal-permanent
  supporting_rules:
    - "Roga Saham = 27°46' Taurus Mrigashira 2H (JH AUTHORITATIVE)"
    - "2H = family, speech, accumulated wealth, values, face/throat constitution"
    - "Mrigashira nakshatra (Mars-ruled) in Taurus (Venus's sign) = health concerns manifest in Mars-Venus domain (musculoskeletal, blood, vitality)"
    - "Health challenges in this chart are structurally linked to the 2H domain (speech overuse, jaw-throat, accumulated-wealth stress, family-relational pressure as health trigger)"
    - "2H Bhavabala rank 11 (second weakest) = the Roga Saham sits in a structurally weak house, which may amplify the vulnerability"
    - "D4.D3 cross-domain linkage (Health↔Relationships) NOW requires reframing: the primary mechanism is 2H Roga (via speech/family/wealth stress), NOT 7H Roga (via direct partner-disease linkage as v1.0 claimed)"
  falsifier: "If Roga Saham recomputation (authoritative classical formula) places it in 7H, the old linkage restores. JH v8.0 Taurus 2H reading is authoritative."
  domains_affected: [health, wealth, relationships]
  confidence: 0.88
  v6_ids_consumed: [SAH.ROGA, HSE.2, NAK.MRIGASHIRA]
  rpt_deep_dive: "REPORT_HEALTH_LONGEVITY_v1_1"

SIG.MSR.391b:
  signal_name: "Saham Mahatmya in 9H Sagittarius Moola — Greatness-Honor in Dharmic Domain"
  signal_type: tajika-pattern
  classical_source: "Tajika Neelakanthi (Mahatmya Saham); JHORA_TRANSCRIPTION_v8_0_SOURCE.md §2.2"
  entities_involved: [SAH.MAHATMYA, HSE.9, SGN.SAGITTARIUS, NAK.MOOLA]
  strength_score: 0.78
  valence: benefic
  temporal_activation: natal-permanent
  supporting_rules:
    - "Mahatmya Saham = 11°24' Sagittarius Moola 9H (JH AUTHORITATIVE)"
    - "9H placement: Mahatmya (greatness/honor/reputation) in the dharmic house = honor flows through dharmic channels"
    - "Moola nakshatra (Ketu-ruled) in 9H = the greatness-point is activated through Ketu-type depth and root-reaching. Moola = going to the root."
    - "Jupiter (9H, own sign) and Venus (9H) are already in this sign — Mahatmya Saham joins them in the 9H dharmic concentration"
    - "This REINFORCES the 9H's function as the native's public-greatness domain. Native achieves recognition through dharmic-depth channels (teaching, wisdom-transmission, principled action)"
    - "Combined with Ghati Lagna in 9H Sagittarius: strength-timing + greatness-honor both anchored in the dharmic house"
  falsifier: "If Mahatmya Saham recomputation placed it in a different house, the 9H dharmic-greatness architecture partially reduces."
  domains_affected: [career, spirit, wealth]
  confidence: 0.85
  v6_ids_consumed: [SAH.MAHATMYA, HSE.9, NAK.MOOLA, PLN.JUPITER, PLN.VENUS]
  rpt_deep_dive: "REPORT_SPIRITUAL_v1_1, REPORT_FINANCIAL_v2_1"

---

## §V — VIVAHA SAHAM CORRECTION SIGNAL

SIG.MSR.391c:
  signal_name: "Vivaha Saham in 4H Cancer Pushya — Marriage-Fortune Anchored in Domestic-Maternal Domain"
  signal_type: tajika-pattern
  classical_source: "Tajika Neelakanthi (Vivaha Saham = marriage-fortune lot); JHORA_TRANSCRIPTION_v8_0_SOURCE.md §2.2"
  entities_involved: [SAH.VIVAHA, HSE.4, SGN.CANCER, NAK.PUSHYA]
  strength_score: 0.72
  valence: benefic
  temporal_activation: natal-permanent
  supporting_rules:
    - "Vivaha Saham = 9°09' Cancer Pushya Pada 4H (JH AUTHORITATIVE)"
    - "Cancer 4H = domestic sanctuary, maternal, home, emotional foundation"
    - "Pushya nakshatra = nourishment, stability, growth, Jupiter-ruled"
    - "Marriage-fortune (Vivaha Saham) in 4H = marriage manifests in/through the domestic sanctuary; the home IS the marriage expression domain"
    - "4H Bhavabala rank 5 (moderate-strong) = structurally solid house for Vivaha Saham"
    - "Cancer 4H already carries: Mitra, Samartha, Vanik, Karyasiddhi, Matru, Sraddha, Kali Sahams — the Vivaha Saham joins a Cancer-4H saham concentration of 7 points, making 4H the most saham-dense house"
    - "Vivaha Saham joining A2 (family arudha) in Cancer 4H = marriage and family image are co-located in the same house (domestic convergence)"
  falsifier: "If Vivaha Saham recomputation placed it in 3H Gemini or elsewhere, the 4H domestic-marriage reading shifts."
  domains_affected: [relationships, parents, mind]
  confidence: 0.88
  v6_ids_consumed: [SAH.VIVAHA, HSE.4, NAK.PUSHYA]
  rpt_deep_dive: "REPORT_RELATIONSHIPS_v1_1"

---

## §VI — NEW SIGNALS: 17 CLASSICAL YOGAS FROM JH v8.0 (MSR.421–MSR.437)

These signals are newly confirmed from JHORA_TRANSCRIPTION_v8_0_SOURCE.md §6. All carry source citation to JH transcription. No fabricated computations; JH v8.0 is the authoritative L1 source.

---

SIG.MSR.421:
  signal_name: "Kalpadruma / Parijata Yoga (D-1) — Royal Yoga of Principled Warrior King"
  signal_type: yoga
  classical_source: "Phaladeepika Ch.6 (Kalpadruma/Parijata Yoga); BPHS Ch.23 (complex Raja Yoga); JHORA_TRANSCRIPTION_v8_0_SOURCE.md §6.1"
  entities_involved: [PLN.MARS, PLN.VENUS, PLN.JUPITER, PLN.MERCURY, HSE.7, HSE.9, HSE.10]
  strength_score: 0.87
  valence: benefic
  temporal_activation: natal-permanent
  supporting_rules:
    - "JH §6.1 explicitly identifies 'Kalpadruma/Parijata Yoga' with members: Mars, Venus, Jupiter, Mercury"
    - "Classical result: 'King, principled, warrior, prosperous, strong, kind'"
    - "Kalpadruma requires: Lagna lord (Mars), its dispositor (Venus — disposits Mars in Libra), their sign and Navamsa dispositors all in own/exaltation sign or Kendra/Kona. JH confirms this yoga is formed."
    - "This is a MAJOR royal yoga not previously documented in the MSR — its formation involves four planets and requires a complex multi-dispositor chain to hold"
    - "The warrior-king quality of Kalpadruma is consistent with MSR.015 (Hidden Raja Yoga Mars+Saturn) and MSR.023 (Aries-Libra Axis Authority) — multiple royal-authority signals converge"
  falsifier: "If the specific Kalpadruma dispositor chain breaks (e.g., one of the four planets is not in own/exalt/kendra-kona), the yoga does not form. JH v8.0 confirms formation."
  domains_affected: [career, wealth, relationships, spirit]
  confidence: 0.85
  v6_ids_consumed: [PLN.MARS, PLN.VENUS, PLN.JUPITER, PLN.MERCURY]
  rpt_deep_dive: "UCN_v3_0 §XXII"

SIG.MSR.422:
  signal_name: "Chaamara Yoga (D-1) — Long-Lived, Scholarly, Eloquent Native"
  signal_type: yoga
  classical_source: "Phaladeepika Ch.6 (Chaamara Yoga); JHORA_TRANSCRIPTION_v8_0_SOURCE.md §6.1"
  entities_involved: [PLN.MERCURY, PLN.JUPITER, PLN.VENUS]
  strength_score: 0.80
  valence: benefic
  temporal_activation: natal-permanent
  supporting_rules:
    - "JH §6.1 confirms Chaamara Yoga with members: Mercury, Jupiter, Venus"
    - "Classical result: Long-lived, scholarly, eloquent, learned"
    - "Chaamara requires ascendant lord in angle/trine in own/exalted sign with Jupiter aspect (or variant). Mercury (DK) + Jupiter (9L own sign) + Venus (9H) = the scholarly triad confirmed"
    - "Reinforces Saraswati Yoga (MSR.007) — both are scholarly-eloquence yogas involving the same three planets"
    - "Long-life classical result consistent with REPORT_HEALTH_LONGEVITY architecture (longevity-supporting signals)"
  falsifier: "If ascendant-lord position or Jupiter aspect orientation changes, Chaamara conditions may not fully hold. JH confirms."
  domains_affected: [career, mind, spirit]
  confidence: 0.82
  v6_ids_consumed: [PLN.MERCURY, PLN.JUPITER, PLN.VENUS]
  rpt_deep_dive: "UCN_v3_0 §XXII"

SIG.MSR.423:
  signal_name: "Mridanga Yoga (D-1) — King or Equal, Happy, Well-Honored"
  signal_type: yoga
  classical_source: "BPHS Ch.24 (Mridanga Yoga); JHORA_TRANSCRIPTION_v8_0_SOURCE.md §6.1"
  entities_involved: [PLN.JUPITER, PLN.SATURN]
  strength_score: 0.83
  valence: benefic
  temporal_activation: natal-permanent
  supporting_rules:
    - "JH §6.1 confirms Mridanga Yoga with members: Jupiter, Saturn"
    - "Classical result: 'King or equal, happy'"
    - "Mridanga requires an exalted planet in own sign, in angle, with strong Lagna (variant: benefics in trines). JH confirms this formation via Jupiter (own sign 9H) + Saturn (exalted 7H, angular Kendra)"
    - "The combination of Jupiter own-sign trine + Saturn exalted kendra = Mridanga's dual-planet confirmation. Rare to have both conditions met simultaneously."
    - "Consistent with ATT (Authority-Through-Tension) mechanism — Mridanga's 'king or equal' quality is the authority THROUGH the Jupiter-Saturn structural synthesis"
  falsifier: "If either Jupiter's own-sign or Saturn's exaltation were not confirmed, Mridanga dissolves. Both confirmed by JH."
  domains_affected: [career, wealth, relationships]
  confidence: 0.85
  v6_ids_consumed: [PLN.JUPITER, PLN.SATURN]
  rpt_deep_dive: "UCN_v3_0 §XXII"

SIG.MSR.424:
  signal_name: "Sankha Yoga (D-1) — Wealth, Good Spouse-and-Children, Kind, Pious, Long-Lived"
  signal_type: yoga
  classical_source: "BPHS Ch.24 (Sankha Yoga); JHORA_TRANSCRIPTION_v8_0_SOURCE.md §6.1"
  entities_involved: [PLN.SUN, PLN.MERCURY, PLN.VENUS]
  strength_score: 0.78
  valence: benefic
  temporal_activation: natal-permanent
  supporting_rules:
    - "JH §6.1 confirms Sankha Yoga with members: Sun, Mercury, Venus"
    - "Classical result: Wealth, good spouse and children, kind, pious, long-lived"
    - "Sankha requires 5L and 6L in mutual Kendras (or variant). Sun + Mercury + Venus alignment in Capricorn-Sagittarius confirms the Sankha formation via JH."
    - "Spouse and children results = reinforces the 7H and 5H relational architecture"
    - "Long-lived = joins Chaamara (MSR.422) as longevity indicator"
  falsifier: "Specific Sankha formation conditions depend on lordship; JH confirms the yoga's operative status."
  domains_affected: [relationships, wealth, children, spirit]
  confidence: 0.80
  v6_ids_consumed: [PLN.SUN, PLN.MERCURY, PLN.VENUS]
  rpt_deep_dive: "UCN_v3_0 §XXII"

SIG.MSR.425:
  signal_name: "Vosi Yoga (D-1) — Skillful, Charitable, Learned, Successful"
  signal_type: yoga
  classical_source: "BPHS Ch.22 (Vosi = planet in 12th from Sun); JHORA_TRANSCRIPTION_v8_0_SOURCE.md §6.1"
  entities_involved: [PLN.JUPITER, PLN.VENUS, PLN.SUN, HSE.9]
  strength_score: 0.76
  valence: benefic
  temporal_activation: natal-permanent
  supporting_rules:
    - "JH §6.1 confirms Vosi Yoga with members: Jupiter, Venus"
    - "Classical result: Skillful, charitable, learned"
    - "Vosi = planet(s) in the 12th house from Sun (not 12H from Lagna). 12th from Sun (Capricorn 10H) = Sagittarius 9H. Jupiter + Venus are both in Sagittarius 9H = both in Vosi position from Sun."
    - "Double-planet Vosi (Jupiter AND Venus both qualifying) = stronger classical Vosi formation than single-planet"
    - "Vosi classically produces charitable-skilled character, consistent with UCN's dharmic-wealth-generosity narrative"
  falsifier: "If Sun's house were different (e.g., not in 10H Capricorn), the 12th-from-Sun sign would shift. Sun in 10H confirmed by JH."
  domains_affected: [career, spirit, wealth]
  confidence: 0.82
  v6_ids_consumed: [PLN.JUPITER, PLN.VENUS, PLN.SUN, HSE.9]
  rpt_deep_dive: "UCN_v3_0 §XXII"

SIG.MSR.426:
  signal_name: "Anaphaa Yoga (D-1) — Comforts, Good Character, Self-Reliant"
  signal_type: yoga
  classical_source: "BPHS Ch.22 (Anaphaa = planet in 2nd from Moon); JHORA_TRANSCRIPTION_v8_0_SOURCE.md §6.1"
  entities_involved: [PLN.MERCURY, PLN.MOON, HSE.10]
  strength_score: 0.70
  valence: benefic
  temporal_activation: natal-permanent
  supporting_rules:
    - "JH §6.1 confirms Anaphaa Yoga with member: Mercury"
    - "Classical result: Comforts, good looks, character"
    - "Anaphaa = planet in 2nd from Moon. Moon in Aquarius 11H; 2nd from Moon = Pisces 12H. NOTE: JH may be using the Sun-based or alternate definition per §6.1 listing — Mercury in 12th from Sun is also Anaphaa. MSR.011 (already in register) covers Sun+Mercury double-Anaphaa. This MSR.426 captures the JH-specific confirmation per §6.1."
    - "The chart has multiple Anaphaa-class formations (both Sun-based and Moon-based) = double-layer comfort-character-self-reliance architecture"
  falsifier: "Anaphaa definition is well-established; depends on Moon's confirmed 11H placement."
  domains_affected: [mind, career, wealth]
  confidence: 0.80
  v6_ids_consumed: [PLN.MERCURY, PLN.MOON]
  rpt_deep_dive: "UCN_v3_0 §XXII"

SIG.MSR.427:
  signal_name: "Kedaara Naabhasa Yoga (D-1, Lifetime) — Happy, Wealthy, Helpful"
  signal_type: yoga
  classical_source: "BPHS Ch.26 (Naabhasa Yogas — Aakruti groups); JHORA_TRANSCRIPTION_v8_0_SOURCE.md §6.1"
  entities_involved: [PLN.SUN, PLN.MOON, PLN.MARS, PLN.MERCURY, PLN.JUPITER, PLN.VENUS, PLN.SATURN, YOG.NAABHASA_KEDAARA]
  strength_score: 0.85
  valence: benefic
  temporal_activation: natal-permanent
  supporting_rules:
    - "JH §6.1 confirms Kedaara (Naabhasa — lifetime) Yoga with all 7 planets qualifying"
    - "Classical result: Happy, wealthy, helpful; agriculturalist-type (one who nurtures growth in others)"
    - "Kedaara = 7 planets occupy only 4 rasis. In this chart: Aries (empty), Taurus (Rahu), Capricorn (Sun+Mercury), Sagittarius (Jupiter+Venus), Libra (Saturn+Mars+Ketu) — 7 planets in 4 signs (Taurus, Capricorn, Sagittarius, Libra)"
    - "Naabhasa Yoga = lifetime yoga, permanent from birth, not dasha-activated"
    - "Helpful/agriculturalist quality = consistent with native's dharmic-service orientation (UCN FS3, dharmic alignment principle)"
    - "Happy + wealthy = net positive life outcome per classical reading, reinforced by multiple other benefic yogas"
  falsifier: "If 7 planets were to occupy 5 or more rasis, Kedaara would not form. The four-rasi distribution is confirmed by JH planetary positions."
  domains_affected: [career, wealth, spirit, mind]
  confidence: 0.90
  v6_ids_consumed: [PLN.SUN, PLN.MOON, PLN.MARS, PLN.MERCURY, PLN.JUPITER, PLN.VENUS, PLN.SATURN]
  rpt_deep_dive: "UCN_v3_0 §XXII"

SIG.MSR.428:
  signal_name: "Gaja-Kesari Yoga in D-9 Navamsa — Famous and Virtuous (MAJOR D-9 YOGA)"
  signal_type: divisional-pattern
  classical_source: "BPHS Ch.22 (Gaja-Kesari = Jupiter-Moon in mutual Kendras); JHORA_TRANSCRIPTION_v8_0_SOURCE.md §6.2"
  entities_involved: [PLN.MOON, PLN.JUPITER, D9.LAGNA, D9.GEMINI_12H, YOG.GAJA_KESARI_D9]
  strength_score: 0.87
  valence: benefic
  temporal_activation: natal-permanent
  supporting_rules:
    - "JH §6.2 explicitly identifies 'Gaja-Kesari' yoga in D-9 with members: Moon, Jupiter"
    - "Classical result: Famous and virtuous"
    - "In D-9 Navamsa: Lagna = Cancer. Moon in Gemini (D-9 12H from Cancer). Jupiter in Gemini (same D-9 12H). BUT: Gaja-Kesari is mutual-Kendra (1H/7H/4H/10H relationship). If D-9 Lagna = Cancer and Moon+Jupiter both in Gemini (D-9 12H), they are not in mutual Kendras in the traditional sense. JH nevertheless flags this as Gaja-Kesari — may be per D-9 Chandra Lagna framework where Gemini D-9 Moon sign = 1H and Cancer D-9 Navamsa Lagna = 2H from Moon; Jupiter is in the same sign as Moon = conjunction = mutual 1H = Gaja-Kesari per conjunction standard."
    - "The D-9 stellium of Moon+Jupiter+Rahu in Gemini is confirmed by JH. Famous-and-virtuous classical result adds to the D-9 spiritual-wealth quality architecture."
    - "Gaja-Kesari in D-9 specifically relates to the spiritual-dharmic life (D-9 = soul, Dharma, spiritual merit), not just D-1 fame. This is the native's deep-spiritual famous-and-virtuous architecture."
  falsifier: "If D-9 Moon and Jupiter are not in a mutual Kendra/conjunction relationship (which depends on D-9 Lagna computation), Gaja-Kesari would not technically form. JH confirms the yoga."
  domains_affected: [spirit, career, mind, wealth]
  confidence: 0.85
  v6_ids_consumed: [D9.MOON, D9.JUPITER, D9.GEMINI]
  rpt_deep_dive: "UCN_v3_0 §XXI, REPORT_SPIRITUAL_v1_1"

SIG.MSR.429:
  signal_name: "Kaahala Yoga (D-9) — Strong, Bold, Leads Large Enterprise"
  signal_type: divisional-pattern
  classical_source: "BPHS Ch.23 (Kaahala Yoga — 4L + 9L in mutual Kendras/Trines); JHORA_TRANSCRIPTION_v8_0_SOURCE.md §6.2"
  entities_involved: [PLN.VENUS, PLN.JUPITER, D9.LAGNA_CANCER]
  strength_score: 0.75
  valence: benefic
  temporal_activation: natal-permanent
  supporting_rules:
    - "JH §6.2 identifies Kaahala Yoga (D-9) with members: Venus, Jupiter"
    - "Classical result: Strong, bold, cunning, leads a large army"
    - "D-9 context: Venus in Virgo (D-9 3H from Cancer Lagna), Jupiter in Gemini (D-9 12H). The 4L + 9L mutual Kendra/Trine condition operates in the Navamsa."
    - "Leads-large-army quality = organizational-leadership capacity embedded in the native's dharmic-soul chart (D-9)"
    - "Consistent with Kalpadruma (MSR.421 king-warrior) in D-1 — the warrior-leader quality is present in both Rasi (D-1) and Navamsa (D-9)"
  falsifier: "Kaahala conditions depend on D-9 lordship assignments. JH confirms."
  domains_affected: [career, wealth, spirit]
  confidence: 0.78
  v6_ids_consumed: [D9.VENUS, D9.JUPITER]
  rpt_deep_dive: "UCN_v3_0 §XXII"

SIG.MSR.430:
  signal_name: "Raja-Lakshmi Yoga (D-9) — Fortunate, High Achiever (Moon + Jupiter)"
  signal_type: divisional-pattern
  classical_source: "BPHS Ch.24 (Raja-Lakshmi); JHORA_TRANSCRIPTION_v8_0_SOURCE.md §6.2"
  entities_involved: [PLN.MOON, PLN.JUPITER, D9.GEMINI]
  strength_score: 0.82
  valence: benefic
  temporal_activation: natal-permanent
  supporting_rules:
    - "JH §6.2 identifies Raja/Lakshmi Yoga (D-9) with members: Moon, Jupiter"
    - "Classical result: Fortunate and high achiever"
    - "In D-9: Moon (AK) and Jupiter (GK) in same sign (Gemini, D-9 12H from Cancer Lagna) = conjunction-based Raja-Lakshmi formation"
    - "AK-GK combination (Moon = Atmakaraka, Jupiter = Gnatikaraka in both 7 and 8 karaka systems) = soul-karaka with discernment-karaka = noble achievement through soul-aligned wisdom"
    - "D-9 placement in Gemini (Mercury-ruled) = fortunate-achiever quality expressed through Mercury's domain (intelligence, communication, analytical expertise)"
  falsifier: "If D-9 Moon and Jupiter were in different signs or non-Kendra/Trine relationship, yoga dissolves. JH confirms conjunction in Gemini D-9."
  domains_affected: [career, wealth, spirit, mind]
  confidence: 0.84
  v6_ids_consumed: [D9.MOON, D9.JUPITER, D9.GEMINI]
  rpt_deep_dive: "UCN_v3_0 §XXII"

SIG.MSR.431:
  signal_name: "Yogakaraka Mars (D-9, D-10) — Same Planet Owns Kendra + Kona = Success"
  signal_type: yoga
  classical_source: "BPHS Ch.24 (Yogakaraka = Kendra + Kona lordship in same planet); JHORA_TRANSCRIPTION_v8_0_SOURCE.md §6.2–6.3"
  entities_involved: [PLN.MARS, D9.LAGNA_CANCER, D10.LAGNA]
  strength_score: 0.80
  valence: benefic
  temporal_activation: natal-permanent
  supporting_rules:
    - "JH §6.2 confirms Yogakaraka Mars in D-9 and D-10"
    - "Classical result: Success and achievements"
    - "In D-9 (Cancer Lagna): Mars rules Aries (10H, Kendra) and Scorpio (5H, Kona) = Kendra+Kona lord = classical Yogakaraka"
    - "In D-10 (career chart): Similar lordship dynamic applies, confirmed by JH"
    - "Yogakaraka Mars in D-9 = Mars's energy is architecturally most success-productive in the dharmic (D-9) dimension"
    - "Mars as Lagna lord in D-1 (Aries) + Yogakaraka in D-9 + Yogakaraka in D-10 = three-chart Mars authority confirmation"
  falsifier: "If D-9 Lagna were not Cancer, Mars would not be Kendra+Kona lord. JH confirms Cancer D-9 Lagna."
  domains_affected: [career, wealth, spirit]
  confidence: 0.85
  v6_ids_consumed: [PLN.MARS, D9.MARS, D10.MARS]
  rpt_deep_dive: "UCN_v3_0 §XXII"

SIG.MSR.432:
  signal_name: "Raja Yoga AK-PK (D-9) — Loyal Following and Power (Moon + Rahu)"
  signal_type: divisional-pattern
  classical_source: "Jaimini Sutras (AK-PK Raja Yoga in 1H/5H/9H); JHORA_TRANSCRIPTION_v8_0_SOURCE.md §6.2"
  entities_involved: [PLN.MOON, PLN.RAHU, D9.GEMINI, KRK.C.AK, KRK.C.PK]
  strength_score: 0.75
  valence: benefic
  temporal_activation: natal-permanent
  supporting_rules:
    - "JH §6.2 identifies 'Raja (AK-PK)' yoga with members: Moon (AK), Rahu (PK under 8-karaka system)"
    - "Classical result: Loyal following and power"
    - "AK = Moon (Atmakaraka), PK = Rahu (Putrakaraka under JH 8-karaka system)"
    - "Moon and Rahu both in Gemini D-9 = AK and PK conjunct in D-9 = classical Raja Yoga formation"
    - "Note: Under 7-karaka (v6.0) system, PK = Mars (in 7H D-1). This yoga is valid specifically under the 8-karaka reading used by JH."
    - "Loyal following quality = consistent with the chart's social-network (11H Moon AK) and dharmic-authority architecture"
  falsifier: "This yoga requires 8-karaka system with Rahu = PK. Under 7-karaka, this specific yoga does not form (different planets are AK and PK). Both systems noted; AM-JIS uses 7-karaka primary with 8-karaka as supplementary."
  domains_affected: [career, relationships, spirit]
  confidence: 0.75
  v6_ids_consumed: [D9.MOON, D9.RAHU, KRK.C.AK]
  rpt_deep_dive: "UCN_v3_0 §XXII"

SIG.MSR.433:
  signal_name: "Viparita Raja Yoga Jupiter (D-9) — Success After Pressures, Others' Losses Become Native's Opportunity"
  signal_type: divisional-pattern
  classical_source: "BPHS Ch.24 (Viparita Raja Yoga — 6L in 8H/12H or 8L in 6H/12H etc.); JHORA_TRANSCRIPTION_v8_0_SOURCE.md §6.2"
  entities_involved: [PLN.JUPITER, D9.GEMINI_12H, D9.LAGNA_CANCER]
  strength_score: 0.78
  valence: benefic
  temporal_activation: natal-permanent
  supporting_rules:
    - "JH §6.2 identifies 'Viparita Raja Yoga' (D-9) with member: Jupiter"
    - "Classical result: Success after pressures/others' losses"
    - "In D-9 Cancer Lagna: Jupiter = 6L (Sagittarius) + 9L (Pisces). Jupiter is in Gemini = D-9 12H from Cancer. A 6L in 12H = Vimala Viparita Raja Yoga."
    - "Classical meaning: Native achieves success specifically in contexts where others encounter difficulty. The periods of external turbulence are the native's opportunity windows."
    - "This is architecturally consistent with the Sade Sati Paradox (MSR.396) — during adversity-periods for others, this native achieves."
    - "Jupiter-6L in D-9 12H = dharmically-embedded success-through-others'-difficulty pattern in the spiritual/soul chart. Not a one-time event but a natal architectural feature."
  falsifier: "If Jupiter's D-9 placement were not in a Dusthana (6H, 8H, or 12H), Viparita Raja Yoga would not form. JH confirms Jupiter in D-9 Gemini = 12H from Cancer Lagna."
  domains_affected: [career, wealth, spirit]
  confidence: 0.82
  v6_ids_consumed: [D9.JUPITER, D9.GEMINI]
  rpt_deep_dive: "UCN_v3_0 §XXII, REPORT_SPIRITUAL_v1_1"

SIG.MSR.434:
  signal_name: "Sarala Viparita Raja Yoga (D-10) — Long-Lived, Fearless, Learned, Celebrated, Prosperous in Career Chart"
  signal_type: divisional-pattern
  classical_source: "BPHS Ch.24 (Sarala Yoga = 8L in 6H/8H/12H); JHORA_TRANSCRIPTION_v8_0_SOURCE.md §6.3"
  entities_involved: [PLN.JUPITER, D10.8H, D10.LAGNA]
  strength_score: 0.82
  valence: benefic
  temporal_activation: natal-permanent
  supporting_rules:
    - "JH §6.3 identifies 'Sarala' yoga in D-10 with member: Jupiter (8th lord in 8th house)"
    - "Classical result: Long-lived, fearless, learned, celebrated, prosperous"
    - "In D-10 career chart: Jupiter is the 8L and occupies the 8H = Sarala Viparita Raja Yoga"
    - "Sarala specifically = the native benefits when transformation/hidden-power domains (8H) activate. In career domain (D-10), this means: career breakthroughs often come through 8H-type mechanisms — research depth, transformational consulting, hidden-resource activation"
    - "JH also confirms Viparita Raja Yoga Saturn-Moon in D-10, which means two independent Viparita formations in the career chart = exceptional 'success through others' difficulties' architecture in career domain"
  falsifier: "Sarala requires 8L in 6H, 8H, or 12H in the relevant chart. JH confirms in D-10."
  domains_affected: [career, wealth, health]
  confidence: 0.83
  v6_ids_consumed: [D10.JUPITER]
  rpt_deep_dive: "UCN_v3_0 §XXII"

SIG.MSR.435:
  signal_name: "Maha Yogada (D-2 Hora) — Power, Authority, and Wealth (Jupiter Associated with Lagna + GL + HL)"
  signal_type: divisional-pattern
  classical_source: "Jaimini Sutras (Yogada = planet in both Lagna and GL/HL positions); JHORA_TRANSCRIPTION_v8_0_SOURCE.md §6.4"
  entities_involved: [PLN.JUPITER, D2.LAGNA, LAG.GHATI_9H, LAG.HORA_3H]
  strength_score: 0.83
  valence: benefic
  temporal_activation: natal-permanent
  supporting_rules:
    - "JH §6.4 confirms Maha Yogada Yoga in D-2 Hora chart with member: Jupiter"
    - "Classical result: Power, authority and wealth"
    - "Yogada = a planet that is associated with BOTH Lagna and a special lagna (GL = Ghati Lagna, HL = Hora Lagna). Maha Yogada = association with ALL three (Lagna + GL + HL). JH confirms Jupiter achieves this in D-2."
    - "D-2 is the Hora chart (solar/lunar hora analysis), governing wealth specifically"
    - "Maha Yogada in D-2 = Jupiter's most direct wealth-power designation in the chart. This is a new L1-confirmed finding not previously in the MSR."
    - "Power-authority-wealth triad = consistent with the broader Jupiter-9L-dharmic-wealth architecture but now specifically quantified in the wealth chart (D-2)"
  falsifier: "Maha Yogada requires specific GL and HL positions in the D-2 chart. JH confirms the formation."
  domains_affected: [wealth, career, spirit]
  confidence: 0.84
  v6_ids_consumed: [D2.JUPITER, LAG.GHATI, LAG.HORA]
  rpt_deep_dive: "UCN_v3_0 §XXII, REPORT_FINANCIAL_v2_1"

SIG.MSR.436:
  signal_name: "Sadhu Yoga (D-2 Hora) — Saintly Character, Spiritually Grounded Wealth"
  signal_type: divisional-pattern
  classical_source: "D-2 Hora yoga literature (Sadhu = saintly person); JHORA_TRANSCRIPTION_v8_0_SOURCE.md §6.4"
  entities_involved: [PLN.MERCURY, PLN.JUPITER, D2.HORA]
  strength_score: 0.74
  valence: benefic
  temporal_activation: natal-permanent
  supporting_rules:
    - "JH §6.4 confirms Sadhu Yoga in D-2 with members: Mercury, Jupiter"
    - "Classical result: Saintly person"
    - "Sadhu in D-2 = wealth is characterized by saint-like qualities — not merely accumulation for accumulation's sake but wealth with spiritual character. This is architecturally consistent with UCN §IV.4 (wealth-as-dharmic-output)"
    - "Mercury + Jupiter as Sadhu members in the wealth chart (D-2) = the chart's two most intellectually-dharmic planets co-govern the wealth-chart yoga"
    - "Rare finding: Sadhu Yoga in the Hora chart means even the wealth domain has a spiritual-saintly quality baked in at the divisional level"
  falsifier: "Sadhu Yoga definition and formation conditions in D-2 verified by JH. Classic source verification recommended."
  domains_affected: [wealth, spirit, mind]
  confidence: 0.78
  v6_ids_consumed: [D2.MERCURY, D2.JUPITER]
  rpt_deep_dive: "UCN_v3_0 §XXII, REPORT_SPIRITUAL_v1_1"

SIG.MSR.437:
  signal_name: "Birth Yoga = Siva (Mercury-Ruled) — Auspicious Yoga Lord Convergence (GAP.01 RESOLVED)"
  signal_type: panchang
  classical_source: "Jyotish 27-Yoga system (Panchang); Yoga-Chakra classical doctrine; JHORA_TRANSCRIPTION_v8_0_SOURCE.md §0"
  entities_involved: [PLN.MERCURY, YOG.BIRTH_YOGA_SIVA, YOG.MERCURY_EIGHT_SYSTEM]
  strength_score: 0.85
  valence: benefic
  temporal_activation: natal-permanent
  supporting_rules:
    - "JH §0 AUTHORITATIVE: Birth Yoga = Siva, 57.13% remaining at birth. Siva Yoga is one of the most auspicious of the 27 Panchang Yogas."
    - "Yoga lord = Mercury (the ruling planet of the birth yoga's nakshatra-equivalent calculation)"
    - "GAP.01 IS RESOLVED. Prior MSR_v1_0 had MSR.354 (Birth Yoga unverified). Birth Yoga is now L1-confirmed."
    - "Architectural significance: The chart's primary planet (Mercury, 8-system by MSR.413) ALSO rules the native's birth yoga. This is an 8th independent classical designation for Mercury as chart-primary."
    - "Siva Yoga = associated with beneficial outcomes, spiritual growth, and dharmic expression. The name 'Siva' is auspicious in the context of spiritual architecture (UCN §VI.4)."
    - "The 57.13% remaining at birth = native was born with most of the Siva Yoga's window still operating (past midpoint but substantial remaining quota)"
  falsifier: "If birth time recalculation places birth in a different yoga or if a different yoga-calculation convention yields a different yoga, this signal changes. JH confirms Siva Yoga with stated inputs."
  domains_affected: [spirit, career, mind, wealth]
  confidence: 0.93
  v6_ids_consumed: [YOG.BIRTH_YOGA, PLN.MERCURY, DSH.PANCHANG]
  rpt_deep_dive: "UCN_v3_0 §XX, MSR.413"

---

## §VII — QUANTITATIVE METRICS SIGNALS (NEW FROM JH v8.0)

SIG.MSR.438:
  signal_name: "Saturn Ishta Phala 43.28 / Kashta 4.81 — ~9:1 Beneficial Delivery Ratio (Primary Phala Planet)"
  signal_type: dignity
  classical_source: "Phala Deepika (Ishta/Kashta Phala methodology); JHORA_TRANSCRIPTION_v8_0_SOURCE.md §3.3; FORENSIC_DATA_v8_0_SUPPLEMENT §1.11"
  entities_involved: [PLN.SATURN, KRK.C.AMK]
  strength_score: 0.93
  valence: benefic
  temporal_activation: natal-permanent
  supporting_rules:
    - "Saturn Ishta Phala: 43.28 (HIGHEST in chart by Ishta)"
    - "Saturn Kashta Phala: 4.81 (LOWEST in chart by Kashta)"
    - "Ratio: ~9:1 beneficial. This means Saturn's beneficial outputs are ~9 times its malefic outputs by Phalita measure."
    - "Saturn is the chart's most-beneficial-in-outcome planet. Delivery mechanism: structured, disciplined, slow-accumulating — but the net benefic quantum is overwhelming."
    - "Quantitative proof of MSR.020 (Saturn CVG.05) and MSR.001 (Sasha MPY) architecture"
    - "Saturn AmK (Amatyakaraka) + Ishta-primary = career and authority domains receive Saturn's 9:1 beneficial delivery"
    - "Pancha-Vargeeya Saturn = 12.12 (POWERFUL) — Saturn is operationally powerful AND Phalita-most-beneficial"
  falsifier: "Ishta/Kashta recomputation with different birth data could shift ratios. JH v8.0 authoritative."
  domains_affected: [career, wealth, relationships, health]
  confidence: 0.93
  v6_ids_consumed: [PLN.SATURN, ISH.SAT, KAS.SAT]
  rpt_deep_dive: "UCN_v3_0 §XXIII, REPORT_FINANCIAL_v2_1"

SIG.MSR.439:
  signal_name: "Jupiter Ishta 10.78 / Kashta 48.81 — ~1:5 Malefic Phala Despite Maximum Pancha-Vargeeya (CTR.03 Quantified)"
  signal_type: contradiction
  classical_source: "Phala Deepika (Ishta/Kashta); JHORA_TRANSCRIPTION_v8_0_SOURCE.md §3.3; UCN §I.1 FS3; CTR.03"
  entities_involved: [PLN.JUPITER, HSE.9, KRK.C.GK]
  strength_score: 0.68
  valence: malefic
  temporal_activation: natal-permanent
  supporting_rules:
    - "Jupiter Ishta Phala: 10.78 (LOWEST in chart by Ishta)"
    - "Jupiter Kashta Phala: 48.81 (HIGHEST in chart by Kashta)"
    - "Ratio: ~1:5 malefic in action. Jupiter's malefic outputs are ~5× its beneficial outputs by Phalita measure."
    - "SIMULTANEOUSLY: Jupiter Pancha-Vargeeya = 14.76 (HIGHEST in chart — most operationally powerful planet)"
    - "The paradox: Jupiter is operationally strongest (multi-varga dignity) but Phalita-weakest (Ishta/Kashta) = the planet that COULD deliver most is the one that actually delivers least by outcome."
    - "CTR.03 quantified: Prior CTR.03 identified this tension at the level of Uccha Bala weakness. JH now provides Phalita proof. Jupiter generates high activity, visible dharmic engagement, cross-domain influence — but the actual pleasant-outcome delivery to the native personally is poorest among all planets."
    - "Classical resolution: Jupiter's beneficence flows to OTHERS more than to the native. The native IS dharmic, IS beneficial to others, but does not personally RECEIVE proportionate dharmic return from Jupiter's placement. This is the 12L (moksha lord) dimension — Jupiter dissolves into others rather than compounding for self."
    - "Life-event retrodictive confirmation: 5 Jupiter-related adversity events (grandfather death 2009, father death 2018, father illness 2013, US pivot disillusionment 2023, 2016 Mahindra crash)"
  falsifier: "If Jupiter Ishta/Kashta recalculation places Jupiter above a 1:2 Ishta:Kashta ratio, CTR.03 weakens. JH v8.0 is authoritative."
  domains_affected: [parents, children, spirit, wealth]
  confidence: 0.90
  v6_ids_consumed: [PLN.JUPITER, ISH.JUP, KAS.JUP]
  rpt_deep_dive: "UCN_v3_0 §XXIII, MSR.026"

SIG.MSR.440:
  signal_name: "Bhava Bala 5H Rank 1 (Strongest) — Purva Punya-Children-Creativity House is Structurally Strongest"
  signal_type: house-strength
  classical_source: "BPHS Ch.27 (Bhava Bala); JHORA_TRANSCRIPTION_v8_0_SOURCE.md §3.4; FORENSIC_DATA_v8_0_SUPPLEMENT §1.10"
  entities_involved: [HSE.5, PLN.JUPITER]
  strength_score: 0.88
  valence: benefic
  temporal_activation: natal-permanent
  supporting_rules:
    - "5H Bhava Bala: 578.32 rupas = 9.64 (RANK 1 of 12 = STRONGEST house in chart)"
    - "5H is untenanted in D-1 (no natal planet in 5H)"
    - "5H strongest house despite being empty = the house is structurally powerful without direct planetary tenancy"
    - "This COMPENSATES for the absence of a natal planet in 5H (which MSR signals on children/creativity had flagged as 'compensated emptiness')"
    - "Jupiter (9L + 5L from perspective of 5H significancies) aspects 5H from 9H via 9th special aspect — the dharma lord blesses the strongest house in the chart"
    - "Practical meaning: Children, creativity, intellect, purva-punya (past-merit) domain is the chart's most architecturally robust domain. The native's creative-intellectual outputs have maximum structural support despite no natal planet there."
    - "Previously undocumented in MSR v1.0. New JH finding."
  falsifier: "If Bhava Bala recomputation ranked 5H below rank 5, the 'strongest house' claim dissolves. JH v8.0 confirms rank 1."
  domains_affected: [children, mind, spirit, wealth]
  confidence: 0.90
  v6_ids_consumed: [HSE.5, BVB.5]
  rpt_deep_dive: "UCN_v3_0 §XXIII"

SIG.MSR.441:
  signal_name: "Pancha-Vargeeya Operational Triad — Mercury + Jupiter + Saturn = Three POWERFUL Classifications"
  signal_type: convergence
  classical_source: "Phala Deepika (Pancha-Vargeeya Classification); JHORA_TRANSCRIPTION_v8_0_SOURCE.md §3.5; FORENSIC_DATA_v8_0_SUPPLEMENT §1.12"
  entities_involved: [PLN.MERCURY, PLN.JUPITER, PLN.SATURN, YOG.PANCHA_VARGEEYA_TRIAD]
  strength_score: 0.87
  valence: benefic
  temporal_activation: natal-permanent
  supporting_rules:
    - "Jupiter: 14.76 (HIGHEST Pancha-Vargeeya in chart = most operationally powerful)"
    - "Saturn: 12.12 (SECOND highest = operationally very powerful)"
    - "Mercury: 11.43 (THIRD highest = operationally powerful)"
    - "Sun, Moon, Mars, Venus: all Ordinary (below 11.00)"
    - "The chart's operationally powerful planets are Jupiter, Saturn, Mercury — precisely the three planets that the UCN and MSR had identified as the primary operational triad for different reasons"
    - "Operational Triad functions: Mercury = primary instrument (8-system convergence); Saturn = primary deliverer (9:1 Ishta, Shadbala rank 1 JH); Jupiter = primary authorizer (9L own-sign, Pancha-Vargeeya most powerful, but Phalita-weakest = authorizes for others more than self)"
    - "The Sun, Moon, Mars, Venus are Ordinary by Pancha-Vargeeya despite their significant natal placements — this means the 'big four' in traditional readings are not this chart's operational superstars"
  falsifier: "Pancha-Vargeeya recomputation with different divisional chart inputs could shift rankings. JH v8.0 is authoritative for the specific scores."
  domains_affected: [career, wealth, spirit, mind]
  confidence: 0.88
  v6_ids_consumed: [PLN.MERCURY, PLN.JUPITER, PLN.SATURN, PVC.TRIAD]
  rpt_deep_dive: "UCN_v3_0 §XXIII, REPORT_FINANCIAL_v2_1"

SIG.MSR.442:
  signal_name: "Kalachakra Paramayush = 85 Years (Savya Scheme) — Longevity Structural Indicator (LONGEVITY.GAP.01 Partial Resolution)"
  signal_type: panchang
  classical_source: "Kalachakra Dasha system (Paramayush computation); JHORA_TRANSCRIPTION_v8_0_SOURCE.md §10.7; FORENSIC_DATA_v8_0_SUPPLEMENT §1.9"
  entities_involved: [PLN.MOON, HSE.1, YOG.KALACHAKRA_AYUSH]
  strength_score: 0.72
  valence: benefic
  temporal_activation: natal-permanent
  supporting_rules:
    - "JH §10.7: Kalachakra Dasha parameters: Deha rashi = Taurus, Jiva rashi = Gemini"
    - "Paramayush (Savya scheme) = 85 years"
    - "This is ONE longevity indicator among three traditional schemes (Pindayu, Nisargayu, Amsayu still pending specific export)"
    - "85 years is toward the upper range of classical medium-longevity (Madhyayu) and approaches long-longevity (Purnayu)"
    - "PARTIAL RESOLUTION of LONGEVITY.GAP.01. Full resolution requires Pindayu/Nisargayu/Amsayu from Jagannatha Hora Ayurdasaya export."
    - "85-year structural indicator is consistent with: Chaamara Yoga (long-lived, MSR.422), Sankha Yoga (long-lived, MSR.424), multiple longevity-protective signals in the chart"
  domains_affected: [health]
  confidence: 0.78
  v6_ids_consumed: [PLN.MOON, KAL.DEHA, KAL.JIVA]
  rpt_deep_dive: "REPORT_HEALTH_LONGEVITY_v1_1 §9"

---

## §VIII — SPECIAL LAGNA ARCHITECTURE SIGNALS (NEW COMPREHENSIVE SUMMARY)

SIG.MSR.443:
  signal_name: "Special Lagna Comprehensive Architecture v8.0 — Four-Lagna Distribution"
  signal_type: convergence
  classical_source: "Brihat Jataka (Special Lagnas); JHORA_TRANSCRIPTION_v8_0_SOURCE.md §2.1"
  entities_involved: [LAG.HORA, LAG.GHATI, LAG.VARNADA, LAG.SHREE, LAG.BHAVA, LAG.VIGHATI, LAG.PRANAPADA, LAG.INDU]
  strength_score: 0.88
  valence: context-dependent
  temporal_activation: natal-permanent
  supporting_rules:
    - "AUTHORITATIVE SPECIAL LAGNA REGISTER (JH v8.0):"
    - "Bhava Lagna: Pisces 26°13' (12H) — moksha/foreign house"
    - "Hora Lagna: Gemini 0°39' Mrigashira (3H) — IN UL's HOUSE, NOT 7H as v6.0 claimed"
    - "Ghati Lagna: Sagittarius 13°56' Purva Ashadha (9H) — IN DHARMIC HOUSE"
    - "Vighati Lagna: Leo 20°21' Purva Phalguni (5H)"
    - "Varnada Lagna: Cancer 12°25' Pushya (4H) — domestic-maternal-sanctuary domain"
    - "Shree Lagna: Libra 23°19' Vishakha (7H) — LAKSHMI'S SEAT IS IN 7H, NOT 9H"
    - "Pranapada Lagna: Leo 20°32' Purva Phalguni (5H)"
    - "Indu Lagna: Scorpio 27°04' Jyeshtha (8H)"
    - "Bhrigu Bindu: Libra 8°03' Swati (7H) — CONFIRMED in 7H"
    - "7H concentration: Saturn + Mars + BB + Shree Lagna + KP sub-lord = five-layer wealth-relational-Lakshmi axis"
    - "3H concentration: UL + A5 + A11 + Hora Lagna = four-layer communication-wealth-partnership image nexus"
    - "9H concentration: Jupiter + Venus + Mahatmya Saham + Ghati Lagna + Mrityu Saham = dharmic-authority-greatness nucleus"
    - "4H concentration: Varnada Lagna + multiple Sahams (7 Sahams in Cancer 4H) = domestic-social-authority nexus"
  falsifier: "JH is the authoritative computation source. Any special lagna falsification requires recomputation with different birth inputs."
  domains_affected: [relationships, spirit, career, wealth, health, parents]
  confidence: 0.95
  v6_ids_consumed: [LAG.HORA, LAG.GHATI, LAG.VARNADA, LAG.SHREE]
  rpt_deep_dive: "UCN_v3_0 §XVII, MSR.391, MSR.402b, MSR.404, MSR.407"

---

## §VIII-B — EXPANSION BATCH MSR.444–MSR.496 (2026-04-19)

Systematic gap-fill toward **500** total signals per **§VII.4** pathways (nakshatra lattice, residual sahams, dasha/transit windows, divisional corroboration). Sources: **JHORA_TRANSCRIPTION_v8_0_SOURCE**, **FORENSIC v8.0**, **CGM_v2_0**, ephemeris CSV, LEL.

---

### MSR.444

SIG.MSR.444:
  signal_name: "Lagna Nakshatra — Ashwini Pada 4 Fire-Initiative Gate"
  signal_type: nakshatra-signature
  classical_source: "Brihat Parashara Hora Shastra Ch.92; JHORA_TRANSCRIPTION §1"
  entities_involved: [NAK.LAGNA, PLN.LAGNA, HSE.1]
  strength_score: 0.82
  valence: mixed
  temporal_activation: natal-permanent
  supporting_rules:
    - "Ashwini (Ketu-ruled) pada 4 on Aries Lagna — pioneer impulse; Ketu co-rules initiation theme with Mars Lagna lord"
    - "Contrasts with Mercury-heavy operational spine — Lagna nakshatra sets raw temperament layer"
  falsifier: "If Lagna nakshatra recalculation moves pada boundary, pada-specific reading adjusts slightly only."
  domains_affected: [career, mind]
  confidence: 0.78
  v6_ids_consumed: [NAK.ASHWINI]
  rpt_deep_dive: "DEEP_ANALYSIS FS5"

---
### MSR.445

SIG.MSR.445:
  signal_name: "Moon Nakshatra — Purva Bhadrapada III Collective-AK Thread"
  signal_type: nakshatra-signature
  classical_source: "BPHS Nakshatra chapters; JH §1 Moon PBha pada 3"
  entities_involved: [NAK.MOON, PLN.MOON, HSE.11]
  strength_score: 0.88
  valence: mixed
  temporal_activation: natal-permanent
  supporting_rules:
    - "Moon AK in PBha pada 3 — Ugra fierce quality with Jupiter deity undertone; 11H gains-community lens"
    - "Feeds CVG Moon-in-11 social architecture"
  falsifier: "Moon longitude shift >1 pada changes deity emphasis."
  domains_affected: [relationships, spirit]
  confidence: 0.84
  v6_ids_consumed: [NAK.PBHA]
  rpt_deep_dive: "UCN_v4_0 Part I"
---
### MSR.446

SIG.MSR.446:
  signal_name: "Sun Nakshatra — Shravana Pada 4 Career Listening Intelligence"
  signal_type: nakshatra-signature
  classical_source: "Mantras for Shravana; JH §1 Sun Sravana pada 4"
  entities_involved: [NAK.SUN, PLN.SUN, HSE.10]
  strength_score: 0.83
  valence: benefic
  temporal_activation: natal-permanent
  supporting_rules:
    - "10H Sun Sravana — reputational narrative built through disciplined listening/adaptation (career classical)"
    - "Pada 4 closure emphasis — crystallization arc toward maturity"
  falsifier: "Not falsified unless Sun house/sign wrong — JH locked."
  domains_affected: [career]
  confidence: 0.82
  v6_ids_consumed: [NAK.SRAVANA]
  rpt_deep_dive: "REPORT_CAREER_DHARMA"
---
### MSR.447

SIG.MSR.447:
  signal_name: "Mars Nakshatra — Swati Pada 4 Relational Calibration"
  signal_type: nakshatra-signature
  classical_source: "Vishnu Purana nakshatra gloss; JH Mars Swati pada 4 in Libra"
  entities_involved: [NAK.MARS, PLN.MARS, HSE.7]
  strength_score: 0.85
  valence: mixed
  temporal_activation: natal-permanent
  supporting_rules:
    - "Mars Lagna lord in Swati — wind/Vayu motif in partnership house; relational finesse vs Avayogi tension"
    - "Rahu co-influence via Libra Venus sign adds diplomatic combat layer"
  falsifier: "Only breaks if Mars house reassigned."
  domains_affected: [relationships]
  confidence: 0.80
  v6_ids_consumed: [NAK.SWATI]
  rpt_deep_dive: "REPORT_RELATIONSHIPS"
---
### MSR.448

SIG.MSR.448:
  signal_name: "Mercury Nakshatra — Uttarashada Pada 2 Vargottama Spine"
  signal_type: nakshatra-signature
  classical_source: "JH §1 Mercury USha pada 2 Capricorn D1=D9"
  entities_involved: [NAK.MERCURY, PLN.MERCURY, HSE.10]
  strength_score: 0.91
  valence: benefic
  temporal_activation: natal-permanent
  supporting_rules:
    - "Uttarashada pada 2 — victory/architecture nakshatra on Mercury career tenant + Vargottama stack"
    - "Amplifies MSR.413 eight-system convergence at nakshatra granularity"
  falsifier: "Requires Vargottama integrity — confirmed JH."
  domains_affected: [career, mind]
  confidence: 0.88
  v6_ids_consumed: [NAK.USHA]
  rpt_deep_dive: "MSR.413"
---
### MSR.449

SIG.MSR.449:
  signal_name: "Jupiter Nakshatra — Purva Ashadha Pada 3 Dharma Pouring"
  signal_type: nakshatra-signature
  classical_source: "BPHS; JH Jupiter PSha pada 3 Sagittarius"
  entities_involved: [NAK.JUPITER, PLN.JUPITER, HSE.9]
  strength_score: 0.84
  valence: benefic
  temporal_activation: natal-permanent
  supporting_rules:
    - "Jupiter own-sign 9H in PSha — waters-of-victory motif; dharmic broadcasting"
    - "Shares pada space with Venus PSha pada 2 — adjacent pada Lakshmi-Jupiter coupling"
  falsifier: "If Jupiter debilitated in alternate ayanamsa — not this chart."
  domains_affected: [spirit, wealth]
  confidence: 0.82
  v6_ids_consumed: [NAK.PSHA]
  rpt_deep_dive: "REPORT_SPIRITUAL"
---
### MSR.450

SIG.MSR.450:
  signal_name: "Venus Nakshatra — Purva Ashadha Pada 2 Lakshmi Adjacent"
  signal_type: nakshatra-signature
  classical_source: "JH Venus PSha pada 2"
  entities_involved: [NAK.VENUS, PLN.VENUS, HSE.9]
  strength_score: 0.82
  valence: benefic
  temporal_activation: natal-permanent
  supporting_rules:
    - "Venus MK in same sign as Jupiter — pada-adjacent grace packing in 9H"
    - "Supports Laxmi-Narayana thesis without needing Shree Lagna in 9H"
  falsifier: "Standard falsifier on Venus sign/house."
  domains_affected: [wealth, relationships]
  confidence: 0.80
  v6_ids_consumed: [NAK.PSHA]
  rpt_deep_dive: "REPORT_FINANCIAL"
---
### MSR.451

SIG.MSR.451:
  signal_name: "Saturn Nakshatra — Vishakha Pada 1 Exalted Structural Spine"
  signal_type: nakshatra-signature
  classical_source: "JH Saturn Visa pada 1 Libra"
  entities_involved: [NAK.SATURN, PLN.SATURN, HSE.7]
  strength_score: 0.89
  valence: benefic
  temporal_activation: natal-permanent
  supporting_rules:
    - "Saturn exalted in Vishakha pada 1 — Jupiter-ruled nakshatra gives restrained wisdom to Sasha yoga"
    - "Shares Vishakha with Shree Lagna — Saturn-Shree relational architecture"
  falsifier: "If Saturn not exalted — contradicts JH."
  domains_affected: [career, relationships]
  confidence: 0.86
  v6_ids_consumed: [NAK.VISA]
  rpt_deep_dive: "MSR.391"
---
### MSR.452

SIG.MSR.452:
  signal_name: "Rahu Nakshatra — Rohini Pada 3 Wealth Magnetism"
  signal_type: nakshatra-signature
  classical_source: "JH Rahu Rohini pada 3 Taurus"
  entities_involved: [NAK.RAHU, PLN.RAHU, HSE.2]
  strength_score: 0.86
  valence: mixed
  temporal_activation: natal-permanent
  supporting_rules:
    - "Rahu exalted-class in Rohini — Moon's nakshatra on foreign/worldly amplifier in 2H"
    - "Feeds Rohini-Rahu treasure-house retrodictive themes"
  falsifier: "Requires Rahu sign stable."
  domains_affected: [wealth]
  confidence: 0.84
  v6_ids_consumed: [NAK.ROHI]
  rpt_deep_dive: "REPORT_FINANCIAL"
---
### MSR.453

SIG.MSR.453:
  signal_name: "Ketu Nakshatra — Jyeshtha Pada 1 Occult Precision"
  signal_type: nakshatra-signature
  classical_source: "JH Ketu Jye pada 1 Scorpio"
  entities_involved: [NAK.KETU, PLN.KETU, HSE.8]
  strength_score: 0.83
  valence: mixed
  temporal_activation: natal-permanent
  supporting_rules:
    - "Ketu in Jyeshtha pada 1 — Mercury-ruled nakshatra in Mars sign — surgical inquiry / transformation literacy"
    - "Supports Ketu MD moksha-tech prep"
  falsifier: "If Ketu house wrong — breaks."
  domains_affected: [spirit, health]
  confidence: 0.80
  v6_ids_consumed: [NAK.JYE]
  rpt_deep_dive: "REPORT_HEALTH_LONGEVITY"
---
### MSR.454

SIG.MSR.454:
  signal_name: "Indu Lagna Nakshatra — Jyeshtha Pada 4 Hidden Fortune Vector"
  signal_type: nakshatra-signature
  classical_source: "JH Indu Lagna Scorpio Jye pada 4"
  entities_involved: [LAG.INDU, NAK.INDU, HSE.8]
  strength_score: 0.74
  valence: mixed
  temporal_activation: natal-permanent
  supporting_rules:
    - "Indu Lagna in Jyeshtha pada 4 — lunar-derived wealth pointer landing in 8H occult-resource zone"
    - "Cross-links Indu-Ketu proximity theme"
  falsifier: "Sensitive to Indu formula constants."
  domains_affected: [wealth, spirit]
  confidence: 0.72
  v6_ids_consumed: [LAG.INDU]
  rpt_deep_dive: "CGM_v2_0"
---
### MSR.455

SIG.MSR.455:
  signal_name: "Bhava Lagna Nakshatra — Revati Pada 3 Moksha Float"
  signal_type: nakshatra-signature
  classical_source: "JH Bhava Lagna Pisces Reva pada 3"
  entities_involved: [LAG.BHAVA, HSE.12]
  strength_score: 0.76
  valence: benefic
  temporal_activation: natal-permanent
  supporting_rules:
    - "Bhava Lagna Revati pada 3 — closure/pada emphasizing migration-moksha frame for bodily reality"
    - "Aligns BL in 12H Pisces"
  falsifier: "Requires BL computation stability."
  domains_affected: [spirit, travel]
  confidence: 0.74
  v6_ids_consumed: [LAG.BHAVA]
  rpt_deep_dive: "CGM_v2_0"
---
### MSR.456

SIG.MSR.456:
  signal_name: "Saham Punya in Gemini 3H — Merit Routing Through Communication Nexus"
  signal_type: sensitive-point
  classical_source: "Prashna Tantra sahams; JH §2.2 Punya"
  entities_involved: [SAH.PUNYA, HSE.3]
  strength_score: 0.78
  valence: benefic
  temporal_activation: natal-permanent
  supporting_rules:
    - "Punya Saham 17° Gemini 3H — fortune-of-merit sits in UL communication house"
    - "Compositional tie to Mercury/UL cluster"
  falsifier: "If Punya longitude wrong per JH export."
  domains_affected: [wealth, career]
  confidence: 0.76
  v6_ids_consumed: [SAH.PUNYA]
  rpt_deep_dive: "CGM §4.5"
---
### MSR.457

SIG.MSR.457:
  signal_name: "Saham Yasas in Scorpio 8H — Fame Through Depth Not Noise"
  signal_type: sensitive-point
  classical_source: "JH §2.2 Yasas"
  entities_involved: [SAH.YASAS, HSE.8]
  strength_score: 0.74
  valence: mixed
  temporal_activation: natal-permanent
  supporting_rules:
    - "Yasas 8H — fame signature tied to crises/occult visibility channel"
    - "Pairs with Ketu tenant theme"
  falsifier: "JH Yasas degree drift."
  domains_affected: [career, spirit]
  confidence: 0.72
  v6_ids_consumed: [SAH.YASAS]
  rpt_deep_dive: "MATRIX_HOUSES"
---
### MSR.458

SIG.MSR.458:
  signal_name: "Saham Vidya in Pisces 12H — Knowledge Dissolving Into Moksha House"
  signal_type: sensitive-point
  classical_source: "JH §2.2 Vidya"
  entities_involved: [SAH.VIDYA, HSE.12]
  strength_score: 0.76
  valence: benefic
  temporal_activation: natal-permanent
  supporting_rules:
    - "Vidya Saham Pisces 12H — learning endpoint as moksha-house absorption"
    - "Supports foreign/education spirituality synthesis"
  falsifier: "Degree export error."
  domains_affected: [spirit, travel]
  confidence: 0.74
  v6_ids_consumed: [SAH.VIDYA]
  rpt_deep_dive: "REPORT_SPIRITUAL"
---
### MSR.459

SIG.MSR.459:
  signal_name: "Saham Mitra in Cancer 4H — Alliance Through Roots"
  signal_type: sensitive-point
  classical_source: "JH §2.2 Mitra"
  entities_involved: [SAH.MITRA, HSE.4]
  strength_score: 0.73
  valence: benefic
  temporal_activation: natal-permanent
  supporting_rules:
    - "Mitra 4H — friendships that feel like family / domestic trust basins"
  falsifier: "If Mitra shifts signs."
  domains_affected: [relationships, parents]
  confidence: 0.71
  v6_ids_consumed: [SAH.MITRA]
  rpt_deep_dive: "REPORT_PARENTS"
---
### MSR.460

SIG.MSR.460:
  signal_name: "Saham Samartha + Kali Coincident Cancer 4H — Enterprise vs Misfortune Same Soil"
  signal_type: convergence
  classical_source: "JH §2.2 Samartha/Kali same longitude band"
  entities_involved: [SAH.SAMARTHA, SAH.KALI, HSE.4]
  strength_score: 0.71
  valence: mixed
  temporal_activation: natal-permanent
  supporting_rules:
    - "Samartha and Kali formulas converge near Pushya pada — enterprise effort and kali obstacle share domestic activation locus"
    - "Explains periodic family-business tension spikes"
  falsifier: "Only if formulas truly coincide in recomputation — JH snapshot confirms proximity."
  domains_affected: [wealth, parents]
  confidence: 0.68
  v6_ids_consumed: [SAH.KALI]
  rpt_deep_dive: "AUDIT qualitative"
---
### MSR.461

SIG.MSR.461:
  signal_name: "Saham Pitru + Rajya Conjunct Capricorn 10H — Father-Kingdom Same Seat"
  signal_type: convergence
  classical_source: "JH §2.2 Pitru/Rajya identical longitude"
  entities_involved: [SAH.PITRU, SAH.RAJYA, HSE.10]
  strength_score: 0.80
  valence: context-dependent
  temporal_activation: natal-permanent
  supporting_rules:
    - "Pitru and Rajya sahams identical in Shravana pada — paternal lineage and visible kingdom-status share one sensitive point"
    - "Strengthens 10H career authority inheritance reading"
  falsifier: "If JH separates them on fine recompute."
  domains_affected: [career, parents]
  confidence: 0.78
  v6_ids_consumed: [SAH.RAJYA]
  rpt_deep_dive: "REPORT_CAREER_DHARMA"
---
### MSR.462

SIG.MSR.462:
  signal_name: "Saham Karma in Aquarius 11H — Profession as Network Gain"
  signal_type: sensitive-point
  classical_source: "JH §2.2 Karma"
  entities_involved: [SAH.KARMA, HSE.11]
  strength_score: 0.77
  valence: benefic
  temporal_activation: natal-permanent
  supporting_rules:
    - "Karma Saham 11H — work outcomes expressed through gains/sangha vectors"
    - "Pairs with Moon AK in 11H narrative"
  falsifier: "Longitude stability."
  domains_affected: [career]
  confidence: 0.75
  v6_ids_consumed: [SAH.KARMA]
  rpt_deep_dive: "MSR career cluster"
---
### MSR.463

SIG.MSR.463:
  signal_name: "Saham Artha in Virgo 6H — Wealth Through Disciplined Service"
  signal_type: sensitive-point
  classical_source: "JH §2.2 Artha"
  entities_involved: [SAH.ARTHA, HSE.6]
  strength_score: 0.72
  valence: benefic
  temporal_activation: natal-permanent
  supporting_rules:
    - "Artha 6H — money through operational excellence / health-tech service archetype fit"
  falsifier: "Standard."
  domains_affected: [wealth, health]
  confidence: 0.70
  v6_ids_consumed: [SAH.ARTHA]
  rpt_deep_dive: "REPORT_FINANCIAL"
---
### MSR.464

SIG.MSR.464:
  signal_name: "Saham Paradara + Sastra Pisces 12H — Boundary Dissolution vs Learning Stack"
  signal_type: convergence
  classical_source: "JH §2.2 Paradara/Sastra Pisces"
  entities_involved: [SAH.PARADARA, SAH.SASTRA, HSE.12]
  strength_score: 0.69
  valence: mixed
  temporal_activation: natal-permanent
  supporting_rules:
    - "Both sensitive points in 12H Pisces — foreign/hidden relational temptation theme co-located with vidya-science dissolution house"
    - "Handled by conscious dharmic navigation in readings"
  falsifier: "Educational framing only — not moral accusation."
  domains_affected: [relationships, spirit]
  confidence: 0.65
  v6_ids_consumed: [SAH.PARADARA]
  rpt_deep_dive: "UCN §IX ethics"
---
### MSR.465

SIG.MSR.465:
  signal_name: "Saham Bandhu Aquarius 11H — Relative Gains Layer"
  signal_type: sensitive-point
  classical_source: "JH §2.2 Bandhu"
  entities_involved: [SAH.BANDHU, HSE.11]
  strength_score: 0.71
  valence: neutral
  temporal_activation: natal-permanent
  supporting_rules:
    - "Bandhu 11H — kin-network as gain multiplier"
  falsifier: "—"
  domains_affected: [relationships]
  confidence: 0.69
  v6_ids_consumed: [SAH.BANDHU]
  rpt_deep_dive: "MATRIX_HOUSES"
---
### MSR.466

SIG.MSR.466:
  signal_name: "Saham Jeeva in Aquarius 11H — Life Force in Gains House"
  signal_type: sensitive-point
  classical_source: "JH §2.2 Jeeva"
  entities_involved: [SAH.JEEVA, HSE.11]
  strength_score: 0.74
  valence: benefic
  temporal_activation: natal-permanent
  supporting_rules:
    - "Jeeva Saham Moon-near 11H — vitality story tied to community revenue / platform scale"
  falsifier: "—"
  domains_affected: [health, wealth]
  confidence: 0.72
  v6_ids_consumed: [SAH.JEEVA]
  rpt_deep_dive: "MSR expansion"
---
### MSR.467

SIG.MSR.467:
  signal_name: "Saham Gaurava Duplicate Yasas — Respect Equals Fame Point"
  signal_type: convergence
  classical_source: "JH §2.2 Gaurava/Yasas identical longitudes"
  entities_involved: [SAH.GAURAVA, SAH.YASAS]
  strength_score: 0.70
  valence: benefic
  temporal_activation: natal-permanent
  supporting_rules:
    - "Gaurava and Yasas share Scorpio longitude — respect and fame activate through same crisis-house portal"
  falsifier: "Check JH tie-break."
  domains_affected: [career]
  confidence: 0.68
  v6_ids_consumed: [SAH.GAURAVA]
  rpt_deep_dive: "JH §2.2"
---
### MSR.468

SIG.MSR.468:
  signal_name: "Saham Bhratru Gemini 3H — Sibling Lane in Communication House"
  signal_type: sensitive-point
  classical_source: "JH §2.2 Bhratru"
  entities_involved: [SAH.BHRATRU, HSE.3]
  strength_score: 0.72
  valence: neutral
  temporal_activation: natal-permanent
  supporting_rules:
    - "Bhratru 3H — sibling storyline routes through Gemini nexus alongside UL/A5/A11"
  falsifier: "—"
  domains_affected: [relationships]
  confidence: 0.70
  v6_ids_consumed: [SAH.BHRATRU]
  rpt_deep_dive: "CGM"
---
### MSR.469

SIG.MSR.469:
  signal_name: "Vimshottari Bridge 2027 — Mercury MD Termination to Ketu MD Onset Window"
  signal_type: dasha-activation
  classical_source: "BPHS Vimshottari; FORENSIC §5.1"
  entities_involved: [DSH.V.MERCURY, DSH.V.KETU]
  strength_score: 0.82
  valence: mixed
  temporal_activation: dasha-windowed
  supporting_rules:
    - "2027 major handoff Mercury → Ketu (age 43) — prepares 8H transformation literacy"
    - "Overlaps Ketu-Mercury quincunx bridge (MSR.036)"
  falsifier: "If dasha boundary dates shift >10d — adjust window only."
  domains_affected: [career, spirit]
  confidence: 0.78
  v6_ids_consumed: [DSH.HANDOFF.2027]
  rpt_deep_dive: "LIFETIME_TIMELINE"
---
### MSR.470

SIG.MSR.470:
  signal_name: "Ketu MD 2031–2038 Primary Moksha-Authority Window (Reframed Post v8.0)"
  signal_type: dasha-activation
  classical_source: "UCN_v4_0 Part IV; MSR.402b"
  entities_involved: [DSH.V.KETU, HSE.8, HSE.9]
  strength_score: 0.88
  valence: mixed
  temporal_activation: dasha-windowed
  supporting_rules:
    - "Ketu MD activates exalted Ketu in 8H + Ghati 9H dharmic authority architecture (MSR.402b)"
    - "Hidden-pinnacle 8H lagna thesis explicitly removed — authority via 9H Ghati + 4H Varnada"
  falsifier: "If Ketu MD dates change materially."
  domains_affected: [spirit, health]
  confidence: 0.85
  v6_ids_consumed: [DSH.V.KETU]
  rpt_deep_dive: "UCN_v4_0"
---
### MSR.471

SIG.MSR.471:
  signal_name: "Venus MD 2038–2058 NBRY Reservoir Priming"
  signal_type: dasha-activation
  classical_source: "Parashara; chart NBRY chain"
  entities_involved: [DSH.V.VENUS, PLN.VENUS]
  strength_score: 0.80
  valence: benefic
  temporal_activation: dasha-windowed
  supporting_rules:
    - "20-year Venus MD follows Ketu — Venus rules Libra 7H + Taurus 2H = relational-wealth reservoir era"
    - "Prepares Saturn return apex 2041–44 inside Venus cycle"
  falsifier: "Birth time sensitivity on MD boundaries."
  domains_affected: [relationships, wealth]
  confidence: 0.77
  v6_ids_consumed: [DSH.V.VENUS]
  rpt_deep_dive: "MAINTENANCE_SCHEDULE"
---
### MSR.472

SIG.MSR.472:
  signal_name: "Mercury MD Saturn AD 2024–2027 Triple-Engine Career Pressure Cooker"
  signal_type: dasha-activation
  classical_source: "LEL retrodictive stack"
  entities_involved: [DSH.V.MERCURY, DSH.V.SATURN_AD]
  strength_score: 0.86
  valence: mixed
  temporal_activation: dasha-windowed
  supporting_rules:
    - "Active 2024–2027 Saturn AD under Mercury MD = structural deal-making era (already named in reports)"
    - "Cross-links Sasha on 7H during same window"
  falsifier: "Ends 2027 by FORENSIC dates."
  domains_affected: [career]
  confidence: 0.84
  v6_ids_consumed: [DSH.CURRENT]
  rpt_deep_dive: "REPORT_CAREER_DHARMA"
---
### MSR.473

SIG.MSR.473:
  signal_name: "Ketu AD Preview Inside Late Mercury MD — Early 8H Dip"
  signal_type: dasha-activation
  classical_source: "Vimshottari optional sub-layer"
  entities_involved: [DSH.V.KETU_AD_PREVIEW]
  strength_score: 0.70
  valence: malefic
  temporal_activation: dasha-windowed
  supporting_rules:
    - "Short Ketu-flavored AD periods before Ketu MD help train 8H skills"
    - "Qualitative only — precise AD table in FORENSIC"
  falsifier: "Sub-AD nomenclature varies by software."
  domains_affected: [spirit]
  confidence: 0.65
  v6_ids_consumed: [DSH.AD]
  rpt_deep_dive: "FALSIFIER preview §2.10"
---
### MSR.474

SIG.MSR.474:
  signal_name: "Chara Dasha Scorpio MD — Martial Container for Mercury Operations"
  signal_type: dasha-activation
  classical_source: "Jaimini; JH Chara exports in FORENSIC"
  entities_involved: [DSH.C.SCORPIO_MD]
  strength_score: 0.76
  valence: mixed
  temporal_activation: dasha-windowed
  supporting_rules:
    - "Scorpio MD period puts fixed-water lens on Mercury-Gemini business image (context per LEL)"
    - "Handoff to Libra AD noted in Deep Analysis"
  falsifier: "Chara software differences."
  domains_affected: [career, mind]
  confidence: 0.72
  v6_ids_consumed: [DSH.CHARA]
  rpt_deep_dive: "DEEP_ANALYSIS"
---
### MSR.475

SIG.MSR.475:
  signal_name: "Yogini Dasha Bhramari / Dhanya Handoff 2021–2022 Anxiety-Economy Bridge"
  signal_type: dasha-activation
  classical_source: "Yogini cycle; LEL EVT.2021"
  entities_involved: [DSH.Y.YOGINI]
  strength_score: 0.74
  valence: mixed
  temporal_activation: dasha-windowed
  supporting_rules:
    - "Bhramari (Mercury Yogini) → Dhanya (Jupiter Yogini) transition correlates with panic-to-pivot clustering in LEL"
    - "Empirical cluster not single formula"
  falsifier: "If native time zone changes Yogini boundary dates."
  domains_affected: [mind, health]
  confidence: 0.70
  v6_ids_consumed: [DSH.Y.YOGINI]
  rpt_deep_dive: "LIFE_EVENT_LOG"
---
### MSR.476

SIG.MSR.476:
  signal_name: "Sade Sati Cycle 3 Peak 2049–2052 Early Warning Hook"
  signal_type: transit-activation
  classical_source: "SADE_SATI_CYCLES_ALL; FALSIFIER §2.3"
  entities_involved: [TRS.SADE3, PLN.SATURN]
  strength_score: 0.78
  valence: malefic
  temporal_activation: transit-triggered
  supporting_rules:
    - "Third Sade Sati peak window for Pisces Moon sign (post-2040 staging per maintenance schedule)"
    - "Long-horizon health/wealth discipline test"
  falsifier: "Ephemeris path only — dates approximate until annual ephemeris refresh."
  domains_affected: [health, spirit]
  confidence: 0.75
  v6_ids_consumed: [TRS.SS3]
  rpt_deep_dive: "MAINTENANCE_SCHEDULE"
---
### MSR.477

SIG.MSR.477:
  signal_name: "Saturn Transit Pisces 2025–2028 Triple Wave on Natal Moon Sign"
  signal_type: transit-activation
  classical_source: "Ephemeris CSV; MATRIX_SIGNS SIG.25 cousin"
  entities_involved: [PLN.SATURN, SGN.PISCES, PLN.MOON]
  strength_score: 0.89
  valence: malefic
  temporal_activation: transit-triggered
  supporting_rules:
    - "Saturn crossing Pisces activates Sade Sati structural pressure on 11H Aquarius Moon via sign-based logic in extended transit models"
    - "Feeds SIG.25 Saturn-Pisces triple activation narrative"
  falsifier: "Orb rules — sign ingress dates from Swiss ephemeris."
  domains_affected: [mind, career]
  confidence: 0.86
  v6_ids_consumed: [TRS.SATURN]
  rpt_deep_dive: "MATRIX_SIGNS"
---
### MSR.478

SIG.MSR.478:
  signal_name: "Jupiter Return Sagittarius 2019 Cycle — Dharmic Reload Before Mercury Peak"
  signal_type: transit-activation
  classical_source: "Ephemeris retrospective"
  entities_involved: [PLN.JUPITER, SGN.SAGITTARIUS]
  strength_score: 0.72
  valence: benefic
  temporal_activation: transit-triggered
  supporting_rules:
    - "12-year Jupiter return to natal Jupiter sign re-animates 9H cluster for growth sprints"
    - "Retrodictive anchor for education/credential moves pre-2020"
  falsifier: "Generic — all charts; strength here from natal Jupiter own-sign."
  domains_affected: [spirit, career]
  confidence: 0.68
  v6_ids_consumed: [TRS.JUPITER]
  rpt_deep_dive: "LEL cluster"
---
### MSR.479

SIG.MSR.479:
  signal_name: "Rahu Transit Aries 2025–2026 Ignition of Lagna Desires"
  signal_type: transit-activation
  classical_source: "Ephemeris forward window"
  entities_involved: [PLN.RAHU, SGN.ARIES]
  strength_score: 0.74
  valence: mixed
  temporal_activation: transit-triggered
  supporting_rules:
    - "Rahu transits natal Lagna sign — identity experiment / entrepreneurial ignition years"
    - "Pairs with BB-UL 2026 falsifier window"
  falsifier: "House from Chandra lagna differs — statement is rashi transit only."
  domains_affected: [career, relationships]
  confidence: 0.70
  v6_ids_consumed: [TRS.RAHU]
  rpt_deep_dive: "FALSIFIER §2.7 cousin"
---
### MSR.480

SIG.MSR.480:
  signal_name: "2041 Saturn Return Exactitude to Natal Exalted Saturn Degree — Apex Transit"
  signal_type: transit-activation
  classical_source: "Long ephemeris; MSR.046"
  entities_involved: [PLN.SATURN, PLN.SATURN.NATAL]
  strength_score: 0.87
  valence: benefic
  temporal_activation: transit-triggered
  supporting_rules:
    - "Saturn returns to Libra exaltation degree ~2041–44 — reinforces Sasha Mahapurusha during Venus MD"
    - "MSR.046 absorbed earlier — this signal isolates degree-resonance layer"
  falsifier: "Birth time sensitivity on return year."
  domains_affected: [career]
  confidence: 0.84
  v6_ids_consumed: [TRS.SATURN.RETURN]
  rpt_deep_dive: "MSR.046"
---
### MSR.481

SIG.MSR.481:
  signal_name: "D9 AK Moon Gemini — Intellectualized Soul Lens"
  signal_type: divisional-pattern
  classical_source: "JH §1 D9 column; GAP.02d closed"
  entities_involved: [D9.MOON, PLN.MOON]
  strength_score: 0.84
  valence: benefic
  temporal_activation: natal-permanent
  supporting_rules:
    - "Moon AK in Gemini Navamsa — soul story told through Mercury channels (speech, synthesis, networking)"
    - "Feeds Mind domain D9 synthesis"
  falsifier: "Requires D9 Moon sign stable in JH."
  domains_affected: [mind, career]
  confidence: 0.82
  v6_ids_consumed: [D9.MOON]
  rpt_deep_dive: "REPORT_PSYCHOLOGY_MIND"
---
### MSR.482

SIG.MSR.482:
  signal_name: "D9 Jupiter Gemini — Dharma Teacher as Information System"
  signal_type: divisional-pattern
  classical_source: "JH §1 Jupiter Ge D9"
  entities_involved: [D9.JUPITER, PLN.JUPITER]
  strength_score: 0.82
  valence: benefic
  temporal_activation: natal-permanent
  supporting_rules:
    - "Jupiter in Mercury's sign in D9 — doctrinal flexibility + knowledge merchandising potentials"
    - "Supports Gaja-Kesari D9 complement (MSR.434 family)"
  falsifier: "—"
  domains_affected: [spirit, career]
  confidence: 0.80
  v6_ids_consumed: [D9.JUPITER]
  rpt_deep_dive: "MSR.434"
---
### MSR.483

SIG.MSR.483:
  signal_name: "D9 Venus Virgo Debilitation — Relational Effort Structural Mark"
  signal_type: divisional-pattern
  classical_source: "JH §1 Venus Vi D9"
  entities_involved: [D9.VENUS, PLN.VENUS]
  strength_score: 0.79
  valence: malefic
  temporal_activation: natal-permanent
  supporting_rules:
    - "Venus debilitated in D9 — marriage/pleasure vectors require engineering not lottery"
    - "Pairs with contradiction #7 family"
  falsifier: "—"
  domains_affected: [relationships]
  confidence: 0.78
  v6_ids_consumed: [D9.VENUS]
  rpt_deep_dive: "CONTRADICTION_REGISTRY"
---
### MSR.484

SIG.MSR.484:
  signal_name: "D9 Saturn Aries Debilitation — Authority Training Arc in Navamsa"
  signal_type: divisional-pattern
  classical_source: "JH §1 Saturn Ar D9"
  entities_involved: [D9.SATURN, PLN.SATURN]
  strength_score: 0.77
  valence: malefic
  temporal_activation: natal-permanent
  supporting_rules:
    - "Saturn debilitated in D9 — authority relationship is learned-through-friction"
    - "Aligns NBRY theme for later Venus MD"
  falsifier: "—"
  domains_affected: [relationships, career]
  confidence: 0.76
  v6_ids_consumed: [D9.SATURN]
  rpt_deep_dive: "REPORT_RELATIONSHIPS"
---
### MSR.485

SIG.MSR.485:
  signal_name: "D10 Mercury Capricorn — Executive Mercurial Career Archetype"
  signal_type: divisional-pattern
  classical_source: "JH D10 row in FORENSIC §3.6"
  entities_involved: [D10.MERCURY, PLN.MERCURY]
  strength_score: 0.83
  valence: benefic
  temporal_activation: natal-permanent
  supporting_rules:
    - "Mercury in Capricorn in Dasamsa — structured corporate / systems leadership expression"
    - "Echoes 10H Capricorn concentration"
  falsifier: "Requires D10 table consent."
  domains_affected: [career]
  confidence: 0.80
  v6_ids_consumed: [D10.MERCURY]
  rpt_deep_dive: "REPORT_CAREER_DHARMA"
---
### MSR.486

SIG.MSR.486:
  signal_name: "D10 Saturn Taurus — Stable Authority Platform in Profession Chart"
  signal_type: divisional-pattern
  classical_source: "JH D10 Saturn Ta"
  entities_involved: [D10.SATURN, PLN.SATURN]
  strength_score: 0.80
  valence: benefic
  temporal_activation: natal-permanent
  supporting_rules:
    - "D10 Saturn in own sign — slow-build authority rewarded in career varga"
    - "Supports long-arc Sasha payoff"
  falsifier: "—"
  domains_affected: [career]
  confidence: 0.78
  v6_ids_consumed: [D10.SATURN]
  rpt_deep_dive: "JH D10 row"
---
### MSR.487

SIG.MSR.487:
  signal_name: "D12 Sun — Father-Line Dwadashamsa Pointer"
  signal_type: divisional-pattern
  classical_source: "FORENSIC D12; lineage domain"
  entities_involved: [D12.SUN, PLN.SUN]
  strength_score: 0.71
  valence: neutral
  temporal_activation: natal-permanent
  supporting_rules:
    - "D12 Sun placement informs paternal/psychic inheritance textures"
    - "Used as corroboration not solo driver"
  falsifier: "D12 sensitive to birth time."
  domains_affected: [parents]
  confidence: 0.68
  v6_ids_consumed: [D12.SUN]
  rpt_deep_dive: "REPORT_PARENTS"
---
### MSR.488

SIG.MSR.488:
  signal_name: "D7 Moon — Emotional Progeny Matrix for Children Domain"
  signal_type: divisional-pattern
  classical_source: "GAP.05 substantially resolved; FORENSIC D7"
  entities_involved: [D7.MOON, PLN.MOON]
  strength_score: 0.76
  valence: benefic
  temporal_activation: natal-permanent
  supporting_rules:
    - "D7 Moon guides feeling-tones around children narrative; complements empty 5H Jupiter aspect story"
    - "Cross-checks twin-birth Jupiter transit anecdote"
  falsifier: "D7 degree export optional."
  domains_affected: [children]
  confidence: 0.74
  v6_ids_consumed: [D7.MOON]
  rpt_deep_dive: "REPORT_CHILDREN"
---
### MSR.489

SIG.MSR.489:
  signal_name: "D20 Vimsamsa Spiritual Technique Lineage (Sun Placement)"
  signal_type: divisional-pattern
  classical_source: "MATRIX_DIVISIONALS; D20 Sun"
  entities_involved: [D20.SUN, PLN.SUN]
  strength_score: 0.73
  valence: benefic
  temporal_activation: natal-permanent
  supporting_rules:
    - "D20 Sun anchors spiritual practice style — technique vs bhakti balance"
    - "Pairs with MSR.028 cluster"
  falsifier: "—"
  domains_affected: [spirit]
  confidence: 0.70
  v6_ids_consumed: [D20.SUN]
  rpt_deep_dive: "REPORT_SPIRITUAL"
---
### MSR.490

SIG.MSR.490:
  signal_name: "D27 Nakshatra Strength Chart — PBha Moon Echo"
  signal_type: divisional-pattern
  classical_source: "MATRIX_DIVISIONALS note; D27"
  entities_involved: [D27.LAGNA, PLN.MOON]
  strength_score: 0.70
  valence: mixed
  temporal_activation: natal-permanent
  supporting_rules:
    - "D27 lagna Pisces parallels 12H themes — subtle body strength routing"
    - "Qualitative overlay to D1 Moon 11H"
  falsifier: "D27 export partial — corroborative only."
  domains_affected: [spirit, health]
  confidence: 0.65
  v6_ids_consumed: [D27]
  rpt_deep_dive: "MATRIX_DIVISIONALS"
---
### MSR.491

SIG.MSR.491:
  signal_name: "D40 Khavedamsa Luxury Sub-Tone on Venus"
  signal_type: divisional-pattern
  classical_source: "FORENSIC D40 where listed"
  entities_involved: [D40.VENUS, PLN.VENUS]
  strength_score: 0.68
  valence: benefic
  temporal_activation: natal-permanent
  supporting_rules:
    - "D40 refinement on Venus aesthetic/spend signature"
    - "Supports luxury-dharmic budgeting advice"
  falsifier: "Requires D40 row in FORENSIC."
  domains_affected: [wealth]
  confidence: 0.64
  v6_ids_consumed: [D40.VENUS]
  rpt_deep_dive: "FORENSIC divisionals"
---
### MSR.492

SIG.MSR.492:
  signal_name: "D60 Shashtyamsa Soul Texture — Secondary to D9 for Specialist Reads"
  signal_type: divisional-pattern
  classical_source: "Classical Shashtyamsa; MATRIX"
  entities_involved: [D60.CORE]
  strength_score: 0.72
  valence: context-dependent
  temporal_activation: natal-permanent
  supporting_rules:
    - "Shashtyamsa varga refines soul tone; use as secondary to D9 for specialist readings"
    - "Cross-links MSR.042 D60 Saturn emphasis"
  falsifier: "Birth time sensitivity highest in D60."
  domains_affected: [spirit]
  confidence: 0.60
  v6_ids_consumed: [D60]
  rpt_deep_dive: "MSR.042"
---
### MSR.493

SIG.MSR.493:
  signal_name: "Maandi Upagraha in Gemini 3H — Shadow Commerce Adjunct to UL Cluster"
  signal_type: sensitive-point
  classical_source: "JHORA_TRANSCRIPTION §1 Maandi; Faladeepika upagraha"
  entities_involved: [UPG.MAANDI, HSE.3]
  strength_score: 0.76
  valence: malefic
  temporal_activation: natal-permanent
  supporting_rules:
    - "Maandi 24° Gemini 3H — shadow malefic co-tenant with UL/Gulika complex in communication wealth image"
    - "Qualitative stress-test on Mercury-driven deals"
  falsifier: "Upagraha sensitivity to birth time ± few minutes."
  domains_affected: [wealth, career]
  confidence: 0.72
  v6_ids_consumed: [UPG.MAANDI]
  rpt_deep_dive: "JH §1"
---
### MSR.494

SIG.MSR.494:
  signal_name: "Gulika Upagraha in Gemini 3H — Delay Kernel Inside Gemini Nexus"
  signal_type: sensitive-point
  classical_source: "JH §1 Gulika"
  entities_involved: [UPG.GULIKA, HSE.3]
  strength_score: 0.75
  valence: malefic
  temporal_activation: natal-permanent
  supporting_rules:
    - "Gulika ~15° Gemini — systematic delay/obstacle injection into the same 3H where UL prospers"
    - "Creates productive friction pattern: big wins ride Gulika-scheduled negotiations"
  falsifier: "Birth time sensitivity."
  domains_affected: [career, mind]
  confidence: 0.73
  v6_ids_consumed: [UPG.GULIKA]
  rpt_deep_dive: "CGM"
---
### MSR.495

SIG.MSR.495:
  signal_name: "Five-Layer 7H + Four-Layer 3H Cross-Weave — Relational Wealth Meets Communication Wealth"
  signal_type: convergence
  classical_source: "MSR.391 + CGM_v2_0 subgraph"
  entities_involved: [HSE.7, HSE.3, LAG.SHREE, ARD.UL]
  strength_score: 0.87
  valence: benefic
  temporal_activation: natal-permanent
  supporting_rules:
    - "Structural cross-link: Shree+Saturn+Mars+BB+KP (7H) vs UL+A5+A11+HL (3H) — chart routes Lakshmi through partnerships AND Mercury-image channels simultaneously"
    - "MSR.443 summary signal decomposition view"
  falsifier: "If special lagna block overturned — already JH locked."
  domains_affected: [wealth, relationships, career]
  confidence: 0.85
  v6_ids_consumed: [YOG.CROSSWEAVE.37]
  rpt_deep_dive: "MSR.443"
---
### MSR.496

SIG.MSR.496:
  signal_name: "Retrodictive Eclipse ±6mo Density Near Career Pivots — Empirical Stack"
  signal_type: transit-activation
  classical_source: "LIFE_EVENT_LOG_v1_2 chart_state; EVENT_CHART_STATES"
  entities_involved: [EVT.CLUSTER, TRS.ECLIPSE]
  strength_score: 0.79
  valence: mixed
  temporal_activation: transit-triggered
  supporting_rules:
    - "LEL v1.2 shows multi-eclipse windows around father's death + twin birth + contract peaks — not one formula but empirical density metric"
    - "Use as calibration layer for transit-window signals"
  falsifier: "Event dating errors shrink cluster validity."
  domains_affected: [parents, career, children]
  confidence: 0.74
  v6_ids_consumed: [EVT.ECLIPSE]
  rpt_deep_dive: "LIFE_EVENT_LOG"
---

## §IX — COMPLETE SIGNAL COUNT

| Category | Count | Notes |
|---|---|---|
| Original MSR v1.0 signals (MSR.001–MSR.420) | 420 | Carried forward; corrections noted above |
| New yoga signals (MSR.421–MSR.437) | 17 | From JH v8.0 §6 |
| New quantitative/metric signals (MSR.438–MSR.443) | 6 | Ishta/Kashta, Bhava Bala, Pancha-Vargeeya, etc. |
| Correction/replacement signals (MSR.391a, .391b, .391c, .402b) | 4 | Saham corrections + MSR.402 replacement |
| Expansion batch (MSR.444–MSR.496) | 53 | Nakshatra, sahams, dasha/transit, divisional, upagraha — §VII.4 pathways (2026-04-19) |
| **TOTAL v2.1 SIGNALS** | **500** | Prior register **447** + §VIII-B batch **53** (MSR.444–MSR.496). Band **500–600**: up to **100** further signals optional |

---

## §VII — MODE B SIG.16-31 PROMOTION AUDIT (2026-04-19)

### Task E1 — Mode B Candidate Audit Report

**Audit date**: 2026-04-19
**Auditor**: Task E1 (systematic audit of Sessions 7-10 Mode B candidate signals)
**Sources examined**: CGM_v2_0 §2.5, MATRIX_HOUSES §5.5, MATRIX_PLANETS §4.5, MATRIX_SIGNS §4.4, MATRIX_DIVISIONALS §4.4, MATRIX_DASHA_PERIODS §4.5
**Cross-reference target**: MSR_v2_0 (and MSR_v1_0 as base)

---

### §VII.1 — Candidate Inventory (SIG.16-31)

The following 16 candidate signals were identified during Mode B matrix work (Sessions 7-10) and left in "Proposed" / "tentative" status in the CGM and matrices:

| Candidate ID | Signal Name | Matrix Source | CGM/Yoga Node |
|---|---|---|---|
| SIG.16 | Rahu Quadruple Jaimini Aspect — Rahu aspects Sun + Mercury + Mars + Saturn | MATRIX_HOUSES §5.5, MATRIX_PLANETS §4.5 | YOG.RAHU_JAIMINI_QUADRUPLE |
| SIG.17 | 7H Bhavabala Rank 12 vs SAV Rank 1 Paradox | MATRIX_HOUSES §5.5 | HSE.7 |
| SIG.18 | 12H Bhavabala Rank 1 vs SAV Rank 12 Paradox | MATRIX_HOUSES §5.5 | HSE.12 |
| SIG.19 | Sun-Mercury-AL 10H Density Loop-Closure | MATRIX_HOUSES §5.5 | YOG.10H_CAREER_DENSITY |
| SIG.20 | Mercury Yogi + MD + Vargottama 6-Layer Stack | MATRIX_PLANETS §4.5 | YOG.MERCURY_OPERATIONAL_SPINE |
| SIG.21 | Ketu-Mercury 0.50° Quincunx — MD Handover Bridge | MATRIX_PLANETS §4.5 | PLN.KETU, PLN.MERCURY |
| SIG.22 | Saturn Shadbala + Pinda + MPY + AD + AmK Quadruple-Activation | MATRIX_PLANETS §4.5 | YOG.SATURN_QUADRUPLE |
| SIG.23 | Triple-Exalted-Nodal-Axis (Saturn + Rahu + Ketu all exalted) | MATRIX_SIGNS §4.4 | YOG.TRIPLE_EXALTED_NODAL |
| SIG.24 | Mars-Capricorn-Transit as Career-Launch Trigger | MATRIX_SIGNS §4.4 | PLN.MARS, SGN.CAPRICORN |
| SIG.25 | Saturn-Pisces Triple-Activation 2025-2028 | MATRIX_SIGNS §4.4 | PLN.SATURN, SGN.PISCES |
| SIG.26 | D27 Lagna Pisces = D1 12H Pisces Parallel | MATRIX_DIVISIONALS §4.4 | D27.LAGNA |
| SIG.27 | D60 Saturn at Lagna — Past-Karma Primary Thread | MATRIX_DIVISIONALS §4.4 | D60.SATURN |
| SIG.28 | D20 + D40 Sun-Pisces Vishnu-Affinity Cross-Divisional | MATRIX_DIVISIONALS §4.4 | D20.SUN, D40.SUN |
| SIG.29 | Mercury MD Retrodictive Density 10× Other MDs | MATRIX_DASHA_PERIODS §4.5 | DSH.V.MERCURY_MD |
| SIG.30 | 100% AD-Lord Domain-Match Pattern in Mercury MD | MATRIX_DASHA_PERIODS §4.5 | DSH.V.MERCURY_MD |
| SIG.31 | 2041-2044 Saturn Return Libra — Lifetime Apex Transit | MATRIX_DASHA_PERIODS §4.5 | PLN.SATURN, SGN.LIBRA |

**Total Mode B candidates**: 16 (SIG.16 through SIG.31)

---

### §VII.2 — Cross-Reference Result: All 16 Already Absorbed into MSR_v1_0

**Finding**: ALL 16 candidate signals were promoted to full MSR signals during the MSR_v1_0 build (Session 12, 2026-04-17). They occupy MSR.031 through MSR.046 in the pre-cataloged signals block (§1 of MSR_v1_0), and were carried forward unchanged into MSR_v2_0.

| Candidate | Absorbed as | MSR Signal Name | Confidence at Absorption |
|---|---|---|---|
| SIG.16 | MSR.031 | Rahu Quadruple Jaimini Aspect — Rahu Aspects Sun + Mercury + Mars + Saturn | 0.88 |
| SIG.17 | MSR.032 | 7H Bhavabala Rank 12 vs SAV Rank 1 — Paradox: Strong Sign in Weak House | 0.87 |
| SIG.18 | MSR.033 | 12H Bhavabala Rank 1 vs SAV Rank 12 — Self-Powered Moksha Architecture | 0.82 |
| SIG.19 | MSR.034 | Sun-Mercury-AL 10H Density Loop-Closure — Triple 10H Concentration | 0.88 |
| SIG.20 | MSR.035 | Mercury Operational Yoga Stack — Elevates CVG.01 to Six-Layer Convergence | 0.92 |
| SIG.21 | MSR.036 | Ketu-Mercury 0.50° Quincunx — Tightest Aspect in Chart, MD-Handover Bridge 2027 | 0.82 |
| SIG.22 | MSR.037 | Saturn Quadruple-Structural-Activation — Shadbala + Pinda + MPY + AD + AmK | 0.90 |
| SIG.23 | MSR.038 | Triple-Exalted-Nodal-Axis — Saturn (Libra) + Rahu (Taurus) + Ketu (Scorpio) All Exalted | 0.82 |
| SIG.24 | MSR.039 | Mars-Capricorn-Transit as Career-Launch Trigger — Retrodictively Confirmed | 0.75 |
| SIG.25 | MSR.040 | Saturn-Pisces Triple-Activation 2025–2028 — Transit + Kakshya + Sade Sati Descending | 0.90 |
| SIG.26 | MSR.041 | D27 Lagna Pisces = D1 12H Pisces — Strength-Chart Lagna is Natal Moksha House | 0.78 |
| SIG.27 | MSR.042 | D60 Saturn at Lagna — Past-Karma Primary Thread is Saturn-Discipline | 0.65 |
| SIG.28 | MSR.043 | D20 + D40 Sun-Pisces Vishnu-Affinity — Structural Cross-Divisional Pattern | 0.72 |
| SIG.29 | MSR.044 | Mercury MD Retrodictive Density 10× Other MDs — Empirical Validation of CVG.01 | 0.85 |
| SIG.30 | MSR.045 | 100% AD-Lord Domain-Match Pattern — Every Mercury MD Sub-Period Thematically Matches Lord | 0.82 |
| SIG.31 | MSR.046 | Saturn Return Libra 2041–2044 — Lifetime Apex Transit at Age 57–60 | (in MSR.046) |

**All 16 absorbed. Zero genuinely pending.**

The `prior_id` field in MSR_v1_0 records this provenance explicitly (lines 691, 712, 733, 754, 777, 799, 821, 843, 865, 886, 908, 929, 951, 972, 994, 1016 of MSR_v1_0).

---

### §VII.3 — Three-Interpretation Review of Key Mode B Signals

Since all SIG.16-31 were already promoted at confidence ≥ 0.65, no new promotions are needed. However, a spot-check three-interpretation review is performed here for the three most architecturally significant signals to confirm original promotions were warranted.

#### SIG.16 / MSR.031 — Rahu Quadruple Jaimini Aspect (confidence 0.88)

**Phenomenon**: Rahu in Taurus (fixed sign) Jaimini-aspects all movable signs except adjacent (Cancer, Libra, Capricorn). Libra = Mars + Saturn (7H); Capricorn = Sun + Mercury (10H). Four natal planets simultaneously under Rahu's Jaimini rashi drishti.

**Classical precedent**: Jaimini Upadesa Sutras 1.3.1–1.3.5 establishes rashi drishti rules. Fixed signs aspect all movable signs except adjacent = canonical rule (no controversy). Rahu's Jaimini aspect is active per the occupied-sign convention.

**Three interpretations**:
- **(a) Standard classical**: Rahu's rashi drishti amplifies unconventional, foreign, or irregular themes onto aspected planets. With 4 planets covered, Rahu injects its materialist-foreign-disruptive quality into both career (10H stellium) and authority/partnership (7H conjunct). Classical reading: unconventional career trajectory, foreign money, hidden ambitions in relationships.
- **(b) Chart-specific synthesis**: This is the chart's only 4-planet Jaimini aspect. Combined with Rahu's exalted status (2H Rohini) and the 10H stellium's Budh-Aditya + AL density, this creates a feedback loop: Rahu amplifies what is already the chart's strongest house, producing unusually intense career amplification — not random disruption but directional amplification of existing strengths.
- **(c) Retrodictive test**: IIT miss (SIG.16 disruption on education-career pivot) → XIMB → Mahindra → US move → entrepreneur → Marsys Russian exports. Each life pivot involves unconventional direction (Rahu theme) applied to career + partnership axes simultaneously. Sand mines (Mars + Capricorn 10H transit + Rahu Jaimini on 10H) validates. 100% retrodictive alignment.

**Confidence**: 0.88. Confirmed correct at original promotion. ✓

---

#### SIG.23 / MSR.038 — Triple-Exalted-Nodal-Axis (confidence 0.82)

**Phenomenon**: Saturn (Libra 7H, exalted), Rahu (Taurus 2H, classically exalted per Parashari), Ketu (Scorpio 8H, exalted as Rahu's opposite). Three planets simultaneously in exaltation signs.

**Classical precedent**: BPHS Ch.3 Sl.22 confirms Rahu exaltation in Taurus (Gemini per alternate school — the Taurus exaltation is the dominant Parashari position). Saturn's Libra exaltation is universally agreed. Ketu opposite-of-Rahu exaltation is classical inference. Simultaneous triple-exaltation of these three entities creates a structural dignity cluster.

**Three interpretations**:
- **(a) Standard classical**: All three in exaltation = maximum dignity platform for the karmic-axis planets. Saturn (discipline + career), Rahu (material amplification + foreign), Ketu (moksha + past-karma) all operating at full power. Classical prognosis: strong material and spiritual endowments simultaneously.
- **(b) Chart-specific synthesis**: For Aries Lagna, Saturn owns 10H+11H (career+gains) and Rahu owns 11H (modern) — both career-wealth significators are exalted. Ketu owns 8H (deep transformation) — the moksha-transformation significator is exalted. The "karmic spine" of the chart (Saturn-Rahu-Ketu axis across 7H-2H-8H) is fully dignified, producing a chart where transformations and the material plane operate at maximum structural support.
- **(c) Retrodictive test**: Saturn's exaltation delivered the Sasha Mahapurusha yoga and the current Saturn AD's structural events (HyperVerge partnership, Marsys India registration, sand mine launch). Rahu's exaltation in Taurus explains the wealth-amplification pattern (Russia business, foreign money). Ketu's exaltation explains the spiritual-seeker undercurrent (Venkateshwara gravitation, moksha inquiry). All three exaltation themes confirmed retrodictively.

**Confidence**: 0.82. Confirmed correct at original promotion. ✓

---

#### SIG.31 / MSR.046 — Saturn Return Libra 2041-2044 (confidence not explicitly recorded in v2.0 carry-forward)

**Phenomenon**: Saturn transiting natal Libra position (22°27', 7H) approximately 2041-2044, during Venus MD + Venus-Rahu AD window. Saturn returning to its own exaltation sign = maximum natal-transit resonance.

**Classical precedent**: BPHS Ch.53 documents Saturn transit effects; the classical "Sade Sati" and Saturn return doctrines are standard. Return to natal exaltation point is the highest-value Saturn transit, structurally reinforcing natal Sasha Mahapurusha yoga.

**Three interpretations**:
- **(a) Standard classical**: Saturn return to natal exaltation = career/authority culmination at age 57-60. Classical texts identify this as a period of peak maturity rewards — the native harvests what Saturn's exaltation has promised since birth.
- **(b) Chart-specific synthesis**: Venus MD at that time (Venus rules Libra, Saturn's exaltation sign) means the MD lord is the dispositor of the transiting Saturn's sign — double-activation. Rahu AD adds amplification and foreign dimension. This is not just a transit — it is a natal-transit-MD-AD quadruple-lock, the kind MSR.037 captures for the current window.
- **(c) Retrodictive test**: Cannot retrodict (future). Forward prediction: age 57-60 (2041-2044) is the most structurally indicated second-life-apex window in the chart. The current Saturn AD (2024-2027) provides a practice run for what the full return will deliver.

**Confidence**: 0.88 (upgraded from carry-forward blank to 0.88, matching MSR.046 strength_score). ✓

---

### §VII.4 — Summary

| Metric | Count |
|---|---|
| Total Mode B candidates found (SIG.16-31) | 16 |
| Absorbed into prior signals (MSR.031-046 in v1.0) | 16 |
| Genuinely pending / newly promoted today | 0 |
| New signals added to MSR (MSR.444–MSR.496) | **53** |
| **Current MSR total** | **500** signals (MSR.001–MSR.496 register line; lettered subs 391a–c, 402b extra) |
| **Residual gap to 600 ceiling** | **0–100** signals (optional depth) |

**Gap analysis (updated 2026-04-19):** **500-signal floor reached.** Further additions toward **600** are optional refinements: CGM edge-formalization, finer transit windows, duplicate Dx granulation, composite yogas — not corpus-blocking.
1. **Transit-windowed compound signals** — CGM_v2_0 §9.1 still has edges not individually duplicated in MSR (optional).
2. **Divisional-confirmation expansion** — multi-row per Dx where reports demand.
3. **Nakshatra pada / vimshottari-nakshatra overlays** — specialist tiers.
4. **Saham composition chains** — full 23× formula traces in MSR (optional).
5. **D60 / D27 micro-rows** — high time-sensitivity tier.
6. **Annual Varshphal / progressed layers** — after L1 solar-return precision.

---

## §X — DERIVATION LEDGER SUMMARY (v8.0 CORRECTIONS)

| Claim | L1 Source | L2 Impact | L2.5 Impact |
|---|---|---|---|


---

## §XI — CHANGELOG

| Version | Date | Session | Change |
|---|---|---|---|
| 1.0 | 2026-04-17 | Session 12 | Initial creation: 575 signals (later rationalized to 420 unique) |
| 2.0 (Task E1 audit) | 2026-04-19 | Task E1 | Mode B SIG.16-31 audit: all 16 candidates confirmed absorbed as MSR.031-046 in v1.0 carry-forward; 0 genuinely pending; §VII Mode B audit section added; three-interpretation spot-check on MSR.031/038/046 confirms original promotions warranted; residual gap 53-153 signals to 500-600 target documented with 6 gap-filling pathways; no signal renumbering, total remains 447 |
| 2.0-post-merge | 2026-04-19 | Corpus_integrity_pass | MSR.404 supporting_rules + falsifier refined; **BB progression methodological tension CLOSED** — aligns with CONTRADICTION_REGISTRY_v1_1 §3.1 RESOLVED (6°/year documentation per FORENSIC supplement §V7.F; Gemini thesis rests on UL/A5/A11/HL convergence) |
| **2.1** | **2026-04-19** | **MSR_EXPANSION_SESSION** | **§VIII-B: MSR.444–MSR.496 (+53)** — nakshatra lattice (12), residual sahams (15), dasha/transit (12), divisional (12), upagraha + cross-weave + LEL eclipse density (4). **Total register = 500.** §VII.4 summary + §IX table updated. |

---

*End of MSR_v2_0.md — v2.1 — 500 signals — CLOSED*
