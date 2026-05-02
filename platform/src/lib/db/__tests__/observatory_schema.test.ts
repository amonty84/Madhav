// Observatory schema tests — covers the six acceptance cases for migration 038
// (USTAD_S1_1_OBSERVATORY_SCHEMA brief).
//
// Two layers:
//   1. Structural assertions over the migration SQL text (always run; cheap)
//   2. Integration assertions against a real PostgreSQL instance (run only
//      when OBSERVATORY_TEST_DATABASE_URL is set; skipped otherwise)
//
// The integration block is gated because the existing test harness does not
// wire a Postgres test database. Set OBSERVATORY_TEST_DATABASE_URL to a
// throwaway database (the suite will create + drop the five Observatory
// tables in that instance) to exercise the six acceptance cases end-to-end.

import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { Pool } from 'pg'

const REPO_ROOT = resolve(__dirname, '../../../../..')
const MIGRATIONS_DIR = resolve(REPO_ROOT, 'platform/migrations')
const UP_SQL_PATH = resolve(MIGRATIONS_DIR, '038_observatory_schema.sql')
const DOWN_SQL_PATH = resolve(MIGRATIONS_DIR, '038_observatory_schema_down.sql')

const UP_SQL = readFileSync(UP_SQL_PATH, 'utf-8')
const DOWN_SQL = readFileSync(DOWN_SQL_PATH, 'utf-8')

const OBSERVATORY_TABLES = [
  'llm_pricing_versions',
  'llm_usage_events',
  'llm_provider_cost_reports',
  'llm_cost_reconciliation',
  'llm_budget_rules',
] as const

// ---------------------------------------------------------------------------
// Layer 1 — structural assertions (no DB required)
// ---------------------------------------------------------------------------

describe('migration 038 (observatory) — SQL structure', () => {
  it('creates every Observatory table', () => {
    for (const table of OBSERVATORY_TABLES) {
      expect(UP_SQL).toContain(`CREATE TABLE IF NOT EXISTS ${table}`)
    }
  })

  it('creates the five usage-event indices specified in the brief', () => {
    expect(UP_SQL).toContain('idx_llm_usage_events_started_at')
    expect(UP_SQL).toContain('idx_llm_usage_events_provider_model')
    expect(UP_SQL).toContain('idx_llm_usage_events_conversation_id')
    expect(UP_SQL).toContain('idx_llm_usage_events_user_id')
    expect(UP_SQL).toContain('idx_llm_usage_events_pipeline_stage')
  })

  it('creates the pricing-version lookup + idempotent-seed unique index', () => {
    expect(UP_SQL).toContain('idx_llm_pricing_versions_lookup')
    expect(UP_SQL).toContain('uq_llm_pricing_versions_natural_key')
  })

  it('creates the reconciliation date+provider index and natural-key unique index', () => {
    expect(UP_SQL).toContain('idx_llm_cost_reconciliation_date_provider')
    expect(UP_SQL).toContain('uq_llm_cost_reconciliation_natural_key')
    expect(UP_SQL).toContain("COALESCE(model, '')")
  })

  it('declares all six enum CHECK constraints', () => {
    expect(UP_SQL).toContain('llm_pricing_versions_token_class_check')
    expect(UP_SQL).toContain('llm_usage_events_provider_check')
    expect(UP_SQL).toContain('llm_usage_events_pipeline_stage_check')
    expect(UP_SQL).toContain('llm_usage_events_status_check')
    expect(UP_SQL).toContain('llm_cost_reconciliation_status_check')
    expect(UP_SQL).toContain('llm_budget_rules_scope_check')
    expect(UP_SQL).toContain('llm_budget_rules_period_check')
  })

  it('declares the pricing FK on llm_usage_events', () => {
    expect(UP_SQL).toContain(
      'pricing_version_id    UUID REFERENCES llm_pricing_versions(pricing_version_id)',
    )
  })

  it('drops every Observatory table in the down migration', () => {
    for (const table of OBSERVATORY_TABLES) {
      expect(DOWN_SQL).toContain(`DROP TABLE IF EXISTS ${table}`)
    }
  })

  it('drops llm_usage_events before llm_pricing_versions in the down migration (FK order)', () => {
    const eventsIdx = DOWN_SQL.indexOf('DROP TABLE IF EXISTS llm_usage_events')
    const pricingIdx = DOWN_SQL.indexOf('DROP TABLE IF EXISTS llm_pricing_versions')
    expect(eventsIdx).toBeGreaterThanOrEqual(0)
    expect(pricingIdx).toBeGreaterThanOrEqual(0)
    expect(eventsIdx).toBeLessThan(pricingIdx)
  })
})

// ---------------------------------------------------------------------------
// Layer 2 — integration assertions (require a real PostgreSQL test DB)
// ---------------------------------------------------------------------------

const TEST_DB_URL = process.env.OBSERVATORY_TEST_DATABASE_URL

const integrationDescribe = TEST_DB_URL ? describe : describe.skip

integrationDescribe('migration 038 (observatory) — integration', () => {
  let pool: Pool

  beforeAll(async () => {
    pool = new Pool({ connectionString: TEST_DB_URL })
    // Ensure a clean slate. Down is idempotent.
    await pool.query(DOWN_SQL)
  })

  afterAll(async () => {
    if (pool) {
      await pool.query(DOWN_SQL).catch(() => {})
      await pool.end()
    }
  })

  // Case 1
  it('up migration creates all five tables and required indices', async () => {
    await pool.query(UP_SQL)

    const tablesResult = await pool.query<{ table_name: string }>(
      `SELECT table_name FROM information_schema.tables
       WHERE table_schema = 'public' AND table_name = ANY($1::text[])`,
      [OBSERVATORY_TABLES.slice()],
    )
    const observed = new Set(tablesResult.rows.map(r => r.table_name))
    for (const t of OBSERVATORY_TABLES) {
      expect(observed.has(t)).toBe(true)
    }

    const indices = await pool.query<{ indexname: string }>(
      `SELECT indexname FROM pg_indexes WHERE schemaname = 'public'
       AND tablename = ANY($1::text[])`,
      [OBSERVATORY_TABLES.slice()],
    )
    const indexNames = new Set(indices.rows.map(r => r.indexname))
    for (const idx of [
      'idx_llm_usage_events_started_at',
      'idx_llm_usage_events_provider_model',
      'idx_llm_usage_events_conversation_id',
      'idx_llm_usage_events_user_id',
      'idx_llm_usage_events_pipeline_stage',
      'idx_llm_pricing_versions_lookup',
      'idx_llm_provider_cost_reports_provider_bucket',
      'idx_llm_cost_reconciliation_date_provider',
    ]) {
      expect(indexNames.has(idx)).toBe(true)
    }
  })

  // Case 2
  it('down migration removes all five tables without error', async () => {
    await pool.query(DOWN_SQL)

    const remaining = await pool.query<{ table_name: string }>(
      `SELECT table_name FROM information_schema.tables
       WHERE table_schema = 'public' AND table_name = ANY($1::text[])`,
      [OBSERVATORY_TABLES.slice()],
    )
    expect(remaining.rows).toHaveLength(0)

    // Re-up for the cases below.
    await pool.query(UP_SQL)
  })

  // Case 3 — enum CHECK rejection across all six enum-bound columns
  describe('enum CHECK constraints reject invalid values', () => {
    it('rejects invalid provider on llm_usage_events', async () => {
      await expect(
        pool.query(
          `INSERT INTO llm_usage_events
             (conversation_id, prompt_id, user_id, provider, model, pipeline_stage, status, started_at)
           VALUES ('c1','p-bad-provider','u1','not_a_provider','m','classify','success', NOW())`,
        ),
      ).rejects.toThrow()
    })
    it('rejects invalid pipeline_stage', async () => {
      await expect(
        pool.query(
          `INSERT INTO llm_usage_events
             (conversation_id, prompt_id, user_id, provider, model, pipeline_stage, status, started_at)
           VALUES ('c1','p-bad-stage','u1','anthropic','m','not_a_stage','success', NOW())`,
        ),
      ).rejects.toThrow()
    })
    it('rejects invalid status', async () => {
      await expect(
        pool.query(
          `INSERT INTO llm_usage_events
             (conversation_id, prompt_id, user_id, provider, model, pipeline_stage, status, started_at)
           VALUES ('c1','p-bad-status','u1','anthropic','m','classify','not_a_status', NOW())`,
        ),
      ).rejects.toThrow()
    })
    it('rejects invalid token_class on llm_pricing_versions', async () => {
      await expect(
        pool.query(
          `INSERT INTO llm_pricing_versions
             (provider, model, token_class, price_per_million_usd, effective_from)
           VALUES ('anthropic','m','not_a_class', 1.0, NOW())`,
        ),
      ).rejects.toThrow()
    })
    it('rejects invalid scope on llm_budget_rules', async () => {
      await expect(
        pool.query(
          `INSERT INTO llm_budget_rules
             (name, scope, period, amount_usd)
           VALUES ('r1','not_a_scope','daily', 10.00)`,
        ),
      ).rejects.toThrow()
    })
    it('rejects invalid period on llm_budget_rules', async () => {
      await expect(
        pool.query(
          `INSERT INTO llm_budget_rules
             (name, scope, period, amount_usd)
           VALUES ('r1','total','not_a_period', 10.00)`,
        ),
      ).rejects.toThrow()
    })
    it('rejects invalid status on llm_cost_reconciliation', async () => {
      await expect(
        pool.query(
          `INSERT INTO llm_cost_reconciliation
             (reconciliation_date, provider, computed_total_usd, event_count, status)
           VALUES (CURRENT_DATE, 'anthropic', 0.0, 0, 'not_a_status')`,
        ),
      ).rejects.toThrow()
    })
  })

  // Case 4
  it('seed script is idempotent — second run inserts no additional rows', async () => {
    const { seedObservatoryPricingV1, PRICING_V1_ROW_COUNT } = await import(
      '../seed/observatory_pricing/seed_v1'
    )

    // Point the lazy pool the seed uses at the test connection.
    process.env.DATABASE_URL = TEST_DB_URL!

    const first = await seedObservatoryPricingV1()
    expect(first.attempted).toBe(PRICING_V1_ROW_COUNT)
    expect(first.inserted).toBe(PRICING_V1_ROW_COUNT)

    const second = await seedObservatoryPricingV1()
    expect(second.attempted).toBe(PRICING_V1_ROW_COUNT)
    expect(second.inserted).toBe(0)

    const count = await pool.query<{ n: string }>(
      `SELECT COUNT(*)::text AS n FROM llm_pricing_versions`,
    )
    expect(Number(count.rows[0].n)).toBe(PRICING_V1_ROW_COUNT)
  })

  // Case 5
  it('llm_usage_events.pricing_version_id FK rejects nonexistent pricing version', async () => {
    await expect(
      pool.query(
        `INSERT INTO llm_usage_events
           (conversation_id, prompt_id, user_id, provider, model, pipeline_stage, status,
            started_at, pricing_version_id)
         VALUES ('c1','p-fk-bad','u1','anthropic','m','classify','success', NOW(),
                 '00000000-0000-0000-0000-000000000000')`,
      ),
    ).rejects.toThrow()
  })

  // Case 6
  it('llm_cost_reconciliation rejects duplicate (date, provider, model) including NULL model', async () => {
    await pool.query(
      `INSERT INTO llm_cost_reconciliation
         (reconciliation_date, provider, model, computed_total_usd, event_count, status)
       VALUES (CURRENT_DATE, 'anthropic', 'claude-sonnet-4-6', 1.0, 1, 'matched')`,
    )
    await expect(
      pool.query(
        `INSERT INTO llm_cost_reconciliation
           (reconciliation_date, provider, model, computed_total_usd, event_count, status)
         VALUES (CURRENT_DATE, 'anthropic', 'claude-sonnet-4-6', 2.0, 1, 'matched')`,
      ),
    ).rejects.toThrow()

    // The COALESCE-based unique index also rejects duplicates with NULL model.
    await pool.query(
      `INSERT INTO llm_cost_reconciliation
         (reconciliation_date, provider, model, computed_total_usd, event_count, status)
       VALUES (CURRENT_DATE, 'openai', NULL, 5.0, 1, 'matched')`,
    )
    await expect(
      pool.query(
        `INSERT INTO llm_cost_reconciliation
           (reconciliation_date, provider, model, computed_total_usd, event_count, status)
         VALUES (CURRENT_DATE, 'openai', NULL, 6.0, 1, 'matched')`,
      ),
    ).rejects.toThrow()
  })
})
