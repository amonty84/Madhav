import { getServerUser } from '@/lib/firebase/server'
import { listConversations } from '@/lib/conversations'
import { res } from '@/lib/errors'
import type { ConversationModule } from '@/lib/db/types'

export async function GET(request: Request) {
  const user = await getServerUser()
  if (!user) return res.unauthenticated()

  const url = new URL(request.url)
  const chartId = url.searchParams.get('chartId')
  const moduleParam = url.searchParams.get('module') ?? 'consume'
  if (!chartId) return res.badRequest('chartId required')

  let conversations
  try {
    conversations = await listConversations({
      chartId,
      userId: user.uid,
      module: moduleParam as ConversationModule,
    })
  } catch {
    return res.dbError()
  }

  return Response.json({ conversations })
}
