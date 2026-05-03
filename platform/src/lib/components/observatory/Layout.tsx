import Link from 'next/link'
import { ReconciliationBanner } from './reconciliation'

export function ObservatoryLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header
        data-testid="observatory-topbar"
        className="flex items-center justify-between border-b px-6 py-3"
      >
        <h1 className="text-lg font-semibold">LLM Observatory</h1>
        <div className="flex items-center gap-3">
          <div
            data-testid="date-range-placeholder"
            className="rounded border px-3 py-1 text-sm text-muted-foreground"
            aria-label="Date range picker (S1.10)"
          >
            Last 7 days
          </div>
          <button
            type="button"
            data-testid="observatory-reload"
            disabled
            aria-label="Reload"
            className="rounded border px-2 py-1 text-sm opacity-50"
          >
            ↻
          </button>
          <button
            type="button"
            data-testid="observatory-settings"
            disabled
            aria-label="Settings"
            className="rounded border px-2 py-1 text-sm opacity-50"
          >
            ⚙
          </button>
        </div>
      </header>
      {/* USTAD_S2_6 — reconciliation status strip, sits between top bar and
          the nav/main split. Renders nothing when there is no history. */}
      <ReconciliationBanner />
      <div className="flex flex-1">
        <nav
          data-testid="observatory-sidebar"
          aria-label="Observatory sections"
          className="w-56 border-r p-4"
        >
          <ul className="flex flex-col gap-1 text-sm">
            <li>
              <Link
                href="/observatory"
                data-testid="observatory-nav-overview"
                className="block rounded px-2 py-1 hover:bg-muted"
              >
                Overview
              </Link>
            </li>
            <li>
              <Link
                href="/observatory/events"
                data-testid="observatory-nav-events"
                className="block rounded px-2 py-1 hover:bg-muted"
              >
                Events
              </Link>
            </li>
            <li>
              <Link
                href="/observatory/reconciliation"
                data-testid="observatory-nav-reconciliation"
                className="block rounded px-2 py-1 hover:bg-muted"
              >
                Reconciliation
              </Link>
            </li>
            <li>
              <Link
                href="/observatory/budgets"
                data-testid="observatory-nav-budgets"
                className="block rounded px-2 py-1 hover:bg-muted"
              >
                Budgets
              </Link>
            </li>
            <li>
              <span
                data-testid="observatory-nav-insights"
                aria-disabled="true"
                title="Phase O.4 — not yet available"
                className="block rounded px-2 py-1 text-muted-foreground opacity-50"
              >
                Insights
              </span>
            </li>
          </ul>
        </nav>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
