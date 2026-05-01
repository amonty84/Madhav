import { cn } from '@/lib/utils'

// 27 nakshatra positions (lunar mansions, 13.33° apart)
const NAKSHATRAS = Array.from({ length: 27 }, (_, i) => i * (360 / 27))
// 12 rasi (zodiac) positions
const RASIS = Array.from({ length: 12 }, (_, i) => i * 30)
// 16 solar rays from Surya
const SUN_RAYS = Array.from({ length: 16 }, (_, i) => i * 22.5)

// Polar → Cartesian: 0° = top, clockwise
function P(r: number, deg: number): [number, number] {
  const a = (deg * Math.PI) / 180
  return [+(r * Math.sin(a)).toFixed(2), +(-(r * Math.cos(a))).toFixed(2)]
}

// Precomputed Navagraha positions
// Geocentric order outward: Chandra · Budha · Shukra · Mangal · Guru · Shani
// Rahu + Ketu (nodal axis) on the outermost orbit, always 180° apart
const CH = P(38, 62)    // Chandra  (Moon)
const BU = P(56, 148)   // Budha    (Mercury)
const SH = P(74, 248)   // Shukra   (Venus)
const MA = P(96, 38)    // Mangal   (Mars)
const GU = P(120, 290)  // Guru     (Jupiter)
const SA = P(148, 163)  // Shani    (Saturn)
const RA = P(176, 353)  // Rahu     (North Node)
const KE = P(176, 173)  // Ketu     (South Node)

export function Navagraha({
  size = 760,
  className,
  opacity = 0.95,
  rotate = false,
}: {
  size?: number
  className?: string
  opacity?: number
  rotate?: boolean
}) {
  return (
    <svg
      viewBox="-220 -220 440 440"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      className={cn('block', rotate && 'navagraha-spin', className)}
      style={{ opacity }}
      aria-hidden="true"
    >
      <defs>
        {/* Surya — large corona glow */}
        <radialGradient id="ngSunAura" cx="0" cy="0" r="35" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#fff5b0" stopOpacity=".8" />
          <stop offset="35%"  stopColor="#f4d160" stopOpacity=".45" />
          <stop offset="80%"  stopColor="#d4af37" stopOpacity=".12" />
          <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
        </radialGradient>
        {/* Surya body */}
        <radialGradient id="ngSunCore" cx="-2" cy="-2.5" r="7" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#fffbe8" stopOpacity="1" />
          <stop offset="50%"  stopColor="#f4d160" stopOpacity="1" />
          <stop offset="100%" stopColor="#c8960a" stopOpacity="1" />
        </radialGradient>
        {/* Guru glow */}
        <radialGradient id="ngGuruGlow" cx={GU[0]} cy={GU[1]} r="12" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#f4d160" stopOpacity=".55" />
          <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
        </radialGradient>
        {/* Outer ring fade */}
        <radialGradient id="ngOuterFade" cx="0" cy="0" r="218" gradientUnits="userSpaceOnUse">
          <stop offset="70%"  stopColor="#d4af37" stopOpacity=".65" />
          <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
        </radialGradient>
        {/* Crescent mask for Chandra */}
        <mask id="ngCrescent">
          <rect x="-7" y="-7" width="14" height="14" fill="white" />
          {/* Offset circle cuts away the shadow side */}
          <circle cx="2.4" cy="0" r="3.1" fill="black" />
        </mask>
      </defs>

      {/* ─── OUTER COSMIC BOUNDARY ─── */}
      <circle cx="0" cy="0" r="213" fill="none" stroke="url(#ngOuterFade)" strokeWidth=".4" />
      <circle cx="0" cy="0" r="208" fill="none" stroke="#d4af37" strokeWidth=".3" opacity=".35" />

      {/* 27 Nakshatra tick marks */}
      <g stroke="#d4af37">
        {NAKSHATRAS.map((a) => (
          <g key={a} transform={`rotate(${a})`}>
            <line x1="0" y1="-209" x2="0" y2="-203" strokeWidth=".35" opacity=".5" />
          </g>
        ))}
      </g>

      {/* 12 Rasi markers — taller tick + small diamond at tip */}
      <g>
        {RASIS.map((a) => (
          <g key={a} transform={`rotate(${a})`}>
            <line x1="0" y1="-209" x2="0" y2="-198" stroke="#d4af37" strokeWidth=".7" opacity=".7" />
            {/* Diamond ornament */}
            <path d="M0 -196 L1.6 -193 L0 -190 L-1.6 -193 Z"
              fill="#f4d160" opacity=".75" />
          </g>
        ))}
      </g>

      {/* Inner boundary of outer ring */}
      <circle cx="0" cy="0" r="188" fill="none" stroke="#d4af37" strokeWidth=".3" opacity=".35" />

      {/* ─── RAHU–KETU NODAL AXIS ─── */}
      {/* Dashed axis line through center */}
      <line
        x1={RA[0]} y1={RA[1]} x2={KE[0]} y2={KE[1]}
        stroke="#d4af37" strokeWidth=".25" opacity=".18"
        strokeDasharray="3 5"
      />
      {/* Nodal orbit — dashed, shadow-planet quality */}
      <circle cx="0" cy="0" r="176" fill="none" stroke="#d4af37"
        strokeWidth=".3" opacity=".28" strokeDasharray="2 5" />

      {/* Rahu — ascending node (☊ approximated) */}
      <g transform={`translate(${RA[0]}, ${RA[1]})`}>
        <circle cx="0" cy="0" r="7" fill="#d4af37" opacity=".08" />
        {/* Horseshoe shape: open arc + two feet */}
        <path d="M -3.2 2.2 A 3.2 3.2 0 1 1 3.2 2.2"
          fill="none" stroke="#b09020" strokeWidth=".75" opacity=".85" />
        <line x1="-3.2" y1="2.2" x2="-3.2" y2="5" stroke="#b09020" strokeWidth=".75" opacity=".85" />
        <line x1="3.2"  y1="2.2" x2="3.2"  y2="5" stroke="#b09020" strokeWidth=".75" opacity=".85" />
        <circle cx="0" cy="-0.8" r=".55" fill="#d4af37" opacity=".6" />
      </g>

      {/* Ketu — descending node (☋ approximated) */}
      <g transform={`translate(${KE[0]}, ${KE[1]})`}>
        <circle cx="0" cy="0" r="7" fill="#d4af37" opacity=".07" />
        {/* Inverted horseshoe */}
        <path d="M -3.2 -2.2 A 3.2 3.2 0 1 0 3.2 -2.2"
          fill="none" stroke="#b09020" strokeWidth=".75" opacity=".85" />
        <line x1="-3.2" y1="-2.2" x2="-3.2" y2="-5" stroke="#b09020" strokeWidth=".75" opacity=".85" />
        <line x1="3.2"  y1="-2.2" x2="3.2"  y2="-5" stroke="#b09020" strokeWidth=".75" opacity=".85" />
        {/* Ketu comet-tail suggestion */}
        <line x1="0" y1="1" x2="0" y2="5.5" stroke="#b09020" strokeWidth=".5" opacity=".5" />
        <circle cx="0" cy="0.6" r=".55" fill="#d4af37" opacity=".55" />
      </g>

      {/* ─── SHANI (SATURN) ─── */}
      <circle cx="0" cy="0" r="148" fill="none" stroke="#d4af37" strokeWidth=".3" opacity=".38" />
      <g transform={`translate(${SA[0]}, ${SA[1]})`}>
        <circle cx="0" cy="0" r="8" fill="#d4af37" opacity=".06" />
        <g transform="rotate(-25)">
          {/* Ring back-arc */}
          <path d="M-8.5 0 A 8.5 2.8 0 0 1 8.5 0"
            fill="none" stroke="#8a6010" strokeWidth=".55" opacity=".45" />
          {/* Planet body */}
          <circle cx="0" cy="0" r="4" fill="#a26d0e" />
          <circle cx="-1.2" cy="-1.2" r="1.5" fill="#c8920e" opacity=".45" />
          {/* Ring front-arc */}
          <path d="M-8.5 0 A 8.5 2.8 0 0 0 8.5 0"
            fill="none" stroke="#b8881a" strokeWidth=".9" opacity=".7" />
        </g>
      </g>

      {/* ─── GURU (JUPITER) ─── */}
      <circle cx="0" cy="0" r="120" fill="none" stroke="#f4d160" strokeWidth=".35" opacity=".35" />
      <g transform={`translate(${GU[0]}, ${GU[1]})`}>
        {/* Large glow — Guru is the most auspicious graha */}
        <circle cx="0" cy="0" r="11" fill="url(#ngGuruGlow)" />
        <circle cx="0" cy="0" r="5.8" fill="#d4af37" />
        <circle cx="-1.8" cy="-1.8" r="2.2" fill="#f4d160" opacity=".5" />
        {/* Jupiter cloud bands */}
        <line x1="-5.5" y1="1.4" x2="5.5" y2="1.4" stroke="#8a5c08" strokeWidth=".45" opacity=".5" />
        <line x1="-5"   y1="-1.4" x2="5" y2="-1.4" stroke="#8a5c08" strokeWidth=".3" opacity=".35" />
      </g>

      {/* ─── MANGAL (MARS) ─── */}
      <circle cx="0" cy="0" r="96" fill="none" stroke="#d4af37" strokeWidth=".3" opacity=".38" />
      <g transform={`translate(${MA[0]}, ${MA[1]})`}>
        <circle cx="0" cy="0" r="6" fill="#c87040" opacity=".15" />
        <circle cx="0" cy="0" r="3.2" fill="#c86830" />
        <circle cx="-0.9" cy="-0.9" r="1.1" fill="#e8903a" opacity=".5" />
      </g>

      {/* ─── SHUKRA (VENUS) ─── */}
      <circle cx="0" cy="0" r="74" fill="none" stroke="#d4af37" strokeWidth=".3" opacity=".38" />
      <g transform={`translate(${SH[0]}, ${SH[1]})`}>
        <circle cx="0" cy="0" r="6" fill="#fce29a" opacity=".18" />
        <circle cx="0" cy="0" r="3.4" fill="#fce29a" />
        <circle cx="-1"  cy="-1"  r="1.3" fill="#ffffff" opacity=".45" />
      </g>

      {/* ─── BUDHA (MERCURY) ─── */}
      <circle cx="0" cy="0" r="56" fill="none" stroke="#d4af37" strokeWidth=".3" opacity=".38" />
      <g transform={`translate(${BU[0]}, ${BU[1]})`}>
        <circle cx="0" cy="0" r="4.5" fill="#d4af37" opacity=".14" />
        <circle cx="0" cy="0" r="2.6" fill="#d4af37" />
        <circle cx="-0.7" cy="-0.7" r=".9" fill="#f4d160" opacity=".55" />
      </g>

      {/* ─── CHANDRA (MOON) ─── */}
      {/* Moon orbit — slightly brighter, she rules the mind in Jyotish */}
      <circle cx="0" cy="0" r="38" fill="none" stroke="#fce29a" strokeWidth=".4" opacity=".35" />
      <g transform={`translate(${CH[0]}, ${CH[1]})`}>
        <circle cx="0" cy="0" r="6.5" fill="#fce29a" opacity=".14" />
        {/* Crescent shape: full disk clipped by offset shadow circle */}
        <circle cx="0" cy="0" r="4" fill="#fce29a" opacity=".92" mask="url(#ngCrescent)" />
        <circle cx="0" cy="0" r="4" fill="none" stroke="#fce29a" strokeWidth=".3" opacity=".55" />
      </g>

      {/* ─── SURYA (SUN) — CENTER ─── */}
      {/* Soft corona */}
      <circle cx="0" cy="0" r="34" fill="url(#ngSunAura)" />

      {/* 16 solar rays (from r=9 to r=24) */}
      <g stroke="#f4d160" strokeWidth=".45" opacity=".4">
        {SUN_RAYS.map((a) => {
          const rad = (a * Math.PI) / 180
          const x1 = +(9  * Math.sin(rad)).toFixed(2)
          const y1 = +(-(9  * Math.cos(rad))).toFixed(2)
          const x2 = +(24 * Math.sin(rad)).toFixed(2)
          const y2 = +(-(24 * Math.cos(rad))).toFixed(2)
          return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} />
        })}
      </g>

      {/* Sun disk */}
      <circle cx="0" cy="0" r="7.5" fill="url(#ngSunCore)" />
      {/* Specular highlight */}
      <circle cx="-2.5" cy="-3" r="3.2" fill="#fffbe8" opacity=".35" />
    </svg>
  )
}
