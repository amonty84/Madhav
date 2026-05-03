// Observatory — Conversation Cost Arc page (server component shell).
// AuthGate is enforced by the parent observatory layout. The 30-day window
// is computed at render time and passed to the client panel for the initial
// fetch.
//
// Phase O — O.4 — USTAD_S4_3_COST_ARC.

import { ConversationCostArcPanel } from '@/lib/components/observatory/analytics/ConversationCostArcPanel'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Conversation Cost Arc — Observatory',
}

export default function ConversationCostArcPage() {
  const now = new Date()
  const dateEnd = now.toISOString()
  const dateStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()

  return (
    <div className="flex flex-col gap-4 p-4">
      <header>
        <h1 className="text-lg font-semibold">Conversation Cost Arc</h1>
        <p className="text-xs text-muted-foreground">
          Top conversations by total LLM spend over the last 30 days. Select a
          conversation to inspect its per-event cumulative cost arc.
        </p>
      </header>
      <ConversationCostArcPanel dateStart={dateStart} dateEnd={dateEnd} />
    </div>
  )
}
