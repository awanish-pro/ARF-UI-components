import { useState } from 'react'
import {
  Accordion,
  ActivityFeed,
  AnimatedNumber,
  Badge,
  Button,
  Caption,
  cx,
  DataTable,
  DescriptionList,
  Drawer,
  FileUpload,
  LiveIndicator,
  Pagination,
  Stepper,
  useToast,
  type Column,
} from '@/ds'
import { Rules, Section, Specimen } from './Doc'

/* ---------------- Foundation: Motion ---------------- */

const motionTokens = [
  { name: 'fade-in', ms: '240', use: 'Tooltips, scrims, table rows', demo: 'animate-fade-in' },
  { name: 'fade-up', ms: '480', use: 'Sections and cards entering view', demo: 'animate-fade-up' },
  { name: 'pop', ms: '160', use: 'Menus, selects, popovers', demo: 'animate-pop' },
  { name: 'rise', ms: '280', use: 'Modals and the command menu', demo: 'animate-rise' },
  { name: 'slide-in-right', ms: '320', use: 'Drawers', demo: 'animate-slide-in-right' },
  { name: 'toast-in', ms: '280', use: 'Toasts', demo: 'animate-toast-in' },
  { name: 'grow-y', ms: '700', use: 'Bars, sparkline columns', demo: 'animate-grow-y origin-bottom' },
  { name: 'grow-x', ms: '700', use: 'Funnels, horizontal bars, axes', demo: 'animate-grow-x origin-left' },
  { name: 'live', ms: '1600 loop', use: 'Live feeds only', demo: 'animate-live' },
]

export function MotionSection() {
  const [run, setRun] = useState(0)
  const [value, setValue] = useState(412)
  return (
    <Section
      id="motion"
      group="Foundation"
      title="Motion"
      headline="Movement that explains,"
      accent="then gets out of the way."
      intro="Motion orients, confirms and reveals data. It is short, uses one quiet easing curve and never bounces. Everything stops when the reader asks for reduced motion."
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Specimen name="Motion tokens" code="ANIM">
          <div className="mb-4 flex justify-end">
            <Button size="sm" variant="secondary" onClick={() => setRun((r) => r + 1)}>
              Replay all
            </Button>
          </div>
          <div key={run} className="grid gap-px bg-border sm:grid-cols-3">
            {motionTokens.map((t, i) => (
              <div key={t.name} className="flex flex-col gap-3 bg-surface p-4">
                <div className="flex h-12 items-center overflow-hidden bg-surface-raised px-3">
                  <span className={cx('block h-6 bg-slate', t.name === 'grow-x' ? 'w-full' : 'w-10', t.demo)} style={{ animationDelay: `${i * 80}ms` }} />
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-[12px] text-text">{t.name}</span>
                  <span className="type-caption text-text-muted">{t.ms} ms</span>
                </div>
                <span className="type-body-s text-text-muted">{t.use}</span>
              </div>
            ))}
          </div>
        </Specimen>
        <div className="flex flex-col gap-6">
          <Specimen name="Easing" code="EASE-QUIET">
            <svg viewBox="0 0 120 120" className="w-full text-slate" aria-label="Easing curve cubic-bezier 0.2, 0, 0, 1">
              <rect x="10" y="10" width="100" height="100" fill="none" stroke="var(--color-border)" />
              <path d="M10 110 C30 110 10 10 110 10" fill="none" stroke="currentColor" strokeWidth="2" pathLength={1} strokeDasharray={1} className="animate-draw" key={run} />
              <rect x="7" y="107" width="6" height="6" fill="var(--color-text)" />
              <rect x="107" y="7" width="6" height="6" fill="var(--color-text)" />
            </svg>
            <p className="mt-3 font-mono text-[12px] text-text">cubic-bezier(0.2, 0, 0, 1)</p>
            <Caption>Fast start, long settle. Exits use (0.4, 0, 1, 1).</Caption>
          </Specimen>
          <Specimen name="Count-up" code="ANIMATED-NUMBER">
            <div className="flex items-end justify-between gap-4">
              <span className="font-display text-[40px] leading-none font-semibold text-text">
                <AnimatedNumber value={value} />
              </span>
              <Button size="sm" variant="secondary" onClick={() => setValue(Math.round(200 + Math.random() * 20000))}>
                New value
              </Button>
            </div>
            <Caption className="mt-3 block">Indian digit grouping. The final value is announced to screen readers.</Caption>
          </Specimen>
        </div>
      </div>
      <Rules
        items={[
          'Motion has a job: orient (where did this come from), confirm (it worked) or reveal (read the data in order).',
          'Interface feedback 150 to 320 ms. Data reveals up to 1.1 s, once, when the chart enters view.',
          'No bounce, no spring overshoot, no parallax, no looping decoration. Only live feeds may loop.',
          'Stagger lists by 25 to 60 ms per item. Never stagger more than about 12 items.',
          'Under prefers-reduced-motion every animation jumps to its end state.',
        ]}
      />
    </Section>
  )
}

/* ---------------- Base: Accordion ---------------- */

export function AccordionSection() {
  return (
    <Section
      id="accordion"
      group="Base components"
      title="Accordion"
      headline="Detail on request,"
      accent="not by default."
      intro="Accordions hold reference material officers need occasionally: rules, rates and procedures. Rows sit on 1px rules and open with a short height transition. A square plus turns into an ink minus."
    >
      <Specimen name="Accordion" code="ACC">
        <Accordion
          defaultOpen={['sla']}
          items={[
            { id: 'sla', title: 'Service levels by category', meta: 'PGR · 6 categories', content: 'Garbage and drainage close within 48 hours. Streetlights within 72 hours. Water supply within 24 hours. Roads and encroachment within 7 days, with a site visit inside 48 hours.' },
            { id: 'rebate', title: 'Early payment rebate', meta: 'Property tax · FY 2026', content: 'A 10% rebate applies when the full annual demand is paid before 30 June. Partial payments do not qualify. The rebate is applied automatically at the counter and online.' },
            { id: 'retention', title: 'Footage retention', meta: 'VMS · Policy 04', content: 'Footage is kept for 30 days. Clips attached to a grievance or a police request are kept for 1 year. Longer retention needs commissioner approval.' },
          ]}
        />
      </Specimen>
    </Section>
  )
}

/* ---------------- Base: File upload ---------------- */

export function FileUploadSection() {
  return (
    <Section
      id="fileupload"
      group="Base components"
      title="File upload"
      headline="Proof attached at"
      accent="the point of work."
      intro="Field officers attach after photos and documents as proof of closure. The dropzone is dashed and square. Each file shows a flat progress bar, and errors say how to fix them."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Specimen name="Closure proof" code="UPL">
          <FileUpload label="After photos" hint="JPG or PNG, up to 10 MB each. Keep the timestamp visible." accept="image/*" initial={[{ name: 'after-photo-0740.jpg', size: 2_400_000 }]} />
        </Specimen>
        <Specimen name="Rules" code="UPL-RULES">
          <Rules
            title="Use"
            items={[
              'State accepted types and the size limit before upload, not after.',
              'Never crop out a timestamp or detection label that is part of the evidence.',
              'Uploads queue on the device when offline and sync when the connection returns.',
            ]}
          />
        </Specimen>
      </div>
    </Section>
  )
}

/* ---------------- Base: Pagination ---------------- */

export function PaginationSection() {
  const [page, setPage] = useState(3)
  const [page2, setPage2] = useState(1)
  return (
    <Section
      id="pagination"
      group="Base components"
      title="Pagination"
      headline="Long lists, in pages you can"
      accent="count."
      intro="Pages are square mono buttons with an ellipsis for long runs. The summary states the range in words, so the reader always knows where they are."
    >
      <Specimen name="Pagination" code="PAG">
        <div className="flex flex-col gap-6">
          <Pagination page={page} pageCount={42} onChange={setPage} summary={`Showing ${(page - 1) * 10 + 1} to ${page * 10} of 412 grievances`} />
          <div className="border-t border-border pt-6">
            <Pagination page={page2} pageCount={5} onChange={setPage2} />
          </div>
        </div>
      </Specimen>
    </Section>
  )
}

/* ---------------- Application: Activity feed ---------------- */

export function ActivitySection() {
  return (
    <Section
      id="activity"
      group="Application components"
      title="Activity feed"
      headline="Who did what, and"
      accent="when."
      intro="The activity feed is the decision trail. Each entry names the person or system, the action and the record, with the module square and time. System events use a square node instead of an avatar."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Specimen name="Activity feed" code="ACT">
          <div className="mb-4 flex justify-end">
            <LiveIndicator tone="success" />
          </div>
          <ActivityFeed
            items={[
              { id: '1', actor: 'Ravi Shukla', action: <>closed <span className="font-mono text-[12px]">PGR-24-08812</span> with an after photo.</>, time: '09:52', module: 'PGR', tone: 'bg-slate' },
              { id: '2', actor: 'VMS', system: true, action: 'raised a garbage dumping detection at Mall Road junction.', time: '09:47', module: 'VMS', tone: 'bg-rose' },
              { id: '3', actor: 'Neha Verma', action: <>escalated <span className="font-mono text-[12px]">PGR-24-08790</span> to the zonal officer.</>, time: '09:31', module: 'PGR', tone: 'bg-slate' },
              { id: '4', actor: 'Treasury sync', system: true, action: 'posted ₹1.2 lakh across 18 receipts.', time: '09:15', module: 'PT', tone: 'bg-sage-deep' },
            ]}
          />
        </Specimen>
        <Specimen name="Live indicator and description list" code="LIVE · DL">
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap gap-6">
              <LiveIndicator />
              <LiveIndicator tone="success" label="Synced" />
              <LiveIndicator tone="info" label="Recording" />
              <LiveIndicator paused />
            </div>
            <DescriptionList
              items={[
                { term: 'Property ID', detail: <span className="font-mono text-[12px]">MOH-PID-118204</span> },
                { term: 'Use', detail: 'Commercial' },
                { term: 'Built-up area', detail: '312 m² surveyed, 240 m² declared' },
                { term: 'Ground check', detail: <Badge tone="caution">Mismatch</Badge> },
              ]}
            />
          </div>
        </Specimen>
      </div>
    </Section>
  )
}

/* ---------------- Application: Data table ---------------- */

type Row = { id: string; category: string; ward: string; age: number; status: 'Open' | 'Escalated' | 'Closed' }
const sampleRows: Row[] = Array.from({ length: 23 }, (_, i) => ({
  id: `PGR-24-${String(8812 - i * 13).padStart(5, '0')}`,
  category: ['Garbage', 'Streetlight', 'Drainage', 'Water supply', 'Roads'][i % 5],
  ward: `Ward ${[12, 18, 27, 33, 4][i % 5]}`,
  age: (i * 7) % 61 + 2,
  status: i % 6 === 0 ? 'Escalated' : i % 4 === 0 ? 'Closed' : 'Open',
}))

export function DataTableSection() {
  const { push } = useToast()
  const columns: Column<Row>[] = [
    { key: 'id', header: 'Number', mono: true, sortable: true },
    { key: 'category', header: 'Category', sortable: true },
    { key: 'ward', header: 'Ward', sortable: true },
    { key: 'age', header: 'Age', align: 'right', sortable: true, render: (r) => <span className={cx('font-mono text-[12px]', r.age > 48 && r.status !== 'Closed' ? 'text-critical' : 'text-text')}>{r.age} h</span> },
    { key: 'status', header: 'Status', sortable: true, render: (r) => <Badge tone={r.status === 'Escalated' ? 'critical' : r.status === 'Closed' ? 'success' : 'neutral'}>{r.status}</Badge> },
  ]
  return (
    <Section
      id="datatable"
      group="Application components"
      title="Data table"
      headline="Records you can sort, select and"
      accent="act on."
      intro="Tables sit under a 1px rule with mono column labels. Columns sort with one click. Selecting rows raises an ink action bar. Numbers align right and codes are set in mono."
    >
      <div className="border border-border">
        <DataTable
          columns={columns}
          rows={sampleRows}
          rowKey={(r) => r.id}
          selectable
          pageSize={6}
          caption="Sample grievances"
          onRowClick={(r) => push({ tone: 'info', module: 'PGR', title: `Opened ${r.id}` })}
          bulkActions={(sel, clear) => (
            <>
              <Button size="sm" variant="secondary" onClick={() => { push({ tone: 'success', module: 'PGR', title: `${sel.length} assigned.` }); clear() }}>
                Assign
              </Button>
              <Button size="sm" variant="ghost" onClick={clear}>
                Clear
              </Button>
            </>
          )}
        />
      </div>
      <Rules items={['Right-align numbers and their headers. Show units in the cell, not only in the header.', 'Row click opens a drawer, never a new page, so the list position is kept.', 'Keep row height at 44 px or more for touch.']} />
    </Section>
  )
}

/* ---------------- Application: Drawer ---------------- */

export function DrawerSection() {
  const [open, setOpen] = useState(false)
  const { push } = useToast()
  return (
    <Section
      id="drawer"
      group="Application components"
      title="Drawer"
      headline="Record detail without"
      accent="losing your place."
      intro="Drawers slide in from the right over the scrim. They hold one record: its facts, its progress and its trail. The list stays behind, exactly where the reader left it."
    >
      <Specimen name="Drawer" code="DRW">
        <Button onClick={() => setOpen(true)}>Open grievance detail</Button>
      </Specimen>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        label="Grievance"
        code="PGR-24-08812"
        title={<>Garbage not collected <span className="text-text-accent">in Ward 12.</span></>}
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Close
            </Button>
            <Button variant="brand" onClick={() => { setOpen(false); push({ tone: 'success', module: 'PGR', title: 'PGR-24-08812 closed with proof.' }) }}>
              Close with proof
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-6">
          <DescriptionList items={[{ term: 'Filed', detail: '12 Jun · 09:14' }, { term: 'Ward', detail: '12 · Swaroop Nagar' }, { term: 'Officer', detail: 'Ravi Shukla' }, { term: 'SLA', detail: <Badge tone="caution" variant="soft">6 h left</Badge> }]} />
          <Stepper orientation="vertical" current={2} steps={[{ label: 'Filed', caption: '12 Jun · 09:14' }, { label: 'Assigned', caption: 'Ravi Shukla' }, { label: 'In progress' }, { label: 'Resolved' }, { label: 'Citizen confirmed' }]} />
        </div>
      </Drawer>
    </Section>
  )
}
