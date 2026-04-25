import { getServerUser } from '@/lib/firebase/server'
import { createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const user = await getServerUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const chartId = searchParams.get('chartId')
  if (!chartId) return NextResponse.json({ error: 'chartId required' }, { status: 400 })

  const service = createServiceClient()

  // Verify caller can access this chart
  const { data: chart } = await service.from('charts').select('client_id').eq('id', chartId).single()
  if (!chart) return NextResponse.json({ error: 'not found' }, { status: 404 })

  const { data: profile } = await service.from('profiles').select('role').eq('id', user.uid).single()
  if (profile?.role !== 'astrologer' && chart.client_id !== user.uid) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const { data: layers, error } = await service
    .from('pyramid_layers')
    .select('layer, sublayer, status')
    .eq('chart_id', chartId)
    .order('layer')
    .order('sublayer')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(layers ?? [])
}
