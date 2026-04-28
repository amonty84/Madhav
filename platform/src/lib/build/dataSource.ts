import 'server-only'
import type { BuildState, SessionDetail, PhaseDetail } from './types'

const GCS_BASE =
  process.env.BUILD_STATE_GCS_BASE ??
  'https://storage.googleapis.com/marsys-jis-build-state'

export async function fetchBuildState(): Promise<BuildState> {
  const res = await fetch(`${GCS_BASE}/build-state.json`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`GCS build-state fetch failed: ${res.status}`)
  return res.json() as Promise<BuildState>
}

export async function fetchSessionDetail(id: string): Promise<SessionDetail | null> {
  const res = await fetch(
    `${GCS_BASE}/sessions/${encodeURIComponent(id)}.json`,
    { cache: 'no-store' }
  )
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`GCS session fetch failed: ${res.status}`)
  return res.json() as Promise<SessionDetail>
}

export async function fetchPhaseDetail(id: string): Promise<PhaseDetail | null> {
  const res = await fetch(
    `${GCS_BASE}/phases/${encodeURIComponent(id)}.json`,
    { cache: 'no-store' }
  )
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`GCS phase fetch failed: ${res.status}`)
  return res.json() as Promise<PhaseDetail>
}
