import { Fragment } from 'react'
import { cx } from './cx'

export type Crumb = { label: string; onClick?: () => void }

/** Mono breadcrumbs with slash separators. The last crumb is the current page. */
export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((c, i) => {
          const last = i === items.length - 1
          return (
            <Fragment key={`${c.label}-${i}`}>
              <li>
                {last ? (
                  <span aria-current="page" className="type-label text-text">
                    {c.label}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={c.onClick}
                    className={cx('cursor-pointer type-label text-text-muted underline-offset-4 hover:text-text-label hover:underline')}
                  >
                    {c.label}
                  </button>
                )}
              </li>
              {!last ? (
                <li aria-hidden="true" className="type-label text-border-strong">
                  /
                </li>
              ) : null}
            </Fragment>
          )
        })}
      </ol>
    </nav>
  )
}
