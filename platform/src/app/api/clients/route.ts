import { createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('charts')
    .select('*, profiles!client_id(name)')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const body = await request.json()
  const { name, birth_date, birth_time, birth_place, birth_lat, birth_lng, client_email } = body

  const supabase = createServiceClient()

  // Invite client user via Supabase Auth admin
  const { data: authUser } = await supabase.auth.admin.inviteUserByEmail(client_email)
  if (!authUser.user) {
    return NextResponse.json({ error: 'Could not create client user' }, { status: 400 })
  }

  const client_id = authUser.user.id

  const { data: chart, error } = await supabase
    .from('charts')
    .insert({ client_id, name, birth_date, birth_time, birth_place, birth_lat: birth_lat || null, birth_lng: birth_lng || null })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Initialize pyramid layers
  const layers = [
    { chart_id: chart.id, layer: 'L1', sublayer: 'facts' },
    { chart_id: chart.id, layer: 'L2', sublayer: 'analysis_mode_a' },
    { chart_id: chart.id, layer: 'L2', sublayer: 'analysis_mode_b' },
    { chart_id: chart.id, layer: 'L2.5', sublayer: 'synthesis' },
    { chart_id: chart.id, layer: 'L3', sublayer: 'domain_reports' },
    { chart_id: chart.id, layer: 'L4', sublayer: 'query_interface' },
  ]
  await supabase.from('pyramid_layers').insert(layers)

  return NextResponse.json(chart)
}
