import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react'
import { cx } from './cx'

/** True when the user asks for reduced motion. Animations then jump to their end state. */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setReduced(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return reduced
}

/** Observes an element and reports once it has entered the viewport. */
export function useInView<T extends Element>({ rootMargin = '0px 0px -10% 0px', once = true } = {}) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) obs.disconnect()
        } else if (!once) setInView(false)
      },
      { rootMargin },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [rootMargin, once])
  return [ref, inView] as const
}

/** Fades content up 12px the first time it scrolls into view. */
export function Reveal({ children, delay = 0, className, as: As = 'div' }: { children: ReactNode; delay?: number; className?: string; as?: ElementType }) {
  const [ref, inView] = useInView<HTMLDivElement>()
  return (
    <As ref={ref} className={cx(inView ? 'animate-fade-up' : 'opacity-0', className)} style={inView && delay ? { animationDelay: `${delay}ms` } : undefined}>
      {children}
    </As>
  )
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)
export const formatIN = (n: number, decimals = 0) => n.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })

/** Counts from the previous value to the new one. Indian digit grouping by default. */
export function AnimatedNumber({
  value,
  decimals = 0,
  duration = 900,
  format,
  prefix = '',
  suffix = '',
}: {
  value: number
  decimals?: number
  duration?: number
  format?: (n: number) => string
  prefix?: string
  suffix?: string
}) {
  const reduced = usePrefersReducedMotion()
  const [shown, setShown] = useState(reduced ? value : 0)
  const from = useRef(reduced ? value : 0)
  const [ref, inView] = useInView<HTMLSpanElement>()

  useEffect(() => {
    if (!inView) return
    if (reduced) {
      setShown(value)
      from.current = value
      return
    }
    const start = performance.now()
    const a = from.current
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const v = a + (value - a) * easeOut(t)
      setShown(v)
      if (t < 1) raf = requestAnimationFrame(tick)
      else from.current = value
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      from.current = value
    }
  }, [value, duration, reduced, inView])

  const text = format ? format(shown) : formatIN(shown, decimals)
  return (
    <span ref={ref} className="tabular-nums" aria-label={`${prefix}${format ? format(value) : formatIN(value, decimals)}${suffix}`}>
      <span aria-hidden="true">
        {prefix}
        {text}
        {suffix}
      </span>
    </span>
  )
}

/** Staggered animation delay helper. */
export const stagger = (i: number, step = 40, base = 0) => ({ animationDelay: `${base + i * step}ms` })
