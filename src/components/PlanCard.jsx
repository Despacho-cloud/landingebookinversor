import { money } from '../lib/finance'

/**
 * Tarjeta comparativa de un plan de inversión.
 * `onElegir` lleva al usuario a la calculadora con ese monto precargado.
 */
export default function PlanCard({ plan, onElegir }) {
  const destacado = plan.destacado

  return (
    <article
      className={`group relative flex h-full flex-col rounded-2xl border p-7 transition-all duration-300 hover:-translate-y-1.5 md:p-8 ${
        destacado
          ? 'border-gold/50 bg-white shadow-[0_1px_2px_rgba(13,23,48,0.05),0_28px_56px_-28px_rgba(21,35,75,0.5)] hover:border-gold hover:shadow-[0_1px_2px_rgba(13,23,48,0.05),0_36px_64px_-28px_rgba(201,162,39,0.45)]'
          : 'border-ice-line bg-white hover:border-gold/45 hover:shadow-[0_1px_2px_rgba(13,23,48,0.04),0_28px_56px_-28px_rgba(21,35,75,0.4)]'
      }`}
    >
      {destacado && (
        <span className="absolute -top-3 left-7 rounded-full bg-gold px-3 py-1 text-[0.6rem] font-bold uppercase tracking-[0.14em] text-navy-deep">
          Más equilibrado
        </span>
      )}

      <h3 className="text-xl text-navy md:text-2xl">{plan.nombre}</h3>

      <div className="mt-5 flex items-baseline gap-2">
        <span className="tnum font-display text-4xl text-navy md:text-[2.75rem]">
          {money(plan.monto)}
        </span>
        <span className="text-xs text-navy/45">monto mínimo</span>
      </div>

      <div className="mt-6 rounded-xl bg-ice p-4">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-navy/45">
          Retorno objetivo a 6 meses
        </p>
        <div className="mt-2.5 flex items-end justify-between gap-3">
          <div>
            <p className="tnum font-display text-3xl leading-none text-gold">
              {plan.unico}%
            </p>
            <p className="mt-1.5 text-[0.7rem] text-navy/50">Pago único</p>
          </div>
          <div className="h-8 w-px bg-ice-line" />
          <div className="text-right">
            <p className="tnum font-display text-2xl leading-none text-navy/70">
              ≈{plan.dosCuotas}%
            </p>
            <p className="mt-1.5 text-[0.7rem] text-navy/50">En 2 cuotas</p>
          </div>
        </div>
      </div>

      <p className="mt-6 text-sm font-medium leading-snug text-navy/80">{plan.perfil}</p>
      <p className="mt-2.5 flex-1 text-sm leading-relaxed text-navy/55">{plan.para}</p>

      <button
        type="button"
        onClick={() => onElegir(plan.monto)}
        className={`mt-7 w-full rounded-full px-6 py-3.5 text-sm font-semibold transition-all ${
          destacado
            ? 'bg-gold text-navy-deep hover:brightness-110 hover:shadow-[0_12px_32px_-12px_rgba(201,162,39,0.9)]'
            : 'bg-navy text-white hover:bg-navy-deep'
        }`}
      >
        Simular este plan
      </button>
    </article>
  )
}
