/**
 * M3-W1-A2 smoke — Discovery Engine flag gates.
 *
 * For each of the four flag-gated tools, verifies:
 *   (a) flag=false  → results.length === 0 and invocation_params.disabled === true
 *   (b) flag=true   → results.length > 0
 */

import { configService } from '@/lib/config'
import { tool as patternTool } from '@/lib/retrieve/pattern_register'
import { tool as contradictionTool } from '@/lib/retrieve/contradiction_register'
import { tool as resonanceTool } from '@/lib/retrieve/resonance_register'
import { tool as clusterTool } from '@/lib/retrieve/cluster_atlas'
import type { QueryPlan, RetrievalTool } from '@/lib/retrieve/types'
import type { FeatureFlag } from '@/lib/config'

const minimalPlan: QueryPlan = {
  query_plan_id: 'smoke-m3a2',
  query_text: 'smoke test',
  query_class: 'discovery',
  domains: [],
  forward_looking: false,
  audience_tier: 'super_admin',
  tools_authorized: [],
  history_mode: 'synthesized',
  panel_mode: false,
  expected_output_shape: 'single_answer',
  manifest_fingerprint: 'smoke',
  schema_version: '1.0',
}

type Spec = { name: string; flag: FeatureFlag; tool: RetrievalTool }
const specs: Spec[] = [
  { name: 'pattern_register', flag: 'DISCOVERY_PATTERN_ENABLED', tool: patternTool },
  { name: 'contradiction_register', flag: 'DISCOVERY_CONTRADICTION_ENABLED', tool: contradictionTool },
  { name: 'resonance_register', flag: 'DISCOVERY_RESONANCE_ENABLED', tool: resonanceTool },
  { name: 'cluster_atlas', flag: 'DISCOVERY_CLUSTER_ENABLED', tool: clusterTool },
]

async function main() {
  let failures = 0
  for (const spec of specs) {
    configService.setFlag(spec.flag, false)
    const off = await spec.tool.retrieve(minimalPlan)
    const params = off.invocation_params as Record<string, unknown>
    const offOk = off.results.length === 0 && params.disabled === true
    console.log(
      `[${spec.name}] flag=false: results=${off.results.length}, disabled=${params.disabled}, reason=${params.reason} -> ${offOk ? 'PASS' : 'FAIL'}`
    )
    if (!offOk) failures++

    configService.setFlag(spec.flag, true)
    const on = await spec.tool.retrieve(minimalPlan)
    const onOk = on.results.length > 0
    console.log(`[${spec.name}] flag=true:  results=${on.results.length} -> ${onOk ? 'PASS' : 'FAIL'}`)
    if (!onOk) failures++
  }

  console.log(`\nfailures=${failures}`)
  process.exit(failures === 0 ? 0 : 1)
}

main().catch(err => {
  console.error('smoke harness threw:', err)
  process.exit(2)
})
