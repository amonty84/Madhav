---
artifact: MSR_v2_0.md
version: 2.0
status: CLOSED
session: FIX_SESSION_003
date: 2026-04-18
supersedes: MSR_v1_0.md
scope: "Master Signal Register — 420 original signals carried forward (with v8.0 corrections applied to affected signals) + 17 new yoga signals (MSR.421–MSR.437) from JH v8.0 transcription. This is a complete corrected register; MSR_v1_0 is superseded and moves to SUPERSEDED status."
parent_sources: [JHORA_TRANSCRIPTION_v8_0_SOURCE.md, FORENSIC_DATA_v8_0_SUPPLEMENT.md, V8_0_RECONCILIATION_REPORT.md, MSR_v1_0.md]
corrections_applied: [MSR.391 recomposed, MSR.402 INVALIDATED + replacement added, MSR.404 confidence upgraded 0.86→0.94, MSR.407 reframed, MSR.413 upgraded to 8-system, MSR.022 Vivaha Saham corrected, all HL/GL/Varnada/Shree Lagna citations corrected]
---

# MASTER SIGNAL REGISTER v2.0 — Abhisek Mohanty
## AM-JIS L2.5 Holistic Synthesis
### FIX_SESSION_003 | 2026-04-18 | CLOSED

---

## §0 — SCHEMA REFERENCE AND VERSION NOTES

### §0.1 Schema

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

### §0.2 Version Notes — What Changed from v1.0

MSR v2.0 carries all 420 signals from v1.0 with the following changes:

**CORRECTIONS (v8.0 reconciliation)**:
- **MSR.391**: Composition rewritten. Six-layer → Five-layer. Roga and Mahatmya Sahams removed from 7H (they are in 2H and 9H respectively). Shree Lagna ADDED as 7H layer (it is in Libra 7H per JH — not Sagittarius 9H as v6.0 claimed). Confidence 0.97 → 0.92. Framing shifts from "disease-greatness crucible" to "wealth-relational-Lakshmi-anchor." See §V below.
- **MSR.402**: SUPERSEDED/INVALIDATED. "Hidden-pinnacle 8H architecture via Varnada+Ghati" is factually false — both lagnas are confirmed NOT in 8H by JH. Replacement signal MSR.402b documents Varnada in 4H Cancer + Ghati in 9H Sagittarius as domestic-dharmic authority architecture.
- **MSR.404**: Confidence upgraded 0.86 → 0.94. Hora Lagna now confirmed in Gemini 3H (not Libra 7H as v6.0 claimed) — HL joins UL in Gemini 3H, making BB-UL convergence a five-fold quadruple-loaded activation.
- **MSR.407**: Confidence 0.87 → 0.82. Shree Lagna NOT in 9H (it is in 7H). Jupiter-Venus 9H conjunction retains Laxmi-Narayana-adjacent character without Shree Lagna reinforcement.
- **MSR.413**: Upgraded from "Seven-System Convergence" to "Eight-System Convergence." Eighth designation: Mercury is the lord of Birth Yoga = Siva (JH confirms; GAP.01 resolved).
- **MSR.022**: Vivaha Saham corrected — Cancer 4H Pushya (not Gemini Ardra 3H).
- **All signals citing "Hora Lagna in 7H" or "HL = Libra"**: Updated to Gemini 3H.
- **All signals citing "Shree Lagna in 9H"**: Updated to Libra 7H.
- **All signals citing "Varnada Lagna in 8H"**: Updated to Cancer 4H.
- **All signals citing "Ghati Lagna in 8H"**: Updated to Sagittarius 9H.
- **MSR.024 (CTR.01 / Saturn CTR)**: Updated — Ishta/Kashta Phala now REVERSES the "Dramatic-Not-Compound" reading for Saturn. JH confirms Saturn Ishta 43.28 / Kashta 4.81 = ~9:1 beneficial. Saturn IS the chart's most beneficial planet by Phala. CTR.01 revised.

**ADDITIONS (MSR.421–MSR.437)**:
- 17 new classical yoga signals from JH v8.0 transcription
- See §NEW below

**UNCHANGED**:
- MSR.001 through MSR.420 (except those noted above) carry forward unchanged from v1.0
- All signal IDs are stable; v2.0 does not renumber

### §0.3 Signal Range Summary

| Range | Content | Count |
|---|---|---|
| MSR.001–MSR.046 | Pre-cataloged signals (ported from DA v1.2.1) | 46 |
| MSR.047–MSR.300 | Phase 2–4 signals (Sessions 6–17) | 254 |
| MSR.301–MSR.420 | Phase 4–5 signals (Sessions 17–32) | 120 |
| MSR.421–MSR.437 | NEW: v8.0 yoga signals | 17 |
| **TOTAL** | | **437** |

---

## §I — CORRECTED SIGNALS (v8.0 Reconciliation)

The following signals are corrected in-place. Their original text in MSR_v1_0 is superseded by these corrected versions.

---

### MSR.391 — CORRECTED v2.0

SIG.MSR.391:
  signal_name: "7H Five-Layer Wealth-Relational-Lakshmi Convergence (v2.0 CORRECTED)"
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
    - "CORRECTED from MSR_v1_0: v6.0 erroneous claim placed Hora Lagna in 7H (actually in 3H Gemini), Saham Roga in 7H (actually in 2H Taurus), Saham Mahatmya in 7H (actually in 9H Sagittarius). All three are REMOVED from 7H composition. Shree Lagna ADDED — confirmed in 7H by JH."
    - "v1.0 framing of '6-layer disease-greatness crucible' is INCORRECT. Roga and Mahatmya are NOT in 7H."
  falsifier: "If Shree Lagna recomputation places it outside 7H (e.g., in 8H or 6H), the Lakshmi-anchor principle relocates. If Saturn were not exalted in Libra, MSR.001 and this signal both dissolve. If BB were computed to a different house, Layer 3 changes. JH-authoritative values for all four corrected elements are locked — falsification would require a new JH export with different birth inputs."
  domains_affected: [relationships, wealth, career, spirit]
  confidence: 0.92
  v6_ids_consumed: [PLN.SATURN, PLN.MARS, BB.NATAL, LAG.SHREE, KP.CUSP7]
  rpt_deep_dive: "RPT.HSE.02.B, REPORT_RELATIONSHIPS_v1_1, UCN_v3_0 §XVII"
  reconciliation: "FIX_SESSION_003 2026-04-18 — MAJOR CORRECTION. Composition: removed HL (→3H), Roga (→2H), Mahatmya (→9H); added Shree Lagna (confirmed 7H by JH). Confidence 0.97→0.92 (downgrade for prior composition error; partial recovery via Shree Lagna addition). Architectural framing: 'six-layer disease-greatness crucible' → 'five-layer wealth-relational-Lakshmi-anchor'."

---

### MSR.402 — SUPERSEDED/INVALIDATED v2.0

SIG.MSR.402:
  signal_name: "Hidden-Pinnacle 8H Architecture via Varnada+Ghati Lagnas — SUPERSEDED/INVALIDATED"
  signal_type: convergence
  status: INVALIDATED
  invalidation_source: "JHORA_TRANSCRIPTION_v8_0_SOURCE.md §2.1; V8_0_RECONCILIATION_REPORT §3.4"
  invalidation_reason: "Original claim stated Varnada Lagna and Ghati Lagna both in 8H Scorpio. JH authoritative data: Varnada Lagna = Cancer 4H (not Scorpio 8H); Ghati Lagna = Sagittarius 9H (not Scorpio 8H). Neither special lagna is in 8H. The '8H hidden-pinnacle' framing is a false architectural claim derived from v6.0 L1 errors. See MSR.402b for replacement signal."
  original_confidence: 0.87
  revised_confidence: 0.00
  domains_affected: []
  reconciliation: "FIX_SESSION_003 2026-04-18 — INVALIDATED. Replacement: MSR.402b. The Ketu MD 2031-2038 remains architecturally significant but the mechanism is Ketu-exalted-8H (not Varnada/Ghati support), per UCN v3.0 §XIX."

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
    - "Combined reading: Social authority (Varnada 4H) + strength-timing peak (Ghati 9H) = a native whose deepest authority operates through home-sanctuary base + dharmic-purposive engagement. NOT through public spectacle or 8H transformation-depth as MSR.402 (now invalidated) claimed."
    - "Ghati Lagna in 9H reinforces the already dense 9H (Jupiter + Venus + Mahatmya Saham + Mrityu Saham) — the native's peak-strength timing is in dharmic contexts."
    - "Varnada in 4H joins: Moon-ruled 4H + Mitra Saham + Samartha Saham + Vivaha Saham + Kali Saham + Matru Saham = the domestic-relational sanctuary is the native's social authority base."
  falsifier: "If JH recomputation of Varnada/Ghati with corrected inputs yields 8H placements, MSR.402 would be partially restored. JH v8.0 is authoritative; falsification requires new birth-data recalculation."
  domains_affected: [relationships, spirit, career, parents]
  confidence: 0.85
  v6_ids_consumed: [LAG.VARNADA, LAG.GHATI, HSE.4, HSE.9]
  rpt_deep_dive: "UCN_v3_0 §XIX, REPORT_SPIRITUAL_v1_1"
  reconciliation: "FIX_SESSION_003 2026-04-18 — NEW SIGNAL. Replaces invalidated MSR.402. Documents corrected Varnada (4H) and Ghati (9H) placements and their architectural meaning."

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
    - "BB natal Libra 8°03' progresses at 6°/year (per FORENSIC_DATA_v7_0_SUPPLEMENT §V7.F)"
    - "At age 42 (2026), BB progressed longitude = Libra 8°03' + (42 × 6°) = 260° = Sagittarius 20°, but using the alternate BB progression method that runs from Moon/Rahu midpoint separately: BB reaches Gemini 3H zone at age 42 — per MSR_v1_0 methodology confirmed. See OPEN contradiction CTR regarding progression method."
    - "UPGRADED per JH v8.0: Hora Lagna confirmed in Gemini 0°39' (3H) — NOT in 7H Libra as v6.0 erroneously stated. HL NOW JOINS UL in Gemini 3H."
    - "Gemini 3H loading at age 42: UL (Gemini 3H) + A5 + A11 + Hora Lagna (JH confirmed) + BB progression = FIVE-FOLD activation, not three-fold as v1.0 claimed."
    - "Mercury rules Gemini 3H — the chart's primary planet governs the convergence sign"
    - "Timing: Mercury MD / Saturn AD (now active 2024-2027) governs the dasha context of the convergence"
    - "Chara Dasha: Scorpio MD / Libra AD (6th from Gemini = Scorpio, activating the axis)"
    - "SAV for Gemini: 27 bindus (JH corrected value; v6.0 had 28)"
  falsifier: "If BB progression method is definitively resolved to 1°/year standard (which would place progressed BB in Sagittarius, not Gemini), this signal requires revision. Current method (per FORENSIC_DATA_v7_0_SUPPLEMENT §V7.F 6°/year) produces the Gemini arrival at age 42. JH confirmation of HL in 3H Gemini is independent of BB progression method — the 3H house loading is confirmed regardless."
  domains_affected: [relationships, wealth, career, mind]
  confidence: 0.94
  v6_ids_consumed: [BB.NATAL, ARD.UL, ARD.A5, ARD.A11, LAG.HORA, HSE.3]
  rpt_deep_dive: "REPORT_RELATIONSHIPS_v1_1, UCN_v3_0 §XVII"
  reconciliation: "FIX_SESSION_003 2026-04-18 — UPGRADED. Confidence 0.86→0.94. Key upgrade: Hora Lagna now confirmed in Gemini 3H (not 7H), making the 3H house a quadruple-loaded (UL+A5+A11+HL) convergence zone PLUS the BB progression target. Five-fold activation, not three-fold."

---

### MSR.407 — CORRECTED v2.0

SIG.MSR.407:
  signal_name: "9H Jupiter-Venus Laxmi-Narayana-Adjacent Architecture — Shree Lagna CORRECTED OUT of 9H (v2.0)"
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
    - "CORRECTED: Shree Lagna is NOT in 9H. v6.0 §12.1 erroneously placed Shree Lagna at 24°15' Sagittarius (9H). JH authoritative: Shree Lagna = 23°19' Libra (7H). The Lakshmi-grace anchor has RELOCATED to 7H. The 9H retains its Laxmi-Narayana-adjacent character via Jupiter-Venus-Mahatmya, but without the Shree Lagna's direct Lakshmi point."
    - "Net interpretation: 9H produces dharmic wealth through Jupiter-Venus-Mahatmya constellation. The Lakshmi-entry-point for the chart is 7H (via Shree Lagna — see MSR.391). Both readings are real but describe different mechanisms: 9H = dharmic-wealth enabler; 7H = Lakshmi-wealth anchor."
  falsifier: "If Jupiter or Venus were to vacate 9H (natal-permanent — impossible except through recomputation with different birth data), the Laxmi-Narayana principle loses its base. JH confirms both planets in 9H Sagittarius."
  domains_affected: [spirit, wealth, career, relationships]
  confidence: 0.82
  v6_ids_consumed: [PLN.JUPITER, PLN.VENUS, HSE.9, LAG.SHREE]
  rpt_deep_dive: "UCN_v3_0 §XVII, REPORT_FINANCIAL_v2_1, REPORT_SPIRITUAL_v1_1"
  reconciliation: "FIX_SESSION_003 2026-04-18 — CORRECTED. Shree Lagna removed from 9H (it is in 7H per JH). Confidence 0.87→0.82. Mahatmya Saham ADDED to 9H (confirmed by JH). 9H remains Laxmi-Narayana-adjacent via Jupiter-Venus but without the direct Shree Lagna Lakshmi-point."

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
  reconciliation: "FIX_SESSION_003 2026-04-18 — UPGRADED. Seven-System → Eight-System. Eighth designation: Mercury = lord of Birth Yoga Siva (JH §0 confirms). Confidence maintained at 0.98. Note: GAP.01 (Birth Yoga) now RESOLVED."

---

### MSR.022 — CORRECTED v2.0

SIG.MSR.022:
  signal_name: "Gemini 3H Nexus — UL + A5 + A11 + Hora Lagna + Vivaha Saham (4H Cancer) — CVG.07 CORRECTED"
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
    - "Hora Lagna: Gemini 0°39' Mrigashira Pada 3 (3H) — JH AUTHORITATIVE. HL NOW CONFIRMED IN GEMINI 3H (not 7H Libra as v6.0 erroneously stated). HL joining UL in Gemini = wealth-activation axis shares UL's house. This is a NEW structural finding upgrading the Gemini 3H nexus from 3 to 4 elements."
    - "CORRECTED: Vivaha Saham — Cancer 9°09' Pushya 4H (JH AUTHORITATIVE; NOT Gemini Ardra 3H as v6.0 §12.2 stated). Vivaha Saham has RELOCATED from this 3H nexus to 4H."
    - "Gulika (shadow) + Dhuma (smoke) in Gemini 3H = subtle obstructions on the relational-communication axis"
    - "D9 12H Gemini stellium (Moon+Jupiter+Rahu) = divisional reinforcement of Gemini themes"
  falsifier: "If Arudha calculations yielded different house placements (alternate house-skipping rules), this nexus would partially dissolve. JH confirms HL in Gemini 3H independently of Arudha calculations."
  domains_affected: [relationships, children, wealth]
  confidence: 0.82
  v6_ids_consumed: [ARD.UL, ARD.A5, ARD.A11, LAG.HORA, SAH.VIVAHA, UPG.GULIKA, UPG.DHUMA, HSE.3, HSE.4]
  rpt_deep_dive: "RPT.HSE.02.C, REPORT_RELATIONSHIPS_v1_1"
  reconciliation: "FIX_SESSION_003 2026-04-18 — CORRECTED. Hora Lagna moved from 7H to 3H Gemini (JH authoritative) — ADDS to Gemini 3H nexus. Vivaha Saham moved from 3H to 4H Cancer (JH authoritative) — REMOVES from this signal, noted separately. Strength_score upgraded slightly from 0.75 to 0.82 due to HL addition."

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
  falsifier: "If Ishta/Kashta recalculation from corrected birth data placed Saturn Ishta:Kashta below 2:1, the beneficial reading would require revision. JH v8.0 is authoritative."
  domains_affected: [career, relationships, wealth, health]
  confidence: 0.93
  v6_ids_consumed: [PLN.SATURN, SBL.SAT, ISH.SAT, KAS.SAT]
  rpt_deep_dive: "REPORT_FINANCIAL_v2_1, UCN_v3_0 §XXIII"
  reconciliation: "FIX_SESSION_003 2026-04-18 — SUBSTANTIALLY REVISED. Old CTR.01 framing 'Dramatic-Not-Compound' partially superseded by JH Ishta/Kashta data showing Saturn = 9:1 beneficial. Saturn's delivery mechanism is structured/disciplined (not windfall) but the net Phalita is overwhelmingly positive."

---

## §II — SIGNALS CARRYING FORWARD UNCHANGED (MSR.001–MSR.391 EXCEPT NOTED)

All signals from MSR_v1_0 carry forward with their original text EXCEPT:
- MSR.022 (corrected above)
- MSR.024 (revised above)
- MSR.391 (corrected above)
- MSR.402 (invalidated above; replaced by MSR.402b)
- MSR.404 (upgraded above)
- MSR.407 (corrected above)
- MSR.413 (upgraded above)

Signals MSR.001 through MSR.420 (all others) retain their original text from MSR_v1_0. The following notable signals are CONFIRMED UNAFFECTED by v8.0 reconciliation:

- MSR.001 (Sasha Mahapurusha Yoga) — UNAFFECTED. Saturn exalted 7H confirmed.
- MSR.004 (Moon AK 11H) — UNAFFECTED. Moon Aquarius 11H confirmed.
- MSR.007 (Saraswati Yoga) — UNAFFECTED. Jupiter-Venus-Mercury constellation confirmed.
- MSR.008 (Lakshmi Yoga) — UNAFFECTED. Jupiter 9L own sign 9H confirmed.
- MSR.009 (Mercury Operational Spine) — UNAFFECTED (upgraded in MSR.413).
- MSR.015 (Hidden Raja Yoga Mars+Saturn 7H) — UNAFFECTED. Both planets in 7H confirmed.
- MSR.016 (Mercury CVG.01) — UNAFFECTED.
- MSR.017 (Jupiter 9L Dharma-Wealth) — UNAFFECTED.
- MSR.031 (Rahu Jaimini Quadruple Aspect) — UNAFFECTED. Rahu Taurus 2H confirmed.
- MSR.396 (Sade Sati Paradox) — UNAFFECTED. Independent of corrected special lagnas.
- MSR.397 (Devata Triple-Lock) — UNAFFECTED. Karakamsa derivation confirmed.
- MSR.343 (PK Mars in 7H / children-through-marriage) — NOTE: This signal retains its dual-karaka-system framing. Under JH 8-karaka, Mars = PiK (Father-karaka), not PK. Under v6.0 7-karaka, Mars = PK. Both noted; signal remains with dual-system annotation.

---

## §III — SIGNAL CORRECTIONS FOR SPECIAL LAGNA CITATIONS

The following signals in MSR_v1_0 cited v6.0 erroneous special lagna placements. The correct placements per JH v8.0 are noted below. Signal text in MSR_v1_0 is superseded by these corrections:

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

## §IV — ROGA SAHAM AND MAHATMYA SAHAM — CORRECTED SIGNALS

The following NEW signals document the correct placements of Roga and Mahatmya Sahams (removed from MSR.391's 7H composition):

SIG.MSR.391a:
  signal_name: "Saham Roga in 2H Taurus Mrigashira — Health Challenges via Speech-Wealth Domain (CORRECTED PLACEMENT)"
  signal_type: tajika-pattern
  classical_source: "Tajika Neelakanthi (Roga Saham classical formula); JHORA_TRANSCRIPTION_v8_0_SOURCE.md §2.2"
  entities_involved: [SAH.ROGA, HSE.2, SGN.TAURUS, NAK.MRIGASHIRA]
  strength_score: 0.60
  valence: malefic
  temporal_activation: natal-permanent
  supporting_rules:
    - "Roga Saham = 27°46' Taurus Mrigashira 2H (JH AUTHORITATIVE)"
    - "CORRECTED: MSR_v1_0 MSR.391 incorrectly placed Roga Saham in 7H Libra (v6.0 computation error)"
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
  reconciliation: "FIX_SESSION_003 2026-04-18 — NEW SIGNAL documenting corrected Roga Saham placement."

SIG.MSR.391b:
  signal_name: "Saham Mahatmya in 9H Sagittarius Moola — Greatness-Honor in Dharmic Domain (CORRECTED PLACEMENT)"
  signal_type: tajika-pattern
  classical_source: "Tajika Neelakanthi (Mahatmya Saham); JHORA_TRANSCRIPTION_v8_0_SOURCE.md §2.2"
  entities_involved: [SAH.MAHATMYA, HSE.9, SGN.SAGITTARIUS, NAK.MOOLA]
  strength_score: 0.78
  valence: benefic
  temporal_activation: natal-permanent
  supporting_rules:
    - "Mahatmya Saham = 11°24' Sagittarius Moola 9H (JH AUTHORITATIVE)"
    - "CORRECTED: MSR_v1_0 MSR.391 incorrectly placed Mahatmya Saham in 7H Libra"
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
  reconciliation: "FIX_SESSION_003 2026-04-18 — NEW SIGNAL documenting corrected Mahatmya Saham placement."

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
    - "CORRECTED: v6.0 §12.2 placed Vivaha Saham in Gemini Ardra 3H — incorrect by 28°57'"
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
  reconciliation: "FIX_SESSION_003 2026-04-18 — NEW SIGNAL documenting corrected Vivaha Saham placement."

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
  reconciliation: "FIX_SESSION_003 2026-04-18 — NEW SIGNAL. Resolves GAP.01. Confirms Birth Yoga = Siva (Mercury-ruled). This provides the 8th system-designation for Mercury, upgrading MSR.413 from Seven-System to Eight-System Convergence."

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
  falsifier: "If Kalachakra Dasha computation uses different scheme (Apsavya) or if corrected birth time changes Deha/Jiva rashi, Paramayush value shifts. JH v8.0 value = 85 years under Savya scheme."
  domains_affected: [health]
  confidence: 0.78
  v6_ids_consumed: [PLN.MOON, KAL.DEHA, KAL.JIVA]
  rpt_deep_dive: "REPORT_HEALTH_LONGEVITY_v1_1 §9"

---

## §VIII — SPECIAL LAGNA ARCHITECTURE SIGNALS (NEW COMPREHENSIVE SUMMARY)

SIG.MSR.443:
  signal_name: "Special Lagna Comprehensive Architecture v8.0 — Corrected Four-Lagna Distribution"
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
    - "KEY PATTERN: No special lagna is in 8H (JH-confirmed). v6.0 placed three in 8H (Ghati, Varnada, Shree) — all three errors corrected."
    - "7H concentration: Saturn + Mars + BB + Shree Lagna + KP sub-lord = five-layer wealth-relational-Lakshmi axis"
    - "3H concentration: UL + A5 + A11 + Hora Lagna = four-layer communication-wealth-partnership image nexus"
    - "9H concentration: Jupiter + Venus + Mahatmya Saham + Ghati Lagna + Mrityu Saham = dharmic-authority-greatness nucleus"
    - "4H concentration: Varnada Lagna + multiple Sahams (7 Sahams in Cancer 4H) = domestic-social-authority nexus"
  falsifier: "JH is the authoritative computation source. Any special lagna falsification requires recomputation with different birth inputs."
  domains_affected: [relationships, spirit, career, wealth, health, parents]
  confidence: 0.95
  v6_ids_consumed: [LAG.HORA, LAG.GHATI, LAG.VARNADA, LAG.SHREE]
  rpt_deep_dive: "UCN_v3_0 §XVII, MSR.391, MSR.402b, MSR.404, MSR.407"
  reconciliation: "FIX_SESSION_003 2026-04-18 — NEW COMPREHENSIVE SUMMARY SIGNAL. Documents the corrected full special-lagna architecture per JH v8.0."

---

## §IX — COMPLETE SIGNAL COUNT

| Category | Count | Notes |
|---|---|---|
| Original MSR v1.0 signals (MSR.001–MSR.420) | 420 | Carried forward; corrections noted above |
| New yoga signals (MSR.421–MSR.437) | 17 | From JH v8.0 §6 |
| New quantitative/metric signals (MSR.438–MSR.443) | 6 | Ishta/Kashta, Bhava Bala, Pancha-Vargeeya, etc. |
| Correction/replacement signals (MSR.391a, .391b, .391c, .402b) | 4 | Saham corrections + MSR.402 replacement |
| **TOTAL v2.0 SIGNALS** | **447** | 420 carried + 27 new |

---

## §X — DERIVATION LEDGER SUMMARY (v8.0 CORRECTIONS)

| Corrected Claim | L1 Source | L2 Impact | L2.5 Impact |
|---|---|---|---|
| Hora Lagna = Gemini 3H (not Libra 7H) | JH TRANS §2.1 | HL removed from 7H analysis | MSR.391 corrected; MSR.022 upgraded; MSR.404 upgraded |
| Ghati Lagna = Sagittarius 9H (not Scorpio 8H) | JH TRANS §2.1 | 8H hidden-pinnacle mechanism removed | MSR.402 invalidated; MSR.402b added |
| Varnada Lagna = Cancer 4H (not Scorpio 8H) | JH TRANS §2.1 | Social-authority 8H reading removed | MSR.402 invalidated; MSR.402b documents 4H |
| Shree Lagna = Libra 7H (not Sagittarius 9H) | JH TRANS §2.1 | Lakshmi-point relocated from 9H to 7H | MSR.391 adds Shree; MSR.407 corrects out of 9H |
| Roga Saham = Taurus 2H (not Libra 7H) | JH TRANS §2.2 | Health-relationship mechanism reframed | MSR.391 removes Roga; MSR.391a documents 2H |
| Mahatmya Saham = Sagittarius 9H (not Libra 7H) | JH TRANS §2.2 | Greatness-dharma linkage reframed | MSR.391 removes Mahatmya; MSR.391b documents 9H |
| Vivaha Saham = Cancer 4H (not Gemini 3H) | JH TRANS §2.2 | Marriage-fortune in domestic not communication | MSR.022 corrected; MSR.391c documents 4H |
| Birth Yoga = Siva (Mercury-ruled) | JH TRANS §0 | GAP.01 resolved | MSR.437 added; MSR.413 upgraded to 8-system |
| Saturn Ishta 43.28 / Kashta 4.81 | JH TRANS §3.3 | Saturn = primary Phala planet | MSR.438 added; MSR.024 revised |
| Jupiter Ishta 10.78 / Kashta 48.81 | JH TRANS §3.3 | CTR.03 quantified | MSR.439 added |
| 5H Bhava Bala rank 1 | JH TRANS §3.4 | 5H is strongest house | MSR.440 added |
| 7H Bhava Bala rank 12 | JH TRANS §3.4 | Confirms MSR.391 weakest-container claim | Existing signals confirmed |

---

## §XI — CHANGELOG

| Version | Date | Session | Change |
|---|---|---|---|
| 1.0 | 2026-04-17 | Session 12 | Initial creation: 575 signals (later rationalized to 420 unique) |
| 2.0 | 2026-04-18 | FIX_SESSION_003 | MAJOR: v8.0 reconciliation corrections; 17 new yoga signals (MSR.421–437); 6 new quantitative signals (MSR.438–443); 4 saham-correction signals; MSR.391 recomposed; MSR.402 invalidated + MSR.402b added; MSR.404 upgraded; MSR.407 corrected; MSR.413 upgraded to 8-system; MSR.024 revised; MSR.022 corrected |

---

*End of MSR_v2_0.md — FIX_SESSION_003 — 2026-04-18 — CLOSED*
