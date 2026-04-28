import { NextResponse } from 'next/server'
import { getServerUser } from '@/lib/firebase/server'
import { query } from '@/lib/db/client'

export async function GET(request: Request) {
  const user = await getServerUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const url = new URL(request.url)
  const type = url.searchParams.get('type')
  const id = url.searchParams.get('id')

  if (!type || !id) {
    return NextResponse.json({ error: 'type and id are required' }, { status: 400 })
  }

  if (!['signal', 'asset', 'chunk'].includes(type)) {
    return NextResponse.json({ error: 'type must be signal, asset, or chunk' }, { status: 400 })
  }

  if (type === 'signal') {
    const result = await query<{
      signal_id: string
      domain: string
      claim_text: string
      classical_basis: string | null
      confidence: number
      significance: number
    }>(
      'SELECT signal_id, domain, claim_text, classical_basis, confidence, significance FROM msr_signals WHERE signal_id=$1 LIMIT 1',
      [id]
    )
    const row = result.rows[0]
    if (!row) return NextResponse.json({ error: 'not found' }, { status: 404 })

    return NextResponse.json({
      title: row.signal_id,
      content: row.claim_text + (row.classical_basis ? '\n\n' + row.classical_basis : ''),
      meta: `Domain: ${row.domain} · Confidence: ${(row.confidence * 100).toFixed(0)}% · Significance: ${(row.significance * 100).toFixed(0)}%`,
    })
  }

  if (type === 'chunk') {
    const result = await query<{
      chunk_id: string
      doc_type: string
      layer: string
      content: string
      source_file: string
    }>(
      'SELECT chunk_id, doc_type, layer, content, source_file FROM rag_chunks WHERE chunk_id=$1 LIMIT 1',
      [id]
    )
    const row = result.rows[0]
    if (!row) return NextResponse.json({ error: 'not found' }, { status: 404 })

    return NextResponse.json({
      title: row.chunk_id,
      content: row.content,
      meta: `${row.doc_type} · ${row.layer} · ${row.source_file}`,
    })
  }

  // type === 'asset'
  // Assets are canonical corpus documents. Query rag_chunks for the first chunk
  // where source_file contains the asset ID (e.g. "CGM" matches "CGM_v9_0.md").
  const result = await query<{
    chunk_id: string
    doc_type: string
    content: string
    source_file: string
  }>(
    `SELECT chunk_id, doc_type, content, source_file
     FROM rag_chunks
     WHERE source_file ILIKE $1
     ORDER BY chunk_id
     LIMIT 1`,
    [`%${id}%`]
  )
  const row = result.rows[0]
  if (!row) return NextResponse.json({ error: 'not found' }, { status: 404 })

  return NextResponse.json({
    title: id,
    content: row.content,
    meta: `Asset corpus: ${row.source_file} (${row.doc_type})`,
  })
}
