# AM-JIS Project — Master Instructions for Claude

You are working on AM-JIS (Abhisek Mohanty Jyotish Intelligence System), a multi-session astrological research project.

## Mandatory reading before any work
1. `AM_JIS_BOOTSTRAP_HANDOFF.md` (project context; read once per session)
2. `00_ARCHITECTURE/PROJECT_ARCHITECTURE_v2_1.md` (governing blueprint; re-read relevant sections as needed)
3. `00_ARCHITECTURE/MACRO_PLAN_v1_0.md` (ten-macro-phase arc; orientation only — do not pre-build for phases later than the current one)
4. `00_ARCHITECTURE/PHASE_B_PLAN_v1_0.md` (active M2 execution plan — current version v1.0.2; governs all B.0–B.10 phase work)

## Subject
Abhisek Mohanty, b. 1984-02-05, 10:43 IST, Bhubaneswar. Canonical L1 chart data: **`01_FACTS_LAYER/FORENSIC_ASTROLOGICAL_DATA_v8_0.md`** (v6.0 file retained under `01_FACTS_LAYER/` as archival only).

## Canonical corpus artifact paths (current versions)
Always reference these exact files — do not reference superseded versions:
- **MSR (Master Signal Register):** `025_HOLISTIC_SYNTHESIS/MSR_v3_0.md` (499 signals; v1.0 and v2.0 are superseded)
- **UCN (Unified Chart Narrative):** `025_HOLISTIC_SYNTHESIS/UCN_v4_0.md` (v1.0–v3.0 are superseded)
- **CDLM (Cross-Domain Linkage Matrix):** `025_HOLISTIC_SYNTHESIS/CDLM_v1_1.md`
- **CGM (Chart Graph Model):** `025_HOLISTIC_SYNTHESIS/CGM_v2_0.md` (will become `CGM_v9_0.md` after Phase B.3.5)
- **RM (Resonance Map):** `025_HOLISTIC_SYNTHESIS/RM_v2_0.md`
- **FILE_REGISTRY:** `00_ARCHITECTURE/FILE_REGISTRY_v1_0.md`

## Cadence
Daily sessions. Closed-artifact-per-session discipline. Red-team every 3rd session.

## Current execution position
Check `00_ARCHITECTURE/SESSION_LOG.md` for the most recent session's summary and the next session's objective. If SESSION_LOG.md doesn't exist yet, this is Session 2 (Life Event Log v1.0 elicitation).

## Operating principles (summarized; full list in Architecture §B)
- Facts live at L1; interpretations at L2+; never mix
- Every L2+ claim cites specific L1 IDs via derivation ledger
- Three-interpretation discipline on significant claims
- No fabricated chart computations (mark `[EXTERNAL_COMPUTATION_REQUIRED]`)
- Every query routes through L2.5 Holistic Synthesis before L3 Domain Reports
- Red-team pass before any major-version artifact is closed

## Quality standard
Acharya-grade. An independent senior Jyotish acharya reviewing this corpus should reach one of: "this is my own level", "this is above my own level", or "this reveals things I wouldn't have seen on first pass". Nothing less.

## Collaboration with Gemini
You are working alongside Gemini on this project (specifically in the L4 Discovery Layer). To ensure Gemini always has the correct, up-to-date context:
- Whenever you update project architecture, plans, or change the execution state, you MUST simultaneously update `.geminirules` and `.gemini/project_state.md`.
- Keep the `project_state.md` file accurate with the current active phase, pending actions, and execution model.

## Do not
- Produce generic astrology
- Collapse layer separation
- Skip the Whole-Chart-Read Protocol (Architecture §H.4)
- Abandon versioning discipline (every artifact carries version metadata and changelog)
- Change architecture without native's explicit approval + version bump
