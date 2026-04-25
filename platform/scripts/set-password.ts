/**
 * One-time script: set a password for the astrologer account.
 * Run: cd platform && npx tsx scripts/set-password.ts
 */
import { createClient } from '@supabase/supabase-js'
import * as path from 'node:path'
import * as dotenv from 'dotenv'

dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } }
)

const EMAIL = process.env.SUPER_ADMIN_EMAIL!
const PASSWORD = process.argv[2] ?? 'amjis2024'

async function main() {
  const { data: { users } } = await supabase.auth.admin.listUsers()
  const user = users.find(u => u.email === EMAIL)
  if (!user) {
    console.error(`User not found: ${EMAIL}`)
    process.exit(1)
  }

  const { error } = await supabase.auth.admin.updateUserById(user.id, { password: PASSWORD })
  if (error) {
    console.error('Failed:', error.message)
    process.exit(1)
  }

  console.log(`✓ Password set for ${EMAIL}`)
  console.log(`  Login with: ${EMAIL} / ${PASSWORD}`)
}

main().catch(err => { console.error(err); process.exit(1) })
