import { getServerUser } from '@/lib/firebase/server'
import { query } from '@/lib/db/client'
import { redirect, notFound } from 'next/navigation'
import { BuildChat } from '@/components/build/BuildChat'
import {
  getConversation,
  listConversations,
  loadConversationMessages,
} from '@/lib/conversations'
import { fetchBuildState } from '@/lib/build/dataSource'

export default async function BuildConversationPage({
  params,
}: {
  params: Promise<{ id: string; conversationId: string }>
}) {
  const { id, conversationId } = await params

  const user = await getServerUser()
  if (!user) redirect('/login')

  const profileResult = await query<{ role: string }>(
    'SELECT role FROM profiles WHERE id=$1',
    [user.uid]
  )
  if (profileResult.rows[0]?.role !== 'super_admin') redirect('/dashboard')

  const chartResult = await query<{ id: string; name: string }>(
    'SELECT id, name FROM charts WHERE id=$1',
    [id]
  )
  if (!chartResult.rows[0]) redirect('/dashboard')
  const chart = chartResult.rows[0]

  const conversation = await getConversation({
    id: conversationId,
    userId: user.uid,
    isSuperAdmin: true,
  })
  if (!conversation || conversation.chart_id !== id) notFound()

  const [layersResult, conversations, messages, state] = await Promise.all([
    query<{ layer: string; sublayer: string; status: 'not_started' | 'in_progress' | 'complete' }>(
      'SELECT layer, sublayer, status FROM pyramid_layers WHERE chart_id=$1 ORDER BY layer, sublayer',
      [id]
    ),
    listConversations({ chartId: id, userId: user.uid, module: 'build' }),
    loadConversationMessages(conversationId),
    fetchBuildState(),
  ])

  const insights = layersResult.rows
    .filter(l => l.status === 'complete')
    .slice(-5)
    .map(l => ({
      id: `${l.layer}-${l.sublayer}`,
      severity: 'positive' as const,
      text: `${l.layer}${l.sublayer ? ` / ${l.sublayer}` : ''} built`,
    }))

  return (
    <BuildChat
      chartId={id}
      chartName={chart.name}
      conversations={conversations}
      currentConversationId={conversationId}
      initialMessages={messages}
      arc={state.macro_phase.macro_arc}
      activePhaseId={state.macro_phase.id}
      brief={state.current_brief}
      insights={insights}
      mirrorPairs={state.mirror_pairs}
      layers={layersResult.rows}
    />
  )
}
