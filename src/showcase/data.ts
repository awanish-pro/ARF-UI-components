import type { CalendarEvent, Command, NavSection, SelectOption } from '@/ds'

export const modules = {
  pgr: { code: 'PGR', name: 'Public Grievance Redressal', colour: 'bg-slate' },
  vms: { code: 'VMS', name: 'Video Management System', colour: 'bg-rose' },
  pt: { code: 'PT', name: 'Property Tax', colour: 'bg-sage-deep' },
} as const

export const wards: SelectOption[] = [
  { value: 'w12', label: 'Ward 12 · Swaroop Nagar', meta: '412 open', group: 'Kanpur Nagar Nigam' },
  { value: 'w18', label: 'Ward 18 · Kidwai Nagar', meta: '286 open', group: 'Kanpur Nagar Nigam' },
  { value: 'w27', label: 'Ward 27 · Govind Nagar', meta: '198 open', group: 'Kanpur Nagar Nigam' },
  { value: 'w33', label: 'Ward 33 · Kakadeo', meta: '154 open', group: 'Kanpur Nagar Nigam' },
  { value: 'm04', label: 'Ward 4 · Phase 7', meta: 'Survey', group: 'Mohali Municipal Corporation' },
  { value: 'm11', label: 'Ward 11 · Sector 70', meta: 'Survey', group: 'Mohali Municipal Corporation' },
  { value: 'm19', label: 'Ward 19 · Sector 82', meta: 'Paused', group: 'Mohali Municipal Corporation', disabled: true },
]

export const categories: SelectOption[] = [
  { value: 'garbage', label: 'Garbage not collected' },
  { value: 'streetlight', label: 'Streetlight not working' },
  { value: 'drain', label: 'Drain blocked or overflowing' },
  { value: 'water', label: 'No water supply' },
  { value: 'road', label: 'Pothole or damaged road' },
  { value: 'encroach', label: 'Encroachment on public land' },
]

const y = new Date().getFullYear()
const m = new Date().getMonth()
export const calendarEvents: CalendarEvent[] = [
  { date: new Date(y, m, 4), label: 'PGR · Weekly closure review, Zone 2', colour: 'bg-slate' },
  { date: new Date(y, m, 9), label: 'PT · Self-assessment window opens, Mohali', colour: 'bg-sage-deep' },
  { date: new Date(y, m, 9), label: 'VMS · Camera audit, Mall Road junction', colour: 'bg-rose' },
  { date: new Date(y, m, 14), label: 'PGR · Escalation hearing with Zonal Officer', colour: 'bg-slate' },
  { date: new Date(y, m, 18), label: 'VMS · Firmware rollout, 64 cameras', colour: 'bg-rose' },
  { date: new Date(y, m, 22), label: 'PT · Rebate deadline, 10% early payment', colour: 'bg-sage-deep' },
  { date: new Date(y, m, 22), label: 'PGR · Citizen feedback survey closes', colour: 'bg-slate' },
  { date: new Date(y, m, 28), label: 'PT · Defaulter notices issued, Ward 11', colour: 'bg-sage-deep' },
]

export const navSections: NavSection[] = [
  {
    label: 'Grievances',
    code: 'PGR',
    colour: 'bg-slate',
    items: [
      { id: 'pgr-inbox', label: 'Inbox', count: 42 },
      { id: 'pgr-escalated', label: 'Escalated', count: 7, urgent: true },
      { id: 'pgr-closed', label: 'Closed with proof' },
    ],
  },
  {
    label: 'Video',
    code: 'VMS',
    colour: 'bg-rose',
    items: [
      { id: 'vms-live', label: 'Live wall' },
      { id: 'vms-events', label: 'Detections', count: 128 },
      { id: 'vms-health', label: 'Camera health', count: 3, urgent: true },
    ],
  },
  {
    label: 'Property tax',
    code: 'PT',
    colour: 'bg-sage-deep',
    items: [
      { id: 'pt-register', label: 'Property register' },
      { id: 'pt-mismatch', label: 'Ground mismatches', count: 8 },
      { id: 'pt-collection', label: 'Collection' },
    ],
  },
]

export const commands = (run: (label: string) => void): Command[] => [
  { id: 'g1', group: 'Grievances', label: 'PGR-24-08812', meta: 'Garbage not collected · Ward 12', colour: 'bg-slate', onRun: () => run('PGR-24-08812') },
  { id: 'g2', group: 'Grievances', label: 'PGR-24-08790', meta: 'Streetlight · Ward 18 · Escalated', colour: 'bg-slate', onRun: () => run('PGR-24-08790') },
  { id: 'c1', group: 'Cameras', label: 'CAM-KNP-0417', meta: 'Mall Road junction · Online', colour: 'bg-rose', onRun: () => run('CAM-KNP-0417') },
  { id: 'c2', group: 'Cameras', label: 'CAM-KNP-0233', meta: 'Bada Chauraha · Offline 2 h', colour: 'bg-rose', onRun: () => run('CAM-KNP-0233') },
  { id: 'p1', group: 'Properties', label: 'MOH-PID-118204', meta: 'Sector 70 · Commercial · Dues ₹48,200', colour: 'bg-sage-deep', onRun: () => run('MOH-PID-118204') },
  { id: 'p2', group: 'Properties', label: 'MOH-PID-097311', meta: 'Phase 7 · Residential · Paid', colour: 'bg-sage-deep', onRun: () => run('MOH-PID-097311') },
  { id: 'a1', group: 'Actions', label: 'File a new grievance', shortcut: 'G N', onRun: () => run('New grievance') },
  { id: 'a2', group: 'Actions', label: 'Open live camera wall', shortcut: 'V L', onRun: () => run('Live wall') },
  { id: 'a3', group: 'Actions', label: 'Generate demand notice', shortcut: 'T D', onRun: () => run('Demand notice') },
]
