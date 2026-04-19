# 01_FACTS_LAYER — Instructions

This folder holds L1 Facts — the single source of truth for all chart data, life events, and external references. Facts only. No interpretation.

## Current files (authoritative)

- **`FORENSIC_ASTROLOGICAL_DATA_v8_0.md`** — unified Facts Layer (CURRENT; supersedes v6.0 and one-off supplements integrated here)
- **`FORENSIC_ASTROLOGICAL_DATA_v6.0_ABHISEK_MOHANTY.md`** — archival reference (SUPERSEDED by v8.0)
- **`LIFE_EVENT_LOG_v1_2.md`** — dated life events + Swiss Ephemeris chart states for retrodictive calibration (CURRENT)
- **`JHORA_TRANSCRIPTION_v8_0_SOURCE.md`** — Jagannatha Hora export transcript (supporting L1)
- **`EPHEMERIS_MONTHLY_1900_2100.csv`** / **`EVENT_CHART_STATES_v1_0.md`** — computed supporting data (see Session 4 logs)
- **`CGP_AUDIT_v1_0.md`** — Completeness Guarantee Protocol audit (CLOSED)
- **`EXTERNAL_COMPUTATION_SPEC_v1_0.md`** / **`EXTERNAL_COMPUTATION_SPEC_v2_0.md`** — native JH export specs (CLOSED as specs; execution optional per remaining `[EXTERNAL_COMPUTATION_REQUIRED]` cells)

## Planned / optional extensions

- **`EXTERNAL_REFERENCE_CARD.md`** — classical citations used across L2+ (per Architecture §G.1)
- Additional L1 rows only when marked with explicit provenance tags

## Non-negotiable rules

- Facts only. No interpretation, no narrative, no prediction.
- Every fact carries a data provenance tag (`source: swiss_ephemeris | jagannatha_hora | manual_derivation | external_astrologer | UNKNOWN`)
- No fabricated computations. Missing data = `[EXTERNAL_COMPUTATION_REQUIRED: <specification>]`
- Append-only by default. Corrections produce new versions; old versions go to `99_ARCHIVE/`.
- Stable IDs per Architecture §F namespace (`MET.`, `PLN.`, `HSE.`, `EVT.`, etc.)
