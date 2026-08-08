import { useState } from 'react'
import { Check, Lock } from 'lucide-react'

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
const WEEK_SIZE = 7
const WEEKS = Math.ceil(DAYS.length / WEEK_SIZE)

function toISODate(d) {
  return d.toISOString().slice(0, 10)
}

// Migra el formato viejo ({[dia]: true}) al nuevo ({[dia]: 'YYYY-MM-DD'}) la
// primera vez que alguien vuelve a abrir el reto — sin fecha real no hay
// racha ni calendario, así que a los registros viejos les asignamos hoy en
// vez de perderlos.
function loadState() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}
    const today = toISODate(new Date())
    const migrated = {}
    for (const [day, value] of Object.entries(raw)) {
      if (!value) continue
      migrated[day] = typeof value === 'string' ? value : today
    }
    return migrated
  } catch {
    return {}
  }
}

function computeStreaks(completedDates) {
  const uniqueDates = [...new Set(completedDates)].sort()
  if (uniqueDates.length === 0) return { current: 0, best: 0 }

  let best = 1
  let run = 1
  for (let i = 1; i < uniqueDates.length; i++) {
    const prev = new Date(uniqueDates[i - 1])
    const cur = new Date(uniqueDates[i])
    const diffDays = Math.round((cur - prev) / 86400000)
    run = diffDays === 1 ? run + 1 : 1
    best = Math.max(best, run)
  }

  const dateSet = new Set(uniqueDates)
  let current = 0
  const cursor = new Date()
  while (dateSet.has(toISODate(cursor))) {
    current += 1
    cursor.setDate(cursor.getDate() - 1)
  }

  return { current, best }
}

const ACHIEVEMENTS = [
  { id: 'primer_paso', icon: '✅', title: 'Primer Paso', desc: 'Completá tu primer día', check: s => s.completedCount >= 1 },
  { id: 'primera_llama', icon: '🔥', title: 'Primera Llama', desc: '3 días seguidos', check: s => s.bestStreak >= 3 },
  { id: 'semana_fuego', icon: '⚡', title: 'Semana de Fuego', desc: '7 días seguidos', check: s => s.bestStreak >= 7 },
  { id: 'mitad_camino', icon: '💪', title: 'A Mitad del Camino', desc: '50% del reto', check: s => s.pct >= 50 },
  { id: 'racha_perfecta', icon: '🏆', title: 'Racha Perfecta', desc: `${DAYS.length} días seguidos`, check: s => s.bestStreak >= DAYS.length },
  { id: 'reto_completo', icon: '👑', title: 'Reto Completo', desc: '100% del reto', check: s => s.pct >= 100 },
]

function WeeklyProgress({ checked }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-bold uppercase text-slate-400">Progreso semanal</p>
      {Array.from({ length: WEEKS }).map((_, w) => {
        const start = w * WEEK_SIZE
        const weekDays = DAYS.slice(start, start + WEEK_SIZE)
        const done = weekDays.filter((_, i) => checked[start + i + 1]).length
        const pct = Math.round((done / weekDays.length) * 100)
        return (
          <div key={w} className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500 w-16 shrink-0">Semana {w + 1}</span>
            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-brand-500 to-emerald-500 transition-all" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-xs font-bold text-slate-400 w-9 text-right shrink-0">{pct}%</span>
          </div>
        )
      })}
    </div>
  )
}

function StreakCalendar({ completedDates }) {
  const dateSet = new Set(completedDates)
  const today = new Date()
  const cells = []
  for (let i = 34; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    cells.push({ iso: toISODate(d), isToday: i === 0, done: dateSet.has(toISODate(d)) })
  }
  return (
    <div>
      <p className="text-xs font-bold uppercase text-slate-400 mb-2">Calendario</p>
      <div className="grid grid-cols-7 gap-1.5">
        {cells.map(c => (
          <div
            key={c.iso}
            title={c.iso}
            className={`aspect-square rounded-md ${
              c.done ? 'bg-emerald-500' : 'bg-slate-100'
            } ${c.isToday ? 'ring-2 ring-brand-500 ring-offset-1' : ''}`}
          />
        ))}
      </div>
    </div>
  )
}

function AchievementsGrid({ stats }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase text-slate-400 mb-2">Logros</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {ACHIEVEMENTS.map(a => {
          const unlocked = a.check(stats)
          return (
            <div
              key={a.id}
              className={`relative rounded-xl border p-3 text-center ${unlocked ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-100'}`}
            >
              {!unlocked && <Lock className="w-3 h-3 text-slate-300 absolute top-2 right-2" />}
              <p className={`text-2xl ${unlocked ? '' : 'grayscale opacity-40'}`}>{a.icon}</p>
              <p className={`text-xs font-bold mt-1 ${unlocked ? 'text-navy-900' : 'text-slate-400'}`}>{a.title}</p>
              <p className="text-[11px] text-slate-400">{a.desc}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function Reto21Dias() {
  const [checked, setChecked] = useState(loadState)

  const toggle = day => {
    const next = { ...checked }
    if (next[day]) {
      delete next[day]
    } else {
      next[day] = toISODate(new Date())
    }
    setChecked(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  const completedCount = Object.keys(checked).length
  const pct = Math.round((completedCount / DAYS.length) * 100)
  const completedDates = Object.values(checked)
  const { current: currentStreak, best: bestStreak } = computeStreaks(completedDates)
  const stats = { completedCount, pct, bestStreak }

  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      <div>
        <h3 className="text-base sm:text-lg font-bold text-navy-900">Reto: 21 días para reprogramar tu cerebro financiero</h3>
        <p className="text-xs text-slate-400 mt-1">Solo necesitás entre 5 y 10 minutos diarios. Marcá cada día cuando completes la actividad.</p>
      </div>

      <div className="flex gap-3">
        <div className="flex-1 bg-brand-50 border border-brand-200 rounded-xl p-3 text-center">
          <p className="text-2xl font-black text-brand-700">🔥 {currentStreak}</p>
          <p className="text-[11px] font-bold uppercase text-brand-600">Racha actual</p>
        </div>
        <div className="flex-1 bg-slate-50 border border-slate-100 rounded-xl p-3 text-center">
          <p className="text-2xl font-black text-navy-900">{completedCount}/{DAYS.length}</p>
          <p className="text-[11px] font-bold uppercase text-slate-400">Días completados</p>
        </div>
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

      <WeeklyProgress checked={checked} />
      <StreakCalendar completedDates={completedDates} />
      <AchievementsGrid stats={stats} />

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
