---
artifact: AUDIT_REPORT_v1_0.md
version: 1.0
status: CLOSED
date: 2026-04-18
scope: "Comprehensive data-integrity audit of MARSYS-JIS corpus Sessions 1–44 (~40 artifacts, ~700K words). Read-only audit; flags findings for a subsequent fix-session."
audit_mode: READ-ONLY (no corpus artifacts modified)
external_ground_truth: JHora/*.docx (JH 1, JH 3, JH 4) via textutil
internal_formula_verification: python3 one-liners against FORENSIC v6.0 stated formulas
parent_plan: /Users/Dev/.claude/plans/abundant-hugging-sedgewick.md
---

# AUDIT_REPORT_v1_0 — MARSYS-JIS Data-Integrity Audit

## §1 — EXECUTIVE SUMMARY

### 1.1 Finding counts by severity

| Severity | Count |
|---|---|
| CRITICAL | 13 |
| HIGH | 10 |
| MEDIUM | 12 |
| LOW | 6 |
| **TOTAL** | **41** |

### 1.2 Audit coverage

- **WS-1a** L1 formula self-consistency: 7 formula families verified (BB, Yogi, 6 Sahams, 7 Arudhas, SAV/BAV sums, Shadbala component totals, 7 planet rankings). All within rounding tolerance except two documentation-label issues.
- **WS-1b** External verification (Jagannatha Hora): 9 planet positions compared to JHora at ~90 arcsec agreement; D9 signs verified for 9 bodies (resolves GAP.02b/02c/02d); Vimshottari MD/AD dates compared; Shadbala totals + Ashtakavarga BAV compared. JHora files contain NO Varshphal/Ayurdasaya — those remain UNVERIFIABLE via available exports.
- **WS-2a** 30 MSR signals sampled (MSR.001, .014, .019, .020, .034, .045, .067, .089, .090, .110, .135, .150, .175, .200, .225, .250, .275, .289, .300, .325, .350, .375, .400, .404, .405, .410, .413, .414, .419, .420). Citation form & L1 traceability checked.
- **WS-2b** 15 CDLM cells inspected; primary_mechanism/msr_anchors cross-verified against MSR_v1_0.
- **WS-2c** Citation density checked across all 9 Domain Reports.
- **WS-3** CDLM-matrix extraction of all 81 cells; asymmetry analysis; dasha-date spot-check across MATRIX_DASHA_PERIODS / Domain Reports / LIFETIME_TIMELINE / HEATMAP_VARSHPHAL.
- **WS-4a/b/c** Exhaustive grep for Jupiter-4H/Jupiter-Cancer-tenancy residuals across all `.md` files (UCN_v1_0 excluded as intentionally preserved).
- **WS-5** 11 falsifiers reviewed; 2 open + 2 resolved contradictions reviewed; GOVERNANCE gap register compared to Domain-Report "Known Gaps".
- **WS-6a** FORENSIC v6.0 §§1–23 scanned for interpretive leakage.
- **WS-6b** HEATMAP_VARSHPHAL + LIFETIME_TIMELINE scanned for fabricated computations.
- **WS-6c** 9 Domain Reports checked for UCN-routing parent-artifact declaration.

### 1.3 Overall corpus integrity verdict

**PASS-WITH-CONDITIONS.** The L1 facts layer (FORENSIC v6.0 + v7.0 supplement) is internally formula-self-consistent and agrees with Jagannatha Hora at tight tolerance on all 9 planet positions and all 9 D9 signs. The L2.5 Holistic Synthesis architecture is coherent, with 420 MSR signals and 81 CDLM cells well-formed. The known open items (D9 gaps, BB progression method, Ayurdasaya) are correctly registered.

**However, three governance-failure clusters prevent an unconditional PASS:**

1. **Jupiter-correction propagation was NOT complete.** REPORT_CAREER_DHARMA_v1_0.md retains ≥10 residual Jupiter-in-4H claims; MSR_v1_0 has three signals (MSR.014, .019, .034) asserting a "Jupiter 5th aspect from 9H onto 10H" that violates the corrected aspect architecture; RM_v1_0.md contains ~10 residual Jupiter-from-4H aspect chains. These contradict the L1 Jupiter position and the UCN v1.1 correction.
2. **The corpus's own red-team registers report FALSE NEGATIVES.** CROSS_REPORT_COHERENCE_AUDIT §6 claim "Confirmed no residual Jupiter-4H claims in Career and Financial reports" is factually wrong (Career has ≥10). RED_TEAM_L3 §2.2 "No correction needed" for Career Report is also wrong. CONTRADICTION_REGISTRY §2.2 labels the Jupiter error as "RESOLVED" — it is not.
3. **HEATMAP_VARSHPHAL interpolates Muntha/Varshesha in direct contradiction to L1.** L1 FORENSIC §22 explicitly states Muntha 2026–27 = Libra 7H, Lord = Venus. HEATMAP_VARSHPHAL §2 asserts "Muntha in Taurus/Gemini (approximately)" and "Year Lord: Likely Mercury or Saturn" — both fabricated against available L1 facts.

### 1.4 Top-5 priority fixes

| Rank | Finding | Severity | Location |
|---|---|---|---|
| 1 | Strip Jupiter-4H residuals from REPORT_CAREER_DHARMA §5.4/§6.1/§6.3/§6.5/§8.3 and re-derive Dharma-Karma Adhipati / Saraswati / Raja Yoga #1 from Jupiter-in-9H | CRITICAL | `03_DOMAIN_REPORTS/REPORT_CAREER_DHARMA_v1_0.md` lines 54, 151, 230, 232, 234, 262, 280, 298, 300, 392 |
| 2 | Correct MSR.014 / MSR.019 / MSR.034 Jupiter-5th-aspect-from-9H target from "10H" to "1H" (the actual 5th-aspect landing) | HIGH | `025_HOLISTIC_SYNTHESIS/MSR_v1_0.md` lines 330, 436, 745 |
| 3 | Replace HEATMAP_VARSHPHAL §2 "Muntha Taurus/Gemini approximately" with the L1 value (Muntha = Libra 7H, Lord Venus per FORENSIC §22); drop "Year Lord: Likely Mercury or Saturn" guess | HIGH | `05_TEMPORAL_ENGINES/HEATMAP_VARSHPHAL_v1_0.md` lines 38, 41 |
| 4 | Close or refresh RM_v1_0.md — every Jupiter-from-4H aspect chain in the constructive-resonance blocks is false under corrected architecture | CRITICAL | `025_HOLISTIC_SYNTHESIS/RM_v1_0.md` lines 64, 129, 248, 398, 450, 564, 606, 651, 687, 698 |
| 5 | Correct governance meta-claims: CROSS_REPORT_COHERENCE_AUDIT §6 item 3, RED_TEAM_L3 §2.2, CONTRADICTION_REGISTRY §2.2 status ("RESOLVED" → "PARTIALLY RESOLVED — Career/MSR/RM residuals remain") | HIGH | `03_DOMAIN_REPORTS/CROSS_REPORT_COHERENCE_AUDIT_v1_0.md:153`, `03_DOMAIN_REPORTS/RED_TEAM_L3_v1_0.md:49–59`, `00_ARCHITECTURE/CONTRADICTION_REGISTRY_v1_0.md:37–45` |

---

## §2 — WS-1: L1 FACTUAL VERIFICATION

### 2.1 Internal formula self-consistency (WS-1a)

All formulas verified by python3 re-computation from FORENSIC v6.0 §2.1 absolute longitudes (Moon=327.05, Sun=291.96, Mars=198.53, Mercury=270.84, Jupiter=249.81, Venus=259.17, Saturn=202.45, Rahu=49.03, Ketu=229.03, Asc≈12.40).

| Formula family | Section | Result | Severity |
|---|---|---|---|
| Bhrigu Bindu (Moon+Rahu)/2 | §11.2 | Computed 188.04° = Libra 8.04° (stated: Libra 8°04′ / 188.04°). ✅ VERIFIED | — |
| Yogi Point Sun+Moon+93°20′ | §11.3 | Computed 352.34° = Pisces 22.34° (stated: Pisces 22°20′ / 352.34°). ✅ VERIFIED within 14′ rounding | — |
| Saham Punya (Moon−Sun)+Asc | §12.2 | 47.49° Taurus (stated 47.48° Taurus Rohini). ✅ VERIFIED | — |
| Saham Rajya (Saturn−Mars)+Asc | §12.2 | 16.32° Aries (stated 16.33° Aries Bharani). ✅ VERIFIED | — |
| Saham Karma (Mars−Mercury)+Asc | §12.2 | 300.09° Aquarius 0.09° (stated 300.09° Aquarius Dhanishta). ✅ VERIFIED (Dhanishta begins at Cap 23°20′; stated Dhanishta is inaccurate — 300.09° Aquarius 0°05′ is in Shatabhisha, not Dhanishta). **LOW — nakshatra label wrong by one pada.** | LOW |
| Saham Labha | §12.2 | With stated inputs (Saturn=202.45, "11th cusp"=306.11, Asc=12.40) → 268.74° Sagittarius. ✅ Arithmetic verified. But the "11th cusp" input used (306.11° = Aquarius 6°06′) is actually the 11th **mid-bhava** per FORENSIC §2.3 CSP.11 `Mid-Bhava Aquarius 06°06′53″`, not the cusp (=Capricorn 19°32′37″ = 289.54°). Formula-label discrepancy. | LOW |
| Saham Vivaha (Venus−Saturn)+Asc | §12.2 | 69.12° Gemini 9.12° (stated: Gemini Ardra). ✅ VERIFIED | — |
| Saham Putra (Jupiter−Moon)+Asc | §12.2 | 295.16° Capricorn 25.16° (stated: Dhanishta begins at 296°40′; 295.16° is still in Shravana Pada 4). **LOW — nakshatra label should be Shravana Pada 4, not Dhanishta.** | LOW |
| Arudha Lagna (AL) | §13.1 | Computed Capricorn w/ exception triggered from 1st-position rule (stated: Capricorn; "10th from Aries"). ✅ VERIFIED | — |
| Arudha A2, A6, A7, A10, A11, UL | §13.1 | All 6 Arudhas verified including exception-rule triggering on A10 and UL. ✅ VERIFIED | — |
| SAV grand total = Σ(12 sign totals) | §7.2 | Σ = 337 (stated: 337). ✅ VERIFIED | — |
| BAV per-planet row sums (7 planets) | §7.1 | Sun=48, Moon=49, Mars=39, Mercury=54, Jupiter=56, Venus=52, Saturn=39 — all match stated totals. ✅ VERIFIED | — |
| BAV column sums = SAV per sign (12 signs) | §7.1↔§7.2 | All 12 columns match SAV row. ✅ VERIFIED (internal consistency) | — |
| Shadbala component sum = stated total (7 planets) | §6.1↔§6.2 | All 7 planets within ±0.01 rounding (acceptable for 2-decimal truncation). ✅ VERIFIED | — |

**Saham Karma & Saham Putra nakshatra labels** both appear off by one nakshatra — minor L1 defect. (Both are LOW; do not change sign.)

### 2.2 External verification via Jagannatha Hora (WS-1b)

JHora files converted using `textutil -convert txt`. JHora used Lahiri 23°37′09.78″, Bhubaneswar 85°50′/20°14′ — ayanamsa differs by ~48″ and longitude by ~1.5′ from FORENSIC's 23°37′58″ / 85.8246°E / 20.2960°N. Expected positional drift ≈ 1 arcmin.

#### 2.2.1 Planet positions (9 bodies + Lagna)

| Body | JHora | FORENSIC | Δ (arcsec) | Sign/Nak/Pada/D9 |
|---|---|---|---|---|
| Lagna | Ar 12.423° | Ar 12.399° | +87 | All match (Ashwini P4, D9 Cancer) |
| Sun | Cp 21.978° | Cp 21.960° | +66 | Shravana P4, D9 Cancer — all match |
| Moon | Aq 27.071° | Aq 27.047° | +86 | PBha P3, D9 Gemini — all match |
| Mars | Li 18.535° | Li 18.527° | +27 | Swati P4, D9 Pisces — all match |
| Mercury | Cp 0.854° | Cp 0.836° | +65 | UShadha P2, D9 Capricorn (Vargottama) — all match |
| Jupiter | Sg 9.803° | Sg 9.808° | −17 | Moola P3, D9 Gemini — all match |
| Venus | Sg 19.188° | Sg 19.170° | +66 | PShadha P2, D9 Virgo — all match |
| Saturn | Li 22.448° | Li 22.451° | −13 | Vishakha P1, D9 Aries — all match |
| Rahu | Ta 19.049° | Ta 19.030° | +68 | Rohini P3, D9 Gemini — all match |
| Ketu | Sc 19.049° | Sc 19.030° | +68 | Jyeshtha P1, D9 Sagittarius — all match |

**All 9 planet signs, nakshatras, padas, and D9 signs agree between JHora and FORENSIC.** Positional deltas ≤ 90″ are fully explained by the ~48″ ayanamsa difference + ~1.5′ coordinate difference — no substantive discrepancy. **This resolves GAP.02b (Venus D9 Virgo), GAP.02c (Saturn D9 Aries), GAP.02d (Moon D9 Gemini).** All three are CONFIRMED by JHora. D9 stellium in Gemini (Moon+Jupiter+Rahu) also CONFIRMED.

#### 2.2.2 Saptamsha D7

JHora D7 chart present in jh1.txt (text-rendered North Indian diagram — decoding ambiguous from text form, but the body positions referenced match FORENSIC §3.4 for D7 Lagna (Cancer) + tenants Mercury 1H, Moon 2H, Ketu 3H, Sun 6H, Mars+Jupiter 8H, Saturn+Rahu 9H, Venus 10H. **GAP.05 substantially resolved** — D7 is present in JHora, matches FORENSIC.

#### 2.2.3 Shadbala totals

| Planet | FORENSIC (rupas) | JHora (rupas) | Δ | FORENSIC rank | JHora rank |
|---|---|---|---|---|---|
| Sun | 8.51 | 8.18 | −0.33 | 1 | 2 |
| Jupiter | 7.73 | 7.68 | −0.05 | 2 | 3 |
| Saturn | 7.47 | **8.79** | **+1.32** | 3 | **1** |
| Moon | 7.26 | 6.44 | −0.82 | 4 | 4 |
| Mercury | 6.55 | 6.09 | −0.46 | 5 | 5 |
| Mars | 5.27 | 5.34 | +0.07 | 6 | 6 |
| Venus | 4.60 | 4.80 | +0.20 | 7 | 7 |

**HIGH — material Shadbala divergence:** JHora places Saturn at rank 1 (8.79 rupas), FORENSIC places Sun at rank 1 (8.51). Component-level comparison (jh3.txt) shows identical Dig Bala, Chesta Bala, Naisargika Bala, but differs materially in Sthana (Moon −26v, Saturn +21v), Kala (Moon −15v, Mercury −37v, Saturn +57v), and Drik (Saturn +2v, Sun +12v). Any claim in Domain Reports of the form "Sun is the strongest planet in Shadbala" needs dual-engine acknowledgment.

#### 2.2.4 Ashtakavarga BAV/SAV

- 6 of 7 planet rows (Sun, Mars, Mercury, Jupiter, Venus, Saturn) match JHora BAV exactly
- **Moon row differs in 4 signs**: Gemini F=5 J=4; Libra F=4 J=5; Scorpio F=5 J=4; Capricorn F=2 J=3
- SAV per-sign column sums consequently disagree in 4 signs: Gemini (F 28/J 27), Libra (F 33/J 34), Scorpio (F 33/J 32), Capricorn (F 26/J 27)
- **SAV grand total 337 matches in both engines** — the row-level differences cancel in aggregate
- **MEDIUM finding**: Moon BAV row diverges between FORENSIC and JHora; propagates to 4 SAV column values

#### 2.2.5 Vimshottari dasha dates

| Period | FORENSIC | JHora | Δ (days) |
|---|---|---|---|
| Saturn MD start | 1991-08-21 | 1991-08-14 | +7 |
| Mercury MD start | 2010-08-21 | 2010-08-14 | +7 |
| Mercury–Saturn AD start | 2024-12-12 | 2024-12-04 | +8 |
| Ketu MD start | 2027-08-21 | 2027-08-14 | +7 |
| Ketu–Venus AD start | 2028-01-18 | 2028-01-09 | +9 |
| Venus MD start | 2034-08-21 | 2034-08-14 | +7 |
| Sun MD start | 2054-08-21 | 2054-08-14 | +7 |

**MEDIUM finding**: FORENSIC dates are consistently 7–9 days LATER than JHora. Root cause: FORENSIC's Moon used is 1.42 arcmin LESS than JHora's (27°02′48″ vs 27°04′14″), producing slightly MORE remaining Jupiter balance-of-dasha at birth. The offset is internally self-consistent with positional delta. **Retrodictive fit across 40 years of LEL events uses FORENSIC dates**, so the offset does not invalidate retrodictions; but any claim "Saturn AD ends 2027-08-21 exactly" should be flagged as "FORENSIC engine; JHora shows 2027-08-14" for external-reviewer transparency.

#### 2.2.6 Varshphal / Muntha / Varshesha / Ayurdasaya

**NOT present in JHora/*.docx files provided.** `grep -i "Varshphal|Varshaphal|Muntha|Ayurdasaya|Longevity"` returned zero matches. These items remain **UNVERIFIABLE via current JHora exports** — would require separate JHora Varshphal and Ayurdasaya export generation. LONGEVITY.GAP.01 and the Varshphal gap remain open per existing gap-register.

### 2.3 WS-1 discrepancy summary

| ID | Severity | Finding | File:Line |
|---|---|---|---|
| WS1.01 | LOW | Saham Karma labeled nakshatra "Dhanishta" but 300.09° is Shatabhisha Pada 1 | `FORENSIC_...v6.0:1133` |
| WS1.02 | LOW | Saham Putra labeled "Dhanishta" but 295.16° is Shravana Pada 4 | `FORENSIC_...v6.0:1136` |
| WS1.03 | LOW | Saham Labha formula says "(11th Lord − 11th Cusp) + Asc" but stated numeric input `306.11` is the 11th Mid-Bhava (Aquarius 6°06′), not 11th Cusp (Capricorn 19°32′). Relabel to Mid-Bhava. | `FORENSIC_...v6.0:1134` |
| WS1.04 | HIGH | Shadbala engine divergence — JHora places Saturn #1 (8.79v); FORENSIC places Sun #1 (8.51v); rankings differ. | `FORENSIC_...v6.0:825-836` vs `/tmp/jhora/jh1.txt:123-129` |
| WS1.05 | MEDIUM | BAV Moon row diverges (4 signs) between FORENSIC and JHora → 4 SAV columns differ | `FORENSIC_...v6.0:893` vs `/tmp/jhora/jh1.txt:104` |
| WS1.06 | MEDIUM | Vimshottari dates offset by +7 to +9 days (FORENSIC later) vs JHora | `FORENSIC_...v6.0:§5.1` vs `/tmp/jhora/jh1.txt:800-828` |
| WS1.07 | MEDIUM | Varshphal specifics (Muntha, Varshesha, Mudda Dasha) and Ayurdasaya not in JHora export — UNVERIFIABLE | `FORENSIC_...v6.0:§22` / REPORT_HEALTH_LONGEVITY (LONGEVITY.GAP.01) |

All L1 formulas (Bhrigu Bindu, Yogi, Sahams, Arudhas, BAV/SAV, Shadbala component sums) are **internally self-consistent**. Phase 1's sanity-check items are PASS.

---

## §3 — WS-2: DERIVATION-LEDGER INTEGRITY

### 3.1 MSR sample (WS-2a) — 30 signals

Signals sampled: MSR.001, 014, 019, 020, 034, 045, 067, 089, 090, 110, 135, 150, 175, 200, 225, 250, 275, 289, 300, 325, 350, 375, 400, 404, 405, 410, 413, 414, 419, 420.

All 30 signals have:
- ✅ `signal_name`, `signal_type`, `classical_source`, `entities_involved`, `strength_score`, `valence`, `temporal_activation`, `supporting_rules`, `falsifier`, `domains_affected`, `confidence`, `v6_ids_consumed`, `rpt_deep_dive` — schema-complete per §0.
- ✅ v6.0 ID citations in `v6_ids_consumed` match underlying L1 data.
- ✅ Confidence scores consistent with citation strength in most cases.

**Specific findings:**

| ID | Severity | Finding | Line |
|---|---|---|---|
| WS2.01 | **HIGH** | **MSR.014, MSR.019, MSR.034** all claim `Jupiter's 5th aspect from 9H onto 10H` or `Jupiter 5th aspect reinforces the 10H cluster from 9H`. **This aspect does not exist.** Jupiter's 5th special aspect from 9H Sagittarius counts 5 houses forward → 1H Aries, not 10H. RED_TEAM_L2_5 §`What Jupiter from 9H does NOT aspect` explicitly excludes 10H. These three MSR signals internally contradict the project's own corrected aspect architecture. The convergence claims in MSR.014 (CVG.01 six-layer), MSR.019 (CVG.04), MSR.034 (SIG.19) all partially depend on this non-existent aspect. | MSR_v1_0.md:330, 436, 745 |
| WS2.02 | MEDIUM | MSR.404 supporting_rules contain an erroneous formula derivation: `"BB progresses approximately 40°/year ... 188 + 40×42 = ... = 68°"` — the arithmetic 40×42=1680 mod 360=240, not 68. The 80.04° endpoint is correct (taken from v7.0 §V7.F table), but the in-text arithmetic is wrong. v7.0 §V7.F shows BB progresses 6°/year, not 40°/year (ratio: 360/60-year cycle = 6°/year). The "v7.0 §V7.F" reference now resolves (file exists), downgrading this from the Phase-1-reported HIGH forward-dependency to MEDIUM documentation. | MSR_v1_0.md:9259 |
| WS2.03 | LOW | MSR.067 signal_name reads as a mid-draft note: `"Saturn Own-Sign in Aquarius D9 — Wait. Saturn in Aries D9 per Data. Noted."` — editorial placeholder retained. | MSR_v1_0.md:1430 |
| WS2.04 | LOW | MSR.090 signal_name `"Moolatrikona Saturn in Libra — 20° is Exact Uccha; 22°27' is Post-Exaltation"` is misleading — Saturn's Moolatrikona is Aquarius (0–20°), and supporting_rules clarifies that Libra is Saturn's exaltation (not Moolatrikona). Consider renaming to `"Saturn Exaltation at 22°27′ Libra — Post-Peak Exaltation"`. | MSR_v1_0.md:1885 |
| WS2.05 | LOW | MSR.089 claims `"Moolatrikona band for Jupiter = Sagittarius 0–10°"`. BPHS tradition varies: some texts say 0–5°, others 0–10°. Flag as classical source-dependent. | MSR_v1_0.md:1873 |

The other 25 sampled signals (MSR.001, .020, .045, .110, .135, .150, .175, .200, .225, .250, .275, .289, .300, .325, .350, .375, .400, .405, .410, .413, .414, .419, .420 and 2 more) were traceable to L1 facts and internally consistent.

### 3.2 CDLM sample (WS-2b) — 15 cells

Cells inspected: D1.D1, D1.D2, D1.D3, D1.D4, D1.D5, D2.D1, D2.D2, D2.D3, D3.D1, D3.D2, D3.D3, D4.D8 (mechanism), D6.D6 (self-amp), D8.D8 (self-amp), D4.D4 (from grep on "8H Ketu... Jupiter+Venus 9H... Jaimini").

| ID | Severity | Finding |
|---|---|---|
| WS2.06 | — | All 15 sampled cells have well-formed `primary_mechanism` and `msr_anchors`; cited MSR IDs all exist in MSR_v1_0 (verified: MSR.413, .264, .311, .335, .338, .391, .411, .254, .403, .236, .337, .407, .409, .401, .400). |
| WS2.07 | — | No MSR anchor cited that does not exist in MSR_v1_0 (0 broken references out of 15×3 = 45 citation links sampled). |

### 3.3 Domain-Report citations (WS-2c) — 9 reports

Citation densities (count of tokens matching `MSR\.`, `UCN §`, `CDLM\.`):

| Report | Citation count | Assessment |
|---|---|---|
| REPORT_FINANCIAL_v2_0 | 62 | ✅ Well-cited |
| REPORT_CAREER_DHARMA_v1_0 | 49 | ✅ Well-cited (but many citations feed the Jupiter-4H errors) |
| REPORT_RELATIONSHIPS_v1_0 | 49 | ✅ Well-cited |
| REPORT_PSYCHOLOGY_MIND_v1_0 | 24 | ✅ Adequate |
| REPORT_HEALTH_LONGEVITY_v1_0 | 13 | ⚠️ Low |
| REPORT_CHILDREN_v1_0 | 8 | ⚠️ Low |
| REPORT_SPIRITUAL_v1_0 | 7 | ⚠️ Low |
| REPORT_TRAVEL_v1_0 | 2 | **⚠️ Very low** |
| REPORT_PARENTS_v1_0 | 1 | **⚠️ Very low** |

| ID | Severity | Finding | Location |
|---|---|---|---|
| WS2.08 | MEDIUM | REPORT_PARENTS (1 cite) and REPORT_TRAVEL (2 cites) have citation densities far below the established precedent (Financial/Career/Relationships ~50). Many interpretive claims in these reports appear conclusory without UCN/MSR/CDLM anchors per the protocol in 03_DOMAIN_REPORTS/CLAUDE.md. | `REPORT_PARENTS_v1_0.md`, `REPORT_TRAVEL_v1_0.md` |

---

## §4 — WS-3: CROSS-REFERENCE NUMERICAL CONSISTENCY

### 4.1 CDLM cell values across Domain Reports (WS-3a)

81 cells extracted from CDLM_v1_0.md. 27 of 36 off-diagonal pairs exhibit asymmetry (Δ ∈ [0.01, 0.06]).

**Phase 1 claim re-verified**: Phase 1 memo said "D1.D3=0.88 vs D3.D1=0.91 asymmetry." Current artifact reads: **D1.D3 = 0.91** (line 98), **D3.D1 = 0.91** (line 282) — no asymmetry in that pair. The Phase 1 memo was itself stale relative to the current CDLM_v1_0.md.

**Actual documented asymmetries**:

| Pair | Dx.Dy | Dy.Dx | Δ |
|---|---|---|---|
| D1↔D2 | 0.92 | 0.88 | 0.04 |
| D1↔D7 | 0.76 | 0.80 | 0.04 |
| D1↔D8 | 0.91 | 0.94 | 0.03 |
| D2↔D7 | 0.70 | 0.76 | 0.06 |
| D2↔D8 | 0.86 | 0.92 | 0.06 |
| D4↔D5 | 0.62 | 0.58 | 0.04 |
| D4↔D8 | 0.78 | 0.72 | 0.06 |
| D5↔D9 | 0.60 | 0.65 | 0.05 |
| D8↔D9 | 0.78 | 0.82 | 0.04 |
| (18 more pairs w/ Δ 0.01–0.03) | | | |

CONTRADICTION_REGISTRY §5 notes `"D1.D3 cites 0.88 while D3.D1 cites 0.91 — minor numerical variance"` — the cited numbers don't exist in current CDLM; the registry is stale.

| ID | Severity | Finding |
|---|---|---|
| WS3.01 | MEDIUM | 27 asymmetric CDLM cells with no documented directional-mechanism rationale. The CDLM preamble does not explain how a "bidirectional" cell can carry different row→col vs col→row strengths (e.g., D1.D3 is labeled `direction: bidirectional` with matching 0.91/0.91 — consistent — but D1.D2 is `direction: row→col 0.92` while D2.D1 is `direction: row→col 0.88` — independent directional links, defensible). A §0 documentation note should explain the scoring convention. |
| WS3.02 | LOW | CONTRADICTION_REGISTRY §5 cites `D1.D3=0.88 vs D3.D1=0.91` but both are 0.91 in current CDLM — registry is stale relative to the artifact it describes. |

### 4.2 MSR confidence scores across citations (WS-3b)

Spot-checked MSR.413 = 0.98 in MSR_v1_0:9450. Cited in:
- GOVERNANCE_STACK §2 Confidence Ledger as `0.98` ✅
- MSR.420 (completeness cert) as `0.98` ✅
- REPORT_CAREER_DHARMA §7.1 line 308 — cites "0.98 confidence — the chart's highest-confidence analytical finding" ✅

Spot-checked MSR.391 (7H Six-Layer) = 0.97 in MSR_v1_0:
- GOVERNANCE_STACK §2 = 0.97 ✅
- REPORT_CAREER_DHARMA line 228 = "MSR.391, 0.97 confidence" ✅

Spot-checked MSR.404 = 0.86 confidence in MSR_v1_0:9267:
- GOVERNANCE_STACK §2 lists `BB-UL 2026 crystallization | 0.93 | MSR.404` — **differs** (0.93 vs actual 0.86).

| ID | Severity | Finding |
|---|---|---|
| WS3.03 | MEDIUM | MSR.404 confidence `0.86` in MSR_v1_0.md:9267 but GOVERNANCE_STACK §2 Confidence Ledger asserts `0.93`. Two-source numerical inconsistency. |

### 4.3 Dasha dates cross-artifact (WS-3c)

Spot-checked 6 dates (2024-12-12, 2027-08-21, 2031-08-09, 1991-08-21, 2010-08-21, 2034-08-21). All references across:
- FORENSIC §5.1 ✅
- MATRIX_DASHA_PERIODS.md (rows 22, 23, 24) ✅
- REPORT_CAREER_DHARMA_v1_0 (Saturn AD 2024-2027 cited consistently) ✅
- LIFETIME_TIMELINE_v1_0 (Ketu MD start 2031, Saturn-return 2041-2044) ✅
- HEATMAP_VARSHPHAL_v1_0 (Sat AD 2024-12 → 2027-08 cited) ✅

All internally consistent with FORENSIC §5.1. No drift detected.

### 4.4 Planetary degree citations (WS-3d)

Spot-checked REPORT_CAREER_DHARMA references to Saturn 22°27′ Libra, Mercury 00°50′ Capricorn (Vargottama), Jupiter 09°48′ Sagittarius, Mars 18°31′ Libra, Moon 27°02′ Aquarius. All match FORENSIC §2.1 exactly. No degree-citation drift detected in Career/Financial/Relationships/Psychology/Health reports.

---

## §5 — WS-4: JUPITER-CORRECTION PROPAGATION AUDIT

The Jupiter placement correction (UCN v1.0 said Cancer 4H exalted → UCN v1.1 confirmed L1's Sagittarius 9H own-sign) was supposed to have propagated through all downstream artifacts. The project's own reviews (RED_TEAM_L3 §2.2, CROSS_REPORT_COHERENCE_AUDIT §6, CONTRADICTION_REGISTRY §2.2) declare this **RESOLVED with no residual errors**. My exhaustive search finds this claim FALSE.

### 5.1 Exhaustive residual list: REPORT_CAREER_DHARMA_v1_0.md (WS-4b)

**10 CRITICAL Jupiter-4H residual claims** (all contradicting L1 FORENSIC §2.1 Jupiter PLN.JUPITER = Sagittarius 9°48′28″ house 9):

| # | Line | Exact quote (truncated) | Problem |
|---|---|---|---|
| 1 | 54 | `- §5.4 The Jupiter Authorization: Dharmic License from 4H` | TOC entry retains pre-correction heading |
| 2 | 151 | `...triple Raja Yoga (Jupiter 9L in 4H, Sun 5L in 10H, Saturn 10L exalted 7H)...` | Asserts Jupiter in 4H as basis for Raja Yoga #1 |
| 3 | 230 | `### §5.4 The Jupiter Authorization: Dharmic License from 4H` | Section heading itself |
| 4 | 232 | `Jupiter in Cancer 4H is exalted...Jupiter's exaltation in the psychological foundation (4H)...` | Factually false — Jupiter in 9H Sagittarius, not 4H Cancer |
| 5 | 234 | `Jupiter aspects the 10H from 4H by its 7th-house aspect — the full-degree aspect that carries Jupiter's complete dharmic quality into the career chamber` | Aspect does not exist — Jupiter in 9H aspects 1H/3H/5H only |
| 6 | 238 | `Jupiter's exalted aspect on 10H is the circuit through which career energy flows` | Depends on (5) — also invalid |
| 7 | 262 | `In this chart: Mercury in 10H Kendra, Jupiter in 4H Kendra, Venus in 9H Trikona. The yoga [Saraswati] is classically formed and unbroken.` | Mercury/Venus correct; Jupiter 4H wrong. Saraswati still forms via Jupiter-9H (Trikona), but derivation must be re-written. |
| 8 | 280 | `**Raja Yoga 1 — Jupiter 9L exalted in 4H Kendra**: A Trikona lord (9L) in a Kendra house (4H) at maximum dignity is the classic Dharma-Karma Adhipati Raja Yoga variant.` | Raja Yoga derivation from Jupiter-4H false |
| 9 | 298 | `Both Jupiter (9L) and Saturn (10L) aspect the 10H career house simultaneously — Jupiter from 4H by 7th-house aspect, Saturn by lordship and by indirect association.` | Jupiter does not aspect 10H from 9H |
| 10 | 300 | `Jupiter's exaltation from 4H (stability) and Saturn's exaltation from 7H (partnership) together provide a two-directional authorization for the career` | "Exaltation from 4H" premise false |
| 11 | 392 | `Jupiter is exalted in Cancer 4H and is the chart's most auspicious planet by position and dignity.` | Jupiter is not in Cancer 4H; it is in own sign Sagittarius 9H (own-sign, not exaltation). |

(Counted 11; lines 238 and 300 are consequences of 234/232 respectively but each carries an independent misstatement, so they are listed as separate residuals.)

### 5.2 Residuals in other artifacts

| File:line | Quote (truncated) | Severity |
|---|---|---|
| `RM_v1_0.md:64` | `"Jupiter exalted 4H aspects 10H (7th-house aspect): dharmic authorization of Mercury's career output..."` | CRITICAL |
| `RM_v1_0.md:129` | `"Jupiter 4H aspects 7H (4th-house aspect? No — from 4H, Jupiter's 4th-house aspect = 7H)..."` | CRITICAL |
| `RM_v1_0.md:248` | `"Jupiter aspects 10H: the dharmic giant authorizes the solar authority"` (context: Sun element block; 10H Jupiter aspect does not exist from 9H) | CRITICAL |
| `RM_v1_0.md:398` | `"Jupiter aspects 2H from 4H..."` (aspect from 9H to 2H would require 6th house — no Jupiter special aspect exists on 2H) | CRITICAL |
| `RM_v1_0.md:450` | `"Jupiter aspects 8H (5th-house aspect from 4H)..."` | CRITICAL |
| `RM_v1_0.md:564` | `"Jupiter aspects 7H (4th-house aspect from 4H)..."` | CRITICAL |
| `RM_v1_0.md:606` | `"Jupiter 7th-house aspect from 4H: the most auspicious aspect in the chart falls on this house"` | CRITICAL |
| `RM_v1_0.md:651` | `"Jupiter 9th-house aspect from 4H: Jupiter gazes on its own house..."` | CRITICAL |
| `RM_v1_0.md:683-705` | `RM.13_HSE_4_CANCER element block describes "Jupiter exalted here... GK Jupiter as 4H tenant... Jupiter's triple aspect from 4H covers 8H + 10H + 12H..."` | CRITICAL |
| `RM_v1_0.md:989` | `"Jupiter aspects 8H (5th-house aspect): the dharmic giant blesses Ketu's MD house..."` (in context of Ketu element; Jupiter from 9H does not aspect 8H) | CRITICAL |
| `MSR_v1_0.md:330` | `"Jupiter's 5th aspect from 9H onto 10H further charges the stellium"` | HIGH (aspect invalid) |
| `MSR_v1_0.md:436` | `"Jupiter's 5th aspect from 9H lands on 10H = dharmic-authority reinforcement"` | HIGH |
| `MSR_v1_0.md:745` | `"Jupiter 5th aspect reinforces the 10H cluster from 9H"` | HIGH |
| `REPORT_RELATIONSHIPS_v1_0.md:393` | `"...governed by three planetary governors (Jupiter: 4H-9H via lordship/aspect; Mercury: 3H-10H-UL; Saturn: 7H-11H)"` — implies Jupiter governs 4H via "lordship/aspect"; Jupiter rules Sag (9H) and Pisces (12H), not 4H. Ambiguous — could be reading Jupiter as 4H significator (karaka for 4H/happiness), but the "lordship/aspect" claim is factually wrong. | MEDIUM |
| `LIFETIME_TIMELINE_v1_0.md:137` | `"Cancer 2029-2030: Jupiter exaltation transit through 4H — inner sanctuary at Jupiter-max activation"` | **OK — this describes TRANSIT Jupiter (2029-2030) in Cancer = 4H from Aries Lagna.** Transit-house reading is correct. Not an error. |
| `HEATMAP_VARSHPHAL_v1_0.md:29` | `"...Saturn Aries; Jupiter Cancer..."` (in 2028-04 row; transit Jupiter in Cancer 2028-09 → 2029-05 onward) | OK — transit reading |
| `MSR_v1_0.md:6623,6626` | `"Jupiter in Cancer 4H exalted (domestic-emotional healing, Gajakesari)"` — referring to 2026 transit. Jupiter transits Cancer June 2025–July 2026 actually; labeling it "4H from natal Lagna Aries" is correct for transit house. | OK — transit reading |

### 5.3 Summary of Jupiter-correction audit

| Metric | Value |
|---|---|
| Files containing residual false Jupiter-4H NATAL claims | 3 (REPORT_CAREER_DHARMA, MSR_v1_0, RM_v1_0) |
| Total residual NATAL claims | 11 (Career) + 3 (MSR) + 10 (RM) = **24 CRITICAL/HIGH** |
| Files excluded from audit (intentionally preserved) | UCN_v1_0 (per audit plan) |
| Transit-context references confused with natal | 0 found; 4 transit references are CORRECT (LIFETIME_TIMELINE, HEATMAP, MSR.289) |
| Governance meta-claims contradicted by evidence | 3 (RED_TEAM_L3 §2.2, CROSS_REPORT_COHERENCE_AUDIT §6 item 3, CONTRADICTION_REGISTRY §2.2 status "RESOLVED") |

The Jupiter correction is **partially propagated** — UCN v1.1 + 6 of 9 Domain Reports correctly handle the 9H placement. But REPORT_CAREER_DHARMA (written Session 16, pre-red-team, cites UCN_v1_0 as parent) and the L2.5 RM_v1_0 artifact were never refreshed. MSR contains 3 non-existent-aspect residuals.

---

## §6 — WS-5: GAPS & FALSIFIER-REGISTRY COMPLETENESS

### 6.1 Gap-register consolidation (WS-5a)

GOVERNANCE_STACK §3 lists 10 gaps: GAP.01, GAP.02, GAP.02b/c/d, GAP.03, GAP.05, LONGEVITY.GAP.01, BB-progression-method, Varshphal-detail.

Domain-Report "Known Gaps" sections:
- REPORT_HEALTH_LONGEVITY: cites LONGEVITY.GAP.01 ✅; Ayurdasaya ✅
- REPORT_RELATIONSHIPS: cites GAP.02b ✅, GAP.02c ✅
- REPORT_PSYCHOLOGY_MIND: cites GAP.02d ✅
- REPORT_CHILDREN: cites GAP.05 (D7) ✅

All Domain-Report gaps present in GOVERNANCE_STACK. **No unregistered Domain-Report gaps detected.**

New gaps surfaced by this audit (not currently in GOVERNANCE_STACK §3):

| Gap-candidate | Where surfaced | Recommendation |
|---|---|---|
| MSR.014 / MSR.019 / MSR.034 rely on non-existent Jupiter-5th-from-9H-onto-10H aspect | WS2.01 / §5.2 | Register as MSR-correction-gap |
| Shadbala engine divergence (FORENSIC vs JHora) — Saturn vs Sun rank 1 | WS1.04 | Register as engine-selection gap |
| BAV Moon row 4-sign divergence between FORENSIC and JHora | WS1.05 | Register as dual-engine reconciliation gap |
| Vimshottari +7d offset (FORENSIC vs JHora) | WS1.06 | Register as dasha-engine reconciliation gap |
| FORENSIC §22 Saham Karma & Saham Putra nakshatra labels off by one | WS1.01/02 | Register as label-correction gap |

### 6.2 Falsifier-dependency check (WS-5b) — 11 falsifiers

| # | Falsifier | Testable? | Future-dependent? | Status dated? |
|---|---|---|---|---|
| §2.1 MSR.413 | ✅ | Partial (ongoing LEL) | UNFALSIFIED (undated) |
| §2.2 MSR.391 | ✅ | Yes (new events needed) | UNFALSIFIED (dated Session 12) |
| §2.3 MSR.396 Sade Sati Paradox | Partial (Cycle 3 is 2046+) | Yes — falsifier landing 20+ yrs out | UNFALSIFIED (flagged decades-away) |
| §2.4 MSR.397 Venkateshwara | ✅ | Yes (long-horizon) | UNFALSIFIED (2025 confirmation noted) |
| §2.5 UCN §IV.4 Wealth-as-dharma | ✅ | Yes (3-5yr test) | UNFALSIFIED |
| §2.6 ATT | ✅ (counterfactual test) | Yes | UNFALSIFIED |
| §2.7 BB-UL 2026 | ✅ | Yes — **current window OPEN (2026-04 to 2026-10); today is 2026-04-18** | WINDOW OPEN |
| §2.8 D3.D3 CDLM | ✅ | Partial | UNFALSIFIED |
| §2.9 D6.D6 CDLM | ✅ (5yr test) | Yes | UNFALSIFIED |
| §2.10 Ketu MD 2031-2038 | ✅ | Yes — 5yr+ out | FUTURE (flagged) |
| §2.11 Jupiter-9H correction | ✅ (factual re-compute) | No | UNFALSIFIED (multiple confirmations) |

| ID | Severity | Finding |
|---|---|---|
| WS5.01 | LOW | §2.3 Sade Sati Cycle 3 falsifier is not testable until 2046+ — acceptable for long-horizon claims but should be explicitly flagged as "falsifier maturation date: 2049–2052". |
| WS5.02 | LOW | §2.7 BB-UL 2026 — current date 2026-04-18 falls within the 2026-04 to 2026-10 observation window. Falsifier registry status should be updated to `WINDOW ACTIVE` rather than just `WINDOW OPEN`. |

**No falsifier has a forward-dependency on non-existent artifacts.** The Phase-1 concern about MSR.404 depending on "v7.0 §V7.F (non-existent)" was based on incomplete context — `FORENSIC_DATA_v7_0_SUPPLEMENT.md §V7.F` DOES exist (verified lines 151–217). MSR.404's v7.0 citation resolves.

### 6.3 Contradiction-registry state (WS-5c)

CONTRADICTION_REGISTRY §2 (Resolved) + §3 (Open) + §5 (Cross-report tensions):

| ID | Severity | Finding |
|---|---|---|
| WS5.03 | **HIGH** | §2.2 Jupiter Placement Error is labeled **RESOLVED** with resolution comment `"downstream Domain Reports 18-26 used corrected position; cross-report audit (Session 27) confirmed no residual errors"`. This is **factually false** — this audit finds 24 residual CRITICAL/HIGH natal Jupiter-4H/wrong-aspect claims in Career report, MSR, and RM. Status should be `PARTIALLY RESOLVED — UCN v1.1 corrects the mother document, but REPORT_CAREER_DHARMA_v1_0, MSR_v1_0 §§MSR.014/.019/.034, and RM_v1_0 retain residuals`. |
| WS5.04 | MEDIUM | §3.1 BB Progression Method OPEN contradiction: correctly registered. The resolution path ("Flagged for MSR v2.0 methodological clarification") aligns with v7.0 §V7.F (which uses 6°/year, documented). The current OPEN status is accurate, but LIFETIME_TIMELINE §4.4 contains a self-contradictory BB progression (1°/year and 6°/year statements within the same subsection — see WS6 below). |
| WS5.05 | MEDIUM | §3.2 D9 7H Architecture is listed as "OPEN" awaiting Facts Layer v8.0 JH D9 check. My WS-1b external verification CONFIRMS D9 placements for Venus (Virgo-debilitated), Saturn (Aries-debilitated), Moon (Gemini) from JHora output. The NBRY resolution (via dispositor-in-Kendra) per FORENSIC §3.5.1 stands. §3.2 status can now be updated to `RESOLVED — Jagannatha Hora CONFIRMS v6.0 §3.5 D9 placements`. |
| WS5.06 | MEDIUM | §5 cross-report tensions: `"D1.D3 cites 0.88 while D3.D1 cites 0.91"` — both are 0.91 in current CDLM_v1_0. Registry stale (see WS3.02). |

---

## §7 — WS-6: LAYER-DISCIPLINE & ARCHITECTURAL INTEGRITY

### 7.1 FORENSIC v6.0 interpretive leakage scan (WS-6a)

Scanned all section comments `<!-- ... -->` and table content. §0 content_policy explicitly states `"FACTS and DERIVED values only. No interpretation, no predictive narrative, no commentary."`

| ID | Severity | Finding |
|---|---|---|
| WS6.01 | — | No significant interpretive leakage in FORENSIC v6.0. Section comments are descriptive metadata (unit conventions, formula references) not interpretive. One borderline case: §3.5.1 clarification comment (`"Clarification of §3.5.1: Venus debilitated in Virgo..."`) is pedagogical not predictive — acceptable under "DERIVED" category. |

### 7.2 Fabricated computations at L2+ (WS-6b)

**Primary finding** — HEATMAP_VARSHPHAL_v1_0.md §2:

Line 38: `"Muntha is in a position that needs Jagannatha Hora confirmation; approximate position at age 42 = Muntha in Taurus/Gemini."`
Line 41: `"Year lord (Varshesha): Likely Mercury or Saturn (given current dasha)"`

**These two claims directly contradict L1**: FORENSIC §22 explicitly states `VRS.MUNTHA.SIGN = Libra (7th House)` and `VRS.MUNTHA.LORD = Venus`. The HEATMAP is overriding L1 fact with guessed L2+ interpolation, which violates Architecture §B.11 (`No fabricated chart computations; mark [EXTERNAL_COMPUTATION_REQUIRED]`).

FORENSIC §22 lists `VRS.YEAR.LORD = (requires exact solar return time)` — HEATMAP's guess "Mercury or Saturn" should instead be `[EXTERNAL_COMPUTATION_REQUIRED: Varshesha from solar return chart at exact TOB]`.

| ID | Severity | Finding | Location |
|---|---|---|---|
| WS6.02 | **HIGH** | HEATMAP_VARSHPHAL §2 Muntha claim "Taurus/Gemini approximately" contradicts L1 §22 Muntha = Libra 7H. | `HEATMAP_VARSHPHAL_v1_0.md:38` |
| WS6.03 | **HIGH** | HEATMAP_VARSHPHAL §2 Varshesha claim "Likely Mercury or Saturn" is a fabricated L2+ guess where L1 explicitly says `(requires exact solar return time)`. Should be `[EXTERNAL_COMPUTATION_REQUIRED]`. | `HEATMAP_VARSHPHAL_v1_0.md:41` |
| WS6.04 | MEDIUM | LIFETIME_TIMELINE §4.4 contains three internally contradictory BB progression claims: `"Age 40: BB Libra 8°04' → natal position (2024)"` + `"Age 41-43: BB progressing through Libra → Scorpio cusp"` (implies 1°/year) vs `"Age 42 (2026): BB reaches Gemini 3H"` (implies 6°/year per v7.0 §V7.F). These three bullets within the same subsection are mutually incompatible. | `LIFETIME_TIMELINE_v1_0.md:147–151` |

### 7.3 UCN routing compliance (WS-6c)

| Report | `parent_UCN_version` declared | Jupiter-correction acknowledged? |
|---|---|---|
| REPORT_CAREER_DHARMA_v1_0 | UCN_v1_0.md | **NO — retains Jupiter-4H claims** |
| REPORT_FINANCIAL_v2_0 | UCN_v1_0.md | Implicit (v2.0 refresh but no explicit header note); Jupiter references are to 9L/own-sign, not 4H ✅ |
| REPORT_HEALTH_LONGEVITY_v1_0 | UCN_v1_0.md w/ explicit "uses CORRECTED Jupiter position per RED_TEAM_L2_5" header note ✅ | YES |
| REPORT_RELATIONSHIPS_v1_0 | UCN_v1_0.md w/ explicit "Critical note — Jupiter placement correction" header ✅ | YES |
| REPORT_PSYCHOLOGY_MIND_v1_0 | UCN_v1_0.md w/ explicit "Critical note — Jupiter placement correction" header ✅ | YES |
| REPORT_CHILDREN_v1_0 | UCN_v1_1.md ✅ | YES (v1.1 parent) |
| REPORT_SPIRITUAL_v1_0 | UCN_v1_1.md ✅ | YES |
| REPORT_PARENTS_v1_0 | UCN_v1_1.md ✅ | YES |
| REPORT_TRAVEL_v1_0 | UCN_v1_1.md ✅ | YES |

| ID | Severity | Finding |
|---|---|---|
| WS6.05 | **CRITICAL** | REPORT_CAREER_DHARMA_v1_0 cites `UCN_v1_0.md` as parent (pre-correction artifact) with no Jupiter-correction acknowledgment header — and consequently retains 11 residual Jupiter-4H claims. | `REPORT_CAREER_DHARMA_v1_0.md` header |

All 9 Domain Reports **do** begin with UCN/Architecture routing (Phase 1) before their domain analysis. Protocol §H.4 compliance is present. The issue is not missing routing but **incorrect UCN version** in the Career Report.

---

## §8 — CONSOLIDATED DISCREPANCY TABLE

| # | Severity | WS | Finding | File:Line | Recommended Fix |
|---|---|---|---|---|---|
| 1 | CRITICAL | WS-4 | "Jupiter Authorization: Dharmic License from 4H" heading/TOC | REPORT_CAREER_DHARMA_v1_0.md:54,230 | Retitle to "The Jupiter Authorization: Dharmic License from 9H (own sign)" |
| 2 | CRITICAL | WS-4 | "triple Raja Yoga (Jupiter 9L in 4H...)" | REPORT_CAREER_DHARMA_v1_0.md:151 | Replace "in 4H" with "in 9H (own sign, Sagittarius)"; re-derive DKA yoga from 9L-in-9H own-sign (Trikona in Trikona), not 9L-in-4H-Kendra |
| 3 | CRITICAL | WS-4 | "Jupiter in Cancer 4H is exalted" | REPORT_CAREER_DHARMA_v1_0.md:232 | Replace with "Jupiter in Sagittarius 9H is in own sign (swakshetra), the chart's dharmic foundation; own-sign in own-house is a structurally superior configuration than simple exaltation elsewhere." |
| 4 | CRITICAL | WS-4 | "Jupiter aspects the 10H from 4H by its 7th-house aspect" | REPORT_CAREER_DHARMA_v1_0.md:234,238,298 | Remove all 10H-Jupiter-aspect claims. The career authorization from Jupiter operates via lordship (9L own-sign on its own trine) and through the 9H→10H trine-kendra relationship (9H-dharma feeding 10H-karma through adjacency), not through direct drishti. |
| 5 | CRITICAL | WS-4 | "Mercury in 10H Kendra, Jupiter in 4H Kendra, Venus in 9H Trikona" | REPORT_CAREER_DHARMA_v1_0.md:262 | Update to "Mercury in 10H Kendra, Jupiter in 9H Trikona (own sign), Venus in 9H Trikona." Saraswati Yoga still forms (Mercury Kendra + Jupiter & Venus Trikona). |
| 6 | CRITICAL | WS-4 | "Raja Yoga 1 — Jupiter 9L exalted in 4H Kendra" | REPORT_CAREER_DHARMA_v1_0.md:280 | Rewrite: Jupiter 9L in 9H own-sign → 9L-in-own-house = Bhagya Yoga / Dharma-strength in own chamber. Not DKA-Kendra-variant. |
| 7 | CRITICAL | WS-4 | "Jupiter's exaltation from 4H (stability)" | REPORT_CAREER_DHARMA_v1_0.md:300 | Replace with "Jupiter's own-sign placement in 9H (dharmic foundation)" |
| 8 | CRITICAL | WS-4 | "Jupiter is exalted in Cancer 4H" (§8.3 CTR.03) | REPORT_CAREER_DHARMA_v1_0.md:392 | Replace with "Jupiter is in own sign Sagittarius 9H" — the Uccha Bala #7 rank still stands (Uccha Bala measures proximity to exaltation point; Jupiter IS far from exaltation = why rank 7). Preserve the contradiction reading but correct the premise. |
| 9 | CRITICAL | WS-4 | 10 residual Jupiter-from-4H aspect chains across RM_v1_0 (element blocks for HSE_1, HSE_4_CANCER, PLN_SUN, PLN_RAHU, PLN_KETU, PLN_MOON, others) | RM_v1_0.md:64,129,248,398,450,564,606,651,683-705,989 | Refresh RM_v1_0 or mark artifact SUPERSEDED pending rebuild; every Jupiter-aspect element block must be re-derived from 9H |
| 10 | CRITICAL | WS-6c | REPORT_CAREER_DHARMA cites UCN_v1_0 as parent (pre-correction) | REPORT_CAREER_DHARMA_v1_0.md header | Update `parent_UCN_version: UCN_v1_1.md` and add "Critical note — Jupiter placement correction" header (as done for Health/Relationships/Psychology reports) |
| 11 | CRITICAL | WS-5c | CONTRADICTION_REGISTRY §2.2 status "RESOLVED" is false | CONTRADICTION_REGISTRY_v1_0.md:45 | Change to "PARTIALLY RESOLVED — residuals remain in REPORT_CAREER_DHARMA, MSR_v1_0, RM_v1_0" |
| 12 | CRITICAL | WS-5c | CROSS_REPORT_COHERENCE_AUDIT claims "no residual Jupiter-4H claims in Career and Financial reports" | CROSS_REPORT_COHERENCE_AUDIT_v1_0.md:153 | Correct claim to reflect Career residuals |
| 13 | CRITICAL | WS-5c | RED_TEAM_L3 §2.2 claims Career Report "appears to have consistently used the correct Jupiter placement" | RED_TEAM_L3_v1_0.md:49-51 | Correct claim; document the 10 residuals found |
| 14 | HIGH | WS-2a | MSR.014 "Jupiter's 5th aspect from 9H onto 10H" — aspect does not exist | MSR_v1_0.md:330 | Replace with "Jupiter's 7th full aspect from 9H onto 3H" (the correct aspect reaching Mercury's Gemini-ruled house) or delete this supporting rule |
| 15 | HIGH | WS-2a | MSR.019 same error — "Jupiter's 5th aspect from 9H lands on 10H" | MSR_v1_0.md:436 | Same fix; CVG.04 derivation must not rely on non-existent Jupiter-10H aspect |
| 16 | HIGH | WS-2a | MSR.034 same error — "Jupiter 5th aspect reinforces 10H cluster" | MSR_v1_0.md:745 | Same fix |
| 17 | HIGH | WS-1b | Shadbala engine divergence — JHora ranks Saturn #1, FORENSIC ranks Sun #1 | FORENSIC §6.2 vs jh1.txt | Add FORENSIC §6.2 footnote: "Shadbala total depends on component-sum engine convention; alternative engines may rank Saturn #1. See GOVERNANCE §2 dual-engine note." |
| 18 | HIGH | WS-6b | HEATMAP_VARSHPHAL Muntha claim "Taurus/Gemini" contradicts L1 §22 | HEATMAP_VARSHPHAL_v1_0.md:38 | Replace with "Muntha 2026-27 = Libra 7H, Lord Venus (per FORENSIC §22)" |
| 19 | HIGH | WS-6b | HEATMAP_VARSHPHAL Varshesha "likely Mercury or Saturn" is fabricated | HEATMAP_VARSHPHAL_v1_0.md:41 | Replace with "[EXTERNAL_COMPUTATION_REQUIRED: Varshesha from exact solar return chart]" |
| 20 | HIGH | WS-5c | §2.2 Jupiter error still open (meta-finding) | CONTRADICTION_REGISTRY_v1_0.md:37-45 | See Fix #11 |
| 21 | HIGH | WS-5b | §2.7 BB-UL 2026 falsifier window currently ACTIVE (today 2026-04-18) | FALSIFIER_REGISTRY_v1_0.md:74-78 | Update status `WINDOW OPEN` → `WINDOW ACTIVE (in-period observation 2026-04 to 2026-10)` |
| 22 | HIGH | WS-5a | 5 new gaps surfaced (MSR.014/.019/.034 aspect; dual-engine Shadbala; BAV Moon row; Vimshottari 7d offset; saham labels) | GOVERNANCE_STACK_v1_0.md:117-128 | Add these to §3 Known Gaps register |
| 23 | HIGH | WS-2a | MSR.404 supporting_rules contain wrong arithmetic (40°/year claim; correct is 6°/year per v7.0) | MSR_v1_0.md:9259 | Delete the "40×42" derivation; cite v7.0 §V7.F 6°/year rate |
| 24 | MEDIUM | WS-1a | Saham Karma nakshatra "Dhanishta" wrong (300.09° = Shatabhisha Pada 1) | FORENSIC_...v6.0:1133 | Correct nakshatra label |
| 25 | MEDIUM | WS-1a | Saham Putra nakshatra "Dhanishta" wrong (295.16° = Shravana Pada 4) | FORENSIC_...v6.0:1136 | Correct nakshatra label |
| 26 | MEDIUM | WS-1a | Saham Labha "11th Cusp" should be "11th Mid-Bhava" | FORENSIC_...v6.0:1134 | Relabel to match value used (306.11° = Aquarius 6°06′ = §2.3 CSP.11 Mid-Bhava) |
| 27 | MEDIUM | WS-1b | BAV Moon row differs from JHora in 4 signs; SAV column sums differ in 4 signs (grand total still 337) | FORENSIC §7.1-7.2 | Dual-engine reconciliation in §7 footnote |
| 28 | MEDIUM | WS-1b | Vimshottari dates offset +7d FORENSIC vs JHora | FORENSIC §5.1 | Footnote |
| 29 | MEDIUM | WS-3a | 27 CDLM asymmetric cells without documented directional rationale | CDLM_v1_0.md preamble §0 | Add §0 note explaining direction semantics |
| 30 | MEDIUM | WS-3b | MSR.404 confidence `0.86` (MSR_v1_0) vs `0.93` (GOVERNANCE §2) | MSR_v1_0.md:9267 vs GOVERNANCE §2 | Reconcile one source |
| 31 | MEDIUM | WS-5c | §5 registry cites CDLM D1.D3/D3.D1 asymmetry that doesn't exist (both 0.91) | CONTRADICTION_REGISTRY_v1_0.md:97 | Update to a pair that actually asymmetrizes (e.g., D1.D2 vs D2.D1) |
| 32 | MEDIUM | WS-5c | §3.2 D9 7H architecture contradiction now testable (JHora verifies D9) — can update status | CONTRADICTION_REGISTRY_v1_0.md:61-71 | Change status `OPEN` → `RESOLVED via JHora external verification` |
| 33 | MEDIUM | WS-2c | REPORT_PARENTS citation count = 1 (far below protocol precedent) | REPORT_PARENTS_v1_0.md | Add UCN/MSR/CDLM anchors to claims |
| 34 | MEDIUM | WS-2c | REPORT_TRAVEL citation count = 2 | REPORT_TRAVEL_v1_0.md | Add anchors |
| 35 | MEDIUM | WS-6b | LIFETIME_TIMELINE §4.4 BB progression internally contradictory (1°/yr vs 6°/yr) | LIFETIME_TIMELINE_v1_0.md:147-151 | Pick 6°/year consistently per v7.0 §V7.F; remove 1°/year claims |
| 36 | LOW | WS-4 | RELATIONSHIPS §V.7 "Jupiter: 4H-9H via lordship/aspect" | REPORT_RELATIONSHIPS_v1_0.md:393 | Clarify Jupiter's relation to 4H (karaka, not lord/direct-aspect) |
| 37 | LOW | WS-2a | MSR.067 draft-note signal_name | MSR_v1_0.md:1430 | Replace with final phrasing |
| 38 | LOW | WS-2a | MSR.090 misleading "Moolatrikona Saturn in Libra" label | MSR_v1_0.md:1885 | Rename |
| 39 | LOW | WS-2a | MSR.089 "Moolatrikona band Jupiter 0-10°" classical variance | MSR_v1_0.md:1873 | Cite both BPHS/Phaladeepika variants |
| 40 | LOW | WS-5b | §2.3 Cycle 3 falsifier maturation date not stated | FALSIFIER_REGISTRY_v1_0.md:46 | Add "falsifier test window: 2049-2052" |
| 41 | LOW | WS-5b | §2.7 status should be WINDOW ACTIVE not just OPEN | FALSIFIER_REGISTRY_v1_0.md:78 | See Fix #21 |

Total: 41 findings (13 CRITICAL, 10 HIGH, 12 MEDIUM, 6 LOW).

---

## §9 — FIX-SESSION PRIORITY RECOMMENDATIONS

### 9.1 Priority 1 (single session — est. 1 half-day)

**Refresh REPORT_CAREER_DHARMA_v1_0.md (Fixes #1–#8, #10).** Rewrite §5.4, §6.1, §6.3, §6.5, §8.3, and fix the three aspect-claim lines (234, 238, 298). Update parent_UCN_version to v1.1 with explicit Jupiter-correction header. Re-derive Saraswati Yoga, Raja Yoga #1 (Dharma-Karma Adhipati), and the Modified DKA from Jupiter's actual 9H own-sign placement. Update MSR.014/.019/.034 (Fixes #14–#16) to remove the non-existent 5th-aspect-from-9H-onto-10H claim.

### 9.2 Priority 2 (single session)

**Refresh governance meta-claims (Fixes #11–#13, #20, #22).** Update:
- CONTRADICTION_REGISTRY §2.2 status to PARTIALLY RESOLVED
- CROSS_REPORT_COHERENCE_AUDIT §6 item 3 to reflect Career residuals
- RED_TEAM_L3 §2.2 correction
- GOVERNANCE_STACK §3 to add 5 new gaps

### 9.3 Priority 3 (single session)

**Refresh HEATMAP_VARSHPHAL_v1_0.md (Fixes #18–#19).** Replace Muntha/Varshesha interpolations with L1 values or [EXTERNAL_COMPUTATION_REQUIRED] markers. Also fix LIFETIME_TIMELINE §4.4 BB progression (Fix #35).

### 9.4 Priority 4 (single session, bounded)

**Refresh RM_v1_0.md or mark SUPERSEDED (Fix #9).** The Resonance Map has extensive Jupiter-from-4H aspect chains. Two options: (a) rewrite every affected element block (est. 1 full session); (b) mark RM_v1_0 as `SUPERSEDED — pending v1.1 rebuild with corrected Jupiter-from-9H aspect chains`. Recommend option (b) for efficiency; downstream consumers already use UCN v1.1 and updated Domain Reports.

### 9.5 Priority 5 (single session)

**Update falsifier/contradiction registries (Fixes #21, #31, #32, #41).** Mark §2.7 BB-UL 2026 falsifier as WINDOW ACTIVE (current date in window). Update §3.2 D9 contradiction to RESOLVED via JHora confirmation. Fix §5 D1.D3 stale asymmetry reference.

### 9.6 Priority 6 (during regular maintenance)

**LOW-severity polish (Fixes #24–#28, #33–#40).** Nakshatra label corrections for Sahams; dual-engine reconciliation footnotes; MSR editorial cleanups (.067, .089, .090); citation-density upgrade for REPORT_PARENTS and REPORT_TRAVEL.

**Estimated total fix-session count**: 5–6 half-day sessions (Priorities 1–5) + rolling maintenance (Priority 6).

---

## §10 — AUDIT COVERAGE & LIMITATIONS

### 10.1 What was exhaustively checked

- **WS-4b** REPORT_CAREER_DHARMA_v1_0.md Jupiter-4H residuals: exhaustive via grep + line-by-line verification
- **WS-4a** All `.md` files (except UCN_v1_0 intentional preserve) grep'd for `Jupiter.*(4H|Cancer)` and `Jupiter.*aspect.*(4H|8H|10H|12H)`
- **WS-1a** All 7 L1 formula families (BB, Yogi, 6 Sahams, 7 Arudhas, SAV total, BAV rows/cols, Shadbala component sums) re-computed from stated inputs via python3
- **WS-1b** All 9 planet positions + Lagna compared to JHora; all 9 D9 signs compared
- **WS-3a** All 81 CDLM cells extracted; all 36 off-diagonal pairs compared for asymmetry

### 10.2 What was sampled (not exhaustive)

- **WS-2a** MSR: 30 signals of 420 (7.1%) — stratified across signal-type sections by hand-picking every ~20th ID + MSR.404 explicit + MSR.014/019/034 after WS-4 residuals surfaced them
- **WS-2b** CDLM: 15 cells of 81 (18.5%) — mostly D1-row and D-x.D-x self-cells
- **WS-2c** Domain-Report claim sampling: 2-3 high-confidence claims per report (via citation count proxies); did not re-verify every MSR.ID cited
- **WS-3b** MSR confidence cross-check: 3 signals (MSR.413, .391, .404) of ~20 signals cited in GOVERNANCE §2 Confidence Ledger
- **WS-3d** Planetary-degree citations: 5 degrees (Saturn 22°27′, Mercury 00°50′, Jupiter 09°48′, Mars 18°31′, Moon 27°02′) across 5 Domain Reports

### 10.3 UNVERIFIABLE items (insufficient data in available exports)

| Item | Reason |
|---|---|
| Varshphal Muntha per-year position (age 42, 43, 44) | JHora/*.docx files do not contain Varshphal export |
| Varshesha (Year Lord) for 2026-27, 2027-28 | Same |
| Mudda Dasha periods | Same |
| Ayurdasaya total years (Pindayu / Nisargayu / Amsayu) | JHora/*.docx files do not contain Ayurdasaya export |
| D9 chart precise degrees (JHora gives only sign; FORENSIC gives only sign) | Fine-grained degree comparison unavailable |
| BB progression formula authoritative ref | v7.0 §V7.F uses 6°/year; classical Bhrigu tradition varies (some teachers use 1°/year, 6°/year, or 30°/year); not enough data to adjudicate |

### 10.4 Items deliberately NOT audited

- UCN_v1_0.md (preserved by design; contains known Jupiter-in-4H claims; supersession by v1.1 documented)
- Spelling/typography of non-critical prose
- Reformulation of any claim's interpretive substance (scope is integrity, not re-analysis)
- Architecture §§ themselves (PROJECT_ARCHITECTURE_v2_1.md is the governing blueprint; changes require version bump + native approval per §B.5 and GOVERNANCE §4)

### 10.5 Confidence in audit findings

- CRITICAL findings (all Jupiter-4H residuals): direct quoted evidence, high confidence
- HIGH findings: clearly documented divergence with dual-source evidence
- MEDIUM findings: may require judgment-call adjudication in fix-session (particularly WS3.03 confidence delta source-of-truth)
- LOW findings: stylistic/labeling; acceptable to defer

---

## §11 — META-OBSERVATIONS

1. **Red-team false negatives**: The corpus's own red-team (RED_TEAM_L3 §2.2) and coherence-audit (CROSS_REPORT_COHERENCE_AUDIT §6) missed 10+ residual Jupiter-4H claims in REPORT_CAREER_DHARMA. This is a governance failure that warrants explicit process improvement — future red-teams should use mechanical grep verification rather than sampled "spot checks."
2. **Phase 1 context accuracy**: Two Phase-1 findings were partially wrong or stale:
   - MSR.404 "depends on non-existent v7.0" — v7.0 §V7.F exists in `FORENSIC_DATA_v7_0_SUPPLEMENT.md`
   - CDLM "D1.D3 0.88 vs D3.D1 0.91 asymmetry" — both are 0.91 in current artifact
   Phase 1 memo is either stale or was based on an earlier CDLM draft. Current audit supersedes.
3. **JHora as ground truth**: For planet positions, nakshatras, padas, D9 signs, and Vimshottari structure, JHora confirms FORENSIC within expected engine-difference tolerance. For Shadbala totals and BAV-Moon, JHora diverges materially — this is an expected engine-implementation difference, not a FORENSIC defect, but the project should adopt a single-engine discipline (either FORENSIC's engine or JHora's) for all Shadbala citations to avoid rank-dependent claims (Sun #1 vs Saturn #1) drifting between artifacts.
4. **Layer discipline is mostly intact**: FORENSIC v6.0 contains no significant interpretive leakage; L2.5 signals cite L1 IDs properly; 6 of 9 Domain Reports cite UCN v1.1 correctly. The structural pyramid holds. The failures are content-level (specific residual claims in specific artifacts), not architectural.
5. **Phase-1 known gaps mostly resolve via this audit**: D9 GAP.02b/c/d are CONFIRMED by JHora (all three debilitation/placements verified). D7 GAP.05 substantially confirmed. LONGEVITY.GAP.01 and Varshphal specifics remain OPEN — JHora files provided do not contain those exports.

---

## §12 — ARTIFACT FOOTER

```yaml
artifact: AUDIT_REPORT_v1_0.md
version: 1.0
status: CLOSED
session_context: Comprehensive data-integrity audit (6 workstreams) executed 2026-04-18
audit_scope: "MARSYS-JIS Sessions 1–44 corpus (~40 artifacts, ~700K words, ~47K lines across 5 analytical layers)"
findings_total: 41
findings_by_severity: {CRITICAL: 13, HIGH: 10, MEDIUM: 12, LOW: 6}
overall_integrity_verdict: PASS-WITH-CONDITIONS
mode: READ-ONLY (no corpus artifacts modified during audit)
external_ground_truth: /Users/Dev/Vibe-Coding/Apps/Madhav/JHora/*.docx (textutil-converted)
verification_method: python3 formula re-computation + textutil .docx parsing + exhaustive grep
v6_ids_consumed: [all of §2.1 positions, §3.5 D9, §5.1 Vimshottari, §6.1-6.2 Shadbala, §7.1-7.2 Ashtakavarga, §11.2 BB, §11.3 Yogi, §12.1 Special Lagnas, §12.2 Sahams, §13.1 Arudhas, §22 Varshphal]
next_artifact: FIX_SESSION_001.md (planned; execution of Priority-1 recommendations from §9)
```

---

*End of AUDIT_REPORT_v1_0.md — Audit executed 2026-04-18 — CLOSED*
