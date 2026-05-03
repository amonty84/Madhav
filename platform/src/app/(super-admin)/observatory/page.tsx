// Observatory Overview page (server component shell). AuthGate is enforced by
// the parent layout (platform/src/app/(super-admin)/observatory/layout.tsx),
// so this page renders only after the layout resolves super-admin + flag.
//
// All data fetching happens inside <OverviewClient />, which uses the typed
// /api/admin/observatory client and re-runs on URL filter changes.

import { OverviewClient } from '@/lib/components/observatory/pages/OverviewClient'

export const dynamic = 'force-dynamic'

export default function ObservatoryOverviewPage() {
  return <OverviewClient />
}
