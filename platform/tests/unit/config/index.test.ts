import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { createConfigService, type FeatureFlag } from '@/lib/config/index'

describe('ConfigService', () => {
  it('pipeline feature flags default to false', () => {
    const svc = createConfigService()
    const flags: FeatureFlag[] = [
      'MANIFEST_BUILDER_ENABLED',
      'LLM_CHECKPOINTS_ENABLED',
    ]
    for (const flag of flags) {
      expect(svc.getFlag(flag)).toBe(false)
    }
  })

  it('NEW_QUERY_PIPELINE_ENABLED defaults true (Phase 11A cutover)', () => {
    const svc = createConfigService()
    expect(svc.getFlag('NEW_QUERY_PIPELINE_ENABLED')).toBe(true)
  })

  it('AUDIT_ENABLED defaults true (Phase 11A cutover)', () => {
    const svc = createConfigService()
    expect(svc.getFlag('AUDIT_ENABLED')).toBe(true)
  })

  it('env var override: MARSYS_FLAG_NEW_QUERY_PIPELINE_ENABLED=false reverts to legacy path', () => {
    process.env.MARSYS_FLAG_NEW_QUERY_PIPELINE_ENABLED = 'false'
    try {
      const svc = createConfigService()
      expect(svc.getFlag('NEW_QUERY_PIPELINE_ENABLED')).toBe(false)
    } finally {
      delete process.env.MARSYS_FLAG_NEW_QUERY_PIPELINE_ENABLED
    }
  })

  it('setFlag updates the value', () => {
    const svc = createConfigService()
    svc.setFlag('PANEL_MODE_ENABLED', true)
    expect(svc.getFlag('PANEL_MODE_ENABLED')).toBe(true)
  })

  it('subscribe callback fires on setFlag', () => {
    const svc = createConfigService()
    const calls: Array<[string, unknown]> = []
    const unsub = svc.subscribe((key, val) => calls.push([key, val]))
    svc.setFlag('AUDIT_ENABLED', true)
    expect(calls).toEqual([['AUDIT_ENABLED', true]])
    unsub()
  })

  it('unsubscribe stops notifications', () => {
    const svc = createConfigService()
    const calls: number[] = []
    const unsub = svc.subscribe(() => calls.push(1))
    unsub()
    svc.setFlag('AUDIT_ENABLED', true)
    expect(calls).toHaveLength(0)
  })

  it('getValue returns default when key not set', () => {
    const svc = createConfigService()
    expect(svc.getValue('nonexistent', 42)).toBe(42)
  })

  it('PORTAL_REDESIGN_R0_ENABLED defaults true (R0 Foundation)', () => {
    const svc = createConfigService()
    expect(svc.getFlag('PORTAL_REDESIGN_R0_ENABLED')).toBe(true)
  })

  it('env var override: MARSYS_FLAG_PORTAL_REDESIGN_R0_ENABLED=false disables AppShell', () => {
    process.env.MARSYS_FLAG_PORTAL_REDESIGN_R0_ENABLED = 'false'
    try {
      const svc = createConfigService()
      expect(svc.getFlag('PORTAL_REDESIGN_R0_ENABLED')).toBe(false)
    } finally {
      delete process.env.MARSYS_FLAG_PORTAL_REDESIGN_R0_ENABLED
    }
  })

  it('env var override: MARSYS_FLAG_PANEL_MODE_ENABLED=true enables the flag', () => {
    process.env.MARSYS_FLAG_PANEL_MODE_ENABLED = 'true'
    try {
      const svc = createConfigService()
      expect(svc.getFlag('PANEL_MODE_ENABLED')).toBe(true)
    } finally {
      delete process.env.MARSYS_FLAG_PANEL_MODE_ENABLED
    }
  })
})
