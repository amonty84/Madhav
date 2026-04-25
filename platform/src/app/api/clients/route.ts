import { getServerUser, adminAuth } from '@/lib/firebase/server'
import { query } from '@/lib/db/client'
import { NextResponse } from 'next/server'

async function requireSuperAdmin() {
  const user = await getServerUser()
  if (!user) return null
  const { rows } = await query<{ role: string }>('SELECT role FROM profiles WHERE id=$1', [user.uid])
  if (rows[0]?.role !== 'super_admin') return null
  return user
}

export async function GET() {
  const user = await requireSuperAdmin()
  if (!user) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  try {
    const { rows } = await query(
      'SELECT charts.*, profiles.name AS client_name FROM charts LEFT JOIN profiles ON charts.client_id=profiles.id ORDER BY charts.created_at DESC'
    )
    return NextResponse.json(rows)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Query failed.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const user = await requireSuperAdmin()
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

  let chart: Record<string, unknown>
  try {
    const { rows } = await query(
      'INSERT INTO charts (client_id, name, birth_date, birth_time, birth_place, birth_lat, birth_lng) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
      [
        client_id,
        name,
        birth_date,
        birth_time,
        birth_place,
        birth_lat ? parseFloat(birth_lat) : null,
        birth_lng ? parseFloat(birth_lng) : null,
      ]
    )
    chart = rows[0]
  } catch (err) {
    await adminAuth.deleteUser(client_id).catch(() => {})
    const message = err instanceof Error ? err.message : 'Chart insert failed.'
    return NextResponse.json({ error: message }, { status: 500 })
  }

  const layers = [
    { layer: 'L1', sublayer: 'facts' },
    { layer: 'L2', sublayer: 'analysis_mode_a' },
    { layer: 'L2', sublayer: 'analysis_mode_b' },
    { layer: 'L2.5', sublayer: 'synthesis' },
    { layer: 'L3', sublayer: 'domain_reports' },
    { layer: 'L4', sublayer: 'query_interface' },
  ]

  try {
    for (const l of layers) {
      await query(
        'INSERT INTO pyramid_layers (chart_id, layer, sublayer, status) VALUES ($1,$2,$3,\'not_started\') ON CONFLICT DO NOTHING',
        [chart.id, l.layer, l.sublayer]
      )
    }
  } catch (err) {
    await query('DELETE FROM charts WHERE id=$1', [chart.id]).catch(() => {})
    await adminAuth.deleteUser(client_id).catch(() => {})
    const message = err instanceof Error ? err.message : 'Layer insert failed.'
    return NextResponse.json({ error: message }, { status: 500 })
  }

  // Generate a password-reset link the admin can share with the client to let them set their password.
  const inviteLink = await adminAuth.generatePasswordResetLink(client_email).catch(() => null)
  return NextResponse.json({ ...chart, inviteLink })
}
