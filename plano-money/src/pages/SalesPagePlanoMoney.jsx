import { useRef, useState } from 'react'
import { ShieldCheck, Zap, ShieldQuestion, Lock as LockIcon, Mail as MailIcon, BadgeCheck as BadgeCheckIcon, Star, Clock, BadgeCheck, Play } from 'lucide-react'
import Logo from '../components/Logo.jsx'

// TODO: reemplazar por el link real del checkout de Hotmart (Plano.Money).
const CHECKOUT_URL = 'https://pay.hotmart.com/P106882'

const BENEFITS = [
  { icon: '💰', text: 'Saber cuánto entra' },
  { icon: '📉', text: 'Saber cuánto sale' },
  { icon: '🏦', text: 'Ahorrar todos los meses' },
  { icon: '🎯', text: 'Cumplir tus objetivos' },
]

const TESTIMONIALS = [
  { name: 'Carolina M.', role: 'Madre de familia', photo: '/testimonio-carolina.png', quote: 'Por primera vez sé exactamente cuánto puedo gastar sin preocuparme.', accent: 'bg-celeste-500' },
  { name: 'Federico H.', role: 'Diseñador freelance', photo: '/testimonio-federico.png', quote: 'Por fin puedo ahorrar, aunque mis ingresos cambien cada mes.', accent: 'bg-brand-500' },
  { name: 'Mariana y Diego', role: 'Padres de familia', photo: '/testimonio-pareja.png', quote: 'Dejamos de discutir por la plata. Ahora decidimos juntos.', accent: 'bg-lila-500' },
]

const INCLUDES = [
  'Presupuesto familiar',
  'Registro inteligente de gastos',
  'Metas de ahorro',
  'Reportes automáticos',
  'Coach financiero IA',
  'Acceso desde celular y computadora',
  'Actualizaciones incluidas',
]

const BONUSES = [
  { icon: '🛍️', title: '¿Qué Comprador Eres?' },
  { icon: '🧠', title: '21 Días para Reprogramar tu Cerebro Financiero' },
  { icon: '🎯', title: 'Piensa Antes de Comprar' },
]

const TRUST_GRID = [
  { icon: ShieldQuestion, title: 'Privacidad', text: 'Tu información está 100% segura' },
  { icon: LockIcon, title: 'Compra segura', text: 'Ambiente seguro y autenticado' },
  { icon: MailIcon, title: 'Entrega por email', text: 'Acceso al producto entregado por email' },
  { icon: BadgeCheckIcon, title: 'Contenido aprobado', text: '100% revisado y aprobado' },
]

const SEALS = [
  { icon: ShieldCheck, label: '100%', sublabel: 'Compra segura', gradient: 'from-brand-500 to-brand-600', ribbon: 'bg-brand-500/70' },
  { icon: Clock, label: '7 DÍAS', sublabel: 'Garantía total', gradient: 'from-rose-500 to-red-600', ribbon: 'bg-rose-400' },
  { icon: Zap, label: '24/7', sublabel: 'Acceso inmediato', gradient: 'from-celeste-500 to-celeste-600', ribbon: 'bg-celeste-400' },
  { icon: Star, label: 'TOP', sublabel: 'Recomendado', gradient: 'from-amber-400 to-amber-500', ribbon: 'bg-amber-300' },
]

function Stars() {
  return (
    <div className="flex gap-0.5 text-amber-400">
      {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
    </div>
  )
}

function Seal({ icon: Icon, label, sublabel, gradient, ribbon }) {
  return (
    <div className="flex flex-col items-center w-20 sm:w-24 shrink-0">
      <div className="relative">
        <div className={`absolute -bottom-2 left-1/2 -translate-x-[80%] w-4 h-7 ${ribbon} -z-10 skew-x-[12deg] rounded-sm`} />
        <div className={`absolute -bottom-2 left-1/2 translate-x-[10%] w-4 h-7 ${ribbon} -z-10 -skew-x-[12deg] rounded-sm`} />
        <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br ${gradient} ring-4 ring-white shadow-xl flex flex-col items-center justify-center text-white`}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 mb-0.5" />
          <span className="text-xs sm:text-sm font-black uppercase tracking-wide">{label}</span>
        </div>
      </div>
      <p className="text-sm sm:text-base font-bold text-navy-900 text-center mt-2 leading-tight">{sublabel}</p>
    </div>
  )
}

function DemoVideo() {
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-accent-600/20 border-4 border-white ring-1 ring-slate-200 bg-navy-900">
      <video
        ref={videoRef}
        src="/demo-plano-money.mp4"
        poster="/demo-poster.jpg"
        controls
        playsInline
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="w-full max-h-[80vh] mx-auto block"
      />
      {!playing && (
        <button
          onClick={() => videoRef.current?.play()}
          aria-label="Reproducir video"
          className="absolute inset-0 flex items-center justify-center group"
        >
          <span className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-red-600 flex items-center justify-center shadow-2xl ring-4 ring-white/30 group-hover:scale-110 transition">
            <Play className="w-9 h-9 sm:w-11 sm:h-11 text-white fill-white ml-1" />
          </span>
        </button>
      )}
    </div>
  )
}

export default function SalesPagePlanoMoney() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Trust bar */}
      <div className="bg-gradient-to-r from-lila-600 via-accent-600 to-celeste-600 text-white text-center py-3.5 px-4 text-lg sm:text-xl font-bold flex items-center justify-center gap-2 sm:gap-5 flex-wrap">
        <span className="flex items-center gap-1.5">🛡️ Compra 100% segura</span>
        <span className="text-white/30">·</span>
        <span className="flex items-center gap-1.5">📱 Acceso inmediato</span>
        <span className="text-white/30">·</span>
        <span className="flex items-center gap-1.5">✅ Comenzá hoy mismo</span>
      </div>

      {/* Hero */}
      <section className="relative bg-gradient-to-b from-lila-50 via-celeste-50/40 to-white pt-10 pb-6 px-4 overflow-hidden">
        <div className="absolute -top-20 -left-24 w-72 h-72 bg-lila-400/30 rounded-full blur-3xl -z-10" />
        <div className="absolute top-10 -right-20 w-72 h-72 bg-celeste-400/30 rounded-full blur-3xl -z-10" />

        <div className="max-w-3xl mx-auto text-center space-y-5">
          <Logo className="w-24 h-24 sm:w-28 sm:h-28 mx-auto" />
          <h1 className="text-5xl sm:text-7xl font-black text-navy-900 leading-tight">
            Dejá de preguntarte<br className="hidden sm:block" />{' '}
            a dónde se fue tu sueldo,{' '}
            <span className="bg-gradient-to-r from-lila-600 via-accent-600 to-celeste-600 bg-clip-text text-transparent">
              incluso si tus ingresos cambian cada mes
            </span>
          </h1>
          <p className="text-slate-500 text-xl sm:text-2xl max-w-xl mx-auto">
            Ya sea que administres tu hogar, compartas gastos con tu pareja, seas emprendedor o trabajes de forma independiente, vas a tener una visión clara de tu dinero, sin planillas complicadas ni cálculos difíciles.
          </p>
          <a
            href={CHECKOUT_URL}
            className="inline-block bg-gradient-to-r from-lila-500 via-accent-600 to-celeste-500 hover:brightness-110 text-white font-bold py-4 px-9 rounded-full text-xl shadow-xl shadow-accent-600/30 transition hover:scale-105"
          >
            Quiero ordenar mis finanzas →
          </a>
        </div>

        {/* Big device mockup */}
        <div className="relative max-w-5xl mx-auto mt-8">
          <img
            src="/hero-mockup.png"
            alt="Plano.Money en laptop y celular"
            className="w-full h-auto"
          />
        </div>
      </section>

      {/* Video, moved right up top per feedback: it's the strongest asset */}
      <section className="max-w-2xl mx-auto px-4 pt-4 pb-8 text-center">
        <h2 className="text-4xl sm:text-5xl font-black text-navy-900">Estás a un paso de transformar tus finanzas</h2>
        <p className="text-slate-500 text-lg sm:text-xl max-w-lg mx-auto mt-2 mb-6">
          Descubrí en menos de 2 minutos cómo Plano.Money te ayuda a organizar ingresos, controlar gastos y alcanzar tus metas.
        </p>
        <DemoVideo />
      </section>

      {/* Benefits: outcome checklist */}
      <section className="bg-gradient-to-br from-celeste-50 via-white to-lila-50 py-8 px-4">
        <div className="max-w-2xl mx-auto space-y-8">
          <h2 className="text-4xl sm:text-5xl font-black text-navy-900 text-center">¿Qué vas a lograr con Plano.Money?</h2>
          <div className="grid grid-cols-2 gap-4">
            {BENEFITS.map(b => (
              <div key={b.text} className="bg-white rounded-2xl border-2 border-celeste-600 shadow-sm p-6 text-center space-y-2">
                <p className="text-4xl">{b.icon}</p>
                <p className="text-lg sm:text-xl font-bold text-navy-900">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-8 px-4 bg-white">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-4xl sm:text-5xl font-black text-navy-900 text-center">Gente real, resultados reales</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="relative bg-white p-5 pt-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-1.5 ${t.accent}`} />
                <Stars />
                <p className="text-lg text-slate-700 italic">"{t.quote}"</p>
                <div className="flex items-center gap-2 pt-1">
                  <img
                    src={t.photo}
                    alt={t.name}
                    className="w-11 h-11 rounded-full object-cover shrink-0 ring-2 ring-white shadow"
                  />
                  <div>
                    <p className="text-base font-bold text-navy-900">{t.name}</p>
                    <p className="text-sm text-slate-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="bg-gradient-to-br from-brand-50 via-white to-celeste-50 py-8 px-4">
        <div className="max-w-xl mx-auto space-y-6">
          <h2 className="text-4xl sm:text-5xl font-black text-navy-900 text-center">Todo lo que obtenés</h2>
          <div className="space-y-2.5">
            {INCLUDES.map((item, i) => (
              <div key={item} className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm">
                <BadgeCheck className={`w-5 h-5 shrink-0 ${['text-lila-500', 'text-celeste-500', 'text-brand-500'][i % 3]}`} />
                <p className="text-lg text-slate-700">{item}</p>
              </div>
            ))}
          </div>

          <p className="text-center font-black text-navy-900 text-2xl sm:text-3xl pt-4">Incluye 3 Bonos Interactivos que te ayudarán en tu proceso</p>
          <div className="grid sm:grid-cols-3 gap-4">
            {BONUSES.map(b => (
              <div key={b.title} className="bg-navy-900 rounded-2xl p-6 text-center space-y-2 shadow-md">
                <p className="text-5xl">{b.icon}</p>
                <p className="font-bold text-white text-lg leading-tight">{b.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust grid */}
      <section className="py-8 px-4 bg-white">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            {TRUST_GRID.map(({ icon: Icon, title, text }) => (
              <div key={title} className="bg-white rounded-2xl border-2 border-brand-600 p-5 flex items-start gap-3">
                <Icon className="w-7 h-7 shrink-0 text-brand-600" />
                <div>
                  <p className="font-bold text-navy-900 text-lg">{title}</p>
                  <p className="text-base text-slate-500">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantee + CTA */}
      <section className="py-8 px-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[36rem] h-[36rem] bg-gradient-to-br from-lila-300/20 via-accent-400/20 to-celeste-300/20 rounded-full blur-3xl -z-10" />
        <div className="max-w-xl mx-auto space-y-6">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
            <ShieldCheck className="w-10 h-10 text-emerald-600 shrink-0" />
            <p className="text-lg text-emerald-700 font-semibold">
              7 días de garantía. Si Plano.Money no te ayuda a ordenar tus finanzas, te devolvemos tu dinero. Sin preguntas.
            </p>
          </div>

          <div className="relative bg-navy-900 rounded-2xl p-7 sm:p-8 text-center space-y-4 overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-lila-500/30 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-celeste-500/30 rounded-full blur-2xl" />
            <p className="relative text-white/70 text-base font-bold uppercase">Empezá hoy</p>
            <p className="relative text-xl font-semibold text-white/40 line-through">US$ 12.99/mes</p>
            <p className="relative text-5xl sm:text-6xl font-black text-white">US$ 5.99<span className="text-2xl font-semibold text-white/60">/mes</span></p>
            <p className="relative text-white/40 text-base line-through">US$ 155.99/año</p>
            <p className="relative text-white/60 text-base">o US$ 35.99/año (equivale a menos de US$ 3/mes)</p>
            <a
              href={CHECKOUT_URL}
              className="relative block w-full bg-gradient-to-r from-lila-400 via-white to-celeste-300 text-navy-900 font-bold py-4 rounded-xl text-xl hover:brightness-105 transition"
            >
              Quiero ordenar mis finanzas →
            </a>
          </div>

          {/* Seals */}
          <div className="flex items-start justify-center gap-4 sm:gap-8 overflow-x-auto px-2 pt-2">
            {SEALS.map(s => <Seal key={s.label} {...s} />)}
          </div>
        </div>
      </section>

      <footer className="max-w-2xl mx-auto px-4 pb-10 text-center space-y-2">
        <p className="text-base text-slate-400 leading-relaxed">
          Plano.Money es una herramienta de organización financiera personal. No constituye asesoría financiera profesional ni garantiza resultados de ahorro específicos. Estos dependen de las decisiones y hábitos de cada usuario.
        </p>
        <p className="text-base text-slate-300">© {new Date().getFullYear()} Novi Global International S.A. · Plano.Money. Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}
