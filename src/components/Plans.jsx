import Section, { SectionHead } from './Section'
import Reveal, { RevealGroup, RevealItem } from './Reveal'
import PlanCard from './PlanCard'
import { PLANES, PLANES_INTRO, PLAN_OPERADOR, RONDA } from '../data/content'
import { money } from '../lib/finance'

export default function Plans({ onSimular }) {
  return (
    <Section id="planes" tone="light">
      <SectionHead
        eyebrow={PLANES_INTRO.eyebrow}
        title={PLANES_INTRO.title}
        lead={PLANES_INTRO.lead}
      />

      <RevealGroup className="mt-14 grid gap-6 lg:grid-cols-3">
        {PLANES.map((plan) => (
          <RevealItem key={plan.id} className="h-full">
            <PlanCard plan={plan} onElegir={onSimular} />
          </RevealItem>
        ))}
      </RevealGroup>

      <Reveal delay={0.05}>
        <p className="mt-6 text-xs leading-relaxed text-navy/50">
          {PLANES_INTRO.nota}
        </p>
      </Reveal>

      {/* Peso relativo dentro del tope de $3,000 */}
      <Reveal delay={0.05} className="mt-12">
        <div className="card-soft p-7 md:p-9">
          <p className="eyebrow text-navy/45">
            Peso relativo dentro del tope de {money(RONDA.metaTotal)}
          </p>
          <div className="mt-6 space-y-4">
            {PLANES.map((plan) => (
              <BarraPeso key={plan.id} plan={plan} />
            ))}
          </div>
        </div>
      </Reveal>

      {/* Plan Operador */}
      <Reveal delay={0.05} className="mt-8">
        <div className="relative overflow-hidden rounded-2xl bg-navy p-8 md:p-11">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-40 blur-3xl"
            style={{
              background:
                'radial-gradient(circle, rgba(201,162,39,0.5) 0%, transparent 70%)',
            }}
          />
          <div className="relative grid gap-8 md:grid-cols-[1.5fr_1fr] md:items-center md:gap-12">
            <div>
              <p className="eyebrow text-gold">{PLAN_OPERADOR.titulo}</p>
              <h3 className="mt-3 font-display text-2xl text-white md:text-3xl">
                {PLAN_OPERADOR.nombre}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-white/70 md:text-base">
                {PLAN_OPERADOR.body}
              </p>
              <p className="mt-5 rounded-xl border border-white/10 bg-white/[0.04] p-4 text-xs leading-relaxed text-white/55">
                {PLAN_OPERADOR.nota}
              </p>
            </div>

            <div className="rounded-2xl border border-gold/25 bg-white/[0.05] p-7 text-center">
              <p className="tnum font-display text-4xl text-white">
                {money(PLAN_OPERADOR.monto)}
              </p>
              <p className="mt-1 text-xs text-white/45">monto · igual al Plan Ancla</p>
              <div className="my-5 h-px bg-white/10" />
              <p className="tnum font-display text-4xl text-gold">
                {PLAN_OPERADOR.unico}%
              </p>
              <p className="mt-1 text-xs text-white/45">
                retorno objetivo, pago único a 6 meses
              </p>
              <button
                type="button"
                onClick={() => onSimular(PLAN_OPERADOR.monto, true)}
                className="mt-6 w-full rounded-full bg-gold px-6 py-3.5 text-sm font-semibold text-navy-deep transition-all hover:brightness-110"
              >
                Simular como operador
              </button>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  )
}

function BarraPeso({ plan }) {
  const pct = (plan.monto / RONDA.metaTotal) * 100

  return (
    <div className="flex items-center gap-4">
      <span className="w-28 shrink-0 text-xs font-medium text-navy/70 sm:w-36 sm:text-sm">
        {plan.nombre.replace('Plan ', '')}
      </span>
      <div className="h-8 flex-1 overflow-hidden rounded-lg bg-ice">
        <div
          className={`flex h-full items-center justify-end px-3 transition-[width] duration-700 ${
            plan.destacado ? 'bg-gold' : 'bg-navy'
          }`}
          style={{ width: `${pct}%` }}
        >
          <span
            className={`tnum text-xs font-semibold ${
              plan.destacado ? 'text-navy-deep' : 'text-white'
            }`}
          >
            {money(plan.monto)}
          </span>
        </div>
      </div>
      <span className="tnum w-12 shrink-0 text-right text-xs text-navy/45">
        {Math.round(pct)}%
      </span>
    </div>
  )
}
