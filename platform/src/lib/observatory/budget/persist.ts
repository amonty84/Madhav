// Phase O — O.3 Budgets — DB CRUD helpers shared by the budget-rules routes.
//
// Authored by USTAD_S3_1_BUDGET_RULES_FRAMEWORK. Routes stay thin; this
// module owns the SQL. Soft-delete is the only deletion path: DELETE flips
// `active=false`, never DROPs rows. Created/updated timestamps default at
// the DB layer; UPDATE bumps `updated_at = NOW()`.

import 'server-only'
import { query } from '../../db/client'
import type {
  AlertThreshold,
  BudgetRuleInput,
  BudgetRuleRow,
} from './types'

export type BudgetRulePatch = Partial<
  Pick<
    BudgetRuleInput,
    'name' | 'scope_value' | 'amount_usd' | 'alert_thresholds' | 'active'
  >
>

export async function listBudgetRules(
  filter: 'active' | 'inactive' | 'all' = 'all',
): Promise<BudgetRuleRow[]> {
  const where =
    filter === 'active'
      ? 'WHERE active = TRUE'
      : filter === 'inactive'
        ? 'WHERE active = FALSE'
        : ''
  const sql =
    'SELECT budget_rule_id, name, scope, scope_value, period, amount_usd,' +
    ' alert_thresholds, created_by_user_id, active, created_at, updated_at' +
    ' FROM llm_budget_rules ' +
    where +
    ' ORDER BY created_at ASC'
  const { rows } = await query<BudgetRuleRow>(sql)
  return rows
}

export async function getBudgetRuleById(
  id: string,
): Promise<BudgetRuleRow | null> {
  const { rows } = await query<BudgetRuleRow>(
    'SELECT budget_rule_id, name, scope, scope_value, period, amount_usd,' +
      ' alert_thresholds, created_by_user_id, active, created_at, updated_at' +
      ' FROM llm_budget_rules WHERE budget_rule_id = $1 LIMIT 1',
    [id],
  )
  return rows[0] ?? null
}

export async function createBudgetRule(
  input: BudgetRuleInput,
  createdByUserId: string | null,
): Promise<BudgetRuleRow> {
  const { rows } = await query<BudgetRuleRow>(
    'INSERT INTO llm_budget_rules' +
      ' (name, scope, scope_value, period, amount_usd, alert_thresholds,' +
      '  created_by_user_id, active)' +
      ' VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7, $8)' +
      ' RETURNING budget_rule_id, name, scope, scope_value, period, amount_usd,' +
      '   alert_thresholds, created_by_user_id, active, created_at, updated_at',
    [
      input.name,
      input.scope,
      input.scope_value ?? null,
      input.period,
      input.amount_usd,
      JSON.stringify(input.alert_thresholds ?? []),
      createdByUserId,
      input.active ?? true,
    ],
  )
  return rows[0]
}

export async function patchBudgetRule(
  id: string,
  patch: BudgetRulePatch,
): Promise<BudgetRuleRow | null> {
  const sets: string[] = []
  const params: unknown[] = []
  let idx = 1

  if (patch.name !== undefined) {
    sets.push(`name = $${idx}`)
    params.push(patch.name)
    idx += 1
  }
  if (patch.scope_value !== undefined) {
    sets.push(`scope_value = $${idx}`)
    params.push(patch.scope_value)
    idx += 1
  }
  if (patch.amount_usd !== undefined) {
    sets.push(`amount_usd = $${idx}`)
    params.push(patch.amount_usd)
    idx += 1
  }
  if (patch.alert_thresholds !== undefined) {
    sets.push(`alert_thresholds = $${idx}::jsonb`)
    params.push(JSON.stringify(patch.alert_thresholds))
    idx += 1
  }
  if (patch.active !== undefined) {
    sets.push(`active = $${idx}`)
    params.push(patch.active)
    idx += 1
  }

  if (sets.length === 0) return getBudgetRuleById(id)

  sets.push('updated_at = NOW()')
  params.push(id)

  const sql =
    'UPDATE llm_budget_rules SET ' +
    sets.join(', ') +
    ` WHERE budget_rule_id = $${idx}` +
    ' RETURNING budget_rule_id, name, scope, scope_value, period, amount_usd,' +
    '   alert_thresholds, created_by_user_id, active, created_at, updated_at'
  const { rows } = await query<BudgetRuleRow>(sql, params)
  return rows[0] ?? null
}

/** Soft-delete: sets `active = false`. Returns true if the row existed. */
export async function softDeleteBudgetRule(id: string): Promise<boolean> {
  const { rows } = await query<{ budget_rule_id: string }>(
    'UPDATE llm_budget_rules SET active = FALSE, updated_at = NOW()' +
      ' WHERE budget_rule_id = $1' +
      ' RETURNING budget_rule_id',
    [id],
  )
  return rows.length > 0
}

// ---------------------------------------------------------------------------
// Validation — used by POST + PATCH route handlers
// ---------------------------------------------------------------------------

const VALID_SCOPES: ReadonlySet<string> = new Set([
  'total',
  'provider',
  'model',
  'pipeline_stage',
])
const VALID_PERIODS: ReadonlySet<string> = new Set([
  'daily',
  'weekly',
  'monthly',
])

export interface ValidatedBudgetRuleInput {
  ok: true
  value: BudgetRuleInput
}
export interface RejectedBudgetRuleInput {
  ok: false
  message: string
}
export type BudgetRuleInputResult =
  | ValidatedBudgetRuleInput
  | RejectedBudgetRuleInput

export function validateBudgetRuleInput(
  raw: unknown,
): BudgetRuleInputResult {
  if (!raw || typeof raw !== 'object') {
    return { ok: false, message: 'Request body must be a JSON object.' }
  }
  const r = raw as Record<string, unknown>

  if (typeof r.name !== 'string' || r.name.trim().length === 0) {
    return { ok: false, message: 'name is required and must be a non-empty string.' }
  }
  if (typeof r.scope !== 'string' || !VALID_SCOPES.has(r.scope)) {
    return {
      ok: false,
      message: `scope must be one of: ${Array.from(VALID_SCOPES).join('|')}`,
    }
  }
  if (typeof r.period !== 'string' || !VALID_PERIODS.has(r.period)) {
    return {
      ok: false,
      message: `period must be one of: ${Array.from(VALID_PERIODS).join('|')}`,
    }
  }
  if (typeof r.amount_usd !== 'number' || !Number.isFinite(r.amount_usd) || r.amount_usd <= 0) {
    return { ok: false, message: 'amount_usd must be a positive finite number.' }
  }
  if (r.scope !== 'total' && (typeof r.scope_value !== 'string' || r.scope_value.length === 0)) {
    return {
      ok: false,
      message: `scope_value is required when scope='${r.scope}'.`,
    }
  }
  const thresholdsRaw = r.alert_thresholds
  if (!Array.isArray(thresholdsRaw)) {
    return { ok: false, message: 'alert_thresholds must be an array.' }
  }
  const thresholds: AlertThreshold[] = []
  for (const t of thresholdsRaw) {
    if (
      !t ||
      typeof t !== 'object' ||
      typeof (t as { pct?: unknown }).pct !== 'number' ||
      typeof (t as { channel?: unknown }).channel !== 'string'
    ) {
      return {
        ok: false,
        message: 'each alert_threshold must be {pct: number, channel: string}.',
      }
    }
    const pct = (t as { pct: number }).pct
    if (!Number.isFinite(pct) || pct < 0 || pct > 100) {
      return { ok: false, message: 'alert_threshold.pct must be in [0, 100].' }
    }
    thresholds.push({ pct, channel: (t as { channel: string }).channel })
  }
  if (r.active !== undefined && typeof r.active !== 'boolean') {
    return { ok: false, message: 'active must be a boolean if provided.' }
  }

  return {
    ok: true,
    value: {
      name: r.name.trim(),
      scope: r.scope as BudgetRuleInput['scope'],
      scope_value:
        r.scope === 'total'
          ? null
          : (r.scope_value as string),
      period: r.period as BudgetRuleInput['period'],
      amount_usd: r.amount_usd,
      alert_thresholds: thresholds,
      active: typeof r.active === 'boolean' ? r.active : true,
    },
  }
}

export function validateBudgetRulePatch(raw: unknown): {
  ok: boolean
  value?: BudgetRulePatch
  message?: string
} {
  if (!raw || typeof raw !== 'object') {
    return { ok: false, message: 'Request body must be a JSON object.' }
  }
  const r = raw as Record<string, unknown>
  const out: BudgetRulePatch = {}

  if (r.name !== undefined) {
    if (typeof r.name !== 'string' || r.name.trim().length === 0) {
      return { ok: false, message: 'name must be a non-empty string.' }
    }
    out.name = r.name.trim()
  }
  if (r.scope_value !== undefined) {
    if (r.scope_value !== null && typeof r.scope_value !== 'string') {
      return { ok: false, message: 'scope_value must be a string or null.' }
    }
    out.scope_value = r.scope_value as string | null
  }
  if (r.amount_usd !== undefined) {
    if (
      typeof r.amount_usd !== 'number' ||
      !Number.isFinite(r.amount_usd) ||
      r.amount_usd <= 0
    ) {
      return { ok: false, message: 'amount_usd must be a positive finite number.' }
    }
    out.amount_usd = r.amount_usd
  }
  if (r.alert_thresholds !== undefined) {
    if (!Array.isArray(r.alert_thresholds)) {
      return { ok: false, message: 'alert_thresholds must be an array.' }
    }
    const thresholds: AlertThreshold[] = []
    for (const t of r.alert_thresholds) {
      if (
        !t ||
        typeof t !== 'object' ||
        typeof (t as { pct?: unknown }).pct !== 'number' ||
        typeof (t as { channel?: unknown }).channel !== 'string'
      ) {
        return {
          ok: false,
          message: 'each alert_threshold must be {pct: number, channel: string}.',
        }
      }
      const pct = (t as { pct: number }).pct
      if (!Number.isFinite(pct) || pct < 0 || pct > 100) {
        return { ok: false, message: 'alert_threshold.pct must be in [0, 100].' }
      }
      thresholds.push({ pct, channel: (t as { channel: string }).channel })
    }
    out.alert_thresholds = thresholds
  }
  if (r.active !== undefined) {
    if (typeof r.active !== 'boolean') {
      return { ok: false, message: 'active must be a boolean if provided.' }
    }
    out.active = r.active
  }
  return { ok: true, value: out }
}
