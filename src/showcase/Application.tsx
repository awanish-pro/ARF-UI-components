import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Alert,
  Avatar,
  Badge,
  Banner,
  BarList,
  Breadcrumbs,
  Button,
  Calendar,
  Caption,
  CommandMenu,
  CountBadge,
  DatePicker,
  DateRangePicker,
  EmptyState,
  ErrorState,
  formatDate,
  Input,
  Loading,
  MetricCard,
  Modal,
  NotificationItem,
  OfflineState,
  ProductLockup,
  ProgressBar,
  Select,
  SideNav,
  Skeleton,
  SkeletonTable,
  StatFigure,
  StepLoader,
  TabPanel,
  Tabs,
  Textarea,
  TopNav,
  useDismiss,
  useToast,
} from '@/ds'
import { calendarEvents, commands, navSections, wards } from './data'
import { Rules, Section, Specimen } from './Doc'
import { ActivitySection, DataTableSection, DrawerSection } from './Extra'

function AlertsSection() {
  const { push } = useToast()
  const [shown, setShown] = useState({ a: true, b: true })
  return (
    <Section
      id="alerts"
      group="Application components"
      title="Alert and notification"
      headline="Say what happened and"
      accent="what to do next."
      intro="Alerts are built like blueprint boxes: a header strip with the status word and a reference code, then a plain heading and one line of context. Toasts arrive on an ink gradient and leave after five seconds."
    >
      <div className="flex flex-col gap-4">
        <Banner tone="info" action={<Button size="sm" variant="secondary">View schedule</Button>}>
          Planned maintenance on Sunday 02:00 to 04:00. VMS recording continues; the live wall pauses.
        </Banner>
        <Banner tone="critical">Data sync with the state IGRS portal has failed three times since 08:00.</Banner>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Alert tone="info" title="Grievance assigned to Ravi Shukla." code="PGR-24-08812">
          Field officer, Zone 2. Expected closure by 14 June, 18:00.
        </Alert>
        <Alert tone="success" title="Payment received for MOH-PID-118204." code="PT-RCPT-55102">
          ₹48,200 credited. Receipt sent to the registered mobile number.
        </Alert>
        {shown.a ? (
          <Alert
            tone="caution"
            title="38 grievances will breach SLA in 6 hours."
            code="PGR · ZONE 2"
            onDismiss={() => setShown({ ...shown, a: false })}
            actions={
              <>
                <Button size="sm">Review list</Button>
                <Button size="sm" variant="ghost">
                  Remind officers
                </Button>
              </>
            }
          >
            Most are garbage complaints in Wards 12 and 18.
          </Alert>
        ) : null}
        {shown.b ? (
          <Alert
            tone="critical"
            title="CAM-KNP-0233 has been offline for 2 hours."
            code="VMS-HLTH-0233"
            onDismiss={() => setShown({ ...shown, b: false })}
            actions={<Button size="sm" variant="critical">Raise maintenance ticket</Button>}
          >
            Bada Chauraha. Last frame received at 07:38. Power supply suspected.
          </Alert>
        ) : null}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Specimen name="Toasts" code="TOAST">
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => push({ tone: 'success', module: 'PGR', title: 'PGR-24-08812 closed with proof.', body: 'Citizen notified by SMS.' })}>
              Success toast
            </Button>
            <Button variant="secondary" onClick={() => push({ tone: 'info', module: 'VMS', title: 'Clip export ready.', body: 'CAM-KNP-0417 · 15 min · 212 MB' })}>
              Info toast
            </Button>
            <Button variant="secondary" onClick={() => push({ tone: 'critical', module: 'PT', title: 'Demand notice batch failed.', body: '12 of 840 records missing an owner name.' })}>
              Critical toast
            </Button>
          </div>
          <Caption className="mt-4 block">Bottom right, up to four at once. Critical items also stay in the notification centre.</Caption>
        </Specimen>
        <Specimen name="Notification centre" code="NTF" bodyClass="p-0!">
          <div className="flex items-center justify-between border-b border-rule px-4 py-2.5">
            <span className="type-heading text-text">Notifications</span>
            <Button size="sm" variant="link">
              Mark all read
            </Button>
          </div>
          <NotificationItem unread tone="critical" module="VMS · Health" title="CAM-KNP-0233 offline for 2 hours" time="09:52" />
          <NotificationItem unread tone="caution" module="PGR · SLA" title="38 grievances near breach in Zone 2" body="Most in Wards 12 and 18." time="09:30" />
          <NotificationItem module="PT · Collection" title="₹1.2 lakh collected today, Sector 70" time="Yesterday" />
        </Specimen>
      </div>
    </Section>
  )
}

function NavigationSection({ onOpenCommand }: { onOpenCommand: () => void }) {
  const [mod, setMod] = useState('pgr')
  const [active, setActive] = useState('pgr-inbox')
  const [notifOpen, setNotifOpen] = useState(false)
  const notifRef = useRef<HTMLDivElement>(null)
  const close = useCallback(() => setNotifOpen(false), [])
  const refs = useMemo(() => [notifRef], [])
  useDismiss(notifOpen, refs, close)
  const activeLabel = navSections.flatMap((s) => s.items.map((i) => ({ ...i, section: s }))).find((i) => i.id === active)

  return (
    <Section
      id="navigation"
      group="Application components"
      title="Application navigation"
      headline="Three products,"
      accent="one shell."
      intro="A top bar carries the product lockup, module switcher, command search and the user. The side navigation groups each module under a mono label with its colour square. The active item fills ink."
    >
      <div className="border border-rule">
        <header className="flex h-14 items-stretch justify-between gap-6 border-b border-rule bg-surface px-4">
          <div className="flex items-center gap-8">
            <ProductLockup product="AIRAWAT OS" />
            <div className="hidden items-stretch md:flex">
              <TopNav
                active={mod}
                onSelect={(id) => {
                  setMod(id)
                  setActive(navSections.find((s) => s.code?.toLowerCase() === id)?.items[0].id ?? active)
                }}
                items={[
                  { id: 'pgr', label: 'Grievances' },
                  { id: 'vms', label: 'Video' },
                  { id: 'pt', label: 'Property tax' },
                ]}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenCommand}
              className="hidden h-9 w-60 cursor-pointer items-center justify-between border border-border-strong bg-surface-raised px-3 type-body-s text-text-muted hover:border-rule lg:flex"
            >
              <span>Search or jump to</span>
              <kbd className="type-caption">Ctrl K</kbd>
            </button>
            <div ref={notifRef} className="relative">
              <button
                type="button"
                aria-expanded={notifOpen}
                aria-label="Notifications, 2 unread"
                onClick={() => setNotifOpen((o) => !o)}
                className="relative inline-flex h-9 cursor-pointer items-center gap-2 border border-transparent px-2 type-body-s text-text hover:bg-hover"
              >
                Alerts <CountBadge value={2} tone="critical" />
              </button>
              {notifOpen ? (
                <div className="absolute top-full right-0 z-30 mt-2 w-80 border border-rule bg-surface">
                  <NotificationItem unread tone="critical" module="VMS · Health" title="CAM-KNP-0233 offline for 2 hours" time="09:52" />
                  <NotificationItem unread tone="caution" module="PGR · SLA" title="38 grievances near breach" time="09:30" />
                  <NotificationItem module="PT" title="Rebate window opens on the 9th" time="Mon" />
                </div>
              ) : null}
            </div>
            <span className="mx-1 h-6 w-px bg-border" />
            <Avatar name="Ayushi Mishra" size="sm" presence="online" />
          </div>
        </header>
        <div className="grid min-h-[480px] grid-cols-1 md:grid-cols-[240px_1fr]">
          <aside className="hidden border-r border-border bg-surface-raised md:block">
            <SideNav
              sections={navSections}
              active={active}
              onSelect={(id) => {
                setActive(id)
                setMod(navSections.find((s) => s.items.some((i) => i.id === id))?.code?.toLowerCase() ?? mod)
              }}
              footer={
                <div className="flex items-center gap-3">
                  <Avatar name="Ayushi Mishra" size="sm" />
                  <div className="flex flex-col">
                    <span className="type-body-s font-medium text-text">Ayushi Mishra</span>
                    <span className="type-caption text-text-muted">Kanpur Nagar Nigam</span>
                  </div>
                </div>
              }
            />
          </aside>
          <main className="flex flex-col gap-6 bg-surface p-8">
            <Breadcrumbs items={[{ label: 'Kanpur' }, { label: activeLabel?.section.label ?? '' }, { label: activeLabel?.label ?? '' }]} />
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-rule pb-4">
              <div className="flex flex-col gap-1">
                <span className="type-label text-text-label">{activeLabel?.section.code} · Zone 2</span>
                <h3 className="type-display-l text-text">
                  {activeLabel?.label}
                  <span className="text-text-accent">.</span>
                </h3>
              </div>
              <Button variant="brand" leading="plus">
                New record
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <StatFigure size="m" figure="412" label="Open in Zone 2" />
              <StatFigure size="m" figure="82%" label="Closed within 48 hours" />
              <StatFigure size="m" figure="7" label="Escalated today" />
            </div>
          </main>
        </div>
      </div>
      <Rules
        items={[
          'The logo slot takes supplied artwork only. Montserrat appears only beside it.',
          'Section labels are mono and short. Counts turn critical only when action is overdue.',
          'Collapse the side navigation below 768px; the module switcher moves into the command menu.',
        ]}
      />
    </Section>
  )
}

function BreadcrumbsSection() {
  const [trail, setTrail] = useState(['Kanpur', 'Zone 2', 'Ward 12', 'PGR-24-08812'])
  return (
    <Section
      id="breadcrumbs"
      group="Application components"
      title="Breadcrumbs"
      headline="Know where you are in"
      accent="the city record."
      intro="Breadcrumbs follow the hierarchy of the place, not the click history: city, zone, ward, record. Mono labels with slash separators. The last item is the current page."
    >
      <Specimen name="Breadcrumbs" code="BRC">
        <div className="flex flex-col gap-6">
          <Breadcrumbs items={trail.map((t, i) => ({ label: t, onClick: () => setTrail(trail.slice(0, i + 1)) }))} />
          {trail.length < 4 ? (
            <Button size="sm" variant="link" onClick={() => setTrail(['Kanpur', 'Zone 2', 'Ward 12', 'PGR-24-08812'])}>
              Restore trail
            </Button>
          ) : null}
          <Breadcrumbs items={[{ label: 'Mohali' }, { label: 'Sector 70' }, { label: 'MOH-PID-118204' }]} />
          <Breadcrumbs items={[{ label: 'VMS' }, { label: 'Mall Road' }, { label: 'CAM-KNP-0417' }, { label: 'Detections' }]} />
        </div>
      </Specimen>
    </Section>
  )
}

function CalendarSection() {
  return (
    <Section
      id="calendar"
      group="Application components"
      title="Calendar"
      headline="Deadlines, hearings and audits on"
      accent="one month."
      intro="Monday-first square cells. Each event is a 6px square in its module colour; the agenda beside it names every event in words. Today is underlined in the accent."
    >
      <Calendar events={calendarEvents} />
      <div className="flex flex-wrap gap-6">
        {[
          ['bg-slate', 'PGR · Public Grievance Redressal'],
          ['bg-rose', 'VMS · Video Management System'],
          ['bg-sage-deep', 'PT · Property Tax'],
        ].map(([c, l]) => (
          <span key={l} className="flex items-center gap-2 type-caption text-text-muted">
            <span className={`size-1.5 ${c}`} /> {l}
          </span>
        ))}
      </div>
    </Section>
  )
}

function DatePickerSection() {
  const [d, setD] = useState<Date | null>(new Date())
  const [range, setRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null })
  return (
    <Section
      id="datepicker"
      group="Application components"
      title="Date picker"
      headline="Dates written the way"
      accent="officers read them."
      intro="Dates display as DD Mon YYYY, never as ambiguous numerals. The picker opens a month grid with keyboard support: arrow keys move, Enter selects, Escape closes."
    >
      <Specimen name="Date picker" code="DTP" bodyClass="min-h-[440px]">
        <div className="grid gap-6 md:grid-cols-3">
          <DatePicker label="Hearing date" value={d} onChange={setD} minDate={new Date()} hint="Past dates are not available." />
          <DateRangePicker label="Report period" value={range} onChange={setRange} />
          <div className="flex flex-col gap-1.5">
            <span className="type-label text-text-label">Selected</span>
            <span className="type-body text-text">{d ? formatDate(d) : 'None'}</span>
            <span className="type-body-s text-text-muted">
              {range.start ? `${formatDate(range.start)} to ${range.end ? formatDate(range.end) : '…'}` : 'No range chosen'}
            </span>
          </div>
        </div>
      </Specimen>
    </Section>
  )
}

function CommandSection({ onOpen }: { onOpen: () => void }) {
  return (
    <Section
      id="command"
      group="Application components"
      title="Command menu"
      headline="Any record, two keys"
      accent="away."
      intro="Ctrl or Cmd plus K opens one search across grievances, cameras and properties, plus common actions. Results group by type with module squares. Arrow keys move; Enter opens."
    >
      <Specimen name="Command menu" code="CMD">
        <div className="flex flex-wrap items-center gap-4">
          <Button onClick={onOpen} leading="search">
            Open command menu
          </Button>
          <span className="type-body-s text-text-muted">
            or press <kbd className="border border-border px-1.5 py-0.5 type-caption">Ctrl K</kbd>
          </span>
        </div>
      </Specimen>
    </Section>
  )
}

function StatesSection() {
  const [retrying, setRetrying] = useState(false)
  const [online, setOnline] = useState(false)
  return (
    <>
      <Section
        id="empty"
        group="Application components"
        title="Empty state"
        headline="An empty list is a result,"
        accent="so say so."
        intro="Empty states explain why the list is empty and offer the next useful step. The Vastu grid sits in open space: a shared plan many hands build on."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <Specimen name="No results" code="EMP-01" bodyClass="p-0!">
            <EmptyState
              title="No grievances match"
              accent="these filters."
              body="Ward 12, streetlight, last 7 days. Widen the period or clear a filter."
              actions={
                <>
                  <Button variant="secondary">Clear filters</Button>
                  <Button variant="ghost">Last 30 days</Button>
                </>
              }
            />
          </Specimen>
          <Specimen name="First use" code="EMP-02" bodyClass="p-0!">
            <EmptyState
              label="Property register"
              title="No properties imported for"
              accent="Sector 82 yet."
              body="Upload the drone survey or the existing tax register to begin matching."
              actions={<Button variant="brand" leading="plus">Import survey</Button>}
            />
          </Specimen>
        </div>
      </Section>

      <Section
        id="skeleton"
        group="Application components"
        title="Skeleton loader state"
        headline="Show the shape before"
        accent="the data."
        intro="Skeletons use solid tints with a slow shimmer that matches the final layout. Use them for loads under a few seconds; use a loading state with words for anything longer."
      >
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <SkeletonTable rows={4} />
          <div className="flex flex-col gap-4 border border-border p-5">
            <Skeleton className="h-2.5 w-24" />
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-4/5" />
            <div className="mt-2 grid grid-cols-3 gap-3">
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
            </div>
          </div>
        </div>
      </Section>

      <Section
        id="error"
        group="Application components"
        title="Error state"
        headline="Name the failure,"
        accent="keep the trail."
        intro="Errors say what failed, in the reader's terms, and give a reference code for support. Retry is the first action. Nothing the user typed is lost."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <Specimen name="Load failure" code="ERR-503" bodyClass="p-0!">
            {retrying ? (
              <Loading label="Retrying" detail="Reconnecting to the ward record service." />
            ) : (
              <ErrorState
                code="PT-503-118204"
                title="The property record could not"
                accent="be loaded."
                body="The tax register service did not respond. Your edits are saved on this device."
                actions={
                  <>
                    <Button
                      onClick={() => {
                        setRetrying(true)
                        setTimeout(() => setRetrying(false), 2200)
                      }}
                    >
                      Try again
                    </Button>
                    <Button variant="ghost">Contact support</Button>
                  </>
                }
              />
            )}
          </Specimen>
          <Specimen name="Permission" code="ERR-403" bodyClass="p-0!">
            <ErrorState
              code="VMS-403-0417"
              title="You do not have access to"
              accent="this camera."
              body="Live footage from CAM-KNP-0417 is limited to the traffic control room. Ask your administrator for VMS viewer rights."
              actions={<Button variant="secondary">Request access</Button>}
            />
          </Specimen>
        </div>
      </Section>

      <Section
        id="offline"
        group="Application components"
        title="No network state"
        headline="Field work continues"
        accent="without signal."
        intro="Field officers often lose signal. The app says it is offline, shows when it last synced, and queues actions on the device. The Kolam, a line of connection, breaks to show the gap."
      >
        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <Specimen name="Offline" code="NET-OFF" bodyClass="p-0!">
            {online ? (
              <div className="flex flex-col gap-4 p-8">
                <Alert tone="success" title="Back online. 3 queued actions synced." code="SYNC · 09:58" />
                <Button variant="secondary" className="self-start" onClick={() => setOnline(false)}>
                  Simulate offline again
                </Button>
              </div>
            ) : (
              <OfflineState
                title="You are offline. Work is"
                accent="saved on this device."
                body="Closure photos and remarks will upload when the connection returns. Live camera views are unavailable."
                lastSynced="09:41"
                queued={3}
                actions={<Button onClick={() => setOnline(true)}>Retry connection</Button>}
              />
            )}
          </Specimen>
          <div className="flex flex-col gap-4">
            <Banner tone="caution" action={<Button size="sm" variant="link">Details</Button>}>
              Offline since 09:41. 3 actions queued.
            </Banner>
            <div className="border border-border p-5">
              <span className="type-label text-text-label">Sync queue</span>
              <ul className="mt-3 flex flex-col gap-2">
                {['Closure photo · PGR-24-08812', 'Remarks · PGR-24-08790', 'Ground check · MOH-PID-118204'].map((q) => (
                  <li key={q} className="flex items-center justify-between gap-3 type-body-s text-text">
                    <span className="flex items-center gap-2">
                      <span className="size-1.5 bg-caution" />
                      {q}
                    </span>
                    <span className="type-caption text-text-muted">Queued</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>

      <Section
        id="loading"
        group="Application components"
        title="Loading"
        headline="Waiting, with"
        accent="a reason given."
        intro="The step loader is three squares in sequence. Pair it with a word. For long jobs, show a bar and say what is happening."
      >
        <div className="grid gap-6 lg:grid-cols-3">
          <Specimen name="Inline" code="LDR-01">
            <div className="flex flex-col gap-5">
              <span className="flex items-center gap-3 text-brand">
                <StepLoader label="Loading" />
                <span className="type-label text-text-label">Loading cameras</span>
              </span>
              <Button loading>Saving</Button>
            </div>
          </Specimen>
          <Specimen name="Panel" code="LDR-02" bodyClass="p-0!">
            <Loading label="Fetching ward map" detail="Kanpur Nagar Nigam · 110 wards" />
          </Specimen>
          <Specimen name="Long job" code="LDR-03">
            <div className="flex flex-col gap-4">
              <ProgressBar label="Generating demand notices" value={64} caption="538 of 840 · about 2 minutes left" tone="sage" />
              <ProgressBar label="Matching survey to register" indeterminate size="sm" />
            </div>
          </Specimen>
          <Specimen name="On dark" code="LDR-04" dark className="lg:col-span-3">
            <div className="flex items-center gap-4">
              <span className="text-slate-light">
                <StepLoader label="Connecting" />
              </span>
              <span className="type-label">Connecting to live wall · 64 streams</span>
            </div>
          </Specimen>
        </div>
      </Section>
    </>
  )
}

function MetricsSection() {
  return (
    <Section
      id="metrics"
      group="Application components"
      title="Metrics"
      headline="Every number with"
      accent="a source."
      intro="Headline figures are outlined in Space Grotesk over a 1px rule. Dashboard cards show the value, the change in words and colour, a flat bar trend and a source line. Estimates say so."
    >
      <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 2xl:grid-cols-4">
        <StatFigure figure="82%" label="PGR complaints closed within 48 hours, up from 60%" />
        <StatFigure figure="1,240" label="VMS cameras reporting across Kanpur" />
        <StatFigure figure="84%" label="PT: 42 of 50 sampled properties matched on the ground" />
        <StatFigure figure="₹4.40 Cr" label="PT collected in the Mohali pilot (estimated)" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          label="Open grievances"
          code="PGR"
          value="412"
          delta="18 vs last week"
          deltaDirection="down"
          goodWhen="down"
          status="Fewer open"
          series={[520, 498, 470, 455, 448, 430, 412]}
          barColour="bg-slate"
          source="PGR ledger, Zone 2, 7 days"
        />
        <MetricCard
          label="Cameras online"
          code="VMS"
          value="97.6"
          unit="%"
          delta="0.8 pts today"
          deltaDirection="down"
          goodWhen="up"
          status="3 offline"
          series={[98.9, 99.1, 98.7, 98.8, 98.4, 98.4, 97.6]}
          barColour="bg-rose"
          source="VMS health monitor, live"
        />
        <MetricCard
          label="Demand collected"
          code="PT"
          value="₹1.86"
          unit="Cr"
          delta="12% vs last quarter"
          deltaDirection="up"
          goodWhen="up"
          status="Ahead of target"
          series={[0.9, 1.1, 1.2, 1.35, 1.5, 1.7, 1.86]}
          barColour="bg-sage-deep"
          source="Mohali treasury, FY 2026"
        />
      </div>
      <Specimen name="Bar list" code="CHART-BAR">
        <BarList
          source="PGR ledger, Kanpur, May 2026"
          items={[
            { label: 'Garbage', value: 1840, display: '1,840', colour: 'bg-slate' },
            { label: 'Streetlight', value: 1120, display: '1,120', colour: 'bg-slate' },
            { label: 'Drainage', value: 860, display: '860', colour: 'bg-slate' },
            { label: 'Water supply', value: 640, display: '640', colour: 'bg-slate' },
            { label: 'Encroachment', value: 290, display: '290', colour: 'bg-slate' },
          ]}
        />
      </Specimen>
    </Section>
  )
}

function ModalsSection() {
  const [assign, setAssign] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const [ward, setWard] = useState<string | null>('w12')
  const { push } = useToast()
  return (
    <Section
      id="modals"
      group="Application components"
      title="Modals"
      headline="Interrupt only for"
      accent="a decision."
      intro="Modals hold one decision. The header strip names the record and its code. Escape closes, focus is trapped and returned. Destructive confirmations name exactly what will change."
    >
      <Specimen name="Modals" code="MDL">
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setAssign(true)}>Assign grievance</Button>
          <Button variant="critical" onClick={() => setConfirm(true)}>
            Disable camera
          </Button>
        </div>
      </Specimen>
      <Modal
        open={assign}
        onClose={() => setAssign(false)}
        label="Assign grievance"
        code="PGR-24-08812"
        title="Send to a field officer in"
        accent="Ward 12."
        footer={
          <>
            <Button variant="ghost" onClick={() => setAssign(false)}>
              Cancel
            </Button>
            <Button
              variant="brand"
              onClick={() => {
                setAssign(false)
                push({ tone: 'success', module: 'PGR', title: 'Assigned to Ravi Shukla.', body: 'SMS sent to the citizen.' })
              }}
            >
              Assign
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-5">
          <p className="type-body-s text-text-muted">Garbage not collected · filed 12 June, 09:14 · 26 hours left on SLA.</p>
          <Select label="Ward" options={wards} value={ward} onChange={setWard} />
          <Input label="Officer" defaultValue="Ravi Shukla · Zone 2" />
          <Textarea label="Note to officer" placeholder="Anything the officer should know" />
        </div>
      </Modal>
      <Modal
        open={confirm}
        onClose={() => setConfirm(false)}
        size="sm"
        label="Confirm"
        code="CAM-KNP-0417"
        title="Disable this camera for"
        accent="all users?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirm(false)}>
              Keep camera on
            </Button>
            <Button
              variant="critical"
              onClick={() => {
                setConfirm(false)
                push({ tone: 'critical', module: 'VMS', title: 'CAM-KNP-0417 disabled.', body: 'Recording stopped at Mall Road junction.' })
              }}
            >
              Disable camera
            </Button>
          </>
        }
      >
        <p className="type-body-s text-text-muted">Recording stops at Mall Road junction. Detections from this camera will not reach PGR. You can enable it again from Camera health.</p>
      </Modal>
    </Section>
  )
}

function TabsSection() {
  const [t1, setT1] = useState<'open' | 'progress' | 'closed' | 'rejected'>('open')
  const [t2, setT2] = useState<'live' | 'recorded' | 'detections'>('live')
  const [t3, setT3] = useState<'overview' | 'owner' | 'assessment' | 'payments'>('overview')
  return (
    <Section
      id="tabs"
      group="Application components"
      title="Tabs"
      headline="Views of one record,"
      accent="side by side."
      intro="Line tabs sit on a 1px rule with a 2px ink marker. Boxed tabs switch modes. Vertical tabs organise long records. Arrow keys move between tabs."
    >
      <div className="flex flex-col gap-6">
        <Specimen name="Line" code="TAB-LINE">
          <Tabs
            label="Grievance status"
            value={t1}
            onChange={setT1}
            items={[
              { value: 'open', label: 'Open', count: 412 },
              { value: 'progress', label: 'In progress', count: 186 },
              { value: 'closed', label: 'Closed with proof', count: 2310 },
              { value: 'rejected', label: 'Rejected', count: 44 },
            ]}
          />
          <TabPanel className="pt-5">
            <p className="type-body-s text-text-muted">
              Showing <span className="font-medium text-text">{t1 === 'open' ? 412 : t1 === 'progress' ? 186 : t1 === 'closed' ? '2,310' : 44}</span> grievances in Zone 2.
            </p>
          </TabPanel>
        </Specimen>
        <div className="grid gap-6 lg:grid-cols-2">
          <Specimen name="Boxed" code="TAB-BOX">
            <Tabs
              variant="boxed"
              label="Camera view"
              value={t2}
              onChange={setT2}
              items={[
                { value: 'live', label: 'Live' },
                { value: 'recorded', label: 'Recorded' },
                { value: 'detections', label: 'Detections', count: 128 },
              ]}
            />
            <TabPanel className="mt-4">
              <div className="relative flex aspect-video items-end bg-grad-ink p-3">
                <span className="absolute top-1/4 left-1/3 h-1/3 w-1/4 border border-white">
                  <span className="absolute -top-5 left-0 bg-paper px-1.5 type-caption text-ink">Vehicle · 0.91</span>
                </span>
                <span className="type-caption text-paper">CAM-KNP-0417 · {t2} · 09:52:14</span>
              </div>
              <Caption className="mt-2 block">Seen: Mall Road junction. Tags illustrative.</Caption>
            </TabPanel>
          </Specimen>
          <Specimen name="Vertical" code="TAB-VERT">
            <div className="flex gap-6">
              <Tabs
                variant="vertical"
                label="Property record"
                value={t3}
                onChange={setT3}
                items={[
                  { value: 'overview', label: 'Overview' },
                  { value: 'owner', label: 'Owner' },
                  { value: 'assessment', label: 'Assessment' },
                  { value: 'payments', label: 'Payments', count: 6 },
                ]}
              />
              <TabPanel className="flex-1">
                <span className="type-label text-text-label">MOH-PID-118204 · {t3}</span>
                <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 type-body-s">
                  <dt className="text-text-muted">Use</dt>
                  <dd className="text-text">Commercial</dd>
                  <dt className="text-text-muted">Built-up area</dt>
                  <dd className="text-text">312 m²</dd>
                  <dt className="text-text-muted">Dues</dt>
                  <dd className="text-text">₹48,200</dd>
                  <dt className="text-text-muted">Ground check</dt>
                  <dd>
                    <Badge tone="success">Matched</Badge>
                  </dd>
                </dl>
              </TabPanel>
            </div>
          </Specimen>
        </div>
      </div>
    </Section>
  )
}

export function Application() {
  const [cmd, setCmd] = useState(false)
  const { push } = useToast()
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
  const cmds = useMemo(() => commands((label) => push({ tone: 'info', title: `Opened ${label}` })), [push])
  return (
    <>
      <ActivitySection />
      <AlertsSection />
      <NavigationSection onOpenCommand={() => setCmd(true)} />
      <BreadcrumbsSection />
      <CalendarSection />
      <DataTableSection />
      <DatePickerSection />
      <CommandSection onOpen={() => setCmd(true)} />
      <DrawerSection />
      <StatesSection />
      <MetricsSection />
      <ModalsSection />
      <TabsSection />
      <CommandMenu open={cmd} onClose={() => setCmd(false)} commands={cmds} />
    </>
  )
}
