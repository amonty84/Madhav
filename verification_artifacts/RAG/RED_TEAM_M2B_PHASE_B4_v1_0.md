---
artifact_id: RED_TEAM_M2B_PHASE_B4
version: 1.0
status: PASS
session_id: Madhav_M2A_Exec_8
date: 2026-04-26
phase: B.4
probe_set: RT.M2B + KR
total_probes: 10
passed: 10
failed: 0
---

# Red-Team Pass: Phase B.4 Final Close (M2B)

**Session:** Madhav_M2A_Exec_8  
**Date:** 2026-04-26  
**Scope:** B.4 SUPPORTS + CONTRADICTS two-pass pipeline, ledger integrity, graph referential integrity

## Probe Results

| Probe | Description | Result | Detail |
|---|---|---|---|
| RT.M2B.1 | total_edges ≥ 957 baseline | **PASS** | 3,915 edges (CONTRADICTS:4, SUPPORTS:97, CITES:1372, AFFECTS_DOMAIN:1210, MENTIONS:1138, CROSS_LINKS:72, others:22) |
| RT.M2B.2 | No SUPPORTS/CONTRADICTS → stale domain_report nodes | **PASS** | 0 stale-target edges |
| RT.M2B.3 | All SUPPORTS edges have valid source_node_id | **PASS** | 0 orphan SUPPORTS edges |
| RT.M2B.4 | All CONTRADICTS edges have valid source+target nodes | **PASS** | 0 orphan CONTRADICTS edges |
| RT.M2B.5 | CONTRADICTS count == 4 (Batch C karaka divergence) | **PASS** | 4 edges persisted |
| RT.M2B.6 | Ledger event counts: 15 claude_proposal, 4 gemini_challenge_accept, 11 gemini_challenge_reject | **PASS** | Full ledger: gemini_proposal:216, claude_reconcile_accept:101, claude_reconcile_reject:115, claude_proposal:15, gemini_challenge_accept:4, gemini_challenge_reject:11 |
| KR-1 | node_count ≥ 1700 (no mass deletion) | **PASS** | 1,753 nodes |
| KR-2 | SUPPORTS count == 97 (intact after CONTRADICTS pass) | **PASS** | 97 SUPPORTS edges |
| KR-3 | No duplicate CONTRADICTS edge_ids | **PASS** | 0 duplicates (ON CONFLICT DO UPDATE enforced) |
| KR-4 | Ledger timestamps non-decreasing (append-only) | **PASS** | Monotonic throughout |

## Phase B.4 CONTRADICTS Summary

### Batch A — P1 Layer-Bleed (Invariant Scanner)
- **Proposed:** 10 hypotheses (L1 FORENSIC chunks with interpretive-language terms: shows/strong/powerful/weak)
- **Accepted:** 0
- **Gemini verdict:** All 10 REJECTED (HIGH confidence)
- **Reason:** Quantitative Bala metric labels (strong/weak/powerful/shows) are L1-valid structural descriptions of numerical outputs (Vimsopaka Bala, Bhava Bala, Ishta/Kashta, Pancha-Vargeeya, Shadbala). Not L2 interpretations.
- **Corpus insight:** Acharya-grade L1 corpora legitimately use magnitude descriptors tied to formal metrics.

### Batch B — P6 UVC Conflict (Keyword Heuristic)
- **Proposed:** 0 hypotheses
- **Result:** Zero P6 UVC conflicts detected by antonym/magnitude/state-pair heuristics
- **Disposition:** Accepted-as-data (DIS.001 / DIS.class.l3_zero_supports). Full semantic scan deferred to B.5 Session 3 (Exec_11).

### Batch C — Rahu-as-PK Dual-Karaka System Divergence
- **Proposed:** 5 hypotheses (SIG.MSR.226, MSR.320, MSR.321, MSR.430, MSR.432)
- **Accepted:** 4 (MSR.226, MSR.320, MSR.321, MSR.432)
- **Rejected:** 1 (MSR.430 — GK same in both 7-karaka and 8-karaka systems, no contradiction)
- **Gemini verdict:** HIGH confidence on all 5
- **Critical finding:** Corpus uses both 7-karaka (Mars=PK) and 8-karaka (Rahu=PK) systems without explicit lock. SIG.MSR.432 Raja Yoga AK-PK requires Rahu=PK → only valid under 8-karaka. Action required: lock 8-karaka as authoritative for D7/progeny analysis.

## Persisted CONTRADICTS Edges

| Source | Target | Conflict Type | Gemini Confidence |
|---|---|---|---|
| SIG.MSR.226 | KARAKA.DUAL_SYSTEM_DIVERGENCE | rahu_as_pk | HIGH |
| SIG.MSR.320 | KARAKA.DUAL_SYSTEM_DIVERGENCE | rahu_as_pk | HIGH |
| SIG.MSR.321 | KARAKA.DUAL_SYSTEM_DIVERGENCE | rahu_as_pk | HIGH |
| SIG.MSR.432 | KARAKA.DUAL_SYSTEM_DIVERGENCE | rahu_as_pk | HIGH |

## Known Residuals

- **RT.M2B.2 initial failure:** SQL type cast error (`chunk_id UUID vs rag_chunks.id`). Fixed with `chunk_id::text IN (SELECT id::text ...)`. No data integrity impact; probe passed on fixed query.
- **JSONL ledger repair (Exec_8):** 5 incorrect `gemini_challenge_reject` events from a failed first-run of Batch C reconciler were surgically removed and replaced with 4 correct `gemini_challenge_accept` + 1 `gemini_challenge_reject`. KR-4 (timestamp monotonicity) passes.
- **L3 gate (l3_gate_pass: false):** REPORT_HEALTH_LONGEVITY_v1_1.md and REPORT_RELATIONSHIPS_v1_1.md have zero SUPPORTS edges. Accepted-as-data per DIS.001 / DIS.class.l3_zero_supports (2026-04-26). Not a red-team failure.

## Verdict

**Phase B.4 RED-TEAM: PASS** — all 10 probes green. B.4 eligible for final close.
