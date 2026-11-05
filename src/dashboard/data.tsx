import type { Activity, ChartTone, ScatterPoint, Tile, TimelineEvent } from '@/ds'

export type Period = '7d' | '30d' | '90d'
export type City = 'kanpur' | 'mohali'
export type Page = 'overview' | 'pgr' | 'vms' | 'pt'

export const cities: Record<City, { name: string; body: string; short: string }> = {
  kanpur: { name: 'Kanpur', body: 'Kanpur Nagar Nigam', short: 'KNP' },
  mohali: { name: 'Mohali', body: 'Mohali Municipal Corporation', short: 'MOH' },
}

/** Deterministic pseudo-random numbers so the same filters always show the same data. */
function rng(seed: number) {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const hash = (s: string) => [...s].reduce((h, c) => (Math.imul(h, 31) + c.charCodeAt(0)) | 0, 7)

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const fmtDay = (d: Date) => `${String(d.getDate()).padStart(2, '0')} ${MONTHS[d.getMonth()]}`

function periodLabels(p: Period) {
  const today = new Date()
  if (p === '7d') return Array.from({ length: 7 }, (_, i) => DAYS[new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6 + i).getDay()])
  if (p === '30d') return Array.from({ length: 30 }, (_, i) => fmtDay(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 29 + i)))
  return Array.from({ length: 13 }, (_, i) => fmtDay(new Date(today.getFullYear(), today.getMonth(), today.getDate() - (12 - i) * 7)))
}

/* ---------------- Wards ---------------- */

const kanpurNames = ['Swaroop Nagar', 'Kidwai Nagar', 'Govind Nagar', 'Kakadeo', 'Arya Nagar', 'Civil Lines', 'Gwaltoli', 'Chaman Ganj', 'Parade', 'Juhi', 'Barra', 'Panki', 'Kalyanpur', 'Rawatpur', 'Shyam Nagar', 'Jajmau', 'Harsh Nagar', 'Tilak Nagar', 'Sisamau', 'Fazalganj', 'Nawabganj', 'Gumti', 'Naubasta', 'Yashoda Nagar', 'Kaushalpuri', 'Lajpat Nagar', 'Ashok Nagar', 'Benajhabar', 'Pandu Nagar', 'Vikas Nagar', 'Ratan Lal Nagar', 'Mall Road']
const mohaliNames = ['Phase 1', 'Phase 2', 'Phase 3A', 'Phase 3B', 'Phase 4', 'Phase 5', 'Phase 6', 'Phase 7', 'Phase 8', 'Phase 9', 'Phase 10', 'Phase 11', 'Sector 48', 'Sector 57', 'Sector 66', 'Sector 68', 'Sector 69', 'Sector 70', 'Sector 71', 'Sector 76', 'Sector 77', 'Sector 78', 'Sector 79', 'Sector 80', 'Sector 82', 'Mataur', 'Sohana', 'Kumbra', 'Shahi Majra', 'Madanpura', 'Balongi', 'Badmajra']
// A rough city outline on a 8 x 6 tile grid.
const layout: [number, number][] = [
  [0, 2], [0, 3], [0, 4],
  [1, 1], [1, 2], [1, 3], [1, 4], [1, 5],
  [2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6],
  [3, 0], [3, 1], [3, 2], [3, 3], [3, 4], [3, 5], [3, 6], [3, 7],
  [4, 1], [4, 2], [4, 3], [4, 4], [4, 5], [4, 6],
  [5, 2], [5, 3], [5, 5],
]

export function wardsFor(city: City) {
  const names = city === 'kanpur' ? kanpurNames : mohaliNames
  return layout.map(([row, col], i) => ({ id: `w${i + 1}`, label: String(i + 1), name: names[i], row, col }))
}

/* ---------------- Dataset ---------------- */

export type Grievance = {
  id: string
  category: string
  ward: string
  filed: string
  ageHours: number
  officer: string
  status: 'Open' | 'Assigned' | 'In progress' | 'Escalated' | 'Closed'
  slaLeft: number
}
export type Camera = { id: string; location: string; status: 'Online' | 'Degraded' | 'Offline'; uptime: number; lastFrame: string; detections: number }
export type Property = { pid: string; owner: string; sector: string; use: string; dues: number; years: number; matched: boolean }

const categories = ['Garbage not collected', 'Streetlight not working', 'Drain blocked', 'No water supply', 'Pothole or damaged road', 'Encroachment']
const shortCat = ['Garbage', 'Streetlight', 'Drainage', 'Water supply', 'Roads', 'Encroachment']
const officers = ['Ravi Shukla', 'Neha Verma', 'Arjun Tiwari', 'Pooja Saxena', 'Imran Khan', 'Divya Rao', 'Sanjay Mishra']
const catTones: ChartTone[] = ['slate', 'rose', 'sage', 'slate-light', 'rose-light', 'muted']

export function buildData(city: City, period: Period, ward: string | null, refresh = 0) {
  const r = rng(hash(`${city}|${period}|${ward ?? 'all'}|${refresh}`))
  const labels = periodLabels(period)
  const wards = wardsFor(city)
  const wardObj = wards.find((w) => w.id === ward) ?? null
  const scale = (city === 'kanpur' ? 1 : 0.42) * (ward ? 0.09 : 1)
  const perBucket = period === '90d' ? 7 : 1
  const n = labels.length

  /* PGR */
  const baseFiled = 160 * scale * perBucket
  const filed = labels.map((_, i) => Math.round(baseFiled * (0.82 + r() * 0.36 + (i % 7 === 1 ? 0.15 : 0))))
  const closed = filed.map((f, i) => Math.round(f * (0.78 + r() * 0.2 + i * (0.08 / n))))
  const totalFiled = filed.reduce((a, b) => a + b, 0)
  const open = Math.max(4, Math.round(totalFiled * 0.11 + r() * 30 * scale))
  const within48 = Math.round(74 + r() * 12)
  const avgHours = Math.round((26 + r() * 14) * 10) / 10
  const rating = Math.round((3.7 + r() * 0.8) * 10) / 10
  const escalatedCount = Math.max(1, Math.round(open * 0.06))
  const funnel = [
    { label: 'Filed', value: totalFiled, caption: 'App, call, WhatsApp' },
    { label: 'Assigned', value: Math.round(totalFiled * (0.95 + r() * 0.03)) },
    { label: 'In progress', value: Math.round(totalFiled * (0.86 + r() * 0.04)) },
    { label: 'Resolved', value: Math.round(totalFiled * (0.78 + r() * 0.05)), caption: 'Closed with proof' },
    { label: 'Citizen confirmed', value: Math.round(totalFiled * (0.61 + r() * 0.06)) },
  ]
  const catWeights = [0.34, 0.2, 0.16, 0.12, 0.11, 0.07].map((w) => w * (0.85 + r() * 0.3))
  const catTotal = catWeights.reduce((a, b) => a + b, 0)
  const byCategory = shortCat.map((label, i) => ({ label, value: Math.round((catWeights[i] / catTotal) * totalFiled), tone: catTones[i] }))
  const heatRows = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const heatCols = Array.from({ length: 24 }, (_, h) => `${String(h).padStart(2, '0')}:00`)
  const heat = heatRows.map((_, d) =>
    heatCols.map((__, h) => {
      const curve = Math.max(0, Math.sin(((h - 5) / 24) * Math.PI * 2)) + (h >= 8 && h <= 11 ? 0.8 : 0) + (h >= 17 && h <= 20 ? 0.6 : 0)
      return Math.round((curve * 9 + r() * 3) * scale * (d === 0 ? 1.3 : d >= 5 ? 0.8 : 1) * (period === '7d' ? 1 : period === '30d' ? 4 : 12))
    }),
  )
  const zones = ['Zone 1', 'Zone 2', 'Zone 3', 'Zone 4', 'Zone 5', 'Zone 6']
  const zoneOnTime = zones.map(() => Math.round((totalFiled / 6) * (0.7 + r() * 0.15)))
  const zoneBreached = zones.map((_, i) => Math.round((totalFiled / 6) * (0.06 + r() * 0.12 + (i === 1 ? 0.06 : 0))))

  const grievances: Grievance[] = Array.from({ length: 46 }, (_, i) => {
    const ci = Math.floor(r() * categories.length)
    const w = wardObj ?? wards[Math.floor(r() * wards.length)]
    const age = Math.round(2 + r() * 90)
    const statuses: Grievance['status'][] = ['Open', 'Assigned', 'In progress', 'Escalated', 'Closed']
    const status = i < 9 ? 'Escalated' : statuses[Math.floor(r() * statuses.length)]
    const d = new Date(Date.now() - age * 3600e3)
    return {
      id: `PGR-24-${String(8900 - i * 7 - Math.floor(r() * 5)).padStart(5, '0')}`,
      category: categories[ci],
      ward: `${w.label} · ${w.name}`,
      filed: `${fmtDay(d)} · ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`,
      ageHours: age,
      officer: officers[Math.floor(r() * officers.length)],
      status,
      slaLeft: 48 - age,
    }
  })

  const tiles: Tile[] = wards.map((w) => ({ ...w, value: Math.round((8 + r() * 60) * (city === 'kanpur' ? 1 : 0.5) * (w.row === 3 ? 1.3 : 1)) }))

  /* VMS */
  const cameraTotal = city === 'kanpur' ? 1240 : 380
  const offline = Math.round(cameraTotal * (0.015 + r() * 0.015))
  const online = cameraTotal - offline
  const onlinePct = Math.round((online / cameraTotal) * 1000) / 10
  const hours = Array.from({ length: 24 }, (_, h) => `${String(h).padStart(2, '0')}:00`)
  const det = (k: number, peak: number) => hours.map((_, h) => Math.round((Math.max(0, Math.sin(((h - peak + 6) / 24) * Math.PI * 2)) * k + r() * k * 0.2) * (ward ? 0.1 : 1)))
  const detGarbage = det(42, 9)
  const detWater = det(18, 15)
  const detTraffic = det(64, 18)
  const detectionsToday = [...detGarbage, ...detWater, ...detTraffic].reduce((a, b) => a + b, 0)
  const sentToPgr = Math.round(detectionsToday * 0.18)
  const storage = Math.round(68 + r() * 26)
  const detTypes = [
    { label: 'Stalled traffic', value: detTraffic.reduce((a, b) => a + b, 0), tone: 'slate' as ChartTone },
    { label: 'Garbage dumping', value: detGarbage.reduce((a, b) => a + b, 0), tone: 'rose' as ChartTone },
    { label: 'Waterlogging', value: detWater.reduce((a, b) => a + b, 0), tone: 'sage' as ChartTone },
    { label: 'Crowding', value: Math.round(detectionsToday * 0.08), tone: 'slate-light' as ChartTone },
  ]
  const locations = city === 'kanpur'
    ? ['Mall Road junction', 'Bada Chauraha', 'Rawatpur crossing', 'Ghanta Ghar', 'Jhakarkati bus stand', 'Fazalganj chauraha', 'Naveen Market', 'Kalyanpur flyover', 'Gumti No. 5', 'Parade ground', 'Moti Jheel gate', 'Jajmau bridge']
    : ['Airport Road', 'Phase 7 market', 'Sector 70 chowk', 'YPS chowk', 'Kumbra chowk', 'Bus stand Phase 8', 'Sohana gurdwara', 'Radisson chowk', 'Franco hotel chowk', 'Sector 82 IT city', 'Balongi bridge', 'Landran road']
  const cameras: Camera[] = locations.map((loc, i) => {
    const s: Camera['status'] = i === 1 || i === 7 ? 'Offline' : i === 4 ? 'Degraded' : 'Online'
    return {
      id: `CAM-${cities[city].short}-${String(400 + i * 37).padStart(4, '0')}`,
      location: loc,
      status: s,
      uptime: s === 'Offline' ? Math.round(70 + r() * 12) : s === 'Degraded' ? Math.round(90 + r() * 4) : Math.round(985 + r() * 15) / 10,
      lastFrame: s === 'Offline' ? `${1 + Math.floor(r() * 3)} h ago` : 'Now',
      detections: Math.round(r() * 60),
    }
  })

  /* Property tax */
  const fyMonths = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']
  const ptScale = (city === 'mohali' ? 1 : 2.4) * (ward ? 0.08 : 1)
  const monthsShown = period === '7d' ? 3 : period === '30d' ? 6 : 12
  const ptLabels = fyMonths.slice(0, monthsShown)
  const collection = ptLabels.map((_, i) => Math.round((1.4 + r() * 1.6 + (i === 2 || i === 8 ? 1.8 : 0)) * 1e6 * ptScale))
  const target = Math.round(2.6e6 * ptScale)
  const demand = Math.round(42e6 * ptScale)
  const collected = collection.reduce((a, b) => a + b, 0) + Math.round(8e6 * ptScale)
  const mismatches = Math.round((city === 'mohali' ? 412 : 960) * (ward ? 0.08 : 1) * (0.9 + r() * 0.2))
  const scatter: ScatterPoint[] = Array.from({ length: 48 }, (_, i) => {
    const declared = Math.round(60 + r() * 420)
    const flag = r() < 0.22
    const surveyed = Math.round(declared * (flag ? 1.25 + r() * 0.6 : 0.92 + r() * 0.14))
    return { x: declared, y: surveyed, label: `${cities[city].short}-PID-${String(118000 + i * 211).padStart(6, '0')}`, flag }
  })
  const composition = [
    { label: 'Residential', value: 62 + Math.round(r() * 6), tone: 'slate' as ChartTone },
    { label: 'Commercial', value: 18 + Math.round(r() * 4), tone: 'rose' as ChartTone },
    { label: 'Mixed use', value: 9, tone: 'sage' as ChartTone },
    { label: 'Institutional', value: 5, tone: 'slate-light' as ChartTone },
    { label: 'Vacant plot', value: 6, tone: 'muted' as ChartTone },
  ]
  const surveyed = Math.round(48200 * ptScale)
  const ptFunnel = [
    { label: 'Surveyed by drone', value: surveyed },
    { label: 'Ground verified', value: Math.round(surveyed * 0.84), caption: '42 of 50 sampled matched' },
    { label: 'Demand notice issued', value: Math.round(surveyed * 0.71) },
    { label: 'Paid', value: Math.round(surveyed * 0.52) },
  ]
  const uses = ['Residential', 'Commercial', 'Mixed use', 'Institutional']
  const properties: Property[] = Array.from({ length: 30 }, (_, i) => {
    const w = wardObj ?? wards[Math.floor(r() * wards.length)]
    return {
      pid: `${cities[city].short}-PID-${String(118204 - i * 977).padStart(6, '0')}`,
      owner: `${['R', 'S', 'A', 'P', 'M', 'K', 'G'][Math.floor(r() * 7)]}. ${['Sharma', 'Singh', 'Gupta', 'Verma', 'Kaur', 'Bansal', 'Arora'][Math.floor(r() * 7)]}`,
      sector: w.name,
      use: uses[Math.floor(r() * uses.length)],
      dues: Math.round((8 + r() * 140) * 1000),
      years: 1 + Math.floor(r() * 5),
      matched: r() > 0.25,
    }
  })

  const now = new Date()
  const timeline: TimelineEvent[] = [
    { date: fmtDay(new Date(now.getFullYear(), now.getMonth(), 3)), title: 'Weekly closure review, Zone 2', position: 0.06, tone: 'slate' },
    { date: fmtDay(new Date(now.getFullYear(), now.getMonth(), 7)), title: 'Self-assessment window opens', position: 0.2, tone: 'sage' },
    { date: fmtDay(new Date(now.getFullYear(), now.getMonth(), 11)), title: 'Camera audit, 64 sites', position: 0.36, tone: 'rose' },
    { date: fmtDay(new Date(now.getFullYear(), now.getMonth(), 15)), title: 'Escalation hearing', position: 0.5, tone: 'slate' },
    { date: fmtDay(new Date(now.getFullYear(), now.getMonth(), 19)), title: 'Firmware rollout', position: 0.64, tone: 'rose' },
    { date: fmtDay(new Date(now.getFullYear(), now.getMonth(), 23)), title: 'Rebate deadline, 10%', position: 0.78, tone: 'sage' },
    { date: fmtDay(new Date(now.getFullYear(), now.getMonth(), 28)), title: 'Feedback survey closes', position: 0.94, tone: 'slate' },
  ]

  const activity: Activity[] = [
    { id: 'a1', actor: 'Ravi Shukla', action: <>closed <span className="font-mono text-[12px]">{grievances[3].id}</span> with an after photo.</>, time: '09:52', module: 'PGR', tone: 'bg-slate' },
    { id: 'a2', actor: 'VMS', system: true, action: <>raised a garbage dumping detection at {locations[0]}.</>, time: '09:47', module: 'VMS', tone: 'bg-rose' },
    { id: 'a3', actor: 'Neha Verma', action: <>escalated <span className="font-mono text-[12px]">{grievances[0].id}</span> to the zonal officer.</>, time: '09:31', module: 'PGR', tone: 'bg-slate' },
    { id: 'a4', actor: 'Treasury sync', system: true, action: <>posted ₹1.2 lakh across 18 receipts.</>, time: '09:15', module: 'PT', tone: 'bg-sage-deep' },
    { id: 'a5', actor: 'Arjun Tiwari', action: <>marked {cameras[1].id} for maintenance.</>, time: '08:58', module: 'VMS', tone: 'bg-rose' },
    { id: 'a6', actor: 'Pooja Saxena', action: <>verified 12 properties on the ground in {wards[17].name}.</>, time: '08:40', module: 'PT', tone: 'bg-sage-deep' },
  ]

  return {
    labels,
    pgr: { filed, closed, open, within48, avgHours, rating, escalatedCount, funnel, byCategory, heatRows, heatCols, heat, zones, zoneOnTime, zoneBreached, grievances, tiles, totalFiled },
    vms: { cameraTotal, online, offline, onlinePct, hours, detGarbage, detWater, detTraffic, detectionsToday, sentToPgr, storage, detTypes, cameras },
    pt: { ptLabels, collection, target, demand, collected, mismatches, scatter, composition, ptFunnel, properties, surveyedWards: ward ? 1 : 13 },
    timeline,
    activity,
    series: {
      open: Array.from({ length: 7 }, (_, i) => Math.round(open * (1.18 - i * 0.03 + r() * 0.04))),
      within: Array.from({ length: 7 }, (_, i) => within48 - 6 + i + Math.round(r() * 2)),
      cams: Array.from({ length: 7 }, () => Math.round((96 + r() * 3) * 10) / 10),
      coll: collection.slice(-7),
    },
  }
}

export type DashData = ReturnType<typeof buildData>

export const crore = (n: number) => `₹${(n / 1e7).toFixed(2)} Cr`
export const lakh = (n: number) => `₹${(n / 1e5).toFixed(n >= 1e6 || n === 0 ? 0 : 1)} L`
export const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`
