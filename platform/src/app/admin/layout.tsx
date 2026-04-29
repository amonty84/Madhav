import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getServerUserWithProfile } from '@/lib/auth/access-control'
import { AppShell } from '@/components/shared/AppShell'
import { Logo } from '@/components/brand/Logo'
import { Wordmark } from '@/components/brand/Wordmark'
import { AdminSignOut } from '@/components/admin/AdminSignOut'
import { configService } from '@/lib/config'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const ctx = await getServerUserWithProfile()
  if (!ctx) redirect('/login')
  if (ctx.profile.role !== 'super_admin') redirect('/dashboard')
  if (ctx.profile.status !== 'active') redirect('/login')

  if (!configService.getFlag('PORTAL_REDESIGN_R0_ENABLED')) {
    return (
      <div className="min-h-[100dvh] bg-[#070605] text-[#fce29a]">
        <header className="border-b border-[#211a08] bg-[#0a0805]">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
            <Link href="/dashboard" className="flex items-center gap-3">
              <Logo size="sm" />
              <Wordmark tagline="ADMIN" className="text-[18px] tracking-[0.16em]" />
            </Link>
            <AdminSignOut />
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
      </div>
    )
  }

  return (
    <AppShell
      user={ctx.user}
      profile={ctx.profile}
      breadcrumb={[{ label: 'Admin', current: true }]}
    >
      {children}
    </AppShell>
  )
}
