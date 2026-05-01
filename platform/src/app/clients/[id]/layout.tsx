import { getServerUser } from '@/lib/firebase/server'
import { query } from '@/lib/db/client'
import { redirect } from 'next/navigation'
import { AppShell } from '@/components/shared/AppShell'
import { ZoneRoot } from '@/components/shared/ZoneRoot'

export default async function ClientLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await getServerUser()
  if (!user) redirect('/login')

  const [profileResult, chartResult] = await Promise.all([
    query<{ role: string; status: string }>('SELECT role, status FROM profiles WHERE id=$1', [user.uid]),
    query<{ client_id: string; name: string }>('SELECT client_id, name FROM charts WHERE id=$1', [id]),
  ])

  const profile = profileResult.rows[0] ?? null
  const chart = chartResult.rows[0] ?? null

  if (!chart) redirect('/dashboard')
  if (profile?.role !== 'super_admin' && chart.client_id !== user.uid) redirect('/dashboard')

  return (
    <ZoneRoot zone="ink">
      <AppShell
        user={user}
        profile={{ role: (profile?.role as 'super_admin' | 'client') ?? 'client', status: 'active' }}
        breadcrumb={[
          { label: 'Roster', href: '/dashboard' },
          { label: chart.name ?? id, href: `/clients/${id}`, current: true },
        ]}
      >
        {children}
      </AppShell>
    </ZoneRoot>
  )
}
