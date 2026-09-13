import Section, { SectionHead } from './Section'
import Reveal, { RevealGroup, RevealItem } from './Reveal'
import WhatsAppIcon from './WhatsAppIcon'
import {
  CONTACTOS,
  EMAIL_CONTACTO,
  PARTICIPAR,
  PARTICIPAR_MODAL,
  RONDA,
  mailLink,
  waLink,
} from '../data/content'
import { money } from '../lib/finance'

export default function CTA({ simulacion, onParticipar }) {
  return (
    <Section id="participar" tone="light">
      <SectionHead
        eyebrow={PARTICIPAR.eyebrow}
        title={PARTICIPAR.title}
        lead={PARTICIPAR.lead}
      />

      {/* Los 3 pasos */}
      <RevealGroup className="mt-14 grid gap-5 md:grid-cols-3">
        {PARTICIPAR.pasos.map((p) => (
          <RevealItem key={p.n}>
            <article className="card-soft relative h-full p-7 transition-all duration-300 hover:-translate-y-1 md:p-8">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-navy font-display text-lg text-gold">
                {p.n}
              </span>
              <h3 className="mt-5 text-lg text-navy md:text-xl">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-navy/65">{p.body}</p>
            </article>
          </RevealItem>
        ))}
      </RevealGroup>

      {/* Por qué participar */}
      <Reveal delay={0.06} className="mt-14">
        <div className="card-soft p-7 md:p-9">
          <h3 className="font-display text-xl text-navy md:text-2xl">
            ¿Por qué participar?
          </h3>
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {PARTICIPAR.porQue.map((p) => (
              <li key={p} className="flex items-start gap-3">
                <span className="mt-[0.4rem] h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                <span className="text-sm leading-relaxed text-navy/70">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      {/* Bloque de contacto */}
      <Reveal delay={0.06} className="mt-10">
        <div className="relative overflow-hidden rounded-2xl bg-navy-deep p-8 md:p-12">
          <div
            aria-hidden
            className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full opacity-50 blur-3xl"
            style={{
              background:
                'radial-gradient(circle, rgba(201,162,39,0.35) 0%, transparent 70%)',
            }}
          />

          <div className="relative grid gap-9 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-14">
            <div>
              <h3 className="font-display text-2xl leading-tight text-white md:text-[2.25rem]">
                Cupos privados. Conversación directa, sin intermediarios.
              </h3>
              <p className="mt-5 text-sm leading-relaxed text-white/65 md:text-base">
                Escríbenos y te explicamos el programa completo: plan que te conviene,
                modalidad de pago, uso del capital, reportes y reglas de salida. Sin
                compromiso.
              </p>

              <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
                {[
                  { t: money(RONDA.arranque), d: 'Arranque' },
                  { t: money(RONDA.metaTotal), d: 'Meta total' },
                  { t: `${RONDA.mesesCiclo} meses`, d: 'Ciclo' },
                  {
                    t: `${RONDA.retornoMin}–${RONDA.retornoMax}%`,
                    d: 'Retorno objetivo',
                  },
                ].map((x) => (
                  <div key={x.d}>
                    <dt className="tnum font-display text-xl text-gold md:text-2xl">
                      {x.t}
                    </dt>
                    <dd className="mt-1 text-[0.7rem] text-white/45">{x.d}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="rounded-2xl border border-white/12 bg-white/[0.05] p-7 backdrop-blur-sm">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-white/45">
                Contacto directo
              </p>
              <p className="mt-2 text-xs leading-relaxed text-white/50">
                Arma tu participación o escribe directo. Los dos llevan la ronda.
              </p>

              <button
                type="button"
                onClick={onParticipar}
                className="group mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gold px-5 py-4 text-sm font-semibold text-navy-deep transition-all hover:brightness-110 hover:shadow-[0_14px_36px_-12px_rgba(201,162,39,0.9)]"
              >
                {PARTICIPAR_MODAL.cta}
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </button>

              <p className="mt-5 flex items-center gap-3 text-[0.7rem] uppercase tracking-[0.14em] text-white/30">
                <span className="h-px flex-1 bg-white/12" />
                o escribe directo
                <span className="h-px flex-1 bg-white/12" />
              </p>

              <div className="mt-5 space-y-3">
                {CONTACTOS.map((c) => (
                  <BotonWhatsApp key={c.id} contacto={c} simulacion={simulacion} />
                ))}

                <BotonCorreo simulacion={simulacion} />
              </div>

              {simulacion && (
                <p className="mt-5 flex items-start gap-2 rounded-lg bg-gold/10 px-3 py-2.5 text-[0.7rem] leading-relaxed text-gold">
                  <span aria-hidden>✓</span>
                  Tu simulación ({simulacion.monto} · {simulacion.plan} · {simulacion.tasa}
                  ) va escrita dentro del mensaje.
                </p>
              )}

              <p className="mt-5 text-center text-[0.7rem] leading-relaxed text-white/35">
                Confirmar interés no genera ninguna obligación. Los valores definitivos se
                formalizan en contrato privado.
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  )
}

/* --------------------------- botones de contacto --------------------------- */

function BotonWhatsApp({ contacto, simulacion }) {
  const href = waLink(contacto, { seccion: 'participar', simulacion })

  /* Secundarios frente al botón dorado de «Quiero participar»: el color de
     WhatsApp vive solo en el icono. */
  const interior = (
    <>
      <WhatsAppIcon className="h-5 w-5 shrink-0 text-[#25D366]" />
      <span className="flex-1 text-left">
        <span className="block">Escribir a {contacto.corto}</span>
        <span className="mt-0.5 block text-[0.65rem] font-normal text-white/45">
          {href ? contacto.rol : 'Número pendiente de configurar'}
        </span>
      </span>
      {href && (
        <span className="shrink-0 text-white/30 transition-all duration-300 group-hover:translate-x-1 group-hover:text-gold">
          →
        </span>
      )}
    </>
  )

  const base =
    'group flex w-full items-center gap-3 rounded-2xl px-5 py-3.5 text-sm font-semibold transition-all'

  if (!href) {
    return (
      <div
        className={`${base} cursor-not-allowed bg-white/[0.06] text-white/45 ring-1 ring-white/10`}
        title="Número pendiente de configurar"
      >
        {interior}
      </div>
    )
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} text-white ring-1 ring-white/15 hover:bg-white/5 hover:ring-white/35`}
    >
      {interior}
    </a>
  )
}

function BotonCorreo({ simulacion }) {
  const href = mailLink({ seccion: 'participar', simulacion })
  const base =
    'flex w-full flex-wrap items-center justify-center gap-x-2 rounded-2xl px-5 py-3.5 text-sm font-semibold transition-all'

  if (!href) {
    return (
      <div
        className={`${base} cursor-not-allowed text-white/35 ring-1 ring-white/10`}
        title="Correo pendiente de configurar"
      >
        Correo pendiente de configurar
      </div>
    )
  }

  return (
    <a
      href={href}
      className={`${base} text-white ring-1 ring-white/20 hover:bg-white/5 hover:ring-white/40`}
    >
      Enviar un correo
      <span className="text-[0.65rem] font-normal text-white/45">
        {EMAIL_CONTACTO}
      </span>
    </a>
  )
}
