import { useEffect, useId, useRef, useState, type DragEvent } from 'react'
import { cx } from './cx'
import { Button, IconButton } from './Button'
import { Glyph } from './Glyph'

type Item = { id: string; name: string; size: number; progress: number; error?: string }

const fmtSize = (b: number) => (b > 1e6 ? `${(b / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1e3))} KB`)

/**
 * File upload: dashed dropzone, files listed with a flat progress bar.
 * Upload is simulated here; wire `onUpload` to a real endpoint in product code.
 */
export function FileUpload({
  label,
  hint,
  accept,
  maxSizeMB = 10,
  initial = [],
}: {
  label: string
  hint?: string
  accept?: string
  maxSizeMB?: number
  initial?: { name: string; size: number }[]
}) {
  const id = useId()
  const input = useRef<HTMLInputElement>(null)
  const [drag, setDrag] = useState(false)
  const [items, setItems] = useState<Item[]>(() => initial.map((f, i) => ({ id: `init-${i}`, name: f.name, size: f.size, progress: 100 })))

  useEffect(() => {
    if (!items.some((i) => i.progress < 100 && !i.error)) return
    const t = setInterval(() => {
      setItems((all) => all.map((i) => (i.progress < 100 && !i.error ? { ...i, progress: Math.min(100, i.progress + 8 + Math.random() * 18) } : i)))
    }, 180)
    return () => clearInterval(t)
  }, [items])

  const add = (files: FileList | null) => {
    if (!files) return
    const next = Array.from(files).map((f) => ({
      id: `${f.name}-${f.size}-${Date.now()}`,
      name: f.name,
      size: f.size,
      progress: 0,
      error: f.size > maxSizeMB * 1e6 ? `Larger than ${maxSizeMB} MB. Compress and try again.` : undefined,
    }))
    setItems((all) => [...all, ...next])
  }
  const onDrop = (e: DragEvent) => {
    e.preventDefault()
    setDrag(false)
    add(e.dataTransfer.files)
  }

  return (
    <div className="flex flex-col gap-3">
      <label htmlFor={id} className="type-label text-text-label">
        {label}
      </label>
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDrag(true)
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
        className={cx('flex flex-col items-center gap-3 border border-dashed px-6 py-8 text-center transition-colors', drag ? 'border-brand bg-selected' : 'border-border-strong bg-surface-raised')}
      >
        <span className={cx('inline-flex size-10 items-center justify-center border transition-transform', drag ? 'translate-y-[-2px] border-brand text-brand' : 'border-border-strong text-text-muted')}>
          <Glyph name="download" className="rotate-180" />
        </span>
        <p className="type-body-s text-text">
          {drag ? 'Release to add files.' : 'Drag photos or documents here, or'}
        </p>
        <Button size="sm" variant="secondary" onClick={() => input.current?.click()}>
          Choose files
        </Button>
        {hint ? <p className="type-caption text-text-muted">{hint}</p> : null}
        <input id={id} ref={input} type="file" multiple accept={accept} className="sr-only" onChange={(e) => add(e.target.files)} />
      </div>
      {items.length ? (
        <ul className="flex flex-col border border-border">
          {items.map((f) => {
            const done = f.progress >= 100 && !f.error
            return (
              <li key={f.id} className="flex animate-fade-in items-center gap-3 border-b border-border px-3 py-2.5 last:border-b-0">
                <span className="inline-flex h-8 w-10 shrink-0 items-center justify-center bg-surface-sunken font-mono text-[10px] text-text-muted uppercase">
                  {f.name.split('.').pop()?.slice(0, 4)}
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="truncate type-body-s text-text">{f.name}</span>
                    <span className={cx('shrink-0 type-caption', f.error ? 'text-critical' : 'text-text-muted')}>
                      {f.error ? 'Failed' : done ? fmtSize(f.size) : `${Math.round(f.progress)}%`}
                    </span>
                  </div>
                  {f.error ? (
                    <span className="type-body-s text-critical">{f.error}</span>
                  ) : (
                    <span className="h-1 bg-surface-sunken">
                      <span className={cx('block h-full transition-[width] duration-200', done ? 'bg-success' : 'bg-brand')} style={{ width: `${f.progress}%` }} />
                    </span>
                  )}
                </div>
                <IconButton glyph="close" size="sm" label={`Remove ${f.name}`} onClick={() => setItems((all) => all.filter((x) => x.id !== f.id))} />
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}
