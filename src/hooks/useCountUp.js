import { useEffect, useRef, useState } from 'react'

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)

/**
 * Anima un número desde su valor anterior hasta `value`.
 * Se usa tanto en los chips del hero (al entrar en viewport) como en los
 * resultados de la calculadora (cada vez que el usuario mueve un control).
 *
 * @param {number}  value     valor destino
 * @param {object}  opts
 * @param {boolean} opts.active  si es false, se queda en 0 (para scroll-reveal)
 * @param {number}  opts.duration ms
 */
export function useCountUp(value, { active = true, duration = 900 } = {}) {
  const [display, setDisplay] = useState(active ? value : 0)
  const fromRef = useRef(active ? value : 0)
  const rafRef = useRef(null)
  const startedRef = useRef(active)

  useEffect(() => {
    if (!active) return

    // Primera activación tras un reveal: arranca desde 0.
    const from = startedRef.current ? fromRef.current : 0
    startedRef.current = true

    const to = value
    if (from === to) {
      setDisplay(to)
      return
    }

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    // En una pestaña en segundo plano no corre requestAnimationFrame: sin este
    // atajo el número se quedaría en 0 hasta que el usuario vuelva a la pestaña.
    if (reduced || document.hidden) {
      fromRef.current = to
      setDisplay(to)
      return
    }

    const t0 = performance.now()
    const tick = (now) => {
      const p = Math.min((now - t0) / duration, 1)
      const v = from + (to - from) * easeOutCubic(p)
      setDisplay(v)
      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        fromRef.current = to
      }
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(rafRef.current)
  }, [value, active, duration])

  return display
}
