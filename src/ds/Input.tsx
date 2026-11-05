import { forwardRef, useId, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from 'react'
import { cx } from './cx'
import { Glyph, type GlyphName } from './Glyph'

/** Field wrapper: mono label above, helper or error below. */
export function Field({
  label,
  htmlFor,
  hint,
  error,
  required,
  optional,
  children,
  trailing,
}: {
  label: ReactNode
  htmlFor?: string
  hint?: ReactNode
  error?: ReactNode
  required?: boolean
  optional?: boolean
  children: ReactNode
  trailing?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={htmlFor} className="type-label text-text-label">
          {label}
          {required ? <span className="text-text-accent"> *</span> : null}
          {optional ? <span className="text-text-muted normal-case tracking-normal font-body font-normal"> (optional)</span> : null}
        </label>
        {trailing}
      </div>
      {children}
      {error ? (
        <p className="flex items-center gap-1.5 type-body-s text-critical">
          <span aria-hidden="true" className="size-1.5 bg-critical" />
          {error}
        </p>
      ) : hint ? (
        <p className="type-body-s text-text-muted">{hint}</p>
      ) : null}
    </div>
  )
}

export const controlBase =
  'w-full border bg-surface text-text type-body placeholder:text-text-muted transition-colors focus:outline-2 focus:outline-offset-[-1px] focus:outline-focus disabled:bg-surface-sunken disabled:text-text-muted disabled:cursor-not-allowed'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: ReactNode
  hint?: ReactNode
  error?: ReactNode
  leading?: GlyphName
  prefix?: string
  suffix?: string
  optional?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, leading, prefix, suffix, required, optional, className, id, ...rest },
  ref,
) {
  const autoId = useId()
  const inputId = id ?? autoId
  const describedBy = error || hint ? `${inputId}-desc` : undefined
  return (
    <Field label={label} htmlFor={inputId} hint={hint} error={error} required={required} optional={optional}>
      <div className="relative flex items-stretch">
        {prefix ? (
          <span className="inline-flex items-center whitespace-nowrap border border-r-0 border-border-strong bg-surface-raised px-3 font-mono text-[13px] text-text-muted">
            {prefix}
          </span>
        ) : null}
        {leading ? (
          <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-text-muted">
            <Glyph name={leading} />
          </span>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cx(
            controlBase,
            'h-10 px-3',
            leading && 'pl-9',
            error ? 'border-critical' : 'border-border-strong hover:border-rule',
            className,
          )}
          {...rest}
        />
        {suffix ? (
          <span className="inline-flex items-center whitespace-nowrap border border-l-0 border-border-strong bg-surface-raised px-3 font-mono text-[13px] text-text-muted">
            {suffix}
          </span>
        ) : null}
      </div>
    </Field>
  )
})

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: ReactNode
  hint?: ReactNode
  error?: ReactNode
  maxLength?: number
}

export function Textarea({ label, hint, error, maxLength, value, id, className, ...rest }: TextareaProps) {
  const autoId = useId()
  const tid = id ?? autoId
  const count = typeof value === 'string' ? value.length : 0
  return (
    <Field
      label={label}
      htmlFor={tid}
      hint={hint}
      error={error}
      trailing={maxLength ? <span className="type-caption text-text-muted">{count} / {maxLength}</span> : null}
    >
      <textarea
        id={tid}
        value={value}
        maxLength={maxLength}
        aria-invalid={error ? true : undefined}
        className={cx(controlBase, 'min-h-24 resize-y px-3 py-2', error ? 'border-critical' : 'border-border-strong hover:border-rule', className)}
        {...rest}
      />
    </Field>
  )
}
