# Proyecto Starter Kits — Landing de ronda privada de inversión

Landing de una sola página para presentar la ronda privada del **Proyecto Starter Kits**
(HAN'EI Academy / MyEB2.life) a inversionistas invitados.

Todo el contenido y las cifras provienen de `Starter_Kits_Presentacion_Inversionistas.pptx`.

---

## Previsualizar en local

```bash
npm install
```

```bash
npm run dev
```

Abre la URL que imprime la consola (por defecto `http://localhost:5173`).

## Generar el build de producción

```bash
npm run build
```

El sitio queda en `dist/`. Es estático: no necesita backend ni base de datos.

Para revisar el build antes de subirlo:

```bash
npm run preview
```

## Verificar que las cifras siguen cuadrando

Hay un script que compara la lógica de la calculadora contra los números exactos
de la presentación (incluidos los ejemplos de retiro anticipado del mes 4):

```bash
npm run check
```

Conviene correrlo cada vez que se toque un monto o un porcentaje en
`src/data/content.js`.

---

## Desplegar

`vite.config.js` usa `base: './'`, así que el build funciona tanto en la raíz de un
dominio como dentro de un subdirectorio.

**Netlify / Vercel (lo más simple)** — arrastra la carpeta `dist/` a
[app.netlify.com/drop](https://app.netlify.com/drop), o conecta el repositorio con:

- Build command: `npm run build`
- Publish directory: `dist`

**Hosting propio / cPanel** — sube el contenido de `dist/` a la carpeta pública
(`public_html`, `www`, o la subcarpeta que corresponda).

**GitHub Pages** — sube `dist/` a la rama `gh-pages`.

> El `index.html` lleva `<meta name="robots" content="noindex, nofollow">` porque es un
> documento privado dirigido a inversionistas invitados. Si en algún momento quieres que
> el sitio se indexe en buscadores, elimina esa línea.

---

## Qué editar y dónde

### ⚠️ Datos de contacto — lo primero que hay que completar

Están todos juntos al inicio de `src/data/content.js`. Hay **tres** valores pendientes:

```js
export const CONTACTOS = [
  { id: 'benjamin', ..., whatsapp: 'REEMPLAZAR_WHATSAPP_BENJAMIN' },
  { id: 'isaac',    ..., whatsapp: 'REEMPLAZAR_WHATSAPP_ISAAC' },
]

export const EMAIL_CONTACTO = 'REEMPLAZAR_CORREO'
```

**Formato del WhatsApp:** internacional, solo dígitos, sin `+`, sin espacios y sin
guiones.

| Número real | Se escribe |
|---|---|
| Ecuador `099 123 4567` | `'593991234567'` (593 + número sin el 0 inicial) |
| EE. UU. `(305) 555-1234` | `'13055551234'` |

Mientras un valor siga diciendo `REEMPLAZAR…`, el sitio **no genera el enlace**: el
botón aparece desactivado con la nota «Número pendiente de configurar». Así nadie
termina en un chat inexistente. En cuanto pones el número real, todos los botones se
activan solos — no hay que tocar nada más.

De estos tres valores salen: el botón flotante, los botones del CTA final y los
enlaces del footer.

### Mensajes de WhatsApp: se arman solos

El texto que llega precargado **cambia según lo que el visitante esté viendo**, y si ya
tocó la calculadora, viaja con su simulación escrita:

```
Hola Benjamín, vengo de la presentación del Proyecto Starter Kits.

Esto fue lo que simulé en la calculadora:
• Monto: $1,200
• Plan: Plan Ancla
• Modalidad: Pago único
• Salida: mes 6
• Retorno objetivo: 14% ($168.00)
• Total a recibir: $1,368.00

Quiero conversar sobre cómo entrar a la ronda con estas condiciones.
```

Si todavía no simuló nada, el mensaje toma el ángulo de la sección donde está (planes,
riesgo, reglas…). Esos textos se editan en `ANGULO_POR_SECCION`, en el mismo archivo.

### Textos y cifras

Todo el contenido vive en `src/data/content.js`, separado por sección
(`HERO`, `OPORTUNIDAD`, `MODELO`, `PLANES`, `REGLAS`, `RIESGO`, …). No hay textos
sueltos dentro de los componentes, así que se puede reescribir cualquier sección sin
tocar el código de la interfaz.

Si cambias un monto o un porcentaje, corre `npm run check`.

### Imágenes de marca

`src/assets/brand/`:

| Archivo | Uso |
|---|---|
| `logo_hanei_academy.webp` | Barra de marcas y footer |
| `logo_eb2life.webp` | Barra de marcas y footer |
| `logo_als.webp` | Barra de marcas y footer |
| `foto_benjamin.webp` | Sección «Quién está detrás» |
| `firma_benjamin.webp` | Firma al cierre de esa misma sección |

Para reemplazar una imagen, sobrescribe el archivo manteniendo el nombre.

> **Nota:** la foto de Benjamín disponible es de 320×320 px y se muestra a ese tamaño
> para que no se vea pixelada. Si consigues una versión de mayor resolución, sustituye
> el archivo y sube el `max-w-[320px]` en `src/components/Founder.jsx`.

---

## Estructura del código

```
src/
  data/content.js        Todo el texto y las cifras (fuente única de verdad)
  lib/finance.js         Detección de plan, cálculo de retorno y formateo
  hooks/
    useCountUp.js        Animación de conteo de los números
    useActiveSection.js  Sección activa de la navegación sticky
  components/
    Nav.jsx              Navegación fija + menú móvil + barra de progreso
    Hero.jsx             Portada, chips de datos clave, fondo animado
    Bienvenida.jsx       Saludo según la hora + frases con efecto de tecleo
    WhatsAppWidget.jsx   Botón flotante con los dos contactos
    WhatsAppIcon.jsx     Glifo de WhatsApp (SVG inline)
    BrandBar.jsx         Barra de logos (variantes hero y footer)
    Section.jsx          Envoltorio de sección y encabezado estándar
    Reveal.jsx           Scroll-reveal (individual y escalonado)
    Opportunity.jsx      La oportunidad / qué es Starter Kits
    HowItWorks.jsx       De dónde sale el retorno + plan de capital + operación
    Plans.jsx            Planes de inversión + Plan Operador
    PlanCard.jsx         Tarjeta individual de plan
    Calculator.jsx       Calculadora de retorno en tiempo real
    WhyRealistic.jsx     Comparación con el mercado + callout de riesgo
    Timeline.jsx         Reglas de entrada y salida + modalidades de pago
    WinWin.jsx           Modelo gana-gana
    Founder.jsx          Quién está detrás (foto + firma)
    RiskSection.jsx      Riesgo y protocolos de control
    CTA.jsx              Cómo participar + contacto
    Footer.jsx           Logos, navegación y disclaimer legal
scripts/
  check-finance.mjs      Verifica la calculadora contra las cifras del PPTX
```

## Cómo funciona la calculadora

- El plan se detecta por el monto: `$300 → Inicial`, `$600 → Crecimiento`,
  `$1,200+ → Ancla`. El toggle de operador aplica las condiciones del Plan Ancla y
  sube el mínimo del control a $1,200.
- El pago en 2 cuotas usa el retorno reducido de cada plan (≈92% del pago único).
- El retorno es proporcional al tiempo: `retorno objetivo × mes de salida ÷ 6`.
  El mes de salida no puede bajar de 3 (bloqueo mínimo).
- El estado vive en `App.jsx`, para que los botones «Simular este plan» de la sección
  de planes puedan precargar un monto y llevar al usuario a la calculadora.

## Stack

React 18 + Vite 6 + Tailwind CSS 4 + Framer Motion. Sin backend, sin dependencias
pesadas de gráficos: el gráfico de evolución del retorno está hecho con CSS y
Framer Motion.
