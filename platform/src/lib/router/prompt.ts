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
  "tools_authorized": ["msr_sql", "cgm_graph_walk", "vector_search"],
  "history_mode": "synthesized",
  "panel_mode": false,
  "expected_output_shape": "single_answer",
  "manifest_fingerprint": "__PLACEHOLDER__",
  "schema_version": "1.0",
  "planets": ["Mercury"],
  "graph_seed_hints": ["PLN.MERCURY"]
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
  "tools_authorized": ["msr_sql", "pattern_register", "resonance_register", "cgm_graph_walk", "vector_search"],
  "history_mode": "synthesized",
  "panel_mode": false,
  "expected_output_shape": "three_interpretation",
  "manifest_fingerprint": "__PLACEHOLDER__",
  "schema_version": "1.0",
  "dasha_context_required": false,
  "graph_seed_hints": ["HSE.10", "PLN.MERCURY"]
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
  "dasha_context_required": true,
  "graph_seed_hints": ["DSH.MD.SATURN", "PLN.SATURN"]
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
  "graph_seed_hints": ["HSE.7", "HSE.10", "PLN.MARS", "PLN.SATURN"],
  "edge_type_filter": ["CONTRADICTS", "SUPPORTS"]
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
  "dasha_context_required": true,
  "graph_seed_hints": []
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
  "planets": ["Saturn"],
  "graph_seed_hints": ["PLN.SATURN"]
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
  "planets": ["Saturn"],
  "graph_seed_hints": ["PLN.SATURN"]
}

#### interpretive (UCN section reference)
Query: "Explain section IV.1 of my unified chart narrative."
Output:
{
  "query_plan_id": "00000000-0000-0000-0000-000000000009",
  "query_text": "Explain section IV.1 of my unified chart narrative.",
  "query_class": "interpretive",
  "domains": [],
  "forward_looking": false,
  "audience_tier": "client",
  "tools_authorized": ["msr_sql", "cgm_graph_walk", "vector_search"],
  "history_mode": "synthesized",
  "panel_mode": false,
  "expected_output_shape": "three_interpretation",
  "manifest_fingerprint": "__PLACEHOLDER__",
  "schema_version": "1.0",
  "graph_seed_hints": ["UCN.SEC.IV.1"]
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
10. graph_seed_hints: extract every chart entity named in the query (planet, house, sign,
    nakshatra, yoga, karaka, sensitive point, dasha, divisional placement, UCN section,
    karaka meta-concept) and map each to a valid CGM node ID using the CGM Node ID
    reference below. 0–4 IDs typical; 5+ allowed when query is dense. If the query is
    generic ("explain my chart"), leave empty []. Never invent prefixes or node IDs not
    in the reference.
11. planets: list only planets explicitly named in the query.
12. houses: list only house numbers (1–12) explicitly named in the query.
13. edge_type_filter: optional list of CGM edge types to constrain cgm_graph_walk
    traversal. Use sparingly — only set when the query clearly asks about one type of
    relationship (e.g., dispositor questions → ["DISPOSITED_BY"]; "what supports X" →
    ["SUPPORTS"]). When unsure, leave empty/undefined. A narrow filter that is wrong is
    worse than no filter.
14. cgm_graph_walk inclusion rule: whenever graph_seed_hints is non-empty (you extracted
    at least one chart entity), you MUST include "cgm_graph_walk" in tools_authorized.
    Queries that name specific chart entities always benefit from graph traversal.

## CGM Node ID reference

Valid node-id prefixes the classifier may emit in graph_seed_hints:

- PLN.<PLANET>            — planets. PLN.SUN, PLN.MOON, PLN.MARS, PLN.MERCURY,
                            PLN.JUPITER, PLN.VENUS, PLN.SATURN, PLN.RAHU,
                            PLN.KETU, PLN.LAGNA.
- HSE.<N>                 — houses 1–12. HSE.1, HSE.7, HSE.10.
- SGN.<SIGN>              — signs. SGN.ARIES, SGN.LIBRA, SGN.CAPRICORN, etc.
- NAK.<NAKSHATRA>         — nakshatras with chart placements (15 of 27).
                            Examples: NAK.ASHWINI, NAK.HASTA, NAK.PUSHYA.
- YOG.<NAME>              — named yogas. Examples: YOG.SARASWATI, YOG.LAKSHMI,
                            YOG.GAJAKESARI, YOG.SASHA. Use the yoga's canonical name.
- KRK.<C8|C7>.<KARAKA>    — karakas. C8 = 8-karaka system, C7 = 7-karaka system.
                            Examples: KRK.C8.AK (Atmakaraka), KRK.C8.AmK
                            (Amatyakaraka), KRK.C8.DARA, KRK.C8.PK, KRK.C8.GK.
- SEN.<NAME>              — sensitive points: arudhas, special lagnas, sahams,
                            yogi/avayogi/mandi/gulika. Examples: SEN.AL (Arudha
                            Lagna), SEN.UL (Upapada Lagna), SEN.GULIKA, SEN.YOGI,
                            SEN.SAHAM_VIVAHA.
- DSH.MD.<PLANET>         — Vimshottari mahadashas. DSH.MD.MERCURY, DSH.MD.SATURN,
                            DSH.MD.KETU. Use the dasha lord planet.
- DSH.AD.<PLANET>         — Vimshottari antardashas; same naming.
- DVS.<DIVISIONAL>.<ENT>  — divisional placements. DVS.D9.MOON, DVS.D10.SATURN,
                            DVS.D27.LAGNA, DVS.D60.MERCURY. <ENT> is usually a
                            planet or LAGNA.
- UCN.SEC.<PART>.<SUB>    — UCN section nodes. UCN.SEC.III.4, UCN.SEC.IV.1,
                            UCN.SEC.VI.3. Use only when query references a
                            specific UCN section by name or part number.
- KARAKA.<NAME>           — karaka meta-concepts. KARAKA.DUAL_SYSTEM_DIVERGENCE
                            represents the 7-karaka vs 8-karaka divergence.

## CGM Edge type reference

Valid edge_type values the classifier may emit in edge_type_filter:

- DISPOSITED_BY      — dispositor relationships. Use for "who governs", "what
                       rules", "who is the lord of".
- NAKSHATRA_LORD_IS  — nakshatra lordship. Use for nakshatra-specific queries.
- ASPECTS_3RD        — Vedic 3rd-house aspect (Mars-special).
- ASPECTS_4TH        — 4th-house aspect (Saturn-special).
- ASPECTS_8TH        — 8th-house aspect (Saturn-special).
- SUPPORTS           — pattern-supports relationships from the Discovery Layer.
                       Use for queries asking "what reinforces", "what amplifies".
- CONTRADICTS        — pattern-contradicts relationships. Use for queries asking
                       "what conflicts with", "what challenges", "tensions".
- YOGA_MEMBERSHIP    — planet/house belongs to yoga. Use for yoga drill-downs.
- DASHA_ACTIVATION   — dasha activates pattern. Use for dasha-windowed queries.
- DIVISIONAL_CONFIRMATION — varga corroboration. Use for divisional cross-checks.

Leave edge_type_filter empty [] when the query is general or you are unsure.
A narrow filter when one is wrong is worse than no filter.

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
