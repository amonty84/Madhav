/**
 * golden_queries.ts — MARSYS-JIS answer eval golden set
 *
 * 15 queries covering factual, interpretive, holistic, discovery, and
 * predictive categories. Used by answer_eval.ts to score synthesis answers
 * against the criteria defined in SYNTHESIS_PROMPT_v1_0.md §6.
 *
 * Each query specifies:
 *   - id: unique identifier
 *   - query: the natural language question
 *   - category: query class
 *   - expected_layers: which L2.5 artifacts should be present in a compliant answer
 *   - must_not_fabricate: values that must come from L1, not be invented
 *   - min_citation_count: minimum (→ ...) citations expected
 */

export type QueryCategory = 'factual' | 'interpretive' | 'predictive' | 'holistic' | 'discovery'

export interface GoldenQuery {
  id: string
  query: string
  category: QueryCategory
  expected_layers: string[]
  must_not_fabricate: string[]
  min_citation_count: number
}

export const GOLDEN_QUERIES: GoldenQuery[] = [

  // ── Factual queries (3) ────────────────────────────────────────────────────
  // These test L1 grounding: the answer should cite FORENSIC data directly.
  // B.10: any numerical value (degrees, house numbers) must be from L1.

  {
    id: 'GQ-001',
    query: 'What is my ascendant and which planets are in the ascendant house?',
    category: 'factual',
    expected_layers: ['MSR', 'FORENSIC'],
    must_not_fabricate: ['ascendant degree', 'ascendant sign', 'planets in lagna'],
    min_citation_count: 2,
  },
  {
    id: 'GQ-002',
    query: 'Which planets are in the 7th house in my birth chart, and what are their degrees?',
    category: 'factual',
    expected_layers: ['MSR', 'FORENSIC'],
    must_not_fabricate: ['7th house planets', 'planetary degrees in 7th', 'house lord of 7th'],
    min_citation_count: 2,
  },
  {
    id: 'GQ-003',
    query: 'What is my current mahadasha and antardasha, and when does the current period end?',
    category: 'factual',
    expected_layers: ['MSR', 'FORENSIC'],
    must_not_fabricate: ['mahadasha lord', 'antardasha lord', 'dasha period end date'],
    min_citation_count: 2,
  },

  // ── Interpretive queries (3) ───────────────────────────────────────────────
  // These test L2.5 engagement: the answer should draw on synthesis signals,
  // not just repeat L1 facts. B.11: must reference multiple L2.5 artifacts.

  {
    id: 'GQ-004',
    query: 'What does my Saturn placement indicate for career and professional life?',
    category: 'interpretive',
    expected_layers: ['MSR', 'CGM', 'UCN'],
    must_not_fabricate: ['Saturn degree', 'Saturn nakshatra', 'Saturn house'],
    min_citation_count: 3,
  },
  {
    id: 'GQ-005',
    query: 'How does the relationship between my 4th and 10th house lords manifest in my life themes?',
    category: 'interpretive',
    expected_layers: ['MSR', 'CGM', 'CDLM'],
    must_not_fabricate: ['4th house lord', '10th house lord', 'aspect relationships'],
    min_citation_count: 3,
  },
  {
    id: 'GQ-006',
    query: 'What does my Jupiter placement reveal about wisdom, spirituality, and dharmic orientation?',
    category: 'interpretive',
    expected_layers: ['MSR', 'UCN', 'RM'],
    must_not_fabricate: ['Jupiter sign', 'Jupiter house', 'Jupiter nakshatra'],
    min_citation_count: 3,
  },

  // ── Holistic queries (3) ──────────────────────────────────────────────────
  // These are the most demanding B.11 test. The answer MUST traverse all five
  // L2.5 artifacts and surface cross-domain connections. min_citation_count is
  // highest here.

  {
    id: 'GQ-007',
    query: 'What are the dominant themes in my chart — the patterns that recur across different life domains?',
    category: 'holistic',
    expected_layers: ['MSR', 'UCN', 'CDLM', 'CGM', 'RM'],
    must_not_fabricate: ['yogas', 'strength scores', 'cross-domain linkage IDs'],
    min_citation_count: 5,
  },
  {
    id: 'GQ-008',
    query: 'What are the most important tensions or contradictions in my chart — places where different planetary influences pull in opposing directions?',
    category: 'holistic',
    expected_layers: ['MSR', 'UCN', 'CDLM', 'CGM'],
    must_not_fabricate: ['conflicting yogas', 'opposition aspects', 'planetary war data'],
    min_citation_count: 5,
  },
  {
    id: 'GQ-009',
    query: 'How do the themes of my chart relate to each other as a coherent system? What is the central organizing pattern?',
    category: 'holistic',
    expected_layers: ['MSR', 'UCN', 'CGM', 'RM'],
    must_not_fabricate: ['chart synthesis scores', 'central theme IDs', 'causal chain IDs'],
    min_citation_count: 5,
  },

  // ── Discovery queries (3) ─────────────────────────────────────────────────
  // These test proactive insight generation: the LLM should surface patterns
  // the user hasn't specifically asked about, drawing from L2.5 discovery signals.

  {
    id: 'GQ-010',
    query: 'What is most interesting or unusual about my chart that I might not know or have overlooked?',
    category: 'discovery',
    expected_layers: ['MSR', 'CGM', 'RM'],
    must_not_fabricate: ['rare yoga data', 'exceptional placement data', 'statistical rarity scores'],
    min_citation_count: 4,
  },
  {
    id: 'GQ-011',
    query: 'What hidden strengths or underappreciated resources does my chart contain?',
    category: 'discovery',
    expected_layers: ['MSR', 'UCN', 'RM'],
    must_not_fabricate: ['strength scores', 'dig bala values', 'vargottama data'],
    min_citation_count: 4,
  },
  {
    id: 'GQ-012',
    query: 'What patterns in my chart have been consistent across the life events I have experienced so far?',
    category: 'discovery',
    expected_layers: ['MSR', 'CGM', 'CDLM'],
    must_not_fabricate: ['event correlation scores', 'dasha timing for past events', 'transit data'],
    min_citation_count: 4,
  },

  // ── Predictive queries (3) ────────────────────────────────────────────────
  // These test calibration: the LLM must use probabilistic framing.
  // B.10: timing dates must not be fabricated.

  {
    id: 'GQ-013',
    query: 'What themes and tendencies might emerge in the next 6 months based on my current dasha and transits?',
    category: 'predictive',
    expected_layers: ['MSR', 'CGM', 'FORENSIC'],
    must_not_fabricate: ['transit degrees', 'dasha sub-period dates', 'aspect exactness dates'],
    min_citation_count: 3,
  },
  {
    id: 'GQ-014',
    query: 'What does my chart suggest about the timing and nature of significant career transitions?',
    category: 'predictive',
    expected_layers: ['MSR', 'UCN', 'CGM'],
    must_not_fabricate: ['career event dates', 'specific year predictions', 'transit exact dates'],
    min_citation_count: 3,
  },
  {
    id: 'GQ-015',
    query: 'Based on my dasha sequence and the patterns already established in my life, what developmental phases might be ahead?',
    category: 'predictive',
    expected_layers: ['MSR', 'CGM', 'RM', 'FORENSIC'],
    must_not_fabricate: ['future dasha dates', 'planetary return dates', 'progression positions'],
    min_citation_count: 3,
  },
]

/** Min citation counts by category (used by eval harness) */
export const MIN_CITATIONS_BY_CATEGORY: Record<QueryCategory, number> = {
  factual:      2,
  interpretive: 3,
  holistic:     5,
  predictive:   3,
  discovery:    4,
}
