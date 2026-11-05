import type { SVGProps } from 'react'

/**
 * Functional UI glyphs. The brand has no icon set: these exist only for
 * interface affordances (open, close, confirm, move) and never decorate.
 * Drawn as 1.5px square-capped strokes on a 16px grid.
 */
const paths = {
  'chevron-down': 'M4 6l4 4 4-4',
  'chevron-up': 'M4 10l4-4 4 4',
  'chevron-right': 'M6 4l4 4-4 4',
  'chevron-left': 'M10 4L6 8l4 4',
  check: 'M3.5 8.5l3 3 6-7',
  minus: 'M4 8h8',
  plus: 'M8 3.5v9M3.5 8h9',
  close: 'M4 4l8 8M12 4l-8 8',
  'arrow-right': 'M3 8h10M9 4l4 4-4 4',
  'arrow-left': 'M13 8H3M7 4L3 8l4 4',
  search: 'M7 12a5 5 0 100-10 5 5 0 000 10zM10.6 10.6L14 14',
  more: 'M3.5 8h.01M8 8h.01M12.5 8h.01',
  calendar: 'M2.5 4h11v9.5h-11zM2.5 7h11M5.5 2.5v3M10.5 2.5v3',
  download: 'M8 2.5v8M4.5 7L8 10.5 11.5 7M3 13.5h10',
} as const

export type GlyphName = keyof typeof paths

type GlyphProps = { name: GlyphName; size?: number } & Omit<SVGProps<SVGSVGElement>, 'name'>

export function Glyph({ name, size = 16, className, ...rest }: GlyphProps) {
  const isDots = name === 'more'
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={isDots ? 2.2 : 1.5}
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      className={className}
      {...rest}
    >
      <path d={paths[name]} />
    </svg>
  )
}

export const glyphNames = Object.keys(paths) as GlyphName[]

/** The brand bullet: a 6px filled square in a stage or case colour. */
export function Square({ className = 'bg-slate', size = 'size-1.5' }: { className?: string; size?: string }) {
  return <span aria-hidden="true" className={`inline-block shrink-0 ${size} ${className}`} />
}
