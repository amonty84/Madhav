export interface ValidatorLabel {
  id: string
  short: string
  description: string
  remedy?: string
}

export const VALIDATOR_LABELS: Record<string, ValidatorLabel> = {
  P1: {
    id: 'P1',
    short: 'Layer Separation',
    description: 'Facts and interpretations must be kept in separate layers.',
    remedy: 'Tag this claim with its L1 fact ID.',
  },
  P2: {
    id: 'P2',
    short: 'Citation Integrity',
    description: 'All claims must trace to an explicit source in the retrieval bundle.',
    remedy: 'Ground the claim in a specific signal ID or document chunk.',
  },
  P5: {
    id: 'P5',
    short: 'Signal ID Resolution',
    description: 'Signal IDs referenced in the answer must exist in the active MSR.',
    remedy: 'Remove or correct the unresolvable signal reference.',
  },
  P7: {
    id: 'P7',
    short: 'Derivation Ledger',
    description: 'Every L2.5+ claim must carry a derivation ledger entry listing consumed L1 fact IDs.',
    remedy: 'Add a DERIVATION_LEDGER entry for this claim.',
  },
}

// Lowercase-key aliases so both "P1" and "p1_layer_separation" resolve to the same entry.
const ALIASES: Record<string, string> = {
  p1_layer_separation: 'P1',
  p1:                  'P1',
  p2_citation:         'P2',
  p2:                  'P2',
  p5_signal_id_resolution: 'P5',
  p5:                  'P5',
  p7_derivation_ledger: 'P7',
  p7:                  'P7',
}

export function lookupValidator(id: string): ValidatorLabel {
  const canonical = ALIASES[id] ?? ALIASES[id.toUpperCase()] ?? id.toUpperCase()
  return (
    VALIDATOR_LABELS[canonical] ??
    VALIDATOR_LABELS[id] ?? {
      id,
      short: id,
      description: 'Validator description not yet registered.',
    }
  )
}
