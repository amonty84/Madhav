/**
 * build.ts — CLI entry-point for the Capability Manifest Builder
 * Phase 1A: informational only. Does not replace FILE_REGISTRY or CANONICAL_ARTIFACTS.
 *
 * Usage: tsx src/scripts/manifest/build.ts
 */

import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { createHash } from 'node:crypto'
import { deriveManifest } from './auto_deriver'
import { mergeOverrides } from './override_merger'
import { validate } from '../../lib/schemas/index'

// Repo root is four levels up from platform/src/scripts/manifest/
// __dirname = .../Madhav/platform/src/scripts/manifest
// 4 up     = .../Madhav (repo root)
const REPO_ROOT = join(__dirname, '..', '..', '..', '..')
const OUTPUT_PATH = join(REPO_ROOT, '00_ARCHITECTURE', 'CAPABILITY_MANIFEST.json')

async function main(): Promise<void> {
  console.log('[manifest:build] Starting Capability Manifest Builder...')

  // Step 1: Derive base entries from filesystem + frontmatter
  const baseEntries = await deriveManifest()
  console.log(`[manifest:build] Derived ${baseEntries.length} base entries`)

  // Step 2: Merge override fields
  const enrichedEntries = await mergeOverrides(baseEntries)
  console.log(`[manifest:build] Applied overrides to entries`)

  // Step 3: Validate each entry against the asset_entry schema
  let validationErrorCount = 0
  for (const entry of enrichedEntries) {
    const result = validate('asset_entry', entry)
    if (!result.valid) {
      console.warn(`[manifest:build] Validation errors for ${entry.canonical_id} (${entry.path}):`)
      for (const err of result.errors ?? []) {
        console.warn(`  - ${err.path}: ${err.message}`)
      }
      validationErrorCount++
    }
  }
  if (validationErrorCount > 0) {
    console.warn(`[manifest:build] ${validationErrorCount} entries failed schema validation (proceeding)`)
  }

  // Step 4: Build manifest object
  const entriesJson = JSON.stringify(enrichedEntries)
  const manifestFingerprint = createHash('sha256').update(entriesJson).digest('hex')

  const manifest = {
    generated_at: new Date().toISOString(),
    generator_version: '1.0',
    entry_count: enrichedEntries.length,
    fingerprint: manifestFingerprint,
    entries: enrichedEntries,
  }

  // Step 5: Write to 00_ARCHITECTURE/CAPABILITY_MANIFEST.json
  writeFileSync(OUTPUT_PATH, JSON.stringify(manifest, null, 2), 'utf-8')

  // Step 6: Log summary
  console.log(`[manifest:build] Manifest built: ${enrichedEntries.length} entries, fingerprint: ${manifestFingerprint}`)
  console.log(`[manifest:build] Output: ${OUTPUT_PATH}`)

  process.exit(0)
}

main().catch(err => {
  console.error('[manifest:build] Fatal error:', err)
  process.exit(1)
})
