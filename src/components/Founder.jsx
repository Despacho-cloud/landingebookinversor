import Section from './Section'
import Reveal from './Reveal'
import { RESPALDO } from '../data/content'
import foto from '../assets/brand/foto_benjamin.webp'
import firma from '../assets/brand/firma_benjamin.webp'
import logoHanei from '../assets/brand/logo_hanei_academy.webp'
import logoEb2 from '../assets/brand/logo_eb2life.webp'
import logoAls from '../assets/brand/logo_als.webp'

const SELLOS = [
  { src: logoHanei, alt: 'HAN’EI Academy', w: 320, h: 339 },
  { src: logoEb2, alt: 'Eb2.life', w: 300, h: 300 },
  { src: logoAls, alt: 'ALS — The American Legal Strategy', w: 320, h: 326 },
]

export default function Founder() {
  return (
    <Section id="respaldo" tone="white">
      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        {/* Foto + sellos */}
        <Reveal>
          <div className="relative mx-auto w-full max-w-[320px] lg:mx-0">
            {/* El original es de 320 px: se muestra a tamaño nativo para no
                perder nitidez. Si más adelante hay una foto de mayor
                resolución, basta con reemplazar el archivo. */}
            <div className="overflow-hidden rounded-2xl bg-navy">
              <img
                src={foto}
                alt="Dr. Benjamín Fiallos J., CEO de HAN’EI USA LLC"
                width={300}
                height={300}
                loading="lazy"
                decoding="async"
                className="aspect-square w-full object-cover object-center"
              />
            </div>

            <div
              aria-hidden
              className="absolute -bottom-4 -right-4 -z-10 h-32 w-32 rounded-2xl bg-gold/20"
            />

            <div className="mt-6 flex items-center justify-center gap-6">
              {SELLOS.map((s) => (
                <img
                  key={s.alt}
                  src={s.src}
                  alt={s.alt}
                  width={s.w}
                  height={s.h}
                  loading="lazy"
                  decoding="async"
                  className="h-12 w-auto object-contain"
                  style={{ filter: 'drop-shadow(0 2px 8px rgba(13,23,48,0.2))' }}
                />
              ))}
            </div>
          </div>
        </Reveal>

        {/* Carta */}
        <Reveal delay={0.1}>
          <div className="flex h-full flex-col">
            <p className="eyebrow text-gold">{RESPALDO.eyebrow}</p>
            <h2 className="mt-3 text-3xl leading-[1.15] text-navy md:text-[2.6rem]">
              {RESPALDO.title}
            </h2>

            <div className="mt-7 space-y-5">
              {RESPALDO.parrafos.map((p) => (
                <p key={p} className="text-sm leading-relaxed text-navy/70 md:text-base">
                  {p}
                </p>
              ))}
            </div>

            <blockquote className="mt-8 border-l-2 border-gold pl-6">
              <p className="font-display text-lg leading-relaxed text-navy md:text-xl">
                «{RESPALDO.compromiso}»
              </p>
            </blockquote>

            {/* Firma — la imagen ya incluye nombre y cargo impresos */}
            <div className="mt-9">
              <img
                src={firma}
                alt={`Firma de ${RESPALDO.nombre} — ${RESPALDO.cargo}`}
                width={900}
                height={531}
                loading="lazy"
                decoding="async"
                className="h-28 w-auto object-contain object-left md:h-32"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
