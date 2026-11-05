import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  ActivityFeed,
  Alert,
  AnimatedNumber,
  Avatar,
  Badge,
  BarChart,
  Breadcrumbs,
  Button,
  ButtonGroup,
  ChartFrame,
  CommandMenu,
  CompositionBar,
  CountBadge,
  cx,
  DataTable,
  DescriptionList,
  DonutChart,
  Drawer,
  Dropdown,
  Funnel,
  Gauge,
  Heatmap,
  LineChart,
  LiveIndicator,
  MetricCard,
  NotificationItem,
  ProductLockup,
  ScatterPlot,
  SegmentedProgress,
  Select,
  SideNav,
  Skeleton,
  Stepper,
  TabPanel,
  Tabs,
  TileMap,
  Timeline,
  useDismiss,
  useToast,
  type Column,
  type Command,
  type NavSection,
} from '@/ds'
import { buildData, cities, inr, lakh, wardsFor, type Camera, type City, type DashData, type Grievance, type Page, type Period, type Property } from './data'

/* ---------------- Shared bits ---------------- */

const pageMeta: Record<Page, { label: string; code: string; title: string; accent: string }> = {
  overview: { label: 'City overview', code: 'ALL', title: 'Today across grievances, video and', accent: 'property tax.' },
  pgr: { label: 'Grievances', code: 'PGR', title: 'Every complaint routed, tracked and', accent: 'closed with proof.' },
  vms: { label: 'Video', code: 'VMS', title: 'Cameras that report what they see, with', accent: 'a decision trail.' },
  pt: { label: 'Property tax', code: 'PT', title: 'Property records matched to', accent: 'the ground.' },
}

const statusTone: Record<Grievance['status'], 'neutral' | 'info' | 'caution' | 'critical' | 'success'> = {
  Open: 'neutral',
  Assigned: 'info',
  'In progress': 'info',
  Escalated: 'critical',
  Closed: 'success',
}

function Grid({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx('grid gap-4', className)}>{children}</div>
}

function SectionHead({ label, title, action }: { label: string; title: string; action?: ReactNode }) {
  return (
    <div className="mt-4 flex flex-wrap items-end justify-between gap-3 border-b border-rule pb-2">
      <div className="flex items-baseline gap-3">
        <span className="type-label text-text-label">{label}</span>
        <span className="type-heading text-text">{title}</span>
      </div>
      {action}
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div role="status" aria-label="Refreshing dashboard" className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col gap-4 border border-border p-4">
            <Skeleton className="h-2.5 w-24" />
            <Skeleton className="h-8 w-28" />
            <Skeleton className="h-2.5 w-2/3" />
          </div>
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        <div className="flex flex-col gap-3 border border-border p-5 xl:col-span-2">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-56 w-full" />
        </div>
        <div className="flex flex-col items-center gap-4 border border-border p-5">
          <Skeleton className="size-44 rounded-round" />
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>
    </div>
  )
}

/* ---------------- Tables ---------------- */

function grievanceColumns(): Column<Grievance>[] {
  return [
    { key: 'id', header: 'Number', mono: true, sortable: true },
    { key: 'category', header: 'Category', sortable: true },
    { key: 'ward', header: 'Ward', sortable: true },
    { key: 'officer', header: 'Officer', render: (g) => <span className="flex items-center gap-2"><Avatar name={g.officer} size="xs" />{g.officer}</span> },
    {
      key: 'slaLeft',
      header: 'SLA',
      align: 'right',
      sortable: true,
      render: (g) =>
        g.status === 'Closed' ? (
          <span className="type-caption text-text-muted">Met</span>
        ) : g.slaLeft < 0 ? (
          <span className="font-mono text-[12px] text-critical">{Math.abs(g.slaLeft)} h over</span>
        ) : (
          <span className={cx('font-mono text-[12px]', g.slaLeft < 8 ? 'text-caution' : 'text-text')}>{g.slaLeft} h left</span>
        ),
    },
    { key: 'status', header: 'Status', sortable: true, render: (g) => <Badge tone={statusTone[g.status]}>{g.status}</Badge> },
  ]
}

const cameraColumns: Column<Camera>[] = [
  { key: 'id', header: 'Camera', mono: true, sortable: true },
  { key: 'location', header: 'Location', sortable: true },
  { key: 'uptime', header: 'Uptime 30 d', align: 'right', sortable: true, render: (c) => <span className="font-mono text-[12px]">{c.uptime}%</span> },
  { key: 'detections', header: 'Detections today', align: 'right', sortable: true, mono: true },
  { key: 'lastFrame', header: 'Last frame', align: 'right' },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    render: (c) => <Badge variant="soft" tone={c.status === 'Online' ? 'success' : c.status === 'Degraded' ? 'caution' : 'critical'}>{c.status}</Badge>,
  },
]

const propertyColumns: Column<Property>[] = [
  { key: 'pid', header: 'Property ID', mono: true, sortable: true },
  { key: 'owner', header: 'Owner', sortable: true },
  { key: 'sector', header: 'Sector', sortable: true },
  { key: 'use', header: 'Use', sortable: true },
  { key: 'years', header: 'Years due', align: 'right', sortable: true, mono: true },
  { key: 'dues', header: 'Dues', align: 'right', sortable: true, render: (p) => <span className="font-mono text-[12px]">{inr(p.dues)}</span> },
  { key: 'matched', header: 'Ground check', render: (p) => <Badge tone={p.matched ? 'success' : 'caution'}>{p.matched ? 'Matched' : 'Mismatch'}</Badge> },
]

/* ---------------- Camera tile ---------------- */

function CameraTile({ cam, index }: { cam: Camera; index: number }) {
  const offline = cam.status === 'Offline'
  const boxes = [
    { l: '18%', t: '38%', w: '22%', h: '30%', tag: 'Vehicle · 0.91' },
    { l: '52%', t: '30%', w: '16%', h: '42%', tag: 'Garbage · 0.84' },
    { l: '34%', t: '52%', w: '28%', h: '22%', tag: 'Water · 0.77' },
  ]
  const b = boxes[index % boxes.length]
  return (
    <div className="flex flex-col border border-border bg-surface">
      <div className={cx('grain relative aspect-video overflow-hidden', offline ? 'bg-grad-ink' : 'bg-grad-blueprint')}>
        {offline ? (
          <div className="theme-ink absolute inset-0 flex flex-col items-center justify-center gap-1">
            <span className="type-label text-rose-light">No signal</span>
            <span className="type-caption text-text-muted">Last frame {cam.lastFrame}</span>
          </div>
        ) : (
          <>
            <svg className="absolute inset-0 size-full text-grid-major" preserveAspectRatio="none" viewBox="0 0 160 90" aria-hidden="true">
              <path d="M0 70 L60 50 L160 58 M0 82 L70 56 L160 70 M60 50 L62 0 M100 54 L104 0" stroke="currentColor" strokeWidth="0.6" fill="none" />
            </svg>
            <span className="absolute border border-white animate-fade-in" style={{ left: b.l, top: b.t, width: b.w, height: b.h, animationDelay: `${300 + index * 120}ms` }}>
              <span className="absolute -top-5 left-0 bg-paper px-1.5 font-mono text-[10px] whitespace-nowrap text-ink">{b.tag}</span>
            </span>
            <span className="pointer-events-none absolute inset-x-0 top-0 h-px animate-scan bg-slate-light" style={{ ['--scan-distance' as string]: '180px', animationDelay: `${index * 0.6}s` }} />
          </>
        )}
        <span className="theme-ink absolute top-2 left-2 flex items-center gap-2 bg-ink px-2 py-0.5">
          <LiveIndicator paused={offline} label={cam.status === 'Degraded' ? 'Degraded' : 'Live'} />
        </span>
        <span className="absolute right-2 bottom-2 bg-ink px-1.5 font-mono text-[10px] text-paper">{cam.id}</span>
      </div>
      <div className="flex items-center justify-between gap-2 px-3 py-2">
        <span className="truncate type-body-s text-text">{cam.location}</span>
        <span className="font-mono text-[11px] text-text-muted">{cam.detections} today</span>
      </div>
    </div>
  )
}

/* ---------------- Pages ---------------- */

type PageProps = {
  d: DashData
  city: City
  period: Period
  ward: string | null
  setWard: (w: string | null) => void
  go: (p: Page) => void
  openGrievance: (g: Grievance) => void
  openCamera: (c: Camera) => void
  openProperty: (p: Property) => void
}

const periodWord: Record<Period, string> = { '7d': '7 days', '30d': '30 days', '90d': '90 days' }

function Overview({ d, period, ward, setWard, go, openGrievance }: PageProps) {
  const [showAlert, setShowAlert] = useState(true)
  const escalated = d.pgr.grievances.filter((g) => g.status === 'Escalated')
  return (
    <div className="flex flex-col gap-4">
      {showAlert ? (
        <div className="animate-fade-up">
          <Alert
            tone="caution"
            code="PGR · SLA WATCH"
            title={`${escalated.length + 29} grievances will breach SLA in the next 6 hours.`}
            onDismiss={() => setShowAlert(false)}
            actions={
              <>
                <Button size="sm" onClick={() => go('pgr')}>
                  Review in Grievances
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setShowAlert(false)}>
                  Dismiss for today
                </Button>
              </>
            }
          >
            Most are garbage and drainage complaints in Zone 2.
          </Alert>
        </div>
      ) : null}

      <Grid className="sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Open grievances" code="PGR" value={<AnimatedNumber value={d.pgr.open} />} delta={`${Math.round(d.pgr.open * 0.04)} vs last period`} deltaDirection="down" goodWhen="down" status="Fewer open" series={d.series.open} barColour="bg-slate" source={`PGR ledger, ${periodWord[period]}`} />
        <MetricCard label="Closed within 48 h" code="PGR" value={<AnimatedNumber value={d.pgr.within48} />} unit="%" delta="4 pts vs last period" deltaDirection="up" goodWhen="up" status="Target 85%" series={d.series.within} barColour="bg-slate" source="PGR ledger, SLA report" />
        <MetricCard label="Cameras online" code="VMS" value={<AnimatedNumber value={d.vms.onlinePct} decimals={1} />} unit="%" delta={`${d.vms.offline} offline`} deltaDirection="down" goodWhen="up" status="Maintenance raised" series={d.series.cams} barColour="bg-rose" source="VMS health monitor, live" />
        <MetricCard label="Tax collected" code="PT" value={<AnimatedNumber value={d.pt.collected / 1e7} decimals={2} prefix="₹" />} unit="Cr" delta="12% vs last year" deltaDirection="up" goodWhen="up" status="Ahead of plan" series={d.series.coll} barColour="bg-sage-deep" source="Treasury, FY 2026 to date" />
      </Grid>

      <Grid className="xl:grid-cols-3">
        <ChartFrame
          className="xl:col-span-2"
          label="Grievances filed and closed"
          code="PGR-01"
          title={`${d.pgr.totalFiled.toLocaleString('en-IN')} filed in ${periodWord[period]}`}
          legend={[
            { label: 'Filed', tone: 'slate' },
            { label: 'Closed', tone: 'rose' },
          ]}
          source="PGR ledger"
        >
          <LineChart labels={d.labels} area height={340} series={[{ name: 'Filed', data: d.pgr.filed, tone: 'slate' }, { name: 'Closed', data: d.pgr.closed, tone: 'rose' }]} />
        </ChartFrame>
        <ChartFrame label="By category" code="PGR-02" source="PGR ledger">
          <DonutChart segments={d.pgr.byCategory} centreLabel="Filed" />
        </ChartFrame>
      </Grid>

      <Grid className="xl:grid-cols-2">
        <ChartFrame label="Lifecycle" code="PGR-03" title="From filed to citizen confirmed" source="PGR ledger, workflow events">
          <Funnel stages={d.pgr.funnel} />
        </ChartFrame>
        <ChartFrame label="When complaints arrive" code="PGR-04" title="By weekday and hour" source="PGR ledger, timestamps">
          <Heatmap rows={d.pgr.heatRows} cols={d.pgr.heatCols} values={d.pgr.heat} unit="grievances" />
        </ChartFrame>
      </Grid>

      <Grid className="lg:grid-cols-2 xl:grid-cols-3">
        <ChartFrame label="Open by ward" code="MAP-01" title="Schematic ward grid" source="PGR ledger · tiles not to scale">
          <TileMap tiles={d.pgr.tiles} unit="open grievances" selected={ward} onSelect={(id) => setWard(ward === id ? null : id)} />
        </ChartFrame>
        <ChartFrame label="Camera network" code="VMS-01" source="VMS health monitor">
          <div className="flex h-full flex-col items-center justify-center gap-4">
            <Gauge value={Math.round(d.vms.onlinePct)} target={98} label="Cameras online" tone="rose" />
            <div className="grid w-full grid-cols-2 border-t border-border pt-3 text-center">
              <span className="flex flex-col">
                <span className="font-display text-[22px] font-semibold text-text"><AnimatedNumber value={d.vms.online} /></span>
                <span className="type-caption text-text-muted">Reporting</span>
              </span>
              <span className="flex flex-col border-l border-border">
                <span className="font-display text-[22px] font-semibold text-critical"><AnimatedNumber value={d.vms.offline} /></span>
                <span className="type-caption text-text-muted">Offline</span>
              </span>
            </div>
          </div>
        </ChartFrame>
        <ChartFrame label="Collection against target" code="PT-01" legend={[{ label: 'Collected', tone: 'sage' }, { label: 'Monthly target', tone: 'rose', dashed: true }]} source="Treasury, FY 2026" className="lg:col-span-2 xl:col-span-1">
          <BarChart labels={d.pt.ptLabels} series={[{ name: 'Collected', data: d.pt.collection, tone: 'sage' }]} format={lakh} target={{ value: d.pt.target, label: 'Target' }} highlightLast height={232} />
        </ChartFrame>
      </Grid>

      <Grid className="xl:grid-cols-3">
        <div className="border border-border xl:col-span-2">
          <div className="flex h-8 items-center justify-between border-b border-border px-4">
            <span className="type-label text-text-label">Escalated grievances</span>
            <Button size="sm" variant="link" onClick={() => go('pgr')}>
              Open queue
            </Button>
          </div>
          <DataTable columns={grievanceColumns()} rows={escalated} rowKey={(g) => g.id} onRowClick={openGrievance} pageSize={5} caption="Escalated grievances" initialSort={{ key: 'slaLeft', dir: 'asc' }} />
        </div>
        <div className="flex flex-col border border-border">
          <div className="flex h-8 items-center justify-between border-b border-border px-4">
            <span className="type-label text-text-label">Activity</span>
            <LiveIndicator tone="success" />
          </div>
          <div className="p-4">
            <ActivityFeed items={d.activity} />
          </div>
        </div>
      </Grid>

      <ChartFrame label="This month" code="CAL-01" title="Deadlines, hearings and audits" legend={[{ label: 'PGR', tone: 'slate' }, { label: 'VMS', tone: 'rose' }, { label: 'Property tax', tone: 'sage' }]} source="Operations calendar">
        <div className="overflow-x-auto">
          <div className="min-w-[760px] px-10">
            <Timeline events={d.timeline} />
          </div>
        </div>
      </ChartFrame>
    </div>
  )
}

function PgrPage({ d, period, openGrievance }: PageProps) {
  const [tab, setTab] = useState<'open' | 'escalated' | 'closed'>('open')
  const { push } = useToast()
  const rows = d.pgr.grievances.filter((g) => (tab === 'escalated' ? g.status === 'Escalated' : tab === 'closed' ? g.status === 'Closed' : g.status !== 'Closed' && g.status !== 'Escalated'))
  const counts = {
    open: d.pgr.grievances.filter((g) => g.status !== 'Closed' && g.status !== 'Escalated').length,
    escalated: d.pgr.grievances.filter((g) => g.status === 'Escalated').length,
    closed: d.pgr.grievances.filter((g) => g.status === 'Closed').length,
  }
  return (
    <div className="flex flex-col gap-4">
      <Grid className="sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Open" code="PGR" value={<AnimatedNumber value={d.pgr.open} />} delta="4% vs last period" deltaDirection="down" goodWhen="down" status="Fewer open" series={d.series.open} source="PGR ledger" />
        <MetricCard label="Closed within 48 h" code="SLA" value={<AnimatedNumber value={d.pgr.within48} />} unit="%" delta="4 pts" deltaDirection="up" goodWhen="up" status="Target 85%" series={d.series.within} source="SLA report" />
        <MetricCard label="Average resolution" code="TIME" value={<AnimatedNumber value={d.pgr.avgHours} decimals={1} />} unit="hours" delta="2.1 h faster" deltaDirection="down" goodWhen="down" status="Median 22 h" source="Workflow events" />
        <MetricCard label="Citizen rating" code="CSAT" value={<AnimatedNumber value={d.pgr.rating} decimals={1} />} unit="of 5" delta="0.2 vs last period" deltaDirection="up" goodWhen="up" status="1,204 responses (sample)" source="SMS feedback survey" />
      </Grid>

      <div className="border border-border">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 pt-2">
          <Tabs
            label="Queue"
            value={tab}
            onChange={setTab}
            items={[
              { value: 'open', label: 'Open', count: counts.open },
              { value: 'escalated', label: 'Escalated', count: counts.escalated },
              { value: 'closed', label: 'Closed with proof', count: counts.closed },
            ]}
          />
          <span className="type-caption text-text-muted">Select rows for bulk actions. Click a row for detail.</span>
        </div>
        <TabPanel>
          <DataTable
            key={tab}
            columns={grievanceColumns()}
            rows={rows}
            rowKey={(g) => g.id}
            selectable
            onRowClick={openGrievance}
            pageSize={8}
            caption="Grievance queue"
            initialSort={{ key: 'slaLeft', dir: 'asc' }}
            bulkActions={(sel, clear) => (
              <>
                <Button size="sm" variant="secondary" onClick={() => { push({ tone: 'success', module: 'PGR', title: `${sel.length} grievances assigned to Ravi Shukla.` }); clear() }}>
                  Assign
                </Button>
                <Button size="sm" variant="secondary" onClick={() => { push({ tone: 'info', module: 'PGR', title: `Exported ${sel.length} rows as CSV.` }); clear() }}>
                  Export CSV
                </Button>
                <Button size="sm" variant="ghost" onClick={clear}>
                  Clear
                </Button>
              </>
            )}
          />
        </TabPanel>
      </div>

      <Grid className="xl:grid-cols-2">
        <ChartFrame label="On time and breached by zone" code="PGR-05" legend={[{ label: 'Closed on time', tone: 'slate' }, { label: 'Breached SLA', tone: 'rose' }]} source={`PGR ledger, ${periodWord[period]}`}>
          <BarChart labels={d.pgr.zones} stacked series={[{ name: 'Closed on time', data: d.pgr.zoneOnTime, tone: 'slate' }, { name: 'Breached SLA', data: d.pgr.zoneBreached, tone: 'rose' }]} />
        </ChartFrame>
        <ChartFrame label="Filed and closed" code="PGR-01" legend={[{ label: 'Filed', tone: 'slate' }, { label: 'Closed', tone: 'rose' }, { label: 'Target closures', tone: 'rose', dashed: true }]} source="PGR ledger">
          <LineChart labels={d.labels} series={[{ name: 'Filed', data: d.pgr.filed, tone: 'slate' }, { name: 'Closed', data: d.pgr.closed, tone: 'rose' }]} target={{ value: Math.round(Math.max(...d.pgr.filed) * 0.9), label: 'Target' }} />
        </ChartFrame>
      </Grid>
      <Grid className="xl:grid-cols-2">
        <ChartFrame label="Lifecycle" code="PGR-03" source="Workflow events">
          <Funnel stages={d.pgr.funnel} />
        </ChartFrame>
        <ChartFrame label="By category" code="PGR-02" source="PGR ledger">
          <DonutChart segments={d.pgr.byCategory} centreLabel="Filed" />
        </ChartFrame>
      </Grid>
    </div>
  )
}

function VmsPage({ d, openCamera }: PageProps) {
  const [filter, setFilter] = useState<'all' | 'issues'>('all')
  const cams = filter === 'issues' ? d.vms.cameras.filter((c) => c.status !== 'Online') : d.vms.cameras
  return (
    <div className="flex flex-col gap-4">
      <Grid className="sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Cameras online" code="VMS" value={<AnimatedNumber value={d.vms.online} />} unit={`of ${d.vms.cameraTotal.toLocaleString('en-IN')}`} delta={`${d.vms.offline} offline`} deltaDirection="down" goodWhen="up" status="Tickets raised" series={d.series.cams} barColour="bg-rose" source="Health monitor, live" />
        <MetricCard label="Detections today" code="AI" value={<AnimatedNumber value={d.vms.detectionsToday} />} delta="8% vs yesterday" deltaDirection="up" goodWhen="up" status="Model v3.2" source="Detection service" />
        <MetricCard label="Sent to PGR" code="PGR" value={<AnimatedNumber value={d.vms.sentToPgr} />} delta="18% of detections" deltaDirection="up" goodWhen="up" status="Auto-filed after review" source="PGR integration log" />
        <MetricCard label="Storage used" code="NVR" value={<AnimatedNumber value={d.vms.storage} />} unit="%" delta="3 pts this week" deltaDirection="up" goodWhen="down" status="30-day retention" source="Storage cluster" />
      </Grid>

      <SectionHead
        label="VMS · Wall"
        title="Live wall"
        action={
          <ButtonGroup label="Camera filter" size="sm" value={filter} onChange={setFilter} options={[{ value: 'all', label: 'All', count: d.vms.cameras.length }, { value: 'issues', label: 'Needs attention', count: d.vms.cameras.filter((c) => c.status !== 'Online').length }]} />
        }
      />
      <div key={filter} className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cams.slice(0, 8).map((c, i) => (
          <div key={c.id} className="animate-fade-up" style={{ animationDelay: `${i * 50}ms` }}>
            <CameraTile cam={c} index={i} />
          </div>
        ))}
      </div>
      <p className="type-caption text-text-muted">Frames simulated for this prototype. Tags illustrative.</p>

      <Grid className="xl:grid-cols-3">
        <ChartFrame className="xl:col-span-2" label="Detections by hour" code="VMS-02" legend={[{ label: 'Stalled traffic', tone: 'slate' }, { label: 'Garbage dumping', tone: 'rose' }, { label: 'Waterlogging', tone: 'sage' }]} source="Detection service, today">
          <LineChart labels={d.vms.hours} series={[{ name: 'Stalled traffic', data: d.vms.detTraffic, tone: 'slate' }, { name: 'Garbage dumping', data: d.vms.detGarbage, tone: 'rose' }, { name: 'Waterlogging', data: d.vms.detWater, tone: 'sage' }]} />
        </ChartFrame>
        <ChartFrame label="Storage" code="NVR-01" source="Storage cluster">
          <div className="flex h-full flex-col justify-center">
            <Gauge value={d.vms.storage} target={85} label="Storage used" tone={d.vms.storage > 85 ? 'rose' : 'slate'} />
            <p className="mt-3 text-center type-body-s text-text-muted">{d.vms.storage > 85 ? 'Above the 85% threshold. Archive footage older than 30 days.' : 'Within the 85% threshold.'}</p>
          </div>
        </ChartFrame>
      </Grid>

      <Grid className="xl:grid-cols-3">
        <ChartFrame label="Detection types" code="VMS-03" source="Detection service, today">
          <DonutChart segments={d.vms.detTypes} centreLabel="Detections" />
        </ChartFrame>
        <div className="border border-border xl:col-span-2">
          <div className="flex h-8 items-center justify-between border-b border-border px-4">
            <span className="type-label text-text-label">Camera health</span>
            <span className="type-caption text-text-muted">{d.vms.cameras.length} sites</span>
          </div>
          <DataTable columns={cameraColumns} rows={d.vms.cameras} rowKey={(c) => c.id} onRowClick={openCamera} pageSize={6} caption="Camera health" initialSort={{ key: 'uptime', dir: 'asc' }} />
        </div>
      </Grid>
    </div>
  )
}

function PtPage({ d, openProperty }: PageProps) {
  const rate = Math.round((d.pt.collected / d.pt.demand) * 100)
  return (
    <div className="flex flex-col gap-4">
      <Grid className="sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Demand raised" code="PT" value={<AnimatedNumber value={d.pt.demand / 1e7} decimals={2} prefix="₹" />} unit="Cr" delta="9% vs last year" deltaDirection="up" goodWhen="up" status="FY 2026" source="Demand register" />
        <MetricCard label="Collected" code="PT" value={<AnimatedNumber value={d.pt.collected / 1e7} decimals={2} prefix="₹" />} unit="Cr" delta="12% vs last year" deltaDirection="up" goodWhen="up" status="Ahead of plan" series={d.series.coll} barColour="bg-sage-deep" source="Treasury" />
        <MetricCard label="Collection rate" code="PT" value={<AnimatedNumber value={rate} />} unit="%" delta="5 pts" deltaDirection="up" goodWhen="up" status="Target 70%" source="Treasury and demand register" />
        <MetricCard label="Ground mismatches" code="SURVEY" value={<AnimatedNumber value={d.pt.mismatches} />} delta="estimated from sample" deltaDirection="down" goodWhen="down" status="Built-up area above declared" source="Drone survey, 42 of 50 sampled" />
      </Grid>

      <Grid className="xl:grid-cols-3">
        <ChartFrame className="xl:col-span-2" label="Monthly collection" code="PT-01" legend={[{ label: 'Collected', tone: 'sage' }, { label: 'Monthly target', tone: 'rose', dashed: true }]} source="Treasury, FY 2026">
          <BarChart labels={d.pt.ptLabels} series={[{ name: 'Collected', data: d.pt.collection, tone: 'sage' }]} format={lakh} target={{ value: d.pt.target, label: 'Target' }} highlightLast />
        </ChartFrame>
        <ChartFrame label="Survey to payment" code="PT-02" source="Survey and treasury">
          <Funnel stages={d.pt.ptFunnel} tone="sage" />
        </ChartFrame>
      </Grid>

      <Grid className="xl:grid-cols-3">
        <ChartFrame className="xl:col-span-2" label="Declared and surveyed area" code="PT-03" status="Estimate" legend={[{ label: 'Within 20%', tone: 'slate' }, { label: 'Surveyed area over 20% above declared', tone: 'rose' }]} source="Drone survey and self-assessment">
          <ScatterPlot points={d.pt.scatter} xLabel="Declared m²" yLabel="Surveyed m²" diagonal flagLabel="Over declared" />
        </ChartFrame>
        <div className="flex flex-col gap-4">
          <ChartFrame label="Property use" code="PT-04" source="Property register">
            <CompositionBar segments={d.pt.composition} format={(n) => `${n}%`} />
          </ChartFrame>
          <ChartFrame label="Survey coverage" code="PT-05" source="Survey programme">
            <SegmentedProgress label="Wards surveyed" total={20} done={d.pt.surveyedWards} />
          </ChartFrame>
        </div>
      </Grid>

      <div className="border border-border">
        <div className="flex h-8 items-center justify-between border-b border-border px-4">
          <span className="type-label text-text-label">Highest dues</span>
          <span className="type-caption text-text-muted">Owner names masked</span>
        </div>
        <DataTable columns={propertyColumns} rows={d.pt.properties} rowKey={(p) => p.pid} onRowClick={openProperty} pageSize={8} caption="Properties with dues" initialSort={{ key: 'dues', dir: 'desc' }} />
      </div>
    </div>
  )
}

/* ---------------- Shell ---------------- */

type Record_ = { kind: 'grievance'; g: Grievance } | { kind: 'camera'; c: Camera } | { kind: 'property'; p: Property }

export function Dashboard({ onExit }: { onExit: () => void }) {
  const [page, setPage] = useState<Page>('overview')
  const [city, setCity] = useState<City>('kanpur')
  const [period, setPeriod] = useState<Period>('30d')
  const [ward, setWard] = useState<string | null>(null)
  const [refresh, setRefresh] = useState(0)
  const [loading, setLoading] = useState(false)
  const [record, setRecord] = useState<Record_ | null>(null)
  const [cmd, setCmd] = useState(false)
  const [alertsOpen, setAlertsOpen] = useState(false)
  const [updated, setUpdated] = useState(() => new Date())
  const { push } = useToast()
  const alertsRef = useRef<HTMLDivElement>(null)
  const closeAlerts = useCallback(() => setAlertsOpen(false), [])
  const alertRefs = useMemo(() => [alertsRef], [])
  useDismiss(alertsOpen, alertRefs, closeAlerts)

  const d = useMemo(() => buildData(city, period, ward, refresh), [city, period, ward, refresh])
  const wards = useMemo(() => wardsFor(city), [city])
  const wardObj = wards.find((w) => w.id === ward)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setCmd((o) => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [page])

  const doRefresh = () => {
    setLoading(true)
    setTimeout(() => {
      setRefresh((r) => r + 1)
      setUpdated(new Date())
      setLoading(false)
      push({ tone: 'success', title: 'Dashboard refreshed.', body: `${cities[city].body} · all sources synced` })
    }, 1100)
  }

  const nav: NavSection[] = [
    { label: 'Overview', items: [{ id: 'overview', label: 'City overview' }] },
    { label: 'Grievances', code: 'PGR', colour: 'bg-slate', items: [{ id: 'pgr', label: 'Queue and SLA', count: d.pgr.grievances.filter((g) => g.status === 'Escalated').length, urgent: true }] },
    { label: 'Video', code: 'VMS', colour: 'bg-rose', items: [{ id: 'vms', label: 'Live wall and health', count: d.vms.cameras.filter((c) => c.status !== 'Online').length, urgent: true }] },
    { label: 'Property tax', code: 'PT', colour: 'bg-sage-deep', items: [{ id: 'pt', label: 'Collection and survey' }] },
  ]

  const commands: Command[] = [
    ...(['overview', 'pgr', 'vms', 'pt'] as Page[]).map((p) => ({ id: `go-${p}`, group: 'Go to', label: pageMeta[p].label, meta: pageMeta[p].code, onRun: () => setPage(p) })),
    ...d.pgr.grievances.slice(0, 4).map((g) => ({ id: g.id, group: 'Grievances', label: g.id, meta: `${g.category} · ${g.status}`, colour: 'bg-slate', onRun: () => setRecord({ kind: 'grievance', g }) })),
    ...d.vms.cameras.slice(0, 3).map((c) => ({ id: c.id, group: 'Cameras', label: c.id, meta: `${c.location} · ${c.status}`, colour: 'bg-rose', onRun: () => setRecord({ kind: 'camera', c }) })),
    ...d.pt.properties.slice(0, 3).map((p) => ({ id: p.pid, group: 'Properties', label: p.pid, meta: `${p.sector} · ${inr(p.dues)} due`, colour: 'bg-sage-deep', onRun: () => setRecord({ kind: 'property', p }) })),
    { id: 'act-refresh', group: 'Actions', label: 'Refresh dashboard', shortcut: 'R', onRun: doRefresh },
    { id: 'act-city', group: 'Actions', label: `Switch to ${city === 'kanpur' ? 'Mohali' : 'Kanpur'}`, onRun: () => { setCity(city === 'kanpur' ? 'mohali' : 'kanpur'); setWard(null) } },
  ]

  const meta = pageMeta[page]
  const props: PageProps = {
    d,
    city,
    period,
    ward,
    setWard,
    go: setPage,
    openGrievance: (g) => setRecord({ kind: 'grievance', g }),
    openCamera: (c) => setRecord({ kind: 'camera', c }),
    openProperty: (p) => setRecord({ kind: 'property', p }),
  }

  return (
    <div className="min-h-screen bg-surface text-text">
      {/* Top bar */}
      <header className="sticky top-0 z-40 flex h-14 items-stretch justify-between gap-4 border-b border-rule bg-surface px-4">
        <div className="flex items-center gap-6">
          <ProductLockup product="AIRAWAT OS" />
          <div className="hidden md:block">
          <Dropdown
            trigger={({ open, toggle }) => (
              <Button variant="ghost" size="sm" trailing={open ? 'chevron-up' : 'chevron-down'} onClick={toggle} aria-expanded={open}>
                {cities[city].body}
              </Button>
            )}
            items={[
              { type: 'label', label: 'Corporation' },
              ...(Object.keys(cities) as City[]).map((c) => ({ type: 'item' as const, label: cities[c].body, hint: c === city ? 'Current' : undefined, onSelect: () => { setCity(c); setWard(null) } })),
            ]}
          />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setCmd(true)} className="hidden h-9 w-64 cursor-pointer items-center justify-between border border-border-strong bg-surface-raised px-3 type-body-s text-text-muted hover:border-rule lg:flex">
            <span>Search records or jump to</span>
            <kbd className="type-caption">Ctrl K</kbd>
          </button>
          <div ref={alertsRef} className="relative">
            <button type="button" aria-expanded={alertsOpen} aria-label="Alerts, 3 unread" onClick={() => setAlertsOpen((o) => !o)} className="inline-flex h-9 cursor-pointer items-center gap-2 px-2 type-body-s text-text hover:bg-hover">
              Alerts <CountBadge value={3} tone="critical" />
            </button>
            {alertsOpen ? (
              <div className="absolute top-full right-0 z-40 mt-2 w-80 animate-pop border border-rule bg-surface">
                <NotificationItem unread tone="critical" module="VMS · Health" title={`${d.vms.cameras[1].id} offline`} body={d.vms.cameras[1].location} time="09:52" />
                <NotificationItem unread tone="caution" module="PGR · SLA" title="38 grievances near breach" time="09:30" />
                <NotificationItem unread tone="info" module="PT" title="Rebate window opens on the 7th" time="Mon" />
              </div>
            ) : null}
          </div>
          <span className="mx-1 hidden h-6 w-px bg-border sm:block" />
          <Dropdown
            align="end"
            width="w-56"
            trigger={({ toggle, open }) => (
              <button type="button" onClick={toggle} aria-expanded={open} aria-label="Account" className="cursor-pointer p-1 hover:bg-hover">
                <Avatar name="Ayushi Mishra" size="sm" presence="online" />
              </button>
            )}
            items={[
              { type: 'label', label: 'Ayushi Mishra' },
              { type: 'item', label: 'Design system', hint: 'Components and rules', onSelect: onExit },
              { type: 'item', label: 'Preferences', disabled: true },
              { type: 'separator' },
              { type: 'item', label: 'Sign out', critical: true, onSelect: () => push({ tone: 'info', title: 'Sign-out is disabled in this prototype.' }) },
            ]}
          />
        </div>
      </header>

      <div className="lg:grid lg:grid-cols-[240px_1fr]">
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] border-r border-border bg-surface-raised lg:block">
          <SideNav
            sections={nav}
            active={page}
            onSelect={(id) => setPage(id as Page)}
            footer={
              <div className="flex flex-col gap-3">
                <LiveIndicator tone="success" label="All sources synced" />
                <Button size="sm" variant="secondary" onClick={onExit} leading="arrow-left">
                  Design system
                </Button>
              </div>
            }
          />
        </aside>

        <main className="min-w-0 px-4 pt-6 pb-16 md:px-8">
          {/* Mobile page switch */}
          <div className="mb-4 lg:hidden">
            <Tabs label="Dashboard pages" value={page} onChange={setPage} items={(['overview', 'pgr', 'vms', 'pt'] as Page[]).map((p) => ({ value: p, label: pageMeta[p].label }))} />
          </div>

          <div key={page} className="animate-fade-up">
            <Breadcrumbs items={[{ label: cities[city].name, onClick: () => setPage('overview') }, { label: meta.label }, ...(wardObj ? [{ label: `Ward ${wardObj.label}` }] : [])]} />
            <div className="mt-4 flex flex-wrap items-end justify-between gap-6 border-b border-rule pb-5">
              <div className="flex max-w-3xl flex-col gap-2">
                <span className="flex flex-wrap items-center gap-3 type-label text-text-label">
                  {meta.code} · {cities[city].body}
                  {wardObj ? <span className="text-text">· Ward {wardObj.label} {wardObj.name}</span> : null}
                </span>
                <h1 className="type-display-l text-text">
                  {meta.title} <span className="text-text-accent">{meta.accent}</span>
                </h1>
                <span className="type-caption text-text-muted">
                  Updated {String(updated.getHours()).padStart(2, '0')}:{String(updated.getMinutes()).padStart(2, '0')} · figures for the last {periodWord[period]}
                </span>
              </div>
              <div className="flex flex-wrap items-end gap-3">
                <div className="w-56">
                  <Select
                    label="Ward"
                    searchable
                    value={ward ?? 'all'}
                    onChange={(v) => setWard(v === 'all' ? null : v)}
                    options={[{ value: 'all', label: 'All wards' }, ...wards.map((w) => ({ value: w.id, label: `Ward ${w.label} · ${w.name}` }))]}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="type-label text-text-label">Period</span>
                  <ButtonGroup label="Period" value={period} onChange={setPeriod} options={[{ value: '7d', label: '7 days' }, { value: '30d', label: '30 days' }, { value: '90d', label: '90 days' }]} />
                </div>
                <Button variant="secondary" loading={loading} onClick={doRefresh}>
                  {loading ? 'Refreshing' : 'Refresh'}
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-6">
            {loading ? (
              <DashboardSkeleton />
            ) : (
              <div key={`${page}-${city}-${refresh}`}>
                {page === 'overview' ? <Overview {...props} /> : page === 'pgr' ? <PgrPage {...props} /> : page === 'vms' ? <VmsPage {...props} /> : <PtPage {...props} />}
              </div>
            )}
          </div>

          <footer className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
            <span className="type-caption text-text-muted">airawat.org · Sample data for demonstration · Figures are not official</span>
            <span className="type-heading text-text">
              Better data. Better decisions. <span className="text-text-accent">Better cities.</span>
            </span>
          </footer>
        </main>
      </div>

      <RecordDrawer record={record} onClose={() => setRecord(null)} />
      <CommandMenu open={cmd} onClose={() => setCmd(false)} commands={commands} />
    </div>
  )
}

/* ---------------- Record drawer ---------------- */

function RecordDrawer({ record, onClose }: { record: Record_ | null; onClose: () => void }) {
  const { push } = useToast()
  if (!record) return null
  if (record.kind === 'grievance') {
    const g = record.g
    const step = g.status === 'Closed' ? 4 : g.status === 'In progress' || g.status === 'Escalated' ? 2 : g.status === 'Assigned' ? 1 : 0
    return (
      <Drawer
        open
        onClose={onClose}
        label="Grievance"
        code={g.id}
        title={<>{g.category} <span className="text-text-accent">in Ward {g.ward.split(' · ')[0]}.</span></>}
        footer={
          <>
            <Button variant="ghost" onClick={onClose}>Close</Button>
            <Button variant="secondary" onClick={() => { push({ tone: 'caution', module: 'PGR', title: `${g.id} escalated to the zonal officer.` }); onClose() }}>Escalate</Button>
            <Button variant="brand" onClick={() => { push({ tone: 'success', module: 'PGR', title: `${g.id} reassigned.`, body: 'SMS sent to the citizen.' }); onClose() }}>Reassign</Button>
          </>
        }
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={statusTone[g.status]}>{g.status}</Badge>
            {g.status !== 'Closed' ? <Badge tone={g.slaLeft < 0 ? 'critical' : g.slaLeft < 8 ? 'caution' : 'neutral'} variant="soft">{g.slaLeft < 0 ? `${Math.abs(g.slaLeft)} h over SLA` : `${g.slaLeft} h left on SLA`}</Badge> : null}
          </div>
          <DescriptionList items={[{ term: 'Filed', detail: g.filed }, { term: 'Ward', detail: g.ward }, { term: 'Officer', detail: g.officer }, { term: 'Channel', detail: 'WhatsApp' }, { term: 'Age', detail: `${g.ageHours} hours` }]} />
          <div className="flex flex-col gap-3">
            <span className="type-label text-text-label">Progress</span>
            <Stepper orientation="vertical" current={step} steps={[{ label: 'Filed', caption: g.filed }, { label: 'Assigned', caption: g.officer }, { label: 'In progress' }, { label: 'Resolved', caption: 'Proof required' }, { label: 'Citizen confirmed' }]} />
          </div>
          <div className="flex flex-col gap-3">
            <span className="type-label text-text-label">Activity</span>
            <ActivityFeed items={[
              { id: '1', actor: g.officer, action: 'visited the site and added a photo.', time: '2 h ago', module: 'PGR', tone: 'bg-slate' },
              { id: '2', actor: 'PGR', system: true, action: 'routed the complaint to Zone 2 sanitation.', time: `${g.ageHours} h ago`, module: 'PGR', tone: 'bg-slate' },
            ]} />
          </div>
        </div>
      </Drawer>
    )
  }
  if (record.kind === 'camera') {
    const c = record.c
    return (
      <Drawer open onClose={onClose} label="Camera" code={c.id} title={<>{c.location}<span className="text-text-accent">.</span></>}
        footer={<><Button variant="ghost" onClick={onClose}>Close</Button><Button variant="brand" onClick={() => { push({ tone: 'info', module: 'VMS', title: `Maintenance ticket raised for ${c.id}.` }); onClose() }}>Raise maintenance ticket</Button></>}
      >
        <div className="flex flex-col gap-6">
          <CameraTile cam={c} index={0} />
          <DescriptionList items={[{ term: 'Status', detail: <Badge variant="soft" tone={c.status === 'Online' ? 'success' : c.status === 'Degraded' ? 'caution' : 'critical'}>{c.status}</Badge> }, { term: 'Uptime 30 d', detail: `${c.uptime}%` }, { term: 'Last frame', detail: c.lastFrame }, { term: 'Detections', detail: `${c.detections} today` }, { term: 'Retention', detail: '30 days' }]} />
        </div>
      </Drawer>
    )
  }
  const p = record.p
  return (
    <Drawer open onClose={onClose} label="Property" code={p.pid} title={<>{p.use} property in <span className="text-text-accent">{p.sector}.</span></>}
      footer={<><Button variant="ghost" onClick={onClose}>Close</Button><Button variant="brand" onClick={() => { push({ tone: 'success', module: 'PT', title: `Demand notice queued for ${p.pid}.` }); onClose() }}>Issue demand notice</Button></>}
    >
      <DescriptionList items={[{ term: 'Owner', detail: p.owner }, { term: 'Sector', detail: p.sector }, { term: 'Use', detail: p.use }, { term: 'Dues', detail: inr(p.dues) }, { term: 'Years due', detail: p.years }, { term: 'Ground check', detail: <Badge tone={p.matched ? 'success' : 'caution'}>{p.matched ? 'Matched' : 'Mismatch'}</Badge> }]} />
    </Drawer>
  )
}
