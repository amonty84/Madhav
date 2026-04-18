import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { listConversations } from '@/lib/conversations'
import type { ConversationModule } from '@/lib/supabase/types'

export async function GET(request: Request) {
  const sb = await createClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const url = new URL(request.url)
  const chartId = url.searchParams.get('chartId')
  const moduleParam = url.searchParams.get('module') ?? 'consume'
  if (!chartId) return NextResponse.json({ error: 'chartId required' }, { status: 400 })

  const conversations = await listConversations({
    chartId,
    userId: user.id,
    module: moduleParam as ConversationModule,
  })

  return NextResponse.json({ conversations })
}
