import logoHanei from '../assets/brand/logo_hanei_academy.webp'
import logoEb2 from '../assets/brand/logo_eb2life.webp'
import logoAls from '../assets/brand/logo_als.webp'
import Reveal from './Reveal'

/* Las medidas intrínsecas evitan que la página salte cuando cargan las
   imágenes: el navegador reserva el hueco desde el primer render. */
export const MARCAS = [
  { src: logoHanei, alt: 'HAN’EI Academy', w: 320, h: 339 },
  { src: logoEb2, alt: 'Eb2.life — everything you need', w: 300, h: 300 },
  { src: logoAls, alt: 'ALS — The American Legal Strategy', w: 320, h: 326 },
]

/**
 * Barra de marcas que respaldan el proyecto.
 * Los logos vienen con fondo blanco, así que van siempre sobre una placa
 * clara — nunca directamente sobre el navy.
 *
 * `variant`: 'hero' (banda completa) · 'footer' (chips pequeños).
 */
export default function BrandBar({ variant = 'hero' }) {
  const esFooter = variant === 'footer'

  if (esFooter) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
        {MARCAS.map((m) => (
          <div
            key={m.alt}
            className="flex h-14 w-24 items-center justify-center rounded-xl bg-white/95 px-3 py-2 ring-1 ring-white/15 transition-transform duration-300 hover:-translate-y-0.5 md:h-16 md:w-28"
          >
            <img
              src={m.src}
              alt={m.alt}
              width={m.w}
              height={m.h}
              loading="lazy"
              decoding="async"
              className="max-h-full max-w-full object-contain"
            />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="border-y border-ice-line bg-white py-9">
      <div className="container-page">
        <Reveal>
          <p className="eyebrow text-center text-navy/35">
            Marcas que respaldan este proyecto
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-8 gap-y-7 sm:gap-x-14 md:gap-x-20">
            {MARCAS.map((m) => (
              <img
                key={m.alt}
                src={m.src}
                alt={m.alt}
                width={m.w}
                height={m.h}
                loading="lazy"
                decoding="async"
                /* El escudo de HAN’EI es blanco: la sombra lo separa del fondo claro. */
                className="h-16 w-auto object-contain transition-transform duration-300 hover:scale-105 md:h-[4.75rem]"
                style={{ filter: 'drop-shadow(0 3px 10px rgba(13,23,48,0.22))' }}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </div>
  )
}
