import { Fragment, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { cx } from './cx'
import { useInView, stagger } from './motion'

/* ------------------------------------------------------------------
   Data visualisation. Drawn, not illustrated: flat, square-ended,
   slate first then rose then sage, every chart names its source.
   ------------------------------------------------------------------ */

export type ChartTone = 'slate' | 'rose' | 'sage' | 'ink' | 'muted' | 'slate-light' | 'rose-light'
export const tones: Record<ChartTone, { stroke: string; bg: string; text: string }> = {
  slate: { stroke: 'var(--color-slate)', bg: 'bg-slate', text: 'text-slate-deep' },
  rose: { stroke: 'var(--color-rose)', bg: 'bg-rose', text: 'text-rose-deep' },
  sage: { stroke: 'var(--color-sage-deep)', bg: 'bg-sage-deep', text: 'text-sage-dark' },
  ink: { stroke: 'var(--color-text)', bg: 'bg-text', text: 'text-text' },
  muted: { stroke: 'var(--color-border-strong)', bg: 'bg-border-strong', text: 'text-text-muted' },
  'slate-light': { stroke: 'var(--color-slate-light)', bg: 'bg-slate-light', text: 'text-slate-deep' },
  'rose-light': { stroke: 'var(--color-rose-light)', bg: 'bg-rose-light', text: 'text-rose-deep' },
}
export const seriesOrder: ChartTone[] = ['slate', 'rose', 'sage', 'ink']
/** Solid lighter step used to de-emphasise bars (no opacity). */
const dimmed: Record<ChartTone, string> = {
  slate: 'var(--color-slate-light)',
  rose: 'var(--color-rose-light)',
  sage: 'var(--color-sage)',
  ink: 'var(--color-border-strong)',
  muted: 'var(--color-border)',
  'slate-light': 'var(--color-slate-wash)',
  'rose-light': 'var(--color-rose-wash)',
}

const strokeOf = Object.fromEntries(Object.entries(tones).map(([k, v]) => [k, v.stroke])) as Record<ChartTone, string>
const defaultFormat = (n: number) => n.toLocaleString('en-IN', { maximumFractionDigits: 1 })

/** Measures the width of a container so SVG text stays crisp (no viewBox scaling). */
export function useMeasure<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [width, setWidth] = useState(0)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    setWidth(el.clientWidth)
    const ro = new ResizeObserver(([e]) => setWidth(Math.round(e.contentRect.width)))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, width] as const
}

/** Rounds up to a 1, 2, 2.5 or 5 step so four gridlines land on readable values. */
export function niceMax(max: number, ticks = 4) {
  if (max <= 0) return ticks
  const raw = max / ticks
  const exp = Math.pow(10, Math.floor(Math.log10(raw)))
  const f = raw / exp
  const nf = f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10
  return nf * exp * ticks
}

/* ---------------- Frame, legend, tooltip ---------------- */

export type LegendItem = { label: string; tone: ChartTone; dashed?: boolean; value?: string }

export function Legend({ items }: { items: LegendItem[] }) {
  return (
    <ul className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
      {items.map((it) => (
        <li key={it.label} className="flex items-center gap-2 type-body-s text-text">
          {it.dashed ? (
            <span aria-hidden="true" className="w-4 border-t-2 border-dashed" style={{ borderColor: tones[it.tone].stroke }} />
          ) : (
            <span aria-hidden="true" className={cx('size-2', tones[it.tone].bg)} />
          )}
          {it.label}
          {it.value ? <span className="font-mono text-[12px] text-text-muted">{it.value}</span> : null}
        </li>
      ))}
    </ul>
  )
}

/** Chart frame: header strip (label and code), optional title and actions, body, legend and source. */
export function ChartFrame({
  label,
  code,
  title,
  actions,
  legend,
  source,
  status,
  children,
  className,
}: {
  label: string
  code?: string
  title?: ReactNode
  actions?: ReactNode
  legend?: LegendItem[]
  source: string
  status?: string
  children: ReactNode
  className?: string
}) {
  return (
    <figure className={cx('flex min-w-0 flex-col border border-border bg-surface', className)}>
      <div className="flex h-8 shrink-0 items-center justify-between gap-3 border-b border-border px-4">
        <span className="truncate type-label text-text-label">{label}</span>
        <span className="flex items-center gap-3">
          {status ? <span className="border border-caution px-1.5 type-caption text-caution">{status}</span> : null}
          {code ? <span className="type-caption text-text-muted">{code}</span> : null}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5">
        {title || actions ? (
          <div className="flex flex-wrap items-start justify-between gap-3">
            {title ? <div className="type-heading text-text">{title}</div> : <span />}
            {actions}
          </div>
        ) : null}
        <div className="min-w-0 flex-1">{children}</div>
      </div>
      <figcaption className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-2.5">
        {legend ? <Legend items={legend} /> : <span />}
        <span className="type-caption text-text-muted">Source: {source}</span>
      </figcaption>
    </figure>
  )
}

function Tip({ x, y, width, title, rows }: { x: number; y: number; width: number; title: string; rows: { label: string; value: string; tone?: ChartTone }[] }) {
  const flip = x > width * 0.62
  return (
    <div
      role="presentation"
      className="pointer-events-none absolute z-20 min-w-36 bg-ink px-3 py-2 text-paper animate-fade-in"
      style={{ left: x, top: y, transform: `translate(${flip ? 'calc(-100% - 12px)' : '12px'}, -50%)` }}
    >
      <div className="mb-1 type-label text-slate-light">{title}</div>
      {rows.map((r) => (
        <div key={r.label} className="flex items-center justify-between gap-4 type-body-s">
          <span className="flex items-center gap-2">
            {r.tone ? <span className={cx('size-1.5', tones[r.tone].bg)} /> : null}
            {r.label}
          </span>
          <span className="font-mono text-[12px]">{r.value}</span>
        </div>
      ))}
    </div>
  )
}

const PAD = { top: 12, right: 12, bottom: 28, left: 48 }
/** Left padding sized to the longest y-axis label (mono, about 7px per character). */
const leftPad = (labels: string[]) => Math.max(36, Math.max(...labels.map((l) => l.length)) * 7 + 14)
const axisText = 'fill-text-muted font-mono text-[11px]'

function YAxis({ ticks, y, width, format, left }: { ticks: number[]; y: (v: number) => number; width: number; format: (n: number) => string; left: number }) {
  return (
    <g>
      {ticks.map((t, i) => (
        <g key={t}>
          <line x1={left} x2={width - PAD.right} y1={y(t)} y2={y(t)} stroke={i === 0 ? 'var(--color-rule)' : 'var(--color-border)'} strokeWidth={1} shapeRendering="crispEdges" />
          <text x={left - 8} y={y(t)} dy="0.32em" textAnchor="end" className={axisText}>
            {format(t)}
          </text>
        </g>
      ))}
    </g>
  )
}

function XLabels({ labels, x, height, width, left }: { labels: string[]; x: (i: number) => number; height: number; width: number; left: number }) {
  const every = Math.max(1, Math.ceil(labels.length / Math.max(1, Math.floor((width - left) / 64))))
  const last = labels.length - 1
  return (
    <g>
      {labels.map((l, i) => {
        const show = i === last || (i % every === 0 && last - i >= every * 0.75)
        if (!show) return null
        const anchor = i === last && x(i) > width - PAD.right - 24 ? 'end' : 'middle'
        return (
          <text key={i} x={anchor === 'end' ? width - 2 : x(i)} y={height - 8} textAnchor={anchor} className={axisText}>
            {l}
          </text>
        )
      })}
    </g>
  )
}

/* ---------------- Line chart ---------------- */

export type LineSeries = { name: string; data: number[]; tone?: ChartTone; dashed?: boolean }

export function LineChart({
  labels,
  series,
  height = 240,
  format = defaultFormat,
  area = false,
  target,
}: {
  labels: string[]
  series: LineSeries[]
  height?: number
  format?: (n: number) => string
  area?: boolean
  target?: { value: number; label: string }
}) {
  const [box, width] = useMeasure<HTMLDivElement>()
  const [view, inView] = useInView<HTMLDivElement>()
  const [hover, setHover] = useState<number | null>(null)
  const max = niceMax(Math.max(...series.flatMap((s) => s.data), target?.value ?? 0) * 1.08)
  const ticks = [0, 1, 2, 3, 4].map((i) => (max / 4) * i)
  const L = leftPad(ticks.map(format))
  const plotW = Math.max(1, width - L - PAD.right)
  const plotH = height - PAD.top - PAD.bottom
  const step = labels.length > 1 ? plotW / (labels.length - 1) : 0
  const x = (i: number) => L + i * step
  const y = (v: number) => PAD.top + plotH - (v / max) * plotH
  const key = useMemo(() => series.map((s) => s.data.join(',')).join('|'), [series])

  const pathOf = (d: number[]) => d.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ')

  return (
    <div ref={view} className="w-full">
      <div ref={box} className="relative w-full" style={{ height }}>
        {width > 0 ? (
          <svg
            width={width}
            height={height}
            role="img"
            aria-label={`Line chart: ${series.map((s) => s.name).join(', ')}`}
            onPointerLeave={() => setHover(null)}
            onPointerMove={(e) => {
              const r = (e.currentTarget as SVGSVGElement).getBoundingClientRect()
              const i = Math.round((e.clientX - r.left - L) / (step || 1))
              setHover(Math.max(0, Math.min(labels.length - 1, i)))
            }}
          >
            <YAxis ticks={ticks} y={y} width={width} format={format} left={L} />
            <XLabels labels={labels} x={x} height={height} width={width} left={L} />
            {inView ? (
              <g key={key}>
                {area && series[0] ? (
                  <path
                    d={`${pathOf(series[0].data)} L${x(series[0].data.length - 1)} ${y(0)} L${x(0)} ${y(0)} Z`}
                    fill={series[0].tone === 'rose' ? 'var(--color-rose-tint)' : series[0].tone === 'sage' ? 'var(--color-sage-tint)' : 'var(--color-slate-tint)'}
                    className="animate-fade-in"
                    style={{ animationDelay: '400ms', animationDuration: '600ms' }}
                  />
                ) : null}
                {target ? (
                  <g className="animate-fade-in" style={{ animationDelay: '600ms' }}>
                    <line x1={L} x2={width - PAD.right} y1={y(target.value)} y2={y(target.value)} stroke="var(--color-text-accent)" strokeDasharray="4 4" />
                    <text x={width - PAD.right} y={y(target.value) - 6} textAnchor="end" className="fill-text-accent font-mono text-[11px] uppercase">
                      {target.label}
                    </text>
                  </g>
                ) : null}
                {series.map((s, si) => (
                  <path
                    key={s.name}
                    d={pathOf(s.data)}
                    fill="none"
                    stroke={tones[s.tone ?? seriesOrder[si]].stroke}
                    strokeWidth={2}
                    strokeLinejoin="miter"
                    pathLength={s.dashed ? undefined : 1}
                    strokeDasharray={s.dashed ? '5 4' : 1}
                    className={s.dashed ? 'animate-fade-in' : 'animate-draw'}
                    style={stagger(si, 150)}
                  />
                ))}
              </g>
            ) : null}
            {hover !== null ? (
              <g>
                <line x1={x(hover)} x2={x(hover)} y1={PAD.top} y2={PAD.top + plotH} stroke="var(--color-rule)" strokeWidth={1} shapeRendering="crispEdges" />
                {series.map((s, si) => (
                  <rect
                    key={s.name}
                    x={x(hover) - 3.5}
                    y={y(s.data[hover]) - 3.5}
                    width={7}
                    height={7}
                    fill={tones[s.tone ?? seriesOrder[si]].stroke}
                    stroke="var(--color-surface)"
                    strokeWidth={1.5}
                  />
                ))}
              </g>
            ) : null}
          </svg>
        ) : null}
        {hover !== null && width > 0 ? (
          <Tip
            x={x(hover)}
            y={y(Math.max(...series.map((s) => s.data[hover])))}
            width={width}
            title={labels[hover]}
            rows={series.map((s, si) => ({ label: s.name, value: format(s.data[hover]), tone: s.tone ?? seriesOrder[si] }))}
          />
        ) : null}
      </div>
    </div>
  )
}

/* ---------------- Bar chart ---------------- */

export type BarSeries = { name: string; data: number[]; tone?: ChartTone }

export function BarChart({
  labels,
  series,
  stacked = false,
  height = 240,
  format = defaultFormat,
  target,
  highlightLast = false,
}: {
  labels: string[]
  series: BarSeries[]
  stacked?: boolean
  height?: number
  format?: (n: number) => string
  target?: { value: number; label: string }
  highlightLast?: boolean
}) {
  const [box, width] = useMeasure<HTMLDivElement>()
  const [view, inView] = useInView<HTMLDivElement>()
  const [hover, setHover] = useState<number | null>(null)
  const totals = labels.map((_, i) => series.reduce((a, s) => a + (s.data[i] ?? 0), 0))
  const rawMax = stacked ? Math.max(...totals) : Math.max(...series.flatMap((s) => s.data))
  const max = niceMax(Math.max(rawMax, target?.value ?? 0) * 1.08)
  const ticks = [0, 1, 2, 3, 4].map((i) => (max / 4) * i)
  const L = leftPad(ticks.map(format))
  const plotW = Math.max(1, width - L - PAD.right)
  const plotH = height - PAD.top - PAD.bottom
  const group = plotW / labels.length
  const barArea = Math.min(group * 0.64, stacked ? 40 : 18 * series.length)
  const cx_ = (i: number) => L + group * i + group / 2
  const y = (v: number) => PAD.top + plotH - (v / max) * plotH
  const key = useMemo(() => series.map((s) => s.data.join(',')).join('|') + stacked, [series, stacked])

  return (
    <div ref={view} className="w-full">
      <div ref={box} className="relative w-full" style={{ height }}>
        {width > 0 ? (
          <svg width={width} height={height} role="img" aria-label={`Bar chart: ${series.map((s) => s.name).join(', ')}`} onPointerLeave={() => setHover(null)}>
            <YAxis ticks={ticks} y={y} width={width} format={format} left={L} />
            <XLabels labels={labels} x={cx_} height={height} width={width} left={L} />
            {hover !== null ? <rect x={L + group * hover} y={PAD.top} width={group} height={plotH} fill="var(--color-surface-sunken)" /> : null}
            {inView ? (
              <g key={key}>
                {labels.map((_, i) => {
                  const dim = highlightLast && i !== labels.length - 1
                  if (stacked) {
                    let acc = 0
                    return (
                      <g key={i} className="animate-grow-y svg-origin-bottom" style={stagger(i, 30)}>
                        {series.map((s, si) => {
                          const v = s.data[i] ?? 0
                          const top = y(acc + v)
                          const h = y(acc) - top
                          acc += v
                          return (
                            <rect
                              key={s.name}
                              x={cx_(i) - barArea / 2}
                              y={top}
                              width={barArea}
                              height={Math.max(0, h - (si < series.length - 1 && h > 2 ? 1 : 0))}
                              fill={(dim ? dimmed : strokeOf)[s.tone ?? seriesOrder[si]]}
                            />
                          )
                        })}
                      </g>
                    )
                  }
                  const bw = barArea / series.length
                  return (
                    <g key={i} className="animate-grow-y svg-origin-bottom" style={stagger(i, 30)}>
                      {series.map((s, si) => {
                        const v = s.data[i] ?? 0
                        return (
                          <rect
                            key={s.name}
                            x={cx_(i) - barArea / 2 + si * bw + (series.length > 1 ? 1 : 0)}
                            y={y(v)}
                            width={Math.max(1, bw - (series.length > 1 ? 2 : 0))}
                            height={Math.max(0, y(0) - y(v))}
                            fill={(dim ? dimmed : strokeOf)[s.tone ?? seriesOrder[si]]}
                          />
                        )
                      })}
                    </g>
                  )
                })}
                {target ? (
                  <g className="animate-fade-in" style={{ animationDelay: '500ms' }}>
                    <line x1={L} x2={width - PAD.right} y1={y(target.value)} y2={y(target.value)} stroke="var(--color-text-accent)" strokeDasharray="4 4" />
                    <text x={width - PAD.right} y={y(target.value) - 6} textAnchor="end" className="fill-text-accent font-mono text-[11px] uppercase">
                      {target.label}
                    </text>
                  </g>
                ) : null}
              </g>
            ) : null}
            {labels.map((_, i) => (
              <rect key={i} x={L + group * i} y={PAD.top} width={group} height={plotH} fill="transparent" onPointerEnter={() => setHover(i)} />
            ))}
          </svg>
        ) : null}
        {hover !== null && width > 0 ? (
          <Tip
            x={cx_(hover)}
            y={y(stacked ? totals[hover] : Math.max(...series.map((s) => s.data[hover] ?? 0))) + 10}
            width={width}
            title={labels[hover]}
            rows={[
              ...series.map((s, si) => ({ label: s.name, value: format(s.data[hover] ?? 0), tone: s.tone ?? seriesOrder[si] })),
              ...(stacked && series.length > 1 ? [{ label: 'Total', value: format(totals[hover]) }] : []),
            ]}
          />
        ) : null}
      </div>
    </div>
  )
}

/* ---------------- Donut ---------------- */

export type Segment = { label: string; value: number; tone: ChartTone }

export function DonutChart({
  segments,
  size = 196,
  thickness = 22,
  centreLabel = 'Total',
  format = defaultFormat,
}: {
  segments: Segment[]
  size?: number
  thickness?: number
  centreLabel?: string
  format?: (n: number) => string
}) {
  const [view, inView] = useInView<HTMLDivElement>()
  const [hover, setHover] = useState<number | null>(null)
  const total = segments.reduce((a, s) => a + s.value, 0)
  const r = (size - thickness) / 2 - 3
  const C = 2 * Math.PI * r
  const gap = segments.length > 1 ? 2 : 0
  let offset = 0
  const key = segments.map((s) => s.value).join(',')
  const active = hover !== null ? segments[hover] : null

  return (
    <div ref={view} className="flex flex-wrap items-center gap-6">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} role="img" aria-label={`Donut chart, total ${format(total)}`} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-surface-sunken)" strokeWidth={thickness} />
          {inView ? (
            <g key={key}>
              {segments.map((s, i) => {
                const len = (s.value / total) * C
                const el = (
                  <circle
                    key={s.label}
                    cx={size / 2}
                    cy={size / 2}
                    r={r}
                    fill="none"
                    stroke={tones[s.tone].stroke}
                    strokeWidth={hover === i ? thickness + 6 : thickness}
                    strokeDasharray={`${Math.max(0, len - gap)} ${C}`}
                    strokeDashoffset={-offset}
                    className="animate-sweep cursor-pointer transition-[stroke-width] duration-150"
                    style={{ '--sweep-c': C, animationDelay: `${(offset / C) * 500}ms` } as CSSProperties}
                    onPointerEnter={() => setHover(i)}
                    onPointerLeave={() => setHover(null)}
                  />
                )
                offset += len
                return el
              })}
            </g>
          ) : null}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-display text-[28px] leading-none font-semibold tracking-[-0.04em] text-text">{format(active ? active.value : total)}</span>
          <span className="mt-1 max-w-24 type-caption text-text-muted">{active ? active.label : centreLabel}</span>
          {active ? <span className="font-mono text-[11px] text-text-label">{Math.round((active.value / total) * 100)}%</span> : null}
        </div>
      </div>
      <ul className="flex min-w-40 flex-1 flex-col">
        {segments.map((s, i) => (
          <li
            key={s.label}
            onPointerEnter={() => setHover(i)}
            onPointerLeave={() => setHover(null)}
            className={cx('flex items-center justify-between gap-3 border-b border-border py-1.5 last:border-b-0', hover === i && 'bg-hover')}
          >
            <span className="flex items-center gap-2 type-body-s text-text">
              <span className={cx('size-2', tones[s.tone].bg)} />
              {s.label}
            </span>
            <span className="flex items-baseline gap-2">
              <span className="font-mono text-[12px] text-text">{format(s.value)}</span>
              <span className="w-9 text-right font-mono text-[11px] text-text-muted">{Math.round((s.value / total) * 100)}%</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ---------------- Funnel ---------------- */

const funnelShades = ['bg-slate-deep', 'bg-slate', 'bg-layer-slate-mid', 'bg-slate-light', 'bg-slate-wash', 'bg-slate-tint']
const funnelShadesRose = ['bg-rose-deep', 'bg-rose', 'bg-layer-rose-mid', 'bg-rose-light', 'bg-rose-wash', 'bg-rose-tint']
const funnelShadesSage = ['bg-sage-dark', 'bg-sage-deep', 'bg-layer-sage-mid', 'bg-sage', 'bg-sage-wash', 'bg-sage-tint']

/** Funnel: centred square bars, conversion and drop-off stated between stages. */
export function Funnel({
  stages,
  format = defaultFormat,
  tone = 'slate',
}: {
  stages: { label: string; value: number; caption?: string }[]
  format?: (n: number) => string
  tone?: 'slate' | 'rose' | 'sage'
}) {
  const [view, inView] = useInView<HTMLDivElement>()
  const top = stages[0]?.value || 1
  const shades = tone === 'rose' ? funnelShadesRose : tone === 'sage' ? funnelShadesSage : funnelShades
  const key = stages.map((s) => s.value).join(',')
  return (
    <div ref={view} className="flex flex-col" role="list" aria-label="Funnel">
      {stages.map((s, i) => {
        const pct = (s.value / top) * 100
        const prev = stages[i - 1]
        const conv = prev ? Math.round((s.value / prev.value) * 100) : null
        return (
          <Fragment key={s.label}>
            {conv !== null ? (
              <div className="py-1.5 text-center type-caption text-text-muted">
                {conv}% carried forward · {format(prev!.value - s.value)} dropped
              </div>
            ) : null}
            <div role="listitem" className="group grid grid-cols-[minmax(84px,150px)_1fr_64px] items-center gap-3">
              <span className="flex flex-col">
                <span className="type-body-s font-medium text-text">{s.label}</span>
                {s.caption ? <span className="type-caption text-text-muted">{s.caption}</span> : null}
              </span>
              <span className="flex h-9 justify-center bg-surface-raised">
                {inView ? (
                  <span
                    key={key}
                    className={cx('block h-full origin-center animate-grow-x transition-opacity group-hover:opacity-80', shades[Math.min(i, shades.length - 1)])}
                    style={{ width: `${Math.max(2, pct)}%`, ...stagger(i, 90) }}
                  />
                ) : null}
              </span>
              <span className="flex flex-col items-end">
                <span className="font-mono text-[13px] font-medium text-text">{format(s.value)}</span>
                <span className="type-caption text-text-muted">{Math.round(pct)}%</span>
              </span>
            </div>
          </Fragment>
        )
      })}
    </div>
  )
}

/* ---------------- Heatmap ---------------- */

const scales = {
  slate: ['bg-surface-sunken', 'bg-slate-wash', 'bg-slate-light', 'bg-slate', 'bg-slate-deep'],
  rose: ['bg-surface-sunken', 'bg-rose-wash', 'bg-rose-light', 'bg-rose', 'bg-rose-deep'],
  sage: ['bg-surface-sunken', 'bg-sage-wash', 'bg-sage', 'bg-sage-deep', 'bg-sage-dark'],
}
export type ScaleTone = keyof typeof scales

/** Heatmap: five solid steps, a readout line that names the hovered cell. */
export function Heatmap({
  rows,
  cols,
  values,
  unit = '',
  tone = 'slate',
  colEvery = 3,
}: {
  rows: string[]
  cols: string[]
  values: number[][]
  unit?: string
  tone?: ScaleTone
  colEvery?: number
}) {
  const [view, inView] = useInView<HTMLDivElement>()
  const [hover, setHover] = useState<{ r: number; c: number } | null>(null)
  const flat = values.flat()
  const max = Math.max(...flat, 1)
  const step = (v: number) => (v === 0 ? 0 : Math.min(4, Math.ceil((v / max) * 4)))
  const peak = useMemo(() => {
    let best = { r: 0, c: 0, v: -1 }
    values.forEach((row, r) => row.forEach((v, c) => v > best.v && (best = { r, c, v })))
    return best
  }, [values])
  const key = flat.join(',')
  const read = hover ?? { r: peak.r, c: peak.c }
  return (
    <div ref={view} className="flex flex-col gap-3">
      <p className="type-body-s text-text" aria-live="polite">
        <span className="type-label text-text-label">{hover ? 'Selected' : 'Peak'}</span>{' '}
        {rows[read.r]} {cols[read.c]} · <span className="font-mono">{values[read.r][read.c]}</span> {unit}
      </p>
      <div className="grid gap-0.5" style={{ gridTemplateColumns: `40px repeat(${cols.length}, minmax(0, 1fr))` }} onPointerLeave={() => setHover(null)}>
        {rows.map((rl, r) => (
          <Fragment key={rl}>
            <span className="flex items-center font-mono text-[11px] text-text-muted">{rl}</span>
            {cols.map((cl, c) => (
              <span
                key={`${key}-${c}`}
                role="img"
                aria-label={`${rl} ${cl}: ${values[r][c]} ${unit}`}
                onPointerEnter={() => setHover({ r, c })}
                className={cx(
                  'h-6 cursor-crosshair',
                  scales[tone][step(values[r][c])],
                  hover && hover.r === r && hover.c === c && 'outline-2 outline-offset-1 outline-text',
                  inView ? 'animate-fade-in' : 'opacity-0',
                )}
                style={inView ? stagger(c + r, 18) : undefined}
              />
            ))}
          </Fragment>
        ))}
        <span />
        {cols.map((cl, c) => (
          <span key={cl} className="pt-1 font-mono text-[11px] text-text-muted">
            {c % colEvery === 0 ? cl : ''}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-2 self-end">
        <span className="type-caption text-text-muted">Fewer</span>
        {scales[tone].map((s) => (
          <span key={s} className={cx('size-3', s)} />
        ))}
        <span className="type-caption text-text-muted">More</span>
      </div>
    </div>
  )
}

/* ---------------- Gauge ---------------- */

export function Gauge({
  value,
  target,
  label,
  size = 220,
  tone = 'slate',
  suffix = '%',
}: {
  value: number
  target?: number
  label: string
  size?: number
  tone?: ChartTone
  suffix?: string
}) {
  const [view, inView] = useInView<HTMLDivElement>()
  const th = 16
  const r = (size - th) / 2
  const cx0 = size / 2
  const cy0 = size / 2
  const arc = `M ${cx0 - r} ${cy0} A ${r} ${r} 0 0 1 ${cx0 + r} ${cy0}`
  const angle = (v: number) => Math.PI * (1 - v / 100)
  const tick = target !== undefined ? { x1: cx0 + (r - th) * Math.cos(angle(target)), y1: cy0 - (r - th) * Math.sin(angle(target)), x2: cx0 + (r + th / 2 + 4) * Math.cos(angle(target)), y2: cy0 - (r + th / 2 + 4) * Math.sin(angle(target)) } : null
  return (
    <div ref={view} className="flex flex-col items-center">
      <svg width={size} height={size / 2 + 22} role="img" aria-label={`${label}: ${value}${suffix}${target !== undefined ? `, target ${target}${suffix}` : ''}`}>
        <path d={arc} fill="none" stroke="var(--color-surface-sunken)" strokeWidth={th} />
        {inView ? (
          <path
            key={value}
            d={arc}
            fill="none"
            stroke={tones[tone].stroke}
            strokeWidth={th}
            pathLength={100}
            strokeDasharray={`${value} 100`}
            className="animate-sweep"
            style={{ '--sweep-c': 100 } as CSSProperties}
          />
        ) : null}
        {tick ? <line {...tick} stroke="var(--color-text-accent)" strokeWidth={2} /> : null}
        <text x={cx0 - r - th / 2} y={cy0 + 16} textAnchor="start" className={axisText}>
          0
        </text>
        <text x={cx0 + r + th / 2} y={cy0 + 16} textAnchor="end" className={axisText}>
          100
        </text>
      </svg>
      <div className="-mt-20 flex flex-col items-center">
        <span className="font-display text-[34px] leading-none font-semibold tracking-[-0.04em] text-text">
          {value}
          <span className="text-[18px] text-text-muted">{suffix}</span>
        </span>
        <span className="mt-1 type-caption text-text-muted">{label}</span>
        {target !== undefined ? <span className="mt-0.5 font-mono text-[11px] text-text-accent">Target {target}{suffix}</span> : null}
      </div>
    </div>
  )
}

/* ---------------- Sparkline ---------------- */

export function Sparkline({ data, tone = 'slate', width = 120, height = 32, label }: { data: number[]; tone?: ChartTone; width?: number; height?: number; label?: string }) {
  const [view, inView] = useInView<HTMLSpanElement>()
  const min = Math.min(...data)
  const max = Math.max(...data)
  const x = (i: number) => 2 + (i / (data.length - 1)) * (width - 6)
  const y = (v: number) => 3 + (1 - (v - min) / (max - min || 1)) * (height - 6)
  const d = data.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ')
  const last = data.length - 1
  return (
    <span ref={view} className="inline-block" style={{ width, height }}>
      <svg width={width} height={height} role="img" aria-label={label ?? `Trend from ${data[0]} to ${data[last]}`}>
        {inView ? (
          <g key={data.join(',')}>
            <path d={d} fill="none" stroke={tones[tone].stroke} strokeWidth={1.5} pathLength={1} strokeDasharray={1} className="animate-draw" />
            <rect x={x(last) - 2.5} y={y(data[last]) - 2.5} width={5} height={5} fill={tones[tone].stroke} className="animate-fade-in" style={{ animationDelay: '900ms' }} />
          </g>
        ) : null}
      </svg>
    </span>
  )
}

/* ---------------- Scatter ---------------- */

export type ScatterPoint = { x: number; y: number; label: string; flag?: boolean }

export function ScatterPlot({
  points,
  xLabel,
  yLabel,
  height = 280,
  diagonal = false,
  format = defaultFormat,
  flagLabel = 'Flagged',
}: {
  points: ScatterPoint[]
  xLabel: string
  yLabel: string
  height?: number
  diagonal?: boolean
  format?: (n: number) => string
  flagLabel?: string
}) {
  const [box, width] = useMeasure<HTMLDivElement>()
  const [view, inView] = useInView<HTMLDivElement>()
  const [hover, setHover] = useState<number | null>(null)
  const pad = { ...PAD, bottom: 40, left: 56, right: 24 }
  const max = niceMax(Math.max(...points.flatMap((p) => [p.x, p.y])) * 1.05)
  const ticks = [0, 1, 2, 3, 4].map((i) => (max / 4) * i)
  const plotW = Math.max(1, width - pad.left - pad.right)
  const plotH = height - pad.top - pad.bottom
  const x = (v: number) => pad.left + (v / max) * plotW
  const y = (v: number) => pad.top + plotH - (v / max) * plotH
  const key = points.map((p) => p.x + ':' + p.y).join(',')
  return (
    <div ref={view} className="w-full">
      <div ref={box} className="relative w-full" style={{ height }}>
        {width > 0 ? (
          <svg width={width} height={height} role="img" aria-label={`Scatter plot of ${yLabel} against ${xLabel}`}>
            {ticks.map((t, i) => (
              <g key={t}>
                <line x1={pad.left} x2={width - pad.right} y1={y(t)} y2={y(t)} stroke={i === 0 ? 'var(--color-rule)' : 'var(--color-border)'} shapeRendering="crispEdges" />
                <line x1={x(t)} x2={x(t)} y1={pad.top} y2={pad.top + plotH} stroke={i === 0 ? 'var(--color-rule)' : 'var(--color-border)'} shapeRendering="crispEdges" />
                <text x={pad.left - 8} y={y(t)} dy="0.32em" textAnchor="end" className={axisText}>
                  {format(t)}
                </text>
                <text x={x(t)} y={pad.top + plotH + 16} textAnchor="middle" className={axisText}>
                  {format(t)}
                </text>
              </g>
            ))}
            <text x={pad.left + plotW / 2} y={height - 4} textAnchor="middle" className="fill-text-label font-mono text-[11px] uppercase">
              {xLabel}
            </text>
            <text transform={`translate(12 ${pad.top + plotH / 2}) rotate(-90)`} textAnchor="middle" className="fill-text-label font-mono text-[11px] uppercase">
              {yLabel}
            </text>
            {diagonal ? (
              <g>
                <line x1={x(0)} y1={y(0)} x2={x(max)} y2={y(max)} stroke="var(--color-text-muted)" strokeDasharray="4 4" />
                <text x={x(max * 0.98)} y={y(max * 0.98) + 14} textAnchor="end" className="fill-text-muted font-mono text-[11px] uppercase">
                  1 : 1
                </text>
              </g>
            ) : null}
            {inView ? (
              <g key={key}>
                {points.map((p, i) => (
                  <rect
                    key={i}
                    x={x(p.x) - 3.5}
                    y={y(p.y) - 3.5}
                    width={7}
                    height={7}
                    fill={p.flag ? 'var(--color-rose-deep)' : 'var(--color-slate)'}
                    stroke={hover === i ? 'var(--color-text)' : 'var(--color-surface)'}
                    strokeWidth={hover === i ? 2 : 1}
                    className="animate-fade-in svg-origin-center cursor-pointer"
                    style={stagger(i, 12, 100)}
                    onPointerEnter={() => setHover(i)}
                    onPointerLeave={() => setHover(null)}
                  />
                ))}
              </g>
            ) : null}
          </svg>
        ) : null}
        {hover !== null && width > 0 ? (
          <Tip
            x={x(points[hover].x)}
            y={y(points[hover].y)}
            width={width}
            title={points[hover].label}
            rows={[
              { label: xLabel, value: format(points[hover].x) },
              { label: yLabel, value: format(points[hover].y) },
              ...(points[hover].flag ? [{ label: flagLabel, value: `${Math.round((points[hover].y / points[hover].x - 1) * 100)}%`, tone: 'rose' as ChartTone }] : []),
            ]}
          />
        ) : null}
      </div>
    </div>
  )
}

/* ---------------- Ward tile map ---------------- */

export type Tile = { id: string; label: string; row: number; col: number; value: number; name?: string }

/** Schematic tile map: one square per ward, coloured on a five-step scale. Not a geographic map. */
export function TileMap({
  tiles,
  tone = 'slate',
  unit = '',
  selected,
  onSelect,
}: {
  tiles: Tile[]
  tone?: ScaleTone
  unit?: string
  selected?: string | null
  onSelect?: (id: string) => void
}) {
  const [view, inView] = useInView<HTMLDivElement>()
  const [hover, setHover] = useState<Tile | null>(null)
  const rows = Math.max(...tiles.map((t) => t.row)) + 1
  const cols = Math.max(...tiles.map((t) => t.col)) + 1
  const max = Math.max(...tiles.map((t) => t.value), 1)
  const step = (v: number) => Math.min(4, Math.max(1, Math.ceil((v / max) * 4)))
  const show = hover ?? tiles.find((t) => t.id === selected) ?? null
  return (
    <div ref={view} className="flex flex-col gap-3">
      <p className="h-5 type-body-s text-text" aria-live="polite">
        {show ? (
          <>
            <span className="type-label text-text-label">Ward {show.label}</span> {show.name ? `${show.name} · ` : ''}
            <span className="font-mono">{show.value}</span> {unit}
          </>
        ) : (
          <span className="text-text-muted">Hover a ward for detail.</span>
        )}
      </p>
      <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${rows}, auto)` }} onPointerLeave={() => setHover(null)}>
        {tiles.map((t) => {
          const s = step(t.value)
          return (
            <button
              key={t.id}
              type="button"
              aria-label={`Ward ${t.label}: ${t.value} ${unit}`}
              aria-pressed={selected === t.id}
              onPointerEnter={() => setHover(t)}
              onFocus={() => setHover(t)}
              onClick={() => onSelect?.(t.id)}
              className={cx(
                'flex aspect-square cursor-pointer items-center justify-center font-mono text-[11px] transition-[outline] duration-100',
                scales[tone][s],
                s >= 3 ? 'text-paper' : 'text-ink',
                selected === t.id ? 'outline-2 outline-offset-1 outline-text' : 'hover:outline-2 hover:outline-offset-1 hover:outline-border-strong',
                inView ? 'animate-fade-in' : 'opacity-0',
              )}
              style={{ gridRow: t.row + 1, gridColumn: t.col + 1, ...(inView ? stagger(t.row + t.col, 25) : {}) }}
            >
              {t.label}
            </button>
          )
        })}
      </div>
      <div className="flex items-center gap-2 self-end">
        <span className="type-caption text-text-muted">Low</span>
        {scales[tone].slice(1).map((s) => (
          <span key={s} className={cx('size-3', s)} />
        ))}
        <span className="type-caption text-text-muted">High</span>
      </div>
    </div>
  )
}

/* ---------------- Timeline ---------------- */

export type TimelineEvent = { date: string; title: string; position: number; tone?: ChartTone }

/** Dated events on one axis, labels alternating above and below. Seven labelled moments at most. */
export function Timeline({ events, height = 200 }: { events: TimelineEvent[]; height?: number }) {
  const [view, inView] = useInView<HTMLDivElement>()
  const shown = events.slice(0, 7)
  return (
    <div ref={view} className="relative w-full" style={{ height }} role="list" aria-label="Timeline">
      <div className={cx('absolute top-1/2 right-0 left-0 h-px origin-left bg-rule', inView ? 'animate-grow-x' : 'scale-x-0')} />
      {shown.map((e, i) => {
        const above = i % 2 === 0
        return (
          <div
            key={e.title}
            role="listitem"
            className={cx('absolute top-0 bottom-0 w-36 -translate-x-1/2', inView ? 'animate-fade-in' : 'opacity-0')}
            style={{ left: `${Math.min(96, Math.max(4, e.position * 100))}%`, ...(inView ? stagger(i, 120, 300) : {}) }}
          >
            <span className={cx('absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2', tones[e.tone ?? 'slate'].bg)} />
            <span className={cx('absolute left-1/2 h-4 w-px bg-border-strong', above ? 'bottom-[calc(50%+5px)]' : 'top-[calc(50%+5px)]')} />
            <span className={cx('absolute inset-x-0 flex flex-col items-center text-center', above ? 'bottom-[calc(50%+24px)]' : 'top-[calc(50%+24px)]')}>
              <span className="type-label text-text-label">{e.date}</span>
              <span className="type-body-s text-text">{e.title}</span>
            </span>
          </div>
        )
      })}
    </div>
  )
}

/* ---------------- Composition bar ---------------- */

export function CompositionBar({ segments, format = defaultFormat }: { segments: Segment[]; format?: (n: number) => string }) {
  const [view, inView] = useInView<HTMLDivElement>()
  const total = segments.reduce((a, s) => a + s.value, 0)
  return (
    <div ref={view} className="flex flex-col gap-3">
      <div className="flex h-4 w-full overflow-hidden bg-surface-sunken">
        <div key={segments.map((s) => s.value).join(',')} className={cx('flex w-full origin-left gap-px', inView ? 'animate-grow-x' : 'scale-x-0')}>
          {segments.map((s) => (
            <span key={s.label} title={`${s.label}: ${format(s.value)}`} className={cx('h-full', tones[s.tone].bg)} style={{ width: `${(s.value / total) * 100}%` }} />
          ))}
        </div>
      </div>
      <ul className="flex flex-wrap gap-x-5 gap-y-1.5">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center gap-2 type-body-s whitespace-nowrap">
            <span className="flex items-center gap-2 text-text">
              <span className={cx('size-2', tones[s.tone].bg)} />
              {s.label}
            </span>
            <span className="font-mono text-[12px] text-text-muted">{Math.round((s.value / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
