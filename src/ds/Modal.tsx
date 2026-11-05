import { useId, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { cx } from './cx'
import { IconButton } from './Button'
import { useFocusTrap } from './useFocusTrap'

/**
 * Modal dialog. Square, 1px rule border, header strip with label and code.
 * Escape closes, focus is trapped and restored.
 */
export function Modal({
  open,
  onClose,
  label,
  code,
  title,
  accent,
  children,
  footer,
  size = 'md',
}: {
  open: boolean
  onClose: () => void
  label: string
  code?: string
  title: string
  accent?: string
  children: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg'
}) {
  const ref = useRef<HTMLDivElement>(null)
  const titleId = useId()
  useFocusTrap(open, ref, onClose)

  if (!open) return null
  const width = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-3xl' }[size]
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-scrim animate-fade-in" onClick={onClose} aria-hidden="true" />
      <div ref={ref} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1} className={cx('relative flex max-h-[90vh] w-full flex-col border border-rule bg-surface animate-rise', width)}>
        <div className="flex h-8 shrink-0 items-center justify-between border-b border-rule bg-surface-raised pl-4">
          <span className="type-label text-text-label">{label}</span>
          <span className="flex items-center gap-3">
            {code ? <span className="type-caption text-text-muted">{code}</span> : null}
            <IconButton glyph="close" label="Close dialog" size="sm" onClick={onClose} />
          </span>
        </div>
        <div className="overflow-auto px-6 pt-5 pb-6">
          <h2 id={titleId} className="mb-3 type-display-m text-text">
            {title}
            {accent ? <span className="text-text-accent"> {accent}</span> : null}
          </h2>
          {children}
        </div>
        {footer ? <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-border px-6 py-4">{footer}</div> : null}
      </div>
    </div>,
    document.body,
  )
}
