import { CheckCircle2 } from 'lucide-react'
import Logo from '../components/Logo.jsx'

// Página de agradecimiento propia para los 3 tramos finales del embudo de
// Hotmart (aceptar upsell, aceptar downsell, rechazar downsell) — en vez
// de mandar a la genérica de Hotmart, que rompería la coherencia visual
// del resto del embudo. Un mismo archivo, no 3, siguiendo el patrón de
// /oferta: un parámetro en la URL (?o=) elige el mensaje.
//
// Sin video todavía (queda para más adelante) — solo confirmación de qué
// se compró y el siguiente paso real (revisar el mail).
const OUTCOMES = {
  domina: {
    title: '¡Listo! Domina Tu Dinero ya es tuyo.',
    detail: 'Revisá tu mail: ahí te llega el acceso a tu ebook interactivo, junto con el de Plano.Money.',
  },
  emocion: {
    title: '¡Listo! Emoción y Dinero ya es tuyo.',
    detail: 'Revisá tu mail: ahí te llega el acceso a tu diario interactivo de 30 días, junto con el de Plano.Money.',
  },
  base: {
    title: 'Tu compra de Plano.Money está confirmada.',
    detail: 'Revisá tu mail: ahí te llega todo lo que necesitás para empezar.',
  },
}

function getOutcome() {
  const key = new URLSearchParams(window.location.search).get('o')
  return OUTCOMES[key] || OUTCOMES.base
}

export default function GraciasPage() {
  const outcome = getOutcome()
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-lila-50 via-celeste-50/40 to-white flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute -top-16 -left-20 w-64 h-64 bg-lila-400/20 rounded-full blur-3xl -z-10" />
      <div className="absolute top-24 -right-16 w-64 h-64 bg-celeste-400/20 rounded-full blur-3xl -z-10" />
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10 text-center space-y-5">
        <Logo className="w-16 h-16 mx-auto" />
        <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto" />
        <h1 className="text-2xl sm:text-3xl font-black text-navy-900 leading-tight">{outcome.title}</h1>
        <p className="text-slate-500 text-base">{outcome.detail}</p>
      </div>
    </div>
  )
}
