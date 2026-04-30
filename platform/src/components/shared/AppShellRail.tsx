'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { signOut as firebaseSignOut } from 'firebase/auth'
import { auth } from '@/lib/firebase/client'
import { Sigil } from '@/components/brand/Sigil'
import {
  LayoutGrid,
  Gauge,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

interface AppShellRailProps {
  user: { uid: string; email?: string; name?: string }
  profile: { role: 'super_admin' | 'admin' | 'client'; status?: string }
}

const NAV_ITEMS: { href: string; label: string; icon: LucideIcon; roles: readonly string[] }[] = [
  { href: '/dashboard', label: 'Roster',  icon: LayoutGrid, roles: ['super_admin', 'admin', 'client'] },
  { href: '/cockpit',   label: 'Cockpit', icon: Gauge,       roles: ['super_admin'] },
  { href: '/admin',     label: 'Admin',   icon: ShieldCheck, roles: ['super_admin', 'admin'] },
]

export function AppShellRail({ user, profile }: AppShellRailProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [expanded, setExpanded] = useState(false)

  async function handleSignOut() {
    await fetch('/api/auth/session', { method: 'DELETE' }).catch(() => {})
    await firebaseSignOut(auth).catch(() => {})
    router.push('/login')
    router.refresh()
  }

  const visibleItems = NAV_ITEMS.filter(item => item.roles.includes(profile.role))
  const userInitial = (user.name?.[0] ?? user.email?.[0] ?? 'U').toUpperCase()

  return (
    <nav
      aria-label="Primary navigation"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className={cn(
        'hidden h-full shrink-0 flex-col border-r border-sidebar-border bg-sidebar py-3',
        'transition-[width] duration-200 ease-in-out md:flex',
        expanded ? 'w-48 z-50 shadow-[4px_0_24px_rgba(0,0,0,0.4)]' : 'w-14',
      )}
    >
      {/* Logo */}
      <div className={cn('mb-4 flex', expanded ? 'items-center gap-3 px-4' : 'justify-center')}>
        <Link
          href="/dashboard"
          aria-label="MARSYS-JIS — go to Roster"
          className={cn(
            'text-[var(--brand-gold)] transition-[filter,transform] duration-200',
            expanded
              ? 'drop-shadow-[0_0_10px_var(--brand-gold)]'
              : 'hover:drop-shadow-[0_0_10px_var(--brand-gold)] hover:scale-110'
          )}
        >
          <Sigil size={30} />
        </Link>
        {expanded && (
          <span className="text-[10px] font-semibold uppercase leading-tight tracking-[0.2em] text-[var(--brand-gold)] opacity-70">
            MARSYS<br />JIS
          </span>
        )}
      </div>

      {/* Nav links */}
      <div className={cn('flex flex-1 flex-col gap-1', expanded ? 'px-2' : 'items-center')}>
        {visibleItems.map(({ href, label, icon: Icon }) => {
          const isActive = href === '/dashboard'
            ? pathname === '/dashboard' || pathname === '/' || pathname.startsWith('/clients')
            : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              title={expanded ? undefined : label}
              aria-label={label}
              className={cn(
                'flex items-center rounded transition-colors duration-150',
                expanded
                  ? 'w-full gap-3 px-3 py-2.5 text-sm font-medium'
                  : 'h-11 w-11 justify-center',
                isActive
                  ? 'bg-[rgba(212,175,55,0.12)] border border-[rgba(212,175,55,0.22)] text-[#d4af37]'
                  : 'text-[rgba(212,175,55,0.3)] hover:bg-[rgba(212,175,55,0.08)] hover:text-[#d4af37]'
              )}
            >
              <Icon size={18} strokeWidth={1.6} />
              {expanded && <span>{label}</span>}
            </Link>
          )
        })}
      </div>

      {/* Avatar + sign-out */}
      <div className={cn(expanded ? 'px-2' : 'flex justify-center')}>
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="User menu"
            className={cn(
              'grid place-items-center rounded-full border border-[rgba(212,175,55,0.25)] bg-[rgba(212,175,55,0.07)] text-xs font-medium text-[rgba(212,175,55,0.6)] transition-colors hover:bg-[rgba(212,175,55,0.12)]',
              expanded ? 'h-9 w-9' : 'h-11 w-11'
            )}
          >
            {userInitial}
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="end">
            <div className="px-2 py-1.5 text-xs text-muted-foreground">
              {user.email ?? user.name}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}
