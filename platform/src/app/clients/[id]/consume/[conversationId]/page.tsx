import { createClient, createServiceClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { ConsumeChat } from '@/components/consume/ConsumeChat'
import {
  getConversation,
  listConversations,
  loadConversationMessages,
} from '@/lib/conversations'

export default async function ConsumeConversationPage({
  params,
}: {
  params: Promise<{ id: string; conversationId: string }>
}) {
  const { id, conversationId } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const service = createServiceClient()
  const [{ data: profile }, { data: chart }] = await Promise.all([
    service.from('profiles').select('role').eq('id', user.id).single(),
    service.from('charts').select('name, birth_date, birth_place, client_id').eq('id', id).single(),
  ])

  if (!chart) redirect('/dashboard')
  const isAstrologer = profile?.role === 'astrologer'
  if (!isAstrologer && chart.client_id !== user.id) redirect('/dashboard')

  const conversation = await getConversation({
    id: conversationId,
    userId: user.id,
    isAstrologer,
  })
  if (!conversation || conversation.chart_id !== id) notFound()

  const [{ data: reports }, conversations, messages] = await Promise.all([
    service.from('reports').select('*').eq('chart_id', id).order('domain'),
    listConversations({ chartId: id, userId: user.id, module: 'consume' }),
    loadConversationMessages(conversationId),
  ])

  const chartMeta = [chart.birth_date, chart.birth_place].filter(Boolean).join(' · ')

  return (
    <ConsumeChat
      chartId={id}
      chartName={chart.name}
      chartMeta={chartMeta}
      reports={reports ?? []}
      conversations={conversations.map(c => ({
        id: c.id,
        title: c.title,
        created_at: c.created_at,
        chart_id: c.chart_id,
        user_id: c.user_id,
        module: c.module,
      }))}
      currentConversationId={conversationId}
      initialMessages={messages}
    />
  )
}
