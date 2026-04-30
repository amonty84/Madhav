'use client'

import { useRouter } from 'next/navigation'
import { signOut as firebaseSignOut } from 'firebase/auth'
import { auth } from '@/lib/firebase/client'

export function AdminSignOut() {
  const router = useRouter()
  async function handleSignOut() {
    await fetch('/api/auth/session', { method: 'DELETE' }).catch(() => {})
    await firebaseSignOut(auth).catch(() => {})
    router.push('/login')
    router.refresh()
  }
  return (
    <button
      onClick={handleSignOut}
      className="text-[12px] uppercase tracking-[0.18em] text-brand-gold transition-colors hover:text-brand-gold-cream"
    >
      Sign out
    </button>
  )
}
