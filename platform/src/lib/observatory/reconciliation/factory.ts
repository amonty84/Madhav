// Phase O — O.2 Reconciliation framework: per-provider reconciler factory.
//
// Returns a `ProviderReconciler` for one of the five providers. S2.1 ships
// stubs only — every concrete reconciler throws `NotImplementedError` on
// `fetchAuthoritativeCost`; S2.2–S2.5 replace these stubs in-place.
//
// DeepSeek + NIM are special-cased upstream at the API boundary — they have
// no admin API and require manual CSV upload (see S2.5). The factory still
// returns a stub for them so the framework's shape is uniform.

import { BaseReconciler, type FetchAuthoritativeCostResult } from './base'
import { AnthropicReconciler } from './anthropic'
import {
  NotImplementedError,
  type ProviderName,
  type ProviderReconcileInput,
  type ProviderReconciler,
} from './types'

class NotImplementedReconciler extends BaseReconciler {
  readonly provider: ProviderName
  constructor(provider: ProviderName) {
    super()
    this.provider = provider
  }
  protected async fetchAuthoritativeCost(
    _input: ProviderReconcileInput,
  ): Promise<FetchAuthoritativeCostResult> {
    throw new NotImplementedError(this.provider)
  }
}

/** Providers without an admin API — caller must surface a 400
 *  manual_upload_required response, not call reconcile(). */
export const MANUAL_UPLOAD_PROVIDERS: ReadonlySet<ProviderName> = new Set([
  'deepseek',
  'nim',
])

export function getReconciler(provider: ProviderName): ProviderReconciler {
  if (provider === 'anthropic') return new AnthropicReconciler()
  return new NotImplementedReconciler(provider)
}
