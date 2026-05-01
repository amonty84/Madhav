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

const CONTRADICTION_FRAMING = `When the retrieved bundle contains entries from the L3.5 Contradiction Register (chunks beginning with a "[<contradiction_class>]" tag and carrying a contradiction_id such as CON.003), surface each contradiction explicitly in your answer — name the [<contradiction_class>] and cite the (CON.<id>) register row, e.g. "The corpus contains a [timing_conflict] (CON.007) between X and Y — this is an open contradiction, not a resolved discrepancy." Do not average, smooth, or synthesize the contradiction away into a unified narrative. If the chunk surfaces resolution_options, present those options as recorded; if no resolution is recorded, state that the contradiction is open and that resolution requires further data, computation, or native-acharya arbitration. Do not fabricate L1 facts or invent a resolution that the register does not record. Cite the contradiction_id for each contradiction you surface so the response is auditable back to the L3.5 Contradiction Register (B.1 layer-separation; B.3 derivation-ledger discipline). When no contradiction-register chunks appear in the retrieved context, this rubric is dormant — proceed with the query class's normal synthesis.`

export const THREE_INTERPRETATION_GATE = `Provide three orthogonal interpretations grounded in distinct chart elements.`

export const FALSIFIER_GATE = `Every time-indexed claim must include a falsifier — a specific observable condition that, if it fails to manifest within the named horizon, falsifies the prediction.`

/**
 * PRESCRIPTIVE_CITATION_GATE — appended to remedial and predictive templates.
 *
 * The L2 citation gate hard-fails any prescriptive response that contains zero
 * SIG.MSR.NNN citations, because guidance without a grounded signal chain cannot
 * be audited or calibrated. This block makes the requirement explicit at the
 * synthesis step so models cannot overlook it.
 *
 * Format note: the context bundle delivers MSR signals with chunk labels of the
 * form [chunk:SIG.MSR.142] — those labels ARE the signal IDs. Copy them into
 * your response text as bare SIG.MSR.NNN references (e.g. SIG.MSR.142), not as
 * bracket-wrapped chunk labels. The grounding gate matches the pattern
 * SIG.MSR.NNN (exactly three digits) and cross-references each id against the
 * assembled context. Invented ids that do not appear in the bundle will be
 * flagged as training-data leaks — only cite ids you can see in the context.
 */
export const PRESCRIPTIVE_CITATION_GATE = `CITATION GATE (mandatory for this query class):
Your response MUST contain at least one MSR signal citation in the exact format SIG.MSR.NNN, where NNN is a three-digit number (e.g. SIG.MSR.142, SIG.MSR.007). These ids appear in the context bundle as chunk labels [chunk:SIG.MSR.NNN] — use those exact ids. Do not invent ids not present in the bundle. A response with zero SIG.MSR.NNN citations will fail the grounding audit. If no MSR signals have been retrieved yet, call the msr_sql or query_signal_state tool to fetch relevant signals before composing your answer.`

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

const METHODOLOGY_INSTRUCTION = `After all visible content, append a fenced block labeled \`marsys_methodology_block\` containing 2–4 sentences describing your reasoning chain: which signals you considered, which derivation rules you applied, which classical principles you cited, and which alternatives you discarded. Write for a senior Jyotish acharya reviewing your work. This block is not rendered to the client. Example:

\`\`\`marsys_methodology_block
I routed through L2.5 holistic synthesis, consulting the MSR for pattern density and the UCN for natal-nodal polarisation. The query class required two orthogonal signal chains — I selected [F.X] × [SIG.MSR.Y] and [F.Z] × [SIG.MSR.W]. I discarded the Ashtottari dasha framing because no conditional trigger was found in the chart.
\`\`\`

Omit this block only if the answer was a single-line factual lookup with no reasoning to expose.`

/** Compose the standard opening block shared by all templates */
export function buildOpeningBlock(): string {
  return `${NATIVE_CONTEXT}

${BUNDLE_CONTEXT}

${TOOL_AVAILABILITY}

${ACHARYA_GRADE}

${CITATION_DISCIPLINE}

${NO_FABRICATION}

${CONTRADICTION_FRAMING}

${METHODOLOGY_INSTRUCTION}`
}
