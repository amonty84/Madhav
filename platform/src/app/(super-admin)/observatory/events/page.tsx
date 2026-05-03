// Observatory Events page (server component shell). AuthGate is enforced by
// the parent layout. Event-table fetches and side-panel drilldown all live in
// <EventsClient />. The ExportPanel sits above the EventExplorer as a
// collapsible section so the user can pull a filtered slice of usage events
// without leaving this page (S3.4 — USTAD_S3_4_EXPORT_O3_CLOSE).

import { ExportPanel } from '@/lib/components/observatory/export'
import { EventsClient } from '@/lib/components/observatory/pages/EventsClient'

export const dynamic = 'force-dynamic'

export default function ObservatoryEventsPage() {
  return (
    <div className="flex flex-col gap-4">
      <ExportPanel />
      <EventsClient />
    </div>
  )
}
