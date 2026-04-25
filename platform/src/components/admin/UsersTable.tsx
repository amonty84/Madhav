'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ConfirmDialog } from './ConfirmDialog'
import { EditUsernameDialog } from './EditUsernameDialog'
import { NewUserDialog } from './NewUserDialog'
import {
  adminCard,
  adminGhostBtn,
  adminPrimaryBtn,
  adminTableRow,
  adminTableTd,
  adminTableTh,
} from './styles'
import type { AdminUser } from './types'

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function StatusBadge({ status }: { status: AdminUser['status'] }) {
  const palette: Record<AdminUser['status'], string> = {
    active: 'border-emerald-700/60 bg-emerald-950/40 text-emerald-300',
    pending: 'border-amber-700/60 bg-amber-950/40 text-amber-300',
    disabled: 'border-zinc-700/60 bg-zinc-950/40 text-zinc-400',
  }
  return (
    <span
      className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] ${palette[status]}`}
    >
      {status}
    </span>
  )
}

export function UsersTable({
  users,
  currentUserId,
  onMutated,
}: {
  users: AdminUser[]
  currentUserId: string
  onMutated: () => void
}) {
  const [search, setSearch] = useState('')
  const [newUserOpen, setNewUserOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [confirmAction, setConfirmAction] = useState<
    | { user: AdminUser; kind: 'disable' | 'enable' | 'delete' }
    | null
  >(null)
  const [working, setWorking] = useState(false)
  const [resetLink, setResetLink] = useState<string | null>(null)

  const filtered = users.filter((u) => {
    const q = search.trim().toLowerCase()
    if (!q) return true
    return (
      (u.username ?? '').toLowerCase().includes(q) ||
      (u.email ?? '').toLowerCase().includes(q) ||
      (u.name ?? '').toLowerCase().includes(q)
    )
  })

  async function handleSendReset(user: AdminUser) {
    setWorking(true)
    try {
      const res = await fetch(`/api/admin/users/${user.id}/send-reset`, { method: 'POST' })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) {
        toast.error(body?.error ?? 'Could not generate reset link.')
        return
      }
      setResetLink(body?.reset_link ?? null)
    } finally {
      setWorking(false)
    }
  }

  async function handleConfirm() {
    if (!confirmAction) return
    setWorking(true)
    const { user, kind } = confirmAction
    try {
      let res: Response
      if (kind === 'delete') {
        res = await fetch(`/api/admin/users/${user.id}`, { method: 'DELETE' })
      } else {
        res = await fetch(`/api/admin/users/${user.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: kind === 'disable' ? 'disabled' : 'active' }),
        })
      }
      const body = await res.json().catch(() => ({}))
      if (!res.ok) {
        toast.error(body?.error ?? 'Action failed.')
      } else {
        toast.success(
          kind === 'delete'
            ? 'User deleted.'
            : kind === 'disable'
              ? 'User disabled.'
              : 'User enabled.',
        )
        setConfirmAction(null)
        onMutated()
      }
    } finally {
      setWorking(false)
    }
  }

  return (
    <section className={adminCard + ' overflow-hidden'}>
      <header className="flex items-center justify-between gap-3 border-b border-[#211a08] px-6 py-4">
        <h2 className="font-serif text-lg text-[#fce29a]">Users</h2>
        <div className="flex items-center gap-3">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search…"
            className="rounded-md border border-[#2a2210] bg-[#0e0b06] px-3 py-1.5 text-sm text-[#fce29a] placeholder:text-[#6a5830] focus:border-[#d4af37] focus:outline-none"
          />
          <button onClick={() => setNewUserOpen(true)} className={adminPrimaryBtn}>
            + New user
          </button>
        </div>
      </header>

      {filtered.length === 0 ? (
        <p className="px-6 py-8 text-center text-sm text-[#7a5210]">No users.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className={adminTableTh}>Username</th>
                <th className={adminTableTh}>Name</th>
                <th className={adminTableTh}>Email</th>
                <th className={adminTableTh}>Role</th>
                <th className={adminTableTh}>Status</th>
                <th className={adminTableTh}>Created</th>
                <th className={adminTableTh}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => {
                const isMe = u.id === currentUserId
                return (
                  <tr key={u.id} className={adminTableRow}>
                    <td className={adminTableTd + ' font-medium'}>
                      {u.username ?? <span className="text-[#7a5210]">—</span>}
                      {isMe && (
                        <span className="ml-2 text-[10px] uppercase tracking-[0.14em] text-[#d4af37]">
                          you
                        </span>
                      )}
                    </td>
                    <td className={adminTableTd + ' text-[#9b834f]'}>{u.name ?? '—'}</td>
                    <td className={adminTableTd + ' text-[#d4af37]'}>{u.email ?? '—'}</td>
                    <td className={adminTableTd + ' text-[11px] uppercase tracking-[0.14em]'}>
                      {u.role}
                    </td>
                    <td className={adminTableTd}>
                      <StatusBadge status={u.status} />
                    </td>
                    <td className={adminTableTd + ' whitespace-nowrap text-[#9b834f]'}>
                      {formatDate(u.created_at)}
                    </td>
                    <td className={adminTableTd + ' text-right'}>
                      {isMe ? null : (
                        <DropdownMenu>
                          <DropdownMenuTrigger className="rounded border border-[#3a2c10] px-3 py-1 text-xs text-[#d4af37] hover:border-[#d4af37] hover:text-[#fce29a]">
                            Actions
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-[#0e0b06] text-[#fce29a]">
                            <DropdownMenuItem onClick={() => setEditingUser(u)}>
                              Edit username
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSendReset(u)}>
                              Send password reset link
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {u.status === 'active' ? (
                              <DropdownMenuItem
                                onClick={() => setConfirmAction({ user: u, kind: 'disable' })}
                              >
                                Disable account
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() => setConfirmAction({ user: u, kind: 'enable' })}
                              >
                                Re-enable account
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => setConfirmAction({ user: u, kind: 'delete' })}
                            >
                              Delete account
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <NewUserDialog open={newUserOpen} onOpenChange={setNewUserOpen} onCreated={onMutated} />
      <EditUsernameDialog
        user={editingUser}
        open={editingUser !== null}
        onOpenChange={(open) => {
          if (!open) setEditingUser(null)
        }}
        onSaved={onMutated}
      />
      <ConfirmDialog
        open={confirmAction !== null}
        onOpenChange={(open) => {
          if (!open) setConfirmAction(null)
        }}
        title={
          confirmAction?.kind === 'delete'
            ? 'Delete user?'
            : confirmAction?.kind === 'disable'
              ? 'Disable user?'
              : 'Enable user?'
        }
        description={
          confirmAction
            ? confirmAction.kind === 'delete'
              ? `Permanently delete ${confirmAction.user.username ?? confirmAction.user.email}? This removes their Firebase account, profile, and all linked data. This cannot be undone.`
              : confirmAction.kind === 'disable'
                ? `Disable ${confirmAction.user.username ?? confirmAction.user.email}? They will not be able to sign in until re-enabled.`
                : `Re-enable ${confirmAction.user.username ?? confirmAction.user.email}?`
            : ''
        }
        confirmLabel={
          confirmAction?.kind === 'delete'
            ? 'Delete'
            : confirmAction?.kind === 'disable'
              ? 'Disable'
              : 'Enable'
        }
        destructive={confirmAction?.kind !== 'enable'}
        loading={working}
        onConfirm={handleConfirm}
      />

      {/* Reset-link bottom sheet (after Send reset link succeeds) */}
      {resetLink && (
        <div className="fixed inset-x-4 bottom-4 z-[60] mx-auto max-w-xl rounded-lg border border-[rgba(212,175,55,0.4)] bg-[rgba(8,6,3,0.96)] p-4 shadow-2xl">
          <div className="mb-2 text-[11px] uppercase tracking-[0.14em] text-[#7a5210]">
            Password-reset link
          </div>
          <textarea
            readOnly
            value={resetLink}
            rows={3}
            onFocus={(e) => e.currentTarget.select()}
            className="w-full break-all rounded border border-[#2a2210] bg-[#0e0b06] p-3 font-mono text-xs text-[#fce29a]"
          />
          <div className="mt-2 flex justify-end">
            <button onClick={() => setResetLink(null)} className={adminGhostBtn}>
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
