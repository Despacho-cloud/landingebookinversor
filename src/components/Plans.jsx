import Section, { SectionHead } from './Section'
import Reveal, { RevealGroup, RevealItem } from './Reveal'
import PlanCard from './PlanCard'
import BandaCTA from './BandaCTA'
import { PLANES, PLANES_INTRO, PLAN_OPERADOR, RONDA } from '../data/content'
import { money } from '../lib/finance'

export default function Plans({ onSimular, onParticipar }) {
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
          <div className="relative">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <p className="eyebrow text-gold">{PLAN_OPERADOR.titulo}</p>
              <span className="rounded-full bg-gold px-3 py-1 text-[0.6rem] font-bold uppercase tracking-[0.14em] text-navy-deep">
                Un punto más de retorno
              </span>
            </div>

            <h3 className="mt-3 font-display text-2xl text-white md:text-3xl">
              {PLAN_OPERADOR.nombre}
            </h3>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/70 md:text-base">
              {PLAN_OPERADOR.body}
            </p>

            {/* Los dos tramos */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {PLAN_OPERADOR.tramos.map((t) => (
                <div
                  key={t.desde}
                  className="rounded-2xl border border-gold/25 bg-white/[0.05] p-6"
                >
                  <p className="tnum text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-white/45">
                    {t.hasta
                      ? `De ${money(t.desde)} a ${money(t.hasta)}`
                      : `Desde ${money(t.desde)}`}
                  </p>

                  <div className="mt-4 flex items-end justify-between gap-3">
                    <div>
                      <p className="tnum font-display text-4xl leading-none text-gold">
                        {t.unico}%
                      </p>
                      <p className="mt-1.5 text-[0.7rem] text-white/45">Pago único</p>
                    </div>
                    <div className="h-9 w-px bg-white/10" />
                    <div className="text-right">
                      <p className="tnum font-display text-2xl leading-none text-white/75">
                        {t.dosCuotas}%
                      </p>
                      <p className="mt-1.5 text-[0.7rem] text-white/45">En 2 cuotas</p>
                    </div>
                  </div>

                  <p className="mt-4 border-t border-white/10 pt-3 text-[0.7rem] text-white/40">
                    Un punto sobre el {t.base}
                  </p>

                  <button
                    type="button"
                    onClick={() => onSimular(t.desde, true)}
                    className="mt-5 w-full rounded-full bg-gold px-5 py-3 text-sm font-semibold text-navy-deep transition-all hover:brightness-110"
                  >
                    Simular este tramo
                  </button>
                </div>
              ))}
            </div>

            {/* Qué gana el operador además del porcentaje */}
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {PLAN_OPERADOR.beneficios.map((b) => (
                <div key={b.title} className="border-t border-white/12 pt-4">
                  <h4 className="text-sm font-semibold text-white">{b.title}</h4>
                  <p className="mt-2 text-xs leading-relaxed text-white/55">{b.body}</p>
                </div>
              ))}
            </div>

            <p className="mt-8 rounded-xl border border-white/10 bg-white/[0.04] p-4 text-xs leading-relaxed text-white/55">
              {PLAN_OPERADOR.nota}
            </p>
          </div>
        </div>
      </Reveal>

      <BandaCTA
        onParticipar={onParticipar}
        texto="¿Ya sabes con cuál entras?"
        nota="Arma tu participación en un minuto y mándala por WhatsApp."
      />
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
