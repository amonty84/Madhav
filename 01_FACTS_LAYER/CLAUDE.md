# 01_FACTS_LAYER — Instructions

This folder holds L1 Facts — the single source of truth for all chart data, life events, and external references. Facts only. No interpretation.

## Current files
- `FORENSIC_ASTROLOGICAL_DATA_v6.0_ABHISEK_MOHANTY.md` — current Facts Layer; 1,815 lines, 24 major sections

## Planned files (per Architecture §G.1)
- `FORENSIC_DATA_v7_0.md` — upgraded Facts Layer (to be built)
- `LIFE_EVENT_LOG_v1_0.md` — structured chronological life-event log (to be built starting Session 2)
- `EXTERNAL_REFERENCE_CARD.md` — classical citations used across L2+
- `CGP_AUDIT_v1_0.md` — Completeness Guarantee Protocol audit output
- `EXTERNAL_COMPUTATION_SPEC.md` — specification of what the native must compute via Jagannatha Hora

## Non-negotiable rules
- Facts only. No interpretation, no narrative, no prediction.
- Every fact carries a data provenance tag (`source: swiss_ephemeris | jagannatha_hora | manual_derivation | external_astrologer | UNKNOWN`)
- No fabricated computations. Missing data = `[EXTERNAL_COMPUTATION_REQUIRED: <specification>]`
- Append-only by default. Corrections produce new versions; old versions go to 99_ARCHIVE/.
- Stable IDs per Architecture §F namespace (MET., PLN., HSE., EVT., etc.)
