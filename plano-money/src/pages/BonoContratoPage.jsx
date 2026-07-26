import { useState } from 'react'
import { Check } from 'lucide-react'
import ContentGate from '../components/content/ContentGate.jsx'
import Logo from '../components/Logo.jsx'
import { toISODate } from '../utils/periods.js'

const SLUG = 'bono-contrato'
const STORAGE_KEY = `plano_money_${SLUG}`

const COMMITMENTS = [
  'Pensar antes de comprar.',
  'Ahorrar antes de gastar.',
  'No comprar por impulso.',
  'Revisar mis finanzas cada semana.',
  'Hablar del dinero sin miedo.',
  'Construir hábitos sostenibles.',
  'Dejar de compararme con otras personas.',
  'Recordar que cada dólar tiene un propósito.',
]

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}
  } catch {
    return {}
  }
}

function addMonths(dateStr, months) {
  const d = new Date(dateStr)
  d.setMonth(d.getMonth() + months)
  return toISODate(d)
}

function ContratoContent() {
  const [state, setState] = useState(loadState)
  const set = (field, value) => {
    const next = { ...state, [field]: value }
    setState(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  const checked = new Set(state.commitments || [])
  const toggleCommitment = c => {
    const next = new Set(checked)
    next.has(c) ? next.delete(c) : next.add(c)
    set('commitments', [...next])
  }

  const today = toISODate(new Date())
  const signed = !!state.signature

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 print:bg-white">
      <div className="max-w-lg w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-5 print:shadow-none print:border-0">
        <div className="text-center">
          <Logo className="w-14 h-14 mx-auto mb-3" />
          <p className="text-xs font-bold uppercase text-brand-600">Contrato</p>
          <h1 className="text-xl sm:text-2xl font-black text-navy-900">Mi Nueva Relación con el Dinero</h1>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-700 mb-1">Yo</p>
          <input
            type="text"
            value={state.name || ''}
            onChange={e => set('name', e.target.value)}
            placeholder="Tu nombre"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
          />
        </div>

        <p className="text-sm text-slate-600">Decido cambiar mi relación con el dinero. A partir de hoy me comprometo a:</p>

        <div className="space-y-1.5">
          {COMMITMENTS.map(c => (
            <label key={c} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input type="checkbox" checked={checked.has(c)} onChange={() => toggleCommitment(c)} className="w-4 h-4 rounded accent-brand-500" />
              {c}
            </label>
          ))}
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-700 mb-1">Mis tres metas</p>
          {[0, 1, 2].map(i => (
            <input
              key={i}
              type="text"
              value={state[`goal${i}`] || ''}
              onChange={e => set(`goal${i}`, e.target.value)}
              placeholder={`Meta ${i + 1}`}
              className="w-full px-3 py-2 mb-1.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
            />
          ))}
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-700 mb-1">El hábito que comenzaré hoy</p>
          <input type="text" value={state.habit || ''} onChange={e => set('habit', e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-700 mb-1">Mi recompensa cuando cumpla mi primera meta</p>
          <input type="text" value={state.reward || ''} onChange={e => set('reward', e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
        </div>

        <div className="border-t border-slate-100 pt-4">
          <p className="text-sm font-semibold text-slate-700 mb-1">Mi firma</p>
          <input
            type="text"
            value={state.signature || ''}
            onChange={e => set('signature', e.target.value)}
            placeholder="Escribí tu nombre completo como firma"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-signature italic"
          />
          <p className="text-xs text-slate-400 mt-2">Fecha: {today} · Revisión en 90 días: {addMonths(today, 3)}</p>
        </div>

        {signed && (
          <div className="text-center p-3 bg-emerald-50 border border-emerald-200 rounded-xl print:hidden">
            <p className="text-sm font-bold text-emerald-700 flex items-center justify-center gap-2"><Check className="w-4 h-4" /> Contrato firmado</p>
          </div>
        )}

        <button onClick={() => window.print()} className="w-full bg-navy-900 hover:bg-navy-800 text-white font-bold py-3 rounded-xl text-sm print:hidden">
          Guardar como PDF
        </button>
      </div>
    </div>
  )
}

export default function BonoContratoPage() {
  return (
    <ContentGate slug={SLUG}>
      <ContratoContent />
    </ContentGate>
  )
}
