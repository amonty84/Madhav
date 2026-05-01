'use client'

import { useEffect, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import type { Report } from '@/lib/db/types'
import { cn } from '@/lib/utils'
import { Mandala } from '@/components/brand/Mandala'
import { humanizeDomain } from '@/lib/text/humanize'

function getTimeOfDay(hour: number): string {
  if (hour < 5) return 'Good evening'
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

function firstName(full: string): string {
  return full.trim().split(/\s+/)[0] ?? full
}

function suggestionsFor(reports: Report[]): { domain: string; prompt: string }[] {
  if (reports.length === 0) {
    return [
      { domain: 'Career', prompt: 'What does my chart say about my career path?' },
      { domain: 'Finance', prompt: 'Give me a financial outlook based on my chart.' },
      { domain: 'Health', prompt: 'What health themes show up in my chart?' },
      { domain: 'Timing', prompt: 'What are the key timing windows coming up?' },
    ]
  }
  const ordered = [...reports].sort((a, b) => a.domain.localeCompare(b.domain))
  return ordered.slice(0, 4).map(r => {
    const display = humanizeDomain(r.domain)
    const cleaned = r.domain.replace(/_/g, ' ')
    return {
      domain: display,
      prompt: `Summarize the key insights from my ${cleaned} report.`,
    }
  })
}

interface Props {
  chartName: string
  reports: Report[]
  onSuggest: (prompt: string) => void
}

export function WelcomeGreeting({ chartName, reports, onSuggest }: Props) {
  const [greeting, setGreeting] = useState('Good evening')
  const reduce = useReducedMotion()
  const suggestions = suggestionsFor(reports)

  useEffect(() => {
    // Hydration-safe: server time-of-day may differ from client locale.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGreeting(getTimeOfDay(new Date().getHours()))
  }, [])

  return (
    <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center justify-center px-6 py-12 text-center md:py-20">
      {/* Mandala watermark — soft brand presence behind the greeting. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <Mandala size={280} opacity={0.12} />
      </div>
      <motion.h2
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="bt-devanagari-rule relative font-heading text-3xl font-normal tracking-tight text-foreground sm:text-4xl md:text-[44px]"
        style={{ fontFamily: 'var(--font-serif, inherit)' }}
      >
        {greeting},{' '}
        <span className="italic text-foreground/70">{firstName(chartName)}</span>
      </motion.h2>
      <motion.p
        initial={reduce ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.06, ease: 'easeOut' }}
        className="relative mt-3 max-w-xl text-sm text-muted-foreground"
      >
        Ask about the chart—career, finance, timing, relationships, or any sign you want unpacked.
      </motion.p>
      <div className="relative mt-10 grid w-full grid-cols-1 gap-2 sm:grid-cols-2 md:gap-3" aria-label="Suggested questions">
        {suggestions.map((s, i) => (
          <motion.button
            key={s.domain}
            type="button"
            onClick={() => onSuggest(s.prompt)}
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduce ? { duration: 0 } : { duration: 0.32, delay: 0.1 + i * 0.04, ease: 'easeOut' }}
            className={cn(
              'group relative rounded-xl border px-5 py-4 text-left transition-all duration-200',
              'border-[var(--brand-gold-hairline)] bg-[var(--brand-charcoal)]/40 backdrop-blur-sm',
              'hover:border-[var(--brand-gold)] hover:bg-[var(--brand-charcoal)]/60',
              'hover:shadow-[0_0_30px_-8px_var(--brand-gold-glow)]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-gold)]'
            )}
          >
            <span className="font-serif text-[10px] uppercase tracking-[0.32em] text-[var(--brand-gold)]/80">
              {s.domain}
            </span>
            <p className="mt-1.5 text-sm text-foreground">{s.prompt}</p>
            <ArrowUpRight className="absolute right-3 top-3 size-3.5 text-[var(--brand-gold)] opacity-0 transition-opacity group-hover:opacity-100" />
          </motion.button>
        ))}
      </div>

      {/* Citation glyph legend — orients the user to the three chip types before they start querying. */}
      <p className="relative mt-8 flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.32em] text-[var(--brand-cream)]/40">
        <span><span className="text-[var(--cite-signal)]">≋</span> signal</span>
        <span><span className="text-[var(--cite-asset)]">⊞</span> asset</span>
        <span><span className="text-[var(--cite-chunk)]">§</span> chunk</span>
      </p>
    </div>
  )
}
