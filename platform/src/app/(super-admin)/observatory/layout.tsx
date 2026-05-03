import type { Metadata } from 'next'
import { AuthGate } from '@/lib/components/observatory/AuthGate'
import { ObservatoryLayout } from '@/lib/components/observatory/Layout'

export const metadata: Metadata = {
  title: 'Observatory — MARSYS-JIS',
}

export default function ObservatorySectionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGate>
      <ObservatoryLayout>{children}</ObservatoryLayout>
    </AuthGate>
  )
}
