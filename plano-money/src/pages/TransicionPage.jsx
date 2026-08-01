import Logo from '../components/Logo.jsx'

// Pantallas de "transición" entre pasos del embudo de Hotmart (compra →
// upsell, upsell aceptado → gracias, upsell rechazado → downsell). No
// venden nada — preparan psicológicamente para la siguiente decisión, así
// que se mantienen deliberadamente austeras: fondo blanco, logo, un
// mensaje corto, una barra de progreso, un solo botón. Nada de
// testimonios ni listas de beneficios, eso es trabajo de la oferta que
// sigue, no de esta pantalla.
//
// Deliberadamente sin ninguna cifra de "X% de la gente también agrega
// esto" — no tenemos ese dato todavía, así que el texto genera
// expectativa sin apoyarse en una estadística que no podemos respaldar.
const TRANSITIONS = {
  'post-compra': {
    step: 1,
    totalSteps: 2,
    checkLabel: 'Compra realizada',
    statusLabel: 'Configurando tu acceso...',
    title: '🎉 ¡Excelente decisión!',
    subtitle: 'Acabás de dar el primer paso para ordenar tus finanzas. En unos minutos vas a recibir tu acceso por email.',
    teaserTitle: 'Mientras tanto...',
    teaserText: 'Hay algo que puede acelerar tus resultados.',
    ctaLabel: 'Continuar →',
    ctaHref: '/upsell-domina-tu-dinero',
  },
  'post-upsell-si': {
    step: 2,
    totalSteps: 2,
    checkLabel: 'Domina Tu Dinero agregado',
    statusLabel: 'Preparando todo...',
    title: '🎉 Perfecto.',
    subtitle: 'Ya quedó agregado a tu compra. No necesitás hacer nada más: se activa automáticamente junto con Plano.Money.',
    ctaLabel: 'Continuar →',
    ctaHref: '/gracias?o=domina',
  },
  'post-decline': {
    step: 2,
    totalSteps: 2,
    checkLabel: 'Compra realizada',
    statusLabel: 'Buscando la mejor opción para vos...',
    title: 'Sin problema.',
    subtitle: 'Tu compra principal ya quedó confirmada. Antes de continuar, quizás esta alternativa tenga más sentido para vos.',
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
