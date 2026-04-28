import { redirect } from 'next/navigation'
import { getServerUserWithProfile } from '@/lib/auth/access-control'
import { BuildHeader } from '@/components/build/BuildHeader'
import { FreshnessIndicator } from '@/components/build/FreshnessIndicator'
import { fetchBuildState } from '@/lib/build/dataSource'

export default async function BuildLayout({ children }: { children: React.ReactNode }) {
  const ctx = await getServerUserWithProfile()
  if (!ctx) redirect('/login')
  if (ctx.profile.status !== 'active') redirect('/login')
  if (ctx.profile.role !== 'super_admin') redirect('/dashboard')

  const initial = (ctx.user.email?.[0] ?? 'U').toUpperCase()

  // Best-effort: if GCS is unavailable, freshness indicator is simply omitted
  let generatedAt: string | null = null
  try {
    const state = await fetchBuildState()
    generatedAt = state.generated_at
  } catch {
    // silently skip
  }

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <BuildHeader userInitial={initial} />
      {children}
      {generatedAt && (
        <footer className="border-t border-border px-4 py-2 flex justify-end">
          <FreshnessIndicator generatedAt={generatedAt} />
        </footer>
      )}
    </div>
  )
}
