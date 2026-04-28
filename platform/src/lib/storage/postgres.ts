import { query as dbQuery, getPool } from '../db/client'
import { telemetry } from '../telemetry/index'
import type { TransactionClient } from './types'

export const postgresAdapter = {
  async query<T = unknown>(sql: string, params?: unknown[]): Promise<{ rows: T[]; rowCount: number }> {
    const start = Date.now()
    const result = await dbQuery<T extends Record<string, unknown> ? T : Record<string, unknown>>(sql, params)
    telemetry.recordLatency('storage.postgres', 'query', Date.now() - start)
    return { rows: result.rows as T[], rowCount: result.rowCount ?? 0 }
  },

  async transaction<T>(fn: (tx: TransactionClient) => Promise<T>): Promise<T> {
    const start = Date.now()
    const pool = await getPool()
    const client = await pool.connect()
    try {
      await client.query('BEGIN')
      const tx: TransactionClient = {
        async query<R = unknown>(sql: string, params?: unknown[]): Promise<{ rows: R[]; rowCount: number }> {
          const res = await client.query(sql, params)
          return { rows: res.rows as R[], rowCount: res.rowCount ?? 0 }
        },
      }
      const result = await fn(tx)
      await client.query('COMMIT')
      telemetry.recordLatency('storage.postgres', 'transaction', Date.now() - start)
      return result
    } catch (err) {
      await client.query('ROLLBACK')
      throw err
    } finally {
      client.release()
    }
  },
}
