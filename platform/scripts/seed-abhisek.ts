/**
 * Seed script: create Abhisek Mohanty's chart and upload existing pyramid documents.
 *
 * Prerequisites:
 *   1. Supabase project deployed with 001_initial_schema.sql applied
 *   2. chart-documents Storage bucket created (private)
 *   3. Abhisek signed up at ASTROLOGER_EMAIL so his profile has role='astrologer'
 *   4. .env.local populated with real keys
 *
 * Run:
 *   cd platform && npx tsx scripts/seed-abhisek.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'node:fs'
import * as path from 'node:path'
import * as dotenv from 'dotenv'

dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
})

// ── Chart data ────────────────────────────────────────────────────────────────

const CHART = {
  name: 'Abhisek Mohanty',
  birth_date: '1984-02-05',
  birth_time: '10:43:00',
  birth_place: 'Bhubaneswar',
  birth_lat: 20.2961,
  birth_lng: 85.8245,
  ayanamsa: 'lahiri',
  house_system: 'sripathi',
}

// ── Document inventory ────────────────────────────────────────────────────────
// Map: { local file path (relative to project root) → { layer, name } }
// Adjust paths to match where the markdown files actually live.

const DOCUMENT_MAP: Array<{
  localPath: string
  layer: string
  name: string
}> = [
  // L1 — add actual file paths from 01_FACTS_LAYER/
  {
    localPath: '../01_FACTS_LAYER/FORENSIC_ASTROLOGICAL_DATA_v6.0_ABHISEK_MOHANTY.md',
    layer: 'L1',
    name: 'forensic_data',
  },
  // L2.5 — add MSR and CGM when available
  // { localPath: '../025_HOLISTIC_SYNTHESIS/MSR_v1_0.md', layer: 'L2.5', name: 'msr' },
  // Add more as needed
]

// ── Main ──────────────────────────────────────────────────────────────────────

async function getAstrologerClientId(): Promise<string> {
  const astrologerEmail = process.env.ASTROLOGER_EMAIL
  if (!astrologerEmail) throw new Error('ASTROLOGER_EMAIL not set')

  const { data: users, error } = await supabase.auth.admin.listUsers()
  if (error) throw new Error(`Failed to list users: ${error.message}`)

  const user = users.users.find(u => u.email === astrologerEmail)
  if (!user) {
    throw new Error(
      `Astrologer user (${astrologerEmail}) not found. Sign up first at /login.`
    )
  }

  // The astrologer owns this chart — use their profile as client_id
  // (in the app, each client has their own profile; here astrologer is the "client")
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('id', user.id)
    .single()

  if (!profile) throw new Error('Astrologer profile not found')
  return profile.id
}

async function createOrGetChart(clientId: string): Promise<string> {
  // Check if chart already exists
  const { data: existing } = await supabase
    .from('charts')
    .select('id')
    .eq('client_id', clientId)
    .eq('name', CHART.name)
    .single()

  if (existing) {
    console.log(`✓ Chart already exists: ${existing.id}`)
    return existing.id
  }

  const { data: chart, error } = await supabase
    .from('charts')
    .insert({ ...CHART, client_id: clientId })
    .select('id')
    .single()

  if (error || !chart) throw new Error(`Failed to create chart: ${error?.message}`)
  console.log(`✓ Created chart: ${chart.id}`)

  // Create pyramid_layers stubs
  const layers = [
    { layer: 'L1', sublayer: 'facts' },
    { layer: 'L2', sublayer: 'analysis_mode_a' },
    { layer: 'L2', sublayer: 'analysis_mode_b' },
    { layer: 'L2.5', sublayer: 'synthesis' },
    { layer: 'L3', sublayer: 'domain_reports' },
    { layer: 'L4', sublayer: 'query_interface' },
  ]
  await supabase.from('pyramid_layers').insert(
    layers.map(l => ({ chart_id: chart.id, ...l }))
  )
  console.log('✓ Pyramid layers created')

  return chart.id
}

async function uploadDocument(
  chartId: string,
  localPath: string,
  layer: string,
  name: string
): Promise<void> {
  const resolved = path.resolve(process.cwd(), localPath)
  if (!fs.existsSync(resolved)) {
    console.warn(`  ⚠ File not found, skipping: ${resolved}`)
    return
  }

  const content = fs.readFileSync(resolved, 'utf-8')
  const storagePath = `charts/${chartId}/${layer}/${name}_v1.0.md`

  // Check if document already exists
  const { data: existing } = await supabase
    .from('documents')
    .select('id')
    .eq('chart_id', chartId)
    .eq('name', name)
    .single()

  if (existing) {
    console.log(`  ↩ Document already exists: ${name}`)
    return
  }

  const { error: uploadError } = await supabase.storage
    .from('chart-documents')
    .upload(storagePath, content, { contentType: 'text/markdown', upsert: false })

  if (uploadError) {
    console.warn(`  ⚠ Upload failed for ${name}: ${uploadError.message}`)
    return
  }

  const { error: insertError } = await supabase.from('documents').insert({
    chart_id: chartId,
    layer,
    name,
    storage_path: storagePath,
    version: '1.0',
  })

  if (insertError) {
    console.warn(`  ⚠ DB insert failed for ${name}: ${insertError.message}`)
    return
  }

  console.log(`  ✓ Uploaded: ${layer}/${name}`)
}

async function main() {
  console.log('── AM-JIS Seed: Abhisek Mohanty ──')

  const clientId = await getAstrologerClientId()
  console.log(`Astrologer profile: ${clientId}`)

  const chartId = await createOrGetChart(clientId)

  console.log('\nUploading documents…')
  for (const doc of DOCUMENT_MAP) {
    await uploadDocument(chartId, doc.localPath, doc.layer, doc.name)
  }

  console.log('\n── Done ──')
  console.log(`Chart ID: ${chartId}`)
  console.log(`Visit: /clients/${chartId}/build`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
