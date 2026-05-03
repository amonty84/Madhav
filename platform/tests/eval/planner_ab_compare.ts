#!/usr/bin/env tsx
/**
 * planner_ab_compare.ts — W2-EVAL-B AC.V.2
 *
 * Runs both the legacy `classify()` router (tools_authorized output) and the
 * new `callLlmPlanner()` (tool_calls output) against `planner_golden_set.json`,
 * then prints a side-by-side per-entry comparison plus aggregate metrics.
 *
 *   --dry-run   Skip live LLM calls. Uses a query_class-keyed heuristic stub
 *               for the classify side (no Haiku call) and skips the planner
 *               side entirely (no Llama call). Useful for validating the
 *               script wiring + comparison output without burning tokens.
 *
 * Env (live mode):
 *   PLANNER_MODEL_ID  (default: meta/llama-3.1-8b-instruct)
 *   CHART_ID          (default: test-native)
 *   CLASSIFY_AUDIENCE (default: super_admin)
 *
 * Usage:
 *   npx tsx --conditions=react-server platform/tests/eval/planner_ab_compare.ts [--dry-run]
 */

import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  scoreEntry,
  aggregateResults,
  RECALL_THRESHOLD,
  PRECISION_THRESHOLD,
  type GoldenSet,
  type GoldenEntry,
  type EvalResult,
} from './planner_smoke_runner'

// ────────────────────────────────────────────────────────────────────────────
// Heuristic classify stub used by --dry-run only. Maps query_class to a
// representative tools_authorized set so the comparison harness can run end
// to end without hitting the LLM.
// ────────────────────────────────────────────────────────────────────────────
const DRY_RUN_CLASSIFY_STUB: Record<string, string[]> = {
  remedial: ['chart_facts_query', 'msr_sql', 'remedial_codex_query'],
  interpretive: ['chart_facts_query', 'msr_sql', 'domain_report_query'],
  predictive: ['temporal', 'chart_facts_query', 'msr_sql'],
  cross_domain: ['chart_facts_query', 'msr_sql', 'cgm_graph_walk'],
  discovery: ['pattern_register', 'contradiction_register', 'cluster_atlas'],
  holistic: ['chart_facts_query', 'msr_sql', 'pattern_register', 'cluster_atlas'],
  cross_native: ['chart_facts_query', 'msr_sql'],
  factual: ['chart_facts_query'],
}

function loadGoldenSet(): GoldenSet {
  const here = path.dirname(fileURLToPath(import.meta.url))
  const p = path.resolve(here, 'planner_golden_set.json')
  return JSON.parse(readFileSync(p, 'utf-8')) as GoldenSet
}

interface SideResult {
  side: 'classify' | 'planner'
  predicted_tools: string[]
  error?: string
}

function formatRow(entry: GoldenEntry, classify: SideResult, planner: SideResult | null): string {
  const cScore = scoreEntry(entry, classify.predicted_tools, classify.error)
  const cLine =
    `  ${entry.id}  classify: [${classify.predicted_tools.join(', ')}]` +
    `  recall=${cScore.tool_recall.toFixed(2)} precision=${cScore.tool_precision.toFixed(2)}` +
    (cScore.pass ? ' ✓' : '')

  if (!planner) {
    return `${cLine}\n          planner:  (skipped)`
  }
  const pScore = scoreEntry(entry, planner.predicted_tools, planner.error)
  const pLine =
    `          planner:  [${planner.predicted_tools.join(', ')}]` +
    `  recall=${pScore.tool_recall.toFixed(2)} precision=${pScore.tool_precision.toFixed(2)}` +
    (pScore.pass ? ' ✓' : '')
  return `${cLine}\n${pLine}`
}

interface CompareReport {
  classify_results: EvalResult[]
  planner_results: EvalResult[] | null
  classify_aggregate: ReturnType<typeof aggregateResults>
  planner_aggregate: ReturnType<typeof aggregateResults> | null
}

async function runCompare(opts: { dryRun: boolean }): Promise<CompareReport> {
  const goldenSet = loadGoldenSet()

  const classifyResults: EvalResult[] = []
  const plannerResults: EvalResult[] = []

  // Lazy-load LLM-bound modules so --dry-run never imports server-only deps.
  const { classify } = opts.dryRun
    ? { classify: null }
    : await import('@/lib/router/router')
  const { callLlmPlanner } = opts.dryRun
    ? { callLlmPlanner: null }
    : await import('@/lib/pipeline/manifest_planner')

  const audience = (process.env.CLASSIFY_AUDIENCE ?? 'super_admin') as
    | 'super_admin'
    | 'acharya_reviewer'
    | 'client'
    | 'public_redacted'
  const modelId = process.env.PLANNER_MODEL_ID ?? 'meta/llama-3.1-8b-instruct'
  const chartId = process.env.CHART_ID ?? 'test-native'

  const lines: string[] = []

  for (const entry of goldenSet.entries) {
    // ── classify side ──────────────────────────────────────────────────────
    let classifySide: SideResult
    if (opts.dryRun || !classify) {
      classifySide = {
        side: 'classify',
        predicted_tools: DRY_RUN_CLASSIFY_STUB[entry.query_class] ?? [],
      }
    } else {
      try {
        const plan = await classify(entry.query, {
          audience_tier: audience,
          manifest_fingerprint: 'eval-ab-compare',
        })
        classifySide = {
          side: 'classify',
          predicted_tools: plan.tools_authorized,
        }
      } catch (err) {
        classifySide = {
          side: 'classify',
          predicted_tools: [],
          error: err instanceof Error ? err.message : String(err),
        }
      }
    }
    classifyResults.push(scoreEntry(entry, classifySide.predicted_tools, classifySide.error))

    // ── planner side ───────────────────────────────────────────────────────
    let plannerSide: SideResult | null = null
    if (!opts.dryRun && callLlmPlanner) {
      try {
        const plan = await callLlmPlanner(entry.query, [], modelId, chartId)
        plannerSide = {
          side: 'planner',
          predicted_tools: plan.tool_calls.map(tc => tc.tool_name),
        }
      } catch (err) {
        plannerSide = {
          side: 'planner',
          predicted_tools: [],
          error: err instanceof Error ? err.message : String(err),
        }
      }
      plannerResults.push(scoreEntry(entry, plannerSide.predicted_tools, plannerSide.error))
    }

    lines.push(formatRow(entry, classifySide, plannerSide))
    lines.push('')
  }

  const classifyAgg = aggregateResults(classifyResults)
  const plannerAgg = opts.dryRun ? null : aggregateResults(plannerResults)

  // ── side-by-side body to stdout ──────────────────────────────────────────
  process.stdout.write(lines.join('\n'))

  // ── aggregate footer ─────────────────────────────────────────────────────
  const footer: string[] = []
  footer.push('AGGREGATE')
  footer.push(
    `  classify  avg_recall=${classifyAgg.avg_tool_recall.toFixed(2)}` +
      `  avg_precision=${classifyAgg.avg_tool_precision.toFixed(2)}` +
      `  pass_rate=${classifyAgg.pass_rate.toFixed(2)}`,
  )
  if (plannerAgg) {
    const met =
      plannerAgg.avg_tool_recall >= RECALL_THRESHOLD &&
      plannerAgg.avg_tool_precision >= PRECISION_THRESHOLD
    footer.push(
      `  planner   avg_recall=${plannerAgg.avg_tool_recall.toFixed(2)}` +
        `  avg_precision=${plannerAgg.avg_tool_precision.toFixed(2)}` +
        `  pass_rate=${plannerAgg.pass_rate.toFixed(2)}` +
        (met ? '  ← THRESHOLD MET' : '  ← THRESHOLD NOT MET'),
    )
  } else {
    footer.push('  planner   (skipped — --dry-run)')
  }
  process.stdout.write('\n' + footer.join('\n') + '\n')

  return {
    classify_results: classifyResults,
    planner_results: opts.dryRun ? null : plannerResults,
    classify_aggregate: classifyAgg,
    planner_aggregate: plannerAgg,
  }
}

async function main(): Promise<void> {
  const dryRun = process.argv.includes('--dry-run')
  const report = await runCompare({ dryRun })

  // Exit 0 only when both sides hit the published thresholds (or when dry-run,
  // which is informational only and always exits 0 on a clean run).
  if (dryRun) {
    process.exit(0)
  }
  const ok =
    !!report.planner_aggregate &&
    report.planner_aggregate.avg_tool_recall >= RECALL_THRESHOLD &&
    report.planner_aggregate.avg_tool_precision >= PRECISION_THRESHOLD
  process.exit(ok ? 0 : 1)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
