import { PLANES, PLAN_OPERADOR, RONDA } from '../data/content.js'

/**
 * Detecta el plan que corresponde a un monto.
 * Umbrales: $300 → Inicial · $600 → Crecimiento · $1,200+ → Ancla.
 * Por debajo de $300 no hay plan asignado (monto insuficiente).
 */
export function planPorMonto(monto) {
  if (monto < PLANES[0].monto) return null
  let match = PLANES[0]
  for (const plan of PLANES) {
    if (monto >= plan.monto) match = plan
  }
  return match
}

/**
 * Devuelve el plan efectivo considerando el toggle de Plan Operador.
 * El Operador comparte monto y retorno con el Plan Ancla: cambia el rol,
 * no el capital ni el porcentaje.
 */
export function planEfectivo(monto, esOperador) {
  if (esOperador) return PLAN_OPERADOR
  return planPorMonto(monto)
}

/**
 * Retorno objetivo pleno (a 6 meses) del plan según la modalidad de pago.
 * `modalidad`: 'unico' | 'cuotas'
 */
export function tasaPlena(plan, modalidad) {
  if (!plan) return 0
  return modalidad === 'cuotas' ? plan.dosCuotas : plan.unico
}

/**
 * Cálculo central del retorno.
 *
 * El retorno es estrictamente proporcional al tiempo transcurrido:
 *   tasa efectiva = tasa plena del plan × (mes de salida ÷ 6)
 *
 * No hay pagos mensuales: el retorno se liquida en un solo pago, al cierre
 * del ciclo (mes 6) o en el momento del retiro anticipado (mes 3 a 6).
 */
export function calcular({ monto, modalidad, mes, esOperador }) {
  const plan = planEfectivo(monto, esOperador)
  const plena = tasaPlena(plan, modalidad)
  const mesClamp = Math.min(Math.max(mes, RONDA.bloqueoMeses), RONDA.mesesCiclo)
  const tasa = (plena * mesClamp) / RONDA.mesesCiclo
  const retorno = (monto * tasa) / 100

  return {
    plan,
    tasaPlena: plena,
    tasa,
    retorno,
    total: monto + retorno,
    mes: mesClamp,
    esCierre: mesClamp === RONDA.mesesCiclo,
  }
}

/** Serie mes 3 → 6 para el gráfico de evolución del retorno. */
export function serieMensual({ monto, modalidad, esOperador }) {
  const meses = []
  for (let m = RONDA.bloqueoMeses; m <= RONDA.mesesCiclo; m++) {
    const r = calcular({ monto, modalidad, mes: m, esOperador })
    meses.push({ mes: m, tasa: r.tasa, retorno: r.retorno, total: r.total })
  }
  return meses
}

/* ------------------------------ formateo ------------------------------- */

const fmtUSD = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

const fmtUSD2 = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export const money = (n) => fmtUSD.format(Math.round(n))
export const money2 = (n) => fmtUSD2.format(n)

/** 11 → "11%" · 7.333 → "7.3%" */
export function pct(n) {
  const redondo = Math.round(n)
  if (Math.abs(n - redondo) < 0.05) return `${redondo}%`
  return `${n.toFixed(1)}%`
}
