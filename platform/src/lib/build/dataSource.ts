import 'server-only'
import { Storage } from '@google-cloud/storage'
import { query } from '@/lib/db/client'
import type { BuildState, SessionDetail, PhaseDetail } from './types'

export interface ActiveChartEntry {
  id: string
  client_id: string
  name: string
  build_pct: number
  last_activity: string | null
  health: 'green' | 'amber' | 'red'
}

// 60-second in-memory cache so the cockpit page doesn't hammer the DB on every render.
let _activeChartsCache: { data: ActiveChartEntry[]; ts: number } | null = null

function healthDot(lastActivity: string | null): 'green' | 'amber' | 'red' {
  if (!lastActivity) return 'red'
  const ageMs = Date.now() - new Date(lastActivity).getTime()
  const ageDays = ageMs / 86_400_000
  if (ageDays <= 7) return 'green'
  if (ageDays <= 30) return 'amber'
  return 'red'
}

export async function getActiveCharts({ limit = 5 }: { limit?: number } = {}): Promise<ActiveChartEntry[]> {
  const now = Date.now()
  if (_activeChartsCache && now - _activeChartsCache.ts < 60_000) {
    return _activeChartsCache.data.slice(0, limit)
  }

  type ActiveChartRow = {
    id: string
    client_id: string
    name: string
    build_pct: number
    last_activity: string | null
  }

  const result = await query<ActiveChartRow>(
    `SELECT
       c.id,
       c.client_id,
       c.name,
       COALESCE(
         COUNT(CASE WHEN pl.status = 'complete' THEN 1 END) * 100.0
           / NULLIF(COUNT(pl.id), 0),
         0
       )::numeric(5,1)::float AS build_pct,
       MAX(conv.created_at) AS last_activity
     FROM charts c
     LEFT JOIN pyramid_layers pl ON pl.chart_id = c.id
     LEFT JOIN conversations conv ON conv.chart_id = c.id
     GROUP BY c.id, c.client_id, c.name
     ORDER BY last_activity DESC NULLS LAST
     LIMIT $1`,
    [50]
  )

  const data: ActiveChartEntry[] = result.rows.map((row: ActiveChartRow) => ({
    ...row,
    build_pct: Number(row.build_pct),
    health: healthDot(row.last_activity),
  }))

  _activeChartsCache = { data, ts: now }
  return data.slice(0, limit)
}

let _storage: Storage | null = null
let _bucketName: string | null = null

function getStorage(): { storage: Storage; bucketName: string } {
  if (_storage && _bucketName) return { storage: _storage, bucketName: _bucketName }

  const base = process.env.BUILD_STATE_GCS_BASE
  if (!base) {
    throw new Error(
      'BUILD_STATE_GCS_BASE env var not set — build dashboard will not function. ' +
      'Set to https://storage.googleapis.com/madhav-marsys-build-artifacts or a dedicated bucket.'
    )
  }
  const match = base.match(/https:\/\/storage\.googleapis\.com\/([^/]+)/)
  if (!match) {
    throw new Error(
      `BUILD_STATE_GCS_BASE has unexpected format: ${base}. ` +
      'Expected: https://storage.googleapis.com/<bucket-name>'
    )
  }
  _storage = new Storage()
  _bucketName = match[1]
  return { storage: _storage, bucketName: _bucketName }
}

async function readGCSJson<T>(objectPath: string): Promise<T> {
  const { storage, bucketName } = getStorage()
  const [contents] = await storage.bucket(bucketName).file(objectPath).download()
  return JSON.parse(contents.toString()) as T
}

export async function fetchBuildState(): Promise<BuildState> {
  return readGCSJson<BuildState>('build-state.json')
}

export async function fetchSessionDetail(id: string): Promise<SessionDetail | null> {
  try {
    return await readGCSJson<SessionDetail>(`sessions/${id}.json`)
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'code' in err && (err as { code: number }).code === 404) return null
    throw err
  }
}

export async function fetchPhaseDetail(id: string): Promise<PhaseDetail | null> {
  try {
    return await readGCSJson<PhaseDetail>(`phases/${id}.json`)
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'code' in err && (err as { code: number }).code === 404) return null
    throw err
  }
}
