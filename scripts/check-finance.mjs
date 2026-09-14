/* Verificación offline de la lógica financiera contra las cifras del PPTX. */
import { calcular, pct, money2 } from '../src/lib/finance.js'

const casos = [
  // [monto, modalidad, mes, operador, tasa esperada, fuente]
  [300, 'unico', 6, false, '9%', 'tabla planes'],
  [300, 'cuotas', 6, false, '8%', 'tabla planes (~92%)'],
  [600, 'unico', 6, false, '12%', 'tabla planes'],
  [600, 'cuotas', 6, false, '11%', 'slide 9'],
  [600, 'unico', 4, false, '8%', 'slide 10 — retiro mes 4'],
  [600, 'cuotas', 4, false, '7.3%', 'slide 10 — retiro mes 4, 2 cuotas'],
  [1200, 'unico', 6, false, '14%', 'tabla planes'],
  [1200, 'cuotas', 6, false, '13%', 'tabla planes (~92%)'],
  // Plan Operador: un punto por encima del plan base, desde $800
  [800, 'unico', 6, true, '13%', 'Operador tramo 800–1199'],
  [800, 'cuotas', 6, true, '12%', 'Operador tramo 800–1199, 2 cuotas'],
  [1000, 'unico', 6, true, '13%', 'Operador dentro del primer tramo'],
  [1199, 'unico', 6, true, '13%', 'Operador, tope del primer tramo'],
  [1200, 'unico', 6, true, '15%', 'Operador tramo 1200+'],
  [1200, 'cuotas', 6, true, '14%', 'Operador tramo 1200+, 2 cuotas'],
  [3000, 'unico', 6, true, '15%', 'Operador, tope de la ronda'],
  [1200, 'unico', 4, true, '10%', 'Operador con retiro anticipado (15% × 4/6)'],
  // Por debajo del mínimo del rol, cae al plan de capital normal
  [600, 'unico', 6, true, '12%', 'Operador bajo el mínimo → Crecimiento'],
  [3000, 'unico', 6, false, '14%', 'tope de ronda → Ancla'],
  [900, 'unico', 6, false, '12%', 'umbral: 900 → Crecimiento'],
]

let fallos = 0
for (const [monto, modalidad, mes, esOperador, esperado, fuente] of casos) {
  const r = calcular({ monto, modalidad, mes, esOperador })
  const ok = pct(r.tasa) === esperado
  if (!ok) fallos++
  console.log(
    `${ok ? 'OK ' : 'FAIL'}  $${monto} ${modalidad} mes ${mes}${esOperador ? ' operador' : ''} → ` +
      `${pct(r.tasa)} (esperado ${esperado}) · retorno ${money2(r.retorno)} · total ${money2(r.total)}   [${fuente}]`
  )
}
console.log(fallos === 0 ? '\nTodos los casos coinciden con el PPTX.' : `\n${fallos} fallo(s).`)
process.exit(fallos === 0 ? 0 : 1)
