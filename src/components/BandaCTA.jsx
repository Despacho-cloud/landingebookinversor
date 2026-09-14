import Reveal from './Reveal'
import { PARTICIPAR_MODAL } from '../data/content'

/**
 * Banda de llamada a la acción que se intercala entre secciones.
 *
 * La página es larga: quien se convence en la mitad no debería tener que
 * buscar dónde pulsar. Cada banda aparece justo después del argumento que la
 * justifica, con un texto distinto acorde a ese momento.
 *
 * `tone` debe coincidir con el fondo de la sección que la precede para que la
 * banda se lea como parte de ella y no como un anuncio pegado.
 */
export default function BandaCTA({ texto, nota, onParticipar, tone = 'light' }) {
  const oscuro = tone === 'dark'

  return (
    <Reveal className={oscuro ? 'mt-16' : 'mt-16'}>
      <div
        className={`flex flex-col items-start gap-6 rounded-2xl p-7 md:flex-row md:items-center md:justify-between md:gap-10 md:p-9 ${
          oscuro
            ? 'border border-gold/25 bg-gold/[0.07]'
            : 'border border-ice-line bg-white shadow-[0_1px_2px_rgba(13,23,48,0.04),0_18px_40px_-28px_rgba(13,23,48,0.4)]'
        }`}
      >
        <div className="min-w-0">
          <p
            className={`font-display text-xl leading-snug md:text-2xl ${
              oscuro ? 'text-white' : 'text-navy'
            }`}
          >
            {texto}
          </p>
          {nota && (
            <p
              className={`mt-2 text-sm leading-relaxed ${
                oscuro ? 'text-white/55' : 'text-navy/55'
              }`}
            >
              {nota}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onParticipar}
          className="group inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-full bg-gold px-7 py-4 text-sm font-semibold text-navy-deep transition-all hover:brightness-110 hover:shadow-[0_14px_36px_-12px_rgba(201,162,39,0.9)] active:scale-[0.98] md:w-auto"
        >
          {PARTICIPAR_MODAL.cta}
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </button>
      </div>
    </Reveal>
  )
}
