import { cn } from '@/lib/utils'

const TIER_STYLES: Record<string, string> = {
  super_admin: 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300',
  acharya_reviewer: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300',
  client: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300',
  public_redacted: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400',
}

const CLASS_STYLES: Record<string, string> = {
  interpretive_multidomain: 'bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-300',
  interpretive_single: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300',
  factual: 'bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-900/30 dark:text-sky-300',
  timing: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300',
  meta: 'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400',
}

const BASE = 'inline-flex items-center rounded border px-1.5 py-0.5 text-[11px] font-medium leading-none'

export function DisclosureTierBadge({ tier }: { tier: string }) {
  const style = TIER_STYLES[tier] ?? 'bg-muted text-muted-foreground border-border'
  return <span className={cn(BASE, style)}>{tier}</span>
}

export function QueryClassBadge({ queryClass }: { queryClass: string }) {
  const style = CLASS_STYLES[queryClass] ?? 'bg-muted text-muted-foreground border-border'
  return <span className={cn(BASE, style)}>{queryClass}</span>
}

export function ValidatorStatusIcon({ validatorsRun }: { validatorsRun: Array<{ passed: boolean }> }) {
  const allPass = validatorsRun.every((v) => v.passed)
  const count = validatorsRun.length
  if (count === 0) return <span className="text-muted-foreground text-xs">—</span>
  return (
    <span
      className={cn('inline-flex items-center gap-1 text-xs font-medium', allPass ? 'text-emerald-600' : 'text-destructive')}
      aria-label={allPass ? 'All validators passed' : 'Some validators failed'}
    >
      <span aria-hidden="true">{allPass ? '✓' : '✗'}</span>
      {count}
    </span>
  )
}

export function CheckpointSummaryIcon({ payload }: { payload?: { checkpoints?: Record<string, { verdict: string }> } | null }) {
  if (!payload?.checkpoints) {
    return <span className="text-muted-foreground text-xs" aria-label="No checkpoints">—</span>
  }
  const verdicts = Object.values(payload.checkpoints).map((c) => c.verdict)
  const hasHalt = verdicts.includes('halt')
  const hasWarn = verdicts.includes('warn')
  if (hasHalt) return <span className="text-destructive text-xs font-medium" aria-label="Checkpoint halt">⬛ halt</span>
  if (hasWarn) return <span className="text-amber-600 text-xs font-medium" aria-label="Checkpoint warn">⚠ warn</span>
  return <span className="text-emerald-600 text-xs font-medium" aria-label="Checkpoints passed">✓</span>
}

export function PanelIndicator({ hasPanel }: { hasPanel: boolean }) {
  if (!hasPanel) return <span className="text-muted-foreground text-xs" aria-label="Single mode">—</span>
  return <span className="text-violet-600 text-xs font-medium" aria-label="Panel mode">⊞ panel</span>
}
