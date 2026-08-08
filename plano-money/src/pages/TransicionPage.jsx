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
    teaserTitle: 'Antes de seguir...',
    teaserText: 'Plano.Money te va a mostrar exactamente a dónde va tu plata, mes a mes. Pero ver los números es solo el primer paso. Domina Tu Dinero te da el método completo para usar esa información: cómo salir de las deudas que te vienen pesando, armar un fondo de emergencia real, y ahorrar sin sentir que te estás privando de todo, aunque tus ingresos cambien mes a mes. Es la diferencia entre mirar tus finanzas y finalmente hacer algo con ellas.',
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
    teaserTitle: 'Una cosa más...',
    teaserText: 'Ya tenés el sistema (Plano.Money) y el método (Domina Tu Dinero). Pero la mayoría de los gastos que se te escapan no son un problema de método, son un problema emocional. Emoción y Dinero es un diario de 30 días para registrar cómo te sentís junto a cada gasto, y reconocer el impulso antes de que se convierta en un gasto más del que te arrepentís.',
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
    teaserTitle: 'Pensalo así...',
    teaserText: 'Capaz no es que te falte un método. Es que todavía no entendés qué te lleva a gastar justo en esos momentos que después te pesan. Emoción y Dinero es un diario de 30 días para identificar exactamente qué sentís antes de cada compra de la que te arrepentís, así la próxima vez elegís vos, no el impulso.',
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
