import { type ButtonHTMLAttributes, type ReactNode, forwardRef } from 'react'
import { cx } from './cx'
import { Glyph, type GlyphName } from './Glyph'

export type ButtonVariant = 'primary' | 'brand' | 'secondary' | 'ghost' | 'critical' | 'link'
export type ButtonSize = 'sm' | 'md' | 'lg'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-action text-on-action border border-action hover:bg-slate-deep hover:border-slate-deep',
  brand: 'bg-brand text-on-brand border border-brand hover:bg-action hover:border-action hover:text-on-action',
  secondary: 'bg-transparent text-text border border-rule hover:bg-hover',
  ghost: 'bg-transparent text-text border border-transparent hover:bg-hover',
  critical: 'bg-critical text-paper border border-critical hover:bg-ink hover:border-ink',
  link: 'bg-transparent text-text-label border border-transparent underline underline-offset-4 decoration-1 hover:text-text px-0!',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 gap-1.5 type-body-s font-medium',
  md: 'h-10 px-4 gap-2 type-body-s font-medium',
  lg: 'h-12 px-5 gap-2 type-body font-medium',
}

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  leading?: GlyphName
  trailing?: GlyphName
  loading?: boolean
  block?: boolean
  children?: ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', leading, trailing, loading, block, className, children, disabled, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cx(
        'inline-flex shrink-0 items-center justify-center whitespace-nowrap transition-colors duration-150 cursor-pointer',
        'disabled:cursor-not-allowed disabled:bg-surface-sunken disabled:text-text-muted disabled:border-border disabled:no-underline',
        variants[variant],
        sizes[size],
        block && 'w-full',
        className,
      )}
      {...rest}
    >
      {loading ? <StepLoader /> : leading ? <Glyph name={leading} /> : null}
      {children}
      {trailing && !loading ? <Glyph name={trailing} /> : null}
    </button>
  )
})

/** Square icon-only button. Always carries an aria-label. */
export const IconButton = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { glyph: GlyphName; label: string; size?: ButtonSize; variant?: 'secondary' | 'ghost' }
>(function IconButton({ glyph, label, size = 'md', variant = 'ghost', className, type = 'button', ...rest }, ref) {
  const dim = size === 'sm' ? 'size-8' : size === 'lg' ? 'size-12' : 'size-10'
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      title={label}
      className={cx(
        'inline-flex shrink-0 items-center justify-center text-text transition-colors cursor-pointer disabled:text-text-muted disabled:cursor-not-allowed',
        variant === 'secondary' ? 'border border-rule hover:bg-hover' : 'border border-transparent hover:bg-hover',
        dim,
        className,
      )}
      {...rest}
    >
      <Glyph name={glyph} />
    </button>
  )
})

/** Three squares stepping in sequence: the brand's loading mark. */
export function StepLoader({ className, label }: { className?: string; label?: string }) {
  return (
    <span role={label ? 'status' : undefined} className={cx('inline-flex items-center gap-1', className)}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          aria-hidden="true"
          className="size-1.5 bg-current animate-[pulse-step_0.9s_steps(1,end)_infinite]"
          style={{ animationDelay: `${i * 0.3}s` }}
        />
      ))}
      {label ? <span className="sr-only">{label}</span> : null}
    </span>
  )
}

/** Segmented button group. Square, shares borders, one selection. */
export function ButtonGroup<T extends string>({
  options,
  value,
  onChange,
  label,
  size = 'md',
}: {
  options: { value: T; label: ReactNode; count?: number }[]
  value: T
  onChange: (v: T) => void
  label: string
  size?: ButtonSize
}) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex w-fit max-w-full self-start overflow-x-auto border border-rule">
      {options.map((o, i) => {
        const active = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={cx(
              'inline-flex items-center gap-2 transition-colors cursor-pointer',
              sizes[size],
              i > 0 && 'border-l border-rule',
              active ? 'bg-action text-on-action' : 'bg-transparent text-text hover:bg-hover',
            )}
          >
            {o.label}
            {o.count !== undefined ? (
              <span className={cx('type-caption', active ? 'text-on-action' : 'text-text-muted')}>{o.count}</span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}
