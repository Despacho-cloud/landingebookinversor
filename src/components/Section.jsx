import Reveal from './Reveal'

/**
 * Envoltorio de sección con dos temas: 'light' (hielo/blanco) y 'dark' (navy).
 * Unifica el espaciado vertical y el ancho de columna en todo el sitio.
 */
export default function Section({
  id,
  tone = 'light',
  className = '',
  children,
  bleed = false,
}) {
  const tones = {
    light: 'bg-ice text-navy',
    white: 'bg-white text-navy',
    dark: 'bg-navy-deep text-white',
    navy: 'bg-navy text-white',
  }

  return (
    <section
      id={id}
      className={`relative scroll-mt-24 py-20 md:py-28 ${tones[tone]} ${className}`}
    >
      <div className={bleed ? '' : 'container-page'}>{children}</div>
    </section>
  )
}

/** Encabezado estándar: eyebrow + título + bajada. */
export function SectionHead({ eyebrow, title, lead, tone = 'light', align = 'left' }) {
  const dark = tone === 'dark'
  const center = align === 'center'

  return (
    <Reveal className={`max-w-3xl ${center ? 'mx-auto text-center' : ''}`}>
      {eyebrow && (
        <p className={`eyebrow ${dark ? 'text-gold' : 'text-gold'}`}>{eyebrow}</p>
      )}
      <h2
        className={`mt-3 text-3xl leading-[1.15] md:text-[2.6rem] ${
          dark ? 'text-white' : 'text-navy'
        }`}
      >
        {title}
      </h2>
      {lead && (
        <p
          className={`mt-5 text-base leading-relaxed md:text-lg ${
            dark ? 'text-white/70' : 'text-navy/70'
          }`}
        >
          {lead}
        </p>
      )}
    </Reveal>
  )
}
