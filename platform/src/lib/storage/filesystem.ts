import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import { telemetry } from '../telemetry/index'

const REPO_ROOT = process.env.MARSYS_REPO_ROOT ?? process.cwd()

function resolveAndCheck(repoRelativePath: string): string {
  const resolved = path.resolve(REPO_ROOT, repoRelativePath)
  if (resolved !== REPO_ROOT && !resolved.startsWith(REPO_ROOT + path.sep)) {
    throw new Error('Path traversal attempt blocked')
  }
  return resolved
}

export const filesystemAdapter = {
  async readFile(repoRelativePath: string): Promise<string> {
    const resolved = resolveAndCheck(repoRelativePath)
    const start = Date.now()
    const content = await fs.readFile(resolved, 'utf-8')
    telemetry.recordLatency('storage.filesystem', 'readFile', Date.now() - start)
    return content
  },

  async fileExists(repoRelativePath: string): Promise<boolean> {
    const resolved = resolveAndCheck(repoRelativePath)
    const start = Date.now()
    try {
      await fs.access(resolved)
      telemetry.recordLatency('storage.filesystem', 'fileExists', Date.now() - start)
      return true
    } catch {
      telemetry.recordLatency('storage.filesystem', 'fileExists', Date.now() - start)
      return false
    }
  },

  async listFiles(repoRelativePath: string, options?: { recursive?: boolean; pattern?: string }): Promise<string[]> {
    const resolved = resolveAndCheck(repoRelativePath)
    const start = Date.now()

    let entries: string[]
    if (options?.recursive) {
      const raw = await fs.readdir(resolved, { recursive: true })
      entries = raw.map((e) => String(e))
    } else {
      entries = await fs.readdir(resolved)
    }

    let filtered = entries
    if (options?.pattern) {
      const pattern = options.pattern
      if (pattern.startsWith('*.')) {
        const ext = pattern.slice(1) // e.g. ".md"
        filtered = entries.filter((e) => e.endsWith(ext))
      }
    }

    // Return as repo-relative paths
    const baseRelative = path.relative(REPO_ROOT, resolved)
    const result = filtered.map((e) => path.join(baseRelative, e))

    telemetry.recordLatency('storage.filesystem', 'listFiles', Date.now() - start)
    return result
  },
}
