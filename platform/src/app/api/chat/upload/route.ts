import { NextResponse } from 'next/server'
import { getServerUser } from '@/lib/firebase/server'
import { createServiceClient } from '@/lib/supabase/server'

const BUCKET = 'chat-attachments'
const MAX_BYTES = 30 * 1024 * 1024 // 30 MB
const ALLOWED_MIME_PREFIXES = ['image/']
const ALLOWED_MIMES = ['application/pdf']
const URL_TTL_SECONDS = 60 * 60 * 24 * 7 // 7 days

function isAllowedMime(mime: string): boolean {
  if (ALLOWED_MIMES.includes(mime)) return true
  return ALLOWED_MIME_PREFIXES.some(prefix => mime.startsWith(prefix))
}

export async function POST(request: Request) {
  const user = await getServerUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return NextResponse.json({ error: 'invalid form body' }, { status: 400 })
  }

  const file = form.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'file required' }, { status: 400 })
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: `file too large (max ${MAX_BYTES / 1024 / 1024} MB)` },
      { status: 413 }
    )
  }
  const mime = file.type || 'application/octet-stream'
  if (!isAllowedMime(mime)) {
    return NextResponse.json(
      { error: 'unsupported file type (images and PDFs only)' },
      { status: 415 }
    )
  }

  const ext = file.name.includes('.') ? file.name.split('.').pop() : null
  const safeExt = ext && /^[a-z0-9]{1,8}$/i.test(ext) ? `.${ext.toLowerCase()}` : ''
  const key = `${user.uid}/${crypto.randomUUID()}${safeExt}`

  const service = createServiceClient()
  const { error: upErr } = await service.storage
    .from(BUCKET)
    .upload(key, file, { contentType: mime, upsert: false })
  if (upErr) {
    return NextResponse.json({ error: upErr.message }, { status: 500 })
  }

  const { data: signed, error: urlErr } = await service.storage
    .from(BUCKET)
    .createSignedUrl(key, URL_TTL_SECONDS)
  if (urlErr || !signed) {
    return NextResponse.json({ error: urlErr?.message ?? 'failed to sign url' }, { status: 500 })
  }

  // Persist metadata so we can re-sign later if the URL expires. conversation_id
  // and message_id are nullable — the upload happens before the message is sent.
  await service.from('chat_attachments').insert({
    user_id: user.uid,
    storage_path: key,
    mime,
    size_bytes: file.size,
  })

  return NextResponse.json({
    url: signed.signedUrl,
    storagePath: key,
    mime,
    filename: file.name,
    size: file.size,
  })
}
