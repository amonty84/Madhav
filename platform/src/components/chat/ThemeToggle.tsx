'use client'

import { useEffect, useState } from 'react'
import { Sun, Moon, Monitor } from 'lucide-react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

const OPTIONS = [
  { value: 'light', label: 'Light', Icon: Sun },
  { value: 'dark',  label: 'Dark',  Icon: Moon },
  { value: 'system', label: 'Auto', Icon: Monitor },
] as const

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  const current = mounted ? (theme ?? 'system') : 'system'

  return (
    <div
      role="group"
      aria-label="Color theme"
      className="inline-flex rounded-full border border-border/60 bg-muted/30 p-0.5"
    >
      {OPTIONS.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          onClick={() => setTheme(value)}
          aria-pressed={current === value}
          title={label}
          className={cn(
            'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] transition-colors',
            current === value
              ? 'bg-[var(--brand-gold)] font-medium text-[var(--brand-charcoal)]'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Icon className="size-3" />
          <span>{label}</span>
        </button>
      ))}
    </div>
  )
}
