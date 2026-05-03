// GET /api/admin/observatory/analytics/replay/pricing-versions
//
// Phase O — O.4 Advanced Analytics — replay form helper.
// Authored by USTAD_S4_5_REPLAY_RECOST.
//
// Returns distinct (pricing_version_id, provider, model, effective_from)
// rows sorted by effective_from DESC for the ReplayPanel form dropdown.
// Read-only — no DB writes anywhere in this code path.

import { NextResponse } from 'next/server'
import { res } from '@/lib/errors'
import { guardObservatoryRoute } from '../../../_guard'
import { listReplayPricingVersions } from '@/lib/observatory/analytics/replay'

export async function GET() {
  const auth = await guardObservatoryRoute()
  if (auth instanceof NextResponse) return auth
  try {
    const versions = await listReplayPricingVersions()
    return NextResponse.json({ versions })
  } catch (err) {
    console.error(
      '[admin/observatory/analytics/replay/pricing-versions] failed',
      err,
    )
    return res.internal('Failed to list pricing versions.')
  }
}
