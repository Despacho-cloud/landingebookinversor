import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView } from 'framer-motion'
import Section from './Section'
import Reveal from './Reveal'
import BandaCTA from './BandaCTA'
import { PLAN_OPERADOR, RONDA } from '../data/content'
import {
  calcular,
  money,
  money2,
  pct,
  serieMensual,
  ventajaOperador,
} from '../lib/finance'
import { useCountUp } from '../hooks/useCountUp'

const MIN = 300
const MAX = 3000
const PASO = 50

export default function Calculator({ estado, setEstado, onParticipar }) {
  const { monto, modalidad, mes, esOperador } = estado
  const [textoMonto, setTextoMonto] = useState(String(monto))

  const ref = useRef(null)
  const visible = useInView(ref, { once: true, amount: 0.2 })

  // Mantiene el input de texto sincronizado con el slider y con los botones
  // "Simular este plan" de la sección de planes.
  useEffect(() => {
    setTextoMonto(String(monto))
  }, [monto])

  const r = useMemo(
    () => calcular({ monto, modalidad, mes, esOperador }),
    [monto, modalidad, mes, esOperador]
  )
  const serie = useMemo(
    () => serieMensual({ monto, modalidad, esOperador }),
    [monto, modalidad, esOperador]
  )

  /* Cualquier cambio marca la simulación como «tocada»: a partir de ahí el
     botón de WhatsApp manda el resumen dentro del mensaje. */
  const set = (patch) => setEstado((s) => ({ ...s, ...patch, tocada: true }))

  /* El rol de operador tiene entrada mínima propia: mientras esté activo, el
     mínimo del control sube a $800. */
  const minMonto = esOperador ? PLAN_OPERADOR.montoMinimo : MIN

  const aplicarTexto = () => {
    const n = Number(textoMonto.replace(/[^\d]/g, ''))
    const limpio =
      Number.isFinite(n) && n > 0 ? Math.min(Math.max(n, minMonto), MAX) : minMonto
    const redondeado = Math.round(limpio / PASO) * PASO
    set({ monto: redondeado })
    setTextoMonto(String(redondeado))
  }

  /* Cuánto ganaría de más este mismo monto entrando como operador */
  const ventaja = useMemo(
    () => (esOperador ? null : ventajaOperador({ monto, modalidad, mes })),
    [monto, modalidad, mes, esOperador]
  )

  const pctSlider = ((monto - minMonto) / (MAX - minMonto)) * 100
  const pctMes = ((mes - RONDA.bloqueoMeses) / (RONDA.mesesCiclo - RONDA.bloqueoMeses)) * 100

  return (
    <Section id="calculadora" tone="navy">
      <div ref={ref}>
        <Reveal className="max-w-3xl">
          <p className="eyebrow text-gold">Calculadora de retorno</p>
          <h2 className="mt-3 text-3xl leading-[1.15] text-white md:text-[2.6rem]">
            Simula tu participación en tiempo real
          </h2>
          <p className="mt-5 text-base leading-relaxed text-white/65 md:text-lg">
            Mueve el monto, elige tu modalidad de pago y el mes de salida. El plan se
            detecta solo y el resultado se recalcula al instante.
          </p>
        </Reveal>

        <Reveal delay={0.08} className="mt-12">
          <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:gap-8">
            {/* ---------------------------- CONTROLES ---------------------------- */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm md:p-9">
              {/* Monto */}
              <div>
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <label
                    htmlFor="monto"
                    className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-white/50"
                  >
                    Monto a invertir
                  </label>
                  <div className="flex items-center gap-1 rounded-lg bg-white/8 px-3 py-1.5 ring-1 ring-white/10 focus-within:ring-gold/60">
                    <span className="text-lg text-white/50">$</span>
                    <input
                      id="monto-texto"
                      type="number"
                      inputMode="numeric"
                      className="no-spin tnum w-24 bg-transparent text-right font-display text-xl text-white outline-none"
                      value={textoMonto}
                      min={minMonto}
                      max={MAX}
                      step={PASO}
                      onChange={(e) => setTextoMonto(e.target.value)}
                      onBlur={aplicarTexto}
                      onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
                    />
                  </div>
                </div>

                <input
                  id="monto"
                  type="range"
                  className="range-gold mt-4"
                  min={minMonto}
                  max={MAX}
                  step={PASO}
                  value={monto}
                  onChange={(e) => set({ monto: Number(e.target.value) })}
                  style={{
                    '--track': `linear-gradient(90deg, var(--color-gold) ${pctSlider}%, rgba(255,255,255,0.14) ${pctSlider}%)`,
                  }}
                  aria-label="Monto a invertir en dólares"
                />

                <div className="flex justify-between text-[0.7rem] text-white/35">
                  <span>{money(minMonto)}</span>
                  <span>{money(MAX)} · meta total de la ronda</span>
                </div>
              </div>

              {/* Plan detectado */}
              <div className="mt-8">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-white/50">
                  Tu plan
                </p>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${r.plan?.id}-${modalidad}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="mt-2.5 inline-flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border border-gold/40 bg-gold/10 px-4 py-3"
                  >
                    <span className="font-display text-lg text-white">
                      {r.plan?.nombre ?? 'Monto insuficiente'}
                    </span>
                    <span className="hidden h-4 w-px bg-white/20 sm:block" />
                    <span className="tnum text-sm font-semibold text-gold">
                      {pct(r.tasaPlena)} objetivo a 6 meses
                    </span>
                  </motion.div>
                </AnimatePresence>

                <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-white/20">
                  <input
                    type="checkbox"
                    checked={esOperador}
                    onChange={(e) =>
                      set({
                        esOperador: e.target.checked,
                        // El rol de operador tiene entrada mínima propia.
                        monto: e.target.checked
                          ? Math.max(monto, PLAN_OPERADOR.montoMinimo)
                          : monto,
                      })
                    }
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[#C9A227]"
                  />
                  <span>
                    <span className="block text-sm font-medium text-white/85">
                      Quiero participar también como operador
                      <span className="ml-2 rounded-full bg-gold/20 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-gold">
                        +1 punto
                      </span>
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-white/45">
                      Aporto ideas, presencia en video e insumos creativos, y presento
                      el proyecto ante las juntas. Desde $800:{' '}
                      <strong className="font-semibold text-white/70">13%</strong> de $800
                      a $1,199 y{' '}
                      <strong className="font-semibold text-white/70">15%</strong> desde
                      $1,200 (pago único). La colaboración se formaliza aparte en el
                      contrato.
                    </span>

                    {/* La ventaja en concreto, con el monto que ya tiene puesto */}
                    {!esOperador && ventaja && (
                      <span className="mt-2 block text-xs font-semibold text-gold">
                        Con {money(monto)} serían {pct(ventaja.tasaOperador)} en vez de{' '}
                        {pct(ventaja.tasaNormal)} — {money2(ventaja.extra)} más.
                      </span>
                    )}
                  </span>
                </label>
              </div>

              {/* Modalidad de pago */}
              <div className="mt-8">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-white/50">
                  Modalidad de pago
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-white/[0.06] p-1.5">
                  {[
                    { id: 'unico', label: 'Pago único', sub: '100% al confirmar' },
                    { id: 'cuotas', label: '2 cuotas', sub: '50% + 50% a 30 días' },
                  ].map((m) => {
                    const activo = modalidad === m.id
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => set({ modalidad: m.id })}
                        className="relative rounded-lg px-3 py-3 text-center transition-colors"
                      >
                        {activo && (
                          <motion.span
                            layoutId="modalidad-activa"
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
              </div>

              {/* Mes de salida */}
              <div className="mt-8">
                <div className="flex items-end justify-between gap-3">
                  <label
                    htmlFor="mes"
                    className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-white/50"
                  >
                    Mes de salida
                  </label>
                  <span className="tnum font-display text-xl text-white">
                    Mes {mes}
                    {r.esCierre && (
                      <span className="ml-2 text-[0.65rem] font-sans uppercase tracking-wider text-gold">
                        cierre de ciclo
                      </span>
                    )}
                  </span>
                </div>

                <input
                  id="mes"
                  type="range"
                  className="range-gold mt-4"
                  min={RONDA.bloqueoMeses}
                  max={RONDA.mesesCiclo}
                  step={1}
                  value={mes}
                  onChange={(e) => set({ mes: Number(e.target.value) })}
                  style={{
                    '--track': `linear-gradient(90deg, var(--color-gold) ${pctMes}%, rgba(255,255,255,0.14) ${pctMes}%)`,
                  }}
                  aria-label="Mes de salida del ciclo"
                />

                <div className="tnum flex justify-between text-[0.7rem] text-white/35">
                  {[3, 4, 5, 6].map((m) => (
                    <span key={m} className={mes === m ? 'text-gold' : ''}>
                      {m}
                    </span>
                  ))}
                </div>

                <p className="mt-3 flex items-start gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-[0.7rem] leading-relaxed text-white/45">
                  <span className="mt-px text-gold">🔒</span>
                  Bloqueo mínimo de {RONDA.bloqueoMeses} meses: no es posible retirar el
                  capital antes del mes {RONDA.bloqueoMeses}.
                </p>
              </div>
            </div>

            {/* ---------------------------- RESULTADO ---------------------------- */}
            <div className="flex flex-col gap-6">
              <div className="rounded-2xl border border-gold/25 bg-gradient-to-b from-white/[0.09] to-white/[0.03] p-6 backdrop-blur-sm md:p-8">
                <p className="eyebrow text-gold">Resultado estimado</p>

                <div className="mt-6 space-y-5">
                  <Cifra
                    label="Capital invertido"
                    valor={monto}
                    formato={money}
                    activo={visible}
                  />
                  <Cifra
                    label={`Retorno estimado al mes ${mes}`}
                    valor={r.tasa}
                    formato={pct}
                    activo={visible}
                    acento
                  />
                  <Cifra
                    label="Monto de retorno"
                    valor={r.retorno}
                    formato={money2}
                    activo={visible}
                  />
                </div>

                <div className="mt-7 border-t border-white/12 pt-6">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-white/50">
                    Total a recibir al salir
                  </p>
                  <TotalGrande valor={r.total} activo={visible} />
                  <p className="mt-2 text-xs text-white/45">
                    Capital + retorno, en un solo pago
                    {r.esCierre
                      ? ' al cierre del ciclo (mes 6).'
                      : ` en el momento del retiro anticipado (mes ${mes}).`}
                  </p>
                </div>

                <p className="mt-6 rounded-lg bg-white/[0.05] p-3.5 text-[0.7rem] leading-relaxed text-white/50">
                  Este valor es un <strong className="text-white/75">objetivo de
                  gestión</strong>, no una garantía de rendimiento. El capital no está
                  garantizado.
                </p>
              </div>

              <GraficoEvolucion serie={serie} mesActivo={mes} onMes={(m) => set({ mes: m })} />
            </div>
          </div>
        </Reveal>

        {/* El momento de mayor intención: acaba de ver su número */}
        <BandaCTA
          tone="dark"
          onParticipar={onParticipar}
          texto="¿Te cuadra el número?"
          nota="Llévalo a WhatsApp con tu monto, tu plan y tu total ya escritos."
        />
      </div>
    </Section>
  )
}

/* ------------------------------ subcomponentes ----------------------------- */

function Cifra({ label, valor, formato, activo, acento = false }) {
  const n = useCountUp(valor, { active: activo, duration: 600 })

  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-sm text-white/55">{label}</span>
      <span
        className={`tnum font-display text-2xl ${acento ? 'text-gold' : 'text-white'}`}
      >
        {formato(n)}
      </span>
    </div>
  )
}

function TotalGrande({ valor, activo }) {
  const n = useCountUp(valor, { active: activo, duration: 700 })

  return (
    <p className="tnum mt-2 font-display text-[2.75rem] leading-none text-gold md:text-5xl">
      {money2(n)}
    </p>
  )
}

/** Barras mes 3 → 6: cómo crece el retorno con el tiempo transcurrido. */
function GraficoEvolucion({ serie, mesActivo, onMes }) {
  const max = Math.max(...serie.map((s) => s.retorno), 1)

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm md:p-7">
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-white/50">
        Cómo crece el retorno según el mes de salida
      </p>

      <div className="mt-6 flex h-40 items-end gap-3">
        {serie.map((s) => {
          const activo = s.mes === mesActivo
          return (
            <button
              key={s.mes}
              type="button"
              onClick={() => onMes(s.mes)}
              className="group flex h-full flex-1 flex-col justify-end gap-2 text-center"
              aria-label={`Ver retorno al mes ${s.mes}`}
            >
              <span
                className={`tnum text-xs font-semibold transition-colors ${
                  activo ? 'text-gold' : 'text-white/40 group-hover:text-white/70'
                }`}
              >
                {pct(s.tasa)}
              </span>
              <motion.span
                className={`block w-full rounded-t-md transition-colors ${
                  activo ? 'bg-gold' : 'bg-white/15 group-hover:bg-white/25'
                }`}
                animate={{ height: `${(s.retorno / max) * 100}%` }}
                transition={{ type: 'spring', stiffness: 200, damping: 26 }}
              />
              <span
                className={`tnum text-[0.7rem] transition-colors ${
                  activo ? 'text-white' : 'text-white/35'
                }`}
              >
                Mes {s.mes}
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-5 border-t border-white/10 pt-4">
        <div className="grid grid-cols-4 gap-2 pb-2 text-[0.65rem] uppercase tracking-wider text-white/25">
          <span>Salida</span>
          <span className="text-right">Retorno</span>
          <span className="text-right">Monto</span>
          <span className="text-right">Total</span>
        </div>
        {serie.map((s) => (
          <div
            key={s.mes}
            className={`tnum grid grid-cols-4 gap-2 border-t border-white/[0.06] py-1.5 text-xs transition-colors ${
              s.mes === mesActivo ? 'text-white' : 'text-white/40'
            }`}
          >
            <span>Mes {s.mes}</span>
            <span className="text-right">{pct(s.tasa)}</span>
            <span className="text-right">{money2(s.retorno)}</span>
            <span className="text-right font-semibold">{money2(s.total)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
