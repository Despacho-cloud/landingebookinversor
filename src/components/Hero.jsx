import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Bienvenida from './Bienvenida'
import { HERO } from '../data/content'
import { useCountUp } from '../hooks/useCountUp'

export default function Hero({ onParticipar }) {
  const chipsRef = useRef(null)
  const chipsVisible = useInView(chipsRef, { once: true, amount: 0.4 })

  const irA = (id) => (e) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section id="top" className="relative isolate overflow-hidden bg-navy-deep">
      <FondoHero />

      <div className="container-page relative pb-20 pt-28 md:pb-28 md:pt-40">
        <Bienvenida />

        {/* El titular y su bajada se pintan de inmediato, sin animación de
            entrada: son lo primero que debe leerse. Antes arrancaban en
            opacity 0 y tardaban 0.75 s más en aparecer después de que React
            montara, lo que se percibía como que el sitio seguía cargando. */}
        <p className="eyebrow mt-7 text-gold">{HERO.eyebrow}</p>

        <h1 className="mt-5 max-w-4xl text-[2.1rem] leading-[1.1] text-white sm:text-5xl md:text-[3.6rem]">
          {HERO.title}
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/65 md:text-lg">
          {HERO.lead}
        </p>

        {/* Chips de datos clave */}
        <div
          ref={chipsRef}
          className="mt-11 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
        >
          {HERO.chips.map((chip, i) => (
            <Chip key={chip.label} chip={chip} index={i} visible={chipsVisible} />
          ))}
        </div>

        {/* CTAs — visibles desde el primer frame, sin espera */}
        <div className="mt-11 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={onParticipar}
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-gold px-8 py-4 text-sm font-semibold text-navy-deep transition-all hover:brightness-110 hover:shadow-[0_14px_40px_-12px_rgba(201,162,39,0.9)]"
          >
            Quiero participar
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </button>
          <a
            href="#calculadora"
            onClick={irA('calculadora')}
            className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-white ring-1 ring-white/20 transition-all hover:bg-white/5 hover:ring-white/40"
          >
            Calcular mi retorno
          </a>
        </div>

        <p className="mt-8 max-w-2xl text-xs leading-relaxed text-white/40">
          {HERO.nota}
        </p>
      </div>
    </section>
  )
}

function Chip({ chip, index, visible }) {
  const n = useCountUp(chip.value ?? 0, { active: visible && chip.value !== null })
  const valor =
    chip.display ??
    `${chip.prefix ?? ''}${Math.round(n).toLocaleString('en-US')}${chip.suffix ?? ''}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: 0.08 * index, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm transition-colors duration-300 hover:border-gold/40 md:p-5"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <p className="tnum font-display text-2xl text-gold md:text-[2rem]">{valor}</p>
      <p className="mt-1.5 text-[0.7rem] leading-snug text-white/50 md:text-xs">
        {chip.label}
      </p>
    </motion.div>
  )
}

/**
 * Fondo del hero: gradientes suaves + retícula fina.
 *
 * Antes eran tres círculos de ~880 px con filter: blur(120px) animados con
 * scale, cada uno con will-change. Eso obliga al navegador a volver a
 * rasterizar tres capas enormes y desenfocadas en cada frame — lo más caro de
 * toda la página en un teléfono. Un radial-gradient ya es suave por
 * definición, así que el desenfoque sobraba: mismo aspecto, sin filtro, sin
 * capas extra y sin trabajo por frame.
 */
function FondoHero() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <div
        className="absolute inset-0 bg-navy-deep"
        style={{
          backgroundImage: [
            'radial-gradient(60rem 45rem at 8% -10%, rgba(30,48,97,0.85) 0%, rgba(21,35,75,0) 65%)',
            'radial-gradient(45rem 40rem at 95% 12%, rgba(201,162,39,0.16) 0%, rgba(201,162,39,0) 62%)',
            'radial-gradient(42rem 38rem at 38% 108%, rgba(30,48,97,0.7) 0%, rgba(21,35,75,0) 66%)',
          ].join(','),
        }}
      />

      {/* Único elemento animado: solo opacidad, que la GPU compone sin
          volver a rasterizar nada. */}
      <div
        className="respiro absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(38rem 32rem at 78% 20%, rgba(201,162,39,0.13) 0%, rgba(201,162,39,0) 60%)',
        }}
      />

      {/* retícula fina */}
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.09) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.09) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage:
            'radial-gradient(ellipse 90% 70% at 50% 25%, #000 25%, transparent 75%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 90% 70% at 50% 25%, #000 25%, transparent 75%)',
        }}
      />

      {/* desvanecido hacia la siguiente sección */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-navy-deep" />
    </div>
  )
}
