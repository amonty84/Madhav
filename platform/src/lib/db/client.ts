import 'server-only'
import { Pool, QueryResult, QueryResultRow, types } from 'pg'

// Return date/timestamp columns as strings to match TypeScript types
types.setTypeParser(types.builtins.DATE, (v) => v)
types.setTypeParser(types.builtins.TIMESTAMP, (v) => v)
types.setTypeParser(types.builtins.TIMESTAMPTZ, (v) => v)

let _pool: Pool | null = null

async function initPool(): Promise<Pool> {
  if (process.env.DATABASE_URL) {
    // Local dev: Cloud SQL Auth Proxy via DATABASE_URL from .env.rag
    return new Pool({ connectionString: process.env.DATABASE_URL })
  }
  // Production (Cloud Run): cloud-sql-connector authenticates via ADC
  const { Connector } = await import('@google-cloud/cloud-sql-connector')
  const connector = new Connector()
  const clientOpts = await connector.getOptions({
    instanceConnectionName: process.env.INSTANCE_CONNECTION_NAME!,
  })
  return new Pool({
    ...clientOpts,
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
  })
}

export async function getPool(): Promise<Pool> {
  if (!_pool) _pool = await initPool()
  return _pool
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  sql: string,
  params?: unknown[]
): Promise<QueryResult<T>> {
  const pool = await getPool()
  return pool.query<T>(sql, params)
}
