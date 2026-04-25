"""
router
MARSYS-JIS RAG Pipeline — query router and query-plan generator.
Per PHASE_B_PLAN_v1_0.md §G B.0 Task 9 + B.4.
Routes queries to interpretive_multidomain|interpretive_single|factual|timing|meta plan types.
Enforces Whole-Chart-Read (P3) on interpretive queries.
Implementation deferred to Phase B.4.
"""
