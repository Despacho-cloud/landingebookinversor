import { useCallback, useMemo, useState } from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import BrandBar from './components/BrandBar'
import Opportunity from './components/Opportunity'
import HowItWorks from './components/HowItWorks'
import Plans from './components/Plans'
import Calculator from './components/Calculator'
import WhyRealistic from './components/WhyRealistic'
import Timeline from './components/Timeline'
import WinWin from './components/WinWin'
import Founder from './components/Founder'
import RiskSection from './components/RiskSection'
import CTA from './components/CTA'
import Footer from './components/Footer'
import WhatsAppWidget from './components/WhatsAppWidget'
import ModalParticipar from './components/ModalParticipar'
import { RONDA } from './data/content'
import { calcular, money, money2, pct } from './lib/finance'

export default function App() {
  /* Estado de la calculadora, elevado a App para que las tarjetas de plan
     puedan precargar un monto y para que el botón de WhatsApp pueda enviar
     la simulación dentro del mensaje. */
  const [calc, setCalc] = useState({
    monto: 600, // Plan Crecimiento, el más equilibrado
    modalidad: 'unico',
    mes: RONDA.mesesCiclo,
    esOperador: false,
    /* Se vuelve true en cuanto el visitante toca un control o pide simular
       un plan: solo entonces tiene sentido mandar la simulación por WhatsApp. */
    tocada: false,
  })

  /* Flujo «Quiero participar»: se abre desde la nav, el hero y el CTA final. */
  const [participarAbierto, setParticiparAbierto] = useState(false)
  const abrirParticipar = useCallback(() => setParticiparAbierto(true), [])
  const cerrarParticipar = useCallback(() => setParticiparAbierto(false), [])

  const simular = useCallback((monto, esOperador = false) => {
    setCalc((s) => ({ ...s, monto, esOperador, tocada: true }))
    requestAnimationFrame(() => {
      document
        .getElementById('calculadora')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [])

  /* Resumen legible de la simulación, listo para escribirse en un mensaje. */
  const simulacion = useMemo(() => {
    if (!calc.tocada) return null

    const r = calcular(calc)
    return {
      monto: money(calc.monto),
      plan: r.plan?.nombre ?? 'Sin plan asignado',
      modalidad: calc.modalidad === 'cuotas' ? 'Pago en 2 cuotas' : 'Pago único',
      mes: r.mes,
      tasa: pct(r.tasa),
      retorno: money2(r.retorno),
      total: money2(r.total),
    }
  }, [calc])

  return (
    <>
      <Nav onParticipar={abrirParticipar} />

      <main>
        <Hero onParticipar={abrirParticipar} />
        <BrandBar />
        <Opportunity />
        <HowItWorks />
        <Plans onSimular={simular} />
        <Calculator estado={calc} setEstado={setCalc} />
        <WhyRealistic />
        <Timeline />
        <WinWin />
        <Founder />
        <RiskSection />
        <CTA simulacion={simulacion} onParticipar={abrirParticipar} />
      </main>

      <Footer />

      <WhatsAppWidget simulacion={simulacion} onParticipar={abrirParticipar} />

      <ModalParticipar
        abierto={participarAbierto}
        onCerrar={cerrarParticipar}
        /* Arranca con lo que el visitante ya haya simulado en la calculadora */
        inicial={calc.tocada ? { monto: calc.monto, modalidad: calc.modalidad } : null}
      />
    </>
  )
}
