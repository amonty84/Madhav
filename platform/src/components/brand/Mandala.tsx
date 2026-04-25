import { cn } from '@/lib/utils'

// Angle arrays for the various ornament rings.
const TICKS_48 = Array.from({ length: 48 }, (_, i) => i * 7.5)
const FLEURETS_8 = Array.from({ length: 8 }, (_, i) => i * 45)
const BEADS_OUTER_48 = TICKS_48
const BEADS_MID_32 = Array.from({ length: 32 }, (_, i) => i * 11.25)
const BEADS_INNER_24 = Array.from({ length: 24 }, (_, i) => i * 15)
const PETALS_16 = Array.from({ length: 16 }, (_, i) => i * 22.5)
const PETALS_8 = Array.from({ length: 8 }, (_, i) => i * 45)

// Flower-of-life circle centres. Step = 14, hex spacing 12.124 / 7 (sin60° × r).
const FOL_RING1 = [
  [0, -14],
  [12.124, -7],
  [12.124, 7],
  [0, 14],
  [-12.124, 7],
  [-12.124, -7],
] as const
const FOL_RING2 = [
  [0, -28],
  [12.124, -21],
  [24.249, -14],
  [24.249, 0],
  [24.249, 14],
  [12.124, 21],
  [0, 28],
  [-12.124, 21],
  [-24.249, 14],
  [-24.249, 0],
  [-24.249, -14],
  [-12.124, -21],
] as const
const FOL_RING3 = [
  [0, -42],
  [12.124, -35],
  [24.249, -28],
  [36.373, -21],
  [36.373, -7],
  [36.373, 7],
  [36.373, 21],
  [24.249, 28],
  [12.124, 35],
  [0, 42],
  [-12.124, 35],
  [-24.249, 28],
  [-36.373, 21],
  [-36.373, 7],
  [-36.373, -7],
  [-36.373, -21],
  [-24.249, -28],
  [-12.124, -35],
] as const

export function Mandala({
  size = 760,
  className,
  opacity = 0.95,
}: {
  size?: number
  className?: string
  opacity?: number
}) {
  return (
    <svg
      viewBox="-220 -220 440 440"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      className={cn('block', className)}
      style={{ opacity }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient
          id="mandalaFade"
          cx="0"
          cy="0"
          r="200"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#d4af37" stopOpacity=".55" />
          <stop offset="55%" stopColor="#d4af37" stopOpacity=".35" />
          <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
        </radialGradient>
        <radialGradient
          id="bindu"
          cx="0"
          cy="0"
          r="6"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#f4d160" stopOpacity="1" />
          <stop offset="100%" stopColor="#d4af37" stopOpacity=".4" />
        </radialGradient>
        <symbol id="petal16" viewBox="-12 -50 24 50">
          <path
            d="M0 -50 C 8 -34, 8 -16, 0 0 C -8 -16, -8 -34, 0 -50 Z"
            fill="none"
            stroke="#d4af37"
            strokeWidth=".55"
          />
        </symbol>
        <symbol id="petal8" viewBox="-14 -42 28 42">
          <path
            d="M0 -42 C 11 -28, 11 -12, 0 0 C -11 -12, -11 -28, 0 -42 Z"
            fill="none"
            stroke="#d4af37"
            strokeWidth=".5"
          />
        </symbol>
        <symbol id="fleuret" viewBox="-6 -12 12 12">
          <path d="M0 -12 L4 -3 L-4 -3 Z" fill="none" stroke="#d4af37" strokeWidth=".55" />
          <circle cx="0" cy="-7" r=".9" fill="#f4d160" />
        </symbol>
        <symbol id="diamond" viewBox="-3 -4 6 8">
          <path d="M0 -4 L2.4 0 L0 4 L-2.4 0 Z" fill="#f4d160" stroke="#d4af37" strokeWidth=".3" />
        </symbol>
      </defs>

      {/* Outermost decorative rings */}
      <circle cx="0" cy="0" r="212" fill="none" stroke="#d4af37" strokeWidth=".25" opacity=".35" />
      <circle cx="0" cy="0" r="208" fill="none" stroke="#d4af37" strokeWidth=".4" opacity=".55" />
      <circle cx="0" cy="0" r="201" fill="none" stroke="#d4af37" strokeWidth=".4" opacity=".55" />

      {/* 48-bead outer course */}
      <g fill="#d4af37" opacity=".75">
        {BEADS_OUTER_48.map((a) => (
          <g key={a} transform={`rotate(${a})`}>
            <circle cx="0" cy="-204.5" r="1.5" />
          </g>
        ))}
      </g>

      {/* 8 cardinal & ordinal fleurets */}
      <g opacity=".75">
        {FLEURETS_8.map((a) => (
          <g key={a} transform={`rotate(${a})`}>
            <use href="#fleuret" x="-6" y="-220" width="12" height="12" />
          </g>
        ))}
      </g>

      {/* Original outer triple ring */}
      <circle cx="0" cy="0" r="195" fill="none" stroke="#d4af37" strokeWidth=".4" opacity=".55" />
      <circle cx="0" cy="0" r="188" fill="none" stroke="#d4af37" strokeWidth=".5" opacity=".75" />
      <circle cx="0" cy="0" r="184" fill="none" stroke="#d4af37" strokeWidth=".25" opacity=".4" />

      {/* 48 hairline radial ticks between r=188 and r=195 */}
      <g stroke="#d4af37" strokeWidth=".35" opacity=".45">
        {TICKS_48.map((a) => (
          <g key={a} transform={`rotate(${a})`}>
            <line x1="0" y1="-195" x2="0" y2="-188" />
          </g>
        ))}
      </g>

      {/* 16-petal outer lotus */}
      <g opacity=".75">
        {PETALS_16.map((a) => (
          <g key={a} transform={`rotate(${a})`}>
            <use href="#petal16" x="-12" y="-180" width="24" height="50" />
          </g>
        ))}
      </g>

      {/* Hairline veins down each 16-petal */}
      <g stroke="#d4af37" strokeWidth=".3" opacity=".5">
        {PETALS_16.map((a) => (
          <g key={a} transform={`rotate(${a})`}>
            <line x1="0" y1="-176" x2="0" y2="-134" />
          </g>
        ))}
      </g>

      {/* Diamond ornaments at each 16-petal tip */}
      <g opacity=".85">
        {PETALS_16.map((a) => (
          <g key={a} transform={`rotate(${a})`}>
            <use href="#diamond" x="-3" y="-178" width="6" height="8" />
          </g>
        ))}
      </g>

      {/* Inner ring boundary for petal anchors */}
      <circle cx="0" cy="0" r="130" fill="none" stroke="#d4af37" strokeWidth=".4" opacity=".6" />
      <circle cx="0" cy="0" r="125" fill="none" stroke="#d4af37" strokeWidth=".25" opacity=".35" />

      {/* Mid course between the lotuses */}
      <circle cx="0" cy="0" r="162" fill="none" stroke="#d4af37" strokeWidth=".25" opacity=".3" />
      <circle cx="0" cy="0" r="158" fill="none" stroke="#d4af37" strokeWidth=".25" opacity=".3" />
      <g fill="#d4af37" opacity=".55">
        {BEADS_MID_32.map((a) => (
          <g key={a} transform={`rotate(${a})`}>
            <circle cx="0" cy="-160" r="1.2" />
          </g>
        ))}
      </g>

      {/* 8-petal inner lotus */}
      <g opacity=".8">
        {PETALS_8.map((a) => (
          <g key={a} transform={`rotate(${a})`}>
            <use href="#petal8" x="-14" y="-125" width="28" height="42" />
          </g>
        ))}
      </g>
      <g stroke="#d4af37" strokeWidth=".3" opacity=".55">
        {PETALS_8.map((a) => (
          <g key={a} transform={`rotate(${a})`}>
            <line x1="0" y1="-122" x2="0" y2="-86" />
          </g>
        ))}
      </g>

      {/* Ring under flower-of-life + 24-bead course around it */}
      <circle cx="0" cy="0" r="84" fill="none" stroke="#d4af37" strokeWidth=".4" opacity=".7" />
      <circle cx="0" cy="0" r="80" fill="none" stroke="#d4af37" strokeWidth=".25" opacity=".4" />
      <g fill="#d4af37" opacity=".7">
        {BEADS_INNER_24.map((a) => (
          <g key={a} transform={`rotate(${a})`}>
            <circle cx="0" cy="-72" r=".95" />
          </g>
        ))}
      </g>

      {/* Flower of Life — center + 19 visible circles (centre + 6 ring1 + 12 ring2) */}
      <g fill="none" stroke="#d4af37" strokeWidth=".55" opacity=".82">
        <circle cx="0" cy="0" r="14" />
        {FOL_RING1.map(([x, y]) => (
          <circle key={`r1-${x}-${y}`} cx={x} cy={y} r="14" />
        ))}
        {FOL_RING2.map(([x, y]) => (
          <circle key={`r2-${x}-${y}`} cx={x} cy={y} r="14" />
        ))}
      </g>

      {/* Outer FoL ring (18 circles, softer to fade outwards) */}
      <g fill="none" stroke="#d4af37" strokeWidth=".4" opacity=".4">
        {FOL_RING3.map(([x, y]) => (
          <circle key={`r3-${x}-${y}`} cx={x} cy={y} r="14" />
        ))}
      </g>

      {/* Soft golden glow at the centre + bindu */}
      <circle cx="0" cy="0" r="48" fill="url(#mandalaFade)" opacity=".5" />
      <circle cx="0" cy="0" r="2.5" fill="url(#bindu)" />
    </svg>
  )
}
