import { Briefcase, Coins, Heart, Activity, Clock, FileText } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export const DOMAIN_ICONS: Record<string, LucideIcon> = {
  career:        Briefcase,
  finance:       Coins,
  relationships: Heart,
  health:        Activity,
  timing:        Clock,
}

export function domainIcon(domain: string): LucideIcon {
  return DOMAIN_ICONS[domain.toLowerCase()] ?? FileText
}

/** Relative-age freshness: green <14d, amber 14–60d, red >60d */
export function freshnessColor(isoDate: string): 'green' | 'amber' | 'red' {
  const diffDays = Math.floor((Date.now() - new Date(isoDate).getTime()) / 86_400_000)
  if (diffDays < 14) return 'green'
  if (diffDays <= 60) return 'amber'
  return 'red'
}
