'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth'
import { auth } from '@/lib/firebase/client'
import { Logo } from '@/components/brand/Logo'
import { Wordmark } from '@/components/brand/Wordmark'
import { Mandala } from '@/components/brand/Mandala'
import { ForceDarkMode } from '@/components/auth/ForceDarkMode'

const INPUT_CLASS =
  'w-full rounded-[10px] border border-[#2a2210] bg-[#0e0b06] px-3.5 py-3 text-sm text-[#fce29a] placeholder:text-[#6a5830] focus:border-[#d4af37] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/20'
const BUTTON_CLASS =
  'w-full rounded-[10px] bg-gradient-to-b from-[#f4d160] to-[#a26d0e] px-3.5 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#1a1409] shadow-[0_0_0_1px_rgba(212,175,55,0.5),0_6px_20px_rgba(212,175,55,0.18)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60'
const LINK_CLASS =
  'border-b border-dotted border-[#5e4612] text-[#f4d160] hover:text-[#fce29a]'

type Phase =
  | { kind: 'verifying' }
  | { kind: 'invalid'; message: string }
  | { kind: 'ready'; email: string }
  | { kind: 'submitting'; email: string }
  | { kind: 'done' }

function ResetPasswordContent() {
  const params = useSearchParams()
  const oobCode = params.get('oobCode')
  const mode = params.get('mode')

  // Compute the initial phase from URL params synchronously — don't reset
  // state in an effect (cascading-render anti-pattern).
  const initialPhase: Phase =
    !oobCode || mode !== 'resetPassword'
      ? {
          kind: 'invalid',
          message: 'This link is invalid or has expired. Please request a new password-reset email.',
        }
      : { kind: 'verifying' }
  const [phase, setPhase] = useState<Phase>(initialPhase)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)

  // External-system sync: verify the oobCode with Firebase. Only fires when
  // the initial phase is 'verifying' (i.e. we have an oobCode worth checking).
  useEffect(() => {
    if (phase.kind !== 'verifying' || !oobCode) return
    verifyPasswordResetCode(auth, oobCode)
      .then((email) => setPhase({ kind: 'ready', email }))
      .catch(() => {
        setPhase({
          kind: 'invalid',
          message: 'This link is invalid or has expired. Please request a new password-reset email.',
        })
      })
    // We intentionally only re-verify when oobCode changes; phase.kind is
    // checked above to no-op once verification has settled.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oobCode])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    if (phase.kind !== 'ready') return
    setPhase({ kind: 'submitting', email: phase.email })
    try {
      await confirmPasswordReset(auth, oobCode!, password)
      setPhase({ kind: 'done' })
    } catch (err) {
      const code = (err as { code?: string })?.code
      const message =
        code === 'auth/weak-password'
          ? 'Password is too weak. Try a longer one.'
          : code === 'auth/expired-action-code' || code === 'auth/invalid-action-code'
            ? 'This link has expired. Please request a new password-reset email.'
            : 'Could not reset password. Please try again.'
      setError(message)
      setPhase({ kind: 'ready', email: phase.email })
    }
  }

  return (
    <>
      <ForceDarkMode />
      <div className="relative h-[100dvh] min-h-[640px] w-full overflow-hidden bg-[radial-gradient(ellipse_at_50%_50%,#0d0a05_0%,#020201_100%)] text-[#fce29a]">
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Mandala size={760} opacity={0.95} />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,transparent_35%,rgba(0,0,0,0.5)_80%,rgba(0,0,0,0.85)_100%)]" />

        <div className="absolute left-6 top-6 flex items-center gap-5 sm:left-14 sm:top-12">
          <Logo size="lg" priority />
          <div className="hidden sm:block">
            <Wordmark />
          </div>
        </div>

        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-4 sm:left-1/2 sm:right-auto sm:w-[380px] sm:-translate-x-1/2 sm:px-0">
          <div className="rounded-[18px] border border-[rgba(212,175,55,0.35)] bg-[rgba(8,6,3,0.86)] p-[34px] shadow-[0_30px_80px_rgba(0,0,0,0.6),inset_0_0_0_1px_rgba(212,175,55,0.06)] backdrop-blur-md">
            {phase.kind === 'verifying' && (
              <>
                <h1 className="font-serif text-[24px] font-medium tracking-wide text-[#fce29a]">
                  Verifying link…
                </h1>
                <p className="mt-2 text-[13px] text-[#d4af37] opacity-75">
                  One moment.
                </p>
              </>
            )}

            {phase.kind === 'invalid' && (
              <>
                <h1 className="font-serif text-[24px] font-medium tracking-wide text-[#fce29a]">
                  Link expired
                </h1>
                <p className="mt-2 text-[13px] text-[#d4af37] opacity-80">{phase.message}</p>
                <p className="mt-5 text-[13px]">
                  <Link href="/login" className={LINK_CLASS}>
                    Back to sign in
                  </Link>
                </p>
              </>
            )}

            {(phase.kind === 'ready' || phase.kind === 'submitting') && (
              <form onSubmit={handleSubmit}>
                <h1 className="font-serif text-[24px] font-medium tracking-wide text-[#fce29a]">
                  Set a new password
                </h1>
                <p className="mb-5 mt-1 text-[13px] text-[#d4af37] opacity-75">
                  Resetting password for {phase.email}.
                </p>
                <input
                  required
                  autoFocus
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="New password (min 8 characters)"
                  className={INPUT_CLASS + ' mb-2.5'}
                />
                <input
                  required
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Confirm password"
                  className={INPUT_CLASS + ' mb-3'}
                />
                {error && (
                  <p className="mb-3 text-[12px] text-red-400">{error}</p>
                )}
                <button
                  type="submit"
                  disabled={phase.kind === 'submitting'}
                  className={BUTTON_CLASS}
                >
                  {phase.kind === 'submitting' ? 'Resetting…' : 'Reset password'}
                </button>
              </form>
            )}

            {phase.kind === 'done' && (
              <>
                <h1 className="font-serif text-[24px] font-medium tracking-wide text-[#fce29a]">
                  Password updated
                </h1>
                <p className="mt-2 text-[13px] text-[#d4af37] opacity-80">
                  You can now sign in with your new password.
                </p>
                <p className="mt-5 text-[13px]">
                  <Link href="/login" className={LINK_CLASS}>
                    Back to sign in
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

// useSearchParams must be inside Suspense per Next.js 16 conventions.
export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="grid h-[100dvh] place-items-center bg-black text-[#d4af37]">
          Loading…
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  )
}
