import Section, { SectionHead } from './Section'
import Reveal, { RevealGroup, RevealItem } from './Reveal'
import { RIESGO } from '../data/content'

export default function RiskSection() {
  return (
    <Section id="riesgo" tone="dark">
      <SectionHead tone="dark" eyebrow={RIESGO.eyebrow} title={RIESGO.title} />

      <Reveal delay={0.06} className="mt-8">
        <div className="max-w-3xl rounded-2xl border-2 border-gold/35 bg-gold/[0.08] p-7 md:p-8">
          <p className="text-sm leading-relaxed text-white/85 md:text-base">
            {RIESGO.lead}
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.06} className="mt-14">
        <h3 className="font-display text-2xl text-white md:text-[2rem]">
          Cómo se mitiga: protocolos de control
        </h3>
      </Reveal>

      <RevealGroup className="mt-8 grid gap-px overflow-hidden rounded-2xl bg-white/10 md:grid-cols-2 lg:grid-cols-3">
        {RIESGO.protocolos.map((p) => (
          <RevealItem key={p.title}>
            <article className="group h-full bg-navy-deep p-7 transition-colors duration-300 hover:bg-navy">
              <div className="h-px w-8 bg-gold transition-all duration-300 group-hover:w-16" />
              <h4 className="mt-5 text-base text-white md:text-lg">{p.title}</h4>
              <p className="mt-3 text-sm leading-relaxed text-white/60">{p.body}</p>
            </article>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  )
}
