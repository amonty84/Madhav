---
artifact: STALENESS_REGISTER
version: "1.0"
status: LIVE
produced_by: Madhav_M2A_Exec
produced_on: 2026-04-25
canonical_id: STALENESS_REGISTER
changelog:
  - v1.0 (2026-04-25, Madhav_M2A_Exec): Initial register. 9 CURRENT L3 domain reports enumerated;
      4 marked stale (status CLOSED in own frontmatter; no source_chart_data: FORENSIC_v8_0
      in frontmatter; partial v8.0 corrections only). Per PHASE_B_PLAN §A known-stale note
      and M2A_EXEC_PLAN §PLAN B.1 Task 3.
---

# STALENESS REGISTER v1.0 — MARSYS-JIS RAG Pipeline

*Enumerates each L3 domain report with `version_aligned_with` and staleness status.
Used by B.2 doc-type 5 chunker to propagate `is_stale` flag to rag_chunks.*

---

## §1 — Staleness Criteria

A CURRENT L3 domain report is **stale** relative to FORENSIC_v8_0 if ANY of:
1. Report's own frontmatter has `status: CLOSED` (snapshot in time) AND no `source_chart_data: FORENSIC_ASTROLOGICAL_DATA_v8_0.md` field.
2. Primary MSR anchors reference v2.0 signal IDs (not v3.0 registry).
3. Report does not incorporate FORENSIC_v8_0 additions: §24 Longevity, §25 Additional Dasha Systems, §26 Yogas Register, full §12.2 Sahams.

Reports with `status: CURRENT` in own frontmatter OR `source_chart_data: FORENSIC_v8_0` are presumed current.

---

## §2 — L3 Domain Report Staleness Table

| file_path | current_version | version_aligned_with | is_stale | stale_reason | detected_at |
|---|---|---|---|---|---|
| `03_DOMAIN_REPORTS/REPORT_CAREER_DHARMA_v1_1.md` | 1.1 | v8_0 | false | — | 2026-04-25 |
| `03_DOMAIN_REPORTS/REPORT_FINANCIAL_v2_1.md` | 2.1 | v8_0 | false | — | 2026-04-25 |
| `03_DOMAIN_REPORTS/REPORT_HEALTH_LONGEVITY_v1_1.md` | 1.2 | v8_0 | false | — | 2026-04-25 |
| `03_DOMAIN_REPORTS/REPORT_PSYCHOLOGY_MIND_v1_1.md` | 1.1 | v8_0 | false | — | 2026-04-25 |
| `03_DOMAIN_REPORTS/REPORT_TRAVEL_v1_1.md` | 1.1 | v8_0 | false | — | 2026-04-25 |
| `03_DOMAIN_REPORTS/REPORT_CHILDREN_v1_1.md` | 1.1 | partial | is_stale: true | status CLOSED in frontmatter; FIX_SESSION_003 applied position corrections but FORENSIC_v8_0 §24/§25/§26 not incorporated; MSR anchors v2.0 | 2026-04-25 |
| `03_DOMAIN_REPORTS/REPORT_PARENTS_v1_1.md` | 1.1 | partial | is_stale: true | status CLOSED in frontmatter; reviewed for position corrections only; FORENSIC_v8_0 §24/§25/§26 not incorporated; MSR anchors v2.0 | 2026-04-25 |
| `03_DOMAIN_REPORTS/REPORT_RELATIONSHIPS_v1_1.md` | 1.1 | partial | is_stale: true | status CLOSED in frontmatter; no source_chart_data: FORENSIC_v8_0 field; FIX_SESSION_003 position corrections only; MSR anchors v2.0 (MSR.391 v2.0, MSR.404 v2.0); §24/§25/§26 not incorporated | 2026-04-25 |
| `03_DOMAIN_REPORTS/REPORT_SPIRITUAL_v1_1.md` | 1.1 | partial | is_stale: true | status CLOSED in frontmatter; no source_chart_data: FORENSIC_v8_0 field; FIX_SESSION_003 position corrections only; MSR anchors v2.0 (MSR.407 v2.0); §24/§25/§26 not incorporated | 2026-04-25 |

---

## §3 — Summary

| Metric | Count |
|---|---|
| Total CURRENT L3 domain reports | 9 |
| Stale (is_stale: true) | 4 |
| Not stale (is_stale: false) | 5 |

Known-stale reports per PHASE_B_PLAN §A + MACRO_PLAN §A.
Rebuild scheduled as follow-on to M2 (per CQ2 resolution: stale-mark at ingestion; rebuild deferred).

---

## §4 — Partial-Implementation Registry

Tracks deliberate partial implementations that are load-bearing for the current phase but require
extension in a future phase. Distinct from §2 staleness: these are code artifacts, not document artifacts.

| artifact | status | partial_impl_note | full_impl_due |
|---|---|---|---|
| `platform/python-sidecar/rag/validators/p6_uvc_consistency.py` | PARTIAL_IMPL | B.4 Exec_8 minimal scaffold: `scan_ucn_vs_l3()` keyword-heuristic only (antonym/magnitude/state-inversion pairs). No gate validator, no accept/reject fixtures, no CI integration. | B.5 Session 3 (Exec_11) per PHASE_B_PLAN §H + §B.5 retroactive-review obligation |
| `platform/python-sidecar/rag/eval/run_eval.py` | PARTIAL_IMPL | B.5 Exec_9 implements only `--mode=discovery_sanity` (vector recall@10 against 5 known seeds). Full RAGAS harness (faithfulness, context precision, context recall, answer relevancy) against 50-query golden set deferred to B.9 per PHASE_B_PLAN §B.9. | B.9 (Exec_12+) per PHASE_B_PLAN §B.9 |

---

*End of STALENESS_REGISTER v1.2 — amended Madhav_M2A_Exec_9 2026-04-27 (§4 run_eval.py partial-impl row added).*
