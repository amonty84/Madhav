import { getServerUser } from '@/lib/firebase/server'
import { res } from '@/lib/errors'

const SIDECAR_KEY = process.env.PYTHON_SIDECAR_API_KEY ?? ''

export async function POST(
  request: Request,
  { params }: { params: Promise<{ type: string }> }
) {
  const user = await getServerUser()
  if (!user) return res.unauthenticated()

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
    return res.badRequest('Unknown compute type')
  }

  const sidecarUrl = process.env.PYTHON_SIDECAR_URL
  if (!sidecarUrl) {
    return res.sidecarDown()
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return res.badRequest('invalid request body')
  }

  let response: Response
  try {
    response = await fetch(`${sidecarUrl}/${type}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': SIDECAR_KEY,
      },
      body: JSON.stringify(body),
    })
  } catch {
    return res.sidecarDown()
  }

  if (!response.ok) {
    if (response.status >= 500) {
      return res.sidecarDown()
    }
    return res.internal('Compute error')
  }

  const data = await response.json()
  return Response.json(data)
}
