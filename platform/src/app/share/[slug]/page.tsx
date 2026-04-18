import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase/server'
import { loadConversationMessages } from '@/lib/conversations'
import { SharedConversation } from './SharedConversation'

export const dynamic = 'force-dynamic'

export default async function SharedConversationPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const service = createServiceClient()

  const { data: share } = await service
    .from('conversation_shares')
    .select('conversation_id, revoked_at, expires_at')
    .eq('slug', slug)
    .maybeSingle()

  if (!share || share.revoked_at) notFound()
  if (share.expires_at && new Date(share.expires_at) < new Date()) notFound()

  const { data: conversation } = await service
    .from('conversations')
    .select('id, title, chart_id, created_at')
    .eq('id', share.conversation_id)
    .single()
  if (!conversation) notFound()

  const { data: chart } = await service
    .from('charts')
    .select('name')
    .eq('id', conversation.chart_id)
    .single()

  const messages = await loadConversationMessages(conversation.id)

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-3xl flex-col px-4 py-6">
      <header className="mb-6 border-b border-border pb-4">
        <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
          Shared conversation
        </p>
        <h1 className="mt-1 font-heading text-2xl font-semibold text-foreground">
          {conversation.title ?? 'Untitled chat'}
        </h1>
        {chart?.name && (
          <p className="mt-1 text-sm text-muted-foreground">{chart.name}</p>
        )}
      </header>
      <main className="flex-1">
        <SharedConversation messages={messages} />
      </main>
      <footer className="mt-8 border-t border-border pt-4 text-center text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          AM-JIS
        </Link>
      </footer>
    </div>
  )
}
