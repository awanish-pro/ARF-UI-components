import { useState } from 'react'
import { cx } from './cx'

/* ------------------------------------------------------------------
   Maps. Source: Airawat Design and Brand Guide, Version 2 (Page 14).
   - India and state maps: white or paper outlines, state borders
     lighter, deployment sites as rings with a dot in rose-light on
     dark or rose on paper.
   - City maps: ward polygons in a muted fill, highways in slate,
     rail dashed in rose, a north arrow and a scale bar.
   ------------------------------------------------------------------ */

export type DeploymentSite = {
  id: string
  name: string
  state: string
  project: string
  stage?: 'Live' | 'Pilot' | 'Prototype'
  /** Coordinates in the 400 x 440 schematic India viewBox */
  x: number
  y: number
  metric?: string
}

export type CityWardPolygon = {
  id: string
  label: string
  name: string
  /** SVG polygon or path d string in the 520 x 340 city viewBox */
  path: string
  /** Label anchor point */
  cx: number
  cy: number
  metric?: string
}

export type MapPathLayer = {
  id: string
  label?: string
  d: string
}

/** Crisp geometric North arrow drawn in mono and 1px stroke. */
function NorthArrow({ x, y, stroke, text }: { x: number; y: number; stroke: string; text: string }) {
  return (
    <g transform={`translate(${x}, ${y})`} aria-hidden="true">
      <line x1={0} y1={24} x2={0} y2={4} stroke={stroke} strokeWidth={1.25} />
      <polygon points="0,0 -4,8 4,8" fill={stroke} />
      <line x1={-4} y1={16} x2={4} y2={16} stroke={stroke} strokeWidth={1} />
      <text
        x={0}
        y={35}
        textAnchor="middle"
        fill={text}
        fontSize={10}
        fontFamily="var(--font-mono)"
        fontWeight={500}
        letterSpacing="0.08em"
      >
        N
      </text>
    </g>
  )
}

/** Crisp flat scale bar with end ticks and mono unit label. */
function ScaleBar({
  x,
  y,
  width = 72,
  label,
  stroke,
  text,
}: {
  x: number
  y: number
  width?: number
  label: string
  stroke: string
  text: string
}) {
  return (
    <g transform={`translate(${x}, ${y})`} aria-hidden="true">
      <line x1={0} y1={8} x2={width} y2={8} stroke={stroke} strokeWidth={1.25} />
      <line x1={0} y1={3} x2={0} y2={8} stroke={stroke} strokeWidth={1.25} />
      <line x1={width / 2} y1={5} x2={width / 2} y2={8} stroke={stroke} strokeWidth={1} />
      <line x1={width} y1={3} x2={width} y2={8} stroke={stroke} strokeWidth={1.25} />
      <text x={0} y={0} fill={text} fontSize={9.5} fontFamily="var(--font-mono)">
        0
      </text>
      <text x={width} y={0} textAnchor="end" fill={text} fontSize={9.5} fontFamily="var(--font-mono)">
        {label}
      </text>
    </g>
  )
}

/** Default Airawat national deployment sites for the schematic India map. */
export const defaultIndiaSites: DeploymentSite[] = [
  { id: 'mohali', name: 'Mohali', state: 'Punjab', project: 'Property Tax', stage: 'Prototype', x: 140, y: 102, metric: '42 of 50 sampled properties matched' },
  { id: 'delhi', name: 'Delhi', state: 'NCT Delhi', project: 'Water & Air Quality', stage: 'Pilot', x: 154, y: 138, metric: '54 AQ sensors · Delhi Jal Board' },
  { id: 'kanpur', name: 'Kanpur', state: 'Uttar Pradesh', project: 'PGR & VMS', stage: 'Live', x: 196, y: 164, metric: '1,240 cameras · 82% SLA closure' },
  { id: 'lucknow', name: 'Lucknow', state: 'Uttar Pradesh', project: 'Air Quality (AQ-iDSS)', stage: 'Pilot', x: 212, y: 156, metric: '28 AQ sensors active' },
  { id: 'gandhinagar', name: 'Gandhinagar', state: 'Gujarat', project: 'Urban Floods', stage: 'Pilot', x: 96, y: 212, metric: 'Physics-guided flood ML' },
  { id: 'bhubaneswar', name: 'Bhubaneswar', state: 'Odisha', project: 'Expenditure', stage: 'Live', x: 256, y: 244, metric: 'Over ₹10,000 Cr across 36 schemes' },
]

/** Schematic outline of India (400 x 440 viewBox) + lighter internal state borders. */
const INDIA_OUTLINE =
  'M138 22 L166 26 L186 48 L178 66 L196 86 L184 102 L198 118 L228 134 L268 148 L294 146 L318 130 L348 132 L364 152 L352 174 L334 176 L326 196 L312 192 L302 172 L288 168 L286 196 L272 214 L264 238 L242 264 L218 286 L204 316 L196 352 L176 388 L158 416 L144 396 L132 362 L120 320 L108 278 L104 244 L82 238 L66 218 L78 202 L68 188 L88 172 L96 146 L112 126 L118 100 L106 82 L120 56 L124 34 Z'

const STATE_BORDERS = [
  'M118 100 L152 104 L184 102', // J&K / Himachal / Punjab
  'M112 126 L154 134 L168 114', // Punjab / Haryana / Uttarakhand
  'M96 146 L148 156 L154 134', // Rajasthan north
  'M148 156 L184 176 L236 184 L256 150', // UP / Bihar
  'M88 172 L138 192 L152 224 L104 244', // Rajasthan / Gujarat / MP
  'M138 192 L206 206 L246 214 L264 238', // MP / Chhattisgarh / Odisha
  'M236 184 L274 188 L286 196', // Jharkhand / West Bengal
  'M108 278 L168 274 L218 286', // Maharashtra / Telangana
  'M120 320 L166 314 L204 316', // Karnataka / Andhra Pradesh
  'M144 396 L166 346 L196 352', // Kerala / Tamil Nadu
  'M294 146 L306 168 L334 176', // North-East divider
]

/**
 * IndiaStateMap: India and state deployment map.
 * White or paper outlines, lighter state borders, and deployment sites
 * rendered as rings with a dot in rose-light (dark ground) or rose (paper).
 */
export function IndiaStateMap({
  sites = defaultIndiaSites,
  surface = 'dark',
  selected,
  onSelect,
  code = 'MAP-IND · SCHEMATIC · 2026',
  className,
}: {
  sites?: DeploymentSite[]
  surface?: 'dark' | 'paper'
  selected?: string | null
  onSelect?: (id: string) => void
  code?: string
  className?: string
}) {
  const [hoverId, setHoverId] = useState<string | null>(null)
  const activeSite = sites.find((s) => s.id === (hoverId ?? selected)) ?? sites[0]
  const isDark = surface === 'dark'

  const outlineStroke = isDark ? 'var(--color-paper)' : 'var(--color-ink)'
  const stateStroke = isDark ? 'var(--color-grid-major)' : 'var(--color-border-strong)'
  const landFill = isDark ? 'rgb(245 243 236 / 0.04)' : 'var(--color-surface-raised)'
  const siteColour = isDark ? 'var(--color-rose-light)' : 'var(--color-rose)'
  const labelColour = isDark ? 'var(--color-paper)' : 'var(--color-text)'
  const mutedColour = isDark ? 'var(--color-slate-light)' : 'var(--color-text-muted)'

  return (
    <div className={cx('flex flex-col gap-3', className)}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2">
        <span className="flex items-center gap-2 type-body-s text-text">
          <span
            aria-hidden="true"
            className="inline-flex size-3 items-center justify-center rounded-round border"
            style={{ borderColor: isDark ? 'var(--color-rose)' : 'var(--color-rose)' }}
          >
            <span className="size-1 rounded-round bg-rose" />
          </span>
          {activeSite ? (
            <>
              <span className="font-medium">{activeSite.name}</span>
              <span className="text-text-muted">· {activeSite.state}</span>
              <span className="font-mono text-[11px] uppercase text-text-label">{activeSite.project}</span>
              {activeSite.metric ? <span className="text-text-muted">({activeSite.metric})</span> : null}
            </>
          ) : (
            'Select a deployment site'
          )}
        </span>
        <span className="type-caption text-text-muted">{sites.length} deployment sites</span>
      </div>

      <div
        className={cx(
          'relative border border-border',
          isDark ? 'theme-ink bg-blueprint-grid' : 'bg-surface',
        )}
      >
        {isDark ? (
          <>
            {['top-2 left-2', 'top-2 right-2', 'bottom-2 left-2', 'bottom-2 right-2'].map((pos) => (
              <span key={pos} aria-hidden="true" className={cx('pointer-events-none absolute type-caption text-slate-light', pos)}>
                +
              </span>
            ))}
          </>
        ) : null}

        <svg
          viewBox="0 0 400 440"
          role="img"
          aria-label={`India deployment map showing ${sites.length} sites`}
          className="mx-auto block h-auto w-full max-w-[420px] select-none"
        >
          {/* National outline */}
          <path d={INDIA_OUTLINE} fill={landFill} stroke={outlineStroke} strokeWidth={1.35} vectorEffect="non-scaling-stroke" />

          {/* Lighter internal state borders */}
          <g fill="none" stroke={stateStroke} strokeWidth={0.85} vectorEffect="non-scaling-stroke">
            {STATE_BORDERS.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </g>

          {/* Deployment sites: ring + centre dot in rose-light (dark) or rose (paper) */}
          {sites.map((site) => {
            const isSelected = site.id === selected
            const isHovered = site.id === hoverId
            const active = isSelected || isHovered
            return (
              <g
                key={site.id}
                transform={`translate(${site.x}, ${site.y})`}
                role="button"
                tabIndex={0}
                aria-label={`${site.name}, ${site.state}: ${site.project}`}
                aria-pressed={isSelected}
                onMouseEnter={() => setHoverId(site.id)}
                onMouseLeave={() => setHoverId(null)}
                onFocus={() => setHoverId(site.id)}
                onBlur={() => setHoverId(null)}
                onClick={() => onSelect?.(site.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onSelect?.(site.id)
                  }
                }}
                className="cursor-pointer outline-none"
              >
                {active ? <circle r={11} fill="none" stroke={siteColour} strokeWidth={1} strokeDasharray="2 2" /> : null}
                <circle r={active ? 7.5 : 6} fill="none" stroke={siteColour} strokeWidth={1.5} />
                <circle r={2.5} fill={siteColour} />
                <text
                  x={11}
                  y={3.5}
                  fill={labelColour}
                  fontSize={10}
                  fontFamily="var(--font-mono)"
                  fontWeight={active ? 600 : 500}
                  letterSpacing="0.04em"
                >
                  {site.name.toUpperCase()}
                </text>
              </g>
            )
          })}

          <NorthArrow x={364} y={32} stroke={outlineStroke} text={mutedColour} />
          <ScaleBar x={294} y={404} width={76} label="500 km" stroke={outlineStroke} text={mutedColour} />
          <text x={18} y={422} fill={mutedColour} fontSize={9.5} fontFamily="var(--font-mono)" letterSpacing="0.05em">
            {code}
          </text>
        </svg>
      </div>
    </div>
  )
}

/** Default schematic Kanpur ward polygons, highways, and rail corridor. */
export const defaultCityWards: CityWardPolygon[] = [
  { id: 'w04', label: '04', name: 'Swaroop Nagar', path: 'M40 48 L168 38 L184 128 L66 138 Z', cx: 112, cy: 92, metric: '34 open grievances' },
  { id: 'w08', label: '08', name: 'Civil Lines', path: 'M168 38 L312 46 L296 134 L184 128 Z', cx: 240, cy: 88, metric: '19 open grievances' },
  { id: 'w12', label: '12', name: 'Mall Road', path: 'M184 128 L296 134 L318 214 L196 220 Z', cx: 248, cy: 174, metric: '62 open grievances' },
  { id: 'w15', label: '15', name: 'Kakadeo', path: 'M66 138 L184 128 L196 220 L74 228 Z', cx: 132, cy: 178, metric: '41 open grievances' },
  { id: 'w19', label: '19', name: 'Govind Nagar', path: 'M74 228 L196 220 L214 302 L92 308 Z', cx: 144, cy: 266, metric: '53 open grievances' },
  { id: 'w22', label: '22', name: 'Kidwai Nagar', path: 'M196 220 L318 214 L344 294 L214 302 Z', cx: 268, cy: 260, metric: '28 open grievances' },
  { id: 'w27', label: '27', name: 'Jajmau', path: 'M312 46 L464 72 L456 184 L318 214 L296 134 Z', cx: 382, cy: 132, metric: '47 open grievances' },
  { id: 'w31', label: '31', name: 'Chakeri', path: 'M318 214 L456 184 L476 286 L344 294 Z', cx: 398, cy: 248, metric: '22 open grievances' },
]

export const defaultCityHighways: MapPathLayer[] = [
  { id: 'nh19', label: 'NH-19', d: 'M16 146 L184 134 L318 148 L504 166' },
  { id: 'nh34', label: 'NH-34', d: 'M228 16 L244 174 L270 326' },
]

export const defaultCityRail: MapPathLayer[] = [
  { id: 'rail-main', label: 'Central Rail', d: 'M18 212 L196 196 L332 184 L504 224' },
]

/**
 * CityMap: Ward-level municipal map.
 * Ward polygons in muted fill, highways in slate, rail dashed in rose,
 * with a crisp North arrow and scale bar.
 */
export function CityMap({
  wards = defaultCityWards,
  highways = defaultCityHighways,
  railLines = defaultCityRail,
  selected,
  onSelect,
  scaleLabel = '2 km',
  code = 'MAP-CITY · KANPUR · 2026',
  className,
}: {
  wards?: CityWardPolygon[]
  highways?: MapPathLayer[]
  railLines?: MapPathLayer[]
  selected?: string | null
  onSelect?: (id: string) => void
  scaleLabel?: string
  code?: string
  className?: string
}) {
  const [hoverId, setHoverId] = useState<string | null>(null)
  const activeWard = wards.find((w) => w.id === (hoverId ?? selected))

  return (
    <div className={cx('flex flex-col gap-3', className)}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2">
        <span className="type-body-s text-text">
          {activeWard ? (
            <>
              <span className="font-mono text-[12px] text-text-label">WARD {activeWard.label}</span> ·{' '}
              <span className="font-medium">{activeWard.name}</span>
              {activeWard.metric ? <span className="text-text-muted">: {activeWard.metric}</span> : null}
            </>
          ) : (
            <span className="text-text-muted">Select or hover a ward polygon to inspect</span>
          )}
        </span>
        <span className="flex items-center gap-4 type-caption text-text-muted">
          <span className="flex items-center gap-1.5">
            <span aria-hidden="true" className="inline-block h-0.5 w-4 bg-slate" />
            Highway
          </span>
          <span className="flex items-center gap-1.5">
            <span aria-hidden="true" className="inline-block w-4 border-t-2 border-dashed border-rose" />
            Rail
          </span>
        </span>
      </div>

      <div className="border border-border bg-surface">
        <svg
          viewBox="0 0 520 340"
          role="img"
          aria-label={`City ward map with ${wards.length} wards, highways and rail lines`}
          className="block h-auto w-full select-none"
        >
          {/* Ward polygons in muted fill */}
          {wards.map((w) => {
            const isSelected = w.id === selected
            const isHovered = w.id === hoverId
            const fill = isSelected
              ? 'var(--color-slate-wash)'
              : isHovered
                ? 'var(--color-slate-tint)'
                : 'var(--color-surface-raised)'
            const stroke = isSelected ? 'var(--color-slate-deep)' : 'var(--color-border-strong)'
            return (
              <g
                key={w.id}
                role="button"
                tabIndex={0}
                aria-label={`Ward ${w.label} ${w.name}${w.metric ? `, ${w.metric}` : ''}`}
                aria-pressed={isSelected}
                onMouseEnter={() => setHoverId(w.id)}
                onMouseLeave={() => setHoverId(null)}
                onFocus={() => setHoverId(w.id)}
                onBlur={() => setHoverId(null)}
                onClick={() => onSelect?.(w.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onSelect?.(w.id)
                  }
                }}
                className="cursor-pointer outline-none"
              >
                <path
                  d={w.path}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={isSelected ? 1.5 : 1}
                  vectorEffect="non-scaling-stroke"
                />
                <text
                  x={w.cx}
                  y={w.cy}
                  textAnchor="middle"
                  fill={isSelected ? 'var(--color-slate-deep)' : 'var(--color-text-muted)'}
                  fontSize={10}
                  fontFamily="var(--font-mono)"
                  fontWeight={isSelected ? 600 : 500}
                >
                  W{w.label}
                </text>
              </g>
            )
          })}

          {/* Highways in slate */}
          <g fill="none" stroke="var(--color-slate)" strokeWidth={2.25} strokeLinecap="butt" pointerEvents="none">
            {highways.map((h) => (
              <path key={h.id} d={h.d} />
            ))}
          </g>

          {/* Rail dashed in rose */}
          <g
            fill="none"
            stroke="var(--color-rose)"
            strokeWidth={1.75}
            strokeDasharray="6 4"
            strokeLinecap="butt"
            pointerEvents="none"
          >
            {railLines.map((r) => (
              <path key={r.id} d={r.d} />
            ))}
          </g>

          {/* North arrow and scale bar */}
          <NorthArrow x={486} y={24} stroke="var(--color-ink)" text="var(--color-text-label)" />
          <ScaleBar x={412} y={314} width={84} label={scaleLabel} stroke="var(--color-ink)" text="var(--color-text-muted)" />

          {/* Diagram code bottom-left */}
          <text x={16} y={324} fill="var(--color-text-muted)" fontSize={9.5} fontFamily="var(--font-mono)" letterSpacing="0.05em">
            {code}
          </text>
        </svg>
      </div>
    </div>
  )
}
