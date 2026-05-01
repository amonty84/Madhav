import { describe, it, expect } from 'vitest'
import { detectPrediction } from '@/lib/consume/prediction-detection'

describe('detectPrediction', () => {
  describe('positive patterns', () => {
    it('detects "by 2026"', () => {
      expect(detectPrediction('By 2026 there will be major career changes.').detected).toBe(true)
    })

    it('detects "by March 2025"', () => {
      expect(detectPrediction('The transition will complete by March 2025.').detected).toBe(true)
    })

    it('detects "in the next 3 months"', () => {
      const r = detectPrediction('Expect a shift in the next 3 months.')
      expect(r.detected).toBe(true)
      expect(r.horizon).toContain('next 3 months')
    })

    it('detects "in the next 2 weeks"', () => {
      expect(detectPrediction('Resolution likely in the next 2 weeks.').detected).toBe(true)
    })

    it('detects "before June 2025"', () => {
      expect(detectPrediction('Promotion expected before June 2025.').detected).toBe(true)
    })

    it('detects "before the end of this year"', () => {
      expect(detectPrediction('Resolution before the end of this year.').detected).toBe(true)
    })

    it('detects "during Saturn dasha"', () => {
      const r = detectPrediction('Challenges arise during Saturn dasha.')
      expect(r.detected).toBe(true)
      expect(r.horizon).toContain('Saturn dasha')
    })

    it('detects "Mars dasha will"', () => {
      expect(detectPrediction('Mars dasha will bring financial growth.').detected).toBe(true)
    })

    it('detects "in 2027" and extracts horizon', () => {
      const r = detectPrediction('Major life shift expected in 2027.')
      expect(r.detected).toBe(true)
      expect(r.horizon).toBe('2027')
    })

    it('detects "within the next 6 months"', () => {
      expect(detectPrediction('Resolution within the next 6 months.').detected).toBe(true)
    })

    it('is case-insensitive', () => {
      expect(detectPrediction('BY 2026 MAJOR CHANGES.').detected).toBe(true)
    })
  })

  describe('negative patterns', () => {
    it('returns false for plain past tense statement', () => {
      expect(detectPrediction('Venus was in the 7th house at birth.').detected).toBe(false)
    })

    it('returns false for empty string', () => {
      expect(detectPrediction('').detected).toBe(false)
    })

    it('returns false for general dasha description without future index', () => {
      expect(detectPrediction('The Saturn dasha spans 19 years.').detected).toBe(false)
    })
  })

  describe('result shape', () => {
    it('returns confidence 0.7 when detected', () => {
      expect(detectPrediction('By 2026 changes arrive.').confidence).toBe(0.7)
    })

    it('returns undefined confidence when not detected', () => {
      expect(detectPrediction('No prediction here.').confidence).toBeUndefined()
    })
  })
})
