import { getServerUser } from '@/lib/firebase/server'
import { createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ chartId: string; domain: string }> }
) {
  const { chartId, domain } = await params

  const user = await getServerUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const service = createServiceClient()
  const [{ data: chart }, { data: profile }] = await Promise.all([
    service.from('charts').select('client_id').eq('id', chartId).single(),
    service.from('profiles').select('role').eq('id', user.uid).single(),
  ])

  if (!chart) return NextResponse.json({ error: 'not found' }, { status: 404 })
  if (profile?.role !== 'super_admin' && chart.client_id !== user.uid) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const { data: report, error } = await service
    .from('reports')
    .select('title, domain, version, storage_path')
    .eq('chart_id', chartId)
    .eq('domain', domain)
    .order('updated_at', { ascending: false })
    .limit(1)
    .single()

  if (error || !report) return NextResponse.json({ error: 'Report not found' }, { status: 404 })

  const { data: blob, error: storageError } = await service.storage
    .from('chart-documents')
    .download(report.storage_path)

  if (storageError || !blob) {
    return NextResponse.json({ error: storageError?.message ?? 'Download failed' }, { status: 500 })
  }

  const content = await blob.text()
  return NextResponse.json({ domain: report.domain, title: report.title, version: report.version, content })
}
