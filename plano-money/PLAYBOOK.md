# Playbook de lanzamiento — Data Digital

Todo lo armado de cero para el lanzamiento de Plano.Money, en el orden real
en que se ejecuta, para replicar en el próximo producto. Ver también
`CLAUDE.md` para el detalle técnico de cada patrón (archivos, componentes,
props exactos) — esto es el resumen operativo de punta a punta, pensado
para seguir paso a paso sin tener que releer el código.

**Versión con más formato / capturas**: hay una versión navegable de este
mismo documento publicada como Artifact — pedile a Claude que la abra o
la vuelva a mandar si se perdió el link.

## 1. Quiz + página de oferta

- **Motor de quiz genérico** (`QuizEngine.jsx`) sin nada específico del
  producto — todo el contenido (preguntas, perfiles, textos) vive en un
  archivo de datos aparte. Un producto nuevo = un archivo de datos nuevo,
  el motor no cambia.
- **Regla dura**: el quiz nunca vende (sin precio, sin bono, sin
  garantía). Su único CTA final es un link a `/oferta?p=<profile.key>`
  con el diagnóstico ya calculado.
- **Personalización quiz → oferta**: la oferta lee ese `?p=` y cambia
  solo el hero (headline + subtítulo) para hablarle al problema
  diagnosticado. El resto de la página es compartido — nunca forkear en
  páginas por perfil.
- **Estructura fija de la oferta**: barra de confianza → hero → mockup
  grande con capturas reales → CTA → video demo → CTA → beneficios →
  testimonios de una línea → qué incluye → bonos → grilla de confianza →
  garantía → precio final → sellos → footer (solo copyright).
- **Reglas de copy**: sin raya larga (—) nunca; mismo texto de CTA
  repetido en todos los botones; testimonios de una línea; **nunca
  inventar una estadística o prueba social** — si no hay un número real
  detrás, se escribe la expectativa sin cuantificar.

## 2. Checkout en Hotmart

- Mensual y anual son **dos ofertas separadas del mismo producto**, cada
  una con su propio link (`?off=<código>`) y su propia Página de Pago
  Personalizada (order bump/upsell/downsell independientes). Hotmart no
  soporta un selector de plan en un solo checkout.
- **Upsell + downsell, patrón "ofrecer los dos"**: si el segundo producto
  no es una versión más barata del primero, cablear tanto el Sí como el
  No del upsell hacia el downsell — no esconderlo detrás de "solo si dijo
  que no".
- **Limitación real de la UI de Hotmart** (confirmada a mano, más de una
  vez): una vez que un botón Sí/No ya está conectado a algo, no hay forma
  en la UI de reconectarlo a otro destino. Si hace falta una pantalla
  intermedia entre dos etapas, insertarla **antes** de conectarlas la
  primera vez. El soporte de Hotmart dio respuestas genéricas
  contradictorias con esto varias veces — verificar clickeando uno mismo,
  no confiar en la respuesta de soporte.
- **El widget de upsell/downsell no tiene campo de texto persuasivo**:
  solo edita el texto de los dos botones. Toda la persuasión real va en
  una pantalla de transición propia, mostrada justo antes del widget.
- **Bug conocido, no controlable desde el código**: los order bumps se
  agregaron solos en una compra real sin que el comprador los tocara. Es
  el checkout hosteado de Hotmart — solo reportar a soporte con el número
  de transacción.

## 3. Tracking (instalar el mismo día que se arma el checkout)

**Meta Pixel — sitio propio**: script en `<head>` de `index.html`,
`<noscript>` de respaldo al *principio de `<body>`* (nunca en `<head>`).
Helpers en `src/lib/fbPixel.js`: `trackFbEvent` (eventos estándar de
Meta) y `trackFbCustomEvent` (cualquier otro nombre, si no aparece como
"no reconocido"). Eventos clave: `Lead` (al enviar el email del quiz),
`InitiateCheckout` (en cada CTA antes de ir a Hotmart), `QuizStep`
(custom, en cada cambio de pregunta — deja ver en qué pregunta se cae
cada anuncio).

**Meta Pixel — dentro de Hotmart, por producto** (el sitio propio no
cubre checkout/upsell/downsell/order bumps, corren en dominio de
Hotmart):
1. Producto en Hotmart → **Herramientas → Pixels**.
2. Buscar el producto arriba.
3. **Facebook + Instagram** → pegar el mismo Pixel ID del sitio.
4. Tildar: Ventas realizadas, Visitas en Página de Pago, Visitas en
   Página de Producto. Dejar "Todos los métodos de pago" y "Valor de la
   transacción".
5. **Configurar envío vía WEB** (API de Conversión es un respaldo más
   robusto pero no bloquea el lanzamiento).
6. **Repetir para cada producto separado**: principal, upsell, downsell,
   cada order bump — el pixel no se hereda entre productos.

**Microsoft Clarity**: heatmaps gratis sin límite de sesiones. Un script
en `index.html`, Project ID nuevo por producto.

**Google Analytics 4**: una sola cuenta **"Data Digital"** agrupa todos
los productos — cada producto nuevo es una **propiedad** nueva adentro,
nombrada como el producto. Sirve para tráfico que el Pixel no ve
(YouTube, directo, orgánico).

## 4. Post-compra: transición → gracias

`TransicionPage.jsx` con variantes por `?t=`, mostrada justo antes de
cada widget de Hotmart (ahí va la persuasión real que el widget no
permite). Las variantes comparten un hilo narrativo, no son pitches
sueltos. Diseño austero: fondo blanco, logo, barra de progreso, un solo
CTA. `GraciasPage.jsx` universal al final, compartida por las tres ramas
del embudo, con un banner de confirmación que varía según de dónde viene
la persona.

## 5. Contenido y componentes reutilizables

- **`InteractiveEbookReader.jsx`**: lector genérico para contenido largo.
  El ícono y el degradé de color de cada capítulo se derivan por índice
  (paleta cíclica fija) — nunca elegir a mano por capítulo. Portada con
  blobs de color, badges de metadata (capítulos, minutos de lectura),
  índice visual, y cada bloque de contenido con su propio ícono/color.
- **`ContentGate.jsx`**: acceso a contenido vendido suelto sin cuenta —
  pide el mail de compra, valida contra Supabase, guarda token en
  `localStorage`, también acepta `?email=` en la URL para auto-verificar
  desde el link del mail de entrega.
- **`Reto21Dias.jsx`**: referencia para cualquier programa de varios
  días — progreso semanal, racha (actual + mejor), calendario tipo mapa
  de calor, logros bloqueados hasta cumplirse de verdad. Clave: guardar
  `{[día]: 'YYYY-MM-DD'}` (fecha real), no un booleano — un booleano no
  puede responder "cuántos días seguidos".
- **Para ver una página con gate sin comprar de verdad**: cambiar
  temporalmente el primer `return` de `ContentGate.jsx` a
  `if (true) return children`, sacar captura, y **revertir siempre antes
  de commitear** (`git checkout -- src/components/content/ContentGate.jsx`).
  Solo cambiar el `useState` inicial no alcanza — el `useEffect` lo pisa
  de nuevo a "locked".

## 6. Gotchas técnicos ya encontrados una vez

- Vite no builda con `&` sin escapar en una URL dentro de `index.html`
  (ej. la del `noscript` del Pixel) — usar `&amp;`.
- `<noscript><img>` no es válido dentro de `<head>` por spec HTML5,
  rompe el parser de Vite — va al principio de `<body>`.
- La sesión del navegador pisa el link mágico de acceso: si alguien
  entra con `?access_code=...&email=...` pero el navegador ya tiene otra
  sesión abierta, sin chequeo explícito termina viendo la cuenta
  equivocada. Comparar el email de la sesión contra `?email=` de la URL
  antes de renderizar nada.
- No confiar en una respuesta de soporte de Hotmart que describe una
  pantalla que la prueba manual (clickeando uno mismo) no encontró.

## 7. Checklist antes de prender la campaña

- [ ] Quiz conectado a la oferta con personalización por perfil
- [ ] Checkout real (mensual y anual, cada uno su propia oferta Hotmart)
- [ ] Upsell/downsell cableados (offer both, si aplica)
- [ ] Pantallas de transición con el pitch real antes de cada widget
- [ ] Página de gracias con próximos pasos claros
- [ ] Meta Pixel en el sitio, probado en "Probar eventos" de Meta
- [ ] Meta Pixel en cada producto de Hotmart (principal, upsell,
      downsell, order bumps)
- [ ] Microsoft Clarity instalado
- [ ] GA4 instalado (propiedad nueva en la cuenta Data Digital)
- [ ] Compra real de prueba de punta a punta (mail recibido + acceso)
- [ ] Bugs conocidos de Hotmart reportados a soporte con nº de transacción
