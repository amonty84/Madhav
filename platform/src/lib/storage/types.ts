export interface StorageClient {
  query<T = unknown>(sql: string, params?: unknown[]): Promise<{ rows: T[]; rowCount: number }>
  transaction<T>(fn: (tx: TransactionClient) => Promise<T>): Promise<T>
  readObject(bucket: string, path: string): Promise<Buffer>
  writeObject(bucket: string, path: string, content: Buffer | string, contentType?: string): Promise<void>
  objectExists(bucket: string, path: string): Promise<boolean>
  readFile(repoRelativePath: string): Promise<string>
  fileExists(repoRelativePath: string): Promise<boolean>
  listFiles(repoRelativePath: string, options?: { recursive?: boolean; pattern?: string }): Promise<string[]>
}

export interface TransactionClient {
  query<T = unknown>(sql: string, params?: unknown[]): Promise<{ rows: T[]; rowCount: number }>
}
