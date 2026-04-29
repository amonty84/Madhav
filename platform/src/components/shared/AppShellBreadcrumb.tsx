import Link from 'next/link'

export type BreadcrumbSegment = {
  label: string
  href?: string
  current?: boolean
}

export function AppShellBreadcrumb({ segments }: { segments: BreadcrumbSegment[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex h-10 items-center gap-1.5 border-b border-border bg-background px-4 text-sm"
    >
      {segments.map((seg, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && (
            <span aria-hidden="true" className="text-muted-foreground select-none">
              ·
            </span>
          )}
          {seg.href && !seg.current ? (
            <Link
              href={seg.href}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {seg.label}
            </Link>
          ) : (
            <span
              className={seg.current ? 'font-medium text-foreground' : 'text-muted-foreground'}
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
