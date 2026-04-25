import { getServerUser, adminAuth } from '@/lib/firebase/server'
import { createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

async function requireAstrologer() {
  const user = await getServerUser()
  if (!user) return null
  const service = createServiceClient()
  const { data: prof } = await service.from('profiles').select('role').eq('id', user.uid).single()
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

  // Create Firebase user account for the client
  let firebaseUser: Awaited<ReturnType<typeof adminAuth.createUser>>
  try {
    firebaseUser = await adminAuth.createUser({ email: client_email, emailVerified: false })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Could not create client user'
    return NextResponse.json({ error: message }, { status: 400 })
  }

  const client_id = firebaseUser.uid

  const supabase = createServiceClient()
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
    await adminAuth.deleteUser(client_id).catch(() => {})
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
    await adminAuth.deleteUser(client_id).catch(() => {})
    return NextResponse.json({ error: layerError.message }, { status: 500 })
  }

  // Generate a password-reset link the admin can share with the client to let them set their password.
  const inviteLink = await adminAuth.generatePasswordResetLink(client_email).catch(() => null)
  return NextResponse.json({ ...chart, inviteLink })
}
