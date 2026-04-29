'use client'

interface Props {
  title: string
  error: Error
  reset: () => void
}

export function SharedConsumeError({ title, error, reset }: Props) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="rounded-[14px] border border-[var(--brand-gold-hairline)] bg-[var(--brand-charcoal)]/80 px-8 py-6 backdrop-blur-md shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)] max-w-sm w-full">
        <p className="font-serif text-[10px] uppercase tracking-[0.32em] text-[var(--brand-gold)]/80 mb-3">
          System Error
        </p>
        <h1 className="font-serif text-xl text-[var(--brand-cream)] mb-2">{title}</h1>
        <p className="text-sm text-[var(--brand-cream)]/60 mb-5">
          {error.message || 'An unexpected error occurred.'}
        </p>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1.5 rounded-md px-4 py-2 brand-cta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-gold)]"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
