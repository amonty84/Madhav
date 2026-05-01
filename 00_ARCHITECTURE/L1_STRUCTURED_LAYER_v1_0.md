---
artifact: L1_STRUCTURED_LAYER_v1_0.md
canonical_id: L1_STRUCTURED_LAYER
version: 1.0
status: CURRENT
produced_during: Phase_14C_Stream_H
produced_on: 2026-04-29
layer: L1
description: >
  Canonical spec for the L1 Structured Layer — six Postgres tables that project the
  L1 Facts Layer markdown into deterministic, indexed, LLM-queryable row stores.
  Covers schemas, tool surface, extraction methodology, re-extraction runbook, and
  idempotency rules.
changelog:
  - v1.0 (2026-04-29): Initial spec produced at Phase 14C Stream H close.
---

# L1 Structured Layer — Canonical Specification

## §1 — Purpose and architectural position

The L1 Structured Layer converts the L1 Facts Layer's authoritative markdown sources into
six Postgres tables. These tables exist to serve the LLM query pipeline with deterministic,
indexed lookups — replacing embedding-search guesses for factual questions that have exact
answers in the chart data or ephemeris.

**The markdown stays canonical for authoring.** `01_FACTS_LAYER/*.md` and
`01_FACTS_LAYER/STRUCTURED/*.yaml` are the source-of-truth that humans edit. The six tables
are *projections* of that truth. The pipeline rebuilds projections from the source on each
run. If a table row disagrees with the markdown source, the markdown wins and the table must
be re-ingested.

**Postgres is canonical for runtime.** Once populated, a query like "what was Saturn's
longitude on 2018-03-15?" hits `ephemeris_daily` at indexed row resolution — not an
embedding search across prose.

---

## §2 — Table inventory

| Table | Source | Rows (Phase 14C) | Resolution |
|---|---|---|---|
| `chart_facts` | `CHART_FACTS_EXTRACTION_v1_0.yaml` (GCS) | 589 | One row per named fact from FORENSIC v8.0 |
| `ephemeris_daily` | Swiss Ephemeris (pyswisseph), Lahiri sidereal | 660,726 | One row per (date, planet), 1900-01-01..2100-12-31 |
| `eclipses` | `ECLIPSES_1900_2100.csv` (GCS) | 913 | One row per eclipse event |
| `retrogrades` | `RETROGRADES_1900_2100.csv` (GCS) | 2,462 | Two rows per retrograde cycle (retrograde_start + retrograde_end) |
| `life_events` | `LIFE_EVENT_LOG_v1_2.md` (GCS) | 36 | One row per keyed life event with JSONB chart_state |
| `sade_sati_phases` | `SADE_SATI_CYCLES_ALL.md` (GCS) | 46 | One row per phase (rising/peak/setting) per cycle |

All six tables have `_staging` counterparts. The pipeline's staging-then-swap discipline
(Phase 14B) governs every ingest: write to staging → validate → swap atomically to live.
Every row carries `build_id` (FK to `build_manifests`) for full provenance tracking.

---

## §3 — Schema summaries

### chart_facts

Primary key: `fact_id TEXT UNIQUE NOT NULL` (e.g. `PLN.SUN`, `CUSP.07.STAR_LORD`, `YOGA.GAJAKESARI`).

Key columns: `category` (planet/house/cusp/saham/yoga/special_lagna/dasha_balance/…),
`divisional_chart` (D1/D9/D10/…), `value_text`, `value_number`, `value_json` JSONB,
`source_section`, `is_stale BOOLEAN`.

**Fact ID scheme** (as produced by `CHART_FACTS_EXTRACTION_v1_0.yaml`):
- Planet longitudes: `PLN.<PLANET>` (e.g. `PLN.SUN`, `PLN.SATURN`)
- KP sub-lords: `KP.PLN.<PLANET>` (e.g. `KP.PLN.SUN`)
- Divisional chart placements: `D9.<PLANET>`, `D10.<PLANET>`, etc.
- Cross-system info: `CSI.<PLANET>`
- Metadata: `MET.<PLANET>.SIGN`, etc.

*Note:* the exec brief's exemplar `PLN.SUN.LON_DEG` was illustrative; the actual extraction
uses a flatter scheme. The `fact_id` space is governed by the YAML extraction, not the brief.

### ephemeris_daily

Primary key: `id BIGSERIAL`. Unique constraint: `(date, planet)`.

Key columns: `date DATE`, `planet TEXT` (sun/moon/mars/mercury/jupiter/venus/saturn/rahu/ketu),
`longitude_deg NUMERIC(11,7)` (0–360, sidereal Lahiri), `is_retrograde BOOLEAN`,
`sign TEXT`, `nakshatra TEXT`, `nakshatra_pada SMALLINT` (1–4), `speed_deg_per_day NUMERIC(11,7)`,
`ayanamsha TEXT` (always 'lahiri'), `ephemeris_version TEXT`.

Rahu/Ketu note: `is_retrograde=TRUE` by convention (mean node is always retrograde).

### eclipses

Unique: `(date, type)`. Type enum: solar_total / solar_annular / solar_partial / lunar_total / lunar_partial / lunar_penumbral.

Key columns: `date DATE`, `type TEXT`, `longitude_deg NUMERIC(11,7)`, `sign TEXT`, `nakshatra TEXT`, `visibility_region TEXT` (free-form geographic note).

### retrogrades

Unique: `(planet, station_type, date)`. Planet: Mercury/Venus/Mars/Jupiter/Saturn.

Key columns: `planet TEXT`, `station_type TEXT` (retrograde_start/retrograde_end), `date DATE`, `longitude_deg NUMERIC(11,7)`, `sign TEXT`.

Each retrograde *cycle* in the CSV → 2 rows (start station + end station).

### life_events

Unique: `event_id TEXT` (e.g. `EVT.2013.12.11.01`).

Key columns: `event_date DATE`, `category TEXT` (career/health/family/relationship/spiritual/travel/finance/education/residential/creative/loss/other), `description TEXT`, `significance TEXT` (major/moderate/minor), `chart_state JSONB` (Swiss Ephemeris snapshot from LEL v1.2), `source_section TEXT`.

### sade_sati_phases

Unique: `(cycle_number, phase, start_date)`. Phase enum: pre_birth / rising / peak / setting / gap.

Key columns: `cycle_number SMALLINT` (0=pre-birth, 1–4=lifetime), `phase TEXT`, `start_date DATE`, `end_date DATE`, `saturn_sign_at_start TEXT`, `notes TEXT`.

---

## §4 — LLM tool surface

Seven TypeScript tools registered in `platform/src/lib/claude/consume-tools.ts` as of Phase 14C:

| Tool | File | Primary input | Primary output |
|---|---|---|---|
| `query_chart_fact` | `query_chart_fact.ts` | fact_id / category | chart_facts rows |
| `query_planet_position` | `query_planet_position.ts` | date, planet? | ephemeris_daily rows |
| `query_eclipse_window` | `query_eclipse_window.ts` | start_date, end_date, type? | eclipses rows |
| `query_retrograde_window` | `query_retrograde_window.ts` | start_date, end_date, planet? | retrogrades rows |
| `query_life_events` | `query_life_events.ts` | category?, date range? | life_events rows |
| `query_sade_sati` | `query_sade_sati.ts` | date?, cycle_number?, phase? | sade_sati_phases rows |
| `query_dasha` | `query_dasha.ts` | system?, planet? | chart_facts WHERE category=dasha_balance |

All tools use parameterized SQL (`@/lib/db/client` query function), validate inputs with Zod, and return rows with provenance metadata.

---

## §5 — Extraction methodology

### chart_facts (FORENSIC → YAML)

Source: `01_FACTS_LAYER/FORENSIC_ASTROLOGICAL_DATA_v8_0.md` (11,394-line markdown).

Extraction: LLM-assisted draft per section + regex post-processing, producing
`01_FACTS_LAYER/STRUCTURED/CHART_FACTS_EXTRACTION_v1_0.yaml`. Validated against
`CHART_FACTS_SCHEMA_v1_0.json`. Native-validated (Phase 14C Stream B) before promotion.

The YAML is committed to git and uploaded to GCS (`gs://madhav-marsys-sources/L1/facts/STRUCTURED/`).
It is **not re-generated on every pipeline run** — only when FORENSIC version bumps (see §6).

### ephemeris_daily (Swiss Ephemeris bootstrap)

Source: `pyswisseph` library, Lahiri sidereal ayanamsha (`swe.set_sid_mode(swe.SIDM_LAHIRI)`).

One-shot bootstrap: `platform/python-sidecar/pipeline/bootstrap_ephemeris.py --build-id bootstrap-phase14c`.
Writes to `ephemeris_daily_staging` in 10K-row batches. Swap via `swap_ephemeris_staging.py`.

Cross-check: 100 random month-start spot-checks against `EPHEMERIS_MONTHLY_1900_2100.csv`
(tolerance ≤0.01°). If CSV missing (Phase 14C initial run): skip cross-check, mark residual.

**Idempotency:** if `ephemeris_daily` already has rows for the build_id, the bootstrap
exits 0 with warning. If rows exist for a *different* build_id, the bootstrap refuses and
surfaces the conflict — rebuilding ephemeris is a manual decision.

### eclipses + retrogrades (CSV ingest)

Source: `ECLIPSES_1900_2100.csv` / `RETROGRADES_1900_2100.csv` from GCS `L1/ephemeris/`.

Writers: `eclipses_writer.py`, `retrogrades_writer.py` — standard IBuildWriter pattern
(Phase 14B staging-then-swap discipline).

Retrograde expansion: one CSV row (one cycle) → two DB rows (`retrograde_start` + `retrograde_end`).

### life_events (LEL markdown)

Source: `LIFE_EVENT_LOG_v1_2.md` from GCS `L1/facts/`.

Extractor: `life_event_extractor.py` uses **regex-based line-by-line parsing**, NOT yaml.safe_load.
Reason: many LEL YAML code-fence blocks contain unquoted colons in `native_reflection` /
`description` prose fields — yaml.safe_load fails on 18 of 36 events. Regex splits at
`EVT.` boundary markers and extracts each field with targeted patterns.

### sade_sati_phases (SADE_SATI_CYCLES_ALL.md)

Source: `SADE_SATI_CYCLES_ALL.md` from GCS `L1/facts/`.

Extractor: `sade_sati_extractor.py` parses the pipe table using regex. Pre-birth cycle
→ cycle_number=0; Cycle 1–4 → 1–4. Rising/Peak/Setting → 'rising'/'peak'/'setting'.

---

## §6 — Re-extraction runbook

### When FORENSIC version bumps (e.g. v8.0 → v8.1)

1. Re-run `forensic_extractor.py` against the new FORENSIC version.
2. Native validates side-by-side diff (old YAML vs new YAML) — focus on changed sections.
3. Commit new `CHART_FACTS_EXTRACTION_v2_0.yaml` (version-bump the YAML, not overwrite).
4. Upload to GCS (`L1/facts/STRUCTURED/`).
5. Update `chart_facts_writer.py` `YAML_URI` constant to point at new version.
6. Re-run `ingest_chart_facts.py` with a new `BUILD_ID` (e.g. `build-14c-chart-facts-v2-YYYYMMDD`).
7. The swap will replace the v1 rows with v2 rows atomically.

### When LEL version bumps

Re-run `ingest_life_events_sade_sati.py` with a new `BUILD_ID`. The writers use
`ON CONFLICT (event_id) DO UPDATE` (life_events) and `ON CONFLICT (cycle_number, phase, start_date) DO UPDATE`
(sade_sati), so re-runs are safe.

### When ephemeris spot-checks reveal a discrepancy

The ephemeris_daily table is a one-time bootstrap. If a discrepancy is found:
1. Document the finding in `DISAGREEMENT_REGISTER_v1_0.md`.
2. Native decision required before re-running bootstrap (high blast radius: 660K rows).
3. Re-run `bootstrap_ephemeris.py` with a new `--build-id`. The old rows remain in
   `ephemeris_daily`; the script will refuse if rows exist for a different build_id — this
   is intentional. To force a re-bootstrap: manually DELETE FROM ephemeris_daily first.

---

## §7 — Idempotency rules

| Table | Re-run safe? | Mechanism |
|---|---|---|
| chart_facts | Yes | ON CONFLICT (fact_id) DO UPDATE |
| ephemeris_daily | No (manual decision) | bootstrap script refuses if rows exist for a different build_id |
| eclipses | Yes | ON CONFLICT (date, type) DO UPDATE |
| retrogrades | Yes | ON CONFLICT (planet, station_type, date) DO UPDATE |
| life_events | Yes | ON CONFLICT (event_id) DO UPDATE |
| sade_sati_phases | Yes | ON CONFLICT (cycle_number, phase, start_date) DO UPDATE |

---

*End of L1_STRUCTURED_LAYER_v1_0.md — Phase 14C Stream H close artifact.*
