# MARSYS-JIS Data Model Gap Resolution Plan

> **STATUS — EXECUTED (2026-04-19):** This plan was run to completion in-repo (gap-resolution commits through `GAP_RESOLUTION_SESSION`). **Do not re-execute** wholesale — use **`GOVERNANCE_STACK_v1_0.md`** and **`SESSION_LOG`** for current state. Checkboxes below are **historical** unless you are verifying archaeology.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close all 8 internally-resolvable corpus gaps left after FIX_SESSION_003_deferred, bringing all domain reports, the Remedial Codex, Lifetime Timeline, CGM, and engine-level gap resolutions into alignment with FORENSIC_ASTROLOGICAL_DATA_v8_0.md.

**The 8 gaps addressed:**
1. 5 Domain Reports (Career/Dharma, Psychology/Mind, Children, Parents, Travel) — still at v1.0 with stale v6.0 lagna/saham positions
2. Remedial Codex — still at v1.0; Shree Lagna 9H references + Jupiter-from-4H aspect chain residuals
3. Lifetime Timeline — Varnada+Ghati 8H "hidden pinnacle" concept based on FALSIFIED data
4. CGM v1.0 — special lagna nodes and dependent edges carry stale positions
5. GAP.07 — Shadbala engine divergence: dual-engine footnote exists but no formal policy closure
6. GAP.08/09 — Ashtakavarga Moon row + Vimshottari dasha offset: dual-engine notes not formalized
7. MSR Mode B SIG.16-31 — candidates from Mode B run; absorption/promotion state unclear; 443 signals vs 500-600 target
8. Provenance backfill — MSR.001-420 (v6.0-era cells) carry partial provenance; v8.0 cross-references missing

**Architecture:** Corrections cascade from a single authoritative source (FORENSIC v8.0 §12.1). Every stale reference in L2/L3/L4 documents is a downstream symptom of the seven v6.0 special-lagna/saham position errors. CGM and MSR expansions are additive, not corrective. Engine-level gaps (GAP.07/08/09) require policy decisions documented in FORENSIC v8.0 itself.

**Tech Stack:** Markdown document editing; git commits per task; grep for pre/post verification; FORENSIC_ASTROLOGICAL_DATA_v8_0.md as the canonical correction source.

**Excluded from this plan:**
- Item 9: External acharya review — requires sending ACHARYA_ENGAGEMENT_KIT.md to a senior Jyotish acharya; cannot be executed by Claude.
- Item 10: 6 empirical falsifier tests — time-gated; requires native execution over months. Tracked in MAINTENANCE_SCHEDULE_v1_0.md §6.

---

## Canonical Correction Reference

All corrections in this plan derive from FORENSIC_ASTROLOGICAL_DATA_v8_0.md §12.1 (Special Lagnas) and §12.2 (Sahams):

| Entity | Stale Position (v6.0) | Correct Position (v8.0) | Architectural impact |
|---|---|---|---|
| Hora Lagna | 7H Libra | 3H Gemini | HL-in-7H claims are FALSIFIED |
| Ghati Lagna | 8H Scorpio | 9H Sagittarius | GL-in-8H claims are FALSIFIED |
| Varnada Lagna | 8H Scorpio | 4H Cancer | VL-in-8H claims are FALSIFIED |
| Shree Lagna | 9H Sagittarius | 7H Libra Vishakha | Lakshmi routes through 7H, not 9H |
| Roga Saham | 7H Libra | 2H Taurus (with Rahu) | Health-via-career mechanism changes |
| Mahatmya Saham | 7H Libra (v6.0) | 9H Sagittarius | Mahatmya-in-7H claims are incorrect |
| "Hidden pinnacle" | Varnada+Ghati in 8H | INVALIDATED | Neither is in 8H; concept is false |

---

## Files Modified

Project convention: version bumps create NEW files with version suffix in filename (e.g., `v1_1.md`). The `v1_0.md` file is NOT edited; instead its status field is updated to SUPERSEDED. See REPORT_HEALTH_LONGEVITY_v1_1.md as the established pattern.

| New File | Created From | Task |
|---|---|---|
| `03_DOMAIN_REPORTS/REPORT_CAREER_DHARMA_v1_1.md` | Copy of v1_0 + corrections | A1 |
| `03_DOMAIN_REPORTS/REPORT_TRAVEL_v1_1.md` | Copy of v1_0 + corrections | A2 |
| `03_DOMAIN_REPORTS/REPORT_PSYCHOLOGY_MIND_v1_1.md` | Copy of v1_0 + corrections | A3 |
| `03_DOMAIN_REPORTS/REPORT_CHILDREN_v1_1.md` | Copy of v1_0 + corrections | A4 |
| `03_DOMAIN_REPORTS/REPORT_PARENTS_v1_1.md` | Copy of v1_0 + corrections | A5 |
| `04_REMEDIAL_CODEX/REMEDIAL_CODEX_v2_0_PART1.md` | Copy of v1_0_PART1 + corrections | B1 |
| `04_REMEDIAL_CODEX/REMEDIAL_CODEX_v2_0_PART2.md` | Copy of v1_0_PART2 + corrections | B1 |
| `05_TEMPORAL_ENGINES/LIFETIME_TIMELINE_v1_0.md` | Edit in-place (minor correction) | B2 |
| `01_FACTS_LAYER/FORENSIC_ASTROLOGICAL_DATA_v8_0.md` | Edit in-place (resolve gap comments) | C1+C2 |
| `025_HOLISTIC_SYNTHESIS/CGM_v2_0.md` | Copy of CGM_v1_0 + corrections | D1+D2 |
| `025_HOLISTIC_SYNTHESIS/MSR_v2_0.md` | Edit in-place (add promoted signals) | E1 |
| `00_ARCHITECTURE/GOVERNANCE_STACK_v1_0.md` | Edit in-place | G1 |
| `00_ARCHITECTURE/SESSION_LOG.md` | Edit in-place (append) | G2 |

**For all new v1_1 / v2_0 files:** Also edit the corresponding v1_0 file's `status:` field from `CURRENT` → `SUPERSEDED`.

---

## Phase A — Domain Report Updates (5 Reports → v1.1)

These tasks are independent of each other and can be executed in parallel.

### Task A1: REPORT_CAREER_DHARMA → v1.1

**Files:**
- Create: `03_DOMAIN_REPORTS/REPORT_CAREER_DHARMA_v1_1.md` (copy of v1_0 with corrections)
- Modify status: `03_DOMAIN_REPORTS/REPORT_CAREER_DHARMA_v1_0.md` → set `status: SUPERSEDED`

**Known stale references (from pre-plan audit):**

| Line | Stale content | Correction |
|---|---|---|
| 16 | `MSR_v1_0.md` citation | Update to `MSR_v2_0.md` |
| 152 | "Lakshmi Yoga signature (Shree Lagna in 9H, Venus 2L in 9H)" | Shree Lagna → 7H Libra Vishakha; Venus 2L remains in 9H; mechanism changes |
| 184 | "Saham Roga in 7H = health cost of professional peak" | Roga Saham → 2H Taurus; mechanism: Rahu 2H co-tenancy with Roga; revise narrative |
| 271 | Full paragraph: "Shree Lagna (SL) falls in Sagittarius 9H…SL = 9H + Venus 2L in 9H" | Full rewrite: SL = 7H Libra Vishakha; Lakshmi routes through partnership domain, not dharma domain |
| 526 | "dharmic wealth pathway (Shree Lagna in 9H, Venus 2L in 9H)" | SL now 7H; pathway is relational-dharmic (7H + 9H Venus), not purely dharmic |
| 568 | "Varnada Lagna + Ghati Lagna both in Scorpio 8H (Ketu's house). This means the chart's most genuine authority…arrives during Ketu MD." | MAJOR: concept based on FALSIFIED data. Replace: Ghati Lagna 9H Sagittarius (authority via dharmic mastery, Jupiter's sign); Varnada Lagna 4H Cancer (fulfillment via emotional/domestic depth). Ketu MD still carries transformation depth via Ketu exalted 8H, but not via Varnada+Ghati. |
| 777 | "SL = 9H in this chart" (glossary entry) | Update: SL = 7H Libra Vishakha |

- [ ] **Step 1: Copy v1_0 → v1_1 and read**

```bash
cp /Users/Dev/Vibe-Coding/Apps/Madhav/03_DOMAIN_REPORTS/REPORT_CAREER_DHARMA_v1_0.md \
   /Users/Dev/Vibe-Coding/Apps/Madhav/03_DOMAIN_REPORTS/REPORT_CAREER_DHARMA_v1_1.md
```
Then read the new file to confirm it's a clean copy.

- [ ] **Step 2: Verify stale references are present in v1_1.md**

```bash
grep -n "Shree Lagna\|Roga.*7H\|Varnada.*8H\|Ghati.*8H\|MSR_v1_0\|SL.*9H\|9H.*SL" \
  /Users/Dev/Vibe-Coding/Apps/Madhav/03_DOMAIN_REPORTS/REPORT_CAREER_DHARMA_v1_1.md
```
Expected: 6-8 matches at the lines listed above.

- [ ] **Step 3: Apply corrections**

Apply each correction listed in the table above. For line 568 (hidden pinnacle), write:

> **The Ketu MD architecture (revised per v8.0):** Ghati Lagna falls in Sagittarius 9H (Jupiter's sign, the dharma house) — genuine authority in Ketu MD arrives via mastery of dharmic wisdom, teaching, and principled guidance, not via 8H hidden-depth activation. Varnada Lagna falls in Cancer 4H (Moon's own sign, emotional foundations) — the fulfillment dimension of Ketu MD operates through emotional depth, domestic rootedness, and ancestral healing. Ketu itself remains exalted in Scorpio 8H, so 8H transformation, renunciation, and depth of inquiry ARE activated in Ketu MD — but via Ketu's own 8H placement, not via Varnada+Ghati (which were incorrectly placed in 8H in v6.0). The Ketu MD remains the chart's transformation arc; the lagna-based framing of that arc is corrected.

- [ ] **Step 4: Update frontmatter**

Change `version: 1.0` → `version: 1.1` and add changelog entry:

```yaml
changelog:
  - version: 1.1
    date: 2026-04-19
    session: GAP_RESOLUTION_SESSION
    changes:
      - "Line 152: Shree Lagna corrected 9H→7H Libra Vishakha in Lakshmi Yoga description"
      - "Line 184: Roga Saham corrected 7H→2H Taurus; health mechanism revised"
      - "Line 271: §Shree Lagna paragraph fully rewritten; SL=7H not 9H; Lakshmi-Through-Relationship architecture"
      - "Line 526: Dharmic wealth pathway revised; SL 7H framing"
      - "Line 568: Hidden-pinnacle concept replaced; Varnada+Ghati were NOT in 8H (FALSIFIED per v8.0); correct positions Ghati 9H Sagittarius + Varnada 4H Cancer; Ketu-MD framing preserved via Ketu-8H"
      - "Line 777: Glossary SL entry corrected 9H→7H"
      - "MSR citation updated v1_0→v2_0"
      - "Sources: FORENSIC_v8_0 §12.1; RM_v2_0 RM.20 (Shree Lagna); RM.21A (Ghati); RM.21B (Varnada)"
```

- [ ] **Step 5: Mark v1_0 as SUPERSEDED**

Edit `REPORT_CAREER_DHARMA_v1_0.md` — change only the `status:` field → `SUPERSEDED`.

- [ ] **Step 6: Verify no stale references remain in v1_1.md**

```bash
grep -n "Shree Lagna.*9H\|SL.*9H\|9H.*Shree\|Roga.*7H\|Varnada.*8H\|Ghati.*8H\|hidden.pinnacle.*8H" \
  /Users/Dev/Vibe-Coding/Apps/Madhav/03_DOMAIN_REPORTS/REPORT_CAREER_DHARMA_v1_1.md
```
Expected: 0 matches (all corrected).

- [ ] **Step 7: Commit**

```bash
git add 03_DOMAIN_REPORTS/REPORT_CAREER_DHARMA_v1_1.md \
        03_DOMAIN_REPORTS/REPORT_CAREER_DHARMA_v1_0.md
git commit -m "fix(am-jis): REPORT_CAREER_DHARMA v1.1 — v8.0 lagna/saham corrections

- Shree Lagna corrected 9H→7H Libra throughout (3 sites)
- Roga Saham corrected 7H→2H Taurus (1 site)
- Hidden-pinnacle concept replaced: Varnada+Ghati NOT in 8H (FALSIFIED)
  Ghati→9H Sagittarius, Varnada→4H Cancer; Ketu MD framing preserved via Ketu-8H
- MSR citation updated v1_0→v2_0
Sources: FORENSIC_v8_0 §12.1; RM_v2_0 RM.20/21A/21B"
```

---

### Task A2: REPORT_TRAVEL → v1.1

**Files:**
- Create: `03_DOMAIN_REPORTS/REPORT_TRAVEL_v1_1.md` (copy of v1_0 + corrections)
- Modify status: `03_DOMAIN_REPORTS/REPORT_TRAVEL_v1_0.md` → SUPERSEDED

**Known stale references:**

| Line | Stale | Correction |
|---|---|---|
| 58 | "Shree Lagna in 9H" | Shree Lagna in 7H Libra Vishakha |
| 131 | "Shree Lagna in 9H Sagittarius \| FORENSIC §12.1" | 7H Libra Vishakha; source: FORENSIC §12.1 v8.0 |

- [ ] **Step 1: Audit for all stale references**

```bash
grep -n "Shree\|Hora\|Ghati\|Varnada\|Roga\|Mahatmya\|8H.*lagna\|lagna.*8H" \
  /Users/Dev/Vibe-Coding/Apps/Madhav/03_DOMAIN_REPORTS/REPORT_TRAVEL_v1_0.md
```

- [ ] **Step 2: Apply corrections** at lines 58 and 131 (and any additional found in Step 1).

For line 131 narrative impact — if the Travel report's 9H emphasis was partly about Shree Lagna activating travel-through-dharma: note that the 9th house remains the primary travel-dharma house (Jupiter+Venus in 9H) but Shree Lagna's route is through 7H (foreign partnerships, collaborative travel rather than pilgrimage-dharma). Update the narrative accordingly.

- [ ] **Step 3: Update frontmatter** to v1.1 with changelog.

- [ ] **Step 4: Verify**

```bash
grep -n "Shree.*9H\|9H.*Shree\|Varnada.*8H\|Ghati.*8H" \
  /Users/Dev/Vibe-Coding/Apps/Madhav/03_DOMAIN_REPORTS/REPORT_TRAVEL_v1_0.md
```
Expected: 0 matches.

- [ ] **Step 5: Commit**

```bash
git add 03_DOMAIN_REPORTS/REPORT_TRAVEL_v1_0.md
git commit -m "fix(am-jis): REPORT_TRAVEL v1.1 — Shree Lagna corrected 9H→7H"
```

---

### Task A3: REPORT_PSYCHOLOGY_MIND → v1.1

**Files:**
- Create: `03_DOMAIN_REPORTS/REPORT_PSYCHOLOGY_MIND_v1_1.md` (copy of v1_0 + corrections)
- Modify status: `03_DOMAIN_REPORTS/REPORT_PSYCHOLOGY_MIND_v1_0.md` → SUPERSEDED

**Context:** Pre-plan audit found no stale special-lagna position references. The main update is resolving GAP.02 (D9 Jupiter) which is now confirmed as Gemini.

- [ ] **Step 1: Audit broadly**

```bash
grep -n "Shree\|Hora\|Ghati\|Varnada\|Roga\|Mahatmya\|GAP\.02\|GAP\.0[0-9]\|pending\|unverified\|Jagannatha\|awaiting" \
  /Users/Dev/Vibe-Coding/Apps/Madhav/03_DOMAIN_REPORTS/REPORT_PSYCHOLOGY_MIND_v1_0.md
```

- [ ] **Step 2: Resolve GAP.02 references**

Find any lines that say "GAP.02 — D9 Jupiter placement: pending verification" or similar. Update to: "GAP.02 — RESOLVED 2026-04-18: D9 Jupiter confirmed in Gemini (Mercury's sign) per JHora v8.0 export. See FORENSIC_v8_0 §3.4. The Mercury-Jupiter D9 mutual connection is now L1-confirmed."

Also update D9 Moon in Gemini (GAP.02d) to confirmed status if referenced.

- [ ] **Step 3: Check for any SIG.16-31 references that need updating**

```bash
grep -n "SIG\.1[6-9]\|SIG\.2[0-9]\|SIG\.3[01]\|candidate\|tentative" \
  /Users/Dev/Vibe-Coding/Apps/Madhav/03_DOMAIN_REPORTS/REPORT_PSYCHOLOGY_MIND_v1_0.md
```

- [ ] **Step 4: Update frontmatter** to v1.1.

- [ ] **Step 5: Commit**

```bash
git add 03_DOMAIN_REPORTS/REPORT_PSYCHOLOGY_MIND_v1_0.md
git commit -m "fix(am-jis): REPORT_PSYCHOLOGY_MIND v1.1 — GAP.02 resolved, D9 Jupiter confirmed Gemini"
```

---

### Task A4: REPORT_CHILDREN → v1.1

**Files:**
- Create: `03_DOMAIN_REPORTS/REPORT_CHILDREN_v1_1.md` (copy of v1_0 + corrections)
- Modify status: `03_DOMAIN_REPORTS/REPORT_CHILDREN_v1_0.md` → SUPERSEDED

**Context:** Pre-plan audit found one stale GAP reference: GAP.05 (D7 not examined). GAP.05 is now substantially resolved per AUDIT_REPORT_v1_0 WS-1b.

- [ ] **Step 1: Audit for stale references**

```bash
grep -n "GAP\.05\|GAP\.\|pending\|unverified\|D7.*not\|Shree\|Ghati\|Varnada\|Hora\|Roga\|Mahatmya" \
  /Users/Dev/Vibe-Coding/Apps/Madhav/03_DOMAIN_REPORTS/REPORT_CHILDREN_v1_0.md
```

- [ ] **Step 2: Update GAP.05 status**

Find: "GAP.05 (NEW): D7 (Saptamsha, children divisional chart) not examined…Requires Jagannatha Hora export."
Replace with: "GAP.05 — SUBSTANTIALLY RESOLVED 2026-04-18: JHora D7 present per AUDIT_REPORT_v1_0 WS-1b; confirms D7 chart matches FORENSIC §3.4 structural reads. Precise degree comparison of all D7 positions is still pending for complete confirmation, but structural D1-based domain claims are corroborated."

- [ ] **Step 3: Update frontmatter** to v1.1.

- [ ] **Step 4: Commit**

```bash
git add 03_DOMAIN_REPORTS/REPORT_CHILDREN_v1_0.md
git commit -m "fix(am-jis): REPORT_CHILDREN v1.1 — GAP.05 substantially resolved per JHora D7 WS-1b"
```

---

### Task A5: REPORT_PARENTS → v1.1 (Audit + Minor Update)

**Files:**
- Create: `03_DOMAIN_REPORTS/REPORT_PARENTS_v1_1.md` (copy of v1_0 + corrections)
- Modify status: `03_DOMAIN_REPORTS/REPORT_PARENTS_v1_0.md` → SUPERSEDED

**Context:** Pre-plan audit found no stale special-lagna or saham references. But the report was not checked against v8.0 yogas or gap resolutions. This task does a complete audit and creates v1.1 even if minimal changes result.

- [ ] **Step 1: Comprehensive audit**

```bash
grep -n "Shree\|Hora\|Ghati\|Varnada\|Roga\|Mahatmya\|GAP\.\|pending\|MSR_v1\|v6\.0.*§12\|candidate\|tentative\|unverified" \
  /Users/Dev/Vibe-Coding/Apps/Madhav/03_DOMAIN_REPORTS/REPORT_PARENTS_v1_0.md
```

- [ ] **Step 2: Apply any corrections found.** If zero stale references exist, the v1.1 bump still documents that this report was reviewed against v8.0 and confirmed clean.

- [ ] **Step 3: Update frontmatter** to v1.1 with changelog noting "Reviewed against FORENSIC_v8_0; no special-lagna position corrections required."

- [ ] **Step 4: Commit**

```bash
git add 03_DOMAIN_REPORTS/REPORT_PARENTS_v1_0.md
git commit -m "fix(am-jis): REPORT_PARENTS v1.1 — v8.0 review pass; [corrections or confirmed-clean]"
```

---

## Phase B — Remedial Codex and Lifetime Timeline

### Task B1: Remedial Codex → v2.0

**Files:**
- Modify: `04_REMEDIAL_CODEX/REMEDIAL_CODEX_v1_0_PART1.md`
- Modify: `04_REMEDIAL_CODEX/REMEDIAL_CODEX_v1_0_PART2.md`

**Context:** Remedial Codex was marked SUPERSEDED since FIX_SESSION_001 due to Jupiter-from-4H aspect chain errors (10+ residual chains). FIX_SESSION_003 also invalidated Shree Lagna 9H references which affect the Shree Sukta rationale.

**Known stale references:**
- PART1 line 62: "The Shree Lagna in 9H is activated directly by Shree Sukta practice."
- PART2 line 24: "Shree Lagna in 9H + Venus (Ishta Devata Mahalakshmi) 9H + Lakshmi-Narayana-adjacent configuration = Shree Yantra…"

- [ ] **Step 1: Full audit of both parts**

```bash
grep -n "Shree.*9H\|9H.*Shree\|Ghati.*8H\|Varnada.*8H\|Roga.*7H\|Jupiter.*4H\|4H.*Jupiter\|Jupiter.*Cancer\|exalted.*Cancer\|Cancer.*exalted" \
  /Users/Dev/Vibe-Coding/Apps/Madhav/04_REMEDIAL_CODEX/REMEDIAL_CODEX_v1_0_PART1.md \
  /Users/Dev/Vibe-Coding/Apps/Madhav/04_REMEDIAL_CODEX/REMEDIAL_CODEX_v1_0_PART2.md
```

- [ ] **Step 2: Apply Shree Lagna corrections**

PART1 line 62: Update rationale. Shree Lagna 7H Libra means Shree Sukta activates wealth-through-relationship (7H), not wealth-through-dharma (9H). Venus remains in 9H — the practice still connects to Venus/Mahalakshmi but via the 7H architectural route (Shree Lagna 7H Vishakha = Venus-ruled nakshatra, maintaining the Lakshmi connection while correcting the house).

PART2 line 24: Update Shree Yantra rationale. Shree Lagna in 7H + Venus (2L) in 9H = the Shree Yantra remains architecturally aligned (Lakshmi principle), but the corrected reading is: Lakshmi enters via the relational house (7H), and Venus serves as the bridge from dharma (9H) to the relational portal. The Shree Yantra recommendation stands; the architectural explanation is refined.

- [ ] **Step 3: Address Jupiter-from-4H residuals**

```bash
grep -n "Jupiter.*4H\|4H.*aspect\|Jupiter.*aspect.*10H\|Jupiter.*10H" \
  /Users/Dev/Vibe-Coding/Apps/Madhav/04_REMEDIAL_CODEX/REMEDIAL_CODEX_v1_0_PART1.md \
  /Users/Dev/Vibe-Coding/Apps/Madhav/04_REMEDIAL_CODEX/REMEDIAL_CODEX_v1_0_PART2.md
```

For each residual Jupiter-from-4H reference: replace with Jupiter-from-9H (correct placement). Jupiter aspects from 9H: 5th aspect → 1H (Lagna), 7th aspect → 3H, 9th aspect → 5H.

- [ ] **Step 4: Update both files to v2.0 status**

In PART1 frontmatter: `version: 2.0`, `status: CURRENT`
In PART2 frontmatter: `version: 2.0`, `status: CURRENT`

Add changelog entries documenting: Shree Lagna corrections (9H→7H), Jupiter placement corrections (4H→9H), aspect chain corrections.

- [ ] **Step 5: Verify**

```bash
grep -n "Shree.*9H\|9H.*Shree\|Jupiter.*4H\|Jupiter.*Cancer\|Ghati.*8H\|Varnada.*8H" \
  /Users/Dev/Vibe-Coding/Apps/Madhav/04_REMEDIAL_CODEX/REMEDIAL_CODEX_v1_0_PART1.md \
  /Users/Dev/Vibe-Coding/Apps/Madhav/04_REMEDIAL_CODEX/REMEDIAL_CODEX_v1_0_PART2.md
```
Expected: 0 matches.

- [ ] **Step 6: Commit**

```bash
git add 04_REMEDIAL_CODEX/REMEDIAL_CODEX_v1_0_PART1.md \
        04_REMEDIAL_CODEX/REMEDIAL_CODEX_v1_0_PART2.md
git commit -m "fix(am-jis): Remedial Codex v2.0 — v8.0 reconciliation

- Shree Lagna corrected 9H→7H in Shree Sukta and Shree Yantra rationale
- Jupiter placement corrected 4H→9H; aspect chains corrected (10H aspects removed)
- Status: CURRENT (supersedes v1.0 PART1/PART2 which were marked SUPERSEDED since FIX_SESSION_001)"
```

---

### Task B2: Lifetime Timeline Update

**Files:**
- Modify: `05_TEMPORAL_ENGINES/LIFETIME_TIMELINE_v1_0.md`

**Known stale references:**
- Line 70: "Ketu exalted in 8H + Varnada+Ghati Lagnas in Scorpio 8H = the chart's deepest authentic authority manifests during Ketu MD."
- Line 164: "Phase 4 (Ketu MD) | 2031-2038 | Transformation; offer-not-own orientation; 8H depth activation" — the "8H depth activation" framing needs nuance (Ketu IS in 8H, but Varnada+Ghati are not).

- [ ] **Step 1: Audit**

```bash
grep -n "Varnada\|Ghati\|Shree.*9H\|Hora.*7H\|Roga.*7H\|hidden.pinnacle\|8H.*lagna\|lagna.*8H" \
  /Users/Dev/Vibe-Coding/Apps/Madhav/05_TEMPORAL_ENGINES/LIFETIME_TIMELINE_v1_0.md
```

- [ ] **Step 2: Correct line 70**

Replace: "Ketu exalted in 8H + Varnada+Ghati Lagnas in Scorpio 8H = the chart's deepest authentic authority manifests during Ketu MD."

With: "Ketu exalted in Scorpio 8H = Ketu MD activates 8H transformation depth, renunciation, and occult inquiry. Varnada Lagna (4H Cancer) and Ghati Lagna (9H Sagittarius) are NOT in 8H — the v6.0 'hidden pinnacle' framing was based on incorrect positions. The corrected architecture: Ghati 9H = Ketu MD activates authority through dharmic mastery and teaching; Varnada 4H = fulfillment arrives through emotional depth and domestic/ancestral grounding. The transformation character of Ketu MD is preserved via Ketu's own 8H exaltation."

- [ ] **Step 3: Correct line 164 phase description** — "8H depth activation" is accurate for Ketu-exalted-8H; add note that special lagna framing has been corrected.

- [ ] **Step 4: Check Varshphal Heatmap** for the same pattern (since Varshphal received only a Muntha correction):

```bash
grep -n "Varnada\|Ghati\|Shree.*9H\|hidden.pinnacle" \
  /Users/Dev/Vibe-Coding/Apps/Madhav/05_TEMPORAL_ENGINES/HEATMAP_VARSHPHAL_v1_0.md
```
Apply any corrections found.

- [ ] **Step 5: Update frontmatter** with version note and changelog.

- [ ] **Step 6: Commit**

```bash
git add 05_TEMPORAL_ENGINES/LIFETIME_TIMELINE_v1_0.md \
        05_TEMPORAL_ENGINES/HEATMAP_VARSHPHAL_v1_0.md
git commit -m "fix(am-jis): Lifetime Timeline + Varshphal — Varnada/Ghati hidden-pinnacle correction

- Line 70: 'Varnada+Ghati in 8H' concept replaced with corrected positions (4H/9H)
- Ketu MD architecture preserved via Ketu-8H exaltation; lagna framing corrected
- Varshphal: any Varnada/Ghati/Shree 9H references updated"
```

---

## Phase C — Engine-Level Gap Resolutions (GAP.07, GAP.08, GAP.09)

These three gaps live inside FORENSIC_ASTROLOGICAL_DATA_v8_0.md. The dual-engine comment blocks already exist. This task upgrades them from "open dual-engine footnotes" to "resolved policy statements."

### Task C1: GAP.07 — Shadbala Engine Divergence Resolution

**File:**
- Modify: `01_FACTS_LAYER/FORENSIC_ASTROLOGICAL_DATA_v8_0.md` (§6.2)

**Context:** FORENSIC ranks Sun #1 (8.51 rupas); JH ranks Saturn #1 (8.79 rupas). The dual-engine comment at §6.2 exists but a policy has not been formally adopted.

**Policy decision to encode:** JH is authoritative for Shadbala ranking (as stated in the FORENSIC v8.0 frontmatter engines line). Therefore: Saturn is the chart's #1 Shadbala planet. Sun is #2. Downstream narratives that rely on "Sun = strongest planet" need a footnote that this is FORENSIC-engine-only; JH-canonical ranking places Saturn #1.

- [ ] **Step 1: Read §6.2 dual-engine comment**

```bash
grep -n -A5 "GAP.07\|Shadbala.*DUAL\|DUAL.*Shadbala\|Saturn.*#1\|Sun.*#1" \
  /Users/Dev/Vibe-Coding/Apps/Madhav/01_FACTS_LAYER/FORENSIC_ASTROLOGICAL_DATA_v8_0.md
```

- [ ] **Step 2: Upgrade dual-engine comment to resolved policy**

Locate the `<!-- [DUAL-ENGINE NOTE...GAP.07...] -->` comment block at §6.2. Replace with inline documentation (not a comment — this is the resolution, not a pending note):

```
**RESOLVED (GAP.07):** JH is the authoritative engine for Shadbala ranking per project discipline (FORENSIC_v8_0 frontmatter). 
Canonical ranking: Saturn #1 (8.79 rupas JH), Sun #2 (8.18 rupas JH). 
FORENSIC engine is retained in the table for reference but is not authoritative for rank claims.
Downstream domain reports should cite "JH Shadbala: Saturn #1" when rank-dependent claims arise.
```

- [ ] **Step 3: Scan domain reports for "Sun #1" Shadbala claims**

```bash
grep -rn "Shadbala.*Sun.*#1\|Sun.*Shadbala.*#1\|Sun.*strongest.*Shadbala\|Shadbala.*strongest.*Sun" \
  /Users/Dev/Vibe-Coding/Apps/Madhav/03_DOMAIN_REPORTS/
```
For each hit: add footnote citing GAP.07 resolution. Do not change the narrative if it is valid (e.g., "Sun is exalted-dignity-strong" ≠ "Sun is Shadbala #1").

- [ ] **Step 4: Update GOVERNANCE_STACK GAP.07 status** → RESOLVED (in Task G1).

- [ ] **Step 5: Commit**

```bash
git add 01_FACTS_LAYER/FORENSIC_ASTROLOGICAL_DATA_v8_0.md
git commit -m "fix(am-jis): close GAP.07 — Shadbala engine divergence resolved

Adopt JH as canonical: Saturn #1 (8.79r), Sun #2 (8.18r)
FORENSIC engine retained in table for reference only"
```

---

### Task C2: GAP.08 and GAP.09 — Finalization

**File:**
- Modify: `01_FACTS_LAYER/FORENSIC_ASTROLOGICAL_DATA_v8_0.md` (§7.1 for GAP.08; §5.1 for GAP.09)

**GAP.08 (Ashtakavarga Moon row):** FORENSIC and JH differ in 4 signs. Policy already stated in v8.0 comment: "Domain Reports cite FORENSIC BAV/SAV values." This is a resolved policy — it just needs to be made explicit and the gap closed.

**GAP.09 (Vimshottari dasha date offsets):** FORENSIC dates are +7 to +9 days later than JH, rooted in 1.4 arcmin Moon difference. Policy: retrodictive fit uses FORENSIC dates. This needs to be formally documented and the gap closed.

- [ ] **Step 1: Read the dual-engine comment blocks**

```bash
grep -n -A8 "GAP\.08\|GAP\.09\|BAV.*Moon.*DUAL\|Vimshottari.*offset\|dasha.*offset" \
  /Users/Dev/Vibe-Coding/Apps/Madhav/01_FACTS_LAYER/FORENSIC_ASTROLOGICAL_DATA_v8_0.md
```

- [ ] **Step 2: Close GAP.08**

Replace `<!-- GAP.08 ... -->` comment with inline resolved text:

```
**RESOLVED (GAP.08):** Moon BAV row differs in 4 signs between FORENSIC and JH engines (Gemini, Libra, Scorpio, Capricorn — ±1 bindu each; grand total 337 matches). Policy adopted: FORENSIC BAV/SAV values are used throughout MARSYS-JIS domain reports; JH values are listed in the table as reference row (AVG.BAV.MOON.JH). Rank-dependent claims are unaffected as ±1 differences cancel in aggregate.
```

- [ ] **Step 3: Close GAP.09**

Find the GAP.09 comment in §5.1 (Vimshottari dasha dates). Replace with:

```
**RESOLVED (GAP.09):** Vimshottari dasha dates offset +7 to +9 days between FORENSIC (later) and JH engines, rooted in 1.4 arcmin Moon longitude difference at birth. Policy adopted: FORENSIC dates are used for retrodictive fit throughout MARSYS-JIS (LEL events were matched against FORENSIC dates in Sessions 16-25 and confirmed). JH dates are NOT used for dasha period boundaries. Note: the ±7-9 day window is within the "dasha cusp zone" and does not affect life-arc interpretations; only precise-date claims within a 10-day window of period transitions are affected.
```

- [ ] **Step 4: Commit**

```bash
git add 01_FACTS_LAYER/FORENSIC_ASTROLOGICAL_DATA_v8_0.md
git commit -m "fix(am-jis): close GAP.08 + GAP.09 — BAV Moon and dasha date policies formalized

GAP.08: FORENSIC BAV/SAV canonical; JH Moon row retained as reference
GAP.09: FORENSIC dasha dates canonical for retrodictive fit; ±7-9d offset documented"
```

---

## Phase D — CGM v2.0 Rebuild

The CGM is the foundational graph that feeds MSR, CDLM, and RM. CGM v1.0 sourced from v6.0 facts and has stale node positions for 4 special lagnas. This task creates CGM v2.0 with corrected positions.

**Note:** The CGM is a large document (847 edges). A full edge-by-edge rebuild would be a multi-session project. This task: (1) corrects all special lagna NODES, (2) identifies and corrects directly dependent EDGES, (3) flags any edges needing deeper structural review, and (4) updates the source layer citation. A complete edge audit is scoped as Phase D2.

### Task D1: CGM v2.0 — Node Corrections

**Files:**
- Create: `025_HOLISTIC_SYNTHESIS/CGM_v2_0.md` (copy of v1.0 with corrections applied)

**Specific node corrections required:**

| Node ID | Old position | New position | Impact |
|---|---|---|---|
| `LAG.HORA` | 7H Libra | 3H Gemini | Dispositor changes: 7H lord Venus → 3H lord Mercury |
| `LAG.GHATI` | 8H Scorpio 06°53' | 9H Sagittarius | 8H lord Mars+Ketu → 9H lord Jupiter |
| `LAG.VARNADA` | 8H Scorpio | 4H Cancer | 8H lord → 4H lord Moon |
| `LAG.SHREE` | 9H Sagittarius | 7H Libra Vishakha | 9H lord Jupiter → 7H lord Venus; Vishakha nakshatra (Jupiter-ruled) |

Additionally:
- `YOG.RAHU_JAIMINI_QUADRUPLE` (SIG.16 candidate): Status "Proposed" → promote if validated (see Task E1)
- `YOG.TRIPLE_EXALTED_NODAL` (SIG.23 candidate): Status "Proposed" → promote if validated
- `YOG.HIDDEN_PINNACLE_8H`: If this node exists — INVALIDATE and remove. Replace with `YOG.GHATI_9H_DHARMA_AUTHORITY` and `YOG.VARNADA_4H_EMOTIONAL_FULFILLMENT`.

- [ ] **Step 1: Copy CGM v1.0 to v2.0**

```bash
cp /Users/Dev/Vibe-Coding/Apps/Madhav/025_HOLISTIC_SYNTHESIS/CGM_v1_0.md \
   /Users/Dev/Vibe-Coding/Apps/Madhav/025_HOLISTIC_SYNTHESIS/CGM_v2_0.md
```

- [ ] **Step 2: Update frontmatter in CGM_v2_0.md**

```yaml
artifact_id: CGM_v2_0
version: 2.0
status: CURRENT
session: GAP_RESOLUTION_SESSION
source_layer: L1 Facts (v8.0 CURRENT), L2 Mode A (Deep Analysis v1.2.1), L2 Mode B (5 matrices Sessions 7-10)
```
Mark CGM_v1_0 as SUPERSEDED.

- [ ] **Step 3: Correct the four lagna node entries**

For each of the 4 stale nodes:
- Update house assignment
- Update sign assignment
- Update nakshatra if applicable (Ghati: now in Sagittarius; Shree: Vishakha)
- Update dispositor (the planet ruling the new sign)
- Update any "notes" field that referenced old position

- [ ] **Step 4: Check for "hidden pinnacle" yoga node**

```bash
grep -n "HIDDEN\|pinnacle\|8H.*yoga\|yoga.*8H" \
  /Users/Dev/Vibe-Coding/Apps/Madhav/025_HOLISTIC_SYNTHESIS/CGM_v2_0.md
```
If found: invalidate and add two replacement nodes per table above.

- [ ] **Step 5: Update special lagnas subgraph section**

Find the section listing LAG.* nodes and update the "Special Lagnas" row in the master node count table. Update LAG positions in any subgraph views.

- [ ] **Step 6: Commit node corrections**

```bash
git add 025_HOLISTIC_SYNTHESIS/CGM_v2_0.md
git commit -m "feat(am-jis): CGM v2.0 — node corrections for 4 special lagnas

LAG.HORA: 7H Libra → 3H Gemini
LAG.GHATI: 8H Scorpio → 9H Sagittarius  
LAG.VARNADA: 8H Scorpio → 4H Cancer
LAG.SHREE: 9H Sagittarius → 7H Libra Vishakha
Source: FORENSIC_v8_0 §12.1; replaces CGM_v1_0 (SUPERSEDED)"
```

---

### Task D2: CGM v2.0 — Edge Corrections

**File:**
- Modify: `025_HOLISTIC_SYNTHESIS/CGM_v2_0.md`

**Context:** With 4 lagna nodes repositioned, edges involving those nodes have stale source-house or target-house references. The most impactful changes:

1. `LAG.HORA → HSE.7` edge: REMOVE (Hora Lagna is no longer in 7H)
   Add: `LAG.HORA → HSE.3` (Hora Lagna now in 3H Gemini)

2. `LAG.GHATI → HSE.8` edge: REMOVE (Ghati Lagna is no longer in 8H)
   Add: `LAG.GHATI → HSE.9` (Ghati Lagna now in 9H Sagittarius); also add dispositor edge `LAG.GHATI → PLN.JUPITER` (Jupiter rules 9H Sagittarius)

3. `LAG.VARNADA → HSE.8` edge: REMOVE
   Add: `LAG.VARNADA → HSE.4` (Varnada now in 4H Cancer); dispositor → Moon

4. `LAG.SHREE → HSE.9` edge: REMOVE
   Add: `LAG.SHREE → HSE.7` (Shree Lagna now in 7H Libra); dispositor → Venus; nakshatra edge → Vishakha → PLN.JUPITER (Vishakha is Jupiter-ruled)

- [ ] **Step 1: Find all edges referencing the 4 stale lagnas**

```bash
grep -n "LAG\.HORA\|LAG\.GHATI\|LAG\.VARNADA\|LAG\.SHREE" \
  /Users/Dev/Vibe-Coding/Apps/Madhav/025_HOLISTIC_SYNTHESIS/CGM_v2_0.md
```

- [ ] **Step 2: For each edge found** — determine if the edge is position-dependent (house/sign based) or position-independent (nakshatra-nakshatra, karaka role, etc.). Correct position-dependent edges; leave position-independent edges unchanged.

- [ ] **Step 3: Update the domain subgraphs** (§5 Wealth, §5 Mind, etc.) that include these lagnas as named nodes. Each subgraph has a "Nodes:" list — verify all 4 lagna nodes show correct house.

- [ ] **Step 4: Update edge counts**

Recount any affected edge-type totals (Placement edges will gain/lose entries in the house-placement section; Dispositor edges will change).

- [ ] **Step 5: Update the provenance note** in CGM_v2_0.md frontmatter:
"v2.0 node+edge corrections: LAG.HORA/GHATI/VARNADA/SHREE position corrections applied; all position-dependent edges updated; position-independent edges unchanged."

- [ ] **Step 6: Commit**

```bash
git add 025_HOLISTIC_SYNTHESIS/CGM_v2_0.md
git commit -m "fix(am-jis): CGM v2.0 — edge corrections for repositioned special lagnas

- LAG.HORA: edges updated 7H→3H
- LAG.GHATI: edges updated 8H→9H; dispositor Jupiter added
- LAG.VARNADA: edges updated 8H→4H; dispositor Moon added
- LAG.SHREE: edges updated 9H→7H; dispositor Venus; Vishakha-Jupiter nakshatra edge"
```

---

## Phase E — MSR Mode B SIG.16-31 Audit and Promotion

### Task E1: SIG.16-31 Audit and Eligible Promotions

**File:**
- Modify: `025_HOLISTIC_SYNTHESIS/MSR_v2_0.md`

**Context:** CGM_v1_0 §2.5 (Yoga nodes) lists SIG.16-31 as "tentative candidates from Mode B run" to be promoted "after Deep Analysis v2.0 review." Deep Analysis v2.0 was not produced, but FIX_SESSION_003 did produce 17 new yoga signals (MSR.421-437) via JH transcription. The question is whether SIG.16-31 Mode B candidates were absorbed into those 17, or are still pending. Current total: 443 signals vs 500-600 target.

Currently confirmed candidates in CGM:
- SIG.16: `YOG.RAHU_JAIMINI_QUADRUPLE` — Rahu Jaimini-aspects Sun, Mercury, Mars, Saturn simultaneously (cited in Career Report §8.5 as "SIG.16")
- SIG.23: `YOG.TRIPLE_EXALTED_NODAL` — Saturn (Libra exalted) + Rahu (Taurus exalted) + Ketu (Scorpio exalted): triple nodal-axis exaltation

- [ ] **Step 1: Read Mode B matrices for full SIG.16-31 list**

```bash
grep -n "SIG\.1[6-9]\|SIG\.2[0-9]\|SIG\.3[01]\|candidate\|tentative\|Mode B signal" \
  /Users/Dev/Vibe-Coding/Apps/Madhav/02_ANALYTICAL_LAYER/MATRIX_HOUSES.md \
  /Users/Dev/Vibe-Coding/Apps/Madhav/02_ANALYTICAL_LAYER/MATRIX_PLANETS.md \
  /Users/Dev/Vibe-Coding/Apps/Madhav/02_ANALYTICAL_LAYER/MATRIX_SIGNS.md \
  /Users/Dev/Vibe-Coding/Apps/Madhav/02_ANALYTICAL_LAYER/MATRIX_DIVISIONALS.md \
  /Users/Dev/Vibe-Coding/Apps/Madhav/02_ANALYTICAL_LAYER/MATRIX_DASHA_PERIODS.md
```

Also check:
```bash
grep -n "SIG\.1[6-9]\|SIG\.2[0-9]\|SIG\.3[01]\|candidate\|tentative" \
  /Users/Dev/Vibe-Coding/Apps/Madhav/025_HOLISTIC_SYNTHESIS/CGM_v1_0.md
```

- [ ] **Step 2: Cross-reference against MSR v2.0**

For each SIG.1X-31 candidate found: check if an equivalent signal already exists in MSR_v2_0.md (it may have been numbered differently). If yes: note "absorbed as MSR.NNN." If no: it is a genuine pending promotion.

```bash
grep -n "Rahu.*Jaimini.*Quadruple\|Quadruple.*Jaimini\|Triple.*Exalt.*Nodal\|Nodal.*Triple.*Exalt" \
  /Users/Dev/Vibe-Coding/Apps/Madhav/025_HOLISTIC_SYNTHESIS/MSR_v2_0.md
```

- [ ] **Step 3: For each genuine pending candidate — apply three-interpretation discipline**

Each signal promoted to MSR Maximum tier must meet the project's quality standard. For each:
1. What is the signal (exact astrological phenomenon)?
2. What is its classical precedent?
3. Three interpretations: (a) Standard classical reading, (b) Chart-specific synthesis, (c) Retrodictive test (does it show in LEL events?)
4. Confidence score (0.0–1.0)

Promote only if confidence ≥ 0.80 and all three interpretations are coherent.

- [ ] **Step 4: Add promoted signals to MSR v2.0**

New signals go after MSR.443 (the last existing signal). Number them MSR.444, MSR.445, etc. Follow the existing YAML signal block format.

Update the TOTALS table and summary section.

- [ ] **Step 5: Note the residual gap**

After all eligible promotions: document remaining gap to 500-600 target. If still short, add a note: "Remaining signals require: transit-period signals, D-chart cross-signals, or compound combinatorial signals. Deferred to next dedicated MSR expansion session."

- [ ] **Step 6: Commit**

```bash
git add 025_HOLISTIC_SYNTHESIS/MSR_v2_0.md
git commit -m "feat(am-jis): MSR Mode B SIG.16-31 audit — N signals promoted (MSR.444-45N)

- Audited [N] Mode B candidates; [M] absorbed into prior signals; [K] newly promoted
- Rahu Jaimini Quadruple-Aspect (SIG.16): [absorbed/promoted as MSR.NNN]
- Triple-Exalted-Nodal-Axis (SIG.23): [absorbed/promoted as MSR.NNN]
- Total MSR signals: [new total]
- Remaining gap to 500-600 target: [N-M] signals"
```

---

## Phase F — Provenance Backfill for v6.0-Era Cells

### Task F1: MSR v6.0-Era Cell Provenance

**File:**
- Modify: `025_HOLISTIC_SYNTHESIS/MSR_v2_0.md`

**Context:** MSR v2.0 cells MSR.001-420 (the "original 420") were built in Sessions 12-25 from v6.0 data. Their provenance chains cite "v6.0 §X.Y" but not the corrected v8.0 section IDs. MSR.421+ cells have full v8.0 provenance. The CGP Provenance audit category is likely still PARTIAL.

- [ ] **Step 1: Sample 20 cells from MSR.001-420**

Read MSR_v2_0.md lines covering MSR.001-020 (first 20) and check the provenance field format. Establish what "complete provenance" looks like vs "partial provenance."

- [ ] **Step 2: Run a targeted search for incomplete provenance patterns**

```bash
grep -n "v6\.0\|FORENSIC.*v6\|source.*v6\|§.*v6" \
  /Users/Dev/Vibe-Coding/Apps/Madhav/025_HOLISTIC_SYNTHESIS/MSR_v2_0.md | \
  grep -v "SUPERSEDED\|v8\.0\|reconciliation" | head -40
```

This shows cells that cite v6.0 but have not had their source reference updated to v8.0.

- [ ] **Step 3: For each cell citing v6.0 only — add v8.0 cross-reference**

Pattern to add:
```yaml
source_v8: "FORENSIC_v8_0 §[equivalent section] — cell value CONFIRMED/CORRECTED in v8.0"
```

For cells where the underlying fact was NOT corrected (most of them): add `CONFIRMED`. For cells where the fact changed (special lagnas, sahams, etc.): they should already be marked CORRECTED in MSR v2.0 corrections log.

- [ ] **Step 4: Update CGP status**

If the CGP Provenance category exists in a file, update from PARTIAL → COMPLETE (or SUBSTANTIALLY_COMPLETE if a small residual remains).

```bash
grep -rn "Provenance.*PARTIAL\|PARTIAL.*Provenance\|CGP.*Provenance" \
  /Users/Dev/Vibe-Coding/Apps/Madhav/00_ARCHITECTURE/GOVERNANCE_STACK_v1_0.md \
  /Users/Dev/Vibe-Coding/Apps/Madhav/025_HOLISTIC_SYNTHESIS/
```

- [ ] **Step 5: Commit**

```bash
git add 025_HOLISTIC_SYNTHESIS/MSR_v2_0.md
git commit -m "fix(am-jis): MSR provenance backfill — v6.0-era cells updated with v8.0 cross-references

Added v8.0 source confirmation to MSR.001-420 cells; CGP Provenance: PARTIAL→COMPLETE"
```

---

## Phase G — Governance and Session Log Update

### Task G1: GOVERNANCE_STACK Update

**File:**
- Modify: `00_ARCHITECTURE/GOVERNANCE_STACK_v1_0.md`

- [ ] **Step 1: Update version registry**

Add/update in §1:
- `REPORT_CAREER_DHARMA_v1_1` → CURRENT; v1_0 → SUPERSEDED
- `REPORT_TRAVEL_v1_1` → CURRENT; v1_0 → SUPERSEDED
- `REPORT_PSYCHOLOGY_MIND_v1_1` → CURRENT; v1_0 → SUPERSEDED
- `REPORT_CHILDREN_v1_1` → CURRENT; v1_0 → SUPERSEDED
- `REPORT_PARENTS_v1_1` → CURRENT; v1_0 → SUPERSEDED
- `REMEDIAL_CODEX_v2_0_PART1/PART2` → CURRENT
- `CGM_v2_0` → CURRENT; CGM_v1_0 → SUPERSEDED
- `MSR_v2_0` → updated signal count

- [ ] **Step 2: Update GAP register**

In §3:
- GAP.07: → RESOLVED (JH canonical for Shadbala; Saturn #1)
- GAP.08: → RESOLVED (FORENSIC BAV canonical; JH Moon row retained as reference)
- GAP.09: → RESOLVED (FORENSIC dasha dates canonical for retrodictive fit)
- SIG.16-31 Mode B: → document status (absorbed/promoted count)

- [ ] **Step 3: Update §3 Highest-Leverage Actions list**

Mark completed tasks as DONE.

- [ ] **Step 4: Commit**

```bash
git add 00_ARCHITECTURE/GOVERNANCE_STACK_v1_0.md
git commit -m "chore(am-jis): Governance Stack — gap resolution session registry update

GAP.07/08/09 → RESOLVED; 5 domain reports v1.1; Remedial Codex v2.0; CGM v2.0; MSR expanded"
```

---

### Task G2: SESSION_LOG Update

**File:**
- Modify: `00_ARCHITECTURE/SESSION_LOG.md`

- [ ] **Step 1: Add gap resolution session entry**

Follow the existing session log format. Entry should include:
- Session name: `GAP_RESOLUTION_SESSION` (2026-04-19)
- Objective: Close all 8 internally-resolvable corpus gaps from post-FIX_SESSION_003_deferred gap list
- Outcomes: List all artifacts produced and gaps closed
- Corpus integrity statement
- Next session objective

- [ ] **Step 2: Commit**

```bash
git add 00_ARCHITECTURE/SESSION_LOG.md
git commit -m "chore(am-jis): SESSION_LOG — gap resolution session entry"
```

---

## Execution Order and Parallelization

**Phase A tasks (A1-A5):** Can be executed in parallel — all are independent document corrections.

**Phase B tasks (B1-B2):** Can be executed in parallel with Phase A.

**Phase C tasks (C1-C2):** Both modify FORENSIC v8.0 — execute sequentially in one session to avoid conflicts.

**Phase D (D1 then D2):** D2 depends on D1 (edges depend on corrected nodes).

**Phase E (E1):** Independent; run after Phase D so corrected lagna nodes are available for MSR signal candidates.

**Phase F (F1):** Independent; run anytime after Phase E (so total signal count is final).

**Phase G (G1, G2):** Must be last — summarizes all changes.

**Recommended execution sequence for a single session:**
A1 → A2 → A3 → A4 → A5 → B1 → B2 → C1 → C2 → D1 → D2 → E1 → F1 → G1 → G2

Or with parallelization (dispatch subagents):
- Batch 1 (parallel): A1, A2, A3, A4, A5, B1, B2
- Batch 2 (sequential): C1 → C2
- Batch 3 (sequential): D1 → D2
- Batch 4 (parallel): E1, F1
- Batch 5: G1 → G2
