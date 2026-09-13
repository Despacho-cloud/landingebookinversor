import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Section, { SectionHead } from './Section'
import Reveal from './Reveal'
import { REALISTA, REFERENCIAS, RONDA } from '../data/content'

const ESCALA_MAX = 32 // tope del eje, en % anual

export default function WhyRealistic() {
  const ref = useRef(null)
  const visible = useInView(ref, { once: true, amount: 0.3 })

  return (
    <Section id="realista" tone="light">
      <SectionHead
        eyebrow={REALISTA.eyebrow}
        title={REALISTA.title}
        lead={REALISTA.lead}
      />

      <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_1.25fr] lg:gap-10">
        {/* Cifra principal */}
        <Reveal>
          <div className="card-soft h-full overflow-hidden">
            <div className="bg-navy p-8 text-center md:p-10">
              <p className="eyebrow text-gold">Retorno objetivo</p>
              <p className="tnum mt-4 font-display text-6xl leading-none text-white md:text-7xl">
                {RONDA.retornoMin}–{RONDA.retornoMax}%
              </p>
              <p className="mt-3 text-sm text-white/60">
                a 6 meses, según el plan elegido
              </p>
              <div className="mx-auto my-6 h-px w-16 bg-gold/50" />
              <p className="tnum font-display text-2xl text-gold">
                ≈ {RONDA.anualizadoMin}–{RONDA.anualizadoMax}% anualizado
              </p>
            </div>
            <div className="p-7 md:p-8">
              <p className="text-sm leading-relaxed text-navy/65">
                Cuanto mayor el monto invertido, mayor el porcentaje objetivo — porque un
                ticket más grande financia más pauta, más piezas creativas y más pruebas
                de oferta.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Comparación de mercado */}
        <Reveal delay={0.08}>
          <div ref={ref} className="card-soft h-full p-7 md:p-9">
            <p className="eyebrow text-navy/45">Referencia de mercado</p>
            <p className="mt-2 text-xs text-navy/45">{REALISTA.notaEscala}</p>

            <div className="mt-8 space-y-6">
              {REFERENCIAS.map((ref_, i) => (
                <FilaReferencia key={ref_.label} item={ref_} index={i} visible={visible} />
              ))}
            </div>

            <p className="mt-8 border-t border-ice-line pt-6 text-sm leading-relaxed text-navy/65">
              {REALISTA.cierre}
            </p>
          </div>
        </Reveal>
      </div>

      {/* Callout honesto */}
      <Reveal delay={0.05} className="mt-8">
        <div className="flex flex-col gap-4 rounded-2xl border-2 border-gold/35 bg-gold/[0.07] p-7 md:flex-row md:items-start md:gap-6 md:p-9">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold text-xl text-navy-deep">
            !
          </span>
          <div>
            <h3 className="font-display text-xl text-navy md:text-2xl">
              Esto no es un depósito bancario a plazo
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-navy/75 md:text-base">
              {REALISTA.callout}
            </p>
          </div>
        </div>
      </Reveal>
    </Section>
  )
}

function FilaReferencia({ item, index, visible }) {
  const destacado = item.tipo === 'destacado'
  const izq = (item.min / ESCALA_MAX) * 100
  const ancho = ((item.max - item.min) / ESCALA_MAX) * 100

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span
          className={`text-sm ${
            destacado ? 'font-semibold text-navy' : 'text-navy/65'
          }`}
        >
          {item.label}
        </span>
        <span
          className={`tnum shrink-0 text-sm font-semibold ${
            destacado ? 'text-gold' : 'text-navy/55'
          }`}
        >
          {item.rango}
        </span>
      </div>

      <div className="relative mt-2.5 h-2.5 overflow-hidden rounded-full bg-ice">
        <motion.span
          className={`absolute inset-y-0 rounded-full ${
            destacado ? 'bg-gold' : 'bg-navy/35'
          }`}
          style={{ left: `${izq}%` }}
          initial={{ width: 0 }}
          animate={visible ? { width: `${ancho}%` } : {}}
          transition={{
            duration: 0.8,
            delay: 0.1 + index * 0.12,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      </div>
    </div>
  )
}
