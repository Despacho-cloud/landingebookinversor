/* ============================================================================
 * CONTENIDO DEL SITIO — fuente única de verdad
 * ----------------------------------------------------------------------------
 * Todas las cifras provienen de la presentación para inversionistas
 * "Starter_Kits_Presentacion_Inversionistas.pptx". No modificar los montos ni
 * los porcentajes sin actualizar también ese documento.
 * ==========================================================================*/

/* ═══════════════════════════════════════════════════════════════════════════
 * ⚙️  DATOS DE CONTACTO — EDITAR AQUÍ (ÚNICO LUGAR DEL SITIO)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * ⚠️  PENDIENTE: los tres valores marcados con «REEMPLAZAR» son marcadores de
 *     posición. Mientras digan eso, el botón flotante muestra un aviso y no
 *     abre WhatsApp, para que nadie caiga en un número inexistente.
 *
 *     · whatsapp → formato internacional, SOLO dígitos, sin +, sin espacios
 *       y sin guiones.  Ecuador: 593 + número sin el 0 inicial.
 *       Ej.: 0991234567  →  '593991234567'
 *       EE. UU.: 1 + número.  Ej.: (305) 555-1234 → '13055551234'
 *     · email → el correo que recibe las solicitudes.
 * ------------------------------------------------------------------------ */

export const CONTACTOS = [
  {
    id: 'benjamin',
    nombre: 'Dr. Benjamín Fiallos J.',
    corto: 'Benjamín',
    rol: 'CEO · HAN’EI USA LLC',
    /* 👇 REEMPLAZAR con el WhatsApp de Benjamín */
    whatsapp: 'REEMPLAZAR_WHATSAPP_BENJAMIN',
    /* Para qué escribirle: define el ángulo del mensaje precargado */
    para: 'Condiciones del acuerdo, uso del capital y reglas de salida.',
    acento: 'gold',
  },
  {
    id: 'isaac',
    nombre: 'Isaac Almeida',
    corto: 'Isaac',
    rol: 'Proyecto Starter Kits',
    /* 👇 REEMPLAZAR con el WhatsApp de Isaac */
    whatsapp: 'REEMPLAZAR_WHATSAPP_ISAAC',
    para: 'Planes, montos y cómo reservar tu cupo en la ronda.',
    acento: 'green',
  },
]

/* 👇 REEMPLAZAR con el correo definitivo */
export const EMAIL_CONTACTO = 'REEMPLAZAR_CORREO'

export const ASUNTO_EMAIL = 'Interés en la ronda privada — Proyecto Starter Kits'

/* Compatibilidad: el primer contacto sigue siendo el contacto principal. */
export const CONTACT = {
  nombre: CONTACTOS[0].nombre,
  cargo: CONTACTOS[0].rol,
  email: EMAIL_CONTACTO,
}

/** Un valor todavía sin completar no debe generar un enlace roto. */
export const esPendiente = (v) => !v || String(v).startsWith('REEMPLAZAR')

/* ---------------------------------------------------------------------------
 * Mensajes precargados de WhatsApp
 *
 * El texto cambia según lo que el visitante esté mirando y según lo que haya
 * simulado en la calculadora: si ya movió los controles, el mensaje llega con
 * su simulación escrita, y la conversación arranca con el número sobre la mesa
 * en vez de un «hola, información».
 * -------------------------------------------------------------------------*/

/* Ángulo del mensaje según la sección visible al momento de escribir. */
const ANGULO_POR_SECCION = {
  oportunidad: 'Me interesa entender mejor el proyecto y por qué existe esta ronda.',
  modelo: 'Quiero entender cómo se usa el capital y de dónde sale el retorno.',
  planes: 'Estaba viendo los planes de inversión y quiero saber cuál me conviene.',
  calculadora: 'Estuve simulando mi participación en la calculadora del sitio.',
  realista: 'Quiero conversar sobre el retorno objetivo y cómo se sostiene.',
  reglas: 'Quiero entender bien las reglas de entrada, salida y las modalidades de pago.',
  'gana-gana': 'Me interesa el modelo y quiero ver si encaja conmigo.',
  respaldo: 'Quiero saber más sobre el equipo y el respaldo detrás del proyecto.',
  riesgo: 'Tengo preguntas sobre el riesgo y los protocolos de control.',
  participar: 'Quiero dar el siguiente paso y conocer los cupos disponibles.',
}

const ANGULO_POR_DEFECTO = 'Quiero información sobre la ronda privada de inversión.'

/**
 * Arma el texto que llega precargado en WhatsApp.
 *
 * @param {object}  opts
 * @param {object}  opts.contacto    uno de CONTACTOS
 * @param {string}  opts.seccion     id de la sección visible
 * @param {object=} opts.simulacion  { monto, plan, modalidad, mes, tasa, retorno, total }
 *                                   solo si el visitante tocó la calculadora
 */
export function mensajeWhatsapp({ contacto, seccion, simulacion } = {}) {
  /* Sin contacto (correo) el saludo va igual de correcto: «Hola, vengo…» */
  const saludo = contacto?.corto ? `Hola ${contacto.corto},` : 'Hola,'
  const lineas = [`${saludo} vengo de la presentación del Proyecto Starter Kits.`]

  if (simulacion) {
    const { monto, plan, modalidad, mes, tasa, retorno, total } = simulacion
    lineas.push(
      '',
      'Esto fue lo que simulé en la calculadora:',
      `• Monto: ${monto}`,
      `• Plan: ${plan}`,
      `• Modalidad: ${modalidad}`,
      `• Salida: mes ${mes}`,
      `• Retorno objetivo: ${tasa} (${retorno})`,
      `• Total a recibir: ${total}`,
      '',
      'Quiero conversar sobre cómo entrar a la ronda con estas condiciones.'
    )
  } else {
    lineas.push('', ANGULO_POR_SECCION[seccion] ?? ANGULO_POR_DEFECTO)
  }

  return lineas.join('\n')
}

/** Enlace de WhatsApp listo para usar. Devuelve null si el número está pendiente. */
export function waLink(contacto, contexto = {}) {
  if (esPendiente(contacto?.whatsapp)) return null
  const texto = mensajeWhatsapp({ contacto, ...contexto })
  return `https://wa.me/${contacto.whatsapp}?text=${encodeURIComponent(texto)}`
}

/** Enlace de correo. Devuelve null si el correo está pendiente. */
export function mailLink(contexto = {}) {
  if (esPendiente(EMAIL_CONTACTO)) return null
  const cuerpo = mensajeWhatsapp({ contacto: null, ...contexto })
  return (
    `mailto:${EMAIL_CONTACTO}` +
    `?subject=${encodeURIComponent(ASUNTO_EMAIL)}` +
    `&body=${encodeURIComponent(cuerpo)}`
  )
}

/* ---------------------------------------------------------------------------
 * Cifras maestras de la ronda
 * -------------------------------------------------------------------------*/
export const RONDA = {
  arranque: 1200,
  metaTotal: 3000,
  adicional: 1800, // 3000 - 1200, recaudado de forma progresiva
  mesesCiclo: 6,
  bloqueoMeses: 3,
  retornoMin: 9,
  retornoMax: 14,
  anualizadoMin: 19,
  anualizadoMax: 30,
  /* El pago en 2 cuotas mantiene ~92% del objetivo de pago único,
     porque el capital queda expuesto en promedio ~92% del ciclo. */
  factorDosCuotas: 0.92,
}

/* ---------------------------------------------------------------------------
 * Navegación
 * -------------------------------------------------------------------------*/
export const NAV = [
  { id: 'oportunidad', label: 'Oportunidad' },
  { id: 'modelo', label: 'Cómo funciona' },
  { id: 'planes', label: 'Planes' },
  { id: 'calculadora', label: 'Calculadora' },
  { id: 'realista', label: 'Retorno' },
  { id: 'reglas', label: 'Reglas' },
  { id: 'respaldo', label: 'Quién está detrás' },
  { id: 'riesgo', label: 'Riesgo' },
  { id: 'participar', label: 'Participar' },
]

/* ---------------------------------------------------------------------------
 * Bienvenida dinámica
 *
 * El saludo cambia según la hora local del visitante y la frase de abajo va
 * rotando: lo primero que ve no es un texto fijo, sino algo que reacciona a él.
 * -------------------------------------------------------------------------*/
export const BIENVENIDA = {
  saludo: (hora) => {
    if (hora < 6) return 'Buenas noches'
    if (hora < 12) return 'Buenos días'
    if (hora < 19) return 'Buenas tardes'
    return 'Buenas noches'
  },
  /* Se muestra junto al saludo, con efecto de tecleo. */
  frases: [
    'esta ronda se abre solo con cupos privados.',
    'el capital entra a una función clara: adquisición de clientes.',
    'la marca ejecuta todo; usted no administra nada.',
    'retorno objetivo limitado, ciclo cerrado y salida definida.',
    'aquí puede simular su participación antes de decidir.',
  ],
  cierre: 'Bienvenido a la presentación del Proyecto Starter Kits.',
}

/* ---------------------------------------------------------------------------
 * Botón flotante de WhatsApp
 * -------------------------------------------------------------------------*/
export const WIDGET = {
  titulo: '¿Conversamos?',
  bajada:
    'Escribe directo a quien lleva la ronda. El mensaje te llega precargado con lo que estás viendo.',
  /* Burbuja que aparece sola a los pocos segundos */
  burbuja: {
    conSimulacion: 'Ya simulaste tu participación. ¿Te la explicamos por WhatsApp?',
    sinSimulacion: '¿Dudas sobre la ronda? Escríbenos directo, sin compromiso.',
  },
  notaSimulacion: 'Tu simulación viaja dentro del mensaje',
  pendiente:
    'El número de WhatsApp aún no está configurado en el sitio. Completa CONTACTOS en src/data/content.js.',
  aria: 'Abrir contacto por WhatsApp',
}

/* ---------------------------------------------------------------------------
 * 1 · Hero
 * -------------------------------------------------------------------------*/
export const HERO = {
  eyebrow: 'Presentación para inversionistas privados',
  title: 'Capital privado para una línea de productos digitales modulares',
  lead: 'La marca opera, produce y ejecuta. El inversionista participa financiando la adquisición de clientes, con un retorno objetivo limitado y sin involucrarse en la operación.',
  chips: [
    { value: 1200, prefix: '$', label: 'Arranque — Ronda 1' },
    { value: 3000, prefix: '$', label: 'Meta total de recaudación' },
    { value: 6, suffix: ' meses', label: 'Duración del ciclo' },
    { value: null, display: '9–14%', label: 'Retorno objetivo, según el plan' },
  ],
  nota: 'Inversión de riesgo controlado, sujeta a protocolos de gestión. Los porcentajes son objetivos, no garantías de rendimiento.',
}

/* ---------------------------------------------------------------------------
 * 2 · La oportunidad
 * -------------------------------------------------------------------------*/
export const OPORTUNIDAD = {
  eyebrow: 'La oportunidad',
  title: 'Convertir conocimiento en productos comprables',
  lead: 'Existe una demanda clara de herramientas prácticas en español para profesionales y abogados que quieren avanzar con mayor orden, claridad y acompañamiento educativo.',
  cards: [
    {
      title: 'Mercado ya educado',
      body: 'El comprador ya entiende que necesita guías, plantillas, checklists y claridad paso a paso; no estamos creando una necesidad desde cero.',
    },
    {
      title: 'Oferta más accionable',
      body: 'No vendemos información suelta. Creamos kits que ayudan a ordenar decisiones, documentación, próximos pasos y recursos de apoyo.',
    },
    {
      title: 'Entrada controlada',
      body: 'Se puede validar producto por producto con pauta pequeña, antes de ampliar presupuesto o construir nuevas líneas.',
    },
  ],
  claim: 'No es «vender ebooks»: es sistematizar conocimiento en productos.',
  claimBody:
    'Starter Kits será una fábrica de productos digitales educativos y operativos. Cada kit resuelve una tarea concreta: entender, organizar, decidir, preparar o avanzar con mayor claridad. Cada lanzamiento se mide como una miniunidad de negocio: interés, compra, entrega, satisfacción y recompra.',
}

/* ---------------------------------------------------------------------------
 * 3 · Cómo funciona / de dónde sale el retorno
 * -------------------------------------------------------------------------*/
export const MODELO = {
  eyebrow: 'Cómo funciona',
  title: 'De dónde sale el retorno',
  lead: 'El capital de esta ronda tiene una función única y verificable: adquisición de clientes. Se destina a pauta publicitaria y producción de contenido para escalar la línea de kits que ya demuestra tracción.',
  pasos: [
    {
      n: '01',
      title: 'El capital entra al fondo de pauta',
      body: 'No se usa para gastos generales ni para pagar sueldos: entra al presupuesto de publicidad y producción creativa del Proyecto Starter Kits.',
    },
    {
      n: '02',
      title: 'Se prueba con pauta pequeña',
      body: 'Cada kit se lanza con un presupuesto controlado y se mide como miniunidad de negocio: costo por adquisición, conversión, reembolsos y recompra.',
    },
    {
      n: '03',
      title: 'Se escala solo lo que funciona',
      body: 'Los productos que demuestran demanda reciben más pauta; los que no funcionan se ajustan o se detienen. El presupuesto se libera por etapas, no de golpe.',
    },
    {
      n: '04',
      title: 'El margen paga el retorno objetivo',
      body: 'El retorno se calcula con el mismo capital de pauta que la ronda va a manejar — un número que la operación puede sostener, no una cifra de marketing.',
    },
  ],
  operacion: {
    title: 'Todo lo que aporta la marca y el equipo',
    claim: 'El inversionista aporta capital. Nosotros ejecutamos todo el sistema.',
    items: [
      'Investigación de mercado y competencia',
      'Selección de temas con demanda real',
      'Diseño de oferta y planes de producto',
      'Producción de guías, clases y recursos',
      'Plantillas, formularios y materiales editables',
      'Revisión experta y control de calidad',
      'Construcción de landing y checkout',
      'Automatización de entrega digital',
      'Campañas de publicidad y retargeting',
      'Creativos, copies y pruebas A/B',
      'Medición de CPA, ROAS y conversión',
      'Soporte inicial y experiencia de cliente',
      'Comunidad y seguimiento educativo',
      'Optimización de productos ganadores',
      'Reportes para inversionistas',
      'Administración operativa del ciclo',
    ],
  },
}

/* ---------------------------------------------------------------------------
 * 4 · Planes de inversión — Ronda 1
 *
 * `unico`     → retorno objetivo con pago único, a 6 meses (%)
 * `dosCuotas` → retorno objetivo pagando en 2 cuotas (% ≈ unico × 0.92)
 * -------------------------------------------------------------------------*/
export const PLANES = [
  {
    id: 'inicial',
    nombre: 'Plan Inicial',
    monto: 300,
    unico: 9,
    dosCuotas: 8,
    perfil: 'Entrada conservadora, primer contacto con el modelo.',
    para: 'Para quien quiere probar el modelo con un ticket bajo antes de comprometer más capital.',
    destacado: false,
  },
  {
    id: 'crecimiento',
    nombre: 'Plan Crecimiento',
    monto: 600,
    unico: 12,
    dosCuotas: 11,
    perfil: 'Participación media dentro de la ronda.',
    para: 'Para quien ya conoce el proyecto y busca el mejor equilibrio entre monto y retorno objetivo.',
    destacado: true,
  },
  {
    id: 'ancla',
    nombre: 'Plan Ancla',
    monto: 1200,
    unico: 14,
    dosCuotas: 13,
    perfil: 'Posición principal; cubre el arranque por sí sola.',
    para: 'Para el inversionista que quiere la posición principal de la ronda y el objetivo más alto.',
    destacado: false,
  },
]

export const PLAN_OPERADOR = {
  id: 'operador',
  nombre: 'Plan Operador',
  monto: 1200,
  unico: 14,
  dosCuotas: 13,
  titulo: '¿Quieres involucrarte más?',
  body: 'Mismo monto y retorno objetivo del Plan Ancla ($1,200 · 14%), para quien además aporta ideas, presencia en video u otro insumo creativo para las campañas.',
  nota: 'La parte de capital y la de colaboración se separan con claridad en el contrato privado, con revisión legal antes de firmar. Su diferencia frente al Plan Ancla es el rol, no el capital.',
}

export const PLANES_INTRO = {
  eyebrow: 'Planes de inversión — Ronda 1',
  title: 'A mayor aporte, mayor retorno objetivo',
  lead: 'Un ticket más grande financia más pauta, más piezas creativas y más pruebas de oferta: por eso se recompensa a quien impulsa más el arranque y el escalado. Los montos se combinan entre distintos inversionistas hasta completar el tope de $3,000.',
  nota: 'El pago en 2 cuotas mantiene la misma jerarquía por plan, a ~92% del objetivo de pago único.',
}

/* ---------------------------------------------------------------------------
 * 5 · Plan de capital (arranque vs. escalado)
 * -------------------------------------------------------------------------*/
export const CAPITAL = {
  eyebrow: 'Plan de capital',
  title: 'Arranque y escalado',
  lead: 'Con $1,200 se activa el proyecto entre varios inversionistas — ningún aporte individual financia el proyecto completo. El resto del capital, hasta $3,000, se sigue recaudando durante los primeros meses del ciclo para escalar la pauta publicitaria de los kits que ya muestran tracción.',
  nota: 'Los $1,200 iniciales son el punto de partida, no el total: el resto se construye con el propio avance del proyecto y con nuevas incorporaciones durante el ciclo.',
}

/* ---------------------------------------------------------------------------
 * 6 · Por qué el retorno es realista
 * -------------------------------------------------------------------------*/
export const REFERENCIAS = [
  { label: 'Ahorro / depósito a plazo', rango: '≈ 4–6%', min: 4, max: 6, tipo: 'base' },
  { label: 'Préstamo puente garantizado', rango: '≈ 9–14%', min: 9, max: 14, tipo: 'base' },
  {
    label: 'Starter Kits — retorno objetivo',
    rango: '≈ 19–30%',
    min: 19,
    max: 30,
    tipo: 'destacado',
  },
  { label: 'Inversionista ángel real (rango típico)', rango: '≈ 20–31%', min: 20, max: 31, tipo: 'base' },
]

export const REALISTA = {
  eyebrow: 'Por qué el retorno es realista',
  title: 'Un retorno objetivo con respaldo real',
  lead: 'El retorno objetivo se fija según cuánto se invierte y se calcula con el mismo capital de pauta que la ronda va a manejar — un número que la operación puede sostener, no una cifra de marketing.',
  callout:
    'Esto no es un depósito bancario a plazo (capital protegido, tasa fija garantizada): Starter Kits es un negocio que recién comienza. El capital no está garantizado y estos porcentajes son objetivos de gestión, no una promesa fija.',
  cierre:
    'El rango objetivo (19%–30% anualizado, según el plan) se mantiene dentro de lo que realmente paga la inversión privada de riesgo similar — por encima de un depósito garantizado, y en línea con lo que gana un inversionista ángel real.',
  notaEscala: 'Todas las cifras del gráfico están expresadas en términos anuales.',
}

/* ---------------------------------------------------------------------------
 * 7 · Reglas de entrada y salida
 * -------------------------------------------------------------------------*/
export const REGLAS = {
  eyebrow: 'Reglas de entrada y salida',
  title: 'Cuándo entra el capital y cuándo sale',
  lead: 'El retorno se paga en un solo pago: al cierre del ciclo (mes 6), o en el momento del retiro si el inversionista se acoge a la salida anticipada proporcional (mes 3 a 6). No hay pagos mensuales de retorno.',
  hitos: [
    {
      mes: 'Mes 0',
      title: 'Entrada de capital',
      body: 'Se firma el acuerdo privado y el capital entra al fondo de pauta del proyecto. Comienza el ciclo de ejecución y reportes.',
      estado: 'inicio',
    },
    {
      mes: 'Mes 3',
      title: 'Fin del bloqueo mínimo',
      body: 'No es posible retirar el capital antes de cumplir 3 meses dentro del ciclo. A partir del mes 3 se abre la opción de salida anticipada.',
      estado: 'bloqueo',
    },
    {
      mes: 'Mes 3 → 6',
      title: 'Retiro anticipado proporcional',
      body: 'Si el inversionista se retira antes de cerrar el ciclo, el retorno es estrictamente proporcional al tiempo transcurrido: retorno objetivo × meses transcurridos ÷ 6.',
      estado: 'proporcional',
    },
    {
      mes: 'Mes 6',
      title: 'Cierre del ciclo',
      body: 'Al completar el ciclo se paga el retorno objetivo pleno según la modalidad de entrada elegida. Después del mes 6 el ciclo se considera cerrado y se liquida según contrato.',
      estado: 'cierre',
    },
  ],
  ejemplo:
    'Ejemplo de proporcionalidad: un aporte en pago único (Plan Crecimiento) que se retira en el mes 4 recibe 8%, no el 12% pleno. El mismo aporte en 2 cuotas recibiría 7.3% si se retira en el mes 4.',
  modalidades: [
    {
      id: 'unico',
      nombre: 'Pago único',
      badge: 'Retorno objetivo máximo',
      puntos: [
        '100% del aporte al confirmar el acuerdo',
        'Retorno objetivo máximo del programa',
        'Prioridad simple de liquidación al cierre',
      ],
    },
    {
      id: 'cuotas',
      nombre: 'Pago en 2 cuotas',
      badge: 'Ticket más accesible',
      puntos: [
        '50% al confirmar + 50% a los 30 días',
        'Beneficio reducido frente al pago único',
        'Pensado para tickets más accesibles',
      ],
    },
  ],
  notaCuotas:
    'Cómo se calcula: con 50% del aporte invertido desde el día 0 y 50% desde el día 30, el capital queda expuesto en promedio ~92% del ciclo completo frente al pago único. El retorno objetivo se ajusta en la misma proporción — por ejemplo, en el Plan Crecimiento: 12% × ~0.92 ≈ 11%.',
}

/* ---------------------------------------------------------------------------
 * 8 · Modelo gana-gana
 * -------------------------------------------------------------------------*/
export const GANA_GANA = {
  eyebrow: 'Modelo gana-gana',
  title: 'Cómo gana cada parte',
  lead: 'No hay cesión de equity ni de propiedad del negocio: es un contrato privado de retorno limitado, con ciclo cerrado y reglas de salida definidas desde el inicio.',
  marca: {
    title: 'Cómo gana la marca',
    puntos: [
      'Capitaliza su operación y construye una cartera propia de productos digitales',
      'Escala únicamente lo que ya demostró tracción real, con capital de terceros',
      'Conserva el remanente del negocio una vez pagado el retorno pactado',
    ],
  },
  inversionista: {
    title: 'Cómo gana el inversionista',
    puntos: [
      'Retorno objetivo pactado (9%–14% según el plan) sin ejecutar ni administrar nada',
      'No asume roles operativos: la marca hace todo el trabajo',
      'Reglas de salida y de pago claras y definidas desde el inicio',
    ],
  },
  claim: 'Retorno limitado · Ciclo cerrado · Sin equity',
}

/* ---------------------------------------------------------------------------
 * 9 · Quién está detrás
 * -------------------------------------------------------------------------*/
export const RESPALDO = {
  eyebrow: 'Quién está detrás del proyecto',
  title: 'Una operación con nombre, cara y firma',
  nombre: 'Dr. Benjamín Fiallos J.',
  cargo: 'CEO · HAN’EI USA LLC',
  parrafos: [
    'El Proyecto Starter Kits se ejecuta desde HAN’EI USA LLC, la misma estructura detrás de HAN’EI Academy y MyEB2.life, con el respaldo editorial de The American Legal Strategy (ALS).',
    'No es un proyecto anónimo ni una plataforma sin responsable: hay una marca en operación, un equipo que produce y una persona que responde por el uso del capital, los reportes y el cumplimiento de las reglas de salida.',
  ],
  compromiso:
    'Me comprometo a destinar el capital de esta ronda exclusivamente a la adquisición de clientes del Proyecto Starter Kits, a entregar reportes periódicos del avance y a respetar las reglas de salida pactadas desde el primer día.',
}

/* ---------------------------------------------------------------------------
 * 10 · Riesgo y protocolos de control
 * -------------------------------------------------------------------------*/
export const RIESGO = {
  eyebrow: 'Riesgo y protocolos de control',
  title: 'Lo que hay que decir con claridad',
  lead: 'Como toda inversión, esta ronda implica riesgo: los porcentajes de retorno son objetivos de gestión, no una garantía. El capital no está garantizado. Por eso operamos bajo protocolos de control establecidos, diseñados para maximizar la probabilidad de alcanzar los valores esperados.',
  protocolos: [
    {
      title: 'Presupuesto por etapas',
      body: 'El capital no se consume de golpe: se libera según señales de mercado, rendimiento de campañas y capacidad operativa.',
    },
    {
      title: 'Métricas de decisión',
      body: 'Se revisa compra, costo por adquisición, retorno publicitario, reembolsos, satisfacción y repetición de compra.',
    },
    {
      title: 'Productos ganadores',
      body: 'Los kits que demuestran demanda reciben más pauta; los que no funcionan se ajustan o se detienen.',
    },
    {
      title: 'Reportes periódicos',
      body: 'El inversionista recibe seguimiento claro del avance del programa, sin involucrarse en decisiones operativas internas.',
    },
    {
      title: 'Cierre definido',
      body: 'Al llegar al retorno máximo o al cierre del ciclo, se liquida la participación según contrato.',
    },
    {
      title: 'Validar antes de escalar',
      body: 'El modelo permite validar con anuncios controlados antes de comprometer mayor presupuesto: validar, optimizar, escalar o retirar lo que no funcione.',
    },
  ],
}

/* ---------------------------------------------------------------------------
 * 11 · Cómo participar
 * -------------------------------------------------------------------------*/
export const PARTICIPAR = {
  eyebrow: 'Siguiente paso',
  title: 'Cómo se activa tu participación',
  lead: 'La ronda se abre con cupos privados y un contrato simple: aporte, duración, retorno objetivo, modalidad de pago, uso del capital y salida.',
  pasos: [
    {
      n: 1,
      title: 'Confirmar interés',
      body: 'Se explica el programa, el plazo, el retorno objetivo por plan (9%–14%) y las modalidades de pago disponibles.',
    },
    {
      n: 2,
      title: 'Formalizar acuerdo',
      body: 'Se firma el documento privado con condiciones claras y sin cesión de propiedad del negocio.',
    },
    {
      n: 3,
      title: 'Activar capital',
      body: 'El capital entra al fondo de pauta del proyecto y comienza el ciclo de ejecución y reportes.',
    },
  ],
  porQue: [
    'El capital se dirige a una función clara: adquisición de clientes.',
    'El equipo ya aporta marca, know-how, producción, operación, tecnología y ejecución comercial.',
    'El inversionista no asume carga operativa ni necesita crear el negocio.',
    'El retorno tiene un límite pactado (9%–14% objetivo, según el plan) y una salida definida.',
    'El proyecto se ejecuta con pruebas controladas, no con gasto impulsivo.',
  ],
}

/* ---------------------------------------------------------------------------
 * Disclaimer legal (footer y pies de sección)
 * -------------------------------------------------------------------------*/
export const DISCLAIMER =
  'Documento de apoyo comercial. Toda inversión implica riesgo; los valores son objetivos de gestión, no una garantía de rendimiento. Operamos bajo protocolos de control definidos. Los valores definitivos se formalizan en contrato privado.'
