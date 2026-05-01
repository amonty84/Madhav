import { NextResponse } from 'next/server'
import { getServerUser } from '@/lib/firebase/server'
import { listConversations } from '@/lib/conversations'
import type { ConversationModule } from '@/lib/db/types'

export async function GET(request: Request) {
  const user = await getServerUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const url = new URL(request.url)
  const chartId = url.searchParams.get('chartId')
  const moduleParam = url.searchParams.get('module') ?? 'consume'
  if (!chartId) return NextResponse.json({ error: 'chartId required' }, { status: 400 })

  const conversations = await listConversations({
    chartId,
    userId: user.uid,
    module: moduleParam as ConversationModule,
  })

  return NextResponse.json({ conversations })
}
