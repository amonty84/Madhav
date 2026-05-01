// Maps free-form expected_session_class strings to canonical enum values
// per SESSION_LOG_SCHEMA_v1_0.md §1.5 (8-value enum added in Session 1)

const CANONICAL_CLASSES = [
  'm2_corpus_execution',
  'governance_aside',
  'planning_only',
  'fix_session',
  'red_team',
  'brief_authoring',
  'native_intervention',
  'cowork_orchestration',
] as const

export type SessionClass = (typeof CANONICAL_CLASSES)[number] | 'unknown'

export function normalizeSessionClass(raw: string | null | undefined): SessionClass {
  if (!raw) return 'unknown'
  const lower = raw.toLowerCase().replace(/[-\s]/g, '_')
  if ((CANONICAL_CLASSES as readonly string[]).includes(lower)) {
    return lower as SessionClass
  }
  return 'unknown'
}

export function sessionClassLabel(cls: string | null | undefined): string {
  const labels: Record<string, string> = {
    m2_corpus_execution: 'M2 Execution',
    governance_aside: 'Governance',
    planning_only: 'Planning',
    fix_session: 'Fix',
    red_team: 'Red-Team',
    brief_authoring: 'Brief',
    native_intervention: 'Intervention',
    cowork_orchestration: 'Cowork',
    unknown: 'Unknown',
  }
  return labels[cls ?? 'unknown'] ?? (cls ?? '—')
}
