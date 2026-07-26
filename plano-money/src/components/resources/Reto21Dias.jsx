import { useState } from 'react'
import { Check } from 'lucide-react'

const DAYS = [
  'Anotá absolutamente todo lo que gastes hoy.',
  'No compres nada que no esté planificado.',
  'Cancelá una suscripción innecesaria.',
  'Hacé una lista con tus tres principales metas financieras.',
  'Esperá 24 horas antes de cualquier compra.',
  'Revisá tu estado de cuenta.',
  'Comparé precios antes de comprar.',
  'Preparé comida en casa.',
  'No entres a tiendas online.',
  'Hacé una caminata en lugar de comprar.',
  'Ahorrá aunque sea un poco.',
  'Hablá con alguien sobre dinero.',
  'Organizá tus gastos.',
  'Hacé limpieza de aplicaciones de compras.',
  'Escribí tus logros financieros.',
  'Calculá cuánto gastaste en compras impulsivas.',
  'Leé 15 minutos sobre educación financiera.',
  'Hacé una compra completamente consciente.',
  'Revisá tu presupuesto.',
  'Definí un nuevo hábito.',
  'Escribí una carta a tu "yo financiero" dentro de un año.',
]

const STORAGE_KEY = 'plano_money_reto_21_dias'

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}
  } catch {
    return {}
  }
}

export default function Reto21Dias() {
  const [checked, setChecked] = useState(loadState)

  const toggle = day => {
    const next = { ...checked, [day]: !checked[day] }
    setChecked(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  const completedCount = Object.values(checked).filter(Boolean).length
  const pct = Math.round((completedCount / DAYS.length) * 100)

  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
      <div>
        <h3 className="text-base sm:text-lg font-bold text-navy-900">Reto: 21 días para reprogramar tu cerebro financiero</h3>
        <p className="text-xs text-slate-400 mt-1">Solo necesitás entre 5 y 10 minutos diarios. Marcá cada día cuando completes la actividad.</p>
      </div>

      <div>
        <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
          <span>{completedCount} de {DAYS.length} días</span>
          <span>{pct}%</span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-brand-500 to-emerald-500 transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="space-y-2">
        {DAYS.map((activity, i) => {
          const day = i + 1
          const done = !!checked[day]
          return (
            <label
              key={day}
              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${done ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-100 hover:border-brand-300'}`}
            >
              <button
                type="button"
                onClick={() => toggle(day)}
                className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${done ? 'bg-emerald-500 text-white' : 'bg-white border-2 border-slate-300'}`}
              >
                {done && <Check className="w-3 h-3" />}
              </button>
              <div>
                <p className="text-xs font-bold text-slate-400">Día {day}</p>
                <p className={`text-sm ${done ? 'text-emerald-700 line-through' : 'text-slate-700'}`}>{activity}</p>
              </div>
            </label>
          )
        })}
      </div>

      {completedCount === DAYS.length && (
        <div className="text-center p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
          <p className="font-bold text-emerald-700">¡Completaste el reto de los 21 días! 🎉</p>
        </div>
      )}
    </div>
  )
}
