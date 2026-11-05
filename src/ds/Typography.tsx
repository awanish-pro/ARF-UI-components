import type { ElementType, ReactNode } from 'react'
import { cx } from './cx'

type Common = { children: ReactNode; className?: string; as?: ElementType; id?: string }

/** True when the caller already passed a text colour token, so the default is skipped. */
const colourToken = /(^|\s)text-(paper|ink|white|slate|rose|sage|text|critical|success|info|caution|on-|brand|grid|layer|border|stage)/
export const withColour = (className: string | undefined, fallback: string) => (className && colourToken.test(className) ? '' : fallback)

/** Mono uppercase label: section tags, running heads, field labels. Never sentences. */
export function Label({ children, className, as: As = 'span', id }: Common) {
  return (
    <As id={id} className={cx('type-label', withColour(className, 'text-text-label'), className)}>
      {children}
    </As>
  )
}

export function Caption({ children, className, as: As = 'span' }: Common) {
  return <As className={cx('type-caption', withColour(className, 'text-text-muted'), className)}>{children}</As>
}

type DisplaySize = 'xl' | 'l' | 'm' | 'heading'
const displayClass: Record<DisplaySize, string> = {
  xl: 'type-display-xl',
  l: 'type-display-l',
  m: 'type-display-m',
  heading: 'type-heading',
}
const defaultTag: Record<DisplaySize, ElementType> = { xl: 'h1', l: 'h2', m: 'h3', heading: 'h4' }

/**
 * Headline in Space Grotesk. Pass `accent` for the closing two to four
 * words; they take text-accent. One accent per headline.
 */
export function Display({
  children,
  accent,
  size = 'l',
  className,
  as,
  id,
}: Common & { accent?: ReactNode; size?: DisplaySize }) {
  const As = as ?? defaultTag[size]
  return (
    <As id={id} className={cx(displayClass[size], withColour(className, 'text-text'), className)}>
      {children}
      {accent ? (
        <>
          {' '}
          <span className="text-text-accent">{accent}</span>
        </>
      ) : null}
    </As>
  )
}

export function Text({
  children,
  size = 'body',
  muted,
  className,
  as: As = 'p',
}: Common & { size?: 'lead' | 'body' | 'body-s'; muted?: boolean }) {
  const sizeClass = size === 'lead' ? 'type-lead' : size === 'body-s' ? 'type-body-s' : 'type-body'
  return <As className={cx(sizeClass, withColour(className, muted ? 'text-text-muted' : 'text-text'), className)}>{children}</As>
}

/** Outlined headline figure. */
export function Figure({ children, size = 'xl', className }: { children: ReactNode; size?: 'xl' | 'm'; className?: string }) {
  return (
    <span className={cx(size === 'xl' ? 'type-figure-xl' : 'type-figure-m', 'figure-outline block', className)}>
      {children}
    </span>
  )
}

/** Running head: label section left, topic right, over a 1px rule. */
export function RunningHead({ left, right, className }: { left: ReactNode; right?: ReactNode; className?: string }) {
  return (
    <div className={cx('flex items-end justify-between gap-4 border-b border-rule pb-2', className)}>
      <Label className="text-text">{left}</Label>
      {right ? <Label className="text-text-muted">{right}</Label> : null}
    </div>
  )
}
