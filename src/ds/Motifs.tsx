import type { ReactNode } from 'react'

/**
 * The five heritage motifs, drawn as hairlines (0.75px).
 * One motif per page, in open space, never behind running text.
 */
type MotifProps = { className?: string; title?: string }

function Frame({ children, viewBox, className, title }: MotifProps & { children: ReactNode; viewBox: string }) {
  // vector-effect is not inherited, so it is applied to every descendant to keep the hairline at 0.75px at any size.
  return (
    <svg
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth={0.75}
      className={['**:[vector-effect:non-scaling-stroke]', className].filter(Boolean).join(' ')}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  )
}

/** Vastu grid: the 9 x 9 pada grid used to lay out temples and towns. */
export function VastuMotif(props: MotifProps) {
  const lines = Array.from({ length: 10 }, (_, i) => i * 10)
  return (
    <Frame viewBox="-1 -1 92 92" {...props}>
      {lines.map((v) => (
        <g key={v}>
          <line x1={v} y1={0} x2={v} y2={90} />
          <line x1={0} y1={v} x2={90} y2={v} />
        </g>
      ))}
      <rect x={30} y={30} width={30} height={30} strokeWidth={1.25} />
      <line x1={0} y1={0} x2={90} y2={90} />
      <line x1={90} y1={0} x2={0} y2={90} />
    </Frame>
  )
}

/** Kolam: a continuous line looped around a grid of dots. */
export function KolamMotif(props: MotifProps) {
  const dots: [number, number][] = []
  for (let x = 0; x < 12; x++) for (let y = 0; y < 2; y++) dots.push([10 + x * 20, 10 + y * 20])
  let d = 'M0 20'
  for (let x = 0; x < 12; x++) {
    const cx = 10 + x * 20
    d += ` C${cx - 6} ${x % 2 ? 36 : 4} ${cx + 6} ${x % 2 ? 36 : 4} ${cx + 10} 20`
  }
  let d2 = 'M0 20'
  for (let x = 0; x < 12; x++) {
    const cx = 10 + x * 20
    d2 += ` C${cx - 6} ${x % 2 ? 4 : 36} ${cx + 6} ${x % 2 ? 4 : 36} ${cx + 10} 20`
  }
  return (
    <Frame viewBox="0 0 240 40" {...props}>
      {dots.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x - 0.9} y={y - 0.9} width={1.8} height={1.8} fill="currentColor" stroke="none" />
      ))}
      <path d={d} />
      <path d={d2} />
    </Frame>
  )
}

/** Jaali: the pierced stone screen, one pattern repeated. */
export function JaaliMotif(props: MotifProps) {
  const cells: ReactNode[] = []
  for (let r = 0; r < 5; r++)
    for (let c = 0; c < 5; c++) {
      const x = c * 18
      const y = r * 18
      cells.push(
        <g key={`${r}-${c}`}>
          <path d={`M${x + 9} ${y} L${x + 18} ${y + 9} L${x + 9} ${y + 18} L${x} ${y + 9} Z`} />
          <circle cx={x + 9} cy={y + 9} r={3.2} />
        </g>,
      )
    }
  return (
    <Frame viewBox="-1 -1 92 92" {...props}>
      <rect x={0} y={0} width={90} height={90} />
      {cells}
    </Frame>
  )
}

/** Baoli: the stepwell in section, steps down to water. */
export function BaoliMotif({ coloured, ...props }: MotifProps & { coloured?: boolean }) {
  const steps = 6
  const bands = ['#d1d8da', '#9bb3cc', '#6f87a6', '#52769a', '#2f4e6d', '#1f3044']
  return (
    <Frame viewBox="-1 -1 122 74" {...props}>
      {Array.from({ length: steps }, (_, i) => {
        const inset = i * 9
        const y = i * 12
        return (
          <g key={i}>
            {coloured ? (
              <rect x={inset} y={y} width={120 - inset * 2} height={12} fill={bands[i]} stroke="none" />
            ) : null}
            <path d={`M${inset} ${y} V${y + 12} H${120 - inset} V${y}`} />
          </g>
        )
      })}
      <line x1={0} y1={0} x2={120} y2={0} />
      <path d="M50 70 q5 -2 10 0 t10 0" />
    </Frame>
  )
}

/** Stambha: the temple pillar, square to octagon to round. */
export function StambhaMotif(props: MotifProps) {
  return (
    <Frame viewBox="-1 -1 42 122" {...props}>
      <rect x={0} y={108} width={40} height={12} />
      <rect x={6} y={74} width={28} height={34} />
      <path d="M6 74 L10 70 H30 L34 74" />
      <path d="M10 70 V42 M30 70 V42 M15 70 V42 M25 70 V42" />
      <path d="M10 42 L14 38 H26 L30 42" />
      <path d="M14 38 C14 26 26 26 26 38" />
      <path d="M14 38 V14 M26 38 V14 M20 38 V14" />
      <rect x={4} y={8} width={32} height={6} />
      <rect x={0} y={0} width={40} height={8} />
    </Frame>
  )
}
