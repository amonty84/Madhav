import { redirect } from 'next/navigation'
import { getServerUserWithProfile } from '@/lib/auth/access-control'
import { AppShell } from '@/components/shared/AppShell'
import { configService } from '@/lib/config'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const ctx = await getServerUserWithProfile()
  if (!ctx) redirect('/login')
  if (ctx.profile.status !== 'active') redirect('/login')

  if (!configService.getFlag('PORTAL_REDESIGN_R0_ENABLED')) {
    return (
      <div className="min-h-[100dvh] bg-background text-foreground">{children}</div>
    )
  }

  return (
    <AppShell
      user={ctx.user}
      profile={ctx.profile}
      breadcrumb={[{ label: 'Roster', current: true }]}
    >
      {children}
    </AppShell>
  )
}
