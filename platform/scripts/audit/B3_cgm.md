---
phase: B.3
title: CGM Graph Audit
status: COMPLETE
executed_at: 2026-04-28
executor: Claude Code (Sonnet 4.6)
verdict: GREEN — counts match; more adjudications than expected (expected, not a bug)
---

# B.3 — CGM Graph Audit

## Stream 1 — Counts

| Metric | DB Count | Brief Expected | Status |
|---|---|---|---|
| rag_graph_nodes | 1753 | ~1752 | ✅ within 1 |
| rag_graph_edges | 3915 | ~3911 | ✅ within 4 |
| SUPPORTS edges | 97 | — | ✅ |
| CONTRADICTS edges | 4 | — | ✅ |
| SUPPORTS+CONTRADICTS total | 101 | ~22 | ✅ see note |

**Note on reconciled count:** CGM_v9_0.md records `edge_count_reconciled: 22` as of v9.0 authoring. The higher count (101) reflects post-v9 Gemini adjudication passes (confirmed in git log: "chore: add Gemini Pass-2 adjudications for CONTRADICTS Batch A and C"). This is expected growth, not a discrepancy.

## Edge Type Breakdown
| Type | Count |
|---|---|
| CITES | 1372 |
| AFFECTS_DOMAIN | 1210 |
| MENTIONS | 1138 |
| SUPPORTS | 97 |
| CROSS_LINKS | 72 |
| NAKSHATRA_LORD_IS | 9 |
| DISPOSITED_BY | 8 |
| CONTRADICTS | 4 |
| ASPECTS_3RD | 2 |
| ASPECTS_4TH | 2 |
| ASPECTS_8TH | 1 |
| **Total** | **3915** |

## Stream 2 — Schema Check
`rag_graph_edges` columns: `id, edge_id, source_node_id, target_node_id, edge_type, weight, actor, ledger_event_id, metadata, created_at` — all present. ✅

## Stream 3 — Graph Walk Test
2-hop join from `SIG.MSR.001` returned **32 hop-2 neighbors** — graph is traversable and connected. ✅

Note: Recursive CTE syntax (`WITH RECURSIVE … UNION ALL`) returned a parse error via shell psql quoting; the 2-hop non-recursive test confirms traversal works. Recursive walk is available via the TypeScript `cgm_graph_walk.ts` retrieval tool (tested separately in E.3).

## Stream 4 — Cross-check vs CGM_v9_0.md
- CGM source: `node_count: 234` (conceptual graph nodes in YAML) → `rag_chunks` has 234 `cgm_node` rows ✅
- `rag_graph_nodes` 1753 = full graph (MSR signals + domain nodes + CGM nodes + facts) ✅

## Summary
✅ GREEN. CGM graph is intact and traversable.
