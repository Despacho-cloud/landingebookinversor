import Section, { SectionHead } from './Section'
import Reveal, { RevealGroup, RevealItem } from './Reveal'
import { REGLAS } from '../data/content'

export default function Timeline() {
  return (
    <Section id="reglas" tone="dark">
      <SectionHead
        tone="dark"
        eyebrow={REGLAS.eyebrow}
        title={REGLAS.title}
        lead={REGLAS.lead}
      />

      {/* Línea de tiempo mes 0 → 6 */}
      <div className="relative mt-16">
        {/* rieles */}
        <div
          aria-hidden
          className="absolute left-[1.05rem] top-2 bottom-2 w-px bg-white/12 md:left-0 md:right-0 md:top-[1.05rem] md:bottom-auto md:h-px md:w-auto"
        />

        <RevealGroup
          stagger={0.12}
          className="grid gap-8 md:grid-cols-4 md:gap-6"
        >
          {REGLAS.hitos.map((h) => (
            <RevealItem key={h.mes}>
              <div className="relative flex gap-5 md:block">
                <span
                  className={`relative z-10 flex h-[2.1rem] w-[2.1rem] shrink-0 items-center justify-center rounded-full ring-4 ring-navy-deep ${
                    h.estado === 'cierre'
                      ? 'bg-gold'
                      : h.estado === 'bloqueo'
                        ? 'bg-white/15'
                        : 'bg-navy-soft'
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      h.estado === 'cierre' ? 'bg-navy-deep' : 'bg-gold'
                    }`}
                  />
                </span>

                <div className="md:mt-6 md:pr-6">
                  <p className="tnum text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-gold">
                    {h.mes}
                  </p>
                  <h3 className="mt-2 text-lg leading-snug text-white">{h.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-white/60">{h.body}</p>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>

      <Reveal delay={0.05} className="mt-10">
        <p className="rounded-xl border-l-2 border-gold bg-white/[0.04] px-5 py-4 text-sm leading-relaxed text-white/65">
          {REGLAS.ejemplo}
        </p>
      </Reveal>

      {/* Modalidades de entrada */}
      <Reveal delay={0.05} className="mt-16">
        <h3 className="font-display text-2xl text-white md:text-[2rem]">
          Modalidades de entrada de capital
        </h3>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/60 md:text-base">
          Para facilitar que más personas puedan participar, la entrada al programa admite
          dos modalidades de pago, con beneficios distintos.
        </p>
      </Reveal>

      <RevealGroup className="mt-8 grid gap-5 md:grid-cols-2">
        {REGLAS.modalidades.map((m) => {
          const esUnico = m.id === 'unico'
          return (
            <RevealItem key={m.id}>
              <article
                className={`h-full rounded-2xl border p-7 transition-all duration-300 hover:-translate-y-1 md:p-8 ${
                  esUnico
                    ? 'border-gold/40 bg-gold/[0.07]'
                    : 'border-white/10 bg-white/[0.03]'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h4 className="font-display text-xl text-white">{m.nombre}</h4>
                  <span
                    className={`rounded-full px-3 py-1 text-[0.6rem] font-bold uppercase tracking-[0.12em] ${
                      esUnico ? 'bg-gold text-navy-deep' : 'bg-white/10 text-white/60'
                    }`}
                  >
                    {m.badge}
                  </span>
                </div>

                <ul className="mt-6 space-y-3">
                  {m.puntos.map((p) => (
                    <li key={p} className="flex items-start gap-3">
                      <span className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-gold" />
                      <span className="text-sm leading-relaxed text-white/65">{p}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </RevealItem>
          )
        })}
      </RevealGroup>

      <Reveal delay={0.05}>
        <p className="mt-6 text-xs leading-relaxed text-white/45">
          {REGLAS.notaCuotas}
        </p>
      </Reveal>
    </Section>
  )
}
