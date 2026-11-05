import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { cx } from './cx'

type Command = { cmd: string; label: string; display: ReactNode; arg?: string }

const commands: (Command | 'sep')[] = [
  { cmd: 'formatBlock', arg: 'P', label: 'Paragraph', display: <span className="font-mono text-[11px]">P</span> },
  { cmd: 'formatBlock', arg: 'H3', label: 'Heading', display: <span className="font-mono text-[11px]">H</span> },
  'sep',
  { cmd: 'bold', label: 'Bold', display: <span className="font-display text-[14px] font-semibold">B</span> },
  { cmd: 'italic', label: 'Italic', display: <span className="font-display text-[14px] italic">I</span> },
  { cmd: 'underline', label: 'Underline', display: <span className="font-display text-[14px] underline">U</span> },
  { cmd: 'strikeThrough', label: 'Strikethrough', display: <span className="font-display text-[14px] line-through">S</span> },
  'sep',
  { cmd: 'insertUnorderedList', label: 'Bulleted list', display: <span className="type-caption normal-case">List</span> },
  { cmd: 'insertOrderedList', label: 'Numbered list', display: <span className="type-caption normal-case">1. 2.</span> },
  { cmd: 'formatBlock', arg: 'BLOCKQUOTE', label: 'Quote', display: <span className="type-caption normal-case">Quote</span> },
]

/**
 * Rich text editor for officer notes and resolution remarks.
 * Toolbar uses letters and words, not icons. Square, 1px border.
 */
export function TextEditor({
  label,
  initialHTML = '',
  placeholder = 'Write a note',
  maxLength = 1000,
  hint,
  footer,
}: {
  label: ReactNode
  initialHTML?: string
  placeholder?: string
  maxLength?: number
  hint?: ReactNode
  footer?: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const id = useId()
  const [count, setCount] = useState(0)
  const [activeCmds, setActiveCmds] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = initialHTML
      setCount(ref.current.innerText.trim().length)
    }
  }, [initialHTML])

  const refresh = () => {
    const next: Record<string, boolean> = {}
    for (const c of ['bold', 'italic', 'underline', 'strikeThrough', 'insertUnorderedList', 'insertOrderedList']) {
      try {
        next[c] = document.queryCommandState(c)
      } catch {
        next[c] = false
      }
    }
    setActiveCmds(next)
    setCount(ref.current?.innerText.trim().length ?? 0)
  }

  const run = (c: Command) => {
    ref.current?.focus()
    document.execCommand(c.cmd, false, c.arg)
    refresh()
  }

  const over = count > maxLength
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <span id={`${id}-label`} className="type-label text-text-label">
          {label}
        </span>
        <span className={cx('type-caption', over ? 'text-critical' : 'text-text-muted')}>
          {count} / {maxLength}
        </span>
      </div>
      <div className={cx('border bg-surface focus-within:border-rule', over ? 'border-critical' : 'border-border-strong')}>
        <div role="toolbar" aria-label="Formatting" className="flex flex-wrap items-center gap-0.5 border-b border-border bg-surface-raised p-1">
          {commands.map((c, i) =>
            c === 'sep' ? (
              <span key={i} aria-hidden="true" className="mx-1 h-5 w-px bg-border" />
            ) : (
              <button
                key={c.label}
                type="button"
                title={c.label}
                aria-label={c.label}
                aria-pressed={activeCmds[c.cmd] || undefined}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => run(c)}
                className={cx(
                  'inline-flex h-8 min-w-8 cursor-pointer items-center justify-center px-2 text-text transition-colors',
                  activeCmds[c.cmd] ? 'bg-action text-on-action' : 'hover:bg-hover',
                )}
              >
                {c.display}
              </button>
            ),
          )}
        </div>
        <div
          ref={ref}
          role="textbox"
          aria-multiline="true"
          aria-labelledby={`${id}-label`}
          contentEditable
          suppressContentEditableWarning
          data-placeholder={placeholder}
          onInput={refresh}
          onKeyUp={refresh}
          onMouseUp={refresh}
          className={cx(
            'min-h-36 px-4 py-3 type-body text-text outline-none',
            '[&_h3]:type-heading [&_h3]:mb-1 [&_ul]:list-none [&_ul]:pl-0 [&_ul>li]:relative [&_ul>li]:pl-4',
            '[&_ul>li]:before:absolute [&_ul>li]:before:left-0 [&_ul>li]:before:top-[0.65em] [&_ul>li]:before:size-1.5 [&_ul>li]:before:bg-slate [&_ul>li]:before:content-[""]',
            '[&_ol]:list-decimal [&_ol]:pl-5 [&_blockquote]:border-l [&_blockquote]:border-rule [&_blockquote]:pl-3 [&_blockquote]:text-text-muted',
          )}
        />
        {footer ? <div className="flex items-center justify-between gap-3 border-t border-border px-3 py-2">{footer}</div> : null}
      </div>
      {hint ? <p className="type-body-s text-text-muted">{hint}</p> : null}
    </div>
  )
}
