import Link from 'next/link'
import { listAuditRows } from '@/lib/audit/queries'
import { AuditListClient } from '@/components/audit/AuditListClient'

export const metadata = { title: 'Audit Log — MARSYS-JIS' }

export default async function AuditListPage() {
  const initial = await listAuditRows(1, 25, {})

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Audit Log</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">Query execution traces — super-admin view</p>
        </div>
        <nav aria-label="Audit navigation" className="flex gap-2 text-sm">
          <Link
            href="/audit/predictions"
            className="rounded border border-border px-3 py-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            Predictions
          </Link>
        </nav>
      </div>
      <AuditListClient initial={initial} />
    </div>
  )
}
