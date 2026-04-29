import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { Mandala } from '@/components/brand/Mandala'

export function RosterEmptyWizard() {
  return (
    <div className="relative flex min-h-[420px] items-center justify-center overflow-hidden rounded-xl">
      {/* Mandala backdrop */}
      <Mandala
        size={480}
        opacity={0.18}
        className="pointer-events-none absolute inset-0 m-auto"
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 text-center">
        <h2 className="bt-heading text-xl text-foreground">
          Welcome. Begin with your first chart.
        </h2>
        <p className="text-sm text-muted-foreground max-w-xs">
          Each chart is a native's complete Jyotish record — facts, build corpus, and conversation history.
        </p>
        <Link href="/clients/new" className={buttonVariants({ size: 'lg' })}>
          + Add first chart
        </Link>
      </div>
    </div>
  )
}
