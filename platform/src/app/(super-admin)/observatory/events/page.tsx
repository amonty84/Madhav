// Observatory Events page (server component shell). AuthGate is enforced by
// the parent layout. Event-table fetches and side-panel drilldown all live in
// <EventsClient />.

import { EventsClient } from '@/lib/components/observatory/pages/EventsClient'

export const dynamic = 'force-dynamic'

export default function ObservatoryEventsPage() {
  return <EventsClient />
}
