'use client'

import type { CSSProperties, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type Zone = 'vellum' | 'ink' | 'bridge'

interface ZoneRootProps {
  zone: Zone
  children: ReactNode
  className?: string
  style?: CSSProperties
}

const ZONE_CLASSES: Record<Zone, string> = {
  vellum: 'zone-vellum',
  ink: 'zone-ink dark',
  bridge: 'zone-bridge',
}

export function ZoneRoot({ zone, children, className, style }: ZoneRootProps) {
  return (
    <div className={cn(ZONE_CLASSES[zone], className)} style={style}>
      {children}
    </div>
  )
}
