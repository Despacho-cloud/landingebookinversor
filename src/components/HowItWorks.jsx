import Section, { SectionHead } from './Section'
import Reveal, { RevealGroup, RevealItem } from './Reveal'
import { MODELO, CAPITAL, RONDA } from '../data/content'
import { money } from '../lib/finance'

export default function HowItWorks() {
  return (
    <Section id="modelo" tone="dark">
      <SectionHead
        tone="dark"
        eyebrow={MODELO.eyebrow}
        title={MODELO.title}
        lead={MODELO.lead}
      />

      {/* Los 4 pasos del flujo de capital */}
      <RevealGroup className="mt-14 grid gap-px overflow-hidden rounded-2xl bg-white/10 md:grid-cols-2">
        {MODELO.pasos.map((p) => (
          <RevealItem key={p.n}>
            <article className="group h-full bg-navy-deep p-7 transition-colors duration-300 hover:bg-navy md:p-9">
              <span className="tnum font-display text-3xl text-gold/45 transition-colors duration-300 group-hover:text-gold">
                {p.n}
              </span>
              <h3 className="mt-3 text-lg text-white md:text-xl">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60">{p.body}</p>
            </article>
          </RevealItem>
        ))}
      </RevealGroup>

      {/* Plan de capital: arranque vs escalado */}
      <Reveal delay={0.05} className="mt-16">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 md:p-11">
          <p className="eyebrow text-gold">{CAPITAL.eyebrow}</p>
          <h3 className="mt-3 font-display text-2xl text-white md:text-[2rem]">
            {CAPITAL.title}
          </h3>
          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-white/65 md:text-base">
            {CAPITAL.lead}
          </p>

          <BarraCapital />

          <p className="mt-7 border-l-2 border-gold/50 pl-4 text-sm leading-relaxed text-white/55">
            {CAPITAL.nota}
          </p>
        </div>
      </Reveal>

      {/* Lo que aporta la marca */}
      <Reveal delay={0.05} className="mt-16">
        <h3 className="font-display text-2xl text-white md:text-[2rem]">
          {MODELO.operacion.title}
        </h3>
        <RevealGroup
          stagger={0.03}
          className="mt-7 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          {MODELO.operacion.items.map((item) => (
            <RevealItem key={item} y={10}>
              <div className="flex items-start gap-3 border-b border-white/8 pb-3">
                <span className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-gold" />
                <span className="text-sm leading-snug text-white/65">{item}</span>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <p className="mt-9 font-display text-lg text-gold md:text-xl">
          {MODELO.operacion.claim}
        </p>
      </Reveal>
    </Section>
  )
}

/** Barra que separa visualmente el arranque ($1,200) del escalado (+$1,800). */
function BarraCapital() {
  const pctArranque = (RONDA.arranque / RONDA.metaTotal) * 100

  return (
    <div className="mt-9">
      <div className="flex items-end justify-between gap-4 text-xs text-white/50">
        <span>Arranque · Ronda 1</span>
        <span>Meta total de recaudación</span>
      </div>

      <div className="mt-3 flex h-16 overflow-hidden rounded-xl ring-1 ring-white/10">
        <div
          className="relative flex items-center justify-center bg-gold/90 text-navy-deep"
          style={{ width: `${pctArranque}%` }}
        >
          <span className="tnum font-display text-lg font-semibold md:text-xl">
            {money(RONDA.arranque)}
          </span>
        </div>
        <div
          className="relative flex flex-1 items-center justify-center bg-white/[0.07]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(135deg, rgba(255,255,255,0.06) 0 8px, transparent 8px 16px)',
          }}
        >
          <span className="tnum font-display text-lg text-white/80 md:text-xl">
            +{money(RONDA.adicional)}
          </span>
        </div>
      </div>

      <div className="mt-3 grid gap-2 text-xs leading-relaxed text-white/45 sm:grid-cols-2">
        <p>
          <strong className="font-semibold text-white/70">Activa el proyecto.</strong> Se
          reúne entre varios inversionistas: ningún aporte individual financia el proyecto
          completo.
        </p>
        <p className="sm:text-right">
          <strong className="font-semibold text-white/70">Escalado progresivo.</strong> Se
          recauda durante los primeros meses del ciclo para escalar la pauta de los kits
          con tracción.
        </p>
      </div>
    </div>
  )
}
