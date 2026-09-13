import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { BIENVENIDA } from '../data/content'

const VELOCIDAD_ESCRITURA = 42 // ms por carácter
const VELOCIDAD_BORRADO = 22
const PAUSA_LECTURA = 2600

/**
 * Saludo de entrada que reacciona al visitante: cambia según su hora local y
 * va rotando frases con efecto de tecleo. Es lo primero que se lee, antes del
 * titular.
 *
 * Si el sistema pide menos movimiento, muestra la primera frase fija.
 */
export default function Bienvenida() {
  const saludo = useMemo(() => BIENVENIDA.saludo(new Date().getHours()), [])
  const frase = useTecleo(BIENVENIDA.frases)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm text-white/70 md:text-base"
    >
      <span className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-70" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
        </span>
        <span className="font-medium text-white">{saludo}.</span>
      </span>

      {/* aria-live apagado: el texto rota solo y no debe interrumpir al lector */}
      <span className="text-white/55" aria-live="off">
        {frase}
        <span
          aria-hidden
          className="ml-1 inline-block h-[1em] w-[1.5px] translate-y-[0.12em] animate-pulse bg-gold"
        />
      </span>
    </motion.div>
  )
}

/** Escribe, espera y borra cada frase de la lista, en bucle. */
function useTecleo(frases) {
  const reducido =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  const [texto, setTexto] = useState(reducido ? frases[0] : '')
  const [indice, setIndice] = useState(0)
  const [borrando, setBorrando] = useState(false)

  useEffect(() => {
    if (reducido) return

    const completa = frases[indice % frases.length]

    /* Frase terminada: pausa para que se pueda leer y luego borra. */
    if (!borrando && texto === completa) {
      const t = setTimeout(() => setBorrando(true), PAUSA_LECTURA)
      return () => clearTimeout(t)
    }

    /* Frase borrada: pasa a la siguiente. */
    if (borrando && texto === '') {
      setBorrando(false)
      setIndice((i) => (i + 1) % frases.length)
      return
    }

    const t = setTimeout(
      () =>
        setTexto((actual) =>
          borrando ? completa.slice(0, actual.length - 1) : completa.slice(0, actual.length + 1)
        ),
      borrando ? VELOCIDAD_BORRADO : VELOCIDAD_ESCRITURA
    )
    return () => clearTimeout(t)
  }, [texto, borrando, indice, frases, reducido])

  return texto
}
