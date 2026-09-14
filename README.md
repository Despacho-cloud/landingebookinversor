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

### ⚠️ Este repositorio es público

`Despacho-cloud/landingebookinversor` está en modo público, así que **cualquiera que dé
con él puede leer todo el código fuente**: los números de WhatsApp de Benjamín e Isaac,
el correo de contacto y todas las condiciones de la ronda. El `noindex` protege al sitio
de los buscadores, pero no al repositorio.

Por eso **la presentación para inversionistas no se versiona aquí**. Si quieres que deje
de ser visible, cambia la visibilidad a privada en *Settings → General → Danger Zone →
Change repository visibility*; Vercel sigue desplegando igual desde un repositorio
privado.

---

## Qué editar y dónde

### Datos de contacto

Están todos juntos al inicio de `src/data/content.js`, en `CONTACTOS` y
`EMAIL_CONTACTO`. De ahí salen el botón flotante, el flujo «Quiero participar», los
botones del CTA final y los enlaces del footer.

**Formato del WhatsApp:** internacional, solo dígitos, sin `+`, sin espacios y sin
guiones.

| Número real | Se escribe |
|---|---|
| Ecuador `+593 99 252 6667` | `'593992526667'` (593 + número sin el 0 inicial) |
| EE. UU. `(305) 555-1234` | `'13055551234'` |

Si algún valor se deja vacío o empezando por `REEMPLAZAR`, el sitio **no genera el
enlace**: el botón queda desactivado con la nota «Número pendiente de configurar», en
vez de llevar a un chat inexistente.

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

### El flujo «Quiero participar»

Es el camino principal de conversión. El botón aparece en la navegación, el hero, el
CTA final y el widget flotante, y abre una sola pantalla donde el interesado:

1. pone su nombre (opcional),
2. elige el monto — atajos por plan, slider y campo numérico,
3. elige la modalidad de pago,
4. ve en vivo el plan detectado, el retorno objetivo y **el total que recibiría al
   cierre del ciclo**,
5. lo manda por WhatsApp a Benjamín o a Isaac, ya escrito:

```
Hola Benjamín, soy Juan Pérez Molina.

Quiero participar en la ronda privada del Proyecto Starter Kits.

Esta es mi participación:
• Monto a invertir: $1,200
• Plan: Plan Ancla
• Modalidad: Pago en 2 cuotas
• Ciclo: 6 meses (hasta el cierre)
• Retorno objetivo: 13% ($156.00)
• Total a recibir al cierre: $1,356.00

¿Cómo seguimos para formalizar?
```

Si ya venía jugando con la calculadora, el flujo arranca con ese monto y esa
modalidad en vez de los valores por defecto.

**Adaptación por dispositivo:** en móvil es una hoja que sube desde abajo, a ancho
completo, con los botones de envío fijos al pie (al alcance del pulgar) y respetando
el área segura del iPhone. Desde tablet en adelante es un diálogo centrado de 512 px.
En los tres casos el contenido hace scroll dentro del diálogo, el fondo queda
bloqueado, se cierra con Escape o tocando fuera, y el tabulador no se escapa.

Los textos del flujo se editan en `PARTICIPAR_MODAL`, y el mensaje en
`mensajeParticipar()`.

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
    ModalParticipar.jsx  Flujo «Quiero participar» (hoja móvil / diálogo desktop)
    BandaCTA.jsx         Banda «Quiero participar» intercalada entre secciones
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

## El Plan Operador

No es un plan más de la tabla: es un **rol**. Quien entra como operador aporta capital
*y* trabajo, y eso se retribuye con **un punto porcentual** por encima del plan de
capital que le tocaría por su monto.

| Monto | Pago único | En 2 cuotas | Plan de capital equivalente |
|---|---|---|---|
| $800 – $1,199 | **13%** | **12%** | Crecimiento (12% / 11%) |
| $1,200 o más | **15%** | **14%** | Ancla (14% / 13%) |

Entrada mínima **$800**: por debajo de ese monto el rol no aplica y la calculadora
vuelve al plan de capital normal.

Además del punto, el operador presenta el proyecto ante las distintas juntas que forman
parte de Starter Kits y participa en las decisiones creativas y comerciales. Es parte de
la operación, no solo un inversionista.

> **Ojo con la coherencia:** el rango que se anuncia en portada (**9%–14%**) sigue
> siendo el de los planes de capital. El 15% del operador **no** entra en ese rango a
> propósito: ese punto extra retribuye el trabajo, no el dinero, y así está redactado en
> el sitio y en el deck. Si algún día se decide anunciar «9%–15%», hay que revisar
> también el equivalente anualizado de la sección «Por qué el retorno es realista».

La presentación para inversionistas ya está alineada con esto: la lámina 8 remite al
rol y **la lámina 9 está dedicada al Plan Operador**, con los dos tramos y los
beneficios. El deck no vive en este repositorio (ver la nota de privacidad más abajo).

La ventaja se muestra además **en concreto**: mientras el rol está desactivado, tanto la
calculadora como el flujo «Quiero participar» calculan cuánto ganaría de más con el
monto que el visitante ya tiene puesto — «Con $1,200 serían 15% en vez de 14% — $12.00
más» — en lugar de dejarlo enunciado. Eso es `ventajaOperador()` en `src/lib/finance.js`.

Todo esto vive en `PLAN_OPERADOR` (`src/data/content.js`) y en `tramoOperador()` /
`planEfectivo()` (`src/lib/finance.js`). Los tramos están cubiertos por `npm run check`.

## Dónde puede pulsar el visitante

El flujo «Quiero participar» se abre desde **ocho** puntos, colocados en los momentos
en que alguien puede decidirse:

| Dónde | Por qué ahí |
|---|---|
| Navegación fija | Siempre visible |
| Hero | Primera impresión |
| Tras los planes | Acaba de comparar |
| Tras la calculadora | Acaba de ver su número — el de más intención |
| Tras el modelo gana-gana | Acaba de entender el trato |
| Tras la sección de riesgo | Leyó la parte incómoda y sigue ahí |
| CTA final | Cierre natural |
| Botón flotante de WhatsApp | Permanente, en cualquier punto del scroll |

Las bandas intermedias son el componente `BandaCTA`, con un texto distinto en cada
ubicación acorde al argumento que acaba de leerse.

## Cómo funciona la calculadora

- El plan se detecta por el monto: `$300 → Inicial`, `$600 → Crecimiento`,
  `$1,200+ → Ancla`. El toggle de operador sube el mínimo del control a $800 y aplica
  los tramos del rol (ver arriba).
- El pago en 2 cuotas usa el retorno reducido de cada plan (≈92% del pago único).
- El retorno es proporcional al tiempo: `retorno objetivo × mes de salida ÷ 6`.
  El mes de salida no puede bajar de 3 (bloqueo mínimo).
- El estado vive en `App.jsx`, para que los botones «Simular este plan» de la sección
  de planes puedan precargar un monto y llevar al usuario a la calculadora.

## Rendimiento — decisiones que no hay que deshacer

El sitio arrancó lento y se corrigió midiendo. Cuatro cosas conviene no revertir:

**1. Las fuentes se auto-alojan.** Estaban en `fonts.googleapis.com`, y esa hoja de
estilos *bloquea el render*: el navegador no pintaba nada hasta resolver DNS, TLS y
descarga de un tercero. El primer pintado tardaba 2.9 s. Ahora viajan con el sitio,
como archivos variables (un woff2 por familia cubre los pesos 400–700). Si alguien
vuelve a pegar el `<link>` de Google Fonts en `index.html`, se pierde la mejora.

**2. El fondo del hero no lleva `filter: blur()`.** Eran tres círculos de ~880 px con
`blur(120px)` animados con `scale`, cada uno con `will-change`. El navegador tenía que
volver a rasterizar tres capas enormes en cada frame — lo más caro de la página en un
teléfono. Un `radial-gradient` ya es suave, así que el desenfoque sobraba.

**3. Nada escribe estado de React en cada evento de scroll.** La barra de progreso se
pinta directo en el DOM dentro de un `requestAnimationFrame`, y `useActiveSection`
compara `scrollY` contra posiciones medidas una vez, en vez de llamar a
`getBoundingClientRect()` por sección en cada frame.

**4. Las imágenes están dimensionadas para su tamaño real de presentación** y llevan
`width`/`height` para que la página no salte al cargarlas.

**5. El HTML trae un arranque pintado.** `index.html` incluye CSS crítico en línea y
un `#arranque` con el azul de la marca. Sin eso, el segundo que tarda el JS en bajar y
montar React es una pantalla en blanco. React sustituye ese arranque al montarse.

**6. Solo el hero se monta en el primer commit de React.** El resto (~25.000 px y unos
sesenta componentes animados) entra un frame después, en `App.jsx`. También por eso el
titular del hero ya no lleva animación de entrada: arrancaba en `opacity: 0` y tardaba
otros 0.75 s en aparecer.

Medido sobre el despliegue real en Vercel:

| | Antes | Después |
|---|---|---|
| Peticiones a terceros | 3 | **0** |
| Primer pintado (contenido) | 1416 ms | **364 ms** |
| Primera visita (HTML+CSS+JS+fuentes) | — | **208 KB** con brotli |
| Imágenes | 375 KB | **147 KB** |
| Scroll de toda la página | 50 fps · 23 frames largos | **60 fps · 2 frames largos** |

## Stack

React 18 + Vite 6 + Tailwind CSS 4 + Framer Motion. Sin backend, sin dependencias
pesadas de gráficos: el gráfico de evolución del retorno está hecho con CSS y
Framer Motion.
