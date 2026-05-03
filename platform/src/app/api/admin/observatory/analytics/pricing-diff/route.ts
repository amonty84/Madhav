// GET /api/admin/observatory/analytics/pricing-diff
//
// Read-only health check of the per-provider pricing model. Triggers the same
// SQL the nightly job runs, including alert dispatch when a provider crosses
// the staleness or systematic-variance threshold.
//
// Phase O — O.4 Analytics. Authored by USTAD_S4_4_PRICING_DIFF.

import { NextResponse } from 'next/server'
import { res } from '@/lib/errors'
import { guardObservatoryRoute } from '../../_guard'
import { checkPricingHealth } from '@/lib/observatory/analytics/pricing_diff'

export async function GET() {
  const auth = await guardObservatoryRoute()
  if (auth instanceof NextResponse) return auth

  try {
    const result = await checkPricingHealth()
    return NextResponse.json(result)
  } catch (err) {
    console.error('[admin/observatory/analytics/pricing-diff] GET failed', err)
    return res.internal('Failed to check pricing health.')
  }
}
