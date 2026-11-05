import type { ReactNode } from 'react'
import { cx, Display, Label, RunningHead, Reveal, Text } from '@/ds'
import { sectionNumber } from './toc'

/** A documentation section: running head, headline with accent, lead, then content. */
export function Section({
  id,
  group,
  title,
  headline,
  accent,
  intro,
  children,
}: {
  id: string
  number?: string
  group: string
  title: string
  headline: string
  accent: string
  intro: ReactNode
  children: ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-20 border-b border-border px-6 py-14 md:px-12 lg:scroll-mt-6">
      <RunningHead left={`${sectionNumber(id)} · ${group}`} right={title} />
      <Reveal className="mt-8 mb-10 flex flex-col gap-4">
        <Display size="l" accent={accent}>
          {headline}
        </Display>
        <Text size="lead" muted className="max-w-prose">
          {intro}
        </Text>
      </Reveal>
      <div className="flex flex-col gap-10">{children}</div>
    </section>
  )
}

/** Specimen: a blueprint-style box with a 20px header strip, name left and code right. */
export function Specimen({
  name,
  code,
  children,
  className,
  bodyClass,
  dark,
}: {
  name: string
  code?: string
  children: ReactNode
  className?: string
  bodyClass?: string
  dark?: boolean
}) {
  return (
    <div className={cx('flex flex-col border border-border', className)}>
      <div className="flex h-7 items-center justify-between border-b border-border bg-surface-raised px-4">
        <Label>{name}</Label>
        {code ? <Label className="text-text-muted">{code}</Label> : null}
      </div>
      <div className={cx(dark ? 'theme-ink grain bg-grad-ink-slate' : 'bg-surface', 'flex-1 p-6', bodyClass)}>{children}</div>
    </div>
  )
}

/** Rules list with 6px square bullets. */
export function Rules({ items, title = 'Rules' }: { items: ReactNode[]; title?: string }) {
  return (
    <div className="flex flex-col gap-3">
      <Label>{title}</Label>
      <ul className="flex max-w-prose flex-col gap-2">
        {items.map((it, i) => (
          <li key={i} className="flex gap-3 type-body-s text-text">
            <span aria-hidden="true" className="mt-[7px] size-1.5 shrink-0 bg-slate" />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function SubHead({ children, accent }: { children: ReactNode; accent?: string }) {
  return (
    <Display size="m" as="h3" accent={accent}>
      {children}
    </Display>
  )
}
