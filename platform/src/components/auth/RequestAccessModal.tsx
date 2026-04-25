'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

const FORM_CLASSES = {
  input:
    'w-full rounded-[10px] border border-[#2a2210] bg-[#0e0b06] px-3.5 py-3 text-sm text-[#fce29a] placeholder:text-[#6a5830] focus:border-[#d4af37] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/20',
  button:
    'w-full rounded-[10px] bg-gradient-to-b from-[#f4d160] to-[#a26d0e] px-3.5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#1a1409] shadow-[0_0_0_1px_rgba(212,175,55,0.5),0_6px_20px_rgba(212,175,55,0.18)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50',
}

export function RequestAccessModal({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [reason, setReason] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  function reset() {
    setFullName('')
    setEmail('')
    setReason('')
    setSubmitting(false)
    setSubmitted(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch('/api/access-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: fullName, email, reason: reason || undefined }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) {
        toast.error(body?.error ?? 'Could not submit request.')
        setSubmitting(false)
        return
      }
      setSubmitted(true)
    } catch {
      toast.error('Network error. Please try again.')
      setSubmitting(false)
    }
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
            {submitted ? 'Request received' : 'Request access'}
          </DialogTitle>
          <DialogDescription className="text-sm text-[#9b834f]">
            {submitted
              ? "You'll receive an email when the administrator approves your request."
              : "Submit your details. The administrator will review and respond by email."}
          </DialogDescription>
        </DialogHeader>

        {submitted ? null : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              required
              autoFocus
              type="text"
              maxLength={100}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full name"
              className={FORM_CLASSES.input}
            />
            <input
              required
              type="email"
              autoComplete="email"
              maxLength={254}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className={FORM_CLASSES.input}
            />
            <textarea
              maxLength={500}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason for access (optional)"
              rows={3}
              className={FORM_CLASSES.input + ' resize-none'}
            />
            <button type="submit" disabled={submitting} className={FORM_CLASSES.button}>
              {submitting ? 'Submitting…' : 'Submit request'}
            </button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
