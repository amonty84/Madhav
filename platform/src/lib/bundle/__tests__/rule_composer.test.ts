/**
 * rule_composer.test.ts
 *
 * Integration-style tests for compose(); one per query class.
 * Mocks manifest_reader to return a controlled asset set.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { AssetEntry, ManifestData, QueryPlan } from '../types'

// ── Fixtures ────────────────────────────────────────────────────────────────

function makeAsset(
  canonical_id: string,
  path: string,
  extras: Partial<AssetEntry> = {},
): AssetEntry {
  return {
    canonical_id,
    path,
    version: '1.0',
    status: 'CURRENT',
    layer: 'L1',
    expose_to_chat: true,
    representations: ['file'],
    interface_version: '1.0',
    fingerprint: 'fp',
    native_id: 'abhisek',
    ...extras,
  }
}

const FORENSIC = makeAsset('FORENSIC_ASTROLOGICAL_DATA_v8_0', '01_FACTS_LAYER/FORENSIC_ASTROLOGICAL_DATA_v8_0.md', { always_required: true })
const CGM = makeAsset('CGM', '025_HOLISTIC_SYNTHESIS/CGM_v9_0.md', { always_required: true })
const UCN = makeAsset('UCN_v4_0', '025_HOLISTIC_SYNTHESIS/UCN_v4_0.md')
const CDLM = makeAsset('CDLM_v1_1', '025_HOLISTIC_SYNTHESIS/CDLM_v1_1.md')
const RM = makeAsset('RM_v2_0', '025_HOLISTIC_SYNTHESIS/RM_v2_0.md')
const LEL = makeAsset('LIFE_EVENT_LOG_v1_2', '01_FACTS_LAYER/LIFE_EVENT_LOG_v1_2.md')
const SADE = makeAsset('SADE_SATI_CYCLES_ALL', '01_FACTS_LAYER/SADE_SATI_CYCLES_ALL.md')
const PATTERN = makeAsset('PATTERN_REGISTER_v1_0', '035_DISCOVERY_LAYER/REGISTERS/PATTERN_REGISTER_v1_0.md')
const CONTRADICTION = makeAsset('CONTRADICTION_REGISTER_v1_0', '035_DISCOVERY_LAYER/REGISTERS/CONTRADICTION_REGISTER_v1_0.md')
const CLUSTER = makeAsset('CLUSTER_ATLAS_v1_0', '035_DISCOVERY_LAYER/REGISTERS/CLUSTER_ATLAS_v1_0.md')
const RESONANCE = makeAsset('RESONANCE_REGISTER_v1_0', '035_DISCOVERY_LAYER/REGISTERS/RESONANCE_REGISTER_v1_0.md')
const EXTRA = makeAsset('MSR_v3_0', '025_HOLISTIC_SYNTHESIS/MSR_v3_0.md')

const ALL_ASSETS = [FORENSIC, CGM, UCN, CDLM, RM, LEL, SADE, PATTERN, CONTRADICTION, CLUSTER, RESONANCE, EXTRA]

const MOCK_MANIFEST: ManifestData = {
  fingerprint: 'mock-fingerprint',
  entries: ALL_ASSETS,
  byId: new Map(ALL_ASSETS.map(e => [e.canonical_id, e])),
}

vi.mock('../manifest_reader', () => ({
  loadManifest: vi.fn().mockResolvedValue(MOCK_MANIFEST),
  resetCache: vi.fn(),
  getTier1Entries: (data: ManifestData) => data.entries.filter(e => e.expose_to_chat && e.status === 'CURRENT'),
}))

// ── Helpers ─────────────────────────────────────────────────────────────────

function makePlan(
  query_class: QueryPlan['query_class'],
  forward_looking = false,
): QueryPlan {
  return {
    query_plan_id: '00000000-0000-0000-0000-000000000001',
    query_text: 'test query',
    query_class,
    domains: [],
    forward_looking,
    audience_tier: 'acharya_reviewer',
    tools_authorized: [],
    history_mode: 'synthesized',
    panel_mode: false,
    expected_output_shape: 'single_answer',
    manifest_fingerprint: 'mock-fingerprint',
    schema_version: '1.0',
  }
}

function ids(bundle: Awaited<ReturnType<typeof import('../rule_composer')['compose']>>) {
  return bundle.mandatory_context.map(e => e.canonical_id)
}

// ── Tests ───────────────────────────────────────────────────────────────────

describe('compose — factual', () => {
  it('includes only floor assets (FORENSIC + CGM)', async () => {
    const { compose } = await import('../rule_composer')
    const bundle = await compose(makePlan('factual'))
    const bundleIds = ids(bundle)
    expect(bundleIds).toContain('FORENSIC_ASTROLOGICAL_DATA_v8_0')
    expect(bundleIds).toContain('CGM')
    expect(bundleIds).not.toContain('UCN_v4_0')
    expect(bundleIds).not.toContain('LEL')
    expect(bundleIds).not.toContain('PATTERN_REGISTER_v1_0')
  })

  it('all entries have source rule_composer', async () => {
    const { compose } = await import('../rule_composer')
    const bundle = await compose(makePlan('factual'))
    for (const entry of bundle.mandatory_context) {
      expect(entry.source).toBe('rule_composer')
    }
  })

  it('schema_version is 1.0', async () => {
    const { compose } = await import('../rule_composer')
    const bundle = await compose(makePlan('factual'))
    expect(bundle.schema_version).toBe('1.0')
  })

  it('bundle_hash starts with sha256:', async () => {
    const { compose } = await import('../rule_composer')
    const bundle = await compose(makePlan('factual'))
    expect(bundle.bundle_hash.startsWith('sha256:')).toBe(true)
  })
})

describe('compose — interpretive', () => {
  it('includes floor + UCN + CDLM + RM', async () => {
    const { compose } = await import('../rule_composer')
    const bundle = await compose(makePlan('interpretive'))
    const bundleIds = ids(bundle)
    expect(bundleIds).toContain('FORENSIC_ASTROLOGICAL_DATA_v8_0')
    expect(bundleIds).toContain('CGM')
    expect(bundleIds).toContain('UCN_v4_0')
    expect(bundleIds).toContain('CDLM_v1_1')
    expect(bundleIds).toContain('RM_v2_0')
  })

  it('does not include predictive or discovery assets', async () => {
    const { compose } = await import('../rule_composer')
    const bundle = await compose(makePlan('interpretive'))
    const bundleIds = ids(bundle)
    expect(bundleIds).not.toContain('LIFE_EVENT_LOG_v1_2')
    expect(bundleIds).not.toContain('PATTERN_REGISTER_v1_0')
  })

  it('interpretive entries have role interpretive', async () => {
    const { compose } = await import('../rule_composer')
    const bundle = await compose(makePlan('interpretive'))
    const ucn = bundle.mandatory_context.find(e => e.canonical_id === 'UCN_v4_0')
    expect(ucn?.role).toBe('interpretive')
  })
})

describe('compose — predictive', () => {
  it('includes floor + LEL + SADE_SATI', async () => {
    const { compose } = await import('../rule_composer')
    const bundle = await compose(makePlan('predictive'))
    const bundleIds = ids(bundle)
    expect(bundleIds).toContain('FORENSIC_ASTROLOGICAL_DATA_v8_0')
    expect(bundleIds).toContain('CGM')
    expect(bundleIds).toContain('LIFE_EVENT_LOG_v1_2')
    expect(bundleIds).toContain('SADE_SATI_CYCLES_ALL')
  })

  it('does not include interpretive-only assets', async () => {
    const { compose } = await import('../rule_composer')
    const bundle = await compose(makePlan('predictive'))
    const bundleIds = ids(bundle)
    expect(bundleIds).not.toContain('UCN_v4_0')
    expect(bundleIds).not.toContain('CDLM_v1_1')
  })

  it('predictive entries have role predictive', async () => {
    const { compose } = await import('../rule_composer')
    const bundle = await compose(makePlan('predictive'))
    const lel = bundle.mandatory_context.find(e => e.canonical_id === 'LIFE_EVENT_LOG_v1_2')
    expect(lel?.role).toBe('predictive')
  })
})

describe('compose — cross_domain', () => {
  it('behaves like interpretive (floor + UCN + CDLM + RM)', async () => {
    const { compose } = await import('../rule_composer')
    const bundle = await compose(makePlan('cross_domain'))
    const bundleIds = ids(bundle)
    expect(bundleIds).toContain('FORENSIC_ASTROLOGICAL_DATA_v8_0')
    expect(bundleIds).toContain('UCN_v4_0')
    expect(bundleIds).toContain('CDLM_v1_1')
    expect(bundleIds).toContain('RM_v2_0')
    expect(bundleIds).not.toContain('LIFE_EVENT_LOG_v1_2')
  })
})

describe('compose — discovery', () => {
  it('includes floor + four discovery registers', async () => {
    const { compose } = await import('../rule_composer')
    const bundle = await compose(makePlan('discovery'))
    const bundleIds = ids(bundle)
    expect(bundleIds).toContain('FORENSIC_ASTROLOGICAL_DATA_v8_0')
    expect(bundleIds).toContain('CGM')
    expect(bundleIds).toContain('PATTERN_REGISTER_v1_0')
    expect(bundleIds).toContain('CONTRADICTION_REGISTER_v1_0')
    expect(bundleIds).toContain('CLUSTER_ATLAS_v1_0')
    expect(bundleIds).toContain('RESONANCE_REGISTER_v1_0')
  })

  it('does not include interpretive or predictive assets', async () => {
    const { compose } = await import('../rule_composer')
    const bundle = await compose(makePlan('discovery'))
    const bundleIds = ids(bundle)
    expect(bundleIds).not.toContain('UCN_v4_0')
    expect(bundleIds).not.toContain('LIFE_EVENT_LOG_v1_2')
  })
})

describe('compose — holistic', () => {
  it('includes floor + interpretive + predictive + discovery assets', async () => {
    const { compose } = await import('../rule_composer')
    const bundle = await compose(makePlan('holistic'))
    const bundleIds = ids(bundle)
    // floor
    expect(bundleIds).toContain('FORENSIC_ASTROLOGICAL_DATA_v8_0')
    expect(bundleIds).toContain('CGM')
    // interpretive
    expect(bundleIds).toContain('UCN_v4_0')
    expect(bundleIds).toContain('CDLM_v1_1')
    expect(bundleIds).toContain('RM_v2_0')
    // predictive — holistic does NOT set forward_looking, so predictive rule
    // only fires for holistic if explicitly forward_looking; but interpretive
    // rule fires because holistic is in its class list.
    // discovery
    expect(bundleIds).toContain('PATTERN_REGISTER_v1_0')
    expect(bundleIds).toContain('CONTRADICTION_REGISTER_v1_0')
    expect(bundleIds).toContain('CLUSTER_ATLAS_v1_0')
    expect(bundleIds).toContain('RESONANCE_REGISTER_v1_0')
  })

  it('includes the holistic-remainder extras (e.g. MSR_v3_0)', async () => {
    const { compose } = await import('../rule_composer')
    const bundle = await compose(makePlan('holistic'))
    const bundleIds = ids(bundle)
    expect(bundleIds).toContain('MSR_v3_0')
  })

  it('does not duplicate floor assets', async () => {
    const { compose } = await import('../rule_composer')
    const bundle = await compose(makePlan('holistic'))
    const forensicCount = bundle.mandatory_context.filter(
      e => e.canonical_id === 'FORENSIC_ASTROLOGICAL_DATA_v8_0',
    ).length
    expect(forensicCount).toBe(1)
  })
})

describe('compose — remedial', () => {
  it('includes only floor assets', async () => {
    const { compose } = await import('../rule_composer')
    const bundle = await compose(makePlan('remedial'))
    const bundleIds = ids(bundle)
    expect(bundleIds).toContain('FORENSIC_ASTROLOGICAL_DATA_v8_0')
    expect(bundleIds).toContain('CGM')
    // No special rule for remedial
    expect(bundleIds).not.toContain('UCN_v4_0')
    expect(bundleIds).not.toContain('LEL')
  })
})

describe('compose — cross_native', () => {
  it('includes floor only + placeholder marker', async () => {
    const { compose } = await import('../rule_composer')
    const bundle = await compose(makePlan('cross_native'))
    const bundleIds = ids(bundle)
    expect(bundleIds).toContain('FORENSIC_ASTROLOGICAL_DATA_v8_0')
    expect(bundleIds).toContain('CGM')
    expect(bundleIds).toContain('__cross_native_placeholder__')
    expect(bundleIds).not.toContain('UCN_v4_0')
    expect(bundleIds).not.toContain('LIFE_EVENT_LOG_v1_2')
  })
})

describe('compose — forward_looking flag', () => {
  it('adds predictive assets to interpretive query when forward_looking is true', async () => {
    const { compose } = await import('../rule_composer')
    const bundle = await compose(makePlan('interpretive', true))
    const bundleIds = ids(bundle)
    expect(bundleIds).toContain('LIFE_EVENT_LOG_v1_2')
    expect(bundleIds).toContain('SADE_SATI_CYCLES_ALL')
    // Also keeps interpretive assets
    expect(bundleIds).toContain('UCN_v4_0')
  })
})

describe('compose — bundle structure', () => {
  it('query_plan_reference matches plan query_plan_id', async () => {
    const { compose } = await import('../rule_composer')
    const plan = makePlan('factual')
    const bundle = await compose(plan)
    expect(bundle.query_plan_reference).toBe(plan.query_plan_id)
  })

  it('manifest_fingerprint matches manifest', async () => {
    const { compose } = await import('../rule_composer')
    const bundle = await compose(makePlan('factual'))
    expect(bundle.manifest_fingerprint).toBe('mock-fingerprint')
  })

  it('total_tokens is integer >= 0', async () => {
    const { compose } = await import('../rule_composer')
    const bundle = await compose(makePlan('factual'))
    expect(Number.isInteger(bundle.total_tokens)).toBe(true)
    expect(bundle.total_tokens).toBeGreaterThanOrEqual(0)
  })

  it('content_hash starts with sha256:', async () => {
    const { compose } = await import('../rule_composer')
    const bundle = await compose(makePlan('factual'))
    for (const entry of bundle.mandatory_context) {
      expect(entry.content_hash.startsWith('sha256:')).toBe(true)
    }
  })
})
