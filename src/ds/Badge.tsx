import type { ReactNode } from 'react'
import { cx } from './cx'
import { Glyph } from './Glyph'

export type Tone = 'neutral' | 'info' | 'success' | 'caution' | 'critical'

const toneBorder: Record<Tone, string> = {
  neutral: 'border-border-strong text-text',
  info: 'border-info text-info',
  success: 'border-success text-success',
  caution: 'border-caution text-caution',
  critical: 'border-critical text-critical',
}
const toneFill: Record<Tone, string> = {
  neutral: 'bg-surface-sunken text-text border-surface-sunken',
  info: 'bg-info-tint text-info border-info-tint',
  success: 'bg-success-tint text-success border-success-tint',
  caution: 'bg-caution-tint text-caution border-caution-tint',
  critical: 'bg-critical text-paper border-critical',
}
const toneDot: Record<Tone, string> = {
  neutral: 'bg-text-muted',
  info: 'bg-info',
  success: 'bg-success',
  caution: 'bg-caution',
  critical: 'bg-critical',
}

/** Square status badge. Mono label, optional 6px square. The word always carries the meaning. */
export function Badge({
  children,
  tone = 'neutral',
  variant = 'outline',
  dot = true,
  className,
}: {
  children: ReactNode
  tone?: Tone
  variant?: 'outline' | 'soft'
  dot?: boolean
  className?: string
}) {
  return (
    <span
      className={cx(
        'inline-flex h-6 items-center gap-1.5 border px-2 type-label whitespace-nowrap',
        variant === 'outline' ? toneBorder[tone] : toneFill[tone],
        className,
      )}
    >
      {dot ? <span aria-hidden="true" className={cx('size-1.5', variant === 'soft' && tone === 'critical' ? 'bg-paper' : toneDot[tone])} /> : null}
      {children}
    </span>
  )
}

/** Numeric count badge for navigation and tabs. */
export function CountBadge({ value, tone = 'neutral' }: { value: number; tone?: 'neutral' | 'critical' }) {
  return (
    <span
      className={cx(
        'inline-flex h-5 min-w-5 items-center justify-center px-1.5 font-mono text-[11px] leading-none font-medium',
        tone === 'critical' ? 'bg-critical text-paper' : 'bg-action text-on-action',
      )}
    >
      {value > 99 ? '99+' : value}
    </span>
  )
}

export type Stage = 'live' | 'pilot' | 'prototype'
const stageClass: Record<Stage, string> = {
  live: 'border-stage-live text-stage-live',
  pilot: 'border-stage-pilot text-stage-pilot',
  prototype: 'border-stage-prototype text-stage-prototype',
}

/** StageTag: the only pill in the system. 1px border, transparent fill, label text. */
export function StageTag({ stage }: { stage: Stage }) {
  return (
    <span className={cx('inline-flex h-6 items-center rounded-pill border px-3 type-label', stageClass[stage])}>
      {stage}
    </span>
  )
}

/** Tag: square chip for filters and metadata. Optional colour square and remove action. */
export function Tag({
  children,
  colour,
  onRemove,
  selected,
  onClick,
}: {
  children: ReactNode
  colour?: string
  onRemove?: () => void
  selected?: boolean
  onClick?: () => void
}) {
  const body = (
    <>
      {colour ? <span aria-hidden="true" className={cx('size-1.5', colour)} /> : null}
      <span>{children}</span>
    </>
  )
  return (
    <span
      className={cx(
        'inline-flex h-7 items-center border type-body-s transition-colors',
        selected ? 'border-action bg-action text-on-action' : 'border-border bg-surface text-text',
      )}
    >
      {onClick ? (
        <button
          type="button"
          aria-pressed={selected}
          onClick={onClick}
          className="inline-flex h-full cursor-pointer items-center gap-2 px-2.5 hover:underline underline-offset-2"
        >
          {body}
        </button>
      ) : (
        <span className="inline-flex items-center gap-2 px-2.5">{body}</span>
      )}
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${typeof children === 'string' ? children : 'tag'}`}
          className={cx(
            'inline-flex h-full cursor-pointer items-center border-l px-1.5',
            selected ? 'border-slate-deep hover:bg-slate-deep' : 'border-border hover:bg-hover',
          )}
        >
          <Glyph name="close" size={12} />
        </button>
      ) : null}
    </span>
  )
}
