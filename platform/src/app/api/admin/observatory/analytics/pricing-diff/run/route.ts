// POST /api/admin/observatory/analytics/pricing-diff/run
//
// Scheduled-run endpoint: explicitly triggers the pricing diff check. Same
// behaviour as GET (alert dispatch is part of checkPricingHealth) — exposed
// as POST so Cloud Scheduler / native scripts can invoke it without semantic
// confusion about side-effects on a read endpoint.
//
// Phase O — O.4 Analytics. Authored by USTAD_S4_4_PRICING_DIFF.

import { NextResponse } from 'next/server'
import { res } from '@/lib/errors'
import { guardObservatoryRoute } from '../../../_guard'
import { checkPricingHealth } from '@/lib/observatory/analytics/pricing_diff'

export async function POST() {
  const auth = await guardObservatoryRoute()
  if (auth instanceof NextResponse) return auth

  try {
    const result = await checkPricingHealth()
    return NextResponse.json(result)
  } catch (err) {
    console.error(
      '[admin/observatory/analytics/pricing-diff/run] POST failed',
      err,
    )
    return res.internal('Failed to run pricing diff check.')
  }
}
