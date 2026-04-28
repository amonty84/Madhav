/**
 * manifest_reader.ts — reads CAPABILITY_MANIFEST.json + manifest_overrides.yaml,
 * merges them, and returns typed ManifestData.
 *
 * In-process cache keyed by fingerprint; reloads automatically if the manifest
 * fingerprint changes between calls (e.g. during integration tests).
 */

import yaml from 'js-yaml'
import { getStorageClient } from '@/lib/storage'
import type { AssetEntry, ManifestData, OverrideEntry, RawManifest } from './types'

// ── Cache ────────────────────────────────────────────────────────────────────

interface CacheEntry {
  fingerprint: string
  data: ManifestData
}

let _cache: CacheEntry | null = null

// ── Public API ───────────────────────────────────────────────────────────────

export async function loadManifest(
  manifestPath = '00_ARCHITECTURE/CAPABILITY_MANIFEST.json',
  overridesPath = '00_ARCHITECTURE/manifest_overrides.yaml',
): Promise<ManifestData> {
  const storage = getStorageClient()

  // Fast-path: read fingerprint only to decide whether to use cache.
  // We always read the full manifest anyway; this avoids a second round-trip by
  // parsing fingerprint from the just-read content.
  const rawManifest = await storage.readFile(manifestPath)
  const manifest: RawManifest = JSON.parse(rawManifest)

  if (_cache && _cache.fingerprint === manifest.fingerprint) {
    return _cache.data
  }

  const rawOverrides = await storage.readFile(overridesPath)
  const overridesDoc = yaml.load(rawOverrides) as {
    overrides?: Record<string, OverrideEntry>
    mirror_pairs?: unknown
    additional_entries?: Partial<AssetEntry>[]
  }
  const overrides: Record<string, OverrideEntry> = overridesDoc?.overrides ?? {}

  const mergedEntries = mergeEntries(manifest.entries, overrides)

  const byId = new Map<string, AssetEntry>()
  for (const e of mergedEntries) {
    byId.set(e.canonical_id, e)
  }

  const data: ManifestData = {
    fingerprint: manifest.fingerprint,
    entries: mergedEntries,
    byId,
  }

  _cache = { fingerprint: manifest.fingerprint, data }
  return data
}

/** Expose for tests: reset the module-level cache. */
export function resetCache(): void {
  _cache = null
}

// ── Merge logic ──────────────────────────────────────────────────────────────

/**
 * For each manifest entry, find the best-matching override (by canonical_id
 * exact-match, or path_pattern substring match as fallback) and merge its
 * fields onto the entry.  Override fields win only when they are defined.
 */
function mergeEntries(
  entries: AssetEntry[],
  overrides: Record<string, OverrideEntry>,
): AssetEntry[] {
  return entries.map(entry => {
    const overrideKey = findOverrideKey(entry, overrides)
    if (!overrideKey) return { ...entry }

    const ov = overrides[overrideKey]
    const merged: AssetEntry = {
      ...entry,
      ...(ov.preferred_for !== undefined ? { preferred_for: ov.preferred_for } : {}),
      ...(ov.cost_weight !== undefined ? { cost_weight: ov.cost_weight } : {}),
      ...(ov.always_required !== undefined ? { always_required: ov.always_required } : {}),
    }
    return merged
  })
}

function findOverrideKey(
  entry: AssetEntry,
  overrides: Record<string, OverrideEntry>,
): string | null {
  // 1. Exact canonical_id match (case-sensitive)
  if (overrides[entry.canonical_id]) return entry.canonical_id

  // 2. path_pattern substring match
  for (const [key, ov] of Object.entries(overrides)) {
    if (ov.path_pattern && entry.path.includes(ov.path_pattern)) {
      return key
    }
  }

  return null
}

// ── Tier helpers ─────────────────────────────────────────────────────────────

/**
 * Returns all entries that are considered Tier-1 eligible — i.e. they are
 * exposed to chat and have CURRENT status.
 */
export function getTier1Entries(data: ManifestData): AssetEntry[] {
  return data.entries.filter(e => e.expose_to_chat && e.status === 'CURRENT')
}
