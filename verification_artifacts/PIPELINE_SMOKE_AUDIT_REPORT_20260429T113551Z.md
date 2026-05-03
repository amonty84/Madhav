# Pipeline Smoke Audit Report

**Produced:** 2026-04-29T11:35:51.560496+00:00
**Repo root:** `/Users/Dev/Vibe-Coding/Apps/Madhav`

## Summary

| | Count |
|---|---|
| ✅ Pass | 30 |
| ❌ Fail | 20 |
| ⚠️ Warn | 5 |
| ⏭ Skip | 1 |
| **Total** | **56** |

## Results

| ID | Category | Description | Status | Detail | Latency |
|---|---|---|---|---|---|
| 1.1 | static | No NEXT_PUBLIC_SIDECAR_URL in active TS source | ✅ PASS | Clean — all 3 RAG clients use PYTHON_SIDECAR_URL | — |
| 1.2 | static | No old SIDECAR_API_KEY in active TS/Python source | ✅ PASS | Clean — only PYTHON_SIDECAR_API_KEY used everywhere | — |
| 1.3 | static | temporal.ts sidecar URL reads from PYTHON_SIDECAR_URL env var | ✅ PASS | Reads process.env.PYTHON_SIDECAR_URL with localhost fallback only | — |
| 1.4 | static | No @supabase/supabase-js imports in active TS source | ✅ PASS | No @supabase imports — fully migrated to Cloud SQL | — |
| 1.5 | static | No voyageai imports in active Python source (outside venv) | ✅ PASS | Voyage AI fully replaced — no voyageai imports in active Python | — |
| 1.6 | static | Dockerfile copies 035_DISCOVERY_LAYER (needed by 4 register tools) | ✅ PASS | 035_DISCOVERY_LAYER is COPY'd into runner stage | — |
| 1.7 | static | L3 register JSON files present under MARSYS_REPO_ROOT | ✅ PASS | All 4 present. Sizes: {'PATTERN_REGISTER_v1_0.json': '47KB', 'RESONANCE_REGISTER_v1_0.json': '27KB', 'CLUSTER_ATLAS_v1_0 | — |
| 2.1 | cloud_sql | Cloud SQL connection via Auth Proxy | ✅ PASS | PostgreSQL: PostgreSQL 15.17 on x86_64-pc-linux-gnu, compiled by Debian ... | 559ms |
| 2.2 | cloud_sql | charts (must have ≥1 chart) | ✅ PASS | 1 rows | 94ms |
| 2.3 | cloud_sql | msr_signals (L2.5 — L2.5 MSR signals — pipeline tool: msr_sql) | ✅ PASS | 499 rows | 81ms |
| 2.4a | cloud_sql | rag_chunks (L1+L2.5 — non-stale RAG chunks — pipeline tool: vector_search) | ✅ PASS | 941 rows | 62ms |
| 2.4b | cloud_sql | rag_embeddings (vector embeddings — pipeline tool: vector_search) | ✅ PASS | 941 rows | 87ms |
| 2.5a | cloud_sql | rag_graph_nodes (L2.5 CGM — CGM graph nodes — pipeline tool: cgm_graph_walk) | ⚠️ WARN | Table exists but 0 rows — data may not be ingested yet | 81ms |
| 2.5b | cloud_sql | rag_graph_edges (L2.5 CGM — CGM graph edges — pipeline tool: cgm_graph_walk) | ⚠️ WARN | Table exists but 0 rows — data may not be ingested yet | 56ms |
| 2.6a | cloud_sql | ucn_sections (L2.5 UCN — row count) | ❌ FAIL | relation "ucn_sections" does not exist LINE 1: SELECT COUNT(*) FROM ucn_sections                              ^ | 43ms |
| 2.6b | cloud_sql | cdlm_links (L2.5 CDLM — row count) | ❌ FAIL | current transaction is aborted, commands ignored until end of transaction block | 52ms |
| 2.6c | cloud_sql | cgm_nodes (L2.5 CGM nodes — row count) | ❌ FAIL | current transaction is aborted, commands ignored until end of transaction block | 142ms |
| 2.6d | cloud_sql | cgm_edges (L2.5 CGM edges — row count) | ❌ FAIL | current transaction is aborted, commands ignored until end of transaction block | 81ms |
| 2.6e | cloud_sql | rm_resonances (L2.5 RM — row count) | ❌ FAIL | current transaction is aborted, commands ignored until end of transaction block | 235ms |
| 2.6f | cloud_sql | chart_facts (L1 structured facts — row count) | ❌ FAIL | current transaction is aborted, commands ignored until end of transaction block | 49ms |
| 2.6g | cloud_sql | eclipses (L1 eclipses — row count) | ❌ FAIL | current transaction is aborted, commands ignored until end of transaction block | 43ms |
| 2.6h | cloud_sql | retrogrades (L1 retrogrades — row count) | ❌ FAIL | current transaction is aborted, commands ignored until end of transaction block | 46ms |
| 2.6i | cloud_sql | life_events (L1 life events — row count) | ❌ FAIL | current transaction is aborted, commands ignored until end of transaction block | 57ms |
| 2.6j | cloud_sql | sade_sati (L1 Sade Sati cycles — row count) | ❌ FAIL | current transaction is aborted, commands ignored until end of transaction block | 44ms |
| 2.7a | cloud_sql | audit_events (pipeline audit log) | ❌ FAIL | current transaction is aborted, commands ignored until end of transaction block | 186ms |
| 2.7b | cloud_sql | query_trace_steps (pipeline trace steps) | ❌ FAIL | current transaction is aborted, commands ignored until end of transaction block | 104ms |
| 2.8 | cloud_sql | conversations (persisted conversations) | ❌ FAIL | current transaction is aborted, commands ignored until end of transaction block | 47ms |
| 2.9 | cloud_sql | pgvector extension installed | ❌ FAIL | current transaction is aborted, commands ignored until end of transaction block | — |
| 2.10 | cloud_sql | rag_embeddings dimension = 768 (Vertex AI text-multilingual-embedding-002) | ⚠️ WARN | Could not check embedding dim: current transaction is aborted, commands ignored until end of transaction block | — |
| 2.11 | cloud_sql | HNSW index on rag_embeddings (cosine, m=16) | ⚠️ WARN | only '%s', '%b', '%t' are allowed as placeholders, got '%h' | — |
| 3.1 | gcs | Chat attachments bucket (upload/download for chat files) [madhav-astrology-chat-attachments] | ✅ PASS | Accessible (sampled 1 object) | 922ms |
| 3.2 | gcs | Chart documents bucket (reports PDF storage) [madhav-astrology-chart-documents] | ✅ PASS | Accessible (sampled 1 object) | 169ms |
| 3.3 | gcs | Sources bucket (pipeline reads VALIDATED_ASSET_REGISTRY + corpus files) [madhav-marsys-sources] | ✅ PASS | Accessible (sampled 1 object) | 139ms |
| 3.4 | gcs | Build artifacts bucket (pipeline writes build manifests) [madhav-marsys-build-artifacts] | ✅ PASS | Accessible (sampled 1 object) | 173ms |
| 3.5 | gcs | L1/L2.5 corpus files present in sources bucket | ❌ FAIL | 403 GET https://storage.googleapis.com/storage/v1/b/madhav-marsys-sources/o/L1%2Ffacts%2FFORENSIC_ASTROLOGICAL_DATA_v8_0 | — |
| 3.6 | gcs | VALIDATED_ASSET_REGISTRY_v1_0.json in sources bucket | ❌ FAIL | 403 GET https://storage.googleapis.com/storage/v1/b/madhav-marsys-sources/o/00_ARCHITECTURE%2FVALIDATED_ASSET_REGISTRY_v | — |
| 4.1 | vertex_ai | Application Default Credentials available | ❌ FAIL | 'NoneType' object is not callable          → Run: gcloud auth application-default login | — |
| 4.2 | vertex_ai | Vertex AI embed call | ⏭ SKIP | No ADC credentials | — |
| 5.1 | sidecar | Sidecar health check [https://amjis-sidecar-qm256lasva-el.a.run.app/health] | ✅ PASS | HTTP 200 {'status': 'ok'} | 373ms |
| 5.2 | sidecar | Transits (temporal tool → /transits) [/transits] | ❌ FAIL | HTTP 404: {"detail": "Not Found"} | 352ms |
| 5.3 | sidecar | Ephemeris (temporal tool forward_looking → /ephemeris) [/ephemeris] | ❌ FAIL | HTTP 422: {"detail": [{"type": "missing", "loc": ["body", "birth_date"], "msg": "Field required", "input": {"native_id": | 198ms |
| 5.4 | sidecar | Sade Sati cycles [/sade_sati] | ✅ PASS | HTTP 200 — keys: ['status', 'message'] | 176ms |
| 5.5 | sidecar | Eclipses window [/eclipses] | ✅ PASS | HTTP 200 — keys: ['status', 'message'] | 143ms |
| 5.6 | sidecar | RAG retrieve (/rag/retrieve — hybrid_rrf) [/rag/retrieve] | ❌ FAIL | Connection error: The read operation timed out | 15106ms |
| 6.1 | tool | msr_sql — Cloud SQL: msr_signals table | ✅ PASS | 499 signals. Top domains: {'career': 208, 'spirit': 94, 'wealth': 64, 'relationships': 41, 'health': 32} | 752ms |
| 6.2 | tool | pattern_register — filesystem: 035_DISCOVERY_LAYER/REGISTERS/PATTERN_REGISTER_v1_0.json (L3) | ✅ PASS | 22 entries (patterns), 47KB | 0ms |
| 6.3 | tool | resonance_register — filesystem: 035_DISCOVERY_LAYER/REGISTERS/RESONANCE_REGISTER_v1_0.json (L3) | ✅ PASS | 12 entries (resonances), 27KB | 0ms |
| 6.4 | tool | cluster_atlas — filesystem: 035_DISCOVERY_LAYER/REGISTERS/CLUSTER_ATLAS_v1_0.json (L3) | ✅ PASS | 12 entries (clusters), 19KB | 0ms |
| 6.5 | tool | contradiction_register — filesystem: 035_DISCOVERY_LAYER/REGISTERS/CONTRADICTION_REGISTER_v1_0.json (L3) | ✅ PASS | 8 entries (contradictions), 20KB | 0ms |
| 6.6 | tool | temporal — Python sidecar /transits (see 5.2 for live check) | ✅ PASS | Delegates to sidecar at https://amjis-sidecar-qm256lasva-el.a.run.app/transits — result in check 5.2 | — |
| 6.7 | tool | query_msr_aggregate — no I/O (multi-native stub, always returns status) | ✅ PASS | Stub tool — returns 'multi_native_not_deployed' immediately, no cloud calls | — |
| 6.8 | tool | cgm_graph_walk — Cloud SQL: rag_graph_nodes + rag_graph_edges (L2.5 CGM) | ⚠️ WARN | nodes=0  edges=0 — CGM graph may not be ingested yet | 796ms |
| 6.9 | tool | manifest_query — filesystem: 00_ARCHITECTURE/CAPABILITY_MANIFEST.json (L0) | ✅ PASS | 105 entries  fingerprint=73010a7fd9e47169... | 1ms |
| 6.10 | tool | vector_search — Vertex AI embed + Cloud SQL: rag_embeddings ⊕ rag_chunks | ✅ PASS | chunks=941  embeddings=941  coverage=100.0%  doc_types={'msr_signal': 499, 'cgm_node': 234, 'l1_fact': 102, 'cdlm_cell': | 808ms |
| 7.1 | anthropic | Anthropic API key format | ✅ PASS | Key present: sk-ant-...sFZD2gAA | — |
| 7.2 | anthropic | Anthropic API reachable (models endpoint) | ✅ PASS | HTTP 200 — sample models: ['claude-opus-4-7', 'claude-sonnet-4-6', 'claude-opus-4-6'] | 627ms |

## ❌ Failures (action required)

### [2.6a] ucn_sections (L2.5 UCN — row count)

```
relation "ucn_sections" does not exist
LINE 1: SELECT COUNT(*) FROM ucn_sections
                             ^
```

### [2.6b] cdlm_links (L2.5 CDLM — row count)

```
current transaction is aborted, commands ignored until end of transaction block
```

### [2.6c] cgm_nodes (L2.5 CGM nodes — row count)

```
current transaction is aborted, commands ignored until end of transaction block
```

### [2.6d] cgm_edges (L2.5 CGM edges — row count)

```
current transaction is aborted, commands ignored until end of transaction block
```

### [2.6e] rm_resonances (L2.5 RM — row count)

```
current transaction is aborted, commands ignored until end of transaction block
```

### [2.6f] chart_facts (L1 structured facts — row count)

```
current transaction is aborted, commands ignored until end of transaction block
```

### [2.6g] eclipses (L1 eclipses — row count)

```
current transaction is aborted, commands ignored until end of transaction block
```

### [2.6h] retrogrades (L1 retrogrades — row count)

```
current transaction is aborted, commands ignored until end of transaction block
```

### [2.6i] life_events (L1 life events — row count)

```
current transaction is aborted, commands ignored until end of transaction block
```

### [2.6j] sade_sati (L1 Sade Sati cycles — row count)

```
current transaction is aborted, commands ignored until end of transaction block
```

### [2.7a] audit_events (pipeline audit log)

```
current transaction is aborted, commands ignored until end of transaction block
```

### [2.7b] query_trace_steps (pipeline trace steps)

```
current transaction is aborted, commands ignored until end of transaction block
```

### [2.8] conversations (persisted conversations)

```
current transaction is aborted, commands ignored until end of transaction block
```

### [2.9] pgvector extension installed

```
current transaction is aborted, commands ignored until end of transaction block
```

### [3.5] L1/L2.5 corpus files present in sources bucket

```
403 GET https://storage.googleapis.com/storage/v1/b/madhav-marsys-sources/o/L1%2Ffacts%2FFORENSIC_ASTROLOGICAL_DATA_v8_0.md?fields=name&prettyPrint=false: mail.abhisek.mohanty@gmail.com does not have storage.objects.get access to the Google Cloud Storage object. Permission 'storage.objects.get' denied on resource (or it may not exist).
```

### [3.6] VALIDATED_ASSET_REGISTRY_v1_0.json in sources bucket

```
403 GET https://storage.googleapis.com/storage/v1/b/madhav-marsys-sources/o/00_ARCHITECTURE%2FVALIDATED_ASSET_REGISTRY_v1_0.json?fields=name&prettyPrint=false: mail.abhisek.mohanty@gmail.com does not have storage.objects.get access to the Google Cloud Storage object. Permission 'storage.objects.get' denied on resource (or it may not exist).
```

### [4.1] Application Default Credentials available

```
'NoneType' object is not callable
         → Run: gcloud auth application-default login
```

### [5.2] Transits (temporal tool → /transits) [/transits]

```
HTTP 404: {"detail": "Not Found"}
```

### [5.3] Ephemeris (temporal tool forward_looking → /ephemeris) [/ephemeris]

```
HTTP 422: {"detail": [{"type": "missing", "loc": ["body", "birth_date"], "msg": "Field required", "input": {"native_id": "abhisek_mohanty", "date": "2026-04-29"}}, {"type": "missing", "loc": ["body", "birth_tim
```

### [5.6] RAG retrieve (/rag/retrieve — hybrid_rrf) [/rag/retrieve]

```
Connection error: The read operation timed out
```


## ⚠️ Warnings

### [2.5a] rag_graph_nodes (L2.5 CGM — CGM graph nodes — pipeline tool: cgm_graph_walk)

Table exists but 0 rows — data may not be ingested yet

### [2.5b] rag_graph_edges (L2.5 CGM — CGM graph edges — pipeline tool: cgm_graph_walk)

Table exists but 0 rows — data may not be ingested yet

### [2.10] rag_embeddings dimension = 768 (Vertex AI text-multilingual-embedding-002)

Could not check embedding dim: current transaction is aborted, commands ignored until end of transaction block

### [2.11] HNSW index on rag_embeddings (cosine, m=16)

only '%s', '%b', '%t' are allowed as placeholders, got '%h'

### [6.8] cgm_graph_walk — Cloud SQL: rag_graph_nodes + rag_graph_edges (L2.5 CGM)

nodes=0  edges=0 — CGM graph may not be ingested yet
