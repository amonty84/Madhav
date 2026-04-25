import { getServerUser } from '@/lib/firebase/server'
import { createServiceClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { BuildChat } from '@/components/build/BuildChat'

export default async function BuildPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const user = await getServerUser()
  if (!user) redirect('/login')

  const service = createServiceClient()
  const { data: profile } = await service
    .from('profiles')
    .select('role')
    .eq('id', user.uid)
    .single()

  if (profile?.role !== 'super_admin') redirect('/dashboard')

  const { data: layers } = await service
    .from('pyramid_layers')
    .select('layer, sublayer, status')
    .eq('chart_id', id)
    .order('layer')
    .order('sublayer')

  return <BuildChat chartId={id} initialLayers={layers ?? []} />
}
