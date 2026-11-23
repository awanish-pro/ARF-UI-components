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
  { label, hint, error, leading, prefix, suffix, required, optional, className, id, disabled, ...rest },
  ref,
) {
  const autoId = useId()
  const inputId = id ?? autoId
  const describedBy = error || hint ? `${inputId}-desc` : undefined
  const isComposite = Boolean(prefix || suffix)
  return (
    <Field label={label} htmlFor={inputId} hint={hint} error={error} required={required} optional={optional}>
      {isComposite ? (
        <div
          data-search-field
          className={cx(
            'relative flex h-10 items-stretch border bg-surface transition-colors',
            'focus-within:outline-2 focus-within:outline-offset-[-1px] focus-within:outline-focus',
            disabled
              ? 'border-border bg-surface-sunken text-text-muted'
              : error
                ? 'border-critical'
                : 'border-border-strong hover:border-rule focus-within:border-rule',
          )}
        >
          {prefix ? (
            <span className="inline-flex items-center whitespace-nowrap border-r border-border bg-surface-raised px-3 font-mono text-[13px] text-text-muted">
              {prefix}
            </span>
          ) : null}
          {leading ? (
            <span className="pointer-events-none inline-flex items-center pl-3 text-text-muted">
              <Glyph name={leading} />
            </span>
          ) : null}
          <input
            ref={ref}
            id={inputId}
            required={required}
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className={cx(
              'min-w-0 flex-1 border-0 bg-transparent px-3 text-text type-body placeholder:text-text-muted outline-none focus:outline-none focus-visible:outline-none disabled:cursor-not-allowed disabled:text-text-muted',
              leading && 'pl-2',
              className,
            )}
            {...rest}
          />
          {suffix ? (
            <span className="inline-flex items-center whitespace-nowrap border-l border-border bg-surface-raised px-3 font-mono text-[13px] text-text-muted">
              {suffix}
            </span>
          ) : null}
        </div>
      ) : (
        <div className="relative flex items-stretch">
          {leading ? (
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-text-muted">
              <Glyph name={leading} />
            </span>
          ) : null}
          <input
            ref={ref}
            id={inputId}
            required={required}
            disabled={disabled}
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
        </div>
      )}
    </Field>
  )
})

type SearchInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  onClear?: () => void
  compact?: boolean
}

/**
 * Composite search bar: single outer square border + `:focus-within` ring.
 * Inner `<input>` suppresses `:focus` and `:focus-visible` outlines so a nested
 * double border never appears beside the search icon.
 */
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput(
  { className, value, onClear, compact, disabled, ...rest },
  ref,
) {
  const hasValue = typeof value === 'string' ? value.length > 0 : false
  return (
    <div
      data-search-field
      className={cx(
        'flex w-full items-center border bg-surface text-text transition-colors',
        'focus-within:outline-2 focus-within:outline-offset-[-1px] focus-within:outline-focus',
        compact ? 'h-9' : 'h-10',
        disabled
          ? 'border-border bg-surface-sunken text-text-muted'
          : 'border-border-strong hover:border-rule focus-within:border-rule',
        className,
      )}
    >
      <span className="pointer-events-none flex shrink-0 items-center justify-center pl-3 text-text-muted">
        <Glyph name="search" size={compact ? 14 : 16} />
      </span>
      <input
        ref={ref}
        type="search"
        value={value}
        disabled={disabled}
        className={cx(
          'h-full min-w-0 flex-1 border-0 bg-transparent px-2.5 text-text placeholder:text-text-muted outline-none focus:outline-none focus-visible:outline-none disabled:cursor-not-allowed disabled:text-text-muted',
          compact ? 'type-body-s' : 'type-body',
        )}
        {...rest}
      />
      {hasValue && onClear && !disabled ? (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear search"
          className="flex h-full shrink-0 cursor-pointer items-center justify-center px-2.5 text-text-muted hover:text-text"
        >
          <Glyph name="close" size={14} />
        </button>
      ) : null}
    </div>
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
