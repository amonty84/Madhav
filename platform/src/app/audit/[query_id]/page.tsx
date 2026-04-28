import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAuditRow } from '@/lib/audit/queries'
import { AuditDetailView } from '@/components/audit/AuditDetailView'
import { QueryClassBadge, DisclosureTierBadge } from '@/components/audit/AuditBadge'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ query_id: string }>
}) {
  const { query_id } = await params
  return { title: `Audit ${query_id.slice(0, 8)}… — MARSYS-JIS` }
}

export default async function AuditDetailPage({
  params,
}: {
  params: Promise<{ query_id: string }>
}) {
  const { query_id } = await params
  const row = await getAuditRow(query_id)
  if (!row) notFound()

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/audit" className="hover:text-foreground transition-colors">Audit log</Link>
        <span aria-hidden="true">/</span>
        <span className="font-mono text-foreground">{query_id.slice(0, 12)}…</span>
      </nav>

      <div className="mb-6 flex flex-wrap items-start gap-3">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold text-foreground truncate">
            {row.query_text?.slice(0, 120) ?? query_id}
          </h1>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <QueryClassBadge queryClass={row.query_class ?? '—'} />
          <DisclosureTierBadge tier={row.disclosure_tier ?? '—'} />
        </div>
      </div>

      <AuditDetailView row={row} />
    </div>
  )
}
