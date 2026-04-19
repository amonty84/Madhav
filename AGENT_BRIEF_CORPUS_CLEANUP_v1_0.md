---
brief_type: Agent Execution Brief
brief_version: 1.0
created: 2026-04-19
scope: AM-JIS corpus cleanup — strip corrective/explanatory text from claim-bearing files
status: READY FOR EXECUTION
executor_model: Any capable LLM (Claude Sonnet or DeepSeek recommended for cost efficiency)
brain_session: Claude Opus 4.7 session 2026-04-19
verification_run: corpus_verification_report_v1_0.md (same directory)
---

# Agent Execution Brief — AM-JIS Corpus Cleanup

## DO NOT START without reading this entire brief first.

---

## §1 — Project Context

**AM-JIS** (Abhisek Mohanty Jyotish Intelligence System) is a multi-layered astrological research corpus for chart analysis of Abhisek Mohanty, b. 1984-02-05, 10:43 IST, Bhubaneswar. The corpus has four layers:

| Layer | Files | Purpose |
|---|---|---|
| L1 (Facts) | `01_FACTS_LAYER/FORENSIC_ASTROLOGICAL_DATA_v8_0.md` | Ground truth — DO NOT EDIT |
| L2 (Analytical) | `02_ANALYTICAL_LAYER/MATRIX_*.md` | Derived matrices |
| L2.5 (Synthesis) | `025_HOLISTIC_SYNTHESIS/*.md` | UCN, MSR, CDLM, RM, CGM |
| L3 (Domain Reports) | `03_DOMAIN_REPORTS/REPORT_*_v1_1.md` | Nine domain reports |

The insight-generation pipeline reads L1 → L2 → L2.5 → L3. Meta/correction files in `00_ARCHITECTURE/` are **excluded** from insight generation.

---

## §2 — Authoritative Placements (v8.0, non-negotiable)

These are the ONLY correct values. Do not change them; do not introduce any text that contradicts them.

| Entity | Correct Sign | Correct House |
|---|---|---|
| Sun | Capricorn | 10 |
| Moon | Aquarius | 11 |
| Mars | Libra | 7 |
| Mercury | Capricorn | 10 |
| **Jupiter** | **Sagittarius** | **9** |
| Venus | Sagittarius | 9 |
| Saturn | Libra | 7 |
| Rahu | Taurus | 2 |
| Ketu | Scorpio | 8 |
| Hora Lagna | Gemini | 3 |
| Ghati Lagna | Sagittarius | 9 |
| **Varnada Lagna** | **Cancer** | **4** |
| **Shree Lagna** | **Libra** | **7** |
| Saham Roga | Taurus | 2 |
| Saham Mahatmya | Sagittarius | 9 |
| Saham Vivaha | Cancer | 4 |

**Old wrong values (v6.0 era — do NOT reintroduce):**
- Jupiter was wrongly placed in Cancer 4H (now correctly Sagittarius 9H)
- Hora Lagna was wrongly in Libra 7H (now Gemini 3H)
- Ghati Lagna was wrongly in Scorpio 8H (now Sagittarius 9H)
- Varnada Lagna was wrongly in Scorpio 8H (now Cancer 4H)
- Shree Lagna was wrongly in Sagittarius 9H (now Libra 7H)
- Saham Roga was wrongly in Libra 7H (now Taurus 2H)

---

## §3 — Why This Cleanup Is Needed

Several claim-bearing files contain **corrective or explanatory text** — passages that document what used to be wrong and how it was fixed. This text is appropriate in the meta-layer (`00_ARCHITECTURE/`) but not in the insight-generation files (L2.5, L3).

**The problem:** An LLM generating insights from UCN without full session context reads "Jupiter was claimed in Cancer 4H (DEPRECATED)" and registers "Jupiter … Cancer 4H" as a chart signal. The DEPRECATED/CORRECTED labels are not reliably filtered. Result: contaminated insights.

**The solution:** The correction history already exists in `00_ARCHITECTURE/AUDIT_REPORT_v1_0.md`, `00_ARCHITECTURE/SESSION_LOG.md`, and `00_ARCHITECTURE/FALSIFIER_REGISTRY_v1_1.md`. Those files are excluded from insight generation. The claim-bearing files should contain only current-correct interpretations.

---

## §4 — Three Tasks (execute in this order)

---

### Task A — Fix orphaned MSR citations in Health Longevity report

**File:** `03_DOMAIN_REPORTS/REPORT_HEALTH_LONGEVITY_v1_1.md`

**Problem:** Line 337 cites `MSR.391c` and `MSR.391d`. These suffixed variants do not exist in the MSR registry. The correct reference is `MSR.391` (the recomposed 7H signal) plus separate saham-specific signals.

**Action:**
1. Read line 337 and its surrounding context (lines 330–340).
2. Replace `MSR.391c, MSR.391d` with `MSR.391` in the citation.
3. If the text around it explains the correction in a "(was X, now Y)" style, strip that explanation. Leave only the current correct citation.
4. Version bump: update frontmatter `version:` from `1.1` → `1.2` and add changelog entry: `v1.2 2026-04-19: MSR.391c/391d citations corrected to MSR.391; corrective text removed per corpus cleanup.`

---

### Task B — Strip UCN Part II §CHANGELOG

**File:** `025_HOLISTIC_SYNTHESIS/UCN_v4_0.md`

**Problem:** Part II (lines ~974–1295) is titled `## PART II — JUPITER PLACEMENT CORRECTIONS (UCN v1.1, FIX_SESSION_001)` and contains ~321 lines of deprecated-claim documentation. It includes explicit tables listing the old DEPRECATED Jupiter-4H claims alongside their corrections. This section served as a diff record during the correction process; the corrections are already reflected in Part I's body text (which was cleaned to v4.1). The Part II changelog is now noise for insight generation.

**What Part II currently contains (to be stripped):**
- `## PART II — JUPITER PLACEMENT CORRECTIONS (UCN v1.1, FIX_SESSION_001)` header
- `# UCN_v1_1 — Unified Chart Narrative (Revision 1.1)` header
- `## PREAMBLE — This Is a Revision Document, Not a Full Rewrite` and its text
- `## §CHANGELOG — Changes from v1.0 to v1.1` and its full table listing deprecated v1.0 claims
- `## §IX.2 Seven Contradictions — Correct-Response Audit` table (correction audit table, not interpretive content)
- All surrounding prose describing this as a "revision document"
- The Part II artifact footer YAML block at the end of Part II

**What replaces it:**
Replace the entire Part II section with this single line between a horizontal rule and the Part III header:

```
---

*Correction history for this document: `00_ARCHITECTURE/AUDIT_REPORT_v1_0.md` and `00_ARCHITECTURE/FIX_SESSION_001_COMPLETION.md`.*

---
```

**What to preserve:**
- Part I (lines 36–973): The corrected 10-Part narrative — DO NOT touch
- Part III (starting at `## PART III — ADDITIVE SYNTHESIS (UCN v2.0)`): The additive v2.0 content
- Part IV (starting at `## PART IV — v8.0 FACTS RECONCILIATION (UCN v3.0)`): The v8.0 reconciliation
- The frontmatter YAML at the very top of the file

**Verification:** After removal, search the file for "DEPRECATED", "v1.0 Claim", "§CHANGELOG", and "Revision Document". None should appear in the body text (frontmatter references in YAML are acceptable).

**Version bump:** Frontmatter is already at `version: 4.1`. Add to `v4_1_changelog:` YAML field: `; Part II §CHANGELOG stripped 2026-04-19 per corpus cleanup brief.`

---

### Task C — Strip corrective text from MSR_v2_0, CDLM_v1_1, and RM_v2_0

**Files:**
- `025_HOLISTIC_SYNTHESIS/MSR_v2_0.md`
- `025_HOLISTIC_SYNTHESIS/CDLM_v1_1.md`
- `025_HOLISTIC_SYNTHESIS/RM_v2_0.md`

**Rule:** For each file, strip text that follows this pattern in the document body (not the YAML frontmatter):
- Inline "(was X, now Y)" correction notes inside signal/cell entries
- "(v6.0 said...)" or "(v6.0 had...)" parentheticals
- "corrected from / corrected to" phrases and their surrounding explanation
- "CORRECTED:" label prefixes in signal names (but keep the corrected signal itself)
- "SUPERSEDED/INVALIDATED:" label prefixes with their explanation (but keep the replacement signal)
- Section headers titled "Version Notes — What Changed from v1.0" or "§CHANGELOG" and their content

**Detailed instructions per file:**

#### MSR_v2_0.md

Strip the following section entirely (it is ~30 lines of version diff documentation, not signal content):

```
### §0-SCHEMA.2 Version Notes — What Changed from v1.0
[...through to the end of the "UNCHANGED" subsection...]
```

Replace with:
```
### §0-SCHEMA.2 Version Notes
*Full correction history: `00_ARCHITECTURE/AUDIT_REPORT_v1_0.md`.*
```

Also strip from the corrected signal entries any text pattern like:
- `reconciliation: FIX_SESSION_003 2026-04-18` (keep the field key but strip or simplify the value)
- Any `reconciliation_notes:` block that says "was X, now Y" — strip the "was X" part, keep only the current correct value
- Signal `MSR.402` is INVALIDATED. Its replacement `MSR.402b` should remain but the explicit "(was X)" explanation inside MSR.402's entry should be removed if present

**What to keep:** Every signal entry's current-correct values (`signal_name`, `strength_score`, `confidence`, `entities_involved`, `domains_affected`, etc.). Keep the signal; strip only the changelog narrative within it.

#### CDLM_v1_1.md

Strip from CDLM cell entries:
- Any row or cell that says "corrected from [old value] to [new value]"
- "v1.1 structural revision: ..." notes inside cells
- "(v6.0 error)" parentheticals
- Inline changelog rows appended to tables (rows beginning with "**v1.1 structural revision**" or similar)

Keep: The cell values themselves, the 9×9 matrix structure, all domain-linkage strengths, all active mechanism text.

#### RM_v2_0.md

Strip from resonance map entries:
- "corrected: [old value → new value]" notes
- "(v6.0 error — now X)" parentheticals
- Any "Note: was X in v1_1, corrected in v2_0" type commentary

Keep: All active resonance observations, paradox entries, and RM element values.

**Version bumps:**
- `MSR_v2_0.md`: `version: 2.1` → `2.2`. Frontmatter changelog addition: `v2.2 2026-04-19: §0-SCHEMA.2 version-diff notes stripped; inline correction commentary removed. See 00_ARCHITECTURE/AUDIT_REPORT_v1_0.md for history.`
- `CDLM_v1_1.md`: `version: 1.1` → `1.2`. Same note.
- `RM_v2_0.md`: `version: 2.0` → `2.1`. Same note.

---

## §5 — What to NOT Touch

| Do Not Touch | Reason |
|---|---|
| `01_FACTS_LAYER/FORENSIC_ASTROLOGICAL_DATA_v8_0.md` | Ground truth — read-only |
| `00_ARCHITECTURE/` (all files) | Meta layer — excluded from insight generation; correction history belongs here |
| `01_FACTS_LAYER/` (all files except `REPORT_*`) | Facts layer — read-only |
| YAML frontmatter blocks at file tops | Version metadata must stay; brief references to corrections in YAML are acceptable |
| Part I of UCN (lines 36–973) | Already cleaned to v4.1; do not re-edit |
| Part III and Part IV of UCN | Additive content; not corrective |
| Any signal's current-correct values | Strip the "was X" history, never the current claim |
| `corpus_verification_report_v1_0.md` | Verification artifact — leave as is |
| `audit.py` and `verify_corpus.py` | Tools — not content files |

---

## §6 — Verification After Each Task

After each task, run this check from the project root:

```bash
python3 audit.py
```

The audit counts error-pattern matches. After Task A: count should stay flat or decrease. After Tasks B and C: the count should decrease significantly (Part II §CHANGELOG alone contributes ~50 matches of "Jupiter…4H" text).

If any new LIVE_ERRORS appear (passages making wrong claims that weren't there before), stop and report before continuing.

---

## §7 — Acceptance Criteria

The cleanup is complete when:

1. `REPORT_HEALTH_LONGEVITY_v1_1.md` contains no reference to `MSR.391c` or `MSR.391d`.
2. `UCN_v4_0.md` contains no text matching `§CHANGELOG`, `v1.0 Claim (DEPRECATED)`, or `This Is a Revision Document`.
3. `MSR_v2_0.md` §0-SCHEMA.2 contains only the one-line pointer, not the "What Changed" content.
4. `CDLM_v1_1.md` and `RM_v2_0.md` contain no "(was X, now Y)" body text.
5. All edited files have their version metadata bumped and a one-line changelog entry added.
6. `python3 audit.py` runs without error and the error-pattern count is lower than the pre-cleanup baseline of 157.
7. No authoritative placement (§2 table) has been changed or contradicted anywhere.

---

## §8 — Escalation

If you encounter ambiguity — text that might be corrective OR might be currently-valid interpretive content — **do not delete it**. Leave a comment marker:

```
<!-- BRAIN_REVIEW: uncertain whether this is corrective or current — 2026-04-19 -->
```

Then continue. The brain session (Claude Opus) will review these markers in a follow-up.

---

*Brief prepared by Claude Opus 4.7 session, 2026-04-19. Executor: any capable LLM.*
*Supporting files: `corpus_verification_report_v1_0.md`, `audit.py`, `verify_corpus.py`*
