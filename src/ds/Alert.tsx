import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { cx } from './cx'
import { IconButton } from './Button'
import type { Tone } from './Badge'

type AlertTone = Exclude<Tone, 'neutral'>
const toneWord: Record<AlertTone, string> = { info: 'Notice', success: 'Resolved', caution: 'Caution', critical: 'Critical' }
const toneStyles: Record<AlertTone, { box: string; strip: string; dot: string }> = {
  info: { box: 'border-info bg-info-tint', strip: 'border-info text-info', dot: 'bg-info' },
  success: { box: 'border-success bg-success-tint', strip: 'border-success text-success', dot: 'bg-success' },
  caution: { box: 'border-caution bg-caution-tint', strip: 'border-caution text-caution', dot: 'bg-caution' },
  critical: { box: 'border-critical bg-critical-tint', strip: 'border-critical bg-critical text-paper', dot: 'bg-paper' },
}

/**
 * Inline alert, built like a blueprint box: a 20px header strip with the
 * status word left and a reference code right, then plain text.
 */
export function Alert({
  tone = 'info',
  title,
  children,
  code,
  actions,
  onDismiss,
}: {
  tone?: AlertTone
  title: ReactNode
  children?: ReactNode
  code?: string
  actions?: ReactNode
  onDismiss?: () => void
}) {
  const s = toneStyles[tone]
  return (
    <div role={tone === 'critical' ? 'alert' : 'status'} className={cx('border', s.box)}>
      <div className={cx('flex h-6 items-center justify-between border-b px-3', s.strip)}>
        <span className="flex items-center gap-2 type-label">
          <span aria-hidden="true" className={cx('size-1.5', s.dot)} />
          {toneWord[tone]}
        </span>
        <span className="flex items-center gap-2">
          {code ? <span className="type-caption">{code}</span> : null}
        </span>
      </div>
      <div className="flex items-start gap-4 px-4 py-3">
        <div className="flex flex-1 flex-col gap-1">
          <p className="type-heading text-text">{title}</p>
          {children ? <div className="type-body-s text-text-muted">{children}</div> : null}
          {actions ? <div className="mt-2 flex flex-wrap gap-2">{actions}</div> : null}
        </div>
        {onDismiss ? <IconButton glyph="close" label="Dismiss" size="sm" onClick={onDismiss} className="-mt-1 -mr-2" /> : null}
      </div>
    </div>
  )
}

/** Full-width banner for system-wide notices. */
export function Banner({ tone = 'info', children, action }: { tone?: AlertTone; children: ReactNode; action?: ReactNode }) {
  const bg = tone === 'critical' ? 'theme-ink bg-rose-deep' : tone === 'caution' ? 'bg-caution-tint text-text' : tone === 'success' ? 'bg-success-tint text-text' : 'theme-ink bg-grad-ink'
  return (
    <div role="status" className={cx('flex flex-wrap items-center justify-between gap-3 px-4 py-2.5', bg)}>
      <p className="flex items-center gap-3 type-body-s">
        <span className="type-label">{toneWord[tone]}</span>
        <span>{children}</span>
      </p>
      {action}
    </div>
  )
}

/* ---------------- Toasts ---------------- */

export type Toast = { id: number; tone: AlertTone; title: string; body?: string; module?: string }
type ToastCtx = { push: (t: Omit<Toast, 'id'>) => void }
const Ctx = createContext<ToastCtx | null>(null)

export function useToast() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useToast must be used inside <ToastProvider>')
  return c
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const dismiss = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), [])
  const push = useCallback((t: Omit<Toast, 'id'>) => setToasts((all) => [...all.slice(-3), { ...t, id: Date.now() + Math.random() }]), [])
  const value = useMemo(() => ({ push }), [push])
  return (
    <Ctx.Provider value={value}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed right-4 bottom-4 z-50 flex w-[360px] max-w-[calc(100vw-2rem)] flex-col gap-2">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </Ctx.Provider>
  )
}

const toastDot: Record<AlertTone, string> = { info: 'bg-slate-light', success: 'bg-sage', caution: 'bg-rose-light', critical: 'bg-rose-light' }

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 5000)
    return () => clearTimeout(t)
  }, [onDismiss])
  return (
    <div className="theme-ink pointer-events-auto animate-toast-in border border-rule bg-grad-ink">
      <div className="flex items-start gap-3 px-4 py-3">
        <span aria-hidden="true" className={cx('mt-1.5 size-1.5 shrink-0', toastDot[toast.tone])} />
        <div className="flex flex-1 flex-col gap-0.5">
          <span className="type-label text-slate-light">
            {toneWord[toast.tone]}
            {toast.module ? ` · ${toast.module}` : ''}
          </span>
          <span className="type-body-s font-medium text-paper">{toast.title}</span>
          {toast.body ? <span className="type-body-s text-text-muted">{toast.body}</span> : null}
        </div>
        <IconButton glyph="close" label="Dismiss notification" size="sm" onClick={onDismiss} className="-mt-1 -mr-2" />
      </div>
      <div className="h-0.5 bg-rule">
        <div className="h-full origin-left bg-slate-light animate-[toast-timer_5s_linear_forwards]" />
      </div>
    </div>
  )
}

/** Notification list item for the notification centre. */
export function NotificationItem({
  module,
  title,
  body,
  time,
  unread,
  tone = 'info',
}: {
  module: string
  title: string
  body?: string
  time: string
  unread?: boolean
  tone?: AlertTone
}) {
  return (
    <div className={cx('flex gap-3 border-b border-border px-4 py-3 last:border-b-0', unread ? 'bg-surface' : 'bg-surface-raised')}>
      <span aria-hidden="true" className={cx('mt-1.5 size-1.5 shrink-0', unread ? toneStyles[tone].dot.replace('bg-paper', 'bg-critical') : 'bg-transparent')} />
      <div className="flex flex-1 flex-col gap-0.5">
        <div className="flex items-baseline justify-between gap-3">
          <span className="type-label text-text-label">{module}</span>
          <span className="type-caption text-text-muted">{time}</span>
        </div>
        <span className={cx('type-body-s text-text', unread && 'font-medium')}>{title}</span>
        {body ? <span className="type-body-s text-text-muted">{body}</span> : null}
        {unread ? <span className="sr-only">Unread</span> : null}
      </div>
    </div>
  )
}
