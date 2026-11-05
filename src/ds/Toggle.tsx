import { useId, type ReactNode } from 'react'
import { cx } from './cx'

/** Square switch (radius-0). State word sits beside the track so colour is never the only signal. */
export function Toggle({
  label,
  description,
  checked,
  disabled,
  onChange,
  size = 'md',
  showState = true,
}: {
  label: ReactNode
  description?: ReactNode
  checked: boolean
  disabled?: boolean
  onChange: (v: boolean) => void
  size?: 'sm' | 'md'
  showState?: boolean
}) {
  const id = useId()
  const track = size === 'sm' ? 'h-4 w-7' : 'h-5 w-9'
  const thumb = size === 'sm' ? 'size-3' : 'size-4'
  const shift = size === 'sm' ? 'translate-x-3' : 'translate-x-4'
  return (
    <div className="flex items-start justify-between gap-6">
      <label htmlFor={id} className={cx('flex flex-col', disabled ? 'cursor-not-allowed' : 'cursor-pointer')}>
        <span className={cx('type-body-s font-medium', disabled ? 'text-text-muted' : 'text-text')}>{label}</span>
        {description ? <span className="type-body-s text-text-muted">{description}</span> : null}
      </label>
      <span className="flex items-center gap-2">
        {showState ? <span className="type-caption w-7 text-right text-text-muted">{checked ? 'On' : 'Off'}</span> : null}
        <button
          id={id}
          type="button"
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          onClick={() => onChange(!checked)}
          className={cx(
            'relative inline-flex shrink-0 cursor-pointer items-center border p-px transition-colors disabled:cursor-not-allowed',
            track,
            disabled ? 'border-border bg-surface-sunken' : checked ? 'border-brand bg-brand' : 'border-rule bg-surface hover:bg-hover',
          )}
        >
          <span
            aria-hidden="true"
            className={cx(
              'block transition-transform duration-150',
              thumb,
              checked && shift,
              disabled ? 'bg-border-strong' : checked ? 'bg-on-brand' : 'bg-action',
            )}
          />
        </button>
      </span>
    </div>
  )
}
