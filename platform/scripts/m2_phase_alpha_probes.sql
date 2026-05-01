-- =============================================================================
-- m2_phase_alpha_probes.sql
-- KARN-W1-R1-PHASE-ALPHA — diagnostic-audit only, no writes
-- Created: 2026-04-30
-- =============================================================================

\echo '==================================================================='
\echo 'AUDIT 1 — chart_facts schema introspection'
\echo '==================================================================='

\d chart_facts

\echo ''
\echo '--- chart_facts columns with types ---'
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'chart_facts'
ORDER BY ordinal_position;

\echo ''
\echo '--- chart_facts rows by category (is_stale=false) ---'
SELECT category, COUNT(*) AS row_count
FROM chart_facts
WHERE is_stale = false
GROUP BY category
ORDER BY row_count DESC;

\echo ''
\echo '--- chart_facts sample rows (20 rows) ---'
SELECT * FROM chart_facts WHERE is_stale = false ORDER BY category, id LIMIT 20;

\echo ''
\echo '==================================================================='
\echo 'AUDIT 2 — msr_signals column inventory'
\echo '==================================================================='

\d msr_signals

\echo ''
\echo '--- msr_signals columns with types ---'
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'msr_signals'
ORDER BY ordinal_position;

\echo ''
\echo '--- msr_signals column fill rates (abhisek_mohanty) ---'
-- Note: ON_ERROR_STOP=off so if a column is missing this errors but continues
SELECT
  COUNT(*) AS total,
  COUNT(*) FILTER (WHERE signal_type IS NOT NULL) AS signal_type_filled,
  COUNT(*) FILTER (WHERE temporal_activation IS NOT NULL) AS temporal_activation_filled,
  COUNT(*) FILTER (WHERE valence IS NOT NULL) AS valence_filled,
  COUNT(*) FILTER (WHERE classical_source IS NOT NULL) AS classical_source_filled,
  COUNT(*) FILTER (WHERE falsifier IS NOT NULL) AS falsifier_filled
FROM msr_signals
WHERE native_id = 'abhisek_mohanty';

\echo ''
\echo '--- msr_signals: check for supporting_rules column ---'
SELECT COUNT(*) FILTER (WHERE supporting_rules IS NOT NULL) AS supporting_rules_filled
FROM msr_signals
WHERE native_id = 'abhisek_mohanty';

\echo ''
\echo '--- msr_signals: check for rpt_deep_dive column ---'
SELECT COUNT(*) FILTER (WHERE rpt_deep_dive IS NOT NULL) AS rpt_deep_dive_filled
FROM msr_signals
WHERE native_id = 'abhisek_mohanty';

\echo ''
\echo '--- msr_signals: check for entities_involved column ---'
SELECT COUNT(*) FILTER (WHERE entities_involved IS NOT NULL) AS entities_involved_filled
FROM msr_signals
WHERE native_id = 'abhisek_mohanty';

\echo ''
\echo '--- msr_signals: check for v6_ids_consumed column ---'
SELECT COUNT(*) FILTER (WHERE v6_ids_consumed IS NOT NULL) AS v6_ids_consumed_filled
FROM msr_signals
WHERE native_id = 'abhisek_mohanty';

\echo ''
\echo '--- msr_signals: check for prior_id column ---'
SELECT COUNT(*) FILTER (WHERE prior_id IS NOT NULL) AS prior_id_filled
FROM msr_signals
WHERE native_id = 'abhisek_mohanty';

\echo ''
\echo '--- msr_signals: total row count ---'
SELECT COUNT(*) AS total_msr_signals FROM msr_signals WHERE native_id = 'abhisek_mohanty';

\echo ''
\echo '--- msr_signals: sample 5 rows ---'
SELECT * FROM msr_signals WHERE native_id = 'abhisek_mohanty' LIMIT 5;

\echo ''
\echo '==================================================================='
\echo 'AUDIT 3 — Classifier output on factual queries'
\echo '==================================================================='

\echo ''
\echo '--- query_trace_steps table exists? ---'
SELECT COUNT(*) AS query_trace_steps_rows FROM query_trace_steps LIMIT 1;

\echo ''
\echo '--- Total classify steps ---'
SELECT COUNT(*) AS total_classify_steps
FROM query_trace_steps
WHERE step_name = 'classify';

\echo ''
\echo '--- Sample payload structure from most recent classify step ---'
SELECT
  query_id,
  created_at,
  step_name,
  status,
  jsonb_pretty(payload) AS payload_pretty
FROM query_trace_steps
WHERE step_name = 'classify'
ORDER BY created_at DESC
LIMIT 1;

\echo ''
\echo '--- Factual classify steps: last 10 ---'
WITH factual_classify AS (
  SELECT
    query_id,
    created_at,
    payload
  FROM query_trace_steps
  WHERE step_name = 'classify'
    AND status = 'done'
    AND payload->'data_summary'->>'result' = 'factual'
  ORDER BY created_at DESC
  LIMIT 10
)
SELECT
  query_id,
  created_at,
  payload->'data_summary'->>'result' AS query_class,
  payload->'plan_emitted'->'planets' AS planets,
  payload->'plan_emitted'->'domains' AS domains,
  payload->'plan_emitted'->'tools_authorized' AS tools_authorized,
  payload->'plan_emitted'->'graph_seed_hints' AS graph_seed_hints
FROM factual_classify;

\echo ''
\echo '--- If above returned 0 rows, try alternate payload path ---'
SELECT DISTINCT
  jsonb_object_keys(payload) AS top_keys
FROM query_trace_steps
WHERE step_name = 'classify'
LIMIT 1;

\echo ''
\echo '--- All classify step payload top-level keys (distinct) ---'
SELECT DISTINCT key
FROM query_trace_steps,
     jsonb_object_keys(payload) AS key
WHERE step_name = 'classify'
ORDER BY key;

\echo ''
\echo '--- Sample of classify payloads (raw, last 5) ---'
SELECT
  query_id,
  created_at,
  status,
  payload
FROM query_trace_steps
WHERE step_name = 'classify'
ORDER BY created_at DESC
LIMIT 5;

\echo ''
\echo '==================================================================='
\echo 'AUDIT 4 — rag_chunks by source_file and doc_type (FORENSIC coverage)'
\echo '==================================================================='

\echo ''
\echo '--- rag_chunks: FORENSIC source files ---'
SELECT source_file, doc_type, COUNT(*) AS chunk_count
FROM rag_chunks
WHERE source_file ILIKE '%FORENSIC%'
GROUP BY source_file, doc_type
ORDER BY source_file, chunk_count DESC;

\echo ''
\echo '--- rag_chunks: all doc_types across all sources ---'
SELECT doc_type, COUNT(*) AS total_chunks
FROM rag_chunks
GROUP BY doc_type
ORDER BY total_chunks DESC;

\echo ''
\echo '--- rag_chunks: source files and counts ---'
SELECT source_file, COUNT(*) AS chunk_count
FROM rag_chunks
GROUP BY source_file
ORDER BY chunk_count DESC;

\echo ''
\echo '--- rag_chunks: total ---'
SELECT COUNT(*) AS total_rag_chunks FROM rag_chunks;

\echo ''
\echo '==================================================================='
\echo 'AUDIT 4-B — Additional table existence checks'
\echo '==================================================================='

\echo ''
\echo '--- Tables in public schema ---'
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

\echo ''
\echo '--- l25_* tables if present ---'
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name LIKE 'l25%'
ORDER BY table_name;

\echo ''
\echo '--- l25_cgm_nodes count ---'
SELECT COUNT(*) AS cgm_nodes FROM l25_cgm_nodes;

\echo ''
\echo '--- l25_cgm_edges count (valid vs orphaned) ---'
SELECT
  COUNT(*) FILTER (WHERE is_orphaned = false OR is_orphaned IS NULL) AS valid_edges,
  COUNT(*) FILTER (WHERE is_orphaned = true) AS orphaned_edges,
  COUNT(*) AS total_edges
FROM l25_cgm_edges;

\echo ''
\echo '--- chart_facts: full category list with counts ---'
SELECT category, COUNT(*) AS row_count
FROM chart_facts
GROUP BY category
ORDER BY row_count DESC;

\echo ''
\echo '==================================================================='
\echo 'END OF PROBES'
\echo '==================================================================='
