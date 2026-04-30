import { NextResponse } from 'next/server'
import { getServerUser } from '@/lib/firebase/server'
import { query } from '@/lib/db/client'
import { chatBucket, gcsSignedUpload } from '@/lib/storage/client'
import { res } from '@/lib/errors'

const MAX_BYTES = 30 * 1024 * 1024 // 30 MB
const ALLOWED_MIME_PREFIXES = ['image/']
const ALLOWED_MIMES = ['application/pdf']

function isAllowedMime(mime: string): boolean {
  if (ALLOWED_MIMES.includes(mime)) return true
  return ALLOWED_MIME_PREFIXES.some(prefix => mime.startsWith(prefix))
}

export async function POST(request: Request) {
  const user = await getServerUser()
  if (!user) return res.unauthenticated()

  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return res.badRequest('invalid form body')
  }

  const file = form.get('file')
  if (!(file instanceof File)) {
    return res.badRequest('file required')
  }
  if (file.size > MAX_BYTES) {
    return res.badRequest(`file too large (max ${MAX_BYTES / 1024 / 1024} MB)`)
  }
  const mime = file.type || 'application/octet-stream'
  if (!isAllowedMime(mime)) {
    return res.badRequest('unsupported file type (images and PDFs only)')
  }

  const ext = file.name.includes('.') ? file.name.split('.').pop() : null
  const safeExt = ext && /^[a-z0-9]{1,8}$/i.test(ext) ? `.${ext.toLowerCase()}` : ''
  const storagePath = `${user.uid}/${crypto.randomUUID()}${safeExt}`

  let uploadUrl: string
  try {
    uploadUrl = await gcsSignedUpload(chatBucket(), storagePath, mime)
  } catch {
    return res.internal('failed to create upload URL')
  }

  // Persist metadata so we can re-sign later if the URL expires. conversation_id
  // and message_id are nullable — the upload happens before the message is sent.
  let rows: { id: string }[]
  try {
    const result = await query<{ id: string }>(
      'INSERT INTO chat_attachments (user_id, storage_path, mime, size_bytes) VALUES ($1,$2,$3,$4) RETURNING id',
      [user.uid, storagePath, mime, file.size]
    )
    rows = result.rows
  } catch {
    return res.internal('attachment metadata persist failed')
  }

  return NextResponse.json({
    id: rows[0]?.id,
    uploadUrl,
    storagePath,
    mime,
    filename: file.name,
    size: file.size,
  })
}
