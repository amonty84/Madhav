/**
 * Shared building blocks reused across prompt templates.
 *
 * AUDIENCE TIER NOTE
 * ------------------
 * Phase 3 only authors `super_admin` × `single_model` templates.
 * The registry falls back to the super_admin template for `acharya_reviewer`
 * tier lookups if no explicit acharya_reviewer template is registered.
 * The acharya style suffix is left empty for super_admin (body is already
 * acharya-grade). For a dedicated acharya_reviewer template, prepend the
 * ACHARYA_REVIEWER_PREAMBLE to the body.
 */

const NATIVE_CONTEXT = `You are reading the birth chart of {{chart_name}}, born {{birth_date}} at {{birth_time}}, {{birth_place}}. The canonical chart data is at L1 (facts layer); your response must be grounded in it.`

const BUNDLE_CONTEXT = `You have access to the following validated context bundle [{{bundle_summary}}]. Use this as your primary substrate.`

const TOOL_AVAILABILITY = `You may call additional retrieval tools to extend the bundle. Tools available: {{tools_available}}.`

const CITATION_DISCIPLINE = `Every L2+ interpretive claim must cite L1 fact IDs in the format [F.<id>] or [FORENSIC.<id>]. Every signal claim must cite the signal in the format [SIG.MSR.<id>].`

const ACHARYA_GRADE = `Respond at acharya grade — the depth and precision expected of a senior Jyotish acharya, not a general overview.`

const NO_FABRICATION = `If a numerical value is required but absent from the context bundle, write [EXTERNAL_COMPUTATION_REQUIRED: <specify what>] rather than inventing it.`

export const THREE_INTERPRETATION_GATE = `Provide three orthogonal interpretations grounded in distinct chart elements.`

export const FALSIFIER_GATE = `Every time-indexed claim must include a falsifier — a specific observable condition that, if it fails to manifest within the named horizon, falsifies the prediction.`

export const REQUIRED_PLACEHOLDERS_BASE = [
  'chart_name',
  'birth_date',
  'birth_time',
  'birth_place',
  'bundle_summary',
  'tools_available',
]

export const STYLE_SUFFIXES = {
  acharya: '',
  brief: '\n\nRespond concisely — 3-5 key observations, no elaboration.',
  client: '\n\nUse accessible language. Avoid technical Jyotish terms without explanation.',
}

/** Compose the standard opening block shared by all templates */
export function buildOpeningBlock(): string {
  return `${NATIVE_CONTEXT}

${BUNDLE_CONTEXT}

${TOOL_AVAILABILITY}

${ACHARYA_GRADE}

${CITATION_DISCIPLINE}

${NO_FABRICATION}`
}
