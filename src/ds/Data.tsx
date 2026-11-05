import { useMemo, useState, type ReactNode } from 'react'
import { cx } from './cx'
import { Glyph } from './Glyph'
import { IconButton } from './Button'
import { Checkbox } from './Checkbox'
import { Avatar } from './Avatar'
import { stagger } from './motion'

/* ---------------- Pagination ---------------- */

function pageList(page: number, count: number): (number | '…')[] {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1)
  const set = new Set([1, count, page, page - 1, page + 1].filter((p) => p >= 1 && p <= count))
  const sorted = [...set].sort((a, b) => a - b)
  const out: (number | '…')[] = []
  sorted.forEach((p, i) => {
    if (i && p - sorted[i - 1] > 1) out.push('…')
    out.push(p)
  })
  return out
}

/** Square page buttons with ellipsis; the summary states the range in words. */
export function Pagination({ page, pageCount, onChange, summary }: { page: number; pageCount: number; onChange: (p: number) => void; summary?: ReactNode }) {
  return (
    <nav aria-label="Pagination" className="flex flex-wrap items-center justify-between gap-3">
      <span className="type-caption text-text-muted">{summary ?? `Page ${page} of ${pageCount}`}</span>
      <div className="flex items-center gap-1">
        <IconButton glyph="chevron-left" label="Previous page" size="sm" disabled={page <= 1} onClick={() => onChange(page - 1)} />
        {pageList(page, pageCount).map((p, i) =>
          p === '…' ? (
            <span key={`e${i}`} className="w-6 text-center font-mono text-[12px] text-text-muted">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              aria-current={p === page ? 'page' : undefined}
              onClick={() => onChange(p)}
              className={cx(
                'inline-flex h-8 min-w-8 cursor-pointer items-center justify-center px-2 font-mono text-[12px] transition-colors',
                p === page ? 'bg-action text-on-action' : 'text-text hover:bg-hover',
              )}
            >
              {p}
            </button>
          ),
        )}
        <IconButton glyph="chevron-right" label="Next page" size="sm" disabled={page >= pageCount} onClick={() => onChange(page + 1)} />
      </div>
    </nav>
  )
}

/* ---------------- Data table ---------------- */

export type Column<T> = {
  key: string
  header: string
  align?: 'left' | 'right'
  sortable?: boolean
  width?: string
  mono?: boolean
  render?: (row: T) => ReactNode
  sortValue?: (row: T) => string | number
}

/**
 * Data table: rule under the header, 1px row borders, sortable columns,
 * optional selection with a bulk action bar, and pagination.
 */
export function DataTable<T>({
  columns,
  rows,
  rowKey,
  selectable,
  onRowClick,
  pageSize = 8,
  empty,
  bulkActions,
  caption,
  initialSort,
}: {
  columns: Column<T>[]
  rows: T[]
  rowKey: (row: T) => string
  selectable?: boolean
  onRowClick?: (row: T) => void
  pageSize?: number
  empty?: ReactNode
  bulkActions?: (selected: T[], clear: () => void) => ReactNode
  caption?: string
  initialSort?: { key: string; dir: 'asc' | 'desc' }
}) {
  const [sort, setSort] = useState<{ key: string; dir: 'asc' | 'desc' } | null>(initialSort ?? null)
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const sorted = useMemo(() => {
    if (!sort) return rows
    const col = columns.find((c) => c.key === sort.key)
    if (!col) return rows
    const val = col.sortValue ?? ((r: T) => (r as Record<string, unknown>)[col.key] as string | number)
    return [...rows].sort((a, b) => {
      const va = val(a)
      const vb = val(b)
      const cmp = typeof va === 'number' && typeof vb === 'number' ? va - vb : String(va).localeCompare(String(vb))
      return sort.dir === 'asc' ? cmp : -cmp
    })
  }, [rows, sort, columns])

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize))
  const current = Math.min(page, pageCount)
  const visible = sorted.slice((current - 1) * pageSize, current * pageSize)
  const allOnPage = visible.length > 0 && visible.every((r) => selected.has(rowKey(r)))
  const someOnPage = visible.some((r) => selected.has(rowKey(r)))
  const selectedRows = rows.filter((r) => selected.has(rowKey(r)))
  const clear = () => setSelected(new Set())

  const toggleSort = (key: string) =>
    setSort((s) => (s?.key === key ? (s.dir === 'asc' ? { key, dir: 'desc' } : null) : { key, dir: 'asc' }))

  return (
    <div className="flex flex-col">
      {selectable && selectedRows.length > 0 && bulkActions ? (
        <div className="theme-ink flex animate-pop flex-wrap items-center justify-between gap-3 bg-grad-ink px-4 py-2">
          <span className="type-label">{selectedRows.length} selected</span>
          <div className="flex flex-wrap items-center gap-2">{bulkActions(selectedRows, clear)}</div>
        </div>
      ) : null}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse">
          {caption ? <caption className="sr-only">{caption}</caption> : null}
          <thead>
            <tr className="border-b border-rule bg-surface-raised">
              {selectable ? (
                <th className="w-10 px-4 py-2.5">
                  <Checkbox
                    label={<span className="sr-only">Select all on this page</span>}
                    checked={allOnPage}
                    indeterminate={!allOnPage && someOnPage}
                    onChange={(v) => {
                      const next = new Set(selected)
                      visible.forEach((r) => (v ? next.add(rowKey(r)) : next.delete(rowKey(r))))
                      setSelected(next)
                    }}
                  />
                </th>
              ) : null}
              {columns.map((c) => {
                const active = sort?.key === c.key
                return (
                  <th
                    key={c.key}
                    scope="col"
                    aria-sort={active ? (sort!.dir === 'asc' ? 'ascending' : 'descending') : undefined}
                    className={cx('px-4 py-2.5 type-label text-text-label', c.align === 'right' ? 'text-right' : 'text-left', c.width)}
                  >
                    {c.sortable ? (
                      <button
                        type="button"
                        onClick={() => toggleSort(c.key)}
                        className={cx('inline-flex cursor-pointer items-center gap-1 uppercase hover:text-text', active && 'text-text', c.align === 'right' && 'flex-row-reverse')}
                      >
                        {c.header}
                        <Glyph name={active && sort!.dir === 'desc' ? 'chevron-down' : 'chevron-up'} size={12} className={active ? 'text-text' : 'text-border-strong'} />
                      </button>
                    ) : (
                      c.header
                    )}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody key={`${current}-${sort?.key}-${sort?.dir}`}>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)}>{empty ?? <p className="px-4 py-10 text-center type-body-s text-text-muted">No records.</p>}</td>
              </tr>
            ) : (
              visible.map((r, i) => {
                const k = rowKey(r)
                const isSel = selected.has(k)
                return (
                  <tr
                    key={k}
                    onClick={onRowClick ? () => onRowClick(r) : undefined}
                    onKeyDown={onRowClick ? (e) => e.key === 'Enter' && onRowClick(r) : undefined}
                    tabIndex={onRowClick ? 0 : undefined}
                    className={cx(
                      'animate-fade-in border-b border-border transition-colors last:border-b-0',
                      isSel ? 'bg-selected' : 'hover:bg-hover',
                      onRowClick && 'cursor-pointer focus-visible:outline-offset-[-2px]',
                    )}
                    style={stagger(i, 25)}
                  >
                    {selectable ? (
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          label={<span className="sr-only">Select row {k}</span>}
                          checked={isSel}
                          onChange={(v) => {
                            const next = new Set(selected)
                            v ? next.add(k) : next.delete(k)
                            setSelected(next)
                          }}
                        />
                      </td>
                    ) : null}
                    {columns.map((c) => (
                      <td key={c.key} className={cx('px-4 py-3 type-body-s text-text', c.align === 'right' && 'text-right whitespace-nowrap', c.mono && 'font-mono text-[12px] whitespace-nowrap')}>
                        {c.render ? c.render(r) : String((r as Record<string, unknown>)[c.key] ?? '')}
                      </td>
                    ))}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
      {sorted.length > pageSize ? (
        <div className="border-t border-border px-4 py-2.5">
          <Pagination
            page={current}
            pageCount={pageCount}
            onChange={setPage}
            summary={`Showing ${(current - 1) * pageSize + 1} to ${Math.min(current * pageSize, sorted.length)} of ${sorted.length}`}
          />
        </div>
      ) : null}
    </div>
  )
}

/* ---------------- Description list ---------------- */

export function DescriptionList({ items, columns = 1 }: { items: { term: string; detail: ReactNode }[]; columns?: 1 | 2 }) {
  return (
    <dl className={cx('grid gap-x-8', columns === 2 && 'sm:grid-cols-2')}>
      {items.map((it) => (
        <div key={it.term} className="grid grid-cols-[minmax(110px,40%)_1fr] gap-3 border-b border-border py-2.5">
          <dt className="type-label text-text-label">{it.term}</dt>
          <dd className="type-body-s text-text">{it.detail}</dd>
        </div>
      ))}
    </dl>
  )
}

/* ---------------- Activity feed ---------------- */

export type Activity = { id: string; actor: string; action: ReactNode; time: string; module?: string; tone?: string; system?: boolean }

/** Vertical record of who did what and when, on a hairline with square nodes. */
export function ActivityFeed({ items, animate = true }: { items: Activity[]; animate?: boolean }) {
  return (
    <ol className="relative flex flex-col">
      <span aria-hidden="true" className="absolute top-2 bottom-2 left-[15px] w-px bg-border" />
      {items.map((a, i) => (
        <li key={a.id} className={cx('relative flex gap-3 pb-4 last:pb-0', animate && 'animate-fade-up')} style={animate ? stagger(i, 60) : undefined}>
          <span className="relative z-10 flex size-8 shrink-0 items-center justify-center bg-surface">
            {a.system ? <span className={cx('size-2', a.tone ?? 'bg-slate')} /> : <Avatar name={a.actor} size="sm" />}
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5 pt-1">
            <p className="type-body-s text-text">
              <span className="font-medium">{a.actor}</span> {a.action}
            </p>
            <span className="flex items-center gap-2 type-caption text-text-muted">
              {a.module ? (
                <>
                  <span className={cx('size-1.5', a.tone ?? 'bg-slate')} />
                  {a.module} ·
                </>
              ) : null}
              {a.time}
            </span>
          </div>
        </li>
      ))}
    </ol>
  )
}

/* ---------------- Live indicator ---------------- */

/** A pulsing square with a word. Used for live feeds and auto-refreshing data. */
export function LiveIndicator({ label = 'Live', tone = 'critical', paused }: { label?: string; tone?: 'critical' | 'success' | 'info'; paused?: boolean }) {
  const bg = tone === 'success' ? 'bg-success' : tone === 'info' ? 'bg-info' : 'bg-critical'
  return (
    <span className="inline-flex items-center gap-2">
      <span aria-hidden="true" className={cx('size-2', paused ? 'bg-border-strong' : cx(bg, 'animate-live'))} />
      <span className="type-label text-text">{paused ? 'Paused' : label}</span>
    </span>
  )
}
