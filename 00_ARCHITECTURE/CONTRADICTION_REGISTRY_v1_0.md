---
artifact: CONTRADICTION_REGISTRY_v1_0.md
version: 1.0
status: CLOSED
session: 38
date_closed: 2026-04-18
scope: "Registry of internal contradictions within the corpus — both resolved and open"
---

# CONTRADICTION_REGISTRY_v1_0
## Abhisek Mohanty Jyotish Intelligence System
### Session 38 | 2026-04-18 | CLOSED

---

## §1 — PURPOSE

The corpus contains ~700,000 words across 40+ artifacts. This registry tracks:
- Historical errors discovered and corrected
- Open contradictions between claims
- The chart's architecturally-intended contradictions (UCN §IX) — NOT errors but features

---

## §2 — RESOLVED CONTRADICTIONS (CORRECTED ERRORS)

### §2.1 — Sun Dignity Error (Session 10b)

**Error**: Matrices claimed "Sun debilitated in D1."

**Truth**: Sun in Capricorn = enemy's sign (Shatru Kshetra), not debilitation (Neecha). Sun's debilitation sign is Libra.

**Resolution**: 11 occurrences corrected across 4 matrix files (MATRIX_PLANETS, MATRIX_SIGNS, MATRIX_HOUSES, MATRIX_DIVISIONALS).

**Status**: RESOLVED — Session 10b inline fix.

### §2.2 — Jupiter Placement Error (Session 18 red-team)

**Error**: UCN v1.0 systematically placed Jupiter in "Cancer 4H (exaltation)" and derived aspects therefrom (Jupiter → 8H, 10H, 12H).

**Truth**: Jupiter is in Sagittarius 9H (own sign). Aspects: 1H (5th), 3H (7th), 5H (9th). Does NOT aspect 4H, 8H, 10H, 12H.

**Resolution**: UCN v1.1 (Session 21) corrected the mother document. AUDIT_REPORT_v1_0 (2026-04-18) and FIX_SESSION_001 (2026-04-18) subsequently corrected residuals in:
- REPORT_CAREER_DHARMA_v1_0 (11 residual Jupiter-4H claims in §5.4, §6.1, §6.3, §6.5, §8.3)
- MSR_v1_0 MSR.014, .019, .034 (invalid Jupiter-5th-aspect-from-9H-onto-10H claims)
- RM_v1_0 — marked SUPERSEDED pending full rebuild (10+ residual Jupiter-from-4H aspect chains)

**Status**: **PARTIALLY RESOLVED → RESOLVED post FIX_SESSION_001 (2026-04-18)**.

**Process-failure note**: The project's own red-team (RED_TEAM_L3 §2.2, Session 24) and cross-report coherence audit (CROSS_REPORT_COHERENCE_AUDIT §6, Session 27) both declared "no residual Jupiter-4H claims" — these were false negatives caught by the independent AUDIT_REPORT_v1_0 (Session 45 equivalent). Future red-teams should use mechanical grep verification over sampled spot-checks.

---

## §3 — OPEN CONTRADICTIONS

### §3.1 — BB Progression Method

**Claim A**: BB progresses 1° per year from natal Libra 8°04' (standard interpretation).

**Claim B**: At age 42, BB reaches Gemini 3H (MSR.404).

**Contradiction**: 1° per year for 42 years = Libra 8°04' + 42° ≈ Sagittarius 20°04', not Gemini.

**Status**: OPEN. The MSR.404 calculation may use a different progression method (e.g., Moon+Rahu progression separately). Flagged for MSR v2.0 methodological clarification. Does not change the substantive finding (BB activation around age 42) but the precise sign of BB's progressed position needs documentation of method.

### §3.2 — D9 7H Architecture vs. D1 7H Architecture

**D1**: 7H Libra has Saturn exalted + Mars + six-layer convergence = chart's supreme yoga density.

**D9**: 7L Venus = Virgo debilitation; primary 7H tenant Saturn = Aries debilitation.

**Contradiction**: D1 maximum relational strength vs. D9 dual debilitations.

**Status**: RESOLVED post AUDIT_REPORT_v1_0 (2026-04-18). Jagannatha Hora external verification CONFIRMS D9 placements: Venus Virgo (debilitated), Saturn Aries (debilitated), Moon Gemini (Mercury's sign). This is NOT A LOGICAL CONTRADICTION but a documented architectural tension. Classical resolution: D1 shows potential; D9 shows what must be built through effort. UCN §IX Contradiction #7 addresses this correctly. GAP.02b/02c/02d are now CONFIRMED-AS-STATED (no Neecha Bhanga via dispositor-in-Kendra detected per v6.0 §3.5.1).

**Prior action (now completed)**: Facts Layer external verification via Jagannatha Hora export (executed in audit). Future Facts Layer v8.0 may add Neecha Bhanga detailed analysis but current state is no longer "open contradiction" — it is "confirmed architectural tension with documented resolution posture."

---

## §4 — ARCHITECTURAL CONTRADICTIONS (UCN §IX Seven Contradictions)

These are NOT errors or open issues; they are chart-architectural features. UCN §IX documents them; UCN v1.1 §IX.2 provides correct-responses for each.

| # | Contradiction | UCN Correct-Response |
|---|---|---|
| 1 | Mercury MD is 6L (disease) AND 10L (career) | Deploy Mercury with boundary discipline |
| 2 | Moon AK in social gains house (11H) | Soul finds itself through purposeful community |
| 3 | 7H Bhavabala weakest, highest yoga density | Tend 7H deliberately with Saturn-discipline |
| 4 | Saturn delivers fortune despite malefic status | Treat pressure as resource |
| 5 | Jupiter 9L own-sign yet "weak" by some readings | Dharmic-alignment before optimization |
| 6 | Aries Lagna yet career in structured Capricorn | Mars-drive serves Saturn-structure |
| 7 | Venus debilitated in D9 yet good D1 dignity | Relationships require dharmic framing |

These contradictions are the chart's curriculum — not problems to solve but pairs-of-truths to hold simultaneously.

---

## §5 — TENSIONS ACROSS DOMAIN REPORTS (NOT CONTRADICTIONS)

Cross-report tensions identified in CROSS_REPORT_COHERENCE_AUDIT (Session 27), corrected post AUDIT_REPORT_v1_0:

**[CORRECTED 2026-04-18 FIX_SESSION_001]**: Prior entry cited "D1.D3=0.88 vs D3.D1=0.91" — this was stale. Current CDLM_v1_0 has both D1.D3=0.91 and D3.D1=0.91 (symmetric). Actual documented asymmetries per audit WS-3a:

- D1↔D2: 0.92 vs 0.88 (Δ 0.04) — Career→Wealth vs Wealth→Career directional mechanism differs
- D1↔D8: 0.91 vs 0.94 (Δ 0.03) — Career↔Mind bidirectional with asymmetric strength
- D2↔D8: 0.86 vs 0.92 (Δ 0.06) — Wealth↔Mind
- D4↔D8: 0.78 vs 0.72 (Δ 0.06) — Health↔Mind
- (23 more pairs with smaller Δ)

**Status**: Acceptable directional asymmetry (row→col vs col→row mechanisms legitimately differ). Flagged for CDLM §0 schema note in future v2.0 to explain scoring convention.

---

*End of CONTRADICTION_REGISTRY_v1_0.md — Session 38 — 2026-04-18 — CLOSED*
