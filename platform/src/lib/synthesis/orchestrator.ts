/**
 * MARSYS-JIS Stream E — Strategy selector / orchestrator factory
 * schema_version: 1.0
 *
 * Single decision point: PANEL_MODE_ENABLED flag AND per-query panel_opt_in
 * must both be true to engage PanelModeOrchestrator. All other combinations
 * fall through to SingleModelOrchestrator (the Phase 3 baseline — no cost,
 * no behaviour change).
 */

import 'server-only'

import { getFlag } from '@/lib/config/index'
import { SingleModelOrchestrator } from './single_model_strategy'
import { PanelModeOrchestrator } from './panel_strategy'
import type { SynthesisOrchestrator, SynthesisRequest } from './types'

/**
 * Creates the appropriate orchestrator based on request and feature flags.
 *
 * PANEL_MODE_ENABLED=true  AND request.panel_opt_in=true → PanelModeOrchestrator
 * Any other combination                                  → SingleModelOrchestrator
 *
 * Callers that don't yet pass a request argument (legacy / tests) always get
 * SingleModelOrchestrator — flag-off behaviour is byte-identical to Phase 3.
 */
export function createOrchestrator(
  request?: Pick<SynthesisRequest, 'panel_opt_in'>,
): SynthesisOrchestrator {
  if (getFlag('PANEL_MODE_ENABLED') && request?.panel_opt_in === true) {
    return new PanelModeOrchestrator()
  }
  return new SingleModelOrchestrator()
}
