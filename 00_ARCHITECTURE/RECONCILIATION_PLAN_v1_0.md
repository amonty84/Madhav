---
artifact: RECONCILIATION_PLAN_v1_0.md
version: 1.0
status: CLOSED
date: 2026-04-18
scope: "Reconciliation plan for the 41 findings in AUDIT_REPORT_v1_0.md organized as 6 priority fix-sessions. Includes strategy, sequencing, and fix-session execution log."
parent: AUDIT_REPORT_v1_0.md
---

# RECONCILIATION_PLAN_v1_0 — AM-JIS Audit Reconciliation
## Abhisek Mohanty Jyotish Intelligence System
### 2026-04-18 | CLOSED

---

## §1 — STRATEGY

The audit produced 41 findings (13 CRITICAL, 10 HIGH, 12 MEDIUM, 6 LOW). A naive "fix everything now" approach would produce a sprawling single artifact with no clear review boundaries. A strict "daily cadence per finding" would take 41 sessions. The reconciliation strategy prioritizes by **error-severity × downstream-dependency**, grouped into 6 bounded fix-sessions that can be executed sequentially or in parallel across artifacts.

### 1.1 Five reconciliation principles

1. **Correctness before consistency**: Fix factual errors (Jupiter-4H residuals) before harmonizing minor inconsistencies (CDLM asymmetries).
2. **Surgical edits over rewrites**: Change only the lines the audit flags; do not refactor surrounding text. This preserves the report's voice and reviewability of what changed.
3. **Structural supersession where cheaper than rewrite**: For RM_v1_0 (10+ aspect-chain residuals across many element blocks), mark SUPERSEDED rather than rewrite — saves a session of interpretive re-derivation.
4. **Governance artifacts updated last in each priority**: After content is fixed, update the registries (CONTRADICTION_REGISTRY, FALSIFIER_REGISTRY, GOVERNANCE_STACK) to reflect new state.
5. **Audit the auditor's blind spots**: Correct the corpus's own red-team false negatives — do not let the governance layer claim RESOLVED when residuals remain.

### 1.2 Execution mode

Single continuous session executing Priorities 1-6 sequentially. Each priority produces a closed set of file edits. After all six priorities complete, a `FIX_SESSION_001_COMPLETION.md` is written summarizing changes.

### 1.3 What this plan does NOT do

- Re-verify any L1 fact (the audit already passed all L1 formulas)
- Regenerate Jagannatha Hora exports (deferred to Facts Layer v8.0 upgrade)
- Refresh UCN v1.2 (the audit confirmed UCN v1.1 is sound; only downstream artifacts need fixes)
- Add or remove architectural concepts (no new yogas, principles, or frameworks introduced)

---

## §2 — PRIORITY 1: REPORT_CAREER_DHARMA + MSR ASPECT CORRECTIONS

**Scope**: Fixes #1-8, #10 (Career Report) + #14-16 (MSR aspect errors)

**Strategy**: Jupiter's physical placement is Sagittarius 9H (own sign), not Cancer 4H (exaltation). The Career Report was written pre-red-team and cites Jupiter's aspects from 4H as the engine of:
- The §5.4 "Jupiter Authorization" section
- The Saraswati Yoga derivation (§6.1)
- Raja Yoga #1 (§6.3)
- The Modified Dharma-Karma Adhipati Yoga (§6.5)
- Contradiction CTR.03 in §8.3

**Re-derivation principle**: Jupiter in own-sign 9H is architecturally **equivalent-or-stronger** than Jupiter-exalted-in-4H for most of what the Career Report claims:
- **Saraswati Yoga** still forms — Mercury in 10H Kendra + Jupiter in 9H Trikona + Venus in 9H Trikona = classical trikona-kendra pattern, yoga intact with Jupiter's Trikona leg replacing its (hypothetical) Kendra leg
- **Raja Yoga #1** becomes **Bhagya Yoga** / 9L-in-own-house instead of DKA-Kendra-variant — structurally strong, just different yoga name
- **Jupiter-aspect on 10H** does NOT exist from 9H (Jupiter's 7th aspect lands on 3H, not 10H). The 9H→10H relationship is adjacency/trine-kendra, not drishti
- **Wealth-as-dharmic-output** principle (UCN §IV.4) is preserved — Jupiter's 9L-own-sign authorization operates through lordship, not through direct 10H aspect

**MSR aspect errors**: MSR.014, .019, .034 claim "Jupiter's 5th aspect from 9H onto 10H." Jupiter's 5th special aspect from 9H lands on **1H Aries (Lagna)**, not 10H. Correct to either remove the aspect claim or replace with Jupiter's actual aspects (1H via 5th, 3H via 7th, 5H via 9th).

**Files touched**:
- `03_DOMAIN_REPORTS/REPORT_CAREER_DHARMA_v1_0.md` — header + lines 54, 151, 230-238, 262, 280, 298, 300, 392
- `025_HOLISTIC_SYNTHESIS/MSR_v1_0.md` — lines 330, 436, 745

**Deliverable**: Career Report refreshed with corrected Jupiter architecture; parent_UCN_version bumped to UCN_v1_1; explicit Jupiter-correction header added (matching Health/Relationships/Psychology pattern). MSR.014/019/034 supporting_rules corrected.

---

## §3 — PRIORITY 2: GOVERNANCE META-CLAIMS + GAP REGISTER UPDATE

**Scope**: Fixes #11-13, #20, #22

**Strategy**: The corpus's own red-team registers contain false negatives. This governance failure must be corrected explicitly so external reviewers see an honest state. Three artifacts declared "no residual Jupiter-4H claims" — but 24 residuals exist across Career/MSR/RM.

**Files touched**:
- `00_ARCHITECTURE/CONTRADICTION_REGISTRY_v1_0.md` — §2.2 status RESOLVED → PARTIALLY RESOLVED
- `03_DOMAIN_REPORTS/CROSS_REPORT_COHERENCE_AUDIT_v1_0.md` — §6 item 3 corrected
- `03_DOMAIN_REPORTS/RED_TEAM_L3_v1_0.md` — §2.2 amended
- `00_ARCHITECTURE/GOVERNANCE_STACK_v1_0.md` — 5 new gaps added to §3

**5 new gaps to add**:
1. MSR-ASPECT-CORRECTION gap (MSR.014/.019/.034)
2. DUAL-ENGINE Shadbala reconciliation gap
3. BAV-Moon row divergence gap
4. Vimshottari 7d offset gap
5. Saham nakshatra label correction gap

**Deliverable**: Three governance artifacts updated to reflect the actual residual state; 5 new gaps added to GOVERNANCE_STACK §3.

---

## §4 — PRIORITY 3: HEATMAP_VARSHPHAL + LIFETIME_TIMELINE FIXES

**Scope**: Fixes #18-19 (HEATMAP) + #35 (LIFETIME_TIMELINE)

**Strategy**: HEATMAP_VARSHPHAL §2 interpolates Muntha as "Taurus/Gemini approximately" and guesses Varshesha as "Mercury or Saturn." Both violate Architecture §B.11 (no fabricated chart computations). L1 FORENSIC §22 explicitly states Muntha = Libra 7H, Lord = Venus for the current Varsha.

For LIFETIME_TIMELINE §4.4, three bullets are mutually contradictory (1°/year vs 6°/year BB progression). Pick 6°/year consistent with v7.0 §V7.F.

**Files touched**:
- `05_TEMPORAL_ENGINES/HEATMAP_VARSHPHAL_v1_0.md` — lines 38, 41
- `05_TEMPORAL_ENGINES/LIFETIME_TIMELINE_v1_0.md` — §4.4 lines 147-151

**Deliverable**: Muntha/Varshesha replaced with L1 values (per FORENSIC §22) + [EXTERNAL_COMPUTATION_REQUIRED] marker; LIFETIME_TIMELINE BB progression made internally consistent at 6°/year.

---

## §5 — PRIORITY 4: RM_v1_0 SUPERSESSION

**Scope**: Fix #9

**Strategy**: RM_v1_0 has ~10 Jupiter-from-4H aspect chains across multiple element blocks (HSE_1, HSE_4_CANCER, PLN_SUN, PLN_RAHU, PLN_KETU, PLN_MOON, constructive-resonance segments). Full rewrite would require re-deriving every affected element block — approximately 1 full session of interpretive work.

**Decision**: Mark RM_v1_0 as SUPERSEDED via frontmatter + prominent header note. The upstream UCN v1.1 and downstream Domain Reports already operate independently of RM; no active consumer depends on RM's specific aspect-chain claims. Supersession preserves the artifact for reference while flagging it as unreliable for current use. A future RM v1.1 rebuild is scheduled but not blocking.

**Files touched**:
- `025_HOLISTIC_SYNTHESIS/RM_v1_0.md` — frontmatter + opening header

**Deliverable**: RM_v1_0 frontmatter updated to `status: SUPERSEDED`; opening section replaced with a header note explaining the supersession and pointing to UCN v1.1.

---

## §6 — PRIORITY 5: FALSIFIER + CONTRADICTION REGISTRY UPDATES

**Scope**: Fixes #21, #31, #32, #41

**Strategy**: Registries are living documents; they must reflect current state. Four specific updates:
1. FALSIFIER §2.7 BB-UL 2026: status WINDOW OPEN → WINDOW ACTIVE (current date 2026-04-18 is within the 2026-04 to 2026-10 window)
2. FALSIFIER §2.3 Sade Sati Cycle 3: add explicit falsifier maturation date (2049-2052)
3. CONTRADICTION §3.2 D9 7H architecture: status OPEN → RESOLVED (JHora external verification confirmed D9 placements)
4. CONTRADICTION §5: D1.D3/D3.D1 asymmetry entry stale (both are 0.91 now) — update to cite actual asymmetric pair (e.g., D1.D2 vs D2.D1 at 0.92 vs 0.88)

**Files touched**:
- `00_ARCHITECTURE/FALSIFIER_REGISTRY_v1_0.md` — §§2.3, 2.7
- `00_ARCHITECTURE/CONTRADICTION_REGISTRY_v1_0.md` — §3.2, §5

**Deliverable**: Registries reflect current state.

---

## §7 — PRIORITY 6: LOW POLISH

**Scope**: Fixes #24-28, #33-34, #36-40

**Strategy**: Quick surgical fixes:
- Saham Karma / Saham Putra nakshatra labels (FORENSIC v6.0 §12.2 lines 1133, 1136)
- Saham Labha relabel "Cusp" → "Mid-Bhava" (FORENSIC v6.0 §12.2 line 1134)
- MSR.067 draft-note signal_name cleanup
- MSR.090 "Moolatrikona Saturn" misleading label
- MSR.089 Moolatrikona band variance note
- REPORT_RELATIONSHIPS §V.7 Jupiter-4H ambiguity clarification
- BAV-Moon/Vimshottari-offset footnotes (WS-1b documentation)

**Files touched**:
- `01_FACTS_LAYER/FORENSIC_ASTROLOGICAL_DATA_v6.0_ABHISEK_MOHANTY.md` — lines 1133-1136
- `025_HOLISTIC_SYNTHESIS/MSR_v1_0.md` — MSR.067, .089, .090 lines
- `03_DOMAIN_REPORTS/REPORT_RELATIONSHIPS_v1_0.md` — §V.7 line 393

**Deliverable**: Minor label corrections and editorial cleanups.

**Note on citation density** (Fixes #33-34 for REPORT_PARENTS/TRAVEL): These are structural rewrites requiring adding ~40 citations across two reports. Deferred from this fix session to future domain-report refresh cycle (would double this session's scope). Registered in GOVERNANCE_STACK as a deferred action.

---

## §8 — EXECUTION LOG

This section is populated during fix execution.

### 8.1 Priority 1: REPORT_CAREER_DHARMA + MSR
Status: [executed — see FIX_SESSION_001_COMPLETION.md]

### 8.2 Priority 2: Governance meta-claims
Status: [executed]

### 8.3 Priority 3: HEATMAP_VARSHPHAL + LIFETIME_TIMELINE
Status: [executed]

### 8.4 Priority 4: RM_v1_0 supersession
Status: [executed]

### 8.5 Priority 5: Registry updates
Status: [executed]

### 8.6 Priority 6: LOW polish
Status: [executed]

---

## §9 — POST-RECONCILIATION EXPECTED STATE

| Artifact | Pre-fix state | Post-fix state |
|---|---|---|
| REPORT_CAREER_DHARMA_v1_0 | 11 Jupiter-4H residuals; parent UCN_v1_0 | Jupiter corrected; parent UCN_v1_1 |
| MSR_v1_0 (MSR.014/.019/.034) | Claims invalid Jupiter-5th-aspect-onto-10H | Corrected aspect claims |
| HEATMAP_VARSHPHAL_v1_0 §2 | Muntha "Taurus/Gemini approx"; Varshesha guessed | L1 values + [EXTERNAL_COMPUTATION_REQUIRED] |
| LIFETIME_TIMELINE_v1_0 §4.4 | Self-contradictory BB progression | Consistent 6°/year |
| RM_v1_0 | CLOSED with 10+ residual aspect-chain errors | SUPERSEDED w/ header note |
| CONTRADICTION_REGISTRY §2.2 | RESOLVED (false) | PARTIALLY RESOLVED (accurate) |
| CROSS_REPORT_COHERENCE_AUDIT §6 | Claims no residuals (false) | Corrected |
| RED_TEAM_L3 §2.2 | Claims Career uses correct Jupiter (false) | Corrected |
| GOVERNANCE_STACK §3 | 10 known gaps | 15 known gaps (5 added from audit) |
| FALSIFIER_REGISTRY | BB-UL WINDOW OPEN; Cycle 3 undated | WINDOW ACTIVE; Cycle 3 dated 2049-2052 |
| FORENSIC §12.2 Sahams | Karma/Putra labels wrong; Labha relabel | Corrected nakshatra/cusp labels |
| MSR.067/.089/.090 | Draft-note / misleading labels | Cleaned |
| REPORT_RELATIONSHIPS §V.7 | Jupiter-4H ambiguous phrasing | Clarified |

Post-fix, CRITICAL findings drop from 13 to 0; HIGH from 10 to 0-2 (dual-engine Shadbala remains as documented gap); MEDIUM from 12 to 2-3 (deferred citation-density rewrites for Parents/Travel); LOW from 6 to 0-1.

Expected residual audit score: **PASS** (from PASS-WITH-CONDITIONS).

---

*End of RECONCILIATION_PLAN_v1_0.md — 2026-04-18 — CLOSED*
