import { describe, it, expect } from 'vitest'
import { p2Validator } from '@/lib/validators/p2_citation'

describe('p2_citation validator — AC.3 regex fix', () => {
  it('PASS — bare SIG.MSR.NNN citation detected', async () => {
    const result = await p2Validator.validate(
      'Per SIG.MSR.001 the native should consider gemstone therapy.',
    )
    expect(result.vote).toBe('pass')
    expect(result.reason).toMatch(/1 citation/)
  })

  it('PASS — arrow-style (→ SIG.MSR.NNN) citation detected', async () => {
    const result = await p2Validator.validate(
      'This is supported by the signal (→ SIG.MSR.142) regarding Venus strength.',
    )
    expect(result.vote).toBe('pass')
    expect(result.reason).toMatch(/1 citation/)
  })

  it('PASS — multiple citations all detected', async () => {
    const result = await p2Validator.validate(
      'SIG.MSR.001 and SIG.MSR.207 both indicate elevated Saturn influence.',
    )
    expect(result.vote).toBe('pass')
    expect(result.reason).toMatch(/2 citation/)
  })

  it('WARN — interpretive text with no citations produces warn', async () => {
    const result = await p2Validator.validate(
      'The placement of Saturn in the 7th house suggests delays in marriage partnerships.',
    )
    expect(result.vote).toBe('warn')
    expect(result.reason).toMatch(/no citations/)
  })

  it('WARN — interpretive text with no SIG.MSR citations produces warn', async () => {
    // INTERPRETIVE_KEYWORDS: suggests, indicates, implies, likely, points to, shows that
    const result = await p2Validator.validate(
      'This placement suggests a strong Venusian influence on the native.',
    )
    expect(result.vote).toBe('warn')
  })

  it('PASS — non-string input fails with fail vote', async () => {
    const result = await p2Validator.validate(42)
    expect(result.vote).toBe('fail')
    expect(result.reason).toMatch(/must be a string/)
  })
})
