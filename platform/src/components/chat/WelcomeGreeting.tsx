'use client'

import { useEffect, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import type { Report } from '@/lib/supabase/types'
import { cn } from '@/lib/utils'

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
  return ordered.slice(0, 4).map(r => ({
    domain: r.domain.charAt(0).toUpperCase() + r.domain.slice(1),
    prompt: `Summarize the key insights from my ${r.domain} report.`,
  }))
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
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center px-6 py-12 text-center md:py-20">
      <motion.h1
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="font-heading text-3xl font-normal tracking-tight text-foreground sm:text-4xl md:text-[44px]"
        style={{ fontFamily: 'var(--font-serif, inherit)' }}
      >
        {greeting},{' '}
        <span className="italic text-foreground/70">{firstName(chartName)}</span>
      </motion.h1>
      <motion.p
        initial={reduce ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.06, ease: 'easeOut' }}
        className="mt-3 max-w-xl text-sm text-muted-foreground"
      >
        Ask about the chart—career, finance, timing, relationships, or any sign you want unpacked.
      </motion.p>
      <div className="mt-10 grid w-full grid-cols-1 gap-2 sm:grid-cols-2 md:gap-3">
        {suggestions.map((s, i) => (
          <motion.button
            key={s.domain}
            type="button"
            onClick={() => onSuggest(s.prompt)}
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 + i * 0.04, ease: 'easeOut' }}
            className={cn(
              'group relative overflow-hidden rounded-xl border border-border bg-background p-4 text-left transition-all',
              'hover:border-border hover:bg-muted/40 hover:shadow-sm',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40'
            )}
          >
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{s.domain}</p>
            <p className="mt-1.5 text-sm text-foreground">{s.prompt}</p>
            <ArrowUpRight className="absolute right-3 top-3 size-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </motion.button>
        ))}
      </div>
    </div>
  )
}
