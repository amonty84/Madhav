/**
 * composition_rules.test.ts
 *
 * Tests each rule's applies() and assets_to_add() independently.
 */

import { describe, it, expect, vi } from 'vitest'

// Prevent server-only guard from blocking unit tests that only need the pure
// composition logic (no real I/O).
vi.mock('@/lib/storage', () => ({
  getStorageClient: () => ({ readFile: async () => '{}' }),
}))

import {
  floorRule,
  interpretiveRule,
  predictiveRule,
  discoveryRule,
  holisticRemainderRule,
  crossNativeMetaRule,
  CROSS_NATIVE_PLACEHOLDER,
  remedialRule,
  domainReportRule,
  timelineRule,
  DOMAIN_TO_CANONICAL,
} from '../composition_rules'
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

function makePlan(query_class: QueryPlan['query_class'], forward_looking = false): QueryPlan {
  return {
    query_plan_id: crypto.randomUUID(),
    query_text: 'test',
    query_class,
    domains: [],
    forward_looking,
    audience_tier: 'acharya_reviewer',
    tools_authorized: [],
    history_mode: 'synthesized',
    panel_mode: false,
    expected_output_shape: 'single_answer',
    manifest_fingerprint: 'fp',
    schema_version: '1.0',
  }
}

function makePlanWith(
  query_class: QueryPlan['query_class'],
  overrides: Partial<QueryPlan> = {},
): QueryPlan {
  return { ...makePlan(query_class), ...overrides }
}

function makeManifest(entries: AssetEntry[]): ManifestData {
  const byId = new Map(entries.map(e => [e.canonical_id, e]))
  return { fingerprint: 'fp', entries, byId }
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

const FULL_MANIFEST = makeManifest([
  FORENSIC, CGM, UCN, CDLM, RM, LEL, SADE, PATTERN, CONTRADICTION, CLUSTER, RESONANCE,
])

// W6-R1 fixtures
const REMEDIAL_P1 = makeAsset('REMEDIAL_CODEX_v2_0_PART1', '04_REMEDIAL_CODEX/REMEDIAL_CODEX_v2_0_PART1.md')
const REMEDIAL_P2 = makeAsset('REMEDIAL_CODEX_v2_0_PART2', '04_REMEDIAL_CODEX/REMEDIAL_CODEX_v2_0_PART2.md')
const REPORT_CAREER = makeAsset('REPORT_CAREER_DHARMA_v1_1', '03_DOMAIN_REPORTS/REPORT_CAREER_DHARMA_v1_1.md')
const REPORT_RELATIONSHIPS = makeAsset('REPORT_RELATIONSHIPS_v1_1', '03_DOMAIN_REPORTS/REPORT_RELATIONSHIPS_v1_1.md')
const REPORT_FINANCIAL = makeAsset('REPORT_FINANCIAL_v2_1', '03_DOMAIN_REPORTS/REPORT_FINANCIAL_v2_1.md')
const TIMELINE = makeAsset('LIFETIME_TIMELINE_v1_0', '05_TEMPORAL_ENGINES/LIFETIME_TIMELINE_v1_0.md')

const W6_MANIFEST = makeManifest([
  FORENSIC, CGM, UCN, CDLM, RM, LEL, SADE, PATTERN, CONTRADICTION, CLUSTER, RESONANCE,
  REMEDIAL_P1, REMEDIAL_P2, REPORT_CAREER, REPORT_RELATIONSHIPS, REPORT_FINANCIAL, TIMELINE,
])

// ── floor rule ──────────────────────────────────────────────────────────────

describe('floorRule', () => {
  it('applies to every query class', () => {
    const classes: QueryPlan['query_class'][] = [
      'factual', 'interpretive', 'predictive', 'cross_domain',
      'discovery', 'holistic', 'remedial', 'cross_native',
    ]
    for (const c of classes) {
      expect(floorRule.applies(makePlan(c))).toBe(true)
    }
  })

  it('returns only always_required entries', () => {
    const assets = floorRule.assets_to_add(makePlan('factual'), FULL_MANIFEST)
    const ids = assets.map(a => a.canonical_id)
    expect(ids).toContain('FORENSIC_ASTROLOGICAL_DATA_v8_0')
    expect(ids).toContain('CGM')
    // Non-floor assets should not appear
    expect(ids).not.toContain('UCN_v4_0')
    expect(ids).not.toContain('LEL')
  })

  it('role is floor', () => {
    expect(floorRule.role).toBe('floor')
  })
})

// ── interpretive rule ───────────────────────────────────────────────────────

describe('interpretiveRule', () => {
  it('applies to interpretive, cross_domain, holistic', () => {
    expect(interpretiveRule.applies(makePlan('interpretive'))).toBe(true)
    expect(interpretiveRule.applies(makePlan('cross_domain'))).toBe(true)
    expect(interpretiveRule.applies(makePlan('holistic'))).toBe(true)
  })

  it('does not apply to factual, predictive, discovery, remedial, cross_native', () => {
    for (const c of ['factual', 'predictive', 'discovery', 'remedial', 'cross_native'] as const) {
      expect(interpretiveRule.applies(makePlan(c))).toBe(false)
    }
  })

  it('adds UCN, CDLM, RM', () => {
    const assets = interpretiveRule.assets_to_add(makePlan('interpretive'), FULL_MANIFEST)
    const ids = assets.map(a => a.canonical_id)
    expect(ids).toContain('UCN_v4_0')
    expect(ids).toContain('CDLM_v1_1')
    expect(ids).toContain('RM_v2_0')
  })

  it('role is interpretive', () => {
    expect(interpretiveRule.role).toBe('interpretive')
  })
})

// ── predictive rule ─────────────────────────────────────────────────────────

describe('predictiveRule', () => {
  it('applies to predictive query class', () => {
    expect(predictiveRule.applies(makePlan('predictive'))).toBe(true)
  })

  it('applies when forward_looking is true regardless of class', () => {
    expect(predictiveRule.applies(makePlan('factual', true))).toBe(true)
    expect(predictiveRule.applies(makePlan('interpretive', true))).toBe(true)
  })

  it('does not apply when forward_looking false and class is not predictive', () => {
    expect(predictiveRule.applies(makePlan('factual', false))).toBe(false)
    expect(predictiveRule.applies(makePlan('discovery', false))).toBe(false)
  })

  it('adds LEL and SADE_SATI', () => {
    const assets = predictiveRule.assets_to_add(makePlan('predictive'), FULL_MANIFEST)
    const ids = assets.map(a => a.canonical_id)
    expect(ids).toContain('LIFE_EVENT_LOG_v1_2')
    expect(ids).toContain('SADE_SATI_CYCLES_ALL')
  })

  it('role is predictive', () => {
    expect(predictiveRule.role).toBe('predictive')
  })
})

// ── discovery rule ──────────────────────────────────────────────────────────

describe('discoveryRule', () => {
  it('applies to discovery and holistic', () => {
    expect(discoveryRule.applies(makePlan('discovery'))).toBe(true)
    expect(discoveryRule.applies(makePlan('holistic'))).toBe(true)
  })

  it('does not apply to other classes', () => {
    for (const c of ['factual', 'interpretive', 'predictive', 'cross_domain', 'remedial', 'cross_native'] as const) {
      expect(discoveryRule.applies(makePlan(c))).toBe(false)
    }
  })

  it('adds the four discovery registers', () => {
    const assets = discoveryRule.assets_to_add(makePlan('discovery'), FULL_MANIFEST)
    const ids = assets.map(a => a.canonical_id)
    expect(ids).toContain('PATTERN_REGISTER_v1_0')
    expect(ids).toContain('CONTRADICTION_REGISTER_v1_0')
    expect(ids).toContain('CLUSTER_ATLAS_v1_0')
    expect(ids).toContain('RESONANCE_REGISTER_v1_0')
  })

  it('role is discovery', () => {
    expect(discoveryRule.role).toBe('discovery')
  })
})

// ── holistic_remainder rule ─────────────────────────────────────────────────

describe('holisticRemainderRule', () => {
  it('applies only to holistic', () => {
    expect(holisticRemainderRule.applies(makePlan('holistic'))).toBe(true)
    for (const c of ['factual', 'interpretive', 'predictive', 'cross_domain', 'discovery', 'remedial', 'cross_native'] as const) {
      expect(holisticRemainderRule.applies(makePlan(c))).toBe(false)
    }
  })

  it('returns all Tier-1 eligible entries', () => {
    const assets = holisticRemainderRule.assets_to_add(makePlan('holistic'), FULL_MANIFEST)
    // All entries in FULL_MANIFEST are expose_to_chat=true, status=CURRENT
    expect(assets.length).toBe(FULL_MANIFEST.entries.length)
  })

  it('role is holistic', () => {
    expect(holisticRemainderRule.role).toBe('holistic')
  })
})

// ── cross_native_meta rule ──────────────────────────────────────────────────

describe('crossNativeMetaRule', () => {
  it('applies only to cross_native', () => {
    expect(crossNativeMetaRule.applies(makePlan('cross_native'))).toBe(true)
    for (const c of ['factual', 'interpretive', 'predictive', 'holistic', 'discovery', 'remedial', 'cross_domain'] as const) {
      expect(crossNativeMetaRule.applies(makePlan(c))).toBe(false)
    }
  })

  it('returns the placeholder entry', () => {
    const assets = crossNativeMetaRule.assets_to_add(makePlan('cross_native'), FULL_MANIFEST)
    expect(assets.length).toBe(1)
    expect(assets[0].canonical_id).toBe(CROSS_NATIVE_PLACEHOLDER.canonical_id)
  })

  it('role is cross_native_meta', () => {
    expect(crossNativeMetaRule.role).toBe('cross_native_meta')
  })
})

// ── W6-R1: remedialRule ─────────────────────────────────────────────────────

describe('remedialRule', () => {
  it('applies only to remedial query class', () => {
    expect(remedialRule.applies(makePlan('remedial'))).toBe(true)
    for (const c of ['factual', 'interpretive', 'predictive', 'cross_domain',
                     'discovery', 'holistic', 'cross_native'] as const) {
      expect(remedialRule.applies(makePlan(c))).toBe(false)
    }
  })

  it('adds REMEDIAL_CODEX PART1 and PART2 when present in manifest', () => {
    const assets = remedialRule.assets_to_add(makePlan('remedial'), W6_MANIFEST)
    const ids = assets.map(a => a.canonical_id)
    expect(ids).toContain('REMEDIAL_CODEX_v2_0_PART1')
    expect(ids).toContain('REMEDIAL_CODEX_v2_0_PART2')
  })

  it('returns empty array (no error) when REMEDIAL_CODEX absent from manifest', () => {
    const emptyManifest = makeManifest([FORENSIC, CGM])
    const assets = remedialRule.assets_to_add(makePlan('remedial'), emptyManifest)
    expect(assets).toEqual([])
  })

  it('role is remedial', () => {
    expect(remedialRule.role).toBe('remedial')
  })
})

// ── W6-R1: domainReportRule ─────────────────────────────────────────────────

describe('domainReportRule', () => {
  it('applies when plan.domains is non-empty', () => {
    expect(domainReportRule.applies(makePlanWith('interpretive', { domains: ['career'] }))).toBe(true)
    expect(domainReportRule.applies(makePlanWith('factual', { domains: ['health', 'mind'] }))).toBe(true)
  })

  it('does not apply when domains is empty', () => {
    expect(domainReportRule.applies(makePlan('interpretive'))).toBe(false)
    expect(domainReportRule.applies(makePlan('holistic'))).toBe(false)
  })

  it('adds the matched REPORT_* entry for career domain', () => {
    const plan = makePlanWith('interpretive', { domains: ['career'] })
    const assets = domainReportRule.assets_to_add(plan, W6_MANIFEST)
    expect(assets.map(a => a.canonical_id)).toContain('REPORT_CAREER_DHARMA_v1_1')
  })

  it('deduplicates when career and dharma both appear (same report)', () => {
    const plan = makePlanWith('interpretive', { domains: ['career', 'dharma'] })
    const assets = domainReportRule.assets_to_add(plan, W6_MANIFEST)
    const careerEntries = assets.filter(a => a.canonical_id === 'REPORT_CAREER_DHARMA_v1_1')
    expect(careerEntries).toHaveLength(1)
  })

  it('returns empty for unrecognized domain without error', () => {
    const plan = makePlanWith('factual', { domains: ['alchemy'] })
    const assets = domainReportRule.assets_to_add(plan, W6_MANIFEST)
    expect(assets).toEqual([])
  })

  it('role is domain_report', () => {
    expect(domainReportRule.role).toBe('domain_report')
  })
})

// ── W6-R1: timelineRule ─────────────────────────────────────────────────────

describe('timelineRule', () => {
  it('applies when forward_looking=true AND time_window is set', () => {
    const plan = makePlanWith('predictive', {
      forward_looking: true,
      time_window: { start: '2026-01-01', end: '2029-12-31' },
    })
    expect(timelineRule.applies(plan)).toBe(true)
  })

  it('does not apply when forward_looking=true but time_window absent', () => {
    const plan = makePlanWith('predictive', { forward_looking: true })
    expect(timelineRule.applies(plan)).toBe(false)
  })

  it('does not apply when time_window set but forward_looking=false', () => {
    const plan = makePlanWith('factual', {
      forward_looking: false,
      time_window: { start: '2026-01-01', end: '2029-12-31' },
    })
    expect(timelineRule.applies(plan)).toBe(false)
  })

  it('adds LIFETIME_TIMELINE_v1_0 when in manifest', () => {
    const plan = makePlanWith('predictive', {
      forward_looking: true,
      time_window: { start: '2026-01-01', end: '2029-12-31' },
    })
    const assets = timelineRule.assets_to_add(plan, W6_MANIFEST)
    expect(assets.map(a => a.canonical_id)).toContain('LIFETIME_TIMELINE_v1_0')
  })

  it('returns empty array without error when temporal entries absent from manifest', () => {
    const emptyManifest = makeManifest([FORENSIC, CGM])
    const plan = makePlanWith('predictive', {
      forward_looking: true,
      time_window: { start: '2027-01-01', end: '2028-12-31' },
    })
    const assets = timelineRule.assets_to_add(plan, emptyManifest)
    expect(assets).toEqual([])
  })

  it('role is temporal_engine', () => {
    expect(timelineRule.role).toBe('temporal_engine')
  })
})

// ── W6-R1: DOMAIN_TO_CANONICAL export ──────────────────────────────────────

describe('DOMAIN_TO_CANONICAL', () => {
  it('is exported and contains expected domain keys', () => {
    expect(DOMAIN_TO_CANONICAL).toBeDefined()
    expect(DOMAIN_TO_CANONICAL['career']).toBeDefined()
    expect(DOMAIN_TO_CANONICAL['financial'].canonicalId).toBe('REPORT_FINANCIAL_v2_1')
    expect(DOMAIN_TO_CANONICAL['marriage'].canonicalId).toBe('REPORT_RELATIONSHIPS_v1_1')
  })
})
