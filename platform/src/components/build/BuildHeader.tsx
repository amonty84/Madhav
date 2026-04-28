'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
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
import { RefreshButton } from './RefreshButton'

const NAV_LINKS = [
  { href: '/build', label: 'Cockpit' },
  { href: '/build/plan', label: 'Plan' },
  { href: '/build/sessions', label: 'Sessions' },
  { href: '/build/registry', label: 'Registry' },
  { href: '/build/interventions', label: 'Interventions' },
  { href: '/build/parallel', label: 'Parallel' },
  { href: '/build/health', label: 'Health' },
  { href: '/build/activity', label: 'Activity' },
]

export function BuildHeader({ userInitial }: { userInitial: string }) {
  const router = useRouter()
  const pathname = usePathname()

  async function handleSignOut() {
    await fetch('/api/auth/session', { method: 'DELETE' }).catch(() => {})
    await firebaseSignOut(auth).catch(() => {})
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2">
        <div className="flex items-center gap-4">
          <Link href="/build" className="flex items-center gap-2 shrink-0">
            <Logo size="sm" />
            <span className="font-serif text-sm font-medium tracking-[0.14em]">BUILD</span>
          </Link>
          <nav className="hidden items-center gap-0.5 md:flex">
            {NAV_LINKS.map(({ href, label }) => {
              const isActive =
                href === '/build' ? pathname === '/build' : pathname.startsWith(href)
              return (
                <Link
                  key={href}
                  href={href}
                  className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {label}
                </Link>
              )
            })}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <RefreshButton />
          <DropdownMenu>
            <DropdownMenuTrigger className="grid h-8 w-8 place-items-center rounded-full border border-border bg-muted text-xs font-medium text-foreground transition-colors hover:bg-accent">
              {userInitial}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/admin')}>
                Admin
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
