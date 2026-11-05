import { createContext, useContext, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react'
import { cx } from './cx'

export type ProjectId =
  | 'videoGrievance'
  | 'propertyTax'
  | 'expenditure'
  | 'airQuality'
  | 'floods'
  | 'bridges'
  | 'waste'
  | 'energy'
  | 'water'

export type ProjectTheme = {
  id: ProjectId
  name: string
  tabLabel: string
  location?: string
  ground: string
  groundLabel: string
  groundStops: string
  groundCss: string
  groundClass: string
  groundStartHex: string
  groundEndHex: string
  primary: string
  primaryToken: string
  primaryLabel: string
  primaryHover: string
  primaryActive: string
  onDarkPrimary: string
  accent: string
  focus: string
}

/**
 * Relative luminance per WCAG 2.1 specification.
 */
export function getRelativeLuminance(hex: string): number {
  const clean = hex.replace('#', '').trim()
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean
  const r = parseInt(full.slice(0, 2), 16) / 255
  const g = parseInt(full.slice(2, 4), 16) / 255
  const b = parseInt(full.slice(4, 6), 16) / 255
  const toLinear = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
}

/**
 * WCAG 2.1 contrast ratio between two hex colours.
 */
export function getContrastRatio(hex1: string, hex2: string): number {
  const l1 = getRelativeLuminance(hex1)
  const l2 = getRelativeLuminance(hex2)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Automatically selects the accessible brand foreground (#F5F3EC paper or #111111 ink)
 * that yields higher contrast against the given background hex colour.
 */
export function getAccessibleForeground(bgHex: string): '#F5F3EC' | '#111111' {
  const paperContrast = getContrastRatio(bgHex, '#F5F3EC')
  const inkContrast = getContrastRatio(bgHex, '#111111')
  return paperContrast >= inkContrast ? '#F5F3EC' : '#111111'
}

/**
 * Central project theme configuration based on the Airawat Design and Brand Guide (Version 2).
 */
export const projectThemes: Record<ProjectId, ProjectTheme> = {
  videoGrievance: {
    id: 'videoGrievance',
    name: 'Video & Grievance',
    tabLabel: 'Video & Grievance (Kanpur)',
    location: 'Kanpur',
    ground: 'paper-to-slate',
    groundLabel: 'Paper → Slate',
    groundStops: '#F5F3EC → #52769A',
    groundCss: 'linear-gradient(145deg, #F5F3EC, #52769A)',
    groundClass: 'bg-grad-paper-slate',
    groundStartHex: '#F5F3EC',
    groundEndHex: '#52769A',
    primary: '#2F4E6D',
    primaryToken: 'slate-deep',
    primaryLabel: 'Slate Deep',
    primaryHover: '#111111',
    primaryActive: '#111111',
    onDarkPrimary: '#9BB3CC',
    accent: '#2F4E6D',
    focus: '#2F4E6D',
  },
  propertyTax: {
    id: 'propertyTax',
    name: 'Property Tax',
    tabLabel: 'Property Tax (Punjab)',
    location: 'Punjab',
    ground: 'warm-paper',
    groundLabel: 'Warm Paper',
    groundStops: '#F8F6EF → #EAE3D7',
    groundCss: 'linear-gradient(145deg, #F8F6EF, #EAE3D7)',
    groundClass: 'bg-grad-paper',
    groundStartHex: '#F8F6EF',
    groundEndHex: '#EAE3D7',
    primary: '#111111',
    primaryToken: 'ink',
    primaryLabel: 'Ink',
    primaryHover: '#2F4E6D',
    primaryActive: '#2F4E6D',
    onDarkPrimary: '#F5F3EC',
    accent: '#111111',
    focus: '#2F4E6D',
  },
  expenditure: {
    id: 'expenditure',
    name: 'Expenditure',
    tabLabel: 'Expenditure (Odisha)',
    location: 'Odisha',
    ground: 'paper-to-rose',
    groundLabel: 'Paper → Rose',
    groundStops: '#F5F3EC → #9A5B6A',
    groundCss: 'linear-gradient(145deg, #F5F3EC, #9A5B6A)',
    groundClass: 'bg-grad-paper-rose',
    groundStartHex: '#F5F3EC',
    groundEndHex: '#9A5B6A',
    primary: '#7E4554',
    primaryToken: 'rose-deep',
    primaryLabel: 'Rose Deep',
    primaryHover: '#111111',
    primaryActive: '#111111',
    onDarkPrimary: '#C99AA2',
    accent: '#7E4554',
    focus: '#7E4554',
  },
  airQuality: {
    id: 'airQuality',
    name: 'Air Quality',
    tabLabel: 'Air Quality (AQ-iDSS)',
    location: 'AQ-iDSS',
    ground: 'slate-to-rose',
    groundLabel: 'Slate → Rose',
    groundStops: '#52769A → #9A5B6A',
    groundCss: 'linear-gradient(145deg, #52769A, #9A5B6A)',
    groundClass: 'bg-grad-slate-rose',
    groundStartHex: '#52769A',
    groundEndHex: '#9A5B6A',
    primary: '#9A5B6A',
    primaryToken: 'rose',
    primaryLabel: 'Rose',
    primaryHover: '#7E4554',
    primaryActive: '#111111',
    onDarkPrimary: '#C99AA2',
    accent: '#7E4554',
    focus: '#7E4554',
  },
  floods: {
    id: 'floods',
    name: 'Floods',
    tabLabel: 'Floods',
    ground: 'paper-to-slate',
    groundLabel: 'Paper → Deeper Slate',
    groundStops: '#F5F3EC → #2F4E6D',
    groundCss: 'linear-gradient(145deg, #F5F3EC, #2F4E6D)',
    groundClass: 'bg-grad-paper-slate-deep',
    groundStartHex: '#F5F3EC',
    groundEndHex: '#2F4E6D',
    primary: '#2F4E6D',
    primaryToken: 'slate-deep',
    primaryLabel: 'Slate Deep',
    primaryHover: '#111111',
    primaryActive: '#111111',
    onDarkPrimary: '#9BB3CC',
    accent: '#2F4E6D',
    focus: '#2F4E6D',
  },
  bridges: {
    id: 'bridges',
    name: 'Bridges & Infrastructure',
    tabLabel: 'Bridges & Infrastructure',
    ground: 'paper-to-sage',
    groundLabel: 'Paper → Sage',
    groundStops: '#F5F3EC → #96A394',
    groundCss: 'linear-gradient(145deg, #F5F3EC, #96A394)',
    groundClass: 'bg-grad-paper-sage',
    groundStartHex: '#F5F3EC',
    groundEndHex: '#96A394',
    primary: '#6F7E70',
    primaryToken: 'sage-deep',
    primaryLabel: 'Sage Deep',
    primaryHover: '#4F5D50',
    primaryActive: '#111111',
    onDarkPrimary: '#96A394',
    accent: '#4F5D50',
    focus: '#4F5D50',
  },
  waste: {
    id: 'waste',
    name: 'Waste',
    tabLabel: 'Waste',
    ground: 'sage-gradient',
    groundLabel: 'Sage Gradient',
    groundStops: '#6F7E70 → #B8C3B9',
    groundCss: 'linear-gradient(145deg, #6F7E70, #B8C3B9)',
    groundClass: 'bg-grad-sage',
    groundStartHex: '#6F7E70',
    groundEndHex: '#B8C3B9',
    primary: '#111111',
    primaryToken: 'ink',
    primaryLabel: 'Ink',
    primaryHover: '#4F5D50',
    primaryActive: '#4F5D50',
    onDarkPrimary: '#F5F3EC',
    accent: '#111111',
    focus: '#4F5D50',
  },
  energy: {
    id: 'energy',
    name: 'Energy',
    tabLabel: 'Energy',
    ground: 'oxide-rose',
    groundLabel: 'Oxide Rose Gradient',
    groundStops: '#7E4554 → #C48A96',
    groundCss: 'linear-gradient(145deg, #7E4554, #C48A96)',
    groundClass: 'bg-grad-rose',
    groundStartHex: '#7E4554',
    groundEndHex: '#C48A96',
    primary: '#7E4554',
    primaryToken: 'rose-deep',
    primaryLabel: 'Rose Deep',
    primaryHover: '#111111',
    primaryActive: '#111111',
    onDarkPrimary: '#C99AA2',
    accent: '#7E4554',
    focus: '#7E4554',
  },
  water: {
    id: 'water',
    name: 'Water',
    tabLabel: 'Water (Delhi Jal Board)',
    location: 'Delhi Jal Board',
    ground: 'slate-gradient',
    groundLabel: 'Slate Gradient',
    groundStops: '#2F4E6D → #7E9BB8',
    groundCss: 'linear-gradient(145deg, #2F4E6D, #7E9BB8)',
    groundClass: 'bg-grad-slate',
    groundStartHex: '#2F4E6D',
    groundEndHex: '#7E9BB8',
    primary: '#2F4E6D',
    primaryToken: 'slate-deep',
    primaryLabel: 'Slate Deep',
    primaryHover: '#111111',
    primaryActive: '#111111',
    onDarkPrimary: '#9BB3CC',
    accent: '#2F4E6D',
    focus: '#2F4E6D',
  },
}

export const projectOrder: ProjectId[] = [
  'videoGrievance',
  'propertyTax',
  'expenditure',
  'airQuality',
  'floods',
  'bridges',
  'waste',
  'energy',
  'water',
]

export const projectThemeList: ProjectTheme[] = projectOrder.map((id) => projectThemes[id])

/**
 * Computes the CSS variable map for a given project theme.
 */
export function getProjectCssVariables(projectId: ProjectId): Record<string, string> {
  const t = projectThemes[projectId]
  const primaryFg = getAccessibleForeground(t.primary)
  const hoverFg = getAccessibleForeground(t.primaryHover)
  const activeFg = getAccessibleForeground(t.primaryActive)
  const onDarkFg = getAccessibleForeground(t.onDarkPrimary)
  const groundFg = getAccessibleForeground(t.groundStartHex)

  return {
    '--project-primary': t.primary,
    '--project-primary-fg': primaryFg,
    '--project-primary-hover': t.primaryHover,
    '--project-primary-hover-fg': hoverFg,
    '--project-primary-active': t.primaryActive,
    '--project-primary-active-fg': activeFg,
    '--project-ground': t.groundCss,
    '--project-ground-fg': groundFg,
    '--project-accent': t.accent,
    '--project-focus': t.focus,
    '--project-on-dark-primary': t.onDarkPrimary,
    '--project-on-dark-primary-fg': onDarkFg,
    '--project-on-dark-hover': '#F5F3EC',
    '--project-on-dark-hover-fg': '#111111',
  }
}

type ProjectThemeContextValue = {
  projectId: ProjectId
  theme: ProjectTheme
  setProjectId: (id: ProjectId) => void
}

const ProjectThemeContext = createContext<ProjectThemeContextValue>({
  projectId: 'videoGrievance',
  theme: projectThemes.videoGrievance,
  setProjectId: () => {},
})

export function useProjectTheme() {
  return useContext(ProjectThemeContext)
}

export function ProjectThemeProvider({
  defaultProject = 'videoGrievance',
  children,
}: {
  defaultProject?: ProjectId
  children: ReactNode
}) {
  const [projectId, setProjectId] = useState<ProjectId>(defaultProject)
  const theme = projectThemes[projectId]
  const vars = getProjectCssVariables(projectId)

  useEffect(() => {
    const root = document.documentElement
    root.dataset.project = projectId
    for (const [key, val] of Object.entries(vars)) {
      root.style.setProperty(key, val)
    }
  }, [projectId, vars])

  return (
    <ProjectThemeContext.Provider value={{ projectId, theme, setProjectId }}>
      <div style={vars as CSSProperties} data-project={projectId} className="contents">
        {children}
      </div>
    </ProjectThemeContext.Provider>
  )
}

/**
 * Responsive, horizontally scrollable 9-project selector bar.
 * Placed at the top of the component library to dynamically switch project themes.
 */
export function ProjectThemeBar({ className }: { className?: string }) {
  const { projectId, theme, setProjectId } = useProjectTheme()
  const tabListRef = useRef<HTMLDivElement>(null)
  const primaryFg = getAccessibleForeground(theme.primary)

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const idx = projectOrder.indexOf(projectId)
    let nextIdx = -1
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      nextIdx = (idx + 1) % projectOrder.length
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      nextIdx = (idx - 1 + projectOrder.length) % projectOrder.length
    } else if (e.key === 'Home') {
      nextIdx = 0
    } else if (e.key === 'End') {
      nextIdx = projectOrder.length - 1
    }
    if (nextIdx >= 0) {
      e.preventDefault()
      const nextId = projectOrder[nextIdx]
      setProjectId(nextId)
      requestAnimationFrame(() => {
        const btn = tabListRef.current?.querySelector<HTMLButtonElement>(`[data-project-tab="${nextId}"]`)
        btn?.focus()
        btn?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
      })
    }
  }

  return (
    <div className={cx('sticky top-0 z-30 border-b border-rule bg-surface', className)}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-surface-raised px-4 py-2 md:px-6">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="size-2 shrink-0"
            style={{ backgroundColor: theme.primary }}
          />
          <span className="type-label text-text-label">Project theme</span>
          <span className="type-caption text-text-muted">· 9 Airawat solutions · Shared component library</span>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-2 type-caption text-text-muted">
            <span>Ground:</span>
            <span
              aria-hidden="true"
              className="inline-block h-3.5 w-6 border border-border"
              style={{ backgroundImage: theme.groundCss }}
            />
            <span className="font-mono text-[11px] text-text">{theme.groundLabel}</span>
          </span>
          <span className="flex items-center gap-2 type-caption text-text-muted">
            <span>Primary CTA:</span>
            <span
              aria-hidden="true"
              className="inline-block size-3.5 border border-border"
              style={{ backgroundColor: theme.primary }}
            />
            <span className="font-mono text-[11px] text-text">
              {theme.primaryLabel} ({theme.primary})
            </span>
          </span>
        </div>
      </div>

      <div
        ref={tabListRef}
        role="tablist"
        aria-label="Airawat project themes"
        onKeyDown={onKeyDown}
        className="flex overflow-x-auto border-b border-border bg-surface px-4 md:px-6"
      >
        {projectThemeList.map((p, i) => {
          const active = p.id === projectId
          const tabFg = getAccessibleForeground(p.primary)
          return (
            <button
              key={p.id}
              type="button"
              role="tab"
              data-project-tab={p.id}
              aria-selected={active}
              tabIndex={active ? 0 : -1}
              onClick={() => setProjectId(p.id)}
              style={
                active
                  ? {
                      backgroundColor: p.primary,
                      color: tabFg,
                    }
                  : undefined
              }
              className={cx(
                'relative inline-flex h-10 shrink-0 cursor-pointer items-center gap-2.5 whitespace-nowrap px-3.5 type-body-s font-medium transition-colors',
                i > 0 && 'border-l border-border',
                active ? 'font-medium' : 'text-text hover:bg-hover',
              )}
            >
              <span
                aria-hidden="true"
                className="size-1.5 shrink-0"
                style={{
                  backgroundColor: active ? primaryFg : p.primary,
                }}
              />
              <span>{p.tabLabel}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

