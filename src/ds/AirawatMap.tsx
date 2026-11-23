import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import * as L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { cx } from './cx'
import { Glyph } from './Glyph'
import { SearchInput } from './Input'
import { useProjectTheme } from './projectThemes'

export type MapDetectionStatus = 'critical' | 'caution' | 'info' | 'resolved'

export type AirawatMapLocation = {
  id: string
  code: string
  title: string
  area: string
  lat: number
  lng: number
  status: MapDetectionStatus
  /** When true, renders an animated radar pulse ring at this location/area. */
  live?: boolean
  category?: string
  metricLabel?: string
  metricValue?: string
  confidence?: number
  timestamp?: string
  /** Optional circular affected zone radius in metres around (lat, lng). */
  areaRadiusMeters?: number
  /** Optional polygon coordinates for a ward/sector boundary highlight. */
  polygon?: [number, number][]
  /** Extra key-value telemetry rows rendered inside the hover/click data tooltip. */
  details?: { label: string; value: string }[]
}

const STATUS_META: Record<
  MapDetectionStatus,
  {
    label: string
    paperHex: string
    inkHex: string
    squareCls: string
    badgeCls: string
  }
> = {
  critical: {
    label: 'Critical',
    paperHex: '#7e4554',
    inkHex: '#c99aa2',
    squareCls: 'bg-critical',
    badgeCls: 'border-critical bg-critical-tint text-critical',
  },
  caution: {
    label: 'Caution',
    paperHex: '#9a5b6a',
    inkHex: '#c99aa2',
    squareCls: 'bg-caution',
    badgeCls: 'border-caution bg-caution-tint text-caution',
  },
  info: {
    label: 'Notice',
    paperHex: '#2f4e6d',
    inkHex: '#9bb3cc',
    squareCls: 'bg-info',
    badgeCls: 'border-info bg-info-tint text-info',
  },
  resolved: {
    label: 'Resolved',
    paperHex: '#4f5d50',
    inkHex: '#b8c3b9',
    squareCls: 'bg-success',
    badgeCls: 'border-success bg-success-tint text-success',
  },
}

export type MapViewMode = 'street' | 'satellite'

/** Keyless high-detail street & satellite basemaps (Esri World Street Map + World Imagery). */
const TILE_SOURCES = {
  street: {
    base: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles © Esri · Street Map',
    maxNativeZoom: 18,
  },
  satellite: {
    base: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    labels: 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Imagery © Esri · Maxar · Earthstar Geographics',
    maxNativeZoom: 18,
  },
}

/** Default sample locations across Kanpur for design system demonstration. */
export const defaultKanpurLocations: AirawatMapLocation[] = [
  {
    id: 'det-swaroop',
    code: 'VMS-KNP-014',
    title: 'Solid waste dumping near market lane',
    area: 'Ward 04 · Swaroop Nagar',
    lat: 26.4842,
    lng: 80.3136,
    status: 'critical',
    live: true,
    category: 'VMS · Sanitation',
    metricLabel: 'Confidence',
    metricValue: '94%',
    confidence: 0.94,
    timestamp: 'Live · 14 sec ago',
    areaRadiusMeters: 260,
    details: [
      { label: 'Camera', value: 'KNP-CAM-042' },
      { label: 'SLA window', value: '2h 15m left' },
      { label: 'Assigned', value: 'Zone 2 Crew' },
    ],
  },
  {
    id: 'det-mallroad',
    code: 'PGR-KNP-208',
    title: 'Waterlogging reported at Bada Chauraha',
    area: 'Ward 12 · Mall Road',
    lat: 26.4695,
    lng: 80.3468,
    status: 'caution',
    live: true,
    category: 'PGR · Drainage',
    metricLabel: 'Reports',
    metricValue: '19 citizens',
    confidence: 0.89,
    timestamp: 'Live · 2 min ago',
    areaRadiusMeters: 340,
    details: [
      { label: 'Depth est.', value: '18 cm' },
      { label: 'Pump unit', value: 'Dispatched' },
      { label: 'Priority', value: 'High' },
    ],
  },
  {
    id: 'det-civil',
    code: 'AQ-KNP-009',
    title: 'PM2.5 spike above 180 µg/m³',
    area: 'Ward 08 · Civil Lines',
    lat: 26.4766,
    lng: 80.3515,
    status: 'critical',
    live: true,
    category: 'Air Quality',
    metricLabel: 'PM2.5',
    metricValue: '186 µg/m³',
    confidence: 0.97,
    timestamp: 'Live · 38 sec ago',
    areaRadiusMeters: 420,
    details: [
      { label: 'Sensor', value: 'AQ-IITK-09' },
      { label: 'Wind', value: '8 km/h NW' },
      { label: 'Forecast', value: '24h elevated' },
    ],
  },
  {
    id: 'det-kakadeo',
    code: 'PT-KNP-418',
    title: 'Unassessed commercial floor addition',
    area: 'Ward 15 · Kakadeo',
    lat: 26.4754,
    lng: 80.2944,
    status: 'info',
    live: false,
    category: 'Property Tax',
    metricLabel: 'Area delta',
    metricValue: '+41%',
    confidence: 0.91,
    timestamp: 'Verified · Today 10:12',
    areaRadiusMeters: 210,
    details: [
      { label: 'Property ID', value: 'KNP-PID-418310' },
      { label: 'Source', value: 'Sentinel-2 + GIS' },
      { label: 'Action', value: 'Notice queued' },
    ],
  },
  {
    id: 'det-govind',
    code: 'WTR-KNP-077',
    title: 'Pipeline pressure restored after valve repair',
    area: 'Ward 19 · Govind Nagar',
    lat: 26.4534,
    lng: 80.3084,
    status: 'resolved',
    live: false,
    category: 'Water Supply',
    metricLabel: 'Pressure',
    metricValue: '2.4 bar',
    timestamp: 'Closed · 09:40',
    areaRadiusMeters: 280,
    details: [
      { label: 'Node', value: 'DMA-19-B' },
      { label: 'Closure time', value: '3h 20m' },
      { label: 'Verification', value: 'SCADA + field' },
    ],
  },
  {
    id: 'det-jajmau',
    code: 'FLD-KNP-031',
    title: 'River embankment gauge rising steadily',
    area: 'Ward 27 · Jajmau Ghat',
    lat: 26.4418,
    lng: 80.4022,
    status: 'caution',
    live: true,
    category: 'Floods',
    metricLabel: 'Gauge',
    metricValue: '112.4 m',
    confidence: 0.95,
    timestamp: 'Live · 1 min ago',
    areaRadiusMeters: 480,
    details: [
      { label: 'Warning mark', value: '113.0 m' },
      { label: 'Trend', value: '+0.14 m / hr' },
      { label: 'Status', value: 'Watch active' },
    ],
  },
]

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function buildMarkerIcon(loc: AirawatMapLocation, isInk: boolean, isSelected: boolean) {
  const meta = STATUS_META[loc.status]
  const color = isInk ? meta.inkHex : meta.paperHex
  const coreBorder = isInk ? '#111111' : '#f5f3ec'
  const tagBg = isInk ? '#111111' : '#f5f3ec'
  const tagText = isInk ? '#f5f3ec' : '#111111'
  const tagBorder = isInk ? '#4a5d72' : '#111111'
  const size = isSelected ? 16 : 12
  const shortArea = loc.area.includes('·') ? loc.area.split('·')[1].trim() : loc.area

  const pulseHtml = loc.live
    ? `
      <span class="airawat-map-pulse" style="border-color:${color};background:${color}22;"></span>
      <span class="airawat-map-pulse airawat-map-pulse-delay" style="border-color:${color};"></span>
    `
    : ''

  const selectedRing = isSelected
    ? `<span style="position:absolute;inset:-6px;border:1.5px solid ${color};pointer-events:none;"></span>`
    : ''

  return L.divIcon({
    className: 'airawat-map-marker-root',
    html: `
      <div class="airawat-map-marker" style="width:${size}px;height:${size}px;">
        ${pulseHtml}
        ${selectedRing}
        <span style="position:relative;display:block;width:${size}px;height:${size}px;background:${color};border:2px solid ${coreBorder};"></span>
        <span style="position:absolute;left:${size + 6}px;top:50%;transform:translateY(-50%);white-space:nowrap;padding:1px 5px;background:${tagBg};color:${tagText};border:1px solid ${tagBorder};font-family:'JetBrains Mono',monospace;font-size:10px;line-height:1.3;letter-spacing:0.06em;pointer-events:none;">${escapeHtml(shortArea)}</span>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}

export type AirawatMapProps = {
  locations?: AirawatMapLocation[]
  center?: [number, number]
  zoom?: number
  height?: number
  searchable?: boolean
  searchPlaceholder?: string
  showStatusFilters?: boolean
  selectedId?: string | null
  onSelect?: (location: AirawatMapLocation | null) => void
  /** Override surface theme; defaults to global Paper / Ink theme from ProjectThemeProvider. */
  theme?: 'paper' | 'ink'
  /** Initial map basemap mode: street map or real colour satellite imagery. */
  defaultView?: MapViewMode
  /** Optional custom tile URL; overrides default street/satellite basemaps. */
  tileUrl?: string
  className?: string
}

const TOOLTIP_W = 272
const TOOLTIP_H = 224
const TOOLTIP_PAD = 12

/**
 * AirawatMap: Reusable Leaflet geographic map styled to the Airawat Brand Guide V2.
 * Supports Paper (Light) and Ink (Dark) street maps, true-colour Satellite view,
 * live detection radar pulse animations, viewport-clamped data tooltips,
 * affected-area zones, and a top toolbar search bar.
 */
export function AirawatMap({
  locations = defaultKanpurLocations,
  center = [26.4695, 80.338],
  zoom = 13,
  height = 480,
  searchable = true,
  searchPlaceholder = 'Search location, ward, detection or code',
  showStatusFilters = true,
  selectedId,
  onSelect,
  theme,
  defaultView = 'street',
  tileUrl,
  className,
}: AirawatMapProps) {
  const { surfaceTheme } = useProjectTheme()
  const activeTheme = theme ?? surfaceTheme
  const isInk = activeTheme === 'ink'

  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const tileGroupRef = useRef<L.LayerGroup | null>(null)
  const overlayGroupRef = useRef<L.LayerGroup | null>(null)

  const [viewMode, setViewMode] = useState<MapViewMode>(defaultView)
  const [query, setQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [statusFilter, setStatusFilter] = useState<'all' | 'live' | MapDetectionStatus>('all')
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(locations[0]?.id ?? null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [tooltipPos, setTooltipPos] = useState<{ left: number; top: number } | null>(null)
  const [currentZoom, setCurrentZoom] = useState(zoom)
  const [showAreas, setShowAreas] = useState(true)

  const effectiveSelectedId = selectedId !== undefined ? selectedId : internalSelectedId

  const filteredLocations = useMemo(() => {
    const q = query.trim().toLowerCase()
    return locations.filter((loc) => {
      if (statusFilter === 'live' && !loc.live) return false
      if (statusFilter !== 'all' && statusFilter !== 'live' && loc.status !== statusFilter) return false
      if (!q) return true
      return (
        loc.title.toLowerCase().includes(q) ||
        loc.area.toLowerCase().includes(q) ||
        loc.code.toLowerCase().includes(q) ||
        (loc.category?.toLowerCase().includes(q) ?? false)
      )
    })
  }, [locations, query, statusFilter])

  const selectedLocation = useMemo(
    () => locations.find((l) => l.id === effectiveSelectedId) ?? null,
    [locations, effectiveSelectedId],
  )

  const tooltipLocation = useMemo(
    () => (hoveredId ? filteredLocations.find((l) => l.id === hoveredId) ?? null : null),
    [filteredLocations, hoveredId],
  )

  const liveCount = useMemo(() => locations.filter((l) => l.live).length, [locations])

  const computeTooltipPos = useCallback((loc: AirawatMapLocation) => {
    const map = mapRef.current
    if (!map) return null
    const pt = map.latLngToContainerPoint([loc.lat, loc.lng])
    const size = map.getSize()
    // Prefer right of marker; flip left if near right edge (leaving room for zoom stack)
    const rightEdge = size.x - 56
    let left = pt.x + 18
    if (left + TOOLTIP_W > rightEdge) {
      left = pt.x - TOOLTIP_W - 18
    }
    left = Math.max(TOOLTIP_PAD, Math.min(left, rightEdge - TOOLTIP_W))
    const top = Math.max(TOOLTIP_PAD, Math.min(pt.y - TOOLTIP_H / 2, size.y - TOOLTIP_H - 42))
    return { left, top }
  }, [])

  const selectLocation = useCallback(
    (loc: AirawatMapLocation | null, fly = true) => {
      if (selectedId === undefined) setInternalSelectedId(loc?.id ?? null)
      onSelect?.(loc)
      if (loc && fly && mapRef.current) {
        mapRef.current.flyTo([loc.lat, loc.lng], Math.max(mapRef.current.getZoom(), 14), { duration: 0.55 })
      }
    },
    [onSelect, selectedId],
  )

  // Initialize Leaflet map once
  useEffect(() => {
    const el = containerRef.current
    if (!el || mapRef.current) return

    const map = L.map(el, {
      center,
      zoom,
      minZoom: 4,
      maxZoom: 18,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: true,
    })

    const tileGroup = L.layerGroup().addTo(map)
    const overlayGroup = L.layerGroup().addTo(map)

    map.on('zoomend', () => setCurrentZoom(map.getZoom()))
    map.on('movestart', () => setHoveredId(null))

    mapRef.current = map
    tileGroupRef.current = tileGroup
    overlayGroupRef.current = overlayGroup

    // Ensure Leaflet measures the container accurately after layout settles
    const raf = window.requestAnimationFrame(() => map.invalidateSize())

    return () => {
      window.cancelAnimationFrame(raf)
      map.remove()
      mapRef.current = null
      tileGroupRef.current = null
      overlayGroupRef.current = null
    }
  }, [])

  // Swap street / satellite tile layers cleanly
  useEffect(() => {
    const tileGroup = tileGroupRef.current
    if (!tileGroup) return
    tileGroup.clearLayers()

    if (tileUrl) {
      L.tileLayer(tileUrl, { maxZoom: 19, maxNativeZoom: 18 }).addTo(tileGroup)
      return
    }

    if (viewMode === 'satellite') {
      L.tileLayer(TILE_SOURCES.satellite.base, {
        maxZoom: 19,
        maxNativeZoom: TILE_SOURCES.satellite.maxNativeZoom,
        attribution: TILE_SOURCES.satellite.attribution,
      }).addTo(tileGroup)
      L.tileLayer(TILE_SOURCES.satellite.labels, {
        maxZoom: 19,
        maxNativeZoom: TILE_SOURCES.satellite.maxNativeZoom,
      }).addTo(tileGroup)
    } else {
      L.tileLayer(TILE_SOURCES.street.base, {
        maxZoom: 19,
        maxNativeZoom: TILE_SOURCES.street.maxNativeZoom,
        attribution: TILE_SOURCES.street.attribution,
      }).addTo(tileGroup)
    }
  }, [viewMode, tileUrl])

  // Render markers, live pulse animations, and area highlights
  useEffect(() => {
    const group = overlayGroupRef.current
    if (!group) return
    group.clearLayers()

    filteredLocations.forEach((loc) => {
      const meta = STATUS_META[loc.status]
      const hex = isInk ? meta.inkHex : meta.paperHex
      const isSelected = loc.id === effectiveSelectedId

      if (showAreas) {
        if (loc.polygon && loc.polygon.length >= 3) {
          L.polygon(loc.polygon, {
            color: hex,
            weight: isSelected ? 2 : 1.25,
            opacity: isSelected ? 0.95 : 0.7,
            fillColor: hex,
            fillOpacity: isSelected ? 0.24 : 0.13,
            dashArray: loc.live ? '5 4' : undefined,
          }).addTo(group)
        } else if (loc.areaRadiusMeters) {
          L.circle([loc.lat, loc.lng], {
            radius: loc.areaRadiusMeters,
            color: hex,
            weight: isSelected ? 1.75 : 1,
            opacity: isSelected ? 0.9 : 0.6,
            fillColor: hex,
            fillOpacity: isSelected ? 0.2 : 0.1,
            dashArray: loc.live ? '5 4' : undefined,
          }).addTo(group)
        }
      }

      const marker = L.marker([loc.lat, loc.lng], {
        icon: buildMarkerIcon(loc, isInk, isSelected),
        alt: `${loc.code} · ${loc.title}`,
        zIndexOffset: isSelected ? 500 : loc.live ? 200 : 0,
      })

      marker.on('mouseover', () => {
        setHoveredId(loc.id)
        setTooltipPos(computeTooltipPos(loc))
      })
      marker.on('mouseout', () => {
        setHoveredId((prev) => (prev === loc.id ? null : prev))
      })
      marker.on('click', () => {
        selectLocation(loc, true)
      })

      marker.addTo(group)
    })
  }, [filteredLocations, isInk, effectiveSelectedId, showAreas, computeTooltipPos, selectLocation])

  const fitAll = () => {
    const map = mapRef.current
    if (!map) return
    if (filteredLocations.length === 0) {
      map.flyTo(center, zoom, { duration: 0.45 })
      return
    }
    if (filteredLocations.length === 1) {
      const only = filteredLocations[0]
      map.flyTo([only.lat, only.lng], 14, { duration: 0.45 })
      return
    }
    const bounds = L.latLngBounds(filteredLocations.map((l) => [l.lat, l.lng] as L.LatLngTuple))
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [56, 56], maxZoom: 15 })
    }
  }

  return (
    <div className={cx('flex flex-col border border-border bg-surface text-text', isInk && 'theme-ink', className)}>
      {/* Dedicated Top Toolbar: Search Bar + Status Filter Chips (never overlaps map markers or tooltips) */}
      {(searchable || showStatusFilters) ? (
        <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-border bg-surface-raised px-3 py-2.5">
          {searchable ? (
            <div className="relative w-full sm:w-80">
              <SearchInput
                compact
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => window.setTimeout(() => setSearchFocused(false), 160)}
                onClear={() => setQuery('')}
                placeholder={searchPlaceholder}
                aria-label="Search map locations"
                className="border-border-strong bg-surface"
              />
              {searchFocused && query.trim().length > 0 ? (
                <div className="absolute top-full right-0 left-0 z-[700] mt-1 max-h-56 overflow-auto border border-rule bg-surface">
                  {filteredLocations.length === 0 ? (
                    <div className="px-3 py-2.5 type-body-s text-text-muted">No locations match &ldquo;{query}&rdquo;.</div>
                  ) : (
                    filteredLocations.map((loc) => {
                      const meta = STATUS_META[loc.status]
                      return (
                        <button
                          key={loc.id}
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            selectLocation(loc, true)
                            setSearchFocused(false)
                          }}
                          className="flex w-full cursor-pointer items-start justify-between gap-3 border-b border-border px-3 py-2 text-left transition-colors last:border-b-0 hover:bg-hover"
                        >
                          <span className="flex min-w-0 items-start gap-2">
                            <span aria-hidden="true" className={cx('mt-1.5 size-1.5 shrink-0', meta.squareCls)} />
                            <span className="min-w-0">
                              <span className="block truncate type-body-s font-medium text-text">{loc.title}</span>
                              <span className="block truncate type-caption text-text-muted">{loc.area}</span>
                            </span>
                          </span>
                          <span className="shrink-0 type-caption text-text-label">{loc.code}</span>
                        </button>
                      )
                    })
                  )}
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="flex flex-wrap items-center gap-2">
            {/* Street / Satellite view switch */}
            <div role="group" aria-label="Map view mode" className="inline-flex h-8 border border-rule bg-surface">
              {(
                [
                  { id: 'street', label: 'Street' },
                  { id: 'satellite', label: 'Satellite' },
                ] as const
              ).map((m) => {
                const active = viewMode === m.id
                return (
                  <button
                    key={m.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setViewMode(m.id)}
                    className={cx(
                      'cursor-pointer px-2.5 type-caption transition-colors first:border-r first:border-border',
                      active ? 'bg-text text-surface' : 'text-text hover:bg-hover',
                    )}
                  >
                    {m.label}
                  </button>
                )
              })}
            </div>

            {showStatusFilters ? (
              <div className="flex flex-wrap items-center gap-1.5">
                {(
                  [
                    { id: 'all', label: `All (${locations.length})`, dot: 'bg-text' },
                    { id: 'live', label: `Live detections (${liveCount})`, dot: 'bg-critical animate-live' },
                    { id: 'critical', label: 'Critical', dot: 'bg-critical' },
                    { id: 'caution', label: 'Caution', dot: 'bg-caution' },
                    { id: 'info', label: 'Notice', dot: 'bg-info' },
                    { id: 'resolved', label: 'Resolved', dot: 'bg-success' },
                  ] as const
                ).map((chip) => {
                  const active = statusFilter === chip.id
                  return (
                    <button
                      key={chip.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setStatusFilter(chip.id)}
                      className={cx(
                        'inline-flex h-8 cursor-pointer items-center gap-1.5 border px-2.5 type-caption transition-colors',
                        active
                          ? 'border-rule bg-text text-surface'
                          : 'border-border bg-surface text-text hover:border-rule hover:bg-hover',
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={cx('size-1.5 shrink-0', active ? 'bg-surface' : chip.dot)}
                      />
                      <span>{chip.label}</span>
                    </button>
                  )
                })}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* Map Viewport — dynamic theme/view class sits on this parent so React NEVER overwrites Leaflet's classes on containerRef */}
      <div
        className={cx(
          'relative overflow-hidden',
          viewMode === 'satellite'
            ? 'airawat-map-satellite'
            : isInk
              ? 'airawat-map-ink'
              : 'airawat-map-paper',
        )}
        style={{ height }}
      >
        <div
          ref={containerRef}
          className="h-full w-full"
          aria-label="Interactive Airawat geographic map"
        />

        {/* Viewport-Clamped Data Tooltip (never clips at edges or merges with controls) */}
        {tooltipLocation && tooltipPos ? (
          <div
            role="tooltip"
            style={{ left: tooltipPos.left, top: tooltipPos.top, width: TOOLTIP_W }}
            className="pointer-events-none absolute z-[650] border border-rule bg-surface text-text"
          >
            <div className="flex items-center justify-between gap-2 border-b border-border bg-surface-raised px-2.5 py-1.5 type-label">
              <span className="inline-flex items-center gap-1.5 text-text">
                <span
                  aria-hidden="true"
                  className={cx(
                    'size-1.5 shrink-0',
                    STATUS_META[tooltipLocation.status].squareCls,
                    tooltipLocation.live && 'animate-live',
                  )}
                />
                {STATUS_META[tooltipLocation.status].label}
                {tooltipLocation.live ? ' · Live' : ''}
              </span>
              <span className="text-text-label">{tooltipLocation.code}</span>
            </div>
            <div className="p-2.5">
              <p className="type-body-s font-medium leading-snug text-text">{tooltipLocation.title}</p>
              <p className="mt-0.5 type-caption text-text-muted">{tooltipLocation.area}</p>

              {tooltipLocation.metricValue ? (
                <div className="mt-2 flex items-baseline justify-between gap-2 border border-border bg-surface-raised px-2 py-1">
                  <span className="type-label text-text-label">{tooltipLocation.metricLabel ?? 'Metric'}</span>
                  <span className="type-heading text-text tabular-nums">{tooltipLocation.metricValue}</span>
                </div>
              ) : null}

              {tooltipLocation.details && tooltipLocation.details.length > 0 ? (
                <dl className="mt-2 flex flex-col gap-1 border-t border-border pt-2">
                  {tooltipLocation.details.slice(0, 3).map((d) => (
                    <div key={d.label} className="flex items-center justify-between gap-3 type-caption">
                      <dt className="text-text-muted">{d.label}</dt>
                      <dd className="font-medium text-text tabular-nums">{d.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}

              <div className="mt-2 flex items-center justify-between gap-2 border-t border-border pt-1.5 type-caption text-text-muted">
                <span>
                  {tooltipLocation.lat.toFixed(4)}° N, {tooltipLocation.lng.toFixed(4)}° E
                </span>
                <span>{tooltipLocation.timestamp ?? ''}</span>
              </div>
            </div>
          </div>
        ) : null}

        {/* Right-side vertical map control stack (square 0px, zero shadow) */}
        <div className="absolute top-3 right-3 z-[500] flex flex-col border border-rule bg-surface text-text">
          <button
            type="button"
            title="Zoom in"
            aria-label="Zoom in"
            onClick={() => mapRef.current?.zoomIn()}
            className="flex size-9 cursor-pointer items-center justify-center border-b border-border hover:bg-hover"
          >
            <Glyph name="plus" size={14} />
          </button>
          <button
            type="button"
            title="Zoom out"
            aria-label="Zoom out"
            onClick={() => mapRef.current?.zoomOut()}
            className="flex size-9 cursor-pointer items-center justify-center border-b border-border hover:bg-hover"
          >
            <Glyph name="minus" size={14} />
          </button>
          <button
            type="button"
            title="Fit all detections"
            aria-label="Fit all detections"
            onClick={fitAll}
            className="flex size-9 cursor-pointer items-center justify-center border-b border-border font-mono text-[10px] hover:bg-hover"
          >
            FIT
          </button>
          <button
            type="button"
            title={showAreas ? 'Hide affected area zones' : 'Show affected area zones'}
            aria-label={showAreas ? 'Hide affected area zones' : 'Show affected area zones'}
            aria-pressed={showAreas}
            onClick={() => setShowAreas((v) => !v)}
            className={cx(
              'flex size-9 cursor-pointer items-center justify-center font-mono text-[10px] transition-colors',
              showAreas ? 'bg-text text-surface' : 'hover:bg-hover',
            )}
          >
            ZONE
          </button>
        </div>

        {/* Bottom coordinate & attribution strip */}
        <div className="pointer-events-none absolute right-3 bottom-3 left-3 z-[500] flex flex-wrap items-center justify-between gap-2">
          <span className="border border-rule bg-surface px-2.5 py-1 type-caption text-text">
            {filteredLocations.length} locations · {filteredLocations.filter((l) => l.live).length} live · Zoom {currentZoom}x
          </span>
          <span className="border border-border bg-surface px-2 py-0.5 type-caption text-text-muted">
            {viewMode === 'satellite' ? TILE_SOURCES.satellite.attribution : TILE_SOURCES.street.attribution}
          </span>
        </div>
      </div>

      {/* Selected Location Summary Bar below viewport */}
      {selectedLocation ? (
        <div className="grid gap-4 border-t border-border bg-surface-raised px-4 py-3 md:grid-cols-[1.3fr_1fr_auto] md:items-center">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cx(
                  'inline-flex items-center gap-1.5 border px-2 py-0.5 type-label',
                  STATUS_META[selectedLocation.status].badgeCls,
                )}
              >
                <span
                  aria-hidden="true"
                  className={cx(
                    'size-1.5',
                    STATUS_META[selectedLocation.status].squareCls,
                    selectedLocation.live && 'animate-live',
                  )}
                />
                {STATUS_META[selectedLocation.status].label}
                {selectedLocation.live ? ' · Live' : ''}
              </span>
              <span className="type-caption text-text-label">{selectedLocation.code}</span>
              {selectedLocation.category ? <span className="type-caption text-text-muted">{selectedLocation.category}</span> : null}
            </div>
            <p className="mt-1.5 type-heading text-text">{selectedLocation.title}</p>
            <p className="type-body-s text-text-muted">
              {selectedLocation.area} · {selectedLocation.lat.toFixed(4)}° N, {selectedLocation.lng.toFixed(4)}° E
            </p>
          </div>

          {selectedLocation.details && selectedLocation.details.length > 0 ? (
            <dl className="grid grid-cols-3 gap-3 border-t border-border pt-2.5 md:border-t-0 md:border-l md:pt-0 md:pl-4">
              {selectedLocation.details.slice(0, 3).map((d) => (
                <div key={d.label} className="min-w-0">
                  <dt className="truncate type-label text-text-muted">{d.label}</dt>
                  <dd className="mt-0.5 truncate type-body-s font-medium text-text tabular-nums">{d.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}

          <div className="flex items-center justify-between gap-3 md:flex-col md:items-end">
            {selectedLocation.metricValue ? (
              <div className="text-left md:text-right">
                <span className="block type-label text-text-label">{selectedLocation.metricLabel ?? 'Reading'}</span>
                <span className="type-display-m text-text tabular-nums">{selectedLocation.metricValue}</span>
              </div>
            ) : null}
            {selectedLocation.timestamp ? (
              <span className="type-caption text-text-muted">{selectedLocation.timestamp}</span>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}
