export * from './types'
export { postgresAdapter } from './postgres'
export { gcsAdapter } from './gcs'
export { filesystemAdapter } from './filesystem'

import type { StorageClient } from './types'
import { postgresAdapter } from './postgres'
import { gcsAdapter } from './gcs'
import { filesystemAdapter } from './filesystem'

let _client: StorageClient | null = null

export function getStorageClient(): StorageClient {
  if (!_client) {
    _client = {
      ...postgresAdapter,
      ...gcsAdapter,
      ...filesystemAdapter,
    }
  }
  return _client
}
