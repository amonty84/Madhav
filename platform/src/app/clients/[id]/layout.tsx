import { createClient, createServiceClient } from '@/lib/supabase/server'
import { buttonVariants } from '@/components/ui/button'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function ClientLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const service = createServiceClient()
  const { data: chart } = await service
    .from('charts')
    .select('name, birth_date')
    .eq('id', id)
    .single()

  if (!chart) redirect('/dashboard')

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b px-4 py-3 flex items-center gap-4">
        <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
          ← Dashboard
        </Link>
        <span className="font-medium">{chart.name}</span>
        <span className="text-xs text-muted-foreground">{chart.birth_date}</span>
        <div className="ml-auto flex gap-2">
          <Link href={`/clients/${id}/build`} className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
            Build
          </Link>
          <Link href={`/clients/${id}/consume`} className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
            Consume
          </Link>
        </div>
      </header>
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  )
}
