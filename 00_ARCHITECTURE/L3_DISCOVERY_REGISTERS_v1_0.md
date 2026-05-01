---
artifact: L3_DISCOVERY_REGISTERS_v1_0.md
canonical_id: L3_DISCOVERY_REGISTERS
version: 1.0
status: CURRENT
produced_during: Phase 14E
produced_on: 2026-04-29
produced_by_session: Phase-14E-L3-Registers
authoritative_side: claude
---

# L3 Discovery Layer Registers — Canonical Specification

## §1 — Overview

Phase 14E projects the four L3 discovery registers from JSON-on-disk into structured Postgres tables. The registers are the highest-abstraction layer of the MARSYS-JIS corpus — synthesized discoveries that span signals, facts, and events.

| Register | Table | Source JSON | Rows | Tool |
|---|---|---|---|---|
| Pattern Register | `pattern_register` | `PATTERN_REGISTER_v1_0.json` | 22 | `query_patterns` |
| Resonance Register | `resonance_register` | `RESONANCE_REGISTER_v1_0.json` | 12 | `query_resonances_l3` |
| Cluster Register (Atlas) | `cluster_register` | `CLUSTER_ATLAS_v1_0.json` | 12 | `query_clusters` |
| Contradiction Register | `contradiction_register` | `CONTRADICTION_REGISTER_v1_0.json` | 8 | `query_contradictions` |

## §2 — Architectural commitments

1. **JSON is canonical authoring source for L3.** The `.md` companions are human-readable views. If a `.md` companion drifts from its JSON, the JSON wins. The pipeline reads JSONs; `.md` files are not parsed.

2. **Referential integrity (Python-level).** Every register entry's `source_signal_ids` is validated against `msr_signals.signal_id` at ingest time. At Phase 14E close, 0 missing signal references.

3. **Discovery registers are append-only, not regenerated.** Unlike `chart_facts` (rebuilt from FORENSIC on every pipeline run), registers accumulate over time. The ingest pipeline ADDS new entries since the last build but does NOT truncate live tables. Each entry carries `discovered_at` + `discovered_in_build_id`.

4. **Rejected entries are never auto-revived.** A pattern/resonance/cluster with `status='rejected'` set by a human override will never be re-activated by a subsequent JSON re-ingest.

5. **Contradictions dismissed manually persist.** `resolution_status='dismissed'` is protected in the swap logic — re-running the ingest will not revert a dismissed contradiction to 'unresolved'.

## §3 — Table schemas

### pattern_register

```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
pattern_id TEXT UNIQUE NOT NULL              -- 'PAT.001'
name TEXT NOT NULL                           -- first sentence of claim_text
description TEXT NOT NULL                    -- claim_text + mechanism
domain TEXT                                  -- 'career'|'wealth'|'cross_domain'|...
evidence JSONB NOT NULL                      -- {signal_ids: [...], fact_ids: [], event_ids: [...]}
source_signal_ids TEXT[]                     -- denormalized for FK validation
source_fact_ids TEXT[]
confidence NUMERIC NOT NULL CHECK (0-1)      -- HIGH=0.85, MED=0.60, LOW=0.35
discovered_at TIMESTAMPTZ NOT NULL
discovered_in_build_id TEXT NOT NULL REFERENCES build_manifests(build_id)
status TEXT NOT NULL DEFAULT 'active'        -- 'active'|'superseded'|'rejected'
```

Indexes: `domain`, `confidence DESC`, `status`, `source_signal_ids` (GIN).
Staging: `pattern_register_staging`.

### resonance_register

```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
resonance_id TEXT UNIQUE NOT NULL            -- 'RES.001'
theme TEXT NOT NULL                          -- derived from domains_bridged: 'career_spiritual'
description TEXT NOT NULL                    -- claim_text + mechanism
signal_ids TEXT[] NOT NULL                   -- MSR signals in this resonance
pattern_ids TEXT[]                           -- L3 patterns (populated in future)
domains TEXT[]                               -- all domains touched
confidence NUMERIC NOT NULL CHECK (0-1)
discovered_at TIMESTAMPTZ NOT NULL
discovered_in_build_id TEXT NOT NULL REFERENCES build_manifests(build_id)
status TEXT NOT NULL DEFAULT 'active'
```

Indexes: `theme`, `signal_ids` (GIN), `domains` (GIN).

### cluster_register

```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
cluster_id TEXT UNIQUE NOT NULL              -- 'CLUS.001'
name TEXT NOT NULL                           -- cluster_label from JSON
theme TEXT NOT NULL                          -- lowercase snake_case of first 4 words of name
description TEXT NOT NULL                    -- annotation or name
member_signal_ids TEXT[] NOT NULL            -- MSR signals in cluster
member_fact_ids TEXT[]
member_event_ids TEXT[]
domain TEXT                                  -- dominant_domain
confidence NUMERIC NOT NULL CHECK (0-1)
discovered_at TIMESTAMPTZ NOT NULL
discovered_in_build_id TEXT NOT NULL REFERENCES build_manifests(build_id)
status TEXT NOT NULL DEFAULT 'active'
```

Indexes: `theme`, `domain`, `member_signal_ids` (GIN).

### contradiction_register

```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
contradiction_id TEXT UNIQUE NOT NULL        -- 'CON.001'
statement_a TEXT NOT NULL                    -- first clause of hypothesis_text (split on '; ')
statement_b TEXT NOT NULL                    -- second clause or mechanism
conflict_type TEXT NOT NULL                  -- 'signal_vs_signal'|'fact_vs_signal'|...
evidence JSONB NOT NULL                      -- {signal_ids: [...], fact_ids: [], l1_references: [...]}
source_signal_ids TEXT[]
source_fact_ids TEXT[]
resolution_status TEXT NOT NULL              -- 'unresolved'|'accepted'|'dismissed'|'reframed'
resolution_notes TEXT                        -- first 3 resolution_options from JSON
domain TEXT
confidence NUMERIC NOT NULL CHECK (0-1)
discovered_at TIMESTAMPTZ NOT NULL
discovered_in_build_id TEXT NOT NULL REFERENCES build_manifests(build_id)
```

Indexes: `resolution_status`, `domain`, `source_signal_ids` (GIN).

## §4 — Pipeline integration

Source: `platform/python-sidecar/pipeline/extractors/register_loader.py`

Writers:
- `pipeline/writers/pattern_register_writer.py` — `PatternRegisterWriter`
- `pipeline/writers/resonance_register_writer.py` — `ResonanceRegisterWriter`
- `pipeline/writers/cluster_register_writer.py` — `ClusterRegisterWriter`
- `pipeline/writers/contradiction_register_writer.py` — `ContradictionRegisterWriter`

One-shot ingest runner: `pipeline/ingest_l3_registers.py`

All writers inherit `IBuildWriter` (Phase 14C Stream F interface) and implement `write_to_staging`, `validate_staging`, `swap_to_live`.

Build manifest: `build-l3-registers-20260429` (status=live).

## §5 — Tool surface

Four tools registered in `platform/src/lib/claude/consume-tools.ts`:

| Tool | Primary queries it answers |
|---|---|
| `query_patterns(domain?, confidence_min?, status?)` | "what patterns has the chart revealed?", "find career patterns with confidence>0.7" |
| `query_resonances_l3(theme?, signal_id?, domain?)` | "what are the deep cross-domain resonances?", "what unifies career and spiritual?" |
| `query_clusters(theme?, domain?, confidence_min?)` | "which signals cluster together?", "show Saturn clusters" |
| `query_contradictions(unresolved_only?, domain?, conflict_type?)` | "what are the unresolved tensions?", "which signals conflict?" |

Tool files: `platform/src/lib/tools/structured/`.

## §6 — Confidence scale

All four registers use HIGH/MED/LOW labels in their source JSONs. Ingestion maps:
- `HIGH` → 0.85
- `MED` → 0.60
- `LOW` → 0.35
- Numeric values (clusters) → used as-is.

## §7 — Runbook: re-ingesting after register updates

1. Update the relevant JSON in `035_DISCOVERY_LAYER/REGISTERS/`.
2. Run:
   ```bash
   cd platform/python-sidecar
   DATABASE_URL=<url> python3 -m pipeline.ingest_l3_registers
   ```
3. Append-only swap: existing entries are updated; new entries are added; rejected entries are not revived.
4. Verify row counts in DB; rotate `CAPABILITY_MANIFEST.json` fingerprint.

## §8 — FK status at Phase 14E close

| FK check | Status | Notes |
|---|---|---|
| `source_signal_ids → msr_signals.signal_id` | ✅ 0 missing refs | 499 signals in msr_signals cover all register references |
| `source_fact_ids → chart_facts.fact_id` | ⚠️ not validated | chart_facts is empty (14C Streams B-H pending); registers do not reference chart_facts directly |
| `member_event_ids → life_events.event_id` | ⚠️ not validated | life_events is empty (14C Stream E pending); registers use short hash refs, not EVT.* IDs |

The signal FK is the load-bearing validation. fact_id and event_id validation will close when 14C completes.
