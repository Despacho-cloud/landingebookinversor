import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Bienvenida from './Bienvenida'
import { HERO } from '../data/content'
import { useCountUp } from '../hooks/useCountUp'

export default function Hero() {
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

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="eyebrow mt-7 text-gold"
        >
          {HERO.eyebrow}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 max-w-4xl text-[2.1rem] leading-[1.1] text-white sm:text-5xl md:text-[3.6rem]"
        >
          {HERO.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-2xl text-base leading-relaxed text-white/65 md:text-lg"
        >
          {HERO.lead}
        </motion.p>

        {/* Chips de datos clave */}
        <div
          ref={chipsRef}
          className="mt-11 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
        >
          {HERO.chips.map((chip, i) => (
            <Chip key={chip.label} chip={chip} index={i} visible={chipsVisible} />
          ))}
        </div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="mt-11 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <a
            href="#planes"
            onClick={irA('planes')}
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-gold px-8 py-4 text-sm font-semibold text-navy-deep transition-all hover:brightness-110 hover:shadow-[0_14px_40px_-12px_rgba(201,162,39,0.9)]"
          >
            Quiero invertir
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </a>
          <a
            href="#calculadora"
            onClick={irA('calculadora')}
            className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-white ring-1 ring-white/20 transition-all hover:bg-white/5 hover:ring-white/40"
          >
            Calcular mi retorno
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-8 max-w-2xl text-xs leading-relaxed text-white/40"
        >
          {HERO.nota}
        </motion.p>
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

/** Gradiente animado + retícula sutil. Sin video ni imágenes pesadas. */
function FondoHero() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute inset-0 bg-navy-deep" />

      <div
        className="aurora absolute -left-[15%] -top-[25%] h-[55rem] w-[55rem] rounded-full blur-[120px]"
        style={{
          background:
            'radial-gradient(circle, rgba(30,48,97,0.9) 0%, rgba(21,35,75,0) 70%)',
        }}
      />
      <div
        className="aurora absolute -right-[20%] top-[5%] h-[45rem] w-[45rem] rounded-full blur-[130px]"
        style={{
          background:
            'radial-gradient(circle, rgba(201,162,39,0.18) 0%, rgba(201,162,39,0) 70%)',
          animationDelay: '-7s',
        }}
      />
      <div
        className="aurora absolute -bottom-[30%] left-[25%] h-[40rem] w-[40rem] rounded-full blur-[120px]"
        style={{
          background:
            'radial-gradient(circle, rgba(30,48,97,0.7) 0%, rgba(21,35,75,0) 70%)',
          animationDelay: '-12s',
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
