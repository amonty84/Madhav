import { getServerUser } from '@/lib/firebase/server'
import { query } from '@/lib/db/client'
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

  const profileResult = await query<{ role: string }>(
    'SELECT role FROM profiles WHERE id=$1',
    [user.uid]
  )
  const profile = profileResult.rows[0] ?? null

  if (profile?.role !== 'super_admin') redirect('/dashboard')

  const layersResult = await query<{ layer: string; sublayer: string; status: 'not_started' | 'in_progress' | 'complete' }>(
    'SELECT layer, sublayer, status FROM pyramid_layers WHERE chart_id=$1 ORDER BY layer, sublayer',
    [id]
  )

  return <BuildChat chartId={id} initialLayers={layersResult.rows} />
}
