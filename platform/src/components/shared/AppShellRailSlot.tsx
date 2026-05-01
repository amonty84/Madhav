'use client'

import { usePathname } from 'next/navigation'
import { AppShellRail } from './AppShellRail'

interface Props {
  user: { uid: string; email?: string; name?: string }
  profile: { role: 'super_admin' | 'admin' | 'client'; status?: string }
}

export function AppShellRailSlot({ user, profile }: Props) {
  const pathname = usePathname()
  if (pathname.includes('/consume')) return null

  return (
    <>
      {/* Placeholder keeps content from shifting when rail overlays on hover */}
      <div className="hidden w-14 shrink-0 md:block" aria-hidden="true" />
      <div className="absolute left-0 top-0 z-50 hidden h-full md:block">
        <AppShellRail user={user} profile={profile} />
      </div>
    </>
  )
}
