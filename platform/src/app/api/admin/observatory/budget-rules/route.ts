// GET  /api/admin/observatory/budget-rules — list all rules (?active=true|false|all)
// POST /api/admin/observatory/budget-rules — create a rule
//
// Phase O — O.3 Budgets — first session: budget rules CRUD.
// Authored by USTAD_S3_1_BUDGET_RULES_FRAMEWORK. Both endpoints gate on the
// shared observatory guard (env flag + super-admin role check).

import { NextResponse } from 'next/server'
import { res } from '@/lib/errors'
import { guardObservatoryRoute } from '../_guard'
import {
  createBudgetRule,
  listBudgetRules,
  validateBudgetRuleInput,
} from '@/lib/observatory/budget/persist'

export async function GET(request: Request) {
  const auth = await guardObservatoryRoute()
  if (auth instanceof NextResponse) return auth

  const url = new URL(request.url)
  const activeRaw = url.searchParams.get('active')
  let filter: 'active' | 'inactive' | 'all' = 'all'
  if (activeRaw === 'true') filter = 'active'
  else if (activeRaw === 'false') filter = 'inactive'
  else if (activeRaw && activeRaw !== 'all') {
    return res.badRequest("active must be one of: true|false|all")
  }

  try {
    const rules = await listBudgetRules(filter)
    return NextResponse.json({ rules })
  } catch (err) {
    console.error('[admin/observatory/budget-rules] GET failed', err)
    return res.internal('Failed to list budget rules.')
  }
}

export async function POST(request: Request) {
  const auth = await guardObservatoryRoute()
  if (auth instanceof NextResponse) return auth

  let raw: unknown
  try {
    raw = await request.json()
  } catch {
    return res.badRequest('Request body must be valid JSON.')
  }
  const parsed = validateBudgetRuleInput(raw)
  if (!parsed.ok) return res.badRequest(parsed.message)

  try {
    const createdBy = auth.profile?.id ?? null
    const rule = await createBudgetRule(parsed.value, createdBy)
    return NextResponse.json(rule, { status: 201 })
  } catch (err) {
    console.error('[admin/observatory/budget-rules] POST failed', err)
    return res.internal('Failed to create budget rule.')
  }
}
