import { useMemo, useRef, useState, type PointerEvent } from 'react'
import { cx } from './cx'
import { Glyph } from './Glyph'

/* ------------------------------------------------------------------
   GisMap: Interactive Kanpur Municipal GIS boundary and live-detection
   map built strictly with Airawat Design and Brand Guide V2 rules:
   - Strictly five brand colours and solid washes/tints (no neon)
   - Square corners (0px), 1px rule borders, zero drop shadows
   - Kanpur urban fabric: Ganga river, NH-19 (GT Road), VIP Road,
     Kanpur Central rail (dashed rose), 6 ward boundaries, dense parcel
     clusters, and live AI detection overlays (Captured / Read / Decided)
   ------------------------------------------------------------------ */

export type GisParcelCategory = 'gap' | 'utility' | 'tax-net' | 'modified' | 'exempt'

export type GisParcel = {
  id: string
  uid: string
  owner: string
  ward: string
  locality: string
  coords: string
  category: GisParcelCategory
  areaSqM: number
  /** SVG path in 920 x 520 Kanpur GIS viewBox */
  path: string
  cx: number
  cy: number
  detection?: {
    label: string
    confidence: number
    captured: string
    read: string
    decided: string
    box: { x: number; y: number; w: number; h: number }
  }
}

export type GisCategoryMeta = {
  id: GisParcelCategory
  label: string
  countLabel: string
  squareCls: string
  fillPaper: string
  strokePaper: string
  fillDark: string
  strokeDark: string
  dashed?: boolean
}

export const gisCategories: GisCategoryMeta[] = [
  {
    id: 'gap',
    label: 'Suspected Gap',
    countLabel: '24.6k',
    squareCls: 'bg-rose-deep',
    fillPaper: '#e1d2cf',
    strokePaper: '#7e4554',
    fillDark: '#4a2c34',
    strokeDark: '#c99aa2',
    dashed: true,
  },
  {
    id: 'utility',
    label: 'Occupied KESCO',
    countLabel: '3,140',
    squareCls: 'bg-rose',
    fillPaper: '#eae1dc',
    strokePaper: '#9a5b6a',
    fillDark: '#332427',
    strokeDark: '#c99aa2',
  },
  {
    id: 'tax-net',
    label: 'In Tax Net',
    countLabel: '41.2k',
    squareCls: 'bg-sage-dark',
    fillPaper: '#e0e1d9',
    strokePaper: '#4f5d50',
    fillDark: '#323632',
    strokeDark: '#b8c3b9',
  },
  {
    id: 'modified',
    label: 'New / Modified',
    countLabel: '1,284',
    squareCls: 'bg-slate-deep',
    fillPaper: '#d1d8da',
    strokePaper: '#2f4e6d',
    fillDark: '#212a33',
    strokeDark: '#9bb3cc',
    dashed: true,
  },
  {
    id: 'exempt',
    label: 'Exempt',
    countLabel: '1,120',
    squareCls: 'bg-border-strong',
    fillPaper: '#eae3d7',
    strokePaper: '#615a52',
    fillDark: '#1c2a38',
    strokeDark: '#7e9bb8',
  },
]

const categoryById = Object.fromEntries(gisCategories.map((c) => [c.id, c])) as Record<GisParcelCategory, GisCategoryMeta>

/** Kanpur municipal ward / zone boundary polygons (920 x 520 viewBox). */
const KANPUR_WARD_BOUNDARIES = [
  {
    id: 'z6',
    code: 'W-02',
    name: 'KALYANPUR · IIT KANPUR',
    path: 'M24 34 L256 26 L278 196 L46 218 Z',
    lx: 64,
    ly: 62,
  },
  {
    id: 'z2',
    code: 'W-04',
    name: 'SWAROOP NAGAR',
    path: 'M256 26 L496 68 L478 232 L278 196 Z',
    lx: 300,
    ly: 88,
  },
  {
    id: 'z1',
    code: 'W-08',
    name: 'CIVIL LINES · VIP RD',
    path: 'M496 68 L704 114 L676 254 L478 232 Z',
    lx: 526,
    ly: 122,
  },
  {
    id: 'z4',
    code: 'W-12',
    name: 'MALL ROAD · CENTRAL',
    path: 'M478 232 L676 254 L660 398 L458 378 Z',
    lx: 500,
    ly: 266,
  },
  {
    id: 'z5',
    code: 'W-15',
    name: 'KAKADEO · GOVIND NAGAR',
    path: 'M46 218 L278 196 L478 232 L458 378 L254 468 L74 440 Z',
    lx: 98,
    ly: 256,
  },
  {
    id: 'z3',
    code: 'W-27',
    name: 'JAJMAU · KIDWAI NAGAR',
    path: 'M676 254 L886 244 L896 472 L660 398 Z',
    lx: 704,
    ly: 286,
  },
]

/** Subtle background urban building blocks to give realistic city density. */
const URBAN_BLOCKS: { x: number; y: number; w: number; h: number; rot?: number }[] = [
  // Kalyanpur / IIT Kanpur blocks
  { x: 64, y: 84, w: 42, h: 24 }, { x: 114, y: 84, w: 34, h: 24 }, { x: 156, y: 82, w: 48, h: 26 },
  { x: 68, y: 118, w: 38, h: 28 }, { x: 114, y: 118, w: 44, h: 28 }, { x: 166, y: 118, w: 36, h: 28 },
  { x: 210, y: 82, w: 32, h: 52 }, { x: 74, y: 156, w: 54, h: 32 }, { x: 136, y: 156, w: 46, h: 32 },
  // Swaroop Nagar & Civil Lines blocks
  { x: 298, y: 102, w: 34, h: 22 }, { x: 340, y: 104, w: 40, h: 22 }, { x: 388, y: 106, w: 36, h: 24 },
  { x: 432, y: 108, w: 34, h: 24 }, { x: 522, y: 136, w: 44, h: 24 }, { x: 574, y: 140, w: 38, h: 24 },
  { x: 620, y: 146, w: 42, h: 26 }, { x: 520, y: 170, w: 36, h: 28 }, { x: 564, y: 172, w: 48, h: 28 },
  // Kakadeo & Govind Nagar blocks
  { x: 96, y: 274, w: 46, h: 26 }, { x: 150, y: 270, w: 42, h: 28 }, { x: 200, y: 268, w: 38, h: 28 },
  { x: 100, y: 310, w: 52, h: 30 }, { x: 160, y: 308, w: 44, h: 30 }, { x: 212, y: 306, w: 46, h: 30 },
  { x: 110, y: 350, w: 48, h: 32 }, { x: 168, y: 350, w: 50, h: 32 }, { x: 228, y: 348, w: 42, h: 32 },
  { x: 120, y: 392, w: 54, h: 28 }, { x: 184, y: 392, w: 48, h: 28 },
  // Mall Road & Jajmau blocks
  { x: 500, y: 286, w: 40, h: 24 }, { x: 548, y: 288, w: 46, h: 24 }, { x: 602, y: 290, w: 40, h: 26 },
  { x: 496, y: 322, w: 44, h: 26 }, { x: 548, y: 324, w: 48, h: 26 }, { x: 604, y: 326, w: 38, h: 26 },
  { x: 702, y: 302, w: 52, h: 28 }, { x: 764, y: 300, w: 48, h: 28 }, { x: 822, y: 298, w: 46, h: 28 },
  { x: 706, y: 342, w: 46, h: 30 }, { x: 762, y: 340, w: 56, h: 30 }, { x: 828, y: 338, w: 42, h: 30 },
  { x: 714, y: 384, w: 54, h: 32 }, { x: 778, y: 382, w: 48, h: 32 }, { x: 836, y: 382, w: 40, h: 32 },
]

/** Kanpur GIS parcel boundaries with realistic clustering & live detections. */
export const defaultKanpurParcels: GisParcel[] = [
  // Swaroop Nagar cluster (Ward 04)
  {
    id: 'knp-1',
    uid: 'KNP-PID-408214',
    owner: 'Kanpur Mercantile Plaza',
    ward: 'Ward 04',
    locality: 'Swaroop Nagar',
    coords: '26.4814° N, 80.3142° E',
    category: 'gap',
    areaSqM: 540,
    path: 'M296 138 L374 142 L370 198 L292 192 Z',
    cx: 333,
    cy: 168,
    detection: {
      label: 'FLOOR ADDITION',
      confidence: 0.94,
      captured: 'Drone orthophoto · 14 May 2026',
      read: 'Built-up area +41% above 2024 KNN tax record',
      decided: 'Queued for Zone 2 ground verification',
      box: { x: 290, y: 134, w: 88, h: 68 },
    },
  },
  {
    id: 'knp-2',
    uid: 'KNP-PID-408219',
    owner: 'Motijheel Diagnostic Hub',
    ward: 'Ward 04',
    locality: 'Swaroop Nagar',
    coords: '26.4802° N, 80.3186° E',
    category: 'tax-net',
    areaSqM: 310,
    path: 'M382 142 L434 146 L430 198 L378 194 Z',
    cx: 406,
    cy: 170,
  },
  {
    id: 'knp-3',
    uid: 'KNP-PID-408244',
    owner: 'Arya Nagar Block B',
    ward: 'Ward 04',
    locality: 'Swaroop Nagar',
    coords: '26.4831° N, 80.3210° E',
    category: 'utility',
    areaSqM: 225,
    path: 'M440 146 L474 148 L470 202 L436 198 Z',
    cx: 455,
    cy: 174,
  },

  // Civil Lines / VIP Road cluster (Ward 08)
  {
    id: 'knp-4',
    uid: 'KNP-PID-411008',
    owner: 'Green Park Institutional Reserve',
    ward: 'Ward 08',
    locality: 'Civil Lines',
    coords: '26.4820° N, 80.3478° E',
    category: 'exempt',
    areaSqM: 1240,
    path: 'M608 164 L682 174 L670 232 L598 224 Z',
    cx: 640,
    cy: 198,
  },
  {
    id: 'knp-5',
    uid: 'KNP-PID-411042',
    owner: 'Sarsaiya Commercial Arcade',
    ward: 'Ward 08',
    locality: 'Civil Lines',
    coords: '26.4765° N, 80.3392° E',
    category: 'modified',
    areaSqM: 460,
    path: 'M518 198 L592 204 L586 244 L512 238 Z',
    cx: 552,
    cy: 220,
    detection: {
      label: 'COMMERCIAL USE',
      confidence: 0.91,
      captured: 'KESCO load sync + street frame · 17 May 2026',
      read: '3-phase commercial load on residential assessment',
      decided: 'Reclassification notice drafted by Zone 1',
      box: { x: 510, y: 194, w: 86, h: 52 },
    },
  },

  // Mall Road / Central cluster (Ward 12)
  {
    id: 'knp-6',
    uid: 'KNP-PID-414902',
    owner: 'Naveen Market Textile Wing',
    ward: 'Ward 12',
    locality: 'Mall Road',
    coords: '26.4698° N, 80.3414° E',
    category: 'gap',
    areaSqM: 615,
    path: 'M486 278 L556 284 L550 338 L480 332 Z',
    cx: 518,
    cy: 308,
  },
  {
    id: 'knp-7',
    uid: 'KNP-PID-414918',
    owner: 'Bada Chauraha Retail Block',
    ward: 'Ward 12',
    locality: 'Mall Road',
    coords: '26.4682° N, 80.3460° E',
    category: 'utility',
    areaSqM: 380,
    path: 'M562 284 L622 290 L616 342 L556 338 Z',
    cx: 589,
    cy: 314,
  },
  {
    id: 'knp-8',
    uid: 'KNP-PID-414955',
    owner: 'Phool Bagh Civic Complex',
    ward: 'Ward 12',
    locality: 'Mall Road',
    coords: '26.4648° N, 80.3512° E',
    category: 'tax-net',
    areaSqM: 490,
    path: 'M556 344 L644 352 L638 390 L550 382 Z',
    cx: 597,
    cy: 367,
  },

  // Kakadeo & Govind Nagar cluster (Ward 15 / 19)
  {
    id: 'knp-9',
    uid: 'KNP-PID-418310',
    owner: 'Kakadeo Coaching Enclave',
    ward: 'Ward 15',
    locality: 'Kakadeo',
    coords: '26.4750° N, 80.2948° E',
    category: 'modified',
    areaSqM: 410,
    path: 'M256 226 L342 238 L334 294 L248 282 Z',
    cx: 295,
    cy: 260,
  },
  {
    id: 'knp-10',
    uid: 'KNP-PID-418345',
    owner: 'Govind Nagar Block C Market',
    ward: 'Ward 19',
    locality: 'Govind Nagar',
    coords: '26.4536° N, 80.3082° E',
    category: 'gap',
    areaSqM: 520,
    path: 'M348 242 L442 254 L434 316 L340 304 Z',
    cx: 391,
    cy: 278,
    detection: {
      label: 'ACTIVE METER',
      confidence: 0.89,
      captured: 'KESCO billing feed · 19 May 2026',
      read: 'Active utility meter with zero municipal tax record',
      decided: 'Linked to GIS parcel polygon for demand notice',
      box: { x: 338, y: 238, w: 108, h: 82 },
    },
  },
  {
    id: 'knp-11',
    uid: 'KNP-PID-418402',
    owner: 'Nirala Nagar Housing Society',
    ward: 'Ward 19',
    locality: 'Govind Nagar',
    coords: '26.4472° N, 80.3125° E',
    category: 'tax-net',
    areaSqM: 375,
    path: 'M324 318 L414 330 L404 388 L314 374 Z',
    cx: 364,
    cy: 352,
  },
  {
    id: 'knp-12',
    uid: 'KNP-PID-418440',
    owner: 'Rawatpur Depot Yard',
    ward: 'Ward 15',
    locality: 'Kakadeo',
    coords: '26.4844° N, 80.2921° E',
    category: 'tax-net',
    areaSqM: 290,
    path: 'M162 232 L242 228 L244 278 L164 282 Z',
    cx: 203,
    cy: 255,
  },

  // Jajmau & Kidwai Nagar cluster (Ward 27)
  {
    id: 'knp-13',
    uid: 'KNP-PID-427104',
    owner: 'Jajmau Leather Tannery Unit 14',
    ward: 'Ward 27',
    locality: 'Jajmau',
    coords: '26.4396° N, 80.4024° E',
    category: 'gap',
    areaSqM: 780,
    path: 'M722 308 L818 304 L824 368 L728 372 Z',
    cx: 773,
    cy: 338,
    detection: {
      label: 'ENCROACHMENT',
      confidence: 0.88,
      captured: 'CAM-KNP-0417 + Sentinel-2 · 20 May 2026',
      read: 'Shed extension crosses arterial drain setback by 4.2 m',
      decided: 'Flagged to Zone 3 enforcement team',
      box: { x: 718, y: 300, w: 110, h: 76 },
    },
  },
  {
    id: 'knp-14',
    uid: 'KNP-PID-427180',
    owner: 'Kidwai Nagar Sector K',
    ward: 'Ward 22',
    locality: 'Kidwai Nagar',
    coords: '26.4328° N, 80.3315° E',
    category: 'tax-net',
    areaSqM: 340,
    path: 'M684 380 L768 386 L762 436 L678 428 Z',
    cx: 723,
    cy: 408,
  },
  {
    id: 'knp-15',
    uid: 'KNP-PID-427215',
    owner: 'IIT Kanpur Technopark Campus',
    ward: 'Ward 02',
    locality: 'Kalyanpur',
    coords: '26.5123° N, 80.2329° E',
    category: 'exempt',
    areaSqM: 1850,
    path: 'M54 92 L166 86 L172 162 L60 168 Z',
    cx: 113,
    cy: 127,
  },
]

/** Kanpur Ganga River polygon along the north-east bank. */
const GANGA_RIVER_PATH = 'M310 0 L920 0 L920 202 L836 168 L718 110 L562 66 L418 34 Z'

/** Major Kanpur arterial highways (slate). */
const KANPUR_HIGHWAYS = [
  { id: 'gt-road', label: 'NH-19 · GT ROAD', d: 'M10 176 L278 196 L484 226 L682 252 L912 238' },
  { id: 'vip-road', label: 'VIP ROAD', d: 'M256 26 L496 68 L704 114 L896 196' },
  { id: 'nh34', label: 'NH-34 · HAMIRPUR RD', d: 'M496 68 L478 232 L458 378 L442 512' },
  { id: 'ring-west', label: 'KAKADEO ARTERIAL', d: 'M256 26 L278 196 L254 468' },
]

/** Kanpur Central main railway corridor (dashed rose). */
const KANPUR_RAIL = 'M10 318 L266 286 L472 346 L666 364 L912 432'

/**
 * GisMap: Interactive Kanpur Municipal GIS spatial viewer with ward
 * boundaries, parcel polygons, search, category filters, zoom/pan,
 * layer switching, and live AI detection overlays.
 */
export function GisMap({
  parcels = defaultKanpurParcels,
  title = 'Kanpur Nagar Nigam · GIS spatial layer',
  code = 'GIS-KNP · BOUNDARIES & DETECTIONS · 2026',
  defaultBase = 'paper',
  className,
}: {
  parcels?: GisParcel[]
  title?: string
  code?: string
  defaultBase?: 'paper' | 'blueprint'
  className?: string
}) {
  const [query, setQuery] = useState('')
  const [activeCategories, setActiveCategories] = useState<Record<GisParcelCategory, boolean>>({
    gap: true,
    utility: true,
    'tax-net': true,
    modified: true,
    exempt: true,
  })
  const [baseMode, setBaseMode] = useState<'paper' | 'blueprint'>(defaultBase)
  const [showWardBoundaries, setShowWardBoundaries] = useState(true)
  const [showParcels, setShowParcels] = useState(true)
  const [showDetections, setShowDetections] = useState(true)
  const [layersOpen, setLayersOpen] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [selectedId, setSelectedId] = useState<string | null>('knp-1')

  const dragRef = useRef<{ startX: number; startY: number; panX: number; panY: number } | null>(null)
  const isDark = baseMode === 'blueprint'

  const filteredParcels = useMemo(() => {
    const q = query.trim().toLowerCase()
    return parcels.filter((p) => {
      if (!activeCategories[p.category]) return false
      if (!q) return true
      return (
        p.uid.toLowerCase().includes(q) ||
        p.owner.toLowerCase().includes(q) ||
        p.ward.toLowerCase().includes(q) ||
        p.locality.toLowerCase().includes(q) ||
        categoryById[p.category].label.toLowerCase().includes(q)
      )
    })
  }, [parcels, activeCategories, query])

  const selectedParcel = parcels.find((p) => p.id === selectedId) ?? filteredParcels[0] ?? null
  const activeDetections = filteredParcels.filter((p) => p.detection)
  const scaleKm = (2 / zoom).toFixed(zoom >= 1.5 ? 2 : 1)

  const toggleCategory = (id: GisParcelCategory) => {
    setActiveCategories((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const resetView = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  const onPointerDown = (e: PointerEvent<SVGSVGElement>) => {
    if ((e.target as HTMLElement).closest('[data-gis-interactive="true"]')) return
    dragRef.current = { startX: e.clientX, startY: e.clientY, panX: pan.x, panY: pan.y }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: PointerEvent<SVGSVGElement>) => {
    if (!dragRef.current) return
    const dx = (e.clientX - dragRef.current.startX) / zoom
    const dy = (e.clientY - dragRef.current.startY) / zoom
    setPan({
      x: Math.max(-180, Math.min(180, dragRef.current.panX + dx)),
      y: Math.max(-120, Math.min(120, dragRef.current.panY + dy)),
    })
  }

  const onPointerUp = () => {
    dragRef.current = null
  }

  return (
    <div className={cx('flex flex-col border border-border bg-surface', className)}>
      {/* Map Viewport with Floating GIS Controls (Search, Category Chips, Right Zoom/Layer Stack) */}
      <div
        className={cx(
          'relative overflow-hidden border-b border-border',
          expanded ? 'h-[580px]' : 'h-[460px]',
          isDark ? 'theme-ink bg-blueprint-grid' : 'bg-paper',
        )}
      >
        {/* Top-left floating GIS Search + Filter Chips overlay */}
        <div className="pointer-events-none absolute top-3 right-14 left-3 z-20 flex flex-col gap-2">
          <div
            data-search-field
            className="pointer-events-auto flex w-full max-w-md items-center border border-rule bg-surface text-text focus-within:outline-2 focus-within:outline-offset-[-1px] focus-within:outline-focus"
          >
            <span className="flex size-9 shrink-0 items-center justify-center border-r border-border text-text-muted">
              <Glyph name="search" size={14} />
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search 71.3k Kanpur properties (Owner, UID, Ward)"
              aria-label="Search Kanpur GIS properties"
              className="h-9 min-w-0 flex-1 border-0 bg-transparent px-3 type-body-s text-text placeholder:text-text-muted outline-none focus:outline-none focus-visible:outline-none"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="flex size-9 shrink-0 cursor-pointer items-center justify-center text-text-muted hover:text-text"
              >
                <Glyph name="close" size={14} />
              </button>
            ) : null}
          </div>

          <div className="pointer-events-auto flex flex-wrap items-center gap-1.5">
            {gisCategories.map((c) => {
              const on = activeCategories[c.id]
              return (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggleCategory(c.id)}
                  className={cx(
                    'inline-flex h-7 cursor-pointer items-center gap-1.5 border px-2.5 type-caption transition-colors',
                    on
                      ? 'border-rule bg-surface text-text'
                      : 'border-border bg-surface-raised text-text-muted hover:bg-hover',
                  )}
                >
                  <span aria-hidden="true" className={cx('size-1.5 shrink-0', on ? c.squareCls : 'bg-border-strong')} />
                  <span>{c.label}</span>
                  <span className="text-text-muted">({c.countLabel})</span>
                </button>
              )
            })}

            <button
              type="button"
              aria-pressed={showDetections}
              onClick={() => setShowDetections((v) => !v)}
              className={cx(
                'inline-flex h-7 cursor-pointer items-center gap-1.5 border px-2.5 type-caption transition-colors',
                showDetections
                  ? 'border-rose-deep bg-rose-tint text-rose-deep'
                  : 'border-border bg-surface text-text-muted hover:bg-hover',
              )}
            >
              <span
                aria-hidden="true"
                className={cx('size-1.5', showDetections ? 'bg-rose-deep animate-live' : 'bg-border-strong')}
              />
              <span>Live detections ({activeDetections.length})</span>
            </button>
          </div>
        </div>

        {/* Right-side floating vertical Map Controls stack (Locate, Expand, +, Layers, -) */}
        <div className="absolute top-3 right-3 z-20 flex flex-col border border-rule bg-surface text-text">
          <button
            type="button"
            title="Recenter on Kanpur"
            aria-label="Recenter on Kanpur"
            onClick={resetView}
            className="flex size-9 cursor-pointer items-center justify-center border-b border-border font-mono text-[10px] hover:bg-hover"
          >
            KNP
          </button>
          <button
            type="button"
            title={expanded ? 'Compact map height' : 'Expand map height'}
            aria-label={expanded ? 'Compact map height' : 'Expand map height'}
            onClick={() => setExpanded((v) => !v)}
            className="flex size-9 cursor-pointer items-center justify-center border-b border-border font-mono text-[10px] hover:bg-hover"
          >
            {expanded ? 'MIN' : 'MAX'}
          </button>
          <button
            type="button"
            title="Zoom in"
            aria-label="Zoom in"
            onClick={() => setZoom((z) => Math.min(2.0, Number((z + 0.25).toFixed(2))))}
            className="flex size-9 cursor-pointer items-center justify-center border-b border-border hover:bg-hover"
          >
            <Glyph name="plus" size={14} />
          </button>
          <button
            type="button"
            title="Toggle map layers"
            aria-label="Toggle map layers"
            aria-expanded={layersOpen}
            onClick={() => setLayersOpen((o) => !o)}
            className={cx(
              'flex size-9 cursor-pointer items-center justify-center border-b border-border font-mono text-[10px] hover:bg-hover',
              layersOpen && 'bg-text text-surface',
            )}
          >
            LYR
          </button>
          <button
            type="button"
            title="Zoom out"
            aria-label="Zoom out"
            onClick={() => setZoom((z) => Math.max(0.75, Number((z - 0.25).toFixed(2))))}
            className="flex size-9 cursor-pointer items-center justify-center hover:bg-hover"
          >
            <Glyph name="minus" size={14} />
          </button>
        </div>

        {/* Floating Layer Switcher Popover */}
        {layersOpen ? (
          <div className="absolute top-28 right-14 z-30 w-56 border border-rule bg-surface p-3 text-text">
            <div className="mb-2 border-b border-border pb-1.5 type-label text-text-label">Kanpur GIS layers</div>
            <div className="flex flex-col gap-2.5">
              <div className="flex border border-rule">
                {(['paper', 'blueprint'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setBaseMode(m)}
                    className={cx(
                      'flex-1 cursor-pointer py-1.5 type-label transition-colors',
                      baseMode === m ? 'bg-text text-surface' : 'bg-surface text-text hover:bg-hover',
                    )}
                  >
                    {m === 'paper' ? 'Paper' : 'Blueprint'}
                  </button>
                ))}
              </div>
              <label className="flex cursor-pointer items-center justify-between type-body-s text-text">
                <span>Ward boundaries</span>
                <input
                  type="checkbox"
                  checked={showWardBoundaries}
                  onChange={(e) => setShowWardBoundaries(e.target.checked)}
                  className="accent-slate-deep"
                />
              </label>
              <label className="flex cursor-pointer items-center justify-between type-body-s text-text">
                <span>Property parcels</span>
                <input
                  type="checkbox"
                  checked={showParcels}
                  onChange={(e) => setShowParcels(e.target.checked)}
                  className="accent-slate-deep"
                />
              </label>
              <label className="flex cursor-pointer items-center justify-between type-body-s text-text">
                <span>Live AI detections</span>
                <input
                  type="checkbox"
                  checked={showDetections}
                  onChange={(e) => setShowDetections(e.target.checked)}
                  className="accent-slate-deep"
                />
              </label>
            </div>
          </div>
        ) : null}

        {/* Interactive Kanpur SVG GIS Canvas (drag to pan) */}
        <svg
          viewBox="0 0 920 520"
          preserveAspectRatio="xMidYMid slice"
          role="img"
          aria-label={`Kanpur GIS map showing ${KANPUR_WARD_BOUNDARIES.length} ward boundaries, ${filteredParcels.length} properties, and ${activeDetections.length} live detections`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className="block h-full w-full cursor-grab active:cursor-grabbing select-none"
        >
          <g
            transform={`translate(${460 * (1 - zoom) + pan.x * zoom}, ${260 * (1 - zoom) + pan.y * zoom}) scale(${zoom})`}
          >
            {/* Subtle base coordinate grid */}
            <g stroke={isDark ? '#1d2c3d' : '#eae3d7'} strokeWidth={0.75}>
              {Array.from({ length: 19 }, (_, i) => (
                <line key={`vx-${i}`} x1={i * 50} y1={0} x2={i * 50} y2={520} />
              ))}
              {Array.from({ length: 11 }, (_, i) => (
                <line key={`hz-${i}`} x1={0} y1={i * 50} x2={920} y2={i * 50} />
              ))}
            </g>

            {/* Ganga River (North-East bank of Kanpur) */}
            <path
              d={GANGA_RIVER_PATH}
              fill={isDark ? '#1c2a38' : '#d1d8da'}
              stroke={isDark ? '#4a5d72' : '#9bb3cc'}
              strokeWidth={1.25}
            />
            <text
              x={680}
              y={54}
              fill={isDark ? '#9bb3cc' : '#2f4e6d'}
              fontSize={11}
              fontFamily="var(--font-mono)"
              letterSpacing="0.16em"
            >
              GANGA RIVER · KANPUR BARRAGE
            </text>

            {/* Dense urban city footprint blocks */}
            <g
              fill={isDark ? '#17222e' : '#efeae1'}
              stroke={isDark ? '#2c435c' : '#d6cfc3'}
              strokeWidth={0.75}
            >
              {URBAN_BLOCKS.map((b, i) => (
                <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} />
              ))}
            </g>

            {/* Kanpur Municipal Ward / Zone Boundaries */}
            {showWardBoundaries ? (
              <g>
                {KANPUR_WARD_BOUNDARIES.map((w) => (
                  <g key={w.id}>
                    <path
                      d={w.path}
                      fill="none"
                      stroke={isDark ? '#7e9bb8' : '#2f4e6d'}
                      strokeWidth={1.25}
                      strokeDasharray="6 4"
                      vectorEffect="non-scaling-stroke"
                    />
                    <text
                      x={w.lx}
                      y={w.ly}
                      fill={isDark ? '#9bb3cc' : '#2f4e6d'}
                      fontSize={9.5}
                      fontFamily="var(--font-mono)"
                      fontWeight={600}
                      letterSpacing="0.08em"
                    >
                      {w.code} · {w.name}
                    </text>
                  </g>
                ))}
              </g>
            ) : null}

            {/* Kanpur Arterial Highways (Slate) */}
            <g fill="none" stroke={isDark ? '#2c435c' : '#e1e4e2'} strokeWidth={9} strokeLinecap="butt">
              {KANPUR_HIGHWAYS.map((h) => (
                <path key={`bg-${h.id}`} d={h.d} />
              ))}
            </g>
            <g fill="none" stroke={isDark ? '#9bb3cc' : '#52769a'} strokeWidth={2} strokeLinecap="butt">
              {KANPUR_HIGHWAYS.map((h) => (
                <path key={h.id} d={h.d} />
              ))}
            </g>

            {/* Kanpur Central Rail Corridor (Dashed Rose) */}
            <path
              d={KANPUR_RAIL}
              fill="none"
              stroke={isDark ? '#c99aa2' : '#9a5b6a'}
              strokeWidth={1.75}
              strokeDasharray="7 4"
            />
            <text
              x={684}
              y={356}
              fill={isDark ? '#c99aa2' : '#7e4554'}
              fontSize={8.5}
              fontFamily="var(--font-mono)"
              letterSpacing="0.06em"
            >
              KANPUR CENTRAL RAIL
            </text>

            {/* Clickable Kanpur Property Parcels */}
            {showParcels
              ? filteredParcels.map((p) => {
                  const meta = categoryById[p.category]
                  const isSel = selectedParcel?.id === p.id
                  const fill = isDark ? meta.fillDark : meta.fillPaper
                  const stroke = isSel
                    ? isDark
                      ? '#f5f3ec'
                      : '#111111'
                    : isDark
                      ? meta.strokeDark
                      : meta.strokePaper
                  return (
                    <g
                      key={p.id}
                      data-gis-interactive="true"
                      role="button"
                      tabIndex={0}
                      aria-label={`${p.uid}, ${p.owner}, ${p.locality}, ${meta.label}`}
                      aria-pressed={isSel}
                      onClick={() => setSelectedId(p.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          setSelectedId(p.id)
                        }
                      }}
                      className="cursor-pointer outline-none"
                    >
                      <path
                        d={p.path}
                        fill={fill}
                        stroke={stroke}
                        strokeWidth={isSel ? 2.5 : 1.25}
                        strokeDasharray={meta.dashed && !isSel ? '4 3' : undefined}
                        vectorEffect="non-scaling-stroke"
                      />
                      <text
                        x={p.cx}
                        y={p.cy + 3}
                        textAnchor="middle"
                        fill={isDark ? '#f5f3ec' : '#111111'}
                        fontSize={8.5}
                        fontFamily="var(--font-mono)"
                        fontWeight={isSel ? 700 : 500}
                      >
                        {p.uid.slice(-6)}
                      </text>
                    </g>
                  )
                })
              : null}

            {/* Live AI Detection Bounding Boxes & Paper Label Tags */}
            {showDetections
              ? filteredParcels.map((p) => {
                  if (!p.detection) return null
                  const { box, label, confidence } = p.detection
                  const confPct = `${Math.round(confidence * 100)}%`
                  const tagW = Math.max(114, label.length * 6.4 + 38)
                  return (
                    <g
                      key={`det-${p.id}`}
                      data-gis-interactive="true"
                      onClick={() => setSelectedId(p.id)}
                      className="cursor-pointer"
                    >
                      <rect
                        x={box.x}
                        y={box.y}
                        width={box.w}
                        height={box.h}
                        fill="none"
                        stroke={isDark ? '#ffffff' : '#111111'}
                        strokeWidth={1.35}
                      />
                      {/* Corner ticks */}
                      <rect x={box.x - 2} y={box.y - 2} width={4} height={4} fill="#7e4554" />
                      <rect x={box.x + box.w - 2} y={box.y + box.h - 2} width={4} height={4} fill="#7e4554" />

                      {/* Paper tag in mono label */}
                      <rect
                        x={box.x}
                        y={box.y - 17}
                        width={tagW}
                        height={16}
                        fill="#f5f3ec"
                        stroke="#111111"
                        strokeWidth={0.85}
                      />
                      <rect x={box.x + 4} y={box.y - 11.5} width={5} height={5} fill="#7e4554" />
                      <text
                        x={box.x + 13}
                        y={box.y - 5.5}
                        fill="#111111"
                        fontSize={8.5}
                        fontFamily="var(--font-mono)"
                        fontWeight={600}
                        letterSpacing="0.04em"
                      >
                        {label} · {confPct}
                      </text>
                    </g>
                  )
                })
              : null}
          </g>
        </svg>

        {/* Bottom-left Floating Coordinates & Attribution Strip */}
        <div className="pointer-events-none absolute bottom-3 left-3 z-20 flex flex-wrap items-center gap-2 border border-rule bg-surface px-2.5 py-1 text-text">
          <span className="type-label text-text-label">{title}</span>
          <span className="type-caption text-text-muted">
            · 26.4499° N, 80.3319° E · {Math.round(zoom * 100)}% · {code} · TAGS ILLUSTRATIVE
          </span>
        </div>

        {/* Bottom-right Floating North Arrow + Dynamic Scale Bar */}
        <div className="pointer-events-none absolute right-3 bottom-3 z-20 flex items-center gap-4 border border-rule bg-surface px-3 py-1.5 text-text">
          <div className="flex items-center gap-1.5">
            <svg width="10" height="14" viewBox="0 0 10 14" aria-hidden="true">
              <line x1="5" y1="13" x2="5" y2="3" stroke="currentColor" strokeWidth="1.25" />
              <polygon points="5,0 2,5 8,5" fill="currentColor" />
            </svg>
            <span className="type-caption text-text-label">N</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="flex justify-between font-mono text-[9px] text-text-muted">
              <span>0</span>
              <span>{scaleKm} km</span>
            </div>
            <div className="h-1.5 w-16 border-x border-b border-rule" />
          </div>
        </div>
      </div>

      {/* Selected Kanpur Parcel & Evidence Decision Trail (Captured / Read / Decided) */}
      {selectedParcel ? (
        <div className="grid gap-4 bg-surface px-4 py-4 md:grid-cols-[1fr_1.5fr]">
          <div className="flex flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className={cx('size-2 shrink-0', categoryById[selectedParcel.category].squareCls)} />
              <span className="font-mono text-[12px] font-semibold text-text">{selectedParcel.uid}</span>
              <span className="type-label text-text-label">· {categoryById[selectedParcel.category].label}</span>
            </div>
            <div className="type-heading text-text">{selectedParcel.owner}</div>
            <div className="type-body-s text-text-muted">
              {selectedParcel.ward}, {selectedParcel.locality} · {selectedParcel.areaSqM} m² ·{' '}
              <span className="font-mono text-[11px]">{selectedParcel.coords}</span>
            </div>
          </div>

          {selectedParcel.detection ? (
            <div className="grid gap-2 border-t border-border pt-3 md:border-t-0 md:border-l md:pt-0 md:pl-4">
              <div className="flex items-center justify-between">
                <span className="type-label text-rose-deep">Live detection · {selectedParcel.detection.label}</span>
                <span className="type-caption text-text-muted">
                  Confidence {Math.round(selectedParcel.detection.confidence * 100)}%
                </span>
              </div>
              <dl className="grid gap-1 type-body-s">
                <div className="flex gap-2">
                  <dt className="w-20 shrink-0 type-caption text-text-label">Captured</dt>
                  <dd className="text-text-muted">{selectedParcel.detection.captured}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-20 shrink-0 type-caption text-text-label">Read</dt>
                  <dd className="text-text">{selectedParcel.detection.read}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-20 shrink-0 type-caption text-text-label">Decided</dt>
                  <dd className="text-text">{selectedParcel.detection.decided}</dd>
                </div>
              </dl>
            </div>
          ) : (
            <div className="flex items-center border-t border-border pt-3 type-body-s text-text-muted md:border-t-0 md:border-l md:pt-0 md:pl-4">
              No active anomaly detection on this parcel. Boundary verified against Kanpur Nagar Nigam GIS register.
            </div>
          )}
        </div>
      ) : null}
    </div>
  )
}
