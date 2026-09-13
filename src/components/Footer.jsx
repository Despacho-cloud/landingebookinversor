import BrandBar from './BrandBar'
import Reveal from './Reveal'
import {
  CONTACTOS,
  DISCLAIMER,
  EMAIL_CONTACTO,
  NAV,
  RONDA,
  mailLink,
  waLink,
} from '../data/content'
import { money } from '../lib/finance'

export default function Footer() {
  const irA = (id) => (e) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <footer className="bg-navy-deep pb-10 pt-16 text-white md:pt-20">
      <div className="container-page">
        <Reveal>
          <div className="text-center">
            <p className="font-display text-2xl md:text-3xl">Proyecto Starter Kits</p>
            <p className="mt-2 text-sm text-white/50">HAN’EI Academy / MyEB2.life</p>
            <p className="tnum mt-5 text-xs text-gold md:text-sm">
              Arranque {money(RONDA.arranque)} · Meta total {money(RONDA.metaTotal)} ·
              Ciclo {RONDA.mesesCiclo} meses · Retorno objetivo {RONDA.retornoMin}–
              {RONDA.retornoMax}%
            </p>
          </div>
        </Reveal>

        <div className="mt-12">
          <BrandBar variant="footer" />
        </div>

        <nav className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 border-t border-white/10 pt-9">
          {NAV.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={irA(item.id)}
              className="text-xs text-white/45 transition-colors hover:text-gold"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs">
          {CONTACTOS.map((c) => {
            const href = waLink(c, { seccion: 'participar' })
            if (!href) return null
            return (
              <a
                key={c.id}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 transition-colors hover:text-gold"
              >
                WhatsApp {c.corto}
              </a>
            )
          })}

          {mailLink() && (
            <a
              href={mailLink({ seccion: 'participar' })}
              className="text-white/60 transition-colors hover:text-gold"
            >
              {EMAIL_CONTACTO}
            </a>
          )}
        </div>

        <p className="mx-auto mt-10 max-w-3xl border-t border-white/10 pt-8 text-center text-[0.7rem] leading-relaxed text-white/35">
          {DISCLAIMER}
        </p>

        <p className="mt-6 text-center text-[0.65rem] text-white/25">
          © {new Date().getFullYear()} HAN’EI USA LLC. Uso privado — documento dirigido a
          inversionistas invitados.
        </p>
      </div>
    </footer>
  )
}
