import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import WhatsAppIcon from './WhatsAppIcon'
import {
  CONTACTOS,
  PARTICIPAR_MODAL as T,
  PLANES,
  PLAN_OPERADOR,
  RONDA,
  waLinkParticipar,
} from '../data/content'
import { calcular, money, money2, pct, ventajaOperador } from '../lib/finance'
import { useCountUp } from '../hooks/useCountUp'

const MIN = PLANES[0].monto // $300
const MAX = RONDA.metaTotal // $3,000
const PASO = 50

/**
 * Flujo «Quiero participar».
 *
 * Hoja inferior en móvil (el pulgar llega a los controles y al botón de envío)
 * y diálogo centrado desde tablet en adelante. Una sola pantalla, sin pasos:
 * monto → resultado → enviar.
 */
export default function ModalParticipar({ abierto, onCerrar, inicial }) {
  const [nombre, setNombre] = useState('')
  const [monto, setMonto] = useState(inicial?.monto ?? 600)
  const [textoMonto, setTextoMonto] = useState(String(inicial?.monto ?? 600))
  const [modalidad, setModalidad] = useState(inicial?.modalidad ?? 'unico')
  const [esOperador, setEsOperador] = useState(inicial?.esOperador ?? false)

  const cajaRef = useRef(null)
  const cierreRef = useRef(null)
  const devolverFocoA = useRef(null)

  /* Al abrir, arranca desde lo que el visitante ya haya simulado. */
  useEffect(() => {
    if (!abierto) return
    if (inicial?.monto) {
      setMonto(inicial.monto)
      setTextoMonto(String(inicial.monto))
    }
    if (inicial?.modalidad) setModalidad(inicial.modalidad)
    if (inicial?.esOperador != null) setEsOperador(inicial.esOperador)
  }, [abierto, inicial?.monto, inicial?.modalidad, inicial?.esOperador])

  /* Bloquea el scroll de fondo, cierra con Escape y devuelve el foco al salir. */
  useEffect(() => {
    if (!abierto) return

    devolverFocoA.current = document.activeElement
    const overflowPrevio = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const alTeclado = (e) => {
      if (e.key === 'Escape') {
        onCerrar()
        return
      }
      /* Trampa de foco: el tabulador no se escapa del diálogo. */
      if (e.key !== 'Tab' || !cajaRef.current) return

      const focos = cajaRef.current.querySelectorAll(
        'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'
      )
      if (!focos.length) return
      const primero = focos[0]
      const ultimo = focos[focos.length - 1]

      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault()
        ultimo.focus()
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault()
        primero.focus()
      }
    }

    document.addEventListener('keydown', alTeclado)
    const t = setTimeout(() => cierreRef.current?.focus(), 80)

    return () => {
      document.removeEventListener('keydown', alTeclado)
      clearTimeout(t)
      document.body.style.overflow = overflowPrevio
      devolverFocoA.current?.focus?.()
    }
  }, [abierto, onCerrar])

  const r = useMemo(
    () => calcular({ monto, modalidad, mes: RONDA.mesesCiclo, esOperador }),
    [monto, modalidad, esOperador]
  )

  const participacion = useMemo(
    () => ({
      monto: money(monto),
      plan: r.plan?.nombre ?? 'Sin plan asignado',
      modalidad: modalidad === 'cuotas' ? 'Pago en 2 cuotas' : 'Pago único',
      tasa: pct(r.tasa),
      retorno: money2(r.retorno),
      total: money2(r.total),
      esOperador,
    }),
    [monto, modalidad, r, esOperador]
  )

  /* El rol de operador tiene entrada mínima propia ($800). */
  const minMonto = esOperador ? PLAN_OPERADOR.montoMinimo : MIN

  /* Cuánto ganaría de más con este mismo monto si entrara como operador */
  const ventaja = useMemo(
    () => (esOperador ? null : ventajaOperador({ monto, modalidad })),
    [monto, modalidad, esOperador]
  )

  const aplicarTexto = () => {
    const n = Number(textoMonto.replace(/[^\d]/g, ''))
    const limpio =
      Number.isFinite(n) && n > 0 ? Math.min(Math.max(n, minMonto), MAX) : minMonto
    const redondeado = Math.round(limpio / PASO) * PASO
    setMonto(redondeado)
    setTextoMonto(String(redondeado))
  }

  const alternarOperador = (activo) => {
    setEsOperador(activo)
    if (activo && monto < PLAN_OPERADOR.montoMinimo) {
      setMonto(PLAN_OPERADOR.montoMinimo)
      setTextoMonto(String(PLAN_OPERADOR.montoMinimo))
    }
  }

  const pctSlider = ((monto - minMonto) / (MAX - minMonto)) * 100

  return (
    <AnimatePresence>
      {abierto && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onMouseDown={(e) => e.target === e.currentTarget && onCerrar()}
          className="fixed inset-0 z-[70] flex items-end justify-center bg-navy-deep/75 backdrop-blur-sm sm:items-center sm:p-6"
        >
          <motion.div
            ref={cajaRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="participar-titulo"
            initial={{ y: '100%', opacity: 0.6 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0.4 }}
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
            className="flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-3xl bg-navy-deep shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.7)] ring-1 ring-white/12 sm:max-h-[88dvh] sm:max-w-lg sm:rounded-3xl"
          >
            <Encabezado onCerrar={onCerrar} cierreRef={cierreRef} />

            <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-6 sm:px-7">
              {/* Nombre */}
              <Campo etiqueta={T.campoNombre} ayuda={T.ayudaNombre}>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder={T.placeholderNombre}
                  autoComplete="name"
                  className="w-full rounded-xl border border-white/12 bg-white/[0.05] px-4 py-3.5 text-base text-white outline-none transition-colors placeholder:text-white/30 focus:border-gold/60 focus:bg-white/[0.08]"
                />
              </Campo>

              {/* Monto */}
              <Campo etiqueta={T.campoMonto} className="mt-7">
                <div className="flex flex-wrap gap-2">
                  {/* Con el rol de operador activo, los atajos por debajo de su
                      entrada mínima no aplican. */}
                  {PLANES.filter((p) => p.monto >= minMonto).map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setMonto(p.monto)}
                      className={`flex-1 rounded-xl px-3 py-2.5 text-center text-xs font-semibold transition-all ${
                        monto === p.monto
                          ? 'bg-gold text-navy-deep'
                          : 'bg-white/[0.06] text-white/70 ring-1 ring-white/10 hover:bg-white/[0.1]'
                      }`}
                    >
                      <span className="tnum block text-sm">{money(p.monto)}</span>
                      <span className="mt-0.5 block text-[0.65rem] font-normal opacity-75">
                        {p.nombre.replace('Plan ', '')}
                      </span>
                    </button>
                  ))}

                  {esOperador && (
                    <button
                      type="button"
                      onClick={() => setMonto(PLAN_OPERADOR.montoMinimo)}
                      className={`flex-1 rounded-xl px-3 py-2.5 text-center text-xs font-semibold transition-all ${
                        monto === PLAN_OPERADOR.montoMinimo
                          ? 'bg-gold text-navy-deep'
                          : 'bg-white/[0.06] text-white/70 ring-1 ring-white/10 hover:bg-white/[0.1]'
                      }`}
                    >
                      <span className="tnum block text-sm">
                        {money(PLAN_OPERADOR.montoMinimo)}
                      </span>
                      <span className="mt-0.5 block text-[0.65rem] font-normal opacity-75">
                        Operador
                      </span>
                    </button>
                  )}
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <div className="flex items-center gap-1 rounded-xl bg-white/[0.07] px-3 py-2 ring-1 ring-white/10 focus-within:ring-gold/60">
                    <span className="text-lg text-white/45">$</span>
                    <input
                      type="number"
                      inputMode="numeric"
                      value={textoMonto}
                      min={minMonto}
                      max={MAX}
                      step={PASO}
                      onChange={(e) => setTextoMonto(e.target.value)}
                      onBlur={aplicarTexto}
                      onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
                      aria-label="Monto a invertir en dólares"
                      className="no-spin tnum w-24 bg-transparent text-right font-display text-xl text-white outline-none"
                    />
                  </div>

                  <input
                    type="range"
                    className="range-gold flex-1"
                    min={minMonto}
                    max={MAX}
                    step={PASO}
                    value={monto}
                    onChange={(e) => setMonto(Number(e.target.value))}
                    aria-label="Monto a invertir"
                    style={{
                      '--track': `linear-gradient(90deg, var(--color-gold) ${pctSlider}%, rgba(255,255,255,0.14) ${pctSlider}%)`,
                    }}
                  />
                </div>

                <p className="tnum mt-1 flex justify-between text-[0.7rem] text-white/35">
                  <span>mín. {money(minMonto)}</span>
                  <span>{money(MAX)}</span>
                </p>
              </Campo>

              {/* Modalidad */}
              <Campo etiqueta={T.campoModalidad} className="mt-7">
                <div className="grid grid-cols-2 gap-2 rounded-xl bg-white/[0.06] p-1.5">
                  {[
                    { id: 'unico', label: 'Pago único', sub: '100% al confirmar' },
                    { id: 'cuotas', label: '2 cuotas', sub: '50% + 50% a 30 días' },
                  ].map((m) => {
                    const activo = modalidad === m.id
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setModalidad(m.id)}
                        className="relative rounded-lg px-3 py-3 text-center transition-colors"
                      >
                        {activo && (
                          <motion.span
                            layoutId="modalidad-modal"
                            className="absolute inset-0 rounded-lg bg-gold"
                            transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                          />
                        )}
                        <span className="relative block">
                          <span
                            className={`block text-sm font-semibold ${
                              activo ? 'text-navy-deep' : 'text-white/75'
                            }`}
                          >
                            {m.label}
                          </span>
                          <span
                            className={`mt-0.5 block text-[0.65rem] ${
                              activo ? 'text-navy-deep/70' : 'text-white/40'
                            }`}
                          >
                            {m.sub}
                          </span>
                        </span>
                      </button>
                    )
                  })}
                </div>
              </Campo>

              {/* Rol de operador */}
              <label className="mt-7 flex cursor-pointer items-start gap-3 rounded-2xl border border-gold/30 bg-gold/[0.07] p-4 transition-colors hover:border-gold/55">
                <input
                  type="checkbox"
                  checked={esOperador}
                  onChange={(e) => alternarOperador(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-[#C9A227]"
                />
                <span>
                  <span className="flex flex-wrap items-center gap-2 text-sm font-semibold text-white">
                    Entrar como operador
                    <span className="rounded-full bg-gold px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-navy-deep">
                      +1 punto
                    </span>
                  </span>
                  <span className="mt-1.5 block text-xs leading-relaxed text-white/55">
                    Además de capital aportas ideas, presencia en video e insumos
                    creativos, y presentas el proyecto ante las juntas. Desde{' '}
                    {money(PLAN_OPERADOR.montoMinimo)}.
                  </span>

                  {/* La ventaja, en concreto y con el monto que ya eligió */}
                  {!esOperador && ventaja && (
                    <span className="mt-2 block text-xs font-semibold text-gold">
                      Con este monto serían {pct(ventaja.tasaOperador)} en vez de{' '}
                      {pct(ventaja.tasaNormal)} — {money2(ventaja.extra)} más.
                    </span>
                  )}
                </span>
              </label>

              {/* Resultado */}
              <Resultado resultado={r} monto={monto} esOperador={esOperador} />

              <p className="mt-4 rounded-xl bg-white/[0.04] p-3.5 text-[0.7rem] leading-relaxed text-white/50">
                {T.aviso}
              </p>
            </div>

            {/* Envío — fijo al pie, siempre al alcance del pulgar */}
            <div className="border-t border-white/10 bg-navy px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5 sm:px-7">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-white/45">
                {T.enviarTitulo}
              </p>
              <p className="mt-1 text-xs text-white/45">{T.enviarBajada}</p>

              <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {CONTACTOS.map((c) => (
                  <BotonEnviar
                    key={c.id}
                    contacto={c}
                    nombre={nombre}
                    participacion={participacion}
                    onEnviado={onCerrar}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ------------------------------ subcomponentes ----------------------------- */

function Encabezado({ onCerrar, cierreRef }) {
  return (
    <div className="relative shrink-0 border-b border-white/10 bg-navy px-5 pb-5 pt-5 sm:px-7">
      {/* asa de la hoja inferior, solo en móvil */}
      <span
        aria-hidden
        className="absolute left-1/2 top-2 h-1 w-10 -translate-x-1/2 rounded-full bg-white/20 sm:hidden"
      />

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="eyebrow text-gold">Ronda privada · cupos limitados</p>
          <h2
            id="participar-titulo"
            className="mt-2 font-display text-2xl leading-tight text-white"
          >
            {T.titulo}
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-white/55">{T.bajada}</p>
        </div>

        <button
          ref={cierreRef}
          type="button"
          onClick={onCerrar}
          aria-label="Cerrar"
          className="-mr-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white/60 ring-1 ring-white/15 transition hover:bg-white/5 hover:text-white"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
            className="h-4 w-4"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
    </div>
  )
}

function Campo({ etiqueta, ayuda, children, className = '' }) {
  return (
    <div className={className}>
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-white/50">
        {etiqueta}
      </p>
      <div className="mt-3">{children}</div>
      {ayuda && <p className="mt-2 text-[0.7rem] text-white/35">{ayuda}</p>}
    </div>
  )
}

function Resultado({ resultado, monto, esOperador }) {
  const total = useCountUp(resultado.total, { duration: 600 })
  const ganancia = useCountUp(resultado.retorno, { duration: 600 })

  return (
    <div className="mt-7 overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-b from-gold/[0.14] to-gold/[0.04]">
      <div className="flex items-center justify-between gap-3 border-b border-gold/20 px-5 py-3">
        <span className="text-xs text-white/60">Tu plan</span>
        <span className="flex items-center gap-2">
          <span className="font-display text-base text-white">
            {resultado.plan?.nombre ?? 'Monto insuficiente'}
          </span>
          {esOperador && resultado.plan?.id === 'operador' && (
            <span className="rounded-full bg-white/15 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-gold">
              +1 pt
            </span>
          )}
          <span className="tnum rounded-full bg-gold px-2 py-0.5 text-[0.7rem] font-bold text-navy-deep">
            {pct(resultado.tasa)}
          </span>
        </span>
      </div>

      <div className="px-5 py-5 text-center">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-white/50">
          {T.resultadoTitulo(RONDA.mesesCiclo)}
        </p>
        <p className="tnum mt-2 font-display text-[2.6rem] leading-none text-gold sm:text-5xl">
          {money2(total)}
        </p>
        <p className="mt-2 text-xs text-white/50">{T.resultadoPie}</p>
      </div>

      <div className="tnum grid grid-cols-2 divide-x divide-white/10 border-t border-white/10 text-center">
        <div className="px-4 py-3.5">
          <p className="text-[0.65rem] uppercase tracking-wider text-white/40">
            Tu capital
          </p>
          <p className="mt-1 font-display text-lg text-white">{money(monto)}</p>
        </div>
        <div className="px-4 py-3.5">
          <p className="text-[0.65rem] uppercase tracking-wider text-white/40">
            Ganancia objetivo
          </p>
          <p className="mt-1 font-display text-lg text-gold">+{money2(ganancia)}</p>
        </div>
      </div>
    </div>
  )
}

function BotonEnviar({ contacto, nombre, participacion, onEnviado }) {
  const href = waLinkParticipar(contacto, { nombre, participacion })
  const esGold = contacto.acento === 'gold'

  if (!href) {
    return (
      <div
        className="flex items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-sm font-semibold text-white/35 ring-1 ring-white/10"
        title="Número pendiente de configurar"
      >
        {contacto.corto} — pendiente
      </div>
    )
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onEnviado}
      className={`group flex items-center justify-center gap-2.5 rounded-2xl px-4 py-3.5 text-sm font-semibold transition-all active:scale-[0.98] ${
        esGold
          ? 'bg-gold text-navy-deep hover:brightness-110 hover:shadow-[0_14px_36px_-12px_rgba(201,162,39,0.9)]'
          : 'bg-[#25D366] text-white hover:brightness-110 hover:shadow-[0_14px_36px_-12px_rgba(37,211,102,0.85)]'
      }`}
    >
      <WhatsAppIcon className="h-5 w-5" />
      Enviar a {contacto.corto}
      <span className="transition-transform duration-300 group-hover:translate-x-0.5">
        →
      </span>
    </a>
  )
}
