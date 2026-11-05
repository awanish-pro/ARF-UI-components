import { useCallback, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { cx } from './cx'
import { useDismiss } from './useDismiss'

export type MenuItem =
  | { type: 'item'; label: string; shortcut?: string; onSelect?: () => void; critical?: boolean; disabled?: boolean; hint?: string }
  | { type: 'label'; label: string }
  | { type: 'separator' }

/** Action menu anchored to a trigger. Square, 1px rule border, no shadow. */
export function Dropdown({
  trigger,
  items,
  align = 'start',
  width = 'w-64',
}: {
  trigger: (props: { open: boolean; toggle: () => void }) => ReactNode
  items: MenuItem[]
  align?: 'start' | 'end'
  width?: string
}) {
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const close = useCallback(() => setOpen(false), [])
  const refs = useMemo(() => [root], [])
  useDismiss(open, refs, close)
  const menuRef = useRef<HTMLDivElement>(null)

  const onKey = (e: KeyboardEvent) => {
    if (!open) return
    const els = Array.from(menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not(:disabled)') ?? [])
    const idx = els.indexOf(document.activeElement as HTMLButtonElement)
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      els[(idx + 1) % els.length]?.focus()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      els[(idx - 1 + els.length) % els.length]?.focus()
    }
  }

  return (
    <div ref={root} className="relative inline-block" onKeyDown={onKey}>
      {trigger({ open, toggle: () => setOpen((o) => !o) })}
      {open ? (
        <div
          ref={menuRef}
          role="menu"
          className={cx('absolute top-full z-30 mt-1 origin-top animate-pop border border-rule bg-surface py-1', width, align === 'end' ? 'right-0' : 'left-0')}
        >
          {items.map((it, i) => {
            if (it.type === 'separator') return <div key={i} role="separator" className="my-1 border-t border-border" />
            if (it.type === 'label')
              return (
                <div key={i} className="px-3 pt-2 pb-1 type-label text-text-muted">
                  {it.label}
                </div>
              )
            return (
              <button
                key={i}
                type="button"
                role="menuitem"
                disabled={it.disabled}
                onClick={() => {
                  it.onSelect?.()
                  setOpen(false)
                }}
                className={cx(
                  'flex w-full cursor-pointer items-center justify-between gap-4 px-3 py-2 text-left type-body-s',
                  'hover:bg-hover focus:bg-hover focus:outline-none disabled:cursor-not-allowed disabled:text-text-muted disabled:hover:bg-transparent',
                  it.critical ? 'text-critical' : 'text-text',
                )}
              >
                <span className="flex flex-col">
                  <span>{it.label}</span>
                  {it.hint ? <span className="text-text-muted">{it.hint}</span> : null}
                </span>
                {it.shortcut ? <kbd className="type-caption text-text-muted">{it.shortcut}</kbd> : null}
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
