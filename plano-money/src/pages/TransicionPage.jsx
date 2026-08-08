import Logo from '../components/Logo.jsx'

// Pantallas de "transición" entre pasos del embudo de Hotmart (compra →
// upsell, upsell aceptado → downsell, upsell rechazado → downsell).
//
// El widget de Hotmart que muestra cada oferta (checkoutElements) es
// fijo: solo nombre del producto, precio y el texto de los dos botones
// (comprobado en el editor de la etapa — no hay campo de título ni de
// cuerpo ahí). Eso significa que TODA la persuasión del upsell/downsell
// tiene que pasar por acá, en la pantalla previa, no en el widget en sí
// — por eso el teaser de cada variante es un pitch completo, no una
// frase suelta. Cada una tiene un ángulo distinto a propósito (primera
// oferta / ya dijiste que sí antes / ya dijiste que no antes): repetir
// el mismo texto en las tres se siente a hueco.
//
// Sigue sin haber ninguna cifra de "X% de la gente también agrega esto"
// — no tenemos ese dato, así que el texto convence por contenido
// concreto del producto, no por presión social inventada.
//
// Las tres comparten un hilo narrativo (la "luz" que Plano.Money prende
// sobre tus gastos, y "el segundo antes de gastar" como el verdadero
// punto de batalla que ni la luz ni el método cubren del todo) en vez de
// ser tres pitches sueltos sin relación entre sí — se leen como
// capítulos seguidos de la misma historia, no como ofertas repetidas.
//
// Sin video todavía — cuando haya uno real para un producto nuevo, va acá
// mismo siguiendo el patrón de DemoVideo en SalesPagePlanoMoney.jsx.
const TRANSITIONS = {
  'post-compra': {
    step: 1,
    totalSteps: 2,
    checkLabel: 'Compra realizada',
    statusLabel: 'Configurando tu acceso...',
    title: '🎉 ¡Excelente decisión!',
    subtitle: 'Acabás de dar el primer paso para ordenar tus finanzas. En unos minutos vas a recibir tu acceso por email.',
    teaserTitle: 'Así arranca el cambio...',
    teaserText: 'Hasta hoy, tu plata se movía en la oscuridad: gastos que aparecían sin que supieras bien cómo. Plano.Money prende la luz, mes a mes. Pero ver no alcanza: alguien tiene que decirte qué hacer con lo que estás viendo. Domina Tu Dinero es ese siguiente paso, el método completo para salir de las deudas, armar tu fondo de emergencia y ahorrar sin privarte de todo, aunque tus ingresos cambien.',
    ctaLabel: 'Continuar →',
    ctaHref: '/upsell-domina-tu-dinero',
  },
  'post-upsell-si': {
    step: 2,
    totalSteps: 3,
    checkLabel: 'Domina Tu Dinero agregado',
    statusLabel: 'Preparando todo...',
    title: '🎉 Perfecto.',
    subtitle: 'Ya quedó agregado a tu compra. No necesitás hacer nada más: se activa automáticamente junto con Plano.Money.',
    teaserTitle: 'Pero hay un momento que ni la luz ni el método cubren...',
    teaserText: 'Es el segundo antes de gastar, cuando el impulso ya ganó y la decisión ya está tomada. Emoción y Dinero es un diario de 30 días para estar ahí, justo en ese momento, y entender qué lo dispara antes de que se repita.',
    ctaLabel: 'Continuar →',
    ctaHref: '/downsell-emocion-y-dinero',
  },
  'post-decline': {
    step: 2,
    totalSteps: 2,
    checkLabel: 'Compra realizada',
    statusLabel: 'Buscando la mejor opción para vos...',
    title: 'Sin problema.',
    subtitle: 'Tu compra principal ya quedó confirmada.',
    teaserTitle: 'Capaz el método no era lo que te frenaba.',
    teaserText: 'A veces no es no saber organizar la plata. Es el segundo antes de gastar, cuando el impulso ya ganó. Emoción y Dinero es un diario de 30 días para estar ahí, en ese momento exacto, entender qué lo dispara, y por fin elegir vos, no el impulso.',
    ctaLabel: 'Ver alternativa →',
    ctaHref: '/downsell-emocion-y-dinero',
  },
}

function getTransition() {
  const key = new URLSearchParams(window.location.search).get('t')
  return TRANSITIONS[key] || TRANSITIONS['post-compra']
}

function ProgressBar({ step, total, statusLabel, checkLabel }) {
  const pct = Math.round((step / total) * 100)
  return (
    <div className="space-y-2">
      <p className="text-sm text-emerald-600 font-semibold flex items-center justify-center gap-1.5">
        <span>✓</span>{checkLabel}
      </p>
      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-lila-500 via-accent-600 to-celeste-500 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-slate-400 font-semibold">Paso {step} de {total} · {statusLabel}</p>
    </div>
  )
}

export default function TransicionPage() {
  const t = getTransition()
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <Logo className="w-14 h-14 mx-auto" />
        <ProgressBar step={t.step} total={t.totalSteps} statusLabel={t.statusLabel} checkLabel={t.checkLabel} />
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy-900 leading-tight">{t.title}</h1>
          <p className="text-slate-500 text-base mt-2">{t.subtitle}</p>
        </div>
        {t.teaserTitle && (
          <div className="bg-slate-50 rounded-xl p-4 text-left">
            <p className="text-xs font-bold uppercase text-slate-400 mb-1">{t.teaserTitle}</p>
            <p className="text-sm text-slate-600">{t.teaserText}</p>
          </div>
        )}
        <a
          href={t.ctaHref}
          className="block w-full bg-navy-900 hover:bg-navy-800 text-white font-bold py-4 rounded-full text-base transition"
        >
          {t.ctaLabel}
        </a>
      </div>
    </div>
  )
}
