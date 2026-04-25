import { getServerUser } from '@/lib/firebase/server'
import { createServiceClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

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

  const service = createServiceClient()
  const [{ data: profile }, { data: chart }] = await Promise.all([
    service.from('profiles').select('role').eq('id', user.uid).single(),
    service.from('charts').select('client_id').eq('id', id).single(),
  ])

  if (!chart) redirect('/dashboard')
  if (profile?.role !== 'super_admin' && chart.client_id !== user.uid) redirect('/dashboard')

  return <div className="flex h-[100dvh] flex-col">{children}</div>
}
