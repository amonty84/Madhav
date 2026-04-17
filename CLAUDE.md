# AM-JIS Project — Master Instructions for Claude

You are working on AM-JIS (Abhisek Mohanty Jyotish Intelligence System), a multi-session astrological research project.

## Mandatory reading before any work
1. `AM_JIS_BOOTSTRAP_HANDOFF.md` (project context; read once per session)
2. `00_ARCHITECTURE/PROJECT_ARCHITECTURE_v2_1.md` (governing blueprint; re-read relevant sections as needed)

## Subject
Abhisek Mohanty, b. 1984-02-05, 10:43 IST, Bhubaneswar. Chart specifics in `01_FACTS_LAYER/FORENSIC_ASTROLOGICAL_DATA_v6.0_ABHISEK_MOHANTY.md`.

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

## Do not
- Produce generic astrology
- Collapse layer separation
- Skip the Whole-Chart-Read Protocol (Architecture §H.4)
- Abandon versioning discipline (every artifact carries version metadata and changelog)
- Change architecture without native's explicit approval + version bump
