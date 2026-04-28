// Build tracker color system — single source of truth.
// All values are oklch strings matching globals.css conventions.

export const statusColors = {
  completed: 'oklch(0.78 0.13 145)',   // green
  active:    'oklch(0.78 0.13 75)',    // warm gold (extends existing palette)
  in_progress:'oklch(0.78 0.13 75)',
  pending:   'oklch(0.55 0.01 75)',    // muted neutral
  blocked:   'oklch(0.62 0.20 27)',    // red
  unknown:   'oklch(0.60 0.005 75)',
} as const

export const statusBg = {
  completed:  'bg-[oklch(0.93_0.05_145)]  dark:bg-[oklch(0.25_0.05_145)]',
  active:     'bg-[oklch(0.95_0.04_75)]   dark:bg-[oklch(0.28_0.06_75)]',
  in_progress:'bg-[oklch(0.95_0.04_75)]   dark:bg-[oklch(0.28_0.06_75)]',
  pending:    'bg-muted',
  blocked:    'bg-[oklch(0.95_0.04_27)]   dark:bg-[oklch(0.28_0.06_27)]',
  unknown:    'bg-muted',
} as const

export const statusText = {
  completed:  'text-[oklch(0.40_0.12_145)] dark:text-[oklch(0.78_0.13_145)]',
  active:     'text-[oklch(0.45_0.12_75)]  dark:text-[oklch(0.78_0.13_75)]',
  in_progress:'text-[oklch(0.45_0.12_75)]  dark:text-[oklch(0.78_0.13_75)]',
  pending:    'text-muted-foreground',
  blocked:    'text-[oklch(0.40_0.18_27)]  dark:text-[oklch(0.70_0.19_22)]',
  unknown:    'text-muted-foreground',
} as const

// Session-class palette — 8 classes from SESSION_LOG_SCHEMA enum
export const classColors: Record<string, string> = {
  m2_corpus_execution:  '#3b82f6',  // blue
  governance_aside:     '#a855f7',  // purple
  planning_only:        '#06b6d4',  // cyan
  fix_session:          '#f97316',  // orange
  red_team:             '#ef4444',  // red
  brief_authoring:      '#84cc16',  // yellow-green
  native_intervention:  '#ec4899',  // pink
  cowork_orchestration: '#78716c',  // warm-neutral
  unknown:              '#a8a29e',
}

export function getClassColor(cls: string): string {
  return classColors[cls] ?? classColors.unknown
}

// Is this class "on-plan" (M2 corpus work) or "off-plan" (meta / infra)?
export function isOnPlan(cls: string): boolean {
  return cls === 'm2_corpus_execution'
}

// Severity palette for governance findings
export const severityColors = {
  baseline: '#22c55e',  // green — exit 2, accepted residuals
  medium:   '#f59e0b',  // amber — new findings
  high:     '#ef4444',  // red — regressions
  info:     '#78716c',  // neutral
} as const

// Exit code → color mapping (used by health trends)
export const exitCodeColor: Record<number, string> = {
  0: '#22c55e',
  1: '#86efac',
  2: '#fbbf24',
  3: '#f97316',
  4: '#ef4444',
}

// Status → short label
export function statusLabel(status: string): string {
  const map: Record<string, string> = {
    completed: 'Done',
    active: 'Active',
    in_progress: 'In progress',
    pending: 'Pending',
    blocked: 'Blocked',
    unknown: '—',
  }
  return map[status] ?? status.replace(/_/g, ' ')
}
