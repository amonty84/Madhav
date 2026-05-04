/**
 * b11_guard.ts — B.11 Whole-Chart-Read runtime enforcement
 *
 * Checks whether the assembled synthesis context satisfies B.11:
 * every synthesis call MUST have context from at least MSR, UCN, and CGM
 * (the three required L2.5 layers per SYNTHESIS_PROMPT_v1_0.md §2.2).
 *
 * Zero overhead in the happy path — the check is a string scan.
 * No database or network calls.
 */

export interface B11CheckResult {
  compliant: boolean
  presentLayers: string[]
  missingLayers: string[]
  /** "[B.11-PARTIAL: missing MSR, CGM]" or null if compliant */
  annotation: string | null
}

/** The three layers whose presence is required for minimum B.11 compliance. */
export const B11_REQUIRED_LAYERS = ['MSR', 'UCN', 'CGM'] as const

/** All five L2.5 layers — full B.11 compliance includes all of these. */
export const B11_FULL_LAYERS = ['MSR', 'UCN', 'CDLM', 'CGM', 'RM'] as const

/** Markers that indicate a layer is present in the assembled context. */
const LAYER_MARKERS: Record<string, string[]> = {
  MSR:  ['MSR', 'Master Signal Register', '025_HOLISTIC_SYNTHESIS/MSR'],
  UCN:  ['UCN', 'Unified Chart Narrative', '025_HOLISTIC_SYNTHESIS/UCN'],
  CDLM: ['CDLM', 'Cross-Domain Linkage', '025_HOLISTIC_SYNTHESIS/CDLM'],
  CGM:  ['CGM', 'Causal Graph Model', '025_HOLISTIC_SYNTHESIS/CGM'],
  RM:   ['RM', 'Resonance Map', '025_HOLISTIC_SYNTHESIS/RM'],
}

function isLayerPresent(contextStr: string, layer: string): boolean {
  const markers = LAYER_MARKERS[layer]
  if (!markers) return false
  // Case-insensitive check against each marker
  const lower = contextStr.toLowerCase()
  return markers.some(m => lower.includes(m.toLowerCase()))
}

/**
 * Checks whether the assembled synthesis context satisfies B.11.
 * Accepts the context as a string, array of strings, or any object
 * (stringified for the check).
 *
 * Returns a B11CheckResult indicating compliance level and what's missing.
 */
export function checkB11Compliance(contextPayload: unknown): B11CheckResult {
  let contextStr: string

  if (typeof contextPayload === 'string') {
    contextStr = contextPayload
  } else if (Array.isArray(contextPayload)) {
    contextStr = contextPayload.map(item =>
      typeof item === 'string' ? item : JSON.stringify(item)
    ).join('\n')
  } else if (contextPayload === null || contextPayload === undefined) {
    contextStr = ''
  } else {
    try {
      contextStr = JSON.stringify(contextPayload)
    } catch {
      contextStr = String(contextPayload)
    }
  }

  const presentLayers: string[] = []
  const missingLayers: string[] = []

  for (const layer of B11_REQUIRED_LAYERS) {
    if (isLayerPresent(contextStr, layer)) {
      presentLayers.push(layer)
    } else {
      missingLayers.push(layer)
    }
  }

  // Also check non-required layers (for reporting; don't affect compliance)
  for (const layer of B11_FULL_LAYERS) {
    if (B11_REQUIRED_LAYERS.includes(layer as typeof B11_REQUIRED_LAYERS[number])) continue
    if (isLayerPresent(contextStr, layer)) {
      presentLayers.push(layer)
    }
  }

  const compliant = missingLayers.length === 0

  return {
    compliant,
    presentLayers,
    missingLayers,
    annotation: compliant
      ? null
      : `[B.11-PARTIAL: missing ${missingLayers.join(', ')}]`,
  }
}
