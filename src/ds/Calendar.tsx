import { useCallback, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { cx } from './cx'
import { IconButton } from './Button'
import { Glyph } from './Glyph'
import { Field } from './Input'
import { useDismiss } from './useDismiss'

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export const sameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
export const formatDate = (d: Date) => `${String(d.getDate()).padStart(2, '0')} ${MONTHS[d.getMonth()].slice(0, 3)} ${d.getFullYear()}`

function monthGrid(year: number, month: number) {
  const first = new Date(year, month, 1)
  const offset = (first.getDay() + 6) % 7 // Monday first
  const start = new Date(year, month, 1 - offset)
  return Array.from({ length: 42 }, (_, i) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + i))
}

export type CalendarEvent = { date: Date; label: string; colour: string }

/** Compact month grid used by the date picker. Monday first, square cells. */
export function MonthGrid({
  value,
  onSelect,
  range,
  minDate,
  events = [],
  initialMonth,
}: {
  value?: Date | null
  onSelect?: (d: Date) => void
  range?: { start: Date | null; end: Date | null }
  minDate?: Date
  events?: CalendarEvent[]
  initialMonth?: Date
}) {
  const base = initialMonth ?? value ?? range?.start ?? new Date()
  const [view, setView] = useState({ y: base.getFullYear(), m: base.getMonth() })
  const [focus, setFocus] = useState<Date>(value ?? base)
  const today = new Date()
  const days = monthGrid(view.y, view.m)
  const gridRef = useRef<HTMLDivElement>(null)

  const shift = (delta: number) => {
    const d = new Date(view.y, view.m + delta, 1)
    setView({ y: d.getFullYear(), m: d.getMonth() })
  }
  const move = (deltaDays: number) => {
    const n = new Date(focus.getFullYear(), focus.getMonth(), focus.getDate() + deltaDays)
    setFocus(n)
    if (n.getMonth() !== view.m || n.getFullYear() !== view.y) setView({ y: n.getFullYear(), m: n.getMonth() })
    requestAnimationFrame(() => gridRef.current?.querySelector<HTMLButtonElement>('[data-focus="true"]')?.focus())
  }
  const onKey = (e: KeyboardEvent) => {
    const map: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }
    if (e.key in map) {
      e.preventDefault()
      move(map[e.key])
    }
  }
  const inRange = (d: Date) => range?.start && range?.end && d > startOfDay(range.start) && d < startOfDay(range.end)
  const isEdge = (d: Date) => (range?.start && sameDay(d, range.start)) || (range?.end && sameDay(d, range.end))

  return (
    <div className="w-[296px]">
      <div className="mb-3 flex items-center justify-between">
        <IconButton glyph="chevron-left" label="Previous month" size="sm" onClick={() => shift(-1)} />
        <span className="type-heading text-text" aria-live="polite">
          {MONTHS[view.m]} {view.y}
        </span>
        <IconButton glyph="chevron-right" label="Next month" size="sm" onClick={() => shift(1)} />
      </div>
      <div className="grid grid-cols-7 border-b border-rule pb-1">
        {WEEKDAYS.map((w) => (
          <span key={w} className="text-center type-caption text-text-muted">
            {w.slice(0, 2)}
          </span>
        ))}
      </div>
      <div ref={gridRef} role="grid" onKeyDown={onKey} className="mt-1 grid grid-cols-7 gap-px">
        {days.map((d) => {
          const outside = d.getMonth() !== view.m
          const selected = (value && sameDay(d, value)) || isEdge(d)
          const disabled = minDate ? d < startOfDay(minDate) : false
          const isToday = sameDay(d, today)
          const dayEvents = events.filter((e) => sameDay(e.date, d))
          const focused = sameDay(d, focus)
          return (
            <button
              key={d.toISOString()}
              type="button"
              role="gridcell"
              data-focus={focused}
              tabIndex={focused ? 0 : -1}
              disabled={disabled}
              aria-selected={!!selected}
              aria-label={`${formatDate(d)}${isToday ? ', today' : ''}${dayEvents.length ? `, ${dayEvents.map((e) => e.label).join(', ')}` : ''}`}
              onClick={() => {
                setFocus(d)
                onSelect?.(d)
              }}
              className={cx(
                'relative flex h-10 cursor-pointer flex-col items-center justify-center font-body text-[13px] transition-colors',
                selected
                  ? 'bg-action text-on-action'
                  : disabled
                    ? 'cursor-not-allowed text-border-strong line-through'
                    : cx(outside ? 'text-text-muted' : 'text-text', inRange(d) ? 'bg-selected' : 'hover:bg-hover'),
              )}
            >
              <span className={cx(isToday && !selected && 'underline decoration-2 decoration-text-accent underline-offset-4')}>{d.getDate()}</span>
              {dayEvents.length ? (
                <span className="absolute bottom-1 flex gap-0.5">
                  {dayEvents.slice(0, 3).map((e, i) => (
                    <span key={i} className={cx('size-1', selected ? 'bg-on-action' : e.colour)} />
                  ))}
                </span>
              ) : null}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/** Full calendar with an agenda for the selected day. */
export function Calendar({ events }: { events: CalendarEvent[] }) {
  const [selected, setSelected] = useState<Date>(events[0]?.date ?? new Date())
  const dayEvents = events.filter((e) => sameDay(e.date, selected))
  return (
    <div className="flex flex-col border border-border bg-surface md:flex-row">
      <div className="border-b border-border p-5 md:border-r md:border-b-0">
        <MonthGrid value={selected} onSelect={setSelected} events={events} />
      </div>
      <div className="flex min-w-64 flex-1 flex-col">
        <div className="flex h-10 items-center justify-between border-b border-border px-5">
          <span className="type-label text-text-label">Agenda</span>
          <span className="type-caption text-text-muted">{formatDate(selected)}</span>
        </div>
        <ul className="flex flex-1 flex-col">
          {dayEvents.length === 0 ? (
            <li className="px-5 py-6 type-body-s text-text-muted">Nothing scheduled for this day.</li>
          ) : (
            dayEvents.map((e, i) => (
              <li key={i} className="flex items-start gap-3 border-b border-border px-5 py-3 last:border-b-0">
                <span className={cx('mt-1.5 size-1.5 shrink-0', e.colour)} />
                <span className="type-body-s text-text">{e.label}</span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  )
}

/** Date picker: an input-styled trigger with a calendar popover. Supports single or range. */
export function DatePicker({
  label,
  value,
  onChange,
  minDate,
  hint,
  placeholder = 'DD Mon YYYY',
}: {
  label: string
  value: Date | null
  onChange: (d: Date) => void
  minDate?: Date
  hint?: string
  placeholder?: string
}) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const root = useRef<HTMLDivElement>(null)
  const close = useCallback(() => setOpen(false), [])
  const refs = useMemo(() => [root], [])
  useDismiss(open, refs, close)
  return (
    <Field label={label} htmlFor={id} hint={hint}>
      <div ref={root} className="relative">
        <button
          id={id}
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className={cx(
            'flex h-10 w-full cursor-pointer items-center justify-between border bg-surface px-3 type-body',
            open ? 'border-rule' : 'border-border-strong hover:border-rule',
          )}
        >
          <span className={value ? 'text-text' : 'text-text-muted'}>{value ? formatDate(value) : placeholder}</span>
          <Glyph name="calendar" className="text-text-muted" />
        </button>
        {open ? (
          <div role="dialog" aria-label={`Choose ${label}`} className="absolute top-full left-0 z-30 mt-1 animate-pop border border-rule bg-surface p-4">
            <MonthGrid
              value={value}
              minDate={minDate}
              onSelect={(d) => {
                onChange(d)
                setOpen(false)
              }}
            />
          </div>
        ) : null}
      </div>
    </Field>
  )
}

export function DateRangePicker({ label, value, onChange }: { label: string; value: { start: Date | null; end: Date | null }; onChange: (r: { start: Date | null; end: Date | null }) => void }) {
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const close = useCallback(() => setOpen(false), [])
  const refs = useMemo(() => [root], [])
  useDismiss(open, refs, close)
  const id = useId()
  const pick = (d: Date) => {
    if (!value.start || value.end) onChange({ start: d, end: null })
    else if (d < value.start) onChange({ start: d, end: value.start })
    else {
      onChange({ start: value.start, end: d })
      setOpen(false)
    }
  }
  const text = value.start ? `${formatDate(value.start)}  to  ${value.end ? formatDate(value.end) : '…'}` : 'Choose a range'
  return (
    <Field label={label} htmlFor={id} hint="Click a start date, then an end date.">
      <div ref={root} className="relative">
        <button
          id={id}
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className={cx('flex h-10 w-full cursor-pointer items-center justify-between border bg-surface px-3 type-body', open ? 'border-rule' : 'border-border-strong hover:border-rule')}
        >
          <span className={value.start ? 'text-text' : 'text-text-muted'}>{text}</span>
          <Glyph name="calendar" className="text-text-muted" />
        </button>
        {open ? (
          <div role="dialog" aria-label={`Choose ${label}`} className="absolute top-full left-0 z-30 mt-1 animate-pop border border-rule bg-surface p-4">
            <MonthGrid range={value} onSelect={pick} />
          </div>
        ) : null}
      </div>
    </Field>
  )
}
