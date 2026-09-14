import Section, { SectionHead } from './Section'
import Reveal from './Reveal'
import BandaCTA from './BandaCTA'
import { GANA_GANA } from '../data/content'

export default function WinWin({ onParticipar }) {
  return (
    <Section id="gana-gana" tone="light">
      <SectionHead
        eyebrow={GANA_GANA.eyebrow}
        title={GANA_GANA.title}
        lead={GANA_GANA.lead}
      />

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        <Columna data={GANA_GANA.marca} tono="navy" />
        <Columna data={GANA_GANA.inversionista} tono="gold" delay={0.1} />
      </div>

      <Reveal delay={0.1} className="mt-8">
        <p className="rounded-2xl bg-navy px-7 py-6 text-center font-display text-lg tracking-wide text-gold md:text-2xl">
          {GANA_GANA.claim}
        </p>
      </Reveal>

      <BandaCTA
        onParticipar={onParticipar}
        texto="Si el modelo te encaja, el siguiente paso es simple."
        nota="Eliges monto y modalidad, y nos escribes. Sin compromiso."
      />
    </Section>
  )
}

function Columna({ data, tono, delay = 0 }) {
  const esGold = tono === 'gold'

  return (
    <Reveal delay={delay}>
      <div
        className={`h-full rounded-2xl border p-7 transition-all duration-300 hover:-translate-y-1 md:p-9 ${
          esGold
            ? 'border-gold/40 bg-gold/[0.08] hover:shadow-[0_28px_56px_-28px_rgba(201,162,39,0.5)]'
            : 'border-ice-line bg-white hover:shadow-[0_28px_56px_-28px_rgba(21,35,75,0.4)]'
        }`}
      >
        <h3 className="text-xl text-navy md:text-2xl">{data.title}</h3>
        <ul className="mt-7 space-y-5">
          {data.puntos.map((p) => (
            <li key={p} className="flex items-start gap-3.5">
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[0.6rem] font-bold ${
                  esGold ? 'bg-gold text-navy-deep' : 'bg-navy text-white'
                }`}
              >
                ✓
              </span>
              <span className="text-sm leading-relaxed text-navy/70">{p}</span>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  )
}
