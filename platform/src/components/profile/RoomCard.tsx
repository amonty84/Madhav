import Link from 'next/link'
import { cn } from '@/lib/utils'

interface RoomCardCTA {
  label: string
  href: string
  disabled?: boolean
  tooltip?: string
}

interface RoomCardProps {
  title: string
  description?: string
  cta: RoomCardCTA
  children?: React.ReactNode
  className?: string
}

export function RoomCard({ title, description, cta, children, className }: RoomCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 rounded-lg border p-5',
        'border-[color-mix(in_oklch,var(--brand-gold)_20%,transparent)]',
        'bg-[color-mix(in_oklch,var(--brand-charcoal,_#0d0a05)_94%,var(--brand-gold)_6%)]',
        className,
      )}
    >
      <div className="flex flex-col gap-1">
        <h2
          className="text-base font-semibold"
          style={{ color: 'var(--brand-gold-cream, #fce29a)' }}
        >
          {title}
        </h2>
        {description && (
          <p className="text-xs" style={{ color: 'var(--brand-gold)', opacity: 0.6 }}>
            {description}
          </p>
        )}
      </div>

      {children && <div className="flex-1">{children}</div>}

      <div className="mt-auto">
        {cta.disabled ? (
          <span
            title={cta.tooltip}
            className="inline-flex cursor-not-allowed items-center gap-1 text-xs opacity-40"
            style={{ color: 'var(--brand-gold)' }}
          >
            {cta.label}
          </span>
        ) : (
          <Link
            href={cta.href}
            className="inline-flex items-center gap-1 text-sm font-medium transition-opacity hover:opacity-80"
            style={{ color: 'var(--brand-gold)' }}
          >
            {cta.label} →
          </Link>
        )}
      </div>
    </div>
  )
}
