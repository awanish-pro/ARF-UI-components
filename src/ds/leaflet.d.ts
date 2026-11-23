declare module 'leaflet' {
  export type LatLngTuple = [number, number]
  export type LatLngExpression = LatLngTuple | { lat: number; lng: number }

  export interface MapOptions {
    center?: LatLngExpression
    zoom?: number
    minZoom?: number
    maxZoom?: number
    zoomControl?: boolean
    attributionControl?: boolean
    scrollWheelZoom?: boolean
  }

  export interface TileLayerOptions {
    attribution?: string
    maxZoom?: number
    maxNativeZoom?: number
    minZoom?: number
    subdomains?: string | string[]
  }

  export interface DivIconOptions {
    html?: string
    className?: string
    iconSize?: [number, number]
    iconAnchor?: [number, number]
    tooltipAnchor?: [number, number]
  }

  export interface MarkerOptions {
    icon?: DivIcon
    title?: string
    alt?: string
    zIndexOffset?: number
  }

  export interface TooltipOptions {
    direction?: 'right' | 'left' | 'top' | 'bottom' | 'center' | 'auto'
    offset?: [number, number]
    opacity?: number
    sticky?: boolean
    interactive?: boolean
    className?: string
  }

  export interface CircleOptions {
    radius?: number
    color?: string
    weight?: number
    opacity?: number
    fillColor?: string
    fillOpacity?: number
    dashArray?: string
  }

  export interface PolylineOptions {
    color?: string
    weight?: number
    opacity?: number
    fillColor?: string
    fillOpacity?: number
    dashArray?: string
  }

  export interface Layer {
    addTo(map: Map | LayerGroup): this
    remove(): this
  }

  export interface LayerGroup extends Layer {
    clearLayers(): this
    addLayer(layer: Layer): this
  }

  export interface TileLayer extends Layer {}

  export interface DivIcon {}

  export interface Marker extends Layer {
    on(event: string, fn: () => void): this
    bindTooltip(content: string | HTMLElement, options?: TooltipOptions): this
    openTooltip(): this
    closeTooltip(): this
    setZIndexOffset(offset: number): this
  }

  export interface Circle extends Layer {}
  export interface Polygon extends Layer {}

  export interface LatLngBounds {
    isValid(): boolean
  }

  export interface Point {
    x: number
    y: number
  }

  export interface Map {
    setView(center: LatLngExpression, zoom?: number, options?: { animate?: boolean }): this
    flyTo(center: LatLngExpression, zoom?: number, options?: { duration?: number }): this
    fitBounds(bounds: LatLngBounds | LatLngTuple[], options?: { padding?: [number, number]; maxZoom?: number }): this
    zoomIn(): this
    zoomOut(): this
    getZoom(): number
    getCenter(): { lat: number; lng: number }
    getSize(): Point
    latLngToContainerPoint(latlng: LatLngExpression): Point
    removeLayer(layer: Layer): this
    on(event: string, fn: () => void): this
    invalidateSize(): this
    remove(): void
  }

  export function map(element: HTMLElement, options?: MapOptions): Map
  export function tileLayer(urlTemplate: string, options?: TileLayerOptions): TileLayer
  export function layerGroup(): LayerGroup
  export function divIcon(options?: DivIconOptions): DivIcon
  export function marker(latlng: LatLngExpression, options?: MarkerOptions): Marker
  export function circle(latlng: LatLngExpression, options?: CircleOptions): Circle
  export function polygon(latlngs: LatLngExpression[], options?: PolylineOptions): Polygon
  export function latLngBounds(latlngs: LatLngExpression[]): LatLngBounds
}

