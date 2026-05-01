import { describe, it } from 'vitest'
import type { StorageClient, TransactionClient } from '../types'

describe('StorageClient types', () => {
  it('types compile correctly', () => {
    // compile-time only — verifies the types exist and are assignable
    const _check: StorageClient = undefined as unknown as StorageClient
    const _checkTx: TransactionClient = undefined as unknown as TransactionClient
    void _check
    void _checkTx
  })
})
