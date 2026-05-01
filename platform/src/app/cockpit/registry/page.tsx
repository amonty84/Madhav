import { fetchBuildState } from '@/lib/build/dataSource'
import { RegistryGrouped } from '@/components/build/RegistryGrouped'

export const dynamic = 'force-dynamic'

export default async function BuildRegistryPage() {
  const state = await fetchBuildState()
  return (
    <main className="mx-auto max-w-5xl px-4 py-6">
      <div className="mb-6 flex items-baseline justify-between">
        <h1 className="bt-display">The Corpus</h1>
        <p className="bt-body text-muted-foreground">
          {state.canonical_artifacts.length} artifacts, organized by purpose
        </p>
      </div>
      <RegistryGrouped artifacts={state.canonical_artifacts} />
    </main>
  )
}
