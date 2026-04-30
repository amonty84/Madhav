'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { adminDialog, adminGhostBtn, adminDestructiveBtn, adminPrimaryBtn } from './styles'

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  loading = false,
  onConfirm,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
  loading?: boolean
  onConfirm: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={adminDialog + ' sm:max-w-md'}>
        <DialogHeader>
          <DialogTitle className="font-serif text-xl font-medium tracking-wide text-brand-gold-cream">
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 pt-2">
          <button onClick={() => onOpenChange(false)} className={adminGhostBtn} disabled={loading}>
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={destructive ? adminDestructiveBtn : adminPrimaryBtn}
            disabled={loading}
          >
            {loading ? 'Working…' : confirmLabel}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
