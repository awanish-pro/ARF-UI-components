import { useId, type ReactNode } from 'react'
import { cx } from './cx'

/** Range slider. Flat square-ended track, square thumb, value shown in mono. */
export function Slider({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  format = (v: number) => String(v),
  marks,
  disabled,
  hint,
}: {
  label: ReactNode
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  step?: number
  format?: (v: number) => string
  marks?: number[]
  disabled?: boolean
  hint?: ReactNode
}) {
  const id = useId()
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="type-label text-text-label">
          {label}
        </label>
        <output htmlFor={id} className="font-display text-[15px] font-semibold tracking-wide text-text">
          {format(value)}
        </output>
      </div>
      <div className="relative flex h-5 items-center">
        <div className="absolute inset-x-0 h-1 bg-surface-sunken" />
        <div className={cx('absolute left-0 h-1', disabled ? 'bg-border-strong' : 'bg-brand')} style={{ width: `${pct}%` }} />
        {marks?.map((m) => (
          <span
            key={m}
            aria-hidden="true"
            className={cx('absolute h-2.5 w-px -translate-x-1/2', m <= value ? 'bg-brand' : 'bg-border-strong')}
            style={{ left: `${((m - min) / (max - min)) * 100}%` }}
          />
        ))}
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          aria-valuetext={format(value)}
          onChange={(e) => onChange(Number(e.target.value))}
          className="ds-range relative w-full"
        />
      </div>
      {marks ? (
        <div className="relative h-4">
          {marks.map((m) => (
            <span
              key={m}
              className="absolute -translate-x-1/2 type-caption text-text-muted"
              style={{ left: `${((m - min) / (max - min)) * 100}%` }}
            >
              {format(m)}
            </span>
          ))}
        </div>
      ) : null}
      {hint ? <p className="type-body-s text-text-muted">{hint}</p> : null}
    </div>
  )
}
