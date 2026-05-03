// Observatory — Anomaly Detection (O.4 — S4.6). Server component.
// AuthGate is enforced by the parent observatory layout. The initial result
// is computed in-process via detectAnomalies() so the panel hydrates with
// real data and no API round-trip.

import { AnomalyPanel } from '@/lib/components/observatory/analytics/AnomalyPanel'
import { detectAnomalies } from '@/lib/observatory/analytics/anomaly'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Anomaly Detection — Observatory' }

export default async function AnomalyDetectionPage() {
  const initialResult = await detectAnomalies()
  return (
    <div data-testid="observatory-anomaly-page" className="space-y-6 p-4">
      <h1 className="text-lg font-semibold">Anomaly Detection</h1>
      <AnomalyPanel initialResult={initialResult} />
    </div>
  )
}
