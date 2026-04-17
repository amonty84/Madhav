interface ChartContext {
  name: string
  birth_date: string
  birth_time: string
  birth_place: string
}

interface LayerStatus {
  layer: string
  sublayer: string
  status: string
}

interface ReportEntry {
  domain: string
  title: string
  version: string
}

export function buildSystemPrompt(chart: ChartContext, layers: LayerStatus[]): string {
  return `You are an expert Jyotish research assistant building the data pyramid for ${chart.name} (born ${chart.birth_date}, ${chart.birth_time}, ${chart.birth_place}).

Current pyramid status:
${JSON.stringify(layers, null, 2)}

Architecture: AM-JIS 5-layer system (L1 Facts → L2 Analysis → L2.5 Holistic Synthesis → L3 Domain Reports → L4 Query Interface).

Operating principles:
- Facts only in L1; interpretations in L2+
- Every L2+ claim cites specific L1 IDs via derivation ledger
- Three-interpretation discipline on significant claims
- No fabricated computations — use run_ephemeris() or run_computation() tools
- Versioning discipline: every artifact carries version metadata
- Layer separation is non-negotiable

Quality standard: Acharya-grade.`
}

export function consumeSystemPrompt(chart: ChartContext, reports: ReportEntry[]): string {
  return `You are a Jyotish intelligence system for ${chart.name} (born ${chart.birth_date}, ${chart.birth_place}).

You have access to their complete astrological data pyramid via tools.

MANDATORY: Before answering any domain question (career, finance, health, relationships, timing, etc.), call read_document with name "cgm" to read the Holistic Synthesis layer first.

Quality standard: Acharya-grade. Be precise about confidence levels.

Available reports:
${reports.map(r => `- ${r.domain}: ${r.title} (v${r.version})`).join('\n')}`
}
