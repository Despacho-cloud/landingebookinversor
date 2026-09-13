import { useEffect, useState } from 'react'

/**
 * Devuelve el id de la sección visible actualmente, para el indicador de la
 * navegación sticky. Usa la línea imaginaria a ~35% del viewport como
 * referencia, que es lo que el ojo percibe como "la sección en la que estoy".
 *
 * Las posiciones de las secciones se miden UNA vez (y de nuevo si cambia el
 * tamaño o entra una imagen): durante el scroll solo se compara `scrollY`
 * contra números ya guardados. Antes se llamaba a getBoundingClientRect() por
 * cada sección en cada frame, lo que obligaba al navegador a recalcular el
 * layout continuamente mientras el usuario se desplazaba.
 */
export function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0])

  useEffect(() => {
    const nodos = ids.map((id) => document.getElementById(id)).filter(Boolean)
    if (!nodos.length) return

    /* [{ id, top }] ordenado por posición en el documento. */
    let posiciones = []

    const medir = () => {
      const y = window.scrollY
      posiciones = nodos.map((n) => ({
        id: n.id,
        top: n.getBoundingClientRect().top + y,
      }))
      evaluar()
    }

    const evaluar = () => {
      const linea = window.scrollY + window.innerHeight * 0.35
      let actual = null
      for (const p of posiciones) {
        if (p.top <= linea) actual = p.id
        else break
      }

      /* Al final del documento, marca la última sección. */
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4
      ) {
        actual = posiciones[posiciones.length - 1].id
      }

      /* setState con el mismo valor no re-renderiza: React lo descarta. */
      setActive(actual)
    }

    let pendiente = false
    const onScroll = () => {
      if (pendiente) return
      pendiente = true
      requestAnimationFrame(() => {
        pendiente = false
        evaluar()
      })
    }

    medir()

    /* Las imágenes que cargan tarde desplazan las secciones: volver a medir. */
    const ro = new ResizeObserver(medir)
    ro.observe(document.documentElement)

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      ro.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [ids])

  return active
}
