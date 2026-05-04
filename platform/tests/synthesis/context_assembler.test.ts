/**
 * context_assembler.test.ts — assembleContext() unit tests
 *
 * Tests token budgeting, priority ordering, required layer enforcement,
 * section headers, and B.11 compliance integration.
 */
import { describe, it, expect } from 'vitest'

vi.mock('server-only', () => ({}))

import { assembleContext, type LayerContext } from '@/lib/synthesis/context_assembler'

function makeLayer(
  layer: 'L1' | 'L2_5' | 'L3',
  artifactId: string,
  content: string,
  priority: number = 2,
): LayerContext {
  return {
    layer,
    artifactId,
    content,
    tokenEstimate: Math.ceil(content.length / 4),
    priority,
  }
}

const MSR_LAYER   = makeLayer('L2_5', 'MSR', 'Master Signal Register signals. MSR content.', 1)
const UCN_LAYER   = makeLayer('L2_5', 'UCN', 'Unified Chart Narrative. UCN content.', 1)
const CGM_LAYER   = makeLayer('L2_5', 'CGM', 'Causal Graph Model relationships. CGM content.', 1)
const CDLM_LAYER  = makeLayer('L2_5', 'CDLM', 'Cross-Domain Linkage Matrix data.', 2)
const RM_LAYER    = makeLayer('L2_5', 'RM', 'Resonance Map patterns.', 3)
const L1_LAYER    = makeLayer('L1', 'FORENSIC', 'FORENSIC chart facts content.', 1)
const L3_LAYER    = makeLayer('L3', 'query_retrieval', 'Query-specific retrieval results.', 2)

describe('assembleContext — all layers within budget', () => {
  it('includes all layers when within token budget', () => {
    const layers = [MSR_LAYER, UCN_LAYER, CGM_LAYER, CDLM_LAYER, RM_LAYER]
    const result = assembleContext(layers, { maxTokens: 10_000 })

    expect(result.includedArtifacts).toContain('MSR')
    expect(result.includedArtifacts).toContain('UCN')
    expect(result.includedArtifacts).toContain('CGM')
    expect(result.includedArtifacts).toContain('CDLM')
    expect(result.includedArtifacts).toContain('RM')
    expect(result.droppedArtifacts).toHaveLength(0)
  })

  it('totalTokenEstimate matches sum of included layers', () => {
    const layers = [MSR_LAYER, UCN_LAYER, CGM_LAYER]
    const result = assembleContext(layers, { maxTokens: 10_000 })
    const expected = layers.reduce((sum, l) => sum + l.tokenEstimate, 0)
    expect(result.totalTokenEstimate).toBe(expected)
  })
})

describe('assembleContext — priority-based dropping when over budget', () => {
  it('drops priority-3 layers before priority-1 when budget is tight', () => {
    // Budget just enough for required layers (MSR, UCN, CGM) + CDLM but not RM (priority 3)
    const requiredTokens = MSR_LAYER.tokenEstimate + UCN_LAYER.tokenEstimate + CGM_LAYER.tokenEstimate
    const cdlmTokens = CDLM_LAYER.tokenEstimate
    const tightBudget = requiredTokens + cdlmTokens + 5 // just enough for CDLM, not RM

    const layers = [MSR_LAYER, UCN_LAYER, CGM_LAYER, CDLM_LAYER, RM_LAYER]
    const result = assembleContext(layers, { maxTokens: tightBudget })

    expect(result.includedArtifacts).toContain('MSR')
    expect(result.includedArtifacts).toContain('UCN')
    expect(result.includedArtifacts).toContain('CGM')
    expect(result.droppedArtifacts).toContain('RM')
  })
})

describe('assembleContext — required layers always included', () => {
  it('includes required layers even when they exceed the budget', () => {
    // Extremely tight budget — only 5 tokens, but MSR+UCN+CGM are required
    const layers = [MSR_LAYER, UCN_LAYER, CGM_LAYER, RM_LAYER]
    const result = assembleContext(layers, {
      maxTokens: 5,
      requiredLayers: ['MSR', 'UCN', 'CGM'],
    })

    expect(result.includedArtifacts).toContain('MSR')
    expect(result.includedArtifacts).toContain('UCN')
    expect(result.includedArtifacts).toContain('CGM')
    // RM should be dropped (not required, over budget)
    expect(result.droppedArtifacts).toContain('RM')
  })
})

describe('assembleContext — section headers', () => {
  it('assembled string contains L2.5 section header when L2.5 layers present', () => {
    const result = assembleContext([MSR_LAYER, UCN_LAYER, CGM_LAYER], { maxTokens: 10_000 })
    expect(result.assembledContext).toContain('L2.5: HOLISTIC SYNTHESIS')
  })

  it('assembled string contains L1 section header when L1 layer present', () => {
    const result = assembleContext([L1_LAYER, MSR_LAYER, UCN_LAYER, CGM_LAYER], { maxTokens: 10_000 })
    expect(result.assembledContext).toContain('L1: CHART FACTS')
  })

  it('assembled string contains L3 section header when L3 layer present', () => {
    const result = assembleContext([MSR_LAYER, UCN_LAYER, CGM_LAYER, L3_LAYER], { maxTokens: 10_000 })
    expect(result.assembledContext).toContain('L3: QUERY RETRIEVAL')
  })

  it('section headers are absent when no layers of that type are included', () => {
    const result = assembleContext([MSR_LAYER, UCN_LAYER, CGM_LAYER], { maxTokens: 10_000 })
    expect(result.assembledContext).not.toContain('L3: QUERY RETRIEVAL')
  })
})

describe('assembleContext — b11Compliant', () => {
  it('b11Compliant is true when MSR, UCN, and CGM are present', () => {
    const result = assembleContext([MSR_LAYER, UCN_LAYER, CGM_LAYER], { maxTokens: 10_000 })
    expect(result.b11Compliant).toBe(true)
  })

  it('b11Compliant is false when CGM is missing from assembled context', () => {
    // CGM is not in requiredLayers for this test, and budget is too tight to include it
    const smallLayer = makeLayer('L2_5', 'MSR', 'MSR text', 1)
    const result = assembleContext(
      [smallLayer, makeLayer('L2_5', 'UCN', 'UCN text', 1)],
      { maxTokens: 10_000, requiredLayers: ['MSR', 'UCN'] },
    )
    // CGM is not present in content → b11Compliant false
    expect(result.b11Compliant).toBe(false)
  })
})
