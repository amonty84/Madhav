import type { ReactNode } from 'react'
import { AppShellRailSlot } from './AppShellRailSlot'
import { AppShellBreadcrumb, type BreadcrumbSegment } from './AppShellBreadcrumb'
import { MobileNavSheet } from './MobileNavSheet'

export type { BreadcrumbSegment }

interface AppShellProps {
  children: ReactNode
  user: { uid: string; email?: string; name?: string }
  profile: { role: 'super_admin' | 'admin' | 'client'; status?: string }
  breadcrumb?: BreadcrumbSegment[]
}

export function AppShell({ children, user, profile, breadcrumb = [] }: AppShellProps) {
  return (
    <div className="relative flex h-[100dvh] bg-background text-foreground">
      <AppShellRailSlot user={user} profile={profile} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppShellBreadcrumb
          segments={breadcrumb}
          mobileNav={<MobileNavSheet user={user} profile={profile} />}
        />
        <main className="page-ascend flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
