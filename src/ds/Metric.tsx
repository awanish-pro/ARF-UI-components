import type { CSSProperties, ReactNode } from 'react'
import { cx } from './cx'

/** StatFigure: 1px rule above, outlined figure, label in body-s text-muted. Only figures with a source. */
export function StatFigure({ figure, label, size = 'xl', stroke }: { figure: string; label: ReactNode; size?: 'xl' | 'm'; stroke?: string }) {
  return (
    <div className="flex flex-col gap-3 border-t border-rule pt-4">
      <span
        className={cx(size === 'xl' ? 'type-figure-xl' : 'type-figure-m', 'figure-outline block whitespace-nowrap')}
        style={stroke ? ({ '--figure-stroke': stroke } as CSSProperties) : undefined}
      >
        {figure}
      </span>
      <span className="max-w-56 type-body-s text-text-muted">{label}</span>
    </div>
  )
}

/** Metric card for dashboards: label, solid figure, delta stated in words, flat bar sparkline, source. */
export function MetricCard({
  label,
  code,
  value,
  unit,
  delta,
  deltaDirection,
  goodWhen = 'up',
  series,
  barColour = 'bg-slate',
  source,
  status,
}: {
  label: string
  code?: string
  value: ReactNode
  unit?: string
  delta?: string
  deltaDirection?: 'up' | 'down'
  goodWhen?: 'up' | 'down'
  series?: number[]
  barColour?: string
  source: string
  status?: string
}) {
  const good = deltaDirection ? deltaDirection === goodWhen : undefined
  const max = series ? Math.max(...series) : 1
  return (
    <div className="flex flex-col border border-border bg-surface">
      <div className="flex h-8 items-center justify-between border-b border-border px-4">
        <span className="type-label text-text-label">{label}</span>
        {code ? <span className="type-caption text-text-muted">{code}</span> : null}
      </div>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-end justify-between gap-4">
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-[34px] leading-none font-semibold tracking-[-0.04em] text-text">{value}</span>
            {unit ? <span className="type-body-s text-text-muted">{unit}</span> : null}
          </div>
          {series ? (
            <div className="flex h-10 items-end gap-0.5" aria-hidden="true">
              {series.map((v, i) => (
                <span
                  key={`${i}-${v}`}
                  className={cx('w-1.5 origin-bottom animate-grow-y', i === series.length - 1 ? barColour : 'bg-surface-sunken')}
                  style={{ height: `${Math.max(8, (v / max) * 100)}%`, animationDelay: `${i * 40}ms` }}
                />
              ))}
            </div>
          ) : null}
        </div>
        {delta ? (
          <p className="flex items-center gap-2 type-body-s">
            <span className={cx('font-mono text-[12px] font-medium', good === undefined ? 'text-text' : good ? 'text-success' : 'text-critical')}>
              {deltaDirection === 'up' ? '▲' : '▼'} {delta}
            </span>
            <span className="text-text-muted">{status}</span>
          </p>
        ) : null}
      </div>
      <div className="border-t border-border px-4 py-2 type-caption text-text-muted">Source: {source}</div>
    </div>
  )
}

/** Horizontal bar list: flat, square-ended bars, slate first, then rose, then sage. */
export function BarList({ items, source }: { items: { label: string; value: number; display: string; colour?: string }[]; source: string }) {
  const max = Math.max(...items.map((i) => i.value))
  return (
    <figure className="flex flex-col gap-3">
      {items.map((it, i) => (
        <div key={it.label} className="grid grid-cols-[140px_1fr_64px] items-center gap-3">
          <span className="truncate type-body-s text-text">{it.label}</span>
          <span className="h-3 bg-surface-sunken">
            <span
              key={it.value}
              className={cx('block h-full origin-left animate-grow-x', it.colour ?? 'bg-slate')}
              style={{ width: `${(it.value / max) * 100}%`, animationDelay: `${i * 60}ms` }}
            />
          </span>
          <span className="text-right font-mono text-[12px] text-text">{it.display}</span>
        </div>
      ))}
      <figcaption className="mt-1 type-caption text-text-muted">Source: {source}</figcaption>
    </figure>
  )
}
