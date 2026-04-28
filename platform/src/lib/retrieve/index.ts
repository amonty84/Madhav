/**
 * MARSYS-JIS Retrieval tool registry
 *
 * Exports all ten retrieval tools and the RETRIEVAL_TOOLS registry array.
 * Phase 2: msr_sql, pattern_register, resonance_register, cluster_atlas,
 *           contradiction_register, temporal, query_msr_aggregate (7 tools)
 * Phase 9: cgm_graph_walk, manifest_query, vector_search (3 tools; vector_search is secondary)
 */

import * as msrSql from './msr_sql'
import * as patternRegister from './pattern_register'
import * as resonanceRegister from './resonance_register'
import * as clusterAtlas from './cluster_atlas'
import * as contradictionRegister from './contradiction_register'
import * as temporal from './temporal'
import * as queryMsrAggregate from './query_msr_aggregate'
import * as cgmGraphWalk from './cgm_graph_walk'
import * as manifestQuery from './manifest_query'
import * as vectorSearch from './vector_search'

export * from './types'
import type { RetrievalTool } from './types'

export const RETRIEVAL_TOOLS: RetrievalTool[] = [
  msrSql.tool,
  patternRegister.tool,
  resonanceRegister.tool,
  clusterAtlas.tool,
  contradictionRegister.tool,
  temporal.tool,
  queryMsrAggregate.tool,
  cgmGraphWalk.tool,
  manifestQuery.tool,
  vectorSearch.tool,
]

export function getTool(name: string): RetrievalTool | undefined {
  return RETRIEVAL_TOOLS.find(t => t.name === name)
}
