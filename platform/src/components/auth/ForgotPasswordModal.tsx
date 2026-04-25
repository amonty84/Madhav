'use client'

import { useState } from 'react'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '@/lib/firebase/client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const INPUT_CLASS =
  'w-full rounded-[10px] border border-[#2a2210] bg-[#0e0b06] px-3.5 py-3 text-sm text-[#fce29a] placeholder:text-[#6a5830] focus:border-[#d4af37] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/20'
const BUTTON_CLASS =
  'w-full rounded-[10px] bg-gradient-to-b from-[#f4d160] to-[#a26d0e] px-3.5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#1a1409] shadow-[0_0_0_1px_rgba(212,175,55,0.5),0_6px_20px_rgba(212,175,55,0.18)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50'

// Generic success message (shown regardless of whether the email is registered)
// to avoid leaking account existence.
const GENERIC_SUCCESS =
  'If that email is registered, a reset link is on its way. Check your inbox.'

export function ForgotPasswordModal({
  open,
  onOpenChange,
  initialEmail = '',
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialEmail?: string
}) {
  const [email, setEmail] = useState(initialEmail)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  function reset() {
    setEmail(initialEmail)
    setSubmitting(false)
    setDone(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await sendPasswordResetEmail(auth, email.trim())
    } catch {
      // Swallow — we want the same success state regardless of outcome.
    }
    setSubmitting(false)
    setDone(true)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next)
        if (!next) setTimeout(reset, 200)
      }}
    >
      <DialogContent className="border-[rgba(212,175,55,0.35)] bg-[rgba(8,6,3,0.96)] text-[#fce29a] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl font-medium tracking-wide text-[#fce29a]">
            {done ? 'Check your email' : 'Reset your password'}
          </DialogTitle>
          <DialogDescription className="text-sm text-[#9b834f]">
            {done
              ? GENERIC_SUCCESS
              : 'Enter the email associated with your account — even if you sign in by username.'}
          </DialogDescription>
        </DialogHeader>

        {done ? null : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              required
              autoFocus
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className={INPUT_CLASS}
            />
            <button type="submit" disabled={submitting} className={BUTTON_CLASS}>
              {submitting ? 'Sending…' : 'Send reset link'}
            </button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
