import { useState } from 'react'
import {
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  ButtonGroup,
  Caption,
  Checkbox,
  CountBadge,
  Dropdown,
  IconButton,
  Input,
  ProgressBar,
  ProgressRing,
  Radio,
  SegmentedProgress,
  Select,
  Slider,
  StageTag,
  Stepper,
  Tag,
  Textarea,
  TextEditor,
  Toggle,
  Tooltip,
  useProjectTheme,
  useToast,
} from '@/ds'
import { categories, wards } from './data'
import { Rules, Section, Specimen } from './Doc'
import { AccordionSection, FileUploadSection, PaginationSection } from './Extra'

function AvatarSection() {
  return (
    <Section
      id="avatar"
      group="Base components"
      title="Avatar"
      headline="People stand out as"
      accent="the only circles."
      intro="Avatars are the one round element. Photos are greyscale with a 2px paper ring. Without a photo, initials sit in slate-deep on paper. Never a stock face."
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <Specimen name="Sizes" code="AV-XS · XL">
          <div className="flex items-end gap-4">
            {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((s) => (
              <div key={s} className="flex flex-col items-center gap-2">
                <Avatar name="Ayushi Mishra" size={s} />
                <Caption>{s}</Caption>
              </div>
            ))}
          </div>
        </Specimen>
        <Specimen name="Presence" code="AV-STATUS">
          <div className="flex items-center gap-6">
            {(
              [
                ['Ravi Shukla', 'online'],
                ['Neha Verma', 'away'],
                ['Arjun Tiwari', 'offline'],
              ] as const
            ).map(([n, p]) => (
              <div key={n} className="flex flex-col items-center gap-2">
                <Avatar name={n} presence={p} size="lg" />
                <Caption>{p}</Caption>
              </div>
            ))}
          </div>
        </Specimen>
        <Specimen name="Group and assignee" code="AV-GROUP">
          <div className="flex flex-col gap-5">
            <AvatarGroup names={['Ravi Shukla', 'Neha Verma', 'Arjun Tiwari', 'Pooja Saxena', 'Imran Khan', 'Divya Rao']} />
            <div className="flex items-center gap-3 border-t border-border pt-4">
              <Avatar name="Ravi Shukla" size="md" presence="online" />
              <div className="flex flex-col">
                <span className="type-body-s font-medium text-text">Ravi Shukla</span>
                <span className="type-label text-text-label">Field officer · Zone 2</span>
              </div>
            </div>
          </div>
        </Specimen>
      </div>
    </Section>
  )
}

function BadgesSection() {
  return (
    <Section
      id="badges"
      group="Base components"
      title="Badges"
      headline="Status said in a word,"
      accent="never colour alone."
      intro="Badges are square with a mono label and a 6px square. Stage tags are the only pill. Count badges sit in navigation and tabs."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Specimen name="Status · outline" code="BDG-OUT">
          <div className="flex flex-wrap gap-2">
            <Badge tone="neutral">Draft</Badge>
            <Badge tone="info">Assigned</Badge>
            <Badge tone="success">Closed with proof</Badge>
            <Badge tone="caution">SLA at risk</Badge>
            <Badge tone="critical">Escalated</Badge>
          </div>
        </Specimen>
        <Specimen name="Status · soft" code="BDG-SOFT">
          <div className="flex flex-wrap gap-2">
            <Badge variant="soft" tone="neutral">Unassessed</Badge>
            <Badge variant="soft" tone="info">Under survey</Badge>
            <Badge variant="soft" tone="success">Paid</Badge>
            <Badge variant="soft" tone="caution">Dues pending</Badge>
            <Badge variant="soft" tone="critical">Camera offline</Badge>
          </div>
        </Specimen>
        <Specimen name="Stage tags" code="STAGE">
          <div className="flex flex-wrap items-center gap-3">
            <StageTag stage="live" />
            <StageTag stage="pilot" />
            <StageTag stage="prototype" />
          </div>
          <Caption className="mt-4 block">PGR Live · VMS Pilot · Property Tax Prototype. Product pages only.</Caption>
        </Specimen>
        <Specimen name="On dark grounds" code="STAGE · INK" dark>
          <div className="flex flex-wrap items-center gap-3">
            <StageTag stage="live" />
            <StageTag stage="pilot" />
            <StageTag stage="prototype" />
            <Badge tone="info">Assigned</Badge>
            <Badge variant="soft" tone="critical">Escalated</Badge>
          </div>
        </Specimen>
        <Specimen name="Counts" code="CNT">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 type-body-s text-text">
              Inbox <CountBadge value={42} />
            </span>
            <span className="flex items-center gap-2 type-body-s text-text">
              Escalated <CountBadge value={7} tone="critical" />
            </span>
            <span className="flex items-center gap-2 type-body-s text-text">
              Detections <CountBadge value={128} />
            </span>
          </div>
        </Specimen>
      </div>
    </Section>
  )
}

function ButtonsSection() {
  const [view, setView] = useState<'list' | 'map' | 'board'>('list')
  const [range, setRange] = useState<'7d' | '30d' | 'q'>('30d')
  const [loading, setLoading] = useState(false)
  const { theme } = useProjectTheme()
  return (
    <Section
      id="buttons"
      group="Base components"
      title="Button group"
      headline="One clear action,"
      accent="square and plain."
      intro="Primary is ink. Brand is slate-deep for the main action inside a module. Secondary carries a 1px rule. Critical is reserved for destructive or irreversible steps. Verbs name what happens."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Specimen name="Variants" code="BTN">
          <div className="flex flex-wrap gap-3">
            <Button>Assign grievance</Button>
            <Button variant="brand">Close with proof</Button>
            <Button variant="secondary">Export CSV</Button>
            <Button variant="ghost">Cancel</Button>
            <Button variant="critical">Reject claim</Button>
            <Button variant="link">View audit trail</Button>
          </div>
        </Specimen>
        <Specimen name="Sizes and states" code="BTN-SIZE">
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg" trailing="arrow-right">
              Large
            </Button>
            <Button disabled>Disabled</Button>
            <Button
              variant="secondary"
              loading={loading}
              onClick={() => {
                setLoading(true)
                setTimeout(() => setLoading(false), 1800)
              }}
            >
              {loading ? 'Syncing' : 'Sync records'}
            </Button>
          </div>
        </Specimen>
        <Specimen name="Button group" code="BTN-GRP">
          <div className="flex flex-col gap-5">
            <ButtonGroup
              label="View"
              value={view}
              onChange={setView}
              options={[
                { value: 'list', label: 'List', count: 412 },
                { value: 'map', label: 'Ward map' },
                { value: 'board', label: 'Board' },
              ]}
            />
            <ButtonGroup
              label="Period"
              size="sm"
              value={range}
              onChange={setRange}
              options={[
                { value: '7d', label: '7 days' },
                { value: '30d', label: '30 days' },
                { value: 'q', label: 'Quarter' },
              ]}
            />
          </div>
        </Specimen>
        <Specimen name="Icon buttons and toolbar" code="BTN-ICON">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex border border-rule">
              <IconButton glyph="chevron-left" label="Previous camera" />
              <span className="flex items-center border-x border-rule px-4 font-mono text-[12px] text-text">CAM-KNP-0417</span>
              <IconButton glyph="chevron-right" label="Next camera" />
            </div>
            <IconButton glyph="plus" label="Add" variant="secondary" />
            <IconButton glyph="more" label="More actions" variant="secondary" />
          </div>
        </Specimen>
        <Specimen name={`On project ground · ${theme.tabLabel}`} code={`GROUND · ${theme.primaryToken.toUpperCase()}`} className="lg:col-span-2" bodyClass="p-0!">
          <div className="grain flex flex-wrap items-center justify-between gap-4 p-6" style={{ backgroundImage: theme.groundCss }}>
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[11px] font-medium tracking-[0.08em] uppercase" style={{ color: 'var(--project-ground-fg)' }}>
                {theme.groundLabel} ({theme.groundStops})
              </span>
              <span className="type-body-s" style={{ color: 'var(--project-ground-fg)' }}>
                Primary CTA uses {theme.primaryLabel} ({theme.primary}) with automatic accessible foreground.
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button trailing="arrow-right">Submit {theme.name.toLowerCase()} record</Button>
              <Button variant="secondary" className="bg-surface text-text">
                Download report
              </Button>
            </div>
          </div>
        </Specimen>
        <Specimen name="On dark grounds" code="BTN · INK" dark className="lg:col-span-2">
          <div className="flex flex-wrap gap-3">
            <Button>Open live wall</Button>
            <Button variant="brand">Acknowledge alert</Button>
            <Button variant="secondary">Export clip</Button>
            <Button variant="ghost">Dismiss</Button>
          </div>
        </Specimen>
      </div>
    </Section>
  )
}

function CheckboxSection() {
  const [items, setItems] = useState({ photo: true, geo: true, sign: false })
  const all = Object.values(items)
  const allOn = all.every(Boolean)
  const some = all.some(Boolean) && !allOn
  const [route, setRoute] = useState('zonal')
  return (
    <Section
      id="checkbox"
      group="Base components"
      title="Checkbox"
      headline="Square marks for"
      accent="square decisions."
      intro="Checkboxes fill with slate-deep when checked. Radios stay square with an inset square, so the circle remains reserved for people."
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <Specimen name="Closure proof" code="PGR · CHK">
          <div className="flex flex-col gap-4">
            <Checkbox
              label="All proof attached"
              checked={allOn}
              indeterminate={some}
              onChange={(v) => setItems({ photo: v, geo: v, sign: v })}
            />
            <div className="ml-7 flex flex-col gap-3 border-l border-border pl-4">
              <Checkbox label="After photo" description="Taken on site, timestamped" checked={items.photo} onChange={(v) => setItems({ ...items, photo: v })} />
              <Checkbox label="Geo-tag within 50 m" checked={items.geo} onChange={(v) => setItems({ ...items, geo: v })} />
              <Checkbox label="Citizen sign-off" checked={items.sign} onChange={(v) => setItems({ ...items, sign: v })} />
            </div>
          </div>
        </Specimen>
        <Specimen name="States" code="CHK-STATE">
          <div className="flex flex-col gap-4">
            <Checkbox label="Unchecked" checked={false} onChange={() => {}} />
            <Checkbox label="Checked" checked onChange={() => {}} />
            <Checkbox label="Indeterminate" checked={false} indeterminate onChange={() => {}} />
            <Checkbox label="Invalid" description="Accept the terms to continue." invalid checked={false} onChange={() => {}} />
            <Checkbox label="Disabled" disabled checked onChange={() => {}} />
          </div>
        </Specimen>
        <Specimen name="Radio · escalation route" code="RAD">
          <div className="flex flex-col gap-4">
            {[
              ['zonal', 'Zonal officer', 'Within 24 hours'],
              ['commissioner', 'Additional commissioner', 'Within 72 hours'],
              ['cm', 'IGRS (Integrated Grievance Redressal System)', 'State portal'],
            ].map(([v, l, d]) => (
              <Radio key={v} name="route" value={v} label={l} description={d} checked={route === v} onChange={setRoute} />
            ))}
            <Radio name="route" value="x" label="Ward councillor" description="Not available for this category" disabled checked={false} onChange={() => {}} />
          </div>
        </Specimen>
      </div>
    </Section>
  )
}

function DropdownSection() {
  const { push } = useToast()
  const note = (t: string) => push({ tone: 'info', title: t, module: 'PGR' })
  return (
    <Section
      id="dropdown"
      group="Base components"
      title="Dropdown"
      headline="Actions grouped,"
      accent="nothing hidden."
      intro="Menus open below their trigger on a 1px rule border. Groups take mono labels. Destructive items sit last, in critical, after a separator."
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <Specimen name="Grievance actions" code="MENU" bodyClass="min-h-80">
          <Dropdown
            trigger={({ open, toggle }) => (
              <Button variant="secondary" trailing={open ? 'chevron-up' : 'chevron-down'} onClick={toggle} aria-expanded={open}>
                PGR-24-08812
              </Button>
            )}
            items={[
              { type: 'label', label: 'Workflow' },
              { type: 'item', label: 'Assign to officer', shortcut: 'A', onSelect: () => note('Assigned to Ravi Shukla') },
              { type: 'item', label: 'Change category', shortcut: 'C', onSelect: () => note('Category changed') },
              { type: 'item', label: 'Escalate', hint: 'To zonal officer', shortcut: 'E', onSelect: () => note('Escalated to zonal officer') },
              { type: 'separator' },
              { type: 'label', label: 'Record' },
              { type: 'item', label: 'Copy link', shortcut: 'L', onSelect: () => note('Link copied') },
              { type: 'item', label: 'Merge duplicate', disabled: true },
              { type: 'separator' },
              { type: 'item', label: 'Reject as invalid', critical: true, onSelect: () => note('Marked invalid') },
            ]}
          />
        </Specimen>
        <Specimen name="Camera overflow" code="VMS · MENU" bodyClass="min-h-80">
          <div className="flex items-center justify-between border border-border px-3 py-2">
            <span className="flex flex-col">
              <span className="font-mono text-[12px] text-text">CAM-KNP-0417</span>
              <span className="type-body-s text-text-muted">Mall Road junction</span>
            </span>
            <Dropdown
              align="end"
              width="w-56"
              trigger={({ toggle, open }) => <IconButton glyph="more" label="Camera actions" onClick={toggle} aria-expanded={open} />}
              items={[
                { type: 'item', label: 'Open live view', onSelect: () => note('Live view opened') },
                { type: 'item', label: 'Export last 15 min', onSelect: () => note('Clip export queued') },
                { type: 'item', label: 'Mark for maintenance', onSelect: () => note('Maintenance ticket raised') },
                { type: 'separator' },
                { type: 'item', label: 'Disable camera', critical: true, onSelect: () => note('Camera disabled') },
              ]}
            />
          </div>
        </Specimen>
        <Specimen name="Property tax filters" code="PT · MENU" bodyClass="min-h-80">
          <Dropdown
            trigger={({ open, toggle }) => (
              <Button variant="ghost" trailing={open ? 'chevron-up' : 'chevron-down'} onClick={toggle}>
                Sort: highest dues
              </Button>
            )}
            items={[
              { type: 'label', label: 'Sort by' },
              { type: 'item', label: 'Highest dues' },
              { type: 'item', label: 'Oldest assessment' },
              { type: 'item', label: 'Ground mismatch first' },
              { type: 'item', label: 'Property ID' },
            ]}
          />
        </Specimen>
      </div>
    </Section>
  )
}

function InputsSection() {
  const [mobile, setMobile] = useState('98390')
  const [desc, setDesc] = useState('Garbage has not been collected from the lane behind Swaroop Nagar market for four days.')
  return (
    <Section
      id="inputs"
      group="Base components"
      title="Inputs"
      headline="Fields that say what they"
      accent="expect and why."
      intro="Labels sit above in mono. Helper text states the format. Errors name the problem and the fix, in plain words, with a critical square."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Specimen name="Text fields" code="INP">
          <div className="grid gap-5 sm:grid-cols-2">
            <Input label="Complainant name" placeholder="Full name" required />
            <Input
              label="Mobile number"
              prefix="+91"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
              error={mobile.length < 10 ? `Enter all 10 digits. ${10 - mobile.length} missing.` : undefined}
              hint="Updates are sent by SMS."
              inputMode="numeric"
            />
            <Input label="Search grievances" leading="search" placeholder="Number, ward or keyword" />
            <Input label="Annual rental value" prefix="₹" suffix="per year" placeholder="0" hint="As per the 2024 self-assessment." />
            <Input label="Property ID" defaultValue="MOH-PID-118204" disabled hint="Assigned by the survey. Cannot be edited." />
            <Input label="Landmark" optional placeholder="Near the water tank" />
          </div>
        </Specimen>
        <Specimen name="Textarea" code="INP-AREA">
          <Textarea
            label="Describe the problem"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            maxLength={280}
            hint="Say what, where and since when. Avoid personal details of others."
          />
        </Specimen>
      </div>
    </Section>
  )
}

function ProgressSection() {
  const [step, setStep] = useState(2)
  return (
    <Section
      id="progress"
      group="Base components"
      title="Progress indicator"
      headline="Flat bars and numbered steps,"
      accent="nothing round-ended."
      intro="Bars are flat and square-ended. Steppers number each stage and state it in words, so a grievance or a survey can be read at a glance."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Specimen name="Grievance lifecycle" code="PGR · STEP" className="lg:col-span-2">
          <Stepper
            current={step}
            steps={[
              { label: 'Filed', caption: '12 Jun · 09:14' },
              { label: 'Assigned', caption: '12 Jun · 09:40' },
              { label: 'In progress', caption: 'Ravi Shukla' },
              { label: 'Resolved', caption: 'Proof pending' },
              { label: 'Citizen confirmed' },
            ]}
          />
          <div className="mt-6 flex gap-2">
            <Button size="sm" variant="secondary" leading="arrow-left" onClick={() => setStep((s) => Math.max(0, s - 1))}>
              Back
            </Button>
            <Button size="sm" trailing="arrow-right" onClick={() => setStep((s) => Math.min(5, s + 1))}>
              Advance
            </Button>
          </div>
        </Specimen>
        <Specimen name="Linear" code="PRG-BAR">
          <div className="flex flex-col gap-5">
            <ProgressBar label="Closed within SLA, Zone 2" value={82} caption="328 of 400 this month" />
            <ProgressBar label="PT demand collected, Mohali" value={61} tone="sage" />
            <ProgressBar label="VMS storage used" value={93} tone="critical" caption="Archive footage older than 30 days" />
            <ProgressBar label="Importing ward boundaries" indeterminate size="sm" />
          </div>
        </Specimen>
        <Specimen name="Segmented and ring" code="PRG-SEG">
          <div className="flex flex-col gap-6">
            <SegmentedProgress label="Wards surveyed, Mohali" total={20} done={13} />
            <div className="flex items-center gap-6">
              <ProgressRing value={82} label="SLA met" />
              <ProgressRing value={97} label="Cameras online" />
              <ProgressRing value={61} label="Collection" />
            </div>
          </div>
        </Specimen>
        <Specimen name="Vertical" code="PT · STEP">
          <Stepper
            orientation="vertical"
            current={1}
            steps={[
              { label: 'Drone survey', caption: 'Complete · Mar 2026' },
              { label: 'Ground verification', caption: '42 of 50 sampled' },
              { label: 'Demand notice' },
            ]}
          />
        </Specimen>
      </div>
    </Section>
  )
}

function SelectSection() {
  const [ward, setWard] = useState<string | null>('w12')
  const [cat, setCat] = useState<string | null>(null)
  return (
    <Section
      id="select"
      group="Base components"
      title="Select"
      headline="Long lists, grouped and"
      accent="easy to filter."
      intro="Selects open a listbox below the field. Long lists such as wards add a filter and group by corporation. Meta text on the right gives context without opening a record."
    >
      <Specimen name="Select" code="SEL" bodyClass="min-h-96">
        <div className="grid gap-5 md:grid-cols-3">
          <Select label="Ward" options={wards} value={ward} onChange={setWard} searchable hint="Grouped by corporation." />
          <Select
            label="Category"
            options={categories}
            value={cat}
            onChange={setCat}
            placeholder="Choose a category"
            required
            error={cat ? undefined : 'Choose a category to route the complaint.'}
          />
          <Select label="Zone" options={[{ value: 'z2', label: 'Zone 2' }]} value="z2" onChange={() => {}} disabled hint="Set from the ward." />
        </div>
      </Specimen>
    </Section>
  )
}

function SliderSection() {
  const [retention, setRetention] = useState(30)
  const [rebate, setRebate] = useState(10)
  const [conf, setConf] = useState(0.7)
  return (
    <Section
      id="sliders"
      group="Base components"
      title="Sliders"
      headline="Thresholds set by hand, with"
      accent="the value in view."
      intro="Sliders have a flat track and a square thumb. The current value reads in Space Grotesk on the right. Marks show the allowed steps."
    >
      <Specimen name="Sliders" code="SLD">
        <div className="grid gap-8 md:grid-cols-3">
          <Slider label="Footage retention" value={retention} onChange={setRetention} min={7} max={90} step={1} format={(v) => `${v} days`} marks={[7, 30, 60, 90]} hint="Beyond 30 days needs commissioner approval." />
          <Slider label="Early payment rebate" value={rebate} onChange={setRebate} min={0} max={20} step={5} format={(v) => `${v}%`} marks={[0, 5, 10, 15, 20]} />
          <Slider label="Detection confidence" value={conf} onChange={setConf} min={0.5} max={0.95} step={0.05} format={(v) => v.toFixed(2)} hint="Lower values raise more false alerts." />
        </div>
        <div className="mt-8 max-w-sm">
          <Slider label="SLA hours (locked)" value={48} onChange={() => {}} min={0} max={96} disabled format={(v) => `${v} h`} />
        </div>
      </Specimen>
    </Section>
  )
}

function TagsSection() {
  const [filters, setFilters] = useState(['Ward 12', 'Garbage', 'Last 30 days', 'Escalated'])
  const [chosen, setChosen] = useState<string[]>(['Residential'])
  const types = ['Residential', 'Commercial', 'Mixed use', 'Institutional', 'Vacant plot']
  return (
    <Section
      id="tags"
      group="Base components"
      title="Tags"
      headline="Filters you can see and"
      accent="remove in one click."
      intro="Tags are square chips. Removable tags show active filters. Selectable tags toggle between ink and paper. A 6px square ties a tag to its module."
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <Specimen name="Active filters" code="TAG-RM">
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <Tag key={f} onRemove={() => setFilters(filters.filter((x) => x !== f))}>
                {f}
              </Tag>
            ))}
            {filters.length === 0 ? <span className="type-body-s text-text-muted">No filters. Showing all 412 grievances.</span> : null}
          </div>
          {filters.length < 4 ? (
            <Button size="sm" variant="link" className="mt-3" onClick={() => setFilters(['Ward 12', 'Garbage', 'Last 30 days', 'Escalated'])}>
              Reset filters
            </Button>
          ) : null}
        </Specimen>
        <Specimen name="Selectable" code="TAG-SEL">
          <div className="flex flex-wrap gap-2">
            {types.map((t) => (
              <Tag key={t} selected={chosen.includes(t)} onClick={() => setChosen(chosen.includes(t) ? chosen.filter((x) => x !== t) : [...chosen, t])}>
                {t}
              </Tag>
            ))}
          </div>
        </Specimen>
        <Specimen name="Module tags" code="TAG-MOD">
          <div className="flex flex-wrap gap-2">
            <Tag colour="bg-slate">PGR</Tag>
            <Tag colour="bg-rose">VMS</Tag>
            <Tag colour="bg-sage-deep">Property tax</Tag>
            <Tag colour="bg-slate">Sanitation</Tag>
            <Tag colour="bg-rose">Traffic</Tag>
          </div>
        </Specimen>
      </div>
    </Section>
  )
}

function EditorSection() {
  const { push } = useToast()
  return (
    <Section
      id="editor"
      group="Base components"
      title="Text editors"
      headline="Notes written once,"
      accent="read by many."
      intro="The editor serves resolution remarks, inspection notes and notice drafts. The toolbar uses letters and words, not icons. Lists take the 6px square bullet."
    >
      <TextEditor
        label="Resolution remarks · PGR-24-08812"
        initialHTML="<h3>Site visit, 13 June</h3><p>Lane cleared by the sanitation crew at <b>07:40</b>. Collection point moved 20 m east, away from the drain.</p><ul><li>After photo attached</li><li>Citizen informed by phone</li></ul>"
        maxLength={1200}
        hint="Remarks are visible to the citizen. Keep them factual."
        footer={
          <>
            <span className="type-caption text-text-muted">Autosaved 09:52</span>
            <span className="flex gap-2">
              <Button size="sm" variant="ghost">
                Discard
              </Button>
              <Button size="sm" variant="brand" onClick={() => push({ tone: 'success', title: 'Remarks saved to PGR-24-08812', module: 'PGR' })}>
                Save remarks
              </Button>
            </span>
          </>
        }
      />
    </Section>
  )
}

function TogglesSection() {
  const [t, setT] = useState({ sms: true, wa: false, night: true, auto: false })
  return (
    <Section
      id="toggles"
      group="Base components"
      title="Toggles"
      headline="Settings that take effect"
      accent="at once."
      intro="Switches are square, like every other control. The state word sits beside the track, so On and Off never depend on colour."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Specimen name="Notification settings" code="TGL">
          <div className="flex flex-col divide-y divide-border">
            <div className="pb-4">
              <Toggle label="SMS updates to citizen" description="Sent on assignment and closure." checked={t.sms} onChange={(v) => setT({ ...t, sms: v })} />
            </div>
            <div className="py-4">
              <Toggle label="WhatsApp updates" description="Needs an approved template." checked={t.wa} onChange={(v) => setT({ ...t, wa: v })} />
            </div>
            <div className="py-4">
              <Toggle label="Night-vision mode" description="VMS cameras switch at dusk." checked={t.night} onChange={(v) => setT({ ...t, night: v })} />
            </div>
            <div className="pt-4">
              <Toggle label="Auto-generate demand notices" description="Locked by the corporation." checked={t.auto} disabled onChange={() => {}} />
            </div>
          </div>
        </Specimen>
        <Specimen name="Compact and on dark" code="TGL · INK" dark>
          <div className="flex flex-col gap-4">
            <Toggle size="sm" label="Show detection boxes" checked={t.night} onChange={(v) => setT({ ...t, night: v })} />
            <Toggle size="sm" label="Show ward boundaries" checked={t.sms} onChange={(v) => setT({ ...t, sms: v })} />
            <Toggle size="sm" label="Show timestamps" checked onChange={() => {}} />
          </div>
        </Specimen>
      </div>
    </Section>
  )
}

function TooltipSection() {
  return (
    <Section
      id="tooltip"
      group="Base components"
      title="Tooltip"
      headline="Short definitions,"
      accent="on hover and focus."
      intro="Tooltips are ink panels with paper text and a square notch. They explain terms and acronyms. They never hold actions or the only copy of important information."
    >
      <Specimen name="Tooltip" code="TIP" bodyClass="py-16">
        <div className="flex flex-wrap items-center justify-center gap-10">
          <Tooltip label="SLA" content="Service level agreement. Garbage complaints must close within 48 hours.">
            <Button variant="secondary">SLA 48 h</Button>
          </Tooltip>
          <Tooltip side="bottom" content="ARV is the annual rental value used to compute the tax.">
            <Button variant="link">What is ARV?</Button>
          </Tooltip>
          <Tooltip side="right" label="CAM-KNP-0233" content="Offline for 2 h 14 min. Last frame 07:38.">
            <span tabIndex={0}>
              <Badge variant="soft" tone="critical">
                Offline
              </Badge>
            </span>
          </Tooltip>
          <Tooltip side="left" content="Export the current view as CSV">
            <IconButton glyph="arrow-right" label="Export" variant="secondary" />
          </Tooltip>
        </div>
      </Specimen>
      <Rules items={['Spell out the acronym on first use, then the short form.', 'Keep to one or two lines. If it needs more, use a help panel.']} />
    </Section>
  )
}

export function Base() {
  return (
    <>
      <AccordionSection />
      <AvatarSection />
      <BadgesSection />
      <ButtonsSection />
      <CheckboxSection />
      <DropdownSection />
      <FileUploadSection />
      <InputsSection />
      <PaginationSection />
      <ProgressSection />
      <SelectSection />
      <SliderSection />
      <TagsSection />
      <EditorSection />
      <TogglesSection />
      <TooltipSection />
    </>
  )
}
