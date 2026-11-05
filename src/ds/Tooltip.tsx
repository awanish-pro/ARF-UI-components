import { useId, useState, type ReactElement, type ReactNode, cloneElement } from 'react'
import { cx } from './cx'

/** Tooltip: ink panel with paper text, square, with a small square notch. Shows on hover and focus. */
export function Tooltip({
  content,
  children,
  side = 'top',
  label,
}: {
  content: ReactNode
  children: ReactElement<Record<string, unknown>>
  side?: 'top' | 'bottom' | 'left' | 'right'
  label?: string
}) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const pos = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }[side]
  const notch = {
    top: 'top-full left-1/2 -translate-x-1/2 -translate-y-1/2',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 translate-y-1/2',
    left: 'left-full top-1/2 -translate-y-1/2 -translate-x-1/2',
    right: 'right-full top-1/2 -translate-y-1/2 translate-x-1/2',
  }[side]
  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
    >
      {cloneElement(children, { 'aria-describedby': open ? id : undefined })}
      {open ? (
        <span role="tooltip" id={id} className={cx('pointer-events-none absolute z-40 w-max max-w-64 animate-fade-in bg-ink px-3 py-2 text-paper', pos)}>
          {label ? <span className="mb-0.5 block type-label text-slate-light">{label}</span> : null}
          <span className="block type-body-s">{content}</span>
          <span aria-hidden="true" className={cx('absolute size-2 rotate-45 bg-ink', notch)} />
        </span>
      ) : null}
    </span>
  )
}
