import { useState } from 'react'
import {
  BaoliMotif,
  ButtonGroup,
  Caption,
  cx,

  Figure,
  Glyph,
  glyphNames,
  JaaliMotif,
  KolamMotif,
  Label,
  type ProjectId,
  StambhaMotif,
  Text,
  useProjectTheme,
  VastuMotif,
} from '@/ds'
import { Rules, Section, Specimen, SubHead } from './Doc'
import { MotionSection } from './Extra'

/* ---------------- Colours ---------------- */

const core = [
  { name: 'paper', hex: '#F5F3EC', cls: 'bg-paper', note: 'Warm paper. About 70% of every surface.', dark: false },
  { name: 'ink', hex: '#111111', cls: 'bg-ink', note: 'Ink. Text, rules, primary actions.', dark: true },
  { name: 'slate', hex: '#52769A', cls: 'bg-slate', note: 'Slate blue, the primary brand colour.', dark: true },
  { name: 'rose', hex: '#9A5B6A', cls: 'bg-rose', note: 'Oxide rose, the second brand colour.', dark: true },
  { name: 'sage', hex: '#96A394', cls: 'bg-sage', note: 'Sage, the third brand colour.', dark: false },
]

const families = [
  [
    { name: 'slate-deep', hex: '#2F4E6D', cls: 'bg-slate-deep', dark: true },
    { name: 'slate', hex: '#52769A', cls: 'bg-slate', dark: true },
    { name: 'slate-light', hex: '#9BB3CC', cls: 'bg-slate-light', dark: false },
    { name: 'slate-wash', hex: '#D1D8DA', cls: 'bg-slate-wash', dark: false },
    { name: 'slate-tint', hex: '#E1E4E2', cls: 'bg-slate-tint', dark: false },
  ],
  [
    { name: 'rose-deep', hex: '#7E4554', cls: 'bg-rose-deep', dark: true },
    { name: 'rose', hex: '#9A5B6A', cls: 'bg-rose', dark: true },
    { name: 'rose-light', hex: '#C99AA2', cls: 'bg-rose-light', dark: false },
    { name: 'rose-wash', hex: '#E1D2CF', cls: 'bg-rose-wash', dark: false },
    { name: 'rose-tint', hex: '#EAE1DC', cls: 'bg-rose-tint', dark: false },
  ],
  [
    { name: 'sage-dark', hex: '#4F5D50', cls: 'bg-sage-dark', dark: true },
    { name: 'sage-deep', hex: '#6F7E70', cls: 'bg-sage-deep', dark: true },
    { name: 'sage', hex: '#96A394', cls: 'bg-sage', dark: false },
    { name: 'sage-wash', hex: '#E0E1D9', cls: 'bg-sage-wash', dark: false },
    { name: 'sage-tint', hex: '#EAE9E1', cls: 'bg-sage-tint', dark: false },
  ],
]

const semantic = [
  { token: 'surface', paper: '#F5F3EC', ink: '#111111', use: 'Page ground.' },
  { token: 'surface-raised', paper: '#EFEAE1', ink: '#1C2A38', use: 'Panels, inset boxes, header strips.' },
  { token: 'text', paper: '#111111', ink: '#F5F3EC', use: 'Body text and headlines. 17.1:1.' },
  { token: 'text-muted', paper: '#615A52', ink: '#C9D6E3', use: 'Secondary text and captions. 6.1:1.' },
  { token: 'text-label', paper: '#2F4E6D', ink: '#9BB3CC', use: 'Mono labels and section tags. 7.8:1.' },
  { token: 'text-accent', paper: '#7E4554', ink: '#C99AA2', use: 'Accent words closing a headline. 6.6:1.' },
  { token: 'rule', paper: '#111111', ink: '#4A5D72', use: 'Running-head rules, table rules, overlay borders.' },
  { token: 'border', paper: '#D6CFC3', ink: '#4A5D72', use: 'Card and box borders, dividers.' },
  { token: 'focus', paper: '#2F4E6D', ink: '#C9D6E3', use: 'Focus ring on interactive surfaces.' },
]

const status = [
  { word: 'Notice', token: 'info', fg: 'bg-info', bg: 'bg-info-tint', use: 'System information, assignments.' },
  { word: 'Resolved', token: 'success', fg: 'bg-success', bg: 'bg-success-tint', use: 'Closed with proof, paid, online.' },
  { word: 'Caution', token: 'caution', fg: 'bg-caution', bg: 'bg-caution-tint', use: 'SLA (service level) at risk, dues pending.' },
  { word: 'Critical', token: 'critical', fg: 'bg-critical', bg: 'bg-critical-tint', use: 'Breach, offline camera, failure.' },
]

const caseStudyCodes: { id: ProjectId; solution: string; ground: string; groundCls: string; accent: string; accentHex: string; accentCls: string }[] = [
  { id: 'videoGrievance', solution: 'Video & Grievance (Kanpur)', ground: 'paper → slate', groundCls: 'bg-grad-paper-slate', accent: 'slate-deep', accentHex: '#2F4E6D', accentCls: 'bg-slate-deep' },
  { id: 'propertyTax', solution: 'Property Tax (Punjab)', ground: 'warm paper', groundCls: 'bg-grad-paper', accent: 'ink', accentHex: '#111111', accentCls: 'bg-ink' },
  { id: 'expenditure', solution: 'Expenditure (Odisha)', ground: 'paper → rose', groundCls: 'bg-grad-paper-rose', accent: 'rose-deep', accentHex: '#7E4554', accentCls: 'bg-rose-deep' },
  { id: 'airQuality', solution: 'Air Quality (AQ-iDSS)', ground: 'slate → rose', groundCls: 'bg-grad-slate-rose', accent: 'rose', accentHex: '#9A5B6A', accentCls: 'bg-rose' },
  { id: 'floods', solution: 'Floods', ground: 'paper → deeper slate', groundCls: 'bg-grad-paper-slate-deep', accent: 'slate-deep', accentHex: '#2F4E6D', accentCls: 'bg-slate-deep' },
  { id: 'bridges', solution: 'Bridges & Infrastructure', ground: 'paper → sage', groundCls: 'bg-grad-paper-sage', accent: 'sage-deep', accentHex: '#6F7E70', accentCls: 'bg-sage-deep' },
  { id: 'waste', solution: 'Waste', ground: 'sage gradient', groundCls: 'bg-grad-sage', accent: 'ink', accentHex: '#111111', accentCls: 'bg-ink' },
  { id: 'energy', solution: 'Energy', ground: 'oxide rose gradient', groundCls: 'bg-grad-rose', accent: 'rose-deep', accentHex: '#7E4554', accentCls: 'bg-rose-deep' },
  { id: 'water', solution: 'Water (Delhi Jal Board)', ground: 'slate gradient', groundCls: 'bg-grad-slate', accent: 'slate-deep', accentHex: '#2F4E6D', accentCls: 'bg-slate-deep' },
]

const singleHueGradients = [
  { name: 'Warm paper', cls: 'bg-grad-paper', fromToken: 'grad-paper-start', fromHex: '#F8F6EF', toToken: 'grad-paper-end', toHex: '#EAE3D7', use: 'Quiet light pages, panels, contents' },
  { name: 'Ink', cls: 'bg-grad-ink', fromToken: 'ink', fromHex: '#111111', toToken: 'grad-ink-end', toHex: '#2A2A2A', use: 'Only under photographs' },
  { name: 'Slate', cls: 'bg-grad-slate', fromToken: 'slate-deep', fromHex: '#2F4E6D', toToken: 'grad-slate-end', toHex: '#7E9BB8', use: 'Product and platform pages' },
  { name: 'Oxide rose', cls: 'bg-grad-rose', fromToken: 'rose-deep', fromHex: '#7E4554', toToken: 'grad-rose-end', toHex: '#C48A96', use: 'People, history' },
  { name: 'Sage', cls: 'bg-grad-sage', fromToken: 'sage-deep', fromHex: '#6F7E70', toToken: 'grad-sage-end', toHex: '#B8C3B9', use: 'Case studies, environment' },
]

const pairingGradients = [
  { name: 'Paper to slate', cls: 'bg-grad-paper-slate', fromToken: 'paper', fromHex: '#F5F3EC', toToken: 'slate', toHex: '#52769A', use: 'Light hero sections' },
  { name: 'Paper to rose', cls: 'bg-grad-paper-rose', fromToken: 'paper', fromHex: '#F5F3EC', toToken: 'rose', toHex: '#9A5B6A', use: 'Light hero sections' },
  { name: 'Paper to sage', cls: 'bg-grad-paper-sage', fromToken: 'paper', fromHex: '#F5F3EC', toToken: 'sage', toHex: '#96A394', use: 'Light hero sections' },
  { name: 'Ink to slate', cls: 'bg-grad-ink-slate', fromToken: 'ink', fromHex: '#111111', toToken: 'slate', toHex: '#52769A', use: 'Covers, section openers' },
]

const layeredGradients = [
  { name: 'Layered slate', cls: 'bg-grad-layered-slate', stops: '#F8F6EF → layer-slate-mid #6F87A6 → ink #111111', use: 'Editorial dividers' },
  { name: 'Layered rose', cls: 'bg-grad-layered-rose', stops: '#F8F6EF → layer-rose-mid #A66D7A → ink #111111', use: 'Editorial dividers' },
  { name: 'Layered sage', cls: 'bg-grad-layered-sage', stops: '#F8F6EF → layer-sage-mid #9AA79B → ink #111111', use: 'Editorial dividers' },
  { name: 'Slate to rose', cls: 'bg-grad-slate-rose', stops: 'slate #52769A → rose #9A5B6A', use: 'Vision and closing spreads' },
  { name: 'Ink, slate, rose', cls: 'bg-grad-ink-slate-rose', stops: 'ink → slate-deep → slate → rose-deep', use: 'Long spreads such as the vision spread' },
]

const componentGradients = [
  { name: 'Partner card', cls: 'bg-grad-partner', stops: 'slate-deep #2F4E6D → #3A5A7B → #5F5F7B', use: 'Researcher and partner cards on paper pages' },
  { name: 'Blueprint panel', cls: 'bg-grad-blueprint', stops: 'ink #111111 → #1F3044 → slate-deep #2F4E6D', use: 'Panels holding a system diagram' },
]

const productCodes = [
  { mod: 'PGR', name: 'Public Grievance Redressal', ground: 'bg-grad-paper-slate', accent: 'slate-deep', series: 'bg-slate' },
  { mod: 'VMS', name: 'Video Management System', ground: 'bg-grad-paper-slate', accent: 'slate-deep', series: 'bg-rose' },
  { mod: 'PT', name: 'Property Tax', ground: 'bg-grad-paper', accent: 'ink', series: 'bg-sage-deep' },
]

function Swatch({ name, hex, cls, dark, note, tall }: { name: string; hex: string; cls: string; dark: boolean; note?: string; tall?: boolean }) {
  return (
    <div className="flex flex-col border border-border">
      <div className={cx(cls, tall ? 'h-32' : 'h-16', 'flex items-end p-3')}>
        <span className={cx('type-caption', dark ? 'text-paper' : 'text-ink')}>{hex}</span>
      </div>
      <div className="flex flex-col gap-0.5 bg-surface px-3 py-2.5">
        <span className="type-label text-text">{name}</span>
        {note ? <span className="type-body-s text-text-muted">{note}</span> : null}
      </div>
    </div>
  )
}

function Colours() {
  const { projectId, setProjectId } = useProjectTheme()
  return (
    <Section
      id="colours"
      group="Foundation"
      title="Colours"
      headline="Five colours, and everything else is"
      accent="a step of them."
      intro="Paper, ink, slate, rose and sage. Every tint, deep step and gradient stop is mixed from these five. Tints are solid values, never alpha, so print files stay clean."
    >
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {core.map((c) => (
          <Swatch key={c.name} {...c} tall />
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <SubHead>Ratio on every screen.</SubHead>
        <div className="flex h-12 border border-border">
          <div className="flex flex-[70] items-center bg-paper px-4">
            <Label className="text-ink">70 · paper</Label>
          </div>
          <div className="flex flex-[20] items-center bg-grad-ink-slate px-4">
            <Label className="text-paper">20 · dark grounds</Label>
          </div>
          <div className="flex flex-[10]">
            <span className="flex-1 bg-slate" />
            <span className="flex-1 bg-rose" />
            <span className="flex-1 bg-sage" />
          </div>
        </div>
        <Caption>About 70% paper, 20% dark grounds (always a gradient that starts at ink), 10% accent.</Caption>
      </div>

      <div className="flex flex-col gap-4">
        <SubHead>Families.</SubHead>
        <div className="flex flex-col gap-3">
          {families.map((f) => (
            <div key={f[0].name} className="grid grid-cols-5 border border-border">
              {f.map((s) => (
                <div key={s.name} className={cx(s.cls, 'flex h-20 flex-col justify-between p-3')}>
                  <span className={cx('type-label', s.dark ? 'text-paper' : 'text-ink')}>{s.name}</span>
                  <span className={cx('type-caption', s.dark ? 'text-paper' : 'text-ink')}>{s.hex}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <Caption>Never set slate, rose or sage as small text on paper. Use slate-deep, rose-deep or sage-dark.</Caption>
      </div>

      <div className="flex flex-col gap-4">
        <SubHead>Semantic tokens.</SubHead>
        <div className="overflow-x-auto border border-border">
          <table className="w-full min-w-[640px] border-collapse">
            <thead>
              <tr className="border-b border-rule bg-surface-raised text-left">
                {['Token', 'Paper', 'Ink', 'Use'].map((h) => (
                  <th key={h} className="px-4 py-2.5 type-label text-text-label">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {semantic.map((r) => (
                <tr key={r.token} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-3 font-mono text-[12px] text-text">{r.token}</td>
                  {[r.paper, r.ink].map((h, i) => (
                    <td key={i} className="px-4 py-3">
                      <span className="flex items-center gap-2">
                        <span className="size-5 border border-border" style={{ background: h }} />
                        <span className="type-caption text-text-muted">{h}</span>
                      </span>
                    </td>
                  ))}
                  <td className="px-4 py-3 type-body-s text-text-muted">{r.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <SubHead>Case-study colour code.</SubHead>
        <Text size="body" muted className="max-w-prose">
          Each solution keeps one gradient and one accent across its case, product page and flyer. Click any solution row to preview its project theme across the library.
        </Text>
        <div className="overflow-x-auto border border-border">
          <table className="w-full min-w-[640px] border-collapse">
            <thead>
              <tr className="border-b border-rule bg-surface-raised text-left">
                {['Solution', 'Ground', 'Primary Accent / CTA', 'Theme'].map((h) => (
                  <th key={h} className="px-4 py-2.5 type-label text-text-label">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {caseStudyCodes.map((c) => {
                const active = c.id === projectId
                return (
                  <tr
                    key={c.solution}
                    onClick={() => setProjectId(c.id)}
                    className={cx('cursor-pointer border-b border-border transition-colors last:border-b-0', active ? 'bg-selected' : 'hover:bg-hover')}
                  >
                    <td className="px-4 py-3 type-body-s font-medium text-text">{c.solution}</td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-3">
                        <span className={cx('h-5 w-10 border border-border', c.groundCls)} />
                        <span className="type-body-s text-text-muted">{c.ground}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-2.5">
                        <span className={cx('size-4 border border-border', c.accentCls)} />
                        <span className="font-mono text-[12px] text-text-label">{c.accent}</span>
                        <span className="type-caption text-text-muted">{c.accentHex}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {active ? (
                        <span className="inline-flex h-6 items-center bg-project-primary px-2.5 type-label text-project-primary-fg">Active</span>
                      ) : (
                        <span className="type-caption text-text-muted">Select</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <SubHead accent="the main texture.">Approved gradients,</SubHead>
          <Text size="body" muted className="max-w-prose">
            These are the only gradients the brand uses. Each is linear, set at 115 to 165 degrees with the darker end at the top left. Stops are named colour tokens; hex values are given for tools that cannot read tokens.
          </Text>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {gradients.map((g) => (
            <div key={g.name} className="flex flex-col border border-border bg-surface">
              <div className={cx(g.cls, 'grain h-24 border-b border-border')} />
              <div className="flex flex-col gap-1 px-3 py-2.5">
                <span className="type-heading text-text">{g.name}</span>
                <span className="font-mono text-[11px] text-text-label">{g.stops}</span>
                <span className="type-body-s text-text-muted">{g.use}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <span className="type-heading text-text">Single-hue gradients</span>
          <div className="overflow-x-auto border border-border">
            <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr className="border-b border-rule bg-surface-raised text-left">
                  {['Gradient', 'From', 'To', 'Use'].map((h) => (
                    <th key={h} className="px-4 py-2.5 type-label text-text-label">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {singleHueGradients.map((g) => (
                  <tr key={g.name} className="border-b border-border last:border-b-0">
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-3">
                        <span className={cx('h-5 w-8 border border-border', g.cls)} />
                        <span className="type-body-s text-text">{g.name}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-[12px] text-text-label">{g.fromToken}</span>{' '}
                      <span className="type-caption text-text-muted">{g.fromHex}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-[12px] text-text-label">{g.toToken}</span>{' '}
                      <span className="type-caption text-text-muted">{g.toHex}</span>
                    </td>
                    <td className="px-4 py-3 type-body-s text-text-muted">{g.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <span className="type-heading text-text">Pairing gradients (backgrounds, hero sections, dividers)</span>
          <div className="overflow-x-auto border border-border">
            <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr className="border-b border-rule bg-surface-raised text-left">
                  {['Gradient', 'From', 'To', 'Use'].map((h) => (
                    <th key={h} className="px-4 py-2.5 type-label text-text-label">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pairingGradients.map((g) => (
                  <tr key={g.name} className="border-b border-border last:border-b-0">
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-3">
                        <span className={cx('h-5 w-8 border border-border', g.cls)} />
                        <span className="type-body-s text-text">{g.name}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-[12px] text-text-label">{g.fromToken}</span>{' '}
                      <span className="type-caption text-text-muted">{g.fromHex}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-[12px] text-text-label">{g.toToken}</span>{' '}
                      <span className="type-caption text-text-muted">{g.toHex}</span>
                    </td>
                    <td className="px-4 py-3 type-body-s text-text-muted">{g.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-3">
            <span className="type-heading text-text">Layered gradients (depth, editorial feel)</span>
            <div className="overflow-x-auto border border-border">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-rule bg-surface-raised text-left">
                    {['Gradient', 'Stops', 'Use'].map((h) => (
                      <th key={h} className="px-4 py-2.5 type-label text-text-label">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {layeredGradients.map((g) => (
                    <tr key={g.name} className="border-b border-border last:border-b-0">
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-2.5">
                          <span className={cx('h-5 w-8 shrink-0 border border-border', g.cls)} />
                          <span className="type-body-s text-text">{g.name}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px] text-text-label">{g.stops}</td>
                      <td className="px-4 py-3 type-body-s text-text-muted">{g.use}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <span className="type-heading text-text">Component gradients</span>
            <div className="overflow-x-auto border border-border">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-rule bg-surface-raised text-left">
                    {['Gradient', 'Stops', 'Use'].map((h) => (
                      <th key={h} className="px-4 py-2.5 type-label text-text-label">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {componentGradients.map((g) => (
                    <tr key={g.name} className="border-b border-border last:border-b-0">
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-2.5">
                          <span className={cx('h-5 w-8 shrink-0 border border-border', g.cls)} />
                          <span className="type-body-s text-text">{g.name}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px] text-text-label">{g.stops}</td>
                      <td className="px-4 py-3 type-body-s text-text-muted">{g.use}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Specimen name="Status tones" code="UI · STATUS">
          <div className="flex flex-col gap-3">
            {status.map((s) => (
              <div key={s.token} className="flex items-center gap-4">
                <span className={cx('size-8', s.fg)} />
                <span className={cx('size-8 border border-border', s.bg)} />
                <span className="w-20 type-label text-text">{s.word}</span>
                <span className="type-body-s text-text-muted">{s.use}</span>
              </div>
            ))}
          </div>
          <Caption className="mt-4 block">Status always shows its word. Colour is never the only signal.</Caption>
        </Specimen>
        <Specimen name="Product colour code" code="PGR · VMS · PT">
          <div className="flex flex-col gap-3">
            {productCodes.map((p) => (
              <div key={p.mod} className="grid grid-cols-[48px_1fr_auto] items-center gap-4">
                <span className={cx('h-10 border border-border', p.ground)} />
                <span className="flex flex-col">
                  <span className="type-label text-text">{p.mod}</span>
                  <span className="type-body-s text-text-muted">{p.name}</span>
                </span>
                <span className="flex items-center gap-2 type-caption text-text-muted">
                  <span className={cx('size-1.5', p.series)} /> accent {p.accent}
                </span>
              </div>
            ))}
          </div>
          <Caption className="mt-4 block">Grounds follow the case-study code. Chart series run slate, then rose, then sage.</Caption>
        </Specimen>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Rules
          title="Colour rules"
          items={[
            '70 / 20 / 10. About 70% paper, 20% dark grounds (always a gradient that starts at ink), 10% accent (slate, rose, sage).',
            'Text on paper: text for body, text-muted for secondary text, text-label for labels, text-accent for headline accent words. Never set slate, rose or sage as small text on paper: use slate-deep, rose-deep, sage-dark.',
            'Text on dark grounds: paper for body and headlines, slate-light for labels, rose-light for accent words.',
            'Stages are always the same colours: Live slate, Pilot rose, Prototype sage. Each stage also carries its word; never colour alone.',
            'No flat charcoal pages. A dark page is always one of the approved gradients.',
            'Stationery exception: visiting cards, letterhead and envelopes are monochrome (ink, greys and pure white).',
          ]}
        />
        <Rules
          title="Gradient rules"
          items={[
            'One gradient per spread, set across both pages so it does not restart at the fold.',
            'Text on light gradients is text and must keep 4.5:1; text on dark gradients is paper.',
            'A photograph behind a gradient becomes texture: its light shades the gradient, with fine grain. Never lay a flat gradient over a photo.',
            'No transparency or blend modes in print files. Mix to solid stops.',
            'Do not invent new stops. If a new use needs a gradient, add it here first.',
          ]}
        />
      </div>
    </Section>
  )
}

/* ---------------- Gradients (part of colour) ---------------- */

const gradients = [
  { name: 'Warm paper', cls: 'bg-grad-paper', stops: '#F8F6EF → #EAE3D7', use: 'Quiet light pages, panels', dark: false },
  { name: 'Ink', cls: 'bg-grad-ink', stops: '#111111 → #2A2A2A', use: 'Under photographs only', dark: true },
  { name: 'Slate', cls: 'bg-grad-slate', stops: '#2F4E6D → #7E9BB8', use: 'Product and platform pages', dark: true },
  { name: 'Oxide rose', cls: 'bg-grad-rose', stops: '#7E4554 → #C48A96', use: 'People, history', dark: true },
  { name: 'Sage', cls: 'bg-grad-sage', stops: '#6F7E70 → #B8C3B9', use: 'Case studies, environment', dark: true },
  { name: 'Paper to slate', cls: 'bg-grad-paper-slate', stops: '#F5F3EC → #52769A', use: 'Light hero sections', dark: false },
  { name: 'Paper to rose', cls: 'bg-grad-paper-rose', stops: '#F5F3EC → #9A5B6A', use: 'Light hero sections', dark: false },
  { name: 'Paper to sage', cls: 'bg-grad-paper-sage', stops: '#F5F3EC → #96A394', use: 'Light hero sections', dark: false },
  { name: 'Ink to slate', cls: 'bg-grad-ink-slate', stops: '#111111 → #52769A', use: 'Covers, section openers', dark: true },
  { name: 'Layered slate', cls: 'bg-grad-layered-slate', stops: '#F8F6EF → #6F87A6 → #111111', use: 'Editorial dividers', dark: true },
  { name: 'Layered rose', cls: 'bg-grad-layered-rose', stops: '#F8F6EF → #A66D7A → #111111', use: 'Editorial dividers', dark: true },
  { name: 'Layered sage', cls: 'bg-grad-layered-sage', stops: '#F8F6EF → #9AA79B → #111111', use: 'Editorial dividers', dark: true },
  { name: 'Slate to rose', cls: 'bg-grad-slate-rose', stops: '#52769A → #9A5B6A', use: 'Vision and closing spreads', dark: true },
  { name: 'Ink, slate, rose', cls: 'bg-grad-ink-slate-rose', stops: '#111111 → #2F4E6D → #52769A → #7E4554', use: 'Long spreads such as the vision spread', dark: true },
  { name: 'Partner card', cls: 'bg-grad-partner', stops: '#2F4E6D → #3A5A7B → #5F5F7B', use: 'Researcher and partner cards on paper', dark: true },
  { name: 'Blueprint panel', cls: 'bg-grad-blueprint', stops: '#111111 → #1F3044 → #2F4E6D', use: 'Panels holding a system diagram', dark: true },
]

/* ---------------- Typography ---------------- */

const typeScale = [
  { style: 'display-xl', spec: '46 / 1.04 / 500', face: 'Space Grotesk', cls: 'type-display-xl', sample: 'Every complaint routed, tracked and', accent: 'closed with proof.' },
  { style: 'display-l', spec: '34 / 1.07 / 500', face: 'Space Grotesk', cls: 'type-display-l', sample: 'Property records matched to the', accent: 'ground.' },
  { style: 'display-m', spec: '22 / 1.2 / 500', face: 'Space Grotesk', cls: 'type-display-m', sample: 'Cameras that report what they see, with', accent: 'a decision trail.' },
  { style: 'heading', spec: '16 / 1.25 / 500', face: 'Space Grotesk', cls: 'type-heading', sample: 'Assign to field officer' },
  { style: 'lead', spec: '17 / 1.6 / 400', face: 'Inter', cls: 'type-lead', sample: 'Complaints closed within 48 hours rose from 60% to 82% across four Kanpur zones.' },
  { style: 'body', spec: '15 / 1.6 / 400', face: 'Inter', cls: 'type-body', sample: 'Each property is tied to a location, a tax record and a utility connection.' },
  { style: 'body-s', spec: '13 / 1.55 / 400', face: 'Inter', cls: 'type-body-s', sample: 'Ranked lists so crews repair before an outage. Card text and table cells.' },
  { style: 'label', spec: '11 / 1.4 / 500 · caps', face: 'JetBrains Mono', cls: 'type-label', sample: '04 · PGR · ESCALATED' },
  { style: 'caption', spec: '11 / 1.5 / 400 · caps', face: 'JetBrains Mono', cls: 'type-caption', sample: 'Source: PGR ledger, Kanpur, May 2026' },
]

function Typography() {
  return (
    <Section
      id="typography"
      group="Foundation"
      title="Typography"
      headline="Four faces, each with"
      accent="one job."
      intro="Space Grotesk for headlines and figures, Inter for running text, JetBrains Mono for short uppercase labels. Montserrat appears only beside the logo in a product lockup."
    >
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { face: 'Space Grotesk', role: 'Display', cls: 'font-display font-medium', note: 'Headlines, figures, card titles. 500 for words, 600 for figures.' },
          { face: 'Inter', role: 'Body', cls: 'font-body', note: 'All running text, controls and table cells.' },
          { face: 'JetBrains Mono', role: 'Mono', cls: 'font-mono', note: 'Labels, codes, captions. Never for sentences.' },
          { face: 'Montserrat', role: 'Logo', cls: 'font-logo font-bold', note: 'Only for product lockups beside the logo.' },
        ].map((f) => (
          <div key={f.face} className="flex flex-col justify-between gap-6 border border-border p-5">
            <div className="flex items-center justify-between">
              <Label>{f.role}</Label>
            </div>
            <span className={cx('text-[56px] leading-none text-text', f.cls)}>Aa</span>
            <div className="flex flex-col gap-1">
              <span className="type-heading text-text">{f.face}</span>
              <span className="type-body-s text-text-muted">{f.note}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-rule">
        {typeScale.map((t) => (
          <div key={t.style} className="grid gap-3 border-b border-border py-5 md:grid-cols-[180px_1fr]">
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[12px] font-medium text-text">{t.style}</span>
              <span className="type-caption text-text-muted">{t.spec}</span>
              <span className="type-caption text-text-muted">{t.face}</span>
            </div>
            <span className={cx(t.cls, t.style === 'label' ? 'text-text-label' : t.style === 'caption' ? 'text-text-muted' : 'text-text')}>
              {t.sample}
              {t.accent ? <span className="text-text-accent"> {t.accent}</span> : null}
            </span>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Specimen name="Figures" code="FIGURE-XL · FIGURE-M">
          <div className="grid grid-cols-3 gap-6">
            {[
              { f: '82%', l: 'PGR complaints closed within 48 hours' },
              { f: '1,240', l: 'VMS cameras reporting, Kanpur' },
              { f: '₹4.40 Cr', l: 'PT collected, Mohali pilot' },
            ].map((x) => (
              <div key={x.f} className="flex flex-col gap-2 border-t border-rule pt-3">
                <Figure size="m">{x.f}</Figure>
                <span className="type-body-s text-text-muted">{x.l}</span>
              </div>
            ))}
          </div>
          <Caption className="mt-5 block">Outlined: transparent fill, 1.5px stroke. Slate on paper, paper on dark grounds.</Caption>
        </Specimen>
        <Specimen name="Product lockup" code="LOGO · MONTSERRAT 700" dark>
          <div className="flex h-full flex-col justify-between gap-6">
            <span className="flex items-center gap-4">
              <span className="inline-flex h-10 aspect-[3/1] items-center justify-center border border-dashed border-slate-light type-caption text-slate-light">Logo</span>
              <span className="h-8 w-px bg-rule" />
              <span className="type-wordmark text-paper">AIRAWAT OS</span>
            </span>
            <Text size="body-s" muted>
              Supplied logo artwork sits in the slot. Never redraw or re-letter it.
            </Text>
          </div>
        </Specimen>
      </div>

      <Rules
        items={[
          'Headlines in sentence case, a full stop at the end, balanced line breaks. The last two to four words take text-accent.',
          'Body text never below 14px in print, 13px in dense interface cells. Labels and captions never below 11px.',
          'Keep uppercase to short mono tags. Keep lines near 65 characters.',
          'No em dashes. Use a full stop, a comma or a colon. Split sentences over 30 words.',
        ]}
      />
    </Section>
  )
}

/* ---------------- Iconography ---------------- */

function Iconography() {
  const motifs = [
    { name: 'Vastu', what: 'The 9 × 9 pada grid used to lay out temples and towns.', where: 'Empty states, contents, onboarding.', el: <VastuMotif className="size-24 text-slate" /> },
    { name: 'Kolam', what: 'A continuous line looped around a grid of dots.', where: 'Network and connection. Offline states, bands.', el: <KolamMotif className="h-10 w-full text-rose" /> },
    { name: 'Jaali', what: 'The pierced stone screen, one pattern repeated.', where: 'Products, ways of seeing. VMS surfaces.', el: <JaaliMotif className="size-24 text-sage-deep" /> },
    { name: 'Baoli', what: 'The stepwell in section, steps down to water.', where: 'Layered reading. Drill-down, errors.', el: <BaoliMotif className="h-20 w-full text-slate" /> },
    { name: 'Baoli (colour)', what: 'Layered bands from the palette.', where: 'Twins and stacked data layers.', el: <BaoliMotif coloured className="h-20 w-full text-ink" /> },
    { name: 'Stambha', what: 'The temple pillar, square to octagon to round.', where: 'Platform, roadmap, team.', el: <StambhaMotif className="h-24 text-rose" /> },
  ]
  return (
    <Section
      id="iconography"
      group="Foundation"
      title="Iconography"
      headline="Words first, and"
      accent="no icon set."
      intro="Airawat has no icon library. Meaning is carried by words, mono labels and 6px filled squares. A small set of functional glyphs exists only for interface affordances, and five heritage motifs give open space its character."
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <Specimen name="Bullets and markers" code="SQ-06">
          <div className="flex flex-col gap-3">
            {[
              ['bg-slate', 'Live', 'PGR · 412 open'],
              ['bg-rose', 'Pilot', 'VMS · 1,240 cameras'],
              ['bg-sage-deep', 'Prototype', 'PT · 4 wards'],
            ].map(([c, w, m]) => (
              <div key={w} className="flex items-center gap-3">
                <span className={cx('size-1.5', c)} />
                <span className="w-24 type-label text-text">{w}</span>
                <span className="type-body-s text-text-muted">{m}</span>
              </div>
            ))}
          </div>
          <Caption className="mt-5 block">6px squares in a stage or module colour, always next to a word.</Caption>
        </Specimen>
        <Specimen name="Functional glyphs" code="UI-GLYPH · 16" className="lg:col-span-2">
          <div className="grid grid-cols-4 gap-px bg-border sm:grid-cols-7">
            {glyphNames.map((g) => (
              <div key={g} className="flex flex-col items-center gap-2 bg-surface py-4">
                <Glyph name={g} size={20} className="text-text" />
                <span className="type-caption text-text-muted normal-case">{g}</span>
              </div>
            ))}
          </div>
          <Caption className="mt-5 block">1.5px square-capped strokes on a 16px grid. Affordance only: open, close, confirm, move. Never decorative, never alone without a label.</Caption>
        </Specimen>
      </div>

      <div className="flex flex-col gap-4">
        <SubHead>Heritage motifs.</SubHead>
        <div className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {motifs.map((m) => (
            <div key={m.name} className="flex flex-col gap-4 bg-surface p-6">
              <div className="flex h-28 items-center justify-center">{m.el}</div>
              <div className="flex flex-col gap-1">
                <Label className="text-text">{m.name}</Label>
                <span className="type-body-s text-text">{m.what}</span>
                <span className="type-body-s text-text-muted">{m.where}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Rules
        items={[
          'Never emoji, never pictograms from a generic library.',
          'One motif per screen, in open space, never behind running text. Hairline 0.6 to 0.9px.',
          'Logos are supplied artwork only. Use logo-black on paper and logo-white on dark gradients.',
        ]}
      />
    </Section>
  )
}

/* ---------------- Effects ---------------- */

function Effects() {
  return (
    <Section
      id="effects"
      group="Foundation"
      title="Effects styles"
      headline="Depth from gradients and rules,"
      accent="never shadows."
      intro="There are no drop shadows. Layers separate by border weight, surface step and the approved gradients. Texture comes from fine grain and the blueprint grid."
    >
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
        {gradients.map((g) => (
          <div key={g.name} className="flex flex-col border border-border">
            <div className={cx(g.cls, 'grain h-24')} />
            <div className="flex flex-col gap-0.5 px-3 py-2">
              <span className="type-label text-text">{g.name}</span>
              <span className="type-body-s text-text-muted">{g.use}</span>
            </div>
          </div>
        ))}
      </div>
      <Caption>Linear, 115 to 165 degrees, darker end at the top left. These are the only gradients. Do not invent new stops.</Caption>

      <div className="flex flex-col gap-4">
        <SubHead>Elevation by border.</SubHead>
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { lv: 'Level 0', name: 'Surface', cls: 'bg-surface border border-border', use: 'Page ground, table rows.' },
            { lv: 'Level 1', name: 'Raised', cls: 'bg-surface-raised border border-border', use: 'Panels, header strips, sidebars.' },
            { lv: 'Level 2', name: 'Overlay', cls: 'bg-surface border border-rule', use: 'Menus, popovers, date pickers.' },
            { lv: 'Level 3', name: 'Modal', cls: 'bg-surface border border-rule outline outline-8 outline-ink', use: 'Dialogs over an ink scrim.' },
          ].map((e) => (
            <div key={e.lv} className="flex flex-col gap-3">
              <div className={cx('flex h-28 items-end p-4', e.cls)}>
                <Label className="text-text">{e.lv}</Label>
              </div>
              <div>
                <span className="type-heading text-text">{e.name}</span>
                <p className="type-body-s text-text-muted">{e.use}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Specimen name="Focus ring" code="FOCUS · 2PX">
          <div className="flex items-center gap-6">
            <span className="inline-flex h-10 items-center border border-rule px-4 type-body-s font-medium outline-2 outline-offset-2 outline-focus">Focused</span>
            <span className="type-body-s text-text-muted">2px focus token, 2px offset. Never removed.</span>
          </div>
        </Specimen>
        <Specimen name="Grain" code="TEXTURE" bodyClass="p-0!">
          <div className="grid grid-cols-2">
            <div className="flex h-28 items-end bg-grad-slate p-3">
              <Caption className="text-paper">Without</Caption>
            </div>
            <div className="grain flex h-28 items-end bg-grad-slate p-3">
              <Caption className="text-paper">With grain</Caption>
            </div>
          </div>
        </Specimen>
        <Specimen name="Blueprint ground" code="GRID 12 / 60" bodyClass="p-0!">
          <div className="relative h-28 bg-blueprint-grid">
            {['top-2 left-2', 'top-2 right-2', 'bottom-2 left-2', 'bottom-2 right-2'].map((p) => (
              <span key={p} className={cx('absolute type-caption text-slate-light', p)}>+</span>
            ))}
            <span className="absolute bottom-2 left-6 type-caption text-slate-light">SYS-PGR · SCHEMATIC · 2026</span>
          </div>
        </Specimen>
      </div>
      <Rules
        items={[
          'No drop shadows, no glows, no blur. Cards carry a 1px border.',
          'No coloured left-border accents on cards.',
          'Scrims and translucency are screen-only. Print files mix every colour to a solid value.',
          'A photograph behind a gradient becomes texture with fine grain. Never lay a flat gradient over a photo.',
        ]}
      />
    </Section>
  )
}

/* ---------------- Spacing, radius and grid ---------------- */

const spacing = [
  { t: 'space-1', px: 4 },
  { t: 'space-2', px: 8 },
  { t: 'space-3', px: 12 },
  { t: 'space-4', px: 16 },
  { t: 'space-6', px: 24 },
  { t: 'space-8', px: 32 },
  { t: 'space-12', px: 48 },
  { t: 'space-16', px: 64 },
  { t: 'space-24', px: 96 },
]

function Spacing() {
  const [grid, setGrid] = useState<'web' | 'a4' | 'blueprint'>('web')
  return (
    <Section
      id="spacing"
      group="Foundation"
      title="Spacing, radius and grid"
      headline="Square by default, on a"
      accent="4px rhythm."
      intro="All spacing steps from a 4px base. Corners are square. The pill belongs only to stage tags and the circle only to people photos."
    >
      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Specimen name="Spacing scale" code="BASE 4">
          <div className="flex flex-col gap-2.5">
            {spacing.map((s) => (
              <div key={s.t} className="grid grid-cols-[84px_44px_1fr] items-center gap-3">
                <span className="font-mono text-[12px] text-text">{s.t}</span>
                <span className="type-caption text-text-muted">{s.px}px</span>
                <span className="h-3 bg-slate" style={{ width: s.px * 2 }} />
              </div>
            ))}
          </div>
          <Caption className="mt-5 block">Controls 40px tall (32 small, 48 large). Header strips 20 to 32px.</Caption>
        </Specimen>
        <Specimen name="Radius" code="RADIUS">
          <div className="grid grid-cols-3 gap-4">
            {[
              { t: 'radius-0', cls: 'rounded-0', use: 'Everything by default', el: <span className="block size-16 border border-rule bg-surface-raised" /> },
              { t: 'radius-pill', cls: 'rounded-pill', use: 'Stage tags only', el: <span className="inline-flex h-7 items-center rounded-pill border border-stage-live px-3 type-label text-stage-live">Live</span> },
              { t: 'radius-round', cls: 'rounded-round', use: 'People photos only', el: <span className="inline-flex size-16 items-center justify-center rounded-round bg-paper font-display text-[20px] text-slate-deep ring-2 ring-paper outline outline-1 outline-border">AM</span> },
            ].map((r) => (
              <div key={r.t} className="flex flex-col gap-3">
                <div className="flex h-16 items-center">{r.el}</div>
                <span className="font-mono text-[12px] text-text">{r.t}</span>
                <span className="type-body-s text-text-muted">{r.use}</span>
              </div>
            ))}
          </div>
        </Specimen>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <SubHead>Grids.</SubHead>
          <ButtonGroup
            label="Grid"
            size="sm"
            value={grid}
            onChange={setGrid}
            options={[
              { value: 'web', label: 'Application 12-col' },
              { value: 'a4', label: 'A4 document' },
              { value: 'blueprint', label: 'Blueprint' },
            ]}
          />
        </div>
        {grid === 'web' ? (
          <div className="flex flex-col gap-3">
            <div className="grid h-40 grid-cols-12 gap-6 border border-border bg-surface-raised px-8">
              {Array.from({ length: 12 }, (_, i) => (
                <div key={i} className="flex items-end justify-center bg-slate-tint pb-2">
                  <span className="type-caption text-text-label">{i + 1}</span>
                </div>
              ))}
            </div>
            <Caption>12 columns, 24px gutters, 32px margins at 1280. Sidebar 256px. Content max 1200px. Prose max 65ch.</Caption>
          </div>
        ) : grid === 'a4' ? (
          <div className="flex flex-col gap-3">
            <div className="mx-auto flex aspect-[794/1123] h-96 flex-col border border-rule bg-paper p-6">
              <div className="flex justify-between border-b border-rule pb-1">
                <span className="type-caption text-ink">05 · Platform</span>
                <span className="type-caption text-ink">AirawatOS</span>
              </div>
              <div className="grid flex-1 grid-cols-6 gap-2 py-3">
                {Array.from({ length: 6 }, (_, i) => (
                  <div key={i} className="bg-slate-tint" />
                ))}
              </div>
              <div className="flex items-center justify-between border-t border-border pt-1">
                <span className="type-caption text-ink">airawat.org · 14</span>
                <span className="inline-flex h-4 w-10 border border-dashed border-border-strong" />
              </div>
            </div>
            <Caption className="text-center">A4 portrait, 794 × 1123 at 96 dpi. Running head over a 1px rule, footer with logo right.</Caption>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="relative h-56 bg-blueprint-grid p-6">
              <div className="flex h-full items-center justify-center gap-10">
                <div className="w-48 border border-slate-light">
                  <div className="flex h-5 items-center justify-between border-b border-slate-light px-2">
                    <span className="type-caption text-slate-light">Citizen</span>
                    <span className="type-caption text-slate-light">U01</span>
                  </div>
                  <p className="p-2 type-body-s text-paper">Files a complaint by app, call or WhatsApp.</p>
                </div>
                <span className="type-caption text-slate-light">Complaint →</span>
                <div className="w-48 bg-slate-light">
                  <div className="flex h-5 items-center justify-between border-b border-slate-deep px-2">
                    <span className="type-caption text-ink">PGR core</span>
                    <span className="type-caption text-ink">SYS00</span>
                  </div>
                  <p className="p-2 type-body-s text-ink">Routes, tracks and closes, with proof.</p>
                </div>
              </div>
              <span className="absolute bottom-3 left-4 type-caption text-slate-light">SYS-PGR · SCHEMATIC · 2026</span>
            </div>
            <Caption>12px minor grid, 60px major grid. Boxes with a 20px header strip and a reference code. The core fills slate-light.</Caption>
          </div>
        )}
      </div>
    </Section>
  )
}

export function Foundation() {
  return (
    <>
      <Colours />
      <Typography />
      <Iconography />
      <Effects />
      <MotionSection />
      <Spacing />
    </>
  )
}

