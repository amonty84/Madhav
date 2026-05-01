import Link from 'next/link'
import { fetchSessionDetail } from '@/lib/build/dataSource'
import { SessionDetail } from '@/components/build/SessionDetail'

export const dynamic = 'force-dynamic'

export default async function SessionDetailPage({
  params,
}: {
  params: Promise<{ session_id: string }>
}) {
  const { session_id } = await params
  const detail = await fetchSessionDetail(session_id)

  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      <Link href="/build/sessions" className="bt-body text-muted-foreground hover:underline">
        ← Back to sessions
      </Link>
      <h1 className="bt-display mt-3 mb-6">Session</h1>
      <SessionDetail detail={detail} />
    </main>
  )
}
