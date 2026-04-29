import 'server-only'
import { Storage } from '@google-cloud/storage'
import type { BuildState, SessionDetail, PhaseDetail } from './types'

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
