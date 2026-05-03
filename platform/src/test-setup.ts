import '@testing-library/jest-dom'
import { vi } from 'vitest'

// `@/lib/db/monitoring-write` carries `import 'server-only'`, which refuses to
// load under jsdom. Every retrieve tool now imports `writeToolExecutionLog`
// from this module (MON-7); without a global stub, every transitively-touching
// test file would have to declare its own vi.mock. This stub is opt-out: any
// test that needs the real module can override with a local vi.mock.
vi.mock('@/lib/db/monitoring-write', () => ({
  writeLlmCallLog: vi.fn(),
  writeQueryPlanLog: vi.fn(),
  writeToolExecutionLog: vi.fn(),
  writeContextAssemblyLog: vi.fn(),
  resolveProvider: vi.fn(() => 'mock'),
}))
