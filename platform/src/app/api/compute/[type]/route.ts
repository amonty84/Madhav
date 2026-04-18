import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const SIDECAR_URL = process.env.PYTHON_SIDECAR_URL ?? 'http://localhost:8000'
const SIDECAR_KEY = process.env.PYTHON_SIDECAR_API_KEY ?? ''

export async function POST(
  request: Request,
  { params }: { params: Promise<{ type: string }> }
) {
  const sb = await createClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { type } = await params
  const ALLOWED = [
    'ephemeris',
    'event_chart_states',
    'eclipses',
    'retrogrades',
    'sade_sati',
    'jaimini_drishti',
    'v7_additions',
  ]
  if (!ALLOWED.includes(type)) {
    return NextResponse.json({ error: 'Unknown compute type' }, { status: 400 })
  }

  const body = await request.json()

  const response = await fetch(`${SIDECAR_URL}/${type}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': SIDECAR_KEY,
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const text = await response.text()
    return NextResponse.json({ error: text || 'Compute error' }, { status: response.status })
  }

  const data = await response.json()
  return NextResponse.json(data)
}
