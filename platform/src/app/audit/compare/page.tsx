import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAuditRow } from '@/lib/audit/queries'
import { CompareView } from '@/components/audit/CompareView'

export const metadata = { title: 'Compare — MARSYS-JIS' }

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string }>
}) {
  const { ids } = await searchParams
  const idList = (ids ?? '').split(',').map((s) => s.trim()).filter(Boolean)

  if (idList.length !== 2) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-8">
        <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link href="/audit" className="hover:text-foreground transition-colors">Audit log</Link>
          <span aria-hidden="true">/</span>
          <span className="text-foreground">Compare</span>
        </nav>
        <div className="rounded-md border border-border bg-card px-6 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            Select exactly 2 rows from the{' '}
            <Link href="/audit" className="underline hover:text-foreground">audit log</Link>{' '}
            to compare.
          </p>
        </div>
      </div>
    )
  }

  const [rowA, rowB] = await Promise.all([
    getAuditRow(idList[0]),
    getAuditRow(idList[1]),
  ])

  if (!rowA || !rowB) notFound()

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/audit" className="hover:text-foreground transition-colors">Audit log</Link>
        <span aria-hidden="true">/</span>
        <span className="text-foreground">Compare</span>
      </nav>

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">Side-by-side comparison</h1>
        <Link
          href="/audit"
          className="rounded border border-border px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          ← Back to list
        </Link>
      </div>

      <CompareView rowA={rowA} rowB={rowB} />
    </div>
  )
}
