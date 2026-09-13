import { useEffect, useState } from 'react'

/**
 * Devuelve el id de la sección visible actualmente, para el indicador de la
 * navegación sticky. Usa la línea imaginaria a ~35% del viewport como
 * referencia, que es lo que el ojo percibe como "la sección en la que estoy".
 */
export function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0])

  useEffect(() => {
    const nodes = ids.map((id) => document.getElementById(id)).filter(Boolean)
    if (!nodes.length) return

    let ticking = false
    const evaluate = () => {
      ticking = false
      const linea = window.innerHeight * 0.35
      let actual = null

      for (const node of nodes) {
        const { top } = node.getBoundingClientRect()
        if (top <= linea) actual = node.id
      }

      // Al llegar al final del documento, marca la última sección.
      const finDocumento =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 4
      if (finDocumento) actual = nodes[nodes.length - 1].id

      setActive(actual)
    }

    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(evaluate)
      }
    }

    evaluate()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [ids])

  return active
}
