---
brief_type: Agent Execution Brief
brief_version: 1.0
created: 2026-04-19
scope: Comprehensive AM-JIS corpus verification pre-vectorization
status: READY FOR EXECUTION
executor_model: Claude Sonnet 4.6 or DeepSeek V3
cost_budget_usd: 8
estimated_runtime: 4-8 hours
prerequisite_reads: [CLAUDE.md, AM_JIS_BOOTSTRAP_HANDOFF.md, AGENT_BRIEF_CORPUS_VERIFICATION_v1_0.md (this file), 01_FACTS_LAYER/FORENSIC_ASTROLOGICAL_DATA_v8_0.md §0–§2]
produces_artifacts: [/verification_artifacts/<timestamp>/READINESS_REPORT.md + 14 supporting JSON/graphml files]
blocks_downstream: [vectorization, graph_model_construction]
---

# Agent Execution Brief — AM-JIS Corpus Verification v1.0

## DO NOT START without reading this entire brief first.

---

## §0 — Executor Preamble — STOP Before Starting

### §0.1 — What This Brief Is

This is a **standalone executor brief** for a comprehensive verification of the AM-JIS (Abhisek Mohanty Jyotish Intelligence System) astrological corpus. The verification must be completed **before** the corpus can be vectorized and used for LLM-based insight generation.

The brief contains everything you need — context, authoritative placements, schema examples, invariant definitions, layer‑by‑layer verification procedures, and tooling strategy. **Read the entire brief before executing any check.**

### §0.2 — Prerequisite Reads

You must read these files **in order** before beginning verification:

1. **`CLAUDE.md`** (project root) — project‑wide operating instructions
2. **`AM_JIS_BOOTSTRAP_HANDOFF.md`** (project root) — project history and architecture context
3. **This brief** — you are reading it now
4. **`01_FACTS_LAYER/FORENSIC_ASTROLOGICAL_DATA_v8_0.md` §0–§2** — the authoritative L1 ground‑truth file, first three sections

**DO NOT** read any other files yet. The verification layers will direct you to specific sections of specific files as needed.

### §0.3 — Non‑Negotiable Verification Principles

1. **L1 is ground truth** — All verification starts from `FORENSIC_ASTROLOGICAL_DATA_v8_0.md`. No other file may contradict its authoritative placements (§2 of this brief).
2. **Deterministic first, LLM‑assisted second** — Layers L0–L2.5a are pure‑Python deterministic checks. Only L2.5b and L3 employ LLM spot‑checks where semantic judgment is required.
3. **Fail‑fast, fail‑hard** — Any failure in L0 (structural), L1 (invariants), or L2 (matrix ↔ L1 trace) is a **HARD BLOCK** that must be fixed before proceeding.
4. **Produce artifacts, not just pass/fail** — Every verification layer produces a machine‑readable artifact (JSON, GraphML, Markdown). These artifacts feed the downstream vectorization and graph‑model construction.
5. **Escalate, don’t guess** — If you encounter ambiguity about whether a finding is a verification failure or an intentional design choice, use the escalation matrix in §9.

### §0.4 — Execution Environment

- **Working directory**: `/Users/Dev/Vibe‑Coding/Apps/Madhav`
- **Python version**: 3.x (use `python3` command)
- **Available tools**: `git`, `grep`, `sed`, `awk`, `jq`, `pytest` (optional but recommended)
- **Git branch**: `feature/amjis‑platform` (verify with `git branch --show‑current`; if not on this branch, switch to it)

### §0.5 — Pre‑Flight Checklist

Before executing any verification layer, ensure:

- [ ] You have read this entire brief (§0–§12 + Appendices)
- [ ] You have read the four prerequisite files listed in §0.2
- [ ] You are in the correct working directory (`/Users/Dev/Vibe‑Coding/Apps/Madhav`)
- [ ] Python 3 is installed (`python3 --version` returns 3.x)
- [ ] Git is initialized (`git status` does not error)
- [ ] You have created the output directory: `mkdir -p verification_artifacts/$(date +%Y%m%d_%H%M%S)`
- [ ] You have backed up the current state with `git tag verification-start-$(date +%Y%m%d-%H%M%S)`

**If any item is missing, stop and fix it before proceeding.**

---

## §1 — Project Context (Self‑Contained AM‑JIS Intro)

### §1.1 — What AM‑JIS Is

AM‑JIS (Abhisek Mohanty Jyotish Intelligence System) is a multi‑session astrological research corpus built around the natal chart of **Abhisek Mohanty**, born **1984‑02‑05, 10:43 IST, Bhubaneswar, Odisha, India**.

The corpus follows a **five‑layer pyramid architecture**:

| Layer | Directory | Purpose | Key Files |
|-------|-----------|---------|-----------|
| **L1 Facts** | `01_FACTS_LAYER/` | Ground‑truth chart data, life events, computed ephemeris | `FORENSIC_ASTROLOGICAL_DATA_v8_0.md` |
| **L2 Analytical** | `02_ANALYTICAL_LAYER/` | Exhaustive matrices and curated deep analysis | `MATRIX_HOUSES.md`, `MATRIX_PLANETS.md`, `MATRIX_SIGNS.md`, `MATRIX_DASHA_PERIODS.md`, `MATRIX_DIVISIONALS.md` |
| **L2.5 Holistic Synthesis** | `025_HOLISTIC_SYNTHESIS/` | Whole‑chart integration and cross‑domain linkage | `MSR_v2_0.md`, `CDLM_v1_1.md`, `RM_v2_0.md`, `UCN_v4_0.md` |
| **L3 Domain Reports** | `03_DOMAIN_REPORTS/` | Nine life‑domain reports (financial, career, health, relationships, etc.) | `REPORT_FINANCIAL_v2_1.md`, `REPORT_CAREER_DHARMA_v1_1.md`, … |
| **L4 Query Interface** | `06_QUERY_INTERFACE/` | LLM prompt library and decision‑support playbook | `QUERY_PROMPT_LIBRARY_v1_0.md` |

**Insight‑generation pipeline**: L1 → L2 → L2.5 → L3 → L4. Every layer must be internally consistent and correctly trace back to L1.

### §1.2 — Why This Verification Is Needed

The corpus has undergone multiple correction sessions (v6.0 → v8.0). Before feeding it into **vectorization + graph‑model construction** for LLM‑based insight generation, we must have high confidence that:

1. **L1 is internally consistent** — every planet’s sign/house/longitude/nakshatra/pada/dasha continuity derives correctly; all numeric aggregates (SAV=337, Shadbala sums, BAV totals) balance.
2. **All derived files (L2 matrices, L2.5 synthesis, L3 domain reports) correctly trace back to L1.**
3. **Cross‑file citations** (`MSR.NNN`, `CDLM.DN.DM`, `RM.NN`, `UCN §X`) all resolve.
4. **Entity naming is uniform enough** for automated extraction (Śani/Shani/शनि → canonical `Saturn`).
5. **No build‑process glitches remain** — duplicate entries, missing fields, orphan citations, broken cross‑references, encoding defects.

**Critical findings from Phase 1 exploration** (to be addressed during verification):

- `MSR_v2_0.md` claims 500 signals but only ~60 are fully rendered as `SIG.MSR.NNN:` YAML blocks; the other ~420 live in archived `MSR_v1_0.md`.
- 29 MSR IDs cited in UCN + domain reports are undefined in `MSR_v2_0.md` (they live in v1_0).
- `RM_v2_0.md` claims 32 elements but defines ~28; RM.08/14/26 missing; RM.31/32 cited but undefined.
- `CDLM_v1_1.md` all 81 cells anchor to MSR signals from the 29‑undefined set.
- UCN has 2 dangling `§CHANGELOG` references from the prior cleanup pass.
- L1 file has **20+ mechanical invariants** that can be verified automatically but currently are not.

### §1.3 — User Decisions That Shape This Verification

| Decision | Effect on Verification |
|----------|------------------------|
| **Self‑contained brief for external LLM** | This brief includes all necessary context, schemas, and examples. Executor reads only this brief plus the four prerequisite files. |
| **Merge MSR to v3_0 before verification** | §6 contains the full MSR merge procedure. The citation‑graph check (L2.5c) runs **against the merged `MSR_v3_0.md`**, not a runtime unified registry. |
| **Pure‑Python deterministic checks where possible** | L0–L2.5a are implemented as Python scripts; L2.5b and L3 use LLM spot‑checks only where semantic judgment is unavoidable. |
| **Produce machine‑readable artifacts** | Every verification layer outputs JSON/GraphML files that feed downstream vectorization and graph‑model construction. |

### §1.4 — Subject Metadata

- **Name**: Abhisek Mohanty
- **Birth**: 1984‑02‑05, 10:43 IST (UTC+5:30)
- **Place**: Bhubaneswar, Odisha, India (20.2960° N, 85.8246° E)
- **Ayanamsa**: Lahiri (Chitrapaksha), 23°37′58″
- **House system**: Sripathi (Bhava Chalit)
- **Current Vimshottari**: Mercury MD (2010‑2027) → Saturn AD (2024‑12‑12 → 2027‑08‑21)
- **Lagna**: Aries 12°23′55″, Ashwini Pada 4
- **Moon**: Aquarius 27°02′48″, Purva Bhadrapada Pada 3 (Atmakaraka)

**All subsequent verification must respect these canonical values.**

---

## §2 — Authoritative v8.0 Placements Ledger

**This table is the single source of truth for all planet, lagna, and saham placements.** Any deviation in any file is a verification failure.

### §2.1 — Planetary Positions (Rashi)

| Planet | Correct Sign | Correct House (Rashi) | Longitude (abs) | Nakshatra | Pada |
|--------|--------------|------------------------|-----------------|-----------|------|
| Sun | Capricorn | 10H | 21°57′35″ | Shravana | 4 |
| Moon | Aquarius | 11H | 27°02′48″ | Purva Bhadrapada | 3 |
| Mars | Libra | 7H | 14°57′12″ | Swati | 4 |
| Mercury | Capricorn | 10H | 17°51′42″ | Shravana | 1 |
| **Jupiter** | **Sagittarius** | **9H** | 21°21′18″ | Purva Ashadha | 2 |
| Venus | Sagittarius | 9H | 11°14′36″ | Moola | 3 |
| Saturn | Libra | 7H | 18°53′08″ | Vishakha | 1 |
| Rahu | Taurus | 2H | 12°45′36″ | Rohini | 3 |
| Ketu | Scorpio | 8H | 12°45′36″ | Jyeshtha | 1 |

**Note**: Jupiter was **wrongly placed in Cancer 4H in v6.0**. The correct placement is Sagittarius 9H. Any file referencing Jupiter in Cancer 4H is a verification failure.

### §2.2 — Special Lagnas (Corrected in v8.0)

| Special Lagna | Correct Sign | Correct House | Nakshatra | Pada |
|---------------|--------------|---------------|-----------|------|
| Hora Lagna | Gemini | 3H | Ardra | 3 |
| Ghati Lagna | Sagittarius | 9H | Purva Ashadha | 1 |
| Varnada Lagna | Cancer | 4H | Pushya | 3 |
| Shree Lagna | Libra | 7H | Vishakha | 1 |
| Indu Lagna | Scorpio | 8H | Jyeshtha | 4 |
| Vighati Lagna | Leo | 5H | Purva Phalguni | 3 |
| Pranapada Lagna | Leo | 5H | Purva Phalguni | 3 |

**Correction history**: Hora Lagna was wrongly in Libra 7H; Ghati Lagna was wrongly in Scorpio 8H; Varnada Lagna was wrongly in Scorpio 8H; Shree Lagna was wrongly in Sagittarius 9H. The v8.0 corrections above are authoritative.

### §2.3 — Sahams (Corrected in v8.0)

| Saham | Correct Sign | Correct House | Nakshatra |
|-------|--------------|---------------|-----------|
| Roga Saham | Taurus | 2H | Mrigashira |
| Mahatmya Saham | Sagittarius | 9H | Purva Ashadha |
| Vivaha Saham | Cancer | 4H | Pushya |

**Correction history**: Roga Saham was wrongly in Libra 7H; Mahatmya Saham was wrongly in Libra 7H; Vivaha Saham was correctly in Cancer 4H.

### §2.4 — Key Numeric Invariants

- **SAV (Sarvashtakavarga total)**: 337 points (sum of all 12 signs’ BAV totals)
- **Shadbala ranking**: Sun #1 total strength (8.51 rupas) per FORENSIC engine; Jupiter #1 per JHora engine — dual‑engine divergence documented in L1
- **Bhavabala (house strength)**: 7H Libra is weakest (rank 12); 10H Capricorn is strongest (rank 3)
- **Vimshottari cycle**: 120‑year cycle; current MD/AD windows match `MET.DASHA.CURRENT`
- **Sade Sati phase**: Currently in Setting phase (Saturn transit Aquarius/Pisces), 2025‑2028

### §2.5 — Old Wrong Values (Do NOT Reintroduce)

These values appear in v6.0‑era files and must be flagged as errors:

- Jupiter in Cancer 4H
- Hora Lagna in Libra 7H
- Ghati Lagna in Scorpio 8H
- Varnada Lagna in Scorpio 8H
- Shree Lagna in Sagittarius 9H
- Roga Saham in Libra 7H
- Mahatmya Saham in Libra 7H

**Verification rule**: Any occurrence of these wrong placements in **any file except `00_ARCHITECTURE/` historical documents** is a failure. The `00_ARCHITECTURE/` folder contains correction history and is excluded from insight generation.

---

## §3 — How to Read MSR / CDLM / RM / UCN (One Fully‑Rendered Example Each)

### §3.1 — MSR (Master Signal Register) Signal Block

```yaml
SIG.MSR.391:
  signal_name: "7H five‑layer convergence (corrected)"
  signal_type: "structural_architecture"
  entities_involved: ["Saturn", "Mars", "Bhrigu_Bindu", "Shree_Lagna", "KP_sub_Saturn"]
  domains_affected: ["D3", "D1", "D2"]
  strength_score: 0.93
  confidence: 0.95
  valence: "mixed"
  temporal_characterization: "structural (natal)"
  mechanism: "Five independent systems designate 7H Libra as a karmic‑vortex house: Saturn exalted (AmK), Mars Avayogi+PK, Bhrigu Bindu natal, Shree Lagna (Lakshmi‑grace), KP sub‑lord Saturn."
  msr_anchors_self: []
  cdlm_anchors: ["CDLM.D3.D3"]
  rm_anchors: ["RM.14"]
  ucn_anchors: ["UCN §XVII"]
  falsifier_window: "2026‑04‑19 → 2026‑10‑19 (BB‑UL convergence)"
  reconciliation: "FIX_SESSION_003 2026‑04‑18"
  provenance: "v2_0‑rerendered"
```

**Key fields**:
- `signal_name`: Human‑readable description
- `strength_score`: 0.00–1.00 (higher = stronger chart signal)
- `confidence`: 0.00–1.00 (higher = more certain interpretation)
- `valence`: `benefic` / `malefic` / `mixed` / `neutral`
- `temporal_characterization`: `structural (natal)` / `dasha‑activated` / `transit‑sensitive` / `annual (Varshaphal)` / `life‑phase`
- `mechanism`: Astrological reasoning (1–3 sentences)
- `entities_involved`: List of planets, houses, special lagnas, sahams
- `domains_affected`: D1–D9 (see CDLM domain mapping)
- `msr_anchors_self`: Other MSR signals that support this one
- `cdlm_anchors`: CDLM cells that cite this signal
- `rm_anchors`: RM elements that cite this signal
- `ucn_anchors`: UCN section references
- `falsifier_window`: Empirical test window (if any)
- `reconciliation`: Which fix session corrected this signal
- `provenance`: `v1_0‑confirmed‑by‑v8` / `v2_0‑rerendered` / `v2_0‑new‑421‑443` / `v2_0‑new‑444‑496`

### §3.2 — CDLM (Cross‑Domain Linkage Matrix) Cell

```yaml
CDLM.D3.D2:
  row_domain: "Relationships"
  col_domain: "Wealth"
  linkage_type: "feeds"
  primary_mechanism: "Venus = 7L (relationship) AND 2L (wealth) = relationship quality and wealth generation are structurally the same energy; Shree Lagna in 7H Libra = Lakshmi's grace‑point is directly in the relationship house."
  msr_anchors: ["MSR.403", "MSR.336", "MSR.391"]
  strength: 0.89
  direction: "row→col"
  valence: "benefic"
  key_finding: "Wealth and relationships are structurally fused — Venus (2L+7L) makes them the same planetary energy; Shree Lagna in 7H confirms Lakshmi's grace flows through the relationship domain."
```

**Key fields**:
- `row_domain`, `col_domain`: D1–D9 (Career, Wealth, Relationships, Health, Children, Spirit, Parents, Mind, Travel)
- `linkage_type`: `feeds` / `constrains` / `mirrors` / `amplifies` / `compensates` / `contradicts`
- `strength`: 0.00–1.00 (how strong this cross‑domain link is)
- `direction`: `row→col` / `col→row` / `bidirectional`
- `msr_anchors`: MSR signals that ground this linkage

### §3.3 — RM (Resonance Map) Element

```yaml
RM.14:
  element: "7H Libra five‑layer convergence (Saturn exalted + Mars + BB + Shree Lagna + KP sub‑lord)"
  domains_primary: ["D3", "D1"]
  msr_anchors: ["MSR.391", "MSR.411"]
  cdlm_anchors: ["CDLM.D3.D3"]
  constructive_resonance:
    - "Saturn exalted (quality and structural discipline in relationship)"
    - "Mars Avayogi + PK (friction and children‑karma)"
    - "Bhrigu Bindu natal (fortune‑timing sensitivity)"
    - "Shree Lagna in 7H Vishakha Pada 1 (Lakshmi‑grace directly in relationship domain)"
    - "KP sub‑lord = Saturn (relationship‑house KP governance by the exalted AmK)"
  destructive_resonance:
    - "BVB rank 12 = structurally fragile house"
    - "Avayogi Mars = fortune‑reducer in relationship house"
  net_resonance: "STRONGLY AMPLIFIED (yoga density, enhanced by Shree Lagna) AND TENSION‑BEARING (fragile container)"
  interpretive_note: "Chart's most yoga‑dense relationship house. Layer count corrected from six to five — Hora Lagna (now 3H), Saham Roga (now 2H), Saham Mahatmya (now 9H) removed. Shree Lagna added as a new positive layer."
```

**Key fields**:
- `element`: Description of the resonance
- `constructive_resonance`: List of strengthening factors
- `destructive_resonance`: List of challenging factors
- `net_resonance`: Overall characterization (e.g., `STRONGLY AMPLIFIED`, `TENSION‑BEARING`, `BENEFIC`, `MIXED`)
- `interpretive_note`: 1–3 sentences of guidance

### §3.4 — UCN (Unified Chart Narrative) Section Reference

UCN is a 10‑Part narrative document. Sections are referenced as:

- `UCN §I` — Part I: Core Architecture
- `UCN §XVII` — Part IV §XVII: 7H Revised to Five‑Layer Composition
- `UCN §IX.2` — Part III §IX.2: Seven Contradictions — Correct‑Response Audit

The UCN frontmatter contains a table of contents mapping section numbers to page numbers.

### §3.5 — Citation Pattern Summary

| Pattern | Example | Meaning |
|---------|---------|---------|
| `MSR.NNN` | `MSR.391` | Master Signal Register signal ID (NNN = 001–496, plus suffix variants like `391a`, `402b`) |
| `CDLM.DN.DM` | `CDLM.D3.D2` | Cross‑Domain Linkage Matrix cell (row D1–D9, column D1–D9) |
| `RM.NN` | `RM.14` | Resonance Map element (01–32, plus suffix letters like `21A`, `21B`) |
| `UCN §X` | `UCN §XVII` | Unified Chart Narrative section |
| `SIG.*` | `SIG.MSR.391` | Full signal block reference (used inside MSR file) |
| `PLN.*` / `HSE.*` / … | `PLN.JUPITER`, `HSE.7` | L1 stable IDs (see §0.1 of L1 file) |

**Verification rule**: Every citation of the form `MSR.NNN`, `CDLM.DN.DM`, `RM.NN`, or `UCN §X` must resolve to a defined entry in the corresponding file.

---

## §4 — Mechanical Invariants Catalogue — INV.L1.01–24 Formally Stated

These 24 invariants are **pure‑Python checkable** and must all pass for L1 to be considered internally consistent. Any failure is a **HARD BLOCK** for downstream processing.

### §4.1 — Family F1: Positional (4 invariants)

**INV.L1.01 — Sign‑House Mapping Under Aries Lagna**
- **Purpose**: Ensure each planet’s sign placement maps to the correct Rashi house (1–12) given Aries Lagna.
- **Input**: `PLN.*.sign`, `PLN.*.house_rashi` from L1 §2.1
- **Check**: For each planet, compute expected house = (sign_index - Aries_index + 1) mod 12, where sign_index: Aries=1, Taurus=2, …, Pisces=12. Expected house must match `house_rashi`.
- **Failure**: Planet‑house mismatch indicates transcription error.

**INV.L1.02 — Absolute Longitude Within Sign Range**
- **Purpose**: Ensure each planet’s absolute longitude falls within the 0°–30° range of its sign.
- **Input**: `PLN.*.abs_long` (decimal degrees), `PLN.*.sign`
- **Check**: For each planet, compute sign_start = (sign_index - 1) * 30.0. Then `abs_long % 30.0` must equal the planet’s degree‑minute‑second converted to decimal degrees within [0, 30).
- **Failure**: Longitude‑sign mismatch indicates computation or transcription error.

**INV.L1.03 — Nakshatra Matches Longitude**
- **Purpose**: Ensure each planet’s nakshatra assignment corresponds to its absolute longitude.
- **Input**: `PLN.*.abs_long`, `PLN.*.nakshatra`
- **Check**: Use the canonical nakshatra boundaries (13°20′ per nakshatra, starting at 0° Aries = Ashwini). Compute expected nakshatra from `abs_long`; must match recorded nakshatra.
- **Failure**: Nakshatra mismatch indicates transcription error.

**INV.L1.04 — Pada Matches Longitude Sub‑range**
- **Purpose**: Ensure each planet’s pada (1–4) falls within the correct quarter of its nakshatra.
- **Input**: `PLN.*.abs_long`, `PLN.*.pada`
- **Check**: Within each nakshatra (13°20′), pada 1 = 0°–3°20′, pada 2 = 3°20′–6°40′, pada 3 = 6°40′–10°00′, pada 4 = 10°00′–13°20′. Compute expected pada from `abs_long`; must match recorded pada.
- **Failure**: Pada mismatch indicates transcription error.

### §4.2 — Family F2: Temporal Continuity (4 invariants)

**INV.L1.05 — Vimshottari Dasha Date Chains**
- **Purpose**: Ensure Vimshottari MD/AD/PD dates form a continuous chain without gaps or overlaps.
- **Input**: `DSH.V.MD.*.start`, `DSH.V.MD.*.end`, `DSH.V.AD.*.start`, `DSH.V.AD.*.end` from L1 §5.1
- **Check**: For each planet’s MD sequence, `MD[i].end == MD[i+1].start`. For each MD, its AD sub‑periods must cover the MD window exactly (sum of AD durations = MD duration).
- **Failure**: Date discontinuity indicates computation or transcription error.

**INV.L1.06 — 120‑Year Vimshottari Cycle**
- **Purpose**: Ensure total Vimshottari cycle spans exactly 120 years from birth.
- **Input**: `DSH.V.MD.*.start`, `DSH.V.MD.*.end` for all 9 planets
- **Check`: (Last MD end date) - (Birth date) = 120 years ± 1 day (allow for leap‑year rounding).
- **Failure**: Cycle length mismatch indicates computation error.

**INV.L1.07 — Yogini Dasha Date Chains**
- **Purpose**: Ensure Yogini dasha periods form a continuous 36‑year cycle.
- **Input**: `DSH.Y.*.start`, `DSH.Y.*.end` from L1 §5.2
- **Check**: Each dasha end equals next dasha start; total cycle = 36 years.
- **Failure**: Date discontinuity or cycle length mismatch.

**INV.L1.08 — Jaimini Chara Dasha Date Chains**
- **Purpose**: Ensure Chara dasha periods form continuous chains.
- **Input**: `DSH.C.*.start`, `DSH.C.*.end` from L1 §5.3
- **Check**: Each dasha end equals next dasha start.
- **Failure**: Date discontinuity.

### §4.3 — Family F3: Numeric Aggregate (4 invariants)

**INV.L1.09 — SAV = 337**
- **Purpose**: Ensure Sarvashtakavarga total across 12 signs equals 337.
- **Input**: `AVG.SAV.*` values from L1 §7.1 (table)
- **Check**: Sum(`AVG.SAV.*`) == 337.
- **Failure**: SAV total mismatch indicates computation error.

**INV.L1.10 — BAV Row Sums**
- **Purpose**: Ensure each planet’s BAV (Bhinnashtakavarga) row sums to the planet’s own Rasi‑based total.
- **Input**: `AVG.BAV.PLN.*` rows from L1 §7.2
- **Check**: For each planet, sum of its BAV row (12 values) == that planet’s Rasi‑based total listed in the same table.
- **Failure**: Row‑sum mismatch indicates transcription error.

**INV.L1.11 — Shadbala Component Sums Match Totals**
- **Purpose**: Ensure each planet’s Shadbala components sum to the recorded total strength.
- **Input**: `SBL.SHADBALA.*.components`, `SBL.SHADBALA.*.total` from L1 §6.1–§6.5
- **Check**: For each planet, sum of Sthana‑Bala + Dig‑Bala + … == total strength (within rounding tolerance).
- **Failure**: Component‑total mismatch indicates transcription error.

**INV.L1.12 — Column Sums Match SAV**
- **Purpose**: Ensure BAV column sums equal SAV sign totals.
- **Input**: `AVG.BAV.PLN.*` rows, `AVG.SAV.*` totals
- **Check**: For each sign/house, sum of BAV values in that column == `AVG.SAV.sign`.
- **Failure**: Column‑sum mismatch indicates transcription error.

### §4.4 — Family F4: Derivation Rules (7 invariants)

**INV.L1.13 — Chalit Deviation Bounds**
- **Purpose**: Ensure Chalit house deviations from Rashi houses are within ±1 house.
- **Input**: `PLN.*.house_rashi`, `PLN.*.house_chalit` from L1 §2.1
- **Check**: For each planet, `abs(house_chalit - house_rashi) <= 1`.
- **Failure**: Chalit deviation > 1 house indicates computation error.

**INV.L1.14 — Special‑Lagna Derivations**
- **Purpose**: Ensure special lagna positions derive correctly from birth time and formulas.
- **Input**: `LAG.*.sign`, `LAG.*.house` from L1 §12.1
- **Check**: For each special lagna (Hora, Ghati, Varnada, Shree, Indu, Vighati, Pranapada), recompute from birth time using standard formulas; result must match recorded sign/house.
- **Failure**: Special‑lagna mismatch indicates computation error.

**INV.L1.15 — 36 Saham Formulas**
- **Purpose**: Ensure each of the 36 Tajika sahams computes correctly from planet positions.
- **Input**: `SAH.*.sign`, `SAH.*.house` from L1 §12.2
- **Check**: For each saham, recompute using standard formula (e.g., Roga = Lagna + Mars - Saturn); result must match recorded sign/house.
- **Failure**: Saham mismatch indicates computation error.

**INV.L1.16 — Arudha Pada Calculations**
- **Purpose**: Ensure arudha padas derive correctly from planet and house lord positions.
- **Input**: `ARD.*.sign`, `ARD.*.house` from L1 §13
- **Check**: For each arudha (AL, A2–A12, UL, etc.), recompute from appropriate lords; result must match recorded sign/house.
- **Failure**: Arudha mismatch indicates computation error.

**INV.L1.17 — D9 Navamsa Chart**
- **Purpose**: Ensure D9 positions derive correctly from D1 positions.
- **Input**: `D9.*.sign`, `D9.*.house` from L1 §3.2
- **Check**: For each planet, compute expected D9 sign = (D1 sign × 3 + floor(D1 degree / 3.333…)) mod 12; must match recorded D9 sign.
- **Failure**: D9 mismatch indicates computation error.

**INV.L1.18 — Chara Karaka 8‑Order**
- **Purpose**: Ensure Chara Karaka ordering follows decreasing longitude rule.
- **Input**: `KRK.*.planet`, `PLN.*.abs_long` from L1 §10
- **Check**: The eight karakas (Atma, Amatya, …) must be assigned to the eight planets (excluding Rahu/Ketu) in order of decreasing longitude.
- **Failure**: Karaka ordering mismatch indicates transcription error.

**INV.L1.19 — Deity‑Nakshatra Canonical Map**
- **Purpose**: Ensure deity assignments match nakshatra‑deity canonical mapping.
- **Input**: `NAK.*.deity` from L1 §2.1 (nakshatra table)
- **Check**: Each nakshatra’s deity must match standard Jyotish mapping (Ashwini → Ashwini Kumaras, Bharani → Yama, etc.).
- **Failure**: Deity mismatch indicates transcription error.

### §4.5 — Family F5: Structural (5 invariants)

**INV.L1.20 — MET.DASHA.CURRENT Window**
- **Purpose**: Ensure current dasha window matches the present date (2026‑04‑19).
- **Input**: `MET.DASHA.CURRENT`, `MET.DASHA.CURRENT.START`, `MET.DASHA.CURRENT.END`
- **Check**: 2026‑04‑19 must fall within `[START, END)`.
- **Failure**: Current date outside dasha window indicates stale data.

**INV.L1.21 — INTENTIONALLY_EXCLUDED Markers Have Governance Refs**
- **Purpose**: Ensure every `[INTENTIONALLY_EXCLUDED]` marker in L1 has a `governance_ref:` pointing to a justification.
- **Input**: Whole L1 file text
- **Check**: Each occurrence of `[INTENTIONALLY_EXCLUDED]` must be followed by `governance_ref:` within the same YAML block.
- **Failure**: Missing governance reference indicates incomplete documentation.

**INV.L1.22 — Dual‑Engine Notes Cite Both FORENSIC+JH**
- **Purpose**: Ensure dual‑engine divergence notes explicitly name both engines.
- **Input**: Whole L1 file text
- **Check**: Each `[DUAL‑ENGINE RECONCILIATION NOTE]` must mention both “FORENSIC” and “JH” (or “Jagannatha Hora”).
- **Failure**: Incomplete dual‑engine note indicates incomplete documentation.

**INV.L1.23 — §27 Ledger Consistency**
- **Purpose**: Ensure the completeness ledger (§27) accurately reflects which sections are complete.
- **Input**: L1 §27 table
- **Check**: For each section marked `complete: yes`, the corresponding section must exist and be non‑empty. For each `complete: no`, the section may be missing or placeholder.
- **Failure**: Ledger‑content mismatch indicates stale ledger.

**INV.L1.24 — Varshphal Tajika Mirror**
- **Purpose**: Ensure Varshphal (annual) chart mirrors natal chart patterns.
- **Input**: L1 §22 (Varshphal 2026–2027)
- **Check**: Key natal signatures (e.g., Saturn exalted, Jupiter own‑sign) should appear similarly strengthened/weakened in Varshphal chart.
- **Failure**: Contradictory Varshphal pattern may indicate computation error (soft check; warning, not hard failure).

### §4.6 — Implementation Notes

Each invariant will be implemented as a Python function in `invariants_l1.py`. The functions must be **pure‑Python, deterministic, and LLM‑free**. They will read the L1 file via `yaml.safe_load` for YAML blocks and regex for tables.

**Output artifact**: `NUMERIC_INVARIANTS.json` with keys `INV.L1.NN: {passed: bool, message: str, detail: dict}`.

**Success criterion**: All 24 invariants pass (`passed: true`).

**Failure handling**: Any failure → HARD BLOCK. Stop verification, report failure to user, do not proceed to L2.

---

## §5 — Verification Layers L0–L7

Every layer follows the same template:

```
### L<N>.<M> <check name>
Purpose | Input files | Output artifact | Implementation [pure‑Python | LLM‑assisted | hybrid]
Reuse/extend [audit.py:function | verify_corpus.py:function | new]
Success criteria | Failure handling [auto‑fix | flag‑for‑brain | escalate‑to‑human]
```

### L0 — Structural Integrity (pure‑Python, ~5 min)

**L0.1 — File Inventory + Version‑Latest Resolver**
- **Purpose**: List all files in corpus, resolve latest version when multiple versions exist.
- **Input**: Entire project directory tree
- **Output artifact**: `FILE_INVENTORY.json` with `{path: str, version: str, status: str, superseded_by: optional}`
- **Implementation**: pure‑Python, reuse `verify_corpus.py::find_latest_versions`
- **Success criteria**: All files parsed without error; version strings extracted correctly.
- **Failure handling**: Flag for brain (manual correction needed).

**L0.2 — YAML Frontmatter Validator**
- **Purpose**: Ensure every Markdown file with YAML frontmatter has required keys per file class.
- **Input**: All `.md` files
- **Output artifact**: `YAML_VALIDATION.json` with `{file: str, valid: bool, missing_keys: list}`
- **Implementation**: pure‑Python (pyyaml)
- **Success criteria**: All current files have valid frontmatter with required keys.
- **Failure handling**: Auto‑fix minor issues (add missing optional keys); flag missing required keys for brain.

**L0.3 — Encoding + Line‑Ending + BOM Check**
- **Purpose**: Ensure all files are UTF‑8, LF line endings, no BOM.
- **Input**: All text files
- **Output artifact**: `ENCODING_REPORT.json` with `{file: str, encoding: str, bom: bool, line_endings: str}`
- **Implementation**: pure‑Python
- **Success criteria**: All files UTF‑8, LF, no BOM.
- **Failure handling**: Auto‑convert (safe) or flag for brain.

**L0.4 — Markdown Structural Sanity**
- **Purpose**: Check balanced code fences, table pipe counts match headers.
- **Input**: All `.md` files
- **Output artifact**: `MARKDOWN_SYNTAX.json` with `{file: str, issues: list}`
- **Implementation**: pure‑Python
- **Success criteria**: No unbalanced fences, all tables structurally valid.
- **Failure handling**: Flag for brain (manual repair needed).

**L0.5 — Stable‑ID Uniqueness Within Each Namespace**
- **Purpose**: Ensure each stable ID (`PLN.*`, `HSE.*`, etc.) appears only once in L1.
- **Input**: `FORENSIC_ASTROLOGICAL_DATA_v8_0.md`
- **Output artifact**: `STABLE_ID_DUPLICATES.json` with `{namespace: str, duplicates: list}`
- **Implementation**: pure‑Python (regex extraction)
- **Success criteria**: No duplicates within any namespace.
- **Failure handling**: Flag for brain (manual deduplication needed).

### L1 — Forensic v8.0 Internal Invariants (pure‑Python, ~10 min)

As defined in §4. Execute all 24 invariants via `invariants_l1.py`.

- **Output artifact**: `NUMERIC_INVARIANTS.json`
- **Success criteria**: All 24 invariants pass.
- **Failure handling**: **HARD BLOCK**. Stop verification, report failure.

### L2 — Matrix Files ↔ L1 (pure‑Python, ~5 min)

**L2.1 — Exhaustive Matrix‑L1 Trace**
- **Purpose**: Verify every row in each of the 5 MATRIX files (`MATRIX_HOUSES.md`, `MATRIX_PLANETS.md`, `MATRIX_SIGNS.md`, `MATRIX_DASHA_PERIODS.md`, `MATRIX_DIVISIONALS.md`) correctly traces back to L1.
- **Input**: Matrix files, L1 file
- **Output artifact**: `MATRIX_TRACE.json` with `{matrix: str, rows_checked: int, rows_passed: int, failures: list}`
- **Implementation**: pure‑Python, extend `verify_corpus.py::spot_check_matrix_files` to full‑sweep
- **Success criteria**: 100% of rows pass trace.
- **Failure handling**: **HARD BLOCK** for any failure. Stop verification.

### L2.5a — Synthesis Internal Consistency (pure‑Python, ~3 min)

**L2.5a.1 — MSR Signal Count vs Claim**
- **Purpose**: Verify MSR_v3_0.md (post‑merge) contains exactly 500 defined signals.
- **Input**: `MSR_v3_0.md` (after §6 merge)
- **Output artifact**: `MSR_COUNT.json` with `{claimed: 500, actual: int, missing_ids: list}`
- **Implementation**: pure‑Python (count `SIG.MSR.NNN:` blocks)
- **Success criteria**: Actual count = 500 (or 500 + suffix variants).
- **Failure handling**: Flag for brain (gap analysis needed).

**L2.5a.2 — CDLM 81‑Cell Completeness**
- **Purpose**: Verify CDLM_v1_1.md defines all 81 cells (9×9 matrix).
- **Input**: `CDLM_v1_1.md`
- **Output artifact**: `CDLM_COMPLETENESS.json` with `{total_cells: 81, defined: int, missing: list}`
- **Implementation**: pure‑Python (extract `CDLM.DN.DM:` blocks)
- **Success criteria**: All 81 cells defined.
- **Failure handling**: Flag for brain.

**L2.5a.3 — RM Element Inventory**
- **Purpose**: Reconcile RM_v2_0.md claimed 32 elements vs defined elements.
- **Input**: `RM_v2_0.md`
- **Output artifact**: `RM_INVENTORY.json` with `{claimed: 32, defined: int, missing_ids: list, extra_ids: list}`
- **Implementation**: pure‑Python (extract `RM.NN:` blocks)
- **Success criteria**: All claimed elements defined; no undefined IDs cited elsewhere.
- **Failure handling**: Flag for brain.

**L2.5a.4 — UCN Part Structure**
- **Purpose**: Verify UCN_v4_0.md has Parts I–IV, all §X anchors resolve.
- **Input**: `UCN_v4_0.md`
- **Output artifact**: `UCN_STRUCTURE.json` with `{parts: list, sections: list, dangling_refs: list}`
- **Implementation**: pure‑Python (parse TOC, extract section anchors)
- **Success criteria**: No dangling `§X` references.
- **Failure handling**: Flag for brain.

### L2.5b — L2.5 ↔ L1 Cross‑Reference (pure‑Python + LLM spot‑check, ~15 min)

**L2.5b.1 — Entity Extraction + Placement Consistency**
- **Purpose**: Extract entities (`entities_involved` from MSR, regex from CDLM/RM/UCN) and verify placement consistency with L1.
- **Input**: MSR_v3_0.md, CDLM_v1_1.md, RM_v2_0.md, UCN_v4_0.md, L1
- **Output artifact**: `ENTITY_PLACEMENT_CONSISTENCY.json` with `{entity: str, occurrences: int, consistent: bool, discrepancies: list}`
- **Implementation**: pure‑Python, reuse `audit.py::check_placement_consistency` (exhaustive)
- **Success criteria**: 100% consistency.
- **Failure handling**: **HARD BLOCK** for any inconsistency.

**L2.5b.2 — Numeric Citation Traceability**
- **Purpose**: Verify numeric values (strength scores, confidence, etc.) are within plausible ranges and traceable to L1 derivations.
- **Input**: MSR_v3_0.md, CDLM_v1_1.md, RM_v2_0.md
- **Output artifact**: `NUMERIC_TRACE.json` with `{file: str, numeric_fields_checked: int, anomalies: list}`
- **Implementation**: pure‑Python (range checks, cross‑reference to L1 numeric aggregates)
- **Success criteria**: No out‑of‑range values; derivations plausible.
- **Failure handling**: Flag for brain.

**L2.5b.3 — Haiku Worker LLM Spot‑Check for Semantic Drift**
- **Purpose**: Sample 5% of MSR signals and CDLM cells, ask Haiku‑grade LLM whether the interpretation text matches L1 facts.
- **Input**: Sampled entries, L1
- **Output artifact**: `SEMANTIC_DRIFT.json` with `{sampled: int, passed: int, failures: list}`
- **Implementation**: LLM‑assisted, reuse `verify_corpus.py::run_worker_phase`
- **Success criteria**: ≥95% pass rate.
- **Failure handling**: Flag for brain (review failed samples).

### L2.5c — Citation Graph Integrity (pure‑Python, ~5 min) **Most Important New Work**

**L2.5c.1 — Citation Graph Construction**
- **Purpose**: Build `CITATION_GRAPH.graphml` with typed nodes (MSR, CDLM, RM, UCN, L1) and edges (cites, anchors‑to, derives‑from, conflicts‑with).
- **Input**: All L2.5 and L3 files
- **Output artifact**: `CITATION_GRAPH.graphml`, `CITATION_GRAPH_report.json`
- **Implementation**: pure‑Python (`citation_graph.py`)
- **Success criteria**: Graph builds without error.
- **Failure handling**: Flag for brain.

**L2.5c.2 — Dangling‑Edge Report**
- **Purpose**: Identify citations that point to undefined IDs.
- **Input**: Citation graph
- **Output artifact**: `DANGLING_EDGES.json` with `{source: str, target_id: str, context: str}`
- **Success criteria**: Zero dangling edges.
- **Failure handling**: **HARD BLOCK**. Stop verification.

**L2.5c.3 — Orphan‑Definition Report**
- **Purpose**: Identify defined IDs that are never cited.
- **Input**: Citation graph
- **Output artifact**: `ORPHAN_DEFINITIONS.json` with `{id: str, file: str}`
- **Success criteria**: Informational only (orphans may be intentional).
- **Failure handling**: Flag for brain (review orphans).

**L2.5c.4 — Cycle + Depth Analysis**
- **Purpose**: Detect circular citations, compute graph depth.
- **Input**: Citation graph
- **Output artifact**: `GRAPH_TOPOLOGY.json` with `{cycles: list, max_depth: int, connected_components: int}`
- **Success criteria**: Informational only.
- **Failure handling**: Flag for brain (review cycles).

### L3 — Domain Reports (pure‑Python + LLM, ~20 min)

**L3.1 — Report Inventory**
- **Purpose**: Verify 9 domain reports exist.
- **Input**: `03_DOMAIN_REPORTS/`
- **Output artifact**: `DOMAIN_REPORTS_INVENTORY.json` with `{expected: 9, found: list}`
- **Success criteria**: 9 reports found.
- **Failure handling**: Flag for brain.

**L3.2 — UCN Parent References**
- **Purpose**: Verify each report’s frontmatter contains `parent_UCN_version:` pointing to UCN v4.0.
- **Input**: All 9 reports
- **Output artifact**: `UCN_PARENT_REFERENCE.json` with `{report: str, has_parent: bool, parent_version: str}`
- **Success criteria**: All reports have correct parent reference.
- **Failure handling**: Flag for brain.

**L3.3 — Citation Density Per Report**
- **Purpose**: Count MSR/CDLM/RM citations per report; flag outliers.
- **Input**: All 9 reports
- **Output artifact**: `CITATION_DENSITY.json` with `{report: str, msr_citations: int, cdlm_citations: int, rm_citations: int}`
- **Success criteria**: Informational only.
- **Failure handling**: Flag for brain (review low‑density reports).

**L3.4 — Entity‑Naming Uniformity**
- **Purpose**: Produce `NAMING_VARIANTS.json` mapping variants to canonical names (e.g., Śani/Shani/शनि → Saturn).
- **Input**: All L2.5 and L3 files
- **Output artifact**: `NAMING_VARIANTS.json`
- **Success criteria**: Canonical mapping covers all variants.
- **Failure handling**: Flag for brain (add missing mappings).

**L3.5 — Cross‑Report Coherence**
- **Purpose**: When two reports cite the same MSR signal, their valence/temporal characterization must match.
- **Input**: All 9 reports, MSR_v3_0.md
- **Output artifact**: `CROSS_REPORT_COHERENCE.json` with `{msr_id: str, reports: list, conflict: bool, details: str}`
- **Implementation**: LLM‑assisted spot‑check
- **Success criteria**: No conflicts.
- **Failure handling**: Flag for brain (resolve conflicts).

**L3.6 — L3 ↔ L1 Placement Consistency**
- **Purpose**: Verify domain‑report interpretations do not contradict L1 placements.
- **Input**: All 9 reports, L1
- **Output artifact**: `L3_L1_CONSISTENCY.json` with `{report: str, passed: bool, discrepancies: list}`
- **Implementation**: LLM‑assisted spot‑check
- **Success criteria**: No contradictions.
- **Failure handling**: Flag for brain.

### L4 — Entity Registry Construction (pure‑Python, ~3 min)

**L4.1 — Build Entity Registry**
- **Purpose**: Create `ENTITY_REGISTRY.json` for downstream vectorization vocabulary.
- **Input**: All files
- **Output artifact**: `ENTITY_REGISTRY.json` with `{canonical_name: str, aliases: list, type: str, l1_id: str, occurrence_count: int}`
- **Implementation**: pure‑Python (`entity_registry.py`)
- **Success criteria**: Registry contains all planets, houses, signs, nakshatras, special lagnas, sahams, yogas.
- **Failure handling**: Flag for brain (missing entities).

### L5 — Citation Graph Export (pure‑Python, ~1 min)

**L5.1 — Export GraphML**
- **Purpose**: Produce final `CITATION_GRAPH.graphml` loadable by Neo4j/NetworkX/RDFLib.
- **Input**: Citation graph from L2.5c
- **Output artifact**: `CITATION_GRAPH.graphml`
- **Implementation**: pure‑Python
- **Success criteria**: GraphML validates.
- **Failure handling**: Flag for brain.

### L6 — Numeric‑Invariant Rollup (pure‑Python, trivial)

**L6.1 — Aggregate Results**
- **Purpose**: Roll up L0–L5 results into single summary.
- **Input**: All previous JSON artifacts
- **Output artifact**: `VERIFICATION_SUMMARY.json`
- **Implementation**: pure‑Python
- **Success criteria**: Informational.
- **Failure handling**: None.

### L7 — Go/No‑Go Synthesis (rule‑based + LLM, ~2 min)

**L7.1 — Produce Readiness Report**
- **Purpose**: Generate `READINESS_REPORT.md` with GO/CONDITIONAL‑GO/NO‑GO verdict.
- **Input**: All verification artifacts
- **Output artifact**: `READINESS_REPORT.md`
- **Implementation**: rule‑based + LLM synthesis
- **Success criteria**: Report clearly states verdict and rationale.
- **Failure handling**: None.

**Verdict rules**:
- **GO**: All L0–L2 passed, L2.5c dangling edges = 0, L3 conflicts = 0.
- **CONDITIONAL‑GO**: L0–L2 passed, L2.5c dangling edges = 0, L3 conflicts present but documented.
- **NO‑GO**: Any L0–L2 failure, or L2.5c dangling edges > 0.

---

## §6 — MSR Merge Task (v1_0 + v2_0 → v3_0)

**Execute this task BEFORE L2.5a.1 (MSR signal count check).**

### §6.1 — Input Files

1. `025_HOLISTIC_SYNTHESIS/MSR_v1_0.md` — 420 signals (some as full YAML blocks, some as table rows)
2. `025_HOLISTIC_SYNTHESIS/MSR_v2_0.md` — 60 re‑rendered signals: MSR.022, 024, 391, 402, 402b, 404, 407, 413 + MSR.421–443 + MSR.444–496 + 391a/b/c
3. `00_ARCHITECTURE/AUDIT_REPORT_v1_0.md`, `FIX_SESSION_00*_COMPLETION.md` — for correction provenance

### §6.2 — Output File

`025_HOLISTIC_SYNTHESIS/MSR_v3_0.md` with:
- All 500 signals as full `SIG.MSR.NNN:` YAML blocks
- For signals corrected in v2_0, use the v2_0 version
- For signals unchanged from v1_0, carry forward as‑is
- Frontmatter: `version: 3.0`, `status: CURRENT`, `supersedes: MSR_v2_0.md, MSR_v1_0.md`
- Each signal entry has `provenance:` field: `v1_0‑confirmed‑by‑v8` / `v2_0‑rerendered` / `v2_0‑new‑421‑443` / `v2_0‑new‑444‑496`

### §6.3 — Merge Algorithm (pure‑Python)

Write `msr_merge.py` with steps:

1. Parse all `SIG.MSR.NNN:` blocks from both files → dict keyed by signal_id.
2. For each ID in range [1, 496] plus suffixes `402b`, `391a`, `391b`, `391c`:
   - If present in v2_0 → use v2_0 version (corrected)
   - Else if present in v1_0 → use v1_0 version with `provenance: v1_0‑confirmed‑by‑v8`
   - Else → flag as `UNDEFINED` (should not happen if registries complete)
3. Emit ordered output (MSR.001 → MSR.496 + sub‑variants).
4. Archive source files:
   - Add `status: ARCHIVED_BY_v3_0` to their frontmatter
   - Move to `99_ARCHIVE/025_HOLISTIC_SYNTHESIS/` (create directory)
5. Update `025_HOLISTIC_SYNTHESIS/CLAUDE.md` to point to v3_0.
6. Update `00_ARCHITECTURE/FILE_REGISTRY_v1_0.md` §4 entry.

### §6.4 — Verification Gate After Merge

Before proceeding to L2.5c citation graph:

- [ ] Count of `SIG.MSR.NNN:` blocks in MSR_v3_0 = 500 (or 500 + n suffixes)
- [ ] Every MSR ID cited in UCN/CDLM/RM/L3 resolves in MSR_v3_0
- [ ] No duplicate IDs
- [ ] All entries pass schema validation

If any check fails, stop and debug merge before continuing.

---

## §7 — Tooling Strategy

### §7.1 — Extend Existing Utilities

| Utility | Extension Needed | Use in Layer |
|---------|------------------|--------------|
| `verify_corpus.py` | Extract `find_latest_versions()`, `spot_check_matrix_files()` patterns | L0.1, L2.1 |
| `audit.py` | Extract `check_placement_consistency()`, `ERROR_PATTERNS` | L2.5b.1, L3.6 |
| `corpus_common.py` (new) | Shared functions: YAML parsing, regex extraction, file I/O | All layers |

### §7.2 — New Python Modules

Create these modules in project root:

1. `invariants_l1.py` — 24 invariant functions (§4)
2. `invariants_l2.py` — matrix‑L1 exhaustive trace
3. `msr_registry_builder.py` — builds `MSR_REGISTRY_UNIFIED.json` (runtime use)
4. `citation_graph.py` — builds citation graph
5. `entity_registry.py` — builds entity registry
6. `readiness_synthesizer.py` — composes L7 readiness report
7. `run_verification.py` — orchestrator (runs L0–L7 in order)

### §7.3 — JSON Schemas

Create `schema/` directory with:

- `msr_signal.schema.json`
- `cdlm_cell.schema.json`
- `rm_element.schema.json`
- `ucn_section.schema.json`

Use these for validation in L0.2 and L2.5a.

### §7.4 — Test Suite

Create `tests/test_invariants_l1.py` with one pytest test per INV.L1.NN. Run after verification to ensure regression protection.

### §7.5 — Archive Cleanup Scripts

Optional: script to move superseded versions to `99_ARCHIVE/` with proper frontmatter updates.

---

## §8 — Execution Order DAG and Dependencies

```
    §6 MSR merge
        |
        v
    L0.1–L0.5 (structural)
        |
        v
    L1 (24 invariants) ───┐
        |                 |
        v                 v
    L2 (matrix trace)   L2.5a (synthesis internal)
        |                 |
        +─────────+───────+
                  |
                  v
               L2.5b (cross‑ref)
                  |
                  v
               L2.5c (citation graph)
                  |
                  v
               L3 (domain reports)
                  |
                  v
               L4 (entity registry)
                  |
                  v
               L5 (graph export)
                  |
                  v
               L6 (rollup)
                  |
                  v
               L7 (readiness report)
```

**Critical path**: MSR merge → L0 → L1 → L2 → L2.5c. Failures in this path are HARD BLOCKS.

**Parallelizable**: L2.5a can run concurrently with L2 after L1 passes.

**LLM‑assisted layers**: L2.5b.3, L3.5, L3.6, L7.1. These can run while Python layers execute.

---

## §9 — Escalation Matrix

| Issue Type | Auto‑Fix | Flag for Brain (LLM) | Escalate to Human (Native/Acharya) |
|------------|----------|----------------------|------------------------------------|
| Missing optional YAML key | ✓ Add default | | |
| File encoding not UTF‑8 | ✓ Convert if safe | ✓ If unsafe | |
| L1 invariant failure | | **HARD BLOCK** → stop | ✓ Native must fix L1 |
| Matrix‑L1 trace failure | | **HARD BLOCK** → stop | ✓ Native must fix matrix |
| MSR dangling citation | | **HARD BLOCK** → stop | ✓ Native must define missing signal |
| Entity‑naming variant | ✓ Add to canonical mapping | | |
| Cross‑report conflict | | ✓ Document conflict | ✓ Native must resolve |
| Semantic‑drift spot‑check fail | | ✓ Review sample | ✓ If systematic |
| Jyotish semantic validity | | | ✓ **Acharya review only** |
| Remedial appropriateness | | | ✓ **Acharya review only** |
| Dual‑engine divergence beyond tolerance | | | ✓ **Policy decision** |

**Non‑automatable (explicitly out of scope)**:
1. Jyotish semantic validity of any interpretation text
2. Whether a remedial measure is spiritually appropriate
3. Whether an MSR `valence` judgment is culturally/traditionally sound
4. Whether acharya‑grade quality (per CLAUDE.md §Quality Standard) has been achieved
5. Dual‑engine divergences exceeding documented tolerance (policy decision)
6. Any L1 edit (L1 is edited by human + brain only)
7. Cross‑report coherence conflicts where automated detection confirms a real conflict

---

## §10 — Readiness Matrix (GO/NO‑GO Criteria for Vectorization + Graph)

### GO Criteria (All Must Be True)

- [ ] L0: All structural checks pass
- [ ] L1: All 24 invariants pass
- [ ] L2: 100% matrix‑L1 trace passes
- [ ] L2.5c: Zero dangling edges in citation graph
- [ ] L3: No cross‑report conflicts
- [ ] Entity registry covers all planets, houses, signs, nakshatras, special lagnas, sahams, yogas
- [ ] Citation graph exports successfully as GraphML

### CONDITIONAL‑GO Criteria

- All GO criteria except:
  - L3 has conflicts but they are documented and acknowledged
  - Orphan definitions exist but are justified
  - Semantic‑drift spot‑check pass rate 90‑95%

### NO‑GO Criteria (Any One)

- Any L0, L1, or L2 failure
- L2.5c dangling edges > 0
- Missing required domain reports (<9)
- MSR merge fails to produce 500 signals

### Downstream Gates

**Vectorization** requires:
- `ENTITY_REGISTRY.json`
- `NAMING_VARIANTS.json`
- `CITATION_GRAPH.graphml`

**Graph‑model construction** requires:
- `CITATION_GRAPH.graphml`
- `VERIFICATION_SUMMARY.json` (confidence)

---

## §11 — Outputs Produced

All artifacts go to `verification_artifacts/<timestamp>/` where timestamp = `YYYYMMDD_HHMMSS`.

### Core Artifacts (14 files)

1. `FILE_INVENTORY.json` — L0.1
2. `YAML_VALIDATION.json` — L0.2
3. `ENCODING_REPORT.json` — L0.3
4. `MARKDOWN_SYNTAX.json` — L0.4
5. `STABLE_ID_DUPLICATES.json` — L0.5
6. `NUMERIC_INVARIANTS.json` — L1
7. `MATRIX_TRACE.json` — L2
8. `MSR_COUNT.json` — L2.5a.1
9. `CDLM_COMPLETENESS.json` — L2.5a.2
10. `RM_INVENTORY.json` — L2.5a.3
11. `UCN_STRUCTURE.json` — L2.5a.4
12. `ENTITY_PLACEMENT_CONSISTENCY.json` — L2.5b.1
13. `NUMERIC_TRACE.json` — L2.5b.2
14. `SEMANTIC_DRIFT.json` — L2.5b.3
15. `CITATION_GRAPH.graphml` — L2.5c.1
16. `DANGLING_EDGES.json` — L2.5c.2
17. `ORPHAN_DEFINITIONS.json` — L2.5c.3
18. `GRAPH_TOPOLOGY.json` — L2.5c.4
19. `DOMAIN_REPORTS_INVENTORY.json` — L3.1
20. `UCN_PARENT_REFERENCE.json` — L3.2
21. `CITATION_DENSITY.json` — L3.3
22. `NAMING_VARIANTS.json` — L3.4
23. `CROSS_REPORT_COHERENCE.json` — L3.5
24. `L3_L1_CONSISTENCY.json` — L3.6
25. `ENTITY_REGISTRY.json` — L4.1
26. `VERIFICATION_SUMMARY.json` — L6.1
27. `READINESS_REPORT.md` — L7.1

### Supporting Files (Created During Execution)

- `msr_merge.py` — merge script
- `invariants_l1.py` — invariant checks
- `invariants_l2.py` — matrix trace
- `citation_graph.py` — graph builder
- `entity_registry.py` — registry builder
- `readiness_synthesizer.py` — report composer
- `run_verification.py` — orchestrator
- `corpus_common.py` — shared utilities
- `schema/*.schema.json` — JSON schemas
- `tests/test_invariants_l1.py` — test suite

### Run Log

`run_log.txt` — stdout/stderr of entire verification run, timestamped.

---

## §12 — Rollback and Safety

### §12.1 — Git Safety

- Start with `git tag verification‑start‑$(date +%Y%m%d‑%H%M%S)`
- Commit each major artifact set (L0, L1, …) with message `Verification L<N>: <summary>`
- If verification fails, roll back to start tag: `git reset --hard verification‑start‑*`
- Never force‑push; never rewrite public history.

### §12.2 — No‑Write Guardrails

- **L1 file**: Read‑only. If an invariant fails, do NOT edit L1. Report to native.
- **Matrix files**: Read‑only. If trace fails, do NOT edit matrices. Report to native.
- **MSR merge**: Creates new file `MSR_v3_0.md`; archives old versions. This is the only write allowed to synthesis files.
- **Verification artifacts**: Write only to `verification_artifacts/` subdirectory.
- **Schema/test files**: Write to project root (new tooling).

### §12.3 — Failure Recovery

If any HARD BLOCK occurs:

1. Stop verification.
2. Document failure in `READINESS_REPORT.md` with exact error.
3. Offer native three options:
   - Fix the issue manually and restart verification
   - Accept CONDITIONAL‑GO with documented failure
   - Abort verification and address issue in next session
4. Do not proceed without native’s explicit direction.

### §12.4 — Cost and Time Guards

- **Cost ceiling**: $8 LLM cost (declared in frontmatter). Use Haiku for spot‑checks; use Sonnet/DeepSeek only where necessary.
- **Time ceiling**: 8 hours wall‑clock. If verification exceeds this, pause and report progress to native.
- **Progress checkpoints**: After each layer, print summary and estimate remaining time.

---

## Appendix A — ID Namespace Catalogue (29 Namespaces from L1 §0.1)

| Namespace | Example | Meaning | Used in Verification |
|-----------|---------|---------|---------------------|
| `MET.*` | `MET.BIRTH.DATE` | Metadata | L1 invariants |
| `PLN.*` | `PLN.MOON` | Planet | L1, L2.5b |
| `HSE.*` | `HSE.7` | House (1–12) | L1, L2.5b |
| `SGN.*` | `SGN.CAPRICORN` | Zodiac sign | L1, L2.5b |
| `NAK.*` | `NAK.PURVA_BHADRAPADA` | Nakshatra | L1 |
| `D1.*` … `D60.*` | `D9.LAGNA` | Divisional chart | L1 |
| `KP.*` | `KP.CUSP.7` | KP system | L1 |
| `DSH.V.*` | `DSH.V.MD.MERCURY.2010` | Vimshottari Dasha | L1 |
| `DSH.Y.*` | `DSH.Y.BHADRIKA.2021` | Yogini Dasha | L1 |
| `DSH.C.*` | `DSH.C.SCORPIO.2026` | Jaimini Chara Dasha | L1 |
| `SBL.*` | `SBL.SHADBALA.SATURN` | Strength metric | L1 |
| `AVG.*` | `AVG.SAV.LIBRA` | Ashtakavarga | L1 |
| `KAK.*` | `KAK.PISCES.Z4` | Saturn Kakshya zone | L1 |
| `AVS.*` | `AVS.MOON` | Avastha state | L1 |
| `KRK.*` | `KRK.ATMA` | Chara Karaka role | L1 |
| `UPG.*` | `UPG.GULIKA` | Upagraha | L1 |
| `SAH.*` | `SAH.PUNYA` | Saham (Tajika lot) | L1 |
| `LAG.*` | `LAG.HORA` | Special Lagna | L1, L2.5b |
| `ARD.*` | `ARD.AL` | Arudha | L1 |
| `DEV.*` | `DEV.ISHTA` | Deity assignment | L1 |
| `ASP.*` | `ASP.SATURN.MOON` | Planetary aspect | L1 |
| `TRS.*` | `TRS.SADE_SATI.C2.P3` | Transit cycle | L1 |
| `PCG.*` | `PCG.TITHI` | Panchang component | L1 |
| `KOT.*` | `KOT.SWAMI` | Kota Chakra component | L1 |
| `BVB.*` | `BVB.JH.5` | Bhava Bala (JH engine) | L1 |
| `IKP.*` | `IKP.SATURN` | Ishta/Kashta Phala | L1 |
| `PVC.*` | `PVC.MERCURY` | Pancha‑Vargeeya Classification | L1 |
| `YGA.*` | `YGA.D1.KALPADRUMA` | Yoga register | L1 |
| `LON.*` | `LON.KALACHAKRA` | Longevity indicator | L1 |

---

## Appendix B — Skeletal Python Snippets (Reusable Patterns)

### B.1 — Parse YAML Frontmatter

```python
import yaml, re

def extract_frontmatter(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    match = re.match(r'^---\s*\n(.*?)\n---\s*\n', content, re.DOTALL)
    if not match:
        return {}
    return yaml.safe_load(match.group(1))
```

### B.2 — Extract All `SIG.MSR.NNN:` Blocks

```python
import re

def extract_msr_blocks(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    pattern = r'^SIG\.MSR\.(\d{3}[a-z]?):\s*\n((?:  .*\n)*)'
    blocks = {}
    for match in re.finditer(pattern, content, re.MULTILINE):
        signal_id = match.group(1)
        yaml_text = match.group(2)
        # Indent removal
        yaml_text = re.sub(r'^  ', '', yaml_text, flags=re.MULTILINE)
        blocks[signal_id] = yaml.safe_load(yaml_text)
    return blocks
```

### B.3 — Check Placement Consistency

```python
def check_placement(entity, file_context, l1_ground_truth):
    """Return True if entity's placement matches L1 ground truth."""
    # entity format: {"type": "planet"/"lagna"/"saham", "name": "Jupiter", "sign": "Sagittarius", "house": 9}
    l1_record = l1_ground_truth.get(entity['type'], {}).get(entity['name'])
    if not l1_record:
        return False, f"Entity {entity['name']} not found in L1"
    if (entity['sign'] == l1_record['sign'] and 
        entity['house'] == l1_record['house']):
        return True, None
    return False, f"Mismatch: {entity} vs L1 {l1_record}"
```

### B.4 — Build Citation Graph

```python
import networkx as nx

def build_citation_graph(files):
    G = nx.DiGraph()
    for filepath, citations in files.items():
        node_id = f"file:{filepath}"
        G.add_node(node_id, type='file', path=filepath)
        for cite in citations:
            target_id = f"cite:{cite}"
            G.add_node(target_id, type='citation', text=cite)
            G.add_edge(node_id, target_id, relation='cites')
    return G
```

---

## Appendix C — JSON Schemas for Output Artifacts

### C.1 — MSR Signal Schema (`schema/msr_signal.schema.json`)

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "MSR Signal",
  "type": "object",
  "required": ["signal_name", "signal_type", "entities_involved", "domains_affected", "strength_score", "confidence", "valence", "temporal_characterization", "mechanism"],
  "properties": {
    "signal_name": {"type": "string"},
    "signal_type": {"enum": ["structural_architecture", "dasha_activated", "transit_sensitive", "annual", "life_phase", "yoga", "saham", "special_lagna", "karaka", "aspect", "derived"]},
    "entities_involved": {"type": "array", "items": {"type": "string"}},
    "domains_affected": {"type": "array", "items": {"enum": ["D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9"]}},
    "strength_score": {"type": "number", "minimum": 0.0, "maximum": 1.0},
    "confidence": {"type": "number", "minimum": 0.0, "maximum": 1.0},
    "valence": {"enum": ["benefic", "malefic", "mixed", "neutral"]},
    "temporal_characterization": {"enum": ["structural (natal)", "dasha-activated", "transit-sensitive", "annual (Varshaphal)", "life-phase"]},
    "mechanism": {"type": "string"},
    "msr_anchors_self": {"type": "array", "items": {"type": "string"}},
    "cdlm_anchors": {"type": "array", "items": {"type": "string"}},
    "rm_anchors": {"type": "array", "items": {"type": "string"}},
    "ucn_anchors": {"type": "array", "items": {"type": "string"}},
    "falsifier_window": {"type": "string"},
    "reconciliation": {"type": "string"},
    "provenance": {"enum": ["v1_0-confirmed-by-v8", "v2_0-rerendered", "v2_0-new-421-443", "v2_0-new-444-496"]}
  }
}
```

### C.2 — CDLM Cell Schema (`schema/cdlm_cell.schema.json`)

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "CDLM Cell",
  "type": "object",
  "required": ["row_domain", "col_domain", "linkage_type", "primary_mechanism", "msr_anchors", "strength", "direction", "valence", "key_finding"],
  "properties": {
    "row_domain": {"enum": ["Career", "Wealth", "Relationships", "Health", "Children", "Spirit", "Parents", "Mind", "Travel"]},
    "col_domain": {"enum": ["Career", "Wealth", "Relationships", "Health", "Children", "Spirit", "Parents", "Mind", "Travel"]},
    "linkage_type": {"enum": ["feeds", "constrains", "mirrors", "amplifies", "compensates", "contradicts"]},
    "primary_mechanism": {"type": "string"},
    "msr_anchors": {"type": "array", "items": {"type": "string"}},
    "strength": {"type": "number", "minimum": 0.0, "maximum": 1.0},
    "direction": {"enum": ["row→col", "col→row", "bidirectional"]},
    "valence": {"enum": ["benefic", "malefic", "mixed", "neutral"]},
    "key_finding": {"type": "string"}
  }
}
```

### C.3 — RM Element Schema (`schema/rm_element.schema.json`)

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "RM Element",
  "type": "object",
  "required": ["element", "domains_primary", "msr_anchors", "constructive_resonance", "destructive_resonance", "net_resonance"],
  "properties": {
    "element": {"type": "string"},
    "domains_primary": {"type": "array", "items": {"enum": ["D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9"]}},
    "msr_anchors": {"type": "array", "items": {"type": "string"}},
    "cdlm_anchors": {"type": "array", "items": {"type": "string"}},
    "constructive_resonance": {"type": "array", "items": {"type": "string"}},
    "destructive_resonance": {"type": "array", "items": {"type": "string"}},
    "net_resonance": {"type": "string"},
    "interpretive_note": {"type": "string"}
  }
}
```

---

**Brief ends.** Executor: read entire brief, then begin with §6 MSR merge task, followed by L0–L7 in order.

*Brief authored by Claude Opus 4.7, 2026‑04‑19, based on verification plan "let‑s‑plan‑this‑a‑jazzy‑thunder.md".*