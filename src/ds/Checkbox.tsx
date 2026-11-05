import { useEffect, useId, useRef, type ReactNode } from 'react'
import { cx } from './cx'
import { Glyph } from './Glyph'

type CheckProps = {
  label: ReactNode
  description?: ReactNode
  checked: boolean
  indeterminate?: boolean
  disabled?: boolean
  invalid?: boolean
  onChange: (checked: boolean) => void
}

/** Square checkbox. Checked fills with brand (slate-deep on paper). */
export function Checkbox({ label, description, checked, indeterminate, disabled, invalid, onChange }: CheckProps) {
  const id = useId()
  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = !!indeterminate
  }, [indeterminate])
  const on = checked || indeterminate
  return (
    <label htmlFor={id} className={cx('group flex items-start gap-3', disabled ? 'cursor-not-allowed opacity-100' : 'cursor-pointer')}>
      <span className="relative mt-0.5 inline-flex size-[18px] shrink-0">
        <input
          ref={ref}
          id={id}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          onChange={(e) => onChange(e.target.checked)}
          className="peer absolute inset-0 m-0 cursor-[inherit] appearance-none opacity-0"
        />
        <span
          aria-hidden="true"
          className={cx(
            'inline-flex size-full items-center justify-center border transition-colors peer-focus-visible:focus-ring',
            disabled
              ? 'border-border bg-surface-sunken text-text-muted'
              : on
                ? 'border-brand bg-brand text-on-brand'
                : invalid
                  ? 'border-critical bg-surface'
                  : 'border-rule bg-surface group-hover:bg-hover',
          )}
        >
          {indeterminate ? <Glyph name="minus" size={14} /> : checked ? <Glyph name="check" size={14} /> : null}
        </span>
      </span>
      <span className="flex flex-col">
        <span className={cx('type-body-s font-medium', disabled ? 'text-text-muted' : 'text-text')}>{label}</span>
        {description ? <span className="type-body-s text-text-muted">{description}</span> : null}
      </span>
    </label>
  )
}

/** Radio: the one circular control besides avatars would break the square rule, so radios are square with an inset square. */
export function Radio({
  label,
  description,
  checked,
  name,
  value,
  disabled,
  onChange,
}: {
  label: ReactNode
  description?: ReactNode
  checked: boolean
  name: string
  value: string
  disabled?: boolean
  onChange: (value: string) => void
}) {
  const id = useId()
  return (
    <label htmlFor={id} className={cx('group flex items-start gap-3', disabled ? 'cursor-not-allowed' : 'cursor-pointer')}>
      <span className="relative mt-0.5 inline-flex size-[18px] shrink-0">
        <input
          id={id}
          type="radio"
          name={name}
          value={value}
          checked={checked}
          disabled={disabled}
          onChange={() => onChange(value)}
          className="peer absolute inset-0 m-0 cursor-[inherit] appearance-none opacity-0"
        />
        <span
          aria-hidden="true"
          className={cx(
            'inline-flex size-full items-center justify-center border peer-focus-visible:focus-ring',
            disabled ? 'border-border bg-surface-sunken' : checked ? 'border-brand bg-surface' : 'border-rule bg-surface group-hover:bg-hover',
          )}
        >
          {checked ? <span className={cx('size-2', disabled ? 'bg-text-muted' : 'bg-brand')} /> : null}
        </span>
      </span>
      <span className="flex flex-col">
        <span className={cx('type-body-s font-medium', disabled ? 'text-text-muted' : 'text-text')}>{label}</span>
        {description ? <span className="type-body-s text-text-muted">{description}</span> : null}
      </span>
    </label>
  )
}
