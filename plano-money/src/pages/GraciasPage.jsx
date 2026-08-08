import { CheckCircle2 } from 'lucide-react'
import Logo from '../components/Logo.jsx'

// Página de agradecimiento final del embudo — a donde llegan las 3 ramas
// terminales de Hotmart (aceptar upsell, aceptar downsell, rechazar
// downsell), siempre después de pasar por una TransicionPage.jsx. En vez
// de la página genérica de Hotmart, que rompería la coherencia visual del
// resto del embudo. El contenido de "bienvenida" es el mismo para
// cualquiera que llegue acá — lo único que cambia por rama es la
// confirmación chica de arriba (?o=domina/emocion, sin param = solo
// Plano.Money), porque el resto ya se dijo en la pantalla de transición
// anterior.
//
// Sin video de bienvenida por ahora — en su lugar, el mismo mensaje en
// texto, en primera persona de Mariano (fundador real, no un locutor
// genérico). Si más adelante se graba el video real, reemplaza este
// bloque siguiendo el mismo patrón que DemoVideo en
// SalesPagePlanoMoney.jsx.
const WELCOME_MESSAGE = '¡Hola! Soy Mariano y quiero darte la bienvenida personalmente. Tomaste una excelente decisión. Adentro vas a encontrar un recorrido muy simple: empezá registrando tus ingresos, después tus gastos, y en menos de diez minutos vas a tener una visión mucho más clara de tu dinero. Nos vemos adentro.'
const CONFIRMATIONS = {
  domina: 'Domina Tu Dinero ya es tuyo. Te llega junto con el acceso a Plano.Money.',
  emocion: 'Emoción y Dinero ya es tuyo. Te llega junto con el acceso a Plano.Money.',
}

function getConfirmation() {
  const key = new URLSearchParams(window.location.search).get('o')
  return CONFIRMATIONS[key] || null
}

const CHECKLIST = [
  'Revisá tu correo.',
  'Mirá spam si no lo ves.',
  'Guardá el mail para no perderlo.',
  'En menos de 5 minutos vas a tener acceso.',
]

const NEXT_STEPS = [
  'Registrá tu ingreso.',
  'Registrá tus gastos.',
  'Creá tu primera meta.',
]

export default function GraciasPage() {
  const confirmation = getConfirmation()
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-lila-50 via-celeste-50/40 to-white flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute -top-16 -left-20 w-64 h-64 bg-lila-400/20 rounded-full blur-3xl -z-10" />
      <div className="absolute top-24 -right-16 w-64 h-64 bg-celeste-400/20 rounded-full blur-3xl -z-10" />
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10 text-center space-y-5">
        <Logo className="w-16 h-16 mx-auto" />
        <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto" />

        {confirmation && (
          <p className="inline-block bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold text-sm rounded-full px-4 py-2">
            ✓ {confirmation}
          </p>
        )}

        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy-900 leading-tight">Bienvenido a Plano.Money</h1>
          <p className="text-slate-500 text-base mt-1">Tu acceso está siendo preparado.</p>
        </div>

        <div className="text-left bg-slate-50 rounded-2xl p-4 space-y-2">
          <p className="text-xs font-bold uppercase text-slate-400">Mientras tanto</p>
          {CHECKLIST.map((t, i) => (
            <p key={i} className="text-sm text-slate-700 flex gap-2"><span className="text-emerald-500 font-bold shrink-0">✓</span>{t}</p>
          ))}
        </div>

        <div className="text-left bg-white border border-slate-200 rounded-2xl p-4 space-y-2">
          <p className="text-xs font-bold uppercase text-slate-400">Qué hacer primero</p>
          {NEXT_STEPS.map((t, i) => (
            <p key={i} className="text-sm text-slate-700 flex gap-2"><span className="font-black text-brand-600 shrink-0">{i + 1}.</span>{t}</p>
          ))}
        </div>

        <p className="text-sm text-slate-500">En menos de 10 minutos vas a tener una fotografía completa de tus finanzas.</p>

        <div className="text-left bg-lila-50 border border-lila-200 rounded-2xl p-4 space-y-1.5">
          <p className="text-xs font-bold uppercase text-lila-600">Un mensaje de Mariano, fundador de Plano.Money</p>
          <p className="text-sm text-slate-700 italic">{WELCOME_MESSAGE}</p>
        </div>

        <a
          href="/"
          className="block w-full bg-gradient-to-r from-lila-500 via-accent-600 to-celeste-500 hover:brightness-110 text-white font-bold py-4 rounded-full text-base shadow-lg shadow-accent-600/30 transition hover:scale-105"
        >
          Ir al área de miembros →
        </a>
      </div>
    </div>
  )
}
