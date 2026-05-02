import { describe, it, expect } from 'vitest'
import { validateCitations } from '@/lib/synthesis/citation_check'
import { createConfigService } from '@/lib/config/index'

describe('validateCitations — Layer 2 citation gate', () => {
  it('PASS — citation in output is verified against context', () => {
    const output = 'Per SIG.MSR.001, the native is advised to take this remedy.'
    const context = JSON.stringify({
      signals: [{ id: 'SIG.MSR.001', text: 'Mars in 8th house — sapphire indicated.' }],
    })
    const result = validateCitations(output, context, 'remedial')
    expect(result.layer1_count).toBe(1)
    expect(result.layer2_verified).toBe(1)
    expect(result.layer2_leaked).toBe(0)
    expect(result.gate_result).toBe('PASS')
  })

  it('WARN — citation in output absent from context flags training-data leak', () => {
    const output = 'According to SIG.MSR.999, transits suggest difficulty.'
    const context = JSON.stringify({
      signals: [{ id: 'SIG.MSR.001', text: 'A real signal.' }],
    })
    const result = validateCitations(output, context, 'predictive')
    expect(result.layer1_count).toBe(1)
    expect(result.layer2_verified).toBe(0)
    expect(result.layer2_leaked).toBe(1)
    expect(result.gate_result).toBe('WARN')
    expect(result.gate_reason).toMatch(/training-data leak/i)
  })

  it('ERROR — prescriptive (remedial) query with zero citations is gated', () => {
    const output = 'You should wear a yellow sapphire on the right index finger every Thursday.'
    const context = JSON.stringify({ signals: [] })
    const result = validateCitations(output, context, 'remedial')
    expect(result.layer1_count).toBe(0)
    expect(result.layer2_verified).toBe(0)
    expect(result.gate_result).toBe('ERROR')
    expect(result.gate_reason).toMatch(/remedial/)
  })

  it('PASS — informational (interpretive) query with zero citations is allowed', () => {
    const output = 'The second house is generally associated with accumulated wealth and family lineage.'
    const context = JSON.stringify({})
    const result = validateCitations(output, context, 'interpretive')
    expect(result.layer1_count).toBe(0)
    expect(result.gate_result).toBe('PASS')
    expect(result.gate_reason).toMatch(/informational/)
  })

  it('CITATION_GATE_OVERRIDE — admin override converts ERROR to WARN at the call site', () => {
    const cfg = createConfigService()
    cfg.setFlag('CITATION_GATE_OVERRIDE', true)
    const output = 'You should wear a yellow sapphire.'
    const context = JSON.stringify({})
    const validation = validateCitations(output, context, 'remedial')
    // The validator itself stays pure — it always returns ERROR for this input.
    expect(validation.gate_result).toBe('ERROR')
    // The route applies the override mapping; mirror that logic here so the
    // contract between the validator and the override flag is locked in.
    const effective =
      validation.gate_result === 'ERROR' && cfg.getFlag('CITATION_GATE_OVERRIDE')
        ? 'WARN'
        : validation.gate_result
    expect(effective).toBe('WARN')
  })
})
