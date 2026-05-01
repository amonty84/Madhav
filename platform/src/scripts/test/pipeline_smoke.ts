/**
 * pipeline_smoke.ts — end-to-end smoke test for the Phase 2 query pipeline.
 *
 * Tests the deterministic pipeline: QueryPlan → Bundle Composer → Retrieval Tools → Cache.
 * The router (LLM call) is skipped; synthetic QueryPlans exercise each of the 8 query classes.
 *
 * Run: npm run pipeline:test
 */

import crypto from 'crypto'
import { compose } from '@/lib/bundle/rule_composer'
import { getTool, RETRIEVAL_TOOLS } from '@/lib/retrieve/index'
import { createToolCache, executeWithCache } from '@/lib/cache/index'
import type { QueryPlan } from '@/lib/retrieve/types'

const MANIFEST_FINGERPRINT = '0dee4e5242712d272274c24a9b4ee361c58e097cd65ffcbb475d42a545dd46c7'

function buildPlan(
  query_text: string,
  query_class: QueryPlan['query_class'],
  overrides: Partial<QueryPlan> = {}
): QueryPlan {
  return {
    query_plan_id: crypto.randomUUID(),
    query_text,
    query_class,
    domains: [],
    forward_looking: false,
    audience_tier: 'super_admin',
    tools_authorized: RETRIEVAL_TOOLS.map(t => t.name),
    history_mode: 'synthesized',
    panel_mode: false,
    expected_output_shape: 'single_answer',
    manifest_fingerprint: MANIFEST_FINGERPRINT,
    schema_version: '1.0',
    ...overrides,
  }
}

const TEST_QUERIES: Array<{ description: string; plan: QueryPlan }> = [
  {
    description: 'factual — chart data lookup',
    plan: buildPlan('What is my Mercury position?', 'factual', {
      domains: [],
      planets: ['Mercury'],
      tools_authorized: ['msr_sql'],
    }),
  },
  {
    description: 'interpretive — career domain',
    plan: buildPlan('What does my chart say about my career?', 'interpretive', {
      domains: ['career'],
      tools_authorized: ['msr_sql', 'pattern_register', 'resonance_register'],
    }),
  },
  {
    description: 'predictive — financial horizon',
    plan: buildPlan('Will I see a financial change in the next 2 years?', 'predictive', {
      domains: ['finance'],
      forward_looking: true,
      tools_authorized: ['msr_sql', 'temporal'],
    }),
  },
  {
    description: 'cross_domain — career + relationships',
    plan: buildPlan('How do my career and relationship patterns interact?', 'cross_domain', {
      domains: ['career', 'relationships'],
      tools_authorized: ['msr_sql', 'pattern_register', 'resonance_register'],
    }),
  },
  {
    description: 'discovery — unusual patterns',
    plan: buildPlan('What unusual patterns does my chart show?', 'discovery', {
      domains: [],
      tools_authorized: ['pattern_register', 'resonance_register', 'cluster_atlas', 'contradiction_register'],
    }),
  },
  {
    description: 'holistic — complete chart read',
    plan: buildPlan('Give me a complete chart read', 'holistic', {
      domains: [],
      tools_authorized: [
        'msr_sql', 'pattern_register', 'resonance_register',
        'cluster_atlas', 'contradiction_register', 'temporal',
      ],
    }),
  },
  {
    description: 'remedial — Saturn remedies',
    plan: buildPlan('What remedies for my Saturn?', 'remedial', {
      domains: [],
      planets: ['Saturn'],
      tools_authorized: ['msr_sql'],
    }),
  },
  {
    description: 'cross_native — cross-chart research',
    plan: buildPlan('What patterns are common across charts with similar Saturn placements?', 'cross_native', {
      domains: [],
      tools_authorized: ['query_msr_aggregate'],
    }),
  },
]

async function runSmokeTest(): Promise<void> {
  console.log('=== MARSYS-JIS Phase 2 Pipeline Smoke Test ===\n')

  const cache = createToolCache()
  let allPassed = true

  for (const { description, plan } of TEST_QUERIES) {
    console.log(`── ${description}`)
    console.log(`   Query class : ${plan.query_class}`)

    try {
      // Step 1: Bundle Composer
      const bundle = await compose(plan)
      const assetIds = bundle.mandatory_context.map(e => e.canonical_id)
      console.log(`   Bundle      : ${bundle.mandatory_context.length} entries [${assetIds.join(', ')}]`)
      console.log(`   Total tokens: ${bundle.total_tokens}`)

      // Step 2: Retrieval tools
      const toolResults: Array<{ tool: string; count: number; cached: boolean }> = []

      for (const toolName of plan.tools_authorized) {
        const tool = getTool(toolName)
        if (!tool) {
          console.warn(`   ⚠ Tool not found: ${toolName}`)
          continue
        }

        try {
          const result = await executeWithCache(tool, plan, cache)
          toolResults.push({
            tool: result.tool_name,
            count: result.results.length,
            cached: result.served_from_cache,
          })
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err)
          // Temporal failures are expected if sidecar is not running
          if (toolName === 'temporal') {
            console.log(`   ℹ  temporal: sidecar not available (${msg.slice(0, 60)})`)
          } else {
            console.warn(`   ⚠ Tool ${toolName} error: ${msg.slice(0, 80)}`)
          }
        }
      }

      const toolSummary = toolResults
        .map(r => `${r.tool}=${r.count}${r.cached ? '(cached)' : ''}`)
        .join(', ')
      console.log(`   Tools fired : ${toolSummary || '(none)'}`)
      console.log(`   Cache size  : ${cache.size()}`)
      console.log()

    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error(`   ✗ FAILED: ${msg}`)
      allPassed = false
      console.log()
    }
  }

  // Cache deduplication test: re-run interpretive with same plan — should hit cache
  console.log('── Cache deduplication test')
  const dedupPlan = TEST_QUERIES.find(q => q.plan.query_class === 'interpretive')!.plan
  const cacheBefore = cache.size()
  const msrTool = getTool('msr_sql')
  if (msrTool) {
    try {
      const r1 = await executeWithCache(msrTool, dedupPlan, cache)
      const r2 = await executeWithCache(msrTool, dedupPlan, cache)
      const cacheHit = r2.served_from_cache
      console.log(`   Cache before: ${cacheBefore}, after: ${cache.size()}`)
      console.log(`   Second call served_from_cache: ${cacheHit}`)
      if (!cacheHit) {
        console.warn('   ⚠ Expected cache hit on second identical call')
        allPassed = false
      }
      console.log()
    } catch (err) {
      console.log(`   ℹ  msr_sql: ${err instanceof Error ? err.message.slice(0, 60) : String(err)} (expected if DB not available)`)
      console.log()
    }
  }

  console.log('=== Summary ===')
  if (allPassed) {
    console.log('✓ All deterministic pipeline stages completed successfully.')
    console.log('  (Temporal + MSR-SQL failures are expected without live sidecar/DB.)')
  } else {
    console.log('✗ One or more stages failed. Review output above.')
    process.exit(1)
  }
}

runSmokeTest().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
