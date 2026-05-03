// Observatory — Pricing Diff Monitor (O.4 — S4.4). Server component.
// AuthGate is enforced by the parent observatory layout. The initial result
// is computed in-process via checkPricingHealth() so the panel hydrates with
// real data and no API round-trip.

import { PricingDiffPanel } from '@/lib/components/observatory/analytics/PricingDiffPanel'
import { checkPricingHealth } from '@/lib/observatory/analytics/pricing_diff'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Pricing Diff Monitor' }

export default async function PricingDiffPage() {
  const initialResult = await checkPricingHealth()
  return (
    <div data-testid="observatory-pricing-diff-page" className="space-y-6 p-4">
      <h1 className="text-lg font-semibold">Pricing Diff Monitor</h1>
      <PricingDiffPanel initialResult={initialResult} />
    </div>
  )
}
