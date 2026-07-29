import { ShieldCheck, Zap, Smartphone, Users, Target, Mic, Star, Lock, Clock, Mail, BadgeCheck } from 'lucide-react'
import Logo from '../components/Logo.jsx'

// TODO: reemplazar por el link real del checkout de Hotmart (Plano.Money).
const CHECKOUT_URL = 'https://pay.hotmart.com/P106882'

const BENEFITS = [
  { icon: Users, title: 'Controlá los gastos de toda tu familia', text: 'Perfiles compartidos — cada uno ve lo que le corresponde, en un solo lugar.' },
  { icon: Target, title: 'Definí metas y seguí tu progreso', text: 'Viajes, compras, ahorro — visualizá cuánto llevás cada semana.' },
  { icon: Mic, title: 'Registrá gastos en segundos', text: 'Con voz, sin tipear. Anotás un gasto mientras hacés otra cosa.' },
  { icon: Zap, title: 'Reportes automáticos', text: 'Sabés a dónde va tu plata sin armar una planilla vos mismo.' },
  { icon: Smartphone, title: 'Acceso inmediato', text: 'Desde el celular, la compu o la tablet — apenas confirmás la compra.' },
  { icon: ShieldCheck, title: 'Tus datos, protegidos', text: 'Infraestructura segura, la misma que usan bancos y fintechs.' },
]

const TESTIMONIALS = [
  { name: 'Mariana y Diego', role: 'Padres de familia', initials: 'MD', quote: 'Dejamos de pelear por los gastos. Ahora armamos el presupuesto juntos y hasta ahorramos para nuestras vacaciones.' },
  { name: 'Carolina M.', role: 'Madre de familia', initials: 'CM', quote: 'Antes el dinero desaparecía antes de fin de mes. Ahora sé exactamente en qué se va, y empezamos un fondo para vacaciones.' },
  { name: 'Federico H.', role: 'Diseñador freelance', initials: 'FH', quote: 'Mis ingresos cambian cada mes, pero con Plano.Money por fin puedo planear y ahorrar con confianza.' },
]

const INCLUDES = [
  'Acceso completo a Plano.Money',
  'Bono interactivo: ¿Qué Comprador Eres?',
  'Bono interactivo: 21 Días para Reprogramar tu Cerebro Financiero',
  'Bono interactivo: Piensa Antes de Comprar',
  'Actualizaciones incluidas, sin costo extra',
  'Compatible con celular, tablet y computadora',
]

function Stars() {
  return (
    <div className="flex gap-0.5 text-amber-400">
      {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
    </div>
  )
}

export default function SalesPagePlanoMoney() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Trust bar */}
      <div className="bg-navy-900 text-white text-center py-2 px-4 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
        <span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5" /> Compra 100% segura</span>
        <span className="text-white/30">·</span>
        <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5" /> Acceso inmediato</span>
        <span className="text-white/30">·</span>
        <span>Comenzá hoy mismo</span>
      </div>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-4 pt-10 pb-6 text-center space-y-5">
        <Logo className="w-14 h-14 mx-auto" />
        <h1 className="text-3xl sm:text-5xl font-black text-navy-900 leading-tight">
          Tomá el control de tu dinero,<br className="hidden sm:block" /> incluso cuando tus ingresos cambian
        </h1>
        <p className="text-slate-500 text-base sm:text-lg max-w-xl mx-auto">
          Organizá tus gastos, compartilos con tu familia o llevá las cuentas de tu negocio — todo en un solo lugar, sin cálculos complicados.
        </p>
        <a
          href={CHECKOUT_URL}
          className="inline-block bg-navy-900 hover:bg-navy-800 text-white font-bold py-4 px-8 rounded-xl text-base shadow-lg shadow-navy-900/20"
        >
          Empezar ahora →
        </a>
      </section>

      {/* Video hero */}
      <section className="max-w-2xl mx-auto px-4 pb-14">
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
      <section className="bg-white py-14 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-2xl sm:text-3xl font-black text-navy-900 text-center">¿Qué vas a lograr con Plano.Money?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BENEFITS.map(({ icon: Icon, title, text }) => (
              <div key={title} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-navy-900 to-accent-600 flex items-center justify-center">
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
      <section className="py-14 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-2xl sm:text-3xl font-black text-navy-900 text-center">Gente real, resultados reales</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
                <Stars />
                <p className="text-sm text-slate-700 italic">"{t.quote}"</p>
                <div className="flex items-center gap-2 pt-1">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-navy-900 to-accent-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {t.initials}
                  </div>
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
      <section className="bg-white py-14 px-4">
        <div className="max-w-xl mx-auto space-y-6">
          <h2 className="text-2xl sm:text-3xl font-black text-navy-900 text-center">Tu compra incluye</h2>
          <div className="space-y-2.5">
            {INCLUDES.map(item => (
              <div key={item} className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                <BadgeCheck className="w-5 h-5 text-brand-500 shrink-0" />
                <p className="text-sm text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantee + CTA */}
      <section className="py-14 px-4">
        <div className="max-w-xl mx-auto space-y-6">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
            <ShieldCheck className="w-10 h-10 text-emerald-600 shrink-0" />
            <p className="text-sm text-emerald-700 font-semibold">
              7 días de garantía. Si Plano.Money no te ayuda a ordenar tus finanzas, te devolvemos tu dinero. Sin preguntas.
            </p>
          </div>

          <div className="bg-navy-900 rounded-2xl p-7 sm:p-8 text-center space-y-4">
            <p className="text-white/70 text-xs font-bold uppercase">Empezá hoy</p>
            <p className="text-3xl sm:text-4xl font-black text-white">US$ 5.99<span className="text-lg font-semibold text-white/60">/mes</span></p>
            <p className="text-white/60 text-xs">o US$ 35.99/año (equivale a menos de US$ 3/mes)</p>
            <a
              href={CHECKOUT_URL}
              className="block w-full bg-white text-navy-900 font-bold py-4 rounded-xl text-base"
            >
              Empezar ahora →
            </a>
            <div className="flex items-center justify-center gap-4 text-white/50 text-[11px] pt-1">
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
