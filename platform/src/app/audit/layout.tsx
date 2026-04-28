import { redirect } from 'next/navigation'
import { getServerUserWithProfile } from '@/lib/auth/access-control'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'

export default async function AuditLayout({ children }: { children: React.ReactNode }) {
  const ctx = await getServerUserWithProfile()
  if (!ctx) redirect('/login')
  if (ctx.profile.status !== 'active') redirect('/login')
  if (ctx.profile.role !== 'super_admin') redirect('/dashboard')

  const initial = (ctx.user.email?.[0] ?? ctx.user.name?.[0] ?? 'U').toUpperCase()

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <DashboardHeader userInitial={initial} isSuperAdmin />
      <main>{children}</main>
    </div>
  )
}
