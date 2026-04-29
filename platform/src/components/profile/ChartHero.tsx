import { ZoneRoot } from '@/components/shared/ZoneRoot'
import { Mandala } from '@/components/brand/Mandala'
import { RasiChartSVG } from '@/components/charts/RasiChartSVG'
import type { ForensicChart } from '@/lib/forensic/snapshot'

interface ChartHeroProps {
  chart: ForensicChart
  nativeName: string
  birthDate: string
  birthTime: string
  birthPlace: string
}

export function ChartHero({
  chart,
  nativeName,
  birthDate,
  birthTime,
  birthPlace,
}: ChartHeroProps) {
  return (
    <ZoneRoot zone="ink" className="relative w-full overflow-hidden" style={{ minHeight: 480 }}>
      {/* Mandala backdrop at 6% opacity */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        aria-hidden="true"
      >
        <Mandala size={760} opacity={0.06} className="shrink-0" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-6 py-10 md:flex-row md:items-start md:gap-10 md:px-12">
        {/* Rasi chart SVG */}
        <div className="shrink-0">
          <RasiChartSVG chart={chart} size={360} />
        </div>

        {/* Name + meta */}
        <div className="flex flex-col justify-center gap-3 pt-0 md:pt-8">
          <h1
            className="font-heading text-4xl font-semibold leading-tight tracking-wide"
            style={{
              fontFamily: "var(--font-serif, 'Source Serif 4', Georgia, serif)",
              color: 'var(--brand-gold-cream)',
              fontSize: 'clamp(2rem, 4vw, 2.75rem)',
            }}
          >
            {nativeName}
          </h1>
          <p
            className="text-sm tracking-wider"
            style={{ color: 'var(--brand-gold)', opacity: 0.7 }}
          >
            {birthDate}&ensp;·&ensp;{birthTime} IST&ensp;·&ensp;{birthPlace}
          </p>
          {!chart.isEmpty && (
            <p
              className="mt-1 text-xs tracking-widest uppercase"
              style={{ color: 'var(--brand-gold)', opacity: 0.5 }}
            >
              Lagna&ensp;{chart.lagnaSign}&ensp;{chart.lagnaDegreeDms}
            </p>
          )}
        </div>
      </div>
    </ZoneRoot>
  )
}
