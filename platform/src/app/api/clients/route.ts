import { createClient, createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

async function requireAstrologer() {
  const sb = await createClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return null
  const { data: prof } = await sb.from('profiles').select('role').eq('id', user.id).single()
  if (prof?.role !== 'astrologer') return null
  return user
}

export async function GET() {
  const user = await requireAstrologer()
  if (!user) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('charts')
    .select('*, profiles!client_id(name)')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const user = await requireAstrologer()
  if (!user) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  const body = await request.json()
  const { name, birth_date, birth_time, birth_place, birth_lat, birth_lng, client_email } = body

  if (!name || !birth_date || !birth_time || !birth_place || !client_email) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const supabase = createServiceClient()

  const { data: authUser, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(client_email)
  if (inviteError || !authUser.user) {
    return NextResponse.json({ error: inviteError?.message ?? 'Could not create client user' }, { status: 400 })
  }

  const client_id = authUser.user.id

  const { data: chart, error } = await supabase
    .from('charts')
    .insert({
      client_id, name, birth_date, birth_time, birth_place,
      birth_lat: birth_lat ? parseFloat(birth_lat) : null,
      birth_lng: birth_lng ? parseFloat(birth_lng) : null,
    })
    .select()
    .single()

  if (error) {
    await supabase.auth.admin.deleteUser(client_id)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const layers = [
    { chart_id: chart.id, layer: 'L1', sublayer: 'facts' },
    { chart_id: chart.id, layer: 'L2', sublayer: 'analysis_mode_a' },
    { chart_id: chart.id, layer: 'L2', sublayer: 'analysis_mode_b' },
    { chart_id: chart.id, layer: 'L2.5', sublayer: 'synthesis' },
    { chart_id: chart.id, layer: 'L3', sublayer: 'domain_reports' },
    { chart_id: chart.id, layer: 'L4', sublayer: 'query_interface' },
  ]
  const { error: layerError } = await supabase.from('pyramid_layers').insert(layers)
  if (layerError) {
    await supabase.from('charts').delete().eq('id', chart.id)
    await supabase.auth.admin.deleteUser(client_id)
    return NextResponse.json({ error: layerError.message }, { status: 500 })
  }

  return NextResponse.json(chart)
}
