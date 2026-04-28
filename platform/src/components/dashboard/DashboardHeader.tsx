'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signOut as firebaseSignOut } from 'firebase/auth'
import { auth } from '@/lib/firebase/client'
import { Logo } from '@/components/brand/Logo'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function DashboardHeader({
  userInitial,
  isSuperAdmin,
}: {
  userInitial: string
  isSuperAdmin: boolean
}) {
  const router = useRouter()

  async function handleSignOut() {
    await fetch('/api/auth/session', { method: 'DELETE' }).catch(() => {})
    await firebaseSignOut(auth).catch(() => {})
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
        <Link href="/dashboard" className="flex items-center gap-3">
          <Logo size="sm" />
          <span className="font-serif text-lg font-medium tracking-[0.14em]">
            MARSYS-JIS
          </span>
        </Link>
        <div className="flex items-center gap-4">
          {isSuperAdmin && (
            <Link
              href="/audit"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Audit
            </Link>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger className="grid h-9 w-9 place-items-center rounded-full border border-border bg-muted text-sm font-medium text-foreground transition-colors hover:bg-accent">
              {userInitial}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isSuperAdmin && (
                <>
                  <DropdownMenuItem onClick={() => router.push('/admin')}>
                    User management
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
