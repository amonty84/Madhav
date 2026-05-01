import { describe, it, expect } from 'vitest'

import {
  countSignalCitations,
  totalSignalCitations,
  hasMinimumCitations,
  citationThresholdForClass,
} from '../citation_check'

describe('citation_check (BHISMA §4.7)', () => {
  describe('countSignalCitations', () => {
    it('returns 0 for empty text', () => {
      expect(countSignalCitations('')).toBe(0)
    })

    it('returns 0 when no citations match', () => {
      expect(countSignalCitations('Saturn rules the 10th house, no doubt.')).toBe(0)
    })

    it('counts a single citation', () => {
      expect(
        countSignalCitations('See SIG.MSR.142 for the dispositor chain.'),
      ).toBe(1)
    })

    it('counts distinct citations only — duplicates do not double-count', () => {
      const text =
        'Per SIG.MSR.142 and SIG.MSR.207 — note SIG.MSR.142 again here.'
      expect(countSignalCitations(text)).toBe(2)
    })

    it('counts multiple distinct citations', () => {
      const text = 'SIG.MSR.001 SIG.MSR.142 SIG.MSR.207 SIG.MSR.499'
      expect(countSignalCitations(text)).toBe(4)
    })

    it('ignores malformed or wrong-prefix ids', () => {
      // SIG.MSR.NN (two digits) should NOT match — the format is fixed at NNN.
      // SIG.UCN.142 should NOT match — wrong layer prefix.
      expect(
        countSignalCitations(
          'SIG.MSR.42 should miss; SIG.UCN.142 should miss; SIG.MSR.142 should hit.',
        ),
      ).toBe(1)
    })
  })

  describe('totalSignalCitations', () => {
    it('counts every occurrence including duplicates', () => {
      const text =
        'Per SIG.MSR.142 and SIG.MSR.207 — note SIG.MSR.142 again here.'
      expect(totalSignalCitations(text)).toBe(3)
    })

    it('returns 0 on no match', () => {
      expect(totalSignalCitations('no signals here')).toBe(0)
    })
  })

  describe('citationThresholdForClass', () => {
    it('returns 0 for factual', () => {
      expect(citationThresholdForClass('factual')).toBe(0)
    })
    it('returns 5 for holistic', () => {
      expect(citationThresholdForClass('holistic')).toBe(5)
    })
    it('returns 4 for cross_domain', () => {
      expect(citationThresholdForClass('cross_domain')).toBe(4)
    })
    it('falls back to 1 for unknown classes', () => {
      expect(citationThresholdForClass('unknown_class')).toBe(1)
    })
  })

  describe('hasMinimumCitations', () => {
    it('passes when count meets the threshold', () => {
      // holistic threshold is 5
      const text =
        'SIG.MSR.001 SIG.MSR.002 SIG.MSR.003 SIG.MSR.004 SIG.MSR.005'
      expect(hasMinimumCitations(text, 'holistic')).toBe(true)
    })

    it('fails when count is below the threshold', () => {
      const text = 'SIG.MSR.001 SIG.MSR.002'
      expect(hasMinimumCitations(text, 'holistic')).toBe(false)
    })

    it('factual passes with zero citations (threshold 0)', () => {
      expect(hasMinimumCitations('answer with no signals', 'factual')).toBe(true)
    })
  })
})
