// GET /api/admin/observatory/budget-rules/evaluate
//
// Evaluates active budget rules against current spend. ?rule_id=X scopes the
// evaluation to a single rule. Otherwise: evaluates all active rules and
// returns the array sorted by pct_used DESC.
//
// Phase O — O.3 Budgets. Authored by USTAD_S3_1_BUDGET_RULES_FRAMEWORK.

import { NextResponse } from 'next/server'
import { res } from '@/lib/errors'
import { guardObservatoryRoute } from '../../_guard'
import { evaluateAllRules, evaluateBudgetRule } from '@/lib/observatory/budget/evaluate'
import { getBudgetRuleById } from '@/lib/observatory/budget/persist'

export async function GET(request: Request) {
  const auth = await guardObservatoryRoute()
  if (auth instanceof NextResponse) return auth

  const url = new URL(request.url)
  const ruleId = url.searchParams.get('rule_id')

  try {
    if (ruleId) {
      const rule = await getBudgetRuleById(ruleId)
      if (!rule) return res.notFound(`No budget rule with id ${ruleId}.`)
      const result = await evaluateBudgetRule(rule)
      return NextResponse.json({ results: [result] })
    }
    const results = await evaluateAllRules()
    return NextResponse.json({ results })
  } catch (err) {
    console.error('[admin/observatory/budget-rules/evaluate] failed', err)
    return res.internal('Failed to evaluate budget rules.')
  }
}
