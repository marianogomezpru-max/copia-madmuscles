import { useState } from 'react'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'
import ContentGate from '../components/content/ContentGate.jsx'
import Logo from '../components/Logo.jsx'
import { toISODate } from '../utils/periods.js'

const SLUG = 'bono-diario'
const STORAGE_KEY = `plano_money_${SLUG}`
const FEELINGS = ['Feliz', 'Triste', 'Ansioso', 'Aburrido', 'Estresado', 'Cansado', 'Celebrando', 'Otro']

function loadEntries() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}
  } catch {
    return {}
  }
}

function DayForm({ day, entry, onChange }) {
  const set = (field, value) => onChange({ ...entry, [field]: value })

  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div>
        <p className="text-xs font-bold uppercase text-brand-600">Día {day}</p>
        <input
          type="date"
          value={entry.date || toISODate(new Date())}
          onChange={e => set('date', e.target.value)}
          className="mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
        />
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-700 mb-1">¿Qué compraste hoy?</p>
        <input type="text" value={entry.what || ''} onChange={e => set('what', e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-700 mb-1">Monto</p>
        <input type="text" value={entry.amount || ''} onChange={e => set('amount', e.target.value)} placeholder="$" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-700 mb-1">Antes de comprar me sentía...</p>
        <div className="flex flex-wrap gap-1.5">
          {FEELINGS.map(f => (
            <button
              key={f}
              onClick={() => set('feeling', f)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${entry.feeling === f ? 'bg-brand-500 text-white border-brand-500' : 'bg-white text-slate-600 border-slate-200'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-700 mb-1">¿Realmente lo necesitaba?</p>
        <div className="flex gap-2">
          {['Sí', 'No', 'No estoy seguro'].map(o => (
            <button
              key={o}
              onClick={() => set('needed', o)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${entry.needed === o ? 'bg-navy-900 text-white border-navy-900' : 'bg-white text-slate-600 border-slate-200'}`}
            >
              {o}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-700 mb-1">¿Qué esperabas sentir?</p>
        <textarea value={entry.expected || ''} onChange={e => set('expected', e.target.value)} rows={2} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-700 mb-1">¿Cómo te sentiste después?</p>
        <textarea value={entry.after || ''} onChange={e => set('after', e.target.value)} rows={2} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-700 mb-1">¿Lo volverías a comprar?</p>
        <div className="flex gap-2">
          {['Sí', 'No'].map(o => (
            <button
              key={o}
              onClick={() => set('again', o)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${entry.again === o ? 'bg-navy-900 text-white border-navy-900' : 'bg-white text-slate-600 border-slate-200'}`}
            >
              {o}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-700 mb-1">¿Qué aprendiste hoy?</p>
        <textarea value={entry.lesson || ''} onChange={e => set('lesson', e.target.value)} rows={2} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
      </div>
    </div>
  )
}

function DiarioContent() {
  const [entries, setEntries] = useState(loadEntries)
  const [day, setDay] = useState(1)

  const filledDays = Object.keys(entries).filter(d => entries[d]?.what).length

  const updateDay = data => {
    const next = { ...entries, [day]: data }
    setEntries(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Logo className="w-9 h-9" />
          <div>
            <p className="font-bold text-navy-900">Emoción y Dinero</p>
            <p className="text-xs text-slate-400">{filledDays} de 30 días completados</p>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200">
          <button onClick={() => setDay(d => Math.max(1, d - 1))} disabled={day === 1} className="p-2 text-slate-500 disabled:opacity-30">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <select value={day} onChange={e => setDay(Number(e.target.value))} className="font-bold text-navy-900 text-sm bg-transparent">
            {Array.from({ length: 30 }, (_, i) => i + 1).map(d => (
              <option key={d} value={d}>Día {d} {entries[d]?.what ? '✓' : ''}</option>
            ))}
          </select>
          <button onClick={() => setDay(d => Math.min(30, d + 1))} disabled={day === 30} className="p-2 text-slate-500 disabled:opacity-30">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <DayForm day={day} entry={entries[day] || {}} onChange={updateDay} />

        {filledDays === 30 && (
          <div className="text-center p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
            <p className="font-bold text-emerald-700 flex items-center justify-center gap-2"><Check className="w-4 h-4" /> ¡Completaste los 30 días!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function BonoDiarioPage() {
  return (
    <ContentGate slug={SLUG}>
      <DiarioContent />
    </ContentGate>
  )
}
