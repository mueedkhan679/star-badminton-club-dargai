import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from './Button'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  confirmLabel?: string
  onConfirm?: () => void
  loading?: boolean
  variant?: 'danger' | 'primary'
  hideActions?: boolean
}

export function Modal({
  open,
  onClose,
  title,
  children,
  confirmLabel = 'Confirm',
  onConfirm,
  loading,
  variant = 'primary',
  hideActions,
}: ModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative w-full max-w-md animate-slide-up glass-panel p-6 shadow-glow">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-zinc-100">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mb-6 text-sm text-zinc-400">{children}</div>
        {!hideActions && (
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            {onConfirm && (
              <Button
                variant={variant === 'danger' ? 'danger' : 'primary'}
                onClick={onConfirm}
                loading={loading}
              >
                {confirmLabel}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
