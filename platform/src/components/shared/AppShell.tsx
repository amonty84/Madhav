import type { ReactNode } from 'react'
import { AppShellRail } from './AppShellRail'
import { AppShellBreadcrumb, type BreadcrumbSegment } from './AppShellBreadcrumb'

export type { BreadcrumbSegment }

interface AppShellProps {
  children: ReactNode
  user: { uid: string; email?: string; name?: string }
  profile: { role: 'super_admin' | 'admin' | 'client'; status?: string }
  breadcrumb?: BreadcrumbSegment[]
}

export function AppShell({ children, user, profile, breadcrumb = [] }: AppShellProps) {
  return (
    <div className="flex h-[100dvh] bg-background text-foreground">
      <AppShellRail user={user} profile={profile} />
      <div className="flex flex-1 flex-col overflow-hidden">
        {breadcrumb.length > 0 && <AppShellBreadcrumb segments={breadcrumb} />}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
