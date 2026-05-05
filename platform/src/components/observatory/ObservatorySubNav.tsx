'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const MAIN_LINKS = [
  { href: '/observatory', label: 'Overview', exact: true },
  { href: '/observatory/events', label: 'Events', exact: false },
  { href: '/observatory/budgets', label: 'Budgets', exact: false },
  { href: '/observatory/reconciliation', label: 'Reconcile', exact: false },
] as const

export function ObservatorySubNav() {
  const pathname = usePathname()

  function isActive(href: string, exact: boolean) {
    return exact ? pathname === href : pathname.startsWith(href)
  }

  return (
    <nav
      aria-label="Observatory navigation"
      className="hidden w-44 shrink-0 flex-col border-r border-[rgba(212,175,55,0.12)] bg-[var(--brand-charcoal,oklch(0.10_0.012_70))] py-3 md:flex"
    >
      {/* Back to Roster */}
      <Link
        href="/dashboard"
        className="mb-3 flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium text-[rgba(212,175,55,0.40)] transition-colors hover:text-[#d4af37]"
        aria-label="Back to Roster"
      >
        <span aria-hidden="true" className="text-[10px]">←</span>
        Roster
      </Link>

      <div className="mx-3 mb-3 h-px bg-[rgba(212,175,55,0.08)]" />

      <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-[rgba(212,175,55,0.30)]">
        Observatory
      </p>
      <div className="flex flex-col gap-0.5 px-2">
        {MAIN_LINKS.map(({ href, label, exact }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'rounded px-2 py-1.5 text-xs font-medium transition-colors',
              isActive(href, exact)
                ? 'bg-[rgba(212,175,55,0.12)] border border-[rgba(212,175,55,0.22)] text-[#d4af37]'
                : 'text-[rgba(212,175,55,0.40)] hover:bg-[rgba(212,175,55,0.07)] hover:text-[#d4af37]',
            )}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
