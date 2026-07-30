import { ShieldCheck, Zap, Smartphone, Users, Target, Mic, Star, Lock, Clock, Mail, BadgeCheck } from 'lucide-react'
import Logo from '../components/Logo.jsx'

// TODO: reemplazar por el link real del checkout de Hotmart (Plano.Money).
const CHECKOUT_URL = 'https://pay.hotmart.com/P106882'

const ICON_GRADIENTS = ['from-lila-500 to-accent-600', 'from-celeste-500 to-celeste-600', 'from-brand-500 to-brand-600']

const BENEFITS = [
  { icon: Users, title: 'Controlá los gastos de toda tu familia', text: 'Perfiles compartidos — cada uno ve lo que le corresponde, en un solo lugar.' },
  { icon: Target, title: 'Definí metas y seguí tu progreso', text: 'Viajes, compras, ahorro — visualizá cuánto llevás cada semana.' },
  { icon: Mic, title: 'Registrá gastos en segundos', text: 'Con voz, sin tipear. Anotás un gasto mientras hacés otra cosa.' },
  { icon: Zap, title: 'Reportes automáticos', text: 'Sabés a dónde va tu plata sin armar una planilla vos mismo.' },
  { icon: Smartphone, title: 'Acceso inmediato', text: 'Desde el celular, la compu o la tablet — apenas confirmás la compra.' },
  { icon: ShieldCheck, title: 'Tus datos, protegidos', text: 'Infraestructura segura, la misma que usan bancos y fintechs.' },
]

const TESTIMONIALS = [
  { name: 'Mariana y Diego', role: 'Padres de familia', photo: '/testimonio-pareja.png', quote: 'Dejamos de pelear por los gastos. Ahora armamos el presupuesto juntos y hasta ahorramos para nuestras vacaciones.', accent: 'bg-lila-500' },
  { name: 'Carolina M.', role: 'Madre de familia', photo: '/testimonio-carolina.png', quote: 'Antes el dinero desaparecía antes de fin de mes. Ahora sé exactamente en qué se va, y empezamos un fondo para vacaciones.', accent: 'bg-celeste-500' },
  { name: 'Federico H.', role: 'Diseñador freelance', photo: '/testimonio-federico.png', quote: 'Mis ingresos cambian cada mes, pero con Plano.Money por fin puedo planear y ahorrar con confianza.', accent: 'bg-brand-500' },
]

const INCLUDES = [
  'Acceso completo a Plano.Money',
  'Bono interactivo: ¿Qué Comprador Eres?',
  'Bono interactivo: 21 Días para Reprogramar tu Cerebro Financiero',
  'Bono interactivo: Piensa Antes de Comprar',
  'Actualizaciones incluidas, sin costo extra',
  'Compatible con celular, tablet y computadora',
]

const SEALS = [
  { icon: Lock, label: 'SSL', sublabel: 'Pago 100% seguro', gradient: 'from-lila-500 to-accent-600', ribbon: 'bg-lila-400' },
  { icon: Zap, label: '24/7', sublabel: 'Acceso inmediato', gradient: 'from-celeste-500 to-celeste-600', ribbon: 'bg-celeste-400' },
  { icon: ShieldCheck, label: '7 DÍAS', sublabel: 'Garantía total', gradient: 'from-brand-500 to-brand-600', ribbon: 'bg-brand-500/70' },
  { icon: Star, label: 'TOP', sublabel: 'Recomendado', gradient: 'from-amber-400 to-amber-500', ribbon: 'bg-amber-300' },
]

function Stars() {
  return (
    <div className="flex gap-0.5 text-amber-400">
      {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
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
          <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wide">{label}</span>
        </div>
      </div>
      <p className="text-[10px] sm:text-[11px] font-bold text-navy-900 text-center mt-2 leading-tight">{sublabel}</p>
    </div>
  )
}

export default function SalesPagePlanoMoney() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Trust bar */}
      <div className="bg-gradient-to-r from-lila-600 via-accent-600 to-celeste-600 text-white text-center py-2 px-4 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
        <span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5" /> Compra 100% segura</span>
        <span className="text-white/30">·</span>
        <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5" /> Acceso inmediato</span>
        <span className="text-white/30">·</span>
        <span>Comenzá hoy mismo</span>
      </div>

      {/* Hero */}
      <section className="relative bg-gradient-to-b from-lila-50 via-celeste-50/40 to-white pt-10 pb-10 px-4 overflow-hidden">
        <div className="absolute -top-20 -left-24 w-72 h-72 bg-lila-400/30 rounded-full blur-3xl -z-10" />
        <div className="absolute top-10 -right-20 w-72 h-72 bg-celeste-400/30 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl -z-10" />

        <div className="max-w-3xl mx-auto text-center space-y-5">
          <Logo className="w-14 h-14 mx-auto" />
          <h1 className="text-3xl sm:text-5xl font-black text-navy-900 leading-tight">
            Tomá el control de tu dinero,<br className="hidden sm:block" />{' '}
            <span className="bg-gradient-to-r from-lila-600 via-accent-600 to-celeste-600 bg-clip-text text-transparent">
              incluso cuando tus ingresos cambian
            </span>
          </h1>
          <p className="text-slate-500 text-base sm:text-lg max-w-xl mx-auto">
            Organizá tus gastos, compartilos con tu familia o llevá las cuentas de tu negocio — todo en un solo lugar, sin cálculos complicados.
          </p>
          <a
            href={CHECKOUT_URL}
            className="inline-block bg-gradient-to-r from-lila-500 via-accent-600 to-celeste-500 hover:brightness-110 text-white font-bold py-4 px-9 rounded-full text-base shadow-xl shadow-accent-600/30 transition hover:scale-105"
          >
            Empezar ahora →
          </a>
        </div>

        {/* Device mockup */}
        <div className="relative max-w-4xl mx-auto mt-10">
          <img
            src="/hero-mockup.png"
            alt="Plano.Money en laptop y celular"
            className="w-full h-auto drop-shadow-2xl"
          />
        </div>

        {/* Seals */}
        <div className="max-w-2xl mx-auto mt-6 flex items-start justify-center gap-4 sm:gap-8 overflow-x-auto px-2">
          {SEALS.map(s => <Seal key={s.label} {...s} />)}
        </div>
      </section>

      {/* Video hero */}
      <section className="max-w-2xl mx-auto px-4 py-14">
        <div className="rounded-3xl overflow-hidden shadow-2xl shadow-accent-600/20 border-4 border-white ring-1 ring-slate-200 bg-navy-900">
          <video
            src="/demo-plano-money.mp4"
            poster="/demo-poster.jpg"
            controls
            playsInline
            preload="metadata"
            className="w-full max-h-[80vh] mx-auto block"
          />
        </div>
        <p className="text-center text-xs text-slate-400 mt-3">Así es Plano.Money en la vida real — sin actuación, así lo usás vos.</p>
      </section>

      {/* Benefits */}
      <section className="bg-gradient-to-br from-celeste-50 via-white to-lila-50 py-14 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-2xl sm:text-3xl font-black text-navy-900 text-center">¿Qué vas a lograr con Plano.Money?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BENEFITS.map(({ icon: Icon, title, text }, i) => (
              <div key={title} className="p-5 rounded-2xl border border-slate-200 bg-white space-y-2 shadow-sm">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${ICON_GRADIENTS[i % ICON_GRADIENTS.length]} flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="font-bold text-navy-900 text-sm">{title}</p>
                <p className="text-xs text-slate-500">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-2xl sm:text-3xl font-black text-navy-900 text-center">Gente real, resultados reales</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="relative bg-white p-5 pt-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-1.5 ${t.accent}`} />
                <Stars />
                <p className="text-sm text-slate-700 italic">"{t.quote}"</p>
                <div className="flex items-center gap-2 pt-1">
                  <img
                    src={t.photo}
                    alt={t.name}
                    className="w-11 h-11 rounded-full object-cover shrink-0 ring-2 ring-white shadow"
                  />
                  <div>
                    <p className="text-xs font-bold text-navy-900">{t.name}</p>
                    <p className="text-[11px] text-slate-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="bg-gradient-to-br from-brand-50 via-white to-celeste-50 py-14 px-4">
        <div className="max-w-xl mx-auto space-y-6">
          <h2 className="text-2xl sm:text-3xl font-black text-navy-900 text-center">Tu compra incluye</h2>
          <div className="space-y-2.5">
            {INCLUDES.map((item, i) => (
              <div key={item} className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm">
                <BadgeCheck className={`w-5 h-5 shrink-0 ${['text-lila-500', 'text-celeste-500', 'text-brand-500'][i % 3]}`} />
                <p className="text-sm text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantee + CTA */}
      <section className="py-14 px-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[36rem] h-[36rem] bg-gradient-to-br from-lila-300/20 via-accent-400/20 to-celeste-300/20 rounded-full blur-3xl -z-10" />
        <div className="max-w-xl mx-auto space-y-6">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
            <ShieldCheck className="w-10 h-10 text-emerald-600 shrink-0" />
            <p className="text-sm text-emerald-700 font-semibold">
              7 días de garantía. Si Plano.Money no te ayuda a ordenar tus finanzas, te devolvemos tu dinero. Sin preguntas.
            </p>
          </div>

          <div className="relative bg-navy-900 rounded-2xl p-7 sm:p-8 text-center space-y-4 overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-lila-500/30 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-celeste-500/30 rounded-full blur-2xl" />
            <p className="relative text-white/70 text-xs font-bold uppercase">Empezá hoy</p>
            <p className="relative text-base font-semibold text-white/40 line-through">US$ 17.99/mes</p>
            <p className="relative text-3xl sm:text-4xl font-black text-white">US$ 4.99<span className="text-lg font-semibold text-white/60">/mes</span></p>
            <p className="relative text-white/60 text-xs">o US$ 35.99/año (equivale a menos de US$ 3/mes)</p>
            <a
              href={CHECKOUT_URL}
              className="relative block w-full bg-gradient-to-r from-lila-400 via-white to-celeste-300 text-navy-900 font-bold py-4 rounded-xl text-base hover:brightness-105 transition"
            >
              Empezar ahora →
            </a>
            <div className="relative flex items-center justify-center gap-4 text-white/50 text-[11px] pt-1">
              <span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5" /> Pago seguro</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Acceso inmediato</span>
              <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> Soporte por mail</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="max-w-2xl mx-auto px-4 pb-10 text-center space-y-2">
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Plano.Money es una herramienta de organización financiera personal. No constituye asesoría financiera profesional ni garantiza resultados de ahorro específicos — estos dependen de las decisiones y hábitos de cada usuario.
        </p>
        <p className="text-[11px] text-slate-300">© {new Date().getFullYear()} Novi Global International S.A. · Plano.Money — Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}
