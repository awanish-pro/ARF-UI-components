import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cx } from './cx'
import { Glyph } from './Glyph'

export type Command = { id: string; group: string; label: string; meta?: string; shortcut?: string; colour?: string; onRun?: () => void }

/** Command menu (Ctrl or Cmd + K). Grouped results, arrow keys move, Enter runs, Escape closes. */
export function CommandMenu({ open, onClose, commands }: { open: boolean; onClose: () => void; commands: Command[] }) {
  const [q, setQ] = useState('')
  const [active, setActive] = useState(0)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      setQ('')
      setActive(0)
    }
  }, [open])

  const results = useMemo(() => {
    const s = q.trim().toLowerCase()
    return s ? commands.filter((c) => (c.label + ' ' + (c.meta ?? '') + ' ' + c.group).toLowerCase().includes(s)) : commands
  }, [q, commands])

  useEffect(() => {
    listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' })
  }, [active])

  if (!open) return null
  const run = (c: Command | undefined) => {
    if (!c) return
    c.onRun?.()
    onClose()
  }
  let lastGroup = ''
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]">
      <div className="absolute inset-0 bg-scrim animate-fade-in" onClick={onClose} aria-hidden="true" />
      <div role="dialog" aria-modal="true" aria-label="Command menu" className="relative w-full max-w-xl animate-rise border border-rule bg-surface">
        <div className="flex items-center gap-3 border-b border-rule px-4">
          <Glyph name="search" className="text-text-muted" />
          <input
            autoFocus
            value={q}
            onChange={(e) => {
              setQ(e.target.value)
              setActive(0)
            }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault()
                setActive((a) => Math.min(results.length - 1, a + 1))
              } else if (e.key === 'ArrowUp') {
                e.preventDefault()
                setActive((a) => Math.max(0, a - 1))
              } else if (e.key === 'Enter') run(results[active])
              else if (e.key === 'Escape') onClose()
            }}
            role="combobox"
            aria-expanded="true"
            aria-controls="cmd-list"
            aria-activedescendant={results[active] ? `cmd-${results[active].id}` : undefined}
            placeholder="Search grievances, cameras, properties or actions"
            className="h-14 flex-1 bg-transparent type-body text-text outline-none placeholder:text-text-muted"
          />
          <kbd className="border border-border px-1.5 py-0.5 type-caption text-text-muted">Esc</kbd>
        </div>
        <div ref={listRef} id="cmd-list" role="listbox" className="max-h-[50vh] overflow-auto py-2">
          {results.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <p className="type-heading text-text">No results for “{q}”.</p>
              <p className="mt-1 type-body-s text-text-muted">Try a grievance number, a camera code or a property ID.</p>
            </div>
          ) : null}
          {results.map((c, i) => {
            const header = c.group !== lastGroup ? c.group : null
            lastGroup = c.group
            const isActive = i === active
            return (
              <div key={c.id}>
                {header ? <div className="px-4 pt-3 pb-1 type-label text-text-muted">{header}</div> : null}
                <div
                  id={`cmd-${c.id}`}
                  role="option"
                  aria-selected={isActive}
                  data-active={isActive}
                  onMouseMove={() => setActive(i)}
                  onClick={() => run(c)}
                  className={cx('mx-2 flex cursor-pointer items-center justify-between gap-3 px-3 py-2.5', isActive ? 'bg-action text-on-action' : 'text-text')}
                >
                  <span className="flex items-center gap-3">
                    <span aria-hidden="true" className={cx('size-1.5', isActive ? 'bg-on-action' : (c.colour ?? 'bg-slate'))} />
                    <span className="type-body-s font-medium">{c.label}</span>
                    {c.meta ? <span className={cx('type-caption', isActive ? 'text-on-action' : 'text-text-muted')}>{c.meta}</span> : null}
                  </span>
                  {c.shortcut ? <kbd className={cx('type-caption', isActive ? 'text-on-action' : 'text-text-muted')}>{c.shortcut}</kbd> : isActive ? <Glyph name="arrow-right" size={14} /> : null}
                </div>
              </div>
            )
          })}
        </div>
        <div className="flex items-center gap-4 border-t border-border bg-surface-raised px-4 py-2 type-caption text-text-muted">
          <span>↑ ↓ Move</span>
          <span>Enter Open</span>
          <span className="ml-auto">{results.length} results</span>
        </div>
      </div>
    </div>,
    document.body,
  )
}
