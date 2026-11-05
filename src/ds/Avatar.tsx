import { cx } from './cx'

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
const dims: Record<AvatarSize, string> = {
  xs: 'size-6 text-[10px]',
  sm: 'size-8 text-[11px]',
  md: 'size-10 text-[13px]',
  lg: 'size-14 text-[17px]',
  xl: 'size-20 text-[22px]',
}

export type Presence = 'online' | 'away' | 'offline'

function initialsOf(name: string) {
  const parts = name.replace(/^(Prof\.|Dr\.|Shri|Smt\.)\s+/i, '').split(/\s+/).filter(Boolean)
  return ((parts[0]?.[0] ?? '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase()
}

/**
 * People photos are the only round element (radius-round) with a 2px paper ring.
 * Photos are greyscale. No photo yet: initials in slate-deep on paper, never a stock face.
 */
export function Avatar({
  name,
  src,
  size = 'md',
  presence,
  className,
}: {
  name: string
  src?: string
  size?: AvatarSize
  presence?: Presence
  className?: string
}) {
  return (
    <span className={cx('relative inline-flex shrink-0', className)}>
      <span
        className={cx(
          'inline-flex items-center justify-center overflow-hidden rounded-round bg-paper font-display font-medium text-slate-deep ring-2 ring-paper outline outline-1 outline-border',
          dims[size],
        )}
      >
        {src ? <img src={src} alt={name} className="size-full object-cover grayscale" /> : <span aria-label={name}>{initialsOf(name)}</span>}
      </span>
      {presence ? (
        <span
          title={presence}
          aria-label={presence}
          className={cx(
            'absolute -right-0.5 -bottom-0.5 size-2.5 border-2 border-surface',
            presence === 'online' && 'bg-sage-deep',
            presence === 'away' && 'bg-rose',
            presence === 'offline' && 'bg-border-strong',
          )}
        />
      ) : null}
    </span>
  )
}

export function AvatarGroup({ names, max = 4, size = 'sm' }: { names: string[]; max?: number; size?: AvatarSize }) {
  const shown = names.slice(0, max)
  const rest = names.length - shown.length
  return (
    <span className="inline-flex items-center">
      {shown.map((n, i) => (
        <Avatar key={n} name={n} size={size} className={i > 0 ? '-ml-2' : undefined} />
      ))}
      {rest > 0 ? (
        <span
          className={cx(
            '-ml-2 inline-flex items-center justify-center rounded-round bg-ink font-mono text-paper ring-2 ring-paper',
            dims[size],
          )}
        >
          +{rest}
        </span>
      ) : null}
    </span>
  )
}
