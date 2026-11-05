import type { ReactNode } from 'react'
import { cx } from './cx'
import { Glyph } from './Glyph'

/** Flat, square-ended progress bar with label and value. */
export function ProgressBar({
  label,
  value,
  max = 100,
  tone = 'brand',
  caption,
  size = 'md',
  indeterminate,
}: {
  label?: ReactNode
  value?: number
  max?: number
  tone?: 'brand' | 'rose' | 'sage' | 'critical'
  caption?: ReactNode
  size?: 'sm' | 'md'
  indeterminate?: boolean
}) {
  const pct = Math.min(100, Math.max(0, ((value ?? 0) / max) * 100))
  const fill = { brand: 'bg-brand', rose: 'bg-rose', sage: 'bg-sage-deep', critical: 'bg-critical' }[tone]
  return (
    <div className="flex flex-col gap-1.5">
      {label || !indeterminate ? (
        <div className="flex items-baseline justify-between gap-4">
          {label ? <span className="type-body-s font-medium text-text">{label}</span> : <span />}
          {!indeterminate ? <span className="type-caption text-text-muted">{Math.round(pct)}%</span> : null}
        </div>
      ) : null}
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={indeterminate ? undefined : value}
        className={cx('relative w-full overflow-hidden bg-surface-sunken', size === 'sm' ? 'h-1' : 'h-2')}
      >
        {indeterminate ? (
          <div className={cx('absolute inset-y-0 w-2/5 animate-indeterminate', fill)} />
        ) : (
          <div className={cx('h-full transition-[width] duration-300', fill)} style={{ width: `${pct}%` }} />
        )}
      </div>
      {caption ? <span className="type-body-s text-text-muted">{caption}</span> : null}
    </div>
  )
}

/** Segmented progress: discrete units such as wards surveyed. */
export function SegmentedProgress({ total, done, label }: { total: number; done: number; label: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <span className="type-body-s font-medium text-text">{label}</span>
        <span className="type-caption text-text-muted">
          {done} of {total}
        </span>
      </div>
      <div className="flex gap-0.5" aria-hidden="true">
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className={cx('h-2 flex-1', i < done ? 'bg-brand' : 'bg-surface-sunken')} />
        ))}
      </div>
    </div>
  )
}

export type Step = { label: string; caption?: string }

/** Stepper: numbered squares joined by a rule. State is stated in words for screen readers. */
export function Stepper({ steps, current, orientation = 'horizontal' }: { steps: Step[]; current: number; orientation?: 'horizontal' | 'vertical' }) {
  const vertical = orientation === 'vertical'
  return (
    <ol className={cx('flex', vertical ? 'flex-col' : 'w-full')}>
      {steps.map((s, i) => {
        const state = i < current ? 'done' : i === current ? 'current' : 'upcoming'
        return (
          <li
            key={s.label}
            aria-current={state === 'current' ? 'step' : undefined}
            className={cx('relative flex', vertical ? 'gap-3 pb-6 last:pb-0' : 'flex-1 flex-col gap-2 pr-3')}
          >
            {i < steps.length - 1 ? (
              <span
                aria-hidden="true"
                className={cx(
                  'absolute',
                  vertical ? 'top-7 bottom-1 left-3 w-px' : 'top-3 right-0 left-7 h-px',
                  i < current ? 'bg-brand' : 'bg-border-strong',
                )}
              />
            ) : null}
            <span
              className={cx(
                'relative z-10 inline-flex size-6 shrink-0 items-center justify-center border font-mono text-[11px] font-medium',
                state === 'done' && 'border-brand bg-brand text-on-brand',
                state === 'current' && 'border-action bg-surface text-text outline-2 outline-offset-2 outline-brand',
                state === 'upcoming' && 'border-border-strong bg-surface text-text-muted',
              )}
            >
              {state === 'done' ? <Glyph name="check" size={12} /> : String(i + 1).padStart(2, '0')}
            </span>
            <span className="flex flex-col">
              <span className={cx('type-body-s font-medium', state === 'upcoming' ? 'text-text-muted' : 'text-text')}>
                {s.label}
                <span className="sr-only"> ({state})</span>
              </span>
              {s.caption ? <span className="type-caption text-text-muted">{s.caption}</span> : null}
            </span>
          </li>
        )
      })}
    </ol>
  )
}

/** Ring progress for compact metric tiles. Square caps, no rounded ends. */
export function ProgressRing({ value, size = 56, label }: { value: number; size?: number; label: string }) {
  const r = (size - 6) / 2
  const c = 2 * Math.PI * r
  return (
    <span className="relative inline-flex items-center justify-center" style={{ width: size, height: size }} role="img" aria-label={`${label}: ${value}%`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-surface-sunken)" strokeWidth={4} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--color-brand)"
          strokeWidth={4}
          strokeDasharray={c}
          strokeDashoffset={c * (1 - value / 100)}
          strokeLinecap="butt"
        />
      </svg>
      <span className="absolute font-display text-[13px] font-semibold text-text">{value}%</span>
    </span>
  )
}
