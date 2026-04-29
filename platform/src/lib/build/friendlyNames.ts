// Plain-language names + one-line purposes for canonical artifacts.
// Drafted from frontmatter / first-paragraph paraphrase. Native to review.

export interface FriendlyArtifact {
  friendly_name: string
  purpose_group: 'Charts & Facts' | 'Synthesis' | 'Governance' | 'Plans' | 'Mirrors' | 'Other'
  one_line_purpose: string
}

export const FRIENDLY_NAMES: Record<string, FriendlyArtifact> = {
  FORENSIC: {
    friendly_name: 'The Forensic Chart',
    purpose_group: 'Charts & Facts',
    one_line_purpose: "The native's full birth-chart data — the foundation everything else reads from.",
  },
  LEL: {
    friendly_name: 'Life Event Log',
    purpose_group: 'Charts & Facts',
    one_line_purpose: 'Real-life events with dates, used to test predictions against what actually happened.',
  },
  MSR: {
    friendly_name: 'Master Signals Register',
    purpose_group: 'Synthesis',
    one_line_purpose: 'Every astrologically meaningful pattern found in the chart, indexed for cross-referencing.',
  },
  UCN: {
    friendly_name: 'Unified Concept Network',
    purpose_group: 'Synthesis',
    one_line_purpose: 'How concepts in the chart connect to each other — the wiring diagram of the synthesis.',
  },
  CDLM: {
    friendly_name: 'Cross-Domain Linkage Matrix',
    purpose_group: 'Synthesis',
    one_line_purpose: 'Where one life domain (career, health, relationships) bleeds into another.',
  },
  RM: {
    friendly_name: 'Resonance Map',
    purpose_group: 'Synthesis',
    one_line_purpose: 'How the same theme echoes across multiple chart layers — pattern reinforcement.',
  },
  CGM: {
    friendly_name: 'Cumulative Growth Map',
    purpose_group: 'Synthesis',
    one_line_purpose: 'The arc of how the native develops over time, layered against transits.',
  },
  PROJECT_ARCHITECTURE: {
    friendly_name: 'Project Architecture',
    purpose_group: 'Plans',
    one_line_purpose: 'The blueprint — how the layers, files, and rules of the system fit together.',
  },
  MACRO_PLAN: {
    friendly_name: 'Macro Plan',
    purpose_group: 'Plans',
    one_line_purpose: 'The ten-phase strategic arc from M1 to M10 — the long-range roadmap.',
  },
  PHASE_B_PLAN: {
    friendly_name: 'Phase B Plan',
    purpose_group: 'Plans',
    one_line_purpose: 'Detailed steps for the current macro phase (Corpus Activation).',
  },
  FILE_REGISTRY: {
    friendly_name: 'File Registry',
    purpose_group: 'Governance',
    one_line_purpose: 'Index of every governed file with version, status, and purpose.',
  },
  GOVERNANCE_STACK: {
    friendly_name: 'Governance Stack',
    purpose_group: 'Governance',
    one_line_purpose: 'The layered rules that keep the build honest — what enforces what.',
  },
  STEP_LEDGER: {
    friendly_name: 'Step Ledger (closed)',
    purpose_group: 'Governance',
    one_line_purpose: 'Historical record of the governance rebuild steps. Sealed — read-only audit trail.',
  },
  SESSION_LOG: {
    friendly_name: 'Session Log',
    purpose_group: 'Governance',
    one_line_purpose: 'Append-only journal of every session that has run — the build diary.',
  },
  NATIVE_DIRECTIVES: {
    friendly_name: 'Native Directives',
    purpose_group: 'Governance',
    one_line_purpose: 'Standing instructions issued by you that future sessions must honor.',
  },
  CONVERSATION_NAMING_CONVENTION: {
    friendly_name: 'Conversation Naming',
    purpose_group: 'Governance',
    one_line_purpose: 'Rule for how each session names its working thread — keeps history searchable.',
  },
  GOVERNANCE_INTEGRITY_PROTOCOL: {
    friendly_name: 'Integrity Protocol',
    purpose_group: 'Governance',
    one_line_purpose: 'Hard rules sessions must follow: open-handshake, close-checklist, drift checks.',
  },
  CANONICAL_ARTIFACTS: {
    friendly_name: 'Canonical Artifacts Registry',
    purpose_group: 'Governance',
    one_line_purpose: 'The single source of truth for which file is the official version of each artifact.',
  },
  SESSION_OPEN_TEMPLATE: {
    friendly_name: 'Session-Open Template',
    purpose_group: 'Governance',
    one_line_purpose: 'Schema every session uses to declare its scope and acceptance criteria up front.',
  },
  SESSION_CLOSE_TEMPLATE: {
    friendly_name: 'Session-Close Template',
    purpose_group: 'Governance',
    one_line_purpose: 'Schema every session uses to record what it actually did before closing.',
  },
  DISAGREEMENT_REGISTER: {
    friendly_name: 'Disagreement Register',
    purpose_group: 'Governance',
    one_line_purpose: 'Open issues between agents (Claude / Gemini) that need your call.',
  },
  CLAUDE: {
    friendly_name: 'Claude Instructions',
    purpose_group: 'Mirrors',
    one_line_purpose: "Claude-side master instructions — the agent's orientation surface.",
  },
  GEMINIRULES: {
    friendly_name: 'Gemini Instructions',
    purpose_group: 'Mirrors',
    one_line_purpose: 'Gemini-side mirror of master instructions — kept in sync with the Claude side.',
  },
  PROJECT_STATE: {
    friendly_name: 'Project State (Gemini)',
    purpose_group: 'Mirrors',
    one_line_purpose: 'Gemini-side current-state snapshot — mirrors the Claude-side CURRENT_STATE.',
  },
  CURRENT_STATE: {
    friendly_name: 'Current State',
    purpose_group: 'Governance',
    one_line_purpose: 'The "you are here" pointer — which phase, sub-phase, and session is active right now.',
  },
}

export function lookupFriendly(canonical_id: string): FriendlyArtifact {
  return (
    FRIENDLY_NAMES[canonical_id] ?? {
      friendly_name: canonical_id,
      purpose_group: 'Other',
      one_line_purpose: 'No plain-language description yet.',
    }
  )
}

export const PURPOSE_ORDER: FriendlyArtifact['purpose_group'][] = [
  'Charts & Facts',
  'Synthesis',
  'Plans',
  'Governance',
  'Mirrors',
  'Other',
]
