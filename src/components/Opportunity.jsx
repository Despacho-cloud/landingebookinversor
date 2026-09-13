import Section, { SectionHead } from './Section'
import Reveal, { RevealGroup, RevealItem } from './Reveal'
import { OPORTUNIDAD } from '../data/content'

export default function Opportunity() {
  return (
    <Section id="oportunidad" tone="light">
      <SectionHead
        eyebrow={OPORTUNIDAD.eyebrow}
        title={OPORTUNIDAD.title}
        lead={OPORTUNIDAD.lead}
      />

      <RevealGroup className="mt-14 grid gap-5 md:grid-cols-3">
        {OPORTUNIDAD.cards.map((c, i) => (
          <RevealItem key={c.title}>
            <article className="card-soft group h-full p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_1px_2px_rgba(13,23,48,0.04),0_24px_48px_-24px_rgba(13,23,48,0.45)]">
              <span className="tnum font-display text-sm text-gold">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-3 text-xl text-navy">{c.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-navy/65">{c.body}</p>
              <div className="mt-6 h-px w-10 bg-gold/40 transition-all duration-300 group-hover:w-20" />
            </article>
          </RevealItem>
        ))}
      </RevealGroup>

      <Reveal delay={0.1} className="mt-14">
        <div className="overflow-hidden rounded-2xl bg-navy p-8 md:p-12">
          <div className="grid items-start gap-8 md:grid-cols-[1fr_1.35fr] md:gap-12">
            <h3 className="font-display text-2xl leading-tight text-white md:text-3xl">
              {OPORTUNIDAD.claim}
            </h3>
            <p className="text-sm leading-relaxed text-white/65 md:text-base">
              {OPORTUNIDAD.claimBody}
            </p>
          </div>
        </div>
      </Reveal>
    </Section>
  )
}
