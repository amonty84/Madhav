import { createClient, createServiceClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { BuildChat } from '@/components/build/BuildChat'

export default async function BuildPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const service = createServiceClient()
  const { data: profile } = await service
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'astrologer') redirect('/dashboard')

  const { data: layers } = await service
    .from('pyramid_layers')
    .select('layer, sublayer, status')
    .eq('chart_id', id)
    .order('layer')
    .order('sublayer')

  return <BuildChat chartId={id} initialLayers={layers ?? []} />
}
