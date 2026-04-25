import 'server-only'
import { cookies } from 'next/headers'
import type { Auth } from 'firebase-admin/auth'

// Lazily initialise the Admin SDK so that build-time page-data collection
// (which imports this module) doesn't fail when credentials aren't set.
let _auth: Auth | null = null

function getAdminAuth(): Auth {
  if (_auth) return _auth
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { initializeApp, getApps, cert } = require('firebase-admin/app')
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { getAuth } = require('firebase-admin/auth')

  let serviceAccount: object = {}
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS ?? '{}')
  } catch {
    // credentials not yet configured; auth calls will fail at runtime
  }

  const app =
    getApps().length > 0
      ? getApps()[0]
      : initializeApp({ credential: cert(serviceAccount) })

  _auth = getAuth(app)
  return _auth!
}

export const adminAuth = new Proxy({} as Auth, {
  get(_target, prop) {
    return (getAdminAuth() as unknown as Record<string, unknown>)[prop as string]
  },
})

export async function verifySessionCookie(cookie: string) {
  return getAdminAuth().verifySessionCookie(cookie, true)
}

export async function createSessionCookie(idToken: string, expiresIn: number) {
  return getAdminAuth().createSessionCookie(idToken, { expiresIn })
}

export async function getServerUser() {
  const cookieStore = await cookies()
  const session = cookieStore.get('__session')?.value
  if (!session) return null
  try {
    return await verifySessionCookie(session)
  } catch {
    return null
  }
}
