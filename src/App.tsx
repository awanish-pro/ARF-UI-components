import { useEffect, useState } from 'react'
import { Button, cx, KolamMotif, ToastProvider, VastuMotif } from '@/ds'
import { Dashboard } from './dashboard/Dashboard'
import { Application } from './showcase/Application'
import { Base } from './showcase/Base'
import { Foundation } from './showcase/Foundation'
import { toc } from './showcase/toc'
import { Visualisation } from './showcase/Visualisation'

const openDashboard = () => {
  window.location.hash = '#/dashboard'
}

function useRoute() {
  const read = () => (window.location.hash.startsWith('#/dashboard') ? 'dashboard' : 'system')
  const [route, setRoute] = useState<'dashboard' | 'system'>(read)
  useEffect(() => {
    let current = read()
    const on = () => {
      const next = read()
      // Section links (#colours, #buttons…) also change the hash. Only reset the
      // scroll when the route itself changes, so in-page anchors can scroll to their target.
      if (next === current) return
      current = next
      setRoute(next)
      window.scrollTo({ top: 0 })
    }
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return route
}

function useActiveSection() {
  const [active, setActive] = useState('colours')
  useEffect(() => {
    const ids: string[] = toc.flatMap((g) => g.items.map(([id]) => id as string))
    let frame = 0
    const update = () => {
      frame = 0
      let current = ids[0]
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= 160) current = id
      }
      setActive(current)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])
  return active
}

function Cover() {
  return (
    <header className="theme-ink grain relative overflow-hidden bg-grad-ink-slate px-6 pt-10 pb-14 md:px-12">
      <div className="flex items-end justify-between gap-4 border-b border-rule pb-2">
        <span className="type-label text-paper">Interface kit · 2026</span>
        <span className="type-label text-slate-light">PGR · VMS · Property Tax</span>
      </div>
      <div className="relative mt-16 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-6">
          <span className="type-display-xl figure-outline animate-fade-in text-[120px] leading-[0.85] tracking-[0.02em]">UI</span>
          <h1 className="type-display-xl max-w-2xl animate-fade-up text-paper" style={{ animationDelay: '120ms' }}>
            One interface for three city platforms, built for <span className="text-rose-light">the people who run them.</span>
          </h1>
          <p className="max-w-prose type-lead text-text-muted">
            Foundations, base components, application patterns and data visualisation for Public Grievance Redressal (PGR), the Video Management System (VMS) and Property Tax. Every part follows the
            Airawat Design and Brand Guide, Version 2.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" variant="primary" trailing="arrow-right" onClick={openDashboard}>
              Open the sample dashboard
            </Button>
            <Button size="lg" variant="secondary" onClick={() => document.getElementById('colours')?.scrollIntoView()}>
              Start with foundations
            </Button>
          </div>
        </div>
        <div className="hidden items-end justify-end lg:flex">
          <VastuMotif className="size-72 animate-fade-in text-layer-slate-mid [animation-duration:1.4s]" />
        </div>
      </div>
      <div className="mt-14 grid grid-cols-2 gap-6 md:grid-cols-4">
        {toc.map((g, i) => (
          <div key={g.group} className="flex animate-fade-up flex-col gap-3 border-t border-rule pt-4" style={{ animationDelay: `${300 + i * 100}ms` }}>
            <span className="type-figure-xl figure-outline">{g.items.length}</span>
            <span className="type-body-s text-text-muted">{g.group}</span>
          </div>
        ))}
      </div>
    </header>
  )
}

function GroupOpener({ number, title, accent, body }: { number: string; title: string; accent: string; body: string }) {
  return (
    <div className="theme-ink grain relative overflow-hidden bg-grad-blueprint px-6 py-14 md:px-12">
      <div className="flex items-end justify-between border-b border-rule pb-2">
        <span className="type-label">{number} · Section</span>
        <span className="type-label text-slate-light">{title}</span>
      </div>
      <div className="mt-10 flex flex-wrap items-end gap-10">
        <span className="type-figure-xl figure-outline text-[120px] leading-[0.85]">{number}</span>
        <div className="flex max-w-xl flex-col gap-3">
          <h2 className="type-display-l text-paper">
            {title}. <span className="text-rose-light">{accent}</span>
          </h2>
          <p className="type-lead text-text-muted">{body}</p>
        </div>
      </div>
      <KolamMotif className="mt-12 h-6 w-full text-grid-major" />
    </div>
  )
}

export default function App() {
  const route = useRoute()
  return <ToastProvider>{route === 'dashboard' ? <Dashboard onExit={() => (window.location.hash = '')} /> : <SystemShowcase />}</ToastProvider>
}

function SystemShowcase() {
  const active = useActiveSection()
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <>
      <div className="min-h-screen bg-surface text-text lg:grid lg:grid-cols-[264px_1fr]">
        <aside className="sticky top-0 z-20 border-b border-border bg-surface-raised lg:h-screen lg:border-r lg:border-b-0">
          <div className="flex h-14 items-center justify-between border-b border-rule px-5">
            <span className="flex items-center gap-3">
              <span className="inline-flex h-6 aspect-[3/1] items-center justify-center border border-dashed border-border-strong type-caption text-text-muted">Logo</span>
              <span className="font-logo text-[13px] font-bold tracking-[0.04em]">AIRAWAT OS</span>
            </span>
            <button
              type="button"
              className="cursor-pointer type-label text-text lg:hidden"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
            >
              {menuOpen ? 'Close' : 'Contents'}
            </button>
          </div>
          <nav aria-label="Contents" className={cx('overflow-auto px-3 py-5 lg:block lg:h-[calc(100vh-3.5rem)]', menuOpen ? 'block max-h-[70vh]' : 'hidden')}>
            {toc.map((g, gi) => (
              <div key={g.group} className="mb-6">
                <div className="flex items-center justify-between px-2 pb-2">
                  <span className="type-label text-text-label">{g.group}</span>
                  <span className="type-caption text-text-muted">0{gi + 1}</span>
                </div>
                <ul>
                  {g.items.map(([id, label]) => (
                    <li key={id}>
                      <a
                        href={`#${id}`}
                        onClick={() => setMenuOpen(false)}
                        aria-current={active === id ? 'location' : undefined}
                        className={cx(
                          'flex h-8 items-center gap-2.5 px-2 type-body-s transition-colors',
                          active === id ? 'bg-action text-on-action' : 'text-text hover:bg-hover',
                        )}
                      >
                        <span aria-hidden="true" className={cx('size-1.5', active === id ? 'bg-on-action' : 'bg-transparent')} />
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="flex flex-col gap-3 border-t border-border px-2 pt-4">
              <Button size="sm" variant="brand" trailing="arrow-right" onClick={openDashboard}>
                Sample dashboard
              </Button>
              <p className="type-caption text-text-muted">Press Ctrl K anywhere for the command menu.</p>
            </div>
          </nav>
        </aside>
        <div className="min-w-0">
          <Cover />
          <GroupOpener
            number="01"
            title="Foundation"
            accent="The rules underneath."
            body="Colour, type, iconography, effects and spacing. Every component below is assembled from these tokens and nothing else."
          />
          <Foundation />
          <GroupOpener
            number="02"
            title="Base components"
            accent="The parts every screen reuses."
            body="Square, bordered and plain. Each part is shown with its states and a real PGR, VMS or Property Tax use."
          />
          <Base />
          <GroupOpener
            number="03"
            title="Application components"
            accent="Patterns for whole screens."
            body="Navigation, feedback, data and states. How the base parts combine into working municipal tools."
          />
          <Application />
          <GroupOpener
            number="04"
            title="Data visualisation"
            accent="Evidence, drawn plainly."
            body="Line, bar, donut, funnel, heatmap, gauge, scatter, tile map, timeline and composition. Flat, square-ended, sourced, and animated once when they enter view."
          />
          <Visualisation />
          <div className="theme-ink grain bg-grad-ink-slate px-6 py-14 md:px-12">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="flex max-w-xl flex-col gap-3">
                <span className="type-label text-slate-light">Put together</span>
                <h2 className="type-display-l text-paper">
                  See every part working in <span className="text-rose-light">one dashboard.</span>
                </h2>
                <p className="type-lead text-text-muted">City overview, grievances, video and property tax, with live filters, drawers and the command menu.</p>
              </div>
              <Button size="lg" trailing="arrow-right" onClick={openDashboard}>
                Open the sample dashboard
              </Button>
            </div>
          </div>
          <footer className="flex flex-wrap items-center justify-between gap-4 px-6 py-8 md:px-12">
            <span className="type-caption text-text-muted">airawat.org · Interface kit · Version 1</span>
            <span className="type-display-m text-text">
              Better data. Better decisions. <span className="text-text-accent">Better cities.</span>
            </span>
          </footer>
        </div>
      </div>
    </>
  )
}
