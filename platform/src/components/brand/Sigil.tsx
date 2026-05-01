import type { SVGProps } from "react";

/**
 * MARSYS-JIS sigil — 24×24 mandala extract (bindu + 8 petals).
 * Inherits currentColor; size via className (default 1em).
 * See brand/Mandala.tsx for the full motif.
 */
export function Sigil({
  size = 24,
  ...props
}: { size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {/* Outer ring */}
      <circle cx="12" cy="12" r="10" opacity="0.35" />
      {/* 8-petal lotus — bead nodes at each cardinal + ordinal direction */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * Math.PI) / 4;
        const r = 7;
        const x = 12 + Math.cos(angle) * r;
        const y = 12 + Math.sin(angle) * r;
        return <circle key={i} cx={x} cy={y} r="1.4" opacity="0.7" fill="currentColor" stroke="none" />;
      })}
      {/* Bindu (center) */}
      <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  );
}
