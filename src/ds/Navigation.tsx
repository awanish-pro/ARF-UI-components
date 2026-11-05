import type { ReactNode } from 'react'
import { cx } from './cx'
import { CountBadge } from './Badge'

/**
 * Placeholder for the supplied logo artwork. The logo is never redrawn;
 * drop logo-black (paper) or logo-white (dark) into this slot.
 */
export function LogoSlot({ onDark, height = 'h-7' }: { onDark?: boolean; height?: string }) {
  return (
    <span
      className={cx(
        'inline-flex aspect-[3/1] items-center justify-center border border-dashed px-2 type-caption',
        height,
        onDark ? 'border-slate-light text-slate-light' : 'border-border-strong text-text-muted',
      )}
      title="Supplied logo artwork goes here"
    >
      Logo
    </span>
  )
}

/** Product lockup: Montserrat, only beside the logo artwork. */
export function ProductLockup({ product, onDark }: { product: string; onDark?: boolean }) {
  return (
    <span className="flex shrink-0 items-center gap-3">
      <LogoSlot onDark={onDark} />
      <span aria-hidden="true" className={cx('h-5 w-px', onDark ? 'bg-rule' : 'bg-border-strong')} />
      <span className={cx('font-logo text-[15px] font-bold tracking-[0.04em] whitespace-nowrap', onDark ? 'text-paper' : 'text-text')}>{product}</span>
    </span>
  )
}

export type NavItem = { id: string; label: string; count?: number; urgent?: boolean }
export type NavSection = { label: string; code?: string; colour?: string; items: NavItem[] }

/** Side navigation. Sections carry a mono label and a 6px module square; active item fills ink. */
export function SideNav({ sections, active, onSelect, footer }: { sections: NavSection[]; active: string; onSelect: (id: string) => void; footer?: ReactNode }) {
  return (
    <nav aria-label="Application" className="flex h-full flex-col">
      <div className="flex-1 overflow-auto py-4">
        {sections.map((s) => (
          <div key={s.label} className="mb-5">
            <div className="flex items-center justify-between px-4 pb-2">
              <span className="flex items-center gap-2 type-label text-text-muted">
                {s.colour ? <span aria-hidden="true" className={cx('size-1.5', s.colour)} /> : null}
                {s.label}
              </span>
              {s.code ? <span className="type-caption text-text-muted">{s.code}</span> : null}
            </div>
            <ul>
              {s.items.map((it) => {
                const on = it.id === active
                return (
                  <li key={it.id}>
                    <button
                      type="button"
                      aria-current={on ? 'page' : undefined}
                      onClick={() => onSelect(it.id)}
                      className={cx(
                        'flex h-9 w-full cursor-pointer items-center justify-between px-4 text-left type-body-s transition-colors',
                        on ? 'bg-action font-medium text-on-action' : 'text-text hover:bg-hover',
                      )}
                    >
                      <span>{it.label}</span>
                      {it.count !== undefined ? (
                        on ? (
                          <span className="font-mono text-[11px] text-on-action">{it.count}</span>
                        ) : (
                          <CountBadge value={it.count} tone={it.urgent ? 'critical' : 'neutral'} />
                        )
                      ) : null}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
      {footer ? <div className="border-t border-border p-4">{footer}</div> : null}
    </nav>
  )
}

/** Top bar: module switcher items as text with an underline marker on the rule. */
export function TopNav({ items, active, onSelect }: { items: { id: string; label: string }[]; active: string; onSelect: (id: string) => void }) {
  return (
    <nav aria-label="Modules" className="flex h-full items-stretch gap-6">
      {items.map((it) => {
        const on = it.id === active
        return (
          <button
            key={it.id}
            type="button"
            aria-current={on ? 'page' : undefined}
            onClick={() => onSelect(it.id)}
            className={cx('relative cursor-pointer type-body-s font-medium transition-colors', on ? 'text-text' : 'text-text-muted hover:text-text')}
          >
            {it.label}
            {on ? <span aria-hidden="true" className="absolute inset-x-0 -bottom-px h-0.5 bg-action" /> : null}
          </button>
        )
      })}
    </nav>
  )
}
