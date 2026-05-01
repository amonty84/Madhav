import { DEFAULT_FLAGS, FLAG_ENV_PREFIX, type FeatureFlag } from './feature_flags'

export type { FeatureFlag }
export { DEFAULT_FLAGS }

type Subscriber = (key: string, value: unknown) => void
type Unsubscribe = () => void

class ConfigServiceImpl {
  private flags: Record<FeatureFlag, boolean>
  private values: Record<string, unknown> = {}
  private subscribers: Set<Subscriber> = new Set()

  constructor() {
    this.flags = { ...DEFAULT_FLAGS }
    this.loadEnvOverrides()
  }

  private loadEnvOverrides(): void {
    for (const flag of Object.keys(DEFAULT_FLAGS) as FeatureFlag[]) {
      const envKey = `${FLAG_ENV_PREFIX}${flag}`
      const envVal = process.env[envKey]
      if (envVal !== undefined) {
        this.flags[flag] = envVal.toLowerCase() === 'true'
      }
    }
  }

  getFlag(name: FeatureFlag): boolean {
    return this.flags[name]
  }

  setFlag(name: FeatureFlag, value: boolean): void {
    this.flags[name] = value
    this.notify(name, value)
  }

  getValue<T>(key: string, defaultValue: T): T {
    if (key in this.values) return this.values[key] as T
    return defaultValue
  }

  setValue<T>(key: string, value: T): void {
    this.values[key] = value
    this.notify(key, value)
  }

  subscribe(callback: Subscriber): Unsubscribe {
    this.subscribers.add(callback)
    return () => this.subscribers.delete(callback)
  }

  private notify(key: string, value: unknown): void {
    for (const sub of this.subscribers) {
      sub(key, value)
    }
  }
}

// Singleton — all components share one config instance.
// In test environments, create a fresh instance per test via createConfigService().
const _instance = new ConfigServiceImpl()

export const configService = _instance

export function getFlag(name: FeatureFlag): boolean {
  return _instance.getFlag(name)
}

export function createConfigService(): ConfigServiceImpl {
  return new ConfigServiceImpl()
}
