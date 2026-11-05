import { useId, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { cx } from './cx'
import { Glyph } from './Glyph'
import { IconButton } from './Button'
import { useFocusTrap } from './useFocusTrap'

export type AccordionItem = { id: string; title: string; meta?: ReactNode; content: ReactNode }

/** Accordion: square rows on 1px rules; panels open with a height transition. */
export function Accordion({ items, multiple = false, defaultOpen = [] }: { items: AccordionItem[]; multiple?: boolean; defaultOpen?: string[] }) {
  const [open, setOpen] = useState<string[]>(defaultOpen)
  const base = useId()
  const toggle = (id: string) =>
    setOpen((o) => (o.includes(id) ? o.filter((x) => x !== id) : multiple ? [...o, id] : [id]))
  return (
    <div className="border-t border-rule">
      {items.map((it) => {
        const isOpen = open.includes(it.id)
        const panel = `${base}-${it.id}`
        return (
          <div key={it.id} className="border-b border-border">
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panel}
                onClick={() => toggle(it.id)}
                className="flex w-full cursor-pointer items-center justify-between gap-4 py-4 text-left hover:bg-hover"
              >
                <span className="flex flex-col gap-0.5 pl-1">
                  <span className="type-heading text-text">{it.title}</span>
                  {it.meta ? <span className="type-caption text-text-muted">{it.meta}</span> : null}
                </span>
                <span className={cx('mr-1 inline-flex size-6 items-center justify-center border transition-colors', isOpen ? 'border-action bg-action text-on-action' : 'border-border-strong text-text')}>
                  <Glyph name={isOpen ? 'minus' : 'plus'} size={14} />
                </span>
              </button>
            </h3>
            <div id={panel} role="region" className={cx('grid transition-[grid-template-rows] duration-300 ease-[var(--ease-quiet)]', isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
              <div className="overflow-hidden">
                <div className={cx('pr-10 pb-5 pl-1 type-body-s text-text-muted transition-opacity duration-300', isOpen ? 'opacity-100' : 'opacity-0')}>{it.content}</div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/** Drawer: a side sheet for record detail. Slides in from the right over the scrim. */
export function Drawer({
  open,
  onClose,
  label,
  code,
  title,
  children,
  footer,
  width = 'max-w-lg',
}: {
  open: boolean
  onClose: () => void
  label: string
  code?: string
  title: ReactNode
  children: ReactNode
  footer?: ReactNode
  width?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const titleId = useId()
  useFocusTrap(open, ref, onClose)
  if (!open) return null
  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 animate-fade-in bg-scrim" onClick={onClose} aria-hidden="true" />
      <div ref={ref} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1} className={cx('relative flex h-full w-full animate-slide-in-right flex-col border-l border-rule bg-surface', width)}>
        <div className="flex h-10 shrink-0 items-center justify-between border-b border-rule bg-surface-raised pl-5">
          <span className="type-label text-text-label">{label}</span>
          <span className="flex items-center gap-3">
            {code ? <span className="type-caption text-text-muted">{code}</span> : null}
            <IconButton glyph="close" label="Close panel" onClick={onClose} />
          </span>
        </div>
        <div className="flex-1 overflow-auto px-6 py-6">
          <h2 id={titleId} className="mb-5 type-display-m text-text">
            {title}
          </h2>
          {children}
        </div>
        {footer ? <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-border px-6 py-4">{footer}</div> : null}
      </div>
    </div>,
    document.body,
  )
}
