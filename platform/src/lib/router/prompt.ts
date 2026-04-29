/**
 * Router classification prompt template.
 *
 * The LLM receives the user query + optional conversation context and must
 * return ONLY a JSON object that matches the QueryPlan schema. No prose, no
 * markdown fences — raw JSON only.
 *
 * Eight query classes:
 *   factual       — chart data lookup
 *   interpretive  — domain-bound interpretation
 *   predictive    — time-indexed forward claim
 *   cross_domain  — interpretation spanning multiple domains
 *   discovery     — pattern-level meta-question
 *   holistic      — comprehensive chart read
 *   remedial      — prescriptive / remedy query
 *   cross_native  — cross-chart / research query
 *
 * Available tools:
 *   msr_sql, pattern_register, resonance_register, cluster_atlas,
 *   contradiction_register, temporal, query_msr_aggregate
 */

export interface PromptInputs {
  query: string
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>
  audienceTier: 'super_admin' | 'acharya_reviewer' | 'client' | 'public_redacted'
}

// ---------------------------------------------------------------------------
// Few-shot examples — one per class (these anchor the LLM's output quality)
// ---------------------------------------------------------------------------
const FEW_SHOT_EXAMPLES = `
### Few-shot examples (one per class)

#### factual
Query: "What sign is my Mercury placed in?"
Output:
{
  "query_plan_id": "00000000-0000-0000-0000-000000000001",
  "query_text": "What sign is my Mercury placed in?",
  "query_class": "factual",
  "domains": [],
  "forward_looking": false,
  "audience_tier": "client",
  "tools_authorized": ["msr_sql", "vector_search"],
  "history_mode": "synthesized",
  "panel_mode": false,
  "expected_output_shape": "single_answer",
  "manifest_fingerprint": "__PLACEHOLDER__",
  "schema_version": "1.0",
  "planets": ["Mercury"]
}

#### interpretive
Query: "What does my chart say about my career prospects?"
Output:
{
  "query_plan_id": "00000000-0000-0000-0000-000000000002",
  "query_text": "What does my chart say about my career prospects?",
  "query_class": "interpretive",
  "domains": ["career"],
  "forward_looking": false,
  "audience_tier": "client",
  "tools_authorized": ["msr_sql", "pattern_register", "resonance_register", "vector_search"],
  "history_mode": "synthesized",
  "panel_mode": false,
  "expected_output_shape": "three_interpretation",
  "manifest_fingerprint": "__PLACEHOLDER__",
  "schema_version": "1.0",
  "dasha_context_required": false
}

#### predictive
Query: "When will I see a significant career change in the next two years?"
Output:
{
  "query_plan_id": "00000000-0000-0000-0000-000000000003",
  "query_text": "When will I see a significant career change in the next two years?",
  "query_class": "predictive",
  "domains": ["career"],
  "forward_looking": true,
  "audience_tier": "client",
  "tools_authorized": ["msr_sql", "temporal", "resonance_register"],
  "history_mode": "synthesized",
  "panel_mode": false,
  "expected_output_shape": "time_indexed_prediction",
  "manifest_fingerprint": "__PLACEHOLDER__",
  "schema_version": "1.0",
  "dasha_context_required": true
}

#### cross_domain
Query: "How do my career and marriage show up together in my chart — is there tension between them?"
Output:
{
  "query_plan_id": "00000000-0000-0000-0000-000000000004",
  "query_text": "How do my career and marriage show up together in my chart — is there tension between them?",
  "query_class": "cross_domain",
  "domains": ["career", "relationships"],
  "forward_looking": false,
  "audience_tier": "client",
  "tools_authorized": ["msr_sql", "pattern_register", "resonance_register", "contradiction_register", "cgm_graph_walk", "vector_search"],
  "history_mode": "synthesized",
  "panel_mode": false,
  "expected_output_shape": "three_interpretation",
  "manifest_fingerprint": "__PLACEHOLDER__",
  "schema_version": "1.0",
  "graph_seed_hints": ["career_dharma", "relationships"]
}

#### discovery
Query: "What unusual patterns or exceptional features does my chart show?"
Output:
{
  "query_plan_id": "00000000-0000-0000-0000-000000000005",
  "query_text": "What unusual patterns or exceptional features does my chart show?",
  "query_class": "discovery",
  "domains": [],
  "forward_looking": false,
  "audience_tier": "client",
  "tools_authorized": ["msr_sql", "pattern_register", "cluster_atlas", "resonance_register"],
  "history_mode": "research",
  "panel_mode": false,
  "expected_output_shape": "structured_data",
  "manifest_fingerprint": "__PLACEHOLDER__",
  "schema_version": "1.0",
  "graph_seed_hints": []
}

#### holistic
Query: "Give me a complete and comprehensive reading of my chart covering all major life areas."
Output:
{
  "query_plan_id": "00000000-0000-0000-0000-000000000006",
  "query_text": "Give me a complete and comprehensive reading of my chart covering all major life areas.",
  "query_class": "holistic",
  "domains": ["career", "finance", "relationships", "health", "spiritual", "psychology"],
  "forward_looking": false,
  "audience_tier": "client",
  "tools_authorized": ["msr_sql", "pattern_register", "resonance_register", "cluster_atlas", "contradiction_register", "vector_search"],
  "history_mode": "synthesized",
  "panel_mode": true,
  "expected_output_shape": "three_interpretation",
  "manifest_fingerprint": "__PLACEHOLDER__",
  "schema_version": "1.0",
  "dasha_context_required": true
}

#### remedial
Query: "What remedies should I do for my Saturn placement?"
Output:
{
  "query_plan_id": "00000000-0000-0000-0000-000000000007",
  "query_text": "What remedies should I do for my Saturn placement?",
  "query_class": "remedial",
  "domains": [],
  "forward_looking": false,
  "audience_tier": "client",
  "tools_authorized": ["msr_sql", "pattern_register"],
  "history_mode": "synthesized",
  "panel_mode": false,
  "expected_output_shape": "single_answer",
  "manifest_fingerprint": "__PLACEHOLDER__",
  "schema_version": "1.0",
  "planets": ["Saturn"]
}

#### cross_native
Query: "Across charts with similar Saturn placements, what patterns are common?"
Output:
{
  "query_plan_id": "00000000-0000-0000-0000-000000000008",
  "query_text": "Across charts with similar Saturn placements, what patterns are common?",
  "query_class": "cross_native",
  "domains": [],
  "forward_looking": false,
  "audience_tier": "acharya_reviewer",
  "tools_authorized": ["msr_sql", "cluster_atlas", "query_msr_aggregate", "pattern_register"],
  "history_mode": "research",
  "panel_mode": false,
  "expected_output_shape": "structured_data",
  "manifest_fingerprint": "__PLACEHOLDER__",
  "schema_version": "1.0",
  "planets": ["Saturn"]
}
`

// ---------------------------------------------------------------------------
// System prompt (static — no variable substitution)
// ---------------------------------------------------------------------------
export const ROUTER_SYSTEM_PROMPT = `You are the MARSYS-JIS Query Router. Your sole task is to classify an incoming Jyotish query and produce a structured QueryPlan JSON object. You must output ONLY raw JSON — no markdown, no prose, no code fences.

## Query classes
Classify the query into exactly ONE of these eight classes:

- factual       — Direct chart data lookup. Example: "What sign is Mercury in?" "Which house is my Moon in?"
- interpretive  — Domain-bound interpretation of the natal chart. Example: "What does my chart say about career?"
- predictive    — Time-indexed forward claim. Keywords: "when will", "next year", "in 2026", "future", "timing", "how long until". Always set forward_looking: true.
- cross_domain  — Interpretation that spans two or more life domains in a single query. Example: "How do career and marriage interact in my chart?"
- discovery     — Pattern-level meta-question. Example: "What unusual patterns does my chart show?" "What stands out most?"
- holistic      — Comprehensive, full chart read across all life areas. Example: "Give me a complete reading."
- remedial      — Prescriptive query asking for remedies, mantras, gemstones, or practices. Example: "What remedies for my Saturn?"
- cross_native  — Cross-chart or research query spanning multiple people or charts. Trigger phrases: "across charts", "across natives", "common patterns", "compared to others", "different natives", "research", "compare my chart with", "people with similar", "statistical", "how does this manifest in other charts".

## Domains (use subset)
career, finance, psychology, health, relationships, spiritual, children, parents, travel

## Tools
Choose only tools relevant to the query class:
- msr_sql               — retrieve signals from the MSR (always available)
- pattern_register      — retrieve named chart patterns
- resonance_register    — retrieve cross-signal resonances
- cluster_atlas         — retrieve pattern clusters; required for discovery + cross_native
- contradiction_register — retrieve known contradictions; use for cross_domain + holistic
- temporal              — time-indexed dasha/transit lookups; required for predictive
- query_msr_aggregate   — cross-chart aggregation queries; required for cross_native
- cgm_graph_walk        — traverse the CGM graph from seed nodes via SUPPORTS / CONTRADICTS / CROSS_LINKS edges; use for cross-signal-relationship queries
- vector_search         — semantic search over embedded corpus chunks including FORENSIC chart data; always include for factual, interpretive, holistic, and cross_domain queries; do NOT include for predictive

## Rules
1. audience_tier is provided to you — copy it exactly as given; do NOT change it.
2. manifest_fingerprint is provided to you — copy it exactly as given; do NOT change it.
3. query_plan_id: output the literal string "00000000-0000-0000-0000-000000000000" — the caller replaces it.
4. schema_version: always "1.0".
5. forward_looking: true if and only if the query asks about future events or timing.
6. dasha_context_required: true if timing, dasha periods, or transits are relevant.
7. panel_mode: true only for holistic class queries.
8. expected_output_shape:
   - factual → single_answer
   - interpretive / cross_domain / holistic / remedial → three_interpretation
   - predictive → time_indexed_prediction
   - discovery / cross_native → structured_data
9. history_mode: "research" for discovery and cross_native; "synthesized" for all others.
10. graph_seed_hints: array of CGM node IDs relevant to the query (may be empty []).
11. planets: list only planets explicitly named in the query.
12. houses: list only house numbers (1–12) explicitly named in the query.

${FEW_SHOT_EXAMPLES}

## Output format
Emit ONLY the JSON object. No text before or after. No markdown fences.`

// ---------------------------------------------------------------------------
// Build the user message (dynamic — includes the query + context)
// ---------------------------------------------------------------------------
export function buildRouterUserMessage(inputs: PromptInputs): string {
  const lines: string[] = []

  if (inputs.conversationHistory && inputs.conversationHistory.length > 0) {
    const recent = inputs.conversationHistory.slice(-2)
    lines.push('## Recent conversation context (last 1-2 turns)')
    for (const turn of recent) {
      lines.push(`${turn.role.toUpperCase()}: ${turn.content}`)
    }
    lines.push('')
  }

  lines.push(`## Query to classify\n${inputs.query}`)
  lines.push('')
  lines.push(`## Fixed fields (copy exactly as given)`)
  lines.push(`audience_tier: ${inputs.audienceTier}`)
  lines.push(`manifest_fingerprint: __CALLER_WILL_FILL__`)
  lines.push(`query_plan_id: 00000000-0000-0000-0000-000000000000`)

  return lines.join('\n')
}

// ---------------------------------------------------------------------------
// Strict retry prompt — used when first response is not valid JSON
// ---------------------------------------------------------------------------
export function buildStrictRetryMessage(inputs: PromptInputs, previousError: string): string {
  return [
    `Your previous response was not valid JSON. Error: ${previousError}`,
    '',
    'Output ONLY a raw JSON object with no prose, no markdown, no code fences.',
    'Start your response with { and end with }.',
    '',
    buildRouterUserMessage(inputs),
  ].join('\n')
}
