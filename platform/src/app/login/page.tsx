'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase/client'
import { toast } from 'sonner'
import { Logo } from '@/components/brand/Logo'
import { Wordmark } from '@/components/brand/Wordmark'
import { Mandala } from '@/components/brand/Mandala'
import { ZoneRoot } from '@/components/shared/ZoneRoot'
import { RequestAccessModal } from '@/components/auth/RequestAccessModal'
import { ForgotPasswordModal } from '@/components/auth/ForgotPasswordModal'

type Tab = 'username' | 'email'

export default function LoginPage() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('username')
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [forgotOpen, setForgotOpen] = useState(false)
  const [requestOpen, setRequestOpen] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      // Resolve username → email if necessary.
      let email: string
      if (tab === 'email') {
        email = identifier.trim()
      } else {
        const res = await fetch('/api/auth/resolve-username', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: identifier.trim() }),
        })
        if (!res.ok) {
          // Match the generic error: don't disclose username existence.
          toast.error('Invalid username or password.')
          setSubmitting(false)
          return
        }
        const body = (await res.json()) as { email?: string }
        if (!body.email) {
          toast.error('Invalid username or password.')
          setSubmitting(false)
          return
        }
        email = body.email
      }

      // Sign in with Firebase to obtain an ID token.
      const credential = await signInWithEmailAndPassword(auth, email, password)
      const idToken = await credential.user.getIdToken()

      // Exchange the ID token for a session cookie. The session route also
      // checks the profile's status and refuses inactive accounts.
      const sessionRes = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      })
      if (!sessionRes.ok) {
        const body = await sessionRes.json().catch(() => ({}))
        if (body?.error === 'account_inactive') {
          toast.error('Your account is not active. Please contact the administrator.')
        } else {
          toast.error('Sign-in failed. Please try again.')
        }
        // Sign out from Firebase since the server refused the session.
        await auth.signOut().catch(() => {})
        setSubmitting(false)
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      // Firebase Auth errors land here (wrong password, user-not-found, etc.).
      // Always show the same generic message — don't leak which factor was wrong.
      const code = (err as { code?: string })?.code
      const message =
        code === 'auth/too-many-requests'
          ? 'Too many failed attempts. Try again later.'
          : 'Invalid username or password.'
      toast.error(message)
      setSubmitting(false)
    }
  }

  return (
    <ZoneRoot zone="ink">
      <div className="relative h-[100dvh] min-h-[640px] w-full overflow-hidden bg-[radial-gradient(ellipse_at_50%_50%,#0d0a05_0%,#020201_100%)] text-[#fce29a]">
        {/* Mandala — centered behind everything, with emanating vibration rings */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {/* Gossamer circle rings */}
          <div className="absolute left-1/2 top-1/2 h-[760px] w-[760px] rounded-full border border-[rgba(212,175,55,0.22)]" style={{ animation: 'mandala-ring-expand 16s ease-out infinite', animationDelay: '0s' }} />
          <div className="absolute left-1/2 top-1/2 h-[760px] w-[760px] rounded-full border border-[rgba(212,175,55,0.18)]" style={{ animation: 'mandala-ring-expand 16s ease-out infinite', animationDelay: '-4s' }} />
          <div className="absolute left-1/2 top-1/2 h-[760px] w-[760px] rounded-full border border-[rgba(212,175,55,0.14)]" style={{ animation: 'mandala-ring-expand 16s ease-out infinite', animationDelay: '-8s' }} />
          <div className="absolute left-1/2 top-1/2 h-[760px] w-[760px] rounded-full border border-[rgba(212,175,55,0.1)]"  style={{ animation: 'mandala-ring-expand 16s ease-out infinite', animationDelay: '-12s' }} />
          {/* Soft glow rings */}
          <div className="absolute left-1/2 top-1/2 h-[760px] w-[760px] rounded-full border border-[rgba(244,209,96,0.1)]"  style={{ animation: 'mandala-ring-glow 26s ease-out infinite', animationDelay: '0s' }} />
          <div className="absolute left-1/2 top-1/2 h-[760px] w-[760px] rounded-full border border-[rgba(244,209,96,0.07)]" style={{ animation: 'mandala-ring-glow 26s ease-out infinite', animationDelay: '-8.66s' }} />
          <div className="absolute left-1/2 top-1/2 h-[760px] w-[760px] rounded-full border border-[rgba(244,209,96,0.05)]" style={{ animation: 'mandala-ring-glow 26s ease-out infinite', animationDelay: '-17.33s' }} />
          {/* Diamond rings */}
          <div className="absolute left-1/2 top-1/2 h-[760px] w-[760px] border border-[rgba(212,175,55,0.12)]" style={{ animation: 'mandala-diamond-expand 20s ease-out infinite', animationDelay: '0s' }} />
          <div className="absolute left-1/2 top-1/2 h-[760px] w-[760px] border border-[rgba(212,175,55,0.08)]" style={{ animation: 'mandala-diamond-expand 20s ease-out infinite', animationDelay: '-10s' }} />
          <Mandala size={760} opacity={0.95} rotate />
        </div>

        {/* Vignette */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,transparent_35%,rgba(0,0,0,0.5)_80%,rgba(0,0,0,0.85)_100%)]" />

        {/* Brand mark + wordmark — upper left */}
        <div className="absolute left-6 top-6 flex items-center gap-5 sm:left-14 sm:top-12">
          <Logo size="lg" priority />
          <div className="hidden sm:block">
            <Wordmark />
          </div>
        </div>

        {/* Tiny ornament under wordmark (replaces the rule that used to cut the mandala) */}
        <div className="absolute left-[166px] top-[170px] hidden font-serif text-sm tracking-[0.4em] text-[#d4af37] opacity-55 sm:block">
          ·   ·   ·
        </div>

        {/* Form — bottom right */}
        <div className="absolute inset-x-0 bottom-0 px-4 pb-8 sm:inset-x-auto sm:right-14 sm:bottom-14 sm:w-[380px] sm:px-0 sm:pb-0">
          <form
            onSubmit={handleSubmit}
            className="rounded-[18px] border border-[rgba(212,175,55,0.35)] bg-[rgba(8,6,3,0.86)] p-[34px] shadow-[0_30px_80px_rgba(0,0,0,0.6),inset_0_0_0_1px_rgba(212,175,55,0.06)] backdrop-blur-md"
          >
            <h1 className="font-serif text-[24px] font-medium leading-tight tracking-wide text-[#fce29a]">
              Welcome back
            </h1>
            <p className="mb-5 mt-1 text-[13px] text-[#d4af37] opacity-75">
              The instrument is ready.
            </p>

            {/* Tab toggle — custom to match v4 brand */}
            <div className="mb-3.5 flex rounded-[10px] border border-[#2a2210] bg-[#0e0b06] p-[3px] text-[11px]">
              {(
                [
                  ['username', 'Username'],
                  ['email', 'Email'],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTab(key)}
                  className={
                    tab === key
                      ? 'flex-1 rounded-[7px] bg-gradient-to-b from-[#3a2c10] to-[#241a07] py-2 font-medium uppercase tracking-[0.06em] text-[#fce29a] shadow-[inset_0_0_0_1px_rgba(212,175,55,0.3)]'
                      : 'flex-1 rounded-[7px] py-2 font-medium uppercase tracking-[0.06em] text-[#7a6a3f] transition-colors hover:text-[#fce29a]'
                  }
                >
                  {label}
                </button>
              ))}
            </div>

            <input
              required
              autoFocus
              type={tab === 'email' ? 'email' : 'text'}
              autoComplete={tab === 'email' ? 'email' : 'username'}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={tab === 'email' ? 'Email' : 'Username'}
              className="mb-2.5 w-full rounded-[10px] border border-[#2a2210] bg-[#0e0b06] px-3.5 py-3 text-sm text-[#fce29a] placeholder:text-[#6a5830] focus:border-[#d4af37] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/20"
            />
            <input
              required
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="mb-2 w-full rounded-[10px] border border-[#2a2210] bg-[#0e0b06] px-3.5 py-3 text-sm text-[#fce29a] placeholder:text-[#6a5830] focus:border-[#d4af37] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/20"
            />
            <div className="mb-2 flex justify-end">
              <button
                type="button"
                onClick={() => setForgotOpen(true)}
                className="border-b border-dotted border-[#5e4612] text-[12px] text-[#f4d160] hover:text-[#fce29a]"
              >
                Forgot password?
              </button>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-[10px] bg-gradient-to-b from-[#f4d160] to-[#a26d0e] px-3.5 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#1a1409] shadow-[0_0_0_1px_rgba(212,175,55,0.5),0_6px_20px_rgba(212,175,55,0.18)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>

            <p className="mt-4 text-center text-[12px] text-[#d4af37]">
              No account?{' '}
              <button
                type="button"
                onClick={() => setRequestOpen(true)}
                className="border-b border-dotted border-[#5e4612] text-[#f4d160] hover:text-[#fce29a]"
              >
                Request access
              </button>
            </p>
          </form>
        </div>
      </div>

      <ForgotPasswordModal
        open={forgotOpen}
        onOpenChange={setForgotOpen}
        initialEmail={tab === 'email' ? identifier : ''}
      />
      <RequestAccessModal open={requestOpen} onOpenChange={setRequestOpen} />
    </ZoneRoot>
  )
}
