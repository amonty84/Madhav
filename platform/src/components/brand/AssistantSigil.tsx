import { cn } from '@/lib/utils'

/**
 * Compact mandala-bindu assistant sigil. A bordered circle with an 8-petal
 * lotus + central bindu — the brand surrogate for the generic "Sparkles"
 * avatar previously used by AssistantMessage / PendingAssistantBubble.
 *
 * Stroke + fill default to currentColor so the sigil takes its hue from the
 * surrounding text-color rule (set in the avatar wrapper). Treat as
 * decorative (`aria-hidden`); the bubble's role/aria handles semantics.
 */
const PETALS_8 = Array.from({ length: 8 }, (_, i) => i * 45)

export function AssistantSigil({
  size = 24,
  className,
}: {
  size?: number
  className?: string
}) {
  return (
    <svg
      viewBox="-50 -50 100 100"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      className={cn('block', className)}
      aria-hidden="true"
    >
      {/* Outer ring */}
      <circle
        cx="0"
        cy="0"
        r="46"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.85"
      />
      {/* Inner hairline ring (mirrors mandala layering) */}
      <circle
        cx="0"
        cy="0"
        r="42"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.45"
      />
      {/* 8-petal lotus */}
      <g opacity="0.85">
        {PETALS_8.map((a) => (
          <g key={a} transform={`rotate(${a})`}>
            <path
              d="M0 -34 C 9 -22, 9 -10, 0 0 C -9 -10, -9 -22, 0 -34 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </g>
        ))}
      </g>
      {/* Bindu */}
      <circle cx="0" cy="0" r="3" fill="currentColor" />
    </svg>
  )
}
