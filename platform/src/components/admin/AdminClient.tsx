'use client'

import { useQuery } from '@tanstack/react-query'
import { PendingRequestsTable } from './PendingRequestsTable'
import { UsersTable } from './UsersTable'
import type { AdminAccessRequest, AdminUser } from './types'

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  return (await res.json()) as T
}

export function AdminClient({ currentUserId }: { currentUserId: string }) {
  const requestsQuery = useQuery({
    queryKey: ['admin', 'access-requests'],
    queryFn: () =>
      fetchJson<{ requests: AdminAccessRequest[] }>('/api/admin/access-requests'),
  })
  const usersQuery = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: () => fetchJson<{ users: AdminUser[] }>('/api/admin/users'),
  })

  function refetchAll() {
    requestsQuery.refetch()
    usersQuery.refetch()
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-medium tracking-wide text-[#fce29a]">
          User management
        </h1>
        <p className="mt-1 text-sm text-[#9b834f]">
          Pending access requests and active accounts.
        </p>
      </div>

      {requestsQuery.isError ? (
        <p className="text-sm text-red-400">Could not load access requests.</p>
      ) : (
        <PendingRequestsTable
          requests={requestsQuery.data?.requests ?? []}
          onMutated={refetchAll}
        />
      )}

      {usersQuery.isError ? (
        <p className="text-sm text-red-400">Could not load users.</p>
      ) : (
        <UsersTable
          users={usersQuery.data?.users ?? []}
          currentUserId={currentUserId}
          onMutated={refetchAll}
        />
      )}
    </div>
  )
}
