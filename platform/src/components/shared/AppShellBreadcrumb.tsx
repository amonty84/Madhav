import type { ReactNode } from 'react'
import Link from 'next/link'

export type BreadcrumbSegment = {
  label: string
  href?: string
  current?: boolean
}

export function AppShellBreadcrumb({
  segments,
  mobileNav,
}: {
  segments: BreadcrumbSegment[]
  mobileNav?: ReactNode
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex h-10 items-center gap-1.5 border-b border-[rgba(212,175,55,0.12)] bg-[rgba(8,5,2,0.5)] px-4 text-sm"
    >
      {/* Mobile-only hamburger trigger rendered before breadcrumb items */}
      {mobileNav}
      {segments.map((seg, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && (
            <span aria-hidden="true" className="text-[rgba(212,175,55,0.2)] select-none">
              ·
            </span>
          )}
          {seg.href && !seg.current ? (
            <Link
              href={seg.href}
              className="text-[rgba(212,175,55,0.45)] hover:text-[#fce29a] transition-colors"
            >
              {seg.label}
            </Link>
          ) : (
            <span
              className={seg.current ? 'font-medium text-[#fce29a]' : 'text-[rgba(212,175,55,0.45)]'}
              aria-current={seg.current ? 'page' : undefined}
            >
              {seg.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  )
}
