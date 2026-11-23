import type { ReactNode } from 'react'
import { cx } from './cx'
import { StepLoader } from './Button'
import { BaoliMotif, JaaliMotif, KolamMotif, StambhaMotif, VastuMotif } from './Motifs'

export type HeritageMotifName = 'vastu' | 'kolam' | 'jaali' | 'baoli' | 'baoli-colour' | 'stambha'

function renderMotif(name: HeritageMotifName) {
  switch (name) {
    case 'kolam':
      return <KolamMotif className="h-9 w-48 text-slate" />
    case 'jaali':
      return <JaaliMotif className="size-20 text-slate" />
    case 'baoli':
      return <BaoliMotif className="h-16 w-28 text-rose" />
    case 'baoli-colour':
      return <BaoliMotif coloured className="h-16 w-28 text-slate" />
    case 'stambha':
      return <StambhaMotif className="h-24 w-10 text-sage-deep" />
    case 'vastu':
    default:
      return <VastuMotif className="size-20 text-slate" />
  }
}

/** Shared frame for full-panel states: a motif in open space, a label, a headline with accent, a line of context. */
function StateFrame({
  motif,
  label,
  title,
  accent,
  body,
  actions,
  footnote,
  className,
}: {
  motif?: ReactNode
  label: string
  title: string
  accent: string
  body: ReactNode
  actions?: ReactNode
  footnote?: ReactNode
  className?: string
}) {
  return (
    <div className={cx('flex flex-col items-start gap-5 px-8 py-10', className)}>
      {motif}
      <div className="flex max-w-md flex-col gap-2">
        <span className="type-label text-text-label">{label}</span>
        <h3 className="type-display-m text-text">
          {title} <span className="text-text-accent">{accent}</span>
        </h3>
        <p className="type-body-s text-text-muted">{body}</p>
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      {footnote ? <div className="type-caption text-text-muted">{footnote}</div> : null}
    </div>
  )
}

export function EmptyState(props: {
  title: string
  accent: string
  body: ReactNode
  actions?: ReactNode
  label?: string
  motif?: HeritageMotifName
  caption?: string
}) {
  return (
    <StateFrame
      {...props}
      label={props.label ?? 'Nothing here yet'}
      motif={renderMotif(props.motif ?? 'vastu')}
      footnote={props.caption}
    />
  )
}

/**
 * WhitespaceMotif: Creative open-space / no-data placeholder using one of
 * the five Airawat Brand Guide hairline heritage motifs.
 * Placed strictly in open whitespace, never behind running text.
 */
export function WhitespaceMotif({
  motif = 'vastu',
  label = 'No data available',
  title = 'Waiting for the first',
  accent = 'verified record.',
  body,
  caption,
  actions,
  className,
}: {
  motif?: HeritageMotifName
  label?: string
  title?: string
  accent?: string
  body?: ReactNode
  caption?: string
  actions?: ReactNode
  className?: string
}) {
  return (
    <div
      className={cx(
        'flex flex-col items-center justify-center gap-5 border border-border bg-surface px-8 py-12 text-center',
        className,
      )}
    >
      <div className="flex items-center justify-center">{renderMotif(motif)}</div>
      <div className="flex max-w-md flex-col gap-1.5">
        <span className="type-label text-text-label">{label}</span>
        <h3 className="type-display-m text-text">
          {title} <span className="text-text-accent">{accent}</span>
        </h3>
        {body ? <p className="type-body-s text-text-muted">{body}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap justify-center gap-2">{actions}</div> : null}
      {caption ? <span className="type-caption text-text-muted">{caption}</span> : null}
    </div>
  )
}

export function ErrorState(props: { title: string; accent: string; body: ReactNode; actions?: ReactNode; code: string }) {
  return (
    <StateFrame
      {...props}
      label={`Error · ${props.code}`}
      motif={
        <div className="relative size-20 border border-critical">
          <BaoliMotif className="absolute inset-2 text-rose" />
        </div>
      }
      footnote={`Reference ${props.code} · share this code with support`}
    />
  )
}

export function OfflineState(props: { title: string; accent: string; body: ReactNode; actions?: ReactNode; lastSynced: string; queued: number }) {
  return (
    <StateFrame
      {...props}
      label="No network"
      motif={
        <div className="flex w-56 items-center gap-2 text-sage-deep">
          <KolamMotif className="h-6 flex-1" />
          <span className="type-label text-critical">× ×</span>
          <KolamMotif className="h-6 flex-1 text-border-strong" />
        </div>
      }
      footnote={`Last synced ${props.lastSynced} · ${props.queued} actions queued on this device`}
    />
  )
}

/** Skeleton blocks: solid tints with a slow shimmer. */
export function Skeleton({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cx('block skeleton', className)} />
}

export function SkeletonTable({ rows = 4 }: { rows?: number }) {
  return (
    <div role="status" aria-label="Loading records" className="border border-border">
      <div className="flex h-10 items-center gap-6 border-b border-rule bg-surface-raised px-4">
        {['w-16', 'w-28', 'w-20', 'w-14'].map((w) => (
          <Skeleton key={w} className={cx('h-2.5', w)} />
        ))}
      </div>
      {Array.from({ length: rows }, (_, r) => (
        <div key={r} className="flex items-center gap-6 border-b border-border px-4 py-3.5 last:border-b-0">
          <Skeleton className="h-3 w-16" />
          <div className="flex flex-1 flex-col gap-1.5">
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-2.5 w-1/3" />
          </div>
          <Skeleton className="h-6 w-20" />
          <Skeleton className="size-8 rounded-round" />
        </div>
      ))}
    </div>
  )
}

/** Loading: brand step loader with a word, or a full panel with an indeterminate bar. */
export function Loading({ label = 'Loading', detail }: { label?: string; detail?: string }) {
  return (
    <div role="status" className="flex flex-col items-start gap-4 px-8 py-10">
      <div className="flex items-center gap-3 text-brand">
        <StepLoader />
        <span className="type-label text-text-label">{label}</span>
      </div>
      {detail ? <p className="type-body-s text-text-muted">{detail}</p> : null}
    </div>
  )
}
