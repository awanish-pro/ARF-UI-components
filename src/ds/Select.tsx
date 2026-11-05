import { useCallback, useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { cx } from './cx'
import { Glyph } from './Glyph'
import { Field } from './Input'
import { useDismiss } from './useDismiss'

export type SelectOption = { value: string; label: string; meta?: string; group?: string; disabled?: boolean }

/** Listbox select with keyboard support, optional groups and a search filter. */
export function Select({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select',
  hint,
  error,
  searchable,
  disabled,
  required,
}: {
  label: ReactNode
  options: SelectOption[]
  value: string | null
  onChange: (v: string) => void
  placeholder?: string
  hint?: ReactNode
  error?: ReactNode
  searchable?: boolean
  disabled?: boolean
  required?: boolean
}) {
  const id = useId()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const root = useRef<HTMLDivElement>(null)
  const close = useCallback(() => {
    setOpen(false)
    setQuery('')
  }, [])
  const refs = useMemo(() => [root], [])
  useDismiss(open, refs, close)

  const filtered = options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
  const selected = options.find((o) => o.value === value)

  const commit = (o: SelectOption | undefined) => {
    if (!o || o.disabled) return
    onChange(o.value)
    close()
  }
  const onKey = (e: KeyboardEvent) => {
    if (!open && (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      setOpen(true)
      setActive(Math.max(0, filtered.findIndex((o) => o.value === value)))
      return
    }
    if (!open) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(filtered.length - 1, a + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(0, a - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      commit(filtered[active])
    }
  }

  let lastGroup: string | undefined
  return (
    <Field label={label} htmlFor={id} hint={hint} error={error} required={required}>
      <div ref={root} className="relative" onKeyDown={onKey}>
        <button
          id={id}
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className={cx(
            'flex h-10 w-full cursor-pointer items-center justify-between gap-2 border bg-surface px-3 text-left type-body transition-colors',
            'focus-visible:outline-2 focus-visible:outline-offset-[-1px] disabled:cursor-not-allowed disabled:bg-surface-sunken disabled:text-text-muted',
            error ? 'border-critical' : open ? 'border-rule' : 'border-border-strong hover:border-rule',
          )}
        >
          <span className={cx('truncate', !selected && 'text-text-muted')}>{selected?.label ?? placeholder}</span>
          <Glyph name={open ? 'chevron-up' : 'chevron-down'} className="shrink-0 text-text-muted" />
        </button>
        {open ? (
          <div className="absolute top-full right-0 left-0 z-30 mt-1 animate-pop border border-rule bg-surface">
            {searchable ? (
              <div className="border-b border-border p-2">
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value)
                    setActive(0)
                  }}
                  placeholder="Filter"
                  aria-label="Filter options"
                  className="h-8 w-full border border-border bg-surface-raised px-2 type-body-s focus:outline-2 focus:outline-offset-[-1px] focus:outline-focus"
                />
              </div>
            ) : null}
            <ul role="listbox" aria-labelledby={id} className="max-h-64 overflow-auto py-1">
              {filtered.length === 0 ? <li className="px-3 py-2 type-body-s text-text-muted">No match for “{query}”.</li> : null}
              {filtered.map((o, i) => {
                const header = o.group && o.group !== lastGroup ? o.group : null
                lastGroup = o.group
                const isSel = o.value === value
                return (
                  <li key={o.value} role="presentation">
                    {header ? <div className="px-3 pt-2 pb-1 type-label text-text-muted">{header}</div> : null}
                    <div
                      role="option"
                      aria-selected={isSel}
                      aria-disabled={o.disabled}
                      onMouseEnter={() => setActive(i)}
                      onClick={() => commit(o)}
                      className={cx(
                        'flex cursor-pointer items-center justify-between gap-3 px-3 py-2 type-body-s',
                        o.disabled ? 'cursor-not-allowed text-text-muted' : i === active ? 'bg-hover' : '',
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <span className={cx('inline-flex w-4 text-brand')}>{isSel ? <Glyph name="check" size={14} /> : null}</span>
                        {o.label}
                      </span>
                      {o.meta ? <span className="type-caption text-text-muted">{o.meta}</span> : null}
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        ) : null}
      </div>
    </Field>
  )
}
