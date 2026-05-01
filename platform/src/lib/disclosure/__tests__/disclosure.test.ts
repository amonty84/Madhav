import { describe, it, expect } from 'vitest'
import { DISCLOSURE_FILTER } from '../index'

describe('DisclosureFilter', () => {
  describe('super_admin tier', () => {
    it('passes content unchanged', () => {
      const result = DISCLOSURE_FILTER.filter(
        'Test content for super admin',
        'super_admin',
        'synthesis'
      )
      expect(result.filtered_content).toBe('Test content for super admin')
      expect(result.redactions_applied).toBe(0)
      expect(result.notes).toEqual([])
    })

    it('handles empty string', () => {
      const result = DISCLOSURE_FILTER.filter('', 'super_admin', 'synthesis')
      expect(result.filtered_content).toBe('')
      expect(result.redactions_applied).toBe(0)
      expect(result.notes).toEqual([])
    })

    it('preserves non-empty content exactly', () => {
      const content = 'Line 1\nLine 2\n  Indented line\n'
      const result = DISCLOSURE_FILTER.filter(content, 'super_admin', 'synthesis')
      expect(result.filtered_content).toBe(content)
    })
  })

  describe('acharya_reviewer tier', () => {
    it('prepends methodology preamble for synthesis content_type', () => {
      const content = 'Synthesis content here'
      const result = DISCLOSURE_FILTER.filter(content, 'acharya_reviewer', 'synthesis')
      expect(result.filtered_content).toContain(
        '[METHODOLOGY DISCLOSURE — For peer review of instrument reasoning.'
      )
      expect(result.filtered_content).toContain('Calibration status: Phase 3 (pre-calibration)')
      expect(result.filtered_content).toContain(content)
      expect(result.filtered_content.charAt(0)).toBe('[')
      expect(result.redactions_applied).toBe(0)
      expect(result.notes).toContain('methodology_disclosure_prepended')
    })

    it('prepends audit preamble for audit_view content_type', () => {
      const content = 'Audit view content here'
      const result = DISCLOSURE_FILTER.filter(content, 'acharya_reviewer', 'audit_view')
      expect(result.filtered_content).toContain('[AUDIT VIEW — Methodology disclosure for this synthesis run.')
      expect(result.filtered_content).toContain('This is the full unfiltered audit record.')
      expect(result.filtered_content).toContain(content)
      expect(result.filtered_content.substring(0, 10)).toBe('[AUDIT VIE')
      expect(result.redactions_applied).toBe(0)
      expect(result.notes).toContain('methodology_disclosure_prepended')
    })

    it('handles empty content with preamble', () => {
      const result = DISCLOSURE_FILTER.filter('', 'acharya_reviewer', 'synthesis')
      expect(result.filtered_content).toContain('[METHODOLOGY DISCLOSURE')
      expect(result.redactions_applied).toBe(0)
    })
  })

  describe('client tier', () => {
    it('returns unfiltered content with M6 TODO note', () => {
      const content = 'Client content here'
      const result = DISCLOSURE_FILTER.filter(content, 'client', 'synthesis')
      expect(result.filtered_content).toBe(content)
      expect(result.redactions_applied).toBe(0)
      expect(result.notes[0]).toContain('TODO: client-tier redaction not yet implemented (M6 deliverable)')
      expect(result.notes[0]).toContain('redact internal terminology')
      expect(result.notes[0]).toContain('calibration bands')
    })

    it('handles empty content', () => {
      const result = DISCLOSURE_FILTER.filter('', 'client', 'synthesis')
      expect(result.filtered_content).toBe('')
      expect(result.redactions_applied).toBe(0)
    })
  })

  describe('public_redacted tier', () => {
    it('returns unfiltered content with M10 TODO note', () => {
      const content = 'Public content here'
      const result = DISCLOSURE_FILTER.filter(content, 'public_redacted', 'synthesis')
      expect(result.filtered_content).toBe(content)
      expect(result.redactions_applied).toBe(0)
      expect(result.notes[0]).toContain('TODO: public_redacted-tier filtering not yet implemented (M10 deliverable)')
      expect(result.notes[0]).toContain('aggregated cohort findings only')
      expect(result.notes[0]).toContain('no individual chart attribution')
    })

    it('handles empty content', () => {
      const result = DISCLOSURE_FILTER.filter('', 'public_redacted', 'synthesis')
      expect(result.filtered_content).toBe('')
      expect(result.redactions_applied).toBe(0)
    })
  })

  describe('content_type handling', () => {
    it('uses different preamble for audit_view vs synthesis', () => {
      const content = 'Test content'
      const synthesisResult = DISCLOSURE_FILTER.filter(content, 'acharya_reviewer', 'synthesis')
      const auditResult = DISCLOSURE_FILTER.filter(content, 'acharya_reviewer', 'audit_view')

      expect(synthesisResult.filtered_content).not.toEqual(auditResult.filtered_content)
      expect(synthesisResult.filtered_content).toContain('METHODOLOGY DISCLOSURE')
      expect(auditResult.filtered_content).toContain('AUDIT VIEW')
    })

    it('super_admin ignores content_type', () => {
      const content = 'Test content'
      const synthesisResult = DISCLOSURE_FILTER.filter(content, 'super_admin', 'synthesis')
      const auditResult = DISCLOSURE_FILTER.filter(content, 'super_admin', 'audit_view')

      expect(synthesisResult.filtered_content).toEqual(auditResult.filtered_content)
    })
  })
})
