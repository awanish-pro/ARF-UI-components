import { useId, useRef, type KeyboardEvent, type ReactNode } from 'react'
import { cx } from './cx'

export type TabItem<T extends string> = { value: T; label: string; count?: number; disabled?: boolean }

/** Tabs with arrow-key navigation. `line` sits on a 1px rule; `boxed` is a square segmented set. */
export function Tabs<T extends string>({
  items,
  value,
  onChange,
  variant = 'line',
  label,
}: {
  items: TabItem<T>[]
  value: T
  onChange: (v: T) => void
  variant?: 'line' | 'boxed' | 'vertical'
  label: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const onKey = (e: KeyboardEvent) => {
    const enabled = items.filter((i) => !i.disabled)
    const idx = enabled.findIndex((i) => i.value === value)
    const next = ['ArrowRight', 'ArrowDown'].includes(e.key) ? 1 : ['ArrowLeft', 'ArrowUp'].includes(e.key) ? -1 : 0
    if (!next) return
    e.preventDefault()
    const n = enabled[(idx + next + enabled.length) % enabled.length]
    onChange(n.value)
    requestAnimationFrame(() => ref.current?.querySelector<HTMLButtonElement>('[aria-selected="true"]')?.focus())
  }
  return (
    <div
      ref={ref}
      role="tablist"
      aria-label={label}
      aria-orientation={variant === 'vertical' ? 'vertical' : 'horizontal'}
      onKeyDown={onKey}
      className={cx(
        'flex',
        variant === 'line' && 'gap-6 overflow-x-auto border-b border-rule',
        variant === 'boxed' && 'inline-flex w-fit max-w-full self-start overflow-x-auto border border-rule',
        variant === 'vertical' && 'flex-col border-l border-border',
      )}
    >
      {items.map((t, i) => {
        const active = t.value === value
        return (
          <button
            key={t.value}
            type="button"
            role="tab"
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            disabled={t.disabled}
            onClick={() => onChange(t.value)}
            className={cx(
              'relative inline-flex cursor-pointer items-center gap-2 whitespace-nowrap type-body-s font-medium transition-colors disabled:cursor-not-allowed disabled:text-border-strong',
              variant === 'line' && cx('h-11', active ? 'text-text' : 'text-text-muted hover:text-text'),
              variant === 'boxed' && cx('h-9 px-4', i > 0 && 'border-l border-rule', active ? 'bg-action text-on-action' : 'text-text hover:bg-hover'),
              variant === 'vertical' && cx('-ml-px h-10 border-l-2 px-4 text-left', active ? 'border-action text-text' : 'border-transparent text-text-muted hover:text-text'),
            )}
          >
            {t.label}
            {t.count !== undefined ? (
              <span
                className={cx(
                  'inline-flex h-5 min-w-5 items-center justify-center px-1 font-mono text-[11px]',
                  variant === 'boxed' && active ? 'bg-on-action text-action' : active ? 'bg-action text-on-action' : 'bg-surface-sunken text-text-muted',
                )}
              >
                {t.count}
              </span>
            ) : null}
            {variant === 'line' && active ? <span aria-hidden="true" className="absolute inset-x-0 -bottom-px h-0.5 bg-action" /> : null}
          </button>
        )
      })}
    </div>
  )
}

export function TabPanel({ children, className }: { children: ReactNode; className?: string }) {
  const id = useId()
  return (
    <div role="tabpanel" id={id} tabIndex={0} className={cx('focus-visible:outline-offset-4', className)}>
      {children}
    </div>
  )
}
