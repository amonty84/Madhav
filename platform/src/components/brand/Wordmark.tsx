import { cn } from '@/lib/utils'

export function Wordmark({
  tagline = 'JYOTISH INTELLIGENCE SYSTEM',
  className,
}: {
  tagline?: string | null
  className?: string
}) {
  return (
    <div
      className={cn(
        'font-serif font-medium text-[28px] leading-none tracking-[0.14em] text-[#fce29a]',
        className,
      )}
    >
      MARSYS-JIS
      {tagline ? (
        <span className="mt-2.5 block font-sans text-[10px] font-medium tracking-[0.32em] text-[#d4af37] opacity-85">
          {tagline}
        </span>
      ) : null}
    </div>
  )
}
