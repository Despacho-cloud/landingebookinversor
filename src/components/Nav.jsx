import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { NAV } from '../data/content'
import { useActiveSection } from '../hooks/useActiveSection'

const IDS = NAV.map((n) => n.id)

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [abierto, setAbierto] = useState(false)
  const activa = useActiveSection(IDS)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Bloquea el scroll del body mientras el menú móvil está abierto.
  useEffect(() => {
    document.body.style.overflow = abierto ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [abierto])

  const irA = (id) => (e) => {
    e.preventDefault()
    setAbierto(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled || abierto
            ? 'border-b border-white/10 bg-navy-deep/95 backdrop-blur-md'
            : 'bg-transparent'
        }`}
      >
        <div className="container-page flex h-16 items-center justify-between gap-4 md:h-[4.5rem]">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault()
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="flex shrink-0 items-baseline gap-2"
          >
            <span className="font-display text-lg tracking-tight text-white md:text-xl">
              Starter Kits
            </span>
            <span className="hidden text-[0.65rem] font-medium uppercase tracking-[0.16em] text-gold sm:inline">
              Ronda privada
            </span>
          </a>

          {/* Navegación desktop */}
          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => {
              const esActiva = activa === item.id
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={irA(item.id)}
                  className={`relative whitespace-nowrap rounded-full px-2.5 py-2 text-[0.8rem] font-medium transition-colors xl:px-3 ${
                    esActiva ? 'text-white' : 'text-white/55 hover:text-white/90'
                  }`}
                >
                  {esActiva && (
                    <motion.span
                      layoutId="nav-activa"
                      className="absolute inset-0 rounded-full bg-white/10 ring-1 ring-gold/30"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">{item.label}</span>
                </a>
              )
            })}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="#planes"
              onClick={irA('planes')}
              className="hidden whitespace-nowrap rounded-full bg-gold px-5 py-2.5 text-[0.8rem] font-semibold text-navy-deep transition-all hover:brightness-110 hover:shadow-[0_8px_24px_-8px_rgba(201,162,39,0.8)] sm:block"
            >
              Quiero invertir
            </a>

            <button
              type="button"
              onClick={() => setAbierto((v) => !v)}
              aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={abierto}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-white/80 ring-1 ring-white/15 transition hover:text-white lg:hidden"
            >
              <span className="relative block h-4 w-5">
                <span
                  className={`absolute left-0 block h-[1.5px] w-5 bg-current transition-all duration-300 ${
                    abierto ? 'top-1/2 rotate-45' : 'top-0.5'
                  }`}
                />
                <span
                  className={`absolute left-0 top-1/2 block h-[1.5px] w-5 -translate-y-1/2 bg-current transition-all duration-200 ${
                    abierto ? 'opacity-0' : 'opacity-100'
                  }`}
                />
                <span
                  className={`absolute left-0 block h-[1.5px] w-5 bg-current transition-all duration-300 ${
                    abierto ? 'top-1/2 -rotate-45' : 'bottom-0.5'
                  }`}
                />
              </span>
            </button>
          </div>
        </div>

        {/* Barra de progreso de sección (solo desktop, hilo dorado) */}
        <ProgresoScroll />
      </header>

      {/* Menú móvil */}
      <AnimatePresence>
        {abierto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-16 z-40 bg-navy-deep/98 backdrop-blur-lg lg:hidden"
          >
            <nav className="container-page flex h-full flex-col gap-1 overflow-y-auto py-6">
              {NAV.map((item, i) => (
                <motion.a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={irA(item.id)}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i, duration: 0.3 }}
                  className={`flex items-center justify-between border-b border-white/8 py-4 text-lg transition-colors ${
                    activa === item.id ? 'text-gold' : 'text-white/75'
                  }`}
                >
                  {item.label}
                  <span className="text-xs text-white/25">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </motion.a>
              ))}
              <a
                href="#participar"
                onClick={irA('participar')}
                className="mt-6 rounded-full bg-gold px-6 py-4 text-center font-semibold text-navy-deep"
              >
                Quiero invertir
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function ProgresoScroll() {
  const [progreso, setProgreso] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const alto = document.body.scrollHeight - window.innerHeight
      setProgreso(alto > 0 ? window.scrollY / alto : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div className="absolute inset-x-0 bottom-0 h-px bg-white/5">
      <div
        className="h-full bg-gold transition-[width] duration-150 ease-out"
        style={{ width: `${progreso * 100}%` }}
      />
    </div>
  )
}
