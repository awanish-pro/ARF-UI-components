import { useMemo, useState } from 'react'
import {
  BarChart,
  Button,
  ButtonGroup,
  ChartFrame,
  CompositionBar,
  cx,
  DonutChart,
  Funnel,
  Gauge,
  Heatmap,
  LineChart,
  ScatterPlot,
  Slider,
  Sparkline,
  Tag,
  TileMap,
  Timeline,
  Toggle,
  type ScaleTone,
} from '@/ds'
import { Rules, Section, Specimen } from './Doc'

const G = 'Data visualisation'
const days = Array.from({ length: 14 }, (_, i) => `${String(i + 1).padStart(2, '0')} Jun`)
const filed = [142, 158, 151, 176, 168, 149, 131, 162, 171, 166, 183, 177, 154, 139]
const closed = [118, 131, 139, 150, 152, 141, 128, 140, 156, 158, 166, 170, 151, 137]
const reopened = [8, 11, 9, 14, 12, 9, 7, 10, 12, 11, 13, 9, 8, 7]

function seeded(n: number, s = 1) {
  return Array.from({ length: n }, (_, i) => Math.abs(Math.sin((i + 1) * 12.9898 * s) * 43758.5453) % 1)
}

export function ChartPrinciples() {
  return (
    <Section
      id="charts-rules"
      group={G}
      title="Chart principles"
      headline="Drawn, not illustrated, and"
      accent="always sourced."
      intro="Charts follow the blueprint: flat, square-ended, on 1px rules. Series run slate, then rose, then sage. Every chart sits in a frame with a reference code and names its source. Data draws in once, when it enters view."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Specimen name="Do" code="VIZ-DO">
          <Rules
            title="Do"
            items={[
              'Use the series order: slate, rose, sage, then ink. Put the word in a legend or the tooltip.',
              'Mark targets with a dashed accent line and the word TARGET. Mark estimates in the frame header.',
              'Use 6px squares for data points and nodes, never circles.',
              'Prefer a timeline to a bar chart for dated events. Seven labelled moments at most.',
              'State the source in the frame footer, every time.',
            ]}
          />
        </Specimen>
        <Specimen name="Do not" code="VIZ-DONT">
          <Rules
            title="Do not"
            items={[
              'No 3D, no shadows, no rounded bar ends, no gradients inside bars.',
              'No pie charts with more than six slices. Use a bar list instead.',
              'No dual y-axes. Split into two charts.',
              'No colour as the only key: legends and tooltips always carry the label.',
              'No transparency or blend modes in exported files.',
            ]}
          />
        </Specimen>
      </div>
    </Section>
  )
}

export function LineChartSection() {
  const [show, setShow] = useState({ filed: true, closed: true, reopened: false })
  const [area, setArea] = useState(true)
  const [target, setTarget] = useState(true)
  const series = [
    show.filed && { name: 'Filed', data: filed, tone: 'slate' as const },
    show.closed && { name: 'Closed', data: closed, tone: 'rose' as const },
    show.reopened && { name: 'Reopened', data: reopened, tone: 'sage' as const },
  ].filter(Boolean) as { name: string; data: number[]; tone: 'slate' | 'rose' | 'sage' }[]
  return (
    <Section id="linechart" group={G} title="Line chart" headline="Change over time, with" accent="the target in view." intro="Lines are 2px with mitred joins. Hover shows a crosshair, square markers and an ink tooltip with every series. The first series can carry a solid tint area.">
      <ChartFrame
        label="Grievances filed and closed"
        code="VIZ-LINE"
        title="Kanpur, first two weeks of June"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {(['filed', 'closed', 'reopened'] as const).map((k) => (
              <Tag key={k} selected={show[k]} colour={k === 'filed' ? 'bg-slate' : k === 'closed' ? 'bg-rose' : 'bg-sage-deep'} onClick={() => setShow({ ...show, [k]: !show[k] })}>
                {k[0].toUpperCase() + k.slice(1)}
              </Tag>
            ))}
          </div>
        }
        legend={[...series.map((s) => ({ label: s.name, tone: s.tone })), ...(target ? [{ label: 'Target closures', tone: 'rose' as const, dashed: true }] : [])]}
        source="PGR ledger, Kanpur, June 2026"
      >
        {series.length ? <LineChart labels={days} series={series} area={area} target={target ? { value: 160, label: 'Target 160' } : undefined} /> : <p className="py-20 text-center type-body-s text-text-muted">Choose at least one series.</p>}
        <div className="mt-4 grid max-w-md gap-3 border-t border-border pt-4 sm:grid-cols-2">
          <Toggle size="sm" label="Area under first series" checked={area} onChange={setArea} />
          <Toggle size="sm" label="Target line" checked={target} onChange={setTarget} />
        </div>
      </ChartFrame>
    </Section>
  )
}

export function BarChartSection() {
  const [mode, setMode] = useState<'grouped' | 'stacked'>('grouped')
  const zones = ['Zone 1', 'Zone 2', 'Zone 3', 'Zone 4', 'Zone 5', 'Zone 6']
  return (
    <Section id="barchart" group={G} title="Bar chart" headline="Comparisons, flat and" accent="square-ended." intro="Bars grow from the baseline in a short stagger. Grouped bars compare series side by side; stacked bars show a total and its parts with a 1px paper gap. Hover a column for exact values.">
      <div className="grid gap-6 xl:grid-cols-2">
        <ChartFrame
          label="On time and breached by zone"
          code="VIZ-BAR"
          actions={<ButtonGroup label="Layout" size="sm" value={mode} onChange={setMode} options={[{ value: 'grouped', label: 'Grouped' }, { value: 'stacked', label: 'Stacked' }]} />}
          legend={[{ label: 'On time', tone: 'slate' }, { label: 'Breached', tone: 'rose' }]}
          source="PGR ledger, May 2026"
        >
          <BarChart labels={zones} stacked={mode === 'stacked'} series={[{ name: 'On time', data: [412, 356, 298, 377, 264, 318], tone: 'slate' }, { name: 'Breached', data: [38, 92, 41, 33, 57, 29], tone: 'rose' }]} />
        </ChartFrame>
        <ChartFrame label="Monthly collection" code="VIZ-BAR-T" legend={[{ label: 'Collected', tone: 'sage' }, { label: 'Target', tone: 'rose', dashed: true }]} source="Treasury, Mohali, FY 2026">
          <BarChart labels={['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']} series={[{ name: 'Collected', data: [1.8, 2.4, 4.1, 2.2, 2.6, 2.9].map((v) => v * 1e6), tone: 'sage' }]} format={(n) => `₹${(n / 1e5).toFixed(0)} L`} target={{ value: 2.6e6, label: 'Target' }} highlightLast />
        </ChartFrame>
      </div>
    </Section>
  )
}

export function DonutSection() {
  return (
    <Section id="donut" group={G} title="Donut chart" headline="Parts of one whole," accent="six at most." intro="Segments sweep in clockwise from twelve o'clock with butt ends and a 2px gap. Hovering a segment or its legend row names it in the centre with its share.">
      <div className="grid gap-6 xl:grid-cols-2">
        <ChartFrame label="Grievances by category" code="VIZ-DONUT" source="PGR ledger, May 2026">
          <DonutChart
            centreLabel="Filed"
            segments={[
              { label: 'Garbage', value: 1840, tone: 'slate' },
              { label: 'Streetlight', value: 1120, tone: 'rose' },
              { label: 'Drainage', value: 860, tone: 'sage' },
              { label: 'Water supply', value: 640, tone: 'slate-light' },
              { label: 'Roads', value: 410, tone: 'rose-light' },
              { label: 'Encroachment', value: 290, tone: 'muted' },
            ]}
          />
        </ChartFrame>
        <ChartFrame label="Detections by type" code="VIZ-DONUT-2" source="VMS detection service, today">
          <DonutChart centreLabel="Detections" size={168} thickness={18} segments={[{ label: 'Stalled traffic', value: 812, tone: 'slate' }, { label: 'Garbage dumping', value: 534, tone: 'rose' }, { label: 'Waterlogging', value: 221, tone: 'sage' }]} />
        </ChartFrame>
      </div>
    </Section>
  )
}

export function FunnelSection() {
  const [tone, setTone] = useState<'slate' | 'rose' | 'sage'>('slate')
  return (
    <Section id="funnel" group={G} title="Funnel" headline="Where work drops out of" accent="the process." intro="Stages are centred square bars that step down a single hue. Between stages the funnel states what carried forward and what dropped, in words.">
      <ChartFrame
        label="Grievance lifecycle"
        code="VIZ-FUNNEL"
        actions={<ButtonGroup label="Hue" size="sm" value={tone} onChange={setTone} options={[{ value: 'slate', label: 'Slate' }, { value: 'rose', label: 'Rose' }, { value: 'sage', label: 'Sage' }]} />}
        source="PGR workflow events, May 2026"
      >
        <Funnel tone={tone} stages={[{ label: 'Filed', value: 5160, caption: 'App, call, WhatsApp' }, { label: 'Assigned', value: 4980 }, { label: 'In progress', value: 4510 }, { label: 'Resolved', value: 4120, caption: 'Closed with proof' }, { label: 'Citizen confirmed', value: 3290 }]} />
      </ChartFrame>
    </Section>
  )
}

export function HeatmapSection() {
  const [tone, setTone] = useState<ScaleTone>('slate')
  const rows = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const cols = Array.from({ length: 24 }, (_, h) => `${String(h).padStart(2, '0')}:00`)
  const values = useMemo(() => {
    const r = seeded(7 * 24, 3)
    return rows.map((_, d) => cols.map((__, h) => Math.round((Math.max(0, Math.sin(((h - 5) / 24) * Math.PI * 2)) * 30 + (h >= 8 && h <= 11 ? 18 : 0) + r[d * 24 + h] * 8) * (d >= 5 ? 0.7 : 1))))
  }, [])
  return (
    <Section id="heatmap" group={G} title="Heatmap" headline="Patterns across the week," accent="read at a glance." intro="Five solid steps of one hue. A readout line above the grid names the peak, and names any cell under the pointer. Cells fade in along the diagonal.">
      <ChartFrame label="When complaints arrive" code="VIZ-HEAT" actions={<ButtonGroup label="Scale" size="sm" value={tone} onChange={setTone} options={[{ value: 'slate', label: 'Slate' }, { value: 'rose', label: 'Rose' }, { value: 'sage', label: 'Sage' }]} />} source="PGR ledger, timestamps, May 2026">
        <Heatmap rows={rows} cols={cols} values={values} unit="grievances" tone={tone} />
      </ChartFrame>
    </Section>
  )
}

export function GaugeSection() {
  const [v, setV] = useState(82)
  const spark = [18, 22, 19, 26, 24, 31, 29, 34, 33, 38]
  return (
    <Section id="gauge" group={G} title="Gauge and sparkline" headline="One number against" accent="its target." intro="Gauges show a single share against a target tick in the accent. Sparklines show the shape of a trend inline, ending on a square marker.">
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <ChartFrame label="SLA compliance" code="VIZ-GAUGE" source="SLA report, live">
          <div className="flex flex-col items-center gap-6">
            <Gauge value={v} target={85} label="Closed within 48 h" tone={v < 85 ? 'rose' : 'slate'} />
            <div className="w-full max-w-xs">
              <Slider label="Value" value={v} onChange={setV} min={40} max={100} format={(n) => `${n}%`} />
            </div>
          </div>
        </ChartFrame>
        <ChartFrame label="Sparklines in context" code="VIZ-SPARK" source="Module ledgers, last 10 days">
          <ul className="flex flex-col">
            {[
              { k: 'Grievances closed', v: '1,204', t: 'slate' as const, d: spark },
              { k: 'Camera uptime', v: '97.6%', t: 'rose' as const, d: [99, 98.8, 99.1, 98.6, 98.4, 98.9, 97.9, 98.1, 97.7, 97.6] },
              { k: 'Tax receipts', v: '₹18.6 L', t: 'sage' as const, d: [12, 14, 13, 15, 18, 16, 17, 19, 18, 21] },
            ].map((r) => (
              <li key={r.k} className="grid grid-cols-[1fr_auto_auto] items-center gap-6 border-b border-border py-3 last:border-b-0">
                <span className="type-body-s text-text">{r.k}</span>
                <Sparkline data={r.d} tone={r.t} />
                <span className="w-20 text-right font-display text-[18px] font-semibold text-text">{r.v}</span>
              </li>
            ))}
          </ul>
        </ChartFrame>
      </div>
    </Section>
  )
}

export function ScatterSection() {
  const points = useMemo(() => {
    const r = seeded(120, 7)
    return Array.from({ length: 50 }, (_, i) => {
      const x = Math.round(60 + r[i] * 420)
      const flag = r[i + 50] < 0.2
      return { x, y: Math.round(x * (flag ? 1.25 + r[i + 70] * 0.5 : 0.92 + r[i + 70] * 0.14)), label: `MOH-PID-${118000 + i * 211}`, flag }
    })
  }, [])
  return (
    <Section id="scatter" group={G} title="Scatter plot" headline="Outliers worth" accent="a site visit." intro="Each property is a 6px square. The dashed 1 : 1 line marks where declared and surveyed area agree. Points more than 20% above it turn rose and carry the gap in their tooltip.">
      <ChartFrame label="Declared and surveyed area" code="VIZ-SCATTER" status="Estimate" legend={[{ label: 'Within 20%', tone: 'slate' }, { label: 'Over 20% above declared', tone: 'rose' }]} source="Drone survey and self-assessment, Mohali">
        <ScatterPlot points={points} xLabel="Declared m²" yLabel="Surveyed m²" diagonal flagLabel="Over declared" />
      </ChartFrame>
    </Section>
  )
}

export function TileMapSection() {
  const [sel, setSel] = useState<string | null>('w12')
  const layout: [number, number][] = [[0, 2], [0, 3], [0, 4], [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6], [3, 0], [3, 1], [3, 2], [3, 3], [3, 4], [3, 5], [3, 6], [3, 7], [4, 1], [4, 2], [4, 3], [4, 4], [4, 5], [4, 6], [5, 2], [5, 3], [5, 5]]
  const r = seeded(32, 11)
  const tiles = layout.map(([row, col], i) => ({ id: `w${i + 1}`, label: String(i + 1), row, col, value: Math.round(10 + r[i] * 70) }))
  return (
    <Section id="tilemap" group={G} title="Ward tile map" headline="Every ward the same size, so" accent="none hides." intro="A schematic grid with one square per ward, arranged roughly as the city sits. It is not a geographic map, and its caption says so. Select a ward to filter a dashboard.">
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <ChartFrame label="Open grievances by ward" code="VIZ-TILE" source="PGR ledger · tiles not to scale">
          <TileMap tiles={tiles} unit="open grievances" selected={sel} onSelect={(id) => setSel(sel === id ? null : id)} />
        </ChartFrame>
        <Specimen name="Selection" code="STATE">
          <p className="type-body-s text-text">{sel ? <>Ward <span className="font-mono">{sel.slice(1)}</span> selected. In the dashboard this filters every chart.</> : 'No ward selected.'}</p>
          {sel ? (
            <Button size="sm" variant="link" className="mt-2" onClick={() => setSel(null)}>
              Clear selection
            </Button>
          ) : null}
        </Specimen>
      </div>
    </Section>
  )
}

export function TimelineSection() {
  const [run, setRun] = useState(0)
  return (
    <Section id="timeline" group={G} title="Timeline" headline="Dated events on" accent="one axis." intro="The brand's preferred form for dated events: one axis, a square per event, labels alternating above and below. Seven labelled moments at most.">
      <ChartFrame label="Two years, from selection to deployment" code="VIZ-TIME" actions={<Button size="sm" variant="secondary" onClick={() => setRun((r) => r + 1)}>Replay</Button>} legend={[{ label: 'PGR', tone: 'slate' }, { label: 'VMS', tone: 'rose' }, { label: 'Property tax', tone: 'sage' }]} source="Programme office, 2024 to 2026">
        <div className="overflow-x-auto">
          <div key={run} className="min-w-[760px] px-10">
            <Timeline
              events={[
                { date: 'Mar 2024', title: 'Selected as AI CoE', position: 0.04, tone: 'slate' },
                { date: 'Sep 2024', title: 'PGR pilot, 4 zones', position: 0.2, tone: 'slate' },
                { date: 'Jan 2025', title: 'First 200 cameras', position: 0.36, tone: 'rose' },
                { date: 'Jun 2025', title: 'PGR live city-wide', position: 0.52, tone: 'slate' },
                { date: 'Nov 2025', title: 'Mohali drone survey', position: 0.68, tone: 'sage' },
                { date: 'Mar 2026', title: '1,240 cameras online', position: 0.83, tone: 'rose' },
                { date: 'Oct 2026', title: 'Tax pilot, 20 wards', position: 0.97, tone: 'sage' },
              ]}
            />
          </div>
        </div>
      </ChartFrame>
    </Section>
  )
}

export function CompositionSection() {
  return (
    <Section id="composition" group={G} title="Composition bar" headline="A whole in" accent="one line." intro="A single square-ended bar split into parts with 1px gaps. Use it where a donut would be too large: in cards, drawers and table summaries.">
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartFrame label="Property use" code="VIZ-COMP" source="Property register, Mohali">
          <CompositionBar format={(n) => `${n}%`} segments={[{ label: 'Residential', value: 64, tone: 'slate' }, { label: 'Commercial', value: 19, tone: 'rose' }, { label: 'Mixed use', value: 9, tone: 'sage' }, { label: 'Institutional', value: 4, tone: 'slate-light' }, { label: 'Vacant plot', value: 4, tone: 'muted' }]} />
        </ChartFrame>
        <ChartFrame label="Grievance channels" code="VIZ-COMP-2" source="PGR ledger, May 2026">
          <CompositionBar segments={[{ label: 'WhatsApp', value: 2140, tone: 'slate' }, { label: 'Call centre', value: 1610, tone: 'rose' }, { label: 'Mobile app', value: 980, tone: 'sage' }, { label: 'Walk-in', value: 430, tone: 'muted' }]} />
        </ChartFrame>
      </div>
      <p className={cx('type-caption text-text-muted')}>All charts in this section use sample data.</p>
    </Section>
  )
}

export function Visualisation() {
  return (
    <>
      <ChartPrinciples />
      <LineChartSection />
      <BarChartSection />
      <DonutSection />
      <FunnelSection />
      <HeatmapSection />
      <GaugeSection />
      <ScatterSection />
      <TileMapSection />
      <TimelineSection />
      <CompositionSection />
    </>
  )
}
