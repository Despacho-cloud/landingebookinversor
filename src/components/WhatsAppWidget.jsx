import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import WhatsAppIcon from './WhatsAppIcon'
import {
  CONTACTOS,
  NAV,
  PARTICIPAR_MODAL,
  WIDGET,
  esPendiente,
  waLink,
} from '../data/content'
import { useActiveSection } from '../hooks/useActiveSection'

const IDS = NAV.map((n) => n.id)

/**
 * Botón flotante fijo al lado derecho.
 *
 * Abre un panel con los dos contactos. El mensaje que llega precargado a
 * WhatsApp se arma en el momento del clic: lleva la sección que el visitante
 * está mirando y, si ya tocó la calculadora, su simulación completa.
 */
export default function WhatsAppWidget({ simulacion, onParticipar }) {
  const [abierto, setAbierto] = useState(false)
  const [burbuja, setBurbuja] = useState(false)
  const [burbujaVista, setBurbujaVista] = useState(false)
  const panelRef = useRef(null)
  const botonRef = useRef(null)
  const seccion = useActiveSection(IDS)

  /* La burbuja aparece sola una vez, a los 9 s, para no ser invasiva. */
  useEffect(() => {
    if (burbujaVista) return
    const t = setTimeout(() => {
      setBurbuja(true)
      setBurbujaVista(true)
    }, 9000)
    return () => clearTimeout(t)
  }, [burbujaVista])

  /* Se cierra sola a los 12 s si nadie la toca. */
  useEffect(() => {
    if (!burbuja) return
    const t = setTimeout(() => setBurbuja(false), 12000)
    return () => clearTimeout(t)
  }, [burbuja])

  /* Cerrar el panel al hacer clic fuera o con Escape.
     El listener se registra en el siguiente tick: si se registrara de
     inmediato, el mismo gesto que abre el panel podría cerrarlo al instante. */
  useEffect(() => {
    if (!abierto) return

    const fuera = (e) => {
      if (
        !panelRef.current?.contains(e.target) &&
        !botonRef.current?.contains(e.target)
      ) {
        setAbierto(false)
      }
    }
    const escape = (e) => e.key === 'Escape' && setAbierto(false)

    document.addEventListener('keydown', escape)

    const id = setTimeout(() => {
      document.addEventListener('pointerdown', fuera)
    }, 0)

    return () => {
      clearTimeout(id)
      document.removeEventListener('pointerdown', fuera)
      document.removeEventListener('keydown', escape)
    }
  }, [abierto])

  const alternar = () => {
    setBurbuja(false)
    setBurbujaVista(true)
    setAbierto((v) => !v)
  }

  const hayPendientes = CONTACTOS.some((c) => esPendiente(c.whatsapp))

  return (
    <div className="widget-wa fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-3 md:bottom-7 md:right-7">
      {/* ------------------------------ PANEL ------------------------------ */}
      <AnimatePresence>
        {abierto && (
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-label={WIDGET.titulo}
            initial={{ opacity: 0, y: 16, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="w-[min(21rem,calc(100vw-2.5rem))] origin-bottom-right overflow-hidden rounded-2xl bg-navy-deep shadow-[0_28px_60px_-20px_rgba(13,23,48,0.7)] ring-1 ring-white/12"
          >
            <div className="border-b border-white/10 bg-navy px-5 py-4">
              <p className="font-display text-lg text-white">{WIDGET.titulo}</p>
              <p className="mt-1 text-xs leading-relaxed text-white/55">
                {WIDGET.bajada}
              </p>
            </div>

            {onParticipar && (
              <div className="border-b border-white/10 p-3">
                <button
                  type="button"
                  onClick={() => {
                    setAbierto(false)
                    onParticipar()
                  }}
                  className="group/cta flex w-full items-center justify-center gap-2 rounded-xl bg-gold px-4 py-3 text-sm font-semibold text-navy-deep transition-all hover:brightness-110"
                >
                  {PARTICIPAR_MODAL.cta}
                  <span className="transition-transform duration-300 group-hover/cta:translate-x-0.5">
                    →
                  </span>
                </button>
                <p className="mt-2 text-center text-[0.65rem] text-white/35">
                  Arma tu monto y mándalo listo
                </p>
              </div>
            )}

            <div className="p-3">
              {CONTACTOS.map((c, i) => (
                <FilaContacto
                  key={c.id}
                  contacto={c}
                  seccion={seccion}
                  simulacion={simulacion}
                  index={i}
                  onIr={() => setAbierto(false)}
                />
              ))}
            </div>

            {simulacion && (
              <p className="flex items-center gap-2 border-t border-white/10 bg-gold/10 px-5 py-3 text-[0.7rem] text-gold">
                <span aria-hidden>✓</span>
                {WIDGET.notaSimulacion}
              </p>
            )}

            {hayPendientes && (
              <p className="border-t border-white/10 bg-white/[0.04] px-5 py-3 text-[0.7rem] leading-relaxed text-white/45">
                {WIDGET.pendiente}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ----------------------------- BURBUJA ----------------------------- */}
      <AnimatePresence>
        {burbuja && !abierto && (
          <motion.button
            type="button"
            onClick={alternar}
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 16, scale: 0.92 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-[min(17rem,calc(100vw-6rem))] rounded-2xl rounded-br-sm bg-white px-4 py-3 text-left text-[0.8rem] leading-snug text-navy shadow-[0_18px_40px_-16px_rgba(13,23,48,0.55)] ring-1 ring-ice-line"
          >
            {simulacion ? WIDGET.burbuja.conSimulacion : WIDGET.burbuja.sinSimulacion}
          </motion.button>
        )}
      </AnimatePresence>

      {/* ------------------------------ BOTÓN ------------------------------ */}
      <button
        ref={botonRef}
        type="button"
        onClick={alternar}
        aria-label={WIDGET.aria}
        aria-expanded={abierto}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_14px_34px_-10px_rgba(37,211,102,0.75)] transition-transform duration-200 hover:scale-105 active:scale-95 md:h-16 md:w-16"
      >
        {/* halo que late, solo antes del primer clic */}
        {!burbujaVista && (
          <span
            aria-hidden
            className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-25"
            style={{ animationDuration: '2.4s' }}
          />
        )}

        <span className="relative">
          {abierto ? (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              aria-hidden="true"
              className="h-6 w-6"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          ) : (
            <WhatsAppIcon className="h-7 w-7 md:h-8 md:w-8" />
          )}
        </span>

        {/* punto dorado: avisa que la simulación viaja en el mensaje */}
        {simulacion && !abierto && (
          <span
            aria-hidden
            className="absolute -right-0.5 -top-0.5 h-4 w-4 rounded-full bg-gold ring-2 ring-navy-deep"
          />
        )}
      </button>
    </div>
  )
}

function FilaContacto({ contacto, seccion, simulacion, index, onIr }) {
  const href = waLink(contacto, { seccion, simulacion })
  const pendiente = href === null

  const inicial = contacto.corto.charAt(0)
  const esGold = contacto.acento === 'gold'

  const contenido = (
    <>
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-display text-base ${
          esGold ? 'bg-gold text-navy-deep' : 'bg-[#25D366] text-white'
        }`}
      >
        {inicial}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-white">
          {contacto.corto}
        </span>
        <span className="mt-0.5 block text-[0.7rem] leading-snug text-white/45">
          {pendiente ? 'Número pendiente de configurar' : contacto.para}
        </span>
      </span>

      {!pendiente && (
        <span className="shrink-0 text-white/30 transition-all duration-200 group-hover/fila:translate-x-0.5 group-hover/fila:text-gold">
          →
        </span>
      )}
    </>
  )

  const clases =
    'group/fila flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors'

  if (pendiente) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.05 + index * 0.06, duration: 0.25 }}
        className={`${clases} cursor-not-allowed opacity-55`}
        title="Número pendiente de configurar"
      >
        {contenido}
      </motion.div>
    )
  }

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onIr}
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.05 + index * 0.06, duration: 0.25 }}
      className={`${clases} hover:bg-white/[0.07]`}
    >
      {contenido}
    </motion.a>
  )
}
