import { relativeTime } from '@/lib/build/format'

interface MomentPhraseProps {
  currentDasha?: string | null
  lastLayerActivity?: string | null
  pyramidPercent: number
}

export function composeMomentPhrase({
  currentDasha,
  lastLayerActivity,
  pyramidPercent,
}: MomentPhraseProps): string | null {
  const parts: string[] = []
  if (currentDasha) parts.push(currentDasha)
  if (lastLayerActivity) parts.push(`last updated ${relativeTime(lastLayerActivity)}`)
  else if (pyramidPercent === 0) parts.push('build not started')
  return parts.length > 0 ? parts.join(' · ') : null
}

export function MomentPhrase(props: MomentPhraseProps) {
  const phrase = composeMomentPhrase(props)
  if (!phrase) return null
  return (
    <p className="text-xs text-muted-foreground/80 truncate" title={phrase}>
      {phrase}
    </p>
  )
}
