import { query } from '@/lib/db/client'
import { res } from '@/lib/errors'

export async function POST(request: Request) {
  let username: string | undefined
  try {
    const body = await request.json()
    username = body?.username
  } catch {
    return res.badRequest('invalid request body')
  }

  if (!username || typeof username !== 'string' || !username.trim()) {
    return res.badRequest('username required')
  }

  let rows: { email: string | null; status: string }[]
  try {
    const result = await query<{ email: string | null; status: string }>(
      "SELECT email, status FROM profiles WHERE lower(username)=lower($1) AND status='active' LIMIT 1",
      [username.trim()]
    )
    rows = result.rows
  } catch {
    return res.dbError()
  }

  const data = rows[0] ?? null

  if (!data || !data.email) {
    return res.notFound()
  }

  return Response.json({ email: data.email })
}
